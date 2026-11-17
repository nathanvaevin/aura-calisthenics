import type { DisciplineId, Exercise, Progression, Skill } from '../types'
import { bandOf } from '../scoring/config'
import { curveRating } from '../scoring/curve'
import { handstandExercises } from './exercises/handstand'
import { pullExercises } from './exercises/pull'
import { pushExercises } from './exercises/push'
import { coreExercises } from './exercises/core'
import { legExercises } from './exercises/legs'
import { mobilityExercises } from './exercises/mobility'
import { PROGRESSIONS } from './progressions'
import { SKILL_DEFS } from './skills'

export * from './base'
export { PROGRESSIONS }

export const EXERCISES: Exercise[] = [
  ...handstandExercises,
  ...pullExercises,
  ...pushExercises,
  ...coreExercises,
  ...legExercises,
  ...mobilityExercises,
]

export const exerciseById: Record<string, Exercise> = Object.fromEntries(EXERCISES.map((e) => [e.id, e]))
export const progressionById: Record<string, Progression> = Object.fromEntries(
  PROGRESSIONS.map((p) => [p.id, p]),
)

export const formatValue = (ex: Pick<Exercise, 'metric' | 'perSide'>, value: number, long = false) => {
  if (ex.metric === 'hold') {
    if (value >= 120 && value % 60 === 0) return `${value / 60} min`
    return `${value}s`
  }
  const side = ex.perSide ? (long ? ' per side' : '/side') : ''
  return long ? `${value} ${value === 1 ? 'rep' : 'reps'}${side}` : `${value}${side}`
}

/** Every (progression, level) an exercise appears at, primary or alternate. */
export const placementsOf = (exerciseId: string) => {
  const out: { progression: Progression; level: number; alternate: boolean }[] = []
  for (const progression of PROGRESSIONS) {
    for (const step of progression.steps) {
      if (step.exerciseId === exerciseId) out.push({ progression, level: step.level, alternate: false })
      else if (step.alternates?.includes(exerciseId)) out.push({ progression, level: step.level, alternate: true })
    }
  }
  return out
}

export const stepAt = (progressionId: string, level: number) =>
  progressionById[progressionId]?.steps.find((s) => s.level === level)

export const levelOf = (progressionId: string, exerciseId: string) =>
  progressionById[progressionId]?.steps.find(
    (s) => s.exerciseId === exerciseId || s.alternates?.includes(exerciseId),
  )?.level

const resolveSkill = (def: (typeof SKILL_DEFS)[number]): Skill => {
  const ex = exerciseById[def.exerciseId]
  if (!ex) throw new Error(`Skill ${def.id} references unknown exercise ${def.exerciseId}`)
  const rating = Math.round(curveRating(ex.curve, def.threshold))
  const amount = formatValue(ex, def.threshold)
  const name =
    def.name ??
    (ex.metric === 'hold'
      ? `${ex.name} · ${amount}`
      : def.threshold === 1
        ? `First ${ex.name}`
        : `${ex.name} × ${amount}`)
  const second = ex.metric === 'hold' ? amount : def.threshold === 1 ? 'First' : `× ${def.threshold}`
  return { ...def, name, discipline: ex.discipline, rating, band: bandOf(rating).id, label: [ex.short, second] }
}

export const SKILLS: Skill[] = SKILL_DEFS.map(resolveSkill)
export const skillById: Record<string, Skill> = Object.fromEntries(SKILLS.map((s) => [s.id, s]))

export const skillsOf = (discipline: DisciplineId) => SKILLS.filter((s) => s.discipline === discipline)

/** Skills that list `skillId` as a prerequisite. */
export const unlockedBy = (skillId: string) => SKILLS.filter((s) => s.requires.includes(skillId))

export const skillsUsing = (exerciseId: string) => SKILLS.filter((s) => s.exerciseId === exerciseId)

export const ratedExercisesOf = (discipline: DisciplineId) =>
  EXERCISES.filter((e) => e.discipline === discipline && e.curve)
