import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { House, LocateFixed, MapPin, Plus, RefreshCw, ScanLine, Search, Star, X } from 'lucide-react'
import type { Place, PlaceAmenity, PlaceEquipment, PlaceKind } from '@/domain/types'
import { MAX_SEARCH_AREA, PLACE_EQUIPMENT, PLACE_KINDS, distance, formatDistance, inBox, liveVisit, type BBox, type LatLon } from '@/domain/places'
import { useStore } from '@/data/store'
import { useScheme } from '@/theme/useTheme'
import { useClock, useMe } from '@/data/hooks'
import { Eyebrow, PageHeader, Sheet } from '@/ui/primitives'
import type { MapPlace, MapViewState } from '@/ui/MapView'
import { cx } from '@/lib/format'
import { ERROR_COPY, PlacesError, fetchPlaces, fix, locate, searchArea, type AreaHit } from './osm'
import { PlaceFields, PlaceSheet } from './PlaceSheet'
import { AudienceTag, minutesLeft, timeOf, useLiveByPlace } from './shared'

const MapView = lazy(() => import('@/ui/MapView'))

type Filter = 'all' | 'parks' | 'bars' | 'saved'
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'parks', label: 'Calisthenics parks' },
  { id: 'bars', label: 'With a pull-up bar' },
  { id: 'saved', label: 'Saved' },
]

const WORLD = { lat: 30, lon: 8, zoom: 1.4 }
const area = ([s, w, n, e]: BBox) => (n - s) * (e - w)

