/**
 * An invitation to a course, as a link a coach can send to anyone. It names
 * the course by its id, which is what joining uses; the title and the coach's
 * name are only there so that someone who is not signed in can be told what
 * they are invited to. Whether the course can be joined is asked of the
 * course itself, after signing in: it has to be active.
 */
export interface CourseInvite { courseId: string; title: string; coachName: string }

const encode = (text: string) => {
  let bin = ''
  new TextEncoder().encode(text).forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export const encodeCourseInvite = (i: CourseInvite) => encode(JSON.stringify([1, i.courseId, i.title.slice(0, 80), i.coachName.slice(0, 60)]))

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * The short form, which is what a coach sends since 2026-11-27: the course's id
 * alone, its 16 bytes in 22 characters (`#c=`). Only a course id that is a uuid
 * has one, which is every course on the server; anything else keeps the long form.
 */
export function shortCourseCode(courseId: string): string | null {
  if (!UUID.test(courseId)) return null
  const hex = courseId.replace(/-/g, '')
  let bin = ''
  for (let i = 0; i < 32; i += 2) bin += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** The course id a short code names, or null. */
export function courseOfCode(code: string): string | null {
  if (!/^[A-Za-z0-9_-]{22}$/.test(code)) return null
  try {
    const bin = atob(code.replace(/-/g, '+').replace(/_/g, '/'))
    if (bin.length !== 16) return null
    const hex = Array.from(bin, (c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  } catch {
    return null
  }
}

export function decodeCourseInvite(data: string): CourseInvite | null {
  try {
    const bin = atob(data.replace(/-/g, '+').replace(/_/g, '/'))
    const [v, courseId, title, coachName] = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))) as unknown[]
    if (v !== 1 || typeof courseId !== 'string' || !/^[\w-]{3,64}$/.test(courseId) || typeof title !== 'string' || typeof coachName !== 'string') return null
    return { courseId, title: title.slice(0, 80), coachName: coachName.slice(0, 60) }
  } catch {
    return null
  }
}
