import type { DisciplineId, EquipmentId } from './types'

/**
 * Demonstrations of an exercise, and how they get from generated to public.
 *
 * A demonstration is either an animation (a recipe the app renders live: which
 * character, which motion, which camera) or a recorded video. Each is a
 * version in a slot of one exercise; nothing reaches athletes until an admin
 * has published it, and at most one version per slot is published at a time.
 *
 * Motion and theme ids are plain strings here: the visual module owns those lists.
 */

export type AssetStatus = 'draft' | 'pending' | 'approved' | 'published' | 'needs_correction' | 'archived'
export type AssetKind = 'animation' | 'video'
export type CharacterId = 'male' | 'female'
export type CameraAngle = 'front' | 'side' | 'three-quarter' | 'back'

export interface CorrectionNote { id: string; at: string; by: string | null; tags: string[]; text: string }
export interface AnimationRecipe {
  character: CharacterId
  motion: string
  /** Which revision of the movement this version shows. Approval is of that revision only. */
  revision?: number
  camera: CameraAngle
  theme: string | null
}
export interface VideoSource { source: 'upload' | 'link'; url: string; path?: string; seconds?: number; angle?: string }

export interface DemoAsset {
  id: string
  exerciseId: string
  kind: AssetKind
  /** What this is within the exercise: 'male' | 'female' for animations; 'instructor' or 'instructor:<label>' for videos (a variation or camera angle). */
  slot: string
  version: number
  status: AssetStatus
  title: string
  description: string
  animation?: AnimationRecipe
  video?: VideoSource
  notes: CorrectionNote[]
  /** The version this one was made to correct. */
  replaces: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
  reviewedAt: string | null
  publishedAt: string | null
}

export interface WorkoutChapter { at: number; label: string; kind: 'intro' | 'work' | 'rest'; exerciseId?: string }

