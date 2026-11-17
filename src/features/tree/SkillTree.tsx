import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import type { DisciplineId, Skill } from '@/domain/types'
import { DISCIPLINES, SKILLS, disciplineById, skillById, skillsOf } from '@/domain/catalog'
import { BANDS, isVerified } from '@/domain/scoring/config'
import { pathTo, type SkillStatuses } from '@/domain/scoring/skills'
import { useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { AscentLayer, type AscentPlan } from './Ascent'
import { DisciplineDot, Eyebrow, PageHeader, StatusTag } from '@/ui/primitives'
import { RatingSheet } from '@/features/shared/Explainers'
import { SkillRow, SkillSheet } from './SkillSheet'
import { cx, dvar } from '@/lib/format'

const W = 400
const GUTTER = 50
const LANE = 70
const SCALE = 1.9
const MIN_GAP = 74
const PAD_TOP = 96
const PAD_BOTTOM = 70

const hash = (s: string) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

interface Placed {
  skill: Skill
  x: number
  y: number
  r: number
}

/**
 * Lay a discipline out as a chart: height is the skill's rating, lanes separate
 * the branches. Nodes in one lane are nudged apart when they would collide.
 */
function layout(discipline: DisciplineId) {
  const skills = skillsOf(discipline)
  const up = new Map<string, number>()
  for (let lane = 0; lane <= 4; lane++) {
    let last = -Infinity
    for (const s of skills.filter((k) => k.lane === lane).sort((a, b) => a.rating - b.rating)) {
      const h = Math.max(s.rating * SCALE, last + MIN_GAP)
      up.set(s.id, h)
      last = h
    }
  }
  const top = Math.max(...up.values())
  const height = top + PAD_TOP + PAD_BOTTOM
  const yOf = (h: number) => height - PAD_BOTTOM - h
  const placed: Placed[] = skills.map((skill) => ({
    skill,
    x: GUTTER + 12 + skill.lane * LANE + ((hash(skill.id) % 13) - 6),
    y: yOf(up.get(skill.id)!),
    r: skill.requires.length === 0 || /First|Full|One-Arm|Manna|Press|Lever|Planche|Push-up$/.test(skill.name) ? 17 : 14,
  }))
  return { placed, height, yOf, byId: Object.fromEntries(placed.map((p) => [p.skill.id, p])) as Record<string, Placed> }
}

/**
 * The route a level-up takes. From the node just completed to the landings it
 * opens; if it opens none here, from the node below it up to itself; and for a
 * node with nothing below either, straight up into open sky.
 */
function planAscent(skillId: string, placed: Placed[], byId: Record<string, Placed>, statuses: SkillStatuses): AscentPlan | null {
  const node = byId[skillId]
  if (!node) return null
  const others = (skip: Placed[]) => placed.filter((p) => !skip.includes(p)).map((p) => ({ x: p.x, y: p.y }))
  // The main beam follows the skill's own line upward: the same movement first, then whatever is most directly above.
  const direct = (p: Placed) => (p.skill.exerciseId === node.skill.exerciseId ? 0 : 1000) + Math.abs(p.x - node.x)
  const opened = placed.filter((p) => p.skill.requires.includes(skillId) && statuses[p.skill.id]?.state === 'available').sort((a, b) => direct(a) - direct(b)).slice(0, 3)
  if (opened.length) return { skillId, origin: node, targets: opened.map((p) => ({ x: p.x, y: p.y, r: p.r, id: p.skill.id })), neighbours: others([node, ...opened]) }
  const below = node.skill.requires.map((id) => byId[id]).filter((p) => p && statuses[p.skill.id]?.state === 'mastered').sort((a, b) => b.skill.rating - a.skill.rating)[0]
  if (below) return { skillId, origin: below, targets: [{ x: node.x, y: node.y, r: node.r, id: skillId }], neighbours: others([node, below]) }
  return { skillId, origin: node, targets: [{ x: node.x, y: Math.max(40, node.y - 150), r: node.r, id: null }], neighbours: others([node]) }
}

function Constellation({
  discipline, statuses, rating, goalPath, goals, onOpen, ascent, onAscended,
}: {
  discipline: DisciplineId
  statuses: SkillStatuses
  rating: number
  goalPath: Set<string>
  goals: string[]
  onOpen: (id: string) => void
  /** A skill whose level-up should play now. */
  ascent: string | null
  onAscended: () => void
}) {
  const { placed, height, yOf, byId } = useMemo(() => layout(discipline), [discipline])
  const color = dvar(discipline)
  const horizon = useRef<SVGRectElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const sound = useStore((s) => s.settings.sound)
  /** The landings that keep their light after a level-up, and the node the energy came from. */
  const [lit, setLit] = useState<{ ids: (string | null)[]; at: { x: number; y: number; r: number }[]; key: number } | null>(null)

  // The route is fixed when the level-up starts, so that syncing or logging during it cannot restart it.
  const plan = useMemo(() => (ascent ? planAscent(ascent, placed, byId, statuses) : null), [ascent, placed, byId]) // eslint-disable-line react-hooks/exhaustive-deps
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!plan) return
    if (!still) return
    // No motion wanted: the landing simply takes its glow.
    setLit({ ids: plan.targets.map((t) => t.id), at: plan.targets, key: Date.now() })
    onAscended()
  }, [plan, still]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ascent) return
    const t = window.setTimeout(() => horizon.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 80)
    return () => window.clearTimeout(t)
  }, [discipline]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!lit) return
    const t = window.setTimeout(() => setLit(null), 9200)
    return () => window.clearTimeout(t)
  }, [lit])

  const maxRating = Math.max(...placed.map((p) => p.skill.rating))
  const horizonY = yOf(Math.min(rating, maxRating + 30) * SCALE)

  return (
    <div ref={wrap} className="relative">
    {plan && !still && (
      <AscentLayer
        key={plan.skillId}
        plan={plan} discipline={discipline} wrap={wrap} unit={W} height={height} sound={sound}
        level={Math.max(0, BANDS.findIndex((b) => b.id === skillById[plan.skillId]?.band))}
        onImpact={() => setLit({ ids: plan.targets.map((t) => t.id), at: plan.targets, key: Date.now() })}
        onDone={onAscended}
      />
    )}
    <svg viewBox={`0 0 ${W} ${height}`} className="block w-full" role="img" aria-label={`${disciplineById[discipline].name} skill tree`}>
      <defs>
        <filter id="node-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <linearGradient id="horizon-fade" x1="0" x2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.9" />
          <stop offset="1" stopColor={color} stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Altitude bands */}
      {BANDS.filter((b) => b.min <= maxRating + 60).map((b) => {
        const y = yOf(b.min * SCALE)
        return (
          <g key={b.id}>
            {b.min > 0 && <line x1={0} x2={W} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />}
            <text x={0} y={y - 9} fontSize="8" letterSpacing="1.3" fill="var(--text-3)" fontFamily="var(--font-mono)">
              {b.label.toUpperCase()}
            </text>
            {b.min > 0 && (
              <text x={W} y={y - 9} textAnchor="end" fontSize="8" fill="var(--text-3)" fontFamily="var(--font-mono)">
                {b.min}
              </text>
            )}
          </g>
        )
      })}

      {/* Where the athlete stands */}
      {rating > 0 && (
        <g>
          <rect x={0} y={horizonY} width={W} height={Math.max(0, height - horizonY)} fill={color} opacity="0.035" />
          <line x1={0} x2={W} y1={horizonY} y2={horizonY} stroke="url(#horizon-fade)" strokeWidth="1" strokeDasharray="2 4" />
          <rect ref={horizon} x={0} y={horizonY - 9} width={62} height={18} rx={9} fill={color} />
          <text x={31} y={horizonY + 3.2} textAnchor="middle" fontSize="8.5" fontWeight="600" letterSpacing="0.8" fill="var(--bg)" fontFamily="var(--font-mono)">
            YOU · {rating}
          </text>
        </g>
      )}

      {/* Edges */}
      {placed.flatMap(({ skill, x, y, r }) =>
        skill.requires.map((reqId) => {
          const from = byId[reqId]
          if (!from) return null
          const a = statuses[reqId]?.state === 'mastered'
          const b = statuses[skill.id]?.state
          const y1 = from.y - from.r
          const y2 = y + r
          const mid = (y1 + y2) / 2
          // Nodes at nearly the same height connect side to side instead of looping.
          const flat = y1 - y2 < 26
          const dir = x >= from.x ? 1 : -1
          const d = flat
            ? `M${from.x + dir * from.r} ${from.y} L${x - dir * r} ${y}`
            : `M${from.x} ${y1} C${from.x} ${mid} ${x} ${mid} ${x} ${y2}`
          const lit = a && b === 'mastered'
          const live = a && b === 'available'
          return (
            <path
              key={`${reqId}-${skill.id}`}
              d={d}
              fill="none"
              stroke={lit || live ? color : 'var(--line-strong)'}
              strokeWidth={lit ? 1.5 : live ? 1.4 : 1}
              strokeOpacity={lit ? 0.75 : live ? 0.9 : 0.7}
              className={live ? 'edge-flow' : undefined}
              strokeLinecap="round"
            />
          )
        }),
      )}

      {/* A landing just reached keeps its light after the level-up has played. */}
      {lit?.at.map((n, i) => (
        <g key={`${lit.key}-${i}`} className="landing-halo">
          <circle cx={n.x} cy={n.y} r={n.r * 2.3} fill={color} filter="url(#node-glow)" opacity="0.55" />
          <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke={color} strokeWidth="1.2" opacity="0.8" />
        </g>
      ))}

      {/* Nodes */}
      {placed.map(({ skill, x, y, r }) => {
        const st = statuses[skill.id]
        const mastered = st.state === 'mastered'
        const available = st.state === 'available'
        const verified = mastered && !st.implied && st.tier && isVerified(st.tier)
        const cross = skill.requires.map((id) => skillById[id]).filter((s) => s.discipline !== discipline)
        const isGoal = goals.includes(skill.id)
        const c = 2 * Math.PI * (r + 3.5)
        return (
          <g key={skill.id} onClick={() => onOpen(skill.id)} style={{ cursor: 'pointer' }} role="button" aria-label={`${skill.name}, ${st.state}`}>
            <circle cx={x} cy={y} r={r + 14} fill="transparent" />
            {mastered && !st.implied && <circle cx={x} cy={y} r={r * 0.95} fill={color} filter="url(#node-glow)" opacity="0.6" />}
            {available && <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="1" className="pulse-ring" />}
            {goalPath.has(skill.id) && !mastered && (
              <circle cx={x} cy={y} r={r + 7.5} fill="none" stroke="var(--text)" strokeOpacity="0.5" strokeWidth="0.9" strokeDasharray="1.5 3.5" />
            )}

            <circle
              cx={x} cy={y} r={r}
              fill={mastered ? color : 'var(--bg)'}
              fillOpacity={mastered ? (st.implied ? 0.42 : st.tier === 'estimated' ? 0.7 : 1) : 1}
              stroke={mastered ? color : available ? color : 'var(--line-strong)'}
              strokeWidth={available ? 1.6 : 1}
              strokeDasharray={mastered && st.tier === 'estimated' ? '2 2.5' : undefined}
            />
            {verified && <circle cx={x} cy={y} r={r + 3.5} fill="none" stroke={color} strokeWidth="1" />}
            {available && st.progress > 0 && (
              <circle
                cx={x} cy={y} r={r + 3.5} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"
                strokeDasharray={`${c * st.progress} ${c}`} transform={`rotate(-90 ${x} ${y})`}
              />
            )}

            {mastered ? (
              <path d={`M${x - 4.5} ${y + 0.3} l3.2 3.2 l5.8 -6.4`} fill="none" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : available ? (
              <circle cx={x} cy={y} r="2.6" fill={color} />
            ) : (
              <circle cx={x} cy={y} r="1.6" fill="var(--text-3)" />
            )}

            {cross.map((s, i) => (
              <circle key={s.id} cx={x - r - 1 + i * 7} cy={y + r - 1} r="3" fill={dvar(s.discipline)} stroke="var(--bg)" strokeWidth="1.5">
                <title>Also needs {s.name}</title>
              </circle>
            ))}
            {isGoal && (
              <g transform={`translate(${x + r - 1} ${y - r + 1})`}>
                <circle r="6" fill="var(--text)" />
                <circle r="3.2" fill="none" stroke="var(--bg)" strokeWidth="1.1" />
                <circle r="0.9" fill="var(--bg)" />
              </g>
            )}

            <text x={x} y={y + r + 14} textAnchor="middle" fontSize="10" fontWeight="500" fill={st.state === 'locked' ? 'var(--text-3)' : 'var(--text)'} stroke="var(--bg)" strokeWidth="4" strokeLinejoin="round" style={{ letterSpacing: '-0.01em', paintOrder: 'stroke' }}>
              {skill.label[0]}
            </text>
            <text x={x} y={y + r + 25.5} textAnchor="middle" fontSize="8.5" fill="var(--text-3)" fontFamily="var(--font-mono)" stroke="var(--bg)" strokeWidth="3.5" strokeLinejoin="round" style={{ paintOrder: 'stroke' }}>
              {skill.label[1]}
            </text>
          </g>
        )
      })}
    </svg>
    </div>
  )
}

