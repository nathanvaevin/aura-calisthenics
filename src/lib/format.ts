export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DAY = 86400000

const midnight = (d: Date) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** Calendar-day difference: positive when `d` is in the future. */
export const dayDiff = (d: Date | string, now = new Date()) =>
  Math.round((midnight(new Date(d)).getTime() - midnight(now).getTime()) / DAY)

export function relativeDay(d: Date | string, now = new Date()) {
  const diff = dayDiff(d, now)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff > 1 && diff < 7) return new Date(d).toLocaleDateString(undefined, { weekday: 'long' })
  if (diff < 0 && diff > -7) return `${-diff} days ago`
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export const shortDate = (d: Date | string) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export const clock = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export const num = (n: number) => n.toLocaleString('en-US')

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')

export const dvar = (discipline: string) => `var(--d-${discipline})`

export const KIND_LABEL = {
  warmup: 'Warm-up',
  skill: 'Skill practice',
  strength: 'Strength',
  mobility: 'Mobility',
  cooldown: 'Cooldown',
} as const
