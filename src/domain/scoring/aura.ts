import type { DisciplineId, Evidence, WorkoutLog } from '../types'
import { DISCIPLINE_IDS, disciplineById } from '../catalog'
import { SCORING, auraClassOf } from './config'
import { allRatings, type RatingStatus, type Ratings } from './mastery'

export interface AuraResult {
  aura: number
  /** Plain average of the discipline ratings. */
  mastery: number
  /** Highest discipline rating: specialised excellence. */
  peak: { discipline: DisciplineId; rating: number } | null
  /** 0–100. How close the average sits to the best discipline. */
  versatility: number
  rated: number
  cls: ReturnType<typeof auraClassOf>
  archetype: string
  title: string
  status: RatingStatus
  /** Each discipline's share of total rating, for colouring the field. */
  mix: Record<DisciplineId, number>
}

/**
 * System C — Aura.
 *
 * Aura is a pure function of the discipline ratings. Training volume, streaks
 * and attendance never enter it; those live in `dedication` below.
 */
export function computeAura(ratings: Ratings): AuraResult {
  const values = DISCIPLINE_IDS.map((d) => ratings[d].rating)
  const n = values.length
  const p = SCORING.auraExponent
  const powerMean = Math.pow(values.reduce((s, v) => s + Math.pow(v, p), 0) / n, 1 / p)
  const aura = Math.round(powerMean * SCORING.auraScale)

  const sum = values.reduce((s, v) => s + v, 0)
  const mastery = Math.round(sum / n)
  const max = Math.max(...values)
  const rated = values.filter((v) => v > 0).length

  const peakId = max > 0 ? DISCIPLINE_IDS[values.indexOf(max)] : null
  const versatility = max > 0 ? Math.round((sum / n / max) * 100) : 0

  const mix = Object.fromEntries(
    DISCIPLINE_IDS.map((d) => [d, sum > 0 ? ratings[d].rating / sum : 0]),
  ) as Record<DisciplineId, number>

  let estimated = 0
  let verified = 0
  if (sum > 0) {
    for (const d of DISCIPLINE_IDS) {
      const r = ratings[d]
      estimated += (r.rating / sum) * r.share.estimated
      verified += (r.rating / sum) * (r.share.coach + r.share.video)
    }
  }
  const status: RatingStatus =
    sum === 0
      ? 'unrated'
      : verified >= SCORING.verifiedShare
        ? 'verified'
        : estimated >= SCORING.estimatedShare
          ? 'estimated'
          : 'self'

  const cls = auraClassOf(aura)
  const archetype = !peakId
    ? 'Unranked'
    : versatility >= 85 && rated >= 5
      ? 'All-Rounder'
      : disciplineById[peakId].archetype

  return {
    aura,
    mastery,
    peak: peakId ? { discipline: peakId, rating: max } : null,
    versatility,
    rated,
    cls,
    archetype,
    title: peakId ? `${cls.current.label} ${archetype}` : 'Unranked',
    status,
    mix,
  }
}

export const auraFor = (evidence: Evidence[]) => computeAura(allRatings(evidence))

/** Aura recomputed at evenly spaced past dates, from evidence dated on or before each. */
export function auraTimeline(evidence: Evidence[], now: Date, points = 13, spanDays = 84) {
  const out: { date: string; aura: number }[] = []
  for (let i = points - 1; i >= 0; i--) {
    const at = new Date(now.getTime() - (i * spanDays * 86400000) / (points - 1))
    const iso = at.toISOString()
    out.push({ date: iso, aura: auraFor(evidence.filter((e) => e.date <= iso)).aura })
  }
  return out
}

const DAY = 86400000

export const startOfWeek = (d: Date) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  return x
}

export interface Dedication {
  /** 0–100. Average weekly adherence to the athlete's own target. */
  score: number
  weeks: { start: string; sessions: number }[]
  /** Consecutive weeks, ending now, with at least one session. */
  streak: number
  total: number
}

/**
 * Training dedication. Measures activity only and is displayed beside Aura,
 * never folded into it.
 */
export function dedication(logs: WorkoutLog[], weeklyTarget: number, now: Date, span = 12): Dedication {
  const done = logs.filter((l) => l.finishedAt)
  const thisWeek = startOfWeek(now).getTime()
  const weeks = Array.from({ length: span }, (_, i) => {
    const start = thisWeek - (span - 1 - i) * 7 * DAY
    const sessions = done.filter((l) => {
      const t = new Date(l.finishedAt!).getTime()
      return t >= start && t < start + 7 * DAY
    }).length
    return { start: new Date(start).toISOString(), sessions }
  })

  const window = weeks.slice(-SCORING.dedicationWeeks)
  const target = Math.max(1, weeklyTarget)
  const score = Math.round(
    (window.reduce((s, w) => s + Math.min(1, w.sessions / target), 0) / window.length) * 100,
  )

  let streak = 0
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i].sessions > 0) streak++
    else if (i === weeks.length - 1) continue
    else break
  }

  return { score, weeks, streak, total: done.length }
}
