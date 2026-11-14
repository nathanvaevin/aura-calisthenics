import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { DisciplineId, Evidence, EvidenceTier } from '../types'
import { DISCIPLINE_IDS, EXERCISES, exerciseById } from '../catalog'
import { ME, buildWorld } from '@/data/seed'
import { useStore } from '@/data/store'
import { SCORING } from './config'
import { curveRating } from './curve'
import { allRatings, disciplineRating } from './mastery'
import { computeAura } from './aura'
import { makeBlock, skillStatuses } from './skills'
import { applyDocBlocks, auditCatalog, evenAthleteRating, hardCap, rng } from './audit'

/**
 * Invariants of the scoring model. These describe behaviour SCORING.md relies
 * on; if one fails, either the change is a mistake or the document and the
 * model version must change with it.
 */

const rated = EXERCISES.filter((e) => e.curve)
const ev = (exerciseId: string, value: number, tier: EvidenceTier = 'self', date = '2026-01-01T00:00:00.000Z'): Evidence => ({
  id: `${exerciseId}:${value}:${tier}:${date}`, athleteId: 'x', exerciseId, value, tier, source: 'manual', date,
})
const world = buildWorld(new Date('2026-11-14T12:00:00Z'), true)
const samples = Object.keys(world.athletes).map((id) => world.evidence.filter((e) => e.athleteId === id))
const values = (e: Evidence[]) => DISCIPLINE_IDS.map((d) => disciplineRating(d, e).rating)

describe('curves', () => {
  it('never decrease, start at zero and stop at 1.25 × the last anchor', () => {
    for (const ex of rated) {
      const c = ex.curve!
      const last = c[c.length - 1][0]
      let prev = 0
      expect(curveRating(c, 0)).toBe(0)
      for (let v = 1; v <= last * 12; v++) {
        const r = curveRating(c, v)
        expect(r, `${ex.id} at ${v}`).toBeGreaterThanOrEqual(prev)
        expect(r).toBeLessThanOrEqual(hardCap(c) + 1e-9)
        prev = r
      }
      for (const [v, r] of c) expect(curveRating(c, v)).toBeCloseTo(r, 9)
      expect(curveRating(c, 1e9)).toBeCloseTo(hardCap(c), 9)
    }
  })

  it('pass the admission framework without a failure', () => {
    expect(auditCatalog().filter((f) => f.severity === 'fail')).toEqual([])
  })
})

describe('discipline ratings', () => {
  it('use weights that sum to one, strongest first', () => {
    expect(SCORING.slotWeights.reduce((s, w) => s + w, 0)).toBeCloseTo(1, 12)
    expect([...SCORING.slotWeights].sort((a, b) => b - a)).toEqual([...SCORING.slotWeights])
  })

  it('read L for an athlete who is exactly L on the benchmarks at that level', () => {
    for (const d of DISCIPLINE_IDS) for (const L of [300, 400, 500, 700]) expect(Math.abs(evenAthleteRating(d, L) - L), `${d} ${L}`).toBeLessThanOrEqual(3)
  })

  it('never fall when evidence is added, whatever it is', () => {
    const r = rng(42)
    for (const base of samples) {
      let evidence = [...base]
      let before = values(evidence)
      let aura = computeAura(allRatings(evidence)).aura
      for (let i = 0; i < 40; i++) {
        const ex = rated[Math.floor(r() * rated.length)]
        const top = ex.curve![ex.curve!.length - 1][0]
        const tier = (['estimated', 'self', 'observed', 'coach', 'video'] as const)[Math.floor(r() * 5)]
        evidence = [...evidence, ev(ex.id, 1 + Math.floor(r() * top * 1.5), tier, `2026-02-${String(1 + (i % 28)).padStart(2, '0')}`)]
        const after = values(evidence)
        after.forEach((v, k) => expect(v).toBeGreaterThanOrEqual(before[k]))
        const nextAura = computeAura(allRatings(evidence)).aura
        expect(nextAura).toBeGreaterThanOrEqual(aura)
        before = after
        aura = nextAura
      }
    }
  })

  it('ignore volume: repeats, weaker benchmarks and unrated exercises move nothing', () => {
    for (const base of samples) {
      const before = values(base)
      const repeats = base.flatMap((e) => [e, { ...e, id: `${e.id}-again` }, { ...e, id: `${e.id}-less`, value: Math.max(1, e.value - 1) }])
      expect(values(repeats)).toEqual(before)
      const unrated = EXERCISES.filter((e) => !e.curve).map((e) => ev(e.id, 500))
      expect(values([...base, ...unrated])).toEqual(before)
      for (const d of DISCIPLINE_IDS) {
        const slots = disciplineRating(d, base).slots
        if (slots.length < SCORING.slotWeights.length) continue
        const third = slots[slots.length - 1].score
        const weaker = rated.filter((e) => e.discipline === d && !slots.some((s) => s.exerciseId === e.id)).flatMap((e) => {
          for (let v = e.curve![e.curve!.length - 1][0]; v >= 1; v--) if (curveRating(e.curve, v) < third) return [ev(e.id, v)]
          return []
        })
        expect(disciplineRating(d, [...base.filter((x) => !weaker.some((w) => w.exerciseId === x.exerciseId)), ...weaker]).rating).toBe(disciplineRating(d, base).rating)
      }
    }
  })

  it('give the same number whatever the tier, and a verified rating from verified evidence only', () => {
    for (const base of samples) {
      const asSelf = base.map((e) => ({ ...e, tier: 'self' as const }))
      const asCoach = base.map((e) => ({ ...e, tier: 'coach' as const }))
      expect(values(asSelf)).toEqual(values(base))
      for (const d of DISCIPLINE_IDS) {
        expect(disciplineRating(d, asSelf).verified).toBe(0)
        const c = disciplineRating(d, asCoach)
        expect(c.verified).toBe(c.rating)
        expect(disciplineRating(d, base).verified).toBeLessThanOrEqual(disciplineRating(d, base).rating)
      }
    }
  })

  it('label by where the number comes from', () => {
    const three = (a: EvidenceTier, b: EvidenceTier, c: EvidenceTier) => disciplineRating('pull', [ev('pull-up', 10, a), ev('chin-up', 12, b), ev('dead-hang', 60, c)]).status
    expect(three('coach', 'coach', 'self')).toBe('verified')
    expect(three('coach', 'self', 'self')).toBe('self')
    expect(three('observed', 'observed', 'self')).toBe('observed')
    expect(three('coach', 'observed', 'self')).toBe('observed')
    expect(three('estimated', 'estimated', 'self')).toBe('estimated')
    expect(disciplineRating('pull', []).status).toBe('unrated')
    expect(disciplineRating('pull', [ev('pull-up', 10)]).provisional).toBe(true)
  })

  it('let a better self-reported result replace a verified one as the counted best (documented in SCORING.md §4.4)', () => {
    const r = disciplineRating('pull', [ev('pull-up', 10, 'coach'), ev('pull-up', 12, 'self')])
    expect(r.slots[0]).toMatchObject({ value: 12, tier: 'self' })
    expect(r.verified).toBe(Math.round(curveRating(exerciseById['pull-up'].curve, 10) * SCORING.slotWeights[0]))
  })
})

