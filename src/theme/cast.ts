/**
 * From an athlete's look to a character on stage. The one place that decides
 * how a universe, a finish and a form turn into what the 3D player is given,
 * so a profile, a demonstration and the Studio all show the same character.
 */
import type { PerformerSpec } from '@/visual/player'
import type { AuraMode } from '@/visual/aura/director'
import type { ThemeTuning } from '@/visual/aura/themes'
import type { Wearing } from './personal'
import { styleOf } from '@/visual/styles'
import { THEMES, THEME_IDS, UNIVERSES, type ThemeId, type UniverseId } from './themes'

/** The colour working muscles light up in. */
export const MUSCLE_GLOW: Record<UniverseId, string> = { aura: '#ff2f8f', power: '#e0245e', iron: '#e3261c' }

/** `theme` says which rendition of the universe is shown, where a universe has two (Goku and Goku Light). */
export type Look = Pick<Wearing, 'universe' | 'character' | 'form' | 'finish' | 'intensity' | 'scene'> & { theme?: ThemeId }

/**
 * The theme whose colours suit a screen laid over the stage of this theme's
 * character. Its own, almost always. Aura Light is a light page round a dark
 * stage (an Aura is light and needs the dark): written over that stage, the
 * screen takes the dark theme of the same universe.
 */
export function stageTheme(theme: ThemeId): ThemeId {
  const t = THEMES[theme]
  const paper = !!styleOf({ universe: t.universe, variant: t.variant }).stage.paint
  if ((t.scheme === 'light') === paper) return theme
  return THEME_IDS.find((id) => THEMES[id].universe === t.universe && (THEMES[id].scheme === 'light') === paper) ?? theme
}

/** The official presentation: the Aura master character under the Cosmic Aura. Used for every assessment. */
export const standardLook = (character: Wearing['character']): Look => ({
  universe: 'aura', character, form: UNIVERSES.aura.list[0], finish: UNIVERSES.aura.finishes[0], intensity: 0.6,
})

/**
 * How strongly a worn Aura glows for an athlete's intensity (0 to 1). The lowest setting is still an Aura that can be
 * seen, on every stage: the slider turns it up from there, it never turns it off.
 */
export const glowOf = (intensity: number) => 0.3 + 0.7 * Math.max(0, Math.min(1, intensity))

export function performerOf(look: Look, o: {
  motion?: string | null
  revision?: number
  muscles?: PerformerSpec['muscles']
  aura?: AuraMode
  /** Overrides the athlete's intensity (a preview at full strength). */
  level?: number
  tuning?: ThemeTuning
  x?: number
  facing?: number
} = {}): PerformerSpec {
  return {
    character: look.character, motion: o.motion ?? null, revision: o.revision, muscles: o.muscles ?? null, glow: MUSCLE_GLOW[look.universe],
    aura: { theme: look.form.aura, mode: o.aura ?? 'off', level: o.level ?? (o.aura === 'full' ? glowOf(look.intensity) : undefined), tuning: o.tuning },
    style: { universe: look.universe, variant: look.theme ? THEMES[look.theme].variant : undefined, scene: look.scene, skin: look.finish.skin, hair: look.finish.hair, accent: look.finish.accent },
    x: o.x, facing: o.facing,
  }
}
