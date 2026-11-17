/**
 * From an athlete's look to a character on stage. The one place that decides
 * how a universe, a finish and a form turn into what the 3D player is given,
 * so a profile, a demonstration and the Studio all show the same character.
 */
import type { PerformerSpec } from '@/visual/player'
import type { AuraMode } from '@/visual/aura/director'
import type { ThemeTuning } from '@/visual/aura/themes'
import type { Wearing } from './personal'
import { UNIVERSES, type UniverseId } from './themes'

/** The colour working muscles light up in. */
export const MUSCLE_GLOW: Record<UniverseId, string> = { aura: '#ff2f8f', power: '#ff7a1f', iron: '#e3261c' }

export type Look = Pick<Wearing, 'universe' | 'character' | 'form' | 'finish' | 'intensity'>

/** The official presentation: the Aura master character under the Cosmic Aura. Used for every assessment. */
export const standardLook = (character: Wearing['character']): Look => ({
  universe: 'aura', character, form: UNIVERSES.aura.list[0], finish: UNIVERSES.aura.finishes[0], intensity: 0.6,
})

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
    aura: { theme: look.form.aura, mode: o.aura ?? 'off', level: o.level ?? (o.aura === 'full' ? look.intensity : undefined), tuning: o.tuning },
    style: { universe: look.universe, skin: look.finish.skin, hair: look.finish.hair, accent: look.finish.accent },
    x: o.x, facing: o.facing,
  }
}
