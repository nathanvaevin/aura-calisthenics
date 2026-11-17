import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ArrowLeft, ArrowLeftRight, Lock } from 'lucide-react'
import type { AssessmentParticipant, AssessmentSession, DisciplineId } from '@/domain/types'
import { groupInsights, suggestPairs, toMember, type Member } from '@/domain/assessment'
import { disciplineById } from '@/domain/catalog'
import { BANDS } from '@/domain/scoring/config'
import { DnaSigil } from '@/ui/DnaSigil'
import { DisciplineDot, Eyebrow } from '@/ui/primitives'
import { useAssessment } from './Assess'
import { dvar, num } from '@/lib/format'

/** People with enough on record to place them. */
export const assessed = (participants: AssessmentParticipant[]) => participants.filter((p) => Object.values(p.results).some((r) => !r.skipped))

const first = (name: string) => name.split(' ')[0]

/**
 * The group as one athlete: where it is strong, where it is not, and how far
 * apart its members are. A coach sees everyone by name. A participant sees the
 * totals, themselves, and only those who chose to share their shape.
 */
export function GroupProfile({ session, participants, viewerId, coach }: { session: AssessmentSession; participants: AssessmentParticipant[]; viewerId?: string; coach?: boolean }) {
  const stations = session.stations
  const members = useMemo(() => assessed(participants).map((p) => toMember(p, stations)), [participants, stations])
  const insights = useMemo(() => groupInsights(members, stations), [members, stations])
  const pairs = useMemo(() => suggestPairs(members, stations), [members, stations])
  const viewer = members.find((m) => m.id === viewerId)
  const named = (m: Member) => coach || m.shared || m.id === viewerId
  const scale = Math.max(400, Math.ceil(Math.max(...stations.map((d) => insights.max[d]), 1) / 200) * 200)

  if (members.length < 3 && !coach)
    return (
      <div className="rounded-card border border-dashed border-line-strong p-6 text-center">
        <div className="display text-[24px]">The group is still forming</div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">A group profile appears once three people have finished, so that no single person can be picked out of the totals.</p>
      </div>
    )
  if (members.length === 0)
    return <p className="rounded-card border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">The group profile builds itself as results come in.</p>

  const visiblePairs = pairs.filter((p) => coach || p.a.id === viewerId || p.b.id === viewerId).filter((p) => named(p.a) && named(p.b))
  const sharing = members.filter((m) => m.id !== viewerId && named(m))

  return (
    <div className="space-y-7">
      <section>
        <div className="grid grid-cols-3 gap-2">
          {([['Assessed', insights.size], ['Group Aura', num(insights.aura)], ['Stations', stations.length]] as const).map(([label, value]) => (
            <div key={label} className="card px-3.5 py-3"><Eyebrow>{label}</Eyebrow><div className="display num mt-1 text-[28px]">{value}</div></div>
          ))}
        </div>
        <div className="card mt-2.5 flex flex-col items-center px-2 pt-3 pb-5">
          <DnaSigil ratings={insights.median} ghost={viewer?.profile.ratings} size={320} axes={stations} />
          {viewer && (
            <div className="flex items-center gap-5 text-[12px] text-ink-2">
              <span className="flex items-center gap-2"><span className="h-px w-5 bg-ink" />The group</span>
              <span className="flex items-center gap-2"><span className="w-5 border-t border-dashed border-ink" />You</span>
            </div>
          )}
          <p className="mt-3 max-w-sm px-4 text-center text-[13.5px] leading-relaxed text-ink-2">
            {insights.strongest && insights.weakest ? (
              <>
                Together, strongest in <span className="font-medium" style={{ color: dvar(insights.strongest) }}>{disciplineById[insights.strongest].short}</span>, with the most to gain in{' '}
                <span className="font-medium" style={{ color: dvar(insights.weakest) }}>{disciplineById[insights.weakest].short}</span>.
                {insights.widest && <> The group is furthest apart in <span className="font-medium" style={{ color: dvar(insights.widest) }}>{disciplineById[insights.widest].short}</span>.</>}
              </>
            ) : (
              'The shape fills in as more stations are completed.'
            )}
          </p>
        </div>
      </section>

      <section>
        <Eyebrow className="mb-3">Where everyone stands</Eyebrow>
        <div className="card divide-y divide-line">
          {stations.map((d) => (
            <div key={d} className="px-4 py-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[14px] font-medium"><DisciplineDot id={d} />{disciplineById[d].short}</span>
                <span className="num text-[12px] text-ink-3">{insights.min[d]}–{insights.max[d]} · median <span className="font-medium text-ink">{insights.median[d]}</span></span>
              </div>
              <Strip discipline={d} members={members} scale={scale} viewerId={viewerId} min={insights.min[d]} max={insights.max[d]} median={insights.median[d]} />
              <div className="mt-1.5 flex flex-wrap gap-x-3 text-[11.5px] text-ink-3">
                {BANDS.map((b) => (insights.bands[d][b.id] ? <span key={b.id}><span className="num text-ink-2">{insights.bands[d][b.id]}</span> {b.label.toLowerCase()}</span> : null))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-ink-3">Each dot is one person{viewer ? '; the ringed one is you' : ''}. Dots carry no names here.</p>
      </section>

      {visiblePairs.length > 0 && (
        <section>
          <Eyebrow className="mb-3">{coach ? 'Suggested training partners' : 'Someone to train with'}</Eyebrow>
          <div className="card divide-y divide-line">
            {visiblePairs.map((p) => {
              // From a participant's seat, always read the pairing as "you and them".
              const flip = !coach && p.b.id === viewerId
              const [a, b, aLeads, bLeads] = flip ? [p.b, p.a, p.bLeads, p.aLeads] : [p.a, p.b, p.aLeads, p.bLeads]
              return (
                <div key={a.id + b.id} className="px-4 py-3.5">
                  <div className="flex items-center gap-2 text-[14.5px] font-medium">
                    {coach ? first(a.name) : 'You'} <ArrowLeftRight size={13} className="text-ink-3" /> {first(b.name)}
                  </div>
                  <p className="mt-1 text-[12.5px] leading-snug text-ink-2">
                    {coach ? first(a.name) : 'You'} {coach ? 'leads' : 'lead'} in <span style={{ color: dvar(aLeads) }}>{disciplineById[aLeads].short}</span>, {first(b.name)} in{' '}
                    <span style={{ color: dvar(bLeads) }}>{disciplineById[bLeads].short}</span>. Each can coach the other through their strongest station.
                  </p>
                </div>
              )
            })}
          </div>
          <p className="mt-2 text-[12px] text-ink-3">Paired by shape: each is strongest where the other has the most to learn.</p>
        </section>
      )}

      {!coach && (
        <section>
          <Eyebrow className="mb-3">Who you train with</Eyebrow>
          {sharing.length === 0 ? (
            <p className="rounded-card border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">Nobody else has chosen to share their shape yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {sharing.map((m) => (
                <div key={m.id} className="card flex flex-col items-center p-3 text-center">
                  <DnaSigil ratings={m.profile.ratings} size={104} labels={false} axes={stations} />
                  <div className="mt-1 text-[14px] font-medium">{first(m.name)}</div>
                  {m.profile.strongest && <div className="text-[11.5px] text-ink-3">Strongest in {disciplineById[m.profile.strongest].short}</div>}
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-ink-3">
            <Lock size={12} className="mt-0.5 shrink-0" />
            {members.length - sharing.length - (viewer ? 1 : 0)} {members.length - sharing.length - (viewer ? 1 : 0) === 1 ? 'person keeps' : 'people keep'} their shape private. Shapes show the six dimensions only; nobody’s individual results are visible to the group.
          </p>
        </section>
      )}
    </div>
  )
}

function Strip({ discipline, members, scale, viewerId, min, max, median }: { discipline: DisciplineId; members: Member[]; scale: number; viewerId?: string; min: number; max: number; median: number }) {
  const x = (v: number) => `${(v / scale) * 100}%`
  return (
    <div className="relative mt-3 h-5">
      <span className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-line-strong" />
      <span className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ left: x(min), width: `${((max - min) / scale) * 100}%`, background: `color-mix(in oklab, ${dvar(discipline)} 28%, transparent)` }} />
      <span className="absolute top-0 h-5 w-px bg-ink" style={{ left: x(median) }} />
      {members.map((m) => {
        const me = m.id === viewerId
        return (
          <span
            key={m.id}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: x(m.profile.ratings[discipline]), width: me ? 11 : 8, height: me ? 11 : 8, background: dvar(discipline), boxShadow: me ? '0 0 0 2px var(--surface), 0 0 0 3.5px var(--text)' : '0 0 0 1.5px var(--surface)', zIndex: me ? 2 : 1 }}
          />
        )
      })}
    </div>
  )
}

/** The participant's view of their group. */
export function GroupPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { session, participants, mine } = useAssessment(sessionId)
  if (!session || !mine) return <Navigate to="/train" replace />
  // On a phone that joined by link, the only results here are the owner's own.
  const alone = session.origin === 'invite'

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[560px] px-5 pb-16">
      <div className="page-glow" />
      <div className="relative z-10">
        <div className="safe-top pt-5">
          <button onClick={() => navigate(-1)} className="pressable -ml-1 flex h-10 items-center gap-1.5 rounded-full pr-3 pl-1 text-[13.5px] text-ink-2 hover:text-ink"><ArrowLeft size={17} /> Back</button>
        </div>
        <header className="rise pt-3 pb-6">
          <Eyebrow className="mb-2">Your group · with {session.coachName}</Eyebrow>
          <h1 className="display text-[38px] leading-[1.02]">{session.groupName}</h1>
        </header>
        {alone ? (
          <div className="rounded-card border border-dashed border-line-strong p-6">
            <div className="display text-[24px]">Not on this phone yet</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
              The group profile is built from everyone’s results, and for now those only come together on {first(session.coachName)}’s screen. Ask to see it there. Showing it on each participant’s phone is not built yet.
            </p>
          </div>
        ) : (
          <GroupProfile session={session} participants={participants} viewerId={mine.id} />
        )}
      </div>
    </div>
  )
}
