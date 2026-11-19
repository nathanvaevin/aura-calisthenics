/**
 * The body held level or turned over under the bar: front and back levers, skin the cat, the German hang, windshield wipers.
 *
 * Everything here hangs from the same bar as the pull-up, on straight arms,
 * in an overhand grip that is never changed. The arms are given an angle
 * under the bar and the trunk a pitch; turning over is the pitch going all
 * the way round, from 0 (hanging) through -90 (face up), -180 (upside down)
 * and -270 (face down) to the German hang.
 */
import { Quaternion, Vector3 } from 'three'
import { pitch, type Body, type Pose, type Rig } from '../rig'
import { highBar } from './hang'
import { SIDES, gripAt, shouldersAt, straightLegs } from './kit'
import { lerp, type Motion, type Prop } from './types'

const D = Math.PI / 180
const bar = (b: Body): Prop[] => [{ kind: 'bar', ...highBar(b) }]

const FORWARD = new Vector3(0, 0, 1)
/** A direction in the plane of the body, `a` degrees forward of straight down: 90 is level in front, 180 straight up, -90 level behind. */
const down = (a: number) => new Vector3(0, -Math.cos(a * D), Math.sin(a * D))
/** The front of a limb that hangs along `down(a)`: where its knee points. */
const front = (a: number) => new Vector3(0, Math.sin(a * D), Math.cos(a * D))

interface Under {
  /**
   * The angle of the straight arms from upright, degrees: 0 with the
   * shoulders straight under the hands, positive with them behind the hands
   * (a front lever), negative with them in front (a back lever).
   */
  arm: number
  /** Pitch of the ribcage, the pelvis and the head: 0 upright, -90 level and face up, 90 (or -270) level and face down. */
  chest: number
  pelvis: number
  head: number
  /** How far the hands have rolled round the bar after the arms, degrees. */
  roll?: number
  /** The shoulders pulled down away from the ears (-1) or left up by them (1). */
  shrug?: number
  /**
   * Where the elbows point: always out to the side, and this much the way
   * the point of an elbow turns with its arm (forward when the arm is
   * overhead, towards the head when it is behind the back).
   */
  elbow?: number
  /** Each hand this far outside its shoulder. */
  wide?: number
  /** The pelvis turned this far about the line from back to front, as when the legs swing to one side. The ribcage stays square. */
  turn?: number
}

/** Trunk and arms of a body under the high bar on locked arms. The legs are the caller's. */
function under(rig: Rig, out: Pose, o: Under) {
  const b = rig.body
  const s = b.scale
  const rail = highBar(b)
  const half = b.rest.upperArmL.x + (o.wide ?? 0.1) * s
  const roll = (o.roll ?? 0) * D
  out.chest.copy(pitch(o.chest))
  out.pelvis.copy(pitch(o.pelvis))
  if (o.turn) out.pelvis.premultiply(new Quaternion().setFromAxisAngle(FORWARD, o.turn * D))
  out.head.copy(pitch(o.head))
  const turned = new Vector3(0, -Math.sin(o.arm * D), Math.cos(o.arm * D)).multiplyScalar(o.elbow ?? 0)
  for (const [side, sign] of SIDES) {
    const arm = out.arm[side]
    gripAt(b, arm, side, new Vector3(sign * half, rail.height, 0), rail.radius, new Vector3(0, Math.cos(roll), Math.sin(roll)), new Vector3(0, -Math.sin(roll), Math.cos(roll)))
    arm.elbow.set(sign, 0, 0).add(turned)
    arm.shrug = o.shrug ?? -0.7
  }
  const wrist = out.arm.L.hand
  const reach = (b.upperArm + b.lowerArm) * 0.9985
  const aim = (aside: number) => {
    const inPlane = Math.sqrt(Math.max(0, reach ** 2 - aside ** 2))
    return new Vector3(0, wrist.y - inPlane * Math.cos(o.arm * D), wrist.z - inPlane * Math.sin(o.arm * D))
  }
  const first = aim(half - b.rest.upperArmL.x)
  out.hips.copy(first).addScaledVector(new Vector3(0, -1, 0).applyQuaternion(out.chest), b.trunk)
  shouldersAt(rig, out, first)
  // The shoulder girdle moves with the arms: measured, so that straight arms are exactly straight.
  shouldersAt(rig, out, aim(Math.abs(wrist.x - rig.pos.upperArmL.x)))
}

