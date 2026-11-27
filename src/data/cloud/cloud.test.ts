import { describe, expect, it } from 'vitest'
import type { AssessmentParticipant, AssessmentSession, Athlete, Evidence } from '@/domain/types'
import { PROTOCOL } from '@/domain/assessment'
import { COURSE_TEMPLATES, courseFromTemplate, uid as newId } from '../courseTemplates'
import { ME, buildWorld } from '../seed'
import { RemoteError, createEngine, type Host, type Remote, type Scope, type Shadow } from './engine'
import { adopt, build, derivedEvidence, project, type Synced } from './mappers'
import { TABLES, accessTo, emptyRowSet, fingerprint, keyOf, tableByName, type Row, type RowSet, type TableName } from './rows'

const COACH = '11111111-1111-4111-8111-111111111111'
const ANA = '22222222-2222-4222-8222-222222222222'
const BEN = '33333333-3333-4333-8333-333333333333'

const blank = (): Synced => ({ athletes: {}, evidence: [], logs: [], courses: [], enrollments: [], feedback: [], following: [], assessments: [], participants: [] })
const athlete = (id: string, name: string, extra: Partial<Athlete> = {}): Athlete => ({
  id, name, handle: name.toLowerCase(), bio: '', roles: ['athlete'], goals: [], joinedAt: '2026-11-01T09:00:00.000Z', weeklyTarget: 3, equipment: ['floor'], ...extra,
})

/** All fingerprints of a row set, for comparing two of them. */
const prints = (set: RowSet) => {
  const out: Record<string, string> = {}
  for (const def of TABLES) for (const [key, row] of set[def.name]) out[`${def.name}/${key}`] = fingerprint(def, row)
  return out
}

// ── A pretend server ─────────────────────────────────────────────────────

class Server {
  rows = emptyRowSet()
  writes = 0
  offline = false
  /** Rows this pretend server refuses, like a database constraint would. */
  refuse: (table: TableName, row: Row) => boolean = () => false

  remoteFor(uid: string): Remote {
    const guard = () => { if (this.offline) throw new RemoteError('Failed to fetch', true) }
    return {
      pull: async (scope: Scope, _uid: string, profiles: string[]) => {
        guard()
        const out = emptyRowSet()
        const assess: TableName[] = ['assessment_sessions', 'assessment_status', 'assessment_participants', 'assessment_results']
        for (const def of TABLES) {
          if (def.name === 'profiles' || (scope === 'assess' && !assess.includes(def.name))) continue
          for (const [k, r] of this.rows[def.name]) if (this.visible(def.name, r, uid)) out[def.name].set(k, structuredClone(r))
        }
        const people = new Set(profiles)
        for (const r of out.assessment_sessions.values()) people.add(String(r.owner_id))
        for (const r of out.assessment_participants.values()) if (r.athlete_id) people.add(String(r.athlete_id))
        for (const r of out.course_enrollments.values()) people.add(String(r.athlete_id))
        for (const r of out.courses.values()) people.add(String(r.coach_id))
        for (const id of people) if (this.rows.profiles.has(id)) out.profiles.set(id, structuredClone(this.rows.profiles.get(id)!))
        if (scope === 'all') return out
        return Object.fromEntries(['profiles', ...assess].map((t) => [t, out[t as TableName]])) as Partial<RowSet>
      },
      write: async (table, rows, access) => {
        guard()
        for (const row of rows) if (this.refuse(table, row)) throw new RemoteError('violates check constraint', false, '23514')
        this.writes += rows.length
        for (const row of rows) {
          const def = tableByName[table]
          const key = keyOf(def, row)
          const was = this.rows[table].get(key)
          if (table === 'assessment_status') {
            if (row.status === 'finalised') this.finalise(String(row.id))
          } else if (access === 'verify') {
            this.rows.evidence.set(key, { ...was, tier: row.tier, verified_by: uid, verified_at: '2026-11-16T12:00:00.000000+00:00' })
          } else if (access === 'insert') {
            if (!was) this.rows[table].set(key, structuredClone(row))
          } else if (access === 'update') {
            if (!was) throw new RemoteError('no such row', false)
            const { id: _i, session_id: _s, athlete_id: _a, joined_at: _j, ...changes } = row
            this.rows[table].set(key, { ...was, ...structuredClone(changes) })
          } else {
            this.rows[table].set(key, { ...was, ...structuredClone(row) })
            if (table === 'assessment_sessions' && !this.rows.assessment_status.has(key)) this.rows.assessment_status.set(key, { id: row.id, status: 'open', finalised_at: null })
          }
        }
      },
      remove: async (table, keys) => {
        guard()
        this.writes += keys.length
        for (const k of keys) this.rows[table].delete(keyOf(tableByName[table], k))
      },
      finalise: async (id) => { guard(); this.finalise(id) },
    }
  }

