import type { DisciplineId, Evidence } from './types'
import { DISCIPLINE_IDS } from './catalog'
import { computeAura } from './scoring/aura'
import { allRatings } from './scoring/mastery'

/**
 * Where an athlete started, for showing how far they have come.
 *
 * The starting point is their first assessment: everything on record up to
 * the last result of it. Someone who never took one starts at the first day
 * they recorded anything. What they have shown since is the growth. Nothing
 * here changes a rating: it is the same scoring, run on less evidence.
 */
export function startingPoint(evidence: Evidence[]): { date: string; evidence: Evidence[] } | null {
  if (evidence.length === 0) return null
  const sorted = [...evidence].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted.find((e) => e.source === 'assessment' && e.assessmentId)
  const cutoff = first
    ? sorted.filter((e) => e.assessmentId === first.assessmentId).reduce((m, e) => (e.date > m ? e.date : m), first.date)
    : `${sorted[0].date.slice(0, 10)}T23:59:59.999Z`
  return { date: first ? first.date : sorted[0].date, evidence: sorted.filter((e) => e.date <= cutoff) }
}

export interface Growth {
  /** When the starting point was recorded. */
  since: string
  aura: { then: number; now: number }
  ratings: Record<DisciplineId, { then: number; now: number }>
  /** Results recorded after the starting point. */
  newResults: number
}

export function growthOf(evidence: Evidence[]): Growth | null {
  const start = startingPoint(evidence)
  if (!start) return null
  const then = allRatings(start.evidence), now = allRatings(evidence)
  return {
    since: start.date,
    aura: { then: computeAura(then).aura, now: computeAura(now).aura },
    ratings: Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, { then: then[d].rating, now: now[d].rating }])) as Growth['ratings'],
    newResults: evidence.length - start.evidence.length,
  }
}
