/**
 * The handstand station: the positions that lead to a handstand and the work
 * done in one. Upside down, the body faces -Z and the fingers point +Z, so a
 * wall the chest faces is on the -Z side and a wall behind the back on +Z.
 */
import { Quaternion, Vector3 } from 'three'
import type { Side } from '../body/skeleton'
import { Rig, elbowOf, emptyPose, handRot, pitch, type Body, type LegPose, type Pose } from '../rig'
import { SIDES, at, deg, handsOnFloor, legOnBall, onBall, shouldersAt, straightLegs, wristHeight } from './kit'
import { ease, lerp, type Motion } from './types'

const Zaxis = new Vector3(0, 0, 1)
const ramp = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))))
const other = (s: Side): Side => (s === 'L' ? 'R' : 'L')

/** The tip of the toes, and the back of the heel, of a solved foot. */
export const toeTip = (rig: Rig, side: Side) =>
  rig.pos[`toes${side}`].clone().add(new Vector3(0, -0.008, 0.075).multiplyScalar(rig.body.scale).applyQuaternion(rig.rot[`toes${side}`]))
export const heelBack = (rig: Rig, side: Side) =>
  rig.pos[`foot${side}`].clone().add(new Vector3(0, -0.045, -0.075).multiplyScalar(rig.body.scale).applyQuaternion(rig.rot[`foot${side}`]))

interface Stand {
  /** Degrees the whole line leans towards +Z as it rises from the hands. */
  tilt: number
  /** The balance: a degree or so of drift, taken up the way the freestanding handstand does. */
  drift?: number
  /** How far the head is lifted to look at the floor, degrees. */
  head: number
  /** Toes pointed (degrees), legs apart (degrees each), legs forward of the trunk's line (degrees). */
  point: number
  spread?: number
  flex?: number
}

/** A handstand with locked arms: shoulders stacked on the wrists, then the line above them. */
function stand(rig: Rig, out: Pose, o: Stand) {
  const b = rig.body
  const reach = b.upperArm + b.lowerArm
  const drift = o.drift ?? 0
  handsOnFloor(b, out, 0, b.rest.upperArmL.x * 1.02, new Vector3(1, 0, 0.6), 4)
  for (const [side] of SIDES) { out.arm[side].shrug = 1; out.arm[side].grip = 0.12 }
  out.chest.copy(pitch(180 + o.tilt + drift * 0.6))
  out.pelvis.copy(pitch(180 + o.tilt - drift * 0.9 + 1.5))
  out.head.copy(pitch(180 + o.tilt - o.head))
  const lean = (o.tilt + drift) * deg
  const target = at(Math.sin(lean) * reach, wristHeight(b) + Math.cos(lean) * reach * 0.9975)
  out.hips.set(0, target.y + b.trunk, target.z)
  shouldersAt(rig, out, target)
  straightLegs(rig, out, (o.flex ?? 0) - drift * 0.7, o.point, o.spread ?? 0)
}

const CHEST: Stand = { tilt: -0.6, head: 6, point: 8 }
const BACK: Stand = { tilt: 6.5, head: 16, point: 38 }

/** Where the walls stand for a body: at the toes of the one handstand, at the heels of the other. */
const walls = new Map<string, { chest: number; back: number }>()
function wallsOf(b: Body) {
  let w = walls.get(b.id)
  if (!w) {
    const rig = new Rig(b.id)
    const pose = emptyPose()
    stand(rig, pose, CHEST); rig.solve(pose)
    const chest = Math.min(toeTip(rig, 'L').z, toeTip(rig, 'R').z) - 0.004 * b.scale
    stand(rig, pose, BACK); rig.solve(pose)
    const back = Math.max(heelBack(rig, 'L').z, heelBack(rig, 'R').z) + 0.004 * b.scale
    w = { chest, back }
    walls.set(b.id, w)
  }
  return w
}

const breath = (t: number) => Math.sin(t * Math.PI * 2)

/**
 * Chest-to-wall handstand: facing the wall, only the toes touching it, the
 * wrists a hand's length away, and one straight line from wrists to ankles.
 */