  /** Close enough to the real rules for the cases below: private things stay with their people. */
  visible(table: TableName, row: Row, uid: string) {
    const session = (id: unknown) => this.rows.assessment_sessions.get(String(id))
    const participant = (id: unknown) => this.rows.assessment_participants.get(String(id))
    const coaches = (athleteId: unknown) => [...this.rows.course_enrollments.values()].some((e) => e.athlete_id === athleteId && this.rows.courses.get(String(e.course_id))?.coach_id === uid)
    if (table === 'evidence') return row.athlete_id === uid || coaches(row.athlete_id)
    if (table === 'assessment_results') return participant(row.participant_id)?.athlete_id === uid || session(participant(row.participant_id)?.session_id)?.owner_id === uid
    if (table === 'assessment_participants') return row.athlete_id === uid || session(row.session_id)?.owner_id === uid
    if (table === 'assessment_sessions' || table === 'assessment_status') {
      const id = table === 'assessment_status' ? row.id : row.id
      return session(id)?.owner_id === uid || [...this.rows.assessment_participants.values()].some((p) => p.session_id === id && p.athlete_id === uid)
    }
    if (table === 'course_enrollments') return row.athlete_id === uid || this.rows.courses.get(String(row.course_id))?.coach_id === uid
    if (table === 'athlete_identity' || table === 'athlete_goals') return row.athlete_id === uid
    if (table === 'follows') return row.follower_id === uid
    return true
  }

  /** What finalise_assessment() does: results become evidence, participants join the course. */
  finalise(id: string) {
    const s = this.rows.assessment_sessions.get(id)!
    this.rows.assessment_status.set(id, { id, status: 'finalised', finalised_at: '2026-11-16T12:00:00.123456+00:00' })
    for (const [k, e] of this.rows.evidence) if (e.assessment_id === id) this.rows.evidence.delete(k)
    for (const p of this.rows.assessment_participants.values()) {
      if (p.session_id !== id || !p.athlete_id) continue
      for (const r of this.rows.assessment_results.values()) {
        if (r.participant_id !== p.id || r.skipped) continue
        for (const [exercise_id, value] of r.demonstrates as [string, number][]) {
          const own = p.athlete_id === s.owner_id
          const eid = newId()
          this.rows.evidence.set(eid, {
            id: eid, athlete_id: p.athlete_id, exercise_id, value, tier: own ? 'self' : r.tier, source: 'assessment', log_id: null, note: null, performed_at: r.recorded_at,
            observed_by: !own && r.tier === 'observed' ? s.owner_id : null, assessment_id: id, verified_by: !own && r.tier === 'coach' ? s.owner_id : null,
            verified_at: !own && r.tier === 'coach' ? '2026-11-16T12:00:00+00:00' : null,
          })
        }
      }
      if (s.course_id && p.athlete_id !== s.owner_id) {
        const key = `${s.course_id}|${p.athlete_id}`
        if (!this.rows.course_enrollments.has(key)) this.rows.course_enrollments.set(key, { id: newId(), course_id: s.course_id, athlete_id: p.athlete_id, status: 'active', joined_at: '2026-11-16T12:00:00+00:00' })
      }
    }
  }

