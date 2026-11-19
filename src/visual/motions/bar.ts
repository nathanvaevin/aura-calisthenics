/**
 * On the high bar: the pulls beside the strict pull-up, the hanging core
 * work, the tucked front levers and the muscle-up.
 *
 * Everything here hangs from the same bar as the pull-up. The hands stay
 * where they are; the shoulders are placed and the rest follows.
 */
import { Vector3 } from 'three'
import type { Side } from '../body/skeleton'
import { handRot, pitch, type Body, type Pose, type Rig } from '../rig'
import { highBar } from './hang'
import { SIDES, gripAt, handsOnBar, shouldersAt } from './kit'
import { ease, lerp, there, type Motion, type Prop } from './types'

const D = Math.PI / 180
const bar = (b: Body): Prop[] => [{ kind: 'bar', ...highBar(b) }]

/** A direction in the plane of the body, `a` degrees forward of straight down: 90 is level in front, 180 straight up. */
const down = (a: number) => new Vector3(0, -Math.cos(a * D), Math.sin(a * D))
/** The front of a limb that hangs along `down(a)`: where its knee points. */
const front = (a: number) => new Vector3(0, Math.sin(a * D), Math.cos(a * D))

/**
 * Both legs in the plane of the body: the thigh `hip` degrees forward of
 * straight down, the knee folded by `knee` degrees, toes pointed. Needs the
 * trunk solved first.
 */
function legs(rig: Rig, out: Pose, hip: number, knee = 0, point = 46) {
  const b = rig.body
  const shin = hip - knee
  for (const [side] of SIDES) {
    const leg = out.leg[side]
    const joint = rig.pos[`upperLeg${side}`]
    if (knee < 1) leg.foot.copy(joint).addScaledVector(down(hip), (b.upperLeg + b.lowerLeg) * 0.999)
    else leg.foot.copy(joint).addScaledVector(down(hip), b.upperLeg).addScaledVector(down(shin), b.lowerLeg)
    leg.knee.copy(front(hip))
    leg.rot.copy(pitch(-shin + point))
    leg.toes = -18
  }
}

interface Hung {
  /** 0 a hang on straight arms, 1 the top of the pull. */
  u: number
  /** How far the shoulders are pulled down from the ears in the hang: 0 relaxed, 1 set, more for a scapular pull. */
  active: number
  grip?: 'over' | 'under'
  /** Each hand this far outside its shoulder (metres on the reference body, like the rest). */
  wide?: number
  /** The shoulders at the top: this far below the wrists, and this far behind them. */
  top?: [number, number]
  /** With straight arms: the shoulders this far behind the hands, as when the legs are raised in front. */
  back?: number
  /** Pitch of the chest, the pelvis and the head, in the hang and at the top. */
  lean?: [number, number]
  tilt?: [number, number]
  look?: [number, number]
  /** Where the elbows point: out, down, and forward in the hang and at the top. */
  elbow?: [number, number, number, number]
  /** How far the path bows back from the bar on the way up. */
  arc?: number
}

/** Trunk and arms of a body hanging from the high bar. The legs are the caller's. */
function hung(rig: Rig, out: Pose, o: Hung) {
  const b = rig.body
  const s = b.scale
  const half = b.rest.upperArmL.x + (o.wide ?? 0.125) * s
  handsOnBar(b, out, highBar(b), half, o.grip)
  const wrist = out.arm.L.hand
  const reach = (b.upperArm + b.lowerArm) * 0.9985
  const back = (o.back ?? 0) * s - 0.004 * s
  const [below, behind] = o.top ?? [0.04, 0.08]
  const high = new Vector3(0, wrist.y - below * s, wrist.z - behind * s)
  const u = o.u
  const aim = (aside: number) => {
    const target = new Vector3(0, wrist.y - Math.sqrt(Math.max(0, reach ** 2 - aside ** 2 - back ** 2)), wrist.z - back).lerp(high, u)
    target.z -= Math.sin(u * Math.PI) * (o.arc ?? 0.02) * s
    return target
  }
  const [lean, tilt, look, elbow] = [o.lean ?? [1, -13], o.tilt ?? [5, 0], o.look ?? [-4, -16], o.elbow ?? [1, -0.5, 0.5, -0.15]]
  out.chest.copy(pitch(lerp(lean[0], lean[1], u)))
  out.pelvis.copy(pitch(lerp(tilt[0], tilt[1], u)))
  out.head.copy(pitch(lerp(look[0], look[1], ease(u))))
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    arm.elbow.set(sign * elbow[0], elbow[1], lerp(elbow[2], elbow[3], u))
    arm.shrug = lerp(1 - 1.2 * o.active, -0.9, u)
  }
  const first = aim(half - b.rest.upperArmL.x)
  out.hips.set(0, first.y - b.trunk, first.z)
  shouldersAt(rig, out, first)
  // The shoulders move in and out as they rise and set: measured, so that straight arms are exactly straight.
  shouldersAt(rig, out, aim(Math.abs(wrist.x - rig.pos.upperArmL.x)))
}

