import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { create } from 'zustand'
import { useStore } from '@/data/store'
import { useVoice } from '@/theme/useTheme'
import type { VoiceKey } from '@/theme/voice'
import { cx } from '@/lib/format'

/**
 * A short walk round Aura: one real thing lit at a time, one sentence about
 * it. It begins on the profile and, at the skills, opens the tree itself and
 * climbs it from the bottom to the top. Each step names something on screen
 * by its `data-tour` mark; a step whose thing is not there (a tab this
 * athlete does not have) is left out. Forward, back, skip or leave at any
 * point.
 *
 * It lives in the Shell, not on a page, so that it can change pages.
 */
interface TourStep {
  target: string
  say: VoiceKey
  /** The page this step is shown on; it is opened if it is not the one on screen. Unset: wherever the tour is. */
  at?: string
  /** The whole page is the thing shown: nothing is dimmed, the words sit at the bottom, and the page is scrolled from its foot to its head. */
  climb?: boolean
}

const STEPS: TourStep[] = [
  { target: 'personalize', say: 'tour.personalize', at: '/profile' },
  { target: 'aura', say: 'tour.aura', at: '/profile' },
  { target: 'ratings', say: 'tour.ratings', at: '/profile' },
  { target: 'tree', say: 'tour.skills', at: '/tree', climb: true },
  { target: 'nav-train', say: 'tour.train' },
  { target: 'nav-library', say: 'tour.library' },
]

/** Whether the introduction is running. Anything may start it; the Shell shows it. */
export const useTour = create<{ open: boolean; start: () => void; stop: () => void }>((set) => ({
  open: false,
  start: () => set({ open: true }),
  stop: () => set({ open: false }),
}))

