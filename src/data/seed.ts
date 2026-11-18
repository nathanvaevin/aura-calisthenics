import type {
  AssessmentParticipant, AssessmentSession, Athlete, Audience, Course, CourseSession, DisciplineId, Enrollment, Evidence, EvidenceTier, Feedback, LogEntry,
  Place, Visit, WorkoutBlock, WorkoutLog,
} from '@/domain/types'
import { LISBON_SNAPSHOT } from './lisbonSnapshot'
import { PROTOCOL, nextTest, stationById, type Results } from '@/domain/assessment'
import { exerciseById, progressionById, stepAt } from '@/domain/catalog'
import { startOfWeek } from '@/domain/scoring/aura'
import { adaptTarget } from '@/domain/scoring/skills'
import { WORKOUT_TEMPLATES, buildWorkout } from '@/domain/training'
import { courseFromTemplate, uid } from './courseTemplates'

export const ME = 'me'
const DAY = 86400000

/** [exerciseId, value, daysAgo, tier] */
type Ev = [string, number, number, EvidenceTier?]

interface Persona {
  athlete: Omit<Athlete, 'joinedAt'>
  evidence: Ev[]
  /** Levels this athlete tends to move relative to what a coach assigns. */
  shift: number
  attendance: number
}

const everything: Athlete['equipment'] = ['floor', 'wall', 'bar', 'low_bar', 'dip_bars', 'box']

export const DEMO_ME: Persona = {
  athlete: {
    id: ME, name: 'Alex Rivera', handle: 'alex', bio: 'Chasing a thirty-second handstand and a first muscle-up.',
    city: 'Lisbon', roles: ['athlete', 'coach', 'admin'], goals: ['hs-free-30', 'pull-mu-1', 'core-lsit-30'], weeklyTarget: 4,
    equipment: [...everything, 'rings', 'parallettes'],
  },
  shift: 0,
  attendance: 0.88,
  evidence: [
    ['pike-hold', 45, 84], ['wall-walk', 4, 80], ['chest-to-wall-hs', 40, 78], ['back-to-wall-hs', 45, 70],
    ['headstand', 40, 60], ['crow-pose', 20, 66], ['chest-to-wall-hs', 60, 40, 'coach'], ['freestanding-hs', 4, 35],
    ['wall-shoulder-taps', 10, 30], ['crow-pose', 30, 20], ['freestanding-hs', 9, 16, 'coach'], ['freestanding-hs', 14, 4],
    ['dead-hang', 45, 84], ['negative-pullup', 5, 82], ['scap-pull', 12, 80], ['horizontal-row', 12, 75],
    ['pull-up', 5, 70], ['pull-up', 7, 42], ['dead-hang', 70, 30], ['chin-up', 10, 25], ['tuck-fl', 8, 12], ['pull-up', 9, 9],
    ['pushup', 18, 84], ['dip', 6, 60], ['pike-pushup', 10, 50], ['diamond-pushup', 12, 44], ['pushup', 26, 30],
    ['planche-lean', 25, 21], ['dip', 11, 14, 'coach'], ['elevated-pike-pushup', 6, 10],
    ['plank', 75, 84], ['hollow-hold', 35, 70], ['side-plank', 45, 62], ['hanging-knee-raise', 12, 55],
    ['tuck-l-sit', 25, 48], ['hollow-hold', 50, 22], ['hanging-leg-raise', 6, 18], ['l-sit', 6, 8],
    ['squat', 30, 84], ['split-squat', 15, 80], ['glute-bridge', 25, 77], ['wall-sit', 70, 66],
    ['single-leg-bridge', 12, 58], ['bulgarian-split-squat', 8, 45], ['calf-raise', 16, 33], ['assisted-pistol', 4, 15],
    ['deep-squat-hold', 90, 84], ['toe-touch', 30, 80], ['deep-lunge', 60, 72], ['overhead-wall-reach', 20, 68],
    ['reverse-plank', 45, 52], ['palms-floor-fold', 10, 20],
  ],
}