/**
 * Both legs in the plane of the body: the thigh `hip` degrees forward of
 * the pelvis's own line (which is pitched `pelvis`), the knee folded by
 * `knee` degrees, toes pointed. Needs the trunk solved first.
 */
function legs(rig: Rig, out: Pose, pelvis: number, hip: number, knee = 0, point = 46) {
  const b = rig.body
  const thigh = hip - pelvis
  const shin = thigh - knee
  for (const [side] of SIDES) {
    const leg = out.leg[side]
    const joint = rig.pos[`upperLeg${side}`]
    if (knee < 1) leg.foot.copy(joint).addScaledVector(down(thigh), (b.upperLeg + b.lowerLeg) * 0.999)
    else leg.foot.copy(joint).addScaledVector(down(thigh), b.upperLeg).addScaledVector(down(shin), b.lowerLeg)
    leg.knee.copy(front(thigh))
    leg.rot.copy(pitch(-shin + point))
    leg.toes = -18
  }
}

const mid = (rig: Rig, bone: 'upperArm' | 'upperLeg') => rig.pos[`${bone}L`].clone().add(rig.pos[`${bone}R`]).multiplyScalar(0.5)

/**
 * How far a trunk asked to be level has to be tipped for the hip joints to
 * be exactly as high as the shoulder joints: the shoulder girdle sits
 * differently in every position, so it is measured, once per body.
 */
const tips = new Map<string, number>()
function levelled(rig: Rig, out: Pose, key: string, build: (tip: number) => void): number {
  const id = `${key} ${rig.body.id}`
  let tip = tips.get(id)
  if (tip === undefined) {
    tip = 0
    for (let i = 0; i < 4; i++) {
      build(tip)
      rig.solve(out)
      const sh = mid(rig, 'upperArm'), hp = mid(rig, 'upperLeg')
      // Head towards -Z (face up): a larger pitch lowers the hips. Head towards +Z: it raises them.
      tip += (Math.atan2(hp.y - sh.y, Math.abs(hp.z - sh.z)) / D) * (hp.z > sh.z ? 1 : -1)
    }
    tips.set(id, tip)
  }
  return tip
}

/** A hold is never quite still: a slow breath and a faster tremor, a degree or so. */
const waver = (t: number) => 0.7 * Math.sin(t * Math.PI * 2) + 0.3 * Math.sin(t * Math.PI * 6 + 1)

// ── Front levers ───────────────────────────────────────────────────────

/** Face up under the bar, body level from shoulders to feet: `spread` opens the legs, `w` tips the whole body a little. */
function frontLever(rig: Rig, out: Pose, arm: number, spread: number, w: number, key: string) {
  // The legs carry on along the line from shoulder joints to hip joints, which is not quite the pelvis's own.
  const build = (tip: number, legs = tip) => {
    under(rig, out, { arm, chest: -90 + tip, pelvis: -90 + tip, head: -76 + tip, roll: arm * 0.55, shrug: -0.8, elbow: -0.3 })
    straightLegs(rig, out, legs, 48, spread)
  }
  const tip = levelled(rig, out, key, build)
  build(tip + w, tip)
}

/**
 * Straddle front lever: the front lever with the legs opened wide, which
 * brings their weight nearer the bar. The hips stay fully open.
 */
export const straddleFrontLever: Motion = {
  id: 'straddle-fl',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 5,
  camera: 'three-quarter',
  azimuth: 36,
  elevation: 16,
  props: bar,
  standard: 'Arms locked; shoulders, hips and feet in one level line with the hips fully open, no pike; legs straight and opened wide, toes pointed.',
  effort: (t) => 0.86 + 0.1 * waver(t),
  pose(t, rig, out) {
    frontLever(rig, out, 37, 42, waver(t) * 0.8, 'straddle-fl')
  },
}

/**
 * Front lever: the whole body one level line, face up under the bar, on
 * locked arms that press the bar towards the hips.
 */
