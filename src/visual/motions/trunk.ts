/**
 * The harder trunk and leg work: arch, standing rollout, dragon flag, V-sit, manna, box pistol, advanced shrimp, Nordic curl.
 * Per-side exercises show the left leg working.
 */
import { Vector3 } from 'three'
import { footRot, handRot, pitch, type Body, type Pose, type Rig } from '../rig'
import { bentLeg, kneel, onRail, parallettes, reachOut, wheel } from './floor'
import { SIDES, at, deg, hipsAt, onBall, proneLine, shouldersAt, straightLegs, wristHeight } from './kit'
import { KNEE_DOWN, SEAT, armsForward, flatFoot, squatBox, trunk } from './legs'
import { ease, lerp, there, type Motion } from './types'

const UP = new Vector3(0, 1, 0)
const breath = (t: number) => Math.sin(t * Math.PI * 2)
const smooth = (a: number, b: number, x: number) => ease(Math.min(1, Math.max(0, (x - a) / (b - a))))
/** A direction in the plane of movement, `angle` radians above the floor, towards +Z. */
const dir = (angle: number) => at(Math.cos(angle), Math.sin(angle))
const midOf = (rig: Rig, joint: 'upperArm' | 'upperLeg') => rig.pos[`${joint}L`].clone().add(rig.pos[`${joint}R`]).multiplyScalar(0.5)

// ── Face down ────────────────────────────────────────────────────────────

/** How high the hip joints are lying face down. */
const PRONE = 0.104

/**
 * Arch hold: face down, the chest and the thighs lifted off the floor from
 * the upper back and the glutes, arms long by the ears, legs straight. The
 * counterpart of the hollow hold.
 */
export const archHold: Motion = {
  id: 'arch-hold',
  revision: 1,
  stage: 'low',
  planted: ['hips'],
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  azimuth: 62,
  elevation: 9,
  standard: 'Chest and thighs clear of the floor, lifted from the upper back and the glutes; arms long by the ears; legs straight and together; the head in line with the spine, not cranked back.',
  effort: () => 0.75,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const lift = 1 + 0.05 * breath(t)
    const chest = 24 * lift
    out.pelvis.copy(pitch(96))
    out.chest.copy(pitch(90 - chest))
    out.head.copy(pitch(90 - chest + 3))
    out.hips.set(0, PRONE * s, 0)
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      // By the ears: along the line of the lifted chest.
      const rise = (chest - 9) * deg
      const along = new Vector3(sign * 0.06, Math.sin(rise), Math.cos(rise)).normalize()
      arm.elbow.set(sign, 0.3, 0)
      arm.rot.copy(handRot(side, along, new Vector3(-sign * 0.25, -1, 0).normalize()))
      arm.grip = 0.08
      arm.shrug = 0.6
      reachOut(rig, out, side, along, 0.997)
    }
    rig.solve(out)
    // The thighs leave the floor: the legs are extended behind the pelvis, a little more than it is tipped.
    straightLegs(rig, out, 96 - (90 + 14 * lift), 50)
  },
}

// ── Standing rollout ─────────────────────────────────────────────────────

/**
 * Standing ab-wheel rollout: folded at the hips with the wheel at the feet,
 * it rolls out on straight arms until the body is one hollow line just above
 * the floor, on the balls of the feet; then it is pulled back to standing.
 */
