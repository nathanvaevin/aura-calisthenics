import { describe, expect, it } from 'vitest'
import type { LogEntry, WorkoutLog } from '@/domain/types'
import { exerciseById } from '@/domain/catalog'
import { candidatesIn } from './store'

const entry = (metric?: LogEntry['metric']): LogEntry => ({
  blockId: 'b', kind: 'warmup', assignedExerciseId: 'pushup', assignedTarget: 60, exerciseId: 'pushup', target: 60, rest: 0,
  ...(metric ? { metric } : {}),
  sets: [{ value: 60, done: true, exerciseId: 'pushup' }],
})
const log = (e: LogEntry): WorkoutLog => ({ id: 'l', athleteId: 'a', title: 'Push', source: { type: 'library', workoutId: 'x' }, startedAt: '', entries: [e] })

describe('a coach’s own unit', () => {
  it('push-ups counted in reps can be a record', () => {
    expect(exerciseById.pushup.metric).toBe('reps')
    expect(exerciseById.pushup.curve).toBeTruthy()
    expect(candidatesIn(log(entry()), []).map((c) => c.value)).toEqual([60])
  })

  it('a minute of push-ups as a warm up is training, never a record', () => {
    expect(candidatesIn(log(entry('hold')), [])).toEqual([])
  })
})
