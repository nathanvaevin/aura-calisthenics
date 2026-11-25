import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ClipboardCheck, Copy, Plus, Repeat2, Trash2, UserPlus, X } from 'lucide-react'
import type { BlockKind, Course, CourseSession, CourseWeek, DisciplineId, Exercise, WeekKind, WorkoutBlock } from '@/domain/types'
import { STATIONS } from '@/domain/assessment'
import { DISCIPLINES, DISCIPLINE_IDS, disciplineById, exerciseById, formatValue, progressionById, skillById, stepAt } from '@/domain/catalog'
import { auraFor } from '@/domain/scoring/aura'
import { adaptTarget, makeBlock } from '@/domain/scoring/skills'
import { estimateMinutes } from '@/domain/training'
import { blankSession, blankWeek, moveWeek, uid } from '@/data/courseTemplates'
import { CourseInvite } from './CourseInvite'
import { WeekStrip } from './WeekStrip'
import { courseClock, logForSession, useIsCoach } from '@/data/hooks'
import { isoDay, sessionDate } from '@/data/seed'
import { useStore } from '@/data/store'
import { AuraDot } from '@/ui/AuraField'
import { DisciplineDot, Empty, Eyebrow, Segmented, Sheet, Stepper, Toggle } from '@/ui/primitives'
import { LogSheet } from '@/features/shared/LogView'
import { adherence } from './CoachStudio'
import { ExercisePicker, SkillPicker } from './Pickers'
import { DAYS, DAYS_SHORT, KIND_LABEL, cx, dvar, initials, num, shortDate } from '@/lib/format'

type Tab = 'program' | 'students' | 'results' | 'details'
type Mutate = (fn: (draft: Course) => void) => void

const kindFor = (ex: Exercise): BlockKind =>
  ex.category === 'Preparation' ? 'warmup' : ex.category === 'Flexibility' ? 'mobility' : ex.category === 'Balance' || ex.category.startsWith('Straight-arm') ? 'skill' : 'strength'

const ladderSteps = (b: WorkoutBlock) => (b.progressionId ? progressionById[b.progressionId]?.steps.length ?? 0 : 0)

/** A new block for an exercise, with students allowed two levels either way by default. */
function newBlock(exerciseId: string): WorkoutBlock {
  const b = { ...makeBlock(kindFor(exerciseById[exerciseId]), exerciseId), id: uid() }
  if (b.progressionId && b.level) {
    b.minLevel = Math.max(1, b.level - 2)
    b.maxLevel = Math.min(ladderSteps(b), b.level + 2)
  }
  return b
}

/** Move a block along its ladder, keeping the range students are allowed around it. */
function setLevel(b: WorkoutBlock, level: number) {
  if (!b.progressionId || !b.level) return
  const step = stepAt(b.progressionId, level)
  if (!step) return
  const down = b.level - (b.minLevel ?? b.level)
  const up = (b.maxLevel ?? b.level) - b.level
  b.target = adaptTarget(exerciseById[b.exerciseId], b.target, exerciseById[step.exerciseId], level - b.level)
  b.exerciseId = step.exerciseId
  b.level = level
  b.minLevel = Math.max(1, level - down)
  b.maxLevel = Math.min(ladderSteps(b), level + up)
}

const cloneSession = (s: CourseSession, day: number): CourseSession => ({
  ...structuredClone(s),
  id: uid(),
  day,
  blocks: s.blocks.map((b) => ({ ...structuredClone(b), id: uid() })),
})

const freeDay = (sessions: CourseSession[]) => [0, 1, 2, 3, 4, 5, 6].find((d) => !sessions.some((s) => s.day === d)) ?? 0

