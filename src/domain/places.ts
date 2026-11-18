/**
 * Places and presence.
 *
 * Four different relationships between an athlete and a place, never merged:
 *   now       – checked in, and the stay has not ended
 *   regular   – derived: enough stays, spread over enough weeks, recently
 *   recent    – derived: a stay that ended in the last two weeks
 *   favourite – declared by the athlete; says nothing about attendance
 * plus `home`, the single place an athlete calls their own.
 *
 * None of this touches a rating or Aura. Where someone trains is identity and
 * community, not ability.
 */
import type {
  Athlete, AthletePrivacy, Audience, DisciplineId, EquipmentId, Exercise, Place, PlaceAmenity, PlaceEquipment, PlaceKind,
  TrainingEnvironment, Visit,
} from './types'
import { DISCIPLINE_IDS } from './catalog/base'

// ── Vocabulary ───────────────────────────────────────────────────────────

export const PLACE_KINDS: Record<PlaceKind, { label: string; plural: string }> = {
  calisthenics: { label: 'Calisthenics park', plural: 'Calisthenics parks' },
  outdoor: { label: 'Outdoor gym', plural: 'Outdoor gyms' },
  gym: { label: 'Gym', plural: 'Gyms' },
  studio: { label: 'Studio or hall', plural: 'Studios and halls' },
  other: { label: 'Other spot', plural: 'Other spots' },
}

export const PLACE_EQUIPMENT: Record<PlaceEquipment, string> = {
  bar: 'Pull-up bar',
  low_bar: 'Low bar',
  dip_bars: 'Parallel bars',
  rings: 'Rings',
  monkey_bars: 'Monkey bars',
  stall_bars: 'Stall bars',
  parallettes: 'Parallettes',
  box: 'Box or bench',
  wall: 'Wall',
}

export const PLACE_AMENITIES: Record<PlaceAmenity, string> = {
  water: 'Drinking water',
  lit: 'Lit at night',
  covered: 'Covered',
  toilets: 'Toilets',
  soft_ground: 'Soft ground',
  showers: 'Showers',
  accessible: 'Step-free access',
}

export const ENVIRONMENTS: Record<TrainingEnvironment, string> = {
  outdoor: 'Outdoors',
  gym: 'Gym',
  studio: 'Studio',
  home: 'At home',
}

export const AUDIENCES: Record<Audience, { label: string; short: string }> = {
  me: { label: 'Only me', short: 'Only you' },
  following: { label: 'People I follow', short: 'People you follow' },
  everyone: { label: 'Everyone on Aura', short: 'Everyone' },
}

// ── Privacy ──────────────────────────────────────────────────────────────

/**
 * Defaults when an athlete has chosen nothing. Declared, coarse facts are open;
 * anything about where a person actually is or goes starts closed.
 */
export const DEFAULT_PRIVACY: AthletePrivacy = { origin: 'everyone', base: 'everyone', places: 'following', visits: 'me', style: 'everyone', ratings: 'everyone', interests: 'everyone' }

export const privacyOf = (a: Pick<Athlete, 'privacy'>): AthletePrivacy => ({ ...DEFAULT_PRIVACY, ...a.privacy })

/** How the viewer stands to the owner of some information. */
export type Relation = 'self' | 'followed' | 'stranger'

/** `ownerFollows` lists who the owner follows; that is the circle `following` opens to. */
export const relationOf = (ownerId: string, viewerId: string | null, ownerFollows: readonly string[]): Relation =>
  viewerId === ownerId ? 'self' : viewerId && ownerFollows.includes(viewerId) ? 'followed' : 'stranger'

export const canSee = (audience: Audience, relation: Relation) =>
  relation === 'self' || audience === 'everyone' || (audience === 'following' && relation === 'followed')

export interface PublicIdentity {
  from?: string
  city?: string
  country?: string
  interests: import('./types').DisciplineId[]
  environments: TrainingEnvironment[]
  homePlaceId?: string
  favouritePlaces: string[]
  openToTrain: boolean
}

