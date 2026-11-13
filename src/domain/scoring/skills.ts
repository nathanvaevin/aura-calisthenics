import type { Evidence, EvidenceTier, Exercise, Skill, WorkoutBlock } from '../types'
import { SKILLS, exerciseById, placementsOf, progressionById, skillById, stepAt } from '../catalog'
import { TIER_RANK } from './config'
import { bestEvidence } from './mastery'

export type SkillState = 'mastered' | 'available' | 'locked'

export interface SkillStatus {
  state: SkillState
  /** Counted as mastered because a skill that depends on it has been demonstrated. */
  implied: boolean
  /** 0–1 toward the threshold. */
  progress: number
  best: number
  tier?: EvidenceTier
  achievedAt?: string
}

export type SkillStatuses = Record<string, SkillStatus>

/** System D — derive the state of every node from evidence alone. */
export function skillStatuses(evidence: Evidence[]): SkillStatuses {
  const byExercise = new Map<string, Evidence[]>()
  for (const e of evidence) {
    const list = byExercise.get(e.exerciseId)
    if (list) list.push(e)
    else byExercise.set(e.exerciseId, [e])
  }

  const out: SkillStatuses = {}
  for (const skill of SKILLS) {
    const list = byExercise.get(skill.exerciseId) ?? []
    const best = list.reduce((m, e) => Math.max(m, e.value), 0)
    const meeting = list.filter((e) => e.value >= skill.threshold)
    if (meeting.length) {
      const tier = meeting.reduce<EvidenceTier>(
        (t, e) => (TIER_RANK[e.tier] > TIER_RANK[t] ? e.tier : t),
        'estimated',
      )
      const achievedAt = meeting.reduce((d, e) => (e.date < d ? e.date : d), meeting[0].date)
      out[skill.id] = { state: 'mastered', implied: false, progress: 1, best, tier, achievedAt }
    } else {
      out[skill.id] = { state: 'locked', implied: false, progress: Math.min(1, best / skill.threshold), best }
    }
  }

  // A demonstrated skill implies its prerequisites.
  const imply = (id: string) => {
    for (const req of skillById[id]?.requires ?? []) {
      const s = out[req]
      if (s && s.state !== 'mastered') {
        out[req] = { ...s, state: 'mastered', implied: true, progress: 1 }
        imply(req)
      } else if (s && !s.implied) {
        imply(req)
      }
    }
  }
  for (const skill of SKILLS) if (out[skill.id].state === 'mastered' && !out[skill.id].implied) imply(skill.id)

  for (const skill of SKILLS) {
    const s = out[skill.id]
    if (s.state === 'mastered') continue
    if (skill.requires.every((r) => out[r]?.state === 'mastered')) s.state = 'available'
  }
  return out
}

/**
 * Everything still missing on the way to a goal, prerequisites first and the
 * goal itself last. Empty when the goal is already mastered.
 */
export function pathTo(goalId: string, statuses: SkillStatuses): Skill[] {
  const seen = new Set<string>()
  const order: Skill[] = []
  const visit = (id: string) => {
    if (seen.has(id)) return
    seen.add(id)
    const skill = skillById[id]
    if (!skill || statuses[id]?.state === 'mastered') return
    for (const r of [...skill.requires].sort((a, b) => skillById[a].rating - skillById[b].rating)) visit(r)
    order.push(skill)
  }
  visit(goalId)
  return order
}

const owns = (ex: Exercise, best: number) => best >= ex.dose.range[0]

/**
 * The level of a progression an athlete should currently train at: the highest
 * rung they can already perform for a working set, moved up one when they have
 * clearly outgrown it. A suggestion, never a rating.
 */
export function workingLevel(progressionId: string, evidence: Evidence[]): number {
  const progression = progressionById[progressionId]
  if (!progression) return 1
  const best = bestEvidence(evidence)
  let level = 1
  for (const step of progression.steps) {
    const ids = [step.exerciseId, ...(step.alternates ?? [])]
    const owned = ids.some((id) => {
      const e = best.get(id)
      return e && owns(exerciseById[id], e.value)
    })
    if (owned) {
      level = step.level
      const top = Math.max(...ids.map((id) => (best.get(id)?.value ?? 0) / exerciseById[id].dose.range[1]))
      if (top >= 2 && step.level < progression.steps.length) level = step.level + 1
    }
  }
  return level
}

