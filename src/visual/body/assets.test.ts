import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CHANNELS } from './muscles'
import { BONES, BUILDS, skeletonOf, type BuildId, type CharacterId } from './skeleton'

/** The JSON part of a .glb file. */
function read(build: BuildId, id: CharacterId) {
  const file = readFileSync(resolve(__dirname, `../../../public/characters/${build}-${id}.glb`))
  expect(file.readUInt32LE(0)).toBe(0x46546c67)
  const length = file.readUInt32LE(12)
  return { json: JSON.parse(file.subarray(20, 20 + length).toString('utf8')), bytes: file.length }
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
  const { json, bytes } = read(build, id)

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
