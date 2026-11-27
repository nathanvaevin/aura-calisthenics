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
/** How a coach counts a part of a session: an exercise's units, or `done`: no count, no time, it is simply completed. */
export type Unit = Metric | 'done'

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
 *   observed  – a coach was present and watched it, without checking it against the standard
 *   coach     – formally verified by a coach against the written standard
 *   video     – formally verified from submitted video
 */
export type EvidenceTier = 'estimated' | 'self' | 'observed' | 'coach' | 'video'

export interface Evidence {
  id: string
  athleteId: string
  exerciseId: string
  /** Reps or seconds. */
  value: number
  tier: EvidenceTier
  source: 'onboarding' | 'workout' | 'manual' | 'assessment'
  date: string
  logId?: string
  /** The assessment session this came from, when source is 'assessment'. */
  assessmentId?: string
  /** Coach who watched it (tier observed). */
  observedBy?: string
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
  /** Reps or seconds, for the assigned exercise (or in `metric`, when the coach chose the other). */
  target: number
  rest: number
  note?: string
  /** The coach's own name for this part of the session ("Wrist preparation + warm up"). The exercise stays what is shown and performed. */
  title?: string
  /**
   * The coach's choice of unit, set only when it differs from the exercise's own
   * (seconds of a movement counted in reps, say), or `done`: no count, just
   * completed. Work done in another unit is never a record: it does not count
   * towards a rating.
   */
  metric?: Unit
  /** Part of the week's primary focus, as opposed to support work. Set by the coach. */
  primary?: boolean
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
  /** As on the block it came from. */
  title?: string
  metric?: Unit
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
  /** Where it was done, when the athlete was checked in at a place. */
  placeId?: string
  entries: LogEntry[]
}

export interface CourseSession {
  id: string
  /** 0 = Monday … 6 = Sunday. */
  day: number
  title: string
  blocks: WorkoutBlock[]
}

/**
 * training: sessions to follow · baseline / retest: the week the group is
 * assessed, at the start and at the end. An assessment week may still hold
 * sessions; its main event is the assessment itself.
 */
export type WeekKind = 'training' | 'baseline' | 'retest'

export interface CourseWeek {
  id: string
  title: string
  objective: string
  /** Unset means a training week (courses made before weeks had kinds). */
  kind?: WeekKind
  /** The capability most of the week's work builds. Exercises from other disciplines are its support. */
  focus?: DisciplineId | 'full'
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

  // Identity beyond ability. All optional; who sees each part is set in `privacy`.
  /** Where they are originally from. Free text, as coarse as they like. */
  from?: string
  environments?: TrainingEnvironment[]
  /** The one place they call their own. */
  homePlaceId?: string
  favouritePlaces?: string[]
  /** Happy to be approached to train together. Shown wherever their presence is. */
  openToTrain?: boolean
  /** The country they live in now. Shares the audience of the city. */
  country?: string
  /** The disciplines they care about most. A statement of taste, never an input to a rating. */
  interests?: DisciplineId[]
  /** Whether other athletes can find this profile at all. Unset means yes. */
  discoverable?: boolean
  /** Parts left out take their default (DEFAULT_PRIVACY in places.ts). */
  privacy?: Partial<AthletePrivacy>
  /** Theme, character and Aura form: presentation only (src/theme/personal.ts). */
  style?: import('@/theme/personal').Personal
}

// ── Identity, places and presence ────────────────────────────────────────

/**
 * Who may see something. `following` means the athletes this person follows:
 * a list they control, unlike their followers.
 */
export type Audience = 'me' | 'following' | 'everyone'

export type TrainingEnvironment = 'outdoor' | 'gym' | 'studio' | 'home'

export interface AthletePrivacy {
  /** Where they are from. */
  origin: Audience
  /** The city they are based in. */
  base: Audience
  /** Home spot, favourite places and preferred environments: things they declared. */
  places: Audience
  /** Recent visits and "regular" status: things derived from where they actually went. */
  visits: Audience
  /** The character and theme they chose. */
  style: Audience
  /** Aura and discipline ratings. A coach of theirs always sees these. */
  ratings: Audience
  /** The disciplines they named as favourites. */
  interests: Audience
}

export type PlaceKind = 'calisthenics' | 'outdoor' | 'gym' | 'studio' | 'other'

