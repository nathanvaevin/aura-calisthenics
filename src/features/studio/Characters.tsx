import { useState } from 'react'
import { Download } from 'lucide-react'
import type { CharacterId } from '@/domain/media'
import { useStore } from '@/data/store'
import { Eyebrow, Segmented } from '@/ui/primitives'
import { performerOf, type Look } from '@/theme/cast'
import { UNIVERSES, UNIVERSE_IDS, type UniverseId } from '@/theme/themes'
import type { PerformerSpec } from '@/visual/player'
import { STYLES } from '@/visual/styles'
import { Toggle } from '@/ui/primitives'
import { Stage } from './shared'

const STATES = [
  { title: 'Base character', note: 'Neutral and clean: the default during a demonstration.' },
  { title: 'Muscle activation', note: 'The working muscles light up. Here: core and quads.' },
  { title: 'Full Aura', note: 'Energy released: after a set, a record, an unlocked skill.' },
]

function triptych(character: CharacterId, universe: UniverseId, theme: string, finish: number): PerformerSpec[] {
  const u = UNIVERSES[universe]
  // The original universe is shown under the default Aura theme; the others under their own first form.
  const form = universe === 'aura' ? { ...u.list[0], aura: theme } : u.list[0]
  const look: Look = { universe, character, form, finish: u.finishes[finish] ?? u.finishes[0], intensity: 1 }
  return [
    performerOf(look, { x: -1.25 }),
    performerOf(look, { muscles: { primary: ['abs', 'quads'], secondary: ['obliques'], stabilizers: [] }, x: 0 }),
    performerOf(look, { aura: 'full', level: 1, x: 1.25 }),
  ]
}

/**
 * The characters of each universe, in the three states everything else is
 * built from. The universes beyond the original are released to athletes
 * here, one switch each.
 */
export function Characters() {
  const [who, setWho] = useState<CharacterId | 'both'>('both')
  const [universe, setUniverse] = useState<UniverseId>('aura')
  const [finish, setFinish] = useState(0)
  const theme = useStore((s) => s.auraSettings.defaultTheme)
  const released = useStore((s) => s.auraSettings.universes)
  const setAuraSettings = useStore((s) => s.setAuraSettings)
  const u = UNIVERSES[universe]
  const build = STYLES[universe].build
  const shown: CharacterId[] = who === 'both' ? ['male', 'female'] : [who]
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {UNIVERSE_IDS.map((id) => (
          <button key={id} className="chip" data-on={universe === id} onClick={() => { setUniverse(id); setFinish(0) }}>
            {UNIVERSES[id].name}{id !== 'aura' && <span className="ml-1 opacity-60">· {released[id] ? 'athletes have it' : 'only you'}</span>}
          </button>
        ))}
      </div>
      {universe !== 'aura' && (
        <div className="card mb-4 flex items-center justify-between gap-4 p-4">
          <span className="text-[14px]">
            Show {u.name} to athletes
            <span className="mt-0.5 block max-w-xl text-[12.5px] leading-relaxed text-ink-3">
              {released[universe]
                ? 'Athletes can choose this theme. Its character performs their demonstrations and stands on their profile.'
                : 'Only you can open this theme. Athletes see it listed as in preparation, and keep the original Aura until you switch this on.'}
            </span>
          </span>
          <Toggle on={!!released[universe]} onChange={(on) => setAuraSettings({ universes: { ...released, [universe]: on } })} label={`Show ${u.name} to athletes`} />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented<CharacterId | 'both'> value={who} onChange={setWho} options={[{ value: 'both', label: 'Both' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
        <div className="flex gap-1.5">{u.finishes.map((f, i) => <button key={f.id} className="chip" data-on={finish === i} onClick={() => setFinish(i)}><span className="h-2.5 w-2.5 rounded-full" style={{ background: f.skin }} />{f.name}</button>)}</div>
      </div>
      <div className="mt-4 space-y-6">
        {shown.map((id) => (
          <section key={id}>
            <Stage cast={triptych(id, universe, theme, finish)} ratio={1.62} controls="review" margin={1.12} label={`The ${id} character in its three states`} />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {STATES.map((s) => (
                <div key={s.title} className="text-center">
                  <div className="font-mono text-[10px] tracking-[0.12em] text-ink uppercase lg:text-[11px]">{s.title}</div>
                  <p className="mx-auto mt-1 max-w-[220px] text-[11.5px] leading-snug text-ink-3 lg:text-[12.5px]">{s.note}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="card mt-7 p-5">
        <Eyebrow className="mb-2">What these are</Eyebrow>
        <p className="max-w-3xl text-[13.5px] leading-relaxed text-ink-2">
          {u.character} Drag to turn them: they are live 3D, not pictures. Each character is a real, rigged 3D model: one mesh with a 34-bone skeleton, every muscle marked on it, clothes as separate pieces. They are generated by code in this project
          (<span className="font-mono text-[12px]">npm run character:build</span>), so both come from one anatomy and stay consistent. The files open in any 3D package.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(['male', 'female'] as const).map((id) => (
            <a key={id} href={`${import.meta.env.BASE_URL}characters/${build}-${id}.glb`} download className="btn btn-outline btn-sm"><Download size={13} /> {build}-{id}.glb</a>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-[12.5px] leading-relaxed text-ink-3">
          Generated, not sculpted by an artist: the anatomy is stylised, the hair is simple, and shoulders and hips lose some shape at the extremes of a movement. A character artist could replace either mesh
          without anything else changing, as long as the skeleton keeps its bone names.
        </p>
      </div>
    </div>
  )
}
