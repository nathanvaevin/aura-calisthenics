import { create } from 'zustand'
import { DEFAULT_AURA_SETTINGS, type AuraSettings, type DemoAsset, type WorkoutVideo } from '@/domain/media'
import { supabase } from '../supabase'
import { useStore } from '../store'
import { isUuid, type Row } from './rows'

/**
 * Admin-managed content: demonstrations, workout videos, Aura theme settings.
 *
 * It belongs to everyone rather than to one account, so it does not go
 * through the sync engine. Anyone reads what is published, signed in or not;
 * only an admin's device sends. If the tables are not on the server yet, or
 * the server cannot be reached, the app carries on with what the device has.
 */

interface ContentState {
  /** idle: not asked yet · offline: the server could not be reached · unavailable: the tables are not on the server (migration 0009 not run) */
  status: 'idle' | 'ok' | 'offline' | 'unavailable'
  /** Why the last attempt to send was refused, in the server's words. */
  error: string | null
  sending: boolean
}

export const useContent = create<ContentState>(() => ({ status: 'idle', error: null, sending: false }))

interface Failure { message: string; code?: string }
const missing = (e: Failure) => e.code === '42P01' || e.code === 'PGRST205' || /does not exist|schema cache/i.test(e.message)

// ── Rows ↔ content ───────────────────────────────────────────────────────

const text = (v: unknown) => (typeof v === 'string' ? v : '')
const orNull = (v: unknown) => (typeof v === 'string' && v ? v : null)
const list = <T>(v: unknown) => (Array.isArray(v) ? (v as T[]) : [])

export function demoToRow(d: DemoAsset): Row {
  return {
    id: d.id, exercise_id: d.exerciseId, kind: d.kind, slot: d.slot, version: d.version, status: d.status, title: d.title, description: d.description,
    recipe: (d.kind === 'animation' ? d.animation : d.video) ?? {}, notes: d.notes, replaces: isUuid(d.replaces) ? d.replaces : null,
    created_by: isUuid(d.createdBy) ? d.createdBy : null, created_at: d.createdAt, updated_at: d.updatedAt, reviewed_at: d.reviewedAt, published_at: d.publishedAt,
  }
}

export function demoFromRow(r: Row): DemoAsset {
  const kind = r.kind === 'video' ? 'video' : 'animation'
  const recipe = r.recipe && typeof r.recipe === 'object' && Object.keys(r.recipe).length ? r.recipe : undefined
  return {
    id: String(r.id), exerciseId: String(r.exercise_id), kind, slot: text(r.slot), version: Number(r.version) || 1, status: r.status as DemoAsset['status'],
    title: text(r.title), description: text(r.description),
    ...(recipe ? (kind === 'animation' ? { animation: recipe as DemoAsset['animation'] } : { video: recipe as DemoAsset['video'] }) : {}),
    notes: list(r.notes), replaces: orNull(r.replaces), createdBy: orNull(r.created_by),
    createdAt: text(r.created_at), updatedAt: text(r.updated_at), reviewedAt: orNull(r.reviewed_at), publishedAt: orNull(r.published_at),
  }
}

export function workoutToRow(w: WorkoutVideo): Row {
  return {
    id: w.id, title: w.title, description: w.description, focus: w.focus, level: w.level, minutes: w.minutes, equipment: w.equipment, exercise_ids: w.exerciseIds,
    course_id: isUuid(w.courseId) ? w.courseId : null, video: w.video, chapters: w.chapters, status: w.status,
    created_by: isUuid(w.createdBy) ? w.createdBy : null, created_at: w.createdAt, updated_at: w.updatedAt, published_at: w.publishedAt,
  }
}

export function workoutFromRow(r: Row): WorkoutVideo {
  return {
    id: String(r.id), title: text(r.title), description: text(r.description), focus: (r.focus as WorkoutVideo['focus']) ?? 'full', level: (r.level as WorkoutVideo['level']) ?? 'all',
    minutes: Number(r.minutes) || 0, equipment: list(r.equipment), exerciseIds: list(r.exercise_ids), courseId: orNull(r.course_id),
    video: (r.video as WorkoutVideo['video']) ?? null, chapters: list(r.chapters), status: r.status as WorkoutVideo['status'],
    createdBy: orNull(r.created_by), createdAt: text(r.created_at), updatedAt: text(r.updated_at), publishedAt: orNull(r.published_at),
  }
}

export function settingsFromRow(r: Row | null): AuraSettings | null {
  const v = r?.value as Partial<AuraSettings> | undefined
  if (!r || !v || typeof v !== 'object') return null
  return { defaultTheme: text(v.defaultTheme) || DEFAULT_AURA_SETTINGS.defaultTheme, themes: v.themes && typeof v.themes === 'object' ? v.themes : {}, updatedAt: orNull(r.updated_at) }
}

// ── Fetching ─────────────────────────────────────────────────────────────

const PAGE = 1000

async function every(table: string): Promise<Row[]> {
  const out: Row[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase!.from(table).select('*').order('created_at').order('id').range(from, from + PAGE - 1)
    if (error) throw error
    out.push(...((data as Row[] | null) ?? []))
    if (!data || data.length < PAGE) return out
  }
}

