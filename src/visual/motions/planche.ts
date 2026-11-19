/**
 * Pressing with the body level over the hands, one-arm push-ups, the scapular push-up and the ring dip.
 *
 * Three ideas carry the family. A plank whose arms stay locked while
 * something else moves (the ribcage between the shoulders, the lean of the
 * shoulders past the hands). A push-up carried by one arm, the body square
 * over wide feet. And the planche: hands on the floor, arms locked, and the
 * body leaned forward exactly as far as it takes for its weight to be over
 * the hands, which is worked out from the body itself rather than drawn.
 */
import { Vector3 } from 'three'
import type { BoneName, Side } from '../body/skeleton'
import { emptyPose, handRot, pitch, Rig, type Body, type Pose } from '../rig'
import { SIDES, at, deg, gripAt, handsOnFloor, hipsAt, onBall, shouldersAt, straightLegs, wristHeight } from './kit'
import { lerp, there, type Motion, type Prop } from './types'

// ── Shared machinery ─────────────────────────────────────────────────────

/** Things worked out once per movement and body: where the hands go, how far the body leans. */
const memo = new Map<string, unknown>()
function once<T>(rig: Rig, key: string, make: () => T): T {
  const k = `${key}:${rig.body.id}`
  if (!memo.has(k)) memo.set(k, make())
  return memo.get(k) as T
}
const rigs = new Map<string, Rig>()
/** Equipment is sized from the same set-up as the movement, so it needs a rig of its own. */
const rigOf = (b: Body) => rigs.get(b.id) ?? rigs.set(b.id, new Rig(b.id)).get(b.id)!

const reachOf = (b: Body) => b.upperArm + b.lowerArm
/** A locked elbow: the share of the arm's length from shoulder to wrist. */
const LOCKED = 0.999
const shoulders = (rig: Rig) => rig.pos.upperArmL.clone().add(rig.pos.upperArmR).multiplyScalar(0.5)
const hipJoints = (rig: Rig) => rig.pos.upperLegL.clone().add(rig.pos.upperLegR).multiplyScalar(0.5)
const breath = (t: number) => Math.sin(t * Math.PI * 2)
const down = (t: number) => there(t, 0.42, 0.06)
/** A direction in the plane of movement, `angle` degrees above the floor, towards +Z. */
const dir = (angle: number) => at(Math.cos(angle * deg), Math.sin(angle * deg))

/**
 * Where the body's weight is, near enough: each part of the body at its own
 * share of the whole, for someone built to hold these (more of them above the
 * hips than the average). A planche is only a planche if this is over the hands.
 */
export function massCentre(joint: (b: BoneName) => Vector3): Vector3 {
  const c = new Vector3()
  let whole = 0
  const part = (a: Vector3, b: Vector3, along: number, share: number) => { c.addScaledVector(a.clone().lerp(b, along), share); whole += share }
  const mid = (n: string) => joint(`${n}L` as BoneName).clone().add(joint(`${n}R` as BoneName)).multiplyScalar(0.5)
  part(mid('upperArm'), mid('upperLeg'), 0.47, 0.46)
  part(joint('neck'), joint('head'), 1.5, 0.07)
  for (const [side] of SIDES) {
    const j = (n: string) => joint(`${n}${side}` as BoneName)
    part(j('upperArm'), j('lowerArm'), 0.45, 0.031)
    part(j('lowerArm'), j('hand'), 0.65, 0.024)
    part(j('upperLeg'), j('lowerLeg'), 0.42, 0.125)
    part(j('lowerLeg'), j('foot'), 0.62, 0.052)
  }
  return c.multiplyScalar(1 / whole)
}

interface Plank {
  /** How far outside its hip joint each foot stands. */
  wide?: number
  /** The pelvis tucked under, and the ribcage rounded past the body's line (negative: sunk below it), in degrees. */
  tuck?: number
  round?: number
  /** The shoulder whose height is asked for; both, through the middle, when absent. */
  by?: Side
}

/**
 * A straight body, face down on the balls of the feet (at z = 0, head towards
 * +Z), with the shoulder joints really at a height: the first attempt is
 * measured and corrected, as in `proneAt`. The feet may stand wide, and the
 * upper back may round or sink: the trunk is then turned as a whole so that
 * ankles, hips and shoulders stay in one line whatever the spine is doing.
 */
