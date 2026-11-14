import { describe, expect, it } from 'vitest'
import type { AssessmentParticipant, AssessmentResult, DisciplineId } from './types'
import { DISCIPLINE_IDS, exerciseById } from './catalog'
import {
  ALL_TESTS, PROTOCOL, STATIONS, compareProfiles, decodeHandIn, decodeInvite, encodeHandIn, encodeInvite, groupInsights, ladderAdvice,
  needsAttention, nextTest, overallProgress, profileOf, resultsToEvidence, startingStation, stationById, stationProgress, suggestPairs,
  testById, toMember, visibleTests, type Results,
} from './assessment'
import { allRatings } from './scoring/mastery'

const r = (value: number, extra: Partial<AssessmentResult> = {}): AssessmentResult => ({ value, tier: 'self', at: '2026-01-05T10:00:00.000Z', ...extra })
const ids = (station: DisciplineId, results: Results) => visibleTests(stationById[station], results).map((t) => t.id)

/** Walk a station the way an athlete would, answering each test as it appears. */
function run(station: DisciplineId, answers: Record<string, number>): Results {
  const results: Results = {}
  for (let guard = 0; guard < 20; guard++) {
    const t = nextTest(stationById[station], results)
    if (!t) break
    results[t.id] = r(answers[t.id] ?? 0)
  }
  return results
}

const participant = (id: string, name: string, results: Results, extra: Partial<AssessmentParticipant> = {}): AssessmentParticipant => ({
  id, sessionId: 's1', name, joinedAt: '2026-01-05T09:00:00.000Z', via: 'self', sharing: 'coach', results, skipped: [], flags: [], ...extra,
})

