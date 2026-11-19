import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, ArrowUpRight, ClipboardCheck, Play, Plus, ScanLine, Sparkles } from 'lucide-react'
import type { DisciplineId } from '@/domain/types'
import { DISCIPLINE_IDS, disciplineById, exerciseById, formatValue } from '@/domain/catalog'
import { auraTimeline } from '@/domain/scoring/aura'
import { goalView, nextSteps, recentUnlocks } from '@/domain/insights'
import { courseFor, WORKOUT_TEMPLATES, buildGoalWorkout, buildWorkout } from '@/domain/training'
import { nextSession, useIsCoach, useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { AuraDot, AuraField } from '@/ui/AuraField'
import { CountUp } from '@/ui/CountUp'
import { useWide, DisciplineDot, Eyebrow, Ring, SectionTitle, Sparkline, StatusTag, TextLink, TierTag } from '@/ui/primitives'
import { AuraSheet, LogEvidenceSheet, RatingSheet } from '@/features/shared/Explainers'
import { SkillSheet } from '@/features/tree/SkillSheet'
import { useStartWorkout } from '@/features/workout/useStart'
import { AssessPrompt } from '@/features/assess/AssessCards'
import { TrainingNow } from '@/features/places/shared'
import { completion } from '@/theme/personal'
import { useVoice } from '@/theme/useTheme'
import { dayDiff, dvar, initials, num, relativeDay, shortDate } from '@/lib/format'

const partOfDay = () => {
  const h = new Date().getHours()
  return h < 5 ? 'night' : h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
}

export function Home() {
  const me = useMe()
  const coach = useIsCoach()
  const navigate = useNavigate()
  const start = useStartWorkout()
  const v = useVoice()
  const personal = completion(me.athlete)
  const courses = useStore((s) => s.courses)
  const enrollments = useStore((s) => s.enrollments)

  const [auraOpen, setAuraOpen] = useState(false)
  const [ratingOpen, setRatingOpen] = useState<DisciplineId | null>(null)
  const [skillOpen, setSkillOpen] = useState<string | null>(null)
  const [logOpen, setLogOpen] = useState<string | null>(null)

  const timeline = useMemo(() => auraTimeline(me.evidence, new Date()), [me.evidence])
  const delta = timeline[timeline.length - 1].aura - timeline[0].aura
  const goals = me.athlete.goals.map((g) => goalView(g, me.statuses)).filter((g) => g !== null)
  const steps = useMemo(() => nextSteps(me.statuses, me.ratings, me.athlete.goals), [me])
  const unlocks = useMemo(() => recentUnlocks(me.statuses, 4), [me.statuses])

  const upcoming = useMemo(
    () =>
      enrollments
        .filter((e) => e.athleteId === me.athlete.id)
        .map((e) => courses.find((c) => c.id === e.courseId))
        .filter((c) => c !== undefined)
        .map((c) => nextSession(courseFor(c, me.evidence), me.logs, me.athlete.id))
        .filter((s) => s !== null)
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [enrollments, courses, me.logs, me.athlete.id, me.evidence],
  )
  const next = upcoming[0]
  const fallback = WORKOUT_TEMPLATES.find((t) => t.focus === (me.aura.peak?.discipline ?? 'full')) ?? WORKOUT_TEMPLATES[6]
  const cls = me.aura.cls
  const wide = useWide()

  // The numbers behind the Aura. Beside it where there is room; on a phone, after what there is to do.
  const numbers = (
    <>
      <div className="rise rise-3 card mt-6 flex items-center justify-between gap-4 p-4">
        <div>
          <Eyebrow>Last 12 weeks</Eyebrow>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="display num text-[30px]">{delta >= 0 ? '+' : ''}{num(delta)}</span>
            <span className="text-[12.5px] text-ink-3">{delta > 0 ? 'new evidence' : 'no new evidence'}</span>
          </div>
        </div>
        <Sparkline points={timeline.map((t) => t.aura)} width={132} height={44} />
      </div>

      <div className="rise rise-4 mt-3 grid grid-cols-3 gap-2">
        {DISCIPLINE_IDS.map((d) => {
          const r = me.ratings[d]
          return (
            <button key={d} onClick={() => setRatingOpen(d)} className="pressable card px-3 py-3 text-left hover:bg-surface-2">
              <span className="flex items-center gap-1.5 text-[11.5px] text-ink-2"><DisciplineDot id={d} size={6} />{disciplineById[d].short}</span>
              <span className="display num mt-1 block text-[26px]">{r.rating || '—'}</span>
            </button>
          )
        })}
      </div>
    </>
  )

  return (
    <div>
      <header className="rise flex items-center justify-between pt-6 pb-2 lg:pt-10">
        <button onClick={() => navigate('/profile')} className="flex items-center gap-3 text-left">
          <span className="lg:hidden"><AuraDot mix={me.aura.mix} size={40}>{initials(me.athlete.name)}</AuraDot></span>
          <span>
            <Eyebrow>{v(`home.greeting.${partOfDay()}`)}</Eyebrow>
            <span className="display mt-1 block text-[26px] lg:text-[34px]">{me.athlete.name.split(' ')[0]}</span>
          </span>
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={() => navigate('/athletes')} aria-label="Scan athletes" className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2">
            <ScanLine size={18} />
          </button>
          {coach && (
            <button onClick={() => navigate('/coach')} aria-label="Coach Studio" className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2">
              <ClipboardCheck size={18} />
            </button>
          )}
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
        {/* ── Aura ── */}
        <section className="lg:sticky lg:top-8">
          <button onClick={() => setAuraOpen(true)} className="rise rise-1 mx-auto -mt-1 flex w-full flex-col items-center" aria-label="How Aura is computed">
            <AuraField mix={me.aura.mix} aura={me.aura.aura} size={wide ? 330 : 280} progress={cls.progress}>
              <Eyebrow>Aura</Eyebrow>
              <div className="display mt-1 text-[84px] leading-none">{me.aura.aura ? <CountUp value={me.aura.aura} /> : '—'}</div>
              <div className="mt-2 text-[14px] text-ink-2">{me.aura.title}</div>
            </AuraField>
          </button>

          <div className="rise rise-2 -mt-2 flex items-center justify-center gap-2">
            <StatusTag status={me.aura.status} />
            {cls.next && <span className="num text-[12.5px] text-ink-3">{v('home.toNext', { n: num(cls.next.min - me.aura.aura), label: cls.next.label })}</span>}
          </div>
          <p className="rise rise-2 display mx-auto mt-4 max-w-[330px] text-center text-[19px] leading-snug text-ink-2">{v('home.line')}</p>

          <div className="hidden lg:block">{numbers}</div>
        </section>

        <div className="mt-8 space-y-8 lg:mt-4">
          {!personal.core && (
            <button onClick={() => navigate('/personalize')} className="rise card pressable mb-3 flex w-full items-center gap-3.5 p-3.5 text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink"><Sparkles size={17} /></span>
              <span className="min-w-0 flex-1"><span className="block text-[14.5px] font-medium">Personalize</span><span className="block text-[12.5px] leading-snug text-ink-3">{v('personal.start')}</span></span>
              <ArrowRight size={16} className="shrink-0 text-ink-3" />
            </button>
          )}
          <div className="rise rise-3 empty:hidden"><AssessPrompt /></div>

          {/* ── Next session ── */}
          <section className="rise rise-3">
            <SectionTitle action={<TextLink onClick={() => navigate('/train')}>All training</TextLink>}>Up next</SectionTitle>
            {next ? (
              <div className="card relative overflow-hidden p-5">
                <div className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full opacity-25 blur-3xl" style={{ background: dvar(next.course.focus === 'full' ? 'push' : next.course.focus) }} />
                <Eyebrow>
                  {dayDiff(next.date) < 0 ? `Catch up · ${shortDate(next.date)}` : relativeDay(next.date)} · {next.course.title} · Week {next.weekIndex + 1} of {next.course.weeks.length}
                </Eyebrow>
                <div className="display mt-2.5 text-[32px]">{next.session.title}</div>
                <p className="mt-1.5 text-[13.5px] text-ink-2">{next.course.weeks[next.weekIndex].objective}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {next.session.blocks.slice(0, 5).map((b) => (
                    <span key={b.id} className="rounded-full bg-surface-2 px-2.5 py-1 text-[12px] text-ink-2">{exerciseById[b.exerciseId].short}</span>
                  ))}
                </div>
                <div className="mt-5 flex gap-2.5">
                  <button
                    className="btn btn-primary flex-1"
                    onClick={() => start({ type: 'course', courseId: next.course.id, sessionId: next.session.id }, next.session.title, next.session.blocks)}
                  >
                    <Play size={15} fill="currentColor" /> Start session
                  </button>
                  <button className="btn btn-outline" onClick={() => navigate(`/train/course/${next.course.id}`)}>Course</button>
                </div>
              </div>
            ) : (
              <div className="card p-5">
                <Eyebrow>Suggested · {fallback.minutes} min</Eyebrow>
                <div className="display mt-2.5 text-[32px]">{fallback.title}</div>
                <p className="mt-1.5 text-[13.5px] text-ink-2">{fallback.summary}</p>
                <button
                  className="btn btn-primary mt-5 w-full"
                  onClick={() => start({ type: 'library', workoutId: fallback.id }, fallback.title, buildWorkout(fallback, me.evidence).blocks)}
                >
                  <Play size={15} fill="currentColor" /> Start now
                </button>
              </div>
            )}
          </section>

          {/* ── Goals ── */}
          <section className="rise rise-4">
            <SectionTitle action={<TextLink onClick={() => navigate('/tree')}>Choose goals</TextLink>}>Goals</SectionTitle>
            {goals.length === 0 ? (
              <button onClick={() => navigate('/tree')} className="pressable flex w-full items-center gap-3 rounded-card border border-dashed border-line-strong p-5 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2"><Plus size={18} /></span>
                <span>
                  <span className="block text-[15px] font-medium">Pick a skill to work toward</span>
                  <span className="block text-[13px] text-ink-2">Open any node in the tree and set it as a goal.</span>
                </span>
              </button>
            ) : (
              <div className="card divide-y divide-line">
                {goals.map((g) => {
                  const step = g.frontier[0] ?? g.missing[0]
                  const stepEx = step ? exerciseById[step.exerciseId] : null
                  const st = step ? me.statuses[step.id] : null
                  return (
                    <div key={g.skill.id} className="flex items-center gap-3.5 px-4 py-3.5" data-goal={g.skill.id}>
                      <button className="flex min-w-0 flex-1 items-center gap-3.5 text-left" onClick={() => setSkillOpen(g.skill.id)}>
                        <Ring value={g.progress} size={46} stroke={3} color={dvar(g.skill.discipline)}>
                          <span className="num text-[12px] font-semibold">{Math.round(g.progress * 100)}</span>
                        </Ring>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-medium">{g.skill.name}</span>
                          <span className="block truncate text-[12.5px] text-ink-3">
                            {g.done ? 'Achieved' : step && stepEx && st ? <>Next: {step.name} · <span className="num text-ink-2">{st.best ? formatValue(stepEx, st.best) : '0'} / {formatValue(stepEx, step.threshold)}</span></> : `${g.missing.length} ${g.missing.length === 1 ? 'step' : 'steps'} to go`}
                          </span>
                        </span>
                      </button>
                      {!g.done && (
                        <button
                          aria-label={`Train toward ${g.skill.name}`}
                          className="pressable flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-bg"
                          onClick={() => {
                            const w = buildGoalWorkout(g.skill.id, me.evidence, me.statuses)
                            if (w) start({ type: 'goal', skillId: g.skill.id }, w.title, w.blocks)
                          }}
                        >
                          <Play size={14} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Who else is out training: good to know, after what there is to do. */}
          <div className="rise rise-4 empty:hidden"><TrainingNow /></div>

          <div className="lg:hidden">{numbers}</div>

          {/* ── Next steps: for someone with no goal yet. With goals, each goal already names its next step. ── */}
          {steps.length > 0 && goals.length === 0 && (
            <section className="rise rise-5">
              <SectionTitle>Recommended next steps</SectionTitle>
              <div className="card divide-y divide-line">
                {steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => (s.skill ? setSkillOpen(s.skill.id) : setLogOpen(s.exerciseId))}
                    className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors first:rounded-t-card last:rounded-b-card hover:bg-surface-2"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: `color-mix(in oklab, ${dvar(s.discipline)} 16%, transparent)`, color: dvar(s.discipline) }}>
                      {s.kind === 'benchmark' ? <Plus size={16} /> : <ArrowUpRight size={16} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-medium">{s.title}</span>
                      <span className="block truncate text-[12.5px] text-ink-2">{s.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ── Recent achievements ── */}
          {unlocks.length > 0 && (
            <section className="rise rise-6">
              <SectionTitle action={<TextLink onClick={() => navigate('/profile')}>All achievements</TextLink>}>Recently unlocked</SectionTitle>
              <div className="grid grid-cols-2 gap-2.5">
                {unlocks.slice(0, wide ? 4 : 2).map((s) => (
                  <button key={s.id} onClick={() => setSkillOpen(s.id)} className="pressable card p-4 text-left hover:bg-surface-2">
                    <div className="flex items-center justify-between">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: dvar(s.discipline), boxShadow: `0 0 14px ${dvar(s.discipline)}` }} />
                      <TierTag tier={me.statuses[s.id].tier!} compact />
                    </div>
                    <div className="mt-3 text-[14.5px] leading-snug font-medium">{s.name}</div>
                    <div className="mt-1 text-[11.5px] text-ink-3">{relativeDay(me.statuses[s.id].achievedAt!)}</div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <AuraSheet aura={me.aura} dedication={me.dedication.score} open={auraOpen} onClose={() => setAuraOpen(false)} />
      <RatingSheet rating={ratingOpen ? me.ratings[ratingOpen] : null} open={!!ratingOpen} onClose={() => setRatingOpen(null)} onLog={(id) => { setRatingOpen(null); setLogOpen(id) }} />
      <SkillSheet skillId={skillOpen} onClose={() => setSkillOpen(null)} onOpenSkill={setSkillOpen} />
      <LogEvidenceSheet exerciseId={logOpen} open={!!logOpen} onClose={() => setLogOpen(null)} />
    </div>
  )
}
