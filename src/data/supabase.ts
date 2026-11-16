import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Where the browser keeps the signed-in session. Named, so the app can tell "signed out" from "offline". */
export const AUTH_STORAGE_KEY = 'aura:auth'

/**
 * A sign-in that came back with a problem (for example: that Google account
 * already has a profile). Read from the address once, before the client sees
 * it, and removed from the address so a reload does not show it again.
 */
export const authReturn: { code: string; description: string } | null = (() => {
  if (typeof window === 'undefined') return null
  for (const raw of [window.location.hash.slice(1), window.location.search.slice(1)]) {
    const params = new URLSearchParams(raw)
    const code = params.get('error_code') ?? params.get('error')
    if (!code) continue
    window.history.replaceState(null, '', window.location.pathname)
    return { code, description: params.get('error_description') ?? '' }
  }
  return null
})()

/**
 * Supabase client. Null when the project has not been configured, in which
 * case the app runs in local demo mode and keeps its data on the device.
 *
 * Signing in and the syncing of app data both live in src/data/cloud; this
 * file only makes the connection.
 */
export const supabase = url && anonKey ? createClient(url, anonKey, { auth: { storageKey: AUTH_STORAGE_KEY } }) : null

export const isCloudConfigured = supabase !== null

/**
 * Where Google sends the athlete back. The app's own address, including any
 * hosting sub-path (BASE_URL), so it works on a custom domain or a sub-folder.
 * This exact URL must be listed under Authentication → URL Configuration →
 * Redirect URLs in the Supabase dashboard (see supabase/README.md).
 */
export const redirectTo = () => window.location.origin + import.meta.env.BASE_URL