function plankAt(rig: Rig, out: Pose, shoulderY: number, arms: (shoulder: Vector3) => void, o: Plank = {}): Vector3 {
  const b = rig.body
  const pad = 0.014
  const f = b.ball.length()
  const wide = o.wide ?? 0, tuck = o.tuck ?? 3, round = o.round ?? tuck * 0.6
  // Legs that splay out to wide feet are shorter seen from the side.
  const legs = Math.sqrt(((b.upperLeg + b.lowerLeg) * 0.998) ** 2 - wide ** 2)
  const seen = new Vector3()
  let ask = shoulderY, trim = 0, L = legs + b.trunk
  for (let i = 0; i < 6; i++) {
    let a = 0.2
    for (let k = 0; k < 12; k++) a = Math.asin(Math.max(-0.5, Math.min(0.95, (ask - pad - f * Math.cos(a)) / L)))
    const along = at(Math.cos(a), Math.sin(a))
    const ankle = at(-f * Math.sin(a), pad + f * Math.cos(a))
    const lean = 90 - a / deg
    out.pelvis.copy(pitch(lean - tuck + trim))
    out.chest.copy(pitch(lean + round + trim))
    const hip = ankle.clone().addScaledVector(along, legs)
    hipsAt(b, out.pelvis, hip, out.hips)
    for (const [side, sign] of SIDES) {
      const x = sign * (b.rest.upperLegL.x + wide)
      onBall(b, ankle.clone().setX(x), at(0, pad, x), out.leg[side])
      out.leg[side].knee.set(0, -1, 0.2)
    }
    arms(i ? seen : ankle.clone().addScaledVector(along, L))
    rig.solve(out)
    const mid = shoulders(rig)
    if (o.by) seen.copy(rig.pos[`upperArm${o.by}`])
    else seen.copy(mid)
    // A bent spine carries the shoulders off the line and shortens the trunk: both measured.
    const trunk = mid.sub(hip)
    trim += (Math.atan2(trunk.y, trunk.z) - a) / deg
    L = legs + trunk.length()
    ask += shoulderY - seen.y
  }
  return seen
}

/** Looking at the floor a little ahead: the head follows the line of the body, not the ribcage. */
function headOnLine(rig: Rig, out: Pose, look = 14) {
  const rise = shoulders(rig).y - hipJoints(rig).y
  const lean = Math.asin(Math.max(-1, Math.min(1, rise / rig.body.trunk))) / deg
  out.head.copy(pitch(90 - lean - look))
}

/**
 * A bent leg: thigh and shin at angles above the floor (degrees), from the
 * hip joint it has. `inward` draws the knee towards the other one, as a
 * share of the thigh's length.
 */
function bentLeg(rig: Rig, out: Pose, side: Side, thigh: number, shin: number, point = 0, inward = 0) {
  const b = rig.body
  const leg = out.leg[side]
  const hip = rig.pos[`upperLeg${side}`]
  const knee = hip.clone().addScaledVector(dir(thigh).setX(side === 'L' ? -inward : inward).normalize(), b.upperLeg)
  leg.foot.copy(knee).addScaledVector(dir(shin), b.lowerLeg * 0.999)
  // The foot square to the shin, then pointed.
  leg.rot.copy(pitch(-90 - shin + point))
  leg.knee.copy(knee).sub(hip.clone().add(leg.foot).multiplyScalar(0.5))
  leg.toes = -12
}

// ── Scapular push-up ─────────────────────────────────────────────────────

const shoulderWide = (b: Body) => b.rest.upperArmL.x + 0.035 * b.scale
/** A locked arm still has a way it faces: the point of the elbow back towards the feet, the pit forward. */
const PIT_FORWARD = new Vector3(0.18, 0.45, -1)
/**
 * What moves in a scapular push-up is the shoulder blades (the rig's `protract`), from wrapped forward at the top to
 * drawn together at the bottom; the upper back follows a little, round at the top and open at the bottom.
 */
const SCAP = { top: { blade: 0.55, round: 6 }, low: { blade: -0.85, round: -3 }, tuck: 3, look: 9 }

/**
 * The plank of the scapular push-up at `u` (0 pushed up, 1 sunk). The arms are locked and the hands do not move, so
 * the shoulder joints stay where they are; the body is one rigid line from the toes that turns on them until the
 * shoulder blades, set where `u` puts them, meet those joints. So the whole chest comes down between the arms, and
 * the hips with it by their share: nothing bends.
 */
