import { useState } from 'react'
import { ArrowDown, ArrowUp, BadgeCheck, ChevronRight, MessageSquare, Send } from 'lucide-react'
import type { WorkoutBlock, WorkoutLog } from '@/domain/types'
import { exerciseById, formatValue } from '@/domain/catalog'
import { isVerified } from '@/domain/scoring/config'
import { useStore } from '@/data/store'
import { Eyebrow, Sheet, TierTag } from '@/ui/primitives'
import { KIND_LABEL, cx, dvar, relativeDay, shortDate } from '@/lib/format'

/** How many exercises were done above or below the level that was assigned. */
export const levelShifts = (log: WorkoutLog) => {
  let up = 0
  let down = 0
  for (const e of log.entries) {
    if (!e.level || !e.assignedLevel) continue
    if (e.level > e.assignedLevel) up++
    else if (e.level < e.assignedLevel) down++
  }
  return { up, down }
}

export const setCount = (log: WorkoutLog) => log.entries.reduce((n, e) => n + e.sets.length, 0)

export function ShiftTag({ log }: { log: WorkoutLog }) {
  const { up, down } = levelShifts(log)
  if (!up && !down) return null
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-ink-2">
      {up > 0 && <span className="inline-flex items-center gap-0.5"><ArrowUp size={10} strokeWidth={2.6} />{up}</span>}
      {down > 0 && <span className="inline-flex items-center gap-0.5"><ArrowDown size={10} strokeWidth={2.6} />{down}</span>}
    </span>
  )
}

