import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { standardLook, performerOf } from '@/theme/cast'
import { DEFAULT_PERSONAL, wearing } from '@/theme/personal'
import { THEMES, THEME_IDS, UNIVERSES } from '@/theme/themes'
import { PLAIN, SCENES, sceneById, sceneFor, sceneLook, scenesOn, stageKeyOf, type StageKey } from './scenes'
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

  it('every stage has its signature place, offered first; the Aura has two, one inside and one outside', () => {
    for (const stage of STAGES) {
      const list = scenesOn(stage)
      const own = list.filter((s) => s.signature).map((s) => s.id)
      expect(own, stage).toEqual({ aura: ['inside', 'outside'], power: ['ring'], 'power-light': ['ring-ink'], iron: ['pit'] }[stage])
      expect(list.slice(0, own.length).map((s) => s.id), stage).toEqual(own)
      // Made for that one character: not offered on another's stage.
      for (const s of list) if (s.signature) expect(Object.keys(s.on)).toEqual([stage])
    }
  })

  it('has a painting for every place it lists', () => {
    const source = ['backdrop.ts', 'signature.ts'].map((f) => readFileSync(resolve(__dirname, f), 'utf8')).join('\n')
    for (const s of SCENES) expect(new RegExp(`SCENE == ${s.paint}\\b`).test(source), s.id).toBe(true)
  })

  it('lends the stage its light, and takes away what burned behind the subject', () => {
    const own = STYLES.power.stage
    const lit = sceneLook(own, sceneById('storm'))
    expect(lit.sun).toBeUndefined()
    expect(lit.key.colour).not.toBe(own.key.colour)
    expect(sceneLook(own, undefined)).toBe(own)
  })

  it('reaches an athlete only once the owner has released it', () => {
    expect(sceneFor('aura', 'dojo', {}, false)).toBeUndefined()
    expect(sceneFor('aura', 'dojo', { dojo: true }, false)).toBe('dojo')
    expect(sceneFor('aura', 'dojo', { dojo: false }, false)).toBeUndefined()
    // The owner sees every one, to look at it before releasing it.
    expect(sceneFor('aura', 'dojo', {}, true)).toBe('dojo')
  })

  it('is not shown on a stage it was not made for, or when nothing is chosen', () => {
    expect(sceneFor('power-light', 'storm', { storm: true }, true)).toBeUndefined()
    expect(sceneFor('aura', 'ink', { ink: true }, true)).toBeUndefined()
    expect(sceneFor('aura', undefined, { dojo: true }, true)).toBeUndefined()
    expect(sceneFor('aura', 'no-such-place', {}, true)).toBeUndefined()
  })

  it('is never part of an official assessment, nor of a look nobody chose it for', () => {
    expect(standardLook('female').scene).toBeUndefined()
    expect(performerOf(standardLook('male')).style?.scene).toBeUndefined()
    expect(wearing(DEFAULT_PERSONAL, { aura: 0, skills: 0, verified: 0 }).scene).toBeUndefined()
    const look = { universe: 'aura' as const, character: 'male' as const, form: UNIVERSES.aura.list[0], finish: UNIVERSES.aura.finishes[0], intensity: 0.5, scene: 'dojo' }
    expect(performerOf(look).style?.scene).toBe('dojo')
  })
})