function scapPlank(rig: Rig, out: Pose, hands: number, u: number, start = 0.3) {
  const b = rig.body
  const pad = 0.014, f = b.ball.length()
  const legs = (b.upperLeg + b.lowerLeg) * 0.998
  const full = reachOf(b) * LOCKED
  const blade = lerp(SCAP.top.blade, SCAP.low.blade, u), round = lerp(SCAP.top.round, SCAP.low.round, u)
  let a = start
  for (let i = 0; i < 9; i++) {
    const along = at(Math.cos(a), Math.sin(a))
    const ankle = at(-f * Math.sin(a), pad + f * Math.cos(a))
    const lean = 90 - a / deg
    out.pelvis.copy(pitch(lean - SCAP.tuck))
    out.chest.copy(pitch(lean + round))
    out.head.copy(pitch(lean - SCAP.look))
    hipsAt(b, out.pelvis, ankle.clone().addScaledVector(along, legs), out.hips)
    for (const [side, sign] of SIDES) {
      const x = sign * b.rest.upperLegL.x
      onBall(b, ankle.clone().setX(x), at(0, pad, x), out.leg[side])
      out.leg[side].knee.set(0, -1, 0.2)
      out.arm[side].protract = blade
    }
    handsOnFloor(b, out, hands, shoulderWide(b), PIT_FORWARD, 6)
    rig.solve(out)
    if (i === 8) break
    // The line turns on the toes until the arms are exactly locked: a little more angle lifts the shoulders.
    a += (full - rig.pos.upperArmL.distanceTo(out.arm.L.hand)) / ((legs + b.trunk) * Math.cos(a))
  }
  return a
}

function scapSetUp(rig: Rig) {
  return once(rig, 'scap-pushup', () => {
    const out = emptyPose()
    // Hands under the shoulders as they are at the top.
    let hands = 1.15 * rig.body.scale, a = 0.3
    for (let i = 0; i < 4; i++) {
      a = scapPlank(rig, out, hands, 0, a)
      hands = shoulders(rig).z
    }
    return { hands, top: a }
  })
}

/**
 * Scapular push-up: a plank on locked arms, and the only thing that moves is
 * the shoulder blades. They are let together and the chest sinks between
 * the arms, as far as it will go; then the floor is pushed away until they
 * are wrapped round the ribs and the upper back is broad. The elbows never
 * bend and the body stays one line. Revision 2: revision 1 bent the spine a
 * little instead, and hardly moved.
 */
export const scapPushup: Motion = {
  id: 'scap-pushup',
  revision: 2,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 3.4,
  camera: 'side',
  azimuth: 62,
  elevation: 8,
  beat: 0.97,
  // Pushing the floor away is the serratus; letting the chest sink is held by the muscles between the shoulder blades.
  shift: (t) => { const u = down(t); return { serratus: 1 - 0.4 * u, traps: 0.6 + 0.4 * u } },
  standard: 'A plank on locked arms: the elbows stay straight throughout and the body one line. The shoulder blades come together and the chest sinks clearly between the arms, a hand\'s width; then the floor is pushed away until the upper back is broad and round. The shoulders stay over the hands; hips and head go with the chest, they do not sag or nod.',
  effort: (t) => 0.4 + 0.5 * (1 - down(t)),
  pose(t, rig, out) {
    const p = scapSetUp(rig)
    scapPlank(rig, out, p.hands, down(t), p.top)
  },
}

/** The ribcage past the line of the body at the top (pushed up, the upper back domed), and below it at the bottom. */
const SCAP_EARLIER = { top: 13, low: -12 }

/** The plank of the scapular push-up with the arms exactly locked, whatever the ribcage is doing between them. */
function scapPlankEarlier(rig: Rig, out: Pose, hands: number, from: number, round: number): number {
  const b = rig.body
  const full = reachOf(b) * LOCKED
  let y = from
  for (let i = 0; i < 4; i++) {
    plankAt(rig, out, y, () => handsOnFloor(b, out, hands, shoulderWide(b), PIT_FORWARD, 6), { tuck: 4, round })
    y += full - rig.pos.upperArmL.distanceTo(out.arm.L.hand)
  }
  plankAt(rig, out, y, () => handsOnFloor(b, out, hands, shoulderWide(b), PIT_FORWARD, 6), { tuck: 4, round })
  return y
}

function scapSetUpEarlier(rig: Rig) {
  return once(rig, 'scap-pushup-1', () => {
    const b = rig.body
    const out = emptyPose()
    let top = wristHeight(b) + reachOf(b) * LOCKED
    // Hands under the shoulders as they are at the top.
    let hands = plankAt(rig, out, top, (sh) => handsOnFloor(b, out, sh.z, shoulderWide(b), PIT_FORWARD, 6), { tuck: 4, round: SCAP_EARLIER.top }).z
    for (let i = 0; i < 3; i++) {
      top = scapPlankEarlier(rig, out, hands, top, SCAP_EARLIER.top)
      hands = shoulders(rig).z - 0.004 * b.scale
    }
    return { hands, top: scapPlankEarlier(rig, out, hands, top, SCAP_EARLIER.top) }
  })
}

