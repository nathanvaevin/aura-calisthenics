/**
 * How each theme speaks.
 *
 * One table: a key, and a line for each voice. Aura Dark and Aura Light
 * share the Aura voice. The facts in a sentence (numbers, names, what was
 * measured) are passed in and never differ between voices; only the manner
 * does. Official assessments always speak in the Aura voice.
 *
 * Kept short on purpose. A voice that comments on everything stops being
 * heard: the lines here sit at the moments that carry feeling (arriving,
 * finishing, unlocking, an empty page), and everything else stays plain.
 */
import type { VoiceId } from './themes'

type Line = string | readonly string[]

const COPY = {
  // Home
  'home.greeting.morning': { aura: 'Good morning', power: 'Rise', iron: 'Morning. Work.' },
  'home.greeting.afternoon': { aura: 'Good afternoon', power: 'Ready', iron: 'Afternoon. Work.' },
  'home.greeting.evening': { aura: 'Good evening', power: 'One more round', iron: 'Evening. Work.' },
  'home.greeting.night': { aura: 'Late session', power: 'Late power-up', iron: 'Late. Still work.' },
  'home.line': {
    aura: ['Discover what your body is truly capable of.', 'Your next level starts here.', 'Strength you can see, one benchmark at a time.'],
    power: ['Your next transformation begins with the work you put in today.', 'Unlock your next form.', 'Every rep charges what comes next.'],
    iron: ['Strength is earned.', 'Discover the limits of your strength.', 'Earn every level.'],
  },
  'home.toNext': { aura: '{n} to {label}', power: '{n} to {label}. Keep charging.', iron: '{n} short of {label}.' },

  // The unlock moment
  'celebrate.eyebrow': { aura: 'Skill unlocked · {band}', power: 'New technique · {band}', iron: 'Earned · {band}' },
  'celebrate.line': {
    aura: 'Your body just showed you something new.',
    power: 'You are not the athlete you were yesterday.',
    iron: 'Nobody gave you this.',
  },
  'celebrate.continue': { aura: 'Continue', power: 'Keep rising', iron: 'Back to work' },

  // A new form
  'form.unlocked.eyebrow': { aura: 'A new Aura is yours', power: 'New form unlocked', iron: 'A new state. Earned.' },
  'form.unlocked.line': {
    aura: 'It is in your Studio whenever you want to wear it.',
    power: 'Your power has changed shape. Wear it.',
    iron: 'It was not there last month. You put it there.',
  },
  'form.wear': { aura: 'Wear it now', power: 'Transform', iron: 'Take it' },
  'form.next': { aura: 'Next Aura: {name}', power: 'Next form: {name}', iron: 'Next state: {name}' },

  // Workout
  'workout.done': { aura: 'Session complete', power: 'Session cleared', iron: 'Work done' },
  'workout.done.line': {
    aura: 'What you did today is on record. That is how the picture gets sharper.',
    power: 'Power banked. The next form is a little closer.',
    iron: 'Done. It counts because you did it properly.',
  },

  // Empty pages
  'empty.logs.title': { aura: 'Nothing logged yet', power: 'No sessions cleared yet', iron: 'Nothing on record' },
  'empty.course.title': { aura: 'No course yet', power: 'No course yet', iron: 'No course yet' },
  'empty.records': {
    aura: 'No benchmarks on record yet. Log one from any exercise in the library.',
    power: 'No benchmarks yet. Put your first one on record and the charge begins.',
    iron: 'No benchmarks. Until you measure it, it is only an opinion.',
  },

  // Personalization
  'personal.cta.sub': {
    aura: 'Choose your theme, your character and your Aura.',
    power: 'Choose your universe, your fighter and your form.',
    iron: 'Choose how it looks. The rest you earn.',
  },
  'personal.ready': {
    aura: 'Your Aura identity is ready. You can personalise more at any time.',
    power: 'Your identity is set. Now power it up.',
    iron: 'Identity set. Everything else is work.',
  },
  'personal.core': {
    aura: 'Theme and character chosen. A little more about you is optional.',
    power: 'Universe and fighter chosen. Tell us more whenever you like.',
    iron: 'Look chosen. The rest is optional.',
  },
  'personal.start': {
    aura: 'Make Aura yours: a theme, a character, an Aura of your own.',
    power: 'Pick your universe and step into it.',
    iron: 'Set it up once. Then train.',
  },

  // Profile
  'profile.dna.empty': {
    aura: 'Your shape appears as you put benchmarks on record.',
    power: 'Your power map fills in with every benchmark you record.',
    iron: 'No shape yet. Measure something.',
  },
} as const satisfies Record<string, Record<VoiceId, Line>>

export type VoiceKey = keyof typeof COPY

/** The days since the epoch: a line with alternatives changes once a day, not on every render. */
const today = () => Math.floor(Date.now() / 86_400_000)

/** A line in a voice, with `{name}` placeholders filled in. */
export function say(voice: VoiceId, key: VoiceKey, vars?: Record<string, string | number>): string {
  const line: Line = COPY[key][voice]
  let text = typeof line === 'string' ? line : line[today() % line.length]
  if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v))
  return text
}

export const VOICE_KEYS = Object.keys(COPY) as VoiceKey[]
export const linesOf = (key: VoiceKey, voice: VoiceId): readonly string[] => {
  const line: Line = COPY[key][voice]
  return typeof line === 'string' ? [line] : line
}
