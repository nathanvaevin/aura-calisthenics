import { useEffect, useRef } from 'react'

/**
 * The ring that fills when the Aura ignites: warm golden light running round
 * the clock, slowly at first and then faster. It is light, not a band: it has
 * no edge, only a bright heart that falls away to nothing on either side, and
 * it is alive, with brightness travelling along it. No bolts, no sparks.
 *
 * Two canvases: a wide one for the glow and a narrower one for the heart of
 * the light. Both are blurred by the browser, which costs a phone nothing.
 */
export function IgniteRing({ fill, ease }: { fill: number; ease: number }) {
  const glow = useRef<HTMLCanvasElement>(null)
  const light = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const g = glow.current, l = light.current
    const box = l?.parentElement
    if (!g || !l || !box) return
    const G = g.getContext('2d'), L = l.getContext('2d')
    if (!G || !L) return

    // The ring is drawn on a square 1.6 times the field's own size, so its light has room.
    const side = box.clientWidth
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    for (const c of [g, l]) { c.width = Math.round(side * dpr); c.height = Math.round(side * dpr) }
    const s = side / 1.6
    const mid = side / 2
    const radius = 0.475 * s
    const paper = document.documentElement.dataset.scheme === 'light'
    const angle = (turn: number) => turn * Math.PI * 2 - Math.PI / 2
    // Gold: deep and warm at its reach, lighter nearer in, almost white at its heart.
    const amber = (a: number) => `rgba(255, 132, 30, ${a})`
    const gold = (a: number) => `rgba(255, 184, 80, ${a})`
    const heart = (a: number) => `rgba(255, 240, 208, ${a})`
    // From wide and faint to narrow and bright, laid over each other: together a light with no edge to it.
    const FALL: [number, number, (a: number) => string][] = [[0.11, 0.05, amber], [0.08, 0.08, amber], [0.056, 0.13, gold], [0.036, 0.2, gold], [0.02, 0.34, gold], [0.009, 0.6, heart]]

    const start = performance.now()
    let frame = 0
    const draw = (now: number) => {
      const t = (now - start) / 1000
      const p = Math.min(1, Math.pow(Math.min(1, t / fill), ease))
      // It breathes, a little, and more once the ring is whole.
      const breath = 1 + (0.06 + 0.12 * p) * Math.sin(t * Math.PI * 2 * (0.9 + 1.8 * p))
      for (const ctx of [G, L]) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, side, side)
        // The glow is laid over what is behind it (added to the colours of the field it would turn green); the heart of the light is added.
        ctx.globalCompositeOperation = paper || ctx === G ? 'source-over' : 'lighter'
        ctx.lineCap = 'round'
      }
      if (p > 0) {
        const steps = Math.max(2, Math.ceil(p * 110))
        for (let i = 0; i < steps; i++) {
          const from = (p * i) / steps, to = (p * (i + 1)) / steps + 0.004
          const at = (from + to) / 2
          // Dimmer where it began, brightest towards where it is being drawn; and brightness runs along it, like something flowing.
          const trail = p >= 1 ? 1 : 0.4 + 0.6 * Math.pow((i + 1) / steps, 2.2)
          const flow = 0.78 + 0.22 * Math.sin(at * Math.PI * 2 * 5 - t * (5 + 9 * p)) * Math.sin(at * Math.PI * 2 * 2 + t * 3.1)
          const lit = trail * flow
          G.beginPath(); G.arc(mid, mid, radius, angle(from), angle(to))
          G.strokeStyle = amber(0.42 * lit); G.lineWidth = 0.15 * s * breath; G.stroke()
          for (const [width, a, colour] of FALL) {
            L.beginPath(); L.arc(mid, mid, radius, angle(from), angle(to))
            L.strokeStyle = colour(a * lit); L.lineWidth = width * s * breath; L.stroke()
          }
        }
        // Its head, where it is being drawn: a warm flare.
        if (p < 1) {
          const a = angle(p), x = mid + Math.cos(a) * radius, y = mid + Math.sin(a) * radius
          for (const [ctx, reach] of [[G, 0.2], [L, 0.09]] as const) {
            const flare = ctx.createRadialGradient(x, y, 0, x, y, reach * s * breath)
            flare.addColorStop(0, heart(1))
            flare.addColorStop(0.25, gold(0.8))
            flare.addColorStop(1, amber(0))
            ctx.fillStyle = flare
            ctx.beginPath(); ctx.arc(x, y, reach * s * breath, 0, Math.PI * 2); ctx.fill()
          }
        }
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [fill, ease])

  return (
    <span className="aura-ignite-ring" aria-hidden>
      <canvas ref={glow} />
      <canvas ref={light} />
    </span>
  )
}
