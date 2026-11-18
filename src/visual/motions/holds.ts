import { Vector3 } from 'three'
import { handRot, pitch } from '../rig'
import { SIDES, at, handsOnFloor, hipsAt, proneAt, shouldersAt, straightLegs, wristHeight } from './kit'
import type { Motion } from './types'

const breath = (t: number) => Math.sin(t * Math.PI * 2)

/**
 * Front plank on the forearms: elbows under the shoulders, forearms
 * parallel, one straight line from heels to head, pelvis tucked.
 */
export const plank: Motion = {
  id: 'plank',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'toesL', 'toesR'],
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  azimuth: 64,
  elevation: 8,
  detail: { delt_lat: 0.2, delt_ant: 0.5 },
  standard: 'Elbows under the shoulders; heels, hips and shoulders in one line; no sag in the lower back and no hips in the air; breathing.',
  effort: () => 0.7,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const floor = 0.04 * s
    // Upper arms upright: the shoulders are an upper arm's length above the elbows, the forearms flat and pointing forward.
    const shoulder = proneAt(rig, out, 0, floor + b.upperArm + 0.002 * s * breath(t), (sh) => {
      for (const [side, sign] of SIDES) {
        const arm = out.arm[side]
        arm.hand.set(sign * b.rest.upperArmL.x * 0.97, floor - 0.004 * s, sh.z + b.lowerArm)
        arm.rot.copy(handRot(side, new Vector3(-sign * 0.1, 0, 1).normalize(), new Vector3(0, -1, 0)))
        arm.elbow.set(sign * 0.05, -1, -0.05)
        arm.grip = 0.1
        arm.shrug = -0.1
      }
    }, 4)
    const lean = Math.asin(Math.min(1, (shoulder.y - rig.pos.upperLegL.y) / b.trunk)) * (180 / Math.PI)
    out.head.copy(pitch(90 - lean - 6))
  },
}

/**
 * Hollow body hold: lower back pressed into the floor, shoulders and legs
 * just off it, arms by the ears, the body one shallow curve.
 */
export const hollow: Motion = {
  id: 'hollow-hold',
  revision: 1,
  stage: 'low',
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  azimuth: 62,
  elevation: 9,
  standard: 'Lower back stays on the floor; legs straight and low; shoulder blades off the floor; arms by the ears; no arch.',
  effort: () => 0.8,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const lift = 1 + 0.05 * breath(t)
    out.pelvis.copy(pitch(-90 - 9))
    out.chest.copy(pitch(-90 + 15 * lift))
    out.head.copy(pitch(-90 + 24 * lift))
    out.hips.set(0, 0.112 * s, 0)
    rig.solve(out)
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      const dir = new Vector3(sign * 0.1, Math.sin(15 * lift * Math.PI / 180), -Math.cos(15 * lift * Math.PI / 180)).normalize()
      arm.hand.copy(rig.pos[`upperArm${side}`]).addScaledVector(dir, (b.upperArm + b.lowerArm) * 0.99)
      arm.elbow.set(sign * 1, 0.2, 0.2)
      arm.rot.copy(handRot(side, dir, new Vector3(-sign * 0.3, 1, 0).normalize()))
      arm.grip = 0.08
      arm.shrug = 0.7
    }
    rig.solve(out)
    straightLegs(rig, out, 23 * lift - 9, 48)
  },
}

/**
 * Freestanding handstand: hands, shoulders, hips and ankles stacked on one
 * vertical line, arms locked, shoulders pushed tall, ribs in, toes pointed.
 * The body is never still: it is held by small corrections from the fingers.
 */
const freestanding = (revision: number, look: number, standard: string): Motion => ({
  id: 'freestanding-hs',
  revision,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'balance',
  period: 5.2,
  camera: 'side',
  azimuth: 70,
  elevation: 2,
  detail: { delt_post: 0.35, forearm_flex: 0.6, forearm_ext: 0.5 },
  standard,
  effort: (t) => 0.55 + 0.2 * Math.abs(Math.sin(t * Math.PI * 2)),
  pose(t, rig, out) {
    const b = rig.body
    // A slow drift and a quicker correction, a degree or so each way.
    const drift = 1.1 * Math.sin(t * Math.PI * 2) + 0.45 * Math.sin(t * Math.PI * 6 + 1)
    const reach = b.upperArm + b.lowerArm
    handsOnFloor(b, out, 0, b.rest.upperArmL.x * 1.02, new Vector3(1, 0, 0.6), 4)
    for (const [side] of SIDES) { out.arm[side].shrug = 1; out.arm[side].grip = 0.12 - 0.05 * Math.sin(t * Math.PI * 2) }
    out.chest.copy(pitch(180 + drift * 0.6))
    out.pelvis.copy(pitch(180 - drift * 0.9 + 1.5))
    out.head.copy(pitch(180 - look))
    const lean = drift * (Math.PI / 180)
    const target = at(Math.sin(lean) * reach, wristHeight(b) + Math.cos(lean) * reach * 0.9975)
    out.hips.set(0, target.y + b.trunk, target.z)
    shouldersAt(rig, out, target)
    straightLegs(rig, out, -drift * 0.7, 52)
  },
})

