import { describe, expect, it } from 'vitest'
import { exerciseById, skillById } from './catalog'
import { GOALS, MAX_GOALS, acceptGoal, declineGoal } from './goals'
import { courseOfCode, decodeCourseInvite, encodeCourseInvite, shortCourseCode } from './courseLink'

describe('the goals on offer', () => {
  it('are skills, each shown by an exercise', () => {
    expect(new Set(GOALS).size).toBe(GOALS.length)
    for (const g of GOALS) expect(exerciseById[skillById[g].exerciseId], g).toBeDefined()
  })

  it('are accepted up to three, once each, and can be taken off', () => {
    let mine: string[] = []
    for (const g of GOALS.slice(0, 5)) mine = acceptGoal(mine, g)
    expect(mine).toEqual(GOALS.slice(0, MAX_GOALS))
    expect(acceptGoal(mine, GOALS[0])).toBe(mine)
    expect(declineGoal(mine, GOALS[1])).toEqual([GOALS[0], GOALS[2]])
    expect(declineGoal(mine, GOALS[9])).toEqual(mine)
  })
})

describe('an invitation to a course', () => {
  it('says which course, what it is called and who invites, and survives being a link', () => {
    const i = { courseId: 'f5e0a563-d31c-4354-a4ed-ab63df107fb8', title: 'USC Calisthenics · Béginner', coachName: 'José Ünal' }
    const data = encodeCourseInvite(i)
    expect(data).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(data.length).toBeLessThan(220)
    expect(decodeCourseInvite(data)).toEqual(i)
  })

  it('is short: the course alone, in 22 characters, and back', () => {
    const id = '3f2a9c1e-7b44-4d0a-9e2f-0c5b8a6d1e93'
    const code = shortCourseCode(id)!
    expect(code).toMatch(/^[A-Za-z0-9_-]{22}$/)
    expect(courseOfCode(code)).toBe(id)
    expect(shortCourseCode('local-course')).toBeNull()
    for (const bad of ['', 'abc', code.slice(1), code + 'A']) expect(courseOfCode(bad)).toBeNull()
  })

  it('is nothing when it cannot be read', () => {
    for (const bad of ['', 'abc', encodeCourseInvite({ courseId: '../x', title: 'a', coachName: 'b' }), btoa('[2,"abc","t","c"]')]) expect(decodeCourseInvite(bad)).toBeNull()
  })
})
