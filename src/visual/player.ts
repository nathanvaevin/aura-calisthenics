/**
 * Plays characters on a stage: the one place where a character, a movement,
 * the muscle layer and an Aura theme come together. Each performer carries
 * its own settings, so the same player shows a single exercise
 * demonstration, the two characters side by side, or one movement under
 * three themes for comparison.
 */
import { Color, Vector3 } from 'three'
import { exerciseById } from '@/domain/catalog'
import { AuraField } from './aura/field'
import { levelOf, type AuraMode } from './aura/director'
import { themeById, THEMES, type ThemeTuning } from './aura/themes'
import { activationOf, CHANNELS, SLOTS, slotOf, type Channel, type MuscleRoles } from './body/muscles'
import type { CharacterId } from './body/skeleton'
import { createActor, type Actor } from './character'
import { motionAt, type Motion } from './motions'
import { stand } from './motions/stand'
import { emptyPose, type Pose } from './rig'
import { buildProps } from './props'
import { ANGLE, Stage, type CameraAngle } from './stage'
import { STYLES, type PerformerStyle } from './styles'
import type { Group } from 'three'

export interface PerformerSpec {
  character: CharacterId
  /** The exercise to perform, or null to stand at ease. */
  motion: string | null
  /** A particular revision of the movement; the current one when left out. */
  revision?: number
  /** Muscles to light: those of the exercise performed, a given set of roles, or none. */
  muscles: 'exercise' | MuscleRoles | null
  /** Colour of the muscle layer. */
  glow?: string
  aura: { theme: string; mode: AuraMode; level?: number; tuning?: ThemeTuning }
  /** The universe the character is drawn in and the athlete's colours. Left out: the Aura master character. */
  style?: PerformerStyle
  /** Where across the stage, in metres, and which way it faces, in degrees. */
  x?: number
  facing?: number
}

export interface PlayerState {
  playing: boolean
  /** Seconds into the current set, and its length. */
  time: number
  length: number
  /** Repetitions completed in this set (or seconds held). */
  count: number
  phase: 'work' | 'settle'
  fps: number
}

interface Performer {
  spec: PerformerSpec
  actor: Actor
  field: AuraField
  motion: Motion | null
  pose: Pose
  base: Float32Array
  target: Float32Array
  lastPhase: number
  /** The equipment this performer is on. */
  props: Group | null
}

export const MUSCLE_COLOUR = '#ff2f8f'
const SETTLE = 2.8

/** How long a set is before its release. */
export function setLength(m: Motion | null): number {
  if (!m) return 9
  if (m.kind === 'reps') return m.period * 4
  if (m.kind === 'mobility') return m.period * 2
  return 9
}

export class Player {
  readonly stage: Stage
  onState?: (s: PlayerState) => void
  private cast: Performer[] = []
  private raf = 0
  private last = 0
  private playing = true
  private active = true
  private time = 0
  private settle = -1
  private speed = 1
  private generation = 0
  private frames = 0
  private fpsClock = 0
  private fps = 0
  private disposed = false
  /** A set ends in a release and starts again; otherwise the movement simply loops. */
  private sets = false

  constructor(canvas: HTMLCanvasElement) {
    this.stage = new Stage(canvas)
    this.raf = requestAnimationFrame(this.frame)
  }

  /** Puts these performers on stage, replacing whoever was there. */
  async setCast(specs: PerformerSpec[], opts: { keepView?: boolean } = {}) {
    const generation = ++this.generation
    const actors = await Promise.all(specs.map((s) => createActor(s.character, STYLES[s.style?.universe ?? 'aura'].build)))
    if (generation !== this.generation || this.disposed) { actors.forEach((a) => a.dispose()); return }
    for (const p of this.cast) { p.field.dispose(); p.actor.dispose(); p.props?.removeFromParent() }
    this.cast = specs.map((spec, i) => {
      const actor = actors[i]
      actor.group.position.x = spec.x ?? 0
      actor.group.rotation.y = ((spec.facing ?? 0) * Math.PI) / 180
      this.stage.add(actor.group)
      const field = new AuraField(actor)
      this.stage.add(field.group, field.world)
      const p: Performer = { spec, actor, field, motion: null, pose: emptyPose(), base: new Float32Array(SLOTS), target: new Float32Array(SLOTS), lastPhase: 0, props: null }
      this.apply(p, spec)
      // Each performer has their own equipment, sized to them.
      const props = p.motion?.props?.(actor.rig.body)
      if (props?.length) {
        p.props = buildProps(props)
        p.props.position.copy(actor.group.position)
        p.props.rotation.y = actor.group.rotation.y
        this.stage.add(p.props)
      }
      return p
    })
    this.stage.setLook(STYLES[specs[0]?.style?.universe ?? 'aura'].stage)
    this.sets = specs.some((s) => s.aura.mode === 'living')
    this.time = 0
    this.settle = -1
    if (!opts.keepView) this.reframe()
    this.pose(0)
  }

