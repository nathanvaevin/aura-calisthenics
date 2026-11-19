import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import type { BoneName } from '../body/skeleton'
import { exerciseById } from '@/domain/catalog'
import { parallettes } from './floor'
import { wristHeight } from './kit'
import { squatBox } from './legs'
import {
  TRUNK, abWheelStanding, advShrimp, archHold, boxPistol, dragonFlag, dragonFlagNegative, flagBench, manna, nordicCurl, vSit,
} from './trunk'
import { STEPS, deg, expectSound, highest, lowest, sample, type Frames } from './testkit'

type Frame = Frames[number]
const SIDE = ['L', 'R'] as const

/** Roughly where the body's weight is, as the leg tests reckon it. */
function weight(x: Frame): Vector3 {
  const mid = (a: BoneName, b: BoneName) => x.at(a).add(x.at(b)).multiplyScalar(0.5)
  const out = x.mid('upperArm').add(x.mid('upperLeg')).multiplyScalar(0.5 * 0.58)
  for (const s of SIDE) {
    out.addScaledVector(x.at(`lowerArm${s}`), 0.05)
    out.addScaledVector(mid(`upperLeg${s}`, `lowerLeg${s}`), 0.1)
    out.addScaledVector(mid(`lowerLeg${s}`, `foot${s}`), 0.06)
  }
  return out
}

const heelDown = (x: Frame) => {
  expect(Math.abs(x.at('footL').y - x.body.ankle)).toBeLessThan(0.002)
  expect(Math.abs(x.at('toesL').y - x.at('footL').y - x.body.ball.y)).toBeLessThan(0.004)
}

/** The weight over the standing (left) foot: between heel and toes, not off to one side. */
function expectOverFoot(x: Frame) {
  const w = weight(x)
  expect(w.z, 'weight behind the heel').toBeGreaterThan(x.at('footL').z - 0.05 * x.s)
  expect(w.z, 'weight past the toes').toBeLessThan(x.at('toesL').z + 0.07 * x.s)
  expect(Math.abs(w.x - x.at('footL').x), 'weight to one side of the foot').toBeLessThan(0.07 * x.s)
}

const locked = (x: Frame, min = 170) => { for (const s of SIDE) expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(min) }
const straight = (x: Frame, min = 172) => { for (const s of SIDE) expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(min) }
/** Seen from the side, the angle at b between a and c: the width of the shoulders against the hips is not a bend. */
const sideAngle = (a: Vector3, b: Vector3, c: Vector3) => a.clone().setX(0).sub(b.clone().setX(0)).angleTo(c.clone().setX(0).sub(b.clone().setX(0))) * deg
/** How far a direction rises above the floor, in degrees. */
const elevation = (v: Vector3) => Math.atan2(v.y, Math.hypot(v.x, v.z)) * deg
/** The angle of the body's line (shoulders to ankles) above the bench, degrees. */
const flagRise = (x: Frame) => elevation(x.mid('foot').sub(x.mid('upperArm')))

