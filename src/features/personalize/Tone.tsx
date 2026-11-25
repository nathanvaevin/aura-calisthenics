import { Check } from 'lucide-react'
import { useStore } from '@/data/store'
import { cx } from '@/lib/format'
import { DEFAULT_TONE, TONES } from '@/theme/tones'
import { useScheme } from '@/theme/useTheme'

/** The colour of the Aura themes, on this device: touch one and the app is in it. Shown only where an Aura theme is. */
export function Tone({ className }: { className?: string }) {
  const tone = useStore((s) => s.settings.tone) ?? DEFAULT_TONE
  const setSettings = useStore((s) => s.setSettings)
  const scheme = useScheme()
  return (
    <div className={cx('grid grid-cols-4 gap-1.5 [[data-size=large]_&]:grid-cols-2', className)} role="radiogroup" aria-label="Colour" data-tones>
      {TONES.map((t) => {
        const on = t.id === tone
        return (
          <button
            key={t.id} role="radio" aria-checked={on} data-tone-option={t.id} onClick={() => setSettings({ tone: t.id })}
            className={cx('pressable flex min-w-0 flex-col items-center gap-2 rounded-[16px] border px-0.5 py-3', on ? 'border-ink bg-surface text-ink' : 'border-line text-ink-2')}
          >
            <span className={cx('flex h-7 w-7 items-center justify-center rounded-full', scheme === 'dark' ? 'text-black/80' : 'text-white')} style={{ background: t[scheme] }}>{on && <Check size={14} strokeWidth={3} />}</span>
            <span className="max-w-full truncate text-[11px] font-medium">{t.name}</span>
          </button>
        )
      })}
    </div>
  )
}
