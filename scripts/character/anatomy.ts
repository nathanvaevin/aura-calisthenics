/**
 * The Aura body, as shapes.
 *
 * One description for every character. A build (`aura`, `power`, `iron`) is
 * the same anatomy on the same skeleton with more or less muscle on it, its
 * own hair and its own small pieces of kit; see `TUNE` and the hair and
 * clothing sections. The Aura build is the master the others are derived from.
 *
 * One description for both sexes: every shape is placed relative
 * to the skeleton, so the female character is the same anatomy on her own
 * proportions, with a handful of stated differences. Coordinates are written
 * for the 1.80 m reference body and scaled.
 *
 * Muscles are their own shapes, named after the channel they light up
 * (src/visual/body/muscles.ts). That is what makes the activation follow the
 * muscle instead of a painted patch.
 */
import { skeletonOf, type BuildId, type CharacterId, type Skeleton, type V3 } from '../../src/visual/body/skeleton'
import type { Channel } from '../../src/visual/body/muscles'
import { Field, gradient, type Fn, type Shape } from './sdf'

export interface Garment {
  name: string
  thickness: Fn
  region: Fn
  /**
   * Worn on the skin: cut from the skin's own surface and moving exactly as it does (see `wear.ts`), where a garment
   * laid over the body would show the skin sliding at its edge. `seams` are lines its thickness changes along.
   */
  fitted?: boolean
  seams?: Fn[]
  /** `accent` pieces take the colour of the athlete's theme. */
  material?: 'cloth' | 'accent'
  /** Where to mesh it, when it is not on the trunk. */
  box?: [V3, V3]
  triangles?: number
}

export interface Anatomy {
  id: CharacterId
  build: BuildId
  sk: Skeleton
  body: Shape[]
  hair: Shape[]
  /** Room the hair needs, and how finely it is kept. */
  hairBox: [V3, V3]
  hairTriangles: number
  garments: Garment[]
  /**
   * Where the fine parts are cut from the body: hands beyond x, head above y, feet below y.
   * `rise` lifts the neck cut away from the centre line (metres per metre squared), so that
   * shoulders and traps which stand higher than the neck stay part of the trunk.
   */
  cuts: { wrist: number; neck: number; ankle: number; rise: number }
  /** Where the wordmark sits on the shorts, at rest, seen from the front. */
  logo: { x: number; y: number; width: number; height: number }
}

type Bones = Record<string, number>
interface Opt { k: number; bones: Bones; rot?: V3; sub?: boolean; mirror?: boolean }

const rad = Math.PI / 180

/** World directions of a shape's own axes after turning it about X, then Y, then Z (degrees). */
function turned([rx, ry, rz]: V3): [V3, V3, V3] {
  const cx = Math.cos(rx * rad), sx = Math.sin(rx * rad)
  const cy = Math.cos(ry * rad), sy = Math.sin(ry * rad)
  const cz = Math.cos(rz * rad), sz = Math.sin(rz * rad)
  return [
    [cz * cy, sz * cy, -sy],
    [cz * sy * sx - sz * cx, sz * sy * sx + cz * cx, cy * sx],
    [cz * sy * cx + sz * sx, sz * sy * cx - cz * sx, cy * cx],
  ]
}

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => mul(a, 1 / Math.hypot(a[0], a[1], a[2]))
const mix = (a: V3, b: V3, t: number): V3 => add(a, mul(sub(b, a), t))

/**
 * What a build changes about the Aura body: how much muscle sits on the same
 * skeleton and how deeply it is cut. Every value is a multiple of the Aura
 * master's, [male, female]; the Aura build is all ones.
 */
interface Tune {
  /** Depth of the muscle definition, and how square and sharp-edged each muscle is. */
  def: [number, number]; power: number; edge: number
  /** Muscle bulk in general, then part by part. */
  mus: [number, number]
  trunkW: [number, number]; trunkD: [number, number]; waist: [number, number]
  arm: [number, number]; forearm: [number, number]; delt: [number, number]; neck: [number, number]
  lat: [number, number]; trap: [number, number]; chest: [number, number]
  leg: [number, number]; calf: [number, number]; glute: [number, number]
}

const ONE: [number, number] = [1, 1]
const TUNE: Record<BuildId, Tune> = {
  aura: { def: ONE, power: 1, edge: 0, mus: ONE, trunkW: ONE, trunkD: ONE, waist: ONE, arm: ONE, forearm: ONE, delt: ONE, neck: ONE, lat: ONE, trap: ONE, chest: ONE, leg: ONE, calf: ONE, glute: ONE },
  // The anime hero: wide shoulders over a narrow waist, full forearms and calves, clean smooth muscle.
  power: {
    def: [1.3, 1.35], power: 1, edge: 0, mus: [1.15, 1.12],
    trunkW: [1.04, 1.02], trunkD: [1.02, 1], waist: [0.93, 0.95],
    arm: [1.12, 1.1], forearm: [1.2, 1.14], delt: [1.18, 1.14], neck: [1.08, 1],
    lat: [1.22, 1.14], trap: [1.15, 1.05], chest: [1.14, 1.04],
    leg: [1.06, 1.05], calf: [1.16, 1.12], glute: [1, 1.02],
  },
  // The fighter: dense everywhere, thick neck and traps, wide lats, muscle cut deep.
  iron: {
    def: [1.55, 1.75], power: 1.05, edge: -0.1, mus: [1.4, 1.45],
    trunkW: [1.08, 1.05], trunkD: [1.08, 1.04], waist: [1.04, 1.02],
    arm: [1.28, 1.3], forearm: [1.34, 1.34], delt: [1.3, 1.32], neck: [1.3, 1.22],
    lat: [1.3, 1.32], trap: [1.6, 1.45], chest: [1.3, 1.1],
    leg: [1.16, 1.2], calf: [1.24, 1.24], glute: [1.08, 1.1],
  },
}

