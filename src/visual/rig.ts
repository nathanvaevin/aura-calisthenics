/**
 * Posing the Aura skeleton.
 *
 * A pose is written the way a coach would describe a position: where the
 * hips are and how the trunk is turned, where each hand and foot is and which
 * way the elbows and knees point. The solver works out every joint from
 * that, per character, so a hand planted on the floor stays planted whatever
 * the length of the arm. That is what lets one movement be performed by
 * both master characters.
 */
import { Matrix4, Quaternion, Vector3 } from 'three'
import { BONES, PARENT, skeletonOf, type BoneName, type CharacterId, type Side } from './body/skeleton'

const v = (a: readonly number[]) => new Vector3(a[0], a[1], a[2])

export const X = new Vector3(1, 0, 0)
export const Y = new Vector3(0, 1, 0)
export const Z = new Vector3(0, 0, 1)
const rad = Math.PI / 180

/** Rotations about the body's own axes, in degrees. Pitch tips the head forward; a prone plank is pitch 90. */
export const pitch = (deg: number) => new Quaternion().setFromAxisAngle(X, deg * rad)
export const yaw = (deg: number) => new Quaternion().setFromAxisAngle(Y, deg * rad)
export const roll = (deg: number) => new Quaternion().setFromAxisAngle(Z, deg * rad)

export interface ArmPose {
  /** Where the wrist is. */
  hand: Vector3
  /** The hand's own rotation in the world: see `handRot`. */
  rot: Quaternion
  /** The way the elbow points. */
  elbow: Vector3
  /** 0 open hand, 1 closed around a bar. */
  grip: number
  /** Extra lift of the shoulder girdle, -1 pulled down to 1 shrugged. */
  shrug: number
}

export interface LegPose {
  /** Where the ankle is. */
  foot: Vector3
  rot: Quaternion
  /** The way the knee points. */
  knee: Vector3
  /** How far the toes are bent back, in degrees (standing on the balls of the feet). */
  toes: number
}

export interface Pose {
  hips: Vector3
  /** Rotation of the pelvis, and of the ribcage: the spine bends between them. */
  pelvis: Quaternion
  chest: Quaternion
  head: Quaternion
  arm: Record<Side, ArmPose>
  leg: Record<Side, LegPose>
}

/** A character's proportions, as the movements need them. */
export interface Body {
  id: CharacterId
  rest: Record<BoneName, Vector3>
  upperArm: number
  lowerArm: number
  upperLeg: number
  lowerLeg: number
  /** Wrist to the middle of the palm, and to the knuckles. */
  palm: number
  knuckle: number
  /** Ankle above the sole; ankle to the ball of the foot, along the foot and below it. */
  ankle: number
  ball: Vector3
  heel: Vector3
  /** Hip joints to shoulder joints, with the spine straight. */
  trunk: number
  height: number
  scale: number
}

export function bodyOf(id: CharacterId): Body {
  const sk = skeletonOf(id)
  const rest = Object.fromEntries(BONES.map((b) => [b, v(sk.joints[b])])) as Record<BoneName, Vector3>
  const d = (a: BoneName, b: BoneName) => rest[a].distanceTo(rest[b])
  return {
    id, rest,
    upperArm: d('upperArmL', 'lowerArmL'), lowerArm: d('lowerArmL', 'handL'),
    upperLeg: d('upperLegL', 'lowerLegL'), lowerLeg: d('lowerLegL', 'footL'),
    palm: d('handL', 'fingers1L') * 0.6, knuckle: d('handL', 'fingers1L'),
    ankle: rest.footL.y,
    ball: rest.toesL.clone().sub(rest.footL).setX(0),
    heel: v(sk.tips.heelL).sub(rest.footL).setX(0),
    trunk: rest.upperArmL.y - rest.upperLegL.y,
    height: sk.height, scale: sk.scale,
  }
}

const m4 = new Matrix4()
const tx = new Vector3(), ty = new Vector3(), tz = new Vector3()

/** The rotation of a frame whose first axis is `aim` and whose second leans towards `pole`. */
function frame(aim: Vector3, pole: Vector3, out = new Quaternion()): Quaternion {
  tx.copy(aim).normalize()
  ty.copy(pole).addScaledVector(tx, -pole.dot(tx))
  if (ty.lengthSq() < 1e-10) ty.set(-tx.y, tx.x, 0)
  if (ty.lengthSq() < 1e-10) ty.set(0, -tx.z, tx.y)
  ty.normalize()
  tz.crossVectors(tx, ty)
  return out.setFromRotationMatrix(m4.makeBasis(tx, ty, tz))
}

/** A hand's rotation from where the fingers point and what the palm faces. */
export function handRot(side: Side, fingers: Vector3, palm: Vector3): Quaternion {
  const rest = frame(side === 'L' ? X : X.clone().negate(), Y.clone().negate())
  return frame(fingers, palm).multiply(rest.invert())
}

/** A foot's rotation from where the toes point and which way the sole's normal (the top of the foot) faces. */
export function footRot(toes: Vector3, up: Vector3): Quaternion {
  return frame(toes, up).multiply(frame(Z, Y).invert())
}