export const chestToWall: Motion = {
  id: 'chest-to-wall-hs',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 5,
  camera: 'side',
  azimuth: 72,
  elevation: 2,
  props: (b) => [{ kind: 'wall', z: wallsOf(b).chest }],
  detail: { delt_post: 0.3, forearm_flex: 0.45, forearm_ext: 0.35 },
  standard: 'Wrists within a hand\'s length of the wall; only the toes touch it; arms locked and shoulders pushed tall; ribs in, no banana back; head between the arms.',
  effort: (t) => 0.6 + 0.1 * breath(t),
  pose(t, rig, out) {
    stand(rig, out, CHEST)
    for (const [side] of SIDES) out.arm[side].grip = 0.12 + 0.03 * breath(t)
  },
}

/**
 * Back-to-wall handstand: back to the wall, hands close to it, only the
 * heels resting on it. The line leans a few degrees into the wall.
 */
export const backToWall: Motion = {
  id: 'back-to-wall-hs',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 5,
  camera: 'side',
  azimuth: 112,
  elevation: 2,
  props: (b) => [{ kind: 'wall', z: wallsOf(b).back }],
  detail: { delt_post: 0.3, forearm_flex: 0.45, forearm_ext: 0.35 },
  standard: 'Arms locked; hands about a hand\'s length from the wall; only the heels on the wall; shoulders pushed tall; a straight line, not a deep arch.',
  effort: (t) => 0.6 + 0.1 * breath(t),
  pose(t, rig, out) {
    stand(rig, out, BACK)
    for (const [side] of SIDES) out.arm[side].grip = 0.12 + 0.03 * breath(t)
  },
}

/** Turns the whole body about a point, as one piece. */
function pivot(out: Pose, about: Vector3, q: Quaternion) {
  out.hips.sub(about).applyQuaternion(q).add(about)
  out.pelvis.premultiply(q)
  out.chest.premultiply(q)
  out.head.premultiply(q)
}

/**
 * Shoulder taps in a handstand. Each half of the cycle is one tap: the body
 * leans over the supporting hand as one line, the other hand comes off the
 * floor, touches the opposite shoulder and goes back to the same spot.
 */
interface Tap {
  /** Degrees the whole line leans over the supporting hand. */
  lean: number
  /** How far forward the tapping elbow swings. */
  elbowFront: number
  /** Where the palm lands, from the supporting shoulder's joint, in the chest's own directions: towards that side, towards the head, forward. */
  touch: [number, number, number]
}
/** On the shoulder itself: the wrist stops short of the joint so that the palm, a little further on, covers the front of the shoulder's cap. */
const ON_SHOULDER: [number, number, number] = [-0.028, 0.025, 0.085]
/** Revision 1 landed a hand's width inside it, by the armpit. */
const BY_ARMPIT: [number, number, number] = [-0.085, 0.01, 0.07]

function taps(rig: Rig, out: Pose, t: number, o: Stand, tap: Tap) {
  const { lean, elbowFront } = tap
  const b = rig.body
  const s = b.scale
  const support: Side = t < 0.5 ? 'L' : 'R'
  const tapping = other(support)
  const sign = support === 'L' ? 1 : -1
  const h = (t % 0.5) * 2
  const shift = ramp(h, 0.04, 0.32) * (1 - ramp(h, 0.7, 0.96))
  const lift = ramp(h, 0.2, 0.46) * (1 - ramp(h, 0.56, 0.82))

  stand(rig, out, o)
  // Lean over the supporting hand: everything turns about that wrist, so that arm stays exactly as locked as it was.
  const turn = new Quaternion().setFromAxisAngle(Zaxis, -sign * lean * shift * deg)
  pivot(out, out.arm[support].hand, turn)
  rig.solve(out)

  const arm = out.arm[tapping]
  const reach = (b.upperArm + b.lowerArm) * 0.995
  const shoulder = rig.pos[`upperArm${tapping}`]
  // The far shoulder rises as the body leans: its hand is unweighted, then leaves the floor.
  const floor = arm.hand.clone()
  if (floor.distanceTo(shoulder) > reach) floor.sub(shoulder).setLength(reach).add(shoulder)
  // On the front of the supporting shoulder, the palm against the chest.
  const front = (x: number, y: number, z: number) => new Vector3(x * s, y * s, z * s).applyQuaternion(out.chest)
  const touch = rig.pos[`upperArm${support}`].clone().add(front(sign * tap.touch[0], tap.touch[1], tap.touch[2]))
  const e = ease(lift)
  arm.hand.copy(floor).lerp(touch, e).add(front(0, 0, 0.03 * Math.sin(Math.PI * e)))
  const tapRot = handRot(tapping, front(sign, 0.25, 0).normalize(), front(0, 0, -1).normalize())
  arm.rot.slerp(tapRot, e)
  // The elbow swings out to the side, and forward only as far as there is room.
  arm.elbow.set(-sign * 1, 0, lerp(0.6, -elbowFront, e))
  arm.grip = lerp(0.12, 0.3, e)
  rig.solve(out)
  straightLegs(rig, out, (o.flex ?? 0) - (o.drift ?? 0) * 0.7, o.point, o.spread ?? 0)
}

