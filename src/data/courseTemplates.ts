import type { BlockKind, Course, CourseSession, CourseWeek, DisciplineId, WeekKind, WorkoutBlock } from '@/domain/types'
import { exerciseById, levelOf, placementsOf } from '@/domain/catalog'
import { withHandstandWarmup } from '@/domain/training'

export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

/** [kind, exerciseId, sets, target, options] */
type Row = [BlockKind, string, number, number, { p?: string; span?: number; note?: string; rest?: number }?]

const block = ([kind, exerciseId, sets, target, opt]: Row): WorkoutBlock => {
  const ex = exerciseById[exerciseId]
  if (!ex) throw new Error(`Unknown exercise ${exerciseId}`)
  const progressionId = opt?.p ?? placementsOf(exerciseId)[0]?.progression.id
  const level = progressionId ? levelOf(progressionId, exerciseId) : undefined
  const span = opt?.span ?? 2
  // A note may open with its role in the week: "Primary: …" or "Support: …".
  const role = opt?.note?.match(/^(Primary|Support):\s*/)
  return {
    id: uid(),
    kind,
    exerciseId,
    ...(role?.[1] === 'Primary' ? { primary: true } : {}),
    progressionId: kind === 'warmup' && !opt?.p ? undefined : progressionId,
    level: kind === 'warmup' && !opt?.p ? undefined : level,
    minLevel: level && !(kind === 'warmup' && !opt?.p) ? Math.max(1, level - span) : undefined,
    maxLevel: level && !(kind === 'warmup' && !opt?.p) ? level + span : undefined,
    sets,
    target,
    rest: opt?.rest ?? (kind === 'warmup' ? 20 : ex.dose.rest),
    note: role ? opt!.note!.slice(role[0].length) || undefined : opt?.note,
  }
}

const session = (day: number, title: string, rows: Row[]): CourseSession => ({
  id: uid(),
  day,
  title,
  // A session with handstand work opens with the body and the wrists.
  blocks: withHandstandWarmup(rows.map(block), uid()),
})

const week = (title: string, objective: string, sessions: CourseSession[], opts: { kind?: WeekKind; focus?: DisciplineId | 'full' } = {}): CourseWeek => ({
  id: uid(),
  title,
  objective,
  ...(opts.kind && opts.kind !== 'training' ? { kind: opts.kind } : {}),
  ...(opts.focus ? { focus: opts.focus } : {}),
  sessions,
})

const HS = { p: 'handstand-line' }

