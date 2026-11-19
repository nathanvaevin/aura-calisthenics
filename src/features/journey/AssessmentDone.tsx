import { Navigate, useNavigate, useParams } from 'react-router'
import { ArrowRight, Check } from 'lucide-react'
import { useStore } from '@/data/store'
import { flush, keepWithGoogle, moveToMyAccount, signInWithGoogle, useCloud } from '@/data/cloud'
import { GoogleButton, Notice, SyncLine } from '@/features/account/Account'
import { completion, personalOf } from '@/theme/personal'
import { useVoice } from '@/theme/useTheme'
import { Eyebrow } from '@/ui/primitives'

/**
 * The end of an assessment: celebrate, save, continue. Nothing else.
 *
 * What the assessment found is on the athlete's profile and home, and one
 * quiet link away from here; this screen has one thing to do. Signed in, that
 * is going on. Not signed in, it is signing in, because results that only
 * this browser can open are not really saved.
 *
 * The assessment itself is shown the standard way for everyone. This screen
 * hands the athlete back to their own theme and voice.
 */
export default function AssessmentDone() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const v = useVoice()
  const session = useStore((s) => s.assessments.find((a) => a.id === sessionId))
  const mine = useStore((s) => s.participants.find((p) => p.sessionId === sessionId && p.athleteId === s.meId))
  const me = useStore((s) => (s.meId ? s.athletes[s.meId] : null))
  const demo = useStore((s) => s.demo)
  const cloud = useStore((s) => !!s.cloudUid)
  const configured = useCloud((s) => s.configured)
  const user = useCloud((s) => s.user)
  const canMove = useCloud((s) => s.canMove)

  if (!session || !mine || !me) return <Navigate to="/train" replace />
  if (!mine.submittedAt) return <Navigate to={`/assess/${session.id}`} replace />

  const guest = !!user?.guest
  /** Signed in with an account that can be opened again anywhere. */
  const account = cloud && !guest
  const personalized = completion({ style: personalOf(me) }).core
  const coach = session.origin !== 'solo' ? session.coachName.split(' ')[0] : null
  const onward = () => navigate(personalized ? '/profile' : '/personalize', { replace: true })
  const saveAndContinue = () => { void flush(); onward() }
  const count = Object.values(mine.results).filter((r) => !r.skipped).length

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-6" data-assess-done>
      <div className="page-glow" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center pt-10 text-center">
        <span className="rise flex h-20 w-20 items-center justify-center rounded-full bg-ink text-bg"><Check size={36} strokeWidth={2.6} /></span>
        <h1 className="rise rise-1 display mt-7 text-[44px] leading-[1.02]">{v('assess.done.title')}</h1>
        <p className="rise rise-1 mt-3 text-[16px] leading-relaxed text-ink-2">{v('assess.done.line')}</p>
        <p className="rise rise-2 mt-2 text-[13px] text-ink-3">
          <span className="num">{count}</span> {count === 1 ? 'result' : 'results'} recorded{coach && cloud ? ` · ${coach} has them` : ''}
        </p>
      </div>

      <div className="safe-bottom relative z-10 pt-6 pb-6">
        {account ? (
          <>
            <button className="btn btn-primary btn-lg w-full" onClick={saveAndContinue}>Save progress &amp; continue <ArrowRight size={17} /></button>
            <div className="mt-3 flex justify-center"><SyncLine saved="Saved to your account" /></div>
          </>
        ) : guest || (configured && !demo) ? (
          <>
            <Eyebrow className="mb-3 text-center">Sign in to save your progress</Eyebrow>
            {guest && canMove
              ? <GoogleButton className="btn-primary btn-lg w-full" onClick={() => void moveToMyAccount()}>Save to my Google account</GoogleButton>
              : <GoogleButton className="btn-primary btn-lg w-full" onClick={() => void (guest ? keepWithGoogle() : signInWithGoogle())}>Continue with Google</GoogleButton>}
            <Notice className="mt-3" />
            <p className="mt-3 text-center text-[12.5px] leading-relaxed text-ink-3">Without signing in, only this browser can open your results, and they are gone when it forgets them.</p>
            <button className="mt-1 flex h-10 w-full items-center justify-center text-[13px] text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink" onClick={onward}>Not now</button>
          </>
        ) : (
          <>
            <button className="btn btn-primary btn-lg w-full" onClick={onward}>Continue <ArrowRight size={17} /></button>
            <p className="mt-3 text-center text-[12.5px] leading-relaxed text-ink-3">{demo ? 'This is the sample world: nothing in it is saved.' : 'Kept on this device.'}</p>
          </>
        )}
        <button className="mt-1 flex h-10 w-full items-center justify-center text-[13px] text-ink-3 hover:text-ink" onClick={() => navigate(`/assess/${session.id}/reveal`)}>See my results</button>
      </div>
    </div>
  )
}
