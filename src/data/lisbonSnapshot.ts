import type { Place } from '@/domain/types'

/**
 * Real places, not invented ones: a snapshot of OpenStreetMap data for Lisbon,
 * taken 2026-11-14 and converted by `placesFromOsm`. It gives the demo
 * somewhere to stand before the map has loaded anything. The people shown at
 * these places in the demo are sample athletes.
 *
 * © OpenStreetMap contributors, Open Database Licence.
 */
export const LISBON_SNAPSHOT: Place[] = [
  {
    id: "osm:w741783517",
    name: "Calisthenics park",
    kind: "calisthenics",
    lat: 38.7346613,
    lon: -9.1613318,
    equipment: [
      "rings",
      "monkey_bars",
      "dip_bars",
      "box"
    ],
    amenities: [],
    access: "free",
    source: "osm",
    osm: "way/741783517",
    parts: 1,
    fetchedAt: "2026-11-14T12:00:00.000Z"
  },
  {
    id: "osm:w1458303272",
    name: "Calisthenics park",
    kind: "calisthenics",
    lat: 38.7081539,
    lon: -9.2079641,
    equipment: [],
    amenities: [],
    access: "free",
    source: "osm",
    osm: "way/1458303272",
    parts: 1,
    fetchedAt: "2026-11-14T12:00:00.000Z"
  },
  {
    id: "osm:n4919127270",
    name: "Circuito de Manutenção do Calhau",
    kind: "calisthenics",
    lat: 38.73619826666667,
    lon: -9.17610221111111,
    equipment: [
      "bar",
      "dip_bars"
    ],
    amenities: [],
    access: "free",
    hours: "24/7",
    source: "osm",
    osm: "node/4919127270",
    parts: 9,
    fetchedAt: "2026-11-14T12:00:00.000Z"
  },
  {
    id: "osm:n4929303441",
    name: "Circuito de Manutenção do Monte Verde",
    kind: "outdoor",
    lat: 38.72889337058823,
    lon: -9.195613911764706,
    equipment: [
      "stall_bars",
      "dip_bars"
    ],
    amenities: [],
    access: "free",
    hours: "24/7",
    source: "osm",
    osm: "node/4929303441",
    parts: 17,
    fetchedAt: "2026-11-14T12:00:00.000Z"
  },
  {
    id: "osm:n10831779114",
    name: "Outdoor gym",
    kind: "outdoor",
    lat: 38.75034428,
    lon: -9.13965164,
    equipment: [
      "box",
      "dip_bars"
    ],
    amenities: [],
    access: "free",
    source: "osm",
    osm: "node/10831779114",
    parts: 5,
    fetchedAt: "2026-11-14T12:00:00.000Z"
  },
  {
    id: "osm:n10831779151",
    name: "Calisthenics park",
    kind: "calisthenics",
    lat: 38.752030440000006,
    lon: -9.1394522,
    equipment: [
      "monkey_bars",
      "bar",
      "box",
      "stall_bars"
    ],
    amenities: [],
    access: "free",
    source: "osm",
    osm: "node/10831779151",
    parts: 5,
    fetchedAt: "2026-11-14T12:00:00.000Z"
  },
  {
    id: "osm:n12633801841",
    name: "Calisthenics park",
    kind: "calisthenics",
    lat: 38.760388649999996,
    lon: -9.133694899999998,
    equipment: [
      "dip_bars",
      "monkey_bars"
    ],
    amenities: [],
    access: "free",
    source: "osm",
    osm: "node/12633801841",
    parts: 2,
    fetchedAt: "2026-11-14T12:00:00.000Z"
  },
  {
    id: "osm:n12906067846",
    name: "Calisthenics park",
    kind: "calisthenics",
    lat: 38.7209412,
    lon: -9.1395399,
    equipment: [],
    amenities: [],
    access: "free",
    source: "osm",
    osm: "node/12906067846",
    parts: 1,
    fetchedAt: "2026-11-14T12:00:00.000Z"
  }
]