  /** What join_assessment() does. */
  join(sessionId: string, athleteId: string, name: string) {
    const id = newId()
    this.rows.assessment_participants.set(id, { id, session_id: sessionId, athlete_id: athleteId, display_name: name, sharing: 'coach', partner_name: null, skipped: [], flags: [], joined_at: '2026-11-16T10:00:00.654321+00:00', submitted_at: null })
    return id
  }
}

function device(server: Server, uid: string, start: Synced = blank()) {
  const state: Synced & { cloudShadow: Shadow } = { ...start, cloudShadow: {} }
  const host: Host = { get: () => state, set: (patch) => Object.assign(state, patch) }
  const engine = createEngine(server.remoteFor(uid), uid, host)
  const sync = async (scope: Scope = 'all') => { engine.request(scope); await engine.settled() }
  return { state, engine, sync, edit: (fn: (s: Synced) => void) => fn(state) }
}

const signUp = (server: Server, a: Athlete) => server.rows.profiles.set(a.id, { id: a.id, name: a.name, handle: null, bio: '', roles: ['athlete'], weekly_target: 3, equipment: [], created_at: '2026-11-10T08:00:00.123456+00:00' })

// ── Rows ─────────────────────────────────────────────────────────────────

describe('state and rows', () => {
  const world = buildWorld(new Date('2026-11-16T10:00:00Z'), true)
  const mine = adopt(world, ME, COACH, newId)

  it('moves a device’s own data into an account and leaves the sample athletes behind', () => {
    expect(Object.keys(mine.athletes)).toEqual([COACH])
    expect(mine.evidence.length).toBeGreaterThan(20)
    expect(mine.evidence.every((e) => e.athleteId === COACH && (e.tier === 'self' || e.tier === 'estimated'))).toBe(true)
    expect(mine.logs.length).toBeGreaterThan(5)
    expect(mine.logs.every((l) => l.athleteId === COACH)).toBe(true)
    expect(mine.courses.every((c) => c.coachId === COACH)).toBe(true)
    // Sample sessions and the people in them do not follow.
    expect(mine.assessments).toEqual([])
    expect(mine.feedback).toEqual([])
  })

  it('survives the round trip to rows and back unchanged', () => {
    const rows = project(mine, COACH)
    expect(rows.courses.size).toBe(mine.courses.length)
    expect(rows.course_blocks.size).toBeGreaterThan(50)
    expect(rows.workout_log_sets.size).toBeGreaterThan(50)
    const rebuilt = build(rows, COACH, blank())
    expect(prints(project(rebuilt, COACH))).toEqual(prints(rows))
    expect(rebuilt.courses[0].weeks.map((w) => w.title)).toEqual(mine.courses[0].weeks.map((w) => w.title))
    expect(rebuilt.courses[0].weeks[0].sessions[0].blocks.map((b) => b.exerciseId)).toEqual(mine.courses[0].weeks[0].sessions[0].blocks.map((b) => b.exerciseId))
  })

  it('carries a coach’s own name and unit for an exercise, on the course and on the log', () => {
    const named = structuredClone(mine)
    const block = named.courses[0].weeks[0].sessions[0].blocks[0]
    block.title = 'Wrist preparation + warm up'
    block.metric = block.metric === 'hold' ? 'reps' : 'hold'
    const entry = named.logs[0].entries[0]
    entry.title = block.title
    entry.metric = 'hold'
    const rebuilt = build(project(named, COACH), COACH, blank())
    const back = rebuilt.courses[0].weeks[0].sessions[0].blocks[0]
    expect([back.title, back.metric]).toEqual([block.title, block.metric])
    const log = rebuilt.logs.find((l) => l.id === named.logs[0].id)!
    expect([log.entries[0].title, log.entries[0].metric]).toEqual([entry.title, 'hold'])
  })

  it('carries a closed course link, and opens it again', () => {
    const closed = structuredClone(mine)
    closed.courses[0].linkClosed = true
    const rows = project(closed, COACH)
    expect(rows.courses.get(closed.courses[0].id)?.link_open).toBe(false)
    const back = build(rows, COACH, blank())
    expect(back.courses[0].linkClosed).toBe(true)
    const reopened = build(project(mine, COACH), COACH, back)
    expect(reopened.courses[0].linkClosed).toBeUndefined()
  })

  it('keeps the objects the app already holds when nothing changed', () => {
    const again = build(project(mine, COACH), COACH, mine)
    expect(again.courses[0]).toBe(mine.courses[0])
    expect(again.logs[0]).toBe(mine.logs[0])
    expect(again.evidence[0]).toBe(mine.evidence.slice().sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))[0])
    expect(again.athletes[COACH]).toBe(mine.athletes[COACH])
  })

  it('treats the same instant written two ways as equal', () => {
    const def = tableByName.evidence
    const row = { id: newId(), athlete_id: ANA, exercise_id: 'pushup', value: 10, tier: 'self', source: 'manual', log_id: null, note: null, performed_at: '2026-11-16T10:00:00.000Z', observed_by: null, assessment_id: null, verified_by: null, verified_at: null }
    expect(fingerprint(def, { ...row, performed_at: '2026-11-16T10:00:00+00:00' })).toBe(fingerprint(def, row))
    expect(fingerprint(def, { ...row, value: 11 })).not.toBe(fingerprint(def, row))
  })

  it('knows what each account may write', () => {
    const s = blank()
    s.athletes = { [COACH]: athlete(COACH, 'Coach', { roles: ['athlete', 'coach'] }), [ANA]: athlete(ANA, 'Ana') }
    s.courses = [courseFromTemplate(COURSE_TEMPLATES[0].id, COACH, '2026-11-16')]
    const sessionId = newId()
    const pid = newId()
    s.assessments = [{ id: sessionId, protocol: PROTOCOL, title: 'Baseline', kind: 'baseline', groupName: 'G', coachId: COACH, coachName: 'Coach', stations: ['push'], status: 'open', origin: 'invite', createdAt: '2026-11-16T10:00:00.000Z', stationMinutes: 6 }]
    s.participants = [{ id: pid, sessionId, athleteId: ANA, name: 'Ana', joinedAt: '2026-11-16T10:00:00.000Z', via: 'self', sharing: 'coach', results: { pushup: { value: 12, tier: 'self', at: '2026-11-16T10:05:00.000Z' } }, skipped: [], flags: [] }]
    s.evidence = [
      { id: newId(), athleteId: ANA, exerciseId: 'pushup', value: 12, tier: 'self', source: 'manual', date: '2026-11-16T10:00:00.000Z' },
      { id: newId(), athleteId: ANA, exerciseId: 'pushup', value: 12, tier: 'self', source: 'assessment', date: '2026-11-16T10:00:00.000Z', assessmentId: sessionId },
    ]
    const rows = project(s, ANA)
    const can = (table: TableName, uid: string) => [...rows[table].values()].map((r) => accessTo(table, r, rows, uid))
    expect(accessTo('profiles', rows.profiles.get(ANA)!, rows, ANA)).toBe('full')
    expect(accessTo('profiles', rows.profiles.get(COACH)!, rows, ANA)).toBe(null)
    expect(can('course_blocks', ANA).every((a) => a === null)).toBe(true)
    expect(can('course_blocks', COACH).every((a) => a === 'full')).toBe(true)
    // A participant may change their own row but did not create it; the coach owns the session.
    expect(can('assessment_participants', ANA)).toEqual(['update'])
    expect(can('assessment_participants', COACH)).toEqual(['full'])
    expect(can('assessment_results', ANA)).toEqual(['full'])
    expect(can('assessment_results', BEN)).toEqual([null])
    // Evidence: your own self-reported records, never what an assessment wrote.
    expect(can('evidence', ANA)).toEqual(['insert', null])
    expect(can('evidence', COACH)).toEqual([null, null])
  })
})

