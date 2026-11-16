import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Hand, Minus, Pause, Play, Plus, X } from 'lucide-react'
import type { DisciplineId } from '@/domain/types'
import {
  demonstrated, estimateMinutes, nextTest, overallProgress, startingStation, stationById, stationProgress, testById, visibleTests,
  type AssessmentTest,
} from '@/domain/assessment'
import { disciplineById, exerciseById } from '@/domain/catalog'
import { bandOf } from '@/domain/scoring/config'
import { curveRating } from '@/domain/scoring/curve'
import { useNow } from '@/data/hooks'
import { useStore } from '@/data/store'
import { useLive } from '@/data/cloud'
import { SyncLine } from '@/features/account/Account'
import { DisciplineDot, Eyebrow, Ring, TierTag } from '@/ui/primitives'
import { tick } from '@/lib/sound'
import { cx, dvar } from '@/lib/format'

/** A session and the participant this device is acting for. */
export function useAssessment(sessionId: string | undefined, participantId?: string | null) {
  const session = useStore((s) => s.assessments.find((a) => a.id === sessionId))
  const all = useStore((s) => s.participants)
  const meId = useStore((s) => s.meId)
  const participants = all.filter((p) => p.sessionId === sessionId)
  const mine = participants.find((p) => p.athleteId === meId)
  const target = participantId ? participants.find((p) => p.id === participantId) : mine
  const coaching = !!session && session.origin === 'local' && session.coachId === meId
  // A coach's session that has been finalised: a participant can read their results, not change them.
  const closed = !!session && session.origin === 'invite' && session.status === 'finalised'
  return { session, participants, mine, target, coaching, closed, meId }
}

const unitOf = (t: AssessmentTest) => {
  const ex = exerciseById[t.exerciseId]
  return ex.metric === 'hold' ? 's' : ex.perSide ? ' / side' : ''
}

/** How a recorded result reads back: the value, and what it demonstrates. */
export function resultLabel(t: AssessmentTest, value: number, skipped?: boolean) {
  if (skipped) return 'Not tested'
  if (t.kind === 'choice') return t.options?.[value]?.label ?? '—'
  return value === 0 ? 'Not yet' : `${value}${unitOf(t)}`
}

export function resultReading(t: AssessmentTest, value: number, skipped?: boolean) {
  const shown = demonstrated(t, { value, tier: 'self', at: '', skipped })
  if (shown.length === 0) return null
  const [exerciseId, v] = shown[shown.length - 1]
  const points = Math.round(curveRating(exerciseById[exerciseId].curve, v))
  return { points, band: bandOf(points).label }
}

const STATE_COPY = { todo: 'To do', active: 'In progress', done: 'Done', skipped: 'Skipped' } as const

// ── Overview ─────────────────────────────────────────────────────────────

