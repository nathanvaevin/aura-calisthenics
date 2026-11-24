/**
 * The burst that ends an ignite: a nebula. Clouds of warm gold, rose, violet
 * and blue pour out of the Aura, fill the screen, and thin away over whatever
 * screen has come next, with a dust of stars carried along.
 *
 * It draws on a canvas of its own laid over the whole page and takes itself
 * away when it is done, so it outlives the screen that started it.
 */
const CLOUD: [number, number, number][] = [
  [255, 190, 96], [255, 150, 70], [255, 120, 150], [255, 206, 130], [214, 110, 230], [255, 160, 90], [140, 110, 255], [255, 232, 190], [86, 120, 255],
]

/** `from`: where it pours out of, in page pixels. `swell`: seconds until the screen is full. `clear`: seconds it takes to thin away after that. */
export function nebula(from: { x: number; y: number }, swell = 0.75, clear = 1.25) {
  const canvas = document.createElement('canvas')
  // Soft things need few pixels: half the screen's is plenty, and it keeps a phone smooth.
  const w = window.innerWidth, h = window.innerHeight, scale = 0.5
  canvas.width = Math.round(w * scale)
  canvas.height = Math.round(h * scale)
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', zIndex: '90', pointerEvents: 'none' })
  canvas.setAttribute('aria-hidden', 'true')
  canvas.dataset.nebula = ''
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) { canvas.remove(); return }

  const far = Math.hypot(Math.max(from.x, w - from.x), Math.max(from.y, h - from.y))
  const rand = (a: number, b: number) => a + Math.random() * (b - a)
  // Clouds: each drifts outward along its own slow curl, swelling as it goes.
  const clouds = Array.from({ length: 84 }, (_, i) => ({
    // Spread by area, so the far corners of the screen get their share.
    turn: rand(0, Math.PI * 2), curl: rand(-0.5, 0.5), reach: Math.sqrt(rand(0.01, 1.3)) * far, size: rand(0.2, 0.5) * far,
    colour: CLOUD[i % CLOUD.length], light: rand(0.07, 0.15), late: rand(0, 0.22),
  }))
  const stars = Array.from({ length: 110 }, () => ({ turn: rand(0, Math.PI * 2), reach: rand(0.2, 1.25) * far, size: rand(0.5, 1.7), wink: rand(0, 6.3), late: rand(0, 0.3) }))
  const paper = document.documentElement.dataset.scheme === 'light'

  const start = performance.now()
  const total = swell + clear
  const draw = (now: number) => {
    const t = (now - start) / 1000
    if (t >= total) { canvas.remove(); return }
    // Whole while it swells, then thinning.
    const present = t < swell ? Math.min(1, t / 0.12) : Math.pow(1 - (t - swell) / clear, 1.6)
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = paper ? 'source-over' : 'lighter'

    // A warm depth behind the clouds, so the screen is filled and not merely crossed.
    const out = 1 - Math.pow(1 - Math.min(1, t / swell), 3)
    const depth = ctx.createRadialGradient(from.x, from.y, 0, from.x, from.y, far * (0.25 + 1.5 * out))
    depth.addColorStop(0, `rgba(255, 206, 130, ${0.55 * present})`)
    depth.addColorStop(0.4, `rgba(236, 120, 150, ${0.34 * present})`)
    depth.addColorStop(0.8, `rgba(120, 90, 210, ${0.22 * present})`)
    depth.addColorStop(1, `rgba(60, 60, 170, 0)`)
    ctx.fillStyle = depth
    ctx.fillRect(0, 0, w, h)

    for (const c of clouds) {
      const u = Math.max(0, Math.min(1, (t - c.late * swell) / swell))
      if (u <= 0) continue
      const go = 1 - Math.pow(1 - u, 2.6)
      // It keeps drifting, slowly, after the rush.
      const drift = go + Math.max(0, t - swell) * 0.05
      const turn = c.turn + c.curl * drift
      const x = from.x + Math.cos(turn) * c.reach * drift, y = from.y + Math.sin(turn) * c.reach * drift
      const r = c.size * (0.35 + 0.65 * go)
      const puff = ctx.createRadialGradient(x, y, 0, x, y, r)
      const a = c.light * present * Math.min(1, u * 4)
      puff.addColorStop(0, `rgba(${c.colour[0]}, ${c.colour[1]}, ${c.colour[2]}, ${a})`)
      puff.addColorStop(0.55, `rgba(${c.colour[0]}, ${c.colour[1]}, ${c.colour[2]}, ${a * 0.45})`)
      puff.addColorStop(1, `rgba(${c.colour[0]}, ${c.colour[1]}, ${c.colour[2]}, 0)`)
      ctx.fillStyle = puff
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }

    for (const s of stars) {
      const u = Math.max(0, Math.min(1, (t - s.late * swell) / swell))
      if (u <= 0) continue
      const go = 1 - Math.pow(1 - u, 3) + Math.max(0, t - swell) * 0.03
      const x = from.x + Math.cos(s.turn) * s.reach * go, y = from.y + Math.sin(s.turn) * s.reach * go
      ctx.fillStyle = `rgba(255, 244, 222, ${present * (0.45 + 0.55 * Math.sin(s.wink + t * 9))})`
      ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI * 2); ctx.fill()
    }
    requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
}
