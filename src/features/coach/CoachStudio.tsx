import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { ArrowRight, BadgeCheck, Plus } from 'lucide-react'
import type { Course, WorkoutLog } from '@/domain/types'
import { DISCIPLINE_IDS, disciplineById, exerciseById, formatValue } from '@/domain/catalog'
import { auraFor } from '@/domain/scoring/aura'
import { COURSE_TEMPLATES } from '@/data/courseTemplates'
import { courseClock, sessionsOf, useAthleteModel, useIsCoach } from '@/data/hooks'
import { useStore } from '@/data/store'
import { AuraDot } from '@/ui/AuraField'
import { Bar, DisciplineDot, Empty, Eyebrow, PageHeader, SectionTitle, Segmented, Sheet } from '@/ui/primitives'
import { LogRow, LogSheet, levelShifts } from '@/features/shared/LogView'
import { cx, dvar, initials, num, relativeDay } from '@/lib/format'

type Tab = 'review' | 'courses' | 'students'

const STATUS: Record<Course['status'], string> = { draft: 'Draft', active: 'Active', archived: 'Archived' }

/** Sessions a student was due to have done by now, and how many they did. */
export function adherence(course: Course, logs: WorkoutLog[], athleteId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = sessionsOf(course, logs, athleteId).filter((s) => s.date < today || s.log)
  return { done: due.filter((s) => s.log).length, due: due.length }
}

/** Average levels above (+) or below (−) what was assigned. */
export function averageShift(logs: WorkoutLog[]) {
  let sum = 0
  let n = 0
  for (const l of logs) {
    for (const e of l.entries) {
      if (e.level && e.assignedLevel) {
        sum += e.level - e.assignedLevel
        n++
      }
    }
  }
  return n ? sum / n : 0
}

