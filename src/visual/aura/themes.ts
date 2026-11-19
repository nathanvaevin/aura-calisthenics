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

/**
 * The sign of an activation: what stands behind the body when its Aura is let
 * go, one for each Aura, after its name. At rest an Aura is a glow; this is
 * the moment it shows what it is.
 */
export const SIGNS = ['none', 'galaxy', 'bolt', 'sun', 'aurora', 'pillar', 'wheel', 'eclipse', 'nimbus', 'sphere', 'pulse', 'ripple', 'steam', 'strike', 'blaze'] as const
export type SignId = (typeof SIGNS)[number]

export interface Activation {
  sign: SignId
  /** A second manner of the same sign, 0 to 1: the pillar as an eruption, the pulse in heavy beats, the ripple with a hard edge. */
  manner: number
  /** Which of the loose components join the burst. Nothing that is not named here shows at all: at rest an Aura is its outline and its field. */
  with: ComponentId[]
}

export interface AuraTheme {
  id: string
  name: string
  blurb: string
  /** The visual universe it belongs to (src/theme/themes.ts). Unset: the original Aura. */
  universe?: 'power' | 'iron'
  /** Up to six colours; the first is the body's own light. */
  palette: string[]
  /** Breaths per second, and how fast everything flows. */
  breath: number
  flow: number
  /** How strongly the body itself lights up at full intensity. */
  body: number
  /** The body itself becomes a night sky as the Aura rises: cloud in the second and fourth colours, stars in it. 0 to 1; unset: never. */
  cosmos?: number
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
  /** What its activation looks like. */
  act: Activation
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
  act: { sign: 'none', manner: 0, with: ['rays', 'motes', 'rings', 'sparks'] },
}

type Patch = { [K in keyof typeof base]?: (typeof base)[K] extends object ? Partial<(typeof base)[K]> : (typeof base)[K] }

function theme(id: string, name: string, blurb: string, palette: string[], patch: Patch = {}): AuraTheme {
  const out = { id, name, blurb, palette, ...structuredClone(base) } as AuraTheme
  for (const [k, v] of Object.entries(patch)) {
    const key = k as keyof typeof base
    if (v && typeof v === 'object') Object.assign(out[key] as object, structuredClone(v))
    else (out as unknown as Record<string, unknown>)[key] = v
  }
  return out
}

