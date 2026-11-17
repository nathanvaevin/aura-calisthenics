import { useNavigate } from 'react-router'
import { ArrowRight, ScanLine } from 'lucide-react'
import { estimateMinutes, overallProgress, STATIONS } from '@/domain/assessment'
import { useStore } from '@/data/store'
import { Eyebrow } from '@/ui/primitives'
import { dvar, relativeDay } from '@/lib/format'

/** The assessments this athlete has taken part in, newest first. */
export function useMyAssessments() {
  const meId = useStore((s) => s.meId)
  const assessments = useStore((s) => s.assessments)
  const participants = useStore((s) => s.participants)
  return participants
    .filter((p) => p.athleteId === meId)
    .map((p) => ({ participant: p, session: assessments.find((a) => a.id === p.sessionId)! }))
    .filter((x) => x.session)
    .sort((a, b) => b.session.createdAt.localeCompare(a.session.createdAt))
}

/** One prompt: carry on with an open assessment, or take a first one. Nothing once a baseline exists. */
export function AssessPrompt() {
  const navigate = useNavigate()
  const mine = useMyAssessments()
  const startSolo = useStore((s) => s.startSoloAssessment)
  const open = mine.find((x) => !x.participant.submittedAt)

  if (open) {
    const progress = overallProgress(open.session.stations, open.participant.results, open.participant.skipped)
    return (
      <button className="pressable card relative flex w-full items-center gap-4 overflow-hidden p-4 text-left hover:bg-surface-2" onClick={() => navigate(`/assess/${open.session.id}`)}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-bg"><ScanLine size={19} /></span>
        <span className="min-w-0 flex-1">
          <Eyebrow>{open.session.title} · {open.session.origin === 'solo' ? 'on your own' : open.session.groupName}</Eyebrow>
          <span className="mt-1 block text-[15.5px] font-medium">{progress.started ? `Continue: ${progress.done} of ${progress.total} stations done` : 'Your assessment is ready'}</span>
        </span>
        <ArrowRight size={16} className="shrink-0 text-ink-3" />
      </button>
    )
  }
  if (mine.length > 0) return null
  return (
    <button className="pressable card relative flex w-full items-center gap-4 overflow-hidden p-4 text-left hover:bg-surface-2" onClick={() => navigate(`/assess/${startSolo()}`)}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2"><ScanLine size={19} /></span>
      <span className="min-w-0 flex-1">
        <Eyebrow>Physical assessment · about {estimateMinutes(STATIONS.map((s) => s.id))} min</Eyebrow>
        <span className="mt-1 block text-[15.5px] font-medium">Find your real baseline</span>
        <span className="block text-[12.5px] leading-snug text-ink-3">Six adaptive stations replace estimates with what you can actually do.</span>
      </span>
      <ArrowRight size={16} className="shrink-0 text-ink-3" />
    </button>
  )
}

/** History of assessments, with a way to re-test. */
export function AssessHistory() {
  const navigate = useNavigate()
  const mine = useMyAssessments()
  const startSolo = useStore((s) => s.startSoloAssessment)
  const done = mine.filter((x) => x.participant.submittedAt)
  if (done.length === 0) return null
  return (
    <div>
      <div className="card divide-y divide-line">
        {done.map(({ session, participant }) => (
          <div key={session.id} className="flex items-center gap-3 px-4 py-3 first:rounded-t-card last:rounded-b-card">
            <button className="min-w-0 flex-1 text-left" onClick={() => navigate(`/assess/${session.id}/reveal`)}>
              <span className="block truncate text-[14.5px] font-medium">{session.title} · {session.origin === 'solo' ? 'on your own' : session.groupName}</span>
              <span className="mt-0.5 flex items-center gap-2 text-[12px] text-ink-3">
                <span className="flex gap-1">{session.stations.map((d) => <span key={d} className="h-1.5 w-1.5 rounded-full" style={{ background: dvar(d) }} />)}</span>
                {relativeDay(participant.submittedAt!)}{session.origin !== 'solo' ? ` · with ${session.coachName}` : ''}
              </span>
            </button>
            {session.origin !== 'solo' && <button className="btn btn-quiet btn-sm shrink-0" onClick={() => navigate(`/assess/${session.id}/group`)}>Group</button>}
          </div>
        ))}
      </div>
      {!mine.some((x) => !x.participant.submittedAt) && (
        <button className="mt-2.5 text-[12.5px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink" onClick={() => navigate(`/assess/${startSolo()}`)}>
          Re-test on your own and see what has changed
        </button>
      )}
    </div>
  )
}
