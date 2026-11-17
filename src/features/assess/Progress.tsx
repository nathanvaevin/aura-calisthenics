import type { DisciplineId } from '@/domain/types'
import type { ResultsComparison } from '@/domain/assessment'
import { disciplineById, exerciseById, formatValue } from '@/domain/catalog'
import { Eyebrow } from '@/ui/primitives'
import { dvar } from '@/lib/format'

const v = (exerciseId: string, value: number) => formatValue(exerciseById[exerciseId], value)

/**
 * A re-test read against its baseline, benchmark by benchmark: what improved,
 * which variations are new, what held, and what was not tested this time.
 */
export function SinceBaseline({ c, still, who = 'You' }: { c: ResultsComparison; still?: DisciplineId | null; who?: string }) {
  const rows = (title: string, list: ResultsComparison['improved'], show: (x: ResultsComparison['improved'][number]) => string, empty?: string) =>
    list.length === 0 && !empty ? null : (
      <div className="px-4 py-3">
        <Eyebrow className="mb-1.5">{title} · {list.length}</Eyebrow>
        {list.length === 0 ? <p className="text-[13px] text-ink-3">{empty}</p> : (
          <ul className="space-y-1">
            {list.map((x) => (
              <li key={x.exerciseId} className="flex items-baseline justify-between gap-3 text-[13.5px]">
                <span className="flex min-w-0 items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dvar(exerciseById[x.exerciseId].discipline) }} /><span className="truncate">{exerciseById[x.exerciseId].name}</span></span>
                <span className="num shrink-0 text-ink-2">{show(x)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  return (
    <div className="card divide-y divide-line">
      {rows('Improved', c.improved, (x) => `${v(x.exerciseId, x.before)} → ${v(x.exerciseId, x.after)}`, 'No benchmark beaten yet.')}
      {rows('New variations', c.added, (x) => v(x.exerciseId, x.after))}
      {rows('Held', c.held, (x) => (x.after === x.before ? v(x.exerciseId, x.after) : `${v(x.exerciseId, x.before)} → ${v(x.exerciseId, x.after)}`))}
      {rows('Not tested this time', c.notRetested, (x) => `was ${v(x.exerciseId, x.before)}`)}
      {still && (
        <div className="px-4 py-3 text-[13px] leading-relaxed text-ink-2">
          <span className="font-medium text-ink">Still developing:</span> {who === 'You' ? 'your' : `${who}’s`} lowest area today is <span style={{ color: dvar(still) }}>{disciplineById[still].name}</span>.
        </div>
      )}
    </div>
  )
}
