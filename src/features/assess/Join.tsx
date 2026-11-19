import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Check, Eye, Lock, Users } from 'lucide-react'
import type { DisciplineId } from '@/domain/types'
import { decodeHandIn, decodeInvite, estimateMinutes, overallProgress, protocolKnown } from '@/domain/assessment'
import { disciplineById } from '@/domain/catalog'
import { useStore, type ImportOutcome } from '@/data/store'
import { continueAsGuest, joinAssessment, peekInvite, rememberJoin, signInWithGoogle, useCloud, type InvitePreview } from '@/data/cloud'
import { GoogleButton, Notice } from '@/features/account/Account'
import { AuraField } from '@/ui/AuraField'
import { DisciplineDot, Eyebrow } from '@/ui/primitives'
import { Wordmark } from '@/app/Shell'
import { cx } from '@/lib/format'

const EVEN = { handstand: 1 / 6, pull: 1 / 6, push: 1 / 6, core: 1 / 6, legs: 1 / 6, mobility: 1 / 6 }

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-6">
      <div className="page-glow" />
      <header className="safe-top relative z-10 flex h-16 shrink-0 items-center"><Wordmark size={24} /></header>
      <div className="relative z-10 flex flex-1 flex-col pb-8">{children}</div>
    </div>
  )
}

function Problem({ title, children }: { title: string; children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="display text-[36px] leading-[1.05]">{title}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{children}</p>
        <button className="btn btn-primary mt-8" onClick={() => navigate('/', { replace: true })}>Open Aura</button>
      </div>
    </Frame>
  )
}

/** Where a scanned invitation lands. One screen, one decision, then straight into the assessment. */
export function JoinInvite({ data }: { data: string }) {
  const navigate = useNavigate()
  const invite = useMemo(() => decodeInvite(data), [data])
  const me = useStore((s) => (s.meId ? s.athletes[s.meId] : null))
  const mine = useStore((s) => !!invite && s.assessments.some((a) => a.id === invite.id && a.origin === 'local' && a.coachId === s.meId))
  const acceptInvite = useStore((s) => s.acceptInvite)
  const [name, setName] = useState('')
  const [sharing, setSharing] = useState<'coach' | 'group'>('coach')

  if (!invite) return <Problem title="This invitation can’t be read.">The link looks incomplete. Ask your coach to show the QR code again and scan it from the start.</Problem>
  if (!protocolKnown(invite.protocol))
    return <Problem title="This invitation is from a different version.">It was created with another version of the assessment ({invite.protocol}). Ask your coach to refresh Aura and share a new code.</Problem>

  const join = () => navigate(`/assess/${acceptInvite(invite, { name, sharing })}`, { replace: true })

  return (
    <Frame>
      <InviteIntro coachName={invite.coachName} groupName={invite.groupName} title={invite.title} kind={invite.kind} stations={invite.stations} />

      {!me ? (
        <label className="rise rise-3 mt-5 block">
          <Eyebrow className="mb-2">Your name</Eyebrow>
          <input autoFocus className="field !h-14 text-[17px]" placeholder="As your coach knows you" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      ) : (
        <p className="rise rise-3 mt-5 text-[13.5px] text-ink-2">Joining as <span className="font-medium text-ink">{me.name}</span>.{mine && ' This is your own session, so you will see it the way a participant does.'}</p>
      )}

      <SharingChoice coachName={invite.coachName} value={sharing} onChange={setSharing} />

      <div className="mt-auto pt-7">
        <button className="btn btn-primary btn-lg w-full" disabled={!me && !name.trim()} onClick={join}>Join and begin <ArrowRight size={17} /></button>
      </div>
    </Frame>
  )
}

function InviteIntro({ coachName, groupName, title, kind, stations, course }: { coachName: string; groupName: string; title: string; kind: 'baseline' | 'retest'; stations: DisciplineId[]; course?: string | null }) {
  return (
    <>
      <div className="rise -mx-2 flex justify-center">
        <AuraField mix={EVEN} aura={5200} size={200} rings={false}>
          <Users size={30} strokeWidth={1.4} />
        </AuraField>
      </div>
      <Eyebrow className="rise rise-1 -mt-2">{coachName} invites you</Eyebrow>
      <h1 className="rise rise-1 display mt-2 text-[40px] leading-[1.02]">{groupName}</h1>
      <p className="rise rise-2 mt-3 text-[15px] leading-relaxed text-ink-2">
        {kind === 'retest' ? 'A re-test: the same stations as before, so you can see exactly what has changed.' : 'A physical assessment to find out what you can do today. It becomes the starting point of everything you train here.'}
      </p>

      <div className="rise rise-2 card mt-5 p-4">
        <div className="flex items-center justify-between">
          <Eyebrow>{title} · {stations.length} stations</Eyebrow>
          <span className="num text-[12px] text-ink-3">about {estimateMinutes(stations)} min</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {stations.map((s) => (
            <span key={s} className="inline-flex h-7 items-center gap-1.5 rounded-full bg-surface-2 px-2.5 text-[12.5px]"><DisciplineDot id={s} size={6} />{disciplineById[s].short}</span>
          ))}
        </div>
        <ul className="mt-4 space-y-1.5 text-[13px] leading-snug text-ink-2">
          <li>Move between stations in any order, alone or with a partner.</li>
          <li>Each station adapts: it only asks for what makes sense after your last result.</li>
          <li>You record on this phone and can stop and return at any point.</li>
          {course && <li>Joining also puts you in <span className="font-medium text-ink">{course}</span>, the course this assessment opens.</li>}
        </ul>
      </div>
    </>
  )
}

