/**
 * Leg work of the assessment: squats to a box and against a wall, the
 * single-leg squats, and the calf raise. Per-side exercises show the left
 * leg working.
 */
import { Quaternion, Vector3 } from 'three'
import { footRot, handRot, pitch, type Body, type LegPose, type Pose, type Rig } from '../rig'
import { SIDES, at, gripAt, hipsAt, onBall, wristHeight } from './kit'
import { ease, lerp, there, type Bar, type Motion } from './types'

const rad = Math.PI / 180
const UP = new Vector3(0, 1, 0)
const legsOf = (b: Body) => b.upperLeg + b.lowerLeg

/** A foot flat on the floor, turned out by `turn` degrees. */
function flatFoot(leg: LegPose, b: Body, x: number, z: number, sign: number, turn = 0) {
  const toes = new Vector3(sign * Math.sin(turn * rad), 0, Math.cos(turn * rad))
  leg.foot.set(x, b.ankle, z)
  leg.rot.copy(footRot(toes, UP))
  leg.knee.copy(toes)
  leg.toes = 0
}

/** Places the trunk: the midpoint of the hip joints, and how far pelvis, chest and head are tipped forward. Solved, so joints can be read. */
function trunk(rig: Rig, out: Pose, hip: Vector3, pelvis: number, chest: number, head: number) {
  out.pelvis.copy(pitch(pelvis))
  out.chest.copy(pitch(chest))
  out.head.copy(pitch(head))
  hipsAt(rig.body, out.pelvis, hip, out.hips)
  rig.solve(out)
}

/** Arms hanging at u = 0, reaching forward at shoulder height at u = 1: the counterweight of every squat. */
function armsForward(rig: Rig, out: Pose, u: number, drop = 0) {
  const b = rig.body
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    const dir = new Vector3(sign * lerp(0.16, 0.05, u), lerp(-1, 0.04 - drop, u), lerp(0.05, 1, u)).normalize()
    arm.hand.copy(rig.pos[`upperArm${side}`]).addScaledVector(dir, (b.upperArm + b.lowerArm) * lerp(0.985, 0.96, u))
    arm.elbow.set(sign * 0.6, lerp(0, -1, u), lerp(-1, -0.2, u))
    arm.rot.copy(handRot(side, dir.clone().add(new Vector3(0, 0, 0.12)).normalize(), new Vector3(-sign, lerp(0, -0.5, u), -0.2).normalize()))
    arm.grip = 0.15
    arm.shrug = -0.2
  }
}

/** Hands on the hips: it keeps the trunk honest and the picture clear. */
function handsOnHips(rig: Rig, out: Pose) {
  const b = rig.body
  const s = b.scale
  const hip = rig.pos.upperLegL.clone().add(rig.pos.upperLegR).multiplyScalar(0.5)
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    arm.hand.copy(new Vector3(sign * (b.rest.upperLegL.x + 0.085 * s), 0.085 * s, 0.045 * s).applyQuaternion(out.pelvis).add(hip))
    arm.elbow.set(sign * 1, 0.1, -0.75)
    arm.rot.copy(handRot(side, new Vector3(-sign * 0.45, -0.6, 0.66).normalize(), new Vector3(-sign, 0.15, -0.3).normalize()).premultiply(out.pelvis))
    arm.grip = 0.35
    arm.shrug = 0
  }
}

// ── Box squat ────────────────────────────────────────────────────────────

/** A box a little under knee height, behind the athlete. */
export const squatBox = (b: Body) => ({ width: 0.5 * b.scale, height: b.ankle + b.lowerLeg * 0.9, depth: 0.42 * b.scale, z: -0.385 * b.scale })
/** How far the hip joints are above what the buttocks sit on. */
const SEAT = 0.092

/**
 * Box squat: the hips reach back and down to touch a knee-height box
 * lightly, shins close to vertical, then a full stand.
 */
