import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import { Pause, Play, Rotate3d, RotateCcw, Sparkles, Zap } from 'lucide-react'
import { cx } from '@/lib/format'
import { Player, type PerformerSpec, type PlayerState } from './player'
import type { CameraAngle } from './stage'

export interface DemoHandle { /** The Aura let go at once: everyone on stage, or one performer by their place in the cast. */ release: (who?: number) => void; /** The Aura charged, then let go. */ charge: (who?: number) => void; restart: () => void; /** Turns the camera round the subject by so many degrees. */ turn: (degrees: number) => void }

/**
 * A stage with characters on it. Looking round the subject is always the
 * same two things: one 360° button that turns it all the way round, and a
 * finger dragged across it. `spin` is only that, for looking at a character
 * rather than a movement; `simple` adds play and pause, which is what an
 * athlete gets with an exercise; `review` adds what an administrator needs
 * to inspect a movement (scrub, slow motion, looking from above, the Aura on
 * demand).
 *
 * This file brings in the 3D engine: load it lazily.
 */
export default function Demo({ cast, ratio = 1, controls = 'simple', margin, angle: opening, className, handle, label, fill, safe, activate, calling, onActivate }: {
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
  /** Fills its parent instead of having a shape of its own: a stage behind a whole screen. */
  fill?: boolean
  /** With `fill`: how much of it the screen's controls cover from the top and the bottom, in pixels. The subject is kept between them. */
  safe?: { top: number; bottom: number }
  /** An Activate button on the stage: at rest an Aura is a glow, and this charges it and lets it burst. Shown only while someone on stage wears an Aura. */
  activate?: 'small' | 'large'
  /** The Activate button glows, asking to be pressed. */
  calling?: boolean
  /** It has been pressed. */
  onActivate?: () => void
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const player = useRef<Player | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [state, setState] = useState<PlayerState | null>(null)
  const [playing, setPlaying] = useState(true)
  const [slow, setSlow] = useState(false)
  const key = JSON.stringify(cast)
  const safeRef = useRef(safe)
  safeRef.current = safe
  const shown = useRef(false)
  shown.current = ready
  // What covers the stage changes as a screen's controls come and go: the subject glides to its new place, except before it has been seen at all.
  useEffect(() => {
    if (safe) player.current?.setSafeArea(safe.top, safe.bottom, !shown.current)
  }, [safe?.top, safe?.bottom]) // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(handle, () => ({ release: (who) => player.current?.release(who), charge: (who) => player.current?.charge(who), restart: () => { player.current?.restart(); setPlaying(true) }, turn: (degrees) => player.current?.turn(degrees) }), [])

  useEffect(() => {
    const el = box.current
    const cv = canvas.current
    if (!el || !cv) return
    let p: Player
    try { p = new Player(cv) } catch { setFailed(true); return }
    player.current = p
    if (margin) p.margin = margin
    if (safeRef.current) p.setSafeArea(safeRef.current.top, safeRef.current.bottom, true)
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
      p.update(specs)
    }
  }, [key, margin, opening])

  const drag = useRef<{ x: number; y: number } | null>(null)
  /** Dragging looks round the subject: sideways for an athlete, from above as well in a review. */
  const orbit = controls !== 'none'
  const level = controls !== 'review'

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

  // Activate: pressed, the button holds while the Aura charges and bursts, then is ready again.
  const [charging, setCharging] = useState(false)
  const activateNow = () => {
    const p = player.current
    if (!p || charging) return
    p.charge()
    setCharging(true)
    onActivate?.()
    const wait = () => { if (player.current && player.current.charging) window.setTimeout(wait, 150); else setCharging(false) }
    window.setTimeout(wait, 400)
  }
  const wearsAura = cast.some((c) => c.aura.mode !== 'off')
  const spinButton = (look: string) => (
    <button
      aria-label={turning ? 'Stop turning' : 'Turn the character all the way round'} aria-pressed={turning} title="Turn all the way round. You can also drag the character."
      onClick={turnRound}
      className={cx('pointer-events-auto flex items-center gap-1.5 rounded-full px-3.5 font-mono text-[11px] tracking-[0.06em] backdrop-blur-md transition-colors', turning ? 'bg-white text-black' : cx('text-white', look))}
    >
      <Rotate3d size={17} className={cx(turning && 'animate-spin [animation-duration:3.4s]')} />360°
    </button>
  )

  return (
    <div ref={box} className={cx(fill ? 'absolute inset-0 overflow-hidden bg-(--stage)' : 'relative w-full overflow-hidden rounded-card border border-line bg-(--stage)', className)} style={fill ? undefined : { aspectRatio: String(ratio) }}>
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

      {/* Calling, its glow lies behind the button and over the stage: the wrapper holds the two together (`isolate`). */}
      {activate && wearsAura && ready && (
        <span
          data-calling={(calling && !charging) || undefined}
          className={cx('absolute isolate rounded-full', calling && !charging && 'aura-call', activate === 'large' ? (calling ? 'bottom-5 left-5' : 'bottom-3 left-3') : 'bottom-2 left-1/2 -translate-x-1/2')}
        >
        <button
          onClick={activateNow} aria-label="Activate the Aura" data-activate={charging ? 'charging' : 'ready'}
          className={cx(
            'flex items-center rounded-full font-semibold tracking-[0.04em] text-black transition-[transform,box-shadow,background-color] duration-300 active:scale-95',
            activate === 'large' ? 'h-11 gap-2 px-4 text-[13px]' : 'h-7 gap-1 px-2.5 text-[10.5px]',
            charging ? 'scale-105 bg-white shadow-[0_0_26px_6px_rgba(255,255,255,0.55)]' : 'bg-white/90 shadow-[0_0_14px_1px_rgba(255,255,255,0.25)] hover:bg-white',
          )}
        >
          <Zap size={activate === 'large' ? 16 : 11} fill="currentColor" className={cx(charging && 'animate-pulse')} />
          {charging ? 'Charging' : 'Activate'}
        </button>
        </span>
      )}
      {/* With part of the stage covered, the button stays in the part that is free. */}
      {controls === 'spin' && ready && <div className="absolute right-3 transition-[bottom] duration-300 ease-out" style={{ bottom: (fill && safe ? safe.bottom : 0) + 12 }}>{spinButton('h-11 bg-black/45 hover:bg-black/60')}</div>}
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
                {cast.some((c) => c.aura.mode !== 'off') && <button onClick={() => player.current?.charge()} className="pointer-events-auto flex h-9 items-center gap-1.5 rounded-full bg-white/14 px-3 font-mono text-[11px] text-white backdrop-blur-md hover:bg-white/22"><Sparkles size={12} />Activate</button>}
              </>
            )}
            <div className="ml-auto">{spinButton('h-9 bg-white/14 hover:bg-white/22')}</div>
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
