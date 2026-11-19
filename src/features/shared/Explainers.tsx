import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { EvidenceTier, DisciplineId, Evidence } from '@/domain/types'
import { DISCIPLINE_IDS, disciplineById, exerciseById, formatValue, skillById } from '@/domain/catalog'
import { BANDS, SCORING, bandOf } from '@/domain/scoring/config'
import { computeAura, type AuraResult } from '@/domain/scoring/aura'
import { allRatings, bestEvidence, type DisciplineRating } from '@/domain/scoring/mastery'
import { skillStatuses } from '@/domain/scoring/skills'
import { useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { Bar, DisciplineDot, Eyebrow, Sheet, StatusTag, Stepper, TierTag } from '@/ui/primitives'
import { dvar, num } from '@/lib/format'

/** Where a discipline rating comes from, benchmark by benchmark. */
export function RatingSheet({ rating, open, onClose, onLog }: { rating: DisciplineRating | null; open: boolean; onClose: () => void; onLog?: (exerciseId: string) => void }) {
  if (!rating) return null
  const d = disciplineById[rating.discipline]
  const band = bandOf(rating.rating)
  const empty = SCORING.slotWeights.length - rating.slots.length
  return (
    <Sheet open={open} onClose={onClose} eyebrow={`${d.name} · mastery rating`} title={rating.rating ? <span className="num">{rating.rating}</span> : 'Unrated'}>
      <div className="flex flex-wrap items-center gap-2">
        <StatusTag status={rating.status} provisional={rating.provisional} />
        {rating.rating > 0 && <span className="text-[13px] text-ink-2">{band.label} range</span>}
        {rating.verified > 0 && rating.verified !== rating.rating && (
          <span className="num text-[13px] text-ink-2">· {rating.verified} on verified evidence alone</span>
        )}
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
        A rating blends your three strongest demonstrated benchmarks in this discipline, weighted{' '}
        {SCORING.slotWeights.map((w) => `${w * 100}%`).join(' / ')}. Each benchmark is read off a calibration curve for that exercise. Workouts
        completed never enter it.
      </p>

      <div className="mt-5 space-y-2.5">
        {rating.slots.map((s, i) => {
          const ex = exerciseById[s.exerciseId]
          return (
            <div key={s.exerciseId} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Eyebrow>Benchmark {i + 1} · {s.weight * 100}%</Eyebrow>
                  <div className="mt-1.5 truncate text-[15.5px] font-medium">{ex.name}</div>
                  <div className="mt-0.5 text-[13px] text-ink-2">{formatValue(ex, s.value, true)}</div>
                </div>
                <div className="text-right">
                  <div className="display num text-[30px]">{Math.round(s.score)}</div>
                  <div className="num text-[11.5px] text-ink-3">adds {Math.round(s.score * s.weight)}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <TierTag tier={s.tier} />
                {onLog && (
                  <button className="text-[12.5px] font-medium text-ink-2 hover:text-ink" onClick={() => onLog(s.exerciseId)}>
                    Log a new best
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {Array.from({ length: empty }, (_, i) => (
          <div key={i} className="rounded-card border border-dashed border-line-strong p-4">
            <Eyebrow>Benchmark {rating.slots.length + i + 1} · {SCORING.slotWeights[rating.slots.length + i] * 100}%</Eyebrow>
            <div className="mt-1.5 text-[14px] text-ink-2">Nothing on record yet. Log another {d.short.toLowerCase()} benchmark to complete this rating.</div>
          </div>
        ))}
      </div>

      <ModelNote />
    </Sheet>
  )
}

export function ModelNote() {
  return (
    <p className="mt-5 rounded-2xl bg-surface p-4 text-[12.5px] leading-relaxed text-ink-3">
      Scoring model <span className="font-mono text-ink-2">{SCORING.version}</span>. The curves are a coach’s ordering of benchmarks onto one scale,
      not validated performance standards. They will be recalibrated as real data accumulates, and every stored score records the model version
      that produced it.
    </p>
  )
}

/** What Aura is made of, and what deliberately is not in it. */
export function AuraSheet({ aura, dedication, open, onClose }: { aura: AuraResult; dedication: number; open: boolean; onClose: () => void }) {
  const next = aura.cls.next
  return (
    <Sheet open={open} onClose={onClose} eyebrow="Aura" title={aura.aura ? <span className="num">{num(aura.aura)}</span> : 'Unranked'}>
      <div className="flex flex-wrap items-center gap-2">
        <StatusTag status={aura.status} />
        <span className="text-[13px] text-ink-2">{aura.title}</span>
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
        Aura is {SCORING.auraScale} × the power mean (exponent {SCORING.auraExponent}) of your six discipline ratings. Because it is a mean, adding
        disciplines never inflates it; because the exponent is above one, an exceptional discipline counts for more than a flat average would.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {[
          ['Overall mastery', aura.mastery, 'Average of all six ratings'],
          ['Peak', aura.peak?.rating ?? 0, aura.peak ? disciplineById[aura.peak.discipline].name : 'No rating yet'],
          ['Versatility', `${aura.versatility}`, 'How close your average sits to your peak, 0–100'],
          ['Dedication', `${dedication}`, 'Training consistency. Shown here, never added to Aura'],
        ].map(([label, value, note]) => (
          <div key={label as string} className="card p-4">
            <Eyebrow>{label}</Eyebrow>
            <div className="display num mt-2 text-[32px]">{value}</div>
            <div className="mt-1 text-[12px] leading-snug text-ink-3">{note}</div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Eyebrow className="mb-3">Aura classes</Eyebrow>
        <div className="flex items-center justify-between text-[13.5px]">
          <span className="font-medium">{aura.cls.current.label}</span>
          {next && <span className="num text-ink-2">{num(next.min - aura.aura)} to {next.label}</span>}
        </div>
        <Bar value={aura.cls.progress} className="mt-2" />
        <p className="mt-3 text-[12.5px] text-ink-3">Class names are identity, not measurement. The number is what is computed.</p>
      </div>
      <ModelNote />
    </Sheet>
  )
}

/**
 * Record a benchmark. Shows what the entry would change before it is saved, so
 * the link between a performance, a rating and a skill is never hidden.
 */
export function LogEvidenceSheet({ exerciseId, open, onClose }: { exerciseId: string | null; open: boolean; onClose: () => void }) {
  const me = useMe()
  const addEvidence = useStore((s) => s.addEvidence)
  const ex = exerciseId ? exerciseById[exerciseId] : null
  const best = ex ? (bestEvidence(me.evidence).get(ex.id)?.value ?? 0) : 0
  const [value, setValue] = useState<number | null>(null)
  const [attested, setAttested] = useState(false)
  const v = value ?? (best > 0 ? best + (ex?.metric === 'hold' ? 5 : 1) : (ex?.dose.range[0] ?? 1))

  const preview = useMemo(() => {
    if (!ex) return null
    const draft: Evidence = { id: 'draft', athleteId: me.athlete.id, exerciseId: ex.id, value: v, tier: 'self', source: 'manual', date: new Date().toISOString() }
    const next = [...me.evidence, draft]
    const ratings = allRatings(next)
    const statuses = skillStatuses(next)
    const unlocked = Object.keys(statuses).filter((id) => statuses[id].state === 'mastered' && !statuses[id].implied && me.statuses[id]?.state !== 'mastered')
    return { rating: ratings[ex.discipline].rating, aura: computeAura(ratings).aura, unlocked }
  }, [ex, v, me])

  if (!ex) return null
  const close = () => {
    setValue(null)
    setAttested(false)
    onClose()
  }
  const before = me.ratings[ex.discipline].rating

  return (
    <Sheet open={open} onClose={close} eyebrow="Record a benchmark" title={ex.name}>
      {!ex.curve ? (
        <p className="text-[14px] text-ink-2">This is a training exercise without a calibration curve, so it does not feed a rating.</p>
      ) : (
        <>
          <p className="text-[13.5px] text-ink-2">
            {best > 0 ? <>Your best on record is <span className="font-medium text-ink">{formatValue(ex, best, true)}</span>.</> : 'Nothing on record for this exercise yet.'}
          </p>
          <div className="my-7 flex flex-col items-center">
            <Stepper value={v} onChange={setValue} min={1} max={999} step={ex.metric === 'hold' && v >= 30 ? 5 : 1} size="lg" suffix={ex.metric === 'hold' ? 's' : ex.perSide ? '/side' : ''} />
            <div className="mt-2 text-[12.5px] text-ink-3">{ex.metric === 'hold' ? 'Seconds held in one attempt' : 'Reps in one unbroken set'}</div>
          </div>

          {preview && (
            <div className="card divide-y divide-line">
              <div className="flex items-center justify-between p-4">
                <span className="flex items-center gap-2 text-[14px]"><DisciplineDot id={ex.discipline} />{disciplineById[ex.discipline].short} rating</span>
                <span className="num flex items-center gap-2 text-[15px]">
                  <span className="text-ink-3">{before}</span><ArrowRight size={13} className="text-ink-3" />
                  <span className="font-semibold" style={{ color: preview.rating > before ? dvar(ex.discipline) : undefined }}>{preview.rating}</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[14px]">Aura</span>
                <span className="num flex items-center gap-2 text-[15px]">
                  <span className="text-ink-3">{num(me.aura.aura)}</span><ArrowRight size={13} className="text-ink-3" />
                  <span className="font-semibold">{num(preview.aura)}</span>
                </span>
              </div>
              {preview.unlocked.length > 0 && (
                <div className="p-4">
                  <Eyebrow className="mb-2">Unlocks</Eyebrow>
                  <div className="flex flex-wrap gap-1.5">
                    {preview.unlocked.map((id) => (
                      <span key={id} className="rounded-full px-2.5 py-1 text-[12.5px] font-medium" style={{ background: `color-mix(in oklab, ${dvar(ex.discipline)} 18%, transparent)`, color: dvar(ex.discipline) }}>
                        {skillById[id].name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {preview.rating === before && preview.unlocked.length === 0 && (
                <div className="p-4 text-[12.5px] text-ink-3">
                  {v <= best ? 'Not above your current best, so nothing changes.' : 'Recorded as a personal best. It is not yet among your three strongest benchmarks in this discipline.'}
                </div>
              )}
            </div>
          )}

          {ex.standard && (
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4">
              <input type="checkbox" checked={attested} onChange={(e) => setAttested(e.target.checked)} className="mt-0.5 h-[18px] w-[18px] accent-[var(--text)]" />
              <span className="text-[13px] leading-snug text-ink-2">
                <span className="font-medium text-ink">It met the standard.</span> {ex.standard}
              </span>
            </label>
          )}

          <button
            className="btn btn-primary btn-lg mt-5 w-full"
            disabled={!!ex.standard && !attested}
            onClick={() => {
              addEvidence({ exerciseId: ex.id, value: v, source: 'manual' })
              close()
            }}
          >
            Record as self-reported
          </button>
          <p className="mt-3 text-center text-[12px] text-ink-3">Shown as self-reported until a coach verifies it.</p>
        </>
      )}
    </Sheet>
  )
}

const STATUS_TIER: Record<string, EvidenceTier | null> = { verified: 'coach', observed: 'observed', self: 'self', estimated: 'estimated' }

/**
 * The six ratings as a tappable list. `compact` is one line each: the area,
 * how far along, the number, and how it is known. Everything else about a
 * rating is behind the tap.
 */
export function RatingList({ ratings, onSelect, compact }: { ratings: Record<DisciplineId, DisciplineRating>; onSelect?: (d: DisciplineId) => void; compact?: boolean }) {
  const top = Math.max(600, ...DISCIPLINE_IDS.map((d) => ratings[d].rating))
  const scale = Math.ceil(top / 200) * 200
  if (compact) {
    return (
      <div className="card divide-y divide-line">
        {DISCIPLINE_IDS.map((d) => {
          const r = ratings[d]
          const tier = STATUS_TIER[r.status] ?? null
          return (
            <button key={d} onClick={() => onSelect?.(d)} data-rating={d} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2 first:rounded-t-card last:rounded-b-card">
              <DisciplineDot id={d} />
              <span className="w-[84px] shrink-0 truncate text-[14px] font-medium">{disciplineById[d].short}</span>
              <span className="relative min-w-0 flex-1">
                <Bar value={r.rating / scale} color={dvar(d)} />
                {r.verified > 0 && r.verified < r.rating && <span className="absolute top-[-2px] h-[7px] w-px bg-ink" style={{ left: `${(r.verified / scale) * 100}%` }} title={`Verified: ${r.verified}`} />}
              </span>
              {tier && r.rating > 0 ? <TierTag tier={tier} compact /> : <span className="w-5" />}
              <span className="display num w-[44px] shrink-0 text-right text-[22px] leading-none">{r.rating || '—'}</span>
            </button>
          )
        })}
      </div>
    )
  }
  return (
    <div className="card divide-y divide-line">
      {DISCIPLINE_IDS.map((d) => {
        const r = ratings[d]
        return (
          <button key={d} onClick={() => onSelect?.(d)} className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-surface-2 first:rounded-t-card last:rounded-b-card">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 text-[14.5px] font-medium"><DisciplineDot id={d} /><span className="truncate">{disciplineById[d].name}</span></span>
                <span className="display num shrink-0 text-[26px] leading-none">{r.rating || '—'}</span>
              </div>
              <div className="relative mt-2.5">
                <Bar value={r.rating / scale} color={dvar(d)} />
                {r.verified > 0 && r.verified < r.rating && (
                  <span className="absolute top-[-2px] h-[7px] w-px bg-ink" style={{ left: `${(r.verified / scale) * 100}%` }} title={`Verified: ${r.verified}`} />
                )}
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <StatusTag status={r.status} provisional={r.provisional} />
                <span className="num text-[11.5px] text-ink-3">
                  {r.rating === 0 ? 'No benchmarks yet' : r.verified > 0 && r.verified < r.rating ? `${r.verified} on verified evidence` : `${r.slots.length} of 3 benchmarks`}
                </span>
              </div>
            </div>
          </button>
        )
      })}
      <div className="flex items-center justify-between px-4 py-2.5 text-[11px] text-ink-3">
        <span>Scale 0–{scale}. Bands: {BANDS.slice(1, 5).map((b) => `${b.label} ${b.min}`).join(' · ')}</span>
      </div>
    </div>
  )
}
