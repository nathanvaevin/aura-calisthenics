import { describe, expect, it } from 'vitest'
import { exerciseById } from '@/domain/catalog'
import { bodyOf } from '../rig'
import { apart } from './inverted'
import { wristHeight } from './kit'
import { PLANCHE, massCentre } from './planche'
import { deg, expectSound, lowest, sample, type Frames } from './testkit'
import type { Prop } from './types'

type Frame = Frames[number]
const SIDE = ['L', 'R'] as const
const byId = Object.fromEntries(PLANCHE.map((m) => [m.id, m]))
const elbow = (x: Frame, s: 'L' | 'R' = 'L') => x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)
const knee = (x: Frame, s: 'L' | 'R' = 'L') => x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)
/** How far the shoulders are in front of the wrists, along the floor. */
const ahead = (x: Frame) => x.mid('upperArm').z - x.mid('hand').z
/** The arms' lean past upright, in degrees. */
const armLean = (x: Frame) => Math.atan2(ahead(x), x.mid('upperArm').y - x.mid('hand').y) * deg
/** How far the middle of the back stands above the straight line from hips to shoulders: the roundness of the back. */
const dome = (x: Frame) => {
  const hip = x.mid('upperLeg'), along = x.mid('upperArm').sub(hip).normalize()
  const off = x.at('chest').sub(hip)
  return off.addScaledVector(along, -off.dot(along)).y
}
/** Degrees a line between two points rises above level, towards the second. */
const rise = (a: { y: number; z: number; x: number }, b: { y: number; z: number; x: number }) => Math.atan2(b.y - a.y, Math.hypot(b.x - a.x, b.z - a.z)) * deg
/** Everything that is not a hand: none of it may touch the floor in a planche. */
const OFF_THE_FLOOR = ['hips', 'head', 'lowerArmL', 'lowerArmR', 'upperLegL', 'upperLegR', 'lowerLegL', 'lowerLegR', 'footL', 'footR', 'toesL', 'toesR'] as const
const PLANCHES = ['tuck-planche', 'adv-tuck-planche', 'straddle-planche', 'full-planche']

describe('the planche family as a set', () => {
  it('is nine exercises of the library, easiest first, each on what the library says it needs', () => {
    expect(PLANCHE.map((m) => m.id)).toEqual([
      'scap-pushup', 'assisted-oa-pushup', 'one-arm-pushup', 'planche-lean', 'tuck-planche', 'adv-tuck-planche', 'straddle-planche', 'full-planche', 'ring-dip',
    ])
    const body = bodyOf('male')
    for (const m of PLANCHE) {
      const ex = exerciseById[m.id]
      expect(ex, m.id).toBeDefined()
      // The scapular push-up was corrected at the owner's first look (revision 2); the rest are as first written.
      expect(m.revision, m.id).toBe(m.id === 'scap-pushup' ? 2 : 1)
      // Counted in the library means repetitions on the stage; timed means a hold.
      expect(m.kind, m.id).toBe(ex.metric === 'reps' ? 'reps' : 'hold')
      // Equipment on the stage is equipment the library lists for the exercise.
      const kinds = (m.props?.(body) ?? []).map((p) => p.kind)
      const allowed = { box: 'box', rings: 'rings', parallettes: 'rails' } as Record<string, Prop['kind']>
      for (const k of kinds) expect(ex.equipment.map((e) => allowed[e]), `${m.id} on ${k}`).toContain(k)
      for (const e of ['box', 'rings'] as const) if (ex.equipment.includes(e)) expect(kinds, m.id).toContain(allowed[e])
    }
    // The planche line gets harder by the lever getting longer.
    for (const [easier, harder] of [['planche-lean', 'tuck-planche'], ['tuck-planche', 'adv-tuck-planche'], ['adv-tuck-planche', 'straddle-planche'], ['straddle-planche', 'full-planche']]) {
      expect(byId[easier].effort(0.5), `${easier} < ${harder}`).toBeLessThan(byId[harder].effort(0.5))
    }
  })
})

