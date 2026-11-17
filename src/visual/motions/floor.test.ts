import { describe, expect, it } from 'vitest'
import { exerciseById } from '@/domain/catalog'
import {
  FLOOR, abWheelKnee, deadBug, gluteBridge, hollowRock, lSit, nordicNegative, reversePlank, sidePlank, singleLegBridge, tuckLSit,
} from './floor'
import { STEPS, deg, drift, expectSound, highest, lowest, sample } from './testkit'
import { STAGE_RATIO } from './types'

describe.each(['male', 'female'] as const)('floor and core movements, %s character', (who) => {
  const frames = Object.fromEntries(FLOOR.map((m) => [m.id, sample(m, who)]))

  it.each(FLOOR.map((m) => m.id))('%s: sound', (id) => {
    expectSound(FLOOR.find((m) => m.id === id)!, frames[id])
  })

  it('dead bug: one leg reaches long and low while the other knee stays over the hip, and the opposite arm goes overhead', () => {
    const f = frames[deadBug.id]
    const low = lowest(f.slice(0, STEPS / 2), (x) => x.at('footL').y)
    // Long: the knee is straight. Low: the heel is near the floor and not on it.
    expect(low.angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(170)
    expect(low.at('footL').y).toBeLessThan(0.16 * low.s)
    expect(low.at('footL').y).toBeGreaterThan(0.07 * low.s)
    // The other leg has not moved: thigh upright, knee square.
    expect(low.lean('upperLegR', 'lowerLegR')).toBeLessThan(6)
    expect(Math.abs(low.angle('upperLegR', 'lowerLegR', 'footR') - 90)).toBeLessThan(6)
    // The opposite arm is the one that went back; the same-side arm still points up.
    expect(low.at('handR').y).toBeLessThan(0.3 * low.s)
    expect(low.at('handR').y).toBeGreaterThan(0.04 * low.s)
    expect(low.lean('upperArmL', 'handL')).toBeLessThan(6)
    // Then the other pair.
    const other = lowest(f.slice(STEPS / 2), (x) => x.at('footR').y)
    expect(other.at('footR').y).toBeLessThan(0.16 * other.s)
    expect(other.at('handL').y).toBeLessThan(0.3 * other.s)
    for (const x of f) {
      for (const s of ['L', 'R'] as const) expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(168)
      // On the back, flat: the pelvis has not left the floor or rolled.
      expect(x.at('hips').y).toBeLessThan(0.13 * x.s)
      expect(Math.abs(x.at('upperLegL').y - x.at('upperLegR').y)).toBeLessThan(0.005)
    }
  })

  it.each([[gluteBridge.id], [singleLegBridge.id]])('%s: hips rise until knee, hips and shoulders are in one line; shoulders and heel stay down', (id) => {
    const f = frames[id]
    const top = highest(f, (x) => x.at('hips').y)
    // Seen from the side: the shoulders are wider than the hips, which is not a bend.
    const side = (b: 'upperArmL' | 'upperLegL' | 'lowerLegL') => top.at(b).setX(0)
    expect(side('upperArmL').sub(side('upperLegL')).angleTo(side('lowerLegL').sub(side('upperLegL'))) * deg).toBeGreaterThan(173)
    // The shin is upright at the top: the push is through the heel.
    expect(top.lean('footL', 'lowerLegL')).toBeLessThan(8)
    expect(f[0].at('hips').y).toBeLessThan(0.14 * f[0].s)
    expect(top.at('hips').y).toBeGreaterThan(0.3 * top.s)
    // The pause at the top: at least a second where the hips are within a centimetre of their highest.
    const m = FLOOR.find((x) => x.id === id)!
    expect((f.filter((x) => x.at('hips').y > top.at('hips').y - 0.01).length / STEPS) * m.period).toBeGreaterThan(1)
    expect(drift(f.map((x) => x.mid('upperArm')))).toBeLessThan(0.004)
    for (const x of f) {
      expect(Math.abs(x.at('footL').y - x.body.ankle)).toBeLessThan(0.002)
      expect(Math.abs(x.at('upperLegL').y - x.at('upperLegR').y)).toBeLessThan(0.006)
    }
  })

  it('single-leg bridge: the free knee is towards the chest and that foot is off the floor', () => {
    for (const x of frames[singleLegBridge.id]) {
      expect(x.at('lowerLegR').y).toBeGreaterThan(x.at('upperLegR').y + 0.3 * x.s)
      expect(x.at('lowerLegR').z).toBeLessThan(x.at('upperLegR').z + 0.02)
      expect(x.at('footR').y).toBeGreaterThan(0.2 * x.s)
      expect(x.angle('upperLegR', 'lowerLegR', 'footR')).toBeLessThan(100)
    }
  })

  it('side plank: elbow under the shoulder, shoulders stacked, a straight line from ankles to head', () => {
    for (const x of frames[sidePlank.id]) {
      expect(x.line()).toBeGreaterThan(174)
      const under = x.at('lowerArmL').sub(x.at('upperArmL'))
      expect(Math.hypot(under.x, under.z)).toBeLessThan(0.02)
      expect(x.at('lowerArmL').y).toBeLessThan(0.06 * x.s)
      // Forearm flat on the floor.
      expect(Math.abs(x.at('handL').y - x.at('lowerArmL').y)).toBeLessThan(0.02)
      const stack = x.at('upperArmR').sub(x.at('upperArmL'))
      expect(stack.y).toBeGreaterThan(0.25 * x.s)
      // Over it, not rolled forward or back; reaching up carries the top shoulder a little towards the head.
      expect(Math.abs(stack.x)).toBeLessThan(0.03)
      expect(Math.abs(stack.z)).toBeLessThan(0.08)
      // The whole body is in one plane: it has not rolled towards the floor.
      for (const b of ['hips', 'head', 'upperLegR', 'footL'] as const) expect(Math.abs(x.at(b).x - x.at('upperArmL').x)).toBeLessThan(0.05)
      expect(x.at('hips').y).toBeGreaterThan(0.25 * x.s)
      // Feet stacked, the bottom one on its edge.
      expect(x.at('footL').y).toBeLessThan(0.07 * x.s)
      expect(x.at('footR').y - x.at('footL').y).toBeGreaterThan(0.06 * x.s)
      for (const s of ['L', 'R'] as const) expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(165)
    }
  })

  it('hollow rock: the shape does not change while it rocks', () => {
    const f = frames[hollowRock.id]
    const span = f.map((x) => x.at('handL').distanceTo(x.at('footL')))
    expect(Math.max(...span) - Math.min(...span)).toBeLessThan(0.002)
    const hip = f.map((x) => x.angle('upperChest', 'hips', 'footL'))
    expect(Math.max(...hip) - Math.min(...hip)).toBeLessThan(0.5)
    // It does rock: the feet rise and fall, and the head does the opposite.
    const feet = f.map((x) => x.at('footL').y), heads = f.map((x) => x.at('head').y)
    expect(Math.max(...feet) - Math.min(...feet)).toBeGreaterThan(0.12 * f[0].s)
    expect(feet.indexOf(Math.max(...feet))).not.toBe(heads.indexOf(Math.max(...heads)))
    for (const x of f) {
      expect(x.at('hips').y).toBeLessThan(0.2 * x.s)
      expect(x.at('hips').y).toBeGreaterThan(0.09 * x.s)
      expect(x.crown.y).toBeGreaterThan(0.02)
    }
  })

  it('reverse plank: face up, one line from heels to shoulders, arms locked with the hands under the shoulders', () => {
    for (const x of frames[reversePlank.id]) {
      expect(x.line()).toBeGreaterThan(174)
      for (const s of ['L', 'R'] as const) {
        expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(172)
        expect(Math.abs(x.at(`hand${s}`).z - x.at(`upperArm${s}`).z)).toBeLessThan(0.02)
        expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(172)
      }
      expect(x.at('hips').y).toBeGreaterThan(0.25 * x.s)
      // Face up: the knees are above the line of the legs' underside, the head beyond the hands.
      expect(x.at('head').z).toBeLessThan(x.at('handL').z)
      expect(x.at('footL').y).toBeLessThan(0.12 * x.s)
    }
  })

  it.each([[tuckLSit.id], [lSit.id]])('%s: locked arms, shoulders down, hips and feet clear of the floor', (id) => {
    for (const x of frames[id]) {
      for (const s of ['L', 'R'] as const) expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(172)
      expect(x.at('hips').y).toBeGreaterThan(0.2 * x.s)
      expect(Math.min(x.at('footL').y, x.at('toesL').y)).toBeGreaterThan(0.05 * x.s)
      // Hips between or just behind the hands; the trunk upright, not leaning back to lift the legs.
      expect(x.at('hips').z).toBeLessThan(x.at('handL').z + 0.04 * x.s)
      expect(x.at('hips').z).toBeGreaterThan(x.at('handL').z - 0.1 * x.s)
      expect(x.at('upperChest').z).toBeGreaterThan(x.at('hips').z - 0.02)
      // The hands are on the rails.
      const rail = FLOOR.find((m) => m.id === id)!.props!(x.body)[0]
      if (rail.kind !== 'rails') throw new Error('expected parallettes')
      expect(Math.abs(Math.abs(x.at('handL').x) - rail.gap / 2)).toBeLessThan(0.05 * x.s)
      expect(x.at('handL').y - rail.height).toBeGreaterThan(0.02 * x.s)
      expect(x.at('handL').y - rail.height).toBeLessThan(0.07 * x.s)
    }
  })

  it('tuck L-sit: knees drawn up towards the chest', () => {
    for (const x of frames[tuckLSit.id]) {
      expect(x.at('lowerLegL').y).toBeGreaterThan(x.at('upperLegL').y + 0.2 * x.s)
      expect(x.angle('upperLegL', 'lowerLegL', 'footL')).toBeLessThan(70)
    }
  })

  it('L-sit: legs straight and level', () => {
    for (const x of frames[lSit.id]) {
      expect(x.angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(174)
      expect(Math.abs(x.at('footL').y - x.at('upperLegL').y)).toBeLessThan(0.03 * x.s)
      expect(x.at('footL').z).toBeGreaterThan(x.at('upperLegL').z + 0.7 * x.s)
    }
  })

  it('ab-wheel rollout: knees down, arms straight, out to a long low line with no sag, and back', () => {
    const f = frames[abWheelKnee.id]
    const out = highest(f, (x) => x.mid('hand').z)
    // Long and low: chest a fist from the floor, hips well in front of the knees, on the line or above it.
    expect(out.mid('upperArm').y).toBeLessThan(0.24 * out.s)
    expect(out.mid('upperArm').y).toBeGreaterThan(0.14 * out.s)
    expect(out.mid('upperLeg').z).toBeGreaterThan(out.mid('lowerLeg').z + 0.3 * out.s)
    expect(out.mid('upperArm').sub(out.mid('upperLeg')).angleTo(out.mid('lowerLeg').sub(out.mid('upperLeg'))) * deg).toBeGreaterThan(172)
    expect(out.mid('hand').z).toBeGreaterThan(out.mid('upperArm').z + 0.45 * out.s)
    // It starts with the hips over the knees and the wheel close.
    expect(Math.abs(f[0].mid('upperLeg').z - f[0].mid('lowerLeg').z)).toBeLessThan(0.03)
    expect(out.mid('hand').z - f[0].mid('hand').z).toBeGreaterThan(0.6 * out.s)
    const radius = abWheelKnee.props!(out.body)[0]
    for (const x of f) {
      for (const s of ['L', 'R'] as const) expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(170)
      // The hands stay at the height of the wheel's handles: it is rolling, not being lifted.
      if (radius.kind === 'wheel') expect(Math.abs(x.at('handL').y - radius.radius - 0.034 * x.s)).toBeLessThan(0.002)
      // Hips never drop below the line from knees to shoulders.
      const knee = x.mid('lowerLeg'), sh = x.mid('upperArm'), hip = x.mid('upperLeg')
      const onLine = knee.y + ((sh.y - knee.y) * (hip.z - knee.z)) / (sh.z - knee.z)
      expect(hip.y).toBeGreaterThan(onLine - 0.01)
    }
  })

  it('Nordic negative: straight from knees to shoulders all the way down, slowly, and the hands catch it', () => {
    const f = frames[nordicNegative.id]
    for (const x of f) {
      expect(x.mid('upperArm').sub(x.mid('upperLeg')).angleTo(x.mid('lowerLeg').sub(x.mid('upperLeg'))) * deg).toBeGreaterThan(172)
      expect(x.at('handL').y).toBeGreaterThan(0.02 * x.s)
    }
    expect(f[0].lean('lowerLegL', 'upperLegL')).toBeLessThan(2)
    const low = lowest(f, (x) => x.mid('upperArm').y)
    expect(low.mid('upperArm').y).toBeLessThan(0.36 * low.s)
    expect(low.at('handL').y).toBeLessThan(0.04 * low.s)
    expect(low.at('handL').z).toBeGreaterThan(low.at('upperArmL').z - 0.1)
    // The way down, from the first lean to the hands touching, takes at least five seconds.
    const down = f.filter((x) => x.t <= low.t && x.lean('lowerLegL', 'upperLegL') > 2 && x.at('handL').y > 0.04 * x.s)
    expect((down.length / STEPS) * nordicNegative.period).toBeGreaterThan(5)
    // The hands are still once they are down.
    const onFloor = f.filter((x) => x.at('handL').y < 0.03 * x.s)
    expect(onFloor.length).toBeGreaterThan(3)
    expect(drift(onFloor.map((x) => x.at('handL')))).toBeLessThan(0.004)
  })
})

describe('the floor family as a set', () => {
  it('is ten exercises of the library, each ready to be staged', () => {
    expect(FLOOR.map((m) => m.id)).toEqual(['dead-bug', 'glute-bridge', 'single-leg-bridge', 'side-plank', 'hollow-rock', 'reverse-plank', 'tuck-l-sit', 'l-sit', 'ab-wheel-knee', 'nordic-negative'])
    for (const m of FLOOR) {
      const ex = exerciseById[m.id]
      expect(ex, m.id).toBeDefined()
      expect(m.kind === 'hold').toBe(ex.metric === 'hold')
      expect(STAGE_RATIO[m.stage]).toBeGreaterThan(0)
    }
  })
})