export interface TrainingPick {
  exerciseId: string
  progressionId?: string
  level?: number
  reason: string
}

/** What to practise for one target skill, given what the athlete can do now. */
export function trainingFor(skill: Skill, evidence: Evidence[]): TrainingPick[] {
  const picks: TrainingPick[] = []
  const target = exerciseById[skill.exerciseId]
  const best = bestEvidence(evidence).get(skill.exerciseId)?.value ?? 0
  const placement = placementsOf(skill.exerciseId).find((p) => !p.alternate) ?? placementsOf(skill.exerciseId)[0]

  if (placement) {
    const level = Math.min(workingLevel(placement.progression.id, evidence), placement.level)
    const step = stepAt(placement.progression.id, level)!
    if (level < placement.level) {
      picks.push({
        exerciseId: step.exerciseId,
        progressionId: placement.progression.id,
        level,
        reason: `Your current rung on the ${placement.progression.name} ladder`,
      })
    }
    if (level === placement.level || level === placement.level - 1) {
      picks.push({
        exerciseId: skill.exerciseId,
        progressionId: placement.progression.id,
        level: placement.level,
        reason: best > 0 ? 'Practise the skill itself' : 'Start attempting the skill',
      })
    }
  } else {
    picks.push({ exerciseId: skill.exerciseId, reason: best > 0 ? 'Practise the skill itself' : 'Start attempting the skill' })
  }

  // Supporting work: the exercises behind this skill's prerequisites from other families.
  for (const reqId of skill.requires) {
    const req = skillById[reqId]
    if (!req || req.exerciseId === skill.exerciseId) continue
    if (picks.some((p) => p.exerciseId === req.exerciseId)) continue
    const p = placementsOf(req.exerciseId)[0]
    picks.push({
      exerciseId: req.exerciseId,
      progressionId: p?.progression.id,
      level: p?.level,
      reason: `Supports ${target.name}`,
    })
  }
  return picks.slice(0, 4)
}

/**
 * When an athlete changes variation, keep the coach's prescription where it
 * still makes sense. `direction` is the move relative to what was assigned:
 * a harder variation starts at the bottom of its working range, an easier one
 * at the top.
 */
export function adaptTarget(assigned: Exercise, assignedTarget: number, next: Exercise, direction = 0): number {
  if (assigned.id === next.id) return assignedTarget
  const [min, max] = next.dose.range
  if (assigned.metric === next.metric) return Math.max(min, Math.min(max, assignedTarget))
  if (direction > 0) return min
  if (direction < 0) return max
  const mid = (min + max) / 2
  return next.metric === 'hold' ? Math.round(mid / 5) * 5 : Math.round(mid)
}

let blockSeq = 0
export const blockId = () => `b${Date.now().toString(36)}${(blockSeq++).toString(36)}`

/** Build a block for an exercise, attached to its primary progression when it has one. */
export function makeBlock(
  kind: WorkoutBlock['kind'],
  exerciseId: string,
  over: Partial<Omit<WorkoutBlock, 'id' | 'kind' | 'exerciseId'>> = {},
): WorkoutBlock {
  const ex = exerciseById[exerciseId]
  const placement = over.progressionId
    ? placementsOf(exerciseId).find((p) => p.progression.id === over.progressionId)
    : (placementsOf(exerciseId).find((p) => !p.alternate) ?? placementsOf(exerciseId)[0])
  const [min, max] = ex.dose.range
  return {
    id: blockId(),
    kind,
    exerciseId,
    progressionId: placement?.progression.id,
    level: placement?.level,
    sets: ex.dose.sets,
    target: Math.round((min + max) / 2),
    rest: ex.dose.rest,
    ...over,
  }
}
