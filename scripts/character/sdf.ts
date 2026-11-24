/**
 * A body as a field of distances.
 *
 * Every part of the character (a ribcage, a biceps, a finger) is a simple
 * closed shape with a known distance function. The body is their smooth
 * union: shapes melt into their neighbours over a blend radius `k`, large for
 * the frame, small for muscles so that the grooves between them survive.
 * The skin is where the field is zero.
 */
import type { V3 } from '../../src/visual/body/skeleton'

export interface Shape {
  kind: 'ell' | 'cone'
  /** Ellipsoid: centre, the world directions of its three axes, and its radii along them. */
  c?: V3
  axes?: [V3, V3, V3]
  r?: V3
  /** Round cone: a ball at each end, joined. */
  a?: V3
  b?: V3
  r1?: number
  r2?: number
  /** Blend radius with what is already there. */
  k: number
  /** Carves instead of adds. */
  sub?: boolean
  /** Defined on the left; exists on the right too. */
  mirror?: boolean
  /** Bones this shape's skin may follow, with a strength. Left names; the right copy swaps sides. */
  bones: Record<string, number>
  /** Soft tissue: how far (0..1) what this shape adds to the body gives to gravity. See `soft` in `build.ts`. */
  soft?: number
  /** The muscle channel this shape is, if it is one. */
  muscle?: string
  /**
   * A relief instead of a solid: the skin inside this ellipsoid is raised by
   * this height, flat across the middle and falling away from `edge` (0..1 of
   * the radius) to the rim. Muscle definition is made of these.
   */
  relief?: number
  edge?: number
  /** 2 is an ellipse; higher squares the patch off. */
  power?: number
}

const STRIDE = 22
const CELL = 0.04
const FAR = 1e3

export class Field {
  readonly shapes: Shape[]
  private readonly d: Float64Array
  private readonly min: V3
  private readonly dim: [number, number, number]
  private readonly start: Int32Array
  private readonly list: Int32Array