export const boxSquat: Motion = {
  id: 'box-squat',
  revision: 1,
  stage: 'square',
  planted: ['footL', 'footR'],
  kind: 'reps',
  period: 3.4,
  camera: 'side',
  azimuth: 64,
  elevation: 5,
  beat: 0.97,
  props: (b) => [{ kind: 'box', ...squatBox(b) }],
  standard: 'Hips reach back to touch the box lightly, not drop onto it; heels down and shins close to vertical; knees over the toes; a full stand at the top.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.42, 0.1),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = there(t, 0.42, 0.1)
    const stance = 0.19 * s
    const standing = b.ankle + Math.sqrt((legsOf(b) * 0.9992) ** 2 - (stance - b.rest.upperLegL.x) ** 2)
    const hip = at(lerp(0.005, -0.335, ease(u)) * s, lerp(standing, squatBox(b).height + SEAT * s, u))
    trunk(rig, out, hip, lerp(0, 48, u), lerp(-1, 44, u), lerp(1, 15, u))
    for (const [side, sign] of SIDES) flatFoot(out.leg[side], b, sign * stance, 0, sign, 14)
    armsForward(rig, out, u)
  },
}

// ── Wall sit ─────────────────────────────────────────────────────────────

/** Where the wall is for a wall sit with the feet at z = 0: behind the back. */
export const sitWall = (b: Body) => -(b.upperLeg + 0.128 * b.scale)

/**
 * Wall sit: the whole back on the wall, thighs level, knees at a right angle
 * over the ankles, hands off the legs. Held.
 */
export const wallSit: Motion = {
  id: 'wall-sit',
  revision: 1,
  stage: 'square',
  planted: ['footL', 'footR'],
  kind: 'hold',
  period: 4.8,
  camera: 'side',
  azimuth: 62,
  elevation: 5,
  props: (b) => [{ kind: 'wall', z: sitWall(b) }],
  standard: 'Whole back flat on the wall; thighs parallel to the floor; knees at 90° directly over the ankles; hands off the thighs.',
  effort: () => 0.75,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const breath = Math.sin(t * Math.PI * 2)
    const half = b.rest.upperLegL.x
    // Shins upright, thighs level: the hips are a thigh's length behind the ankles, at knee height.
    trunk(rig, out, at(-b.upperLeg, b.ankle + b.lowerLeg), 0, -0.8 * breath, 0)
    for (const [side, sign] of SIDES) {
      flatFoot(out.leg[side], b, sign * (half + 0.01 * s), 0, sign, 4)
      out.leg[side].knee.set(0, 0.4, 1)
      const arm = out.arm[side]
      const dir = new Vector3(sign * 0.1, -1, 0.06).normalize()
      arm.hand.copy(rig.pos[`upperArm${side}`]).addScaledVector(dir, (b.upperArm + b.lowerArm) * 0.99)
      arm.elbow.set(sign * 1, 0, -0.2)
      arm.rot.copy(handRot(side, dir, new Vector3(-sign, 0, 0)))
      arm.grip = 0.2
      arm.shrug = -0.2
    }
  },
}

// ── Single-leg calf raise ────────────────────────────────────────────────

/** A low step in front, its back edge just behind the ball of the standing foot, and a wall to touch. */
export const calfStep = (b: Body) => ({ width: 0.6 * b.scale, height: 0.16 * b.scale, depth: 0.4 * b.scale, z: 0.165 * b.scale })
export const calfWall = (b: Body) => 0.43 * b.scale

/**
 * Single-leg calf raise on the edge of a step: the heel drops below the
 * edge, then rises as high as it goes; the knee stays straight; fingertips
 * on a wall for balance only.
 */
