type Ctx = typeof AudioContext

const context = () => {
  const C: Ctx | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctx }).webkitAudioContext
  return C ? new C() : null
}

function tones(freqs: number[], gap: number, peak: number, tail: number) {
  try {
    const ctx = context()
    if (!ctx) return
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      const t = ctx.currentTime + i * gap
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + tail)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + tail + 0.05)
    })
    window.setTimeout(() => void ctx.close(), (freqs.length * gap + tail + 0.3) * 1000)
  } catch {
    /* Audio is a nicety; never let it break an interaction. */
  }
}

/** A short rising chord for an unlocked skill. Higher bands add notes. */
export const chime = (level = 0) => tones([523.25, 659.25, 783.99, 1046.5, 1318.5].slice(0, 2 + Math.min(3, level)), 0.11, 0.07, 1.5)

/** Two soft ticks when a rest period ends. */
export const tick = () => tones([880, 1174.7], 0.14, 0.05, 0.25)
