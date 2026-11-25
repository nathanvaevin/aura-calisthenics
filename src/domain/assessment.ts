import type { AssessmentParticipant, AssessmentResult, BandId, DisciplineId, Evidence } from './types'
import { DISCIPLINE_IDS, PROGRESSIONS, disciplineById, exerciseById, stepAt } from './catalog'
import { bandOf } from './scoring/config'
import { curveRating } from './scoring/curve'
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
export const PROTOCOL = 'baseline-2'

/**
 * Protocols whose tests this version still understands. baseline-2 kept every
 * baseline-1 test in place and added station menus after them, so sessions and
 * hand-in links made with baseline-1 still read correctly.
 */
export const KNOWN_PROTOCOLS = ['baseline-1', 'baseline-2']
export const protocolKnown = (p: string) => KNOWN_PROTOCOLS.includes(p)

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
  /**
   * The range this variation is the right level for, in reps or seconds. Not a
   * limit: more is recorded as it is. Above the top, a harder variation usually
   * says more about the athlete than more repetitions of this one.
   */
  target?: readonly [number, number]
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
  /** The guided path: shown in order, each gated on the results before it. Order and ids are part of the protocol. */
  tests: AssessmentTest[]
  /** Further variations offered only in the station menu, where athletes choose for themselves. */
  extra: AssessmentTest[]
}

const max = (id: string, prompt: string, target: readonly [number, number], extra: Partial<AssessmentTest> = {}): AssessmentTest => ({ id, exerciseId: id, kind: 'max', prompt, target, ...extra })

