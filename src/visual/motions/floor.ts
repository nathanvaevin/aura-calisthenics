/**
 * Work on the floor: on the back, on one side, supported on the hands, and
 * kneeling. The core and posterior-chain exercises of the assessment.
 */
import { Quaternion, Vector3 } from 'three'
import type { Side } from '../body/skeleton'
import { footRot, handRot, pitch, yaw, type ArmPose, type Body, type Pose, type Rig } from '../rig'
import { hollow } from './holds'
import { SIDES, at, deg, hipsAt, shouldersAt, straightLegs, wristHeight } from './kit'
import { ease, lerp, there, type Motion } from './types'

const UP = new Vector3(0, 1, 0)
const breath = (t: number) => Math.sin(t * Math.PI * 2)
const smooth = (a: number, b: number, x: number) => ease(Math.min(1, Math.max(0, (x - a) / (b - a))))
/** A direction in the plane of movement, `angle` radians above the floor, towards +Z. */
const dir = (angle: number) => at(Math.cos(angle), Math.sin(angle))
/** How high the hips sit off the floor lying on the back. */
const lying = (b: Body) => 0.112 * b.scale

/**
 * A straight arm pointing `along` from the shoulder it actually has. The
 * shoulder girdle follows the arm, so the shoulder is measured, twice.
 */
function reachOut(rig: Rig, out: Pose, side: Side, along: Vector3, share = 0.997) {
  const b = rig.body
  for (let i = 0; i < 3; i++) {
    rig.solve(out)
    out.arm[side].hand.copy(rig.pos[`upperArm${side}`]).addScaledVector(along, (b.upperArm + b.lowerArm) * share)
  }
}

/** A leg bent in the plane of movement: thigh and shin at angles above the floor, from the hip joint it has. */
function bentLeg(rig: Rig, out: Pose, side: Side, thigh: number, shin: number, point = 0) {
  const b = rig.body
  const leg = out.leg[side]
  leg.foot.copy(rig.pos[`upperLeg${side}`]).addScaledVector(dir(thigh), b.upperLeg).addScaledVector(dir(shin), b.lowerLeg * 0.999)
  // The foot square to the shin, then pointed.
  leg.rot.copy(pitch(-90 - shin / deg + point))
  leg.knee.copy(dir(thigh + 90 * deg))
  leg.toes = 0
}

/** Turns a whole pose as one rigid piece about a point, then moves it. */
function turnPose(p: Pose, q: Quaternion, about: Vector3, shift: Vector3) {
  const move = (v: Vector3) => v.sub(about).applyQuaternion(q).add(about).add(shift)
  move(p.hips)
  for (const r of [p.pelvis, p.chest, p.head]) r.premultiply(q)
  for (const [side] of SIDES) {
    move(p.arm[side].hand); p.arm[side].rot.premultiply(q); p.arm[side].elbow.applyQuaternion(q)
    move(p.leg[side].foot); p.leg[side].rot.premultiply(q); p.leg[side].knee.applyQuaternion(q)
  }
}

/** A hand bearing weight on top of a rail that runs front to back: the heel of the hand over it, the fingers closed round the outside. */
function onRail(b: Body, arm: ArmPose, side: Side, sign: number, rail: Vector3, radius: number) {
  arm.hand.set(rail.x - sign * 0.034 * b.scale, rail.y + radius + 0.03 * b.scale, rail.z)
  arm.rot.copy(handRot(side, new Vector3(sign * 0.86, -0.5, 0), new Vector3(-sign * 0.5, -0.86, 0)))
  arm.grip = 0.8
}

// ── On the back ──────────────────────────────────────────────────────────

/**
 * Dead bug: on the back with the lower back flat, arms straight up and the
 * knees over the hips. One leg reaches long and low while the opposite arm
 * reaches overhead; back; then the other pair. Nothing else moves.
 */
