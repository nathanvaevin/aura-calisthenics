import type { AssessmentParticipant, AssessmentResult, BandId, DisciplineId, Evidence } from './types'
import { DISCIPLINE_IDS, PROGRESSIONS, disciplineById, exerciseById, stepAt } from './catalog'
import { bandOf } from './scoring/config'
import { computeAura } from './scoring/aura'
import { allRatings } from './scoring/mastery'
import { workingLevel } from './scoring/skills'

/**
 * The physical assessment.
 *
 * A protocol is six stations, one per discipline. Each station opens with a
 * benchmark everyone can attempt, then branches on the result: easier
 * benchmarks for someone who is not there yet, harder ones for someone who is
 * past it. Nobody is asked to try something clearly beyond them, and every
 * path still collects enough benchmarks to place the athlete.
 *
 * The protocol lives in code and is versioned, so a session only has to name
 * it. Bump PROTOCOL whenever a test is added, removed or reordered: hand-in
 * links address tests by position.
 */
export const PROTOCOL = 'baseline-1'

interface Cond {
  test: string
  gte?: number
  lte?: number
}

export interface AssessmentTest {
  id: string
  /** The exercise measured. For choice tests, the one shown for instructions. */
  exerciseId: string
  kind: 'max' | 'choice'
  /** One line telling the athlete exactly what to do. */
  prompt: string
  /** Stop here: enough to place the athlete without draining them. */
  cap?: number
  /** Positions to choose between, easiest first. Each records what it demonstrates. */
  options?: { label: string; ev: [string, number][] }[]
  /** Shown when any group holds; a group holds when all its conditions do. Unset: always. */
  when?: Cond[][]
}

export interface Station {
  id: DisciplineId
  /** What the group needs at this station. */
  setup: string
  minutes: number
  tests: AssessmentTest[]
}

const max = (id: string, prompt: string, extra: Partial<AssessmentTest> = {}): AssessmentTest => ({ id, exerciseId: id, kind: 'max', prompt, ...extra })

