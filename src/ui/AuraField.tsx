import type { CSSProperties, ReactNode } from 'react'
import type { DisciplineId } from '@/domain/types'
import { dvar } from '@/lib/format'

/** Clockwise from the top. Shared by the Aura field and the DNA sigil. */
export const WHEEL: DisciplineId[] = ['handstand', 'push', 'core', 'legs', 'mobility', 'pull']

interface Props {
  /** Each discipline's share of the athlete's total rating. */
  mix: Record<DisciplineId, number>
  aura: number
  size?: number
  /** 0–1 progress toward the next Aura class, drawn on the outer ring. */
  progress?: number
  rings?: boolean
  /** Ignite: the outer ring fills with the six colours, clockwise, and the Aura bursts. Plays once when it turns on (the welcome's "Get started"). */
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
  const active = aura > 0
  const reach = 0.17 + power * 0.07
  const style = { width: size, height: size, maxWidth: '100%', '--aura-blur': `${Math.round(size * 0.085)}px` } as CSSProperties
  const r = 47.5
  const circ = 2 * Math.PI * r

  return (
    <div className={`aura-field ${ignite ? 'aura-ignite' : ''} ${className ?? ''}`} style={style} data-ignite={ignite || undefined}>
      {active && (
        <div className="aura-orbit">
          {WHEEL.map((d, i) => {
            const share = mix[d] ?? 0
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
            opacity: 0.35 + power * 0.5,
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
          {progress !== undefined && active && (
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
          {/* Ignite: the border round the clock fills, one discipline's colour after another. */}
          {ignite && WHEEL.map((d, i) => {
            const at = (deg: number) => { const a = ((deg - 90) * Math.PI) / 180; return `${50 + Math.cos(a) * r} ${50 + Math.sin(a) * r}` }
            return (
              <path
                key={d} d={`M ${at(i * 60)} A ${r} ${r} 0 0 1 ${at(i * 60 + 60.5)}`} pathLength={1}
                className="aura-ignite-arc" fill="none" stroke={dvar(d)} strokeWidth="1.3" strokeLinecap="round"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            )
          })}
        </svg>
      )}
      {ignite && <span className="aura-ignite-wave" aria-hidden />}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

/** A small, still aura used behind avatars and list rows. */
export function AuraDot({ mix, size = 44, children }: { mix: Record<DisciplineId, number>; size?: number; children?: ReactNode }) {
  const stops = WHEEL.map((d, i) => `color-mix(in oklab, ${dvar(d)} ${Math.round(35 + (mix[d] ?? 0) * 260)}%, var(--surface-3)) ${i * 60}deg`)
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