export const deadBug: Motion = {
  id: 'dead-bug',
  revision: 1,
  stage: 'low',
  planted: ['hips'],
  kind: 'reps',
  period: 5.6,
  camera: 'side',
  azimuth: 62,
  elevation: 12,
  beat: 0.97,
  standard: 'Lower back stays on the floor throughout; the opposite arm and leg reach long and low, slowly, without touching down; the other knee stays over the hip.',
  effort: (t) => 0.35 + 0.65 * there((t * 2) % 1, 0.42, 0.1),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const first = t < 0.5
    const w = there((t * 2) % 1, 0.42, 0.1)
    out.hips.set(0, lying(b), 0)
    out.pelvis.copy(pitch(-96))
    out.chest.copy(pitch(-90))
    out.head.copy(pitch(-95))
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.copy(b.rest[`upperArm${side}`]).setY(0.6 * s)
      arm.elbow.set(sign * 0.6, 0, 1)
      arm.grip = 0.15
      arm.shrug = 0
    }
    rig.solve(out)
    for (const [side, sign] of SIDES) {
      const k = (side === 'L') === first ? w : 0
      const hip = rig.pos[`upperLeg${side}`]
      // Long and low: the heel a hand's width off the floor.
      const low = Math.asin((0.105 * s - hip.y) / (b.upperLeg + b.lowerLeg))
      const thigh = lerp(90 * deg, low, k)
      bentLeg(rig, out, side, thigh, thigh - lerp(90, 0, k) * deg, 12 * k)
      out.leg[side].knee.set(sign * 0.04, 1, -0.3)
      const back = ((side === 'R') === first ? w : 0) * 78 * deg
      const along = new Vector3(0, Math.cos(back), -Math.sin(back))
      out.arm[side].rot.copy(handRot(side, along, new Vector3(-sign, 0, 0)))
      reachOut(rig, out, side, along)
    }
  },
}

/** The glute bridge, both feet down or one. `u` is 0 on the floor, 1 at the top. */
function bridge(rig: Rig, out: Pose, u: number, single: boolean) {
  const b = rig.body
  const s = b.scale
  const reach = b.upperArm + b.lowerArm
  // The shoulders stay where they lie; the body hinges up from them.
  const shoulder = at(-b.trunk, 0.108 * s)
  const knee = b.ankle + b.lowerLeg
  const span = b.trunk + b.upperLeg
  const top = Math.asin((knee - shoulder.y) / span)
  // The feet are where the shins end up upright at the top.
  const feet = shoulder.z + Math.sqrt(span * span - (knee - shoulder.y) ** 2)
  const rise = lerp(1 * deg, top, ease(u))
  const tilt = -90 - rise / deg
  out.pelvis.copy(pitch(tilt - 4 * u))
  out.chest.copy(pitch(-90 - (rise / deg) * 0.85))
  out.head.copy(pitch(-93))
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    const aside = 0.13 * s, drop = shoulder.y - wristHeight(b)
    arm.hand.set(sign * (b.rest.upperArmL.x + aside), wristHeight(b), shoulder.z + Math.sqrt((reach * 0.985) ** 2 - aside * aside - drop * drop))
    arm.rot.copy(handRot(side, new Vector3(0, 0, 1), new Vector3(0, -1, 0)))
    arm.elbow.set(sign, 0.4, 0)
    arm.grip = 0.05
    arm.shrug = 0
    const leg = out.leg[side]
    leg.foot.set(sign * b.rest.upperLegL.x * (single ? 0.55 : 1.1), b.ankle, feet)
    leg.rot.copy(footRot(new Vector3(0, 0, 1), UP))
    leg.knee.set(sign * 0.05, 1, 0.1)
    leg.toes = 0
  }
  hipsAt(b, out.pelvis, shoulder.clone().addScaledVector(dir(rise), b.trunk), out.hips)
  shouldersAt(rig, out, shoulder)
  // The free knee is drawn towards the chest.
  if (single) bentLeg(rig, out, 'R', rise + 100 * deg, rise - 25 * deg, 10)
}

