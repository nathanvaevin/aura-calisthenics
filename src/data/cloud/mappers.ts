import type {
  AssessmentParticipant, AssessmentResult, AssessmentSession, Athlete, Audience, Course, CourseSession, CourseWeek, DisciplineId, Enrollment, Evidence,
  Feedback, LogEntry, TrainingEnvironment, WorkoutBlock, WorkoutLog, WorkoutSource,
} from '@/domain/types'
import { demonstrated, resultsToEvidence, testById } from '@/domain/assessment'
import { privacyOf } from '@/domain/places'
import { DISCIPLINE_IDS } from '@/domain/catalog'
import { DEFAULT_PERSONAL, personalOf, type Personal } from '@/theme/personal'
import { isThemeId } from '@/theme/themes'
import { emptyRowSet, instant, isUuid, put, type Row, type RowSet } from './rows'

/**
 * The parts of the app's state that live in the database. Everything else
 * (settings, the workout in progress, places and check-ins for now) stays on
 * the device.
 */
export interface Synced {
  athletes: Record<string, Athlete>
  evidence: Evidence[]
  logs: WorkoutLog[]
  courses: Course[]
  enrollments: Enrollment[]
  feedback: Feedback[]
  following: string[]
  assessments: AssessmentSession[]
  participants: AssessmentParticipant[]
}

export const SYNCED_KEYS: (keyof Synced)[] = ['athletes', 'evidence', 'logs', 'courses', 'enrollments', 'feedback', 'following', 'assessments', 'participants']

const HANDLE = /^[a-z0-9_.]{2,30}$/
const orNull = <T>(v: T | undefined | null | ''): T | null => (v === undefined || v === null || v === '' ? null : v)
const opt = <T>(v: unknown): T | undefined => (v === null || v === undefined ? undefined : (v as T))
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)))

const text = (v: string | undefined) => orNull(v?.slice(0, 40))

/** An athlete's personal style as flat columns: each is compared and merged on its own. */
function styleRow(p: Personal): Row {
  return {
    theme: p.theme, persona: orNull(p.character),
    form_aura: text(p.forms.aura), form_power: text(p.forms.power), form_iron: text(p.forms.iron),
    finish_aura: text(p.finishes.aura), finish_power: text(p.finishes.power), finish_iron: text(p.finishes.iron),
    intensity: clamp(p.intensity, 0, 100), show_muscles: p.muscles,
    themed_at: orNull(p.steps.theme), persona_at: orNull(p.steps.character), about_at: orNull(p.steps.about), sharing_at: orNull(p.steps.sharing),
  }
}

function styleFromRow(r: Row): Personal {
  const pick = (a: unknown, b: unknown, c: unknown) => {
    const out: Personal['forms'] = {}
    if (typeof a === 'string') out.aura = a
    if (typeof b === 'string') out.power = b
    if (typeof c === 'string') out.iron = c
    return out
  }
  const steps: Personal['steps'] = {}
  for (const [step, col] of [['theme', 'themed_at'], ['character', 'persona_at'], ['about', 'about_at'], ['sharing', 'sharing_at']] as const) {
    const at = instant(r[col])
    if (at) steps[step] = at
  }
  return {
    theme: isThemeId(r.theme) ? r.theme : DEFAULT_PERSONAL.theme,
    character: r.persona === 'male' || r.persona === 'female' ? r.persona : undefined,
    forms: pick(r.form_aura, r.form_power, r.form_iron), finishes: pick(r.finish_aura, r.finish_power, r.finish_iron),
    intensity: typeof r.intensity === 'number' ? r.intensity : DEFAULT_PERSONAL.intensity,
    muscles: r.show_muscles !== false, steps,
  }
}

/** A log entry has no id of its own on the device; derive a stable one from its log and position. */
export const entryId = (logId: string, position: number) => `${logId.slice(0, 32)}${position.toString(16).padStart(4, '0')}`

// ── State → rows ─────────────────────────────────────────────────────────