/** What of an athlete's identity a given viewer may see. Everything else is simply absent. */
export function identityFor(a: Athlete, relation: Relation): PublicIdentity {
  const p = privacyOf(a)
  const places = canSee(p.places, relation)
  return {
    from: canSee(p.origin, relation) ? a.from : undefined,
    city: canSee(p.base, relation) ? a.city : undefined,
    country: canSee(p.base, relation) ? a.country : undefined,
    interests: canSee(p.interests, relation) ? (a.interests ?? []) : [],
    environments: places ? (a.environments ?? []) : [],
    homePlaceId: places ? a.homePlaceId : undefined,
    favouritePlaces: places ? (a.favouritePlaces ?? []) : [],
    openToTrain: !!a.openToTrain,
  }
}

// ── Presence ─────────────────────────────────────────────────────────────

export const PRESENCE = {
  /** Offered lengths of a stay, in minutes. There is no open-ended check-in. */
  durations: [45, 60, 90, 120, 180],
  defaultMinutes: 90,
  maxMinutes: 240,
  /** A stay counts as "recent" for this long after it ends. */
  recentDays: 14,
  /** Regular: at least `visits` stays in `weeks` different weeks within `windowDays`. */
  regular: { visits: 4, weeks: 3, windowDays: 56 },
  /** A one-off location check confirms "on site" within this many metres. */
  onSiteMetres: 200,
} as const

const DAY = 86400000

export const isLive = (v: Visit, now: number) => new Date(v.startedAt).getTime() <= now && now < new Date(v.endsAt).getTime()

export const liveVisit = (visits: Visit[], athleteId: string, now: number) =>
  visits.find((v) => v.athleteId === athleteId && isLive(v, now))

/** May this viewer know about this stay at all? History needs the owner's `visits` setting too. */
export function visitVisible(v: Visit, owner: Athlete, relation: Relation, now: number) {
  if (relation === 'self') return true
  if (!canSee(v.audience, relation)) return false
  return isLive(v, now) || canSee(privacyOf(owner).visits, relation)
}

const weekOf = (t: number) => Math.floor((t - 4 * DAY) / (7 * DAY)) // weeks starting Monday

export interface PlaceHistory {
  /** Finished or running stays inside the regular window. */
  count: number
  weeks: number
  last?: string
  regular: boolean
  recent: boolean
}

/** One athlete's history at one place, from the stays passed in. */
export function historyAt(visits: Visit[], now: number): PlaceHistory {
  const { regular, recentDays } = PRESENCE
  const started = visits.map((v) => new Date(v.startedAt).getTime()).filter((t) => t <= now)
  const inWindow = started.filter((t) => now - t <= regular.windowDays * DAY)
  const weeks = new Set(inWindow.map(weekOf)).size
  const last = started.length ? Math.max(...started) : undefined
  const ended = visits.filter((v) => new Date(v.endsAt).getTime() <= now).map((v) => new Date(v.endsAt).getTime())
  return {
    count: inWindow.length,
    weeks,
    last: last === undefined ? undefined : new Date(last).toISOString(),
    regular: inWindow.length >= regular.visits && weeks >= regular.weeks,
    recent: ended.some((t) => now - t <= recentDays * DAY),
  }
}

export interface PersonAtPlace {
  athleteId: string
  now: boolean
  /** While `now`: when the stay ends, and whether the device confirmed it. */
  until?: string
  onSite?: boolean
  regular: boolean
  recent: boolean
  lastSeen?: string
  favourite: boolean
  home: boolean
  sample: boolean
}

/**
 * Everyone connected to a place that this viewer is allowed to know about,
 * with each relationship reported separately.
 */
