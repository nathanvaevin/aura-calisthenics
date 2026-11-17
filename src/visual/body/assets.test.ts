import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CHANNELS } from './muscles'
import { BONES, skeletonOf, type CharacterId } from './skeleton'

/** The JSON part of a .glb file. */
function read(id: CharacterId) {
  const file = readFileSync(resolve(__dirname, `../../../public/characters/aura-${id}.glb`))
  expect(file.readUInt32LE(0)).toBe(0x46546c67)
  const length = file.readUInt32LE(12)
  return { json: JSON.parse(file.subarray(20, 20 + length).toString('utf8')), bytes: file.length }
}

// The character files are built from the code (`npm run character:build`). These fail when the two have drifted apart.
describe.each(['male', 'female'] as const)('the %s character file', (id) => {
  const { json, bytes } = read(id)

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
    expect(names).toEqual(id === 'female' ? ['body', 'shorts', 'top', 'hair'] : ['body', 'shorts'])
    for (const mesh of json.meshes) {
      const a = mesh.primitives[0].attributes
      expect(a.JOINTS_0).toBeDefined()
      expect(a.WEIGHTS_0).toBeDefined()
      if (mesh.name !== 'hair') expect(a._MUSCLE, mesh.name).toBeDefined()
    }
    expect(json.materials.map((m: { name: string }) => m.name).sort()).toEqual(id === 'female' ? ['cloth', 'hair', 'skin'] : ['cloth', 'skin'])
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
