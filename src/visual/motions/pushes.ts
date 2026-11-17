/**
 * The pushing variations of the assessment: the push-up from its lightest
 * form (hands on a wall) to its hardest here (the lean of a pseudo planche),
 * and the two vertical presses that follow the pike push-up.
 *
 * Almost all of them are one idea: a straight body turning about its feet
 * (or knees) while the hands stay where they were put. What changes is the
 * height of the hands, the height of the feet, where the hands sit relative
 * to the shoulders, and how deep the bottom is.
 */
import { Quaternion, Vector3 } from 'three'
import { emptyPose, footRot, handRot, pitch, yaw, elbowOf, Rig, type Body, type LegPose, type Pose } from '../rig'
import { SIDES, at, deg, handsOnFloor, hipsAt, legOnBall, proneAt, proneBody, proneLine, shouldersAt, straightLegs, wristHeight } from './kit'
import { ease, lerp, there, type Motion, type Prop } from './types'

// ── Shared machinery ─────────────────────────────────────────────────────

/** Things worked out once per movement and body: where the hands go, how deep the bottom is. */
const memo = new Map<string, unknown>()
function once<T>(rig: Rig, key: string, make: () => T): T {
  const k = `${key}:${rig.body.id}`
  if (!memo.has(k)) memo.set(k, make())
  return memo.get(k) as T
}
const rigs = new Map<string, Rig>()
/** Equipment is sized from the same set-up as the movement, so it needs a rig of its own. */
const rigOf = (b: Body) => rigs.get(b.id) ?? rigs.set(b.id, new Rig(b.id)).get(b.id)!

const shoulders = (rig: Rig) => rig.pos.upperArmL.clone().add(rig.pos.upperArmR).multiplyScalar(0.5)
const down = (t: number) => there(t, 0.42, 0.06)
const effort = (t: number) => 0.35 + 0.65 * down(t)
/** Looking at the floor a little ahead: the head follows the trunk. */
function headOnLine(rig: Rig, out: Pose, shoulder: Vector3, u: number) {
  const lean = Math.asin(Math.max(-1, Math.min(1, (shoulder.y - (rig.pos.upperLegL.y + rig.pos.upperLegR.y) / 2) / rig.body.trunk))) / deg
  out.head.copy(pitch(90 - lean - 14 + 6 * u))
}

/** A way of holding the body straight with the shoulders at a height: on the toes, or on the knees. */
type BodyAt = (rig: Rig, out: Pose, shoulderY: number, arms: (shoulder: Vector3) => void, tuck?: number, pad?: number) => Vector3

/** On the balls of the feet, which are at z = 0. */
const onToes: BodyAt = (rig, out, shoulderY, arms, tuck, pad) => proneAt(rig, out, 0, shoulderY, arms, tuck, pad)

/** Knees on the floor, shins behind them, one line from knees to shoulders. */
const kneelingAt: BodyAt = (rig, out, shoulderY, arms, tuck = 3) => {
  const b = rig.body
  const s = b.scale
  const knee = at(0, 0.052 * s)
  const L = b.upperLeg + b.trunk
  const seen = new Vector3()
  let ask = shoulderY
  for (let i = 0; i < 4; i++) {
    const a = Math.asin(Math.max(-0.2, Math.min(0.98, (ask - knee.y) / L)))
    const dir = at(Math.cos(a), Math.sin(a))
    const lean = 90 - a / deg
    out.pelvis.copy(pitch(lean - tuck))
    out.chest.copy(pitch(lean + tuck * 0.6))
    hipsAt(b, out.pelvis, knee.clone().addScaledVector(dir, b.upperLeg), out.hips)
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      // The shin lies along the floor; the top of the foot rests on it.
      leg.foot.set(sign * b.rest.upperLegL.x, 0.046 * s, -Math.sqrt(b.lowerLeg ** 2 - (0.006 * s) ** 2))
      leg.rot.copy(pitch(176))
      leg.knee.set(0, -1, 0.35)
      leg.toes = 0
    }
    arms(i ? seen : knee.clone().addScaledVector(dir, L))
    rig.solve(out)
    seen.copy(shoulders(rig))
    ask += shoulderY - seen.y
  }
  return seen
}