export const STATIONS: Station[] = [
  {
    id: 'pull', minutes: 6, setup: 'Pull-up bar and a low bar or rings. One on the bar, partner counts.',
    tests: [
      max('dead-hang', 'Hang from the bar for as long as you can.', [20, 45]),
      max('pull-up', 'Strict pull-ups from a dead hang, one unbroken set. Zero is a valid answer.', [3, 8], { when: [[{ test: 'dead-hang', gte: 15 }]] }),
      max('incline-row', 'Rows with the body at about 45°, chest to the bar.', [8, 15], { when: [[{ test: 'dead-hang', lte: 14 }], [{ test: 'pull-up', lte: 0 }]] }),
      max('scap-pull', 'From a hang, pull the shoulders down with straight arms. Pause each rep.', [6, 12], { when: [[{ test: 'pull-up', lte: 0 }]] }),
      max('horizontal-row', 'Rows with the body near horizontal, chest to the bar.', [6, 12], { when: [[{ test: 'pull-up', gte: 1, lte: 7 }]] }),
      max('chest-to-bar', 'Strict pull-ups until the chest touches the bar.', [3, 6], { when: [[{ test: 'pull-up', gte: 8 }]] }),
      max('tuck-fl', 'Tuck front lever: back horizontal, arms straight. Hold.', [8, 15], { when: [[{ test: 'pull-up', gte: 8 }]] }),
      max('muscle-up', 'Bar muscle-ups with minimal kip. Zero is a valid answer.', [1, 3], { when: [[{ test: 'pull-up', gte: 12 }, { test: 'chest-to-bar', gte: 5 }]] }),
    ],
    extra: [
      max('negative-pullup', 'Jump or step to chin over the bar, then lower for at least five seconds. Count controlled reps.', [3, 5]),
      max('chin-up', 'Strict chin-ups, palms facing you, from a dead hang.', [3, 8]),
      max('feet-elevated-row', 'Rows with the feet raised to bar height, body straight, chest to the bar.', [6, 12]),
      max('adv-tuck-fl', 'Advanced tuck front lever: back flat, hips opened from the tuck. Hold.', [5, 10]),
    ],
  },
  {
    id: 'push', minutes: 6, setup: 'Floor space, a box or bench, dip bars if you have them.',
    tests: [
      max('pushup', 'Push-ups, chest to the floor, one unbroken set. Zero is a valid answer.', [8, 20]),
      max('knee-pushup', 'Push-ups from the knees, chest to the floor.', [8, 15], { when: [[{ test: 'pushup', lte: 4 }]] }),
      max('incline-pushup', 'Push-ups with hands on a surface at hip height.', [8, 15], { when: [[{ test: 'pushup', lte: 4 }]] }),
      max('pike-pushup', 'Pike push-ups: hips high, head to the floor in front of the hands.', [5, 10], { when: [[{ test: 'pushup', gte: 5 }]] }),
      max('dip', 'Parallel bar dips, shoulders below elbows. Zero is a valid answer.', [5, 10], { when: [[{ test: 'pushup', gte: 8 }]] }),
      max('wall-hspu', 'Wall handstand push-ups, head to the floor. Zero is a valid answer.', [1, 5], { when: [[{ test: 'pike-pushup', gte: 10 }]] }),
      max('pseudo-planche-pushup', 'Push-ups with the hands by the hips, lean held throughout.', [5, 10], { when: [[{ test: 'pushup', gte: 25 }]] }),
    ],
    extra: [
      max('wall-pushup', 'Push-ups against a wall, body straight, chest to the wall.', [10, 20]),
      max('low-incline-pushup', 'Push-ups with hands on a low step or box, knee height or lower.', [8, 15]),
      max('bench-dip', 'Dips with the hands on a bench behind you, feet on the floor.', [8, 15]),
      max('negative-dip', 'From the top of the dip bars, lower for at least three seconds. Count controlled reps.', [3, 5]),
      max('diamond-pushup', 'Push-ups with the hands together under the chest, elbows close.', [5, 12]),
      max('decline-pushup', 'Push-ups with the feet on a box or bench.', [6, 12]),
      max('elevated-pike-pushup', 'Pike push-ups with the feet on a box, hips over the shoulders.', [4, 8]),
      max('archer-pushup', 'Archer push-ups: one arm bends, the other stays straight. Count the weaker side.', [3, 6]),
    ],
  },
  {
    id: 'core', minutes: 5, setup: 'Floor space and mats. A bar for the advanced test.',
    tests: [
      max('plank', 'Forearm plank in a straight line. Stop when the hips sag.', [30, 60]),
      max('dead-bug', 'Opposite arm and leg lower slowly, lower back stays down. Count total reps.', [10, 20], { when: [[{ test: 'plank', lte: 29 }]] }),
      max('hollow-hold', 'Hollow body hold, lower back pressed into the floor.', [20, 40], { when: [[{ test: 'plank', gte: 30 }]] }),
      max('tuck-l-sit', 'Supported on the hands, knees tucked, feet off the floor. Hold.', [10, 20], { when: [[{ test: 'hollow-hold', gte: 20 }]] }),
      max('l-sit', 'L-sit with straight legs at horizontal. Zero is a valid answer.', [5, 15], { when: [[{ test: 'tuck-l-sit', gte: 15 }]] }),
      max('hanging-leg-raise', 'From a still hang, straight legs to horizontal.', [5, 10], { when: [[{ test: 'hollow-hold', gte: 45 }]] }),
      max('toes-to-bar', 'Strict toes-to-bar, no swing.', [3, 8], { when: [[{ test: 'hanging-leg-raise', gte: 8 }]] }),
    ],
    extra: [
      max('side-plank', 'Side plank on the forearm, hips high. Count the weaker side.', [20, 45]),
      max('hollow-rock', 'Rock in the hollow position without losing the shape.', [10, 20]),
      max('hanging-knee-raise', 'From a still hang, knees to hip height without swinging.', [6, 12]),
      max('ab-wheel-knee', 'Ab-wheel roll-outs from the knees, back stays flat.', [5, 10]),
    ],
  },
  {
    id: 'legs', minutes: 5, setup: 'Floor space and a box or chair. Something to hold for the assisted squat.',
    tests: [
      max('squat', 'Bodyweight squats, hips below knees, heels down.', [15, 30]),
      max('box-squat', 'Sit back to a knee-height box and stand, without dropping.', [10, 20], { when: [[{ test: 'squat', lte: 9 }]] }),
      max('glute-bridge', 'Glute bridges with a one-second pause at the top.', [12, 25], { when: [[{ test: 'squat', lte: 9 }]] }),
      max('split-squat', 'Split squats, back knee to the floor. Each side; record the weaker.', [8, 15], { when: [[{ test: 'squat', gte: 10 }]] }),
      max('single-leg-bridge', 'Single-leg glute bridges, hips level. Each side; record the weaker.', [8, 15], { when: [[{ test: 'squat', gte: 10 }]] }),
      max('assisted-pistol', 'Single-leg squat to full depth, a hand on a support for balance only.', [3, 6], { when: [[{ test: 'squat', gte: 20 }]] }),
      max('pistol-squat', 'Pistol squats without support. Zero is a valid answer.', [1, 5], { when: [[{ test: 'assisted-pistol', gte: 4 }]] }),
      max('shrimp-squat', 'Shrimp squats, back knee to the floor behind you.', [1, 5], { when: [[{ test: 'pistol-squat', gte: 3 }]] }),
    ],
    extra: [
      max('wall-sit', 'Back flat on the wall, thighs parallel to the floor. Hold.', [30, 60]),
      max('calf-raise', 'Single-leg calf raises, full range. Count the weaker side.', [10, 20]),
      max('bulgarian-split-squat', 'Rear foot on a bench, front thigh to parallel. Count the weaker side.', [6, 12]),
      max('cossack-squat', 'Side-to-side deep squat, the straight leg flat on the heel. Count the weaker side.', [5, 10]),
      max('nordic-negative', 'Knees anchored, lower the body forward as slowly as you can. Count controlled reps.', [3, 5]),
    ],
  },
  {
    id: 'handstand', minutes: 7, setup: 'Clear wall space, one person per metre of wall. A box for the pike hold.',
    tests: [
      max('wall-walk', 'From a push-up position, walk the feet up the wall and back down. Zero is a valid answer.', [1, 3]),
      max('pike-hold', 'Feet on a box, hips over shoulders, arms locked. Hold.', [20, 45], { when: [[{ test: 'wall-walk', lte: 1 }]] }),
      max('crow-pose', 'Knees on the upper arms, feet off the floor. Zero is a valid answer.', [5, 20]),
      max('chest-to-wall-hs', 'Walk up to a chest-to-wall handstand, toes only on the wall. Hold.', [20, 45], { when: [[{ test: 'wall-walk', gte: 2 }]] }),
      max('wall-shoulder-taps', 'In the chest-to-wall handstand, alternate shoulder taps. Count total.', [6, 12], { when: [[{ test: 'chest-to-wall-hs', gte: 30 }]] }),
      max('freestanding-hs', 'Freestanding handstand. Best of three attempts, hands still.', [3, 15], { when: [[{ test: 'chest-to-wall-hs', gte: 30 }]] }),
      max('hs-shoulder-taps', 'Shoulder taps in a freestanding handstand.', [2, 6], { when: [[{ test: 'freestanding-hs', gte: 15 }]] }),
    ],
    extra: [
      max('back-to-wall-hs', 'Kick up with your back to the wall, body straight, heels lightly on the wall. Hold.', [15, 40]),
      max('elbow-lever', 'Body horizontal, balanced on the elbows at the hips. Hold.', [5, 15]),
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
      max('deep-squat-hold', 'Rest in a deep squat, heels flat, no support.', [30, 90]),
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
      max('bridge', 'Press up into a full bridge with locked arms. Zero is a valid answer.', [10, 30], { when: [[{ test: 'overhead', gte: 1 }]] }),
    ],
    extra: [
      max('deep-lunge', 'Deep lunge, back knee down, hips sinking forward. Count the tighter side.', [30, 60]),
      max('reverse-plank', 'Hands behind you, hips up, body straight from shoulders to heels. Hold.', [20, 45]),
    ],
  },
]

