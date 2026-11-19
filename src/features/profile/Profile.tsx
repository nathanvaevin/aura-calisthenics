import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ClipboardCheck, Pencil, ScanLine, Settings2, Trash2, X } from 'lucide-react'
import type { DisciplineId, EquipmentId } from '@/domain/types'
import { DISCIPLINE_IDS, EQUIPMENT, SKILLS, disciplineById, exerciseById, formatValue, skillById } from '@/domain/catalog'
import { BANDS, isVerified } from '@/domain/scoring/config'
import { curveRating } from '@/domain/scoring/curve'
import { bestEvidence } from '@/domain/scoring/mastery'
import { recentUnlocks } from '@/domain/insights'
import { useIsAdmin, useIsCoach, useMe } from '@/data/hooks'
import { useStore } from '@/data/store'
import { signInWithGoogle, signOut, startOver, useCloud } from '@/data/cloud'
import { KeepProfile, Notice, SyncLine } from '@/features/account/Account'
import { CoachAccessRow, CoachRequests } from '@/features/account/CoachAccess'
import { AuraDot, AuraField } from '@/ui/AuraField'
import { CountUp } from '@/ui/CountUp'
import { DnaSigil } from '@/ui/DnaSigil'
import { DisciplineDot, Eyebrow, Fold, SectionTitle, Sheet, StatusTag, Stepper, TextLink, TierTag, Toggle, useWide } from '@/ui/primitives'
import { StartHere, Tour } from '@/features/journey/Tour'
import { completion } from '@/theme/personal'
import { AuraSheet, LogEvidenceSheet, RatingList, RatingSheet } from '@/features/shared/Explainers'
import { LogRow, LogSheet } from '@/features/shared/LogView'
import { SkillSheet } from '@/features/tree/SkillSheet'
import { IdentityFields, MyIdentity, PrivacyCard } from '@/features/places/Identity'
import { IdentityCard } from '@/features/personalize/IdentityCard'
import { THEMES } from '@/theme/themes'
import { useThemeId, useVoice } from '@/theme/useTheme'
import { cx, dvar, initials, num, relativeDay, shortDate } from '@/lib/format'