export function CourseEditor() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const coach = useIsCoach()
  const meId = useStore((s) => s.meId)
  const course = useStore((s) => s.courses.find((c) => c.id === courseId))
  const mutateCourse = useStore((s) => s.mutateCourse)
  const students = useStore((s) => s.enrollments.filter((e) => e.courseId === courseId).length)
  const [tab, setTab] = useState<Tab>('program')

  if (!coach || !course || course.coachId !== meId) return <Navigate to="/coach" replace />
  const mutate: Mutate = (fn) => mutateCourse(course.id, fn)
  const sessions = course.weeks.reduce((n, w) => n + w.sessions.length, 0)

  return (
    <div>
      <div className="pt-5 lg:pt-9">
        <button onClick={() => navigate('/coach')} className="pressable -ml-1 flex h-10 items-center gap-1.5 rounded-full pr-3 pl-1 text-[13.5px] text-ink-2 hover:text-ink">
          <ArrowLeft size={17} /> Coach Studio
        </button>
      </div>

      <header className="rise pt-2 pb-5">
        <Eyebrow className="mb-1.5">Course builder</Eyebrow>
        <input
          aria-label="Course title"
          className="display w-full bg-transparent text-[36px] outline-none placeholder:text-ink-3 lg:text-[48px]"
          value={course.title}
          placeholder="Course title"
          onChange={(e) => mutate((c) => { c.title = e.target.value })}
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2.5">
          <Segmented
            value={course.status}
            onChange={(status) => mutate((c) => { c.status = status })}
            options={[{ value: 'draft', label: 'Draft' }, { value: 'active', label: 'Active' }, { value: 'archived', label: 'Archived' }]}
          />
          <span className="num text-[12.5px] text-ink-3">
            {course.weeks.length} weeks · {sessions} sessions · {students} {students === 1 ? 'student' : 'students'} · starts {shortDate(`${course.startDate}T00:00:00`)}
          </span>
        </div>
        {course.status === 'draft' && <p className="mt-2 text-[12.5px] text-ink-3">Drafts are hidden from athletes. Set the course to Active when it is ready to join.</p>}
      </header>

      <div className="no-scrollbar -mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          options={[{ value: 'program', label: 'Program' }, { value: 'students', label: 'Students' }, { value: 'results', label: 'Results' }, { value: 'details', label: 'Details' }]}
        />
      </div>

      <div className="mt-6">
        {tab === 'program' && <Program course={course} mutate={mutate} />}
        {tab === 'students' && <Students course={course} />}
        {tab === 'results' && <Results course={course} />}
        {tab === 'details' && <Details course={course} mutate={mutate} />}
      </div>
    </div>
  )
}

// ── Program ──────────────────────────────────────────────────────────────

