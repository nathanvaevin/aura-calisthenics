import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import type { DisciplineId, EquipmentId, Evidence } from '@/domain/types'
import { DISCIPLINE_IDS, EQUIPMENT, SKILLS, disciplineById, skillById } from '@/domain/catalog'
import { computeAura } from '@/domain/scoring/aura'
import { allRatings } from '@/domain/scoring/mastery'
import { pathTo, skillStatuses } from '@/domain/scoring/skills'
import { buildWorkout, templateById } from '@/domain/training'
import { useStore } from '@/data/store'
import { isCloudConfigured, signInWithGoogle } from '@/data/supabase'
import { AuraField } from '@/ui/AuraField'
import { CountUp } from '@/ui/CountUp'
import { DisciplineDot, Eyebrow, StatusTag, Stepper, Toggle } from '@/ui/primitives'
import { Wordmark } from '@/app/Shell'
import { landing } from '@/app/landing'
import { cx, dvar } from '@/lib/format'

type Level = 0 | 1 | 2

const EXPERIENCE: { level: Level; title: string; body: string }[] = [
  { level: 0, title: 'New to this', body: 'Little or no bodyweight training so far.' },
  { level: 1, title: 'Training for a while', body: 'Comfortable with push-ups and some time on a bar.' },
  { level: 2, title: 'Years in', body: 'Consistent training and a few advanced skills.' },
]

const GOALS = [
  'push-first', 'pull-first', 'pull-10', 'hs-free-10', 'hs-free-30', 'pull-mu-1', 'core-lsit-30',
  'legs-pistol-1', 'push-wallhspu-1', 'pull-fl-full-5', 'push-pl-full-5', 'mob-pancake', 'mob-front-split',
]

interface Question {
  id: string
  discipline: DisciplineId
  title: string
  hint: string
  /** Lowest experience level this question is shown to. */
  from: Level
  /** Each answer records the conservative end of its range. */
  options: { label: string; ev: [string, number][] }[]
}