  /** Changes how the performers already on stage look, without reloading them. */
  update(specs: PerformerSpec[]) {
    if (specs.length !== this.cast.length || specs.some((s, i) => s.character !== this.cast[i].spec.character || (s.style?.universe ?? 'aura') !== (this.cast[i].spec.style?.universe ?? 'aura') || s.motion !== this.cast[i].spec.motion || s.revision !== this.cast[i].spec.revision || (s.x ?? 0) !== (this.cast[i].spec.x ?? 0) || (s.facing ?? 0) !== (this.cast[i].spec.facing ?? 0))) return void this.setCast(specs, { keepView: specs.length === this.cast.length })
    specs.forEach((s, i) => this.apply(this.cast[i], s))
    const sets = specs.some((s) => s.aura.mode === 'living')
    if (sets !== this.sets) { this.sets = sets; this.settle = -1 }
  }

  private apply(p: Performer, spec: PerformerSpec) {
    p.spec = spec
    p.motion = spec.motion ? motionAt(spec.motion, spec.revision) ?? null : null
    const ex = spec.motion ? exerciseById[spec.motion] : undefined
    p.base.fill(0)
    if (spec.muscles === 'exercise' && ex) p.base.set(activationOf(ex, p.motion?.detail))
    else if (spec.muscles && spec.muscles !== 'exercise') p.base.set(activationOf(spec.muscles))
    p.actor.setStyle(spec.style)
    const glow = new Color(spec.glow ?? MUSCLE_COLOUR)
    p.actor.look.glowA.value.copy(glow)
    p.actor.look.glowB.value.copy(glow).lerp(new Color(0xffffff), 0.72)
    const theme = themeById[spec.aura.theme] ?? THEMES[0]
    p.field.setTheme(theme, spec.aura.tuning)
    p.actor.look.hairGlow.value.set(theme.palette[0])
  }

