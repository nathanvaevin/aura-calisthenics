import type { DisciplineId, Evidence, EvidenceTier } from '../types'
import { DISCIPLINE_IDS, exerciseById } from '../catalog'
import { SCORING, TIER_RANK, isVerified } from './config'
import { curveRating } from './curve'

/** Strongest evidence per exercise: highest value, then highest tier, then earliest. */
export function bestEvidence(evidence: Evidence[], accept: (e: Evidence) => boolean = () => true) {
  const best = new Map<string, Evidence>()
  for (const e of evidence) {
    if (!accept(e)) continue
    const cur = best.get(e.exerciseId)
    if (
      !cur ||
      e.value > cur.value ||
      (e.value === cur.value &&
        (TIER_RANK[e.tier] > TIER_RANK[cur.tier] || (e.tier === cur.tier && e.date < cur.date)))
    ) {
      best.set(e.exerciseId, e)
    }
  }
  return best
}

export interface RatingSlot {
  exerciseId: string
  value: number
  /** Rating points this benchmark reads at on its curve. */
  score: number
  weight: number
  tier: EvidenceTier
  date: string
}

export type RatingStatus = 'unrated' | 'estimated' | 'self' | 'observed' | 'verified'

export interface DisciplineRating {
  discipline: DisciplineId
  rating: number
  /** The same model run on coach- and video-verified evidence only. */
  verified: number
  slots: RatingSlot[]
  /** Fewer filled slots than the model uses: the rating is still forming. */
  provisional: boolean
  status: RatingStatus
  /** Fraction of the rating coming from each evidence tier. */
  share: Record<EvidenceTier, number>
}

function blend(discipline: DisciplineId, best: Map<string, Evidence>) {
  const scored: Omit<RatingSlot, 'weight'>[] = []
  for (const e of best.values()) {
    const ex = exerciseById[e.exerciseId]
    if (!ex || ex.discipline !== discipline || !ex.curve) continue
    scored.push({
      exerciseId: e.exerciseId,
      value: e.value,
      score: curveRating(ex.curve, e.value),
      tier: e.tier,
      date: e.date,
    })
  }
  scored.sort((a, b) => b.score - a.score)
  const slots: RatingSlot[] = scored
    .slice(0, SCORING.slotWeights.length)
    .map((s, i) => ({ ...s, weight: SCORING.slotWeights[i] }))
  const total = slots.reduce((sum, s) => sum + s.score * s.weight, 0)
  return { slots, total }
}

export function disciplineRating(discipline: DisciplineId, evidence: Evidence[]): DisciplineRating {
  const { slots, total } = blend(discipline, bestEvidence(evidence))
  const verified = blend(discipline, bestEvidence(evidence, (e) => isVerified(e.tier))).total

  const share: Record<EvidenceTier, number> = { estimated: 0, self: 0, observed: 0, coach: 0, video: 0 }
  if (total > 0) for (const s of slots) share[s.tier] += (s.score * s.weight) / total

  let status: RatingStatus = 'unrated'
  if (total > 0) {
    if (share.coach + share.video >= SCORING.verifiedShare) status = 'verified'
    else if (share.observed + share.coach + share.video >= SCORING.observedShare) status = 'observed'
    else if (share.estimated >= SCORING.estimatedShare) status = 'estimated'
    else status = 'self'
  }

  return {
    discipline,
    rating: Math.round(total),
    verified: Math.round(verified),
    slots,
    provisional: slots.length < SCORING.slotWeights.length,
    status,
    share,
  }
}

export type Ratings = Record<DisciplineId, DisciplineRating>

export function allRatings(evidence: Evidence[]): Ratings {
  return Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, disciplineRating(d, evidence)])) as Ratings
}

export interface PersonalRecord {
  exerciseId: string
  value: number
  score: number
  tier: EvidenceTier
  date: string
}

/** Best demonstrated performance on every rated exercise, strongest first. */
export function personalRecords(evidence: Evidence[]): PersonalRecord[] {
  const out: PersonalRecord[] = []
  for (const e of bestEvidence(evidence).values()) {
    const ex = exerciseById[e.exerciseId]
    if (!ex?.curve) continue
    out.push({
      exerciseId: e.exerciseId,
      value: e.value,
      score: Math.round(curveRating(ex.curve, e.value)),
      tier: e.tier,
      date: e.date,
    })
  }
  return out.sort((a, b) => b.score - a.score)
}