describe.each(['male', 'female'] as const)('trunk and leg work, %s character', (who) => {
  const frames = Object.fromEntries(TRUNK.map((m) => [m.id, sample(m, who)])) as Record<string, Frames>

  it.each(TRUNK.map((m) => m.id))('%s: sound', (id) => {
    expectSound(TRUNK.find((m) => m.id === id)!, frames[id])
  })

  it('arch hold: chest and thighs off the floor, arms long by the ears, legs straight and together, head in line', () => {
    for (const x of frames[archHold.id]) {
      // Lying on the front: the pelvis is what stays down.
      expect(x.at('hips').y).toBeLessThan(0.13 * x.s)
      expect(x.mid('upperArm').y).toBeGreaterThan(0.2 * x.s)
      expect(x.at('neck').y).toBeGreaterThan(0.18 * x.s)
      // The thighs are lifted: the knees clear the floor, the legs behind, straight and together.
      for (const s of SIDE) {
        expect(x.at(`lowerLeg${s}`).y).toBeGreaterThan(0.1 * x.s)
        expect(x.at(`lowerLeg${s}`).z).toBeLessThan(x.at('hips').z)
      }
      straight(x, 170)
      expect(Math.abs(x.at('footL').x - x.at('footR').x)).toBeLessThan(0.25 * x.s)
      // Arms long, reaching past the head, the hands higher than the shoulders.
      locked(x, 165)
      expect(x.mid('hand').z).toBeGreaterThan(x.crown.z)
      expect(x.mid('hand').y).toBeGreaterThan(x.mid('upperArm').y)
      // The lift comes from the upper back: the neck is not cranked back.
      expect(x.angle('upperChest', 'neck', 'head')).toBeGreaterThan(160)
    }
  })

  it('standing rollout: from the feet out to a long hollow line just above the floor and back, arms locked, knees never down', () => {
    const f = frames[abWheelStanding.id]
    const out = highest(f, (x) => x.mid('hand').z)
    // Long and low: shoulders a hand or two off the floor, on one line with the hips and ankles.
    expect(out.mid('upperArm').y).toBeLessThan(0.26 * out.s)
    expect(out.mid('upperArm').y).toBeGreaterThan(0.14 * out.s)
    expect(out.line()).toBeGreaterThan(172)
    expect(out.mid('hand').z).toBeGreaterThan(out.mid('upperArm').z + 0.45 * out.s)
    // It starts folded at the hips with the wheel near the feet and the legs straight under the hips.
    const start = f[0]
    expect(start.mid('hand').z - start.mid('toes').z).toBeLessThan(0.3 * start.s)
    expect(start.mid('upperLeg').y).toBeGreaterThan(0.75 * start.s)
    expect(start.lean('footL', 'upperLegL')).toBeLessThan(12)
    expect(out.mid('hand').z - start.mid('hand').z).toBeGreaterThan(1.1 * out.s)
    const wheel = abWheelStanding.props!(out.body)[0]
    for (const x of f) {
      locked(x, 168)
      straight(x, 170)
      // The knees never touch, and the feet stay on their balls.
      for (const s of SIDE) expect(x.at(`lowerLeg${s}`).y).toBeGreaterThan(0.12 * x.s)
      if (wheel.kind === 'wheel') expect(Math.abs(x.at('handL').y - wheel.radius - 0.034 * x.s)).toBeLessThan(0.002)
      // Hollow, never sagging: the hips are never below the line from ankles to shoulders.
      const ankle = x.mid('foot'), sh = x.mid('upperArm'), hip = x.mid('upperLeg')
      const onLine = ankle.y + ((sh.y - ankle.y) * (hip.z - ankle.z)) / (sh.z - ankle.z)
      expect(hip.y).toBeGreaterThan(onLine - 0.01)
    }
  })

  it.each([[dragonFlagNegative.id], [dragonFlag.id]])('%s: one straight line from shoulders to ankles, turning on the shoulders, to just above the bench', (id) => {
    const f = frames[id]
    const bench = flagBench(f[0].body)
    const m = TRUNK.find((x) => x.id === id)!
    // Only the straight-body part of the cycle: the negative's reset is tucked on purpose.
    const lowering = id === dragonFlag.id ? f : f.filter((x) => x.t < 0.69)
    for (const x of lowering) {
      expect(x.line(), `pike at ${x.t}`).toBeGreaterThan(176)
      straight(x, 175)
    }
    const low = lowest(f, flagRise)
    const top = highest(f, flagRise)
    expect(flagRise(top)).toBeGreaterThan(80)
    expect(flagRise(low)).toBeGreaterThan(5)
    expect(flagRise(low)).toBeLessThan(14)
    for (const x of f) {
      // The upper back and shoulders are on the bench; the hips never come down onto it.
      expect(x.mid('upperArm').y - bench.height).toBeLessThan(0.12 * x.s)
      expect(x.mid('upperArm').y - bench.height).toBeGreaterThan(0.07 * x.s)
      expect(x.mid('upperLeg').y - bench.height).toBeGreaterThan(0.15 * x.s)
      for (const b of ['hips', 'lowerLegL', 'lowerLegR', 'footL', 'footR', 'toesL', 'toesR'] as BoneName[]) expect(x.at(b).y).toBeGreaterThan(bench.height + 0.05 * x.s)
      // The head rests on the bench, not in it.
      expect(x.at('head').y).toBeGreaterThan(bench.height + 0.05 * x.s)
      expect(x.crown.z).toBeGreaterThan(bench.z - bench.depth / 2)
      // The hands hold the end of the bench behind the head.
      for (const s of SIDE) {
        expect(x.at(`hand${s}`).z).toBeLessThan(x.at('head').z)
        expect(Math.abs(x.at(`hand${s}`).y - bench.height - wristHeight(x.body))).toBeLessThan(0.003)
      }
    }
    if (id === dragonFlagNegative.id) {
      // The lowering takes at least five seconds, evenly: from leaving the top to arriving at the bottom.
      const down = f.filter((x) => x.t < low.t && flagRise(x) < flagRise(top) - 2)
      expect((down.length / STEPS) * m.period).toBeGreaterThan(5)
      // The reset is tucked: the knees bend on the way back up.
      expect(Math.min(...f.filter((x) => x.t > 0.7).map((x) => x.angle('upperLegL', 'lowerLegL', 'footL')))).toBeLessThan(90)
    } else {
      // Down and up again with the body straight, and a pause just above the bench rather than a rest on it.
      const pause = f.filter((x) => flagRise(x) < flagRise(low) + 1.5)
      expect((pause.length / STEPS) * m.period).toBeGreaterThan(0.4)
    }
  })

  it('V-sit: arms locked, shoulders down, hips forward between the hands, straight legs at least 45° above level', () => {
    const rail = vSit.props!(frames[vSit.id][0].body)[0]
    if (rail.kind !== 'rails') throw new Error('expected parallettes')
    for (const x of frames[vSit.id]) {
      locked(x, 171)
      straight(x, 174)
      const legs = x.mid('foot').sub(x.mid('upperLeg'))
      expect(elevation(legs)).toBeGreaterThan(50)
      expect(legs.z).toBeGreaterThan(0)
      expect(Math.abs(x.at('footL').x - x.at('footR').x)).toBeLessThan(0.25 * x.s)
      // Hips off the floor and pushed through, at or just ahead of the hands; the trunk leans back only a little.
      expect(Math.min(x.at('hips').y, x.mid('upperLeg').y)).toBeGreaterThan(rail.height)
      expect(x.mid('upperLeg').z).toBeGreaterThan(x.at('handL').z - 0.02 * x.s)
      expect(x.mid('upperLeg').z).toBeLessThan(x.at('handL').z + 0.15 * x.s)
      expect(x.lean('hips', 'upperChest')).toBeLessThan(35)
      // On the rails, pushed down through them: the shoulders well above the hands.
      expect(Math.abs(Math.abs(x.at('handL').x) - rail.gap / 2)).toBeLessThan(0.05 * x.s)
      expect(x.at('handL').y - rail.height).toBeGreaterThan(0.02 * x.s)
      expect(x.at('handL').y - rail.height).toBeLessThan(0.07 * x.s)
      expect(x.mid('upperArm').y - x.at('handL').y).toBeGreaterThan(0.48 * x.s)
      // Balanced over the hands.
      expect(Math.abs(weight(x).z - x.at('handL').z)).toBeLessThan(0.12 * x.s)
    }
  })

  it('manna: arms locked behind, hips pressed forward and up past the hands, legs straight and level with the feet behind the head', () => {
    for (const x of frames[manna.id]) {
      locked(x, 170)
      straight(x, 174)
      for (const s of SIDE) expect(Math.abs(x.at(`hand${s}`).y - wristHeight(x.body))).toBeLessThan(0.002)
      // Shoulders behind the hands, hips past them and higher than the shoulders.
      expect(x.mid('upperArm').z).toBeLessThan(x.at('handL').z - 0.08 * x.s)
      expect(x.mid('upperLeg').z).toBeGreaterThan(x.at('handL').z + 0.1 * x.s)
      expect(x.mid('upperLeg').y).toBeGreaterThan(x.mid('upperArm').y + 0.15 * x.s)
      // Legs level or higher, pointing back over the head, the feet beyond it.
      const legs = x.mid('foot').sub(x.mid('upperLeg'))
      expect(legs.z).toBeLessThan(0)
      expect(elevation(legs)).toBeGreaterThan(-3)
      expect(x.mid('foot').z).toBeLessThan(x.crown.z)
      expect(Math.abs(x.at('footL').x - x.at('footR').x)).toBeLessThan(0.25 * x.s)
      // Held, not falling: the weight is over the hands.
      expect(Math.abs(weight(x).z - x.at('handL').z)).toBeLessThan(0.08 * x.s)
    }
  })

  it('box pistol: hips touch a knee-height box lightly on one leg, heel down, knee over the foot, free leg straight and off the floor', () => {
    const f = frames[boxPistol.id]
    const box = squatBox(f[0].body)
    const low = lowest(f, (x) => x.at('upperLegL').y)
    // Sitting, the hip joints are about 9 cm above what the buttocks rest on, and over the box.
    expect(low.at('upperLegL').y - box.height).toBeGreaterThan(0.07 * low.s)
    expect(low.at('upperLegL').y - box.height).toBeLessThan(0.11 * low.s)
    expect(low.at('upperLegL').z).toBeLessThan(box.z + box.depth / 2)
    expect(box.z + box.depth / 2).toBeLessThan(low.at('footL').z - 0.1 * low.s)
    expect(f[0].angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(172)
    for (const x of f) {
      heelDown(x)
      expect(Math.abs(x.at('lowerLegL').x - x.at('footL').x)).toBeLessThan(0.07 * x.s)
      expect(x.angle('upperLegR', 'lowerLegR', 'footR')).toBeGreaterThan(172)
      expect(x.at('footR').y).toBeGreaterThan(0.1 * x.s)
      expect(x.at('toesR').y).toBeGreaterThan(0.1 * x.s)
      // A touch, not a sit: the weight stays over the standing foot.
      expectOverFoot(x)
      // No hands: they reach forward, nowhere near the box or the legs.
      expect(x.mid('hand').z).toBeGreaterThan(x.mid('upperLeg').z)
    }
  })

  it('advanced shrimp squat: both hands hold the rear foot, its knee touches softly behind the heel, nothing else touches', () => {
    const f = frames[advShrimp.id]
    const low = lowest(f, (x) => x.at('lowerLegR').y)
    expect(low.at('lowerLegR').y).toBeGreaterThan(0.035 * low.s)
    expect(low.at('lowerLegR').y).toBeLessThan(0.07 * low.s)
    expect(low.at('lowerLegR').z).toBeLessThan(low.at('footL').z - 0.07 * low.s)
    expect(f[0].angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(172)
    for (const x of f) {
      heelDown(x)
      expect(Math.abs(x.at('lowerLegL').x - x.at('footL').x)).toBeLessThan(0.07 * x.s)
      // Both hands on the rear foot, behind the back.
      for (const s of SIDE) {
        expect(x.at(`hand${s}`).distanceTo(x.at('footR'))).toBeLessThan(0.17 * x.s)
        expect(x.at(`hand${s}`).z).toBeLessThan(x.at('hips').z)
      }
      // Rear heel to the buttock, the foot never down.
      expect(x.angle('upperLegR', 'lowerLegR', 'footR')).toBeLessThan(45)
      expect(x.at('footR').y).toBeGreaterThan(0.15 * x.s)
      expect(x.at('toesR').y).toBeGreaterThan(0.15 * x.s)
      // As tall as the hold allows, and balanced over the foot without the arms to help.
      expect(x.lean('hips', 'upperChest')).toBeLessThan(40)
      expectOverFoot(x)
    }
  })

  it('Nordic curl: knees down, one line from knees to shoulders all the way to the floor and back, no push from the hands', () => {
    const f = frames[nordicCurl.id]
    expect(f[0].lean('lowerLegL', 'upperLegL')).toBeLessThan(2)
    const low = lowest(f, (x) => x.mid('upperArm').y)
    // The chest comes down to brush the floor.
    expect(low.mid('upperArm').y).toBeLessThan(0.2 * low.s)
    expect(low.lean('lowerLegL', 'upperLegL')).toBeGreaterThan(80)
    for (const x of f) {
      expect(sideAngle(x.mid('upperArm'), x.mid('upperLeg'), x.mid('lowerLeg'))).toBeGreaterThan(172)
      // Kneeling, the shins along the floor under the anchor.
      for (const s of SIDE) expect(x.at(`lowerLeg${s}`).y).toBeLessThan(0.06 * x.s)
      // The hands never take the weight: they stay off the floor.
      for (const s of SIDE) expect(x.at(`hand${s}`).y).toBeGreaterThan(wristHeight(x.body) + 0.01 * x.s)
    }
    // As far down as up: the cycle ends where it began.
    expect(f[STEPS - 1].lean('lowerLegL', 'upperLegL')).toBeLessThan(6)
  })
})

describe('the trunk family', () => {
  it('is nine exercises of the library, each with its own movement and its equipment on the stage', () => {
    expect(TRUNK.map((m) => m.id).sort()).toEqual(['ab-wheel-standing', 'adv-shrimp-squat', 'arch-hold', 'box-pistol', 'dragon-flag', 'dragon-flag-negative', 'manna', 'nordic-curl', 'v-sit'])
    expect(TRUNK).toEqual([archHold, boxPistol, dragonFlagNegative, dragonFlag, abWheelStanding, advShrimp, nordicCurl, vSit, manna])
    for (const m of TRUNK) {
      const ex = exerciseById[m.id]
      expect(ex, m.id).toBeDefined()
      expect(m.revision).toBe(1)
      expect(m.kind === 'hold').toBe(ex.metric === 'hold')
      const props = m.props?.(sample(m, 'male')[0].body) ?? []
      if (ex.equipment.includes('box') && !ex.equipment.includes('floor')) expect(props.some((p) => p.kind === 'box'), m.id).toBe(true)
      if (ex.equipment.includes('wheel')) expect(props.some((p) => p.kind === 'wheel'), m.id).toBe(true)
    }
    // The parallettes of the V-sit are the ones the L-sit uses.
    const b = sample(vSit, 'male')[0].body
    expect(vSit.props!(b)[0]).toEqual({ kind: 'rails', ...parallettes(b) })
  })
})
