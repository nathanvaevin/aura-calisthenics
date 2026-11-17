import { useState } from 'react'
import { useNavigate } from 'react-router'
import { House, MapPin, Star } from 'lucide-react'
import type { Athlete, AthletePrivacy, Audience, TrainingEnvironment } from '@/domain/types'
import { AUDIENCES, ENVIRONMENTS, historyAt, identityFor, isLive, liveVisit, privacyOf, visitVisible, type Relation } from '@/domain/places'
import { useStore } from '@/data/store'
import { useClock } from '@/data/hooks'
import { Eyebrow, SectionTitle, Segmented, Sheet, Toggle } from '@/ui/primitives'
import { cx, relativeDay } from '@/lib/format'
import { AudienceTag, timeOf, useViewer } from './shared'

const VIEW_AS: { value: Relation; label: string }[] = [
  { value: 'self', label: 'You' },
  { value: 'followed', label: 'People you follow' },
  { value: 'stranger', label: 'Everyone' },
]

function PlaceLink({ id, icon }: { id: string; icon: React.ReactNode }) {
  const place = useStore((s) => s.places[id])
  const navigate = useNavigate()
  if (!place) return null
  return (
    <button onClick={() => navigate(`/places?place=${encodeURIComponent(id)}`)} className="pressable inline-flex h-9 max-w-full items-center gap-2 rounded-full border border-line px-3 text-[13px] hover:bg-surface-2">
      <span className="shrink-0 text-ink-3">{icon}</span>
      <span className="truncate">{place.name}</span>
    </button>
  )
}

/** The lines of an identity a given viewer is allowed to see. Renders nothing when there is nothing. */
function IdentityLines({ athlete, relation, now, showAudience }: { athlete: Athlete; relation: Relation; now: number; showAudience?: boolean }) {
  const visits = useStore((s) => s.visits)
  const places = useStore((s) => s.places)
  const id = identityFor(athlete, relation)
  const privacy = privacyOf(athlete)
  const mine = visits.filter((v) => v.athleteId === athlete.id && visitVisible(v, athlete, relation, now))
  const live = mine.find((v) => isLive(v, now))
  const regularAt = [...new Set(mine.map((v) => v.placeId))].filter((p) => places[p] && historyAt(mine.filter((v) => v.placeId === p), now).regular)
  const tag = (a: Audience) => (showAudience ? <AudienceTag audience={a} className="ml-auto shrink-0" /> : null)

  const rows: React.ReactNode[] = []
  if (live && places[live.placeId]) {
    rows.push(
      <div key="live" className="flex items-center gap-3 px-4 py-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" /></span>
        <span className="min-w-0 flex-1 text-[14px]"><span className="font-medium">Training now</span> at {places[live.placeId].name} until {timeOf(live.endsAt)}</span>
        {tag(live.audience)}
      </div>,
    )
  }
  if (id.from) rows.push(<div key="from" className="flex items-baseline gap-3 px-4 py-3"><Eyebrow className="w-[74px] shrink-0">From</Eyebrow><span className="min-w-0 flex-1 text-[14px]">{id.from}</span>{tag(privacy.origin)}</div>)
  if (id.city) rows.push(<div key="city" className="flex items-baseline gap-3 px-4 py-3"><Eyebrow className="w-[74px] shrink-0">Based in</Eyebrow><span className="min-w-0 flex-1 text-[14px]">{id.city}</span>{tag(privacy.base)}</div>)
  if (id.environments.length) rows.push(<div key="env" className="flex items-baseline gap-3 px-4 py-3"><Eyebrow className="w-[74px] shrink-0">Trains</Eyebrow><span className="min-w-0 flex-1 text-[14px]">{id.environments.map((e) => ENVIRONMENTS[e]).join(' · ')}</span>{tag(privacy.places)}</div>)
  if (id.homePlaceId && places[id.homePlaceId]) rows.push(<div key="home" className="flex items-center gap-3 px-4 py-2.5"><Eyebrow className="w-[74px] shrink-0">Home spot</Eyebrow><span className="min-w-0 flex-1"><PlaceLink id={id.homePlaceId} icon={<House size={13} />} /></span>{tag(privacy.places)}</div>)
  const favourites = id.favouritePlaces.filter((p) => places[p])
  if (favourites.length) rows.push(<div key="fav" className="flex items-start gap-3 px-4 py-2.5"><Eyebrow className="mt-2.5 w-[74px] shrink-0">Favourites</Eyebrow><span className="flex min-w-0 flex-1 flex-wrap gap-1.5">{favourites.map((p) => <PlaceLink key={p} id={p} icon={<Star size={13} />} />)}</span>{tag(privacy.places)}</div>)
  if (regularAt.length) rows.push(<div key="reg" className="flex items-start gap-3 px-4 py-2.5"><Eyebrow className="mt-2.5 w-[74px] shrink-0">Regular at</Eyebrow><span className="flex min-w-0 flex-1 flex-wrap gap-1.5">{regularAt.map((p) => <PlaceLink key={p} id={p} icon={<MapPin size={13} />} />)}</span>{tag(privacy.visits)}</div>)
  if (id.openToTrain) rows.push(<div key="open" className="px-4 py-3 text-[13.5px] text-good">Open to training together</div>)

  if (!rows.length) return null
  return <div className="card divide-y divide-line">{rows}</div>
}

