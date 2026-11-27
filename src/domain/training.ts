import type { BlockKind, Course, CourseSession, DisciplineId, Evidence, Workout, WorkoutBlock } from './types'
import { exerciseById, skillById, stepAt } from './catalog'
import { makeBlock, pathTo, trainingFor, workingLevel, type SkillStatuses } from './scoring/skills'

type PlanItem =
  | { kind: BlockKind; progressionId: string; sets?: number }
  | { kind: BlockKind; exerciseId: string; sets?: number; target?: number }

export interface WorkoutTemplate {
  id: string
  title: string
  focus: DisciplineId | 'full'
  summary: string
  minutes: number
  plan: PlanItem[]
}

const ladder = (kind: BlockKind, progressionId: string, sets?: number): PlanItem => ({ kind, progressionId, sets })
const fixed = (kind: BlockKind, exerciseId: string, sets?: number, target?: number): PlanItem => ({
  kind,
  exerciseId,
  sets,
  target,
})

/**
 * Ready-made sessions. Ladder items resolve to the athlete's own working level
 * when the session starts, so the same template suits a beginner and an
 * advanced athlete.
 */
export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'handstand-practice', title: 'Handstand Practice', focus: 'handstand', minutes: 30,
    summary: 'Wrists, line work and balance, finished with overhead strength.',
    plan: [
      fixed('warmup', 'wrist-prep', 2, 10),
      fixed('warmup', 'overhead-wall-reach', 2, 20),
      ladder('skill', 'handstand-line', 5),
      ladder('skill', 'arm-balance', 3),
      ladder('strength', 'overhead-press', 3),
      ladder('strength', 'anti-extension', 3),
    ],
  },
  {
    id: 'pull-strength', title: 'Pull Strength', focus: 'pull', minutes: 35,
    summary: 'Vertical and horizontal pulling with straight-arm work.',
    plan: [
      fixed('warmup', 'dead-hang', 2, 20),
      fixed('warmup', 'scap-pull', 2, 8),
      ladder('strength', 'pullup', 4),
      ladder('strength', 'row', 3),
      ladder('skill', 'front-lever', 4),
      ladder('strength', 'hanging-raise', 3),
    ],
  },
  {
    id: 'push-strength', title: 'Push Strength', focus: 'push', minutes: 35,
    summary: 'Push-ups, dips and overhead pressing.',
    plan: [
      fixed('warmup', 'wrist-prep', 2, 10),
      fixed('warmup', 'scap-pushup', 2, 10),
      ladder('strength', 'pushup', 4),
      ladder('strength', 'dip', 3),
      ladder('strength', 'overhead-press', 3),
      ladder('skill', 'planche', 4),
    ],
  },
  {
    id: 'core-line', title: 'Core Line', focus: 'core', minutes: 20,
    summary: 'Hollow tension, hanging raises and compression.',
    plan: [
      fixed('warmup', 'dead-bug', 2, 10),
      ladder('strength', 'anti-extension', 4),
      ladder('strength', 'hanging-raise', 3),
      ladder('skill', 'l-sit', 4),
      fixed('strength', 'side-plank', 2, 30),
      fixed('cooldown', 'arch-hold', 2, 30),
    ],
  },
  {
    id: 'legs-hips', title: 'Legs & Hips', focus: 'legs', minutes: 30,
    summary: 'Single-leg strength and posterior chain.',
    plan: [
      fixed('warmup', 'hip-90-90', 2, 10),
      fixed('warmup', 'worlds-greatest-stretch', 2, 5),
      ladder('strength', 'single-leg-squat', 4),
      ladder('strength', 'hamstring', 3),
      fixed('strength', 'calf-raise', 3, 15),
      fixed('cooldown', 'deep-squat-hold', 2, 60),
    ],
  },
  {
    id: 'mobility-reset', title: 'Mobility Reset', focus: 'mobility', minutes: 20,
    summary: 'Hips, hamstrings and shoulders. Easy enough for a rest day.',
    plan: [
      fixed('warmup', 'cat-cow', 2, 10),
      fixed('warmup', 'worlds-greatest-stretch', 2, 5),
      ladder('mobility', 'straddle', 3),
      ladder('mobility', 'pike-fold', 3),
      ladder('mobility', 'front-split', 2),
      ladder('mobility', 'bridge', 3),
    ],
  },
  {
    id: 'full-body', title: 'Full Body Foundations', focus: 'full', minutes: 40,
    summary: 'One push, one pull, legs and core. A balanced default.',
    plan: [
      fixed('warmup', 'wrist-prep', 1, 10),
      fixed('warmup', 'cat-cow', 1, 10),
      ladder('strength', 'pushup', 3),
      ladder('strength', 'pullup', 3),
      ladder('strength', 'single-leg-squat', 3),
      ladder('strength', 'row', 3),
      ladder('strength', 'anti-extension', 3),
    ],
  },
]