/** Every row this device holds, in the shape the database stores it. */
export function project(s: Synced, uid: string): RowSet {
  const set = emptyRowSet()

  for (const a of Object.values(s.athletes)) {
    if (!isUuid(a.id)) continue
    put(set, 'profiles', {
      id: a.id, name: a.name.trim().slice(0, 80) || 'Athlete', handle: HANDLE.test(a.handle) ? a.handle : null, bio: a.bio ?? '', roles: a.roles,
      weekly_target: clamp(a.weeklyTarget, 1, 14), equipment: a.equipment, created_at: a.joinedAt, is_public: a.discoverable !== false,
    })
    if (a.id !== uid) continue
    const privacy = privacyOf(a)
    put(set, 'athlete_identity', {
      athlete_id: a.id, origin: orNull(a.from?.trim().slice(0, 80)), city: orNull(a.city?.trim().slice(0, 80)), environments: a.environments ?? [],
      open_to_train: !!a.openToTrain, origin_audience: privacy.origin, base_audience: privacy.base, places_audience: privacy.places, visits_audience: privacy.visits,
      country: orNull(a.country?.trim().slice(0, 60)), interests: (a.interests ?? []).filter((d) => DISCIPLINE_IDS.includes(d)),
      style_audience: privacy.style, ratings_audience: privacy.ratings, interests_audience: privacy.interests,
      ...styleRow(personalOf(a)),
    })
    for (const skill_id of a.goals) put(set, 'athlete_goals', { athlete_id: a.id, skill_id })
  }

  for (const followee_id of s.following) if (isUuid(followee_id)) put(set, 'follows', { follower_id: uid, followee_id })

  const blocks = new Set<string>()
  const sessions = new Set<string>()
  for (const c of s.courses) {
    if (!isUuid(c.id) || !isUuid(c.coachId)) continue
    put(set, 'courses', { id: c.id, coach_id: c.coachId, title: c.title, tagline: c.tagline, description: c.description, focus: c.focus, format: c.format, status: c.status, start_date: c.startDate })
    for (const skill_id of c.milestones) put(set, 'course_milestones', { course_id: c.id, skill_id })
    c.weeks.forEach((w, wi) => {
      put(set, 'course_weeks', { id: w.id, course_id: c.id, position: wi, title: w.title, objective: w.objective, kind: w.kind ?? 'training', focus: orNull(w.focus) })
      for (const cs of w.sessions) {
        sessions.add(cs.id)
        put(set, 'course_sessions', { id: cs.id, week_id: w.id, day: clamp(cs.day, 0, 6), title: cs.title })
        cs.blocks.forEach((b, bi) => {
          blocks.add(b.id)
          put(set, 'course_blocks', {
            id: b.id, session_id: cs.id, position: bi, kind: b.kind, exercise_id: b.exerciseId, progression_id: orNull(b.progressionId), level: orNull(b.level),
            min_level: orNull(b.minLevel), max_level: orNull(b.maxLevel), sets: Math.max(1, Math.round(b.sets)), target: Math.max(1, Math.round(b.target)),
            rest: Math.max(0, Math.round(b.rest)), note: orNull(b.note), is_primary: !!b.primary,
          })
        })
      }
    })
  }

  for (const e of s.enrollments) {
    if (!set.courses.has(e.courseId) || !isUuid(e.athleteId)) continue
    put(set, 'course_enrollments', { course_id: e.courseId, athlete_id: e.athleteId, status: e.status, joined_at: e.joinedAt, id: e.id })
  }

  for (const l of s.logs) {
    if (!isUuid(l.id) || !isUuid(l.athleteId) || !l.finishedAt) continue
    const src = l.source
    const inCourse = src.type === 'course' && set.courses.has(src.courseId) && sessions.has(src.sessionId)
    put(set, 'workout_logs', {
      id: l.id, athlete_id: l.athleteId, title: l.title, source_type: src.type,
      course_id: src.type === 'course' && inCourse ? src.courseId : null,
      session_id: src.type === 'course' && inCourse ? src.sessionId : null,
      source_ref: src.type === 'course' ? (inCourse ? null : `${src.courseId}/${src.sessionId}`) : src.type === 'library' ? src.workoutId : src.skillId,
      started_at: l.startedAt, finished_at: l.finishedAt, rpe: l.rpe ? clamp(l.rpe, 1, 10) : null, note: orNull(l.note),
    })
    l.entries.forEach((e, i) => {
      const id = entryId(l.id, i)
      put(set, 'workout_log_entries', {
        id, log_id: l.id, position: i, kind: e.kind, block_id: blocks.has(e.blockId) ? e.blockId : null, progression_id: orNull(e.progressionId),
        assigned_exercise_id: e.assignedExerciseId, assigned_level: orNull(e.assignedLevel), assigned_target: Math.round(e.assignedTarget),
        exercise_id: e.exerciseId, level: orNull(e.level), target: Math.round(e.target), rest: Math.max(0, Math.round(e.rest)),
      })
      e.sets.forEach((x, j) => put(set, 'workout_log_sets', { entry_id: id, position: j, exercise_id: x.exerciseId, level: orNull(x.level), value: Math.max(0, Math.round(x.value)) }))
    })
  }

  for (const e of s.evidence) {
    // Evidence derived on the device from an open assessment has a composite id and is never sent.
    if (!isUuid(e.id) || !isUuid(e.athleteId)) continue
    put(set, 'evidence', {
      id: e.id, athlete_id: e.athleteId, exercise_id: e.exerciseId, value: Math.round(e.value), tier: e.tier, source: e.source,
      log_id: e.logId && set.workout_logs.has(e.logId) ? e.logId : null, note: orNull(e.note), performed_at: e.date,
      observed_by: orNull(e.observedBy), assessment_id: orNull(e.assessmentId), verified_by: orNull(e.verifiedBy), verified_at: orNull(e.verifiedAt),
    })
  }

  for (const f of s.feedback) {
    if (!isUuid(f.id) || !set.workout_logs.has(f.logId)) continue
    put(set, 'feedback', { id: f.id, log_id: f.logId, coach_id: f.coachId, athlete_id: f.athleteId, body: f.text, created_at: f.date })
  }

  for (const a of s.assessments) {
    const owner = a.origin === 'solo' ? uid : a.coachId
    if (!isUuid(a.id) || !isUuid(owner)) continue
    put(set, 'assessment_sessions', {
      id: a.id, owner_id: owner, solo: a.origin === 'solo', protocol: a.protocol, kind: a.kind, title: a.title, group_name: a.groupName,
      course_id: a.courseId && set.courses.has(a.courseId) ? a.courseId : null, baseline_id: null, stations: a.stations,
      station_minutes: clamp(a.stationMinutes, 1, 60), rotation_started_at: orNull(a.rotationStartedAt), invite_token: a.inviteToken ?? null, created_at: a.createdAt,
      mode: a.origin === 'solo' ? 'guided' : (a.mode ?? 'guided'), groups: clamp(a.groups ?? 1, 1, 12),
    })
    put(set, 'assessment_status', { id: a.id, status: a.status, finalised_at: a.finalisedAt ?? null })
  }
  // A baseline can only be named once its own row is known to exist.
  for (const a of s.assessments) {
    const row = set.assessment_sessions.get(a.id)
    if (row && a.baselineId && set.assessment_sessions.has(a.baselineId)) row.baseline_id = a.baselineId
  }

  for (const p of s.participants) {
    if (!isUuid(p.id) || !set.assessment_sessions.has(p.sessionId)) continue
    put(set, 'assessment_participants', {
      id: p.id, session_id: p.sessionId, athlete_id: isUuid(p.athleteId) ? p.athleteId : null, display_name: p.name.trim().slice(0, 80) || 'Participant',
      sharing: p.sharing, partner_name: orNull(p.partner), skipped: p.skipped, flags: p.flags, joined_at: p.joinedAt, submitted_at: orNull(p.submittedAt),
      group_no: p.group === undefined ? null : clamp(p.group, 0, 11),
    })
    for (const [test_id, r] of Object.entries(p.results)) {
      const test = testById[test_id]
      if (!test) continue
      put(set, 'assessment_results', {
        participant_id: p.id, test_id, value: Math.max(0, Math.round(r.value)), skipped: !!r.skipped, tier: r.tier, recorded_at: r.at,
        demonstrates: demonstrated(test, r), recorded_by: uid,
      })
    }
  }

  return set
}