/** The head is lifted until the eyes are on the floor between the hands: that spot is what a handstand is balanced by. */
export const handstand = freestanding(2, 46, 'Arms locked; shoulders fully open and pushed tall; wrists, shoulders, hips and ankles on one line; no arch; legs together, toes pointed; the head lifted so the eyes are on the floor between the hands.')
/** Revision 1, kept until revision 2 is approved: the head almost in line, looking past the hands. */
export const handstandEarlier = freestanding(1, 18, 'Arms locked; shoulders fully open and pushed tall; wrists, shoulders, hips and ankles on one line; no arch; legs together, toes pointed.')

/**
 * Cat-cow on hands and knees: hands under the shoulders, knees under the
 * hips, and the whole spine moving between rounded and arched, tail and
 * head following. Slow, with the breath.
 */
export const catCow: Motion = {
  id: 'cat-cow',
  revision: 1,
  stage: 'low',
  planted: ['handL', 'handR', 'footL', 'footR'],
  kind: 'mobility',
  period: 6.4,
  camera: 'side',
  azimuth: 66,
  elevation: 8,
  beat: 0.5,
  standard: 'Hands under shoulders, knees under hips, arms straight; the movement comes from the whole spine, pelvis to neck, in both directions; no rocking back and forth.',
  effort: (t) => 0.35 + 0.3 * Math.abs(Math.cos(t * Math.PI * 2)),
  // Rounding is the abdominals; arching is the muscles along the spine.
  shift: (t) => {
    const cat = 0.5 + 0.5 * Math.cos(t * Math.PI * 2)
    return { abs: 0.25 + 0.75 * cat, lower_back: 1 - 0.75 * cat, mid_back: 1 - 0.75 * cat }
  },
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    // 1 fully rounded (cat), -1 fully arched (cow).
    const c = Math.cos(t * Math.PI * 2)
    const knee = 0.052 * s
    const hip = at(0, knee + b.upperLeg * 0.995)
    const rise = Math.asin((wristHeight(b) + (b.upperArm + b.lowerArm) * 0.975 - hip.y) / b.trunk) * (180 / Math.PI)
    const flat = 90 - rise
    const wrists = hip.z + Math.cos(rise * Math.PI / 180) * b.trunk
    handsOnFloor(b, out, wrists, b.rest.upperArmL.x, new Vector3(0.5, 0, -1), 4)
    for (const [side] of SIDES) out.arm[side].shrug = 0.5 * c
    // The hips stay over the knees and the hands stay put: the whole trunk tips, a degree or two, until the arms are straight.
    const full = (b.upperArm + b.lowerArm) * 0.996
    const gap = (tip: number) => {
      out.pelvis.copy(pitch(flat + tip - 21 * c))
      out.chest.copy(pitch(flat + tip + (c > 0 ? 24 : 17) * c))
      out.head.copy(pitch(flat + tip + (c > 0 ? 58 : 46) * c))
      hipsAt(b, out.pelvis, hip, out.hips)
      rig.solve(out)
      return rig.pos.upperArmL.distanceTo(out.arm.L.hand) - full
    }
    let a = 0, fa = gap(a), z = fa > 0 ? 4 : -4, fz = gap(z)
    for (let i = 0; i < 6 && Math.abs(fz) > 2e-4 && fz !== fa; i++) {
      const next = z - (fz * (z - a)) / (fz - fa)
      a = z; fa = fz; z = Math.max(-25, Math.min(25, next)); fz = gap(z)
    }
    for (const [side, sign] of SIDES) {
      const leg = out.leg[side]
      const x = sign * b.rest.upperLegL.x
      leg.foot.set(x, 0.046 * s, hip.z - b.lowerLeg * 0.9995)
      leg.rot.copy(pitch(180 - 4))
      leg.knee.set(0, -1, 0.35)
      leg.toes = 0
    }
  },
}