export const abWheelStanding: Motion = {
  id: 'ab-wheel-standing',
  revision: 1,
  stage: 'low',
  planted: ['toesL', 'toesR'],
  props: (b) => [{ kind: 'wheel', radius: wheel(b) }],
  kind: 'reps',
  period: 6.2,
  camera: 'side',
  azimuth: 64,
  elevation: 8,
  beat: 0.97,
  detail: { triceps: 0.3, delt_ant: 0.35 },
  standard: 'From the feet, legs straight: the wheel rolls out on locked arms until shoulders, hips and ankles are one hollow line just above the floor, and is pulled back to standing. The knees never touch and the hips never sag below the line.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.44, 0.06),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const u = ease(there(t, 0.44, 0.06))
    const reach = (b.upperArm + b.lowerArm) * 0.997
    const legs = (b.upperLeg + b.lowerLeg) * 0.998
    const f = b.ball.length()
    const grip = wheel(b) + 0.034 * s
    // The balls of the feet stay where they are; the heels come up as the body goes out.
    const pad = b.rest.toesL.y
    const flat = Math.atan2(-b.ball.y, b.ball.z)
    const low = 0.2 * s
    const long = proneLine(b, 0, low, pad).angle * deg
    const lean = lerp(97 * deg, long, u)
    const heel = lerp(flat, 90 * deg - long, Math.pow(u, 0.8))
    const ankle = at(-f * Math.cos(heel), pad + f * Math.sin(heel))
    const hip = ankle.clone().addScaledVector(dir(lean), legs)
    const droop = lerp(52, 30, u) * deg
    for (const [side, sign] of SIDES) {
      const x = sign * b.rest.upperLegL.x
      onBall(b, ankle.clone().setX(x), at(0, pad, x), out.leg[side])
      out.leg[side].knee.set(0, -Math.cos(lean), Math.sin(lean))
      const arm = out.arm[side]
      arm.rot.copy(handRot(side, new Vector3(0, -Math.sin(droop), Math.cos(droop)), new Vector3(0, -Math.cos(droop), -Math.sin(droop))))
      arm.elbow.set(sign * 0.5, 0.3, -1)
      arm.grip = 0.85
      arm.shrug = 0.3
      arm.hand.set(sign * 0.15 * s, grip, hip.z + b.trunk)
    }
    // The arms swing from just behind upright, the wheel at the toes, to almost level.
    const swing = lerp(-9 * deg, Math.acos((low - grip) / reach), u)
    // The trunk for a fold at the hips: `rise` is its angle above the floor. Returns how far the shoulders are from where straight arms need them.
    const shape = (rise: number) => {
      const flatBack = 90 - rise / deg
      out.pelvis.copy(pitch(flatBack - lerp(10, 6, u)))
      out.chest.copy(pitch(flatBack + lerp(14, 4, u)))
      out.head.copy(pitch(flatBack + lerp(8, -8, u)))
      hipsAt(b, out.pelvis, hip, out.hips)
      // The wheel is where straight arms put it.
      let short = 0
      for (let i = 0; i < 3; i++) {
        rig.solve(out)
        for (const [side] of SIDES) {
          const sh = rig.pos[`upperArm${side}`]
          const arm = out.arm[side]
          const span = Math.sqrt(reach * reach - (arm.hand.x - sh.x) ** 2)
          arm.hand.z = sh.z + span * Math.sin(swing)
          short = grip + span * Math.cos(swing) - sh.y
        }
      }
      return short
    }
    // The fold at the hips is whatever keeps the arms straight: the shoulders open first, the hips last.
    let rise = lerp(-30 * deg, long, u)
    for (let i = 0; i < 5; i++) rise += shape(rise) / (b.trunk * Math.cos(rise))
    shape(rise)
  },
}

// ── Dragon flag ──────────────────────────────────────────────────────────

/** A flat bench: the shoulders lie at z = 0, the head towards -Z, and its end is behind the head. */
export const flagBench = (b: Body) => ({ width: 0.3 * b.scale, height: 0.42 * b.scale, depth: 1.42 * b.scale, z: 0.19 * b.scale })

/**
 * On the back on a bench, holding its end behind the head, the body one
 * straight piece that turns on the shoulders: `rise` is its angle above the
 * bench in degrees. `tuck` folds the legs in, for the way back up.
 */
function flag(rig: Rig, out: Pose, rise: number, tuck = 0) {
  const b = rig.body
  const s = b.scale
  const bench = flagBench(b)
  const top = bench.height
  const end = bench.z - bench.depth / 2
  // Coming up, the weight rolls from the upper back onto the shoulders.
  const up = smooth(15, 85, rise)
  const pivot = at(lerp(0, -0.02, up) * s, top + lerp(0.105, 0.09, up) * s)
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    arm.hand.set(sign * 0.09 * s, top + wristHeight(b), end + b.knuckle * 0.9)
    arm.rot.copy(handRot(side, new Vector3(-sign * 0.12, 0, -1).normalize(), new Vector3(0, -1, 0)))
    arm.elbow.set(sign * 0.8, 0.8, 0.15)
    arm.grip = 0.6
    arm.shrug = lerp(0.5, 1, up)
  }
  out.head.copy(pitch(-90 + lerp(-5, 10, up)))
  // A hollow line: the pelvis tucked under and the ribs drawn down by the same amount, so that shoulders, hips and ankles stay in line.
  const hollow = 16 + 26 * tuck
  let lean = -90 - rise
  for (let i = 0; i < 3; i++) {
    out.pelvis.copy(pitch(lean - hollow * 0.5))
    out.chest.copy(pitch(lean + hollow * 0.5))
    hipsAt(b, out.pelvis, pivot.clone().addScaledVector(dir(rise * deg), b.trunk), out.hips)
    shouldersAt(rig, out, pivot)
    const line = midOf(rig, 'upperLeg').sub(midOf(rig, 'upperArm'))
    lean += Math.atan2(line.y, line.z) / deg - rise
  }
  const thigh = (rise + 105 * tuck) * deg
  for (const [side] of SIDES) {
    bentLeg(rig, out, side, thigh, thigh - 122 * tuck * deg, lerp(50, 25, tuck))
    out.leg[side].toes = -18 * (1 - tuck)
  }
}