const tapEffort = (t: number) => { const h = (t % 0.5) * 2; return 0.55 + 0.4 * ramp(h, 0.04, 0.32) * (1 - ramp(h, 0.7, 0.96)) }

const WALL_TAPS = {
  id: 'wall-shoulder-taps', stage: 'tall', kind: 'reps', period: 5.6, beat: 0.26, camera: 'side', azimuth: 40, elevation: 2,
  props: (b: Body) => [{ kind: 'wall' as const, z: wallsOf(b).chest }],
  detail: { delt_post: 0.3, forearm_flex: 0.5, forearm_ext: 0.4 },
  effort: tapEffort,
} satisfies Partial<Motion>

/**
 * Wall handstand shoulder taps: chest to the wall. The weight moves over one
 * hand first, far enough that the other hand is light, and only then does it
 * leave the floor to touch the opposite shoulder, on the shoulder itself.
 */
export const wallShoulderTaps: Motion = {
  ...WALL_TAPS,
  revision: 2,
  standard: 'Chest to the wall, toes staying on it; the hips travel most of the way over the supporting hand before the other hand lifts; supporting arm locked and shoulder pushed tall; the palm lands on the opposite shoulder itself, not inside it by the armpit, and returns to the same spot; hips do not twist.',
  pose: (t, rig, out) => taps(rig, out, t, CHEST, { lean: 8.2, elbowFront: -0.25, touch: ON_SHOULDER }),
}

/** Revision 1, kept until revision 2 is approved: a small lean, and the hand landing by the armpit. */
export const wallShoulderTapsEarlier: Motion = {
  ...WALL_TAPS,
  revision: 1,
  standard: 'Chest to the wall, toes staying on it; the weight shifts over the supporting hand before the other lifts; supporting arm locked and shoulder pushed tall; the hand touches the opposite shoulder and returns to the same spot; hips do not twist.',
  pose: (t, rig, out) => taps(rig, out, t, CHEST, { lean: 3.4, elbowFront: -0.25, touch: BY_ARMPIT }),
}

/**
 * Freestanding shoulder taps: the same shift and tap with nothing to lean
 * on, the legs a little apart, the balance held by the supporting hand.
 */
export const hsShoulderTaps: Motion = {
  id: 'hs-shoulder-taps',
  revision: 1,
  stage: 'tall',
  kind: 'reps',
  period: 5.6,
  beat: 0.26,
  camera: 'front',
  azimuth: 140,
  elevation: 2,
  detail: { delt_post: 0.3, forearm_flex: 0.6, forearm_ext: 0.5 },
  standard: 'A held handstand, legs slightly apart; the whole line shifts over one hand before the other lifts; supporting arm locked; the hand touches the opposite shoulder and returns to the same spot, no hopping or walking.',
  effort: tapEffort,
  pose(t, rig, out) {
    const drift = 0.8 * Math.sin(t * Math.PI * 4) + 0.35 * Math.sin(t * Math.PI * 10 + 1)
    taps(rig, out, t, { tilt: 0, drift, head: 18, point: 50, spread: 8 }, { lean: 3.6, elbowFront: 0.9, touch: BY_ARMPIT })
  },
}