const GRIP = { forearm_flex: 0.5, forearm_ext: 0.3 }

/**
 * Scapular pull-up: the arms stay locked; only the shoulder blades move,
 * from relaxed up by the ears to pulled firmly down, and the body rises a
 * few centimetres with them. A pause at the top.
 */
export const scapPull: Motion = {
  id: 'scap-pull',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 3.6,
  camera: 'back',
  azimuth: 160,
  elevation: 2,
  beat: 0.34,
  props: bar,
  standard: 'Arms straight the whole time; the shoulders pull down away from the ears and the body visibly rises; a one-second pause at the top; lowered slowly, no bounce.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.28, 0.28),
  pose(t, rig, out) {
    const u = there(t, 0.28, 0.28)
    hung(rig, out, { u: 0, active: 0.05 + 1.5 * u, lean: [1 - 4 * u, 0], tilt: [5 - 2 * u, 0], look: [-4 - 4 * u, 0] })
    legs(rig, out, 9 + 3 * u)
  },
}

/**
 * Negative pull-up: start with the chin over the bar and lower, evenly, for
 * five seconds to a full hang. Getting back up is not part of the
 * exercise: the athlete steps or jumps, shown here as a quick return.
 */
export const negativePullup: Motion = {
  id: 'negative-pullup',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 7.4,
  camera: 'back',
  azimuth: 152,
  elevation: 2,
  beat: 0.74,
  props: bar,
  detail: { ...GRIP, rear_cuff: 0.6 },
  standard: 'Starts with the chin over the bar; lowered evenly for at least five seconds, no drop through the middle; finishes in a full hang with straight arms.',
  effort: (t) => (t < 0.72 ? 0.75 + 0.25 * Math.sin((t / 0.72) * Math.PI) : 0.2),
  pose(t, rig, out) {
    // Down for most of the cycle, at a steady pace; a moment in the hang; then back to the top.
    const lowering = Math.min(1, t / 0.72)
    const back = t < 0.82 ? 0 : ease((t - 0.82) / 0.18)
    const u = t < 0.72 ? 1 - (0.85 * lowering + 0.15 * ease(lowering)) : back
    hung(rig, out, { u: Math.max(0, (u - 0.08) / 0.92), active: t < 0.72 ? Math.min(1, u / 0.08) : back })
    // The jump back up: the knees give and the legs trail.
    const jump = Math.sin(back * Math.PI)
    legs(rig, out, lerp(9, 14, u) + 10 * jump, 34 * jump)
  },
}

/**
 * Chin-up: palms towards the face, hands at shoulder width. From straight
 * arms to the chin over the bar; the elbows stay in front of the body.
 */
export const chinUp: Motion = {
  id: 'chin-up',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 3.4,
  camera: 'three-quarter',
  azimuth: 30,
  elevation: 2,
  beat: 0.5,
  props: bar,
  detail: GRIP,
  standard: 'Underhand grip at shoulder width; starts from a dead hang with straight arms; chin clearly over the bar; no kip or leg swing; lowered to straight arms.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.4, 0.1),
  pose(t, rig, out) {
    const p = there(t, 0.4, 0.1)
    const u = Math.max(0, (p - 0.08) / 0.92)
    hung(rig, out, { u, active: Math.min(1, p / 0.08), grip: 'under', wide: 0.012, top: [0.045, 0.15], elbow: [0.32, -1, 0.6, 0.45], lean: [1, -11], look: [-4, -14], arc: 0.1 })
    legs(rig, out, lerp(9, 14, u))
  },
}

