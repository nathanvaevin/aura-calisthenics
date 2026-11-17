/**
 * Scoring audit — read-only analysis of the scoring model and the catalog.
 *
 * Nothing in the running app imports this file and nothing here changes a
 * score. It exists so that the claims in SCORING.md can be recomputed from
 * the real code (`npm run scoring:audit`), and so that a proposed exercise can
 * be checked against the admission framework before it is given a curve.
 *
 * "What-if" functions at the bottom model proposals from SCORING.md §F. They
 * are measurements, not implementations.
 */
import type { CurvePoint, DisciplineId, Evidence, Exercise } from '../types'
import { DISCIPLINE_IDS, EXERCISES, PROGRESSIONS, SKILLS, disciplineById, exerciseById, formatValue, placementsOf, ratedExercisesOf } from '../catalog'
import { AURA_CLASSES, BANDS, SCORING, TIER_RANK } from './config'
import { curveRating } from './curve'
import { bestEvidence, disciplineRating } from './mastery'

// ── Curve geometry ───────────────────────────────────────────────────────

/** Highest score an exercise can ever produce: 1.25 × its last anchor. */
export const hardCap = (curve: readonly CurvePoint[]) => curve[curve.length - 1][1] * 1.25

/**
 * Inverse of `curveRating`: the (real-valued) performance at which a curve
 * reads `rating`. Null when the rating is above the exercise's hard cap.
 */
export function valueAt(curve: readonly CurvePoint[], rating: number): number | null {
  if (rating <= 0) return 0
  const [v0, r0] = curve[0]
  if (rating <= r0) return (rating * v0) / r0
  for (let i = 1; i < curve.length; i++) {
    const [pv, pr] = curve[i - 1]
    const [v, r] = curve[i]
    if (rating <= r) return pv + ((rating - pr) * (v - pv)) / (r - pr)
  }
  const [vn, rn] = curve[curve.length - 1]
  if (rating > hardCap(curve) + 1e-9) return null
  const [vp, rp] = curve.length > 1 ? curve[curve.length - 2] : ([0, 0] as const)
  const slope = ((rn - rp) / (vn - vp)) * SCORING.extrapolation
  return vn + (rating - rn) / slope
}

/** Smallest whole rep or second that reads at least `rating`, or null if unreachable. */
export function unitsFor(curve: readonly CurvePoint[], rating: number): number | null {
  const v = valueAt(curve, rating)
  return v === null ? null : Math.max(1, Math.ceil(v - 1e-9))
}

/** Largest whole rep or second that reads at most `rating` (0 when even one unit reads higher). */
export function unitsWithin(curve: readonly CurvePoint[], rating: number): number {
  const v = valueAt(curve, Math.min(rating, hardCap(curve)))
  return v === null ? 0 : Math.floor(v + 1e-9)
}

const ev = (athleteId: string, exerciseId: string, value: number, tier: Evidence['tier'] = 'self'): Evidence => ({
  id: `${athleteId}:${exerciseId}:${value}:${tier}`, athleteId, exerciseId, value, tier, source: 'manual', date: '2026-01-01T00:00:00.000Z',
})

// ── Catalog snapshot ─────────────────────────────────────────────────────

export interface DisciplineSnapshot {
  discipline: DisciplineId
  exercises: number
  rated: number
  skills: number
  /** Rating with every benchmark at its last calibrated anchor. */
  calibratedTop: number
  /** Rating with every benchmark at its hard cap: the most this discipline can ever read. */
  ceiling: number
  /** The three exercises that set the ceiling. */
  topThree: string[]
}

export function snapshot(): DisciplineSnapshot[] {
  return DISCIPLINE_IDS.map((d) => {
    const rated = ratedExercisesOf(d)
    const atTop = rated.map((e) => ev('top', e.id, e.curve![e.curve!.length - 1][0]))
    const atCap = rated.map((e) => ev('cap', e.id, 1e9))
    const cap = disciplineRating(d, atCap)
    return {
      discipline: d,
      exercises: EXERCISES.filter((e) => e.discipline === d).length,
      rated: rated.length,
      skills: SKILLS.filter((s) => s.discipline === d).length,
      calibratedTop: disciplineRating(d, atTop).rating,
      ceiling: cap.rating,
      topThree: cap.slots.map((s) => s.exerciseId),
    }
  })
}