// ── Rows → state ─────────────────────────────────────────────────────────

export function same(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const ka = Object.keys(a).filter((k) => (a as Row)[k] !== undefined)
  const kb = Object.keys(b).filter((k) => (b as Row)[k] !== undefined)
  return ka.length === kb.length && ka.every((k) => same((a as Row)[k], (b as Row)[k]))
}

/** Keep the object the app already holds when nothing in it changed, so screens do not redraw. */
const keep = <T>(prev: T | undefined, next: T): T => (prev !== undefined && same(prev, next) ? prev : next)

/** Items in the order the device already had them, with new ones after. */
function ordered<T>(items: T[], idOf: (t: T) => string, prevIds: string[] | undefined): T[] {
  if (!prevIds?.length) return items
  const rank = new Map(prevIds.map((id, i) => [id, i]))
  return items
    .map((item, i) => ({ item, i, r: rank.get(idOf(item)) }))
    .sort((a, b) => (a.r ?? Infinity) - (b.r ?? Infinity) || a.i - b.i)
    .map((x) => x.item)
}

const group = (rows: Iterable<Row>, by: string) => {
  const out = new Map<string, Row[]>()
  for (const r of rows) {
    const k = String(r[by])
    const list = out.get(k)
    if (list) list.push(r)
    else out.set(k, [r])
  }
  return out
}

