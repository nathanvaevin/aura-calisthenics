import type { BlockKind, Course, CourseSession, CourseWeek, WorkoutBlock } from '@/domain/types'
import { exerciseById, levelOf, placementsOf } from '@/domain/catalog'

export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

/** [kind, exerciseId, sets, target, options] */
type Row = [BlockKind, string, number, number, { p?: string; span?: number; note?: string; rest?: number }?]

const block = ([kind, exerciseId, sets, target, opt]: Row): WorkoutBlock => {
  const ex = exerciseById[exerciseId]
  if (!ex) throw new Error(`Unknown exercise ${exerciseId}`)
  const progressionId = opt?.p ?? placementsOf(exerciseId)[0]?.progression.id
  const level = progressionId ? levelOf(progressionId, exerciseId) : undefined
  const span = opt?.span ?? 2
  return {
    id: uid(),
    kind,
    exerciseId,
    progressionId: kind === 'warmup' && !opt?.p ? undefined : progressionId,
    level: kind === 'warmup' && !opt?.p ? undefined : level,
    minLevel: level && !(kind === 'warmup' && !opt?.p) ? Math.max(1, level - span) : undefined,
    maxLevel: level && !(kind === 'warmup' && !opt?.p) ? level + span : undefined,
    sets,
    target,
    rest: opt?.rest ?? (kind === 'warmup' ? 20 : ex.dose.rest),
    note: opt?.note,
  }
}

const session = (day: number, title: string, rows: Row[]): CourseSession => ({
  id: uid(),
  day,
  title,
  blocks: rows.map(block),
})

const week = (title: string, objective: string, sessions: CourseSession[]): CourseWeek => ({
  id: uid(),
  title,
  objective,
  sessions,
})

const HS = { p: 'handstand-line' }

function handstandFoundations(): CourseWeek[] {
  return [
    week('Wrists, shoulders and shapes', 'Build the positions: loaded wrists, open shoulders and a hollow body.', [
      session(0, 'Foundations A', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'pike-hold', 3, 30, HS],
        ['skill', 'wall-walk', 3, 2, { ...HS, note: 'Walk out the same way you came in.' }],
        ['strength', 'pike-pushup', 3, 6],
        ['strength', 'hollow-hold', 3, 20],
      ]),
      session(2, 'Line and core', [
        ['warmup', 'wrist-prep', 2, 10],
        ['warmup', 'overhead-wall-reach', 2, 20],
        ['skill', 'wall-walk', 3, 3, HS],
        ['skill', 'back-to-wall-hs', 4, 20, HS],
        ['skill', 'crow-pose', 4, 10],
        ['strength', 'hollow-hold', 3, 25],
      ]),
      session(4, 'Foundations B', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'pike-hold', 3, 40, HS],
        ['skill', 'back-to-wall-hs', 4, 25, HS],
        ['strength', 'pike-pushup', 3, 8],
        ['strength', 'plank', 3, 40],
      ]),
    ]),
    week('Time upside down', 'Accumulate wall time and find a straight line.', [
      session(0, 'Chest to wall', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 4, 20, { ...HS, note: 'Only the toes touch. Ribs down, glutes on.' }],
        ['skill', 'back-to-wall-hs', 3, 30, HS],
        ['strength', 'pike-pushup', 3, 8],
        ['strength', 'hollow-hold', 3, 30],
      ]),
      session(2, 'Balance on the hands', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 4, 25, HS],
        ['skill', 'crow-pose', 4, 15],
        ['skill', 'wall-walk', 3, 3, HS],
        ['strength', 'hollow-rock', 3, 10],
      ]),
      session(4, 'Longer holds', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 5, 30, HS],
        ['skill', 'heel-pulls', 4, 4, { ...HS, note: 'Fingertips do the work. Float, do not push.' }],
        ['strength', 'pike-pushup', 3, 10],
        ['strength', 'hollow-hold', 3, 30],
      ]),
    ]),
    week('Finding balance', 'Leave the wall for the first controlled seconds of balance.', [
      session(0, 'Balance practice', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 4, 30, { ...HS, note: 'Wall handstand holds. Same line every set.' }],
        ['skill', 'freestanding-hs', 6, 5, { ...HS, note: 'Freestanding balance practice. Count clean seconds only.' }],
        ['strength', 'pike-pushup', 3, 8],
        ['strength', 'hollow-hold', 3, 30, { note: 'Core stability. Lower back stays down.' }],
      ]),
      session(2, 'Weight shifts', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'wall-shoulder-taps', 4, 8, HS],
        ['skill', 'freestanding-hs', 6, 5, HS],
        ['skill', 'crow-pose', 3, 20],
        ['strength', 'hollow-rock', 3, 15],
      ]),
      session(4, 'Volume day', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 3, 45, HS],
        ['skill', 'freestanding-hs', 8, 5, HS],
        ['strength', 'pike-pushup', 4, 8],
        ['cooldown', 'arch-hold', 3, 30],
      ]),
    ]),
    week('Consolidate and test', 'Longer balances, then a recorded test at the end of the week.', [
      session(0, 'Longer balances', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 3, 45, HS],
        ['skill', 'freestanding-hs', 8, 8, HS],
        ['strength', 'elevated-pike-pushup', 3, 6],
        ['strength', 'hollow-hold', 3, 40],
      ]),
      session(2, 'Control', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'wall-shoulder-taps', 4, 10, HS],
        ['skill', 'freestanding-hs', 8, 10, HS],
        ['skill', 'crow-pose', 3, 25],
        ['strength', 'hollow-rock', 3, 20],
      ]),
      session(4, 'Test day', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 2, 60, { ...HS, note: 'Test: one clean 60-second hold.' }],
        ['skill', 'freestanding-hs', 5, 10, { ...HS, note: 'Test: your best freestanding hold. Film it if you can.' }],
        ['strength', 'pike-pushup', 3, 10],
      ]),
    ]),
  ]
}

