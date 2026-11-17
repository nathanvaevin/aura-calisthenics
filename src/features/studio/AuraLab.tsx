import { useEffect, useRef, useState } from 'react'
import { Check, Sparkles, Star } from 'lucide-react'
import type { CharacterId } from '@/domain/media'
import { exerciseById } from '@/domain/catalog'
import { useStore } from '@/data/store'
import { Eyebrow, Segmented, Toggle } from '@/ui/primitives'
import { COMPONENTS, COMPONENT_LABEL, THEMES, themeById, type ThemeTuning } from '@/visual/aura/themes'
import type { DemoHandle } from '@/visual/Demo'
import type { PerformerSpec } from '@/visual/player'
import { PILOT_EXERCISES } from '@/visual/pilot'
import { cx } from '@/lib/format'
import { Slider, Stage } from './shared'

/**
 * Aura themes: look at one, turn its dial, change its rhythm, switch parts of
 * it off, and decide whether it is approved. Theme and intensity are separate
 * things: every theme runs the whole way from nothing to a full release.
 */
export function AuraLab() {
  const settings = useStore((s) => s.auraSettings)
  const save = useStore((s) => s.setAuraSettings)
  const [themeId, setThemeId] = useState(settings.defaultTheme)
  const [character, setCharacter] = useState<CharacterId>('male')
  const [during, setDuring] = useState('')
  const [level, setLevel] = useState(0.7)
  const [compare, setCompare] = useState<string[]>(['cosmic', 'solar', 'electric'])
  const saved = settings.themes[themeId]
  const [tuning, setTuning] = useState<ThemeTuning>({})
  const stage = useRef<DemoHandle>(null)
  const theme = themeById[themeId]

  // Each theme opens with the adjustments saved for it.
  useEffect(() => {
    const t = useStore.getState().auraSettings.themes[themeId]
    setTuning({ intensity: t?.intensity ?? 1, pulse: t?.pulse ?? 1, density: t?.density ?? 1, off: t?.off ?? [] })
  }, [themeId])

  const cast: PerformerSpec[] = [{
    character, motion: during || null, muscles: during ? 'exercise' : null,
    aura: { theme: themeId, mode: during ? 'living' : 'full', level: during ? undefined : level, tuning },
  }]
  const unsaved = JSON.stringify({ intensity: saved?.intensity ?? 1, pulse: saved?.pulse ?? 1, density: saved?.density ?? 1, off: saved?.off ?? [] }) !== JSON.stringify(tuning)
  const put = (patch: Partial<NonNullable<typeof saved>>) => save({ themes: { ...settings.themes, [themeId]: { ...(saved ?? { status: 'experimental' as const }), ...patch } } })
  const off = tuning.off ?? []

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
        {THEMES.map((t) => {
          const status = settings.themes[t.id]?.status ?? 'experimental'
          return (
            <button key={t.id} onClick={() => setThemeId(t.id)} className={cx('flex shrink-0 items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-2 text-[13px] transition-colors', themeId === t.id ? 'border-ink bg-surface-2 text-ink' : 'border-line text-ink-2 hover:text-ink')}>
              <span className="flex">{t.palette.slice(0, 4).map((c, i) => <span key={i} className="-ml-1 h-4 w-4 rounded-full border border-bg first:ml-0" style={{ background: c }} />)}</span>
              {t.name}
              {settings.defaultTheme === t.id && <Star size={11} fill="currentColor" className="text-accent" />}
              {status === 'approved' && <Check size={12} className="text-[#56d6bc]" />}
            </button>
          )
        })}
      </div>

      <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
        <div>
          <Stage cast={cast} ratio={during ? 1.1 : 0.86} controls="review" margin={during ? 1.3 : 1.5} handle={stage} label={`${theme.name} Aura`} />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Segmented<CharacterId> value={character} onChange={setCharacter} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
            <button className="btn btn-outline btn-sm" onClick={() => stage.current?.release()}><Sparkles size={13} /> Release</button>
          </div>
        </div>

        <div className="mt-6 space-y-6 lg:mt-0">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="display text-[30px]">{theme.name}</h2>
              <span className="font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">{saved?.status === 'approved' ? 'Approved' : 'Experimental'}{settings.defaultTheme === themeId ? ' · default' : ''}</span>
            </div>
            <p className="mt-1 text-[13.5px] text-ink-2">{theme.blurb}</p>
          </div>

          <div>
            <Eyebrow className="mb-2.5">Show it</Eyebrow>
            <select className="field" value={during} onChange={(e) => setDuring(e.target.value)}>
              <option value="">Standing, at a level I choose</option>
              {PILOT_EXERCISES.map((id) => <option key={id} value={id}>During: {exerciseById[id].name}</option>)}
            </select>
            {during
              ? <p className="mt-2 text-[12.5px] leading-relaxed text-ink-3">The Aura follows the set: it stays low while the muscles are the point, builds with the effort, and releases when the set ends. Then it settles and the set starts again.</p>
              : <div className="mt-3"><Slider label="Intensity" value={level} onChange={setLevel} min={0} max={1} step={0.01} format={(v) => `${Math.round(v * 100)}%`} /></div>}
          </div>

          <div className="space-y-3.5">
            <Eyebrow>Adjust this theme</Eyebrow>
            <Slider label="Strength" value={tuning.intensity ?? 1} onChange={(v) => setTuning({ ...tuning, intensity: v })} min={0.3} max={1} step={0.01} format={(v) => `${Math.round(v * 100)}%`} />
            <Slider label="Pulse speed" value={tuning.pulse ?? 1} onChange={(v) => setTuning({ ...tuning, pulse: v })} min={0.4} max={2} step={0.05} format={(v) => `${v.toFixed(2)}×`} />
            <Slider label="Particle density" value={tuning.density ?? 1} onChange={(v) => setTuning({ ...tuning, density: v })} min={0.2} max={1.5} step={0.05} format={(v) => `${Math.round(v * 100)}%`} />
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 pt-1 sm:grid-cols-2">
              {COMPONENTS.filter((c) => theme[c].level > 0).map((c) => (
                <div key={c} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="text-ink-2">{COMPONENT_LABEL[c]}</span>
                  <Toggle on={!off.includes(c)} label={COMPONENT_LABEL[c]} onChange={(on) => setTuning({ ...tuning, off: on ? off.filter((x) => x !== c) : [...off, c] })} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-line pt-5">
            <button className="btn btn-primary btn-sm" disabled={!unsaved} onClick={() => put(tuning)}>{unsaved ? 'Save adjustments' : 'Adjustments saved'}</button>
            <button className="btn btn-outline btn-sm" onClick={() => put({ status: saved?.status === 'approved' ? 'experimental' : 'approved' })}>{saved?.status === 'approved' ? 'Back to experimental' : 'Approve theme'}</button>
            <button className="btn btn-outline btn-sm" disabled={settings.defaultTheme === themeId} onClick={() => save({ defaultTheme: themeId })}>Make default</button>
          </div>
          <p className="text-[12px] leading-relaxed text-ink-3">The default theme is what the Full Aura state uses wherever no other theme is asked for. Experimental themes stay in this lab. Giving a theme to a challenge or an event is not built yet.</p>
        </div>
      </div>

      <section className="mt-10">
        <Eyebrow className="mb-2.5">Side by side, at {Math.round(level * 100)}%</Eyebrow>
        <div className="mb-3 flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button key={t.id} className="chip" data-on={compare.includes(t.id)} onClick={() => setCompare(compare.includes(t.id) ? compare.filter((x) => x !== t.id) : [...compare, t.id].slice(-3))}>{t.name}</button>
          ))}
        </div>
        {compare.length > 0 && (
          <Stage
            cast={compare.map((id, i) => ({ character, motion: null, muscles: null, aura: { theme: id, mode: 'full', level, tuning: settings.themes[id] }, x: (i - (compare.length - 1) / 2) * 1.9 }))}
            ratio={compare.length === 1 ? 1 : compare.length === 2 ? 1.5 : 2.1} controls="review" margin={1.3} label="Themes side by side"
          />
        )}
        <div className="mt-2 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.max(1, compare.length)}, minmax(0, 1fr))` }}>
          {compare.map((id) => <div key={id} className="text-center font-mono text-[10px] tracking-[0.12em] text-ink-2 uppercase">{themeById[id].name}</div>)}
        </div>
      </section>
    </div>
  )
}
