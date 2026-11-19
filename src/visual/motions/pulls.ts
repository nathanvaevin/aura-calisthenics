/**
 * Pulling on the bar past the pull-up: one arm doing more than the other, and leaving the bar.
 *
 * The one-sided movements are shown with the left arm working, as the archer
 * push-up is. The hands stay where they are on the bar; the body is placed
 * under them and the rig finds the elbows.
 */
import { Quaternion, Vector3 } from 'three'
import type { BoneName, Side } from '../body/skeleton'
import { emptyPose, handRot, pitch, roll, yaw, type ArmPose, type Body, type Pose, type Rig } from '../rig'
import { handOver } from './bar'
import { hang, highBar } from './hang'
import { SIDES, gripAt, shouldersAt, straightLegs } from './kit'
import { lowBar, remember, root, rowPose } from './rows'
import { ease, lerp, there, type Bar, type Motion, type Prop } from './types'

const D = Math.PI / 180
const UP = new Vector3(0, 1, 0)
const FORWARD = new Vector3(0, 0, 1)
const bar = (b: Body): Prop[] => [{ kind: 'bar', ...highBar(b) }]
/** An arm as long as it gets: straight, a hair short of locked so the rig can still tell which way the elbow points. */
const straight = (b: Body) => (b.upperArm + b.lowerArm) * 0.9985
const GRIP = { forearm_flex: 0.5, forearm_ext: 0.3 }

/** The shoulder blades set before the elbows bend: the first part of a pull is the shoulders, the rest the arms. */
const strict = (p: number) => ({ u: Math.max(0, (p - 0.08) / 0.92), active: Math.min(1, p / 0.08) })

/** Moves the whole body so that one joint ends up at `target`. */
function jointAt(rig: Rig, pose: Pose, joint: BoneName, target: Vector3) {
  for (let i = 0; i < 4; i++) {
    rig.solve(pose)
    pose.hips.add(target.clone().sub(rig.pos[joint]))
  }
  rig.solve(pose)
}

/** Which way a forearm comes to the bar: from the elbow, as the rig last solved it, to the place the hand holds. */
const towards = (rig: Rig, side: Side, point: Vector3) => point.clone().sub(rig.pos[`lowerArm${side}`])

/**
 * A hand hooked over a bar that its forearm does not meet squarely, as in a
 * wide grip. A wrist bends only so far sideways; past that the hand turns on
 * the bar and lies across it at a slant. `fingers` and `palm` are the square
 * grip; the bar stays under the knuckles at `point` however the hand turns.
 */
function slantGrip(b: Body, arm: ArmPose, side: Side, point: Vector3, radius: number, fingers: Vector3, palm: Vector3, along: Vector3, most = 20) {
  const square = fingers.clone().normalize()
  const off = square.angleTo(along.clone().normalize()) / D
  // What the wrist takes up levels off at `most`; the hand turns by the rest.
  const turned = off - most * Math.tanh(off / most)
  const q = new Quaternion()
  if (off > 1e-3) q.slerp(new Quaternion().setFromUnitVectors(square, along.clone().normalize()), turned / off)
  gripAt(b, arm, side, point, radius, square.applyQuaternion(q), palm.clone().normalize().applyQuaternion(q))
}

/** The pace of a body swinging round a straight arm that goes from `from` to `to` degrees off the upright: even in angle, so slow to rise at first. */
function swing(u: number, from: number, to: number) {
  const s = (a: number) => Math.sin(a * D)
  return (s(lerp(from, to, u)) - s(from)) / (s(to) - s(from))
}

/**
 * One straight leg hanging in the plane of the body: `hip` degrees forward of
 * straight down, the foot turned `point` degrees past the shin (46 is a
 * pointed foot, 0 a foot at a right angle). `x` brings the ankle onto a line
 * across the stage. Needs the trunk solved first.
 */
