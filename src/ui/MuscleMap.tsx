import type { ReactElement } from 'react'
import type { MuscleId } from '@/domain/types'
import { MUSCLES } from '@/domain/catalog'

interface Props {
  primary?: MuscleId[]
  secondary?: MuscleId[]
  stabilizers?: MuscleId[]
  /** Highlight colour, usually the discipline colour. */
  color?: string
  selected?: MuscleId | null
  onSelect?: (m: MuscleId) => void
  height?: number
  className?: string
}

type Shape = { m: MuscleId; el: ReactElement; mirror?: boolean }

/* One half of each paired muscle is drawn; the other is mirrored about x = 60. */
const FRONT: Shape[] = [
  { m: 'traps', mirror: true, el: <path d="M54.5 31.5 L54.5 40 L40 41.2 Z" /> },
  { m: 'delts', mirror: true, el: <ellipse cx="34" cy="49.5" rx="7.8" ry="9.6" transform="rotate(-20 34 49.5)" /> },
  { m: 'chest', mirror: true, el: <path d="M59 43 H47 Q40.5 44 40 51 Q40 59 48 61 Q54.5 62 59 59 Z" /> },
  { m: 'biceps', mirror: true, el: <ellipse cx="28.6" cy="70.5" rx="5.5" ry="11.8" transform="rotate(8 28.6 70.5)" /> },
  { m: 'forearms', mirror: true, el: <ellipse cx="23.6" cy="97" rx="4.8" ry="13.4" transform="rotate(9 23.6 97)" /> },
  { m: 'serratus', mirror: true, el: <path d="M41.2 62.5 L47.4 64.2 L47 75 L42.6 72.6 Z" /> },
  { m: 'obliques', mirror: true, el: <path d="M47.4 77 L47.8 104.5 Q43.4 101 42.6 92 L42.6 75.4 Z" /> },
  { m: 'abs', el: <rect x="49.4" y="63.5" width="21.2" height="42" rx="7" /> },
  { m: 'hip_flexors', mirror: true, el: <path d="M48 107.4 H59 V118.5 Q52 117 46.5 110.5 Z" /> },
  { m: 'adductors', mirror: true, el: <ellipse cx="56" cy="138" rx="3.4" ry="16.5" /> },
  { m: 'quads', mirror: true, el: <ellipse cx="46.6" cy="146" rx="8.2" ry="26" transform="rotate(4 46.6 146)" /> },
  { m: 'calves', mirror: true, el: <ellipse cx="45.2" cy="207" rx="5.8" ry="20.5" /> },
]

const BACK: Shape[] = [
  { m: 'traps', mirror: true, el: <path d="M59.5 30.5 L59.5 61 L50.5 47 L40 41.2 L54.5 33 Z" /> },
  { m: 'rear_delts', mirror: true, el: <ellipse cx="34" cy="49.5" rx="7.8" ry="9.6" transform="rotate(-20 34 49.5)" /> },
  { m: 'mid_back', mirror: true, el: <path d="M59.5 64 L50.4 50 L44.6 46.6 L44 59.5 L59.5 74 Z" /> },
  { m: 'lats', mirror: true, el: <path d="M43 62.5 L59.5 77.5 L59.5 93 Q49.5 96.5 46 88 Q42 77 43 62.5 Z" /> },
  { m: 'triceps', mirror: true, el: <ellipse cx="28.6" cy="70.5" rx="5.7" ry="11.8" transform="rotate(8 28.6 70.5)" /> },
  { m: 'forearms', mirror: true, el: <ellipse cx="23.6" cy="97" rx="4.8" ry="13.4" transform="rotate(9 23.6 97)" /> },
  { m: 'lower_back', el: <rect x="50.6" y="96.5" width="18.8" height="14.5" rx="5" /> },
  { m: 'glutes', mirror: true, el: <ellipse cx="50.2" cy="123" rx="9.2" ry="10" /> },
  { m: 'hamstrings', mirror: true, el: <ellipse cx="47" cy="154" rx="8.2" ry="20.5" /> },
  { m: 'calves', mirror: true, el: <ellipse cx="45.4" cy="203" rx="6.6" ry="19" /> },
]

