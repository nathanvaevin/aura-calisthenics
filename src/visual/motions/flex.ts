/**
 * Range: hips, hamstrings, splits, the bridge with straight legs.
 *
 * The positions are shown as the mobility positions of the assessment are:
 * eased into on the out-breath, kept, eased off a little, never bounced.
 * Per-side exercises show the left leg in front.
 */
import { Quaternion, Vector3 } from 'three'
import type { Side } from '../body/skeleton'
import { footRot, handRot, pitch, yaw, type Body, type LegPose, type Rig } from '../rig'
import { SIDES, at, deg, handsOnFloor, hipsAt, legOnBall, shouldersAt, wristHeight } from './kit'
import { depth, feetFlat, handLength, settle, shoulders, stretch, zeroOf } from './mobility'
import { ease, lerp, there, type Motion } from './types'

const UP = new Vector3(0, 1, 0)
const legsOf = (b: Body) => b.upperLeg + b.lowerLeg

/** How far the hip joints are above the floor when the pelvis rests on it, for a body of scale 1. */
const SEAT = 0.088

/** The outline of a foot about its ankle, for a body of scale 1: heel, ball, toes, the top of the foot, the ankle bones. */
const FOOT: [number, number, number][] = [
  [0.03, -0.082, -0.05], [-0.03, -0.082, -0.05], [0.045, -0.078, 0.124], [-0.045, -0.078, 0.124],
  [0, -0.07, 0.2], [0, 0.044, 0.03], [0.04, 0, 0], [-0.04, 0, 0],
]
const corner = new Vector3()

/** How high the ankle is when a foot turned this way rests on the floor. */
function ankleOver(b: Body, rot: Quaternion): number {
  let low = 0
  for (const [x, y, z] of FOOT) low = Math.min(low, corner.set(x, y, z).applyQuaternion(rot).y)
  return -low * b.scale
}

/**
 * Turns a foot to suit the leg it is on, once the leg is solved: the toes
 * point where the kneecap faces, at right angles to the shin, then `point`
 * degrees further away from it.
 */
function footOnShin(rig: Rig, leg: LegPose, side: Side, point: number) {
  const knee = rig.pos[`lowerLeg${side}`]
  const shin = rig.pos[`foot${side}`].clone().sub(knee).normalize()
  const thigh = knee.clone().sub(rig.pos[`upperLeg${side}`]).normalize()
  const front = thigh.addScaledVector(shin, -thigh.dot(shin)).normalize()
  const c = Math.cos(point * deg), n = Math.sin(point * deg)
  leg.rot.copy(footRot(front.clone().multiplyScalar(c).addScaledVector(shin, n), shin.clone().multiplyScalar(-c).addScaledVector(front, n)))
}

// ── 90/90 hip switch ─────────────────────────────────────────────────────

/** Where the knees are: 1 with both down to the athlete's left, -1 to the right, with a pause on each side. */
const over = (t: number) => {
  const h = t < 0.5 ? t : 1 - t
  return 1 - 2 * ease(Math.min(1, Math.max(0, (h - 0.06) / 0.38)))
}
/** How far the pelvis turns to face the leg in front, degrees. */
const TURN = 72

/**
 * 90/90 hip switch: sitting with the heels planted wide and both knees bent
 * to a right angle, the knees roll over together until both legs lie on the
 * floor (the one in front turned out, the one to the side turned in), then
 * over to the other side. The chest stays tall and the hands stay off the
 * floor.
 */
