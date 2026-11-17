import { useEffect, useRef } from 'react'
import type { DisciplineId } from '@/domain/types'
import { DISCIPLINE_IDS } from '@/domain/catalog'
import { TIMELINE, playAscent, type Pt } from '@/ui/ascent'
import { ascendSound } from '@/lib/sound'

/** A node of the tree, in the tree's own drawing units. */
export interface AscentNode extends Pt { r: number }

export interface AscentPlan {
  /** The skill the level-up is for. */
  skillId: string
  /** Where the energy gathers: the node just completed. */
  origin: AscentNode
  /** The landings it opens. The first gets the main beam. */
  targets: (AscentNode & { id: string | null })[]
  neighbours: Pt[]
}

const cssColour = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#ffffff'

/** The tree's own edge between two nodes, centre to centre. */
const route = (a: Pt, b: Pt) => (t: number): Pt => {
  const mid = (a.y + b.y) / 2
  const u = 1 - t
  const bez = (p0: number, p1: number, p2: number, p3: number) => u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  return { x: bez(a.x, a.x, b.x, b.x), y: bez(a.y, mid, mid, b.y) }
}

/**
 * Plays one level-up over the tree. The canvas covers only the stretch of
 * tree involved and takes no clicks, so the tree under it stays usable.
 */
export function AscentLayer({ plan, discipline, wrap, unit, height, sound, level, onImpact, onDone }: {
  plan: AscentPlan
  discipline: DisciplineId
  /** The element that holds the tree: measured for scale, and nudged on impact. */
  wrap: React.RefObject<HTMLDivElement | null>
  /** Width of the tree in its own units; its rendered width divided by this is the scale. */
  unit: number
  height: number
  sound: boolean
  level: number
  onImpact: () => void
  onDone: () => void
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  // The callbacks may change identity while the animation runs; it must not restart for that.
  const cb = useRef({ onImpact, onDone })
  cb.current = { onImpact, onDone }

  useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    if (!el || !cv) return
    const k = el.clientWidth / unit
    const ys = [plan.origin.y, ...plan.targets.map((t) => t.y)]
    // Room above for the fireworks, below for the charge.
    const top = Math.max(0, Math.min(...ys) * k - 320)
    const bottom = Math.min(height * k, Math.max(...ys) * k + 250)
    cv.style.top = `${top}px`
    cv.style.height = `${bottom - top}px`
    // The light may spill past the tree's column, as far as the screen has room for.
    const box = el.getBoundingClientRect()
    const left = Math.max(0, Math.min(200, box.left))
    const right = Math.max(0, Math.min(200, document.documentElement.clientWidth - box.right))
    cv.style.left = `${-left}px`
    cv.style.width = `${el.clientWidth + left + right}px`
    const at = (p: Pt) => ({ x: p.x * k + left, y: p.y * k - top })
    const origin = { ...at(plan.origin), r: plan.origin.r * k }

    // Bring the launch into view; follow the beam to the landing if both do not fit.
    const page = (y: number) => box.top + window.scrollY + y * k
    const vh = window.innerHeight
    const from = page(plan.origin.y)
    const to = page(plan.targets[0].y)
    const fits = from - to + 400 < vh
    const scrollTo = (y: number, share: number) => window.scrollTo({ top: Math.max(0, y - vh * share), behavior: 'smooth' })
    if (fits) scrollTo((from + to) / 2, 0.52)
    else scrollTo(from, 0.66)

    let cancel = () => {}
    const begin = window.setTimeout(() => {
      const launchAt = TIMELINE.ignite + TIMELINE.build + TIMELINE.hush
      let flight = 0.5
      cancel = playAscent(cv, {
        origin,
        targets: plan.targets.map((t) => ({ ...at(t), r: t.r * k, path: (() => { const r = route(plan.origin, t); return (p: number) => at(r(p)) })() })),
        neighbours: plan.neighbours.map(at),
        main: cssColour(`--d-${discipline}`),
        palette: DISCIPLINE_IDS.map((d) => cssColour(`--d-${d}`)),
        dark: document.documentElement.dataset.theme !== 'light',
        shake: (dx, dy) => { el.style.transform = dx || dy ? `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` : '' },
        onLaunch: () => { if (!fits) scrollTo(to, 0.42) },
        onImpact: () => cb.current.onImpact(),
        onDone: () => cb.current.onDone(),
      })
      const d = Math.hypot(plan.targets[0].x - plan.origin.x, plan.targets[0].y - plan.origin.y) * k
      flight = Math.max(TIMELINE.ascentMin, Math.min(TIMELINE.ascentMax, d / 700))
      if (sound) ascendSound(launchAt, launchAt + flight, level)
    }, 520)

    return () => {
      window.clearTimeout(begin)
      cancel()
      el.style.transform = ''
    }
  }, [plan, discipline, wrap, unit, height, sound, level])

  // Faded at its edges, so the light never ends in a straight line.
  const edge = 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)'
  return (
    <canvas
      ref={canvas} aria-hidden="true" className="pointer-events-none absolute z-10"
      style={{ maskImage: edge, WebkitMaskImage: edge, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' }}
    />
  )
}