/** A complete follow-along workout, filmed and edited outside Aura. */
export interface WorkoutVideo {
  id: string
  title: string
  description: string
  focus: DisciplineId | 'full'
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  minutes: number
  equipment: EquipmentId[]
  exerciseIds: string[]
  courseId: string | null
  video: VideoSource | null
  chapters: WorkoutChapter[]
  status: 'draft' | 'published' | 'archived'
  createdBy: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface ThemeSetting { status: 'experimental' | 'approved'; intensity?: number; pulse?: number; density?: number; off?: string[] }

export interface AuraSettings {
  defaultTheme: string
  /** Per theme: whether it is approved for athletes, and the admin's adjustments to it. */
  themes: Record<string, ThemeSetting>
  /**
   * The visual universes beyond the original that athletes may choose
   * (src/theme/themes.ts). Each is released by an administrator once its
   * characters and forms have been looked at; until then only they can open it.
   */
  universes: Partial<Record<'power' | 'iron', boolean>>
  updatedAt: string | null
}

export const DEFAULT_AURA_SETTINGS: AuraSettings = { defaultTheme: 'cosmic', themes: {}, universes: {}, updatedAt: null }

export const ASSET_STATUSES: AssetStatus[] = ['draft', 'pending', 'approved', 'published', 'needs_correction', 'archived']

export const STATUS_LABEL: Record<AssetStatus, string> = {
  draft: 'Draft',
  pending: 'Pending review',
  approved: 'Approved, hidden',
  published: 'Official',
  needs_correction: 'Needs correction',
  archived: 'Archived',
}

export const CORRECTION_TAGS = [
  'hand positioning', 'range of motion', 'body alignment', 'muscle activation',
  'character appearance', 'exercise execution', 'visual quality', 'other',
] as const

const MOVES: Record<AssetStatus, AssetStatus[]> = {
  draft: ['pending', 'archived'],
  pending: ['approved', 'needs_correction', 'archived'],
  needs_correction: ['pending', 'archived'],
  approved: ['published', 'needs_correction', 'archived'],
  published: ['approved', 'archived'],
  archived: ['draft'],
}

export const canMove = (from: AssetStatus, to: AssetStatus) => MOVES[from].includes(to)

const sameSlot = (a: DemoAsset, exerciseId: string, kind: AssetKind, slot: string) => a.exerciseId === exerciseId && a.kind === kind && a.slot === slot

export const nextVersion = (assets: DemoAsset[], exerciseId: string, kind: AssetKind, slot: string) =>
  assets.reduce((top, a) => (sameSlot(a, exerciseId, kind, slot) ? Math.max(top, a.version) : top), 0) + 1

export type NewDemo = Pick<DemoAsset, 'exerciseId' | 'kind' | 'slot'> & Partial<Pick<DemoAsset, 'title' | 'description' | 'animation' | 'video'>>

/** A generated animation goes straight to review; a video starts as a draft while it is being described. */
export function newAsset(assets: DemoAsset[], input: NewDemo, id: string, now: string, by: string | null): DemoAsset {
  return {
    id, exerciseId: input.exerciseId, kind: input.kind, slot: input.slot,
    version: nextVersion(assets, input.exerciseId, input.kind, input.slot),
    status: input.kind === 'animation' ? 'pending' : 'draft',
    title: input.title ?? '', description: input.description ?? '',
    ...(input.animation ? { animation: input.animation } : {}), ...(input.video ? { video: input.video } : {}),
    notes: [], replaces: null, createdBy: by, createdAt: now, updatedAt: now, reviewedAt: null, publishedAt: null,
  }
}

/** Change an asset's status. An illegal move returns the same list. */
export function move(assets: DemoAsset[], id: string, to: AssetStatus, now: string): DemoAsset[] {
  const target = assets.find((a) => a.id === id)
  if (!target || !canMove(target.status, to)) return assets
  return assets.map((a) => {
    if (a.id === id) {
      return {
        ...a, status: to, updatedAt: now,
        reviewedAt: to === 'approved' || to === 'needs_correction' ? now : a.reviewedAt,
        publishedAt: to === 'published' ? now : a.publishedAt,
      }
    }
    // One published version per slot: the one it replaces steps aside.
    if (to === 'published' && a.status === 'published' && sameSlot(a, target.exerciseId, target.kind, target.slot)) return { ...a, status: 'archived' as const, updatedAt: now }
    return a
  })
}

const TO_OFFICIAL: Partial<Record<AssetStatus, AssetStatus[]>> = {
  pending: ['approved', 'published'],
  approved: ['published'],
  draft: ['pending', 'approved', 'published'],
  archived: ['draft', 'pending', 'approved', 'published'],
}

/** Whether one decision can make this version the official one. A version sent back for correction cannot: it needs a new version. */
export const canBeOfficial = (status: AssetStatus) => status in TO_OFFICIAL

/**
 * Approval in one step: the version becomes the official demonstration of
 * its exercise, and the version it replaces steps aside (it stays in the
 * history, and can be made official again the same way).
 */
export function makeOfficial(assets: DemoAsset[], id: string, now: string): DemoAsset[] {
  const target = assets.find((a) => a.id === id)
  let out = assets
  for (const to of (target && TO_OFFICIAL[target.status]) ?? []) out = move(out, id, to, now)
  return out
}

export const addNote = (assets: DemoAsset[], id: string, note: CorrectionNote): DemoAsset[] =>
  assets.map((a) => (a.id === id ? { ...a, notes: [...a.notes, note], updatedAt: note.at } : a))

/**
 * A new version to correct an existing one. It carries the notes written on
 * the original, so whoever regenerates it sees what was asked; the original
 * stays as it is, for comparison.
 */
export function revise(assets: DemoAsset[], id: string, newId: string, now: string, by: string | null): DemoAsset[] {
  const from = assets.find((a) => a.id === id)
  if (!from) return assets
  const next: DemoAsset = {
    ...from, id: newId, version: nextVersion(assets, from.exerciseId, from.kind, from.slot), status: 'pending',
    notes: [...from.notes], replaces: from.id, createdBy: by, createdAt: now, updatedAt: now, reviewedAt: null, publishedAt: null,
  }
  return [...assets, next]
}

/** Every version in a slot, newest first. */
export const historyOf = (assets: DemoAsset[], exerciseId: string, kind: AssetKind, slot: string) =>
  assets.filter((a) => sameSlot(a, exerciseId, kind, slot)).sort((a, b) => b.version - a.version)

/** What an athlete may see for an exercise. */
export function publishedFor(assets: DemoAsset[], exerciseId: string): { animations: Partial<Record<CharacterId, DemoAsset>>; videos: DemoAsset[] } {
  const animations: Partial<Record<CharacterId, DemoAsset>> = {}
  const videos: DemoAsset[] = []
  for (const a of assets) {
    if (a.exerciseId !== exerciseId || a.status !== 'published') continue
    if (a.kind === 'animation' && a.animation) animations[a.animation.character] = a
    else if (a.kind === 'video' && a.video) videos.push(a)
  }
  return { animations, videos: videos.sort((a, b) => a.slot.localeCompare(b.slot)) }
}

/** How many assets are in each status. */
export function reviewQueue(assets: DemoAsset[]): Record<AssetStatus, number> {
  const out = Object.fromEntries(ASSET_STATUSES.map((s) => [s, 0])) as Record<AssetStatus, number>
  for (const a of assets) out[a.status]++
  return out
}