export const calfRaise: Motion = {
  id: 'calf-raise',
  revision: 1,
  stage: 'tall',
  planted: ['toesL', 'handL', 'handR'],
  kind: 'reps',
  period: 2.8,
  camera: 'side',
  azimuth: 72,
  elevation: 4,
  beat: 0.5,
  detail: { 'calves.R': 0.06 },
  props: (b) => [{ kind: 'box', ...calfStep(b) }, { kind: 'wall', z: calfWall(b) }],
  standard: 'Heel drops below the edge of the step for a full stretch, then rises as high as possible; the knee stays straight; no bounce; the hands only steady.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.4, 0.14),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    // 0 at the bottom of the stretch, 1 at the top of the rise.
    const u = there(t, 0.4, 0.14)
    const tilt = lerp(-13, 38, u)
    const footX = 0.035 * s
    const f = b.ball.length()
    const ball = at(0, calfStep(b).height + 0.014 * s, footX)
    const rise = (tilt - Math.atan2(b.ball.y, b.ball.z) / rad) * rad
    const ankle = at(ball.z - f * Math.cos(rise), ball.y + f * Math.sin(rise), footX)
    onBall(b, ankle, ball, out.leg.L)
    // The toes stay flat on the step whichever way the foot tips.
    out.leg.L.toes = tilt
    out.leg.L.knee.set(0, 0, 1)
    // The hips ride above the foot, the weight over its ball.
    const mid = footX * 0.55
    const dx = mid + b.rest.upperLegL.x - footX
    const dz = (ball.z - ankle.z) * 0.6
    trunk(rig, out, at(ankle.z + dz, ankle.y + Math.sqrt((legsOf(b) * 0.998) ** 2 - dx * dx - dz * dz), mid), 1, 0, 0)
    // The other foot is lifted behind, out of the way.
    const hip = rig.pos.upperLegR
    const knee = hip.clone().addScaledVector(new Vector3(0, -Math.cos(10 * rad), Math.sin(10 * rad)), b.upperLeg)
    const free = out.leg.R
    free.foot.copy(knee).addScaledVector(new Vector3(0, -0.24, -0.97).normalize(), b.lowerLeg)
    free.knee.copy(knee).sub(hip.clone().add(free.foot).multiplyScalar(0.5))
    free.rot.copy(pitch(64))
    free.toes = 0
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.set(sign * 0.2 * s, calfStep(b).height + b.rest.upperArmL.y - 0.1 * s, calfWall(b) - wristHeight(b))
      arm.rot.copy(handRot(side, new Vector3(sign * 0.1, 1, 0).normalize(), new Vector3(0, 0, 1)))
      arm.elbow.set(sign * 0.7, -1, -0.1)
      arm.grip = 0.05
      arm.shrug = 0
    }
  },
}

// ── Bulgarian split squat ────────────────────────────────────────────────

/** A bench behind: the rear foot rests on its front edge, laces down. */
const benchHeight = (b: Body) => b.ankle + b.lowerLeg * 0.86
const rearAnkle = (b: Body) => -0.725 * legsOf(b)
export const splitBench = (b: Body) => ({ width: 0.5 * b.scale, height: benchHeight(b), depth: 0.34 * b.scale, z: rearAnkle(b) - 0.17 * b.scale })

/**
 * Bulgarian split squat, left leg in front: the rear foot rests on a bench,
 * the front leg does the work, straight down until the front thigh is level.
 */
export const bulgarian: Motion = {
  id: 'bulgarian-split-squat',
  revision: 1,
  stage: 'square',
  planted: ['footL', 'footR'],
  kind: 'reps',
  period: 3.3,
  camera: 'side',
  azimuth: 62,
  elevation: 5,
  beat: 0.97,
  detail: { 'quads.R': 0.45, 'glutes.R': 0.3, 'glute_med.L': 0.75, 'hamstrings.R': 0.2, 'adductors.R': 0.25, 'hip_flexors.R': 0.3, 'calves.R': 0.08 },
  props: (b) => [{ kind: 'box', ...splitBench(b) }],
  standard: 'Rear foot only rests on the bench; front heel down and front knee over the toes; straight down until the front thigh is parallel or below; trunk tall; no bounce.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.44, 0.06),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = there(t, 0.44, 0.06)
    const half = b.rest.upperLegL.x
    const front = b.upperLeg * 0.93
    const top = b.ankle + Math.sqrt((legsOf(b) * 0.975) ** 2 - front ** 2)
    const low = b.ankle + b.lowerLeg * 0.965
    trunk(rig, out, at(0, lerp(top, low, u)), lerp(4, 13, u), lerp(3, 11, u), 2)
    flatFoot(out.leg.L, b, half + 0.01 * s, front, 1)
    out.leg.L.knee.set(0.05, 0, 1)
    const rear = out.leg.R
    // Laces down: the front of the ankle sits on the bench's edge and the top of the foot lies along it.
    rear.foot.set(-half - 0.01 * s, benchHeight(b) + 0.032 * s, rearAnkle(b))
    rear.rot.copy(pitch(160))
    rear.knee.set(-0.05, -1, 0.4)
    rear.toes = 0
    handsOnHips(rig, out)
  },
}