/** Aura when every discipline sits at the given per-discipline value. */
export function auraOf(values: number[], p: number = SCORING.auraExponent, scale: number = SCORING.auraScale) {
  const n = values.length
  if (!isFinite(p)) return Math.round(Math.max(...values) * scale)
  return Math.round(Math.pow(values.reduce((s, v) => s + Math.pow(v, p), 0) / n, 1 / p) * scale)
}

// ── Coverage: how many benchmarks are calibrated at each level ───────────

export const LEVELS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]

/** Number of rated exercises whose calibrated band (first to last anchor) contains the level. */
export function coverage(levels: number[] = LEVELS): Record<DisciplineId, number[]> {
  return Object.fromEntries(
    DISCIPLINE_IDS.map((d) => [
      d,
      levels.map((L) => ratedExercisesOf(d).filter((e) => e.curve![0][1] <= L && L <= e.curve![e.curve!.length - 1][1]).length),
    ]),
  ) as Record<DisciplineId, number[]>
}

/**
 * The "even athlete" test. An athlete whose true level is exactly `level` on
 * every benchmark of a discipline records each benchmark they can properly do
 * (those whose first calibrated point is at or below the level) at the largest
 * whole value that reads no more than `level`. A perfectly consistent, evenly
 * covered catalog would rate this athlete at `level`. The shortfall shows
 * where a discipline is thin, capped or coarse.
 *
 * With `subAnchor` the athlete also records partial attempts at harder
 * benchmarks, below their first calibrated point, which the curve scores
 * pro rata. The difference between the two is how much of a rating can come
 * from the uncalibrated region.
 */
export function evenAthleteRating(d: DisciplineId, level: number, subAnchor = false): number {
  const evidence: Evidence[] = []
  for (const e of ratedExercisesOf(d)) {
    if (!subAnchor && e.curve![0][1] > level) continue
    const units = unitsWithin(e.curve!, level)
    if (units >= 1) evidence.push(ev('even', e.id, units))
  }
  return disciplineRating(d, evidence).rating
}

// ── Curve and ladder checks (the admission framework, §E) ────────────────

export type Severity = 'fail' | 'warn' | 'info'

export interface Finding {
  exerciseId: string
  check: string
  severity: Severity
  detail: string
}

const slopes = (c: readonly CurvePoint[]) => c.slice(1).map(([v, r], i) => (r - c[i][1]) / (v - c[i][0]))

/** Lowest score a counted performance (one rep or one second) produces. */
export const oneUnitScore = (c: readonly CurvePoint[]) => curveRating(c, 1)

/** Share of the smaller calibrated band that two curves have in common, 0–1. */
export function bandOverlap(a: readonly CurvePoint[], b: readonly CurvePoint[]) {
  const lo = Math.max(a[0][1], b[0][1])
  const hi = Math.min(a[a.length - 1][1], b[b.length - 1][1])
  const span = Math.min(a[a.length - 1][1] - a[0][1], b[b.length - 1][1] - b[0][1])
  return span <= 0 ? 0 : Math.max(0, hi - lo) / span
}

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x))

/**
 * Benchmarks that largely measure the same thing: alternates on one ladder
 * rung, or the same category, metric and primary muscles with calibrated bands
 * that mostly coincide.
 */
export function nearDuplicate(a: Exercise, b: Exercise): string | null {
  if (a.id === b.id || !a.curve || !b.curve || a.discipline !== b.discipline) return null
  for (const p of PROGRESSIONS) {
    for (const s of p.steps) {
      const ids = [s.exerciseId, ...(s.alternates ?? [])]
      if (ids.includes(a.id) && ids.includes(b.id)) return `alternates at level ${s.level} of the ${p.name} ladder`
    }
  }
  if (a.category === b.category && a.metric === b.metric && sameSet(a.primary, b.primary) && bandOverlap(a.curve, b.curve) >= 0.6) {
    return `same category (${a.category}), metric and primary muscles; bands overlap ${Math.round(bandOverlap(a.curve, b.curve) * 100)}%`
  }
  return null
}

