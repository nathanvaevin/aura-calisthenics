import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { DisciplineId } from '@/domain/types'
import { DISCIPLINES, EXERCISES, SKILLS, disciplineById, placementsOf } from '@/domain/catalog'
import { DisciplineDot, Sheet } from '@/ui/primitives'
import { dvar } from '@/lib/format'

function Filters({ query, setQuery, discipline, setDiscipline, placeholder }: { query: string; setQuery: (q: string) => void; discipline: DisciplineId | 'all'; setDiscipline: (d: DisciplineId | 'all') => void; placeholder: string }) {
  return (
    <>
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
        <input autoFocus className="field pl-11" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 lg:-mx-7 lg:px-7">
        <button className="chip" data-on={discipline === 'all'} onClick={() => setDiscipline('all')}>All</button>
        {DISCIPLINES.map((d) => (
          <button key={d.id} className="chip" data-on={discipline === d.id} onClick={() => setDiscipline(d.id)}>
            {discipline !== d.id && <DisciplineDot id={d.id} size={6} />}{d.short}
          </button>
        ))}
      </div>
    </>
  )
}

export function ExercisePicker({ open, onClose, onPick, title = 'Add an exercise' }: { open: boolean; onClose: () => void; onPick: (exerciseId: string) => void; title?: string }) {
  const [query, setQuery] = useState('')
  const [discipline, setDiscipline] = useState<DisciplineId | 'all'>('all')
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return EXERCISES.filter((e) => (discipline === 'all' || e.discipline === discipline) && (!q || e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)))
  }, [query, discipline])

  return (
    <Sheet open={open} onClose={onClose} eyebrow="Exercise library" title={title}>
      <Filters query={query} setQuery={setQuery} discipline={discipline} setDiscipline={setDiscipline} placeholder="Search exercises" />
      <div className="card mt-4 divide-y divide-line">
        {results.map((e) => {
          const p = placementsOf(e.id)[0]
          return (
            <button key={e.id} onClick={() => { onPick(e.id); setQuery(''); onClose() }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left first:rounded-t-card last:rounded-b-card hover:bg-surface-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium" style={{ background: `color-mix(in oklab, ${dvar(e.discipline)} 14%, transparent)`, color: dvar(e.discipline) }}>
                {p ? `L${p.level}` : '·'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{e.name}</span>
                <span className="block truncate text-[12px] text-ink-3">{e.category}{p ? ` · ${p.progression.name} ladder, level ${p.level} of ${p.progression.steps.length}` : ' · no ladder'}</span>
              </span>
            </button>
          )
        })}
        {results.length === 0 && <p className="p-5 text-center text-[13.5px] text-ink-3">No exercise matches.</p>}
      </div>
    </Sheet>
  )
}

export function SkillPicker({ open, onClose, onPick, exclude }: { open: boolean; onClose: () => void; onPick: (skillId: string) => void; exclude: string[] }) {
  const [query, setQuery] = useState('')
  const [discipline, setDiscipline] = useState<DisciplineId | 'all'>('all')
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SKILLS.filter((s) => !exclude.includes(s.id) && (discipline === 'all' || s.discipline === discipline) && (!q || s.name.toLowerCase().includes(q))).sort((a, b) => a.rating - b.rating)
  }, [query, discipline, exclude])

  return (
    <Sheet open={open} onClose={onClose} eyebrow="Skill tree" title="Add a milestone">
      <Filters query={query} setQuery={setQuery} discipline={discipline} setDiscipline={setDiscipline} placeholder="Search skills" />
      <div className="card mt-4 divide-y divide-line">
        {results.map((s) => (
          <button key={s.id} onClick={() => { onPick(s.id); setQuery(''); onClose() }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left first:rounded-t-card last:rounded-b-card hover:bg-surface-2">
            <DisciplineDot id={s.discipline} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-medium">{s.name}</span>
              <span className="block text-[12px] text-ink-3">{disciplineById[s.discipline].short}</span>
            </span>
            <span className="num text-[12.5px] text-ink-2">{s.rating}</span>
          </button>
        ))}
      </div>
    </Sheet>
  )
}
