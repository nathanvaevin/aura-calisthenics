import { useEffect, useState } from 'react'
import { createClient, type Session } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Supabase client. Null when the project has not been configured, in which
 * case the app runs in local demo mode and keeps its data on the device.
 *
 * Status: authentication is wired here. Reading and writing app data through
 * Supabase is the next step; the schema it will use lives in
 * supabase/migrations and the store in src/data/store.ts is the single seam.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const isCloudConfigured = supabase !== null

export const signInWithGoogle = () =>
  supabase?.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })

export const signOut = () => supabase?.auth.signOut()

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])
  return session
}
