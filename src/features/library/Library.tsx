import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronRight, Search, X } from 'lucide-react'
import type { DisciplineId, Exercise, MuscleId } from '@/domain/types'
import { DISCIPLINES, EXERCISES, MUSCLES, PROGRESSIONS, exerciseById, formatValue, placementsOf } from '@/domain/catalog'
import { bandOf } from '@/domain/scoring/config'
import { bestEvidence } from '@/domain/scoring/mastery'
import { workingLevel } from '@/domain/scoring/skills'
import { useMe } from '@/data/hooks'
import { MuscleLegend, MuscleMap } from '@/ui/MuscleMap'
import { DisciplineDot, Empty, Eyebrow, PageHeader, Segmented } from '@/ui/primitives'
import { cx, dvar } from '@/lib/format'

type View = 'exercises' | 'ladders' | 'muscles'

export function ExerciseRow({ ex, best, onClick, trailing }: { ex: Exercise; best?: number; onClick: () => void; trailing?: React.ReactNode }) {
  const placement = placementsOf(ex.id)[0]
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors first:rounded-t-card last:rounded-b-card hover:bg-surface-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-medium" style={{ background: `color-mix(in oklab, ${dvar(ex.discipline)} 14%, transparent)`, color: dvar(ex.discipline) }}>
        {placement ? `L${placement.level}` : '·'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14.5px] font-medium">{ex.name}</span>
        <span className="block truncate text-[12px] text-ink-3">
          {ex.category}{placement ? ` · ${placement.progression.name} ladder` : ''}{best ? ` · best ${formatValue(ex, best)}` : ''}
        </span>
      </span>
      {trailing ?? <ChevronRight size={15} className="shrink-0 text-ink-3" />}
    </button>
  )
}

