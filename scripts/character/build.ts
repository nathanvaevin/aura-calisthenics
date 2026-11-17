/**
 * Builds the characters into public/characters/<build>-<male|female>.glb.
 *
 *   npm run character:build                 every build, both sexes, full quality
 *   npm run character:build -- male         one sex
 *   npm run character:build -- iron         one build (aura, power, iron)
 *   npm run character:build -- iron male    one character
 *   npm run character:build -- --draft      coarser and quicker, for sculpting
 *
 * The body is meshed in parts so that detail goes where it is needed: hands,
 * feet and head on a finer grid than the trunk. Parts are cut along flat
 * planes and meet exactly there.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { BONES, BUILDS, type BoneName, type BuildId, type CharacterId, type V3 } from '../../src/visual/body/skeleton'
import { CHANNELS } from '../../src/visual/body/muscles'
import { anatomyOf } from './anatomy'
import { writeGlb, type Part } from './glb'
import { extract, mirrored, normals, settle, simplify, type Mesh } from './mesh'
import { Field, type Fn } from './sdf'
import { muscles, skin } from './skin'

const args = process.argv.slice(2)
const draft = args.includes('--draft')
const who = (['male', 'female'] as CharacterId[]).filter((id) => !args.some((a) => a === 'male' || a === 'female') || args.includes(id))
const builds = BUILDS.filter((b) => !args.some((a) => (BUILDS as readonly string[]).includes(a)) || args.includes(b))
const q = draft ? 1.7 : 1

interface Piece { pos: Float32Array; nrm: Float32Array; idx: Uint32Array; joints: Uint8Array; weights: Uint8Array; muscle: Uint8Array }

const swapSide = (i: number) => {
  const b = BONES[i]
  const other = b.endsWith('L') ? `${b.slice(0, -1)}R` : b.endsWith('R') ? `${b.slice(0, -1)}L` : b
  return BONES.indexOf(other as BoneName)
}

function otherSide(p: Piece): Piece {
  const m = mirrored(p)
  const joints = new Uint8Array(p.joints.length)
  for (let i = 0; i < joints.length; i++) joints[i] = p.weights[i] > 0 ? swapSide(p.joints[i]) : 0
  const muscle = new Uint8Array(p.muscle)
  for (let i = 0; i < muscle.length; i += 2) if (muscle[i + 1] > 0) muscle[i] ^= 1
  return { ...m, nrm: m.nrm!, joints, muscle }
}

function join(pieces: Piece[]): Piece {
  const count = (key: keyof Piece) => pieces.reduce((s, p) => s + p[key].length, 0)
  const out: Piece = {
    pos: new Float32Array(count('pos')), nrm: new Float32Array(count('nrm')), idx: new Uint32Array(count('idx')),
    joints: new Uint8Array(count('joints')), weights: new Uint8Array(count('weights')), muscle: new Uint8Array(count('muscle')),
  }
  let v = 0, i = 0
  for (const p of pieces) {
    out.pos.set(p.pos, v * 3); out.nrm.set(p.nrm, v * 3)
    out.joints.set(p.joints, v * 4); out.weights.set(p.weights, v * 4); out.muscle.set(p.muscle, v * 4)
    for (let k = 0; k < p.idx.length; k++) out.idx[i + k] = p.idx[k] + v
    v += p.pos.length / 3
    i += p.idx.length
  }
  return out
}

async function build(id: CharacterId, kind: BuildId) {
  const t0 = Date.now()
  const an = anatomyOf(id, kind)
  const sk = an.sk
  const S = sk.scale
  const J = sk.joints
  const field = new Field(an.body)
  const bodyFn: Fn = (x, y, z) => field.value(x, y, z)
  const { wrist, neck, ankle, rise } = an.cuts
  /** Height of the neck cut at this distance from the centre line. */
  const neckAt = (x: number) => neck + rise * x * x

  /** One part of the skin: meshed inside `box` where `cut` is negative. */
  async function piece(name: string, cut: Fn, lo: V3, hi: V3, h: number, triangles: number, symmetric: boolean, hidden?: Fn): Promise<Piece> {
    const clipped: Fn = (x, y, z) => Math.max(bodyFn(x, y, z), cut(x, y, z))
    let mesh: Mesh = extract(clipped, lo, hi, h * q, symmetric)
    settle(mesh, bodyFn, cut, h * q)
    const before = mesh.idx.length / 3
    if (hidden) {
      // Skin well under clothing is never seen: leave it out.
      const keep: number[] = []
      for (let i = 0; i < mesh.idx.length; i += 3) {
        let under = true
        for (let c = 0; c < 3 && under; c++) { const v = mesh.idx[i + c]; under = hidden(mesh.pos[v * 3], mesh.pos[v * 3 + 1], mesh.pos[v * 3 + 2]) < -0.007 * S }
        if (!under) keep.push(mesh.idx[i], mesh.idx[i + 1], mesh.idx[i + 2])
      }
      mesh = { pos: mesh.pos, idx: new Uint32Array(keep) }
    }
    ;({ mesh } = await simplify(mesh, Math.round(triangles / q), 0.0022 * S))
    const kinds = settle(mesh, bodyFn, cut, h * q)
    const nrm = normals(mesh, bodyFn, cut, kinds)
    const { joints, weights } = skin(mesh, field, sk)
    const muscle = muscles(mesh, nrm, field)
    // Cut faces are inside the body: they carry no muscle.
    kinds.forEach((k, v) => { if (k === 1) muscle.fill(0, v * 4, v * 4 + 4) })
    console.log(`  ${name.padEnd(8)} ${String(before).padStart(7)} → ${String(mesh.idx.length / 3).padStart(6)} triangles`)
    return { ...mesh, nrm, joints, weights, muscle }
  }

  const covered: Fn = (x, y, z) => Math.min(...an.garments.map((g) => g.region(x, y, z)))
  const reach = sk.tips.fingertipL[0]
  const trunk = await piece('trunk', (x, y) => Math.max(Math.abs(x) - wrist, y - neckAt(x), ankle - y), [0, ankle - 0.01, -0.2 * S], [wrist + 0.01, neck + 0.01 + (rise ? 0.12 * S : 0), 0.19 * S], 0.004, 36000, true, covered)
  const head = await piece('head', (x, y) => neckAt(x) - y, [0, neck - 0.01, -0.14 * S], [0.12 * S, sk.height + 0.02, 0.15 * S], 0.003, 5000, true)
  const hand = await piece('hand', (x) => wrist - x, [wrist - 0.008, J.handL[1] - 0.05 * S, J.handL[2] - 0.075 * S], [reach + 0.015, J.handL[1] + 0.035 * S, J.handL[2] + 0.1 * S], 0.0016, 5200, false)
  const foot = await piece('foot', (_x, y) => y - ankle, [J.footL[0] - 0.075 * S, -0.004, -0.09 * S], [J.footL[0] + 0.085 * S, ankle + 0.008, 0.21 * S], 0.0025, 3000, false)
  const body = join([trunk, head, hand, otherSide(hand), foot, otherSide(foot)])

  const parts: Part[] = [{ name: 'body', material: 'skin', ...body }]

  for (const g of an.garments) {
    const surface: Fn = (x, y, z) => bodyFn(x, y, z) - g.thickness(x, y, z)
    const solid: Fn = (x, y, z) => Math.max(surface(x, y, z), g.region(x, y, z))
    const h = 0.0035 * q
    const [lo, hi] = g.box ?? [[0, 0.5 * S, -0.22 * S], [0.3 * S, 1.6 * S, 0.2 * S]]
    let mesh = extract(solid, lo, hi, h, true)
    settle(mesh, surface, g.region, h)
    ;({ mesh } = await simplify(mesh, Math.round((g.triangles ?? 10000) / q), 0.0018 * S))
    const kinds = settle(mesh, surface, g.region, h)
    const nrm = normals(mesh, surface, g.region, kinds)
    const muscle = muscles(mesh, nrm, field, 0.005 * S)
    kinds.forEach((k, v) => { if (k === 1) muscle.fill(0, v * 4, v * 4 + 4) })
    parts.push({ name: g.name, material: g.material ?? 'cloth', ...mesh, nrm, ...skin(mesh, field, sk, undefined, nrm, g.thickness), muscle })
    console.log(`  ${g.name.padEnd(8)} ${String(mesh.idx.length / 3).padStart(16)} triangles`)
  }

  if (an.hair.length) {
    const hairField = new Field(an.hair)
    const fn: Fn = (x, y, z) => hairField.value(x, y, z)
    const h = 0.003 * q
    let mesh = extract(fn, an.hairBox[0], an.hairBox[1], h)
    settle(mesh, fn, null, h)
    ;({ mesh } = await simplify(mesh, Math.round(an.hairTriangles / q), 0.0015 * S))
    const kinds = settle(mesh, fn, null, h)
    parts.push({ name: 'hair', material: 'hair', ...mesh, nrm: normals(mesh, fn, null, kinds), ...skin(mesh, hairField, sk, 'head') })
    console.log(`  ${'hair'.padEnd(8)} ${String(mesh.idx.length / 3).padStart(16)} triangles`)
  }

  // The Aura masters were written before builds existed: their files stay as they were, byte for byte.
  const glb = writeGlb(sk, parts, { character: id, ...(kind === 'aura' ? {} : { build: kind }), height: sk.height, scale: S, logo: an.logo, channels: CHANNELS, generator: 2 })
  const dir = resolve(import.meta.dirname, '../../public/characters')
  mkdirSync(dir, { recursive: true })
  const file = resolve(dir, `${kind}-${id}${draft ? '.draft' : ''}.glb`)
  writeFileSync(file, glb)
  const tris = parts.reduce((s, p) => s + p.idx.length / 3, 0)
  console.log(`${kind} ${id}: ${tris} triangles, ${(glb.length / 1e6).toFixed(2)} MB, ${((Date.now() - t0) / 1000).toFixed(1)} s → ${file}`)
}

for (const kind of builds) for (const id of who) await build(id, kind)
