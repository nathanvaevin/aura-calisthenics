/**
 * The level-up: energy gathers in the node an athlete has just completed,
 * builds, fires along the tree's own path to the landing it opens, and bursts
 * there. One canvas, one animation loop, no dependencies.
 *
 * Everything is time-based, so it looks the same at 60 and at 120 frames a
 * second, and the whole sequence is a pure function of the clock: timing is
 * tuned in TIMELINE and nowhere else.
 */

export interface Pt { x: number; y: number }

export interface AscentTarget extends Pt {
  r: number
  /** The route from the origin to this landing, 0..1. The tree's own edge. */
  path: (t: number) => Pt
}

export interface AscentOptions {
  /** All positions are CSS pixels inside the canvas. */
  origin: Pt & { r: number }
  /** The first is the landing the main beam goes to; the others get a lighter one. */
  targets: AscentTarget[]
  /** Other nodes nearby: they catch the light as the shockwave passes. */
  neighbours: Pt[]
  /** The discipline's colour, and the full Aura palette around it. Hex. */
  main: string
  palette: string[]
  dark: boolean
  /** Nudge the tree itself on impact. */
  shake?: (dx: number, dy: number) => void
  onLaunch?: () => void
  onImpact?: () => void
  onDone: () => void
}

/** Seconds. Anticipation is long on purpose; the release is short. */
export const TIMELINE = {
  ignite: 1.15,   // glow wakes, particles start to gather
  build: 1.05,    // rays, ribbons, tremor: the charge
  hush: 0.16,     // everything pulls into one bright point
  ascentMin: 0.4, // the flight, scaled by distance
  ascentMax: 0.66,
  fireworks: 1.25,
  settle: 2.1,    // the sustained glow
  fade: 0.7,
}

const TAU = Math.PI * 2
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOut = (t: number) => 1 - (1 - t) ** 3
const easeIn = (t: number) => t ** 2.6
const rand = (a: number, b: number) => a + Math.random() * (b - a)

const rgb = (hex: string) => {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}
const rgba = (hex: string, a: number) => `rgba(${rgb(hex).join(',')},${a})`

/** A soft round light, drawn once per colour and stamped thousands of times. */
function sprite(hex: string, hot: boolean) {
  const size = 96
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  if (hot) {
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.22, 'rgba(255,255,255,0.85)')
    grad.addColorStop(0.5, rgba(hex, 0.55))
  } else {
    grad.addColorStop(0, rgba(hex, 0.95))
    grad.addColorStop(0.35, rgba(hex, 0.45))
  }
  grad.addColorStop(1, rgba(hex, 0))
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

interface Particle {
  x: number; y: number; vx: number; vy: number
  age: number; life: number; size: number; color: number
  drag: number; gravity: number
  /** gather: pulled to a point and absorbed · free: flies and fades · comet: free, with a tail */
  kind: 'gather' | 'free' | 'comet'
  tx?: number; ty?: number; px?: number; py?: number
  twinkle?: number
}

