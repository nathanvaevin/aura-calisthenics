import { beforeEach, describe, expect, it } from 'vitest'
import type { DemoAsset, WorkoutVideo } from '@/domain/media'
import { ME } from '../seed'
import { migrateStored, useStore } from '../store'
import { demoFromRow, demoToRow, settingsFromRow, workoutFromRow, workoutToRow } from './content'

const s = () => useStore.getState()
const ACCOUNT = '00000000-0000-4000-8000-000000000001'
const male = { exerciseId: 'pushup', kind: 'animation' as const, slot: 'male', animation: { character: 'male' as const, motion: 'pushup', camera: 'side' as const, theme: null } }
const status = (id: string) => s().demos.find((d) => d.id === id)?.status
const workout = { title: 'Beginner push', description: '', focus: 'push' as const, level: 'beginner' as const, minutes: 20, equipment: ['floor' as const], exerciseIds: ['pushup'], courseId: null, video: null, chapters: [], status: 'draft' as const }

beforeEach(() => {
  s().reset()
  s().startDemo()
})

describe('demonstrations in the store', () => {
  it('makes the sample athlete an admin, also in a sample world saved before', () => {
    expect(s().athletes[ME].roles).toContain('admin')
    const before = { ...s(), athletes: { ...s().athletes, [ME]: { ...s().athletes[ME], roles: ['athlete', 'coach'] } }, demos: undefined }
    const next = migrateStored(before, 3) as ReturnType<typeof s>
    expect(next.athletes[ME].roles).toEqual(['athlete', 'coach', 'admin'])
    expect(next.demos).toEqual([])
  })

  it('walks a generated animation through review, marking every change to be sent', () => {
    const a = s().createDemo(male)
    expect(s().demos[0]).toMatchObject({ id: a, status: 'pending', version: 1, createdBy: ME })
    s().moveDemo(a, 'published')
    expect(status(a)).toBe('pending')
    s().noteDemo(a, { tags: ['range of motion'], text: ' Chest lower. ' })
    s().moveDemo(a, 'needs_correction')
    const b = s().reviseDemo(a)!
    expect(s().demos.find((d) => d.id === b)).toMatchObject({ version: 2, status: 'pending', replaces: a })
    expect(s().demos.find((d) => d.id === b)!.notes[0]).toMatchObject({ text: 'Chest lower.', tags: ['range of motion'], by: ME })
    expect(s().reviseDemo('missing')).toBeNull()
    expect(s().contentDirty).toEqual([`demo:${a}`, `demo:${b}`])
  })

  it('archives the published version when its replacement is published, and sends both', () => {
    const a = s().createDemo(male)
    s().moveDemo(a, 'approved')
    s().moveDemo(a, 'published')
    const b = s().reviseDemo(a)!
    s().contentSent(s().contentDirty)
    s().moveDemo(b, 'approved')
    s().contentSent(s().contentDirty)
    s().moveDemo(b, 'published')
    expect([status(a), status(b)]).toEqual(['archived', 'published'])
    expect([...s().contentDirty].sort()).toEqual([`demo:${a}`, `demo:${b}`].sort())
  })

  it('removes drafts and archived versions only', () => {
    const a = s().createDemo(male)
    s().removeDemo(a)
    expect(s().demos).toHaveLength(1)
    s().moveDemo(a, 'archived')
    s().removeDemo(a)
    expect(s().demos).toHaveLength(0)
    expect(s().contentDirty).toEqual([`gone:demo:${a}`])
  })

  it('keeps workout videos and theme settings', () => {
    const id = s().saveWorkoutVideo(workout)
    expect(s().workoutVideos[0]).toMatchObject({ id, status: 'draft', publishedAt: null })
    s().saveWorkoutVideo({ ...workout, id, status: 'published', minutes: 25 })
    expect(s().workoutVideos).toHaveLength(1)
    expect(s().workoutVideos[0].minutes).toBe(25)
    expect(s().workoutVideos[0].publishedAt).not.toBeNull()
    s().setAuraSettings({ defaultTheme: 'solar', themes: { solar: { status: 'approved', intensity: 0.4 } } })
    expect(s().auraSettings).toMatchObject({ defaultTheme: 'solar', themes: { solar: { status: 'approved' } } })
    expect(s().contentDirty).toEqual([`workout:${id}`, 'settings'])
    s().removeWorkoutVideo(id)
    expect(s().contentDirty).toEqual(['settings', `gone:workout:${id}`])
  })
})

