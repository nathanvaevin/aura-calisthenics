import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, List, Minus, Pause, Play, Plus, RotateCcw, SkipForward } from 'lucide-react'
import type { LogEntry } from '@/domain/types'
import { exerciseById, formatValue, progressionById, stepAt } from '@/domain/catalog'
import { candidatesIn, useStore, type ActiveWorkout } from '@/data/store'
import { useNow } from '@/data/hooks'
import { MuscleMap } from '@/ui/MuscleMap'
import { Eyebrow, Ring, Sheet, Stepper, Toggle } from '@/ui/primitives'
import { VideoEmbed } from '@/features/library/ExerciseDetail'
import { tick } from '@/lib/sound'
import { KIND_LABEL, clock, cx, dvar } from '@/lib/format'

/** Where to land once the session ends. Set just before the store clears the active workout. */
const exit = { to: null as string | null }

export function WorkoutPlayer() {
  const active = useStore((s) => s.active)
  if (!active) return <Navigate to={exit.to ?? '/train'} replace />
  exit.to = null
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[560px] flex-col bg-bg">
      <div className="page-glow" />
      {active.phase === 'summary' ? <Summary a={active} /> : <Live a={active} />}
    </div>
  )
}

const bounds = (entry: LogEntry) => {
  const steps = entry.progressionId ? progressionById[entry.progressionId]?.steps.length ?? 0 : 0
  return { steps, min: Math.max(1, entry.minLevel ?? 1), max: Math.min(steps, entry.maxLevel ?? steps) }
}

// ── Live session ─────────────────────────────────────────────────────────