export function CoachStudio() {
  const coach = useIsCoach()
  const navigate = useNavigate()
  const meId = useStore((s) => s.meId)!
  const courses = useStore((s) => s.courses)
  const enrollments = useStore((s) => s.enrollments)
  const logs = useStore((s) => s.logs)
  const feedback = useStore((s) => s.feedback)
  const evidence = useStore((s) => s.evidence)
  const athletes = useStore((s) => s.athletes)
  const verify = useStore((s) => s.verifyEvidence)
  const createCourse = useStore((s) => s.createCourse)

  const [tab, setTab] = useState<Tab>('review')
  const [logOpen, setLogOpen] = useState<string | null>(null)
  const [studentOpen, setStudentOpen] = useState<string | null>(null)
  const [newOpen, setNewOpen] = useState(false)

  const mine = useMemo(() => courses.filter((c) => c.coachId === meId), [courses, meId])
  const myIds = useMemo(() => new Set(mine.map((c) => c.id)), [mine])
  const courseLogs = useMemo(
    () => logs.filter((l) => l.finishedAt && l.source.type === 'course' && myIds.has(l.source.courseId)).sort((a, b) => b.finishedAt!.localeCompare(a.finishedAt!)),
    [logs, myIds],
  )
  const logIds = useMemo(() => new Set(courseLogs.map((l) => l.id)), [courseLogs])
  const reviewed = useMemo(() => new Set(feedback.filter((f) => f.coachId === meId).map((f) => f.logId)), [feedback, meId])
  const pending = evidence.filter((e) => e.logId && logIds.has(e.logId) && e.tier === 'self')
  const unreviewed = courseLogs.filter((l) => !reviewed.has(l.id))
  const studentIds = [...new Set(enrollments.filter((e) => myIds.has(e.courseId)).map((e) => e.athleteId))]

  if (!coach) return <Navigate to="/profile" replace />

  return (
    <div>
      <PageHeader
        eyebrow="Coach Studio"
        title="Coaching"
        right={<button className="btn btn-primary btn-sm" onClick={() => setNewOpen(true)}><Plus size={15} /> New course</button>}
      />

      <div className="rise rise-1 grid grid-cols-4 gap-2">
        {([
          ['Courses', mine.filter((c) => c.status === 'active').length],
          ['Students', studentIds.length],
          ['Review', unreviewed.length],
          ['Verify', pending.length],
        ] as const).map(([label, value]) => (
          <div key={label} className="card px-3 py-3">
            <span className="block truncate font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">{label}</span>
            <span className="display num mt-1 block text-[28px]">{value}</span>
          </div>
        ))}
      </div>

      <div className="rise rise-2 mt-5">
        <Segmented<Tab> value={tab} onChange={setTab} options={[{ value: 'review', label: 'Review' }, { value: 'courses', label: 'Courses' }, { value: 'students', label: 'Students' }]} />
      </div>

      {tab === 'review' && (
        <div className="mt-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
          <section>
            <SectionTitle>Bests waiting for verification</SectionTitle>
            {pending.length === 0 ? (
              <p className="rounded-[22px] border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">Nothing to verify. When a student records a new best in one of your sessions it appears here.</p>
            ) : (
              <div className="card divide-y divide-line">
                {pending.map((e) => {
                  const ex = exerciseById[e.exerciseId]
                  return (
                    <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                      <button className="min-w-0 flex-1 text-left" onClick={() => setLogOpen(e.logId!)}>
                        <span className="block truncate text-[14px] font-medium">{athletes[e.athleteId]?.name} · {ex.name} {formatValue(ex, e.value)}</span>
                        <span className="block truncate text-[12px] text-ink-3">{relativeDay(e.date)}{e.note ? ` · “${e.note}”` : ex.standard ? ` · ${ex.standard}` : ''}</span>
                      </button>
                      <button className="btn btn-quiet btn-sm shrink-0" onClick={() => verify(e.id)}><BadgeCheck size={14} /> Verify</button>
                    </div>
                  )
                })}
              </div>
            )}
            <p className="mt-2 text-[12px] leading-relaxed text-ink-3">Verifying raises a record from self-reported to coach-verified under your name. Verify only what you saw meet the standard.</p>
          </section>

          <section className="mt-8 lg:mt-0">
            <SectionTitle>Completed sessions</SectionTitle>
            {courseLogs.length === 0 ? (
              <p className="rounded-[22px] border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">No student sessions yet.</p>
            ) : (
              <div className="card divide-y divide-line">
                {courseLogs.slice(0, 14).map((l) => (
                  <div key={l.id} className="relative">
                    {!reviewed.has(l.id) && <span className="absolute top-1/2 left-1.5 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent" title="No feedback yet" />}
                    <LogRow log={l} who={athletes[l.athleteId]?.name.split(' ')[0]} onClick={() => setLogOpen(l.id)} />
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-[12px] text-ink-3">A dot marks sessions you have not given feedback on. Arrows count exercises done above or below the assigned level.</p>
          </section>
        </div>
      )}

      {tab === 'courses' && (
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {mine.length === 0 && (
            <div className="lg:col-span-2"><Empty title="No courses yet" action={<button className="btn btn-primary" onClick={() => setNewOpen(true)}>Create your first course</button>}>Start from one of the templates or from a blank four-week structure.</Empty></div>
          )}
          {mine.map((c) => {
            const clock = courseClock(c)
            const students = enrollments.filter((e) => e.courseId === c.id)
            const totals = students.reduce((acc, s) => { const a = adherence(c, logs, s.athleteId); return { done: acc.done + a.done, due: acc.due + a.due } }, { done: 0, due: 0 })
            const color = c.focus === 'full' ? 'var(--accent)' : dvar(c.focus)
            return (
              <button key={c.id} onClick={() => navigate(`/coach/course/${c.id}`)} className="pressable card relative overflow-hidden p-5 text-left hover:bg-surface-2">
                <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full opacity-20 blur-3xl" style={{ background: color }} />
                <div className="flex items-center justify-between">
                  <Eyebrow>
                    {c.weeks.length} weeks · {students.length} {students.length === 1 ? 'student' : 'students'}
                  </Eyebrow>
                  <span className={cx('rounded-full px-2 py-0.5 font-mono text-[9.5px] tracking-[0.1em] uppercase', c.status === 'active' ? 'bg-good/15 text-good' : 'border border-line text-ink-3')}>{STATUS[c.status]}</span>
                </div>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <h2 className="display text-[28px]">{c.title}</h2>
                  <ArrowRight size={17} className="mb-1.5 shrink-0 text-ink-3" />
                </div>
                <div className="mt-1 text-[12.5px] text-ink-2">
                  {clock.state === 'upcoming' ? `Starts in ${clock.startsIn} days` : clock.state === 'finished' ? 'Finished' : `Week ${clock.weekIndex + 1} of ${clock.total}`}
                </div>
                {totals.due > 0 && (
                  <div className="mt-3.5 flex items-center gap-3">
                    <Bar value={totals.done / totals.due} color={color} />
                    <span className="num shrink-0 text-[12px] text-ink-3">{Math.round((totals.done / totals.due) * 100)}% attendance</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {tab === 'students' && (
        <div className="mt-6 max-w-3xl">
          {studentIds.length === 0 ? (
            <Empty title="No students yet">Enrol athletes from a course’s Students tab.</Empty>
          ) : (
            <div className="card divide-y divide-line">
              {studentIds.map((id) => {
                const athlete = athletes[id]
                if (!athlete) return null
                const theirs = courseLogs.filter((l) => l.athleteId === id)
                const totals = mine.filter((c) => enrollments.some((e) => e.courseId === c.id && e.athleteId === id)).reduce((acc, c) => { const a = adherence(c, logs, id); return { done: acc.done + a.done, due: acc.due + a.due } }, { done: 0, due: 0 })
                const shift = averageShift(theirs)
                const aura = auraFor(evidence.filter((e) => e.athleteId === id))
                const waiting = pending.filter((e) => e.athleteId === id).length
                return (
                  <button key={id} onClick={() => setStudentOpen(id)} className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left first:rounded-t-[22px] last:rounded-b-[22px] hover:bg-surface-2">
                    <AuraDot mix={aura.mix} size={42}>{initials(athlete.name)}</AuraDot>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 truncate text-[14.5px] font-medium">
                        {athlete.name}
                        {waiting > 0 && <span className="rounded-full bg-accent px-1.5 py-px font-mono text-[9.5px] font-semibold text-accent-ink">{waiting}</span>}
                      </span>
                      <span className="block truncate text-[12px] text-ink-3">
                        {totals.done}/{totals.due} sessions · {theirs[0] ? `last ${relativeDay(theirs[0].finishedAt!).toLowerCase()}` : 'not started'}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className={cx('num block text-[13.5px] font-medium', Math.abs(shift) < 0.15 ? 'text-ink-2' : shift > 0 ? 'text-good' : 'text-warn')}>
                        {Math.abs(shift) < 0.15 ? 'On level' : `${shift > 0 ? '+' : '−'}${Math.abs(shift).toFixed(1)} lvl`}
                      </span>
                      <span className="num block text-[11.5px] text-ink-3">Aura {num(aura.aura)}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          <p className="mt-2 text-[12px] leading-relaxed text-ink-3">“Lvl” is how far above or below your assigned level a student trains on average. You only see athletes enrolled in your own courses.</p>
        </div>
      )}

      <LogSheet logId={logOpen} onClose={() => setLogOpen(null)} coach />
      <StudentSheet athleteId={studentOpen} onClose={() => setStudentOpen(null)} logs={courseLogs} onOpenLog={(id) => { setStudentOpen(null); setLogOpen(id) }} />

      <Sheet open={newOpen} onClose={() => setNewOpen(false)} eyebrow="Course builder" title="New course">
        <div className="space-y-2.5">
          {COURSE_TEMPLATES.map((t) => (
            <button key={t.id} className="card block w-full p-4 text-left hover:bg-surface-2" onClick={() => navigate(`/coach/course/${createCourse(t.id)}`)}>
              <Eyebrow>Template</Eyebrow>
              <div className="display mt-1.5 text-[24px]">{t.title}</div>
              <p className="mt-1 text-[13px] leading-snug text-ink-2">{t.description}</p>
            </button>
          ))}
          <button className="block w-full rounded-[22px] border border-dashed border-line-strong p-4 text-left hover:bg-surface" onClick={() => navigate(`/coach/course/${createCourse(null)}`)}>
            <div className="display text-[24px]">Blank course</div>
            <p className="mt-1 text-[13px] text-ink-2">Four empty weeks to build from scratch.</p>
          </button>
        </div>
        <p className="mt-4 text-[12px] text-ink-3">New courses start as drafts beginning next Monday. Students see them once you set them to Active.</p>
      </Sheet>
    </div>
  )
}

function StudentSheet({ athleteId, onClose, logs, onOpenLog }: { athleteId: string | null; onClose: () => void; logs: WorkoutLog[]; onOpenLog: (id: string) => void }) {
  const navigate = useNavigate()
  const model = useAthleteModel(athleteId)
  if (!model) return <Sheet open={false} onClose={onClose}>{null}</Sheet>
  const theirs = logs.filter((l) => l.athleteId === model.athlete.id)

  // Which exercises this student most often moves away from the assigned level.
  const moves = new Map<string, { up: number; down: number }>()
  for (const l of theirs) {
    for (const e of l.entries) {
      if (!e.level || !e.assignedLevel || e.level === e.assignedLevel) continue
      const m = moves.get(e.assignedExerciseId) ?? { up: 0, down: 0 }
      if (e.level > e.assignedLevel) m.up++
      else m.down++
      moves.set(e.assignedExerciseId, m)
    }
  }
  const adjusted = [...moves.entries()].sort((a, b) => b[1].up + b[1].down - (a[1].up + a[1].down)).slice(0, 4)
  const shifts = theirs.reduce((acc, l) => { const s = levelShifts(l); return { up: acc.up + s.up, down: acc.down + s.down } }, { up: 0, down: 0 })

  return (
    <Sheet open={!!athleteId} onClose={onClose} eyebrow={`Student · Aura ${num(model.aura.aura)}`} title={model.athlete.name}>
      <div className="grid grid-cols-3 gap-2">
        {DISCIPLINE_IDS.map((d) => (
          <div key={d} className="card px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[11px] text-ink-2"><DisciplineDot id={d} size={6} />{disciplineById[d].short}</span>
            <span className="display num mt-0.5 block text-[22px]">{model.ratings[d].rating || '—'}</span>
          </div>
        ))}
      </div>

      <Eyebrow className="mt-6 mb-2.5">How they adjust your programming</Eyebrow>
      {adjusted.length === 0 ? (
        <p className="text-[13.5px] text-ink-2">{theirs.length ? 'Trains at the assigned level throughout.' : 'No sessions logged yet.'}</p>
      ) : (
        <>
          <p className="mb-2.5 text-[13px] text-ink-2">Across {theirs.length} sessions: {shifts.up} exercises done harder, {shifts.down} easier than assigned.</p>
          <div className="card divide-y divide-line">
            {adjusted.map(([id, m]) => (
              <div key={id} className="flex items-center justify-between px-4 py-2.5 text-[13.5px]">
                <span className="truncate">{exerciseById[id].name}</span>
                <span className="num shrink-0 text-[12.5px]">
                  {m.down > 0 && <span className="text-warn">{m.down}× easier</span>}{m.down > 0 && m.up > 0 && <span className="text-ink-3"> · </span>}{m.up > 0 && <span className="text-good">{m.up}× harder</span>}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {theirs.length > 0 && (
        <>
          <Eyebrow className="mt-6 mb-2.5">Recent sessions</Eyebrow>
          <div className="card divide-y divide-line">
            {theirs.slice(0, 5).map((l) => <LogRow key={l.id} log={l} onClick={() => onOpenLog(l.id)} />)}
          </div>
        </>
      )}
      <button className="btn btn-outline mt-5 w-full" onClick={() => navigate(`/athlete/${model.athlete.id}`)}>Open full athlete profile</button>
    </Sheet>
  )
}