describe('taking in what the server holds', () => {
  const remote = (id: string, patch: Partial<DemoAsset> = {}): DemoAsset => ({
    id, exerciseId: 'squat', kind: 'animation', slot: 'female', version: 1, status: 'published', title: '', description: '',
    animation: { character: 'female', motion: 'squat', camera: 'front', theme: null }, notes: [], replaces: null,
    createdBy: null, createdAt: '2026-11-17T10:00:00.000Z', updatedAt: '2026-11-17T10:00:00.000Z', reviewedAt: null, publishedAt: '2026-11-17T10:00:00.000Z', ...patch,
  })

  it('adds to the sample world without dropping anything in it', () => {
    const mine = s().createDemo(male)
    s().contentSent(s().contentDirty)
    s().applyContent({ demos: [remote('r1')], workoutVideos: [], auraSettings: null })
    expect(s().demos.map((d) => d.id).sort()).toEqual([mine, 'r1'].sort())
    expect(s().auraSettings.defaultTheme).toBe('cosmic')
  })

  it('follows the server on an account, except for changes still waiting to go', () => {
    useStore.setState({ demo: false, cloudUid: ACCOUNT })
    s().applyContent({ demos: [remote('r1'), remote('r2'), remote('r3')], workoutVideos: [], auraSettings: { defaultTheme: 'solar', themes: {}, updatedAt: '2026-11-17T10:00:00.000Z' } })
    expect(s().auraSettings.defaultTheme).toBe('solar')
    s().moveDemo('r1', 'archived')
    s().moveDemo('r3', 'archived')
    s().removeDemo('r3')
    s().setAuraSettings({ defaultTheme: 'primal' })
    const waiting = s().createDemo(male)
    // The server still has the old state of r1 and r3, has lost r2, and has a row this device never saw.
    s().applyContent({ demos: [remote('r1'), remote('r3'), remote('r4')], workoutVideos: [], auraSettings: { defaultTheme: 'solar', themes: {}, updatedAt: '2026-11-17T10:00:00.000Z' } })
    expect(s().demos.map((d) => d.id).sort()).toEqual(['r1', 'r4', waiting].sort())
    expect(status('r1')).toBe('archived')
    expect(s().auraSettings.defaultTheme).toBe('primal')
    // Once sent, the server's word is taken again.
    s().contentSent(s().contentDirty)
    s().applyContent({ demos: [remote('r4')], workoutVideos: [], auraSettings: null })
    expect(s().demos.map((d) => d.id)).toEqual(['r4'])
    expect(s().auraSettings.defaultTheme).toBe('primal')
  })
})

describe('content as database rows', () => {
  it('carries a demonstration there and back', () => {
    const d: DemoAsset = {
      id: ACCOUNT, exerciseId: 'pushup', kind: 'animation', slot: 'male', version: 3, status: 'needs_correction', title: 'Push-up', description: 'Side view',
      animation: { character: 'male', motion: 'pushup', camera: 'side', theme: 'cosmic' },
      notes: [{ id: 'n', at: '2026-11-17T10:00:00.000Z', by: ACCOUNT, tags: ['body alignment'], text: 'Hips sag.' }], replaces: '00000000-0000-4000-8000-000000000002',
      createdBy: ACCOUNT, createdAt: '2026-11-17T09:00:00.000Z', updatedAt: '2026-11-17T10:00:00.000Z', reviewedAt: '2026-11-17T10:00:00.000Z', publishedAt: null,
    }
    expect(demoFromRow(demoToRow(d))).toEqual(d)
    const v: DemoAsset = { ...d, kind: 'video', slot: 'instructor:side', animation: undefined, video: { source: 'upload', url: 'https://x/y.mp4', path: 'u/y.mp4', seconds: 12 } }
    delete v.animation
    expect(demoFromRow(demoToRow(v))).toEqual(v)
    // Ids from a device-only world are not the database's: they are left out rather than refused.
    expect(demoToRow({ ...d, createdBy: 'me', replaces: 'abc123' })).toMatchObject({ created_by: null, replaces: null })
  })

  it('carries a workout video and the settings', () => {
    const w: WorkoutVideo = {
      id: ACCOUNT, ...workout, courseId: null, video: { source: 'link', url: 'https://x/w' }, chapters: [{ at: 0, label: 'Warm-up', kind: 'intro' }, { at: 120, label: 'Push-ups', kind: 'work', exerciseId: 'pushup' }],
      status: 'published', createdBy: ACCOUNT, createdAt: '2026-11-17T09:00:00.000Z', updatedAt: '2026-11-17T10:00:00.000Z', publishedAt: '2026-11-17T10:00:00.000Z',
    }
    expect(workoutFromRow(workoutToRow(w))).toEqual(w)
    expect(settingsFromRow(null)).toBeNull()
    expect(settingsFromRow({ key: 'aura', value: { defaultTheme: 'solar', themes: { solar: { status: 'approved' } } }, updated_at: '2026-11-17T10:00:00+00:00' }))
      .toEqual({ defaultTheme: 'solar', themes: { solar: { status: 'approved' } }, updatedAt: '2026-11-17T10:00:00+00:00' })
  })
})
