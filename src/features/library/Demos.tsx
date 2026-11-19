import { useState, type Ref } from 'react'
import type { CharacterId, DemoAsset } from '@/domain/media'
import { useStore } from '@/data/store'
import { performerOf, standardLook } from '@/theme/cast'
import { personalOf } from '@/theme/personal'
import { useWearing } from '@/theme/useTheme'
import { Segmented, Toggle } from '@/ui/primitives'
import Demo, { type DemoHandle } from '@/visual/Demo'
import { MOTIONS } from '@/visual/motions'
import { STAGE_RATIO } from '@/visual/motions/types'

/**
 * The official animated demonstration of an exercise. Loaded on demand: it
 * brings the 3D engine with it.
 *
 * The movement is the approved one, the same for everyone. Who performs it
 * is the athlete's own character in their theme, except in an official
 * assessment, where it is always the standard Aura character.
 *
 * A published version is shown only while the movement is the one that was
 * approved. If the movement has been changed since, it waits for review again.
 */
export default function ExerciseDemos({ animations, official, stage, handle, preview }: {
  animations: Partial<Record<CharacterId, DemoAsset>>
  official?: boolean
  /** Fill the screen behind its controls, which cover this much of it from the top and the bottom. No controls of its own. */
  stage?: { top: number; bottom: number }
  handle?: Ref<DemoHandle>
  /** Fill the box it is put in and show nothing but the movement and the 360° button: for looking through several exercises quickly. */
  preview?: boolean
}) {
  const worn = useWearing()
  const prefersMuscles = useStore((s) => personalOf(s.meId ? s.athletes[s.meId] : null).muscles)
  const current = (['male', 'female'] as const).filter((c) => {
    const a = animations[c]?.animation
    return !!a && MOTIONS[a.motion]?.revision === (a.revision ?? 1)
  })
  // In an assessment, the instructor the athlete chose at its start performs. Elsewhere, their own character.
  const instructor = useStore((s) => s.settings.instructor?.character)
  const [who, setWho] = useState<CharacterId>(official ? instructor ?? worn.character : worn.character)
  const [muscles, setMuscles] = useState(official ? true : prefersMuscles)
  const asset = animations[current.includes(who) ? who : current[0]]
  if (!asset?.animation) return null
  const recipe = asset.animation
  const motion = MOTIONS[recipe.motion]
  const look = official ? standardLook(recipe.character) : { ...worn, character: recipe.character }

  if (stage) {
    return (
      <Demo
        fill safe={stage} controls="none" margin={1.08} handle={handle}
        cast={[performerOf(look, { motion: recipe.motion, revision: recipe.revision, muscles: muscles ? 'exercise' : null, aura: 'off' })]}
        angle={recipe.camera !== motion.camera ? recipe.camera : undefined} label={`${official ? 'Official demonstration' : 'Demonstration'} of the movement`}
      />
    )
  }

  if (preview) {
    return (
      <Demo
        fill controls="spin" margin={1.12}
        cast={[performerOf(look, { motion: recipe.motion, revision: recipe.revision, muscles: muscles ? 'exercise' : null, aura: 'off' })]}
        angle={recipe.camera !== motion.camera ? recipe.camera : undefined} label={`${official ? 'Official demonstration' : 'Demonstration'} of the movement`}
      />
    )
  }

  return (
    <div className="rise">
      <Demo
        cast={[performerOf(look, { motion: recipe.motion, revision: recipe.revision, muscles: muscles ? 'exercise' : null, aura: 'off' })]}
        ratio={STAGE_RATIO[motion.stage]} angle={recipe.camera !== motion.camera ? recipe.camera : undefined} label="Animated demonstration"
      />
      <div className="mt-2.5 flex items-center justify-between gap-3">
        {current.length > 1
          ? <Segmented<CharacterId> value={recipe.character} onChange={setWho} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
          : <span className="text-[12px] text-ink-3">{official ? 'Official demonstration' : 'Animated demonstration'}</span>}
        <span className="flex items-center gap-2.5 text-[12.5px] text-ink-2">Working muscles <Toggle on={muscles} onChange={setMuscles} label="Show the working muscles" /></span>
      </div>
    </div>
  )
}
