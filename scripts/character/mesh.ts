/**
 * From a field to a mesh: surface extraction, a pass that pulls every vertex
 * exactly onto the surface, and simplification.
 */
import { MeshoptSimplifier } from 'meshoptimizer/simplifier'
import type { V3 } from '../../src/visual/body/skeleton'
import { gradient, type Fn } from './sdf'

export interface Mesh { pos: Float32Array; idx: Uint32Array }

/**
 * Surface nets: one vertex in every grid cell the surface passes through,
 * joined across every grid edge that changes sign. Gives even, well-shaped
 * triangles without lookup tables.
 *
 * `symmetric` evaluates the field for x >= 0 only and mirrors it.
 */
export function extract(f: Fn, lo: V3, hi: V3, h: number, symmetric = false): Mesh {
  const half = symmetric ? Math.ceil(hi[0] / h) + 2 : 0
  const ox = symmetric ? -half * h : lo[0] - h
  const nx = symmetric ? 2 * half + 1 : Math.ceil((hi[0] - lo[0]) / h) + 3
  const oy = lo[1] - h, oz = lo[2] - h
  const ny = Math.ceil((hi[1] - lo[1]) / h) + 3
  const nz = Math.ceil((hi[2] - lo[2]) / h) + 3
  const field = new Float32Array(nx * ny * nz)
  const at = (i: number, j: number, k: number) => i + nx * (j + ny * k)

  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) {
    const y = oy + j * h, z = oz + k * h
    if (symmetric) {
      for (let i = half; i < nx; i++) {
        const v = f(ox + i * h, y, z)
        field[at(i, j, k)] = v
        field[at(2 * half - i, j, k)] = v
      }
    } else {
      for (let i = 0; i < nx; i++) field[at(i, j, k)] = f(ox + i * h, y, z)
    }
  }

  const cell = new Int32Array(nx * ny * nz).fill(-1)
  const pos: number[] = []
  const corner = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]]
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]]
  const v = new Float64Array(8)
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    let inside = 0
    for (let c = 0; c < 8; c++) {
      v[c] = field[at(i + corner[c][0], j + corner[c][1], k + corner[c][2])]
      if (v[c] < 0) inside++
    }
    if (inside === 0 || inside === 8) continue
    let sx = 0, sy = 0, sz = 0, n = 0
    for (const [a, b] of edges) {
      if ((v[a] < 0) === (v[b] < 0)) continue
      const t = v[a] / (v[a] - v[b])
      sx += corner[a][0] + t * (corner[b][0] - corner[a][0])
      sy += corner[a][1] + t * (corner[b][1] - corner[a][1])
      sz += corner[a][2] + t * (corner[b][2] - corner[a][2])
      n++
    }
    cell[at(i, j, k)] = pos.length / 3
    pos.push(ox + (i + sx / n) * h, oy + (j + sy / n) * h, oz + (k + sz / n) * h)
  }

  const idx: number[] = []
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return
    if (flip) idx.push(a, c, b, a, d, c)
    else idx.push(a, b, c, a, c, d)
  }
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const here = field[at(i, j, k)] < 0
    if (here !== field[at(i + 1, j, k)] < 0) quad(cell[at(i, j - 1, k - 1)], cell[at(i, j, k - 1)], cell[at(i, j, k)], cell[at(i, j - 1, k)], !here)
    if (here !== field[at(i, j + 1, k)] < 0) quad(cell[at(i - 1, j, k - 1)], cell[at(i - 1, j, k)], cell[at(i, j, k)], cell[at(i, j, k - 1)], !here)
    if (here !== field[at(i, j, k + 1)] < 0) quad(cell[at(i - 1, j - 1, k)], cell[at(i, j - 1, k)], cell[at(i, j, k)], cell[at(i - 1, j, k)], !here)
  }
  return { pos: new Float32Array(pos), idx: new Uint32Array(idx) }
}

/** 0: on the skin · 1: on a cut face, inside the body · 2: on the rim where the two meet. */
export type Kind = 0 | 1 | 2

/**
 * Moves every vertex onto the surface it belongs to. Where a part was cut
 * from the body (`cut` > 0 is outside the part), rim vertices are put on both
 * the skin and the cut, so two parts cut along the same plane meet exactly.
 */
