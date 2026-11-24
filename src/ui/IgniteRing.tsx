import { useEffect, useRef } from 'react'

/**
 * The ring that fills when the Aura ignites: warm golden light running round
 * the clock, slowly at first and then faster, brightest where it is being
 * drawn and glowing softly behind. Light only: no bolts, no sparks.
 *
 * Two canvases: a wide soft one for the glow (blurred by the browser, which
 * costs a phone nothing) and a sharper one on top for the band itself.
 */
export function IgniteRing({ fill, ease }: { fill: number; ease: number }) {
  const glow = useRef<HTMLCanvasElement>(null)
  const band = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const g = glow.current, b = band.current
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
    const angle = (turn: number) => turn * Math.PI * 2 - Math.PI / 2
    // Gold: deep and warm in the glow, lighter in the band, almost white at its heart.
    const amber = (a: number) => `rgba(255, 138, 36, ${a})`
    const gold = (a: number) => `rgba(255, 186, 84, ${a})`
    const heart = (a: number) => `rgba(255, 240, 210, ${a})`

    const start = performance.now()
    let frame = 0
    const draw = (now: number) => {
      const t = (now - start) / 1000
      const p = Math.min(1, Math.pow(Math.min(1, t / fill), ease))
      // It breathes, a little, and more once the ring is whole.
      const breath = 1 + (0.05 + 0.1 * p) * Math.sin(t * Math.PI * 2 * (0.9 + 1.6 * p))
      for (const ctx of [G, B]) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, side, side)
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineCap = 'round'
      }
      if (p > 0) {
        // The band: dimmer where it began, brightest towards where it is being drawn.
        const steps = Math.max(2, Math.ceil(p * 90))
        for (let i = 0; i < steps; i++) {
          const from = (p * i) / steps, to = (p * (i + 1)) / steps + 0.003
          const lit = p >= 1 ? 1 : 0.45 + 0.55 * Math.pow((i + 1) / steps, 2.4)
          G.beginPath(); G.arc(mid, mid, radius, angle(from), angle(to))
          G.strokeStyle = amber(lit); G.lineWidth = 0.1 * s * breath; G.stroke()
          B.beginPath(); B.arc(mid, mid, radius, angle(from), angle(to))
          B.strokeStyle = gold(0.35 + 0.65 * lit); B.lineWidth = 0.042 * s * breath; B.stroke()
        }
        B.globalCompositeOperation = paper ? 'source-over' : 'lighter'
        B.beginPath(); B.arc(mid, mid, radius, angle(0), angle(p))
        B.strokeStyle = heart(0.8); B.lineWidth = 0.012 * s * breath; B.stroke()

        // Its head, where it is being drawn: a warm flare.
        if (p < 1) {
          const a = angle(p), x = mid + Math.cos(a) * radius, y = mid + Math.sin(a) * radius
          for (const [ctx, reach] of [[G, 0.17], [B, 0.07]] as const) {
            const light = ctx.createRadialGradient(x, y, 0, x, y, reach * s * breath)
            light.addColorStop(0, heart(1))
            light.addColorStop(0.3, gold(0.9))
            light.addColorStop(1, amber(0))
            ctx.fillStyle = light
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
      <canvas ref={band} />
    </span>
  )
}
