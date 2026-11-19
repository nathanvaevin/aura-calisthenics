import { useNavigate } from 'react-router'
import { Check, Sparkles } from 'lucide-react'
import type { Athlete } from '@/domain/types'
import { performerOf } from '@/theme/cast'
import { completion, nextForm, unlockText } from '@/theme/personal'
import { THEMES, UNIVERSES, posterOf } from '@/theme/themes'
import { useStanding, useVoice, useWearing } from '@/theme/useTheme'
import { Eyebrow } from '@/ui/primitives'
import { Stage3D } from '@/ui/Stage3D'
import { cx } from '@/lib/format'

/**
 * The athlete's visual identity at the top of their profile: their character
 * in the form it wears, how far personalization has come, and the way in.
 */
export function IdentityCard({ athlete }: { athlete: Athlete }) {
  const navigate = useNavigate()
  const look = useWearing()
  const standing = useStanding()
  const v = useVoice()
  const done = completion(athlete)
  const u = UNIVERSES[look.universe]
  const upcoming = nextForm(look.universe, standing)

  return (
    <section className="rise rise-1 card relative isolate overflow-hidden" data-tour="personalize">
      <div className="flex items-stretch">
        <div className="w-[40%] max-w-[230px] shrink-0 p-2 pr-0">
          {done.character
            ? <Stage3D cast={[performerOf(look, { aura: 'full', level: Math.min(look.intensity, 0.7) })]} ratio={0.74} controls="none" margin={1.3} className="!border-0" label="Your character" />
            : <img src={`${import.meta.env.BASE_URL}${posterOf(look.theme, look.character)}`} alt="" className="aspect-[0.74] w-full rounded-[calc(var(--r-card)*0.7)] bg-(--stage) object-cover object-top" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <Eyebrow>{THEMES[look.theme].name}</Eyebrow>
          <div className="display mt-1.5 text-[26px] leading-[1.02] sm:text-[30px]">{done.character ? look.form.name : 'Make it yours'}</div>
          <p className="mt-2 text-[12.5px] leading-snug text-ink-2">
            {done.all ? v('personal.ready') : done.core ? v('personal.core') : v('personal.start')}
          </p>
          {done.core && upcoming && (
            <p className="mt-2 text-[11.5px] leading-snug text-ink-3">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: upcoming.colour }} />
              {v('form.next', { name: upcoming.name })} · {unlockText(upcoming.unlock).toLowerCase()}
            </p>
          )}
          <div className="mt-auto pt-3.5">
            <div className="mb-2.5 flex items-center gap-1" aria-label={`${done.count} of 4 steps of personalization done`}>
              {([done.theme, done.character, done.about, done.sharing] as const).map((ok, i) => <span key={i} className={cx('h-1 flex-1 rounded-full', ok ? 'bg-accent' : 'bg-surface-3')} />)}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-accent btn-sm flex-1" onClick={() => navigate(done.core ? (!done.about ? '/personalize?step=about' : !done.sharing ? '/personalize?step=sharing' : '/personalize') : '/personalize')}>
                {done.all ? <Check size={14} strokeWidth={2.6} /> : <Sparkles size={14} />} Personalize
              </button>
              {done.core && <button className="btn btn-quiet btn-sm" onClick={() => navigate('/character')}>Studio</button>}
            </div>
            <p className="mt-2 font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">
              {done.all ? 'Personalization complete' : done.core ? `Identity ready · ${4 - done.count} optional left` : `${done.count} of 4 · ${u.name}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
