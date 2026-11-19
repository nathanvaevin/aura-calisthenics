/**
 * Upside down beyond the first handstand: its shapes, its press, one arm, the headstand, and pressing out of it.
 *
 * As in the handstand station, an inverted body faces -Z and its fingers
 * point +Z: the chest side is -Z, the back (and a wall behind it) +Z.
 *
 * What is new here is that the shapes are no longer a straight line over the
 * wrists. A tuck, a press or one arm are balanced by where the weight is,
 * so these movements work out the body's centre of mass and put it over the
 * hands, the way the athlete has to.
 */
import { Quaternion, Vector3 } from 'three'
import type { Side } from '../body/skeleton'
import { Rig, emptyPose, handRot, pitch, type Body, type Pose } from '../rig'
import { BACK, stand, wallsOf } from './inverted'
import { againstWall, hspuSetUp } from './pushes'
import { SIDES, at, deg, handsOnFloor, legOnBall, onBall, shouldersAt, straightLegs, wristHeight } from './kit'
import { ease, lerp, there, type Motion } from './types'

// ── Shared machinery ─────────────────────────────────────────────────────

const ramp = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))))
/** 0 → 1 → 0 between two moments, at rest at both ends and at the top. */
const bump = (t: number, a: number, b: number) => (t <= a || t >= b ? 0 : Math.sin((Math.PI * (t - a)) / (b - a)) ** 2)
const breath = (t: number) => Math.sin(t * Math.PI * 2)
/** The balance: a slow drift and a quicker correction, a degree or so each way. */
const sway = (t: number) => 1.1 * Math.sin(t * Math.PI * 2) + 0.45 * Math.sin(t * Math.PI * 6 + 1)
const mid = (a: Vector3, b: Vector3) => a.clone().add(b).multiplyScalar(0.5)

/** Things worked out once per movement and body, on a rig of their own. */
const memo = new Map<string, unknown>()
const rigs = new Map<string, Rig>()
function once<T>(b: Body, key: string, make: (rig: Rig, out: Pose) => T): T {
  const k = `${key}:${b.id}`
  if (!memo.has(k)) {
    const rig = rigs.get(b.id) ?? rigs.set(b.id, new Rig(b.id)).get(b.id)!
    memo.set(k, make(rig, emptyPose()))
  }
  return memo.get(k) as T
}

/** The value of x at which f is zero, from two first guesses. */
function root(f: (x: number) => number, a: number, b: number, steps = 8): number {
  let fa = f(a), fb = f(b)
  for (let i = 0; i < steps && Math.abs(fb) > 2e-5 && fb !== fa; i++) {
    const c = b - (fb * (b - a)) / (fb - fa)
    a = b; fa = fb; b = c; fb = f(b)
  }
  return b
}

/** The top of the head of a solved pose. */
export const crownOf = (rig: Rig) => rig.pos.head.clone().add(new Vector3(0, rig.body.height - rig.body.rest.head.y, 0).applyQuaternion(rig.rot.head))

/**
 * Where the weight of a solved pose is: its centre of mass, from the usual
 * shares of body mass per segment (de Leva 1996). A body is balanced on its
 * hands when this is over them.
 */
export function centreOf(rig: Rig): Vector3 {
  const p = rig.pos
  const c = new Vector3()
  const add = (share: number, a: Vector3, b: Vector3, f: number) => c.addScaledVector(a.clone().lerp(b, f), share)
  add(0.0694, p.neck, crownOf(rig), 0.5)
  add(0.1596, p.neck, p.chest, 0.55)
  add(0.1633, p.chest, p.spine, 0.5)
  add(0.1117, p.spine, mid(p.upperLegL, p.upperLegR), 0.6)
  for (const [s] of SIDES) {
    add(0.0271, p[`upperArm${s}`], p[`lowerArm${s}`], 0.45)
    add(0.0162, p[`lowerArm${s}`], p[`hand${s}`], 0.43)
    add(0.0061, p[`hand${s}`], p[`fingers1${s}`], 0.7)
    add(0.1416, p[`upperLeg${s}`], p[`lowerLeg${s}`], 0.41)
    add(0.0433, p[`lowerLeg${s}`], p[`foot${s}`], 0.44)
    add(0.0137, p[`foot${s}`], p[`toes${s}`], 0.5)
  }
  return c
}

/** How far the head is lifted in a handstand for the eyes to be on the floor between the hands (the freestanding handstand's own). */
const LOOK = 46

interface OnHands {
  /** Degrees the locked arms lean from the wrists towards the fingers: how far the shoulders are in front of the hands. */
  lean: number
  /** Degrees the ribcage leans the same way. */
  chest: number
  /** Degrees the lower back is rounded: the pelvis tucked under, towards the chest. */
  round?: number
  /** How far the head is lifted from the upright, degrees. */
  look?: number
  grip?: number
}

/** Locked arms on flat hands at shoulder width, the shoulders pushed tall, and the trunk above them. The legs are for the caller. */
function onHands(rig: Rig, out: Pose, o: OnHands) {
  const b = rig.body
  const reach = b.upperArm + b.lowerArm
  handsOnFloor(b, out, 0, b.rest.upperArmL.x * 1.02, new Vector3(1, 0, 0.6), 4)
  for (const [side] of SIDES) { out.arm[side].shrug = 1; out.arm[side].grip = o.grip ?? 0.12 }
  out.chest.copy(pitch(180 + o.chest))
  out.pelvis.copy(pitch(180 + o.chest - (o.round ?? -1.5)))
  out.head.copy(pitch(180 - (o.look ?? LOOK)))
  const a = o.lean * deg
  const target = at(Math.sin(a) * reach, wristHeight(b) + Math.cos(a) * reach * 0.9975)
  out.hips.set(0, target.y + b.trunk, target.z)
  shouldersAt(rig, out, target)
}

/** A direction in the plane the body moves in, from an angle of pitch: 0 points down a standing leg, 90 level towards the chest of a body upside down, 180 straight up. */
const down = (angle: number) => new Vector3(0, -Math.cos(angle * deg), -Math.sin(angle * deg))

