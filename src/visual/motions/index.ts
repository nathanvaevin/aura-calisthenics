import type { Motion } from './types'
import { deadHang, pullup } from './hang'
import { catCow, handstand, hollow, plank } from './holds'
import { pikePushup } from './pike'
import { pushup } from './pushup'
import { splitSquat, squat } from './squat'

/** The ten movements of the pilot, in the order they are shown. */
export const PILOT: Motion[] = [pushup, pullup, squat, plank, pikePushup, hollow, splitSquat, deadHang, handstand, catCow]

/**
 * Every revision of every movement that is still in the app. When a movement
 * is corrected, the earlier revision stays here until its replacement has
 * been approved, so the two can be compared.
 */
const ALL: Motion[] = [...PILOT]

/** The current revision of each movement, by the exercise it demonstrates. */
export const MOTIONS: Record<string, Motion> = {}
for (const m of ALL) if (!MOTIONS[m.id] || MOTIONS[m.id].revision < m.revision) MOTIONS[m.id] = m

/** One particular revision, if the app still has it. */
export const motionAt = (id: string, revision: number | undefined): Motion | undefined =>
  revision === undefined ? MOTIONS[id] : ALL.find((m) => m.id === id && m.revision === revision)

export type { Motion, MotionKind } from './types'
