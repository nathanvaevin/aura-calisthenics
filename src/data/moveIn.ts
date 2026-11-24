/**
 * Moving in from the old address.
 *
 * Aura lived at nathanvaevin.github.io/aura-calisthenics until November 2026.
 * A browser keeps what a site stores per address, so on aurathletics.nl every
 * device would start empty: everyone signed out, guests without their profile.
 * The page left at the old address (forward/index.html) therefore brings what
 * this app had stored there along, in the part of the address after the `#`,
 * which a browser never sends to any server.
 *
 * It is taken in only when it really comes from that page, and only once, on a
 * device that has nothing of its own here. Otherwise anyone could send a link
 * that signs the person who opens it in to somebody else's profile.
 *
 * `main.tsx` imports this before anything else: the store and the sign-in
 * both read the browser's storage the moment they are loaded.
 */
export const OLD_ORIGIN = 'https://nathanvaevin.github.io'
export const MOVED_KEY = 'aura:moved'
const STATE = 'aura:v1'
const AUTH = 'aura:auth'
/** Everything that may come along. The page at the old address carries the same list (a test compares them). */
export const MOVING_KEYS = [STATE, AUTH, 'aura:cloud-user', 'aura:pending-join', 'aura:before-sign-in', 'aura:hand-over']
const MARK = '#move='

type Box = Pick<Storage, 'getItem' | 'setItem'>

const parse = (text: unknown): Record<string, unknown> | null => {
  if (typeof text !== 'string') return null
  try {
    const v = JSON.parse(text) as unknown
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function unpack(data: string): Record<string, unknown> | null {
  try {
    const raw = atob(data.replace(/-/g, '+').replace(/_/g, '/'))
    return parse(new TextDecoder().decode(Uint8Array.from(raw, (c) => c.charCodeAt(0))))
  } catch {
    return null
  }
}

/** Nothing of anyone's here yet: nobody signed in, and no profile other than the sample one. */
function untouched(box: Box): boolean {
  if (box.getItem(MOVED_KEY) || box.getItem(AUTH)) return false
  const state = parse(box.getItem(STATE))?.state as { meId?: unknown; demo?: unknown } | undefined
  return !state?.meId || state.demo === true
}

const cameFromOld = (referrer: string) => {
  try {
    return new URL(referrer).origin === OLD_ORIGIN
  } catch {
    return false
  }
}

/**
 * Reads the address. Null when it has nothing to do with moving; otherwise what
 * the `#` part should be from now on, and whether the luggage was taken in.
 */
export function takeMove(hash: string, referrer: string, box: Box): { hash: string; took: boolean } | null {
  if (!hash.startsWith(MARK)) return null
  const luggage = unpack(hash.slice(MARK.length))
  // The link that was opened at the old address may have had a `#` part of its own (an invitation): that goes on as it was.
  const own = typeof luggage?.hash === 'string' && luggage.hash.startsWith('#') && !luggage.hash.startsWith(MARK) ? luggage.hash : ''
  if (!luggage || luggage.v !== 1 || !cameFromOld(referrer)) return { hash: cameFromOld(referrer) ? own : '', took: false }
  try {
    const items = luggage.items as Record<string, unknown> | undefined
    const state = parse(items?.[STATE])
    const auth = parse(items?.[AUTH])
    const readable = (state === null ? items?.[STATE] === undefined : !!state.state) && (auth === null ? items?.[AUTH] === undefined : typeof auth.refresh_token === 'string')
    if (!items || (!state && !auth) || !readable || !untouched(box)) return { hash: own, took: false }
    for (const key of MOVING_KEYS) if (typeof items[key] === 'string') box.setItem(key, items[key] as string)
    box.setItem(MOVED_KEY, new Date().toISOString())
    return { hash: own, took: true }
  } catch {
    // Storage full or blocked: carry on as a new device rather than not at all.
    return { hash: own, took: false }
  }
}

if (typeof window !== 'undefined' && window.location) {
  let box: Storage | null = null
  try { box = window.localStorage } catch { /* blocked */ }
  const moved = box && takeMove(window.location.hash, document.referrer, box)
  // Out of the address at once, whatever came of it.
  if (moved) window.history.replaceState(null, '', window.location.pathname + window.location.search + moved.hash)
}