const QUESTIONS: Question[] = [
  {
    id: 'pushup', discipline: 'push', from: 0, title: 'Push-ups in one set', hint: 'Chest to the floor, body straight.',
    options: [
      { label: 'Not yet', ev: [] }, { label: '1–4', ev: [['pushup', 1]] }, { label: '5–9', ev: [['pushup', 5]] },
      { label: '10–19', ev: [['pushup', 10]] }, { label: '20–29', ev: [['pushup', 20]] }, { label: '30+', ev: [['pushup', 30]] },
    ],
  },
  {
    id: 'dip', discipline: 'push', from: 1, title: 'Parallel bar dips', hint: 'Shoulders below elbows, full lockout.',
    options: [
      { label: 'Not yet', ev: [] }, { label: '1–4', ev: [['dip', 1]] }, { label: '5–9', ev: [['dip', 5]] },
      { label: '10–19', ev: [['dip', 10]] }, { label: '20+', ev: [['dip', 20]] },
    ],
  },
  {
    id: 'pullup', discipline: 'pull', from: 0, title: 'Strict pull-ups', hint: 'From a dead hang, chin over the bar, no swing.',
    options: [
      { label: 'Not yet', ev: [] }, { label: '1–2', ev: [['pull-up', 1]] }, { label: '3–5', ev: [['pull-up', 3]] },
      { label: '6–9', ev: [['pull-up', 6]] }, { label: '10–14', ev: [['pull-up', 10]] }, { label: '15+', ev: [['pull-up', 15]] },
    ],
  },
  {
    id: 'hang', discipline: 'pull', from: 0, title: 'Dead hang from a bar', hint: 'Both hands, feet off the floor.',
    options: [
      { label: 'Under 15s', ev: [] }, { label: '15–29s', ev: [['dead-hang', 15]] },
      { label: '30–59s', ev: [['dead-hang', 30]] }, { label: '60s+', ev: [['dead-hang', 60]] },
    ],
  },
  {
    id: 'core', discipline: 'core', from: 0, title: 'Plank or hollow body hold', hint: 'Pick the hardest one you can do with good form.',
    options: [
      { label: 'Plank under 30s', ev: [] }, { label: 'Plank 30s+', ev: [['plank', 30]] }, { label: 'Plank 60s+', ev: [['plank', 60]] },
      { label: 'Hollow 30s+', ev: [['plank', 60], ['hollow-hold', 30]] }, { label: 'Hollow 60s+', ev: [['plank', 60], ['hollow-hold', 60]] },
    ],
  },
  {
    id: 'lsit', discipline: 'core', from: 1, title: 'L-sit', hint: 'Supported on the hands, feet off the floor.',
    options: [
      { label: 'Not yet', ev: [] }, { label: 'Tucked 10s+', ev: [['tuck-l-sit', 10]] }, { label: 'Straight 5s+', ev: [['tuck-l-sit', 20], ['l-sit', 5]] },
      { label: 'Straight 10s+', ev: [['tuck-l-sit', 20], ['l-sit', 10]] }, { label: 'Straight 20s+', ev: [['tuck-l-sit', 20], ['l-sit', 20]] },
    ],
  },
  {
    id: 'handstand', discipline: 'handstand', from: 0, title: 'Handstand', hint: 'Freestanding means no wall and no walking on the hands.',
    options: [
      { label: 'Never tried', ev: [] }, { label: 'Wall, under 30s', ev: [['back-to-wall-hs', 15]] },
      { label: 'Wall, 30s+', ev: [['back-to-wall-hs', 30], ['chest-to-wall-hs', 30]] },
      { label: 'Free, a few seconds', ev: [['chest-to-wall-hs', 30], ['freestanding-hs', 3]] },
      { label: 'Free, 10s+', ev: [['chest-to-wall-hs', 60], ['freestanding-hs', 10]] },
      { label: 'Free, 30s+', ev: [['chest-to-wall-hs', 60], ['freestanding-hs', 30]] },
    ],
  },
  {
    id: 'squat', discipline: 'legs', from: 0, title: 'Bodyweight squats in one set', hint: 'Hips below knees, heels down.',
    options: [
      { label: 'Under 10', ev: [] }, { label: '10–19', ev: [['squat', 10]] }, { label: '20–29', ev: [['squat', 20]] }, { label: '30+', ev: [['squat', 30]] },
    ],
  },
  {
    id: 'pistol', discipline: 'legs', from: 1, title: 'Pistol squat', hint: 'Single-leg squat to full depth, each side.',
    options: [
      { label: 'Not yet', ev: [] }, { label: 'With support', ev: [['assisted-pistol', 3]] }, { label: '1–2', ev: [['pistol-squat', 1]] },
      { label: '3–4', ev: [['pistol-squat', 3]] }, { label: '5+', ev: [['pistol-squat', 5]] },
    ],
  },
  {
    id: 'fold', discipline: 'mobility', from: 0, title: 'Standing forward fold', hint: 'Knees locked straight.',
    options: [
      { label: 'Can’t reach the floor', ev: [] }, { label: 'Fingertips touch', ev: [['toe-touch', 10]] },
      { label: 'Palms flat', ev: [['toe-touch', 30], ['palms-floor-fold', 10]] },
    ],
  },
  {
    id: 'deepsquat', discipline: 'mobility', from: 0, title: 'Resting in a deep squat', hint: 'Heels flat, no support.',
    options: [
      { label: 'Can’t hold it', ev: [] }, { label: 'Under a minute', ev: [['deep-squat-hold', 30]] },
      { label: 'A minute+', ev: [['deep-squat-hold', 60]] }, { label: 'Three minutes+', ev: [['deep-squat-hold', 180]] },
    ],
  },
]

const EVEN = Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, 1 / 6])) as Record<DisciplineId, number>
const slug = (name: string) => name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')