export const stationById = Object.fromEntries(STATIONS.map((s) => [s.id, s])) as Record<DisciplineId, Station>
/** Guided tests first, in their original order, then the menu-only ones: hand-in links address tests by this position. */
export const ALL_TESTS = [...STATIONS.flatMap((s) => s.tests), ...STATIONS.flatMap((s) => s.extra)]
export const testById: Record<string, AssessmentTest> = Object.fromEntries(ALL_TESTS.map((t) => [t.id, t]))
export const stationOfTest: Record<string, DisciplineId> = Object.fromEntries(STATIONS.flatMap((s) => [...s.tests, ...s.extra].map((t) => [t.id, s.id])))

export const estimateMinutes = (stations: DisciplineId[]) => stations.reduce((n, s) => n + stationById[s].minutes, 0)

// ── The station menu ─────────────────────────────────────────────────────
//
// In station mode an athlete chooses which variations to perform. The menu
// shows every test of the station, grouped by movement pattern (a knee push-up
// and a pike push-up do not sit on one ladder) and ordered within each group
// by how much a performance at the bottom of its target range is worth on the
// scoring curves. That ordering is read from the same curves that rate the
// result, so the menu and the rating cannot disagree.

/** Rating points of a performance at the low end of the test's target: its difficulty. */
export function difficultyOf(t: AssessmentTest): number {
  if (t.kind === 'choice') {
    const first = t.options?.find((o) => o.ev.length)
    return first ? Math.max(...first.ev.map(([ex, v]) => curveRating(exerciseById[ex]?.curve, v))) : 0
  }
  return curveRating(exerciseById[t.exerciseId]?.curve, t.target?.[0] ?? 1)
}

export interface MenuSection {
  /** Movement pattern, from the exercise library. */
  category: string
  tests: AssessmentTest[]
}