const PERSONAS: Persona[] = [
  {
    athlete: {
      id: 'elena', name: 'Elena Vasquez', handle: 'elena.balance', bio: 'Hand balance coach. Fifteen years upside down.',
      city: 'Barcelona', roles: ['athlete', 'coach'], goals: ['hs-oahs-30'], weeklyTarget: 5, equipment: everything,
    },
    shift: 2, attendance: 1,
    evidence: [
      ['freestanding-hs', 150, 300, 'coach'], ['one-arm-hs', 22, 120, 'video'], ['press-hs', 6, 200, 'coach'],
      ['tuck-hs', 40, 250], ['hs-shoulder-taps', 14, 180], ['straddle-hs', 60, 260], ['chest-to-wall-hs', 150, 320],
      ['wall-hspu', 8, 150], ['freestanding-hspu', 2, 90], ['pushup', 40, 300], ['dip', 16, 280], ['tuck-planche', 15, 140],
      ['pull-up', 12, 220], ['chin-up', 14, 200], ['tuck-fl', 20, 160], ['dead-hang', 90, 300],
      ['l-sit', 45, 210], ['v-sit', 12, 100], ['hollow-hold', 120, 290], ['toes-to-bar', 12, 170],
      ['pistol-squat', 6, 230], ['shrimp-squat', 4, 190], ['squat', 50, 300],
      ['pancake', 40, 240, 'coach'], ['seated-pike', 45, 250], ['front-split', 30, 150], ['bridge', 60, 270], ['straight-bridge', 12, 110],
    ],
  },
  {
    athlete: {
      id: 'maya', name: 'Maya Okafor', handle: 'maya.inverts', bio: 'Circus-trained. One arm at a time.',
      city: 'Berlin', roles: ['athlete'], goals: ['hs-oahs-10', 'push-fhspu-1'], weeklyTarget: 5, equipment: everything,
    },
    shift: 2, attendance: 0.95,
    evidence: [
      ['freestanding-hs', 95, 200, 'coach'], ['one-arm-hs', 6, 40, 'coach'], ['press-hs', 4, 90, 'coach'], ['tuck-hs', 25, 150],
      ['hs-shoulder-taps', 10, 70], ['straddle-hs', 40, 180], ['chest-to-wall-hs', 120, 240], ['crow-pose', 60, 260], ['elbow-lever', 30, 230],
      ['wall-hspu', 6, 60], ['pushup', 35, 220], ['dip', 14, 190], ['planche-lean', 40, 130], ['tuck-planche', 8, 50],
      ['pull-up', 8, 170], ['dead-hang', 80, 250], ['horizontal-row', 15, 210], ['chin-up', 9, 140],
      ['l-sit', 35, 110], ['v-sit', 4, 30], ['hollow-hold', 90, 200], ['toes-to-bar', 8, 80],
      ['pistol-squat', 4, 100], ['squat', 40, 260], ['shrimp-squat', 2, 45], ['single-leg-bridge', 15, 230],
      ['pancake', 20, 85, 'coach'], ['seated-pike', 30, 160], ['front-split', 15, 55], ['bridge', 40, 190], ['palms-floor-fold', 30, 250],
    ],
  },
  {
    athlete: {
      id: 'jonas', name: 'Jonas Weber', handle: 'jonas.bar', bio: 'Bar park regular. Levers before breakfast.',
      city: 'Munich', roles: ['athlete'], goals: ['pull-oap-1', 'push-pl-straddle-5'], weeklyTarget: 5, equipment: [...everything, 'rings'],
    },
    shift: 2, attendance: 0.9,
    evidence: [
      ['pull-up', 22, 120, 'coach'], ['muscle-up', 6, 60, 'coach'], ['front-lever', 4, 25], ['straddle-fl', 8, 70],
      ['chest-to-bar', 12, 140], ['archer-pullup', 4, 90], ['back-lever', 8, 110], ['explosive-pullup', 5, 150],
      ['dip', 28, 130], ['pushup', 50, 200], ['ring-dip', 8, 80], ['wall-hspu', 3, 45], ['tuck-planche', 12, 65], ['pseudo-planche-pushup', 12, 100],
      ['toes-to-bar', 14, 95], ['l-sit', 25, 125], ['dragon-flag', 3, 35], ['windshield-wipers', 6, 75], ['hollow-hold', 70, 180],
      ['chest-to-wall-hs', 45, 160], ['freestanding-hs', 5, 20], ['crow-pose', 20, 170],
      ['squat', 40, 190], ['bulgarian-split-squat', 12, 115], ['pistol-squat', 1, 15],
      ['toe-touch', 10, 175], ['deep-squat-hold', 60, 185], ['deep-lunge', 45, 165],
    ],
  },
  {
    athlete: {
      id: 'lina', name: 'Lina Park', handle: 'lina.moves', bio: 'A bit of everything, three mornings a week.',
      city: 'Lisbon', roles: ['athlete'], goals: ['pull-fl-advtuck-10', 'hs-free-60'], weeklyTarget: 3, equipment: everything,
    },
    shift: 1, attendance: 0.92,
    evidence: [
      ['freestanding-hs', 32, 30, 'coach'], ['straddle-hs', 12, 22], ['wall-shoulder-taps', 16, 60], ['chest-to-wall-hs', 75, 90],
      ['pull-up', 11, 45, 'coach'], ['chest-to-bar', 4, 20], ['tuck-fl', 18, 50], ['adv-tuck-fl', 6, 12], ['horizontal-row', 18, 100],
      ['dip', 14, 40], ['pushup', 32, 85, 'coach'], ['wall-hspu', 1, 8], ['elevated-pike-pushup', 10, 55], ['archer-pushup', 5, 28],
      ['l-sit', 22, 35], ['toes-to-bar', 7, 48], ['hollow-hold', 75, 95, 'coach'], ['dragon-flag-negative', 3, 18],
      ['pistol-squat', 5, 42], ['shrimp-squat', 3, 26], ['nordic-negative', 5, 16], ['squat', 50, 110],
      ['palms-floor-fold', 30, 80], ['pancake-elbows', 20, 38], ['bridge', 30, 52], ['seated-pike', 10, 14],
    ],
  },
  {
    athlete: {
      id: 'ines', name: 'Ines Dubois', handle: 'ines.flow', bio: 'Former dancer. Strength is the new project.',
      city: 'Lyon', roles: ['athlete'], goals: ['hs-press-1', 'pull-5'], weeklyTarget: 4, equipment: ['floor', 'wall', 'bar', 'box'],
    },
    shift: 0, attendance: 0.85,
    evidence: [
      ['middle-split', 20, 300, 'coach'], ['front-split', 40, 300, 'coach'], ['pancake', 45, 280], ['straight-bridge', 15, 200],
      ['bridge', 60, 260], ['seated-pike', 45, 290],
      ['freestanding-hs', 6, 12], ['chest-to-wall-hs', 60, 30, 'coach'], ['headstand', 60, 150], ['crow-pose', 25, 45],
      ['l-sit', 15, 40], ['hollow-hold', 60, 70], ['hanging-leg-raise', 10, 55],
      ['pushup', 18, 60], ['pike-pushup', 8, 25], ['dip', 3, 18],
      ['pull-up', 3, 20], ['horizontal-row', 10, 65], ['dead-hang', 50, 80],
      ['pistol-squat', 3, 75], ['cossack-squat', 10, 120], ['squat', 35, 140],
    ],
  },
  {
    athlete: {
      id: 'priya', name: 'Priya Nair', handle: 'priya.n', bio: 'Climber adding handstands to the mix.',
      city: 'Lisbon', roles: ['athlete'], goals: ['hs-free-10', 'push-dip-10'], weeklyTarget: 3, equipment: everything,
    },
    shift: 0, attendance: 0.78,
    evidence: [
      ['pull-up', 8, 90], ['dead-hang', 100, 120], ['horizontal-row', 15, 100], ['chin-up', 9, 60], ['tuck-fl', 6, 30],
      ['pushup', 14, 80], ['dip', 4, 35], ['pike-pushup', 6, 22],
      ['chest-to-wall-hs', 35, 15], ['back-to-wall-hs', 40, 28], ['crow-pose', 12, 20], ['wall-walk', 3, 40],
      ['hollow-hold', 40, 50], ['hanging-knee-raise', 15, 70], ['hanging-leg-raise', 5, 26], ['plank', 90, 110],
      ['squat', 30, 95], ['bulgarian-split-squat', 6, 44], ['wall-sit', 60, 85],
      ['deep-squat-hold', 120, 105], ['toe-touch', 30, 75], ['deep-lunge', 60, 66],
    ],
  },
  {
    athlete: {
      id: 'tomas', name: 'Tomás Silva', handle: 'tomas.s', bio: 'Started in January. First push-up was week three.',
      city: 'Porto', roles: ['athlete'], goals: ['push-10', 'pull-first'], weeklyTarget: 3, equipment: ['floor', 'wall', 'bar', 'low_bar', 'box'],
    },
    shift: -1, attendance: 0.7,
    evidence: [
      ['knee-pushup', 12, 40], ['incline-pushup', 15, 55], ['pushup', 4, 12],
      ['dead-hang', 25, 30], ['incline-row', 10, 26], ['scap-pull', 4, 14],
      ['plank', 40, 35], ['dead-bug', 16, 50], ['hollow-hold', 12, 10],
      ['pike-hold', 20, 18], ['wall-walk', 1, 8],
      ['squat', 22, 45], ['split-squat', 8, 20], ['glute-bridge', 20, 48], ['wall-sit', 40, 32],
      ['deep-squat-hold', 40, 38], ['deep-lunge', 30, 24],
    ],
  },
  {
    athlete: {
      id: 'ben', name: 'Ben Carter', handle: 'bencarter', bio: 'Desk job, garage bar, stubborn.',
      city: 'Lisbon', roles: ['athlete'], goals: ['pull-5', 'push-20'], weeklyTarget: 3, equipment: ['floor', 'wall', 'bar', 'low_bar', 'dip_bars', 'box'],
    },
    shift: 0, attendance: 0.82,
    evidence: [
      ['pushup', 12, 60], ['knee-pushup', 20, 90], ['bench-dip', 12, 40], ['pike-pushup', 5, 16],
      ['dead-hang', 45, 50], ['horizontal-row', 9, 33], ['negative-pullup', 4, 20], ['scap-pull', 10, 44],
      ['plank', 70, 70], ['hollow-hold', 25, 28], ['hanging-knee-raise', 8, 18],
      ['squat', 30, 75], ['split-squat', 12, 36], ['glute-bridge', 25, 80],
      ['pike-hold', 30, 22], ['toe-touch', 10, 30], ['deep-squat-hold', 60, 52],
    ],
  },
]