function SharingChoice({ coachName, value, onChange }: { coachName: string; value: 'coach' | 'group'; onChange: (v: 'coach' | 'group') => void }) {
  return (
    <div className="rise rise-3 mt-5">
      <Eyebrow className="mb-1.5">Who else sees your results</Eyebrow>
      <p className="mb-2.5 text-[12.5px] leading-snug text-ink-2">{coachName.split(' ')[0]} always sees your results, and your training while you are in their course. The choice is about the rest of the group.</p>
      <div className="space-y-2">
        {([
          ['coach', Lock, 'Nobody else', 'The group sees anonymous totals, never your name.'],
          ['group', Eye, 'My coach, and my shape to the group', 'Others in the group can also see your name beside your six-dimension shape. Never your individual numbers.'],
        ] as const).map(([option, Icon, title, body]) => (
          <button key={option} onClick={() => onChange(option)} className={cx('pressable flex w-full items-start gap-3 rounded-[20px] border p-3.5 text-left', value === option ? 'border-ink bg-surface' : 'border-line')}>
            <span className={cx('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', value === option ? 'border-ink bg-ink text-bg' : 'border-line-strong text-ink-3')}>
              {value === option ? <Check size={13} strokeWidth={3} /> : <Icon size={12} />}
            </span>
            <span><span className="block text-[14.5px] font-medium">{title}</span><span className="block text-[12.5px] leading-snug text-ink-2">{body}</span></span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-ink-3">You can change this later. Nothing is shared outside this group.</p>
    </div>
  )
}

/**
 * Where a scanned invitation lands when sessions live in the database. The
 * code names a session; the server says what it is. Joining needs an account,
 * and a guest account takes one tap, so nobody is held up at the door.
 */
export function CloudJoin({ token }: { token: string }) {
  const navigate = useNavigate()
  const configured = useCloud((s) => s.configured)
  const auth = useCloud((s) => s.auth)
  const user = useCloud((s) => s.user)
  const me = useStore((s) => (s.meId && s.meId === s.cloudUid ? s.athletes[s.meId] : null))
  const [invite, setInvite] = useState<InvitePreview | 'loading' | 'closed' | 'unreachable'>('loading')
  const own = useStore((s) => typeof invite === 'object' && s.assessments.some((a) => a.id === invite.sessionId && a.origin === 'local'))
  const [attempt, setAttempt] = useState(0)
  const [name, setName] = useState('')
  const [sharing, setSharing] = useState<'coach' | 'group'>('coach')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!configured) return
    let live = true
    setInvite('loading')
    peekInvite(token).then((found) => live && setInvite(found ?? 'closed'), () => live && setInvite('unreachable'))
    return () => { live = false }
  }, [token, configured, attempt])

  if (!configured) return <Problem title="This invitation needs the live app.">It was made in a version of Aura with accounts. Open it from the address your coach shared.</Problem>
  if (invite === 'loading' || auth === 'loading') return <Frame><div className="flex flex-1 items-center justify-center text-[14px] text-ink-2">Opening the invitation…</div></Frame>
  if (invite === 'closed') return <Problem title="This invitation isn’t open.">The assessment may have been closed, or the code replaced. Ask your coach to show the current code.</Problem>
  if (invite === 'unreachable')
    return (
      <Frame>
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="display text-[36px] leading-[1.05]">Can’t reach Aura.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">Check that this phone is online, then try again. The invitation itself is fine.</p>
          <button className="btn btn-primary mt-8" onClick={() => setAttempt(attempt + 1)}>Try again</button>
        </div>
      </Frame>
    )
  if (!protocolKnown(invite.protocol))
    return <Problem title="This invitation is from a different version.">It was created with another version of the assessment ({invite.protocol}). Reload this page; if it stays, ask your coach to refresh Aura and share a new code.</Problem>

  const join = async (as: 'me' | 'guest') => {
    setBusy(true)
    setError(null)
    try {
      if (as === 'guest' && !(await continueAsGuest())) return
      navigate(`/assess/${await joinAssessment(token, { name: name.trim() || undefined, sharing })}`, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not join. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const signedIn = auth === 'in' && !!user
  const shown = me?.name && me.name !== 'Athlete' ? me.name : (user?.name ?? '')

  return (
    <Frame>
      <InviteIntro coachName={invite.coachName} groupName={invite.groupName} title={invite.title} kind={invite.kind} stations={invite.stations} course={invite.courseTitle} />

      {own ? (
        <div className="mt-auto pt-7">
          <p className="mb-3 text-[13.5px] text-ink-2">This is your own session. Participants see this screen when they scan the code.</p>
          <button className="btn btn-primary btn-lg w-full" onClick={() => navigate(`/coach/assessment/${invite.sessionId}`, { replace: true })}>Open the session board <ArrowRight size={17} /></button>
        </div>
      ) : (
        <>
          <label className="rise rise-3 mt-5 block">
            <Eyebrow className="mb-2">Your name</Eyebrow>
            <input className="field !h-14 text-[17px]" placeholder={shown || 'As your coach knows you'} value={name} onChange={(e) => setName(e.target.value)} />
            {signedIn && shown && <span className="mt-1.5 block text-[12px] text-ink-3">Leave empty to join as {shown}.</span>}
          </label>

          <SharingChoice coachName={invite.coachName} value={sharing} onChange={setSharing} />

          <div className="mt-auto space-y-2.5 pt-7">
            {signedIn ? (
              <button className="btn btn-primary btn-lg w-full" disabled={busy || (!shown && !name.trim())} onClick={() => void join('me')}>{busy ? 'Joining…' : <>Join and begin <ArrowRight size={17} /></>}</button>
            ) : (
              <>
                <GoogleButton className="btn-primary btn-lg w-full" onClick={() => { rememberJoin(token, { name: name.trim() || undefined, sharing }); void signInWithGoogle() }}>Join with Google</GoogleButton>
                <button className="btn btn-outline btn-lg w-full" disabled={busy || !name.trim()} onClick={() => void join('guest')}>{busy ? 'Joining…' : 'Join as a guest'}</button>
                <p className="text-center text-[12px] leading-relaxed text-ink-3">
                  {name.trim() ? 'A guest needs no account. Afterwards you can keep your results by adding a Google sign-in, or just screenshot them.' : 'To join as a guest, enter your name first. With Google, your results are saved to your own profile from the start.'}
                </p>
              </>
            )}
            {error && <p role="alert" className="text-center text-[13px] text-warn">{error}</p>}
            <Notice />
          </div>
        </>
      )}
    </Frame>
  )
}

const OUTCOME: Record<ImportOutcome, string> = {
  added: 'Added to the session.',
  updated: 'Updated in the session.',
  'unknown-session': '',
  'wrong-protocol': '',
}

/** Where a participant's hand-in link lands on the coach's device. */
export function HandInImport({ data }: { data: string }) {
  const navigate = useNavigate()
  const handIn = useMemo(() => decodeHandIn(data), [data])
  const session = useStore((s) => (handIn ? s.assessments.find((a) => a.id === handIn.sessionId && a.origin === 'local') : undefined))
  const importHandIn = useStore((s) => s.importHandIn)
  const [outcome, setOutcome] = useState<ImportOutcome | null>(null)

  if (!handIn) return <Problem title="These results can’t be read.">The link looks incomplete. Ask the athlete to show their hand-in code again.</Problem>
  if (!session)
    return (
      <Problem title="This session isn’t on this device.">
        {handIn.name}’s results belong to an assessment that was created somewhere else. Open this link on the phone or computer where the coach created the session.
      </Problem>
    )
  if (!protocolKnown(handIn.protocol)) return <Problem title="These results are from a different version.">They were recorded with another version of the assessment and can’t be merged into this session.</Problem>

  const count = Object.values(handIn.results).filter((r) => !r.skipped).length
  const progress = overallProgress(session.stations, handIn.results, handIn.skipped)

  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center">
        <Eyebrow>Hand-in · {session.title} · {session.groupName}</Eyebrow>
        <h1 className="display mt-2 text-[40px] leading-[1.02]">{handIn.name}</h1>
        <div className="card mt-5 divide-y divide-line">
          <div className="flex justify-between px-4 py-3 text-[14px]"><span className="text-ink-2">Benchmarks recorded</span><span className="num font-medium">{count}</span></div>
          <div className="flex justify-between px-4 py-3 text-[14px]"><span className="text-ink-2">Stations completed</span><span className="num font-medium">{progress.done} of {progress.total}</span></div>
          <div className="flex justify-between px-4 py-3 text-[14px]"><span className="text-ink-2">Shares their shape with the group</span><span className="font-medium">{handIn.sharing === 'group' ? 'Yes' : 'No'}</span></div>
          {handIn.partner && <div className="flex justify-between px-4 py-3 text-[14px]"><span className="text-ink-2">Counted by</span><span className="font-medium">{handIn.partner}</span></div>}
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-3">Everything arrives as self-reported. Mark what you watched as observed, or verify it, from the session board.</p>

        {outcome ? (
          <>
            <p className="mt-6 flex items-center gap-2 text-[15px] font-medium text-good"><Check size={17} strokeWidth={2.6} />{OUTCOME[outcome]}</p>
            <button className="btn btn-primary btn-lg mt-4" onClick={() => navigate(`/coach/assessment/${session.id}?tab=board`, { replace: true })}>Open the session board</button>
          </>
        ) : (
          <button className="btn btn-primary btn-lg mt-6" onClick={() => setOutcome(importHandIn(handIn))}>Add to the session</button>
        )}
      </div>
    </Frame>
  )
}
