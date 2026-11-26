import { Navigate, useNavigate, useParams } from 'react-router'
import { ArrowRight, Check } from 'lucide-react'
import { GOALS } from '@/domain/goals'
import { useAthleteModel } from '@/data/hooks'
import { useStore } from '@/data/store'
import { Eyebrow } from '@/ui/primitives'
import { GoalCards } from './GoalCards'

/**
 * Where someone who already had a profile lands after a coach's course link: they are in, the coach sees their work,
 * and, if they have none yet, their goals. Then their own profile, where the introduction waits.
 */
export default function Joined() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const course = useStore((s) => s.courses.find((c) => c.id === courseId))
  const coach = useStore((s) => (course ? s.athletes[course.coachId] : undefined))
  const meId = useStore((s) => s.meId)
  const me = useAthleteModel(meId)
  const updateMe = useStore((s) => s.updateMe)
  // Asked once, on arrival: choosing must not take the question away.
  const asks = useStore((s) => !!s.meId && (s.athletes[s.meId]?.goals.length ?? 0) === 0)
  if (!course || !me) return <Navigate to="/profile" replace />
  const first = coach?.name.split(' ')[0] ?? 'Your coach'
  const goals = me.athlete.goals
  const offered = GOALS.filter((g) => me.statuses[g]?.state !== 'mastered')

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[560px] px-5 pb-32" data-joined={course.id}>
      <div className="page-glow" />
      <div className="relative z-10 pt-[max(env(safe-area-inset-top),20px)]">
        <div className="rise flex items-center gap-3 pt-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bg"><Check size={20} strokeWidth={2.8} /></span>
          <span className="min-w-0"><Eyebrow>You are in</Eyebrow><span className="display block truncate text-[26px] leading-tight">{course.title}</span></span>
        </div>
        <p className="rise rise-1 mt-3 text-[13px] leading-snug text-ink-3" data-coach-sees>{first} sees your results and all your training while you are in the course.</p>
        {asks && (
          <div className="rise rise-2 mt-8">
            <h1 className="display text-[34px] leading-[1.04]">What do you want to be able to do?</h1>
            <p className="mt-2 mb-5 text-[14px] text-ink-2">Turn a card to see it. Choose up to three.</p>
            <GoalCards options={offered} value={goals} onChange={(g) => updateMe({ goals: g })} />
          </div>
        )}
      </div>
      <div className="glass safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line">
        <div className="mx-auto max-w-[560px] px-5 py-3.5">
          <button className="btn btn-primary btn-lg w-full" data-to-profile onClick={() => navigate('/profile', { replace: true })}>
            {asks && goals.length === 0 ? 'Choose later' : 'Go to my profile'} <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