export function menuOf(station: Station): MenuSection[] {
  const all = [...station.tests, ...station.extra]
  const sections = new Map<string, AssessmentTest[]>()
  for (const t of all) {
    const category = exerciseById[t.exerciseId].category
    sections.set(category, [...(sections.get(category) ?? []), t])
  }
  return [...sections.entries()]
    .map(([category, tests]) => ({ category, tests: tests.sort((a, b) => difficultyOf(a) - difficultyOf(b)) }))
    .sort((a, b) => difficultyOf(a.tests[0]) - difficultyOf(b.tests[0]))
}

/** The next harder variation of the same movement pattern, if the menu has one. */
export function harderThan(t: AssessmentTest): AssessmentTest | null {
  const station = stationById[stationOfTest[t.id]]
  const section = menuOf(station).find((s) => s.tests.some((x) => x.id === t.id))
  if (!section) return null
  const i = section.tests.findIndex((x) => x.id === t.id)
  return section.tests[i + 1] ?? null
}

// ── A station as levels ──────────────────────────────────────────────────
//
// For choosing, an athlete sees a station as one list of levels: every
// variation, easiest first, level 1 at the top. They can start from the level
// they think is their hardest; they then do that one and the two below it.

/** Every variation of a station, easiest first. Level n is the nth. */
export const ladderOf = (station: Station): AssessmentTest[] =>
  menuOf(station).flatMap((s) => s.tests).sort((a, b) => difficultyOf(a) - difficultyOf(b))

/** How many levels are done below the one someone starts from. */
export const LEVELS_BELOW = 2

/**
 * Starting from the level someone thinks is their hardest: that one first, then the levels just below it, nearest
 * first. What is already on record is not asked again.
 */
export function fromLevel(station: Station, id: string, results: Results = {}): string[] {
  const ladder = ladderOf(station)
  const at = ladder.findIndex((t) => t.id === id)
  if (at < 0 || results[id]) return []
  const below = ladder.slice(0, at).filter((t) => !results[t.id]).reverse().slice(0, LEVELS_BELOW)
  return [id, ...below.map((t) => t.id)]
}

/** Every level not yet on record, from the first. */
export const allLevels = (station: Station, results: Results = {}): string[] =>
  ladderOf(station).filter((t) => !results[t.id]).map((t) => t.id)

/**
 * The level to suggest to someone who went past the range of this one: the next one up, while this is the highest
 * they have shown. Once a harder level is on record or coming there is nothing to suggest: beating an easier level
 * afterwards says nothing new.
 */
export function levelAbove(t: AssessmentTest, results: Results = {}, coming: string[] = []): AssessmentTest | null {
  const ladder = ladderOf(stationById[stationOfTest[t.id]])
  const above = ladder.slice(ladder.findIndex((x) => x.id === t.id) + 1)
  return above.some((x) => results[x.id] || coming.includes(x.id)) ? null : above[0] ?? null
}

/** Past the top of the target range: worth suggesting the harder variation. Never a limit. */
export const beyondTarget = (t: AssessmentTest, value: number) => t.kind === 'max' && !!t.target && value > t.target[1]

/** Where most people should start in a station: the first benchmark of the guided path. */
export const entryTest = (station: Station) => station.tests[0]

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

export type AssessmentMode = 'guided' | 'stations'

/**
 * How far an athlete is with a station. Guided: through every benchmark the
 * path showed them. Stations: anything recorded counts as done, since the
 * athlete chose what to test; they can come back and add more.
 */
export function stationProgress(station: Station, results: Results, skipped: DisciplineId[] = [], mode: AssessmentMode = 'guided') {
  if (mode === 'stations') {
    const recorded = [...station.tests, ...station.extra].filter((t) => results[t.id]).length
    const state: StationState = skipped.includes(station.id) ? 'skipped' : recorded ? 'done' : 'todo'
    return { state, done: recorded, total: recorded }
  }
  const visible = visibleTests(station, results)
  const done = visible.filter((t) => results[t.id]).length
  const state: StationState = skipped.includes(station.id) ? 'skipped' : done === 0 ? 'todo' : done < visible.length ? 'active' : 'done'
  return { state, done, total: visible.length }
}

export function overallProgress(stations: DisciplineId[], results: Results, skipped: DisciplineId[] = [], mode: AssessmentMode = 'guided') {
  const states = stations.map((s) => stationProgress(stationById[s], results, skipped, mode).state)
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
  mode?: AssessmentMode
}

export const encodeInvite = (i: Invite) =>
  b64encode(JSON.stringify([1, i.id, i.protocol, i.title, i.groupName, i.coachName, i.courseId ?? '', i.stations.map((s) => LETTER[s]).join(''), i.kind === 'retest' ? 1 : 0, i.stationMinutes, i.mode === 'stations' ? 1 : 0]))

