import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { exerciseById } from '@/domain/catalog'
import { activationOf, CHANNELS, slotOf } from '../body/muscles'
import type { BoneName } from '../body/skeleton'
import { chestToBar } from './bar'
import { highBar, pullup } from './hang'
import { PULLS, archerPullup, archerRow, assistedOap, bandPullup, explosivePullup, oneArmBar, oneArmPullup } from './pulls'
import { STEPS, deg, drift, expectSound, highest, lowest, sample, type Frames } from './testkit'

type Frame = Frames[number]
const elbow = (x: Frame, side: 'L' | 'R') => x.angle(`upperArm${side}`, `lowerArm${side}`, `hand${side}`)
const knee = (x: Frame, side: 'L' | 'R') => x.angle(`upperLeg${side}`, `lowerLeg${side}`, `foot${side}`)
/** The chin is a little below the joint the head turns on. */
const chin = (x: Frame) => x.at('head').y - 0.02 * x.s
/** How far the line of the shoulders (or hips) is turned from the bar, seen from above, in degrees. */
const turned = (x: Frame, joint: 'upperArm' | 'upperLeg') => { const v = x.at(`${joint}L`).sub(x.at(`${joint}R`)); return Math.atan2(v.z, v.x) * deg }
/** How far a point is from the straight line between two others. */
const offLine = (p: Vector3, a: Vector3, b: Vector3) => { const d = b.clone().sub(a).normalize(); const r = p.clone().sub(a); return r.addScaledVector(d, -r.dot(d)).length() }
/** How far a point is from a bar that runs across the stage. */
const offBar = (p: Vector3, height: number, z = 0) => Math.hypot(p.y - height, p.z - z)
const top = (g: Frames) => highest(g, (x) => x.at('head').y)
const seconds = (m: { period: number }, frames: number) => (frames / STEPS) * m.period

const ON_THE_HIGH_BAR = [bandPullup, explosivePullup, archerPullup, assistedOap, oneArmPullup]

