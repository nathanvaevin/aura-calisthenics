import { useState } from 'react'
import { DemoSlot, useHasDemo } from '@/features/library/DemoSlot'
import { StageScreen, useBurst } from '@/features/library/StageScreen'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Hand, Minus, Pause, Play, Plus } from 'lucide-react'
import type { DisciplineId } from '@/domain/types'
import {
  beyondTarget, demonstrated, groupCount, harderThan, levelAbove, modeOf, nextTest, overallProgress, rotationOf, startingStation, stationById, stationOfTest, stationProgress,
  testById, visibleTests, type AssessmentMode, type AssessmentTest,
} from '@/domain/assessment'
import { disciplineById, exerciseById } from '@/domain/catalog'
import { bandOf } from '@/domain/scoring/config'
import { curveRating } from '@/domain/scoring/curve'
import { useNow } from '@/data/hooks'
import { useStore } from '@/data/store'
import { useLive } from '@/data/cloud'
import { SyncLine } from '@/features/account/Account'
import { StationMenu, targetLabel } from './StationMenu'
import { InstructorChoice } from './Instructor'
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
  // The athlete chooses what to attempt (and can still ask to be guided), in every assessment.
  const mode: AssessmentMode = modeOf(session)
  return { session, participants, mine, target, coaching, closed, meId, mode }
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


// ── Overview ─────────────────────────────────────────────────────────────

