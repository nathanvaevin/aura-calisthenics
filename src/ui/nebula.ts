/**
 * The burst that ends an ignite. It has force: a white-hot heart, a front of
 * light that crosses the screen, rays thrown out with it and sparks flying
 * past, and behind them clouds of hot gold and ember red that fill the screen
 * and thin away over whatever screen has come next.
 *
 * It draws on a canvas of its own laid over the whole page and takes itself
 * away when it is done, so it outlives the screen that started it.
 */
const CLOUD: [number, number, number][] = [
  [255, 196, 96], [255, 140, 52], [255, 224, 170], [255, 104, 60], [255, 170, 70], [226, 70, 96], [255, 150, 60], [150, 70, 190],
]

/** `from`: where it bursts from, in page pixels. `swell`: seconds until the screen is full. `clear`: seconds it takes to thin away after that. */
export function nebula(from: { x: number; y: number }, swell = 0.75, clear = 1.1) {
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
  // Clouds: thrown outward, swelling as they go. Spread by area, so the far corners of the screen get their share.
  const clouds = Array.from({ length: 60 }, (_, i) => ({
    turn: rand(0, Math.PI * 2), curl: rand(-0.22, 0.22), reach: Math.sqrt(rand(0.01, 1.3)) * far, size: rand(0.16, 0.42) * far,
    colour: CLOUD[i % CLOUD.length], light: rand(0.08, 0.17), late: rand(0, 0.12),
  }))
  // Rays: straight out from the heart, of uneven length and width.
  const rays = Array.from({ length: 26 }, () => ({ turn: rand(0, Math.PI * 2), reach: rand(0.55, 1.35) * far, width: rand(0.006, 0.022), light: rand(0.25, 0.7) }))
  // Sparks: fast, and slowing; each drags a short tail.
  const sparks = Array.from({ length: 130 }, () => ({ turn: rand(0, Math.PI * 2), reach: rand(0.35, 1.5) * far, size: rand(0.6, 1.9), late: rand(0, 0.1), quick: rand(2.2, 4.2) }))
  const paper = document.documentElement.dataset.scheme === 'light'

  const start = performance.now()
  const total = swell + clear
  const draw = (now: number) => {
    const t = (now - start) / 1000
    if (t >= total) { canvas.remove(); return }
    // Whole while it swells, then thinning.
    const present = t < swell ? 1 : Math.pow(1 - (t - swell) / clear, 1.7)
    const u = Math.min(1, t / swell)
    const out = 1 - Math.pow(1 - u, 3.4)
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = paper ? 'source-over' : 'lighter'

    // Heat behind everything, so the screen is filled and not merely crossed.
    const depth = ctx.createRadialGradient(from.x, from.y, 0, from.x, from.y, far * (0.2 + 1.5 * out))
    depth.addColorStop(0, `rgba(255, 214, 140, ${0.6 * present})`)
    depth.addColorStop(0.4, `rgba(255, 128, 60, ${0.36 * present})`)
    depth.addColorStop(0.8, `rgba(170, 50, 90, ${0.22 * present})`)
    depth.addColorStop(1, 'rgba(70, 30, 110, 0)')
    ctx.fillStyle = depth
    ctx.fillRect(0, 0, w, h)

    for (const c of clouds) {
      const cu = Math.max(0, Math.min(1, (t - c.late * swell) / swell))
      if (cu <= 0) continue
      const go = 1 - Math.pow(1 - cu, 3.2)
      const drift = go + Math.max(0, t - swell) * 0.04
      const turn = c.turn + c.curl * drift
      const x = from.x + Math.cos(turn) * c.reach * drift, y = from.y + Math.sin(turn) * c.reach * drift
      const r = c.size * (0.3 + 0.7 * go)
      const puff = ctx.createRadialGradient(x, y, 0, x, y, r)
      const a = c.light * present * Math.min(1, cu * 5)
      puff.addColorStop(0, `rgba(${c.colour[0]}, ${c.colour[1]}, ${c.colour[2]}, ${a})`)
      puff.addColorStop(0.5, `rgba(${c.colour[0]}, ${c.colour[1]}, ${c.colour[2]}, ${a * 0.4})`)
      puff.addColorStop(1, `rgba(${c.colour[0]}, ${c.colour[1]}, ${c.colour[2]}, 0)`)
      ctx.fillStyle = puff
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }

    // The rays, thrown out with the front and gone soon after it.
    const thrown = Math.max(0, 1 - t / (swell * 0.95))
    if (thrown > 0) {
      for (const r of rays) {
        const length = r.reach * out
        const ex = from.x + Math.cos(r.turn) * length, ey = from.y + Math.sin(r.turn) * length
        const nx = -Math.sin(r.turn) * r.width * far * (0.4 + out), ny = Math.cos(r.turn) * r.width * far * (0.4 + out)
        const beam = ctx.createLinearGradient(from.x, from.y, ex, ey)
        beam.addColorStop(0, `rgba(255, 244, 214, ${r.light * thrown})`)
        beam.addColorStop(0.5, `rgba(255, 176, 76, ${r.light * 0.55 * thrown})`)
        beam.addColorStop(1, 'rgba(255, 110, 50, 0)')
        ctx.fillStyle = beam
        ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(ex + nx, ey + ny); ctx.lineTo(ex - nx, ey - ny); ctx.closePath(); ctx.fill()
      }
    }

    // The front: a wall of light that crosses the screen once, soft on both sides.
    if (u < 1) {
      const at = far * 1.25 * out, thick = far * (0.05 + 0.1 * out)
      const front = ctx.createRadialGradient(from.x, from.y, Math.max(0, at - thick), from.x, from.y, at + thick)
      const a = (1 - u) * 0.9
      front.addColorStop(0, 'rgba(255, 200, 120, 0)')
      front.addColorStop(0.5, `rgba(255, 240, 206, ${a})`)
      front.addColorStop(0.7, `rgba(255, 178, 84, ${a * 0.6})`)
      front.addColorStop(1, 'rgba(255, 120, 50, 0)')
      ctx.fillStyle = front
      ctx.beginPath(); ctx.arc(from.x, from.y, at + thick, 0, Math.PI * 2); ctx.fill()
    }

    // The heart: white-hot at the first instant, cooling fast.
    const hot = Math.max(0, 1 - t / 0.5)
    if (hot > 0) {
      const r = far * (0.12 + 0.5 * out)
      const core = ctx.createRadialGradient(from.x, from.y, 0, from.x, from.y, r)
      core.addColorStop(0, `rgba(255, 255, 248, ${hot})`)
      core.addColorStop(0.3, `rgba(255, 226, 160, ${hot * 0.8})`)
      core.addColorStop(1, 'rgba(255, 150, 60, 0)')
      ctx.fillStyle = core
      ctx.beginPath(); ctx.arc(from.x, from.y, r, 0, Math.PI * 2); ctx.fill()
    }

    // Sparks, each with the short tail its speed gives it.
    ctx.lineCap = 'round'
    for (const s of sparks) {
      const su = Math.max(0, Math.min(1, (t - s.late * swell) / (swell * 1.5)))
      if (su <= 0) continue
      const go = 1 - Math.pow(1 - su, s.quick), was = 1 - Math.pow(1 - Math.max(0, su - 0.035), s.quick)
      const cos = Math.cos(s.turn), sin = Math.sin(s.turn)
      ctx.strokeStyle = `rgba(255, 232, 190, ${present * (0.5 + 0.5 * (1 - su))})`
      ctx.lineWidth = s.size
      ctx.beginPath(); ctx.moveTo(from.x + cos * s.reach * was, from.y + sin * s.reach * was); ctx.lineTo(from.x + cos * s.reach * go, from.y + sin * s.reach * go); ctx.stroke()
    }
    requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
}