export function Profile() {
  const me = useMe()
  const coach = useIsCoach()
  const admin = useIsAdmin()
  const [erasing, setErasing] = useState(false)
  const [eraseProblem, setEraseProblem] = useState<string | null>(null)
  const navigate = useNavigate()
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const updateMe = useStore((s) => s.updateMe)
  const toggleGoal = useStore((s) => s.toggleGoal)
  const removeEvidence = useStore((s) => s.removeEvidence)
  const reset = useStore((s) => s.reset)
  const cloud = useCloud()
  const demo = useStore((s) => s.demo)
  const account = cloud.auth === 'in' ? cloud.user : null
  const theme = useThemeId()
  const v = useVoice()

  const [auraOpen, setAuraOpen] = useState(false)
  const [ratingOpen, setRatingOpen] = useState<DisciplineId | null>(null)
  const [skillOpen, setSkillOpen] = useState<string | null>(null)
  const [logOpen, setLogOpen] = useState<string | null>(null)
  const [benchOpen, setBenchOpen] = useState<string | null>(null)
  const [recordsOpen, setRecordsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [touring, setTouring] = useState(false)
  // On a phone the profile is the essentials, and the rest one tap away. With room for two columns, it lies open.
  const wide = useWide()
  const personal = completion(me.athlete)
  /** The introduction is offered once per device, after the athlete has made Aura theirs: personalizing comes first. */
  const offerTour = !settings.tour && personal.core && !touring

  const a = me.aura
  const ratingValues = Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, me.ratings[d].rating])) as Record<DisciplineId, number>
  const ranked = [...DISCIPLINE_IDS].sort((x, y) => ratingValues[y] - ratingValues[x])
  const records = useMemo(
    () =>
      [...bestEvidence(me.evidence).values()]
        .filter((e) => exerciseById[e.exerciseId]?.curve)
        .map((e) => ({ e, ex: exerciseById[e.exerciseId], score: Math.round(curveRating(exerciseById[e.exerciseId].curve, e.value)) }))
        .sort((x, y) => y.score - x.score),
    [me.evidence],
  )
  const mastered = SKILLS.filter((s) => me.statuses[s.id].state === 'mastered')
  const verified = mastered.filter((s) => !me.statuses[s.id].implied && me.statuses[s.id].tier && isVerified(me.statuses[s.id].tier!)).length
  const unlocks = useMemo(() => recentUnlocks(me.statuses, 6), [me.statuses])
  const history = [...me.logs].filter((l) => l.finishedAt).sort((x, y) => y.finishedAt!.localeCompare(x.finishedAt!)).slice(0, 4)
  const weeks = me.dedication.weeks
  const peakWeek = Math.max(me.athlete.weeklyTarget, ...weeks.map((w) => w.sessions), 1)

  return (
    <div>
      <header className="rise flex items-start justify-between gap-4 pt-7 pb-2 lg:pt-12">
        <div className="flex min-w-0 items-center gap-4">
          <AuraDot mix={a.mix} size={64}>{initials(me.athlete.name)}</AuraDot>
          <div className="min-w-0">
            <h1 className="display truncate text-[34px] lg:text-[44px]">{me.athlete.name}</h1>
            <div className="mt-0.5 truncate text-[13px] text-ink-3">@{me.athlete.handle}{me.athlete.city ? ` · ${me.athlete.city}` : ''}</div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2 pt-1">
          <button onClick={() => setEditOpen(true)} aria-label="Edit profile" className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2"><Pencil size={16} /></button>
          <button onClick={() => setSettingsOpen(true)} aria-label="Settings and privacy" className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2"><Settings2 size={16} /></button>
        </div>
      </header>
      {me.athlete.bio && <p className="rise mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{me.athlete.bio}</p>}
      <div className="rise mt-4 flex gap-2 lg:hidden">
        <button onClick={() => navigate('/athletes')} className="btn btn-quiet btn-sm flex-1"><ScanLine size={14} /> Athletes</button>
        {coach && <button onClick={() => navigate('/coach')} className="btn btn-quiet btn-sm flex-1"><ClipboardCheck size={14} /> Coach Studio</button>}
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
        <div className="space-y-8">
          {offerTour && <StartHere onStart={() => setTouring(true)} onSkip={() => setSettings({ tour: 'skipped' })} />}
          <IdentityCard athlete={me.athlete} />

          {/* Aura identity */}
          <section className="rise rise-1" data-tour="aura">
            <button onClick={() => setAuraOpen(true)} className="card relative flex w-full items-center gap-2 overflow-hidden p-4 text-left">
              <AuraField mix={a.mix} aura={a.aura} size={148} rings={false} className="-my-4 -ml-6 shrink-0">
                <span className="display text-[40px] leading-none">{a.aura ? <CountUp value={a.aura} /> : '—'}</span>
              </AuraField>
              <span className="min-w-0">
                <Eyebrow>Aura</Eyebrow>
                <span className="display mt-1 block text-[26px] leading-tight">{a.title}</span>
                <span className="mt-2 flex items-center gap-2"><StatusTag status={a.status} /></span>
                {a.cls.next && <span className="num mt-2 block text-[12px] text-ink-3">{num(a.cls.next.min - a.aura)} to {a.cls.next.label}</span>}
              </span>
            </button>
          </section>

          {/* Ratings: one line each. What is behind a number is behind a tap. */}
          <section className="rise rise-2" data-tour="ratings">
            <SectionTitle>Mastery ratings</SectionTitle>
            <RatingList ratings={me.ratings} onSelect={setRatingOpen} compact />
          </section>

          <div className="space-y-2.5">
          <Fold id="dna" title="Athlete DNA" open={wide} summary={a.peak ? `Strongest in ${disciplineById[ranked[0]].short} · most room in ${disciplineById[ranked[5]].short}` : 'Your shape across the six areas'}>
            <div className="card flex flex-col items-center px-2 pt-3 pb-5">
              <DnaSigil ratings={ratingValues} size={340} onSelect={setRatingOpen} />
              {a.peak ? (
                <p className="max-w-sm px-4 text-center text-[13.5px] leading-relaxed text-ink-2">
                  Strongest in <span className="font-medium" style={{ color: dvar(ranked[0]) }}>{disciplineById[ranked[0]].short}</span> and{' '}
                  <span className="font-medium" style={{ color: dvar(ranked[1]) }}>{disciplineById[ranked[1]].short}</span>. The widest gap is{' '}
                  <span className="font-medium" style={{ color: dvar(ranked[5]) }}>{disciplineById[ranked[5]].short}</span>,{' '}
                  {ratingValues[ranked[0]] - ratingValues[ranked[5]]} points below your peak.
                </p>
              ) : (
                <p className="max-w-sm px-4 text-center text-[13.5px] text-ink-3">{v('profile.dna.empty')}</p>
              )}
            </div>
          </Fold>
          <Fold id="places" title="Where you train" open={wide} summary={[me.athlete.city, me.athlete.country].filter(Boolean).join(', ') || 'Your city, your spots, and who sees them'}>
            <MyIdentity athlete={me.athlete} onEdit={() => setEditOpen(true)} />
          </Fold>
          </div>
        </div>

        <div className="mt-8 space-y-8 lg:mt-0">
          {/* Goals */}
          {me.athlete.goals.length > 0 && (
            <section>
              <SectionTitle>Working toward</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {me.athlete.goals.filter((g) => skillById[g]).map((g) => (
                  <span key={g} className="inline-flex h-9 items-center gap-2 rounded-full border border-line pr-1.5 pl-3 text-[13px]">
                    <DisciplineDot id={skillById[g].discipline} size={6} />
                    <button onClick={() => setSkillOpen(g)}>{skillById[g].name}</button>
                    <button aria-label={`Remove goal ${skillById[g].name}`} onClick={() => toggleGoal(g)} className="flex h-6 w-6 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"><X size={12} /></button>
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-2.5">
          <Fold id="records" title="Strongest abilities" open={wide} summary={records[0] ? `${records[0].ex.name} · ${records[0].score}${records.length > 1 ? ` · and ${records.length - 1} more` : ''}` : 'Your best results will show here'}>
            {records.length === 0 ? (
              <p className="rounded-card border border-dashed border-line-strong p-5 text-[13.5px] text-ink-3">{v('empty.records')}</p>
            ) : (
              <div className="card divide-y divide-line">
                {records.slice(0, 5).map(({ e, ex, score }) => (
                  <button key={e.id} onClick={() => setBenchOpen(ex.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left first:rounded-t-card last:rounded-b-card hover:bg-surface-2">
                    <DisciplineDot id={ex.discipline} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-medium">{ex.name}</span>
                      <span className="block text-[12px] text-ink-3">{formatValue(ex, e.value, true)} · {shortDate(e.date)}</span>
                    </span>
                    <TierTag tier={e.tier} compact />
                    <span className="display num w-[46px] text-right text-[24px]">{score}</span>
                  </button>
                ))}
              </div>
            )}
            {records.length > 5 && <div className="mt-2.5 text-right"><TextLink onClick={() => setRecordsOpen(true)}>All {records.length}</TextLink></div>}
          </Fold>
          <Fold id="skills" title="Skills" open={wide} summary={`${mastered.length} of ${SKILLS.length} unlocked${verified ? ` · ${verified} coach-verified` : ''}`}>
            <div className="card p-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="display num text-[44px] leading-none">{mastered.length}</span>
                  <span className="ml-2 text-[13px] text-ink-3">of {SKILLS.length} skills</span>
                </div>
                <span className="num text-[12.5px] text-ink-2">{verified} coach-verified</span>
              </div>
              <div className="mt-4 flex h-2 gap-0.5 overflow-hidden rounded-full">
                {DISCIPLINE_IDS.map((d) => {
                  const n = mastered.filter((s) => s.discipline === d).length
                  return n ? <span key={d} style={{ flex: n, background: dvar(d) }} title={`${disciplineById[d].short}: ${n}`} /> : null
                })}
                <span className="bg-surface-3" style={{ flex: SKILLS.length - mastered.length }} />
              </div>
              <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-2">
                {BANDS.map((b) => {
                  const n = mastered.filter((s) => s.band === b.id).length
                  return n ? <span key={b.id}><span className="num font-medium text-ink">{n}</span> {b.label.toLowerCase()}</span> : null
                })}
              </div>
            </div>
            {unlocks.length > 0 && (
              <div className="card mt-2.5 divide-y divide-line">
                {unlocks.map((s) => (
                  <button key={s.id} onClick={() => setSkillOpen(s.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left first:rounded-t-card last:rounded-b-card hover:bg-surface-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: dvar(s.discipline), boxShadow: `0 0 12px ${dvar(s.discipline)}` }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">{s.name}</span>
                      <span className="block text-[12px] text-ink-3">{relativeDay(me.statuses[s.id].achievedAt!)} · {s.rating} points</span>
                    </span>
                    <TierTag tier={me.statuses[s.id].tier!} compact />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-2.5 text-right"><TextLink onClick={() => navigate('/tree')}>Skill tree</TextLink></div>
          </Fold>
          <Fold id="training" title="Training" open={wide} summary={me.dedication.total ? `${me.dedication.total} ${me.dedication.total === 1 ? 'session' : 'sessions'} · ${me.dedication.streak}-week streak` : 'Your sessions will show here'}>
            <div className="card p-4">
              <div className="flex items-end justify-between">
                <div className="flex gap-6">
                  <div><Eyebrow>Streak</Eyebrow><div className="display num mt-1 text-[28px]">{me.dedication.streak}<span className="ml-1 font-sans text-[12px] text-ink-3">wk</span></div></div>
                  <div><Eyebrow>Sessions</Eyebrow><div className="display num mt-1 text-[28px]">{me.dedication.total}</div></div>
                </div>
                <span className="text-[11.5px] text-ink-3">Target {me.athlete.weeklyTarget} / week</span>
              </div>
              <div className="relative mt-5 flex h-[72px] items-end gap-1.5">
                <span className="pointer-events-none absolute inset-x-0 border-t border-dashed border-line-strong" style={{ bottom: `${(me.athlete.weeklyTarget / peakWeek) * 100}%` }} />
                {weeks.map((w, i) => (
                  <span key={w.start} className="relative flex h-full flex-1 items-end" title={`${shortDate(w.start)}: ${w.sessions}`}>
                    <span
                      className="w-full rounded-[5px]"
                      style={{ height: `${Math.max(4, (w.sessions / peakWeek) * 100)}%`, background: w.sessions === 0 ? 'var(--surface-3)' : i === weeks.length - 1 ? 'var(--text)' : 'var(--text-3)' }}
                    />
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[12px] leading-snug text-ink-3">Activity over twelve weeks. It is recognised here and in your Dedication score, and never added to Aura or a rating.</p>
            </div>
            {history.length > 0 && (
              <div className="card mt-2.5 divide-y divide-line">
                {history.map((l) => <LogRow key={l.id} log={l} onClick={() => setLogOpen(l.id)} />)}
              </div>
            )}
          </Fold>
          </div>

          <KeepProfile />

          <CoachRequests />

          {admin && (
            <button onClick={() => navigate('/studio')} className="card pressable flex w-full items-center justify-between gap-4 p-4 text-left">
              <span>
                <span className="block text-[15px] font-medium">Studio</span>
                <span className="mt-0.5 block text-[12.5px] text-ink-3">Characters, muscle activation, Aura themes, animations to review, your videos</span>
              </span>
              <span className="font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">Admin</span>
            </button>
          )}

          <button onClick={() => setSettingsOpen(true)} className="card pressable flex w-full items-center justify-between gap-4 p-4 text-left">
            <span>
              <span className="block text-[15px] font-medium">Settings and privacy</span>
              <span className="mt-0.5 block text-[12.5px] text-ink-3">Theme, sounds, what you share, your account</span>
            </span>
            <Settings2 size={17} className="shrink-0 text-ink-3" />
          </button>
        </div>
      </div>

      <Tour open={touring} onClose={(finished) => { setTouring(false); setSettings({ tour: finished ? 'done' : 'skipped' }) }} />
      <AuraSheet aura={a} dedication={me.dedication.score} open={auraOpen} onClose={() => setAuraOpen(false)} />
      <RatingSheet rating={ratingOpen ? me.ratings[ratingOpen] : null} open={!!ratingOpen} onClose={() => setRatingOpen(null)} onLog={(id) => { setRatingOpen(null); setBenchOpen(id) }} />
      <SkillSheet skillId={skillOpen} onClose={() => setSkillOpen(null)} onOpenSkill={setSkillOpen} />
      <LogSheet logId={logOpen} onClose={() => setLogOpen(null)} />
      <LogEvidenceSheet exerciseId={benchOpen} open={!!benchOpen} onClose={() => setBenchOpen(null)} />

      <Sheet open={recordsOpen} onClose={() => setRecordsOpen(false)} eyebrow={`${records.length} benchmarks on record`} title="Personal records">
        <p className="mb-4 text-[13px] leading-relaxed text-ink-2">Your best demonstrated performance on every rated exercise. Self-reported entries can be removed if they were logged by mistake.</p>
        <div className="card divide-y divide-line">
          {records.map(({ e, ex, score }) => (
            <div key={e.id} className="flex items-center gap-3 px-4 py-3">
              <DisciplineDot id={ex.discipline} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{ex.name}</span>
                <span className="block text-[12px] text-ink-3">{formatValue(ex, e.value, true)} · {shortDate(e.date)}</span>
              </span>
              <TierTag tier={e.tier} compact />
              <span className="num w-9 text-right text-[14px] font-medium">{score}</span>
              {!isVerified(e.tier) ? (
                <button aria-label={`Remove ${ex.name} record`} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink" onClick={() => window.confirm(`Remove this ${ex.name} record?`) && removeEvidence(e.id)}>
                  <Trash2 size={14} />
                </button>
              ) : (
                <span className="w-8" />
              )}
            </div>
          ))}
        </div>
      </Sheet>

      {/* Everything that is about the app or the account, not about the athlete: one tap away, out of the way. */}
      <Sheet open={settingsOpen} onClose={() => setSettingsOpen(false)} eyebrow="Your app, your account" title="Settings and privacy">
        <div className="space-y-7">
          <section>
            <SectionTitle>Settings</SectionTitle>
            <div className="card divide-y divide-line">
              <button onClick={() => { setSettingsOpen(false); navigate('/personalize?step=theme') }} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left first:rounded-t-card hover:bg-surface-2">
                <span className="text-[14px]">Theme<span className="block text-[12px] text-ink-3">{THEMES[theme].name} · {THEMES[theme].tone.toLowerCase()}</span></span>
                <span className="text-[12.5px] text-ink-3">Change</span>
              </button>
              <button className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-surface-2" onClick={() => { setSettingsOpen(false); window.setTimeout(() => setTouring(true), 350) }}>
                <span className="text-[14px]">Introduction<span className="block text-[12px] text-ink-3">A one-minute look round your profile</span></span>
                <span className="text-[12.5px] text-ink-3">Show me</span>
              </button>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-[14px]">Sounds<span className="block text-[12px] text-ink-3">Rest timer and skill unlocks</span></span>
                <Toggle on={settings.sound} onChange={(sound) => setSettings({ sound })} label="Sounds" />
              </div>
              {account && !me.athlete.roles.includes('coach') ? (
                <CoachAccessRow />
              ) : (
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-[14px]">Coach mode<span className="block text-[12px] text-ink-3">Shows Coach Studio for building courses and reviewing students</span></span>
                  <Toggle
                    on={coach}
                    onChange={(on) => {
                      // With an account the role is granted by an admin; locally it is the athlete's own choice.
                      if (on && !account && !me.athlete.roles.includes('coach')) updateMe({ roles: [...me.athlete.roles, 'coach'] })
                      setSettings({ coachMode: on })
                    }}
                    label="Coach mode"
                  />
                </div>
              )}
              <div className="px-4 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 text-[14px]">
                    Account
                    <span className="block truncate text-[12px] text-ink-3">
                      {account
                        ? account.guest ? 'Guest profile. Only this browser can open it.' : `Signed in as ${account.email ?? account.name ?? 'your account'}`
                        : !cloud.configured ? 'Local mode. Data is saved on this device only.'
                        : demo ? 'Not signed in. This is the sample world; nothing in it is saved.'
                        : 'Not signed in. Your data is on this device only.'}
                    </span>
                    {account && <SyncLine className="mt-1" />}
                  </span>
                  {cloud.configured && (account ? (
                    <button
                      className="btn btn-quiet btn-sm shrink-0"
                      onClick={() => {
                        const warning = account.guest
                          ? 'You joined as a guest. After signing out, this profile and its results cannot be opened again. Sign out anyway?'
                          : cloud.sync.pending > 0 ? 'Some changes have not reached your account yet and would be lost. Sign out anyway?' : null
                        if (!warning || window.confirm(warning)) void signOut()
                      }}
                    >
                      Sign out
                    </button>
                  ) : (
                    <button className="btn btn-quiet btn-sm shrink-0" onClick={() => void signInWithGoogle()}>Sign in with Google</button>
                  ))}
                </div>
                {!account && cloud.configured && !demo && <p className="mt-2 text-[12px] leading-relaxed text-ink-3">Signing in moves what you have built on this device into your account.</p>}
                {!account && <Notice className="mt-3" />}
              </div>
              {account && !cloud.user?.guest && (
                <div>
                  <button
                    className="flex w-full items-center gap-2 px-4 py-3.5 text-left text-[14px] text-ink-2 last:rounded-b-card hover:bg-surface-2"
                    disabled={erasing}
                    onClick={() => {
                      if (!window.confirm('Erase your results, workouts, goals and assessment answers, and go back to the welcome questions?\n\nYour account, your role and the courses you coach stay. This cannot be undone.')) return
                      setErasing(true)
                      void startOver().then((problem) => { setErasing(false); setEraseProblem(problem) })
                    }}
                  >
                    <Trash2 size={14} /> {erasing ? 'Erasing…' : 'Erase my training data and start over'}
                  </button>
                  {eraseProblem && <p className="px-4 pb-3.5 text-[12.5px] leading-relaxed text-warn">{eraseProblem}</p>}
                </div>
              )}
              {!account && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-3.5 text-left text-[14px] text-ink-2 last:rounded-b-card hover:bg-surface-2"
                  onClick={() => {
                    if (window.confirm('Erase everything on this device and start again from the welcome screen?')) {
                      reset()
                      navigate('/welcome')
                    }
                  }}
                >
                  <Trash2 size={14} /> Start over
                </button>
              )}
            </div>
          </section>
          <PrivacyCard athlete={me.athlete} />
        </div>
      </Sheet>

      <EditProfile open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  )
}

function EditProfile({ open, onClose }: { open: boolean; onClose: () => void }) {
  const me = useMe()
  const updateMe = useStore((s) => s.updateMe)
  const at = me.athlete
  const toggle = (id: EquipmentId) => updateMe({ equipment: at.equipment.includes(id) ? at.equipment.filter((e) => e !== id) : [...at.equipment, id] })
  return (
    <Sheet open={open} onClose={onClose} eyebrow="Your identity" title="Edit profile">
      <div className="space-y-4">
        <label className="block"><Eyebrow className="mb-2">Name</Eyebrow><input className="field" value={at.name} onChange={(e) => updateMe({ name: e.target.value })} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><Eyebrow className="mb-2">Handle</Eyebrow><input className="field" value={at.handle} onChange={(e) => updateMe({ handle: e.target.value.replace(/[^\w.]/g, '').toLowerCase() })} /></label>
          <label className="block"><Eyebrow className="mb-2">Based in · optional</Eyebrow><input className="field" value={at.city ?? ''} placeholder="Your city" onChange={(e) => updateMe({ city: e.target.value || undefined })} /></label>
        </div>
        <p className="-mt-2 text-[12px] text-ink-3">The city you are based in. Leave it empty to stay out of local discovery; who sees it is set under Privacy.</p>
        <IdentityFields athlete={at} />
        <label className="block"><Eyebrow className="mb-2">Bio</Eyebrow><textarea className="field" rows={2} value={at.bio} onChange={(e) => updateMe({ bio: e.target.value })} /></label>
        <div className="flex items-center justify-between">
          <span><Eyebrow>Weekly target</Eyebrow><span className="mt-1 block text-[12.5px] text-ink-3">Sessions you intend to train each week</span></span>
          <Stepper value={at.weeklyTarget} onChange={(weeklyTarget) => updateMe({ weeklyTarget })} min={1} max={10} />
        </div>
        <div>
          <Eyebrow className="mb-2.5">Equipment you can use</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(EQUIPMENT) as EquipmentId[]).map((id) => (
              <button key={id} className={cx('chip')} data-on={at.equipment.includes(id)} onClick={() => toggle(id)}>{EQUIPMENT[id]}</button>
            ))}
          </div>
        </div>
        <button className="btn btn-primary w-full" onClick={onClose}>Done</button>
      </div>
    </Sheet>
  )
}
