import type { SupabaseClient } from '@supabase/supabase-js'
import { RemoteError, type Remote, type Scope } from './engine'
import { emptyRowSet, put, tableByName, type Row, type RowSet, type TableName } from './rows'

/** The database as the sync engine needs it, over Supabase's REST interface. */

const PAGE = 1000

interface Failure { message: string; code?: string }

/** Offline, timed out, signed-out-for-a-moment or the server having a bad day: try again later. */
export function toRemoteError(error: Failure, status: number | undefined): RemoteError {
  const transient = !status || status >= 500 || status === 401 || status === 408 || status === 429 || /fetch|network|timeout|load failed/i.test(error.message)
  return new RemoteError(error.message, transient, error.code)
}

type Answer = { data: unknown; error: Failure | null; status?: number }

async function run(query: PromiseLike<Answer>): Promise<Row[]> {
  let answer: Answer
  try {
    answer = await query
  } catch (e) {
    throw new RemoteError(e instanceof Error ? e.message : String(e), true)
  }
  if (answer.error) throw toRemoteError(answer.error, answer.status)
  return (answer.data as Row[] | null) ?? []
}

export function supabaseRemote(client: SupabaseClient): Remote {
  /** Every row a query matches, a page at a time: the server caps one answer at 1,000 rows. */
  async function all(table: string, select: string, order: string[], filter?: (q: any) => any): Promise<Row[]> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const out: Row[] = []
    for (let from = 0; ; from += PAGE) {
      let q: any = client.from(table).select(select) // eslint-disable-line @typescript-eslint/no-explicit-any
      if (filter) q = filter(q)
      for (const column of order) q = q.order(column)
      const page = await run(q.range(from, from + PAGE - 1))
      out.push(...page)
      if (page.length < PAGE) return out
    }
  }

  async function profiles(ids: string[]): Promise<Row[]> {
    const out: Row[] = []
    for (let at = 0; at < ids.length; at += 100) out.push(...(await all('profiles', '*', ['id'], (q) => q.in('id', ids.slice(at, at + 100)))))
    return out
  }

  async function assessments(set: RowSet) {
    const [sessions, participants, results] = await Promise.all([
      all('assessment_sessions', '*', ['id']),
      all('assessment_participants', '*', ['id']),
      all('assessment_results', '*', ['participant_id', 'test_id']),
    ])
    for (const { status, finalised_at, ...row } of sessions) {
      put(set, 'assessment_sessions', row)
      put(set, 'assessment_status', { id: row.id, status, finalised_at })
    }
    for (const row of participants) put(set, 'assessment_participants', row)
    for (const row of results) put(set, 'assessment_results', row)
  }

  return {
    async pull(scope: Scope, uid: string, known: string[]) {
      const set = emptyRowSet()
      const people = new Set(known)
      const note = (v: unknown) => { if (typeof v === 'string' && v) people.add(v) }

      if (scope === 'all') {
        const [identity, goals, follows, courses, enrollments, logs, evidence, feedback] = await Promise.all([
          all('athlete_identity', '*', ['athlete_id'], (q) => q.eq('athlete_id', uid)),
          all('athlete_goals', '*', ['skill_id'], (q) => q.eq('athlete_id', uid)),
          all('follows', '*', ['followee_id'], (q) => q.eq('follower_id', uid)),
          all('courses', '*, course_milestones(*), course_weeks(*, course_sessions(*, course_blocks(*)))', ['id']),
          all('course_enrollments', '*', ['id']),
          all('workout_logs', '*, workout_log_entries(*, workout_log_sets(*))', ['id']),
          all('evidence', '*', ['id']),
          all('feedback', '*', ['id']),
          assessments(set),
        ])
        for (const row of identity) put(set, 'athlete_identity', row)
        for (const row of goals) put(set, 'athlete_goals', row)
        for (const row of follows) { put(set, 'follows', row); note(row.followee_id) }
        for (const { course_milestones, course_weeks, ...course } of courses) {
          put(set, 'courses', course)
          note(course.coach_id)
          for (const m of (course_milestones as Row[]) ?? []) put(set, 'course_milestones', m)
          for (const { course_sessions, ...week } of (course_weeks as Row[]) ?? []) {
            put(set, 'course_weeks', week)
            for (const { course_blocks, ...session } of (course_sessions as Row[]) ?? []) {
              put(set, 'course_sessions', session)
              for (const block of (course_blocks as Row[]) ?? []) put(set, 'course_blocks', block)
            }
          }
        }
        for (const row of enrollments) { put(set, 'course_enrollments', row); note(row.athlete_id) }
        for (const { workout_log_entries, ...log } of logs) {
          put(set, 'workout_logs', log)
          note(log.athlete_id)
          for (const { workout_log_sets, ...entry } of (workout_log_entries as Row[]) ?? []) {
            put(set, 'workout_log_entries', entry)
            for (const s of (workout_log_sets as Row[]) ?? []) put(set, 'workout_log_sets', s)
          }
        }
        for (const row of evidence) { put(set, 'evidence', row); note(row.athlete_id) }
        for (const row of feedback) { put(set, 'feedback', row); note(row.coach_id); note(row.athlete_id) }
        // A coach also sees what their students are working toward.
        const mineCourses = new Set(courses.filter((c) => c.coach_id === uid).map((c) => String(c.id)))
        const students = [...new Set(enrollments.filter((e) => mineCourses.has(String(e.course_id))).map((e) => String(e.athlete_id)))].filter((id) => id !== uid)
        for (let at = 0; at < students.length; at += 100) {
          for (const row of await all('athlete_goals', '*', ['athlete_id', 'skill_id'], (q) => q.in('athlete_id', students.slice(at, at + 100)))) put(set, 'athlete_goals', row)
        }
      } else {
        await assessments(set)
      }

      for (const row of set.assessment_sessions.values()) note(row.owner_id)
      for (const row of set.assessment_participants.values()) note(row.athlete_id)
      for (const row of await profiles([...people])) put(set, 'profiles', row)

      if (scope === 'all') return set
      const { profiles: p, assessment_sessions, assessment_status, assessment_participants, assessment_results } = set
      return { profiles: p, assessment_sessions, assessment_status, assessment_participants, assessment_results }
    },

    async write(table: TableName, rows: Row[], access) {
      if (table === 'assessment_status') {
        // The status of a session only moves one way, through the server's own function.
        for (const row of rows) if (row.status === 'finalised') await run(client.rpc('finalise_assessment', { s: row.id }))
        return
      }
      if (access === 'verify') {
        for (const row of rows) await run(client.rpc('verify_evidence', { target: row.id, as_tier: row.tier }))
        return
      }
      if (access === 'update') {
        // A row this account may change but not create: an upsert would be refused as an insert.
        for (const row of rows) {
          const { id, session_id: _s, athlete_id: _a, joined_at: _j, ...changes } = row
          await run(client.from(table).update(changes).eq('id', id as string))
        }
        return
      }
      const key = tableByName[table].key.join(',')
      // No rows are asked back: reading a row back is checked separately by the server and is not needed here.
      await run(client.from(table).upsert(rows, { onConflict: key, ignoreDuplicates: access === 'insert' }))
    },

    async remove(table: TableName, keys: Row[]) {
      if (table === 'assessment_status' || keys.length === 0) return
      const def = tableByName[table]
      if (def.key.length === 1) {
        await run(client.from(table).delete().in(def.key[0], keys.map((k) => k[def.key[0]] as string)))
        return
      }
      for (const k of keys) await run(client.from(table).delete().match(k))
    },

    async finalise(sessionId: string) {
      await run(client.rpc('finalise_assessment', { s: sessionId }))
    },
  }
}
