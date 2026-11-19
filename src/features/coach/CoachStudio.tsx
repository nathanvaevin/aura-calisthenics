import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import { ArrowRight, BadgeCheck, Plus, QrCode as QrIcon } from 'lucide-react'
import type { DisciplineId } from '@/domain/types'
import { STATIONS, estimateMinutes, overallProgress } from '@/domain/assessment'
import type { Course, Evidence, WorkoutLog } from '@/domain/types'
import { courseFor } from '@/domain/training'
import { growthOf } from '@/domain/progress'
import { DISCIPLINE_IDS, disciplineById, exerciseById, formatValue, skillById } from '@/domain/catalog'
import { auraFor } from '@/domain/scoring/aura'
import { COURSE_TEMPLATES } from '@/data/courseTemplates'
import { courseClock, sessionsOf, useAthleteModel, useIsCoach } from '@/data/hooks'
import { useStore } from '@/data/store'
import { AuraDot } from '@/ui/AuraField'
import { Bar, DisciplineDot, Empty, Eyebrow, PageHeader, SectionTitle, Segmented, Sheet, Stepper } from '@/ui/primitives'
import { LogRow, LogSheet, levelShifts } from '@/features/shared/LogView'
import { cx, dvar, initials, num, relativeDay, shortDate } from '@/lib/format'

type Tab = 'review' | 'courses' | 'students' | 'assess'

const STATUS: Record<Course['status'], string> = { draft: 'Draft', active: 'Active', archived: 'Archived' }