export const STATIONS: Station[] = [
  {
    id: 'pull', minutes: 6, setup: 'Pull-up bar and a low bar or rings. One on the bar, partner counts.',
    tests: [
      max('dead-hang', 'Hang from the bar for as long as you can.', { cap: 90 }),
      max('pull-up', 'Strict pull-ups from a dead hang, one unbroken set. Zero is a valid answer.', { when: [[{ test: 'dead-hang', gte: 15 }]] }),
      max('incline-row', 'Rows with the body at about 45°, chest to the bar.', { cap: 20, when: [[{ test: 'dead-hang', lte: 14 }], [{ test: 'pull-up', lte: 0 }]] }),
      max('scap-pull', 'From a hang, pull the shoulders down with straight arms. Pause each rep.', { cap: 15, when: [[{ test: 'pull-up', lte: 0 }]] }),
      max('horizontal-row', 'Rows with the body near horizontal, chest to the bar.', { cap: 20, when: [[{ test: 'pull-up', gte: 1, lte: 7 }]] }),
      max('chest-to-bar', 'Strict pull-ups until the chest touches the bar.', { when: [[{ test: 'pull-up', gte: 8 }]] }),
      max('tuck-fl', 'Tuck front lever: back horizontal, arms straight. Hold.', { cap: 30, when: [[{ test: 'pull-up', gte: 8 }]] }),
      max('muscle-up', 'Bar muscle-ups with minimal kip. Zero is a valid answer.', { when: [[{ test: 'pull-up', gte: 12 }, { test: 'chest-to-bar', gte: 5 }]] }),
    ],
  },
  {
    id: 'push', minutes: 6, setup: 'Floor space, a box or bench, dip bars if you have them.',
    tests: [
      max('pushup', 'Push-ups, chest to the floor, one unbroken set. Zero is a valid answer.', { cap: 50 }),
      max('knee-pushup', 'Push-ups from the knees, chest to the floor.', { cap: 20, when: [[{ test: 'pushup', lte: 4 }]] }),
      max('incline-pushup', 'Push-ups with hands on a surface at hip height.', { cap: 20, when: [[{ test: 'pushup', lte: 4 }]] }),
      max('pike-pushup', 'Pike push-ups: hips high, head to the floor in front of the hands.', { cap: 15, when: [[{ test: 'pushup', gte: 5 }]] }),
      max('dip', 'Parallel bar dips, shoulders below elbows. Zero is a valid answer.', { when: [[{ test: 'pushup', gte: 8 }]] }),
      max('wall-hspu', 'Wall handstand push-ups, head to the floor. Zero is a valid answer.', { when: [[{ test: 'pike-pushup', gte: 10 }]] }),
      max('pseudo-planche-pushup', 'Push-ups with the hands by the hips, lean held throughout.', { cap: 15, when: [[{ test: 'pushup', gte: 25 }]] }),
    ],
  },
  {
    id: 'core', minutes: 5, setup: 'Floor space and mats. A bar for the advanced test.',
    tests: [
      max('plank', 'Forearm plank in a straight line. Stop when the hips sag.', { cap: 120 }),
      max('dead-bug', 'Opposite arm and leg lower slowly, lower back stays down. Count total reps.', { cap: 20, when: [[{ test: 'plank', lte: 29 }]] }),
      max('hollow-hold', 'Hollow body hold, lower back pressed into the floor.', { cap: 90, when: [[{ test: 'plank', gte: 30 }]] }),
      max('tuck-l-sit', 'Supported on the hands, knees tucked, feet off the floor. Hold.', { cap: 30, when: [[{ test: 'hollow-hold', gte: 20 }]] }),
      max('l-sit', 'L-sit with straight legs at horizontal. Zero is a valid answer.', { cap: 60, when: [[{ test: 'tuck-l-sit', gte: 15 }]] }),
      max('hanging-leg-raise', 'From a still hang, straight legs to horizontal.', { cap: 15, when: [[{ test: 'hollow-hold', gte: 45 }]] }),
      max('toes-to-bar', 'Strict toes-to-bar, no swing.', { when: [[{ test: 'hanging-leg-raise', gte: 8 }]] }),
    ],
  },
  {
    id: 'legs', minutes: 5, setup: 'Floor space and a box or chair. Something to hold for the assisted squat.',
    tests: [
      max('squat', 'Bodyweight squats, hips below knees, heels down.', { cap: 50 }),
      max('box-squat', 'Sit back to a knee-height box and stand, without dropping.', { cap: 20, when: [[{ test: 'squat', lte: 9 }]] }),
      max('glute-bridge', 'Glute bridges with a one-second pause at the top.', { cap: 25, when: [[{ test: 'squat', lte: 9 }]] }),
      max('split-squat', 'Split squats, back knee to the floor. Each side; record the weaker.', { cap: 15, when: [[{ test: 'squat', gte: 10 }]] }),
      max('single-leg-bridge', 'Single-leg glute bridges, hips level. Each side; record the weaker.', { cap: 15, when: [[{ test: 'squat', gte: 10 }]] }),
      max('assisted-pistol', 'Single-leg squat to full depth, a hand on a support for balance only.', { cap: 8, when: [[{ test: 'squat', gte: 20 }]] }),
      max('pistol-squat', 'Pistol squats without support. Zero is a valid answer.', { cap: 10, when: [[{ test: 'assisted-pistol', gte: 4 }]] }),
      max('shrimp-squat', 'Shrimp squats, back knee to the floor behind you.', { cap: 8, when: [[{ test: 'pistol-squat', gte: 3 }]] }),
    ],
  },
  {
    id: 'handstand', minutes: 7, setup: 'Clear wall space, one person per metre of wall. A box for the pike hold.',
    tests: [
      max('wall-walk', 'From a push-up position, walk the feet up the wall and back down. Zero is a valid answer.', { cap: 5 }),
      max('pike-hold', 'Feet on a box, hips over shoulders, arms locked. Hold.', { cap: 60, when: [[{ test: 'wall-walk', lte: 1 }]] }),
      max('crow-pose', 'Knees on the upper arms, feet off the floor. Zero is a valid answer.', { cap: 30 }),
      max('chest-to-wall-hs', 'Walk up to a chest-to-wall handstand, toes only on the wall. Hold.', { cap: 60, when: [[{ test: 'wall-walk', gte: 2 }]] }),
      max('wall-shoulder-taps', 'In the chest-to-wall handstand, alternate shoulder taps. Count total.', { cap: 20, when: [[{ test: 'chest-to-wall-hs', gte: 30 }]] }),
      max('freestanding-hs', 'Freestanding handstand. Best of three attempts, hands still.', { when: [[{ test: 'chest-to-wall-hs', gte: 30 }]] }),
      max('hs-shoulder-taps', 'Shoulder taps in a freestanding handstand.', { when: [[{ test: 'freestanding-hs', gte: 15 }]] }),
    ],
  },
  {
    id: 'mobility', minutes: 5, setup: 'Floor space and a wall. No equipment, so a good station to start cold.',
    tests: [
      {
        id: 'fold', exerciseId: 'toe-touch', kind: 'choice', prompt: 'Stand, lock the knees and fold forward. How far do you get?',
        options: [
          { label: 'Hands above the floor', ev: [] },
          { label: 'Fingertips touch', ev: [['toe-touch', 10]] },
          { label: 'Palms flat', ev: [['toe-touch', 30], ['palms-floor-fold', 10]] },
          { label: 'Seated, chest on thighs', ev: [['toe-touch', 30], ['palms-floor-fold', 10], ['seated-pike', 10]] },
        ],
      },
      max('deep-squat-hold', 'Rest in a deep squat, heels flat, no support.', { cap: 120 }),
      {
        id: 'overhead', exerciseId: 'overhead-wall-reach', kind: 'choice', prompt: 'Back flat on a wall, raise straight arms overhead. Do the thumbs reach the wall?',
        options: [
          { label: 'Not without arching', ev: [] },
          { label: 'Thumbs touch, back flat', ev: [['overhead-wall-reach', 10]] },
          { label: 'Easily, and I can hold it', ev: [['overhead-wall-reach', 30]] },
        ],
      },
      {
        id: 'straddle', exerciseId: 'pancake-elbows', kind: 'choice', prompt: 'Sit with legs wide and fold forward. How far do you get?',
        when: [[{ test: 'fold', gte: 1 }]],
        options: [
          { label: 'Hands on the floor', ev: [] },
          { label: 'Elbows on the floor', ev: [['pancake-elbows', 10]] },
          { label: 'Chest on the floor', ev: [['pancake-elbows', 30], ['pancake', 10]] },
        ],
      },
      max('bridge', 'Press up into a full bridge with locked arms. Zero is a valid answer.', { cap: 30, when: [[{ test: 'overhead', gte: 1 }]] }),
    ],
  },
]