export function playAscent(canvas: HTMLCanvasElement, o: AscentOptions): () => void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  const colours = [o.main, ...o.palette.filter((c) => c !== o.main)]
  const soft = colours.map((c) => sprite(c, false))
  const hot = colours.map((c) => sprite(c, true))
  const white = sprite('#ffffff', false)
  /** Mostly the discipline's own colour, with the rest of the Aura through it. */
  const pick = () => (Math.random() < 0.45 ? 0 : 1 + Math.floor(Math.random() * (colours.length - 1)))
  const blend: GlobalCompositeOperation = o.dark ? 'lighter' : 'source-over'

  const O = o.origin
  const T = o.targets[0]
  const length = (path: (t: number) => Pt) => {
    let d = 0
    let a = path(0)
    for (let i = 1; i <= 24; i++) { const b = path(i / 24); d += Math.hypot(b.x - a.x, b.y - a.y); a = b }
    return d
  }
  const flight = clamp(length(T.path) / 700, TIMELINE.ascentMin, TIMELINE.ascentMax)

  // The clock: when each beat starts.
  const tBuild = TIMELINE.ignite
  const tHush = tBuild + TIMELINE.build
  const tLaunch = tHush + TIMELINE.hush
  const tImpact = tLaunch + flight
  const tSettle = tImpact + TIMELINE.fireworks
  const tFade = tSettle + TIMELINE.settle
  const tEnd = tFade + TIMELINE.fade

  const particles: Particle[] = []
  const rings: { x: number; y: number; born: number; speed: number; life: number; width: number; color: number; from: number }[] = []
  const bursts: { at: number; x: number; y: number; color: number; done: boolean }[] = []
  let gatherDebt = 0
  let shedDebt = 0
  let launched = false
  let landed = false
  let frame = 0
  let start = 0
  let last = 0
  let stopped = false

  const glow = (img: HTMLCanvasElement, x: number, y: number, radius: number, alpha: number) => {
    if (alpha <= 0.003 || radius <= 0) return
    ctx.globalAlpha = Math.min(1, alpha)
    ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2)
  }

  const gather = (n: number, speed: number) => {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU)
      const d = rand(O.r * 3.2, O.r * 7.5)
      particles.push({
        x: O.x + Math.cos(a) * d, y: O.y + Math.sin(a) * d,
        // Start sideways: they spiral in rather than fall in.
        vx: -Math.sin(a) * speed * 0.75, vy: Math.cos(a) * speed * 0.75,
        age: 0, life: rand(0.9, 1.6), size: rand(1.4, 3.2), color: pick(), drag: 1.4, gravity: 0, kind: 'gather', tx: O.x, ty: O.y,
      })
    }
  }

  const burst = (x: number, y: number, n: number, lo: number, hi: number, color: number | null, opts: { gravity?: number; comets?: number; life?: [number, number]; up?: number } = {}) => {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU)
      const v = rand(lo, hi) * (0.35 + 0.65 * Math.random())
      const comet = i < (opts.comets ?? 0)
      particles.push({
        x, y, vx: Math.cos(a) * v * (comet ? 1.25 : 1), vy: Math.sin(a) * v * (comet ? 1.25 : 1) - (opts.up ?? 0),
        age: 0, life: rand(...(opts.life ?? [0.7, 1.7])), size: comet ? rand(2.6, 4.2) : rand(1.3, 3.6), color: color ?? pick(),
        drag: comet ? 1.5 : 2.3, gravity: opts.gravity ?? 0, kind: comet ? 'comet' : 'free', px: x, py: y, twinkle: rand(0, TAU),
      })
    }
  }

  const ring = (x: number, y: number, t: number, speed: number, life: number, width: number, color: number, from = 0) =>
    rings.push({ x, y, born: t, speed, life, width, color, from })

  /** The beam along a path, between two points of its length. Thick, layered, hot in the middle. */
  const beam = (path: (t: number) => Pt, from: number, to: number, scale: number, t: number, alpha: number) => {
    if (to <= from || alpha <= 0.01) return
    const steps = 28
    const pts: Pt[] = []
    for (let i = 0; i <= steps; i++) pts.push(path(lerp(from, to, i / steps)))
    const stroke = (width: number, style: string | CanvasGradient, a: number, blur = 0) => {
      ctx.globalAlpha = Math.min(1, a * alpha)
      ctx.strokeStyle = style
      ctx.lineWidth = width * scale
      ctx.shadowBlur = blur
      ctx.shadowColor = o.main
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.stroke()
    }
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const breathe = 1 + 0.08 * Math.sin(t * 46)
    // The whole Aura runs along the beam, sliding towards the head.
    const a0 = pts[0]
    const a1 = pts[pts.length - 1]
    const aura = ctx.createLinearGradient(a0.x, a0.y, a1.x, a1.y)
    const n = colours.length
    for (let i = 0; i <= n; i++) aura.addColorStop(i / n, rgba(colours[(i + Math.floor(t * 14)) % n], 1))
    // Haze in the discipline's colour, a wide band of the whole Aura, and a narrow white-hot core.
    stroke(64 * breathe, rgba(o.main, 1), 0.2, 30)
    stroke(44 * breathe, aura, 0.5)
    stroke(22, rgba(o.main, 1), 0.28)
    stroke(7, 'rgba(255,255,255,1)', 0.92)
    ctx.shadowBlur = 0

    // Two ribbons of the other Aura colours winding round it.
    const total = length(path) * (to - from)
    for (let k = 0; k < 2; k++) {
      ctx.globalAlpha = 0.8 * alpha
      ctx.strokeStyle = rgba(colours[(k * 2 + 1) % colours.length], 1)
      ctx.lineWidth = 3.6 * scale
      ctx.beginPath()
      for (let i = 0; i <= steps; i++) {
        const a = pts[Math.max(0, i - 1)]
        const b = pts[Math.min(steps, i + 1)]
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
        const nx = -(b.y - a.y) / len
        const ny = (b.x - a.x) / len
        const s = (i / steps) * total
        const off = Math.sin(s * 0.055 - t * 26 + k * Math.PI) * 21 * scale * Math.sin((i / steps) * Math.PI)
        const x = pts[i].x + nx * off
        const y = pts[i].y + ny * off
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  function draw(now: number) {
    if (stopped) return
    if (!start) { start = now; last = now }
    // In development a frame can be held still to look at it: window.__ascentAt = seconds.
    const held = import.meta.env.DEV ? (window as unknown as { __ascentAt?: number }).__ascentAt : undefined
    const t = held ?? (now - start) / 1000
    const dt = Math.min(0.034, (now - last) / 1000)
    last = now
    frame++

    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = blend
    const out = t > tFade ? 1 - clamp((t - tFade) / TIMELINE.fade) : 1

    // ── 1 · Ignition and 2 · build-up, at the node just completed ──────────
    if (t < tLaunch) {
      const ignite = clamp(t / TIMELINE.ignite)
      const build = clamp((t - tBuild) / TIMELINE.build)
      const hush = clamp((t - tHush) / TIMELINE.hush)
      const charge = easeOut(ignite) * 0.45 + build * 0.55

      // Particles are drawn in from around the node, faster as the charge grows.
      if (hush === 0) {
        gatherDebt += dt * lerp(16, 190, charge ** 1.6)
        const n = Math.floor(gatherDebt)
        gatherDebt -= n
        gather(n, lerp(40, 150, charge))
      }

      const tremor = build * build * 3.2 * (1 - hush)
      const cx = O.x + rand(-tremor, tremor)
      const cy = O.y + rand(-tremor, tremor)
      const pulse = 1 + Math.sin(t * lerp(5, 22, charge)) * lerp(0.05, 0.14, build)
      const squeeze = 1 - hush * 0.72

      // Light shafts turning behind the node.
      if (build > 0) {
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * TAU + t * 0.7 + Math.sin(t * 3 + i) * 0.06
          const len = O.r * lerp(3, 8.5, build) * squeeze
          const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len)
          grad.addColorStop(0, rgba(colours[i % colours.length], 0.5 * build))
          grad.addColorStop(1, rgba(colours[i % colours.length], 0))
          ctx.globalAlpha = 1
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(cx + Math.cos(a - 0.085) * len, cy + Math.sin(a - 0.085) * len)
          ctx.lineTo(cx + Math.cos(a + 0.085) * len, cy + Math.sin(a + 0.085) * len)
          ctx.closePath()
          ctx.fill()
        }
        // Ribbons of colour orbiting, tightening as the charge peaks.
        ctx.lineCap = 'round'
        for (let i = 0; i < 4; i++) {
          const radius = O.r * lerp(2.9 + i * 0.55, 1.5 + i * 0.22, build) * squeeze
          const a0 = t * (3.2 + i * 0.9) * (i % 2 ? -1 : 1) + i * 1.7
          ctx.globalAlpha = 0.85 * build
          ctx.strokeStyle = rgba(colours[(i + 1) % colours.length], 1)
          ctx.lineWidth = lerp(1.5, 4.5, build)
          ctx.beginPath()
          ctx.arc(cx, cy, radius, a0, a0 + 1.5 + build)
          ctx.stroke()
        }
        // Energy leaking outward in faint waves.
        if (frame % 11 === 0 && hush === 0) ring(O.x, O.y, t, 150, 0.6, 1.3, pick(), O.r)
      }
      if (t < 0.9 && frame % 26 === 1) ring(O.x, O.y, t, -70, 0.9, 1.2, 0, O.r * 5)

      glow(soft[0], cx, cy, O.r * lerp(1.6, 6.2, charge) * pulse * squeeze, lerp(0.3, 0.8, charge))
      glow(soft[2 % soft.length], cx, cy, O.r * lerp(1, 4.4, build) * pulse * squeeze, 0.45 * build)
      glow(hot[0], cx, cy, O.r * lerp(0.9, 2.5, charge) * pulse * (1 - hush * 0.35), lerp(0.35, 1, charge))
      if (hush > 0) {
        // The held breath: a hard white point and a thin flare.
        glow(white, cx, cy, O.r * lerp(1.2, 2.2, hush), hush)
        ctx.globalAlpha = hush * 0.9
        ctx.drawImage(white, cx - O.r * 9 * hush, cy - 2.5, O.r * 18 * hush, 5)
      }
    }

    // ── 3 · The ascent ─────────────────────────────────────────────────────
    if (t >= tLaunch) {
      if (!launched) {
        launched = true
        o.onLaunch?.()
        ring(O.x, O.y, t, 420, 0.45, 5, 0, O.r)
        ring(O.x, O.y, t, 250, 0.6, 2.5, 1, O.r)
        burst(O.x, O.y, 46, 90, 330, null, { life: [0.35, 0.8] })
        for (const p of particles) if (p.kind === 'gather') p.life = Math.min(p.life, p.age + 0.12)
      }
      const p = clamp((t - tLaunch) / flight)
      const head = easeIn(p)
      // After landing, the beam's tail pours up into the landing rather than switching off.
      const drain = clamp((t - tImpact) / 0.42)
      const alpha = 1 - clamp((t - tImpact - 0.15) / 0.4)

      o.targets.forEach((target, i) => {
        const scale = i === 0 ? 1 : 0.42
        beam(target.path, easeIn(drain) * 0.999, head, scale, t, alpha)
        if (p < 1) {
          const at = target.path(head)
          glow(soft[0], at.x, at.y, 66 * scale, 0.9)
          glow(soft[1 + (frame % (colours.length - 1))], at.x, at.y, 46 * scale, 0.5)
          glow(hot[0], at.x, at.y, 30 * scale, 1)
          if (i === 0) {
            // Sparks torn off the head, thrown back along the way it came.
            const back = target.path(Math.max(0, head - 0.04))
            const dx = back.x - at.x
            const dy = back.y - at.y
            const len = Math.hypot(dx, dy) || 1
            shedDebt += dt * 420
            const n = Math.floor(shedDebt)
            shedDebt -= n
            for (let k = 0; k < n; k++) {
              const side = rand(-1, 1)
              particles.push({
                x: at.x + rand(-9, 9), y: at.y + rand(-9, 9),
                vx: (dx / len) * rand(40, 240) + (-dy / len) * side * 190, vy: (dy / len) * rand(40, 240) + (dx / len) * side * 190,
                age: 0, life: rand(0.3, 0.85), size: rand(1.2, 3.1), color: pick(), drag: 3, gravity: 0, kind: 'free', twinkle: rand(0, TAU),
              })
            }
          }
        }
      })
      // The node it left keeps an ember.
      glow(soft[0], O.x, O.y, O.r * 2.8, 0.5 * (1 - clamp((t - tLaunch) / 1.4)) * out)
      glow(white, O.x, O.y, O.r * lerp(7, 2, clamp((t - tLaunch) / 0.3)), 0.75 * (1 - clamp((t - tLaunch) / 0.3)))
    }

    // ── 4 · Impact ─────────────────────────────────────────────────────────
    if (t >= tImpact) {
      if (!landed) {
        landed = true
        o.onImpact?.()
        burst(T.x, T.y, 190, 150, 680, null, { comets: 30, life: [0.7, 1.9] })
        ring(T.x, T.y, t, 560, 0.75, 7, 0, T.r)
        ring(T.x, T.y, t, 400, 0.95, 4, 1, T.r)
        ring(T.x, T.y, t + 0.07, 270, 1.15, 2.5, 2 % colours.length, T.r)
        // Fireworks: smaller bursts around and above the landing, each in one colour.
        for (let i = 0; i < 6; i++) {
          const a = rand(-Math.PI * 0.95, -Math.PI * 0.05) + (i % 3 === 0 ? Math.PI * rand(0.2, 0.8) : 0)
          const d = rand(64, 150)
          bursts.push({ at: tImpact + 0.16 + i * 0.17 + rand(0, 0.06), x: T.x + Math.cos(a) * d, y: T.y + Math.sin(a) * d * 0.85, color: 1 + (i % (colours.length - 1)), done: false })
        }
        o.targets.slice(1).forEach((target, i) => {
          burst(target.x, target.y, 64, 90, 340, 1 + (i % (colours.length - 1)), { life: [0.5, 1.2] })
          ring(target.x, target.y, t, 300, 0.7, 3, 1 + (i % (colours.length - 1)), target.r)
        })
      }
      const since = t - tImpact

      for (const b of bursts) {
        if (b.done || t < b.at) continue
        b.done = true
        burst(b.x, b.y, 54, 70, 300, b.color, { gravity: 46, life: [0.6, 1.4] })
        ring(b.x, b.y, t, 210, 0.5, 2, b.color)
        particles.push({ x: b.x, y: b.y, vx: 0, vy: 0, age: 0, life: 0.22, size: 26, color: b.color, drag: 0, gravity: 0, kind: 'free' })
      }

      // The flash, and the tree shaking under it.
      const flash = 1 - clamp(since / 0.3)
      glow(white, T.x, T.y, lerp(50, 210, easeOut(clamp(since / 0.3))), flash * 0.8)
      glow(soft[0], T.x, T.y, lerp(90, 300, easeOut(clamp(since / 0.5))), (1 - clamp(since / 0.6)) * 0.75)
      // Two more colours bloom off-centre, so the flash is Aura and not just light.
      glow(soft[1], T.x - 46, T.y - 30, lerp(60, 210, easeOut(clamp(since / 0.55))), (1 - clamp(since / 0.7)) * 0.55)
      glow(soft[2 % soft.length], T.x + 52, T.y - 12, lerp(60, 200, easeOut(clamp(since / 0.6))), (1 - clamp(since / 0.75)) * 0.5)
      const tremble = (1 - clamp(since / 0.42)) ** 2 * 7
      o.shake?.(tremble ? rand(-tremble, tremble) : 0, tremble ? rand(-tremble, tremble) : 0)

      // Light running out across the nodes around it, as the wave reaches each.
      for (const n of o.neighbours) {
        const d = Math.hypot(n.x - T.x, n.y - T.y)
        if (d > 340) continue
        const reached = since - d / 560
        if (reached < 0 || reached > 0.9) continue
        const a = Math.sin((reached / 0.9) * Math.PI) * (1 - d / 420)
        glow(soft[0], n.x, n.y, 34, a * 0.85)
        glow(white, n.x, n.y, 13, a * 0.6)
      }

      // ── 5 · Celebration: the glow that stays ─────────────────────────────
      const arrive = easeOut(clamp(since / 0.5))
      const breath = 1 + Math.sin(since * 2.5) * 0.09
      const held = arrive * out
      glow(soft[0], T.x, T.y, T.r * 5.4 * breath, 0.5 * held)
      glow(soft[(1 + Math.floor(since * 0.8)) % soft.length], T.x, T.y, T.r * 3.7 * breath, 0.3 * held)
      glow(hot[0], T.x, T.y, T.r * 2.1 * (2 - breath), lerp(1, 0.6, clamp(since / 1.6)) * held)
      ctx.lineCap = 'round'
      for (let i = 0; i < 3; i++) {
        const a0 = since * (1.1 + i * 0.45) * (i % 2 ? -1 : 1) + i * 2.1
        ctx.globalAlpha = 0.6 * held * clamp(since / 0.7)
        ctx.strokeStyle = rgba(colours[(i + 1) % colours.length], 1)
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(T.x, T.y, T.r * (1.75 + i * 0.5) * breath, a0, a0 + 1.9)
        ctx.stroke()
      }
      // Motes drifting up from the landing while it settles.
      if (t < tFade && frame % 5 === 0) {
        const a = rand(0, TAU)
        particles.push({
          x: T.x + Math.cos(a) * T.r * rand(1, 2.4), y: T.y + Math.sin(a) * T.r * rand(1, 2.4), vx: rand(-14, 14), vy: rand(-46, -16),
          age: 0, life: rand(0.9, 1.7), size: rand(1.1, 2.3), color: pick(), drag: 0.6, gravity: -8, kind: 'free', twinkle: rand(0, TAU),
        })
      }
    }

    // ── Rings ──────────────────────────────────────────────────────────────
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i]
      const age = t - r.born
      if (age < 0) continue
      if (age > r.life) { rings.splice(i, 1); continue }
      const k = age / r.life
      const radius = Math.max(0.5, r.from + r.speed * age * (1 - k * 0.35))
      ctx.globalAlpha = (1 - k) ** 1.6 * 0.9 * out
      ctx.strokeStyle = rgba(colours[r.color], 1)
      ctx.lineWidth = Math.max(0.4, r.width * (1 - k))
      ctx.beginPath()
      ctx.arc(r.x, r.y, radius, 0, TAU)
      ctx.stroke()
    }

    // ── Particles ──────────────────────────────────────────────────────────
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.age += dt
      if (p.age >= p.life) { particles.splice(i, 1); continue }
      const k = p.age / p.life
      if (p.kind === 'gather') {
        const dx = p.tx! - p.x
        const dy = p.ty! - p.y
        const d = Math.hypot(dx, dy) || 1
        if (d < O.r * 0.9) { particles.splice(i, 1); continue }
        const pull = 520 + 900 * k
        p.vx += (dx / d) * pull * dt
        p.vy += (dy / d) * pull * dt
      }
      p.vy += p.gravity * dt
      const damp = Math.exp(-p.drag * dt)
      p.vx *= damp
      p.vy *= damp
      p.px = p.x
      p.py = p.y
      p.x += p.vx * dt
      p.y += p.vy * dt
      const fade = p.kind === 'gather' ? Math.min(1, k * 4) : (1 - k) ** 1.3
      const flicker = p.twinkle === undefined ? 1 : 0.65 + 0.35 * Math.sin(p.twinkle + p.age * 34)
      const a = fade * flicker * out
      if (p.kind === 'comet') {
        ctx.globalAlpha = a * 0.75
        ctx.strokeStyle = rgba(colours[p.color], 1)
        ctx.lineWidth = p.size * 0.9
        ctx.beginPath()
        ctx.moveTo(p.x - p.vx * 0.06, p.y - p.vy * 0.06)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
        glow(hot[p.color], p.x, p.y, p.size * 3.4, a)
      } else {
        glow(soft[p.color], p.x, p.y, p.size * 3, a)
        if (p.size > 2.2) glow(white, p.x, p.y, p.size * 0.9, a * 0.8)
      }
    }

    if (t >= tEnd) {
      stopped = true
      o.shake?.(0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, w, h)
      o.onDone()
      return
    }
    raf = requestAnimationFrame(draw)
  }

  let raf = requestAnimationFrame(draw)
  return () => {
    stopped = true
    cancelAnimationFrame(raf)
    o.shake?.(0, 0)
  }
}

/** How long the whole thing runs for a flight of this many pixels. For tests and for sound. */
export const ascentSeconds = (pixels: number) =>
  TIMELINE.ignite + TIMELINE.build + TIMELINE.hush + clamp(pixels / 700, TIMELINE.ascentMin, TIMELINE.ascentMax) + TIMELINE.fireworks + TIMELINE.settle + TIMELINE.fade
