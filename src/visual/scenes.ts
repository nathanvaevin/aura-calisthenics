/**
 * The places a character can stand in: what is behind it and how the place
 * lights it. Plain data, like the Aura themes: safe to import anywhere.
 *
 * A scene is painted live by one shader (`backdrop.ts`), from rules and
 * noise: no picture is loaded, and none of the pictures the owner gave as a
 * direction is in the app. Each belongs to the stages it suits. A stage is
 * what a theme shows its character on: the dark studio of the Aura themes,
 * the storm of Goku, the paper of Goku Light, the black room of Baki.
 *
 * Every stage also has its own plain look (no scene), and that is what
 * anyone has until they choose otherwise, and what an official assessment
 * always shows.
 */
import type { StageLook } from './styles'

export type StageKey = 'aura' | 'power' | 'power-light' | 'iron'
export const stageKeyOf = (universe: 'aura' | 'power' | 'iron', variant?: string): StageKey => (universe === 'power' && variant === 'light' ? 'power-light' : universe)

/** What each stage calls having no scene at all. */
export const PLAIN: Record<StageKey, { name: string; line: string; swatch: [string, string] }> = {
  aura: { name: 'Studio', line: 'Dark and still. Nothing but you.', swatch: ['#161824', '#08090d'] },
  power: { name: 'Burning sun', line: 'Fire at your back.', swatch: ['#ff7d1f', '#06080c'] },
  'power-light': { name: 'Red sun', line: 'A red sun on paper.', swatch: ['#e4502e', '#e9e7e2'] },
  iron: { name: 'Black room', line: 'One hard light.', swatch: ['#3a2a20', '#090807'] },
}

export interface SceneDef {
  id: string
  name: string
  line: string
  /** Which painting the shader does (`uScene` in backdrop.ts). */
  paint: number
  /** The stages it is offered on, and how bright it is painted on each (a dark stage wants its evening). */
  on: Partial<Record<StageKey, number>>
  /** Two colours that stand for it on a button. */
  swatch: [string, string]
  /** What it changes about the stage's light. The stage's own look is kept for the rest. */
  look: Partial<Pick<StageLook, 'backdrop' | 'key' | 'rims' | 'fill' | 'room' | 'exposure' | 'floor'>>
  /** The stage keeps what burns or hangs behind the subject (the red sun on paper). */
  keepSun?: boolean
}

