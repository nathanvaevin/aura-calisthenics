import { useMemo, useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { exerciseById } from '@/domain/catalog'
import { useIsAdmin } from '@/data/hooks'
import { useStore } from '@/data/store'
import { MUSCLE_GLOW, performerOf, type Look } from '@/theme/cast'
import { formsFor, personalOf, type CharacterId } from '@/theme/personal'
import { THEMES, UNIVERSES, finishOf, formOf, type ThemeId } from '@/theme/themes'
import { useStanding, useWearing } from '@/theme/useTheme'
import { Eyebrow, Segmented, Toggle } from '@/ui/primitives'
import { Stage3D } from '@/ui/Stage3D'
import { isCurrentRevision } from '@/visual/revisions'
import { MOTIONS } from '@/visual/motions'
import { STAGE_RATIO } from '@/visual/motions/types'
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

  const [preview, setPreview] = useState<Preview>('aura')
  /** A form being looked at. A locked one can be seen here, and is never saved. */
  const [trying, setTrying] = useState<string | null>(null)
  const [moving, setMoving] = useState<string | null>(null)
  const shown = forms.find((f) => f.form.id === trying) ?? saved

  const look: Look = { universe, character, form: formOf(universe, shown.form.id), finish: finishOf(universe, personal.finishes[universe]), intensity: personal.intensity / 100 }

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
        <Stage3D
          cast={cast} ratio={move ? STAGE_RATIO[MOTIONS[move.motion]?.stage ?? 'square'] : 0.9} controls="simple" margin={preview === 'aura' ? 1.36 : 1.12}
          className="mx-auto max-h-[52dvh] lg:max-h-[66dvh]" label={`Your character, ${shown.form.name}`}
        />
      </div>

      <div className="mt-7 space-y-7 lg:mt-0">
        <section>
          <Eyebrow className="mb-2.5">Character</Eyebrow>
          <Segmented<CharacterId> className="w-full [&>button]:flex-1" value={character} onChange={(c) => setStyle({ character: c }, 'character')} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-3">{u.character} It is the one you see on your profile and performing your exercises.</p>
        </section>

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

        <section>
          <label className="block">
            <span className="mb-2 flex items-center justify-between"><Eyebrow>Intensity</Eyebrow><span className="num text-[12.5px] text-ink-2">{personal.intensity}%</span></span>
            <input
              type="range" min={10} max={100} step={5} value={personal.intensity} aria-label="Aura intensity"
              onChange={(e) => { setStyle({ intensity: Number(e.target.value) }); setPreview('aura') }}
              className="h-1.5 w-full cursor-pointer" style={{ accentColor: shown.form.colour }}
            />
          </label>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-3">How much of it your character carries when it is released: a quiet outline, or everything.</p>
        </section>

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