const find = (target: string) => [...document.querySelectorAll<HTMLElement>(`[data-tour="${target}"]`)].find((el) => el.getClientRects().length > 0) ?? null
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Scroll the page from its foot to its head, slowly enough to read. Returns how to stop it. */
function climb(): () => void {
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max <= 0 || calm()) { window.scrollTo({ top: 0, behavior: 'instant' }); return () => undefined }
  window.scrollTo({ top: max, behavior: 'instant' })
  const wait = 700
  const length = Math.min(7000, Math.max(3600, max * 3.4))
  const from = performance.now()
  let frame = 0
  const tick = (now: number) => {
    const k = Math.min(1, Math.max(0, (now - from - wait) / length))
    const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
    window.scrollTo({ top: max * (1 - eased), behavior: 'instant' })
    if (k < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}

interface Box { left: number; top: number; width: number; height: number }

export function Tour() {
  const open = useTour((s) => s.open)
  const stop = useTour((s) => s.stop)
  const setSettings = useStore((s) => s.setSettings)
  const v = useVoice()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [steps, setSteps] = useState(STEPS)
  const [at, setAt] = useState(0)
  const [box, setBox] = useState<Box | null>(null)
  const end = at >= steps.length
  const step = end ? undefined : steps[at]
  /** The step whose thing has been found and brought into view. */
  const arrived = useRef<TourStep | null>(null)

  const close = useCallback((finished: boolean) => {
    stop()
    setSettings({ tour: finished ? 'done' : 'skipped' })
  }, [stop, setSettings])

  // It always begins on the profile, from the top.
  useEffect(() => {
    if (!open) return
    setSteps(STEPS)
    setAt(0)
    setBox(null)
    arrived.current = null
  }, [open])

  // A step that belongs to another page opens that page.
  useEffect(() => {
    if (open && step?.at && step.at !== pathname) navigate(step.at)
  }, [open, step, pathname, navigate])

  useEffect(() => {
    if (!open || !step) return
    if (step.at && step.at !== pathname) return setBox(null)
    let stopClimb: (() => void) | null = null
    let settle = 0
    const since = performance.now()
    const look = () => {
      const el = find(step.target)
      if (!el) {
        // Not on this screen after a fair wait (a tab this athlete does not have): leave the step out.
        if (performance.now() - since > 2400) setSteps((all) => all.filter((s) => s !== step))
        return setBox(null)
      }
      if (arrived.current !== step) {
        arrived.current = step
        // The tree is climbed once it has drawn itself; anything else is brought to the middle, unless it is part of the navigation, which does not scroll.
        if (step.climb) settle = window.setTimeout(() => { stopClimb = climb() }, 260)
        else if (!step.target.startsWith('nav-')) el.scrollIntoView({ block: 'center', behavior: calm() ? 'auto' : 'smooth' })
      }
      if (step.climb) return setBox(null)
      // The thing spoken about takes the theme's colour while it is lit.
      if (!el.hasAttribute('data-tour-lit')) { document.querySelectorAll('[data-tour-lit]').forEach((x) => x.removeAttribute('data-tour-lit')); el.setAttribute('data-tour-lit', '') }
      const r = el.getBoundingClientRect()
      setBox((was) => (was && Math.abs(was.left - r.left) < 0.5 && Math.abs(was.top - r.top) < 0.5 && Math.abs(was.width - r.width) < 0.5 && Math.abs(was.height - r.height) < 0.5 ? was : { left: r.left, top: r.top, width: r.width, height: r.height }))
    }
    look()
    const tick = window.setInterval(look, 120)
    window.addEventListener('resize', look)
    window.addEventListener('scroll', look, true)
    return () => {
      document.querySelectorAll('[data-tour-lit]').forEach((x) => x.removeAttribute('data-tour-lit'))
      window.clearInterval(tick)
      window.clearTimeout(settle)
      stopClimb?.()
      window.removeEventListener('resize', look)
      window.removeEventListener('scroll', look, true)
    }
  }, [open, step, pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false)
      if (e.key === 'ArrowRight') setAt((n) => Math.min(steps.length, n + 1))
      if (e.key === 'ArrowLeft') setAt((n) => Math.max(0, n - 1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, steps.length, close])

  if (!open) return null

  const pad = 6
  const vw = window.innerWidth, vh = window.innerHeight
  const width = Math.min(330, vw - 32)
  // The words go under the thing they are about, or over it when there is no room below.
  const below = box ? box.top + box.height + pad + 12 : 0
  const under = box ? below + 150 < vh : true
  const left = box ? Math.min(vw - width - 16, Math.max(16, box.left + box.width / 2 - width / 2)) : (vw - width) / 2
  const place: React.CSSProperties = end
    ? { left: (vw - width) / 2, top: '50%', width, transform: 'translateY(-50%)' }
    : step?.climb
      ? { left: (vw - width) / 2, bottom: 'calc(env(safe-area-inset-bottom) + 84px)', width }
      : !box
        ? { left: (vw - width) / 2, top: '50%', width, transform: 'translateY(-50%)' }
        : under ? { left, top: below, width } : { left, bottom: vh - box.top + pad + 12, width }

  return createPortal(
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Introduction" data-tour-open data-tour-step={end ? 'end' : step?.target}>
      {/* Everything but the lit thing is dimmed, and nothing behind can be pressed by accident. */}
      <div className="absolute inset-0" onClick={() => setAt((n) => Math.min(steps.length, n + 1))} />
      {!end && box && (
        <div
          className="pointer-events-none absolute rounded-[18px] ring-2 ring-accent transition-all duration-300 ease-out motion-reduce:transition-none" data-tour-ring
          style={{ left: box.left - pad, top: box.top - pad, width: box.width + pad * 2, height: box.height + pad * 2, background: 'color-mix(in oklab, var(--accent) 16%, transparent)', boxShadow: '0 0 26px 4px color-mix(in oklab, var(--accent) 55%, transparent), 0 0 0 200vmax rgba(0, 0, 0, 0.72)' }}
        />
      )}
      {end && <div className="absolute inset-0 bg-black/70" />}

      <div className={cx('absolute rounded-[20px] border border-line-strong bg-bg-2 p-4 shadow-(--shadow-pop) transition-all duration-300 ease-out motion-reduce:transition-none', end && 'text-center')} style={place}>
        {end ? (
          <>
            <div className="display text-[28px] leading-tight">{v('tour.end.title')}</div>
            <button className="btn btn-primary mt-4 w-full" onClick={() => { close(true); navigate('/profile') }}>Go to profile <ArrowRight size={16} /></button>
            <button className="mt-1 flex h-10 w-full items-center justify-center text-[13px] text-ink-3 hover:text-ink" onClick={() => { close(true); navigate('/train') }}>{v('tour.end.go')}</button>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <p className="min-w-0 flex-1 text-[15px] leading-snug">{step ? v(step.say) : ''}</p>
              <button onClick={() => close(false)} aria-label="Skip the introduction" className="-mt-1 -mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"><X size={15} /></button>
            </div>
            <div className="mt-3.5 flex items-center justify-between">
              <span className="flex gap-1.5" aria-label={`Step ${at + 1} of ${steps.length}`}>
                {steps.map((s, i) => <span key={s.target} className={cx('h-1 rounded-full transition-all', i === at ? 'w-5 bg-ink' : 'w-1.5 bg-line-strong')} />)}
              </span>
              <span className="flex gap-2">
                {at > 0 && <button className="btn btn-quiet btn-sm !px-3" onClick={() => setAt(at - 1)} aria-label="Back"><ArrowLeft size={14} /></button>}
                <button className="btn btn-primary btn-sm" onClick={() => setAt(at + 1)}>{at === steps.length - 1 ? 'Done' : 'Next'} <ArrowRight size={14} /></button>
              </span>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

/** The way in: the first thing on a new athlete's profile, and easy to wave away. */
export function StartHere({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  const v = useVoice()
  return (
    <section className="rise card flex items-center gap-3 p-4 ring-1 ring-accent/60" data-start-here>
      <span className="min-w-0 flex-1">
        <span className="display block text-[22px] leading-tight">{v('tour.start.title')}</span>
        <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-2">{v('tour.start.line')}</span>
      </span>
      <button className="btn btn-primary btn-sm shrink-0" onClick={onStart}>Show me</button>
      <button className="flex h-9 shrink-0 items-center px-1 text-[12.5px] text-ink-3 hover:text-ink" onClick={onSkip}>Skip</button>
    </section>
  )
}
