import { describe, expect, it } from 'vitest'
import type { Vector3 } from 'three'
import type { CharacterId } from '../body/skeleton'
import { Rig, emptyPose } from '../rig'
import { BALANCE, centreOf, freestandingHspu, headstand, heelPulls, oneArmHs, pressHs, straddleHs, tuckHs, wallHspuNegative, wristPrep } from './balance'
import { SIDES, STEPS, deg, drift, expectSound, highest, lowest, sample } from './testkit'
import type { Motion } from './types'
import { handstand } from './holds'
import { heelBack } from './inverted'

const wallOf = (m: Motion, who: CharacterId) => (m.props!(new Rig(who).body).find((p) => p.kind === 'wall') as { z: number }).z

/** The centre of mass through a cycle: the test kit keeps joints only. */
function weights(m: Motion, who: CharacterId) {
  const rig = new Rig(who)
  const pose = emptyPose()
  return Array.from({ length: STEPS }, (_, i) => { m.pose(i / STEPS, rig, pose); rig.solve(pose); return centreOf(rig) })
}
function heels(m: Motion, who: CharacterId) {
  const rig = new Rig(who)
  const pose = emptyPose()
  return Array.from({ length: STEPS }, (_, i) => { m.pose(i / STEPS, rig, pose); rig.solve(pose); return SIDES.map((s) => heelBack(rig, s)) })
}

/** How far the line from the middle of the hands to the middle of the feet is from vertical, degrees. */
const upright = (x: ReturnType<typeof sample>[number]) => { const v = x.mid('foot').sub(x.mid('hand')); return Math.atan2(Math.hypot(v.x, v.z), v.y) * deg }
const elbow = (x: ReturnType<typeof sample>[number], s: 'L' | 'R') => x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)
const locked = (x: ReturnType<typeof sample>[number], at = 170) => { for (const s of SIDES) expect(elbow(x, s), `elbow${s} at ${x.t}`).toBeGreaterThan(at) }

