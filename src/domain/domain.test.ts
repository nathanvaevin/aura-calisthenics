import { describe, expect, it } from 'vitest'
import type { Evidence, EvidenceTier } from './types'
import { DISCIPLINE_IDS, EXERCISES, PROGRESSIONS, SKILLS, exerciseById, skillById, skillsOf, ratedExercisesOf } from './catalog'
import { curveRating } from './scoring/curve'
import { allRatings, disciplineRating } from './scoring/mastery'
import { auraFor, computeAura, dedication } from './scoring/aura'
import { adaptTarget, pathTo, skillStatuses, trainingFor, workingLevel } from './scoring/skills'
import { WORKOUT_TEMPLATES, buildGoalWorkout, buildWorkout } from './training'

let n = 0
const ev = (exerciseId: string, value: number, tier: EvidenceTier = 'self', date = '2026-01-01T00:00:00.000Z'): Evidence => ({
  id: `e${n++}`, athleteId: 'a', exerciseId, value, tier, source: 'manual', date,
})

describe('catalog integrity', () => {
  it('has unique ids', () => {
    expect(new Set(EXERCISES.map((e) => e.id)).size).toBe(EXERCISES.length)
    expect(new Set(SKILLS.map((s) => s.id)).size).toBe(SKILLS.length)
    expect(new Set(PROGRESSIONS.map((p) => p.id)).size).toBe(PROGRESSIONS.length)
  })

  it('has strictly ascending calibration curves', () => {
    for (const ex of EXERCISES) {
      if (!ex.curve) continue
      for (let i = 1; i < ex.curve.length; i++) {
        expect(ex.curve[i][0], `${ex.id} value`).toBeGreaterThan(ex.curve[i - 1][0])
        expect(ex.curve[i][1], `${ex.id} rating`).toBeGreaterThan(ex.curve[i - 1][1])
      }
    }
  })

  it('keeps short names short and doses sane', () => {
    for (const ex of EXERCISES) {
      expect(ex.short.length, ex.id).toBeLessThanOrEqual(14)
      expect(ex.dose.range[0], ex.id).toBeLessThanOrEqual(ex.dose.range[1])
      expect(ex.primary.length, ex.id).toBeGreaterThan(0)
      expect(ex.cues.length, ex.id).toBeGreaterThanOrEqual(2)
    }
  })

  it('resolves every progression step and keeps ladders within ten levels', () => {
    for (const p of PROGRESSIONS) {
      expect(p.steps.length).toBeLessThanOrEqual(10)
      p.steps.forEach((s, i) => {
        expect(s.level).toBe(i + 1)
        for (const id of [s.exerciseId, ...(s.alternates ?? [])]) expect(exerciseById[id], `${p.id}:${id}`).toBeDefined()
      })
    }
  })

  it('orders each ladder by rising benchmark value where both rungs are rated', () => {
    for (const p of PROGRESSIONS) {
      let last = -1
      for (const s of p.steps) {
        const ex = exerciseById[s.exerciseId]
        if (!ex.curve) continue
        const entry = ex.curve[0][1]
        expect(entry, `${p.id} level ${s.level} (${ex.id})`).toBeGreaterThanOrEqual(last)
        last = entry
      }
    }
  })

  it('resolves skill prerequisites, which never outrank the skill they gate', () => {
    for (const s of SKILLS) {
      expect(exerciseById[s.exerciseId].curve, s.id).toBeDefined()
      for (const r of s.requires) {
        expect(skillById[r], `${s.id} -> ${r}`).toBeDefined()
        expect(skillById[r].rating, `${s.id} -> ${r}`).toBeLessThanOrEqual(s.rating)
      }
    }
  })

  it('has no prerequisite cycles', () => {
    const state = new Map<string, number>()
    const visit = (id: string): void => {
      if (state.get(id) === 2) return
      expect(state.get(id), `cycle at ${id}`).not.toBe(1)
      state.set(id, 1)
      skillById[id].requires.forEach(visit)
      state.set(id, 2)
    }
    SKILLS.forEach((s) => visit(s.id))
  })

  it('gives every discipline enough rated benchmarks and skills', () => {
    for (const d of DISCIPLINE_IDS) {
      expect(ratedExercisesOf(d).length, d).toBeGreaterThanOrEqual(5)
      expect(skillsOf(d).length, d).toBeGreaterThanOrEqual(10)
    }
  })

  it('builds every workout template', () => {
    for (const t of WORKOUT_TEMPLATES) {
      const w = buildWorkout(t, [])
      expect(w.blocks.length).toBe(t.plan.length)
      for (const b of w.blocks) expect(exerciseById[b.exerciseId], `${t.id}:${b.exerciseId}`).toBeDefined()
    }
  })
})