export const hipSwitch: Motion = {
  id: 'hip-90-90',
  revision: 1,
  stage: 'low',
  kind: 'reps',
  period: 5.6,
  camera: 'front',
  azimuth: 16,
  elevation: 17,
  beat: 0.94,
  standard: 'Sitting tall with both knees bent to 90°; the heels stay where they are and both knees roll over until the legs lie on the floor, one turned out in front and one turned in to the side, then over to the other side; chest lifted, hands off the floor.',
  effort: (t) => 0.35 + 0.35 * Math.abs(over(t)),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const side = over(t)
    const flat = Math.abs(side)
    const a = side * 90 * deg
    // Hip to ankle with the knee at a right angle.
    const reach = Math.hypot(b.upperLeg, b.lowerLeg)
    const wide = 0.5 * legsOf(b)
    const turn = yaw(TURN * side)
    out.pelvis.copy(turn).multiply(pitch(lerp(-5, 3, flat)))
    out.chest.copy(turn).multiply(pitch(lerp(2, 4, flat)))
    out.head.copy(turn).multiply(pitch(2))
    const seat = at(0, SEAT * s)
    hipsAt(b, out.pelvis, seat, out.hips)
    const j = rig.joints(out.hips, out.pelvis, out.chest)
    const off = { L: j.hipL.sub(seat), R: j.hipR.sub(seat) }
    const ankle = { L: new Vector3(wide, 0.09 * s, 0), R: new Vector3(-wide, 0.09 * s, 0) }
    for (let i = 0; i < 4; i++) {
      // The pelvis sits where both knees are at a right angle: each hip joint the same distance from its heel.
      const [l, r] = SIDES.map(([sd]) => ({
        x: ankle[sd].x - off[sd].x, z: ankle[sd].z - off[sd].z,
        r: Math.sqrt(reach ** 2 - (seat.y + off[sd].y - ankle[sd].y) ** 2),
      }))
      const dx = r.x - l.x, dz = r.z - l.z, d = Math.hypot(dx, dz)
      const along = (l.r ** 2 - r.r ** 2 + d * d) / (2 * d)
      const behind = Math.sqrt(Math.max(0, l.r ** 2 - along ** 2))
      seat.set(l.x + (along * dx - behind * dz) / d, seat.y, l.z + (along * dz + behind * dx) / d)
      hipsAt(b, out.pelvis, seat, out.hips)
      for (const [sd] of SIDES) {
        const leg = out.leg[sd]
        leg.foot.copy(ankle[sd])
        // The knee turns about the line from hip to heel: straight up in the middle, level with the floor at either side.
        const line = ankle[sd].clone().sub(seat).sub(off[sd]).setY(0).normalize()
        leg.knee.crossVectors(UP, line).multiplyScalar(Math.sin(a)).addScaledVector(UP, Math.cos(a))
        leg.toes = 0
      }
      rig.solve(out)
      // The foot follows its shin: on the heel with the knees up, on its edge with the leg lying down.
      for (const [sd] of SIDES) {
        footOnShin(rig, out.leg[sd], sd, lerp(24, 18, flat))
        ankle[sd].y = ankleOver(b, out.leg[sd].rot)
      }
    }
    // Hands together in front of the chest, which turns with the pelvis.
    const chest = shoulders(rig)
    for (const [sd, sign] of SIDES) {
      const arm = out.arm[sd]
      arm.hand.set(sign * 0.016 * s, -0.15 * s, 0.23 * s).applyQuaternion(turn).add(chest)
      arm.elbow.set(sign * 0.7, -1, 0.1).applyQuaternion(turn)
      arm.rot.copy(turn).multiply(handRot(sd, new Vector3(0, 0.72, 0.69), new Vector3(-sign, 0, 0)))
      arm.grip = 0.04
      arm.shrug = -0.1
    }
  },
}

// ── Lunge with rotation ──────────────────────────────────────────────────

/**
 * Lunge with rotation, left leg in front: a long lunge with the back leg
 * straight and the right hand on the floor inside the front foot; the left
 * elbow is lowered to the instep, then the chest turns open and the left arm
 * reaches to the ceiling, the eyes following the hand.
 */
