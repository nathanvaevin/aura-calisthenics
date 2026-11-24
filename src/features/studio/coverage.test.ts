import { describe, expect, it } from 'vitest'
import { EXERCISES } from '@/domain/catalog'
import type { CharacterId, DemoAsset } from '@/domain/media'
import { REVISIONS } from '@/visual/revisions'
import { characterState, coverageOf, exerciseState, withAthletes } from './coverage'

const asset = (exerciseId: string, character: CharacterId, status: DemoAsset['status'], revision = REVISIONS[exerciseId], version = 1): DemoAsset => ({
  id: `${exerciseId}-${character}-${version}`, exerciseId, kind: 'animation', slot: character, version, status, title: '', notes: [], replaces: null,
  createdBy: null, createdAt: '2026-11-24T00:00:00Z', updatedAt: '2026-11-24T00:00:00Z', reviewedAt: null, publishedAt: null,
  animation: { character, motion: exerciseId, revision, camera: 'threeQuarter', theme: null },
} as unknown as DemoAsset)

describe('coverage of the two characters', () => {
  it('has a movement for every exercise in the library, and each serves both characters', () => {
    const cover = coverageOf([])
    expect(cover.total).toBe(EXERCISES.length)
    expect(cover.movements).toBe(cover.total)
  })

  it('does not count a movement that merely exists', () => {
    const cover = coverageOf([])
    expect(cover.live).toEqual({ male: 0, female: 0 })
    expect(characterState([], 'pushup', 'female')).toBe('waiting')
  })

  it('does not count an animation waiting for review, or one sent back', () => {
    const waiting = [asset('pushup', 'female', 'pending')]
    expect(characterState(waiting, 'pushup', 'female')).toBe('waiting')
    const back = [asset('pushup', 'female', 'needs_correction')]
    expect(characterState(back, 'pushup', 'female')).toBe('correction')
    expect(coverageOf([...waiting, ...back]).live.female).toBe(0)
  })

  it('counts each character on its own, and names an exercise that only one of them has', () => {
    const one = [asset('pushup', 'male', 'published')]
    const cover = coverageOf(one)
    expect(cover.live).toEqual({ male: 1, female: 0 })
    expect(cover.uneven).toEqual([{ exerciseId: 'pushup', missing: 'female' }])
    expect(exerciseState(one, 'pushup')).toBe('waiting')
    const both = [...one, asset('pushup', 'female', 'published')]
    expect(coverageOf(both).uneven).toEqual([])
    expect(exerciseState(both, 'pushup')).toBe('live')
  })

  it('stops counting an approved animation once its movement has been changed', () => {
    const old = [asset('scap-pushup', 'female', 'published', REVISIONS['scap-pushup'] - 1)]
    expect(characterState(old, 'scap-pushup', 'female')).toBe('waiting')
  })

  it('keeps counting what athletes still see while a newer version waits for review', () => {
    const history = [asset('pushup', 'female', 'published', undefined, 1), asset('pushup', 'female', 'pending', undefined, 2)]
    expect(characterState(history, 'pushup', 'female')).toBe('waiting')
    expect(withAthletes(history, 'pushup', 'female')).toBe(true)
    expect(coverageOf(history).live.female).toBe(1)
  })
})
