import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Athlete, Course, Enrollment, Evidence, EvidenceTier, Feedback, LogEntry, WorkoutBlock, WorkoutLog, WorkoutSource,
} from '@/domain/types'
import { exerciseById, skillById, stepAt } from '@/domain/catalog'
import { bestEvidence } from '@/domain/scoring/mastery'
import { adaptTarget, skillStatuses } from '@/domain/scoring/skills'
import { startOfWeek } from '@/domain/scoring/aura'
import { courseFromTemplate, uid } from './courseTemplates'
import { ME, buildWorld, isoDay } from './seed'

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
  theme: 'dark' | 'light'
  sound: boolean
  coachMode: boolean
}

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
  following: string[]
  active: ActiveWorkout | null
  settings: Settings
  celebrations: Celebration[]

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
  following: [] as string[],
  active: null as ActiveWorkout | null,
  celebrations: [] as Celebration[],
}

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

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...empty,
      settings: { theme: 'dark', sound: true, coachMode: true },

      startDemo: () => {
        const world = buildWorld(new Date(), true)
        set({ ...empty, ...world, meId: ME, settings: { ...get().settings, coachMode: true } })
      },

      completeOnboarding: (r) => {
        const now = new Date()
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

      setSettings: (patch) => {
        set((s) => ({ settings: { ...s.settings, ...patch } }))
        if (patch.theme) document.documentElement.dataset.theme = patch.theme
      },

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
        })
      },

      removeEvidence: (id) => set((s) => ({ evidence: s.evidence.filter((e) => e.id !== id) })),
      dismissCelebration: (id) => set((s) => ({ celebrations: s.celebrations.filter((c) => c.id !== id) })),

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
    }),
    {
      name: 'aura:v1',
      version: 1,
      partialize: ({ celebrations: _c, ...rest }) =>
        Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== 'function')) as unknown as State,
    },
  ),
)