function legAt(rig: Rig, out: Pose, side: Side, hip: number, point = 46, x?: number) {
  const b = rig.body
  const leg = out.leg[side]
  const joint = rig.pos[`upperLeg${side}`]
  const length = (b.upperLeg + b.lowerLeg) * 0.999
  const aside = x === undefined ? 0 : x - joint.x
  const inPlane = Math.sqrt(Math.max(0, length ** 2 - aside ** 2))
  leg.foot.set(joint.x + aside, joint.y - Math.cos(hip * D) * inPlane, joint.z + Math.sin(hip * D) * inPlane)
  leg.knee.set(0, Math.sin(hip * D), Math.cos(hip * D))
  leg.rot.copy(pitch(-hip + point))
  leg.toes = point > 20 ? -18 : 0
}

// ── Archer row ───────────────────────────────────────────────────────────

/** The bar and the heels of the horizontal row. */
const ROW: Parameters<typeof rowPose>[2] = { top: 30, surface: () => 0, toes: 62 }
/** Each hand this far outside its shoulder: wide enough that one arm is still straight when the chest is at the other hand. */
const ROW_WIDE = 0.37

/**
 * The body of a row, turned on its heels by `turn` degrees so that the
 * shoulders travel towards the left hand. Wide hands, both on the bar, each
 * at the slant its forearm gives it.
 */
function archerRowAt(rig: Rig, out: Pose, theta: number, turn: number, pull: number) {
  const b = rig.body
  const rail = lowBar(b, ROW)
  const half = b.rest.upperArmL.x + ROW_WIDE * b.scale
  rowPose(rig, out, ROW, theta, pull)
  const q = yaw(-turn)
  out.hips.applyQuaternion(q)
  out.pelvis.premultiply(q)
  out.chest.premultiply(q)
  out.head.premultiply(q)
  const point = (sign: number) => new Vector3(sign * half, rail.height, rail.z ?? 0)
  for (const [side, sign] of SIDES) {
    const leg = out.leg[side]
    leg.foot.applyQuaternion(q)
    leg.rot.premultiply(q)
    leg.knee.applyQuaternion(q)
    out.arm[side].elbow.applyQuaternion(q)
    gripAt(b, out.arm[side], side, point(sign), rail.radius, UP, FORWARD)
  }
  // The shoulder blade of the arm that pulls draws back; the long arm's is left reaching.
  out.arm.R.shrug = lerp(0.3, 0, pull)
  rig.solve(out)
  for (const [side, sign] of SIDES) slantGrip(b, out.arm[side], side, point(sign), rail.radius, UP, FORWARD, towards(rig, side, point(sign)))
  rig.solve(out)
}

/** How far the assisting arm is from exactly straight: positive when the hand is out of reach. */
const slack = (rig: Rig, out: Pose) => rig.pos.upperArmR.distanceTo(out.arm.R.hand) - straight(rig.body)

const ROW_STEPS = 24
/** Worked out once per body: how far it turns by the top, and the angle that keeps the assisting arm straight on the way there. */
const archerRowPlan = (rig: Rig) => remember(`pulls:archer-row:${rig.body.id}`, () => {
  const out = emptyPose()
  const angle = (turn: number, pull: number) => root((theta) => { archerRowAt(rig, out, theta, turn, pull); return slack(rig, out) }, ROW.top - 48, ROW.top + 8, 20)
  // Turned until the chest is at the bar with that arm still straight.
  const top = root((turn) => angle(turn, 1) - ROW.top, 0, 26, 16)
  const turn = (pull: number) => top * swing(pull, 36, 72)
  return { turn, angles: Array.from({ length: ROW_STEPS + 1 }, (_, i) => angle(turn(i / ROW_STEPS), i / ROW_STEPS)) }
})

/** Poses the archer row `pull` of the way up, the assisting arm exactly straight. */
function archerRowPose(rig: Rig, out: Pose, pull: number) {
  const plan = archerRowPlan(rig)
  const turn = plan.turn(pull)
  const i = Math.min(ROW_STEPS - 1, Math.floor(pull * ROW_STEPS)), f = pull * ROW_STEPS - i
  // From the angle worked out beforehand, closed in on by the secant.
  const miss = (theta: number) => { archerRowAt(rig, out, theta, turn, pull); return slack(rig, out) }
  let a = lerp(plan.angles[i], plan.angles[i + 1], f) - 0.3, fa = miss(a)
  let z = a + 0.3, fz = miss(z)
  for (let k = 0; k < 4 && Math.abs(fz) > 1e-6 && fz !== fa; k++) {
    const next = z - (fz * (z - a)) / (fz - fa)
    a = z; fa = fz; z = next; fz = miss(z)
  }
}