export const stationById = Object.fromEntries(STATIONS.map((s) => [s.id, s])) as Record<DisciplineId, Station>
export const ALL_TESTS = STATIONS.flatMap((s) => s.tests)
export const testById: Record<string, AssessmentTest> = Object.fromEntries(ALL_TESTS.map((t) => [t.id, t]))

export const estimateMinutes = (stations: DisciplineId[]) => stations.reduce((n, s) => n + stationById[s].minutes, 0)

// ── Engine ───────────────────────────────────────────────────────────────

export type Results = Record<string, AssessmentResult>

const holds = (c: Cond, results: Results) => {
  const r = results[c.test]
  if (!r || r.skipped) return false
  return (c.gte === undefined || r.value >= c.gte) && (c.lte === undefined || r.value <= c.lte)
}

export const isVisible = (t: AssessmentTest, results: Results) => !t.when || t.when.some((group) => group.every((c) => holds(c, results)))

/** The tests this athlete should do at a station, given what they have recorded so far. */
export const visibleTests = (station: Station, results: Results) => station.tests.filter((t) => isVisible(t, results))

export const nextTest = (station: Station, results: Results) => visibleTests(station, results).find((t) => !results[t.id])

export type StationState = 'todo' | 'active' | 'done' | 'skipped'

export function stationProgress(station: Station, results: Results, skipped: DisciplineId[] = []) {
  const visible = visibleTests(station, results)
  const done = visible.filter((t) => results[t.id]).length
  const state: StationState = skipped.includes(station.id) ? 'skipped' : done === 0 ? 'todo' : done < visible.length ? 'active' : 'done'
  return { state, done, total: visible.length }
}

export function overallProgress(stations: DisciplineId[], results: Results, skipped: DisciplineId[] = []) {
  const states = stations.map((s) => stationProgress(stationById[s], results, skipped).state)
  const done = states.filter((s) => s === 'done').length
  return { done, skipped: states.filter((s) => s === 'skipped').length, total: stations.length, complete: states.every((s) => s === 'done' || s === 'skipped'), started: states.some((s) => s !== 'todo') }
}

/** What one recorded result demonstrates, as [exerciseId, value] pairs. */
export function demonstrated(test: AssessmentTest, r: AssessmentResult): [string, number][] {
  if (r.skipped) return []
  if (test.kind === 'choice') return test.options?.[r.value]?.ev ?? []
  return r.value > 0 ? [[test.exerciseId, r.value]] : []
}

