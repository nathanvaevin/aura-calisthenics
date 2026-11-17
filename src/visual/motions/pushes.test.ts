import { describe, expect, it } from 'vitest'
import { exerciseById } from '@/domain/catalog'
import { bodyOf } from '../rig'
import { wristHeight } from './kit'
import { PUSHES } from './pushes'
import { expectSound, highest, lowest, sample, type Frames } from './testkit'
import type { Prop } from './types'

const byId = Object.fromEntries(PUSHES.map((m) => [m.id, m]))
const shoulderY = (x: Frames[number]) => x.mid('upperArm').y
/** Wrists to shoulders, through the middle of the body. */
const gap = (x: Frames[number]) => x.mid('upperArm').distanceTo(x.mid('hand'))
const elbow = (x: Frames[number], side: 'L' | 'R' = 'L') => x.angle(`upperArm${side}`, `lowerArm${side}`, `hand${side}`)

describe('the push family as a set', () => {
  it('is the ten pushing variations of the assessment, easiest first, each an exercise of the library', () => {
    expect(PUSHES.map((m) => m.id)).toEqual([
      'wall-pushup', 'incline-pushup', 'low-incline-pushup', 'knee-pushup', 'diamond-pushup', 'decline-pushup', 'archer-pushup', 'pseudo-planche-pushup', 'elevated-pike-pushup', 'wall-hspu',
    ])
    for (const m of PUSHES) {
      expect(exerciseById[m.id], m.id).toBeDefined()
      expect(m.kind).toBe('reps')
      // Equipment in the library means equipment on the stage.
      const needs = exerciseById[m.id].equipment.some((e) => e === 'box' || e === 'wall')
      expect(!!m.props, m.id).toBe(needs)
    }
  })
})

