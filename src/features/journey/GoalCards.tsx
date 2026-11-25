import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { Check, RotateCw, X } from 'lucide-react'
import { disciplineById, exerciseById, skillById } from '@/domain/catalog'
import { GOALS, MAX_GOALS, acceptGoal, declineGoal } from '@/domain/goals'
import { DemoPreview, preloadDemos, useHasDemo } from '@/features/library/DemoSlot'
import { MuscleMap } from '@/ui/MuscleMap'
import { DisciplineDot } from '@/ui/primitives'
import { useStore } from '@/data/store'
import { tick } from '@/lib/sound'
import { cx, dvar } from '@/lib/format'

interface Box { left: number; top: number; width: number; height: number }

const EASE = [0.3, 0.9, 0.25, 1] as const
const TURN = 0.72

/** The front of a goal: what it is called, and whether it is one. */
function Face({ id, on, order, className }: { id: string; on: boolean; order?: number; className?: string }) {
  const s = skillById[id]
  const color = dvar(s.discipline)
  return (
    <span
      className={cx('relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[22px] border p-4 text-left', on ? 'border-transparent' : 'border-line-strong', className)}
      style={{
        background: `radial-gradient(120% 90% at 100% 0%, color-mix(in oklab, ${color} ${on ? 34 : 11}%, transparent), transparent 70%), ${on ? `color-mix(in oklab, ${color} 14%, var(--surface))` : 'var(--surface)'}`,
        boxShadow: on ? `inset 0 0 0 1.5px ${color}` : undefined,
      }}
    >
      <span className="flex items-center justify-between text-[13px] text-ink-2">
        <span className="flex items-center gap-2"><DisciplineDot id={s.discipline} size={8} />{disciplineById[s.discipline].short}</span>
        {on
          ? <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: color, color: 'var(--bg)' }}>{order ? <span className="num text-[12px] font-semibold">{order}</span> : <Check size={14} strokeWidth={3} />}</span>
          : <RotateCw size={14} className="text-ink-3" aria-hidden />}
      </span>
      <span className="display mt-3 text-[25px] leading-[1.04]">{s.name}</span>
    </span>
  )
}

/**
 * Goals, chosen by looking at them. Touching a card lifts it off the page and
 * turns it over: on its back the exercise is being performed, with two
 * answers under it. Either one turns the card back and lays it where it was.
 * Nothing is chosen by accident, and nobody chooses a name they have never
 * seen done.
 */