interface Press {
  key: string
  body?: BodyAt
  /** Height of what the hands are on, and of what the feet are on. */
  surface?: (b: Body) => number
  feet?: (b: Body) => number
  /** At the top, how far the arms reach ahead of straight down, in degrees: negative puts the hands back towards the hips. */
  reach: number
  /** Each hand's distance from the centre line. */
  half: (b: Body) => number
  elbow: Vector3
  turnOut: number
  /** Shoulders to wrists at the bottom, as a share of the body's scale. */
  depth: number
  tuck?: number
}

/**
 * Where a press starts and ends for a body: the hands are placed for straight
 * arms at the top, measured against the shoulders as they really are, and the
 * bottom is found by lowering until the shoulders are `depth` from the wrists.
 */
function setUp(rig: Rig, p: Press) {
  return once(rig, p.key, () => {
    const b = rig.body
    const s = b.scale
    const out = emptyPose()
    const body = p.body ?? onToes
    const h = p.surface?.(b) ?? 0
    const pad = (p.feet?.(b) ?? 0) + 0.014
    const wrist = h + wristHeight(b)
    const full = (b.upperArm + b.lowerArm) * 0.997
    const phi = p.reach * deg
    const half = p.half(b)
    let aside = half - b.rest.upperArmL.x, top = 0, hands = 0
    for (let i = 0; i < 3; i++) {
      const R = Math.sqrt(Math.max(1e-6, full * full - aside * aside))
      top = wrist + R * Math.cos(phi)
      const sh = body(rig, out, top, (seen) => handsOnFloor(b, out, seen.z + R * Math.sin(phi), half, p.elbow, p.turnOut, h), p.tuck, pad)
      hands = sh.z + R * Math.sin(phi)
      aside = half - rig.pos.upperArmL.x
    }
    const fixed = () => handsOnFloor(b, out, hands, half, p.elbow, p.turnOut, h)
    // With the hands now fixed, the top is where the arm is exactly straight.
    for (let i = 0; i < 3; i++) {
      body(rig, out, top, fixed, p.tuck, pad)
      top += ((full - rig.pos.upperArmL.distanceTo(out.arm.L.hand)) * 0.9) / Math.max(0.35, Math.cos(phi))
    }
    const mark = new Vector3(0, wrist, hands)
    const gap = (y: number) => body(rig, out, y, fixed, p.tuck, pad).distanceTo(mark)
    let lo = wrist + 0.08 * s, hi = top
    if (gap(lo) < p.depth * s) {
      for (let i = 0; i < 16; i++) { const mid = (lo + hi) / 2; if (gap(mid) < p.depth * s) lo = mid; else hi = mid }
    } else hi = lo
    return { top, low: hi, hands, h, pad }
  })
}

function press(p: Press, rig: Rig, out: Pose, u: number) {
  const b = rig.body
  const { top, low, hands, h, pad } = setUp(rig, p)
  const shoulder = (p.body ?? onToes)(rig, out, lerp(top, low, u), () => handsOnFloor(b, out, hands, p.half(b), p.elbow, p.turnOut, h), p.tuck, pad)
  headOnLine(rig, out, shoulder, u)
}

/** A bench under the hands: its near edge just behind the heels of the hands, where the chest comes down to. */
const bench = (p: Press) => (b: Body): Prop[] => {
  const { hands, h } = setUp(rigOf(b), p)
  return [{ kind: 'box', width: 1.1 * b.scale, height: h, depth: 0.46, z: hands - 0.04 * b.scale + 0.23 }]
}

const shoulderWidth = (extra: number) => (b: Body) => b.rest.upperArmL.x + extra * b.scale
const back45 = new Vector3(0.72, 0.25, -1)

// ── Wall push-up ─────────────────────────────────────────────────────────

/** Standing with the feet flat and the body straight, leaning forward from the ankles. `angle` is above the floor. */
function leaning(rig: Rig, out: Pose, angle: number) {
  const b = rig.body
  const dir = at(Math.cos(angle), Math.sin(angle))
  out.pelvis.copy(pitch(90 - angle / deg))
  out.chest.copy(out.pelvis)
  out.head.copy(out.pelvis)
  hipsAt(b, out.pelvis, at(0, b.ankle).addScaledVector(dir, (b.upperLeg + b.lowerLeg) * 0.998), out.hips)
  for (const [side, sign] of SIDES) {
    const leg = out.leg[side]
    leg.foot.set(sign * b.rest.upperLegL.x, b.ankle, 0)
    leg.rot.copy(footRot(new Vector3(0, 0, 1), new Vector3(0, 1, 0)))
    leg.knee.set(0, 0, 1)
    leg.toes = 0
  }
}

