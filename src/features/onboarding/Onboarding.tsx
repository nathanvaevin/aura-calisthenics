import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import type { DisciplineId, EquipmentId, Evidence } from '@/domain/types'
import { DISCIPLINE_IDS, EQUIPMENT, disciplineById, skillById } from '@/domain/catalog'
import { computeAura } from '@/domain/scoring/aura'
import { allRatings } from '@/domain/scoring/mastery'
import { skillStatuses } from '@/domain/scoring/skills'
import { useStore } from '@/data/store'
import { handleFree, signInWithGoogle, signOut, useCloud } from '@/data/cloud'
import { GoogleButton, Notice } from '@/features/account/Account'
import { requestCoach } from '@/features/account/CoachAccess'
import { AuraField, IGNITE_SECONDS } from '@/ui/AuraField'
import { CountUp } from '@/ui/CountUp'
import { DisciplineDot, Eyebrow, StatusTag, Stepper, Toggle } from '@/ui/primitives'
import { Wordmark } from '@/app/Shell'
import { landing } from '@/app/landing'
import { cx, dvar } from '@/lib/format'
import { ScoreDeck } from './ScoreDeck'

type Level = 0 | 1 | 2

const EXPERIENCE: { level: Level; title: string }[] = [
  { level: 0, title: 'New to this' },
  { level: 1, title: 'Training for a while' },
  { level: 2, title: 'Years in' },
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

  // The sample world is no longer offered on the welcome screen. It is still there for testing, by address only: …/welcome?demo
  const [params] = useSearchParams()
  const wantsDemo = params.has('demo')
  useEffect(() => {
    if (wantsDemo) startDemo()
  }, [wantsDemo, startDemo])
  // The first screen is fitted to the height it has, so that nothing on it needs scrolling.
  const tall = useHeight()

  // With accounts, the questions come after signing in: the profile already exists and has a name.
  const configured = useCloud((s) => s.configured)
  const account = useCloud((s) => (s.auth === 'in' ? s.user : null))
  const existing = useStore((s) => (s.meId && s.meId === s.cloudUid ? s.athletes[s.meId] : null))
  const first = account ? 1 : 0

  const [stepAt, setStep] = useState(first)
  // With accounts, "Get started" first asks for one; the questions come after signing in.
  const [accountStep, setAccountStep] = useState(false)
  const step = Math.max(stepAt, first)
  const [name, setName] = useState(existing?.name && existing.name !== 'Athlete' ? existing.name : '')
  const [handle, setHandle] = useState<string | null>(null)
  const [handleNote, setHandleNote] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
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
    return { ratings, aura: computeAura(ratings), already: goals.filter((g) => statuses[g]?.state === 'mastered') }
  }, [estimates, goals])

  const result = () => ({ name, handle: chosen, coach, weeklyTarget: weekly, equipment, goals: goals.filter((g) => !preview.already.includes(g)), estimates })
  const submit = () => {
    complete(result())
    // With an account, coaching is asked for, not switched on. The answer shows in Profile.
    if (account && coach && !account.guest) void requestCoach('Asked during sign-up').catch(() => undefined)
  }
  // The questions end on the athlete's own profile, where the introduction is waiting.
  const finish = () => {
    landing.to = '/profile'
    submit()
    navigate('/profile', { replace: true })
  }

  const chosen = handle ?? slug(name)
  const canContinue = step === 1 ? name.trim().length > 0 && !checking : true
  const last = 5

  const next = async () => {
    if (step === 1 && account) {
      // The handle is how other people find this profile, so it has to be valid and nobody else's.
      if (!/^[a-z0-9_.]{2,30}$/.test(chosen)) return setHandleNote('Use 2 to 30 letters, numbers, dots or underscores.')
      setChecking(true)
      const free = await handleFree(chosen)
      setChecking(false)
      if (!free) return setHandleNote('That handle is taken. Try another.')
    }
    setHandleNote(null)
    setStep(step + 1)
  }

  const welcome = step === 0 && !accountStep
  // "Get started" lights the circle first: the ring fills, the Aura bursts, and the next screen comes out of it.
  const [igniting, setIgniting] = useState(false)
  const ignite = (then: () => void) => {
    if (igniting) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return then()
    setIgniting(true)
    window.setTimeout(() => { then(); setIgniting(false) }, IGNITE_SECONDS * 1000 - 80)
  }
  const firstName = name.trim().split(' ')[0] || 'Athlete'

  return (
    <div className={cx('relative mx-auto flex w-full max-w-[520px] flex-col px-6', welcome ? 'h-dvh touch-none overflow-hidden' : 'min-h-dvh')} data-welcome={welcome || undefined}>
      <div className="page-glow" />

      {step > 0 && (
        <header className="safe-top relative z-10 flex h-16 shrink-0 items-center justify-between">
          {step > first
            ? <button onClick={() => setStep(step - 1)} aria-label="Back" className="pressable -ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-2 hover:text-ink"><ArrowLeft size={19} /></button>
            : <button onClick={() => void signOut()} className="pressable -ml-1 h-10 rounded-full px-1 text-[12.5px] text-ink-3 hover:text-ink">Sign out</button>}
          <div className="flex gap-1.5">
            {Array.from({ length: last }, (_, i) => <span key={i} className={cx('h-1 rounded-full transition-all duration-500', i + 1 === step ? 'w-6 bg-ink' : i + 1 < step ? 'w-2.5 bg-ink-2' : 'w-2.5 bg-surface-3')} />)}
          </div>
          <span className="w-8" />
        </header>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step === 0 && accountStep ? 'account' : step}
          className="relative z-10 flex min-h-0 flex-1 flex-col"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 0b · Create an account (with accounts only) */}
          {step === 0 && accountStep && (
            <div className="flex flex-1 flex-col pb-6">
              <header className="safe-top flex h-16 shrink-0 items-center">
                <button onClick={() => setAccountStep(false)} aria-label="Back" className="pressable -ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-2 hover:text-ink"><ArrowLeft size={19} /></button>
              </header>
              <div className="flex flex-1 flex-col justify-center">
                <h1 className="display rush self-start text-[42px] leading-[1.04]">Sign in to start.</h1>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-2">So your results are saved, and still here the next time you open Aura.</p>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-2">Next come a few questions about what you can do today. It takes two minutes, and you get your first Aura score.</p>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <GoogleButton />
                <Notice />
                <p className="text-center text-[12px] leading-relaxed text-ink-3">
                  By continuing you agree to the{' '}
                  <a className="underline decoration-line-strong underline-offset-4 hover:text-ink" href={`${import.meta.env.BASE_URL}terms.html`}>Terms</a> and the{' '}
                  <a className="underline decoration-line-strong underline-offset-4 hover:text-ink" href={`${import.meta.env.BASE_URL}privacy.html`}>Privacy policy</a>.
                </p>
              </div>
            </div>
          )}

          {/* 0 · Welcome: one still screen */}
          {welcome && igniting && <span className="aura-ignite-flash" aria-hidden />}
          {welcome && (
            <div className="safe-top safe-bottom flex min-h-0 flex-1 flex-col items-center text-center">
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
                <AuraField mix={EVEN} aura={7200} size={Math.round(Math.min(300, Math.max(132, tall * 0.33)))} ignite={igniting}>
                  <Wordmark size={tall < 620 ? 40 : 54} />
                </AuraField>
                <h1 className={cx('display mt-[2.5dvh] text-[clamp(31px,5.6dvh,52px)] leading-[1.02] transition-opacity delay-[1700ms] duration-500', igniting && 'opacity-0')}>Discover the limitless potential <span className="italic">of your body.</span></h1>
                <p className={cx('mt-[2dvh] max-w-sm text-[15.5px] leading-relaxed text-ink-2 transition-opacity delay-[1700ms] duration-500', igniting && 'opacity-0')}>
                  Aura shows you exactly where you are today, and every step to where you’ve always dreamed of going.
                </p>
              </div>
              <div className={cx('flex w-full max-w-sm shrink-0 flex-col gap-2.5 pt-[2.5dvh] transition-opacity duration-500', igniting && 'pointer-events-none opacity-0')}>
                {configured
                  ? <button className="btn btn-primary btn-lg w-3/4 self-center" data-get-started onClick={() => ignite(() => setAccountStep(true))}>Get started <ArrowRight size={17} /></button>
                  : <button className="btn btn-primary btn-lg w-3/4 self-center" data-get-started onClick={() => ignite(() => setStep(1))}>Begin <ArrowRight size={17} /></button>}
                {/* Only on a developer's machine (npm run dev): a public build never has this. */}
                {configured && import.meta.env.DEV && (
                  <button className="btn btn-quiet btn-sm self-center" data-local-start onClick={() => ignite(() => setStep(1))}>Without signing in · this computer only</button>
                )}
                {configured && (
                  <p className="mt-1 text-[13.5px] text-ink-2">
                    Already have an account?{' '}
                    <button className="font-medium text-ink underline decoration-line-strong underline-offset-4" onClick={() => void signInWithGoogle()}>Sign in</button>
                  </p>
                )}
                <Notice />
              </div>
              <p className="shrink-0 pt-[2dvh] pb-4 text-[12px] text-ink-3">
                <a className="underline decoration-line-strong underline-offset-4 hover:text-ink" href={`${import.meta.env.BASE_URL}privacy.html`}>Privacy</a>
                {' · '}
                <a className="underline decoration-line-strong underline-offset-4 hover:text-ink" href={`${import.meta.env.BASE_URL}terms.html`}>Terms</a>
              </p>
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
                  <input className="field pl-8" placeholder="handle" value={chosen} onChange={(e) => { setHandle(e.target.value.replace(/[^\w.]/g, '').toLowerCase()); setHandleNote(null) }} />
                </div>
                {handleNote && <p className="mt-2 text-[12.5px] text-warn">{handleNote}</p>}
              </label>
              <div className="card mt-5 flex items-center justify-between gap-4 p-4">
                <span className="text-[14.5px] font-medium">I also coach<span className="mt-0.5 block text-[12.5px] font-normal text-ink-3">{account ? 'Asks for coach access: Coach Studio, for building courses and running assessments, opens once it is approved.' : 'Adds Coach Studio for building courses and reviewing students.'}</span></span>
                <Toggle on={coach} onChange={setCoach} label="I also coach" />
              </div>
            </Step>
          )}

          {/* 2 · Experience */}
          {step === 2 && (
            <Step eyebrow="Experience" title="Where are you starting from?">
              <div className="space-y-2.5">
                {EXPERIENCE.map((e) => (
                  <button key={e.level} data-level={e.level} aria-pressed={level === e.level} onClick={() => setLevel(e.level)} className={cx('pressable flex h-[60px] w-full items-center gap-4 rounded-card border px-4 text-left', level === e.level ? 'border-ink bg-surface' : 'border-line')}>
                    <span className={cx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', level === e.level ? 'border-ink bg-ink text-bg' : 'border-line-strong')}>{level === e.level && <Check size={13} strokeWidth={3} />}</span>
                    <span className="text-[17.5px] font-medium">{e.title}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Eyebrow>Sessions per week</Eyebrow>
                <Stepper value={weekly} onChange={setWeekly} min={1} max={7} />
              </div>
              <Eyebrow className="mt-6 mb-3">Equipment you can use</Eyebrow>
              <div className="flex flex-wrap gap-2.5">
                {(Object.keys(EQUIPMENT) as EquipmentId[]).map((id) => (
                  <button key={id} className="chip chip-lg" data-on={equipment.includes(id)} onClick={() => setEquipment(equipment.includes(id) ? equipment.filter((x) => x !== id) : [...equipment, id])}>{EQUIPMENT[id]}</button>
                ))}
              </div>
            </Step>
          )}

          {/* 3 · Goals */}
          {step === 3 && (
            <Step eyebrow="Goals" title="What do you want to be able to do?" sub="Pick up to three.">
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((g) => {
                  const s = skillById[g]
                  const on = goals.includes(g)
                  return (
                    <button
                      key={g}
                      disabled={!on && goals.length >= 3}
                      onClick={() => setGoals(on ? goals.filter((x) => x !== g) : [...goals, g])}
                      data-goal={g} aria-pressed={on}
                      className={cx('pressable flex min-h-[128px] flex-col justify-between rounded-[22px] border p-4 text-left disabled:opacity-40', on ? 'border-transparent' : 'border-line-strong bg-surface')}
                      style={on ? { background: `color-mix(in oklab, ${dvar(s.discipline)} 18%, var(--surface))`, boxShadow: `inset 0 0 0 1.5px ${dvar(s.discipline)}` } : undefined}
                    >
                      <span className="flex items-center justify-between text-[13px] text-ink-2">
                        <span className="flex items-center gap-2"><DisciplineDot id={s.discipline} size={8} />{disciplineById[s.discipline].short}</span>
                        {on && <Check size={18} strokeWidth={2.6} style={{ color: dvar(s.discipline) }} />}
                      </span>
                      <span className="display mt-3 text-[25px] leading-[1.04]">{s.name}</span>
                    </button>
                  )
                })}
              </div>
            </Step>
          )}

          {/* 4 · Assessment */}
          {step === 4 && (
            <Step eyebrow="Starting point" title="What can you do today?" sub="A quick estimate. Skip anything you have not tried.">
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

          {/* 5 · The starting line: the Aura, the six scores one at a time, and on to the profile */}
          {step === 5 && (
            <div className="flex flex-1 flex-col items-center pb-6 text-center" data-starting-line>
              <AuraField mix={preview.aura.aura ? preview.aura.mix : EVEN} aura={preview.aura.aura} size={Math.round(Math.min(236, Math.max(150, tall * 0.26)))} progress={preview.aura.cls.progress} className="-mt-3">
                <Eyebrow>Starting Aura</Eyebrow>
                <div className={cx('display mt-1 leading-none', tall < 700 ? 'text-[46px]' : 'text-[60px]')}>{preview.aura.aura ? <CountUp value={preview.aura.aura} duration={1800} /> : '—'}</div>
                <div className="mt-1.5"><StatusTag status={preview.aura.aura ? 'estimated' : 'unrated'} /></div>
              </AuraField>
              <h1 className="display -mt-1 text-[32px] leading-[1.05]">{firstName}, this is your starting line.</h1>
              <p className="mt-2.5 max-w-sm text-[15px] leading-snug text-ink-2">
                {preview.aura.aura ? 'Here is your estimate. Every real set you record replaces it.' : 'Nothing to estimate yet. Your first recorded set starts it.'}
              </p>

              <ScoreDeck ratings={preview.ratings} roomy={tall >= 780} className={tall < 700 ? 'mt-4' : 'mt-6'} />

              <div className="mt-auto w-full pt-6">
                <button className="btn btn-primary btn-lg w-full" onClick={finish}>Go to profile <ArrowRight size={17} /></button>
                {account && !account.guest && coach && <p className="mt-3 text-[12.5px] text-ink-3">Coach access is requested. Follow it under Profile → Settings.</p>}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && step < last && (
        <footer className="safe-bottom sticky bottom-0 z-10 shrink-0 bg-gradient-to-t from-bg via-bg to-transparent pt-6 pb-5">
          <button className="btn btn-primary btn-lg w-full" disabled={!canContinue} onClick={() => void next()}>
            {step === 4 ? 'See my starting line' : 'Continue'} <ArrowRight size={17} />
          </button>
          {step === 3 && goals.length === 0 && <p className="mt-2 text-center text-[12px] text-ink-3">You can skip this and choose goals later.</p>}
        </footer>
      )}
    </div>
  )
}

function Step({ eyebrow, title, sub, children }: { eyebrow: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 pt-2 pb-2">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="display mt-2 text-[36px] leading-[1.04]">{title}</h1>
      {sub && <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

/** The height there is to work with, kept up to date as a phone's toolbars come and go. */
function useHeight() {
  const [h, setH] = useState(() => window.innerHeight)
  useEffect(() => {
    const on = () => setH(window.innerHeight)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return h
}