/** Whether this browser can draw the map at all. */
const canDrawMap = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function Places() {
  const me = useMe()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const selected = params.get('place')
  const now = useClock()

  const places = useStore((s) => s.places)
  const visits = useStore((s) => s.visits)
  const theme = useScheme()
  const savedView = useStore((s) => s.mapView)
  const setMapView = useStore((s) => s.setMapView)
  const mergePlaces = useStore((s) => s.mergePlaces)
  const addPlace = useStore((s) => s.addPlace)

  const [mapOk] = useState(canDrawMap)
  const [view, setView] = useState<MapViewState | null>(null)
  const [target, setTarget] = useState<{ lat: number; lon: number; zoom?: number; key: number } | null>(null)
  const [here, setHere] = useState<LatLon | null>(fix.at)
  const [filter, setFilter] = useState<Filter>('all')
  const [busy, setBusy] = useState<'places' | 'locate' | 'search' | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<AreaHit[] | null>(null)
  const [adding, setAdding] = useState<'position' | 'details' | null>(null)
  const fetchAfterMove = useRef(false)
  const searchedOnce = useRef(false)

  const live = useLiveByPlace(now)
  const mine = liveVisit(visits, me.athlete.id, now)
  const saved = useMemo(() => new Set([...(me.athlete.favouritePlaces ?? []), ...(me.athlete.homePlaceId ? [me.athlete.homePlaceId] : [])]), [me.athlete.favouritePlaces, me.athlete.homePlaceId])

  const all = useMemo(() => Object.values(places), [places])
  const passes = useCallback(
    (p: Place) => filter === 'all' || (filter === 'parks' && p.kind === 'calisthenics') || (filter === 'bars' && p.equipment.includes('bar')) || (filter === 'saved' && saved.has(p.id)),
    [filter, saved],
  )
  const mapPlaces: MapPlace[] = useMemo(
    () => all.filter(passes).map((p) => ({ id: p.id, lat: p.lat, lon: p.lon, kind: p.kind, live: live.get(p.id)?.length ?? 0, saved: saved.has(p.id) })),
    [all, passes, live, saved],
  )

  // The list follows the map: what is in view, nearest first. Saved places are always listed.
  const origin = here ?? (view ? { lat: view.lat, lon: view.lon } : null)
  const listed = useMemo(() => {
    const inView = all.filter((p) => passes(p) && (filter === 'saved' || !view || inBox(p, view.bounds)))
    // People first, then places a calisthenics athlete can actually use, then the rest; nearest first within each.
    const rank = (p: Place) => (live.has(p.id) ? 0 : p.kind === 'calisthenics' || p.equipment.includes('bar') ? 1 : p.equipment.length ? 2 : 3)
    const score = (p: Place) => rank(p) * 1e8 + (origin ? distance(origin, p) : 0)
    return inView.sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name))
  }, [all, passes, filter, view, origin, live])

  const load = useCallback(
    async (box: BBox) => {
      if (area(box) > MAX_SEARCH_AREA) {
        setNotice('Zoom in to a town or a neighbourhood, then search this area.')
        return
      }
      setBusy('places')
      setNotice(null)
      try {
        const found = await fetchPlaces(box)
        mergePlaces(found)
        searchedOnce.current = true
        setNotice(found.length ? null : 'OpenStreetMap has no outdoor gyms or calisthenics spots mapped in this area. If you know one, add it.')
      } catch (e) {
        setNotice(ERROR_COPY[(e as PlacesError).kind] ?? ERROR_COPY.busy)
      } finally {
        setBusy(null)
      }
    },
    [mergePlaces],
  )

  const onMove = useCallback(
    (v: MapViewState) => {
      setView(v)
      setMapView({ lat: v.lat, lon: v.lon, zoom: v.zoom })
      if (fetchAfterMove.current && area(v.bounds) <= MAX_SEARCH_AREA) {
        fetchAfterMove.current = false
        void load(v.bounds)
      }
    },
    [setMapView, load],
  )

  const nearMe = async () => {
    setBusy('locate')
    setNotice(null)
    try {
      const at = await locate()
      setHere(at)
      if (mapOk) {
        fetchAfterMove.current = true
        setTarget({ ...at, zoom: 13.2, key: Date.now() })
      } else {
        await load([at.lat - 0.06, at.lon - 0.08, at.lat + 0.06, at.lon + 0.08])
      }
    } catch (e) {
      setNotice(ERROR_COPY[(e as PlacesError).kind] ?? ERROR_COPY.unavailable)
    } finally {
      setBusy((b) => (b === 'locate' ? null : b))
    }
  }

  const search = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setBusy('search')
    setNotice(null)
    try {
      const found = await searchArea(query.trim())
      setHits(found)
      if (!found.length) setNotice(`Nothing found for “${query.trim()}”. Try a town or a district.`)
    } catch (err) {
      setNotice(ERROR_COPY[(err as PlacesError).kind] ?? ERROR_COPY.busy)
    } finally {
      setBusy(null)
    }
  }

  const goTo = (hit: AreaHit) => {
    setHits(null)
    setQuery(hit.name.split(',')[0])
    const small = area(hit.box) <= MAX_SEARCH_AREA
    if (mapOk) {
      fetchAfterMove.current = true
      setTarget({ lat: hit.lat, lon: hit.lon, zoom: small ? 12.2 : 11.6, key: Date.now() })
    } else {
      void load(small ? hit.box : [hit.lat - 0.06, hit.lon - 0.08, hit.lat + 0.06, hit.lon + 0.08])
    }
  }

  const open = (id: string | null) => setParams(id ? { place: id } : {}, { replace: !!selected })
  useEffect(() => {
    const p = selected ? places[selected] : undefined
    if (p && mapOk && view && !inBox(p, view.bounds)) setTarget({ lat: p.lat, lon: p.lon, zoom: 14, key: Date.now() })
    // Only when a different place is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const initial = useMemo(() => {
    const p = selected ? places[selected] : undefined
    return p ? { lat: p.lat, lon: p.lon, zoom: 14 } : (savedView ?? WORLD)
    // The starting position is read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canSearchHere = !!view && area(view.bounds) <= MAX_SEARCH_AREA
  const empty = all.length === 0

  return (
    <div>
      <PageHeader
        eyebrow="Places"
        title="Where to train"
        sub="Calisthenics parks and outdoor gyms from OpenStreetMap, and the athletes who train at them."
        right={<button onClick={() => navigate('/athletes')} className="btn btn-quiet btn-sm"><ScanLine size={14} /> Athletes</button>}
      />

      {mine && places[mine.placeId] && (
        <button onClick={() => open(mine.placeId)} className="pressable card mb-4 flex w-full items-center gap-3 p-3.5 text-left hover:bg-surface-2">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14.5px] font-medium">You are at {places[mine.placeId].name}</span>
            <span className="flex items-center gap-2 text-[12px] text-ink-3">Until {timeOf(mine.endsAt)} · {minutesLeft(mine.endsAt, now)} min left · <AudienceTag audience={mine.audience} /></span>
          </span>
        </button>
      )}

      <form onSubmit={search} className="relative flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3" />
          <input className="field !pl-10" value={query} onChange={(e) => { setQuery(e.target.value); setHits(null) }} placeholder="Town, district or address" aria-label="Search for an area" enterKeyHint="search" />
        </div>
        <button type="submit" className="btn btn-quiet" disabled={busy === 'search' || !query.trim()}>{busy === 'search' ? 'Searching…' : 'Search'}</button>
        <button type="button" className="btn btn-quiet !px-3.5" onClick={nearMe} disabled={busy === 'locate'} aria-label="Use my location" title="Use my location, once">
          <LocateFixed size={16} className={busy === 'locate' ? 'animate-pulse' : ''} />
        </button>
        {hits && hits.length > 0 && (
          <div className="card absolute inset-x-0 top-full z-20 mt-2 divide-y divide-line shadow-(--shadow-pop)">
            {hits.map((h) => (
              <button key={`${h.lat},${h.lon}`} type="button" onClick={() => goTo(h)} className="block w-full truncate px-4 py-3 text-left text-[13.5px] first:rounded-t-card last:rounded-b-card hover:bg-surface-2">{h.name}</button>
            ))}
          </div>
        )}
      </form>

      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        {FILTERS.map((f) => <button key={f.id} className="chip shrink-0" data-on={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>)}
      </div>

      <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-8">
        {mapOk ? (
          <div className="relative h-[46dvh] min-h-[300px] overflow-hidden rounded-card border border-line bg-surface lg:sticky lg:top-8 lg:h-[calc(100dvh-400px)] lg:min-h-[440px]">
            <Suspense fallback={<div className="flex h-full items-center justify-center text-[13px] text-ink-3">Loading the map…</div>}>
              <MapView className="h-full w-full" places={mapPlaces} initial={initial} target={target} selected={selected} onSelect={(id) => !adding && open(id)} onMove={onMove} me={here} theme={theme} />
            </Suspense>

            {adding === 'position' && (
              <>
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-accent drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"><MapPin size={38} strokeWidth={2.2} fill="var(--bg)" /></div>
                <div className="glass absolute inset-x-3 bottom-3 rounded-2xl border border-line-strong p-3">
                  <p className="text-[13px] text-ink-2">Move the map until the pin sits on the spot.</p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <button className="btn btn-quiet btn-sm" onClick={() => setAdding(null)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={() => setAdding('details')} disabled={!view || view.zoom < 14}>{view && view.zoom < 14 ? 'Zoom in closer' : 'It is here'}</button>
                  </div>
                </div>
              </>
            )}

            {!adding && (
              <div className="pointer-events-none absolute inset-x-14 top-3 flex justify-center *:pointer-events-auto">
                <button className="btn btn-primary btn-sm shadow-(--shadow-pop)" onClick={() => view && load(view.bounds)} disabled={busy === 'places' || !view}>
                  <RefreshCw size={13} className={busy === 'places' ? 'animate-spin' : ''} />
                  {busy === 'places' ? 'Asking OpenStreetMap…' : canSearchHere ? 'Search this area' : 'Zoom in to search'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card-quiet p-5 text-[13.5px] leading-relaxed text-ink-2">
            This browser cannot draw the map (it needs WebGL). Search and the list below still work.
          </div>
        )}

        <div className="mt-5 lg:mt-0">
          {notice && (
            <div className="mb-3 flex items-start gap-2.5 rounded-2xl bg-surface-2 p-3.5 text-[13px] leading-snug text-ink-2">
              <span className="min-w-0 flex-1">{notice}</span>
              <button aria-label="Dismiss" onClick={() => setNotice(null)} className="shrink-0 text-ink-3 hover:text-ink"><X size={14} /></button>
            </div>
          )}

          <div className="mb-2.5 flex items-center justify-between gap-3">
            <Eyebrow>{filter === 'saved' ? `${listed.length} saved` : view ? `${listed.length} in view` : `${listed.length} places`}</Eyebrow>
            <button className="text-[12.5px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink" onClick={() => (mapOk ? setAdding('position') : setNotice('Adding a place needs the map, to put the pin in the right spot.'))}>
              <Plus size={12} className="mr-1 -mt-0.5 inline" />Add a place
            </button>
          </div>

          {listed.length === 0 ? (
            <div className="card-quiet px-5 py-8 text-center">
              <div className="display text-[22px]">{empty ? 'Find places near you' : filter === 'saved' ? 'Nothing saved yet' : 'No places in view'}</div>
              <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-ink-2">
                {filter === 'saved'
                  ? 'Open a place and mark it as a favourite or as your home spot.'
                  : 'Search for a town, or use your location once to see what is around you. Nothing is loaded until you ask.'}
              </p>
              {filter !== 'saved' && <button className="btn btn-primary btn-sm mt-4" onClick={nearMe} disabled={busy === 'locate'}><LocateFixed size={14} /> Use my location</button>}
            </div>
          ) : (
            <div className="card divide-y divide-line">
              {listed.slice(0, 40).map((p) => {
                const n = live.get(p.id)?.length ?? 0
                return (
                  <button key={p.id} onClick={() => open(p.id)} className={cx('flex w-full items-center gap-3 px-4 py-3 text-left first:rounded-t-card last:rounded-b-card hover:bg-surface-2', selected === p.id && 'bg-surface-2')}>
                    <span className={cx('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', p.kind === 'calisthenics' ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-ink-2')}>
                      {me.athlete.homePlaceId === p.id ? <House size={15} /> : saved.has(p.id) ? <Star size={15} fill="currentColor" /> : <MapPin size={15} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-medium">{p.name}</span>
                      <span className="block truncate text-[12px] text-ink-3">
                        {[p.name === PLACE_KINDS[p.kind].label ? null : PLACE_KINDS[p.kind].label, here ? formatDistance(distance(here, p)) : null, p.equipment.length ? p.equipment.slice(0, 3).map((e) => PLACE_EQUIPMENT[e]).join(', ') : 'Equipment not recorded'].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                    {n > 0 && <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-medium text-accent-ink">{n} here now</span>}
                  </button>
                )
              })}
            </div>
          )}
          {listed.length > 40 && <p className="mt-2 text-[12px] text-ink-3">Showing the nearest 40 of {listed.length}. Zoom in to narrow it down.</p>}

          <p className="mt-4 text-[11.5px] leading-relaxed text-ink-3">
            Places © OpenStreetMap contributors, loaded only when you search an area. {here ? 'Distances are from your location, read once and not stored.' : 'Listed nearest the centre of the map first; use your location to see distances.'}{' '}
            Check-ins stay on this device for now; any other athletes shown at places are sample people from the demo.
          </p>
        </div>
      </div>

      <PlaceSheet placeId={selected} now={now} onClose={() => open(null)} />

      <NewPlaceSheet
        open={adding === 'details'}
        onClose={() => setAdding(null)}
        onSave={(v) => {
          if (!view) return
          const id = addPlace({ ...v, lat: view.lat, lon: view.lon })
          setAdding(null)
          open(id)
        }}
      />
    </div>
  )
}

function NewPlaceSheet({ open, onClose, onSave }: {
  open: boolean; onClose: () => void
  onSave: (v: { name: string; kind: PlaceKind; equipment: PlaceEquipment[]; amenities: PlaceAmenity[]; note?: string }) => void
}) {
  const blank = { name: '', kind: 'calisthenics' as PlaceKind, equipment: [] as PlaceEquipment[], amenities: [] as PlaceAmenity[], note: '' }
  const [v, setV] = useState(blank)
  useEffect(() => {
    if (open) setV(blank)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  return (
    <Sheet open={open} onClose={onClose} eyebrow="A place OpenStreetMap does not have" title="Add a place">
      <div className="space-y-5">
        <PlaceFields value={v} onChange={setV} />
        <p className="text-[12px] leading-snug text-ink-3">
          The place is saved on this device with your name as the person who added it, and you can send it to anyone as a link. It becomes visible to every athlete, and open to confirmation by others, once places are shared between accounts, which is not built yet.
        </p>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <button className="btn btn-quiet" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!v.name.trim()} onClick={() => onSave({ ...v, note: v.note.trim() || undefined })}>Add this place</button>
        </div>
      </div>
    </Sheet>
  )
}