/** Sessions a student was due to have done by now, and how many they did. */
export function adherence(course: Course, logs: WorkoutLog[], athleteId: string, evidence: Evidence[] = []) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // As the student follows it: a first week given to the assessment holds their own starter sessions.
  const due = sessionsOf(courseFor(course, evidence.filter((e) => e.athleteId === athleteId)), logs, athleteId).filter((s) => s.date < today || s.log)
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

  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'review'
  const setTab = (t: Tab) => setParams({ tab: t }, { replace: true })
  const assessments = useStore((s) => s.assessments)
  const participants = useStore((s) => s.participants)
  const [assessOpen, setAssessOpen] = useState(false)
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

  const myAssessments = assessments.filter((a) => a.origin === 'local' && a.coachId === meId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

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

      <div className="rise rise-2 no-scrollbar -mx-5 mt-5 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        <Segmented<Tab> value={tab} onChange={setTab} options={[{ value: 'review', label: 'Review' }, { value: 'courses', label: 'Courses' }, { value: 'students', label: 'Students' }, { value: 'assess', label: 'Assessments' }]} />
      </div>

      {tab === 'assess' && (
        <div className="mt-6 max-w-3xl">
          <button className="pressable card relative flex w-full items-center gap-4 overflow-hidden p-5 text-left hover:bg-surface-2" onClick={() => setAssessOpen(true)}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-bg"><QrIcon size={20} /></span>
            <span>
              <span className="display block text-[24px]">New group assessment</span>
              <span className="block text-[13px] text-ink-2">One code on the wall. Everyone scans, tests at stations, and leaves with a starting profile.</span>
            </span>
          </button>
          {myAssessments.length > 0 && <Eyebrow className="mt-7 mb-3">Your assessments</Eyebrow>}
          <div className="space-y-2.5">
            {myAssessments.map((a) => {
              const people = participants.filter((p) => p.sessionId === a.id)
              const finished = people.filter((p) => p.submittedAt || overallProgress(a.stations, p.results, p.skipped).complete).length
              return (
                <button key={a.id} onClick={() => navigate(`/coach/assessment/${a.id}`)} className="pressable card block w-full p-4 text-left hover:bg-surface-2">
                  <div className="flex items-center justify-between">
                    <Eyebrow>{a.kind === 'retest' ? 'Re-test' : 'Baseline'} · {relativeDay(a.createdAt)}</Eyebrow>
                    <span className={cx('rounded-full px-2 py-0.5 font-mono text-[9.5px] tracking-[0.1em] uppercase', a.status === 'open' ? 'bg-good/15 text-good' : 'border border-line text-ink-3')}>{a.status === 'open' ? 'Open' : 'Finalised'}</span>
                  </div>
                  <div className="mt-1.5 flex items-end justify-between gap-3">
                    <span className="display text-[24px]">{a.groupName}</span>
                    <ArrowRight size={16} className="mb-1.5 shrink-0 text-ink-3" />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex gap-1">{a.stations.map((d) => <span key={d} className="h-2 w-2 rounded-full" style={{ background: dvar(d) }} />)}</span>
                    <span className="num text-[12px] text-ink-3">{people.length} joined · {finished} finished{a.sample ? ' · sample data' : ''}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'review' && (
        <div className="mt-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
          <section>
            <SectionTitle>Bests waiting for verification</SectionTitle>
            {pending.length === 0 ? (
              <p className="rounded-card border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">Nothing to verify. When a student records a new best in one of your sessions it appears here.</p>
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
              <p className="rounded-card border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">No student sessions yet.</p>
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
            const totals = students.reduce((acc, s) => { const a = adherence(c, logs, s.athleteId, evidence); return { done: acc.done + a.done, due: acc.due + a.due } }, { done: 0, due: 0 })
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
                const theirs = logs.filter((l) => l.athleteId === id && l.finishedAt).sort((a, b) => b.finishedAt!.localeCompare(a.finishedAt!))
                const totals = mine.filter((c) => enrollments.some((e) => e.courseId === c.id && e.athleteId === id)).reduce((acc, c) => { const a = adherence(c, logs, id, evidence); return { done: acc.done + a.done, due: acc.due + a.due } }, { done: 0, due: 0 })
                const shift = averageShift(theirs)
                const own = evidence.filter((e) => e.athleteId === id)
                const aura = auraFor(own)
                const grown = growthOf(own)
                const gain = grown ? grown.aura.now - grown.aura.then : 0
                const waiting = pending.filter((e) => e.athleteId === id).length
                const month = theirs.filter((l) => Date.now() - new Date(l.finishedAt!).getTime() < 28 * 86400000).length
                return (
                  <button key={id} data-student={id} onClick={() => setStudentOpen(id)} className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left first:rounded-t-card last:rounded-b-card hover:bg-surface-2">
                    <AuraDot mix={aura.mix} size={42}>{initials(athlete.name)}</AuraDot>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 truncate text-[14.5px] font-medium">
                        {athlete.name}
                        {waiting > 0 && <span className="rounded-full bg-accent px-1.5 py-px font-mono text-[9.5px] font-semibold text-accent-ink">{waiting}</span>}
                      </span>
                      <span className="block truncate text-[12px] text-ink-3">
                        {theirs[0] ? `Trained ${relativeDay(theirs[0].finishedAt!).toLowerCase()} · ${month} in 4 weeks` : 'Not trained yet'}{totals.due ? ` · course ${totals.done}/${totals.due}` : ''}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="num block text-[13.5px] font-medium">Aura {num(aura.aura)}</span>
                      <span className={cx('num block text-[11.5px]', gain > 0 ? 'text-good' : 'text-ink-3')}>{gain > 0 ? `+${num(gain)} since start` : Math.abs(shift) >= 0.15 ? `${shift > 0 ? '+' : '−'}${Math.abs(shift).toFixed(1)} lvl` : 'no change yet'}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          <p className="mt-2 text-[12px] leading-relaxed text-ink-3">You see everything your students record and every session they train, in your courses and on their own, for as long as they are enrolled in one of your courses. “Lvl” is how far above or below the assigned level they train on average.</p>
        </div>
      )}

      <NewAssessmentSheet open={assessOpen} onClose={() => setAssessOpen(false)} />
      <LogSheet logId={logOpen} onClose={() => setLogOpen(null)} coach />
      <StudentSheet athleteId={studentOpen} onClose={() => setStudentOpen(null)} courses={mine} onOpenLog={(id) => { setStudentOpen(null); setLogOpen(id) }} />

      <Sheet open={newOpen} onClose={() => setNewOpen(false)} eyebrow="Course builder" title="New course">
        <div className="space-y-2.5">
          {COURSE_TEMPLATES.map((t) => (
            <button key={t.id} className="card block w-full p-4 text-left hover:bg-surface-2" onClick={() => navigate(`/coach/course/${createCourse(t.id)}`)}>
              <Eyebrow>Template</Eyebrow>
              <div className="display mt-1.5 text-[24px]">{t.title}</div>
              <p className="mt-1 text-[13px] leading-snug text-ink-2">{t.description}</p>
            </button>
          ))}
          <button className="block w-full rounded-card border border-dashed border-line-strong p-4 text-left hover:bg-surface" onClick={() => navigate(`/coach/course/${createCourse(null)}`)}>
            <div className="display text-[24px]">Blank course</div>
            <p className="mt-1 text-[13px] text-ink-2">Four empty weeks to build from scratch.</p>
          </button>
        </div>
        <p className="mt-4 text-[12px] text-ink-3">New courses start as drafts beginning next Monday. Students see them once you set them to Active.</p>
      </Sheet>
    </div>
  )
}

const SOURCE_LABEL = { course: 'Course', library: 'Own session', goal: 'Toward a goal' } as const

/** One student, as their coach sees them: how far they have come, how they train, and every session. */
function StudentSheet({ athleteId, onClose, courses, onOpenLog }: { athleteId: string | null; onClose: () => void; courses: Course[]; onOpenLog: (id: string) => void }) {
  const navigate = useNavigate()
  const model = useAthleteModel(athleteId)
  const enrollments = useStore((s) => s.enrollments)
  const growth = useMemo(() => (model ? growthOf(model.evidence) : null), [model])
  if (!model) return <Sheet open={false} onClose={onClose}>{null}</Sheet>
  const theirs = model.logs.filter((l) => l.finishedAt).sort((a, b) => b.finishedAt!.localeCompare(a.finishedAt!))
  const theirCourses = courses.filter((c) => enrollments.some((e) => e.courseId === c.id && e.athleteId === model.athlete.id))
  const weeks = model.dedication.weeks.slice(-8)
  const peak = Math.max(model.athlete.weeklyTarget, ...weeks.map((w) => w.sessions), 1)
  const recent = weeks.slice(-4).reduce((n, w) => n + w.sessions, 0)

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
  const gain = growth ? growth.aura.now - growth.aura.then : 0

  return (
    <Sheet open={!!athleteId} onClose={onClose} eyebrow={`Student · Aura ${num(model.aura.aura)}${gain > 0 ? ` · +${num(gain)}` : ''}`} title={model.athlete.name}>
      <div data-student-sheet>
        {/* How far they have come */}
        <Eyebrow className="mb-2.5">{growth ? `Since ${shortDate(growth.since)}` : 'Results'}</Eyebrow>
        {!growth ? (
          <p className="text-[13.5px] text-ink-2">Nothing on record yet. Their results show here from their first assessment on.</p>
        ) : (
          <>
            <div className="card flex items-baseline justify-between px-4 py-3">
              <span className="text-[13.5px] text-ink-2">Aura</span>
              <span className="num text-[14px]"><span className="text-ink-3">{num(growth.aura.then)} → </span><span className="display text-[24px]">{num(growth.aura.now)}</span>{gain !== 0 && <span className={cx('ml-2 text-[12.5px] font-medium', gain > 0 ? 'text-good' : 'text-warn')}>{gain > 0 ? '+' : '−'}{num(Math.abs(gain))}</span>}</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {DISCIPLINE_IDS.map((d) => {
                const r = growth.ratings[d]
                const delta = r.now - r.then
                return (
                  <div key={d} className="card px-3 py-2.5">
                    <span className="flex items-center gap-1.5 text-[11px] text-ink-2"><DisciplineDot id={d} size={6} />{disciplineById[d].short}</span>
                    <span className="display num mt-0.5 block text-[22px] leading-tight">{r.now || '—'}</span>
                    <span className={cx('num block text-[11px]', delta > 0 ? 'text-good' : 'text-ink-3')}>{delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : r.now ? 'no change' : 'not tested'}</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-[12px] text-ink-3">{growth.newResults ? `${growth.newResults} ${growth.newResults === 1 ? 'result' : 'results'} recorded since their starting point.` : 'No new results since their starting point yet.'}</p>
          </>
        )}

        {/* How they train */}
        <Eyebrow className="mt-6 mb-2.5">Training</Eyebrow>
        <div className="card p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span><span className="display num text-[28px]">{recent}</span><span className="ml-1.5 text-[12.5px] text-ink-3">sessions in 4 weeks</span></span>
            <span className="text-[12px] text-ink-3">Target {model.athlete.weeklyTarget} / week</span>
          </div>
          <div className="relative mt-3 flex h-[52px] items-end gap-1.5">
            <span className="pointer-events-none absolute inset-x-0 border-t border-dashed border-line-strong" style={{ bottom: `${(model.athlete.weeklyTarget / peak) * 100}%` }} />
            {weeks.map((w, i) => <span key={w.start} className="flex h-full flex-1 items-end"><span className="w-full rounded-[4px]" style={{ height: `${Math.max(5, (w.sessions / peak) * 100)}%`, background: w.sessions === 0 ? 'var(--surface-3)' : i === weeks.length - 1 ? 'var(--text)' : 'var(--text-3)' }} /></span>)}
          </div>
          <p className="mt-2.5 text-[12.5px] text-ink-2">{theirs[0] ? `Last trained ${relativeDay(theirs[0].finishedAt!).toLowerCase()}. ` : 'Has not trained yet. '}{model.dedication.streak > 1 ? `${model.dedication.streak}-week streak.` : ''}</p>
          {theirCourses.map((c) => {
            const a = adherence(c, model.logs, model.athlete.id, model.evidence)
            return (
              <div key={c.id} className="mt-3 border-t border-line pt-3">
                <div className="flex items-center justify-between text-[13px]"><span className="truncate">{c.title}</span><span className="num shrink-0 text-ink-2">{a.done} of {a.due} due sessions done</span></div>
                <Bar value={a.due ? a.done / a.due : 0} className="mt-2" />
              </div>
            )
          })}
        </div>

        <Eyebrow className="mt-6 mb-2.5">How they adjust the levels</Eyebrow>
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

        {model.athlete.goals.length > 0 && (
          <>
            <Eyebrow className="mt-6 mb-2.5">Working toward</Eyebrow>
            <div className="flex flex-wrap gap-1.5">
              {model.athlete.goals.filter((g) => skillById[g]).map((g) => (
                <span key={g} className="inline-flex h-8 items-center gap-2 rounded-full border border-line px-3 text-[12.5px]">
                  <DisciplineDot id={skillById[g].discipline} size={6} />{skillById[g].name}
                  {model.statuses[g]?.state === 'mastered' && <BadgeCheck size={13} className="text-good" />}
                </span>
              ))}
            </div>
          </>
        )}

        {theirs.length > 0 && (
          <>
            <Eyebrow className="mt-6 mb-2.5">Every session</Eyebrow>
            <div className="card divide-y divide-line">
              {theirs.slice(0, 12).map((l) => (
                <div key={l.id} className="relative">
                  <LogRow log={l} onClick={() => onOpenLog(l.id)} />
                  <span className="pointer-events-none absolute top-3 right-10 font-mono text-[9px] tracking-[0.08em] text-ink-3 uppercase">{SOURCE_LABEL[l.source.type]}</span>
                </div>
              ))}
            </div>
            {theirs.length > 12 && <p className="mt-2 text-[12px] text-ink-3">And {theirs.length - 12} earlier.</p>}
          </>
        )}
        <button className="btn btn-outline mt-5 w-full" onClick={() => navigate(`/athlete/${model.athlete.id}`)}>Open full athlete profile</button>
      </div>
    </Sheet>
  )
}

function NewAssessmentSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const meId = useStore((s) => s.meId)
  const courses = useStore((s) => s.courses)
  const assessments = useStore((s) => s.assessments)
  const create = useStore((s) => s.createAssessment)
  const mine = courses.filter((c) => c.coachId === meId && c.status !== 'archived')
  const earlier = assessments.filter((a) => a.origin === 'local' && a.coachId === meId && a.status === 'finalised')

  const [courseId, setCourseId] = useState('')
  const [group, setGroup] = useState('')
  const [baselineId, setBaselineId] = useState('')
  const [stations, setStations] = useState<DisciplineId[]>(STATIONS.map((s) => s.id))
  const [mode, setMode] = useState<'stations' | 'guided'>('stations')
  const [groups, setGroups] = useState(3)

  const course = mine.find((c) => c.id === courseId)
  const baseline = earlier.find((a) => a.id === baselineId)
  const groupName = group.trim() || baseline?.groupName || course?.title || ''
  const ordered = STATIONS.map((s) => s.id).filter((id) => stations.includes(id))

  return (
    <Sheet open={open} onClose={onClose} eyebrow="Assessments" title="New group assessment">
      <div className="space-y-5">
        {earlier.length > 0 && (
          <label className="block">
            <Eyebrow className="mb-2">Purpose</Eyebrow>
            <select
              className="field" value={baselineId}
              onChange={(e) => {
                const b = earlier.find((a) => a.id === e.target.value)
                setBaselineId(e.target.value)
                if (b) { setStations(b.stations); setCourseId(b.courseId ?? '') }
              }}
            >
              <option value="">A first baseline for a group</option>
              {earlier.map((a) => <option key={a.id} value={a.id}>Re-test of {a.groupName} · {a.title}</option>)}
            </select>
            {baseline && <span className="mt-1.5 block text-[12px] leading-snug text-ink-3">Same stations and the same people, already on the board, so every result can be compared with {baseline.title.toLowerCase()}.</span>}
          </label>
        )}

        <label className="block">
          <Eyebrow className="mb-2">Course</Eyebrow>
          <select className="field" value={courseId} onChange={(e) => setCourseId(e.target.value)} disabled={!!baseline}>
            <option value="">No course. Just a training group</option>
            {mine.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <span className="mt-1.5 block text-[12px] leading-snug text-ink-3">Linking a course enrols everyone in it when you finalise, and tailors the level advice to its exercises.</span>
        </label>

        <label className="block">
          <Eyebrow className="mb-2">Group name</Eyebrow>
          <input className="field" placeholder={course?.title ?? 'Tuesday beginners'} value={group || baseline?.groupName || ''} onChange={(e) => setGroup(e.target.value)} disabled={!!baseline} />
          <span className="mt-1.5 block text-[12px] leading-snug text-ink-3">What participants see when they scan. Run a separate assessment for each group; each gets its own code.</span>
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between"><Eyebrow>Stations</Eyebrow><span className="num text-[12px] text-ink-3">about {estimateMinutes(ordered)} min</span></div>
          <div className="flex flex-wrap gap-2">
            {STATIONS.map((s) => (
              <button key={s.id} className="chip" data-on={stations.includes(s.id)} disabled={!!baseline} onClick={() => setStations(stations.includes(s.id) ? stations.filter((x) => x !== s.id) : [...stations, s.id])}>
                {!stations.includes(s.id) && <DisciplineDot id={s.id} size={6} />}{disciplineById[s.id].short}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Eyebrow className="mb-2">Format</Eyebrow>
          <Segmented<'stations' | 'guided'> value={mode} onChange={setMode} options={[{ value: 'stations', label: 'By stations' }, { value: 'guided', label: 'Guided' }]} />
          <span className="mt-1.5 block text-[12px] leading-snug text-ink-3">
            {mode === 'stations' ? 'Everyone chooses the variations that fit their level at each station. Groups rotate between stations, so equipment is shared.' : 'Each station leads people through its benchmarks in a fixed order, adapting to every result.'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span><Eyebrow>Groups</Eyebrow><span className="mt-1 block text-[12px] text-ink-3">Each starts at a different station. Changeable later.</span></span>
          <Stepper value={Math.min(groups, Math.max(1, ordered.length))} min={1} max={Math.min(6, Math.max(1, ordered.length))} onChange={setGroups} />
        </div>

        <button
          className="btn btn-primary btn-lg w-full" disabled={ordered.length === 0 || !groupName}
          onClick={() => navigate(`/coach/assessment/${create({ title: baseline ? 'Re-test' : 'Baseline', groupName, courseId: courseId || undefined, stations: ordered, kind: baseline ? 'retest' : 'baseline', baselineId: baselineId || undefined, mode, groups: Math.min(groups, ordered.length) })}?tab=invite`)}
        >
          Create and show the code
        </button>
      </div>
    </Sheet>
  )
}
