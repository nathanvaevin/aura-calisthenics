import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { skeletonOf, type BoneName } from '../body/skeleton'
import { emptyPose, Rig } from '../rig'
import { highBar } from './hang'
import { LEVERS, backLever, frontLeverFull, germanHang, skinTheCat, straddleFrontLever, tuckBackLever, windshieldWipers } from './levers'
import { STEPS, deg, drift, expectSound, highest, lowest, sample, type Frames } from './testkit'

type Frame = Frames[number]
const elbows = (x: Frame) => Math.min(x.angle('upperArmL', 'lowerArmL', 'handL'), x.angle('upperArmR', 'lowerArmR', 'handR'))
const knees = (x: Frame) => Math.min(x.angle('upperLegL', 'lowerLegL', 'footL'), x.angle('upperLegR', 'lowerLegR', 'footR'))
/** How far the line from one point to another is from level, in degrees. */
const slope = (a: Vector3, b: Vector3) => Math.atan2(Math.abs(b.y - a.y), Math.hypot(b.x - a.x, b.z - a.z)) * deg
/** The angle at the shoulder between the arm and the trunk: 180 with the arms overhead, 0 with them by the sides. */
const shoulder = (x: Frame) => x.at('handL').sub(x.at('upperArmL')).angleTo(x.mid('upperLeg').sub(x.mid('upperArm'))) * deg
/** The pitch of the trunk, from hips to shoulders: 0 upright, 90 level with the head towards +Z, -90 level with it towards -Z. */
const trunk = (x: Frame) => { const v = x.mid('upperArm').sub(x.mid('upperLeg')); return Math.atan2(v.z, v.y) * deg }
/** The angle between the two legs. */
const straddle = (x: Frame) => x.at('footL').sub(x.at('upperLegL')).angleTo(x.at('footR').sub(x.at('upperLegR'))) * deg
/** In a level body, the head is towards -Z when it is face up and towards +Z when it is face down (pitching never swaps left and right). */
const faceUp = (x: Frame) => x.at('upperArmL').x > 0 && x.at('head').z < x.mid('upperLeg').z
const faceDown = (x: Frame) => x.at('upperArmL').x > 0 && x.at('head').z > x.mid('upperLeg').z