describe.each(['male', 'female'] as const)('the push family, %s character', (who) => {
  const body = bodyOf(who)
  const s = body.scale
  const f = Object.fromEntries(PUSHES.map((m) => [m.id, sample(m, who)])) as Record<string, Frames>
  const prop = <K extends Prop['kind']>(id: string, kind: K) => byId[id].props!(body).find((p) => p.kind === kind) as Extract<Prop, { kind: K }>

  it.each(PUSHES.map((m) => m.id))('%s: sound', (id) => expectSound(byId[id], f[id]))

  it.each(['incline-pushup', 'low-incline-pushup', 'diamond-pushup', 'decline-pushup', 'pseudo-planche-pushup'])('%s: a straight body that locks out at the top', (id) => {
    for (const x of f[id]) expect(x.line()).toBeGreaterThan(173)
    expect(elbow(f[id][0])).toBeGreaterThan(168)
    expect(elbow(f[id][0], 'R')).toBeGreaterThan(168)
  })

  it('wall push-up: feet flat, a straight body, hands at chest height, nose to the wall', () => {
    const w = f['wall-pushup']
    const wall = prop('wall-pushup', 'wall').z
    for (const x of w) {
      expect(x.line()).toBeGreaterThan(174)
      expect(x.at('footL').y).toBeCloseTo(body.ankle, 4)
      // Palms on the wall, not in it.
      expect(x.at('handL').z).toBeCloseTo(wall - wristHeight(body), 3)
    }
    expect(elbow(w[0])).toBeGreaterThan(168)
    const below = shoulderY(w[0]) - w[0].at('handL').y
    expect(below).toBeGreaterThan(0.05 * s)
    expect(below).toBeLessThan(0.2 * s)
    const near = highest(w, (x) => x.at('head').z)
    // The nose is a hand's breadth in front of the joint the head turns on.
    expect(near.at('head').z).toBeGreaterThan(wall - 0.2 * s)
    expect(near.at('head').z).toBeLessThan(wall - 0.09 * s)
    expect(elbow(near)).toBeLessThan(110)
  })

  it.each([['incline-pushup', 'upperLegL', 0.82, 1.02], ['low-incline-pushup', 'lowerLegL', 0.85, 1.1]] as const)('%s: hands on the bench, chest to its edge', (id, joint, least, most) => {
    const box = prop(id, 'box')
    // About hip height for the high one, about knee height for the low one.
    expect(box.height).toBeGreaterThan(body.rest[joint].y * least)
    expect(box.height).toBeLessThan(body.rest[joint].y * most)
    for (const x of f[id]) expect(x.at('handL').y).toBeCloseTo(box.height + wristHeight(body), 3)
    // The heels of the hands are on the bench, just inside its edge.
    const edge = box.z - box.depth / 2
    expect(f[id][0].at('handL').z).toBeGreaterThan(edge)
    expect(f[id][0].at('handL').z).toBeLessThan(edge + 0.08)
    const low = lowest(f[id], gap)
    expect(gap(low)).toBeLessThan(0.25 * s)
    expect(shoulderY(low)).toBeGreaterThan(box.height + 0.08 * s)
    expect(elbow(low)).toBeLessThan(100)
  })

  it('knee push-up: knees down, a straight line from knees to shoulders, chest to the floor', () => {
    const k = f['knee-pushup']
    for (const x of k) {
      expect(x.at('lowerLegL').y).toBeLessThan(0.07 * s)
      const hip = x.mid('upperLeg')
      expect(x.mid('upperArm').sub(hip).angleTo(x.mid('lowerLeg').sub(hip)) * (180 / Math.PI)).toBeGreaterThan(173)
    }
    expect(elbow(k[0])).toBeGreaterThan(168)
    const low = lowest(k, shoulderY)
    expect(shoulderY(low)).toBeLessThan(0.23 * s)
    expect(elbow(low)).toBeLessThan(100)
  })

  it('diamond push-up: hands together, elbows by the ribs, chest onto the hands', () => {
    const d = f['diamond-pushup']
    expect(d[0].at('handL').x).toBeLessThan(0.1 * s)
    expect(d[0].at('handL').x).toBeGreaterThan(0.04 * s)
    const low = lowest(d, shoulderY)
    expect(shoulderY(low)).toBeLessThan(0.24 * s)
    // Back along the ribs, not out to the side.
    expect(low.at('lowerArmL').x - low.at('upperArmL').x).toBeLessThan(0.1 * s)
    expect(low.at('lowerArmL').z).toBeLessThan(low.at('upperArmL').z)
  })

  it('decline push-up: feet on a box at knee height, chest to the floor', () => {
    const d = f['decline-pushup']
    const box = prop('decline-pushup', 'box')
    expect(box.height).toBeGreaterThan(body.rest.lowerLegL.y * 0.85)
    expect(box.height).toBeLessThan(body.rest.lowerLegL.y * 1.2)
    for (const x of d) {
      expect(x.at('toesL').y).toBeCloseTo(box.height + 0.014, 3)
      expect(Math.abs(x.at('toesL').z - box.z)).toBeLessThan(box.depth / 2)
    }
    const low = lowest(d, shoulderY)
    expect(shoulderY(low)).toBeLessThan(0.23 * s)
    // Head lower than the feet at the bottom: that is what makes it a decline.
    expect(low.at('head').y).toBeLessThan(low.at('footL').y)
  })

  it('archer push-up: the assisting arm stays straight while the chest goes to the working hand', () => {
    const a = f['archer-pushup']
    for (const x of a) {
      expect(elbow(x, 'R')).toBeGreaterThan(168)
      expect(x.line()).toBeGreaterThan(172)
      // Hips square to the floor.
      expect(Math.abs(x.at('upperLegL').y - x.at('upperLegR').y)).toBeLessThan(0.01)
    }
    expect(elbow(a[0])).toBeGreaterThan(165)
    expect(Math.abs(a[0].mid('upperArm').x)).toBeLessThan(0.01)
    const low = lowest(a, shoulderY)
    expect(shoulderY(low)).toBeLessThan(0.25 * s)
    expect(low.mid('upperArm').x).toBeGreaterThan(0.14 * s)
    expect(low.at('handL').x - low.at('upperArmL').x).toBeLessThan(0.16 * s)
    expect(elbow(low)).toBeLessThan(95)
  })

  it('pseudo planche push-up: hands by the waist and the lean held all the way', () => {
    const p = f['pseudo-planche-pushup']
    for (const x of p) expect(x.mid('upperArm').z - x.mid('hand').z).toBeGreaterThan(0.22 * s)
    // Nearer the hips than the shoulders.
    expect(p[0].mid('hand').z - p[0].mid('upperLeg').z).toBeLessThan(p[0].mid('upperArm').z - p[0].mid('hand').z)
    const low = lowest(p, shoulderY)
    expect(shoulderY(low)).toBeLessThan(0.27 * s)
    expect(low.mid('upperArm').z - low.mid('hand').z).toBeGreaterThanOrEqual(p[0].mid('upperArm').z - p[0].mid('hand').z)
  })

  it('elevated pike push-up: feet at hip height, hips over the shoulders, head in front of the hands', () => {
    const e = f['elevated-pike-pushup']
    const box = prop('elevated-pike-pushup', 'box')
    expect(box.height).toBeGreaterThan(body.rest.upperLegL.y * 0.85)
    expect(box.height).toBeLessThan(body.rest.upperLegL.y * 1.05)
    for (const x of e) {
      expect(x.at('toesL').y).toBeCloseTo(box.height + 0.014 * s, 3)
      expect(Math.abs(x.at('toesL').z - box.z)).toBeLessThan(box.depth / 2)
      expect(x.at('hips').y).toBeGreaterThan(shoulderY(x) + 0.3 * s)
      expect(x.angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(172)
    }
    expect(elbow(e[0])).toBeGreaterThan(165)
    // Close to upright at the top: the hips are nearly over the shoulders.
    expect(e[0].lean('upperArmL', 'upperLegL')).toBeLessThan(25)
    const low = lowest(e, (x) => x.crown.y)
    expect(low.crown.y).toBeLessThan(0.1 * s)
    expect(low.crown.z).toBeGreaterThan(low.at('handL').z)
  })

  it('wall handstand push-up: heels on the wall, head to the floor in front of the hands, locked out at the top', () => {
    const h = f['wall-hspu']
    const wall = prop('wall-hspu', 'wall').z
    for (const x of h) {
      expect(x.at('footL').z).toBeLessThan(wall - 0.06 * s)
      expect(x.at('footL').z).toBeGreaterThan(wall - 0.14 * s)
      expect(x.crown.z).toBeLessThan(wall - 0.1 * s)
      expect(x.line()).toBeGreaterThan(172)
      expect(x.at('footL').y).toBeGreaterThan(x.at('hips').y)
    }
    expect(elbow(h[0])).toBeGreaterThan(172)
    const low = lowest(h, (x) => x.crown.y)
    expect(low.crown.y).toBeLessThan(0.06 * s)
    expect(low.crown.z).toBeGreaterThan(low.at('handL').z + 0.1 * s)
    expect(elbow(low)).toBeLessThan(110)
  })
})