export function AssessHub() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { session, mine, coaching, closed, mode } = useAssessment(sessionId)
  const patchParticipant = useStore((s) => s.patchParticipant)
  const toggleStationSkip = useStore((s) => s.toggleStationSkip)
  const submit = useStore((s) => s.submitAssessment)
  const cloud = useStore((s) => !!s.cloudUid)
  const instructor = useStore((s) => s.settings.instructor)
  const setSettings = useStore((s) => s.setSettings)
  const [choosing, setChoosing] = useState(false)
  useLive('assess', 10000)

  if (!session) return <Navigate to="/train" replace />
  if (!mine) return <Navigate to={coaching ? `/coach/assessment/${session.id}` : '/train'} replace />

  const progress = overallProgress(session.stations, mine.results, mine.skipped, mode)
  const recorded = Object.values(mine.results).filter((r) => !r.skipped).length
  const solo = session.origin === 'solo'
  // With groups, the coach's placement decides where to start and the order to rotate in.
  const groups = groupCount(session)
  const group = !solo && groups > 1 && mine.group !== undefined ? mine.group % groups : null
  const order = group !== null ? rotationOf(group, groups, session.stations) : session.stations
  const start = solo ? null : group !== null ? order[0] : startingStation(mine.id, session.stations)
  const open = order.filter((s) => ['todo', 'active'].includes(stationProgress(stationById[s], mine.results, mine.skipped, mode).state))
  const suggested = start && open.includes(start) ? start : open[0]

  const firstName = session.coachName.split(' ')[0]
  // An assessment opens by asking who demonstrates it: once for each assessment, before anything is recorded.
  if (choosing || (!closed && recorded === 0 && instructor?.sessionId !== session.id))
    return <InstructorChoice initial={instructor?.character} onDone={(character) => { setSettings({ instructor: { character, sessionId: session.id } }); setChoosing(false) }} />
  const finish = () => {
    if (!closed || !mine.submittedAt) submit(mine.id)
    navigate(`/assess/${session.id}/done`)
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[560px] px-5 pb-44" data-assess-hub>
      <div className="page-glow" />
      <div className="relative z-10">
        <div className="safe-top pt-5">
          <button onClick={() => navigate('/train')} className="pressable -ml-1 flex h-10 items-center gap-1.5 rounded-full pr-3 pl-1 text-[13.5px] text-ink-2 hover:text-ink">
            <ArrowLeft size={17} /> Leave
          </button>
        </div>

        <header className="rise flex items-end justify-between gap-4 pt-3 pb-3">
          <div className="min-w-0">
            {!solo && <Eyebrow className="mb-2">{session.title} · with {session.coachName}</Eyebrow>}
            <h1 className="display text-[38px] leading-[1.02]">{solo ? 'Your assessment' : session.groupName}</h1>
          </div>
          <Ring value={progress.total ? (progress.done + progress.skipped) / progress.total : 0} size={56} stroke={3.5}>
            <span className="num text-[12.5px] font-semibold">{progress.done}/{progress.total}</span>
          </Ring>
        </header>

        <p className="rise rise-1 text-[14.5px] leading-relaxed text-ink-2">
          {progress.started ? 'Pick another area, or finish whenever you like.' : `${session.stations.length === 6 ? 'Six' : session.stations.length} areas. Start with any one, and do as many as you can today.`}
        </p>
        {group !== null && (
          <p className="rise rise-1 mt-3 rounded-[18px] border border-line-strong bg-surface px-4 py-3 text-[13.5px] leading-relaxed">
            <span className="font-medium">You are in group {group + 1}.</span>{' '}
            <span className="text-ink-2">Start at {disciplineById[order[0]].short}, then {order.slice(1).map((d) => disciplineById[d].short).join(', ')}.</span>
          </p>
        )}
        {closed && (
          <p className="rise rise-1 mt-4 rounded-[20px] border border-line-strong bg-surface px-4 py-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-medium text-ink">{firstName} has closed this assessment.</span> Your results are final and on your profile.
          </p>
        )}

        {/* The areas: one tile each, in the order to take them. */}
        <div className="rise rise-2 mt-5 grid grid-cols-2 gap-2.5">
          {order.map((id) => {
            const station = stationById[id]
            const p = stationProgress(station, mine.results, mine.skipped, mode)
            const count = [...station.tests, ...station.extra].filter((t) => mine.results[t.id] && !mine.results[t.id].skipped).length
            const here = id === suggested && p.state === 'todo'
            return (
              <button
                key={id} data-area={id} data-state={p.state} disabled={closed || (p.state === 'skipped' && mode !== 'stations')}
                onClick={() => navigate(`/assess/${session.id}/station/${id}`)}
                className={cx('card pressable relative flex min-h-[112px] flex-col items-start justify-between p-4 text-left', here && 'border-line-strong', p.state === 'skipped' && 'opacity-60')}
              >
                <span className="flex w-full items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.state === 'done' ? dvar(id) : `color-mix(in oklab, ${dvar(id)} 16%, transparent)`, color: p.state === 'done' ? 'var(--bg)' : dvar(id) }}>
                    {p.state === 'done' ? <Check size={17} strokeWidth={2.8} /> : mode === 'stations' ? <span className="h-2 w-2 rounded-full bg-current" /> : <span className="num font-mono text-[10.5px] font-medium">{p.done}/{p.total}</span>}
                  </span>
                  {here && <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-bg uppercase">{progress.started ? 'Next' : 'Start here'}</span>}
                </span>
                <span>
                  <span className={cx('block text-[17px] font-medium', p.state === 'skipped' && 'line-through')}>{disciplineById[id].short}</span>
                  <span className="mt-0.5 block text-[12px] text-ink-3">{p.state === 'skipped' ? 'Skipped today' : count ? `${count} recorded` : p.state === 'active' ? 'In progress' : `About ${station.minutes} min`}</span>
                </span>
              </button>
            )
          })}
        </div>

        {mode !== 'stations' && !closed && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-3">
            {order.filter((id) => ['todo', 'skipped'].includes(stationProgress(stationById[id], mine.results, mine.skipped, mode).state)).map((id) => (
              <button key={id} className="underline decoration-line-strong underline-offset-4 hover:text-ink" onClick={() => toggleStationSkip(mine.id, id)}>
                {mine.skipped.includes(id) ? `Bring back ${disciplineById[id].short}` : `Skip ${disciplineById[id].short} today`}
              </button>
            ))}
          </div>
        )}

        {!solo && !closed && (
          <label className="rise rise-2 mt-4 flex items-center gap-3 rounded-[20px] border border-line px-4 py-3">
            <span className="shrink-0 text-[13px] text-ink-2">Partner counting for you</span>
            <input className="min-w-0 flex-1 bg-transparent text-right text-[14px] outline-none placeholder:text-ink-3" placeholder="Optional" value={mine.partner ?? ''} onChange={(e) => patchParticipant(mine.id, { partner: e.target.value || undefined })} />
          </label>
        )}

        {!closed && instructor && (
          <button className="mt-4 text-[12.5px] text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink" onClick={() => setChoosing(true)}>Instructor: {instructor.character === 'female' ? 'female' : 'male'} · change</button>
        )}
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          {cloud ? 'Saved as you go.' : 'Kept on this phone as you go.'}{!solo && !closed ? ` You record your own results; ${firstName} can confirm what they watch.` : ''}
        </p>
        {cloud && <SyncLine className="mt-1.5" saved="Everything so far is saved" />}
      </div>

      <div className="safe-bottom glass fixed inset-x-0 bottom-0 z-20 border-t border-line">
        <div className="mx-auto max-w-[560px] px-5 pt-3 pb-4">
          {suggested && !progress.complete && !closed && (
            <button className="btn btn-primary btn-lg w-full" onClick={() => navigate(`/assess/${session.id}/station/${suggested}`)}>
              {progress.started ? 'Next' : 'Start with'} {disciplineById[suggested].short} <ArrowRight size={17} />
            </button>
          )}
          {(recorded > 0 || closed) && (
            <button className={cx('btn w-full', progress.complete || closed ? 'btn-primary btn-lg' : 'btn-outline mt-2.5')} onClick={finish}>
              {progress.complete || closed ? 'Finish' : `Finish with ${progress.done} of ${progress.total}`}
            </button>
          )}
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
  const { session, target, coaching, closed, meId, mode } = useAssessment(sessionId, params.get('p'))
  useLive('assess', 10000)
  const recordResult = useStore((s) => s.recordResult)
  const toggleFlag = useStore((s) => s.toggleFlag)
  const toggleStationSkip = useStore((s) => s.toggleStationSkip)
  const sound = useStore((s) => s.settings.sound)
  /** A result past the top of its range, and the variation it points to. */
  const [nudge, setNudge] = useState<{ test: AssessmentTest; harder: AssessmentTest; value: number } | null>(null)

  const st = station ? stationById[station as DisciplineId] : undefined
  if (!session || !target || !st || !session.stations.includes(st.id)) return <Navigate to={session ? `/assess/${session.id}` : '/train'} replace />

  // The coach recording on behalf of someone they are watching.
  const forOther = target.athleteId !== meId
  if ((forOther && !coaching) || closed) return <Navigate to={`/assess/${session.id}`} replace />
  const exit = forOther ? `/coach/assessment/${session.id}?tab=board` : `/assess/${session.id}`
  const editing = params.get('t')
  const pOnly: Record<string, string> = params.get('p') ? { p: params.get('p')! } : {}
  // Station mode: the athlete's own choice of variations, in the order they will do them.
  const here = (v: string | null) => v?.split(',').filter((id) => testById[id] && stationOfTest[id] === st.id) ?? null
  const queue = here(params.get('q'))
  /** Picked in the list and not yet started. Kept in the address, so going into a test and back loses nothing. */
  const chosen = here(params.get('c')) ?? []
  const guide = params.get('guide') === '1'
  const picking = mode === 'stations'
  const withChosen = (ids: string[]): Record<string, string> => ({ ...pOnly, ...(ids.length ? { c: ids.join(',') } : {}) })
  /** Begun from the level the athlete thought was their hardest: what is "harder" is then the level above, as the list shows it. */
  const ladder = params.get('l') === '1'
  const withQueue = (ids: string[]): Record<string, string> => ({ ...pOnly, q: ids.join(','), ...(ladder ? { l: '1' } : {}) })
  const harderOf = (t: AssessmentTest) => (ladder ? levelAbove(t, target.results, queue ?? []) : harderThan(t))

  if (picking && !queue && !editing && !guide)
    return (
      <StationMenu
        station={st.id}
        results={target.results}
        chosen={chosen.filter((id) => !target.results[id])}
        onChoose={(ids) => setParams(withChosen(ids), { replace: true })}
        forName={forOther ? target.name : undefined}
        onStart={(ids, fromLevel) => setParams({ ...pOnly, q: ids.join(','), ...(fromLevel ? { l: '1' } : {}) })}
        onEdit={(id) => setParams({ ...withChosen(chosen), t: id })}
        onGuide={() => setParams({ ...pOnly, guide: '1' })}
        onClose={() => navigate(exit)}
        skipped={target.skipped.includes(st.id)}
        onSkip={forOther ? undefined : () => { toggleStationSkip(target.id, st.id); navigate(exit) }}
      />
    )

  const queued = queue?.map((id) => testById[id]) ?? null
  const current = (editing && testById[editing]) || (queued ? queued.find((t) => !target.results[t.id]) : nextTest(st, target.results))
  const visible = queued ?? visibleTests(st, target.results)
  const recorded = visible.filter((t) => target.results[t.id])
  const color = dvar(st.id)
  const keep = params.get('p') ? `?p=${params.get('p')}` : ''
  const nextStation = session.stations.find((s) => s !== st.id && ['todo', 'active'].includes(stationProgress(stationById[s], target.results, target.skipped, mode).state))
  /** Back from a test is back to where it was chosen: this area's list, with what is still to do kept. Guided by a coach, there is no list: the overview. */
  const remaining = (queue ?? chosen).filter((id) => !target.results[id])
  const backToMenu = () => setParams(withChosen(remaining), { replace: true })
  const back = picking ? backToMenu : () => navigate(exit)

  const record = (test: AssessmentTest, value: number, skipped = false) => {
    recordResult(target.id, test.id, value, { tier: forOther ? 'observed' : 'self', skipped })
    if (sound && !skipped) tick()
    if (editing) setParams(queue ? withQueue(queue) : picking && !guide ? withChosen(chosen) : { ...pOnly, ...(guide ? { guide: '1' } : {}) }, { replace: true })
    // Past the range: suggest the next variation, once, without stopping anyone.
    const harder = !skipped && beyondTarget(test, value) ? harderOf(test) : null
    if (harder && !target.results[harder.id] && !queue?.includes(harder.id) && (queue || mode === 'stations')) setNudge({ test, harder, value })
  }

  // Everything chosen has been done: straight back to the areas, where this one now shows what was recorded.
  if (picking && queue && !current && !nudge) return <Navigate to={exit} replace />
  const step = queued && current ? queued.findIndex((t) => t.id === current.id) : -1

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[560px] flex-col bg-bg">
      <div className="page-glow" />
      <header className="safe-top relative z-10 shrink-0 px-4">
        <div className="flex h-14 items-center justify-between">
          <button onClick={back} aria-label={picking ? `Back to ${disciplineById[st.id].short}` : 'Back to the overview'} className="pressable flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-2"><ArrowLeft size={18} /></button>
          <div className="min-w-0 px-3 text-center">
            <div className="flex items-center justify-center gap-2 truncate text-[13.5px] font-medium"><DisciplineDot id={st.id} size={7} />{disciplineById[st.id].name}</div>
            <div className="truncate text-[11.5px] text-ink-3">{forOther ? `Recording for ${target.name} · counts as coach-observed` : step >= 0 && queued!.length > 1 ? `${step + 1} of ${queued!.length}` : session.groupName}</div>
          </div>
          <span className="w-10" />
        </div>
        <div className="flex gap-1">
          {visible.map((t) => (
            <span key={t.id} className="h-1 flex-1 rounded-full" style={{ background: target.results[t.id] ? color : t.id === current?.id ? 'var(--line-strong)' : 'var(--surface-3)' }} />
          ))}
        </div>
      </header>

      {nudge ? (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5">
          <div className="rise flex flex-1 flex-col justify-center">
            <Eyebrow>Above the suggested range</Eyebrow>
            <h1 className="display mt-2 text-[34px] leading-[1.06]">You may be ready for {exerciseById[nudge.harder.exerciseId].name}.</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
              You recorded {resultLabel(nudge.test, nudge.value)} on {exerciseById[nudge.test.exerciseId].name}, past the suggested {targetLabel(nudge.test)}. It is saved as it is. A harder variation usually shows more of what you can do than more repetitions of this one.
            </p>
            <p className="mt-2 text-[13px] text-ink-3">{exerciseById[nudge.harder.exerciseId].name}: {targetLabel(nudge.harder)} suggested.{ladder && (queue?.filter((id) => !target.results[id] && id !== nudge.test.id).length ?? 0) > 0 ? ' The easier levels come after it, either way.' : ''}</p>
          </div>
          <div className="space-y-2.5 pt-6">
            <button className="btn btn-primary btn-lg w-full" onClick={() => {
              const at = queue ? queue.indexOf(nudge.test.id) + 1 : 0
              const next = queue ? [...queue.slice(0, at), nudge.harder.id, ...queue.slice(at)] : [nudge.harder.id]
              setNudge(null)
              setParams(withQueue(next), { replace: true })
            }}>Try {exerciseById[nudge.harder.exerciseId].name} <ArrowRight size={17} /></button>
            <button className="btn btn-outline w-full" onClick={() => setNudge(null)}>Not now</button>
          </div>
        </div>
      ) : current ? (
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
          harder={harderOf(current)}
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
            <p className="mt-2 text-[14px] text-ink-2">{recorded.length} {recorded.length === 1 ? 'benchmark' : 'benchmarks'} on record. Tap any of them to correct it.</p>
          </div>
          <div className="rise rise-1 card mt-5 divide-y divide-line">
            {recorded.map((t) => {
              const r = target.results[t.id]
              const reading = resultReading(t, r.value, r.skipped)
              return (
                <button key={t.id} className="flex w-full items-center gap-3 px-4 py-3 text-left first:rounded-t-card last:rounded-b-card hover:bg-surface-2" onClick={() => setParams({ ...(params.get('p') ? { p: params.get('p')! } : {}), t: t.id })}>
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
            {(queue || mode === 'stations') && <button className="btn btn-outline w-full" onClick={backToMenu}>Choose more variations at {disciplineById[st.id].short}</button>}
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
  test, index, total, initial, color, onRecord, onSkip, footer, harder,
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
  harder?: AssessmentTest | null
}) {
  const ex = exerciseById[test.exerciseId]
  const hold = test.kind === 'max' && ex.metric === 'hold'
  const [value, setValue] = useState(initial ?? 0)
  const [choice, setChoice] = useState<number | null>(initial ?? null)
  const [started, setStarted] = useState<number | null>(null)
  const now = useNow(200, started !== null)
  const elapsed = started ? Math.max(0, Math.floor((now - started) / 1000)) : 0
  const shown = started ? elapsed : value
  // A sanity bound for typing, not a ceiling on performance.
  const limit = hold ? 3600 : 1000

  const bump = (d: number) => setValue((v) => Math.max(0, Math.min(limit, v + d)))
  const reading = test.kind === 'max' && shown > 0 ? resultReading(test, shown) : null

  // Where the official demonstration exists, it is the screen: the test is written over it.
  const staged = useHasDemo(ex.id) && test.kind !== 'choice'
  const [watching, setWatching] = useState(false)
  // A result put on record: the instructor activates before the assessment moves on. "Not yet" passes quietly.
  const { count: bursts, bursting, burst } = useBurst(setWatching)
  const recordNow = () => (staged && value > 0 ? burst(() => onRecord(value)) : onRecord(value))
  const start = () => { setValue(0); setStarted(Date.now()); setWatching(true) }
  const stop = () => { setValue(Math.min(limit, Math.max(1, elapsed))); setStarted(null); setWatching(false) }
  const primary = started ? (
    <button className="btn btn-accent btn-lg w-full" onClick={stop}><Pause size={16} fill="currentColor" /> Stop at {elapsed}s</button>
  ) : (
    <div className="flex gap-2.5">
      {hold && <button className={cx('btn btn-lg', value ? 'btn-outline flex-1' : 'btn-primary flex-[1.4]')} onClick={start}><Play size={15} fill="currentColor" /> {value ? 'Again' : 'Start timer'}</button>}
      <button className={cx('btn btn-lg', hold && !value ? 'btn-outline flex-1' : 'btn-primary flex-[1.4]')} disabled={bursting} onClick={recordNow}>
        <Check size={17} strokeWidth={2.6} /> {value === 0 ? 'Not yet' : `Record ${value}${hold ? 's' : ''}`}
      </button>
    </div>
  )
  const readingLine = reading ? <>Reads <span className="num font-medium" style={{ color }}>{reading.points}</span> · {reading.band} range</> : null

  if (staged) {
    const benchmark = `Benchmark ${index + 1}${index + 1 < total ? ` of ${total}` : ''}`
    return (
      <StageScreen
        exerciseId={ex.id} official focus={watching} onFocus={setWatching} burst={bursts}
        top={
          <div className="rise px-5 pt-5 pb-1">
            <Eyebrow>{benchmark}{index + 1 >= total && index === 0 ? ' · the next depends on this one' : ''}</Eyebrow>
            <h1 className="display mt-1.5 text-[30px] leading-[1.04]">{ex.name}</h1>
            <p className="mt-2 text-[14.5px] leading-snug">{test.prompt}</p>
            {ex.standard && <p className="mt-2 border-l-2 pl-3 text-[12.5px] leading-snug text-ink-2" style={{ borderColor: color }}>Counts when: {ex.standard}</p>}
            {ex.safety && <p className="mt-1.5 text-[12px] leading-snug text-warn">{ex.safety}</p>}
          </div>
        }
        bottom={
          <div className="safe-bottom px-5 pt-1 pb-4">
            <div className="flex flex-col items-center">
              <div className="flex items-baseline justify-center">
                <input
                  aria-label={hold ? 'Seconds' : 'Repetitions'} type="number" inputMode="numeric" min={0} max={limit} disabled={!!started}
                  value={shown === 0 && !started ? '' : shown} placeholder="0"
                  onChange={(e) => setValue(Math.max(0, Math.min(limit, Math.round(Number(e.target.value) || 0))))}
                  style={{ width: `${String(shown || 0).length * 0.5 + 0.25}em` }}
                  className="display num bg-transparent text-center text-[72px] leading-none outline-none placeholder:text-ink-3 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                {hold && <span className="text-[17px] text-ink-3">s</span>}
              </div>
              {harder && beyondTarget(test, shown) && <div className="mt-1 text-center text-[12.5px] font-medium" style={{ color }}>Past the suggested range. You may be ready for {exerciseById[harder.exerciseId].name}.</div>}
              <div className="mt-1 min-h-5 text-center text-[12.5px] text-ink-2">
                {readingLine ?? <span className="text-ink-3">{test.target ? `Suggested: ${targetLabel(test)}. ` : ''}{hold ? 'Time it, or type the seconds' : 'Type it, or count up below'}</span>}
              </div>
              <div className="mt-2.5 flex gap-2">
                <button className="btn btn-quiet btn-sm !px-3" onClick={() => bump(hold ? -5 : -1)} aria-label="Less"><Minus size={14} />{hold ? 5 : 1}</button>
                <button className="btn btn-quiet btn-sm !px-3" onClick={() => bump(1)} aria-label="Plus one"><Plus size={14} />1</button>
                <button className="btn btn-quiet btn-sm !px-3" onClick={() => bump(5)} aria-label="Plus five"><Plus size={14} />5</button>
                <button className="btn btn-quiet btn-sm !px-3" onClick={() => bump(10)} aria-label="Plus ten"><Plus size={14} />10</button>
              </div>
            </div>
            <div className="mt-4">{primary}</div>
            <div className="mt-3 flex items-center justify-between text-[12.5px] text-ink-2">
              <button className="flex h-8 items-center hover:text-ink" onClick={onSkip}>Can’t test this today</button>
              {footer}
            </div>
          </div>
        }
        miniTop={
          <div className="px-5 pt-5">
            <Eyebrow>{benchmark}</Eyebrow>
            <div className="display mt-1 text-[24px] leading-tight">{ex.name}</div>
          </div>
        }
        miniBottom={
          <div className="safe-bottom px-5 pb-4">
            {(started || value > 0) && (
              <div className="mb-3 text-center" aria-live="off">
                <span className="display num text-[84px] leading-none">{shown}</span>{hold && <span className="ml-1 text-[18px] text-ink-3">s</span>}
                {readingLine && <div className="mt-1 text-[12.5px] text-ink-2">{readingLine}</div>}
              </div>
            )}
            {primary}
          </div>
        }
      />
    )
  }

  return (
    <>
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-3">
        <div className="rise pt-6">
          <Eyebrow>Benchmark {index + 1}{index + 1 < total ? ` of ${total}` : index === 0 ? ' · the next depends on this one' : ''}</Eyebrow>
          <h1 className="display mt-2 text-[36px] leading-[1.04]">{ex.name}</h1>
          <p className="mt-3 text-[15.5px] leading-relaxed">{test.prompt}</p>
          {ex.standard && test.kind === 'max' && <p className="mt-2 border-l-2 pl-3 text-[13px] leading-snug text-ink-2" style={{ borderColor: color }}>Counts when: {ex.standard}</p>}
          {test.target && test.kind === 'max' && <p className="mt-2 text-[12.5px] text-ink-3">Suggested: {targetLabel(test)}. Record what you actually do, even past it.</p>}
          {ex.safety && <p className="mt-2 text-[12.5px] leading-snug text-warn">{ex.safety}</p>}
          {/* The official demonstration: the same character and presentation for every athlete. */}
          <DemoSlot key={ex.id} exerciseId={ex.id} official className="mt-4" />
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
            {harder && beyondTarget(test, shown) && <div className="mt-1 text-[12.5px] font-medium" style={{ color }}>Past the suggested range. You may be ready for {exerciseById[harder.exerciseId].name}.</div>}
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
        ) : primary}
        <div className="mt-3 flex items-center justify-between text-[12.5px] text-ink-2">
          <button className="flex h-8 items-center hover:text-ink" onClick={onSkip}>Can’t test this today</button>
          {footer}
        </div>
      </footer>
    </>
  )
}