/**
 * The scapular push-up as first written (revision 1): the ribcage bent a little at the spine and hardly travelled.
 * The owner found its range, its execution and its look wrong (2026-11-19). Kept until revision 2 is approved.
 */
export const scapPushupEarlier: Motion = {
  id: 'scap-pushup',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 2.8,
  camera: 'side',
  azimuth: 68,
  elevation: 7,
  beat: 0.97,
  // Pushing the floor away is the serratus; letting the chest sink is held by the muscles between the shoulder blades.
  shift: (t) => { const u = down(t); return { serratus: 1 - 0.4 * u, traps: 0.6 + 0.4 * u } },
  standard: 'A plank on locked arms: the elbows stay straight throughout. The chest sinks between the shoulder blades and is pushed back up until the upper back is round; the hips stay level and the head does not nod.',
  effort: (t) => 0.4 + 0.5 * (1 - down(t)),
  pose(t, rig, out) {
    const u = down(t)
    const p = scapSetUpEarlier(rig)
    scapPlankEarlier(rig, out, p.hands, p.top, lerp(SCAP_EARLIER.top, SCAP_EARLIER.low, u))
    // The head travels with the chest: it is not what moves, and it does not lift as the chest sinks.
    headOnLine(rig, out, 12 - 10 * u)
  },
}

// ── One-arm push-ups ─────────────────────────────────────────────────────

interface OneArm {
  key: string
  /** Height of what the hand is on. */
  surface: (b: Body) => number
  /** At the top, how far the arm reaches ahead of straight down, in degrees. */
  reach: number
  /** How far above the wrist the working shoulder is at the bottom, as a share of the body's scale. */
  depth: number
}

/** Feet apart by this many shoulder widths: wider than the shoulders, well inside double. */
const FEET_APART = 1.6
const feetWide = (b: Body) => b.rest.upperArmL.x * FEET_APART - b.rest.upperLegL.x

/** The working (left) hand flat on its surface; the free hand laid on the small of the back. */
function oneArmHands(b: Body, out: Pose, hand: Vector3) {
  const s = b.scale
  const work = out.arm.L
  work.hand.copy(hand)
  work.rot.copy(handRot('L', new Vector3(-0.1, 0, 1).normalize(), new Vector3(0, -1, 0)))
  // Elbow back along the ribs.
  work.elbow.set(0.2, 0.25, -1)
  work.grip = 0.04
  work.shrug = 0
  const free = out.arm.R
  const on = (x: number, y: number, z: number) => new Vector3(x * s, y * s, z * s).applyQuaternion(out.pelvis)
  free.hand.copy(out.hips).add(on(-0.075, 0.1, -0.112))
  free.rot.copy(handRot('R', on(1, 0.25, 0).normalize(), on(0, 0, -1).normalize()))
  free.elbow.copy(on(-1, -0.2, -0.5))
  free.grip = 0.15
  free.shrug = 0
}

const oneArmBody = (rig: Rig, out: Pose, y: number, hand: Vector3) =>
  plankAt(rig, out, y, () => oneArmHands(rig.body, out, hand), { wide: feetWide(rig.body), tuck: 3, by: 'L' })

function oneArmSetUp(rig: Rig, p: OneArm) {
  return once(rig, p.key, () => {
    const b = rig.body
    const s = b.scale
    const out = emptyPose()
    const h = p.surface(b)
    const full = reachOf(b) * 0.998
    const phi = p.reach * deg
    // The hand under the working shoulder, a little to the inside of it.
    const hand = new Vector3(b.rest.upperArmL.x - 0.045 * s, h + wristHeight(b), 0)
    let top = hand.y + full * Math.cos(phi)
    for (let i = 0; i < 4; i++) {
      const sh = oneArmBody(rig, out, top, hand)
      hand.x = sh.x - 0.045 * s
      const R = Math.sqrt(full * full - (sh.x - hand.x) ** 2)
      top = hand.y + R * Math.cos(phi)
      hand.z = sh.z + R * Math.sin(phi)
    }
    // With the hand now fixed, the top is where the arm is exactly straight.
    for (let i = 0; i < 4; i++) {
      const sh = oneArmBody(rig, out, top, hand)
      top += ((full - sh.distanceTo(hand)) * 0.9) / Math.max(0.35, Math.cos(phi))
    }
    return { hand, top, low: hand.y + p.depth * s, h }
  })
}

