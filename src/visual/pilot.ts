/**
 * The ten exercises of the animation pilot, as plain ids: one of each kind
 * of demand a movement can make on the system. Kept apart from the movements
 * themselves so that screens which only need the list do not load the 3D
 * engine.
 */
export const PILOT_EXERCISES = [
  'pushup', 'pull-up', 'squat', 'plank', 'pike-pushup', 'hollow-hold', 'split-squat', 'dead-hang', 'freestanding-hs', 'cat-cow',
] as const

const LOW = new Set(['pushup', 'plank', 'hollow-hold', 'cat-cow', 'pike-pushup'])
/** Width over height of the stage that suits an exercise: wide for work on the floor, tall for standing and hanging. */
export const stageRatio = (exerciseId: string) => (LOW.has(exerciseId) ? 1.5 : exerciseId === 'split-squat' || exerciseId === 'squat' ? 1.05 : 0.82)

/** What each pilot exercise is there to test. */
export const PILOT_PURPOSE: Record<(typeof PILOT_EXERCISES)[number], string> = {
  pushup: 'Hands and feet planted while the whole body moves',
  'pull-up': 'Hanging from a bar: grip, shoulders overhead, the body travelling',
  squat: 'Deep hip and knee flexion with the feet fixed',
  plank: 'A static hold on the forearms',
  'pike-pushup': 'An inverted press with the head travelling to the floor',
  'hollow-hold': 'Lying on the back, a curved trunk',
  'split-squat': 'One side different from the other',
  'dead-hang': 'A relaxed hang with the arms fully overhead',
  'freestanding-hs': 'Balance: fully inverted, never quite still',
  'cat-cow': 'Mobility: the spine itself moving',
}
