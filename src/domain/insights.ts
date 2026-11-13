import type { DisciplineId, Skill } from './types'
import { DISCIPLINE_IDS, SKILLS, exerciseById, ratedExercisesOf, skillById } from './catalog'
import { SCORING } from './scoring/config'
import type { Ratings } from './scoring/mastery'
import { pathTo, type SkillStatuses } from './scoring/skills'

/** Every prerequisite of a skill, transitively. */
export function ancestors(skillId: string, acc = new Set<string>()): Set<string> {
  for (const r of skillById[skillId]?.requires ?? []) {
    if (!acc.has(r)) {
      acc.add(r)
      ancestors(r, acc)
    }
  }
  return acc
}

export interface GoalView {
  skill: Skill
  done: boolean
  /** 0–1: share of the goal's whole chain already mastered. */
  progress: number
  missing: Skill[]
  /** Skills on the path that can be worked on right now. */
  frontier: Skill[]
}

export function goalView(goalId: string, statuses: SkillStatuses): GoalView | null {
  const skill = skillById[goalId]
  if (!skill) return null
  const missing = pathTo(goalId, statuses)
  const chain = ancestors(goalId).size + 1
  const partial = missing.reduce((s, m) => s + (statuses[m.id]?.progress ?? 0), 0)
  return {
    skill,
    done: missing.length === 0,
    progress: Math.min(1, (chain - missing.length + partial * 0.9) / chain),
    missing,
    frontier: missing.filter((m) => statuses[m.id]?.state === 'available'),
  }
}

export interface NextStep {
  kind: 'close' | 'open' | 'benchmark'
  skill?: Skill
  discipline: DisciplineId
  exerciseId: string
  title: string
  detail: string
}

/** A short, honest list of what would move this athlete forward next. */
export function nextSteps(statuses: SkillStatuses, ratings: Ratings, goals: string[], limit = 4): NextStep[] {
  const out: NextStep[] = []
  const onGoalPath = new Set(goals.flatMap((g) => pathTo(g, statuses).map((s) => s.id)))

  const available = SKILLS.filter((s) => statuses[s.id]?.state === 'available')
  const close = available
    .filter((s) => statuses[s.id].progress > 0)
    .sort((a, b) => (onGoalPath.has(b.id) ? 1 : 0) - (onGoalPath.has(a.id) ? 1 : 0) || statuses[b.id].progress - statuses[a.id].progress)

  for (const s of close.slice(0, 2)) {
    const ex = exerciseById[s.exerciseId]
    const unit = ex.metric === 'hold' ? 's' : ''
    out.push({
      kind: 'close',
      skill: s,
      discipline: s.discipline,
      exerciseId: s.exerciseId,
      title: s.name,
      detail: `Best ${statuses[s.id].best}${unit} of ${s.threshold}${unit}${onGoalPath.has(s.id) ? ' · on a goal path' : ''}`,
    })
  }

  for (const d of DISCIPLINE_IDS) {
    if (out.length >= limit) break
    const r = ratings[d]
    if (r.slots.length >= SCORING.slotWeights.length) continue
    const used = new Set(r.slots.map((s) => s.exerciseId))
    const pick = ratedExercisesOf(d)
      .filter((e) => !used.has(e.id))
      .sort((a, b) => a.curve![0][1] - b.curve![0][1])
      .find((e) => e.curve![0][1] >= (r.slots.at(-1)?.score ?? 0) * 0.5)
    if (!pick) continue
    out.push({
      kind: 'benchmark',
      discipline: d,
      exerciseId: pick.id,
      title: `Test your ${pick.name.toLowerCase()}`,
      detail: `${r.slots.length} of ${SCORING.slotWeights.length} benchmarks on record, so this rating is still forming`,
    })
  }

  for (const s of available
    .filter((x) => statuses[x.id].progress === 0 && onGoalPath.has(x.id))
    .sort((a, b) => a.rating - b.rating)) {
    if (out.length >= limit) break
    out.push({ kind: 'open', skill: s, discipline: s.discipline, exerciseId: s.exerciseId, title: s.name, detail: 'Unlocked and on a goal path. No attempt logged yet' })
  }
  return out.slice(0, limit)
}

/** Skills mastered through direct evidence, most recent first. */
export function recentUnlocks(statuses: SkillStatuses, limit = 6) {
  return SKILLS.filter((s) => statuses[s.id]?.state === 'mastered' && !statuses[s.id].implied && statuses[s.id].achievedAt)
    .sort((a, b) => statuses[b.id].achievedAt!.localeCompare(statuses[a.id].achievedAt!) || b.rating - a.rating)
    .slice(0, limit)
}
