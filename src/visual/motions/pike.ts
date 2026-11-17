import { Vector3 } from 'three'
import { pitch } from '../rig'
import { SIDES, at, handsOnFloor, hipsAt, legOnBall, shouldersAt, wristHeight } from './kit'
import { ease, lerp, there, type Motion } from './types'

/**
 * Pike push-up: hips high, arms and trunk in one line at the top. The head
 * travels down and forward to a point in front of the hands (hands and head
 * make a triangle), elbows back at about 45 degrees, then straight back up
 * the same path.
 */
export const pikePushup: Motion = {
  id: 'pike-pushup',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'reps',
  period: 3.1,
  camera: 'side',
  azimuth: 66,
  elevation: 6,
  beat: 0.97,
  detail: { pec_upper: 0.3, delt_post: 0.2 },
  standard: 'Hips stay high; the head goes to the floor in front of the hands, not between them; elbows about 45° back, not flared; arms fully straight at the top.',
  effort: (t) => 0.35 + 0.65 * there(t, 0.42, 0.06),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = there(t, 0.42, 0.06)
    const reach = b.upperArm + b.lowerArm
    const legs = (b.upperLeg + b.lowerLeg) * 0.998
    const wrist = wristHeight(b)
    const crown = b.height - b.rest.upperArmL.y
    // Top: arms and trunk in line, 50 degrees above the floor, hands at z = 0, feet behind.
    const a0 = 50.5 * (Math.PI / 180)
    const top = at(-Math.cos(a0) * reach * 0.985, wrist + Math.sin(a0) * reach * 0.985)
    const topHip = top.clone().add(at(-Math.cos(a0), Math.sin(a0)).multiplyScalar(b.trunk))
    const f = b.ball.length()
    const ballZ = topHip.z - Math.sqrt(Math.max(0, (legs + f * 0.55) ** 2 - (topHip.y - 0.014 * s) ** 2))
    // Bottom: the crown of the head a hand's length in front of the hands, just off the floor.
    const a1 = 47 * (Math.PI / 180)
    const low = at(0.085 * s - Math.cos(a1) * crown, 0.022 * s + Math.sin(a1) * crown)
    const e = ease(u)
    const angle = lerp(a0, a1, e)
    const shoulder = top.clone().lerp(low, e)
    // The path bows forward a little: shoulders lead, as in a press.
    shoulder.z += Math.sin(u * Math.PI) * 0.02 * s
    const lean = 90 + angle * (180 / Math.PI)
    out.chest.copy(pitch(lean))
    out.pelvis.copy(pitch(lean + 4))
    out.head.copy(pitch(lean - lerp(8, 2, u)))
    hipsAt(b, out.pelvis, shoulder.clone().add(at(-Math.cos(angle), Math.sin(angle)).multiplyScalar(b.trunk)), out.hips)
    handsOnFloor(b, out, 0, b.rest.upperArmL.x + 0.03 * s, new Vector3(0.78, 0.1, -1), 6)
    for (const [side] of SIDES) out.arm[side].shrug = lerp(0.9, 0.2, u)
    shouldersAt(rig, out, shoulder)
    for (const [side, sign] of SIDES) {
      const x = sign * b.rest.upperLegL.x
      legOnBall(b, rig.pos[`upperLeg${side}`], at(ballZ, 0.014 * s, x), new Vector3(0, 0.6, -1), out.leg[side])
      out.leg[side].knee.set(0, 0.2, 1)
    }
  },
}
