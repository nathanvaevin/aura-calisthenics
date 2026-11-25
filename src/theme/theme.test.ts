import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Athlete } from '@/domain/types'
import { AURA_CLASSES } from '@/domain/scoring/config'
import { build, project } from '@/data/cloud/mappers'
import { themeById } from '@/visual/aura/themes'
import { STYLES, styleOf } from '@/visual/styles'
import { performerOf, standardLook } from './cast'
import { completion, formsFor, isReleased, isUnlocked, nextForm, personalOf, unlockText, wearing, type Personal, type Standing } from './personal'
import { STANDARD_THEME, THEME_IDS, THEMES, UNIVERSE_IDS, UNIVERSES, posterOf } from './themes'
import { DEFAULT_TONE, TONES, toneAttr } from './tones'
import { VOICE_KEYS, linesOf, say } from './voice'

const none: Standing = { aura: 0, skills: 0, verified: 0 }
const css = readFileSync(resolve(__dirname, '../styles/index.css'), 'utf8')

describe('the colour of the Aura themes', () => {
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
  const base = (scheme: string) => css.slice(css.indexOf(scheme === 'dark' ? ":root,\n[data-theme='dark'] {" : "[data-theme='light'] {\n  color-scheme"))
  const block = (scheme: 'dark' | 'light', tone: string) => {
    const from = tone === DEFAULT_TONE ? base(scheme) : css.slice(css.indexOf(`[data-theme='${scheme}'][data-tone='${tone}']`))
    return from.slice(0, from.indexOf('}'))
  }
  const token = (text: string, name: string) => text.match(new RegExp(`${name}: ([^;]+);`))![1]

  it('can be four, each readable on both Aura themes, and the swatch is the colour itself', () => {
    expect(TONES.map((t) => t.name)).toEqual(['Sun', 'Champagne', 'Moonlight', 'Aurora'])
    for (const scheme of ['dark', 'light'] as const) for (const t of TONES) {
      const b = block(scheme, t.id), accent = token(b, '--accent'), ink = token(b, '--accent-ink'), fill = token(b, '--accent-fill'), bg = token(base(scheme), '--bg')
      expect(fill, `${scheme} ${t.id}`).toBe(t[scheme])
      expect(contrast(accent, bg), `${scheme} ${t.id} on the page`).toBeGreaterThan(4.5)
      for (const stop of fill.match(/#[0-9a-f]{6}/g)!) expect(contrast(ink, stop), `${scheme} ${t.id} on ${stop}`).toBeGreaterThan(4.3)
      expect(contrast(ink, accent), `${scheme} ${t.id} ink`).toBeGreaterThan(4.5)
    }
  })

  it('is worn only where someone chose another than the first, and never in an assessment', () => {
    expect(toneAttr(undefined, false)).toBeUndefined()
    expect(toneAttr('sun', false)).toBeUndefined()
    expect(toneAttr('aurora', false)).toBe('aurora')
    expect(toneAttr('aurora', true)).toBeUndefined()
    expect(toneAttr('no-such-colour', false)).toBeUndefined()
    // The other themes have one colour, their own.
    expect(/data-theme='(power|power-light|iron)'\]\[data-tone/.test(css)).toBe(false)
  })
})

describe('the five themes', () => {
  it('are five, on three universes, and the original is the standard for assessments', () => {
    expect(THEME_IDS).toEqual(['dark', 'power', 'iron', 'light', 'power-light'])
    expect(THEME_IDS.map((id) => THEMES[id].name)).toEqual(['Aura Dark Mode', 'Goku Dark Mode', 'Baki Mode', 'Aura Light Mode', 'Goku Light Mode'])
    expect(THEMES['power-light'].universe).toBe('power')
    expect(THEMES.dark.universe).toBe('aura')
    expect(THEMES.light.universe).toBe('aura')
    expect(STANDARD_THEME).toBe('dark')
  })

  it('each has its own block of tokens in the stylesheet', () => {
    for (const id of THEME_IDS) expect(css, id).toContain(`[data-theme='${id}']`)
    for (const id of ['power', 'power-light', 'iron']) {
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

  it('a second theme on a universe shows the same character another way, and has its own picture', () => {
    const dark = performerOf({ ...standardLook('male'), universe: 'power', theme: 'power' }).style!
    const light = performerOf({ ...standardLook('male'), universe: 'power', theme: 'power-light' }).style!
    expect(styleOf(dark).build).toBe(styleOf(light).build)
    expect(styleOf(dark).stage.paint ?? false).toBe(false)
    expect(styleOf(light).stage.paint).toBe(true)
    expect(styleOf(light).shading).toBe('cel')
    // The original universe has one stage for both of its themes: an Aura is light and needs the dark.
    expect(styleOf(performerOf({ ...standardLook('male'), theme: 'light' }).style)).toBe(STYLES.aura)
    expect(posterOf('power', 'male')).toBe('themes/power-male.jpg')
    expect(posterOf('power-light', 'female')).toBe('themes/power-light-female.jpg')
    expect(posterOf('light', 'male')).toBe('themes/aura-male.jpg')
    for (const id of THEME_IDS) for (const c of ['male', 'female'] as const) expect(existsSync(resolve(__dirname, '../../public', posterOf(id, c))), posterOf(id, c)).toBe(true)
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

  it('is whichever theme was chosen; the original one while an administrator has its universe switched off', () => {
    expect(isReleased('light', {}, false)).toBe(true)
    for (const id of THEME_IDS) expect(isReleased(id, {}, false), id).toBe(true)
    expect(wearing(chosen, none, {}).theme).toBe('power')
    const off = { power: false }
    expect(isReleased('power', off, false)).toBe(false)
    expect(isReleased('power-light', off, false)).toBe(false)
    expect(isReleased('iron', off, false)).toBe(true)
    expect(wearing(chosen, none, off).theme).toBe('dark')
    expect(wearing(chosen, none, off).universe).toBe('aura')
    expect(wearing(chosen, none, off, true).theme).toBe('power')
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
    expect([w.theme, w.universe, w.character, w.form.id, w.finish.id]).toEqual(['dark', 'aura', 'male', 'cosmic', 'graphite'])
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
    expect(rows.athlete_identity.get(uid)).toMatchObject({ theme: 'dark', persona: null, intensity: 10, show_muscles: true, ratings_audience: 'everyone' })
    expect(rows.profiles.get(uid)!.is_public).toBe(true)
    expect(build(rows, uid, mine).athletes[uid]).toBe(mine.athletes[uid])
  })
})