export function Onboarding() {
  const navigate = useNavigate()
  const startDemo = useStore((s) => s.startDemo)
  const complete = useStore((s) => s.completeOnboarding)
  const startWorkout = useStore((s) => s.startWorkout)
  const startSolo = useStore((s) => s.startSoloAssessment)

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [handle, setHandle] = useState<string | null>(null)
  const [coach, setCoach] = useState(false)
  const [level, setLevel] = useState<Level>(0)
  const [weekly, setWeekly] = useState(3)
  const [equipment, setEquipment] = useState<EquipmentId[]>(['floor', 'wall', 'bar', 'box'])
  const [goals, setGoals] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const questions = QUESTIONS.filter((q) => q.from <= level)
  const estimates = useMemo(() => {
    const out: Record<string, number> = {}
    for (const q of QUESTIONS) {
      if (q.from > level || answers[q.id] === undefined) continue
      for (const [id, v] of q.options[answers[q.id]].ev) out[id] = Math.max(out[id] ?? 0, v)
    }
    return out
  }, [answers, level])

  const preview = useMemo(() => {
    const evidence: Evidence[] = Object.entries(estimates).map(([exerciseId, value], i) => ({
      id: `p${i}`, athleteId: 'me', exerciseId, value, tier: 'estimated', source: 'onboarding', date: new Date().toISOString(),
    }))
    const ratings = allRatings(evidence)
    const statuses = skillStatuses(evidence)
    const open = goals.filter((g) => statuses[g]?.state !== 'mastered')
    const first = open.map((g) => pathTo(g, statuses).find((s) => statuses[s.id].state === 'available')).find(Boolean)
    return {
      evidence,
      ratings,
      aura: computeAura(ratings),
      mastered: SKILLS.filter((s) => statuses[s.id].state === 'mastered').length,
      available: SKILLS.filter((s) => statuses[s.id].state === 'available').length,
      first,
      already: goals.filter((g) => statuses[g]?.state === 'mastered'),
    }
  }, [estimates, goals])

  const result = () => ({ name, handle: handle ?? slug(name), coach, weeklyTarget: weekly, equipment, goals: goals.filter((g) => !preview.already.includes(g)), estimates })
  const finish = (train: boolean) => {
    complete(result())
    if (train) {
      const t = templateById['full-body']
      startWorkout({ type: 'library', workoutId: t.id }, t.title, buildWorkout(t, preview.evidence).blocks)
    }
    navigate(train ? '/workout' : '/', { replace: true })
  }

  const canContinue = step === 1 ? name.trim().length > 0 : true
  const last = 5

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-6">
      <div className="page-glow" />

      {step > 0 && (
        <header className="safe-top relative z-10 flex h-16 shrink-0 items-center justify-between">
          <button onClick={() => setStep(step - 1)} aria-label="Back" className="pressable -ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-2 hover:text-ink"><ArrowLeft size={19} /></button>
          <div className="flex gap-1.5">
            {Array.from({ length: last }, (_, i) => <span key={i} className={cx('h-1 rounded-full transition-all duration-500', i + 1 === step ? 'w-6 bg-ink' : i + 1 < step ? 'w-2.5 bg-ink-2' : 'w-2.5 bg-surface-3')} />)}
          </div>
          <span className="w-8" />
        </header>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="relative z-10 flex min-h-0 flex-1 flex-col"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 0 · Welcome */}
          {step === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center pt-8 pb-6 text-center">
              <AuraField mix={EVEN} aura={7200} size={300}>
                <Wordmark size={54} />
              </AuraField>
              <h1 className="display mt-6 text-[44px] leading-[1.02] sm:text-[52px]">Make human potential <span className="italic">visible.</span></h1>
              <p className="mt-5 max-w-sm text-[15.5px] leading-relaxed text-ink-2">
                See what you can do today, what you could become, and the exact steps between the two. Progress here is earned by what you demonstrate, never by what you log.
              </p>
              <div className="mt-9 flex w-full max-w-sm flex-col gap-2.5">
                <button className="btn btn-primary btn-lg" onClick={() => setStep(1)}>Begin <ArrowRight size={17} /></button>
                <button className="btn btn-outline" onClick={startDemo}>Explore the demo</button>
                {isCloudConfigured && <button className="btn btn-quiet" onClick={() => signInWithGoogle()}>Continue with Google</button>}
              </div>
              <p className="mt-4 max-w-xs text-[12px] text-ink-3">The demo opens a sample athlete with history, two courses and Coach Studio, so you can see everything working.</p>
            </div>
          )}

          {/* 1 · Identity */}
          {step === 1 && (
            <Step eyebrow="Athlete identity" title="Who is training?">
              <label className="block"><Eyebrow className="mb-2">Name</Eyebrow><input autoFocus className="field !h-14 text-[17px]" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label className="mt-4 block">
                <Eyebrow className="mb-2">Handle</Eyebrow>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3">@</span>
                  <input className="field pl-8" placeholder="handle" value={handle ?? slug(name)} onChange={(e) => setHandle(e.target.value.replace(/[^\w.]/g, '').toLowerCase())} />
                </div>
              </label>
              <div className="card mt-5 flex items-center justify-between gap-4 p-4">
                <span className="text-[14.5px] font-medium">I also coach<span className="mt-0.5 block text-[12.5px] font-normal text-ink-3">Adds Coach Studio for building courses and reviewing students.</span></span>
                <Toggle on={coach} onChange={setCoach} label="I also coach" />
              </div>
            </Step>
          )}

          {/* 2 · Experience */}
          {step === 2 && (
            <Step eyebrow="Experience" title="Where are you starting from?">
              <div className="space-y-2.5">
                {EXPERIENCE.map((e) => (
                  <button key={e.level} onClick={() => setLevel(e.level)} className={cx('pressable flex w-full items-center gap-4 rounded-[22px] border p-4 text-left', level === e.level ? 'border-ink bg-surface' : 'border-line')}>
                    <span className={cx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', level === e.level ? 'border-ink bg-ink text-bg' : 'border-line-strong')}>{level === e.level && <Check size={13} strokeWidth={3} />}</span>
                    <span><span className="block text-[15.5px] font-medium">{e.title}</span><span className="block text-[13px] text-ink-2">{e.body}</span></span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span><Eyebrow>Sessions per week</Eyebrow><span className="mt-1 block text-[12.5px] text-ink-3">What you realistically intend to do.</span></span>
                <Stepper value={weekly} onChange={setWeekly} min={1} max={7} />
              </div>
              <Eyebrow className="mt-6 mb-2.5">Equipment you can use</Eyebrow>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(EQUIPMENT) as EquipmentId[]).map((id) => (
                  <button key={id} className="chip" data-on={equipment.includes(id)} onClick={() => setEquipment(equipment.includes(id) ? equipment.filter((x) => x !== id) : [...equipment, id])}>{EQUIPMENT[id]}</button>
                ))}
              </div>
            </Step>
          )}

          {/* 3 · Goals */}
          {step === 3 && (
            <Step eyebrow="Goals" title="What do you want to be able to do?" sub="Pick up to three. Any skill in the tree can become a goal later.">
              <div className="grid grid-cols-2 gap-2.5">
                {GOALS.map((g) => {
                  const s = skillById[g]
                  const on = goals.includes(g)
                  return (
                    <button
                      key={g}
                      disabled={!on && goals.length >= 3}
                      onClick={() => setGoals(on ? goals.filter((x) => x !== g) : [...goals, g])}
                      className={cx('pressable flex min-h-[84px] flex-col justify-between rounded-[20px] border p-3.5 text-left disabled:opacity-40', on ? 'border-transparent' : 'border-line')}
                      style={on ? { background: `color-mix(in oklab, ${dvar(s.discipline)} 18%, var(--surface))`, boxShadow: `inset 0 0 0 1.5px ${dvar(s.discipline)}` } : undefined}
                    >
                      <span className="flex items-center justify-between text-[11px] text-ink-3">
                        <span className="flex items-center gap-1.5"><DisciplineDot id={s.discipline} size={6} />{disciplineById[s.discipline].short}</span>
                        {on && <Check size={14} strokeWidth={2.6} style={{ color: dvar(s.discipline) }} />}
                      </span>
                      <span className="mt-2 text-[14.5px] leading-snug font-medium">{s.name}</span>
                    </button>
                  )
                })}
              </div>
            </Step>
          )}

          {/* 4 · Assessment */}
          {step === 4 && (
            <Step eyebrow="Starting point" title="What can you do today?" sub="A quick estimate to get you started. Answer honestly and skip anything you have not tried. The physical assessment afterwards replaces these with real results.">
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id}>
                    <div className="flex items-center gap-2 text-[15px] font-medium"><DisciplineDot id={q.discipline} />{q.title}</div>
                    <div className="mt-0.5 text-[12.5px] text-ink-3">{q.hint}</div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {q.options.map((o, i) => (
                        <button key={o.label} className="chip" data-on={answers[q.id] === i} onClick={() => setAnswers(answers[q.id] === i ? Object.fromEntries(Object.entries(answers).filter(([k]) => k !== q.id)) : { ...answers, [q.id]: i })}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Step>
          )}

          {/* 5 · Profile */}
          {step === 5 && (
            <div className="flex flex-1 flex-col items-center pb-6 text-center">
              <AuraField mix={preview.aura.aura ? preview.aura.mix : EVEN} aura={preview.aura.aura} size={280} progress={preview.aura.cls.progress}>
                <Eyebrow>Starting Aura</Eyebrow>
                <div className="display mt-1 text-[72px] leading-none">{preview.aura.aura ? <CountUp value={preview.aura.aura} duration={1800} /> : '—'}</div>
                <div className="mt-2 text-[13.5px] text-ink-2">{preview.aura.title}</div>
              </AuraField>
              <div className="-mt-1"><StatusTag status={preview.aura.aura ? 'estimated' : 'unrated'} /></div>
              <h1 className="display mt-5 text-[34px]">{name.trim().split(' ')[0] || 'Athlete'}, this is your starting line.</h1>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-2">
                {preview.aura.aura
                  ? 'Everything here is an estimate from your answers and is labelled that way. Each real set you put on record replaces an estimate.'
                  : 'No estimates yet, which is a perfectly good place to begin. Your first logged sets will light this up.'}
              </p>

              <div className="mt-6 grid w-full grid-cols-3 gap-2">
                {DISCIPLINE_IDS.map((d) => (
                  <div key={d} className="rounded-[18px] border border-dashed border-line-strong px-3 py-2.5 text-left">
                    <span className="flex items-center gap-1.5 text-[11px] text-ink-2"><DisciplineDot id={d} size={6} />{disciplineById[d].short}</span>
                    <span className="display num mt-0.5 block text-[24px]">{preview.ratings[d].rating || '—'}</span>
                  </div>
                ))}
              </div>

              <div className="card mt-3 w-full divide-y divide-line text-left">
                <div className="flex items-center justify-between px-4 py-3 text-[14px]"><span>Skills already within your ability</span><span className="num font-medium">{preview.mastered}</span></div>
                <div className="flex items-center justify-between px-4 py-3 text-[14px]"><span>Skills open to work on now</span><span className="num font-medium">{preview.available}</span></div>
                {preview.first && (
                  <div className="px-4 py-3">
                    <Eyebrow>Recommended first step</Eyebrow>
                    <div className="mt-1 flex items-center gap-2 text-[14.5px] font-medium"><DisciplineDot id={preview.first.discipline} />{preview.first.name}</div>
                  </div>
                )}
                {preview.already.length > 0 && (
                  <div className="px-4 py-3 text-[13px] text-ink-2">Already within reach of your answers: {preview.already.map((g) => skillById[g].name).join(', ')}. Pick a bigger goal from the tree.</div>
                )}
              </div>

              <div className="mt-6 flex w-full flex-col gap-2.5">
                <button className="btn btn-primary btn-lg" onClick={() => finish(true)}>Start my first session</button>
                <button className="btn btn-outline" onClick={() => { complete(result()); landing.to = `/assess/${startSolo()}` }}>Test it properly: take the physical assessment</button>
                <button className="btn btn-quiet" onClick={() => finish(false)}>Go to my profile</button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && step < last && (
        <footer className="safe-bottom sticky bottom-0 z-10 shrink-0 bg-gradient-to-t from-bg via-bg to-transparent pt-6 pb-5">
          <button className="btn btn-primary btn-lg w-full" disabled={!canContinue} onClick={() => setStep(step + 1)}>
            {step === 4 ? 'See my profile' : 'Continue'} <ArrowRight size={17} />
          </button>
          {step === 3 && goals.length === 0 && <p className="mt-2 text-center text-[12px] text-ink-3">You can skip this and choose goals later.</p>}
        </footer>
      )}
    </div>
  )
}

function Step({ eyebrow, title, sub, children }: { eyebrow: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 pt-2 pb-4">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="display mt-2 text-[36px] leading-[1.04]">{title}</h1>
      {sub && <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}