const FLAG_TOP = 84
const FLAG_LOW = 8

/**
 * Dragon flag negative: from the shoulder stand the straight body is lowered
 * slowly until it is just above the bench; then the knees tuck in and it is
 * rolled back to the top.
 */
export const dragonFlagNegative: Motion = {
  id: 'dragon-flag-negative',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR'],
  props: (b) => [{ kind: 'box', ...flagBench(b) }],
  kind: 'reps',
  period: 9.4,
  camera: 'side',
  azimuth: 104,
  elevation: 10,
  beat: 0.66,
  standard: 'Shoulders, hips and ankles stay in one line from vertical to just above the bench, with no pike at the hips; only the upper back and shoulders rest on the bench; the lowering takes at least five seconds, evenly, and the reset is tucked.',
  effort: (t) => (t < 0.04 ? 0.5 : t < 0.69 ? 0.5 + 0.5 * Math.min(1, (t - 0.04) / 0.6) : 0.4),
  pose(t, rig, out) {
    if (t < 0.69) {
      const p = Math.min(1, Math.max(0, (t - 0.04) / 0.6))
      flag(rig, out, lerp(FLAG_TOP, FLAG_LOW, 0.7 * p + 0.3 * ease(p)))
    } else {
      const r = Math.min(1, (t - 0.69) / 0.28)
      flag(rig, out, lerp(FLAG_LOW, FLAG_TOP, smooth(0.1, 0.72, r)), smooth(0, 0.3, r) - smooth(0.62, 1, r))
    }
  },
}

/** Dragon flag: the same line lowered to just above the bench, paused, and raised again without bending at the hips. */
export const dragonFlag: Motion = {
  id: 'dragon-flag',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR'],
  props: (b) => [{ kind: 'box', ...flagBench(b) }],
  kind: 'reps',
  period: 7.2,
  camera: 'side',
  azimuth: 104,
  elevation: 10,
  beat: 0.97,
  standard: 'Shoulders, hips and ankles stay in one line both ways, down to a pause just above the bench and back to vertical; the hips never pike and the body never rests on the bench; only the upper back and shoulders touch it.',
  effort: (t) => 0.45 + 0.55 * there(t, 0.44, 0.08),
  pose(t, rig, out) { flag(rig, out, lerp(FLAG_TOP, FLAG_LOW, there(t, 0.44, 0.08))) },
}

// ── Supported on the hands ───────────────────────────────────────────────

/**
 * V-sit: in support on locked arms, the hips pushed forward through the
 * arms and the straight legs lifted well above level by compressing at the
 * hips, not by leaning back.
 */
export const vSit: Motion = {
  id: 'v-sit',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR'],
  props: (b) => [{ kind: 'rails', ...parallettes(b) }],
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  azimuth: 58,
  elevation: 6,
  standard: 'Arms locked and shoulders pushed down; hips forward between the hands; legs straight, together and at least 45° above level, toes pointed; the trunk leans back only a little.',
  effort: () => 0.9,
  pose(t, rig, out) {
    const b = rig.body
    const p = parallettes(b)
    const pelvis = -34
    out.pelvis.copy(pitch(pelvis))
    out.chest.copy(pitch(-13 + 0.6 * breath(t)))
    out.head.copy(pitch(-2))
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      onRail(b, arm, side, sign, new Vector3(sign * p.gap / 2, p.height, 0), p.radius)
      arm.elbow.set(sign * 0.2, 0, -1)
      arm.shrug = -1
    }
    // The shoulders sit behind the hands and the hips come through in front of them.
    const wrist = out.arm.L.hand
    const reach = (b.upperArm + b.lowerArm) * 0.9975
    const tilt = 13 * deg
    const behind = (aside: number) => {
      const r = Math.sqrt(Math.max(0, reach * reach - aside * aside))
      return new Vector3(0, wrist.y + r * Math.cos(tilt), wrist.z - r * Math.sin(tilt))
    }
    out.hips.set(0, wrist.y + reach - b.trunk, 0)
    shouldersAt(rig, out, behind(wrist.x - b.rest.upperArmL.x))
    shouldersAt(rig, out, behind(wrist.x - rig.pos.upperArmL.x))
    // The legs' height is measured from the floor, whatever the pelvis is doing.
    straightLegs(rig, out, pelvis + 90 + 56 + 0.6 * breath(t), 48)
  },
}