// ── Cossack squat ────────────────────────────────────────────────────────

/**
 * Cossack squat to the left: a wide stance, sitting onto the left heel
 * while the right leg stays straight and turns so that its toes point at
 * the ceiling.
 */
export const cossack: Motion = {
  id: 'cossack-squat',
  revision: 1,
  stage: 'square',
  planted: ['footL'],
  kind: 'reps',
  period: 3.6,
  camera: 'front',
  azimuth: 14,
  elevation: 6,
  beat: 0.97,
  detail: { 'quads.R': 0.25, 'glutes.R': 0.2, 'glute_med.R': 0.2, 'adductors.R': 0.5, 'hamstrings.R': 0.3, 'calves.R': 0.08 },
  standard: 'Hip below the knee on the working side with that heel down; the other leg straight, toes to the ceiling; chest up rather than folded over.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.44, 0.08),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = there(t, 0.44, 0.08)
    const half = b.rest.upperLegL.x
    const legs = legsOf(b)
    const reach = legs * 0.9985
    const wide = 0.665 * legs
    const roll = ease(u)
    // The straight leg's foot rolls from flat onto its heel.
    const flat = footRot(new Vector3(-0.26, 0, 0.97).normalize(), UP)
    const onHeel = footRot(new Vector3(-0.12, 1, 0.12).normalize(), new Vector3(1, 0.25, 0).normalize())
    const far = out.leg.R
    far.foot.set(-wide + 0.07 * s * roll, lerp(b.ankle, 0.058 * s, roll), 0)
    far.rot.copy(flat).slerp(onHeel, roll)
    far.knee.set(-0.2 * (1 - roll), roll, 1 - 0.6 * roll)
    far.toes = 0
    // The hips go down, back a little, and across: exactly as far as keeps that leg straight.
    const y = lerp(b.ankle + Math.sqrt(reach ** 2 - (wide - half) ** 2), b.ankle + 0.3 * legs, u)
    const z = -0.14 * legs * ease(u)
    const hipR = far.foot.x + Math.sqrt(reach ** 2 - (y - far.foot.y) ** 2 - z ** 2)
    trunk(rig, out, new Vector3(hipR + half, y, z), lerp(0, 30, u), lerp(0, 26, u), lerp(0, 8, u))
    flatFoot(out.leg.L, b, wide, 0, 1, 34)
    armsForward(rig, out, u)
  },
}

// ── Deep squat hold ──────────────────────────────────────────────────────

/**
 * Deep squat hold: resting in the bottom of a squat with the heels down,
 * knees out, chest lifted, elbows inside the knees.
 */
export const deepSquat: Motion = {
  id: 'deep-squat-hold',
  revision: 1,
  stage: 'square',
  planted: ['footL', 'footR'],
  kind: 'hold',
  period: 5.2,
  camera: 'three-quarter',
  azimuth: 46,
  elevation: 7,
  standard: 'Heels flat; hips below the knees; knees out over the toes; chest lifted; no hands on the floor; relaxed and breathing.',
  effort: () => 0.4,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const legs = legsOf(b)
    const breath = Math.sin(t * Math.PI * 2)
    trunk(rig, out, at(-0.175 * legs, b.ankle + 0.2 * legs + 0.004 * s * breath), 42, 26 - 1.5 * breath, 4)
    for (const [side, sign] of SIDES) flatFoot(out.leg[side], b, sign * 0.185 * s, 0, sign, 26)
    // Palms together in front of the chest; the elbows rest against the inside of the knees.
    const chest = rig.pos.upperArmL.clone().add(rig.pos.upperArmR).multiplyScalar(0.5)
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.set(sign * 0.016 * s, chest.y - 0.17 * s, chest.z + 0.21 * s)
      arm.elbow.set(sign * 0.25, -1, 0.5)
      arm.rot.copy(handRot(side, new Vector3(0, 0.72, 0.69), new Vector3(-sign, 0, 0)))
      arm.grip = 0.04
      arm.shrug = -0.1
    }
  },
}