function handstandFoundations(): CourseWeek[] {
  return [
    week('Wrists, shoulders and shapes', 'Build the positions: loaded wrists, open shoulders and a hollow body.', [
      session(0, 'Foundations A', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'pike-hold', 3, 30, HS],
        ['skill', 'wall-walk', 3, 2, { ...HS, note: 'Walk out the same way you came in.' }],
        ['strength', 'pike-pushup', 3, 6],
        ['strength', 'hollow-hold', 3, 20],
      ]),
      session(2, 'Line and core', [
        ['warmup', 'wrist-prep', 2, 10],
        ['warmup', 'overhead-wall-reach', 2, 20],
        ['skill', 'wall-walk', 3, 3, HS],
        ['skill', 'back-to-wall-hs', 4, 20, HS],
        ['skill', 'crow-pose', 4, 10],
        ['strength', 'hollow-hold', 3, 25],
      ]),
      session(4, 'Foundations B', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'pike-hold', 3, 40, HS],
        ['skill', 'back-to-wall-hs', 4, 25, HS],
        ['strength', 'pike-pushup', 3, 8],
        ['strength', 'plank', 3, 40],
      ]),
    ]),
    week('Time upside down', 'Accumulate wall time and find a straight line.', [
      session(0, 'Chest to wall', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 4, 20, { ...HS, note: 'Only the toes touch. Ribs down, glutes on.' }],
        ['skill', 'back-to-wall-hs', 3, 30, HS],
        ['strength', 'pike-pushup', 3, 8],
        ['strength', 'hollow-hold', 3, 30],
      ]),
      session(2, 'Balance on the hands', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 4, 25, HS],
        ['skill', 'crow-pose', 4, 15],
        ['skill', 'wall-walk', 3, 3, HS],
        ['strength', 'hollow-rock', 3, 10],
      ]),
      session(4, 'Longer holds', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 5, 30, HS],
        ['skill', 'heel-pulls', 4, 4, { ...HS, note: 'Fingertips do the work. Float, do not push.' }],
        ['strength', 'pike-pushup', 3, 10],
        ['strength', 'hollow-hold', 3, 30],
      ]),
    ]),
    week('Finding balance', 'Leave the wall for the first controlled seconds of balance.', [
      session(0, 'Balance practice', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 4, 30, { ...HS, note: 'Wall handstand holds. Same line every set.' }],
        ['skill', 'freestanding-hs', 6, 5, { ...HS, note: 'Freestanding balance practice. Count clean seconds only.' }],
        ['strength', 'pike-pushup', 3, 8],
        ['strength', 'hollow-hold', 3, 30, { note: 'Core stability. Lower back stays down.' }],
      ]),
      session(2, 'Weight shifts', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'wall-shoulder-taps', 4, 8, HS],
        ['skill', 'freestanding-hs', 6, 5, HS],
        ['skill', 'crow-pose', 3, 20],
        ['strength', 'hollow-rock', 3, 15],
      ]),
      session(4, 'Volume day', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 3, 45, HS],
        ['skill', 'freestanding-hs', 8, 5, HS],
        ['strength', 'pike-pushup', 4, 8],
        ['cooldown', 'arch-hold', 3, 30],
      ]),
    ]),
    week('Consolidate and test', 'Longer balances, then a recorded test at the end of the week.', [
      session(0, 'Longer balances', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 3, 45, HS],
        ['skill', 'freestanding-hs', 8, 8, HS],
        ['strength', 'elevated-pike-pushup', 3, 6],
        ['strength', 'hollow-hold', 3, 40],
      ]),
      session(2, 'Control', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'wall-shoulder-taps', 4, 10, HS],
        ['skill', 'freestanding-hs', 8, 10, HS],
        ['skill', 'crow-pose', 3, 25],
        ['strength', 'hollow-rock', 3, 20],
      ]),
      session(4, 'Test day', [
        ['warmup', 'wrist-prep', 2, 10],
        ['skill', 'chest-to-wall-hs', 2, 60, { ...HS, note: 'Test: one clean 60-second hold.' }],
        ['skill', 'freestanding-hs', 5, 10, { ...HS, note: 'Test: your best freestanding hold. Film it if you can.' }],
        ['strength', 'pike-pushup', 3, 10],
      ]),
    ]),
  ]
}

const FUNDAMENTALS_WEEKS = [
  ['Learn the shapes', 'Clean positions before any volume: plank, hollow, hang, squat.'],
  ['Own the basics', 'Full range on every rep. Stop each set with two reps in reserve.'],
  ['Add volume', 'One more set on the main movements.'],
  ['Harder variations', 'Move up a level wherever last week felt comfortable.'],
  ['Build density', 'Same work, shorter rests.'],
  ['Test week', 'Record your best set on push-ups, rows, hangs and hollow hold.'],
] as const

function calisthenicsFundamentals(): CourseWeek[] {
  return FUNDAMENTALS_WEEKS.map(([title, objective], i) => {
    const sets = i >= 2 ? 4 : 3
    return week(title, objective, [
      session(1, 'Push and core', [
        ['warmup', 'wrist-prep', 1, 10],
        ['warmup', 'scap-pushup', 2, 10],
        ['strength', 'pushup', sets, 8 + i],
        ['strength', 'bench-dip', 3, 10 + i],
        ['strength', 'pike-pushup', 3, 5 + Math.floor(i / 2)],
        ['strength', 'plank', 3, 30 + i * 5],
      ]),
      session(3, 'Pull and legs', [
        ['warmup', 'dead-hang', 2, 20],
        ['warmup', 'scap-pull', 2, 8],
        ['strength', 'negative-pullup', sets, 3, { p: 'pullup', span: 3 }],
        ['strength', 'horizontal-row', 3, 8 + i],
        ['strength', 'split-squat', 3, 10 + i],
        ['strength', 'glute-bridge', 3, 15],
      ]),
      session(5, 'Full body', [
        ['warmup', 'cat-cow', 1, 10],
        ['strength', 'pushup', 3, 8 + i],
        ['strength', 'horizontal-row', 3, 8 + i],
        ['strength', 'squat', 3, 15 + i * 2],
        ['strength', 'hanging-knee-raise', 3, 8],
        ['strength', 'hollow-hold', 3, 20 + i * 5],
        ['cooldown', 'deep-squat-hold', 2, 60],
      ]),
    ])
  })
}

