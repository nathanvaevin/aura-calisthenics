/**
 * The colour of the Aura themes: what marks where you are and what is next (the menu bar, Personalize, a chosen card, the
 * dot after the name). Four to choose from, Aura Dark Mode and Aura Light Mode only (the owner's choice, 2026-11-25); the
 * other themes have one colour, which is theirs.
 *
 * The colours themselves are tokens in src/styles/index.css, one block a tone and scheme, worn by the page as
 * `data-tone`. The first is the default and needs no block: it is the theme's own. An official assessment is always
 * shown in it. The choice is on the device (`settings.tone`).
 */
export const TONES = [
  { id: 'sun', name: 'Sun', dark: 'linear-gradient(180deg, #ffc67a, #ffa04e)', light: 'linear-gradient(180deg, #b05d10, #9c520a)' },
  { id: 'champagne', name: 'Champagne', dark: 'linear-gradient(180deg, #f1d9c0, #d8b190)', light: 'linear-gradient(180deg, #8f6c4e, #745538)' },
  { id: 'moonlight', name: 'Moonlight', dark: 'linear-gradient(180deg, #f8f4ea, #dcd4c2)', light: 'linear-gradient(180deg, #5d5c66, #3f3e47)' },
  { id: 'aurora', name: 'Aurora', dark: 'linear-gradient(115deg, #ffd6bf, #e2c8ff 52%, #bcd8ff)', light: 'linear-gradient(115deg, #b54f38, #7a4fc0 52%, #3568c4)' },
] as const

export type ToneId = (typeof TONES)[number]['id']
export const DEFAULT_TONE: ToneId = 'sun'

/** What the page wears for a choice: nothing for the default, so that nothing is left over from someone else's. */
export const toneAttr = (chosen: string | undefined, official: boolean): ToneId | undefined =>
  official || chosen === DEFAULT_TONE ? undefined : TONES.find((t) => t.id === chosen)?.id