function wallSetUp(rig: Rig) {
  return once(rig, 'wall-pushup', () => {
    const b = rig.body
    const s = b.scale
    const out = emptyPose()
    const half = b.rest.upperArmL.x + 0.08 * s
    const full = (b.upperArm + b.lowerArm) * 0.997
    const top = 81 * deg
    const hands = (y: number, z: number) => {
      for (const [side, sign] of SIDES) {
        const arm = out.arm[side]
        arm.hand.set(sign * half, y, z)
        arm.rot.copy(handRot(side, new Vector3(sign * 0.1, 1, 0).normalize(), new Vector3(0, 0, 1)))
        arm.elbow.set(sign * 0.65, -1, -0.3)
        arm.grip = 0.04
        arm.shrug = 0
      }
    }
    // An arm's length away, hands at chest height: placed from where the shoulders really are.
    const chest = 0.14 * s
    let y = b.rest.upperArmL.y - chest, z = full
    leaning(rig, out, top)
    for (let i = 0; i < 4; i++) {
      hands(y, z)
      rig.solve(out)
      const sh = rig.pos.upperArmL
      y = sh.y - chest
      z = sh.z + Math.sqrt(Math.max(1e-6, full * full - (half - sh.x) ** 2 - chest ** 2))
    }
    const wall = z + wristHeight(b)
    // Bottom: the nose all but on the wall.
    const reachTo = (angle: number) => { leaning(rig, out, angle); hands(y, z); rig.solve(out); return wall - shoulders(rig).z }
    let lo = 55 * deg, hi = top
    for (let i = 0; i < 16; i++) { const mid = (lo + hi) / 2; if (reachTo(mid) < 0.165 * s) lo = mid; else hi = mid }
    return { top, low: hi, y, z, wall, half }
  })
}

/**
 * Wall push-up: an arm's length from the wall, hands on it at chest height,
 * the body one straight line from heels to head leaning in until the nose
 * reaches the wall, then pressed back to straight arms.
 */
export const wallPushup: Motion = {
  id: 'wall-pushup',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR', 'footL', 'footR'],
  kind: 'reps',
  period: 2.8,
  camera: 'side',
  azimuth: 112,
  elevation: 4,
  beat: 0.97,
  props: (b) => [{ kind: 'wall', z: wallSetUp(rigOf(b)).wall }],
  detail: { delt_lat: 0.14, delt_ant: 0.5 },
  standard: 'Hands on the wall at chest height; the body stays one straight line from heels to head; nose to the wall; arms fully straight at the top; elbows about 45° from the ribs.',
  effort,
  pose(t, rig, out) {
    const u = down(t)
    const p = wallSetUp(rig)
    leaning(rig, out, lerp(p.top, p.low, u))
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.set(sign * p.half, p.y, p.z)
      arm.rot.copy(handRot(side, new Vector3(sign * 0.1, 1, 0).normalize(), new Vector3(0, 0, 1)))
      arm.elbow.set(sign * 0.65, -1, -0.3)
      arm.grip = 0.04
      arm.shrug = 0
    }
  },
}

// ── Incline, knee, diamond, decline, pseudo planche ──────────────────────

const HIGH: Press = { key: 'incline-pushup', surface: (b) => b.rest.upperLegL.y * 0.93, reach: 44, half: shoulderWidth(0.035), elbow: back45, turnOut: 8, depth: 0.22 }
const LOW: Press = { key: 'low-incline-pushup', surface: (b) => b.rest.lowerLegL.y * 0.95, reach: 22, half: shoulderWidth(0.035), elbow: back45, turnOut: 8, depth: 0.21 }
const KNEE: Press = { key: 'knee-pushup', body: kneelingAt, reach: 0, half: shoulderWidth(0.035), elbow: back45, turnOut: 8, depth: 0.19 }
const DIAMOND: Press = { key: 'diamond-pushup', reach: -5, half: (b) => 0.07 * b.scale, elbow: new Vector3(0.28, 0.25, -1), turnOut: -40, depth: 0.19 }
const DECLINE: Press = { key: 'decline-pushup', feet: (b) => b.rest.lowerLegL.y * 0.92, reach: 0, half: shoulderWidth(0.035), elbow: back45, turnOut: 8, depth: 0.19, tuck: 4 }
const PLANCHE: Press = { key: 'pseudo-planche-pushup', reach: -33, half: shoulderWidth(0.025), elbow: new Vector3(0.3, 0.3, -1), turnOut: 72, depth: 0.37, tuck: 5 }

