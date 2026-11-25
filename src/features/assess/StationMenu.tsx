import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { DemoPreview, DemoSlot, useHasDemo } from '@/features/library/DemoSlot'
import { ArrowLeft, Check, Compass, ListOrdered, Play, Plus } from 'lucide-react'
import type { AssessmentResult, DisciplineId } from '@/domain/types'
import { allLevels, difficultyOf, entryTest, fromLevel, ladderOf, menuOf, stationById, type AssessmentTest } from '@/domain/assessment'
import { disciplineById, exerciseById } from '@/domain/catalog'
import { bandOf } from '@/domain/scoring/config'
import { MuscleMap } from '@/ui/MuscleMap'
import { DisciplineDot, Eyebrow, Segmented } from '@/ui/primitives'
import { cx, dvar } from '@/lib/format'

/** "8–15 reps", "20–45 s", "3–6 / side": the range a variation is the right level for. */
export function targetLabel(t: AssessmentTest) {
  if (t.kind === 'choice' || !t.target) return 'Choose a position'
  const ex = exerciseById[t.exerciseId]
  const unit = ex.metric === 'hold' ? ' s' : ex.perSide ? ' / side' : ' reps'
  return `${t.target[0]}–${t.target[1]}${unit}`
}

export const levelOf = (t: AssessmentTest) => bandOf(difficultyOf(t))

function LevelChip({ t }: { t: AssessmentTest }) {
  const band = levelOf(t)
  return <span className="inline-flex h-5 items-center rounded-full border border-line px-2 font-mono text-[9.5px] tracking-[0.08em] text-ink-2 uppercase">{band.label}</span>
}

/** What a coach or athlete needs to perform a variation: how, what counts, what to watch. */
function Details({ t }: { t: AssessmentTest }) {
  const ex = exerciseById[t.exerciseId]
  return (
    <div className="space-y-2 pt-2 text-[13px] leading-relaxed">
      <p>{t.prompt}</p>
      {ex.standard && t.kind === 'max' && <p className="border-l-2 border-line-strong pl-3 text-ink-2">Counts when: {ex.standard}</p>}
      {ex.cues.length > 0 && <p className="text-ink-2"><span className="text-ink-3">Cues: </span>{ex.cues.slice(0, 3).join(' · ')}</p>}
      {ex.mistakes.length > 0 && <p className="text-ink-2"><span className="text-ink-3">Watch for: </span>{ex.mistakes.slice(0, 2).join(' · ')}</p>}
      {ex.safety && <p className="text-warn">{ex.safety}</p>}
      <DemoSlot exerciseId={ex.id} official className="!mt-3" />
    </div>
  )
}

/** How tall the see-through part at the top of the list is: the stage shows through it, and the character's feet may stand in it. */
const FADE = 96

const ORDINAL = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th']

/**
 * One area of the assessment, the athlete's side: every exercise in it in one
 * list of levels, easiest first. Touching a level shows it being performed,
 * at once, in the stage above the list. There are three ways to begin, all
 * the athlete's own choice: start from the level they think is their hardest
 * (that one, then the two below it), add a few and do them in the order they
 * were added, or do every level from the first. Nothing is locked; the
 * guidance is in the words.
 *
 * What is chosen lives with the caller (in the address), so going into a test
 * and back out again loses nothing.
 */
