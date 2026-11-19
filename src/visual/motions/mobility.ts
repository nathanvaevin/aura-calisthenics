import { Vector3 } from 'three'
import { footRot, handRot, pitch, type Body, type Pose, type Rig } from '../rig'
import { SIDES, at, deg, handsOnFloor, hipsAt, shouldersAt, wristHeight } from './kit'
import { ease, lerp, type Motion } from './types'

/**
 * The mobility positions of the assessment. Each is shown as it is held:
 * eased into on the out-breath, kept, eased off a little, never bounced.
 */

/** 0 at the start of a breath, 1 while the position is kept, back to 0 at the end. */
export const settle = (t: number) => (t < 0.38 ? ease(t / 0.38) : t < 0.72 ? 1 : 1 - ease((t - 0.72) / 0.28))
/** How far into the position: `off` when eased off, 1 when fully there. */
export const depth = (t: number, off: number) => off + (1 - off) * settle(t)
export const stretch = (t: number) => 0.4 + 0.5 * settle(t)

/** Wrist to fingertips, and how far the thumb stands out from the wrist. */
export const handLength = (b: Body) => b.knuckle * (0.192 / 0.094)
const thumbReach = (b: Body) => b.knuckle * (0.072 / 0.094)

const UP = new Vector3(0, 1, 0)
const FORWARD = new Vector3(0, 0, 1)

/** The value at which `f` is zero, by the secant method. `f` is last called with the answer, so the pose is left there. */
export function zeroOf(f: (x: number) => number, start: number, step: number, lo: number, hi: number): number {
  let a = start, fa = f(a), z = start + step, fz = f(z)
  for (let i = 0; i < 9 && Math.abs(fz) > 1e-4 && fz !== fa; i++) {
    const next = z - (fz * (z - a)) / (fz - fa)
    a = z; fa = fz; z = Math.max(lo, Math.min(hi, next)); fz = f(z)
  }
  return z
}

export const shoulders = (rig: Rig) => rig.pos.upperArmL.clone().add(rig.pos.upperArmR).multiplyScalar(0.5)

/** Both feet flat on the floor, pointing forward, `half` either side of the centre line. */
export function feetFlat(b: Body, out: Pose, z: number, half: number, knee = new Vector3(0, 0, 1)) {
  for (const [side, sign] of SIDES) {
    const leg = out.leg[side]
    leg.foot.set(sign * half, b.ankle, z)
    leg.rot.copy(footRot(FORWARD, UP))
    leg.knee.set(sign * knee.x, knee.y, knee.z)
    leg.toes = 0
  }
}

/**
 * Standing toe touch: knees locked, folding from the hips, the spine hanging,
 * until the fingertips rest on the floor in front of the feet.
 */
export const toeTouch: Motion = {
  id: 'toe-touch',
  revision: 1,
  stage: 'square',
  planted: ['footL', 'footR'],
  kind: 'mobility',
  period: 6,
  camera: 'side',
  azimuth: 74,
  elevation: 5,
  beat: 0.38,
  standard: 'Knees locked the whole time; the fold starts at the hips; fingertips rest on the floor; no bouncing.',
  effort: stretch,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const k = settle(t)
    // The hips go back a little as the trunk goes forward: the weight stays over the feet.
    const back = 0.11 * s
    const legs = (b.upperLeg + b.lowerLeg) * 0.9995
    const hip = at(-back, b.ankle + Math.sqrt(legs * legs - back * back))
    feetFlat(b, out, 0, b.rest.upperLegL.x)
    const full = (b.upperArm + b.lowerArm) * 0.996
    // Fingertips on the floor at the deepest; a hand's width above it when eased off.
    const wrist = handLength(b) * 0.965 + (1 - k) * 0.09 * s
    // The arms hang from the shoulders and reach back a little, towards the toes.
    const reach = 0.1 * s
    const hang = (from: Record<'L' | 'R', Vector3>) => {
      for (const [side, sign] of SIDES) {
        const arm = out.arm[side]
        arm.hand.set(from[side].x, wrist, from[side].z - reach)
        arm.rot.copy(handRot(side, new Vector3(0, -1, -0.12).normalize(), new Vector3(0, -0.12, -1).normalize()))
        arm.elbow.set(sign * 0.7, 0, -0.7)
        arm.grip = 0.05
        arm.shrug = 0.25
      }
    }
    // The whole trunk tips about the hips until straight arms hanging from the shoulders reach that far.
    zeroOf((tip) => {
      out.pelvis.copy(pitch(64 + tip))
      out.chest.copy(pitch(132 + tip))
      out.head.copy(pitch(150 + tip))
      hipsAt(b, out.pelvis, hip, out.hips)
      const j = rig.joints(out.hips, out.pelvis, out.chest)
      hang({ L: j.shoulderL, R: j.shoulderR })
      for (let i = 0; i < 2; i++) { rig.solve(out); hang({ L: rig.pos.upperArmL, R: rig.pos.upperArmR }) }
      rig.solve(out)
      return shoulders(rig).y - wrist - Math.sqrt(full * full - reach * reach)
    }, 0, 4, -40, 40)
  },
}