export const lungeRotation: Motion = {
  id: 'worlds-greatest-stretch',
  revision: 1,
  stage: 'square',
  planted: ['footL', 'toesR', 'handR'],
  kind: 'reps',
  period: 5.2,
  camera: 'three-quarter',
  azimuth: 48,
  elevation: 8,
  beat: 0.42,
  // The front of the hip that is stretched is the back leg's; the inner thigh and the back of the thigh, the front leg's.
  detail: { 'hip_flexors.L': 0.12, 'adductors.R': 0.3, 'hamstrings.R': 0.15 },
  standard: 'Long lunge with the back leg straight and the hips low and square; front knee over the foot, not falling inwards; the supporting arm straight; the elbow goes down to the instep, then the turn comes from the upper back until the arm points at the ceiling, the eyes following the hand.',
  effort: (t) => 0.4 + 0.5 * there(t, 0.42, 0.1),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = there(t, 0.42, 0.1)
    const half = b.rest.upperLegL.x
    const hip = at(0, b.ankle + b.lowerLeg * 0.9)
    // In front: the foot flat and outside the shoulder, the shin upright, the knee out over the foot.
    const lead = out.leg.L
    const footX = half + 0.19 * s
    const rise = b.ankle + b.lowerLeg - hip.y
    const footZ = Math.sqrt(b.upperLeg ** 2 - rise ** 2 - (footX - half) ** 2)
    const toes = new Vector3(Math.sin(14 * deg), 0, Math.cos(14 * deg))
    lead.foot.set(footX, b.ankle, footZ)
    lead.rot.copy(footRot(toes, UP))
    // Over the ankle, which is out over the foot: not fallen inwards.
    lead.knee.set(footX, b.ankle + b.lowerLeg, footZ).sub(new Vector3(half, hip.y, 0).add(lead.foot).multiplyScalar(0.5))
    lead.toes = 0
    // Behind: straight, on the ball of the foot.
    const pad = 0.014 * s
    const far = 0.915 * (legsOf(b) + b.ball.length())
    legOnBall(b, new Vector3(-half, hip.y, 0), at(-Math.sqrt(far ** 2 - (hip.y - pad) ** 2), pad, -half - 0.01 * s), new Vector3(0, 1, -0.4), out.leg.R)
    out.leg.R.knee.set(0, -1, 0.3)
    // The supporting hand, flat inside the front foot.
    const full = (b.upperArm + b.lowerArm) * 0.9965
    const support = out.arm.R
    support.hand.set(-0.12 * s, wristHeight(b), 0.9 * b.trunk)
    support.rot.copy(handRot('R', new Vector3(-0.1, 0, 1).normalize(), new Vector3(0, -1, 0)))
    support.elbow.set(-1, 0, -0.6)
    support.grip = 0.04
    support.shrug = 0.3
    const twist = lerp(-30, 66, u)
    const reach = out.arm.L
    const lift = new Vector3()
    const place = (tip: number) => {
      out.pelvis.copy(pitch(66 - 0.25 * tip))
      out.chest.copy(pitch(90 - tip)).multiply(yaw(twist))
      out.head.copy(out.chest).multiply(yaw(lerp(0, 62, u))).multiply(pitch(lerp(-14, -6, u)))
      hipsAt(b, out.pelvis, hip, out.hips)
      for (let i = 0; i < 3; i++) {
        rig.solve(out)
        const sh = rig.pos.upperArmL
        // Lowered: the upper arm hangs to the instep and the forearm lies forward beside the foot.
        const elbow = sh.clone().addScaledVector(new Vector3(0.1, -1, -0.08).normalize(), b.upperArm)
        const low = elbow.clone().addScaledVector(new Vector3(-0.12, -0.3, 1).normalize(), b.lowerArm)
        low.y = Math.max(low.y, wristHeight(b) + 0.008 * s)
        const from = low.sub(sh)
        const length = lerp(from.length(), full, ease(Math.min(1, u / 0.6)))
        // Raised: straight up from the shoulder. On the way it swings out to the side, clear of the knee.
        lift.copy(from.normalize()).multiplyScalar((1 - u) ** 2).addScaledVector(new Vector3(0.85, 0.25, 0.5), 2 * u * (1 - u)).addScaledVector(UP, u * u).normalize()
        reach.hand.copy(sh).addScaledVector(lift, length)
        reach.elbow.set(lerp(0.1, 0.4, u), lerp(-1, -0.3, u), lerp(-0.4, -1, u))
        const palm = new Vector3(0, -1, 0).lerp(new Vector3(1, 0, 0.3), u).normalize()
        reach.rot.copy(handRot('L', new Vector3(-0.12, 0, 1).lerp(lift, Math.min(1, 2.5 * u)).normalize(), palm))
        reach.grip = 0.05
        reach.shrug = 0.4 * u
      }
      rig.solve(out)
      return rig.pos.upperArmR.distanceTo(support.hand) - full
    }
    // The trunk rises as it turns: exactly as far as keeps the supporting arm straight.
    zeroOf(place, lerp(0, 30, u), 4, -30, 70)
  },
}