/**
 * Manna: on locked arms with the fingers pointing back, the shoulders
 * extended far behind and the hips pressed forward and up past the hands
 * until the straight legs are level above the face.
 */
export const manna: Motion = {
  id: 'manna',
  revision: 1,
  stage: 'square',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 4.6,
  camera: 'side',
  azimuth: 58,
  elevation: 6,
  standard: 'Arms locked, hands on the floor behind the hips; hips pressed forward and up, above the shoulders and past the hands; legs straight, together and level or higher, the feet behind the head.',
  effort: () => 0.95,
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    // The trunk rises from the shoulders to the hips; the arms lean back from the hands to the shoulders.
    // Balanced: the weight is over the hands, the hips as far ahead of them as the shoulders are behind.
    const rise = 28
    const tilt = 17 * deg
    const round = 16
    const lean = -90 - rise
    out.pelvis.copy(pitch(lean - round * 0.5))
    out.chest.copy(pitch(lean + round * 0.5 + 0.5 * breath(t)))
    out.head.copy(pitch(lean + round * 0.5 + 22))
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.set(sign * (b.rest.upperArmL.x + 0.02 * s), wristHeight(b), 0)
      arm.rot.copy(handRot(side, new Vector3(sign * 0.2, 0, -1).normalize(), new Vector3(0, -1, 0)))
      arm.elbow.set(sign, 0, -0.4)
      arm.grip = 0.04
      arm.shrug = -0.6
    }
    const wrist = out.arm.L.hand
    const reach = (b.upperArm + b.lowerArm) * 0.9975
    const behind = (aside: number) => {
      const r = Math.sqrt(Math.max(0, reach * reach - aside * aside))
      return new Vector3(0, wrist.y + r * Math.cos(tilt), wrist.z - r * Math.sin(tilt))
    }
    out.hips.set(0, wrist.y + reach, 0)
    shouldersAt(rig, out, behind(wrist.x - b.rest.upperArmL.x))
    shouldersAt(rig, out, behind(wrist.x - rig.pos.upperArmL.x))
    // Level means level with the floor: the legs point back over the head.
    straightLegs(rig, out, lean - round * 0.5 + 270 + 0.5 * breath(t), 48)
  },
}

// ── On one leg ───────────────────────────────────────────────────────────

/**
 * Box pistol on the left leg: the hips reach back to touch a knee-height
 * box and stand up again, the right leg straight in front and off the floor.
 */
export const boxPistol: Motion = {
  id: 'box-pistol',
  revision: 1,
  stage: 'square',
  planted: ['footL'],
  kind: 'reps',
  period: 3.8,
  camera: 'three-quarter',
  azimuth: 58,
  elevation: 5,
  beat: 0.97,
  detail: { 'quads.R': 0.4, 'glutes.R': 0.08, 'glute_med.R': 0.1, 'hamstrings.R': 0.08, 'hip_flexors.R': 0.9, 'hip_flexors.L': 0.25, 'calves.R': 0.06 },
  props: (b) => [{ kind: 'box', ...squatBox(b) }],
  standard: 'On one leg the hips reach back to touch a knee-height box lightly, without sitting on it; standing heel down and the knee over the foot; the free leg straight in front and off the floor; stood up without the hands or the other foot.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.44, 0.08),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const legs = b.upperLeg + b.lowerLeg
    const u = there(t, 0.44, 0.08)
    // The foot is under the body, the pelvis shifted over it.
    const footX = 0.05 * s
    const mid = 0.02 * s
    const standing = b.ankle + Math.sqrt((legs * 0.998) ** 2 - (mid + b.rest.upperLegL.x - footX) ** 2)
    trunk(rig, out, at(lerp(0.03, -0.3, ease(u)) * s, lerp(standing, squatBox(b).height + SEAT * s, u), mid), lerp(2, 50, u), lerp(0, 46, u), lerp(0, 16, u))
    flatFoot(out.leg.L, b, footX, 0, 1, 4)
    out.leg.L.knee.set(-0.2, 0, 1)
    // The free leg rises ahead of the descent and stays clear of the floor.
    const swing = lerp(27, 76, Math.pow(u, 0.6)) * deg
    const along = new Vector3(0, -Math.cos(swing), Math.sin(swing))
    const toes = new Vector3(0, Math.sin(swing), Math.cos(swing))
    const free = out.leg.R
    free.foot.copy(rig.pos.upperLegR).addScaledVector(along, legs * 0.9985)
    free.rot.copy(footRot(toes, along.clone().negate()))
    free.knee.copy(toes)
    free.toes = 0
    armsForward(rig, out, u, 0.12)
  },
}

