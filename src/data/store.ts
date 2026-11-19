import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AssessmentParticipant, AssessmentSession, Athlete, AthletePrivacy, Audience, Course, DisciplineId, Enrollment, Evidence, EvidenceTier, Feedback, LogEntry,
  Place, ResultTier, Visit, WorkoutBlock, WorkoutLog, WorkoutSource,
} from '@/domain/types'
import { PRESENCE, isLive, liveVisit, mergePlaces, privacyOf } from '@/domain/places'
import { PROTOCOL, protocolKnown, resultsToEvidence, stationById, type HandIn, type Invite } from '@/domain/assessment'
import { DEFAULT_AURA_SETTINGS, addNote, makeOfficial, move, newAsset, revise, type AssetStatus, type AuraSettings, type DemoAsset, type NewDemo, type WorkoutVideo } from '@/domain/media'
import { exerciseById, skillById, stepAt } from '@/domain/catalog'
import { bestEvidence } from '@/domain/scoring/mastery'
import { adaptTarget, skillStatuses } from '@/domain/scoring/skills'
import { startOfWeek } from '@/domain/scoring/aura'
import { courseFromTemplate, uid } from './courseTemplates'
import { personalOf, type Personal, type Step } from '@/theme/personal'
import type { ThemeId } from '@/theme/themes'
import { ME, buildWorld, isoDay, sampleCommunity } from './seed'

export interface ActiveWorkout {
  log: WorkoutLog
  /** Index of the entry being worked on. */
  index: number
  phase: 'work' | 'rest' | 'summary'
  restUntil: number | null
  restTotal: number
  /** Completed sets in order, as [entry, set], so the last one can be reopened. */
  trail: [number, number][]
}

export interface Celebration {
  id: string
  skillId: string
  tier: EvidenceTier
}

export interface Settings {
  /** The theme this device last showed, so it can be painted before anything loads. The athlete's own choice lives on their profile. */
  theme: ThemeId
  sound: boolean
  coachMode: boolean
  /** The Aura forms this device has already announced as earned (`universe:form`). Unset until an athlete first opens the app here. */
  seenForms?: string[]
  /** Audience chosen at the last check-in, offered again next time. */
  audience?: Audience
  stayMinutes?: number
  /** Who demonstrates the assessment on this device, and the session it was last chosen for (it is asked at the start of each). */
  instructor?: { character: 'male' | 'female'; sessionId: string }
  /** The introduction on the profile: seen to the end, or waved away. Unset: not offered yet on this device. */
  tour?: 'done' | 'skipped'
}

export interface NewPlace {
  name: string
  kind: Place['kind']
  lat: number
  lon: number
  equipment: Place['equipment']
  amenities: Place['amenities']
  note?: string
}

export type PlacePatch = Partial<Pick<Place, 'name' | 'kind' | 'equipment' | 'amenities' | 'note'>>

/** Places kept on the device beyond the ones the athlete has a tie to. */
const PLACE_CACHE = 1500

export interface OnboardingResult {
  name: string
  handle: string
  coach: boolean
  weeklyTarget: number
  equipment: Athlete['equipment']
  goals: string[]
  /** Self-assessment answers: exercise id -> conservative value. */
  estimates: Record<string, number>
}

export interface NewAssessment {
  title: string
  groupName: string
  courseId?: string
  stations: DisciplineId[]
  kind: 'baseline' | 'retest'
  baselineId?: string
  /** Defaults to stations for a group: athletes choose their variations, and groups rotate. */
  mode?: AssessmentSession['mode']
  groups?: number
}

export type ImportOutcome = 'added' | 'updated' | 'unknown-session' | 'wrong-protocol'

/** A workout video as the admin fills it in. Without an id it is a new one. */
export type WorkoutVideoInput = Omit<WorkoutVideo, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { id?: string }

/** What the server holds of the admin-managed content, as far as this account may see it. */
export interface ServerContent { demos: DemoAsset[]; workoutVideos: WorkoutVideo[]; auraSettings: AuraSettings | null }

export const shortId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (b) => (b % 36).toString(36)).join('')
}

/** Ids the database will accept once there is an account; the short form keeps local links small. */
const freshId = (s: { cloudUid: string | null }) => (s.cloudUid ? uid() : shortId())

const slug = (name: string) => name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '') || 'athlete'

const dirtied = (list: string[], ...keys: string[]) => [...list, ...keys.filter((k) => !list.includes(k))]

/**
 * Keep the evidence table in step with one participant's assessment results.
 *
 * Results become evidence in exactly two situations: the athlete has finished
 * on their own device, or the coach has finalised the session on theirs.
 * Until then they are assessment data only and move no rating.
 */
function syncEvidence(
  s: { evidence: Evidence[]; assessments: AssessmentSession[]; participants: AssessmentParticipant[]; meId: string | null },
  participantId: string,
): Evidence[] {
  const p = s.participants.find((x) => x.id === participantId)
  const session = p && s.assessments.find((a) => a.id === p.sessionId)
  if (!p || !session || !p.athleteId) return s.evidence
  const own = p.athleteId === s.meId && !!p.submittedAt
  const finalised = session.origin === 'local' && session.status === 'finalised'
  const rest = s.evidence.filter((e) => !(e.assessmentId === session.id && e.athleteId === p.athleteId))
  if (!own && !finalised) return rest
  return [...rest, ...resultsToEvidence(p.results, p.athleteId, session.id, session.coachId ?? undefined)]
}

export interface Candidate {
  exerciseId: string
  value: number
  previous: number
}

interface State {
  meId: string | null
  athletes: Record<string, Athlete>
  evidence: Evidence[]
  logs: WorkoutLog[]
  courses: Course[]
  enrollments: Enrollment[]
  feedback: Feedback[]
  /** Coach-supplied demonstration video per exercise. */
  media: Record<string, string>
  /** Animated and filmed demonstrations, every version and status. Athletes are shown the published ones only. */
  demos: DemoAsset[]
  workoutVideos: WorkoutVideo[]
  auraSettings: AuraSettings
  /** Content changes the server has not got yet: `demo:<id>`, `workout:<id>`, `settings`, and `gone:demo:<id>` / `gone:workout:<id>`. */
  contentDirty: string[]
  following: string[]
  assessments: AssessmentSession[]
  participants: AssessmentParticipant[]
  /** Every place this device knows: fetched from OpenStreetMap, added here, or received in a link. */
  places: Record<string, Place>
  visits: Visit[]
  /** Who each other athlete follows. Sample data until accounts exist. */
  follows: Record<string, string[]>
  mapView: { lat: number; lon: number; zoom: number } | null
  active: ActiveWorkout | null
  settings: Settings
  celebrations: Celebration[]
  /** Skills mastered since the athlete last looked at the tree: each plays its level-up there, once. */
  ascents: string[]
  /** The sample world is loaded. Nothing in it is anyone's real data. */
  demo: boolean
  /** The signed-in account this device's data belongs to; null when everything is local. */
  cloudUid: string | null
  /** What the server is known to hold, row by row. Owned by the sync engine (src/data/cloud). */
  cloudShadow: Record<string, string>

