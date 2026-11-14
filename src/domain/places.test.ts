import { describe, expect, it } from 'vitest'
import type { Athlete, Place, Visit } from './types'
import {
  PRESENCE, canSee, compatibility, decodeSpot, distance, doableWith, encodeSpot, gearAt, historyAt, identityFor, isLive, mergePlaces,
  overpassQuery, peopleAt, placesFromOsm, privacyOf, relationOf, roleOf, visitVisible, type OsmElement,
} from './places'
import { exerciseById } from './catalog'
import { buildWorld, ME } from '@/data/seed'

const NOW = new Date('2026-11-14T17:00:00.000Z').getTime()
const MIN = 60000
const DAY = 86400000
const iso = (t: number) => new Date(t).toISOString()

const athlete = (id: string, over: Partial<Athlete> = {}): Athlete => ({
  id, name: id, handle: id, bio: '', roles: ['athlete'], goals: [], joinedAt: iso(NOW - 100 * DAY), weeklyTarget: 3, equipment: [], ...over,
})
let seq = 0
const stay = (athleteId: string, placeId: string, startAgoMin: number, minutes: number, over: Partial<Visit> = {}): Visit => ({
  id: `v${seq++}`, athleteId, placeId, startedAt: iso(NOW - startAgoMin * MIN), endsAt: iso(NOW - startAgoMin * MIN + minutes * MIN), audience: 'everyone', onSite: true, ...over,
})

describe('privacy', () => {
  it('opens declared facts and closes behaviour by default', () => {
    expect(privacyOf({})).toEqual({ origin: 'everyone', base: 'everyone', places: 'following', visits: 'me' })
  })

  it('treats "people I follow" as the owner\'s list, not their followers', () => {
    expect(relationOf('lina', 'me', ['me'])).toBe('followed')
    expect(relationOf('lina', 'me', [])).toBe('stranger')
    expect(relationOf('lina', 'lina', [])).toBe('self')
    expect(relationOf('lina', null, ['me'])).toBe('stranger')
    expect(canSee('me', 'followed')).toBe(false)
    expect(canSee('following', 'stranger')).toBe(false)
    expect(canSee('following', 'followed')).toBe(true)
    expect(canSee('me', 'self')).toBe(true)
  })

  it('removes what a viewer may not see instead of masking it', () => {
    const a = athlete('a', { from: 'Porto', city: 'Lisbon', homePlaceId: 'p1', favouritePlaces: ['p2'], environments: ['outdoor'], privacy: { origin: 'me', base: 'everyone', places: 'following', visits: 'me' } })
    expect(identityFor(a, 'stranger')).toEqual({ from: undefined, city: 'Lisbon', environments: [], homePlaceId: undefined, favouritePlaces: [], openToTrain: false })
    expect(identityFor(a, 'followed').homePlaceId).toBe('p1')
    expect(identityFor(a, 'followed').from).toBeUndefined()
    expect(identityFor(a, 'self').from).toBe('Porto')
  })
})

