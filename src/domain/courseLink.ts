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