/**
 * Glute bridge: on the back, knees bent, feet flat. The hips rise until
 * knees, hips and shoulders are in one line, pause, and come down.
 */
export const gluteBridge: Motion = {
  id: 'glute-bridge',
  revision: 1,
  stage: 'low',
  planted: ['footL', 'footR', 'handL', 'handR'],
  kind: 'reps',
  period: 3.6,
  camera: 'side',
  azimuth: 62,
  elevation: 10,
  beat: 0.6,
  standard: 'Hips rise until knees, hips and shoulders are in one line, with a one-second pause; heels stay down; the height comes from the hips, not from arching the lower back.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.32, 0.3),
  pose(t, rig, out) { bridge(rig, out, there(t, 0.32, 0.3), false) },
}

/** Single-leg glute bridge, left leg working: the same line, the hips level, the free knee towards the chest. */
export const singleLegBridge: Motion = {
  id: 'single-leg-bridge',
  revision: 1,
  stage: 'low',
  planted: ['footL', 'handL', 'handR'],
  kind: 'reps',
  period: 3.6,
  camera: 'side',
  azimuth: 62,
  elevation: 10,
  beat: 0.6,
  detail: { 'glutes.R': 0.2, 'glute_med.R': 0.3, 'hamstrings.R': 0.15 },
  standard: 'On one foot the hips rise level until knee, hips and shoulders are in one line, and pause; the free knee stays towards the chest; no hip drops.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.32, 0.3),
  pose(t, rig, out) { bridge(rig, out, there(t, 0.32, 0.3), true) },
}

/**
 * Hollow rock: the hollow hold's shape, locked, rocking like the runner of a
 * rocking chair. Nothing in the body changes; only where it touches the floor.
 */
export const hollowRock: Motion = {
  id: 'hollow-rock',
  revision: 1,
  stage: 'low',
  kind: 'reps',
  period: 2.1,
  camera: 'side',
  azimuth: 62,
  elevation: 9,
  beat: 0.5,
  standard: 'The hollow shape does not change: no bending at the hips for momentum, lower back in contact; small, even rocks.',
  effort: (t) => 0.75 + 0.2 * Math.abs(Math.sin(t * Math.PI * 2)),
  pose(t, rig, out) {
    // The hold settles its arms from wherever they were last: asked more than once, it forgets where this pose was left.
    for (let i = 0; i < 3; i++) hollow.pose(0, rig, out)
    // Rolling, not sliding: the body turns about the centre of its own curve, which travels with it.
    const runner = 1.7 * rig.body.scale
    const tip = 8 * deg * Math.sin(t * Math.PI * 2)
    turnPose(out, pitch(tip / deg), new Vector3(0, runner, 0), at(runner * tip, 0))
  },
}

// ── On the side, and facing up ───────────────────────────────────────────

/**
 * Side plank on the left forearm: elbow under the shoulder, feet stacked,
 * one straight line from ankles to head, the top shoulder over the bottom
 * one. The chest faces the athlete's front, not the floor.
 */