/**
 * Archer row, left arm working: a wide grip under the low bar, heels on the
 * floor. The body turns on its heels towards the left hand as that arm rows
 * the chest up to it; the right arm stays long the whole way, its hand
 * turning on the bar as the body moves away from it.
 */
export const archerRow: Motion = {
  id: 'archer-row',
  revision: 1,
  kind: 'reps',
  period: 3.6,
  camera: 'three-quarter',
  azimuth: 32,
  elevation: 22,
  stage: 'low',
  props: (b) => [{ kind: 'bar', ...lowBar(b, ROW) }],
  beat: 0.47,
  // The rows' own refinement, and less of everything that pulls on the side of the arm that only reaches.
  detail: { delt_post: 0.7, 'lats.R': 0.5, 'mid_back.R': 0.5, 'rear_cuff.R': 0.4, 'biceps.R': 0.12, 'delt_post.R': 0.3 },
  standard: 'Wide grip, body straight from heels to head; the chest is rowed to the working hand while the assisting arm stays straight the whole way; hips and shoulders stay level, not rolled towards the working side; both arms straight at the bottom.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.4, 0.1),
  pose(t, rig, out) {
    archerRowPose(rig, out, there(t, 0.4, 0.1))
  },
}

// ── Band-assisted pull-up ────────────────────────────────────────────────

/** How far forward of straight down the leg in the band is held, in the hang and at the top. */
const BAND_LEG = [21, 25]

/**
 * Band-assisted pull-up: the strict pull-up, with a band looped over the
 * middle of the bar and under the right foot. That leg is straight and a
 * little in front, pressing down into the band; the other hangs beside it.
 */
export const bandPullup: Motion = {
  id: 'band-pullup',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 3.6,
  camera: 'three-quarter',
  azimuth: 42,
  elevation: 2,
  beat: 0.5,
  props: (b) => [...bar(b), { kind: 'band', x: 0, height: highBar(b).height, z: highBar(b).radius, to: 'toesR' }],
  detail: { ...GRIP, rear_cuff: 0.6 },
  standard: 'A full pull-up in the band: from a dead hang with straight arms, shoulders set first, to the chin over the bar, and lowered all the way under control. The banded leg stays straight and still; no bounce out of the band at the bottom.',
  // The band carries most where it is stretched most: the bottom is the easy part, the top is the athlete's own.
  effort: (t) => 0.2 + 0.65 * there(t, 0.4, 0.1),
  pose(t, rig, out) {
    const { u, active } = strict(there(t, 0.4, 0.1))
    hang(rig, out, u, active)
    legAt(rig, out, 'L', lerp(5, 9, u))
    legAt(rig, out, 'R', lerp(BAND_LEG[0], BAND_LEG[1], u), 8, 0)
  },
}

// ── Archer pull-up ───────────────────────────────────────────────────────

/** Each hand this far outside its shoulder: an arm's length and the shoulders between the hands. */
const ARCHER_WIDE = 0.365

/** A wide hang with the shoulders' midpoint at x, y: `u` of the way from the hang to the top at the left hand. */
function archerAt(rig: Rig, out: Pose, u: number, active: number, x: number, y: number) {
  const b = rig.body
  const s = b.scale
  const rail = highBar(b)
  const half = b.rest.upperArmL.x + ARCHER_WIDE * s
  const point = (sign: number) => new Vector3(sign * half, rail.height, 0)
  for (const [side, sign] of SIDES) gripAt(b, out.arm[side], side, point(sign), rail.radius, UP, FORWARD)
  // The trunk leans its head towards the working hand: that shoulder sinks under its hand, the other rides up towards the bar its arm lies along.
  const tilt = -8 * u
  out.chest.copy(roll(tilt).multiply(pitch(lerp(1, -13, u))))
  out.pelvis.copy(roll(tilt * 0.5).multiply(pitch(lerp(5, 0, u))))
  out.head.copy(pitch(lerp(-4, -16, ease(u))))
  // The working elbow finishes as it does in a pull-up, out and down, a little nearer the ribs.
  out.arm.L.elbow.set(1, lerp(-0.5, -0.9, u), lerp(0.5, -0.15, u))
  out.arm.L.shrug = lerp(1 - 1.2 * active, -0.9, u)
  out.arm.R.elbow.set(-1, -0.5, 0.5)
  out.arm.R.shrug = lerp(1 - 1.2 * active, -0.5, u)
  const target = new Vector3(x, y, -(rail.radius + 0.012 * s) + lerp(0.004, -0.08, u) * s - Math.sin(u * Math.PI) * 0.02 * s)
  out.hips.set(x, y - b.trunk, target.z)
  rig.solve(out)
  for (const [side, sign] of SIDES) slantGrip(b, out.arm[side], side, point(sign), rail.radius, UP, FORWARD, towards(rig, side, point(sign)))
  shouldersAt(rig, out, target)
}

