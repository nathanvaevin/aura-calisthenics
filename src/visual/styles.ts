/**
 * How each universe draws its character and lights its stage.
 *
 * Plain data, like the Aura themes: nothing here knows about a movement or
 * an exercise. The body (`build`) is a file of its own per universe, standing
 * on the shared skeleton, so one movement plays on every one of them.
 */
import type { BuildId } from './body/skeleton'
import type { UniverseId } from '@/theme/themes'

export interface StageLook {
  backdrop: string
  /** The main light: colour, strength and where it stands relative to the subject. */
  key: { colour: string; power: number; from: [number, number, number] }
  rims: [{ colour: string; power: number }, { colour: string; power: number }]
  /** Soft light from above and below. */
  fill: { sky: string; ground: string; power: number }
  /** How much of the room the body mirrors. */
  room: number
  exposure: number
  /** The pool of light on the floor, and how dark the shadow in it is. */
  floor: { colour: string; shadow: number }
}

export interface CharacterStyle {
  universe: UniverseId
  build: BuildId
  /**
   * studio: modelled by light, like stone · cel: flat colour in two tones,
   * as drawn animation is · ink: three hard tones with hatching and the
   * muscle lines drawn in, as in manga.
   */
  shading: 'studio' | 'cel' | 'ink'
  /** Width of the drawn outline in metres. Zero: none. */
  outline: number
  outlineColour: string
  cloth: string
  roughness: number
  metalness: number
  /** The quiet light on the body's edge in the base state. */
  rim: number
  /** Hair takes the colour of the Aura as it rises. */
  hairGlow: boolean
  /** How far the top of the head (hair included) stands above the head joint, as a share of body scale: what the camera leaves room for. */
  headroom: number
  stage: StageLook
}

export const STYLES: Record<UniverseId, CharacterStyle> = {
  aura: {
    universe: 'aura', build: 'aura', shading: 'studio', outline: 0, outlineColour: '#000000',
    cloth: '#121216', roughness: 0.4, metalness: 0.32, rim: 0.22, hairGlow: false, headroom: 0.22,
    stage: {
      backdrop: '#08090d',
      key: { colour: '#ffffff', power: 2.1, from: [1.6, 4.2, 3.2] },
      rims: [{ colour: '#b9c8ff', power: 1.5 }, { colour: '#d9ccff', power: 1.2 }],
      fill: { sky: '#dfe6ff', ground: '#14141c', power: 0.35 },
      room: 0.42, exposure: 1.05,
      floor: { colour: '#9ea8d9', shadow: 0.42 },
    },
  },
  power: {
    universe: 'power', build: 'power', shading: 'cel', outline: 0.0042, outlineColour: '#0b0820',
    cloth: '#1b1836', roughness: 1, metalness: 0, rim: 0.5, hairGlow: true, headroom: 0.33,
    stage: {
      backdrop: '#060518',
      key: { colour: '#fff6e8', power: 2.4, from: [1.9, 4.0, 3.0] },
      rims: [{ colour: '#56c8ff', power: 1.6 }, { colour: '#ff6bd6', power: 1.3 }],
      fill: { sky: '#cfd2ff', ground: '#1a1440', power: 0.5 },
      room: 0, exposure: 1.0,
      floor: { colour: '#7f7bff', shadow: 0.5 },
    },
  },
  iron: {
    universe: 'iron', build: 'iron', shading: 'ink', outline: 0.0034, outlineColour: '#050403',
    cloth: '#100e0c', roughness: 1, metalness: 0, rim: 0.12, hairGlow: false, headroom: 0.22,
    stage: {
      backdrop: '#090807',
      key: { colour: '#fff1e2', power: 3.0, from: [2.7, 4.6, 1.5] },
      rims: [{ colour: '#ff5a3c', power: 0.9 }, { colour: '#e9e2d6', power: 0.35 }],
      fill: { sky: '#e9e2d6', ground: '#120c08', power: 0.14 },
      room: 0, exposure: 1.0,
      floor: { colour: '#b9a48e', shadow: 0.62 },
    },
  },
}

/** What the athlete chose about the look: which universe, and the colours of its finish. */
export interface PerformerStyle { universe: UniverseId; skin?: string; hair?: string; accent?: string }
