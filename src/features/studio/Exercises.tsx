import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, Check, ClipboardCopy, Search, Send } from 'lucide-react'
import { CORRECTION_TAGS, STATUS_LABEL, canBeOfficial, canMove, historyOf, type AssetStatus, type CharacterId, type DemoAsset } from '@/domain/media'
import { EXERCISES, MUSCLES, disciplineById, exerciseById } from '@/domain/catalog'
import type { Exercise } from '@/domain/types'
import { useStore } from '@/data/store'
import { Eyebrow, Segmented, Sheet, Toggle } from '@/ui/primitives'
import { MOTIONS, motionAt } from '@/visual/motions'
import { STAGE_RATIO } from '@/visual/motions/types'
import { MUSCLE_COLOUR, type PerformerSpec } from '@/visual/player'
import { cx, dvar } from '@/lib/format'
import { Stage, StatusPill, useWide } from './shared'

const CHARACTERS = ['male', 'female'] as const
const when = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

/** The movement an asset shows is current only if nobody has changed the movement since. */
export const isCurrent = (a: DemoAsset) => !!a.animation && MOTIONS[a.animation.motion]?.revision === (a.animation.revision ?? 1)

/**
 * Where an exercise stands, as the owner sees it:
 * none: no movement has been written, so there is nothing to approve ·
 * waiting: a movement is there and at least one character has not been sent ·
 * correction: sent back with notes · live: both characters are with athletes.
 */
export type ExerciseState = 'waiting' | 'correction' | 'live' | 'none'

const latestOf = (animations: DemoAsset[], exerciseId: string, character: CharacterId) => historyOf(animations, exerciseId, 'animation', character)[0] as DemoAsset | undefined
const isLive = (a: DemoAsset | undefined) => !!a && a.status === 'published' && isCurrent(a)

export function stateOf(animations: DemoAsset[], exerciseId: string): ExerciseState {
  if (!MOTIONS[exerciseId]) return 'none'
  const latest = CHARACTERS.map((c) => latestOf(animations, exerciseId, c))
  if (latest.every(isLive)) return 'live'
  if (latest.some((a) => a?.status === 'needs_correction')) return 'correction'
  return 'waiting'
}

/** How many exercises are waiting for the owner. Shown on the tab. */
export const waitingCount = (demos: DemoAsset[]) => {
  const animations = demos.filter((d) => d.kind === 'animation' && d.animation)
  return EXERCISES.filter((e) => stateOf(animations, e.id) === 'waiting').length
}

const STATE_LABEL: Record<ExerciseState, string> = { waiting: 'Waiting for you', correction: 'Needs correction', live: 'Live', none: 'No animation yet' }
const STATE_STYLE: Record<ExerciseState, string> = {
  waiting: 'border-accent/50 text-accent', correction: 'border-warn/50 text-warn', live: 'border-transparent bg-ink text-bg', none: 'border-line text-ink-3',
}

function StatePill({ state }: { state: ExerciseState }) {
  return <span className={cx('inline-flex h-[22px] shrink-0 items-center gap-1 rounded-full border px-2 font-mono text-[9.5px] tracking-[0.08em] whitespace-nowrap uppercase', STATE_STYLE[state])}>{state === 'live' && <Check size={10} />}{STATE_LABEL[state]}</span>
}

type Filter = ExerciseState | 'all'

/**
 * Every exercise in the library, and the one place its demonstration is
 * approved. Open an exercise to watch it on both characters; "Approve and
 * send" makes it the official demonstration wherever the exercise appears.
 * Nothing reaches an athlete before that tap.
 */
