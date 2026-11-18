import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Athlete } from '@/domain/types'
import { AURA_CLASSES } from '@/domain/scoring/config'
import { build, project } from '@/data/cloud/mappers'
import { themeById } from '@/visual/aura/themes'
import { STYLES } from '@/visual/styles'
import { performerOf, standardLook } from './cast'
import { completion, formsFor, isReleased, isUnlocked, nextForm, personalOf, unlockText, wearing, type Personal, type Standing } from './personal'
import { STANDARD_THEME, THEME_IDS, THEMES, UNIVERSE_IDS, UNIVERSES } from './themes'
import { VOICE_KEYS, linesOf, say } from './voice'

const none: Standing = { aura: 0, skills: 0, verified: 0 }
const css = readFileSync(resolve(__dirname, '../styles/index.css'), 'utf8')

describe('the four themes', () => {
  it('are four, on three universes, and the original is the standard for assessments', () => {
    expect(THEME_IDS).toEqual(['dark', 'light', 'power', 'iron'])
    expect(THEMES.dark.universe).toBe('aura')
    expect(THEMES.light.universe).toBe('aura')
    expect(STANDARD_THEME).toBe('dark')
  })

  it('each has its own block of tokens in the stylesheet', () => {
    for (const id of THEME_IDS) expect(css, id).toContain(`[data-theme='${id}']`)
    for (const id of ['power', 'iron']) {
      const block = css.slice(css.indexOf(`[data-theme='${id}'] {`))
      for (const token of ['--bg:', '--text:', '--accent:', '--display:', '--r-card:', '--stage:']) expect(block.slice(0, block.indexOf('}')), `${id} ${token}`).toContain(token)
    }
  })

  it('every form is drawn by an Aura theme that exists, and belongs to its universe', () => {
    for (const u of UNIVERSE_IDS) {
      const { list, finishes } = UNIVERSES[u]
      expect(list.length).toBeGreaterThanOrEqual(5)
      expect(list[0].unlock.kind, `${u} starts with a form everyone has`).toBe('start')
      expect(new Set(list.map((f) => f.id)).size).toBe(list.length)
      for (const f of list) {
        const aura = themeById[f.aura]
        expect(aura, `${u}/${f.id}`).toBeDefined()
        expect(aura.universe ?? 'aura', `${u}/${f.id}`).toBe(u)
      }
      expect(finishes.length).toBe(3)
      expect(STYLES[u].universe).toBe(u)
    }
  })

  it('every universe draws its character differently', () => {
    expect(STYLES.aura.shading).toBe('studio')
    expect(STYLES.power.shading).toBe('cel')
    expect(STYLES.iron.shading).toBe('ink')
    expect(new Set(UNIVERSE_IDS.map((u) => STYLES[u].build)).size).toBe(3)
  })
})

describe('unlocking forms', () => {
  it('reads only what the athlete has shown', () => {
    expect(isUnlocked({ kind: 'start' }, none)).toBe(true)
    expect(isUnlocked({ kind: 'class', index: 1 }, { ...none, aura: AURA_CLASSES[1].min - 1 })).toBe(false)
    expect(isUnlocked({ kind: 'class', index: 1 }, { ...none, aura: AURA_CLASSES[1].min })).toBe(true)
    expect(isUnlocked({ kind: 'skills', count: 3 }, { ...none, skills: 2 })).toBe(false)
    expect(isUnlocked({ kind: 'verified', count: 1 }, { ...none, skills: 9 })).toBe(false)
    expect(isUnlocked({ kind: 'verified', count: 1 }, { ...none, verified: 1 })).toBe(true)
  })

  it('says what it takes in words', () => {
    expect(unlockText({ kind: 'class', index: 1 })).toBe('Reach Ember · 1,500 Aura')
    expect(unlockText({ kind: 'skills', count: 3 })).toBe('Master 3 skills')
  })

  it('a beginner has the first form of each universe and a next one to earn', () => {
    for (const u of UNIVERSE_IDS) {
      const forms = formsFor(u, none)
      expect(forms.filter((f) => f.unlocked).map((f) => f.form.id)).toEqual([UNIVERSES[u].list[0].id])
      expect(nextForm(u, none)?.id).toBe(UNIVERSES[u].list[1].id)
    }
  })
})

