import { useRef, useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { STATUS_LABEL, canMove, historyOf, type DemoAsset, type VideoSource, type WorkoutVideo } from '@/domain/media'
import type { DisciplineId } from '@/domain/types'
import { DISCIPLINES, EXERCISES, exerciseById } from '@/domain/catalog'
import { useStore } from '@/data/store'
import { supabase } from '@/data/supabase'
import { Empty, Eyebrow, SectionTitle, Segmented, Sheet } from '@/ui/primitives'
import { VideoEmbed } from '@/features/library/ExerciseDetail'
import { Field, StatusPill } from './shared'

const MAX_MB = 50
const KINDS = ['video/mp4', 'video/webm', 'video/quicktime']

/** Sends a file to Aura's storage and answers with where it can be watched. */
async function upload(file: File, uid: string): Promise<VideoSource> {
  if (!supabase) throw new Error('Uploading needs an account.')
  if (!KINDS.includes(file.type)) throw new Error('That is not a video file Aura can play. Use MP4 (H.264), WebM or MOV.')
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`That file is ${(file.size / 1048576).toFixed(0)} MB. The limit is ${MAX_MB} MB: export it smaller, or host it elsewhere and paste the link.`)
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').slice(-60)
  const path = `${uid}/${Date.now().toString(36)}-${safe}`
  const { error } = await supabase.storage.from('demonstrations').upload(path, file, { cacheControl: '31536000', contentType: file.type })
  if (error) throw new Error(error.message)
  return { source: 'upload', path, url: supabase.storage.from('demonstrations').getPublicUrl(path).data.publicUrl }
}