/** Both legs folded, knees together: the thighs along one angle of pitch, the shins folded back from them by `knee` degrees, toes pointed. Needs the rig solved for the trunk. */
function foldedLegs(rig: Rig, out: Pose, thigh: number, knee: number, point = 50) {
  const b = rig.body
  for (const [side, sign] of SIDES) {
    const hip = rig.pos[`upperLeg${side}`]
    const k = hip.clone().addScaledVector(down(thigh), b.upperLeg)
    const leg = out.leg[side]
    leg.foot.copy(k).addScaledVector(down(thigh + knee), b.lowerLeg)
    leg.foot.x = hip.x - sign * 0.02 * b.scale
    leg.knee.copy(k).sub(mid(hip, leg.foot))
    leg.rot.copy(pitch(thigh + knee + point))
    leg.toes = -18
  }
}

/** The weight a straight handstand carries over its wrists: where the centre of mass of the stacked line is, front to back. */
const stacked = (b: Body) => once(b, 'stacked', (rig, out) => {
  stand(rig, out, { tilt: 0, head: LOOK, point: 52 })
  rig.solve(out)
  return centreOf(rig).z
})

// ── Wrist preparation ────────────────────────────────────────────────────

/** How far the shoulders travel in the wrist rocks: degrees the straight arms lean forward and back, and the share of a body height they move to each side. */
const ROCK = { forward: 14, back: 8, aside: 0.1 }

/**
 * Wrist preparation on hands and knees: the hands stay flat and the weight
 * rocks over them. Forward, until the shoulders are over the fingers with
 * the heel of the hand still down; back; then to each side.
 */
export const wristPrep: Motion = {
  id: 'wrist-prep',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'lowerLegL', 'lowerLegR', 'footL', 'footR'],
  kind: 'mobility',
  period: 9.6,
  camera: 'side',
  azimuth: 58,
  elevation: 9,
  beat: 0.14,
  standard: 'On hands and knees, hands flat under the shoulders with the fingers forward; arms straight throughout; the shoulders rock slowly forward until they are over the fingers, back behind the wrists, then to each side; the hands do not move and the heel of the hand stays on the floor.',
  effort: (t) => 0.25 + 0.5 * bump(t, 0, 0.28) + 0.25 * bump(t, 0.28, 0.5) + 0.35 * (bump(t, 0.5, 0.75) + bump(t, 0.75, 1)),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    // One rock at a time, each coming to rest before the next: forward, back, left, right.
    const lean = ROCK.forward * bump(t, 0, 0.28) - ROCK.back * bump(t, 0.28, 0.5)
    const aside = ROCK.aside * s * (bump(t, 0.5, 0.75) - bump(t, 0.75, 1))
    const reach = (b.upperArm + b.lowerArm) * 0.998
    const thigh = b.upperLeg
    const knee = at(0, 0.052 * s)
    const ankle = 0.046 * s
    // At rest: hips over the knees, shoulders over the wrists.
    const rise = wristHeight(b) + reach - (knee.y + thigh)
    const wrists = Math.sqrt(b.trunk ** 2 - rise ** 2)
    handsOnFloor(b, out, wrists, b.rest.upperArmL.x, new Vector3(0.5, 0, -1), 4)
    for (const [side] of SIDES) { out.arm[side].shrug = 0.25; out.arm[side].grip = 0.02 }
    // The shoulders go where the leaning arms put them; the hips follow on the thighs, which turn about the knees.
    const a = lean * deg
    const shoulder = new Vector3(aside, wristHeight(b) + Math.sqrt(Math.max(0, (reach * Math.cos(a)) ** 2 - aside ** 2)), wrists + reach * Math.sin(a))
    const swing = (z: number) => new Vector3(aside, knee.y + Math.sqrt(thigh ** 2 - z ** 2 - aside ** 2), z)
    const hipZ = root((z) => swing(z).distanceTo(shoulder) - b.trunk, 0, 0.02 * s, 6)
    const hip = swing(hipZ)
    // The trunk tips until the arms are exactly straight: the shoulder girdle moves with the arms, so it is measured.
    const flat = 90 - Math.asin((shoulder.y - hip.y) / b.trunk) / deg
    const gap = (tip: number) => {
      out.pelvis.copy(pitch(flat + tip - 2))
      out.chest.copy(pitch(flat + tip + 2))
      out.head.copy(pitch(flat + tip - 5))
      const off = new Vector3(0, b.rest.upperLegL.y - b.rest.hips.y, b.rest.upperLegL.z - b.rest.hips.z).applyQuaternion(out.pelvis)
      out.hips.copy(hip).sub(off)
      rig.solve(out)
      return rig.pos.upperArmL.distanceTo(out.arm.L.hand) - reach
    }
    root(gap, 0, 3, 6)
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      const x = sign * b.rest.upperLegL.x
      leg.foot.set(x, ankle, -Math.sqrt(b.lowerLeg ** 2 - (knee.y - ankle) ** 2))
      leg.rot.copy(pitch(180 - 4))
      // The knee stays where it is on the floor while the thigh turns about it.
      leg.knee.set(x, knee.y, 0).sub(mid(rig.pos[`upperLeg${side}`], leg.foot))
      leg.toes = 0
    }
  },
}

// ── At the wall ──────────────────────────────────────────────────────────

/** Heel pulls: 0 while the heels rest on the wall, 1 while the body is balanced off it. */
const pulled = (t: number) => ramp(t, 0.08, 0.34) * (1 - ramp(t, 0.72, 0.95))

/**
 * Heel pulls: a back-to-wall handstand, heels resting on the wall. The
 * fingers press into the floor and the whole line, still straight and tall,
 * comes off the wall until it stands over the hands; it is held there for as
 * long as it lasts and goes back to the wall softly.
 */