describe('presence', () => {
  it('is live only between start and end', () => {
    const v = stay('a', 'p', 30, 60)
    expect(isLive(v, NOW)).toBe(true)
    expect(isLive(v, NOW + 30 * MIN)).toBe(false)
    expect(isLive(v, NOW - 31 * MIN)).toBe(false)
  })

  it('never offers an open-ended stay', () => {
    expect(Math.max(...PRESENCE.durations)).toBeLessThanOrEqual(PRESENCE.maxMinutes)
  })

  it('hides a private stay from everyone but its owner, live or not', () => {
    const owner = athlete('a', { privacy: { origin: 'everyone', base: 'everyone', places: 'everyone', visits: 'everyone' } })
    const v = stay('a', 'p', 10, 60, { audience: 'me' })
    expect(visitVisible(v, owner, 'stranger', NOW)).toBe(false)
    expect(visitVisible(v, owner, 'followed', NOW)).toBe(false)
    expect(visitVisible(v, owner, 'self', NOW)).toBe(true)
  })

  it('shows a live stay to its audience but keeps the history closed unless visits are shared', () => {
    const owner = athlete('a') // visits: me
    const v = stay('a', 'p', 10, 60)
    expect(visitVisible(v, owner, 'stranger', NOW)).toBe(true)
    expect(visitVisible(v, owner, 'stranger', NOW + 2 * 60 * MIN)).toBe(false)
  })

  it('needs enough stays across enough weeks to call someone a regular', () => {
    const fourInOneWeek = [0, 1, 2, 3].map((d) => stay('a', 'p', d * 24 * 60 + 200, 60))
    expect(historyAt(fourInOneWeek, NOW).regular).toBe(false)
    const spread = [2, 9, 16, 23].map((d) => stay('a', 'p', d * 24 * 60, 60))
    expect(historyAt(spread, NOW)).toMatchObject({ regular: true, recent: true, count: 4 })
    const old = [60, 67, 74, 81].map((d) => stay('a', 'p', d * 24 * 60, 60))
    expect(historyAt(old, NOW)).toMatchObject({ regular: false, recent: false, count: 0 })
  })

  it('does not count a running stay as a recent one', () => {
    expect(historyAt([stay('a', 'p', 10, 60)], NOW).recent).toBe(false)
  })

  it('keeps now, regular, recent and favourite apart', () => {
    const athletes = {
      now: athlete('now', { privacy: { origin: 'everyone', base: 'everyone', places: 'everyone', visits: 'everyone' } }),
      reg: athlete('reg', { privacy: { origin: 'everyone', base: 'everyone', places: 'everyone', visits: 'everyone' } }),
      rec: athlete('rec', { privacy: { origin: 'everyone', base: 'everyone', places: 'everyone', visits: 'everyone' } }),
      fav: athlete('fav', { favouritePlaces: ['p'], privacy: { origin: 'everyone', base: 'everyone', places: 'everyone', visits: 'everyone' } }),
      hidden: athlete('hidden', { homePlaceId: 'p' }),
    }
    const visits = [
      stay('now', 'p', 5, 60, { onSite: false }),
      ...[2, 9, 16, 23].map((d) => stay('reg', 'p', d * 24 * 60, 60)),
      stay('rec', 'p', 3 * 24 * 60, 60),
      ...[1, 8, 15, 22].map((d) => stay('hidden', 'p', d * 24 * 60, 60, { audience: 'me' })),
      stay('now', 'elsewhere', 5000, 60),
    ]
    const people = peopleAt('p', athletes, visits, { id: 'viewer', followedBy: () => [] }, NOW)
    const roles = Object.fromEntries(people.map((p) => [p.athleteId, roleOf(p)]))
    expect(roles).toEqual({ now: 'now', reg: 'regular', rec: 'recent', fav: 'favourite' })
    expect(people.find((p) => p.athleteId === 'now')).toMatchObject({ onSite: false, regular: false, favourite: false })
    expect(people.find((p) => p.athleteId === 'fav')).toMatchObject({ now: false, recent: false, regular: false })
    // The owner still sees their own history.
    const own = peopleAt('p', athletes, visits, { id: 'hidden', followedBy: () => [] }, NOW)
    expect(own.find((p) => p.athleteId === 'hidden')).toMatchObject({ regular: true, home: true })
  })

  it('follows the privacy choices of the sample athletes in the demo', () => {
    const now = new Date(NOW)
    const w = buildWorld(now, true)
    const viewer = { id: ME, followedBy: (id: string) => (id === ME ? w.following : (w.follows[id] ?? [])) }
    const calhau = peopleAt('osm:n4919127270', w.athletes, w.visits, viewer, NOW)
    const by = Object.fromEntries(calhau.map((p) => [p.athleteId, p]))
    expect(by.ben).toBeUndefined() // trains there weekly, shows nobody
    expect(by.priya).toMatchObject({ now: true, onSite: false }) // follows the viewer
    expect(by.tomas).toMatchObject({ favourite: true, now: false, regular: false, recent: false })
    expect(by[ME]).toMatchObject({ home: true, regular: true })
    // A stranger sees neither Priya's followers-only stay nor the viewer's own history.
    const stranger = peopleAt('osm:n4919127270', w.athletes, w.visits, { id: 'nobody', followedBy: viewer.followedBy }, NOW)
    expect(stranger.map((p) => p.athleteId).sort()).toEqual(['lina', 'tomas'])
    // Once the stays run out nobody is "now" any more.
    const later = peopleAt('osm:n4919127270', w.athletes, w.visits, viewer, NOW + 3 * 3600000)
    expect(later.some((p) => p.now)).toBe(false)
    for (const v of w.visits) expect(w.places[v.placeId], v.placeId).toBeTruthy()
  })
})