export function GoalCards({ options = GOALS, value, onChange, official }: {
  options?: string[]
  value: string[]
  onChange: (goals: string[]) => void
  /** Shown the standard way (the welcome, where nobody has a look of their own yet). */
  official?: boolean
}) {
  const cards = useRef<Record<string, HTMLButtonElement | null>>({})
  const [open, setOpen] = useState<{ id: string; from: Box } | null>(null)
  const [landed, setLanded] = useState<string | null>(null)
  // The 3D engine is fetched while the cards are being read, so the first one turned has it.
  useEffect(() => { preloadDemos() }, [])

  const boxOf = (id: string): Box => {
    const r = cards.current[id]!.getBoundingClientRect()
    return { left: r.left, top: r.top, width: r.width, height: r.height }
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-3" data-goals>
        {options.map((g) => {
          const on = value.includes(g)
          const away = open?.id === g
          return (
            <motion.button
              key={g} ref={(el) => { cards.current[g] = el }} data-goal={g} aria-pressed={on} aria-haspopup="dialog"
              onClick={() => setOpen({ id: g, from: boxOf(g) })}
              animate={landed === g && on ? { scale: [1, 1.035, 1] } : { scale: 1 }} transition={{ duration: 0.42, ease: EASE }}
              className={cx('relative block min-h-[132px] rounded-[22px]', !away && 'pressable', away && 'invisible')}
            >
              <Face id={g} on={on} order={on ? value.indexOf(g) + 1 : undefined} />
              {landed === g && on && (
                <motion.span
                  key={`ring-${value.length}`} className="pointer-events-none absolute inset-0 rounded-[22px]" style={{ boxShadow: `0 0 0 2px ${dvar(skillById[g].discipline)}, 0 0 34px ${dvar(skillById[g].discipline)}` }}
                  initial={{ opacity: 0.9, scale: 1 }} animate={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.75, ease: 'easeOut' }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
      {open && (
        <Turned
          id={open.id} from={open.from} on={value.includes(open.id)} order={value.indexOf(open.id) + 1} full={value.length >= MAX_GOALS && !value.includes(open.id)} official={official}
          back={() => boxOf(open.id)}
          onAnswer={(yes) => onChange(yes ? acceptGoal(value, open.id) : declineGoal(value, open.id))}
          onClosed={() => { setLanded(open.id); setOpen(null); cards.current[open.id]?.focus({ preventScroll: true }) }}
        />
      )}
    </>
  )
}

/** One card, lifted off the page and turned over. */
function Turned({ id, from, on, order, full, official, back, onAnswer, onClosed }: {
  id: string
  from: Box
  on: boolean
  order: number
  full: boolean
  official?: boolean
  back: () => Box
  onAnswer: (yes: boolean) => void
  onClosed: () => void
}) {
  const still = useReducedMotion()
  const s = skillById[id]
  const ex = exerciseById[s.exerciseId]
  const color = dvar(s.discipline)
  const sound = useStore((st) => st.settings.sound)
  const animated = useHasDemo(ex.id)

  // Where it comes to rest: in the middle, as large as a phone lets it be.
  const [rest] = useState<Box>(() => {
    const w = Math.min(window.innerWidth - 36, 420), h = Math.min(window.innerHeight - 48, Math.max(440, window.innerHeight * 0.78), 660)
    return { left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, width: w, height: h }
  })
  // One number carries all of it: 0 lying in the grid face up, 1 in the middle with its back up.
  const t = useMotionValue(0)
  const home = useRef(from)
  const left = useTransform(t, (v) => home.current.left + (rest.left - home.current.left) * v)
  const top = useTransform(t, (v) => home.current.top + (rest.top - home.current.top) * v - Math.sin(Math.min(1, Math.max(0, v)) * Math.PI) * 18)
  const width = useTransform(t, (v) => home.current.width + (rest.width - home.current.width) * v)
  const height = useTransform(t, (v) => home.current.height + (rest.height - home.current.height) * v)
  const rotateY = useTransform(t, (v) => v * 180)
  const rotateZ = useTransform(t, (v) => Math.sin(Math.min(1, Math.max(0, v)) * Math.PI) * -2.5)
  const scrim = useTransform(t, [0, 0.7], [0, 1])
  const shade = useTransform(t, (v) => `0 ${18 + 40 * v}px ${30 + 70 * v}px -24px rgba(0,0,0,${0.35 + 0.4 * v})`)

  const [stage, setStage] = useState(false)
  const [answer, setAnswer] = useState<boolean | null>(null)
  const leaving = useRef(false)
  /** As it was when turned: the answers must not change their words under the finger. */
  const [was] = useState({ on, full })
  useEffect(() => {
    const run = animate(t, 1, still ? { duration: 0 } : { duration: TURN, ease: EASE })
    // The stage goes up as the back comes round: before that it would only slow the turn.
    const up = window.setTimeout(() => setStage(true), still ? 0 : TURN * 620)
    return () => { run.stop(); clearTimeout(up) }
  }, [t, still])

  const close = () => {
    if (leaving.current) return
    leaving.current = true
    home.current = back()
    void animate(t, 0, still ? { duration: 0 } : { duration: TURN * 0.86, ease: [0.5, 0, 0.2, 1] }).then(onClosed)
  }
  const say = (yes: boolean) => {
    if (leaving.current || answer !== null || (yes && was.full)) return
    setAnswer(yes)
    onAnswer(yes)
    navigator.vibrate?.(yes ? 14 : 8)
    if (yes && sound) tick()
    window.setTimeout(close, still ? 0 : yes ? 360 : 130)
  }

  const closer = useRef(close)
  closer.current = close
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') closer.current() }
    document.addEventListener('keydown', key)
    const was = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = was }
  }, [])

  // The words and the answers lie over the stage; the athlete is kept in what they leave.
  const head = useRef<HTMLDivElement>(null)
  const foot = useRef<HTMLDivElement>(null)
  const [safe, setSafe] = useState({ top: 100, bottom: 190 })
  useLayoutEffect(() => {
    if (head.current && foot.current) setSafe({ top: head.current.offsetHeight - 18, bottom: foot.current.offsetHeight - 34 })
  }, [])
  const yes = useRef<HTMLButtonElement>(null)
  useEffect(() => { yes.current?.focus({ preventScroll: true }) }, [])

  const side = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' } as const
  return createPortal(
    <div className="fixed inset-0 z-50" style={{ perspective: 1500 }} role="dialog" aria-modal="true" aria-label={s.name} data-goal-open={id}>
      <motion.div className="absolute inset-0 bg-black/72 backdrop-blur-[6px]" style={{ opacity: scrim }} onClick={close} />
      {/* Its colour, as light on what is behind it. */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: scrim, background: `radial-gradient(60% 44% at 50% 50%, color-mix(in oklab, ${color} 30%, transparent), transparent 72%)` }} />
      <motion.div className="absolute rounded-[26px]" style={{ left, top, width, height, rotateY, rotateZ, transformStyle: 'preserve-3d', boxShadow: shade }}>
        <div className="absolute inset-0" style={side} aria-hidden><Face id={id} on={on} order={on ? order : undefined} className="!rounded-[26px]" /></div>

        <div className="absolute inset-0 overflow-hidden rounded-[26px] bg-(--stage)" style={{ ...side, transform: 'rotateY(180deg)' }}>
          {/* At its full size from the start, seen through the card as it grows: a stage that is resized at every step stutters. */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: rest.width, height: rest.height }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(70% 50% at 50% 46%, color-mix(in oklab, ${color} 34%, transparent), transparent 75%)` }}>
              <motion.span className="absolute top-[44%] left-1/2 h-16 w-16 rounded-full" style={{ x: '-50%', y: '-50%', background: color, filter: 'blur(18px)' }} animate={still ? { opacity: 0.5 } : { opacity: [0.25, 0.7, 0.25], scale: [0.9, 1.25, 0.9] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
            </div>
            {stage && (
              <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} data-goal-stage>
                {animated
                  ? <DemoPreview exerciseId={ex.id} official={official} safe={safe} />
                  : <div className="flex h-full items-center justify-center pb-24"><MuscleMap primary={ex.primary} secondary={ex.secondary} stabilizers={ex.stabilizers} color={color} height={210} /></div>}
              </motion.div>
            )}

            <div ref={head} className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-(--stage) via-(--stage)/75 to-transparent px-5 pt-5 pb-9">
              <div className="flex items-center gap-2 text-[13px] text-white/70"><DisciplineDot id={s.discipline} size={8} />{disciplineById[s.discipline].name}</div>
              <h2 className="display mt-1 text-[32px] leading-[1.02] text-white">{s.name}</h2>
            </div>

            <div ref={foot} className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-(--stage) via-(--stage)/88 to-transparent px-5 pt-14 pb-5">
              <p className="pointer-events-none line-clamp-2 text-center text-[13.5px] leading-snug text-white/75">{was.full ? 'You have three. Take one off first to choose this one.' : ex.summary}</p>
              <div className="mt-4 flex items-start justify-center gap-12">
                <Answer label={was.on ? 'Remove' : 'Not now'} onClick={() => say(false)} chosen={answer === false} data="no"><X size={26} strokeWidth={2.2} /></Answer>
                <Answer innerRef={yes} label={was.on ? 'Keep it' : 'My goal'} onClick={() => say(true)} chosen={answer === true} disabled={was.full} color={color} data="yes"><Check size={28} strokeWidth={2.8} /></Answer>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}

function Answer({ label, onClick, chosen, disabled, color, data, innerRef, children }: { label: string; onClick: () => void; chosen: boolean; disabled?: boolean; color?: string; data: string; innerRef?: React.Ref<HTMLButtonElement>; children: React.ReactNode }) {
  return (
    <button ref={innerRef} data-answer={data} onClick={onClick} disabled={disabled} className="group flex w-[76px] flex-col items-center gap-1.5 text-white outline-none disabled:opacity-35">
      <span className="relative flex h-[62px] w-[62px] items-center justify-center">
        {chosen && color && <motion.span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${color}` }} initial={{ scale: 1, opacity: 0.9 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} />}
        <motion.span
          className={cx('flex h-full w-full items-center justify-center rounded-full transition-transform group-active:scale-90 group-focus-visible:ring-2 group-focus-visible:ring-white/70', !color && 'border border-white/30 bg-white/10 backdrop-blur-md')}
          style={color ? { background: color, color: '#0b0b0d', boxShadow: `0 8px 30px -6px ${color}` } : undefined}
          animate={chosen ? { scale: [1, 1.16, 1] } : { scale: 1 }} transition={{ duration: 0.32 }}
        >
          {children}
        </motion.span>
      </span>
      <span className="text-[12.5px] font-medium">{label}</span>
    </button>
  )
}
