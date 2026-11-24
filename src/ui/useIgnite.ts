import { useCallback, useRef, useState } from 'react'
import { IGNITE_BURST, IGNITE_SECONDS } from './AuraField'
import { nebula } from './nebula'

/**
 * Lighting the Aura before moving on: the ring fills with golden light, the
 * Aura bursts into a nebula that fills the screen, and the next screen comes
 * out of it. Give `ignite` what is to happen then; it may be
 * something that takes time (joining a session), which is started at once and
 * awaited, so the wait is spent on the animation and not after it. If that
 * fails the light goes out and the error is handed on.
 */
export function useIgnite() {
  const [igniting, setIgniting] = useState(false)
  const busy = useRef(false)
  const ignite = useCallback(async <T,>(work: () => T | Promise<T>, then?: (result: T) => void) => {
    if (busy.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { const result = await work(); then?.(result); return }
    busy.current = true
    setIgniting(true)
    // When the Aura bursts, a nebula pours out of it and fills the screen; the next screen arrives inside it.
    window.setTimeout(() => {
      const aura = document.querySelector('.aura-field[data-ignite]')?.getBoundingClientRect()
      nebula(aura ? { x: aura.left + aura.width / 2, y: aura.top + aura.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight * 0.32 }, IGNITE_SECONDS - IGNITE_BURST)
    }, IGNITE_BURST * 1000)
    // With something to move on to afterwards, the work starts now and the wait is spent on the animation.
    // With nothing after it, the work is itself the moving on, and waits for the burst.
    const started = then ? Promise.resolve().then(work) : null
    started?.catch(() => {})
    try {
      await new Promise((done) => window.setTimeout(done, IGNITE_SECONDS * 1000 - 80))
      if (started) then!(await started); else await work()
    } finally {
      busy.current = false
      setIgniting(false)
    }
  }, [])
  return { igniting, ignite }
}
