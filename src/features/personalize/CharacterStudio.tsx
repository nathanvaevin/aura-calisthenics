import { useMemo, useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { exerciseById } from '@/domain/catalog'
import { useIsAdmin } from '@/data/hooks'
import { useStore } from '@/data/store'
import { MUSCLE_GLOW, performerOf, type Look } from '@/theme/cast'
import { MIN_INTENSITY, formsFor, personalOf, type CharacterId } from '@/theme/personal'
import { THEMES, UNIVERSES, finishOf, formOf, type ThemeId } from '@/theme/themes'
import { useStanding, useWearing } from '@/theme/useTheme'
import { Eyebrow, Segmented, Toggle } from '@/ui/primitives'
import { Stage3D } from '@/ui/Stage3D'
import { isCurrentRevision } from '@/visual/revisions'
import { PLAIN, sceneFor, scenesOn, stageKeyOf } from '@/visual/scenes'
import { cx } from '@/lib/format'

type Preview = 'base' | 'muscles' | 'aura'

const PREVIEW_MUSCLES = { primary: ['chest', 'abs', 'quads'] as const, secondary: ['delts', 'obliques', 'biceps'] as const, stabilizers: [] as const }

/**
 * The athlete's own Studio: which of the two characters is theirs, the Aura
 * form it wears, how strongly, and its finish. Everything is saved as it is
 * chosen. It previews; it does not generate, review or publish anything.
 * This file brings the movements with it: load it lazily.
 *
 * `theme` shows the Studio for a theme being tried in the Personalize flow
 * before it has been chosen.
 */
export function CharacterStudio({ theme }: { theme?: ThemeId }) {
  const admin = useIsAdmin()
  const style = useStore((s) => (s.meId ? s.athletes[s.meId]?.style : undefined))
  const setStyle = useStore((s) => s.setStyle)
  const demos = useStore((s) => s.demos)
  const standing = useStanding()
  const worn = useWearing()
  const personal = personalOf({ style })

  const universe = theme ? THEMES[theme].universe : worn.universe
  const u = UNIVERSES[universe]
  const character: CharacterId = personal.character ?? 'male'
  const forms = formsFor(universe, standing, admin)
  const saved = forms.find((f) => f.form.id === personal.forms[universe] && f.unlocked) ?? forms[0]

  // The place the character stands in: chosen for each stage, on this device, from what has been released.
  const stage = stageKeyOf(universe, THEMES[theme ?? worn.theme].variant)
  const chosen = useStore((s) => s.settings.scenes)
  const releasedPlaces = useStore((s) => s.auraSettings.scenes) ?? {}
  const setSettings = useStore((s) => s.setSettings)
  const places = scenesOn(stage).filter((p) => admin || releasedPlaces[p.id])
  const place = sceneFor(stage, chosen?.[stage], releasedPlaces, admin)
  const backgrounds = [{ id: '', signature: false, ...PLAIN[stage] }, ...places]

  const [preview, setPreview] = useState<Preview>('aura')
  /** A form being looked at. A locked one can be seen here, and is never saved. */
  const [trying, setTrying] = useState<string | null>(null)
  const [moving, setMoving] = useState<string | null>(null)
  const shown = forms.find((f) => f.form.id === trying) ?? saved

  const look: Look = { theme: theme ?? worn.theme, universe, character, form: formOf(universe, shown.form.id), finish: finishOf(universe, personal.finishes[universe]), intensity: personal.intensity / 100, scene: place }

  // Only what the owner has approved moves here: the published demonstrations of this character.
  const moves = useMemo(
    () => demos.filter((d) => d.kind === 'animation' && d.status === 'published' && d.slot === character && d.animation && isCurrentRevision(d.animation.motion, d.animation.revision)).slice(0, 8),
    [demos, character],
  )
  const move = moves.find((m) => m.exerciseId === moving)?.animation

  const cast = [performerOf(look, {
    motion: move?.motion ?? null, revision: move?.revision,
    muscles: preview === 'muscles' ? (move ? 'exercise' : { primary: [...PREVIEW_MUSCLES.primary], secondary: [...PREVIEW_MUSCLES.secondary], stabilizers: [] }) : null,
    aura: preview === 'aura' ? (move ? 'living' : 'full') : 'off',
  })]

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-start lg:gap-10">
      <div className="lg:sticky lg:top-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Segmented<Preview> value={preview} onChange={setPreview} options={[{ value: 'base', label: 'Base' }, { value: 'muscles', label: 'Muscles' }, { value: 'aura', label: `Full ${u.forms === 'Aura' ? 'Aura' : 'power'}` }]} />
          {moves.length > 0 && (
            <select className="field !h-9 !w-auto max-w-[190px] text-[13px]" value={moving ?? ''} onChange={(e) => setMoving(e.target.value || null)} aria-label="See your character move">
              <option value="">Standing</option>
              {moves.map((m) => <option key={m.id} value={m.exerciseId}>{exerciseById[m.exerciseId]?.name ?? m.exerciseId}</option>)}
            </select>
          )}
        </div>
        {/* Who it is and how strongly it glows are chosen in the frame the character stands in; its forms come straight under it. */}
        {/* The frame is tall, and the character is kept in the part of it the controls leave free (`safe`), so nothing stands in front of it. */}
        <div className="relative mx-auto h-[min(70dvh,580px)] w-full overflow-hidden rounded-card border border-line lg:h-[min(74dvh,700px)]" data-studio-frame>
          <Stage3D
            cast={cast} fill safe={{ top: 64, bottom: 124 }} controls="spin" activate="large" margin={preview === 'aura' ? 1.2 : 1.06}
            label={`Your character, ${shown.form.name}`}
          />
          <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-center">
            <Segmented<CharacterId> className="pointer-events-auto shadow-(--shadow-pop)" value={character} onChange={(c) => setStyle({ character: c }, 'character')} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
          </div>
          <label className="absolute inset-x-3 bottom-[68px] flex items-center gap-3 rounded-full bg-black/45 px-4 py-2.5 text-white backdrop-blur-md" data-intensity>
            <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase">Intensity</span>
            <input
              type="range" min={MIN_INTENSITY} max={100} step={5} value={personal.intensity} aria-label="Aura intensity"
              onChange={(e) => { setStyle({ intensity: Number(e.target.value) }); setPreview('aura') }}
              className="h-1.5 min-w-0 flex-1 cursor-pointer" style={{ accentColor: shown.form.colour }}
            />
            <span className="num w-9 text-right text-[12px]">{personal.intensity}%</span>
          </label>
        </div>
      </div>

      <div className="mt-4 space-y-7 lg:mt-0">
        <section>
          <Eyebrow className="mb-2.5">{u.forms === 'Aura' ? 'Your Aura' : `Your ${u.forms.toLowerCase()}`}</Eyebrow>
          <div className="grid grid-cols-2 gap-2">
            {forms.map(({ form, unlocked, progress, need }) => {
              const on = saved.form.id === form.id
              const looking = shown.form.id === form.id
              return (
                <button
                  key={form.id} aria-pressed={on}
                  onClick={() => { if (unlocked) { setStyle({ forms: { [universe]: form.id } }, 'character'); setTrying(null) } else setTrying(form.id); setPreview('aura') }}
                  className={cx('pressable relative overflow-hidden rounded-card border p-3 text-left', looking ? 'border-ink bg-surface-2' : 'border-line bg-surface hover:border-line-strong')}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: form.colour, boxShadow: `0 0 14px ${form.colour}` }} />
                    <span className="display min-w-0 flex-1 truncate text-[19px] leading-tight">{form.name}</span>
                    {on ? <Check size={14} className="shrink-0" /> : !unlocked ? <Lock size={12} className="shrink-0 text-ink-3" /> : null}
                  </span>
                  <span className="mt-1.5 block text-[11.5px] leading-snug text-ink-3">{unlocked ? form.line : need}</span>
                  {!unlocked && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-surface-3"><span className="block h-full" style={{ width: `${Math.round(progress * 100)}%`, background: form.colour }} /></span>}
                </button>
              )
            })}
          </div>
          {trying && shown !== saved && (
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-2">
              You are looking at <span className="font-medium text-ink">{shown.form.name}</span>. It becomes yours when you {shown.need.charAt(0).toLowerCase() + shown.need.slice(1)}.{' '}
              <button className="underline decoration-line-strong underline-offset-4" onClick={() => setTrying(null)}>Back to {saved.form.name}</button>
            </p>
          )}
          {admin && <p className="mt-2.5 text-[12px] text-ink-3">As an administrator you can wear every one. Athletes earn them.</p>}
        </section>

        {places.length > 0 && (
          <section data-places>
            <Eyebrow className="mb-2.5">Background</Eyebrow>
            <div className="grid grid-cols-2 gap-2">
              {backgrounds.map((b) => {
                const on = (place ?? '') === b.id
                return (
                  <button
                    key={b.id || 'plain'} aria-pressed={on} data-place={b.id || 'plain'}
                    onClick={() => setSettings({ scenes: { ...chosen, [stage]: b.id || undefined } })}
                    className={cx('pressable flex items-center gap-2.5 rounded-card border p-2.5 text-left', on ? 'border-ink bg-surface-2' : 'border-line bg-surface hover:border-line-strong')}
                  >
                    <span className="h-8 w-8 shrink-0 rounded-full border border-line" style={{ background: `linear-gradient(160deg, ${b.swatch[0]} 35%, ${b.swatch[1]})` }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{b.name}</span>
                      {b.signature && <span className="block text-[11px] text-ink-3">Signature</span>}
                    </span>
                    {on && <Check size={14} className="shrink-0" />}
                  </button>
                )
              })}
            </div>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-2">{(backgrounds.find((b) => b.id === (place ?? '')) ?? backgrounds[0]).line} It is behind your character wherever it demonstrates an exercise, on this device.</p>
            {admin && <p className="mt-1.5 text-[12px] text-ink-3">You see every one. Athletes see those you switch on in Studio → Characters.</p>}
          </section>
        )}

        <section>
          <Eyebrow className="mb-2.5">Finish</Eyebrow>
          <div className="flex gap-2">
            {u.finishes.map((f) => {
              const on = look.finish.id === f.id
              return (
                <button key={f.id} aria-pressed={on} onClick={() => setStyle({ finishes: { [universe]: f.id } }, 'character')} className={cx('pressable flex flex-1 items-center gap-2.5 rounded-card border p-2.5 text-left', on ? 'border-ink bg-surface-2' : 'border-line bg-surface')}>
                  <span className="relative h-8 w-8 shrink-0 rounded-full" style={{ background: f.skin }}>
                    <span className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface" style={{ background: universe === 'aura' ? f.hair : f.accent }} />
                  </span>
                  <span className="text-[13px] font-medium">{f.name}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="card flex items-center justify-between gap-3 px-4 py-3.5">
          <span className="text-[14px]">Working muscles<span className="block text-[12px] leading-snug text-ink-3">Light them up when your character demonstrates an exercise</span></span>
          <span className="flex items-center gap-2.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: MUSCLE_GLOW[universe] }} /><Toggle on={personal.muscles} onChange={(muscles) => setStyle({ muscles })} label="Show working muscles" /></span>
        </section>
      </div>
    </div>
  )
}