export function SkillTree() {
  const me = useMe()
  const [params, setParams] = useSearchParams()
  const initial = (params.get('d') as DisciplineId | null) ?? me.aura.peak?.discipline ?? 'handstand'
  const [discipline, setDiscipline] = useState<DisciplineId>(DISCIPLINES.some((d) => d.id === initial) ? initial : 'handstand')
  const [open, setOpen] = useState<string | null>(params.get('s'))
  const [ratingOpen, setRatingOpen] = useState(false)

  // A skill mastered since the tree was last open plays its level-up here, once.
  const waiting = useStore((s) => (s.ascents ?? []).find((id) => skillById[id]))
  const takeAscent = useStore((s) => s.takeAscent)
  const [playing, setPlaying] = useState<string | null>(null)
  useEffect(() => {
    if (!waiting || playing || open || ratingOpen) return
    const d = skillById[waiting].discipline
    if (d !== discipline) return setDiscipline(d)
    // Taken off the list as it starts: leaving the page mid-way must not make it loop.
    takeAscent(waiting)
    setPlaying(waiting)
  }, [waiting, playing, open, ratingOpen, discipline, takeAscent])

  const openSkill = (id: string) => {
    const s = skillById[id]
    if (s && s.discipline !== discipline) setDiscipline(s.discipline)
    setOpen(id)
  }

  useEffect(() => {
    if (params.has('s') || params.has('d')) setParams({}, { replace: true })
  }, [params, setParams])

  const goalPath = useMemo(() => new Set(me.athlete.goals.flatMap((g) => pathTo(g, me.statuses).map((s) => s.id))), [me.athlete.goals, me.statuses])

  const all = skillsOf(discipline)
  const mastered = all.filter((s) => me.statuses[s.id].state === 'mastered').length
  const frontier = all
    .filter((s) => me.statuses[s.id].state === 'available')
    .sort((a, b) => me.statuses[b.id].progress - me.statuses[a.id].progress || a.rating - b.rating)
  const total = SKILLS.filter((s) => me.statuses[s.id].state === 'mastered').length
  const rating = me.ratings[discipline]

  return (
    <div>
      <PageHeader eyebrow={`${total} of ${SKILLS.length} skills mastered`} title="Skill Tree" />

      <div className="glass sticky top-0 z-20 -mx-5 border-b border-line px-5 py-3 lg:-mx-12 lg:px-12">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0">
          {DISCIPLINES.map((d) => {
            const on = d.id === discipline
            return (
              <button
                key={d.id}
                onClick={() => setDiscipline(d.id)}
                className={cx('pressable flex h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[13.5px] font-medium', on ? 'border-transparent text-bg' : 'border-line text-ink-2')}
                style={on ? { background: dvar(d.id) } : undefined}
              >
                {!on && <DisciplineDot id={d.id} size={7} />}
                {d.short}
                <span className={cx('num text-[12px]', on ? 'opacity-70' : 'text-ink-3')}>{me.ratings[d.id].rating || '—'}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-12">
        <div className="pt-4">
          <button onClick={() => setRatingOpen(true)} className="card mb-2 flex w-full items-center justify-between p-4 text-left lg:hidden">
            <span>
              <Eyebrow>{disciplineById[discipline].name}</Eyebrow>
              <span className="mt-1 block text-[12.5px] text-ink-2">{mastered} of {all.length} mastered · {frontier.length} available</span>
            </span>
            <span className="flex items-center gap-2.5">
              {rating.rating > 0 && <StatusTag status={rating.status} provisional={rating.provisional} />}
              <span className="display num text-[32px]">{rating.rating || '—'}</span>
            </span>
          </button>
          <Constellation
            discipline={discipline} statuses={me.statuses} rating={rating.rating} goalPath={goalPath} goals={me.athlete.goals} onOpen={openSkill}
            ascent={playing && skillById[playing]?.discipline === discipline ? playing : null} onAscended={() => setPlaying(null)}
          />
          <Legend />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6 pt-6">
            <button onClick={() => setRatingOpen(true)} className="card w-full p-5 text-left hover:bg-surface-2">
              <Eyebrow>{disciplineById[discipline].name}</Eyebrow>
              <div className="mt-2 flex items-end justify-between">
                <span className="display num text-[56px] leading-none" style={{ color: dvar(discipline) }}>{rating.rating || '—'}</span>
                {rating.rating > 0 && <StatusTag status={rating.status} provisional={rating.provisional} />}
              </div>
              <p className="mt-3 text-[13px] text-ink-2">{disciplineById[discipline].blurb}</p>
              <p className="mt-1 text-[13px] text-ink-3">{mastered} of {all.length} mastered · {frontier.length} available now</p>
            </button>
            {frontier.length > 0 && (
              <div>
                <Eyebrow className="mb-3">Within reach</Eyebrow>
                <div className="card divide-y divide-line">
                  {frontier.slice(0, 6).map((s) => <SkillRow key={s.id} skill={s} status={me.statuses[s.id]} onClick={() => openSkill(s.id)} />)}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <SkillSheet skillId={open} onClose={() => setOpen(null)} onOpenSkill={openSkill} />
      <RatingSheet rating={rating} open={ratingOpen} onClose={() => setRatingOpen(false)} />
    </div>
  )
}

function Legend() {
  const dot = (style: React.CSSProperties) => <span className="inline-block h-3 w-3 rounded-full" style={style} />
  return (
    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-[11.5px] text-ink-2">
      <span className="flex items-center gap-1.5">{dot({ background: 'var(--text)' })}Mastered</span>
      <span className="flex items-center gap-1.5">{dot({ background: 'var(--text)', outline: '1px solid var(--text)', outlineOffset: 2 })}Verified</span>
      <span className="flex items-center gap-1.5">{dot({ background: 'var(--text)', opacity: 0.42 })}Implied</span>
      <span className="flex items-center gap-1.5">{dot({ border: '1.6px solid var(--text)' })}Available</span>
      <span className="flex items-center gap-1.5">{dot({ border: '1px solid var(--line-strong)' })}Locked</span>
      <span className="flex items-center gap-1.5">{dot({ border: '1px dashed var(--text)' })}On a goal path</span>
      <span className="w-full text-ink-3">Height is the skill’s rating. A coloured dot on a node means it also needs a skill from another discipline.</span>
    </div>
  )
}