describe.each(['male', 'female'] as const)('levers and turning over, %s character', (who) => {
  const f = Object.fromEntries(LEVERS.map((m) => [m.id, sample(m, who)])) as Record<string, Frames>
  const body = f['front-lever'][0].body
  const s = body.scale
  const bar = highBar(body)
  /** How far a point is from the bar itself, wherever along it. */
  const fromBar = (p: Vector3) => Math.hypot(p.y - bar.height, p.z)

  it('is the seven movements of the family, easiest first', () => {
    expect(LEVERS.map((m) => m.id)).toEqual(['german-hang', 'skin-the-cat', 'tuck-back-lever', 'windshield-wipers', 'back-lever', 'straddle-fl', 'front-lever'])
    for (const m of LEVERS) expect(m.revision).toBe(1)
  })

  it.each(LEVERS.map((m) => m.id))('%s: sound, clear of the floor, hands on the bar, arms locked', (id) => {
    const m = LEVERS.find((x) => x.id === id)!
    expectSound(m, f[id])
    expect(m.planted).toEqual(['handL', 'handR'])
    for (const x of f[id]) {
      for (const b of ['footL', 'footR', 'toesL', 'toesR', 'lowerLegL', 'lowerLegR', 'hips', 'head'] as BoneName[]) expect(x.at(b).y, `${id} ${b} at ${x.t}`).toBeGreaterThan(0.04)
      // The wrists hang a knuckle's length from the bar, in an overhand grip at just over shoulder width, the two sides alike.
      for (const h of ['handL', 'handR'] as BoneName[]) expect(fromBar(x.at(h)), `${id} ${h} at ${x.t}`).toBeLessThan(0.11 * s)
      expect(x.at('handL').x).toBeGreaterThan(body.rest.upperArmL.x + 0.05 * s)
      expect(x.at('handL').x + x.at('handR').x).toBeCloseTo(0, 6)
      expect(elbows(x), `${id} elbows at ${x.t}`).toBeGreaterThan(170)
      // The arms stay outside the trunk: the elbows are no nearer the middle than the shoulder joints are.
      expect(x.at('lowerArmL').x, `${id} elbow inside the trunk at ${x.t}`).toBeGreaterThan(x.at('upperArmL').x - 0.01 * s)
      expect(x.at('lowerArmR').x).toBeLessThan(x.at('upperArmR').x + 0.01 * s)
    }
  })

  it.each([straddleFrontLever, frontLeverFull].map((m) => m.id))('%s: face up, one straight level line from shoulders to feet, under the bar', (id) => {
    for (const x of f[id]) {
      expect(faceUp(x)).toBe(true)
      expect(knees(x)).toBeGreaterThan(172)
      // Level: shoulders to hips, and hips to feet. Straight: no sag and no pike at the hips.
      expect(slope(x.mid('upperArm'), x.mid('upperLeg')), `${id} trunk at ${x.t}`).toBeLessThan(2.5)
      expect(slope(x.mid('upperLeg'), x.mid('foot')), `${id} legs at ${x.t}`).toBeLessThan(2.5)
      expect(x.line(), `${id} line at ${x.t}`).toBeGreaterThan(176)
      expect(Math.abs(x.mid('upperLeg').y - x.mid('upperArm').y)).toBeLessThan(0.025 * s)
      expect(Math.abs(x.mid('foot').y - x.mid('upperArm').y)).toBeLessThan(0.05 * s)
      // Under the bar: the hands are over the trunk, and the arms slope back to the shoulders.
      expect(x.at('handL').z).toBeGreaterThan(x.mid('upperArm').z + 0.25 * s)
      expect(x.at('handL').z).toBeLessThan(x.mid('upperLeg').z)
      expect(x.mid('upperArm').y).toBeLessThan(bar.height - 0.35 * s)
      // Toes pointed: the toes carry on along the leg.
      expect(x.at('toesL').sub(x.at('footL')).angleTo(x.at('footL').sub(x.at('lowerLegL'))) * deg).toBeLessThan(40)
    }
  })

  it('front lever: legs together', () => {
    for (const x of f['front-lever']) {
      expect(straddle(x)).toBeLessThan(2)
      expect(x.at('footL').distanceTo(x.at('footR'))).toBeLessThan(0.22 * s)
    }
  })

  it('straddle front lever: legs opened wide in the plane of the body, hips fully open; a shorter lever than the full one', () => {
    for (const x of f['straddle-fl']) {
      expect(straddle(x)).toBeGreaterThan(75)
      expect(x.at('footL').x).toBeGreaterThan(0.5 * s)
      expect(x.at('footR').x).toBeLessThan(-0.5 * s)
      // No pike: each foot is as high as its hip.
      for (const side of ['L', 'R'] as const) expect(Math.abs(x.at(`foot${side}`).y - x.at(`upperLeg${side}`).y)).toBeLessThan(0.03 * s)
    }
    const st = f['straddle-fl'][0], full = f['front-lever'][0]
    expect(st.mid('foot').z - st.mid('upperArm').z).toBeLessThan(full.mid('foot').z - full.mid('upperArm').z - 0.15 * s)
    // Less weight far from the bar, so the shoulders sit nearer under it.
    expect(st.at('handL').z - st.mid('upperArm').z).toBeLessThan(full.at('handL').z - full.mid('upperArm').z)
    expect(straddleFrontLever.effort(0)).toBeLessThan(frontLeverFull.effort(0))
  })

  it.each([tuckBackLever, backLever].map((m) => m.id))('%s: face down, the back level, hips at shoulder height, the arms behind the body', (id) => {
    for (const x of f[id]) {
      expect(faceDown(x)).toBe(true)
      expect(slope(x.mid('upperArm'), x.mid('upperLeg')), `${id} trunk at ${x.t}`).toBeLessThan(2.5)
      expect(Math.abs(x.mid('upperLeg').y - x.mid('upperArm').y)).toBeLessThan(0.025 * s)
      // Behind the body: the hands are above the back, between shoulders and hips, and the arm is closer to the hips than to overhead.
      expect(x.at('handL').y).toBeGreaterThan(x.mid('upperArm').y + 0.35 * s)
      expect(x.at('handL').z).toBeLessThan(x.mid('upperArm').z - 0.12 * s)
      expect(x.at('handL').z).toBeGreaterThan(x.mid('upperLeg').z)
      expect(shoulder(x)).toBeGreaterThan(30)
      expect(shoulder(x)).toBeLessThan(80)
    }
  })

  it('tuck back lever: knees tucked under the chest', () => {
    for (const x of f['tuck-back-lever']) {
      expect(knees(x)).toBeLessThan(60)
      const knee = x.mid('lowerLeg')
      expect(knee.y).toBeLessThan(x.mid('upperLeg').y - 0.15 * s)
      expect(knee.z).toBeGreaterThan(x.mid('upperLeg').z + 0.15 * s)
      expect(knee.z).toBeLessThan(x.mid('upperArm').z)
      // Tucked, the feet stay under the hips rather than trailing behind.
      expect(x.mid('foot').z).toBeGreaterThan(x.mid('upperLeg').z - 0.2 * s)
    }
  })

  it('back lever: one straight level line to the ankles, no arch, legs together; a longer lever than the tuck', () => {
    for (const x of f['back-lever']) {
      expect(knees(x)).toBeGreaterThan(172)
      expect(slope(x.mid('upperLeg'), x.mid('foot'))).toBeLessThan(2.5)
      expect(x.line()).toBeGreaterThan(176)
      expect(straddle(x)).toBeLessThan(2)
      // No arch: the middle of the back is on the line from hips to shoulders.
      expect(Math.abs(x.at('chest').y - (x.at('hips').y + x.at('upperChest').y) / 2)).toBeLessThan(0.02 * s)
    }
    const tuck = f['tuck-back-lever'][0], full = f['back-lever'][0]
    expect(full.mid('upperArm').z - full.at('handL').z).toBeGreaterThan(tuck.mid('upperArm').z - tuck.at('handL').z + 0.1 * s)
    expect(tuckBackLever.effort(0)).toBeLessThan(backLever.effort(0))
  })

  it('german hang: arms behind the body with the shoulders opened, hips sunk below the bar, legs hanging straight', () => {
    const g = f['german-hang']
    for (const x of g) {
      // The shoulders are in front of the hands and the trunk slopes down and back from them: the chest faces the floor.
      expect(x.mid('upperArm').z).toBeGreaterThan(x.at('handL').z + 0.12 * s)
      expect(trunk(x)).toBeGreaterThan(35)
      expect(trunk(x)).toBeLessThan(70)
      // Shoulder extension: the arms are well behind the line of the trunk, but not past what a shoulder has.
      expect(shoulder(x)).toBeGreaterThan(85)
      expect(shoulder(x)).toBeLessThan(120)
      expect(x.mid('upperLeg').y).toBeLessThan(bar.height - 0.75 * s)
      expect(x.mid('upperLeg').y).toBeLessThan(x.mid('upperArm').y - 0.2 * s)
      expect(knees(x)).toBeGreaterThan(172)
      expect(straddle(x)).toBeLessThan(2)
      expect(x.mid('foot').y).toBeLessThan(x.mid('upperLeg').y - 0.6 * s)
    }
    // A hold: it breathes, it does not swing.
    expect(drift(g.map((x) => x.mid('upperLeg')))).toBeLessThan(0.06 * s)
    expect(germanHang.kind).toBe('hold')
  })

  describe('skin the cat', () => {
    const g = f['skin-the-cat']
    /** The pitch of the trunk followed all the way round, from 0 in the hang. */
    const turned = (() => {
      const out: number[] = []
      let last = 0
      for (const x of g) {
        let a = trunk(x)
        while (a - last > 180) a -= 360
        while (a - last < -180) a += 360
        out.push(a)
        last = a
      }
      return out
    })()

    it('starts and ends in a hang, body long under the bar', () => {
      for (const x of [g[0], g[STEPS - 1]]) {
        expect(Math.abs(trunk(x))).toBeLessThan(8)
        expect(shoulder(x)).toBeGreaterThan(165)
        expect(knees(x)).toBeGreaterThan(170)
        expect(Math.abs(x.mid('upperLeg').z)).toBeLessThan(0.1 * s)
      }
    })

    it('turns over backwards the whole way into the German hang, and comes back the way it went', () => {
      const most = Math.min(...turned)
      // From upright, through face up and upside down, to face down and on: most of a full turn.
      expect(most).toBeLessThan(-290)
      expect(most).toBeGreaterThan(-325)
      expect(Math.max(...turned)).toBeLessThan(5)
      expect(turned[STEPS - 1]).toBeCloseTo(turned[0], 3)
      const bottom = g[turned.indexOf(most)]
      expect(bottom.t).toBeGreaterThan(0.4)
      expect(bottom.t).toBeLessThan(0.6)
      // The way back is the way over, run backwards.
      const poseAt = (t: number) => { const rig = new Rig(who), pose = emptyPose(); skinTheCat.pose(t, rig, pose); rig.solve(pose); return rig }
      for (const d of [0.05, 0.13, 0.2, 0.31]) {
        const over = poseAt(0.03 + d), back = poseAt(0.96 - d)
        for (const b of ['hips', 'head', 'footL', 'lowerLegR'] as BoneName[]) expect(over.pos[b].distanceTo(back.pos[b])).toBeLessThan(1e-6)
      }
    })

    it('ends the way down in the German hang: the same shape as the hold', () => {
      const bottom = g.find((x) => x.t >= 0.5)!
      const hold = f['german-hang'][0]
      expect(bottom.mid('upperArm').z).toBeGreaterThan(bottom.at('handL').z + 0.12 * s)
      expect(Math.abs(trunk(bottom) - trunk(hold))).toBeLessThan(8)
      expect(Math.abs(shoulder(bottom) - shoulder(hold))).toBeLessThan(8)
      expect(shoulder(bottom)).toBeLessThan(120)
      expect(bottom.mid('upperLeg').y).toBeLessThan(bar.height - 0.75 * s)
      expect(knees(bottom)).toBeGreaterThan(172)
      expect(Math.min(bottom.at('toesL').y, bottom.at('footL').y)).toBeGreaterThan(0.3 * s)
      // It stays there for about a second.
      expect((g.filter((x) => x.mid('upperLeg').distanceTo(bottom.mid('upperLeg')) < 0.002).length / STEPS) * skinTheCat.period).toBeGreaterThanOrEqual(0.9)
    })

    it('is turned slowly: no drop into the bottom, no rush through the middle', () => {
      const step = skinTheCat.period / STEPS
      const rates = turned.slice(1).map((a, i) => Math.abs(a - turned[i]) / step)
      // About 300° in four and a half seconds: never as much as half a turn in a second.
      expect(Math.max(...rates)).toBeLessThan(135)
      // The hips never fall faster than that turning carries them, and they arrive in the German hang slowly: lowered, not dropped.
      const hips = g.map((x) => x.mid('upperLeg').y)
      const falls = hips.slice(1).map((y, i) => (hips[i] - y) / step)
      expect(Math.max(...falls)).toBeLessThan(1.15 * s)
      const bottom = g.findIndex((x) => x.t >= 0.44)
      for (const fall of falls.slice(bottom - 3, bottom)) expect(Math.abs(fall)).toBeLessThan(0.35 * s)
      expect(skinTheCat.period).toBeGreaterThanOrEqual(8)
    })

    it('tucks tight and passes the legs between the arms and under the bar, touching nothing', () => {
      // Followed finely: the passage under the bar is quick to miss.
      const rig = new Rig(who), pose = emptyPose()
      const sk = skeletonOf(who)
      const tip = (bone: BoneName, of: readonly number[]) => new Vector3(of[0], of[1], of[2]).sub(rig.body.rest[bone]).applyQuaternion(rig.rot[bone]).add(rig.pos[bone])
      const N = 600
      let before = 0, crossed = 0
      for (let i = 0; i <= N; i++) {
        const t = 0.03 + (0.41 * i) / N
        skinTheCat.pose(t, rig, pose)
        rig.solve(pose)
        const p = rig.pos
        const at = `at ${t.toFixed(3)}`
        // Joints keep their own thickness and more from the bar; the heel and the tip of the toes, which are on the skin, clear it.
        expect(fromBar(p.footL), `ankle ${at}`).toBeGreaterThan(0.1 * s)
        expect(fromBar(p.toesL), `ball of the foot ${at}`).toBeGreaterThan(0.07 * s)
        expect(fromBar(p.lowerLegL), `knee ${at}`).toBeGreaterThan(0.14 * s)
        expect(fromBar(p.upperLegL), `hip ${at}`).toBeGreaterThan(0.13 * s)
        expect(fromBar(p.hips), `pelvis ${at}`).toBeGreaterThan(0.13 * s)
        expect(fromBar(tip('footL', sk.tips.heelL)), `heel ${at}`).toBeGreaterThan(bar.radius + 0.02 * s)
        expect(fromBar(tip('toesL', sk.tips.toeTipL)), `toes ${at}`).toBeGreaterThan(bar.radius + 0.02 * s)
        // Between the arms: knees and feet stay well inside the hands.
        for (const b of ['lowerLegL', 'footL', 'toesL'] as BoneName[]) expect(Math.abs(p[b].x), `${b} ${at}`).toBeLessThan(p.handL.x - 0.1 * s)
        // The moment the ankles go from in front of the bar to behind it: below it, and folded small.
        const z = p.footL.z
        if (i > 0 && before > 0 && z <= 0) {
          crossed++
          expect(p.footL.y, `the feet pass under the bar ${at}`).toBeLessThan(bar.height - 0.1 * s)
          expect(p.footL.y, `and between the arms, above the shoulders ${at}`).toBeGreaterThan((p.upperArmL.y + p.upperArmR.y) / 2)
          expect(p.upperLegL.clone().sub(p.lowerLegL).angleTo(p.footL.clone().sub(p.lowerLegL)) * deg, `tucked ${at}`).toBeLessThan(40)
          // Knees to the chest.
          expect(p.lowerLegL.clone().add(p.lowerLegR).multiplyScalar(0.5).distanceTo(p.upperChest), `knees to the chest ${at}`).toBeLessThan(0.3 * s)
        }
        before = z
      }
      expect(crossed).toBe(1)
    })

    it('goes through upside down with the hips at the bar, and counts when it is back in the hang', () => {
      const up = highest(g, (x) => x.mid('upperLeg').y)
      expect(up.mid('upperLeg').y).toBeGreaterThan(bar.height - 0.3 * s)
      expect(up.mid('upperLeg').y).toBeGreaterThan(up.mid('upperArm').y + 0.3 * s)
      expect(up.at('head').y).toBeLessThan(up.mid('upperArm').y)
      expect(skinTheCat.beat).toBeGreaterThan(0.9)
      const done = g.find((x) => x.t >= skinTheCat.beat!)!
      expect(Math.abs(trunk(done))).toBeLessThan(8)
      expect(lowest(g, (x) => x.at('toesL').y).at('toesL').y).toBeGreaterThan(0.03 * s)
    })
  })

  describe('windshield wipers', () => {
    const g = f['windshield-wipers']
    /** How far the legs are from upright, seen from the front: positive towards the athlete's left. */
    const swing = (x: Frame) => { const v = x.mid('foot').sub(x.mid('upperLeg')); return Math.atan2(v.x, v.y) * deg }

    it('is an inverted pike: arms and legs straight, legs together, hips high, the feet up at the bar', () => {
      for (const x of g) {
        expect(knees(x)).toBeGreaterThan(172)
        expect(straddle(x)).toBeLessThan(2)
        expect(x.at('footL').distanceTo(x.at('footR'))).toBeLessThan(0.22 * s)
        // Folded: the legs are within a right angle of the trunk.
        expect(x.line()).toBeLessThan(80)
        expect(x.at('head').z).toBeLessThan(x.mid('upperLeg').z)
      }
      const mid = g[0]
      expect(Math.abs(swing(mid))).toBeLessThan(1)
      // The ankles are at the bar, just in front of it and just below; the toes reach past it.
      expect(fromBar(mid.mid('foot'))).toBeLessThan(0.2 * s)
      expect(mid.mid('foot').z).toBeGreaterThan(0.08 * s)
      expect(mid.mid('toes').y).toBeGreaterThan(bar.height)
      // Hips as high as straight legs to the bar allow: within a leg's length of it.
      expect(mid.mid('upperLeg').y).toBeGreaterThan(bar.height - (body.upperLeg + body.lowerLeg) - 0.06 * s)
    })

    it('swings the legs well past 45° to each side, the same both ways, and stops them there', () => {
      const left = highest(g, swing), right = lowest(g, swing)
      expect(swing(left)).toBeGreaterThan(55)
      expect(swing(right)).toBeLessThan(-55)
      expect(swing(left) + swing(right)).toBeCloseTo(0, 3)
      expect(swing(left)).toBeLessThan(80)
      // Controlled at each side: about a third of the time is spent beyond 45°, not thrown through.
      const beyond = g.filter((x) => Math.abs(swing(x)) > 45).length / STEPS
      expect(beyond).toBeGreaterThan(0.3)
      // One side, the middle, the other side, the middle.
      expect(right.t).toBeCloseTo(0.25, 1)
      expect(left.t).toBeCloseTo(0.75, 1)
      expect(Math.abs(swing(g[STEPS / 2]))).toBeLessThan(1)
      expect(windshieldWipers.beat).toBe(0.75)
    })

    it('turns from the waist: hips stay up and in place, shoulders stay square', () => {
      const hips = g.map((x) => x.mid('upperLeg'))
      expect(Math.max(...hips.map((p) => p.y)) - Math.min(...hips.map((p) => p.y))).toBeLessThan(0.02 * s)
      // They give a few centimetres sideways as the pelvis turns; no more.
      expect(drift(hips)).toBeLessThan(0.08 * s)
      for (const x of g) {
        expect(Math.abs(x.at('upperArmL').y - x.at('upperArmR').y)).toBeLessThan(0.005 * s)
        expect(Math.abs(x.at('upperArmL').z - x.at('upperArmR').z)).toBeLessThan(0.005 * s)
        // The pelvis goes with the legs: the line across the hips turns most of the way they do.
        const across = x.at('upperLegL').sub(x.at('upperLegR'))
        const turn = Math.atan2(-across.y, across.x) * deg
        expect(Math.abs(turn - swing(x))).toBeLessThan(15)
      }
      expect(drift(g.map((x) => x.mid('upperArm')))).toBeLessThan(0.01 * s)
    })

    it('carries the legs in front of the bar and past the hands without touching them', () => {
      const rig = new Rig(who), pose = emptyPose()
      const sk = skeletonOf(who)
      const N = 400
      for (let i = 0; i < N; i++) {
        const t = i / N
        windshieldWipers.pose(t, rig, pose)
        rig.solve(pose)
        const p = rig.pos
        for (const side of ['L', 'R'] as const) {
          const tip = new Vector3(...(sk.tips.toeTipL as [number, number, number])).sub(rig.body.rest.toesL).applyQuaternion(rig.rot[`toes${side}`]).add(p[`toes${side}`])
          for (const [name, q, room] of [['ankle', p[`foot${side}`], 0.11], ['ball of the foot', p[`toes${side}`], 0.07], ['toes', tip, 0.04], ['knee', p[`lowerLeg${side}`], 0.15]] as [string, Vector3, number][]) {
            expect(fromBar(q), `${name}${side} and the bar at ${t}`).toBeGreaterThan(room * s)
            expect(q.z, `${name}${side} in front of the bar at ${t}`).toBeGreaterThan(0.03 * s)
            for (const h of ['handL', 'handR'] as BoneName[]) expect(q.distanceTo(p[h]), `${name}${side} and ${h} at ${t}`).toBeGreaterThan((room + 0.02) * s)
          }
        }
      }
    })
  })
})