describe.each(['male', 'female'] as const)('the planche family, %s character', (who) => {
  const body = bodyOf(who)
  const s = body.scale
  const f = Object.fromEntries(PLANCHE.map((m) => [m.id, sample(m, who)])) as Record<string, Frames>
  const prop = <K extends Prop['kind']>(id: string, kind: K) => byId[id].props!(body).find((p) => p.kind === kind) as Extract<Prop, { kind: K }>
  const shoulderWidth = f['one-arm-pushup'][0].at('upperArmL').x - f['one-arm-pushup'][0].at('upperArmR').x

  it.each(PLANCHE.map((m) => m.id))('%s: sound', (id) => expectSound(byId[id], f[id]))

  it.each(PLANCHE.map((m) => m.id))('%s: ends where it began', (id) => {
    // One more step past the last frame is the first: no jump when the cycle repeats.
    const last = f[id][f[id].length - 1], first = f[id][0]
    for (const b of ['hips', 'head', 'handL', 'handR', 'footL', 'footR', 'lowerArmL', 'lowerLegL'] as const) expect(last.at(b).distanceTo(first.at(b)), `${id} ${b}`).toBeLessThan(0.02 * s)
  })

  it('scapular push-up: the elbows never bend, the body stays one line, and the chest sinks a hand\'s width between the shoulders and is pushed back up', () => {
    const p = f['scap-pushup']
    const top = p[0], low = lowest(p, (x) => x.at('chest').y)
    /** The trunk against the legs: the angle at the hips between the ankles and the ribcage. */
    const fold = (x: Frame) => x.mid('foot').sub(x.mid('upperLeg')).angleTo(x.at('upperChest').sub(x.mid('upperLeg'))) * deg
    for (const x of p) {
      for (const side of SIDE) expect(elbow(x, side), `elbow${side} at ${x.t}`).toBeGreaterThan(172)
      expect(x.at('handL').y).toBeCloseTo(wristHeight(body), 3)
      // The shoulders stay where the locked arms hold them, over the hands.
      expect(Math.abs(x.mid('upperArm').y - top.mid('upperArm').y)).toBeLessThan(0.004)
      expect(Math.abs(ahead(x))).toBeLessThan(0.04 * s)
      // One line from the toes: the trunk does not fold or sag against the legs as it goes down.
      expect(Math.abs(fold(x) - fold(top)), `the body bends at ${x.t}`).toBeLessThan(3)
      // Head and neck go with the chest; the head does not nod.
      expect(Math.abs((top.at('head').y - x.at('head').y) - (top.at('upperChest').y - x.at('upperChest').y))).toBeLessThan(0.02 * s)
    }
    // The range: the chest travels a hand's width, not a centimetre or two.
    const sink = top.at('chest').y - low.at('chest').y
    expect(sink).toBeGreaterThan(0.065 * s)
    expect(sink).toBeLessThan(0.11 * s)
    expect(top.at('upperChest').y - low.at('upperChest').y).toBeGreaterThan(0.065 * s)
    // The hips go with it by their share of a rigid body turning on the toes: less than the chest, and not left behind.
    const hips = top.mid('upperLeg').y - low.mid('upperLeg').y
    expect(hips).toBeGreaterThan(0.45 * sink)
    expect(hips).toBeLessThan(0.95 * sink)
    // What moved is the shoulder blades: at the bottom the shoulder joints stand above the ribcage, at the top it is pushed up between them.
    const proud = (x: Frame) => x.mid('upperArm').y - x.at('upperChest').y
    expect(proud(low) - proud(top)).toBeGreaterThan(0.065 * s)
    // The work is pushing the floor away: hardest at the top.
    expect(byId['scap-pushup'].effort(0)).toBeGreaterThan(byId['scap-pushup'].effort(0.46))
    expect(byId['scap-pushup'].revision).toBe(2)
  })

  it.each(['assisted-oa-pushup', 'one-arm-pushup'])('%s: one arm carries it; shoulders and hips stay square over wide feet', (id) => {
    const p = f[id]
    for (const x of p) {
      expect(x.line()).toBeGreaterThan(176)
      // Hips square to the floor, and the ribcage with them: neither side higher, neither side ahead.
      expect(Math.abs(x.at('upperLegL').y - x.at('upperLegR').y)).toBeLessThan(0.004)
      expect(Math.abs(x.at('upperLegL').z - x.at('upperLegR').z)).toBeLessThan(0.004)
      expect(Math.abs(x.at('shoulderL').y - x.at('shoulderR').y)).toBeLessThan(0.002)
      expect(Math.abs(x.at('shoulderL').z - x.at('shoulderR').z)).toBeLessThan(0.002)
      // The shoulders themselves level, give or take the working one pressing down.
      expect(Math.abs(x.at('upperArmL').y - x.at('upperArmR').y)).toBeLessThan(0.05 * s)
      // No drift to the side.
      expect(Math.abs(x.mid('upperArm').x)).toBeLessThan(0.01 * s)
      expect(Math.abs(x.mid('upperLeg').x)).toBeLessThan(0.01 * s)
      // The free hand is on the back: behind the spine, well clear of the floor and of what the other hand is on.
      const back = x.at('handR').sub(x.at('hips'))
      expect(back.length()).toBeLessThan(0.22 * s)
      expect(x.at('handR').y).toBeGreaterThan(x.at('hips').y + 0.05 * s)
      // The elbow of the working arm stays close to the ribs and never flares.
      expect(x.at('lowerArmL').x - x.at('upperArmL').x).toBeLessThan(0.08 * s)
    }
    // Feet wider than the shoulders, and no wider than double.
    const feet = p[0].at('toesL').x - p[0].at('toesR').x
    expect(feet).toBeGreaterThan(1.3 * shoulderWidth)
    expect(feet).toBeLessThan(2 * shoulderWidth)
    // The top: the arm straight, the hand under its shoulder.
    expect(elbow(p[0])).toBeGreaterThan(170)
    expect(Math.abs(p[0].at('handL').x - p[0].at('upperArmL').x)).toBeLessThan(0.06 * s)
    expect(Math.abs(p[0].at('handL').z - p[0].at('upperArmL').z)).toBeLessThan(0.13 * s)
    // The bottom: a deep bend, the elbow behind the shoulder.
    const low = lowest(p, (x) => x.at('upperArmL').y)
    expect(elbow(low)).toBeLessThan(75)
    expect(low.at('lowerArmL').z).toBeLessThan(low.at('upperArmL').z - 0.15 * s)
  })

  it('one-arm push-up: on the floor, chest to within a fist of it', () => {
    const p = f['one-arm-pushup']
    for (const x of p) expect(x.at('handL').y).toBeCloseTo(wristHeight(body), 3)
    const low = lowest(p, (x) => x.at('upperArmL').y)
    expect(low.at('upperArmL').y).toBeLessThan(0.22 * s)
    expect(low.mid('upperArm').y).toBeLessThan(0.24 * s)
    // And not lying on it.
    expect(low.at('upperChest').y).toBeGreaterThan(0.17 * s)
    expect(low.crown.y).toBeGreaterThan(0.1 * s)
  })

  it('incline one-arm push-up: the hand on a bench at knee height, chest to its edge', () => {
    const p = f['assisted-oa-pushup']
    const box = prop('assisted-oa-pushup', 'box')
    expect(box.height).toBeGreaterThan(body.rest.lowerLegL.y * 0.85)
    expect(box.height).toBeLessThan(body.rest.lowerLegL.y * 1.1)
    for (const x of p) {
      expect(x.at('handL').y).toBeCloseTo(box.height + wristHeight(body), 3)
      expect(x.at('toesL').y).toBeLessThan(0.02)
    }
    // The heel of the hand is on the bench, just inside its edge.
    const edge = box.z - box.depth / 2
    expect(p[0].at('handL').z).toBeGreaterThan(edge)
    expect(p[0].at('handL').z).toBeLessThan(edge + 0.08)
    const low = lowest(p, (x) => x.at('upperArmL').y)
    expect(low.at('upperArmL').y - box.height).toBeLessThan(0.23 * s)
    expect(low.at('upperArmL').y - box.height).toBeGreaterThan(0.12 * s)
    // The chest has come to the edge: the shoulders are over the bench, the hips still short of it.
    expect(low.mid('upperArm').z).toBeGreaterThan(edge)
    expect(low.mid('upperLeg').z).toBeLessThan(edge)
  })

  it('planche lean: arms locked, shoulders in front of the fingertips, a straight body on the toes, the upper back round', () => {
    for (const x of f['planche-lean']) {
      for (const side of SIDE) expect(elbow(x, side)).toBeGreaterThan(172)
      // Clearly in front of the fingertips: by more than the length of a hand again past the last knuckle.
      const tips = Math.max(x.at('fingers3L').z, x.at('fingers3R').z)
      expect(x.mid('upperArm').z - tips).toBeGreaterThan(0.12 * s)
      expect(armLean(x)).toBeGreaterThan(25)
      expect(armLean(x)).toBeLessThan(36)
      // One line from ankles to shoulders: no pike to cheat the lean, no sag.
      expect(x.line()).toBeGreaterThan(177)
      for (const side of SIDE) {
        expect(x.at(`toes${side}`).y).toBeLessThan(0.02)
        expect(x.at(`hand${side}`).y).toBeCloseTo(wristHeight(body), 3)
        expect(knee(x, side)).toBeGreaterThan(170)
      }
      // Shoulder blades pushed apart: the back stands above its own line.
      expect(dome(x)).toBeGreaterThan(0.04 * s)
    }
  })

  it.each(PLANCHES)('%s: arms locked, hips at the height of the shoulders, the weight over the hands and only the hands down', (id) => {
    const rails = byId[id].props ? prop(id, 'rails') : null
    const ground = rails ? rails.height : 0
    for (const x of f[id]) {
      for (const side of SIDE) expect(elbow(x, side), `elbow${side}`).toBeGreaterThan(172)
      expect(Math.abs(x.mid('upperLeg').y - x.mid('upperArm').y), 'hips level with shoulders').toBeLessThan(0.012 * s)
      for (const b of OFF_THE_FLOOR) expect(x.at(b).y, `${b} at ${x.t}`).toBeGreaterThan(0.1 * s)
      // It balances: the weight of the body is over what the hands are on, not behind it.
      const weight = massCentre(x.at).z - x.mid('hand').z
      expect(weight).toBeGreaterThan(-0.04 * s)
      expect(weight).toBeLessThan(0.07 * s)
      // Which takes the shoulders well in front of the hands.
      expect(ahead(x)).toBeGreaterThan(0.17 * s)
      if (rails) {
        // On the parallettes: wrists over the rails, just above them.
        for (const side of SIDE) {
          expect(x.at(`hand${side}`).y - rails.height).toBeGreaterThan(0)
          expect(x.at(`hand${side}`).y - rails.height).toBeLessThan(0.11 * s)
          expect(Math.abs(Math.abs(x.at(`hand${side}`).x) - rails.gap / 2)).toBeLessThan(0.05 * s)
          expect(Math.abs(x.at(`hand${side}`).z - (rails.z ?? 0))).toBeLessThan(rails.length / 2)
        }
      } else for (const side of SIDE) expect(x.at(`hand${side}`).y).toBeCloseTo(ground + wristHeight(body), 3)
    }
  })

  it('the planches lean further as the lever grows', () => {
    const lean = (id: string) => armLean(f[id][0])
    expect(lean('tuck-planche')).toBeGreaterThan(15)
    expect(lean('adv-tuck-planche')).toBeGreaterThan(lean('tuck-planche') + 5)
    expect(lean('straddle-planche')).toBeGreaterThan(lean('adv-tuck-planche') + 8)
    expect(lean('full-planche')).toBeGreaterThan(lean('straddle-planche') + 2)
    expect(lean('full-planche')).toBeLessThan(60)
  })

  it('tuck planche: knees to the chest and clear of the arms, the back round', () => {
    for (const x of f['tuck-planche']) {
      const hip = x.mid('upperLeg')
      // Thighs folded up under the trunk: well under a right angle at the hip.
      expect(x.mid('upperArm').sub(hip).angleTo(x.mid('lowerLeg').sub(hip)) * deg).toBeLessThan(45)
      expect(dome(x)).toBeGreaterThan(0.08 * s)
      for (const side of SIDE) {
        expect(knee(x, side)).toBeLessThan(60)
        // Knees off the arms: more than the thickness of a thigh and an arm between them.
        const thigh = [x.at(`upperLeg${side}`), x.at(`lowerLeg${side}`)] as const, shin = [x.at(`lowerLeg${side}`), x.at(`foot${side}`)] as const
        for (const arm of [[x.at(`upperArm${side}`), x.at(`lowerArm${side}`)], [x.at(`lowerArm${side}`), x.at(`hand${side}`)]] as const) {
          expect(apart(...thigh, ...arm), `thigh${side} on the arm`).toBeGreaterThan(0.105 * s)
          expect(apart(...shin, ...arm), `shin${side} on the arm`).toBeGreaterThan(0.105 * s)
        }
      }
    }
  })

  it('advanced tuck planche: the back flat and level, the hips open to a right angle, thighs upright', () => {
    for (const x of f['adv-tuck-planche']) {
      const hip = x.mid('upperLeg')
      const open = x.mid('upperArm').sub(hip).angleTo(x.mid('lowerLeg').sub(hip)) * deg
      expect(open).toBeGreaterThan(80)
      expect(open).toBeLessThan(100)
      // Flat: less than half the roundness of the tuck.
      expect(dome(x)).toBeLessThan(0.045 * s)
      expect(dome(x)).toBeLessThan(dome(f['tuck-planche'][0]) * 0.5)
      for (const side of SIDE) {
        // The thigh hangs straight down from the hip; the shin is folded up behind it.
        const thigh = x.at(`lowerLeg${side}`).sub(x.at(`upperLeg${side}`))
        expect(Math.atan2(Math.abs(thigh.z), -thigh.y) * deg).toBeLessThan(10)
        expect(knee(x, side)).toBeLessThan(90)
        expect(x.at(`foot${side}`).y).toBeGreaterThan(x.at(`lowerLeg${side}`).y)
        expect(x.at(`foot${side}`).z).toBeLessThan(x.at(`lowerLeg${side}`).z)
      }
    }
    // A longer lever than the tuck: the knees are further behind the hands.
    expect(f['adv-tuck-planche'][0].mid('lowerLeg').z).toBeLessThan(f['tuck-planche'][0].mid('lowerLeg').z - 0.2 * s)
  })

  it.each(['straddle-planche', 'full-planche'])('%s: shoulders, hips and feet in one level line, legs straight', (id) => {
    for (const x of f[id]) {
      expect(x.line()).toBeGreaterThan(177)
      // Level within a few degrees, shoulders to hips and hips to ankles.
      expect(Math.abs(rise(x.mid('upperLeg'), x.mid('upperArm')))).toBeLessThan(3)
      expect(Math.abs(rise(x.mid('upperLeg'), x.mid('foot')))).toBeLessThan(3)
      for (const side of SIDE) {
        expect(knee(x, side)).toBeGreaterThan(172)
        expect(Math.abs(rise(x.at(`upperLeg${side}`), x.at(`foot${side}`)))).toBeLessThan(3)
        // Toes pointed: the ball of the foot carries on behind the ankle.
        expect(x.at(`toes${side}`).z).toBeLessThan(x.at(`foot${side}`).z - 0.06 * s)
      }
      expect(dome(x)).toBeLessThan(0.05 * s)
    }
  })

  it('straddle planche: the legs wide; full planche: the legs together', () => {
    for (const x of f['straddle-planche']) {
      const left = x.at('footL').sub(x.at('upperLegL')), right = x.at('footR').sub(x.at('upperLegR'))
      expect(left.angleTo(right) * deg).toBeGreaterThan(70)
      expect(left.angleTo(right) * deg).toBeLessThan(110)
      expect(Math.abs(x.at('footL').x + x.at('footR').x)).toBeLessThan(0.01)
    }
    for (const x of f['full-planche']) expect(x.at('footL').x - x.at('footR').x).toBeLessThan(0.22 * s)
    // The straddle shortens the lever: it needs less lean than the full planche.
    expect(ahead(f['straddle-planche'][0])).toBeLessThan(ahead(f['full-planche'][0]))
  })

  it('ring dip: locked out in support at the top, shoulders below the elbows at the bottom, the rings close', () => {
    const p = f['ring-dip']
    const rings = prop('ring-dip', 'rings')
    const held = rings.height - rings.radius
    const top = p[0], low = lowest(p, (x) => x.mid('upperArm').y)
    for (const side of SIDE) {
      expect(elbow(top, side)).toBeGreaterThan(172)
      // In support the arms hang straight down beside the body.
      expect(top.lean(`hand${side}`, `upperArm${side}`)).toBeLessThan(10)
      expect(low.at(`upperArm${side}`).y).toBeLessThan(low.at(`lowerArm${side}`).y - 0.005)
      // Elbows behind the shoulders, inside the line of the rings: not flaring.
      expect(low.at(`lowerArm${side}`).z).toBeLessThan(low.at(`upperArm${side}`).z - 0.1 * low.s)
      expect(Math.abs(low.at(`lowerArm${side}`).x)).toBeLessThan(rings.gap / 2)
    }
    // Close to the body: each ring within a hand's breadth of the shoulder's own line.
    expect(rings.gap / 2 - top.at('upperArmL').x).toBeLessThan(0.1 * s)
    expect(rings.gap / 2 - top.at('upperArmL').x).toBeGreaterThan(0.04 * s)
    for (const x of p) {
      for (const side of SIDE) {
        // The hand is round the lowest point of the ring: the wrist just above it, a little inside it.
        const hand = x.at(`hand${side}`)
        expect(hand.y - held).toBeGreaterThan(0.03 * s)
        expect(hand.y - held).toBeLessThan(0.11 * s)
        expect(rings.gap / 2 - Math.abs(hand.x)).toBeGreaterThan(0)
        expect(rings.gap / 2 - Math.abs(hand.x)).toBeLessThan(0.05 * s)
        expect(Math.abs(hand.z - (rings.z ?? 0))).toBeLessThan(0.01)
        // The forearm passes inside the ring and its strap, never through them.
        const fore = x.at(`lowerArm${side}`)
        expect(rings.gap / 2 - Math.abs(fore.x)).toBeGreaterThan(0.02 * s)
      }
      expect(x.lean('hips', 'upperChest')).toBeLessThan(32)
      expect(x.mid('upperArm').z).toBeGreaterThan(x.at('hips').z - 0.02)
    }
    // The shoulders travel: a real dip, not a dip of the head.
    expect(top.mid('upperArm').y - low.mid('upperArm').y).toBeGreaterThan(0.3 * s)
  })

  it('ring dip: the wrists straight over the rings, feet clear of the floor, the legs quiet', () => {
    const p = f['ring-dip']
    const bend = (x: Frame, side: 'L' | 'R') => x.angle(`lowerArm${side}`, `hand${side}`, `fingers1${side}`)
    for (const side of SIDE) expect(bend(p[0], side)).toBeGreaterThan(150)
    for (const x of p) {
      for (const side of SIDE) {
        expect(bend(x, side), `wrist${side} at ${x.t}`).toBeGreaterThan(132)
        expect(knee(x, side)).toBeGreaterThan(172)
      }
      expect(x.at('toesL').y).toBeGreaterThan(0.05)
    }
    const swing = p.map((x) => x.at('footL').z - x.at('hips').z)
    expect(Math.max(...swing) - Math.min(...swing)).toBeLessThan(0.12 * s)
  })
})
