import { useState } from 'react'
import { Download } from 'lucide-react'
import type { CharacterId } from '@/domain/media'
import { useStore } from '@/data/store'
import { Eyebrow, Segmented } from '@/ui/primitives'
import { performerOf, type Look } from '@/theme/cast'
import { THEMES, UNIVERSES, UNIVERSE_IDS, type ThemeId, type UniverseId } from '@/theme/themes'
import type { PerformerSpec } from '@/visual/player'
import { STYLES } from '@/visual/styles'
import { PLAIN, isDefaultScene, isSceneReleased, scenesOn, type StageKey } from '@/visual/scenes'
import { Toggle } from '@/ui/primitives'
import { cx } from '@/lib/format'
import { Stage } from './shared'

const STATES = [
  { title: 'Base character', note: 'Neutral and clean: the default during a demonstration.' },
  { title: 'Muscle activation', note: 'The working muscles light up. Here: core and quads.' },
  { title: 'Full Aura', note: 'Energy released: after a set, a record, an unlocked skill.' },
]

/** The stages a universe has: Goku has two, the storm and the paper. */
const STAGES: Record<UniverseId, StageKey[]> = { aura: ['aura'], power: ['power', 'power-light'], iron: ['iron'] }
const STAGE_THEME: Partial<Record<StageKey, ThemeId>> = { 'power-light': 'power-light' }

function triptych(character: CharacterId, universe: UniverseId, theme: string, finish: number, place: { id: string; stage: StageKey } | null): PerformerSpec[] {
  const u = UNIVERSES[universe]
  // The original universe is shown under the default Aura theme; the others under their own first form.
  const form = universe === 'aura' ? { ...u.list[0], aura: theme } : u.list[0]
  const look: Look = { universe, character, form, finish: u.finishes[finish] ?? u.finishes[0], intensity: 1, scene: place?.id, theme: place ? STAGE_THEME[place.stage] : undefined }
  return [
    performerOf(look, { x: -1.25 }),
    performerOf(look, { muscles: { primary: ['abs', 'quads'], secondary: ['obliques'], stabilizers: [] }, x: 0 }),
    performerOf(look, { aura: 'full', level: 1, x: 1.25 }),
  ]
}

/**
 * The characters of each universe, in the three states everything else is
 * built from. The universes beyond the original are with athletes
 * unless switched off here, one switch each.
 */
export function Characters() {
  const [who, setWho] = useState<CharacterId | 'both'>('both')
  const [universe, setUniverse] = useState<UniverseId>('aura')
  const [finish, setFinish] = useState(0)
  /** A place being looked at on the stages below. */
  const [place, setPlace] = useState<{ id: string; stage: StageKey } | null>(null)
  const places = useStore((s) => s.auraSettings.scenes) ?? {}
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
          <button key={id} className="chip" data-on={universe === id} onClick={() => { setUniverse(id); setFinish(0); setPlace(null) }}>
            {UNIVERSES[id].name}{id !== 'aura' && <span className="ml-1 opacity-60">· {released[id] !== false ? 'athletes have it' : 'only you'}</span>}
          </button>
        ))}
      </div>
      {universe !== 'aura' && (
        <div className="card mb-4 flex items-center justify-between gap-4 p-4">
          <span className="text-[14px]">
            Show {u.name} to athletes
            <span className="mt-0.5 block max-w-xl text-[12.5px] leading-relaxed text-ink-3">
              {released[universe] !== false
                ? 'Athletes can choose this theme. Its character performs their demonstrations and stands on their profile.'
                : 'Only you can open this theme. Athletes see it listed as in preparation, and have the original Aura until you switch this on again.'}
            </span>
          </span>
          <Toggle on={released[universe] !== false} onChange={(on) => setAuraSettings({ universes: { ...released, [universe]: on } })} label={`Show ${u.name} to athletes`} />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented<CharacterId | 'both'> value={who} onChange={setWho} options={[{ value: 'both', label: 'Both' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
        <div className="flex gap-1.5">{u.finishes.map((f, i) => <button key={f.id} className="chip" data-on={finish === i} onClick={() => setFinish(i)}><span className="h-2.5 w-2.5 rounded-full" style={{ background: f.skin }} />{f.name}</button>)}</div>
      </div>
      <div className="mt-4 space-y-6">
        {shown.map((id) => (
          <section key={id}>
            <Stage cast={triptych(id, universe, theme, finish, place)} ratio={1.62} controls="review" margin={1.12} label={`The ${id} character in its three states`} />
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

      {/* Places a character can stand in. Each is with athletes unless it is switched off here. */}
      <div className="card mt-7 p-5" data-places>
        <Eyebrow className="mb-1.5">Backgrounds</Eyebrow>
        <p className="max-w-3xl text-[13px] leading-relaxed text-ink-2">Touch one to see it on the stages above. Athletes can choose every one that is on. The default is what everyone starts with and what every assessment is shown in.</p>
        <div className="mt-3 divide-y divide-line">
          {STAGES[universe].flatMap((stage) => [
            { id: '', stage, signature: false, ...PLAIN[stage] },
            ...scenesOn(stage).map((sc) => ({ id: sc.id, stage, signature: !!sc.signature, name: sc.name, line: sc.line, swatch: sc.swatch })),
          ]).map((b) => {
            const looking = b.id ? place?.id === b.id && place.stage === b.stage : !place && b.stage === STAGES[universe][0]
            return (
              <div key={`${b.stage}:${b.id}`} className="flex items-center gap-3 py-2.5">
                <button className="pressable flex min-w-0 flex-1 items-center gap-3 text-left" aria-pressed={looking} data-place={b.id || 'plain'} onClick={() => setPlace(b.id || b.stage !== STAGES[universe][0] ? { id: b.id, stage: b.stage } : null)}>
                  <span className={cx('h-9 w-9 shrink-0 rounded-full border', looking ? 'border-ink' : 'border-line')} style={{ background: `linear-gradient(160deg, ${b.swatch[0]} 35%, ${b.swatch[1]})` }} />
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium">{b.name}{STAGES[universe].length > 1 && <span className="ml-1.5 text-[11.5px] font-normal text-ink-3">{THEMES[b.stage === 'power-light' ? 'power-light' : 'power'].name}</span>}{b.signature && <span className="ml-1.5 text-[11.5px] font-normal text-ink-3">{isDefaultScene(b.id) ? 'Signature, the default' : 'Signature'}</span>}</span>
                    <span className="block truncate text-[12px] text-ink-3">{b.line}</span>
                  </span>
                </button>
                {b.id
                  ? <Toggle on={isSceneReleased(b.id, places)} onChange={(on) => setAuraSettings({ scenes: { ...places, [b.id]: on } })} label={`Show ${b.name} to athletes`} />
                  : <span className="shrink-0 text-[11.5px] text-ink-3">always</span>}
              </div>
            )
          })}
        </div>
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