/** High incline push-up: hands on a bench at about hip height, a rigid plank lowered until the chest meets the edge. */
export const inclinePushup: Motion = {
  id: 'incline-pushup',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 2.8,
  camera: 'side',
  azimuth: 72,
  elevation: 5,
  beat: 0.97,
  props: bench(HIGH),
  detail: { delt_lat: 0.14, delt_ant: 0.5 },
  standard: 'Hands on a surface at about hip height; a rigid plank from heels to head; chest to the edge; arms fully straight at the top.',
  effort,
  pose: (t, rig, out) => press(HIGH, rig, out, down(t)),
}

/** Low incline push-up: hands at about knee height, otherwise the floor push-up. */
export const lowInclinePushup: Motion = {
  id: 'low-incline-pushup',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 2.9,
  camera: 'side',
  azimuth: 70,
  elevation: 6,
  beat: 0.97,
  props: bench(LOW),
  detail: { delt_lat: 0.14, delt_ant: 0.55 },
  standard: 'Hands on a surface at about knee height; the same straight line as a floor push-up; chest to the edge; arms fully straight at the top.',
  effort,
  pose: (t, rig, out) => press(LOW, rig, out, down(t)),
}

/** Knee push-up: the floor push-up turning about the knees, with a straight line from knees to head. */
export const kneePushup: Motion = {
  id: 'knee-pushup',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'lowerLegL', 'lowerLegR', 'footL', 'footR'],
  kind: 'reps',
  period: 2.8,
  camera: 'side',
  azimuth: 68,
  elevation: 7,
  beat: 0.97,
  detail: { delt_lat: 0.14, delt_ant: 0.6, pec_upper: 0.85 },
  standard: 'Knees on the floor; one straight line from knees to head, hips neither left behind nor sagging; chest to the floor between the hands; arms fully straight at the top.',
  effort,
  pose: (t, rig, out) => press(KNEE, rig, out, down(t)),
}

/** Diamond push-up: hands together under the chest, elbows travelling back along the ribs. */
export const diamondPushup: Motion = {
  id: 'diamond-pushup',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 3,
  camera: 'side',
  azimuth: 62,
  elevation: 9,
  beat: 0.97,
  detail: { delt_lat: 0.12, delt_ant: 0.55 },
  standard: 'Hands together under the chest; elbows track back close to the ribs, not out to the sides; chest lowers onto the hands; arms fully straight at the top; body straight.',
  effort,
  pose: (t, rig, out) => press(DIAMOND, rig, out, down(t)),
}

/** Decline push-up: feet on a box at about knee height, hands on the floor under the shoulders. */
export const declinePushup: Motion = {
  id: 'decline-pushup',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 3,
  camera: 'side',
  azimuth: 68,
  elevation: 6,
  beat: 0.97,
  props: (b) => [{ kind: 'box', width: 0.6 * b.scale, height: b.rest.lowerLegL.y * 0.92, depth: 0.42, z: -0.12 }],
  detail: { delt_lat: 0.3, pec_upper: 1 },
  standard: 'Feet on a box at about knee height; ribs down and no sag in the lower back; chest to the floor between the hands; arms fully straight at the top.',
  effort,
  pose: (t, rig, out) => press(DECLINE, rig, out, down(t)),
}

/**
 * Pseudo planche push-up: hands by the waist with the fingers turned out,
 * shoulders well in front of the wrists, and that lean kept all the way down
 * and all the way up.
 */
export const pseudoPlanchePushup: Motion = {
  id: 'pseudo-planche-pushup',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 3.2,
  camera: 'side',
  azimuth: 68,
  elevation: 7,
  beat: 0.97,
  detail: { delt_lat: 0.3, delt_ant: 1, pec_upper: 1, forearm_ext: 0.2 },
  standard: 'Hands by the waist, fingers turned out; shoulders well in front of the wrists at the top and the lean held through the whole repetition; hips in line, not rising; arms fully straight at the top.',
  effort,
  pose: (t, rig, out) => press(PLANCHE, rig, out, down(t)),
}

