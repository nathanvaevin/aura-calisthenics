/**
 * The muscles a character can light up.
 *
 * A channel is one visible muscle (or one head of it) on one side of the
 * body. The generator writes, for every vertex of the skin, which channels it
 * belongs to; the renderer is handed one activation level per channel.
 *
 * The app's exercise library names muscles more coarsely (`MuscleId`).
 * `MUSCLE_CHANNELS` says which channels each of those names covers.
 */
import type { MuscleId } from '@/domain/types'

export const CHANNELS = [
  'traps', 'mid_back', 'rear_cuff', 'delt_ant', 'delt_lat', 'delt_post',
  'pec', 'pec_upper', 'biceps', 'triceps', 'forearm_flex', 'forearm_ext',
  'lats', 'lower_back', 'serratus', 'abs', 'obliques', 'hip_flexors',
  'glutes', 'glute_med', 'quads', 'hamstrings', 'adductors', 'calves',
] as const

export type Channel = (typeof CHANNELS)[number]

/** One slot per channel and side: left first. */
export const SLOTS = CHANNELS.length * 2
export const slotOf = (channel: Channel, side: 'L' | 'R') => CHANNELS.indexOf(channel) * 2 + (side === 'R' ? 1 : 0)

export const MUSCLE_CHANNELS: Record<MuscleId, Partial<Record<Channel, number>>> = {
  delts: { delt_ant: 1, delt_lat: 1 },
  rear_delts: { delt_post: 1 },
  chest: { pec: 1, pec_upper: 1 },
  triceps: { triceps: 1 },
  biceps: { biceps: 1 },
  forearms: { forearm_flex: 1, forearm_ext: 0.85 },
  lats: { lats: 1 },
  traps: { traps: 1 },
  mid_back: { mid_back: 1, rear_cuff: 0.85 },
  lower_back: { lower_back: 1 },
  abs: { abs: 1 },
  obliques: { obliques: 1 },
  serratus: { serratus: 1 },
  hip_flexors: { hip_flexors: 1 },
  glutes: { glutes: 1, glute_med: 0.7 },
  quads: { quads: 1 },
  hamstrings: { hamstrings: 1 },
  adductors: { adductors: 1 },
  calves: { calves: 1 },
}

/** How strongly each role shows: primary movers, helpers, stabilisers. */
export const ROLE_LEVEL = { primary: 1, secondary: 0.55, stabilizer: 0.24 } as const

export interface MuscleRoles { primary: MuscleId[]; secondary: MuscleId[]; stabilizers: MuscleId[] }

/** A channel-level correction to what the library's coarse names give: `delt_lat: 0.3`, or per side `quads.R: 0.5`. */
export type ChannelDetail = Partial<Record<Channel | `${Channel}.${'L' | 'R'}`, number>>

/** Activation per slot (0..1) for an exercise, from the library's muscle roles. */
export function activationOf(roles: MuscleRoles, detail: ChannelDetail = {}): Float32Array {
  const out = new Float32Array(SLOTS)
  const raise = (m: MuscleId, level: number) => {
    for (const [channel, share] of Object.entries(MUSCLE_CHANNELS[m]) as [Channel, number][]) {
      const v = level * share
      for (const side of ['L', 'R'] as const) {
        const i = slotOf(channel, side)
        if (v > out[i]) out[i] = v
      }
    }
  }
  roles.stabilizers.forEach((m) => raise(m, ROLE_LEVEL.stabilizer))
  roles.secondary.forEach((m) => raise(m, ROLE_LEVEL.secondary))
  roles.primary.forEach((m) => raise(m, ROLE_LEVEL.primary))
  for (const [key, v] of Object.entries(detail) as [string, number][]) {
    const [channel, side] = key.split('.') as [Channel, 'L' | 'R' | undefined]
    for (const s of side ? [side] : (['L', 'R'] as const)) out[slotOf(channel, s)] = v
  }
  return out
}