// ── Palms to the floor ───────────────────────────────────────────────────

/**
 * Palms-to-floor fold: standing with the knees locked and the hips over the
 * feet, folded at the hips until both palms lie flat on the floor beside the
 * feet; the elbows bend back as the chest is drawn towards the shins.
 */
export const palmsFloor: Motion = {
  id: 'palms-floor-fold',
  revision: 1,
  stage: 'square',
  planted: ['footL', 'footR', 'handL', 'handR'],
  kind: 'mobility',
  period: 6.2,
  camera: 'side',
  azimuth: 74,
  elevation: 5,
  beat: 0.38,
  standard: 'Knees locked the whole time; hips over the feet, not drifting back; both whole palms flat on the floor beside the feet; the chest is drawn towards the shins and the neck hangs relaxed; no bouncing.',
  effort: stretch,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const k = settle(t)
    const half = b.rest.upperLegL.x
    const back = 0.03 * s
    const legs = legsOf(b) * 0.9995
    feetFlat(b, out, 0, half)
    // Palms beside the feet, fingers forward.
    handsOnFloor(b, out, 0.04 * s, half + 0.13 * s, new Vector3(0.3, 0, -1), 4)
    for (const [side] of SIDES) out.arm[side].shrug = 0.2
    const hip = at(-back, b.ankle + Math.sqrt(legs * legs - back * back))
    // Folded at the hips, the spine only finishing it; drawing the chest to the shins folds the elbows back past the calves.
    out.pelvis.copy(pitch(lerp(135, 142, k)))
    out.chest.copy(pitch(lerp(160, 167, k)))
    out.head.copy(pitch(lerp(168, 176, k)))
    hipsAt(b, out.pelvis, hip, out.hips)
  },
}

// ── Seated pike ──────────────────────────────────────────────────────────

/**
 * Seated pike fold: sitting with the legs straight and together, toes pulled
 * back, the pelvis tips forward and the chest goes long over the thighs
 * towards the shins, the hands holding the feet.
 */
export const seatedPike: Motion = {
  id: 'seated-pike',
  revision: 1,
  stage: 'low',
  planted: ['footL', 'footR', 'handL', 'handR'],
  kind: 'mobility',
  period: 6.4,
  camera: 'side',
  azimuth: 68,
  elevation: 8,
  beat: 0.38,
  standard: 'Knees locked with the kneecaps up and the toes pulled back; the fold comes from the pelvis tipping forward and the back stays long; the chest rests on the thighs, reaching for the shins rather than the head for the knees.',
  effort: stretch,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const k = settle(t)
    const half = b.rest.upperLegL.x
    const hip = at(0, SEAT * s)
    const legs = legsOf(b) * 0.9995
    // Heels on the floor, toes up and drawn back towards the shins.
    const turn = footRot(new Vector3(0, 1, -0.2).normalize(), new Vector3(0, 0, -1))
    const heel = ankleOver(b, turn)
    const close = 0.055 * s
    const far = Math.sqrt(legs ** 2 - (hip.y - heel) ** 2 - (half - close) ** 2)
    out.pelvis.copy(pitch(lerp(50, 62, k)))
    out.chest.copy(pitch(lerp(62, 78, k)))
    out.head.copy(pitch(lerp(56, 73, k)))
    hipsAt(b, out.pelvis, hip, out.hips)
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      leg.foot.set(sign * close, heel, far)
      leg.rot.copy(turn)
      leg.knee.set(0, 1, 0)
      leg.toes = 12
      // The hands hold the outsides of the feet.
      const arm = out.arm[side]
      arm.hand.set(sign * (close + 0.062 * s), heel + 0.1 * s, far + 0.02 * s)
      arm.rot.copy(handRot(side, new Vector3(-sign * 0.35, 0.2, 0.9).normalize(), new Vector3(-sign, 0, -0.25).normalize()))
      arm.elbow.set(sign, -0.5, -0.2)
      arm.grip = 0.5
      arm.shrug = 0.2
    }
  },
}