export const heelPulls: Motion = {
  id: 'heel-pulls',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 6.6,
  beat: 0.34,
  camera: 'side',
  azimuth: 112,
  elevation: 2,
  props: (b) => [{ kind: 'wall', z: wallsOf(b).back }],
  detail: { delt_post: 0.3 },
  standard: 'Back to the wall, only the heels on it; the fingers press and the body comes off the wall as one straight line, arms locked, until wrists, shoulders, hips and ankles are stacked; no push from the feet and no bend at the hips; it returns to the wall softly.',
  effort: (t) => 0.5 + 0.45 * pulled(t),
  shift: (t) => ({ forearm_flex: 0.55 + 0.45 * pulled(t), forearm_ext: 0.55 + 0.45 * pulled(t) }),
  pose(t, rig, out) {
    const off = pulled(t)
    // Off the wall the line is alive: a degree or so of drift, caught by the fingers.
    const drift = off * (0.8 * Math.sin(t * Math.PI * 6) + 0.3 * Math.sin(t * Math.PI * 14 + 1))
    stand(rig, out, { tilt: BACK.tilt * (1 - off), drift, head: LOOK, point: BACK.point + 12 * off })
    // The fingers do the work: they dig in to start the pull and keep working to hold it.
    const press = Math.max(bump(t, 0.04, 0.3), 0.5 * off)
    for (const [side] of SIDES) out.arm[side].grip = 0.1 + 0.16 * press
  },
}

/** Where the tripod of a headstand stands for a body: the shoulders over the head, the forearms upright over the hands. */
const tripodOf = (b: Body) => once(b, 'headstand', (rig, out) => {
  const s = b.scale
  const shoulder = at(0.27 * s, 0.33 * s)
  for (let i = 0; i < 8; i++) {
    headstandPose(rig, out, shoulder, 0, 0)
    rig.solve(out)
    // The crown rests on the floor, and the elbows are over the wrists.
    shoulder.y += 0.012 * s - crownOf(rig).y
    shoulder.z -= (rig.pos.lowerArmL.z + rig.pos.lowerArmR.z) / 2
  }
  return shoulder
})

/** How far a headstand's line leans back from the head towards the hands, in degrees: that is what puts weight on the hands and takes it off the neck. */
const TRIPOD_LEAN = 3

function headstandPose(rig: Rig, out: Pose, shoulder: Vector3, drift: number, push: number) {
  const b = rig.body
  handsOnFloor(b, out, 0, b.rest.upperArmL.x + 0.015 * b.scale, new Vector3(0.12, 0, -1), 2)
  for (const [side] of SIDES) { out.arm[side].shrug = 0.5 + 0.2 * push; out.arm[side].grip = 0.08 + 0.05 * push }
  out.head.copy(pitch(180))
  out.chest.copy(pitch(180 - TRIPOD_LEAN))
  out.pelvis.copy(pitch(180 - TRIPOD_LEAN + 1.5 - drift))
  out.hips.set(0, shoulder.y + b.trunk, shoulder.z)
  shouldersAt(rig, out, shoulder)
  straightLegs(rig, out, -drift * 0.6, 50)
}

/**
 * Tripod headstand: the crown of the head and the two hands make a triangle
 * on the floor, the elbows bent to a right angle over the wrists, and the
 * body stands straight up from the shoulders with most of the weight pushed
 * into the hands.
 */
export const headstand: Motion = {
  id: 'headstand',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR', 'head'],
  kind: 'balance',
  period: 5,
  camera: 'side',
  azimuth: 62,
  elevation: 4,
  detail: { delt_post: 0.25 },
  standard: 'The crown of the head and both hands form an even triangle, the head ahead of the hands; elbows at a right angle over the wrists, not flared; hips over the shoulders and the legs straight and vertical, toes pointed; the weight sits between head and hands, not on the neck alone.',
  effort: (t) => 0.5 + 0.12 * Math.abs(breath(t)),
  pose(t, rig, out) {
    headstandPose(rig, out, tripodOf(rig.body), 0.8 * Math.sin(t * Math.PI * 2) + 0.3 * Math.sin(t * Math.PI * 6 + 1), 0.5 + 0.5 * breath(t))
  },
}

// ── Freestanding shapes ──────────────────────────────────────────────────

/** The tuck: how far the lower back rounds, where the thighs point (degrees of pitch: 90 is level) and how far the knees fold. */
const TUCK = { chest: 3, round: 24, thigh: 30, knee: 146 }

function tuckPose(rig: Rig, out: Pose, lean: number, drift: number) {
  onHands(rig, out, { lean, chest: TUCK.chest + drift * 0.5, round: TUCK.round, look: LOOK + 6 })
  foldedLegs(rig, out, TUCK.thigh - drift * 0.6, TUCK.knee)
}

/** How far the shoulders have to be in front of the wrists for a tuck to balance: with the knees in front, the weight is only over the hands once the shoulders have gone the other way. */
const tuckLean = (b: Body) => once(b, 'tuck-hs', (rig, out) =>
  root((lean) => { tuckPose(rig, out, lean, 0); rig.solve(out); return centreOf(rig).z - stacked(b) }, 4, 8))

/**
 * Tuck handstand: arms locked, the knees drawn down to the chest with the
 * lower back rounded, and the shoulders leaning past the wrists by as much
 * as it takes to keep the weight over the hands.
 */
export const tuckHs: Motion = {
  id: 'tuck-hs',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR'],
  kind: 'balance',
  period: 5.2,
  camera: 'side',
  azimuth: 68,
  elevation: 3,
  detail: { delt_post: 0.3, forearm_flex: 0.6, forearm_ext: 0.5 },
  standard: 'Arms locked and shoulders pushed tall; knees drawn to the chest, thighs below horizontal, lower back slightly rounded; the shoulders lean in front of the wrists just far enough that the weight stays over the hands; hands still, eyes on the floor between them.',
  effort: (t) => 0.65 + 0.2 * Math.abs(breath(t)),
  pose(t, rig, out) {
    const drift = sway(t)
    tuckPose(rig, out, tuckLean(rig.body) + drift * 0.5, drift)
    for (const [side] of SIDES) out.arm[side].grip = 0.14 - 0.05 * breath(t)
  },
}

/** The straddle: each leg this far from upright, and the little the hips fold so that they can open that wide. */
const STRADDLE = { spread: 58, flex: 4 }

