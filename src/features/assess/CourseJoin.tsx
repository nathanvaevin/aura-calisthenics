import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { decodeCourseInvite } from '@/domain/courseLink'
import { useStore } from '@/data/store'
import { joinCourseByLink, rememberCourse, useCloud } from '@/data/cloud'
import { Frame, Problem } from './Join'

/**
 * Where a coach's course link lands, for a moment. Signed out, it is remembered and Aura opens as it always does: the
 * welcome, then signing in. After signing in, someone new answers the welcome questions and is in the course; someone
 * with a profile is put in at once (`resumeCourse`). Already signed in here, they are put in now. Either way, what the
 * coach sees is said where they land.
 */
export function CourseJoin({ data }: { data: string }) {
  const navigate = useNavigate()
  const invite = useMemo(() => decodeCourseInvite(data), [data])
  const configured = useCloud((s) => s.configured)
  const auth = useCloud((s) => s.auth)
  const me = useStore((s) => (s.meId && !s.demo ? s.athletes[s.meId] : null))
  const cloudUid = useStore((s) => s.cloudUid)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!invite || (configured && auth === 'loading')) return
    const signedIn = configured ? auth === 'in' : !!me
    if (!signedIn && !(me && !cloudUid)) {
      // Not signed in: the welcome, as for anyone, and the course after signing in.
      rememberCourse(invite.courseId)
      navigate({ pathname: '/', hash: '' }, { replace: true })
      return
    }
    let live = true
    joinCourseByLink(invite.courseId).then(
      (to) => live && navigate({ pathname: to.startsWith('/train/course/') ? `/joined/${invite.courseId}` : to, hash: '' }, { replace: true }),
      (e) => live && setError(e instanceof Error ? e.message : 'Could not join the course.'),
    )
    return () => { live = false }
  }, [invite, configured, auth, me, cloudUid, navigate])

  if (!invite) return <Problem title="This invitation can’t be read.">The link looks incomplete. Ask your coach to send it again.</Problem>
  if (error) return <Problem title="This course can’t be joined right now.">{error}</Problem>
  return <Frame><div className="flex flex-1 items-center justify-center text-[14px] text-ink-2">Opening Aura…</div></Frame>
}
