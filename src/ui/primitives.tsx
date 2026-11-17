import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { BadgeCheck, CircleDashed, Eye, Minus, Plus, User, Video, X } from 'lucide-react'
import type { DisciplineId, EvidenceTier } from '@/domain/types'
import { TIER_LABEL } from '@/domain/scoring/config'
import type { RatingStatus } from '@/domain/scoring/mastery'
import { cx, dvar } from '@/lib/format'

export function Eyebrow({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cx('eyebrow', className)} style={style}>
      {children}
    </div>
  )
}

export function PageHeader({ eyebrow, title, right, sub }: { eyebrow?: ReactNode; title: ReactNode; right?: ReactNode; sub?: ReactNode }) {
  return (
    <header className="rise flex items-end justify-between gap-4 pt-7 pb-5 lg:pt-12">
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>}
        <h1 className="display text-[40px] lg:text-[52px]">{title}</h1>
        {sub && <p className="mt-2 max-w-xl text-[14.5px] text-ink-2">{sub}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2 pb-1">{right}</div>}
    </header>
  )
}

export function SectionTitle({ children, action, className }: { children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('mb-3 flex items-center justify-between gap-3', className)}>
      <Eyebrow>{children}</Eyebrow>
      {action}
    </div>
  )
}

export function TextLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="text-[12.5px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
      {children}
    </button>
  )
}

const TIER_ICON: Record<EvidenceTier, typeof User> = { estimated: CircleDashed, self: User, observed: Eye, coach: BadgeCheck, video: Video }

/** How we know. Estimated and self-reported evidence is never dressed up as verified. */
export function TierTag({ tier, compact }: { tier: EvidenceTier; compact?: boolean }) {
  const Icon = TIER_ICON[tier]
  const verified = tier === 'coach' || tier === 'video'
  return (
    <span
      title={TIER_LABEL[tier]}
      className={cx(
        'inline-flex items-center gap-1 rounded-full font-mono text-[9.5px] font-medium uppercase tracking-[0.1em] whitespace-nowrap',
        compact ? 'h-5 w-5 justify-center' : 'h-[22px] px-2',
        verified ? 'bg-good/15 text-good' : tier === 'observed' ? 'border border-good/40 text-good' : tier === 'estimated' ? 'border border-dashed border-line-strong text-ink-3' : 'border border-line text-ink-2',
      )}
    >
      <Icon size={11} strokeWidth={2.2} />
      {!compact && TIER_LABEL[tier]}
    </span>
  )
}

const STATUS_COPY: Record<RatingStatus, string> = {
  unrated: 'Unrated',
  estimated: 'Estimated',
  self: 'Self-reported',
  observed: 'Coach-observed',
  verified: 'Verified',
}

export function StatusTag({ status, provisional }: { status: RatingStatus; provisional?: boolean }) {
  const tier: EvidenceTier | null = status === 'verified' ? 'coach' : status === 'observed' ? 'observed' : status === 'self' ? 'self' : status === 'estimated' ? 'estimated' : null
  const Icon = tier ? TIER_ICON[tier] : CircleDashed
  return (
    <span
      className={cx(
        'inline-flex h-[22px] items-center gap-1 rounded-full px-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.1em] whitespace-nowrap',
        status === 'verified' ? 'bg-good/15 text-good' : status === 'observed' ? 'border border-good/40 text-good' : status === 'self' ? 'border border-line text-ink-2' : 'border border-dashed border-line-strong text-ink-3',
      )}
    >
      <Icon size={11} strokeWidth={2.2} />
      {provisional && status !== 'unrated' ? 'Provisional' : STATUS_COPY[status]}
    </span>
  )
}

export function DisciplineDot({ id, size = 8 }: { id: DisciplineId; size?: number }) {
  return <span className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, background: dvar(id) }} />
}

export function Bar({ value, color = 'var(--text)', height = 3, className }: { value: number; color?: string; height?: number; className?: string }) {
  return (
    <div className={cx('w-full overflow-hidden rounded-full bg-surface-3', className)} style={{ height }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color, transition: 'width 0.9s var(--ease-out-soft)' }}
      />
    </div>
  )
}

