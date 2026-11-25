import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { decodeCourseInvite } from '@/domain/courseLink'
import { useStore } from '@/data/store'
import { joinCourseByLink, rememberCourse, signInWithGoogle, useCloud } from '@/data/cloud'
import { GoogleButton, Notice } from '@/features/account/Account'
import { AuraField } from '@/ui/AuraField'
import { Eyebrow } from '@/ui/primitives'
import { useIgnite } from '@/ui/useIgnite'
import { EVEN, Frame, Problem, toTop } from './Join'

/**
 * Where a coach's course link lands. Someone with an account is one touch
 * from being in the course. Someone without makes one first, and the welcome
 * questions follow, with the choice of how to find their starting point; they
 * are in the course from the moment they have signed in.
 */
export function CourseJoin({ data }: { data: string }) {
  const navigate = useNavigate()
  const invite = useMemo(() => decodeCourseInvite(data), [data])
  const configured = useCloud((s) => s.configured)
  const auth = useCloud((s) => s.auth)
  const user = useCloud((s) => s.user)
  const me = useStore((s) => (s.meId ? s.athletes[s.meId] : null))
  const cloudUid = useStore((s) => s.cloudUid)
  const course = useStore((s) => s.courses.find((c) => c.id === invite?.courseId))
  const inIt = useStore((s) => s.enrollments.some((e) => e.courseId === invite?.courseId && e.athleteId === s.meId))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { igniting, ignite } = useIgnite()

  if (!invite) return <Problem title="This invitation can’t be read.">The link looks incomplete. Ask your coach to send it again.</Problem>
  const signedIn = auth === 'in' && !!user
  // Without accounts (a build with no server), the device can only join a course it already holds.
  const local = !configured || (!cloudUid && !!me && !!course)
  if (!configured && !course) return <Problem title="This invitation needs the live app.">Open it from the address your coach shared.</Problem>
  if (configured && auth === 'loading' && !local) return <Frame><div className="flex flex-1 items-center justify-center text-[14px] text-ink-2">Opening the invitation…</div></Frame>

  const own = !!course && course.coachId === me?.id
  const first = invite.coachName.split(' ')[0]
  const join = () => {
    setBusy(true)
    setError(null)
    toTop()
    ignite(
      () => joinCourseByLink(invite.courseId),
      (to) => navigate(to, { replace: true }),
    )
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not join. Try again.'))
      .finally(() => setBusy(false))
  }

  return (
    <Frame>
      <div className="rise flex flex-1 flex-col items-center justify-center text-center">
        <AuraField mix={EVEN} aura={5200} size={248} rings={false} ignite={igniting}><span /></AuraField>
        <Eyebrow className="rise rise-1 -mt-1">{invite.coachName} invites you</Eyebrow>
        <h1 className="rise rise-1 display mt-2 text-[44px] leading-[1.02]">{course?.title ?? invite.title}</h1>
        <p className="rise rise-2 mt-4 max-w-sm text-[15.5px] leading-relaxed text-ink-2">
          {own ? 'This is your own course. Students see this page when they open your link.' : inIt ? 'You are already in this course.' : signedIn || local ? 'Join, and it is in your training from now on.' : 'Make your account, find your starting point, and you are in.'}
        </p>
        {!own && !inIt && <p className="rise rise-3 mt-4 max-w-sm text-[12.5px] leading-snug text-ink-3" data-coach-sees>{first} sees your results and all your training while you are in the course.</p>}
      </div>
      <div className="space-y-2.5 pt-7">
        {own ? (
          <button className="btn btn-primary btn-lg w-full" onClick={() => navigate(`/coach/course/${invite.courseId}`, { replace: true })}>Open the course <ArrowRight size={17} /></button>
        ) : inIt ? (
          <button className="btn btn-primary btn-lg w-full" onClick={() => navigate(`/train/course/${invite.courseId}`, { replace: true })}>Open the course <ArrowRight size={17} /></button>
        ) : signedIn || local ? (
          <button className="btn btn-primary btn-lg w-full" data-join-course disabled={busy} onClick={join}>{busy ? 'Joining…' : <>Join the course <ArrowRight size={17} /></>}</button>
        ) : (
          <>
            <GoogleButton className="btn-primary btn-lg w-full" onClick={() => { toTop(); void ignite(() => { rememberCourse(invite.courseId); void signInWithGoogle() }) }}>Join with Google</GoogleButton>
            <p className="text-center text-[12.5px] leading-relaxed text-ink-3">Already have an account? Use the same button: you go straight into the course.</p>
          </>
        )}
        {error && <p role="alert" className="text-center text-[13px] text-warn">{error}</p>}
        <Notice />
      </div>
    </Frame>
  )
}
