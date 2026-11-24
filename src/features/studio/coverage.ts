/**
 * Where each exercise stands for each of the two characters.
 *
 * An exercise counts for a character only when that character's animation is
 * with athletes: approved and sent by the owner, and of the movement as it is
 * now. A movement that exists, or one waiting for review, does not count.
 * Plain rules, so the Studio and its tests read the same answer.
 */
import { EXERCISES } from '@/domain/catalog'
import { historyOf, type CharacterId, type DemoAsset } from '@/domain/media'
import { REVISIONS, isCurrentRevision } from '@/visual/revisions'

export const CHARACTERS = ['male', 'female'] as const

/**
 * none: no movement has been written ·
 * waiting: a movement is there and has not been sent to athletes ·
 * correction: sent back with notes · live: with athletes.
 */
export type CoverState = 'waiting' | 'correction' | 'live' | 'none'

export const latestOf = (animations: DemoAsset[], exerciseId: string, character: CharacterId) =>
  historyOf(animations, exerciseId, 'animation', character)[0] as DemoAsset | undefined

/** The movement an asset shows is current only if nobody has changed the movement since. */
export const isCurrent = (a: DemoAsset) => !!a.animation && isCurrentRevision(a.animation.motion, a.animation.revision)

/** Whether athletes see this exercise on this character now: some version of it is approved, sent, and of the movement as it is. */
export const withAthletes = (animations: DemoAsset[], exerciseId: string, character: CharacterId) =>
  historyOf(animations, exerciseId, 'animation', character).some((a) => a.status === 'published' && isCurrent(a))

/** What there is for the owner to do about a character's animation: this goes by its newest version. */
export function characterState(animations: DemoAsset[], exerciseId: string, character: CharacterId): CoverState {
  if (!(exerciseId in REVISIONS)) return 'none'
  const latest = latestOf(animations, exerciseId, character)
  if (latest && latest.status === 'published' && isCurrent(latest)) return 'live'
  return latest?.status === 'needs_correction' ? 'correction' : 'waiting'
}

/** An exercise is live when both characters are; one sent back makes it a correction. */
export function exerciseState(animations: DemoAsset[], exerciseId: string): CoverState {
  const each = CHARACTERS.map((c) => characterState(animations, exerciseId, c))
  if (each.includes('none')) return 'none'
  if (each.every((s) => s === 'live')) return 'live'
  return each.includes('correction') ? 'correction' : 'waiting'
}

export interface Coverage {
  /** Exercises in the library. */
  total: number
  /** Exercises a movement has been written for. A movement is written once and serves both characters. */
  movements: number
  /** Exercises whose animation is with athletes, for each character. */
  live: Record<CharacterId, number>
  /** Exercises with athletes on one character and not the other, by name of the one missing. */
  uneven: { exerciseId: string; missing: CharacterId }[]
}

export function coverageOf(animations: DemoAsset[]): Coverage {
  const out: Coverage = { total: EXERCISES.length, movements: 0, live: { male: 0, female: 0 }, uneven: [] }
  for (const e of EXERCISES) {
    if (e.id in REVISIONS) out.movements++
    const [m, f] = CHARACTERS.map((c) => withAthletes(animations, e.id, c))
    if (m) out.live.male++
    if (f) out.live.female++
    if (m !== f) out.uneven.push({ exerciseId: e.id, missing: m ? 'female' : 'male' })
  }
  return out
}