export const templateById: Record<string, WorkoutTemplate> = Object.fromEntries(
  WORKOUT_TEMPLATES.map((t) => [t.id, t]),
)

/** Resolve a template into concrete blocks at this athlete's working levels. */
export function buildWorkout(template: WorkoutTemplate, evidence: Evidence[]): Workout {
  const blocks: WorkoutBlock[] = template.plan.map((item, i) => {
    const id = `${template.id}-${i}`
    if ('progressionId' in item) {
      const level = workingLevel(item.progressionId, evidence)
      const step = stepAt(item.progressionId, level)!
      const block = makeBlock(item.kind, step.exerciseId, { progressionId: item.progressionId, level })
      return { ...block, id, sets: item.sets ?? block.sets }
    }
    const block = makeBlock(item.kind, item.exerciseId, { progressionId: undefined, level: undefined })
    return { ...block, id, sets: item.sets ?? block.sets, target: item.target ?? block.target }
  })
  return { id: template.id, title: template.title, focus: template.focus, summary: template.summary, minutes: template.minutes, blocks }
}

// ── The first week of a course ───────────────────────────────────────────
//
// A course that opens with an assessment used to give its first week nothing
// to train. These are that week's sessions: short, the whole body, every
// ladder at the level the athlete's own results put them on. They are worked
// out for each athlete when the course is shown, not written into the course,
// so they follow the assessment as soon as it is done and need nothing saved.
// A coach who writes sessions into that week replaces them.

export const STARTER_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'starter-a', title: 'First session', focus: 'full', minutes: 25,
    summary: 'Push, pull, legs and trunk, each at your level.',
    plan: [
      fixed('warmup', 'wrist-prep', 1, 10),
      fixed('warmup', 'cat-cow', 1, 10),
      ladder('strength', 'pushup', 3),
      ladder('strength', 'row', 3),
      ladder('strength', 'single-leg-squat', 3),
      ladder('strength', 'anti-extension', 3),
      fixed('cooldown', 'deep-squat-hold', 2, 30),
    ],
  },
  {
    id: 'starter-b', title: 'Second session', focus: 'full', minutes: 25,
    summary: 'Hanging, the first steps upside down, and the back of the body.',
    plan: [
      fixed('warmup', 'wrist-prep', 1, 10),
      fixed('warmup', 'scap-pull', 2, 6),
      ladder('strength', 'pullup', 3),
      ladder('skill', 'handstand-line', 3),
      ladder('strength', 'dip', 3),
      fixed('strength', 'glute-bridge', 3, 12),
      fixed('cooldown', 'overhead-wall-reach', 2, 20),
    ],
  },
]

/** How far either side of their own level an athlete may move in a starter session. */
const STARTER_SPAN = 1
const STARTER_DAYS = [2, 4]

/** The id of a starter session: the week it belongs to, and which of the two it is. Stable, so a logged session finds it again. */
export const starterId = (weekId: string, i: number) => `${weekId}~start-${'ab'[i] ?? i}`
export const isStarter = (sessionId: string) => sessionId.includes('~start-')