/** Turn results into evidence. Each result keeps the tier it was recorded at. */
export function resultsToEvidence(results: Results, athleteId: string, assessmentId: string, coachId?: string): Evidence[] {
  const out: Evidence[] = []
  for (const [testId, r] of Object.entries(results)) {
    const test = testById[testId]
    if (!test) continue
    for (const [exerciseId, value] of demonstrated(test, r)) {
      out.push({
        id: `${assessmentId}:${athleteId}:${testId}:${exerciseId}`,
        athleteId, exerciseId, value, tier: r.tier, source: 'assessment', date: r.at, assessmentId,
        ...(r.tier === 'observed' && coachId ? { observedBy: coachId } : {}),
        ...(r.tier === 'coach' && coachId ? { verifiedBy: coachId, verifiedAt: r.at } : {}),
      })
    }
  }
  return out
}

export interface AssessedProfile {
  ratings: Record<DisciplineId, number>
  aura: number
  title: string
  strongest: DisciplineId | null
  weakest: DisciplineId | null
}

/** The profile an assessment alone produces, over the stations that were tested. */
export function profileOf(results: Results, stations: DisciplineId[] = DISCIPLINE_IDS): AssessedProfile {
  const full = allRatings(resultsToEvidence(results, 'p', 'a'))
  const aura = computeAura(full)
  const ratings = Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, full[d].rating])) as Record<DisciplineId, number>
  const tested = stations.filter((d) => ratings[d] > 0).sort((a, b) => ratings[b] - ratings[a])
  return { ratings, aura: aura.aura, title: aura.title, strongest: tested[0] ?? null, weakest: tested.length > 1 ? tested[tested.length - 1] : null }
}

/** A stable spread of starting stations, so a group does not all queue at the bar. */
export function startingStation(participantId: string, stations: DisciplineId[]): DisciplineId {
  let h = 0
  for (let i = 0; i < participantId.length; i++) h = (h * 31 + participantId.charCodeAt(i)) >>> 0
  return stations[h % stations.length]
}

// ── Links: an invitation out, results back ───────────────────────────────
//
// Until devices share a backend, the link itself is the transport. An
// invitation carries everything a phone needs to join; a hand-in carries one
// participant's results back to the coach. Both are plain data, not secrets:
// anyone holding a link can use it, which is why handed-in results arrive as
// self-reported.

const LETTER: Record<DisciplineId, string> = { handstand: 'h', pull: 'p', push: 'u', core: 'c', legs: 'l', mobility: 'm' }
const FROM_LETTER = Object.fromEntries(Object.entries(LETTER).map(([k, v]) => [v, k])) as Record<string, DisciplineId>

