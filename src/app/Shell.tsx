import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { BookOpen, ClipboardCheck, Clapperboard, House, MapPin, Play, ScanLine, User, Waypoints, X, Zap } from 'lucide-react'
import { useStore } from '@/data/store'
import { useClock, useIsAdmin, useIsCoach, useMe } from '@/data/hooks'
import { liveVisit } from '@/domain/places'
import { exerciseById } from '@/domain/catalog'
import { useVoice } from '@/theme/useTheme'
import { Tour } from '@/features/journey/Tour'
import { AuraDot } from '@/ui/AuraField'
import { Sheet } from '@/ui/primitives'
import { cx, initials, num } from '@/lib/format'

const TABS = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/tree', label: 'Skills', icon: Waypoints },
  { to: '/train', label: 'Train', icon: Zap },
  { to: '/places', label: 'Places', icon: MapPin },
  { to: '/library', label: 'Library', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: User },
]

export function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <span className="wordmark inline-flex items-baseline leading-none" style={{ fontSize: size }}>
      Aura
      <span className="ml-[3px] inline-block rounded-full" style={{ width: size * 0.19, height: size * 0.19, background: 'var(--dot)' }} />
    </span>
  )
}

/**
 * A workout that is still running, one tap from going back to it. It can be
 * closed, which ends the workout: that is asked first, in the theme's own
 * voice, with what would be lost said plainly.
 */
function ResumeBar() {
  const active = useStore((s) => s.active)
  const discard = useStore((s) => s.discardWorkout)
  const toSummary = useStore((s) => s.toSummary)
  const navigate = useNavigate()
  const v = useVoice()
  const [asking, setAsking] = useState(false)
  if (!active) return null
  const entry = active.log.entries[active.index]
  const done = active.log.entries.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)
  const total = active.log.entries.reduce((n, e) => n + e.sets.length, 0)
  return (
    <>
      <div className="glass relative flex w-full items-center rounded-full border border-line-strong py-2 pr-2 pl-4 shadow-(--shadow-pop)" data-resume>
        <button onClick={() => navigate('/workout')} className="pressable flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-medium">{active.log.title}</span>
            <span className="block truncate text-[11.5px] text-ink-3">
              {active.phase === 'summary' ? 'Ready to save' : entry.title ?? exerciseById[entry.exerciseId]?.name} · {done}/{total} sets
            </span>
          </span>
          <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[13px] font-semibold text-bg">
            <Play size={12} fill="currentColor" /> Resume
          </span>
        </button>
        {/* A small cross on the bar's edge. The part you can touch is larger than the part you can see. */}
        <button onClick={() => setAsking(true)} aria-label="End this workout" title="End this workout" className="group absolute -top-3 -right-2 flex h-10 w-10 items-center justify-center">
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-line-strong bg-surface-2 text-ink-2 shadow-(--shadow-pop) transition-colors group-hover:bg-ink group-hover:text-bg group-active:scale-95">
            <X size={12} strokeWidth={2.6} />
          </span>
        </button>
      </div>

      <Sheet open={asking} onClose={() => setAsking(false)} eyebrow={active.log.title} title={v('workout.quit.title')}>
        <p className="display text-[19px] leading-snug text-ink-2">{v('workout.quit.line')}</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">
          {done > 0
            ? <><span className="num font-medium text-ink">{done} of {total}</span> sets done. Ending now saves none of them.</>
            : 'Nothing has been logged in this session yet, so nothing is lost.'}
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <button className="btn btn-primary btn-lg" onClick={() => { setAsking(false); navigate('/workout') }}>{v('workout.quit.stay')}</button>
          {done > 0 && active.phase !== 'summary' && (
            <button className="btn btn-outline" onClick={() => { setAsking(false); toSummary(); navigate('/workout') }}>Finish here and save the {done} {done === 1 ? 'set' : 'sets'}</button>
          )}
          <button className="btn btn-quiet text-warn" onClick={() => { setAsking(false); discard() }}>{v('workout.quit.leave')}</button>
        </div>
      </Sheet>
    </>
  )
}

