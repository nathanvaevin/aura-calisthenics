import type { BandId, EvidenceTier } from '../types'

/**
 * Scoring configuration — PROVISIONAL.
 *
 * Nothing here is a validated performance standard. The anchors are a coach's
 * ordering of benchmarks onto a shared scale so the product has something
 * consistent to compute with. Every number is meant to be recalibrated against
 * real athlete data; bump `version` whenever a value changes so stored
 * snapshots stay attributable to the model that produced them.
 */
export const SCORING = {
  version: 'provisional-0.1',

  /**
   * A discipline rating blends the athlete's three strongest benchmarks.
   * Unfilled slots count as zero, so a rating stays provisional until three
   * different benchmarks have been demonstrated.
   */
  slotWeights: [0.5, 0.3, 0.2] as const,

  /**
   * Aura = scale × power mean of the discipline ratings.
   * A mean (not a sum) keeps Aura independent of how many disciplines exist.
   * Exponent > 1 lets an exceptional discipline count for more than a flat
   * average would, without letting a specialist outrank an equally peaked
   * all-rounder.
   */
  auraExponent: 3,
  auraScale: 10,

  /** Share that must be at least coach-observed to call a rating observed. */
  observedShare: 0.6,
  /** Share of a rating that must come from verified evidence to call it verified. */
  verifiedShare: 0.6,
  /** Share from estimates above which a rating is labelled estimated. */
  estimatedShare: 0.5,

  /** Beyond the last calibrated point a curve keeps rising at this fraction of its final slope. */
  extrapolation: 0.5,

  /** Dedication looks at this many trailing weeks of training activity. */
  dedicationWeeks: 8,
} as const

export const BANDS: { id: BandId; label: string; min: number }[] = [
  { id: 'foundation', label: 'Foundation', min: 0 },
  { id: 'beginner', label: 'Beginner', min: 200 },
  { id: 'intermediate', label: 'Intermediate', min: 400 },
  { id: 'advanced', label: 'Advanced', min: 600 },
  { id: 'elite', label: 'Elite', min: 800 },
  { id: 'world', label: 'World-class', min: 1000 },
]

export const bandOf = (rating: number) => {
  let band = BANDS[0]
  for (const b of BANDS) if (rating >= b.min) band = b
  return band
}

export const TIER_RANK: Record<EvidenceTier, number> = { estimated: 0, self: 1, observed: 2, coach: 3, video: 4 }

export const TIER_LABEL: Record<EvidenceTier, string> = {
  estimated: 'Estimated',
  self: 'Self-reported',
  observed: 'Coach-observed',
  coach: 'Coach-verified',
  video: 'Video-verified',
}

export const isVerified = (t: EvidenceTier) => t === 'coach' || t === 'video'

/** Aura classes. Names and thresholds are identity dressing, not measurement. */
export const AURA_CLASSES = [
  { id: 'spark', label: 'Spark', min: 0 },
  { id: 'ember', label: 'Ember', min: 1500 },
  { id: 'kindled', label: 'Kindled', min: 3000 },
  { id: 'radiant', label: 'Radiant', min: 4500 },
  { id: 'luminous', label: 'Luminous', min: 6000 },
  { id: 'stellar', label: 'Stellar', min: 7500 },
  { id: 'corona', label: 'Corona', min: 9000 },
  { id: 'singular', label: 'Singular', min: 10500 },
] as const

export const auraClassOf = (aura: number) => {
  let idx = 0
  AURA_CLASSES.forEach((c, i) => {
    if (aura >= c.min) idx = i
  })
  const current = AURA_CLASSES[idx]
  const next = AURA_CLASSES[idx + 1]
  const progress = next ? (aura - current.min) / (next.min - current.min) : 1
  return { current, next, progress: Math.max(0, Math.min(1, progress)) }
}