const oneArm = (p: OneArm, more: Pick<Motion, 'stage' | 'period' | 'standard' | 'props' | 'azimuth' | 'elevation'>): Motion => ({
  id: p.key,
  revision: 1,
  planted: ['handL', 'toesL', 'toesR'],
  kind: 'reps',
  camera: 'three-quarter',
  beat: 0.97,
  // The free arm does nothing; the working side carries it.
  detail: { delt_lat: 0.14, delt_ant: 0.55, 'pec.R': 0.08, 'pec_upper.R': 0.08, 'triceps.R': 0, 'delt_ant.R': 0, 'delt_lat.R': 0 },
  effort: (t) => 0.4 + 0.6 * down(t),
  pose(t, rig, out) {
    const u = down(t)
    const set = oneArmSetUp(rig, p)
    oneArmBody(rig, out, lerp(set.top, set.low, u), set.hand)
    headOnLine(rig, out, 14 - 6 * u)
  },
  ...more,
})

const INCLINE_ONE: OneArm = { key: 'assisted-oa-pushup', surface: (b) => b.rest.lowerLegL.y * 0.95, reach: 12, depth: 0.185 }
const FLOOR_ONE: OneArm = { key: 'one-arm-pushup', surface: () => 0, reach: -8, depth: 0.176 }

/**
 * Incline one-arm push-up, left arm working: the hand on a bench at knee
 * height, feet wide, the free hand on the back; the chest comes down to the
 * edge with the shoulders and hips level.
 */
export const inclineOneArmPushup = oneArm(INCLINE_ONE, {
  stage: 'low',
  period: 3.2,
  azimuth: 52,
  elevation: 10,
  props: (b) => {
    const { hand, h } = oneArmSetUp(rigOf(b), INCLINE_ONE)
    return [{ kind: 'box', width: 1.1 * b.scale, height: h, depth: 0.46, z: hand.z - 0.04 * b.scale + 0.23 }]
  },
  standard: 'One hand on a surface at knee height, under its shoulder, the other off it; feet wider than the shoulders; shoulders and hips stay level and square, the body straight; the elbow stays close to the ribs; chest to the edge; the arm fully straight at the top.',
})

/**
 * One-arm push-up, left arm working: a full push-up on the floor with the
 * feet wide and the free hand on the back. Nothing twists: shoulders and hips
 * stay square to the floor all the way down and up.
 */
export const oneArmPushup = oneArm(FLOOR_ONE, {
  stage: 'low',
  period: 3.4,
  azimuth: 52,
  elevation: 12,
  standard: 'One hand on the floor under its shoulder, the other on the back; feet wider than the shoulders and no wider than double; shoulders and hips stay level and square to the floor, the body straight; the elbow stays near the ribs; chest to within a fist of the floor; the arm fully straight at the top.',
})

// ── Planche lean ─────────────────────────────────────────────────────────

/** Fingers turned out (as in the pseudo planche push-up), as they are for every planche on the floor: the lean is then not all taken by bending the wrist back. */
const HANDS_OUT = 72
const LEAN = 30

function leanPlank(rig: Rig, out: Pose, hands: number, from: number, round: number): number {
  const b = rig.body
  const full = reachOf(b) * LOCKED
  const place = () => {
    handsOnFloor(b, out, hands, shoulderWide(b), PIT_FORWARD, HANDS_OUT)
    for (const [side] of SIDES) { out.arm[side].shrug = -0.3; out.arm[side].grip = 0.1 }
  }
  let y = from
  for (let i = 0; i < 4; i++) {
    plankAt(rig, out, y, place, { tuck: 6, round })
    // The arm leans: what the shoulders rise by lengthens it only in part.
    y += (full - rig.pos.upperArmL.distanceTo(out.arm.L.hand)) / Math.cos(LEAN * deg)
  }
  plankAt(rig, out, y, place, { tuck: 6, round })
  return y
}

function leanSetUp(rig: Rig) {
  return once(rig, 'planche-lean', () => {
    const b = rig.body
    const out = emptyPose()
    const full = reachOf(b) * LOCKED
    let hands = 0, y = wristHeight(b) + full * Math.cos(LEAN * deg)
    for (let i = 0; i < 4; i++) {
      y = leanPlank(rig, out, hands, y, 9)
      const sh = rig.pos.upperArmL
      const R = Math.sqrt(full * full - (out.arm.L.hand.x - sh.x) ** 2)
      hands = shoulders(rig).z - R * Math.sin(LEAN * deg)
      y = wristHeight(b) + R * Math.cos(LEAN * deg)
    }
    return { hands, y }
  })
}