/** The height of the box for the pike hold: about hip height, so that the legs lie level from the stacked hips. */
const pikeBox = (b: Body) => wristHeight(b) + (b.upperArm + b.lowerArm) * 0.9975 + b.trunk - 0.108 * b.scale

/** Where the balls of the feet rest on the box: far enough for the legs to be straight with the ankle at a right angle. */
function pikeFeet(b: Body) {
  const hipY = wristHeight(b) + (b.upperArm + b.lowerArm) * 0.9975 + b.trunk
  const legs = (b.upperLeg + b.lowerLeg) * 0.998
  const reach = Math.hypot(legs + Math.abs(b.ball.y), b.ball.z)
  const y = pikeBox(b) + 0.014 * b.scale
  return { y, z: -Math.sqrt(reach * reach - (hipY - y) ** 2) }
}

/**
 * Box pike hold: feet on a box, hands on the floor, hips stacked over the
 * shoulders and the wrists, arms and trunk one vertical line, legs level.
 */
export const pikeHold: Motion = {
  id: 'pike-hold',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'hold',
  period: 5,
  camera: 'side',
  azimuth: 68,
  elevation: 4,
  props: (b) => {
    const f = pikeFeet(b)
    return [{ kind: 'box', width: 0.62 * b.scale, height: pikeBox(b), depth: 0.44 * b.scale, z: f.z - 0.1 * b.scale }]
  },
  detail: { delt_post: 0.25 },
  standard: 'Hips over the shoulders and the shoulders over the wrists; arms locked; shoulders pushed up towards the ears; legs straight on the box; eyes on the floor between the thumbs.',
  effort: (t) => 0.6 + 0.1 * breath(t),
  pose(t, rig, out) {
    const b = rig.body
    const reach = b.upperArm + b.lowerArm
    handsOnFloor(b, out, 0, b.rest.upperArmL.x * 1.02, new Vector3(1, 0, 0.6), 4)
    for (const [side] of SIDES) { out.arm[side].shrug = 0.9 + 0.1 * breath(t); out.arm[side].grip = 0.1 }
    out.chest.copy(pitch(180))
    out.pelvis.copy(pitch(180 + 6))
    out.head.copy(pitch(180 - 24))
    const target = at(0, wristHeight(b) + reach * 0.9975)
    out.hips.set(0, target.y + b.trunk, 0)
    shouldersAt(rig, out, target)
    const feet = pikeFeet(b)
    for (const [side, sign] of SIDES) {
      legOnBall(b, rig.pos[`upperLeg${side}`], at(feet.z, feet.y, sign * b.rest.upperLegL.x), new Vector3(0, 1, -0.3), out.leg[side])
      out.leg[side].knee.set(0, -1, 0)
    }
  },
}

/** The shortest distance between two stretches of limb, each given by its ends. */
export function apart(a1: Vector3, a2: Vector3, b1: Vector3, b2: Vector3): number {
  const u = a2.clone().sub(a1), v = b2.clone().sub(b1), w = a1.clone().sub(b1)
  const a = u.dot(u), b = u.dot(v), c = v.dot(v), d = u.dot(w), e = v.dot(w)
  const den = a * c - b * b
  let s = den > 1e-12 ? Math.min(1, Math.max(0, (b * e - c * d) / den)) : 0
  let t = c > 1e-12 ? (b * s + e) / c : 0
  if (t < 0) { t = 0; s = Math.min(1, Math.max(0, -d / a)) } else if (t > 1) { t = 1; s = Math.min(1, Math.max(0, (b - d) / a)) }
  return a1.clone().addScaledVector(u, s).distanceTo(b1.clone().addScaledVector(v, t))
}

