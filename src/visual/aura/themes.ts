/**
 * Aura themes.
 *
 * A theme is data: a palette, a rhythm, and a level for each effect
 * component. Nothing about a theme lives in the characters or the movements,
 * so a new theme (for an event, a challenge) is a new entry here and nothing
 * else. Intensity is not part of a theme: every theme runs from 0 to 1.
 */

export const COMPONENTS = ['shell', 'halo', 'rays', 'ribbons', 'motes', 'streams', 'rings', 'sparks', 'arcs'] as const
export type ComponentId = (typeof COMPONENTS)[number]

export const COMPONENT_LABEL: Record<ComponentId, string> = {
  shell: 'Glowing outline', halo: 'Energy field', rays: 'Light rays', ribbons: 'Light ribbons', motes: 'Particles',
  streams: 'Rising streams', rings: 'Ground rings', sparks: 'Sparks', arcs: 'Lightning',
}

export interface AuraTheme {
  id: string
  name: string
  blurb: string
  /** Up to six colours; the first is the body's own light. */
  palette: string[]
  /** Breaths per second, and how fast everything flows. */
  breath: number
  flow: number
  /** How strongly the body itself lights up at full intensity. */
  body: number
  /** Level of each component (0 leaves it out) and the intensity at which it starts to show. */
  shell: { level: number; from: number; reach: number; flame: number }
  halo: { level: number; from: number; size: number }
  rays: { level: number; from: number; count: number; sharp: number }
  ribbons: { level: number; from: number; count: number; turns: number; spread: number; width: number; speed: number; ripple: number }
  motes: { level: number; from: number; count: number; rise: number; size: number; swirl: number; twinkle: number }
  streams: { level: number; from: number; count: number; height: number }
  rings: { level: number; from: number; dashes: number; spin: number }
  sparks: { level: number; from: number; count: number; speed: number; crackle: number }
  arcs: { level: number; from: number; count: number }
}

const base: Omit<AuraTheme, 'id' | 'name' | 'blurb' | 'palette'> = {
  breath: 0.22, flow: 1, body: 0.7,
  shell: { level: 1, from: 0.03, reach: 1, flame: 0.25 },
  halo: { level: 1, from: 0.05, size: 1 },
  rays: { level: 0.6, from: 0.55, count: 9, sharp: 3 },
  ribbons: { level: 1, from: 0.2, count: 9, turns: 0.75, spread: 1, width: 0.15, speed: 1, ripple: 0.5 },
  motes: { level: 1, from: 0.08, count: 150, rise: 0.22, size: 1, swirl: 1, twinkle: 0.5 },
  streams: { level: 0.8, from: 0.4, count: 16, height: 1 },
  rings: { level: 1, from: 0.25, dashes: 36, spin: 0.25 },
  sparks: { level: 1, from: 0.7, count: 90, speed: 1, crackle: 0 },
  arcs: { level: 0, from: 1, count: 0 },
}

type Patch = { [K in keyof typeof base]?: (typeof base)[K] extends object ? Partial<(typeof base)[K]> : (typeof base)[K] }

function theme(id: string, name: string, blurb: string, palette: string[], patch: Patch = {}): AuraTheme {
  const out = { id, name, blurb, palette, ...structuredClone(base) } as AuraTheme
  for (const [k, v] of Object.entries(patch)) {
    const key = k as keyof typeof base
    if (v && typeof v === 'object') Object.assign(out[key] as object, v)
    else (out as unknown as Record<string, unknown>)[key] = v
  }
  return out
}

