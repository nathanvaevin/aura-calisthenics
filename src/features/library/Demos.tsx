import { useState } from 'react'
import type { CharacterId, DemoAsset } from '@/domain/media'
import { Segmented, Toggle } from '@/ui/primitives'
import Demo from '@/visual/Demo'
import { MOTIONS } from '@/visual/motions'
import { STAGE_RATIO } from '@/visual/motions/types'

/**
 * The published animated demonstration of an exercise. Loaded on demand: it
 * brings the 3D engine with it.
 *
 * A published version is shown only while the movement is the one that was
 * approved. If the movement has been changed since, it waits for review again.
 */
export default function ExerciseDemos({ animations }: { animations: Partial<Record<CharacterId, DemoAsset>> }) {
  const current = (['male', 'female'] as const).filter((c) => {
    const a = animations[c]?.animation
    return !!a && MOTIONS[a.motion]?.revision === (a.revision ?? 1)
  })
  const [who, setWho] = useState<CharacterId>(current[0] ?? 'male')
  const [muscles, setMuscles] = useState(true)
  const asset = animations[current.includes(who) ? who : current[0]]
  if (!asset?.animation) return null
  const recipe = asset.animation
  const motion = MOTIONS[recipe.motion]

  return (
    <div className="rise">
      <Demo
        cast={[{ character: recipe.character, motion: recipe.motion, revision: recipe.revision, muscles: muscles ? 'exercise' : null, aura: { theme: recipe.theme ?? 'cosmic', mode: 'off' } }]}
        ratio={STAGE_RATIO[motion.stage]} angle={recipe.camera !== motion.camera ? recipe.camera : undefined} label="Animated demonstration"
      />
      <div className="mt-2.5 flex items-center justify-between gap-3">
        {current.length > 1
          ? <Segmented<CharacterId> value={recipe.character} onChange={setWho} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
          : <span className="text-[12px] text-ink-3">Animated demonstration</span>}
        <span className="flex items-center gap-2.5 text-[12.5px] text-ink-2">Working muscles <Toggle on={muscles} onChange={setMuscles} label="Show the working muscles" /></span>
      </div>
    </div>
  )
}