export const sidePlank: Motion = {
  id: 'side-plank',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'lowerArmL', 'footL'],
  kind: 'hold',
  period: 4.6,
  camera: 'front',
  azimuth: -62,
  elevation: 9,
  detail: { 'obliques.R': 0.35, 'glute_med.L': 0.8, 'glute_med.R': 0.2, 'glutes.R': 0.15, 'delt_ant.R': 0, 'delt_lat.R': 0, 'adductors.R': 0.15 },
  standard: 'Elbow under the shoulder; ankles, hips and head in one straight line; hips high and forward; top shoulder stacked over the bottom one, chest not rolling to the floor.',
  effort: () => 0.7,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const legs = (b.upperLeg + b.lowerLeg) * 0.998
    const edge = 0.05 * s
    const elbow = at(0, 0.04 * s)
    const shoulder = at(0, elbow.y + b.upperArm)
    // Face down, then rolled a quarter turn onto the left side: the chest faces -X.
    const lean = (rise: number) => pitch(90 - rise / deg).multiply(yaw(-90))
    const place = (rise: number) => {
      const q = lean(rise)
      out.pelvis.copy(q); out.chest.copy(q); out.head.copy(q)
      const arm = out.arm.L
      arm.hand.set(-b.lowerArm, elbow.y - 0.004 * s, 0)
      arm.rot.copy(handRot('L', new Vector3(-1, 0, 0), new Vector3(0, -1, 0)))
      arm.elbow.set(0, -1, 0)
      arm.grip = 0.1
      arm.shrug = -0.2
      // The bottom shoulder stays over the elbow: the body is moved until it is.
      for (let i = 0; i < 3; i++) { rig.solve(out); out.hips.add(shoulder.clone().sub(rig.pos.upperArmL)) }
      rig.solve(out)
      return rig.pos.upperLegL.y - legs * Math.sin(rise) - edge
    }
    // The angle of the body is whatever puts the edge of the bottom foot on the floor.
    out.hips.set(0, 0.4 * s, -0.5 * s)
    let a = 14 * deg, fa = place(a), z = 20 * deg, fz = place(z)
    for (let i = 0; i < 6 && Math.abs(fz) > 1e-4 && fz !== fa; i++) {
      const next = z - (fz * (z - a)) / (fz - fa)
      a = z; fa = fz; z = next; fz = place(z)
    }
    const q = lean(z)
    const down = at(-Math.cos(z), -Math.sin(z))
    const foot = rig.pos.upperLegL.clone().addScaledVector(down, legs)
    for (const [side] of SIDES) {
      const leg = out.leg[side]
      // Feet stacked: the top one rests on the bottom one, on a leg just as straight.
      if (side === 'L') leg.foot.copy(foot)
      else leg.foot.copy(rig.pos.upperLegR).add(foot.clone().setY(foot.y + 0.092 * s).sub(rig.pos.upperLegR).setLength(legs))
      leg.rot.copy(q)
      leg.knee.set(-1, 0, 0)
      leg.toes = 0
    }
    out.arm.R.rot.copy(handRot('R', UP, new Vector3(-1, 0, 0)))
    out.arm.R.elbow.set(0, 0, -1)
    out.arm.R.grip = 0.1
    out.arm.R.shrug = 0
    out.head.copy(lean(z).multiply(pitch(0.8 * breath(t))))
    reachOut(rig, out, 'R', UP)
  },
}

/**
 * Reverse plank: face up on straight arms and the heels, hands under the
 * shoulders with the fingers towards the feet, one line from heels to shoulders.
 */
