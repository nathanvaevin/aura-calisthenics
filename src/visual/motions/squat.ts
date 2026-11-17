import { Vector3 } from 'three'
import { footRot, handRot, pitch } from '../rig'
import { SIDES, at, hipsAt, onBall } from './kit'
import { ease, lerp, there, type Motion } from './types'

/**
 * Bodyweight squat: feet about shoulder width and turned out a little, heels
 * down, hips back and down until the hip crease is below the knee, knees
 * tracking over the toes, chest up, arms reaching forward for balance.
 */
export const squat: Motion = {
  id: 'squat',
  revision: 1,
  kind: 'reps',
  period: 3.2,
  camera: 'three-quarter',
  azimuth: 52,
  elevation: 5,
  beat: 0.97,
  standard: 'Heels stay down; hip crease below the top of the knee; knees over the toes, not caving in; back keeps its shape; full stand at the top.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.44, 0.06),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = there(t, 0.44, 0.06)
    const stance = 0.19 * s
    const legs = b.upperLeg + b.lowerLeg
    const standing = b.ankle + Math.sqrt((legs * 0.9992) ** 2 - (stance - b.rest.upperLegL.x) ** 2)
    // Bottom: hips just below the knees, and well behind the heels.
    const hip = at(lerp(0.005, -0.245, ease(u)) * s, lerp(standing, b.ankle + b.lowerLeg * 0.84, u))
    out.pelvis.copy(pitch(lerp(0, 39, u)))
    out.chest.copy(pitch(lerp(-1, 35, u)))
    out.head.copy(pitch(lerp(1, 12, u)))
    hipsAt(b, out.pelvis, hip, out.hips)
    const lean = out.chest
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      const toes = new Vector3(sign * 0.3, 0, 1).normalize()
      leg.foot.set(sign * stance, b.ankle, 0)
      leg.rot.copy(footRot(toes, new Vector3(0, 1, 0)))
      leg.knee.copy(toes)
      leg.toes = 0
      // Arms come up to shoulder height in front as the hips go down.
      const arm = out.arm[side]
      const shoulder = b.rest[`upperArm${side}`].clone().sub(b.rest.hips).applyQuaternion(lean).add(out.hips)
      const dir = new Vector3(sign * lerp(0.16, 0.06, u), lerp(-1, 0.04, u), lerp(0.05, 1, u)).normalize()
      arm.hand.copy(shoulder).addScaledVector(dir, (b.upperArm + b.lowerArm) * lerp(0.985, 0.96, u))
      arm.elbow.set(sign * 0.6, lerp(0, -1, u), lerp(-1, -0.2, u))
      arm.rot.copy(handRot(side, dir.clone().add(new Vector3(0, 0, 0.12)).normalize(), new Vector3(-sign, lerp(0, -0.5, u), -0.2).normalize()))
      arm.grip = 0.15
      arm.shrug = -0.2
    }
  },
}

/**
 * Split squat, left leg in front: a long stance, the trunk upright, straight
 * down until the back knee is just off the floor; front shin close to
 * vertical, front heel down, back foot on its ball.
 */
export const splitSquat: Motion = {
  id: 'split-squat',
  revision: 1,
  kind: 'reps',
  period: 3.2,
  camera: 'side',
  azimuth: 62,
  elevation: 5,
  beat: 0.97,
  detail: { 'quads.R': 0.6, 'glutes.R': 0.45, 'glute_med.L': 0.75, 'hamstrings.R': 0.3, 'adductors.R': 0.3, 'hip_flexors.R': 0.3 },
  standard: 'Trunk upright; front heel down and front knee over the foot; back knee to just above the floor; straight up and down, no forward lunge of the trunk.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.44, 0.06),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = there(t, 0.44, 0.06)
    const half = b.rest.upperLegL.x
    const front = at(b.upperLeg * 0.98, b.ankle, half + 0.01 * s)
    const ball = at(-(b.lowerLeg + 0.02 * s), 0.014 * s, -half - 0.01 * s)
    // Top: the front leg all but straight. Bottom: the front thigh level, the back knee a hand above the floor.
    const top = b.ankle + Math.sqrt(((b.upperLeg + b.lowerLeg) * 0.975) ** 2 - front.z ** 2)
    const low = b.ankle + b.lowerLeg * 0.99
    const hip = at(lerp(0.02, 0, u) * s, lerp(top, low, u))
    out.pelvis.copy(pitch(lerp(2, 5, u)))
    out.chest.copy(pitch(lerp(1, 5, u)))
    out.head.copy(pitch(2))
    hipsAt(b, out.pelvis, hip, out.hips)
    out.leg.L.foot.copy(front)
    out.leg.L.rot.copy(footRot(new Vector3(0, 0, 1), new Vector3(0, 1, 0)))
    out.leg.L.knee.set(0.05, 0, 1)
    out.leg.L.toes = 0
    // The back heel lifts further as the knee goes down.
    const rise = (lerp(52, 74, u) - Math.atan2(b.ball.y, b.ball.z) * (180 / Math.PI)) * (Math.PI / 180)
    const f = b.ball.length()
    onBall(b, at(ball.z - f * Math.cos(rise), ball.y + f * Math.sin(rise), ball.x), ball, out.leg.R)
    out.leg.R.knee.set(-0.05, -0.55, 1)
    // Hands on the hips: it keeps the trunk honest and the picture clear.
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.set(sign * (half + 0.085 * s), hip.y + 0.085 * s, hip.z + 0.045 * s)
      arm.elbow.set(sign * 1, 0.1, -0.75)
      arm.rot.copy(handRot(side, new Vector3(-sign * 0.45, -0.6, 0.66).normalize(), new Vector3(-sign, 0.15, -0.3).normalize()))
      arm.grip = 0.35
      arm.shrug = 0
    }
  },
}