const SIDES: Side[] = ['L', 'R']

export class Rig {
  readonly body: Body
  /** World rotation and position of every bone, after `solve`. */
  readonly rot = {} as Record<BoneName, Quaternion>
  readonly pos = {} as Record<BoneName, Vector3>
  private readonly restFrame = {} as Record<string, Quaternion>
  private readonly armAim: Record<Side, Vector3>
  private readonly legAim: Record<Side, { upper: Vector3; lower: Vector3 }>

  constructor(id: CharacterId) {
    this.body = bodyOf(id)
    const r = this.body.rest
    for (const b of BONES) { this.rot[b] = new Quaternion(); this.pos[b] = r[b].clone() }
    this.armAim = { L: X.clone(), R: X.clone().negate() }
    this.legAim = {
      L: { upper: r.lowerLegL.clone().sub(r.upperLegL).normalize(), lower: r.footL.clone().sub(r.lowerLegL).normalize() },
      R: { upper: r.lowerLegR.clone().sub(r.upperLegR).normalize(), lower: r.footR.clone().sub(r.lowerLegR).normalize() },
    }
    const back = Z.clone().negate()
    for (const s of SIDES) {
      this.restFrame[`arm${s}`] = frame(this.armAim[s], back).invert()
      this.restFrame[`thigh${s}`] = frame(this.legAim[s].upper, Z).invert()
      this.restFrame[`shin${s}`] = frame(this.legAim[s].lower, Z).invert()
    }
  }

  private child(bone: BoneName) {
    const p = PARENT[bone]!
    this.pos[bone].copy(this.body.rest[bone]).sub(this.body.rest[p]).applyQuaternion(this.rot[p]).add(this.pos[p])
  }

  /** Where the shoulder and hip joints are for a trunk position, before any arm or leg is solved. */
  joints(hips: Vector3, pelvis: Quaternion, chest: Quaternion) {
    this.trunk(hips, pelvis, chest, chest)
    const r = this.body.rest
    const at = (bone: BoneName, parent: BoneName) => r[bone].clone().sub(r[parent]).applyQuaternion(this.rot[parent]).add(this.pos[parent])
    this.rot.shoulderL.copy(chest); this.rot.shoulderR.copy(chest)
    this.child('shoulderL'); this.child('shoulderR')
    return {
      shoulderL: at('upperArmL', 'shoulderL'), shoulderR: at('upperArmR', 'shoulderR'),
      hipL: at('upperLegL', 'hips'), hipR: at('upperLegR', 'hips'),
      neck: this.pos.neck.clone(), head: this.pos.head.clone(),
    }
  }

  private trunk(hips: Vector3, pelvis: Quaternion, chest: Quaternion, head: Quaternion) {
    const { rot, pos } = this
    pos.hips.copy(hips)
    rot.hips.copy(pelvis)
    rot.spine.copy(pelvis).slerp(chest, 0.3)
    rot.chest.copy(pelvis).slerp(chest, 0.68)
    rot.upperChest.copy(chest)
    rot.neck.copy(chest).slerp(head, 0.45)
    rot.head.copy(head)
    for (const b of ['spine', 'chest', 'upperChest', 'neck', 'head'] as BoneName[]) this.child(b)
  }