/**
 * Chest-to-bar pull-up: a strict pull-up taken higher, until the top of the
 * chest meets the bar. The trunk leans back and the elbows finish behind it.
 */
export const chestToBar: Motion = {
  id: 'chest-to-bar',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 3.6,
  camera: 'back',
  azimuth: 148,
  elevation: 2,
  beat: 0.5,
  props: bar,
  detail: { ...GRIP, rear_cuff: 0.8 },
  standard: 'From a dead hang with straight arms; the chest, not the chin, comes to the bar; elbows finish behind the body; no kip or kick; lowered to straight arms.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.4, 0.1),
  pose(t, rig, out) {
    const p = there(t, 0.4, 0.1)
    const u = Math.max(0, (p - 0.08) / 0.92)
    hung(rig, out, { u, active: Math.min(1, p / 0.08), top: [-0.115, 0.12], lean: [1, -27], tilt: [5, -9], look: [-4, -30], elbow: [1, -0.55, 0.5, -0.75], arc: 0.035 })
    legs(rig, out, lerp(9, 18, u))
  },
}

/**
 * Hanging knee raise: from an active hang the knees come up past hip
 * height, and the pelvis curls up after them. The body does not swing.
 */
export const hangingKneeRaise: Motion = {
  id: 'hanging-knee-raise',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 3.4,
  camera: 'side',
  azimuth: 62,
  elevation: 3,
  beat: 0.42,
  props: bar,
  standard: 'Shoulders set, arms straight; knees above hip height with the pelvis curled up, not only the thighs lifted; lowered slowly; the body does not swing.',
  effort: (t) => 0.25 + 0.75 * there(t, 0.36, 0.1),
  pose(t, rig, out) {
    const c = there(t, 0.36, 0.1)
    hung(rig, out, { u: 0, active: 0.85, back: 0.035 * c, lean: [1 - 5 * c, 0], tilt: [5 - 31 * c, 0], look: [-4 + 6 * c, 0] })
    legs(rig, out, lerp(8, 116, c), lerp(4, 108, c), lerp(46, 30, c))
  },
}

/**
 * Hanging leg raise: straight legs lifted to level, toes pointed, and let
 * down over three seconds.
 */
export const hangingLegRaise: Motion = {
  id: 'hanging-leg-raise',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 5.4,
  camera: 'side',
  azimuth: 62,
  elevation: 3,
  beat: 0.3,
  props: bar,
  standard: 'Legs straight and together, toes pointed; raised to horizontal; no swing to start it; about three seconds down to a still hang.',
  effort: (t) => 0.25 + 0.75 * there(t, 0.26, 0.06),
  pose(t, rig, out) {
    const c = there(t, 0.26, 0.06)
    hung(rig, out, { u: 0, active: 0.9, back: 0.06 * c, lean: [1 - 8 * c, 0], tilt: [5 - 23 * c, 0], look: [-4 + 5 * c, 0] })
    legs(rig, out, lerp(8, 92, c))
  },
}

/** How far the toes reach past the ankle with the foot pointed: along the leg, and to its front. */
const toeReach = (b: Body) => [0.2 * b.scale, 0.079 * b.scale]