export function settle(mesh: Mesh, surface: Fn, cut: Fn | null, h: number): Uint8Array {
  const kinds = new Uint8Array(mesh.pos.length / 3)
  const step = (f: Fn, p: V3) => {
    const d = f(p[0], p[1], p[2])
    const g = gradient(f, p[0], p[1], p[2])
    const g2 = g[0] * g[0] + g[1] * g[1] + g[2] * g[2]
    if (g2 < 1e-9) return
    const s = Math.max(-h, Math.min(h, d / Math.sqrt(g2))) / Math.sqrt(g2)
    p[0] -= g[0] * s; p[1] -= g[1] * s; p[2] -= g[2] * s
  }
  for (let i = 0; i < kinds.length; i++) {
    const p: V3 = [mesh.pos[i * 3], mesh.pos[i * 3 + 1], mesh.pos[i * 3 + 2]]
    const c = cut ? cut(p[0], p[1], p[2]) : -1
    const s = surface(p[0], p[1], p[2])
    const kind: Kind = !cut || c < -0.7 * h ? 0 : s < -0.7 * h ? 1 : 2
    kinds[i] = kind
    for (let n = 0; n < 4; n++) {
      if (kind !== 1) step(surface, p)
      if (kind !== 0) step(cut!, p)
    }
    mesh.pos.set(p, i * 3)
  }
  return kinds
}

/** Fewer triangles where the surface is plain, the same where it is not. Vertices are kept, never moved. */
export async function simplify(mesh: Mesh, triangles: number, error: number): Promise<{ mesh: Mesh; from: Uint32Array }> {
  await MeshoptSimplifier.ready
  let idx = mesh.idx
  if (idx.length / 3 > triangles) {
    ;[idx] = MeshoptSimplifier.simplify(mesh.idx, mesh.pos, 3, triangles * 3, error, ['ErrorAbsolute'])
  }
  const remap = new Int32Array(mesh.pos.length / 3).fill(-1)
  const from: number[] = []
  const out = new Uint32Array(idx.length)
  for (let i = 0; i < idx.length; i++) {
    const v = idx[i]
    if (remap[v] < 0) { remap[v] = from.length; from.push(v) }
    out[i] = remap[v]
  }
  const pos = new Float32Array(from.length * 3)
  from.forEach((v, i) => pos.set(mesh.pos.subarray(v * 3, v * 3 + 3), i * 3))
  return { mesh: { pos, idx: out }, from: new Uint32Array(from) }
}

export function normals(mesh: Mesh, surface: Fn, cut: Fn | null, kinds: Uint8Array): Float32Array {
  const out = new Float32Array(mesh.pos.length)
  for (let i = 0; i < kinds.length; i++) {
    const x = mesh.pos[i * 3], y = mesh.pos[i * 3 + 1], z = mesh.pos[i * 3 + 2]
    const g = gradient(kinds[i] === 1 && cut ? cut : surface, x, y, z, 0.0012)
    const l = Math.hypot(g[0], g[1], g[2]) || 1
    out[i * 3] = g[0] / l; out[i * 3 + 1] = g[1] / l; out[i * 3 + 2] = g[2] / l
  }
  return out
}

/** The same part on the other side of the body. */
export function mirrored<T extends { pos: Float32Array; idx: Uint32Array; nrm?: Float32Array }>(m: T): T {
  const pos = new Float32Array(m.pos)
  for (let i = 0; i < pos.length; i += 3) pos[i] = -pos[i]
  const idx = new Uint32Array(m.idx)
  for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t }
  const out = { ...m, pos, idx }
  if (m.nrm) {
    const nrm = new Float32Array(m.nrm)
    for (let i = 0; i < nrm.length; i += 3) nrm[i] = -nrm[i]
    out.nrm = nrm
  }
  return out
}

/** Which vertices touch which: for smoothing values over the surface. */
export function neighbours(mesh: Mesh): number[][] {
  const out: Set<number>[] = Array.from({ length: mesh.pos.length / 3 }, () => new Set<number>())
  for (let i = 0; i < mesh.idx.length; i += 3) {
    const a = mesh.idx[i], b = mesh.idx[i + 1], c = mesh.idx[i + 2]
    out[a].add(b).add(c); out[b].add(a).add(c); out[c].add(a).add(b)
  }
  return out.map((s) => [...s])
}