/**
 * Straddle handstand: the same stacked line from wrists to hips, the legs
 * straight and opened wide to the sides, level with each other.
 */
export const straddleHs: Motion = {
  id: 'straddle-hs',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR'],
  kind: 'balance',
  period: 5.2,
  camera: 'front',
  azimuth: 150,
  elevation: 2,
  detail: { delt_post: 0.3, forearm_flex: 0.6, forearm_ext: 0.5 },
  standard: 'Arms locked, shoulders pushed tall; wrists, shoulders and hips on one vertical line, the hips not piking forward; legs straight and opened evenly, each more than 45° from vertical, toes pointed out to the sides; hands still.',
  effort: (t) => 0.55 + 0.2 * Math.abs(breath(t)),
  pose(t, rig, out) {
    const drift = sway(t)
    stand(rig, out, { tilt: 0, drift, head: LOOK, point: 50, spread: STRADDLE.spread, flex: STRADDLE.flex })
    for (const [side] of SIDES) out.arm[side].grip = 0.12 - 0.05 * breath(t)
  },
}

// ── Press to handstand ───────────────────────────────────────────────────

/** One moment of the press, in the terms a pose is written in. */
interface Pressing {
  /** Degrees the arms lean past the wrists, the ribcage leans from upright (negative: hips behind the shoulders), and the lower back is rounded. */
  lean: number
  chest: number
  round: number
  /** The legs, from the pelvis: degrees folded forward and degrees apart, each. */
  flex: number
  spread: number
}

const PRESS = {
  /** The stance: each leg this far from upright and this far forward of the hips, the lower back rounded, the shoulders just over the wrists. */
  stance: 28, slant: 22, round: 20, lean: 2,
  /** On the floor: how far the heels rise before the feet leave it, degrees, and how far the back has rounded by then. */
  tiptoe: 72, compress: 62,
  /** In the air: the widest the legs open, each. */
  wide: 64,
  /** How finely the way up is worked out. */
  floor: 8, air: 28,
  palm: 0,
}

/** Where the weight is kept while the feet are off the floor: a little towards the palm from where a handstand stands. */
const overHands = (b: Body, w: number) => stacked(b) + PRESS.palm * b.scale * (1 - ramp(w, 0.7, 1))

/** The trunk and arms of a moment of the press. */
function pressTrunk(rig: Rig, out: Pose, p: Pressing, up: number) {
  // The eyes stay on the floor between the hands: the head lifts further as the trunk comes upright.
  onHands(rig, out, { lean: p.lean, chest: p.chest, round: p.round, look: lerp(8, LOOK, up) - p.chest * 0.82 })
}

/** A straight leg from a hip joint to a foot whose ball stays where it is on the floor, the heel lifted by `tilt` degrees. The foot points forward. */
function legToBall(b: Body, ball: Vector3, tilt: number, leg: Pose['leg'][Side]) {
  const rest = Math.atan2(b.ball.y, b.ball.z)
  const now = rest - tilt * deg
  const f = b.ball.length()
  onBall(b, new Vector3(ball.x, ball.y - f * Math.sin(now), ball.z - f * Math.cos(now)), ball, leg)
  leg.knee.set(0, 0, 1)
}

/**
 * The whole press for a body, worked out once: the stance, the lean on the
 * floor until the weight is over the hands (which is when the feet come off
 * without a jump), and then the way up, where at every moment the shoulders
 * lean exactly as far as it takes to keep the weight there.
 */
const pressOf = (b: Body) => once(b, 'press-hs', (rig, out) => {
  const legs = (b.upperLeg + b.lowerLeg) * 0.999
  const hipJoint = () => { rig.solve(out); return rig.pos.upperLegL.clone() }
  // The stance: a straddle stand folded over flat feet, hands on the floor in front, the hips over the ankles.
  const first: Pressing = { lean: PRESS.lean, chest: -60, round: PRESS.round, flex: 0, spread: 0 }
  const along = new Vector3(Math.sin(PRESS.stance * deg), -Math.cos(PRESS.stance * deg) * Math.cos(PRESS.slant * deg), Math.cos(PRESS.stance * deg) * Math.sin(PRESS.slant * deg))
  const height = b.ankle - legs * along.y
  first.chest = root((c) => { first.chest = c; pressTrunk(rig, out, first, 0); return hipJoint().y - height }, -62, -55)
  const hip = hipJoint()
  const ball = hip.clone().addScaledVector(along, legs).add(b.ball)
  const ankleAt = (tilt: number) => {
    const now = Math.atan2(b.ball.y, b.ball.z) - tilt * deg
    return new Vector3(ball.x, ball.y - b.ball.length() * Math.sin(now), ball.z - b.ball.length() * Math.cos(now))
  }
  /** On the floor: the trunk that keeps the legs straight to feet that have not moved, for a lean and a heel height. */
  const onFloor = (v: number, lean: number): Pressing => {
    const p: Pressing = { lean: lerp(PRESS.lean, lean, v), chest: first.chest, round: lerp(PRESS.round, PRESS.compress, v), flex: 0, spread: 0 }
    const ankle = ankleAt(PRESS.tiptoe * ease(v))
    p.chest = root((c) => { p.chest = c; pressTrunk(rig, out, p, 0); return hipJoint().distanceTo(ankle) - legs }, first.chest, first.chest + 4)
    // The legs as the pelvis sees them, for the moment they leave the floor.
    const dir = ankle.sub(hipJoint()).normalize().applyQuaternion(out.pelvis.clone().invert())
    p.spread = Math.asin(Math.min(1, dir.x)) / deg
    p.flex = Math.atan2(dir.z, -dir.y) / deg
    return p
  }
  // The feet leave the floor when the weight has reached the hands: that lean is found, not chosen.
  const weight = () => { rig.solve(out); return centreOf(rig).z }
  const legsFor = (p: Pressing) => { rig.solve(out); straightLegs(rig, out, p.flex, 50, p.spread) }
  const off = root((lean) => { const p = onFloor(1, lean); pressTrunk(rig, out, p, 0); legsFor(p); return weight() - overHands(b, 0) }, 14, 18)
  const floor = Array.from({ length: PRESS.floor + 1 }, (_, i) => onFloor(i / PRESS.floor, off))
  const from = floor[PRESS.floor]
  // In the air: the hips rise over the shoulders first; the legs open, come round the side and close.
  const shape = (w: number): Pressing => ({
    lean: 0,
    chest: lerp(from.chest, 0, ramp(w, 0, 0.6)),
    round: lerp(from.round, -1.5, ramp(w, 0.3, 0.95)),
    flex: lerp(from.flex, 0, ramp(w, 0.08, 0.92)),
    spread: lerp(lerp(from.spread, PRESS.wide, ramp(w, 0, 0.45)), 0, ramp(w, 0.55, 1)),
  })
  let guess = off
  const air = Array.from({ length: PRESS.air + 1 }, (_, i) => {
    const w = i / PRESS.air
    const p = shape(w)
    p.lean = i === PRESS.air ? 0 : root((lean) => { p.lean = lean; pressTrunk(rig, out, p, w); legsFor(p); return weight() - overHands(b, w) }, guess, guess - 1)
    guess = p.lean
    return p
  })
  return { ball, floor, air }
})

