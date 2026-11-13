import { useId } from 'react'
import type { DisciplineId } from '@/domain/types'
import { disciplineById } from '@/domain/catalog'
import { dvar } from '@/lib/format'
import { WHEEL } from './AuraField'

interface Props {
  ratings: Record<DisciplineId, number>
  size?: number
  labels?: boolean
  /** A second athlete drawn as an outline for comparison. */
  ghost?: Record<DisciplineId, number>
  onSelect?: (d: DisciplineId) => void
}

const C = 150

const point = (i: number, radius: number): [number, number] => {
  const a = ((i * 60 - 90) * Math.PI) / 180
  return [C + Math.cos(a) * radius, C + Math.sin(a) * radius]
}

/** Closed Catmull-Rom spline through the points, as cubic Béziers. */
function smoothPath(pts: [number, number][], tension = 0.42) {
  const n = pts.length
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) * tension * 0.5, p1[1] + (p2[1] - p0[1]) * tension * 0.5]
    const c2 = [p2[0] - (p3[0] - p1[0]) * tension * 0.5, p2[1] - (p3[1] - p1[1]) * tension * 0.5]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return `${d}Z`
}

/**
 * Athlete DNA: the shape of an athlete's capability. Each axis is a discipline;
 * the form is filled with the same colours that light their Aura, so two
 * athletes with the same score still look nothing alike.
 */
export function DnaSigil({ ratings, size = 300, labels = true, ghost, onSelect }: Props) {
  const id = useId().replace(/:/g, '')
  const values = WHEEL.map((d) => ratings[d] ?? 0)
  const ghostValues = ghost ? WHEEL.map((d) => ghost[d] ?? 0) : []
  const top = Math.max(...values, ...ghostValues, 1)
  const scaleMax = Math.max(400, Math.ceil(top / 200) * 200)
  const R = labels ? 96 : 132
  const radius = (v: number) => Math.max(0.07, v / scaleMax) * R
  const pts = values.map((v, i) => point(i, radius(v)))
  const shape = smoothPath(pts)
  const ghostShape = ghost ? smoothPath(ghostValues.map((v, i) => point(i, radius(v)))) : null
  const ringStep = scaleMax <= 600 ? 200 : scaleMax <= 1000 ? 200 : 400
  const rings = Array.from({ length: Math.floor(scaleMax / ringStep) }, (_, i) => (i + 1) * ringStep)

  return (
    <svg viewBox={labels ? '-22 0 344 300' : '0 0 300 300'} width={size} height={labels ? Math.round((size * 300) / 344) : size} style={{ maxWidth: '100%', height: 'auto' }} role="img" aria-label="Athlete DNA">
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d={shape} />
        </clipPath>
        <filter id={`blur-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={labels ? 13 : 18} />
        </filter>
        <radialGradient id={`fade-${id}`}>
          <stop offset="0" stopColor="var(--surface)" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="var(--surface)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {labels &&
        rings.map((v) => (
          <path
            key={v}
            d={smoothPath(WHEEL.map((_, i) => point(i, (v / scaleMax) * R)), 0)}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}
      {labels &&
        WHEEL.map((d, i) => {
          const [x, y] = point(i, R)
          return <line key={d} x1={C} y1={C} x2={x} y2={y} stroke="var(--line)" strokeWidth="1" />
        })}
      {labels &&
        rings.map((v) => (
          <text key={v} x={C + 4} y={C - (v / scaleMax) * R + 9} fontSize="7.5" fill="var(--text-3)" fontFamily="var(--font-mono)">
            {v}
          </text>
        ))}

      <g clipPath={`url(#clip-${id})`}>
        <g filter={`url(#blur-${id})`}>
          {WHEEL.map((d, i) => {
            const a = point(i - 0.5, 220)
            const b = point(i + 0.5, 220)
            return <path key={d} d={`M${C} ${C}L${a[0]} ${a[1]}L${b[0]} ${b[1]}Z`} fill={dvar(d)} />
          })}
        </g>
        <circle cx={C} cy={C} r={R} fill={`url(#fade-${id})`} />
      </g>
      <path d={shape} fill="none" stroke="var(--text)" strokeOpacity="0.85" strokeWidth={labels ? 1.2 : 3} strokeLinejoin="round" />

      {ghostShape && (
        <path d={ghostShape} fill="none" stroke="var(--text)" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="3 4" />
      )}

      {labels &&
        WHEEL.map((d, i) => {
          const [x, y] = pts[i]
          const [lx, ly] = point(i, R + 24)
          const anchor = Math.abs(lx - C) < 8 ? 'middle' : lx > C ? 'start' : 'end'
          const dy = i === 0 ? -8 : i === 3 ? 12 : 2
          return (
            <g key={d} onClick={onSelect ? () => onSelect(d) : undefined} style={onSelect ? { cursor: 'pointer' } : undefined}>
              <circle cx={x} cy={y} r="3.2" fill="var(--bg)" stroke={dvar(d)} strokeWidth="1.6" />
              <text x={lx} y={ly + dy - 6} textAnchor={anchor} fontSize="8.5" letterSpacing="1.1" fill="var(--text-3)" fontFamily="var(--font-mono)">
                {disciplineById[d].short.toUpperCase()}
              </text>
              <text x={lx} y={ly + dy + 9} textAnchor={anchor} fontSize="15" fill="var(--text)" fontFamily="var(--font-display)">
                {values[i] || '—'}
              </text>
            </g>
          )
        })}
    </svg>
  )
}
