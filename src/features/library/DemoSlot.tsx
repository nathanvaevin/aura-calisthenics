import { lazy, Suspense, useMemo, useState, type Ref } from 'react'
import type { DemoHandle } from '@/visual/Demo'
import { Play } from 'lucide-react'
import { publishedFor } from '@/domain/media'
import { useStore } from '@/data/store'
import { isCurrentRevision } from '@/visual/revisions'
import { cx } from '@/lib/format'

const load = () => import('./Demos')
const ExerciseDemos = lazy(load)
/** Fetch the 3D engine ahead of a demonstration that is about to be asked for. */
export const preloadDemos = () => { void load().catch(() => undefined) }

/** Whether an exercise has an approved animation that still shows the movement as it is now. */
export function useHasDemo(exerciseId: string | null | undefined) {
  const demos = useStore((s) => s.demos)
  return useMemo(() => {
    if (!exerciseId) return false
    const { animations } = publishedFor(demos, exerciseId)
    return Object.values(animations).some((a) => !!a?.animation && isCurrentRevision(a.animation.motion, a.animation.revision))
  }, [demos, exerciseId])
}

/** Every exercise that has an approved animation showing the movement as it is now. For lists, which only say so. */
export function useAnimated(): Set<string> {
  const demos = useStore((s) => s.demos)
  return useMemo(() => new Set(demos.filter((d) => d.kind === 'animation' && d.status === 'published' && !!d.animation && isCurrentRevision(d.animation.motion, d.animation.revision)).map((d) => d.exerciseId)), [demos])
}

/**
 * The approved demonstration of an exercise, wherever that exercise is shown.
 * Every screen asks the same question of the same exercise record, so one
 * approval in the Studio reaches all of them, and replacing it does too.
 *
 * Renders nothing when there is no approved animation: the screen keeps
 * whatever it showed before (cues, the muscle map, a coach's video).
 * `official` is for assessments: the standard Aura character, for everyone.
 * Closed, it is one row and loads nothing; the 3D engine comes when opened.
 */
export function DemoSlot({ exerciseId, official, open: startsOpen, className }: { exerciseId: string; official?: boolean; open?: boolean; className?: string }) {
  const demos = useStore((s) => s.demos)
  const has = useHasDemo(exerciseId)
  const [open, setOpen] = useState(!!startsOpen)
  if (!has) return null
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={cx('pressable flex w-full items-center gap-3 rounded-card border border-line bg-surface px-3.5 py-3 text-left hover:border-line-strong', className)}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-bg"><Play size={14} fill="currentColor" className="ml-0.5" /></span>
        <span className="min-w-0 flex-1 text-[14px] font-medium">Watch the demonstration<span className="block text-[12px] font-normal text-ink-3">{official ? 'The official movement for this test, with the working muscles' : 'The approved movement, with the working muscles'}</span></span>
      </button>
    )
  }
  return (
    <div className={className}>
      <Suspense fallback={<div className="aspect-square w-full rounded-card border border-line bg-(--stage)" />}>
        <ExerciseDemos animations={publishedFor(demos, exerciseId).animations} official={official} />
      </Suspense>
    </div>
  )
}

/**
 * The same approved demonstration, as a stage that fills the screen it is
 * on: the screen's controls lie over it and say how much they cover, and the
 * character is kept in what is left. Renders nothing when there is no
 * approved animation; ask `useHasDemo` first and keep the screen as it was.
 */
export function DemoStage({ exerciseId, official, cover, handle }: { exerciseId: string; official?: boolean; cover: { top: number; bottom: number }; handle?: Ref<DemoHandle> }) {
  const demos = useStore((s) => s.demos)
  const has = useHasDemo(exerciseId)
  if (!has) return null
  return (
    <Suspense fallback={null}>
      <ExerciseDemos animations={publishedFor(demos, exerciseId).animations} official={official} stage={cover} handle={handle} />
    </Suspense>
  )
}

/**
 * The approved demonstration in a box of the caller's own size, with no
 * controls but the 360° button: for a screen where exercises are looked
 * through one after another. One stage stays up and the movement on it
 * changes. Renders nothing when there is no approved animation.
 */
export function DemoPreview({ exerciseId, official, safe }: { exerciseId: string; official?: boolean; safe?: { top: number; bottom: number } }) {
  const demos = useStore((s) => s.demos)
  const has = useHasDemo(exerciseId)
  if (!has) return null
  return (
    <Suspense fallback={null}>
      <ExerciseDemos animations={publishedFor(demos, exerciseId).animations} official={official} preview safe={safe} />
    </Suspense>
  )
}