// ── Pistol squats ────────────────────────────────────────────────────────

/**
 * A squat on the left leg with the right held straight out in front and off
 * the floor. `back` is how far behind the heel the hips sit at the bottom
 * (in leg lengths); `lean` how far pelvis and chest tip forward there.
 */
function onOneLeg(rig: Rig, out: Pose, u: number, back: number, lean: [number, number]) {
  const b = rig.body
  const s = b.scale
  const legs = legsOf(b)
  // The foot is under the body, the pelvis shifted over it: the hip joint ends up a little outside the foot.
  const footX = 0.05 * s
  const mid = 0.02 * s
  const standing = b.ankle + Math.sqrt((legs * 0.998) ** 2 - (mid + b.rest.upperLegL.x - footX) ** 2)
  trunk(rig, out, at(lerp(0.03 * s, -back * legs, ease(u)), lerp(standing, b.ankle + 0.21 * legs, u), mid), lerp(2, lean[0], u), lerp(0, lean[1], u), lerp(0, 18, u))
  flatFoot(out.leg.L, b, footX, 0, 1, 4)
  out.leg.L.knee.set(-0.2, 0, 1)
  // The free leg swings up ahead of the descent, so its heel never brushes the floor.
  const swing = lerp(27, 84, Math.pow(u, 0.6)) * rad
  const dir = new Vector3(0, -Math.cos(swing), Math.sin(swing))
  const toes = new Vector3(0, Math.sin(swing), Math.cos(swing))
  const free = out.leg.R
  free.foot.copy(rig.pos.upperLegR).addScaledVector(dir, legs * 0.9985)
  free.rot.copy(footRot(toes, dir.clone().negate()))
  free.knee.copy(toes)
  free.toes = 0
}

/**
 * Pistol squat on the left leg: all the way down with the heel planted, the
 * free leg straight in front and never touching, arms reaching forward.
 */
export const pistol: Motion = {
  id: 'pistol-squat',
  revision: 1,
  stage: 'square',
  planted: ['footL'],
  kind: 'reps',
  period: 4,
  camera: 'three-quarter',
  azimuth: 58,
  elevation: 5,
  beat: 0.97,
  detail: { 'quads.R': 0.4, 'glutes.R': 0.08, 'glute_med.R': 0.1, 'hamstrings.R': 0.08, 'hip_flexors.R': 0.9, 'hip_flexors.L': 0.25, 'adductors.R': 0.15, 'calves.R': 0.06 },
  standard: 'Hip below the knee; standing heel stays planted and the knee over the foot; free leg straight and off the floor throughout; controlled down, stood up without a push from the other foot.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.45, 0.07),
  pose(t, rig, out) {
    const u = there(t, 0.45, 0.07)
    onOneLeg(rig, out, u, 0.15, [54, 50])
    armsForward(rig, out, u, 0.12)
  },
}

/** A rail in front, about chest height, to hold. */
export const pistolRail = (b: Body): Bar => ({ height: 1.03 * b.scale, width: 0.9 * b.scale, radius: 0.0165 * b.scale, z: 0.5 * b.scale })

/**
 * Assisted pistol squat on the left leg: the same full-depth squat, holding
 * a rail in front. The hands steady; they do not pull.
 */
