/**
 * Writes a character as a binary glTF 2.0 file: skeleton, skinned meshes and
 * the per-vertex muscle data, readable by any 3D package.
 */
import { BONES, PARENT, type Skeleton } from '../../src/visual/body/skeleton'

export interface Part {
  name: string
  /** A material slot by name; the renderer supplies the actual look. */
  material: 'skin' | 'cloth' | 'hair' | 'accent'
  pos: Float32Array
  nrm: Float32Array
  idx: Uint32Array
  joints: Uint8Array
  weights: Uint8Array
  /** (slot, share, slot, share) per vertex. */
  muscle?: Uint8Array
}

const FLOAT = 5126, UBYTE = 5121, UINT = 5125, USHORT = 5123
const ARRAY_BUFFER = 34962, ELEMENT_ARRAY_BUFFER = 34963

export function writeGlb(sk: Skeleton, parts: Part[], extras: Record<string, unknown>): Uint8Array {
  const chunks: Uint8Array[] = []
  let length = 0
  const views: object[] = []
  const accessors: object[] = []

  const view = (data: ArrayBufferView, target?: number) => {
    const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
    views.push({ buffer: 0, byteOffset: length, byteLength: bytes.byteLength, ...(target ? { target } : {}) })
    chunks.push(bytes)
    length += bytes.byteLength
    const pad = (4 - (length % 4)) % 4
    if (pad) { chunks.push(new Uint8Array(pad)); length += pad }
    return views.length - 1
  }
  const accessor = (a: object) => accessors.push(a) - 1

  const nodes: object[] = []
  const boneNode = BONES.map((_, i) => i + 1)
  nodes.push({ name: 'Aura', children: [] as number[] })
  BONES.forEach((b, i) => {
    const p = PARENT[b]
    const at = sk.joints[b]
    const from = p ? sk.joints[p] : [0, 0, 0]
    nodes.push({
      name: b,
      translation: [at[0] - from[0], at[1] - from[1], at[2] - from[2]],
      children: BONES.map((c, j) => (PARENT[c] === b ? boneNode[j] : -1)).filter((j) => j >= 0),
    })
    if (!p) (nodes[0] as { children: number[] }).children.push(boneNode[i])
  })

  const ibm = new Float32Array(BONES.length * 16)
  BONES.forEach((b, i) => {
    const at = sk.joints[b]
    ibm.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -at[0], -at[1], -at[2], 1], i * 16)
  })
  const ibmAccessor = accessor({ bufferView: view(ibm), componentType: FLOAT, count: BONES.length, type: 'MAT4' })

  const materialNames = [...new Set(parts.map((p) => p.material))]
  const meshes = parts.map((p) => {
    const count = p.pos.length / 3
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < p.pos.length; i++) { lo[i % 3] = Math.min(lo[i % 3], p.pos[i]); hi[i % 3] = Math.max(hi[i % 3], p.pos[i]) }
    const small = count < 65536
    const attributes: Record<string, number> = {
      POSITION: accessor({ bufferView: view(p.pos, ARRAY_BUFFER), componentType: FLOAT, count, type: 'VEC3', min: lo, max: hi }),
      NORMAL: accessor({ bufferView: view(p.nrm, ARRAY_BUFFER), componentType: FLOAT, count, type: 'VEC3' }),
      JOINTS_0: accessor({ bufferView: view(p.joints, ARRAY_BUFFER), componentType: UBYTE, count, type: 'VEC4' }),
      WEIGHTS_0: accessor({ bufferView: view(p.weights, ARRAY_BUFFER), componentType: UBYTE, normalized: true, count, type: 'VEC4' }),
    }
    if (p.muscle) attributes._MUSCLE = accessor({ bufferView: view(p.muscle, ARRAY_BUFFER), componentType: UBYTE, count, type: 'VEC4' })
    const indices = accessor({
      bufferView: view(small ? new Uint16Array(p.idx) : p.idx, ELEMENT_ARRAY_BUFFER),
      componentType: small ? USHORT : UINT, count: p.idx.length, type: 'SCALAR',
    })
    return { name: p.name, primitives: [{ attributes, indices, material: materialNames.indexOf(p.material) }] }
  })
  parts.forEach((p, i) => {
    nodes.push({ name: p.name, mesh: i, skin: 0 })
    ;(nodes[0] as { children: number[] }).children.push(nodes.length - 1)
  })

  const json = {
    asset: { version: '2.0', generator: 'Aura character generator' },
    scene: 0,
    scenes: [{ nodes: [0], extras }],
    nodes,
    meshes,
    materials: materialNames.map((name) => ({ name, pbrMetallicRoughness: { baseColorFactor: name === 'cloth' ? [0.03, 0.03, 0.04, 1] : name === 'accent' ? [0.75, 0.2, 0.15, 1] : [0.8, 0.8, 0.82, 1], metallicFactor: 0.1, roughnessFactor: 0.5 } })),
    skins: [{ joints: boneNode, inverseBindMatrices: ibmAccessor, skeleton: boneNode[0] }],
    accessors,
    bufferViews: views,
    buffers: [{ byteLength: length }],
  }

  let text = JSON.stringify(json)
  while (text.length % 4) text += ' '
  const jsonBytes = new TextEncoder().encode(text)
  const total = 12 + 8 + jsonBytes.length + 8 + length
  const out = new Uint8Array(total)
  const dv = new DataView(out.buffer)
  dv.setUint32(0, 0x46546c67, true); dv.setUint32(4, 2, true); dv.setUint32(8, total, true)
  dv.setUint32(12, jsonBytes.length, true); dv.setUint32(16, 0x4e4f534a, true)
  out.set(jsonBytes, 20)
  let o = 20 + jsonBytes.length
  dv.setUint32(o, length, true); dv.setUint32(o + 4, 0x004e4942, true)
  o += 8
  for (const c of chunks) { out.set(c, o); o += c.byteLength }
  return out
}
