import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { BadgeCheck, Check, Copy, ExternalLink, House, LocateFixed, MapPin, Navigation, Pencil, Share2, Star, Trash2 } from 'lucide-react'
import type { Audience, DisciplineId, Place, PlaceAmenity, PlaceEquipment, PlaceKind } from '@/domain/types'
import { DISCIPLINE_IDS, EXERCISES, disciplineById } from '@/domain/catalog'
import {
  AUDIENCES, PLACE_AMENITIES, PLACE_EQUIPMENT, PLACE_KINDS, PLACE_ROLES, PRESENCE, distance, doableWith, encodeSpot, formatDistance, gearAt, liveVisit,
  peopleAt, placeTrust, roleOf, type PersonAtPlace, type PlaceRole,
} from '@/domain/places'
import { useStore } from '@/data/store'
import { useMe } from '@/data/hooks'
import { AuraDot } from '@/ui/AuraField'
import { QrCode } from '@/ui/QrCode'
import { Bar, Eyebrow, SectionTitle, Sheet } from '@/ui/primitives'
import { copyText, spotUrl } from '@/features/assess/links'
import { cx, dvar, initials, num, relativeDay } from '@/lib/format'
import { ERROR_COPY, PlacesError, directionsUrl, fix, locate, osmUrl } from './osm'
import { AudiencePicker, AudienceTag, compatibilityLine, minutesLeft, placeSub, timeOf, useAuras, useViewer } from './shared'

type Mode = 'view' | 'checkin' | 'edit' | 'share'

const ROLE_ORDER: PlaceRole[] = ['now', 'regular', 'recent', 'favourite']

export function PlaceSheet({ placeId, now, onClose }: { placeId: string | null; now: number; onClose: () => void }) {
  const place = useStore((s) => (placeId ? s.places[placeId] : undefined))
  const [mode, setMode] = useState<Mode>('view')
  useEffect(() => setMode('view'), [placeId])

  return (
    <Sheet
      open={!!place} onClose={onClose}
      eyebrow={place ? (mode === 'checkin' ? 'Check in' : mode === 'edit' ? 'Correct the details' : mode === 'share' ? 'Share' : PLACE_KINDS[place.kind].label) : undefined}
      title={place?.name}
    >
      {place && mode === 'view' && <View place={place} now={now} setMode={setMode} onClose={onClose} />}
      {place && mode === 'checkin' && <CheckIn place={place} now={now} done={() => setMode('view')} />}
      {place && mode === 'edit' && <EditPlace place={place} done={() => setMode('view')} />}
      {place && mode === 'share' && <Share place={place} now={now} done={() => setMode('view')} />}
    </Sheet>
  )
}

