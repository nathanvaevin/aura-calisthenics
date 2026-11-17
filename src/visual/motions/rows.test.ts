import { describe, expect, it } from 'vitest'
import { exerciseById } from '@/domain/catalog'
import { ROWS, benchDip, dip, feetElevatedRow, horizontalRow, inclineRow, negativeDip } from './rows'
import { deg, expectSound, highest, lowest, sample, type Frames } from './testkit'
import type { Prop } from './types'

const SIDE = ['L', 'R'] as const
const elbow = (x: Frames[number], s: 'L' | 'R') => x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)
const knee = (x: Frames[number], s: 'L' | 'R') => x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)
/** Angle of the body above the floor, heels to shoulders, in degrees. */
const incline = (x: Frames[number]) => { const v = x.mid('upperArm').sub(x.mid('foot')); return Math.atan2(v.y, Math.hypot(v.x, v.z)) * deg }
const prop = <K extends Prop['kind']>(list: Prop[], kind: K) => list.find((p) => p.kind === kind) as Extract<Prop, { kind: K }>

describe.each(['male', 'female'] as const)('rows and dips, %s character', (who) => {
  const frames = Object.fromEntries(ROWS.map((m) => [m.id, sample(m, who)]))

  it('is six exercises of the library, each sound', () => {
    expect(ROWS.map((m) => m.id)).toEqual(['incline-row', 'horizontal-row', 'feet-elevated-row', 'bench-dip', 'negative-dip', 'dip'])
    for (const m of ROWS) {
      expect(exerciseById[m.id], m.id).toBeDefined()
      expectSound(m, frames[m.id])
    }
  })

  it.each([inclineRow, horizontalRow, feetElevatedRow])('$id: a straight body, straight arms at the bottom, chest to the bar at the top', (m) => {
    const f = frames[m.id]
    const bar = prop(m.props!(f[0].body), 'bar')
    for (const x of f) {
      expect(x.line()).toBeGreaterThan(171)
      for (const s of SIDE) expect(knee(x, s)).toBeGreaterThan(172)
      // The hands are on the bar: the wrist a hand's length from its centre.
      for (const s of SIDE) expect(Math.hypot(x.at(`hand${s}`).y - bar.height, x.at(`hand${s}`).z - bar.z!)).toBeLessThan(0.11 * x.s)
    }
    const hang = lowest(f, (x) => x.mid('upperArm').y), top = highest(f, (x) => x.mid('upperArm').y)
    for (const s of SIDE) expect(elbow(hang, s)).toBeGreaterThan(170)
    // At the top the bar is a chest's depth in front of the spine: touching, not through.
    const spine = top.at('upperChest'), up = top.at('neck').sub(spine).normalize()
    const off = new (spine.constructor as typeof import('three').Vector3)(0, bar.height, bar.z!).sub(spine)
    const away = off.clone().addScaledVector(up, -off.dot(up)).length()
    expect(away).toBeGreaterThan(0.1 * top.s)
    expect(away).toBeLessThan(0.17 * top.s)
    expect(elbow(top, 'L')).toBeLessThan(70)
    // Elbows about 45 degrees from the ribs: neither tucked in nor flared straight out.
    const arm = top.at('lowerArmL').sub(top.at('upperArmL'))
    const down = top.mid('upperLeg').sub(top.mid('upperArm')).normalize()
    const flare = Math.acos(Math.abs(arm.clone().setX(0).normalize().dot(down)) * Math.hypot(arm.y, arm.z) / arm.length()) * deg
    expect(flare).toBeGreaterThan(20)
    expect(flare).toBeLessThan(70)
    expect(top.at('upperArmL').y - hang.at('upperArmL').y).toBeGreaterThan(0.25 * top.s)
  })

  it('incline row: an easy angle, feet on the floor', () => {
    const f = frames['incline-row']
    const angles = f.map(incline)
    expect(Math.min(...angles)).toBeGreaterThan(22)
    expect(Math.max(...angles)).toBeLessThan(60)
    expect(f[0].at('footL').y).toBeLessThan(0.11 * f[0].s)
  })

  it('horizontal row: near level at the bottom, hips off the floor', () => {
    const f = frames['horizontal-row']
    const hang = lowest(f, (x) => x.mid('upperArm').y)
    expect(incline(hang)).toBeLessThan(13)
    // The seat is about 12 cm behind the hip joints.
    expect(hang.at('upperLegL').y).toBeGreaterThan(0.135 * hang.s)
    expect(hang.crown.y).toBeGreaterThan(0.1 * hang.s)
  })

  it('feet-elevated row: level at the top, feet at the height of the hands, head clear of the floor', () => {
    const f = frames['feet-elevated-row']
    const top = highest(f, (x) => x.mid('upperArm').y), hang = lowest(f, (x) => x.mid('upperArm').y)
    expect(Math.abs(incline(top))).toBeLessThan(4)
    expect(Math.abs(top.at('footL').y - top.at('handL').y)).toBeLessThan(0.12 * top.s)
    const box = prop(feetElevatedRow.props!(top.body), 'box')
    expect(top.at('footL').y).toBeGreaterThan(box.height)
    expect(top.at('footL').y - box.height).toBeLessThan(0.11 * top.s)
    expect(hang.crown.y).toBeGreaterThan(0.12 * hang.s)
    expect(hang.at('upperArmL').y).toBeGreaterThan(0.2 * hang.s)
  })

  it('bench dip: hands on the bench, hips close to it, elbows to a right angle and back to lockout', () => {
    const f = frames['bench-dip']
    const bench = prop(benchDip.props!(f[0].body), 'box')
    const top = f[0], low = lowest(f, (x) => x.mid('upperArm').y)
    for (const s of SIDE) {
      expect(elbow(top, s)).toBeGreaterThan(170)
      expect(elbow(low, s)).toBeGreaterThan(84)
      expect(elbow(low, s)).toBeLessThan(96)
    }
    for (const x of f) {
      // Wrists just above the top of the bench and just behind its edge.
      expect(x.at('handL').y - bench.height).toBeGreaterThan(0)
      expect(x.at('handL').y - bench.height).toBeLessThan(0.04 * x.s)
      expect(x.at('handL').z).toBeLessThan(0)
      // The seat (about 12 cm behind the hip joints) is in front of the edge, and never far from it.
      expect(x.at('upperLegL').z).toBeGreaterThan(0.13 * x.s)
      expect(x.at('upperLegL').z).toBeLessThan(0.27 * x.s)
      // Elbows point back, over the bench, and stay higher than it.
      expect(x.at('lowerArmL').z).toBeLessThan(x.at('upperArmL').z + 0.02)
      expect(Math.abs(x.at('lowerArmL').x - x.at('upperArmL').x)).toBeLessThan(0.1 * x.s)
      expect(x.at('lowerArmL').y).toBeGreaterThan(bench.height)
      for (const s of SIDE) expect(knee(x, s)).toBeGreaterThan(172)
      expect(x.at('hips').y).toBeGreaterThan(0.2 * x.s)
      expect(x.lean('hips', 'upperChest')).toBeLessThan(14)
    }
    expect(top.at('upperArmL').y - low.at('upperArmL').y).toBeGreaterThan(0.1 * top.s)
  })

  it.each([dip, negativeDip])('$id: locked out at the top, shoulders below the elbows at the bottom, elbows back', (m) => {
    const f = frames[m.id]
    const rails = prop(m.props!(f[0].body), 'rails')
    const top = f[0], low = lowest(f, (x) => x.mid('upperArm').y)
    for (const s of SIDE) {
      expect(elbow(top, s)).toBeGreaterThan(170)
      expect(low.at(`upperArm${s}`).y).toBeLessThan(low.at(`lowerArm${s}`).y - 0.005)
      // Elbows behind the shoulders and close to the line of the rails.
      expect(low.at(`lowerArm${s}`).z).toBeLessThan(low.at(`upperArm${s}`).z - 0.1 * low.s)
      expect(Math.abs(low.at(`lowerArm${s}`).x) - rails.gap / 2).toBeLessThan(0.06 * low.s)
    }
    for (const x of f) {
      // The wrists stay above the rails, over them.
      expect(x.at('handL').y).toBeGreaterThan(rails.height)
      expect(x.at('handL').y - rails.height).toBeLessThan(0.11 * x.s)
      expect(Math.abs(x.at('handL').x - rails.gap / 2)).toBeLessThan(0.07 * x.s)
      // The chest a little forward, never upright past vertical nor folded over.
      expect(x.lean('hips', 'upperChest')).toBeLessThan(32)
      expect(x.mid('upperArm').z).toBeGreaterThan(x.at('hips').z - 0.02)
    }
  })

  it('dip: the feet stay clear of the floor and the legs do not swing', () => {
    const f = frames.dip
    for (const x of f) {
      expect(x.at('toesL').y).toBeGreaterThan(0.05)
      for (const s of SIDE) expect(knee(x, s)).toBeGreaterThan(172)
    }
    const swing = f.map((x) => x.at('footL').z - x.at('hips').z)
    expect(Math.max(...swing) - Math.min(...swing)).toBeLessThan(0.12 * f[0].s)
  })

  it('negative dip: at least five seconds down, evenly; the way up is on the step', () => {
    const f = frames['negative-dip']
    const top = f[0].mid('upperArm').y, low = Math.min(...f.map((x) => x.mid('upperArm').y))
    const span = top - low
    const lowering = f.filter((x, i) => i > 0 && x.mid('upperArm').y < f[i - 1].mid('upperArm').y - 1e-5)
    expect((lowering.length / f.length) * negativeDip.period).toBeGreaterThanOrEqual(5)
    // No dropping through the bottom: no step of the descent is more than twice the average one.
    const steps = lowering.map((x) => f[f.indexOf(x) - 1].mid('upperArm').y - x.mid('upperArm').y)
    expect(Math.max(...steps)).toBeLessThan((2 * span) / lowering.length)
    // Feet off the step all the way down, on it all the way up.
    const step = prop(negativeDip.props!(f[0].body), 'box')
    for (const x of lowering.slice(2, -1)) expect(x.at('footL').y - x.body.ankle).toBeGreaterThan(step.height + 0.05)
    const rising = f.filter((x, i) => i > 0 && x.mid('upperArm').y > f[i - 1].mid('upperArm').y + 1e-4)
    expect(rising.length).toBeGreaterThan(2)
    for (const x of rising) expect(Math.abs(x.at('footL').y - x.body.ankle - step.height)).toBeLessThan(0.004)
    expect(negativeDip.effort(0.9)).toBeLessThan(negativeDip.effort(0.5))
  })
})