  startDemo: () => void
  completeOnboarding: (r: OnboardingResult) => void
  reset: () => void
  updateMe: (patch: Partial<Athlete>) => void
  setSettings: (patch: Partial<Settings>) => void
  toggleGoal: (skillId: string) => void
  toggleFollow: (athleteId: string) => void

  addEvidence: (e: { exerciseId: string; value: number; source: Evidence['source']; logId?: string; note?: string }) => void
  removeEvidence: (id: string) => void
  dismissCelebration: (id: string) => void
  /** Play (or replay) a skill's level-up the next time its part of the tree is on screen. */
  queueAscent: (skillId: string) => void
  takeAscent: (skillId: string) => void

  startWorkout: (source: WorkoutSource, title: string, blocks: WorkoutBlock[]) => void
  setVariation: (index: number, level: number, exerciseId?: string) => void
  completeSet: (value: number) => void
  undoSet: () => void
  goTo: (index: number) => void
  endRest: () => void
  extendRest: (seconds: number) => void
  toSummary: () => void
  finishWorkout: (r: { rpe?: number; note?: string; claims: Candidate[] }) => string | null
  discardWorkout: () => void

  joinCourse: (courseId: string) => void
  leaveCourse: (courseId: string) => void

  createCourse: (templateId: string | null) => string
  mutateCourse: (courseId: string, fn: (draft: Course) => void) => void
  deleteCourse: (courseId: string) => void
  enroll: (courseId: string, athleteId: string) => void
  unenroll: (enrollmentId: string) => void
  addFeedback: (logId: string, text: string) => void
  verifyEvidence: (evidenceId: string) => void
  setMedia: (exerciseId: string, url: string) => void

  // Demonstrations, workout videos and Aura themes: managed by an admin (src/domain/media.ts)
  createDemo: (input: NewDemo) => string
  /** Follows the review workflow; an illegal move does nothing. Publishing archives the version it replaces. */
  moveDemo: (id: string, to: AssetStatus) => void
  /** Approve in one step: the version becomes the official demonstration wherever its exercise is shown. */
  approveDemo: (id: string) => void
  noteDemo: (id: string, note: { tags: string[]; text: string }) => void
  /** A new pending version of the same demonstration, carrying its correction notes. */
  reviseDemo: (id: string) => string | null
  patchDemo: (id: string, patch: Partial<Pick<DemoAsset, 'title' | 'description' | 'video' | 'animation'>>) => void
  /** Drafts and archived versions only. */
  removeDemo: (id: string) => void
  saveWorkoutVideo: (video: WorkoutVideoInput) => string
  removeWorkoutVideo: (id: string) => void
  setAuraSettings: (patch: Partial<Pick<AuraSettings, 'defaultTheme' | 'themes' | 'universes'>>) => void
  /** Take in what the server holds. Changes still waiting to be sent win; owned by src/data/cloud/content.ts. */
  applyContent: (server: ServerContent) => void
  contentSent: (keys: string[]) => void

  // Assessments
  createAssessment: (input: NewAssessment) => string
  startSoloAssessment: () => string
  /** Join from a coach's invitation. Creates a minimal athlete when this device has none. */
  acceptInvite: (invite: Invite, who: { name: string; sharing: 'coach' | 'group' }) => string
  recordResult: (participantId: string, testId: string, value: number, opts?: { tier?: ResultTier; skipped?: boolean }) => void
  clearResult: (participantId: string, testId: string) => void
  patchParticipant: (participantId: string, patch: Partial<Pick<AssessmentParticipant, 'name' | 'sharing' | 'partner' | 'group'>>) => void
  toggleStationSkip: (participantId: string, station: DisciplineId) => void
  toggleFlag: (participantId: string, station: DisciplineId) => void
  submitAssessment: (participantId: string) => void
  addParticipant: (sessionId: string, name: string, athleteId?: string) => string
  removeParticipant: (participantId: string) => void
  importHandIn: (handIn: HandIn) => ImportOutcome
  setStationTier: (participantId: string, station: DisciplineId, tier: ResultTier) => void
  patchAssessment: (sessionId: string, patch: Partial<Pick<AssessmentSession, 'title' | 'groupName' | 'stationMinutes' | 'rotationStartedAt' | 'stations' | 'mode' | 'groups'>>) => void
  finaliseAssessment: (sessionId: string) => void
  deleteAssessment: (sessionId: string) => void

  // Places and presence
  mergePlaces: (incoming: Place[]) => void
  addPlace: (input: NewPlace) => string
  editPlace: (placeId: string, patch: PlacePatch) => void
  /** Only while checked in: the athlete vouches for the details as they stand. */
  confirmPlace: (placeId: string) => void
  removePlace: (placeId: string) => void
  toggleFavourite: (placeId: string) => void
  setHomePlace: (placeId: string | null) => void
  setPrivacy: (patch: Partial<AthletePrivacy>) => void
  /** Theme, character, form, appearance. `step` marks a step of personalization as done. */
  setStyle: (patch: Partial<Personal>, step?: Step) => void
  /** Start a stay. Any stay still running ends first: nobody is in two places. */
  checkIn: (placeId: string, opts: { minutes: number; audience: Audience; onSite: boolean }) => void
  checkOut: () => void
  extendStay: (minutes: number) => void
  removeVisit: (visitId: string) => void
  /** Forget every stay of this device's athlete, running or past. */
  clearMyVisits: () => void
  setMapView: (view: { lat: number; lon: number; zoom: number }) => void
}

