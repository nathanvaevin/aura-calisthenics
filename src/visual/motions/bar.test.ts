import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { BAR, advTuckFrontLever, chestToBar, chinUp, hangingKneeRaise, hangingLegRaise, muscleUp, negativePullup, scapPull, toesToBar, tuckFrontLever } from './bar'
import { highBar } from './hang'
import { STEPS, deg, expectSound, highest, lowest, sample, type Frames } from './testkit'

const elbows = (x: Frames[number]) => Math.min(x.angle('upperArmL', 'lowerArmL', 'handL'), x.angle('upperArmR', 'lowerArmR', 'handR'))
const knees = (x: Frames[number]) => Math.min(x.angle('upperLegL', 'lowerLegL', 'footL'), x.angle('upperLegR', 'lowerLegR', 'footR'))
/** The chin is a little below the joint the head turns on. */
const chin = (x: Frames[number]) => x.at('head').y - 0.02 * x.s

describe.each(['male', 'female'] as const)('on the bar, %s character', (who) => {
  const f = Object.fromEntries(BAR.map((m) => [m.id, sample(m, who)])) as Record<string, Frames>
  const bar = highBar(f['scap-pull'][0].body)
  const centre = new Vector3(0, bar.height, 0)

  it('is the ten bar exercises of the assessment, easiest first', () => {
    expect(BAR.map((m) => m.id)).toEqual(['scap-pull', 'negative-pullup', 'chin-up', 'hanging-knee-raise', 'chest-to-bar', 'hanging-leg-raise', 'toes-to-bar', 'tuck-fl', 'adv-tuck-fl', 'muscle-up'])
  })

  it.each(BAR.map((m) => m.id))('%s: sound, and clear of the floor', (id) => {
    expectSound(BAR.find((m) => m.id === id)!, f[id])
    for (const x of f[id]) expect(Math.min(x.at('toesL').y, x.at('footL').y), `${id} at ${x.t}`).toBeGreaterThan(0.04)
  })

  it.each([scapPull, negativePullup, chinUp, chestToBar, hangingKneeRaise, hangingLegRaise, toesToBar].map((m) => m.id))('%s: hangs under the bar without swinging', (id) => {
    for (const x of f[id]) {
      expect(Math.abs(x.mid('upperLeg').z - x.at('handL').z), `${id} hips at ${x.t}`).toBeLessThan(0.3 * x.s)
      expect(Math.abs(x.mid('upperLeg').x)).toBeLessThan(1e-6)
    }
  })

  it('scapular pull-up: the arms stay locked and the body rises a few centimetres', () => {
    const g = f['scap-pull']
    for (const x of g) expect(elbows(x)).toBeGreaterThan(170)
    const rise = highest(g, (x) => x.at('head').y).at('head').y - lowest(g, (x) => x.at('head').y).at('head').y
    expect(rise).toBeGreaterThan(0.03 * g[0].s)
    expect(rise).toBeLessThan(0.12 * g[0].s)
    // A pause at the top of at least a second.
    const top = highest(g, (x) => x.at('head').y).at('head').y
    expect((g.filter((x) => x.at('head').y > top - 0.002).length / STEPS) * scapPull.period).toBeGreaterThanOrEqual(0.95)
  })

  it('negative pull-up: from the chin over the bar, evenly down for five seconds, to a full hang', () => {
    const g = f['negative-pullup']
    expect(chin(g[0])).toBeGreaterThan(bar.height)
    const down = g.filter((x) => x.t <= 0.72)
    expect(0.72 * negativePullup.period).toBeGreaterThanOrEqual(5)
    const drops = down.slice(1).map((x, i) => down[i].at('head').y - x.at('head').y)
    for (const d of drops) expect(d).toBeGreaterThan(-1e-6)
    // No dropping through the middle: no step falls much faster than the average.
    const mean = drops.reduce((a, b) => a + b, 0) / drops.length
    expect(Math.max(...drops)).toBeLessThan(mean * 2.2)
    const hang = g.find((x) => x.t >= 0.75)!
    expect(elbows(hang)).toBeGreaterThan(170)
  })

  it('chin-up: shoulder-width hands, straight arms at the bottom, chin over the bar at the top', () => {
    const g = f['chin-up']
    expect(elbows(g[0])).toBeGreaterThan(170)
    expect(Math.abs(g[0].at('handL').x - g[0].body.rest.upperArmL.x)).toBeLessThan(0.03 * g[0].s)
    expect(chin(highest(g, (x) => x.at('head').y))).toBeGreaterThan(bar.height)
    // Elbows stay in front of the body at the top.
    const top = highest(g, (x) => x.at('head').y)
    expect(top.at('lowerArmL').z).toBeGreaterThan(top.at('upperArmL').z)
  })

  it('chest-to-bar: higher than a chin-up, the top of the chest at the bar, elbows behind', () => {
    const g = f['chest-to-bar']
    expect(elbows(g[0])).toBeGreaterThan(170)
    const top = highest(g, (x) => x.at('head').y)
    expect(top.at('head').y).toBeGreaterThan(highest(f['chin-up'], (x) => x.at('head').y).at('head').y + 0.08 * top.s)
    // The bar sits between the bottom of the breastbone and the collarbones, just in front of the chest.
    expect(bar.height).toBeGreaterThan(top.at('upperChest').y - 0.03 * top.s)
    expect(bar.height).toBeLessThan(top.at('neck').y)
    expect(-top.at('upperChest').z).toBeGreaterThan(0.08 * top.s)
    expect(-top.at('upperChest').z).toBeLessThan(0.2 * top.s)
    expect(top.at('lowerArmL').z).toBeLessThan(top.at('upperArmL').z)
  })

  it('hanging knee raise: straight arms, knees above the hips', () => {
    const g = f['hanging-knee-raise']
    for (const x of g) expect(elbows(x)).toBeGreaterThan(170)
    const top = highest(g, (x) => x.at('lowerLegL').y)
    expect(top.at('lowerLegL').y).toBeGreaterThan(top.at('upperLegL').y + 0.05 * top.s)
    expect(knees(g[0])).toBeGreaterThan(165)
  })

  it('hanging leg raise: straight legs to level, about three seconds down', () => {
    const g = f['hanging-leg-raise']
    for (const x of g) { expect(elbows(x)).toBeGreaterThan(170); expect(knees(x)).toBeGreaterThan(172) }
    const top = highest(g, (x) => x.at('footL').y)
    const leg = top.at('footL').sub(top.at('upperLegL'))
    expect(Math.abs(Math.atan2(leg.y, leg.z) * deg)).toBeLessThan(6)
    const high = top.at('footL').y, low = lowest(g, (x) => x.at('footL').y).at('footL').y
    const lowering = g.filter((x) => x.t > top.t && x.at('footL').y < high - 0.02 * (high - low) && x.at('footL').y > low + 0.02 * (high - low))
    expect((lowering.length / STEPS) * hangingLegRaise.period).toBeGreaterThan(2.2)
  })

  it('toes-to-bar: straight legs and straight arms, the toes reach the bar', () => {
    const g = f['toes-to-bar']
    for (const x of g) { expect(elbows(x)).toBeGreaterThan(170); expect(knees(x)).toBeGreaterThan(172) }
    const top = highest(g, (x) => x.at('toesL').y)
    // The joint at the base of the toes is a toe's length from the bar.
    expect(top.mid('toes').distanceTo(centre)).toBeLessThan(0.12 * top.s)
    expect(top.mid('toes').distanceTo(centre)).toBeGreaterThan(0.03 * top.s)
    expect(knees(g[0])).toBeGreaterThan(172)
  })

  it.each([tuckFrontLever, advTuckFrontLever].map((m) => m.id))('%s: arms locked, the back level, hips at shoulder height', (id) => {
    for (const x of f[id]) {
      expect(elbows(x)).toBeGreaterThan(170)
      expect(Math.abs(x.mid('upperLeg').y - x.mid('upperArm').y)).toBeLessThan(0.04 * x.s)
      // Under the bar: the hands are over the trunk, between shoulders and hips.
      expect(x.at('handL').z).toBeGreaterThan(x.mid('upperArm').z)
      expect(x.at('handL').z).toBeLessThan(x.mid('upperLeg').z)
    }
  })

  it('tuck front lever: knees tight to the chest', () => {
    for (const x of f['tuck-fl']) {
      expect(knees(x)).toBeLessThan(60)
      // Knee joint to the spine at chest height: the thigh is against the ribs.
      expect(x.mid('lowerLeg').distanceTo(x.at('upperChest'))).toBeLessThan(0.34 * x.s)
    }
  })

  it('advanced tuck front lever: a flat back, hips at a right angle, thighs upright', () => {
    for (const x of f['adv-tuck-fl']) {
      const thigh = x.mid('lowerLeg').sub(x.mid('upperLeg'))
      expect(Math.atan2(Math.abs(thigh.z), thigh.y) * deg).toBeLessThan(10)
      const hip = x.mid('upperArm').sub(x.mid('upperLeg')).angleTo(thigh) * deg
      expect(hip).toBeGreaterThan(80)
      expect(hip).toBeLessThan(102)
      // Flat: the middle of the back is on the line from hips to shoulders.
      expect(Math.abs(x.at('chest').y - (x.at('hips').y + x.at('upperChest').y) / 2)).toBeLessThan(0.02 * x.s)
    }
  })

  it('muscle-up: from a hang, both elbows over together, locked out above the bar', () => {
    const g = f['muscle-up']
    expect(elbows(g[0])).toBeGreaterThan(170)
    expect(g[0].mid('upperArm').y).toBeLessThan(bar.height - 0.4 * g[0].s)
    const top = g.find((x) => x.t >= 0.66)!
    expect(elbows(top)).toBeGreaterThan(168)
    expect(top.mid('upperArm').y).toBeGreaterThan(bar.height + 0.45 * top.s)
    expect(top.mid('upperLeg').y).toBeGreaterThan(bar.height - 0.06 * top.s)
    // On top, the shoulders are over the hands.
    expect(Math.abs(top.mid('upperArm').z - top.at('handL').z)).toBeLessThan(0.08 * top.s)
    const over = g.find((x) => x.t >= 0.43)!
    expect(over.at('lowerArmL').y).toBeGreaterThan(bar.height)
    for (const x of g) {
      // The hands never leave the bar, and the two sides move as one.
      expect(x.at('handL').distanceTo(new Vector3(x.at('handL').x, bar.height, 0))).toBeLessThan(0.13 * x.s)
      expect(Math.abs(x.at('lowerArmL').y - x.at('lowerArmR').y)).toBeLessThan(1e-6)
      expect(Math.abs(x.at('lowerArmL').x + x.at('lowerArmR').x)).toBeLessThan(1e-6)
    }
    expect(muscleUp.planted).toBeUndefined()
  })

  it('knee raise is easier than the leg raise it leads to: the same hang, a shorter lever', () => {
    const k = highest(f['hanging-knee-raise'], (x) => x.at('footL').y), l = highest(f['hanging-leg-raise'], (x) => x.at('footL').y)
    expect(k.at('footL').z).toBeLessThan(l.at('footL').z)
    expect(hangingKneeRaise.period).toBeLessThan(hangingLegRaise.period)
    expect(toesToBar.kind).toBe('reps')
    expect(chestToBar.beat).toBeDefined()
  })
})
