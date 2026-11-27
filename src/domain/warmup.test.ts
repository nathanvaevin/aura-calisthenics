import { describe, expect, it } from 'vitest'
import { exerciseById } from './catalog'
import { HANDSTAND_WARMUP, STARTER_TEMPLATES, WORKOUT_TEMPLATES, buildWorkout, withHandstandWarmup } from './training'
import { COURSE_TEMPLATES, courseFromTemplate } from '@/data/courseTemplates'
import type { WorkoutBlock } from './types'

const hasHandstand = (blocks: WorkoutBlock[]) => blocks.some((b) => exerciseById[b.exerciseId].discipline === 'handstand' && exerciseById[b.exerciseId].category !== 'Preparation')
const opensWithWarmup = (blocks: WorkoutBlock[]) => {
  const w = blocks.filter((b) => b.title === HANDSTAND_WARMUP.title)
  return w.length === 1 && w[0].metric === 'done' && w[0].sets === 1 && w[0].kind === 'warmup' && blocks.indexOf(w[0]) <= 1
}

describe('every handstand workout opens with the body and the wrists', () => {
  it('the ready-made sessions and a course’s first week', () => {
    for (const t of [...WORKOUT_TEMPLATES, ...STARTER_TEMPLATES]) {
      const blocks = buildWorkout(t, []).blocks
      expect(opensWithWarmup(blocks), t.id).toBe(hasHandstand(blocks))
    }
  })

  it('every session of every course template', () => {
    for (const t of COURSE_TEMPLATES) {
      const course = courseFromTemplate(t.id, 'coach', '2026-11-30')
      for (const s of course.weeks.flatMap((w) => w.sessions)) expect(opensWithWarmup(s.blocks), `${t.id} · ${s.title}`).toBe(hasHandstand(s.blocks))
    }
  })

  it('puts it first where a session had no wrist preparation, and leaves other sessions alone', () => {
    const balance = { id: 'b', kind: 'skill', exerciseId: 'crow-pose', sets: 3, target: 20, rest: 60 } as WorkoutBlock
    const out = withHandstandWarmup([balance], 'w')
    expect(out.map((b) => b.id)).toEqual(['w', 'b'])
    expect(out[0]).toMatchObject({ exerciseId: 'wrist-prep', metric: 'done', title: HANDSTAND_WARMUP.title })
    const pull = [{ ...balance, exerciseId: 'pullup' }]
    expect(withHandstandWarmup(pull, 'w')).toBe(pull)
  })
})
