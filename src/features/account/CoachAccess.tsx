import { useCallback, useEffect, useState } from 'react'
import { Check, Clock, X } from 'lucide-react'
import { supabase } from '@/data/supabase'
import { flush, useCloud } from '@/data/cloud'
import { useStore } from '@/data/store'
import { Eyebrow, SectionTitle } from '@/ui/primitives'
import { cx, relativeDay } from '@/lib/format'
import { CONTACT } from '@/app/contact'

/**
 * Coaching is granted by an admin, never chosen. These are the two sides of
 * that: an athlete asking (with the answer shown), and an admin deciding.
 * Requests live outside the synced store: they are read when shown.
 */

export interface CoachRequest {
  athlete_id: string
  note: string | null
  status: 'pending' | 'approved' | 'declined'
  created_at: string
  decided_at: string | null
}

export async function requestCoach(note?: string) {
  if (!supabase) return
  const { error } = await supabase.rpc('request_coach', { note: note ?? null })
  if (error) throw new Error(error.message)
}

function useMyRequest() {
  const uid = useCloud((s) => (s.auth === 'in' && s.user && !s.user.guest ? s.user.id : null))
  const [request, setRequest] = useState<CoachRequest | null | 'loading'>('loading')
  const load = useCallback(async () => {
    if (!supabase || !uid) return setRequest(null)
    const { data } = await supabase.from('coach_requests').select('*').eq('athlete_id', uid).maybeSingle()
    setRequest((data as CoachRequest | null) ?? null)
  }, [uid])
  useEffect(() => { void load() }, [load])
  return { request, reload: load, signedIn: !!uid }
}

/** Who to message about a coach request, with a one-tap WhatsApp link. */
export function CoachContact({ className }: { className?: string }) {
  return (
    <p className={cx('text-[12.5px] leading-relaxed text-ink-2', className)}>
      Questions, or want it sooner? Message{' '}
      <a className="font-medium text-ink underline decoration-line-strong underline-offset-4" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">{CONTACT.phone} on WhatsApp</a>.
    </p>
  )
}

/** In Profile settings, for someone who is not a coach yet. */
export function CoachAccessRow() {
  const { request, reload, signedIn } = useMyRequest()
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const guest = useCloud((s) => !!s.user?.guest)

  const send = async () => {
    setBusy(true)
    setError(null)
    try {
      await requestCoach(note)
      setOpen(false)
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the request.')
    } finally {
      setBusy(false)
    }
  }
  const withdraw = async () => {
    await supabase?.rpc('withdraw_coach_request')
    await reload()
  }

  const pending = request !== 'loading' && request?.status === 'pending'
  const declined = request !== 'loading' && request?.status === 'declined'

  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 text-[14px]">
          Coaching
          <span className="block text-[12px] text-ink-3">
            {guest ? 'Keep your profile with Google first; coach access belongs to an account.'
              : !signedIn ? 'Sign in to ask for coach access.'
              : pending ? `Coach request pending, sent ${relativeDay(request.created_at).toLowerCase()}. Coach Studio opens here once it is approved.`
              : declined ? 'Your last request was not approved. You can ask again.'
              : 'Build courses, run group assessments and review students. Coach access is given on request.'}
          </span>
        </span>
        {signedIn && !guest && request !== 'loading' && (
          pending
            ? <button className="btn btn-quiet btn-sm shrink-0" onClick={() => void withdraw()}>Withdraw</button>
            : !open && <button className="btn btn-quiet btn-sm shrink-0" onClick={() => setOpen(true)}>Ask for access</button>
        )}
      </div>
      {pending && <CoachContact className="mt-2" />}
      {open && (
        <div className="mt-3">
          <textarea className="field" rows={3} maxLength={500} placeholder="Optional: where and what you coach" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="mt-2 flex gap-2">
            <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => void send()}>{busy ? 'Sending…' : 'Send request'}</button>
            <button className="btn btn-quiet btn-sm" onClick={() => setOpen(false)}>Cancel</button>
          </div>
          {error && <p className="mt-2 text-[12.5px] text-warn">{error}</p>}
        </div>
      )}
    </div>
  )
}

interface Pending extends CoachRequest { name: string; handle: string | null }

/** For an admin: every open request, approve or decline in one tap. */
export function CoachRequests() {
  // Requests live in the database: the sample world's admin has none to decide.
  const isAdmin = useStore((s) => !!s.cloudUid && !!s.meId && !!s.athletes[s.meId]?.roles.includes('admin'))
  const [list, setList] = useState<Pending[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: e } = await supabase.from('coach_requests').select('*').eq('status', 'pending').order('created_at')
    if (e) return setError(e.message)
    const rows = (data ?? []) as CoachRequest[]
    const ids = rows.map((r) => r.athlete_id)
    const { data: people } = ids.length ? await supabase.from('profiles').select('id, name, handle, roles').in('id', ids) : { data: [] }
    const byId = new Map((people ?? []).map((p: { id: string; name: string; handle: string | null; roles: string[] }) => [p.id, p]))
    // Someone made coach another way (by hand in the database) has nothing left to decide.
    setList(rows.filter((r) => !byId.get(r.athlete_id)?.roles?.includes('coach')).map((r) => ({ ...r, name: byId.get(r.athlete_id)?.name ?? 'Athlete', handle: byId.get(r.athlete_id)?.handle ?? null })))
  }, [])
  useEffect(() => { if (isAdmin) void load() }, [isAdmin, load])

  if (!isAdmin) return null

  const decide = async (id: string, approve: boolean) => {
    setError(null)
    const { error: e } = await supabase!.rpc('decide_coach', { athlete: id, approve })
    if (e) return setError(e.message)
    await load()
    await flush('all').catch(() => undefined)
  }

  return (
    <section>
      <SectionTitle action={<button className="text-[12.5px] text-ink-3 hover:text-ink" onClick={() => void load()}>Refresh</button>}>Coach requests</SectionTitle>
      {list === null ? (
        <p className="text-[13px] text-ink-3">Loading…</p>
      ) : list.length === 0 ? (
        <div className="card flex items-center gap-3 p-4 text-[13.5px] text-ink-2"><Clock size={15} className="text-ink-3" />No one is waiting for coach access.</div>
      ) : (
        <div className="card divide-y divide-line">
          {list.map((r) => (
            <div key={r.athlete_id} className="flex items-start gap-3 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px] font-medium">{r.name}{r.handle && <span className="ml-1.5 font-normal text-ink-3">@{r.handle}</span>}</span>
                <span className="block text-[12px] text-ink-3">Asked {relativeDay(r.created_at)}</span>
                {r.note && <span className="mt-1 block text-[13px] leading-snug text-ink-2">“{r.note}”</span>}
              </span>
              <button aria-label={`Decline ${r.name}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-3 hover:text-ink" onClick={() => void decide(r.athlete_id, false)}><X size={15} /></button>
              <button aria-label={`Approve ${r.name}`} className={cx('flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ink px-3 text-[13px] font-medium text-bg')} onClick={() => void decide(r.athlete_id, true)}><Check size={14} strokeWidth={2.6} />Approve</button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-2 text-[12.5px] text-warn">{error}</p>}
      <Eyebrow className="mt-2 !normal-case !tracking-normal text-[12px] text-ink-3">You see this because your account is an admin. Approving gives Coach Studio on their next refresh.</Eyebrow>
    </section>
  )
}