/** The exercises of a session, as assigned. */
export function BlockList({ blocks }: { blocks: WorkoutBlock[] }) {
  return (
    <ol className="divide-y divide-line">
      {blocks.map((b) => {
        const ex = exerciseById[b.exerciseId]
        const adjustable = b.minLevel && b.maxLevel && b.minLevel !== b.maxLevel
        return (
          <li key={b.id} className="flex items-center gap-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium" style={{ background: `color-mix(in oklab, ${dvar(ex.discipline)} 14%, transparent)`, color: dvar(ex.discipline) }}>
              {b.level ? `L${b.level}` : '·'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-medium">{ex.name}</span>
              <span className="block truncate text-[11.5px] text-ink-3">
                {KIND_LABEL[b.kind]}{adjustable ? ` · adjustable L${b.minLevel}–${b.maxLevel}` : b.level ? ' · level fixed' : ''}
              </span>
            </span>
            <span className="num shrink-0 text-[12.5px] text-ink-2">{b.sets} × {formatValue(ex, b.target)}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function LogRow({ log, onClick, who }: { log: WorkoutLog; onClick: () => void; who?: string }) {
  const count = useStore((s) => s.feedback.filter((f) => f.logId === log.id).length)
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-[22px] last:rounded-b-[22px] hover:bg-surface-2">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium">{who ? `${who} · ` : ''}{log.title}</span>
        <span className="flex items-center gap-2 truncate text-[12px] text-ink-3">
          {relativeDay(log.finishedAt ?? log.startedAt)} · {setCount(log)} sets{log.rpe ? ` · effort ${log.rpe}/10` : ''}
          <ShiftTag log={log} />
        </span>
      </span>
      {count > 0 && <span className="flex items-center gap-1 text-[12px] text-ink-2"><MessageSquare size={13} />{count}</span>}
      <ChevronRight size={15} className="shrink-0 text-ink-3" />
    </button>
  )
}

/**
 * One completed workout: what was assigned, what was actually done, what was
 * put on record, and the conversation around it. In coach mode it also takes
 * feedback and verifies claimed bests.
 */
export function LogSheet({ logId, onClose, coach }: { logId: string | null; onClose: () => void; coach?: boolean }) {
  const log = useStore((s) => s.logs.find((l) => l.id === logId))
  const athletes = useStore((s) => s.athletes)
  const allFeedback = useStore((s) => s.feedback)
  const allEvidence = useStore((s) => s.evidence)
  const addFeedback = useStore((s) => s.addFeedback)
  const verify = useStore((s) => s.verifyEvidence)
  const [text, setText] = useState('')

  if (!log) return <Sheet open={false} onClose={onClose}>{null}</Sheet>
  const feedback = allFeedback.filter((f) => f.logId === log.id).sort((a, b) => a.date.localeCompare(b.date))
  const claims = allEvidence.filter((e) => e.logId === log.id)
  const minutes = log.finishedAt ? Math.max(1, Math.round((new Date(log.finishedAt).getTime() - new Date(log.startedAt).getTime()) / 60000)) : 0
  const { up, down } = levelShifts(log)

  return (
    <Sheet open={!!logId} onClose={onClose} eyebrow={`${coach ? `${athletes[log.athleteId]?.name} · ` : ''}${shortDate(log.finishedAt ?? log.startedAt)}`} title={log.title}>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink-2">
        <span><span className="num font-medium text-ink">{minutes}</span> min</span>
        <span><span className="num font-medium text-ink">{setCount(log)}</span> sets</span>
        {log.rpe && <span>effort <span className="num font-medium text-ink">{log.rpe}</span>/10</span>}
        {(up > 0 || down > 0) && <span>{up > 0 && `${up} harder`}{up > 0 && down > 0 && ', '}{down > 0 && `${down} easier`} than assigned</span>}
      </div>
      {log.note && <p className="mt-3 rounded-2xl bg-surface p-3.5 text-[13.5px] leading-relaxed text-ink-2">“{log.note}”</p>}

      <Eyebrow className="mt-6 mb-3">Assigned and performed</Eyebrow>
      <div className="card divide-y divide-line">
        {log.entries.map((e) => {
          const names = [...new Set(e.sets.map((s) => s.exerciseId))]
          const last = exerciseById[names[names.length - 1]]
          const assigned = exerciseById[e.assignedExerciseId]
          const lastLevel = e.sets[e.sets.length - 1]?.level
          const diff = lastLevel && e.assignedLevel ? lastLevel - e.assignedLevel : 0
          const swapped = names.some((n) => n !== e.assignedExerciseId)
          return (
            <div key={e.blockId} className="px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-[14px] font-medium">{names.map((n) => exerciseById[n].name).join(' → ')}</span>
                <span className="num shrink-0 text-[13px]">{e.sets.map((s) => s.value).join(' · ')}{last.metric === 'hold' ? ' s' : ''}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-ink-3">
                {swapped ? (
                  <span
                    className={cx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium', diff > 0 ? 'bg-good/15 text-good' : diff < 0 ? 'bg-warn/15 text-warn' : 'bg-surface-2 text-ink-2')}
                  >
                    {diff > 0 ? <ArrowUp size={10} strokeWidth={2.6} /> : diff < 0 ? <ArrowDown size={10} strokeWidth={2.6} /> : null}
                    L{lastLevel}
                  </span>
                ) : (
                  lastLevel && <span className="rounded-full bg-surface-2 px-2 py-0.5 text-ink-2">L{lastLevel}</span>
                )}
                <span className="truncate">
                  {swapped ? `Assigned ${assigned.name}` : 'As assigned'}{e.assignedLevel && swapped ? ` (L${e.assignedLevel})` : ''} · {e.sets.length} × {formatValue(assigned, e.assignedTarget)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {claims.length > 0 && (
        <>
          <Eyebrow className="mt-6 mb-3">Put on record from this session</Eyebrow>
          <div className="card divide-y divide-line">
            {claims.map((c) => {
              const ex = exerciseById[c.exerciseId]
              return (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{ex.name} · {formatValue(ex, c.value, true)}</span>
                    {c.note ? <span className="block truncate text-[12px] text-ink-3">“{c.note}”</span> : ex.standard && <span className="block truncate text-[12px] text-ink-3">{ex.standard}</span>}
                  </span>
                  {coach && !isVerified(c.tier) ? (
                    <button className="btn btn-quiet btn-sm shrink-0" onClick={() => verify(c.id)}><BadgeCheck size={14} /> Verify</button>
                  ) : (
                    <TierTag tier={c.tier} />
                  )}
                </div>
              )
            })}
          </div>
          {coach && <p className="mt-2 text-[12px] text-ink-3">Verify only what you saw meet the standard. It is recorded under your name.</p>}
        </>
      )}

      <Eyebrow className="mt-6 mb-3">Coach feedback</Eyebrow>
      {feedback.length === 0 && !coach && <p className="text-[13.5px] text-ink-3">No feedback on this session yet.</p>}
      <div className="space-y-2.5">
        {feedback.map((f) => (
          <div key={f.id} className="card p-4">
            <div className="flex items-center justify-between text-[12px] text-ink-3">
              <span className="font-medium text-ink-2">{athletes[f.coachId]?.name ?? 'Coach'}</span>
              <span>{relativeDay(f.date)}</span>
            </div>
            <p className="mt-1.5 text-[14px] leading-relaxed">{f.text}</p>
          </div>
        ))}
      </div>
      {coach && (
        <div className="mt-3">
          <textarea className="field" rows={3} placeholder={`Feedback for ${athletes[log.athleteId]?.name.split(' ')[0] ?? 'this athlete'}`} value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn btn-primary mt-2.5 w-full" disabled={!text.trim()} onClick={() => { addFeedback(log.id, text); setText('') }}>
            <Send size={14} /> Send feedback
          </button>
        </div>
      )}
    </Sheet>
  )
}