const between = (list: Pressing[], x: number): Pressing => {
  const f = Math.min(list.length - 1 - 1e-9, Math.max(0, x * (list.length - 1)))
  const i = Math.floor(f), k = f - i
  const a = list[i], z = list[i + 1]
  return { lean: lerp(a.lean, z.lean, k), chest: lerp(a.chest, z.chest, k), round: lerp(a.round, z.round, k), flex: lerp(a.flex, z.flex, k), spread: lerp(a.spread, z.spread, k) }
}

/** How far through the press the body is: 0 standing in the fold, 1 in the handstand. A quarter of it is the lean on the floor. */
const PRESS_FLOOR = 0.25
const pressed = (t: number) => ramp(t, 0.04, 0.47) * (1 - ramp(t, 0.57, 0.97))

/**
 * Press to handstand from a straddle stand: hands flat, arms locked from
 * the first moment to the last. The shoulders lean forward over the fingers
 * until the feet are weightless, the hips rise over the shoulders, the legs
 * float out round the sides and close in the handstand; then the same way down.
 */
export const pressHs: Motion = {
  id: 'press-hs',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 9.4,
  beat: 0.48,
  camera: 'three-quarter',
  azimuth: 56,
  elevation: 5,
  detail: { delt_post: 0.25 },
  standard: 'Arms locked from start to finish; the shoulders lean forward over the fingers until the weight is on the hands, so the feet leave the floor without a jump; the hips rise over the shoulders before the legs come up; legs straight, opening round the sides and closing in a stacked handstand; lowered the same way, under control.',
  // Hardest from the moment the feet leave the floor until the hips are up; the handstand at the top is a handstand's work.
  effort: (t) => { const u = pressed(t); return u < 0.3 ? 0.3 + 0.7 * ramp(u, 0, 0.3) : 1 - 0.42 * ramp(u, 0.45, 1) },
  // Getting off the floor is the hip flexors and the front of the shoulders; the handstand at the top is the shoulders and traps alone.
  shift: (t) => { const u = pressed(t); return { hip_flexors: 1 - 0.8 * ramp(u, 0.6, 1), abs: 1 - 0.5 * ramp(u, 0.7, 1), adductors: 0.4 + 0.6 * bump(u, 0.2, 1) } },
  pose(t, rig, out) {
    const b = rig.body
    const plan = pressOf(b)
    const u = pressed(t)
    const v = Math.min(1, u / PRESS_FLOOR), w = Math.max(0, (u - PRESS_FLOOR) / (1 - PRESS_FLOOR))
    const p = w > 0 ? between(plan.air, w) : between(plan.floor, v)
    // In the handstand the balance is alive, as it is in any handstand.
    const drift = ramp(u, 0.97, 1) * 0.7 * Math.sin(t * Math.PI * 2 * 9)
    p.lean += drift * 0.5
    pressTrunk(rig, out, p, w)
    for (const [side] of SIDES) out.arm[side].grip = 0.12 + 0.1 * Math.sin(Math.PI * Math.min(1, u / 0.9))
    rig.solve(out)
    straightLegs(rig, out, p.flex - drift * 0.6, 50, p.spread)
    if (w < 0.25) {
      // On the floor the balls of the feet stay where they stand; as they leave it the feet point.
      const lift = ramp(w, 0, 0.25)
      for (const [side, sign] of SIDES) {
        const leg = out.leg[side]
        const air = { foot: leg.foot.clone(), rot: leg.rot.clone(), knee: leg.knee.clone() }
        legToBall(b, plan.ball.clone().setX(sign * plan.ball.x), PRESS.tiptoe * ease(v), leg)
        if (w > 0) { leg.foot.copy(air.foot); leg.knee.lerp(air.knee, lift) }
        leg.rot.slerp(air.rot, lift)
        leg.toes = lerp(leg.toes, -18, lift)
      }
    }
  },
}

// ── One arm ──────────────────────────────────────────────────────────────

const Zaxis = new Vector3(0, 0, 1)
/** Tips the top of an upside-down body towards its left hand. */
const tip = (degrees: number) => new Quaternion().setFromAxisAngle(Zaxis, -degrees * deg)

/** The one-arm handstand's shape: legs apart (each, degrees), how much less the pelvis tips than the ribcage, and where the free arm is held: degrees below level and towards the chest. */
const ONE_ARM = { spread: 50, flex: 3, level: 0.85, drop: 5, front: 6 }

