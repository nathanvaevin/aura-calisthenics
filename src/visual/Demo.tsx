import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import { Pause, Play, Rotate3d, RotateCcw, Sparkles } from 'lucide-react'
import { cx } from '@/lib/format'
import { Player, type PerformerSpec, type PlayerState } from './player'
import type { CameraAngle } from './stage'

export interface DemoHandle { release: () => void; restart: () => void }

const ANGLES: { value: CameraAngle; label: string }[] = [
  { value: 'front', label: 'Front' }, { value: 'three-quarter', label: '¾' }, { value: 'side', label: 'Side' }, { value: 'back', label: 'Back' },
]

/**
 * A stage with characters on it. `simple` is what an athlete gets (play,
 * pause, camera angle); `spin` is for looking at a character rather than a
 * movement (one button that turns it all the way round, and it follows a
 * finger dragged across it); `review` adds what an administrator needs to inspect
 * a movement (scrub, slow motion, drag to look round, the release on demand).
 *
 * This file brings in the 3D engine: load it lazily.
 */
export default function Demo({ cast, ratio = 1, controls = 'simple', margin, angle: opening, className, handle, label }: {
  cast: PerformerSpec[]
  /** Width over height of the stage. */
  ratio?: number
  controls?: 'none' | 'simple' | 'spin' | 'review'
  /** Space round the subject; more when an Aura needs room. */
  margin?: number
  /** The camera angle to open on, where it is not the movement's own. */
  angle?: CameraAngle
  className?: string
  handle?: Ref<DemoHandle>
  label?: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const player = useRef<Player | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [state, setState] = useState<PlayerState | null>(null)
  const [playing, setPlaying] = useState(true)
  const [angle, setAngle] = useState<CameraAngle | null>(null)
  const [slow, setSlow] = useState(false)
  const key = JSON.stringify(cast)

  useImperativeHandle(handle, () => ({ release: () => player.current?.release(), restart: () => { player.current?.restart(); setPlaying(true) } }), [])

  useEffect(() => {
    const el = box.current
    const cv = canvas.current
    if (!el || !cv) return
    let p: Player
    try { p = new Player(cv) } catch { setFailed(true); return }
    player.current = p
    if (margin) p.margin = margin
    p.onState = setState
    const size = () => p.resize(el.clientWidth, el.clientHeight)
    size()
    const resize = new ResizeObserver(size)
    resize.observe(el)
    const seen = new IntersectionObserver(([entry]) => p.setActive(entry.isIntersecting && !document.hidden), { threshold: 0.05 })
    seen.observe(el)
    const hidden = () => p.setActive(!document.hidden)
    document.addEventListener('visibilitychange', hidden)
    if (import.meta.env.DEV) (window as unknown as { __player?: Player }).__player = p
    return () => {
      resize.disconnect(); seen.disconnect()
      document.removeEventListener('visibilitychange', hidden)
      player.current = null
      p.dispose()
    }
  }, [margin])

  // The cast is compared by value: a parent re-rendering with the same settings changes nothing here.
  const loaded = useRef<Player | null>(null)
  useEffect(() => {
    const p = player.current
    if (!p) return
    const specs = JSON.parse(key) as PerformerSpec[]
    if (loaded.current !== p) {
      loaded.current = p
      setReady(false)
      p.setCast(specs).then(() => { if (player.current !== p) return; if (opening) p.reframe(opening); setReady(true) }, () => setFailed(true))
    } else {
      setAngle(null)
      p.update(specs)
    }
  }, [key, margin, opening])

  const drag = useRef<{ x: number; y: number } | null>(null)
  /** Dragging looks round the subject: freely in a review, sideways only where the point is to turn a character. */
  const orbit = controls === 'review' || controls === 'spin'
  const level = controls === 'spin'

  // One full turn, eased in and out. Pressing again, or taking hold of the character, stops it where it is.
  const [turning, setTurning] = useState(false)
  const spin = useRef(0)
  const stopTurn = () => { cancelAnimationFrame(spin.current); spin.current = 0; setTurning(false) }
  const turnRound = () => {
    if (spin.current) return stopTurn()
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const length = still ? 0 : 3400
    const from = performance.now()
    let done = 0
    setTurning(true)
    const step = (now: number) => {
      const u = length ? Math.min(1, (now - from) / length) : 1
      const eased = (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2) * 360
      player.current?.turn(eased - done)
      done = eased
      if (u < 1 && player.current) spin.current = requestAnimationFrame(step)
      else stopTurn()
    }
    spin.current = requestAnimationFrame(step)
  }
  useEffect(() => () => cancelAnimationFrame(spin.current), [])

  return (
    <div ref={box} className={cx('relative w-full overflow-hidden rounded-card border border-line bg-(--stage)', className)} style={{ aspectRatio: String(ratio) }}>
      <canvas
        ref={canvas} role="img" aria-label={label ?? 'Animated demonstration'}
        className={cx('block h-full w-full transition-opacity duration-500', ready ? 'opacity-100' : 'opacity-0', orbit && 'cursor-grab active:cursor-grabbing', orbit && (level ? 'touch-pan-y' : 'touch-none'))}
        onPointerDown={orbit ? (e) => { if (spin.current) stopTurn(); drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId) } : undefined}
        onPointerMove={orbit ? (e) => { if (!drag.current) return; player.current?.orbit(e.clientX - drag.current.x, level ? 0 : e.clientY - drag.current.y); drag.current = { x: e.clientX, y: e.clientY } } : undefined}
        onPointerUp={orbit ? () => { drag.current = null } : undefined}
        onPointerCancel={orbit ? () => { drag.current = null } : undefined}
        onWheel={orbit && !level ? (e) => player.current?.zoom(e.deltaY > 0 ? 1.06 : 0.94) : undefined}
      />
      {!ready && !failed && <div className="absolute inset-0 flex items-center justify-center font-mono text-[10.5px] tracking-[0.14em] text-(--stage-ink) uppercase">Loading</div>}
      {failed && <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-[13px] text-(--stage-ink)">This device could not start the 3D view.</div>}

      {controls === 'spin' && ready && (
        <button
          aria-label={turning ? 'Stop turning' : 'Turn the character all the way round'} aria-pressed={turning} title="Turn all the way round. You can also drag the character."
          onClick={turnRound}
          className={cx('absolute right-3 bottom-3 flex h-11 items-center gap-1.5 rounded-full px-3.5 font-mono text-[11px] tracking-[0.06em] backdrop-blur-md transition-colors', turning ? 'bg-white text-black' : 'bg-black/45 text-white hover:bg-black/60')}
        >
          <Rotate3d size={17} className={cx(turning && 'animate-spin [animation-duration:3.4s]')} />360°
        </button>
      )}
      {controls !== 'none' && controls !== 'spin' && ready && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/55 to-transparent p-3 pt-10">
          {controls === 'review' && state && (
            <input
              type="range" min={0} max={state.length} step={0.01} value={state.phase === 'settle' ? state.length : state.time} aria-label="Position in the set"
              onChange={(e) => { player.current?.pause(); setPlaying(false); player.current?.seek(Number(e.target.value)) }}
              className="pointer-events-auto h-1 w-full cursor-pointer accent-white"
            />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={() => { const p = player.current; if (!p) return; if (playing) p.pause(); else p.play(); setPlaying(!playing) }}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/14 text-white backdrop-blur-md hover:bg-white/22"
            >
              {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
            </button>
            {controls === 'review' && (
              <>
                <button aria-label="Replay" onClick={() => { player.current?.restart(); setPlaying(true) }} className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/14 text-white backdrop-blur-md hover:bg-white/22"><RotateCcw size={14} /></button>
                <button onClick={() => { player.current?.setSpeed(slow ? 1 : 0.35); setSlow(!slow) }} className={cx('pointer-events-auto flex h-9 items-center rounded-full px-3 font-mono text-[11px] backdrop-blur-md', slow ? 'bg-white text-black' : 'bg-white/14 text-white hover:bg-white/22')}>Slow</button>
                {cast.some((c) => c.aura.mode !== 'off') && <button onClick={() => player.current?.release()} className="pointer-events-auto flex h-9 items-center gap-1.5 rounded-full bg-white/14 px-3 font-mono text-[11px] text-white backdrop-blur-md hover:bg-white/22"><Sparkles size={12} />Aura burst</button>}
              </>
            )}
            <div className="pointer-events-auto ml-auto flex rounded-full bg-white/14 p-0.5 backdrop-blur-md">
              {ANGLES.map((a) => (
                <button key={a.value} onClick={() => { setAngle(a.value); player.current?.reframe(a.value) }} className={cx('h-8 rounded-full px-2.5 text-[11.5px] font-medium', angle === a.value ? 'bg-white text-black' : 'text-white/80 hover:text-white')}>{a.label}</button>
              ))}
            </div>
          </div>
          {controls === 'review' && state && (
            <div className="num flex justify-between font-mono text-[10px] tracking-[0.08em] text-white/50 uppercase">
              <span>{state.phase === 'settle' ? 'Release' : `${state.time.toFixed(1)} s of ${state.length.toFixed(1)}`}</span>
              <span>{Math.round(state.fps)} frames/s · drag to look round</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