export function decodeInvite(data: string): Invite | null {
  try {
    const [v, id, protocol, title, groupName, coachName, courseId, letters, retest, stationMinutes, menuMode] = JSON.parse(b64decode(data))
    const stations = String(letters).split('').map((l) => FROM_LETTER[l]).filter(Boolean)
    if (v !== 1 || typeof id !== 'string' || !id || stations.length === 0) return null
    return { id, protocol: String(protocol), title: String(title), groupName: String(groupName), coachName: String(coachName), courseId: courseId || undefined, stations, kind: retest ? 'retest' : 'baseline', stationMinutes: Number(stationMinutes) || 6, mode: menuMode ? 'stations' : 'guided' }
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
export function needsAttention(participants: AssessmentParticipant[], stations: DisciplineId[], mode: AssessmentMode = 'guided'): Attention[] {
  const out: Attention[] = []
  for (const p of participants) {
    const reasons: string[] = []
    for (const s of p.flags) reasons.push(`Asked for help at ${disciplineById[s].short}`)
    for (const s of p.skipped) if (stations.includes(s)) reasons.push(`Skipped ${disciplineById[s].short}`)
    const untested = Object.values(p.results).filter((r) => r.skipped).length
    if (untested) reasons.push(`${untested} ${untested === 1 ? 'benchmark' : 'benchmarks'} could not be tested`)
    const progress = overallProgress(stations, p.results, p.skipped, mode)
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

// ── Groups: who starts where ─────────────────────────────────────────────
//
// A coach splits the class into groups so they do not all queue at the bar.
// Each group starts at a different station and rotates through the rest in
// the session's order. Someone the coach has not placed is assigned by the
// order they joined in, so groups fill evenly as people arrive.

export const groupCount = (s: { groups?: number; stations: DisciplineId[] }) => Math.max(1, Math.min(s.groups ?? 1, 12))

export function groupOf(p: AssessmentParticipant, participants: AssessmentParticipant[], groups: number): number {
  if (p.group !== undefined && p.group >= 0) return p.group % groups
  const order = [...participants].sort((a, b) => a.joinedAt.localeCompare(b.joinedAt) || a.id.localeCompare(b.id))
  return Math.max(0, order.findIndex((x) => x.id === p.id)) % groups
}

/** The stations in the order a group visits them. Groups start as far apart as the stations allow. */
export function rotationOf(group: number, groups: number, stations: DisciplineId[]): DisciplineId[] {
  const start = Math.floor((group * stations.length) / Math.max(1, groups)) % Math.max(1, stations.length)
  return [...stations.slice(start), ...stations.slice(0, start)]
}

// ── A re-test, read against the baseline ─────────────────────────────────

export interface BenchmarkChange {
  exerciseId: string
  before: number
  after: number
}

export interface ResultsComparison {
  /** Same benchmark, better result. */
  improved: BenchmarkChange[]
  /** A benchmark shown now that was not shown before: a new variation within reach. */
  added: BenchmarkChange[]
  /** Same benchmark, the same or a lower result. */
  held: BenchmarkChange[]
  /** Shown at the baseline, not tested this time. Not counted as a loss. */
  notRetested: BenchmarkChange[]
}

const bestByExercise = (results: Results) => {
  const out = new Map<string, number>()
  for (const [testId, r] of Object.entries(results)) {
    const t = testById[testId]
    if (!t) continue
    for (const [ex, v] of demonstrated(t, r)) out.set(ex, Math.max(out.get(ex) ?? 0, v))
  }
  return out
}

/** What changed between two assessments, benchmark by benchmark, hardest first. */
export function compareResults(before: Results, after: Results): ResultsComparison {
  const a = bestByExercise(before)
  const b = bestByExercise(after)
  const out: ResultsComparison = { improved: [], added: [], held: [], notRetested: [] }
  for (const [exerciseId, v] of b) {
    const was = a.get(exerciseId)
    if (was === undefined) out.added.push({ exerciseId, before: 0, after: v })
    else if (v > was) out.improved.push({ exerciseId, before: was, after: v })
    else out.held.push({ exerciseId, before: was, after: v })
  }
  for (const [exerciseId, v] of a) if (!b.has(exerciseId)) out.notRetested.push({ exerciseId, before: v, after: 0 })
  const hard = (c: BenchmarkChange) => -curveRating(exerciseById[c.exerciseId]?.curve, Math.max(c.after, c.before))
  for (const list of Object.values(out)) list.sort((x: BenchmarkChange, y: BenchmarkChange) => hard(x) - hard(y))
  return out
}
