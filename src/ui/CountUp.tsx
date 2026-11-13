import { useEffect, useRef, useState } from 'react'
import { num } from '@/lib/format'

/** Counts toward `value` whenever it changes. Starts from zero on first mount. */
export function CountUp({ value, duration = 1100 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const origin = from.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = value
      setShown(value)
      return
    }
    let raf = 0
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      const v = Math.round(origin + (value - origin) * eased)
      from.current = v
      setShown(v)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return <span className="num">{num(shown)}</span>
}
