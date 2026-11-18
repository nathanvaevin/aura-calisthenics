/**
 * The five visual themes, as data.
 *
 * A theme is how Aura looks and speaks to one athlete: colours and type
 * (tokens in src/styles/index.css, keyed by the theme id), a voice
 * (voice.ts), and a universe. A universe is what the theme shares with the
 * 3D side: which body the character has, how it is drawn, and the Aura forms
 * it can take. Aura Dark and Aura Light are two views of one universe, and
 * so are Goku and Goku Light; the second pair also changes the stage and the
 * drawing of the character (`variant`).
 *
 * Nothing here touches exercises, ratings, courses or assessments: a theme
 * is presentation only, and adding another is a new entry here, a block of
 * tokens, and a column of copy.
 */
import type { BuildId } from '@/visual/body/skeleton'

export const THEME_IDS = ['dark', 'light', 'power', 'power-light', 'iron'] as const
export type ThemeId = (typeof THEME_IDS)[number]

export const UNIVERSE_IDS = ['aura', 'power', 'iron'] as const
export type UniverseId = (typeof UNIVERSE_IDS)[number]

export type VoiceId = 'aura' | 'power' | 'iron'

export interface AppTheme {
  id: ThemeId
  name: string
  /** One line in the theme's own voice, set in its own display type on the card. */
  line: string
  blurb: string
  scheme: 'dark' | 'light'
  universe: UniverseId
  /** Which rendition of its universe's character and stage it shows (`visual/styles.ts`). Unset: the universe's own. */
  variant?: 'light'
  voice: VoiceId
  /** Browser chrome colour. */
  chrome: string
  /** What the type and language are like, in a few words. */
  type: string
  tone: string
}

export const THEMES: Record<ThemeId, AppTheme> = {
  dark: {
    id: 'dark', name: 'Aura Dark', line: 'Discover what your body is truly capable of.',
    blurb: 'The original. Night, warm light and a serif that takes its time.',
    scheme: 'dark', universe: 'aura', voice: 'aura', chrome: '#08090b',
    type: 'Instrument Serif', tone: 'Thoughtful, human',
  },
  light: {
    id: 'light', name: 'Aura Light', line: 'Your next level starts here.',
    blurb: 'The same Aura by daylight: warm paper, ink, and quieter colour.',
    scheme: 'light', universe: 'aura', voice: 'aura', chrome: '#f3f0e9',
    type: 'Instrument Serif', tone: 'Thoughtful, human',
  },
  power: {
    id: 'power', name: 'Goku', line: 'Unlock your next form.',
    blurb: 'Storm dark, fire and embers. Every level is a new form.',
    scheme: 'dark', universe: 'power', voice: 'power', chrome: '#06080c',
    type: 'Barlow Condensed, italic', tone: 'Energetic, ambitious',
  },
  'power-light': {
    id: 'power-light', name: 'Goku Light', line: 'Unlock your next form.',
    blurb: 'The same fighter as ink on paper, under a red sun.',
    scheme: 'light', universe: 'power', variant: 'light', voice: 'power', chrome: '#e9e7e2',
    type: 'Barlow Condensed, italic', tone: 'Energetic, ambitious',
  },
  iron: {
    id: 'iron', name: 'Baki', line: 'Strength is earned.',
    blurb: 'Ink, bone and red. Anatomy in hard light, and nothing given.',
    scheme: 'dark', universe: 'iron', voice: 'iron', chrome: '#0b0a09',
    type: 'Anton, capitals', tone: 'Direct, disciplined',
  },
}

/** The still picture of a theme's character, for where the 3D view is not loaded. */
export const posterOf = (theme: ThemeId, character: 'male' | 'female') =>
  `themes/${THEMES[theme].universe}${THEMES[theme].variant ? `-${THEMES[theme].variant}` : ''}-${character}.jpg`

export const isThemeId = (v: unknown): v is ThemeId => typeof v === 'string' && (THEME_IDS as readonly string[]).includes(v)

/** Official assessments are always shown this way, whatever the athlete chose. */
export const STANDARD_THEME: ThemeId = 'dark'

// ── Forms: the Aura variations of a universe ─────────────────────────────

/**
 * What an athlete has to have shown before a form is theirs. Unlocks only
 * read the scoring; they never feed back into it.
 */
export type Unlock =
  | { kind: 'start' }
  /** Reaching an Aura class (index into AURA_CLASSES). */
  | { kind: 'class'; index: number }
  /** Skills mastered, at any evidence tier. */
  | { kind: 'skills'; count: number }
  /** Skills verified by a coach or from video. */
  | { kind: 'verified'; count: number }

export interface Form {
  id: string
  name: string
  line: string
  /** The Aura theme that draws it (src/visual/aura/themes.ts). */
  aura: string
  unlock: Unlock
  /** Main colour, for chips and for hair that takes the colour of the form. */
  colour: string
}

export interface Finish {
  id: string
  name: string
  skin: string
  hair: string
  /** Wristbands, wraps, sash. */
  accent: string
}

export interface Universe {
  id: UniverseId
  name: string
  /** What the forms are called here. */
  forms: string
  /** One sentence on the character. */
  character: string
  build: BuildId
  list: Form[]
  finishes: Finish[]
}