export const assistedPistol: Motion = {
  id: 'assisted-pistol',
  revision: 1,
  stage: 'square',
  planted: ['footL'],
  kind: 'reps',
  period: 4,
  camera: 'three-quarter',
  azimuth: 58,
  elevation: 5,
  beat: 0.97,
  detail: { 'quads.R': 0.4, 'glutes.R': 0.08, 'glute_med.R': 0.1, 'hamstrings.R': 0.08, 'hip_flexors.R': 0.9, 'hip_flexors.L': 0.25, 'adductors.R': 0.15, 'calves.R': 0.06 },
  props: (b) => [{ kind: 'bar', ...pistolRail(b) }],
  standard: 'Full depth on one leg with the heel flat; free leg straight out in front; the hands hold the support for balance, not to haul the body up.',
  effort: (t) => 0.25 + 0.65 * there(t, 0.45, 0.07),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = there(t, 0.45, 0.07)
    onOneLeg(rig, out, u, 0.21, [38, 30])
    const rail = pistolRail(b)
    // The hands stay on the rail; they turn round it as the arms come up from below.
    const fingers = new Vector3(0, 0.75 * u, 1 - 0.3 * u).normalize()
    const palm = new Vector3(0, -1 + 0.3 * u, 0.75 * u).normalize()
    for (const [side, sign] of SIDES) {
      gripAt(b, out.arm[side], side, new Vector3(sign * 0.17 * s, rail.height, rail.z!), rail.radius, fingers, palm, 0.9)
      out.arm[side].elbow.set(sign * 0.5, -1, -0.2)
      out.arm[side].shrug = 0
    }
  },
}

// ── Shrimp squat ─────────────────────────────────────────────────────────

/** How high the knee joint is when the kneecap rests on the floor. */
const KNEE_DOWN = 0.052

/**
 * Shrimp squat on the left leg: the right leg is bent behind and its knee
 * comes down to touch the floor behind the standing heel, softly, while the
 * foot stays off the floor; the trunk leans forward to balance.
 */
export const shrimp: Motion = {
  id: 'shrimp-squat',
  revision: 1,
  stage: 'square',
  planted: ['footL'],
  kind: 'reps',
  period: 3.8,
  camera: 'side',
  azimuth: 64,
  elevation: 5,
  beat: 0.97,
  detail: { 'quads.R': 0.2, 'glutes.R': 0.2, 'glute_med.R': 0.15, 'hamstrings.R': 0.6, 'calves.R': 0.08 },
  standard: 'Rear knee touches the floor softly behind the standing heel; the rear foot never touches; standing heel down; trunk leans forward as the knee travels down; stood up without a push.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.45, 0.07),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const legs = legsOf(b)
    const u = there(t, 0.45, 0.07)
    const footX = 0.05 * s
    const mid = 0.02 * s
    const standing = b.ankle + Math.sqrt((legs * 0.998) ** 2 - (mid + b.rest.upperLegL.x - footX) ** 2)
    const low = b.ankle + 0.395 * legs
    trunk(rig, out, at(lerp(0.02, 0, u) * s, lerp(standing, low, u), mid), lerp(2, 45, u), lerp(0, 50, u), lerp(0, 22, u))
    flatFoot(out.leg.L, b, footX, 0, 1, 4)
    out.leg.L.knee.set(-0.15, 0, 1)
    // The rear thigh swings back until its knee is on the floor; the shin stays folded up behind.
    const hip = rig.pos.upperLegR
    const down = Math.acos(Math.min(1, (low - KNEE_DOWN * s) / b.upperLeg))
    const swing = lerp(8 * rad, down, u)
    const knee = hip.clone().addScaledVector(new Vector3(0, -Math.cos(swing), -Math.sin(swing)), b.upperLeg)
    const fold = lerp(2, 36, u) * rad
    const shin = new Vector3(0, Math.sin(fold), -Math.cos(fold))
    const rear = out.leg.R
    rear.foot.copy(knee).addScaledVector(shin, b.lowerLeg)
    rear.knee.copy(knee).sub(hip.clone().add(rear.foot).multiplyScalar(0.5))
    rear.rot.copy(footRot(shin.clone().applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 12 * rad)), new Vector3(0, -Math.cos(fold), -Math.sin(fold))))
    rear.toes = 0
    armsForward(rig, out, u, 0.42)
  },
}

/** Leg work of the assessment, easiest first. */
export const LEGS: Motion[] = [boxSquat, wallSit, calfRaise, bulgarian, cossack, deepSquat, assistedPistol, pistol, shrimp]