export function peopleAt(
  placeId: string,
  athletes: Record<string, Athlete>,
  visits: Visit[],
  viewer: { id: string | null; followedBy: (ownerId: string) => readonly string[] },
  now: number,
): PersonAtPlace[] {
  const out: PersonAtPlace[] = []
  const here = visits.filter((v) => v.placeId === placeId)
  for (const a of Object.values(athletes)) {
    const relation = relationOf(a.id, viewer.id, viewer.followedBy(a.id))
    const mine = here.filter((v) => v.athleteId === a.id && visitVisible(v, a, relation, now))
    const live = mine.find((v) => isLive(v, now))
    const h = historyAt(mine, now)
    const id = identityFor(a, relation)
    const person: PersonAtPlace = {
      athleteId: a.id,
      now: !!live,
      until: live?.endsAt,
      onSite: live?.onSite,
      regular: h.regular,
      recent: h.recent,
      lastSeen: h.last,
      favourite: id.favouritePlaces.includes(placeId),
      home: id.homePlaceId === placeId,
      sample: mine.some((v) => v.sample),
    }
    if (person.now || person.regular || person.recent || person.favourite || person.home) out.push(person)
  }
  return out
}

/** The one section a person is listed under: the most immediate relationship they have. */
export type PlaceRole = 'now' | 'regular' | 'recent' | 'favourite'
export const roleOf = (p: PersonAtPlace): PlaceRole => (p.now ? 'now' : p.regular ? 'regular' : p.recent ? 'recent' : 'favourite')

export const PLACE_ROLES: Record<PlaceRole, { title: string; meaning: string }> = {
  now: { title: 'Training here now', meaning: 'Checked in, and the stay has not run out.' },
  regular: {
    title: 'Regulars',
    meaning: `At least ${PRESENCE.regular.visits} check-ins across ${PRESENCE.regular.weeks} different weeks in the last ${PRESENCE.regular.windowDays / 7} weeks.`,
  },
  recent: { title: 'Here recently', meaning: `Checked in during the last ${PRESENCE.recentDays} days.` },
  favourite: { title: 'Call it a favourite', meaning: 'Saved it to their profile. It does not mean they have been here lately.' },
}

// ── Geometry ─────────────────────────────────────────────────────────────

export interface LatLon { lat: number; lon: number }

/** Great-circle distance in metres. */
export function distance(a: LatLon, b: LatLon) {
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLon = (b.lon - a.lon) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2
  return 2 * 6371000 * Math.asin(Math.min(1, Math.sqrt(h)))
}