export type PlaceEquipment =
  | 'bar' | 'low_bar' | 'dip_bars' | 'rings' | 'monkey_bars' | 'stall_bars' | 'parallettes' | 'box' | 'wall'

export type PlaceAmenity = 'water' | 'lit' | 'covered' | 'toilets' | 'soft_ground' | 'showers' | 'accessible'

export interface Place {
  id: string
  name: string
  kind: PlaceKind
  lat: number
  lon: number
  /** Street, park or neighbourhood, when known. */
  address?: string
  equipment: PlaceEquipment[]
  amenities: PlaceAmenity[]
  access?: 'free' | 'members'
  hours?: string
  note?: string
  /** osm: mapped by OpenStreetMap contributors · athlete: added in Aura by a person */
  source: 'osm' | 'athlete'
  /** OpenStreetMap element behind the record, as "node/123". */
  osm?: string
  /** Mapped elements merged into this one place (a circuit of stations is one place). */
  parts?: number
  fetchedAt?: string
  /** Name of whoever added it, for athlete-added places. */
  addedBy?: string
  addedAt?: string
  /** Details were corrected on this device; a refresh from the source will not overwrite them. */
  editedAt?: string
  /** Last time this device's athlete confirmed the details while checked in on site. */
  confirmedAt?: string
}

/**
 * One stay at a place. It is "now" only between `startedAt` and `endsAt`;
 * after that it is history. Coordinates of the athlete are never stored.
 */
export interface Visit {
  id: string
  athleteId: string
  placeId: string
  startedAt: string
  endsAt: string
  /** Who could see this stay, live and afterwards. History is further limited by `privacy.visits`. */
  audience: Audience
  /** The device confirmed, once, that it was at the place. Otherwise the stay is the athlete's word. */
  onSite: boolean
  sample?: boolean
}

// ── Assessments ──────────────────────────────────────────────────────────

/** How a single assessment result is known. Mirrors the evidence tiers it can become. */
export type ResultTier = 'self' | 'observed' | 'coach'

export interface AssessmentResult {
  /** Reps, seconds, or the chosen option index. Zero means attempted, not yet. */
  value: number
  tier: ResultTier
  at: string
  /** Could not be tested today (no equipment, injury). Not an attempt. */
  skipped?: boolean
}

/**
 * One assessment event: a coach's group session, or an athlete testing alone.
 * `origin` says where this copy came from, which decides what the device can do with it.
 */
export interface AssessmentSession {
  id: string
  protocol: string
  title: string
  kind: 'baseline' | 'retest'
  groupName: string
  /** Local athlete id of the coach when the coach is on this device. */
  coachId: string | null
  coachName: string
  courseId?: string
  /** Earlier session this one is compared against. */
  baselineId?: string
  stations: DisciplineId[]
  status: 'open' | 'finalised'
  /** local: created on this device · invite: joined from a coach's link · solo: self-directed */
  origin: 'local' | 'invite' | 'solo'
  createdAt: string
  finalisedAt?: string
  /** Minutes per station for the rotation timer. */
  stationMinutes: number
  rotationStartedAt?: string
  /** What the invitation link carries when the session lives in the database. */
  inviteToken?: string
  /** Seeded demonstration data. */
  sample?: boolean
  /**
   * guided: each station walks the athlete through its benchmarks in order,
   * adapting to each result · stations: the athlete opens any station and
   * chooses the variations that match their level. Unset means guided.
   */
  mode?: 'guided' | 'stations'
  /** How many groups the coach splits the class into for rotating between stations. */
  groups?: number
}

export interface AssessmentParticipant {
  id: string
  sessionId: string
  /** Local athlete this participant is, when known on this device. */
  athleteId?: string
  name: string
  joinedAt: string
  /** self: on their own phone here · coach: added by the coach · import: handed in by link · sample: demo data */
  via: 'self' | 'coach' | 'import' | 'sample'
  /** Who may see this participant's individual profile. The coach always can. */
  sharing: 'coach' | 'group'
  /** Name of the partner who counted and timed. */
  partner?: string
  results: Record<string, AssessmentResult>
  skipped: DisciplineId[]
  /** Stations where the participant asked for the coach. */
  flags: DisciplineId[]
  submittedAt?: string
  /** Rotation group (0-based), when the coach placed them. Otherwise assigned by joining order. */
  group?: number
}
