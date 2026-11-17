import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import type { BoneName } from '../body/skeleton'
import { exerciseById } from '@/domain/catalog'
import { LEGS, assistedPistol, boxSquat, bulgarian, calfRaise, calfStep, cossack, deepSquat, pistol, pistolRail, shrimp, sitWall, splitBench, squatBox, wallSit } from './legs'
import { expectSound, highest, lowest, sample, type Frames } from './testkit'

type Frame = Frames[number]

/**
 * Roughly where the body's weight is: trunk and head at the middle of the
 * trunk, each arm at its elbow, each thigh and each lower leg at its middle.
 */
function weight(x: Frame): Vector3 {
  const mid = (a: BoneName, b: BoneName) => x.at(a).add(x.at(b)).multiplyScalar(0.5)
  const out = x.mid('upperArm').add(x.mid('upperLeg')).multiplyScalar(0.5 * 0.58)
  for (const s of ['L', 'R'] as const) {
    out.addScaledVector(x.at(`lowerArm${s}`), 0.05)
    out.addScaledVector(mid(`upperLeg${s}`, `lowerLeg${s}`), 0.1)
    out.addScaledVector(mid(`lowerLeg${s}`, `foot${s}`), 0.06)
  }
  return out
}

/** Whether the weight is over the standing (left) foot: between heel and toes, and not off to one side. */
function expectOverFoot(x: Frame, slack = 0) {
  const w = weight(x)
  const s = x.s
  expect(w.z, 'weight behind the heel').toBeGreaterThan(x.at('footL').z - (0.05 + slack) * s)
  expect(w.z, 'weight past the toes').toBeLessThan(x.at('toesL').z + (0.07 + slack) * s)
  expect(Math.abs(w.x - x.at('footL').x), 'weight to one side of the foot').toBeLessThan(0.07 * s)
}

const heelDown = (x: Frame, side: 'L' | 'R' = 'L') => {
  expect(Math.abs(x.at(`foot${side}`).y - x.body.ankle)).toBeLessThan(0.002)
  expect(Math.abs(x.at(`toes${side}`).y - x.at(`foot${side}`).y - x.body.ball.y)).toBeLessThan(0.004)
}

