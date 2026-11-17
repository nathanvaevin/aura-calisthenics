/**
 * What the movements are written with: the handful of geometric facts that
 * come up again and again (a foot on its ball, a straight body on its toes, a
 * hand round a bar).
 */
import { Quaternion, Vector3 } from 'three'
import type { Side } from '../body/skeleton'
import { elbowOf, handRot, pitch, type ArmPose, type Body, type LegPose, type Pose, type Rig } from '../rig'

export const SIDES: [Side, number][] = [['L', 1], ['R', -1]]
export const deg = Math.PI / 180

/** A point in the plane the body moves in: `along` is forward (+Z), `up` is height. */
export const at = (along: number, up: number, across = 0) => new Vector3(across, up, along)

/** Where the hips bone goes for the midpoint of the hip joints to be at `mid`. */
export function hipsAt(b: Body, pelvis: Quaternion, mid: Vector3, out: Vector3): Vector3 {
  const off = new Vector3(0, b.rest.upperLegL.y - b.rest.hips.y, b.rest.upperLegL.z - b.rest.hips.z).applyQuaternion(pelvis)
  return out.copy(mid).sub(off)
}

/** Moves the whole body so that the midpoint of the shoulder joints ends up at `target`. */
export function shouldersAt(rig: Rig, pose: Pose, target: Vector3) {
  for (let i = 0; i < 3; i++) {
    rig.solve(pose)
    const mid = rig.pos.upperArmL.clone().add(rig.pos.upperArmR).multiplyScalar(0.5)
    pose.hips.add(target.clone().sub(mid))
  }
  rig.solve(pose)
}

/** A foot standing on its ball, in the plane of movement: the ankle is given, the toes lie flat. */
export function onBall(b: Body, ankle: Vector3, ball: Vector3, leg: LegPose) {
  const rest = Math.atan2(b.ball.y, b.ball.z)
  const now = Math.atan2(ball.y - ankle.y, ball.z - ankle.z)
  const tilt = (rest - now) / deg
  leg.foot.copy(ankle)
  leg.rot.copy(pitch(tilt))
  leg.toes = Math.max(0, Math.min(85, tilt))
}

/** A straight leg from a hip joint down to a ball of the foot planted on the floor: finds the ankle. */
export function legOnBall(b: Body, hip: Vector3, ball: Vector3, heel: Vector3, leg: LegPose) {
  const ankle = elbowOf(hip, ball, (b.upperLeg + b.lowerLeg) * 0.998, b.ball.length(), heel)
  onBall(b, ankle, ball, leg)
}

export interface Line {
  /** Angle of the body above the floor, degrees. */
  angle: number
  /** Height of the surface the balls of the feet are on, plus the pad of the foot. */
  pad: number
  ankle: Vector3
  hip: Vector3
  shoulder: Vector3
}

/**
 * A straight body, face down, on the balls of the feet (at z = `ballZ`,
 * head towards +Z), with the shoulder joints at a height. Returns the line;
 * `proneBody` writes it into a pose. `pad` is the height of the balls of
 * the feet: 0.014 on the floor, more with the feet on a box. The angle goes
 * negative when the feet are higher than the shoulders.
 */
export function proneLine(b: Body, ballZ: number, shoulderY: number, pad = 0.014): Line {
  const f = b.ball.length()
  const legs = (b.upperLeg + b.lowerLeg) * 0.998
  const L = legs + b.trunk
  let a = 0.2
  // Height of the shoulders is the foot standing up, plus the body's rise along its length.
  for (let i = 0; i < 12; i++) a = Math.asin(Math.max(-0.5, Math.min(0.95, (shoulderY - pad - f * Math.cos(a)) / L)))
  const dir = at(Math.cos(a), Math.sin(a))
  const ankle = at(ballZ - f * Math.sin(a), pad + f * Math.cos(a))
  return { angle: a / deg, pad, ankle, hip: ankle.clone().addScaledVector(dir, legs), shoulder: ankle.clone().addScaledVector(dir, L) }
}