// ── Archer push-up ───────────────────────────────────────────────────────

/** A straight leg from a hip joint to a ball of the foot that stays where it is, whichever way the body has turned. */
function legToBall(b: Body, hip: Vector3, ball: Vector3, leg: LegPose) {
  const ankle = elbowOf(hip, ball, (b.upperLeg + b.lowerLeg) * 0.998, b.ball.length(), new Vector3(0, 1, -0.2))
  const now = ball.clone().sub(ankle).normalize()
  leg.foot.copy(ankle)
  leg.rot.copy(new Quaternion().setFromUnitVectors(b.ball.clone().normalize(), now))
  leg.toes = Math.max(0, Math.min(85, (Math.atan2(b.ball.y, b.ball.z) - Math.atan2(now.y, Math.hypot(now.x, now.z))) / deg))
  leg.knee.set(0, -1, 0.2)
}

/** A prone straight body, turned about the upright through its feet so that the shoulders travel sideways. */
function turnedAt(rig: Rig, out: Pose, shoulderY: number, turn: number, arms: () => void): Vector3 {
  const b = rig.body
  const q = yaw(turn)
  const seen = new Vector3()
  let ask = shoulderY
  for (let i = 0; i < 4; i++) {
    const line = proneLine(b, 0, ask)
    proneBody(b, line, out, 3)
    out.pelvis.premultiply(q)
    out.chest.premultiply(q)
    out.hips.applyQuaternion(q)
    arms()
    rig.solve(out)
    // The balls of the feet stay planted; each leg finds its own way to them.
    for (const [side, sign] of SIDES) legToBall(b, rig.pos[`upperLeg${side}`], at(0, line.pad, sign * b.rest.upperLegL.x), out.leg[side])
    rig.solve(out)
    seen.copy(shoulders(rig))
    ask += shoulderY - seen.y
  }
  return seen
}

function archerHands(b: Body, out: Pose, half: number, z: number) {
  const w = wristHeight(b)
  out.arm.L.hand.set(half, w, z)
  out.arm.L.rot.copy(handRot('L', new Vector3(0.26, 0, 1).normalize(), new Vector3(0, -1, 0)))
  out.arm.L.elbow.set(0.5, 0.25, -1)
  // The assisting hand points out to the side, the way the arm does.
  out.arm.R.hand.set(-half, w, z)
  out.arm.R.rot.copy(handRot('R', new Vector3(-1, 0, 0.45).normalize(), new Vector3(0, -1, 0)))
  out.arm.R.elbow.set(0, 0.5, -1)
  for (const [side] of SIDES) { out.arm[side].grip = 0.04; out.arm[side].shrug = 0 }
}

function archerSetUp(rig: Rig) {
  return once(rig, 'archer-pushup', () => {
    const b = rig.body
    const s = b.scale
    const out = emptyPose()
    const full = (b.upperArm + b.lowerArm) * 0.997
    // Wide hands: far enough apart that both arms are straight with the chest still well off the floor.
    const half = b.rest.upperArmL.x + 0.56 * full
    let z = proneLine(b, 0, wristHeight(b) + 0.83 * full).shoulder.z
    /** The height at which the assisting arm is exactly straight, for a given turn of the body. */
    const straight = (turn: number, from: number) => {
      let y = from
      for (let i = 0; i < 6; i++) {
        turnedAt(rig, out, y, turn, () => archerHands(b, out, half, z))
        const d = rig.pos.upperArmR.distanceTo(out.arm.R.hand) - full
        const rise = Math.max(0.12, (rig.pos.upperArmR.y - out.arm.R.hand.y) / full)
        y -= d / rise
      }
      return y
    }
    let top = straight(0, wristHeight(b) + 0.83 * full)
    for (let i = 0; i < 2; i++) { z = shoulders(rig).z; top = straight(0, top) }
    // How far to turn for the working shoulder to come down to the hand.
    let lo = 0, hi = 16, low = top
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2
      low = straight(mid, low)
      if (low > wristHeight(b) + 0.2 * s) lo = mid
      else hi = mid
    }
    return { half, z, top, turn: hi }
  })
}

/**
 * Archer push-up, left arm working: wide hands; the body shifts over the
 * left hand as that arm bends, while the right arm stays long and straight
 * out to the side with its hand on the floor; hips square to the floor.
 */