export const UNIVERSES: Record<UniverseId, Universe> = {
  aura: {
    id: 'aura', name: 'Aura', forms: 'Aura',
    character: 'The Aura master character: calm, precise, made of light and stone.',
    build: 'aura',
    list: [
      { id: 'cosmic', name: 'Cosmic', line: 'Violet, blue, pink and orange. The standard Aura.', aura: 'cosmic', unlock: { kind: 'start' }, colour: '#9a6bff' },
      { id: 'signature', name: 'Signature', line: 'Six colours, one for each discipline.', aura: 'signature', unlock: { kind: 'skills', count: 3 }, colour: '#f2c46b' },
      { id: 'lunar', name: 'Lunar', line: 'Silver and white: a quiet, precise light.', aura: 'lunar', unlock: { kind: 'class', index: 1 }, colour: '#cfd8ec' },
      { id: 'solar', name: 'Solar', line: 'Warm gold. Radiant and bright.', aura: 'solar', unlock: { kind: 'class', index: 2 }, colour: '#ffd66b' },
      { id: 'ethereal', name: 'Ethereal', line: 'Soft light and slow particles.', aura: 'ethereal', unlock: { kind: 'verified', count: 1 }, colour: '#c8f4ec' },
      { id: 'electric', name: 'Electric', line: 'Arcs, sparks and fast pulses.', aura: 'electric', unlock: { kind: 'class', index: 4 }, colour: '#49c6ff' },
    ],
    finishes: [
      { id: 'pearl', name: 'Pearl', skin: '#c6c6ce', hair: '#b9b9c2', accent: '#ecc77f' },
      { id: 'graphite', name: 'Graphite', skin: '#5b5d66', hair: '#3b3c44', accent: '#ecc77f' },
      { id: 'sand', name: 'Sand', skin: '#cdbfae', hair: '#b3a593', accent: '#ecc77f' },
    ],
  },
  power: {
    id: 'power', name: 'Goku', forms: 'Form',
    character: 'A hero drawn in ink and flat colour, with hair that takes the colour of the form.',
    build: 'power',
    list: [
      { id: 'ignition', name: 'Saiyan', line: 'Gold fire. Everyone starts here.', aura: 'ignition', unlock: { kind: 'start' }, colour: '#ffc21f' },
      { id: 'awakened', name: 'God', line: 'Jade fire. The work has started to show.', aura: 'awakened', unlock: { kind: 'skills', count: 3 }, colour: '#1fe0a0' },
      { id: 'ascended', name: 'Destruction', line: 'Violet, with the first lightning.', aura: 'ascended', unlock: { kind: 'class', index: 1 }, colour: '#a45cff' },
      { id: 'overdrive', name: 'Kaio-ken', line: 'Crimson and white lightning.', aura: 'overdrive', unlock: { kind: 'class', index: 3 }, colour: '#ff3355' },
      { id: 'transcendent', name: 'Ultra Instinct', line: 'Silver and still. Power that no longer needs to shout.', aura: 'transcendent', unlock: { kind: 'class', index: 5 }, colour: '#b9ccff' },
      { id: 'zeno', name: 'Zeno', line: 'The last form. A galaxy in the shape of a body.', aura: 'zeno', unlock: { kind: 'class', index: 7 }, colour: '#a97bff' },
    ],
    finishes: [
      { id: 'dawn', name: 'Dawn', skin: '#f2c9a3', hair: '#121215', accent: '#2a4585' },
      { id: 'dusk', name: 'Dusk', skin: '#cf9868', hair: '#121215', accent: '#2a4585' },
      { id: 'night', name: 'Night', skin: '#8a5c3d', hair: '#0d0d10', accent: '#34539c' },
    ],
  },
  iron: {
    id: 'iron', name: 'Baki', forms: 'State',
    character: 'A heavy, serious athlete. Every muscle is drawn, and the light is hard.',
    build: 'iron',
    list: [
      { id: 'pressure', name: 'Pressure', line: 'Heat off a working body. Nothing more.', aura: 'pressure', unlock: { kind: 'start' }, colour: '#d8cfc2' },
      { id: 'tempered', name: 'Tempered', line: 'Ember red. The floor answers each rep.', aura: 'tempered', unlock: { kind: 'skills', count: 3 }, colour: '#e0452e' },
      { id: 'forged', name: 'Forged', line: 'Molten orange and sparks.', aura: 'forged', unlock: { kind: 'class', index: 1 }, colour: '#ff7a24' },
      { id: 'unbroken', name: 'Unbroken', line: 'White-hot and still.', aura: 'unbroken', unlock: { kind: 'verified', count: 1 }, colour: '#fff1e6' },
      { id: 'apex', name: 'Apex', line: 'Red and white. Nothing held back.', aura: 'apex', unlock: { kind: 'class', index: 4 }, colour: '#ff1f2e' },
    ],
    finishes: [
      { id: 'bone', name: 'Bone', skin: '#d9c7b2', hair: '#17140f', accent: '#c8372d' },
      { id: 'bronze', name: 'Bronze', skin: '#a8754e', hair: '#120f0b', accent: '#e8e0d2' },
      { id: 'umber', name: 'Umber', skin: '#6a4630', hair: '#0d0b08', accent: '#c8372d' },
    ],
  },
}

export const universeOf = (theme: ThemeId): Universe => UNIVERSES[THEMES[theme].universe]

export const formOf = (universe: UniverseId, id: string | undefined): Form => {
  const u = UNIVERSES[universe]
  return u.list.find((f) => f.id === id) ?? u.list[0]
}

export const finishOf = (universe: UniverseId, id: string | undefined): Finish => {
  const u = UNIVERSES[universe]
  return u.finishes.find((f) => f.id === id) ?? u.finishes[0]
}