export function anatomyOf(id: CharacterId, build: BuildId = 'aura'): Anatomy {
  const sk = skeletonOf(id)
  const J = sk.joints
  const S = sk.scale
  const F = id === 'female'
  const pick = <T,>(male: T, female: T) => (F ? female : male)
  const T = TUNE[build]
  const tu = (k: Exclude<keyof Tune, 'power' | 'edge'>) => T[k][F ? 1 : 0]

  const body: Shape[] = []
  const E = (c: V3, r: V3, o: Opt) => body.push({ kind: 'ell', c, r, axes: o.rot ? turned(o.rot) : undefined, k: o.k * S, sub: o.sub, mirror: o.mirror ?? c[0] > 1e-6, bones: o.bones })
  const C = (a: V3, b: V3, r1: number, r2: number, o: Opt) => body.push({ kind: 'cone', a, b, r1, r2, k: o.k * S, sub: o.sub, mirror: o.mirror ?? (a[0] > 1e-6 || b[0] > 1e-6), bones: o.bones })
  const limbAxes = (dir: V3): [V3, V3, V3] => {
    const ly = unit(dir)
    const lx = unit(sub([1, 0, 0], mul(ly, ly[0])))
    return [lx, ly, cross(lx, ly)]
  }
  /** A solid lying along a limb: half-length, half-width (sideways) and half-depth (front to back). */
  const along = (c: V3, dir: V3, len: number, w: number, d: number, o: Opt) =>
    body.push({ kind: 'ell', c, r: [w * S, len * S, d * S], axes: limbAxes(dir), k: o.k * S, mirror: true, bones: o.bones })

  // Scales. `m` thins muscle, `wT` and `dT` narrow the trunk, `def` is how deep the definition is cut.
  const m = pick(1, 0.8) * tu('mus')
  const wT = pick(1, 0.9) * tu('trunkW')
  const dT = pick(1, 0.94) * tu('trunkD')
  const def = pick(1, 0.56) * tu('def')
  /**
   * The female body is drawn as its own, not as the male's made smaller (2026-11-24): the mass of the upper arm, the
   * sweep of the back, the neck and the knee are each lighter by their own measure; the pelvis, the seat and the
   * calf are fuller. Shapes only: both bodies stand on the skeleton they had.
   */
  const fem = { fold: pick(1, 0.78), upperArm: pick(1, 0.8), lat: pick(1, 0.66), trap: pick(1, 0.8), knee: pick(1, 0.9), shin: pick(1, 0.94), deltLong: pick(1, 0.86), deltTall: pick(1, 0.84) }
  const t = (x: number, y: number, z: number): V3 => [x * S, y * S, z * S]
  const tm = (x: number, y: number, z: number): V3 => [x * S * wT, y * S, z * S * dT]
  const R = (a: number, b: number, c: number): V3 => [a * S, b * S, c * S]

  /**
   * A muscle: the skin inside this ellipsoid stands `height` proud, and
   * lights up as `channel`. The ellipsoid only marks out the patch, so it is
   * centred on the skin and is as deep as it needs to be to catch it.
   */
  const M = (channel: Channel, c: V3, r: V3, height: number, o: { rot?: V3; axes?: [V3, V3, V3]; edge?: number; power?: number } = {}) =>
    body.push({ kind: 'ell', c, r, axes: o.axes ?? (o.rot ? turned(o.rot) : undefined), k: 0, mirror: true, bones: {}, muscle: channel, relief: height * S * def, edge: Math.max(0.15, Math.min(0.85, (o.edge ?? 0.5) + T.edge)), power: (o.power ?? 2.6) * T.power })

  // ── Trunk ──────────────────────────────────────────────────────────────
  E(t(0, 0.975, -0.008), R(0.14 * pick(1, 1.09), 0.095, 0.097 * pick(1, 1.05)), { k: 0.05, bones: { hips: 1, spine: 0.6 } })
  E(t(0, 1.1, -0.002), R(0.121 * pick(1, 0.95) * tu('waist'), 0.115, 0.08 * pick(1, 0.94)), { k: 0.05, bones: { spine: 1, chest: 1, hips: 0.7 } })
  E(t(0, 1.285, -0.01), R(0.15 * wT, 0.15, 0.107 * dT), { k: 0.05, bones: { chest: 1, upperChest: 1, spine: 0.6 } })
  E(t(0, 1.405, -0.018), [J.upperArmL[0] * 0.86, 0.075 * S, 0.09 * S * dT], { k: 0.05, bones: { upperChest: 1, chest: 0.5, neck: 0.3 } })

  const aS = S * pick(1, 0.85) * tu('arm')
  // Deltoid and forearm on top of the arm's own thickness.
  const dl = tu('delt') / tu('arm'), fa = tu('forearm') / tu('arm')
  const A = (J.lowerArmL[0] - J.upperArmL[0]) / 0.3
  const sh = (dx: number, dy: number, dz: number): V3 => [J.upperArmL[0] + dx * A, J.upperArmL[1] + dy * S, J.upperArmL[2] + dz * S]
  // The female shoulder is fitted, not capped: a slimmer yoke, and a smaller deltoid that sits a little lower so the line from neck to arm slopes.
  const yoke = pick(1, 0.9), cap = pick(1, 0.8)
  C(t(0.04, 1.452, -0.02), sh(-0.012, -0.002, -0.002), 0.058 * aS * yoke, 0.047 * aS * yoke, { k: 0.04, bones: { upperChest: 1, shoulderL: 1 } })
  const nk = S * pick(1, 0.84) * tu('neck')
  C(t(0, 1.45, -0.022), t(0, 1.6, -0.004), 0.058 * nk, 0.052 * nk, { k: 0.035, bones: { neck: 1, upperChest: 0.8, head: 0.8 } })
  E(t(0, 1.693, 0.012), R(0.079, 0.108, 0.095), { k: 0.03, bones: { head: 1 } })
  E(t(0, 1.64, 0.026), R(pick(0.064, 0.059), 0.066, 0.068), { k: 0.03, bones: { head: 1, neck: 0.4 } })
  E(t(0, 1.603, 0.055), R(pick(0.03, 0.026), pick(0.024, 0.022), 0.026), { k: 0.02, bones: { head: 1 } })
  E(t(0, 1.668, 0.097), R(0.0105, 0.03, 0.012), { k: 0.022, bones: { head: 1 } })
  E(t(0.0755, 1.676, 0.0), R(0.006, 0.027, 0.015), { k: 0.008, rot: [0, -14, -6], bones: { head: 1 } })
  C(t(0.018, 1.452, 0.052), sh(-0.03, 0.008, 0.022), 0.0095 * S, 0.0085 * S, { k: 0.016, bones: { upperChest: 1, shoulderL: 0.8 } })

  // Mass: what gives the trunk its athletic shape, blended smooth.
  E(tm(0.072, 1.372, 0.05), R(0.082 * wT, 0.066, 0.048 * pick(1, 0.7) * tu('chest')), { k: 0.04, rot: [0, 0, 8], bones: { upperChest: 1, shoulderL: 0.4, upperArmL: pick(0.25, 0.07) } })
  C(tm(0.125, 1.4, pick(0.046, 0.036)), sh(0.04, -0.014, pick(0.02, 0.014)), 0.03 * S * m * fem.fold, 0.022 * aS * fem.upperArm * fem.fold, { k: 0.035, bones: { upperChest: 1, shoulderL: 0.8, upperArmL: 0.35 } })
  if (F) E(tm(0.071, 1.35, 0.088), R(0.056, 0.05, 0.047), { k: 0.026, bones: { upperChest: 1, chest: 0.6 } })
  E(tm(0.075, 1.375, -0.078), R(0.085 * wT, 0.1, 0.045), { k: 0.045, bones: { upperChest: 1, chest: 0.8, shoulderL: 0.4 } })
  E(tm(0.124, 1.275, -0.056), R(0.054 * fem.lat * tu('lat'), 0.125, 0.046 * m), { k: 0.035, rot: [0, 0, -13], bones: { chest: 1, upperChest: 1, spine: 0.6 } })
  C(tm(0.138, 1.375, -0.058), sh(0.04, -0.016, -0.028), 0.032 * S * m * pick(1, 0.9), 0.022 * aS * fem.upperArm, { k: 0.035, bones: { upperChest: 1, shoulderL: 0.8, upperArmL: 0.35 } })
  E(tm(0.075, 1.49, -0.04), R(0.085 * wT, 0.032 * tu('trap') * fem.trap, 0.042 * tu('trap') * fem.trap), { k: 0.03, rot: [0, 0, -14], bones: { upperChest: 1, neck: 0.5, shoulderL: 0.6 } })
  C(t(0.03, 1.565, -0.03), tm(0.11, 1.475, -0.03), 0.02 * nk * tu('trap'), 0.03 * S * tu('trap') * fem.trap, { k: 0.03, bones: { neck: 1, upperChest: 1, shoulderL: 0.5 } })
  E(tm(0.034, 1.11, -0.074), R(0.03, 0.11, 0.022), { k: 0.025, bones: { spine: 1, chest: 1, hips: 1 } })
  E(tm(0.088, 1.13, 0.014), R(0.026, 0.075, 0.05), { k: 0.045, bones: { spine: 1, chest: 1, hips: 0.7 } })
  E(t(0, 1.26, -0.134 * dT), R(0.006, 0.2, 0.012), { k: 0.012, sub: true, bones: {} })

  // Definition, front
  M('pec', tm(0.084, 1.368, 0.09), R(0.088 * wT, 0.06, 0.07), pick(0.007, 0.003), { rot: [0, 0, 10], edge: 0.62, power: 3 })
  M('pec_upper', tm(0.092, 1.432, 0.072), R(0.086 * wT, 0.03, 0.06), 0.004, { rot: [0, 0, 12], power: 3 })
  const abx = pick(0.0365, 0.034)
  for (const [y, ry] of [[1.264, 0.0295], [1.205, 0.0295], [1.146, 0.0295], [1.072, 0.045]]) M('abs', tm(abx, y, 0.09), R(0.0355, ry, 0.06), 0.0045, { edge: 0.45, power: 4 })
  M('obliques', tm(0.112, 1.12, 0.03), R(0.04, 0.095, 0.08), 0.003, { rot: [0, 0, -8], power: 3 })
  for (const [x, y, z] of [[0.128, 1.292, 0.06], [0.135, 1.262, 0.05], [0.139, 1.232, 0.04]]) M('serratus', tm(x, y, z), R(0.03, 0.0135, 0.05), 0.0028, { rot: [0, 0, -22], edge: 0.3 })
  // Definition, back
  M('traps', tm(0.07, 1.498, -0.05), R(0.09 * wT, 0.042, 0.06), 0.004, { rot: [0, 0, -14] })
  M('traps', t(0.034, 1.548, -0.05), R(0.038, 0.055, 0.05), 0.003)
  M('mid_back', tm(0.046, 1.4, -0.112), R(0.047, 0.095, 0.06), 0.004, { power: 3 })
  M('rear_cuff', tm(0.134, 1.392, -0.1), R(0.056, 0.048, 0.06), 0.0025, { rot: [0, 0, 15], edge: 0.25 })
  M('lats', tm(0.118, 1.262, -0.085), R(0.066 * pick(1, 0.8), 0.125, 0.08), 0.005, { rot: [0, 0, -13], power: 3 })
  M('lats', tm(0.156, 1.352, -0.06), R(0.038, 0.066, 0.07), 0.004)
  M('lower_back', tm(0.037, 1.1, -0.09), R(0.034, 0.105, 0.06), 0.004, { power: 3 })

  // ── Arm (reaching along +X, palm down: the biceps faces forward) ─────────
  C(sh(0, 0, 0), sh(0.3, 0, 0), 0.043 * aS * pick(1, 0.9), 0.035 * aS * pick(1, 0.96), { k: 0.03, bones: { shoulderL: 0.5, upperArmL: 1, lowerArmL: 1 } })
  C(sh(0.3, 0, 0), sh(0.564, 0, 0), 0.036 * aS, 0.0245 * aS, { k: 0.02, bones: { upperArmL: 1, lowerArmL: 1, handL: 1 } })
  E(sh(0.3, 0, -0.03), mul([0.022, 0.02, 0.018], aS), { k: 0.014, bones: { upperArmL: 1, lowerArmL: 1 } })
  E(sh(0.046 * fem.deltLong, pick(0.024, 0.01), -0.002), [0.098 * A * fem.deltLong, 0.056 * aS * dl * cap * fem.deltTall, 0.062 * aS * dl * cap], { k: 0.03, bones: { shoulderL: 0.6, upperArmL: 1, upperChest: 0.2 } })
  E(sh(0.157, -0.004, 0.028), [0.1 * A, 0.036 * aS * fem.upperArm, 0.034 * aS * m * fem.upperArm], { k: 0.026, bones: { upperArmL: 1, lowerArmL: 0.5 } })
  E(sh(0.142, 0, -0.032), [0.11 * A, 0.038 * aS * fem.upperArm, 0.034 * aS * m * fem.upperArm], { k: 0.026, bones: { upperArmL: 1, shoulderL: 0.3 } })
  E(sh(0.397, -0.014, 0.008), [0.095 * A, 0.027 * aS * fa, 0.036 * aS * fa], { k: 0.022, bones: { lowerArmL: 1, upperArmL: 0.5 } })
  E(sh(0.382, 0.015, -0.002), [0.092 * A, 0.024 * aS * fa, 0.036 * aS * fa], { k: 0.022, bones: { lowerArmL: 1, upperArmL: 0.5 } })
  E(sh(0.332, 0.006, 0.028), [0.06 * A, 0.022 * aS, 0.02 * aS], { k: 0.022, bones: { upperArmL: 1, lowerArmL: 1 } })
  const arm = (dx: number, dy: number, dz: number, len: number, up: number, across: number): [V3, V3] => [sh(dx, dy, dz), [len * A, up * aS, across * aS]]
  M('delt_lat', ...arm(0.058, pick(0.052, 0.04), -0.002, 0.096, 0.056, 0.036), 0.005)
  M('delt_ant', ...arm(0.044, 0.008, 0.054, 0.088, 0.046, 0.045), 0.005)
  M('delt_post', ...arm(0.044, 0.008, -0.058, 0.088, 0.046, 0.045), 0.005)
  M('biceps', ...arm(0.162, -0.006, 0.045, 0.1, 0.042, 0.045), 0.005)
  M('triceps', ...arm(0.146, 0, -0.05, 0.112, 0.044, 0.045), 0.005)
  M('forearm_flex', ...arm(0.4, -0.024, 0.006, 0.1, 0.03, 0.042), 0.003)
  M('forearm_ext', ...arm(0.386, 0.024, -0.004, 0.096, 0.03, 0.042), 0.003)

  // Hand
  const H = (J.fingers1L[0] - J.handL[0]) / 0.094
  const hd = (dx: number, dy: number, dz: number): V3 => [J.handL[0] + dx * H, J.handL[1] + dy * H, J.handL[2] + dz * H]
  E(hd(-0.012, 0, 0), mul([0.03, 0.0195, 0.0295], H), { k: 0.012, bones: { lowerArmL: 1, handL: 1 } })
  E(hd(0.05, -0.002, 0), mul([0.052, 0.0135, 0.044], H), { k: 0.01, bones: { handL: 1, lowerArmL: 1, fingers1L: 0.6 } })
  E(hd(0.034, -0.006, 0.024), mul([0.03, 0.015, 0.02], H), { k: 0.008, bones: { handL: 1, thumb1L: 0.6 } })
  C(sk.joints.thumb1L, sk.joints.thumb2L, 0.0125 * H, 0.0108 * H, { k: 0.006, bones: { handL: 1, thumb1L: 1, thumb2L: 1 } })
  C(sk.joints.thumb2L, sk.tips.thumbTipL, 0.0105 * H, 0.0085 * H, { k: 0.004, bones: { thumb1L: 1, thumb2L: 1 } })
  const fingers: [number, number[], number, number][] = [
    [0.0295, [0.09, 0.136, 0.164, 0.186], 5, 1],
    [0.0095, [0.094, 0.141, 0.171, 0.194], 1.5, 1],
    [-0.0105, [0.09, 0.135, 0.163, 0.185], -2, 1],
    [-0.0295, [0.082, 0.117, 0.139, 0.157], -6, 0.86],
  ]
  for (const [z0, xs, fan, thick] of fingers) {
    const at = (x: number) => hd(x, -0.002, z0 + (x - xs[0]) * Math.tan(fan * rad))
    const r = [0.0088, 0.0082, 0.0076, 0.0068].map((v) => v * thick * H)
    C(at(xs[0] - 0.012), at(xs[1]), r[0], r[1], { k: 0.0035, bones: { handL: 1, fingers1L: 1, fingers2L: 1 } })
    C(at(xs[1]), at(xs[2]), r[1], r[2], { k: 0.0035, bones: { fingers1L: 1, fingers2L: 1, fingers3L: 1 } })
    C(at(xs[2]), at(xs[3]), r[2], r[3], { k: 0.0035, bones: { fingers2L: 1, fingers3L: 1 } })
  }

  // ── Hips and leg ────────────────────────────────────────────────────────
  const hip = J.upperLegL, knee = J.lowerLegL, ankle = J.footL
  const thigh = sub(knee, hip), shin = sub(ankle, knee)
  const lg = (tt: number, ox: number, oz: number): V3 => add(mix(hip, knee, tt), [ox * S, 0, oz * S])
  const sn = (tt: number, ox: number, oz: number): V3 => add(mix(knee, ankle, tt), [ox * S, 0, oz * S])
  const gl = pick(1, 1.16) * tu('glute')
  const lb = pick(1, 0.99) * tu('leg')
  const cb = pick(1, 0.99) * tu('calf')
  E([hip[0] - 0.012 * S, 0.955 * S, -0.068 * S], R(0.08 * gl, 0.085 * gl, 0.054 * gl), { k: 0.035, bones: { hips: 1, upperLegL: 0.6 } })
  E([hip[0] + 0.03 * S, 1.01 * S, -0.03 * S], R(0.036, 0.05, 0.05), { k: 0.04, bones: { hips: 1, spine: 0.3 } })
  if (F) E([hip[0] + 0.04 * S, 0.93 * S, -0.012 * S], R(0.052, 0.09, 0.076), { k: 0.045, bones: { hips: 1, upperLegL: 0.6 } })
  C(add(hip, [0.012 * S, -0.03 * S, 0]), knee, 0.086 * S * lb, 0.05 * S * fem.knee, { k: 0.04, bones: { hips: 0.6, upperLegL: 1, lowerLegL: 1 } })
  along(lg(0.42, 0.01, 0.042), thigh, 0.19, 0.058 * lb, 0.044 * lb, { k: 0.035, bones: { upperLegL: 1, hips: 0.3 } })
  along(lg(0.48, 0, -0.044), thigh, 0.18, 0.05 * lb, 0.036 * lb, { k: 0.035, bones: { upperLegL: 1, hips: 0.3 } })
  along(lg(0.2, -0.04, -0.005), thigh, 0.12, 0.034, 0.05, { k: 0.035, bones: { upperLegL: 1, hips: 0.5 } })
  along(lg(0.78, -0.032, 0.022), thigh, 0.06, 0.026 * lb, 0.028 * lb, { k: 0.02, bones: { upperLegL: 1, lowerLegL: 0.4 } })
  E(add(knee, [0, 0.008 * S, 0.04 * S]), R(0.024 * fem.knee, 0.03, 0.014 * fem.knee), { k: 0.024, bones: { upperLegL: 1, lowerLegL: 1 } })
  C(knee, ankle, 0.048 * S * fem.knee, 0.033 * S * fem.shin, { k: 0.03, bones: { upperLegL: 1, lowerLegL: 1, footL: 1 } })
  along(sn(0.26, 0, -0.034), shin, 0.1, 0.042 * cb, 0.034 * cb, { k: 0.025, bones: { lowerLegL: 1, upperLegL: 0.3 } })
  along(sn(0.55, 0, -0.018), shin, 0.1, 0.033 * cb, 0.022, { k: 0.02, bones: { lowerLegL: 1 } })
  along(sn(0.33, 0.02, 0.026), shin, 0.12, 0.016, 0.018, { k: 0.016, bones: { lowerLegL: 1 } })
  const onThigh = limbAxes(thigh), onShin = limbAxes(shin)
  M('glutes', [hip[0] - 0.012 * S, 0.955 * S, -0.09 * S], R(0.082 * gl, 0.088 * gl, 0.07), 0.004)
  M('glute_med', [hip[0] + 0.04 * S, 1.03 * S, -0.035 * S], R(0.046, 0.05, 0.07), 0.003)
  M('hip_flexors', [hip[0] + 0.004 * S, 0.985 * S, 0.07 * S], R(0.042, 0.05, 0.05), 0.003)
  M('quads', lg(0.42, 0.002, 0.066), R(0.034, 0.18, 0.055), 0.005, { axes: onThigh })
  M('quads', lg(0.5, 0.056, 0.02), R(0.036, 0.165, 0.06), 0.005, { axes: onThigh })
  M('quads', lg(0.77, -0.04, 0.034), R(0.03, 0.07, 0.045), 0.005, { axes: onThigh })
  M('adductors', lg(0.22, -0.058, -0.005), R(0.04, 0.12, 0.06), 0.003, { axes: onThigh })
  M('hamstrings', lg(0.5, 0.028, -0.062), R(0.032, 0.17, 0.05), 0.004, { axes: onThigh })
  M('hamstrings', lg(0.47, -0.028, -0.064), R(0.032, 0.17, 0.05), 0.004, { axes: onThigh })
  M('calves', sn(0.25, -0.024, -0.046), R(0.03, 0.1, 0.045), 0.005, { axes: onShin })
  M('calves', sn(0.23, 0.026, -0.046), R(0.028, 0.09, 0.045), 0.005, { axes: onShin })
  M('calves', sn(0.57, 0, -0.03), R(0.036, 0.085, 0.035), 0.003, { axes: onShin })

  // Foot
  const ft = (dx: number, dy: number, dz: number): V3 => add(ankle, [dx * S, dy * S, dz * S])
  E(ft(0, 0, 0), R(0.034, 0.04, 0.04), { k: 0.014, bones: { footL: 1, lowerLegL: 1 } })
  E(ft(0, -0.045, -0.035), R(0.03, 0.034, 0.04), { k: 0.014, bones: { footL: 1, lowerLegL: 0.5 } })
  C(ft(0, -0.03, 0), ft(0.008, -0.055, 0.105), 0.036 * S, 0.022 * S, { k: 0.014, bones: { footL: 1, toesL: 0.6 } })
  E(ft(0.006, -0.066, 0.045), R(0.042, 0.016, 0.095), { k: 0.01, bones: { footL: 1, toesL: 0.4 } })
  E(ft(0.008, -0.062, 0.118), R(0.047, 0.018, 0.035), { k: 0.01, bones: { footL: 1, toesL: 1 } })
  const toes: [number, number, number][] = [[-0.022, 0.182, 0.0135], [-0.002, 0.186, 0.0098], [0.013, 0.179, 0.0092], [0.027, 0.169, 0.0088], [0.04, 0.157, 0.0084]]
  for (const [x, zEnd, r] of toes) C(ft(x, -0.066, 0.13), ft(x * 1.05, -0.069, zEnd), r * S, r * S * 0.88, { k: 0.004, bones: { toesL: 1, footL: 0.6 } })

  // ── Hair (female): short, loose, to the jaw ─────────────────────────────
  const hair: Shape[] = []
  if (F && build === 'aura') {
    const lock = (c: V3, r: V3, rot: V3 = [0, 0, 0], extra: Partial<Shape> = {}) => hair.push({ kind: 'ell', c, r, axes: turned(rot), k: 0.012 * S, mirror: c[0] > 1e-6, bones: { head: 1 }, ...extra })
    lock(t(0, 1.708, -0.006), R(0.0855, 0.1, 0.101), [0, 0, 0], { k: 0.02 * S })
    lock(t(0, 1.648, -0.058), R(0.076, 0.078, 0.042))
    lock(t(0.073, 1.66, -0.006), R(0.021, 0.076, 0.06), [0, 0, 4])
    lock(t(0.074, 1.608, 0.004), R(0.018, 0.045, 0.036), [6, 0, -8])
    lock(t(0.064, 1.598, -0.04), R(0.024, 0.045, 0.036), [-8, 0, -8])
    lock(t(0.028, 1.594, -0.07), R(0.036, 0.044, 0.026), [-12, 0, 0])
    lock(t(0.064, 1.722, 0.05), R(0.03, 0.052, 0.03), [22, 0, 22])
    // A side parting: the fringe sweeps to one side only.
    hair.push({ kind: 'ell', c: t(-0.02, 1.756, 0.056), r: R(0.06, 0.03, 0.03), axes: turned([34, 0, -14]), k: 0.012 * S, mirror: false, bones: { head: 1 } })
    hair.push({ kind: 'ell', c: t(0.04, 1.742, 0.066), r: R(0.028, 0.036, 0.02), axes: turned([28, 0, 30]), k: 0.012 * S, mirror: false, bones: { head: 1 } })
    hair.push({ kind: 'ell', c: t(0, 1.65, 0.1), r: R(0.061, 0.088, 0.066), k: 0.016 * S, sub: true, mirror: false, bones: {} })
  }

  // ── Hair of the other builds ────────────────────────────────────────────
  let hairBox: [V3, V3] = [[-0.13 * S, 1.5 * S, -0.16 * S], [0.13 * S, 1.86 * S, 0.16 * S]]
  let hairTriangles = 6000
  if (build !== 'aura') {
    const cap = (c: V3, r: V3) => hair.push({ kind: 'ell', c, r, k: 0.02 * S, mirror: false, bones: { head: 1 } })
    const tuft = (c: V3, r: V3, rot: V3 = [0, 0, 0]) => hair.push({ kind: 'ell', c, r, axes: turned(rot), k: 0.014 * S, mirror: c[0] > 1e-6, bones: { head: 1 } })
    /** A spike: thick at the scalp, a point at the tip. */
    const spike = (a: V3, b: V3, r1: number, r2 = 0.0045, both = a[0] > 1e-6 || b[0] > 1e-6) => hair.push({ kind: 'cone', a, b, r1: r1 * S, r2: r2 * S, k: 0.014 * S, mirror: both, bones: { head: 1 } })
    const face = () => hair.push({ kind: 'ell', c: t(0, 1.65, 0.1), r: R(0.061, 0.088, 0.066), k: 0.016 * S, sub: true, mirror: false, bones: {} })
    if (build === 'power' && !F) {
      // Swept back as if by speed: long flames laid over the crown, tallest down the middle, and one lock across the brow.
      cap(t(0, 1.725, -0.004), R(0.084, 0.086, 0.1))
      spike(t(0, 1.775, 0.055), t(0, 1.9, -0.09), 0.05)
      spike(t(0, 1.785, -0.005), t(0, 1.9, -0.185), 0.05)
      spike(t(0, 1.765, -0.05), t(0, 1.84, -0.245), 0.046)
      spike(t(0, 1.71, -0.07), t(0, 1.74, -0.215), 0.04)
      spike(t(0.045, 1.76, 0.045), t(0.075, 1.87, -0.085), 0.042)
      spike(t(0.058, 1.75, -0.015), t(0.1, 1.845, -0.17), 0.042)
      spike(t(0.066, 1.715, -0.04), t(0.112, 1.765, -0.2), 0.036)
      spike(t(0.074, 1.72, 0.035), t(0.1, 1.765, -0.075), 0.03)
      spike(t(0.012, 1.775, 0.08), t(-0.06, 1.75, 0.122), 0.032, 0.004, false)
      spike(t(0.04, 1.772, 0.072), t(0.066, 1.756, 0.106), 0.024, 0.004, false)
      face()
      hairBox = [[-0.16 * S, 1.5 * S, -0.3 * S], [0.16 * S, 1.96 * S, 0.17 * S]]
      hairTriangles = 7000
    } else if (build === 'power') {
      // Pulled up and back into a tail that arcs behind the head and breaks into spikes; a fringe swept to one side.
      cap(t(0, 1.715, -0.006), R(0.0845, 0.095, 0.1))
      spike(t(0.074, 1.74, 0.04), t(0.088, 1.69, 0.062), 0.024, 0.006)
      spike(t(0.02, 1.776, 0.078), t(-0.052, 1.742, 0.12), 0.03, 0.004, false)
      spike(t(0.046, 1.77, 0.068), t(0.072, 1.74, 0.104), 0.025, 0.004, false)
      spike(t(-0.03, 1.775, 0.07), t(-0.078, 1.752, 0.092), 0.024, 0.004, false)
      // The tail: full where it leaves the tie, arcing down behind the head, ending in points.
      const strand = (a: V3, b: V3, r1: number, r2: number) => hair.push({ kind: 'cone', a, b, r1: r1 * S, r2: r2 * S, k: 0.016 * S, mirror: false, bones: { head: 1 } })
      tuft(t(0, 1.792, -0.076), R(0.038, 0.034, 0.03))
      strand(t(0, 1.79, -0.17), t(0, 1.79, -0.075), 0.06, 0.036)
      strand(t(0, 1.79, -0.17), t(0, 1.7, -0.26), 0.06, 0.048)
      spike(t(0, 1.7, -0.26), t(0, 1.56, -0.31), 0.048)
      spike(t(0, 1.72, -0.25), t(0, 1.66, -0.385), 0.036)
      spike(t(0.02, 1.71, -0.25), t(0.072, 1.6, -0.3), 0.03)
      spike(t(0, 1.82, -0.17), t(0, 1.84, -0.285), 0.03)
      face()
      hairBox = [[-0.14 * S, 1.48 * S, -0.44 * S], [0.14 * S, 1.92 * S, 0.17 * S]]
      hairTriangles = 7000
    } else if (F) {
      // Cropped close, with a small tight knot at the back.
      cap(t(0, 1.712, -0.004), R(0.083, 0.098, 0.099))
      tuft(t(0, 1.722, -0.106), R(0.033, 0.033, 0.028))
      face()
    }
  }

  // ── Clothing ────────────────────────────────────────────────────────────
  const waist = pick(1.032, 1.05) * S
  const hem = mix(hip, knee, build === 'iron' ? pick(0.36, 0.27) : pick(0.47, 0.31))
  const down = unit(thigh)
  const smooth = (a: number, b: number, v: number) => { const u = Math.min(1, Math.max(0, (v - a) / (b - a))); return u * u * (3 - 2 * u) }
  const garments: Garment[] = [{
    name: 'shorts',
    // A waistband: a little proud of the rest.
    thickness: (_x, y) => (0.0045 + 0.0022 * smooth(waist - 0.034 * S, waist - 0.028 * S, y)) * S,
    region: (x, y, z) => Math.max(y - waist, dot(sub([Math.abs(x), y, z], hem), down)),
  }]
  if (F) {
    const band = 1.262 * S
    const side = J.upperArmL[0] - 0.012 * S
    const top = J.upperArmL[1] + 0.06 * S
    // Everything on the trunk between the band and the shoulders, less a scooped neck and two armholes.
    const hole = (x: number, y: number, cx: number, cy: number, a: number, b: number) => (1 - Math.hypot((x - cx) / a, (y - cy) / b)) * Math.min(a, b)
    // Wide and deep enough to take in the folds of skin that run from the chest and the back into the arm: fabric
    // left on those follows the arm and stands off the body as a flap the moment it moves (it did, until 2026-11-24).
    const armhole = (ax: number, y: number) => hole(ax, y, J.upperArmL[0] + 0.012 * S, J.upperArmL[1] - 0.012 * S, 0.082 * S, 0.155 * S)
    garments.push({
      name: 'top',
      // Its armholes run beside the folds of the armpit, where the skin slides: it is worn on the skin.
      fitted: true,
      seams: [(_x, y) => y - (band + 0.024 * S), (_x, y) => y - (band + 0.03 * S)],
      thickness: (_x, y) => (0.0055 + 0.002 * smooth(band + 0.03 * S, band + 0.024 * S, y)) * S,
      region: (x, y, z) => {
        const ax = Math.abs(x)
        const neckline = hole(ax, y, 0, 1.52 * S, 0.062 * S, (z > 0 ? 0.135 : 0.1) * S)
        return Math.max(band - y, y - top, ax - side, neckline, armhole(ax, y))
      },
    })
  }

  // The muscle patches were placed on the Aura master's skin. Where a build carries more mass the skin
  // has moved outward, and each patch moves with it, so it sits as deep in this body as it did in that one.
  if (build !== 'aura') {
    const master = anatomyOf(id, 'aura').body
    const solid = (shapes: Shape[]) => { const f = new Field(shapes.filter((x) => !x.relief)); return (x: number, y: number, z: number) => f.value(x, y, z) }
    const was = solid(master), now = solid(body)
    const mine = body.filter((x) => x.relief), theirs = master.filter((x) => x.relief)
    theirs.forEach((ref, i) => {
      const c = mine[i].c!
      const depth = was(...ref.c!)
      for (let pass = 0; pass < 3; pass++) {
        const off = depth - now(...c)
        const n = unit(gradient(now, c[0], c[1], c[2], 0.002))
        for (let k = 0; k < 3; k++) c[k] += n[k] * off
      }
    })
  }

  // Pieces in the colour of the athlete's theme.
  const wristX = J.handL[0], wristY = J.handL[1], wristZ = J.handL[2]
  const armBox = (to: number): [V3, V3] => [[0, wristY - 0.09 * S, wristZ - 0.09 * S], [to + 0.02 * S, wristY + 0.09 * S, wristZ + 0.09 * S]]
  if (build === 'power') {
    const a = wristX - 0.092 * S, b = wristX - 0.027 * S
    garments.push({
      name: 'wristbands', material: 'accent', box: armBox(b), triangles: 1400,
      thickness: () => 0.0052 * S,
      region: (x) => Math.max(a - Math.abs(x), Math.abs(x) - b),
    })
    // Above the hip crease, so that it stays a band when the hips fold.
    const lo = waist - 0.004 * S, hi = waist + 0.056 * S
    garments.push({
      name: 'sash', material: 'accent', triangles: 2400,
      thickness: () => 0.009 * S,
      region: (_x, y) => Math.max(lo - y, y - hi),
    })
  }
  if (build === 'iron') {
    const a = wristX - 0.14 * S, b = wristX + 0.03 * H
    garments.push({
      name: 'wraps', material: 'accent', box: armBox(b), triangles: 3000,
      // Wound round the arm: each turn stands a little proud of the last.
      thickness: (x, _y, z) => (0.0042 + 0.0011 * Math.sin((Math.abs(x) + 0.45 * z) * (Math.PI * 2 / (0.019 * S)))) * S,
      region: (x) => Math.max(a - Math.abs(x), Math.abs(x) - b),
    })
  }

  return {
    id, build, sk, body, hair, garments, hairBox, hairTriangles,
    cuts: { wrist: J.handL[0] - 0.024 * H, neck: 1.548 * S, ankle: ankle[1] + 0.046 * S, rise: build === 'aura' ? 0 : 3 / S },
    logo: { x: hip[0] + 0.018 * S, y: hem[1] + pick(0.078, 0.05) * S, width: pick(0.104, 0.082) * S, height: pick(0.104, 0.082) * S * 0.34 },
  }
}