// ── Two devices, one server ──────────────────────────────────────────────

describe('sync', () => {
  const seedCoach = () => {
    const s = blank()
    s.athletes = { [COACH]: athlete(COACH, 'Coach', { roles: ['athlete', 'coach'], goals: ['push-10'] }) }
    s.courses = [courseFromTemplate(COURSE_TEMPLATES[0].id, COACH, '2026-11-16', { status: 'active' })]
    s.evidence = [{ id: newId(), athleteId: COACH, exerciseId: 'pushup', value: 30, tier: 'self', source: 'manual', date: '2026-11-15T10:00:00.000Z' }]
    return s
  }

  it('sends a device’s data up and brings it down on another device', async () => {
    const server = new Server()
    const laptop = device(server, COACH, seedCoach())
    await laptop.sync()
    expect(server.rows.courses.size).toBe(1)
    expect(server.rows.course_blocks.size).toBeGreaterThan(40)
    expect(server.rows.evidence.size).toBe(1)
    expect(server.rows.athlete_goals.size).toBe(1)

    const phone = device(server, COACH)
    await phone.sync()
    expect(phone.state.athletes[COACH].name).toBe('Coach')
    expect(phone.state.athletes[COACH].goals).toEqual(['push-10'])
    expect(phone.state.courses[0].weeks.length).toBe(laptop.state.courses[0].weeks.length)
    expect(phone.state.evidence.map((e) => e.value)).toEqual([30])
  })

  it('writes nothing once both sides agree', async () => {
    const server = new Server()
    const laptop = device(server, COACH, seedCoach())
    await laptop.sync()
    const phone = device(server, COACH)
    await phone.sync()
    server.writes = 0
    await laptop.sync()
    await phone.sync()
    await laptop.sync()
    expect(server.writes).toBe(0)
  })

  it('carries edits and deletions both ways', async () => {
    const server = new Server()
    const laptop = device(server, COACH, seedCoach())
    await laptop.sync()
    const phone = device(server, COACH)
    await phone.sync()

    laptop.edit((s) => { s.courses = [{ ...s.courses[0], title: 'Handstands, properly', weeks: s.courses[0].weeks.slice(0, 2) }] })
    await laptop.sync()
    await phone.sync()
    expect(phone.state.courses[0].title).toBe('Handstands, properly')
    expect(phone.state.courses[0].weeks.length).toBe(2)

    phone.edit((s) => { s.evidence = []; s.athletes = { ...s.athletes, [COACH]: { ...s.athletes[COACH], bio: 'Upside down', goals: [] } } })
    await phone.sync()
    await laptop.sync()
    expect(laptop.state.evidence).toEqual([])
    expect(laptop.state.athletes[COACH].bio).toBe('Upside down')
    expect(laptop.state.athletes[COACH].goals).toEqual([])
    expect(server.rows.evidence.size).toBe(0)
    expect(server.rows.athlete_goals.size).toBe(0)
  })

  it('keeps a change made here through a fetch, and lets the server win everywhere else', async () => {
    const server = new Server()
    const laptop = device(server, COACH, seedCoach())
    await laptop.sync()
    const phone = device(server, COACH)
    await phone.sync()

    // The laptop renames the course; the phone, not having heard, edits the tagline and the bio.
    laptop.edit((s) => { s.courses = [{ ...s.courses[0], title: 'Renamed' }] })
    await laptop.sync()
    server.offline = true
    phone.edit((s) => { s.athletes = { ...s.athletes, [COACH]: { ...s.athletes[COACH], bio: 'Written offline' } } })
    await expect(phone.sync()).rejects.toThrow()
    expect(phone.engine.status().phase).toBe('waiting')
    server.offline = false
    await phone.sync()
    expect(phone.state.courses[0].title).toBe('Renamed')
    expect(phone.state.athletes[COACH].bio).toBe('Written offline')
    expect(server.rows.profiles.get(COACH)!.bio).toBe('Written offline')
    phone.engine.stop()
  })

  it('does not mistake stale data on a second device for new work', async () => {
    const server = new Server()
    const laptop = device(server, COACH, seedCoach())
    await laptop.sync()
    const phone = device(server, COACH)
    await phone.sync()
    const stale = structuredClone(phone.state)

    laptop.edit((s) => { s.courses = [{ ...s.courses[0], title: 'Newer' }]; s.evidence = [] })
    await laptop.sync()

    // The phone wakes up with what it had, including its record of what the server held then.
    const woken = device(server, COACH, stale)
    woken.state.cloudShadow = stale.cloudShadow
    await woken.sync()
    expect(woken.state.courses[0].title).toBe('Newer')
    expect(woken.state.evidence).toEqual([])
    expect(server.rows.courses.get(woken.state.courses[0].id)!.title).toBe('Newer')
  })

  it('leaves a refused change on the device and still sends the rest', async () => {
    const server = new Server()
    const a = device(server, COACH, seedCoach())
    await a.sync()
    server.refuse = (table, row) => table === 'evidence' && row.value === 999
    const good = newId()
    a.edit((s) => {
      s.evidence = [
        ...s.evidence,
        { id: newId(), athleteId: COACH, exerciseId: 'pushup', value: 999, tier: 'self', source: 'manual', date: '2026-11-16T10:00:00.000Z' },
        { id: good, athleteId: COACH, exerciseId: 'pull-up', value: 8, tier: 'self', source: 'manual', date: '2026-11-16T10:01:00.000Z' },
      ]
    })
    const warn = console.warn
    console.warn = () => {}
    await a.sync()
    console.warn = warn
    expect(server.rows.evidence.has(good)).toBe(true)
    expect(server.rows.evidence.size).toBe(2)
    expect(a.state.evidence.length).toBe(3)
    // It is tried once more after each fetch, and reported for as long as the server says no.
    expect(a.engine.status().refused).toBe(1)
    expect(a.engine.status().pending).toBe(1)
  })

  it('never sends a role, and takes the one the server grants', async () => {
    const server = new Server()
    signUp(server, athlete(ANA, 'Ana'))
    const phone = device(server, ANA, { ...blank(), athletes: { [ANA]: athlete(ANA, 'Ana', { handle: 'ana', roles: ['athlete', 'coach'] }) } })
    await phone.sync()
    expect(server.rows.profiles.get(ANA)!.roles).toEqual(['athlete'])
    expect(server.rows.profiles.get(ANA)!.handle).toBe('ana')
    // An admin approves coach access on the server.
    server.rows.profiles.set(ANA, { ...server.rows.profiles.get(ANA)!, roles: ['athlete', 'coach'] })
    phone.edit((s) => { s.athletes = { ...s.athletes, [ANA]: { ...s.athletes[ANA], roles: ['athlete'] } } })
    await phone.sync()
    await phone.sync()
    expect(phone.state.athletes[ANA].roles).toEqual(['athlete', 'coach'])
  })

  it('takes the device’s profile for a brand-new account, and the server’s for an existing one', async () => {
    const server = new Server()
    signUp(server, athlete(COACH, 'Google Name'))
    const fresh = device(server, COACH, { ...blank(), athletes: { [COACH]: athlete(COACH, 'Chosen Name', { handle: 'chosen' }) } })
    await fresh.sync()
    expect(server.rows.profiles.get(COACH)!.name).toBe('Chosen Name')

    const other = device(server, COACH, { ...blank(), athletes: { [COACH]: athlete(COACH, 'Old Device', { handle: 'old' }) } })
    await other.sync()
    expect(other.state.athletes[COACH].name).toBe('Chosen Name')
    expect(server.rows.profiles.get(COACH)!.handle).toBe('chosen')
  })
})

