import { useMemo, useState } from 'react'
import { AlertTriangle, ClipboardCopy, Plus } from 'lucide-react'
import { ASSET_STATUSES, CORRECTION_TAGS, STATUS_LABEL, canMove, historyOf, reviewQueue, type AssetStatus, type CameraAngle, type CharacterId, type DemoAsset } from '@/domain/media'
import { exerciseById } from '@/domain/catalog'
import { useStore } from '@/data/store'
import { Empty, Eyebrow, Segmented, Sheet, Toggle } from '@/ui/primitives'
import type { AuraMode } from '@/visual/aura/director'
import { THEMES } from '@/visual/aura/themes'
import { MOTIONS, motionAt } from '@/visual/motions'
import { PILOT_EXERCISES, PILOT_PURPOSE, stageRatio } from '@/visual/pilot'
import { MUSCLE_COLOUR, type PerformerSpec } from '@/visual/player'
import { cx } from '@/lib/format'
import { DISCIPLINE_GLOW, Field, Stage, StatusPill, useWide } from './shared'


const when = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

/** The movement an asset shows is current only if nobody has changed the movement since. */
export const isCurrent = (a: DemoAsset) => !!a.animation && MOTIONS[a.animation.motion]?.revision === (a.animation.revision ?? 1)

function specOf(a: DemoAsset, character: CharacterId, opts: { muscles: boolean; aura: AuraMode; theme: string; glow: string }): PerformerSpec {
  return {
    character, motion: a.animation!.motion, revision: a.animation!.revision, muscles: opts.muscles ? 'exercise' : null, glow: opts.glow,
    aura: { theme: opts.theme, mode: opts.aura },
  }
}