/** A handstand on the left arm: that arm upright and locked over its hand, the body tipped over it by `tilt` degrees, the right arm out to the side. */
function oneArmPose(rig: Rig, out: Pose, tilt: number, drift: number, wobble: number) {
  const b = rig.body
  const reach = b.upperArm + b.lowerArm
  handsOnFloor(b, out, 0, b.rest.upperArmL.x * 1.02, new Vector3(1, 0, 0.6), 4)
  out.arm.L.shrug = 1
  out.arm.L.grip = 0.2
  out.chest.copy(pitch(180 + drift * 0.6)).premultiply(tip(tilt + wobble))
  out.pelvis.copy(pitch(180 + 1.5 - drift * 0.9)).premultiply(tip((tilt + wobble) * ONE_ARM.level))
  out.head.copy(pitch(180 - LOOK)).premultiply(tip(tilt * 0.35))
  // The supporting shoulder stands on its hand: the body is hung from that joint.
  const a = drift * deg, x = wobble * 0.6 * deg
  const shoulder = out.arm.L.hand.clone().add(new Vector3(Math.sin(x), Math.cos(a) * Math.cos(x), Math.sin(a)).multiplyScalar(reach * 0.9985))
  out.hips.copy(shoulder).add(new Vector3(-b.rest.upperArmL.x * 0.6, b.trunk, 0))
  const free = out.arm.R
  for (let i = 0; i < 5; i++) {
    rig.solve(out)
    out.hips.add(shoulder.clone().sub(rig.pos.upperArmL))
    // The free arm: straight out from its shoulder, a little below level, palm to the floor.
    const d = ONE_ARM.drop * deg, f = ONE_ARM.front * deg
    const dir = new Vector3(-Math.cos(d) * Math.cos(f), -Math.sin(d), -Math.sin(f)).applyQuaternion(tip(wobble * 2))
    free.hand.copy(rig.pos.upperArmR).addScaledVector(dir, reach * 0.992)
    free.rot.copy(handRot('R', dir, new Vector3(0, -1, 0)))
    free.elbow.set(0, 0.4, 1)
    free.grip = 0.14
    free.shrug = 0.2
  }
  rig.solve(out)
  straightLegs(rig, out, ONE_ARM.flex - drift * 0.7, 50, ONE_ARM.spread)
}

/** How far a body has to tip over its supporting arm for its weight to be over that hand. */
const oneArmTilt = (b: Body) => once(b, 'one-arm-hs', (rig, out) =>
  root((tilt) => { oneArmPose(rig, out, tilt, 0, 0); rig.solve(out); return centreOf(rig).x - out.arm.L.hand.x }, 16, 20))

/**
 * One-arm handstand, on the left arm: the supporting arm upright and locked
 * with its shoulder over its hand, the body tipped over it until the weight
 * is over that one hand, the hips square, the legs straddled, the free arm
 * held out to the side.
 */
export const oneArmHs: Motion = {
  id: 'one-arm-hs',
  revision: 1,
  stage: 'square',
  planted: ['handL'],
  kind: 'balance',
  period: 5.6,
  camera: 'front',
  azimuth: 160,
  elevation: 2,
  // The left arm carries everything; the right only reaches.
  detail: { 'delt_post.L': 0.3, 'delt_ant.R': 0.25, 'delt_lat.R': 0.45, 'traps.R': 0.4, 'forearm_flex.L': 0.85, 'forearm_ext.L': 0.7, 'forearm_flex.R': 0.1, 'forearm_ext.R': 0.15 },
  standard: 'The supporting arm locked and upright, its shoulder pushed tall and over its hand; the body tipped over that arm until the hips and the weight are over the one hand; hips square, not twisted open; legs straight and straddled; the free hand fully off the floor, arm out to the side; the supporting hand does not move.',
  effort: (t) => 0.8 + 0.15 * Math.abs(breath(t)),
  pose(t, rig, out) {
    const drift = 0.8 * Math.sin(t * Math.PI * 2) + 0.3 * Math.sin(t * Math.PI * 6 + 1)
    const wobble = 0.5 * Math.sin(t * Math.PI * 4 + 0.6) + 0.2 * Math.sin(t * Math.PI * 10)
    oneArmPose(rig, out, oneArmTilt(rig.body), drift, wobble)
    out.arm.L.grip = 0.2 - 0.06 * breath(t)
  },
}

// ── Handstand push-ups ───────────────────────────────────────────────────

/** The bottom of a handstand push-up, as shares of a body height: where the crown of the head meets the floor, ahead of the hands, and how far the weight has moved from the heel of the hand onto the palm by then. */
const TOUCH = { ahead: 0.3, height: 0.014, palm: 0.07 }

/** A straight body on bent or locked arms, with no wall: the shoulders are put somewhere and the line above them leans back by `tilt` degrees. */
function freePose(rig: Rig, out: Pose, shoulder: Vector3, tilt: number, e: number) {
  const b = rig.body
  out.chest.copy(pitch(180 - tilt))
  out.pelvis.copy(pitch(180 - tilt + 1.5))
  // At the top the eyes are on the floor between the hands; at the bottom the head stands on its crown.
  out.head.copy(pitch(180 - tilt * lerp(0.5, 0.15, e) - lerp(LOOK, 0, e)))
  handsOnFloor(b, out, 0, b.rest.upperArmL.x + 0.035 * b.scale, new Vector3(0.4, 0.25, -1), 4)
  for (const [side] of SIDES) { out.arm[side].shrug = lerp(1, 0.25, e); out.arm[side].grip = 0.12 + 0.1 * e }
  out.hips.set(0, shoulder.y + b.trunk, shoulder.z)
  shouldersAt(rig, out, shoulder)
  straightLegs(rig, out, 0, 50)
}

/** The freestanding push-up for a body: the shoulders' path from lockout to the head on the floor, and at each depth how far the line leans back for the weight to stay over the hands. */
const freeHspuOf = (b: Body) => once(b, 'freestanding-hspu', (rig, out) => {
  const s = b.scale
  const full = (b.upperArm + b.lowerArm) * 0.9985
  // The top: locked arms on hands a little wider than the shoulders, so it is measured.
  const top = at(0, wristHeight(b) + full)
  for (let i = 0; i < 4; i++) {
    freePose(rig, out, top, 0, 0)
    rig.solve(out)
    top.y += full - rig.pos.upperArmL.distanceTo(out.arm.L.hand)
  }
  const weight = (shoulder: Vector3, tilt: number, e: number) => { freePose(rig, out, shoulder, tilt, e); rig.solve(out); return centreOf(rig).z - stacked(b) - TOUCH.palm * s * e }
  // The bottom: the crown on its mark, the line leaning back until the weight is over the hands again. Each depends on the other.
  const mark = at(TOUCH.ahead * s, TOUCH.height * s)
  const low = at(0.17 * s, 0.36 * s)
  let tilt = 14
  for (let i = 0; i < 6; i++) {
    tilt = root((x) => weight(low, x, 1), tilt, tilt + 1, 5)
    freePose(rig, out, low, tilt, 1)
    rig.solve(out)
    low.add(mark.clone().sub(crownOf(rig)).setX(0))
  }
  const steps = 16
  let guess = 0
  const tilts = Array.from({ length: steps + 1 }, (_, i) => {
    const e = i / steps
    guess = i === steps ? tilt : root((x) => weight(top.clone().lerp(low, e), x, e), guess, guess + 1, 5)
    return guess
  })
  return { top, low, tilts }
})

