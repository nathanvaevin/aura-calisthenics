import type { Progression, ProgressionStep } from '../types'

/** Shorthand: each entry is an exercise id, or [primary, ...alternates] at the same level. */
const steps = (...ids: (string | string[])[]): ProgressionStep[] =>
  ids.map((entry, i) => {
    const [exerciseId, ...alternates] = Array.isArray(entry) ? entry : [entry]
    return alternates.length ? { level: i + 1, exerciseId, alternates } : { level: i + 1, exerciseId }
  })

/**
 * System A — exercise difficulty.
 *
 * Levels are positions inside one movement family and mean nothing across
 * families: level 4 of the dip ladder is not comparable to level 4 of the
 * handstand ladder. The ordering reflects common coaching practice and is open
 * to revision; it is not a measured difficulty scale.
 */
export const PROGRESSIONS: Progression[] = [
  {
    id: 'handstand-line', name: 'Handstand', discipline: 'handstand',
    objective: 'Inverted balance and a stacked overhead line.',
    steps: steps('pike-hold', 'wall-walk', 'back-to-wall-hs', 'chest-to-wall-hs', ['wall-shoulder-taps', 'heel-pulls'], 'freestanding-hs', 'straddle-hs', ['tuck-hs', 'hs-shoulder-taps'], 'press-hs', 'one-arm-hs'),
  },
  {
    id: 'arm-balance', name: 'Arm Balance', discipline: 'handstand',
    objective: 'Balance on the hands close to the floor.',
    steps: steps('headstand', 'crow-pose', 'elbow-lever'),
  },
  {
    id: 'pullup', name: 'Pull-up', discipline: 'pull',
    objective: 'Vertical pulling strength.',
    steps: steps('dead-hang', 'scap-pull', 'band-pullup', 'negative-pullup', ['pull-up', 'chin-up'], 'chest-to-bar', 'archer-pullup', 'assisted-oap', 'one-arm-pullup'),
  },
  {
    id: 'row', name: 'Row', discipline: 'pull',
    objective: 'Horizontal pulling strength and scapular control.',
    steps: steps('incline-row', 'horizontal-row', 'feet-elevated-row', 'archer-row'),
  },
  {
    id: 'muscle-up', name: 'Muscle-up', discipline: 'pull',
    objective: 'Pulling height and the transition over the bar.',
    steps: steps('pull-up', 'chest-to-bar', 'explosive-pullup', 'muscle-up'),
  },
  {
    id: 'front-lever', name: 'Front Lever', discipline: 'pull',
    objective: 'Straight-arm pulling strength.',
    steps: steps('tuck-fl', 'adv-tuck-fl', 'straddle-fl', 'front-lever'),
  },
  {
    id: 'back-lever', name: 'Back Lever', discipline: 'pull',
    objective: 'Shoulder extension strength with straight arms.',
    steps: steps('skin-the-cat', 'tuck-back-lever', 'back-lever'),
  },
  {
    id: 'pushup', name: 'Push-up', discipline: 'push',
    objective: 'Horizontal pressing strength.',
    steps: steps('wall-pushup', 'incline-pushup', 'low-incline-pushup', 'knee-pushup', 'pushup', ['decline-pushup', 'diamond-pushup'], ['archer-pushup', 'pseudo-planche-pushup'], 'assisted-oa-pushup', 'one-arm-pushup'),
  },
  {
    id: 'dip', name: 'Dip', discipline: 'push',
    objective: 'Pressing through deep shoulder extension.',
    steps: steps('bench-dip', 'negative-dip', 'dip', 'ring-dip'),
  },
  {
    id: 'overhead-press', name: 'Handstand Push-up', discipline: 'push',
    objective: 'Vertical pressing strength.',
    steps: steps('pike-pushup', 'elevated-pike-pushup', 'wall-hspu-negative', 'wall-hspu', 'freestanding-hspu'),
  },
  {
    id: 'planche', name: 'Planche', discipline: 'push',
    objective: 'Straight-arm pressing strength.',
    steps: steps('planche-lean', 'tuck-planche', 'adv-tuck-planche', 'straddle-planche', 'full-planche'),
  },
  {
    id: 'anti-extension', name: 'Hollow Line', discipline: 'core',
    objective: 'Holding the trunk rigid against extension.',
    steps: steps('dead-bug', 'plank', 'hollow-hold', 'hollow-rock', 'ab-wheel-knee', 'dragon-flag-negative', 'dragon-flag', 'ab-wheel-standing'),
  },
  {
    id: 'hanging-raise', name: 'Hanging Raise', discipline: 'core',
    objective: 'Hip flexion and pelvic control from a hang.',
    steps: steps('hanging-knee-raise', 'hanging-leg-raise', 'toes-to-bar', 'windshield-wipers'),
  },
  {
    id: 'l-sit', name: 'L-sit', discipline: 'core',
    objective: 'Compression strength in support.',
    steps: steps('tuck-l-sit', 'l-sit', 'v-sit', 'manna'),
  },
  {
    id: 'single-leg-squat', name: 'Single-Leg Squat', discipline: 'legs',
    objective: 'Knee-dominant leg strength.',
    steps: steps('box-squat', 'squat', 'split-squat', 'bulgarian-split-squat', 'assisted-pistol', 'box-pistol', ['pistol-squat', 'shrimp-squat'], 'adv-shrimp-squat'),
  },
  {
    id: 'hamstring', name: 'Hamstring Curl', discipline: 'legs',
    objective: 'Posterior-chain strength.',
    steps: steps('glute-bridge', 'single-leg-bridge', 'nordic-negative', 'nordic-curl'),
  },
  {
    id: 'pike-fold', name: 'Pike Fold', discipline: 'mobility',
    objective: 'Hamstring length for compression and presses.',
    steps: steps('toe-touch', 'palms-floor-fold', 'seated-pike'),
  },
  {
    id: 'straddle', name: 'Straddle', discipline: 'mobility',
    objective: 'Hip opening for straddle shapes.',
    steps: steps('deep-squat-hold', 'pancake-elbows', 'pancake', 'middle-split'),
  },
  {
    id: 'front-split', name: 'Front Split', discipline: 'mobility',
    objective: 'Hip flexor and hamstring length.',
    steps: steps('deep-lunge', 'front-split'),
  },
  {
    id: 'bridge', name: 'Bridge', discipline: 'mobility',
    objective: 'Shoulder and spinal extension.',
    steps: steps('reverse-plank', 'bridge', 'straight-bridge'),
  },
]