describe.each(['male', 'female'] as const)('pulling past the pull-up, %s character', (who) => {
  const f = Object.fromEntries(PULLS.map((m) => [m.id, sample(m, who)])) as Record<string, Frames>
  const body = f['band-pullup'][0].body
  const s = body.scale
  const bar = highBar(body)
  /** The one-arm movements hang from a bar a little higher. */
  const one = oneArmBar(body)

  it('is the six movements of the family, easiest first, each an exercise of the library', () => {
    expect(PULLS.map((m) => m.id)).toEqual(['band-pullup', 'archer-row', 'explosive-pullup', 'archer-pullup', 'assisted-oap', 'one-arm-pullup'])
    for (const m of PULLS) {
      expect(exerciseById[m.id], m.id).toBeDefined()
      expect(m.revision).toBe(1)
      expect(m.kind).toBe('reps')
    }
    // Harder by the library's own rating as the list goes on, where it rates them.
    const rated = PULLS.map((m) => exerciseById[m.id].curve?.[0][1]).filter((v): v is number => v !== undefined)
    expect(rated).toEqual([...rated].sort((a, b) => a - b))
  })

  it('lights the muscles the library names: a one-sided movement only takes away from the side that assists', () => {
    for (const m of PULLS) {
      const ex = exerciseById[m.id]
      const plain = activationOf(ex), shown = activationOf(ex, m.detail)
      expect(Math.max(...shown), m.id).toBe(1)
      for (const c of CHANNELS) {
        const [l, r] = [slotOf(c, 'L'), slotOf(c, 'R')]
        // Nothing is lit that the library leaves dark, and the working (left) side is never dimmer than the library has it.
        if (plain[l] === 0) expect(shown[l] + shown[r], `${m.id} ${c}`).toBe(0)
        expect(shown[l], `${m.id} ${c}`).toBeGreaterThanOrEqual(plain[l])
        if (ex.perSide) expect(shown[r], `${m.id} ${c} on the assisting side`).toBeLessThanOrEqual(shown[l])
        else expect(shown[r], `${m.id} ${c}`).toBe(shown[l])
      }
      expect(Object.keys(m.detail ?? {}).some((k) => k.endsWith('.R')), `${m.id} one-sided`).toBe(Boolean(ex.perSide))
    }
  })

  it.each(PULLS.map((m) => m.id))('%s: sound, and one repetition runs into the next without a jump', (id) => {
    const m = PULLS.find((x) => x.id === id)!
    expectSound(m, f[id])
    const g = f[id]
    const joints: BoneName[] = ['hips', 'head', 'handL', 'handR', 'lowerArmL', 'lowerArmR', 'footL', 'footR']
    // An explosive pull is meant to be fast: about 2 m/s at the shoulders, 15 cm between samples, and the trunk
    // comes up through the shoulder blades in the same moment, so the hips and feet travel a little further still.
    const step = (m === explosivePullup ? 0.24 : 0.14) * s
    for (let i = 0; i < g.length; i++) {
      const next = g[(i + 1) % g.length]
      for (const b of joints) expect(g[i].at(b).distanceTo(next.at(b)), `${id} ${b} after ${g[i].t}`).toBeLessThan(step)
    }
    for (const b of joints) expect(g[g.length - 1].at(b).distanceTo(g[0].at(b)), `${id} ${b} at the seam`).toBeLessThan(0.01 * s)
  })

  it.each(ON_THE_HIGH_BAR.map((m) => m.id))('%s: feet clear of the floor, legs straight', (id) => {
    for (const x of f[id]) {
      expect(Math.min(x.at('toesL').y, x.at('footL').y, x.at('toesR').y, x.at('footR').y), `${id} at ${x.t}`).toBeGreaterThan(0.04)
      expect(Math.min(knee(x, 'L'), knee(x, 'R')), `${id} knees at ${x.t}`).toBeGreaterThan(172)
    }
  })

  // ── Band-assisted pull-up ──

  it('band pull-up: a full pull-up, dead hang to chin over the bar, the shoulders set before the elbows bend', () => {
    const g = f['band-pullup']
    expect(Math.min(elbow(g[0], 'L'), elbow(g[0], 'R'))).toBeGreaterThan(170)
    expect(chin(top(g))).toBeGreaterThan(bar.height)
    // While the arms are still straight the body has already risen on the shoulder blades.
    const set = g.filter((x) => x.t < 0.2 && elbow(x, 'L') > 170)
    expect(Math.max(...set.map((x) => x.at('head').y)) - g[0].at('head').y).toBeGreaterThan(0.02 * s)
    for (const x of g) {
      expect(Math.abs(x.mid('upperArm').x)).toBeLessThan(1e-6)
      expect(Math.abs(x.at('hips').z - x.at('handL').z), `swing at ${x.t}`).toBeLessThan(0.3 * s)
    }
    // Lowered under control: the way down takes as long as the way up.
    const high = top(g).at('head').y, low = g[0].at('head').y
    const moving = (x: Frame) => x.at('head').y > low + 0.05 * (high - low) && x.at('head').y < high - 0.05 * (high - low)
    expect(g.filter((x) => x.t > top(g).t && moving(x)).length).toBeGreaterThanOrEqual(g.filter((x) => x.t < top(g).t && moving(x)).length - 1)
  })

  it('band pull-up: the band runs from the middle of the bar to under one foot, in front of the body, and that leg stays straight and still', () => {
    const g = f['band-pullup']
    const band = bandPullup.props!(body).find((p) => p.kind === 'band')
    expect(band).toMatchObject({ kind: 'band', x: 0, height: bar.height, to: 'toesR' })
    if (band?.kind !== 'band') throw new Error('no band')
    const from = new Vector3(band.x, band.height, band.z ?? 0)
    const forward = (x: Frame) => { const leg = x.at('footR').sub(x.at('upperLegR')); return Math.atan2(leg.z, -leg.y) * deg }
    for (const x of g) {
      const foot = x.at('toesR')
      // Under the middle of the bar, in front of the hips, the sole pressing down: not a pointed foot.
      expect(Math.abs(foot.x)).toBeLessThan(0.03 * s)
      expect(foot.z - x.at('hips').z).toBeGreaterThan(0.25 * s)
      expect(Math.abs(x.at('toesR').y - x.at('footR').y - body.ball.y)).toBeLessThan(0.04 * s)
      expect(knee(x, 'R')).toBeGreaterThan(172)
      // The band passes in front of the face and the chest, not through them.
      expect(offLine(x.at('head').add(new Vector3(0, 0, 0.1 * s)), from, foot), `face at ${x.t}`).toBeGreaterThan(0.02 * s)
      expect(offLine(x.at('upperChest').add(new Vector3(0, 0, 0.13 * s)), from, foot), `chest at ${x.t}`).toBeGreaterThan(0.01 * s)
      for (const b of ['head', 'neck', 'upperChest', 'chest', 'hips'] as BoneName[]) {
        const t = (x.at(b).y - from.y) / (foot.y - from.y)
        if (t > 0 && t < 1) expect(lerpZ(from, foot, t) - x.at(b).z, `${b} at ${x.t}`).toBeGreaterThan(0.11 * s)
      }
    }
    // No kick: the banded leg holds its angle to within a few degrees.
    expect(Math.max(...g.map(forward)) - Math.min(...g.map(forward))).toBeLessThan(6)
    expect(Math.min(...g.map(forward))).toBeGreaterThan(15)
  })

  // ── Archer row ──

  it('archer row: a straight body on its heels, both arms straight at the bottom, the assisting arm straight the whole way', () => {
    const g = f['archer-row']
    expect(elbow(g[0], 'L')).toBeGreaterThan(170)
    for (const x of g) {
      expect(x.line(), `line at ${x.t}`).toBeGreaterThan(172)
      expect(elbow(x, 'R'), `assisting elbow at ${x.t}`).toBeGreaterThan(170)
      // Heels stay where they are, on the floor; the hips stay off it.
      expect(Math.max(x.at('footL').y, x.at('footR').y)).toBeLessThan(0.12 * s)
      expect(x.at('hips').y).toBeGreaterThan(0.12 * s)
    }
    expect(drift(g.map((x) => x.mid('foot')))).toBeLessThan(0.004)
    expect(drift(g.map((x) => x.at('footL')))).toBeLessThan(0.03 * s)
  })

  it('archer row: wide hands that do not slide; the chest is rowed to the working hand', () => {
    const g = f['archer-row']
    const rail = archerRow.props!(body)[0]
    if (rail.kind !== 'bar') throw new Error('no bar')
    // Wide: each hand well outside its shoulder in the hang.
    expect(g[0].at('handL').x - g[0].at('upperArmL').x).toBeGreaterThan(0.25 * s)
    for (const side of ['L', 'R'] as const) {
      expect(drift(g.map((x) => x.at(`fingers1${side}`))), `hand${side} slides`).toBeLessThan(0.035 * s)
      for (const x of g) expect(offBar(x.at(`fingers1${side}`), rail.height, rail.z), `hand${side} off the bar at ${x.t}`).toBeLessThan(0.045 * s)
    }
    const high = highest(g, (x) => x.mid('upperArm').y)
    // The shoulders have travelled to the working side, and the working shoulder is at its hand.
    expect(high.mid('upperArm').x - g[0].mid('upperArm').x).toBeGreaterThan(0.15 * s)
    expect(Math.abs(high.at('upperArmL').x - high.at('handL').x)).toBeLessThan(0.16 * s)
    expect(high.at('upperArmL').distanceTo(high.at('handL'))).toBeLessThan(0.3 * s)
    expect(elbow(high, 'L')).toBeLessThan(60)
    // The elbow of the working arm goes back behind the body, not out to the side.
    expect(high.at('lowerArmL').y).toBeLessThan(high.at('upperArmL').y)
    // The chest is at the bar and not through it: the bar a chest's depth from the breastbone.
    const gap = offBar(high.at('upperChest'), rail.height, rail.z)
    expect(gap).toBeGreaterThan(0.11 * s)
    expect(gap).toBeLessThan(0.22 * s)
    expect(g[0].mid('upperArm').y).toBeLessThan(high.mid('upperArm').y - 0.2 * s)
  })

  it('archer row: hips and shoulders stay level and move as one, turned on the heels and not rolled', () => {
    for (const x of f['archer-row']) {
      expect(Math.abs(x.at('upperLegL').y - x.at('upperLegR').y), `hips at ${x.t}`).toBeLessThan(0.005 * s)
      expect(Math.abs(x.at('upperArmL').y - x.at('upperArmR').y), `shoulders at ${x.t}`).toBeLessThan(0.04 * s)
      expect(Math.abs(turned(x, 'upperLeg')), `turn at ${x.t}`).toBeLessThan(15)
      expect(Math.abs(turned(x, 'upperArm') - turned(x, 'upperLeg')), `twist at ${x.t}`).toBeLessThan(6)
    }
  })

  // ── Archer pull-up ──

  it('archer pull-up: from a wide dead hang in the middle to the chin over the bar at the working hand', () => {
    const g = f['archer-pullup']
    expect(Math.min(elbow(g[0], 'L'), elbow(g[0], 'R'))).toBeGreaterThan(170)
    expect(Math.abs(g[0].mid('upperArm').x)).toBeLessThan(0.005 * s)
    expect(g[0].at('handL').x - g[0].at('upperArmL').x).toBeGreaterThan(0.3 * s)
    const high = top(g)
    expect(chin(high)).toBeGreaterThan(bar.height)
    // The head has come across to the working hand: as near to it as the chin is to either hand at the top of a pull-up.
    const plain = top(sample(pullup, who))
    expect(high.at('head').x).toBeGreaterThan(0.2 * s)
    expect(high.at('handL').x - high.at('head').x).toBeLessThan(plain.at('handL').x - plain.at('head').x + 0.02 * s)
    // The trunk leans that way, head towards the working hand, without the hips swinging out from under the bar.
    expect(high.at('head').x).toBeGreaterThan(high.mid('upperLeg').x)
    expect(high.at('head').x - high.mid('upperLeg').x).toBeLessThan(0.12 * s)
    // The working arm finishes as a pull-up's does: fully bent but no tighter, the shoulder just inside its hand,
    // the elbow below the shoulder and out to the side, not poking forward and not level with the shoulder.
    expect(elbow(high, 'L')).toBeLessThan(45)
    expect(elbow(high, 'L')).toBeGreaterThanOrEqual(plain.angle('upperArmL', 'lowerArmL', 'handL'))
    expect(high.at('handL').x - high.at('upperArmL').x).toBeGreaterThan(0.08 * s)
    expect(high.at('handL').x - high.at('upperArmL').x).toBeLessThan(0.18 * s)
    const upper = high.at('lowerArmL').sub(high.at('upperArmL'))
    expect(-upper.y).toBeGreaterThanOrEqual(plain.at('upperArmL').y - plain.at('lowerArmL').y)
    expect(upper.x).toBeGreaterThan(0.15 * s)
    expect(Math.abs(upper.z)).toBeLessThan(0.08 * s)
    // Back to the middle at the end.
    expect(Math.abs(g[g.length - 1].mid('upperArm').x)).toBeLessThan(0.005 * s)
  })

  it('archer pull-up: the assisting arm stays straight and ends along the bar; the hands do not slide; the body does not twist', () => {
    const g = f['archer-pullup']
    for (const x of g) {
      expect(elbow(x, 'R'), `assisting elbow at ${x.t}`).toBeGreaterThan(170)
      // The shoulder joints ride on their blades, one pulled back and one reaching: a few degrees. The trunk itself does not turn.
      expect(Math.abs(turned(x, 'upperArm')), `shoulders twist at ${x.t}`).toBeLessThan(6)
      expect(Math.abs(turned(x, 'upperLeg')), `hips twist at ${x.t}`).toBeLessThan(0.5)
      expect(Math.abs(x.at('hips').z - x.at('handL').z), `swing at ${x.t}`).toBeLessThan(0.3 * s)
    }
    for (const side of ['L', 'R'] as const) {
      expect(drift(g.map((x) => x.at(`fingers1${side}`))), `hand${side} slides`).toBeLessThan(0.035 * s)
      for (const x of g) expect(offBar(x.at(`fingers1${side}`), bar.height), `hand${side} off the bar at ${x.t}`).toBeLessThan(0.045 * s)
    }
    const arm = top(g).at('handR').sub(top(g).at('upperArmR'))
    expect(Math.atan2(Math.hypot(arm.y, arm.z), Math.abs(arm.x)) * deg).toBeLessThan(15)
    // It is below the bar, not through it.
    expect(top(g).at('lowerArmR').y).toBeLessThan(bar.height - 0.04 * s)
    // The body rises more and more steeply as it swings round the straight arm: no step sideways first, no drop.
    const rising = g.filter((x) => x.t <= top(g).t)
    for (let i = 1; i < rising.length; i++) expect(rising[i].at('head').y - rising[i - 1].at('head').y).toBeGreaterThan(-1e-4)
  })

  // ── Assisted one-arm pull-up ──

  it('assisted one-arm pull-up: the free hand holds the band at least a forearm below the bar and never climbs', () => {
    const g = f['assisted-oap']
    const band = assistedOap.props!(body).find((p) => p.kind === 'band')
    if (band?.kind !== 'band') throw new Error('no band')
    expect(band.to).toBe('fingers1R')
    expect(band.height).toBe(one.height)
    for (const x of g) {
      for (const b of ['handR', 'fingers1R'] as BoneName[]) expect(one.height - x.at(b).y, `${b} at ${x.t}`).toBeGreaterThan(body.lowerArm + 0.03 * s)
      // The band hangs beside the working hand, between it and the face.
      expect(x.at('handL').x - band.x).toBeGreaterThan(0.06 * s)
      expect(x.at('handL').x - band.x).toBeLessThan(0.15 * s)
      // The hand that holds it is in front of the head and the chest, not in them.
      expect(x.at('handR').distanceTo(x.at('head')), `hand and head at ${x.t}`).toBeGreaterThan(0.13 * s)
      expect(x.at('handR').z - x.at('upperChest').z, `hand and chest at ${x.t}`).toBeGreaterThan(0.13 * s)
    }
    expect(drift(g.map((x) => x.at('handR')))).toBeLessThan(0.004)
    expect(assistedOap.planted).toEqual(['handL', 'handR'])
  })

  it('assisted one-arm pull-up: from a straight arm with the shoulder set to the chin over the bar, the chest facing the bar', () => {
    const g = f['assisted-oap']
    expect(elbow(g[0], 'L')).toBeGreaterThan(170)
    // Packed at the bottom: lower from the ear than a relaxed one-arm hang.
    const relaxed = f['one-arm-pullup'][0]
    expect(g[0].at('head').y - g[0].at('upperArmL').y).toBeGreaterThan(relaxed.at('head').y - relaxed.at('upperArmL').y + 0.02 * s)
    const high = top(g)
    expect(chin(high)).toBeGreaterThan(one.height)
    expect(elbow(high, 'L')).toBeLessThan(45)
    for (const x of g) {
      expect(Math.abs(turned(x, 'upperArm')), `turn at ${x.t}`).toBeLessThan(15)
      expect(Math.abs(x.at('hips').z - x.at('handL').z), `swing at ${x.t}`).toBeLessThan(0.3 * s)
      expect(Math.abs(x.at('hips').x - x.at('handL').x), `swing at ${x.t}`).toBeLessThan(0.25 * s)
    }
  })

  // ── One-arm pull-up ──

  it('one-arm pull-up: one hand on the bar and nothing else', () => {
    const g = f['one-arm-pullup']
    expect(oneArmPullup.planted).toEqual(['handL'])
    expect(oneArmPullup.props!(body)).toEqual([{ kind: 'bar', ...one }])
    // Set higher than the pull-up bar only by what hanging on one straight arm costs.
    expect(one.height - bar.height).toBeLessThan(0.12 * s)
    for (const x of g) {
      // The free hand is down by the hip: nowhere near the bar, the working wrist or the working arm.
      expect(one.height - x.at('handR').y, `free hand at ${x.t}`).toBeGreaterThan(0.5 * s)
      expect(x.at('handR').distanceTo(x.at('handL'))).toBeGreaterThan(0.5 * s)
      expect(x.at('handR').distanceTo(x.at('lowerArmL')), `free hand and working elbow at ${x.t}`).toBeGreaterThan(0.25 * s)
      expect(x.at('handR').y).toBeLessThan(x.at('upperArmR').y - 0.4 * s)
    }
  })

  it('one-arm pull-up: dead hang, shoulder set before the elbow bends, chin over the bar, elbow down by the hip', () => {
    const g = f['one-arm-pullup']
    expect(elbow(g[0], 'L')).toBeGreaterThan(170)
    // Hanging straight under the hand.
    expect(Math.abs(g[0].at('upperArmL').x - g[0].at('handL').x)).toBeLessThan(0.01 * s)
    const set = g.filter((x) => x.t < 0.2 && elbow(x, 'L') > 170)
    expect(Math.max(...set.map((x) => x.at('head').y)) - g[0].at('head').y).toBeGreaterThan(0.02 * s)
    const high = top(g)
    expect(chin(high)).toBeGreaterThan(one.height)
    expect(elbow(high, 'L')).toBeLessThan(45)
    // The elbow is under the hand and in front of the shoulder, beside the ribs: not flared out to the side.
    expect(high.at('lowerArmL').y).toBeLessThan(high.at('upperArmL').y - 0.15 * s)
    expect(high.at('lowerArmL').x - high.at('upperArmL').x).toBeLessThan(0.1 * s)
    expect(high.at('lowerArmL').z).toBeGreaterThan(high.at('upperArmL').z)
    // Lowered to a straight arm.
    expect(elbow(g[g.length - 1], 'L')).toBeGreaterThan(170)
  })

  it('one-arm pull-up: the body turns a little towards the working arm, and does not swing or kick', () => {
    const g = f['one-arm-pullup']
    // Towards the left arm: the right shoulder comes forward. A little: well short of side-on.
    expect(-turned(g[0], 'upperArm')).toBeLessThan(12)
    expect(-turned(top(g), 'upperArm')).toBeGreaterThan(15)
    for (const x of g) {
      expect(-turned(x, 'upperArm'), `turn at ${x.t}`).toBeGreaterThan(0)
      expect(-turned(x, 'upperArm'), `turn at ${x.t}`).toBeLessThan(45)
      // The hips stay under the hand.
      expect(Math.abs(x.mid('upperLeg').x - x.at('handL').x), `hips at ${x.t}`).toBeLessThan(0.14 * s)
      expect(Math.abs(x.mid('upperLeg').z - x.at('handL').z), `hips at ${x.t}`).toBeLessThan(0.25 * s)
      // The legs hang together from the hips, a little in front: no kick.
      const leg = x.mid('foot').sub(x.mid('upperLeg'))
      expect(Math.atan2(Math.hypot(leg.x, leg.z), -leg.y) * deg, `legs at ${x.t}`).toBeLessThan(24)
    }
  })

  // ── Explosive pull-up ──

  it('explosive pull-up: from a still dead hang, pulled until the bar is at the lower chest', () => {
    const g = f['explosive-pullup']
    expect(Math.min(elbow(g[0], 'L'), elbow(g[0], 'R'))).toBeGreaterThan(170)
    const high = top(g)
    // The bar is below the top of the breastbone and above the waist, just in front of the trunk.
    expect(bar.height).toBeLessThan(high.at('upperChest').y - 0.02 * s)
    expect(bar.height).toBeGreaterThan(high.at('hips').y + 0.1 * s)
    expect(high.mid('upperArm').y - bar.height).toBeGreaterThan(0.15 * s)
    const trunk = offLine(new Vector3(0, bar.height, 0), high.at('chest'), high.at('upperChest'))
    expect(trunk).toBeGreaterThan(0.1 * s)
    expect(trunk).toBeLessThan(0.2 * s)
    // Well above a chest-to-bar pull-up.
    expect(high.mid('upperArm').y).toBeGreaterThan(top(sample(chestToBar, who)).mid('upperArm').y + 0.1 * s)
  })

  it('explosive pull-up: fast up, hollow and leaning back round the bar, the hands keeping hold', () => {
    const g = f['explosive-pullup']
    const high = top(g)
    const low = g[0].at('head').y, range = high.at('head').y - low
    const up = g.filter((x) => x.t < high.t && x.at('head').y > low + 0.03 * range)
    const down = g.filter((x) => x.t > high.t && x.at('head').y > low + 0.03 * range && x.at('head').y < high.at('head').y - 0.03 * range)
    expect(seconds(explosivePullup, up.length + 1)).toBeLessThan(0.7)
    expect(down.length).toBeGreaterThanOrEqual(up.length * 1.6)
    // Round the bar, not straight up into it: the shoulders finish behind the bar, the hips and feet in front of them.
    expect(high.mid('upperArm').z).toBeLessThan(-0.12 * s)
    expect(high.mid('upperLeg').z).toBeGreaterThan(high.mid('upperArm').z + 0.1 * s)
    expect(high.mid('foot').z).toBeGreaterThan(high.mid('upperLeg').z + 0.15 * s)
    // The elbows finish behind the body.
    expect(high.at('lowerArmL').z).toBeLessThan(high.at('upperArmL').z)
    for (const x of g) {
      // The head never passes through the line of the bar on the way.
      if (Math.abs(x.at('head').y - bar.height) < 0.1 * s) expect(x.at('head').z, `head at ${x.t}`).toBeLessThan(-0.1 * s)
      for (const side of ['L', 'R'] as const) {
        expect(offBar(x.at(`fingers1${side}`), bar.height), `hand${side} at ${x.t}`).toBeLessThan(0.05 * s)
        expect(Math.abs(Math.abs(x.at(`fingers1${side}`).x) - Math.abs(g[0].at(`fingers1${side}`).x))).toBeLessThan(0.005 * s)
      }
      expect(Math.abs(x.at('lowerArmL').y - x.at('lowerArmR').y)).toBeLessThan(1e-6)
      expect(Math.abs(x.mid('upperLeg').x)).toBeLessThan(1e-6)
    }
  })

  it('explosive pull-up: a full reset in the hang before the next one', () => {
    const g = f['explosive-pullup']
    const still = g.filter((x) => x.t > top(g).t && Math.min(elbow(x, 'L'), elbow(x, 'R')) > 170 && Math.abs(x.at('hips').z - g[0].at('hips').z) < 0.01 * s)
    expect(seconds(explosivePullup, still.length)).toBeGreaterThan(0.9)
    expect(explosivePullup.beat).toBeCloseTo(top(g).t, 1)
    expect(lowest(g, (x) => x.at('head').y).at('head').y).toBeGreaterThan(g[0].at('head').y - 0.03 * s)
  })
})

function lerpZ(a: Vector3, b: Vector3, t: number) { return a.z + (b.z - a.z) * t }