// ── Pancake ──────────────────────────────────────────────────────────────

/** Half the angle between the legs in the full pancake, in degrees. */
const STRADDLE = 60

/**
 * Full pancake: sitting with straight legs wide apart, kneecaps and toes up,
 * the pelvis rolls forward and the chest goes long and flat to the floor
 * between the legs, the arms reaching out in front.
 */
export const pancake: Motion = {
  id: 'pancake',
  revision: 1,
  stage: 'low',
  planted: ['footL', 'footR'],
  kind: 'mobility',
  period: 6.6,
  camera: 'three-quarter',
  azimuth: 38,
  elevation: 17,
  beat: 0.38,
  standard: 'Legs straight and wide, kneecaps and toes pointing up; the pelvis rolls forward first and the back stays long; the chest rests on the floor between the legs.',
  effort: stretch,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const k = settle(t)
    const hip = at(0, SEAT * s)
    const legs = legsOf(b) * 0.9995
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      const dir = new Vector3(sign * Math.sin(STRADDLE * deg), 0, Math.cos(STRADDLE * deg))
      leg.rot.copy(footRot(new Vector3(0, 1, 0.12).normalize(), dir.clone().negate()))
      const heel = ankleOver(b, leg.rot)
      leg.foot.set(sign * b.rest.upperLegL.x, heel, 0).addScaledVector(dir, Math.sqrt(legs * legs - (hip.y - heel) ** 2))
      leg.knee.set(0, 1, 0)
      leg.toes = 0
    }
    const full = (b.upperArm + b.lowerArm) * 0.985
    const wrist = wristHeight(b)
    const aside = 0.07 * s
    // The arms lie out in front, palms down: the hands slide forward as the chest comes down.
    const lay = (sh: Record<'L' | 'R', Vector3>) => {
      for (const [side, sign] of SIDES) {
        const arm = out.arm[side]
        const drop = sh[side].y - wrist
        arm.hand.set(sh[side].x + sign * aside, wrist, sh[side].z + Math.sqrt(Math.max(0, full ** 2 - drop ** 2 - aside ** 2)))
        arm.rot.copy(handRot(side, new Vector3(sign * 0.08, 0, 1).normalize(), new Vector3(0, -1, 0)))
        arm.elbow.set(sign * 0.8, 0.6, 0)
        arm.grip = 0.03
        arm.shrug = 0.5
      }
    }
    // The trunk rolls forward over the hips, pelvis first, until the chest is on the floor.
    const want = lerp(0.235, 0.13, k) * s
    zeroOf((tip) => {
      out.pelvis.copy(pitch(62 + tip))
      out.chest.copy(pitch(76 + tip))
      out.head.copy(pitch(50 + tip))
      hipsAt(b, out.pelvis, hip, out.hips)
      const j = rig.joints(out.hips, out.pelvis, out.chest)
      lay({ L: j.shoulderL, R: j.shoulderR })
      for (let i = 0; i < 3; i++) { rig.solve(out); lay({ L: rig.pos.upperArmL, R: rig.pos.upperArmR }) }
      rig.solve(out)
      return shoulders(rig).y - want
    }, 8, 4, -30, 40)
  },
}

// ── Splits ───────────────────────────────────────────────────────────────

/** How far the hips are held off the floor when a split is eased off, for a body of scale 1. */
const EASED = 0.03

/** How far out to the side the hands steady the front split, worked out once per body. */
const steadied = new Map<string, number>()

/**
 * Front split, left leg in front: that leg straight ahead with the kneecap
 * up, the right leg straight behind with the kneecap and the top of the foot
 * down, the hips square and on the floor, the trunk upright over them.
 */
