import { Check } from 'lucide-react'
import { useStore } from '@/data/store'
import { cx } from '@/lib/format'
import { THEMES, type ThemeId } from '@/theme/themes'
import { toneOf, tonesOf } from '@/theme/tones'

/** The colour of a theme, on this device: touch one and the app is in it. */
export function Tone({ theme, className }: { theme: ThemeId; className?: string }) {
  const chosen = useStore((s) => s.settings.tones)
  const setSettings = useStore((s) => s.setSettings)
  const tone = toneOf(theme, chosen)
  const { universe, scheme } = THEMES[theme]
  return (
    <div className={cx('grid grid-cols-4 gap-1.5 [[data-size=large]_&]:grid-cols-2', className)} role="radiogroup" aria-label="Colour" data-tones>
      {tonesOf(theme).map((t) => {
        const on = t === tone
        return (
          <button
            key={t.id} role="radio" aria-checked={on} data-tone-option={t.id} onClick={() => setSettings({ tones: { ...chosen, [universe]: t.id } })}
            className={cx('pressable flex min-w-0 flex-col items-center gap-2 rounded-[16px] border px-0.5 py-3', on ? 'border-ink bg-surface text-ink' : 'border-line text-ink-2')}
          >
            <span className={cx('flex h-7 w-7 items-center justify-center rounded-full', scheme === 'dark' ? 'text-black/80' : 'text-white')} style={{ background: t.fill[theme] }}>{on && <Check size={14} strokeWidth={3} />}</span>
            <span className="max-w-full truncate text-[11px] font-medium">{t.name}</span>
          </button>
        )
      })}
    </div>
  )
}
