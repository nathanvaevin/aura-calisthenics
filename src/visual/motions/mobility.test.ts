import { describe, expect, it } from 'vitest'
import { exerciseById } from '@/domain/catalog'
import { MOBILITY, bridge, deepLunge, overheadWallReach, pancakeElbows, toeTouch, wallBehind } from './mobility'
import { STEPS, deg, expectSound, sample, type Frames } from './testkit'

/** The moment the position is fully reached and kept. */
const kept = (f: Frames) => f[STEPS / 2]
const SIDES = ['L', 'R'] as const

describe.each(['male', 'female'] as const)('mobility positions, %s character', (who) => {
  const frames = Object.fromEntries(MOBILITY.map((m) => [m.id, sample(m, who)])) as Record<string, Frames>

  it.each(MOBILITY.map((m) => m.id))('%s: sound', (id) => {
    expectSound(MOBILITY.find((m) => m.id === id)!, frames[id])
  })

  it('toe touch: knees locked, folded from the hips, fingertips on the floor', () => {
    const f = frames['toe-touch']
    for (const x of f) {
      for (const s of SIDES) {
        expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(174)
        expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(168)
        expect(x.at(`toes${s}`).y).toBeLessThan(0.04 * x.s)
      }
      // The fold is at the hips: the shoulders are below them.
      expect(x.mid('upperArm').y).toBeLessThan(x.mid('upperLeg').y)
    }
    const x = kept(f)
    // The last finger joint is a fingertip's length above the floor, just in front of the toes.
    expect(x.at('fingers3L').y).toBeLessThan(0.05 * x.s)
    expect(x.at('fingers3L').z).toBeGreaterThan(x.at('toesL').z)
    expect(x.at('fingers3L').z).toBeLessThan(x.at('toesL').z + 0.3 * x.s)
    // Eased off, the hands are clear of the floor: it is a held stretch, not a bounce.
    expect(f[0].at('fingers3L').y).toBeGreaterThan(0.08 * x.s)
  })

  it('deep lunge: back knee down, hips square and forward, trunk upright, front shin upright', () => {
    const f = frames['deep-lunge']
    for (const x of f) {
      expect(x.at('lowerLegL').y).toBeLessThan(0.07 * x.s)
      expect(x.lean('hips', 'upperChest')).toBeLessThan(10)
      expect(Math.abs(x.at('upperLegL').z - x.at('upperLegR').z)).toBeLessThan(0.005)
      expect(Math.abs(x.at('upperLegL').y - x.at('upperLegR').y)).toBeLessThan(0.005)
      expect(Math.abs(x.at('footR').y - x.body.ankle)).toBeLessThan(0.002)
      // The front knee stays over the foot.
      expect(x.at('lowerLegR').z).toBeLessThan(x.at('toesR').z + 0.02 * x.s)
    }
    const x = kept(f)
    expect(x.lean('footR', 'lowerLegR')).toBeLessThan(6)
    // The hip of the back leg is open: the thigh slopes well forward of the knee, and the hips are low.
    expect(x.lean('lowerLegL', 'upperLegL')).toBeGreaterThan(28)
    expect(x.mid('upperLeg').y).toBeLessThan(x.at('lowerLegR').y)
    expect(x.mid('upperLeg').z).toBeGreaterThan(f[0].mid('upperLeg').z + 0.03 * x.s)
  })

  it('overhead wall reach: nothing through the wall, arms straight and shoulder-width, thumbs to the wall', () => {
    const f = frames['overhead-wall-reach']
    const wall = wallBehind(f[0].body)
    for (const x of f) {
      for (const b of ['hips', 'head', 'upperChest', 'upperArmL', 'handL', 'handR', 'footL', 'thumb2L'] as const) expect(x.at(b).z, b).toBeGreaterThan(wall)
      for (const s of SIDES) {
        expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(170)
        expect(Math.abs(x.at(`hand${s}`).x - x.at(`upperArm${s}`).x)).toBeLessThan(0.03)
      }
      // The trunk stays flat to the wall.
      expect(x.lean('hips', 'upperChest')).toBeLessThan(4)
    }
    const x = kept(f)
    // The wrist is a thumb's length from the wall, above the head, behind the shoulder.
    expect(x.at('handL').z - wall).toBeGreaterThan(0.04 * x.s)
    expect(x.at('handL').z - wall).toBeLessThan(0.09 * x.s)
    expect(x.at('handL').y).toBeGreaterThan(x.crown.y)
    expect(x.at('handL').z).toBeLessThan(x.at('upperArmL').z)
    expect(f[0].at('handL').z).toBeGreaterThan(f[0].at('upperArmL').z + 0.15 * x.s)
  })

  it('pancake: legs straight and wide with the toes up, elbows on the floor, back long', () => {
    const f = frames['pancake-elbows']
    for (const x of f) {
      for (const s of SIDES) {
        expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(174)
        expect(x.at(`toes${s}`).y).toBeGreaterThan(x.at(`foot${s}`).y + 0.04 * x.s)
        expect(x.at(`upperLeg${s}`).y).toBeLessThan(0.12 * x.s)
        expect(x.at(`lowerArm${s}`).y).toBeLessThan(0.06 * x.s)
        expect(x.at(`hand${s}`).y).toBeLessThan(0.06 * x.s)
      }
      const legL = x.at('footL').sub(x.at('upperLegL')), legR = x.at('footR').sub(x.at('upperLegR'))
      expect(legL.angleTo(legR) * deg).toBeGreaterThan(95)
      expect(x.angle('hips', 'chest', 'neck')).toBeGreaterThan(150)
    }
    const x = kept(f)
    // Folded well forward: the shoulders are low and in front of the hips, lower than when eased off.
    expect(x.mid('upperArm').y).toBeLessThan(0.36 * x.s)
    expect(x.mid('upperArm').z).toBeGreaterThan(x.mid('upperLeg').z + 0.35 * x.s)
    expect(x.mid('upperArm').y).toBeLessThan(f[0].mid('upperArm').y)
  })

  it('bridge: arms locked, hips above the shoulders, shoulders over the hands, feet flat, head off the floor', () => {
    const f = frames.bridge
    for (const x of f) {
      for (const s of SIDES) {
        expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(170)
        expect(Math.abs(x.at(`foot${s}`).y - x.body.ankle)).toBeLessThan(0.002)
        expect(x.at(`toes${s}`).y).toBeLessThan(0.05 * x.s)
        const knee = x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)
        expect(knee).toBeGreaterThan(80)
        expect(knee).toBeLessThan(150)
      }
      expect(x.mid('upperLeg').y).toBeGreaterThan(x.mid('upperArm').y + 0.1 * x.s)
      expect(x.crown.y).toBeGreaterThan(0.08 * x.s)
      // Face up: the hips are between the hands and the feet.
      expect(x.mid('upperLeg').z).toBeGreaterThan(x.mid('hand').z)
      expect(x.mid('upperLeg').z).toBeLessThan(x.mid('foot').z)
    }
    const x = kept(f)
    expect(Math.abs(x.mid('upperArm').z - x.mid('hand').z)).toBeLessThan(0.04 * x.s)
    expect(x.lean('footL', 'lowerLegL')).toBeLessThan(8)
    // Pressed through further than when eased off.
    expect(x.mid('upperLeg').y).toBeGreaterThan(f[0].mid('upperLeg').y)
  })
})

describe('the mobility family', () => {
  it('is five exercises of the library, held and breathed, each with its standard', () => {
    expect(MOBILITY).toEqual([toeTouch, deepLunge, overheadWallReach, pancakeElbows, bridge])
    for (const m of MOBILITY) {
      expect(exerciseById[m.id], m.id).toBeDefined()
      expect(exerciseById[m.id].discipline).toBe('mobility')
      expect(m.kind).toBe('mobility')
      expect(m.period).toBeGreaterThanOrEqual(5)
      expect(m.period).toBeLessThanOrEqual(7)
    }
    expect(overheadWallReach.props?.(sample(overheadWallReach, 'male')[0].body)).toEqual([expect.objectContaining({ kind: 'wall' })])
  })
})
