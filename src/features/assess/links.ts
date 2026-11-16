import type { AssessmentParticipant, AssessmentSession } from '@/domain/types'
import { encodeHandIn, encodeInvite } from '@/domain/assessment'

/**
 * Links are carried in the URL fragment of the app's root address. The page
 * that loads is always index.html, so they work on any static host without
 * server-side routing, and the payload never reaches a server log.
 */
const root = () => `${window.location.origin}${import.meta.env.BASE_URL}`

/**
 * A session that lives in the database is invited to by its token alone: the
 * code is small enough to scan from across a room, and says nothing by itself.
 */
export const inviteUrl = (s: AssessmentSession) =>
  s.inviteToken ? `${root()}#j=${s.inviteToken}` :
  `${root()}#join=${encodeInvite({ id: s.id, protocol: s.protocol, title: s.title, groupName: s.groupName, coachName: s.coachName, courseId: s.courseId, stations: s.stations, kind: s.kind, stationMinutes: s.stationMinutes })}`

export const handInUrl = (p: AssessmentParticipant, s: AssessmentSession) => `${root()}#handin=${encodeHandIn(p, s.protocol)}`

/** What kind of link, if any, the current address carries. */
export type LinkKind = 'j' | 'join' | 'handin' | 'spot'

export function readLink(hash: string): { kind: LinkKind; data: string } | null {
  const m = hash.match(/^#(j|join|handin|spot)=([A-Za-z0-9_-]+)$/)
  return m ? { kind: m[1] as LinkKind, data: m[2] } : null
}

/** A place, and optionally who is training there until when, as a link. */
export const spotUrl = (data: string) => `${root()}#spot=${data}`

/** Other phones cannot open an address that only exists on this computer. */
export const isLocalOnly = () => ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