/** The same, at the height that makes the assisting arm exactly straight. */
function archerStraight(rig: Rig, out: Pose, u: number, active: number, x: number) {
  const b = rig.body
  const full = straight(b)
  // Near enough to start from: the arm as the long side of a triangle whose base is the hand's distance from the shoulder.
  const base = Math.min(0.99 * full, (ARCHER_WIDE - 0.03) * b.scale + x)
  let y = highBar(b).height - 0.06 * b.scale - Math.sqrt(full ** 2 - base ** 2)
  for (let i = 0; i < 6; i++) {
    archerAt(rig, out, u, active, x, y)
    const shoulder = rig.pos.upperArmR, wrist = out.arm.R.hand
    const below = wrist.y - shoulder.y
    const across = shoulder.distanceToSquared(wrist) - below ** 2
    const move = below - Math.sqrt(Math.max(0, full ** 2 - across))
    if (Math.abs(move) < 1e-5) break
    y += move
  }
}

/** How far the body has travelled towards the working hand when the chin is over the bar and the assisting arm is straight. */
const archerShift = (rig: Rig) => remember(`pulls:archer:${rig.body.id}`, () => {
  const b = rig.body
  const out = emptyPose()
  const full = straight(b)
  // A little higher than the top of a pull-up: with the trunk leaning, the chin clears the bar by as much as it does there.
  const y =highBar(b).height + highBar(b).radius * 0.35 - b.knuckle - 0.022 * b.scale
  let x = 0.2 * b.scale
  for (let i = 0; i < 12; i++) {
    archerAt(rig, out, 1, 1, x, y)
    const shoulder = rig.pos.upperArmR, wrist = out.arm.R.hand
    const aside = shoulder.x - wrist.x
    const rest = shoulder.distanceToSquared(wrist) - aside ** 2
    x += Math.sqrt(Math.max(0, full ** 2 - rest)) - aside
  }
  return x
})

/**
 * Archer pull-up, left arm working: a wide dead hang, then the body travels
 * up and across to the left hand, swinging round the right arm, which stays
 * straight and ends lying along the bar. Chin over the bar beside the
 * working hand; lowered back to the middle.
 */
export const archerPullup: Motion = {
  id: 'archer-pullup',
  revision: 1,
  stage: 'tall',
  kind: 'reps',
  period: 4.2,
  camera: 'back',
  azimuth: 168,
  elevation: 2,
  beat: 0.5,
  props: bar,
  detail: { ...GRIP, rear_cuff: 0.6, 'lats.R': 0.45, 'biceps.R': 0.1, 'mid_back.R': 0.3, 'rear_cuff.R': 0.3 },
  standard: 'Wide grip, from a dead hang in the middle with both arms straight; pulled across to the working hand until the chin is over the bar beside it, the assisting arm straight along the bar; the body does not twist; lowered under control back to the middle.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.42, 0.1),
  pose(t, rig, out) {
    const { u, active } = strict(there(t, 0.42, 0.1))
    archerStraight(rig, out, u, active, archerShift(rig) * swing(u, 37, 80))
    straightLegs(rig, out, lerp(9, 14, u), 46)
  },
}

// ── On one arm ───────────────────────────────────────────────────────────