export const reversePlank: Motion = {
  id: 'reverse-plank',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'footL', 'footR'],
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  azimuth: 62,
  elevation: 8,
  standard: 'Straight line from heels to shoulders, hips lifted, arms locked with the hands under the shoulders, chest open and shoulders not rolling forward.',
  effort: () => 0.7,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const reach = b.upperArm + b.lowerArm
    const legs = (b.upperLeg + b.lowerLeg) * 0.998
    const aside = 0.02 * s
    const want = wristHeight(b) + Math.sqrt((reach * 0.9975) ** 2 - aside * aside)
    const seen = new Vector3()
    let ask = want, rise = 0.35
    for (let i = 0; i < 4; i++) {
      // The heel is on the floor and the foot reaches down: the ankle sits where that leaves it.
      let ankle = 0.09 * s
      for (let k = 0; k < 6; k++) {
        ankle = -b.heel.clone().applyQuaternion(pitch(rise / deg - 42)).y + 0.004 * s
        rise = Math.asin((ask - ankle) / (legs + b.trunk))
      }
      const up = at(-Math.cos(rise), Math.sin(rise))
      const trunk = pitch(rise / deg - 90)
      out.pelvis.copy(trunk)
      out.chest.copy(pitch(rise / deg - 92))
      out.head.copy(pitch(rise / deg - 96 + 1.2 * breath(t)))
      const hip = at(0, ankle).addScaledVector(up, legs)
      hipsAt(b, out.pelvis, hip, out.hips)
      const under = i ? seen.z : hip.z - Math.cos(rise) * b.trunk
      for (const [side, sign] of SIDES) {
        const leg = out.leg[side]
        leg.foot.set(sign * b.rest.upperLegL.x, ankle, 0)
        leg.rot.copy(pitch(rise / deg - 42))
        leg.knee.set(0, 1, 0)
        leg.toes = -10
        const arm = out.arm[side]
        arm.hand.set(sign * (b.rest.upperArmL.x + aside), wristHeight(b), under)
        arm.rot.copy(handRot(side, new Vector3(sign * 0.15, 0, 1).normalize(), new Vector3(0, -1, 0)))
        arm.elbow.set(sign * 0.3, 0, -1)
        arm.grip = 0.04
        arm.shrug = -0.4
      }
      rig.solve(out)
      seen.copy(rig.pos.upperArmL).add(rig.pos.upperArmR).multiplyScalar(0.5)
      ask += want - seen.y
    }
  },
}

// ── Supported on the hands ───────────────────────────────────────────────

/** A pair of parallettes just outside the shoulders. */
const parallettes = (b: Body) => ({ height: 0.2 * b.scale, gap: 2 * (b.rest.upperArmL.x + 0.04 * b.scale), length: 0.42 * b.scale, radius: 0.016 * b.scale })

/** In support on the parallettes with locked arms and the shoulders pushed down; the legs are placed by the caller. */
function support(rig: Rig, out: Pose, t: number, pelvis: number, chest: number) {
  const b = rig.body
  const s = b.scale
  const p = parallettes(b)
  out.pelvis.copy(pitch(pelvis))
  out.chest.copy(pitch(chest + 0.6 * breath(t)))
  out.head.copy(pitch(3))
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    onRail(b, arm, side, sign, new Vector3(sign * p.gap / 2, p.height, 0), p.radius)
    arm.elbow.set(sign * 0.2, 0, -1)
    arm.shrug = -1
  }
  const wrist = out.arm.L.hand
  const reach = (b.upperArm + b.lowerArm) * 0.9975
  const over = (aside: number) => new Vector3(0, wrist.y + Math.sqrt(Math.max(0, reach * reach - aside * aside)), wrist.z + 0.03 * s)
  out.hips.set(0, wrist.y + reach - b.trunk, 0)
  shouldersAt(rig, out, over(wrist.x - b.rest.upperArmL.x))
  // Pushing the shoulders down moves them: measured, so the arms are exactly straight.
  shouldersAt(rig, out, over(wrist.x - rig.pos.upperArmL.x))
}

/** Tuck L-sit: in support on locked arms, knees drawn to the chest, feet off the floor. */
export const tuckLSit: Motion = {
  id: 'tuck-l-sit',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR'],
  props: (b) => [{ kind: 'rails', ...parallettes(b) }],
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  azimuth: 58,
  elevation: 6,
  standard: 'Arms locked and shoulders pushed down away from the ears; knees lifted towards the chest; feet clear of the floor; no leaning back to lift them.',
  effort: () => 0.75,
  pose(t, rig, out) {
    support(rig, out, t, 2, 9)
    const lift = (50 + 1.5 * breath(t)) * deg
    for (const [side] of SIDES) bentLeg(rig, out, side, lift, lift - 135 * deg, 15)
  },
}