export function StationMenu({ station, results, chosen, onChoose, onStart, onEdit, onGuide, onClose, forName, skipped, onSkip }: {
  station: DisciplineId
  results: Record<string, AssessmentResult>
  /** The exercises picked so far, in the order they will be done. */
  chosen: string[]
  onChoose: (ids: string[]) => void
  /** `fromLevel`: begun from one level, so a result past its range points to the level above. */
  onStart: (ids: string[], fromLevel?: boolean) => void
  onEdit: (id: string) => void
  onGuide: () => void
  onClose: () => void
  /** Set when a coach is recording on someone else's behalf. */
  forName?: string
  skipped?: boolean
  onSkip?: () => void
}) {
  const st = stationById[station]
  const tests = useMemo(() => ladderOf(st), [st])
  const entry = entryTest(st)
  const [focusId, setFocus] = useState(chosen[0] ?? entry.id)
  const [more, setMore] = useState(false)
  const focus = tests.find((t) => t.id === focusId) ?? entry
  const ex = exerciseById[focus.exerciseId]
  const animated = useHasDemo(ex.id)
  const color = dvar(station)
  const picked = chosen.filter((id) => tests.some((t) => t.id === id))
  const toggle = (id: string) => onChoose(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id])
  const recordedCount = tests.filter((t) => results[t.id]).length
  const first = picked[0] ? exerciseById[tests.find((t) => t.id === picked[0])!.exerciseId] : null
  const level = tests.findIndex((t) => t.id === focus.id) + 1
  /** Starting from the level being looked at: it, and the levels just below it. */
  const run = fromLevel(st, focus.id, results)
  const all = allLevels(st, results)

  const act = (t: AssessmentTest, large = false) => {
    const r = results[t.id]
    const at = picked.indexOf(t.id)
    const name = exerciseById[t.exerciseId].name
    if (r) return <button onClick={() => onEdit(t.id)} aria-label={`Redo ${name}`} className={cx('pressable shrink-0 rounded-full border border-line-strong font-medium text-ink-2 hover:text-ink', large ? 'h-10 px-4 text-[13.5px]' : 'h-8 px-3 text-[12px]')}>Redo</button>
    if (at >= 0) return <button onClick={() => toggle(t.id)} aria-label={`Remove ${name}`} aria-pressed className={cx('pressable flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-ink font-medium text-bg', large ? 'h-10 px-4 text-[13.5px]' : 'h-8 min-w-8 px-2.5 text-[12px]')}>{large ? <><Check size={14} strokeWidth={3} /> {ORDINAL[at] ?? at + 1}</> : <span className="num">{at + 1}</span>}</button>
    return <button onClick={() => toggle(t.id)} aria-label={`Add ${name}`} className={cx('pressable flex shrink-0 items-center justify-center gap-1 rounded-full border border-line-strong font-medium hover:bg-surface-2', large ? 'h-10 px-4 text-[13.5px]' : 'h-8 w-8')}><Plus size={large ? 15 : 15} />{large && 'Add'}</button>
  }

  // The movement fills the screen. The header lies over its top and the list over its bottom, and the
  // character is kept in what is left between them, with its feet just inside the list's fade.
  const header = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const [cover, setCover] = useState({ top: 0, bottom: 0 })
  useLayoutEffect(() => {
    const measure = () => {
      const h = root.current?.clientHeight ?? 0
      const top = header.current?.offsetHeight ?? 0
      const p = panel.current ? h - panel.current.offsetTop : 0
      setCover((was) => (was.top === top && Math.abs(was.bottom - (p - FADE)) < 1 ? was : { top, bottom: Math.max(0, p - FADE) }))
    }
    measure()
    const watch = new ResizeObserver(measure)
    for (const el of [root.current, header.current, panel.current]) if (el) watch.observe(el)
    return () => watch.disconnect()
  }, [])
  const list = useRef<HTMLDivElement>(null)
  // Touching an exercise shows it and leaves the list where it is, so one can go down it quickly. Touching the
  // character (a tap, not a drag to turn it) lowers the list again, back to the exercise and its details.
  const show = (id: string) => { setFocus(id); setMore(false) }
  const press = useRef<{ x: number; y: number } | null>(null)
  const lower = (e: React.PointerEvent) => {
    const at = press.current
    press.current = null
    if (!at || Math.hypot(e.clientX - at.x, e.clientY - at.y) > 8) return
    list.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={root} className="relative mx-auto h-dvh w-full max-w-[560px] overflow-hidden bg-(--stage)" data-picker={station}>
      {/* The exercise being looked at, performed, behind everything. It changes the moment another is touched. */}
      <div className="absolute inset-0" data-picker-stage onPointerDownCapture={(e) => { press.current = { x: e.clientX, y: e.clientY } }} onPointerUpCapture={lower}>
        {animated
          ? <DemoPreview exerciseId={ex.id} official safe={cover} />
          : <div className="flex items-center justify-center" style={{ paddingTop: cover.top, height: `calc(100% - ${cover.bottom}px)` }}><MuscleMap primary={ex.primary} secondary={ex.secondary} stabilizers={ex.stabilizers} color={color} height={190} /></div>}
      </div>

      <header ref={header} className="safe-top pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-(--stage) via-(--stage)/70 to-transparent px-4 pb-6">
        <div className="flex h-14 items-center justify-between">
          <button onClick={onClose} aria-label="Back to the areas" className="pressable pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-ink-2 backdrop-blur-md"><ArrowLeft size={18} /></button>
          <div className="min-w-0 px-3 text-center">
            <div className="flex items-center justify-center gap-2 truncate text-[15px] font-medium"><DisciplineDot id={station} size={7} />{disciplineById[station].short}</div>
            <div className="truncate text-[11.5px] text-ink-3">{forName ? `Recording for ${forName}` : recordedCount ? `${recordedCount} recorded` : 'Tap the hardest level you can do'}</div>
          </div>
          <span className="w-10" />
        </div>
      </header>

      {/* Over the bottom of the stage: a see-through veil that deepens downwards, the exercise looked at, and every exercise to scroll through. */}
      <div ref={panel} className="absolute inset-x-0 bottom-0 z-10 flex h-[56dvh] flex-col" data-picker-panel>
        <div className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 0, color-mix(in oklab, var(--bg) 55%, transparent) ${FADE}px, color-mix(in oklab, var(--bg) 88%, transparent) ${FADE + 120}px, var(--bg) 100%)` }} />
        <div
          ref={list}
          className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3"
          style={{ paddingTop: FADE - 8, WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 22px)', maskImage: 'linear-gradient(to bottom, transparent 0, #000 22px)' }}
        >
          <div className="px-2 pb-3" data-picker-focus>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="display truncate text-[28px] leading-tight [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]">{ex.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-ink-2"><span className="font-medium text-ink" data-level={level}>Level {level}</span><LevelChip t={focus} /><span className="num">{targetLabel(focus)}</span></div>
              </div>
              {act(focus, true)}
            </div>
            <p className="mt-2 text-[13.5px] leading-snug text-ink-2">{focus.prompt}</p>
            {(ex.standard || ex.safety) && (
              <button className="mt-1 text-[12px] text-ink-3 underline decoration-line-strong underline-offset-4 hover:text-ink" onClick={() => setMore(!more)} aria-expanded={more}>{more ? 'Less' : 'What counts'}</button>
            )}
            {more && (
              <div className="mt-1.5 space-y-1 text-[12.5px] leading-snug text-ink-2">
                {ex.standard && focus.kind === 'max' && <p>{ex.standard}</p>}
                {ex.safety && <p className="text-warn">{ex.safety}</p>}
              </div>
            )}
          </div>

          <div className="space-y-1">
            {tests.map((t, i) => {
              const r = results[t.id]
              const on = focus.id === t.id
              return (
                <div key={t.id} data-test={t.id} className={cx('flex items-center gap-2 rounded-2xl pr-2 transition-colors', on ? 'bg-surface-2/80 ring-1 ring-line-strong backdrop-blur-md' : 'bg-bg/35 backdrop-blur-[2px]')}>
                  <button className="flex min-w-0 flex-1 items-center gap-3 py-2.5 pl-2.5 text-left" onClick={() => show(t.id)} aria-current={on}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={r ? { background: color, color: 'var(--bg)' } : { background: `color-mix(in oklab, ${color} 16%, transparent)`, color }}>
                      {r ? <Check size={13} strokeWidth={3} /> : <span className="num text-[12px] font-semibold" aria-label={`Level ${i + 1}`}>{i + 1}</span>}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2"><span className="truncate text-[14.5px] font-medium">{exerciseById[t.exerciseId].name}</span>{t.id === entry.id && !r && <span className="shrink-0 rounded-full bg-ink px-1.5 py-px font-mono text-[8.5px] tracking-[0.1em] text-bg uppercase">Most start here</span>}</span>
                      <span className="block truncate text-[11.5px] text-ink-3">
                        {r ? (r.skipped ? 'Not tested' : t.kind === 'choice' ? t.options?.[r.value]?.label : `Recorded ${r.value}${exerciseById[t.exerciseId].metric === 'hold' ? ' s' : ''}`) : `${levelOf(t).label} · ${targetLabel(t)}`}
                      </span>
                    </span>
                  </button>
                  {act(t)}
                </div>
              )
            })}
          </div>
          {onSkip && !forName && recordedCount === 0 && (
            <button className="mt-1 w-full px-2.5 py-2.5 text-left text-[12px] text-ink-3 hover:text-ink" onClick={onSkip}>{skipped ? 'Skipped for today. Tap to bring it back.' : 'Can’t do this area today? Skip it.'}</button>
          )}
        </div>

        <footer className="safe-bottom relative shrink-0 bg-bg px-5 pt-2 pb-4">
          {/* One thing to press: what was added, in that order; with nothing added, the level being looked at and the two below it. */}
          {picked.length > 0 ? (
            <button className="btn btn-primary btn-lg w-full" onClick={() => onStart(picked)}>
              <Play size={15} fill="currentColor" /> {picked.length === 1 ? `Start ${first!.short}` : `Start · ${first!.short} first, ${picked.length} in all`}
            </button>
          ) : (
            <button className="btn btn-primary btn-lg w-full" data-from-level={level} disabled={run.length === 0} onClick={() => onStart(run, true)}>
              {run.length === 0 ? 'Tap a level to start from' : <><Play size={15} fill="currentColor" /> Start from level {level}</>}
            </button>
          )}
          <p className="mt-1.5 text-center text-[11.5px] text-ink-3" data-start-note>
            {picked.length > 0 ? 'In the order you added them.' : run.length === 0 ? 'This one is on record.' : run.length === 1 ? 'It is the first level.' : `Then the ${run.length === 2 ? 'level' : 'two levels'} below it.`}
          </p>
          <div className="flex items-center justify-center gap-5 text-[12.5px] text-ink-2">
            <button className="flex h-9 items-center gap-1.5 hover:text-ink disabled:opacity-40" disabled={all.length === 0} onClick={() => onStart(all)}><ListOrdered size={13} /> All levels from the start</button>
            <button className="flex h-9 items-center gap-1.5 hover:text-ink" onClick={onGuide}><Compass size={13} /> Let Aura choose</button>
          </div>
        </footer>
      </div>
    </div>
  )
}

/**
 * Station mode, the coach's side: every variation of every station, with what
 * to say and what to look for, to explain or demonstrate during a live class.
 */
export function StationOverview({ stations }: { stations: DisciplineId[] }) {
  const [station, setStation] = useState<DisciplineId>(stations[0])
  const st = stationById[station]
  const guided = new Map(st.tests.map((t, i) => [t.id, i + 1]))
  return (
    <div>
      <div className="no-scrollbar -mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        <Segmented<DisciplineId> value={station} onChange={setStation} options={stations.map((s) => ({ value: s, label: <span className="flex items-center gap-1.5"><DisciplineDot id={s} size={6} />{disciplineById[s].short}</span> }))} />
      </div>
      <p className="mt-3 text-[13px] text-ink-2"><span className="font-medium text-ink">Set-up:</span> {st.setup}</p>
      <div className="mt-5 space-y-7">
        {menuOf(st).map((section) => (
          <section key={section.category}>
            <Eyebrow className="mb-2.5">{section.category} · easiest first</Eyebrow>
            <div className="grid gap-2.5 lg:grid-cols-2">
              {section.tests.map((t) => (
                <div key={t.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[16px] font-medium">{exerciseById[t.exerciseId].name}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-ink-3">
                        <LevelChip t={t} />
                        <span className="num">{targetLabel(t)}</span>
                        {guided.has(t.id) && <span>Guided step {guided.get(t.id)}</span>}
                      </div>
                    </div>
                    {t.id === st.tests[0].id && <span className="shrink-0 rounded-full bg-ink px-1.5 py-px font-mono text-[9px] tracking-[0.1em] text-bg uppercase">Most start here</span>}
                  </div>
                  <Details t={t} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-5 text-[12px] leading-relaxed text-ink-3">
        Level labels come from the scoring curves: what a result at the bottom of the suggested range is worth. Within a movement the list runs easiest to hardest; different movements are kept apart because they are not one ladder.
      </p>
    </div>
  )
}
