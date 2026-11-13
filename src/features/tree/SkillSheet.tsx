import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowUpRight, Check, Lock, Play, Target } from 'lucide-react'
import type { Skill } from '@/domain/types'
import { MUSCLES, disciplineById, exerciseById, formatValue, skillById, unlockedBy } from '@/domain/catalog'
import { BANDS } from '@/domain/scoring/config'
import { pathTo, trainingFor, type SkillStatus } from '@/domain/scoring/skills'
import { buildGoalWorkout } from '@/domain/training'
import { useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { MuscleMap } from '@/ui/MuscleMap'
import { Bar, DisciplineDot, Eyebrow, Sheet, TierTag } from '@/ui/primitives'
import { LogEvidenceSheet } from '@/features/shared/Explainers'
import { useStartWorkout } from '@/features/workout/useStart'
import { cx, dvar, shortDate } from '@/lib/format'

function StateMark({ status, color }: { status: SkillStatus; color: string }) {
  if (status.state === 'mastered')
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: color, color: 'var(--bg)', opacity: status.implied ? 0.55 : 1 }}>
        <Check size={13} strokeWidth={3} />
      </span>
    )
  if (status.state === 'available') return <span className="h-6 w-6 shrink-0 rounded-full border-[1.6px]" style={{ borderColor: color }} />
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-3">
      <Lock size={11} />
    </span>
  )
}

export function SkillRow({ skill, status, onClick, note }: { skill: Skill; status: SkillStatus; onClick?: () => void; note?: string }) {
  const ex = exerciseById[skill.exerciseId]
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-[22px] last:rounded-b-[22px] hover:bg-surface-2">
      <StateMark status={status} color={dvar(skill.discipline)} />
      <span className="min-w-0 flex-1">
        <span className={cx('block truncate text-[14px] font-medium', status.state === 'locked' && 'text-ink-2')}>{skill.name}</span>
        <span className="block truncate text-[12px] text-ink-3">
          {note ??
            (status.state === 'mastered'
              ? status.implied ? 'Implied by a harder skill' : `Mastered${status.achievedAt ? ` · ${shortDate(status.achievedAt)}` : ''}`
              : status.best > 0 ? `Best ${formatValue(ex, status.best)} of ${formatValue(ex, skill.threshold)}` : status.state === 'available' ? 'Ready to attempt' : 'Locked')}
        </span>
      </span>
      {status.state === 'mastered' && status.tier && !status.implied ? <TierTag tier={status.tier} compact /> : <span className="num text-[12px] text-ink-3">{skill.rating}</span>}
    </button>
  )
}

