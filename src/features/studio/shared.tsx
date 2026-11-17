import { useEffect, useState } from 'react'
import type { DisciplineId, MuscleId } from '@/domain/types'
import type { AssetStatus } from '@/domain/media'
import { cx } from '@/lib/format'

/** The 3D stage, loaded when first needed. */
export { Stage3D as Stage } from '@/ui/Stage3D'

/** Whether there is room for two columns. */
export function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const q = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(q.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])
  return wide
}

/** The six discipline colours as fixed values: the stage is always dark, whatever the app's theme. */
export const DISCIPLINE_GLOW: Record<DisciplineId, string> = {
  handstand: '#f2c46b', pull: '#78aeff', push: '#ff8463', core: '#b79dff', legs: '#b5db68', mobility: '#56d6bc',
}

export const MUSCLE_GROUPS: { id: string; label: string; primary: MuscleId[]; secondary: MuscleId[] }[] = [
  { id: 'chest', label: 'Chest and triceps', primary: ['chest', 'triceps'], secondary: ['delts', 'serratus'] },
  { id: 'back', label: 'Back and biceps', primary: ['lats', 'mid_back', 'biceps'], secondary: ['rear_delts', 'forearms', 'traps'] },
  { id: 'core', label: 'Core', primary: ['abs', 'obliques'], secondary: ['serratus', 'hip_flexors', 'lower_back'] },
  { id: 'legs', label: 'Legs', primary: ['quads', 'glutes', 'hamstrings'], secondary: ['calves', 'adductors'] },
  { id: 'shoulders', label: 'Shoulders', primary: ['delts', 'rear_delts'], secondary: ['traps', 'triceps'] },
]

const STATUS_STYLE: Record<AssetStatus, string> = {
  draft: 'border-line text-ink-3',
  pending: 'border-accent/50 text-accent',
  approved: 'border-[#56d6bc]/50 text-[#56d6bc]',
  published: 'border-transparent bg-ink text-bg',
  needs_correction: 'border-warn/50 text-warn',
  archived: 'border-line text-ink-3 line-through',
}

export function StatusPill({ status, children }: { status: AssetStatus; children: React.ReactNode }) {
  return <span className={cx('inline-flex h-[22px] items-center rounded-full border px-2 font-mono text-[9.5px] tracking-[0.08em] whitespace-nowrap uppercase', STATUS_STYLE[status])}>{children}</span>
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[11.5px] leading-relaxed text-ink-3">{hint}</span>}
    </label>
  )
}

export function Slider({ label, value, onChange, min, max, step, format }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; format: (v: number) => string }) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[12.5px]"><span className="text-ink-2">{label}</span><span className="num text-ink">{format(value)}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-(--text)" />
    </label>
  )
}
