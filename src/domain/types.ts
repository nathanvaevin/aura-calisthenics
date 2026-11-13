/**
 * Core domain types.
 *
 * Four systems, kept deliberately separate:
 *   A. Exercise difficulty  -> Progression / ProgressionStep (levels 1..n, relative to one family)
 *   B. Athletic mastery     -> Evidence + rating curves -> discipline ratings
 *   C. Aura                 -> derived from discipline ratings (never from activity)
 *   D. Skill tree           -> Skill nodes: a threshold on a measurable exercise, with prerequisites
 *
 * Raw performance (Evidence, WorkoutLog) is stored; every score is computed from it.
 */

export type DisciplineId = 'handstand' | 'pull' | 'push' | 'core' | 'legs' | 'mobility'

export interface Discipline {
  id: DisciplineId
  name: string
  short: string
  blurb: string
  archetype: string
}

export type Metric = 'reps' | 'hold'

export type MuscleId =
  | 'delts' | 'rear_delts' | 'chest' | 'triceps' | 'biceps' | 'forearms'
  | 'lats' | 'traps' | 'mid_back' | 'lower_back'
  | 'abs' | 'obliques' | 'serratus' | 'hip_flexors'
  | 'glutes' | 'quads' | 'hamstrings' | 'adductors' | 'calves'

export type EquipmentId =
  | 'floor' | 'wall' | 'bar' | 'low_bar' | 'dip_bars' | 'rings'
  | 'parallettes' | 'box' | 'band' | 'anchor' | 'wheel'

export type Category =
  | 'Preparation' | 'Balance' | 'Horizontal push' | 'Vertical push' | 'Dip'
  | 'Straight-arm push' | 'Vertical pull' | 'Horizontal pull' | 'Straight-arm pull'
  | 'Explosive pull' | 'Anti-extension' | 'Compression' | 'Hanging core'
  | 'Squat' | 'Single-leg' | 'Posterior chain' | 'Flexibility'

/** [performance value (reps or seconds), rating]. Ascending in both. */
export type CurvePoint = readonly [number, number]

export interface Dose {
  sets: number
  /** Recommended working range, in reps or seconds depending on the exercise metric. */
  range: readonly [number, number]
  rest: number
}

export interface Exercise {
  id: string
  name: string
  /** Compact name for map labels (<= 14 characters). */
  short: string
  discipline: DisciplineId
  category: Category
  metric: Metric
  perSide: boolean
  equipment: EquipmentId[]
  primary: MuscleId[]
  secondary: MuscleId[]
  stabilizers: MuscleId[]
  summary: string
  cues: string[]
  mistakes: string[]
  safety?: string
  /** What a rep or hold must look like to count as evidence. */
  standard?: string
  dose: Dose
  /**
   * Provisional calibration mapping measured performance to rating points.
   * Exercises without a curve are training tools only and never move a rating.
   */
  curve?: CurvePoint[]
}

/** System A. Levels are relative to this progression only. */
export interface ProgressionStep {
  level: number
  exerciseId: string
  /** Other valid variations at the same difficulty. */
  alternates?: string[]
}

export interface Progression {
  id: string
  name: string
  discipline: DisciplineId
  objective: string
  steps: ProgressionStep[]
}

/** System D. A concrete milestone: reach `threshold` on `exerciseId`. */
export interface SkillDef {
  id: string
  exerciseId: string
  threshold: number
  requires: string[]
  /** Horizontal lane in the discipline constellation. */
  lane: number
  name?: string
}

export type BandId = 'foundation' | 'beginner' | 'intermediate' | 'advanced' | 'elite' | 'world'

export interface Skill extends SkillDef {
  name: string
  discipline: DisciplineId
  /** Rating value of this milestone, read from the exercise curve at the threshold. */
  rating: number
  band: BandId
  label: readonly [string, string]
}

/**
 * How we know. Order matters: later tiers outrank earlier ones.
 *   estimated – inferred from onboarding answers, never shown as mastery
 *   self      – logged by the athlete
 *   coach     – confirmed by a coach who saw it
 *   video     – confirmed from submitted video
 */
export type EvidenceTier = 'estimated' | 'self' | 'coach' | 'video'

export interface Evidence {
  id: string
  athleteId: string
  exerciseId: string
  /** Reps or seconds. */
  value: number
  tier: EvidenceTier
  source: 'onboarding' | 'workout' | 'manual'
  date: string
  logId?: string
  verifiedBy?: string
  verifiedAt?: string
  note?: string
}

export type BlockKind = 'warmup' | 'skill' | 'strength' | 'mobility' | 'cooldown'

/** One assigned exercise inside a session. */
export interface WorkoutBlock {
  id: string
  kind: BlockKind
  exerciseId: string
  /** When set, the athlete may move along this progression. */
  progressionId?: string
  level?: number
  minLevel?: number
  maxLevel?: number
  sets: number
  /** Reps or seconds, for the assigned exercise. */
  target: number
  rest: number
  note?: string
}

export interface Workout {
  id: string
  title: string
  focus: DisciplineId | 'full'
  summary: string
  minutes: number
  blocks: WorkoutBlock[]
}

export interface SetLog {
  value: number
  done: boolean
  /** Variation actually performed for this set. */
  exerciseId: string
  level?: number
}

export interface LogEntry {
  blockId: string
  kind: BlockKind
  progressionId?: string
  assignedExerciseId: string
  assignedLevel?: number
  assignedTarget: number
  /** Variation currently selected by the athlete. */
  exerciseId: string
  level?: number
  target: number
  rest: number
  minLevel?: number
  maxLevel?: number
  note?: string
  sets: SetLog[]
}

export type WorkoutSource =
  | { type: 'course'; courseId: string; sessionId: string }
  | { type: 'library'; workoutId: string }
  | { type: 'goal'; skillId: string }

export interface WorkoutLog {
  id: string
  athleteId: string
  title: string
  source: WorkoutSource
  startedAt: string
  finishedAt?: string
  rpe?: number
  note?: string
  entries: LogEntry[]
}

export interface CourseSession {
  id: string
  /** 0 = Monday … 6 = Sunday. */
  day: number
  title: string
  blocks: WorkoutBlock[]
}

export interface CourseWeek {
  id: string
  title: string
  objective: string
  sessions: CourseSession[]
}

export interface Course {
  id: string
  coachId: string
  title: string
  tagline: string
  description: string
  focus: DisciplineId | 'full'
  format: 'group' | 'individual' | 'online'
  status: 'draft' | 'active' | 'archived'
  /** ISO date of the Monday of week 1. */
  startDate: string
  /** Skills this course works toward. */
  milestones: string[]
  weeks: CourseWeek[]
}

export interface Enrollment {
  id: string
  courseId: string
  athleteId: string
  joinedAt: string
  status: 'active' | 'paused' | 'completed'
}

export interface Feedback {
  id: string
  logId: string
  coachId: string
  athleteId: string
  text: string
  date: string
}

export type Role = 'athlete' | 'coach' | 'admin'

export interface Athlete {
  id: string
  name: string
  handle: string
  bio: string
  city?: string
  roles: Role[]
  /** Skill ids. */
  goals: string[]
  joinedAt: string
  /** Sessions per week the athlete intends to train. */
  weeklyTarget: number
  equipment: EquipmentId[]
}