export function duplicateGroups(): { discipline: DisciplineId; ids: string[]; why: string }[] {
  const out: { discipline: DisciplineId; ids: string[]; why: string }[] = []
  for (const d of DISCIPLINE_IDS) {
    const rated = ratedExercisesOf(d)
    for (let i = 0; i < rated.length; i++) {
      for (let j = i + 1; j < rated.length; j++) {
        const why = nearDuplicate(rated[i], rated[j])
        if (why) out.push({ discipline: d, ids: [rated[i].id, rated[j].id], why })
      }
    }
  }
  return out
}

export const ADMISSION = {
  /** A curve needs this many anchors before its shape means anything. */
  minAnchors: 3,
  /** A later segment may be at most this much steeper than the one before it. */
  convexTolerance: 1.05,
  /** One counted unit below the first anchor should not be worth a whole band. */
  maxOneUnitScore: 200,
  /** A new benchmark must not lift a discipline's calibrated top by more than this without a model version bump. */
  maxTopShift: 0,
} as const

/**
 * Check one exercise against the admission framework, as if it were being
 * added to `catalog` (which should not contain it).
 */
export function admissionFindings(candidate: Exercise, catalog: Exercise[] = EXERCISES.filter((e) => e.id !== candidate.id)): Finding[] {
  const out: Finding[] = []
  const add = (check: string, severity: Severity, detail: string) => out.push({ exerciseId: candidate.id, check, severity, detail })
  const c = candidate.curve
  if (!c) return out

  // E2 · shape
  for (let i = 1; i < c.length; i++) {
    if (c[i][0] <= c[i - 1][0] || c[i][1] <= c[i - 1][1]) add('ascending', 'fail', `anchor ${i + 1} does not rise above anchor ${i}`)
  }
  if (c.length < ADMISSION.minAnchors) add('anchors', 'warn', `${c.length} anchors; shape between them is a straight line by default`)
  const s = slopes(c)
  for (let i = 1; i < s.length; i++) {
    if (s[i] > s[i - 1] * ADMISSION.convexTolerance) {
      add('concave', 'warn', `points per unit rises from ${s[i - 1].toFixed(1)} to ${s[i].toFixed(1)} after ${c[i][0]}: later units are worth more than earlier ones`)
    }
  }
  if (c[0][0] > 1 && oneUnitScore(c) >= ADMISSION.maxOneUnitScore) {
    add('sub-anchor', 'warn', `one ${candidate.metric === 'hold' ? 'second' : 'rep'} reads ${Math.round(oneUnitScore(c))}, below the first calibrated point (${c[0][0]} → ${c[0][1]})`)
  }

  // E3 · ladder order
  for (const p of PROGRESSIONS) {
    const idx = p.steps.findIndex((st) => st.exerciseId === candidate.id || st.alternates?.includes(candidate.id))
    if (idx < 0) continue
    const entryOf = (i: number) => exerciseById[p.steps[i].exerciseId]?.curve?.[0][1]
    for (let i = idx - 1; i >= 0; i--) {
      const below = entryOf(i)
      if (below === undefined) continue
      if (below > c[0][1]) add('ladder', 'fail', `enters at ${c[0][1]}, below level ${i + 1} of ${p.name} (${below})`)
      break
    }
    for (let i = idx + 1; i < p.steps.length; i++) {
      const above = entryOf(i)
      if (above === undefined) continue
      if (above < c[0][1]) add('ladder', 'fail', `enters at ${c[0][1]}, above level ${i + 1} of ${p.name} (${above})`)
      break
    }
  }

  // E4 · ceiling
  const peers = catalog.filter((e) => e.discipline === candidate.discipline && e.curve)
  const top = (list: Exercise[]) => disciplineRating(candidate.discipline, list.map((e) => ev('t', e.id, e.curve![e.curve!.length - 1][0]))).rating
  // `disciplineRating` reads curves from the live catalog, so the "without" case is computed from peers only.
  const before = top(peers)
  const lastAnchors = [...peers.map((e) => e.curve![e.curve!.length - 1][1]), c[c.length - 1][1]].sort((a, b) => b - a)
  const after = Math.round(lastAnchors.slice(0, SCORING.slotWeights.length).reduce((sum, r, i) => sum + r * SCORING.slotWeights[i], 0))
  if (after - before > ADMISSION.maxTopShift) add('ceiling', 'warn', `lifts the calibrated top of ${disciplineById[candidate.discipline].short} from ${before} to ${after}`)

  // E5 · redundancy
  for (const e of peers) {
    const why = nearDuplicate(candidate, e)
    if (!why) continue
    const identical = JSON.stringify(e.curve) === JSON.stringify(c)
    add('redundant', 'info', `overlaps ${e.id}: ${why}${identical ? '; curves are identical' : ''}`)
  }

  // E6 · reach
  if (placementsOf(candidate.id).length === 0) add('unplaced', 'info', 'rated but on no ladder, so nothing checks its order against other benchmarks')
  if (!SKILLS.some((sk) => sk.exerciseId === candidate.id)) add('no-skill', 'info', 'rated but no skill node uses it')
  return out
}

