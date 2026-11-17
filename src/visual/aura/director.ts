/**
 * How the energy behaves through a set.
 *
 * The movement says what is happening (how hard the muscles are working,
 * when a repetition is complete, how far through a hold we are); the
 * director turns that into a level of intensity and the moments for a beat
 * or a release. Each kind of movement has its own character.
 */
import type { MotionKind } from '../motions/types'

export type AuraMode = 'off' | 'living' | 'full'

export interface Moment {
  /** 0..1 through the whole set. */
  progress: number
  /** 0..1, how hard the working muscles are working right now. */
  effort: number
  /** Where in the current cycle (rep or breath) we are, 0..1. */
  phase: number
  /** Seconds since the set started. */
  time: number
}

/** The level a living aura sits at for a kind of movement. Kept low: the muscles are the main event. */
export function livingLevel(kind: MotionKind, m: Moment): number {
  switch (kind) {
    // Climbs a little with every repetition and swells in the hard part of each.
    case 'reps': return 0.1 + 0.12 * m.progress + 0.16 * m.effort
    // Builds steadily through the hold, with a tremor that grows as it gets harder.
    case 'hold': return 0.08 + 0.4 * m.progress * m.progress + 0.03 * m.progress * Math.sin(m.time * 23) * Math.sin(m.time * 7.3)
    // Never still: follows the small corrections.
    case 'balance': return 0.16 + 0.1 * m.effort + 0.05 * Math.sin(m.time * 1.7)
    // Rises and falls with the breath.
    case 'mobility': return 0.12 + 0.2 * (0.5 - 0.5 * Math.cos(m.phase * Math.PI * 2))
  }
}

export function levelOf(mode: AuraMode, kind: MotionKind, m: Moment, fixed?: number): number {
  if (fixed !== undefined) return fixed
  if (mode === 'off') return 0
  if (mode === 'full') return 0.82 + 0.18 * m.effort
  return livingLevel(kind, m)
}
