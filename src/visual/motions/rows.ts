/**
 * Rows under a low bar, and dips: the body carried by the arms with the
 * hands fixed, pulled towards them or pressed away from them.
 */
import { Quaternion, Vector3 } from 'three'
import { emptyPose, handRot, pitch, Rig, type Body, type Pose } from '../rig'
import { SIDES, at, deg, gripAt, hipsAt, shouldersAt, straightLegs, wristHeight } from './kit'
import { ease, lerp, there, type Bar, type Motion, type Prop } from './types'

const legsOf = (b: Body) => (b.upperLeg + b.lowerLeg) * 0.998
const reachOf = (b: Body) => b.upperArm + b.lowerArm

/** Where f crosses zero between lo and hi (it must have opposite signs at the two). */
export function root(f: (x: number) => number, lo: number, hi: number, steps = 26): number {
  let low = f(lo) > 0
  for (let i = 0; i < steps; i++) {
    const mid = (lo + hi) / 2
    if (f(mid) > 0 === low) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/** Things worked out once per body and movement: where the bar goes, how far the arms let the body down. */
const once = new Map<string, unknown>()
export function remember<T>(key: string, make: () => T): T {
  if (!once.has(key)) once.set(key, make())
  return once.get(key) as T
}
/** A rig of its own for working equipment out before anything is on stage. */
const scratch = (b: Body) => remember(`rig:${b.id}`, () => new Rig(b.id))

// ── Rows ─────────────────────────────────────────────────────────────────

interface RowShape {
  /** Angle of the body above the floor when the chest is at the bar, degrees. */
  top: number
  /** Height of what the heels rest on. */
  surface: (b: Body) => number
  /** How far the toes point up from level, degrees: the foot rests on the back of the heel. */
  toes: number
}

const BAR = 0.0165
const BELOW = 0.17

/** The ankle above whatever the heel rests on, for a foot tipped back on its heel. */
function heelHeight(b: Body, toes: number) {
  const c = Math.cos(toes * deg), s = Math.sin(toes * deg)
  return (0.045 * c + 0.035 * s + Math.hypot(0.034 * c, 0.04 * s)) * b.scale
}
const ankleOf = (b: Body, shape: RowShape) => at(0, shape.surface(b) + heelHeight(b, shape.toes))
/** Along the body from heels to head, for a body lying face up with its head towards −Z. */
const along = (theta: number) => at(-Math.cos(theta * deg), Math.sin(theta * deg))

/** Where the bar is: just clear of the lower chest when the body is at its top angle. */
export function lowBar(b: Body, shape: RowShape): Bar {
  const r = b.rest
  const hip = ankleOf(b, shape).addScaledVector(along(shape.top), legsOf(b))
  const chest = new Vector3(0, r.upperArmL.y - BELOW * b.scale - r.upperLegL.y, (0.108 + BAR) * b.scale - r.upperLegL.z).applyQuaternion(pitch(shape.top - 90))
  return { height: hip.y + chest.y, z: hip.z + chest.z, width: 1.3 * b.scale, radius: BAR * b.scale }
}

/** A straight body, face up, heels planted, hands on the bar, at an angle above the floor. `pull` is 0 hanging to 1 chest at the bar. */
export function rowPose(rig: Rig, out: Pose, shape: RowShape, theta: number, pull: number) {
  const b = rig.body
  const s = b.scale
  const turn = pitch(theta - 90)
  const ankle = ankleOf(b, shape)
  out.pelvis.copy(turn)
  out.chest.copy(turn)
  out.head.copy(pitch(theta - 90 + 8))
  hipsAt(b, turn, ankle.clone().addScaledVector(along(theta), legsOf(b)), out.hips)
  const bar = lowBar(b, shape)
  // The hand keeps its hold while the body turns under it: set to the forearm's middle direction.
  const tilt = (shape.top - 30) * deg
  const fingers = new Vector3(0, Math.cos(tilt), Math.sin(tilt)), palm = new Vector3(0, -Math.sin(tilt), Math.cos(tilt))
  for (const [side, sign] of SIDES) {
    const leg = out.leg[side]
    leg.foot.set(sign * b.rest.upperLegL.x, ankle.y, ankle.z)
    leg.rot.copy(pitch(-shape.toes))
    leg.knee.set(0, Math.cos(theta * deg), Math.sin(theta * deg))
    leg.toes = 0
    const arm = out.arm[side]
    gripAt(b, arm, side, new Vector3(sign * (b.rest.upperArmL.x + 0.09 * s), bar.height, bar.z!), bar.radius, fingers, palm)
    // Elbows about 45 degrees from the ribs, travelling behind the body.
    arm.elbow.copy(new Vector3(sign * 0.75, -0.55, -1).applyQuaternion(turn))
    arm.shrug = lerp(0.3, -0.7, pull)
  }
}

/** The angle at which the arms are straight: as far down as the bar lets the body go. */
const hangAngle = (rig: Rig, shape: RowShape, key: string) => remember(`${key}:${rig.body.id}`, () => {
  const out = emptyPose()
  return root((theta) => {
    rowPose(rig, out, shape, theta, 0)
    rig.solve(out)
    return rig.pos.upperArmL.distanceTo(out.arm.L.hand) - reachOf(rig.body) * 0.997
  }, shape.top - 45, shape.top)
})

function row(id: string, shape: RowShape, rest: Pick<Motion, 'standard' | 'period'> & Partial<Motion>, box?: (b: Body) => Prop): Motion {
  return {
    id,
    revision: 1,
    kind: 'reps',
    camera: 'side',
    azimuth: 108,
    elevation: 7,
    stage: 'low',
    props: (b) => [{ kind: 'bar', ...lowBar(b, shape) }, ...(box ? [box(b)] : [])],
    planted: ['handL', 'handR', 'footL', 'footR'],
    beat: 0.47,
    detail: { forearm_flex: 0.4, forearm_ext: 0.25, delt_post: 0.7 },
    effort: (t) => 0.3 + 0.7 * there(t, 0.38, 0.1),
    pose(t, rig, out) {
      const pull = there(t, 0.38, 0.1)
      rowPose(rig, out, shape, lerp(hangAngle(rig, shape, id), shape.top, pull), pull)
    },
    ...rest,
  }
}

/** Incline row: the bar about chest height, the body at an easy angle, feet on the floor. */
export const inclineRow = row('incline-row', { top: 52, surface: () => 0, toes: 25 }, {
  period: 3,
  standard: 'Body straight from heels to head at an incline of about 40°; arms fully straight at the bottom; the chest comes to the bar; elbows about 45° from the ribs.',
})

/** Horizontal row: a lower bar, the body close to level when the arms are straight. */
export const horizontalRow = row('horizontal-row', { top: 30, surface: () => 0, toes: 62 }, {
  period: 3.1,
  standard: 'Heels on the floor, body rigid; full arm extension at the bottom with the body near horizontal and the hips off the floor; chest to the bar at the top.',
})

const raised = (b: Body) => 0.8 * b.scale
/** Feet-elevated row: heels on a box at about the height of the bar, so the body is level at the top. */
export const feetElevatedRow = row('feet-elevated-row', { top: 0, surface: raised, toes: 76 }, {
  period: 3.3,
  detail: { forearm_flex: 0.4, forearm_ext: 0.25, delt_post: 0.7, glutes: 0.4 },
  standard: 'Feet level with the hands; the body is horizontal when the chest reaches the bar, with no pike at the hips; arms fully straight at the bottom; a beat held at the top.',
}, (b) => ({ kind: 'box', width: 0.62 * b.scale, height: raised(b), depth: 0.36 * b.scale, z: 0.05 * b.scale }))

// ── Dips on parallel bars ────────────────────────────────────────────────

const RAIL = 0.019
const railHeight = (b: Body) => 1.36 * b.scale
const railHalf = (b: Body) => b.rest.upperArmL.x + 0.075 * b.scale
const dipRails = (b: Body): Prop => ({ kind: 'rails', height: railHeight(b), gap: railHalf(b) * 2, length: 0.9 * b.scale, radius: RAIL * b.scale, z: 0 })

/**
 * Supported on the rails, `depth` of the way from locked out (0) to the
 * bottom of the dip (1). Trunk, arms and where the shoulders are; the legs
 * are the caller's.
 */
/**
 * How the hand sits on the rail. `straight`: the forearm stands over the rail
 * and the hand goes on down from it, closed round the rail, so the wrist is
 * nearly straight, as it is on a real bar. `draped` was revision 1: the hand
 * laid across the top of the rail and bent sharply at the wrist.
 */
type RailGrip = 'straight' | 'draped'
const RAIL_GRIP: Record<RailGrip, { out: number; down: number }> = { straight: { out: 0.3, down: -0.954 }, draped: { out: 0.77, down: -0.64 } }

function dipPose(rig: Rig, out: Pose, depth: number, hold: RailGrip = 'straight') {
  const g = RAIL_GRIP[hold]
  const b = rig.body
  const s = b.scale
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    // The heel of the hand on the rail, the hand closed round its outside, thumb forward.
    gripAt(b, arm, side, new Vector3(sign * railHalf(b), railHeight(b), 0), RAIL * s, new Vector3(sign * g.out, g.down, 0), new Vector3(sign * g.down, -g.out, 0), hold === 'straight' ? 1 : 0.9)
    arm.elbow.set(sign * 0.22, 0.1, -1)
    arm.shrug = lerp(-1, -0.4, depth)
  }
  const wrist = out.arm.L.hand
  out.chest.copy(pitch(lerp(6, 27, depth)))
  out.pelvis.copy(pitch(lerp(4, 21, depth)))
  out.head.copy(pitch(lerp(4, 15, depth)))
  const ahead = 0.03 * s
  const low = new Vector3(0, wrist.y + 0.2 * s, 0.17 * s)
  const high = (aside: number) => new Vector3(0, wrist.y + Math.sqrt(Math.max(0, (reachOf(b) * 0.9985) ** 2 - aside ** 2 - ahead ** 2)), ahead)
  const aim = (top: Vector3) => top.lerp(low, depth)
  const first = aim(high(wrist.x - b.rest.upperArmL.x))
  out.hips.set(0, first.y - b.trunk, first.z)
  shouldersAt(rig, out, first)
  // The shoulders press down and narrow at lockout: measured, so the arms are exactly straight.
  shouldersAt(rig, out, aim(high(Math.abs(wrist.x - rig.pos.upperArmL.x))))
}

/** How far forward of straight down the legs hang, for a pelvis tipped forward by the dip. */
const hang = (depth: number) => lerp(4, 21, depth) + lerp(8, 13, depth)

/**
 * Parallel bar dip: from locked arms and pressed-down shoulders, down until
 * the shoulders are below the elbows, chest a little forward, elbows back,
 * legs quiet; then pressed to lockout.
 */
const dipOn = (revision: number, hold: RailGrip, standard: string): Motion => ({
  id: 'dip',
  revision,
  kind: 'reps',
  period: 3.2,
  camera: 'three-quarter',
  azimuth: 58,
  elevation: 3,
  stage: 'tall',
  props: (b) => [dipRails(b)],
  planted: ['handL', 'handR'],
  beat: 0.97,
  detail: { delt_lat: 0.15, delt_ant: 0.6, pec_upper: 0.55 },
  standard,
  effort: (t) => 0.35 + 0.65 * there(t, 0.42, 0.06),
  pose(t, rig, out) {
    const depth = there(t, 0.42, 0.06)
    dipPose(rig, out, depth, hold)
    straightLegs(rig, out, hang(depth), 46)
  },
})
export const dip = dipOn(2, 'straight', 'Starts and ends with the arms locked and the shoulders pressed down; shoulders pass below the elbows at the bottom; chest slightly forward, elbows tracking back; the legs do not swing; the wrists straight over the rails, the hands closed round them.')
/** Revision 1, kept until revision 2 is approved: the hands draped over the rails, wrists bent. */
export const dipEarlier = dipOn(1, 'draped', 'Starts and ends with the arms locked and the shoulders pressed down; shoulders pass below the elbows at the bottom; chest slightly forward, elbows tracking back; the legs do not swing.')

/** Where the step between the rails is: its top is where the feet are when standing tall in the support. */
const step = (b: Body) => remember(`step:${b.id}`, () => {
  const rig = scratch(b)
  const out = emptyPose()
  dipPose(rig, out, 0)
  const hip = rig.pos.upperLegL
  return { top: hip.y - legsOf(b) * 0.985 - b.ankle, z: hip.z + 0.02 * b.scale }
})

/** The parts of a negative dip, as shares of one cycle. */
const LIFT = 0.05, DOWN = 0.8, REACH = 0.86, UP = 0.97
/** An even descent: steady almost all the way, eased only at its two ends. */
const even = (x: number) => 0.85 * x + 0.15 * ease(x)
const negativeDepth = (t: number) => (t < LIFT ? 0 : t < DOWN ? even((t - LIFT) / (DOWN - LIFT)) : t < REACH ? 1 : t < UP ? 1 - ease((t - REACH) / (UP - REACH)) : 0)
/** 1 while the feet are on the step, 0 while they are tucked up behind. */
const onStep = (t: number) => (t < LIFT ? 1 - ease(t / LIFT) : t < DOWN ? 0 : t < REACH ? ease((t - DOWN) / (REACH - DOWN)) : 1)

/**
 * Negative dip: only the lowering is the exercise. From lockout, a slow,
 * even descent of at least five seconds to the bottom of a dip; then the
 * feet go down onto a step and the legs stand the body back up.
 */
const negativeDipOn = (revision: number, hold: RailGrip, standard: string): Motion => ({
  id: 'negative-dip',
  revision,
  kind: 'reps',
  period: 7,
  camera: 'three-quarter',
  azimuth: 58,
  elevation: 3,
  stage: 'tall',
  props: (b) => [dipRails(b), { kind: 'box', width: 0.34 * b.scale, height: step(b).top, depth: 0.4 * b.scale, z: step(b).z + 0.04 * b.scale }],
  planted: ['handL', 'handR'],
  beat: DOWN,
  detail: { delt_lat: 0.15, delt_ant: 0.6, pec_upper: 0.55 },
  standard,
  // The work is the way down, and hardest where it is deepest; the step back up is rest.
  effort: (t) => (t < LIFT || t >= REACH ? 0.15 : t < DOWN ? 0.45 + 0.55 * negativeDepth(t) : 0.6),
  pose(t, rig, out) {
    const b = rig.body
    const depth = negativeDepth(t)
    dipPose(rig, out, depth, hold)
    const on = onStep(t)
    const place = step(b)
    const down = (a: number) => new Vector3(0, -Math.cos(a * deg), Math.sin(a * deg))
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      // Tucked: the thigh a little forward, the shin folded level behind it. On the step: standing.
      const tucked = rig.pos[`upperLeg${side}`].clone().addScaledVector(down(20), b.upperLeg).addScaledVector(down(-88), b.lowerLeg * 0.995)
      leg.foot.copy(tucked).lerp(new Vector3(sign * b.rest.upperLegL.x, place.top + b.ankle, place.z), on)
      leg.rot.copy(pitch(132)).slerp(new Quaternion(), on)
      leg.knee.set(0, 0, 1)
      leg.toes = 0
    }
  },
})
export const negativeDip = negativeDipOn(2, 'straight', 'Starts locked out with the shoulders pressed down; lowers evenly for at least five seconds, without dropping through the bottom, until the shoulders are below the elbows; the way back up is a step, not a press; the wrists straight over the rails throughout.')
/** Revision 1, kept until revision 2 is approved. */
export const negativeDipEarlier = negativeDipOn(1, 'draped', 'Starts locked out with the shoulders pressed down; lowers evenly for at least five seconds, without dropping through the bottom, until the shoulders are below the elbows; the way back up is a step, not a press.')