describe('rating curves', () => {
  const curve = exerciseById['pull-up'].curve!
  it('interpolates between anchors', () => {
    expect(curveRating(curve, 1)).toBe(300)
    expect(curveRating(curve, 10)).toBe(480)
    expect(curveRating(curve, 9)).toBeCloseTo(465)
  })
  it('is zero without performance and rises monotonically', () => {
    expect(curveRating(curve, 0)).toBe(0)
    let last = 0
    for (let v = 1; v <= 60; v++) {
      const r = curveRating(curve, v)
      expect(r).toBeGreaterThanOrEqual(last)
      last = r
    }
  })
  it('continues past the last anchor without running away', () => {
    const top = curve[curve.length - 1][1]
    expect(curveRating(curve, 30)).toBeGreaterThan(top)
    expect(curveRating(curve, 500)).toBeLessThanOrEqual(top * 1.25)
  })
})

describe('mastery ratings', () => {
  it('is unrated with no evidence', () => {
    const r = disciplineRating('pull', [])
    expect(r.rating).toBe(0)
    expect(r.status).toBe('unrated')
  })

  it('blends the three strongest benchmarks', () => {
    const r = disciplineRating('pull', [ev('pull-up', 10), ev('dead-hang', 60), ev('horizontal-row', 10), ev('scap-pull', 5)])
    expect(r.slots.map((s) => s.exerciseId)).toEqual(['pull-up', 'horizontal-row', 'dead-hang'])
    expect(r.rating).toBe(Math.round(480 * 0.5 + 290 * 0.3 + 200 * 0.2))
    expect(r.provisional).toBe(false)
  })

  it('stays provisional until three benchmarks exist', () => {
    expect(disciplineRating('pull', [ev('pull-up', 10)]).provisional).toBe(true)
  })

  it('does not move when weaker or repeated evidence is added', () => {
    const base = [ev('pull-up', 10), ev('dead-hang', 60), ev('horizontal-row', 10)]
    const before = disciplineRating('pull', base).rating
    const after = disciplineRating('pull', [...base, ev('pull-up', 8), ev('pull-up', 10), ev('incline-row', 10)]).rating
    expect(after).toBe(before)
  })

  it('ignores exercises that carry no calibration', () => {
    expect(disciplineRating('handstand', [ev('wrist-prep', 50), ev('heel-pulls', 20)]).rating).toBe(0)
  })

  it('separates verified from self-reported evidence', () => {
    const r = disciplineRating('pull', [ev('pull-up', 12, 'self'), ev('pull-up', 10, 'coach'), ev('dead-hang', 60, 'estimated')])
    expect(r.verified).toBe(Math.round(480 * 0.5))
    expect(r.rating).toBeGreaterThan(r.verified)
    expect(r.status).toBe('self')
  })

  it('labels estimate-driven ratings as estimated', () => {
    expect(disciplineRating('pull', [ev('pull-up', 5, 'estimated')]).status).toBe('estimated')
    expect(disciplineRating('pull', [ev('pull-up', 5, 'coach'), ev('dead-hang', 30, 'self')]).status).toBe('verified')
  })
})

describe('aura', () => {
  const flat = (v: number) => {
    const r = allRatings([])
    DISCIPLINE_IDS.forEach((d) => (r[d] = { ...r[d], rating: v }))
    return r
  }

  it('is zero and unranked with no ratings', () => {
    const a = auraFor([])
    expect(a.aura).toBe(0)
    expect(a.title).toBe('Unranked')
  })

  it('equals ten times the rating for a perfectly even athlete', () => {
    const a = computeAura(flat(600))
    expect(a.aura).toBe(6000)
    expect(a.versatility).toBe(100)
  })

  it('credits a specialist above their plain average but below an even athlete at the same peak', () => {
    const r = flat(300)
    r.handstand = { ...r.handstand, rating: 900 }
    const a = computeAura(r)
    expect(a.aura).toBeGreaterThan(a.mastery * 10)
    expect(a.aura).toBeLessThan(computeAura(flat(900)).aura)
    expect(a.peak).toEqual({ discipline: 'handstand', rating: 900 })
    expect(a.archetype).toBe('Balancer')
  })

  it('never changes with training activity', () => {
    const evidence = [ev('pull-up', 10), ev('pushup', 20)]
    expect(auraFor(evidence).aura).toBe(auraFor([...evidence]).aura)
  })
})

