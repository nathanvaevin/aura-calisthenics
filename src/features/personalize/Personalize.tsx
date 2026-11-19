import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Lock, X } from 'lucide-react'
import type { DisciplineId, TrainingEnvironment } from '@/domain/types'
import { DISCIPLINE_IDS, disciplineById } from '@/domain/catalog'
import { ENVIRONMENTS } from '@/domain/places'
import { useIsAdmin, useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { useCloud } from '@/data/cloud'
import { performerOf } from '@/theme/cast'
import { completion, isReleased, personalOf, STEPS, type Step } from '@/theme/personal'
import { THEME_IDS, THEMES, UNIVERSES, posterOf, type ThemeId } from '@/theme/themes'
import { ThemeContext, usePersonalTheme, useVoice, useWearing } from '@/theme/useTheme'
import { say } from '@/theme/voice'
import { SharingRows } from '@/features/places/Identity'
import { DisciplineDot, Eyebrow } from '@/ui/primitives'
import { Stage3D } from '@/ui/Stage3D'
import { cx } from '@/lib/format'
import { CharacterStudio } from './CharacterStudio'
import { TextSize } from './TextSize'

const TITLES: Record<Step, { title: string; sub: string }> = {
  theme: { title: 'Choose your theme', sub: 'Change it any time. Your training and results stay the same.' },
  character: { title: 'Make the character yours', sub: 'This is who performs your exercises and stands on your profile.' },
  about: { title: 'A little about you', sub: 'All of it is optional. Skip it now and fill it in whenever you like.' },
  sharing: { title: 'What you share', sub: 'You decide what other athletes see, part by part. You can change any of it later.' },
}

/**
 * Personalization: a short guided flow. Theme and character are the core;
 * the rest is optional and can be skipped. Every choice is saved as it is
 * made, so leaving half-way loses nothing.
 */
export default function Personalize() {
  const me = useMe()
  const admin = useIsAdmin()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const setStyle = useStore((s) => s.setStyle)
  const released = useStore((s) => s.auraSettings.universes)
  const own = usePersonalTheme()
  const requested = params.get('step')
  const step: Step | 'done' = requested === 'done' ? 'done' : (STEPS as readonly string[]).includes(requested ?? '') ? (requested as Step) : 'theme'
  const at = step === 'done' ? STEPS.length : STEPS.indexOf(step)
  const go = (s: Step | 'done') => { setParams({ step: s }, { replace: true }); window.scrollTo(0, 0) }

  // A theme being looked at is shown everywhere on this screen before it is chosen.
  const [trying, setTrying] = useState<ThemeId>(own)
  const shown = step === 'theme' ? trying : own
  const mine = useRef(own)
  mine.current = own
  useEffect(() => {
    const paint = (theme: ThemeId) => {
      document.documentElement.dataset.theme = theme
      document.documentElement.dataset.scheme = THEMES[theme].scheme
    }
    paint(shown)
    // Leaving without choosing puts the athlete's own theme back.
    return () => paint(mine.current)
  }, [shown])

  const next = () => {
    if (step === 'theme') { setStyle({ theme: trying }, 'theme'); go('character') }
    else if (step === 'character') { setStyle({ character: personalOf(me.athlete).character ?? 'male' }, 'character'); go('about') }
    else if (step === 'about') { setStyle({}, 'about'); go('sharing') }
    else if (step === 'sharing') { setStyle({}, 'sharing'); go('done') }
  }
  const optional = step === 'about' || step === 'sharing'

  return (
    <ThemeContext value={shown}>
      <div className="relative min-h-dvh bg-bg text-ink">
        <div className="page-glow" />
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[1080px] flex-col px-5 lg:px-10">
          <header className="safe-top flex items-center justify-between gap-3 pt-4">
            <button aria-label={at > 0 && step !== 'done' ? 'Back' : 'Close'} onClick={() => (at > 0 && step !== 'done' ? go(STEPS[at - 1]) : navigate('/profile'))} className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2">
              {at > 0 && step !== 'done' ? <ArrowLeft size={17} /> : <X size={17} />}
            </button>
            <div className="flex items-center gap-1.5" aria-label={`Step ${Math.min(at + 1, STEPS.length)} of ${STEPS.length}`}>
              {STEPS.map((s, i) => <span key={s} className={cx('h-1 rounded-full transition-all', i === at ? 'w-8 bg-ink' : i < at ? 'w-4 bg-ink-2' : 'w-4 bg-surface-3')} />)}
            </div>
            {step !== 'done' ? <button className="h-10 px-1 text-[13px] text-ink-3 hover:text-ink" onClick={() => navigate('/profile')}>Later</button> : <span className="w-10" />}
          </header>

          {step !== 'done' && (
            <div className="rise pt-7 pb-5">
              <Eyebrow>Personalize · {at + 1} of {STEPS.length}{optional ? ' · optional' : ''}</Eyebrow>
              <h1 className="display mt-2 text-[38px] leading-[1.02] sm:text-[48px]">{TITLES[step].title}</h1>
              <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{TITLES[step].sub}</p>
            </div>
          )}

          <main className="flex-1 pb-32">
            {step === 'theme' && (
              <>
                <ThemeStep value={trying} onChange={setTrying} released={released} admin={admin} character={personalOf(me.athlete).character ?? 'male'} />
                <section className="mt-8 max-w-md" data-text-size>
                  <Eyebrow className="mb-2.5">Text size</Eyebrow>
                  <TextSize />
                </section>
              </>
            )}
            {step === 'character' && <CharacterStudio />}
            {step === 'about' && <AboutStep />}
            {step === 'sharing' && <SharingStep />}
            {step === 'done' && <Done onClose={() => navigate('/profile')} onStudio={() => navigate('/character')} />}
          </main>

          {step !== 'done' && (
            <div className="glass safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line">
              <div className="mx-auto flex w-full max-w-[1080px] items-center gap-3 px-5 py-3.5 lg:px-10">
                {optional && <button className="btn btn-quiet" onClick={() => go(step === 'about' ? 'sharing' : 'done')}>Skip</button>}
                <button className="btn btn-primary flex-1" disabled={step === 'theme' && !isReleased(trying, released, admin)} onClick={next}>
                  {step === 'theme' ? `Enter ${THEMES[trying].name}` : step === 'sharing' ? 'Finish' : 'Continue'} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeContext>
  )
}

// ── Step one: the four themes ────────────────────────────────────────────

function ThemeStep({ value, onChange, released, admin, character }: { value: ThemeId; onChange: (t: ThemeId) => void; released: Parameters<typeof isReleased>[1]; admin: boolean; character: 'male' | 'female' }) {
  return (
    <div className="grid gap-3.5 sm:grid-cols-2">
      {THEME_IDS.map((id, i) => {
        const t = THEMES[id]
        const u = UNIVERSES[t.universe]
        const open = isReleased(id, released, admin)
        const on = value === id
        return (
          <button
            key={id} data-theme={id} data-scheme={t.scheme} aria-pressed={on} disabled={!open} onClick={() => onChange(id)}
            className={cx('rise group relative isolate flex items-center gap-4 overflow-hidden rounded-card border bg-bg p-3 pr-4 text-left text-ink transition-[box-shadow,transform] duration-300', on ? 'border-transparent shadow-[0_0_0_2px_var(--accent),0_24px_60px_-28px_var(--accent)]' : 'border-line-strong', !open && 'opacity-60')}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <span className="page-glow !absolute" />
            {/* One row, read left to right: the character in this theme's light, then its name, its line and its Auras, then whether it is the one chosen. */}
            <span className="relative z-10 h-[116px] w-[92px] shrink-0 overflow-hidden rounded-[calc(var(--r-card)*0.6)] bg-(--stage) sm:w-[104px]">
              {open
                ? <img src={`${import.meta.env.BASE_URL}${posterOf(id, character)}`} alt="" loading="lazy" className="h-full w-full scale-[1.4] object-cover object-[50%_45%]" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
                : <span className="flex h-full flex-col items-center justify-center gap-1.5 px-2 text-center text-[10.5px] leading-tight text-ink-3"><Lock size={14} />In preparation</span>}
            </span>
            <span className="relative z-10 min-w-0 flex-1">
              <span className="display block text-[28px] leading-none sm:text-[30px]">{t.name}</span>
              <span className="mt-2 block text-[13.5px] leading-snug text-ink-2">{t.line}</span>
              {/* Its Auras (or forms, or states), each in its own colour, and how many there are. */}
              <span className="mt-3 flex items-center gap-2.5" data-forms>
                <span className="flex gap-1.5">{u.list.map((f) => <span key={f.id} title={f.name} className="h-2.5 w-2.5 rounded-full" style={{ background: f.colour, boxShadow: `0 0 7px ${f.colour}` }} />)}</span>
                <span className="text-[12px] text-ink-3">{u.list.length} {u.forms === 'Aura' ? 'Auras' : `${u.forms.toLowerCase()}s`}</span>
              </span>
            </span>
            <span className={cx('relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full', on ? 'bg-accent text-accent-ink' : 'border border-line-strong')}>{on && <Check size={14} strokeWidth={3} />}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Step three: about you ────────────────────────────────────────────────

function AboutStep() {
  const me = useMe()
  const updateMe = useStore((s) => s.updateMe)
  const places = useStore((s) => s.places)
  const navigate = useNavigate()
  const account = useCloud((s) => (s.auth === 'in' ? s.user : null))
  const a = me.athlete
  const envs = a.environments ?? []
  const interests = a.interests ?? []
  const flipEnv = (e: TrainingEnvironment) => updateMe({ environments: envs.includes(e) ? envs.filter((x) => x !== e) : [...envs, e] })
  const flipInterest = (d: DisciplineId) => updateMe({ interests: interests.includes(d) ? interests.filter((x) => x !== d) : [...interests, d] })
  const home = a.homePlaceId ? places[a.homePlaceId] : undefined

  return (
    <div className="grid gap-x-10 gap-y-6 lg:grid-cols-2">
      <div className="space-y-4">
        <label className="block"><Eyebrow className="mb-2">Name shown on your profile</Eyebrow><input className="field" value={a.name} onChange={(e) => updateMe({ name: e.target.value })} /></label>
        <label className="block"><Eyebrow className="mb-2">Originally from</Eyebrow><input className="field" value={a.from ?? ''} placeholder="A country, a region, a town" onChange={(e) => updateMe({ from: e.target.value || undefined })} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><Eyebrow className="mb-2">Country you live in</Eyebrow><input className="field" value={a.country ?? ''} placeholder="Country" onChange={(e) => updateMe({ country: e.target.value || undefined })} /></label>
          <label className="block"><Eyebrow className="mb-2">City or area</Eyebrow><input className="field" value={a.city ?? ''} placeholder="City" onChange={(e) => updateMe({ city: e.target.value || undefined })} /></label>
        </div>
        <label className="block"><Eyebrow className="mb-2">About you</Eyebrow><textarea className="field" rows={3} value={a.bio} placeholder="A line or two: how you train, what you are working toward" onChange={(e) => updateMe({ bio: e.target.value })} /></label>
      </div>

      <div className="space-y-5">
        <div>
          <Eyebrow className="mb-2.5">Favourite disciplines</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {DISCIPLINE_IDS.map((d) => (
              <button key={d} className="chip" data-on={interests.includes(d)} onClick={() => flipInterest(d)}>
                <DisciplineDot id={d} size={7} />{disciplineById[d].short}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] leading-snug text-ink-3">What you enjoy most. It never changes a rating.</p>
        </div>
        <div>
          <Eyebrow className="mb-2.5">Where you like to train</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ENVIRONMENTS) as TrainingEnvironment[]).map((e) => <button key={e} className="chip" data-on={envs.includes(e)} onClick={() => flipEnv(e)}>{ENVIRONMENTS[e]}</button>)}
          </div>
        </div>
        <button onClick={() => navigate('/places')} className="card pressable flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
          <span className="min-w-0 text-[14px]">Favourite place to train<span className="block truncate text-[12px] text-ink-3">{home ? home.name : 'Choose your home spot on the Places map'}</span></span>
          <span className="shrink-0 text-[12.5px] text-ink-3">{home ? 'Change' : 'Open map'}</span>
        </button>
        <div className="rounded-card border border-dashed border-line-strong px-4 py-3.5 text-[12.5px] leading-relaxed text-ink-3">
          <span className="font-medium text-ink-2">Contact details.</span>{' '}
          {account && !account.guest
            ? <>Aura reaches you through the account you signed in with{account.email ? <> (<span className="text-ink-2">{account.email}</span>)</> : ''}. It is private: it is never part of your profile and no other athlete can see it.</>
            : 'Nothing more is needed here. If you sign in to keep your profile, that address stays private: it is never part of your profile and no other athlete can see it.'}
        </div>
      </div>
    </div>
  )
}

// ── Step four: sharing ───────────────────────────────────────────────────

function SharingStep() {
  const me = useMe()
  return (
    <div className="grid gap-x-10 gap-y-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <SharingRows athlete={me.athlete} only={['style', 'ratings', 'interests', 'base', 'origin', 'places']} />
      <div className="space-y-3 text-[13px] leading-relaxed text-ink-2">
        <div className="card p-4">
          <Eyebrow className="mb-2">What others can never see</Eyebrow>
          <ul className="space-y-1.5">
            <li>Your email address or anything else from your account.</li>
            <li>Where you are. Aura stores a city you typed and places you chose, never your position.</li>
            <li>Your workouts and notes. Those are yours and your coach’s.</li>
          </ul>
        </div>
        <div className="card p-4">
          <Eyebrow className="mb-2">How the choices work</Eyebrow>
          <p>“People I follow” means athletes you chose to follow, so that list is yours to control. Being at a place right now is decided separately each time you check in, and starts at “only me”.</p>
        </div>
        <p className="px-1 text-[12px] text-ink-3">Everything starts as it was. Your results stay between you and your coach unless you open them here.</p>
      </div>
    </div>
  )
}

// ── Done ─────────────────────────────────────────────────────────────────

function Done({ onClose, onStudio }: { onClose: () => void; onStudio: () => void }) {
  const me = useMe()
  const look = useWearing()
  const v = useVoice()
  const done = completion(me.athlete)
  const rows: [string, boolean, string][] = [
    ['Theme', done.theme, THEMES[look.theme].name],
    ['Character', done.character, `${look.character === 'female' ? 'Female' : 'Male'} · ${look.form.name}`],
    ['About you', done.about, done.about ? 'Added' : 'Skipped for now'],
    ['Sharing', done.sharing, done.sharing ? 'Reviewed' : 'Left as it was'],
  ]
  return (
    <div className="grid items-center gap-8 pt-6 lg:grid-cols-2 lg:pt-10">
      <Stage3D cast={[performerOf(look, { aura: 'full' })]} ratio={0.82} controls="none" activate="large" margin={1.42} className="mx-auto max-h-[52dvh] max-w-[440px]" label="Your character" />
      <div className="rise">
        <Eyebrow>{done.all ? 'Personalization complete' : 'Your identity is set'}</Eyebrow>
        <h1 className="display mt-2 text-[40px] leading-[1.02] sm:text-[52px]">{me.athlete.name.split(' ')[0]}, {done.all ? 'this is you.' : 'this is a start.'}</h1>
        <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-2">{v(done.all ? 'personal.ready' : 'personal.core')}</p>
        <div className="card mt-6 divide-y divide-line">
          {rows.map(([label, ok, value]) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3">
              <span className={cx('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', ok ? 'bg-ink text-bg' : 'border border-line-strong')}>{ok && <Check size={12} strokeWidth={3} />}</span>
              <span className="flex-1 text-[14px]">{label}</span>
              <span className="text-[12.5px] text-ink-3">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <button className="btn btn-primary flex-1" onClick={onClose}>Go to my profile</button>
          <button className="btn btn-outline" onClick={onStudio}>Character Studio</button>
        </div>
        <p className="display mt-6 text-[19px] leading-snug text-ink-3">{say(THEMES[look.theme].voice, 'home.line')}</p>
      </div>
    </div>
  )
}