/** The trunk and arms of the crow: the same in every revision. */
function crowBase(rig: Rig, out: Pose, t: number) {
  const b = rig.body
  const s = b.scale
  // The balance is a rock of a centimetre or so, forward and back over the hands.
  const rock = 0.012 * s * Math.sin(t * Math.PI * 2) + 0.004 * s * Math.sin(t * Math.PI * 6 + 1)
  handsOnFloor(b, out, 0, b.rest.upperArmL.x * 0.98, new Vector3(0.45, 0.1, -1), 6)
  for (const [side] of SIDES) { out.arm[side].grip = 0.18; out.arm[side].shrug = 0.3 }
  out.chest.copy(pitch(104))
  out.pelvis.copy(pitch(70))
  out.head.copy(pitch(58))
  const target = at(0.215 * s + rock, 0.415 * s)
  out.hips.set(0, target.y + 0.08 * s, target.z - b.trunk)
  shouldersAt(rig, out, target)
}

const CROW = {
  stage: 'square', planted: ['handL', 'handR'], kind: 'balance', period: 4.6, camera: 'side', azimuth: 62, elevation: 6,
  detail: { delt_post: 0.2, delt_lat: 0.5, pec: 0.35, pec_upper: 0.35 },
  effort: (t: number) => 0.6 + 0.15 * Math.abs(breath(t)),
} satisfies Partial<Motion>

/** How thick the limbs are where the shin crosses the arm: what "resting on" means in numbers. */
export const CROW_GIRTH = { arm: 0.046, shin: 0.044 }

/**
 * Crow pose: hands on the floor, elbows bent back, the shins laid across the
 * backs of the upper arms just below the knees, hips high, feet off the
 * floor and together behind, eyes ahead of the hands.
 *
 * The shin lies ON the arm: where it crosses, the two are a limb's thickness
 * apart, and nowhere does the leg pass through an arm.
 */
export const crow: Motion = {
  ...CROW,
  id: 'crow-pose',
  revision: 2,
  standard: 'The shins rest across the backs of the upper arms just below the knees, and no part of a leg passes through an arm; knees outside the elbows; shoulders well ahead of the hands; upper back rounded; both feet off the floor and together; eyes forward of the hands, head off the floor.',
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    crowBase(rig, out, t)
    for (const [side, sign] of SIDES) {
      const hip = rig.pos[`upperLeg${side}`]
      const shoulder = rig.pos[`upperArm${side}`], elbow = rig.pos[`lowerArm${side}`]
      const along = elbow.clone().sub(shoulder).normalize()
      // The back of the upper arm, where the triceps makes a shelf: up and back from its middle.
      const up = new Vector3(0, 1, -0.35)
      const shelf = up.addScaledVector(along, -up.dot(along)).normalize()
      const on = shoulder.clone().lerp(elbow, 0.5).addScaledVector(shelf, (CROW_GIRTH.arm + CROW_GIRTH.shin + 0.004) * s)
      // The feet come together behind and below the hips; the shin runs from there, over the arm, to a knee outside it.
      const feet = new Vector3(sign * 0.04 * s, hip.y - 0.3 * s, hip.z - 0.085 * s)
      const run = on.clone().sub(feet).normalize()
      const want = on.clone().addScaledVector(run, 0.085 * s)
      const knee = want.sub(hip).setLength(b.upperLeg).add(hip)
      const leg = out.leg[side]
      leg.foot.copy(feet).sub(knee).setLength(b.lowerLeg).add(knee)
      leg.knee.copy(knee).sub(hip.clone().add(leg.foot).multiplyScalar(0.5))
      leg.rot.copy(pitch(150)).premultiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -sign * 0.25))
      leg.toes = -15
    }
  },
}

/** Revision 1, kept until revision 2 is approved: the knee sat beside the arm and the shin passed through it. */
export const crowEarlier: Motion = {
  ...CROW,
  id: 'crow-pose',
  revision: 1,
  standard: 'Knees high on the backs of the upper arms; shoulders well ahead of the hands; upper back rounded; both feet off the floor; eyes forward of the hands, head off the floor.',
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    crowBase(rig, out, t)
    for (const [side, sign] of SIDES) {
      const hip = rig.pos[`upperLeg${side}`]
      const shoulder = rig.pos[`upperArm${side}`], elbow = rig.pos[`lowerArm${side}`]
      const rest = shoulder.clone().lerp(elbow, 0.62).add(new Vector3(sign * 0.055 * s, 0.062 * s, -0.01 * s))
      const knee = rest.sub(hip).setLength(b.upperLeg).add(hip)
      const tuck = new Vector3(sign * 0.035 * s, hip.y - 0.3 * s, hip.z - 0.02 * s)
      const leg = out.leg[side]
      leg.foot.copy(tuck).sub(knee).setLength(b.lowerLeg).add(knee)
      leg.knee.copy(knee).sub(hip.clone().add(leg.foot).multiplyScalar(0.5))
      leg.rot.copy(pitch(150)).premultiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -sign * 0.25))
      leg.toes = -15
    }
  },
}