export const formatDistance = (m: number) => (m < 950 ? `${Math.max(10, Math.round(m / 10) * 10)} m` : m < 9500 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m / 1000)} km`)

/** [south, west, north, east] */
export type BBox = readonly [number, number, number, number]

export const inBox = (p: LatLon, [s, w, n, e]: BBox) => p.lat >= s && p.lat <= n && p.lon >= w && p.lon <= e

// ── OpenStreetMap ────────────────────────────────────────────────────────

/** Largest area, in square degrees, one request may cover. About a large city. */
export const MAX_SEARCH_AREA = 0.12

export const overpassQuery = ([s, w, n, e]: BBox) => {
  const box = `(${s.toFixed(5)},${w.toFixed(5)},${n.toFixed(5)},${e.toFixed(5)})`
  return (
    `[out:json][timeout:25];(` +
    `nwr["leisure"="fitness_station"]${box};` +
    `nwr["sport"~"calisthenics|street_workout"]${box};` +
    `nwr["leisure"~"fitness_centre|sports_centre|sports_hall"]["sport"~"calisthenics|gymnastics|street_workout"]${box};` +
    `);out center tags 1500;`
  )
}

export interface OsmElement {
  type: 'node' | 'way' | 'relation'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

const OSM_EQUIPMENT: Record<string, PlaceEquipment> = {
  horizontal_bar: 'bar',
  pull_up: 'bar',
  'pull-up': 'bar',
  chin_up: 'bar',
  parallel_bars: 'dip_bars',
  dip: 'dip_bars',
  dips: 'dip_bars',
  rings: 'rings',
  horizontal_ladder: 'monkey_bars',
  monkey_bars: 'monkey_bars',
  wall_bars: 'stall_bars',
  'push-up': 'low_bar',
  push_up: 'low_bar',
  low_bar: 'low_bar',
  box: 'box',
  'sit-up': 'box',
  sit_up: 'box',
  bench: 'box',
}

/** Words in a station's own name that identify equipment, for the many stations mapped without a type. */
const NAME_HINTS: [RegExp, PlaceEquipment][] = [
  [/pull.?up|chin.?up|barra fixa|barra de flex|reck|klimmzug|dominad|traction/i, 'bar'],
  [/parallel|paralela|barren|dip/i, 'dip_bars'],
  [/\brings?\b|argolas|anillas|ringe|anneaux/i, 'rings'],
  [/monkey|ladder|escada horizontal|hangel/i, 'monkey_bars'],
  [/espaldar|wall bars|sprossenwand|stall bars/i, 'stall_bars'],
]

const equipmentOf = (tags: Record<string, string>) => {
  const out = new Set<PlaceEquipment>()
  for (const raw of (tags.fitness_station ?? '').split(/[;,]/)) {
    const eq = OSM_EQUIPMENT[raw.trim().toLowerCase()]
    if (eq) out.add(eq)
  }
  for (const [re, eq] of NAME_HINTS) if (re.test(tags.name ?? '')) out.add(eq)
  return out
}

const yes = (v?: string) => v === 'yes' || v === 'designated'

/** Two of these together make a calisthenics park, whatever the mapper called it. */
const BODYWEIGHT_RIG: PlaceEquipment[] = ['bar', 'dip_bars', 'rings', 'monkey_bars']

/** Stations closer than this are one place: parks are mapped bar by bar. */
const MERGE_METRES = 90

/**
 * Turn raw OpenStreetMap elements into places. Individual stations are merged
 * into the park or circuit they belong to, and equipment is read only from
 * what mappers recorded; nothing is guessed.
 */
export function placesFromOsm(elements: OsmElement[], fetchedAt: string): Place[] {
  interface Raw { el: OsmElement; lat: number; lon: number; tags: Record<string, string>; group?: string }
  const raws: Raw[] = []
  for (const el of elements) {
    const lat = el.lat ?? el.center?.lat
    const lon = el.lon ?? el.center?.lon
    const tags = el.tags ?? {}
    if (lat === undefined || lon === undefined) continue
    if (tags.access === 'private' || tags.access === 'no') continue
    // A circuit's stations share a description or operator reference; use it to keep them together.
    raws.push({ el, lat, lon, tags, group: tags.description?.trim().toLowerCase() || undefined })
  }
  raws.sort((a, b) => a.el.id - b.el.id)

  const clusters: Raw[][] = []
  for (const r of raws) {
    const home = clusters.find((c) =>
      c.some((o) => {
        const d = distance(r, o)
        return d <= MERGE_METRES || (!!r.group && r.group === o.group && d <= 700)
      }),
    )
    if (home) home.push(r)
    else clusters.push([r])
  }

  return clusters.map((c): Place => {
    const first = c[0]
    const tags = (k: string) => c.map((r) => r.tags[k]).find(Boolean)
    const equipment = new Set<PlaceEquipment>()
    for (const r of c) for (const e of equipmentOf(r.tags)) equipment.add(e)
    const indoor = c.some((r) => /fitness_centre|sports_centre|sports_hall/.test(r.tags.leisure ?? ''))
    const calisthenics = c.some((r) => /calisthenics|street_workout/.test(r.tags.sport ?? ''))
    const kind: PlaceKind = indoor
      ? c.some((r) => /gymnastics/.test(r.tags.sport ?? '')) && !calisthenics ? 'studio' : 'gym'
      : calisthenics || BODYWEIGHT_RIG.filter((e) => equipment.has(e)).length >= 2
        ? 'calisthenics'
        : 'outdoor'
    // A circuit is named by what its stations share; a single spot by its own name.
    const shared = c.length > 1 ? c.map((r) => r.tags.description).find((d, _i, all) => d && all.filter((x) => x === d).length > 1) : undefined
    const own = c.length === 1 || indoor ? tags('name') : undefined
    const name = (shared ?? own ?? '').trim() || PLACE_KINDS[kind].label
    const amenities: PlaceAmenity[] = []
    if (c.some((r) => yes(r.tags.lit))) amenities.push('lit')
    if (c.some((r) => yes(r.tags.covered))) amenities.push('covered')
    if (c.some((r) => yes(r.tags.drinking_water))) amenities.push('water')
    if (c.some((r) => yes(r.tags.toilets))) amenities.push('toilets')
    if (c.some((r) => yes(r.tags.wheelchair))) amenities.push('accessible')
    const street = tags('addr:street')
    return {
      id: `osm:${first.el.type[0]}${first.el.id}`,
      name,
      kind,
      lat: c.reduce((s, r) => s + r.lat, 0) / c.length,
      lon: c.reduce((s, r) => s + r.lon, 0) / c.length,
      address: street ? [street, tags('addr:housenumber')].filter(Boolean).join(' ') : undefined,
      equipment: [...equipment],
      amenities,
      access: indoor ? 'members' : 'free',
      hours: tags('opening_hours'),
      source: 'osm',
      osm: `${first.el.type}/${first.el.id}`,
      parts: c.length,
      fetchedAt,
    }
  })
}

/**
 * Fold freshly fetched places into the ones already known. A place this device
 * has corrected keeps its corrections, and one that sits where a known place
 * does keeps the known id, so favourites and visits never lose their place.
 */
export function mergePlaces(known: Record<string, Place>, incoming: Place[]): Record<string, Place> {
  const out = { ...known }
  const osm = Object.values(known).filter((p) => p.source === 'osm')
  for (const p of incoming) {
    const same = out[p.id] ?? osm.find((k) => distance(k, p) <= MERGE_METRES)
    if (!same) out[p.id] = p
    else if (same.editedAt) out[same.id] = { ...same, fetchedAt: p.fetchedAt }
    else out[same.id] = { ...p, id: same.id, confirmedAt: same.confirmedAt }
  }
  return out
}

/** How much to believe a place record, in words. */
export function placeTrust(p: Place): { label: string; detail: string } {
  if (p.confirmedAt) return { label: 'Confirmed by you', detail: 'You checked the details while you were here.' }
  if (p.source === 'osm') {
    return {
      label: 'From OpenStreetMap',
      detail: p.equipment.length
        ? 'Mapped by volunteers. Equipment is what they recorded and may be incomplete.'
        : 'Mapped by volunteers, without equipment details. It may be a general outdoor gym.',
    }
  }
  return { label: p.addedBy ? `Added by ${p.addedBy}` : 'Added by an athlete', detail: 'Not yet confirmed by anyone else.' }
}

// ── Training at a place ──────────────────────────────────────────────────

const TO_GEAR: Partial<Record<PlaceEquipment, EquipmentId>> = {
  bar: 'bar', monkey_bars: 'bar', low_bar: 'low_bar', dip_bars: 'dip_bars', rings: 'rings', parallettes: 'parallettes', box: 'box', wall: 'wall',
}
/** Things an athlete carries with them rather than finds at a place. */
const PORTABLE: EquipmentId[] = ['band', 'wheel', 'parallettes', 'rings']

/** Equipment available to this athlete at this place: what is there, the floor, and what they bring. */
export function gearAt(place: Pick<Place, 'equipment'>, owned: readonly EquipmentId[] = []): Set<EquipmentId> {
  const gear = new Set<EquipmentId>(['floor'])
  for (const e of place.equipment) {
    const g = TO_GEAR[e]
    if (g) gear.add(g)
  }
  for (const e of owned) if (PORTABLE.includes(e)) gear.add(e)
  return gear
}

/** An exercise lists alternatives: any one of its equipment options is enough. */
export const doableWith = (ex: Pick<Exercise, 'equipment'>, gear: Set<EquipmentId>) => ex.equipment.some((e) => gear.has(e))

// ── Training together ────────────────────────────────────────────────────

export interface Compatibility {
  /** Aura within a quarter of each other: sessions can be shared without one waiting for the other. */
  level: 'similar' | 'ahead' | 'behind'
  /** Disciplines where both are among their own top two. */
  shared: DisciplineId[]
  /** Where they are clearly stronger than you, and you than them: what each could show the other. */
  theyLead: DisciplineId | null
  youLead: DisciplineId | null
}

type RatingValues = Record<DisciplineId, number>

const topTwo = (r: RatingValues) => [...DISCIPLINE_IDS].filter((d) => r[d] > 0).sort((a, b) => r[b] - r[a]).slice(0, 2)

/**
 * A plain reading of how two athletes might train together. Descriptive only:
 * it ranks nobody and is not a match score.
 */
export function compatibility(mine: RatingValues, myAura: number, theirs: RatingValues, theirAura: number): Compatibility {
  const span = Math.max(myAura, theirAura, 1)
  const level = Math.abs(myAura - theirAura) / span <= 0.25 ? 'similar' : theirAura > myAura ? 'ahead' : 'behind'
  const myTop = topTwo(mine)
  const shared = topTwo(theirs).filter((d) => myTop.includes(d))
  let theyLead: DisciplineId | null = null
  let youLead: DisciplineId | null = null
  let up = 120
  let down = 120
  for (const d of DISCIPLINE_IDS) {
    const diff = theirs[d] - mine[d]
    if (theirs[d] > 0 && diff > up) { up = diff; theyLead = d }
    if (mine[d] > 0 && -diff > down) { down = -diff; youLead = d }
  }
  return { level, shared, theyLead, youLead }
}

// ── Sharing a spot by link ───────────────────────────────────────────────

/**
 * A place, and optionally "I am training here until …", carried in a link.
 * This is the only way presence reaches another device until accounts exist,
 * and everything in it is the sender's own word.
 */
export interface SpotLink {
  place: Pick<Place, 'id' | 'name' | 'kind' | 'lat' | 'lon' | 'equipment' | 'source' | 'osm'>
  who?: { name: string; aura: number; title: string; until: string }
}

const KINDS: PlaceKind[] = ['calisthenics', 'outdoor', 'gym', 'studio', 'other']
const EQUIPMENT_ORDER = Object.keys(PLACE_EQUIPMENT) as PlaceEquipment[]

const b64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)))

export function encodeSpot({ place: p, who }: SpotLink): string {
  const eq = p.equipment.reduce((bits, e) => bits | (1 << EQUIPMENT_ORDER.indexOf(e)), 0)
  const payload: unknown[] = [1, p.id, p.name, KINDS.indexOf(p.kind), Math.round(p.lat * 1e5), Math.round(p.lon * 1e5), eq, p.source === 'osm' ? (p.osm ?? '') : 0]
  if (who) payload.push(who.name, who.aura, who.title, Math.round(new Date(who.until).getTime() / 60000))
  return b64(JSON.stringify(payload))
}

export function decodeSpot(data: string): SpotLink | null {
  try {
    const a = JSON.parse(unb64(data)) as unknown[]
    if (!Array.isArray(a) || a[0] !== 1 || a.length < 8) return null
    const [, id, name, kind, lat, lon, eq, osm] = a as [number, string, string, number, number, number, number, string | 0]
    if (typeof id !== 'string' || typeof name !== 'string' || !KINDS[kind] || !Number.isFinite(lat) || !Number.isFinite(lon)) return null
    if (Math.abs(lat) > 90e5 || Math.abs(lon) > 180e5) return null
    const place: SpotLink['place'] = {
      id: id.slice(0, 60), name: name.slice(0, 80), kind: KINDS[kind], lat: lat / 1e5, lon: lon / 1e5,
      equipment: EQUIPMENT_ORDER.filter((_, i) => (Number(eq) >> i) & 1),
      source: osm === 0 ? 'athlete' : 'osm', osm: osm === 0 ? undefined : String(osm).slice(0, 40) || undefined,
    }
    if (a.length < 12) return { place }
    const [who, aura, title, until] = a.slice(8) as [string, number, string, number]
    if (typeof who !== 'string' || !Number.isFinite(until)) return { place }
    return { place, who: { name: who.slice(0, 40), aura: Math.max(0, Math.round(Number(aura)) || 0), title: String(title).slice(0, 40), until: new Date(until * 60000).toISOString() } }
  } catch {
    return null
  }
}
