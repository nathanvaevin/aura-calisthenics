import { useState } from 'react'
import { DemoSlot } from '@/features/library/DemoSlot'
import { Check, ChevronDown, Compass, Play, X } from 'lucide-react'
import type { AssessmentResult, DisciplineId } from '@/domain/types'
import { difficultyOf, entryTest, menuOf, stationById, type AssessmentTest } from '@/domain/assessment'
import { disciplineById, exerciseById } from '@/domain/catalog'
import { bandOf } from '@/domain/scoring/config'
import { DisciplineDot, Eyebrow, Segmented, TierTag } from '@/ui/primitives'
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

/**
 * Station mode, the athlete's side: every variation of the station, grouped by
 * movement and ordered easiest to hardest. They pick what matches their level,
 * perform it, record it. Nothing is locked; the guidance is in the words.
 */
export function StationMenu({ station, results, onStart, onEdit, onGuide, onClose, forName }: {
  station: DisciplineId
  results: Record<string, AssessmentResult>
  onStart: (ids: string[]) => void
  onEdit: (id: string) => void
  onGuide: () => void
  onClose: () => void
  /** Set when a coach is recording on someone else's behalf. */
  forName?: string
}) {
  const st = stationById[station]
  const sections = menuOf(st)
  const entry = entryTest(st)
  const [chosen, setChosen] = useState<string[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const color = dvar(station)
  const ordered = sections.flatMap((s) => s.tests).filter((t) => chosen.includes(t.id))
  const recorded = sections.flatMap((s) => s.tests).filter((t) => results[t.id])

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[560px] flex-col bg-bg">
      <div className="page-glow" />
      <header className="safe-top relative z-10 shrink-0 px-4">
        <div className="flex h-14 items-center justify-between">
          <button onClick={onClose} aria-label="Back to overview" className="pressable flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-2"><X size={18} /></button>
          <div className="min-w-0 px-3 text-center">
            <div className="flex items-center justify-center gap-2 truncate text-[13.5px] font-medium"><DisciplineDot id={station} size={7} />{disciplineById[station].name}</div>
            <div className="truncate text-[11.5px] text-ink-3">{forName ? `Recording for ${forName}` : `${recorded.length} recorded`}</div>
          </div>
          <span className="w-10" />
        </div>
      </header>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <h1 className="display mt-3 text-[34px] leading-[1.05]">Choose your variations</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
          Pick the <span className="font-medium text-ink">hardest</span> ones you can do with good form for at least the lower number. Comfortable is not the goal: an honest picture of today is. Not sure? Start where it says <span className="font-medium text-ink">Most start here</span>.
        </p>
        <p className="mt-1.5 text-[12.5px] text-ink-3">{st.setup}</p>

        <div className="mt-5 space-y-6">
          {sections.map((section) => (
            <section key={section.category}>
              <Eyebrow className="mb-2">{section.category}{section.tests.length > 1 ? ' · easiest first' : ''}</Eyebrow>
              <div className="space-y-1.5">
                {section.tests.map((t) => {
                  const r = results[t.id]
                  const on = chosen.includes(t.id)
                  const isOpen = open === t.id
                  return (
                    <div key={t.id} className={cx('rounded-[18px] border transition-colors', on ? 'border-ink bg-surface' : 'border-line')}>
                      <div className="flex items-center gap-3 p-3">
                        <button
                          aria-label={r ? `Change ${exerciseById[t.exerciseId].name}` : on ? `Remove ${exerciseById[t.exerciseId].name}` : `Choose ${exerciseById[t.exerciseId].name}`}
                          onClick={() => (r ? onEdit(t.id) : setChosen(on ? chosen.filter((x) => x !== t.id) : [...chosen, t.id]))}
                          className={cx('flex h-7 w-7 shrink-0 items-center justify-center rounded-full border', r ? 'border-transparent text-bg' : on ? 'border-ink bg-ink text-bg' : 'border-line-strong')}
                          style={r ? { background: color } : undefined}
                        >
                          {(r || on) && <Check size={14} strokeWidth={3} />}
                        </button>
                        <button className="min-w-0 flex-1 text-left" onClick={() => setOpen(isOpen ? null : t.id)}>
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-[15px] font-medium">{exerciseById[t.exerciseId].name}</span>
                            {t.id === entry.id && !r && <span className="rounded-full bg-ink px-1.5 py-px font-mono text-[9px] tracking-[0.1em] text-bg uppercase">Most start here</span>}
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-ink-3">
                            <LevelChip t={t} />
                            {r ? <span className="text-ink-2">{r.skipped ? 'Not tested' : t.kind === 'choice' ? t.options?.[r.value]?.label : `Recorded ${r.value}${exerciseById[t.exerciseId].metric === 'hold' ? ' s' : ''}`}</span> : <span>{targetLabel(t)}</span>}
                            {r && !r.skipped && <TierTag tier={r.tier} compact />}
                          </span>
                        </button>
                        <button aria-label="Details" onClick={() => setOpen(isOpen ? null : t.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-3 hover:text-ink">
                          <ChevronDown size={15} className={cx('transition-transform', isOpen && 'rotate-180')} />
                        </button>
                      </div>
                      {isOpen && <div className="border-t border-line px-3 pb-3"><Details t={t} /></div>}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <footer className="safe-bottom glass relative z-10 shrink-0 border-t border-line px-5 pt-3 pb-4">
        <button className="btn btn-primary btn-lg w-full" disabled={ordered.length === 0} onClick={() => onStart(ordered.map((t) => t.id))}>
          <Play size={15} fill="currentColor" /> {ordered.length ? `Start ${ordered.length} ${ordered.length === 1 ? 'variation' : 'variations'}` : 'Choose at least one'}
        </button>
        <button className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 text-[12.5px] text-ink-2 hover:text-ink" onClick={onGuide}>
          <Compass size={13} /> Rather be guided? Let the station choose for you
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