const b64encode = (text: string) => {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const b64decode = (data: string) => {
  const bin = atob(data.replace(/-/g, '+').replace(/_/g, '/'))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

export interface Invite {
  id: string
  protocol: string
  title: string
  groupName: string
  coachName: string
  courseId?: string
  stations: DisciplineId[]
  kind: 'baseline' | 'retest'
  stationMinutes: number
}

export const encodeInvite = (i: Invite) =>
  b64encode(JSON.stringify([1, i.id, i.protocol, i.title, i.groupName, i.coachName, i.courseId ?? '', i.stations.map((s) => LETTER[s]).join(''), i.kind === 'retest' ? 1 : 0, i.stationMinutes]))

export function decodeInvite(data: string): Invite | null {
  try {
    const [v, id, protocol, title, groupName, coachName, courseId, letters, retest, stationMinutes] = JSON.parse(b64decode(data))
    const stations = String(letters).split('').map((l) => FROM_LETTER[l]).filter(Boolean)
    if (v !== 1 || typeof id !== 'string' || !id || stations.length === 0) return null
    return { id, protocol: String(protocol), title: String(title), groupName: String(groupName), coachName: String(coachName), courseId: courseId || undefined, stations, kind: retest ? 'retest' : 'baseline', stationMinutes: Number(stationMinutes) || 6 }
  } catch {
    return null
  }
}

export interface HandIn {
  sessionId: string
  protocol: string
  participantId: string
  name: string
  sharing: 'coach' | 'group'
  partner?: string
  results: Results
  skipped: DisciplineId[]
  flags: DisciplineId[]
  submittedAt: string
}

export function encodeHandIn(p: AssessmentParticipant, protocol: string) {
  const flat: number[] = []
  ALL_TESTS.forEach((t, i) => {
    const r = p.results[t.id]
    if (r) flat.push(i, r.value, r.skipped ? 1 : 0)
  })
  const letters = (list: DisciplineId[]) => list.map((s) => LETTER[s]).join('')
  return b64encode(JSON.stringify([1, p.sessionId, protocol, p.id, p.name, p.sharing === 'group' ? 1 : 0, p.partner ?? '', flat, letters(p.skipped), letters(p.flags), p.submittedAt ?? new Date().toISOString()]))
}

export function decodeHandIn(data: string): HandIn | null {
  try {
    const [v, sessionId, protocol, participantId, name, group, partner, flat, skipped, flags, submittedAt] = JSON.parse(b64decode(data))
    if (v !== 1 || typeof sessionId !== 'string' || typeof participantId !== 'string' || !Array.isArray(flat)) return null
    const results: Results = {}
    for (let i = 0; i + 2 < flat.length; i += 3) {
      const test = ALL_TESTS[flat[i]]
      const value = Number(flat[i + 1])
      if (!test || !Number.isFinite(value) || value < 0) continue
      // Whatever the link says, a handed-in result is the athlete's own word.
      results[test.id] = { value: Math.round(value), tier: 'self', at: String(submittedAt), ...(flat[i + 2] ? { skipped: true } : {}) }
    }
    const from = (s: unknown) => String(s ?? '').split('').map((l) => FROM_LETTER[l]).filter(Boolean)
    return { sessionId, protocol: String(protocol), participantId, name: String(name).slice(0, 60) || 'Athlete', sharing: group ? 'group' : 'coach', partner: partner || undefined, results, skipped: from(skipped), flags: from(flags), submittedAt: String(submittedAt) }
  } catch {
    return null
  }
}

// ── The group ────────────────────────────────────────────────────────────

export interface Member {
  id: string
  name: string
  profile: AssessedProfile
  evidence: Evidence[]
  /** Whether this member agreed to be shown by name to the rest of the group. */
  shared: boolean
}

export const toMember = (p: AssessmentParticipant, stations: DisciplineId[]): Member => ({
  id: p.id,
  name: p.name,
  profile: profileOf(p.results, stations),
  evidence: resultsToEvidence(p.results, p.id, p.sessionId),
  shared: p.sharing === 'group',
})

const median = (values: number[]) => {
  if (values.length === 0) return 0
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return Math.round(s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2)
}

export interface GroupInsights {
  size: number
  median: Record<DisciplineId, number>
  min: Record<DisciplineId, number>
  max: Record<DisciplineId, number>
  bands: Record<DisciplineId, Partial<Record<BandId, number>>>
  aura: number
  strongest: DisciplineId | null
  weakest: DisciplineId | null
  /** Where the group is furthest apart, so where a session needs the most level options. */
  widest: DisciplineId | null
}

export function groupInsights(members: Member[], stations: DisciplineId[]): GroupInsights {
  const per = (fn: (values: number[]) => number) =>
    Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, stations.includes(d) ? fn(members.map((m) => m.profile.ratings[d])) : 0])) as Record<DisciplineId, number>
  const med = per(median)
  const min = per((v) => (v.length ? Math.min(...v) : 0))
  const maxv = per((v) => (v.length ? Math.max(...v) : 0))
  const bands = Object.fromEntries(
    DISCIPLINE_IDS.map((d) => {
      const count: Partial<Record<BandId, number>> = {}
      if (stations.includes(d)) for (const m of members) count[bandOf(m.profile.ratings[d]).id] = (count[bandOf(m.profile.ratings[d]).id] ?? 0) + 1
      return [d, count]
    }),
  ) as GroupInsights['bands']
  const ranked = stations.filter((d) => med[d] > 0).sort((a, b) => med[b] - med[a])
  const spread = [...stations].sort((a, b) => maxv[b] - min[b] - (maxv[a] - min[a]))
  return {
    size: members.length,
    median: med,
    min,
    max: maxv,
    bands,
    aura: median(members.map((m) => m.profile.aura)),
    strongest: ranked[0] ?? null,
    weakest: ranked.length > 1 ? ranked[ranked.length - 1] : null,
    widest: members.length > 1 && spread[0] && maxv[spread[0]] - min[spread[0]] > 0 ? spread[0] : null,
  }
}

