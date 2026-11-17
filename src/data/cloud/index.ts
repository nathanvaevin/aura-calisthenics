import { useEffect } from 'react'
import { create } from 'zustand'
import type { RealtimeChannel, Session } from '@supabase/supabase-js'
import type { Athlete, DisciplineId } from '@/domain/types'
import { AUTH_STORAGE_KEY, authReturn, redirectTo, supabase } from '../supabase'
import { uid as newId } from '../courseTemplates'
import { emptyWorld, useStore } from '../store'
import { flushContent, pullContent, startContent, useContent } from './content'
import { createEngine, type Engine, type EngineStatus, type Scope } from './engine'
import { SYNCED_KEYS, adopt, type Synced } from './mappers'
import { supabaseRemote } from './remote'

/**
 * Accounts and syncing, as the rest of the app sees them.
 *
 * The app keeps reading and writing the store exactly as it does without an
 * account. While someone is signed in, an engine keeps that store and the
 * database in step (see engine.ts). Signing out empties the device.
 */

export interface CloudUser {
  id: string
  email: string | null
  name: string | null
  /** A test-day guest: a real account with no way back into it from another device until it is kept. */
  guest: boolean
}

interface CloudState {
  configured: boolean
  /** loading: asking the browser for a saved session */
  auth: 'loading' | 'out' | 'in'
  user: CloudUser | null
  sync: EngineStatus
  /** A problem signing in or keeping an account, in words for the person it happened to. */
  notice: string | null
  /** Where to go next, set when a join that started before signing in has completed. */
  goto: string | null
  /** A join that started before signing in is being completed. */
  joining: boolean
  /** The Google account a guest tried to attach already has a profile: their results can be moved to it instead. */
  canMove: boolean
}

const IDLE: EngineStatus = { phase: 'idle', loaded: false, pending: 0, refused: 0 }
const USER_KEY = 'aura:cloud-user'
const JOIN_KEY = 'aura:pending-join'
const BACKUP_KEY = 'aura:before-sign-in'
const CLAIM_KEY = 'aura:hand-over'

export const useCloud = create<CloudState>(() => ({ configured: supabase !== null, auth: supabase ? 'loading' : 'out', user: null, sync: IDLE, notice: null, goto: null, joining: false, canMove: false }))

const read = <T>(key: string): T | null => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') as T | null
  } catch {
    return null
  }
}
const write = (key: string, value: unknown) => {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: the session still works, it just will not survive a reload.
  }
}

const NOTICES: Record<string, string> = {
  identity_already_exists: 'That Google account already has an Aura profile, so it cannot be attached to this guest profile. Your results are still here on this phone.',
  manual_linking_disabled: 'Keeping a guest profile with Google is not switched on for this project yet.',
  access_denied: 'Sign-in was cancelled.',
  anonymous_provider_disabled: 'Joining as a guest is switched off for this project.',
  over_request_rate_limit: 'Too many people signed in from this network in a short time. Wait a minute and try again.',
}
const explain = (code: string | undefined, fallback: string) => NOTICES[code ?? ''] ?? fallback

// ── The running engine ───────────────────────────────────────────────────

let engine: Engine | null = null
let engineUid: string | null = null
let stopListening: (() => void) | null = null
let entering = 0
/** Resolves once the running engine has merged this account's data for the first time. */
let loaded: Promise<void> = Promise.resolve()

const pick = (s: Synced): Synced => Object.fromEntries(SYNCED_KEYS.map((k) => [k, s[k]])) as unknown as Synced

const toUser = (session: Session): CloudUser => {
  const meta = session.user.user_metadata as { full_name?: string; name?: string }
  return { id: session.user.id, email: session.user.email ?? null, name: meta.full_name ?? meta.name ?? null, guest: !!session.user.is_anonymous }
}

const starter = (user: CloudUser): Athlete => ({
  id: user.id, name: user.name ?? 'Athlete', handle: '', bio: '', roles: ['athlete'], goals: [], joinedAt: new Date().toISOString(), weeklyTarget: 3, equipment: ['floor', 'wall', 'bar', 'box'],
})

function stopEngine() {
  engine?.stop()
  stopListening?.()
  engine = null
  engineUid = null
  stopListening = null
}

/** Empty the device of an account's data. Settings are the device's own and stay. */
function emptyDevice(patch: Partial<ReturnType<typeof useStore.getState>> = {}) {
  useStore.setState({ ...emptyWorld(), settings: useStore.getState().settings, ...patch })
}