/** The bottom of the advanced shrimp squat: how far pelvis and chest tip forward, how far the rear thigh is behind the pelvis, the least and most angle left at the rear knee, and where the hips are (in scale units behind the heel). */
const SHRIMP = { pelvis: 34, chest: 28, extend: 6, knee: [25, 46], hips: -0.1 }

/**
 * Advanced shrimp squat on the left leg: the right foot is held behind by
 * both hands, so nothing counterbalances; the trunk stays tall and the right
 * knee comes down to touch the floor behind the standing heel.
 */
export const advShrimp: Motion = {
  id: 'adv-shrimp-squat',
  revision: 1,
  stage: 'square',
  planted: ['footL'],
  kind: 'reps',
  period: 4.2,
  camera: 'side',
  azimuth: 64,
  elevation: 5,
  beat: 0.97,
  detail: { 'quads.R': 0.2, 'glutes.R': 0.2, 'glute_med.R': 0.15, 'hamstrings.R': 0.2, 'calves.R': 0.08 },
  standard: 'Both hands hold the rear foot behind the back throughout; the rear knee touches the floor softly behind the standing heel and nothing else touches; standing heel down, knee over the foot; the trunk stays as tall as the hold allows.',
  effort: (t) => 0.3 + 0.7 * there(t, 0.45, 0.07),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const legs = b.upperLeg + b.lowerLeg
    const u = there(t, 0.45, 0.07)
    const footX = 0.05 * s
    const mid = 0.02 * s
    const standing = b.ankle + Math.sqrt((legs * 0.998) ** 2 - (mid + b.rest.upperLegL.x - footX) ** 2)
    // The rear thigh hangs from the pelvis, a little behind its line; at the bottom that puts the knee on the floor.
    const pelvis = lerp(3, SHRIMP.pelvis, u)
    const back = (pelvis + lerp(10, SHRIMP.extend, u)) * deg
    const low = KNEE_DOWN * s + b.upperLeg * Math.cos((SHRIMP.pelvis + SHRIMP.extend) * deg)
    trunk(rig, out, at(lerp(0.02, SHRIMP.hips, ease(u)) * s, lerp(standing, low, u), mid), pelvis, lerp(-4, SHRIMP.chest, u), lerp(0, 6, u))
    flatFoot(out.leg.L, b, footX, 0, 1, 4)
    out.leg.L.knee.set(-0.15, 0, 1)
    const hip = rig.pos.upperLegR.clone()
    const knee = hip.clone().addScaledVector(new Vector3(0, -Math.cos(back), -Math.sin(back)), b.upperLeg)
    const reach = b.upperArm + b.lowerArm
    const rear = out.leg.R
    // The shin folds back up along the thigh, the foot held over its top by both hands, one above the other.
    // Returns how much of their length the arms need to reach it.
    const hold = (bend: number) => {
      const fold = 90 * deg - back + bend * deg
      const shin = dir(fold)
      const top = dir(fold + 90 * deg)
      rear.foot.copy(knee).addScaledVector(shin, b.lowerLeg)
      rear.foot.x = lerp(rear.foot.x, 0, 0.6)
      rear.knee.copy(knee).sub(hip.clone().add(rear.foot).multiplyScalar(0.5))
      rear.rot.copy(footRot(shin, top))
      rear.toes = 0
      for (const [side, sign] of SIDES) {
        const arm = out.arm[side]
        arm.hand.copy(rear.foot).addScaledVector(shin, (side === 'L' ? 0.125 : 0.075) * s).addScaledVector(top, 0.034 * s)
        arm.hand.x += sign * 0.03 * s
        arm.rot.copy(handRot(side, shin.clone().negate().add(new Vector3(-sign * 0.5, 0, 0)).normalize(), top.clone().negate()))
        arm.elbow.set(sign, 0.2, -0.6)
        arm.grip = 0.55
        arm.shrug = -0.3
      }
      rig.solve(out)
      return Math.max(rig.pos.upperArmL.distanceTo(out.arm.L.hand), rig.pos.upperArmR.distanceTo(out.arm.R.hand)) / reach
    }
    // The heel is as near the buttock as arms that are almost straight leave it.
    let near = SHRIMP.knee[0], far = SHRIMP.knee[1]
    for (let i = 0; i < 7; i++) {
      const bend = (near + far) / 2
      if (hold(bend) > 0.985) far = bend
      else near = bend
    }
    hold(near)
  },
}

