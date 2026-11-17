/**
 * The database tables the app syncs with, as plain rows.
 *
 * Everything the sync engine knows about a table is here: its key, the
 * columns that are compared and sent, and who may write a row. The engine
 * itself never names a column.
 */

export type Row = Record<string, unknown>

export type TableName =
  | 'profiles' | 'athlete_identity' | 'athlete_goals' | 'follows'
  | 'courses' | 'course_milestones' | 'course_weeks' | 'course_sessions' | 'course_blocks' | 'course_enrollments'
  | 'workout_logs' | 'workout_log_entries' | 'workout_log_sets'
  | 'evidence' | 'feedback'
  | 'assessment_sessions' | 'assessment_participants' | 'assessment_results' | 'assessment_status'

export interface TableDef {
  name: TableName
  /** Columns that identify a row. For most tables the primary key. */
  key: string[]
  /** Columns compared between device and server, and sent on a write. Includes the key. */
  cols: string[]
  /** Timestamp columns: compared as instants, whatever text the server returns. */
  ts?: string[]
  /** Columns sent on a write but never compared: the server or another writer owns their value. */
  extra?: string[]
}

/**
 * In dependency order: a table only refers to tables above it, so writes go
 * top to bottom and deletes bottom to top.
 *
 * `assessment_status` is not a table. It is the `status` of an assessment
 * session, kept apart because it only changes through `finalise_assessment()`.
 */
export const TABLES: TableDef[] = [
  // Roles are granted on the server (coach access by request, admin by hand) and never sent from a device.
  { name: 'profiles', key: ['id'], cols: ['id', 'name', 'handle', 'bio', 'weekly_target', 'equipment'] },
  {
    name: 'athlete_identity', key: ['athlete_id'],
    cols: ['athlete_id', 'origin', 'city', 'environments', 'open_to_train', 'origin_audience', 'base_audience', 'places_audience', 'visits_audience'],
  },
  { name: 'athlete_goals', key: ['athlete_id', 'skill_id'], cols: ['athlete_id', 'skill_id'] },
  { name: 'follows', key: ['follower_id', 'followee_id'], cols: ['follower_id', 'followee_id'] },
  { name: 'courses', key: ['id'], cols: ['id', 'coach_id', 'title', 'tagline', 'description', 'focus', 'format', 'status', 'start_date'] },
  { name: 'course_milestones', key: ['course_id', 'skill_id'], cols: ['course_id', 'skill_id'] },
  { name: 'course_weeks', key: ['id'], cols: ['id', 'course_id', 'position', 'title', 'objective', 'kind', 'focus'] },
  { name: 'course_sessions', key: ['id'], cols: ['id', 'week_id', 'day', 'title'] },
  {
    name: 'course_blocks', key: ['id'],
    cols: ['id', 'session_id', 'position', 'kind', 'exercise_id', 'progression_id', 'level', 'min_level', 'max_level', 'sets', 'target', 'rest', 'note', 'is_primary'],
  },
  // Keyed by the pair, not the id: the server creates enrolments too (joining, finalising).
  { name: 'course_enrollments', key: ['course_id', 'athlete_id'], cols: ['course_id', 'athlete_id', 'status'], extra: ['joined_at'] },
  {
    name: 'workout_logs', key: ['id'],
    cols: ['id', 'athlete_id', 'title', 'source_type', 'course_id', 'session_id', 'source_ref', 'started_at', 'finished_at', 'rpe', 'note'],
    ts: ['started_at', 'finished_at'],
  },
  {
    name: 'workout_log_entries', key: ['id'],
    cols: ['id', 'log_id', 'position', 'kind', 'block_id', 'progression_id', 'assigned_exercise_id', 'assigned_level', 'assigned_target', 'exercise_id', 'level', 'target', 'rest'],
  },
  { name: 'workout_log_sets', key: ['entry_id', 'position'], cols: ['entry_id', 'position', 'exercise_id', 'level', 'value'] },
  {
    name: 'evidence', key: ['id'],
    cols: ['id', 'athlete_id', 'exercise_id', 'value', 'tier', 'source', 'log_id', 'note', 'performed_at', 'observed_by', 'assessment_id', 'verified_by', 'verified_at'],
    ts: ['performed_at', 'verified_at'],
  },
  { name: 'feedback', key: ['id'], cols: ['id', 'log_id', 'coach_id', 'athlete_id', 'body', 'created_at'], ts: ['created_at'] },
  {
    name: 'assessment_sessions', key: ['id'],
    cols: ['id', 'owner_id', 'solo', 'protocol', 'kind', 'title', 'group_name', 'course_id', 'baseline_id', 'stations', 'station_minutes', 'rotation_started_at', 'invite_token', 'created_at', 'mode', 'groups'],
    ts: ['rotation_started_at', 'created_at'],
  },
  {
    name: 'assessment_participants', key: ['id'],
    cols: ['id', 'session_id', 'athlete_id', 'display_name', 'sharing', 'partner_name', 'skipped', 'flags', 'joined_at', 'submitted_at', 'group_no'],
    ts: ['joined_at', 'submitted_at'],
  },
  {
    name: 'assessment_results', key: ['participant_id', 'test_id'],
    cols: ['participant_id', 'test_id', 'value', 'skipped', 'tier', 'recorded_at'],
    ts: ['recorded_at'], extra: ['demonstrates', 'recorded_by'],
  },
  { name: 'assessment_status', key: ['id'], cols: ['id', 'status'] },
]

