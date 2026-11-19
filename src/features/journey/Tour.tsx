import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useVoice } from '@/theme/useTheme'
import type { VoiceKey } from '@/theme/voice'
import { cx } from '@/lib/format'

/**
 * A short walk round the profile: one real thing lit at a time, one sentence
 * about it. Each step names something on screen by its `data-tour` mark; a
 * step whose thing is not there (a coach's tab on a student's phone) is left
 * out. Forward, back, skip or leave at any point; nothing is locked while it
 * runs except the page behind it.
 */
const STEPS: { target: string; say: VoiceKey }[] = [
  { target: 'personalize', say: 'tour.personalize' },
  { target: 'aura', say: 'tour.aura' },
  { target: 'ratings', say: 'tour.ratings' },
  { target: 'nav-tree', say: 'tour.skills' },
  { target: 'nav-train', say: 'tour.train' },
  { target: 'nav-library', say: 'tour.library' },
]

const find = (target: string) => [...document.querySelectorAll<HTMLElement>(`[data-tour="${target}"]`)].find((el) => el.getClientRects().length > 0 && el.offsetParent !== null) ?? null

interface Box { left: number; top: number; width: number; height: number }

export function Tour({ open, onClose }: { open: boolean; onClose: (finished: boolean) => void }) {
  const v = useVoice()
  const navigate = useNavigate()
  const [steps, setSteps] = useState(STEPS)
  const [at, setAt] = useState(0)
  const [box, setBox] = useState<Box | null>(null)
  const end = at >= steps.length
  const step = steps[at]

  // Only what is actually on this screen is shown round.
  useLayoutEffect(() => {
    if (!open) return
    setSteps(STEPS.filter((s) => find(s.target)))
    setAt(0)
  }, [open])

  const measure = useCallback(() => {
    const el = step ? find(step.target) : null
    if (!el) return setBox(null)
    const r = el.getBoundingClientRect()
    setBox((was) => (was && Math.abs(was.left - r.left) < 0.5 && Math.abs(was.top - r.top) < 0.5 && Math.abs(was.width - r.width) < 0.5 && Math.abs(was.height - r.height) < 0.5 ? was : { left: r.left, top: r.top, width: r.width, height: r.height }))
  }, [step])

  useEffect(() => {
    if (!open || end) return
    const el = step ? find(step.target) : null
    // Bring it to the middle of the screen, unless it is part of the navigation, which does not scroll.
    if (el && !step.target.startsWith('nav-')) el.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    measure()
    const tick = window.setInterval(measure, 120)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => { window.clearInterval(tick); window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true) }
  }, [open, end, step, measure])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(false)
      if (e.key === 'ArrowRight') setAt((n) => Math.min(steps.length, n + 1))
      if (e.key === 'ArrowLeft') setAt((n) => Math.max(0, n - 1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, steps.length, onClose])

  if (!open) return null

  const pad = 6
  const vw = window.innerWidth, vh = window.innerHeight
  const width = Math.min(330, vw - 32)
  // The words go under the thing they are about, or over it when there is no room below.
  const below = box ? box.top + box.height + pad + 12 : 0
  const under = box ? below + 150 < vh : true
  const left = box ? Math.min(vw - width - 16, Math.max(16, box.left + box.width / 2 - width / 2)) : (vw - width) / 2

  return createPortal(
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Introduction" data-tour-open data-tour-step={end ? 'end' : step?.target}>
      {/* Everything but the lit thing is dimmed, and nothing behind can be pressed by accident. */}
      <div className="absolute inset-0" onClick={() => setAt((n) => Math.min(steps.length, n + 1))} />
      {!end && box && (
        <div
          className="pointer-events-none absolute rounded-[18px] ring-[1.5px] ring-accent transition-all duration-300 ease-out motion-reduce:transition-none"
          style={{ left: box.left - pad, top: box.top - pad, width: box.width + pad * 2, height: box.height + pad * 2, boxShadow: '0 0 0 200vmax rgba(0, 0, 0, 0.68)' }}
        />
      )}
      {end && <div className="absolute inset-0 bg-black/70" />}

      <div
        className={cx('absolute rounded-[20px] border border-line-strong bg-bg-2 p-4 shadow-(--shadow-pop) transition-all duration-300 ease-out motion-reduce:transition-none', end && 'text-center')}
        style={end || !box ? { left: (vw - width) / 2, top: '50%', width, transform: 'translateY(-50%)' } : under ? { left, top: below, width } : { left, bottom: vh - box.top + pad + 12, width }}
      >
        {end ? (
          <>
            <div className="display text-[28px] leading-tight">{v('tour.end.title')}</div>
            <button className="btn btn-primary mt-4 w-full" onClick={() => { onClose(true); navigate('/train') }}>{v('tour.end.go')} <ArrowRight size={16} /></button>
            <button className="mt-1 flex h-9 w-full items-center justify-center text-[12.5px] text-ink-3 hover:text-ink" onClick={() => onClose(true)}>Stay here</button>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <p className="min-w-0 flex-1 text-[15px] leading-snug">{step ? v(step.say) : ''}</p>
              <button onClick={() => onClose(false)} aria-label="Skip the introduction" className="-mt-1 -mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"><X size={15} /></button>
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

/** The way in: small, and easy to wave away. */
export function StartHere({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  const v = useVoice()
  return (
    <section className="rise card flex items-center gap-3 p-4" data-start-here>
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] font-medium">{v('tour.start.title')}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-ink-2">{v('tour.start.line')}</span>
      </span>
      <button className="btn btn-primary btn-sm shrink-0" onClick={onStart}>Show me</button>
      <button className="flex h-9 shrink-0 items-center px-1 text-[12.5px] text-ink-3 hover:text-ink" onClick={onSkip}>Skip</button>
    </section>
  )
}