export interface Pairing {
  a: Member
  b: Member
  /** Where a is ahead of b, and b ahead of a. */
  aLeads: DisciplineId
  bLeads: DisciplineId
}

/**
 * Pair people whose shapes complement each other: each is strongest where the
 * other has the most to learn. Greedy over all pairs, most complementary first.
 */
export function suggestPairs(members: Member[], stations: DisciplineId[]): Pairing[] {
  const shape = (m: Member) => {
    const mean = stations.reduce((s, d) => s + m.profile.ratings[d], 0) / Math.max(1, stations.length)
    return stations.map((d) => m.profile.ratings[d] - mean)
  }
  const shapes = new Map(members.map((m) => [m.id, shape(m)]))
  const candidates: { a: Member; b: Member; score: number }[] = []
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const sa = shapes.get(members[i].id)!
      const sb = shapes.get(members[j].id)!
      candidates.push({ a: members[i], b: members[j], score: -sa.reduce((s, v, k) => s + v * sb[k], 0) })
    }
  }
  candidates.sort((x, y) => y.score - x.score)
  const used = new Set<string>()
  const out: Pairing[] = []
  for (const { a, b } of candidates) {
    if (used.has(a.id) || used.has(b.id)) continue
    const lead = (x: Member, y: Member) => [...stations].sort((p, q) => x.profile.ratings[q] - y.profile.ratings[q] - (x.profile.ratings[p] - y.profile.ratings[p]))[0]
    const aLeads = lead(a, b)
    const bLeads = lead(b, a)
    if (a.profile.ratings[aLeads] <= b.profile.ratings[aLeads] || b.profile.ratings[bLeads] <= a.profile.ratings[bLeads]) continue
    used.add(a.id)
    used.add(b.id)
    out.push({ a, b, aLeads, bLeads })
  }
  return out
}

export interface LadderAdvice {
  progressionId: string
  name: string
  discipline: DisciplineId
  /** The level to assign: the group's median working level. */
  level: number
  /** The range that lets everyone in the group take part. */
  min: number
  max: number
  exercise: string
  steps: number
}

/** For each movement family, where to pitch a session for this group. */
export function ladderAdvice(members: Member[], stations: DisciplineId[], only?: string[]): LadderAdvice[] {
  if (members.length === 0) return []
  return PROGRESSIONS.filter((p) => stations.includes(p.discipline) && (!only || only.includes(p.id)))
    .map((p) => {
      const levels = members.map((m) => workingLevel(p.id, m.evidence))
      const touched = members.some((m) => m.evidence.some((e) => p.steps.some((s) => s.exerciseId === e.exerciseId || s.alternates?.includes(e.exerciseId))))
      const level = median(levels)
      return { touched, advice: { progressionId: p.id, name: p.name, discipline: p.discipline, level, min: Math.min(...levels), max: Math.max(...levels), exercise: exerciseById[stepAt(p.id, level)!.exerciseId].name, steps: p.steps.length } }
    })
    .filter((x) => x.touched)
    .map((x) => x.advice)
}

export interface Attention {
  participant: AssessmentParticipant
  reasons: string[]
}

/** Who a coach should walk over to. */
export function needsAttention(participants: AssessmentParticipant[], stations: DisciplineId[]): Attention[] {
  const out: Attention[] = []
  for (const p of participants) {
    const reasons: string[] = []
    for (const s of p.flags) reasons.push(`Asked for help at ${disciplineById[s].short}`)
    for (const s of p.skipped) if (stations.includes(s)) reasons.push(`Skipped ${disciplineById[s].short}`)
    const untested = Object.values(p.results).filter((r) => r.skipped).length
    if (untested) reasons.push(`${untested} ${untested === 1 ? 'benchmark' : 'benchmarks'} could not be tested`)
    const progress = overallProgress(stations, p.results, p.skipped)
    if (!progress.started) reasons.push('Has not started')
    else if (p.submittedAt && !progress.complete) reasons.push(`Finished with ${progress.total - progress.done - progress.skipped} stations open`)
    if (reasons.length) out.push({ participant: p, reasons })
  }
  return out
}

/** Change per discipline between two profiles, over the stations both tested. */
export function compareProfiles(before: AssessedProfile, after: AssessedProfile, stations: DisciplineId[]) {
  return {
    aura: after.aura - before.aura,
    ratings: Object.fromEntries(stations.map((d) => [d, after.ratings[d] - before.ratings[d]])) as Partial<Record<DisciplineId, number>>,
  }
}