/**
 * The whole catalog put through the framework, each exercise checked as if it
 * were the newcomer. For an exercise that is already in, setting the top of
 * its discipline is a fact to know rather than a warning.
 */
export const auditCatalog = () =>
  EXERCISES.filter((e) => e.curve)
    .flatMap((e) => admissionFindings(e))
    .map((f) => (f.check === 'ceiling' ? { ...f, severity: 'info' as Severity } : f))

/** Gaps between consecutive rated rungs: the next rung's entry minus this rung's last anchor. */
export function ladderGaps() {
  const out: { progression: string; from: string; to: string; gap: number }[] = []
  for (const p of PROGRESSIONS) {
    const rated = p.steps.map((s) => exerciseById[s.exerciseId]).filter((e) => e.curve)
    for (let i = 1; i < rated.length; i++) {
      const prev = rated[i - 1].curve!
      out.push({ progression: p.id, from: rated[i - 1].id, to: rated[i].id, gap: rated[i].curve![0][1] - prev[prev.length - 1][1] })
    }
  }
  return out
}

// ── Equivalence tables: what each benchmark must be to read a level ──────

export type EquivalenceCell = { units: number; extrapolated: boolean } | 'below' | 'above'

/**
 * For each benchmark, the whole reps or seconds that first read at least each
 * level. 'below': the level is under the benchmark's first calibrated point.
 * 'above': the level is over its cap.
 */
export function equivalence(d: DisciplineId, levels: number[]) {
  return ratedExercisesOf(d)
    .slice()
    .sort((a, b) => a.curve![0][1] - b.curve![0][1])
    .map((e) => {
      const c = e.curve!
      const cells: EquivalenceCell[] = levels.map((L) => {
        if (L < c[0][1]) return 'below'
        const units = unitsFor(c, L)
        return units === null ? 'above' : { units, extrapolated: units > c[c.length - 1][0] }
      })
      return { exercise: e, cells }
    })
}

// ── Selection effect: choosing your three best among n noisy readings ────

export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function gaussian(r: () => number) {
  return () => {
    let u = 0
    while (u === 0) u = r()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r())
  }
}

export type Aggregator = 'slots' | 'max' | 'top3-mean' | 'mean' | 'sum'

export function aggregate(scores: number[], how: Aggregator, weights: readonly number[] = SCORING.slotWeights) {
  const s = [...scores].sort((a, b) => b - a)
  if (how === 'max') return s[0] ?? 0
  if (how === 'sum') return s.reduce((x, y) => x + y, 0)
  if (how === 'mean') return s.length ? s.reduce((x, y) => x + y, 0) / s.length : 0
  if (how === 'top3-mean') return s.slice(0, 3).reduce((x, y) => x + y, 0) / 3
  return s.slice(0, weights.length).reduce((sum, x, i) => sum + x * weights[i], 0)
}

/**
 * Expected inflation, in units of σ, when a rating is built from n benchmark
 * readings that each equal the true level plus independent error of standard
 * deviation σ. Zero would mean the aggregate is unbiased.
 */
export function selectionBias(n: number, how: Aggregator = 'slots', draws = 40000, seed = 7) {
  const z = gaussian(rng(seed + n))
  let total = 0
  for (let i = 0; i < draws; i++) total += aggregate(Array.from({ length: n }, z), how)
  return total / draws
}

