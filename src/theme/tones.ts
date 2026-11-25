/**
 * The colour of a theme: what marks where you are and what is next (the menu bar, Personalize, a chosen card). Every
 * theme has four to choose from, its own (the owner's choice, 2026-11-25); two themes on one universe share the four,
 * each in its own shades.
 *
 * The colours themselves are tokens in src/styles/index.css, one block a theme and tone, worn as `data-tone` beside
 * `data-theme`. The first of a universe is the default and needs no block: it is the theme's own. An official
 * assessment is always shown in it. The choice is on the device, one a universe (`settings.tones`).
 */
import { THEMES, type ThemeId, type UniverseId } from './themes'

export interface Tone {
  /** Unlike any other, also another universe's: the page wears it bare. */
  id: string
  name: string
  /** What it looks like on a button, in each theme of its universe (`--accent-fill` there). */
  fill: Partial<Record<ThemeId, string>>
}

export const TONES: Record<UniverseId, Tone[]> = {
  aura: [
    { id: 'champagne', name: 'Champagne', fill: { dark: 'linear-gradient(180deg, #f1d9c0, #d8b190)', light: 'linear-gradient(180deg, #8f6c4e, #745538)' } },
    { id: 'sun', name: 'Sun', fill: { dark: 'linear-gradient(180deg, #ffc67a, #ffa04e)', light: 'linear-gradient(180deg, #b05d10, #9c520a)' } },
    { id: 'moonlight', name: 'Moonlight', fill: { dark: 'linear-gradient(180deg, #f8f4ea, #dcd4c2)', light: 'linear-gradient(180deg, #5d5c66, #3f3e47)' } },
    { id: 'aurora', name: 'Aurora', fill: { dark: 'linear-gradient(115deg, #ffd6bf, #e2c8ff 52%, #bcd8ff)', light: 'linear-gradient(115deg, #b54f38, #7a4fc0 52%, #3568c4)' } },
  ],
  power: [
    { id: 'blaze', name: 'Blaze', fill: { power: '#ff8a1f', 'power-light': '#d2411f' } },
    { id: 'gold', name: 'Gold', fill: { power: '#ffd23f', 'power-light': '#8a5800' } },
    { id: 'azure', name: 'Azure', fill: { power: '#59b8ff', 'power-light': '#2a4585' } },
    { id: 'violet', name: 'Violet', fill: { power: '#b79bff', 'power-light': '#5b3fb0' } },
  ],
  iron: [
    { id: 'blood', name: 'Blood', fill: { iron: '#d63a2f' } },
    { id: 'bone', name: 'Bone', fill: { iron: '#e6dccb' } },
    { id: 'bronze', name: 'Bronze', fill: { iron: '#cf8a4a' } },
    { id: 'steel', name: 'Steel', fill: { iron: '#a9b8c6' } },
  ],
}

export type Tones = Partial<Record<UniverseId, string>>

export const tonesOf = (theme: ThemeId): Tone[] => TONES[THEMES[theme].universe]

/** The tone a theme is shown in for someone: their choice for its universe, else its first. */
export function toneOf(theme: ThemeId, chosen: Tones | undefined): Tone {
  const list = tonesOf(theme)
  return list.find((t) => t.id === chosen?.[THEMES[theme].universe]) ?? list[0]
}

/** What is worn beside `data-theme`: nothing for the default, and nothing in an official assessment. */
export function toneAttr(theme: ThemeId, chosen: Tones | undefined, official = false): string | undefined {
  const tone = toneOf(theme, chosen)
  return official || tone === tonesOf(theme)[0] ? undefined : tone.id
}