/** Non-muscle parts that make the figure read as a body. */
const FRAME = (
  <>
    <ellipse cx="60" cy="18" rx="9.6" ry="12.2" />
    <rect x="55.6" y="29" width="8.8" height="9" rx="2.5" />
    <ellipse cx="19.6" cy="117.5" rx="3.7" ry="5.6" transform="rotate(8 19.6 117.5)" />
    <ellipse cx="100.4" cy="117.5" rx="3.7" ry="5.6" transform="rotate(-8 100.4 117.5)" />
    <circle cx="46" cy="178.5" r="4.6" />
    <circle cx="74" cy="178.5" r="4.6" />
    <ellipse cx="44.4" cy="236" rx="5.6" ry="3.6" />
    <ellipse cx="75.6" cy="236" rx="5.6" ry="3.6" />
  </>
)

export function MuscleMap({ primary = [], secondary = [], stabilizers = [], color = 'var(--accent)', selected, onSelect, height = 230, className }: Props) {
  const level = (m: MuscleId) => (primary.includes(m) ? 3 : secondary.includes(m) ? 2 : stabilizers.includes(m) ? 1 : 0)

  const figure = (shapes: Shape[], offset: number, label: string) => (
    <g transform={`translate(${offset} 0)`}>
      <g fill="var(--surface-3)" opacity="0.55">{FRAME}</g>
      {shapes.map(({ m, el, mirror }, i) => {
        const l = level(m)
        const isSelected = selected === m
        const fill = l === 3 ? color : l === 2 ? `color-mix(in oklab, ${color} 46%, var(--surface-3))` : l === 1 ? `color-mix(in oklab, ${color} 18%, var(--surface-3))` : 'var(--surface-3)'
        return (
          <g
            key={i}
            fill={isSelected ? 'var(--text)' : fill}
            stroke={l === 1 ? color : 'none'}
            strokeWidth={l === 1 ? 0.5 : 0}
            strokeDasharray={l === 1 ? '1.4 1.4' : undefined}
            strokeLinejoin="round"
            onClick={onSelect ? () => onSelect(m) : undefined}
            style={{
              cursor: onSelect ? 'pointer' : undefined,
              transition: 'fill 0.35s ease',
              filter: l === 3 && !isSelected ? `drop-shadow(0 0 5px color-mix(in oklab, ${color} 55%, transparent))` : undefined,
            }}
          >
            <title>{MUSCLES[m].name}</title>
            {el}
            {mirror && <g transform="translate(120 0) scale(-1 1)">{el}</g>}
          </g>
        )
      })}
      <text x="60" y="256" textAnchor="middle" fontSize="6.5" letterSpacing="1.2" fill="var(--text-3)" fontFamily="var(--font-mono)">
        {label}
      </text>
    </g>
  )

  return (
    <svg viewBox="0 0 250 262" height={height} className={className} style={{ maxWidth: '100%' }} role="img" aria-label="Muscles involved">
      {figure(FRONT, 0, 'FRONT')}
      {figure(BACK, 130, 'BACK')}
    </svg>
  )
}

export function MuscleLegend({ color = 'var(--accent)' }: { color?: string }) {
  const item = (label: string, bg: string, dashed = false) => (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: bg, outline: dashed ? `1px dashed ${color}` : undefined, outlineOffset: 1 }} />
      {label}
    </span>
  )
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {item('Primary', color)}
      {item('Secondary', `color-mix(in oklab, ${color} 46%, var(--surface-3))`)}
      {item('Stabiliser', `color-mix(in oklab, ${color} 18%, var(--surface-3))`, true)}
    </div>
  )
}