const byPosition = (a: Row, b: Row) => Number(a.position) - Number(b.position)

/**
 * The app's state as the given rows describe it. `prev` supplies what rows
 * do not carry (fields that stay on the device) and lets unchanged objects
 * keep their identity.
 */
export function build(set: RowSet, uid: string, prev: Synced): Synced {
  const now = new Date().toISOString()

  // Athletes
  const identity = set.athlete_identity.get(uid)
  const goals = group(set.athlete_goals.values(), 'athlete_id')
  const athletes: Record<string, Athlete> = {}
  for (const r of set.profiles.values()) {
    const id = String(r.id)
    const was = prev.athletes[id]
    const next: Athlete = {
      ...was,
      id, name: String(r.name ?? 'Athlete'), handle: String(r.handle ?? ''), bio: String(r.bio ?? ''), roles: (r.roles as Athlete['roles']) ?? ['athlete'],
      goals: ordered((goals.get(id) ?? []).map((g) => String(g.skill_id)), (g) => g, was?.goals), joinedAt: instant(r.created_at) ?? was?.joinedAt ?? now,
      weeklyTarget: Number(r.weekly_target ?? 3), equipment: (r.equipment as Athlete['equipment']) ?? [],
      // Unset means discoverable: only a profile that was hidden, or had the choice recorded, carries the field.
      discoverable: r.is_public === false ? false : was?.discoverable === undefined ? undefined : true,
    }
    if (id === uid && identity) {
      next.from = opt<string>(identity.origin)
      next.city = opt<string>(identity.city)
      next.environments = (identity.environments as TrainingEnvironment[]) ?? []
      next.openToTrain = !!identity.open_to_train
      next.country = opt<string>(identity.country)
      const interests = (identity.interests as DisciplineId[]) ?? []
      next.interests = interests.length || was?.interests ? interests : undefined
      const privacy = {
        origin: identity.origin_audience as Audience, base: identity.base_audience as Audience,
        places: identity.places_audience as Audience, visits: identity.visits_audience as Audience,
        style: (identity.style_audience as Audience) ?? 'everyone', ratings: (identity.ratings_audience as Audience) ?? 'everyone',
        interests: (identity.interests_audience as Audience) ?? 'everyone',
      }
      // What the device holds is kept as it is while it says the same thing, parts left to their default included.
      next.privacy = was && same(privacyOf(was), privacy) ? was.privacy : privacy
      const style = styleFromRow(identity)
      next.style = was && same(personalOf(was), style) ? was.style : style
    }
    athletes[id] = keep(was, next)
  }

  // Courses
  const weeksOf = group(set.course_weeks.values(), 'course_id')
  const sessionsOf = group(set.course_sessions.values(), 'week_id')
  const blocksOf = group(set.course_blocks.values(), 'session_id')
  const milestonesOf = group(set.course_milestones.values(), 'course_id')
  const prevCourse = new Map(prev.courses.map((c) => [c.id, c]))
  const courses: Course[] = []
  for (const r of set.courses.values()) {
    const id = String(r.id)
    const was = prevCourse.get(id)
    const wasWeek = new Map((was?.weeks ?? []).map((w) => [w.id, w]))
    const weeks: CourseWeek[] = (weeksOf.get(id) ?? []).sort(byPosition).map((w) => {
      const wid = String(w.id)
      const built: CourseSession[] = (sessionsOf.get(wid) ?? []).map((cs) => ({
        id: String(cs.id), day: Number(cs.day), title: String(cs.title ?? ''),
        blocks: (blocksOf.get(String(cs.id)) ?? []).sort(byPosition).map((b): WorkoutBlock => ({
          id: String(b.id), kind: b.kind as WorkoutBlock['kind'], exerciseId: String(b.exercise_id), progressionId: opt<string>(b.progression_id), level: opt<number>(b.level),
          minLevel: opt<number>(b.min_level), maxLevel: opt<number>(b.max_level), sets: Number(b.sets), target: Number(b.target), rest: Number(b.rest), note: opt<string>(b.note),
          ...(b.is_primary ? { primary: true } : {}),
        })),
      }))
      // Sessions have no order of their own in the database: keep the device's, else by day.
      built.sort((a, b) => a.day - b.day || a.id.localeCompare(b.id))
      return {
        id: wid, title: String(w.title ?? ''), objective: String(w.objective ?? ''),
        ...(w.kind && w.kind !== 'training' ? { kind: w.kind as CourseWeek['kind'] } : {}),
        ...(w.focus ? { focus: w.focus as CourseWeek['focus'] } : {}),
        sessions: ordered(built, (x) => x.id, wasWeek.get(wid)?.sessions.map((x) => x.id)),
      }
    })
    const next: Course = {
      ...was,
      id, coachId: String(r.coach_id), title: String(r.title ?? ''), tagline: String(r.tagline ?? ''), description: String(r.description ?? ''),
      focus: r.focus as Course['focus'], format: r.format as Course['format'], status: r.status as Course['status'], startDate: String(r.start_date),
      milestones: ordered((milestonesOf.get(id) ?? []).map((m) => String(m.skill_id)).sort(), (m) => m, was?.milestones), weeks,
    }
    courses.push(keep(was, next))
  }
  const courseOrder = ordered(courses, (c) => c.id, prev.courses.map((c) => c.id))

  // Enrolments
  const prevEnrol = new Map(prev.enrollments.map((e) => [`${e.courseId}|${e.athleteId}`, e]))
  const enrollments: Enrollment[] = []
  for (const [key, r] of set.course_enrollments) {
    const was = prevEnrol.get(key)
    enrollments.push(keep(was, {
      id: String(r.id ?? was?.id ?? key), courseId: String(r.course_id), athleteId: String(r.athlete_id),
      joinedAt: instant(r.joined_at) ?? was?.joinedAt ?? now, status: r.status as Enrollment['status'],
    }))
  }

  // Workout logs. A finished log never changes, so the device's own copy is kept as it is.
  const prevLog = new Map(prev.logs.map((l) => [l.id, l]))
  const entriesOf = group(set.workout_log_entries.values(), 'log_id')
  const setsOf = group(set.workout_log_sets.values(), 'entry_id')
  const logs: WorkoutLog[] = []
  for (const r of set.workout_logs.values()) {
    const id = String(r.id)
    const was = prevLog.get(id)
    if (was) {
      logs.push(was)
      continue
    }
    const ref = String(r.source_ref ?? '')
    const source: WorkoutSource =
      r.source_type === 'course' ? { type: 'course', courseId: String(r.course_id ?? ref.split('/')[0] ?? ''), sessionId: String(r.session_id ?? ref.split('/')[1] ?? '') }
      : r.source_type === 'goal' ? { type: 'goal', skillId: ref }
      : { type: 'library', workoutId: ref }
    const entries: LogEntry[] = (entriesOf.get(id) ?? []).sort(byPosition).map((e) => ({
      blockId: String(e.block_id ?? e.id), kind: e.kind as LogEntry['kind'], progressionId: opt<string>(e.progression_id), assignedExerciseId: String(e.assigned_exercise_id),
      assignedLevel: opt<number>(e.assigned_level), assignedTarget: Number(e.assigned_target), exerciseId: String(e.exercise_id), level: opt<number>(e.level),
      target: Number(e.target), rest: Number(e.rest),
      sets: (setsOf.get(String(e.id)) ?? []).sort(byPosition).map((x) => ({ value: Number(x.value), done: true, exerciseId: String(x.exercise_id), level: opt<number>(x.level) })),
    }))
    logs.push({
      id, athleteId: String(r.athlete_id), title: String(r.title), source, startedAt: instant(r.started_at) ?? now, finishedAt: instant(r.finished_at) ?? undefined,
      rpe: opt<number>(r.rpe), note: opt<string>(r.note), entries,
    })
  }
  logs.sort((a, b) => a.startedAt.localeCompare(b.startedAt))

  // Feedback and follows
  const prevFeedback = new Map(prev.feedback.map((f) => [f.id, f]))
  const feedback: Feedback[] = [...set.feedback.values()].map((r) =>
    keep(prevFeedback.get(String(r.id)), { id: String(r.id), logId: String(r.log_id), coachId: String(r.coach_id), athleteId: String(r.athlete_id), text: String(r.body), date: instant(r.created_at) ?? now }),
  )
  feedback.sort((a, b) => a.date.localeCompare(b.date))
  const following = ordered([...set.follows.values()].filter((r) => r.follower_id === uid).map((r) => String(r.followee_id)), (f) => f, prev.following)

  // Assessments
  const prevSession = new Map(prev.assessments.map((a) => [a.id, a]))
  const assessments: AssessmentSession[] = []
  for (const r of set.assessment_sessions.values()) {
    const id = String(r.id)
    const was = prevSession.get(id)
    const status = set.assessment_status.get(id)
    const owner = String(r.owner_id)
    const solo = !!r.solo
    const finalised = status?.status === 'finalised'
    assessments.push(keep(was, {
      ...was,
      id, protocol: String(r.protocol), title: String(r.title ?? ''), kind: r.kind as AssessmentSession['kind'], groupName: String(r.group_name ?? ''),
      coachId: solo ? null : owner, coachName: solo ? '' : (athletes[owner]?.name ?? was?.coachName ?? 'Coach'),
      courseId: opt<string>(r.course_id), baselineId: opt<string>(r.baseline_id) ?? (was?.baselineId && !set.assessment_sessions.has(was.baselineId) ? was.baselineId : undefined),
      stations: r.stations as DisciplineId[], status: finalised ? 'finalised' : 'open', origin: solo ? 'solo' : owner === uid ? 'local' : 'invite',
      createdAt: instant(r.created_at) ?? was?.createdAt ?? now, finalisedAt: finalised ? (instant(status?.finalised_at) ?? was?.finalisedAt ?? now) : undefined,
      stationMinutes: Number(r.station_minutes ?? 6), rotationStartedAt: instant(r.rotation_started_at) ?? undefined, inviteToken: opt<string>(r.invite_token),
      mode: r.mode === 'stations' ? 'stations' : 'guided', groups: Number(r.groups ?? 1),
    }))
  }
  assessments.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  const prevParticipant = new Map(prev.participants.map((p) => [p.id, p]))
  const resultsOf = group(set.assessment_results.values(), 'participant_id')
  const participants: AssessmentParticipant[] = []
  for (const r of set.assessment_participants.values()) {
    const id = String(r.id)
    const was = prevParticipant.get(id)
    const results: Record<string, AssessmentResult> = {}
    for (const x of resultsOf.get(id) ?? []) {
      results[String(x.test_id)] = { value: Number(x.value), tier: x.tier as AssessmentResult['tier'], at: instant(x.recorded_at) ?? now, ...(x.skipped ? { skipped: true } : {}) }
    }
    const athleteId = opt<string>(r.athlete_id)
    participants.push(keep(was, {
      ...was,
      id, sessionId: String(r.session_id), athleteId, name: String(r.display_name ?? 'Participant'), joinedAt: instant(r.joined_at) ?? was?.joinedAt ?? now,
      via: was?.via ?? (athleteId ? 'self' : 'coach'), sharing: r.sharing as AssessmentParticipant['sharing'], partner: opt<string>(r.partner_name), results,
      skipped: (r.skipped as DisciplineId[]) ?? [], flags: (r.flags as DisciplineId[]) ?? [], submittedAt: instant(r.submitted_at) ?? undefined,
      group: r.group_no === null || r.group_no === undefined ? undefined : Number(r.group_no),
    }))
  }
  participants.sort((a, b) => a.joinedAt.localeCompare(b.joinedAt) || a.id.localeCompare(b.id))

  // Evidence: what the server holds, plus what open assessments show on this device.
  const prevEvidence = new Map(prev.evidence.map((e) => [e.id, e]))
  const evidence: Evidence[] = []
  const settled = new Set<string>()
  for (const r of set.evidence.values()) {
    const id = String(r.id)
    if (r.assessment_id) settled.add(`${r.assessment_id}|${r.athlete_id}`)
    evidence.push(keep(prevEvidence.get(id), {
      id, athleteId: String(r.athlete_id), exerciseId: String(r.exercise_id), value: Number(r.value), tier: r.tier as Evidence['tier'], source: r.source as Evidence['source'],
      date: instant(r.performed_at) ?? now, logId: opt<string>(r.log_id), assessmentId: opt<string>(r.assessment_id), observedBy: opt<string>(r.observed_by),
      verifiedBy: opt<string>(r.verified_by), verifiedAt: instant(r.verified_at) ?? undefined, note: opt<string>(r.note),
    }))
  }
  evidence.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
  for (const e of derivedEvidence({ assessments, participants }, uid)) {
    if (!settled.has(`${e.assessmentId}|${e.athleteId}`)) evidence.push(keep(prevEvidence.get(e.id), e))
  }

  return { athletes, evidence, logs, courses: courseOrder, enrollments, feedback, following, assessments, participants }
}