describe('aura', () => {
  const ratingsOf = (v: number[]) => Object.fromEntries(DISCIPLINE_IDS.map((d, i) => [d, { ...disciplineRating(d, []), rating: v[i] }])) as ReturnType<typeof allRatings>
  const aura = (v: number[]) => computeAura(ratingsOf(v)).aura

  it('sits between the average and the peak, and equals both for an even athlete', () => {
    const r = rng(9)
    for (let i = 0; i < 300; i++) {
      const v = DISCIPLINE_IDS.map(() => Math.round(r() * 1100))
      const mean = v.reduce((s, x) => s + x, 0) / v.length
      expect(aura(v)).toBeGreaterThanOrEqual(Math.floor(mean * SCORING.auraScale))
      expect(aura(v)).toBeLessThanOrEqual(Math.max(...v) * SCORING.auraScale)
    }
    expect(aura([500, 500, 500, 500, 500, 500])).toBe(5000)
    expect(aura([0, 0, 0, 0, 0, 0])).toBe(0)
  })

  it('does not care which discipline is which, and scales with the ratings', () => {
    const v = [900, 300, 420, 610, 150, 0]
    expect(aura([...v].reverse())).toBe(aura(v))
    expect(Math.abs(aura(v.map((x) => x * 2)) - 2 * aura(v))).toBeLessThanOrEqual(1)
  })

  it('never falls when one rating rises', () => {
    const v = [600, 300, 420, 610, 150, 0]
    for (let d = 0; d < 6; d++) expect(aura(v.map((x, i) => (i === d ? x + 50 : x)))).toBeGreaterThanOrEqual(aura(v))
  })

  it('is untouched by training activity: a finished session with nothing put on record moves no number', () => {
    const store = useStore.getState()
    store.reset()
    store.startDemo()
    const mine = () => useStore.getState().evidence.filter((e) => e.athleteId === ME)
    const before = computeAura(allRatings(mine()))
    for (let i = 0; i < 3; i++) {
      useStore.getState().startWorkout({ type: 'library', workoutId: 'x' }, 'Volume', [makeBlock('strength', 'pull-up', { sets: 2 })])
      useStore.getState().completeSet(40)
      useStore.getState().completeSet(40)
      useStore.getState().finishWorkout({ claims: [] })
    }
    expect(useStore.getState().logs.filter((l) => l.title === 'Volume')).toHaveLength(3)
    expect(computeAura(allRatings(mine()))).toEqual(before)
  })
})

describe('skills', () => {
  it('imply prerequisites without adding to a rating', () => {
    const e = [ev('muscle-up', 1)]
    const s = skillStatuses(e)
    expect(s['pull-mu-1']).toMatchObject({ state: 'mastered', implied: false })
    expect(s['pull-10']).toMatchObject({ state: 'mastered', implied: true })
    expect(disciplineRating('pull', e).slots).toHaveLength(1)
    expect(disciplineRating('push' as DisciplineId, e).rating).toBe(0)
  })
})

describe('SCORING.md', () => {
  it('states the constants and catalog figures the code actually has', () => {
    const doc = readFileSync(new URL('../../../SCORING.md', import.meta.url), 'utf8')
    const { changed, missing } = applyDocBlocks(doc)
    expect(missing, 'generated blocks missing from SCORING.md').toEqual([])
    expect(changed, 'SCORING.md is out of step with the code; run `npm run scoring:audit -- --write`').toEqual([])
  })
})
