import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { stageTheme } from '@/theme/cast'
import { THEMES } from '@/theme/themes'
import { useThemeId } from '@/theme/useTheme'
import { cx } from '@/lib/format'
import type { DemoHandle } from '@/visual/Demo'
import { DemoStage } from './DemoSlot'

/**
 * A screen whose background is the exercise being performed.
 *
 * The demonstration fills it. What the screen needs lies over it in two
 * layers: everything (`top`, `bottom`), or, once the athlete wants to watch,
 * only what must never be out of sight (`miniTop`, `miniBottom`): what the
 * exercise is, a clock that is running, and the one thing to press next.
 * Tapping the stage, or the button at its corner, goes from one to the other;
 * dragging across it turns the character round.
 *
 * The layers tell the stage how much they cover, so the character is always
 * in the part that is free, and grows into the room when the controls leave.
 *
 * Use it only where `useHasDemo` says there is an approved demonstration.
 */
export function StageScreen({ exerciseId, official, focus, onFocus, top, bottom, miniTop, miniBottom }: {
  exerciseId: string
  official?: boolean
  /** Watching: only the essential layer is shown. */
  focus: boolean
  onFocus: (on: boolean) => void
  top: ReactNode
  bottom: ReactNode
  miniTop: ReactNode
  miniBottom: ReactNode
}) {
  const theme = stageTheme(useThemeId())
  const refs = { top: useRef<HTMLDivElement>(null), bottom: useRef<HTMLDivElement>(null), miniTop: useRef<HTMLDivElement>(null), miniBottom: useRef<HTMLDivElement>(null) }
  const [sizes, setSizes] = useState({ top: 0, bottom: 0, miniTop: 0, miniBottom: 0 })

  useLayoutEffect(() => {
    const measure = () => setSizes((was) => {
      const next = { top: refs.top.current?.offsetHeight ?? 0, bottom: refs.bottom.current?.offsetHeight ?? 0, miniTop: refs.miniTop.current?.offsetHeight ?? 0, miniBottom: refs.miniBottom.current?.offsetHeight ?? 0 }
      return next.top === was.top && next.bottom === was.bottom && next.miniTop === was.miniTop && next.miniBottom === was.miniBottom ? was : next
    })
    measure()
    const watch = new ResizeObserver(measure)
    for (const r of Object.values(refs)) if (r.current) watch.observe(r.current)
    return () => watch.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // A finger drawn across the stage turns the character; a touch that does not move switches the layers.
  const stage = useRef<DemoHandle>(null)
  const drag = useRef({ x: 0, moved: 0, down: false })

  const cover = focus ? { top: sizes.miniTop, bottom: sizes.miniBottom } : { top: sizes.top, bottom: sizes.bottom }
  const layer = 'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none'

  return (
    <div data-stage-screen data-focus={focus} data-theme={theme} data-scheme={THEMES[theme].scheme} className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-(--stage) text-ink">
      <DemoStage exerciseId={exerciseId} official={official} cover={cover} handle={stage} />

      {/* The stage itself is the switch: touch the character to be left alone with it, touch again for the controls. */}
      <button
        aria-label={focus ? 'Show the controls' : 'Watch the movement full screen'} title="Drag to turn the character" className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
        onPointerDown={(e) => { drag.current = { x: e.clientX, moved: 0, down: true }; e.currentTarget.setPointerCapture(e.pointerId) }}
        onPointerMove={(e) => {
          const d = drag.current
          if (!d.down) return
          const dx = e.clientX - d.x
          d.x = e.clientX
          d.moved += Math.abs(dx)
          if (d.moved > 6) stage.current?.turn(-dx * 0.4)
        }}
        onPointerUp={() => { drag.current.down = false }}
        onPointerCancel={() => { drag.current.down = false }}
        onClick={() => { if (drag.current.moved <= 6) onFocus(!focus); drag.current.moved = 0 }}
      />

      {/* So words can be read over whatever the stage shows. */}
      <div className={cx('pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-(--stage) via-(--stage)/70 to-transparent', layer)} style={{ height: cover.top + 56 }} />
      <div className={cx('pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-(--stage) via-(--stage)/80 to-transparent', layer)} style={{ height: cover.bottom + 72 }} />

      <div ref={refs.top} className={cx('pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto', layer, focus && '-translate-y-3 opacity-0 [&_a]:!pointer-events-none [&_button]:!pointer-events-none')} inert={focus}>{top}</div>
      <div className="pointer-events-none min-h-[120px] flex-1" />
      <div ref={refs.bottom} className={cx('relative z-10', layer, focus && 'pointer-events-none translate-y-6 opacity-0')} inert={focus}>{bottom}</div>

      <div ref={refs.miniTop} className={cx('pointer-events-none absolute inset-x-0 top-0 z-10', layer, !focus && '-translate-y-2 opacity-0')} inert={!focus}>{miniTop}</div>
      <div ref={refs.miniBottom} className={cx('absolute inset-x-0 bottom-0 z-10', layer, !focus && 'pointer-events-none translate-y-4 opacity-0')} inert={!focus}>{miniBottom}</div>

      {/* Always in the same corner of the free part of the stage, in both states. */}
      <button
        onClick={() => onFocus(!focus)} aria-pressed={focus} data-stage-toggle
        className="pressable absolute right-4 z-20 flex h-10 items-center gap-2 rounded-full border border-line-strong bg-(--stage)/60 px-3.5 font-mono text-[10.5px] tracking-[0.1em] text-ink uppercase backdrop-blur-md transition-[bottom] duration-300 ease-out motion-reduce:transition-none"
        style={{ bottom: cover.bottom + 14 }}
      >
        {focus ? <><Minimize2 size={14} /> Controls</> : <><Maximize2 size={14} /> Watch</>}
      </button>
    </div>
  )
}