function Live({ a }: { a: ActiveWorkout }) {
  const navigate = useNavigate()
  const setVariation = useStore((s) => s.setVariation)
  const completeSet = useStore((s) => s.completeSet)
  const undoSet = useStore((s) => s.undoSet)
  const goTo = useStore((s) => s.goTo)
  const endRest = useStore((s) => s.endRest)
  const extendRest = useStore((s) => s.extendRest)
  const toSummary = useStore((s) => s.toSummary)
  const discard = useStore((s) => s.discardWorkout)
  const sound = useStore((s) => s.settings.sound)
  const media = useStore((s) => s.media)

  const [dir, setDir] = useState(1)
  const [listOpen, setListOpen] = useState(false)
  const [howOpen, setHowOpen] = useState(false)

  const entries = a.log.entries
  const entry = entries[a.index]
  const ex = exerciseById[entry.exerciseId]
  const assigned = exerciseById[entry.assignedExerciseId]
  const color = dvar(ex.discipline)
  const setIdx = entry.sets.findIndex((s) => !s.done)
  const resting = a.phase === 'rest'
  const { steps, min, max } = bounds(entry)
  const hasLadder = steps > 0 && entry.level !== undefined
  const planned = a.log.source.type === 'course' ? 'assigned' : 'planned'

  const now = useNow(resting ? 200 : 1000)
  const remaining = resting && a.restUntil ? Math.max(0, (a.restUntil - now) / 1000) : 0
  useEffect(() => {
    if (resting && a.restUntil && now >= a.restUntil) {
      if (sound) tick()
      endRest()
    }
  }, [resting, a.restUntil, now, sound, endRest])

  // The value being logged for the current set. Resets whenever the set or variation changes.
  const [value, setValue] = useState(entry.target)
  const [timerStart, setTimerStart] = useState<number | null>(null)
  useEffect(() => {
    setValue(entry.target)
    setTimerStart(null)
  }, [a.index, entry.exerciseId, setIdx, entry.target])

  const tnow = useNow(200, timerStart !== null)
  const elapsed = timerStart ? Math.max(0, Math.floor((tnow - timerStart) / 1000)) : 0
  useEffect(() => {
    if (timerStart && elapsed === entry.target && sound) tick()
  }, [elapsed, timerStart, entry.target, sound])

  const change = (delta: number) => {
    if (!hasLadder) return
    const next = entry.level! + delta
    if (next < min || next > max) return
    setDir(delta)
    setVariation(a.index, next)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowLeft') change(-1)
      if (e.key === 'ArrowRight') change(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const doneSets = entries.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)
  const totalSets = entries.reduce((n, e) => n + e.sets.length, 0)
  const nextOpen = (() => {
    for (let i = 1; i <= entries.length; i++) {
      const idx = (a.index + i) % entries.length
      if (idx !== a.index && entries[idx].sets.some((s) => !s.done)) return idx
    }
    return -1
  })()
  const skip = () => (nextOpen >= 0 ? goTo(nextOpen) : toSummary())

  const step = hasLadder ? stepAt(entry.progressionId!, entry.level!) : null
  const sameLevel = step ? [step.exerciseId, ...(step.alternates ?? [])] : []
  const easier = hasLadder && entry.level! > min ? stepAt(entry.progressionId!, entry.level! - 1) : null
  const harder = hasLadder && entry.level! < max ? stepAt(entry.progressionId!, entry.level! + 1) : null
  const offset = hasLadder && entry.assignedLevel ? entry.level! - entry.assignedLevel : 0
  const changed = entry.exerciseId !== entry.assignedExerciseId
  const hold = ex.metric === 'hold'
  const unit = hold ? 's' : ex.perSide ? '/side' : ''

  return (
    <>
      {/* Top bar */}
      <header className="safe-top relative z-10 shrink-0 px-4">
        <div className="flex h-14 items-center justify-between">
          <button onClick={() => navigate('/')} aria-label="Minimise session" className="pressable flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-2">
            <ChevronDown size={19} />
          </button>
          <div className="min-w-0 px-3 text-center">
            <div className="truncate text-[13.5px] font-medium">{a.log.title}</div>
            <div className="num text-[11.5px] text-ink-3">{clock((now - new Date(a.log.startedAt).getTime()) / 1000)} · {doneSets}/{totalSets} sets</div>
          </div>
          <button onClick={() => setListOpen(true)} aria-label="Session overview" className="pressable flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-2">
            <List size={18} />
          </button>
        </div>
        <div className="flex gap-1">
          {entries.map((e, i) => {
            const d = e.sets.filter((s) => s.done).length / e.sets.length
            return (
              <button key={e.blockId} onClick={() => goTo(i)} aria-label={`Go to ${exerciseById[e.exerciseId].name}`} className="h-3 flex-1 py-1">
                <span className={cx('block h-1 overflow-hidden rounded-full', i === a.index ? 'bg-line-strong' : 'bg-surface-3')}>
                  <span className="block h-full rounded-full transition-all duration-500" style={{ width: `${d * 100}%`, background: i === a.index ? 'var(--text)' : 'var(--text-3)' }} />
                </span>
              </button>
            )
          })}
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-3">
        {/* Rest */}
        {resting && (
          <div className="flex flex-col items-center pt-5">
            <Ring value={a.restTotal ? remaining / a.restTotal : 0} size={184} stroke={4}>
              <span className="flex flex-col items-center">
                <Eyebrow>Rest</Eyebrow>
                <span className="display num mt-1 text-[58px] leading-none">{clock(Math.ceil(remaining))}</span>
              </span>
            </Ring>
            <div className="mt-4 flex gap-2">
              <button className="btn btn-quiet btn-sm" onClick={() => extendRest(-15)} disabled={remaining <= 15}>−15s</button>
              <button className="btn btn-quiet btn-sm" onClick={() => extendRest(15)}>+15s</button>
            </div>
          </div>
        )}

        {/* Exercise */}
        <div className={cx(resting ? 'mt-6' : 'mt-5')}>
          <Eyebrow className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            {resting ? 'Up next' : KIND_LABEL[entry.kind]} · {a.index + 1} of {entries.length}
          </Eyebrow>
          <div className="relative mt-2 min-h-[44px] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.h1
                key={ex.id}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d * 36, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d * -36, opacity: 0 }),
                }}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className={cx('display', resting ? 'text-[30px]' : 'text-[38px]')}
              >
                {ex.name}
              </motion.h1>
            </AnimatePresence>
          </div>
          {entry.note && !resting && <p className="mt-2 border-l-2 pl-3 text-[13.5px] leading-snug text-ink-2" style={{ borderColor: color }}>{entry.note}</p>}
        </div>

        {/* ← EASIER | LEVEL | HARDER → */}
        {hasLadder ? (
          <div className="mt-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-stretch overflow-hidden rounded-[22px] border border-line bg-surface">
              <button onClick={() => change(-1)} disabled={!easier} aria-label="Easier variation" className="flex min-w-0 flex-col items-start justify-center gap-1 px-3.5 py-3 text-left transition-colors hover:bg-surface-2 active:bg-surface-3 disabled:opacity-30">
                <span className="flex items-center gap-0.5 font-mono text-[10px] font-medium tracking-[0.14em] text-ink uppercase"><ChevronLeft size={14} strokeWidth={2.4} />Easier</span>
                <span className="w-full truncate text-[11.5px] text-ink-3">{easier ? exerciseById[easier.exerciseId].short : entry.level === 1 ? 'Lowest level' : 'Limit set'}</span>
              </button>
              <div className="flex min-w-[108px] flex-col items-center justify-center border-x border-line px-4 py-2.5">
                <span className="font-mono text-[9.5px] tracking-[0.16em] text-ink-3 uppercase">Level</span>
                <span className="relative block h-[40px] overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <motion.span
                      key={entry.level}
                      custom={dir}
                      variants={{ enter: (d: number) => ({ y: d * 26, opacity: 0 }), center: { y: 0, opacity: 1 }, exit: (d: number) => ({ y: d * -26, opacity: 0 }) }}
                      initial="enter" animate="center" exit="exit" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="display num block text-[40px] leading-none" style={{ color }}
                    >
                      {entry.level}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="num text-[10.5px] text-ink-3">of {steps}</span>
              </div>
              <button onClick={() => change(1)} disabled={!harder} aria-label="Harder variation" className="flex min-w-0 flex-col items-end justify-center gap-1 px-3.5 py-3 text-right transition-colors hover:bg-surface-2 active:bg-surface-3 disabled:opacity-30">
                <span className="flex items-center gap-0.5 font-mono text-[10px] font-medium tracking-[0.14em] text-ink uppercase">Harder<ChevronRight size={14} strokeWidth={2.4} /></span>
                <span className="w-full truncate text-[11.5px] text-ink-3">{harder ? exerciseById[harder.exerciseId].short : entry.level === steps ? 'Top level' : 'Limit set'}</span>
              </button>
            </div>

            <div className="mt-2 flex gap-1">
              {Array.from({ length: steps }, (_, i) => {
                const l = i + 1
                const allowed = l >= min && l <= max
                return (
                  <span key={l} className="relative h-1 flex-1 rounded-full" style={{ background: l === entry.level ? color : allowed ? 'var(--surface-3)' : 'transparent', outline: allowed ? undefined : '1px dashed var(--line)' }}>
                    {l === entry.assignedLevel && <span className="absolute top-[7px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink-3" />}
                  </span>
                )
              })}
            </div>

            <div className="mt-3.5 flex min-h-[20px] items-center justify-between gap-3 text-[12px]">
              {changed ? (
                <>
                  <span className="min-w-0 truncate text-ink-2">
                    {offset !== 0 && (
                      <span className="font-medium" style={{ color }}>{Math.abs(offset)} {Math.abs(offset) === 1 ? 'level' : 'levels'} {offset > 0 ? 'harder' : 'easier'}</span>
                    )}
                    {offset === 0 && <span className="font-medium" style={{ color }}>Same level</span>} than {planned} · {assigned.short}
                  </span>
                  <button className="flex shrink-0 items-center gap-1 text-ink-3 hover:text-ink" onClick={() => { setDir(offset > 0 ? -1 : 1); setVariation(a.index, entry.assignedLevel ?? entry.level!, entry.assignedExerciseId) }}>
                    <RotateCcw size={11} /> Reset
                  </button>
                </>
              ) : (
                <span className="text-ink-3">As {planned}{min !== max ? ` · adjust between levels ${min} and ${max}` : ' · level locked by your coach'}</span>
              )}
            </div>

            {sameLevel.length > 1 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[11.5px] text-ink-3">Same level:</span>
                {sameLevel.map((id) => (
                  <button key={id} className="chip !h-7 !px-2.5 !text-[12px]" data-on={id === entry.exerciseId} onClick={() => { setDir(1); setVariation(a.index, entry.level!, id) }}>
                    {exerciseById[id].short}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          !resting && (
            <ul className="mt-5 space-y-2.5">
              {ex.cues.map((c) => (
                <li key={c} className="flex gap-3 text-[14px] leading-snug text-ink-2"><span className="mt-[8px] h-1 w-1 shrink-0 rounded-full" style={{ background: color }} />{c}</li>
              ))}
            </ul>
          )
        )}

        {/* Technique, in the space between the controls */}
        {!resting && hasLadder && (
          <div className="mt-5">
            <Eyebrow className="mb-2.5">Technique</Eyebrow>
            <ul className="space-y-2">
              {ex.cues.slice(0, 3).map((c) => (
                <li key={c} className="flex gap-3 text-[13.5px] leading-snug text-ink-2"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: color }} />{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Sets + value */}
        {!resting && (
          <div className="mt-auto pt-5">
            <div className="flex items-center justify-center gap-2">
              {entry.sets.map((s, i) => (
                <span
                  key={i}
                  className={cx('num flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[12.5px] font-medium', s.done ? 'text-bg' : i === setIdx ? 'border-[1.5px] text-ink' : 'border border-line text-ink-3')}
                  style={s.done ? { background: color } : i === setIdx ? { borderColor: color } : undefined}
                  title={s.done ? exerciseById[s.exerciseId].name : undefined}
                >
                  {s.done ? s.value : i + 1}
                </span>
              ))}
            </div>

            {setIdx >= 0 ? (
              <div className="mt-4 flex flex-col items-center">
                {hold ? (
                  <>
                    <div className="flex items-center gap-5">
                      <button className="pressable flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface disabled:opacity-30" disabled={!!timerStart} onClick={() => setValue(Math.max(1, value - 5))} aria-label="Less time"><Minus size={20} /></button>
                      <span className="display num min-w-[130px] text-center text-[76px] leading-none">
                        {timerStart ? elapsed : value}<span className="ml-1 font-sans text-[18px] text-ink-3">s</span>
                      </span>
                      <button className="pressable flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface disabled:opacity-30" disabled={!!timerStart} onClick={() => setValue(value + 5)} aria-label="More time"><Plus size={20} /></button>
                    </div>
                    <div className="mt-3 h-1 w-44 overflow-hidden rounded-full bg-surface-3">
                      <div className="h-full rounded-full transition-all duration-200" style={{ width: `${Math.min(1, (timerStart ? elapsed : 0) / entry.target) * 100}%`, background: color }} />
                    </div>
                  </>
                ) : (
                  <Stepper value={value} onChange={setValue} min={0} max={999} size="lg" suffix={ex.perSide ? '/side' : ''} />
                )}
                <div className="mt-2 text-[12.5px] text-ink-3">
                  Set {setIdx + 1} of {entry.sets.length} · target {entry.target}{unit}
                  {entry.target !== entry.assignedTarget && changed && <span> (adjusted for this variation)</span>}
                </div>
              </div>
            ) : (
              <p className="mt-5 text-center text-[14px] text-ink-2">All sets logged for this exercise.</p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <footer className="safe-bottom relative z-10 shrink-0 px-5 pt-2 pb-4">
        {resting ? (
          <button className="btn btn-primary btn-lg w-full" onClick={endRest}><SkipForward size={16} /> Skip rest</button>
        ) : setIdx < 0 ? (
          <button className="btn btn-primary btn-lg w-full" onClick={skip}>{nextOpen >= 0 ? 'Next exercise' : 'Finish session'} <ArrowRight size={16} /></button>
        ) : hold && timerStart ? (
          <button className="btn btn-accent btn-lg w-full" onClick={() => { setValue(Math.max(1, elapsed)); setTimerStart(null) }}><Pause size={16} fill="currentColor" /> Stop at {elapsed}s</button>
        ) : (
          <div className="flex gap-2.5">
            {hold && (
              <button className="btn btn-outline btn-lg flex-1" onClick={() => setTimerStart(Date.now())}><Play size={15} fill="currentColor" /> Start timer</button>
            )}
            <button className="btn btn-primary btn-lg flex-[1.4]" onClick={() => completeSet(value)}><Check size={17} strokeWidth={2.6} /> Complete set</button>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between text-[12.5px] text-ink-2">
          <button className="flex h-8 items-center gap-1.5 hover:text-ink disabled:opacity-30" disabled={a.trail.length === 0} onClick={undoSet}><RotateCcw size={12} /> Undo set</button>
          <button className="h-8 font-medium text-ink underline decoration-line-strong underline-offset-4" onClick={() => setHowOpen(true)}>{media[ex.id] ? 'Video & technique' : 'Technique'}</button>
          <button className="flex h-8 items-center gap-1.5 hover:text-ink" onClick={skip}>Skip <SkipForward size={12} /></button>
        </div>
      </footer>

      {/* Session overview */}
      <Sheet open={listOpen} onClose={() => setListOpen(false)} eyebrow={`${doneSets} of ${totalSets} sets`} title={a.log.title}>
        <div className="card divide-y divide-line">
          {entries.map((e, i) => {
            const x = exerciseById[e.exerciseId]
            const d = e.sets.filter((s) => s.done).length
            return (
              <button key={e.blockId} onClick={() => { goTo(i); setListOpen(false) }} className={cx('flex w-full items-center gap-3 px-4 py-3 text-left first:rounded-t-[22px] last:rounded-b-[22px] hover:bg-surface-2', i === a.index && 'bg-surface-2')}>
                <Ring value={d / e.sets.length} size={34} stroke={2.5} color={dvar(x.discipline)}>
                  {d === e.sets.length ? <Check size={13} strokeWidth={3} /> : <span className="num text-[11px]">{i + 1}</span>}
                </Ring>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium">{x.name}</span>
                  <span className="block truncate text-[12px] text-ink-3">
                    {KIND_LABEL[e.kind]}{e.level ? ` · Level ${e.level}` : ''}{e.exerciseId !== e.assignedExerciseId ? ` (${planned} ${exerciseById[e.assignedExerciseId].short})` : ''}
                  </span>
                </span>
                <span className="num text-[12.5px] text-ink-2">{e.sets.length} × {e.target}{x.metric === 'hold' ? 's' : ''}</span>
              </button>
            )
          })}
        </div>
        <button className="btn btn-primary mt-5 w-full" onClick={() => { setListOpen(false); toSummary() }}>Finish session</button>
        <button
          className="btn btn-outline mt-2.5 w-full"
          onClick={() => {
            if (window.confirm('Discard this session? Nothing from it will be saved.')) {
              exit.to = '/'
              discard()
            }
          }}
        >
          Discard session
        </button>
      </Sheet>

      {/* Technique */}
      <Sheet open={howOpen} onClose={() => setHowOpen(false)} eyebrow={ex.category} title={ex.name}>
        {media[ex.id] && <div className="mb-4"><VideoEmbed url={media[ex.id]} /></div>}
        <p className="text-[14.5px] leading-relaxed text-ink-2">{ex.summary}</p>
        <ol className="mt-5 space-y-3">
          {ex.cues.map((c, i) => (
            <li key={c} className="flex gap-3.5"><span className="display num mt-[-3px] w-5 shrink-0 text-[22px]" style={{ color }}>{i + 1}</span><span className="text-[14.5px] leading-relaxed">{c}</span></li>
          ))}
        </ol>
        <Eyebrow className="mt-6 mb-2.5">Common mistakes</Eyebrow>
        <ul className="space-y-1.5">
          {ex.mistakes.map((m) => <li key={m} className="flex gap-3 text-[13.5px] leading-relaxed text-ink-2"><span className="mt-[9px] h-px w-3 shrink-0 bg-ink-3" />{m}</li>)}
        </ul>
        {ex.safety && (
          <div className="mt-5 flex gap-3 rounded-[18px] border border-warn/30 bg-warn/8 p-3.5">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />
            <p className="text-[13px] leading-relaxed text-ink-2">{ex.safety}</p>
          </div>
        )}
        <div className="mt-5 flex justify-center"><MuscleMap primary={ex.primary} secondary={ex.secondary} stabilizers={ex.stabilizers} color={color} height={190} /></div>
      </Sheet>
    </>
  )
}

// ── Summary ──────────────────────────────────────────────────────────────

function Summary({ a }: { a: ActiveWorkout }) {
  const evidence = useStore((s) => s.evidence)
  const finish = useStore((s) => s.finishWorkout)
  const goTo = useStore((s) => s.goTo)
  const discard = useStore((s) => s.discardWorkout)

  const candidates = useMemo(() => candidatesIn(a.log, evidence), [a.log, evidence])
  const [off, setOff] = useState<Record<string, boolean>>({})
  const [rpe, setRpe] = useState<number | undefined>()
  const [note, setNote] = useState('')

  const performed = a.log.entries.filter((e) => e.sets.some((s) => s.done))
  const sets = performed.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)
  const open = a.log.entries.findIndex((e) => e.sets.some((s) => !s.done))
  const minutes = Math.max(1, Math.round((Date.now() - new Date(a.log.startedAt).getTime()) / 60000))
  const claims = candidates.filter((c) => !off[c.exerciseId])
  const planned = a.log.source.type === 'course' ? 'Assigned' : 'Planned'

  const save = () => {
    const source = a.log.source
    exit.to = source.type === 'course' ? `/train/course/${source.courseId}` : '/'
    finish({ rpe, note, claims })
  }

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      <div className="safe-top min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <div className="rise pt-10">
          <Eyebrow>{open >= 0 ? 'Session summary' : 'Session complete'}</Eyebrow>
          <h1 className="display mt-2 text-[44px]">{a.log.title}</h1>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[['Minutes', minutes], ['Exercises', performed.length], ['Sets', sets]].map(([l, v]) => (
              <div key={l} className="card px-3.5 py-3"><Eyebrow>{l}</Eyebrow><div className="display num mt-1 text-[30px]">{v}</div></div>
            ))}
          </div>
        </div>

        {performed.length === 0 ? (
          <p className="mt-8 text-[14px] text-ink-2">No sets were logged, so there is nothing to save yet.</p>
        ) : (
          <>
            {candidates.length > 0 && (
              <section className="rise rise-1 mt-7">
                <Eyebrow className="mb-1.5">New bests in this session</Eyebrow>
                <p className="mb-3 text-[13px] leading-snug text-ink-2">
                  Training is saved either way. Mastery only moves when you put a performance on record, so choose which of these count.
                </p>
                <div className="card divide-y divide-line">
                  {candidates.map((c) => {
                    const x = exerciseById[c.exerciseId]
                    return (
                      <div key={c.exerciseId} className="flex items-start gap-3 p-4">
                        <div className="min-w-0 flex-1">
                          <div className="text-[14.5px] font-medium">{x.name}</div>
                          <div className="num mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-2">
                            {c.previous ? formatValue(x, c.previous) : 'No record'} <ArrowRight size={12} className="text-ink-3" />
                            <span className="font-semibold" style={{ color: dvar(x.discipline) }}>{formatValue(x, c.value, true)}</span>
                          </div>
                          {x.standard && <div className="mt-1.5 text-[12px] leading-snug text-ink-3">Counts when: {x.standard}</div>}
                        </div>
                        <Toggle on={!off[c.exerciseId]} onChange={(v) => setOff({ ...off, [c.exerciseId]: !v })} label={`Record ${x.name}`} />
                      </div>
                    )
                  })}
                </div>
                <p className="mt-2 text-[12px] text-ink-3">Recorded as self-reported. Your coach can verify them from this session.</p>
              </section>
            )}

            <section className="rise rise-2 mt-7">
              <Eyebrow className="mb-3">What you did</Eyebrow>
              <div className="card divide-y divide-line">
                {performed.map((e) => {
                  const done = e.sets.filter((s) => s.done)
                  const names = [...new Set(done.map((s) => s.exerciseId))]
                  const x = exerciseById[names[names.length - 1]]
                  const differs = names.some((n) => n !== e.assignedExerciseId)
                  return (
                    <div key={e.blockId} className="px-4 py-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 truncate text-[14px] font-medium">{names.map((n) => exerciseById[n].name).join(' → ')}</span>
                        <span className="num shrink-0 text-[13px] text-ink-2">{done.map((s) => s.value).join(' · ')}{x.metric === 'hold' ? ' s' : ''}</span>
                      </div>
                      <div className="mt-0.5 text-[12px] text-ink-3">
                        {differs ? (
                          <>{planned} {exerciseById[e.assignedExerciseId].name}{e.assignedLevel ? ` (L${e.assignedLevel})` : ''} · done at L{done[done.length - 1].level}</>
                        ) : (
                          <>{e.level ? `Level ${e.level} · ` : ''}as {planned.toLowerCase()}</>
                        )}
                        {done.length < e.sets.length && ` · ${done.length} of ${e.sets.length} sets`}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="rise rise-3 mt-7">
              <Eyebrow className="mb-3">How hard was it? · optional</Eyebrow>
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setRpe(rpe === n ? undefined : n)} className={cx('num h-10 flex-1 rounded-xl border text-[13.5px] font-medium transition-colors', rpe === n ? 'border-ink bg-ink text-bg' : 'border-line text-ink-2')}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="mt-1.5 flex justify-between text-[11.5px] text-ink-3"><span>Very easy</span><span>Maximal</span></div>
              <textarea className="field mt-4" rows={2} placeholder="A note for yourself or your coach" value={note} onChange={(e) => setNote(e.target.value)} />
            </section>
          </>
        )}
      </div>

      <footer className="safe-bottom shrink-0 border-t border-line px-5 pt-3 pb-4">
        <button className="btn btn-primary btn-lg w-full" disabled={performed.length === 0} onClick={save}>
          {claims.length ? `Save and record ${claims.length} new ${claims.length === 1 ? 'best' : 'bests'}` : 'Save workout'}
        </button>
        <div className="mt-2.5 flex gap-2.5">
          {open >= 0 && <button className="btn btn-outline flex-1" onClick={() => goTo(open)}>Back to session</button>}
          <button
            className="btn btn-outline flex-1"
            onClick={() => {
              if (window.confirm('Discard this session? Nothing from it will be saved.')) {
                exit.to = '/'
                discard()
              }
            }}
          >
            Discard
          </button>
        </div>
      </footer>
    </div>
  )
}