/**
 * Deep lunge stretch, opening the left hip: the left knee and shin on the
 * floor behind, the right foot flat in front, the hips sinking forward and
 * down with the pelvis tucked under and the trunk upright.
 */
export const deepLunge: Motion = {
  id: 'deep-lunge',
  revision: 1,
  stage: 'square',
  planted: ['footL', 'footR', 'lowerLegL'],
  kind: 'mobility',
  period: 6.4,
  camera: 'side',
  azimuth: 66,
  elevation: 5,
  beat: 0.38,
  // The stretch is the front of the hip and thigh of the leg that is behind; that leg's glute is squeezed to tuck the pelvis.
  detail: { 'hip_flexors.R': 0.12, 'quads.R': 0.24, 'glutes.R': 0.24, 'glute_med.R': 0.2 },
  standard: 'Back knee on the floor; hips square and sinking forward, not the lower back arching; pelvis tucked under; trunk upright; front knee over the foot, not far past the toes.',
  effort: stretch,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const k = settle(t)
    const half = b.rest.upperLegL.x
    const knee = 0.052 * s
    // The back thigh turns about the knee on the floor: the further forward the hips, the more the hip opens.
    const hipFor = (open: number) => at(b.upperLeg * Math.sin(open * deg), knee + b.upperLeg * Math.cos(open * deg))
    const deepest = hipFor(33)
    const hip = hipFor(lerp(22, 33, k))
    out.pelvis.copy(pitch(-6 - 3 * k))
    out.chest.copy(pitch(-1.5))
    out.head.copy(pitch(1))
    hipsAt(b, out.pelvis, hip, out.hips)
    // Behind: shin and the top of the foot on the floor.
    const rear = out.leg.L
    const ankle = 0.046 * s
    rear.foot.set(half, ankle, -Math.sqrt(b.lowerLeg ** 2 - (knee - ankle) ** 2))
    rear.rot.copy(pitch(176))
    rear.knee.set(0, -1, 0.2)
    rear.toes = 0
    // In front: placed so that the shin is upright when the hips are at their deepest.
    const lead = out.leg.R
    const rise = b.ankle + b.lowerLeg - deepest.y
    lead.foot.set(-half, b.ankle, deepest.z + Math.sqrt(Math.max(0, b.upperLeg ** 2 - rise ** 2)))
    lead.rot.copy(footRot(FORWARD, UP))
    lead.knee.set(0, 0.4, 1)
    lead.toes = 0
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.set(sign * (half + 0.085 * s), hip.y + 0.085 * s, hip.z + 0.045 * s)
      arm.elbow.set(sign, 0.1, -0.75)
      arm.rot.copy(handRot(side, new Vector3(-sign * 0.45, -0.6, 0.66).normalize(), new Vector3(-sign, 0.15, -0.3).normalize()))
      arm.grip = 0.35
      arm.shrug = 0
    }
  },
}

/** Where the wall stands for someone standing with their back against it at z = 0. */
export const wallBehind = (b: Body) => -0.128 * b.scale

/**
 * Overhead wall reach: standing with heels, hips, ribs and head against a
 * wall, straight arms at shoulder width go up and back until the thumbs touch
 * the wall, the lower back staying flat against it.
 */