// ── Kneeling ─────────────────────────────────────────────────────────────

/** How far the body tips forward at the bottom of a Nordic curl, in degrees: the chest brushes the floor. */
const NORDIC_LOW = 83

/**
 * Nordic curl: kneeling tall with the ankles held, the body stays one
 * straight piece from knees to head, is lowered until the chest brushes the
 * floor and is pulled back up by the hamstrings. The hands are carried ready
 * and never push.
 */
export const nordicCurl: Motion = {
  id: 'nordic-curl',
  revision: 1,
  stage: 'square',
  planted: ['lowerLegL', 'lowerLegR', 'footL', 'footR'],
  props: (b) => [{ kind: 'bar', height: 0.108 * b.scale, width: 0.46 * b.scale, radius: 0.018 * b.scale, z: -b.lowerLeg * 0.97 }],
  kind: 'reps',
  period: 7.6,
  camera: 'side',
  azimuth: 66,
  elevation: 6,
  beat: 0.97,
  detail: { calves: 0.3, glutes: 0.5 },
  standard: 'Knees, hips and shoulders stay in one line both ways, never breaking at the hips; lowered until the chest brushes the floor and pulled back up by the hamstrings; the hands stay off the floor and do not push.',
  effort: (t) => 0.4 + 0.6 * there(t, 0.5, 0.06),
  pose(t, rig, out) {
    const b = rig.body
    const s = b.scale
    const knee = kneel(b, out)
    const lean = NORDIC_LOW * there(t, 0.5, 0.06)
    out.pelvis.copy(pitch(lean - 2))
    out.chest.copy(pitch(lean))
    out.head.copy(pitch(lean - 24 * smooth(25, NORDIC_LOW, lean)))
    hipsAt(b, out.pelvis, at(0, knee).addScaledVector(at(Math.sin(lean * deg), Math.cos(lean * deg)), b.upperLeg), out.hips)
    // The hands are carried in front of the chest, ready; near the floor they come back beside it, palms down, and hover.
    const near = smooth(40, NORDIC_LOW, lean)
    const turn = pitch(lean)
    for (const [side, sign] of SIDES) {
      const arm = out.arm[side]
      arm.hand.set(sign * 0.2 * s, 0.9 * s, 0.3 * s)
      arm.elbow.copy(new Vector3(sign * 0.9, -0.5, -0.6).applyQuaternion(turn))
      arm.grip = 0.1
      arm.shrug = 0
      arm.rot.copy(handRot(side, UP.clone().applyQuaternion(turn), new Vector3(0, 0, 1).applyQuaternion(turn)))
    }
    for (let i = 0; i < 2; i++) {
      rig.solve(out)
      for (const [side, sign] of SIDES) {
        const ready = new Vector3(sign * lerp(0.03, 0.09, near), lerp(-0.1, -0.14, near), lerp(0.3, 0.115, near)).multiplyScalar(s)
        const hand = out.arm[side].hand.copy(rig.pos[`upperArm${side}`]).add(ready.applyQuaternion(turn))
        hand.y = Math.max(hand.y, wristHeight(b) + 0.045 * s)
      }
    }
  },
}

/** The harder trunk and leg work, easiest first. */
export const TRUNK: Motion[] = [archHold, boxPistol, dragonFlagNegative, dragonFlag, abWheelStanding, advShrimp, nordicCurl, vSit, manna]