describe.each(['male', 'female'] as const)('leg movements, %s character', (who) => {
  const frames = Object.fromEntries(LEGS.map((m) => [m.id, sample(m, who)])) as Record<string, Frames>

  it.each(LEGS.map((m) => m.id))('%s: sound', (id) => {
    expectSound(LEGS.find((m) => m.id === id)!, frames[id])
  })

  it('box squat: hips touch the box, shins near vertical, heels down, full stand', () => {
    const f = frames['box-squat']
    const box = squatBox(f[0].body)
    const low = lowest(f, (x) => x.at('upperLegL').y)
    // Sitting, the hip joints are about 9 cm above what the buttocks rest on.
    expect(low.at('upperLegL').y - box.height).toBeGreaterThan(0.07 * low.s)
    expect(low.at('upperLegL').y - box.height).toBeLessThan(0.11 * low.s)
    // The hips are over the box, and the box is clear of the calves.
    expect(low.at('upperLegL').z).toBeLessThan(box.z + box.depth / 2)
    expect(low.at('upperLegL').z).toBeGreaterThan(box.z - box.depth / 2)
    expect(box.z + box.depth / 2).toBeLessThan(-0.08 * low.s)
    expect(low.lean('footL', 'lowerLegL')).toBeLessThan(18)
    expect(low.at('lowerLegL').x).toBeGreaterThan(low.at('footL').x - 0.03)
    expect(f[0].angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(172)
    for (const x of f) {
      heelDown(x); heelDown(x, 'R')
      // A light touch: the weight never goes far behind the heels.
      expect(weight(x).z).toBeGreaterThan(x.at('footL').z - 0.1 * x.s)
    }
  })

  it('wall sit: back on the wall, thighs level, knees at a right angle over the ankles', () => {
    for (const x of frames['wall-sit']) {
      expect(Math.abs(x.at('upperLegL').y - x.at('lowerLegL').y)).toBeLessThan(0.015)
      expect(Math.abs(x.at('lowerLegL').z - x.at('footL').z)).toBeLessThan(0.025)
      expect(Math.abs(x.angle('upperLegL', 'lowerLegL', 'footL') - 90)).toBeLessThan(5)
      expect(x.lean('hips', 'upperChest')).toBeLessThan(4)
      // The back is on the wall: hips and shoulders both a back's depth in front of it.
      const wall = sitWall(x.body)
      for (const b of ['upperLegL', 'upperArmL'] as BoneName[]) {
        expect(x.at(b).z - wall).toBeGreaterThan(0.09 * x.s)
        expect(x.at(b).z - wall).toBeLessThan(0.16 * x.s)
      }
      heelDown(x); heelDown(x, 'R')
      // Hands off the thighs.
      expect(x.at('handL').distanceTo(x.at('lowerLegL'))).toBeGreaterThan(0.15 * x.s)
    }
  })

  it('calf raise: heel below the step and then high, knee straight, the other foot off', () => {
    const f = frames['calf-raise']
    const step = calfStep(f[0].body)
    const heel = (x: Frame) => x.at('footL').y - x.at('toesL').y
    const low = lowest(f, heel), top = highest(f, heel)
    // Flat, the ankle is 6 cm above the ball of the foot: less means the heel hangs below the edge.
    expect(heel(low)).toBeLessThan(0.045 * low.s)
    expect(heel(top)).toBeGreaterThan(0.11 * top.s)
    expect(top.at('hips').y - low.at('hips').y).toBeGreaterThan(0.07 * low.s)
    for (const x of f) {
      expect(x.angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(172)
      expect(Math.abs(x.at('toesL').y - step.height - 0.014 * x.s)).toBeLessThan(0.003)
      // The ball of the foot is on the step, the heel behind its edge.
      expect(x.at('toesL').z).toBeGreaterThan(step.z - step.depth / 2)
      expect(x.at('footL').z).toBeLessThan(step.z - step.depth / 2)
      expect(x.at('footR').y).toBeGreaterThan(step.height + 0.12 * x.s)
      expect(x.lean('hips', 'upperChest')).toBeLessThan(6)
      const w = weight(x)
      expect(Math.abs(w.z - x.at('toesL').z)).toBeLessThan(0.08 * x.s)
      expect(Math.abs(w.x - x.at('footL').x)).toBeLessThan(0.07 * x.s)
    }
  })

  it('Bulgarian split squat: front thigh level, front heel down, rear foot resting on the bench', () => {
    const f = frames['bulgarian-split-squat']
    const bench = splitBench(f[0].body)
    const low = lowest(f, (x) => x.at('hips').y)
    expect(low.at('upperLegL').y).toBeLessThan(low.at('lowerLegL').y + 0.02 * low.s)
    expect(low.at('lowerLegL').z - low.at('footL').z).toBeLessThan(0.12 * low.s)
    expect(low.at('lowerLegR').y).toBeGreaterThan(0.08 * low.s)
    expect(f[0].angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(150)
    for (const x of f) {
      heelDown(x)
      expect(x.lean('hips', 'upperChest')).toBeLessThan(16)
      // The rear foot lies on the bench, behind its front edge.
      expect(Math.abs(x.at('footR').y - bench.height - 0.032 * x.s)).toBeLessThan(0.003)
      expect(x.at('toesR').y).toBeGreaterThan(bench.height)
      expect(x.at('toesR').z).toBeLessThan(bench.z + bench.depth / 2)
      expect(x.at('toesR').z).toBeGreaterThan(bench.z - bench.depth / 2)
      // The weight stays between the feet, nearer the front one.
      const w = weight(x)
      expect(w.z).toBeGreaterThan(x.at('footR').z * 0.5)
      expect(w.z).toBeLessThan(x.at('toesL').z + 0.05 * x.s)
    }
  })

  it('Cossack squat: hip below the knee, heel down, the other leg straight with its toes up', () => {
    const f = frames['cossack-squat']
    const low = lowest(f, (x) => x.at('hips').y)
    expect(low.at('upperLegL').y).toBeLessThan(low.at('lowerLegL').y)
    expect(low.at('toesR').y).toBeGreaterThan(low.at('footR').y + 0.08 * low.s)
    expect(low.lean('hips', 'upperChest')).toBeLessThan(35)
    // The bent knee goes out over its foot.
    expect(low.at('lowerLegL').x).toBeGreaterThan(low.at('upperLegL').x)
    expect(f[0].angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(172)
    for (const x of f) {
      heelDown(x)
      expect(x.angle('upperLegR', 'lowerLegR', 'footR')).toBeGreaterThan(172)
      const w = weight(x)
      expect(w.x).toBeLessThan(x.at('footL').x + 0.05 * x.s)
      expect(w.x).toBeGreaterThan(x.at('footR').x)
    }
  })

  it('deep squat hold: heels down, hips below the knees, knees out, chest lifted', () => {
    for (const x of frames['deep-squat-hold']) {
      heelDown(x); heelDown(x, 'R')
      expect(x.at('upperLegL').y).toBeLessThan(x.at('lowerLegL').y - 0.05 * x.s)
      expect(x.at('lowerLegL').x).toBeGreaterThan(x.at('footL').x)
      expect(x.lean('hips', 'upperChest')).toBeLessThan(45)
      expect(x.at('handL').y).toBeGreaterThan(0.3 * x.s)
      // Elbows inside the knees.
      expect(x.at('lowerArmL').x).toBeLessThan(x.at('lowerLegL').x + 0.02 * x.s)
      const w = weight(x)
      expect(w.z).toBeGreaterThan(x.at('footL').z - 0.06 * x.s)
      expect(w.z).toBeLessThan(x.at('toesL').z + 0.07 * x.s)
    }
  })

  it.each([['pistol-squat', pistol], ['assisted-pistol', assistedPistol]] as const)('%s: full depth on one leg, heel down, free leg straight and off the floor', (id, m) => {
    const f = frames[id]
    const low = lowest(f, (x) => x.at('hips').y)
    expect(low.at('upperLegL').y).toBeLessThan(low.at('lowerLegL').y - 0.05 * low.s)
    expect(f[0].angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(172)
    for (const x of f) {
      heelDown(x)
      expect(x.angle('upperLegR', 'lowerLegR', 'footR')).toBeGreaterThan(172)
      expect(x.at('footR').y).toBeGreaterThan(0.1 * x.s)
      expect(x.at('toesR').y).toBeGreaterThan(0.04 * x.s)
      // The standing knee tracks over the foot.
      expect(Math.abs(x.at('lowerLegL').x - x.at('footL').x)).toBeLessThan(0.07 * x.s)
      // Unsupported, the weight has to stay over the foot; with the rail it may sit a little behind.
      expectOverFoot(x, m === assistedPistol ? 0.08 : 0)
    }
    if (m === assistedPistol) {
      const rail = pistolRail(f[0].body)
      for (const x of f) {
        expect(Math.abs(x.at('fingers1L').y - rail.height)).toBeLessThan(0.035 * x.s)
        expect(Math.abs(x.at('fingers1L').z - rail.z!)).toBeLessThan(0.035 * x.s)
        // Arms bent and easy, never hauling at full stretch.
        expect(x.angle('upperArmL', 'lowerArmL', 'handL')).toBeLessThan(165)
      }
    }
  })

  it('shrimp squat: rear knee touches behind the heel, rear foot stays off the floor', () => {
    const f = frames['shrimp-squat']
    const low = lowest(f, (x) => x.at('lowerLegR').y)
    expect(low.at('lowerLegR').y).toBeGreaterThan(0.035 * low.s)
    expect(low.at('lowerLegR').y).toBeLessThan(0.07 * low.s)
    expect(low.at('lowerLegR').z).toBeLessThan(low.at('footL').z - 0.07 * low.s)
    expect(low.lean('hips', 'upperChest')).toBeGreaterThan(35)
    expect(f[0].angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(172)
    for (const x of f) {
      heelDown(x)
      expect(x.at('footR').y).toBeGreaterThan(0.15 * x.s)
      expect(x.at('toesR').y).toBeGreaterThan(0.1 * x.s)
      expect(Math.abs(x.at('lowerLegL').x - x.at('footL').x)).toBeLessThan(0.07 * x.s)
      expectOverFoot(x)
    }
  })
})

describe('the leg family', () => {
  it('is nine exercises of the library, easiest first, each with its own movement', () => {
    expect(LEGS.map((m) => m.id)).toEqual(['box-squat', 'wall-sit', 'calf-raise', 'bulgarian-split-squat', 'cossack-squat', 'deep-squat-hold', 'assisted-pistol', 'pistol-squat', 'shrimp-squat'])
    expect([boxSquat, wallSit, calfRaise, bulgarian, cossack, deepSquat, assistedPistol, pistol, shrimp]).toEqual(LEGS)
    for (const m of LEGS) {
      const ex = exerciseById[m.id]
      expect(ex, m.id).toBeDefined()
      expect(m.kind === 'hold').toBe(ex.metric === 'hold')
      // Whatever equipment it uses is on the stage.
      const props = m.props?.(sample(m, 'male')[0].body) ?? []
      if (ex.equipment.includes('box') && !ex.equipment.includes('floor')) expect(props.some((p) => p.kind === 'box'), m.id).toBe(true)
      if (ex.equipment.includes('wall')) expect(props.some((p) => p.kind === 'wall'), m.id).toBe(true)
    }
  })
})
