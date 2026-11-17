import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, Play, RotateCcw } from 'lucide-react'
import { disciplineById, skillById } from '@/domain/catalog'
import { courseClock, courseProgress, sessionsOf, useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { Bar, Eyebrow, SectionTitle } from '@/ui/primitives'
import { BlockList, LogSheet, ShiftTag } from '@/features/shared/LogView'
import { SkillRow, SkillSheet } from '@/features/tree/SkillSheet'
import { useStartWorkout } from '@/features/workout/useStart'
import { DAYS, cx, dayDiff, dvar, relativeDay, shortDate } from '@/lib/format'

export function CourseView() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const me = useMe()
  const start = useStartWorkout()
  const course = useStore((s) => s.courses.find((c) => c.id === courseId))
  const athletes = useStore((s) => s.athletes)
  const enrolled = useStore((s) => s.enrollments.some((e) => e.courseId === courseId && e.athleteId === s.meId))
  const allFeedback = useStore((s) => s.feedback)
  const joinCourse = useStore((s) => s.joinCourse)
  const leaveCourse = useStore((s) => s.leaveCourse)
  const assessments = useStore((s) => s.assessments)
  const participants = useStore((s) => s.participants)

  const clock = course ? courseClock(course) : null
  const [week, setWeek] = useState(clock?.weekIndex ?? 0)
  const [logOpen, setLogOpen] = useState<string | null>(null)
  const [skillOpen, setSkillOpen] = useState<string | null>(null)

  if (!course || !clock) return <Navigate to="/train" replace />

  const color = course.focus === 'full' ? 'var(--accent)' : dvar(course.focus)
  const sessions = sessionsOf(course, me.logs, me.athlete.id)
  const progress = courseProgress(course, me.logs, me.athlete.id)
  const current = course.weeks[Math.min(week, course.weeks.length - 1)]
  const weekSessions = sessions.filter((s) => s.weekIndex === week)
  const firstOpen = sessions.find((s) => !s.log && s.weekIndex >= clock.weekIndex)
  const logIds = new Set(sessions.map((s) => s.log?.id).filter(Boolean))
  const feedback = allFeedback.filter((f) => logIds.has(f.logId)).sort((a, b) => b.date.localeCompare(a.date))
  const coach = athletes[course.coachId]

  return (
    <div>
      <div className="pt-5 lg:pt-9">
        <button onClick={() => navigate('/train')} className="pressable -ml-1 flex h-10 items-center gap-1.5 rounded-full pr-3 pl-1 text-[13.5px] text-ink-2 hover:text-ink">
          <ArrowLeft size={17} /> Train
        </button>
      </div>

      <header className="rise pt-3 pb-6">
        <Eyebrow className="mb-2.5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          {course.format === 'group' ? 'Group course' : course.format === 'individual' ? 'Individual coaching' : 'Online program'} · with {coach?.name ?? 'your coach'}
        </Eyebrow>
        <h1 className="display text-[40px] lg:text-[52px]">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-2">{course.tagline}</p>

        {enrolled ? (
          <div className="card mt-5 p-4">
            <div className="flex items-end justify-between">
              <div>
                <Eyebrow>{clock.state === 'upcoming' ? 'Not started' : clock.state === 'finished' ? 'Course finished' : 'Now'}</Eyebrow>
                <div className="display mt-1.5 text-[28px]">
                  {clock.state === 'upcoming' ? `Starts in ${clock.startsIn} ${clock.startsIn === 1 ? 'day' : 'days'}` : `Week ${clock.weekIndex + 1} of ${clock.total}`}
                </div>
              </div>
              <div className="num text-right text-[13px] text-ink-2"><span className="text-[18px] font-medium text-ink">{progress.done}</span> / {progress.total} sessions</div>
            </div>
            <Bar value={progress.ratio} color={color} className="mt-3.5" height={4} />
          </div>
        ) : (
          <div className="card mt-5 p-5">
            <p className="text-[14px] leading-relaxed text-ink-2">{course.description}</p>
            <button className="btn btn-primary mt-4 w-full" onClick={() => joinCourse(course.id)}>Join this course</button>
          </div>
        )}
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12">
        <div>
          {/* Week selector */}
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
            {course.weeks.map((w, i) => {
              const done = sessions.filter((s) => s.weekIndex === i && s.log).length
              const total = sessions.filter((s) => s.weekIndex === i).length
              const isNow = clock.state === 'active' && i === clock.weekIndex
              return (
                <button
                  key={w.id}
                  onClick={() => setWeek(i)}
                  className={cx('pressable flex h-[52px] min-w-[72px] shrink-0 flex-col items-center justify-center rounded-2xl border px-3', i === week ? 'border-ink bg-ink text-bg' : 'border-line text-ink-2')}
                >
                  <span className="flex items-center gap-1.5 text-[13.5px] font-medium">
                    {isNow && <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === week ? 'var(--bg)' : color }} />}Week {i + 1}
                  </span>
                  <span className={cx('num text-[10.5px]', i === week ? 'opacity-70' : 'text-ink-3')}>{w.kind && w.kind !== 'training' ? 'Assessment' : total ? `${done}/${total}` : 'empty'}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-5">
            <Eyebrow>Week {week + 1}{current.focus ? ` · focus: ${current.focus === 'full' ? 'full body' : disciplineById[current.focus].name.toLowerCase()}` : current.kind && current.kind !== 'training' ? ' · assessment week' : ' objective'}</Eyebrow>
            <h2 className="display mt-1.5 text-[28px]">{current.title}</h2>
            {current.objective && <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{current.objective}</p>}
          </div>

          {current.kind && current.kind !== 'training' && (() => {
            const session = assessments.filter((a) => a.courseId === course.id && a.kind === current.kind).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).find((a) => participants.some((p) => p.sessionId === a.id && p.athleteId === me.athlete.id))
            const mine = session && participants.find((p) => p.sessionId === session.id && p.athleteId === me.athlete.id)
            return (
              <div className="card mt-5 flex items-start gap-3.5 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2"><ClipboardCheck size={18} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-medium">{current.kind === 'baseline' ? 'Your starting point' : 'Your re-test'}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-2">
                    {mine
                      ? mine.submittedAt ? 'Done. Your results are on your profile.' : 'In progress. Pick up where you left off.'
                      : `${coach?.name.split(' ')[0] ?? 'Your coach'} runs this in class: scan the code on the wall to join. ${current.kind === 'retest' ? 'You will see exactly what changed since week 1.' : 'Every station has a variation for your level.'}`}
                  </span>
                  {mine && session && <button className="btn btn-outline btn-sm mt-3" onClick={() => navigate(mine.submittedAt ? `/assess/${session.id}/reveal` : `/assess/${session.id}`)}>{mine.submittedAt ? 'See my results' : 'Continue'} <ArrowRight size={14} /></button>}
                </span>
              </div>
            )
          })()}

          <div className="mt-5 space-y-3">
            {weekSessions.length === 0 && !(current.kind && current.kind !== 'training') && <p className="rounded-card border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">No sessions planned for this week yet.</p>}
            {weekSessions.map((s) => {
              const diff = dayDiff(s.date)
              const state = s.log ? 'done' : diff === 0 ? 'today' : diff < 0 ? 'missed' : 'upcoming'
              const isNext = firstOpen?.session.id === s.session.id
              return (
                <div key={s.session.id} className={cx('card p-4', isNext && enrolled && 'border-line-strong')}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[12px] text-ink-3">{DAYS[s.session.day]} · {shortDate(s.date)}</div>
                      <div className="mt-0.5 truncate text-[17px] font-medium">{s.session.title}</div>
                    </div>
                    <span
                      className={cx(
                        'inline-flex h-[22px] shrink-0 items-center gap-1 rounded-full px-2 font-mono text-[9.5px] font-medium tracking-[0.1em] uppercase',
                        state === 'done' ? 'bg-good/15 text-good' : state === 'today' ? 'bg-ink text-bg' : state === 'missed' ? 'border border-dashed border-line-strong text-ink-3' : 'border border-line text-ink-3',
                      )}
                    >
                      {state === 'done' && <Check size={11} strokeWidth={3} />}
                      {state === 'done' ? 'Done' : state === 'today' ? 'Today' : state === 'missed' ? 'Not done' : relativeDay(s.date)}
                    </span>
                  </div>
                  <div className="mt-2"><BlockList blocks={s.session.blocks} /></div>
                  {enrolled && (
                    <div className="mt-3 flex gap-2">
                      {s.log ? (
                        <>
                          <button className="btn btn-quiet btn-sm flex-1" onClick={() => setLogOpen(s.log!.id)}>What I did <ShiftTag log={s.log} /></button>
                          <button className="btn btn-outline btn-sm" aria-label="Repeat session" onClick={() => start({ type: 'course', courseId: course.id, sessionId: s.session.id }, s.session.title, s.session.blocks)}>
                            <RotateCcw size={13} /> Repeat
                          </button>
                        </>
                      ) : (
                        <button
                          className={cx('btn btn-sm flex-1', isNext ? 'btn-primary' : 'btn-outline')}
                          disabled={s.session.blocks.length === 0}
                          onClick={() => start({ type: 'course', courseId: course.id, sessionId: s.session.id }, s.session.title, s.session.blocks)}
                        >
                          <Play size={12} fill="currentColor" /> {state === 'missed' ? 'Catch up' : 'Start session'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 space-y-8 lg:mt-0">
          {course.milestones.length > 0 && (
            <section>
              <SectionTitle>Milestones this course works toward</SectionTitle>
              <div className="card divide-y divide-line">
                {course.milestones.filter((id) => skillById[id]).map((id) => <SkillRow key={id} skill={skillById[id]} status={me.statuses[id]} onClick={() => setSkillOpen(id)} />)}
              </div>
              <p className="mt-2 text-[12px] text-ink-3">Unlocking one here lights it in your skill tree and counts toward your ratings like any other evidence.</p>
            </section>
          )}

          {enrolled && (
            <section>
              <SectionTitle>Coach feedback</SectionTitle>
              {feedback.length === 0 ? (
                <p className="rounded-card border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">Feedback from {coach?.name.split(' ')[0] ?? 'your coach'} on your sessions will appear here.</p>
              ) : (
                <div className="space-y-2.5">
                  {feedback.map((f) => {
                    const ref = sessions.find((s) => s.log?.id === f.logId)
                    return (
                      <button key={f.id} onClick={() => setLogOpen(f.logId)} className="card block w-full p-4 text-left hover:bg-surface-2">
                        <div className="flex items-center justify-between text-[12px] text-ink-3">
                          <span><span className="font-medium text-ink-2">{athletes[f.coachId]?.name}</span>{ref ? ` · ${ref.session.title}` : ''}</span>
                          <span>{relativeDay(f.date)}</span>
                        </div>
                        <p className="mt-1.5 text-[14px] leading-relaxed">{f.text}</p>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {enrolled && (
            <section>
              <Eyebrow className="mb-2">About</Eyebrow>
              <p className="text-[13.5px] leading-relaxed text-ink-2">{course.description}</p>
              <button
                className="mt-4 text-[12.5px] text-ink-3 underline decoration-line-strong underline-offset-4 hover:text-ink"
                onClick={() => {
                  if (window.confirm(`Leave ${course.title}? Your logged sessions stay in your history.`)) {
                    leaveCourse(course.id)
                    navigate('/train')
                  }
                }}
              >
                Leave this course
              </button>
            </section>
          )}
        </div>
      </div>

      <LogSheet logId={logOpen} onClose={() => setLogOpen(null)} />
      <SkillSheet skillId={skillOpen} onClose={() => setSkillOpen(null)} onOpenSkill={setSkillOpen} />
    </div>
  )
}