  /** Frames everything the performers do over a whole cycle. */
  reframe(angle?: CameraAngle | number) {
    const lo = new Vector3(Infinity, Infinity, Infinity), hi = new Vector3(-Infinity, -Infinity, -Infinity)
    const q = new Vector3()
    for (const p of this.cast) {
      for (let i = 0; i < (p.motion ? 8 : 1); i++) {
        if (p.motion) p.motion.pose(i / 8, p.actor.rig, p.pose)
        else stand(p.actor.rig.body, p.pose, 0)
        p.actor.rig.solve(p.pose)
        const pos = p.actor.rig.pos
        const crown = pos.head.clone().add(new Vector3(0, p.actor.style.headroom * p.actor.rig.body.scale, 0).applyQuaternion(p.actor.rig.rot.head))
        for (const v of [crown, pos.handL, pos.handR, pos.footL, pos.footR, pos.hips, pos.toesL, pos.toesR]) {
          q.copy(v).applyAxisAngle(new Vector3(0, 1, 0), p.actor.group.rotation.y).add(p.actor.group.position)
          lo.min(q); hi.max(q)
        }
      }
      // An Aura needs room round the body.
      if (p.spec.aura.mode !== 'off') {
        const s = p.actor.rig.body.scale * (p.spec.aura.mode === 'full' ? 0.8 : 0.4)
        const at = p.actor.group.position
        lo.min(q.set(at.x - s, 0, at.z - s)); hi.max(q.set(at.x + s, 0, at.z + s))
        hi.y += s * 0.5
      }
    }
    if (!this.cast.length) return
    const first = this.cast.find((p) => p.motion)?.motion
    const view = this.stage.view
    if (angle !== undefined) view.azimuth = typeof angle === 'number' ? angle : ANGLE[angle]
    else {
      view.azimuth = first ? first.azimuth ?? ANGLE[first.camera] : 0
      view.elevation = first?.elevation ?? 4
    }
    lo.y = Math.min(lo.y, 0)
    const a = (view.azimuth * Math.PI) / 180
    const wide = Math.abs(Math.cos(a)) * (hi.x - lo.x) + Math.abs(Math.sin(a)) * (hi.z - lo.z)
    view.target.set((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, (lo.z + hi.z) / 2)
    this.room = { height: hi.y - lo.y + 0.28, width: wide + 0.34 }
    view.distance = this.stage.fit(this.room.height, this.room.width, this.margin)
  }
  private room = { height: 2, width: 1 }
  /** Space left round the subject: more when an Aura needs room to spread. */
  margin = 1.12

  resize(width: number, height: number) {
    this.stage.resize(width, height)
    this.stage.view.distance = this.stage.fit(this.room.height, this.room.width, this.margin)
    this.stage.render()
  }

  orbit(dx: number, dy: number) {
    const v = this.stage.view
    v.azimuth -= dx * 0.4
    v.elevation = Math.max(-8, Math.min(70, v.elevation + dy * 0.3))
  }
  zoom(factor: number) { this.stage.view.distance = Math.max(1.2, Math.min(14, this.stage.view.distance * factor)) }

  play() { this.playing = true }
  pause() { this.playing = false }
  get isPlaying() { return this.playing }
  setSpeed(v: number) { this.speed = v }
  /** Stops drawing while the canvas is out of sight. */
  setActive(on: boolean) {
    this.active = on
    this.last = 0
  }
  seek(seconds: number) {
    this.time = Math.max(0, seconds)
    this.settle = -1
    this.pose(0)
    this.stage.render()
  }
  restart() { this.seek(0); this.playing = true }
  /** The end-of-set release, on demand. */
  release() { for (const p of this.cast) p.field.release() }

  private get length() { return setLength(this.cast.find((p) => p.motion)?.motion ?? null) }

  private pose(dt: number) {
    const length = this.length
    for (const p of this.cast) {
      const m = p.motion
      const cycles = m ? this.time / m.period : this.time / 5
      // After a set the body waits where a repetition ends; a hold keeps breathing.
      const resting = this.settle >= 0 && m?.kind === 'reps'
      const phase = resting ? 0 : cycles % 1
      if (m) m.pose(phase, p.actor.rig, p.pose)
      else stand(p.actor.rig.body, p.pose, phase)
      p.actor.pose(p.pose)
      const wheel = p.props?.getObjectByName('wheel')
      if (wheel) {
        // The wheel is held in both hands and rolls as they travel.
        const pos = p.actor.rig.pos
        wheel.position.set((pos.handL.x + pos.handR.x) / 2, wheel.userData.radius, (pos.handL.z + pos.handR.z) / 2)
        wheel.rotation.x = wheel.position.z / wheel.userData.radius
      }

      const effort = m ? (resting ? 0.3 : m.effort(phase)) : 0.5 + 0.5 * Math.sin(cycles * Math.PI * 2)
      const shift = m?.shift?.(phase)
      for (let i = 0; i < SLOTS; i++) p.target[i] = p.base[i] * (m ? 0.68 + 0.32 * effort : 0.9 + 0.1 * effort)
      if (shift) for (const [channel, k] of Object.entries(shift) as [Channel, number][]) {
        if (!CHANNELS.includes(channel)) continue
        for (const side of ['L', 'R'] as const) p.target[slotOf(channel, side)] *= k
      }
      const act = p.actor.look.act
      const ease = dt > 0 ? 1 - Math.exp(-dt * 9) : 1
      for (let i = 0; i < SLOTS; i++) act[i] += (p.target[i] - act[i]) * ease

      const mode = p.spec.aura.mode
      if (m?.beat !== undefined && !resting && mode !== 'off' && p.lastPhase < m.beat && phase >= m.beat) p.field.beat(m.kind === 'mobility' ? 0.3 : 0.55)
      p.lastPhase = phase
      const level = this.settle >= 0 && mode === 'living' ? 0.1 : levelOf(mode, m?.kind ?? 'hold', { progress: Math.min(1, this.time / length), effort, phase, time: this.time }, p.spec.aura.level)
      p.field.update(dt, level, this.stage.camera, this.stage.renderer.domElement.height)
      // Hair that takes the colour of the Aura turns with it.
      if (p.actor.style.hairGlow) {
        const charge = p.actor.look.hairCharge
        charge.value += (Math.min(1, level * 1.6) - charge.value) * (dt > 0 ? 1 - Math.exp(-dt * 5) : 1)
      }
    }
  }

  private frame = (now: number) => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.frame)
    if (!this.active || !this.cast.length) { this.last = 0; return }
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0
    this.last = now
    const step = this.playing ? dt * this.speed : 0
    if (this.settle >= 0) {
      this.settle += step
      if (this.settle > SETTLE) { this.settle = -1; this.time = 0 }
    } else {
      this.time += step
      if (this.sets && this.time >= this.length) { this.settle = 0; for (const p of this.cast) if (p.spec.aura.mode === 'living') p.field.release() }
    }
    // Paused: the body is still, the light is not.
    this.pose(this.playing ? step : dt * 0.35)
    this.stage.render()
    this.frames++
    this.fpsClock += dt
    if (this.fpsClock >= 0.5) {
      this.fps = this.frames / this.fpsClock
      this.frames = 0
      this.fpsClock = 0
      const m = this.cast.find((p) => p.motion)?.motion
      this.onState?.({
        playing: this.playing, time: this.time, length: this.length, phase: this.settle >= 0 ? 'settle' : 'work', fps: this.fps,
        count: m ? Math.floor(m.kind === 'reps' || m.kind === 'mobility' ? this.time / m.period + 0.03 : this.time) : 0,
      })
    }
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    for (const p of this.cast) { p.field.dispose(); p.actor.dispose(); p.props?.removeFromParent() }
    this.cast = []
    this.stage.dispose()
  }
}
