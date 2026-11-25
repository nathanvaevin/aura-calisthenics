import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { standardLook, performerOf } from '@/theme/cast'
import { DEFAULT_PERSONAL, wearing } from '@/theme/personal'
import { THEMES, THEME_IDS, UNIVERSES } from '@/theme/themes'
import { DEFAULT_SCENE, PLAIN, PLAIN_CHOICE, SCENES, isSceneReleased, officialScene, sceneById, sceneFor, sceneLook, scenesOn, stageKeyOf, type StageKey } from './scenes'
import { STYLES, styleOf } from './styles'

const STAGES: StageKey[] = ['aura', 'power', 'power-light', 'iron']

describe('the places a character can stand in', () => {
  it('each has a name, a sentence, a painting of its own and at least one stage', () => {
    expect(new Set(SCENES.map((s) => s.id)).size).toBe(SCENES.length)
    expect(new Set(SCENES.map((s) => s.paint)).size).toBe(SCENES.length)
    for (const s of SCENES) {
      expect(s.paint, s.id).toBeGreaterThan(0)
      expect(s.name.length, s.id).toBeGreaterThan(2)
      expect(s.line.endsWith('.'), s.id).toBe(true)
      expect(Object.keys(s.on).length, s.id).toBeGreaterThan(0)
      for (const dim of Object.values(s.on)) { expect(dim).toBeGreaterThan(0.4); expect(dim).toBeLessThanOrEqual(1) }
    }
  })

  it('every theme has a stage, every stage a plain look and something to choose', () => {
    for (const id of THEME_IDS) expect(STAGES).toContain(stageKeyOf(THEMES[id].universe, THEMES[id].variant))
    for (const stage of STAGES) {
      expect(PLAIN[stage].name.length).toBeGreaterThan(2)
      expect(scenesOn(stage).length, stage).toBeGreaterThan(0)
    }
    // The two Aura themes share a stage, and so a choice.
    expect(stageKeyOf(THEMES.light.universe, THEMES.light.variant)).toBe('aura')
  })

  it('paper is only given what is drawn for paper: nothing dark, and its red sun stays', () => {
    for (const s of scenesOn('power-light')) {
      expect(s.look.backdrop, s.id).toBeUndefined()
      expect(s.keepSun, s.id).toBe(true)
    }
    const paper = styleOf({ universe: 'power', variant: 'light' }).stage
    expect(sceneLook(paper, sceneById('ink')).paint).toBe(true)
    expect(sceneLook(paper, sceneById('ink')).sun).toEqual(paper.sun)
  })

  it('every stage has its signature place, offered first; the Aura has two, one outside and one inside', () => {
    for (const stage of STAGES) {
      const list = scenesOn(stage)
      const own = list.filter((s) => s.signature).map((s) => s.id)
      expect(own, stage).toEqual({ aura: ['outside', 'inside'], power: ['ring'], 'power-light': ['ring-ink'], iron: ['pit'] }[stage])
      expect(list.slice(0, own.length).map((s) => s.id), stage).toEqual(own)
      // Made for that one character: not offered on another's stage.
      for (const s of list) if (s.signature) expect(Object.keys(s.on)).toEqual([stage])
    }
  })

  it('has a painting for every place it lists', () => {
    const source = ['backdrop.ts', 'signature.ts'].map((f) => readFileSync(resolve(__dirname, f), 'utf8')).join('\n')
    for (const s of SCENES) expect(new RegExp(`SCENE == ${s.paint}\\b`).test(source), s.id).toBe(true)
  })

  it('names no function of its own after one the language has: that painting would not compile, and stay black', () => {
    const source = ['backdrop.ts', 'signature.ts'].map((f) => readFileSync(resolve(__dirname, f), 'utf8')).join('\n')
    const own = [...source.matchAll(/^\s*(?:float|vec[234]|mat[234]|bool|int|void)\s+(\w+)\s*\(/gm)].map((m) => m[1])
    expect(own.length).toBeGreaterThan(10)
    const taken = 'sign abs floor ceil fract mod min max clamp mix step smoothstep length distance dot cross normalize reflect refract sin cos tan asin acos atan pow exp log exp2 log2 sqrt inversesqrt round trunc transpose inverse texture any all not equal dFdx dFdy fwidth radians degrees'.split(' ')
    expect(own.filter((n) => taken.includes(n))).toEqual([])
  })

  it('lends the stage its light, and takes away what burned behind the subject', () => {
    const own = STYLES.power.stage
    const lit = sceneLook(own, sceneById('storm'))
    expect(lit.sun).toBeUndefined()
    expect(lit.key.colour).not.toBe(own.key.colour)
    expect(sceneLook(own, undefined)).toBe(own)
  })

  it('is with athletes unless the owner has switched it off, and then only the owner sees it', () => {
    for (const p of SCENES) expect(isSceneReleased(p.id, {}), p.id).toBe(true)
    expect(sceneFor('power', 'meadow', {}, false)).toBe('meadow')
    expect(sceneFor('power', 'meadow', { meadow: false }, false)).toBe('ring')
    expect(sceneFor('power', 'meadow', { meadow: false }, true)).toBe('meadow')
  })

  it('is the signature place for everyone who has not chosen, until the owner switches that off', () => {
    expect(DEFAULT_SCENE).toEqual({ aura: 'outside', power: 'ring', 'power-light': 'ring-ink', iron: 'pit' })
    for (const stage of STAGES) expect(sceneById(DEFAULT_SCENE[stage])?.on[stage], stage).toBeDefined()
    expect(sceneFor('aura', undefined, {}, false)).toBe('outside')
    expect(sceneFor('aura', null, {}, true)).toBe('outside')
    // A choice that cannot be shown falls back to the default, and is left alone.
    expect(sceneFor('aura', 'dojo', { dojo: false }, false)).toBe('outside')
    expect(sceneFor('aura', 'dojo', { dojo: true }, false)).toBe('dojo')
    // Withdrawn by the owner: the plain look, for athletes and for the owner.
    expect(sceneFor('aura', undefined, { outside: false }, false)).toBeUndefined()
    expect(sceneFor('aura', undefined, { outside: false }, true)).toBeUndefined()
    // Every other stage has its own, and each can be withdrawn alone.
    for (const stage of STAGES) {
      const id = DEFAULT_SCENE[stage]!
      expect(sceneFor(stage, undefined, {}, false), stage).toBe(id)
      expect(sceneFor(stage, undefined, { [id]: false }, false), stage).toBeUndefined()
    }
  })

  it('can be the plain look, chosen on purpose', () => {
    expect(sceneFor('aura', PLAIN_CHOICE, {}, false)).toBeUndefined()
    expect(SCENES.some((s) => s.id === PLAIN_CHOICE)).toBe(false)
  })

  it('is not shown on a stage it was not made for', () => {
    expect(sceneFor('power-light', 'storm', { storm: true }, true)).toBe('ring-ink')
    expect(sceneFor('iron', 'inside', {}, true)).toBe('pit')
    expect(sceneFor('iron', 'no-such-place', {}, true)).toBe('pit')
  })

  it('is the same for everyone in an official assessment, whatever they chose for themselves', () => {
    expect(officialScene({})).toBe('outside')
    expect(officialScene({ dojo: true, storm: true })).toBe('outside')
    expect(officialScene({ outside: false })).toBeUndefined()
    expect(performerOf(standardLook('male', officialScene({}))).style?.scene).toBe('outside')
    expect(performerOf(standardLook('male')).style?.scene).toBeUndefined()
    // What is worn says nothing of a place by itself: it is added where the choice is known.
    expect(wearing(DEFAULT_PERSONAL, { aura: 0, skills: 0, verified: 0 }).scene).toBeUndefined()
    const look = { universe: 'aura' as const, character: 'male' as const, form: UNIVERSES.aura.list[0], finish: UNIVERSES.aura.finishes[0], intensity: 0.5, scene: 'dojo' }
    expect(performerOf(look).style?.scene).toBe('dojo')
  })
})
