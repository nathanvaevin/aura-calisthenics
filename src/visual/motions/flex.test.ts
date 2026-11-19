import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { exerciseById } from '@/domain/catalog'
import { FLEX, frontSplit, hipSwitch, lungeRotation, middleSplit, palmsFloor, pancake, seatedPike, straightBridge } from './flex'
import { MUSCLE_CHANNELS } from '../body/muscles'
import { STEPS, deg, expectSound, highest, sample, type Frames } from './testkit'

type Frame = Frames[number]

/** The moment a position is fully reached and kept. */
const kept = (f: Frames) => f[STEPS / 2]
const SIDES = ['L', 'R'] as const
const knee = (x: Frame, s: 'L' | 'R') => x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)
const elbow = (x: Frame, s: 'L' | 'R') => x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)
/** From the hip joint to the ankle. */
const leg = (x: Frame, s: 'L' | 'R') => x.at(`foot${s}`).sub(x.at(`upperLeg${s}`))
/** How far the knee is above the straight line from hip to ankle: positive with the kneecap up, negative with it down. */
const kneecap = (x: Frame, s: 'L' | 'R') => x.at(`lowerLeg${s}`).y - (x.at(`upperLeg${s}`).y + x.at(`foot${s}`).y) / 2
/** The pelvis' own directions on the floor: to the athlete's left, and where it faces. */
const pelvis = (x: Frame) => {
  const left = x.at('upperLegL').sub(x.at('upperLegR')).setY(0).normalize()
  return { left, front: new Vector3().crossVectors(left, new Vector3(0, 1, 0)) }
}
/** Where the hip joints rest when the pelvis is on the floor, as a share of the body's scale. */
const SEATED = 0.095