export function Library() {
  const me = useMe()
  const navigate = useNavigate()
  const [view, setView] = useState<View>('exercises')
  const [query, setQuery] = useState('')
  const [discipline, setDiscipline] = useState<DisciplineId | 'all'>('all')
  const [mine, setMine] = useState(false)
  const [muscle, setMuscle] = useState<MuscleId | null>('lats')

  const best = useMemo(() => bestEvidence(me.evidence), [me.evidence])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return EXERCISES.filter((e) => {
      if (discipline !== 'all' && e.discipline !== discipline) return false
      if (mine && !e.equipment.some((eq) => me.athlete.equipment.includes(eq))) return false
      if (!q) return true
      return (
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.primary.some((m) => MUSCLES[m].name.toLowerCase().includes(q))
      )
    })
  }, [query, discipline, mine, me.athlete.equipment])

  const byMuscle = useMemo(() => {
    if (!muscle) return []
    const rank = (e: Exercise) => (e.primary.includes(muscle) ? 0 : e.secondary.includes(muscle) ? 1 : e.stabilizers.includes(muscle) ? 2 : 3)
    return EXERCISES.filter((e) => rank(e) < 2).sort((a, b) => rank(a) - rank(b) || (a.curve?.[0][1] ?? 0) - (b.curve?.[0][1] ?? 0))
  }, [muscle])

  const chips = (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
      <button className="chip" data-on={discipline === 'all'} onClick={() => setDiscipline('all')}>All</button>
      {DISCIPLINES.map((d) => (
        <button key={d.id} className="chip" data-on={discipline === d.id} onClick={() => setDiscipline(d.id)}>
          {discipline !== d.id && <DisciplineDot id={d.id} size={6} />}{d.short}
        </button>
      ))}
      <span className="mx-1 w-px shrink-0 self-stretch bg-line" />
      <button className="chip" data-on={mine} onClick={() => setMine(!mine)}>My equipment</button>
    </div>
  )

  return (
    <div>
      <PageHeader eyebrow={`${EXERCISES.length} exercises · ${PROGRESSIONS.length} ladders`} title="Library" />

      <div className="rise rise-1 relative">
        <Search size={17} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
        <input
          className="field pl-11"
          placeholder="Search exercises, categories or muscles"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (view !== 'exercises') setView('exercises')
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface-2 text-ink-2">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="rise rise-2 mt-4">
        <Segmented<View>
          value={view}
          onChange={setView}
          options={[{ value: 'exercises', label: 'Exercises' }, { value: 'ladders', label: 'Ladders' }, { value: 'muscles', label: 'By muscle' }]}
        />
      </div>

      {view === 'exercises' && (
        <div className="rise rise-3 mt-4">
          {chips}
          <Eyebrow className="mt-5 mb-3">{results.length} {results.length === 1 ? 'result' : 'results'}</Eyebrow>
          {results.length === 0 ? (
            <Empty title="Nothing matches">Try a muscle name, a category such as “straight-arm”, or clear the filters.</Empty>
          ) : (
            <div className="card divide-y divide-line lg:columns-1">
              {results.map((e) => <ExerciseRow key={e.id} ex={e} best={best.get(e.id)?.value} onClick={() => navigate(`/library/${e.id}`)} />)}
            </div>
          )}
        </div>
      )}

      {view === 'ladders' && (
        <div className="rise rise-3 mt-4">
          {chips}
          <p className="mt-4 text-[13px] text-ink-2">
            Each ladder is one movement family ordered from easiest to hardest. Levels only compare within a ladder. Your working level is marked.
          </p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {PROGRESSIONS.filter((p) => discipline === 'all' || p.discipline === discipline).map((p) => {
              const level = workingLevel(p.id, me.evidence)
              const started = p.steps.some((s) => best.has(s.exerciseId) || s.alternates?.some((a) => best.has(a)))
              return (
                <div key={p.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[16px] font-medium"><DisciplineDot id={p.discipline} />{p.name}</div>
                      <div className="mt-0.5 text-[12.5px] text-ink-2">{p.objective}</div>
                    </div>
                    <span className="num shrink-0 rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[10.5px] text-ink-2">
                      {started ? `L${level} / ${p.steps.length}` : `${p.steps.length} levels`}
                    </span>
                  </div>
                  <ol className="mt-3.5 space-y-0.5">
                    {p.steps.map((s) => {
                      const ex = exerciseById[s.exerciseId]
                      const here = started && s.level === level
                      const below = started && s.level < level
                      return (
                        <li key={s.level}>
                          <button onClick={() => navigate(`/library/${ex.id}`)} className={cx('flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-surface-2', here && 'bg-surface-2')}>
                            <span
                              className="num flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10.5px]"
                              style={here ? { background: dvar(p.discipline), color: 'var(--bg)' } : { border: `1px solid ${below ? dvar(p.discipline) : 'var(--line-strong)'}`, color: below ? dvar(p.discipline) : 'var(--text-3)' }}
                            >
                              {s.level}
                            </span>
                            <span className={cx('min-w-0 flex-1 truncate text-[13.5px]', here ? 'font-medium' : below ? 'text-ink-2' : 'text-ink-2')}>
                              {ex.name}
                              {s.alternates && <span className="text-ink-3"> · or {s.alternates.map((a) => exerciseById[a].short).join(', ')}</span>}
                            </span>
                            {here && <span className="font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">You</span>}
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === 'muscles' && (
        <div className="rise rise-3 mt-5 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10">
          <div className="card flex flex-col items-center p-5 lg:sticky lg:top-8 lg:self-start">
            <MuscleMap primary={muscle ? [muscle] : []} selected={null} onSelect={setMuscle} height={300} />
            <p className="mt-2 text-[12px] text-ink-3">Tap a muscle to see what trains it.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {(Object.keys(MUSCLES) as MuscleId[]).map((m) => (
                <button key={m} className="chip !h-7 !px-2.5 !text-[12px]" data-on={muscle === m} onClick={() => setMuscle(m)}>{MUSCLES[m].name}</button>
              ))}
            </div>
          </div>
          <div className="mt-6 lg:mt-0">
            {muscle && (
              <>
                <Eyebrow className="mb-1">{MUSCLES[muscle].group}</Eyebrow>
                <h2 className="display text-[32px]">{MUSCLES[muscle].name}</h2>
                <p className="mt-1 mb-4 text-[13px] text-ink-2">{byMuscle.filter((e) => e.primary.includes(muscle)).length} exercises train it directly, {byMuscle.filter((e) => !e.primary.includes(muscle)).length} more as a secondary mover.</p>
                <div className="card divide-y divide-line">
                  {byMuscle.map((e) => (
                    <ExerciseRow
                      key={e.id} ex={e} onClick={() => navigate(`/library/${e.id}`)}
                      trailing={
                        <span className="shrink-0 font-mono text-[9.5px] tracking-[0.1em] uppercase" style={{ color: e.primary.includes(muscle) ? dvar(e.discipline) : 'var(--text-3)' }}>
                          {e.primary.includes(muscle) ? 'Primary' : 'Secondary'}
                        </span>
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {view !== 'muscles' && <div className="mt-6"><MuscleLegendNote /></div>}
    </div>
  )
}

function MuscleLegendNote() {
  return (
    <p className="text-[12px] leading-relaxed text-ink-3">
      Ratings shown on exercises come from provisional calibration curves ({bandOf(0).label} 0–200 up to World-class 1000+). Exercises without a curve are
      training tools and never move a rating.
    </p>
  )
}

export { MuscleLegend }
