import type { CurvePoint } from '../types'
import { SCORING } from './config'

/**
 * Read a rating off a calibration curve.
 * Linear between anchors, linear from the origin below the first anchor, and a
 * damped, capped continuation above the last one so exceptional performances
 * can exceed the calibrated range without running away.
 */
export function curveRating(curve: readonly CurvePoint[] | undefined, value: number): number {
  if (!curve || curve.length === 0 || value <= 0) return 0
  const [v0, r0] = curve[0]
  if (value <= v0) return (r0 * value) / v0

  for (let i = 1; i < curve.length; i++) {
    const [pv, pr] = curve[i - 1]
    const [v, r] = curve[i]
    if (value <= v) return pr + ((r - pr) * (value - pv)) / (v - pv)
  }

  const [vn, rn] = curve[curve.length - 1]
  const [vp, rp] = curve.length > 1 ? curve[curve.length - 2] : ([0, 0] as const)
  const slope = (rn - rp) / (vn - vp)
  return Math.min(rn * 1.25, rn + slope * SCORING.extrapolation * (value - vn))
}
