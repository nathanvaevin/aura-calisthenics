import { useMemo, useState } from 'react'
import { useVoice } from '@/theme/useTheme'
import { useNavigate } from 'react-router'
import { ArrowRight, Play, Target } from 'lucide-react'
import type { Course, WorkoutBlock, WorkoutSource } from '@/domain/types'
import { disciplineById, skillById } from '@/domain/catalog'
import { WORKOUT_TEMPLATES, buildGoalWorkout, buildWorkout, estimateMinutes } from '@/domain/training'
import { courseClock, courseProgress, nextSession, useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { Bar, DisciplineDot, Empty, Eyebrow, PageHeader, SectionTitle, Sheet } from '@/ui/primitives'
import { BlockList, LogRow, LogSheet } from '@/features/shared/LogView'
import { useStartWorkout } from '@/features/workout/useStart'
import { AssessHistory, AssessPrompt, useMyAssessments } from '@/features/assess/AssessCards'
import { dayDiff, dvar, relativeDay } from '@/lib/format'

interface Preview {
  title: string
  eyebrow: string
  summary: string
  blocks: WorkoutBlock[]
  source: WorkoutSource
}

const focusColor = (focus: Course['focus']) => (focus === 'full' ? 'var(--accent)' : dvar(focus))

export function Train() {
  const v = useVoice()
  const me = useMe()
  const navigate = useNavigate()
  const start = useStartWorkout()
  const courses = useStore((s) => s.courses)
  const enrollments = useStore((s) => s.enrollments)
  const athletes = useStore((s) => s.athletes)
  const joinCourse = useStore((s) => s.joinCourse)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [logOpen, setLogOpen] = useState<string | null>(null)
  const [historyAll, setHistoryAll] = useState(false)

  const mine = useMemo(
    () => enrollments.filter((e) => e.athleteId === me.athlete.id).map((e) => courses.find((c) => c.id === e.courseId)).filter((c) => c !== undefined),
    [enrollments, courses, me.athlete.id],
  )
  const discover = courses.filter((c) => c.status === 'active' && !mine.includes(c) && c.coachId !== me.athlete.id)
  const goalSessions = me.athlete.goals
    .map((g) => ({ goal: skillById[g], workout: buildGoalWorkout(g, me.evidence, me.statuses) }))
    .filter((x) => x.goal && x.workout)
  const history = [...me.logs].filter((l) => l.finishedAt).sort((a, b) => b.finishedAt!.localeCompare(a.finishedAt!))
  const assessed = useMyAssessments().some((x) => x.participant.submittedAt)
  const thisWeek = me.dedication.weeks[me.dedication.weeks.length - 1]?.sessions ?? 0

  return (
    <div>
      <PageHeader
        eyebrow={`${thisWeek} of ${me.athlete.weeklyTarget} sessions this week`}
        title="Train"
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12">
        <div className="space-y-8">
          <div className="rise rise-1 empty:hidden"><AssessPrompt /></div>

          {/* Courses */}
          <section className="rise rise-1">
            <SectionTitle>My courses</SectionTitle>
            {mine.length === 0 ? (
              <Empty title="No course yet">Join a coach-led course below, or train from the quick sessions. Everything you log feeds the same profile.</Empty>
            ) : (
              <div className="space-y-3">
                {mine.map((c) => {
                  const clock = courseClock(c)
                  const progress = courseProgress(c, me.logs, me.athlete.id)
                  const next = nextSession(c, me.logs, me.athlete.id)
                  return (
                    <div key={c.id} className="card relative overflow-hidden p-5">
                      <div className="pointer-events-none absolute -top-20 -right-12 h-48 w-48 rounded-full opacity-20 blur-3xl" style={{ background: focusColor(c.focus) }} />
                      <button className="block w-full text-left" onClick={() => navigate(`/train/course/${c.id}`)}>
                        <Eyebrow>
                          {clock.state === 'upcoming' ? `Starts in ${clock.startsIn} days` : clock.state === 'finished' ? 'Finished' : `Week ${clock.weekIndex + 1} of ${clock.total}`} · with {athletes[c.coachId]?.name ?? 'your coach'}
                        </Eyebrow>
                        <div className="mt-2 flex items-end justify-between gap-3">
                          <h2 className="display text-[30px]">{c.title}</h2>
                          <ArrowRight size={17} className="mb-1.5 shrink-0 text-ink-3" />
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <Bar value={progress.ratio} color={focusColor(c.focus)} />
                          <span className="num shrink-0 text-[12px] text-ink-3">{progress.done}/{progress.total}</span>
                        </div>
                      </button>
                      {next && (
                        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
                          <div className="min-w-0 flex-1">
                            <div className="text-[11.5px] text-ink-3">{dayDiff(next.date) < 0 ? 'Catch up' : relativeDay(next.date)} · {next.session.blocks.length} exercises</div>
                            <div className="truncate text-[14.5px] font-medium">{next.session.title}</div>
                          </div>
                          <button className="btn btn-primary btn-sm" onClick={() => start({ type: 'course', courseId: c.id, sessionId: next.session.id }, next.session.title, next.session.blocks)}>
                            <Play size={12} fill="currentColor" /> Start
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Goal sessions */}
          {goalSessions.length > 0 && (
            <section className="rise rise-2">
              <SectionTitle>Toward your goals</SectionTitle>
              <div className="card divide-y divide-line">
                {goalSessions.map(({ goal, workout }) => (
                  <div key={goal.id} className="flex items-center gap-3 px-4 py-3 first:rounded-t-card last:rounded-b-card">
                    <button
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      onClick={() => setPreview({ title: workout!.title, eyebrow: `Goal session · about ${estimateMinutes(workout!.blocks)} min`, summary: workout!.summary, blocks: workout!.blocks, source: { type: 'goal', skillId: goal.id } })}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: `color-mix(in oklab, ${dvar(goal.discipline)} 16%, transparent)`, color: dvar(goal.discipline) }}>
                        <Target size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14.5px] font-medium">{goal.name}</span>
                        <span className="block truncate text-[12px] text-ink-3">{workout!.blocks.length} exercises for the missing steps</span>
                      </span>
                    </button>
                    <button aria-label={`Start ${workout!.title}`} className="pressable flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-bg" onClick={() => start({ type: 'goal', skillId: goal.id }, workout!.title, workout!.blocks)}>
                      <Play size={14} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick sessions */}
          <section className="rise rise-3">
            <SectionTitle>Quick sessions</SectionTitle>
            <p className="-mt-1 mb-3 text-[13px] text-ink-2">Each one opens at your own working level on every ladder.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {WORKOUT_TEMPLATES.map((t) => {
                const color = focusColor(t.focus)
                const open = () => {
                  const w = buildWorkout(t, me.evidence)
                  setPreview({ title: t.title, eyebrow: `${t.focus === 'full' ? 'Full body' : disciplineById[t.focus].name} · about ${t.minutes} min`, summary: t.summary, blocks: w.blocks, source: { type: 'library', workoutId: t.id } })
                }
                return (
                  <button key={t.id} onClick={open} className="pressable card relative flex min-h-[132px] flex-col overflow-hidden p-4 text-left hover:bg-surface-2">
                    <span className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full opacity-25 blur-2xl" style={{ background: color }} />
                    <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />{t.minutes} min
                    </span>
                    <span className="display mt-2 text-[22px] leading-[1.05]">{t.title}</span>
                    <span className="mt-auto pt-2 text-[12px] leading-snug text-ink-3">{t.plan.length} exercises</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 space-y-8 lg:mt-0">
          {/* Discover */}
          {discover.length > 0 && (
            <section className="rise rise-3">
              <SectionTitle>Courses you can join</SectionTitle>
              <div className="space-y-2.5">
                {discover.map((c) => (
                  <div key={c.id} className="card p-4">
                    <Eyebrow className="flex items-center gap-2">
                      {c.focus !== 'full' && <DisciplineDot id={c.focus} size={6} />}{c.weeks.length} weeks · {athletes[c.coachId]?.name ?? 'Coach'}
                    </Eyebrow>
                    <div className="display mt-2 text-[24px]">{c.title}</div>
                    <p className="mt-1 text-[13px] text-ink-2">{c.tagline}</p>
                    <div className="mt-3.5 flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => { joinCourse(c.id); navigate(`/train/course/${c.id}`) }}>Join course</button>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/train/course/${c.id}`)}>Look inside</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {assessed && (
            <section className="rise rise-4">
              <SectionTitle>Assessments</SectionTitle>
              <AssessHistory />
            </section>
          )}

          {/* History */}
          <section className="rise rise-4">
            <SectionTitle action={history.length > 6 ? <button className="text-[12.5px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4" onClick={() => setHistoryAll(!historyAll)}>{historyAll ? 'Show fewer' : `All ${history.length}`}</button> : undefined}>
              Training history
            </SectionTitle>
            {history.length === 0 ? (
              <Empty title={v('empty.logs.title')}>Your completed sessions appear here, with what you were assigned and what you actually did.</Empty>
            ) : (
              <div className="card divide-y divide-line">
                {(historyAll ? history : history.slice(0, 6)).map((l) => <LogRow key={l.id} log={l} onClick={() => setLogOpen(l.id)} />)}
              </div>
            )}
          </section>
        </div>
      </div>

      <Sheet open={!!preview} onClose={() => setPreview(null)} eyebrow={preview?.eyebrow} title={preview?.title}>
        {preview && (
          <>
            <p className="text-[14px] leading-relaxed text-ink-2">{preview.summary}</p>
            <div className="card mt-4 px-4"><BlockList blocks={preview.blocks} /></div>
            <p className="mt-3 text-[12px] text-ink-3">Levels are a starting point. You can move any exercise easier or harder once you begin.</p>
            <button className="btn btn-primary btn-lg mt-4 w-full" onClick={() => { const p = preview; setPreview(null); start(p.source, p.title, p.blocks) }}>
              <Play size={15} fill="currentColor" /> Start session
            </button>
          </>
        )}
      </Sheet>
      <LogSheet logId={logOpen} onClose={() => setLogOpen(null)} />
    </div>
  )
}
