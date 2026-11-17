import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router'
import { AlertTriangle, ArrowLeft, BadgeCheck, Check, Copy, Eye, Hand, Lock, Pencil, Play, RotateCcw, Trash2, UserPlus, Users, X } from 'lucide-react'
import type { AssessmentParticipant, AssessmentSession as Session, DisciplineId, ResultTier } from '@/domain/types'
import {
  compareProfiles, compareResults, decodeHandIn, estimateMinutes, groupCount, groupInsights, groupOf, ladderAdvice, needsAttention, overallProgress, profileOf,
  rotationOf, stationById, stationProgress, toMember, visibleTests,
} from '@/domain/assessment'
import { disciplineById, exerciseById } from '@/domain/catalog'
import { TIER_LABEL } from '@/domain/scoring/config'
import { useIsCoach, useNow } from '@/data/hooks'
import { useStore } from '@/data/store'
import { useLive, useOnServer } from '@/data/cloud'
import { SyncLine } from '@/features/account/Account'
import { StationOverview } from '@/features/assess/StationMenu'
import { SinceBaseline } from '@/features/assess/Progress'
import { QrCode } from '@/ui/QrCode'
import { DisciplineDot, Empty, Eyebrow, SectionTitle, Segmented, Sheet, Stepper, TierTag } from '@/ui/primitives'
import { resultLabel } from '@/features/assess/Assess'
import { GroupProfile, assessed } from '@/features/assess/Group'
import { copyText, inviteUrl, isLocalOnly, readLink } from '@/features/assess/links'
import { clock, cx, dvar, num, shortDate } from '@/lib/format'

type Tab = 'invite' | 'board' | 'stations' | 'group'
const first = (name: string) => name.split(' ')[0]
const RANK: Record<ResultTier, number> = { self: 0, observed: 1, coach: 2 }

/** The lowest tier among a station's recorded results: a station is only as known as its least-known result. */
function stationTier(p: AssessmentParticipant, station: DisciplineId): ResultTier | null {
  const tiers = [...stationById[station].tests, ...stationById[station].extra].map((t) => p.results[t.id]).filter((r) => r && !r.skipped).map((r) => r.tier)
  return tiers.length ? tiers.reduce((a, b) => (RANK[b] < RANK[a] ? b : a)) : null
}