/** Writes a prone straight body into a pose: trunk, hips and both legs. `tuck` hollows the trunk a few degrees. */
export function proneBody(b: Body, line: Line, out: Pose, tuck = 3) {
  const lean = 90 - line.angle
  out.pelvis.copy(pitch(lean - tuck))
  out.chest.copy(pitch(lean + tuck * 0.6))
  hipsAt(b, out.pelvis, line.hip, out.hips)
  for (const [side, sign] of SIDES) {
    const x = sign * b.rest.upperLegL.x
    const ankle = line.ankle.clone().setX(x)
    onBall(b, ankle, at(line.ankle.z + b.ball.length() * Math.sin(line.angle * deg), line.pad, x), out.leg[side])
    out.leg[side].knee.set(0, -1, 0.2)
  }
}

/**
 * A prone straight body whose shoulder joints really are at `shoulderY`. The
 * shoulder girdle moves with the arms (it comes forward when they push), so
 * the first attempt is measured and corrected. `arms` places the hands; it is
 * told where the shoulders actually are.
 */
export function proneAt(rig: Rig, out: Pose, ballZ: number, shoulderY: number, arms: (shoulder: Vector3) => void, tuck = 3, pad = 0.014): Vector3 {
  const seen = new Vector3()
  let ask = shoulderY
  for (let i = 0; i < 4; i++) {
    const line = proneLine(rig.body, ballZ, ask, pad)
    proneBody(rig.body, line, out, tuck)
    arms(i ? seen : line.shoulder)
    rig.solve(out)
    seen.copy(rig.pos.upperArmL).add(rig.pos.upperArmR).multiplyScalar(0.5)
    ask += shoulderY - seen.y
  }
  return seen
}

/** Legs held straight out of the pelvis, `flex` degrees forward of its own line, toes pointed. Needs the rig solved for the trunk. */
export function straightLegs(rig: Rig, out: Pose, flex: number, point = 50, spread = 0) {
  const b = rig.body
  for (const [side, sign] of SIDES) {
    const hip = rig.pos[`upperLeg${side}`]
    const turn = out.pelvis.clone().multiply(pitch(-flex)).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), sign * spread * deg))
    const dir = new Vector3(0, -1, 0).applyQuaternion(turn)
    const leg = out.leg[side]
    leg.foot.copy(hip).addScaledVector(dir, (b.upperLeg + b.lowerLeg) * 0.999)
    leg.rot.copy(turn).multiply(pitch(point))
    leg.knee.copy(new Vector3(0, 0, 1).applyQuaternion(turn))
    leg.toes = -18
  }
}

/** A hand flat on the floor: the wrist sits this far above it. */
export const wristHeight = (b: Body) => 0.024 * b.scale

/** Both hands flat on the floor (or on a surface `height` above it), fingers towards +Z, `half` either side of the centre line. */
export function handsOnFloor(b: Body, out: Pose, z: number, half: number, elbow: Vector3, turnOut = 8, height = 0) {
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    arm.hand.set(sign * half, height + wristHeight(b), z)
    arm.rot.copy(handRot(side, new Vector3(sign * Math.sin(turnOut * deg), 0, Math.cos(turnOut * deg)), new Vector3(0, -1, 0)))
    arm.elbow.set(sign * elbow.x, elbow.y, elbow.z)
    arm.grip = 0.04
    arm.shrug = 0
  }
}

/**
 * One hand closed round a bar or rail. `point` is the centre of the bar where
 * the hand holds it; `fingers` is the way the fingers point before they curl
 * (from the wrist towards the bar), `palm` what the palm faces (towards the bar).
 */
export function gripAt(b: Body, arm: ArmPose, side: Side, point: Vector3, radius: number, fingers: Vector3, palm: Vector3, grip = 1) {
  const f = fingers.clone().normalize(), p = palm.clone().normalize()
  arm.hand.copy(point).addScaledVector(f, radius * 0.35 - b.knuckle).addScaledVector(p, -(radius + 0.012 * b.scale))
  arm.rot.copy(handRot(side, f, p))
  arm.grip = grip
}

/** Both hands closed over a bar that runs across the stage, hanging under it: overhand (palms forward) or underhand (palms towards the face). */
export function handsOnBar(b: Body, out: Pose, bar: { height: number; radius: number; z?: number }, half: number, grip: 'over' | 'under' = 'over') {
  for (const [side, sign] of SIDES) {
    gripAt(b, out.arm[side], side, new Vector3(sign * half, bar.height, bar.z ?? 0), bar.radius, new Vector3(0, 1, 0), new Vector3(0, 0, grip === 'over' ? 1 : -1))
  }
}
