import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { EXERCISES, exerciseById } from '@/domain/catalog'
import { BONES, type BoneName } from '../body/skeleton'
import { activationOf, CHANNELS, MUSCLE_CHANNELS, SLOTS } from '../body/muscles'
import { PILOT_EXERCISES } from '../pilot'
import { emptyPose, Rig } from '../rig'
import { highBar } from './hang'
import { MOTIONS, PILOT, motionAt } from './index'

const STEPS = 48
const deg = 180 / Math.PI

/** Every joint of a movement at every sampled moment, for one character. */
function run(id: string, who: 'male' | 'female') {
  const rig = new Rig(who)
  const pose = emptyPose()
  const m = MOTIONS[id]
  return Array.from({ length: STEPS }, (_, i) => {
    const t = i / STEPS
    m.pose(t, rig, pose)
    rig.solve(pose)
    const snap = Object.fromEntries(BONES.map((b) => [b, rig.pos[b].clone()])) as Record<BoneName, Vector3>
    const at = (b: BoneName) => snap[b].clone()
    return {
      t, s: rig.body.scale, body: rig.body,
      at,
      asked: { handL: pose.arm.L.hand.clone(), handR: pose.arm.R.hand.clone(), footL: pose.leg.L.foot.clone(), footR: pose.leg.R.foot.clone() },
      crown: at('head').add(new Vector3(0, rig.body.height - rig.body.rest.head.y, 0).applyQuaternion(rig.rot.head)),
      angle: (a: BoneName, b: BoneName, c: BoneName) => at(a).sub(at(b)).angleTo(at(c).sub(at(b))) * deg,
      /** Shoulders, hips, ankles through the middle of the body: 180 is a straight line. */
      line: () => {
        const mid = (n: string) => at(`${n}L` as BoneName).add(at(`${n}R` as BoneName)).multiplyScalar(0.5)
        return mid('upperArm').sub(mid('upperLeg')).angleTo(mid('foot').sub(mid('upperLeg'))) * deg
      },
    }
  })
}

const drift = (points: Vector3[]) => Math.max(...points.map((p) => p.distanceTo(points[0])))
const SIDES = ['L', 'R'] as const
const both = (name: string) => SIDES.map((s) => `${name}${s}` as BoneName)

