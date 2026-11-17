/**
 * An athlete's personal choices: theme, character, Aura form, appearance.
 *
 * These are presentation only. Nothing in this file is read by scoring, and
 * changing any of it leaves evidence, ratings, courses and assessments
 * exactly as they were.
 */
import type { Athlete } from '@/domain/types'
import { AURA_CLASSES } from '@/domain/scoring/config'
import { THEMES, UNIVERSES, formOf, finishOf, isThemeId, type Finish, type Form, type ThemeId, type UniverseId, type Unlock } from './themes'

export type CharacterId = 'male' | 'female'

export interface Personal {
  theme: ThemeId
  /** Unset until the athlete has chosen one. */
  character?: CharacterId
  /** The form worn in each universe, so switching theme and back keeps the choice. */
  forms: Partial<Record<UniverseId, string>>
  finishes: Partial<Record<UniverseId, string>>
  /** How much Aura the character carries, 0 to 100. */
  intensity: number
  /** Show the working muscles on demonstrations. */
  muscles: boolean
  /** When each step of personalization was last completed. */
  steps: Partial<Record<Step, string>>
}

export const STEPS = ['theme', 'character', 'about', 'sharing'] as const
export type Step = (typeof STEPS)[number]

export const DEFAULT_PERSONAL: Personal = { theme: 'dark', forms: {}, finishes: {}, intensity: 60, muscles: true, steps: {} }

export function personalOf(a: Pick<Athlete, 'style'> | null | undefined): Personal {
  const s = a?.style
  if (!s) return DEFAULT_PERSONAL
  return {
    ...DEFAULT_PERSONAL, ...s,
    theme: isThemeId(s.theme) ? s.theme : 'dark',
    intensity: Math.max(0, Math.min(100, Math.round(s.intensity ?? DEFAULT_PERSONAL.intensity))),
    forms: s.forms ?? {}, finishes: s.finishes ?? {}, steps: s.steps ?? {},
  }
}

// ── Unlocks ──────────────────────────────────────────────────────────────

/** The facts an unlock may read. All of them come from the scoring; none goes back in. */
export interface Standing { aura: number; skills: number; verified: number }

const classAt = (index: number) => AURA_CLASSES[Math.min(index, AURA_CLASSES.length - 1)]

export function isUnlocked(u: Unlock, s: Standing): boolean {
  switch (u.kind) {
    case 'start': return true
    case 'class': return s.aura >= classAt(u.index).min
    case 'skills': return s.skills >= u.count
    case 'verified': return s.verified >= u.count
  }
}

/** What it takes, in words. */
export function unlockText(u: Unlock): string {
  switch (u.kind) {
    case 'start': return 'Yours from the start'
    case 'class': return `Reach ${classAt(u.index).label} · ${classAt(u.index).min.toLocaleString('en')} Aura`
    case 'skills': return `Master ${u.count} skill${u.count === 1 ? '' : 's'}`
    case 'verified': return u.count === 1 ? 'Have a skill verified by a coach' : `Have ${u.count} skills verified by a coach`
  }
}

/** How far along, 0 to 1. */
export function unlockProgress(u: Unlock, s: Standing): number {
  const part = (have: number, need: number) => (need <= 0 ? 1 : Math.max(0, Math.min(1, have / need)))
  switch (u.kind) {
    case 'start': return 1
    case 'class': return part(s.aura, classAt(u.index).min)
    case 'skills': return part(s.skills, u.count)
    case 'verified': return part(s.verified, u.count)
  }
}

// ── What is actually worn ────────────────────────────────────────────────

/** Universes other than the original are released to athletes by an administrator. */
export type Released = Partial<Record<UniverseId, boolean>>

export const isReleased = (theme: ThemeId, released: Released, admin: boolean) =>
  THEMES[theme].universe === 'aura' || admin || !!released[THEMES[theme].universe]

export interface Wearing {
  theme: ThemeId
  universe: UniverseId
  character: CharacterId
  form: Form
  finish: Finish
  /** 0 to 1. */
  intensity: number
}

/**
 * The look an athlete has right now. A choice that is not available (a theme
 * not released yet, a form not earned) falls back to what is: the original
 * theme, the universe's first form. The stored choice is left alone, so it
 * comes into effect by itself once it is available.
 */
export function wearing(p: Personal, standing: Standing, released: Released = {}, admin = false): Wearing {
  const theme = isReleased(p.theme, released, admin) ? p.theme : 'dark'
  const universe = THEMES[theme].universe
  const chosen = formOf(universe, p.forms[universe])
  const form = admin || isUnlocked(chosen.unlock, standing) ? chosen : UNIVERSES[universe].list[0]
  return { theme, universe, character: p.character ?? 'male', form, finish: finishOf(universe, p.finishes[universe]), intensity: p.intensity / 100 }
}

/** The forms of a universe with what this athlete may do with each. */
export function formsFor(universe: UniverseId, standing: Standing, admin = false) {
  return UNIVERSES[universe].list.map((form) => ({
    form,
    unlocked: admin || isUnlocked(form.unlock, standing),
    progress: unlockProgress(form.unlock, standing),
    need: unlockText(form.unlock),
  }))
}

/** The next form still to earn in a universe, if any. */
export const nextForm = (universe: UniverseId, standing: Standing) =>
  UNIVERSES[universe].list.find((f) => !isUnlocked(f.unlock, standing)) ?? null

// ── Completion ───────────────────────────────────────────────────────────

export interface Completion {
  /** Core: theme and character. */
  theme: boolean
  character: boolean
  /** Optional: never required. */
  about: boolean
  sharing: boolean
  core: boolean
  all: boolean
  /** Steps done, of four. */
  count: number
}

export function completion(a: Pick<Athlete, 'style'>): Completion {
  const p = personalOf(a)
  const theme = !!p.steps.theme
  const character = !!p.steps.character && !!p.character
  const about = !!p.steps.about
  const sharing = !!p.steps.sharing
  return { theme, character, about, sharing, core: theme && character, all: theme && character && about && sharing, count: [theme, character, about, sharing].filter(Boolean).length }
}
