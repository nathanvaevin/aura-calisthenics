import type { Motion } from './types'
import { BAR } from './bar'
import { FLOOR } from './floor'
import { deadHang, pullup } from './hang'
import { catCow, handstand, handstandEarlier, hollow, plank } from './holds'
import { INVERTED, crowEarlier, wallShoulderTapsEarlier } from './inverted'
import { LEGS } from './legs'
import { MOBILITY } from './mobility'
import { pikePushup } from './pike'
import { PUSHES } from './pushes'
import { pushup } from './pushup'
import { ROWS, dipEarlier, negativeDipEarlier } from './rows'
import { splitSquat, squat } from './squat'

/** The ten movements of the pilot, in the order they are shown. */
export const PILOT: Motion[] = [pushup, pullup, squat, plank, pikePushup, hollow, splitSquat, deadHang, handstand, catCow]

/** The rest of the first-day assessment, family by family, easier variations first. */
export const ASSESSMENT: Motion[] = [...PUSHES, ...ROWS, ...BAR, ...FLOOR, ...LEGS, ...INVERTED, ...MOBILITY]

/**
 * Every revision of every movement that is still in the app. When a movement
 * is corrected, the earlier revision stays here until its replacement has
 * been approved, so the two can be compared.
 */
const EARLIER: Motion[] = [
  // Corrected on 2026-11-18 after the owner's review; revision 2 of each waits for approval.
  handstandEarlier, crowEarlier, wallShoulderTapsEarlier, dipEarlier, negativeDipEarlier,
]
const ALL: Motion[] = [...PILOT, ...ASSESSMENT, ...EARLIER]

/** The current revision of each movement, by the exercise it demonstrates. */
export const MOTIONS: Record<string, Motion> = {}
for (const m of ALL) if (!MOTIONS[m.id] || MOTIONS[m.id].revision < m.revision) MOTIONS[m.id] = m

/** One particular revision, if the app still has it. */
export const motionAt = (id: string, revision: number | undefined): Motion | undefined =>
  revision === undefined ? MOTIONS[id] : ALL.find((m) => m.id === id && m.revision === revision)

export type { Motion, MotionKind } from './types'
