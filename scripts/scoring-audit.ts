/**
 * Scoring audit. Recomputes every figure quoted in SCORING.md from the real
 * scoring code and catalog, and applies the admission framework (SCORING.md §E)
 * to every rated exercise.
 *
 *   npm run scoring:audit            print the audit
 *   npm run scoring:audit -- --write rewrite the generated tables in SCORING.md
 *   npm run scoring:audit -- --check exit 1 if SCORING.md is out of step
 *
 * Read-only with respect to scoring: nothing here changes a rating.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { DISCIPLINE_IDS, EXERCISES, disciplineById, exerciseById, formatValue } from '../src/domain/catalog'
import { SCORING } from '../src/domain/scoring/config'
import { curveRating } from '../src/domain/scoring/curve'
import { allRatings, disciplineRating } from '../src/domain/scoring/mastery'
import { computeAura } from '../src/domain/scoring/aura'
import {
  applyDocBlocks, auditCatalog, auraOf, catalogGrowth, docBlocks, duplicateGroups, familyByCategory, familyByLadder, ladderGaps,
  ratingOnePerFamily, ratingRange, repeatedSlots, selectionBias, snapshot,
} from '../src/domain/scoring/audit'
import { buildWorld } from '../src/data/seed'

const args = new Set(process.argv.slice(2))
const DOC = new URL('../SCORING.md', import.meta.url)

if (args.has('--write') || args.has('--check')) {
  const doc = readFileSync(DOC, 'utf8')
  const { doc: text, changed, missing } = applyDocBlocks(doc)
  if (missing.length) {
    console.error(`SCORING.md has no block for: ${missing.join(', ')}`)
    process.exit(1)
  }
  if (args.has('--check')) {
    if (changed.length) {
      console.error(`SCORING.md is out of step with the code in: ${changed.join(', ')}. Run: npm run scoring:audit -- --write`)
      process.exit(1)
    }
    console.log('SCORING.md matches the code.')
  } else {
    writeFileSync(DOC, text)
    console.log(changed.length ? `Rewrote: ${changed.join(', ')}` : 'Nothing to rewrite.')
  }
  process.exit(0)
}

const h = (s: string) => console.log(`\n── ${s} ${'─'.repeat(Math.max(0, 70 - s.length))}`)
const short = (d: (typeof DISCIPLINE_IDS)[number]) => disciplineById[d].short

h(`Model ${SCORING.version}`)
const blocks = docBlocks()
console.log(blocks.constants)
h('Catalog')
console.log(blocks.catalog)
h('Calibrated benchmarks available at each level')
console.log(blocks.coverage)
h('Even-athlete test: rating of an athlete exactly at each level (with sub-anchor attempts)')
console.log(blocks.even)

h('Admission framework applied to the whole catalog')
const findings = auditCatalog()
const tally: Record<string, number> = {}
for (const f of findings) tally[`${f.severity} ${f.check}`] = (tally[`${f.severity} ${f.check}`] ?? 0) + 1
console.log(Object.entries(tally).sort().map(([k, n]) => `${k}: ${n}`).join('\n'))
for (const f of findings.filter((f) => f.severity !== 'info')) console.log(`  [${f.severity}] ${f.exerciseId} · ${f.check} · ${f.detail}`)

h('Near-duplicate benchmark pairs')
const dups = duplicateGroups()
for (const d of DISCIPLINE_IDS) {
  const mine = dups.filter((x) => x.discipline === d)
  console.log(`${short(d)}: ${mine.length}`)
  for (const m of mine) console.log(`  ${m.ids.join(' ~ ')} · ${m.why}`)
}

h('Ladder gaps (next rung entry minus this rung top; negative = overlap)')
const gaps = ladderGaps()
console.log(`rated rung pairs: ${gaps.length} · overlapping: ${gaps.filter((g) => g.gap < 0).length} · touching: ${gaps.filter((g) => g.gap === 0).length} · open gap: ${gaps.filter((g) => g.gap > 0).length}`)
for (const g of gaps.filter((g) => g.gap > 0)) console.log(`  gap ${g.gap}: ${g.progression} ${g.from} → ${g.to}`)

h('Selection effect: expected inflation in σ when the best of n noisy readings are used')
const ns = [1, 2, 3, 5, 10, 20, 50, 100, 300]
console.log(`n          ${ns.map((n) => String(n).padStart(6)).join('')}`)
for (const how of ['slots', 'max', 'top3-mean', 'mean'] as const) console.log(`${how.padEnd(10)} ${ns.map((n) => selectionBias(n, how).toFixed(2).padStart(6)).join('')}`)

h('Catalog growth on the real curves: mean rating of a true-level athlete, catalog × factor')
for (const sigma of [0, 40, 80]) {
  console.log(`σ = ${sigma}`)
  for (const d of DISCIPLINE_IDS) {
    for (const theta of [300, 500, 700]) {
      console.log(`  ${short(d).padEnd(10)} θ=${theta}  ${[1, 2, 5, 10].map((f) => `×${f} ${catalogGrowth(d, theta, sigma, f, 1500).toFixed(0)}`).join('  ')}`)
    }
  }
}

h('Aura exponent: one shape under different means (scale 10)')
const shapes: [string, number[]][] = [
  ['even 500', [500, 500, 500, 500, 500, 500]],
  ['specialist 900 + five at 300', [900, 300, 300, 300, 300, 300]],
  ['two-discipline 800,800 + four at 300', [800, 800, 300, 300, 300, 300]],
  ['one discipline only, 600', [600, 0, 0, 0, 0, 0]],
  ['three disciplines at 600', [600, 600, 600, 0, 0, 0]],
  ['even 400', [400, 400, 400, 400, 400, 400]],
  ['all-rounder 600', [600, 600, 600, 600, 600, 600]],
  ['specialist 1000 + five at 200', [1000, 200, 200, 200, 200, 200]],
]
console.log(`${'shape'.padEnd(40)} ${['p=1', 'p=2', 'p=3', 'p=4', 'p=6', 'max'].map((s) => s.padStart(7)).join('')}`)
for (const [name, v] of shapes) console.log(`${name.padEnd(40)} ${[1, 2, 3, 4, 6, Infinity].map((p) => String(auraOf(v, p)).padStart(7)).join('')}`)

h('Sample athletes (demo world): rating · provisional range · one-per-family what-if')
const world = buildWorld(new Date('2026-11-14T12:00:00Z'), true)
for (const a of Object.values(world.athletes)) {
  const ev = world.evidence.filter((e) => e.athleteId === a.id)
  const ratings = allRatings(ev)
  const aura = computeAura(ratings)
  console.log(`${a.name} · Aura ${aura.aura} · mastery ${aura.mastery} · versatility ${aura.versatility} · ${aura.title} · ${aura.status}`)
  for (const d of DISCIPLINE_IDS) {
    const r = ratings[d]
    const range = ratingRange(d, ev)
    console.log(
      `   ${short(d).padEnd(10)} ${String(r.rating).padStart(4)} verified ${String(r.verified).padStart(4)} ${r.status.padEnd(9)} slots ${r.slots.map((s) => `${s.exerciseId}=${formatValue(exerciseById[s.exerciseId], s.value)}→${Math.round(s.score)}`).join(', ')}` +
        `${r.provisional ? `  range ${range.low}–${range.high}` : ''}  | per-category ${ratingOnePerFamily(d, ev, familyByCategory)} (${repeatedSlots(d, ev, familyByCategory)} repeated)  per-ladder ${ratingOnePerFamily(d, ev, familyByLadder)} (${repeatedSlots(d, ev, familyByLadder)} repeated)`,
    )
  }
}

h('Ceilings')
for (const s of snapshot()) console.log(`${short(s.discipline).padEnd(10)} calibrated top ${s.calibratedTop} · ceiling ${s.ceiling}`)

h('Spot checks used as worked examples')
const pu = exerciseById['pull-up']
console.log(`pull-up curve ${JSON.stringify(pu.curve)}`)
for (const v of [1, 3, 5, 9, 10, 15, 20, 25, 30, 40, 60]) console.log(`  pull-up ${v} → ${curveRating(pu.curve, v).toFixed(1)}`)
const one = (id: string, v: number) => `${id} ${v} → ${curveRating(exerciseById[id].curve, v).toFixed(1)} (curve ${JSON.stringify(exerciseById[id].curve)})`
for (const [id, v] of [['muscle-up', 1], ['freestanding-hs', 1], ['freestanding-hs', 30], ['one-arm-pullup', 1], ['plank', 1], ['plank', 60]] as const) if (exerciseById[id]?.curve) console.log(`  ${one(id, v)}`)
const E = (exerciseId: string, value: number, tier: 'self' | 'coach' | 'estimated' | 'observed' = 'self', date = '2026-01-01') => ({ id: `${exerciseId}${value}${tier}`, athleteId: 'x', exerciseId, value, tier, source: 'manual' as const, date })
const show = (label: string, ev: ReturnType<typeof E>[]) => {
  const r = disciplineRating('pull', ev)
  console.log(`  ${label}: ${r.rating} verified ${r.verified} ${r.status}${r.provisional ? ' provisional' : ''} shares ${Object.entries(r.share).filter(([, s]) => s > 0).map(([t, s]) => `${t} ${(s * 100).toFixed(0)}%`).join(' ')}`)
}
show('pull-up 10', [E('pull-up', 10)])
show('pull-up 10 + chin-up 12', [E('pull-up', 10), E('chin-up', 12)])
show('pull-up 10 + chin-up 12 + dead-hang 60', [E('pull-up', 10), E('chin-up', 12), E('dead-hang', 60)])
show('… + horizontal-row 15 (a fourth, stronger than the hang)', [E('pull-up', 10), E('chin-up', 12), E('dead-hang', 60), E('horizontal-row', 15)])
show('… pull-up verified by a coach', [E('pull-up', 10, 'coach'), E('chin-up', 12), E('dead-hang', 60)])
show('… self 12 later beats the verified 10', [E('pull-up', 10, 'coach'), E('pull-up', 12), E('chin-up', 12), E('dead-hang', 60)])
show('estimated only: pull-up 5', [E('pull-up', 5, 'estimated')])
console.log(`rated exercises: ${EXERCISES.filter((e) => e.curve).length} of ${EXERCISES.length}`)