/** L-sit: in support on locked arms, legs straight and level, toes pointed. */
export const lSit: Motion = {
  id: 'l-sit',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR'],
  props: (b) => [{ kind: 'rails', ...parallettes(b) }],
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  azimuth: 58,
  elevation: 6,
  standard: 'Arms locked, shoulders pushed down; legs straight and held level with the hips, knees locked and toes pointed; hips between or just behind the hands.',
  effort: () => 0.85,
  pose(t, rig, out) {
    support(rig, out, t, 2, 8)
    // Level means level with the floor, whatever the pelvis is doing.
    straightLegs(rig, out, 92 + 0.5 * breath(t), 48)
  },
}

// ── Kneeling ─────────────────────────────────────────────────────────────

/** Kneeling with the shins and the tops of the feet on the floor behind: the knees are at z = 0. */
function kneel(b: Body, out: Pose) {
  const s = b.scale
  for (const [side, sign] of SIDES) {
    const leg = out.leg[side]
    leg.foot.set(sign * b.rest.upperLegL.x, 0.046 * s, -b.lowerLeg * 0.9995)
    leg.rot.copy(pitch(176))
    leg.knee.set(0, -1, 0.4)
    leg.toes = 0
  }
  return 0.052 * s
}

const wheel = (b: Body) => 0.09 * b.scale

/**
 * Kneeling ab-wheel rollout: from the knees the wheel rolls out, hips and
 * shoulders travelling together, until the body is long and the chest is a
 * fist from the floor; then it is pulled back. Arms straight, no sag.
 */
export const abWheelKnee: Motion = {
  id: 'ab-wheel-knee',
  revision: 1,
  stage: 'low',
  planted: ['lowerLegL', 'lowerLegR', 'footL', 'footR'],
  props: (b) => [{ kind: 'wheel', radius: wheel(b) }],
  kind: 'reps',
  period: 4.6,
  camera: 'side',
  azimuth: 64,
  elevation: 8,
  beat: 0.97,
  detail: { triceps: 0.3, delt_ant: 0.35 },
  standard: 'Knees stay down; hips and shoulders travel forward together; arms straight; chest to within a fist of the floor with the pelvis tucked and no sag in the lower back.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.44, 0.06),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = ease(there(t, 0.44, 0.06))
    const knee = kneel(b, out)
    const reach = (b.upperArm + b.lowerArm) * 0.997
    const axle = wheel(b)
    const grip = axle + 0.034 * s
    // Start: hips over the knees, the wheel under the shoulders. End: knees, hips and shoulders in one low line.
    const long = Math.asin((0.2 * s - knee) / (b.upperLeg + b.trunk))
    const thigh = lerp(90 * deg, long, u)
    const trunk = lerp(17 * deg, long, u)
    const hip = at(0, knee).addScaledVector(dir(thigh), b.upperLeg)
    out.pelvis.copy(pitch(90 - trunk / deg - 5))
    out.chest.copy(pitch(90 - trunk / deg + 2))
    out.head.copy(pitch(90 - trunk / deg - 10))
    hipsAt(b, out.pelvis, hip, out.hips)
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.rot.copy(handRot(side, new Vector3(0, -0.5, 0.86), new Vector3(0, -0.86, -0.5)))
      arm.elbow.set(sign * 0.5, 0.3, -1)
      arm.grip = 0.85
      arm.shrug = 0.3
      arm.hand.set(sign * 0.15 * s, grip, hip.z + b.trunk)
    }
    // The wheel is as far ahead as straight arms put it.
    for (let i = 0; i < 3; i++) {
      rig.solve(out)
      for (const [side] of SIDES) {
        const sh = rig.pos[`upperArm${side}`]
        const arm = out.arm[side]
        const across = arm.hand.x - sh.x
        arm.hand.z = sh.z + Math.sqrt(Math.max(0, reach * reach - (sh.y - grip) ** 2 - across * across))
      }
    }
  },
}

/** How far the body has tipped forward from tall kneeling, in degrees, through a Nordic negative; `catch` is where the hands meet the floor. */
function nordicLean(t: number, caught: number) {
  if (t < 0.72) return caught * Math.pow(t / 0.72, 1.3)
  if (t < 0.79) return caught + 6 * ease((t - 0.72) / 0.07)
  if (t < 0.84) return caught + 6
  return (caught + 6) * (1 - ease((t - 0.84) / 0.16))
}