export const overheadWallReach: Motion = {
  id: 'overhead-wall-reach',
  revision: 1,
  stage: 'tall',
  planted: ['footL', 'footR'],
  props: (b) => [{ kind: 'wall', z: wallBehind(b), height: 2.5 * b.scale }],
  kind: 'mobility',
  period: 6,
  camera: 'side',
  azimuth: 72,
  elevation: 3,
  beat: 0.38,
  detail: { delt_post: 0.3 },
  standard: 'Heels, hips, ribs and head stay on the wall; lower back flat, ribs not lifting; arms straight and shoulder-width; thumbs touch the wall.',
  effort: stretch,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const d = depth(t, 0)
    const wall = wallBehind(b)
    // The heels are close to the wall, so the legs lean back to it a little.
    const heels = -0.066 * s
    const legs = (b.upperLeg + b.lowerLeg) * 0.9995
    feetFlat(b, out, heels, b.rest.upperLegL.x)
    out.pelvis.copy(pitch(-3))
    out.chest.copy(pitch(-0.5))
    out.head.copy(pitch(-1))
    hipsAt(b, out.pelvis, at(0, b.ankle + Math.sqrt(legs * legs - heels * heels)), out.hips)
    const full = (b.upperArm + b.lowerArm) * 0.9965
    const touch = wall + thumbReach(b) + 0.006 * s
    const from = rig.joints(out.hips, out.pelvis, out.chest)
    const reach = (shoulder: Record<'L' | 'R', Vector3>) => {
      for (const [side, sign] of SIDES) {
        const sh = shoulder[side]
        // From well in front of the head to the wall behind it.
        const end = Math.asin(Math.max(-0.5, Math.min(0.5, (touch - sh.z) / full))) / deg
        const a = lerp(end + 34, end, d) * deg
        const dir = new Vector3(0, Math.cos(a), Math.sin(a))
        const arm = out.arm[side]
        arm.hand.copy(sh).addScaledVector(dir, full)
        arm.rot.copy(handRot(side, dir, new Vector3(-sign, 0, 0)))
        arm.elbow.set(sign * 0.4, 0, 1)
        arm.grip = 0
        arm.shrug = 0.35
      }
    }
    reach({ L: from.shoulderL, R: from.shoulderR })
    // The shoulder rises with the arm, so the arm is aimed from where the shoulder ends up.
    for (let i = 0; i < 5; i++) { rig.solve(out); reach({ L: rig.pos.upperArmL, R: rig.pos.upperArmR }) }
  },
}

/** Half the angle between the legs in the straddle, in degrees. */
const STRADDLE = 52

/**
 * Pancake to the elbows: sitting with straight legs wide apart, kneecaps and
 * toes up, the pelvis rolls forward and the chest leads until both elbows
 * rest on the floor, the back long.
 */
export const pancakeElbows: Motion = {
  id: 'pancake-elbows',
  revision: 1,
  stage: 'low',
  planted: ['footL', 'footR'],
  kind: 'mobility',
  period: 6.6,
  camera: 'three-quarter',
  azimuth: 38,
  elevation: 17,
  beat: 0.38,
  standard: 'Legs straight and wide, kneecaps and toes pointing up; the pelvis rolls forward and the back stays long; both elbows rest on the floor.',
  effort: stretch,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const k = settle(t)
    // Sitting: the hip joints are a little above the floor, the backs of the knees and the heels on it.
    const hip = at(0, 0.088 * s)
    const heel = 0.056 * s
    const legs = (b.upperLeg + b.lowerLeg) * 0.9995
    const out2 = Math.sqrt(legs * legs - (hip.y - heel) ** 2)
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      const dir = new Vector3(sign * Math.sin(STRADDLE * deg), 0, Math.cos(STRADDLE * deg))
      leg.foot.set(sign * b.rest.upperLegL.x, heel, 0).addScaledVector(dir, out2)
      leg.rot.copy(footRot(new Vector3(0, 1, 0.12).normalize(), dir.clone().negate()))
      leg.knee.set(0, 1, 0)
      leg.toes = 0
    }
    const floor = 0.04 * s
    // Elbows in front of the shoulders, forearms flat and pointing forward: further in front as the chest comes down.
    const want = floor + b.upperArm * Math.cos(lerp(8, 26, k) * deg)
    const rest = (sh: Record<'L' | 'R', Vector3>) => {
      for (const [side, sign] of SIDES) {
        const arm = out.arm[side]
        const drop = Math.min(b.upperArm * 0.999, Math.max(0, sh[side].y - floor))
        const elbow = new Vector3(sh[side].x, floor, sh[side].z + Math.sqrt(b.upperArm ** 2 - drop ** 2))
        const inward = 0.03 * s
        arm.hand.set(elbow.x - sign * inward, floor - 0.004 * s, elbow.z + Math.sqrt(b.lowerArm ** 2 - inward ** 2 - (0.004 * s) ** 2))
        arm.rot.copy(handRot(side, new Vector3(-sign * 0.1, 0, 1).normalize(), new Vector3(0, -1, 0)))
        arm.elbow.set(sign * 0.05, -1, 0.1)
        arm.grip = 0.05
        arm.shrug = 0
      }
    }
    // The trunk rolls forward over the hips, pelvis first, until the shoulders are an upper arm above the floor.
    zeroOf((tip) => {
      out.pelvis.copy(pitch(52 + tip))
      out.chest.copy(pitch(66 + tip))
      out.head.copy(pitch(50 + tip))
      hipsAt(b, out.pelvis, hip, out.hips)
      const j = rig.joints(out.hips, out.pelvis, out.chest)
      rest({ L: j.shoulderL, R: j.shoulderR })
      for (let i = 0; i < 3; i++) { rig.solve(out); rest({ L: rig.pos.upperArmL, R: rig.pos.upperArmR }) }
      rig.solve(out)
      return shoulders(rig).y - want
    }, 0, 4, -45, 30)
  },
}