// ── A test day ───────────────────────────────────────────────────────────

describe('a group assessment between accounts', () => {
  const setUp = async () => {
    const server = new Server()
    for (const a of [athlete(COACH, 'Coach'), athlete(ANA, 'Ana'), athlete(BEN, 'Ben')]) signUp(server, a)
    const coachStart = blank()
    coachStart.athletes = { [COACH]: athlete(COACH, 'Coach', { roles: ['athlete', 'coach'] }) }
    coachStart.courses = [courseFromTemplate(COURSE_TEMPLATES[0].id, COACH, '2026-11-16', { status: 'active' })]
    const sessionId = newId()
    const session: AssessmentSession = { id: sessionId, protocol: PROTOCOL, title: 'Baseline', kind: 'baseline', groupName: 'Tuesday group', coachId: COACH, coachName: 'Coach', courseId: coachStart.courses[0].id, stations: ['push', 'pull'], status: 'open', origin: 'local', createdAt: '2026-11-16T09:00:00.000Z', stationMinutes: 6, inviteToken: 'abc' }
    coachStart.assessments = [session]
    const coach = device(server, COACH, coachStart)
    await coach.sync()
    const ana = device(server, ANA)
    const ben = device(server, BEN)
    const anaPid = server.join(sessionId, ANA, 'Ana')
    const benPid = server.join(sessionId, BEN, 'Ben')
    await ana.sync()
    await ben.sync()
    return { server, coach, ana, ben, sessionId, anaPid, benPid }
  }
  const record = (s: Synced, pid: string, test: string, value: number, tier: 'self' | 'observed' | 'coach' = 'self') => {
    s.participants = s.participants.map((p): AssessmentParticipant => (p.id === pid ? { ...p, results: { ...p.results, [test]: { value, tier, at: '2026-11-16T10:10:00.000Z' } } } : p))
  }

  it('shows a joined participant the session, as someone else’s', async () => {
    const { ana, sessionId } = await setUp()
    expect(ana.state.assessments.map((a) => [a.id, a.origin, a.coachName, a.groupName])).toEqual([[sessionId, 'invite', 'Coach', 'Tuesday group']])
    expect(ana.state.participants.map((p) => p.name)).toEqual(['Ana'])
    expect(ana.state.athletes[COACH].name).toBe('Coach')
  })

  it('puts each participant’s results on the coach’s board and nobody else’s phone', async () => {
    const { coach, ana, ben, anaPid, benPid } = await setUp()
    ana.edit((s) => record(s, anaPid, 'pushup', 14))
    ben.edit((s) => record(s, benPid, 'pushup', 3))
    await ana.sync('assess')
    await ben.sync('assess')
    await coach.sync('assess')
    const board = Object.fromEntries(coach.state.participants.map((p) => [p.name, p.results.pushup?.value]))
    expect(board).toEqual({ Ana: 14, Ben: 3 })
    await ana.sync('assess')
    expect(ana.state.participants.map((p) => p.name)).toEqual(['Ana'])
  })

  it('carries the coach’s observation back to the athlete, and a help request to the coach', async () => {
    const { coach, ana, anaPid } = await setUp()
    ana.edit((s) => {
      record(s, anaPid, 'pushup', 14)
      s.participants = s.participants.map((p) => (p.id === anaPid ? { ...p, flags: ['pull'], partner: 'Ben' } : p))
    })
    await ana.sync('assess')
    await coach.sync('assess')
    const seen = coach.state.participants.find((p) => p.id === anaPid)!
    expect(seen.flags).toEqual(['pull'])
    expect(seen.partner).toBe('Ben')

    coach.edit((s) => record(s, anaPid, 'pushup', 14, 'observed'))
    await coach.sync('assess')
    await ana.sync('assess')
    expect(ana.state.participants[0].results.pushup.tier).toBe('observed')
  })

  it('lets the coach record for someone without a phone', async () => {
    const { server, coach, sessionId } = await setUp()
    const pid = newId()
    coach.edit((s) => {
      s.participants = [...s.participants, { id: pid, sessionId, name: 'Carla', joinedAt: '2026-11-16T10:00:00.000Z', via: 'coach', sharing: 'coach', results: { pushup: { value: 9, tier: 'observed', at: '2026-11-16T10:20:00.000Z' } }, skipped: [], flags: [] }]
    })
    await coach.sync('assess')
    expect(server.rows.assessment_participants.get(pid)!.display_name).toBe('Carla')
    expect(server.rows.assessment_results.get(`${pid}|pushup`)!.tier).toBe('observed')
  })

  it('shows an athlete their own results as evidence at once, then the server’s when the coach finalises', async () => {
    const { server, coach, ana, anaPid, sessionId } = await setUp()
    ana.edit((s) => {
      record(s, anaPid, 'pushup', 14)
      s.participants = s.participants.map((p) => (p.id === anaPid ? { ...p, submittedAt: '2026-11-16T10:30:00.000Z' } : p))
    })
    await ana.sync('assess')
    expect(derivedEvidence(ana.state, ANA).map((e) => [e.exerciseId, e.value, e.tier])).toEqual([['pushup', 14, 'self']])
    expect(ana.state.evidence.map((e) => [e.exerciseId, e.tier])).toEqual([['pushup', 'self']])
    expect(server.rows.evidence.size).toBe(0)

    await coach.sync('assess')
    coach.edit((s) => {
      record(s, anaPid, 'pushup', 14, 'coach')
      s.assessments = s.assessments.map((a) => (a.id === sessionId ? { ...a, status: 'finalised', finalisedAt: '2026-11-16T11:00:00.000Z' } : a))
    })
    await coach.sync()
    expect(server.rows.assessment_status.get(sessionId)!.status).toBe('finalised')
    expect([...server.rows.evidence.values()].map((e) => [e.athlete_id, e.exercise_id, e.tier, e.verified_by])).toEqual([[ANA, 'pushup', 'coach', COACH]])
    // Finalising enrols the participants in the linked course, and the coach can now see their evidence.
    expect(coach.state.enrollments.map((e) => e.athleteId).sort()).toEqual([ANA, BEN].sort())
    expect(coach.state.evidence.filter((e) => e.athleteId === ANA).map((e) => e.tier)).toEqual(['coach'])

    // The athlete's phone notices the session closed and replaces its own reading with the verified one.
    await ana.sync('assess')
    expect(ana.state.assessments[0].status).toBe('finalised')
    const mine: Evidence[] = ana.state.evidence
    expect(mine.map((e) => [e.exerciseId, e.value, e.tier, e.verifiedBy])).toEqual([['pushup', 14, 'coach', COACH]])
    expect(ana.state.enrollments.map((e) => e.courseId)).toEqual([coach.state.courses[0].id])
    expect(ana.state.courses.length).toBe(1)
  })

  it('rewrites the evidence when the coach changes a result after finalising', async () => {
    const { server, coach, ana, anaPid, sessionId } = await setUp()
    ana.edit((s) => record(s, anaPid, 'pushup', 14))
    await ana.sync('assess')
    await coach.sync('assess')
    coach.edit((s) => { s.assessments = s.assessments.map((a) => (a.id === sessionId ? { ...a, status: 'finalised', finalisedAt: '2026-11-16T11:00:00.000Z' } : a)) })
    await coach.sync()
    expect([...server.rows.evidence.values()].map((e) => e.tier)).toEqual(['self'])
    coach.edit((s) => record(s, anaPid, 'pushup', 14, 'coach'))
    await coach.sync()
    expect([...server.rows.evidence.values()].map((e) => e.tier)).toEqual(['coach'])
  })

  it('removes a participant everywhere when the coach removes them', async () => {
    const { coach, ben, benPid } = await setUp()
    await coach.sync('assess')
    coach.edit((s) => { s.participants = s.participants.filter((p) => p.id !== benPid) })
    await coach.sync('assess')
    await ben.sync('assess')
    expect(ben.state.participants).toEqual([])
    expect(ben.state.assessments).toEqual([])
  })
})
