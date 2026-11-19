import { describe, expect, it } from 'vitest'
import { growthOf, startingPoint } from './progress'
import type { Evidence } from './types'

const ev = (exerciseId: string, value: number, date: string, extra: Partial<Evidence> = {}): Evidence => ({ id: `${exerciseId}-${date}-${value}`, athleteId: 'a', exerciseId, value, tier: 'self', source: 'workout', date, ...extra })

describe('how far an athlete has come', () => {
  it('has no starting point before there is anything on record', () => {
    expect(startingPoint([])).toBeNull()
    expect(growthOf([])).toBeNull()
  })

  it('starts at the first assessment, all of it, even where its results were recorded over two days', () => {
    const first = [ev('pushup', 8, '2026-11-02T10:00:00.000Z', { source: 'assessment', assessmentId: 's1' }), ev('dead-hang', 20, '2026-11-03T10:00:00.000Z', { source: 'assessment', assessmentId: 's1' })]
    const later = [ev('pushup', 14, '2026-11-20T10:00:00.000Z'), ev('pull-up', 3, '2026-11-25T10:00:00.000Z')]
    const start = startingPoint([...later, ...first])!
    expect(start.evidence.map((e) => e.exerciseId).sort()).toEqual(['dead-hang', 'pushup'])
    expect(start.date).toBe('2026-11-02T10:00:00.000Z')
  })

  it('shows growth as the same scoring run on what was known then and what is known now', () => {
    const growth = growthOf([
      ev('pushup', 8, '2026-11-02T10:00:00.000Z', { source: 'assessment', assessmentId: 's1' }),
      ev('pushup', 20, '2026-11-20T10:00:00.000Z'),
      ev('pull-up', 6, '2026-11-25T10:00:00.000Z'),
    ])!
    expect(growth.ratings.push.now).toBeGreaterThan(growth.ratings.push.then)
    expect(growth.ratings.pull.then).toBe(0)
    expect(growth.ratings.pull.now).toBeGreaterThan(0)
    expect(growth.aura.now).toBeGreaterThan(growth.aura.then)
    expect(growth.newResults).toBe(2)
  })

  it('without an assessment, starts at the first day anything was recorded', () => {
    const growth = growthOf([ev('squat', 10, '2026-11-02T08:00:00.000Z'), ev('squat', 12, '2026-11-02T18:00:00.000Z'), ev('squat', 25, '2026-11-10T08:00:00.000Z')])!
    expect(growth.newResults).toBe(1)
    expect(growth.ratings.legs.now).toBeGreaterThan(growth.ratings.legs.then)
  })
})
