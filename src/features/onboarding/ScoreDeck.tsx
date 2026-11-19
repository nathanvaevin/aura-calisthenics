import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import type { DisciplineId } from '@/domain/types'
import { DISCIPLINE_IDS, disciplineById } from '@/domain/catalog'
import { BANDS } from '@/domain/scoring/config'
import type { DisciplineRating } from '@/domain/scoring/mastery'
import { DisciplineDot, StatusTag } from '@/ui/primitives'
import { cx, dvar } from '@/lib/format'

type Ratings = Record<DisciplineId, DisciplineRating>

/**
 * The six ratings as a deck: one large score at a time, swiped away to show
 * the next, round and round. Strongest first. A tap or an arrow key turns a
 * card too, for a mouse and for a keyboard.
 */
export function ScoreDeck({ ratings, roomy, className }: { ratings: Ratings; /** There is height to spare: the cards take it. */ roomy?: boolean; className?: string }) {
  const order = useMemo(() => [...DISCIPLINE_IDS].sort((a, b) => ratings[b].rating - ratings[a].rating), [ratings])
  const [turn, setTurn] = useState(0)
  const [dir, setDir] = useState(-1)
  const n = order.length
  const top = order[turn % n]
  const under = order[(turn + 1) % n]
  const go = (d: number) => { setDir(d); setTurn((t) => t + 1) }

  return (
    <div
      className={cx('w-full outline-none', className)} data-deck={top} tabIndex={0} role="group"
      aria-label={`Your six ratings, one at a time. ${disciplineById[top].name}: ${ratings[top].rating || 'not rated yet'}. Swipe or press an arrow key for the next.`}
      onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') go(e.key === 'ArrowLeft' ? -1 : 1) }}
    >
      <div className={cx('relative mx-auto w-full max-w-[340px]', roomy ? 'h-[216px]' : 'h-[180px]')}>
        <span aria-hidden className="absolute inset-x-7 top-5 -bottom-[12px] rounded-card border border-line bg-surface opacity-60" />
        <div aria-hidden className="absolute inset-x-3.5 top-2.5 -bottom-[6px] opacity-55"><Face d={under} rating={ratings[under]} roomy={roomy} /></div>
        <AnimatePresence initial={false} custom={dir}>
          <Card key={turn} custom={dir} nudge={turn === 0} onSwipe={go}><Face d={top} rating={ratings[top]} roomy={roomy} /></Card>
        </AnimatePresence>
      </div>
      <div className="mt-5 flex items-center justify-center gap-1.5" aria-hidden>
        {order.map((d, i) => <span key={d} className={cx('h-1.5 rounded-full transition-all duration-300', i === turn % n ? 'w-5' : 'w-1.5 bg-line-strong')} style={i === turn % n ? { background: dvar(d) } : undefined} />)}
      </div>
    </div>
  )
}

function Card({ children, custom, nudge, onSwipe }: { children: React.ReactNode; custom: number; nudge: boolean; onSwipe: (dir: number) => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-240, 240], [-11, 11])
  const dragged = useRef(false)

  // The first card leans once, to show that it moves.
  useEffect(() => {
    if (!nudge || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const hint = animate(x, [0, -26, 0], { delay: 1.6, duration: 0.8, ease: 'easeInOut' })
    return () => hint.stop()
  }, [nudge, x])

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      style={{ x, rotate }} custom={custom}
      drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.9}
      onPointerDown={() => { dragged.current = false }}
      onDragStart={() => { dragged.current = true }}
      onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 72 || Math.abs(info.velocity.x) > 480) onSwipe(info.offset.x < 0 ? -1 : 1) }}
      onTap={() => { if (!dragged.current) onSwipe(-1) }}
      initial={{ scale: 0.95, y: 8, opacity: 0.6 }} animate={{ scale: 1, y: 0, opacity: 1 }}
      variants={{ gone: (d: number) => ({ x: d * 460, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }) }} exit="gone"
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Face({ d, rating, roomy }: { d: DisciplineId; rating: DisciplineRating; roomy?: boolean }) {
  const band = [...BANDS].reverse().find((b) => b.min <= rating.rating)
  return (
    <div
      className="flex h-full select-none flex-col items-center justify-center rounded-card border border-line-strong"
      style={{ background: `color-mix(in oklab, ${dvar(d)} 10%, var(--bg-2))`, boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${dvar(d)} 30%, transparent), var(--shadow-pop)` }}
    >
      <span className="flex items-center gap-2 text-[15px] font-medium"><DisciplineDot id={d} size={8} />{disciplineById[d].name}</span>
      <span className={cx('display num mt-1.5 leading-[0.95]', roomy ? 'text-[104px]' : 'text-[84px]')} style={{ color: dvar(d) }}>{rating.rating || '—'}</span>
      <span className="mt-2 flex items-center gap-2 text-[12.5px] text-ink-2">
        {rating.rating > 0 ? <>{band?.label}<StatusTag status={rating.status} /></> : 'Not rated yet'}
      </span>
    </div>
  )
}
