import type { ChannelDetail } from '../body/muscles'
import type { BoneName } from '../body/skeleton'
import type { Body, Pose, Rig } from '../rig'
import type { CameraAngle } from '../stage'

/** How a movement behaves over time, which is also how its energy behaves. */
export type MotionKind = 'reps' | 'hold' | 'balance' | 'mobility'

export interface Bar { height: number; width: number; radius: number; z?: number }

/** A piece of equipment on the stage. Positions are in the performer's own space: +Z is where a standing athlete faces. */
export type Prop =
  /** A bar across the stage (along X) on two posts. */
  | ({ kind: 'bar' } & Bar)
  /** Two rails running front to back, `gap` apart: dip bars, or parallettes when low and short. */
  | { kind: 'rails'; height: number; gap: number; length: number; radius: number; z?: number }
  /** A box or bench standing on the floor, centred at x, z. */
  | { kind: 'box'; width: number; height: number; depth: number; x?: number; z: number }
  /** A wall across the stage at z. */
  | { kind: 'wall'; z: number; height?: number }
  /** An ab wheel, which follows the hands. */
  | { kind: 'wheel'; radius: number }
  /** Two gymnastic rings on straps, hanging from `top` with their centres at `height`, `gap` apart. `radius` is the ring's own; the part held is its lowest point. */
  | { kind: 'rings'; height: number; top: number; gap: number; radius: number; z?: number }
  /** A resistance band looped over a fixed point (a bar) and stretched down to a joint that moves: it follows `to` every frame. */
  | { kind: 'band'; x: number; height: number; z?: number; to: BoneName }

/** How the stage is proportioned for a movement: wide for work on the floor, tall for standing and hanging. */
export type StageShape = 'low' | 'square' | 'tall'
export const STAGE_RATIO: Record<StageShape, number> = { low: 1.5, square: 1.05, tall: 0.82 }

/**
 * One exercise as movement. `pose` is asked for any moment of one cycle
 * (t from 0 to 1) and for any body, so the same definition serves every
 * character.
 */
export interface Motion {
  /** The exercise in the library this demonstrates. */
  id: string
  /**
   * Goes up whenever the movement itself is changed. A demonstration is
   * reviewed against one revision; a later revision has to be reviewed again.
   */
  revision: number
  kind: MotionKind
  /** Seconds for one repetition, or for one breath of a hold. */
  period: number
  camera: CameraAngle
  /** Degrees round the subject, where the named angle is not the best one. */
  azimuth?: number
  /** Camera height above the horizon, degrees. */
  elevation?: number
  /** The proportions of the stage that suit it. */
  stage: StageShape
  /** The equipment it is performed on. */
  props?: (b: Body) => Prop[]
  /** The joints that must not move during it: a hand on the floor, a foot on the ground. Checked automatically. */
  planted?: BoneName[]
  /** Writes the pose at t. It is handed the rig so that it can measure a first attempt and correct it. */
  pose: (t: number, rig: Rig, out: Pose) => void
  /** How hard the working muscles are working at t, 0..1. Drives the emphasis of the muscle layer and the energy. */
  effort: (t: number) => number
  /** The moment in the cycle a repetition is complete. */
  beat?: number
  /** Where the library's muscle names are too coarse for what the movement shows. */
  detail?: ChannelDetail
  /** Where the emphasis moves between phases: a multiplier per channel at t. */
  shift?: (t: number) => ChannelDetail
  /** What was checked when this movement was written: the standard it is held to. */
  standard: string
}

export const ease = (t: number) => t * t * (3 - 2 * t)
/** 0 → 1 → 0 over a cycle, resting at both ends: down for `hold`, pause, up. */
export function there(t: number, down = 0.42, pause = 0.08): number {
  if (t < down) return ease(t / down)
  if (t < down + pause) return 1
  const up = 1 - down - pause
  return 1 - ease(Math.min(1, (t - down - pause) / (up * 0.86)))
}
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