export const archerPushup: Motion = {
  id: 'archer-pushup',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 3.4,
  camera: 'front',
  azimuth: 28,
  elevation: 16,
  beat: 0.97,
  detail: { delt_lat: 0.14, delt_ant: 0.55, 'pec.R': 0.5, 'pec_upper.R': 0.5, 'triceps.R': 0.3, 'delt_ant.R': 0.35 },
  standard: 'Wide hands; the chest shifts over the working hand as that arm bends; the assisting arm stays straight the whole way; hips square to the floor; body straight.',
  effort,
  pose(t, rig, out) {
    const b = rig.body
    const u = down(t)
    const p = archerSetUp(rig)
    const full = (b.upperArm + b.lowerArm) * 0.997
    const turn = p.turn * u
    // The assisting arm is a fixed length: as the body shifts away from it, the shoulders have to come down.
    let y = lerp(p.top, wristHeight(b) + 0.2 * b.scale, u)
    let shoulder = new Vector3()
    for (let i = 0; i < 4; i++) {
      shoulder = turnedAt(rig, out, y, turn, () => archerHands(b, out, p.half, p.z))
      const d = rig.pos.upperArmR.distanceTo(out.arm.R.hand) - full
      y -= d / Math.max(0.12, (rig.pos.upperArmR.y - out.arm.R.hand.y) / full)
    }
    shoulder = turnedAt(rig, out, y, turn, () => archerHands(b, out, p.half, p.z))
    headOnLine(rig, out, shoulder, u)
    out.head.premultiply(yaw(turn))
  },
}

// ── Vertical presses ─────────────────────────────────────────────────────

const pikeBox = (b: Body) => b.rest.upperLegL.y * 0.95

function pikeSetUp(rig: Rig) {
  return once(rig, 'elevated-pike-pushup', () => {
    const b = rig.body
    const s = b.scale
    const reach = b.upperArm + b.lowerArm
    const crown = b.height - b.rest.upperArmL.y
    const wrist = wristHeight(b)
    // Top: arms and trunk in one line, close to upright, with the legs level behind on the box.
    const a0 = 72 * deg
    const top = at(-Math.cos(a0) * reach * 0.99, wrist + Math.sin(a0) * reach * 0.99)
    const topHip = top.clone().add(at(-Math.cos(a0), Math.sin(a0)).multiplyScalar(b.trunk))
    const ballY = pikeBox(b) + 0.014 * s
    const ballZ = topHip.z - Math.sqrt(Math.max(0, ((b.upperLeg + b.lowerLeg) * 0.998 + b.ball.length() * 0.25) ** 2 - (topHip.y - ballY) ** 2))
    // Bottom: the crown of the head a hand's length in front of the hands, just off the floor.
    const a1 = 67 * deg
    const low = at(0.085 * s - Math.cos(a1) * crown, 0.008 * s + Math.sin(a1) * crown)
    return { a0, a1, top, low, ballY, ballZ }
  })
}

/**
 * Elevated pike push-up: feet on a box at hip height so that the hips sit
 * over the shoulders and the trunk is close to upright; the head goes to the
 * floor in front of the hands and the arms press back to straight.
 */
export const elevatedPikePushup: Motion = {
  id: 'elevated-pike-pushup',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 3.2,
  camera: 'side',
  azimuth: 68,
  elevation: 5,
  beat: 0.97,
  props: (b) => { const p = pikeSetUp(rigOf(b)); return [{ kind: 'box', width: 0.6 * b.scale, height: pikeBox(b), depth: 0.5, z: p.ballZ - 0.13 }] },
  detail: { pec_upper: 0.25, delt_post: 0.2 },
  standard: 'Feet on a box at hip height; hips stay stacked over the shoulders; the head goes to the floor in front of the hands; elbows back, not flared; arms fully straight at the top.',
  effort,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = down(t)
    const p = pikeSetUp(rig)
    const e = ease(u)
    const angle = lerp(p.a0, p.a1, e)
    const shoulder = p.top.clone().lerp(p.low, e)
    shoulder.z += Math.sin(u * Math.PI) * 0.015 * s
    const lean = 90 + angle / deg
    out.chest.copy(pitch(lean))
    out.pelvis.copy(pitch(lean + 4))
    out.head.copy(pitch(lean - lerp(8, 2, u)))
    hipsAt(b, out.pelvis, shoulder.clone().add(at(-Math.cos(angle), Math.sin(angle)).multiplyScalar(b.trunk)), out.hips)
    handsOnFloor(b, out, 0, b.rest.upperArmL.x + 0.03 * s, new Vector3(0.78, 0.1, -1), 6)
    for (const [side] of SIDES) out.arm[side].shrug = lerp(0.9, 0.2, u)
    shouldersAt(rig, out, shoulder)
    for (const [side, sign] of SIDES) {
      legOnBall(b, rig.pos[`upperLeg${side}`], at(p.ballZ, p.ballY, sign * b.rest.upperLegL.x), new Vector3(0, 0.6, -1), out.leg[side])
      out.leg[side].knee.set(0, -0.3, 1)
    }
  },
}

