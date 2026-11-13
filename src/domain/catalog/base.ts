import type { Discipline, DisciplineId, Dose, EquipmentId, Exercise, MuscleId } from '../types'

export const DISCIPLINES: Discipline[] = [
  {
    id: 'handstand',
    name: 'Handstand & Balance',
    short: 'Handstand',
    blurb: 'Inverted balance, line and control on the hands.',
    archetype: 'Balancer',
  },
  {
    id: 'pull',
    name: 'Pulling Strength',
    short: 'Pulling',
    blurb: 'Bent-arm and straight-arm pulling on bars and rings.',
    archetype: 'Climber',
  },
  {
    id: 'push',
    name: 'Pushing Strength',
    short: 'Pushing',
    blurb: 'Horizontal, vertical and straight-arm pressing.',
    archetype: 'Presser',
  },
  {
    id: 'core',
    name: 'Core Strength',
    short: 'Core',
    blurb: 'Trunk tension, compression and anti-extension.',
    archetype: 'Anchor',
  },
  {
    id: 'legs',
    name: 'Leg Strength',
    short: 'Legs',
    blurb: 'Single-leg strength and posterior chain.',
    archetype: 'Spring',
  },
  {
    id: 'mobility',
    name: 'Mobility',
    short: 'Mobility',
    blurb: 'Usable range in hips, shoulders and spine.',
    archetype: 'Flow',
  },
]

export const DISCIPLINE_IDS = DISCIPLINES.map((d) => d.id)

export const disciplineById = Object.fromEntries(DISCIPLINES.map((d) => [d.id, d])) as Record<
  DisciplineId,
  Discipline
>

export const MUSCLES: Record<MuscleId, { name: string; group: string }> = {
  delts: { name: 'Shoulders', group: 'Shoulders' },
  rear_delts: { name: 'Rear shoulders', group: 'Shoulders' },
  chest: { name: 'Chest', group: 'Chest' },
  triceps: { name: 'Triceps', group: 'Arms' },
  biceps: { name: 'Biceps', group: 'Arms' },
  forearms: { name: 'Forearms & grip', group: 'Arms' },
  lats: { name: 'Lats', group: 'Back' },
  traps: { name: 'Traps', group: 'Back' },
  mid_back: { name: 'Mid back', group: 'Back' },
  lower_back: { name: 'Lower back', group: 'Back' },
  abs: { name: 'Abdominals', group: 'Core' },
  obliques: { name: 'Obliques', group: 'Core' },
  serratus: { name: 'Serratus', group: 'Core' },
  hip_flexors: { name: 'Hip flexors', group: 'Hips' },
  glutes: { name: 'Glutes', group: 'Hips' },
  quads: { name: 'Quadriceps', group: 'Legs' },
  hamstrings: { name: 'Hamstrings', group: 'Legs' },
  adductors: { name: 'Adductors', group: 'Legs' },
  calves: { name: 'Calves', group: 'Legs' },
}

export const EQUIPMENT: Record<EquipmentId, string> = {
  floor: 'Floor only',
  wall: 'Wall',
  bar: 'Pull-up bar',
  low_bar: 'Low bar',
  dip_bars: 'Dip bars',
  rings: 'Rings',
  parallettes: 'Parallettes',
  box: 'Box or bench',
  band: 'Resistance band',
  anchor: 'Foot anchor',
  wheel: 'Ab wheel',
}

type ExerciseDef = Omit<Exercise, 'discipline' | 'secondary' | 'stabilizers' | 'perSide'> &
  Partial<Pick<Exercise, 'secondary' | 'stabilizers' | 'perSide'>>

export const define = (discipline: DisciplineId, defs: ExerciseDef[]): Exercise[] =>
  defs.map((d) => ({ secondary: [], stabilizers: [], perSide: false, ...d, discipline }))

/** Recommended dose: sets × (min–max), rest in seconds. */
export const dose = (sets: number, min: number, max: number, rest: number): Dose => ({
  sets,
  range: [min, max],
  rest,
})

export type { MuscleId }