export function AssessHub() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { session, mine, coaching, closed } = useAssessment(sessionId)
  const patchParticipant = useStore((s) => s.patchParticipant)
  const toggleStationSkip = useStore((s) => s.toggleStationSkip)
  const submit = useStore((s) => s.submitAssessment)
  const cloud = useStore((s) => !!s.cloudUid)
  useLive('assess', 10000)

  if (!session) return <Navigate to="/train" replace />
  if (!mine) return <Navigate to={coaching ? `/coach/assessment/${session.id}` : '/train'} replace />

  const progress = overallProgress(session.stations, mine.results, mine.skipped)
  const recorded = Object.values(mine.results).filter((r) => !r.skipped).length
  const start = session.origin === 'solo' ? null : startingStation(mine.id, session.stations)
  const open = session.stations.filter((s) => ['todo', 'active'].includes(stationProgress(stationById[s], mine.results, mine.skipped).state))
  const suggested = start && open.includes(start) ? start : open[0]
  const solo = session.origin === 'solo'

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[560px] px-5 pb-40">
      <div className="page-glow" />
      <div className="relative z-10">
        <div className="safe-top pt-5">
          <button onClick={() => navigate('/train')} className="pressable -ml-1 flex h-10 items-center gap-1.5 rounded-full pr-3 pl-1 text-[13.5px] text-ink-2 hover:text-ink">
            <ArrowLeft size={17} /> Save and leave
          </button>
        </div>

        <header className="rise flex items-end justify-between gap-4 pt-3 pb-5">
          <div className="min-w-0">
            <Eyebrow className="mb-2">{session.title} · {solo ? 'On your own' : `with ${session.coachName}`}</Eyebrow>
            <h1 className="display text-[38px] leading-[1.02]">{solo ? 'Find your baseline' : session.groupName}</h1>
          </div>
          <Ring value={progress.total ? (progress.done + progress.skipped) / progress.total : 0} size={62} stroke={3.5}>
            <span className="num text-[13px] font-semibold">{progress.done}/{progress.total}</span>
          </Ring>
        </header>

        <p className="rise rise-1 text-[14px] leading-relaxed text-ink-2">
          {progress.started
            ? `${recorded} ${recorded === 1 ? 'benchmark' : 'benchmarks'} recorded. Pick up wherever there is space.`
            : `${session.stations.length} stations, about ${estimateMinutes(session.stations)} minutes. Take them in any order; each one adapts to your last result.`}
        </p>

        {closed && (
          <p className="rise rise-1 mt-4 rounded-[20px] border border-line-strong bg-surface px-4 py-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-medium text-ink">{session.coachName.split(' ')[0]} has closed this assessment.</span> Your results are final and on your profile.
          </p>
        )}

        {!solo && !closed && (
          <label className="rise rise-1 mt-4 flex items-center gap-3 rounded-[20px] border border-line px-4 py-3">
            <span className="shrink-0 text-[13px] text-ink-2">Partner counting for you</span>
            <input className="min-w-0 flex-1 bg-transparent text-right text-[14px] outline-none placeholder:text-ink-3" placeholder="Optional" value={mine.partner ?? ''} onChange={(e) => patchParticipant(mine.id, { partner: e.target.value || undefined })} />
          </label>
        )}

        <div className="rise rise-2 mt-5 space-y-2.5">
          {session.stations.map((id) => {
            const station = stationById[id]
            const p = stationProgress(station, mine.results, mine.skipped)
            const done = visibleTests(station, mine.results).filter((t) => mine.results[t.id])
            const here = id === suggested
            return (
              <div key={id} className={cx('card overflow-hidden', here && 'border-line-strong')}>
                <button className="flex w-full items-center gap-3.5 p-4 text-left" onClick={() => navigate(`/assess/${session.id}/station/${id}`)} disabled={p.state === 'skipped' || closed}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: p.state === 'done' ? dvar(id) : `color-mix(in oklab, ${dvar(id)} 16%, transparent)`, color: p.state === 'done' ? 'var(--bg)' : dvar(id) }}>
                    {p.state === 'done' ? <Check size={18} strokeWidth={2.8} /> : <span className="num font-mono text-[11px] font-medium">{p.done}/{p.total}</span>}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={cx('text-[16px] font-medium', p.state === 'skipped' && 'text-ink-3 line-through')}>{disciplineById[id].name}</span>
                      {here && p.state === 'todo' && <span className="rounded-full bg-ink px-2 py-px font-mono text-[9px] tracking-[0.1em] text-bg uppercase">{progress.started ? 'Next' : 'Start here'}</span>}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-3">
                      {done.length ? done.map((t) => `${exerciseById[t.exerciseId].short} ${resultLabel(t, mine.results[t.id].value, mine.results[t.id].skipped)}`).join(' · ') : station.setup}
                    </span>
                  </span>
                  <span className="shrink-0 text-right font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">{p.state === 'todo' ? `${station.minutes} min` : STATE_COPY[p.state]}</span>
                </button>
                {!closed && (p.state === 'todo' || p.state === 'skipped') && (
                  <button className="w-full border-t border-line px-4 py-2 text-left text-[12px] text-ink-3 hover:text-ink" onClick={() => toggleStationSkip(mine.id, id)}>
                    {p.state === 'skipped' ? 'Skipped. Tap to bring it back' : 'Skip this station today (injury, no equipment)'}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
          What you record here is self-reported{solo ? '.' : ` until ${session.coachName.split(' ')[0]} observes or verifies it.`} {cloud ? (solo ? 'It is saved to your account as you go.' : `It is saved as you go, and ${session.coachName.split(' ')[0]} sees it on the session board.`) : 'Your progress is saved on this phone as you go.'}
        </p>
        {cloud && <SyncLine className="mt-2" saved="Everything so far is saved" />}
      </div>

      <div className="safe-bottom glass fixed inset-x-0 bottom-0 z-20 border-t border-line">
        <div className="mx-auto max-w-[560px] px-5 pt-3 pb-4">
          {suggested && !progress.complete && !closed && (
            <button className="btn btn-primary btn-lg w-full" onClick={() => navigate(`/assess/${session.id}/station/${suggested}`)}>
              {progress.started ? 'Continue' : 'Begin'} · {disciplineById[suggested].short} <ArrowRight size={17} />
            </button>
          )}
          <button
            className={cx('btn w-full', progress.complete || closed ? 'btn-primary btn-lg' : 'btn-outline mt-2.5')}
            disabled={recorded === 0}
            onClick={() => {
              if (!closed || !mine.submittedAt) submit(mine.id)
              navigate(`/assess/${session.id}/reveal`)
            }}
          >
            {progress.complete ? 'See my profile' : mine.submittedAt ? 'See my profile so far' : `Finish with ${progress.done} of ${progress.total} stations`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── One station, one benchmark at a time ─────────────────────────────────

export function StationRunner() {
  const { sessionId, station } = useParams()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { session, target, coaching, closed, meId } = useAssessment(sessionId, params.get('p'))
  useLive('assess', 10000)
  const recordResult = useStore((s) => s.recordResult)
  const toggleFlag = useStore((s) => s.toggleFlag)
  const sound = useStore((s) => s.settings.sound)

  const st = station ? stationById[station as DisciplineId] : undefined
  if (!session || !target || !st || !session.stations.includes(st.id)) return <Navigate to={session ? `/assess/${session.id}` : '/train'} replace />

  // The coach recording on behalf of someone they are watching.
  const forOther = target.athleteId !== meId
  if ((forOther && !coaching) || closed) return <Navigate to={`/assess/${session.id}`} replace />
  const exit = forOther ? `/coach/assessment/${session.id}?tab=board` : `/assess/${session.id}`
  const editing = params.get('t')
  const current = (editing && testById[editing]) || nextTest(st, target.results)
  const visible = visibleTests(st, target.results)
  const recorded = visible.filter((t) => target.results[t.id])
  const color = dvar(st.id)
  const keep = params.get('p') ? `?p=${params.get('p')}` : ''
  const nextStation = session.stations.find((s) => s !== st.id && ['todo', 'active'].includes(stationProgress(stationById[s], target.results, target.skipped).state))

  const record = (test: AssessmentTest, value: number, skipped = false) => {
    recordResult(target.id, test.id, value, { tier: forOther ? 'observed' : 'self', skipped })
    if (sound && !skipped) tick()
    if (editing) setParams(params.get('p') ? { p: params.get('p')! } : {}, { replace: true })
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[560px] flex-col bg-bg">
      <div className="page-glow" />
      <header className="safe-top relative z-10 shrink-0 px-4">
        <div className="flex h-14 items-center justify-between">
          <button onClick={() => navigate(exit)} aria-label="Back to overview" className="pressable flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-2"><X size={18} /></button>
          <div className="min-w-0 px-3 text-center">
            <div className="flex items-center justify-center gap-2 truncate text-[13.5px] font-medium"><DisciplineDot id={st.id} size={7} />{disciplineById[st.id].name}</div>
            <div className="truncate text-[11.5px] text-ink-3">{forOther ? `Recording for ${target.name} · counts as coach-observed` : session.groupName}</div>
          </div>
          <span className="w-10" />
        </div>
        <div className="flex gap-1">
          {visible.map((t) => (
            <span key={t.id} className="h-1 flex-1 rounded-full" style={{ background: target.results[t.id] ? color : t.id === current?.id ? 'var(--line-strong)' : 'var(--surface-3)' }} />
          ))}
        </div>
      </header>

      {current ? (
        <TestCard
          key={current.id}
          test={current}
          index={visible.findIndex((t) => t.id === current.id)}
          total={visible.length}
          initial={target.results[current.id]?.skipped ? undefined : target.results[current.id]?.value}
          color={color}
          sound={sound}
          onRecord={(v) => record(current, v)}
          onSkip={() => record(current, 0, true)}
          footer={
            !forOther && session.origin !== 'solo' ? (
              <button className={cx('flex h-8 items-center gap-1.5', target.flags.includes(st.id) ? 'font-medium text-ink' : 'hover:text-ink')} onClick={() => toggleFlag(target.id, st.id)}>
                <Hand size={13} /> {target.flags.includes(st.id) ? 'Coach asked · tap to cancel' : 'Ask the coach'}
              </button>
            ) : null
          }
        />
      ) : (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5">
          <div className="rise pt-8">
            <Eyebrow>Station complete</Eyebrow>
            <h1 className="display mt-2 text-[40px]">{disciplineById[st.id].name}</h1>
            <p className="mt-2 text-[14px] text-ink-2">{recorded.length} benchmarks on record. Tap any of them to correct it.</p>
          </div>
          <div className="rise rise-1 card mt-5 divide-y divide-line">
            {recorded.map((t) => {
              const r = target.results[t.id]
              const reading = resultReading(t, r.value, r.skipped)
              return (
                <button key={t.id} className="flex w-full items-center gap-3 px-4 py-3 text-left first:rounded-t-[22px] last:rounded-b-[22px] hover:bg-surface-2" onClick={() => setParams({ ...(params.get('p') ? { p: params.get('p')! } : {}), t: t.id })}>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium">{exerciseById[t.exerciseId].name}</span>
                    <span className="block text-[12px] text-ink-3">{reading ? `Reads ${reading.points} · ${reading.band} range` : r.skipped ? 'Could not be tested today' : 'Not there yet. Now you know where to start'}</span>
                  </span>
                  <TierTag tier={r.tier} compact />
                  <span className="display num text-[24px]" style={{ color: reading ? color : undefined }}>{resultLabel(t, r.value, r.skipped)}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-auto space-y-2.5 pt-6">
            {nextStation && (
              <button className="btn btn-primary btn-lg w-full" onClick={() => navigate(`/assess/${session.id}/station/${nextStation}${keep}`, { replace: true })}>
                Next · {disciplineById[nextStation].short} <ArrowRight size={17} />
              </button>
            )}
            <button className={cx('btn w-full', nextStation ? 'btn-outline' : 'btn-primary btn-lg')} onClick={() => navigate(exit)}>{forOther ? 'Back to the board' : nextStation ? 'Back to the overview' : 'All stations done · overview'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function TestCard({
  test, index, total, initial, color, sound, onRecord, onSkip, footer,
}: {
  test: AssessmentTest
  index: number
  total: number
  initial?: number
  color: string
  sound: boolean
  onRecord: (value: number) => void
  onSkip: () => void
  footer: React.ReactNode
}) {
  const ex = exerciseById[test.exerciseId]
  const hold = test.kind === 'max' && ex.metric === 'hold'
  const [value, setValue] = useState(initial ?? 0)
  const [choice, setChoice] = useState<number | null>(initial ?? null)
  const [started, setStarted] = useState<number | null>(null)
  const now = useNow(200, started !== null)
  const elapsed = started ? Math.max(0, Math.floor((now - started) / 1000)) : 0
  const shown = started ? elapsed : value
  const limit = test.cap ?? 999

  useEffect(() => {
    if (started && test.cap && elapsed >= test.cap) {
      if (sound) tick()
      setValue(test.cap)
      setStarted(null)
    }
  }, [elapsed, started, test.cap, sound])

  const bump = (d: number) => setValue((v) => Math.max(0, Math.min(limit, v + d)))
  const reading = test.kind === 'max' && shown > 0 ? resultReading(test, shown) : null

  return (
    <>
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-3">
        <div className="rise pt-6">
          <Eyebrow>Benchmark {index + 1}{index + 1 < total ? ` of ${total}` : index === 0 ? ' · the next depends on this one' : ''}</Eyebrow>
          <h1 className="display mt-2 text-[36px] leading-[1.04]">{ex.name}</h1>
          <p className="mt-3 text-[15.5px] leading-relaxed">{test.prompt}</p>
          {ex.standard && test.kind === 'max' && <p className="mt-2 border-l-2 pl-3 text-[13px] leading-snug text-ink-2" style={{ borderColor: color }}>Counts when: {ex.standard}</p>}
          {test.cap && <p className="mt-2 text-[12.5px] text-ink-3">Stop at {test.cap}{unitOf(test)}. That is enough to place you, and saves you for the next station.</p>}
          {ex.safety && <p className="mt-2 text-[12.5px] leading-snug text-warn">{ex.safety}</p>}
        </div>

        {test.kind === 'choice' ? (
          <div className="mt-6 space-y-2">
            {test.options!.map((o, i) => (
              <button key={o.label} onClick={() => setChoice(i)} className={cx('pressable flex w-full items-center gap-3 rounded-[20px] border p-4 text-left', choice === i ? 'border-ink bg-surface' : 'border-line')}>
                <span className={cx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', choice === i ? 'border-ink bg-ink text-bg' : 'border-line-strong')}>{choice === i && <Check size={13} strokeWidth={3} />}</span>
                <span className="text-[15px] font-medium">{o.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-auto flex flex-col items-center pt-6">
            <div className="flex items-baseline justify-center">
              <input
                aria-label={hold ? 'Seconds' : 'Repetitions'} type="number" inputMode="numeric" min={0} max={limit} disabled={!!started}
                value={shown === 0 && !started ? '' : shown} placeholder="0"
                onChange={(e) => setValue(Math.max(0, Math.min(limit, Math.round(Number(e.target.value) || 0))))}
                style={{ width: `${String(shown || 0).length * 0.5 + 0.25}em` }}
                className="display num bg-transparent text-center text-[96px] leading-none outline-none placeholder:text-ink-3 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              {hold && <span className="text-[18px] text-ink-3">s</span>}
            </div>
            <div className="mt-1 h-5 text-[12.5px] text-ink-2">
              {reading ? <>Reads <span className="num font-medium" style={{ color }}>{reading.points}</span> · {reading.band} range</> : <span className="text-ink-3">{hold ? 'Time it, or type the seconds' : 'Type it, or count up below'}</span>}
            </div>
            {!started && (
              <div className="mt-4 flex gap-2">
                <button className="btn btn-quiet btn-sm !px-3" onClick={() => bump(hold ? -5 : -1)} aria-label="Less"><Minus size={14} />{hold ? 5 : 1}</button>
                <button className="btn btn-quiet btn-sm !px-3" onClick={() => bump(1)} aria-label="Plus one"><Plus size={14} />1</button>
                <button className="btn btn-quiet btn-sm !px-3" onClick={() => bump(5)} aria-label="Plus five"><Plus size={14} />5</button>
                <button className="btn btn-quiet btn-sm !px-3" onClick={() => bump(10)} aria-label="Plus ten"><Plus size={14} />10</button>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="safe-bottom relative z-10 shrink-0 px-5 pt-2 pb-4">
        {test.kind === 'choice' ? (
          <button className="btn btn-primary btn-lg w-full" disabled={choice === null} onClick={() => choice !== null && onRecord(choice)}><Check size={17} strokeWidth={2.6} /> Record</button>
        ) : started ? (
          <button className="btn btn-accent btn-lg w-full" onClick={() => { setValue(Math.min(limit, Math.max(1, elapsed))); setStarted(null) }}><Pause size={16} fill="currentColor" /> Stop at {elapsed}s</button>
        ) : (
          <div className="flex gap-2.5">
            {hold && <button className={cx('btn btn-lg', value ? 'btn-outline flex-1' : 'btn-primary flex-[1.4]')} onClick={() => { setValue(0); setStarted(Date.now()) }}><Play size={15} fill="currentColor" /> {value ? 'Again' : 'Start timer'}</button>}
            <button className={cx('btn btn-lg', hold && !value ? 'btn-outline flex-1' : 'btn-primary flex-[1.4]')} onClick={() => onRecord(value)}>
              <Check size={17} strokeWidth={2.6} /> {value === 0 ? 'Not yet' : `Record ${value}${hold ? 's' : ''}`}
            </button>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between text-[12.5px] text-ink-2">
          <button className="flex h-8 items-center hover:text-ink" onClick={onSkip}>Can’t test this today</button>
          {footer}
        </div>
      </footer>
    </>
  )
}
