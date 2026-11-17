import { useEffect, useRef } from 'react'
import { Map as GlMap, NavigationControl, setWorkerUrl, type GeoJSONSource } from 'maplibre-gl'
// The map's tile worker, bundled with the app so no script is fetched from elsewhere.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { PlaceKind } from '@/domain/types'
import type { BBox, LatLon } from '@/domain/places'

export interface MapPlace {
  id: string
  lat: number
  lon: number
  kind: PlaceKind
  /** People visible to this viewer who are checked in right now. */
  live: number
  saved: boolean
}

export interface MapViewState {
  lat: number
  lon: number
  zoom: number
  bounds: BBox
}

interface Props {
  places: MapPlace[]
  /** Starting position. Later moves belong to the user; use `target` to move the map from outside. */
  initial: { lat: number; lon: number; zoom: number }
  /** Change `key` to send the map somewhere. */
  target?: { lat: number; lon: number; zoom?: number; key: number } | null
  selected?: string | null
  onSelect?: (id: string | null) => void
  onMove?: (view: MapViewState) => void
  me?: LatLon | null
  theme: 'dark' | 'light'
  interactive?: boolean
  className?: string
}

// Vector tiles and styles from OpenFreeMap: no key, no account. See REGISTER.md I-07.
const STYLE = { dark: 'https://tiles.openfreemap.org/styles/dark', light: 'https://tiles.openfreemap.org/styles/positron' }

setWorkerUrl(workerUrl)

const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const collection = (places: MapPlace[], selected?: string | null) => ({
  type: 'FeatureCollection' as const,
  features: places.map((p) => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: [p.lon, p.lat] },
    properties: { id: p.id, park: p.kind === 'calisthenics' ? 1 : 0, live: p.live, saved: p.saved ? 1 : 0, selected: p.id === selected ? 1 : 0 },
  })),
})

const point = (me?: LatLon | null) => ({
  type: 'FeatureCollection' as const,
  features: me ? [{ type: 'Feature' as const, geometry: { type: 'Point' as const, coordinates: [me.lon, me.lat] }, properties: {} }] : [],
})

/** The map. Places are drawn as data layers, so a city's worth of them stays smooth on a phone. */
export default function MapView({ places, initial, target, selected, onSelect, onMove, me, theme, interactive = true, className }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<GlMap | null>(null)
  const latest = useRef({ places, selected, me, onSelect, onMove })
  latest.current = { places, selected, me, onSelect, onMove }

  useEffect(() => {
    if (!el.current) return
    const m = new GlMap({
      container: el.current,
      style: STYLE[theme],
      center: [initial.lon, initial.lat],
      zoom: initial.zoom,
      interactive,
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
      maxPitch: 0,
    })
    map.current = m
    m.touchZoomRotate.disableRotation()
    if (interactive) m.addControl(new NavigationControl({ showCompass: false }), 'top-right')

    const draw = () => {
      if (m.getSource('places')) return
      const ink = token('--text')
      const bg = token('--bg')
      const accent = token('--accent')
      m.addSource('places', { type: 'geojson', data: collection(latest.current.places, latest.current.selected) })
      m.addSource('me', { type: 'geojson', data: point(latest.current.me) })
      m.addLayer({
        id: 'place-live', type: 'circle', source: 'places', filter: ['>', ['get', 'live'], 0],
        paint: { 'circle-radius': 17, 'circle-color': accent, 'circle-opacity': 0.28, 'circle-stroke-color': accent, 'circle-stroke-width': 1, 'circle-stroke-opacity': 0.7 },
      })
      m.addLayer({
        id: 'place-dot', type: 'circle', source: 'places',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'selected'], 1], 9, ['==', ['get', 'park'], 1], 6.5, 4.5],
          'circle-color': ['case', ['==', ['get', 'park'], 1], accent, ink],
          'circle-opacity': ['case', ['==', ['get', 'park'], 1], 1, 0.62],
          'circle-stroke-color': ['case', ['any', ['==', ['get', 'saved'], 1], ['==', ['get', 'selected'], 1]], ink, bg],
          'circle-stroke-width': ['case', ['==', ['get', 'selected'], 1], 3, ['==', ['get', 'saved'], 1], 2.5, 1.5],
        },
      })
      m.addLayer({ id: 'me-halo', type: 'circle', source: 'me', paint: { 'circle-radius': 14, 'circle-color': '#4c9aff', 'circle-opacity': 0.22 } })
      m.addLayer({ id: 'me-dot', type: 'circle', source: 'me', paint: { 'circle-radius': 5.5, 'circle-color': '#4c9aff', 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 } })
    }
    m.on('style.load', draw)

    const report = () => {
      const c = m.getCenter()
      const b = m.getBounds()
      latest.current.onMove?.({ lat: c.lat, lon: c.lng, zoom: m.getZoom(), bounds: [b.getSouth(), b.getWest(), b.getNorth(), b.getEast()] })
    }
    m.on('moveend', report)
    m.on('load', report)

    // A finger is wider than a dot: take the nearest place within reach of the tap.
    m.on('click', (e) => {
      if (!m.getLayer('place-dot')) return
      const r = 16
      const hits = m.queryRenderedFeatures([[e.point.x - r, e.point.y - r], [e.point.x + r, e.point.y + r]], { layers: ['place-dot'] })
      latest.current.onSelect?.(hits.length ? String(hits[0].properties.id) : null)
    })
    m.on('mousemove', (e) => {
      if (!m.getLayer('place-dot')) return
      m.getCanvas().style.cursor = m.queryRenderedFeatures(e.point, { layers: ['place-dot'] }).length ? 'pointer' : ''
    })

    return () => {
      map.current = null
      m.remove()
    }
    // The map is created once; everything that changes is pushed in by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    map.current?.setStyle(STYLE[theme])
  }, [theme])

  useEffect(() => {
    ;(map.current?.getSource('places') as GeoJSONSource | undefined)?.setData(collection(places, selected))
  }, [places, selected])

  useEffect(() => {
    ;(map.current?.getSource('me') as GeoJSONSource | undefined)?.setData(point(me))
  }, [me])

  useEffect(() => {
    if (!target || !map.current) return
    map.current.flyTo({ center: [target.lon, target.lat], zoom: target.zoom ?? Math.max(map.current.getZoom(), 13), duration: 900, essential: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.key])

  return <div ref={el} className={className} />
}