describe('assessment protocol', () => {
  it('covers all six disciplines with rated, uniquely named tests', () => {
    expect(STATIONS.map((s) => s.id).sort()).toEqual([...DISCIPLINE_IDS].sort())
    expect(new Set(ALL_TESTS.map((t) => t.id)).size).toBe(ALL_TESTS.length)
    for (const t of ALL_TESTS) {
      expect(exerciseById[t.exerciseId], t.id).toBeDefined()
      if (t.kind === 'max') expect(exerciseById[t.exerciseId].curve, t.id).toBeDefined()
      for (const o of t.options ?? []) for (const [ex] of o.ev) expect(exerciseById[ex]?.curve, `${t.id}:${ex}`).toBeDefined()
      for (const group of t.when ?? []) for (const c of group) expect(testById[c.test], `${t.id} -> ${c.test}`).toBeDefined()
    }
  })

  it('only depends on tests that come earlier in the same station', () => {
    for (const s of STATIONS) {
      s.tests.forEach((t, i) => {
        for (const group of t.when ?? []) for (const c of group) expect(s.tests.findIndex((x) => x.id === c.test), `${t.id} -> ${c.test}`).toBeLessThan(i)
      })
      expect(s.tests[0].when, `${s.id} opens with a test for everyone`).toBeUndefined()
    }
  })

  it('gives a beginner easier benchmarks and never the advanced ones', () => {
    const pull = run('pull', { 'dead-hang': 10, 'incline-row': 8 })
    expect(Object.keys(pull)).toEqual(['dead-hang', 'incline-row'])
    const cannotPullYet = run('pull', { 'dead-hang': 25, 'pull-up': 0, 'incline-row': 10, 'scap-pull': 6 })
    expect(Object.keys(cannotPullYet)).toEqual(['dead-hang', 'pull-up', 'incline-row', 'scap-pull'])
    expect(ids('push', { pushup: r(2) })).toEqual(['pushup', 'knee-pushup', 'incline-pushup'])
    expect(ids('handstand', { 'wall-walk': r(0) })).not.toContain('chest-to-wall-hs')
  })

  it('opens advanced benchmarks to a strong athlete and skips the regressions', () => {
    const strong = run('pull', { 'dead-hang': 80, 'pull-up': 15, 'chest-to-bar': 8, 'tuck-fl': 15, 'muscle-up': 2 })
    expect(Object.keys(strong)).toEqual(['dead-hang', 'pull-up', 'chest-to-bar', 'tuck-fl', 'muscle-up'])
    expect(ids('pull', strong)).not.toContain('incline-row')
    expect(ids('pull', { 'dead-hang': r(60), 'pull-up': r(5) })).toEqual(['dead-hang', 'pull-up', 'horizontal-row'])
  })

  it('collects at least two benchmarks at every station on any path', () => {
    for (const s of STATIONS) {
      for (const level of [0, 3, 12, 30, 90]) {
        const answers = Object.fromEntries(s.tests.map((t) => [t.id, t.kind === 'choice' ? Math.min(level > 10 ? 2 : level > 0 ? 1 : 0, t.options!.length - 1) : level]))
        expect(Object.keys(run(s.id, answers)).length, `${s.id} at ${level}`).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it('tracks station and overall progress, and waits on a skipped gate', () => {
    const station = stationById.pull
    expect(stationProgress(station, {}).state).toBe('todo')
    expect(stationProgress(station, { 'dead-hang': r(40) }).state).toBe('active')
    expect(stationProgress(station, run('pull', { 'dead-hang': 40, 'pull-up': 4, 'horizontal-row': 9 })).state).toBe('done')
    expect(stationProgress(station, {}, ['pull']).state).toBe('skipped')
    expect(ids('pull', { 'dead-hang': r(0, { skipped: true }) })).toEqual(['dead-hang'])
    const o = overallProgress(['pull', 'push'], run('pull', { 'dead-hang': 40, 'pull-up': 4 }), ['push'])
    expect(o).toMatchObject({ done: 1, skipped: 1, total: 2, complete: true })
  })
})

describe('assessment results', () => {
  const results: Results = {
    ...run('pull', { 'dead-hang': 60, 'pull-up': 6, 'horizontal-row': 12 }),
    ...run('push', { pushup: 15, 'pike-pushup': 6, dip: 0 }),
    fold: r(2),
  }

  it('become evidence that keeps its tier, and zero or skipped results become nothing', () => {
    const ev = resultsToEvidence({ ...results, 'pull-up': r(6, { tier: 'observed' }), 'dead-hang': r(60, { tier: 'coach' }), squat: r(0, { skipped: true }) }, 'a1', 's1', 'coach1')
    const by = Object.fromEntries(ev.map((e) => [e.exerciseId, e]))
    expect(by['pull-up']).toMatchObject({ value: 6, tier: 'observed', observedBy: 'coach1', source: 'assessment', assessmentId: 's1' })
    expect(by['dead-hang']).toMatchObject({ tier: 'coach', verifiedBy: 'coach1' })
    expect(by.dip).toBeUndefined()
    expect(by.squat).toBeUndefined()
    expect(by['palms-floor-fold'].value).toBe(10)
    expect(new Set(ev.map((e) => e.id)).size).toBe(ev.length)
  })

  it('rate an observed result as observed, never as verified', () => {
    const observed = Object.fromEntries(Object.entries(results).map(([k, v]) => [k, { ...v, tier: 'observed' as const }]))
    const ratings = allRatings(resultsToEvidence(observed, 'a1', 's1', 'c'))
    expect(ratings.pull.status).toBe('observed')
    expect(ratings.pull.verified).toBe(0)
    expect(allRatings(resultsToEvidence(results, 'a1', 's1')).pull.status).toBe('self')
  })

  it('produce a profile with strengths, and measure change between two assessments', () => {
    const before = profileOf(results, ['pull', 'push'])
    expect(before.ratings.pull).toBeGreaterThan(0)
    expect(before.ratings.core).toBe(0)
    expect(before.strongest).toBe('pull')
    const after = profileOf({ ...results, 'pull-up': r(10) }, ['pull', 'push'])
    const change = compareProfiles(before, after, ['pull', 'push'])
    expect(change.ratings.pull).toBeGreaterThan(0)
    expect(change.ratings.push).toBe(0)
    expect(change.aura).toBeGreaterThan(0)
  })
})

describe('invitation and hand-in links', () => {
  it('round-trip an invitation', () => {
    const invite = { id: 'k3x9', protocol: PROTOCOL, title: 'Baseline', groupName: 'Handstand Foundations · Tuesday', coachName: 'Zoë Müller', courseId: 'c1', stations: ['handstand', 'push', 'core'] as DisciplineId[], kind: 'retest' as const, stationMinutes: 7 }
    expect(decodeInvite(encodeInvite(invite))).toEqual(invite)
    expect(encodeInvite(invite)).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(decodeInvite('not-a-link')).toBeNull()
  })

  it('round-trip results, and always land them as self-reported', () => {
    const p = participant('p9', 'Søren', { 'dead-hang': r(45, { tier: 'coach' }), 'pull-up': r(0), fold: r(3), squat: r(0, { skipped: true }) }, { sharing: 'group', partner: 'Mia', skipped: ['legs'], flags: ['handstand'], submittedAt: '2026-01-05T11:00:00.000Z' })
    const back = decodeHandIn(encodeHandIn(p, PROTOCOL))!
    expect(back).toMatchObject({ sessionId: 's1', participantId: 'p9', name: 'Søren', sharing: 'group', partner: 'Mia', skipped: ['legs'], flags: ['handstand'] })
    expect(back.results['dead-hang']).toMatchObject({ value: 45, tier: 'self' })
    expect(back.results['pull-up'].value).toBe(0)
    expect(back.results.squat.skipped).toBe(true)
    expect(back.results.fold.value).toBe(3)
    expect(decodeHandIn('garbage')).toBeNull()
  })

  it('stay short enough to scan from a phone screen', () => {
    const full: Results = Object.fromEntries(ALL_TESTS.map((t) => [t.id, r(t.kind === 'choice' ? 1 : 120)]))
    expect(encodeHandIn(participant('p123456789', 'A Fairly Long Participant Name', full, { submittedAt: '2026-01-05T11:00:00.000Z' }), PROTOCOL).length).toBeLessThan(900)
  })
})

describe('group analysis', () => {
  const puller = participant('a', 'Ana', { ...run('pull', { 'dead-hang': 90, 'pull-up': 12, 'chest-to-bar': 6, 'tuck-fl': 12, 'muscle-up': 0 }), ...run('mobility', { fold: 0, 'deep-squat-hold': 20, overhead: 0 }) }, { sharing: 'group' })
  const bendy = participant('b', 'Ben', { ...run('pull', { 'dead-hang': 20, 'pull-up': 0, 'incline-row': 8, 'scap-pull': 5 }), ...run('mobility', { fold: 3, 'deep-squat-hold': 120, overhead: 2, straddle: 2, bridge: 20 }) })
  const middle = participant('c', 'Cy', { ...run('pull', { 'dead-hang': 45, 'pull-up': 4, 'horizontal-row': 10 }), ...run('mobility', { fold: 1, 'deep-squat-hold': 60, overhead: 1, straddle: 0, bridge: 0 }) })
  const stations: DisciplineId[] = ['pull', 'mobility']
  const members = [puller, bendy, middle].map((p) => toMember(p, stations))

  it('summarises the group and finds where it is furthest apart', () => {
    const g = groupInsights(members, stations)
    expect(g.size).toBe(3)
    expect(g.median.pull).toBe(members[2].profile.ratings.pull)
    expect(g.min.pull).toBeLessThan(g.max.pull)
    expect(g.median.core).toBe(0)
    expect(g.widest).not.toBeNull()
    expect(Object.values(g.bands.pull).reduce((a, b) => a + (b ?? 0), 0)).toBe(3)
  })

  it('pairs complementary athletes and says who leads where', () => {
    const pairs = suggestPairs(members, stations)
    expect(pairs).toHaveLength(1)
    const [pair] = pairs
    expect([pair.a.name, pair.b.name].sort()).toEqual(['Ana', 'Ben'])
    const anaLeads = pair.a.name === 'Ana' ? pair.aLeads : pair.bLeads
    expect(anaLeads).toBe('pull')
  })

  it('advises where to pitch each ladder and keeps sharing choices', () => {
    const advice = ladderAdvice(members, stations).find((a) => a.progressionId === 'pullup')!
    expect(advice.min).toBeLessThan(advice.max)
    expect(advice.level).toBeGreaterThanOrEqual(advice.min)
    expect(advice.level).toBeLessThanOrEqual(advice.max)
    expect(members.map((m) => m.shared)).toEqual([true, false, false])
  })

  it('flags who needs the coach and spreads starting stations', () => {
    const quiet = participant('d', 'Di', {})
    const stuck = participant('e', 'Eli', { 'dead-hang': r(30) }, { flags: ['pull'], skipped: ['mobility'] })
    const flagged = needsAttention([puller, quiet, stuck], stations)
    expect(flagged.map((f) => f.participant.name)).toEqual(['Di', 'Eli'])
    expect(flagged[1].reasons.join(' ')).toMatch(/help/)
    const all: DisciplineId[] = ['pull', 'push', 'core', 'legs', 'handstand', 'mobility']
    const starts = new Set(Array.from({ length: 40 }, (_, i) => startingStation(`participant-${i}`, all)))
    expect(starts.size).toBeGreaterThanOrEqual(5)
    expect(startingStation('x', all)).toBe(startingStation('x', all))
  })
})
