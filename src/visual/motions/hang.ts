import { Vector3 } from 'three'
import { pitch, type Body, type Pose, type Rig } from '../rig'
import { SIDES, handsOnBar, shouldersAt, straightLegs } from './kit'
import { ease, lerp, there, type Bar, type Motion } from './types'

/** A bar high enough to hang from with the toes clear of the floor. */
export const highBar = (b: Body): Bar => ({ height: 2.32 * b.scale, width: 1.3 * b.scale, radius: 0.0165 * b.scale })

/**
 * Hanging from the bar, `u` of the way from a dead hang (0) to the chin over
 * the bar (1). `active` pulls the shoulders down away from the ears.
 */
export function hang(rig: Rig, out: Pose, u: number, active: number, sway = 0) {
  const b = rig.body
  const s = b.scale
  const bar = highBar(b)
  const half = b.rest.upperArmL.x + 0.125 * s
  handsOnBar(b, out, bar, half)
  const wrist = out.arm.L.hand
  const reach = b.upperArm + b.lowerArm
  // Shoulders: straight under the hands at the bottom; at the top a hand's width below the wrists, the body a little behind the bar.
  const hangs = (aside: number) => new Vector3(0, wrist.y - Math.sqrt(Math.max(0, (reach * 0.9985) ** 2 - aside ** 2)), wrist.z + 0.004 * s)
  const high = new Vector3(0, wrist.y - 0.04 * s, wrist.z - 0.08 * s)
  const aim = (low: Vector3) => {
    const target = low.clone().lerp(high, u)
    target.z += Math.sin(u * Math.PI) * -0.02 * s + sway * 0.03 * s
    return target
  }
  const target = aim(hangs(half - b.rest.upperArmL.x))
  out.chest.copy(pitch(lerp(1, -13, u) + sway * 2))
  out.pelvis.copy(pitch(lerp(5, 0, u) + sway * 3))
  out.head.copy(pitch(lerp(-4, -16, ease(u))))
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    arm.elbow.set(sign * 1, -0.5, lerp(0.5, -0.15, u))
    arm.shrug = lerp(1 - 1.2 * active, -0.9, u)
  }
  out.hips.set(0, target.y - b.trunk, target.z)
  shouldersAt(rig, out, target)
  // The shoulders rise towards the ears in a hang, which brings them closer together: measured, so the arms are exactly straight.
  shouldersAt(rig, out, aim(hangs(Math.hypot(wrist.x - rig.pos.upperArmL.x, wrist.z - rig.pos.upperArmL.z))))
  straightLegs(rig, out, lerp(9, 14, u), 46)
}

/**
 * Strict pull-up: from a dead hang with straight arms to the chin over the
 * bar, body quiet, no swing; elbows drive down and back, shoulder blades
 * pulled down before the arms bend.
 */
export const pullup: Motion = {
  id: 'pull-up',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 3.4,
  camera: 'back',
  azimuth: 152,
  elevation: 2,
  beat: 0.5,
  props: (b) => [{ kind: 'bar', ...highBar(b) }],
  detail: { forearm_flex: 0.5, forearm_ext: 0.3, rear_cuff: 0.6 },
  standard: 'Starts from a dead hang with straight arms; chin clearly over the bar; no swing or kick; lowered under control to straight arms.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.4, 0.1),
  pose(t, rig, out) {
    const u = there(t, 0.4, 0.1)
    // The shoulder blades set first: the first tenth of the pull is the shoulders, not the elbows.
    hang(rig, out, Math.max(0, (u - 0.08) / 0.92), Math.min(1, u / 0.08))
  },
}

/** Dead hang: a relaxed, full hang; the grip does the work. */
export const deadHang: Motion = {
  id: 'dead-hang',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 5,
  camera: 'front',
  azimuth: 28,
  elevation: 2,
  props: (b) => [{ kind: 'bar', ...highBar(b) }],
  standard: 'Full grip, arms straight, shoulders relaxed up by the ears, body still, feet clear of the floor.',
  effort: () => 0.6,
  pose(t, rig, out) {
    hang(rig, out, 0, 0.12 + 0.05 * Math.sin(t * Math.PI * 2), Math.sin(t * Math.PI * 2) * 0.35)
  },
}
