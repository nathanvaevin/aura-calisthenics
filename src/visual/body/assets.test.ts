import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CHANNELS } from './muscles'
import { BONES, BUILDS, skeletonOf, type BuildId, type CharacterId } from './skeleton'

/** The JSON part of a .glb file, and a way to read its numbers. */
function read(build: BuildId, id: CharacterId) {
  const file = readFileSync(resolve(__dirname, `../../../public/characters/${build}-${id}.glb`))
  expect(file.readUInt32LE(0)).toBe(0x46546c67)
  const length = file.readUInt32LE(12)
  const json = JSON.parse(file.subarray(20, 20 + length).toString('utf8'))
  const bin = file.subarray(20 + length + 8)
  const numbers = (accessor: number) => {
    const a = json.accessors[accessor], view = json.bufferViews[a.bufferView]
    const size = ({ SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 } as Record<string, number>)[a.type]
    const at = bin.byteOffset + (view.byteOffset ?? 0) + (a.byteOffset ?? 0)
    const Kind = a.componentType === 5126 ? Float32Array : a.componentType === 5125 ? Uint32Array : a.componentType === 5123 ? Uint16Array : Uint8Array
    return new Kind(bin.buffer.slice(at, at + a.count * size * Kind.BYTES_PER_ELEMENT))
  }
  return { json, bytes: file.length, numbers }
}

// The character files are built from the code (`npm run character:build`). These fail when the two have drifted apart.
const CAST = BUILDS.flatMap((build) => (['male', 'female'] as const).map((id) => [build, id] as const))

/** What each character wears, in the order the file holds it. Hair comes last. */
const KIT: Record<BuildId, Record<CharacterId, string[]>> = {
  aura: { male: ['body', 'shorts'], female: ['body', 'shorts', 'top', 'hair'] },
  power: { male: ['body', 'shorts', 'wristbands', 'sash', 'hair'], female: ['body', 'shorts', 'top', 'wristbands', 'sash', 'hair'] },
  iron: { male: ['body', 'shorts', 'wraps'], female: ['body', 'shorts', 'top', 'wraps', 'hair'] },
}
const MATERIAL: Record<string, string> = { body: 'skin', shorts: 'cloth', top: 'cloth', hair: 'hair', wristbands: 'accent', sash: 'accent', wraps: 'accent' }

describe.each(CAST)('the %s %s character file', (build, id) => {
  const { json, bytes, numbers } = read(build, id)

  it('carries the Aura skeleton, bone for bone, at the same joints', () => {
    const joints: number[] = json.skins[0].joints
    expect(joints.map((n) => json.nodes[n].name)).toEqual(BONES)
    const sk = skeletonOf(id)
    const hips = json.nodes[joints[0]].translation as number[]
    hips.forEach((v, i) => expect(v).toBeCloseTo(sk.joints.hips[i], 5))
    expect(json.scenes[0].extras.height).toBeCloseTo(sk.height, 5)
  })

  it('has a skinned body with muscle data, and clothes of its own', () => {
    const names = json.meshes.map((m: { name: string }) => m.name)
    expect(names).toEqual(KIT[build][id])
    for (const mesh of json.meshes) {
      const a = mesh.primitives[0].attributes
      expect(a.JOINTS_0).toBeDefined()
      expect(a.WEIGHTS_0).toBeDefined()
      if (mesh.name !== 'hair') expect(a._MUSCLE, mesh.name).toBeDefined()
    }
    for (const mesh of json.meshes) expect(json.materials[mesh.primitives[0].material].name, mesh.name).toBe(MATERIAL[mesh.name])
    expect(json.materials.map((m: { name: string }) => m.name).sort()).toEqual([...new Set(KIT[build][id].map((n) => MATERIAL[n]))].sort())
    // The Aura masters carry no build name: their files predate builds and are kept byte for byte.
    expect(json.scenes[0].extras.build).toBe(build === 'aura' ? undefined : build)
  })

  // Her top's armholes run beside the folds of the armpit, where skin slides. It is cut from the skin's own surface
  // (`scripts/character/wear.ts`), so the two cannot pass through each other: the skin stops where the cloth begins,
  // along one line of points that both have, held by the same bones in the same amounts.
  it.runIf(id === 'female')('wears her top on the skin: its edge is the skin\'s edge, held by the same bones', () => {
    const part = (name: string) => {
      const p = json.meshes.find((m: { name: string }) => m.name === name).primitives[0]
      return { pos: numbers(p.attributes.POSITION), joints: numbers(p.attributes.JOINTS_0), weights: numbers(p.attributes.WEIGHTS_0), idx: numbers(p.indices) }
    }
    const top = part('top'), body = part('body')
    /** The points on a surface's open edge: the ends of every edge that only one triangle uses. */
    const edge = (m: { idx: ArrayLike<number> }) => {
      const used = new Map<string, number>()
      for (let i = 0; i < m.idx.length; i += 3) for (let c = 0; c < 3; c++) {
        const a = m.idx[i + c], b = m.idx[i + (c + 1) % 3]
        const key = a < b ? `${a},${b}` : `${b},${a}`
        used.set(key, (used.get(key) ?? 0) + 1)
      }
      const out = new Set<number>()
      for (const [key, n] of used) if (n === 1) key.split(',').forEach((v) => out.add(Number(v)))
      return out
    }
    const key = (m: { pos: ArrayLike<number> }, v: number) => [0, 1, 2].map((c) => Math.round(m.pos[v * 3 + c] * 1e5)).join(',')
    const held = (m: { joints: ArrayLike<number>; weights: ArrayLike<number> }, v: number) =>
      [0, 1, 2, 3].filter((c) => m.weights[v * 4 + c] > 0).map((c) => `${m.joints[v * 4 + c]}:${m.weights[v * 4 + c]}`).sort().join(' ')
    const skin = new Map<string, number>()
    for (const v of edge(body)) skin.set(key(body, v), v)
    const hem = [...edge(top)]
    expect(hem.length).toBeGreaterThan(200)
    for (const v of hem) {
      const under = skin.get(key(top, v))
      expect(under, `a point on the top's edge with no skin at it: ${key(top, v)}`).toBeDefined()
      expect(held(top, v)).toBe(held(body, under!))
    }
  })

  it('numbers its muscles the way the app reads them', () => {
    expect(json.scenes[0].extras.channels).toEqual([...CHANNELS])
    expect(json.scenes[0].extras.logo.width).toBeGreaterThan(0.05)
  })

  it('is a size a phone can fetch', () => {
    const triangles = json.meshes.reduce((n: number, m: { primitives: { indices: number }[] }) => n + json.accessors[m.primitives[0].indices].count / 3, 0)
    expect(triangles).toBeLessThan(100_000)
    expect(bytes).toBeLessThan(3_000_000)
  })
})
