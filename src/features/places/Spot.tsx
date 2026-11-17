import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { MapPin } from 'lucide-react'
import { PLACE_EQUIPMENT, PLACE_KINDS, decodeSpot } from '@/domain/places'
import { useStore } from '@/data/store'
import { Wordmark } from '@/app/Shell'
import { Eyebrow } from '@/ui/primitives'
import { num } from '@/lib/format'
import { timeOf } from './shared'

/**
 * A place someone sent, and optionally "I am training here until …".
 * Everything shown comes from the link itself: it is the sender's word, and
 * the "now" part stops being shown the moment its time has passed.
 */
export function SpotLanding({ data }: { data: string }) {
  const navigate = useNavigate()
  const meId = useStore((s) => s.meId)
  const mergePlaces = useStore((s) => s.mergePlaces)
  const known = useStore((s) => s.places)
  const spot = useMemo(() => decodeSpot(data), [data])

  if (!spot) {
    return (
      <Frame>
        <h1 className="display text-[34px]">This link is incomplete</h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">It may have been cut off when it was copied. Ask for it again.</p>
        <button className="btn btn-primary mt-7 w-full" onClick={() => navigate('/', { replace: true })}>Open Aura</button>
      </Frame>
    )
  }

  const { place, who } = spot
  const live = who && new Date(who.until).getTime() > Date.now() ? who : null

  const open = () => {
    if (!known[place.id]) mergePlaces([{ ...place, amenities: [], access: place.kind === 'gym' || place.kind === 'studio' ? 'members' : 'free', fetchedAt: new Date().toISOString() }])
    // The merge may have folded it into a place already known at the same spot.
    const all = useStore.getState().places
    const id = all[place.id] ? place.id : (Object.values(all).find((p) => Math.abs(p.lat - place.lat) < 0.001 && Math.abs(p.lon - place.lon) < 0.001)?.id ?? place.id)
    navigate(`/places?place=${encodeURIComponent(id)}`, { replace: true })
  }

  return (
    <Frame>
      <Eyebrow>{PLACE_KINDS[place.kind].label}</Eyebrow>
      <h1 className="display mt-2 text-[38px] leading-[1.05]">{place.name}</h1>
      <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-3"><MapPin size={13} /> {place.lat.toFixed(4)}, {place.lon.toFixed(4)}</p>

      {live ? (
        <div className="card mt-6 p-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-medium">{live.name} is training here until {timeOf(live.until)}</span>
              <span className="block text-[12.5px] text-ink-3">{live.title} · Aura {num(live.aura)}</span>
            </span>
          </div>
          <p className="mt-3 text-[12px] leading-snug text-ink-3">This is what {live.name.split(' ')[0]} chose to send. Aura has not checked it, and it stops showing at {timeOf(live.until)}.</p>
        </div>
      ) : who ? (
        <p className="mt-6 rounded-2xl bg-surface-2 p-3.5 text-[13px] leading-snug text-ink-2">{who.name} shared this while training here. That session has ended.</p>
      ) : null}

      {place.equipment.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {place.equipment.map((e) => <span key={e} className="inline-flex h-8 items-center rounded-full border border-line px-3 text-[12.5px]">{PLACE_EQUIPMENT[e]}</span>)}
        </div>
      )}

      {meId ? (
        <button className="btn btn-primary mt-8 w-full" onClick={open}>Open in Places</button>
      ) : (
        <>
          <button className="btn btn-primary mt-8 w-full" onClick={() => navigate('/welcome', { replace: true })}>Start with Aura</button>
          <p className="mt-3 text-center text-[12.5px] text-ink-3">Set up your profile first; the place will be on the map afterwards if you open this link again.</p>
        </>
      )}
    </Frame>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-6 pt-8 pb-10">
      <div className="page-glow" />
      <div className="relative z-10"><Wordmark /></div>
      <div className="relative z-10 flex flex-1 flex-col justify-center py-10">{children}</div>
    </div>
  )
}