export function AssessmentSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const coach = useIsCoach()
  const [params, setParams] = useSearchParams()
  const meId = useStore((s) => s.meId)
  const session = useStore((s) => s.assessments.find((a) => a.id === sessionId))
  const all = useStore((s) => s.participants)
  const patch = useStore((s) => s.patchAssessment)
  const finalise = useStore((s) => s.finaliseAssessment)
  const remove = useStore((s) => s.deleteAssessment)
  const course = useStore((s) => s.courses.find((c) => c.id === session?.courseId))
  const [confirm, setConfirm] = useState(false)
  // With accounts, the board follows everyone's phones. Live updates arrive by themselves; this is the net under them.
  const cloud = useStore((s) => !!s.cloudUid)
  useLive('assess', 4000)

  const participants = useMemo(() => all.filter((p) => p.sessionId === sessionId), [all, sessionId])
  const patchParticipant = useStore((s) => s.patchParticipant)

  // Place everyone who joined in a group as they arrive, so their phone can show it. The coach can move them after.
  const groups = session ? groupCount(session) : 1
  useEffect(() => {
    if (!session || session.status !== 'open' || session.coachId !== meId || groups < 2) return
    for (const p of participants) if (p.group === undefined) patchParticipant(p.id, { group: groupOf(p, participants, groups) })
  }, [session, participants, groups, meId, patchParticipant])

  if (!coach || !session || session.origin !== 'local' || session.coachId !== meId) return <Navigate to="/coach" replace />

  const tab = (params.get('tab') as Tab) || (participants.length ? 'board' : 'invite')
  const done = participants.filter((p) => p.submittedAt).length
  const open = session.status === 'open'

  return (
    <div>
      <div className="pt-5 lg:pt-9">
        <button onClick={() => navigate('/coach?tab=assess')} className="pressable -ml-1 flex h-10 items-center gap-1.5 rounded-full pr-3 pl-1 text-[13.5px] text-ink-2 hover:text-ink">
          <ArrowLeft size={17} /> Coach Studio
        </button>
      </div>

      <header className="rise pt-2 pb-5">
        <Eyebrow className="mb-1.5">{session.kind === 'retest' ? 'Re-test' : 'Group assessment'} · {session.groupName}</Eyebrow>
        <input aria-label="Assessment title" className="display w-full bg-transparent text-[36px] outline-none lg:text-[48px]" value={session.title} onChange={(e) => patch(session.id, { title: e.target.value })} />
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className={cx('rounded-full px-2 py-0.5 font-mono text-[9.5px] tracking-[0.1em] uppercase', open ? 'bg-good/15 text-good' : 'border border-line text-ink-3')}>{open ? 'Open' : `Finalised ${shortDate(session.finalisedAt!)}`}</span>
          <span className="num text-[12.5px] text-ink-3">{participants.length} joined · {done} finished · {session.stations.length} stations · about {estimateMinutes(session.stations)} min · {session.mode === 'stations' ? 'by stations' : 'guided'}</span>
          {session.sample && <span className="rounded-full border border-dashed border-line-strong px-2 py-0.5 font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">Sample data</span>}
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented<Tab> value={tab} onChange={(t) => setParams({ tab: t }, { replace: true })} options={[{ value: 'invite', label: 'Invite' }, { value: 'board', label: 'Board' }, { value: 'stations', label: 'Stations' }, { value: 'group', label: 'Group' }]} />
        {open && <button className="btn btn-primary btn-sm" disabled={assessed(participants).length === 0} onClick={() => setConfirm(true)}><Check size={15} /> Finalise</button>}
      </div>

      <div className="mt-6">
        {tab === 'invite' && <Invite session={session} participants={participants} />}
        {tab === 'board' && <Board session={session} participants={participants} />}
        {tab === 'stations' && <StationOverview stations={session.stations} />}
        {tab === 'group' && <Group session={session} participants={participants} />}
      </div>

      <div className="mt-10 border-t border-line pt-5">
        <button
          className="flex items-center gap-2 text-[13.5px] text-ink-3 hover:text-ink"
          onClick={() => {
            if (window.confirm(`Delete “${session.title}” for ${session.groupName}? Its results are removed${cloud ? ' for everyone who took part' : ', with any evidence it wrote to profiles on this device'}.`)) {
              remove(session.id)
              navigate('/coach?tab=assess')
            }
          }}
        >
          <Trash2 size={14} /> Delete this assessment
        </button>
      </div>

      <Sheet open={confirm} onClose={() => setConfirm(false)} eyebrow={session.groupName} title="Finalise the assessment">
        <p className="text-[14px] leading-relaxed text-ink-2">Finalising closes the session and turns its results into each participant’s starting profile.</p>
        <ul className="mt-4 space-y-2.5 text-[13.5px] leading-snug">
          <li className="flex gap-2.5"><Check size={15} className="mt-0.5 shrink-0 text-good" />{assessed(participants).length} participants’ results become evidence on their profiles, each kept at the tier you gave it: self-reported, observed or verified.</li>
          {cloud
            ? <li className="flex gap-2.5"><Check size={15} className="mt-0.5 shrink-0 text-good" />Everyone who joined on their own phone sees it on their profile{course ? `, and is enrolled in ${course.title}` : ''}. Nobody can join or change their own results after this.</li>
            : <li className="flex gap-2.5"><Check size={15} className="mt-0.5 shrink-0 text-good" />Everyone is added to your roster{course ? ` and enrolled in ${course.title}` : ''}.</li>}
          <li className="flex gap-2.5"><Check size={15} className="mt-0.5 shrink-0 text-good" />You can still mark results as observed or verified afterwards.</li>
          {cloud
            ? <li className="flex gap-2.5"><AlertTriangle size={15} className="mt-0.5 shrink-0 text-warn" />People you added by name have no profile to receive results. Theirs stay on this session.</li>
            : <li className="flex gap-2.5"><AlertTriangle size={15} className="mt-0.5 shrink-0 text-warn" />This happens on your device. Participants’ own phones keep what they recorded as self-reported until Aura syncs between devices.</li>}
        </ul>
        <button className="btn btn-primary btn-lg mt-6 w-full" onClick={() => { finalise(session.id); setConfirm(false); setParams({ tab: 'group' }, { replace: true }) }}>Finalise for {assessed(participants).length} participants</button>
      </Sheet>
    </div>
  )
}

// ── Invite ───────────────────────────────────────────────────────────────