/** The first week's sessions for one athlete, from what they have shown so far. */
export function starterSessions(weekId: string, evidence: Evidence[]): CourseSession[] {
  return STARTER_TEMPLATES.map((template, i) => {
    const built = buildWorkout(template, evidence)
    return {
      id: starterId(weekId, i),
      day: STARTER_DAYS[i] ?? 2 + i * 2,
      title: template.title,
      blocks: built.blocks.map((b) => ({
        ...b,
        id: `${starterId(weekId, i)}-${b.exerciseId}`,
        ...(b.level ? { minLevel: Math.max(1, b.level - STARTER_SPAN), maxLevel: b.level + STARTER_SPAN } : {}),
      })),
    }
  })
}

/**
 * A course as one athlete follows it: where a week is given to the first
 * assessment and the coach wrote no sessions into it, it holds that athlete's
 * starter sessions. Every other week is the course's own, untouched.
 */
export function courseFor(course: Course, evidence: Evidence[]): Course {
  if (!course.weeks.some((w) => w.kind === 'baseline' && w.sessions.length === 0)) return course
  return { ...course, weeks: course.weeks.map((w) => (w.kind === 'baseline' && w.sessions.length === 0 ? { ...w, sessions: starterSessions(w.id, evidence) } : w)) }
}

const WARMUP: Record<DisciplineId, string[]> = {
  handstand: ['wrist-prep', 'overhead-wall-reach'],
  pull: ['dead-hang', 'scap-pull'],
  push: ['wrist-prep', 'scap-pushup'],
  core: ['dead-bug'],
  legs: ['hip-90-90'],
  mobility: ['cat-cow'],
}

/** A session aimed at the next missing steps toward a goal skill. */
export function buildGoalWorkout(goalId: string, evidence: Evidence[], statuses: SkillStatuses): Workout | null {
  const goal = skillById[goalId]
  if (!goal) return null
  const path = pathTo(goalId, statuses)
  if (path.length === 0) return null

  const frontier = path.filter((s) => statuses[s.id]?.state === 'available').slice(0, 2)
  const targets = frontier.length ? frontier : path.slice(0, 1)

  const seen = new Set<string>()
  const blocks: WorkoutBlock[] = []
  for (const id of WARMUP[goal.discipline]) {
    seen.add(id)
    const ex = exerciseById[id]
    blocks.push({
      ...makeBlock('warmup', id, { progressionId: undefined, level: undefined }),
      id: `goal-w-${id}`,
      sets: 2,
      target: ex.dose.range[0],
    })
  }
  for (const skill of targets) {
    for (const pick of trainingFor(skill, evidence)) {
      if (seen.has(pick.exerciseId)) continue
      seen.add(pick.exerciseId)
      const isTarget = pick.exerciseId === skill.exerciseId
      blocks.push({
        ...makeBlock(isTarget ? 'skill' : 'strength', pick.exerciseId, {
          progressionId: pick.progressionId,
          level: pick.level,
        }),
        id: `goal-${pick.exerciseId}`,
        note: pick.reason,
      })
    }
  }

  return {
    id: `goal-${goalId}`,
    title: `Toward ${goal.name}`,
    focus: goal.discipline,
    summary: `Built from what stands between you and ${goal.name}.`,
    minutes: Math.max(15, blocks.length * 6),
    blocks: blocks.slice(0, 7),
  }
}

/** Rough session length from sets, targets and rest. */
export function estimateMinutes(blocks: WorkoutBlock[]): number {
  const seconds = blocks.reduce((sum, b) => {
    const ex = exerciseById[b.exerciseId]
    const work = (b.metric ?? ex?.metric) === 'hold' ? b.target : b.target * 3
    return sum + b.sets * (work + b.rest) + 30
  }, 0)
  return Math.max(5, Math.round(seconds / 60 / 5) * 5)
}