describe('what an athlete wears', () => {
  const chosen: Personal = { theme: 'power', character: 'female', forms: { power: 'overdrive', aura: 'solar' }, finishes: { power: 'dusk' }, intensity: 80, muscles: true, steps: {} }

  it('falls back to the original theme until an administrator releases the universe', () => {
    expect(isReleased('light', {}, false)).toBe(true)
    expect(isReleased('power', {}, false)).toBe(false)
    expect(wearing(chosen, none, {}).theme).toBe('dark')
    expect(wearing(chosen, none, {}).universe).toBe('aura')
    expect(wearing(chosen, none, { power: true }).theme).toBe('power')
    expect(wearing(chosen, none, {}, true).theme).toBe('power')
  })

  it('wears the first form until the chosen one is earned, and keeps the choice', () => {
    const before = wearing(chosen, none, { power: true })
    expect(before.form.id).toBe('ignition')
    expect(before.finish.id).toBe('dusk')
    expect(before.character).toBe('female')
    const after = wearing(chosen, { aura: AURA_CLASSES[3].min, skills: 10, verified: 0 }, { power: true })
    expect(after.form.id).toBe('overdrive')
    expect(after.intensity).toBe(0.8)
  })

  it('defaults sensibly for an athlete who has chosen nothing', () => {
    const w = wearing(personalOf({}), none)
    expect([w.theme, w.universe, w.character, w.form.id, w.finish.id]).toEqual(['dark', 'aura', 'male', 'cosmic', 'pearl'])
  })

  it('an official assessment always shows the Aura master character under the Cosmic Aura', () => {
    const spec = performerOf(standardLook('female'), { motion: 'pushup', muscles: 'exercise' })
    expect(spec.style?.universe).toBe('aura')
    expect(spec.aura.theme).toBe('cosmic')
    expect(spec.character).toBe('female')
  })
})

describe('completion', () => {
  it('theme and character are the core; the rest is optional', () => {
    expect(completion({}).core).toBe(false)
    const core = completion({ style: { ...personalOf({}), character: 'male', steps: { theme: 'x', character: 'x' } } })
    expect([core.core, core.all, core.count]).toEqual([true, false, 2])
    const all = completion({ style: { ...personalOf({}), character: 'male', steps: { theme: 'x', character: 'x', about: 'x', sharing: 'x' } } })
    expect(all.all).toBe(true)
  })
})

describe('voice', () => {
  it('has a line for every key in every voice, with the same facts in each', () => {
    for (const key of VOICE_KEYS) {
      const holes = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join()
      const want = holes(linesOf(key, 'aura')[0])
      for (const voice of ['aura', 'power', 'iron'] as const) for (const line of linesOf(key, voice)) {
        expect(line.length, `${key}/${voice}`).toBeGreaterThan(0)
        expect(holes(line), `${key}/${voice}`).toBe(want)
      }
    }
  })

  it('fills in the facts', () => {
    expect(say('iron', 'home.toNext', { n: '1,200', label: 'Ember' })).toBe('1,200 short of Ember.')
    expect(say('aura', 'celebrate.eyebrow', { band: 'Advanced' })).toBe('Skill unlocked · Advanced')
  })
})

describe('personal style in the database', () => {
  const uid = '00000000-0000-4000-8000-000000000001'
  const athlete = (over: Partial<Athlete> = {}): Athlete => ({ id: uid, name: 'Ana', handle: 'ana', bio: '', roles: ['athlete'], goals: [], joinedAt: '2026-01-01T00:00:00.000Z', weeklyTarget: 3, equipment: [], environments: [], openToTrain: false, ...over })
  const world = (a: Athlete) => ({ athletes: { [uid]: a }, evidence: [], logs: [], courses: [], enrollments: [], feedback: [], following: [], assessments: [], participants: [] })

  it('goes out as flat columns and comes back the same', () => {
    const style: Personal = { theme: 'iron', character: 'female', forms: { iron: 'forged', aura: 'lunar' }, finishes: { iron: 'bronze' }, intensity: 85, muscles: false, steps: { theme: '2026-11-17T10:00:00.000Z', character: '2026-11-17T10:01:00.000Z' } }
    const mine = world(athlete({ style, country: 'Portugal', interests: ['handstand', 'pull'], discoverable: false, privacy: { ratings: 'following', style: 'me' } }))
    const rows = project(mine, uid)
    const row = rows.athlete_identity.get(uid)!
    expect(row).toMatchObject({ theme: 'iron', persona: 'female', form_iron: 'forged', form_aura: 'lunar', form_power: null, finish_iron: 'bronze', intensity: 85, show_muscles: false, country: 'Portugal', interests: ['handstand', 'pull'], ratings_audience: 'following', style_audience: 'me', interests_audience: 'everyone' })
    expect(rows.profiles.get(uid)!.is_public).toBe(false)
    const back = build(rows, uid, world(athlete())).athletes[uid]
    expect(back.style).toEqual(style)
    expect(back.country).toBe('Portugal')
    expect(back.interests).toEqual(['handstand', 'pull'])
    expect(back.discoverable).toBe(false)
    expect(back.privacy).toMatchObject({ ratings: 'following', style: 'me', interests: 'everyone' })
  })

  it('an athlete who chose nothing is sent the defaults, and stays as they were', () => {
    const mine = world(athlete())
    const rows = project(mine, uid)
    expect(rows.athlete_identity.get(uid)).toMatchObject({ theme: 'dark', persona: null, intensity: 60, show_muscles: true, ratings_audience: 'everyone' })
    expect(rows.profiles.get(uid)!.is_public).toBe(true)
    expect(build(rows, uid, mine).athletes[uid]).toBe(mine.athletes[uid])
  })
})