/**
 * Planche lean: a plank on locked arms, on the toes, with the shoulders
 * leaned well past the hands and the upper back pushed round.
 */
export const plancheLean: Motion = {
  id: 'planche-lean',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  azimuth: 68,
  elevation: 7,
  detail: { delt_lat: 0.3 },
  standard: 'Arms locked, elbow pits forward; the shoulders held clearly in front of the fingertips; shoulder blades pushed apart, the upper back round; the body one straight line on the toes, hips neither piked nor sagging.',
  effort: () => 0.75,
  pose(t, rig, out) {
    const p = leanSetUp(rig)
    leanPlank(rig, out, p.hands, p.y, 9 + 0.8 * breath(t))
    headOnLine(rig, out, 10)
  },
}

// ── Planches ─────────────────────────────────────────────────────────────

interface Planche {
  key: string
  /** What the hands are on: flat on the floor, or round a pair of parallettes. */
  on: 'floor' | 'parallettes'
  /** Pitch of the ribcage and of the pelvis before the body is levelled: the difference is how round the back is. */
  chest: number
  pelvis: number
  /** How far the head is lifted from the line of the ribcage, degrees. */
  look: number
  legs: (rig: Rig, out: Pose, t: number) => void
}

const pitchOf = (rig: Rig, bone: BoneName) => { const up = new Vector3(0, 1, 0).applyQuaternion(rig.rot[bone]); return Math.atan2(up.z, up.y) / deg }

/** A pair of parallettes just outside the shoulders, the hands at z = 0 on them. */
const parallettes = (b: Body) => ({ height: 0.2 * b.scale, gap: 2 * (b.rest.upperArmL.x + 0.04 * b.scale), length: 0.42 * b.scale, radius: 0.016 * b.scale, z: 0.02 * b.scale })
/** How much of the lean the hand takes by sitting slanted on the rail; the wrist takes the rest. */
const SLANT = 0.5

/**
 * Hands on the floor or on the parallettes, arms locked, the shoulders
 * `lean` degrees past the hands and the trunk tipped by `tilt`. The legs are
 * the shape's own. Returns where along the floor the hands carry the weight.
 */
function planchePose(rig: Rig, out: Pose, p: Planche, lean: number, tilt: number, t: number): number {
  const b = rig.body
  const s = b.scale
  let carry = 0
  if (p.on === 'floor') {
    handsOnFloor(b, out, 0, b.rest.upperArmL.x + 0.03 * s, PIT_FORWARD, HANDS_OUT)
    // A little in front of the wrists: the weight is on the whole hand.
    carry = 0.035 * s
  } else {
    const rail = parallettes(b)
    const slant = pitch(lean * SLANT)
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      // The heel of the hand on the rail, the hand closed round its outside, and leaned forward with the arm.
      gripAt(b, arm, side, new Vector3(sign * rail.gap / 2, rail.height, 0), rail.radius, new Vector3(sign * 0.3, -0.954, 0).applyQuaternion(slant), new Vector3(-sign * 0.954, -0.3, 0).applyQuaternion(slant), 1)
      arm.elbow.set(sign * PIT_FORWARD.x, PIT_FORWARD.y, PIT_FORWARD.z)
    }
  }
  for (const [side] of SIDES) { out.arm[side].shrug = -0.4; if (p.on === 'floor') out.arm[side].grip = 0.14 }
  out.chest.copy(pitch(p.chest + tilt))
  out.pelvis.copy(pitch(p.pelvis + tilt))
  out.head.copy(pitch(p.chest + tilt - p.look))
  const wrist = out.arm.L.hand
  const full = reachOf(b) * LOCKED
  const over = (aside: number) => {
    const R = Math.sqrt(Math.max(1e-6, full * full - aside * aside))
    return at(wrist.z + R * Math.sin(lean * deg), wrist.y + R * Math.cos(lean * deg))
  }
  const first = over(wrist.x - b.rest.upperArmL.x)
  out.hips.set(0, first.y, first.z - b.trunk)
  shouldersAt(rig, out, first)
  // The shoulders are pushed forward and down, which moves them: measured, so the arms are exactly straight.
  shouldersAt(rig, out, over(wrist.x - rig.pos.upperArmL.x))
  p.legs(rig, out, t)
  rig.solve(out)
  return carry
}

/**
 * The lean and the tilt of a planche for a body: tilted until the hips are
 * at the height of the shoulders, leaned until the weight is over the hands.
 */
