/**
 * The Aura skeleton: one bone layout shared by every character.
 *
 * Rest pose: arms straight out to the sides with palms down, legs slightly
 * apart. Every bone's rest rotation is identity, so a pose is simply a world
 * rotation per bone. +Y is up, +Z is where the character faces, +X is the
 * character's left. Metres.
 *
 * Pure data: used by the generator (scripts/character) and by the runtime.
 */

export type V3 = [number, number, number]
export type CharacterId = 'male' | 'female'
/**
 * A body sculpted for one visual universe. Every build stands on the same
 * skeleton, joint for joint, so one movement plays on all of them.
 */
export const BUILDS = ['aura', 'power', 'iron'] as const
export type BuildId = (typeof BUILDS)[number]
export type Side = 'L' | 'R'

export const CENTRE_BONES = ['hips', 'spine', 'chest', 'upperChest', 'neck', 'head'] as const
export const SIDE_BONES = [
  'shoulder', 'upperArm', 'lowerArm', 'foreTwist', 'hand',
  'fingers1', 'fingers2', 'fingers3', 'thumb1', 'thumb2',
  'upperLeg', 'lowerLeg', 'foot', 'toes',
] as const

export type CentreBone = (typeof CENTRE_BONES)[number]
export type SideBone = (typeof SIDE_BONES)[number]
export type BoneName = CentreBone | `${SideBone}${Side}`

export const BONES: BoneName[] = [
  ...CENTRE_BONES,
  ...SIDE_BONES.map((b) => `${b}L` as BoneName),
  ...SIDE_BONES.map((b) => `${b}R` as BoneName),
]

const SIDE_PARENT: Record<SideBone, SideBone | CentreBone> = {
  shoulder: 'upperChest', upperArm: 'shoulder', lowerArm: 'upperArm', foreTwist: 'lowerArm', hand: 'lowerArm',
  fingers1: 'hand', fingers2: 'fingers1', fingers3: 'fingers2', thumb1: 'hand', thumb2: 'thumb1',
  upperLeg: 'hips', lowerLeg: 'upperLeg', foot: 'lowerLeg', toes: 'foot',
}
const CENTRE_PARENT: Record<CentreBone, CentreBone | null> = {
  hips: null, spine: 'hips', chest: 'spine', upperChest: 'chest', neck: 'upperChest', head: 'neck',
}

const isCentre = (b: string): b is CentreBone => (CENTRE_BONES as readonly string[]).includes(b)

export const PARENT = Object.fromEntries(
  BONES.map((b) => {
    if (isCentre(b)) return [b, CENTRE_PARENT[b]]
    const side = b.slice(-1) as Side
    const p = SIDE_PARENT[b.slice(0, -1) as SideBone]
    return [b, isCentre(p) ? p : `${p}${side}`]
  }),
) as Record<BoneName, BoneName | null>

export interface Skeleton {
  /** Where each bone starts, at rest. */
  joints: Record<BoneName, V3>
  /** Where the chains end: needed to give the last bones a length. */
  tips: { headTop: V3; fingertipL: V3; thumbTipL: V3; toeTipL: V3; heelL: V3 }
  height: number
  /** Everything about this body is the reference body times this. */
  scale: number
}

const mirror = (p: V3): V3 => [-p[0], p[1], p[2]]

/** Joint positions of a character at rest. The female body is not a scaled male: narrower shoulders, a little more leg. */
export function skeletonOf(id: CharacterId): Skeleton {
  const f = id === 'female'
  const s = f ? 0.932 : 1
  const y = (v: number) => v * s
  const shoulderX = f ? 0.158 : 0.188
  const arm = f ? 0.915 : 1
  const hipX = f ? 0.088 : 0.092
  const shoulderY = y(1.462)
  const shoulderZ = -0.012 * s
  const along = (d: number): V3 => [shoulderX + d * arm, shoulderY, shoulderZ]
  const wrist = 0.3 + 0.264
  const L: Record<SideBone, V3> = {
    shoulder: [0.025 * s, y(1.465), 0.02 * s],
    upperArm: along(0),
    lowerArm: along(0.3),
    foreTwist: along(0.3 + 0.264 * 0.55),
    hand: along(wrist),
    fingers1: along(wrist + 0.094),
    fingers2: along(wrist + 0.14),
    fingers3: along(wrist + 0.168),
    thumb1: [shoulderX + (wrist + 0.03) * arm, shoulderY - 0.008 * arm, shoulderZ + 0.03 * arm],
    thumb2: [shoulderX + (wrist + 0.066) * arm, shoulderY - 0.011 * arm, shoulderZ + 0.056 * arm],
    upperLeg: [hipX, y(0.935), 0],
    lowerLeg: [hipX + 0.026 * s, y(0.505), 0.005 * s],
    foot: [hipX + 0.05 * s, y(0.082), -0.012 * s],
    toes: [hipX + 0.058 * s, y(0.022), 0.112 * s],
  }
  const centre: Record<CentreBone, V3> = {
    hips: [0, y(0.985), -0.005 * s],
    spine: [0, y(1.065), -0.01 * s],
    chest: [0, y(1.19), -0.012 * s],
    upperChest: [0, y(1.32), -0.014 * s],
    neck: [0, y(1.505), -0.014 * s],
    head: [0, y(1.598), -0.002 * s],
  }
  const joints = { ...centre } as Record<BoneName, V3>
  for (const b of SIDE_BONES) {
    joints[`${b}L`] = L[b]
    joints[`${b}R`] = mirror(L[b])
  }
  return {
    joints,
    tips: {
      headTop: [0, y(1.8), 0.01 * s],
      fingertipL: along(wrist + 0.192),
      thumbTipL: [shoulderX + (wrist + 0.094) * arm, shoulderY - 0.012 * arm, shoulderZ + 0.072 * arm],
      toeTipL: [hipX + 0.062 * s, y(0.014), 0.192 * s],
      heelL: [hipX + 0.048 * s, y(0.0), -0.062 * s],
    },
    height: y(1.8),
    scale: s,
  }
}
