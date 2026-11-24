/**
 * Clothing that is worn on the skin.
 *
 * A garment meshed on its own and laid over the body moves as the skin under
 * it does, but only nearly: where the skin slides (the folds either side of an
 * armpit) the two surfaces pass through each other, and the edge of the cloth
 * shows as a ragged line. A garment made here cannot do that. It is the
 * skin's own surface inside the garment's outline, cut out along that outline
 * and raised by the thickness of the cloth, with every point held by the bones
 * exactly as the skin was. The skin stops where the cloth begins, and the two
 * meet along one shared line.
 */
import type { Fn } from './sdf'

export interface Surface { pos: Float32Array; nrm: Float32Array; idx: Uint32Array; joints: Uint8Array; weights: Uint8Array; muscle: Uint8Array }

const EPS = 1e-6

/** A point part of the way from one vertex to another, in everything a vertex carries. */
function blend(out: { pos: number[]; nrm: number[]; joints: number[]; weights: number[]; muscle: number[] }, i: number, j: number, t: number) {
  const v = out.pos.length / 3
  const n = [0, 1, 2].map((c) => out.nrm[i * 3 + c] * (1 - t) + out.nrm[j * 3 + c] * t)
  const len = Math.hypot(n[0], n[1], n[2]) || 1
  for (let c = 0; c < 3; c++) { out.pos.push(out.pos[i * 3 + c] * (1 - t) + out.pos[j * 3 + c] * t); out.nrm.push(n[c] / len) }
  const bones = new Map<number, number>()
  for (const [u, share] of [[i, 1 - t], [j, t]] as const) for (let c = 0; c < 4; c++) {
    const w = out.weights[u * 4 + c] * share
    if (w > 0) bones.set(out.joints[u * 4 + c], (bones.get(out.joints[u * 4 + c]) ?? 0) + w)
  }
  const top = [...bones].sort((a, b) => b[1] - a[1]).slice(0, 4)
  const total = top.reduce((s, x) => s + x[1], 0) || 1
  const q = top.map((x) => Math.round((x[1] / total) * 255))
  q[0] += 255 - q.reduce((s, x) => s + x, 0)
  for (let c = 0; c < 4; c++) { out.joints.push(c < top.length && q[c] > 0 ? top[c][0] : 0); out.weights.push(c < top.length ? q[c] : 0) }
  const slots = new Map<number, number>()
  for (const [u, share] of [[i, 1 - t], [j, t]] as const) for (let c = 0; c < 4; c += 2) {
    const w = out.muscle[u * 4 + c + 1] * share
    if (w > 0) slots.set(out.muscle[u * 4 + c], (slots.get(out.muscle[u * 4 + c]) ?? 0) + w)
  }
  const two = [...slots].sort((a, b) => b[1] - a[1]).slice(0, 2)
  for (let c = 0; c < 2; c++) { const share = c < two.length ? Math.round(two[c][1]) : 0; out.muscle.push(share > 0 ? two[c][0] : 0, share) }
  return v
}

/**
 * Cuts every triangle that `f = 0` passes through, so that an unbroken line of
 * edges runs exactly along it. Returns the surface and, for each of its
 * triangles, the side it lies on: -1 where `f` is negative.
 */
