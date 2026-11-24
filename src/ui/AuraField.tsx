import type { CSSProperties, ReactNode } from 'react'
import type { DisciplineId } from '@/domain/types'
import { dvar } from '@/lib/format'
import { IgniteRing } from './IgniteRing'

/** Clockwise from the top. Shared by the Aura field and the DNA sigil. */
export const WHEEL: DisciplineId[] = ['handstand', 'push', 'core', 'legs', 'mobility', 'pull']

/** Ignite: how long the ring takes to fill (seconds), how strongly it accelerates, and how long the whole thing lasts until the next screen. */
const IGNITE_FILL = 1.7
const IGNITE_EASE = 2.6
export const IGNITE_SECONDS = 2.75

const EVEN_MIX = Object.fromEntries(WHEEL.map((d) => [d, 1 / 6])) as Record<DisciplineId, number>

interface Props {
  /** Each discipline's share of the athlete's total rating. */
  mix: Record<DisciplineId, number>
  aura: number
  size?: number
  /** 0–1 progress toward the next Aura class, drawn on the outer ring. */
  progress?: number
  rings?: boolean
  /** Ignite: a thick band of light fills the ring in the six colours, clockwise, and the Aura bursts. Plays once when it turns on ("Get started" on the welcome, joining an assessment). */
  ignite?: boolean
  children?: ReactNode
  className?: string
}

/**
 * The Aura itself: a slow field of light whose colours are the athlete's own
 * discipline mix. A handstand specialist glows gold, a puller blue, and an
 * all-rounder resolves toward white. Size and brightness follow the score.
 */
export function AuraField({ mix, aura, size = 320, progress, rings = true, ignite, children, className }: Props) {
  const power = Math.min(1, aura / 9000)
  // An Aura is there at every level and in every theme. With nothing rated yet it is all six colours, evenly and more quietly.
  const none = !(aura > 0)
  const shares = none ? EVEN_MIX : mix
  const quiet = none ? 0.6 : 1
  const active = true
  const reach = 0.17 + power * 0.07
  const style = { width: size, height: size, maxWidth: '100%', '--aura-blur': `${Math.round(size * 0.085)}px` } as CSSProperties
  const r = 47.5
  const circ = 2 * Math.PI * r

  return (
    <div className={`aura-field ${ignite ? 'aura-ignite' : ''} ${className ?? ''}`} style={style} data-ignite={ignite || undefined}>
      {active && (
        <div className="aura-orbit">
          {WHEEL.map((d, i) => {
            const share = shares[d] ?? 0
            if (share <= 0.01) return null
            const angle = ((i * 60 - 90) * Math.PI) / 180
            const diameter = (0.26 + share * 1.35) * (0.72 + power * 0.42)
            return (
              <span
                key={d}
                className="aura-blob"
                style={{
                  left: `${50 + Math.cos(angle) * reach * 100}%`,
                  top: `${50 + Math.sin(angle) * reach * 100}%`,
                  width: `${diameter * 100}%`,
                  height: `${diameter * 100}%`,
                  background: `radial-gradient(circle, ${dvar(d)} 0%, color-mix(in oklab, ${dvar(d)} 55%, transparent) 45%, transparent 72%)`,
                  opacity: `calc(var(--aura-opacity) * ${quiet})`,
                  animationDelay: `${-i * 1.3}s`,
                }}
              />
            )
          })}
        </div>
      )}
      {active && (
        <span
          className="aura-core"
          style={{
            left: '50%',
            top: '50%',
            width: `${30 + power * 18}%`,
            height: `${30 + power * 18}%`,
            // How much of a pale centre a theme takes is the theme's (`--aura-core-level`): on paper it would wash the colour out.
            opacity: `calc(var(--aura-core-level, 1) * ${((0.35 + power * 0.5) * quiet).toFixed(3)})`,
          }}
        />
      )}

      {rings && (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="var(--line)" strokeWidth="0.25" strokeDasharray="0.4 2.2" />
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i * 5 * Math.PI) / 180
            const major = i % 6 === 0
            const r1 = major ? 44.2 : 45.4
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * r1}
                y1={50 + Math.sin(a) * r1}
                x2={50 + Math.cos(a) * 46.6}
                y2={50 + Math.sin(a) * 46.6}
                stroke={major ? 'var(--text-3)' : 'var(--line-strong)'}
                strokeWidth={major ? 0.35 : 0.25}
              />
            )
          })}
          {progress !== undefined && !none && (
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="var(--text)"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeDasharray={`${circ * progress} ${circ}`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 1.2s var(--ease-out-soft)' }}
            />
          )}
        </svg>
      )}
      {/* Ignite: a band of light fills the ring, slowly and then faster, beating as it goes. */}
      {ignite && <IgniteRing order={WHEEL} fill={IGNITE_FILL} ease={IGNITE_EASE} />}
      {ignite && <span className="aura-ignite-wave" aria-hidden />}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

/** A small, still aura used behind avatars and list rows. */
export function AuraDot({ mix, size = 44, children }: { mix: Record<DisciplineId, number>; size?: number; children?: ReactNode }) {
  // Someone with nothing rated yet wears all six colours evenly. A share is never allowed past 100%: a browser throws the whole ring away for that
  // (it did, for anyone with most of their rating in one or two areas).
  const none = WHEEL.every((d) => !(mix[d] > 0))
  const stops = WHEEL.map((d, i) => `color-mix(in oklab, ${dvar(d)} ${Math.min(100, Math.round(35 + (none ? 1 / 6 : mix[d] ?? 0) * 260))}%, var(--surface-3)) ${i * 60}deg`)
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: `conic-gradient(from -30deg, ${stops.join(', ')}, ${stops[0].replace(/ \d+deg$/, ' 360deg')})` }}
    >
      <span
        className="flex items-center justify-center rounded-full bg-surface text-ink"
        style={{ width: size - 5, height: size - 5, fontSize: size * 0.34, fontWeight: 600, letterSpacing: '-0.02em' }}
      >
        {children}
      </span>
    </span>
  )
}