describe.each(['male', 'female'] as const)('the pilot movements, %s character', (who) => {
  const frames = Object.fromEntries(PILOT.map((m) => [m.id, run(m.id, who)]))

  it.each(PILOT.map((m) => m.id))('%s: the skeleton is whole and stays above the floor', (id) => {
    for (const f of frames[id]) {
      for (const b of ['hips', 'head', ...both('hand'), ...both('foot'), ...both('lowerArm'), ...both('lowerLeg'), ...both('toes')] as BoneName[]) {
        const p = f.at(b)
        expect(Number.isFinite(p.x + p.y + p.z)).toBe(true)
        expect(p.y).toBeGreaterThan(-0.004)
      }
      // Hands and feet are where the movement put them: nothing was out of reach.
      for (const s of SIDES) {
        expect(f.at(`hand${s}`).distanceTo(f.asked[`hand${s}`])).toBeLessThan(0.003)
        expect(f.at(`foot${s}`).distanceTo(f.asked[`foot${s}`])).toBeLessThan(0.003)
      }
      // No elbow or knee folds further than a real one can.
      for (const s of SIDES) {
        expect(f.angle(`upperArm${s}`, `lowerArm${s}`, `hand${s}`)).toBeGreaterThan(28)
        expect(f.angle(`upperLeg${s}`, `lowerLeg${s}`, `foot${s}`)).toBeGreaterThan(30)
      }
    }
  })

  it.each([
    ['pushup', both('hand'), both('toes')],
    ['pull-up', both('hand'), []],
    ['squat', [], both('foot')],
    ['plank', both('hand'), both('toes')],
    ['pike-pushup', both('hand'), both('toes')],
    ['split-squat', [], ['footL', 'toesR'] as BoneName[]],
    ['dead-hang', both('hand'), []],
    ['freestanding-hs', both('hand'), []],
    ['cat-cow', both('hand'), both('foot')],
  ] as [string, BoneName[], BoneName[]][])('%s: what is planted stays planted', (id, hands, feet) => {
    for (const b of [...hands, ...feet]) expect(drift(frames[id].map((f) => f.at(b)))).toBeLessThan(0.004)
  })

  it('push-up: a straight body, chest to the floor, arms straight at the top', () => {
    const f = frames.pushup
    for (const x of f) expect(x.line()).toBeGreaterThan(173)
    const top = f[0], low = f.reduce((a, b) => (b.at('upperArmL').y < a.at('upperArmL').y ? b : a))
    expect(top.angle('upperArmL', 'lowerArmL', 'handL')).toBeGreaterThan(165)
    expect(low.at('upperArmL').y).toBeLessThan(0.23 * low.s)
    expect(low.angle('upperArmL', 'lowerArmL', 'handL')).toBeLessThan(100)
    // Elbows back, not out to the sides: well under a right angle from the body's line.
    const elbow = low.at('lowerArmL').sub(low.at('upperArmL'))
    expect(Math.abs(Math.atan2(elbow.x, -elbow.z)) * deg).toBeLessThan(60)
  })

  it('pull-up: from straight arms to the chin over the bar, without swinging', () => {
    const f = frames['pull-up']
    const bar = highBar(f[0].body)
    expect(f[0].angle('upperArmL', 'lowerArmL', 'handL')).toBeGreaterThan(170)
    const top = f.reduce((a, b) => (b.at('head').y > a.at('head').y ? b : a))
    // The chin is a little below the joint the head turns on.
    expect(top.at('head').y - 0.02 * top.s).toBeGreaterThan(bar.height)
    for (const x of f) {
      expect(x.at('footL').y).toBeGreaterThan(0.05)
      expect(Math.abs(x.at('hips').z - x.at('handL').z)).toBeLessThan(0.3 * x.s)
    }
  })

  it('squat: hip crease below the knee, heels down, knees over the toes', () => {
    const f = frames.squat
    const low = f.reduce((a, b) => (b.at('upperLegL').y < a.at('upperLegL').y ? b : a))
    expect(low.at('upperLegL').y).toBeLessThan(low.at('lowerLegL').y)
    expect(f[0].angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(170)
    for (const x of f) {
      expect(Math.abs(x.at('footL').y - x.body.ankle)).toBeLessThan(0.002)
      // The knee travels forward over the foot, to about the tips of the toes and no further.
      expect(x.at('lowerLegL').z).toBeLessThan(x.at('toesL').z + 0.11 * x.s)
    }
    // At the bottom the knee is out over the foot, not fallen inwards.
    expect(low.at('lowerLegL').x).toBeGreaterThan(low.at('footL').x - 0.02)
  })

  it('plank: elbows under the shoulders and one line from heels to shoulders', () => {
    for (const x of frames.plank) {
      expect(x.line()).toBeGreaterThan(173)
      expect(Math.abs(x.at('lowerArmL').z - x.at('upperArmL').z)).toBeLessThan(0.025)
      expect(x.angle('upperArmL', 'lowerArmL', 'handL')).toBeGreaterThan(84)
      expect(x.angle('upperArmL', 'lowerArmL', 'handL')).toBeLessThan(96)
      expect(x.at('lowerArmL').y).toBeLessThan(0.07 * x.s)
    }
  })

  it('pike push-up: hips high, head to the floor in front of the hands, arms straight at the top', () => {
    const f = frames['pike-pushup']
    const low = f.reduce((a, b) => (b.crown.y < a.crown.y ? b : a))
    expect(low.crown.y).toBeLessThan(0.1 * low.s)
    expect(low.crown.z).toBeGreaterThan(low.at('handL').z)
    expect(f[0].angle('upperArmL', 'lowerArmL', 'handL')).toBeGreaterThan(160)
    for (const x of f) expect(x.at('hips').y).toBeGreaterThan(x.at('upperArmL').y + 0.2 * x.s)
  })

  it('hollow hold: hips on the floor, legs and shoulders low and off it', () => {
    for (const x of frames['hollow-hold']) {
      expect(x.at('hips').y).toBeLessThan(0.14 * x.s)
      const leg = x.at('footL').sub(x.at('upperLegL'))
      const lift = Math.atan2(leg.y, Math.hypot(leg.x, leg.z)) * deg
      expect(lift).toBeGreaterThan(5)
      expect(lift).toBeLessThan(25)
      expect(x.at('upperArmL').y).toBeGreaterThan(x.at('hips').y)
      expect(x.angle('upperLegL', 'lowerLegL', 'footL')).toBeGreaterThan(172)
    }
  })

  it('split squat: trunk upright, back knee to just above the floor, front shin near vertical', () => {
    const f = frames['split-squat']
    const low = f.reduce((a, b) => (b.at('hips').y < a.at('hips').y ? b : a))
    expect(low.at('lowerLegR').y).toBeGreaterThan(0.03 * low.s)
    expect(low.at('lowerLegR').y).toBeLessThan(0.14 * low.s)
    for (const x of f) {
      const trunk = x.at('upperChest').sub(x.at('hips'))
      expect(Math.atan2(Math.hypot(trunk.x, trunk.z), trunk.y) * deg).toBeLessThan(12)
      const shin = x.at('lowerLegL').sub(x.at('footL'))
      expect(Math.atan2(Math.abs(shin.z), shin.y) * deg).toBeLessThan(30)
    }
  })

  it('dead hang: arms straight, feet clear of the floor', () => {
    for (const x of frames['dead-hang']) {
      expect(x.angle('upperArmL', 'lowerArmL', 'handL')).toBeGreaterThan(170)
      expect(x.at('toesL').y).toBeGreaterThan(0.04)
    }
  })

  it('handstand: locked arms and one vertical line from wrists to ankles', () => {
    for (const x of frames['freestanding-hs']) {
      expect(x.angle('upperArmL', 'lowerArmL', 'handL')).toBeGreaterThan(172)
      for (const b of ['upperArmL', 'upperLegL', 'footL'] as BoneName[]) expect(Math.abs(x.at(b).z - x.at('handL').z)).toBeLessThan(0.09 * x.s)
      expect(x.at('footL').y).toBeGreaterThan(x.at('upperLegL').y)
      expect(x.line()).toBeGreaterThan(172)
    }
  })

  it('cat-cow: knees on the floor, arms straight, the spine rounds one way and arches the other', () => {
    const f = frames['cat-cow']
    const bend = f.map((x) => x.at('chest').y - (x.at('hips').y + x.at('upperChest').y) / 2)
    expect(Math.max(...bend)).toBeGreaterThan(0.02 * f[0].s)
    expect(Math.min(...bend)).toBeLessThan(-0.01 * f[0].s)
    for (const x of f) {
      expect(x.angle('upperArmL', 'lowerArmL', 'handL')).toBeGreaterThan(165)
      expect(x.at('lowerLegL').y).toBeLessThan(0.08 * x.s)
      expect(x.at('lowerLegL').y).toBeGreaterThan(0.025 * x.s)
    }
  })
})

describe('the pilot as a set', () => {
  it('is ten exercises of the library, each with a movement and a stated standard', () => {
    expect(PILOT_EXERCISES).toHaveLength(10)
    expect(PILOT.map((m) => m.id)).toEqual([...PILOT_EXERCISES])
    for (const m of PILOT) {
      expect(exerciseById[m.id], m.id).toBeDefined()
      expect(m.standard.length).toBeGreaterThan(20)
      expect(m.revision).toBeGreaterThanOrEqual(1)
      expect(motionAt(m.id, m.revision)).toBe(m)
      // A hold has no repetitions; a rep has a moment it counts.
      if (m.kind === 'reps') expect(m.beat).toBeDefined()
      for (let i = 0; i <= 20; i++) { const e = m.effort(i / 20); expect(e).toBeGreaterThanOrEqual(0); expect(e).toBeLessThanOrEqual(1) }
    }
    expect(new Set(PILOT.map((m) => m.kind))).toEqual(new Set(['reps', 'hold', 'balance', 'mobility']))
  })

  it('covers both characters with the same movement: a planted hand is planted for each', () => {
    const [m, f] = (['male', 'female'] as const).map((who) => run('pushup', who))
    expect(m[0].s).not.toBe(f[0].s)
    expect(drift(m.map((x) => x.at('handL')))).toBeLessThan(0.004)
    expect(drift(f.map((x) => x.at('handL')))).toBeLessThan(0.004)
  })
})

describe('muscle activation', () => {
  it('gives every muscle the library names somewhere to show', () => {
    for (const [muscle, channels] of Object.entries(MUSCLE_CHANNELS)) {
      expect(Object.keys(channels).length, muscle).toBeGreaterThan(0)
      for (const c of Object.keys(channels)) expect(CHANNELS).toContain(c)
    }
  })

  it('lights primaries fully, secondaries less, stabilisers least, for every exercise in the library', () => {
    for (const ex of EXERCISES) {
      const a = activationOf(ex)
      expect(a).toHaveLength(SLOTS)
      expect(Math.max(...a)).toBe(1)
      const level = (m: (typeof ex.primary)[number]) => Math.max(...Object.keys(MUSCLE_CHANNELS[m]).map((c) => a[CHANNELS.indexOf(c as (typeof CHANNELS)[number]) * 2]))
      for (const m of ex.secondary) if (!ex.primary.includes(m)) expect(level(m), `${ex.id} ${m}`).toBeLessThan(1)
      for (const m of ex.stabilizers) if (!ex.primary.includes(m) && !ex.secondary.includes(m)) expect(level(m), `${ex.id} ${m}`).toBeLessThanOrEqual(0.55)
    }
  })

  it('applies a movement\'s own corrections, per side where it says so', () => {
    const a = activationOf(exerciseById['split-squat'], MOTIONS['split-squat'].detail)
    const quads = CHANNELS.indexOf('quads') * 2
    expect(a[quads]).toBe(1)
    expect(a[quads + 1]).toBeCloseTo(0.6)
  })
})