export function cut(p: Surface, f: Fn): { surface: Surface; side: Int8Array } {
  const out = { pos: Array.from(p.pos), nrm: Array.from(p.nrm), joints: Array.from(p.joints), weights: Array.from(p.weights), muscle: Array.from(p.muscle) }
  const at = (i: number, j: number, t: number) => f(out.pos[i * 3] + (out.pos[j * 3] - out.pos[i * 3]) * t, out.pos[i * 3 + 1] + (out.pos[j * 3 + 1] - out.pos[i * 3 + 1]) * t, out.pos[i * 3 + 2] + (out.pos[j * 3 + 2] - out.pos[i * 3 + 2]) * t)
  const val: number[] = []
  for (let v = 0; v < p.pos.length / 3; v++) val.push(f(p.pos[v * 3], p.pos[v * 3 + 1], p.pos[v * 3 + 2]))
  const sign = (v: number) => (val[v] < -EPS ? -1 : val[v] > EPS ? 1 : 0)
  const made = new Map<number, number>()
  const count = p.pos.length / 3
  const between = (a: number, b: number) => {
    const [i, j] = a < b ? [a, b] : [b, a]
    const key = i * count + j
    const had = made.get(key)
    if (had !== undefined) return had
    // The line crosses this edge once: close in on where.
    let lo = 0, hi = 1, t = val[i] / (val[i] - val[j])
    for (let k = 0; k < 20; k++) {
      const v = at(i, j, t)
      if (Math.abs(v) < 1e-8) break
      if (v < 0 === val[i] < 0) lo = t; else hi = t
      t = (lo + hi) / 2
    }
    const v = blend(out, i, j, t)
    val[v] = 0
    made.set(key, v)
    return v
  }
  const idx: number[] = [], side: number[] = []
  const fan = (poly: number[], s: number) => {
    for (let k = 1; k + 1 < poly.length; k++) {
      const a = poly[0], b = poly[k], c = poly[k + 1]
      if (a !== b && b !== c && a !== c) { idx.push(a, b, c); side.push(s) }
    }
  }
  for (let i = 0; i < p.idx.length; i += 3) {
    const tri = [p.idx[i], p.idx[i + 1], p.idx[i + 2]]
    const s = tri.map(sign)
    if (!s.includes(1) || !s.includes(-1)) {
      // Wholly on one side. One that only touches the line belongs to the side its middle is on.
      const whole = s.includes(-1) ? -1 : s.includes(1) ? 1 : (at(tri[0], tri[1], 0.5) + val[tri[2]]) < 0 ? -1 : 1
      idx.push(tri[0], tri[1], tri[2]); side.push(whole)
      continue
    }
    const inside: number[] = [], outside: number[] = []
    for (let k = 0; k < 3; k++) {
      const u = tri[k], w = tri[(k + 1) % 3]
      if (s[k] <= 0) inside.push(u)
      if (s[k] >= 0) outside.push(u)
      if (s[k] * s[(k + 1) % 3] < 0) { const m = between(u, w); inside.push(m); outside.push(m) }
    }
    fan(inside, -1); fan(outside, 1)
  }
  return {
    surface: { pos: new Float32Array(out.pos), nrm: new Float32Array(out.nrm), idx: new Uint32Array(idx), joints: new Uint8Array(out.joints), weights: new Uint8Array(out.weights), muscle: new Uint8Array(out.muscle) },
    side: new Int8Array(side),
  }
}

/** The triangles on one side, as a surface of their own. */
export function keep(p: Surface, side: Int8Array, which: number): Surface {
  const to = new Int32Array(p.pos.length / 3).fill(-1)
  const from: number[] = [], idx: number[] = []
  for (let t = 0; t < side.length; t++) {
    if (side[t] !== which) continue
    for (let c = 0; c < 3; c++) {
      const v = p.idx[t * 3 + c]
      if (to[v] < 0) { to[v] = from.length; from.push(v) }
      idx.push(to[v])
    }
  }
  const take = <T extends Float32Array | Uint8Array>(src: T, size: number): T => {
    const dst = new (src.constructor as new (n: number) => T)(from.length * size)
    from.forEach((v, i) => { for (let c = 0; c < size; c++) dst[i * size + c] = src[v * size + c] })
    return dst
  }
  return { pos: take(p.pos, 3), nrm: take(p.nrm, 3), idx: new Uint32Array(idx), joints: take(p.joints, 4), weights: take(p.weights, 4), muscle: take(p.muscle, 4) }
}