export const tableByName = Object.fromEntries(TABLES.map((t) => [t.name, t])) as Record<TableName, TableDef>

export type RowSet = Record<TableName, Map<string, Row>>

export const emptyRowSet = (): RowSet => Object.fromEntries(TABLES.map((t) => [t.name, new Map<string, Row>()])) as RowSet

export const keyOf = (def: TableDef, row: Row) => def.key.map((k) => String(row[k])).join('|')

export const put = (set: RowSet, table: TableName, row: Row) => set[table].set(keyOf(tableByName[table], row), row)

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const isUuid = (v: unknown): v is string => typeof v === 'string' && UUID.test(v)

/** A timestamp as the instant it names, so `…+00:00` and `…Z` compare equal. */
export const instant = (v: unknown): string | null => {
  if (v === null || v === undefined || v === '') return null
  const t = new Date(String(v)).getTime()
  return Number.isNaN(t) ? null : new Date(t).toISOString()
}

const stable = (v: unknown): unknown => {
  if (v === undefined) return null
  if (Array.isArray(v)) return v.map(stable)
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, stable((v as Row)[k])]))
  return v
}

/** The compared columns of a row, in a fixed order and form. */
export function canonical(def: TableDef, row: Row): string {
  return JSON.stringify(def.cols.map((c) => (def.ts?.includes(c) ? instant(row[c]) : stable(row[c]))))
}

/** A short fingerprint of a row's compared columns (cyrb53). */
export function fingerprint(def: TableDef, row: Row): string {
  const s = canonical(def, row)
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 2654435761)
    h2 = Math.imul(h2 ^ c, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

/** What is sent to the server for a row: compared columns plus the extras. */
export function wire(def: TableDef, row: Row): Row {
  const out: Row = {}
  for (const c of [...def.cols, ...(def.extra ?? [])]) out[c] = row[c] === undefined ? null : row[c]
  return out
}

// ── Who may write what ───────────────────────────────────────────────────

/**
 * How this account may write a row. Mirrors the row-level rules in
 * supabase/migrations; the server decides, this only stops the engine from
 * sending writes that would be refused.
 *   full   – insert, update and delete
 *   update – an existing row only (a participant's own row in a coach's session)
 *   insert – add and remove, never change (evidence)
 *   verify – a coach confirming an athlete's evidence, through verify_evidence()
 */
export type Access = 'full' | 'update' | 'insert' | 'verify' | null

export function accessTo(table: TableName, row: Row, set: RowSet, uid: string): Access {
  const full = (yes: unknown): Access => (yes ? 'full' : null)
  const course = (id: unknown) => set.courses.get(String(id))
  const week = (id: unknown) => set.course_weeks.get(String(id))
  const session = (id: unknown) => set.course_sessions.get(String(id))
  const log = (id: unknown) => set.workout_logs.get(String(id))
  const assessment = (id: unknown) => set.assessment_sessions.get(String(id))
  const open = (id: unknown) => set.assessment_status.get(String(id))?.status !== 'finalised'

  switch (table) {
    case 'profiles': return full(row.id === uid)
    case 'athlete_identity':
    case 'athlete_goals': return full(row.athlete_id === uid)
    case 'follows': return full(row.follower_id === uid)
    case 'courses': return full(row.coach_id === uid)
    case 'course_milestones':
    case 'course_weeks': return full(course(row.course_id)?.coach_id === uid)
    case 'course_sessions': return full(course(week(row.week_id)?.course_id)?.coach_id === uid)
    case 'course_blocks': return full(course(week(session(row.session_id)?.week_id)?.course_id)?.coach_id === uid)
    case 'course_enrollments': return full(row.athlete_id === uid || course(row.course_id)?.coach_id === uid)
    case 'workout_logs': return full(row.athlete_id === uid)
    case 'workout_log_entries': return full(log(row.log_id)?.athlete_id === uid)
    case 'workout_log_sets': return full(log(set.workout_log_entries.get(String(row.entry_id))?.log_id)?.athlete_id === uid)
    case 'evidence':
      // Assessment evidence is written by the server when a session is finalised.
      if (row.source === 'assessment') return null
      if (row.athlete_id === uid) return row.tier === 'estimated' || row.tier === 'self' ? 'insert' : null
      return row.verified_by === uid && (row.tier === 'coach' || row.tier === 'video') ? 'verify' : null
    case 'feedback': return full(row.coach_id === uid)
    case 'assessment_sessions':
    case 'assessment_status': return full((table === 'assessment_status' ? assessment(row.id)?.owner_id : row.owner_id) === uid)
    case 'assessment_participants':
      if (assessment(row.session_id)?.owner_id === uid) return 'full'
      return row.athlete_id === uid ? 'update' : null
    case 'assessment_results': {
      const p = set.assessment_participants.get(String(row.participant_id))
      if (!p) return null
      // Your own results are yours while the session is open, and always self-reported.
      if (p.athlete_id === uid) return open(p.session_id) && row.tier === 'self' ? 'full' : null
      return full(assessment(p.session_id)?.owner_id === uid)
    }
  }
}