function rng(seed: string) {
  let h = 1779033703
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
  let a = h >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const iso = (t: number) => new Date(t).toISOString()
export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const sessionDate = (course: Pick<Course, 'startDate'>, weekIndex: number, day: number) => {
  const d = new Date(`${course.startDate}T00:00:00`)
  d.setDate(d.getDate() + weekIndex * 7 + day)
  return d
}

const toEvidence = (athleteId: string, rows: Ev[], now: number): Evidence[] =>
  rows.map(([exerciseId, value, daysAgo, tier = 'self']) => ({
    id: uid(),
    athleteId,
    exerciseId,
    value,
    tier,
    source: 'manual' as const,
    date: iso(now - daysAgo * DAY),
    ...(tier === 'coach' || tier === 'video' ? { verifiedBy: 'elena', verifiedAt: iso(now - daysAgo * DAY) } : {}),
  }))

/** A plausible completed log for a set of blocks. */
function simulate(
  athleteId: string,
  title: string,
  source: WorkoutLog['source'],
  blocks: WorkoutBlock[],
  when: Date,
  shift: number,
  seed: string,
): WorkoutLog {
  const r = rng(seed)
  const entries: LogEntry[] = blocks.map((b) => {
    const assigned = exerciseById[b.exerciseId]
    let level = b.level
    let exerciseId = b.exerciseId
    if (b.progressionId && b.level) {
      const max = progressionById[b.progressionId].steps.length
      const wobble = r() < 0.25 ? (r() < 0.5 ? -1 : 1) : 0
      level = Math.max(b.minLevel ?? 1, Math.min(b.maxLevel ?? max, max, Math.max(1, b.level + shift + wobble)))
      if (level !== b.level) exerciseId = stepAt(b.progressionId, level)!.exerciseId
    }
    const ex = exerciseById[exerciseId]
    const target = adaptTarget(assigned, b.target, ex, (level ?? 0) - (b.level ?? 0))
    return {
      blockId: b.id,
      kind: b.kind,
      progressionId: b.progressionId,
      assignedExerciseId: b.exerciseId,
      assignedLevel: b.level,
      assignedTarget: b.target,
      exerciseId,
      level,
      target,
      rest: b.rest,
      minLevel: b.minLevel,
      maxLevel: b.maxLevel,
      note: b.note,
      sets: Array.from({ length: b.sets }, (_, i) => {
        const fade = i === b.sets - 1 && r() < 0.5 ? 0.8 : 1
        const value = Math.max(1, Math.round(target * (0.9 + r() * 0.2) * fade))
        return { value, done: true, exerciseId, level }
      }),
    }
  })
  const start = new Date(when)
  start.setHours(7 + Math.floor(r() * 12), Math.floor(r() * 60), 0, 0)
  const minutes = 25 + Math.floor(r() * 25)
  return {
    id: uid(),
    athleteId,
    title,
    source,
    startedAt: start.toISOString(),
    finishedAt: iso(start.getTime() + minutes * 60000),
    rpe: 5 + Math.floor(r() * 4),
    entries,
  }
}

function courseLogs(course: Course, athleteId: string, persona: Persona, now: Date) {
  const logs: WorkoutLog[] = []
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  course.weeks.forEach((w, wi) =>
    w.sessions.forEach((s: CourseSession) => {
      const date = sessionDate(course, wi, s.day)
      if (date >= today) return
      if (rng(`${athleteId}:${course.title}:${wi}:${s.day}`)() > persona.attendance) return
      logs.push(
        simulate(athleteId, s.title, { type: 'course', courseId: course.id, sessionId: s.id }, s.blocks, date, persona.shift, `${athleteId}${wi}${s.day}`),
      )
    }),
  )
  return logs
}

/** Answer the assessment the way this athlete plausibly would have, from what they have on record. */
function simulateResults(rows: Ev[], stations: DisciplineId[], at: string, factor: number, r: () => number): Results {
  const best = new Map<string, number>()
  for (const [id, v] of rows) best.set(id, Math.max(best.get(id) ?? 0, v))
  const floor: Record<string, number> = { 'dead-hang': 30, pushup: 8, plank: 45, squat: 20, 'wall-walk': 2, 'deep-squat-hold': 45, 'crow-pose': 5 }
  const choice = (id: string) =>
    id === 'fold' ? (best.has('seated-pike') ? 3 : best.has('palms-floor-fold') ? 2 : best.has('toe-touch') ? 1 : 0)
    : id === 'overhead' ? ((best.get('overhead-wall-reach') ?? 10) >= 30 ? 2 : 1)
    : id === 'straddle' ? (best.has('pancake') ? 2 : best.has('pancake-elbows') ? 1 : 0)
    : 0
  const results: Results = {}
  for (const station of stations) {
    // A coach tends to watch a whole station at a time, so the tier is drawn once per station.
    const roll = r()
    for (let guard = 0; guard < 12; guard++) {
      const t = nextTest(stationById[station], results)
      if (!t) break
      const value = t.kind === 'choice' ? choice(t.id) : Math.round((best.get(t.exerciseId) ?? floor[t.id] ?? 0) * factor)
      results[t.id] = { value, tier: roll < 0.12 ? 'coach' : roll < 0.5 ? 'observed' : 'self', at }
    }
  }
  return results
}

export interface World {
  athletes: Record<string, Athlete>
  evidence: Evidence[]
  logs: WorkoutLog[]
  courses: Course[]
  enrollments: Enrollment[]
  feedback: Feedback[]
  following: string[]
  assessments: AssessmentSession[]
  participants: AssessmentParticipant[]
  places: Record<string, Place>
  visits: Visit[]
  follows: Record<string, string[]>
  mapView: { lat: number; lon: number; zoom: number } | null
}

// Places in the Lisbon snapshot that the sample athletes use.
const CALHAU = 'osm:n4919127270'
const NORTH_PARK = 'osm:n10831779151'
const RINGS_PARK = 'osm:w741783517'

/** Identity, places and privacy choices of the sample athletes. `me` applies to the demo athlete only. */
const IDENTITIES: Record<string, Partial<Athlete>> = {
  [ME]: {
    from: 'Porto, Portugal', environments: ['outdoor', 'studio'], homePlaceId: CALHAU, favouritePlaces: [NORTH_PARK], openToTrain: true,
    privacy: { origin: 'everyone', base: 'everyone', places: 'following', visits: 'following' },
  },
  elena: { from: 'Valencia, Spain', environments: ['studio'] },
  maya: { from: 'Lagos, Nigeria', environments: ['studio', 'outdoor'], openToTrain: true },
  jonas: { from: 'Hamburg, Germany', environments: ['outdoor'] },
  lina: {
    from: 'Seoul, South Korea', environments: ['outdoor'], homePlaceId: NORTH_PARK, favouritePlaces: [CALHAU], openToTrain: true,
    privacy: { origin: 'everyone', base: 'everyone', places: 'everyone', visits: 'everyone' },
  },
  ines: { from: 'Marseille, France', environments: ['studio', 'home'] },
  priya: {
    from: 'Kochi, India', environments: ['gym', 'outdoor'], homePlaceId: RINGS_PARK, openToTrain: true,
    privacy: { origin: 'everyone', base: 'everyone', places: 'following', visits: 'following' },
  },
  // Saved a place he has not been to: a favourite is not attendance.
  tomas: { from: 'Braga, Portugal', environments: ['outdoor'], favouritePlaces: [CALHAU], privacy: { origin: 'everyone', base: 'everyone', places: 'everyone', visits: 'me' } },
  // Trains at Calhau every week and shows it to nobody.
  ben: { from: 'Leeds, England', environments: ['outdoor', 'home'], homePlaceId: CALHAU, privacy: { origin: 'following', base: 'everyone', places: 'me', visits: 'me' } },
}

/** How the sample athletes chose to look: one in each universe, so the demo shows what a choice does. */
const STYLES: Record<string, { theme: 'dark' | 'light' | 'power' | 'iron'; character: 'male' | 'female'; form: string; interests: Athlete['interests'] }> = {
  elena: { theme: 'light', character: 'female', form: 'solar', interests: ['handstand', 'mobility'] },
  maya: { theme: 'power', character: 'female', form: 'awakened', interests: ['push', 'core'] },
  jonas: { theme: 'iron', character: 'male', form: 'tempered', interests: ['pull', 'legs'] },
  lina: { theme: 'power', character: 'female', form: 'ignition', interests: ['pull', 'handstand'] },
  priya: { theme: 'dark', character: 'female', form: 'lunar', interests: ['core', 'mobility'] },
  tomas: { theme: 'iron', character: 'male', form: 'pressure', interests: ['push'] },
}

/** Who the sample athletes follow: the circle their "people I follow" setting opens to. */
const FOLLOWS: Record<string, string[]> = { lina: [ME, 'priya', 'maya'], priya: [ME, 'lina'], maya: ['elena'], tomas: [ME], ben: [] }

/**
 * The sample community around the Lisbon snapshot. Stays are dated relative to
 * `now`; the two live ones run out like any real check-in would.
 */
export function sampleCommunity(now: Date, demoMe: boolean) {
  const t = now.getTime()
  const visits: Visit[] = []
  const stay = (athleteId: string, placeId: string, startMs: number, minutes: number, audience: Audience, onSite: boolean) =>
    visits.push({ id: uid(), athleteId, placeId, startedAt: iso(startMs), endsAt: iso(startMs + minutes * 60000), audience, onSite, sample: true })
  const weekly = (athleteId: string, placeId: string, weeks: number, days: number[], audience: Audience) => {
    for (let w = weeks; w >= 1; w--) for (const d of days) stay(athleteId, placeId, t - (w * 7 - d) * DAY - 3 * 3600000, 80, audience, true)
  }
  weekly('lina', NORTH_PARK, 7, [1, 4], 'everyone')
  weekly('priya', RINGS_PARK, 6, [2], 'everyone')
  weekly('ben', CALHAU, 8, [3], 'me')
  stay('priya', CALHAU, t - 9 * DAY, 70, 'everyone', true)
  stay('priya', CALHAU, t - 3 * DAY, 60, 'everyone', false)
  // Live as the demo opens.
  stay('lina', NORTH_PARK, t - 35 * 60000, 90, 'everyone', true)
  stay('priya', CALHAU, t - 10 * 60000, 90, 'following', false)
  if (demoMe) weekly(ME, CALHAU, 6, [0, 5], 'following')
  visits.sort((a, b) => a.startedAt.localeCompare(b.startedAt))

  const identities = Object.fromEntries(Object.entries(IDENTITIES).filter(([id]) => demoMe || id !== ME))
  return {
    places: Object.fromEntries(LISBON_SNAPSHOT.map((p) => [p.id, p])) as Record<string, Place>,
    visits,
    follows: FOLLOWS,
    identities,
    mapView: demoMe ? { lat: 38.7405, lon: -9.158, zoom: 12.4 } : null,
  }
}

/**
 * Sample world, dated relative to `now` so it always looks current.
 * `demoMe` adds a fully populated athlete with history; otherwise the caller
 * supplies the signed-in athlete and only the surroundings are seeded.
 */
export function buildWorld(now: Date, demoMe: boolean): World {
  const t = now.getTime()
  const monday = startOfWeek(now)
  const mondayOffset = (weeks: number) => isoDay(new Date(monday.getTime() + weeks * 7 * DAY))

  // The demo athlete's older entries become a baseline from before the 12-week window.
  const demo: Persona = { ...DEMO_ME, evidence: DEMO_ME.evidence.map(([id, v, d, tier]) => [id, v, d >= 60 ? d + 45 : d, tier]) }
  const personas = demoMe ? [demo, ...PERSONAS] : PERSONAS
  const byId = Object.fromEntries(personas.map((p) => [p.athlete.id, p]))
  const athletes: Record<string, Athlete> = Object.fromEntries(
    personas.map((p) => [p.athlete.id, { ...p.athlete, joinedAt: iso(t - 320 * DAY) }]),
  )
  const community = sampleCommunity(now, demoMe)
  for (const [id, identity] of Object.entries(community.identities)) if (athletes[id]) athletes[id] = { ...athletes[id], ...identity }
  for (const [id, look] of Object.entries(STYLES)) {
    if (!athletes[id]) continue
    const universe = look.theme === 'power' || look.theme === 'iron' ? look.theme : 'aura'
    athletes[id] = { ...athletes[id], interests: look.interests, style: { theme: look.theme, character: look.character, forms: { [universe]: look.form }, finishes: {}, intensity: 60, muscles: true, steps: { theme: iso(t - 30 * DAY), character: iso(t - 30 * DAY) } } }
  }
  const evidence = personas.flatMap((p) => toEvidence(p.athlete.id, p.evidence, t))

  const handstand = courseFromTemplate('handstand-foundations', 'elena', mondayOffset(-2), { status: 'active' })
  // In the demo the signed-in athlete coaches this course; otherwise it is simply one to discover.
  const fundamentals = courseFromTemplate('calisthenics-fundamentals', demoMe ? ME : 'elena', mondayOffset(-1), { status: 'active' })
  const courses = [handstand, fundamentals]

  const enrol = (course: Course, ids: string[]): Enrollment[] =>
    ids.map((athleteId) => ({ id: uid(), courseId: course.id, athleteId, joinedAt: `${course.startDate}T08:00:00.000Z`, status: 'active' }))
  const enrollments = [
    ...enrol(handstand, [...(demoMe ? [ME] : []), 'ines', 'priya', 'lina', 'tomas']),
    ...enrol(fundamentals, ['tomas', 'ben', 'priya', 'ines']),
  ]

  const logs: WorkoutLog[] = []
  for (const e of enrollments) {
    const course = courses.find((c) => c.id === e.courseId)!
    logs.push(...courseLogs(course, e.athleteId, byId[e.athleteId], now))
  }

  if (demoMe) {
    // Earlier self-directed training, so consistency has a history to show.
    for (let w = 11; w >= 3; w--) {
      const r = rng(`me-week-${w}`)
      const count = 2 + Math.floor(r() * 3)
      for (let i = 0; i < count; i++) {
        const tpl = WORKOUT_TEMPLATES[Math.floor(r() * WORKOUT_TEMPLATES.length)]
        const when = new Date(monday.getTime() - w * 7 * DAY + Math.floor(r() * 7) * DAY)
        logs.push(simulate(ME, tpl.title, { type: 'library', workoutId: tpl.id }, buildWorkout(tpl, []).blocks, when, 2, `me${w}${i}`))
      }
    }
  }
  // Other athletes get an attendance record only, so their consistency reads plausibly
  // without storing set-by-set detail nobody will open.
  for (const p of PERSONAS) {
    const enrolled = enrollments.some((e) => e.athleteId === p.athlete.id)
    for (let w = 9; w >= (enrolled ? 3 : 0); w--) {
      const r = rng(`${p.athlete.id}-week-${w}`)
      const count = Math.max(0, Math.round(p.athlete.weeklyTarget * p.attendance + (r() - 0.5) * 1.6))
      for (let i = 0; i < count; i++) {
        const tpl = WORKOUT_TEMPLATES[Math.floor(r() * WORKOUT_TEMPLATES.length)]
        const start = monday.getTime() - w * 7 * DAY + Math.floor(r() * 7) * DAY + (7 + Math.floor(r() * 12)) * 3600000
        if (start > t) continue
        logs.push({ id: uid(), athleteId: p.athlete.id, title: tpl.title, source: { type: 'library', workoutId: tpl.id }, startedAt: iso(start), finishedAt: iso(start + 35 * 60000), entries: [] })
      }
    }
  }
  logs.sort((a, b) => a.startedAt.localeCompare(b.startedAt))

  // Bests logged in class and still waiting for the coach to confirm them.
  const claim = (athleteId: string, courseId: string, exerciseId: string, value: number, note: string) => {
    const log = [...logs].reverse().find((l) => l.athleteId === athleteId && l.source.type === 'course' && l.source.courseId === courseId)
    if (!log) return
    evidence.push({ id: uid(), athleteId, exerciseId, value, tier: 'self', source: 'workout', date: log.finishedAt!, logId: log.id, note })
  }
  claim('tomas', fundamentals.id, 'pushup', 7, 'Chest to floor on every rep.')
  claim('ben', fundamentals.id, 'pull-up', 1, 'First one. Dead hang, chin over.')
  claim('priya', fundamentals.id, 'horizontal-row', 18, '')
  claim('ines', fundamentals.id, 'pushup', 21, '')

  const feedback: Feedback[] = []
  if (demoMe) {
    const mine = logs.filter((l) => l.athleteId === ME && l.source.type === 'course').slice(-4)
    const notes = [
      'Good line on the chest-to-wall holds. Next session, squeeze the legs together before you kick; it will stop the drift at the hips.',
      'Fourteen seconds, and clean. Your fingers are doing the work now. Keep the sets short and stop while the balance is still good.',
    ]
    mine.slice(-2).forEach((log, i) =>
      feedback.push({ id: uid(), logId: log.id, coachId: 'elena', athleteId: ME, text: notes[i], date: iso(new Date(log.finishedAt!).getTime() + 5 * 3600000) }),
    )
  }
  const tomasLog = logs.find((l) => l.athleteId === 'tomas' && l.source.type === 'course' && l.source.courseId === fundamentals.id)
  if (tomasLog) {
    feedback.push({
      id: uid(), logId: tomasLog.id, coachId: fundamentals.coachId, athleteId: 'tomas',
      text: 'Dropping to incline push-ups was the right call. Stay there until all three sets reach twelve.',
      date: iso(new Date(tomasLog.finishedAt!).getTime() + 3 * 3600000),
    })
  }

  // Each demo course opened with a group baseline, already finalised.
  const assessments: AssessmentSession[] = []
  const participants: AssessmentParticipant[] = []
  if (demoMe) {
    const baseline = (course: Course, stations: DisciplineId[], daysAgo: number, ids: string[]) => {
      const at = iso(t - daysAgo * DAY)
      const session: AssessmentSession = {
        id: uid().slice(0, 8), protocol: PROTOCOL, title: 'Baseline', kind: 'baseline', groupName: course.title, coachId: course.coachId,
        coachName: athletes[course.coachId]?.name ?? 'Coach', courseId: course.id, stations, status: 'finalised', origin: 'local', createdAt: at,
        finalisedAt: at, stationMinutes: 6, sample: true,
      }
      assessments.push(session)
      for (const id of ids) {
        const r = rng(`${id}:${course.title}:baseline`)
        participants.push({
          id: uid().slice(0, 8), sessionId: session.id, athleteId: id, name: athletes[id].name, joinedAt: at, via: id === ME ? 'self' : 'sample',
          sharing: id === ME || r() < 0.65 ? 'group' : 'coach', results: simulateResults(byId[id].evidence, stations, at, 0.9, r), skipped: [], flags: [], submittedAt: at,
        })
      }
    }
    baseline(handstand, ['mobility', 'handstand', 'push', 'core'], 13, [ME, 'ines', 'priya', 'lina', 'tomas'])
    baseline(fundamentals, ['mobility', 'push', 'pull', 'core', 'legs', 'handstand'], 6, ['tomas', 'ben', 'priya', 'ines'])
  }

  return {
    athletes, evidence, logs, courses, enrollments, feedback, following: demoMe ? ['maya', 'jonas', 'lina'] : [], assessments, participants,
    places: community.places, visits: community.visits, follows: community.follows, mapView: community.mapView,
  }
}
