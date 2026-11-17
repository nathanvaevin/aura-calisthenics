import { Vector3 } from 'three'
import { footRot, handRot, pitch, type Body, type Pose } from '../rig'

/** Standing at ease: the neutral position the characters are presented in. `breath` is 0..1 through one breath. */
export function stand(b: Body, out: Pose, breath = 0): void {
  const s = b.scale
  const swell = Math.sin(breath * Math.PI * 2)
  const stance = 0.155 * s
  const drop = 0.004 * s
  out.hips.set(0, b.rest.hips.y - drop, 0)
  out.pelvis.identity()
  out.chest.copy(pitch(-1.2 - 0.9 * swell))
  out.head.copy(pitch(1.5))
  for (const side of ['L', 'R'] as const) {
    const sign = side === 'L' ? 1 : -1
    const leg = out.leg[side]
    leg.foot.set(sign * stance, b.ankle, -0.012 * s)
    leg.rot.copy(footRot(new Vector3(sign * 0.14, 0, 1).normalize(), new Vector3(0, 1, 0)))
    leg.knee.set(sign * 0.12, 0, 1)
    leg.toes = 0
    const arm = out.arm[side]
    const shoulder = b.rest[`upperArm${side}`]
    const down = new Vector3(sign * (0.2 + 0.012 * swell), -1, 0.05).normalize()
    arm.hand.copy(shoulder).setY(shoulder.y - drop - 0.012 * s).addScaledVector(down, (b.upperArm + b.lowerArm) * 0.985)
    arm.elbow.set(sign * 0.45, 0, -1)
    arm.rot.copy(handRot(side, new Vector3(sign * 0.12, -1, 0.14).normalize(), new Vector3(-sign, 0, -0.25).normalize()))
    arm.grip = 0.22
    arm.shrug = -0.2
  }
}