const FUNDAMENTALS_WEEKS = [
  ['Learn the shapes', 'Clean positions before any volume: plank, hollow, hang, squat.'],
  ['Own the basics', 'Full range on every rep. Stop each set with two reps in reserve.'],
  ['Add volume', 'One more set on the main movements.'],
  ['Harder variations', 'Move up a level wherever last week felt comfortable.'],
  ['Build density', 'Same work, shorter rests.'],
  ['Test week', 'Record your best set on push-ups, rows, hangs and hollow hold.'],
] as const

function calisthenicsFundamentals(): CourseWeek[] {
  return FUNDAMENTALS_WEEKS.map(([title, objective], i) => {
    const sets = i >= 2 ? 4 : 3
    return week(title, objective, [
      session(1, 'Push and core', [
        ['warmup', 'wrist-prep', 1, 10],
        ['warmup', 'scap-pushup', 2, 10],
        ['strength', 'pushup', sets, 8 + i],
        ['strength', 'bench-dip', 3, 10 + i],
        ['strength', 'pike-pushup', 3, 5 + Math.floor(i / 2)],
        ['strength', 'plank', 3, 30 + i * 5],
      ]),
      session(3, 'Pull and legs', [
        ['warmup', 'dead-hang', 2, 20],
        ['warmup', 'scap-pull', 2, 8],
        ['strength', 'negative-pullup', sets, 3, { p: 'pullup', span: 3 }],
        ['strength', 'horizontal-row', 3, 8 + i],
        ['strength', 'split-squat', 3, 10 + i],
        ['strength', 'glute-bridge', 3, 15],
      ]),
      session(5, 'Full body', [
        ['warmup', 'cat-cow', 1, 10],
        ['strength', 'pushup', 3, 8 + i],
        ['strength', 'horizontal-row', 3, 8 + i],
        ['strength', 'squat', 3, 15 + i * 2],
        ['strength', 'hanging-knee-raise', 3, 8],
        ['strength', 'hollow-hold', 3, 20 + i * 5],
        ['cooldown', 'deep-squat-hold', 2, 60],
      ]),
    ])
  })
}

export interface CourseTemplate {
  id: string
  title: string
  tagline: string
  description: string
  focus: Course['focus']
  milestones: string[]
  build: () => CourseWeek[]
}

export const COURSE_TEMPLATES: CourseTemplate[] = [
  {
    id: 'handstand-foundations',
    title: 'Handstand Foundations',
    tagline: 'From the wall to your first seconds of balance.',
    description:
      'Four weeks, three sessions a week. Wrist preparation, a straight line against the wall, then structured balance practice away from it.',
    focus: 'handstand',
    milestones: ['hs-crow-15', 'hs-ctw-60', 'hs-free-3', 'hs-free-10'],
    build: handstandFoundations,
  },
  {
    id: 'calisthenics-fundamentals',
    title: 'Calisthenics Fundamentals',
    tagline: 'Push, pull, legs and core, built properly.',
    description:
      'Six weeks, three sessions a week. Full-range basics with a level for every student, ending in a recorded test week.',
    focus: 'full',
    milestones: ['push-10', 'pull-first', 'core-hollow-30', 'legs-squat-20', 'pull-row-10'],
    build: calisthenicsFundamentals,
  },
]

export const blankWeek = (n: number): CourseWeek => week(`Week ${n}`, '', [])
export const blankSession = (day: number): CourseSession => session(day, 'New session', [])

export function courseFromTemplate(
  templateId: string | null,
  coachId: string,
  startDate: string,
  over: Partial<Course> = {},
): Course {
  const t = COURSE_TEMPLATES.find((x) => x.id === templateId)
  return {
    id: uid(),
    coachId,
    title: t?.title ?? 'Untitled course',
    tagline: t?.tagline ?? '',
    description: t?.description ?? '',
    focus: t?.focus ?? 'full',
    format: 'group',
    status: 'draft',
    startDate,
    milestones: t?.milestones ?? [],
    weeks: t ? t.build() : [blankWeek(1), blankWeek(2), blankWeek(3), blankWeek(4)],
    ...over,
  }
}