// ── USC Calisthenics Beginner ────────────────────────────────────────────
//
// Nine weeks: assess, seven focused training weeks, re-assess. Each training
// week has one primary focus that most of its work builds, and support work
// that keeps the body balanced: the antagonist pattern, the trunk, shoulder
// health, mobility. Two sessions a week are the programme (A and B); the
// third (C) is optional and lighter. Every exercise carries its purpose in its
// note, which athletes see during the workout.

const P = (note: string, extra: { p?: string; span?: number; rest?: number } = {}) => ({ note, ...extra })

function uscBeginner(): CourseWeek[] {
  return [
    week('Initial assessment', 'Find everyone’s starting point across all six stations. Results become each athlete’s baseline, and tell you where to pitch the levels for the weeks ahead.', [], { kind: 'baseline' }),

    week('Core and body line', 'Learn to hold a straight, braced body. Every movement in calisthenics leans on this, so it comes first.', [
      session(0, 'A · Brace and hold', [
        ['warmup', 'cat-cow', 1, 10, P('Wake up the spine before bracing it.')],
        ['warmup', 'wrist-prep', 1, 10, P('Prepares the wrists for every support position to come.')],
        ['skill', 'hollow-hold', 3, 20, P('Primary: the body line. Lower back pressed down, ribs in.')],
        ['strength', 'dead-bug', 3, 10, P('Primary: keep the trunk still while the limbs move.')],
        ['strength', 'plank', 3, 30, P('Primary: bracing under bodyweight.')],
        ['strength', 'incline-row', 3, 8, P('Support: pulling balances the week’s pressing positions.', { p: 'row' })],
        ['strength', 'squat', 3, 12, P('Support: keeps the legs in the programme.')],
        ['cooldown', 'deep-squat-hold', 2, 45, P('Mobility: hips and ankles, slowly.')],
      ]),
      session(2, 'B · Hang and rotate', [
        ['warmup', 'scap-pull', 2, 6, P('Shoulder health: set the shoulders before hanging.')],
        ['strength', 'hanging-knee-raise', 3, 8, P('Primary: the trunk from a hang, without swinging.')],
        ['strength', 'side-plank', 3, 20, P('Primary: the sides of the trunk. Count the weaker side.')],
        ['strength', 'hollow-rock', 3, 10, P('Primary: holding the hollow shape in motion.')],
        ['strength', 'incline-pushup', 3, 10, P('Support: a plank that moves. The body line from A, now pressing.', { p: 'pushup' })],
        ['strength', 'glute-bridge', 3, 15, P('Support: the back of the body, which balances the core work.')],
        ['cooldown', 'arch-hold', 2, 20, P('Mobility: open the front after a week of curling in.')],
      ]),
      session(4, 'C · Optional: core flow', [
        ['strength', 'plank', 2, 40, P('Primary: a longer brace than on Monday.')],
        ['strength', 'dead-bug', 2, 12, P('Primary: slow and controlled.')],
        ['skill', 'tuck-l-sit', 3, 8, P('Primary: compression. Feet up for a few seconds is plenty.', { p: 'l-sit' })],
        ['cooldown', 'overhead-wall-reach', 2, 20, P('Mobility: shoulders overhead, back flat.')],
        ['cooldown', 'deep-lunge', 2, 30, P('Mobility: hip flexors, tight after core work.')],
      ]),
    ], { focus: 'core' }),

    week('Pushing', 'Build a strong, honest push-up at the level that fits you, and the shoulders to press overhead later.', [
      session(0, 'A · Horizontal push', [
        ['warmup', 'wrist-prep', 1, 10, P('Wrists carry every push.')],
        ['warmup', 'scap-pushup', 2, 10, P('Shoulder health: shoulder blades moving freely under load.')],
        ['strength', 'pushup', 4, 8, P('Primary: pick the level where 8 clean reps are hard. Chest to the floor.', { span: 4 })],
        ['strength', 'bench-dip', 3, 10, P('Primary: the triceps and the bottom of the push.', { p: 'dip' })],
        ['strength', 'diamond-pushup', 2, 5, P('Primary: hands close, elbows in. Drop to the knees or an incline if needed.', { p: 'pushup', span: 3 })],
        ['strength', 'incline-row', 3, 10, P('Support: the opposite movement keeps the shoulders balanced.', { p: 'row' })],
        ['strength', 'hollow-hold', 3, 20, P('Support: a push-up is a moving plank; this is the plank.')],
        ['cooldown', 'reverse-plank', 2, 20, P('Mobility: open the chest and shoulders after pressing.')],
      ]),
      session(2, 'B · Overhead push', [
        ['warmup', 'wrist-prep', 1, 10, P('Wrists carry every push.')],
        ['strength', 'pike-pushup', 3, 6, P('Primary: pressing overhead, the road to handstand push-ups.', { span: 2 })],
        ['strength', 'pushup', 3, 6, P('Primary: three seconds down on every rep.', { span: 4 })],
        ['strength', 'negative-dip', 3, 3, P('Primary: lower slowly from the top of the dip. Bench dips if the bars are too much.', { p: 'dip' })],
        ['skill', 'planche-lean', 3, 15, P('Primary: straight-arm pushing strength, leaning past the hands.')],
        ['strength', 'scap-pull', 3, 8, P('Support: shoulder health. Strong shoulder blades protect the press.')],
        ['strength', 'plank', 3, 30, P('Support: bracing.')],
        ['strength', 'squat', 3, 15, P('Support: keeps the legs in the programme.')],
        ['cooldown', 'overhead-wall-reach', 2, 20, P('Mobility: arms overhead without arching.')],
      ]),
      session(4, 'C · Optional: push volume', [
        ['strength', 'pushup', 3, 8, P('Primary: easy, clean reps at your level. Leave two in the tank.', { span: 4 })],
        ['strength', 'pike-pushup', 2, 6, P('Primary: overhead pressing.', { span: 2 })],
        ['skill', 'pike-hold', 3, 20, P('Support: weight on the hands, a first taste of handstand.')],
        ['strength', 'glute-bridge', 3, 15, P('Support: the back of the body.')],
        ['cooldown', 'deep-squat-hold', 2, 45, P('Mobility.')],
      ]),
    ], { focus: 'push' }),

    week('Pulling', 'From hanging to pulling: grip, shoulder blades, and the first controlled lowering towards a pull-up.', [
      session(0, 'A · Vertical pull', [
        ['warmup', 'dead-hang', 2, 20, P('Primary: grip and hanging. Relax into it.')],
        ['strength', 'scap-pull', 3, 8, P('Primary: the first part of every pull-up. Pause each rep.')],
        ['strength', 'negative-pullup', 4, 3, P('Primary: lower for five seconds. Use the level that fits you.', { p: 'pullup', span: 3 })],
        ['strength', 'incline-row', 3, 10, P('Primary: horizontal pulling volume.', { p: 'row' })],
        ['strength', 'pushup', 3, 8, P('Support: the opposite movement keeps the shoulders balanced.', { span: 4 })],
        ['strength', 'hollow-hold', 3, 20, P('Support: the hollow body is the shape of a good pull-up.')],
        ['cooldown', 'overhead-wall-reach', 2, 20, P('Mobility: shoulders overhead after hanging.')],
      ]),
      session(2, 'B · Horizontal pull', [
        ['warmup', 'scap-pull', 2, 6, P('Shoulder health: set the shoulders.')],
        ['strength', 'horizontal-row', 4, 8, P('Primary: the row is the pull-up’s foundation. Chest to the bar.', { p: 'row', span: 1 })],
        ['strength', 'negative-pullup', 3, 3, P('Primary: lowering under control.', { p: 'pullup', span: 3 })],
        ['strength', 'hanging-knee-raise', 3, 8, P('Support: trunk from a hang, and more time on the bar.')],
        ['strength', 'pike-pushup', 3, 6, P('Support: pressing to balance the pulling.', { span: 2 })],
        ['strength', 'split-squat', 3, 8, P('Support: keeps the legs in the programme.')],
      ]),
      session(4, 'C · Optional: grip and back', [
        ['strength', 'dead-hang', 3, 30, P('Primary: grip endurance, the limiter for most beginners.')],
        ['strength', 'band-pullup', 3, 5, P('Primary: the full pull-up path, with a band to help.')],
        ['strength', 'arch-hold', 3, 20, P('Support: the back of the body.')],
        ['cooldown', 'deep-squat-hold', 2, 45, P('Mobility.')],
      ]),
    ], { focus: 'pull' }),

    week('Legs', 'Strong, mobile legs on two and on one: depth, control and balance.', [
      session(0, 'A · Squat', [
        ['warmup', 'hip-90-90', 1, 8, P('Opens the hips for depth.')],
        ['strength', 'squat', 4, 15, P('Primary: full depth, heels down.', { span: 2 })],
        ['strength', 'split-squat', 3, 10, P('Primary: one leg at a time. Back knee to the floor.', { span: 2 })],
        ['strength', 'glute-bridge', 3, 15, P('Primary: glutes and hamstrings, which balance the squat.', { p: 'hamstring' })],
        ['strength', 'calf-raise', 3, 12, P('Primary: ankles and calves, for landing and balance.')],
        ['strength', 'pushup', 3, 8, P('Support: upper body maintenance.', { span: 4 })],
        ['strength', 'horizontal-row', 3, 8, P('Support: upper body maintenance.', { p: 'row' })],
      ]),
      session(2, 'B · Single leg', [
        ['warmup', 'deep-lunge', 1, 30, P('Opens the hip flexors.')],
        ['strength', 'assisted-pistol', 3, 4, P('Primary: single-leg depth, a hand on a support for balance only.', { span: 2 })],
        ['strength', 'single-leg-bridge', 3, 10, P('Primary: one-sided strength at the back of the leg.', { p: 'hamstring' })],
        ['strength', 'cossack-squat', 3, 5, P('Primary: strength through a wide, deep range.')],
        ['strength', 'wall-sit', 2, 45, P('Primary: holding under fatigue.')],
        ['strength', 'plank', 3, 40, P('Support: bracing.')],
        ['strength', 'dead-hang', 2, 30, P('Support: keeps the grip from last week.')],
      ]),
      session(4, 'C · Optional: legs and hips mobility', [
        ['mobility', 'deep-squat-hold', 3, 60, P('Primary: comfortable at the bottom of a squat.')],
        ['mobility', 'deep-lunge', 2, 45, P('Primary: hip flexors.')],
        ['mobility', 'toe-touch', 2, 30, P('Primary: hamstrings.')],
        ['strength', 'hollow-hold', 2, 25, P('Support: bracing.')],
      ]),
    ], { focus: 'legs' }),

    week('Handstand and balance', 'Get comfortable upside down and on the hands: wrists, shoulders, line, and the first balances.', [
      session(0, 'A · On the wall', [
        ['warmup', 'wrist-prep', 2, 10, P('Wrists carry every balance. Do not skip.')],
        ['skill', 'pike-hold', 3, 30, P('Primary: shoulders over the hands, arms locked.', { p: 'handstand-line', span: 2 })],
        ['skill', 'wall-walk', 3, 2, P('Primary: getting upside down, and back down, safely.', { p: 'handstand-line', span: 2 })],
        ['skill', 'chest-to-wall-hs', 4, 20, P('Primary: the handstand line. Only the toes touch the wall.', { p: 'handstand-line', span: 2 })],
        ['strength', 'hollow-hold', 3, 25, P('Support: the handstand is a hollow body upside down.')],
        ['strength', 'pike-pushup', 3, 6, P('Support: overhead strength to hold yourself up.', { span: 2 })],
        ['cooldown', 'overhead-wall-reach', 2, 20, P('Mobility: open shoulders make a straighter line.')],
      ]),
      session(2, 'B · Balance on the hands', [
        ['warmup', 'wrist-prep', 2, 10, P('Wrists carry every balance.')],
        ['skill', 'crow-pose', 4, 10, P('Primary: balance with the hands, low to the floor.', { p: 'arm-balance' })],
        ['skill', 'back-to-wall-hs', 3, 20, P('Primary: time upside down, with the wall to catch you.', { p: 'handstand-line', span: 2 })],
        ['skill', 'wall-walk', 2, 2, P('Primary: practise the way up and the way down.', { p: 'handstand-line', span: 2 })],
        ['strength', 'scap-pull', 3, 8, P('Support: shoulder health, the opposite of pressing.')],
        ['strength', 'horizontal-row', 3, 8, P('Support: pulling balances a week on the hands.', { p: 'row' })],
        ['strength', 'squat', 3, 15, P('Support: keeps the legs in the programme.')],
      ]),
      session(4, 'C · Optional: practice', [
        ['skill', 'wall-walk', 3, 2, P('Primary: practice, not fatigue.', { p: 'handstand-line', span: 2 })],
        ['skill', 'pike-hold', 3, 30, P('Primary: shoulders over the hands.', { p: 'handstand-line', span: 2 })],
        ['strength', 'hollow-rock', 3, 10, P('Support: the hollow shape in motion.')],
        ['cooldown', 'reverse-plank', 2, 20, P('Mobility: open the wrists and shoulders the other way.')],
      ]),
    ], { focus: 'handstand' }),

    week('Mobility', 'Range you can use: hamstrings, hips, shoulders and spine, while the strength from earlier weeks is kept.', [
      session(0, 'A · Hips and hamstrings', [
        ['warmup', 'cat-cow', 1, 10, P('Spine first.')],
        ['warmup', 'worlds-greatest-stretch', 1, 4, P('Everything at once, gently.')],
        ['mobility', 'toe-touch', 3, 30, P('Primary: hamstrings. Knees locked, breathe out to go deeper.', { p: 'pike-fold' })],
        ['mobility', 'deep-squat-hold', 3, 60, P('Primary: hips and ankles.', { p: 'straddle' })],
        ['mobility', 'deep-lunge', 3, 30, P('Primary: hip flexors. Each side.', { p: 'front-split' })],
        ['strength', 'pushup', 3, 8, P('Support: strength maintained while mobility leads.', { span: 4 })],
        ['strength', 'horizontal-row', 3, 8, P('Support: strength maintained.', { p: 'row' })],
      ]),
      session(2, 'B · Shoulders and spine', [
        ['warmup', 'hip-90-90', 1, 8, P('Hips first.')],
        ['mobility', 'overhead-wall-reach', 3, 20, P('Primary: shoulders overhead, back flat.')],
        ['mobility', 'reverse-plank', 3, 30, P('Primary: chest and the front of the shoulders.', { p: 'bridge' })],
        ['mobility', 'pancake-elbows', 3, 30, P('Primary: straddle range.', { p: 'straddle' })],
        ['strength', 'squat', 3, 15, P('Support: strength through the new range.')],
        ['strength', 'hollow-hold', 3, 25, P('Support: bracing.')],
      ]),
      session(4, 'C · Optional: long holds', [
        ['mobility', 'deep-squat-hold', 2, 90, P('Primary: time at the bottom.')],
        ['mobility', 'toe-touch', 2, 45, P('Primary: hamstrings.', { p: 'pike-fold' })],
        ['mobility', 'arch-hold', 2, 20, P('Primary: the spine the other way.')],
      ]),
    ], { focus: 'mobility' }),

    week('Bring it together', 'All six areas in two full-body sessions, at the levels you have earned. Lighter volume so you arrive fresh at the re-test.', [
      session(0, 'A · Full body', [
        ['warmup', 'wrist-prep', 1, 10, P('Wrists.')],
        ['strength', 'pushup', 3, 8, P('Primary: Push: your best level with clean reps.', { span: 4 })],
        ['strength', 'negative-pullup', 3, 3, P('Primary: Pull: your current level on the ladder.', { p: 'pullup', span: 3 })],
        ['strength', 'squat', 3, 15, P('Primary: Legs.', { span: 2 })],
        ['strength', 'hollow-hold', 3, 25, P('Primary: Core.')],
        ['skill', 'pike-hold', 3, 30, P('Primary: Handstand.', { p: 'handstand-line', span: 2 })],
        ['cooldown', 'deep-squat-hold', 2, 60, P('Primary: Mobility.')],
      ]),
      session(2, 'B · Full body', [
        ['warmup', 'scap-pull', 2, 6, P('Shoulder health.')],
        ['strength', 'horizontal-row', 3, 8, P('Primary: Pull.', { p: 'row' })],
        ['strength', 'pike-pushup', 3, 6, P('Primary: Push, overhead.', { span: 2 })],
        ['strength', 'split-squat', 3, 10, P('Primary: Legs, one side at a time.', { span: 2 })],
        ['strength', 'plank', 3, 40, P('Primary: Core.')],
        ['skill', 'crow-pose', 3, 10, P('Primary: Balance.', { p: 'arm-balance' })],
        ['cooldown', 'toe-touch', 2, 30, P('Primary: Mobility.', { p: 'pike-fold' })],
      ]),
      session(4, 'C · Optional: rehearse the stations', [
        ['strength', 'dead-hang', 1, 30, P('Primary: Rehearse the pulling station at easy effort.')],
        ['strength', 'pushup', 1, 5, P('Primary: Rehearse the pushing station at easy effort.', { span: 4 })],
        ['strength', 'plank', 1, 30, P('Primary: Rehearse the core station.')],
        ['strength', 'squat', 1, 10, P('Primary: Rehearse the legs station.')],
        ['cooldown', 'deep-squat-hold', 1, 60, P('Primary: Rehearse the mobility station.')],
      ]),
    ], { focus: 'full' }),

    week('Final assessment', 'The same stations as week 1. Everyone sees what improved, which new variations they can do, and what to work on next.', [], { kind: 'retest' }),
  ]
}