export const frontLeverFull: Motion = {
  id: 'front-lever',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 5,
  camera: 'side',
  azimuth: 114,
  elevation: 3,
  props: bar,
  standard: 'Arms locked; shoulders, hips and ankles in one straight, level line, no sag and no pike; legs together, toes pointed; shoulders pulled down.',
  effort: (t) => 0.9 + 0.1 * waver(t),
  pose(t, rig, out) {
    frontLever(rig, out, 42, 0, waver(t) * 0.8, 'front-lever')
  },
}

// ── Behind the bar ─────────────────────────────────────────────────────

/** Where the elbows point with the arms behind the body: more towards the head than out, as an arm turns when it is taken behind the back. */
const BEHIND = 1.67
/** With the arms behind the body it is the front of the shoulder that holds, not its side. */
const FRONT_OF_SHOULDER = { delt_lat: 0.3 }

/**
 * Tuck back lever: turned over through skin the cat and stopped face down,
 * the back level and the knees held under the chest.
 */
export const tuckBackLever: Motion = {
  id: 'tuck-back-lever',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 5,
  camera: 'side',
  azimuth: 62,
  elevation: 3,
  props: bar,
  detail: FRONT_OF_SHOULDER,
  standard: 'Face down under the bar on locked arms, hands behind the back; the back level, hips as high as the shoulders; knees tucked under the chest.',
  effort: (t) => 0.72 + 0.1 * waver(t),
  pose(t, rig, out) {
    const build = (tip: number) => {
      under(rig, out, { arm: -21, chest: 94 + tip, pelvis: 84 + tip, head: 78 + tip, roll: -12, shrug: -0.5, elbow: BEHIND })
      legs(rig, out, 84 + tip, 132, 142, 40)
    }
    build(levelled(rig, out, 'tuck-back-lever', build) + waver(t))
  },
}

/**
 * Back lever: the same position opened out until the whole body is one
 * level line, face down.
 */
export const backLever: Motion = {
  id: 'back-lever',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 5,
  camera: 'side',
  azimuth: 66,
  elevation: 3,
  props: bar,
  detail: FRONT_OF_SHOULDER,
  standard: 'Face down under the bar on locked arms; shoulders, hips and ankles in one straight, level line, with no arch to hold the legs up; legs together, toes pointed.',
  effort: (t) => 0.86 + 0.1 * waver(t),
  pose(t, rig, out) {
    // As in the front lever, the legs carry on along the line of the joints.
    const build = (tip: number, line = tip) => {
      under(rig, out, { arm: -42, chest: 90 + tip, pelvis: 90 + tip, head: 78 + tip, roll: -24, shrug: -0.5, elbow: BEHIND })
      legs(rig, out, 90 + tip, line, 0, 48)
    }
    const tip = levelled(rig, out, 'back-lever', build)
    build(tip + waver(t) * 0.8, tip)
  },
}

/**
 * German hang: what skin the cat lowers into. The arms are behind the body
 * and the hips have sunk below the bar until the shoulders stop them; the
 * legs hang, and the shoulders stay switched on.
 */
export const germanHang: Motion = {
  id: 'german-hang',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'hold',
  period: 6,
  camera: 'side',
  azimuth: 64,
  elevation: 3,
  props: bar,
  detail: FRONT_OF_SHOULDER,
  standard: 'Hanging on locked arms that are behind the body, shoulders opened as far as they allow and still active; hips sunk below the bar; legs straight and together, feet clear of the floor.',
  effort: (t) => 0.5 + 0.08 * Math.sin(t * Math.PI * 2),
  pose(t, rig, out) {
    // A breath: the hips sink a little further and come back.
    const sink = 0.5 - 0.5 * Math.cos(t * Math.PI * 2)
    const lean = 54 - 4 * sink
    under(rig, out, { arm: -24 + 1.5 * sink, chest: lean, pelvis: lean - 5, head: lean - 22, roll: -14, shrug: -0.3 - 0.2 * sink, elbow: BEHIND })
    legs(rig, out, lean - 5, 30 + 2 * sink, 0, 50)
  },
}

// ── Turning over ───────────────────────────────────────────────────────