/** A handstand with the back to a wall (the wall is at +Z, behind the back): the shoulders are put somewhere and the body leans so that the heels rest on it. */
function againstWall(rig: Rig, out: Pose, shoulder: Vector3, wall: number, shrug: number, look: number) {
  const b = rig.body
  const s = b.scale
  const lean = Math.asin(Math.max(-0.3, Math.min(0.3, (wall - 0.095 * s - shoulder.z) / (b.trunk + b.upperLeg + b.lowerLeg)))) / deg
  out.chest.copy(pitch(180 + lean))
  out.pelvis.copy(pitch(180 + lean))
  out.head.copy(pitch(180 + lean - look))
  handsOnFloor(b, out, 0, b.rest.upperArmL.x + 0.035 * s, new Vector3(0.8, 0, -1), 4)
  for (const [side] of SIDES) out.arm[side].shrug = shrug
  out.hips.set(0, shoulder.y + b.trunk, shoulder.z)
  shouldersAt(rig, out, shoulder)
  straightLegs(rig, out, 0, 20)
}

const crownOf = (rig: Rig) => rig.pos.head.clone().add(new Vector3(0, rig.body.height - rig.body.rest.head.y, 0).applyQuaternion(rig.rot.head))

function hspuSetUp(rig: Rig) {
  return once(rig, 'wall-hspu', () => {
    const b = rig.body
    const s = b.scale
    const out = emptyPose()
    const wall = 0.4 * s
    const full = (b.upperArm + b.lowerArm) * 0.9985
    // Top: arms locked, shoulders pushed tall, a little towards the wall.
    const top = at(0.03 * s, wristHeight(b) + full)
    for (let i = 0; i < 4; i++) {
      againstWall(rig, out, top, wall, 1, 16)
      top.y += full - rig.pos.upperArmL.distanceTo(out.arm.L.hand)
    }
    // Bottom: the top of the head on the floor in front of the hands, towards the wall.
    const mark = at(0.2 * s, 0.03 * s)
    const low = at(0.16 * s, 0.37 * s)
    for (let i = 0; i < 5; i++) {
      againstWall(rig, out, low, wall, 0.2, 8)
      low.add(mark.clone().sub(crownOf(rig)).setX(0))
    }
    return { wall, top, low }
  })
}

/**
 * Wall handstand push-up, back to the wall: from locked, shrugged arms the
 * head is lowered to the floor in front of the hands (hands and head make a
 * triangle) and pressed back up, the body straight and the legs quiet.
 */
export const wallHspu: Motion = {
  id: 'wall-hspu',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 3.6,
  camera: 'side',
  azimuth: 114,
  elevation: 3,
  beat: 0.97,
  props: (b) => [{ kind: 'wall', z: hspuSetUp(rigOf(b)).wall }],
  detail: { pec_upper: 0.25, delt_post: 0.25, forearm_flex: 0.5, forearm_ext: 0.4 },
  standard: 'Back to the wall, heels resting on it; the head touches the floor in front of the hands, making a triangle with them; pressed to fully locked, shrugged arms; body straight, no kick from the legs.',
  effort,
  pose(t, rig, out) {
    const u = down(t)
    const p = hspuSetUp(rig)
    const e = ease(u)
    againstWall(rig, out, p.top.clone().lerp(p.low, e), p.wall, lerp(1, 0.2, e), lerp(16, 8, e))
  },
}

/** The pushing variations of the assessment, easiest first. */
export const PUSHES: Motion[] = [
  wallPushup, inclinePushup, lowInclinePushup, kneePushup, diamondPushup, declinePushup, archerPushup, pseudoPlanchePushup, elevatedPikePushup, wallHspu,
]