export const THEMES: AuraTheme[] = [
  theme('cosmic', 'Cosmic', 'Flowing violet, blue, pink and orange. Expansive and atmospheric.', ['#9a6bff', '#3f9dff', '#ff5fcf', '#ff9a45', '#6a5cff'], {
    act: { sign: 'galaxy', manner: 0, with: ['motes'] },
  }),
  theme('electric', 'Electric', 'Sharp arcs, sparks and fast pulses.', ['#c9f6ff', '#49c6ff', '#6f7dff', '#ffffff'], {
    act: { sign: 'bolt', manner: 0, with: ['arcs', 'sparks', 'rings'] },
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
    act: { sign: 'sun', manner: 0, with: ['rays', 'motes'] },
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
    act: { sign: 'aurora', manner: 0, with: ['motes'] },
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
    act: { sign: 'pillar', manner: 1, with: ['streams', 'sparks', 'rings'] },
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
    act: { sign: 'wheel', manner: 0, with: ['motes', 'rings'] },
    body: 0.6,
    ribbons: { count: 6, turns: 0.9, width: 0.085 },
    rays: { level: 0.4 },
    rings: { dashes: 6, spin: 0.35 },
  }),
  theme('lunar', 'Lunar', 'Silver and white: a quiet, precise light.', ['#ffffff', '#cfd8ec', '#8f9ab5', '#e9eeff'], {
    act: { sign: 'eclipse', manner: 0, with: ['motes', 'rings'] },
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

  // ── Goku: flame-like, tall, loud. One per form. ───────────────────
  { ...theme('ignition', 'Ignition', 'Gold fire, close to the body.', ['#ffd23a', '#ff9a1f', '#fff0a8', '#ff5a1f'], {
    act: { sign: 'blaze', manner: 0, with: ['arcs', 'streams', 'sparks', 'rings'] },
    breath: 0.4, flow: 1.6, body: 0.7,
    shell: { level: 1.2, reach: 1.1, flame: 1 },
    halo: { level: 0.7, size: 0.9 },
    rays: { level: 0, from: 1 },
    ribbons: { level: 0, from: 1 },
    motes: { level: 0.8, count: 120, rise: 0.8, size: 0.7, swirl: 0.3, twinkle: 1 },
    streams: { level: 1, from: 0.15, count: 18, height: 1.1 },
    rings: { level: 0.8, dashes: 0, spin: 0.2 },
    sparks: { count: 130, speed: 1.6, crackle: 0.6 },
    arcs: { level: 1, from: 0.1, count: 9 },
  }), universe: 'power' },
  { ...theme('awakened', 'Awakened', 'Jade fire that climbs well above the head.', ['#7dffcf', '#1fe0a0', '#eafff6', '#16b3d6'], {
    act: { sign: 'nimbus', manner: 0, with: ['streams', 'motes'] },
    breath: 0.42, flow: 1.8, body: 0.8,
    shell: { level: 1.3, reach: 1.3, flame: 1 },
    halo: { level: 0.8, size: 1 },
    rays: { level: 0.5, from: 0.5, count: 10, sharp: 4 },
    ribbons: { level: 0, from: 1 },
    motes: { level: 0.9, count: 150, rise: 0.9, size: 0.7, swirl: 0.3, twinkle: 1 },
    streams: { level: 1.2, from: 0.1, count: 24, height: 1.5 },
    rings: { level: 1, dashes: 0, spin: 0.25 },
    sparks: { count: 110, speed: 1.4 },
  }), universe: 'power' },
  { ...theme('ascended', 'Ascended', 'Violet and magenta, with the first lightning.', ['#d07bff', '#8a4dff', '#ff6be6', '#f3e1ff'], {
    act: { sign: 'sphere', manner: 0, with: ['arcs', 'sparks'] },
    breath: 0.46, flow: 2, body: 0.85,
    shell: { level: 1.3, reach: 1.4, flame: 1 },
    halo: { level: 0.9, size: 1.05 },
    rays: { level: 0.4, from: 0.6, count: 12, sharp: 5 },
    ribbons: { level: 0.5, count: 4, turns: 1.2, width: 0.05, speed: 2.2, ripple: 1.4 },
    motes: { level: 0.9, count: 150, rise: 0.9, size: 0.7, swirl: 0.6, twinkle: 1 },
    streams: { level: 1.1, from: 0.1, count: 22, height: 1.5 },
    rings: { level: 1, dashes: 24, spin: 0.8 },
    sparks: { count: 120, speed: 1.5, crackle: 0.5 },
    arcs: { level: 0.6, from: 0.3, count: 5 },
  }), universe: 'power' },
  { ...theme('overdrive', 'Overdrive', 'Crimson fire and white lightning, at full speed.', ['#ff3355', '#ff8a5c', '#ffffff', '#ff2bd6'], {
    act: { sign: 'pulse', manner: 0, with: ['arcs', 'sparks', 'streams'] },
    breath: 0.6, flow: 2.4, body: 0.9,
    shell: { level: 1.4, reach: 1.5, flame: 1 },
    halo: { level: 0.9, size: 1.05 },
    rays: { level: 0.5, from: 0.5, count: 14, sharp: 6 },
    ribbons: { level: 0.4, count: 4, turns: 1.6, width: 0.03, speed: 2.8, ripple: 1.8 },
    motes: { level: 0.9, count: 150, rise: 1, size: 0.65, swirl: 1.2, twinkle: 1 },
    streams: { level: 1.2, from: 0.1, count: 26, height: 1.6 },
    rings: { level: 1.1, dashes: 48, spin: 1.6 },
    sparks: { count: 140, speed: 1.8, crackle: 1 },
    arcs: { level: 1, from: 0.1, count: 10 },
  }), universe: 'power' },
  { ...theme('transcendent', 'Transcendent', 'Silver and blue-white, and quiet: power that no longer needs to shout.', ['#dfe8ff', '#8fb0ff', '#ffffff', '#5f86ea', '#c3cfe8'], {
    act: { sign: 'ripple', manner: 0, with: ['motes'] },
    breath: 0.14, flow: 0.8, body: 1,
    shell: { level: 1.2, reach: 1.2, flame: 0.5 },
    halo: { level: 1.4, size: 1.4 },
    rays: { level: 1.2, from: 0.15, count: 16, sharp: 3 },
    ribbons: { level: 0.7, count: 5, turns: 0.6, width: 0.12, speed: 0.6, ripple: 0.3 },
    motes: { level: 1.1, count: 260, rise: 0.2, size: 1, swirl: 0.5, twinkle: 0.8 },
    streams: { level: 0.8, count: 18, height: 1.3 },
    rings: { level: 1, dashes: 48, spin: 0.2 },
    sparks: { count: 90, speed: 0.8 },
  }), universe: 'power' },

  // The last form: no flame at all. The body turns into a piece of night sky, and stars drift round it.
  { ...theme('zeno', 'Zeno', 'A galaxy in the shape of a body: violet cloud, stars, and a white edge.', ['#efe6ff', '#7a4dff', '#ffffff', '#ff6fd0', '#5f8cff'], {
    act: { sign: 'galaxy', manner: 1, with: ['motes'] },
    breath: 0.1, flow: 0.6, body: 0.3,
    shell: { level: 0.55, reach: 1.5, flame: 0.15 },
    halo: { level: 0.8, size: 1.5 },
    rays: { level: 0, from: 1 },
    ribbons: { level: 0, from: 1 },
    motes: { level: 1.6, count: 260, rise: 0.12, size: 1.25, swirl: 0.35, twinkle: 1.6 },
    streams: { level: 0, from: 1 },
    rings: { level: 0.7, dashes: 64, spin: 0.1 },
    sparks: { count: 60, speed: 0.4 },
  }), universe: 'power', cosmos: 1 },

  // ── Baki: restrained. Heat, steam and the ground; no rays, no ribbons. ──
  { ...theme('pressure', 'Pressure', 'Heat coming off a body at work. Pale steam, close to the skin.', ['#e9e2d6', '#b8ada0', '#8a8078', '#ffffff'], {
    act: { sign: 'steam', manner: 0, with: ['streams'] },
    breath: 0.26, flow: 0.9, body: 0.35,
    shell: { level: 0.8, reach: 0.5, flame: 0.35 },
    halo: { level: 0.25, size: 0.7 },
    rays: { level: 0, from: 1 },
    ribbons: { level: 0, from: 1 },
    motes: { level: 0.4, count: 60, rise: 0.5, size: 0.6, swirl: 0.2, twinkle: 0.2 },
    streams: { level: 1, from: 0.1, count: 14, height: 1.2 },
    rings: { level: 0.6, dashes: 0, spin: 0 },
    sparks: { level: 0, from: 1 },
  }), universe: 'iron' },
  { ...theme('tempered', 'Tempered', 'Ember red under the skin. The floor answers each rep.', ['#ff5a3c', '#c2281c', '#ffb08a', '#7a1410'], {
    act: { sign: 'steam', manner: 1, with: ['rings', 'sparks'] },
    breath: 0.28, flow: 1, body: 0.5,
    shell: { level: 0.9, reach: 0.8, flame: 0.6 },
    halo: { level: 0.3, size: 0.75 },
    rays: { level: 0, from: 1 },
    ribbons: { level: 0, from: 1 },
    motes: { level: 0.5, count: 70, rise: 0.6, size: 0.6, swirl: 0.2, twinkle: 0.4 },
    streams: { level: 1.1, from: 0.1, count: 16, height: 1.2 },
    rings: { level: 1, dashes: 0, spin: 0 },
    sparks: { level: 0.5, count: 50, speed: 1 },
  }), universe: 'iron' },
  { ...theme('forged', 'Forged', 'Molten orange and flying sparks.', ['#ff8a2b', '#ff3d1f', '#ffd9a0', '#a31a0c'], {
    act: { sign: 'strike', manner: 0, with: ['sparks', 'rings'] },
    breath: 0.3, flow: 1.2, body: 0.6,
    shell: { level: 1, reach: 1.1, flame: 0.8 },
    halo: { level: 0.35, size: 0.8 },
    rays: { level: 0, from: 1 },
    ribbons: { level: 0, from: 1 },
    motes: { level: 0.7, count: 100, rise: 0.9, size: 0.55, swirl: 0.3, twinkle: 0.8 },
    streams: { level: 1.1, from: 0.1, count: 18, height: 1.3 },
    rings: { level: 1.1, dashes: 0, spin: 0 },
    sparks: { level: 1, from: 0.3, count: 110, speed: 1.4, crackle: 0.2 },
  }), universe: 'iron' },
  { ...theme('unbroken', 'Unbroken', 'White-hot and still. A hard edge of light.', ['#ffffff', '#ffe9dc', '#ff6b4a', '#c9c2ba'], {
    act: { sign: 'ripple', manner: 1, with: ['rings'] },
    breath: 0.2, flow: 0.8, body: 0.75,
    shell: { level: 1.3, reach: 0.7, flame: 0.2 },
    halo: { level: 0.4, size: 0.8 },
    rays: { level: 0, from: 1 },
    ribbons: { level: 0, from: 1 },
    motes: { level: 0.5, count: 80, rise: 0.4, size: 0.5, swirl: 0.2, twinkle: 0.5 },
    streams: { level: 0.9, from: 0.1, count: 14, height: 1.1 },
    rings: { level: 1.3, dashes: 0, spin: 0 },
    sparks: { level: 0.6, count: 60, speed: 1 },
  }), universe: 'iron' },
  { ...theme('apex', 'Apex', 'Red and white, in heavy beats. Nothing held back.', ['#ff1f2e', '#ffffff', '#8f0a14', '#ff7a66'], {
    act: { sign: 'pulse', manner: 1, with: ['streams', 'sparks', 'rings'] },
    breath: 0.34, flow: 1.5, body: 0.8,
    shell: { level: 1.4, reach: 1.5, flame: 1 },
    halo: { level: 0.45, size: 0.85 },
    rays: { level: 0, from: 1 },
    ribbons: { level: 0, from: 1 },
    motes: { level: 0.7, count: 110, rise: 0.9, size: 0.6, swirl: 0.3, twinkle: 0.8 },
    streams: { level: 1.2, from: 0.1, count: 24, height: 1.4 },
    rings: { level: 1.4, dashes: 0, spin: 0 },
    sparks: { level: 1, from: 0.3, count: 120, speed: 1.4, crackle: 0.3 },
    arcs: { level: 0.4, from: 0.6, count: 3 },
  }), universe: 'iron' },
]

export const themeById = Object.fromEntries(THEMES.map((t) => [t.id, t])) as Record<string, AuraTheme>

/** What an administrator can change about a theme without touching it. */
export interface ThemeTuning { intensity?: number; pulse?: number; density?: number; off?: string[] }