/** A smooth path through keys, each `[where, ...values]`; it rests at both ends. */
function through(keys: number[][], at: number): number[] {
  const n = keys.length
  let i = 0
  while (i < n - 2 && at > keys[i + 1][0]) i++
  const a = keys[i], b = keys[i + 1]
  const h = b[0] - a[0]
  const f = Math.min(1, Math.max(0, (at - a[0]) / h))
  const slope = (j: number, k: number) => (j <= 0 || j >= n - 1 ? 0 : (keys[j + 1][k] - keys[j - 1][k]) / (keys[j + 1][0] - keys[j - 1][0]))
  const f2 = f * f, f3 = f2 * f
  return a.map((_, k) => (2 * f3 - 3 * f2 + 1) * a[k] + (f3 - 2 * f2 + f) * h * slope(i, k) + (3 * f2 - 2 * f3) * b[k] + (f3 - f2) * h * slope(i + 1, k))
}

/**
 * Skin the cat, from the hang (0) to the German hang (1). Each line is a
 * moment: the arms' angle, the pitch of ribcage and pelvis, the fold of hip
 * and knee, the point of the feet, the head against the ribcage, the
 * shoulders, the elbows.
 *
 * The arms are a little longer than the trunk and no more, so the legs
 * only go under the bar folded as small as they will go, heels at the
 * seat and the feet pulled back out of the bar's way.
 */
const CAT: number[][] = [
  //  at  arm chest pelvis  hip knee point head shrug elbow
  [0.0, 0, 1, 5, 14, 0, 46, -5, -0.1, 0.5],
  [0.12, 5, -8, -30, 96, 112, 40, 4, -0.5, 0.4],
  [0.3, 19, -76, -100, 152, 150, -6, 14, -0.8, 0],
  [0.46, 10, -140, -160, 160, 156, -24, 12, -1, 0],
  [0.62, -6, -205, -223, 160, 156, -20, 8, -1, 0.3],
  [0.74, -18, -252, -274, 140, 150, 20, -4, -0.7, 1.2],
  [0.87, -23, -285, -298, 86, 96, 40, -14, -0.4, BEHIND],
  [1.0, -24, -306, -311, 30, 0, 50, -22, -0.3, BEHIND],
]

function cat(rig: Rig, out: Pose, u: number) {
  const [, arm, chest, pelvis, hip, knee, point, head, shrug, elbow] = through(CAT, u)
  under(rig, out, { arm, chest, pelvis, head: chest + head, shrug, elbow })
  legs(rig, out, pelvis, hip, Math.max(0, knee), point)
}

/** 0 to 1 at an even pace, eased only as it sets off and as it arrives. */
function glide(x: number, soft = 0.22): number {
  const top = 1 / (1 - soft)
  if (x <= 0) return 0
  if (x >= 1) return 1
  if (x < soft) return (top * x * x) / (2 * soft)
  if (x > 1 - soft) return 1 - (top * (1 - x) * (1 - x)) / (2 * soft)
  return top * (x - soft / 2)
}

/** How far through skin the cat the body is at t: a breath in the hang, over, a second in the German hang, back the same way. */
const turn = (t: number) => (t < 0.03 ? 0 : t < 0.44 ? glide((t - 0.03) / 0.41) : t < 0.55 ? 1 : t < 0.96 ? 1 - glide((t - 0.55) / 0.41) : 0)

/**
 * Skin the cat: from a hang the knees come to the chest, the body turns
 * over backwards with the legs passing between the arms and under the bar,
 * and lowers on the far side into the German hang. Then the same road back.
 */
export const skinTheCat: Motion = {
  id: 'skin-the-cat',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 11,
  camera: 'side',
  azimuth: 66,
  elevation: 3,
  beat: 0.96,
  props: bar,
  detail: FRONT_OF_SHOULDER,
  // The lats turn the body over and bring it back; in the German hang the front of the shoulders carries it.
  shift: (t) => { const behind = Math.min(1, Math.max(0, (turn(t) - 0.55) / 0.3)); return { lats: 1 - 0.5 * behind, delt_ant: 0.45 + 0.55 * behind } },
  standard: 'From a hang, tucked tight; the legs pass between the arms and under the bar; lowered under control into the German hang, hips below the bar and feet off the floor; back the same way to the hang; arms straight throughout.',
  effort: (t) => { const u = turn(t); return lerp(0.35, 0.6, u) + 0.35 * Math.sin(u * Math.PI) },
  pose(t, rig, out) {
    cat(rig, out, turn(t))
  },
}

