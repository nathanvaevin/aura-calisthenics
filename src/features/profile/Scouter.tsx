import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Check, MapPin, UserPlus } from 'lucide-react'
import type { Athlete, DisciplineId } from '@/domain/types'
import { DISCIPLINE_IDS, SKILLS, disciplineById } from '@/domain/catalog'
import { auraFor } from '@/domain/scoring/aura'
import { useAthleteModel, useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { AuraDot, AuraField } from '@/ui/AuraField'
import { CountUp } from '@/ui/CountUp'
import { DnaSigil } from '@/ui/DnaSigil'
import { Bar, DisciplineDot, Empty, Eyebrow, PageHeader, SectionTitle, Segmented, StatusTag, TierTag } from '@/ui/primitives'
import { identityFor } from '@/domain/places'
import { IdentityOf } from '@/features/places/Identity'
import { useViewer } from '@/features/places/shared'
import { canSee, privacyOf } from '@/domain/places'
import { isVerified } from '@/domain/scoring/config'
import { personalOf, wearing } from '@/theme/personal'
import { THEMES } from '@/theme/themes'
import { cx, dvar, initials, num } from '@/lib/format'

type Filter = 'all' | 'following' | 'level' | 'city'

/** Athlete discovery. Only what each athlete chose to share is shown, and location never goes below city. */
export function Athletes() {
  const me = useMe()
  const navigate = useNavigate()
  const athletes = useStore((s) => s.athletes)
  const evidence = useStore((s) => s.evidence)
  const following = useStore((s) => s.following)
  const [filter, setFilter] = useState<Filter>('all')
  const viewer = useViewer()
  // With accounts, an athlete's results are read by them, their coach and whoever they share them with
  // (everyone, unless they closed them). Listing someone whose results cannot be read would show them as unrated, which would be untrue.
  const account = useStore((s) => !!s.cloudUid)
  /** The city an athlete lets this viewer see, if any. */
  const cityOf = (a: Athlete) => identityFor(a, viewer.relationTo(a)).city

  const ranked = useMemo(
    () =>
      Object.values(athletes)
        .map((athlete: Athlete) => ({ athlete, own: evidence.filter((e) => e.athleteId === athlete.id) }))
        .filter(({ athlete, own }) => !account || athlete.id === me.athlete.id || own.length > 0)
        .map(({ athlete, own }) => ({ athlete, aura: auraFor(own) }))
        .sort((a, b) => b.aura.aura - a.aura.aura),
    [athletes, evidence, account, me.athlete.id],
  )
  const shown = ranked.filter(({ athlete, aura }) => {
    if (athlete.id === me.athlete.id) return filter === 'all' || filter === 'level'
    if (filter === 'following') return following.includes(athlete.id)
    if (filter === 'level') return Math.abs(aura.aura - me.aura.aura) <= Math.max(800, me.aura.aura * 0.25)
    if (filter === 'city') return !!me.athlete.city && cityOf(athlete) === me.athlete.city
    return true
  })

  return (
    <div>
      <PageHeader eyebrow="Scouter" title="Athletes" sub="Open any athlete to read their Aura, their shape and what they have actually demonstrated." />
      <div className="no-scrollbar -mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'Everyone' }, { value: 'following', label: 'Following' }, { value: 'level', label: 'Near my level' }, { value: 'city', label: 'My city' }]}
        />
      </div>

      <div className="mt-5 max-w-3xl">
        {shown.length === 0 ? (
          <Empty title={filter === 'city' && !me.athlete.city ? 'Local discovery is off' : 'No athletes here yet'}>
            {filter === 'city' && !me.athlete.city ? 'Add a city to your profile to see athletes who share theirs. Nothing more precise than a city is ever shown.' : 'Try another filter.'}
          </Empty>
        ) : (
          <div className="card divide-y divide-line">
            {shown.map(({ athlete, aura }) => {
              const isMe = athlete.id === me.athlete.id
              return (
                <button
                  key={athlete.id}
                  onClick={() => navigate(isMe ? '/profile' : `/athlete/${athlete.id}`)}
                  className={cx('flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors first:rounded-t-card last:rounded-b-card hover:bg-surface-2', isMe && 'bg-surface-2')}
                >
                  <span className="num w-5 text-center font-mono text-[11px] text-ink-3">{ranked.findIndex((r) => r.athlete.id === athlete.id) + 1}</span>
                  <AuraDot mix={aura.mix} size={44}>{initials(athlete.name)}</AuraDot>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 truncate text-[15px] font-medium">
                      {athlete.name}
                      {isMe && <span className="rounded-full bg-ink px-1.5 py-px font-mono text-[9px] tracking-[0.1em] text-bg uppercase">You</span>}
                      {following.includes(athlete.id) && <Check size={12} className="text-ink-3" />}
                    </span>
                    <span className="block truncate text-[12px] text-ink-3">{aura.title}{cityOf(athlete) ? ` · ${cityOf(athlete)}` : ''}</span>
                  </span>
                  <span className="display num text-[28px]">{num(aura.aura)}</span>
                </button>
              )
            })}
          </div>
        )}
        <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-ink-3">
          <MapPin size={13} className="mt-0.5 shrink-0" />
          {account ? 'You see the athletes whose results are shared with you: yourself and, when you coach, the students in your courses. A wider directory is not built yet.' : 'A city appears only when its athlete shares it with you. The athletes shown here are sample people.'}
        </p>
      </div>
    </div>
  )
}

/** The scouter: one look at another athlete's capability, with how each number is known. */
export function AthleteScan() {
  const { athleteId } = useParams()
  const navigate = useNavigate()
  const me = useMe()
  const them = useAthleteModel(athleteId)
  const isFollowing = useStore((s) => (athleteId ? s.following.includes(athleteId) : false))
  const toggleFollow = useStore((s) => s.toggleFollow)

  if (!them) return <Navigate to="/athletes" replace />
  if (them.athlete.id === me.athlete.id) return <Navigate to="/profile" replace />

  const a = them.aura
  const first = them.athlete.name.split(' ')[0]
  const values = (m: typeof them) => Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, m.ratings[d].rating])) as Record<DisciplineId, number>
  const top = Math.max(600, ...DISCIPLINE_IDS.map((d) => Math.max(them.ratings[d].rating, me.ratings[d].rating)))
  const signature = SKILLS.filter((s) => them.statuses[s.id].state === 'mastered' && !them.statuses[s.id].implied)
    .sort((x, y) => y.rating - x.rating)
    .slice(0, 5)
  const gap = a.aura - me.aura.aura

  return (
    <div>
      <div className="pt-5 lg:pt-9">
        <button onClick={() => navigate(-1)} className="pressable -ml-1 flex h-10 items-center gap-1.5 rounded-full pr-3 pl-1 text-[13.5px] text-ink-2 hover:text-ink">
          <ArrowLeft size={17} /> Back
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
        <section className="flex flex-col items-center lg:sticky lg:top-8">
          <div className="relative">
            <AuraField mix={a.mix} aura={a.aura} size={320} progress={a.cls.progress}>
              <Eyebrow>Aura</Eyebrow>
              <div className="display mt-1 text-[80px] leading-none"><CountUp value={a.aura} duration={1600} /></div>
              <div className="mt-2 text-[14px] text-ink-2">{a.title}</div>
            </AuraField>
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <div className="scan-sweep absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 46%, color-mix(in oklab, var(--text) 55%, transparent) 50%, transparent 54%)' }} />
            </div>
          </div>

          <div className="rise rise-2 mt-1 flex flex-col items-center text-center">
            <h1 className="display text-[36px]">{them.athlete.name}</h1>
            <div className="mt-1 text-[13px] text-ink-3">@{them.athlete.handle}</div>
            {them.athlete.bio && <p className="mt-2.5 max-w-xs text-[14px] leading-relaxed text-ink-2">{them.athlete.bio}</p>}
            <div className="mt-4 flex items-center gap-2.5">
              <button className={cx('btn btn-sm', isFollowing ? 'btn-quiet' : 'btn-primary')} onClick={() => toggleFollow(them.athlete.id)}>
                {isFollowing ? <><Check size={14} /> Following</> : <><UserPlus size={14} /> Follow</>}
              </button>
              <StatusTag status={a.status} />
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-8 lg:mt-6">
          <IdentityOf athlete={them.athlete} />
          <TheirLook model={them} />

          {/* Readout */}
          <section className="rise rise-3">
            <SectionTitle>Mastery readout</SectionTitle>
            <div className="card divide-y divide-line">
              {DISCIPLINE_IDS.map((d) => {
                const r = them.ratings[d]
                const mine = me.ratings[d].rating
                const diff = r.rating - mine
                return (
                  <div key={d} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-[14px] font-medium"><DisciplineDot id={d} />{disciplineById[d].short}</span>
                      <span className="flex items-center gap-2.5">
                        {r.rating > 0 && <StatusTag status={r.status} provisional={r.provisional} />}
                        <span className="display num w-[50px] text-right text-[26px]">{r.rating ? <CountUp value={r.rating} duration={1400} /> : '—'}</span>
                      </span>
                    </div>
                    <div className="relative mt-2">
                      <Bar value={r.rating / top} color={dvar(d)} />
                      {mine > 0 && <span className="absolute top-[-3px] h-[9px] w-[1.5px] rounded-full bg-ink" style={{ left: `${(mine / top) * 100}%` }} />}
                    </div>
                    <div className="num mt-1.5 text-[11.5px] text-ink-3">
                      {mine > 0 ? <>You {mine} · {diff === 0 ? 'level' : diff > 0 ? `${first} +${diff}` : `you +${-diff}`}</> : 'You have no rating here yet'}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-[12px] text-ink-3">The marker on each bar is your own rating.</p>
          </section>

          {/* Shape */}
          <section className="rise rise-4">
            <SectionTitle>Athlete DNA</SectionTitle>
            <div className="card flex flex-col items-center px-2 pt-3 pb-4">
              <DnaSigil ratings={values(them)} ghost={values(me)} size={330} />
              <div className="flex items-center gap-5 text-[12px] text-ink-2">
                <span className="flex items-center gap-2"><span className="h-px w-5 bg-ink" />{first}</span>
                <span className="flex items-center gap-2"><span className="w-5 border-t border-dashed border-ink" />You</span>
              </div>
              <p className="mt-3 max-w-sm px-4 text-center text-[13px] leading-relaxed text-ink-2">
                {Math.abs(gap) < 150 ? `Your Aura is within ${Math.abs(gap)} of ${first}’s, with a different shape.` : gap > 0 ? `${first} is ${num(gap)} Aura ahead of you.` : `You are ${num(-gap)} Aura ahead of ${first}.`}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([
              ['Mastery', a.mastery],
              ['Peak', a.peak?.rating ?? '—'],
              ['Versatility', a.versatility],
              ['Dedication', them.dedication.score],
            ] as const).map(([label, value]) => (
              <div key={label} className="card flex items-baseline justify-between px-3.5 py-3 sm:block">
                <span className="block font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">{label}</span>
                <span className="display num block text-[24px] sm:mt-1">{value}</span>
              </div>
            ))}
          </section>

          {/* Signature skills */}
          {signature.length > 0 && (
            <section>
              <SectionTitle>Signature skills</SectionTitle>
              <div className="card divide-y divide-line">
                {signature.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: dvar(s.discipline), boxShadow: `0 0 12px ${dvar(s.discipline)}` }} />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{s.name}</span>
                    <TierTag tier={them.statuses[s.id].tier!} compact />
                    <span className="num w-9 text-right text-[13px] text-ink-2">{s.rating}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[12px] text-ink-3">{SKILLS.filter((s) => them.statuses[s.id].state === 'mastered').length} of {SKILLS.length} skills mastered. Icons show how each one is known.</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

/** The character and form another athlete chose, when they share it. */
function TheirLook({ model }: { model: NonNullable<ReturnType<typeof useAthleteModel>> }) {
  const viewer = useViewer()
  const released = useStore((s) => s.auraSettings.universes)
  const athlete = model.athlete
  if (!athlete.style?.steps.character || !canSee(privacyOf(athlete).style, viewer.relationTo(athlete))) return null
  const mastered = SKILLS.filter((s) => model.statuses[s.id].state === 'mastered')
  const verified = mastered.filter((s) => !model.statuses[s.id].implied && model.statuses[s.id].tier && isVerified(model.statuses[s.id].tier!)).length
  const look = wearing(personalOf(athlete), { aura: model.aura.aura, skills: mastered.length, verified }, released)
  return (
    <section className="rise rise-2 card flex items-center gap-4 overflow-hidden p-2.5">
      <img src={`${import.meta.env.BASE_URL}themes/${look.universe}-${look.character}.jpg`} alt="" loading="lazy" className="h-[92px] w-[68px] shrink-0 rounded-[calc(var(--r-card)*0.6)] bg-(--stage) object-cover object-top" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
      <span className="min-w-0">
        <Eyebrow>{THEMES[look.theme].name}</Eyebrow>
        <span className="mt-1 flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: look.form.colour, boxShadow: `0 0 12px ${look.form.colour}` }} />
          <span className="display truncate text-[24px] leading-tight">{look.form.name}</span>
        </span>
        <span className="mt-1 block text-[12px] leading-snug text-ink-3">{look.form.line}</span>
      </span>
    </section>
  )
}