function plancheSetUp(rig: Rig, p: Planche) {
  return once(rig, p.key, () => {
    const b = rig.body
    const out = emptyPose()
    let lean = 30, tilt = 0
    for (let i = 0; i < 30; i++) {
      const carry = planchePose(rig, out, p, lean, tilt, 0.5)
      const sh = shoulders(rig), hip = hipJoints(rig)
      tilt -= (Math.asin(Math.max(-1, Math.min(1, (hip.y - sh.y) / sh.distanceTo(hip)))) / deg) * 0.9
      const off = massCentre((j) => rig.pos[j]).z - carry
      lean -= ((off / (reachOf(b) * Math.cos(lean * deg))) / deg) * 0.8
      lean = Math.max(5, Math.min(70, lean))
    }
    return { lean, tilt }
  })
}

const planche = (p: Planche, more: Pick<Motion, 'standard' | 'effort' | 'azimuth' | 'elevation' | 'detail'> & Partial<Pick<Motion, 'camera' | 'stage'>>): Motion => ({
  id: p.key,
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  ...(p.on === 'parallettes' ? { props: (b: Body): Prop[] => [{ kind: 'rails', ...parallettes(b) }] } : {}),
  pose(t, rig, out) {
    const set = plancheSetUp(rig, p)
    planchePose(rig, out, p, set.lean + 0.35 * breath(t), set.tilt, t)
  },
  ...more,
})

/** Front of the shoulder first; the chest's upper part more than its lower. */
const PLANCHE_DETAIL = { delt_lat: 0.3, pec: 0.4 }

const TUCK: Planche = {
  key: 'tuck-planche', on: 'parallettes', chest: 114, pelvis: 62, look: 26,
  legs(rig, out, t) {
    // Thighs drawn up under the chest, knees together between the arms, heels to the seat.
    for (const [side] of SIDES) bentLeg(rig, out, side, -33 + 0.6 * breath(t), -172, 38, 0.085)
  },
}

const ADV_TUCK: Planche = {
  key: 'adv-tuck-planche', on: 'parallettes', chest: 93, pelvis: 87, look: 20,
  legs(rig, out, t) {
    // Thighs hanging straight down from the hips, shins folded up behind.
    for (const [side] of SIDES) bentLeg(rig, out, side, -86 + 0.5 * breath(t), 162, 30)
  },
}

/** Legs straight and level whatever the pelvis is doing, `spread` degrees apart each side. */
const levelLegs = (spread: number) => (rig: Rig, out: Pose) => straightLegs(rig, out, pitchOf(rig, 'hips') - 90, 50, spread)

const STRADDLE: Planche = { key: 'straddle-planche', on: 'floor', chest: 95, pelvis: 86, look: 22, legs: levelLegs(40) }
const FULL: Planche = { key: 'full-planche', on: 'floor', chest: 95, pelvis: 86, look: 22, legs: levelLegs(0) }

/**
 * Tuck planche: the whole body carried on locked arms, knees drawn to the
 * chest, the back round, the hips as high as the shoulders.
 */
export const tuckPlanche = planche(TUCK, {
  stage: 'square',
  azimuth: 64,
  elevation: 6,
  detail: PLANCHE_DETAIL,
  effort: (t) => 0.85 + 0.05 * Math.abs(breath(t)),
  standard: 'Arms locked; feet off the floor; knees tucked to the chest and clear of the arms; the hips at the height of the shoulders; the upper back round; the shoulders in front of the hands so the weight is over them.',
})

/**
 * Advanced tuck planche: the tuck planche with the back flattened and the
 * hips opened to a right angle, the thighs hanging upright under them.
 */
export const advTuckPlanche = planche(ADV_TUCK, {
  stage: 'square',
  azimuth: 64,
  elevation: 6,
  detail: PLANCHE_DETAIL,
  effort: (t) => 0.9 + 0.05 * Math.abs(breath(t)),
  standard: 'Arms locked; the back flat and level, hips at the height of the shoulders; the hips opened to a right angle so the thighs are upright; knees and feet off the floor; the shoulders further in front of the hands than in the tuck.',
})

/**
 * Straddle planche: the body straight and level on locked arms, the legs
 * straight and spread wide.
 */
export const straddlePlanche = planche(STRADDLE, {
  camera: 'three-quarter',
  azimuth: 42,
  elevation: 22,
  detail: PLANCHE_DETAIL,
  effort: (t) => 0.95 + 0.05 * Math.abs(breath(t)),
  standard: 'Arms locked; shoulders, hips and feet at one height, the body level; hips fully open, not piked and not arched; legs straight and spread wide, toes pointed; nothing touches the floor but the hands.',
})

