import { useStore } from '@/data/store'
import { cx } from '@/lib/format'

const OPTIONS = [
  { id: undefined, name: 'standard', label: 'Standard', sample: 17 },
  { id: 'large', name: 'large', label: 'Larger', sample: 22 },
] as const

/**
 * The size of text and controls on this device: as designed, or a little
 * larger. It is not part of a theme and it does not follow the account: a
 * phone and a laptop may each want their own.
 */
export function TextSize({ className }: { className?: string }) {
  const size = useStore((s) => s.settings.size)
  const setSettings = useStore((s) => s.setSettings)
  return (
    <div className={cx('grid grid-cols-2 gap-2', className)} role="radiogroup" aria-label="Text size">
      {OPTIONS.map((o) => {
        const on = size === o.id
        return (
          <button
            key={o.name} role="radio" aria-checked={on} data-size-option={o.name} onClick={() => setSettings({ size: o.id })}
            className={cx('pressable flex h-[54px] items-center justify-center gap-2.5 rounded-[16px] border', on ? 'border-ink bg-surface text-ink' : 'border-line text-ink-2')}
          >
            {/* The sample is drawn at a fixed size, so the two can be compared whichever is on. */}
            <span className="display leading-none" style={{ fontSize: o.sample }}>Aa</span>
            <span className="text-[13.5px] font-medium">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