const lowered = (t: number) => there(t, 0.44, 0.05)

/**
 * Freestanding handstand push-up: from a held handstand the head is lowered
 * to the floor ahead of the hands, into the tripod of a headstand, while the
 * straight body leans back to keep its weight over the hands; then pressed
 * back to the stacked line.
 */
export const freestandingHspu: Motion = {
  id: 'freestanding-hspu',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 4.6,
  beat: 0.97,
  camera: 'side',
  azimuth: 66,
  elevation: 3,
  detail: { pec_upper: 0.25, delt_post: 0.25, forearm_flex: 0.6, forearm_ext: 0.45 },
  standard: 'No wall; from locked arms in a stacked handstand the head is lowered to touch the floor ahead of the hands in a tripod, forearms close to upright and elbows back, not flared; the body stays one straight line, leaning back as the shoulders go forward so that the weight stays over the hands, never arching; pressed back to a full lockout over the wrists.',
  effort: (t) => 0.45 + 0.55 * lowered(t),
  pose(t, rig, out) {
    const plan = freeHspuOf(rig.body)
    const e = ease(lowered(t))
    const f = e * (plan.tilts.length - 1)
    const i = Math.min(plan.tilts.length - 2, Math.floor(f))
    // At the top it is a handstand like any other, held by small corrections; they fade as the arms bend.
    const drift = (1 - e) * 0.6 * Math.sin(t * Math.PI * 2 * 5)
    const shoulder = plan.top.clone().lerp(plan.low, e)
    shoulder.z += (rig.body.upperArm + rig.body.lowerArm) * Math.sin(drift * deg)
    freePose(rig, out, shoulder, lerp(plan.tilts[i], plan.tilts[i + 1], f - i) - drift * 0.4, e)
  },
}

// ── The negative at the wall ─────────────────────────────────────────────

/** The parts of a wall negative, as shares of one cycle: the lowering, the touch, coming down onto the feet, and the kick back up. */
const NEG = { start: 0.03, down: 0.47, touch: 0.51, feet: 0.75, kick: 0.79, up: 0.95 }
/** An even descent: steady almost all the way, eased only at its two ends. */
const even = (x: number) => 0.85 * x + 0.15 * ease(x)
const negDepth = (t: number) => (t < NEG.start ? 0 : t < NEG.down ? even((t - NEG.start) / (NEG.down - NEG.start)) : t < NEG.touch ? 1 : 0)

/** The stance the feet come down to and the kick-up starts from: hands where they were, arms straight, the front foot close behind the hands (a share of a body height) and the other leg long behind. */
const LUNGE = { chest: 120, front: -0.28, look: 30 }

/**
 * Between the wall and the floor: `up` is 1 with both heels on the wall and 0
 * standing in the lunge, the left leg bent under the hips and the right
 * long behind. On the way up the right leg swings first and the left pushes
 * and follows; on the way down the same in reverse. `turned` is how far the
 * trunk has come from the lunge's line to the wall's (1: upside down), and
 * `bent` how far the arms are still in the bottom of the push-up (1: head
 * on the floor).
 */