/**
 * Elbow lever: the elbows dug into the sides of the lower abdomen, forearms
 * upright, and the whole body held level and straight on them.
 */
export const elbowLever: Motion = {
  id: 'elbow-lever',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR'],
  kind: 'balance',
  period: 4.8,
  camera: 'side',
  azimuth: 64,
  elevation: 7,
  detail: { delt_post: 0.3, delt_lat: 0.5, forearm_ext: 0.6 },
  standard: 'Elbows close together, pressed into the lower belly; forearms upright; body level from shoulders to toes, legs straight and not sagging; feet off the floor; head up.',
  effort: (t) => 0.65 + 0.15 * Math.abs(breath(t)),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    // A see-saw over the elbows, a degree or so.
    const tip = 1.2 * Math.sin(t * Math.PI * 2) + 0.4 * Math.sin(t * Math.PI * 6 + 1)
    const half = 0.085 * s
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.set(sign * half, wristHeight(b), 0)
      // Fingers turned out and back, towards the feet.
      arm.rot.copy(handRot(side, new Vector3(sign * 0.7, 0, -0.7).normalize(), new Vector3(0, -1, 0)))
      arm.elbow.set(-sign * 0.35, 0.75, -1)
      arm.grip = 0.1
      arm.shrug = -0.4
    }
    out.chest.copy(pitch(86))
    out.pelvis.copy(pitch(93))
    out.head.copy(pitch(56))
    // Shoulders ahead of the elbows by most of an upper arm, at the height of the trunk lying on them.
    const target = at(0.262 * s, 0.37 * s)
    out.hips.set(0, target.y, target.z - b.trunk)
    shouldersAt(rig, out, target)
    pivot(out, at(0, wristHeight(b) + b.lowerArm), pitch(tip))
    rig.solve(out)
    straightLegs(rig, out, 0, 42)
  },
}

// ── Wall walk ────────────────────────────────────────────────────────────

const CYCLES = 10
/** How much of a cycle one hand and the opposite foot take to move; the other pair is planted meanwhile. */
const MOVE = 0.44

interface Climb {
  wall: number
  /** Hand position (z) and where the ball of the foot is, at each whole step from the floor to the top. */
  hands: number[]
  balls: Vector3[]
  shoulder: number
}

/**
 * The route up the wall for a body. Each step is a straight body from the
 * shoulders (over the hands) to the balls of the feet (on the wall); steps
 * are spaced so that no hand or foot travels much further than another.
 */
const climbs = new Map<string, Climb>()
function climbOf(b: Body): Climb {
  let c = climbs.get(b.id)
  if (c) return c
  const s = b.scale
  const wall = -0.17 * s
  const ballZ = wall + 0.016 * s
  const pad = 0.014 * s
  const shoulder = wristHeight(b) + (b.upperArm + b.lowerArm) * 0.9975
  const legs = (b.upperLeg + b.lowerLeg) * 0.998
  // Shoulder to ball of the foot with the body straight through the ankles and the ankle at a right angle.
  const D = Math.hypot(b.trunk + legs + Math.abs(b.ball.y), b.ball.z)
  const floor = at(wall + 0.11 * s, pad)
  const first = Math.asin((0.17 * s - shoulder) / D)
  const last = Math.acos((0 - ballZ) / D)
  // Equal steps of whichever travels further, hands along the floor or feet up the wall.
  const n = 400
  const travel = [0]
  for (let i = 1; i <= n; i++) {
    const a = first + ((last - first) * (i - 0.5)) / n
    travel.push(travel[i - 1] + Math.max(Math.abs(Math.sin(a)), Math.cos(a)))
  }
  const angleAt = (share: number) => {
    const want = share * travel[n]
    let i = 1
    while (i < n && travel[i] < want) i++
    return first + ((last - first) * (i - (travel[i] - want) / (travel[i] - travel[i - 1]))) / n
  }
  const hands = [floor.z + Math.sqrt(D * D - (shoulder - pad) ** 2)]
  const balls = [floor]
  for (let k = 1; k <= CYCLES; k++) {
    const a = angleAt((k - 1) / (CYCLES - 1))
    // A little slack where a half step out of time costs the most reach.
    const d = D - 0.03 * s * Math.max(0, Math.sin(2 * a))
    hands.push(ballZ + d * Math.cos(a))
    balls.push(at(ballZ, shoulder + d * Math.sin(a)))
  }
  c = { wall, hands, balls, shoulder }
  climbs.set(b.id, c)
  return c
}