  solve(p: Pose) {
    const { rot, pos, body } = this
    const r = body.rest
    this.trunk(p.hips, p.pelvis, p.chest, p.head)

    for (const s of SIDES) {
      const sign = s === 'L' ? 1 : -1
      const B = (n: string) => `${n}${s}` as BoneName
      const arm = p.arm[s]

      // Shoulder girdle: it rises and comes forward with the arm, as a real one does.
      rot[B('shoulder')].copy(rot.upperChest)
      this.child(B('shoulder'))
      const rigid = r[B('upperArm')].clone().sub(r[B('shoulder')]).applyQuaternion(rot.upperChest).add(pos[B('shoulder')])
      const reach = arm.hand.clone().sub(rigid).normalize().applyQuaternion(rot.upperChest.clone().invert())
      const up = smooth(-0.25, 1, reach.y), fwd = smooth(0.15, 1, reach.z), bwd = smooth(0.15, 1, -reach.z)
      const lift = (-5 + 34 * up + 14 * arm.shrug) * rad
      const forward = (15 * fwd - 8 * bwd) * rad
      const girdle = new Quaternion().setFromAxisAngle(Z, sign * lift).multiply(new Quaternion().setFromAxisAngle(Y, -sign * forward))
      rot[B('shoulder')].copy(rot.upperChest).multiply(girdle)
      this.child(B('upperArm'))

      // Arm
      const S = pos[B('upperArm')]
      const E = elbowOf(S, arm.hand, body.upperArm, body.lowerArm, arm.elbow)
      const W = E.clone().add(arm.hand.clone().sub(E).setLength(body.lowerArm))
      const apex = E.clone().sub(S).cross(W.clone().sub(E)).lengthSq() > 1e-9
        ? perpendicular(E.clone().sub(S).add(E.clone().sub(W)), W.clone().sub(S)) : perpendicular(arm.elbow, W.clone().sub(S))
      frame(E.clone().sub(S), apex, rot[B('upperArm')]).multiply(this.restFrame[`arm${s}`])
      frame(W.clone().sub(E), apex, rot[B('lowerArm')]).multiply(this.restFrame[`arm${s}`])
      pos[B('lowerArm')].copy(E)
      pos[B('hand')].copy(W)
      rot[B('hand')].copy(arm.rot)
      // The forearm turns with the hand: the part of the hand's rotation that is about the forearm's own length.
      const rel = rot[B('lowerArm')].clone().invert().multiply(arm.rot)
      const twist = new Quaternion(rel.x, 0, 0, rel.w)
      if (twist.lengthSq() < 1e-8) twist.identity()
      else twist.normalize()
      rot[B('foreTwist')].copy(rot[B('lowerArm')]).multiply(twist)
      this.child(B('foreTwist'))
      // Fingers close around what is held.
      const curl = arm.grip
      const bend = (deg: number) => new Quaternion().setFromAxisAngle(Z, -sign * deg * rad)
      rot[B('fingers1')].copy(arm.rot).multiply(bend(8 + 62 * curl))
      rot[B('fingers2')].copy(rot[B('fingers1')]).multiply(bend(10 + 78 * curl))
      rot[B('fingers3')].copy(rot[B('fingers2')]).multiply(bend(6 + 50 * curl))
      rot[B('thumb1')].copy(arm.rot).multiply(new Quaternion().setFromAxisAngle(X, sign * (10 + 55 * curl) * rad)).multiply(new Quaternion().setFromAxisAngle(Y, sign * 20 * curl * rad))
      rot[B('thumb2')].copy(rot[B('thumb1')]).multiply(new Quaternion().setFromAxisAngle(Y, sign * 30 * curl * rad))
      for (const b of ['fingers1', 'fingers2', 'fingers3', 'thumb1', 'thumb2']) this.child(B(b))

      // Leg
      const leg = p.leg[s]
      this.child(B('upperLeg'))
      const H = pos[B('upperLeg')]
      const K = elbowOf(H, leg.foot, body.upperLeg, body.lowerLeg, leg.knee)
      const A = K.clone().add(leg.foot.clone().sub(K).setLength(body.lowerLeg))
      const kneeApex = K.clone().sub(H).cross(A.clone().sub(K)).lengthSq() > 1e-9
        ? perpendicular(K.clone().sub(H).add(K.clone().sub(A)), A.clone().sub(H)) : perpendicular(leg.knee, A.clone().sub(H))
      frame(K.clone().sub(H), kneeApex, rot[B('upperLeg')]).multiply(this.restFrame[`thigh${s}`])
      frame(A.clone().sub(K), kneeApex, rot[B('lowerLeg')]).multiply(this.restFrame[`shin${s}`])
      pos[B('lowerLeg')].copy(K)
      pos[B('foot')].copy(A)
      rot[B('foot')].copy(leg.rot)
      rot[B('toes')].copy(leg.rot).multiply(new Quaternion().setFromAxisAngle(X, -leg.toes * rad))
      this.child(B('toes'))
    }
  }

  /** A bone's rotation relative to its parent, which is what a skeleton stores. */
  local(bone: BoneName, out: Quaternion): Quaternion {
    const p = PARENT[bone]
    return p ? out.copy(this.rot[p]).invert().multiply(this.rot[bone]) : out.copy(this.rot[bone])
  }
}

const smooth = (a: number, b: number, x: number) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u) }

/** The part of `a` at right angles to `axis`, as a unit vector. */
function perpendicular(a: Vector3, axis: Vector3): Vector3 {
  const n = axis.clone().normalize()
  const out = a.clone().addScaledVector(n, -a.dot(n))
  if (out.lengthSq() < 1e-10) out.set(n.z, 0, -n.x)
  if (out.lengthSq() < 1e-10) out.set(0, n.z, -n.y)
  return out.normalize()
}

/** Where the middle joint of a two-bone limb sits, given both ends and the way it should point. */
export function elbowOf(from: Vector3, to: Vector3, l1: number, l2: number, hint: Vector3): Vector3 {
  const d = to.clone().sub(from)
  const len = Math.min(Math.max(d.length(), Math.abs(l1 - l2) + 1e-4), l1 + l2 - 1e-4)
  const dir = d.normalize()
  const a = (l1 * l1 - l2 * l2 + len * len) / (2 * len)
  const h = Math.sqrt(Math.max(l1 * l1 - a * a, 0))
  return from.clone().addScaledVector(dir, a).addScaledVector(perpendicular(hint, dir), h)
}

export const emptyPose = (): Pose => ({
  hips: new Vector3(), pelvis: new Quaternion(), chest: new Quaternion(), head: new Quaternion(),
  arm: { L: arm(), R: arm() }, leg: { L: leg(), R: leg() },
})
const arm = (): ArmPose => ({ hand: new Vector3(), rot: new Quaternion(), elbow: new Vector3(0, 0, -1), grip: 0, shrug: 0 })
const leg = (): LegPose => ({ foot: new Vector3(), rot: new Quaternion(), knee: new Vector3(0, 0, 1), toes: 0 })