function kicking(rig: Rig, out: Pose, up: number, turned: number, bent: number) {
  const b = rig.body
  const s = b.scale
  const set = hspuSetUp(rig)
  const legs = (b.upperLeg + b.lowerLeg) * 0.999
  const standing = at(0.005 * s, set.top.y - 0.003 * s)
  const straight = standing.clone().lerp(set.top, ease(up))
  const shoulder = straight.clone()
  const pose = () => {
    // At the wall the line leans into it from wherever the shoulders are, exactly as the push-up's does.
    const lean = Math.asin(Math.max(-0.3, Math.min(0.3, (set.wall - 0.095 * s - shoulder.z) / (b.trunk + b.upperLeg + b.lowerLeg)))) / deg
    const line = lerp(LUNGE.chest, 180 + lean, turned)
    out.chest.copy(pitch(line))
    out.pelvis.copy(pitch(line - 8 * (1 - turned)))
    // On the floor the head stands on its crown whatever the trunk does above it; off it, the eyes are on the floor between the hands.
    out.head.copy(pitch(lerp(line - lerp(LUNGE.look, LOOK, turned), 180 + lean - 8, bent)))
    handsOnFloor(b, out, 0, b.rest.upperArmL.x + 0.035 * s, new Vector3(0.8, 0, -1), 4)
    for (const [side] of SIDES) out.arm[side].shrug = lerp(1, 0.2, bent)
    out.hips.set(0, shoulder.y + b.trunk, shoulder.z)
    shouldersAt(rig, out, shoulder)
    return 180 + lean
  }
  // Off the bottom the arms are locked: the shoulder girdle sits differently as the trunk turns, so the height that locks them is measured.
  const full = (b.upperArm + b.lowerArm) * 0.9985
  if (bent < 1) for (let i = 0; i < 2; i++) {
    pose()
    straight.y += (full - rig.pos.upperArmL.distanceTo(out.arm.L.hand)) * (full / Math.max(0.2, straight.y - wristHeight(b)))
    shoulder.copy(straight)
  }
  shoulder.lerp(set.low, bent)
  let wall = pose()
  // While the arms are bent the head stays on the floor, never in it.
  const under = 0.028 * s - crownOf(rig).y
  if (under > 0) { shoulder.y += under; wall = pose() }

  // The right leg, straight throughout: from its toes on the floor behind, up through level, to the wall. It leads.
  const hipY = standing.y + b.trunk * -Math.cos(LUNGE.chest * deg)
  const back = Math.acos(Math.min(1, (hipY - 0.105 * s) / legs)) / deg
  // Where its ball of the foot rests behind in the lunge: as far as a straight leg reaches from the standing hips, and no further.
  const reachBall = Math.hypot(legs + Math.abs(b.ball.y), b.ball.z) * 0.95
  const ballAt = at(standing.z - b.trunk * Math.sin(LUNGE.chest * deg) - Math.sqrt(Math.max(0, reachBall ** 2 - (hipY - 0.014 * s) ** 2)), 0.014 * s, -b.rest.upperLegL.x)
  const onFloor = 1 - ramp(up, 0, 0.14)
  // The left leg: its foot stays where it stands for as long as the leg can reach it, then it follows the other up.
  const stood = new Vector3(b.rest.upperLegL.x, b.ankle, LUNGE.front * s)
  const off = ramp(up, 0.2, 0.46)
  for (const [side] of SIDES) {
    const leg = out.leg[side]
    const hip = rig.pos[`upperLeg${side}`]
    const swing = side === 'R'
    let angle = swing ? lerp(back, wall, ramp(up, 0, 0.78)) : lerp(24, wall, ramp(up, 0.26, 1))
    // A straight leg reaching behind stops at the floor, however low the hips are.
    if (swing) angle = Math.max(angle, Math.acos(Math.max(-1, Math.min(1, (hip.y - 0.105 * s) / legs))) / deg)
    leg.foot.copy(hip).addScaledVector(down(angle), legs)
    const pointed = pitch(angle + 20)
    if (swing) {
      leg.rot.copy(pointed)
      leg.toes = -18
      if (onFloor > 0) {
        // Near the floor the foot is on its ball, the heel up, as it is in a lunge.
        const ball = { foot: new Vector3(), rot: new Quaternion(), knee: new Vector3(), toes: 0 }
        legOnBall(b, hip, ballAt, new Vector3(0, 1, -0.3), ball)
        leg.foot.lerp(ball.foot, onFloor)
        if (leg.foot.distanceTo(hip) > legs) leg.foot.sub(hip).setLength(legs).add(hip)
        leg.rot.slerp(ball.rot, onFloor)
        leg.toes = lerp(-18, ball.toes, onFloor)
      }
    } else {
      leg.foot.lerpVectors(stood, leg.foot, off)
      // Pushed straight before it leaves: the foot is never further than the leg is long.
      if (leg.foot.distanceTo(hip) > legs) leg.foot.sub(hip).setLength(legs).add(hip)
      leg.rot.copy(new Quaternion()).slerp(pointed, off)
      leg.toes = lerp(0, -18, off)
    }
    // A foot arriving at the floor arrives on it: the ball of the foot never goes under.
    const sunk = 0.014 * s - (leg.foot.y + b.ball.clone().applyQuaternion(leg.rot).y)
    if (sunk > 0) leg.foot.y += sunk
    const along = leg.foot.clone().sub(hip)
    leg.knee.set(0, 0, 1).applyQuaternion(pitch(Math.atan2(-along.z, -along.y) / deg))
  }
}

/**
 * Wall handstand push-up negative, back to the wall: from locked arms the
 * head is lowered, evenly and for more than five seconds, to touch the
 * floor ahead of the hands. Pressing back up is not part of it: the feet
 * come down to the floor and the handstand is kicked up to again.
 */
export const wallHspuNegative: Motion = {
  id: 'wall-hspu-negative',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 13,
  beat: NEG.down,
  camera: 'side',
  azimuth: 114,
  elevation: 3,
  props: (b) => [{ kind: 'wall', z: once(b, 'wall-hspu-negative', (rig) => hspuSetUp(rig).wall) }],
  detail: { pec_upper: 0.25, delt_post: 0.25, forearm_flex: 0.5, forearm_ext: 0.4 },
  standard: 'Back to the wall, heels on it, arms locked at the top; lowered evenly for at least five seconds, without dropping through the last third, until the head touches the floor softly ahead of the hands; elbows back at about 45°, not flared; body straight. The way back up is not a press: the feet come down as out of a headstand, the head staying on its crown until a foot is on the floor, and the handstand is kicked up to again on straight arms.',
  // The work is the way down, hardest where it is deepest; coming down and kicking up are not the exercise.
  effort: (t) => (t < NEG.start ? 0.4 : t < NEG.down ? 0.5 + 0.5 * negDepth(t) : t < NEG.touch ? 0.7 : t < NEG.kick ? 0.2 : t < NEG.up ? 0.3 : 0.4),
  pose(t, rig, out) {
    if (t < NEG.touch) {
      const set = hspuSetUp(rig)
      const e = negDepth(t)
      againstWall(rig, out, set.top.clone().lerp(set.low, e), set.wall, lerp(1, 0.2, e), lerp(LOOK, 8, e))
    } else if (t < NEG.kick) {
      // Down onto the feet, as out of a headstand: the crown stays where it is and the hips over it while the left leg comes
      // down to a foot close behind the hands; only with that foot on the floor does the weight go back onto it, the head
      // lift and the arms straighten, the right leg reaching back into the lunge.
      const q = Math.min(1, (t - NEG.touch) / (NEG.feet - NEG.touch))
      const landed = ramp(q, 0.5, 1)
      kicking(rig, out, 1 - Math.min(1, q / 0.72), lerp(1, 0.66, ramp(q, 0.12, 0.5)) * (1 - landed), 1 - landed)
    } else {
      const up = ramp(t, NEG.kick, NEG.up)
      kicking(rig, out, up, ramp(up, 0.04, 0.86), 0)
    }
  },
}

/** Upside down beyond the first handstand, easiest first. */
export const BALANCE: Motion[] = [wristPrep, heelPulls, headstand, wallHspuNegative, tuckHs, straddleHs, pressHs, freestandingHspu, oneArmHs]