// ── Bench dip ────────────────────────────────────────────────────────────

const benchHeight = (b: Body) => 0.45 * b.scale
const TOES_UP = 64

/** The front edge of the bench is at z = 0; the athlete sits off it, facing +Z, heels out in front. */
function benchPose(rig: Rig, out: Pose, shoulderY: number, lean: number, ankleZ: number) {
  const b = rig.body
  const s = b.scale
  const turn = pitch(lean)
  out.pelvis.copy(turn)
  out.chest.copy(turn)
  out.head.copy(pitch(lean + 4))
  const ankleY = heelHeight(b, TOES_UP)
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    // The heel of the hand on the edge, fingers forward and down over it.
    arm.hand.set(sign * (b.rest.upperArmL.x + 0.025 * s), benchHeight(b) + wristHeight(b), -0.04 * s)
    arm.rot.copy(handRot(side, new Vector3(sign * 0.1, -0.12, 1).normalize(), new Vector3(0, -1, -0.12).normalize()))
    arm.elbow.set(sign * 0.12, 0.1, -1)
    arm.grip = 0.55
    arm.shrug = -0.5
    const leg = out.leg[side]
    leg.foot.set(sign * b.rest.upperLegL.x, ankleY, ankleZ)
    leg.rot.copy(pitch(-TOES_UP))
    leg.knee.set(0, 1, 0.3)
    leg.toes = 0
  }
  // Legs straight, pivoting on the heels: the hips are on a circle round the ankles, and the shoulders at the height asked.
  const hip = at(0, shoulderY - b.trunk)
  for (let i = 0; i < 5; i++) {
    hip.z = ankleZ - Math.sqrt(Math.max(0, legsOf(b) ** 2 - (hip.y - ankleY) ** 2))
    hipsAt(b, turn, hip, out.hips)
    rig.solve(out)
    hip.y += shoulderY - (rig.pos.upperArmL.y + rig.pos.upperArmR.y) / 2
  }
}