/** A check-in is always in sight while it runs, with its end time, and one tap from ending it. */
function PresenceBar() {
  const meId = useStore((s) => s.meId)
  const visits = useStore((s) => s.visits)
  const places = useStore((s) => s.places)
  const checkOut = useStore((s) => s.checkOut)
  const navigate = useNavigate()
  const now = useClock()
  const live = meId ? liveVisit(visits, meId, now) : undefined
  const place = live && places[live.placeId]
  if (!live || !place) return null
  const until = new Date(live.endsAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  return (
    <div className="glass flex w-full items-center gap-2 rounded-full border border-line-strong py-1.5 pr-1.5 pl-4 shadow-(--shadow-pop)">
      <button onClick={() => navigate(`/places?place=${encodeURIComponent(place.id)}`)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <MapPin size={14} className="shrink-0 text-accent" />
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-medium">At {place.name}</span>
          <span className="block truncate text-[11px] text-ink-3">Until {until} · {live.audience === 'me' ? 'only you can see' : live.audience === 'following' ? 'people you follow can see' : 'everyone can see'}</span>
        </span>
      </button>
      <button onClick={checkOut} className="flex h-8 shrink-0 items-center rounded-full bg-surface-3 px-3 text-[12px] font-medium">Leave</button>
    </div>
  )
}

export function Shell() {
  const me = useMe()
  const coach = useIsCoach()
  const admin = useIsAdmin()
  const navigate = useNavigate()

  return (
    <div className="relative min-h-dvh">
      <div className="page-glow" />

      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col border-r border-line bg-bg/60 px-5 py-7 backdrop-blur-xl lg:flex">
        <button onClick={() => navigate('/')} className="mb-9 self-start px-2">
          <Wordmark />
        </button>
        <nav className="flex flex-col gap-1">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end} data-tour={`nav-${to.slice(1) || 'home'}`}
              className={({ isActive }) =>
                cx('flex h-11 items-center gap-3 rounded-xl px-3 text-[14.5px] transition-colors', isActive ? 'bg-surface-2 font-medium text-accent' : 'text-ink-2 hover:bg-surface hover:text-ink')
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
          <div className="my-3 h-px bg-line" />
          <NavLink
            to="/athletes"
            className={({ isActive }) => cx('flex h-11 items-center gap-3 rounded-xl px-3 text-[14.5px] transition-colors', isActive ? 'bg-surface-2 font-medium text-accent' : 'text-ink-2 hover:bg-surface hover:text-ink')}
          >
            <ScanLine size={18} strokeWidth={1.8} />
            Athletes
          </NavLink>
          {coach && (
            <NavLink
              to="/coach"
              className={({ isActive }) => cx('flex h-11 items-center gap-3 rounded-xl px-3 text-[14.5px] transition-colors', isActive ? 'bg-surface-2 font-medium text-accent' : 'text-ink-2 hover:bg-surface hover:text-ink')}
            >
              <ClipboardCheck size={18} strokeWidth={1.8} />
              Coach Studio
            </NavLink>
          )}
          {admin && (
            <NavLink
              to="/studio"
              className={({ isActive }) => cx('flex h-11 items-center gap-3 rounded-xl px-3 text-[14.5px] transition-colors', isActive ? 'bg-surface-2 font-medium text-accent' : 'text-ink-2 hover:bg-surface hover:text-ink')}
            >
              <Clapperboard size={18} strokeWidth={1.8} />
              Studio
            </NavLink>
          )}
        </nav>
        <div className="mt-auto space-y-3">
          <PresenceBar />
          <ResumeBar />
          <button onClick={() => navigate('/profile')} className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 text-left hover:bg-surface-2">
            <AuraDot mix={me.aura.mix} size={38}>{initials(me.athlete.name)}</AuraDot>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-medium">{me.athlete.name}</span>
              <span className="num block text-[11.5px] text-ink-3">Aura {num(me.aura.aura)}</span>
            </span>
          </button>
        </div>
      </aside>

      <main className="relative z-10 mx-auto w-full max-w-[560px] px-5 pb-36 lg:mr-0 lg:ml-[232px] lg:w-[calc(100%-232px)] lg:max-w-none lg:px-12 lg:pb-16">
        <div className="mx-auto w-full lg:max-w-[1080px]">
          <Outlet />
        </div>
      </main>

      {/* Mobile tab bar */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="mx-auto max-w-[560px] px-4 pb-2">
          <div className="mb-2 space-y-2">
            <PresenceBar />
            <ResumeBar />
          </div>
        </div>
        <nav className="glass border-t border-line">
          <div className="mx-auto flex max-w-[560px] items-stretch justify-between px-2">
            {TABS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to} to={to} end={end} data-tour={`nav-${to.slice(1) || 'home'}`}
                className={({ isActive }) => cx('group flex h-[58px] flex-1 flex-col items-center justify-center gap-1 transition-colors', isActive ? 'text-accent' : 'text-ink-3')}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={21} strokeWidth={isActive ? 2.1 : 1.7} />
                    <span className="text-[10.5px] font-medium tracking-wide">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      <Tour />
    </div>
  )
}