export const THEMES: AuraTheme[] = [
  theme('cosmic', 'Cosmic', 'Flowing violet, blue, pink and orange. Expansive and atmospheric.', ['#9a6bff', '#3f9dff', '#ff5fcf', '#ff9a45', '#6a5cff']),
  theme('electric', 'Electric', 'Sharp arcs, sparks and fast pulses.', ['#c9f6ff', '#49c6ff', '#6f7dff', '#ffffff'], {
    breath: 0.55, flow: 2.2, body: 0.85,
    shell: { level: 1, reach: 0.7, flame: 0.05 },
    halo: { level: 0.55, size: 0.8 },
    rays: { level: 0.35, from: 0.7, count: 14, sharp: 7 },
    ribbons: { level: 0.7, count: 5, turns: 1.7, width: 0.028, speed: 2.6, spread: 0.8, ripple: 1.6 },
    motes: { level: 0.6, count: 90, rise: 0.6, size: 0.55, swirl: 2.4, twinkle: 1 },
    streams: { level: 0.4, count: 10, height: 0.7 },
    rings: { dashes: 64, spin: 1.4 },
    sparks: { count: 130, speed: 1.6, crackle: 1 },
    arcs: { level: 1, from: 0.12, count: 8 },
  }),
  theme('solar', 'Solar', 'Warm gold and orange. Radiant, bright, powerful.', ['#ffd66b', '#ff9b2f', '#fff1c2', '#ff6a21'], {
    breath: 0.18, flow: 0.85, body: 0.9,
    shell: { level: 1, reach: 1.5, flame: 0.75 },
    halo: { level: 1.25, size: 1.2 },
    rays: { level: 1.15, from: 0.18, count: 12, sharp: 2.2 },
    ribbons: { level: 0.5, count: 4, turns: 0.45, width: 0.16, speed: 0.6, ripple: 0.3 },
    motes: { level: 1, count: 170, rise: 0.5, size: 0.9, swirl: 0.4, twinkle: 0.9 },
    streams: { level: 0.5, count: 10 },
    rings: { dashes: 0, spin: 0.1 },
  }),
  theme('ethereal', 'Ethereal', 'Soft flowing light and slow, elegant particles.', ['#c8f4ec', '#d9c9ff', '#ffffff', '#93d6ff'], {
    breath: 0.12, flow: 0.4, body: 0.5,
    shell: { level: 0.7, reach: 1.2, flame: 0.1 },
    halo: { level: 0.9, size: 1.25 },
    rays: { level: 0, from: 1 },
    ribbons: { level: 0.75, count: 5, turns: 0.5, width: 0.22, speed: 0.4, spread: 1.15, ripple: 0.25 },
    motes: { level: 1.1, count: 240, rise: 0.1, size: 1.25, swirl: 0.5, twinkle: 0.7 },
    streams: { level: 0, from: 1 },
    rings: { level: 0.5, dashes: 0, spin: 0.05 },
    sparks: { level: 0.35, count: 50, speed: 0.5 },
  }),
  theme('primal', 'Primal', 'Raw, organic energy with heavy pulses.', ['#ff3d4f', '#ff7b2b', '#b5122f', '#ffc56c'], {
    breath: 0.32, flow: 1.4, body: 0.8,
    shell: { level: 1.3, reach: 2.1, flame: 1 },
    halo: { level: 1, size: 0.95 },
    rays: { level: 0, from: 1 },
    ribbons: { level: 0.75, count: 7, turns: 0.6, width: 0.07, speed: 1.6, spread: 0.85, ripple: 1.4 },
    motes: { level: 1, count: 160, rise: 0.65, size: 0.8, swirl: 0.6, twinkle: 1 },
    streams: { level: 1.1, count: 22, height: 1.3 },
    rings: { level: 1.2, dashes: 0, spin: 0.2 },
    sparks: { count: 120, speed: 1.2, crackle: 0.25 },
  }),
  theme('signature', 'Signature', "Aura's own six colours, one for each discipline.", ['#f2c46b', '#78aeff', '#ff8463', '#b79dff', '#b5db68', '#56d6bc'], {
    body: 0.6,
    ribbons: { count: 6, turns: 0.9, width: 0.085 },
    rays: { level: 0.4 },
    rings: { dashes: 6, spin: 0.35 },
  }),
  theme('lunar', 'Lunar', 'Silver and white: a quiet, precise light.', ['#ffffff', '#cfd8ec', '#8f9ab5', '#e9eeff'], {
    breath: 0.16, flow: 0.7, body: 0.65,
    shell: { level: 1.1, reach: 0.6, flame: 0 },
    halo: { level: 0.6, size: 0.9 },
    rays: { level: 0.3, from: 0.7, count: 16, sharp: 8 },
    ribbons: { level: 0.7, count: 6, turns: 1.1, width: 0.022, speed: 0.8, ripple: 0.2 },
    motes: { level: 0.9, count: 200, rise: 0.12, size: 0.5, swirl: 0.8, twinkle: 0.9 },
    streams: { level: 0.3, count: 8 },
    rings: { dashes: 90, spin: 0.15 },
    sparks: { count: 60, speed: 0.8 },
  }),
]

export const themeById = Object.fromEntries(THEMES.map((t) => [t.id, t])) as Record<string, AuraTheme>

/** What an administrator can change about a theme without touching it. */
export interface ThemeTuning { intensity?: number; pulse?: number; density?: number; off?: string[] }