/** Worked out once per body: where the heels go, and the shoulder heights at lockout and at a right angle of the elbow. */
const bench = (rig: Rig) => remember(`bench:${rig.body.id}`, () => {
  const b = rig.body
  const out = emptyPose()
  const hands = benchHeight(b) + wristHeight(b)
  const leans = { top: -7, low: -2 }
  const gap = (want: number, lean: number, ankleZ: number) => (y: number) => {
    benchPose(rig, out, y, lean, ankleZ)
    return rig.pos.upperArmL.distanceTo(out.arm.L.hand) - want
  }
  const right = Math.hypot(b.upperArm, b.lowerArm)
  // Heels placed so that at the bottom the hips are just clear of the bench.
  let ankleZ = 0.95 * b.scale, low = 0
  for (let i = 0; i < 4; i++) {
    low = root(gap(right, leans.low, ankleZ), hands + 0.15 * b.scale, hands + reachOf(b))
    benchPose(rig, out, low, leans.low, ankleZ)
    ankleZ += 0.15 * b.scale - rig.pos.upperLegL.z
  }
  return { ankleZ, low, top: root(gap(reachOf(b) * 0.997, leans.top, ankleZ), low, hands + reachOf(b) * 1.02), leans }
})

/**
 * Bench dip: hands on the edge of a bench behind the body, heels on the
 * floor in front, hips close to the bench. Down until the elbows are at a
 * right angle and no deeper; up to locked arms.
 */
export const benchDip: Motion = {
  id: 'bench-dip',
  revision: 1,
  kind: 'reps',
  period: 3,
  camera: 'side',
  azimuth: 68,
  elevation: 6,
  stage: 'square',
  props: (b) => [{ kind: 'box', width: 1.1 * b.scale, height: benchHeight(b), depth: 0.4 * b.scale, z: -0.2 * b.scale }],
  planted: ['handL', 'handR', 'footL', 'footR'],
  beat: 0.97,
  detail: { delt_lat: 0.15, delt_ant: 0.55, pec_upper: 0.3 },
  standard: 'Hips stay close to the bench; elbows point straight back and bend to a right angle, no deeper; shoulders stay down, not rolled forward; full lockout at the top; heels planted.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.42, 0.06),
  pose(t, rig, out) {
    const depth = there(t, 0.42, 0.06)
    const set = bench(rig)
    benchPose(rig, out, lerp(set.top, set.low, depth), lerp(set.leans.top, set.leans.low, depth), set.ankleZ)
  },
}

/** In the order a beginner meets them. */
export const ROWS: Motion[] = [inclineRow, horizontalRow, feetElevatedRow, benchDip, negativeDip, dip]
