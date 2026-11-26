import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, GripVertical, Plus } from 'lucide-react'
import type { CourseWeek } from '@/domain/types'
import { cx } from '@/lib/format'

/** How long a finger rests on a week before it comes loose, and how far it may wander meanwhile (it is a scroll if further). */
const HOLD = 420
const SLOP = 8

interface Drag {
  from: number
  /** Where it would land if let go now. */
  over: number
  /** The strip lies on a phone and stands on a wide screen. */
  axis: 'x' | 'y'
  /** Where each week starts and how long it is along the axis, as they lay when the drag began. */
  starts: number[]
  sizes: number[]
  gap: number
  /** The pointer along the axis, when the drag began and now, the strip's own scrolling included. */
  grab: number
  at: number
}

/** The weeks as they would lie with the dragged one at `over`: their order, and where each then starts. */
function lay(d: Pick<Drag, 'from' | 'starts' | 'sizes' | 'gap'>, over: number) {
  const order = d.starts.map((_, i) => i).filter((i) => i !== d.from)
  order.splice(over, 0, d.from)
  const pos: number[] = []
  let s = d.starts[0]
  for (const k of order) { pos[k] = s; s += d.sizes[k] + d.gap }
  return { order, pos }
}

/**
 * The weeks of a course, to choose from and to put in another order, the way a phone's home screen does it: hold one
 * and they all come loose (they wiggle, and say so), carry any of them to its place, as often as needed, and touch
 * anywhere else, or Done, to settle them. A mouse just drags; Alt and an arrow key does the same. The others make room
 * as one passes, and each shows the number it would have. Nothing is moved in the page until it is let go.
 *
 * Loose, the weeks take the finger for themselves (`touch-action: none`), so the phone cannot start scrolling the row
 * under it and cancel the drag: that is why holding and dragging in one go is not relied on. When a phone allows it,
 * the week held is carried in the same touch all the same.
 */