/**
 * Evidence an assessment shows before the server has written it: your own
 * results once you have finished, and everyone's in a session you have
 * finalised. Replaced by the server's rows as soon as those exist.
 */
export function derivedEvidence(s: Pick<Synced, 'assessments' | 'participants'>, uid: string): Evidence[] {
  const sessions = new Map(s.assessments.map((a) => [a.id, a]))
  const out: Evidence[] = []
  for (const p of s.participants) {
    const session = sessions.get(p.sessionId)
    if (!session || !p.athleteId) continue
    const own = p.athleteId === uid && !!p.submittedAt
    const finalised = session.origin !== 'invite' && session.status === 'finalised'
    if (own || finalised) out.push(...resultsToEvidence(p.results, p.athleteId, session.id, session.coachId ?? undefined))
  }
  return out
}

// ── A device's own data, moved into an account ───────────────────────────

/**
 * Re-key what an athlete built on this device before signing in, so it can be
 * sent to their new account. Sample athletes and anything that belonged to
 * them are left behind; so is anything that needs another real person.
 */
export function adopt(s: Synced, localId: string, uid: string, newId: () => string): Synced {
  const me = s.athletes[localId]
  if (!me) return { athletes: {}, evidence: [], logs: [], courses: [], enrollments: [], feedback: [], following: [], assessments: [], participants: [] }

  const courses = s.courses.filter((c) => c.coachId === localId && isUuid(c.id)).map((c) => ({ ...c, coachId: uid }))
  const courseIds = new Set(courses.map((c) => c.id))

  const sessionId = new Map<string, string>()
  const assessments = s.assessments
    .filter((a) => !a.sample && (a.origin === 'solo' || (a.origin === 'local' && a.coachId === localId)))
    .map((a) => {
      const id = isUuid(a.id) ? a.id : newId()
      sessionId.set(a.id, id)
      return { ...a, id, coachId: a.origin === 'solo' ? null : uid, courseId: a.courseId && courseIds.has(a.courseId) ? a.courseId : undefined }
    })
    .map((a) => ({ ...a, baselineId: a.baselineId ? sessionId.get(a.baselineId) : undefined }))
  const participants = s.participants
    .filter((p) => sessionId.has(p.sessionId))
    .map((p) => ({ ...p, id: isUuid(p.id) ? p.id : newId(), sessionId: sessionId.get(p.sessionId)!, athleteId: p.athleteId === localId ? uid : undefined, via: p.athleteId === localId ? ('self' as const) : ('coach' as const) }))

  const logs = s.logs.filter((l) => l.athleteId === localId && isUuid(l.id)).map((l) => ({ ...l, athleteId: uid }))
  const logIds = new Set(logs.map((l) => l.id))

  // Results from someone else's session cannot follow as a session; keep what they showed.
  const kept = new Set(sessionId.keys())
  const evidence = s.evidence
    .filter((e) => e.athleteId === localId && !(e.assessmentId && kept.has(e.assessmentId)))
    .map((e): Evidence => {
      const { assessmentId: _a, observedBy: _o, verifiedBy: _v, verifiedAt: _t, ...rest } = e
      const fromAssessment = e.source === 'assessment'
      return {
        ...rest, id: isUuid(e.id) ? e.id : newId(), athleteId: uid, logId: e.logId && logIds.has(e.logId) ? e.logId : undefined,
        source: fromAssessment ? 'manual' : e.source, tier: e.tier === 'estimated' ? 'estimated' : 'self',
        note: fromAssessment ? (e.note ?? 'From an assessment taken before signing in') : e.note,
      }
    })

  return {
    athletes: { [uid]: { ...me, id: uid } },
    evidence, logs, courses,
    enrollments: s.enrollments.filter((e) => courseIds.has(e.courseId) && e.athleteId === localId).map((e) => ({ ...e, athleteId: uid })),
    feedback: [], following: [], assessments, participants,
  }
}
