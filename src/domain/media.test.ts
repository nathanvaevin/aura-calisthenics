import { describe, expect, it } from 'vitest'
import {
  ASSET_STATUSES, addNote, canMove, historyOf, move, newAsset, nextVersion, publishedFor, reviewQueue, revise,
  type AnimationRecipe, type AssetStatus, type DemoAsset,
} from './media'

const T0 = '2026-11-17T10:00:00.000Z'
const T1 = '2026-11-17T11:00:00.000Z'
const recipe = (character: 'male' | 'female'): AnimationRecipe => ({ character, motion: 'pushup', camera: 'side', theme: null })
const animation = (assets: DemoAsset[], id: string, character: 'male' | 'female' = 'male', exerciseId = 'pushup') =>
  newAsset(assets, { exerciseId, kind: 'animation', slot: character, animation: recipe(character) }, id, T0, 'admin')
const video = (assets: DemoAsset[], id: string, slot = 'instructor') =>
  newAsset(assets, { exerciseId: 'pushup', kind: 'video', slot, video: { source: 'link', url: 'https://example.com/v.mp4' } }, id, T0, 'admin')
/** Walk an asset through a series of statuses. */
const walk = (assets: DemoAsset[], id: string, ...to: AssetStatus[]) => to.reduce((list, s) => move(list, id, s, T1), assets)
const statusOf = (assets: DemoAsset[], id: string) => assets.find((a) => a.id === id)!.status

describe('a new demonstration', () => {
  it('is pending review when generated, a draft when it is a video', () => {
    expect(animation([], 'a').status).toBe('pending')
    expect(video([], 'v').status).toBe('draft')
  })

  it('is numbered within its exercise, kind and slot', () => {
    const a = animation([], 'a')
    expect(a.version).toBe(1)
    expect(animation([a], 'b').version).toBe(2)
    expect(animation([a], 'c', 'female').version).toBe(1)
    expect(animation([a], 'd', 'male', 'squat').version).toBe(1)
    expect(video([a], 'v').version).toBe(1)
    expect(nextVersion([a, { ...a, id: 'x', version: 7 }], 'pushup', 'animation', 'male')).toBe(8)
  })
})

describe('moving between statuses', () => {
  const allowed: Record<AssetStatus, AssetStatus[]> = {
    draft: ['pending', 'archived'],
    pending: ['approved', 'needs_correction', 'archived'],
    needs_correction: ['pending', 'archived'],
    approved: ['published', 'needs_correction', 'archived'],
    published: ['approved', 'archived'],
    archived: ['draft'],
  }

  it('allows exactly the review workflow', () => {
    for (const from of ASSET_STATUSES) for (const to of ASSET_STATUSES) expect([from, to, canMove(from, to)]).toEqual([from, to, allowed[from].includes(to)])
  })

  it('refuses an illegal move by leaving the list as it was', () => {
    const list = [animation([], 'a')]
    expect(move(list, 'a', 'published', T1)).toBe(list)
    expect(move(list, 'a', 'draft', T1)).toBe(list)
    expect(move(list, 'missing', 'approved', T1)).toBe(list)
  })

  it('records when it was reviewed and when it was published', () => {
    let list = [animation([], 'a')]
    list = move(list, 'a', 'approved', T1)
    expect(list[0]).toMatchObject({ status: 'approved', reviewedAt: T1, publishedAt: null, updatedAt: T1 })
    list = move(list, 'a', 'published', '2026-11-17T12:00:00.000Z')
    expect(list[0]).toMatchObject({ status: 'published', reviewedAt: T1, publishedAt: '2026-11-17T12:00:00.000Z' })
    expect(move([animation([], 'b')], 'b', 'needs_correction', T1)[0].reviewedAt).toBe(T1)
  })

  it('never has two published versions in one slot', () => {
    let list = [animation([], 'a')]
    list = walk(list, 'a', 'approved', 'published')
    list = [...list, animation(list, 'b')]
    list = [...list, animation(list, 'f', 'female')]
    list = walk(list, 'f', 'approved', 'published')
    list = walk(list, 'b', 'approved', 'published')
    expect(statusOf(list, 'a')).toBe('archived')
    expect(statusOf(list, 'b')).toBe('published')
    // The other character's slot is its own.
    expect(statusOf(list, 'f')).toBe('published')
    expect(list.filter((a) => a.status === 'published' && a.slot === 'male')).toHaveLength(1)
  })

  it('can take a published version back without archiving it', () => {
    const list = walk([animation([], 'a')], 'a', 'approved', 'published', 'approved')
    expect(statusOf(list, 'a')).toBe('approved')
  })
})

describe('corrections', () => {
  const note = { id: 'n1', at: T1, by: 'admin', tags: ['range of motion'], text: 'Chest should reach fist height.' }

  it('keeps notes on the asset', () => {
    const list = addNote([animation([], 'a')], 'a', note)
    expect(list[0].notes).toEqual([note])
    expect(list[0].updatedAt).toBe(T1)
  })

  it('makes a new pending version that carries the notes and leaves the original alone', () => {
    let list = addNote([animation([], 'a')], 'a', note)
    list = move(list, 'a', 'needs_correction', T1)
    const before = list[0]
    list = revise(list, 'a', 'b', '2026-11-18T09:00:00.000Z', 'admin')
    expect(list[0]).toBe(before)
    expect(list[1]).toMatchObject({ id: 'b', version: 2, status: 'pending', replaces: 'a', notes: [note], animation: recipe('male'), reviewedAt: null, publishedAt: null, createdAt: '2026-11-18T09:00:00.000Z' })
    expect(revise(list, 'missing', 'c', T1, null)).toBe(list)
  })

  it('lists a slot newest first', () => {
    let list = [animation([], 'a')]
    list = revise(list, 'a', 'b', T1, null)
    list = [...list, animation(list, 'f', 'female')]
    expect(historyOf(list, 'pushup', 'animation', 'male').map((a) => a.id)).toEqual(['b', 'a'])
  })
})

describe('what athletes see', () => {
  it('is only what has been published', () => {
    let list = [animation([], 'm')]
    list = [...list, animation(list, 'f', 'female')]
    list = [...list, video(list, 'v'), video(list, 'side', 'instructor:side')]
    list = [...list, animation(list, 'other', 'male', 'squat')]
    list = walk(list, 'other', 'approved', 'published')
    expect(publishedFor(list, 'pushup')).toEqual({ animations: {}, videos: [] })

    list = walk(list, 'm', 'approved', 'published')
    list = walk(list, 'f', 'approved')
    list = walk(list, 'v', 'pending', 'approved', 'published')
    list = walk(list, 'side', 'pending')
    const seen = publishedFor(list, 'pushup')
    expect(Object.keys(seen.animations)).toEqual(['male'])
    expect(seen.animations.male!.id).toBe('m')
    expect(seen.videos.map((a) => a.id)).toEqual(['v'])
  })

  it('counts the review queue by status', () => {
    let list = [animation([], 'a')]
    list = [...list, animation(list, 'b', 'female'), video(list, 'v')]
    list = move(list, 'a', 'approved', T1)
    expect(reviewQueue(list)).toEqual({ draft: 1, pending: 1, approved: 1, published: 0, needs_correction: 0, archived: 0 })
  })
})
