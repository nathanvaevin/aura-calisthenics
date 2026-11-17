import { useMemo, useState } from 'react'
import { EXERCISES, MUSCLES, exerciseById } from '@/domain/catalog'
import { Eyebrow, Segmented } from '@/ui/primitives'
import { MUSCLE_COLOUR, type PerformerSpec } from '@/visual/player'
import { DISCIPLINE_GLOW, MUSCLE_GROUPS, Stage } from './shared'

/** The muscle layer on its own: by group, or as any exercise in the library would light it. */
export function Muscles() {
  const [group, setGroup] = useState('chest')
  const [exercise, setExercise] = useState('')
  const [back, setBack] = useState(false)
  const [tint, setTint] = useState<'aura' | 'discipline'>('aura')
  const ex = exercise ? exerciseById[exercise] : null
  const preset = MUSCLE_GROUPS.find((g) => g.id === group)!
  const roles = ex ? { primary: ex.primary, secondary: ex.secondary, stabilizers: ex.stabilizers } : { primary: preset.primary, secondary: preset.secondary, stabilizers: [] }
  const glow = tint === 'discipline' && ex ? DISCIPLINE_GLOW[ex.discipline] : MUSCLE_COLOUR
  const cast = useMemo<PerformerSpec[]>(() => (['male', 'female'] as const).map((character, i) => ({
    character, motion: null, muscles: roles, glow, aura: { theme: 'cosmic', mode: 'off' }, x: i ? 0.55 : -0.55, facing: back ? 180 : 0,
  })), [JSON.stringify(roles), glow, back]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
      <div>
        <Stage cast={cast} ratio={1.05} controls="review" margin={1.1} label="Muscle activation on both characters" />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Segmented<'front' | 'back'> value={back ? 'back' : 'front'} onChange={(v) => setBack(v === 'back')} options={[{ value: 'front', label: 'Front' }, { value: 'back', label: 'Back' }]} />
          <Segmented<'aura' | 'discipline'> value={tint} onChange={setTint} options={[{ value: 'aura', label: 'Aura pink' }, { value: 'discipline', label: "The exercise's colour" }]} />
        </div>
      </div>
      <div className="mt-6 lg:mt-0">
        <Eyebrow className="mb-2.5">By muscle group</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map((g) => (
            <button key={g.id} className="chip" data-on={!ex && group === g.id} onClick={() => { setGroup(g.id); setExercise('') }}>{g.label}</button>
          ))}
        </div>
        <Eyebrow className="mt-6 mb-2.5">Or as an exercise lights them</Eyebrow>
        <select className="field" value={exercise} onChange={(e) => setExercise(e.target.value)}>
          <option value="">Choose an exercise…</option>
          {EXERCISES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <dl className="mt-5 space-y-2 text-[13px]">
          {([['Primary', roles.primary], ['Secondary', roles.secondary], ['Stabilisers', roles.stabilizers]] as const).filter(([, l]) => l.length).map(([label, list]) => (
            <div key={label} className="flex gap-3">
              <dt className="w-[84px] shrink-0 text-ink-3">{label}</dt>
              <dd className="text-ink-2">{list.map((m) => MUSCLES[m].name).join(', ')}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[12.5px] leading-relaxed text-ink-3">
          Which muscles an exercise uses comes from the exercise library, not from this screen: all {EXERCISES.length} exercises already have their muscles named, so every one of them can be shown this way.
          Primary muscles are fully lit, secondary ones paler, stabilisers faintest. The shapes are the muscles of the model itself, which is why they follow the body and show through the clothing.
        </p>
      </div>
    </div>
  )
}