export function Ring({
  value, size = 56, stroke = 3, color = 'var(--text)', track = 'var(--surface-3)', children,
}: { value: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${c * v} ${c}`} style={{ transition: 'stroke-dasharray 0.6s var(--ease-out-soft)' }}
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  )
}

export function Sparkline({ points, width = 120, height = 36, color = 'var(--text)' }: { points: number[]; width?: number; height?: number; color?: string }) {
  if (points.length < 2) return null
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const xy = points.map((p, i) => [(i / (points.length - 1)) * (width - 6) + 3, height - 4 - ((p - min) / span) * (height - 8)] as const)
  const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lx, ly] = xy[xy.length - 1]
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={`${d} L${lx} ${height} L3 ${height} Z`} fill={color} opacity="0.07" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="2.6" fill={color} />
    </svg>
  )
}

export function Segmented<T extends string>({ options, value, onChange, className }: { options: { value: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={cx('inline-flex rounded-full border border-line bg-surface p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            'h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors',
            value === o.value ? 'bg-ink text-bg' : 'text-ink-2 hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Stepper({ value, onChange, min = 0, max = 999, step = 1, suffix, size = 'md' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; suffix?: string; size?: 'md' | 'lg' }) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v))
  const big = size === 'lg'
  const btn = cx('pressable flex items-center justify-center rounded-full border border-line bg-surface text-ink hover:bg-surface-2', big ? 'h-14 w-14' : 'h-9 w-9')
  return (
    <div className={cx('inline-flex items-center', big ? 'gap-5' : 'gap-2.5')}>
      <button className={btn} onClick={() => onChange(clamp(value - step))} aria-label="Decrease">
        <Minus size={big ? 20 : 15} />
      </button>
      <span className={cx('num text-center', big ? 'display min-w-[110px] text-[76px]' : 'min-w-[52px] text-[15px] font-medium')}>
        {value}
        {suffix && <span className={cx('text-ink-3', big ? 'ml-1 font-sans text-[18px]' : 'ml-0.5 text-[12px]')}>{suffix}</span>}
      </span>
      <button className={btn} onClick={() => onChange(clamp(value + step))} aria-label="Increase">
        <Plus size={big ? 20 : 15} />
      </button>
    </div>
  )
}

export function Sheet({ open, onClose, title, eyebrow, children, wide }: { open: boolean; onClose: () => void; title?: ReactNode; eyebrow?: ReactNode; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
          <motion.div
            className="absolute inset-0 bg-black/55"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog" aria-modal="true"
            className={cx(
              'relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-line bg-bg-2 shadow-(--shadow-pop) lg:rounded-[28px]',
              wide ? 'lg:max-w-3xl' : 'lg:max-w-xl',
            )}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 340, mass: 0.9 }}
          >
            <div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-line-strong lg:hidden" />
            <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-4 pb-3 lg:px-7 lg:pt-6">
              <div className="min-w-0">
                {eyebrow && <Eyebrow className="mb-1.5">{eyebrow}</Eyebrow>}
                {title && <h2 className="display text-[28px]">{title}</h2>}
              </div>
              <button onClick={onClose} aria-label="Close" className="pressable -mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-2 hover:text-ink">
                <X size={17} />
              </button>
            </div>
            <div className="safe-bottom min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 lg:px-7 lg:pb-7">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card-quiet flex flex-col items-center px-6 py-10 text-center">
      <div className="display text-[24px]">{title}</div>
      {children && <p className="mt-2 max-w-sm text-[14px] text-ink-2">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={cx('relative h-[28px] w-[48px] shrink-0 rounded-full transition-colors', on ? 'bg-ink' : 'bg-surface-3')}
    >
      <span className={cx('absolute top-[3px] h-[22px] w-[22px] rounded-full bg-bg transition-all', on ? 'left-[23px]' : 'left-[3px]')} />
    </button>
  )
}
