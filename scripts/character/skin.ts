/**
 * What each vertex follows and which muscle it is part of.
 *
 * Both come from the shapes the body was built from: a vertex may follow the
 * bones of the shapes it sits on, shared out by how far along each bone it
 * lies; and it belongs to a muscle to the degree that muscle's own shape is
 * what forms the skin there.
 */
import { BONES, PARENT, type BoneName, type Skeleton, type V3 } from '../../src/visual/body/skeleton'
import { CHANNELS } from '../../src/visual/body/muscles'
import type { Field } from './sdf'
import { neighbours, type Mesh } from './mesh'

const swap = (name: string) => (name.endsWith('L') ? `${name.slice(0, -1)}R` : name.endsWith('R') ? `${name.slice(0, -1)}L` : name)
const boneIndex = Object.fromEntries(BONES.map((b, i) => [b, i])) as Record<string, number>

interface Span { head: V3; dir: V3; length: number; bandHead: number; bandTail: number }

/** Each bone as a stretch of its limb, with how far its hold reaches past either end. */
function spans(sk: Skeleton): Span[] {
  const s = sk.scale
  const j = sk.joints
  const tip = (b: BoneName): V3 => {
    const side = b.endsWith('R') ? -1 : 1
    const flip = (p: V3): V3 => [p[0] * side, p[1], p[2]]
    const base = b.replace(/[LR]$/, '')
    const R = (n: string) => j[`${n}${b.slice(-1)}` as BoneName]
    switch (base) {
      case 'hips': return j.spine
      case 'spine': return j.chest
      case 'chest': return j.upperChest
      case 'upperChest': return j.neck
      case 'neck': return j.head
      case 'head': return sk.tips.headTop
      case 'shoulder': return R('upperArm')
      case 'upperArm': return R('lowerArm')
      case 'lowerArm': case 'foreTwist': return R('hand')
      case 'hand': return R('fingers1')
      case 'fingers1': return R('fingers2')
      case 'fingers2': return R('fingers3')
      case 'fingers3': return flip(sk.tips.fingertipL)
      case 'thumb1': return R('thumb2')
      case 'thumb2': return flip(sk.tips.thumbTipL)
      case 'upperLeg': return R('lowerLeg')
      case 'lowerLeg': return R('foot')
      case 'foot': return R('toes')
      default: return flip(sk.tips.toeTipL)
    }
  }
  const band: Record<string, [number, number]> = {
    hips: [0.09, 0.05], spine: [0.05, 0.05], chest: [0.05, 0.05], upperChest: [0.05, 0.035], neck: [0.03, 0.03], head: [0.03, 0.05],
    shoulder: [0.06, 0.05], upperArm: [0.055, 0.032], lowerArm: [0.032, 0.02], foreTwist: [0.03, 0.02], hand: [0.02, 0.012],
    fingers1: [0.012, 0.007], fingers2: [0.007, 0.006], fingers3: [0.006, 0.01], thumb1: [0.014, 0.008], thumb2: [0.008, 0.01],
    upperLeg: [0.07, 0.04], lowerLeg: [0.04, 0.028], foot: [0.03, 0.016], toes: [0.016, 0.02],
  }
  return BONES.map((b) => {
    let head = j[b]
    const tail = tip(b)
    // The pelvis hangs below the joint it is named after.
    if (b === 'hips') head = [0, j.upperLegL[1] - 0.04 * s, head[2]]
    const d: V3 = [tail[0] - head[0], tail[1] - head[1], tail[2] - head[2]]
    const length = Math.hypot(d[0], d[1], d[2])
    const [bh, bt] = band[b.replace(/[LR]$/, '')]
    return { head, dir: [d[0] / length, d[1] / length, d[2] / length], length, bandHead: bh * s, bandTail: bt * s }
  })
}

export interface Skin { joints: Uint8Array; weights: Uint8Array }

/**
 * `lift` is for clothing: its vertices sit that far above the skin along
 * `nrm`, and are weighted as the skin directly under them, so the two move
 * as one. `reaches`: how far from a shape its skin may lie, in body heights; a second value is tried where the first finds nothing.
 */
