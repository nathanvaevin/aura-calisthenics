import { useState, type ReactNode } from 'react'
import { AlertTriangle, Check, CloudOff, Loader, X } from 'lucide-react'
import { dismissNotice, keepWithGoogle, moveToMyAccount, signInWithGoogle, useCloud } from '@/data/cloud'
import { Wordmark } from '@/app/Shell'
import { cx } from '@/lib/format'

/** A whole-screen pause while the account is being found or its data fetched. */
export function Splash({ children }: { children?: ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[520px] flex-col items-center justify-center px-6 text-center">
      <div className="page-glow" />
      <div className="relative z-10">
        <Wordmark size={44} />
        {children && <div className="mt-5 text-[14px] leading-relaxed text-ink-2">{children}</div>}
      </div>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export function GoogleButton({ children = 'Continue with Google', className, onClick }: { children?: ReactNode; className?: string; onClick?: () => void }) {
  const [busy, setBusy] = useState(false)
  return (
    <button
      className={cx('btn', className ?? 'btn-primary btn-lg')}
      disabled={busy}
      onClick={() => {
        setBusy(true)
        window.setTimeout(() => setBusy(false), 6000)
        onClick ? onClick() : void signInWithGoogle()
      }}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white"><GoogleMark /></span>
      {children}
    </button>
  )
}

/** Something went wrong signing in or keeping an account. Says what, once. */
export function Notice({ className }: { className?: string }) {
  const notice = useCloud((s) => s.notice)
  if (!notice) return null
  return (
    <div role="alert" className={cx('flex items-start gap-3 rounded-[18px] border border-warn/40 bg-warn/8 p-3.5 text-left', className)}>
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />
      <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-ink-2">{notice}</p>
      <button aria-label="Dismiss" onClick={dismissNotice} className="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-3 hover:text-ink"><X size={14} /></button>
    </div>
  )
}

/** Whether what is on this screen has reached the server. Shown wherever someone else depends on it. */
export function SyncLine({ className, saved = 'Saved to your account' }: { className?: string; saved?: string }) {
  const sync = useCloud((s) => s.sync)
  const signedIn = useCloud((s) => s.auth === 'in')
  if (!signedIn) return null
  const state = sync.phase === 'waiting' ? 'offline' : sync.refused > 0 ? 'refused' : sync.phase === 'syncing' && sync.pending > 0 ? 'saving' : sync.pending > 0 ? 'saving' : 'saved'
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-[12px]', state === 'saved' ? 'text-ink-3' : state === 'saving' ? 'text-ink-2' : 'text-warn', className)}>
      {state === 'saved' && <><Check size={12} strokeWidth={2.6} className="text-good" />{saved}</>}
      {state === 'saving' && <><Loader size={12} className="animate-spin" />Saving…</>}
      {state === 'offline' && <><CloudOff size={12} />No connection. Kept on this device and sent when you are back online.</>}
      {state === 'refused' && <><AlertTriangle size={12} />{sync.refused} {sync.refused === 1 ? 'change' : 'changes'} could not be saved yet. Still on this device.</>}
    </span>
  )
}

/**
 * For a test-day guest: the one step that turns the profile they just earned
 * into one they can open again. Same account, nothing re-entered.
 */
export function KeepProfile({ className }: { className?: string }) {
  const user = useCloud((s) => s.user)
  const canMove = useCloud((s) => s.canMove)
  if (!user?.guest) return null
  if (canMove)
    return (
      <div className={cx('card p-5', className)}>
        <div className="display text-[24px] leading-tight">You already have a profile</div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
          That Google account already has an Aura profile, so it cannot be attached to this guest one. You can sign in to it instead and bring these results along: your part in this assessment, its evidence and your place in the course move to your own profile.
        </p>
        <GoogleButton className="btn-primary btn-lg mt-4 w-full" onClick={() => void moveToMyAccount()}>Move these results to my account</GoogleButton>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">Where your account already took part in the same assessment, its own entry stays as it is.</p>
      </div>
    )
  return (
    <div className={cx('card p-5', className)}>
      <div className="display text-[24px] leading-tight">Keep this profile</div>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
        You joined as a guest. Your results are saved, but only this browser can open them. Add a Google sign-in and this same profile, with everything on it, is yours to open anywhere.
      </p>
      <GoogleButton className="btn-primary btn-lg mt-4 w-full" onClick={() => void keepWithGoogle()}>Keep it with Google</GoogleButton>
      <Notice className="mt-3" />
      <p className="mt-3 text-[12px] leading-relaxed text-ink-3">Prefer not to? Take a screenshot of this page. Without an account, the profile cannot be opened again once this browser forgets it.</p>
    </div>
  )
}
