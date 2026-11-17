/**
 * What the movement tests are written with. A movement is sampled through
 * one cycle for one character; every joint at every moment is kept, so a
 * test can ask where anything was.
 */
import { expect } from 'vitest'
import { Vector3 } from 'three'
import { BONES, type BoneName, type CharacterId } from '../body/skeleton'
import { emptyPose, Rig } from '../rig'
import type { Motion } from './types'

export const STEPS = 48
export const deg = 180 / Math.PI
export const SIDES = ['L', 'R'] as const
export const both = (name: string) => SIDES.map((s) => `${name}${s}` as BoneName)

export function sample(m: Motion, who: CharacterId) {
  const rig = new Rig(who)
  const pose = emptyPose()
  return Array.from({ length: STEPS }, (_, i) => {
    const t = i / STEPS
    m.pose(t, rig, pose)
    rig.solve(pose)
    const snap = Object.fromEntries(BONES.map((b) => [b, rig.pos[b].clone()])) as Record<BoneName, Vector3>
    const at = (b: BoneName) => snap[b].clone()
    const mid = (n: string) => at(`${n}L` as BoneName).add(at(`${n}R` as BoneName)).multiplyScalar(0.5)
    return {
      t, s: rig.body.scale, body: rig.body, at, mid,
      asked: { handL: pose.arm.L.hand.clone(), handR: pose.arm.R.hand.clone(), footL: pose.leg.L.foot.clone(), footR: pose.leg.R.foot.clone() },
      /** The top of the head. */
      crown: at('head').add(new Vector3(0, rig.body.height - rig.body.rest.head.y, 0).applyQuaternion(rig.rot.head)),
      /** The angle at joint b between a and c, in degrees: 180 is straight. */
      angle: (a: BoneName, b: BoneName, c: BoneName) => at(a).sub(at(b)).angleTo(at(c).sub(at(b))) * deg,
      /** Shoulders, hips, ankles through the middle of the body: 180 is a straight line. */
      line: () => mid('upperArm').sub(mid('upperLeg')).angleTo(mid('foot').sub(mid('upperLeg'))) * deg,
      /** How far a direction between two joints is from vertical, in degrees. */
      lean: (from: BoneName, to: BoneName) => { const v = at(to).sub(at(from)); return Math.atan2(Math.hypot(v.x, v.z), v.y) * deg },
    }
  })
}

export type Frames = ReturnType<typeof sample>

/** The furthest a joint strays from where it started. */
export const drift = (points: Vector3[]) => Math.max(...points.map((p) => p.distanceTo(points[0])))

/** The frame at which something is lowest or highest. */
export const lowest = (f: Frames, of: (x: Frames[number]) => number) => f.reduce((a, b) => (of(b) < of(a) ? b : a))
export const highest = (f: Frames, of: (x: Frames[number]) => number) => f.reduce((a, b) => (of(b) > of(a) ? b : a))

/**
 * What every movement must satisfy, whatever it is: the skeleton is whole,
 * nothing is under the floor, hands and feet reached where they were put, no
 * elbow or knee folds further than a real one, and what the movement says is
 * planted does not move.
 */
export function expectSound(m: Motion, f: Frames) {
  for (const x of f) {
    for (const b of ['hips', 'head', ...both('hand'), ...both('foot'), ...both('lowerArm'), ...both('lowerLeg'), ...both('toes')] as BoneName[]) {
      const p = x.at(b)
      expect(Number.isFinite(p.x + p.y + p.z), `${m.id} ${b} at ${x.t}`).toBe(true)
      expect(p.y, `${m.id} ${b} under the floor at ${x.t}`).toBeGreaterThan(-0.004)
    }
    for (const s of SIDES) {
      expect(x.at(`hand${s}`).distanceTo(x.asked[`hand${s}`]), `${m.id} hand${s} out of reach at ${x.t}`).toBeLessThan(0.003)
      expect(x.at(`foot${s}`).distanceTo(x.asked[`foot${s}`]), `${m.id} foot${s} out of reach at ${x.t}`).toBeLessThan(0.003)
      expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`), `${m.id} elbow${s} at ${x.t}`).toBeGreaterThan(28)
      expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`), `${m.id} knee${s} at ${x.t}`).toBeGreaterThan(22)
    }
  }
  for (const b of m.planted ?? []) expect(drift(f.map((x) => x.at(b))), `${m.id} ${b} is meant to be planted`).toBeLessThan(0.004)
  expect(m.standard.length, m.id).toBeGreaterThan(20)
  expect(m.revision).toBeGreaterThanOrEqual(1)
  if (m.kind === 'reps') expect(m.beat, `${m.id} needs the moment a repetition counts`).toBeDefined()
  for (let i = 0; i <= 20; i++) { const e = m.effort(i / 20); expect(e).toBeGreaterThanOrEqual(0); expect(e).toBeLessThanOrEqual(1) }
}