export interface CourseTemplate {
  id: string
  title: string
  tagline: string
  description: string
  focus: Course['focus']
  milestones: string[]
  build: () => CourseWeek[]
}

export const COURSE_TEMPLATES: CourseTemplate[] = [
  {
    id: 'usc-beginner',
    title: 'USC Calisthenics Beginner',
    tagline: 'Nine weeks from your starting point to a new one.',
    description:
      'Week 1 assesses where everyone starts. Weeks 2 to 8 each focus on one area (core, pushing, pulling, legs, handstand, mobility, then all of it together), with support work that keeps the body balanced. Two sessions a week, plus an optional third. Week 9 repeats the assessment, so everyone sees exactly what changed.',
    focus: 'full',
    milestones: ['core-hollow-30', 'push-10', 'pull-neg-5', 'pull-row-10', 'legs-squat-20', 'hs-ctw-30', 'mob-squat-60'],
    build: uscBeginner,
  },
  {
    id: 'handstand-foundations',
    title: 'Handstand Foundations',
    tagline: 'From the wall to your first seconds of balance.',
    description:
      'Four weeks, three sessions a week. Wrist preparation, a straight line against the wall, then structured balance practice away from it.',
    focus: 'handstand',
    milestones: ['hs-crow-15', 'hs-ctw-60', 'hs-free-3', 'hs-free-10'],
    build: handstandFoundations,
  },
  {
    id: 'calisthenics-fundamentals',
    title: 'Calisthenics Fundamentals',
    tagline: 'Push, pull, legs and core, built properly.',
    description:
      'Six weeks, three sessions a week. Full-range basics with a level for every student, ending in a recorded test week.',
    focus: 'full',
    milestones: ['push-10', 'pull-first', 'core-hollow-30', 'legs-squat-20', 'pull-row-10'],
    build: calisthenicsFundamentals,
  },
]

