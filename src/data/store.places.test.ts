import { beforeEach, describe, expect, it } from 'vitest'
import type { Place } from '@/domain/types'
import { PRESENCE, isLive, liveVisit } from '@/domain/places'
import { makeBlock } from '@/domain/scoring/skills'
import { ME, buildWorld } from './seed'
import { migrateStored, useStore } from './store'

const CALHAU = 'osm:n4919127270'
const NORTH = 'osm:n10831779151'
const RINGS = 'osm:w741783517'
const s = () => useStore.getState()
const mine = () => s().visits.filter((v) => v.athleteId === ME)

beforeEach(() => {
  s().reset()
  s().startDemo()
  s().clearMyVisits()
})

describe('presence in the store', () => {
  it('starts a stay that ends by itself, and remembers the choice', () => {
    s().checkIn(CALHAU, { minutes: 60, audience: 'following', onSite: true })
    const v = mine().at(-1)!
    expect(v).toMatchObject({ placeId: CALHAU, audience: 'following', onSite: true })
    expect(new Date(v.endsAt).getTime() - new Date(v.startedAt).getTime()).toBe(60 * 60000)
    expect(isLive(v, Date.now())).toBe(true)
    expect(isLive(v, Date.now() + 61 * 60000)).toBe(false)
    expect(s().settings).toMatchObject({ audience: 'following', stayMinutes: 60 })
    expect(Object.keys(v).some((k) => /lat|lon|position|coord/i.test(k))).toBe(false)
  })

  it('never lets a stay run past the maximum, at check-in or by extending', () => {
    s().checkIn(CALHAU, { minutes: 9999, audience: 'me', onSite: false })
    const length = () => new Date(mine().at(-1)!.endsAt).getTime() - new Date(mine().at(-1)!.startedAt).getTime()
    expect(length()).toBe(PRESENCE.maxMinutes * 60000)
    s().extendStay(60)
    expect(length()).toBe(PRESENCE.maxMinutes * 60000)
  })

  it('ends the running stay when another begins: nobody is in two places', () => {
    s().checkIn(CALHAU, { minutes: 90, audience: 'me', onSite: false })
    s().checkIn(NORTH, { minutes: 45, audience: 'everyone', onSite: false })
    const now = Date.now()
    expect(mine()).toHaveLength(2)
    expect(mine().filter((v) => isLive(v, now + 1))).toHaveLength(1)
    expect(liveVisit(s().visits, ME, now + 1)?.placeId).toBe(NORTH)
  })

  it('leaves at once, keeps the stay as history, and can forget it', () => {
    s().checkIn(CALHAU, { minutes: 90, audience: 'me', onSite: false })
    s().checkOut()
    expect(liveVisit(s().visits, ME, Date.now() + 1)).toBeUndefined()
    expect(mine()).toHaveLength(1)
    s().removeVisit(mine()[0].id)
    expect(mine()).toHaveLength(0)
  })

  it('cannot forget someone else’s stay', () => {
    const other = s().visits.find((v) => v.athleteId === 'lina')!
    s().removeVisit(other.id)
    expect(s().visits.some((v) => v.id === other.id)).toBe(true)
    s().clearMyVisits()
    expect(s().visits.some((v) => v.athleteId === 'lina')).toBe(true)
  })

  it('tags a finished session with the place, only while checked in', () => {
    const run = () => {
      s().startWorkout({ type: 'library', workoutId: 'x' }, 'Test', [makeBlock('strength', 'pushup', { sets: 1 })])
      s().completeSet(10)
      const id = s().finishWorkout({ claims: [] })!
      return s().logs.find((l) => l.id === id)!
    }
    expect(run().placeId).toBeUndefined()
    s().checkIn(CALHAU, { minutes: 60, audience: 'me', onSite: false })
    expect(run().placeId).toBe(CALHAU)
    s().checkOut()
    expect(run().placeId).toBeUndefined()
  })

  it('changes no rating', () => {
    const before = JSON.stringify(s().evidence)
    s().checkIn(CALHAU, { minutes: 60, audience: 'everyone', onSite: true })
    s().toggleFavourite(NORTH)
    s().setHomePlace(NORTH)
    expect(JSON.stringify(s().evidence)).toBe(before)
  })
})

