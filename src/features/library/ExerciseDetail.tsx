import { lazy, Suspense, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Play, Video } from 'lucide-react'
import { EQUIPMENT, EXERCISES, MUSCLES, disciplineById, exerciseById, formatValue, placementsOf, skillsUsing, stepAt } from '@/domain/catalog'
import { bandOf } from '@/domain/scoring/config'
import { curveRating } from '@/domain/scoring/curve'
import { bestEvidence } from '@/domain/scoring/mastery'
import { makeBlock } from '@/domain/scoring/skills'
import { useIsCoach, useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { MuscleLegend, MuscleMap } from '@/ui/MuscleMap'
import { DisciplineDot, Eyebrow, SectionTitle, TierTag } from '@/ui/primitives'
import { LogEvidenceSheet } from '@/features/shared/Explainers'
import { SkillRow, SkillSheet } from '@/features/tree/SkillSheet'
import { useStartWorkout } from '@/features/workout/useStart'
import { ExerciseRow } from './Library'
import { cx, dvar } from '@/lib/format'
import { publishedFor } from '@/domain/media'

// The animated demonstration brings the 3D engine: fetched only for an exercise that has one published.
const ExerciseDemos = lazy(() => import('./Demos'))

/** Plays a coach-supplied demonstration from a YouTube, Vimeo or direct video link. */
export function VideoEmbed({ url }: { url: string }) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  const src = yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}` : vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : null
  return (
    <div className="aspect-video w-full overflow-hidden rounded-[22px] border border-line bg-black">
      {src ? (
        <iframe src={src} title="Demonstration" className="h-full w-full" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <video src={url} controls playsInline className="h-full w-full object-contain" />
      )}
    </div>
  )
}

export function ExerciseDetail() {
  const { exerciseId = '' } = useParams()
  const navigate = useNavigate()
  const me = useMe()
  const coach = useIsCoach()
  const start = useStartWorkout()
  const video = useStore((s) => s.media[exerciseId])
  const setMedia = useStore((s) => s.setMedia)
  const demos = useStore((s) => s.demos)
  const published = useMemo(() => publishedFor(demos, exerciseId), [demos, exerciseId])
  const [logOpen, setLogOpen] = useState(false)
  const [skillOpen, setSkillOpen] = useState<string | null>(null)
  const [draft, setDraft] = useState<string | null>(null)

  const ex = exerciseById[exerciseId]
  if (!ex) return <Navigate to="/library" replace />

  const color = dvar(ex.discipline)
  const placements = placementsOf(ex.id)
  const record = bestEvidence(me.evidence).get(ex.id)
  const skills = skillsUsing(ex.id).sort((a, b) => a.rating - b.rating)
  const related = EXERCISES.filter((e) => e.id !== ex.id && e.category === ex.category && !placements.some((p) => p.progression.steps.some((s) => s.exerciseId === e.id))).slice(0, 4)
  const unit = ex.metric === 'hold' ? 'seconds' : ex.perSide ? 'reps per side' : 'reps'

  return (
    <div>
      <div className="flex items-center justify-between pt-5 lg:pt-9">
        <button onClick={() => navigate(-1)} className="pressable -ml-1 flex h-10 items-center gap-1.5 rounded-full pr-3 pl-1 text-[13.5px] text-ink-2 hover:text-ink">
          <ArrowLeft size={17} /> Back
        </button>
      </div>

      <header className="rise pt-3 pb-5">
        <Eyebrow className="mb-2.5 flex items-center gap-2"><DisciplineDot id={ex.discipline} size={7} />{disciplineById[ex.discipline].name} · {ex.category}</Eyebrow>
        <h1 className="display text-[40px] lg:text-[52px]">{ex.name}</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">{ex.summary}</p>
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="space-y-4 lg:sticky lg:top-8">
          {Object.keys(published.animations).length > 0 && (
            <Suspense fallback={<div className="aspect-square w-full rounded-[22px] border border-line bg-[#08090d]" />}>
              <ExerciseDemos animations={published.animations} />
            </Suspense>
          )}
          {published.videos.map((v) => (
            <figure key={v.id}>
              <VideoEmbed url={v.video!.url} />
              {(v.title || v.description) && (
                <figcaption className="mt-2 px-1">
                  {v.title && <div className="text-[14px] font-medium">{v.title}</div>}
                  {v.description && <p className="mt-0.5 text-[13px] leading-relaxed text-ink-2">{v.description}</p>}
                </figcaption>
              )}
            </figure>
          ))}
          {video && <VideoEmbed url={video} />}

          <div className="rise rise-1 card p-5">
            <div className="flex justify-center"><MuscleMap primary={ex.primary} secondary={ex.secondary} stabilizers={ex.stabilizers} color={color} height={250} /></div>
            <div className="mt-3 flex justify-center"><MuscleLegend color={color} /></div>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[13px]">
              {([['Primary', ex.primary], ['Secondary', ex.secondary], ['Stabilisers', ex.stabilizers]] as const).filter(([, list]) => list.length).map(([label, list]) => (
                <div key={label} className="flex gap-3">
                  <dt className="w-[84px] shrink-0 text-ink-3">{label}</dt>
                  <dd className="text-ink-2">{list.map((m) => MUSCLES[m].name).join(', ')}</dd>
                </div>
              ))}
            </dl>
          </div>

          {!video && !coach && published.videos.length === 0 && Object.keys(published.animations).length === 0 && (
            <div className="flex items-center gap-3 rounded-[22px] border border-dashed border-line-strong px-4 py-3.5 text-[13px] text-ink-3">
              <Video size={16} className="shrink-0" /> No demonstration video yet. Your coach can attach one.
            </div>
          )}
          {coach && (
            <div className="card p-4">
              <Eyebrow className="mb-2.5">Coach · demonstration video</Eyebrow>
              <div className="flex gap-2">
                <input className="field !h-11 text-[13.5px]" placeholder="YouTube, Vimeo or video file link" value={draft ?? video ?? ''} onChange={(e) => setDraft(e.target.value)} />
                <button className="btn btn-quiet btn-sm !h-11 shrink-0" disabled={draft === null || draft === (video ?? '')} onClick={() => { setMedia(ex.id, draft ?? ''); setDraft(null) }}>
                  {draft === '' && video ? 'Remove' : 'Save'}
                </button>
              </div>
              <p className="mt-2 text-[11.5px] text-ink-3">Shown to every athlete who opens this exercise. File uploads arrive with cloud storage.</p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-7 lg:mt-0">
          {/* Record + actions */}
          <section className="rise rise-2 card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Eyebrow>Your best</Eyebrow>
                <div className="mt-1.5 flex items-baseline gap-2.5">
                  <span className="display num text-[36px]">{record ? formatValue(ex, record.value) : '—'}</span>
                  {record && ex.curve && <span className="num text-[13px] text-ink-2">reads {Math.round(curveRating(ex.curve, record.value))}</span>}
                </div>
              </div>
              {record && <TierTag tier={record.tier} />}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button className="btn btn-primary" onClick={() => start({ type: 'library', workoutId: `practice-${ex.id}` }, ex.name, [makeBlock('strength', ex.id)])}>
                <Play size={14} fill="currentColor" /> Practise
              </button>
              <button className="btn btn-outline" disabled={!ex.curve} onClick={() => setLogOpen(true)}>Log a benchmark</button>
            </div>
          </section>

          {/* Facts */}
          <section className="rise rise-3 grid grid-cols-2 gap-2.5">
            {[
              ['Recommended', `${ex.dose.sets} × ${ex.dose.range[0]}–${ex.dose.range[1]}`, `${unit} · rest ${ex.dose.rest}s`],
              ['Equipment', ex.equipment.map((e) => EQUIPMENT[e]).join(' or '), ''],
              ['Measured in', ex.metric === 'hold' ? 'Hold time' : 'Repetitions', ex.perSide ? 'Each side counted separately' : ''],
              ['Rating range', ex.curve ? `${ex.curve[0][1]}–${ex.curve[ex.curve.length - 1][1]}` : 'Not rated', ex.curve ? `${bandOf(ex.curve[0][1]).label} to ${bandOf(ex.curve[ex.curve.length - 1][1]).label}` : 'A training tool only'],
            ].map(([label, value, note]) => (
              <div key={label} className="card p-4">
                <Eyebrow>{label}</Eyebrow>
                <div className="mt-2 text-[15px] leading-snug font-medium">{value}</div>
                {note && <div className="mt-0.5 text-[12px] text-ink-3">{note}</div>}
              </div>
            ))}
          </section>

          {/* Difficulty ladders */}
          {placements.map(({ progression, level }) => {
            const easier = stepAt(progression.id, level - 1)
            const harder = stepAt(progression.id, level + 1)
            const alternates = stepAt(progression.id, level)
            const others = [alternates!.exerciseId, ...(alternates!.alternates ?? [])].filter((id) => id !== ex.id)
            return (
              <section key={progression.id}>
                <SectionTitle>{progression.name} ladder · level {level} of {progression.steps.length}</SectionTitle>
                <div className="card p-4">
                  <div className="flex items-center gap-1">
                    {progression.steps.map((s) => (
                      <span key={s.level} className="h-1.5 flex-1 rounded-full" style={{ background: s.level === level ? color : s.level < level ? `color-mix(in oklab, ${color} 40%, var(--surface-3))` : 'var(--surface-3)' }} />
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <button disabled={!easier} onClick={() => easier && navigate(`/library/${easier.exerciseId}`, { replace: true })} className={cx('pressable rounded-2xl bg-surface-2 p-3 text-left', !easier && 'opacity-40')}>
                      <span className="flex items-center gap-1 font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase"><ChevronLeft size={12} />Easier{easier ? ` · L${easier.level}` : ''}</span>
                      <span className="mt-1 block truncate text-[13.5px] font-medium">{easier ? exerciseById[easier.exerciseId].name : 'Start of the ladder'}</span>
                    </button>
                    <button disabled={!harder} onClick={() => harder && navigate(`/library/${harder.exerciseId}`, { replace: true })} className={cx('pressable rounded-2xl bg-surface-2 p-3 text-right', !harder && 'opacity-40')}>
                      <span className="flex items-center justify-end gap-1 font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Harder{harder ? ` · L${harder.level}` : ''}<ChevronRight size={12} /></span>
                      <span className="mt-1 block truncate text-[13.5px] font-medium">{harder ? exerciseById[harder.exerciseId].name : 'Top of the ladder'}</span>
                    </button>
                  </div>
                  {others.length > 0 && (
                    <p className="mt-3 text-[12.5px] text-ink-2">
                      Same level:{' '}
                      {others.map((id, i) => (
                        <span key={id}>
                          {i > 0 && ', '}
                          <button className="underline decoration-line-strong underline-offset-4" onClick={() => navigate(`/library/${id}`, { replace: true })}>{exerciseById[id].name}</button>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </section>
            )
          })}

          {/* Technique */}
          <section>
            <SectionTitle>Technique</SectionTitle>
            <ol className="space-y-3">
              {ex.cues.map((c, i) => (
                <li key={c} className="flex gap-3.5">
                  <span className="display num mt-[-3px] w-5 shrink-0 text-[22px]" style={{ color }}>{i + 1}</span>
                  <span className="text-[14.5px] leading-relaxed">{c}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <SectionTitle>Common mistakes</SectionTitle>
            <ul className="space-y-2">
              {ex.mistakes.map((m) => (
                <li key={m} className="flex gap-3 text-[14px] leading-relaxed text-ink-2"><span className="mt-[9px] h-px w-3 shrink-0 bg-ink-3" />{m}</li>
              ))}
            </ul>
          </section>

          {ex.safety && (
            <section className="flex gap-3 rounded-[22px] border border-warn/30 bg-warn/8 p-4">
              <AlertTriangle size={17} className="mt-0.5 shrink-0 text-warn" />
              <div>
                <div className="text-[13.5px] font-medium">Safety</div>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-2">{ex.safety}</p>
              </div>
            </section>
          )}

          {ex.standard && (
            <section className="rounded-[22px] bg-surface p-4">
              <Eyebrow>Counts as evidence when</Eyebrow>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{ex.standard}</p>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionTitle>Skills this unlocks</SectionTitle>
              <div className="card divide-y divide-line">
                {skills.map((s) => <SkillRow key={s.id} skill={s} status={me.statuses[s.id]} onClick={() => setSkillOpen(s.id)} />)}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section>
              <SectionTitle>Related exercises</SectionTitle>
              <div className="card divide-y divide-line">
                {related.map((e) => <ExerciseRow key={e.id} ex={e} onClick={() => navigate(`/library/${e.id}`)} />)}
              </div>
            </section>
          )}
        </div>
      </div>

      <LogEvidenceSheet exerciseId={logOpen ? ex.id : null} open={logOpen} onClose={() => setLogOpen(false)} />
      <SkillSheet skillId={skillOpen} onClose={() => setSkillOpen(null)} onOpenSkill={setSkillOpen} />
    </div>
  )
}
