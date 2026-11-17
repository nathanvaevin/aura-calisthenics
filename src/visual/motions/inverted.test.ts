import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import type { BoneName, CharacterId } from '../body/skeleton'
import { emptyPose, Rig } from '../rig'
import { INVERTED, backToWall, chestToWall, heelBack, hsShoulderTaps, pikeHold, toeTip, wallShoulderTaps, wallWalk } from './inverted'
import { SIDES, drift, expectSound, lowest, sample } from './testkit'
import type { Motion } from './types'

const wallOf = (m: Motion, who: CharacterId) => (m.props!(new Rig(who).body).find((p) => p.kind === 'wall') as { z: number }).z

/** Toe tips and heels through a cycle: the test kit keeps joints only. */
function feet(m: Motion, who: CharacterId, steps = 48) {
  const rig = new Rig(who)
  const pose = emptyPose()
  return Array.from({ length: steps }, (_, i) => {
    m.pose(i / steps, rig, pose)
    rig.solve(pose)
    return { toes: SIDES.map((s) => toeTip(rig, s)), heels: SIDES.map((s) => heelBack(rig, s)), balls: SIDES.map((s) => rig.pos[`toes${s}`].clone()) }
  })
}

const JOINTS: BoneName[] = ['hips', 'upperChest', 'head', 'upperArmL', 'upperArmR', 'lowerArmL', 'lowerArmR', 'handL', 'handR', 'upperLegL', 'upperLegR', 'lowerLegL', 'lowerLegR', 'footL', 'footR']

