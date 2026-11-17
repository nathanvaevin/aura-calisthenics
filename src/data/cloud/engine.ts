import { TABLES, accessTo, emptyRowSet, fingerprint, tableByName, wire, type Access, type Row, type RowSet, type TableDef, type TableName } from './rows'
import { SYNCED_KEYS, build, project, type Synced } from './mappers'

/**
 * Keeps the app's state and the database in step.
 *
 * The device stays the place the app reads and writes: screens never wait for
 * the network. This engine compares what the device holds with what it last
 * knew the server to hold (the shadow) and sends the difference; it fetches
 * what the server holds and merges that in. A row changed on the device and
 * not yet sent is kept through a fetch; everything else follows the server.
 *
 * It knows nothing about Supabase. `Remote` is the server as it needs it,
 * which is also what lets the tests run two devices against a pretend one.
 */

/** `table/key` → `fingerprint:access` for every row the server is known to hold. */
export type Shadow = Record<string, string>

/** all: everything this account can see · assess: assessment tables only (the live board) */
export type Scope = 'all' | 'assess'

export interface Remote {
  /** The complete rows of each returned table that this account may see. */
  pull(scope: Scope, uid: string, profiles: string[]): Promise<Partial<RowSet>>
  write(table: TableName, rows: Row[], access: Exclude<Access, null>): Promise<void>
  remove(table: TableName, keys: Row[]): Promise<void>
  /** Re-run the server's finalise for a session whose results changed after it was closed. */
  finalise(sessionId: string): Promise<void>
}

/** A failure worth retrying later (offline, timeout, server busy) as opposed to a refused write. */
export class RemoteError extends Error {
  constructor(message: string, readonly transient: boolean, readonly code?: string) {
    super(message)
  }
}

export interface Host {
  get(): Synced & { cloudShadow: Shadow }
  set(patch: Partial<Synced> & { cloudShadow: Shadow }): void
}

export interface EngineStatus {
  /** idle: in step · syncing: talking to the server · waiting: will retry (offline or busy) */
  phase: 'idle' | 'syncing' | 'waiting'
  /** At least one complete fetch has been merged for this account on this device. */
  loaded: boolean
  /** Changes on this device the server does not have yet. */
  pending: number
  /** Changes the server refused. They stay on the device and are tried again after the next fetch. */
  refused: number
  error?: string
  lastSyncedAt?: number
}

const LETTER: Record<Exclude<Access, null>, string> = { full: 'f', update: 'u', insert: 'i', verify: 'v' }
const mark = (fp: string, access: Access) => `${fp}:${access ? LETTER[access] : '-'}`
const fpOf = (entry: string) => entry.slice(0, entry.lastIndexOf(':'))
const accessOf = (entry: string) => entry.slice(entry.lastIndexOf(':') + 1)
const idOf = (table: TableName, key: string) => `${table}/${key}`

const ASSESS_TABLES: TableName[] = ['profiles', 'assessment_sessions', 'assessment_status', 'assessment_participants', 'assessment_results']
const CHUNK = 200
const RETRY_MS = [1500, 4000, 10000, 20000, 30000]

/** Every profile the rows refer to: who to ask the server about. */
export function referencedProfiles(set: RowSet, uid: string): string[] {
  const ids = new Set<string>([uid])
  const add = (v: unknown) => { if (typeof v === 'string' && v) ids.add(v) }
  for (const r of set.courses.values()) add(r.coach_id)
  for (const r of set.course_enrollments.values()) add(r.athlete_id)
  for (const r of set.workout_logs.values()) add(r.athlete_id)
  for (const r of set.evidence.values()) add(r.athlete_id)
  for (const r of set.feedback.values()) { add(r.coach_id); add(r.athlete_id) }
  for (const r of set.follows.values()) add(r.followee_id)
  for (const r of set.assessment_sessions.values()) add(r.owner_id)
  for (const r of set.assessment_participants.values()) add(r.athlete_id)
  return [...ids]
}

