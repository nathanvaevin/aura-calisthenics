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

/**
 * The level-up, in three sounds that follow the animation: a charge that rises
 * through the build-up, a rush for the flight, and a deep hit with a bright
 * chord over it on impact. Times are seconds from now.
 */
export function ascendSound(launchAt: number, impactAt: number, level = 0) {
  try {
    const ctx = context()
    if (!ctx) return
    const now = ctx.currentTime
    const out = ctx.createGain()
    out.gain.value = 0.9
    out.connect(ctx.destination)

    // Charge: a low tone climbing, trembling faster as it goes.
    const charge = ctx.createOscillator()
    const chargeGain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    charge.type = 'sawtooth'
    charge.frequency.setValueAtTime(55, now)
    charge.frequency.exponentialRampToValueAtTime(330, now + launchAt)
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(220, now)
    filter.frequency.exponentialRampToValueAtTime(2400, now + launchAt)
    chargeGain.gain.setValueAtTime(0.0001, now)
    chargeGain.gain.exponentialRampToValueAtTime(0.05, now + launchAt * 0.9)
    chargeGain.gain.exponentialRampToValueAtTime(0.0001, now + launchAt + 0.08)
    const tremble = ctx.createOscillator()
    const trembleGain = ctx.createGain()
    tremble.frequency.setValueAtTime(5, now)
    tremble.frequency.linearRampToValueAtTime(26, now + launchAt)
    trembleGain.gain.value = 0.018
    tremble.connect(trembleGain).connect(chargeGain.gain)
    charge.connect(filter).connect(chargeGain).connect(out)
    charge.start(now)
    tremble.start(now)
    charge.stop(now + launchAt + 0.1)
    tremble.stop(now + launchAt + 0.1)

    // Flight: filtered noise sweeping upward.
    const flight = Math.max(0.2, impactAt - launchAt)
    const noise = ctx.createBufferSource()
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * (flight + 0.5)), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    noise.buffer = buffer
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.Q.value = 0.9
    band.frequency.setValueAtTime(260, now + launchAt)
    band.frequency.exponentialRampToValueAtTime(4200, now + impactAt)
    const rush = ctx.createGain()
    rush.gain.setValueAtTime(0.0001, now + launchAt)
    rush.gain.exponentialRampToValueAtTime(0.11, now + launchAt + flight * 0.8)
    rush.gain.exponentialRampToValueAtTime(0.0001, now + impactAt + 0.35)
    noise.connect(band).connect(rush).connect(out)
    noise.start(now + launchAt)
    noise.stop(now + impactAt + 0.45)

    // Impact: a drop in pitch you feel, then the chord.
    const hit = ctx.createOscillator()
    const hitGain = ctx.createGain()
    hit.frequency.setValueAtTime(150, now + impactAt)
    hit.frequency.exponentialRampToValueAtTime(38, now + impactAt + 0.5)
    hitGain.gain.setValueAtTime(0.0001, now + impactAt)
    hitGain.gain.exponentialRampToValueAtTime(0.3, now + impactAt + 0.012)
    hitGain.gain.exponentialRampToValueAtTime(0.0001, now + impactAt + 0.75)
    hit.connect(hitGain).connect(out)
    hit.start(now + impactAt)
    hit.stop(now + impactAt + 0.8)
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].slice(0, 4 + Math.min(2, level))
    chord.forEach((f, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = f
      const t = now + impactAt + 0.02 + i * 0.07
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.055, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4)
      osc.connect(gain).connect(out)
      osc.start(t)
      osc.stop(t + 2.5)
    })
    window.setTimeout(() => void ctx.close(), (impactAt + 3.4) * 1000)
  } catch {
    /* Audio is a nicety; never let it break an interaction. */
  }
}