const empty = {
  meId: null as string | null,
  athletes: {} as Record<string, Athlete>,
  evidence: [] as Evidence[],
  logs: [] as WorkoutLog[],
  courses: [] as Course[],
  enrollments: [] as Enrollment[],
  feedback: [] as Feedback[],
  media: {} as Record<string, string>,
  demos: [] as DemoAsset[],
  workoutVideos: [] as WorkoutVideo[],
  auraSettings: { ...DEFAULT_AURA_SETTINGS } as AuraSettings,
  contentDirty: [] as string[],
  following: [] as string[],
  assessments: [] as AssessmentSession[],
  participants: [] as AssessmentParticipant[],
  places: {} as Record<string, Place>,
  visits: [] as Visit[],
  follows: {} as Record<string, string[]>,
  mapView: null as { lat: number; lon: number; zoom: number } | null,
  active: null as ActiveWorkout | null,
  celebrations: [] as Celebration[],
  ascents: [] as string[],
  demo: false,
  cloudUid: null as string | null,
  cloudShadow: {} as Record<string, string>,
}

/** A fresh, empty world. Used when an account signs in or out. */
export const emptyWorld = () => structuredClone(empty)

/** What an invitation link carries when the session lives in the database: unguessable, and nothing else. */
export const inviteToken = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')

const entryFromBlock = (b: WorkoutBlock): LogEntry => ({
  blockId: b.id,
  kind: b.kind,
  progressionId: b.progressionId,
  assignedExerciseId: b.exerciseId,
  assignedLevel: b.level,
  assignedTarget: b.target,
  exerciseId: b.exerciseId,
  level: b.level,
  target: b.target,
  rest: b.rest,
  minLevel: b.minLevel,
  maxLevel: b.maxLevel,
  note: b.note,
  sets: Array.from({ length: b.sets }, () => ({ value: 0, done: false, exerciseId: b.exerciseId, level: b.level })),
})

const firstOpen = (entries: LogEntry[], from = 0) => {
  for (let i = 0; i < entries.length; i++) {
    const idx = (from + i) % entries.length
    if (entries[idx].sets.some((s) => !s.done)) return idx
  }
  return -1
}

/** Bests in a finished log that beat what the athlete has on record. */
export function candidatesIn(log: WorkoutLog, evidence: Evidence[]): Candidate[] {
  const best = bestEvidence(evidence.filter((e) => e.athleteId === log.athleteId))
  const top = new Map<string, number>()
  for (const entry of log.entries) {
    for (const s of entry.sets) {
      if (!s.done || !exerciseById[s.exerciseId]?.curve) continue
      top.set(s.exerciseId, Math.max(top.get(s.exerciseId) ?? 0, s.value))
    }
  }
  const out: Candidate[] = []
  for (const [exerciseId, value] of top) {
    const previous = best.get(exerciseId)?.value ?? 0
    if (value > previous) out.push({ exerciseId, value, previous })
  }
  return out
}

/**
 * Bring a stored world up to date. Version 2 added places and presence: worlds
 * saved before it get the sample community their sample athletes belong to;
 * nothing of the owner's is changed.
 */