export function Exercises() {
  const demos = useStore((s) => s.demos)
  const animations = useMemo(() => demos.filter((d) => d.kind === 'animation' && d.animation), [demos])
  const states = useMemo(() => Object.fromEntries(EXERCISES.map((e) => [e.id, stateOf(animations, e.id)])) as Record<string, ExerciseState>, [animations])
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { waiting: 0, correction: 0, live: 0, none: 0, all: EXERCISES.length }
    for (const e of EXERCISES) c[states[e.id]]++
    return c
  }, [states])
  // Open on what is waiting for a decision.
  const [filter, setFilter] = useState<Filter>(() => (EXERCISES.some((e) => stateOf(useStore.getState().demos.filter((d) => d.kind === 'animation' && d.animation), e.id) === 'waiting') ? 'waiting' : 'all'))
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const wide = useWide()

  const q = query.trim().toLowerCase()
  const rows = EXERCISES.filter((e) => (filter === 'all' || states[e.id] === filter) && (!q || e.name.toLowerCase().includes(q) || disciplineById[e.discipline].name.toLowerCase().includes(q)))
  const ex = open ? exerciseById[open] : null

  /** After a decision, the next exercise still waiting: so a review is a run of single taps. */
  const next = (after: string) => {
    const at = EXERCISES.findIndex((e) => e.id === after)
    const order = [...EXERCISES.slice(at + 1), ...EXERCISES.slice(0, at)]
    const fresh = useStore.getState().demos.filter((d) => d.kind === 'animation' && d.animation)
    return order.find((e) => stateOf(fresh, e.id) === 'waiting')?.id ?? null
  }

  const copyReview = () => {
    // Everything decided so far, as plain text: to hand to whoever corrects the movements.
    const lines = EXERCISES.filter((e) => MOTIONS[e.id]).flatMap((e) => CHARACTERS.flatMap((c) => {
      const a = latestOf(animations, e.id, c)
      return a ? [`${e.name} · ${c} · v${a.version} · ${STATUS_LABEL[a.status]}${a.notes.map((n) => `\n   - ${n.tags.length ? `[${n.tags.join(', ')}] ` : ''}${n.text}`).join('')}`] : [`${e.name} · ${c} · not looked at yet`]
    }))
    void navigator.clipboard?.writeText(`Aura animation review, ${new Date().toLocaleDateString()}\n\n${lines.join('\n')}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const detail = ex && <ExerciseView key={ex.id} ex={ex} animations={animations} onNext={() => { const id = next(ex.id); if (id) setOpen(id) }} />

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {(['waiting', 'correction', 'live', 'none', 'all'] as const).filter((f) => f === 'all' || f === 'waiting' || counts[f] > 0).map((f) => (
          <button key={f} className="chip" data-on={filter === f} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : STATE_LABEL[f]} · {counts[f]}</button>
        ))}
        <button className="btn btn-quiet btn-sm ml-auto" onClick={copyReview}><ClipboardCopy size={13} /> {copied ? 'Copied' : 'Copy my review'}</button>
      </div>

      <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div>
          <label className="relative mb-3 block">
            <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3" />
            <input className="field !pl-10" placeholder="Find an exercise" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find an exercise" />
          </label>
          <div className="card divide-y divide-line lg:max-h-[calc(100dvh-270px)] lg:overflow-y-auto">
            {rows.map((e) => (
              <button
                key={e.id} data-exercise={e.id} data-state={states[e.id]} onClick={() => setOpen(e.id)}
                className={cx('flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors', open === e.id ? 'bg-surface-2' : 'hover:bg-surface-2/60')}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: dvar(e.discipline) }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium">{e.name}</span>
                  <span className="block truncate text-[11.5px] text-ink-3">{disciplineById[e.discipline].name}</span>
                </span>
                <StatePill state={states[e.id]} />
              </button>
            ))}
            {rows.length === 0 && (
              <p className="p-5 text-[13px] leading-relaxed text-ink-3">
                {q ? 'No exercise by that name here.' : filter === 'waiting' ? 'Nothing is waiting for you. Every exercise that has a movement is live or has been sent back.' : 'Nothing here.'}
              </p>
            )}
          </div>
        </div>

        {wide && (
          <div className="sticky top-8">
            {detail || <div className="card-quiet px-6 py-14 text-center text-[13.5px] leading-relaxed text-ink-3">Choose an exercise to watch it.<br />Approve and send puts it in front of athletes; nothing gets there any other way.</div>}
          </div>
        )}
      </div>
      {/* On a phone the exercise opens over the list. */}
      {!wide && <Sheet open={!!ex} onClose={() => setOpen(null)}>{detail}</Sheet>}
    </div>
  )
}

/** One exercise: its movement on either character, and what to do about it. */
function ExerciseView({ ex, animations, onNext }: { ex: Exercise; animations: DemoAsset[]; onNext: () => void }) {
  const createDemo = useStore((s) => s.createDemo)
  const [character, setCharacter] = useState<CharacterId>('male')
  /** An earlier version being looked at, instead of the latest. */
  const [versionId, setVersionId] = useState<string | null>(null)
  const motion = MOTIONS[ex.id]

  // A movement that has never been put up for review is put up when it is first opened:
  // a version waiting for a decision, which no athlete sees. One that was put up, never
  // decided, and has been corrected since is put up again as it now is; the earlier
  // version stays in the list of versions.
  useEffect(() => {
    if (!motion) return
    for (const c of CHARACTERS) {
      const state = useStore.getState()
      const latest = historyOf(state.demos.filter((d) => d.kind === 'animation' && d.animation), ex.id, 'animation', c)[0] as DemoAsset | undefined
      if (!latest) {
        createDemo({ exerciseId: ex.id, kind: 'animation', slot: c, title: `${ex.name} · ${c}`, animation: { character: c, motion: ex.id, revision: motion.revision, camera: motion.camera, theme: null } })
      } else if (latest.status === 'pending' && !isCurrent(latest)) {
        const id = state.reviseDemo(latest.id)
        if (id) state.patchDemo(id, { animation: { ...latest.animation!, revision: motion.revision } })
      }
    }
  }, [ex.id, ex.name, motion, createDemo])

  const header = (
    <div>
      <div className="flex items-center gap-2 text-[12px] text-ink-3"><span className="h-2 w-2 rounded-full" style={{ background: dvar(ex.discipline) }} />{disciplineById[ex.discipline].name}</div>
      <h2 className="display mt-1 text-[30px] leading-tight">{ex.name}</h2>
    </div>
  )

  if (!motion) return <NoAnimation ex={ex} header={header} />

  const latest = { male: latestOf(animations, ex.id, 'male'), female: latestOf(animations, ex.id, 'female') }
  const asset = (versionId && animations.find((a) => a.id === versionId)) || latest[character]
  return (
    <div>
      {header}
      <Segmented<CharacterId>
        className="mt-4 w-full [&>button]:flex-1" value={character} onChange={(c) => { setCharacter(c); setVersionId(null) }}
        options={CHARACTERS.map((c) => ({ value: c, label: <span className="flex items-center justify-center gap-2 capitalize">{c}{isLive(latest[c]) && <Check size={13} />}</span> }))}
      />
      {asset
        ? <Version key={asset.id} asset={asset} ex={ex} all={animations} other={latest[character === 'male' ? 'female' : 'male']} onVersion={setVersionId} onNext={onNext} />
        : <div className="card-quiet mt-4 px-6 py-12 text-center text-[13px] text-ink-3">Preparing…</div>}
    </div>
  )
}

/** An exercise nobody has written a movement for: its muscles can be shown, and there is nothing to approve. */
function NoAnimation({ ex, header }: { ex: Exercise; header: React.ReactNode }) {
  const [back, setBack] = useState(false)
  const cast = useMemo<PerformerSpec[]>(() => CHARACTERS.map((character, i) => ({
    character, motion: null, muscles: { primary: ex.primary, secondary: ex.secondary, stabilizers: ex.stabilizers }, glow: MUSCLE_COLOUR,
    aura: { theme: 'cosmic', mode: 'off' }, x: i ? 0.55 : -0.55, facing: back ? 180 : 0,
  })), [ex, back])
  return (
    <div>
      {header}
      <div className="mt-3 flex gap-2.5 rounded-2xl border border-line p-3.5 text-[13px] leading-relaxed text-ink-2">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-ink-3" />
        No movement has been written for this exercise yet, so there is nothing to approve. Athletes see it in the library without an animation. Below are the muscles it works, as the library names them.
      </div>
      <div className="mt-4"><Stage cast={cast} ratio={1.05} controls="simple" margin={1.1} label={`Muscles worked by ${ex.name}`} /></div>
      <div className="mt-3"><Segmented<'front' | 'back'> value={back ? 'back' : 'front'} onChange={(v) => setBack(v === 'back')} options={[{ value: 'front', label: 'Front' }, { value: 'back', label: 'Back' }]} /></div>
      <MuscleList ex={ex} />
    </div>
  )
}

function MuscleList({ ex }: { ex: Exercise }) {
  return (
    <dl className="mt-4 space-y-1.5 text-[13px]">
      {([['Primary', ex.primary], ['Secondary', ex.secondary], ['Stabilisers', ex.stabilizers]] as const).filter(([, l]) => l.length).map(([label, list]) => (
        <div key={label} className="flex gap-3">
          <dt className="w-[84px] shrink-0 text-ink-3">{label}</dt>
          <dd className="text-ink-2">{list.map((m) => MUSCLES[m].name).join(', ')}</dd>
        </div>
      ))}
    </dl>
  )
}

function specOf(a: DemoAsset, character: CharacterId, muscles: boolean): PerformerSpec {
  return { character, motion: a.animation!.motion, revision: a.animation!.revision, muscles: muscles ? 'exercise' : null, glow: MUSCLE_COLOUR, aura: { theme: 'cosmic', mode: 'off' } }
}

/** One version of one character's demonstration: watch it, then approve and send, or send it back. */
function Version({ asset, ex, all, other, onVersion, onNext }: { asset: DemoAsset; ex: Exercise; all: DemoAsset[]; other: DemoAsset | undefined; onVersion: (id: string | null) => void; onNext: () => void }) {
  const moveDemo = useStore((s) => s.moveDemo)
  const approveDemo = useStore((s) => s.approveDemo)
  const noteDemo = useStore((s) => s.noteDemo)
  const reviseDemo = useStore((s) => s.reviseDemo)
  const patchDemo = useStore((s) => s.patchDemo)
  const removeDemo = useStore((s) => s.removeDemo)
  const [muscles, setMuscles] = useState(true)
  const [both, setBoth] = useState(false)
  const [correcting, setCorrecting] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [text, setText] = useState('')

  const recipe = asset.animation!
  const motion = motionAt(recipe.motion, recipe.revision)
  const current = isCurrent(asset)
  const history = historyOf(all, asset.exerciseId, 'animation', asset.slot)
  const otherCharacter: CharacterId = recipe.character === 'male' ? 'female' : 'male'
  /** The same exercise on the other character, when it can be sent in the same tap. */
  const otherReady = other && canBeOfficial(other.status) && other.status !== 'archived' && isCurrent(other) ? other : null
  const sendable = canBeOfficial(asset.status) && current
  const ratio = STAGE_RATIO[motion?.stage ?? 'square']
  const can = (to: AssetStatus) => canMove(asset.status, to)

  const newVersion = () => {
    const id = reviseDemo(asset.id)
    if (!id) return
    // A new version shows the movement as it is now.
    patchDemo(id, { animation: { ...recipe, revision: MOTIONS[recipe.motion]?.revision ?? recipe.revision } })
    onVersion(null)
  }

  return (
    <div>
      {/* The decision, always in the same place: above what is being watched. */}
      <div className="mt-3 rounded-card border border-line bg-surface p-3.5" data-decision>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-3">
          <StatusPill status={asset.status}>{asset.status === 'pending' ? 'Waiting for you' : asset.status === 'published' ? 'Live' : STATUS_LABEL[asset.status]}</StatusPill>
          {history.length > 1 && <span>version {asset.version} of {history.length}</span>}
        </div>
        {sendable && (
          <>
            <div className="flex flex-wrap gap-2">
              {otherReady ? (
                <>
                  <button className="btn btn-primary btn-sm" onClick={() => { approveDemo(asset.id); approveDemo(otherReady.id); onNext() }}><Send size={14} /> Approve and send both</button>
                  <button className="btn btn-outline btn-sm" onClick={() => approveDemo(asset.id)}>Only the {recipe.character}</button>
                </>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => { approveDemo(asset.id); if (isLive(other)) onNext() }}><Send size={14} /> {asset.status === 'archived' ? 'Send again' : 'Approve and send'}</button>
              )}
              {can('needs_correction') && <button className="btn btn-quiet btn-sm" onClick={() => setCorrecting(true)}>Needs correction</button>}
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed text-ink-3">
              Sending makes this the official demonstration of {ex.name}: athletes see it in the library, the skill tree, workouts and assessments.{otherReady ? ' Both sends the male and the female character together.' : ''}
            </p>
          </>
        )}
        {asset.status === 'published' && current && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 text-[14px] font-medium"><Check size={16} /> Live for athletes</span>
              <button className="btn btn-outline btn-sm ml-auto" onClick={() => moveDemo(asset.id, 'approved')}>Take down</button>
              <button className="btn btn-quiet btn-sm" onClick={onNext}>Next waiting <ArrowRight size={13} /></button>
            </div>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-3">Athletes see this wherever {ex.name} appears. Sending another version of the same character replaces it everywhere; this one stays in the history.</p>
          </>
        )}
        {asset.status === 'needs_correction' && (
          <>
            <button className="btn btn-primary" onClick={newVersion}>Make a new version</button>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-3">Sent back with the notes below. Athletes do not see it. Once the movement has been corrected, a new version shows it as it then is.</p>
          </>
        )}
        {asset.status !== 'needs_correction' && !current && <button className="btn btn-primary" onClick={newVersion}>Make a new version</button>}
        {asset.status === 'approved' && current && <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-3">Taken down: athletes do not see it. Approve and send puts it back.</p>}
        {asset.status === 'draft' && <button className="btn btn-outline" onClick={() => moveDemo(asset.id, 'pending')}>Put up for a decision</button>}
      </div>

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

      {!motion && (
        <div className="mt-3 flex gap-2.5 rounded-2xl border border-warn/30 bg-warn/8 p-3.5 text-[13px] text-ink-2"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />This version shows a movement that is no longer in the app, so it cannot be played. Make a new version to see the movement as it is now.</div>
      )}
      {motion && !current && (
        <div className="mt-3 flex gap-2.5 rounded-2xl border border-warn/30 bg-warn/8 p-3.5 text-[13px] text-ink-2"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />The movement has been changed since this version was made, so athletes are not shown it. Make a new version to see the current movement.</div>
      )}

      {motion && (
        <div className={cx('mt-3 grid gap-3', both && 'sm:grid-cols-2')}>
          <div>
            <Stage cast={[specOf(asset, recipe.character, muscles)]} ratio={both ? Math.min(ratio, 1) : ratio} controls="review" margin={1.16} label={`${ex.name}, ${recipe.character}`} />
            {both && <div className="mt-1.5 text-center font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">{recipe.character}</div>}
          </div>
          {both && (
            <div>
              <Stage cast={[specOf(asset, otherCharacter, muscles)]} ratio={Math.min(ratio, 1)} controls="review" margin={1.16} label={`${ex.name}, ${otherCharacter}`} />
              <div className="mt-1.5 text-center font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">{otherCharacter}</div>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
        <label className="flex items-center gap-2.5"><Toggle on={muscles} onChange={setMuscles} label="Working muscles" /><span className="text-ink-2">Working muscles</span></label>
        <label className="flex items-center gap-2.5"><Toggle on={both} onChange={setBoth} label="Both characters side by side" /><span className="text-ink-2">Both characters side by side</span></label>
      </div>

      {motion && (
        <div className="mt-5">
          <Eyebrow>What correct looks like</Eyebrow>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{motion.standard}</p>
          {ex.standard && <p className="mt-2 text-[12.5px] leading-relaxed text-ink-3">In the library: {ex.standard}</p>}
          <MuscleList ex={ex} />
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
              <button key={h.id} onClick={() => onVersion(h.id)} className={cx('flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-[13px]', h.id === asset.id && 'bg-surface-2')}>
                <span className="font-medium">Version {h.version}</span>
                <span className="text-ink-3">{when(h.createdAt)}</span>
                <span className="ml-auto"><StatusPill status={h.status}>{STATUS_LABEL[h.status]}</StatusPill></span>
              </button>
            ))}
          </div>
        </section>
      )}

      {(can('archived') || asset.status === 'archived' || asset.status === 'draft') && (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-4">
          {asset.status === 'archived' && <button className="btn btn-quiet btn-sm" onClick={() => moveDemo(asset.id, 'draft')}>Restore as draft</button>}
          {can('archived') && <button className="btn btn-quiet btn-sm" onClick={() => moveDemo(asset.id, 'archived')}>Archive this version</button>}
          {(asset.status === 'draft' || asset.status === 'archived') && history.length > 1 && <button className="btn btn-quiet btn-sm" onClick={() => { removeDemo(asset.id); onVersion(null) }}>Delete this version</button>}
        </div>
      )}
    </div>
  )
}