async function enter(session: Session) {
  const client = supabase!
  const user = toUser(session)
  write(USER_KEY, user)
  useCloud.setState({ auth: 'in', user })
  if (engineUid === user.id) return
  const turn = ++entering
  stopEngine()

  const s = useStore.getState()
  if (s.cloudUid !== user.id) {
    // Whatever is on this device belongs to nobody, to the demo, or to another account.
    const own = !s.cloudUid && !s.demo && s.meId && s.athletes[s.meId] ? s.meId : null
    let fresh = false
    if (own) {
      const { data } = await client.from('profiles').select('handle').eq('id', user.id).maybeSingle()
      if (turn !== entering) return
      fresh = !data?.handle
    }
    if (own && fresh) {
      // A new account, and this device already holds someone's own training: it becomes the account's.
      emptyDevice({
        ...adopt(pick(s), own, user.id, newId), meId: user.id, cloudUid: user.id, places: s.places, mapView: s.mapView,
        visits: s.visits.filter((v) => v.athleteId === own).map((v) => ({ ...v, athleteId: user.id })),
      })
    } else {
      // Kept aside rather than destroyed, in case it mattered. Nothing reads it back yet.
      if (own) write(BACKUP_KEY, { at: new Date().toISOString(), ...pick(s) })
      emptyDevice({ cloudUid: user.id })
    }
  }

  let announce: () => void = () => {}
  let first = true
  loaded = new Promise((resolve) => { announce = resolve })
  const running = createEngine(
    supabaseRemote(client), user.id,
    { get: () => useStore.getState(), set: (patch) => { if (useStore.getState().cloudUid === user.id) useStore.setState(patch) } },
    (sync) => {
      if (engineUid !== user.id) return
      useCloud.setState({ sync })
      if (!sync.loaded || !first) return
      first = false
      // Deferred: this runs in the middle of the engine's own merge.
      setTimeout(() => {
        if (engineUid !== user.id) return
        const now = useStore.getState()
        // The database makes a profile for every account; if it has not arrived, make one here and it will be sent.
        if (!now.athletes[user.id]) useStore.setState({ athletes: { ...now.athletes, [user.id]: starter(user) } })
        if (useStore.getState().meId !== user.id) useStore.setState({ meId: user.id })
        announce()
        void resumeMove().then(resumeJoin)
      }, 0)
    },
  )
  engine = running
  engineUid = user.id
  stopListening = listen(running)
  running.request('all')
}

/** Resolves when this account's data has been fetched and the app can show it. Throws when the server cannot be reached. */
export async function ready(): Promise<void> {
  const running = engine
  if (!running) throw new Error('Not signed in')
  if (!running.status().loaded) await running.settled()
  await loaded
  if (engine !== running) throw new Error('Signed out')
}

/** Send what has changed now, and wait until the server has it. Throws when it cannot be reached. */
export async function flush(scope?: Scope): Promise<void> {
  if (!engine) return
  engine.request(scope)
  await engine.settled()
}

function leave() {
  const was = engineUid ?? useStore.getState().cloudUid
  stopEngine()
  write(USER_KEY, null)
  if (was) emptyDevice()
  useCloud.setState({ auth: 'out', user: null, sync: IDLE, joining: false })
}

function listen(running: Engine) {
  const client = supabase!
  let last = useStore.getState()
  let debounce: ReturnType<typeof setTimeout> | null = null
  const unsubscribe = useStore.subscribe((s) => {
    const before = last
    last = s
    if (!SYNCED_KEYS.some((k) => s[k] !== before[k])) return
    if (debounce) clearTimeout(debounce)
    debounce = setTimeout(() => running.request(), 350)
  })

  // The database says when something changed; what changed is then fetched the ordinary way.
  let poked: Scope | null = null
  let poke: ReturnType<typeof setTimeout> | null = null
  const changed = (scope: Scope) => () => {
    poked = poked === 'all' || scope === 'all' ? 'all' : 'assess'
    if (poke) return
    poke = setTimeout(() => {
      poke = null
      const scope = poked
      poked = null
      if (scope) running.request(scope)
    }, 400)
  }
  let channel: RealtimeChannel | null = client.channel('aura-sync')
  for (const table of ['assessment_sessions', 'assessment_participants', 'assessment_results']) channel.on('postgres_changes', { event: '*', schema: 'public', table }, changed('assess'))
  for (const table of ['evidence', 'course_enrollments', 'feedback']) channel.on('postgres_changes', { event: '*', schema: 'public', table }, changed('all'))
  channel.subscribe()

  const wake = () => { if (document.visibilityState === 'visible') running.request('all') }
  const online = () => running.request('all')
  document.addEventListener('visibilitychange', wake)
  window.addEventListener('online', online)
  const every = setInterval(wake, 60000)

  return () => {
    unsubscribe()
    if (debounce) clearTimeout(debounce)
    if (poke) clearTimeout(poke)
    clearInterval(every)
    document.removeEventListener('visibilitychange', wake)
    window.removeEventListener('online', online)
    if (channel) void client.removeChannel(channel)
    channel = null
  }
}

