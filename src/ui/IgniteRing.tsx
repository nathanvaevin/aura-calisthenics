import { useEffect, useRef } from 'react'

/**
 * The ring that fills when the Aura ignites: a thick band of living light in
 * the six colours, white-hot along its middle, with lightning running through
 * it and off it, beating harder and faster as it closes.
 *
 * Two canvases: a wide soft one for the glow (blurred by the browser, which
 * costs a phone nothing) and a sharp one on top for the bolts.
 */
export function IgniteRing({ order, fill, ease }: { order: readonly string[]; fill: number; ease: number }) {
  const glow = useRef<HTMLCanvasElement>(null)
  const bolts = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const g = glow.current, b = bolts.current
    const box = b?.parentElement
    if (!g || !b || !box) return
    const G = g.getContext('2d'), B = b.getContext('2d')
    if (!G || !B) return

    // The ring is drawn on a square 1.6 times the field's own size, so its light has room.
    const side = box.clientWidth
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    for (const c of [g, b]) { c.width = Math.round(side * dpr); c.height = Math.round(side * dpr) }
    const s = side / 1.6
    const mid = side / 2
    const radius = 0.475 * s
    const paper = document.documentElement.dataset.scheme === 'light'

    // The six colours as the theme has them now.
    const probe = document.createElement('span')
    box.appendChild(probe)
    const rgb = order.map((d) => {
      probe.style.color = `var(--d-${d})`
      return (getComputedStyle(probe).color.match(/[\d.]+/g) ?? ['255', '255', '255']).slice(0, 3).map(Number)
    })
    probe.remove()
    /** The colour at a place on the ring (0..1, clockwise from the top), lifted towards white by `lift`. */
    const colour = (turn: number, lift: number, alpha: number) => {
      const x = (((turn % 1) + 1) % 1) * rgb.length - 0.5
      const i = Math.floor(x), f = x - i
      const p = rgb[(i + rgb.length) % rgb.length], q = rgb[(i + 1) % rgb.length]
      const c = p.map((v, k) => Math.round(v + (q[k] - v) * f)).map((v) => Math.round(v + (255 - v) * lift))
      return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`
    }
    const angle = (turn: number) => turn * Math.PI * 2 - Math.PI / 2

    // Lightning: a jagged line round the ring, struck afresh many times a second.
    const POINTS = 120
    const strike = (reach: number) => {
      const out = new Float32Array(POINTS + 1)
      let walk = 0
      for (let i = 0; i <= POINTS; i++) {
        walk = walk * 0.55 + (Math.random() - 0.5) * reach
        out[i] = walk + (Math.random() - 0.5) * reach * 0.6
      }
      return out
    }
    let lines: Float32Array[] = []
    let forks: { turn: number; out: number; length: number; bend: number[] }[] = []
    let again = 0

    const start = performance.now()
    let frame = 0
    const draw = (now: number) => {
      const t = (now - start) / 1000
      const p = Math.min(1, Math.pow(Math.min(1, t / fill), ease))
      // It beats: harder and faster the further round it is.
      const beat = 1 + (0.14 + 0.22 * p) * Math.sin(t * Math.PI * 2 * (1.5 + 4.5 * p))

      if (now >= again) {
        lines = [strike(0.012 * s), strike(0.034 * s), strike(0.03 * s)]
        forks = Array.from({ length: 4 + Math.round(8 * p) }, () => ({
          turn: Math.random() * p, out: Math.random() < 0.7 ? 1 : -1, length: (0.05 + Math.random() * 0.12) * s,
          bend: [0, 1, 2, 3, 4].map(() => (Math.random() - 0.5) * 0.04 * s),
        }))
        again = now + 46
      }

      for (const ctx of [G, B]) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, side, side)
        ctx.globalCompositeOperation = paper ? 'source-over' : 'lighter'
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
      if (p <= 0) { frame = requestAnimationFrame(draw); return }

      // The band of light, in the colour of each stretch it passes.
      const steps = Math.max(2, Math.ceil(p * 96))
      for (let i = 0; i < steps; i++) {
        const from = (p * i) / steps, to = (p * (i + 1)) / steps + 0.003
        const at = (from + to) / 2
        G.beginPath(); G.arc(mid, mid, radius, angle(from), angle(to))
        G.strokeStyle = colour(at, 0, 1); G.lineWidth = 0.1 * s * beat; G.stroke()
        // Drawn over, not added: laid on its own glow, added light would burn every colour to white.
        B.globalCompositeOperation = 'source-over'
        B.beginPath(); B.arc(mid, mid, radius, angle(from), angle(to))
        B.strokeStyle = colour(at, 0.22, 1); B.lineWidth = 0.05 * s * beat; B.stroke()
      }

      // White-hot along its middle, and two thinner bolts that stray from it.
      B.globalCompositeOperation = paper ? 'source-over' : 'lighter'
      const last = Math.max(1, Math.round(p * POINTS))
      lines.forEach((line, k) => {
        B.beginPath()
        for (let i = 0; i <= last; i++) {
          const a = angle((p * i) / last), r = radius + line[i]
          if (i === 0) B.moveTo(mid + Math.cos(a) * r, mid + Math.sin(a) * r); else B.lineTo(mid + Math.cos(a) * r, mid + Math.sin(a) * r)
        }
        B.strokeStyle = k === 0 ? 'rgba(255, 255, 255, 0.92)' : `rgba(235, 244, 255, ${0.45 + Math.random() * 0.45})`
        B.lineWidth = (k === 0 ? 0.011 * beat : 0.005) * s
        B.stroke()
      })

      // Sparks that leap off it.
      for (const f of forks) {
        const a = angle(f.turn)
        const nx = Math.cos(a) * f.out, ny = Math.sin(a) * f.out, tx = -Math.sin(a), ty = Math.cos(a)
        B.beginPath()
        B.moveTo(mid + Math.cos(a) * radius, mid + Math.sin(a) * radius)
        f.bend.forEach((bend, i) => {
          const d = (f.length * (i + 1)) / f.bend.length
          B.lineTo(mid + Math.cos(a) * radius + nx * d + tx * bend, mid + Math.sin(a) * radius + ny * d + ty * bend)
        })
        B.strokeStyle = colour(f.turn, 0.6, 0.95); B.lineWidth = 0.006 * s; B.stroke()
        G.beginPath(); G.moveTo(mid + Math.cos(a) * radius, mid + Math.sin(a) * radius)
        G.lineTo(mid + Math.cos(a) * radius + nx * f.length, mid + Math.sin(a) * radius + ny * f.length)
        G.strokeStyle = colour(f.turn, 0, 0.9); G.lineWidth = 0.02 * s; G.stroke()
      }

      // Its head, where it is being drawn: the brightest point of all.
      if (p < 1) {
        const a = angle(p), x = mid + Math.cos(a) * radius, y = mid + Math.sin(a) * radius
        for (const [ctx, reach] of [[G, 0.14], [B, 0.05]] as const) {
          const light = ctx.createRadialGradient(x, y, 0, x, y, reach * s * beat)
          light.addColorStop(0, 'rgba(255, 255, 255, 1)')
          light.addColorStop(0.35, colour(p, 0.45, 0.85))
          light.addColorStop(1, colour(p, 0.2, 0))
          ctx.fillStyle = light
          ctx.beginPath(); ctx.arc(x, y, reach * s * beat, 0, Math.PI * 2); ctx.fill()
        }
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [order, fill, ease])

  return (
    <span className="aura-ignite-ring" aria-hidden>
      <canvas ref={glow} />
      <canvas ref={bolts} />
    </span>
  )
}