/**
 * Makes what lies inside `f < 0` let go of bones, as far as `loose` says for a
 * bone at a place, and eases the surface just outside (up to `ease` away)
 * into that, so nothing tears where the two meet. For cloth that holds to the
 * trunk beside skin that goes with the arm: the cloth's edge then keeps its
 * shape whatever the arm does.
 */
function hold(p: Surface, f: Fn, loose: (bone: number, x: number, y: number, z: number) => number, ease: number) {
  for (let v = 0; v < p.pos.length / 3; v++) {
    const x = p.pos[v * 3], y = p.pos[v * 3 + 1], z = p.pos[v * 3 + 2]
    const d = f(x, y, z)
    if (d >= ease) continue
    const u = Math.min(1, Math.max(0, d / ease))
    const inside = 1 - u * u * (3 - 2 * u)
    const w = [0, 1, 2, 3].map((c) => p.weights[v * 4 + c] * (1 - inside * loose(p.joints[v * 4 + c], x, y, z)))
    const total = w.reduce((sum, n) => sum + n, 0)
    if (total < 1) continue
    const q = w.map((n) => Math.round((n / total) * 255))
    q[q.indexOf(Math.max(...q))] += 255 - q.reduce((sum, n) => sum + n, 0)
    for (let c = 0; c < 4; c++) p.weights[v * 4 + c] = q[c]
  }
}

/**
 * Takes a garment out of the skin: `skin` is what is left bare, `cloth` the
 * part inside `region`, raised by `thickness`. The cloth comes down to the
 * skin over `hem`, so the two share their edge; `seams` are lines along which
 * the thickness changes, which get an edge of their own to change along;
 * `loose` says which bones the cloth lets go of, and where (see `hold`).
 */
export function wear(body: Surface, region: Fn, thickness: Fn, hem: number, seams: Fn[] = [], loose?: (bone: number, x: number, y: number, z: number) => number): { skin: Surface; cloth: Surface } {
  let all = body
  for (const line of [(x: number, y: number, z: number) => region(x, y, z) + hem, ...seams]) all = cut(all, line).surface
  const { surface, side } = cut(all, region)
  if (loose) hold(surface, region, loose, hem * 5)
  const skin = keep(surface, side, 1), cloth = keep(surface, side, -1)
  const step = (v: number) => { const u = Math.min(1, Math.max(0, v / hem)); return u * u * (3 - 2 * u) }
  for (let v = 0; v < cloth.pos.length / 3; v++) {
    const x = cloth.pos[v * 3], y = cloth.pos[v * 3 + 1], z = cloth.pos[v * 3 + 2]
    const n = [cloth.nrm[v * 3], cloth.nrm[v * 3 + 1], cloth.nrm[v * 3 + 2]]
    const depth = -region(x, y, z)
    const lift = thickness(x, y, z) * step(depth)
    for (let c = 0; c < 3; c++) cloth.pos[v * 3 + c] += n[c] * lift
    if (depth > hem * 0.5) continue
    // Its very edge turns down to the skin: there it faces half outward, away from the cloth. The rest lies along the
    // skin and keeps the skin's own normal, which is finer than any the triangles could give.
    const e = 0.0007
    const g = [region(x + e, y, z) - region(x - e, y, z), region(x, y + e, z) - region(x, y - e, z), region(x, y, z + e) - region(x, y, z - e)]
    const along = g[0] * n[0] + g[1] * n[1] + g[2] * n[2]
    const out = [g[0] - along * n[0], g[1] - along * n[1], g[2] - along * n[2]]
    const len = Math.hypot(out[0], out[1], out[2])
    if (len < 1e-9) continue
    const m = [n[0] + out[0] / len, n[1] + out[1] / len, n[2] + out[2] / len]
    const ml = Math.hypot(m[0], m[1], m[2])
    for (let c = 0; c < 3; c++) cloth.nrm[v * 3 + c] = m[c] / ml
  }
  return { skin, cloth }
}