function View({ place, now, setMode, onClose }: { place: Place; now: number; setMode: (m: Mode) => void; onClose: () => void }) {
  const me = useMe()
  const navigate = useNavigate()
  const viewer = useViewer()
  const athletes = useStore((s) => s.athletes)
  const visits = useStore((s) => s.visits)
  const toggleFavourite = useStore((s) => s.toggleFavourite)
  const setHomePlace = useStore((s) => s.setHomePlace)
  const checkOut = useStore((s) => s.checkOut)
  const extendStay = useStore((s) => s.extendStay)
  const confirmPlace = useStore((s) => s.confirmPlace)
  const removePlace = useStore((s) => s.removePlace)

  const mine = liveVisit(visits, me.athlete.id, now)
  const here = mine?.placeId === place.id
  const isHome = me.athlete.homePlaceId === place.id
  const isFavourite = !!me.athlete.favouritePlaces?.includes(place.id)
  const trust = placeTrust(place)
  const away = fix.at ? distance(fix.at, place) : null

  const minute = Math.floor(now / 60000)
  const people = useMemo(
    () => peopleAt(place.id, athletes, visits, viewer, now).filter((p) => p.athleteId !== me.athlete.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [place.id, athletes, visits, viewer, minute, me.athlete.id],
  )
  const auras = useAuras([me.athlete.id, ...people.map((p) => p.athleteId)])
  const byRole = (role: PlaceRole) => people.filter((p) => roleOf(p) === role).sort((a, b) => (auras[b.athleteId]?.aura.aura ?? 0) - (auras[a.athleteId]?.aura.aura ?? 0))

  const gear = useMemo(() => gearAt(place, me.athlete.equipment), [place, me.athlete.equipment])
  const fit = useMemo(() => {
    const per = Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, { can: 0, all: 0 }])) as Record<DisciplineId, { can: number; all: number }>
    for (const ex of EXERCISES) {
      per[ex.discipline].all++
      if (doableWith(ex, gear)) per[ex.discipline].can++
    }
    return per
  }, [gear])
  const fitTotal = DISCIPLINE_IDS.reduce((n, d) => n + fit[d].can, 0)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-3">
          <span className="inline-flex items-center gap-1.5" title={trust.detail}>
            {place.confirmedAt ? <BadgeCheck size={13} className="text-good" /> : <MapPin size={13} />}
            {trust.label}
          </span>
          {away !== null && <span>{formatDistance(away)} from you</span>}
          {place.access === 'members' && <span>Membership or entry fee</span>}
        </div>
        {placeSub(place) && <p className="mt-1.5 text-[13.5px] text-ink-2">{placeSub(place)}</p>}
        {place.note && <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{place.note}</p>}
      </div>

      {here && mine ? (
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium">You are checked in until {timeOf(mine.endsAt)}</span>
              <span className="mt-0.5 flex items-center gap-2 text-[12px] text-ink-3">
                {minutesLeft(mine.endsAt, now)} min left · <AudienceTag audience={mine.audience} />
              </span>
            </span>
          </div>
          <div className="mt-3.5 grid grid-cols-3 gap-2">
            <button className="btn btn-quiet btn-sm" onClick={() => extendStay(30)}>+30 min</button>
            <button className="btn btn-quiet btn-sm" onClick={() => setMode('share')}><Share2 size={13} /> Tell someone</button>
            <button className="btn btn-primary btn-sm" onClick={checkOut}>Leave now</button>
          </div>
          <p className="mt-3 text-[12px] leading-snug text-ink-3">Your check-in ends by itself at {timeOf(mine.endsAt)}. Sessions you finish before then are saved as done here.</p>
        </div>
      ) : (
        <button className="btn btn-primary w-full" onClick={() => setMode('checkin')}><MapPin size={15} /> Check in here</button>
      )}

      <div className="grid grid-cols-4 gap-2">
        <Action icon={<Star size={16} fill={isFavourite ? 'currentColor' : 'none'} />} label={isFavourite ? 'Favourite' : 'Favourite'} on={isFavourite} disabled={isHome} onClick={() => toggleFavourite(place.id)} />
        <Action icon={<House size={16} />} label="Home spot" on={isHome} onClick={() => setHomePlace(isHome ? null : place.id)} />
        <Action icon={<Navigation size={16} />} label="Directions" href={directionsUrl(place)} />
        <Action icon={<Share2 size={16} />} label="Share" onClick={() => setMode('share')} />
      </div>

      {/* People, one section per kind of tie. A person appears once, under the most immediate one. */}
      <section>
        <SectionTitle>Athletes</SectionTitle>
        {people.length === 0 ? (
          <p className="rounded-[22px] border border-dashed border-line-strong p-4 text-[13px] leading-relaxed text-ink-3">
            Nobody you can see is tied to this place yet. People appear here only when they check in and choose to be visible, or save the place and share their places.
          </p>
        ) : (
          <div className="space-y-4">
            {ROLE_ORDER.map((role) => {
              const list = byRole(role)
              if (!list.length) return null
              return (
                <div key={role}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[13.5px] font-medium">{PLACE_ROLES[role].title} <span className="num text-ink-3">{list.length}</span></span>
                  </div>
                  <div className="card divide-y divide-line">
                    {list.map((p) => (
                      <PersonRow key={p.athleteId} person={p} role={role} now={now} mine={auras[me.athlete.id]} theirs={auras[p.athleteId]} onOpen={() => { onClose(); navigate(`/athlete/${p.athleteId}`) }} />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-snug text-ink-3">{PLACE_ROLES[role].meaning}</p>
                </div>
              )
            })}
          </div>
        )}
        <p className="mt-3 text-[11.5px] leading-snug text-ink-3">
          The athletes shown are sample people on this device. Seeing real athletes at a place needs accounts, which are not connected yet.
        </p>
      </section>

      <section>
        <SectionTitle>What is here</SectionTitle>
        {place.equipment.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {place.equipment.map((e) => <span key={e} className="inline-flex h-8 items-center rounded-full border border-line px-3 text-[12.5px]">{PLACE_EQUIPMENT[e]}</span>)}
            {place.amenities.map((a) => <span key={a} className="inline-flex h-8 items-center rounded-full bg-surface-2 px-3 text-[12.5px] text-ink-2">{PLACE_AMENITIES[a]}</span>)}
          </div>
        ) : (
          <p className="text-[13px] leading-relaxed text-ink-3">
            No equipment is recorded for this place{place.parts && place.parts > 1 ? `, though ${place.parts} stations are mapped here` : ''}. If you know it, add what is there.
          </p>
        )}
        <p className="mt-2.5 text-[11.5px] leading-snug text-ink-3">{trust.detail} No photos yet: Aura has nowhere to store them until its backend is connected.</p>
      </section>

      <section>
        <SectionTitle>Training here</SectionTitle>
        <div className="card p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span><span className="display num text-[34px] leading-none">{fitTotal}</span><span className="ml-2 text-[13px] text-ink-3">of {EXERCISES.length} exercises fit this place</span></span>
          </div>
          <div className="mt-3.5 space-y-2">
            {DISCIPLINE_IDS.map((d) => (
              <div key={d} className="flex items-center gap-3 text-[12.5px]">
                <span className="w-[72px] shrink-0 text-ink-2">{disciplineById[d].short}</span>
                <Bar value={fit[d].can / fit[d].all} color={dvar(d)} height={4} />
                <span className="num w-10 shrink-0 text-right text-ink-3">{fit[d].can}/{fit[d].all}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-snug text-ink-3">
            Counted from the equipment recorded here, the floor, and what you carry with you{place.equipment.length === 0 ? '. With no equipment recorded, only floor work is counted' : ''}.
          </p>
        </div>
      </section>

      <div className="space-y-1 border-t border-line pt-3 text-[13.5px]">
        <button className="flex w-full items-center gap-2.5 rounded-xl px-1 py-2.5 text-left text-ink-2 hover:text-ink" onClick={() => setMode('edit')}><Pencil size={14} /> Correct the details</button>
        {here && (
          <button className="flex w-full items-center gap-2.5 rounded-xl px-1 py-2.5 text-left text-ink-2 hover:text-ink" onClick={() => confirmPlace(place.id)}>
            <BadgeCheck size={14} /> {place.confirmedAt ? `You confirmed these details ${relativeDay(place.confirmedAt).toLowerCase()}` : 'The details are right: confirm them'}
          </button>
        )}
        {place.osm && (
          <a className="flex w-full items-center gap-2.5 rounded-xl px-1 py-2.5 text-ink-2 hover:text-ink" href={osmUrl(place.osm)} target="_blank" rel="noreferrer"><ExternalLink size={14} /> See or fix it on OpenStreetMap</a>
        )}
        {place.source === 'athlete' && (
          <button className="flex w-full items-center gap-2.5 rounded-xl px-1 py-2.5 text-left text-ink-2 hover:text-ink" onClick={() => { if (window.confirm(`Remove ${place.name} from this device?`)) { removePlace(place.id); onClose() } }}>
            <Trash2 size={14} /> Remove this place
          </button>
        )}
      </div>
    </div>
  )
}

function Action({ icon, label, on, onClick, href, disabled }: { icon: React.ReactNode; label: string; on?: boolean; onClick?: () => void; href?: string; disabled?: boolean }) {
  const cls = cx('pressable flex h-[62px] flex-col items-center justify-center gap-1.5 rounded-2xl border text-[11.5px] disabled:opacity-35', on ? 'border-ink bg-ink text-bg' : 'border-line text-ink-2 hover:bg-surface-2')
  return href ? (
    <a className={cls} href={href} target="_blank" rel="noreferrer">{icon}{label}</a>
  ) : (
    <button className={cls} onClick={onClick} aria-pressed={on} disabled={disabled}>{icon}{label}</button>
  )
}

function PersonRow({ person, role, now, mine, theirs, onOpen }: {
  person: PersonAtPlace; role: PlaceRole; now: number; onOpen: () => void
  mine?: ReturnType<typeof useAuras>[string]; theirs?: ReturnType<typeof useAuras>[string]
}) {
  const athlete = useStore((s) => s.athletes[person.athleteId])
  if (!athlete || !theirs) return null
  const first = athlete.name.split(' ')[0]
  const line = mine ? compatibilityLine({ values: mine.values, aura: mine.aura.aura }, { values: theirs.values, aura: theirs.aura.aura }, first) : null
  const detail =
    role === 'now'
      ? `Until ${timeOf(person.until!)} · ${minutesLeft(person.until!, now)} min left · ${person.onSite ? 'location confirmed on arrival' : 'by their own word'}`
      : role === 'favourite'
        ? person.home ? 'Their home spot' : 'Saved as a favourite'
        : `Last here ${relativeDay(person.lastSeen!).toLowerCase()}`
  const also = [role !== 'regular' && person.regular && 'a regular', role !== 'favourite' && person.home && 'home spot', role !== 'favourite' && !person.home && person.favourite && 'a favourite'].filter(Boolean)
  return (
    <button onClick={onOpen} className="flex w-full items-start gap-3 px-4 py-3 text-left first:rounded-t-[22px] last:rounded-b-[22px] hover:bg-surface-2">
      <AuraDot mix={theirs.aura.mix} size={40}>{initials(athlete.name)}</AuraDot>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[14.5px] font-medium">
          <span className="truncate">{athlete.name}</span>
          {athlete.openToTrain && <span className="shrink-0 rounded-full border border-good/40 px-1.5 py-px font-mono text-[8.5px] tracking-[0.08em] text-good uppercase">Open to train</span>}
        </span>
        <span className="block text-[12px] leading-snug text-ink-3">{theirs.aura.title} · {detail}</span>
        {also.length > 0 && <span className="block text-[12px] text-ink-3">Also {also.join(' and ')} here</span>}
        {line && <span className="mt-1 block text-[12.5px] leading-snug text-ink-2">{line}</span>}
      </span>
      <span className="display num shrink-0 text-[24px]">{num(theirs.aura.aura)}</span>
    </button>
  )
}

// ── Check in ─────────────────────────────────────────────────────────────

function CheckIn({ place, now, done }: { place: Place; now: number; done: () => void }) {
  const settings = useStore((s) => s.settings)
  const checkIn = useStore((s) => s.checkIn)
  const [minutes, setMinutes] = useState<number>(settings.stayMinutes ?? PRESENCE.defaultMinutes)
  // Private until the athlete chooses otherwise; after that, their last choice is offered again.
  const [audience, setAudience] = useState<Audience>(settings.audience ?? 'me')
  const [site, setSite] = useState<{ state: 'idle' | 'asking' | 'yes' | 'far' | 'failed'; metres?: number; error?: string }>(() =>
    fix.at && distance(fix.at, place) <= PRESENCE.onSiteMetres ? { state: 'yes', metres: distance(fix.at, place) } : { state: 'idle' },
  )

  const confirm = async () => {
    setSite({ state: 'asking' })
    try {
      const at = await locate()
      const metres = distance(at, place)
      setSite({ state: metres <= PRESENCE.onSiteMetres ? 'yes' : 'far', metres })
    } catch (e) {
      setSite({ state: 'failed', error: ERROR_COPY[(e as PlacesError).kind] ?? ERROR_COPY.unavailable })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow className="mb-2.5">How long will you be here</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {PRESENCE.durations.map((m) => (
            <button key={m} className="chip" data-on={minutes === m} onClick={() => setMinutes(m)}>{m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60}` : `${m / 60} h`}</button>
          ))}
        </div>
        <p className="mt-2 text-[12px] leading-snug text-ink-3">Your check-in ends by itself at {timeOf(new Date(now + minutes * 60000).toISOString())}. There is no open-ended check-in, and you can leave earlier at any time.</p>
      </div>

      <div>
        <Eyebrow className="mb-2.5">Who can see that you are here</Eyebrow>
        <AudiencePicker value={audience} onChange={setAudience} />
        <p className="mt-2 text-[12px] leading-snug text-ink-3">
          {audience === 'me' && 'Nobody else. It is kept as your own training log.'}
          {audience === 'following' && 'Only athletes you follow. Following someone is what opens this to them; who follows you makes no difference.'}
          {audience === 'everyone' && 'Any Aura athlete looking at this place sees your name, Aura and strengths until the time above.'}
        </p>
      </div>

      <div>
        <Eyebrow className="mb-2.5">Confirm you are here · optional</Eyebrow>
        {site.state === 'yes' ? (
          <p className="flex items-center gap-2 text-[13.5px] text-good"><Check size={15} /> Confirmed: you are {formatDistance(site.metres!)} from this place.</p>
        ) : (
          <button className="btn btn-quiet btn-sm" onClick={confirm} disabled={site.state === 'asking'}><LocateFixed size={14} /> {site.state === 'asking' ? 'Checking…' : 'Check with my location'}</button>
        )}
        {site.state === 'far' && <p className="mt-2 text-[12.5px] text-warn">Your device puts you {formatDistance(site.metres!)} away, so this check-in will be marked “by their own word”.</p>}
        {site.state === 'failed' && <p className="mt-2 text-[12.5px] text-warn">{site.error}</p>}
        <p className="mt-2 text-[12px] leading-snug text-ink-3">
          Your location is read once, compared with this place, and discarded. Aura stores which place and when, never where you are, and never tracks you between check-ins.
        </p>
      </div>

      <div className="rounded-2xl bg-surface-2 p-3.5 text-[12.5px] leading-relaxed text-ink-2">
        <span className="font-medium text-ink">For now this stays on your device.</span> Other athletes cannot see check-ins until accounts are connected. To tell someone today, use “Tell someone” after checking in: it makes a link you send yourself.
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-2">
        <button className="btn btn-quiet" onClick={done}>Back</button>
        <button className="btn btn-primary" onClick={() => { checkIn(place.id, { minutes, audience, onSite: site.state === 'yes' }); done() }}>
          Check in until {timeOf(new Date(now + minutes * 60000).toISOString())}
        </button>
      </div>
    </div>
  )
}

// ── Correct the details ──────────────────────────────────────────────────

export function PlaceFields({ value, onChange }: {
  value: { name: string; kind: PlaceKind; equipment: PlaceEquipment[]; amenities: PlaceAmenity[]; note: string }
  onChange: (v: { name: string; kind: PlaceKind; equipment: PlaceEquipment[]; amenities: PlaceAmenity[]; note: string }) => void
}) {
  const flip = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
  return (
    <div className="space-y-5">
      <label className="block"><Eyebrow className="mb-2">Name</Eyebrow><input className="field" value={value.name} placeholder="What people call it" onChange={(e) => onChange({ ...value, name: e.target.value })} /></label>
      <div>
        <Eyebrow className="mb-2.5">Kind of place</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PLACE_KINDS) as PlaceKind[]).map((k) => <button key={k} className="chip" data-on={value.kind === k} onClick={() => onChange({ ...value, kind: k })}>{PLACE_KINDS[k].label}</button>)}
        </div>
      </div>
      <div>
        <Eyebrow className="mb-2.5">Equipment</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PLACE_EQUIPMENT) as PlaceEquipment[]).map((e) => <button key={e} className="chip" data-on={value.equipment.includes(e)} onClick={() => onChange({ ...value, equipment: flip(value.equipment, e) })}>{PLACE_EQUIPMENT[e]}</button>)}
        </div>
      </div>
      <div>
        <Eyebrow className="mb-2.5">Good to know</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PLACE_AMENITIES) as PlaceAmenity[]).map((a) => <button key={a} className="chip" data-on={value.amenities.includes(a)} onClick={() => onChange({ ...value, amenities: flip(value.amenities, a) })}>{PLACE_AMENITIES[a]}</button>)}
        </div>
      </div>
      <label className="block"><Eyebrow className="mb-2">Note · optional</Eyebrow><textarea className="field" rows={2} value={value.note} placeholder="Bar heights, the quiet hours, where the entrance is" onChange={(e) => onChange({ ...value, note: e.target.value })} /></label>
    </div>
  )
}

function EditPlace({ place, done }: { place: Place; done: () => void }) {
  const editPlace = useStore((s) => s.editPlace)
  const [v, setV] = useState({ name: place.name, kind: place.kind, equipment: place.equipment, amenities: place.amenities, note: place.note ?? '' })
  return (
    <div className="space-y-5">
      <PlaceFields value={v} onChange={setV} />
      <p className="text-[12px] leading-snug text-ink-3">
        Corrections are saved on this device and are kept when the place is loaded again. Sharing them with every athlete needs Aura’s backend
        {place.osm ? '; until then, the lasting fix is to correct the place on OpenStreetMap, where this record comes from.' : '.'}
      </p>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <button className="btn btn-quiet" onClick={done}>Cancel</button>
        <button className="btn btn-primary" onClick={() => { editPlace(place.id, { ...v, note: v.note.trim() || undefined }); done() }}>Save</button>
      </div>
    </div>
  )
}

// ── Share ────────────────────────────────────────────────────────────────

function Share({ place, now, done }: { place: Place; now: number; done: () => void }) {
  const me = useMe()
  const visits = useStore((s) => s.visits)
  const mine = liveVisit(visits, me.athlete.id, now)
  const here = mine?.placeId === place.id ? mine : undefined
  const [withMe, setWithMe] = useState(!!here)
  const [copied, setCopied] = useState(false)
  const url = spotUrl(
    encodeSpot({ place, who: withMe && here ? { name: me.athlete.name, aura: me.aura.aura, title: me.aura.title, until: here.endsAt } : undefined }),
  )
  const text = withMe && here ? `I'm training at ${place.name} until ${timeOf(here.endsAt)}.` : `A place to train: ${place.name}.`
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <div className="space-y-5">
      {here && (
        <div className="grid grid-cols-2 gap-1.5">
          <button className={cx('pressable h-11 rounded-2xl border text-[13px]', withMe ? 'border-ink bg-ink text-bg' : 'border-line text-ink-2')} onClick={() => setWithMe(true)}>I’m here until {timeOf(here.endsAt)}</button>
          <button className={cx('pressable h-11 rounded-2xl border text-[13px]', !withMe ? 'border-ink bg-ink text-bg' : 'border-line text-ink-2')} onClick={() => setWithMe(false)}>Just the place</button>
        </div>
      )}
      <div className="flex justify-center"><QrCode value={url} size={212} className="rounded-2xl" /></div>
      <p className="text-center text-[13px] leading-relaxed text-ink-2">
        {withMe && here
          ? <>The link carries the place, your name, your Aura ({num(me.aura.aura)}) and the time your check-in ends. After {timeOf(here.endsAt)} it shows only the place.</>
          : <>The link carries the place and nothing about you.</>}
      </p>
      <div className={cx('grid gap-2', canShare ? 'grid-cols-2' : 'grid-cols-1')}>
        <button className="btn btn-quiet" onClick={async () => { setCopied(await copyText(url)); window.setTimeout(() => setCopied(false), 1800) }}>
          {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy link</>}
        </button>
        {canShare && <button className="btn btn-primary" onClick={() => navigator.share({ title: place.name, text, url }).catch(() => {})}><Share2 size={14} /> Send</button>}
      </div>
      <p className="text-[12px] leading-snug text-ink-3">
        You choose who gets the link; whoever has it can open it. This is how presence travels between phones until accounts are connected. Who can see you inside Aura: {here ? AUDIENCES[here.audience].short.toLowerCase() : 'not checked in'}.
      </p>
      <button className="btn btn-quiet w-full" onClick={done}>Back</button>
    </div>
  )
}