/**
 * Catalog-growth experiment on the real curves.
 *
 * An athlete of true level θ attempts every rated benchmark in a discipline.
 * Their ability on benchmark e reads θ + ε_e on its curve (ε independent,
 * sd σ: the calibration disagreement between curves plus individual
 * variation), is rounded down to whole reps or seconds and is limited by the
 * curve's cap. Benchmarks whose first calibrated point is above that reading
 * are not attempted. The catalog is then multiplied: every benchmark is cloned
 * `factor` times with fresh ε. Returns the mean rating.
 */
export function catalogGrowth(d: DisciplineId, theta: number, sigma: number, factor: number, draws = 4000, seed = 11) {
  const z = gaussian(rng(seed))
  const curves = ratedExercisesOf(d).map((e) => e.curve!)
  let total = 0
  for (let i = 0; i < draws; i++) {
    const scores: number[] = []
    for (const c of curves) {
      for (let k = 0; k < factor; k++) {
        const reads = theta + sigma * z()
        if (reads < c[0][1]) continue // not yet able to do this one properly
        const units = unitsWithin(c, reads)
        if (units >= 1) scores.push(curveRating(c, units))
      }
    }
    total += aggregate(scores, 'slots')
  }
  return total / draws
}

// ── What-if models for the proposals in SCORING.md §F (not implemented) ──

export interface Scored {
  exerciseId: string
  score: number
}

/** Every benchmark an athlete has in a discipline, strongest first. */
export function scoredBenchmarks(d: DisciplineId, evidence: Evidence[]): Scored[] {
  const out: Scored[] = []
  for (const e of bestEvidence(evidence).values()) {
    const ex = exerciseById[e.exerciseId]
    if (ex?.discipline === d && ex.curve) out.push({ exerciseId: e.exerciseId, score: curveRating(ex.curve, e.value) })
  }
  return out.sort((a, b) => b.score - a.score)
}

export const familyByCategory = (id: string) => exerciseById[id].category
export const familyByLadder = (id: string) => (placementsOf(id).find((p) => !p.alternate) ?? placementsOf(id)[0])?.progression.id ?? id

/** Proposal P1 measured: at most one slot per family. */
export function ratingOnePerFamily(d: DisciplineId, evidence: Evidence[], family: (id: string) => string) {
  const seen = new Set<string>()
  const kept: number[] = []
  for (const s of scoredBenchmarks(d, evidence)) {
    const f = family(s.exerciseId)
    if (seen.has(f)) continue
    seen.add(f)
    kept.push(s.score)
  }
  return Math.round(aggregate(kept, 'slots'))
}

/** How many of an athlete's filled slots repeat a family already used by a stronger slot. */
export function repeatedSlots(d: DisciplineId, evidence: Evidence[], family: (id: string) => string) {
  const slots = scoredBenchmarks(d, evidence).slice(0, SCORING.slotWeights.length)
  return slots.length - new Set(slots.map((s) => family(s.exerciseId))).size
}

/** Proposal P2 measured: the range a provisional rating could plausibly sit in. */
export function ratingRange(d: DisciplineId, evidence: Evidence[]) {
  const r = disciplineRating(d, evidence)
  const missing = SCORING.slotWeights.slice(r.slots.length).reduce((s, w) => s + w, 0)
  const weakest = r.slots.at(-1)?.score ?? 0
  return { low: r.rating, high: Math.round(r.rating + missing * weakest) }
}

// ── Generated sections of SCORING.md ─────────────────────────────────────

