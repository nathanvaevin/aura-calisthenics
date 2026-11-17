import type { Place } from '@/domain/types'
import { overpassQuery, placesFromOsm, type BBox, type LatLon, type OsmElement } from '@/domain/places'

/**
 * The three things Places asks of the outside world, all without an Aura
 * server: places from OpenStreetMap, a place-name search, and the device's own
 * position. Each is asked for only when the athlete taps something.
 *
 * What leaves the device: the map area being searched, or the typed place name.
 * Never who is asking.
 */

// The public Overpass service, then a mirror. Both are shared, volunteer-run servers:
// answers take from one second to half a minute, and "busy" is a normal reply.
// Fine for development and small numbers; see REGISTER.md I-15.
const MAIN = 'https://overpass-api.de/api/interpreter'
const MIRROR = 'https://overpass.private.coffee/api/interpreter'
/** A server that does not answer must not leave the screen waiting. */
const MAIN_MS = 35000
const MIRROR_MS = 12000

export class PlacesError extends Error {
  constructor(public kind: 'busy' | 'offline' | 'denied' | 'unavailable' | 'unsupported') {
    super(kind)
  }
}

async function ask(url: string, body: URLSearchParams, ms: number, signal?: AbortSignal): Promise<Place[] | 'busy' | 'silent'> {
  const timer = new AbortController()
  const stop = setTimeout(() => timer.abort(), ms)
  const cancel = () => timer.abort()
  signal?.addEventListener('abort', cancel, { once: true })
  try {
    const res = await fetch(url, { method: 'POST', body, signal: timer.signal })
    if (!res.ok) return 'busy'
    const json = (await res.json()) as { elements?: OsmElement[] }
    return placesFromOsm(json.elements ?? [], new Date().toISOString())
  } catch {
    return 'silent'
  } finally {
    clearTimeout(stop)
    signal?.removeEventListener('abort', cancel)
  }
}

export async function fetchPlaces(box: BBox, signal?: AbortSignal): Promise<Place[]> {
  const body = new URLSearchParams({ data: overpassQuery(box) })
  const aborted = () => {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  }
  let got = await ask(MAIN, body, MAIN_MS, signal)
  aborted()
  if (got === 'busy') {
    // "Busy" usually clears within seconds; one more try is worth it. A timeout is not.
    await new Promise((r) => setTimeout(r, 2000))
    aborted()
    got = await ask(MAIN, body, MAIN_MS, signal)
    aborted()
  }
  if (typeof got === 'string') got = await ask(MIRROR, body, MIRROR_MS, signal)
  aborted()
  if (typeof got === 'string') throw new PlacesError(navigator.onLine === false ? 'offline' : 'busy')
  return got
}

export interface AreaHit {
  name: string
  lat: number
  lon: number
  box: BBox
}

/** Look a town, district or address up by name. Called on submit, never as the athlete types. */
export async function searchArea(query: string, signal?: AbortSignal): Promise<AreaHit[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new PlacesError('busy')
    const rows = (await res.json()) as { display_name: string; lat: string; lon: string; boundingbox: [string, string, string, string] }[]
    return rows.map((r) => ({
      name: r.display_name,
      lat: Number(r.lat),
      lon: Number(r.lon),
      box: [Number(r.boundingbox[0]), Number(r.boundingbox[2]), Number(r.boundingbox[1]), Number(r.boundingbox[3])],
    }))
  } catch (e) {
    if (e instanceof PlacesError || (e as Error).name === 'AbortError') throw e
    throw new PlacesError(navigator.onLine === false ? 'offline' : 'busy')
  }
}

/**
 * The position from the last time the athlete asked for it, kept in memory for
 * this visit to the app only. It is never written to storage.
 */
export const fix: { at: LatLon | null } = { at: null }

/** Ask the device where it is, once. No watching, no background use. */
export function locate(): Promise<LatLon> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new PlacesError('unsupported'))
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fix.at = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        resolve(fix.at)
      },
      (err) => reject(new PlacesError(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable')),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  })
}

export const ERROR_COPY: Record<PlacesError['kind'], string> = {
  busy: 'OpenStreetMap’s place service is busy. Places already on this device are still shown; try again in a moment.',
  offline: 'You seem to be offline. Places already on this device are still shown.',
  denied: 'Location is switched off for Aura in this browser. Search for a town instead, or allow location in the browser’s site settings.',
  unavailable: 'This device could not work out where it is. Search for a town instead.',
  unsupported: 'This browser cannot share a location. Search for a town instead.',
}

export const directionsUrl = (p: LatLon) => `https://www.openstreetmap.org/directions?to=${p.lat.toFixed(5)}%2C${p.lon.toFixed(5)}`
export const osmUrl = (osm: string) => `https://www.openstreetmap.org/${osm}`