/** Keep fetching while a screen that shows other people's work is open: the fallback under live updates. */
export function useLive(scope: Scope, everyMs: number) {
  const signedIn = useCloud((s) => s.auth === 'in')
  useEffect(() => {
    if (!signedIn) return
    const tick = () => { if (document.visibilityState === 'visible') engine?.request(scope) }
    tick()
    const id = setInterval(tick, everyMs)
    return () => clearInterval(id)
  }, [signedIn, scope, everyMs])
}

/** Is this row on the server yet? For things that only work once it is, like an invitation code. */
export const useOnServer = (table: string, key: string | undefined) => useStore((s) => !!key && !!s.cloudShadow[`${table}/${key}`])

// ── Signing in and out ───────────────────────────────────────────────────

let started = false

/** Called once at startup. Does nothing when no project is configured. */
export function startCloud() {
  if (!supabase || started) return
  started = true
  useCloud.setState({ joining: read(JOIN_KEY) !== null })
  if (authReturn) useCloud.setState({ notice: explain(authReturn.code, authReturn.description.replace(/\+/g, ' ') || 'Sign-in did not complete.'), canMove: authReturn.code === 'identity_already_exists' })
  // Demonstrations and themes are everyone's: fetched whoever is or is not signed in.
  startContent()

  supabase.auth.onAuthStateChange((event, session) => {
    // The client must not be called from inside its own callback.
    setTimeout(() => {
      if (session) return void enter(session)
      if (event === 'SIGNED_OUT') return leave()
      if (event !== 'INITIAL_SESSION') return
      // No session at startup. If one is stored it could not be refreshed (offline): keep working from the device.
      const cached = read<CloudUser>(USER_KEY)
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored && cached && useStore.getState().cloudUid === cached.id) useCloud.setState({ auth: 'in', user: cached })
      else leave()
    }, 0)
  })
}

const fail = (error: { message: string; code?: string } | null) => {
  if (error) useCloud.setState({ notice: explain(error.code, error.message) })
  return !error
}

export async function signInWithGoogle() {
  if (!supabase) return
  useCloud.setState({ notice: null })
  fail((await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } })).error)
}

/** A guest account for a test day: real, private, and kept only if the athlete chooses to. */
export async function continueAsGuest(): Promise<boolean> {
  if (!supabase) return false
  useCloud.setState({ notice: null })
  const { data, error } = await supabase.auth.signInAnonymously()
  if (!fail(error) || !data.session) return false
  await enter(data.session)
  return true
}

/** Attach a Google sign-in to the guest account in use, so the same profile can be opened anywhere. */
export async function keepWithGoogle() {
  if (!supabase) return
  useCloud.setState({ notice: null })
  fail((await supabase.auth.linkIdentity({ provider: 'google', options: { redirectTo: redirectTo() } })).error)
}

export async function signOut() {
  if (!supabase) return
  write(JOIN_KEY, null)
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  // Signing out on this device must always work, even when the server cannot be told.
  if (error) leave()
}

/**
 * For a guest whose Google account already has an Aura profile: sign in to
 * that account and bring this guest profile's results along. The server hands
 * the guest a one-time code; the account redeems it.
 */
export async function moveToMyAccount() {
  if (!supabase) return
  useCloud.setState({ notice: null })
  try {
    await flush()
  } catch {
    return void useCloud.setState({ notice: 'Your results have not all reached the server yet. Check your connection and try again.' })
  }
  const { data, error } = await supabase.rpc('start_claim')
  if (!fail(error)) return
  write(CLAIM_KEY, { code: data, at: Date.now() })
  fail((await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } })).error)
}