export const frontSplit: Motion = {
  id: 'front-split',
  revision: 1,
  stage: 'low',
  planted: ['footL', 'footR', 'handL', 'handR'],
  kind: 'mobility',
  period: 6.6,
  camera: 'side',
  azimuth: 62,
  elevation: 9,
  beat: 0.38,
  // In front it is the back of the thigh and the seat that are stretched; behind, the front of the hip and thigh.
  detail: { 'hamstrings.R': 0.15, 'glutes.R': 0.12, 'glute_med.R': 0.1, 'hip_flexors.L': 0.12, 'quads.L': 0.12 },
  standard: 'Front leg straight with the kneecap up; back leg straight with the kneecap and the top of the foot down; hips square to the front and resting on the floor; trunk upright, the hands only steadying.',
  effort: stretch,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const k = settle(t)
    const half = b.rest.upperLegL.x
    const legs = legsOf(b) * 0.9995
    const hip = at(0, (SEAT + EASED * (1 - k)) * s)
    // The pelvis tips forward a little over the back leg and the lower back takes it up: the trunk stays upright.
    out.pelvis.copy(pitch(16))
    out.chest.copy(pitch(-3))
    out.head.copy(pitch(0))
    hipsAt(b, out.pelvis, hip, out.hips)
    const lead = out.leg.L
    lead.rot.copy(footRot(new Vector3(0, 1, 0.3).normalize(), new Vector3(0, 0, -1)))
    lead.foot.set(half, ankleOver(b, lead.rot), 0)
    lead.foot.z = Math.sqrt(legs ** 2 - (hip.y - lead.foot.y) ** 2)
    lead.knee.set(0, 1, 0)
    lead.toes = 0
    const rear = out.leg.R
    rear.rot.copy(pitch(176))
    rear.foot.set(-half, 0.046 * s, 0)
    rear.foot.z = -Math.sqrt(legs ** 2 - (hip.y - rear.foot.y) ** 2)
    rear.knee.set(0, -1, 0)
    rear.toes = 0
    // Fingertips on the floor out to either side of the hips: they steady, they do not carry.
    const wrist = handLength(b) * 0.56
    const hands = (aside: number) => {
      for (const [side, sign] of SIDES) {
        const arm = out.arm[side]
        arm.hand.set(sign * aside, wrist, 0.06 * s)
        arm.rot.copy(handRot(side, new Vector3(sign * 0.4, -0.5, 0.77).normalize(), new Vector3(0, -0.85, -0.5).normalize()))
        arm.elbow.set(sign * 0.3, 0, -1)
        arm.grip = 0.06
        arm.shrug = -0.2
      }
    }
    // Placed once per body, from the highest the hips go: there the arm is all but straight; lower, the elbow gives.
    let aside = steadied.get(b.id)
    if (aside === undefined) {
      const high = out.hips.clone()
      hipsAt(b, out.pelvis, at(0, (SEAT + EASED) * s), out.hips)
      aside = half + 0.3 * s
      const reach = (b.upperArm + b.lowerArm) * 0.985
      for (let i = 0; i < 4; i++) {
        hands(aside)
        rig.solve(out)
        const sh = rig.pos.upperArmL
        const flat = reach ** 2 - (sh.y - wrist) ** 2 - (sh.z - 0.06 * s) ** 2
        aside = Math.min(half + 0.3 * s, sh.x + Math.sqrt(Math.max(0, flat)))
      }
      steadied.set(b.id, aside)
      out.hips.copy(high)
    }
    hands(aside)
  },
}

/**
 * Middle split: both legs straight out to the sides in one line with the
 * hips, kneecaps and toes up, the pelvis on the floor; the trunk leans
 * forward a little onto straight arms.
 */
export const middleSplit: Motion = {
  id: 'middle-split',
  revision: 1,
  stage: 'low',
  planted: ['footL', 'footR', 'handL', 'handR'],
  kind: 'mobility',
  period: 6.6,
  camera: 'front',
  azimuth: 20,
  elevation: 15,
  beat: 0.38,
  standard: 'Both legs straight and in one line with the hips, which are between the heels, not behind them; kneecaps and toes pointing up; pelvis resting on the floor; the hands on the floor in front only support.',
  effort: stretch,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const k = settle(t)
    const legs = legsOf(b) * 0.9995
    const hip = at(0, (SEAT + EASED * (1 - k)) * s)
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      leg.rot.copy(footRot(new Vector3(sign * 0.12, 1, 0).normalize(), new Vector3(-sign, 0, 0)))
      const heel = ankleOver(b, leg.rot)
      leg.foot.set(sign * (b.rest.upperLegL.x + Math.sqrt(legs ** 2 - (hip.y - heel) ** 2)), heel, 0)
      leg.knee.set(0, 1, 0)
      leg.toes = 0
    }
    // Palms on the floor in front, under straight arms: the trunk leans exactly as far as that takes.
    const full = (b.upperArm + b.lowerArm) * 0.9965
    handsOnFloor(b, out, 0.3 * s, b.rest.upperArmL.x * 0.95, new Vector3(0.6, 0, -1), 6)
    for (const [side] of SIDES) out.arm[side].shrug = 0.1
    zeroOf((tip) => {
      out.pelvis.copy(pitch(4 + 0.7 * tip))
      out.chest.copy(pitch(6 + tip))
      out.head.copy(pitch(0.4 * tip))
      hipsAt(b, out.pelvis, hip, out.hips)
      rig.solve(out)
      return rig.pos.upperArmL.distanceTo(out.arm.L.hand) - full
    }, 22, 3, -10, 60)
  },
}

