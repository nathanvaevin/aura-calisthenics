import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import type { WorkoutBlock, WorkoutSource } from '@/domain/types'
import { useStore } from '@/data/store'

/** Start a workout and open the player. Asks before replacing one in progress. */
export function useStartWorkout() {
  const navigate = useNavigate()
  return useCallback(
    (source: WorkoutSource, title: string, blocks: WorkoutBlock[]) => {
      const { active, startWorkout } = useStore.getState()
      if (blocks.length === 0) return
      if (active && !window.confirm(`“${active.log.title}” is still in progress. Discard it and start this session?`)) {
        navigate('/workout')
        return
      }
      startWorkout(source, title, blocks)
      navigate('/workout')
    },
    [navigate],
  )
}