export const blankWeek = (n: number): CourseWeek => week(`Week ${n}`, '', [])
/**
 * Puts a week of a course in another place. The week goes as it is, with its sessions and its own id, so what athletes
 * already did in it stays theirs; the dates follow from where it now stands. A week still called by its number
 * ("Week 4") is called by its new one.
 */
export function moveWeek(course: Pick<Course, 'weeks'>, from: number, to: number) {
  const n = course.weeks.length
  if (from === to || from < 0 || to < 0 || from >= n || to >= n || !Number.isInteger(from) || !Number.isInteger(to)) return
  const [week] = course.weeks.splice(from, 1)
  course.weeks.splice(to, 0, week)
  course.weeks.forEach((w, i) => { if (/^Week \d+$/.test(w.title.trim())) w.title = `Week ${i + 1}` })
}

export const blankSession = (day: number): CourseSession => session(day, 'New session', [])

export function courseFromTemplate(
  templateId: string | null,
  coachId: string,
  startDate: string,
  over: Partial<Course> = {},
): Course {
  const t = COURSE_TEMPLATES.find((x) => x.id === templateId)
  return {
    id: uid(),
    coachId,
    title: t?.title ?? 'Untitled course',
    tagline: t?.tagline ?? '',
    description: t?.description ?? '',
    focus: t?.focus ?? 'full',
    format: 'group',
    status: 'draft',
    startDate,
    milestones: t?.milestones ?? [],
    weeks: t ? t.build() : [blankWeek(1), blankWeek(2), blankWeek(3), blankWeek(4)],
    ...over,
  }
}