// ── Windshield wipers ──────────────────────────────────────────────────

/** How far each side the legs swing, degrees from upright. */
const WIPE = 62
/** How far in front of the bar the legs pass it (metres on the reference body): room for the hands they swing past. */
const PAST = 0.15

/** The pitch of the ribcage that brings the insteps up to the bar with the legs straight. Worked out once per body. */
const piked = new Map<string, number>()
function pikedUnderBar(rig: Rig, out: Pose): number {
  const b = rig.body
  const known = piked.get(b.id)
  if (known !== undefined) return known
  const rail = highBar(b)
  // The ankles finish a little under the bar and in front of it; the pointed toes reach past it.
  const need = (b.upperLeg + b.lowerLeg) * 0.999 + 0.05 * b.scale
  const at = new Vector3(0, rail.height, PAST * b.scale)
  const gap = (lean: number) => {
    wiperTrunk(rig, out, lean, 0)
    return mid(rig, 'upperLeg').distanceTo(at) - need
  }
  let a = -50, fa = gap(a), z = -65, fz = gap(z)
  for (let i = 0; i < 14 && Math.abs(fz) > 1e-4 && fz !== fa; i++) {
    const next = Math.max(-95, Math.min(-20, z - (fz * (z - a)) / (fz - fa)))
    a = z; fa = fz; z = next; fz = gap(z)
  }
  piked.set(b.id, z)
  return z
}

/** The trunk of the wipers: hanging face up with the hips as high as straight legs to the bar allow, the pelvis curled up and turned with the legs. */
function wiperTrunk(rig: Rig, out: Pose, lean: number, swing: number) {
  under(rig, out, { arm: 18, chest: lean, pelvis: lean - 38, head: lean + 16, roll: 8, shrug: -0.9, elbow: -0.3, turn: swing * 0.85 })
}

/**
 * Hanging windshield wipers: folded up under the bar with straight legs and
 * the feet at it, the legs swing as one from side to side, turning at the
 * waist. The shoulders stay square and the hips stay up.
 */
export const windshieldWipers: Motion = {
  id: 'windshield-wipers',
  revision: 1,
  stage: 'tall',
  planted: ['handL', 'handR'],
  kind: 'reps',
  period: 5,
  camera: 'front',
  azimuth: 24,
  elevation: 6,
  beat: 0.75,
  props: bar,
  standard: 'Arms straight, hips held high with the feet up at the bar; legs straight and together; they turn from the waist well past 45° to each side and are stopped there, not dropped; the hips do not sink and the shoulders stay square.',
  effort: (t) => 0.62 + 0.33 * Math.abs(Math.sin(t * Math.PI * 2)),
  pose(t, rig, out) {
    const b = rig.body
    // To one side, back through the middle, to the other: slowest where it turns round.
    const swing = WIPE * Math.sin((Math.PI / 2) * Math.sin(t * Math.PI * 2))
    wiperTrunk(rig, out, pikedUnderBar(rig, out), swing)
    const rail = highBar(b)
    const hips = mid(rig, 'upperLeg')
    const side = new Quaternion().setFromAxisAngle(FORWARD, swing * D)
    // Upright, the legs point from the hips at a line just in front of the bar; from there they swing round the hips like the hand of a clock.
    const up = new Vector3(0, rail.height - hips.y, PAST * b.scale - hips.z).normalize()
    const a = Math.atan2(up.z, -up.y) / D
    const along = up.applyQuaternion(side)
    for (const [which] of SIDES) {
      const leg = out.leg[which]
      leg.foot.copy(rig.pos[`upperLeg${which}`]).addScaledVector(along, (b.upperLeg + b.lowerLeg) * 0.999)
      leg.knee.copy(front(a)).applyQuaternion(side)
      leg.rot.copy(side).multiply(pitch(-a + 48))
      leg.toes = -18
    }
  },
}

/** Levers and turning over under the bar, easiest first by the library's own ratings. */
export const LEVERS: Motion[] = [germanHang, skinTheCat, tuckBackLever, windshieldWipers, backLever, straddleFrontLever, frontLeverFull]
