import { Vector3 } from 'three'
import { pitch, type Rig } from '../rig'
import { handsOnFloor, proneAt, wristHeight } from './kit'
import { lerp, there, type Motion } from './types'

const half = (rig: Rig) => rig.body.rest.upperArmL.x + 0.035 * rig.body.scale
const elbows = new Vector3(0.72, 0.25, -1)

/** Where the hands go: under the shoulders as they are at the top. Worked out once per body. */
const placed = new Map<string, { top: number; hands: number }>()
function setUp(rig: Rig) {
  let p = placed.get(rig.body.id)
  if (!p) {
    const b = rig.body
    const top = wristHeight(b) + (b.upperArm + b.lowerArm) * 0.995
    const out = { hips: new Vector3(), pelvis: pitch(0), chest: pitch(0), head: pitch(0), arm: { L: arm(), R: arm() }, leg: { L: leg(), R: leg() } }
    const shoulder = proneAt(rig, out, 0, top, (s) => handsOnFloor(b, out, s.z - 0.004 * b.scale, half(rig), elbows))
    p = { top, hands: shoulder.z - 0.004 * b.scale }
    placed.set(b.id, p)
  }
  return p
}
const arm = () => ({ hand: new Vector3(), rot: pitch(0), elbow: new Vector3(), grip: 0, shrug: 0 })
const leg = () => ({ foot: new Vector3(), rot: pitch(0), knee: new Vector3(), toes: 0 })

/**
 * Push-up. A straight line from heel to shoulder turns about the toes; the
 * hands stay under the shoulders' top position, a little wider than them;
 * the elbows travel back at about 45 degrees; the chest stops a hand's
 * thickness from the floor.
 */
export const pushup: Motion = {
  id: 'pushup',
  revision: 1,
  kind: 'reps',
  period: 2.9,
  camera: 'side',
  azimuth: 68,
  elevation: 7,
  beat: 0.97,
  detail: { delt_lat: 0.14, delt_ant: 0.6, pec_upper: 0.85 },
  standard: 'Body straight from heels to head throughout; chest to within a fist of the floor; elbows fully straight at the top; elbows about 45° from the ribs.',
  effort: (t) => 0.35 + 0.65 * there(t, 0.42, 0.06),
  pose(t, rig, out) {
    const b = rig.body
    const u = there(t, 0.42, 0.06)
    const { top, hands } = setUp(rig)
    const low = 0.2 * b.scale
    const shoulder = proneAt(rig, out, 0, lerp(top, low, u), () => handsOnFloor(b, out, hands, half(rig), elbows))
    const lean = Math.asin(Math.min(1, (shoulder.y - rig.pos.upperLegL.y) / b.trunk)) * (180 / Math.PI)
    out.head.copy(pitch(90 - lean - 14 + 6 * u))
  },
}
