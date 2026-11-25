import { describe, expect, it } from 'vitest'
import { COURSE_TEMPLATES, blankWeek, moveWeek } from '@/data/courseTemplates'
import { exerciseById, progressionById, stepAt } from './catalog'
import { workingLevel } from './scoring/skills'
import { courseFor, isStarter, starterSessions } from './training'
import type { Course, Evidence } from './types'

const course = (id: string): Course => {
  const t = COURSE_TEMPLATES.find((x) => x.id === id)!
  return { id: 'c1', coachId: 'coach', title: t.title, tagline: t.tagline, description: t.description, focus: t.focus, format: 'group', status: 'active', startDate: '2026-11-02', milestones: t.milestones, weeks: t.build() }
}
const shown = (exerciseId: string, value: number): Evidence => ({ id: `e-${exerciseId}`, athleteId: 'a', exerciseId, value, tier: 'self', source: 'assessment', date: '2026-11-03T10:00:00.000Z' })

describe('the first week of a course that opens with an assessment', () => {
  const usc = course('usc-beginner')

  it('was empty as written, and is not for the athlete following it', () => {
    expect(usc.weeks[0].kind).toBe('baseline')
    expect(usc.weeks[0].sessions).toEqual([])
    const mine = courseFor(usc, [])
    expect(mine.weeks[0].sessions.length).toBe(2)
    for (const s of mine.weeks[0].sessions) {
      expect(isStarter(s.id)).toBe(true)
      expect(s.blocks.length).toBeGreaterThanOrEqual(5)
      expect(s.blocks.length).toBeLessThanOrEqual(8)
    }
  })

  it('uses exercises from the one library, and every ladder block names a real rung', () => {
    for (const s of starterSessions('w1', [])) for (const b of s.blocks) {
      expect(exerciseById[b.exerciseId], b.exerciseId).toBeDefined()
      if (b.progressionId) {
        expect(progressionById[b.progressionId], b.progressionId).toBeDefined()
        expect(stepAt(b.progressionId, b.level!)!.exerciseId).toBe(b.exerciseId)
        expect(b.minLevel).toBeLessThanOrEqual(b.level!)
        expect(b.maxLevel).toBeGreaterThanOrEqual(b.level!)
      }
      expect(b.sets).toBeGreaterThan(0)
      expect(b.target).toBeGreaterThan(0)
    }
  })

  it('puts each athlete on the rung their own results put them on', () => {
    const beginner = starterSessions('w1', [])
    const stronger: Evidence[] = [shown('pushup', 25), shown('pull-up', 8), shown('horizontal-row', 12)]
    const advanced = starterSessions('w1', stronger)
    const rung = (sessions: typeof beginner, ladder: string) => sessions.flatMap((s) => s.blocks).find((b) => b.progressionId === ladder)!
    for (const ladder of ['pushup', 'pullup', 'row']) {
      expect(rung(beginner, ladder).level, ladder).toBe(workingLevel(ladder, []))
      expect(rung(advanced, ladder).level, ladder).toBe(workingLevel(ladder, stronger))
      expect(rung(advanced, ladder).level!, ladder).toBeGreaterThan(rung(beginner, ladder).level!)
    }
    // Where nothing was shown, nothing changes.
    expect(rung(advanced, 'single-leg-squat').level).toBe(rung(beginner, 'single-leg-squat').level)
  })

  it('is the same session each time it is worked out, so a logged one is found again', () => {
    const a = starterSessions('w1', []), b = starterSessions('w1', [])
    expect(a.map((s) => s.id)).toEqual(b.map((s) => s.id))
    expect(a.flatMap((s) => s.blocks.map((x) => x.id))).toEqual(b.flatMap((s) => s.blocks.map((x) => x.id)))
    expect(new Set(a.flatMap((s) => s.blocks.map((x) => x.id))).size).toBe(a.flatMap((s) => s.blocks).length)
  })

  it('leaves every other week exactly as the coach wrote it', () => {
    const mine = courseFor(usc, [shown('pushup', 12)])
    for (let i = 1; i < usc.weeks.length; i++) expect(mine.weeks[i]).toBe(usc.weeks[i])
    expect(mine.weeks.length).toBe(usc.weeks.length)
    // The course itself is not changed.
    expect(usc.weeks[0].sessions).toEqual([])
  })

  it('steps aside when the coach writes sessions into that week, and for courses with no such week', () => {
    const written = { ...usc, weeks: usc.weeks.map((w, i) => (i === 0 ? { ...w, sessions: [usc.weeks[1].sessions[0]] } : w)) }
    expect(courseFor(written, [])).toBe(written)
    const plain = course('handstand-foundations')
    expect(courseFor(plain, [])).toBe(plain)
    // A re-test week at the end stays an assessment only.
    const last = usc.weeks[usc.weeks.length - 1]
    expect(last.kind).toBe('retest')
    expect(courseFor(usc, []).weeks[usc.weeks.length - 1]).toBe(last)
  })
})

describe('moving a week of a course', () => {
  const course = () => ({ weeks: COURSE_TEMPLATES.find((t) => t.id === 'usc-beginner')!.build() })

  it('takes the week as it is to its new place, and the others close up', () => {
    const c = course(), before = c.weeks.map((w) => w.id), fourth = structuredClone(c.weeks[3])
    moveWeek(c, 3, 1)
    expect(c.weeks.map((w) => w.id)).toEqual([before[0], before[3], before[1], before[2], ...before.slice(4)])
    // Its sessions, exercises and ids are untouched: what athletes did in it is still theirs.
    expect(c.weeks[1]).toEqual(fourth)
    moveWeek(c, 1, 3)
    expect(c.weeks.map((w) => w.id)).toEqual(before)
    moveWeek(c, 0, c.weeks.length - 1)
    expect(c.weeks.map((w) => w.id)).toEqual([...before.slice(1), before[0]])
  })

  it('leaves the course alone when asked for a place that is not there', () => {
    const c = course(), before = structuredClone(c.weeks)
    for (const [from, to] of [[2, 2], [-1, 2], [2, 99], [0.5, 1]]) moveWeek(c, from, to)
    expect(c.weeks).toEqual(before)
  })

  it('renames a week that was only called by its number, and no other', () => {
    const c = { weeks: [blankWeek(1), blankWeek(2), { ...blankWeek(3), title: 'Pulling' }, blankWeek(4)] }
    moveWeek(c, 3, 1)
    expect(c.weeks.map((w) => w.title)).toEqual(['Week 1', 'Week 2', 'Week 3', 'Pulling'])
    expect(new Set(c.weeks.map((w) => w.id)).size).toBe(4)
  })
})
