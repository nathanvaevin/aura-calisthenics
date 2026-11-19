import { useMemo, useState } from 'react'
import { DemoPreview, DemoSlot, useHasDemo } from '@/features/library/DemoSlot'
import { ArrowLeft, Check, Compass, Play, Plus } from 'lucide-react'
import type { AssessmentResult, DisciplineId } from '@/domain/types'
import { difficultyOf, entryTest, menuOf, stationById, type AssessmentTest } from '@/domain/assessment'
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

const ORDINAL = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th']

/**
 * One area of the assessment, the athlete's side: every exercise in it in one
 * list, easiest first. Touching an exercise shows it being performed, at
 * once, in the stage above the list. The ones the athlete adds are done in
 * the order they were added. Nothing is locked; the guidance is in the words.
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
  onStart: (ids: string[]) => void
  onEdit: (id: string) => void
  onGuide: () => void
  onClose: () => void
  /** Set when a coach is recording on someone else's behalf. */
  forName?: string
  skipped?: boolean
  onSkip?: () => void
}) {
  const st = stationById[station]
  const tests = useMemo(() => menuOf(st).flatMap((x) => x.tests).sort((a, b) => difficultyOf(a) - difficultyOf(b)), [st])
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

  const act = (t: AssessmentTest, large = false) => {
    const r = results[t.id]
    const at = picked.indexOf(t.id)
    const name = exerciseById[t.exerciseId].name
    if (r) return <button onClick={() => onEdit(t.id)} aria-label={`Redo ${name}`} className={cx('pressable shrink-0 rounded-full border border-line-strong font-medium text-ink-2 hover:text-ink', large ? 'h-10 px-4 text-[13.5px]' : 'h-8 px-3 text-[12px]')}>Redo</button>
    if (at >= 0) return <button onClick={() => toggle(t.id)} aria-label={`Remove ${name}`} aria-pressed className={cx('pressable flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-ink font-medium text-bg', large ? 'h-10 px-4 text-[13.5px]' : 'h-8 min-w-8 px-2.5 text-[12px]')}>{large ? <><Check size={14} strokeWidth={3} /> {ORDINAL[at] ?? at + 1}</> : <span className="num">{at + 1}</span>}</button>
    return <button onClick={() => toggle(t.id)} aria-label={`Add ${name}`} className={cx('pressable flex shrink-0 items-center justify-center gap-1 rounded-full border border-line-strong font-medium hover:bg-surface-2', large ? 'h-10 px-4 text-[13.5px]' : 'h-8 w-8')}><Plus size={large ? 15 : 15} />{large && 'Add'}</button>
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[560px] flex-col bg-bg" data-picker={station}>
      <header className="safe-top relative z-10 shrink-0 px-4">
        <div className="flex h-14 items-center justify-between">
          <button onClick={onClose} aria-label="Back to the areas" className="pressable flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-2"><ArrowLeft size={18} /></button>
          <div className="min-w-0 px-3 text-center">
            <div className="flex items-center justify-center gap-2 truncate text-[15px] font-medium"><DisciplineDot id={station} size={7} />{disciplineById[station].short}</div>
            <div className="truncate text-[11.5px] text-ink-3">{forName ? `Recording for ${forName}` : recordedCount ? `${recordedCount} recorded` : 'Tap an exercise to see it'}</div>
          </div>
          <span className="w-10" />
        </div>
      </header>

      {/* The exercise being looked at, performed. It changes the moment another is touched. */}
      <div className="relative z-10 mx-4 h-[30dvh] min-h-[200px] shrink-0 overflow-hidden rounded-card border border-line bg-(--stage)">
        {animated
          ? <DemoPreview exerciseId={ex.id} official />
          : <div className="flex h-full items-center justify-center"><MuscleMap primary={ex.primary} secondary={ex.secondary} stabilizers={ex.stabilizers} color={color} height={170} /></div>}
      </div>

      <div className="relative z-10 shrink-0 px-5 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="display truncate text-[26px] leading-tight">{ex.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-ink-3"><LevelChip t={focus} /><span className="num">{targetLabel(focus)}</span></div>
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

      <div className="relative z-10 mt-3 min-h-0 flex-1 overflow-y-auto border-t border-line px-3 pb-2">
        {tests.map((t) => {
          const r = results[t.id]
          const on = focus.id === t.id
          return (
            <div key={t.id} data-test={t.id} className={cx('flex items-center gap-2 rounded-2xl pr-2 transition-colors', on && 'bg-surface-2')}>
              <button className="flex min-w-0 flex-1 items-center gap-3 py-2.5 pl-2.5 text-left" onClick={() => { setFocus(t.id); setMore(false) }} aria-current={on}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={r ? { background: color, color: 'var(--bg)' } : { background: `color-mix(in oklab, ${color} 16%, transparent)`, color }}>
                  {r ? <Check size={13} strokeWidth={3} /> : <Play size={10} fill="currentColor" className="ml-px" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2"><span className="truncate text-[14.5px] font-medium">{exerciseById[t.exerciseId].name}</span>{t.id === entry.id && !r && <span className="shrink-0 rounded-full bg-ink px-1.5 py-px font-mono text-[8.5px] tracking-[0.1em] text-bg uppercase">Start here</span>}</span>
                  <span className="block truncate text-[11.5px] text-ink-3">
                    {r ? (r.skipped ? 'Not tested' : t.kind === 'choice' ? t.options?.[r.value]?.label : `Recorded ${r.value}${exerciseById[t.exerciseId].metric === 'hold' ? ' s' : ''}`) : `${levelOf(t).label} · ${targetLabel(t)}`}
                  </span>
                </span>
              </button>
              {act(t)}
            </div>
          )
        })}
        {onSkip && !forName && recordedCount === 0 && (
          <button className="mt-1 w-full px-2.5 py-2.5 text-left text-[12px] text-ink-3 hover:text-ink" onClick={onSkip}>{skipped ? 'Skipped for today. Tap to bring it back.' : 'Can’t do this area today? Skip it.'}</button>
        )}
      </div>

      <footer className="safe-bottom glass relative z-10 shrink-0 border-t border-line px-5 pt-3 pb-4">
        <button className="btn btn-primary btn-lg w-full" disabled={picked.length === 0} onClick={() => onStart(picked)}>
          {picked.length === 0 ? 'Add an exercise to begin' : <><Play size={15} fill="currentColor" /> {picked.length === 1 ? `Start ${first!.short}` : `Start · ${first!.short} first, ${picked.length} in all`}</>}
        </button>
        <button className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 text-[12.5px] text-ink-2 hover:text-ink" onClick={onGuide}>
          <Compass size={13} /> Not sure? Let Aura choose for you
        </button>
      </footer>
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