function Program({ course, mutate }: { course: Course; mutate: Mutate }) {
  const [wi, setWi] = useState(() => Math.min(courseClock(course).weekIndex, course.weeks.length - 1))
  const [openBlock, setOpenBlock] = useState<string | null>(null)
  const [picker, setPicker] = useState<{ sessionId: string; replace?: string } | null>(null)

  const index = Math.min(wi, course.weeks.length - 1)
  const week = course.weeks[index]
  const sessions = [...week.sessions].sort((a, b) => a.day - b.day)

  const session = (c: Course, id: string) => c.weeks[index].sessions.find((s) => s.id === id)
  const editBlock = (sid: string, bid: string, fn: (b: WorkoutBlock) => void) =>
    mutate((c) => {
      const b = session(c, sid)?.blocks.find((x) => x.id === bid)
      if (b) fn(b)
    })

  return (
    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-10">
      {/* Weeks: choose one, or hold one and carry it to another place. */}
      <WeekStrip
        weeks={course.weeks} index={index} onSelect={setWi}
        onAdd={() => { mutate((c) => { c.weeks.push(blankWeek(c.weeks.length + 1)) }); setWi(course.weeks.length) }}
        onMove={(from, to) => {
          // The week being worked on stays the one on screen, wherever it now stands.
          const ids = course.weeks.map((w) => w.id)
          ids.splice(to, 0, ...ids.splice(from, 1))
          mutate((c) => moveWeek(c, from, to))
          setWi(ids.indexOf(week.id))
        }}
        caption={(w) => (
          <>
            <span className="lg:hidden">{w.kind && w.kind !== 'training' ? 'Assessment' : w.focus ? focusLabel(w.focus) : `${w.sessions.length} sessions`}</span>
            <span className="hidden lg:inline">{w.title || (w.kind && w.kind !== 'training' ? 'Assessment' : `${w.sessions.length} sessions`)}</span>
          </>
        )}
      />

      <div className="mt-5 lg:mt-0">
        {/* Week header */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <Eyebrow>Week {index + 1} of {course.weeks.length} · from {shortDate(sessionDate(course, index, 0))}</Eyebrow>
            <div className="flex gap-1">
              <button
                title="Duplicate week" aria-label="Duplicate week" className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"
                onClick={() => { mutate((c) => { const w = c.weeks[index]; c.weeks.splice(index + 1, 0, { ...w, id: uid(), title: w.title, sessions: w.sessions.map((s) => cloneSession(s, s.day)) }) }); setWi(index + 1) }}
              >
                <Copy size={14} />
              </button>
              <button
                title="Delete week" aria-label="Delete week" disabled={course.weeks.length <= 1} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink disabled:opacity-30"
                onClick={() => { if (window.confirm(`Delete week ${index + 1} and its ${week.sessions.length} sessions?`)) { mutate((c) => { c.weeks.splice(index, 1) }); setWi(Math.max(0, index - 1)) } }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <input className="display mt-2 w-full bg-transparent text-[26px] outline-none placeholder:text-ink-3" placeholder="Week title" value={week.title} onChange={(e) => mutate((c) => { c.weeks[index].title = e.target.value })} />
          <textarea className="mt-1 w-full resize-none bg-transparent text-[14px] leading-relaxed text-ink-2 outline-none placeholder:text-ink-3" rows={2} placeholder="Weekly objective: what should students achieve this week?" value={week.objective} onChange={(e) => mutate((c) => { c.weeks[index].objective = e.target.value })} />
          <WeekShape week={week} onKind={(kind) => mutate((c) => { const w = c.weeks[index]; if (kind === 'training') delete w.kind; else { w.kind = kind; delete w.focus } })} onFocus={(focus) => mutate((c) => { const w = c.weeks[index]; if (focus) w.focus = focus; else delete w.focus })} />
        </div>
        {week.kind && week.kind !== 'training' && <AssessmentWeek course={course} kind={week.kind} />}

        {/* Sessions */}
        <div className="mt-3 space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="card p-4">
              <input aria-label="Session title" className="w-full bg-transparent text-[19px] font-medium outline-none placeholder:text-ink-3" value={s.title} placeholder="Session title" onChange={(e) => mutate((c) => { const x = session(c, s.id); if (x) x.title = e.target.value })} />
              <div className="mt-2 flex items-center gap-2">
                <select aria-label="Day" className="field !h-9 !w-[118px] shrink-0 !rounded-xl !pl-3 text-[13px]" value={s.day} onChange={(e) => mutate((c) => { const x = session(c, s.id); if (x) x.day = Number(e.target.value) })}>
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
                <span className="min-w-0 flex-1 truncate text-[11.5px] text-ink-3">{shortDate(sessionDate(course, index, s.day))} · {s.blocks.length} exercises{s.blocks.length ? ` · ~${estimateMinutes(s.blocks)} min` : ''}</span>
                <button title="Duplicate session" aria-label="Duplicate session" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink" onClick={() => mutate((c) => { const w = c.weeks[index]; w.sessions.push(cloneSession(s, freeDay(w.sessions))) })}>
                  <Copy size={14} />
                </button>
                <button title="Delete session" aria-label="Delete session" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink" onClick={() => { if (s.blocks.length === 0 || window.confirm(`Delete “${s.title}”?`)) mutate((c) => { const w = c.weeks[index]; w.sessions = w.sessions.filter((x) => x.id !== s.id) }) }}>
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-3 space-y-1.5">
                {s.blocks.map((b, bi) => (
                  <BlockEditor
                    key={b.id}
                    block={b}
                    focus={week.focus}
                    open={openBlock === b.id}
                    onToggle={() => setOpenBlock(openBlock === b.id ? null : b.id)}
                    onEdit={(fn) => editBlock(s.id, b.id, fn)}
                    onMove={(dir) => mutate((c) => { const list = session(c, s.id)?.blocks; if (!list) return; const j = bi + dir; if (j < 0 || j >= list.length) return; [list[bi], list[j]] = [list[j], list[bi]] })}
                    onDuplicate={() => mutate((c) => { session(c, s.id)?.blocks.splice(bi + 1, 0, { ...structuredClone(b), id: uid() }) })}
                    onDelete={() => mutate((c) => { const x = session(c, s.id); if (x) x.blocks = x.blocks.filter((y) => y.id !== b.id) })}
                    onReplace={() => setPicker({ sessionId: s.id, replace: b.id })}
                    first={bi === 0}
                    last={bi === s.blocks.length - 1}
                  />
                ))}
              </div>
              <button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong text-[13.5px] font-medium text-ink-2 hover:bg-surface-2 hover:text-ink" onClick={() => setPicker({ sessionId: s.id })}>
                <Plus size={15} /> Add exercise
              </button>
            </div>
          ))}
          <button
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-card border border-dashed border-line-strong text-[14px] font-medium text-ink-2 hover:bg-surface hover:text-ink"
            onClick={() => mutate((c) => { const w = c.weeks[index]; w.sessions.push(blankSession(freeDay(w.sessions))) })}
          >
            <Plus size={16} /> Add session
          </button>
        </div>
      </div>

      <ExercisePicker
        open={!!picker}
        onClose={() => setPicker(null)}
        title={picker?.replace ? 'Replace exercise' : 'Add an exercise'}
        onPick={(exerciseId) => {
          const target = picker
          if (!target) return
          const fresh = newBlock(exerciseId)
          mutate((c) => {
            const s = session(c, target.sessionId)
            if (!s) return
            if (target.replace) {
              const b = s.blocks.find((x) => x.id === target.replace)
              if (b) Object.assign(b, { ...fresh, id: b.id, sets: b.sets, note: b.note })
            } else {
              s.blocks.push(fresh)
            }
          })
          if (!target.replace) setOpenBlock(fresh.id)
        }}
      />
    </div>
  )
}