describe.each(['male', 'female'] as const)('range of motion, %s character', (who) => {
  const frames = Object.fromEntries(FLEX.map((m) => [m.id, sample(m, who)])) as Record<string, Frames>

  it.each(FLEX.map((m) => m.id))('%s: sound', (id) => {
    expectSound(FLEX.find((m) => m.id === id)!, frames[id])
  })

  it('90/90: both knees at a right angle throughout, heels where they were, sitting tall with the hands off the floor', () => {
    const f = frames['hip-90-90']
    for (const x of f) {
      for (const s of SIDES) {
        expect(knee(x, s)).toBeGreaterThan(87)
        expect(knee(x, s)).toBeLessThan(93)
        // The heel is the pivot: the ankle only rises and falls over it as the foot rolls.
        expect(x.at(`foot${s}`).setY(0).distanceTo(f[0].at(`foot${s}`).setY(0))).toBeLessThan(0.003)
        expect(x.at(`foot${s}`).y).toBeLessThan(0.11 * x.s)
        expect(x.at(`hand${s}`).y).toBeGreaterThan(0.3 * x.s)
      }
      expect(x.mid('upperLeg').y).toBeLessThan(SEATED * x.s)
      expect(x.lean('hips', 'upperChest')).toBeLessThan(8)
    }
  })

  it('90/90: at each side one leg lies turned out in front and the other turned in to the side, both on the floor', () => {
    const f = frames['hip-90-90']
    // Knees down to the left: the left leg is in front, the right one to the side. Half a cycle later, the mirror image.
    for (const [x, lead, trail, way] of [[f[0], 'L', 'R', 1], [kept(f), 'R', 'L', -1]] as const) {
      const { left, front } = pelvis(x)
      for (const s of SIDES) expect(x.at(`lowerLeg${s}`).y).toBeLessThan(0.09 * x.s)
      const thigh = (s: 'L' | 'R') => x.at(`lowerLeg${s}`).sub(x.at(`upperLeg${s}`)).normalize()
      const shin = (s: 'L' | 'R') => x.at(`foot${s}`).sub(x.at(`lowerLeg${s}`)).normalize()
      // In front: the thigh straight ahead of the pelvis, the shin across it.
      expect(thigh(lead).dot(front)).toBeGreaterThan(0.94)
      expect(shin(lead).dot(left) * -way).toBeGreaterThan(0.94)
      // To the side: the thigh straight out from the hip, the shin pointing back.
      expect(thigh(trail).dot(left) * -way).toBeGreaterThan(0.94)
      expect(shin(trail).dot(front)).toBeLessThan(-0.94)
      // The pelvis has turned to face the leg in front.
      expect(front.x * way).toBeGreaterThan(0.8)
    }
    // Through the middle the knees are up and the pelvis faces the front.
    const mid = f[STEPS / 4]
    for (const s of SIDES) expect(mid.at(`lowerLeg${s}`).y).toBeGreaterThan(0.3 * mid.s)
    expect(pelvis(mid).front.z).toBeGreaterThan(0.999)
    // One side is the mirror of the other.
    expect(kept(f).at('lowerLegL').x).toBeCloseTo(-f[0].at('lowerLegR').x, 3)
    expect(kept(f).at('lowerLegL').z).toBeCloseTo(f[0].at('lowerLegR').z, 3)
  })

  it('lunge with rotation: long and low, back leg straight, front knee over the foot, hips square, supporting arm straight', () => {
    const f = frames['worlds-greatest-stretch']
    for (const x of f) {
      expect(knee(x, 'R')).toBeGreaterThan(170)
      expect(x.at('lowerLegR').y).toBeGreaterThan(0.15 * x.s)
      expect(Math.abs(x.at('footL').y - x.body.ankle)).toBeLessThan(0.002)
      // The front shin is upright and the knee is over the foot, not inside it.
      expect(x.lean('footL', 'lowerLegL')).toBeLessThan(5)
      expect(x.at('lowerLegL').x).toBeGreaterThan(x.at('footL').x - 0.02 * x.s)
      // Hips low, level and square: the turn does not come from them.
      expect(x.mid('upperLeg').y).toBeLessThan(x.at('lowerLegL').y)
      expect(Math.abs(x.at('upperLegL').y - x.at('upperLegR').y)).toBeLessThan(0.005)
      expect(Math.abs(x.at('upperLegL').z - x.at('upperLegR').z)).toBeLessThan(0.005)
      expect(elbow(x, 'R')).toBeGreaterThan(168)
      // The supporting hand is inside the front foot.
      expect(x.at('handR').x).toBeLessThan(x.at('footL').x - 0.2 * x.s)
    }
    // A long lunge: the feet are more than a leg's length apart.
    expect(f[0].at('footL').z - f[0].at('toesR').z).toBeGreaterThan(f[0].body.upperLeg + f[0].body.lowerLeg)
  })

  it('lunge with rotation: the elbow goes down to the instep, then the chest turns open and the arm points at the ceiling', () => {
    const f = frames['worlds-greatest-stretch']
    const low = f[0]
    // Lowered: the elbow is just inside the front foot, a hand's breadth off the floor, the forearm resting forward.
    expect(low.at('lowerArmL').y).toBeLessThan(0.13 * low.s)
    expect(low.at('lowerArmL').x).toBeLessThan(low.at('footL').x)
    expect(low.at('lowerArmL').setY(0).distanceTo(low.at('footL').setY(0))).toBeLessThan(0.22 * low.s)
    expect(low.at('handL').y).toBeLessThan(0.06 * low.s)
    const top = highest(f, (x) => x.at('handL').y)
    expect(elbow(top, 'L')).toBeGreaterThan(168)
    expect(top.lean('upperArmL', 'handL')).toBeLessThan(6)
    expect(top.at('handL').y).toBeGreaterThan(top.crown.y + 0.4 * top.s)
    // The shoulders are stacked: the line through them stands well up from the floor, over the supporting hand.
    const across = top.at('upperArmL').sub(top.at('upperArmR'))
    expect(Math.atan2(across.y, Math.hypot(across.x, across.z)) * deg).toBeGreaterThan(58)
    expect(top.at('upperArmR').setY(0).distanceTo(top.at('handR').setY(0))).toBeLessThan(0.09 * top.s)
    // The chest has risen as it turned; lowered, the shoulders are level with the hips or below.
    expect(top.mid('upperArm').y).toBeGreaterThan(low.mid('upperArm').y + 0.2 * top.s)
    // It comes back to where it began.
    expect(f[STEPS - 1].at('handL').distanceTo(low.at('handL'))).toBeLessThan(0.01)
  })

  it('palms to the floor: knees locked, hips over the feet, whole palms flat beside the feet', () => {
    const f = frames['palms-floor-fold']
    for (const x of f) {
      for (const s of SIDES) {
        expect(knee(x, s)).toBeGreaterThan(174)
        // Flat: wrist, knuckles and fingertips all on the floor.
        for (const b of [`hand${s}`, `fingers1${s}`, `fingers3${s}`] as const) expect(x.at(b).y).toBeLessThan(0.035 * x.s)
        // Beside the foot: outside it, between the heel and the toes.
        expect(Math.abs(x.at(`hand${s}`).x)).toBeGreaterThan(Math.abs(x.at(`foot${s}`).x) + 0.1 * x.s)
        expect(x.at(`hand${s}`).z).toBeGreaterThan(x.at(`foot${s}`).z - 0.05 * x.s)
        expect(x.at(`hand${s}`).z).toBeLessThan(x.at(`toes${s}`).z)
        expect(x.at(`toes${s}`).y).toBeLessThan(0.04 * x.s)
      }
      expect(Math.abs(x.mid('upperLeg').z - x.mid('foot').z)).toBeLessThan(0.05 * x.s)
      // Folded at the hips: the shoulders are far below them, and the head hangs lower still, clear of the floor.
      expect(x.mid('upperArm').y).toBeLessThan(x.mid('upperLeg').y - 0.4 * x.s)
      expect(x.crown.y).toBeLessThan(x.mid('upperArm').y)
      expect(x.crown.y).toBeGreaterThan(0.1 * x.s)
    }
    // Drawn in: the chest is closer to the shins than when eased off, and the elbows have folded back to let it.
    const x = kept(f)
    expect(x.mid('upperArm').z).toBeLessThan(f[0].mid('upperArm').z - 0.03 * x.s)
    expect(x.mid('upperArm').z - x.mid('foot').z).toBeLessThan(0.24 * x.s)
    expect(x.at('lowerArmL').z).toBeLessThan(x.at('handL').z)
    expect(elbow(x, 'L')).toBeLessThan(elbow(f[0], 'L'))
  })

  it('seated pike: knees locked, kneecaps up, toes pulled back, the back long and the chest on the thighs', () => {
    const f = frames['seated-pike']
    for (const x of f) {
      for (const s of SIDES) {
        expect(knee(x, s)).toBeGreaterThan(174)
        expect(kneecap(x, s)).toBeGreaterThan(0)
        expect(x.at(`upperLeg${s}`).y).toBeLessThan(SEATED * x.s)
        // Toes up, and drawn back towards the shin rather than pointed away.
        expect(x.at(`toes${s}`).y).toBeGreaterThan(x.at(`foot${s}`).y + 0.08 * x.s)
        expect(x.at(`toes${s}`).z).toBeLessThan(x.at(`foot${s}`).z + 0.05 * x.s)
        // The hands hold the feet.
        expect(x.at(`hand${s}`).distanceTo(x.at(`foot${s}`))).toBeLessThan(0.14 * x.s)
      }
      expect(Math.abs(x.at('footL').x - x.at('footR').x)).toBeLessThan(0.14 * x.s)
      // A long back and a long neck: the fold is at the hips.
      expect(x.angle('hips', 'chest', 'neck')).toBeGreaterThan(150)
      expect(x.angle('upperChest', 'neck', 'head')).toBeGreaterThan(150)
    }
    const x = kept(f)
    // The chest lies on the thighs (not through them), the shoulders past the knees, the head reaching for the shins.
    expect(x.at('upperChest').y).toBeLessThan(0.28 * x.s)
    expect(x.at('upperChest').y).toBeGreaterThan(0.22 * x.s)
    expect(x.mid('upperArm').z).toBeGreaterThan(x.mid('lowerLeg').z + 0.1 * x.s)
    expect(x.at('head').z).toBeGreaterThan(x.mid('lowerLeg').z + 0.15 * x.s)
    expect(x.at('upperChest').y).toBeLessThan(f[0].at('upperChest').y - 0.05 * x.s)
  })

  it('pancake: legs straight and wide with kneecaps and toes up, back long, chest on the floor', () => {
    const f = frames.pancake
    for (const x of f) {
      for (const s of SIDES) {
        expect(knee(x, s)).toBeGreaterThan(174)
        expect(kneecap(x, s)).toBeGreaterThan(0)
        expect(x.at(`toes${s}`).y).toBeGreaterThan(x.at(`foot${s}`).y + 0.04 * x.s)
        expect(x.at(`upperLeg${s}`).y).toBeLessThan(SEATED * x.s)
        expect(x.at(`hand${s}`).y).toBeLessThan(0.04 * x.s)
      }
      expect(leg(x, 'L').angleTo(leg(x, 'R')) * deg).toBeGreaterThan(115)
      expect(x.angle('hips', 'chest', 'neck')).toBeGreaterThan(155)
    }
    const x = kept(f)
    // Flat: the shoulders and the breastbone are a chest's depth above the floor, well out in front of the hips.
    expect(x.mid('upperArm').y).toBeLessThan(0.15 * x.s)
    expect(x.at('upperChest').y).toBeLessThan(0.16 * x.s)
    expect(x.at('upperChest').y).toBeGreaterThan(0.11 * x.s)
    expect(x.mid('upperArm').z).toBeGreaterThan(x.mid('upperLeg').z + 0.5 * x.s)
    expect(x.crown.y).toBeGreaterThan(0.1 * x.s)
    expect(x.mid('upperArm').y).toBeLessThan(f[0].mid('upperArm').y - 0.08 * x.s)
  })

  it('front split: both legs straight in one line, kneecap up in front and down behind, hips square and on the floor, trunk upright', () => {
    const f = frames['front-split']
    for (const x of f) {
      for (const s of SIDES) {
        expect(knee(x, s)).toBeGreaterThan(174)
        expect(elbow(x, s)).toBeGreaterThan(135)
        // Fingertips on the floor, the wrist well clear of it: the hands steady, they do not carry.
        expect(x.at(`fingers3${s}`).y).toBeLessThan(0.03 * x.s)
        expect(x.at(`hand${s}`).y).toBeGreaterThan(0.08 * x.s)
      }
      expect(leg(x, 'L').z).toBeGreaterThan(0.99 * leg(x, 'L').length())
      expect(leg(x, 'R').z).toBeLessThan(-0.99 * leg(x, 'R').length())
      expect(leg(x, 'L').angleTo(leg(x, 'R')) * deg).toBeGreaterThan(170)
      expect(kneecap(x, 'L')).toBeGreaterThan(0.005 * x.s)
      expect(kneecap(x, 'R')).toBeLessThan(-0.005 * x.s)
      // Behind, the top of the foot is down: the sole, and the toes with it, face up.
      expect(x.at('toesR').y).toBeGreaterThan(x.at('footR').y)
      expect(x.at('footR').y).toBeLessThan(0.06 * x.s)
      // In front, the heel is down and the toes are up.
      expect(x.at('toesL').y).toBeGreaterThan(x.at('footL').y + 0.04 * x.s)
      // Square: neither hip joint ahead of or above the other.
      expect(Math.abs(x.at('upperLegL').z - x.at('upperLegR').z)).toBeLessThan(0.003)
      expect(Math.abs(x.at('upperLegL').y - x.at('upperLegR').y)).toBeLessThan(0.003)
      expect(x.lean('hips', 'upperChest')).toBeLessThan(8)
    }
    const x = kept(f)
    expect(x.mid('upperLeg').y).toBeLessThan(SEATED * x.s)
    expect(x.at('lowerLegR').y).toBeLessThan(0.07 * x.s)
    // Eased off, the hips are a few centimetres up and the legs are just as straight.
    expect(f[0].mid('upperLeg').y).toBeGreaterThan(x.mid('upperLeg').y + 0.02 * x.s)
  })

  it('middle split: both legs straight in one line with the hips between the heels, kneecaps and toes up, pelvis on the floor', () => {
    const f = frames['middle-split']
    for (const x of f) {
      for (const s of SIDES) {
        expect(knee(x, s)).toBeGreaterThan(174)
        expect(kneecap(x, s)).toBeGreaterThan(0.005 * x.s)
        expect(x.at(`toes${s}`).y).toBeGreaterThan(x.at(`foot${s}`).y + 0.04 * x.s)
        expect(elbow(x, s)).toBeGreaterThan(168)
        expect(x.at(`hand${s}`).y).toBeLessThan(0.03 * x.s)
        expect(x.at(`hand${s}`).z).toBeGreaterThan(x.mid('upperLeg').z + 0.2 * x.s)
      }
      expect(Math.abs(leg(x, 'L').x)).toBeGreaterThan(0.99 * leg(x, 'L').length())
      expect(leg(x, 'L').angleTo(leg(x, 'R')) * deg).toBeGreaterThan(172)
      // In line with the heels: the hips have not drifted behind the legs.
      expect(Math.abs(x.mid('upperLeg').z - x.mid('foot').z)).toBeLessThan(0.01 * x.s)
      // The hands support; the trunk is not folded down over them.
      expect(x.lean('hips', 'upperChest')).toBeLessThan(35)
    }
    const x = kept(f)
    expect(x.mid('upperLeg').y).toBeLessThan(SEATED * x.s)
    expect(f[0].mid('upperLeg').y).toBeGreaterThan(x.mid('upperLeg').y + 0.02 * x.s)
  })

  it('straight-leg bridge: arms and legs locked, feet together and flat, hips high, shoulders over the wrists', () => {
    const f = frames['straight-bridge']
    for (const x of f) {
      for (const s of SIDES) {
        expect(elbow(x, s)).toBeGreaterThan(170)
        expect(knee(x, s)).toBeGreaterThan(172)
        expect(Math.abs(x.at(`foot${s}`).y - x.body.ankle)).toBeLessThan(0.002)
        expect(x.at(`toes${s}`).y).toBeLessThan(0.05 * x.s)
      }
      expect(Math.abs(x.at('footL').x - x.at('footR').x)).toBeLessThan(0.12 * x.s)
      expect(x.mid('upperLeg').y).toBeGreaterThan(x.mid('upperArm').y + 0.05 * x.s)
      expect(x.crown.y).toBeGreaterThan(0.08 * x.s)
      // Face up: the hips are between the hands and the feet.
      expect(x.mid('upperLeg').z).toBeGreaterThan(x.mid('hand').z)
      expect(x.mid('upperLeg').z).toBeLessThan(x.mid('foot').z)
    }
    const x = kept(f)
    expect(Math.abs(x.mid('upperArm').z - x.mid('hand').z)).toBeLessThan(0.03 * x.s)
    // Eased off, the shoulders are behind the hands, towards the feet: pressing through brings them over.
    expect(f[0].mid('upperArm').z - f[0].mid('hand').z).toBeGreaterThan(0.04 * x.s)
    // The feet are walked out further than a bent-knee bridge has them: more than a leg's length from the hands.
    expect(x.mid('foot').z - x.mid('hand').z).toBeGreaterThan(x.body.upperLeg + x.body.lowerLeg)
  })
})