// ── Straight-leg bridge ──────────────────────────────────────────────────

/** Where the feet stand in the straight-leg bridge, worked out once per body from its deepest position. */
const walked = new Map<string, number>()

/**
 * Straight-leg bridge: from a full bridge the feet are walked away until the
 * knees lock. Arms locked, feet together and flat, the chest pushed through
 * until the shoulders are over the wrists.
 */
export const straightBridge: Motion = {
  id: 'straight-bridge',
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
  standard: 'Arms locked and legs locked; feet together and flat; the chest pushed through until the shoulders are over the wrists, not behind them; hips high; head off the floor.',
  effort: (t) => 0.65 + 0.3 * settle(t),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const half = b.rest.upperArmL.x + 0.02 * s
    const full = (b.upperArm + b.lowerArm) * 0.9965
    const legs = legsOf(b) * 0.9992
    const wrist = wristHeight(b)
    const together = 0.05 * s
    // Lying on the back the head is towards -Z: the hands are at z = 0, the feet further along +Z.
    const arch = (d: number, tilt: number) => {
      handsOnFloor(b, out, 0, half, new Vector3(0.45, 0, -1), 10)
      for (const [side] of SIDES) { out.arm[side].shrug = 0.7; out.arm[side].grip = 0.08 }
      out.pelvis.copy(pitch(-58 + 5 * (1 - d) + tilt))
      out.chest.copy(pitch(-140 + 10 * (1 - d) + tilt))
      out.head.copy(pitch(-164 + 10 * (1 - d) + tilt))
      // Eased off, the shoulders are behind the hands, towards the feet; pressed through, they are over them.
      const lean = lerp(11, 0, d) * deg
      const over = (aside: number) => {
        const up = Math.sqrt(Math.max(0, full * full - aside * aside))
        return new Vector3(0, wrist + up * Math.cos(lean), up * Math.sin(lean))
      }
      const first = over(half - b.rest.upperArmL.x)
      out.hips.set(0, first.y + 0.12 * s, first.z + 0.4 * s)
      shouldersAt(rig, out, first)
      shouldersAt(rig, out, over(Math.abs(out.arm.L.hand.x - rig.pos.upperArmL.x)))
    }
    const reach = (hip: Vector3) => Math.sqrt(Math.max(0, legs ** 2 - (hip.y - b.ankle) ** 2 - (hip.x - together) ** 2))
    let feet = walked.get(b.id)
    if (feet === undefined) {
      arch(1, 0)
      feet = rig.pos.upperLegL.z + reach(rig.pos.upperLegL)
      walked.set(b.id, feet)
    }
    feetFlat(b, out, feet, together, new Vector3(0.05, 1, 0.3))
    // Hands and feet stay where they are and nothing bends: the trunk turns about the shoulders as far as the straight legs allow.
    const d = depth(t, 0.4)
    zeroOf((tilt) => {
      arch(d, tilt)
      return rig.pos.upperLegL.distanceTo(out.leg.L.foot) - legs
    }, 0, 2, -30, 30)
  },
}

/** Range of motion, easiest first. */
export const FLEX: Motion[] = [hipSwitch, lungeRotation, palmsFloor, seatedPike, pancake, frontSplit, middleSplit, straightBridge]
