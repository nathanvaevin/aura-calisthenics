import { useEffect, useMemo, useState } from 'react'
import type { Course, CourseSession, WorkoutLog } from '@/domain/types'
import { allRatings, personalRecords } from '@/domain/scoring/mastery'
import { computeAura, dedication } from '@/domain/scoring/aura'
import { skillStatuses } from '@/domain/scoring/skills'
import { dayDiff } from '@/lib/format'
import { sessionDate } from './seed'
import { useStore } from './store'

/** Everything derived about one athlete, recomputed from stored evidence and logs. */
export function useAthleteModel(athleteId: string | null | undefined) {
  const athlete = useStore((s) => (athleteId ? s.athletes[athleteId] : undefined))
  const allEvidence = useStore((s) => s.evidence)
  const allLogs = useStore((s) => s.logs)
  return useMemo(() => {
    if (!athlete) return null
    const evidence = allEvidence.filter((e) => e.athleteId === athlete.id)
    const logs = allLogs.filter((l) => l.athleteId === athlete.id)
    const ratings = allRatings(evidence)
    return {
      athlete,
      evidence,
      logs,
      ratings,
      aura: computeAura(ratings),
      statuses: skillStatuses(evidence),
      records: personalRecords(evidence),
      dedication: dedication(logs, athlete.weeklyTarget, new Date()),
    }
  }, [athlete, allEvidence, allLogs])
}

export type AthleteModel = NonNullable<ReturnType<typeof useAthleteModel>>

export const useMe = () => {
  const meId = useStore((s) => s.meId)
  return useAthleteModel(meId) as AthleteModel
}

export const useIsCoach = () => {
  const coachMode = useStore((s) => s.settings.coachMode)
  const roles = useStore((s) => (s.meId ? s.athletes[s.meId]?.roles : undefined))
  return coachMode && !!roles?.includes('coach')
}

/**
 * Manages what every athlete sees: demonstrations, themes, coach access. Not affected by coach mode.
 * The sample world's athlete is an admin only while developing: on the public site the Studio is for a real admin account.
 */
export const useIsAdmin = () => useStore((s) => !!s.meId && !!s.athletes[s.meId]?.roles.includes('admin') && (!s.demo || import.meta.env.DEV))

/** Re-render on an interval; returns the current time in ms. */
export function useNow(intervalMs = 250, enabled = true) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!enabled) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, enabled])
  return now
}

/**
 * The time as of this render, refreshed on an interval. Unlike `useNow`, a
 * re-render caused by anything else (a check-in, a check-out) also sees the
 * current time, so "is this stay running" is never answered with a stale clock.
 */
export function useClock(intervalMs = 20000) {
  useNow(intervalMs)
  return Date.now()
}

// ── Course helpers ─────────────────────────────────────────────────────

export function courseClock(course: Course, now = new Date()) {
  const days = -dayDiff(`${course.startDate}T00:00:00`, now)
  const total = course.weeks.length
  if (days < 0) return { state: 'upcoming' as const, weekIndex: 0, total, startsIn: -days }
  const weekIndex = Math.floor(days / 7)
  if (weekIndex >= total) return { state: 'finished' as const, weekIndex: total - 1, total, startsIn: 0 }
  return { state: 'active' as const, weekIndex, total, startsIn: 0 }
}

export const logForSession = (logs: WorkoutLog[], athleteId: string, sessionId: string) =>
  logs.find((l) => l.athleteId === athleteId && l.finishedAt && l.source.type === 'course' && l.source.sessionId === sessionId)

export interface SessionRef {
  course: Course
  weekIndex: number
  session: CourseSession
  date: Date
  log?: WorkoutLog
}

export function sessionsOf(course: Course, logs: WorkoutLog[], athleteId: string): SessionRef[] {
  return course.weeks.flatMap((w, weekIndex) =>
    w.sessions
      .slice()
      .sort((a, b) => a.day - b.day)
      .map((session) => ({
        course,
        weekIndex,
        session,
        date: sessionDate(course, weekIndex, session.day),
        log: logForSession(logs, athleteId, session.id),
      })),
  )
}

/** The session an athlete should do next: the earliest unfinished one from this week on. */
export function nextSession(course: Course, logs: WorkoutLog[], athleteId: string, now = new Date()): SessionRef | null {
  const clock = courseClock(course, now)
  if (clock.state === 'finished') return null
  const open = sessionsOf(course, logs, athleteId).filter((s) => !s.log && s.weekIndex >= clock.weekIndex)
  return open[0] ?? null
}

export function courseProgress(course: Course, logs: WorkoutLog[], athleteId: string) {
  const all = sessionsOf(course, logs, athleteId)
  const done = all.filter((s) => s.log).length
  return { done, total: all.length, ratio: all.length ? done / all.length : 0 }
}