const byTable = (shadow: Shadow) => {
  const out = Object.fromEntries(TABLES.map((t) => [t.name, [] as string[]])) as Record<TableName, string[]>
  for (const id of Object.keys(shadow)) {
    const slash = id.indexOf('/')
    out[id.slice(0, slash) as TableName]?.push(id.slice(slash + 1))
  }
  return out
}

const keyRow = (def: TableDef, key: string): Row => {
  const parts = key.split('|')
  return Object.fromEntries(def.key.map((k, i) => [k, parts[i]]))
}

/** With no shared history, the server's row wins, except a profile that was never filled in. */
const deviceWinsUnseen = (table: TableName, local: Row, remote: Row) => table === 'profiles' && !remote.handle && !!local.handle

export function createEngine(remote: Remote, uid: string, host: Host, onStatus: (s: EngineStatus) => void = () => {}) {
  let stopped = false
  let running = false
  let wantPush = false
  let wantPull: Scope | null = null
  let fails = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  /** Writes the server refused, by row id → the fingerprint that was refused. Forgotten after each full fetch. */
  const refused = new Map<string, string>()
  let status: EngineStatus = { phase: 'idle', loaded: false, pending: 0, refused: 0 }

  const report = (patch: Partial<EngineStatus>) => {
    status = { ...status, ...patch }
    onStatus(status)
  }

  // ── Push: send what changed here ───────────────────────────────────────

  type Item = { id: string; row: Row; fp: string }

  async function push() {
    const state = host.get()
    const local = project(state, uid)
    const shadow: Shadow = { ...state.cloudShadow }
    const known = byTable(shadow)
    let changed = false
    let left = 0
    const refinalise = new Set<string>()
    const finalisedNow = new Set<string>()

    // Work out everything first, so "how much is left" is known even if the network drops halfway.
    const writes: { def: TableDef; access: Exclude<Access, null>; items: Item[] }[] = []
    for (const def of TABLES) {
      const queue: Partial<Record<Exclude<Access, null>, Item[]>> = {}
      for (const [key, row] of local[def.name]) {
        const access = accessTo(def.name, row, local, uid)
        if (!access) continue
        const id = idOf(def.name, key)
        const fp = fingerprint(def, row)
        const seen = shadow[id]
        if (seen && fpOf(seen) === fp) continue
        // A row that can only be updated must already exist; one that can only be added must not.
        if ((access === 'update' || access === 'verify') && !seen) continue
        if (access === 'insert' && seen) continue
        left++
        if (refused.get(id) === fp) continue
        ;(queue[access] ??= []).push({ id, row, fp })
      }
      for (const [access, items] of Object.entries(queue) as [Exclude<Access, null>, Item[]][]) writes.push({ def, access, items })
    }
    const deletes: { def: TableDef; keys: string[] }[] = []
    for (const def of [...TABLES].reverse()) {
      if (def.name === 'assessment_status') continue
      const keys = known[def.name].filter((key) => {
        const access = accessOf(shadow[idOf(def.name, key)])
        return !local[def.name].has(key) && (access === 'f' || access === 'i')
      })
      if (keys.length) deletes.push({ def, keys })
      left += keys.length
    }

    const touch = (table: TableName, row: Row) => {
      if (table === 'assessment_participants' && row.session_id) refinalise.add(String(row.session_id))
      if (table === 'assessment_results') refinalise.add(String(local.assessment_participants.get(String(row.participant_id))?.session_id ?? ''))
    }

    try {
      for (const { def, access, items } of writes) {
        const done = (list: Item[]) => {
          for (const item of list) {
            shadow[item.id] = mark(item.fp, access)
            refused.delete(item.id)
            touch(def.name, item.row)
            if (def.name === 'assessment_status' && item.row.status === 'finalised') finalisedNow.add(String(item.row.id))
          }
          left -= list.length
          changed = true
        }
        const send = (list: Item[]) => remote.write(def.name, list.map((i) => wire(def, i.row)), access)
        for (let at = 0; at < items.length; at += CHUNK) {
          const chunk = items.slice(at, at + CHUNK)
          try {
            await send(chunk)
            done(chunk)
          } catch (e) {
            if (!(e instanceof RemoteError) || e.transient) throw e
            // One bad row must not hold the others back: find it.
            for (const item of chunk) {
              try {
                if (chunk.length === 1) throw e
                await send([item])
                done([item])
              } catch (one) {
                if (!(one instanceof RemoteError) || one.transient) throw one
                refused.set(item.id, item.fp)
                console.warn(`[aura sync] ${def.name} refused:`, one.message, item.row)
              }
            }
          }
        }
      }

      for (const { def, keys } of deletes) {
        for (let at = 0; at < keys.length; at += CHUNK) {
          const chunk = keys.slice(at, at + CHUNK)
          for (const key of chunk) touch(def.name, keyRow(def, key))
          // A delete the server ignores (already gone, or not ours after all) is put right by the next fetch.
          await remote.remove(def.name, chunk.map((key) => keyRow(def, key)))
          for (const key of chunk) {
            delete shadow[idOf(def.name, key)]
            if (def.name === 'assessment_sessions') delete shadow[idOf('assessment_status', key)]
          }
          left -= chunk.length
          changed = true
        }
      }

      // Results changed in a session that is already closed: its evidence has to be rewritten.
      for (const sessionId of refinalise) {
        const mine = local.assessment_sessions.get(sessionId)?.owner_id === uid
        if (!mine || finalisedNow.has(sessionId) || local.assessment_status.get(sessionId)?.status !== 'finalised') continue
        await remote.finalise(sessionId)
        finalisedNow.add(sessionId)
      }
    } finally {
      // The app may have moved on while this was in flight; only the shadow is ours to set.
      if (changed && !stopped) host.set({ cloudShadow: shadow })
      report({ pending: left, refused: refused.size })
    }
    // Finalising writes evidence and enrolments on the server; fetch them.
    if (finalisedNow.size) wantPull = 'all'
  }

  // ── Pull: fetch what the server holds and merge it in ──────────────────

  async function pull(scope: Scope) {
    const fetched = await remote.pull(scope, uid, referencedProfiles(project(host.get(), uid), uid))
    if (stopped) return

    // Nothing below waits, so the app cannot change underneath the merge.
    const state = host.get()
    const local = project(state, uid)
    const shadow = state.cloudShadow
    const known = byTable(shadow)
    const tables = (Object.keys(fetched) as TableName[]).filter((t) => scope === 'all' || ASSESS_TABLES.includes(t))
    const merged = emptyRowSet()
    const view = emptyRowSet()
    for (const def of TABLES) {
      const from = tables.includes(def.name) ? fetched[def.name]! : local[def.name]
      for (const [k, r] of from) view[def.name].set(k, r)
      if (!tables.includes(def.name)) for (const [k, r] of local[def.name]) merged[def.name].set(k, r)
    }

    const deleting = new Set<string>()
    let closed = false
    for (const table of tables) {
      const def = tableByName[table]
      const there = fetched[table]!
      for (const key of new Set([...local[table].keys(), ...there.keys(), ...known[table]])) {
        const id = idOf(table, key)
        const l = local[table].get(key)
        const r = there.get(key)
        const sh = shadow[id]
        let keepLocal = false
        if (l) {
          const access = accessTo(table, l, local, uid)
          const changedHere = !sh || fpOf(sh) !== fingerprint(def, l)
          if (access && changedHere) {
            if (sh) keepLocal = access !== 'insert'
            else keepLocal = r ? deviceWinsUnseen(table, l, r) : access === 'full' || access === 'insert'
          }
        } else if (sh && r && (accessOf(sh) === 'f' || accessOf(sh) === 'i')) {
          // Removed here, still there: stays removed, and the push will remove it there.
          deleting.add(id)
          continue
        }
        if (keepLocal) merged[table].set(key, l!)
        else if (r) merged[table].set(key, r)
        if (table === 'assessment_status' && r?.status === 'finalised' && (!sh || fpOf(sh) !== fingerprint(def, r))) closed = true
      }
    }

    const next = build(merged, uid, state)
    const held = project(next, uid)
    const nextShadow: Shadow = {}
    for (const [id, entry] of Object.entries(shadow)) if (!tables.includes(id.slice(0, id.indexOf('/')) as TableName)) nextShadow[id] = entry
    for (const table of tables) {
      const def = tableByName[table]
      for (const [key, r] of fetched[table]!) {
        const id = idOf(table, key)
        // Only rows the app actually holds are remembered, so a row it could not place is never mistaken for one it deleted.
        if (held[table].has(key) || deleting.has(id)) nextShadow[id] = mark(fingerprint(def, r), accessTo(table, r, view, uid))
      }
    }

    const patch: Partial<Synced> & { cloudShadow: Shadow } = { cloudShadow: nextShadow }
    for (const k of SYNCED_KEYS) if (next[k] !== state[k]) (patch as Record<string, unknown>)[k] = next[k]
    host.set(patch)

    if (scope === 'all') {
      refused.clear()
      report({ loaded: true, refused: 0 })
    } else if (closed) {
      // A session was closed elsewhere: its evidence and enrolments are new too.
      wantPull = 'all'
    }
    wantPush = true
  }

  // ── The loop ───────────────────────────────────────────────────────────

  let waiters: { resolve: () => void; reject: (e: Error) => void }[] = []
  const release = (error?: Error) => {
    const list = waiters
    waiters = []
    for (const w of list) (error ? w.reject(error) : w.resolve())
  }

  async function run() {
    if (running || stopped) return
    running = true
    if (timer) { clearTimeout(timer); timer = null }
    let pulling: Scope | null = null
    try {
      while (!stopped && (wantPush || wantPull)) {
        report({ phase: 'syncing' })
        // With no record of what the server holds, nothing here can be told apart from stale
        // data: look first, so that an older copy on this device never overwrites the account.
        if (Object.keys(host.get().cloudShadow).length === 0 && !status.loaded) {
          pulling = 'all'
          wantPull = null
          await pull('all')
          pulling = null
        }
        wantPush = false
        await push()
        if (wantPull && !stopped) {
          pulling = wantPull
          wantPull = null
          await pull(pulling)
          pulling = null
        }
      }
      fails = 0
      report({ phase: 'idle', error: undefined, lastSyncedAt: Date.now() })
      release()
    } catch (e) {
      if (stopped) return
      wantPush = true
      if (pulling) wantPull = wantPull === 'all' || pulling === 'all' ? 'all' : 'assess'
      const message = e instanceof Error ? e.message : String(e)
      if (!(e instanceof RemoteError)) console.error('[aura sync]', e)
      report({ phase: 'waiting', error: message })
      release(new Error(message))
      timer = setTimeout(() => void run(), RETRY_MS[Math.min(fails++, RETRY_MS.length - 1)])
    } finally {
      running = false
    }
  }

  return {
    /** Something changed on the device: send it. With a scope, fetch as well. */
    request(scope?: Scope) {
      if (stopped) return
      wantPush = true
      if (scope) wantPull = wantPull === 'all' || scope === 'all' ? 'all' : 'assess'
      void run()
    },
    /** Resolves once nothing is left to send or fetch; rejects if the server could not be reached. */
    settled(): Promise<void> {
      if (stopped || (!running && !wantPush && !wantPull)) return Promise.resolve()
      return new Promise((resolve, reject) => {
        waiters.push({ resolve, reject })
        void run()
      })
    },
    status: () => status,
    stop() {
      stopped = true
      if (timer) clearTimeout(timer)
      release()
    },
  }
}

export type Engine = ReturnType<typeof createEngine>