/** The lean of the trunk at the top of a toes-to-bar that puts the toes on the bar. Worked out once per body. */
const leans = new Map<string, { lean: number; legs: number }>()
function topOfToesToBar(rig: Rig): { lean: number; legs: number } {
  const b = rig.body
  const known = leans.get(b.id)
  if (known) return known
  const rail = highBar(b)
  const [along, across] = toeReach(b)
  const need = Math.hypot((b.upperLeg + b.lowerLeg) * 0.999 + along, across)
  const touch = new Vector3(0, rail.height - rail.radius - 0.012 * b.scale, 0)
  const out = scratch()
  const gap = (lean: number) => {
    toesToBarTrunk(rig, out, 1, lean)
    return hipsMid(rig).distanceTo(touch) - need
  }
  let a = -20, fa = gap(a), z = -45, fz = gap(z)
  for (let i = 0; i < 12 && Math.abs(fz) > 2e-4 && fz !== fa; i++) {
    const next = Math.max(-80, Math.min(0, z - (fz * (z - a)) / (fz - fa)))
    a = z; fa = fz; z = next; fz = gap(z)
  }
  const to = touch.sub(hipsMid(rig))
  // The toes sit a little to the front of the leg's own line.
  const result = { lean: z, legs: ((Math.atan2(to.z, -to.y) / D + 360) % 360) - Math.atan2(across, need) / D }
  leans.set(b.id, result)
  return result
}
const hipsMid = (rig: Rig) => rig.pos.upperLegL.clone().add(rig.pos.upperLegR).multiplyScalar(0.5)
const SPREAD = 22

/** The trunk of a toes-to-bar, `e` of the way up, for a given lean at the top. */
function toesToBarTrunk(rig: Rig, out: Pose, e: number, top: number) {
  const reach = (rig.body.upperArm + rig.body.lowerArm) / rig.body.scale
  hung(rig, out, {
    u: 0, active: 0.9 + 0.3 * e, back: reach * Math.sin(SPREAD * e * D),
    lean: [lerp(1, top, e), 0], tilt: [lerp(5, top - 44, e), 0], look: [lerp(-4, top + 18, e), 0],
  })
}

/**
 * Strict toes-to-bar: from a still hang, straight legs all the way up until
 * the toes touch the bar. The arms stay straight and press the bar forward
 * as the body folds.
 */
export const toesToBar: Motion = {
  id: 'toes-to-bar',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 4.6,
  camera: 'side',
  azimuth: 64,
  elevation: 3,
  beat: 0.4,
  props: bar,
  standard: 'From a still hang; legs straight throughout; the toes touch the bar; arms straight; no kip; lowered under control to a still hang.',
  effort: (t) => 0.25 + 0.75 * there(t, 0.34, 0.07),
  pose(t, rig, out) {
    const e = ease(there(t, 0.34, 0.07))
    const top = topOfToesToBar(rig)
    toesToBarTrunk(rig, out, e, top.lean)
    legs(rig, out, lerp(8, top.legs, e), 0, lerp(46, 50, e))
  },
}

interface Lever {
  /** The shoulders this far to the head's side of the hands: what puts the weight under the bar. */
  off: number
  chest: number
  pelvis: number
  head: number
  hip: number
  knee: number
}

/** Hanging face up under the bar on straight arms, the trunk level. */
function lever(rig: Rig, out: Pose, o: Lever) {
  const b = rig.body
  const s = b.scale
  const rail = highBar(b)
  const half = b.rest.upperArmL.x + 0.1 * s
  // The hands roll a little way round the bar towards the line of the arms.
  const roll = 16 * D
  for (const [side, sign] of SIDES) {
    gripAt(b, out.arm[side], side, new Vector3(sign * half, rail.height, 0), rail.radius, new Vector3(0, Math.cos(roll), Math.sin(roll)), new Vector3(0, -Math.sin(roll), Math.cos(roll)))
    out.arm[side].elbow.set(sign, -0.2, -0.4)
    out.arm[side].shrug = -0.7
  }
  const wrist = out.arm.L.hand
  const reach = (b.upperArm + b.lowerArm) * 0.9985
  const off = o.off * s
  const aim = (aside: number) => new Vector3(0, wrist.y - Math.sqrt(Math.max(0, reach ** 2 - aside ** 2 - off ** 2)), wrist.z - off)
  out.chest.copy(pitch(o.chest))
  out.pelvis.copy(pitch(o.pelvis))
  out.head.copy(pitch(o.head))
  const first = aim(half - b.rest.upperArmL.x)
  out.hips.set(0, first.y, first.z + b.trunk)
  shouldersAt(rig, out, first)
  shouldersAt(rig, out, aim(Math.abs(wrist.x - rig.pos.upperArmL.x)))
  legs(rig, out, o.hip, o.knee, 40)
}