/** Where a limb is along the route (0 to CYCLES) and how far through a step in the air it is (0 when planted). */
function stride(progress: number, phase: number): { at: number; air: number } {
  const x = progress * CYCLES - phase
  if (x <= 0) return { at: 0, air: 0 }
  const whole = Math.floor(x), part = x - whole
  if (whole >= CYCLES) return { at: CYCLES, air: 0 }
  const u = Math.min(1, part / MOVE)
  return { at: whole + ease(u), air: u < 1 ? Math.sin(Math.PI * u) : 0 }
}

const along = <T,>(list: T[], v: number, mix: (a: T, b: T, f: number) => T): T => {
  const i = Math.min(list.length - 2, Math.floor(v))
  return mix(list[i], list[i + 1], v - i)
}

/** Bends the toes so that they lie along a direction (down a wall, flat on a floor). */
function toesAlong(leg: LegPose, dir: Vector3) {
  const y = new Vector3(0, 1, 0).applyQuaternion(leg.rot), z = new Vector3(0, 0, 1).applyQuaternion(leg.rot)
  leg.toes = Math.max(0, Math.min(85, Math.atan2(dir.dot(y), dir.dot(z)) / deg))
}

/**
 * Wall walk: from a push-up with the feet at the wall, the feet walk up it
 * and the hands walk in, a hand and the opposite foot at a time, until the
 * chest is near the wall in a handstand; then back down the same way.
 */