/**
 * Full planche: shoulders, hips and feet in one straight level line on
 * locked arms, the legs together.
 */
export const fullPlanche = planche(FULL, {
  azimuth: 66,
  elevation: 6,
  detail: PLANCHE_DETAIL,
  effort: () => 1,
  standard: 'Arms locked; one straight level line from shoulders through hips to toes, the hips neither above the shoulders nor sagging; legs straight and together, toes pointed; nothing touches the floor but the hands.',
})

// ── Ring dip ─────────────────────────────────────────────────────────────

/** The thickness of a ring where it is held, and its radius to the middle of that thickness. */
const RING = 0.014
const ringRadius = (b: Body) => 0.104 * b.scale
/** The lowest point of each ring: where the hand is. */
const ringGrip = (b: Body) => 1.36 * b.scale
const ringHalf = (b: Body) => b.rest.upperArmL.x + 0.075 * b.scale
const rings = (b: Body): Prop => ({ kind: 'rings', height: ringGrip(b) + ringRadius(b), top: 2.9 * b.scale, gap: ringHalf(b) * 2, radius: ringRadius(b), z: 0 })
/** How far the hand is turned out over the ring: enough for the forearm to pass inside the ring and its strap, not through them. */
const RING_GRIP = { out: 0.45, down: -0.893 }

/** In support on the rings, `depth` of the way from locked out (0) to the bottom of the dip (1). */
function ringSupport(rig: Rig, out: Pose, depth: number) {
  const b = rig.body
  const s = b.scale
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    // The heel of the hand on the ring, the hand closed round it from the outside, thumb forward: the wrist stays straight over it.
    gripAt(b, arm, side, new Vector3(sign * ringHalf(b), ringGrip(b), 0), RING, new Vector3(sign * RING_GRIP.out, RING_GRIP.down, 0), new Vector3(sign * RING_GRIP.down, -RING_GRIP.out, 0), 1)
    // Elbows straight back: the rings stay close to the body.
    arm.elbow.set(sign * 0.12, 0.1, -1)
    arm.shrug = lerp(-1, -0.4, depth)
  }
  const wrist = out.arm.L.hand
  out.chest.copy(pitch(lerp(5, 26, depth)))
  out.pelvis.copy(pitch(lerp(3, 19, depth)))
  out.head.copy(pitch(lerp(4, 14, depth)))
  const ahead = 0.025 * s
  const low = new Vector3(0, wrist.y + 0.2 * s, 0.17 * s)
  const high = (aside: number) => new Vector3(0, wrist.y + Math.sqrt(Math.max(0, (reachOf(b) * LOCKED) ** 2 - aside ** 2 - ahead ** 2)), ahead)
  const aim = (top: Vector3) => top.lerp(low, depth)
  const first = aim(high(wrist.x - b.rest.upperArmL.x))
  out.hips.set(0, first.y - b.trunk, first.z)
  shouldersAt(rig, out, first)
  // The shoulders press down and narrow at lockout: measured, so the arms are exactly straight.
  shouldersAt(rig, out, aim(high(Math.abs(wrist.x - rig.pos.upperArmL.x))))
}

/**
 * Ring dip: from a still support on locked arms, down between the rings
 * until the shoulders are below the elbows, and pressed back to lockout,
 * the rings kept close to the body the whole way.
 */
export const ringDip: Motion = {
  id: 'ring-dip',
  revision: 1,
  kind: 'reps',
  period: 3.4,
  camera: 'three-quarter',
  azimuth: 58,
  elevation: 3,
  stage: 'tall',
  props: (b) => [rings(b)],
  planted: ['handL', 'handR'],
  beat: 0.97,
  detail: { delt_lat: 0.15, delt_ant: 0.6, pec_upper: 0.55 },
  standard: 'Starts and ends in support with the arms locked and the shoulders pressed down; the shoulders pass below the elbows at the bottom; the elbows track back and the rings stay close to the body, not flaring wide; the wrists straight over the rings; the legs do not swing.',
  effort: (t) => 0.35 + 0.65 * down(t),
  pose(t, rig, out) {
    const depth = down(t)
    ringSupport(rig, out, depth)
    // The legs hang a little in front, the body slightly hollow, and stay quiet.
    straightLegs(rig, out, lerp(3, 19, depth) + lerp(8, 13, depth), 46)
  },
}

/** Easiest first. */
export const PLANCHE: Motion[] = [scapPushup, inclineOneArmPushup, oneArmPushup, plancheLean, tuckPlanche, advTuckPlanche, straddlePlanche, fullPlanche, ringDip]