/** Fetch what this visitor may see: everything for an admin, the published part for anyone else. Never throws. */
export async function pullContent(): Promise<void> {
  if (!supabase) return
  const account = useStore.getState().cloudUid
  try {
    // The device says it belongs to an account the browser is not signed in to (yet): what an outsider sees would wrongly replace it.
    if (account && (await supabase.auth.getSession()).data.session?.user.id !== account) return
    const [demos, workouts, settings] = await Promise.all([
      every('demo_assets'),
      every('workout_videos'),
      supabase.from('app_settings').select('*').eq('key', 'aura').maybeSingle().then(({ data, error }) => {
        if (error) throw error
        return data as Row | null
      }),
    ])
    if (useStore.getState().cloudUid !== account) return
    useStore.getState().applyContent({ demos: demos.map(demoFromRow), workoutVideos: workouts.map(workoutFromRow), auraSettings: settingsFromRow(settings) })
    useContent.setState({ status: 'ok' })
  } catch (e) {
    useContent.setState({ status: missing(e as Failure) ? 'unavailable' : 'offline' })
  }
}

// ── Sending ──────────────────────────────────────────────────────────────

const isAdmin = (s: ReturnType<typeof useStore.getState>) => !!s.cloudUid && !s.demo && !!s.athletes[s.cloudUid]?.roles.includes('admin')

let sending: Promise<void> | null = null

/** Send an admin's changes. A refusal leaves them waiting and says why in `useContent`. Never throws. */
export function flushContent(): Promise<void> {
  sending = (sending ?? Promise.resolve()).then(send)
  return sending
}

async function send(): Promise<void> {
  const s = useStore.getState()
  if (!supabase || !isAdmin(s) || s.contentDirty.length === 0) return
  const dirty = new Set(s.contentDirty)
  // Unpublished rows first: the server allows one published version per slot, so the old one must step aside before the new one arrives.
  const demos = s.demos.filter((d) => dirty.has(`demo:${d.id}`) && isUuid(d.id)).sort((a, b) => Number(a.status === 'published') - Number(b.status === 'published') || a.version - b.version)
  const workouts = s.workoutVideos.filter((w) => dirty.has(`workout:${w.id}`) && isUuid(w.id))
  const gone = (prefix: string) => s.contentDirty.filter((k) => k.startsWith(`gone:${prefix}:`)).map((k) => k.slice(prefix.length + 6)).filter(isUuid)
  const settings = dirty.has('settings') ? s.auraSettings : null

  useContent.setState({ sending: true })
  const done: string[] = []
  try {
    const must = async (q: PromiseLike<{ error: Failure | null }>) => {
      const { error } = await q
      if (error) throw error
    }
    if (demos.length) await must(supabase.from('demo_assets').upsert(demos.map(demoToRow), { onConflict: 'id' }))
    if (workouts.length) await must(supabase.from('workout_videos').upsert(workouts.map(workoutToRow), { onConflict: 'id' }))
    if (settings) {
      await must(supabase.from('app_settings').upsert({ key: 'aura', value: { defaultTheme: settings.defaultTheme, themes: settings.themes }, updated_by: s.cloudUid, updated_at: settings.updatedAt ?? new Date().toISOString() }, { onConflict: 'key' }))
    }
    for (const [prefix, table] of [['demo', 'demo_assets'], ['workout', 'workout_videos']] as const) {
      const ids = gone(prefix)
      if (ids.length) await must(supabase.from(table).delete().in('id', ids))
    }
    // Only what is still as it was sent counts as sent: anything changed meanwhile goes again.
    const now = useStore.getState()
    for (const key of s.contentDirty) {
      if (key.startsWith('gone:')) done.push(key)
      else if (key === 'settings') { if (now.auraSettings === settings) done.push(key) }
      else if (key.startsWith('demo:')) { if (now.demos.find((d) => `demo:${d.id}` === key) === s.demos.find((d) => `demo:${d.id}` === key)) done.push(key) }
      else if (now.workoutVideos.find((w) => `workout:${w.id}` === key) === s.workoutVideos.find((w) => `workout:${w.id}` === key)) done.push(key)
    }
    useContent.setState({ sending: false, error: null, status: 'ok' })
  } catch (e) {
    const failure = e as Failure
    useContent.setState({ sending: false, error: failure.message || 'Could not be saved.', ...(missing(failure) ? { status: 'unavailable' as const } : {}) })
  }
  if (done.length) useStore.getState().contentSent(done)
}

// ── Keeping in step ──────────────────────────────────────────────────────

let started = false

/** Called once at startup: fetch now, fetch again when the device changes hands, send an admin's changes as they are made. */
export function startContent() {
  if (!supabase || started) return
  started = true
  let last = useStore.getState()
  let debounce: ReturnType<typeof setTimeout> | null = null
  let pulled = Date.now()
  const pull = () => { pulled = Date.now(); void pullContent().then(flushContent) }
  const soon = () => {
    if (debounce) clearTimeout(debounce)
    debounce = setTimeout(() => void flushContent(), 800)
  }

  useStore.subscribe((s) => {
    const before = last
    last = s
    // Signing in or out, or opening the sample world, empties the device.
    if (s.cloudUid !== before.cloudUid || s.demo !== before.demo) return pull()
    if (s.contentDirty.length === 0) return
    // A new change to send, or this account has just turned out to be an admin. Anything else would only repeat a refusal.
    if (s.contentDirty.some((k) => !before.contentDirty.includes(k)) || isAdmin(s) !== isAdmin(before)) soon()
  })
  window.addEventListener('online', pull)
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && Date.now() - pulled > 5 * 60000) pull() })
  pull()
}
