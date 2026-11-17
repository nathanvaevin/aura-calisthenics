import { lazy, Suspense, useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import { publishedFor } from '@/domain/media'
import { useStore } from '@/data/store'
import { isCurrentRevision } from '@/visual/revisions'
import { cx } from '@/lib/format'

const ExerciseDemos = lazy(() => import('./Demos'))

/** Whether an exercise has an approved animation that still shows the movement as it is now. */
export function useHasDemo(exerciseId: string | null | undefined) {
  const demos = useStore((s) => s.demos)
  return useMemo(() => {
    if (!exerciseId) return false
    const { animations } = publishedFor(demos, exerciseId)
    return Object.values(animations).some((a) => !!a?.animation && isCurrentRevision(a.animation.motion, a.animation.revision))
  }, [demos, exerciseId])
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
