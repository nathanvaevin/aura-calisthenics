import { useMemo, useState } from 'react'
import { MUSCLES } from '@/domain/catalog'
import { Eyebrow, Segmented } from '@/ui/primitives'
import { MUSCLE_COLOUR, type PerformerSpec } from '@/visual/player'
import { MUSCLE_GROUPS, Stage } from './shared'

/** The muscle layer on its own, by group. How one exercise lights it is shown with that exercise, under Exercises. */
export function Muscles() {
  const [group, setGroup] = useState('chest')
  const [back, setBack] = useState(false)
  const preset = MUSCLE_GROUPS.find((g) => g.id === group)!
  const cast = useMemo<PerformerSpec[]>(() => (['male', 'female'] as const).map((character, i) => ({
    character, motion: null, muscles: { primary: preset.primary, secondary: preset.secondary, stabilizers: [] }, glow: MUSCLE_COLOUR,
    aura: { theme: 'cosmic', mode: 'off' }, x: i ? 0.55 : -0.55, facing: back ? 180 : 0,
  })), [preset, back])

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
      <div>
        <Stage cast={cast} ratio={1.05} controls="simple" margin={1.1} label="Muscle activation on both characters" />
        <div className="mt-3"><Segmented<'front' | 'back'> value={back ? 'back' : 'front'} onChange={(v) => setBack(v === 'back')} options={[{ value: 'front', label: 'Front' }, { value: 'back', label: 'Back' }]} /></div>
      </div>
      <div className="mt-6 lg:mt-0">
        <Eyebrow className="mb-2.5">Muscle group</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map((g) => <button key={g.id} className="chip" data-on={group === g.id} onClick={() => setGroup(g.id)}>{g.label}</button>)}
        </div>
        <dl className="mt-5 space-y-2 text-[13px]">
          {([['Primary', preset.primary], ['Secondary', preset.secondary]] as const).map(([label, list]) => (
            <div key={label} className="flex gap-3">
              <dt className="w-[84px] shrink-0 text-ink-3">{label}</dt>
              <dd className="text-ink-2">{list.map((m) => MUSCLES[m].name).join(', ')}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[12.5px] leading-relaxed text-ink-3">
          Primary muscles are fully lit, secondary ones paler. The shapes are the muscles of the model itself, which is why they follow the body and show through the clothing.
          To see how one exercise lights them, open that exercise under Exercises.
        </p>
      </div>
    </div>
  )
}