/** Another athlete's identity, as far as they let this viewer see it. */
export function IdentityOf({ athlete }: { athlete: Athlete }) {
  const viewer = useViewer()
  const now = useClock(30000)
  return <IdentityLines athlete={athlete} relation={viewer.relationTo(athlete)} now={now} />
}

/** The athlete's own identity card, with a preview of what others see. */
export function MyIdentity({ athlete, onEdit }: { athlete: Athlete; onEdit: () => void }) {
  const now = useClock(30000)
  const [as, setAs] = useState<Relation>('self')
  const updateMe = useStore((s) => s.updateMe)
  const id = identityFor(athlete, 'self')
  const nothing = !id.from && !id.city && !id.environments.length && !id.homePlaceId && !id.favouritePlaces.length
  return (
    <section>
      <SectionTitle action={<button onClick={onEdit} className="text-[12.5px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">Edit</button>}>Where you belong</SectionTitle>
      {nothing ? (
        <button onClick={onEdit} className="w-full rounded-[22px] border border-dashed border-line-strong p-5 text-left text-[13.5px] leading-relaxed text-ink-3 hover:bg-surface">
          Add where you are from, where you are based and where you train. All of it is optional, and you decide who sees each part.
        </button>
      ) : (
        <>
          <div className="no-scrollbar -mx-5 mb-2.5 overflow-x-auto px-5 lg:mx-0 lg:px-0">
            <Segmented<Relation> value={as} onChange={setAs} options={VIEW_AS.map((v) => ({ value: v.value, label: v.value === 'self' ? 'You see' : v.label + ' see' }))} />
          </div>
          <IdentityLines athlete={athlete} relation={as} now={now} showAudience={as === 'self'} />
          {as !== 'self' && !identityFor(athlete, as).from && !identityFor(athlete, as).city && !identityFor(athlete, as).homePlaceId && !identityFor(athlete, as).favouritePlaces.length && !identityFor(athlete, as).environments.length && (
            <p className="rounded-[22px] border border-dashed border-line-strong p-4 text-[13px] text-ink-3">Nothing about where you are from or where you train.</p>
          )}
        </>
      )}
      <div className="card mt-2.5 flex items-center justify-between gap-3 px-4 py-3.5">
        <span className="text-[14px]">Open to training together<span className="block text-[12px] leading-snug text-ink-3">Shown beside your name wherever you are visible at a place</span></span>
        <Toggle on={!!athlete.openToTrain} onChange={(openToTrain) => updateMe({ openToTrain })} label="Open to training together" />
      </div>
    </section>
  )
}

const PRIVACY_ROWS: { key: keyof AthletePrivacy; title: string; sub: string }[] = [
  { key: 'origin', title: 'Where you are from', sub: 'The line you wrote yourself' },
  { key: 'base', title: 'Where you are based', sub: 'Your city. Also what the “My city” filter uses' },
  { key: 'places', title: 'Your places', sub: 'Home spot, favourites and where you like to train' },
  { key: 'visits', title: 'Where you have been', sub: 'Recent check-ins and being listed as a regular' },
]