/** Generated animations: nothing here reaches an athlete until it has been approved and then published. */
export function Review() {
  const demos = useStore((s) => s.demos)
  const settings = useStore((s) => s.auraSettings)
  const createDemo = useStore((s) => s.createDemo)
  const animations = useMemo(() => demos.filter((d) => d.kind === 'animation' && d.animation), [demos])
  const [filter, setFilter] = useState<AssetStatus | 'all'>('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const counts = reviewQueue(animations)
  const wide = useWide()
  const asset = animations.find((a) => a.id === selected) ?? null

  const generate = (exerciseId: string, character: CharacterId, camera?: CameraAngle) => {
    const m = MOTIONS[exerciseId]
    return createDemo({
      exerciseId, kind: 'animation', slot: character, title: `${exerciseById[exerciseId].name} · ${character}`,
      animation: { character, motion: exerciseId, revision: m.revision, camera: camera ?? m.camera, theme: null },
    })
  }
  const generatePilot = () => {
    for (const id of PILOT_EXERCISES) for (const c of ['male', 'female'] as const) {
      if (!useStore.getState().demos.some((d) => d.exerciseId === id && d.kind === 'animation' && d.slot === c)) generate(id, c)
    }
  }

  const order = [...PILOT_EXERCISES, ...Object.keys(MOTIONS).filter((id) => !(PILOT_EXERCISES as readonly string[]).includes(id))]
  const rows = order.map((id) => ({
    id,
    latest: (['male', 'female'] as const).map((c) => historyOf(animations, id, 'animation', c)[0]).filter(Boolean) as DemoAsset[],
  })).filter((r) => r.latest.length && (filter === 'all' || r.latest.some((a) => a.status === filter)))

  if (animations.length === 0) {
    return (
      <Empty title="Nothing generated yet" action={<button className="btn btn-primary" onClick={generatePilot}>Generate the pilot</button>}>
        The pilot is ten exercises, each performed by both characters: twenty animations. They arrive here as pending, and stay out of athletes' sight until you approve and publish them.
      </Empty>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="chip" data-on={filter === 'all'} onClick={() => setFilter('all')}>All · {animations.length}</button>
        {ASSET_STATUSES.filter((s) => counts[s] > 0).map((s) => (
          <button key={s} className="chip" data-on={filter === s} onClick={() => setFilter(s)}>{STATUS_LABEL[s]} · {counts[s]}</button>
        ))}
        <button
          className="btn btn-quiet btn-sm ml-auto"
          onClick={() => {
            // Everything decided so far, as plain text: to hand to whoever corrects the movements.
            const lines = order.flatMap((id) => (['male', 'female'] as const).flatMap((c) => historyOf(animations, id, 'animation', c).slice(0, 1).map((a) =>
              `${exerciseById[id].name} · ${c} · v${a.version} · ${STATUS_LABEL[a.status]}${a.notes.map((n) => `\n   - ${n.tags.length ? `[${n.tags.join(', ')}] ` : ''}${n.text}`).join('')}`)))
            void navigator.clipboard?.writeText(`Aura animation review, ${new Date().toLocaleDateString()}\n\n${lines.join('\n')}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
          }}
        >
          <ClipboardCopy size={13} /> {copied ? 'Copied' : 'Copy my review'}
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => setGenerating(true)}><Plus size={14} /> Generate</button>
      </div>

      <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="card divide-y divide-line">
          {rows.map((r) => (
            <div key={r.id} className="p-3.5">
              <div className="text-[14.5px] font-medium">{exerciseById[r.id].name}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.latest.map((a) => (
                  <button key={a.id} onClick={() => setSelected(a.id)} className={cx('flex items-center gap-2 rounded-full border py-1 pr-1 pl-2.5 text-[12px] capitalize transition-colors', selected === a.id ? 'border-ink bg-surface-2' : 'border-line hover:border-line-strong')}>
                    {a.slot} <span className="text-ink-3">v{a.version}</span>
                    <StatusPill status={a.status}>{STATUS_LABEL[a.status]}</StatusPill>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="p-5 text-[13px] text-ink-3">Nothing with that status.</p>}
        </div>

        {wide && (
          <div className="sticky top-8">
            {asset ? <Detail key={asset.id} asset={asset} all={animations} defaultTheme={settings.defaultTheme} onSelect={setSelected} />
              : <div className="card-quiet px-6 py-14 text-center text-[13.5px] text-ink-3">Choose an animation to review it.</div>}
          </div>
        )}
      </div>
      {/* On a phone the review opens over the list. */}
      {!wide && (
        <Sheet open={!!asset} onClose={() => setSelected(null)}>
          {asset && <Detail key={asset.id} asset={asset} all={animations} defaultTheme={settings.defaultTheme} onSelect={setSelected} />}
        </Sheet>
      )}

      <GenerateSheet open={generating} onClose={() => setGenerating(false)} onGenerate={(e, c, cam) => { setSelected(generate(e, c, cam)); setGenerating(false) }} />
    </div>
  )
}

function Detail({ asset, all, defaultTheme, onSelect }: { asset: DemoAsset; all: DemoAsset[]; defaultTheme: string; onSelect: (id: string) => void }) {
  const moveDemo = useStore((s) => s.moveDemo)
  const noteDemo = useStore((s) => s.noteDemo)
  const reviseDemo = useStore((s) => s.reviseDemo)
  const patchDemo = useStore((s) => s.patchDemo)
  const removeDemo = useStore((s) => s.removeDemo)
  const [muscles, setMuscles] = useState(true)
  const [aura, setAura] = useState<AuraMode>('off')
  const [theme, setTheme] = useState(defaultTheme)
  const [tint, setTint] = useState<'aura' | 'discipline'>('aura')
  const [compare, setCompare] = useState<'none' | 'character' | 'previous'>('none')
  const [correcting, setCorrecting] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [text, setText] = useState('')

  const recipe = asset.animation!
  const ex = exerciseById[asset.exerciseId]
  const motion = motionAt(recipe.motion, recipe.revision)
  const current = isCurrent(asset)
  const history = historyOf(all, asset.exerciseId, 'animation', asset.slot)
  const previous = history.find((h) => h.version < asset.version)
  const previousPlayable = !!previous && !!motionAt(previous.animation!.motion, previous.animation!.revision)
  const other: CharacterId = recipe.character === 'male' ? 'female' : 'male'
  const opts = { muscles, aura, theme, glow: tint === 'discipline' ? DISCIPLINE_GLOW[ex.discipline] : MUSCLE_COLOUR }
  const ratio = stageRatio(asset.exerciseId)
  const margin = aura === 'off' ? 1.16 : 1.4
  const can = (to: AssetStatus) => canMove(asset.status, to)

  const newVersion = () => {
    const id = reviseDemo(asset.id)
    if (!id) return
    // A new version shows the movement as it is now.
    patchDemo(id, { animation: { ...recipe, revision: MOTIONS[recipe.motion]?.revision ?? recipe.revision } })
    onSelect(id)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="display text-[28px] leading-tight">{ex.name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-3">
            <span className="capitalize">{recipe.character} character</span>· version {asset.version}
            <StatusPill status={asset.status}>{STATUS_LABEL[asset.status]}</StatusPill>
          </div>
        </div>
      </div>

      {!motion && (
        <div className="mt-3 flex gap-2.5 rounded-2xl border border-warn/30 bg-warn/8 p-3.5 text-[13px] text-ink-2"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />This version shows a movement that is no longer in the app, so it cannot be played. Make a new version to review the movement as it is now.</div>
      )}
      {motion && !current && (
        <div className="mt-3 flex gap-2.5 rounded-2xl border border-warn/30 bg-warn/8 p-3.5 text-[13px] text-ink-2"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />The movement has been changed since this version was made. Athletes are not shown it. Make a new version to review the current movement.</div>
      )}

      {motion && (
        <div className={cx('mt-4 grid gap-3', compare !== 'none' && 'sm:grid-cols-2')}>
          <div>
            <Stage cast={[specOf(asset, recipe.character, opts)]} ratio={compare === 'none' ? ratio : Math.min(ratio, 1)} controls="review" margin={margin} label={`${ex.name}, ${recipe.character}`} />
            {compare !== 'none' && <div className="mt-1.5 text-center font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">This version · {recipe.character}</div>}
          </div>
          {compare === 'character' && (
            <div>
              <Stage cast={[specOf(asset, other, opts)]} ratio={Math.min(ratio, 1)} controls="review" margin={margin} label={`${ex.name}, ${other}`} />
              <div className="mt-1.5 text-center font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">Same movement · {other}</div>
            </div>
          )}
          {compare === 'previous' && previous && previousPlayable && (
            <div>
              <Stage cast={[specOf(previous, recipe.character, opts)]} ratio={Math.min(ratio, 1)} controls="review" margin={margin} label={`${ex.name}, version ${previous.version}`} />
              <div className="mt-1.5 text-center font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">Version {previous.version}</div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 text-[13px]"><span className="text-ink-2">Muscle activation</span><Toggle on={muscles} onChange={setMuscles} label="Muscle activation" /></div>
        <Segmented<'aura' | 'discipline'> value={tint} onChange={setTint} options={[{ value: 'aura', label: 'Aura pink' }, { value: 'discipline', label: 'Discipline colour' }]} />
        <Segmented<AuraMode> value={aura} onChange={setAura} options={[{ value: 'off', label: 'No Aura' }, { value: 'living', label: 'Living' }, { value: 'full', label: 'Full' }]} />
        <select className="field !h-10 text-[13px]" value={theme} onChange={(e) => setTheme(e.target.value)} disabled={aura === 'off'} aria-label="Aura theme">
          {THEMES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <Segmented<'none' | 'character' | 'previous'> className="sm:col-span-2" value={compare} onChange={setCompare} options={[
          { value: 'none', label: 'One view' }, { value: 'character', label: `Beside the ${other} character` },
          ...(previous ? [{ value: 'previous' as const, label: `Beside version ${previous.version}` }] : []),
        ]} />
      </div>
      {compare === 'previous' && previous && !previousPlayable && <p className="mt-2 text-[12.5px] text-ink-3">Version {previous.version} showed an earlier movement that has since been removed from the app, so it can no longer be played.</p>}

      {motion && (
        <div className="mt-5 rounded-[22px] bg-surface p-4">
          <Eyebrow>What correct looks like</Eyebrow>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{motion.standard}</p>
          {ex.standard && <p className="mt-2 text-[12.5px] leading-relaxed text-ink-3">In the library: {ex.standard}</p>}
          {asset.exerciseId in PILOT_PURPOSE && <p className="mt-2 text-[12.5px] leading-relaxed text-ink-3">In the pilot to test: {PILOT_PURPOSE[asset.exerciseId as keyof typeof PILOT_PURPOSE].toLowerCase()}.</p>}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {can('approved') && asset.status !== 'published' && <button className="btn btn-primary btn-sm" disabled={!current} onClick={() => moveDemo(asset.id, 'approved')}>Approve</button>}
        {can('published') && <button className="btn btn-accent btn-sm" disabled={!current} onClick={() => moveDemo(asset.id, 'published')}>Publish to athletes</button>}
        {asset.status === 'published' && <button className="btn btn-outline btn-sm" onClick={() => moveDemo(asset.id, 'approved')}>Take down</button>}
        {can('needs_correction') && <button className="btn btn-outline btn-sm" onClick={() => setCorrecting(true)}>Needs correction</button>}
        {asset.status === 'needs_correction' && <button className="btn btn-primary btn-sm" onClick={newVersion}>Make a new version</button>}
        {asset.status !== 'needs_correction' && !current && <button className="btn btn-primary btn-sm" onClick={newVersion}>Make a new version</button>}
        {asset.status === 'draft' && <button className="btn btn-primary btn-sm" onClick={() => moveDemo(asset.id, 'pending')}>Send to review</button>}
        {asset.status === 'archived' && <button className="btn btn-outline btn-sm" onClick={() => moveDemo(asset.id, 'draft')}>Restore as draft</button>}
        {can('archived') && <button className="btn btn-quiet btn-sm" onClick={() => moveDemo(asset.id, 'archived')}>Archive</button>}
        {(asset.status === 'draft' || asset.status === 'archived') && <button className="btn btn-quiet btn-sm" onClick={() => { removeDemo(asset.id); onSelect('') }}>Delete</button>}
      </div>
      {asset.status === 'published' && <p className="mt-2 text-[12.5px] text-ink-3">Athletes see this on the exercise's page. Publishing another version of the same character replaces it.</p>}

      {correcting && (
        <div className="card mt-4 p-4">
          <Eyebrow className="mb-2.5">What needs correcting</Eyebrow>
          <div className="flex flex-wrap gap-1.5">
            {CORRECTION_TAGS.map((t) => <button key={t} className="chip" data-on={tags.includes(t)} onClick={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}>{t}</button>)}
          </div>
          <textarea className="field mt-3" rows={3} placeholder="For example: the elbows flare too wide at the bottom" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="mt-3 flex gap-2">
            <button className="btn btn-primary btn-sm" disabled={!text.trim() && !tags.length} onClick={() => { noteDemo(asset.id, { tags, text }); moveDemo(asset.id, 'needs_correction'); setCorrecting(false); setTags([]); setText('') }}>Save and send back</button>
            <button className="btn btn-quiet btn-sm" onClick={() => setCorrecting(false)}>Cancel</button>
          </div>
        </div>
      )}

      {asset.notes.length > 0 && (
        <section className="mt-6">
          <Eyebrow className="mb-2.5">Correction notes</Eyebrow>
          <ul className="space-y-2.5">
            {asset.notes.map((n) => (
              <li key={n.id} className="rounded-2xl border border-line p-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {n.tags.map((t) => <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[9.5px] tracking-[0.06em] text-ink-2 uppercase">{t}</span>)}
                  <span className="ml-auto text-[11.5px] text-ink-3">{when(n.at)}</span>
                </div>
                {n.text && <p className="mt-2 text-[13.5px] leading-relaxed">{n.text}</p>}
              </li>
            ))}
          </ul>
          {asset.replaces && <p className="mt-2 text-[12px] text-ink-3">Notes written on earlier versions are carried over, so whoever corrects the movement sees everything that was asked.</p>}
        </section>
      )}

      {history.length > 1 && (
        <section className="mt-6">
          <Eyebrow className="mb-2.5">Versions</Eyebrow>
          <div className="card divide-y divide-line">
            {history.map((h) => (
              <button key={h.id} onClick={() => onSelect(h.id)} className={cx('flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-[13px]', h.id === asset.id && 'bg-surface-2')}>
                <span className="font-medium">Version {h.version}</span>
                <span className="text-ink-3">{when(h.createdAt)}</span>
                <span className="ml-auto"><StatusPill status={h.status}>{STATUS_LABEL[h.status]}</StatusPill></span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function GenerateSheet({ open, onClose, onGenerate }: { open: boolean; onClose: () => void; onGenerate: (exerciseId: string, character: CharacterId, camera: CameraAngle) => void }) {
  const ids = Object.keys(MOTIONS)
  const [exercise, setExercise] = useState(ids[0])
  const [character, setCharacter] = useState<CharacterId>('male')
  const [camera, setCamera] = useState<CameraAngle | 'best'>('best')
  return (
    <Sheet open={open} onClose={onClose} title="Generate an animation" eyebrow="Step 1 of the review">
      <div className="space-y-4">
        <Field label="Exercise" hint={`Only exercises whose movement has been written can be generated: ${ids.length} so far.`}>
          <select className="field" value={exercise} onChange={(e) => setExercise(e.target.value)}>{ids.map((id) => <option key={id} value={id}>{exerciseById[id].name}</option>)}</select>
        </Field>
        <Field label="Character"><Segmented<CharacterId> value={character} onChange={setCharacter} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} /></Field>
        <Field label="Opening camera angle">
          <Segmented<CameraAngle | 'best'> value={camera} onChange={setCamera} options={[{ value: 'best', label: 'Best for it' }, { value: 'front', label: 'Front' }, { value: 'three-quarter', label: '¾' }, { value: 'side', label: 'Side' }, { value: 'back', label: 'Back' }]} />
        </Field>
        <p className="text-[12.5px] leading-relaxed text-ink-3">A new version is added to that exercise and character and waits for review. Muscle activation comes from the exercise library; the Aura theme is chosen where the animation is shown, not baked into it.</p>
        <button className="btn btn-primary w-full" onClick={() => onGenerate(exercise, character, camera === 'best' ? MOTIONS[exercise].camera : camera)}>Generate</button>
      </div>
    </Sheet>
  )
}