interface OneArm {
  /** 0 the hang, 1 the top. */
  u: number
  active: number
  /** How far the body has turned towards the working arm, in the hang and at the top (degrees). */
  turn: [number, number]
  /** How far it tilts, hips towards the working hand, hanging from one shoulder. */
  tilt: [number, number]
  /** The working shoulder at the top: this far below its wrist, behind it, and outside it. */
  top: [number, number, number]
  lean?: [number, number]
  look?: [number, number]
  /** How far the path bows back from the bar on the way up. */
  arc?: number
}

/**
 * The bar for a pull on one arm. Hanging from one hand the arm is vertical,
 * not angled out as in a two-handed hang, so the body hangs lower: the bar is
 * set a little higher than the pull-up's to keep the feet clear of the floor.
 */
export const oneArmBar = (b: Body): Bar => ({ ...highBar(b), height: highBar(b).height + 0.1 * b.scale })
const oneArmProps = (b: Body): Prop[] => [{ kind: 'bar', ...oneArmBar(b) }]
/** Where the left hand holds the bar: a little to the left, so that the body hangs under the middle. */
const oneHand =(b: Body) => new Vector3(0.1 * b.scale, oneArmBar(b).height, 0)

/** Trunk and working arm of a body hanging from its left hand. The free arm and the legs are the caller's. */
function oneArm(rig: Rig, out: Pose, o: OneArm) {
  const b = rig.body
  const s = b.scale
  const u = o.u
  gripAt(b, out.arm.L, 'L', oneHand(b), oneArmBar(b).radius, UP, FORWARD)
  const wrist = out.arm.L.hand
  const turn = lerp(o.turn[0], o.turn[1], u), tilt = lerp(o.tilt[0], o.tilt[1], u)
  const [lean, look] = [o.lean ?? [1, -10], o.look ?? [-4, -14]]
  out.chest.copy(yaw(turn).multiply(roll(tilt)).multiply(pitch(lerp(lean[0], lean[1], u))))
  // The spine bends sideways: the pelvis and the legs hang nearer the upright than the chest.
  out.pelvis.copy(yaw(turn * 0.85).multiply(roll(tilt * 0.55)).multiply(pitch(lerp(5, 0, u))))
  out.head.copy(yaw(turn).multiply(roll(tilt * 0.3)).multiply(pitch(lerp(look[0], look[1], ease(u)))))
  // The elbow comes down in front of the hip.
  out.arm.L.elbow.copy(new Vector3(0.45, -1, lerp(0.5, 0.25, u)).applyQuaternion(yaw(turn)))
  out.arm.L.shrug = lerp(1 - 1.2 * o.active, -0.9, u)
  const [below, behind, outside] = o.top
  const target = new Vector3(wrist.x, wrist.y - straight(b), wrist.z + 0.004 * s)
    .lerp(new Vector3(wrist.x + outside * s, wrist.y - below * s, wrist.z - behind * s), u)
  target.z -= Math.sin(u * Math.PI) * (o.arc ?? 0.03) * s
  out.hips.set(target.x - b.rest.upperArmL.x, target.y - b.trunk, target.z)
  jointAt(rig, out, 'upperArmL', target)
}

/** The free arm, hanging loose beside the body and a little away from it: straight down, whatever the tilt of the trunk. Needs the trunk placed first. */
function freeArm(rig: Rig, out: Pose, turn: number) {
  const b = rig.body
  const s = b.scale
  const arm = out.arm.R
  const q = yaw(turn)
  arm.elbow.copy(new Vector3(-1, 0, -0.6).applyQuaternion(q))
  arm.rot.copy(handRot('R', new Vector3(-0.12, -1, 0.15).normalize().applyQuaternion(q), new Vector3(1, 0, 0.1).normalize().applyQuaternion(q)))
  arm.grip = 0.3
  arm.shrug = -0.2
  // Not quite its full length: a loose arm keeps a soft elbow.
  const hangs = new Vector3(-0.07, -0.545, 0.07).setLength((b.upperArm + b.lowerArm) * 0.98).applyQuaternion(q)
  // The shoulder settles as the arm does: from where it is at rest, then placed twice more.
  arm.hand.copy(rig.pos.upperChest).add(new Vector3(-b.rest.upperArmL.x, 0.14 * s, 0).applyQuaternion(out.chest)).add(hangs)
  for (let i = 0; i < 3; i++) {
    rig.solve(out)
    arm.hand.copy(rig.pos.upperArmR).add(hangs)
  }
  rig.solve(out)
}