describe.each(['male', 'female'] as const)('upside down beyond the first handstand, %s character', (who) => {
  const frames = Object.fromEntries(BALANCE.map((m) => [m.id, sample(m, who)]))

  it.each(BALANCE.map((m) => m.id))('%s: sound', (id) => {
    expectSound(BALANCE.find((m) => m.id === id)!, frames[id])
  })

  it.each(BALANCE.map((m) => m.id))('%s: one cycle runs into the next without a jump', (id) => {
    // Sampled finely, round the end of the cycle and into the next: nothing pops, and nothing is flung.
    const m = BALANCE.find((x) => x.id === id)!
    const rig = new Rig(who)
    const pose = emptyPose()
    const fine = 960
    const joints = ['hips', 'head', 'handL', 'handR', 'footL', 'footR', 'toesL', 'toesR', 'lowerArmL', 'lowerArmR', 'lowerLegL', 'lowerLegR'] as const
    let before: Vector3[] | undefined
    let furthest = 0
    for (let i = 0; i <= fine; i++) {
      m.pose((i % fine) / fine, rig, pose)
      rig.solve(pose)
      const now = joints.map((j) => rig.pos[j].clone())
      if (before) furthest = Math.max(furthest, ...now.map((p, k) => p.distanceTo(before![k])))
      before = now
    }
    // The fastest thing in the family is the foot of a kick-up, at about four and a half metres a second.
    expect(furthest / (m.period / fine), 'metres per second').toBeLessThan(5)
  })

  it('every handstand here holds its head as the freestanding handstand does: lifted, eyes on the floor between the hands', () => {
    // How far the head is tipped back from the line of the trunk, in degrees.
    const lifted = (x: (typeof frames)[string][number]) => x.crown.clone().sub(x.at('head')).angleTo(x.mid('upperArm').sub(x.mid('upperLeg'))) * deg
    const own = lifted(sample(handstand, who)[0])
    expect(own).toBeGreaterThan(35)
    const at = (m: Motion, t: number) => frames[m.id][Math.round(t * STEPS) % STEPS]
    // Each at the moment it is a handstand on locked arms: balanced off the wall, held, at the top of the press or the push-up.
    for (const [m, t] of [[heelPulls, 0.5], [straddleHs, 0], [tuckHs, 0], [pressHs, 0.52], [freestandingHspu, 0], [wallHspuNegative, 0], [oneArmHs, 0]] as const) {
      expect(Math.abs(lifted(at(m, t)) - own), `${m.id}: head lifted ${lifted(at(m, t)).toFixed(0)}°, the handstand's ${own.toFixed(0)}°`).toBeLessThan(5)
      // Lifted towards the back, so that the face is turned to the floor: the crown is behind the neck.
      expect(at(m, t).crown.z, m.id).toBeGreaterThan(at(m, t).at('neck').z)
    }
    // And where the shape is the straight one, the shoulders are open: arms by the ears, in line with the trunk.
    for (const [m, t] of [[heelPulls, 0.5], [straddleHs, 0], [pressHs, 0.52], [freestandingHspu, 0]] as const) {
      for (const s of SIDES) expect(at(m, t).angle(`lowerArm${s}`, `upperArm${s}`, `upperLeg${s}`), `${m.id}: shoulder${s} closed`).toBeGreaterThan(170)
    }
  })

  it('is the nine exercises of the family, easiest first', () => {
    expect(BALANCE.map((m) => m.id)).toEqual(['wrist-prep', 'heel-pulls', 'headstand', 'wall-hspu-negative', 'tuck-hs', 'straddle-hs', 'press-hs', 'freestanding-hspu', 'one-arm-hs'])
    for (const m of BALANCE) expect(m.revision).toBe(1)
  })

  it('wrist preparation: hands flat and still, arms straight, the shoulders rock past the fingers, back, and to each side', () => {
    const f = frames[wristPrep.id]
    const knuckles = (x: (typeof f)[number]) => (x.at('fingers1L').z + x.at('fingers1R').z) / 2
    for (const x of f) {
      locked(x, 168)
      // Flat: the knuckles are on the floor with the wrist, the heel of the hand down.
      for (const s of SIDES) expect(x.at(`fingers1${s}`).y, `fingers${s} at ${x.t}`).toBeLessThan(0.035 * x.s)
      // The knees stay under the hips (within a hand or so) and on the floor.
      for (const s of SIDES) expect(x.at(`lowerLeg${s}`).y).toBeLessThan(0.07 * x.s)
    }
    const start = f[0]
    expect(Math.abs(start.mid('upperArm').z - start.mid('hand').z)).toBeLessThan(0.03 * start.s)
    const fwd = highest(f, (x) => x.mid('upperArm').z), back = lowest(f, (x) => x.mid('upperArm').z)
    // Forward: the shoulders over the fingers, past the knuckles.
    expect(fwd.mid('upperArm').z).toBeGreaterThan(knuckles(fwd) - 0.01 * fwd.s)
    expect(back.mid('upperArm').z).toBeLessThan(back.mid('hand').z - 0.05 * back.s)
    const left = highest(f, (x) => x.mid('upperArm').x), right = lowest(f, (x) => x.mid('upperArm').x)
    expect(left.mid('upperArm').x).toBeGreaterThan(0.06 * left.s)
    expect(right.mid('upperArm').x).toBeLessThan(-0.06 * right.s)
    // One rock at a time: no sideways while going forward.
    expect(Math.abs(fwd.mid('upperArm').x)).toBeLessThan(0.01)
    expect(f[f.length - 1].mid('upperArm').distanceTo(start.mid('upperArm'))).toBeLessThan(0.02 * start.s)
  })

  it('heel pulls: from heels on the wall to a stacked line over the hands, without bending, and back', () => {
    const f = frames[heelPulls.id]
    const wall = wallOf(heelPulls, who)
    const on = heels(heelPulls, who)
    for (const h of on[0]) expect(Math.abs(h.z - wall)).toBeLessThan(0.012)
    for (const x of f) {
      locked(x, 172)
      expect(x.line(), `line at ${x.t}`).toBeGreaterThan(173)
      for (const s of SIDES) expect(x.at(`upperLeg${s}`).z).toBeLessThan(wall)
    }
    for (const step of on) for (const h of step) expect(h.z - wall, 'a heel through the wall').toBeLessThan(0.004)
    // In balance: the heels well off the wall, ankles over the hips over the shoulders over the wrists.
    const off = f[Math.round(STEPS * 0.5)]
    const heelsOff = on[Math.round(STEPS * 0.5)]
    for (const h of heelsOff) expect(wall - h.z).toBeGreaterThan(0.08 * off.s)
    expect(upright(off)).toBeLessThan(3)
    for (const j of ['upperArm', 'upperLeg', 'foot']) expect(Math.abs(off.mid(j).z - off.mid('hand').z), j).toBeLessThan(0.05 * off.s)
    // No push from the feet: the toes never travel away from the body, and the hips never fold.
    for (const x of f) for (const s of SIDES) expect(x.angle(`upperArm${s}`, `upperLeg${s}`, `foot${s}`)).toBeGreaterThan(170)
  })

  it('headstand: crown and hands an even triangle, head ahead of the hands, elbows at right angles over the wrists, legs vertical', () => {
    for (const x of frames[headstand.id]) {
      const hands = x.mid('hand')
      const width = x.at('handL').x - x.at('handR').x
      // The crown rests on the floor, ahead of the hands by about the width between them.
      expect(x.crown.y).toBeLessThan(0.03 * x.s)
      expect(x.crown.y).toBeGreaterThan(-0.004)
      const ahead = x.crown.z - hands.z
      expect(ahead).toBeGreaterThan(0.55 * width)
      expect(ahead).toBeLessThan(1.25 * width)
      expect(Math.abs(x.crown.x)).toBeLessThan(0.01)
      for (const s of SIDES) {
        const e = elbow(x, s)
        expect(e).toBeGreaterThan(78)
        expect(e).toBeLessThan(102)
        // The forearm upright over the hand, the elbow not flared outside the wrist.
        expect(x.lean(`hand${s}`, `lowerArm${s}`)).toBeLessThan(12)
        expect(Math.abs(x.at(`lowerArm${s}`).x)).toBeLessThan(Math.abs(x.at(`hand${s}`).x) + 0.03 * x.s)
        expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(173)
      }
      // Hips over the shoulders, legs straight up.
      expect(Math.abs(x.mid('upperLeg').z - x.mid('upperArm').z)).toBeLessThan(0.07 * x.s)
      expect(x.lean('upperLegL', 'footL')).toBeLessThan(5)
      expect(x.line()).toBeGreaterThan(172)
    }
  })

  it('tuck handstand: arms locked, thighs below horizontal, knees to the chest, the weight over the hands', () => {
    const f = frames[tuckHs.id]
    const weight = weights(tuckHs, who)
    f.forEach((x, i) => {
      locked(x, 172)
      for (const s of SIDES) {
        // Thighs at or below horizontal: the knee lower than the hip, and in front of it.
        expect(x.at(`lowerLeg${s}`).y).toBeLessThan(x.at(`upperLeg${s}`).y)
        expect(x.at(`lowerLeg${s}`).z).toBeLessThan(x.at(`upperLeg${s}`).z - 0.15 * x.s)
        expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeLessThan(60)
      }
      // The shoulders lean in front of the wrists, the hips stay over the hands; the weight is over the palms.
      expect(x.mid('upperArm').z - x.mid('hand').z).toBeGreaterThan(0.04 * x.s)
      expect(Math.abs(weight[i].z - x.mid('hand').z)).toBeLessThan(0.04 * x.s)
      expect(x.mid('upperLeg').y).toBeGreaterThan(x.mid('upperArm').y + 0.4 * x.s)
    })
  })

  it('straddle handstand: stacked to the hips, legs straight, open evenly beyond 45°', () => {
    for (const x of frames[straddleHs.id]) {
      locked(x, 172)
      expect(Math.abs(x.mid('upperLeg').z - x.mid('hand').z)).toBeLessThan(0.05 * x.s)
      expect(Math.abs(x.mid('upperArm').z - x.mid('hand').z)).toBeLessThan(0.04 * x.s)
      const open = SIDES.map((s) => x.lean(`upperLeg${s}`, `foot${s}`))
      for (const [i, s] of SIDES.entries()) {
        expect(open[i]).toBeGreaterThan(45)
        expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(173)
      }
      expect(Math.abs(x.at('footL').y - x.at('footR').y)).toBeLessThan(0.02 * x.s)
      // Out to the sides, not piked forward.
      expect(Math.abs(x.mid('foot').z - x.mid('upperLeg').z)).toBeLessThan(0.1 * x.s)
    }
  })

  it('press: straight arms the whole way, feet leave the floor only once the weight is on the hands, hips over the shoulders before the legs, a handstand at the top', () => {
    const f = frames[pressHs.id]
    const weight = weights(pressHs, who)
    for (const x of f) locked(x, 170)
    const start = f[0]
    // Standing in the fold: feet on the floor apart, behind the hands, hips high.
    for (const s of SIDES) expect(start.at(`toes${s}`).y).toBeLessThan(0.03 * start.s)
    expect(start.at('footL').x - start.at('footR').x).toBeGreaterThan(0.4 * start.s)
    expect(start.mid('upperLeg').y).toBeGreaterThan(0.6 * start.s)
    // While the feet are down, the balls of the feet do not move; the first frame they are up, the weight is already over the hands.
    const down = f.map((x) => Math.max(x.at('toesL').y, x.at('toesR').y) < start.at('toesL').y + 0.003)
    const lift = down.indexOf(false)
    expect(lift).toBeGreaterThan(0)
    expect(drift(f.slice(0, lift).map((x) => x.at('toesL')))).toBeLessThan(0.004)
    expect(Math.abs(weight[lift].z - f[lift].mid('hand').z), 'feet off before the weight is on the hands: a jump').toBeLessThan(0.05 * f[lift].s)
    // In the air the weight stays over the hands.
    f.forEach((x, i) => { if (!down[i]) expect(Math.abs(weight[i].z - x.mid('hand').z), `weight at ${x.t}`).toBeLessThan(0.05 * x.s) })
    // Hips first: by the time the feet are higher than the hips, the hips are over the shoulders.
    for (const x of f) if (x.mid('foot').y > x.mid('upperLeg').y) expect(x.mid('upperLeg').z - x.mid('upperArm').z, `hips behind at ${x.t}`).toBeGreaterThan(-0.2 * x.s)
    for (const x of f) for (const s of SIDES) expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(170)
    // The legs open out round the sides on the way.
    const widest = highest(f.filter((_, i) => !down[i]), (x) => x.at('footL').x - x.at('footR').x)
    expect(widest.lean('upperLegL', 'footL')).toBeGreaterThan(45)
    // The top is a stacked handstand, legs together.
    const top = f[Math.round(STEPS * 0.5)]
    expect(top.line()).toBeGreaterThan(174)
    expect(upright(top)).toBeLessThan(3)
    expect(Math.abs(top.at('footL').x - top.at('footR').x)).toBeLessThan(0.25 * top.s)
    // Down the same way, to where it started.
    expect(f[f.length - 1].mid('toes').distanceTo(start.mid('toes'))).toBeLessThan(0.01)
  })

  it('freestanding HSPU: locked and stacked at the top, the head on the floor ahead of the hands at the bottom, elbows back, the body straight and over the hands', () => {
    const f = frames[freestandingHspu.id]
    const weight = weights(freestandingHspu, who)
    const top = f[0]
    locked(top, 172)
    expect(upright(top)).toBeLessThan(3)
    expect(Math.abs(top.mid('upperArm').z - top.mid('hand').z)).toBeLessThan(0.02 * top.s)
    const low = lowest(f, (x) => x.crown.y)
    expect(low.crown.y).toBeLessThan(0.025 * low.s)
    expect(low.crown.y).toBeGreaterThan(-0.004)
    // A tripod: the head ahead of the hands by about the width between them.
    const width = low.at('handL').x - low.at('handR').x
    expect(low.crown.z - low.mid('hand').z).toBeGreaterThan(0.55 * width)
    expect(low.crown.z - low.mid('hand').z).toBeLessThan(0.9 * width)
    for (const s of SIDES) {
      // Elbows near a right angle, the forearms close to upright over the hands.
      expect(elbow(low, s)).toBeGreaterThan(72)
      expect(elbow(low, s)).toBeLessThan(100)
      expect(low.lean(`hand${s}`, `lowerArm${s}`)).toBeLessThan(18)
      // Elbows back, not flared out to the sides.
      const e = low.at(`lowerArm${s}`).sub(low.at(`upperArm${s}`))
      expect(Math.abs(Math.atan2(Math.abs(e.x), -e.z)) * deg).toBeLessThan(45)
    }
    f.forEach((x, i) => {
      expect(x.line(), `line at ${x.t}`).toBeGreaterThan(172)
      // The weight stays over the hands: between the heel of the hand and the knuckles, never out past the fingers or behind the wrists.
      const over = weight[i].z - x.mid('hand').z
      expect(over, `weight behind the hands at ${x.t}`).toBeGreaterThan(-0.02 * x.s)
      expect(over, `weight past the knuckles at ${x.t}`).toBeLessThan(x.mid('fingers1').z - x.mid('hand').z)
    })
    // It leans back to do that: the feet end up behind the hands, on the chest's side.
    expect(low.mid('foot').z).toBeLessThan(low.mid('hand').z - 0.1 * low.s)
    expect(f[f.length - 1].mid('upperArm').distanceTo(top.mid('upperArm'))).toBeLessThan(0.02 * top.s)
  })

  it('wall HSPU negative: at least five seconds down evenly to a soft head touch ahead of the hands, then down to the feet and kicked back up', () => {
    const f = frames[wallHspuNegative.id]
    const wall = wallOf(wallHspuNegative, who)
    const top = f[0]
    locked(top, 172)
    for (const h of heels(wallHspuNegative, who)[0]) expect(Math.abs(h.z - wall)).toBeLessThan(0.012)
    // The touch: the first moment the head is as low as it gets on the way down.
    const floor = Math.min(...f.slice(0, f.length / 2 + 4).map((x) => x.crown.y))
    const touch = f.find((x) => x.crown.y < floor + 0.001)!
    expect(touch.crown.y).toBeLessThan(0.035 * touch.s)
    expect(touch.crown.z - touch.mid('hand').z).toBeGreaterThan(0.12 * touch.s)
    for (const s of SIDES) {
      const e = touch.at(`lowerArm${s}`).sub(touch.at(`upperArm${s}`))
      const flare = Math.abs(Math.atan2(Math.abs(e.x), -e.z)) * deg
      expect(flare).toBeLessThan(65)
    }
    // Lowering: from the first frame the head drops to the frame it touches, steadily, never faster than twice the average.
    const end = f.indexOf(touch)
    const seconds = (end / STEPS) * wallHspuNegative.period
    expect(seconds).toBeGreaterThanOrEqual(5)
    const drop = f.slice(0, end + 1).map((x) => x.crown.y)
    const average = (drop[1] - drop[end]) / (end - 1)
    for (let i = 2; i <= end; i++) expect(drop[i - 1] - drop[i], `drop at ${f[i].t}`).toBeLessThan(2.2 * average + 0.002)
    for (const x of f.slice(0, end + 1)) expect(x.line()).toBeGreaterThan(172)
    // Nothing passes through the wall or the floor, and the head never goes into it.
    for (const x of f) {
      for (const j of ['hips', 'upperLegL', 'upperLegR', 'lowerLegL', 'lowerLegR', 'footL', 'footR'] as const) expect(x.at(j).z, `${j} at ${x.t}`).toBeLessThan(wall)
      expect(x.crown.y, `head in the floor at ${x.t}`).toBeGreaterThan(0.015 * x.s)
    }
    // Coming down, the head stays on its crown until a foot is on the floor: it does not roll onto the face, and the hips stay over it.
    for (const x of f.slice(end)) {
      if (x.crown.y > touch.crown.y + 0.008 * x.s) break
      expect(x.crown.distanceTo(touch.crown), `the head moved on the floor at ${x.t}`).toBeLessThan(0.03 * x.s)
      expect(x.at('head').y - x.crown.y, `the head rolled at ${x.t}`).toBeGreaterThan(0.17 * x.s)
      expect(x.mid('upperLeg').y, `hips dropped at ${x.t}`).toBeGreaterThan(0.6 * x.s)
    }
    // Back up is not a press: after the touch the arms only straighten while a foot is on the floor carrying weight.
    const after = f.slice(end)
    const floored = (x: (typeof f)[number]) => Math.min(x.at('toesL').y, x.at('toesR').y) < 0.03 * x.s
    expect(after.some(floored)).toBe(true)
    for (let i = 1; i < after.length; i++) {
      if (elbow(after[i - 1], 'L') < 165 && elbow(after[i], 'L') > elbow(after[i - 1], 'L') + 1) expect(floored(after[i]) || floored(after[i - 1]), `pressed at ${after[i].t}`).toBe(true)
    }
    // And once straight, they stay straight through the kick back to the wall.
    const kick = after.slice(after.findIndex((x) => elbow(x, 'L') > 168))
    expect(kick.length).toBeGreaterThan(4)
    for (const x of kick) locked(x, 170)
    expect(f[f.length - 1].mid('foot').distanceTo(top.mid('foot'))).toBeLessThan(0.08)
  })

  it('one-arm handstand: the left arm upright and locked over a still hand, the weight over it, the right hand off the floor, hips square, legs straddled', () => {
    const f = frames[oneArmHs.id]
    const weight = weights(oneArmHs, who)
    expect(drift(f.map((x) => x.at('handL')))).toBeLessThan(0.002)
    f.forEach((x, i) => {
      expect(elbow(x, 'L')).toBeGreaterThan(172)
      // The supporting shoulder over its hand; the centre of the body over it too, side to side and front to back.
      expect(x.lean('handL', 'upperArmL')).toBeLessThan(4)
      expect(Math.abs(weight[i].x - x.at('handL').x), `weight sideways at ${x.t}`).toBeLessThan(0.03 * x.s)
      expect(Math.abs(weight[i].z - x.at('handL').z), `weight front to back at ${x.t}`).toBeLessThan(0.03 * x.s)
      // The free hand well off the floor and out to the side, its arm straight.
      expect(x.at('handR').y).toBeGreaterThan(0.4 * x.s)
      expect(x.at('handR').x).toBeLessThan(x.at('upperArmR').x - 0.3 * x.s)
      expect(elbow(x, 'R')).toBeGreaterThan(160)
      // Hips square: the two hip joints at the same depth.
      expect(Math.abs(x.at('upperLegL').z - x.at('upperLegR').z)).toBeLessThan(0.02)
      for (const s of SIDES) expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(173)
      expect(x.at('footL').x - x.at('footR').x).toBeGreaterThan(0.6 * x.s)
    })
  })
})