/** Recorded video: demonstrations of single exercises, and whole workouts. */
export function Videos() {
  const demos = useStore((s) => s.demos)
  const workouts = useStore((s) => s.workoutVideos)
  const [adding, setAdding] = useState<{ exerciseId?: string; replaces?: DemoAsset } | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [workout, setWorkout] = useState<WorkoutVideo | 'new' | null>(null)
  const videos = demos.filter((d) => d.kind === 'video')
  const slots = [...new Map(videos.map((v) => [`${v.exerciseId}|${v.slot}`, historyOf(videos, v.exerciseId, 'video', v.slot)[0]])).values()]
    .sort((a, b) => exerciseById[a.exerciseId].name.localeCompare(exerciseById[b.exerciseId].name))
  const shown = videos.find((v) => v.id === open) ?? null

  return (
    <div className="space-y-10">
      <section>
        <SectionTitle action={<button className="btn btn-outline btn-sm" onClick={() => setAdding({})}><Plus size={14} /> Add a video</button>}>Exercise videos</SectionTitle>
        <p className="mb-4 max-w-2xl text-[13.5px] leading-relaxed text-ink-2">
          Your own demonstration of an exercise, filmed and edited outside Aura. It sits on the exercise's page next to the animated characters; neither replaces the other, and the exercise itself does not change.
        </p>
        {slots.length === 0 ? (
          <Empty title="No videos yet">Add one by pasting a link or uploading a file. It starts as a draft: only you see it until you publish.</Empty>
        ) : (
          <div className="card divide-y divide-line">
            {slots.map((v) => (
              <button key={v.id} onClick={() => setOpen(v.id)} className="flex w-full items-center gap-3 p-3.5 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-medium">{v.title || exerciseById[v.exerciseId].name}</span>
                  <span className="block truncate text-[12px] text-ink-3">{exerciseById[v.exerciseId].name}{v.slot !== 'instructor' ? ` · ${v.slot.replace('instructor:', '')}` : ''} · version {v.version}</span>
                </span>
                <StatusPill status={v.status}>{STATUS_LABEL[v.status]}</StatusPill>
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle action={<button className="btn btn-outline btn-sm" onClick={() => setWorkout('new')}><Plus size={14} /> Add a workout</button>}>Workout videos</SectionTitle>
        <p className="mb-4 max-w-2xl text-[13.5px] leading-relaxed text-ink-2">
          Complete follow-along sessions. You can already record what each one is, here; <span className="text-ink">athletes cannot watch them in Aura yet</span>. The player for them (full screen, chapters, timers, progress) is the next stage, and is better built once there are real videos to build it round.
        </p>
        {workouts.length === 0 ? <Empty title="No workout videos yet">Nothing is lost by adding them early: title, length, level and the link are kept for when the player exists.</Empty> : (
          <div className="card divide-y divide-line">
            {workouts.map((w) => (
              <button key={w.id} onClick={() => setWorkout(w)} className="flex w-full items-center gap-3 p-3.5 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-medium">{w.title}</span>
                  <span className="block truncate text-[12px] text-ink-3">{w.minutes} min · {w.level} · {w.focus === 'full' ? 'Full body' : DISCIPLINES.find((d) => d.id === w.focus)?.short}</span>
                </span>
                <span className="font-mono text-[9.5px] tracking-[0.08em] text-ink-3 uppercase">{w.status === 'published' ? 'Ready' : w.status}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <VideoSheet key={adding ? `video-${adding.exerciseId}-${adding.replaces?.id}` : 'video-closed'} open={!!adding} from={adding} onClose={() => setAdding(null)} onSaved={(id) => { setAdding(null); setOpen(id) }} />
      <VideoDetail asset={shown} all={videos} onClose={() => setOpen(null)} onReplace={(a) => { setOpen(null); setAdding({ exerciseId: a.exerciseId, replaces: a }) }} />
      <WorkoutSheet key={workout === 'new' ? 'workout-new' : workout?.id ?? 'workout-closed'} value={workout} onClose={() => setWorkout(null)} />
    </div>
  )
}

function VideoSheet({ open, from, onClose, onSaved }: { open: boolean; from: { exerciseId?: string; replaces?: DemoAsset } | null; onClose: () => void; onSaved: (id: string) => void }) {
  const createDemo = useStore((s) => s.createDemo)
  const uid = useStore((s) => s.cloudUid)
  const old = from?.replaces
  const [exercise, setExercise] = useState(from?.exerciseId ?? EXERCISES[0].id)
  const [title, setTitle] = useState(old?.title ?? '')
  const [notes, setNotes] = useState(old?.description ?? '')
  const [shows, setShows] = useState(old && old.slot !== 'instructor' ? old.slot.replace('instructor:', '') : '')
  const [link, setLink] = useState('')
  const [video, setVideo] = useState<VideoSource | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const file = useRef<HTMLInputElement>(null)
  const source: VideoSource | null = video ?? (link.trim() ? { source: 'link', url: link.trim() } : null)

  const pick = async (f: File | undefined) => {
    if (!f || !uid) return
    setBusy(true); setError(null)
    try { setVideo(await upload(f, uid)); setLink('') } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
    setBusy(false)
  }

  return (
    <Sheet open={open} onClose={onClose} title={old ? 'Replace this video' : 'Add an exercise video'} eyebrow={old ? `New version of version ${old.version}` : undefined}>
      <div className="space-y-4">
        <Field label="Exercise">
          <select className="field" value={exercise} disabled={!!old} onChange={(e) => setExercise(e.target.value)}>{EXERCISES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
        </Field>
        <Field label="What it shows" hint="Leave empty for the main demonstration. Fill in for an extra one: a second camera angle, an easier variation.">
          <input className="field" value={shows} disabled={!!old} placeholder="Side angle" onChange={(e) => setShows(e.target.value)} />
        </Field>
        <Field label="Title"><input className="field" value={title} placeholder={exerciseById[exercise].name} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Technique notes" hint="Shown under the video, with the exercise's own cues and common mistakes.">
          <textarea className="field" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Field label="The video" hint={uid ? `Upload an MP4 (H.264) up to ${MAX_MB} MB, or paste a YouTube, Vimeo or file link. Short clips at 720p or 1080p play best on phones.` : 'Paste a YouTube, Vimeo or file link. Uploading a file needs you to be signed in to your account.'}>
          <input className="field" value={video ? video.url : link} disabled={!!video} placeholder="https://…" onChange={(e) => setLink(e.target.value)} />
          <div className="mt-2 flex items-center gap-2">
            <input ref={file} type="file" accept={KINDS.join(',')} className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
            <button className="btn btn-outline btn-sm" disabled={!uid || busy} onClick={() => file.current?.click()}><Upload size={13} /> {busy ? 'Uploading…' : video ? 'Uploaded' : 'Upload a file'}</button>
            {video && <button className="btn btn-quiet btn-sm" onClick={() => setVideo(null)}>Use a link instead</button>}
          </div>
        </Field>
        {error && <p className="text-[13px] text-warn">{error}</p>}
        {source && <VideoEmbed url={source.url} />}
        <button
          className="btn btn-primary w-full" disabled={!source}
          onClick={() => onSaved(createDemo({ exerciseId: exercise, kind: 'video', slot: shows.trim() ? `instructor:${shows.trim()}` : 'instructor', title: title.trim(), description: notes.trim(), video: source! }))}
        >
          Save as a draft
        </button>
      </div>
    </Sheet>
  )
}

function VideoDetail({ asset, all, onClose, onReplace }: { asset: DemoAsset | null; all: DemoAsset[]; onClose: () => void; onReplace: (a: DemoAsset) => void }) {
  const moveDemo = useStore((s) => s.moveDemo)
  const patchDemo = useStore((s) => s.patchDemo)
  const removeDemo = useStore((s) => s.removeDemo)
  if (!asset) return <Sheet open={false} onClose={onClose}>{null}</Sheet>
  const ex = exerciseById[asset.exerciseId]
  const history = historyOf(all, asset.exerciseId, 'video', asset.slot)
  const can = (to: DemoAsset['status']) => canMove(asset.status, to)
  return (
    <Sheet open onClose={onClose} wide title={asset.title || ex.name} eyebrow={<span className="flex items-center gap-2">{ex.name} · version {asset.version} <StatusPill status={asset.status}>{STATUS_LABEL[asset.status]}</StatusPill></span>}>
      <div className="space-y-4">
        {asset.video && <VideoEmbed url={asset.video.url} />}
        <Field label="Title"><input className="field" defaultValue={asset.title} placeholder={ex.name} onBlur={(e) => e.target.value !== asset.title && patchDemo(asset.id, { title: e.target.value.trim() })} /></Field>
        <Field label="Technique notes"><textarea className="field" rows={3} defaultValue={asset.description} onBlur={(e) => e.target.value !== asset.description && patchDemo(asset.id, { description: e.target.value.trim() })} /></Field>
        <div className="flex flex-wrap gap-2">
          {asset.status === 'draft' && <button className="btn btn-primary btn-sm" onClick={() => moveDemo(asset.id, 'pending')}>Ready for review</button>}
          {can('approved') && asset.status !== 'published' && <button className="btn btn-primary btn-sm" onClick={() => moveDemo(asset.id, 'approved')}>Approve</button>}
          {can('published') && <button className="btn btn-accent btn-sm" onClick={() => moveDemo(asset.id, 'published')}>Publish to athletes</button>}
          {asset.status === 'published' && <button className="btn btn-outline btn-sm" onClick={() => moveDemo(asset.id, 'approved')}>Take down</button>}
          <button className="btn btn-outline btn-sm" onClick={() => onReplace(asset)}>Replace with a new video</button>
          {can('archived') && <button className="btn btn-quiet btn-sm" onClick={() => moveDemo(asset.id, 'archived')}>Archive</button>}
          {asset.status === 'archived' && <button className="btn btn-outline btn-sm" onClick={() => moveDemo(asset.id, 'draft')}>Restore as draft</button>}
          {(asset.status === 'draft' || asset.status === 'archived') && <button className="btn btn-quiet btn-sm" onClick={() => { removeDemo(asset.id); onClose() }}>Delete</button>}
        </div>
        <p className="text-[12.5px] leading-relaxed text-ink-3">A video goes draft → review → approved → published, like an animation. Replacing it adds a new version; the published one stays up until the new one is published in its place.</p>
        {history.length > 1 && (
          <div>
            <Eyebrow className="mb-2">Versions</Eyebrow>
            <ul className="space-y-1 text-[13px] text-ink-2">{history.map((h) => <li key={h.id} className="flex justify-between"><span>Version {h.version}</span><span className="text-ink-3">{STATUS_LABEL[h.status]}</span></li>)}</ul>
          </div>
        )}
      </div>
    </Sheet>
  )
}

function WorkoutSheet({ value, onClose }: { value: WorkoutVideo | 'new' | null; onClose: () => void }) {
  const saveWorkoutVideo = useStore((s) => s.saveWorkoutVideo)
  const removeWorkoutVideo = useStore((s) => s.removeWorkoutVideo)
  const was = value && value !== 'new' ? value : null
  const [title, setTitle] = useState(was?.title ?? '')
  const [description, setDescription] = useState(was?.description ?? '')
  const [focus, setFocus] = useState<DisciplineId | 'full'>(was?.focus ?? 'full')
  const [level, setLevel] = useState<WorkoutVideo['level']>(was?.level ?? 'beginner')
  const [minutes, setMinutes] = useState(was?.minutes ?? 20)
  const [link, setLink] = useState(was?.video?.url ?? '')
  const [ready, setReady] = useState(was?.status === 'published')
  return (
    <Sheet open={!!value} onClose={onClose} title={was ? 'Workout video' : 'Add a workout video'}>
      <div className="space-y-4">
        <Field label="Title"><input className="field" value={title} placeholder="20-minute beginner pushing workout" onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Description"><textarea className="field" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Focus">
            <select className="field" value={focus} onChange={(e) => setFocus(e.target.value as DisciplineId | 'full')}>
              <option value="full">Full body</option>
              {DISCIPLINES.map((d) => <option key={d.id} value={d.id}>{d.short}</option>)}
            </select>
          </Field>
          <Field label="Minutes"><input className="field" type="number" min={1} max={180} value={minutes} onChange={(e) => setMinutes(Math.max(1, Number(e.target.value) || 1))} /></Field>
        </div>
        <Field label="Level"><Segmented<WorkoutVideo['level']> value={level} onChange={setLevel} options={[{ value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' }, { value: 'all', label: 'All' }]} /></Field>
        <Field label="Link to the video" hint="A full workout is too large to upload here: host it on a video service (YouTube, Vimeo, or a streaming host) and paste the link.">
          <input className="field" value={link} placeholder="https://…" onChange={(e) => setLink(e.target.value)} />
        </Field>
        <Field label="Status"><Segmented<'draft' | 'ready'> value={ready ? 'ready' : 'draft'} onChange={(v) => setReady(v === 'ready')} options={[{ value: 'draft', label: 'Draft' }, { value: 'ready', label: 'Ready' }]} /></Field>
        <p className="text-[12.5px] leading-relaxed text-ink-3">"Ready" marks it as finished on your side. It is not shown to athletes: there is no workout-video player in Aura yet.</p>
        <div className="flex gap-2">
          <button
            className="btn btn-primary flex-1" disabled={!title.trim()}
            onClick={() => {
              saveWorkoutVideo({
                id: was?.id, title: title.trim(), description: description.trim(), focus, level, minutes, equipment: was?.equipment ?? [], exerciseIds: was?.exerciseIds ?? [],
                courseId: was?.courseId ?? null, video: link.trim() ? { source: 'link', url: link.trim() } : null, chapters: was?.chapters ?? [], status: ready ? 'published' : 'draft',
              })
              onClose()
            }}
          >
            Save
          </button>
          {was && <button className="btn btn-quiet" onClick={() => { removeWorkoutVideo(was.id); onClose() }}>Delete</button>}
        </div>
      </div>
    </Sheet>
  )
}