describe.each(['male', 'female'] as const)('the handstand station, %s character', (who) => {
  const frames = Object.fromEntries(INVERTED.map((m) => [m.id, sample(m, who)]))

  it.each(INVERTED.map((m) => m.id))('%s: sound', (id) => {
    expectSound(INVERTED.find((m) => m.id === id)!, frames[id])
  })

  it('is the eight exercises of the station, easiest first', () => {
    expect(INVERTED.map((m) => m.id)).toEqual(['pike-hold', 'crow-pose', 'wall-walk', 'chest-to-wall-hs', 'back-to-wall-hs', 'wall-shoulder-taps', 'hs-shoulder-taps', 'elbow-lever'])
  })

  it('box pike hold: hips over shoulders over wrists, arms locked, legs level on the box', () => {
    const box = pikeHold.props!(frames['pike-hold'][0].body)[0] as { height: number; depth: number; z: number }
    for (const x of frames['pike-hold']) {
      const wrist = x.mid('hand')
      expect(Math.abs(x.mid('upperArm').z - wrist.z)).toBeLessThan(0.03 * x.s)
      expect(Math.abs(x.mid('upperLeg').z - wrist.z)).toBeLessThan(0.06 * x.s)
      for (const s of SIDES) {
        expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(172)
        expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(172)
        // Level: within a few degrees of horizontal from hip to ankle.
        expect(Math.abs(90 - x.lean(`upperLeg${s}`, `foot${s}`))).toBeLessThan(8)
        // The ball of the foot is on top of the box, inside its edges.
        const ball = x.at(`toes${s}`)
        expect(ball.y - box.height).toBeGreaterThan(0)
        expect(ball.y - box.height).toBeLessThan(0.03 * x.s)
        expect(Math.abs(ball.z - box.z)).toBeLessThan(box.depth / 2)
      }
    }
  })

  it('crow: knees on the upper arms, shoulders ahead of the hands, feet and head off the floor', () => {
    for (const x of frames['crow-pose']) {
      expect(x.mid('upperArm').z - x.mid('hand').z).toBeGreaterThan(0.12 * x.s)
      expect(x.mid('upperLeg').y).toBeGreaterThan(x.mid('upperArm').y - 0.03 * x.s)
      expect(x.crown.y).toBeGreaterThan(0.25 * x.s)
      for (const s of SIDES) {
        expect(x.at(`foot${s}`).y).toBeGreaterThan(0.12 * x.s)
        expect(x.at(`toes${s}`).y).toBeGreaterThan(0.06 * x.s)
        // The knee rests on the upper arm: within a hand's breadth of the line from shoulder to elbow.
        const a = x.at(`upperArm${s}`), b = x.at(`lowerArm${s}`), k = x.at(`lowerLeg${s}`)
        const ab = b.clone().sub(a)
        const u = Math.min(1, Math.max(0, k.clone().sub(a).dot(ab) / ab.lengthSq()))
        expect(k.distanceTo(a.add(ab.multiplyScalar(u)))).toBeLessThan(0.11 * x.s)
        expect(u).toBeGreaterThan(0.3)
        // Elbows bent, but not collapsed.
        const elbow = x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)
        expect(elbow).toBeGreaterThan(70)
        expect(elbow).toBeLessThan(130)
      }
    }
  })

  it.each([[chestToWall], [wallShoulderTaps]])('$id: only the toes at the wall, wrists a hand\'s length from it', (m) => {
    const wall = wallOf(m, who)
    const f = frames[m.id]
    expect(f[0].mid('hand').z - wall).toBeLessThan(0.21 * f[0].s)
    for (const x of f) for (const j of JOINTS) expect(x.at(j).z, j).toBeGreaterThan(wall + 0.03 * x.s)
    for (const x of feet(m, who)) for (const tip of x.toes) {
      expect(tip.z - wall).toBeGreaterThan(-0.002)
      expect(tip.z - wall).toBeLessThan(0.012)
    }
  })

  it('chest-to-wall handstand: a straight vertical line on locked arms', () => {
    for (const x of frames['chest-to-wall-hs']) {
      expect(x.line()).toBeGreaterThan(174)
      expect(x.lean('handL', 'footL')).toBeLessThan(4)
      for (const s of SIDES) expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(172)
    }
  })

  it('back-to-wall handstand: only the heels on the wall, hands near it, a straight line that leans a little', () => {
    const wall = wallOf(backToWall, who)
    const f = frames['back-to-wall-hs']
    // The fingers point at the wall; they stop short of it by about a hand's breadth or more.
    const gap = wall - f[0].mid('hand').z
    expect(gap).toBeGreaterThan(0.24 * f[0].s)
    expect(gap).toBeLessThan(0.4 * f[0].s)
    for (const x of f) {
      expect(x.line()).toBeGreaterThan(174)
      expect(x.lean('handL', 'footL')).toBeLessThan(10)
      for (const j of JOINTS) if (!j.startsWith('foot')) expect(x.at(j).z, j).toBeLessThan(wall - 0.05 * x.s)
      for (const s of SIDES) expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(172)
    }
    for (const x of feet(backToWall, who)) for (const heel of x.heels) expect(Math.abs(heel.z - wall)).toBeLessThan(0.012)
  })

  it.each([[wallShoulderTaps], [hsShoulderTaps]])('$id: the weight shifts, the supporting arm stays locked, the hand reaches the shoulder and comes back', (m) => {
    const f = frames[m.id]
    const half = f.length / 2
    for (const [support, tapping, from] of [['L', 'R', 0], ['R', 'L', half]] as const) {
      const part = f.slice(from, from + half)
      const sign = support === 'L' ? 1 : -1
      // The supporting hand does not move while it is the support, and its arm stays straight.
      expect(drift(part.map((x) => x.at(`hand${support}`)))).toBeLessThan(0.004)
      for (const x of part) expect(x.angle(`upperArm${support}`, `lowerArm${support}`, `hand${support}`)).toBeGreaterThan(172)
      // At the tap the hand is on the opposite shoulder and the hips have moved over the supporting hand.
      const tap = lowest(part, (x) => x.at(`hand${tapping}`).distanceTo(x.at(`upperArm${support}`)))
      expect(tap.at(`hand${tapping}`).distanceTo(tap.at(`upperArm${support}`))).toBeLessThan(0.17 * tap.s)
      expect(tap.at(`hand${tapping}`).y).toBeGreaterThan(0.4 * tap.s)
      expect((tap.at('hips').x - part[0].at('hips').x) * sign).toBeGreaterThan(0.04 * tap.s)
      // The hips do not twist: left and right hip joints stay level in depth.
      expect(Math.abs(tap.at('upperLegL').z - tap.at('upperLegR').z)).toBeLessThan(0.02)
      // And it goes back to the same spot.
      expect(part[0].at(`hand${tapping}`).distanceTo(part[part.length - 1].at(`hand${tapping}`))).toBeLessThan(0.03 * tap.s)
      expect(part[0].at(`hand${tapping}`).y).toBeLessThan(0.05 * tap.s)
    }
    for (const x of f) expect(x.line()).toBeGreaterThan(170)
  })

  it('freestanding shoulder taps: stacked over the hands, legs a little apart', () => {
    for (const x of frames['hs-shoulder-taps']) {
      expect(Math.abs(x.mid('upperLeg').z - x.mid('hand').z)).toBeLessThan(0.1 * x.s)
      expect(x.at('footL').x - x.at('footR').x).toBeGreaterThan(0.25 * x.s)
    }
  })

  it('elbow lever: body level and straight on the elbows, forearms upright, feet off the floor', () => {
    for (const x of frames['elbow-lever']) {
      expect(x.line()).toBeGreaterThan(168)
      // Level: shoulders to ankles within a few degrees of horizontal.
      const body = x.mid('foot').sub(x.mid('upperArm'))
      expect(Math.abs(Math.atan2(body.y, Math.hypot(body.x, body.z))) * (180 / Math.PI)).toBeLessThan(8)
      expect(x.crown.y).toBeGreaterThan(0.3 * x.s)
      for (const s of SIDES) {
        expect(x.at(`toes${s}`).y).toBeGreaterThan(0.2 * x.s)
        expect(x.lean(`hand${s}`, `lowerArm${s}`)).toBeLessThan(16)
        // Elbows close together, under the trunk between the shoulders and the hips.
        expect(Math.abs(x.at(`lowerArm${s}`).x)).toBeLessThan(0.14 * x.s)
        expect(x.at(`lowerArm${s}`).z).toBeLessThan(x.mid('upperArm').z - 0.15 * x.s)
        expect(x.at(`lowerArm${s}`).z).toBeGreaterThan(x.mid('upperLeg').z - 0.02 * x.s)
        expect(x.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(172)
      }
    }
  })

  it('wall walk: from a push-up at the wall to a handstand a hand\'s length from it, and back the same way', () => {
    const f = frames['wall-walk']
    const wall = wallOf(wallWalk, who)
    const start = f[0], top = f[f.length / 2]
    // Start: a straight push-up position, shoulders over the hands, feet on the floor at the wall.
    expect(start.line()).toBeGreaterThan(172)
    expect(Math.abs(start.mid('upperArm').z - start.mid('hand').z)).toBeLessThan(0.03 * start.s)
    expect(start.mid('toes').y).toBeLessThan(0.03 * start.s)
    expect(start.mid('toes').z - wall).toBeLessThan(0.15 * start.s)
    // Top: hands within a hand's length of the wall, body close to upright, arms locked.
    expect(top.mid('hand').z - wall).toBeLessThan(0.19 * top.s)
    expect(top.lean('handL', 'footL')).toBeLessThan(9)
    expect(top.line()).toBeGreaterThan(170)
    for (const s of SIDES) expect(top.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(170)
    expect(top.mid('foot').y).toBeGreaterThan(1.8 * top.s)
    // All the way: nothing through the wall, the hips never sag, the arms stay all but straight, the trunk never drops.
    for (const x of f) {
      for (const j of [...JOINTS, 'toesL', 'toesR'] as BoneName[]) expect(x.at(j).z, `${j} at ${x.t}`).toBeGreaterThan(wall - 0.002)
      expect(x.line(), `line at ${x.t}`).toBeGreaterThan(140)
      expect(x.mid('upperLeg').y, `hips at ${x.t}`).toBeGreaterThan(0.33 * x.s)
      for (const s of SIDES) {
        // A hand on the floor carries weight on a straight arm; the one stepping may give a little.
        const planted = x.at(`hand${s}`).y < 0.026 * x.s
        expect(x.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`), `elbow ${s} at ${x.t}`).toBeGreaterThan(planted ? 166 : 145)
      }
    }
    // Down is the way up in reverse, and it ends where it began.
    const n = f.length
    for (const i of [6, 12, 18]) expect(f[i].mid('hand').z).toBeCloseTo(f[n - i].mid('hand').z, 1)
    expect(f[n - 1].mid('foot').distanceTo(start.mid('foot'))).toBeLessThan(0.05)
    // Feet that are on the wall are on it, not short of it or in it.
    for (const x of feet(wallWalk, who, 96)) for (const ball of x.balls) if (ball.y > 0.3 && ball.z - wall < 0.05) expect(ball.z - wall).toBeGreaterThan(0.005)
  })
})

it('walls are placed for each body', () => {
  expect(wallOf(chestToWall, 'male')).not.toBe(wallOf(chestToWall, 'female'))
  expect(new Vector3(0, 0, wallOf(backToWall, 'male')).z).toBeGreaterThan(0)
})