export function WeekStrip({ weeks, index, onSelect, onMove, onAdd, caption }: {
  weeks: CourseWeek[]
  index: number
  onSelect: (i: number) => void
  onMove: (from: number, to: number) => void
  onAdd: () => void
  caption: (w: CourseWeek, selected: boolean) => ReactNode
}) {
  const strip = useRef<HTMLDivElement>(null)
  const chips = useRef<(HTMLButtonElement | null)[]>([])
  const [drag, setDrag] = useState<Drag | null>(null)
  /** Loose: the weeks wiggle and can be carried with a touch, until settled. */
  const [loose, setLoose] = useState(false)
  const looseRef = useRef(false)
  looseRef.current = loose
  const live = useRef<Drag | null>(null)
  const press = useRef<{ i: number; x: number; y: number; mouse: boolean; timer: number } | null>(null)
  const pointer = useRef({ x: 0, y: 0 })
  /** The click that ends a drag is not a choice of week. */
  const swallow = useRef(false)
  const move = useRef(onMove)
  move.current = onMove

  useEffect(() => {
    const el = strip.current!
    const set = (d: Drag | null) => { live.current = d; setDrag(d) }
    const along = (d: Pick<Drag, 'axis'>) => (d.axis === 'x' ? pointer.current.x + el.scrollLeft : pointer.current.y)

    const follow = () => {
      const d = live.current
      if (!d) return
      const at = along(d)
      const centre = d.starts[d.from] + d.sizes[d.from] / 2 + at - d.grab
      // It changes places with a neighbour once its middle has passed the neighbour's: there is no way back by standing still.
      let over = d.over
      for (;;) {
        const { order, pos } = lay(d, over)
        const next = order[over + 1], prev = order[over - 1]
        if (next !== undefined && centre > pos[next] + d.sizes[next] / 2) over++
        else if (prev !== undefined && centre < pos[prev] + d.sizes[prev] / 2) over--
        else break
      }
      set({ ...d, at, over })
    }

    /** `x`, `y`: where it was taken hold of, which is not where the pointer is by now. */
    const begin = (i: number, x: number, y: number) => {
      const rects = chips.current.slice(0, chips.current.length).map((c) => c?.getBoundingClientRect()).filter((r): r is DOMRect => !!r)
      if (rects.length < 2 || !rects[i]) return
      const axis = Math.abs(rects[1].top - rects[0].top) > 4 ? 'y' : 'x'
      const starts = rects.map((r) => (axis === 'x' ? r.left + el.scrollLeft : r.top))
      const sizes = rects.map((r) => (axis === 'x' ? r.width : r.height))
      const grab = axis === 'x' ? x + el.scrollLeft : y
      navigator.vibrate?.(10)
      set({ from: i, over: i, axis, starts, sizes, gap: starts[1] - starts[0] - sizes[0], grab, at: grab })
      follow()
    }

    const drop = (commit: boolean) => {
      if (press.current) { clearTimeout(press.current.timer); press.current = null }
      const d = live.current
      if (!d) return
      set(null)
      swallow.current = true
      setTimeout(() => { swallow.current = false }, 80)
      if (commit && d.over !== d.from) move.current(d.from, d.over)
    }

    const onMoved = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY }
      if (live.current) return follow()
      const p = press.current
      if (!p || Math.hypot(e.clientX - p.x, e.clientY - p.y) < SLOP) return
      // A mouse that moves is dragging. A finger that moves before the week came loose is scrolling.
      clearTimeout(p.timer)
      press.current = null
      if (p.mouse) begin(p.i, p.x, p.y)
    }
    const onDown = (e: PointerEvent) => {
      const i = chips.current.findIndex((c) => c && c.contains(e.target as Node))
      if (i < 0 || e.button !== 0 || chips.current.filter(Boolean).length < 2) return
      pointer.current = { x: e.clientX, y: e.clientY }
      const mouse = e.pointerType === 'mouse'
      // Loose, a touch on a week takes hold of it at once.
      if (looseRef.current && !mouse) { begin(i, e.clientX, e.clientY); return }
      press.current = {
        i, x: e.clientX, y: e.clientY, mouse,
        timer: mouse ? 0 : window.setTimeout(() => {
          if (!press.current) return
          press.current = null
          setLoose(true)
          begin(i, e.clientX, e.clientY)
        }, HOLD),
      }
    }
    const onUp = () => drop(true)
    // A phone that took the touch for scrolling cancels it: the weeks stay loose, and the next touch carries one.
    const onCancel = () => drop(false)
    // Touching anywhere but the weeks settles them. Done, in the row, does it itself: settled here, the button under the
    // finger would be another one by the time the touch ends.
    const settle = (e: PointerEvent) => {
      if (!looseRef.current || el.contains(e.target as Node)) return
      setLoose(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && looseRef.current) setLoose(false) }
    // Once a week is loose the finger carries it: the page and the strip must not scroll under it.
    const onTouch = (e: TouchEvent) => { if (live.current) e.preventDefault() }
    const onMenu = (e: Event) => { if (live.current || press.current) e.preventDefault() }

    // Near an end of the strip it scrolls on, so a week can be carried further than is in view.
    let frame = 0
    const edge = () => {
      frame = requestAnimationFrame(edge)
      const d = live.current
      if (!d || d.axis !== 'x') return
      const r = el.getBoundingClientRect(), x = pointer.current.x, was = el.scrollLeft
      if (x < r.left + 44) el.scrollLeft -= 7
      else if (x > r.right - 44) el.scrollLeft += 7
      if (el.scrollLeft !== was) follow()
    }
    frame = requestAnimationFrame(edge)

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('touchmove', onTouch, { passive: false })
    el.addEventListener('contextmenu', onMenu)
    window.addEventListener('pointermove', onMoved)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    document.addEventListener('pointerdown', settle, true)
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      if (press.current) clearTimeout(press.current.timer)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('touchmove', onTouch)
      el.removeEventListener('contextmenu', onMenu)
      window.removeEventListener('pointermove', onMoved)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      document.removeEventListener('pointerdown', settle, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const laid = drag ? lay(drag, drag.over) : null
  chips.current.length = weeks.length
  return (
    <div className="lg:sticky lg:top-8">
    <div ref={strip} data-weeks data-loose={loose ? '' : undefined} data-dragging={drag ? '' : undefined} className="no-scrollbar -mx-5 -my-2 flex gap-2 overflow-x-auto px-5 py-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {weeks.map((w, i) => {
        const carried = drag?.from === i
        // The carried week follows the finger, kept inside the row; the others step aside.
        const shift = !drag || !laid ? 0 : carried
          ? Math.max(drag.starts[0] - drag.starts[i], Math.min(drag.at - drag.grab, drag.starts[weeks.length - 1] + drag.sizes[weeks.length - 1] - drag.starts[i] - drag.sizes[i]))
          : laid.pos[i] - drag.starts[i]
        const selected = i === index
        return (
          <button
            key={w.id} ref={(el) => { chips.current[i] = el }} data-week={w.id} data-carried={carried ? '' : undefined} title={weeks.length > 1 ? 'Hold and drag to move this week' : undefined}
            onClick={() => { if (!swallow.current && !loose) onSelect(i) }}
            onKeyDown={(e) => {
              if (!e.altKey) return
              const to = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : -1
              if (to >= 0 && to < weeks.length) { e.preventDefault(); onMove(i, to) }
            }}
            style={drag ? { touchAction: loose ? 'none' : undefined, transform: `translate${drag.axis === 'x' ? 'X' : 'Y'}(${shift}px)${carried ? ' scale(1.05)' : ''}`, transition: carried ? 'none' : 'transform 0.2s ease', zIndex: carried ? 2 : undefined } : loose ? { touchAction: 'none', animationDelay: `${-(i % 3) * 0.11}s` } : undefined}
            className={cx(
              'relative flex h-[52px] min-w-[76px] shrink-0 flex-col justify-center rounded-2xl border px-3.5 text-left select-none [-webkit-touch-callout:none] lg:h-auto lg:py-2.5',
              !drag && !loose && 'pressable',
              loose && !carried && 'week-loose',
              selected ? 'border-ink bg-ink text-bg' : cx('border-line text-ink-2', carried ? 'bg-surface-2' : 'hover:bg-surface'),
              carried && 'shadow-[0_10px_28px_-8px_rgba(0,0,0,0.6)] ring-2 ring-accent',
            )}
          >
            <span className="flex items-center gap-1 text-[13.5px] font-medium">{loose && <GripVertical size={12} className="-ml-1 opacity-60" aria-hidden />}Week {(laid ? laid.order.indexOf(i) : i) + 1}</span>
            <span className={cx('truncate text-[11px]', selected ? 'opacity-70' : 'text-ink-3')}>{caption(w, selected)}</span>
          </button>
        )
      })}
      {loose ? (
        <button data-weeks-done onClick={() => setLoose(false)} className="pressable flex h-[52px] shrink-0 items-center gap-1.5 rounded-2xl bg-ink px-4 text-[13.5px] font-medium text-bg lg:h-11 lg:w-full lg:justify-center">
          <Check size={16} strokeWidth={2.6} /> Done
        </button>
      ) : (
      <button
        aria-label="Add week" onClick={onAdd}
        className="pressable flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-dashed border-line-strong text-ink-2 lg:h-11 lg:w-full lg:gap-2 lg:text-[13px]"
      >
        <Plus size={17} /><span className="hidden lg:inline">Add week</span>
      </button>
      )}
    </div>
    <p className={cx('mt-1 text-[12px] text-ink-3 transition-opacity lg:mt-2', loose ? 'opacity-100' : 'h-0 overflow-hidden opacity-0')} aria-live="polite" data-weeks-hint>
      {loose ? 'Drag a week to its place. Touch anywhere else to finish.' : ''}
    </p>
    </div>
  )
}