  constructor(shapes: Shape[]) {
    // Solids, then reliefs on them, then carving: whatever the order they were written in.
    this.shapes = [...shapes.filter((s) => !s.sub && !s.relief), ...shapes.filter((s) => s.relief), ...shapes.filter((s) => s.sub)]
    const n = this.shapes.length
    this.d = new Float64Array(n * STRIDE)
    const boxes: [V3, V3][] = []
    this.shapes.forEach((s, i) => {
      const o = i * STRIDE
      const d = this.d
      d[o] = s.kind === 'ell' ? 0 : 1
      d[o + 1] = s.k
      d[o + 2] = s.relief ? 2 : s.sub ? 1 : 0
      d[o + 3] = s.mirror ? 1 : 0
      d[o + 19] = s.relief ?? 0
      if (s.relief) { d[o + 1] = s.edge ?? 0.55; d[o + 20] = s.power ?? 2 }
      const pad = s.relief ? 0.004 : s.k + 0.012
      if (s.kind === 'ell') {
        const c = s.c!, r = s.r!, ax = s.axes ?? [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
        d.set(c, o + 4)
        d.set(ax[0], o + 7); d.set(ax[1], o + 10); d.set(ax[2], o + 13)
        d.set(r, o + 16)
        const e = Math.max(r[0], r[1], r[2]) + pad
        boxes.push([[c[0] - e, c[1] - e, c[2] - e], [c[0] + e, c[1] + e, c[2] + e]])
      } else {
        const a = s.a!, b = s.b!
        d.set(a, o + 4); d.set(b, o + 7)
        d[o + 10] = s.r1!; d[o + 11] = s.r2!
        const ea = s.r1! + pad, eb = s.r2! + pad
        boxes.push([
          [Math.min(a[0] - ea, b[0] - eb), Math.min(a[1] - ea, b[1] - eb), Math.min(a[2] - ea, b[2] - eb)],
          [Math.max(a[0] + ea, b[0] + eb), Math.max(a[1] + ea, b[1] + eb), Math.max(a[2] + ea, b[2] + eb)],
        ])
      }
    })

    // A coarse grid of which shapes can matter where.
    const lo: V3 = [Infinity, Infinity, Infinity], hi: V3 = [-Infinity, -Infinity, -Infinity]
    boxes.forEach(([a, b], i) => {
      const m = this.shapes[i].mirror
      for (let c = 0; c < 3; c++) {
        lo[c] = Math.min(lo[c], a[c], m && c === 0 ? -b[0] : Infinity)
        hi[c] = Math.max(hi[c], b[c], m && c === 0 ? -a[0] : -Infinity)
      }
    })
    this.min = [lo[0] - CELL, lo[1] - CELL, lo[2] - CELL]
    this.dim = [0, 1, 2].map((c) => Math.ceil((hi[c] - lo[c]) / CELL) + 3) as [number, number, number]
    const cells: number[][] = Array.from({ length: this.dim[0] * this.dim[1] * this.dim[2] }, () => [])
    const mark = (code: number, a: V3, b: V3) => {
      const i0 = [0, 1, 2].map((c) => Math.max(0, Math.floor((a[c] - this.min[c]) / CELL)))
      const i1 = [0, 1, 2].map((c) => Math.min(this.dim[c] - 1, Math.floor((b[c] - this.min[c]) / CELL)))
      for (let z = i0[2]; z <= i1[2]; z++) for (let y = i0[1]; y <= i1[1]; y++) for (let x = i0[0]; x <= i1[0]; x++) {
        cells[x + this.dim[0] * (y + this.dim[1] * z)].push(code)
      }
    }
    boxes.forEach(([a, b], i) => {
      mark(i * 2, a, b)
      if (this.shapes[i].mirror) mark(i * 2 + 1, [-b[0], a[1], a[2]], [-a[0], b[1], b[2]])
    })
    this.start = new Int32Array(cells.length + 1)
    let total = 0
    cells.forEach((c, i) => { this.start[i] = total; total += c.length })
    this.start[cells.length] = total
    this.list = new Int32Array(total)
    cells.forEach((c, i) => { c.sort((p, q) => p - q); this.list.set(c, this.start[i]) })
  }

  /** Distance to one shape alone. */
  one(i: number, x: number, y: number, z: number): number {
    const d = this.d, o = i * STRIDE
    if (d[o] === 0) {
      const px = x - d[o + 4], py = y - d[o + 5], pz = z - d[o + 6]
      const qx = px * d[o + 7] + py * d[o + 8] + pz * d[o + 9]
      const qy = px * d[o + 10] + py * d[o + 11] + pz * d[o + 12]
      const qz = px * d[o + 13] + py * d[o + 14] + pz * d[o + 15]
      const rx = d[o + 16], ry = d[o + 17], rz = d[o + 18]
      const ax = qx / rx, ay = qy / ry, az = qz / rz
      const k0 = Math.sqrt(ax * ax + ay * ay + az * az)
      const bx = ax / rx, by = ay / ry, bz = az / rz
      const k1 = Math.sqrt(bx * bx + by * by + bz * bz)
      return k1 < 1e-9 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1
    }
    const ax = d[o + 4], ay = d[o + 5], az = d[o + 6]
    const bax = d[o + 7] - ax, bay = d[o + 8] - ay, baz = d[o + 9] - az
    const r1 = d[o + 10], r2 = d[o + 11]
    const l2 = bax * bax + bay * bay + baz * baz
    const rr = r1 - r2
    const a2 = l2 - rr * rr
    const il2 = 1 / l2
    const pax = x - ax, pay = y - ay, paz = z - az
    const yy = pax * bax + pay * bay + paz * baz
    const zz = yy - l2
    const vx = pax * l2 - bax * yy, vy = pay * l2 - bay * yy, vz = paz * l2 - baz * yy
    const x2 = vx * vx + vy * vy + vz * vz
    const y2 = yy * yy * l2
    const z2 = zz * zz * l2
    const k = Math.sign(rr) * rr * rr * x2
    if (Math.sign(zz) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2
    if (Math.sign(yy) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1
    return (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - r1
  }

  /** How much of a relief a point is under: 1 across its middle, 0 at and beyond its rim. */
  under(i: number, x: number, y: number, z: number): number {
    const d = this.d, o = i * STRIDE
    const px = x - d[o + 4], py = y - d[o + 5], pz = z - d[o + 6]
    const ax = (px * d[o + 7] + py * d[o + 8] + pz * d[o + 9]) / d[o + 16]
    const ay = (px * d[o + 10] + py * d[o + 11] + pz * d[o + 12]) / d[o + 17]
    const az = (px * d[o + 13] + py * d[o + 14] + pz * d[o + 15]) / d[o + 18]
    const p = d[o + 20]
    const r = p === 2 ? Math.sqrt(ax * ax + ay * ay + az * az) : Math.pow(Math.pow(Math.abs(ax), p) + Math.pow(Math.abs(ay), p) + Math.pow(Math.abs(az), p), 1 / p)
    if (r >= 1) return 0
    const e = d[o + 1]
    if (r <= e) return 1
    const u = (r - e) / (1 - e)
    return 1 - u * u * (3 - 2 * u)
  }

  private cell(x: number, y: number, z: number): number {
    const cx = Math.floor((x - this.min[0]) / CELL), cy = Math.floor((y - this.min[1]) / CELL), cz = Math.floor((z - this.min[2]) / CELL)
    if (cx < 0 || cy < 0 || cz < 0 || cx >= this.dim[0] || cy >= this.dim[1] || cz >= this.dim[2]) return -1
    return cx + this.dim[0] * (cy + this.dim[1] * cz)
  }

  /** The shapes that can matter at a point, as `index * 2 + (1 if the right-hand copy)`. */
  near(x: number, y: number, z: number): Int32Array {
    const c = this.cell(x, y, z)
    return c < 0 ? this.list.subarray(0, 0) : this.list.subarray(this.start[c], this.start[c + 1])
  }

  value(x: number, y: number, z: number): number {
    const c = this.cell(x, y, z)
    if (c < 0) return FAR
    const d = this.d, list = this.list
    let f = FAR
    let bump = 0
    for (let e = this.start[c], end = this.start[c + 1]; e < end; e++) {
      const code = list[e]
      const i = code >> 1
      const o = i * STRIDE
      const k = d[o + 1]
      if (d[o + 2] === 2) {
        // Neighbouring reliefs do not add up: the higher one wins, softly, which leaves a groove between them.
        const g = d[o + 19] * this.under(i, code & 1 ? -x : x, y, z)
        if (g > 0) { const g2 = g * g; bump += g2 * g2 * g2 }
        continue
      }
      if (bump > 0 && d[o + 2] === 1) { f -= Math.pow(bump, 1 / 6); bump = 0 }
      const v = this.one(i, code & 1 ? -x : x, y, z)
      if (d[o + 2] === 0) {
        const h = k - Math.abs(f - v)
        f = h > 0 ? Math.min(f, v) - (h * h) / (4 * k) : Math.min(f, v)
      } else {
        const h = k - Math.abs(f + v)
        f = h > 0 ? Math.max(f, -v) + (h * h) / (4 * k) : Math.max(f, -v)
      }
    }
    return bump > 0 ? f - Math.pow(bump, 1 / 6) : f
  }
}

export type Fn = (x: number, y: number, z: number) => number

export function gradient(f: Fn, x: number, y: number, z: number, e = 0.0007): V3 {
  return [
    (f(x + e, y, z) - f(x - e, y, z)) / (2 * e),
    (f(x, y + e, z) - f(x, y - e, z)) / (2 * e),
    (f(x, y, z + e) - f(x, y, z - e)) / (2 * e),
  ]
}