/** How far the body turns towards the working arm in a one-arm pull-up: a little in the hang, more at the top. */
const OAP_TURN: [number, number] = [6, 32]

/**
 * One-arm pull-up, left arm: from a dead hang on one hand, the shoulder set
 * first, to the chin over the bar. The body turns a little towards the
 * working arm as the elbow comes down to the hip; the free arm stays away
 * from the bar and from the working arm.
 */
export const oneArmPullup: Motion = {
  id: 'one-arm-pullup',
  revision: 1,
  stage: 'tall',
  planted: ['handL'],
  kind: 'reps',
  period: 5.2,
  camera: 'back',
  azimuth: 158,
  elevation: 2,
  beat: 0.5,
  props: oneArmProps,
  // The library's muscles, on the side that works: the free arm and its side of the back do next to nothing.
  detail: { 'lats.R': 0.12, 'biceps.R': 0.04, 'forearm_flex.R': 0.04, 'forearm_ext.R': 0.04, 'mid_back.R': 0.12, 'rear_cuff.R': 0.1 },
  standard: 'One hand on the bar and nothing else: from a dead hang with the arm straight, the shoulder set before the elbow bends, to the chin over the bar; the body turns only slightly towards the working arm and does not swing or kick; lowered to a straight arm.',
  effort: (t) => 0.4 + 0.6 * there(t, 0.44, 0.08),
  pose(t, rig, out) {
    const { u, active } = strict(there(t, 0.44, 0.08))
    oneArm(rig, out, { u, active, turn: OAP_TURN, tilt: [9, 11], top: [-0.02, 0.172, 0.03] })
    freeArm(rig, out, lerp(OAP_TURN[0], OAP_TURN[1], u))
    straightLegs(rig, out, lerp(8, 13, u), 46)
  },
}

/** How far below the bar the free hand holds the band, and how far in front of it. */
const ASSIST = { drop: 0.34, beside: 0.09, ahead: 0.12 }
/** Where on the band the free hand holds it. It does not slide. */
const assistPoint = (b: Body) => oneHand(b).add(new Vector3(-ASSIST.beside, -ASSIST.drop, ASSIST.ahead).multiplyScalar(b.scale))

/**
 * Assisted one-arm pull-up, left arm: a band hangs over the bar beside the
 * working hand, and the free hand holds it low, more than a forearm's length
 * below the bar, and keeps that hold. The working arm does a one-arm pull-up;
 * the other helps only as much as a hand that low can.
 */
export const assistedOap: Motion = {
  id: 'assisted-oap',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 4.6,
  camera: 'three-quarter',
  azimuth: 28,
  elevation: 2,
  beat: 0.5,
  props: (b) => [...oneArmProps(b), { kind: 'band', x: oneHand(b).x - ASSIST.beside * b.scale, height: oneArmBar(b).height, z: oneArmBar(b).radius, to: 'fingers1R' }],
  // The assisting side helps, and less than the side that works.
  detail: { 'lats.R': 0.4, 'biceps.R': 0.3, 'forearm_flex.R': 0.3, 'forearm_ext.R': 0.25, 'mid_back.R': 0.15, 'rear_cuff.R': 0.12 },
  standard: 'The working hand on the bar, the other holding the band at least a forearm\'s length below it and never climbing; from a straight arm with the shoulder set to the chin over the bar; the chest stays facing the bar; lowered to a straight arm.',
  effort: (t) => 0.35 + 0.65 * there(t, 0.42, 0.1),
  pose(t, rig, out) {
    const b = rig.body
    const { u, active } = strict(there(t, 0.42, 0.1))
    const arm = out.arm.R
    // A fist round the band, thumb up, the palm towards the face.
    gripAt(b, arm, 'R', assistPoint(b), 0.012 * b.scale, new Vector3(0.72, 0.68, 0.1), new Vector3(0.1, 0, -1))
    arm.elbow.set(-1, lerp(-0.2, -0.8, u), lerp(0.5, -0.1, u))
    arm.shrug = lerp(0.4, -0.6, u)
    oneArm(rig, out, { u, active: 0.5 + 0.5 * active, turn: [0, 12], tilt: [6, 8], top: [0.01, 0.16, -0.03] })
    straightLegs(rig, out, lerp(9, 14, u), 46)
  },
}