describe('skill tree', () => {
  it('opens root skills and locks the rest', () => {
    const s = skillStatuses([])
    expect(s['pull-hang-30'].state).toBe('available')
    expect(s['pull-first'].state).toBe('locked')
  })

  it('masters every threshold a single performance clears and implies prerequisites', () => {
    const s = skillStatuses([ev('pull-up', 10)])
    expect(s['pull-first'].state).toBe('mastered')
    expect(s['pull-10'].implied).toBe(false)
    expect(s['pull-neg-5']).toMatchObject({ state: 'mastered', implied: true })
    expect(s['pull-20']).toMatchObject({ state: 'available', progress: 0.5 })
  })

  it('carries the strongest tier that clears the threshold', () => {
    const s = skillStatuses([ev('pull-up', 6, 'coach'), ev('pull-up', 11, 'self')])
    expect(s['pull-5'].tier).toBe('coach')
    expect(s['pull-10'].tier).toBe('self')
  })

  it('lists what is missing for a goal, prerequisites first', () => {
    const statuses = skillStatuses([ev('pull-up', 6), ev('hollow-hold', 40)])
    const path = pathTo('pull-fl-full-5', statuses).map((p) => p.id)
    expect(path.at(-1)).toBe('pull-fl-full-5')
    expect(path).toContain('pull-fl-tuck-10')
    expect(path).not.toContain('pull-5')
    for (const id of path) {
      for (const r of skillById[id].requires) {
        if (path.includes(r)) expect(path.indexOf(r)).toBeLessThan(path.indexOf(id))
      }
    }
    expect(pathTo('pull-5', statuses)).toEqual([])
  })

  it('recommends training and builds a goal session', () => {
    const evidence = [ev('pull-up', 6), ev('hollow-hold', 40)]
    const statuses = skillStatuses(evidence)
    const picks = trainingFor(skillById['pull-fl-tuck-10'], evidence)
    expect(picks.some((p) => p.exerciseId === 'tuck-fl')).toBe(true)
    const w = buildGoalWorkout('pull-fl-full-5', evidence, statuses)!
    expect(w.blocks.some((b) => b.exerciseId === 'tuck-fl')).toBe(true)
    expect(buildGoalWorkout('pull-5', evidence, statuses)).toBeNull()
  })
})

describe('difficulty levels', () => {
  it('finds the working level from what the athlete can do', () => {
    expect(workingLevel('pullup', [])).toBe(1)
    expect(workingLevel('pullup', [ev('pull-up', 6)])).toBe(5)
    expect(workingLevel('pullup', [ev('pull-up', 20)])).toBe(6)
    expect(workingLevel('pushup', [ev('knee-pushup', 12)])).toBe(4)
  })

  it('adapts a prescription when the variation changes', () => {
    const pushup = exerciseById['pushup']
    expect(adaptTarget(pushup, 10, pushup)).toBe(10)
    expect(adaptTarget(pushup, 10, exerciseById['knee-pushup'])).toBe(10)
    expect(adaptTarget(pushup, 12, exerciseById['archer-pushup'])).toBe(8)
    const hang = exerciseById['dead-hang']
    expect(adaptTarget(exerciseById['pull-up'], 5, hang, -1)).toBe(hang.dose.range[1])
    expect(adaptTarget(exerciseById['pull-up'], 5, hang, 1)).toBe(hang.dose.range[0])
    expect(adaptTarget(exerciseById['pull-up'], 5, hang) % 5).toBe(0)
  })
})

describe('dedication', () => {
  it('scores adherence to the weekly target and never needs evidence', () => {
    const now = new Date('2026-03-18T12:00:00Z')
    const log = (daysAgo: number) => ({
      id: `l${daysAgo}`, athleteId: 'a', title: 't', source: { type: 'library' as const, workoutId: 'x' },
      startedAt: new Date(now.getTime() - daysAgo * 86400000).toISOString(),
      finishedAt: new Date(now.getTime() - daysAgo * 86400000).toISOString(), entries: [],
    })
    const d = dedication([log(0), log(1), log(8), log(9), log(10)], 3, now)
    expect(d.total).toBe(5)
    expect(d.streak).toBe(3)
    expect(d.score).toBeGreaterThan(0)
    expect(d.score).toBeLessThan(100)
    expect(dedication([], 3, now).score).toBe(0)
  })
})