/** A hold is never quite still: a slow breath and a faster tremor, a degree or so. */
const waver = (t: number) => 0.7 * Math.sin(t * Math.PI * 2) + 0.3 * Math.sin(t * Math.PI * 6 + 1)

/**
 * Tuck front lever: straight arms, the back level with the floor, hips at
 * shoulder height, knees pulled tight to the chest.
 */
export const tuckFrontLever: Motion = {
  id: 'tuck-fl',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 5,
  camera: 'side',
  azimuth: 72,
  elevation: 2,
  props: bar,
  standard: 'Arms locked; the back level with the floor and the hips at shoulder height, not hanging below; knees tight to the chest.',
  effort: (t) => 0.75 + 0.1 * waver(t),
  pose(t, rig, out) {
    const w = waver(t)
    lever(rig, out, { off: 0.2, chest: -74.5 + w, pelvis: -110.5 + w, head: -58, hip: 250 - w, knee: 150 })
  },
}

/**
 * Advanced tuck front lever: the same hold with the back flat and the hips
 * opened to a right angle, thighs upright.
 */
export const advTuckFrontLever: Motion = {
  id: 'adv-tuck-fl',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 5,
  camera: 'side',
  azimuth: 72,
  elevation: 2,
  props: bar,
  standard: 'Arms locked; back flat and level with the floor; hips opened to 90° with the thighs upright; shoulders pulled down and back, not rolling forward.',
  effort: (t) => 0.8 + 0.1 * waver(t),
  pose(t, rig, out) {
    const w = waver(t)
    lever(rig, out, { off: 0.275, chest: -90 + w, pelvis: -93 + w, head: -78, hip: 180 - w, knee: 96 })
  },
}

// ── Muscle-up ──────────────────────────────────────────────────────────

/** A moment of the muscle-up: 0 the hang, 1 the top of the pull, 2 over the bar at the bottom of the dip, 3 locked out on top. */
interface Stage {
  /** Shoulders relative to the centre of the bar: height, and forward of it. */
  y: number
  z: number
  chest: number
  pelvis: number
  head: number
  /** How far the hands have turned over the bar: 0 hanging under it, 1 pressing on top of it. */
  turn: number
  legs: number
  shrug: number
  elbow: [number, number, number]
}

const scratch = (): Pose => ({
  hips: new Vector3(), pelvis: pitch(0), chest: pitch(0), head: pitch(0),
  arm: { L: { hand: new Vector3(), rot: pitch(0), elbow: new Vector3(), grip: 0, shrug: 0 }, R: { hand: new Vector3(), rot: pitch(0), elbow: new Vector3(), grip: 0, shrug: 0 } },
  leg: { L: { foot: new Vector3(), rot: pitch(0), knee: new Vector3(), toes: 0 }, R: { foot: new Vector3(), rot: pitch(0), knee: new Vector3(), toes: 0 } },
})

/** One hand on the bar, `turn` of the way from hanging under it to pressing on top of it. */
export function handOver(b: Body, out: Pose, side: Side, sign: number, half: number, turn: number) {
  const rail = highBar(b)
  const a = 100 * turn * D
  const fingers = new Vector3(0, Math.cos(a), Math.sin(a))
  const palm = new Vector3(0, -Math.sin(a), Math.cos(a))
  const arm = out.arm[side]
  // Hanging, the bar lies under the knuckles; on top, under the heel of the hand.
  arm.hand.set(sign * half, rail.height, 0).addScaledVector(fingers, rail.radius * 0.35 - b.knuckle * lerp(1, 0.45, turn)).addScaledVector(palm, -(rail.radius + 0.012 * b.scale))
  arm.rot.copy(handRot(side, fingers, palm))
  arm.grip = lerp(1, 0.8, turn)
}

/**
 * Bar muscle-up, strict: a pull high enough to bring the bar to the lower
 * chest, both elbows over together as the chest comes forward over the
 * bar, then a press to straight arms above it.
 */