/** Everything about one node: where you are, what is missing, what to train, what comes next. */
export function SkillSheet({ skillId, onClose, onOpenSkill }: { skillId: string | null; onClose: () => void; onOpenSkill: (id: string) => void }) {
  const me = useMe()
  const toggleGoal = useStore((s) => s.toggleGoal)
  const media = useStore((s) => s.media)
  const navigate = useNavigate()
  const start = useStartWorkout()
  const [logOpen, setLogOpen] = useState(false)

  // Keep the last skill on screen while the sheet animates out.
  const lastId = useRef<string | null>(null)
  if (skillId) lastId.current = skillId
  const skill = lastId.current ? skillById[lastId.current] : null
  if (!skill) return null

  const ex = exerciseById[skill.exerciseId]
  const status = me.statuses[skill.id]
  const color = dvar(skill.discipline)
  const band = BANDS.find((b) => b.id === skill.band)!
  const isGoal = me.athlete.goals.includes(skill.id)
  const missing = pathTo(skill.id, me.statuses)
  const before = missing.slice(0, -1)
  const picks = trainingFor(skill, me.evidence)
  const next = unlockedBy(skill.id)
  const mastered = status.state === 'mastered'

  return (
    <>
      <Sheet
        open={!!skillId}
        onClose={onClose}
        eyebrow={<span className="flex items-center gap-2"><DisciplineDot id={skill.discipline} size={7} />{disciplineById[skill.discipline].name} · {band.label}</span>}
        title={skill.name}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex h-[22px] items-center gap-1 rounded-full px-2 font-mono text-[9.5px] font-medium tracking-[0.1em] uppercase"
            style={mastered ? { background: color, color: 'var(--bg)' } : { border: `1px solid ${status.state === 'available' ? color : 'var(--line-strong)'}`, color: status.state === 'available' ? color : 'var(--text-3)' }}
          >
            {mastered ? (status.implied ? 'Implied' : 'Mastered') : status.state === 'available' ? 'Available' : 'Locked'}
          </span>
          {mastered && status.tier && !status.implied && <TierTag tier={status.tier} />}
          <span className="num text-[12.5px] text-ink-2">{skill.rating}-point benchmark</span>
        </div>

        {/* Where I am */}
        <div className="card mt-5 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <Eyebrow>Mastery criteria</Eyebrow>
              <div className="mt-1.5 text-[16px] font-medium">{formatValue(ex, skill.threshold, true)}{ex.metric === 'hold' ? ' hold' : ''}</div>
            </div>
            <div className="text-right">
              <Eyebrow>Your best</Eyebrow>
              <div className="display num mt-1 text-[28px]">{status.best ? formatValue(ex, status.best) : '—'}</div>
            </div>
          </div>
          <Bar value={status.progress} color={color} className="mt-3" height={4} />
          {ex.standard && <p className="mt-3 text-[12.5px] leading-snug text-ink-2"><span className="text-ink-3">Counts when: </span>{ex.standard}</p>}
          {status.implied && <p className="mt-2 text-[12.5px] leading-snug text-ink-3">You have demonstrated a skill that depends on this one, so it is treated as mastered. Log it directly to put it on record.</p>}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button className="btn btn-primary" onClick={() => setLogOpen(true)}>{mastered && !status.implied ? 'Log a new best' : 'Log an attempt'}</button>
          <button className={cx('btn', isGoal ? 'btn-quiet' : 'btn-outline')} onClick={() => toggleGoal(skill.id)}>
            <Target size={15} />{isGoal ? 'Goal set' : 'Set as goal'}
          </button>
        </div>
        {!mastered && (
          <button
            className="btn btn-outline mt-2.5 w-full"
            onClick={() => {
              const w = buildGoalWorkout(skill.id, me.evidence, me.statuses)
              if (w) {
                onClose()
                start({ type: 'goal', skillId: skill.id }, w.title, w.blocks)
              }
            }}
          >
            <Play size={14} fill="currentColor" /> Train toward this now
          </button>
        )}

        {/* What I'm missing */}
        {before.length > 0 && (
          <section className="mt-7">
            <Eyebrow className="mb-3">What stands between you and this · {before.length}</Eyebrow>
            <div className="card divide-y divide-line">
              {before.map((s) => <SkillRow key={s.id} skill={s} status={me.statuses[s.id]} onClick={() => onOpenSkill(s.id)} />)}
            </div>
          </section>
        )}

        {skill.requires.length > 0 && before.length === 0 && (
          <section className="mt-7">
            <Eyebrow className="mb-3">Prerequisites</Eyebrow>
            <div className="card divide-y divide-line">
              {skill.requires.map((id) => <SkillRow key={id} skill={skillById[id]} status={me.statuses[id]} onClick={() => onOpenSkill(id)} />)}
            </div>
          </section>
        )}

        {/* What I should train */}
        {!mastered && picks.length > 0 && (
          <section className="mt-7">
            <Eyebrow className="mb-3">What to train</Eyebrow>
            <div className="card divide-y divide-line">
              {picks.map((p) => {
                const e = exerciseById[p.exerciseId]
                return (
                  <button key={p.exerciseId} onClick={() => navigate(`/library/${e.id}`)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-[22px] last:rounded-b-[22px] hover:bg-surface-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">{e.name}</span>
                      <span className="block truncate text-[12px] text-ink-3">{p.reason}{p.level ? ` · Level ${p.level}` : ''}</span>
                    </span>
                    <span className="num text-[12px] text-ink-2">{e.dose.sets} × {e.dose.range[0]}–{formatValue(e, e.dose.range[1])}</span>
                    <ArrowUpRight size={14} className="text-ink-3" />
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* The movement */}
        <section className="mt-7">
          <Eyebrow className="mb-3">The movement</Eyebrow>
          <div className="card flex items-center gap-4 p-4">
            <MuscleMap primary={ex.primary} secondary={ex.secondary} stabilizers={ex.stabilizers} color={color} height={132} className="shrink-0" />
            <div className="min-w-0">
              <p className="text-[13px] leading-snug text-ink-2">{ex.summary}</p>
              <p className="mt-2 text-[12px] text-ink-3">{ex.primary.map((m) => MUSCLES[m].name).join(', ')}</p>
              <button onClick={() => navigate(`/library/${ex.id}`)} className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-medium underline decoration-line-strong underline-offset-4">
                {media[ex.id] ? 'Watch the demonstration' : 'Technique and variations'} <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {ex.cues.map((c) => (
              <li key={c} className="flex gap-2.5 text-[13.5px] leading-snug text-ink-2"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: color }} />{c}</li>
            ))}
          </ul>
        </section>

        {/* What comes next */}
        {next.length > 0 && (
          <section className="mt-7">
            <Eyebrow className="mb-3">Opens the way to</Eyebrow>
            <div className="card divide-y divide-line">
              {next.map((s) => <SkillRow key={s.id} skill={s} status={me.statuses[s.id]} onClick={() => onOpenSkill(s.id)} />)}
            </div>
          </section>
        )}
      </Sheet>
      <LogEvidenceSheet exerciseId={logOpen ? ex.id : null} open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  )
}