export const SCENES: SceneDef[] = [
  {
    id: 'dojo', name: 'Dojo', line: 'A wooden hall at the end of the day. Sun through the screens, dust in the light.',
    paint: 1, on: { aura: 0.82, iron: 0.8, power: 0.95 }, swatch: ['#f2b071', '#4a2416'],
    look: {
      backdrop: '#1a0e09',
      key: { colour: '#ffd9a8', power: 2.3, from: [3.4, 3.4, 1.6] },
      rims: [{ colour: '#ffb066', power: 1.7 }, { colour: '#ffd9b8', power: 0.9 }],
      fill: { sky: '#ffe2c2', ground: '#3a1c10', power: 0.42 },
      floor: { colour: '#ffb777', shadow: 0.5, wash: 1.3 },
    },
  },
  {
    id: 'hall', name: 'Hall at dusk', line: 'An empty sports hall. The last light lies long across the floor.',
    paint: 2, on: { aura: 0.9, iron: 0.9 }, swatch: ['#f08a5a', '#161a26'],
    look: {
      backdrop: '#0b0d14',
      key: { colour: '#dfe6ff', power: 1.7, from: [1.8, 4.2, 3.0] },
      rims: [{ colour: '#ff9a5c', power: 2.2 }, { colour: '#ffc79a', power: 1.5 }],
      fill: { sky: '#aab6d8', ground: '#1a1210', power: 0.3 },
      floor: { colour: '#ff9a5c', shadow: 0.5, wash: 1.2 },
    },
  },
  {
    id: 'meadow', name: 'Mountain meadow', line: 'Open grass under a mountain. Clouds going over, seeds on the wind.',
    paint: 3, on: { power: 0.92, aura: 0.6 }, swatch: ['#6fc04a', '#5aa0e8'],
    look: {
      backdrop: '#1c3a2a',
      key: { colour: '#fff6dc', power: 2.5, from: [2.4, 4.6, 2.2] },
      rims: [{ colour: '#cfe6ff', power: 1.3 }, { colour: '#eaffd6', power: 0.9 }],
      fill: { sky: '#cfe4ff', ground: '#3f7a35', power: 0.6 },
      floor: { colour: '#dfffc0', shadow: 0.4, wash: 0.5 },
    },
  },
  {
    id: 'blossom', name: 'Blossom garden', line: 'Dusk under the cherry trees. Lanterns lit, petals coming down.',
    paint: 4, on: { aura: 0.85, power: 0.95 }, swatch: ['#f5b6c8', '#274036'],
    look: {
      backdrop: '#101c1a',
      key: { colour: '#ffe6d6', power: 1.9, from: [1.8, 4.2, 3.0] },
      rims: [{ colour: '#ffa85c', power: 1.6 }, { colour: '#ffc4d8', power: 1.3 }],
      fill: { sky: '#f2c4d2', ground: '#1c2e22', power: 0.4 },
      floor: { colour: '#ffb880', shadow: 0.46, wash: 1.2 },
    },
  },
  {
    id: 'ember', name: 'Ember sky', line: 'A sky on fire over a dark field. Sparks going up.',
    paint: 5, on: { power: 1, aura: 0.8, iron: 0.75 }, swatch: ['#ff7a3c', '#2a1238'],
    look: {
      backdrop: '#160a12',
      key: { colour: '#ffe9d2', power: 1.8, from: [2.0, 3.8, 2.8] },
      rims: [{ colour: '#ff7a2a', power: 2.6 }, { colour: '#ffb060', power: 1.7 }],
      fill: { sky: '#ffb48a', ground: '#1a0c14', power: 0.34 },
      floor: { colour: '#ff8a40', shadow: 0.52, wash: 1.4 },
    },
  },
  {
    id: 'storm', name: 'Storm night', line: 'A night full of stars. Far off, lightning in the cloud.',
    paint: 6, on: { power: 1, aura: 1, iron: 0.85 }, swatch: ['#5aa2ff', '#0a1238'],
    look: {
      backdrop: '#060a1c',
      key: { colour: '#e6eeff', power: 1.9, from: [1.8, 4.2, 3.0] },
      rims: [{ colour: '#5aa2ff', power: 2.2 }, { colour: '#b8a6ff', power: 1.4 }],
      fill: { sky: '#8fa6e8', ground: '#0a0e20', power: 0.34 },
      floor: { colour: '#6fa8ff', shadow: 0.5, wash: 1.2 },
    },
  },
  {
    id: 'ink', name: 'Ink mountains', line: 'Mountains in grey wash, mist between them, a few red petals.',
    paint: 7, on: { 'power-light': 1 }, swatch: ['#8c8c8e', '#e9e7e2'], keepSun: true,
    look: {},
  },
]

export const sceneById = (id: string | null | undefined) => (id ? SCENES.find((s) => s.id === id) : undefined)

/** The scenes a stage can be given, in the order they are offered. */
export const scenesOn = (stage: StageKey) => SCENES.filter((s) => s.on[stage] !== undefined)

/** How a stage is lit with a scene on it: the scene's light over the stage's own. */
export function sceneLook(base: StageLook, scene: SceneDef | undefined): StageLook {
  if (!scene) return base
  return { ...base, ...scene.look, sun: scene.keepSun ? base.sun : undefined }
}

/** Which scenes the owner has released to athletes (Studio → Characters). Nothing is, until switched on. */
export type ReleasedScenes = Partial<Record<string, boolean>>

/**
 * The scene a stage shows for someone: the one they chose, if the stage has
 * it and it has been released to them. Anything else is the stage's plain look.
 */
export function sceneFor(stage: StageKey, chosen: string | null | undefined, released: ReleasedScenes, admin: boolean): string | undefined {
  const scene = sceneById(chosen)
  if (!scene || scene.on[stage] === undefined) return undefined
  return admin || released[scene.id] ? scene.id : undefined
}