async function resumeMove() {
  const pending = read<{ code: string; at: number }>(CLAIM_KEY)
  if (!pending || !supabase) return
  // Still the guest: the trip to Google has not happened, or was cancelled. Keep the code for when it does.
  if (useCloud.getState().user?.guest) return
  write(CLAIM_KEY, null)
  if (Date.now() - pending.at > 50 * 60000) return
  const { error } = await supabase.rpc('finish_claim', { claim: pending.code })
  if (error) return void useCloud.setState({ notice: 'Your guest results could not be moved to this account. They are still on the guest profile.' })
  await flush('all').catch(() => undefined)
  useCloud.setState({ goto: '/profile', canMove: false })
}

export const dismissNotice = () => useCloud.setState({ notice: null })
export const arrived = () => useCloud.setState({ goto: null })

// ── Joining an assessment from an invitation ─────────────────────────────

export interface InvitePreview {
  sessionId: string
  title: string
  groupName: string
  coachName: string
  kind: 'baseline' | 'retest'
  protocol: string
  stations: DisciplineId[]
  courseTitle: string | null
}

/** What an invitation is for, readable before signing in. Null when the code is not valid (any more). */
export async function peekInvite(token: string): Promise<InvitePreview | null> {
  const { data, error } = await supabase!.rpc('peek_invite', { token })
  if (error) throw new Error(error.message)
  const row = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | null
  if (!row?.session_id) return null
  return {
    sessionId: String(row.session_id), title: String(row.title ?? ''), groupName: String(row.group_name ?? ''), coachName: String(row.coach_name ?? 'Your coach'),
    kind: row.kind === 'retest' ? 'retest' : 'baseline', protocol: String(row.protocol ?? ''), stations: (row.stations as DisciplineId[]) ?? [], courseTitle: (row.course_title as string | null) ?? null,
  }
}

const slug = (name: string) => name.trim().toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '').slice(0, 20) || 'athlete'
export const freshHandle = (name: string) => `${slug(name)}.${Math.random().toString(36).slice(2, 6)}`

export interface JoinAs { name?: string; sharing: 'coach' | 'group' }

/** Join the session an invitation names, as the signed-in account. Returns the session to open. */
export async function joinAssessment(token: string, who: JoinAs): Promise<string> {
  await ready()
  const id = engineUid!
  const me = useStore.getState().athletes[id]
  const name = who.name?.trim() || me.name
  // The coach's board shows the profile's name, so it has to be on the server before joining.
  if (name !== me.name || !me.handle) {
    useStore.getState().updateMe({ name, handle: me.handle || freshHandle(name) })
    await flush()
  }
  const { data, error } = await supabase!.rpc('join_assessment', { token, share: who.sharing })
  if (error) throw new Error(/not valid/i.test(error.message) ? 'This invitation is no longer open. Ask your coach for a new code.' : error.message)
  await flush('all')
  return String(data)
}

/** Remember an invitation across the trip to Google and back. */
export const rememberJoin = (token: string, who: JoinAs) => write(JOIN_KEY, { token, ...who, at: Date.now() })

async function resumeJoin() {
  const pending = read<JoinAs & { token: string; at: number }>(JOIN_KEY)
  write(JOIN_KEY, null)
  if (!pending || Date.now() - pending.at > 20 * 60000) return useCloud.setState({ joining: false })
  try {
    useCloud.setState({ joining: true })
    useCloud.setState({ goto: `/assess/${await joinAssessment(pending.token, pending)}`, joining: false })
  } catch (e) {
    useCloud.setState({ joining: false, notice: e instanceof Error ? e.message : 'Could not join the assessment.' })
  }
}

/** Is this handle free? True when it is, or when the server cannot be asked (it is checked again on saving). */
export async function handleFree(handle: string): Promise<boolean> {
  if (!supabase || !engineUid) return true
  const { data, error } = await supabase.from('profiles').select('id').eq('handle', handle).maybeSingle()
  return !!error || !data || data.id === engineUid
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // For driving the app from a test without a Google account.
  ;(window as unknown as Record<string, unknown>).__aura = { store: useStore, cloud: useCloud, content: useContent, continueAsGuest, joinAssessment, flush, pullContent, flushContent, ready, signOut, supabase }
}