describe('places', () => {
  const el = (id: number, lat: number, lon: number, tags: Record<string, string>): OsmElement => ({ type: 'node', id, lat, lon, tags })

  it('merges a park mapped bar by bar into one place and reads only recorded equipment', () => {
    const places = placesFromOsm(
      [
        el(2, 38.7362, -9.1765, { leisure: 'fitness_station', fitness_station: 'parallel_bars', lit: 'yes' }),
        el(1, 38.73621, -9.17655, { leisure: 'fitness_station', fitness_station: 'horizontal_bar;rings' }),
        el(3, 38.76, -9.1, { leisure: 'fitness_station', name: 'Bicicleta' }),
        el(4, 38.7, -9.2, { leisure: 'fitness_station', access: 'private' }),
        { type: 'way', id: 9, center: { lat: 38.71, lon: -9.15 }, tags: { leisure: 'fitness_centre', sport: 'calisthenics', name: 'Bar Lab' } },
      ],
      iso(NOW),
    )
    expect(places).toHaveLength(3)
    const park = places.find((p) => p.id === 'osm:n1')!
    expect(park).toMatchObject({ kind: 'calisthenics', parts: 2, source: 'osm', access: 'free', amenities: ['lit'] })
    expect([...park.equipment].sort()).toEqual(['bar', 'dip_bars', 'rings'])
    expect(places.find((p) => p.id === 'osm:n3')).toMatchObject({ kind: 'outdoor', equipment: [], name: 'Bicicleta' })
    expect(places.find((p) => p.id === 'osm:w9')).toMatchObject({ kind: 'gym', name: 'Bar Lab', access: 'members' })
  })

  it('keeps ids and local corrections when a place is fetched again', () => {
    const base: Place = { id: 'osm:n1', name: 'Park', kind: 'calisthenics', lat: 38.7, lon: -9.1, equipment: ['bar'], amenities: [], source: 'osm', fetchedAt: 'a' }
    const again: Place = { ...base, id: 'osm:n7', lat: 38.70002, equipment: ['bar', 'rings'], fetchedAt: 'b' }
    expect(mergePlaces({ [base.id]: base }, [again])).toEqual({ 'osm:n1': { ...again, id: 'osm:n1', confirmedAt: undefined } })
    const edited = { ...base, equipment: ['bar', 'dip_bars'] as Place['equipment'], editedAt: 'x' }
    expect(mergePlaces({ [base.id]: edited }, [again])['osm:n1']).toMatchObject({ equipment: ['bar', 'dip_bars'], fetchedAt: 'b' })
    const far: Place = { ...base, id: 'osm:n8', lat: 38.8 }
    expect(Object.keys(mergePlaces({ [base.id]: base }, [far]))).toHaveLength(2)
  })

  it('asks OpenStreetMap only for the box it is given', () => {
    const q = overpassQuery([38.69, -9.23, 38.8, -9.09])
    expect(q).toContain('(38.69000,-9.23000,38.80000,-9.09000)')
    expect(q).toContain('fitness_station')
  })

  it('measures distance', () => {
    expect(distance({ lat: 38.7362, lon: -9.1765 }, { lat: 38.7362, lon: -9.1765 })).toBe(0)
    const d = distance({ lat: 38.7223, lon: -9.1393 }, { lat: 41.1579, lon: -8.6291 }) // Lisbon to Porto
    expect(d).toBeGreaterThan(270000)
    expect(d).toBeLessThan(280000)
  })

  it('works out what can be trained at a place', () => {
    const gear = gearAt({ equipment: ['monkey_bars', 'dip_bars'] }, ['rings', 'bar', 'wall'])
    expect([...gear].sort()).toEqual(['bar', 'dip_bars', 'floor', 'rings'])
    expect(doableWith(exerciseById['pull-up'], gear)).toBe(true)
    expect(doableWith(exerciseById['pushup'], gearAt({ equipment: [] }))).toBe(true)
    expect(doableWith(exerciseById['pull-up'], gearAt({ equipment: [] }))).toBe(false)
  })
})

describe('training together', () => {
  const r = (handstand: number, pull: number, push: number, core: number, legs: number, mobility: number) => ({ handstand, pull, push, core, legs, mobility })

  it('reads level and what each could show the other', () => {
    const c = compatibility(r(300, 450, 420, 380, 300, 250), 3800, r(620, 400, 430, 400, 150, 300), 4600)
    expect(c).toMatchObject({ level: 'similar', theyLead: 'handstand', youLead: 'legs' })
    expect(c.shared).toEqual(['push'])
    expect(compatibility(r(300, 300, 300, 300, 300, 300), 3000, r(700, 700, 700, 700, 700, 700), 7000).level).toBe('ahead')
    expect(compatibility(r(500, 600, 0, 0, 0, 0), 4000, r(480, 620, 0, 0, 0, 0), 4000)).toMatchObject({ shared: ['pull', 'handstand'], theyLead: null, youLead: null })
  })
})

describe('spot links', () => {
  const place: Place = { id: 'osm:n4919127270', name: 'Circuito de Manutenção do Calhau', kind: 'calisthenics', lat: 38.7362, lon: -9.1761, equipment: ['bar', 'dip_bars'], amenities: [], source: 'osm', osm: 'node/4919127270' }

  it('carries a place, and a stay with its end, through a link', () => {
    const bare = decodeSpot(encodeSpot({ place }))!
    expect(bare.who).toBeUndefined()
    expect(bare.place).toMatchObject({ id: place.id, name: place.name, kind: 'calisthenics', equipment: ['bar', 'dip_bars'], source: 'osm', osm: 'node/4919127270' })
    expect(bare.place.lat).toBeCloseTo(place.lat, 4)
    const until = iso(NOW + 90 * MIN)
    const data = encodeSpot({ place, who: { name: 'Alex Rivera', aura: 4210, title: 'Kindled Balancer', until } })
    expect(data.length).toBeLessThan(300)
    expect(decodeSpot(data)!.who).toEqual({ name: 'Alex Rivera', aura: 4210, title: 'Kindled Balancer', until })
  })

  it('rejects anything malformed', () => {
    expect(decodeSpot('nonsense')).toBeNull()
    expect(decodeSpot(btoa('[2,"x"]'))).toBeNull()
    expect(decodeSpot(btoa(JSON.stringify([1, 'id', 'n', 0, 999e5, 0, 0, 0])))).toBeNull()
  })
})