export const muscleUp: Motion = {
  id: 'muscle-up',
  revision: 1,
  stage: 'tall',
  kind: 'reps',
  period: 5,
  camera: 'side',
  azimuth: 58,
  elevation: 4,
  beat: 0.66,
  props: bar,
  detail: GRIP,
  standard: 'From a hang; pulled high enough that both elbows come over the bar together; the chest comes forward over the bar; finished with the arms locked out on top; minimal swing.',
  effort: (t) => (t < 0.62 ? 0.5 + 0.5 * Math.sin((t / 0.62) * Math.PI) : 0.35),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const rail = highBar(b)
    const half = b.rest.upperArmL.x + 0.125 * s
    const reach = (b.upperArm + b.lowerArm) * 0.9985
    // Up: a breath in the hang, a fast pull, the turn-over, the press, a held lockout. Then down the same way.
    const q = t < 0.05 ? 0
      : t < 0.27 ? ease((t - 0.05) / 0.22)
      : t < 0.43 ? 1 + ease((t - 0.27) / 0.16)
      : t < 0.62 ? 2 + ease((t - 0.43) / 0.19)
      : t < 0.72 ? 3
      : 3 * (1 - ease((t - 0.72) / 0.26))
    const at = Math.min(3, Math.max(0, q))
    const i = Math.min(2, Math.floor(at))
    const f = at - i

    const pose = (aside: number): Vector3 => {
      const hang = Math.sqrt(Math.max(0, reach ** 2 - aside ** 2))
      const top = 0.035 * s
      const stages: Stage[] = [
        { y: -(b.knuckle - rail.radius * 0.35) - hang, z: -0.03 * s, chest: 1, pelvis: 5, head: -4, turn: 0, legs: 9, shrug: 0.4, elbow: [1, -0.5, 0.5] },
        { y: 0.05 * s, z: -0.19 * s, chest: -16, pelvis: -14, head: -14, turn: 0.12, legs: 30, shrug: -0.9, elbow: [0.9, -0.5, -0.8] },
        { y: 0.135 * s, z: 0.015 * s, chest: 40, pelvis: 30, head: 14, turn: 1, legs: -8, shrug: 0.2, elbow: [0.55, 0.35, -1] },
        { y: top + Math.sqrt(Math.max(0, (reach * 0.999) ** 2 - aside ** 2 - (0.05 * s) ** 2)), z: 0.016 * s, chest: 9, pelvis: 6, head: 2, turn: 1, legs: 4, shrug: -0.6, elbow: [0.6, 0.1, -1] },
      ]
      const a = stages[i], z = stages[i + 1]
      const mix = (k: 'y' | 'z' | 'chest' | 'pelvis' | 'head' | 'turn' | 'legs' | 'shrug') => lerp(a[k], z[k], f)
      out.chest.copy(pitch(mix('chest')))
      out.pelvis.copy(pitch(mix('pelvis')))
      out.head.copy(pitch(mix('head')))
      for (const [side, sign] of SIDES) {
        handOver(b, out, side, sign, half, mix('turn'))
        out.arm[side].elbow.set(sign * lerp(a.elbow[0], z.elbow[0], f), lerp(a.elbow[1], z.elbow[1], f), lerp(a.elbow[2], z.elbow[2], f))
        out.arm[side].shrug = mix('shrug')
      }
      turnLegs = mix('legs')
      // The chest passes close to the bar: the path bows back a little between the pull and the turn-over.
      const bow = i === 1 ? Math.sin(f * Math.PI) * 0.03 * s : i === 0 ? Math.sin(f * Math.PI) * 0.025 * s : 0
      return new Vector3(0, rail.height + mix('y'), mix('z') - bow)
    }
    let turnLegs = 0
    const first = pose(half - b.rest.upperArmL.x)
    out.hips.set(0, first.y - b.trunk, first.z)
    shouldersAt(rig, out, first)
    shouldersAt(rig, out, pose(Math.abs(out.arm.L.hand.x - rig.pos.upperArmL.x)))
    legs(rig, out, turnLegs, 0, 44)
  },
}

/** The bar exercises of the assessment, easiest first. */
export const BAR: Motion[] = [scapPull, negativePullup, chinUp, hangingKneeRaise, chestToBar, hangingLegRaise, toesToBar, tuckFrontLever, advTuckFrontLever, muscleUp]