/** Who sees what. One row per kind of information, plus the check-in history itself. */
export function PrivacyCard({ athlete }: { athlete: Athlete }) {
  const setPrivacy = useStore((s) => s.setPrivacy)
  const visits = useStore((s) => s.visits)
  const places = useStore((s) => s.places)
  const clearMyVisits = useStore((s) => s.clearMyVisits)
  const removeVisit = useStore((s) => s.removeVisit)
  const checkOut = useStore((s) => s.checkOut)
  const now = useClock(30000)
  const [historyOpen, setHistoryOpen] = useState(false)
  const privacy = privacyOf(athlete)
  const mine = visits.filter((v) => v.athleteId === athlete.id).sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  const live = liveVisit(visits, athlete.id, now)

  return (
    <section>
      <SectionTitle>Privacy</SectionTitle>
      <div className="card divide-y divide-line">
        {PRIVACY_ROWS.map((row) => (
          <div key={row.key} className="px-4 py-3.5">
            <div className="text-[14px]">{row.title}<span className="block text-[12px] text-ink-3">{row.sub}</span></div>
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              {(Object.keys(AUDIENCES) as Audience[]).map((a) => (
                <button key={a} aria-pressed={privacy[row.key] === a} onClick={() => setPrivacy({ [row.key]: a })} className={cx('pressable h-9 rounded-full border text-[12px]', privacy[row.key] === a ? 'border-ink bg-ink text-bg' : 'border-line text-ink-2 hover:bg-surface-2')}>
                  {AUDIENCES[a].label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left last:rounded-b-[22px] hover:bg-surface-2" onClick={() => setHistoryOpen(true)}>
          <span className="text-[14px]">Check-in history<span className="block text-[12px] text-ink-3">{mine.length ? `${mine.length} on this device${live ? ' · checked in now' : ''}` : 'Nothing recorded'}</span></span>
          <span className="text-[12.5px] text-ink-3">Review</span>
        </button>
      </div>
      <p className="mt-2.5 text-[12px] leading-relaxed text-ink-3">
        “People I follow” means athletes you have chosen to follow, so you control that list. Being at a place right now is decided separately each time you check in, and always ends on its own. Aura never reads your location in the background.
      </p>

      <Sheet open={historyOpen} onClose={() => setHistoryOpen(false)} eyebrow="Only you see this list" title="Check-in history">
        {mine.length === 0 ? (
          <p className="text-[13.5px] text-ink-3">You have not checked in anywhere.</p>
        ) : (
          <>
            <div className="card divide-y divide-line">
              {mine.slice(0, 60).map((v) => (
                <div key={v.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{places[v.placeId]?.name ?? 'A place no longer on this device'}</span>
                    <span className="flex flex-wrap items-center gap-x-2 text-[12px] text-ink-3">
                      {isLive(v, now) ? `Now, until ${timeOf(v.endsAt)}` : `${relativeDay(v.startedAt)} · ${timeOf(v.startedAt)}`} · <AudienceTag audience={v.audience} />
                    </span>
                  </span>
                  <button className="btn btn-quiet btn-sm" onClick={() => (isLive(v, now) ? checkOut() : removeVisit(v.id))}>{isLive(v, now) ? 'Leave' : 'Forget'}</button>
                </div>
              ))}
            </div>
            <button className="btn btn-quiet mt-4 w-full" onClick={() => window.confirm('Forget every check-in on this device? You will no longer be listed as a regular anywhere.') && clearMyVisits()}>Forget all of it</button>
          </>
        )}
      </Sheet>
    </section>
  )
}

/** The identity fields inside the profile editor. */
export function IdentityFields({ athlete }: { athlete: Athlete }) {
  const updateMe = useStore((s) => s.updateMe)
  const envs = athlete.environments ?? []
  const flip = (e: TrainingEnvironment) => updateMe({ environments: envs.includes(e) ? envs.filter((x) => x !== e) : [...envs, e] })
  return (
    <>
      <label className="block">
        <Eyebrow className="mb-2">Originally from · optional</Eyebrow>
        <input className="field" value={athlete.from ?? ''} placeholder="A town, a region, a country" onChange={(e) => updateMe({ from: e.target.value || undefined })} />
      </label>
      <div>
        <Eyebrow className="mb-2.5">Where you like to train · optional</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ENVIRONMENTS) as TrainingEnvironment[]).map((e) => <button key={e} className="chip" data-on={envs.includes(e)} onClick={() => flip(e)}>{ENVIRONMENTS[e]}</button>)}
        </div>
        <p className="mt-2 text-[12px] leading-snug text-ink-3">Your home spot and favourite places are chosen on the Places map. Who sees each of these is set under Privacy on your profile.</p>
      </div>
    </>
  )
}