export function migrateStored(persisted: unknown, version: number) {
  let s = persisted as State
  if (!s?.athletes) return s
  // Version 3 added accounts: say whether a stored world is the sample one, and that nothing is synced yet.
  if (version < 3) s = { ...s, demo: s.meId === ME && s.athletes[ME]?.handle === 'alex', cloudUid: null, cloudShadow: {} }
  // Version 4 added admin-managed content. The sample athlete becomes an admin, so the Studio can be explored in the demo.
  if (version < 4) {
    s = { ...s, demos: [], workoutVideos: [], auraSettings: { ...DEFAULT_AURA_SETTINGS }, contentDirty: [] }
    const me = s.demo ? s.athletes[ME] : undefined
    if (me && !me.roles.includes('admin')) s = { ...s, athletes: { ...s.athletes, [ME]: { ...me, roles: [...me.roles, 'admin'] } } }
  }
  if (version >= 2) return s
  const demo = s.demo
  const c = sampleCommunity(new Date(), demo)
  const athletes = { ...s.athletes }
  for (const [id, identity] of Object.entries(c.identities)) if (athletes[id]) athletes[id] = { ...identity, ...athletes[id] }
  return { ...s, athletes, places: c.places, visits: c.visits.filter((v) => athletes[v.athleteId]), follows: c.follows, mapView: c.mapView }
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...empty,
      settings: { theme: 'dark', sound: true, coachMode: true },

      startDemo: () => {
        const world = buildWorld(new Date(), true)
        set({ ...empty, ...world, meId: ME, demo: true, settings: { ...get().settings, coachMode: true } })
      },

      completeOnboarding: (r) => {
        const now = new Date()
        const account = get().cloudUid
        if (account) {
          // Signed in: the profile already exists in the database. Fill it in; there is no sample world.
          const s = get()
          const was = s.athletes[account]
          // Roles beyond athlete are granted on the server (coach access by request); never set here.
          const roles = new Set<Athlete['roles'][number]>(was?.roles ?? ['athlete'])
          const me: Athlete = {
            ...was, id: account, name: r.name.trim() || was?.name || 'Athlete', handle: r.handle.trim(), bio: was?.bio ?? '', roles: [...roles],
            goals: r.goals, joinedAt: was?.joinedAt ?? now.toISOString(), weeklyTarget: r.weeklyTarget, equipment: r.equipment,
          }
          const estimates: Evidence[] = Object.entries(r.estimates)
            .filter(([, v]) => v > 0)
            .map(([exerciseId, value]) => ({ id: uid(), athleteId: account, exerciseId, value, tier: 'estimated', source: 'onboarding', date: now.toISOString() }))
          set({ athletes: { ...s.athletes, [account]: me }, evidence: [...s.evidence, ...estimates], meId: account, settings: { ...s.settings, coachMode: r.coach } })
          return
        }
        const world = buildWorld(now, false)
        const me: Athlete = {
          id: ME,
          name: r.name.trim() || 'Athlete',
          handle: r.handle.trim() || 'athlete',
          bio: '',
          roles: r.coach ? ['athlete', 'coach'] : ['athlete'],
          goals: r.goals,
          joinedAt: now.toISOString(),
          weeklyTarget: r.weeklyTarget,
          equipment: r.equipment,
        }
        const estimates: Evidence[] = Object.entries(r.estimates)
          .filter(([, v]) => v > 0)
          .map(([exerciseId, value]) => ({
            id: uid(), athleteId: ME, exerciseId, value, tier: 'estimated', source: 'onboarding', date: now.toISOString(),
          }))
        set({
          ...empty,
          ...world,
          athletes: { ...world.athletes, [ME]: me },
          evidence: [...world.evidence, ...estimates],
          meId: ME,
          settings: { ...get().settings, coachMode: r.coach },
        })
      },

      reset: () => set({ ...empty }),

      updateMe: (patch) =>
        set((s) => (s.meId ? { athletes: { ...s.athletes, [s.meId]: { ...s.athletes[s.meId], ...patch } } } : s)),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      setStyle: (patch, step) =>
        set((s) => {
          if (!s.meId) return s
          const me = s.athletes[s.meId]
          const was = personalOf(me)
          const style: Personal = {
            ...was, ...patch,
            forms: { ...was.forms, ...patch.forms }, finishes: { ...was.finishes, ...patch.finishes },
            steps: step ? { ...was.steps, [step]: new Date().toISOString() } : was.steps,
          }
          return { athletes: { ...s.athletes, [me.id]: { ...me, style } } }
        }),

      toggleGoal: (skillId) =>
        set((s) => {
          if (!s.meId) return s
          const me = s.athletes[s.meId]
          const goals = me.goals.includes(skillId) ? me.goals.filter((g) => g !== skillId) : [...me.goals, skillId]
          return { athletes: { ...s.athletes, [me.id]: { ...me, goals } } }
        }),

      toggleFollow: (id) =>
        set((s) => ({ following: s.following.includes(id) ? s.following.filter((f) => f !== id) : [...s.following, id] })),

      addEvidence: ({ exerciseId, value, source, logId, note }) => {
        const s = get()
        if (!s.meId || value <= 0) return
        const mine = s.evidence.filter((e) => e.athleteId === s.meId)
        const before = skillStatuses(mine)
        const item: Evidence = {
          id: uid(), athleteId: s.meId, exerciseId, value, tier: 'self', source, date: new Date().toISOString(), logId, note,
        }
        const after = skillStatuses([...mine, item])
        const unlocked = Object.keys(after)
          .filter((id) => after[id].state === 'mastered' && !after[id].implied && before[id].state !== 'mastered')
          .sort((a, b) => skillById[b].rating - skillById[a].rating)
        set({
          evidence: [...s.evidence, item],
          // One moment per piece of evidence: celebrate the highest milestone it cleared.
          celebrations: unlocked.length
            ? [...s.celebrations, { id: uid(), skillId: unlocked[0], tier: 'self' }]
            : s.celebrations,
          ascents: unlocked.length ? [...(s.ascents ?? []).filter((id) => id !== unlocked[0]), unlocked[0]] : (s.ascents ?? []),
        })
      },

      removeEvidence: (id) => set((s) => ({ evidence: s.evidence.filter((e) => e.id !== id) })),
      dismissCelebration: (id) => set((s) => ({ celebrations: s.celebrations.filter((c) => c.id !== id) })),
      queueAscent: (skillId) => set((s) => ({ ascents: [...(s.ascents ?? []).filter((id) => id !== skillId), skillId] })),
      takeAscent: (skillId) => set((s) => ({ ascents: (s.ascents ?? []).filter((id) => id !== skillId) })),

      startWorkout: (source, title, blocks) => {
        const s = get()
        if (!s.meId || blocks.length === 0) return
        set({
          active: {
            log: { id: uid(), athleteId: s.meId, title, source, startedAt: new Date().toISOString(), entries: blocks.map(entryFromBlock) },
            index: 0,
            phase: 'work',
            restUntil: null,
            restTotal: 0,
            trail: [],
          },
        })
      },

      setVariation: (index, level, exerciseId) =>
        set((s) => {
          if (!s.active) return s
          const entry = s.active.log.entries[index]
          if (!entry?.progressionId) return s
          const step = stepAt(entry.progressionId, level)
          if (!step) return s
          if (entry.minLevel && level < entry.minLevel) return s
          if (entry.maxLevel && level > entry.maxLevel) return s
          const nextId = exerciseId && [step.exerciseId, ...(step.alternates ?? [])].includes(exerciseId) ? exerciseId : step.exerciseId
          const next = exerciseById[nextId]
          const target = adaptTarget(exerciseById[entry.assignedExerciseId], entry.assignedTarget, next, level - (entry.assignedLevel ?? level))
          const entries = s.active.log.entries.map((e, i) =>
            i === index
              ? {
                  ...e,
                  exerciseId: nextId,
                  level,
                  target,
                  sets: e.sets.map((x) => (x.done ? x : { ...x, exerciseId: nextId, level })),
                }
              : e,
          )
          return { active: { ...s.active, log: { ...s.active.log, entries } } }
        }),

      completeSet: (value) =>
        set((s) => {
          const a = s.active
          if (!a) return s
          const entry = a.log.entries[a.index]
          const setIdx = entry.sets.findIndex((x) => !x.done)
          if (setIdx < 0) return s
          const entries = a.log.entries.map((e, i) =>
            i === a.index
              ? {
                  ...e,
                  sets: e.sets.map((x, j) =>
                    j === setIdx ? { value: Math.max(0, Math.round(value)), done: true, exerciseId: e.exerciseId, level: e.level } : x,
                  ),
                }
              : e,
          )
          const blockDone = entries[a.index].sets.every((x) => x.done)
          const nextIndex = blockDone ? firstOpen(entries, a.index + 1) : a.index
          const log = { ...a.log, entries }
          const trail: [number, number][] = [...a.trail, [a.index, setIdx]]
          if (nextIndex < 0) return { active: { ...a, log, trail, phase: 'summary', restUntil: null } }
          const rest = entry.rest
          return {
            active: {
              ...a,
              log,
              trail,
              index: nextIndex,
              phase: rest > 0 ? 'rest' : 'work',
              restUntil: rest > 0 ? Date.now() + rest * 1000 : null,
              restTotal: rest,
            },
          }
        }),

      undoSet: () =>
        set((s) => {
          const a = s.active
          const last = a?.trail.at(-1)
          if (!a || !last) return s
          const [entryIdx, setIdx] = last
          const entries = a.log.entries.map((e, i) =>
            i === entryIdx ? { ...e, sets: e.sets.map((x, j) => (j === setIdx ? { ...x, done: false, value: 0 } : x)) } : e,
          )
          return {
            active: { ...a, log: { ...a.log, entries }, trail: a.trail.slice(0, -1), index: entryIdx, phase: 'work', restUntil: null },
          }
        }),

      goTo: (index) =>
        set((s) => (s.active ? { active: { ...s.active, index, phase: 'work', restUntil: null } } : s)),

      endRest: () => set((s) => (s.active ? { active: { ...s.active, phase: 'work', restUntil: null } } : s)),

      extendRest: (seconds) =>
        set((s) =>
          s.active?.restUntil
            ? { active: { ...s.active, restUntil: s.active.restUntil + seconds * 1000, restTotal: s.active.restTotal + seconds } }
            : s,
        ),

      toSummary: () => set((s) => (s.active ? { active: { ...s.active, phase: 'summary', restUntil: null } } : s)),

      finishWorkout: ({ rpe, note, claims }) => {
        const s = get()
        const a = s.active
        if (!a) return null
        const log: WorkoutLog = {
          ...a.log,
          finishedAt: new Date().toISOString(),
          placeId: liveVisit(s.visits, a.log.athleteId, Date.now())?.placeId,
          rpe,
          note: note?.trim() || undefined,
          // Keep only what was actually performed.
          entries: a.log.entries
            .map((e) => ({ ...e, sets: e.sets.filter((x) => x.done) }))
            .filter((e) => e.sets.length > 0),
        }
        set({ logs: [...s.logs, log], active: null })
        // Activity is saved above. Mastery only moves through explicit claims.
        for (const c of claims) get().addEvidence({ exerciseId: c.exerciseId, value: c.value, source: 'workout', logId: log.id })
        return log.id
      },

      discardWorkout: () => set({ active: null }),

      joinCourse: (courseId) =>
        set((s) => {
          if (!s.meId || s.enrollments.some((e) => e.courseId === courseId && e.athleteId === s.meId)) return s
          return {
            enrollments: [
              ...s.enrollments,
              { id: uid(), courseId, athleteId: s.meId, joinedAt: new Date().toISOString(), status: 'active' },
            ],
          }
        }),

      leaveCourse: (courseId) =>
        set((s) => ({ enrollments: s.enrollments.filter((e) => !(e.courseId === courseId && e.athleteId === s.meId)) })),

      createCourse: (templateId) => {
        const s = get()
        const nextMonday = new Date(startOfWeek(new Date()).getTime() + 7 * 86400000)
        const course = courseFromTemplate(templateId, s.meId ?? ME, isoDay(nextMonday))
        set({ courses: [...s.courses, course] })
        return course.id
      },

      mutateCourse: (courseId, fn) =>
        set((s) => ({
          courses: s.courses.map((c) => {
            if (c.id !== courseId) return c
            const draft = structuredClone(c)
            fn(draft)
            return draft
          }),
        })),

      deleteCourse: (courseId) =>
        set((s) => ({
          courses: s.courses.filter((c) => c.id !== courseId),
          enrollments: s.enrollments.filter((e) => e.courseId !== courseId),
        })),

      enroll: (courseId, athleteId) =>
        set((s) =>
          s.enrollments.some((e) => e.courseId === courseId && e.athleteId === athleteId)
            ? s
            : {
                enrollments: [
                  ...s.enrollments,
                  { id: uid(), courseId, athleteId, joinedAt: new Date().toISOString(), status: 'active' },
                ],
              },
        ),

      unenroll: (enrollmentId) => set((s) => ({ enrollments: s.enrollments.filter((e) => e.id !== enrollmentId) })),

      addFeedback: (logId, text) =>
        set((s) => {
          const log = s.logs.find((l) => l.id === logId)
          if (!log || !s.meId || !text.trim()) return s
          return {
            feedback: [
              ...s.feedback,
              { id: uid(), logId, coachId: s.meId, athleteId: log.athleteId, text: text.trim(), date: new Date().toISOString() },
            ],
          }
        }),

      verifyEvidence: (evidenceId) =>
        set((s) => ({
          evidence: s.evidence.map((e) =>
            e.id === evidenceId && s.meId
              ? { ...e, tier: 'coach', verifiedBy: s.meId, verifiedAt: new Date().toISOString() }
              : e,
          ),
        })),

      setMedia: (exerciseId, url) =>
        set((s) => {
          const media = { ...s.media }
          if (url.trim()) media[exerciseId] = url.trim()
          else delete media[exerciseId]
          return { media }
        }),

      // ── Demonstrations, workout videos, Aura themes ──────────────────

      createDemo: (input) => {
        const s = get()
        const id = freshId(s)
        set({ demos: [...s.demos, newAsset(s.demos, input, id, new Date().toISOString(), s.meId)], contentDirty: dirtied(s.contentDirty, `demo:${id}`) })
        return id
      },

      moveDemo: (id, to) =>
        set((s) => {
          const demos = move(s.demos, id, to, new Date().toISOString())
          if (demos === s.demos) return s
          // Publishing may have archived another version: that one changed too.
          const changed = demos.filter((d, i) => d !== s.demos[i]).map((d) => `demo:${d.id}`)
          return { demos, contentDirty: dirtied(s.contentDirty, ...changed) }
        }),

      approveDemo: (id) =>
        set((s) => {
          const demos = makeOfficial(s.demos, id, new Date().toISOString())
          if (demos === s.demos) return s
          const changed = demos.filter((d, i) => d !== s.demos[i]).map((d) => `demo:${d.id}`)
          return { demos, contentDirty: dirtied(s.contentDirty, ...changed) }
        }),

      noteDemo: (id, note) =>
        set((s) => {
          if (!note.text.trim() && note.tags.length === 0) return s
          const full = { id: shortId(), at: new Date().toISOString(), by: s.meId, tags: note.tags, text: note.text.trim() }
          return { demos: addNote(s.demos, id, full), contentDirty: dirtied(s.contentDirty, `demo:${id}`) }
        }),

      reviseDemo: (id) => {
        const s = get()
        if (!s.demos.some((d) => d.id === id)) return null
        const next = freshId(s)
        set({ demos: revise(s.demos, id, next, new Date().toISOString(), s.meId), contentDirty: dirtied(s.contentDirty, `demo:${next}`) })
        return next
      },

      patchDemo: (id, patch) =>
        set((s) => ({
          demos: s.demos.map((d) => (d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d)),
          contentDirty: dirtied(s.contentDirty, `demo:${id}`),
        })),

      removeDemo: (id) =>
        set((s) => {
          const d = s.demos.find((x) => x.id === id)
          if (!d || (d.status !== 'draft' && d.status !== 'archived')) return s
          return { demos: s.demos.filter((x) => x.id !== id), contentDirty: dirtied(s.contentDirty.filter((k) => k !== `demo:${id}`), `gone:demo:${id}`) }
        }),

      saveWorkoutVideo: (video) => {
        const s = get()
        const now = new Date().toISOString()
        const was = video.id ? s.workoutVideos.find((w) => w.id === video.id) : undefined
        const id = was?.id ?? freshId(s)
        const next: WorkoutVideo = {
          ...video, id, createdBy: was?.createdBy ?? s.meId, createdAt: was?.createdAt ?? now, updatedAt: now,
          publishedAt: video.status === 'published' ? was?.publishedAt ?? now : was?.publishedAt ?? null,
        }
        set({ workoutVideos: was ? s.workoutVideos.map((w) => (w.id === id ? next : w)) : [...s.workoutVideos, next], contentDirty: dirtied(s.contentDirty, `workout:${id}`) })
        return id
      },

      removeWorkoutVideo: (id) =>
        set((s) => ({
          workoutVideos: s.workoutVideos.filter((w) => w.id !== id),
          contentDirty: dirtied(s.contentDirty.filter((k) => k !== `workout:${id}`), `gone:workout:${id}`),
        })),

      setAuraSettings: (patch) =>
        set((s) => ({ auraSettings: { ...s.auraSettings, ...patch, updatedAt: new Date().toISOString() }, contentDirty: dirtied(s.contentDirty, 'settings') })),

      applyContent: (server) =>
        set((s) => {
          const dirty = new Set(s.contentDirty)
          // Without an account there is no server to answer to: what is on the device stays.
          const authoritative = !!s.cloudUid
          const merge = <T extends { id: string }>(local: T[], remote: T[], prefix: string): T[] => {
            const seen = new Set(remote.map((r) => r.id))
            const mine = new Map(local.map((l) => [l.id, l]))
            const out = remote.filter((r) => !dirty.has(`gone:${prefix}:${r.id}`)).map((r) => (dirty.has(`${prefix}:${r.id}`) ? mine.get(r.id) ?? r : r))
            for (const l of local) if (!seen.has(l.id) && (dirty.has(`${prefix}:${l.id}`) || !authoritative)) out.push(l)
            return out
          }
          return {
            demos: merge(s.demos, server.demos, 'demo'),
            workoutVideos: merge(s.workoutVideos, server.workoutVideos, 'workout'),
            auraSettings: dirty.has('settings') || !server.auraSettings ? s.auraSettings : server.auraSettings,
          }
        }),

      contentSent: (keys) => set((s) => ({ contentDirty: s.contentDirty.filter((k) => !keys.includes(k)) })),

      // ── Assessments ──────────────────────────────────────────────────

      createAssessment: (input) => {
        const s = get()
        const me = s.meId ? s.athletes[s.meId] : null
        const session: AssessmentSession = {
          id: freshId(s), ...(s.cloudUid ? { inviteToken: inviteToken() } : {}), protocol: PROTOCOL, title: input.title.trim() || 'Baseline', kind: input.kind, groupName: input.groupName.trim() || 'My group',
          coachId: s.meId, coachName: me?.name ?? 'Coach', courseId: input.courseId, baselineId: input.baselineId, stations: input.stations,
          status: 'open', origin: 'local', createdAt: new Date().toISOString(), stationMinutes: 6,
          mode: input.mode ?? 'stations', groups: input.groups ?? Math.min(3, input.stations.length),
        }
        // A re-test starts with the people who took the baseline, so nobody has to rejoin.
        const carried: AssessmentParticipant[] = input.baselineId
          ? s.participants
              .filter((p) => p.sessionId === input.baselineId)
              .map((p) => ({ id: freshId(s), sessionId: session.id, athleteId: p.athleteId, name: p.name, joinedAt: p.joinedAt, via: 'coach', sharing: p.sharing, results: {}, skipped: [], flags: [], ...(p.group !== undefined ? { group: p.group } : {}) }))
          : []
        set({ assessments: [...s.assessments, session], participants: [...s.participants, ...carried] })
        return session.id
      },

      startSoloAssessment: () => {
        const s = get()
        if (!s.meId) return ''
        const mine = s.assessments.filter((a) => a.origin === 'solo')
        const open = mine.find((a) => a.status === 'open')
        if (open) return open.id
        const previous = mine.filter((a) => a.status === 'finalised').sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
        const now = new Date().toISOString()
        const session: AssessmentSession = {
          id: freshId(s), protocol: PROTOCOL, title: previous ? 'Re-test' : 'Baseline', kind: previous ? 'retest' : 'baseline', groupName: 'On my own',
          coachId: null, coachName: '', baselineId: previous?.id, stations: ['mobility', 'push', 'pull', 'core', 'legs', 'handstand'],
          status: 'open', origin: 'solo', createdAt: now, stationMinutes: 6,
        }
        const me: AssessmentParticipant = { id: freshId(s), sessionId: session.id, athleteId: s.meId, name: s.athletes[s.meId].name, joinedAt: now, via: 'self', sharing: 'coach', results: {}, skipped: [], flags: [] }
        set({ assessments: [...s.assessments, session], participants: [...s.participants, me] })
        return session.id
      },

      acceptInvite: (invite, who) => {
        let s = get()
        const now = new Date().toISOString()
        if (!s.meId) {
          // Someone who scanned a code in class: enough of a profile to start, nothing more.
          const name = who.name.trim() || 'Athlete'
          const me: Athlete = { id: ME, name, handle: slug(name), bio: '', roles: ['athlete'], goals: [], joinedAt: now, weeklyTarget: 3, equipment: ['floor', 'wall', 'bar', 'box'] }
          set({ ...empty, meId: ME, athletes: { [ME]: me }, settings: { ...s.settings, coachMode: false } })
          s = get()
        }
        const meId = s.meId!
        let assessments = s.assessments
        if (!assessments.some((a) => a.id === invite.id)) {
          assessments = [...assessments, {
            id: invite.id, protocol: invite.protocol, title: invite.title, kind: invite.kind, groupName: invite.groupName, coachId: null,
            coachName: invite.coachName, courseId: invite.courseId, stations: invite.stations, status: 'open', origin: 'invite', createdAt: now,
            stationMinutes: invite.stationMinutes, mode: invite.mode ?? 'guided',
          }]
        }
        let participants = s.participants
        const existing = participants.find((p) => p.sessionId === invite.id && p.athleteId === meId)
        if (existing) participants = participants.map((p) => (p.id === existing.id ? { ...p, sharing: who.sharing } : p))
        else participants = [...participants, { id: freshId(s), sessionId: invite.id, athleteId: meId, name: s.athletes[meId].name, joinedAt: now, via: 'self', sharing: who.sharing, results: {}, skipped: [], flags: [] }]
        set({ assessments, participants })
        return invite.id
      },

      recordResult: (participantId, testId, value, opts) =>
        set((s) => {
          const participants = s.participants.map((p) =>
            p.id === participantId
              ? { ...p, results: { ...p.results, [testId]: { value: Math.max(0, Math.round(value)), tier: opts?.tier ?? 'self', at: new Date().toISOString(), ...(opts?.skipped ? { skipped: true } : {}) } } }
              : p,
          )
          return { participants, evidence: syncEvidence({ ...s, participants }, participantId) }
        }),

      clearResult: (participantId, testId) =>
        set((s) => {
          const participants = s.participants.map((p) => {
            if (p.id !== participantId) return p
            const results = { ...p.results }
            delete results[testId]
            return { ...p, results }
          })
          return { participants, evidence: syncEvidence({ ...s, participants }, participantId) }
        }),

      patchParticipant: (participantId, patch) =>
        set((s) => ({ participants: s.participants.map((p) => (p.id === participantId ? { ...p, ...patch } : p)) })),

      toggleStationSkip: (participantId, station) =>
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId ? { ...p, skipped: p.skipped.includes(station) ? p.skipped.filter((x) => x !== station) : [...p.skipped, station] } : p,
          ),
        })),

      toggleFlag: (participantId, station) =>
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId ? { ...p, flags: p.flags.includes(station) ? p.flags.filter((x) => x !== station) : [...p.flags, station] } : p,
          ),
        })),

      submitAssessment: (participantId) =>
        set((s) => {
          const now = new Date().toISOString()
          const target = s.participants.find((p) => p.id === participantId)
          if (!target) return s
          const participants = s.participants.map((p) => (p.id === participantId ? { ...p, submittedAt: now } : p))
          // A self-directed assessment has no coach to close it: finishing is finalising.
          const assessments = s.assessments.map((a) => (a.id === target.sessionId && a.origin === 'solo' ? { ...a, status: 'finalised' as const, finalisedAt: now } : a))
          return { participants, assessments, evidence: syncEvidence({ ...s, participants, assessments }, participantId) }
        }),

      addParticipant: (sessionId, name, athleteId) => {
        const id = freshId(get())
        set((s) => ({
          participants: [...s.participants, { id, sessionId, athleteId, name: name.trim() || 'Participant', joinedAt: new Date().toISOString(), via: 'coach', sharing: 'coach', results: {}, skipped: [], flags: [] }],
        }))
        return id
      },

      removeParticipant: (participantId) =>
        set((s) => {
          const p = s.participants.find((x) => x.id === participantId)
          if (!p) return s
          return {
            participants: s.participants.filter((x) => x.id !== participantId),
            evidence: s.evidence.filter((e) => !(e.assessmentId === p.sessionId && e.athleteId === p.athleteId)),
          }
        }),

      importHandIn: (h) => {
        const s = get()
        const session = s.assessments.find((a) => a.id === h.sessionId && a.origin === 'local')
        if (!session) return 'unknown-session'
        if (!protocolKnown(h.protocol)) return 'wrong-protocol'
        const inSession = s.participants.filter((p) => p.sessionId === session.id)
        // Same phone handing in again, or someone the coach had already added by name.
        const match = inSession.find((p) => p.id === h.participantId) ?? inSession.find((p) => p.via === 'coach' && Object.keys(p.results).length === 0 && p.name.trim().toLowerCase() === h.name.trim().toLowerCase())
        const merged = (existing: AssessmentParticipant | undefined) => {
          const results = { ...h.results }
          // Keep what the coach already observed or verified when the number has not changed.
          for (const [testId, r] of Object.entries(existing?.results ?? {})) {
            if (results[testId] && results[testId].value === r.value && !results[testId].skipped) results[testId] = r
            else if (!results[testId] && r.tier !== 'self') results[testId] = r
          }
          return results
        }
        const next: AssessmentParticipant = {
          id: h.participantId, sessionId: session.id, athleteId: match?.athleteId, name: h.name, joinedAt: match?.joinedAt ?? h.submittedAt, via: 'import',
          sharing: h.sharing, partner: h.partner, results: merged(match), skipped: h.skipped, flags: h.flags, submittedAt: h.submittedAt,
        }
        const participants = match ? s.participants.map((p) => (p.id === match.id ? next : p)) : [...s.participants, next]
        set({ participants, evidence: syncEvidence({ ...s, participants }, next.id) })
        return match ? 'updated' : 'added'
      },

      setStationTier: (participantId, station, tier) =>
        set((s) => {
          const ids = new Set([...stationById[station].tests, ...stationById[station].extra].map((t) => t.id))
          const participants = s.participants.map((p) =>
            p.id === participantId
              ? { ...p, results: Object.fromEntries(Object.entries(p.results).map(([k, r]) => [k, ids.has(k) && !r.skipped ? { ...r, tier } : r])) }
              : p,
          )
          return { participants, evidence: syncEvidence({ ...s, participants }, participantId) }
        }),

      patchAssessment: (sessionId, patch) => set((s) => ({ assessments: s.assessments.map((a) => (a.id === sessionId ? { ...a, ...patch } : a)) })),

      finaliseAssessment: (sessionId) => {
        const s = get()
        const session = s.assessments.find((a) => a.id === sessionId && a.origin === 'local')
        if (!session) return
        const now = new Date().toISOString()
        const athletes = { ...s.athletes }
        // Everyone who took part gets a place on this coach's roster. With accounts, only people
        // who have one can: someone added by name stays a name on the session.
        const participants = s.participants.map((p) => {
          if (s.cloudUid || p.sessionId !== sessionId || (p.athleteId && athletes[p.athleteId])) return p
          const athleteId = `a-${p.id}`
          athletes[athleteId] = { id: athleteId, name: p.name, handle: slug(p.name), bio: '', roles: ['athlete'], goals: [], joinedAt: p.joinedAt, weeklyTarget: 3, equipment: [] }
          return { ...p, athleteId }
        })
        const course = session.courseId ? s.courses.find((c) => c.id === session.courseId) : undefined
        const enrollments = [...s.enrollments]
        if (course) {
          for (const p of participants) {
            if (p.sessionId !== sessionId || !p.athleteId || p.athleteId === course.coachId) continue
            if (!enrollments.some((e) => e.courseId === course.id && e.athleteId === p.athleteId)) enrollments.push({ id: uid(), courseId: course.id, athleteId: p.athleteId, joinedAt: now, status: 'active' })
          }
        }
        const assessments = s.assessments.map((a) => (a.id === sessionId ? { ...a, status: 'finalised' as const, finalisedAt: now } : a))
        let evidence = s.evidence
        for (const p of participants) if (p.sessionId === sessionId) evidence = syncEvidence({ evidence, assessments, participants, meId: s.meId }, p.id)
        set({ athletes, participants, enrollments, assessments, evidence })
      },

      deleteAssessment: (sessionId) =>
        set((s) => ({
          assessments: s.assessments.filter((a) => a.id !== sessionId),
          participants: s.participants.filter((p) => p.sessionId !== sessionId),
          evidence: s.evidence.filter((e) => e.assessmentId !== sessionId),
        })),

      mergePlaces: (incoming) =>
        set((s) => {
          const places = mergePlaces(s.places, incoming)
          const ids = Object.keys(places)
          if (ids.length <= PLACE_CACHE) return { places }
          // Over the cap: drop the stalest places nobody on this device has a tie to.
          const tied = new Set<string>(s.visits.map((v) => v.placeId))
          for (const a of Object.values(s.athletes)) {
            if (a.homePlaceId) tied.add(a.homePlaceId)
            for (const f of a.favouritePlaces ?? []) tied.add(f)
          }
          const fresh = new Set(incoming.map((p) => p.id))
          const loose = ids
            .filter((id) => !tied.has(id) && !fresh.has(id) && places[id].source === 'osm' && !places[id].editedAt)
            .sort((a, b) => (places[a].fetchedAt ?? '').localeCompare(places[b].fetchedAt ?? ''))
          for (const id of loose.slice(0, ids.length - PLACE_CACHE)) delete places[id]
          return { places }
        }),

      addPlace: (input) => {
        const s = get()
        const id = `aura:${shortId()}`
        const now = new Date().toISOString()
        const place: Place = {
          ...input, id, name: input.name.trim() || 'Unnamed spot', note: input.note?.trim() || undefined, source: 'athlete',
          addedBy: s.meId ? s.athletes[s.meId]?.name : undefined, addedAt: now, access: input.kind === 'gym' || input.kind === 'studio' ? 'members' : 'free',
        }
        set({ places: { ...s.places, [id]: place } })
        return id
      },

      editPlace: (placeId, patch) =>
        set((s) => {
          const p = s.places[placeId]
          if (!p) return s
          const next = { ...p, ...patch, editedAt: new Date().toISOString() }
          if (patch.name !== undefined) next.name = patch.name.trim() || p.name
          return { places: { ...s.places, [placeId]: next } }
        }),

      confirmPlace: (placeId) =>
        set((s) => {
          const p = s.places[placeId]
          const live = s.meId ? liveVisit(s.visits, s.meId, Date.now()) : undefined
          if (!p || live?.placeId !== placeId) return s
          return { places: { ...s.places, [placeId]: { ...p, confirmedAt: new Date().toISOString() } } }
        }),

      removePlace: (placeId) =>
        set((s) => {
          if (s.places[placeId]?.source !== 'athlete') return s
          const { [placeId]: _gone, ...places } = s.places
          const athletes = Object.fromEntries(
            Object.entries(s.athletes).map(([id, a]) => [
              id,
              a.homePlaceId === placeId || a.favouritePlaces?.includes(placeId)
                ? { ...a, homePlaceId: a.homePlaceId === placeId ? undefined : a.homePlaceId, favouritePlaces: a.favouritePlaces?.filter((f) => f !== placeId) }
                : a,
            ]),
          )
          return { places, athletes, visits: s.visits.filter((v) => v.placeId !== placeId) }
        }),

      toggleFavourite: (placeId) =>
        set((s) => {
          if (!s.meId) return s
          const me = s.athletes[s.meId]
          const list = me.favouritePlaces ?? []
          const favouritePlaces = list.includes(placeId) ? list.filter((f) => f !== placeId) : [...list, placeId]
          return { athletes: { ...s.athletes, [me.id]: { ...me, favouritePlaces } } }
        }),

      setHomePlace: (placeId) =>
        set((s) => {
          if (!s.meId) return s
          const me = s.athletes[s.meId]
          // The home spot is its own thing; it does not also sit among the favourites.
          const favouritePlaces = (me.favouritePlaces ?? []).filter((f) => f !== placeId)
          return { athletes: { ...s.athletes, [me.id]: { ...me, homePlaceId: placeId ?? undefined, favouritePlaces } } }
        }),

      setPrivacy: (patch) =>
        set((s) => {
          if (!s.meId) return s
          const me = s.athletes[s.meId]
          return { athletes: { ...s.athletes, [me.id]: { ...me, privacy: { ...privacyOf(me), ...patch } } } }
        }),

      checkIn: (placeId, { minutes, audience, onSite }) =>
        set((s) => {
          if (!s.meId || !s.places[placeId]) return s
          const now = Date.now()
          const length = Math.max(15, Math.min(PRESENCE.maxMinutes, minutes))
          const stamp = new Date(now).toISOString()
          const visits = s.visits.map((v) => (v.athleteId === s.meId && isLive(v, now) ? { ...v, endsAt: stamp } : v))
          visits.push({ id: uid(), athleteId: s.meId, placeId, startedAt: stamp, endsAt: new Date(now + length * 60000).toISOString(), audience, onSite })
          return { visits, settings: { ...s.settings, audience, stayMinutes: length } }
        }),

      checkOut: () =>
        set((s) => {
          const now = Date.now()
          const stamp = new Date(now).toISOString()
          return { visits: s.visits.map((v) => (v.athleteId === s.meId && isLive(v, now) ? { ...v, endsAt: stamp } : v)) }
        }),

      extendStay: (minutes) =>
        set((s) => {
          const now = Date.now()
          return {
            visits: s.visits.map((v) => {
              if (v.athleteId !== s.meId || !isLive(v, now)) return v
              const cap = new Date(v.startedAt).getTime() + PRESENCE.maxMinutes * 60000
              return { ...v, endsAt: new Date(Math.min(cap, new Date(v.endsAt).getTime() + minutes * 60000)).toISOString() }
            }),
          }
        }),

      removeVisit: (visitId) => set((s) => ({ visits: s.visits.filter((v) => !(v.id === visitId && v.athleteId === s.meId)) })),

      clearMyVisits: () => set((s) => ({ visits: s.visits.filter((v) => v.athleteId !== s.meId) })),

      setMapView: (mapView) => set({ mapView }),
    }),
    {
      name: 'aura:v1',
      version: 4,
      migrate: migrateStored,
      partialize: ({ celebrations: _c, ...rest }) =>
        Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== 'function')) as unknown as State,
    },
  ),
)