describe('the range-of-motion family', () => {
  it('is eight exercises of the library, each with its standard; the positions are held and breathed', () => {
    expect(FLEX).toEqual([hipSwitch, lungeRotation, palmsFloor, seatedPike, pancake, frontSplit, middleSplit, straightBridge])
    for (const m of FLEX) {
      const ex = exerciseById[m.id]
      expect(ex, m.id).toBeDefined()
      expect(ex.discipline).toBe('mobility')
      expect(m.revision).toBe(1)
      if (ex.metric === 'hold') {
        expect(m.kind, m.id).toBe('mobility')
        expect(m.period).toBeGreaterThanOrEqual(5)
        expect(m.period).toBeLessThanOrEqual(7)
      } else {
        expect(m.kind, m.id).toBe('reps')
        expect(m.beat).toBeDefined()
      }
    }
  })

  it('shows one side of a per-side exercise, and says which muscles that leaves out', () => {
    for (const m of [lungeRotation, frontSplit]) {
      expect(exerciseById[m.id].perSide).toBe(true)
      expect(Object.keys(m.detail ?? {}).every((k) => /\.(L|R)$/.test(k))).toBe(true)
    }
  })

  it('only refines the muscles the library names: every corrected channel belongs to one of them', () => {
    for (const m of FLEX) {
      const ex = exerciseById[m.id]
      const muscles = [...ex.primary, ...ex.secondary, ...ex.stabilizers]
      const named = new Set(muscles.flatMap((muscle) => Object.keys(MUSCLE_CHANNELS[muscle])))
      // The library's "delts" is the whole shoulder; a movement may say which head, as the bent-knee bridge does.
      if (muscles.includes('delts')) named.add('delt_post')
      for (const key of Object.keys(m.detail ?? {})) expect(named.has(key.split('.')[0]), `${m.id} ${key}`).toBe(true)
    }
  })
})