/** Where the feet stand in the bridge, worked out once per body from its deepest position: shins upright. */
const stood = new Map<string, number>()

/**
 * Full bridge: hands by the ears with the fingers towards the feet, feet
 * flat; pressed up to locked arms with the chest pushed over the hands and
 * the hips high, the head hanging clear of the floor.
 */
export const bridge: Motion = {
  id: 'bridge',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'footL', 'footR'],
  kind: 'mobility',
  period: 6.4,
  camera: 'side',
  azimuth: 70,
  elevation: 6,
  beat: 0.38,
  detail: { delt_post: 0.3, forearm_ext: 0.3 },
  standard: 'Arms locked; chest pushed through until the shoulders are over the hands; hips high with the glutes working, so the bend is shared along the whole spine; feet flat; head off the floor.',
  effort: (t) => 0.6 + 0.35 * settle(t),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const half = b.rest.upperArmL.x + 0.02 * s
    const full = (b.upperArm + b.lowerArm) * 0.9965
    const wrist = wristHeight(b)
    // Lying on the back the head is towards -Z: the hands are at z = 0, the feet further along +Z.
    const arch = (d: number) => {
      handsOnFloor(b, out, 0, half, new Vector3(0.45, 0, -1), 10)
      for (const [side] of SIDES) { out.arm[side].shrug = 0.6; out.arm[side].grip = 0.08 }
      out.pelvis.copy(pitch(-70 + 6 * (1 - d)))
      out.chest.copy(pitch(-142 + 12 * (1 - d)))
      out.head.copy(pitch(-166 + 12 * (1 - d)))
      // Eased off, the shoulders are behind the hands, towards the feet; pressed through, they are over them.
      const lean = lerp(13, 0, d) * deg
      const over = (aside: number) => {
        const up = Math.sqrt(Math.max(0, full * full - aside * aside))
        return new Vector3(0, wrist + up * Math.cos(lean), up * Math.sin(lean))
      }
      const first = over(half - b.rest.upperArmL.x)
      out.hips.set(0, first.y + 0.12 * s, first.z + 0.4 * s)
      shouldersAt(rig, out, first)
      // The shoulders rise towards the ears, which brings them together: measured, so the arms are exactly straight.
      shouldersAt(rig, out, over(Math.abs(out.arm.L.hand.x - rig.pos.upperArmL.x)))
    }
    let feet = stood.get(b.id)
    if (feet === undefined) {
      arch(1)
      const hip = rig.pos.upperLegL
      const rise = hip.y - (b.ankle + b.lowerLeg)
      feet = hip.z + Math.sqrt(Math.max(0, b.upperLeg ** 2 - rise ** 2))
      stood.set(b.id, feet)
    }
    feetFlat(b, out, feet, b.rest.upperLegL.x + 0.03 * s, new Vector3(0.1, 1, 0.3))
    arch(depth(t, 0.45))
  },
}

/** The mobility positions of the assessment, in the order they are met. */
export const MOBILITY: Motion[] = [toeTouch, deepLunge, overheadWallReach, pancakeElbows, bridge]