function Invite({ session, participants }: { session: Session; participants: AssessmentParticipant[] }) {
  const navigate = useNavigate()
  const me = useStore((s) => (s.meId ? s.athletes[s.meId] : null))
  const acceptInvite = useStore((s) => s.acceptInvite)
  const patch = useStore((s) => s.patchAssessment)
  const [copied, setCopied] = useState(false)
  const [present, setPresent] = useState(false)
  const url = inviteUrl(session)
  // A code for a session the server does not have yet would lead nowhere.
  const cloud = !!session.inviteToken
  const onServer = useOnServer('assessment_sessions', session.id)
  const ready = !cloud || onServer
  const closed = cloud && session.status === 'finalised'
  const running = !!session.rotationStartedAt
  const now = useNow(500, running)
  const elapsed = running ? Math.max(0, (now - new Date(session.rotationStartedAt!).getTime()) / 1000) : 0
  const roundLength = session.stationMinutes * 60
  const round = Math.floor(elapsed / roundLength)
  const over = round >= session.stations.length
  const left = roundLength - (elapsed % roundLength)

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <section>
        <div className="card flex flex-col items-center p-6 text-center">
          {closed ? (
            <div className="flex h-[280px] w-[280px] max-w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-line-strong px-6">
              <Lock size={22} className="text-ink-3" />
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">This assessment is finalised, so its code no longer lets anyone in. Start a re-test to invite the group again.</p>
            </div>
          ) : ready ? <QrCode value={url} size={280} /> : (
            <div className="flex h-[280px] w-[280px] max-w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-line-strong px-6">
              <p className="text-[13.5px] leading-relaxed text-ink-2">Saving the session. The code appears as soon as it is on the server.</p>
              <SyncLine className="mt-3" />
            </div>
          )}
          <div className="display mt-4 text-[26px]">Scan to join {session.groupName}</div>
          <p className="mt-1 text-[13px] text-ink-2">Phone camera, no app to install. It opens straight into this assessment.</p>
          <div className="mt-4 flex w-full gap-2.5">
            <button className="btn btn-quiet flex-1" disabled={!ready || closed} onClick={async () => { setCopied(await copyText(url)); window.setTimeout(() => setCopied(false), 1800) }}>{copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy link</>}</button>
            <button className="btn btn-quiet flex-1" disabled={!ready || closed} onClick={() => setPresent(true)}>Show full screen</button>
          </div>
        </div>
        {isLocalOnly() && (
          <div className="mt-2.5 flex gap-3 rounded-[20px] border border-warn/30 bg-warn/8 p-4">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />
            <p className="text-[12.5px] leading-relaxed text-ink-2">
              You opened Aura at <span className="font-mono">{window.location.host}</span>, an address that only exists on this computer, so other phones cannot follow this code. Open Aura from its public address, or from this computer’s network address, and the code will point there.
            </p>
          </div>
        )}
        <button className="btn btn-outline mt-2.5 w-full" onClick={() => me && navigate(`/assess/${acceptInvite({ ...session, coachName: session.coachName }, { name: me.name, sharing: 'coach' })}`)}>
          <Eye size={15} /> Take it yourself, as a participant sees it
        </button>
      </section>

      <div className="mt-8 space-y-7 lg:mt-0">
        <section>
          <SectionTitle>{cloud ? 'How results reach you' : 'How results reach you today'}</SectionTitle>
          {cloud ? (
            <>
              <div className="card divide-y divide-line text-[13.5px] leading-snug">
                <div className="flex gap-3 p-4"><span className="num font-mono text-[11px] text-ink-3">1</span><span><span className="font-medium">They scan and join.</span> With their Google account, or as a guest with just a name. They appear on your board as they join{session.courseId ? ', and in the course this assessment belongs to' : ''}.</span></div>
                <div className="flex gap-3 p-4"><span className="num font-mono text-[11px] text-ink-3">2</span><span><span className="font-medium">They record on their own phone.</span> Each result reaches your board within a few seconds, as self-reported.</span></div>
                <div className="flex gap-3 p-4"><span className="num font-mono text-[11px] text-ink-3">3</span><span><span className="font-medium">Or you record for them.</span> Add anyone on the board and enter what you watch. That counts as coach-observed straight away.</span></div>
              </div>
              <p className="mt-2 flex items-start gap-2 text-[12px] leading-relaxed text-ink-3">
                <Lock size={12} className="mt-0.5 shrink-0" />
                Anyone holding the code can join while the session is open, so treat it like a class handout. Finalising closes the door. A guest keeps their results by adding a Google sign-in on their own phone afterwards.
              </p>
            </>
          ) : (
            <>
              <div className="card divide-y divide-line text-[13.5px] leading-snug">
                <div className="flex gap-3 p-4"><span className="num font-mono text-[11px] text-ink-3">1</span><span><span className="font-medium">They scan and record on their own phone.</span> The code carries the whole invitation, so it works without an account or a connection to you.</span></div>
                <div className="flex gap-3 p-4"><span className="num font-mono text-[11px] text-ink-3">2</span><span><span className="font-medium">They hand in.</span> Their final screen shows a code. Scan it with your phone camera, or have them send the link, and their results land on your board as self-reported.</span></div>
                <div className="flex gap-3 p-4"><span className="num font-mono text-[11px] text-ink-3">3</span><span><span className="font-medium">Or you record for them.</span> Add anyone on the board and enter what you watch. That counts as coach-observed straight away.</span></div>
              </div>
              <p className="mt-2 flex items-start gap-2 text-[12px] leading-relaxed text-ink-3">
                <Lock size={12} className="mt-0.5 shrink-0" />
                Live updates as people record need accounts, which this copy of Aura runs without. The board shows what has been handed in or entered here. Anyone holding the link can join, so treat it like a class handout.
              </p>
            </>
          )}
        </section>

        <section>
          <SectionTitle>Station timer</SectionTitle>
          <div className="card p-4">
            {running && !over ? (
              <div className="flex items-end justify-between">
                <div>
                  <Eyebrow>Round {round + 1} of {session.stations.length}</Eyebrow>
                  <div className="display num mt-1 text-[56px] leading-none">{clock(left)}</div>
                </div>
                <button className="btn btn-quiet btn-sm" onClick={() => patch(session.id, { rotationStartedAt: undefined })}><RotateCcw size={14} /> Reset</button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13.5px] text-ink-2">{over ? 'All rounds done.' : 'Minutes at each station'}</span>
                <div className="flex items-center gap-3">
                  {!over && <Stepper value={session.stationMinutes} min={3} max={15} onChange={(v) => patch(session.id, { stationMinutes: v })} />}
                  <button className="btn btn-primary btn-sm" onClick={() => patch(session.id, { rotationStartedAt: over ? undefined : new Date().toISOString() })}>{over ? 'Reset' : <><Play size={13} fill="currentColor" /> Start</>}</button>
                </div>
              </div>
            )}
            <p className="mt-3 text-[12px] leading-relaxed text-ink-3">Optional. A shared clock for rotating the group: {session.stations.length} rounds of {session.stationMinutes} minutes is {session.stations.length * session.stationMinutes} minutes. Nobody is locked to it; every station can be done in any order.</p>
          </div>
        </section>

        <section>
          <SectionTitle>Format</SectionTitle>
          <div className="card p-4">
            <Segmented<'stations' | 'guided'>
              value={session.mode ?? 'guided'}
              onChange={(mode) => patch(session.id, { mode })}
              options={[{ value: 'stations', label: 'By stations' }, { value: 'guided', label: 'Guided' }]}
            />
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-2">
              {(session.mode ?? 'guided') === 'stations'
                ? 'Each person opens a station and chooses the variations that match their level, easiest to hardest, with a suggested range for each. Best for a class sharing equipment in groups.'
                : 'Each station walks the person through its benchmarks in a fixed order, choosing the next one from their last result. Best for someone testing on their own.'}
            </p>
            {participants.some((p) => Object.keys(p.results).length) && <p className="mt-2 text-[12px] text-ink-3">Results already recorded stay as they are when you switch.</p>}
          </div>
        </section>

        <Groups session={session} participants={participants} />
      </div>

      {present && (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-bg p-8 text-center">
          <button aria-label="Close" onClick={() => setPresent(false)} className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-surface-2"><X size={19} /></button>
          <Eyebrow>{session.title} · with {session.coachName}</Eyebrow>
          <h1 className="display mt-3 text-[44px] leading-none lg:text-[72px]">{session.groupName}</h1>
          <div className="mt-8"><QrCode value={url} size={Math.min(window.innerHeight * 0.5, window.innerWidth * 0.8)} /></div>
          <p className="mt-6 text-[17px] text-ink-2">Point your phone camera at the code to begin.</p>
          {running && !over && <p className="display num mt-4 text-[44px]">Round {round + 1} · {clock(left)}</p>}
          {running && !over && groupCount(session) > 1 && (
            <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[18px]">
              {Array.from({ length: groupCount(session) }, (_, g) => {
                const at = rotationOf(g, groupCount(session), session.stations)[round % session.stations.length]
                return <span key={g} className="flex items-center gap-2">Group {g + 1} <DisciplineDot id={at} /> {disciplineById[at].short}</span>
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Groups ───────────────────────────────────────────────────────────────

/** Split the class so groups start at different stations and rotate. Tap a name to move them. */
function Groups({ session, participants }: { session: Session; participants: AssessmentParticipant[] }) {
  const patch = useStore((s) => s.patchAssessment)
  const patchParticipant = useStore((s) => s.patchParticipant)
  const groups = groupCount(session)
  return (
    <section>
      <SectionTitle>Groups</SectionTitle>
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13.5px] text-ink-2">Groups rotating between stations</span>
          <Stepper value={groups} min={1} max={Math.min(6, Math.max(1, session.stations.length))} onChange={(v) => patch(session.id, { groups: v })} />
        </div>
        {groups > 1 && (
          <div className="mt-4 space-y-3">
            {Array.from({ length: groups }, (_, g) => {
              const order = rotationOf(g, groups, session.stations)
              const members = participants.filter((p) => groupOf(p, participants, groups) === g)
              return (
                <div key={g} className="rounded-[16px] bg-surface-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-medium">Group {g + 1}</span>
                    <span className="flex items-center gap-1.5 text-[12px] text-ink-3">starts at <DisciplineDot id={order[0]} size={6} />{disciplineById[order[0]].short}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {members.length === 0 && <span className="text-[12px] text-ink-3">Nobody yet</span>}
                    {members.map((p) => (
                      <button key={p.id} title="Move to the next group" className="rounded-full border border-line bg-surface px-2.5 py-1 text-[12.5px] hover:border-line-strong" onClick={() => patchParticipant(p.id, { group: (g + 1) % groups })}>
                        {first(p.name)}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          {groups > 1 ? 'People are placed as they join, filling the groups evenly. Tap a name to move them to the next group; their phone shows their group and where to start.' : 'One group: everyone starts wherever there is space.'} With the station timer running, the full-screen code also shows where each group should be.
        </p>
      </div>
    </section>
  )
}

// ── Board ────────────────────────────────────────────────────────────────

function Board({ session, participants }: { session: Session; participants: AssessmentParticipant[] }) {
  const addParticipant = useStore((s) => s.addParticipant)
  const importHandIn = useStore((s) => s.importHandIn)
  const athletes = useStore((s) => s.athletes)
  const enrollments = useStore((s) => s.enrollments)
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [note, setNote] = useState<string | null>(null)
  const [cell, setCell] = useState<{ pid: string; station: DisciplineId } | null>(null)
  const [person, setPerson] = useState<string | null>(null)

  const mode = session.mode ?? 'guided'
  const attention = useMemo(() => needsAttention(participants, session.stations, mode), [participants, session.stations, mode])
  const students = session.courseId
    ? enrollments.filter((e) => e.courseId === session.courseId && athletes[e.athleteId] && !participants.some((p) => p.athleteId === e.athleteId))
    : []

  const paste = () => {
    const parsed = readLink(link.trim().slice(link.indexOf('#')))
    const handIn = parsed?.kind === 'handin' ? decodeHandIn(parsed.data) : null
    if (!handIn) return setNote('That is not a hand-in link.')
    const outcome = importHandIn(handIn)
    setNote(outcome === 'added' ? `${handIn.name} added.` : outcome === 'updated' ? `${handIn.name} updated.` : outcome === 'unknown-session' ? 'That hand-in belongs to a different assessment.' : 'That hand-in is from a different version.')
    if (outcome === 'added' || outcome === 'updated') setLink('')
  }

  const active = cell ? participants.find((p) => p.id === cell.pid) : undefined

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
      <section>
        {participants.length === 0 ? (
          <Empty title="Nobody here yet">Share the code from the Invite tab, or add people by name and record for them.</Empty>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-3 py-3 font-mono text-[9.5px] font-medium tracking-[0.12em] text-ink-3 uppercase lg:px-4">Participant</th>
                  {session.stations.map((s) => {
                    const n = participants.filter((p) => stationProgress(stationById[s], p.results, p.skipped, mode).state === 'done').length
                    return (
                      <th key={s} className="px-0.5 py-3 text-center lg:px-1">
                        <span className="mx-auto block h-2 w-2 rounded-full" style={{ background: dvar(s) }} />
                        <span className="mt-1 block font-mono text-[9px] font-medium tracking-[0.08em] text-ink-3 uppercase">{disciplineById[s].short.slice(0, 4)}</span>
                        <span className="num block font-mono text-[9px] font-normal text-ink-3">{n}/{participants.length}</span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {participants.map((p) => (
                  <tr key={p.id}>
                    <td className="max-w-[104px] px-3 py-2 lg:max-w-[180px] lg:px-4">
                      <button className="block w-full text-left" onClick={() => setPerson(p.id)}>
                        <span className="flex items-center gap-1.5 truncate text-[14px] font-medium">{p.name}{p.flags.length > 0 && <Hand size={12} className="shrink-0 text-warn" />}</span>
                        <span className="block truncate text-[11px] text-ink-3">{groupCount(session) > 1 ? `G${groupOf(p, participants, groupCount(session)) + 1} · ` : ''}{p.submittedAt ? 'Finished' : overallProgress(session.stations, p.results, p.skipped, mode).started ? 'In progress' : 'Not started'}{p.via === 'import' ? ' · handed in' : p.via === 'coach' ? ' · added by you' : ''}</span>
                      </button>
                    </td>
                    {session.stations.map((s) => {
                      const sp = stationProgress(stationById[s], p.results, p.skipped, mode)
                      const tier = stationTier(p, s)
                      const flagged = p.flags.includes(s)
                      return (
                        <td key={s} className="px-0.5 py-2 text-center lg:px-1">
                          <button
                            aria-label={`${p.name}, ${disciplineById[s].short}: ${sp.state}`}
                            onClick={() => setCell({ pid: p.id, station: s })}
                            className="pressable mx-auto flex h-8 w-8 items-center justify-center rounded-full lg:h-9 lg:w-9"
                            style={{
                              background: sp.state === 'done' ? dvar(s) : sp.state === 'active' ? `color-mix(in oklab, ${dvar(s)} 28%, transparent)` : 'var(--surface-2)',
                              color: sp.state === 'done' ? 'var(--bg)' : 'var(--text-3)',
                              boxShadow: flagged ? '0 0 0 2px var(--warn)' : tier === 'coach' ? `0 0 0 2px var(--surface), 0 0 0 3.5px ${dvar(s)}` : undefined,
                            }}
                          >
                            {sp.state === 'done' ? (tier === 'self' ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : tier === 'observed' ? <Eye size={14} /> : <BadgeCheck size={15} />) : sp.state === 'active' ? <span className="num font-mono text-[10px] text-ink">{sp.done}/{sp.total}</span> : sp.state === 'skipped' ? '–' : ''}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-ink-3">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-ink-2" />Self-reported</span>
          <span className="flex items-center gap-1.5"><Eye size={12} />Observed by you</span>
          <span className="flex items-center gap-1.5"><BadgeCheck size={12} />Verified</span>
          <span className="flex items-center gap-1.5"><Hand size={12} className="text-warn" />Asked for you</span>
          <span>Tap any cell to record, observe or verify.</span>
        </div>
      </section>

      <aside className="mt-8 space-y-6 lg:mt-0">
        {attention.length > 0 && (
          <section>
            <Eyebrow className="mb-2.5">Worth walking over to</Eyebrow>
            <div className="card divide-y divide-line">
              {attention.map(({ participant, reasons }) => (
                <button key={participant.id} className="block w-full px-4 py-3 text-left first:rounded-t-[22px] last:rounded-b-[22px] hover:bg-surface-2" onClick={() => setPerson(participant.id)}>
                  <span className="block text-[14px] font-medium">{participant.name}</span>
                  <span className="block text-[12px] leading-snug text-ink-3">{reasons.join(' · ')}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <Eyebrow className="mb-2.5">Add someone</Eyebrow>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { addParticipant(session.id, name); setName('') } }}>
            <input className="field !h-11 text-[14px]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn btn-quiet btn-sm !h-11 shrink-0" disabled={!name.trim()}><UserPlus size={15} /> Add</button>
          </form>
          {students.length > 0 && (
            <button className="mt-2 text-[12.5px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink" onClick={() => students.forEach((e) => addParticipant(session.id, athletes[e.athleteId].name, e.athleteId))}>
              Add the {students.length} enrolled {students.length === 1 ? 'student' : 'students'} not here yet
            </button>
          )}
        </section>

        {!session.inviteToken && <section>
          <Eyebrow className="mb-2.5">Paste a hand-in link</Eyebrow>
          <div className="flex gap-2">
            <input className="field !h-11 text-[13px]" placeholder="https://…#handin=…" value={link} onChange={(e) => { setLink(e.target.value); setNote(null) }} />
            <button className="btn btn-quiet btn-sm !h-11 shrink-0" disabled={!link.trim()} onClick={paste}>Import</button>
          </div>
          {note && <p className="mt-2 text-[12.5px] text-ink-2">{note}</p>}
          <p className="mt-2 text-[12px] leading-relaxed text-ink-3">Scanning a participant’s code with your phone camera does the same thing in one step.</p>
        </section>}
      </aside>

      <CellSheet session={session} participant={active} station={cell?.station} onClose={() => setCell(null)} />
      <PersonSheet session={session} participant={participants.find((p) => p.id === person)} onClose={() => setPerson(null)} onOpen={(station) => { const pid = person!; setPerson(null); setCell({ pid, station }) }} />
    </div>
  )
}

function CellSheet({ session, participant: p, station, onClose }: { session: Session; participant?: AssessmentParticipant; station?: DisciplineId; onClose: () => void }) {
  const navigate = useNavigate()
  const meId = useStore((s) => s.meId)
  const setStationTier = useStore((s) => s.setStationTier)
  const toggleFlag = useStore((s) => s.toggleFlag)
  if (!p || !station) return <Sheet open={false} onClose={onClose}>{null}</Sheet>
  const st = stationById[station]
  const recorded = [...st.tests, ...st.extra].filter((t) => p.results[t.id] && ((session.mode ?? 'guided') === 'stations' || !st.tests.includes(t) || visibleTests(st, p.results).includes(t)))
  const tier = stationTier(p, station)
  const own = p.athleteId === meId

  return (
    <Sheet open onClose={onClose} eyebrow={<span className="flex items-center gap-2"><DisciplineDot id={station} size={7} />{disciplineById[station].name}</span>} title={p.name}>
      {p.flags.includes(station) && (
        <button className="mb-4 flex w-full items-center gap-3 rounded-[18px] border border-warn/40 bg-warn/8 p-3.5 text-left" onClick={() => toggleFlag(p.id, station)}>
          <Hand size={16} className="shrink-0 text-warn" />
          <span className="text-[13.5px]"><span className="font-medium">{first(p.name)} asked for you here.</span> <span className="text-ink-2">Tap once you have been over.</span></span>
        </button>
      )}
      {recorded.length === 0 ? (
        <p className="text-[14px] text-ink-2">{p.skipped.includes(station) ? `${first(p.name)} skipped this station.` : 'Nothing recorded at this station yet.'}</p>
      ) : (
        <div className="card divide-y divide-line">
          {recorded.map((t) => {
            const r = p.results[t.id]
            return (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{exerciseById[t.exerciseId].name}</span>
                <TierTag tier={r.tier} compact />
                <span className="num w-[92px] text-right text-[14px]">{resultLabel(t, r.value, r.skipped)}</span>
              </div>
            )
          })}
        </div>
      )}

      <button className="btn btn-outline mt-4 w-full" onClick={() => navigate(`/assess/${session.id}/station/${station}?p=${p.id}`)}><Pencil size={14} /> {recorded.length ? 'Record or correct results' : `Record for ${first(p.name)}`}</button>

      {recorded.length > 0 && !own && (
        <>
          <Eyebrow className="mt-6 mb-2.5">How well do you know these?</Eyebrow>
          <div className="space-y-2">
            {([
              ['self', 'Self-reported', 'They recorded it. You did not watch.'],
              ['observed', 'Observed', 'You were there and watched or counted it.'],
              ['coach', 'Verified', 'You checked every rep or second against the written standard.'],
            ] as const).map(([value, title, body]) => (
              <button key={value} onClick={() => setStationTier(p.id, station, value)} className={cx('pressable flex w-full items-center gap-3 rounded-[18px] border p-3.5 text-left', tier === value ? 'border-ink bg-surface' : 'border-line')}>
                <TierTag tier={value} compact />
                <span className="min-w-0 flex-1"><span className="block text-[14px] font-medium">{title}</span><span className="block text-[12px] leading-snug text-ink-3">{body}</span></span>
                {tier === value && <Check size={16} strokeWidth={2.6} />}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-[12px] leading-relaxed text-ink-3">Applies to every result at this station. Observed and verified are recorded under your name and shown differently everywhere in Aura.</p>
        </>
      )}
      {own && recorded.length > 0 && <p className="mt-4 text-[12.5px] text-ink-3">These are your own results, so they stay self-reported. Nobody observes or verifies themselves.</p>}
    </Sheet>
  )
}

function PersonSheet({ session, participant: p, onClose, onOpen }: { session: Session; participant?: AssessmentParticipant; onClose: () => void; onOpen: (station: DisciplineId) => void }) {
  const removeParticipant = useStore((s) => s.removeParticipant)
  const all = useStore((s) => s.participants)
  if (!p) return <Sheet open={false} onClose={onClose}>{null}</Sheet>
  const profile = profileOf(p.results, session.stations)
  const before = session.baselineId ? all.find((b) => b.sessionId === session.baselineId && (p.athleteId ? b.athleteId === p.athleteId : b.name === p.name)) : undefined
  const counts = { self: 0, observed: 0, coach: 0 }
  for (const r of Object.values(p.results)) if (!r.skipped) counts[r.tier]++

  return (
    <Sheet open onClose={onClose} eyebrow={`Participant · ${profile.aura ? `Aura ${num(profile.aura)}` : 'no results yet'}`} title={p.name}>
      <div className="grid grid-cols-3 gap-2">
        {session.stations.map((s) => (
          <button key={s} onClick={() => onOpen(s)} className="card px-3 py-2.5 text-left hover:bg-surface-2">
            <span className="flex items-center gap-1.5 text-[11px] text-ink-2"><DisciplineDot id={s} size={6} />{disciplineById[s].short}</span>
            <span className="display num mt-0.5 block text-[22px]">{profile.ratings[s] || '—'}</span>
          </button>
        ))}
      </div>
      {before && (
        <div className="mt-3">
          <Eyebrow className="mb-2">Since the baseline</Eyebrow>
          <SinceBaseline c={compareResults(before.results, p.results)} still={profile.weakest} who={first(p.name)} />
        </div>
      )}
      <div className="card mt-3 divide-y divide-line text-[13.5px]">
        {(['self', 'observed', 'coach'] as const).map((t) => (
          <div key={t} className="flex items-center justify-between px-4 py-2.5"><span className="flex items-center gap-2.5"><TierTag tier={t} compact />{TIER_LABEL[t]}</span><span className="num font-medium">{counts[t]}</span></div>
        ))}
        <div className="flex items-center justify-between px-4 py-2.5"><span className="text-ink-2">Shares their shape with the group</span><span className="font-medium">{p.sharing === 'group' ? 'Yes' : 'No, coach only'}</span></div>
        {p.partner && <div className="flex items-center justify-between px-4 py-2.5"><span className="text-ink-2">Counted by</span><span className="font-medium">{p.partner}</span></div>}
      </div>
      <button
        className="mt-5 flex items-center gap-2 text-[13px] text-ink-3 hover:text-ink"
        onClick={() => { if (window.confirm(`Remove ${p.name} and their results from this assessment?`)) { removeParticipant(p.id); onClose() } }}
      >
        <Trash2 size={13} /> Remove from this assessment
      </button>
    </Sheet>
  )
}

// ── Group ────────────────────────────────────────────────────────────────

function Group({ session, participants }: { session: Session; participants: AssessmentParticipant[] }) {
  const all = useStore((s) => s.participants)
  const baseline = useStore((s) => s.assessments.find((a) => a.id === session.baselineId))
  const course = useStore((s) => s.courses.find((c) => c.id === session.courseId))
  const members = useMemo(() => assessed(participants).map((p) => toMember(p, session.stations)), [participants, session.stations])
  const used = useMemo(() => (course ? [...new Set(course.weeks.flatMap((w) => w.sessions.flatMap((x) => x.blocks.map((b) => b.progressionId).filter((id): id is string => !!id))))] : undefined), [course])
  const advice = useMemo(() => ladderAdvice(members, session.stations, used), [members, session.stations, used])

  const changes = useMemo(() => {
    if (!session.baselineId) return []
    return assessed(participants)
      .map((p) => {
        const before = all.find((b) => b.sessionId === session.baselineId && (p.athleteId ? b.athleteId === p.athleteId : b.name === p.name))
        return before ? { p, change: compareProfiles(profileOf(before.results, session.stations), profileOf(p.results, session.stations), session.stations) } : null
      })
      .filter((x) => x !== null)
  }, [all, participants, session])

  if (members.length === 0) return <Empty title="No results yet">The group’s profile, level advice and pairings appear as soon as the first results are in.</Empty>
  const insights = groupInsights(members, session.stations)

  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
      <GroupProfile session={session} participants={participants} coach />

      <div className="mt-8 space-y-7 lg:mt-0">
        {changes.length > 0 && baseline && (
          <section>
            <SectionTitle>Since {baseline.title.toLowerCase()} · {shortDate(baseline.createdAt)}</SectionTitle>
            <div className="card divide-y divide-line">
              {changes.map(({ p, change }) => {
                const top = session.stations.filter((d) => (change.ratings[d] ?? 0) > 0).sort((a, b) => (change.ratings[b] ?? 0) - (change.ratings[a] ?? 0))[0]
                return (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">{p.name}</span>
                      <span className="block text-[12px] text-ink-3">{top ? <>Most in <span style={{ color: dvar(top) }}>{disciplineById[top].short}</span>, +{change.ratings[top]}</> : 'No measured change yet'}</span>
                    </span>
                    <span className={cx('display num text-[24px]', change.aura > 0 && 'text-good')}>{change.aura > 0 ? '+' : ''}{num(change.aura)}</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-[12px] text-ink-3">Change in Aura between the two assessments, over the stations both covered.</p>
          </section>
        )}

        {advice.length > 0 && (
          <section>
            <SectionTitle>Where to pitch your sessions</SectionTitle>
            <div className="card divide-y divide-line">
              {advice.map((a) => (
                <div key={a.progressionId} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-[14px] font-medium"><DisciplineDot id={a.discipline} /><span className="truncate">{a.name}</span></span>
                    <span className="num shrink-0 font-mono text-[11px] text-ink-2">assign L{a.level} · allow L{a.min}–{a.max}</span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: a.steps }, (_, i) => i + 1).map((l) => (
                      <span key={l} className="h-1.5 flex-1 rounded-full" style={{ background: l === a.level ? dvar(a.discipline) : l >= a.min && l <= a.max ? `color-mix(in oklab, ${dvar(a.discipline)} 35%, var(--surface-3))` : 'var(--surface-3)' }} />
                    ))}
                  </div>
                  <div className="mt-1.5 text-[12px] text-ink-3">Most of the group works at {a.exercise}.</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-3">
              The assigned level is the group’s median working level on each ladder{course ? ` used in ${course.title}` : ''}; the allowed range is wide enough for everyone here. Set them on each exercise in the course builder.
            </p>
          </section>
        )}

        <section>
          <SectionTitle>Privacy in this group</SectionTitle>
          <div className="card flex items-start gap-3 p-4">
            <Users size={17} className="mt-0.5 shrink-0 text-ink-2" />
            <p className="text-[13px] leading-relaxed text-ink-2">
              You see everyone by name. {members.filter((m) => m.shared).length} of {insights.size} chose to show their shape to the group; the rest appear to others only inside anonymous totals. Individual results are never shown to other participants.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