function BlockEditor({
  block: b, focus, open, onToggle, onEdit, onMove, onDuplicate, onDelete, onReplace, first, last,
}: {
  block: WorkoutBlock
  focus?: CourseWeek['focus']
  open: boolean
  onToggle: () => void
  onEdit: (fn: (b: WorkoutBlock) => void) => void
  onMove: (dir: number) => void
  onDuplicate: () => void
  onDelete: () => void
  onReplace: () => void
  first: boolean
  last: boolean
}) {
  const ex = exerciseById[b.exerciseId]
  const steps = ladderSteps(b)
  const ladder = steps > 0 && b.level !== undefined
  const adjustable = ladder && b.minLevel !== b.maxLevel
  const color = dvar(ex.discipline)
  const unit = ex.metric === 'hold' ? 's' : ex.perSide ? '/side' : ''
  const icon = 'flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-surface-3 hover:text-ink disabled:opacity-25'

  return (
    <div className={cx('rounded-2xl border transition-colors', open ? 'border-line-strong bg-surface-2' : 'border-transparent bg-surface-2/60 hover:bg-surface-2')}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-3 py-2.5 text-left">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium" style={{ background: `color-mix(in oklab, ${color} 16%, transparent)`, color }}>
          {b.level ? `L${b.level}` : '·'}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 truncate text-[14px] font-medium">{ex.name}{focus && <RoleTag primary={!!b.primary} />}</span>
          <span className="block truncate text-[11.5px] text-ink-3">
            {b.note ? `${b.note} · ` : ''}{KIND_LABEL[b.kind]} · {b.sets} × {formatValue(ex, b.target)} · rest {b.rest}s{ladder ? (adjustable ? ` · L${b.minLevel}–${b.maxLevel}` : ' · locked') : ''}
          </span>
        </span>
        <ChevronDown size={15} className={cx('shrink-0 text-ink-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-line px-3 pt-3.5 pb-3">
          <div className="flex items-center gap-2">
            <select aria-label="Block type" className="field !h-10 !w-auto min-w-[140px] !rounded-xl !pl-3 text-[13.5px]" value={b.kind} onChange={(e) => onEdit((x) => { x.kind = e.target.value as BlockKind })}>
              {(Object.keys(KIND_LABEL) as BlockKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
            </select>
            <button className="btn btn-quiet btn-sm !h-10" onClick={onReplace}><Repeat2 size={14} /> Change exercise</button>
          </div>

          {ladder ? (
            <div className="rounded-xl bg-surface p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium">Assigned level</span>
                  <span className="block text-[11.5px] text-ink-3">{progressionById[b.progressionId!].name} ladder, {steps} levels</span>
                </span>
                <Stepper value={b.level!} min={1} max={steps} onChange={(v) => onEdit((x) => setLevel(x, v))} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium">Students may adjust</span>
                  <span className="block text-[11.5px] text-ink-3">{adjustable ? `Between level ${b.minLevel} and level ${b.maxLevel}` : 'Everyone does the assigned level'}</span>
                </span>
                <Toggle
                  on={adjustable}
                  label="Students may adjust the difficulty"
                  onChange={(on) => onEdit((x) => { x.minLevel = on ? Math.max(1, x.level! - 2) : x.level; x.maxLevel = on ? Math.min(steps, x.level! + 2) : x.level })}
                />
              </div>
              {adjustable && (
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-[12.5px] text-ink-2"><span className="text-ink-3">Easiest · </span>{exerciseById[stepAt(b.progressionId!, b.minLevel!)!.exerciseId].name}</span>
                    <Stepper value={b.minLevel!} min={1} max={b.level!} onChange={(v) => onEdit((x) => { x.minLevel = v })} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-[12.5px] text-ink-2"><span className="text-ink-3">Hardest · </span>{exerciseById[stepAt(b.progressionId!, b.maxLevel!)!.exerciseId].name}</span>
                    <Stepper value={b.maxLevel!} min={b.level!} max={steps} onChange={(v) => onEdit((x) => { x.maxLevel = v })} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="rounded-xl bg-surface p-3 text-[12.5px] text-ink-3">This exercise is not on a difficulty ladder, so every student performs it as written.</p>
          )}

          <div className="grid grid-cols-3 gap-2">
            {([
              ['Sets', b.sets, 1, 12, 1, '', (v: number) => onEdit((x) => { x.sets = v })],
              [ex.metric === 'hold' ? 'Hold' : 'Reps', b.target, 1, 600, ex.metric === 'hold' && b.target >= 20 ? 5 : 1, unit, (v: number) => onEdit((x) => { x.target = v })],
              ['Rest', b.rest, 0, 300, 15, 's', (v: number) => onEdit((x) => { x.rest = v })],
            ] as const).map(([label, value, min, max, step, suffix, set]) => (
              <div key={label} className="rounded-xl bg-surface px-1.5 py-2.5 text-center">
                <div className="mb-2 font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">{label}</div>
                <div className="flex items-center justify-between">
                  <button aria-label={`Less ${label}`} className={icon} onClick={() => set(Math.max(min, value - step))}>−</button>
                  <span className="num text-[15px] font-medium">{value}<span className="text-[11px] text-ink-3">{suffix}</span></span>
                  <button aria-label={`More ${label}`} className={icon} onClick={() => set(Math.min(max, value + step))}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3">
            <span className="min-w-0">
              <span className="block text-[13px] font-medium">Part of the week’s focus</span>
              <span className="block text-[11.5px] text-ink-3">{b.primary ? 'Primary work: builds this week’s focus' : 'Support work: balance, shoulder health, mobility, the rest of the body'}</span>
            </span>
            <Toggle on={!!b.primary} label="Part of the week’s focus" onChange={(on) => onEdit((x) => { if (on) x.primary = true; else delete x.primary })} />
          </div>

          <input className="field !h-11 !rounded-xl text-[13.5px]" placeholder="Purpose or coaching note, shown to students during this exercise" value={b.note ?? ''} onChange={(e) => onEdit((x) => { x.note = e.target.value || undefined })} />

          <div className="flex items-center justify-between">
            <div className="flex gap-0.5">
              <button aria-label="Move up" className={icon} disabled={first} onClick={() => onMove(-1)}><ArrowUp size={14} /></button>
              <button aria-label="Move down" className={icon} disabled={last} onClick={() => onMove(1)}><ArrowDown size={14} /></button>
              <button aria-label="Duplicate exercise" className={icon} onClick={onDuplicate}><Copy size={14} /></button>
            </div>
            <button className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] text-ink-3 hover:bg-surface-3 hover:text-ink" onClick={onDelete}><Trash2 size={13} /> Remove</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Week shape: kind, focus, balance ─────────────────────────────────────

const focusLabel = (f: NonNullable<CourseWeek['focus']>) => (f === 'full' ? 'Full body' : disciplineById[f].short)

export function RoleTag({ primary }: { primary: boolean }) {
  return primary
    ? <span className="shrink-0 rounded-full bg-ink px-1.5 py-px font-mono text-[8.5px] tracking-[0.1em] text-bg uppercase">Focus</span>
    : <span className="shrink-0 rounded-full border border-line px-1.5 py-px font-mono text-[8.5px] tracking-[0.1em] text-ink-3 uppercase">Support</span>
}

function WeekShape({ week, onKind, onFocus }: { week: CourseWeek; onKind: (k: WeekKind) => void; onFocus: (f: CourseWeek['focus'] | undefined) => void }) {
  const kind = week.kind ?? 'training'
  const blocks = week.sessions.flatMap((s) => s.blocks).filter((b) => b.kind !== 'warmup' && b.kind !== 'cooldown')
  const sets = blocks.reduce((n, b) => n + b.sets, 0)
  const focusSets = blocks.filter((b) => b.primary).reduce((n, b) => n + b.sets, 0)
  return (
    <div className="mt-3 space-y-3 border-t border-line pt-3">
      <Segmented<WeekKind> value={kind} onChange={onKind} options={[{ value: 'training', label: 'Training' }, { value: 'baseline', label: 'Initial assessment' }, { value: 'retest', label: 'Final re-test' }]} />
      {kind === 'training' && (
        <div>
          <Eyebrow className="mb-2">Primary focus</Eyebrow>
          <div className="flex flex-wrap gap-1.5">
            {[...DISCIPLINE_IDS, 'full' as const].map((f) => (
              <button key={f} className="chip" data-on={week.focus === f} onClick={() => onFocus(week.focus === f ? undefined : f)}>
                {f !== 'full' && week.focus !== f && <DisciplineDot id={f as DisciplineId} size={6} />}{focusLabel(f)}
              </button>
            ))}
          </div>
          {week.focus && sets > 0 && (
            <p className="mt-2 text-[12px] leading-relaxed text-ink-3">
              <span className="num font-medium text-ink-2">{Math.round((focusSets / sets) * 100)}%</span> of this week’s working sets build the focus; the rest is support. Mark an exercise as focus or support by opening it.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** An assessment week: the group assessment it stands for, created from here and opened from here. */
function AssessmentWeek({ course, kind }: { course: Course; kind: 'baseline' | 'retest' }) {
  const navigate = useNavigate()
  const meId = useStore((s) => s.meId)
  const assessments = useStore((s) => s.assessments)
  const create = useStore((s) => s.createAssessment)
  const mine = assessments.filter((a) => a.courseId === course.id && a.origin === 'local' && a.coachId === meId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const existing = mine.find((a) => a.kind === kind)
  const baseline = mine.find((a) => a.kind === 'baseline' && a.status === 'finalised') ?? mine.find((a) => a.kind === 'baseline')
  const open = () => {
    const id = existing?.id ?? create({
      title: kind === 'baseline' ? 'Initial assessment' : 'Final assessment', groupName: course.title, courseId: course.id,
      stations: kind === 'retest' && baseline ? baseline.stations : STATIONS.map((s) => s.id), kind, baselineId: kind === 'retest' ? baseline?.id : undefined,
      mode: 'stations', groups: 3,
    })
    navigate(`/coach/assessment/${id}?tab=invite`)
  }
  return (
    <div className="card mt-3 flex items-start gap-3.5 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-bg"><ClipboardCheck size={18} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-medium">{kind === 'baseline' ? 'The initial assessment' : 'The final re-test'}</span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-2">
          {existing
            ? `${existing.status === 'finalised' ? 'Finalised' : 'Open'} · ${existing.title}. Students see it in this week of the course.`
            : kind === 'baseline'
              ? 'Create it when the class meets: one code on the wall, every station, by stations in three groups. Everyone who joins is enrolled in this course.'
              : baseline
                ? `Repeats ${baseline.title.toLowerCase()} with the same stations and people, so every result is compared with week 1.`
                : 'No initial assessment for this course yet. A re-test can still be run, but there will be nothing to compare it with.'}
        </span>
        <button className="btn btn-primary btn-sm mt-3" onClick={open}>{existing ? 'Open the session' : kind === 'baseline' ? 'Create the initial assessment' : 'Create the re-test'} <ArrowRight size={14} /></button>
        {kind === 'baseline' && <p className="mt-3 text-[12px] leading-relaxed text-ink-3">While this week has no sessions of its own, each athlete sees two short starter sessions at the level their results put them on. Add a session here and yours are shown instead.</p>}
      </span>
    </div>
  )
}

// ── Students ─────────────────────────────────────────────────────────────

function Students({ course }: { course: Course }) {
  const navigate = useNavigate()
  const athletes = useStore((s) => s.athletes)
  const enrollments = useStore((s) => s.enrollments)
  const logs = useStore((s) => s.logs)
  const evidence = useStore((s) => s.evidence)
  const meId = useStore((s) => s.meId)
  const enroll = useStore((s) => s.enroll)
  const unenroll = useStore((s) => s.unenroll)
  const [addOpen, setAddOpen] = useState(false)

  const enrolled = enrollments.filter((e) => e.courseId === course.id)
  const others = Object.values(athletes).filter((a) => a.id !== meId && !enrolled.some((e) => e.athleteId === a.id))

  return (
    <div className="max-w-3xl">
      <div className="mb-3 flex items-center justify-between">
        <Eyebrow>{enrolled.length} enrolled</Eyebrow>
        <button className="btn btn-quiet btn-sm" onClick={() => setAddOpen(true)}><UserPlus size={14} /> Add student</button>
      </div>
      {enrolled.length === 0 ? (
        <Empty title="No students yet">Send them the link, under Add student.</Empty>
      ) : (
        <div className="card divide-y divide-line">
          {enrolled.map((e) => {
            const athlete = athletes[e.athleteId]
            if (!athlete) return null
            const a = adherence(course, logs, athlete.id, evidence)
            const aura = auraFor(evidence.filter((x) => x.athleteId === athlete.id))
            return (
              <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => navigate(`/athlete/${athlete.id}`)}>
                  <AuraDot mix={aura.mix} size={40}>{initials(athlete.name)}</AuraDot>
                  <span className="min-w-0">
                    <span className="block truncate text-[14.5px] font-medium">{athlete.name}</span>
                    <span className="num block truncate text-[12px] text-ink-3">Aura {num(aura.aura)} · {a.due ? `${a.done} of ${a.due} sessions done` : 'no sessions due yet'}</span>
                  </span>
                </button>
                <button aria-label={`Remove ${athlete.name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink" onClick={() => window.confirm(`Remove ${athlete.name} from this course? Their logged sessions are kept.`) && unenroll(e.id)}>
                  <X size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}
      <p className="mt-3 text-[12px] leading-relaxed text-ink-3">Send the invite link to one person or to a whole group. An assessment does it too: create one for this course in Coach Studio, show its code, and everyone who joins is enrolled. Athletes can also join an Active course themselves from their Train tab.</p>

      <Sheet open={addOpen} onClose={() => setAddOpen(false)} eyebrow={course.title} title="Add a student">
        <CourseInvite course={course} code />
        {others.length > 0 && <Eyebrow className="mt-6 mb-2">Or add someone already here</Eyebrow>}
        {others.length > 0 && (
          <div className="card divide-y divide-line">
            {others.map((a) => (
              <button key={a.id} className="flex w-full items-center gap-3 px-4 py-3 text-left first:rounded-t-card last:rounded-b-card hover:bg-surface-2" onClick={() => enroll(course.id, a.id)}>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-medium">{a.name}</span>
                  <span className="block truncate text-[12px] text-ink-3">@{a.handle}{a.city ? ` · ${a.city}` : ''}</span>
                </span>
                <Plus size={16} className="text-ink-3" />
              </button>
            ))}
          </div>
        )}
      </Sheet>
    </div>
  )
}

// ── Results ──────────────────────────────────────────────────────────────

/** What every student actually did in one session, exercise by exercise. */
function Results({ course }: { course: Course }) {
  const athletes = useStore((s) => s.athletes)
  const enrollments = useStore((s) => s.enrollments)
  const logs = useStore((s) => s.logs)
  const students = enrollments.filter((e) => e.courseId === course.id).map((e) => athletes[e.athleteId]).filter(Boolean)
  // Open on the most recent session that at least one student has completed.
  const [start] = useState(() => {
    for (let w = course.weeks.length - 1; w >= 0; w--) {
      for (const x of [...course.weeks[w].sessions].sort((a, b) => b.day - a.day)) {
        if (students.some((a) => logForSession(logs, a.id, x.id))) return { wi: w, sid: x.id as string | null }
      }
    }
    return { wi: Math.min(courseClock(course).weekIndex, course.weeks.length - 1), sid: null as string | null }
  })
  const [wi, setWi] = useState(start.wi)
  const [sid, setSid] = useState<string | null>(start.sid)
  const [logOpen, setLogOpen] = useState<string | null>(null)

  const sessions = [...course.weeks[Math.min(wi, course.weeks.length - 1)].sessions].sort((a, b) => a.day - b.day)
  const session = sessions.find((s) => s.id === sid) ?? sessions[0]
  const byStudent = session ? students.map((a) => ({ athlete: a, log: logForSession(logs, a.id, session.id) })) : []
  const done = byStudent.filter((x) => x.log).length

  return (
    <div className="max-w-3xl">
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
        {course.weeks.map((w, i) => <button key={w.id} className="chip" data-on={i === wi} onClick={() => { setWi(i); setSid(null) }}>Week {i + 1}</button>)}
      </div>
      <div className="no-scrollbar -mx-5 mt-2 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
        {sessions.map((s) => <button key={s.id} className="chip" data-on={s.id === session?.id} onClick={() => setSid(s.id)}>{DAYS_SHORT[s.day]} · {s.title}</button>)}
      </div>

      {!session ? (
        <p className="mt-5 rounded-card border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">No sessions in this week.</p>
      ) : students.length === 0 ? (
        <p className="mt-5 rounded-card border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">No students enrolled yet.</p>
      ) : (
        <>
          <p className="mt-5 text-[13px] text-ink-2">
            <span className="num font-medium text-ink">{done} of {students.length}</span> students have completed {session.title}. Each row shows the variation they chose and what they logged.
          </p>
          <div className="mt-3 space-y-3">
            {session.blocks.map((b) => {
              const ex = exerciseById[b.exerciseId]
              return (
                <div key={b.id} className="card overflow-hidden">
                  <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-4 py-2.5">
                    <span className="flex min-w-0 items-center gap-2 text-[14px] font-medium">
                      <DisciplineDot id={ex.discipline} /><span className="truncate">{ex.name}</span>
                      {b.level && <span className="shrink-0 font-mono text-[10.5px] text-ink-3">L{b.level}</span>}
                    </span>
                    <span className="num shrink-0 text-[12.5px] text-ink-2">{b.sets} × {formatValue(ex, b.target)}</span>
                  </div>
                  <div className="divide-y divide-line">
                    {byStudent.map(({ athlete, log }) => {
                      const entry = log?.entries.find((e) => e.blockId === b.id)
                      const diff = entry?.level && entry.assignedLevel ? entry.level - entry.assignedLevel : 0
                      const did = entry ? exerciseById[entry.exerciseId] : null
                      return (
                        <button key={athlete.id} disabled={!log} onClick={() => log && setLogOpen(log.id)} className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-surface-2 disabled:hover:bg-transparent">
                          <span className="w-[76px] shrink-0 truncate text-[13px] text-ink-2">{athlete.name.split(' ')[0]}</span>
                          {entry && did ? (
                            <>
                              <span className={cx('shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium', diff > 0 ? 'bg-good/15 text-good' : diff < 0 ? 'bg-warn/15 text-warn' : 'bg-surface-2 text-ink-3')}>
                                {entry.level ? `L${entry.level}` : '—'}
                              </span>
                              <span className="min-w-0 flex-1 truncate text-[13px]">{entry.exerciseId === b.exerciseId ? <span className="text-ink-3">as assigned</span> : did.name}</span>
                              <span className="num shrink-0 text-[12.5px]">{entry.sets.map((s) => s.value).join(' · ')}</span>
                            </>
                          ) : (
                            <span className="text-[12.5px] text-ink-3">{log ? 'skipped' : 'not done'}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
      <LogSheet logId={logOpen} onClose={() => setLogOpen(null)} coach />
    </div>
  )
}

// ── Details ──────────────────────────────────────────────────────────────

const toMonday = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return null
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return isoDay(d)
}

function Details({ course, mutate }: { course: Course; mutate: Mutate }) {
  const navigate = useNavigate()
  const deleteCourse = useStore((s) => s.deleteCourse)
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <div className="max-w-2xl space-y-5">
      <label className="block"><Eyebrow className="mb-2">Tagline</Eyebrow><input className="field" value={course.tagline} placeholder="One line that sells the course" onChange={(e) => mutate((c) => { c.tagline = e.target.value })} /></label>
      <label className="block"><Eyebrow className="mb-2">Description</Eyebrow><textarea className="field" rows={3} value={course.description} placeholder="Who it is for, how it is structured, what students need" onChange={(e) => mutate((c) => { c.description = e.target.value })} /></label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <Eyebrow className="mb-2">Focus</Eyebrow>
          <select className="field" value={course.focus} onChange={(e) => mutate((c) => { c.focus = e.target.value as Course['focus'] })}>
            <option value="full">Full body</option>
            {DISCIPLINES.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <label className="block">
          <Eyebrow className="mb-2">Format</Eyebrow>
          <select className="field" value={course.format} onChange={(e) => mutate((c) => { c.format = e.target.value as Course['format'] })}>
            <option value="group">Group course</option>
            <option value="individual">Individual coaching</option>
            <option value="online">Online program</option>
          </select>
        </label>
      </div>

      <label className="block">
        <Eyebrow className="mb-2">Week 1 starts</Eyebrow>
        <input type="date" className="field" value={course.startDate} onChange={(e) => { const monday = toMonday(e.target.value); if (monday) mutate((c) => { c.startDate = monday }) }} />
        <span className="mt-1.5 block text-[12px] text-ink-3">Weeks run Monday to Sunday, so the date snaps to the Monday of the week you pick. The course runs {course.weeks.length} weeks, to {shortDate(sessionDate(course, course.weeks.length - 1, 6))}.</span>
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Eyebrow>Milestones students work toward</Eyebrow>
          <button className="btn btn-quiet btn-sm" onClick={() => setPickerOpen(true)}><Plus size={14} /> Add</button>
        </div>
        {course.milestones.length === 0 ? (
          <p className="rounded-card border border-dashed border-line-strong p-4 text-[13px] text-ink-3">Pick skills from the tree. Students see their own progress toward each one on the course page.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {course.milestones.filter((id) => skillById[id]).map((id) => (
              <span key={id} className="inline-flex h-9 items-center gap-2 rounded-full border border-line pr-1.5 pl-3 text-[13px]">
                <DisciplineDot id={skillById[id].discipline} size={6} />{skillById[id].name}
                <button aria-label={`Remove ${skillById[id].name}`} className="flex h-6 w-6 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink" onClick={() => mutate((c) => { c.milestones = c.milestones.filter((m) => m !== id) })}><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-line pt-5">
        <button
          className="flex items-center gap-2 text-[13.5px] text-ink-3 hover:text-ink"
          onClick={() => {
            if (window.confirm(`Delete “${course.title}” and remove all enrolments? Sessions students already logged stay in their history.`)) {
              deleteCourse(course.id)
              navigate('/coach')
            }
          }}
        >
          <Trash2 size={14} /> Delete this course
        </button>
      </div>

      <SkillPicker open={pickerOpen} onClose={() => setPickerOpen(false)} exclude={course.milestones} onPick={(id) => mutate((c) => { c.milestones.push(id) })} />
    </div>
  )
}