export const wallWalk: Motion = {
  id: 'wall-walk',
  revision: 1,
  stage: 'square',
  kind: 'reps',
  period: 13,
  beat: 0.5,
  camera: 'side',
  azimuth: 66,
  elevation: 4,
  props: (b) => [{ kind: 'wall', z: climbOf(b).wall }],
  detail: { delt_post: 0.25, forearm_flex: 0.3 },
  standard: 'Small steps, a hand and a foot together; arms straight and the body tight, no arch in the lower back; hands finish within a hand\'s length of the wall, chest close to it; walked back down the same way, not dropped.',
  effort: (t) => 0.4 + 0.5 * ramp(t, 0.03, 0.45) * (1 - ramp(t, 0.55, 0.97)),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const c = climbOf(b)
    // Linear in time so the steps are even; the way down mirrors the way up.
    const up = Math.min(1, Math.max(0, (t - 0.03) / 0.42)), down = Math.min(1, Math.max(0, (t - 0.55) / 0.42))
    const w = t < 0.5 ? up : 1 - down
    const limb = { handR: stride(w, 0), footL: stride(w, 0), handL: stride(w, 0.5), footR: stride(w, 0.5) }
    const reach = b.upperArm + b.lowerArm
    const half = b.rest.upperArmL.x * 1.02
    const lerpN = (a: number, z: number, f: number) => a + (z - a) * f
    const lerpV = (a: Vector3, z: Vector3, f: number) => a.clone().lerp(z, f)

    // Hands: flat, fingers away from the wall, the one in the air a few centimetres up.
    const zs = { L: along(c.hands, limb.handL.at, lerpN), R: along(c.hands, limb.handR.at, lerpN) }
    const air = { L: limb.handL.air, R: limb.handR.air }
    handsOnFloor(b, out, 0, half, new Vector3(1, 0.2, -0.4), 4)
    for (const [side] of SIDES) {
      out.arm[side].hand.z = zs[side]
      out.arm[side].hand.y += 0.018 * s * air[side]
      out.arm[side].shrug = 0.3 + 0.7 * w
      out.arm[side].grip = 0.08
    }
    // Feet: on the floor at the start, then the balls of the feet on the wall.
    const ball = { L: along(c.balls, limb.footL.at, lerpV), R: along(c.balls, limb.footR.at, lerpV) }
    const lifted = { L: limb.footL.air, R: limb.footR.air }

    // Shoulders midway over the two hands, at the height that keeps both arms straight.
    const mid = (zs.L + zs.R) / 2
    const spreadZ = (zs.L - zs.R) / 2
    const shoulder = at(mid, wristHeight(b) + Math.sqrt(Math.max(0.01, (reach * 0.9975) ** 2 - spreadZ ** 2)))
    // The hips are a trunk's length from the shoulders and a straight leg, ankle square, from the balls of the feet:
    // in line with the ankles when the feet are as far as the body is long, higher when they are nearer.
    const feet = ball.L.clone().add(ball.R).multiplyScalar(0.5).setX(0)
    const legs = (b.upperLeg + b.lowerLeg) * 0.998
    const hip = elbowOf(shoulder, feet, b.trunk, Math.hypot(legs + Math.abs(b.ball.y), b.ball.z), new Vector3(0, 1, 1))
    const line = shoulder.clone().sub(hip)
    const lean = Math.atan2(line.z, line.y) / deg
    out.chest.copy(pitch(lean + 2))
    out.pelvis.copy(pitch(lean - 2))
    out.head.copy(pitch(lean - 16 * (1 - w)))
    out.hips.copy(hip)
    shouldersAt(rig, out, shoulder)
    // The planted arm sets the height exactly: measured, because the shoulders rise as the arms go overhead.
    for (let i = 0; i < 2; i++) {
      let far = 0
      for (const [side] of SIDES) if (air[side] === 0) far = Math.max(far, rig.pos[`upperArm${side}`].distanceTo(out.arm[side].hand))
      if (far === 0) break
      shoulder.y += (reach * 0.9975 - far) * (reach / Math.max(0.2, shoulder.y - wristHeight(b)))
      shouldersAt(rig, out, shoulder)
    }
    for (const [side] of SIDES) {
      const arm = out.arm[side], from = rig.pos[`upperArm${side}`]
      if (air[side] > 0 && arm.hand.distanceTo(from) > reach * 0.99) arm.hand.sub(from).setLength(reach * 0.99).add(from)
    }

    const back = new Vector3(0, 0, -1).applyQuaternion(out.pelvis), fore = new Vector3(0, 0, 1).applyQuaternion(out.pelvis)
    const f = b.ball.length()
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      const from = rig.pos[`upperLeg${side}`]
      const onWall = ball[side].y > 0.05 * s
      const to = ball[side].clone().setX(sign * b.rest.upperLegL.x)
      // A foot in the air comes away from the surface it left.
      to.add(new Vector3(0, 0.03 * s, 0.07 * s).multiplyScalar(lifted[side]))
      // Straight when it can be; when the foot is nearer than that, the ankle stays at its limit and the knee bends.
      const d = from.distanceTo(to)
      const limit = 92 * deg
      const straight = Math.sqrt(legs * legs + f * f - 2 * legs * f * Math.cos(limit))
      const length = d >= straight ? legs : f * Math.cos(limit) + Math.sqrt(Math.max(0, d * d - (f * Math.sin(limit)) ** 2))
      onBall(b, elbowOf(from, to, length, f, back), to, leg)
      leg.knee.copy(fore)
      if (onWall) toesAlong(leg, new Vector3(0, -1, 0))
    }
  },
}

/** The handstand station, easiest first. */
export const INVERTED: Motion[] = [pikeHold, crow, wallWalk, chestToWall, backToWall, wallShoulderTaps, hsShoulderTaps, elbowLever]