describe('places in the store', () => {
  it('keeps the home spot out of the favourites', () => {
    s().toggleFavourite(RINGS)
    expect(s().athletes[ME].favouritePlaces).toContain(RINGS)
    s().setHomePlace(RINGS)
    expect(s().athletes[ME]).toMatchObject({ homePlaceId: RINGS })
    expect(s().athletes[ME].favouritePlaces).not.toContain(RINGS)
    s().setHomePlace(null)
    expect(s().athletes[ME].homePlaceId).toBeUndefined()
  })

  it('adds a place under the athlete’s name and only removes places added here', () => {
    const id = s().addPlace({ name: '  Rings by the river ', kind: 'calisthenics', lat: 38.7, lon: -9.2, equipment: ['rings'], amenities: [] })
    expect(s().places[id]).toMatchObject({ name: 'Rings by the river', source: 'athlete', addedBy: 'Alex Rivera', access: 'free' })
    s().setHomePlace(id)
    s().checkIn(id, { minutes: 30, audience: 'me', onSite: false })
    s().removePlace(CALHAU)
    expect(s().places[CALHAU]).toBeTruthy()
    s().removePlace(id)
    expect(s().places[id]).toBeUndefined()
    expect(s().athletes[ME].homePlaceId).toBeUndefined()
    expect(mine()).toHaveLength(0)
  })

  it('confirms details only during a stay at that place', () => {
    s().confirmPlace(CALHAU)
    expect(s().places[CALHAU].confirmedAt).toBeUndefined()
    s().checkIn(NORTH, { minutes: 30, audience: 'me', onSite: true })
    s().confirmPlace(CALHAU)
    expect(s().places[CALHAU].confirmedAt).toBeUndefined()
    s().confirmPlace(NORTH)
    expect(s().places[NORTH].confirmedAt).toBeTruthy()
  })

  it('keeps corrections when the place is loaded again', () => {
    s().editPlace(CALHAU, { equipment: ['bar', 'dip_bars', 'rings'], name: ' ' })
    const fresh: Place = { ...buildWorld(new Date(), true).places[CALHAU], fetchedAt: 'later' }
    s().mergePlaces([fresh])
    expect(s().places[CALHAU]).toMatchObject({ equipment: ['bar', 'dip_bars', 'rings'], name: fresh.name, fetchedAt: 'later' })
  })

  it('sets privacy one part at a time', () => {
    s().setPrivacy({ visits: 'me' })
    expect(s().athletes[ME].privacy).toEqual({ origin: 'everyone', base: 'everyone', places: 'following', visits: 'me', style: 'everyone', ratings: 'everyone', interests: 'everyone' })
  })
})

describe('stored worlds from before places existed', () => {
  it('gain the sample community without touching the owner’s data', () => {
    const migrate = migrateStored
    const world = buildWorld(new Date(), true)
    const old = { meId: ME, athletes: Object.fromEntries(Object.entries(world.athletes).map(([id, a]) => [id, { id: a.id, name: id === ME ? 'Renamed' : a.name, handle: a.handle, bio: '', city: a.city, roles: a.roles, goals: a.goals, joinedAt: a.joinedAt, weeklyTarget: 3, equipment: [] }])), evidence: world.evidence }
    const next = migrate(old, 1) as ReturnType<typeof useStore.getState>
    expect(next.athletes[ME].name).toBe('Renamed')
    expect(next.athletes[ME].homePlaceId).toBe(CALHAU)
    expect(Object.keys(next.places).length).toBeGreaterThan(5)
    expect(next.visits.length).toBeGreaterThan(10)
    expect(next.evidence).toBe(world.evidence)
    // Version 3 added accounts: a stored world learns whether it is the sample one, and that nothing is synced.
    expect(next).toMatchObject({ demo: true, cloudUid: null, cloudShadow: {} })
    expect(migrate(next, 2)).toMatchObject({ demo: true, cloudUid: null })
    // Version 4 added admin-managed content, and made the sample athlete an admin.
    expect(next).toMatchObject({ demos: [], workoutVideos: [], auraSettings: { defaultTheme: 'cosmic' }, contentDirty: [] })
    expect(next.athletes[ME].roles).toContain('admin')
    const own = migrate({ ...next, demo: false, athletes: { ...next.athletes, [ME]: { ...next.athletes[ME], roles: ['athlete'] } } }, 3) as typeof next
    expect(own.athletes[ME].roles).toEqual(['athlete'])
    expect(migrate(next, 4)).toBe(next)
  })
})