/**
 * Nordic curl negative: kneeling tall with the ankles held, the body stays
 * one straight piece from knees to head and is lowered forward as slowly as
 * the hamstrings allow; the hands catch it at the bottom and push it back.
 */
export const nordicNegative: Motion = {
  id: 'nordic-negative',
  revision: 1,
  stage: 'square',
  planted: ['lowerLegL', 'lowerLegR', 'footL', 'footR'],
  props: (b) => [{ kind: 'bar', height: 0.108 * b.scale, width: 0.46 * b.scale, radius: 0.018 * b.scale, z: -b.lowerLeg * 0.97 }],
  kind: 'reps',
  period: 8.6,
  camera: 'side',
  azimuth: 66,
  elevation: 6,
  beat: 0.74,
  detail: { calves: 0.3, glutes: 0.5 },
  standard: 'Knees to shoulders stay in one line, hips extended, never breaking at the hips; the descent is fought all the way and takes at least five seconds; the hands catch at the bottom and push back.',
  effort: (t) => (t < 0.72 ? 0.4 + 0.6 * Math.pow(t / 0.72, 1.3) : t < 0.84 ? 0.6 : 0.3),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const knee = kneel(b, out)
    const span = b.upperLeg + b.trunk
    // The hands are carried in front of the chest, ready: this far from the shoulders in the body's own terms.
    const ready = new Vector3(0, -0.1 * s, 0.3 * s)
    const aside = b.rest.upperArmL.x + 0.03 * s
    const carried = (lean: number, from: Vector3) => from.clone().add(ready.clone().applyQuaternion(pitch(lean)))
    const line = (lean: number) => at(Math.sin(lean * deg), Math.cos(lean * deg))
    // Where the body is when those hands reach the floor.
    let lo = 40, hi = 89
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2
      if (carried(mid, at(0, knee).addScaledVector(line(mid), span)).y > wristHeight(b)) lo = mid
      else hi = mid
    }
    const caught = lo
    const down = carried(caught, at(0, knee).addScaledVector(line(caught), span)).setY(wristHeight(b))
    const lean = nordicLean(t, caught)
    out.pelvis.copy(pitch(lean - 2))
    out.chest.copy(pitch(lean))
    out.head.copy(pitch(lean - 22 * smooth(25, caught, lean)))
    hipsAt(b, out.pelvis, at(0, knee).addScaledVector(line(lean), b.upperLeg), out.hips)
    const flat = smooth(caught - 14, caught - 1, lean)
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.set(sign * aside, 0.9 * s, 0.3 * s)
      arm.elbow.copy(new Vector3(sign * 0.9, -0.5, -0.6).applyQuaternion(pitch(lean)))
      arm.grip = 0.1
      arm.shrug = 0
      const carriedRot = handRot(side, UP.clone().applyQuaternion(pitch(lean)), new Vector3(0, 0, 1).applyQuaternion(pitch(lean)))
      arm.rot.copy(carriedRot.slerp(handRot(side, new Vector3(0, 0, 1), new Vector3(0, -1, 0)), flat))
    }
    for (let i = 0; i < 2; i++) {
      rig.solve(out)
      for (const [side, sign] of SIDES) {
        const free = carried(lean, rig.pos[`upperArm${side}`]).setX(sign * aside)
        free.y = Math.max(free.y, wristHeight(b))
        out.arm[side].hand.copy(free.lerp(down.clone().setX(sign * aside), flat))
      }
    }
  },
}

/** The floor and core movements of the assessment, easiest first. */
export const FLOOR: Motion[] = [deadBug, gluteBridge, singleLegBridge, sidePlank, hollowRock, reversePlank, tuckLSit, lSit, abWheelKnee, nordicNegative]