const table = (head: string[], rows: (string | number)[][]) =>
  [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n')

const short = (d: DisciplineId) => disciplineById[d].short

/**
 * Sections of SCORING.md that are produced from the code. `scoring.test.ts`
 * fails when the document's copy differs; `npm run scoring:audit -- --write`
 * rewrites them.
 */
export function docBlocks(): Record<string, string> {
  const snap = snapshot()
  const constants = table(
    ['Constant', 'Value', 'Where'],
    [
      ['`version`', `\`${SCORING.version}\``, '`SCORING.version`'],
      ['`slotWeights`', `\`${SCORING.slotWeights.join(' / ')}\``, '`SCORING.slotWeights`'],
      ['`auraExponent`', `\`${SCORING.auraExponent}\``, '`SCORING.auraExponent`'],
      ['`auraScale`', `\`${SCORING.auraScale}\``, '`SCORING.auraScale`'],
      ['`observedShare`', `\`${SCORING.observedShare}\``, '`SCORING.observedShare`'],
      ['`verifiedShare`', `\`${SCORING.verifiedShare}\``, '`SCORING.verifiedShare`'],
      ['`estimatedShare`', `\`${SCORING.estimatedShare}\``, '`SCORING.estimatedShare`'],
      ['`extrapolation`', `\`${SCORING.extrapolation}\``, '`SCORING.extrapolation`'],
      ['`dedicationWeeks`', `\`${SCORING.dedicationWeeks}\``, '`SCORING.dedicationWeeks`'],
      ['`bands`', `\`${BANDS.map((b) => `${b.label} ${b.min}`).join(' · ')}\``, '`BANDS`'],
      ['`auraClasses`', `\`${AURA_CLASSES.map((c) => `${c.label} ${c.min}`).join(' · ')}\``, '`AURA_CLASSES`'],
      ['`tierRank`', `\`${Object.entries(TIER_RANK).map(([t, r]) => `${t} ${r}`).join(' · ')}\``, '`TIER_RANK`'],
    ],
  )

  const catalog = table(
    ['Discipline', 'Exercises', 'Rated (have a curve)', 'Skills', 'Calibrated top', 'Ceiling', 'Benchmarks that set the ceiling'],
    [
      ...snap.map((s) => [short(s.discipline), s.exercises, s.rated, s.skills, s.calibratedTop, s.ceiling, s.topThree.map((id) => exerciseById[id].name).join(', ')]),
      [
        '**All**', EXERCISES.length, EXERCISES.filter((e) => e.curve).length, SKILLS.length,
        `Aura ${auraOf(snap.map((s) => s.calibratedTop)).toLocaleString('en-US')}`,
        `Aura ${auraOf(snap.map((s) => s.ceiling)).toLocaleString('en-US')}`, '',
      ],
    ],
  )

  const cov = coverage()
  const coverageTable = table(['Level', ...DISCIPLINE_IDS.map(short)], LEVELS.map((L, i) => [L, ...DISCIPLINE_IDS.map((d) => cov[d][i])]))

  const even = table(
    ['True level', ...DISCIPLINE_IDS.map(short)],
    LEVELS.slice(1).map((L) => [
      L,
      ...DISCIPLINE_IDS.map((d) => {
        const strict = evenAthleteRating(d, L)
        const loose = evenAthleteRating(d, L, true)
        return loose === strict ? `${strict}` : `${strict} (${loose})`
      }),
    ]),
  )

  const eqLevels = [200, 400, 600, 800, 1000]
  const equivalenceTables = DISCIPLINE_IDS.map((d) => {
    const rows = equivalence(d, eqLevels).map(({ exercise, cells }) => [
      exercise.name,
      `${exercise.curve![0][1]}–${exercise.curve![exercise.curve!.length - 1][1]}`,
      Math.round(hardCap(exercise.curve!)),
      ...cells.map((v) => (v === 'below' ? '' : v === 'above' ? '·' : v.extrapolated ? `(${formatValue(exercise, v.units)})` : formatValue(exercise, v.units))),
    ])
    return `**${disciplineById[d].name}**\n\n${table(['Benchmark', 'Calibrated', 'Cap', ...eqLevels.map(String)], rows)}`
  }).join('\n\n')

  return { constants, catalog, coverage: coverageTable, even, equivalence: equivalenceTables }
}

export const blockMarkers = (name: string) => [`<!-- generated:${name}:start -->`, `<!-- generated:${name}:end -->`] as const

/** Replace every generated block in a document. Returns the new text and the names that changed. */
export function applyDocBlocks(doc: string, blocks: Record<string, string> = docBlocks()) {
  const changed: string[] = []
  const missing: string[] = []
  let out = doc
  for (const [name, body] of Object.entries(blocks)) {
    const [start, end] = blockMarkers(name)
    const a = out.indexOf(start)
    const b = out.indexOf(end)
    if (a < 0 || b < 0 || b < a) {
      missing.push(name)
      continue
    }
    const next = `${out.slice(0, a + start.length)}\n${body}\n${out.slice(b)}`
    if (next !== out) changed.push(name)
    out = next
  }
  return { doc: out, changed, missing }
}
