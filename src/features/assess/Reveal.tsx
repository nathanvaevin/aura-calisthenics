import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ArrowRight, Check, Copy, Share2, Target, Users } from 'lucide-react'
import type { DisciplineId } from '@/domain/types'
import { compareProfiles, compareResults, overallProgress, profileOf, resultsToEvidence, modeOf } from '@/domain/assessment'
import { DISCIPLINE_IDS, SKILLS, disciplineById } from '@/domain/catalog'
import { TIER_LABEL } from '@/domain/scoring/config'
import { skillStatuses } from '@/domain/scoring/skills'
import { useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { useLive } from '@/data/cloud'
import { KeepProfile, SyncLine } from '@/features/account/Account'
import { SinceBaseline } from './Progress'
import { AuraField } from '@/ui/AuraField'
import { CountUp } from '@/ui/CountUp'
import { DnaSigil } from '@/ui/DnaSigil'
import { QrCode } from '@/ui/QrCode'
import { DisciplineDot, Eyebrow, TierTag } from '@/ui/primitives'
import { useAssessment } from './Assess'
import { copyText, handInUrl } from './links'
import { cx, dvar, num } from '@/lib/format'

const EVEN = Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, 1 / 6])) as Record<DisciplineId, number>

/** The end of the assessment: what it found, how it is known, and where it leads. */
export function Reveal() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const me = useMe()
  const { session, participants, mine } = useAssessment(sessionId)
  const allParticipants = useStore((s) => s.participants)
  const toggleGoal = useStore((s) => s.toggleGoal)
  const [copied, setCopied] = useState(false)
  const cloud = useStore((s) => !!s.cloudUid)
  // What the coach observes or verifies afterwards shows up here by itself.
  useLive('assess', 10000)

  const view = useMemo(() => {
    if (!session || !mine) return null
    const profile = profileOf(mine.results, session.stations)
    const statuses = skillStatuses(resultsToEvidence(mine.results, 'p', session.id))
    const shown = SKILLS.filter((s) => statuses[s.id].state === 'mastered' && !statuses[s.id].implied).sort((a, b) => b.rating - a.rating)
    const within = SKILLS.filter((s) => statuses[s.id].state === 'mastered').length
    const tiers = { self: 0, observed: 0, coach: 0 }
    for (const r of Object.values(mine.results)) if (!r.skipped) tiers[r.tier]++
    const before = session.baselineId ? allParticipants.find((p) => p.sessionId === session.baselineId && p.athleteId === mine.athleteId) : undefined
    return {
      profile, shown, within, tiers,
      change: before ? compareProfiles(profileOf(before.results, session.stations), profile, session.stations) : null,
      benchmarks: before ? compareResults(before.results, mine.results) : null,
    }
  }, [session, mine, allParticipants])

  if (!session || !mine || !view) return <Navigate to="/train" replace />
  if (!mine.submittedAt) return <Navigate to={`/assess/${session.id}`} replace />

  const { profile, shown, within, tiers, change, benchmarks } = view
  const total = profile.aura > 0 ? Object.values(profile.ratings).reduce((a, b) => a + b, 0) : 0
  const mix = total ? (Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, profile.ratings[d] / total])) as Record<DisciplineId, number>) : EVEN
  const progress = overallProgress(session.stations, mine.results, mine.skipped, modeOf(session))
  const solo = session.origin === 'solo'
  const coach = session.coachName.split(' ')[0]
  // Without accounts, a code carries the results to the coach. With them, they are already there.
  const link = session.origin === 'invite' && !cloud ? handInUrl(mine, session) : null
  const closed = session.origin === 'invite' && session.status === 'finalised'
  const others = participants.length - 1

  // One goal worth chasing in each of: the weakest dimension, the strongest, and anything else close.
  const suggestions = [profile.weakest, profile.strongest, ...session.stations]
    .filter((d): d is DisciplineId => !!d)
    .map((d) => SKILLS.filter((s) => s.discipline === d && me.statuses[s.id]?.state === 'available').sort((a, b) => me.statuses[b.id].progress - me.statuses[a.id].progress || a.rating - b.rating)[0])
    .filter((s, i, list) => s && list.findIndex((x) => x?.id === s.id) === i)
    .slice(0, 3)

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[560px] px-5 pb-16">
      <div className="page-glow" />
      <div className="relative z-10">
        <div className="safe-top flex flex-col items-center pt-6 text-center">
          <Eyebrow className="rise">{session.title} · {solo ? 'on your own' : session.groupName}</Eyebrow>
          <div className="rise rise-1">
            <AuraField mix={mix} aura={profile.aura} size={300}>
              <Eyebrow>Aura</Eyebrow>
              <div className="display mt-1 text-[78px] leading-none">{profile.aura ? <CountUp value={profile.aura} duration={2000} /> : '—'}</div>
              <div className="mt-2 text-[13.5px] text-ink-2">{profile.title}</div>
            </AuraField>
          </div>
          <h1 className="rise rise-2 display mt-1 text-[34px] leading-[1.05]">{change ? 'Here is what changed.' : 'This is where you start.'}</h1>
          <p className="rise rise-2 mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink-2">
            {profile.strongest && profile.weakest ? (
              <>
                Your strongest ground today is <span className="font-medium" style={{ color: dvar(profile.strongest) }}>{disciplineById[profile.strongest].name}</span>. The most room to grow is in{' '}
                <span className="font-medium" style={{ color: dvar(profile.weakest) }}>{disciplineById[profile.weakest].name}</span>.
              </>
            ) : (
              'Finish more stations to see how your strengths compare.'
            )}
          </p>
        </div>

        <div className="rise rise-3 mt-6 grid grid-cols-3 gap-2">
          {session.stations.map((d) => {
            const delta = change?.ratings[d]
            return (
              <div key={d} className="card px-3 py-3">
                <span className="flex items-center gap-1.5 text-[11.5px] text-ink-2"><DisciplineDot id={d} size={6} />{disciplineById[d].short}</span>
                <span className="display num mt-1 block text-[28px]">{profile.ratings[d] || '—'}</span>
                {delta !== undefined && <span className={cx('num block text-[11.5px]', delta > 0 ? 'text-good' : 'text-ink-3')}>{delta > 0 ? `+${delta}` : delta === 0 ? 'no change' : delta} since baseline</span>}
              </div>
            )
          })}
        </div>
        {change && <p className="mt-2 text-center text-[13px] text-ink-2">Aura <span className={cx('num font-medium', change.aura > 0 && 'text-good')}>{change.aura > 0 ? '+' : ''}{num(change.aura)}</span> since your baseline.</p>}

        {cloud && !solo && (
          <p className="mt-3 flex flex-col items-center gap-1 text-center text-[12.5px] text-ink-2">
            <span>{closed ? `${coach} has finalised this assessment. These results are on your profile.` : `${coach} has these results on the session board.`}</span>
            <SyncLine saved="All of it is saved" />
          </p>
        )}
        <KeepProfile className="mt-6" />

        {benchmarks && (
          <section className="rise rise-4 mt-7">
            <Eyebrow className="mb-3">Since your baseline</Eyebrow>
            <SinceBaseline c={benchmarks} still={profile.weakest} />
          </section>
        )}

        <section className="rise rise-4 mt-7">
          <Eyebrow className="mb-3">Your shape</Eyebrow>
          <div className="card flex flex-col items-center px-2 pt-3 pb-4">
            <DnaSigil ratings={profile.ratings} size={320} axes={session.stations} />
            <p className="max-w-sm px-4 text-center text-[13px] leading-relaxed text-ink-2">No two athletes draw the same shape. This one will change as you train; every re-test redraws it.</p>
          </div>
        </section>

        <section className="mt-7">
          <Eyebrow className="mb-3">What you showed today</Eyebrow>
          <div className="card p-4">
            <div><span className="display num text-[40px] leading-none">{within}</span><span className="ml-2 text-[13px] text-ink-3">skills already within your ability</span></div>
            {shown.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {shown.slice(0, 6).map((s) => (
                  <span key={s.id} className="rounded-full px-2.5 py-1 text-[12.5px] font-medium" style={{ background: `color-mix(in oklab, ${dvar(s.discipline)} 16%, transparent)`, color: dvar(s.discipline) }}>{s.name}</span>
                ))}
              </div>
            )}
            <button className="mt-3.5 inline-flex items-center gap-1 text-[12.5px] font-medium underline decoration-line-strong underline-offset-4" onClick={() => navigate('/tree')}>See them lit in your skill tree <ArrowRight size={12} /></button>
          </div>
        </section>

        <section className="mt-7">
          <Eyebrow className="mb-3">How this is known</Eyebrow>
          <div className="card divide-y divide-line">
            {(['self', 'observed', 'coach'] as const).map((t) => (
              <div key={t} className="flex items-center justify-between px-4 py-3">
                <span className="flex items-center gap-2.5 text-[14px]"><TierTag tier={t} compact />{TIER_LABEL[t]}</span>
                <span className="num text-[14px] font-medium">{tiers[t]}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-3">
            {solo
              ? 'You recorded these yourself, so they are shown as self-reported everywhere. A coach can observe or verify them later.'
              : `Results you recorded are self-reported. ${coach} can mark what they watched as observed, and verify what met the written standard. The three are never mixed up.`}
            {!progress.complete && !closed && ' Stations you have not done yet can still be added from the overview.'}
          </p>
        </section>

        {suggestions.length > 0 && (
          <section className="mt-7">
            <Eyebrow className="mb-3">Pick what you want next</Eyebrow>
            <div className="space-y-2">
              {suggestions.map((s) => {
                const on = me.athlete.goals.includes(s.id)
                return (
                  <button key={s.id} onClick={() => toggleGoal(s.id)} className={cx('pressable flex w-full items-center gap-3 rounded-[20px] border p-3.5 text-left', on ? 'border-ink bg-surface' : 'border-line')}>
                    <span className={cx('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', on && 'text-bg')} style={{ background: on ? dvar(s.discipline) : `color-mix(in oklab, ${dvar(s.discipline)} 16%, transparent)`, color: on ? undefined : dvar(s.discipline) }}>
                      {on ? <Check size={16} strokeWidth={2.8} /> : <Target size={15} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-medium">{s.name}</span>
                      <span className="block text-[12px] text-ink-3">{s.discipline === profile.weakest ? 'Opens up your biggest opportunity' : s.discipline === profile.strongest ? 'Builds on your strongest ground' : 'Within reach now'} · {disciplineById[s.discipline].short}</span>
                    </span>
                    <span className="text-[12px] text-ink-3">{on ? 'Goal set' : 'Set as goal'}</span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {link && (
          <section className="mt-7">
            <Eyebrow className="mb-3">Hand in to {coach}</Eyebrow>
            <div className="card flex flex-col items-center p-5 text-center">
              <QrCode value={link} size={236} />
              <p className="mt-4 text-[14px] leading-relaxed text-ink-2">Show this to {coach}. Scanning it with their phone camera adds your results to the session.</p>
              <div className="mt-4 flex w-full gap-2.5">
                {'share' in navigator && <button className="btn btn-quiet flex-1" onClick={() => void navigator.share({ title: `${mine.name} · ${session.title}`, url: link }).catch(() => undefined)}><Share2 size={15} /> Send link</button>}
                <button className="btn btn-quiet flex-1" onClick={async () => { setCopied(await copyText(link)); window.setTimeout(() => setCopied(false), 1800) }}>{copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy link</>}</button>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-3">Aura does not sync between phones yet, so this hand-in is how your results reach your coach. If you add more stations later, hand in again.</p>
            </div>
          </section>
        )}

        {!solo && (
          <button className="card mt-7 flex w-full items-center gap-3.5 p-4 text-left hover:bg-surface-2" onClick={() => navigate(`/assess/${session.id}/group`)}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2"><Users size={18} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium">Meet your group</span>
              <span className="block text-[12.5px] text-ink-3">{session.origin === 'invite' ? `Shown on ${coach}’s screen for now` : `${others} ${others === 1 ? 'other' : 'others'} in ${session.groupName}`}</span>
            </span>
            <ArrowRight size={16} className="text-ink-3" />
          </button>
        )}

        <div className="mt-7 space-y-2.5">
          <button className="btn btn-primary btn-lg w-full" onClick={() => navigate('/profile')}>Go to my profile</button>
          {!progress.complete && !closed && <button className="btn btn-outline w-full" onClick={() => navigate(`/assess/${session.id}`)}>Back to the remaining stations</button>}
        </div>
      </div>
    </div>
  )
}