export function skin(mesh: Mesh, field: Field, sk: Skeleton, only?: BoneName, nrm?: Float32Array, lift: number | ((x: number, y: number, z: number) => number) = 0, reaches: number[] = [0.02]): Skin {
  if (nrm) {
    const pos = new Float32Array(mesh.pos)
    for (let v = 0; v < pos.length / 3; v++) {
      const d = typeof lift === 'number' ? lift : lift(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2])
      for (let c = 0; c < 3; c++) pos[v * 3 + c] -= nrm[v * 3 + c] * d
    }
    mesh = { pos, idx: mesh.idx }
  }
  const n = mesh.pos.length / 3
  const B = BONES.length
  const sp = spans(sk)
  const w = new Float32Array(n * B)
  const twistL = boneIndex.foreTwistL, twistR = boneIndex.foreTwistR
  const lowerL = boneIndex.lowerArmL, lowerR = boneIndex.lowerArmR

  for (let v = 0; v < n; v++) {
    const x = mesh.pos[v * 3], y = mesh.pos[v * 3 + 1], z = mesh.pos[v * 3 + 2]
    const row = w.subarray(v * B, v * B + B)
    if (only) { row[boneIndex[only]] = 1; continue }
    // Which bones this patch of skin may follow at all: those of the shapes it lies on. Where shapes are blended
    // widely the skin can stand clear of every one of them (the middle of her chest); a body like that is given a
    // second, longer reach to try (`reaches`), and only failing that is the skin left to the hips, below.
    for (const reach of reaches) {
      for (const code of field.near(x, y, z)) {
        const shape = field.shapes[code >> 1]
        if (shape.sub || shape.relief) continue
        const right = (code & 1) === 1
        const d = field.one(code >> 1, right ? -x : x, y, z)
        const close = 1 - Math.max(0, d) / (reach * sk.scale)
        if (close <= 0) continue
        for (const [name, strength] of Object.entries(shape.bones)) {
          const i = boneIndex[right ? swap(name) : name]
          row[i] = Math.max(row[i], close * strength)
        }
      }
      if (row.some((w) => w > 0)) break
    }
    // Shared out by position along each of those bones.
    let sum = 0
    for (let i = 0; i < B; i++) {
      if (row[i] === 0) continue
      const s = sp[i]
      const t = (x - s.head[0]) * s.dir[0] + (y - s.head[1]) * s.dir[1] + (z - s.head[2]) * s.dir[2]
      const out = t < 0 ? -t / s.bandHead : t > s.length ? (t - s.length) / s.bandTail : 0
      row[i] *= Math.exp(-out * out)
      sum += row[i]
    }
    if (sum < 1e-6) { row.fill(0); row[boneIndex.hips] = 1; sum = 1 }
    for (let i = 0; i < B; i++) row[i] /= sum
  }

  // Even out over the surface, so no seam shows where two shapes meet.
  if (!only) {
    const nb = neighbours(mesh)
    const next = new Float32Array(w.length)
    for (let pass = 0; pass < 3; pass++) {
      for (let v = 0; v < n; v++) {
        const list = nb[v]
        for (let i = 0; i < B; i++) {
          let s = 0
          for (const u of list) s += w[u * B + i]
          next[v * B + i] = list.length ? 0.5 * w[v * B + i] + (0.5 * s) / list.length : w[v * B + i]
        }
      }
      w.set(next)
    }
    // A turning hand takes the forearm with it gradually, not all at the wrist.
    for (let v = 0; v < n; v++) {
      for (const [lower, twist] of [[lowerL, twistL], [lowerR, twistR]]) {
        const share = w[v * B + lower] + w[v * B + twist]
        if (share === 0) continue
        const s = sp[lower]
        const t = ((mesh.pos[v * 3] - s.head[0]) * s.dir[0] + (mesh.pos[v * 3 + 1] - s.head[1]) * s.dir[1] + (mesh.pos[v * 3 + 2] - s.head[2]) * s.dir[2]) / s.length
        const u = Math.min(1, Math.max(0, (t - 0.12) / 0.8))
        const turn = u * u * (3 - 2 * u)
        w[v * B + twist] = share * turn
        w[v * B + lower] = share * (1 - turn)
      }
    }
  }

  const joints = new Uint8Array(n * 4)
  const weights = new Uint8Array(n * 4)
  for (let v = 0; v < n; v++) {
    const row = w.subarray(v * B, v * B + B)
    const top = [...row.keys()].sort((a, b) => row[b] - row[a]).slice(0, 4)
    const total = top.reduce((s, i) => s + row[i], 0) || 1
    const q = top.map((i) => Math.round((row[i] / total) * 255))
    q[0] += 255 - q.reduce((s, x) => s + x, 0)
    for (let c = 0; c < 4; c++) {
      joints[v * 4 + c] = q[c] > 0 ? top[c] : 0
      weights[v * 4 + c] = q[c]
    }
  }
  return { joints, weights }
}

/**
 * Per vertex: the two muscles it is most part of, as (slot, share, slot, share).
 * `lift` is how far above the skin the vertex sits (for clothing, which shows
 * the muscle under it).
 */
export function muscles(mesh: Mesh, nrm: Float32Array, field: Field, lift = 0): Uint8Array {
  const n = mesh.pos.length / 3
  const out = new Uint8Array(n * 4)
  const best = new Float32Array(CHANNELS.length * 2)
  for (let v = 0; v < n; v++) {
    const x = mesh.pos[v * 3] - nrm[v * 3] * lift, y = mesh.pos[v * 3 + 1] - nrm[v * 3 + 1] * lift, z = mesh.pos[v * 3 + 2] - nrm[v * 3 + 2] * lift
    best.fill(0)
    for (const code of field.near(x, y, z)) {
      const shape = field.shapes[code >> 1]
      if (!shape.muscle || !shape.relief) continue
      const right = (code & 1) === 1
      const share = field.under(code >> 1, right ? -x : x, y, z)
      // A shape on the centre line belongs to the side the vertex is on.
      const side = shape.mirror ? right : x < 0
      const slot = CHANNELS.indexOf(shape.muscle as (typeof CHANNELS)[number]) * 2 + (side ? 1 : 0)
      if (share > best[slot]) best[slot] = share
    }
    let a = -1, b = -1
    for (let s = 0; s < best.length; s++) {
      if (best[s] <= 0.004) continue
      if (a < 0 || best[s] > best[a]) { b = a; a = s } else if (b < 0 || best[s] > best[b]) b = s
    }
    if (a >= 0) { out[v * 4] = a; out[v * 4 + 1] = Math.round(best[a] * 255) }
    if (b >= 0) { out[v * 4 + 2] = b; out[v * 4 + 3] = Math.round(best[b] * 255) }
  }
  return out
}

export const parentIndex = BONES.map((b) => (PARENT[b] ? boneIndex[PARENT[b]!] : -1))