// ── Explosive pull-up ────────────────────────────────────────────────────

/** The parts of an explosive pull-up, as shares of one cycle: the shoulders set, the pull, the moment at the top, the way down. The rest is the reset in the hang. */
const SET = 0.1, PULLED = 0.27, FLOAT = 0.32, LOWERED = 0.64
/** 0 in the hang, 1 at the top. Up fast, with no easing into it; down under control. */
const rise = (t: number) => (t < SET ? 0 : t < PULLED ? Math.pow(ease((t - SET) / (PULLED - SET)), 0.6) : t < FLOAT ? 1 : t < LOWERED ? 1 - ease((t - FLOAT) / (LOWERED - FLOAT)) : 0)
const setting = (t: number) => (t < 0.03 ? 0 : t < SET ? ease((t - 0.03) / (SET - 0.03)) : t < LOWERED ? 1 : 1 - ease(Math.min(1, (t - LOWERED) / 0.12)))

/**
 * Explosive pull-up: from a still hang, pulled as fast and as high as it
 * goes, the bar drawn down towards the hips until it is at the lower chest.
 * The body stays hollow and leans back round the bar instead of rising
 * straight into it; the hands keep hold; a full reset in the hang before the
 * next one.
 */
export const explosivePullup: Motion = {
  id: 'explosive-pullup',
  revision: 1,
  stage: 'tall',
  kind: 'reps',
  period: 3.6,
  camera: 'side',
  azimuth: 62,
  elevation: 3,
  beat: PULLED,
  props: bar,
  detail: { ...GRIP, rear_cuff: 0.7 },
  standard: 'From a still dead hang; pulled fast and high enough that the bar reaches the lower chest, the body hollow and leaning back round the bar; the hands stay on the bar; lowered under control to straight arms and reset before the next repetition.',
  // All of it in the pull; the way down is held back; the hang between repetitions is rest.
  effort: (t) => (t < SET ? lerp(0.2, 1, setting(t)) : t < PULLED ? 1 : t < FLOAT ? lerp(1, 0.55, ease((t - PULLED) / (FLOAT - PULLED))) : lerp(0.2, 0.55, setting(t))),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const rail = highBar(b)
    const half = b.rest.upperArmL.x + 0.125 * s
    const f = rise(t), active = setting(t)
    out.chest.copy(pitch(lerp(1, -22, f)))
    out.pelvis.copy(pitch(lerp(5, -16, f)))
    out.head.copy(pitch(lerp(-4, -20, ease(f))))
    for (const [side, sign] of SIDES) {
      // The hands roll a little way over the bar as the elbows come up behind it.
      handOver(b, out, side, sign, half, 0.34 * f)
      out.arm[side].elbow.set(sign * lerp(1, 0.4, f), lerp(-0.5, -0.3, f), lerp(0.5, -1, f))
      out.arm[side].shrug = lerp(1 - 1.2 * active, -0.9, f)
    }
    const aim = (aside: number) => {
      const low = new Vector3(0, rail.height - (b.knuckle - rail.radius * 0.35) - Math.sqrt(Math.max(0, straight(b) ** 2 - aside ** 2)), -0.025 * s)
      const high = new Vector3(0, rail.height + 0.17 * s, -0.2 * s)
      // Round the bar, not up into it: the path bows back.
      return low.lerp(high, f).add(new Vector3(0, 0, -Math.sin(f * Math.PI) * 0.035 * s))
    }
    const first = aim(half - b.rest.upperArmL.x)
    out.hips.set(0, first.y - b.trunk, first.z)
    shouldersAt(rig, out, first)
    shouldersAt(rig, out, aim(Math.hypot(out.arm.L.hand.x - rig.pos.upperArmL.x, out.arm.L.hand.z - rig.pos.upperArmL.z)))
    // Hollow: the legs together and a little in front, more so at the top.
    for (const [side] of SIDES) legAt(rig, out, side, lerp(9, 24, f), 46)
  },
}

/** Easiest first, by the library's own rating of them. */
export const PULLS: Motion[] = [bandPullup, archerRow, explosivePullup, archerPullup, assistedOap, oneArmPullup]
