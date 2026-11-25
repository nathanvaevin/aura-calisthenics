import { useEffect, useMemo, useRef, useState } from 'react'
import type { CharacterId } from '@/domain/media'
import { useStore } from '@/data/store'
import { Eyebrow } from '@/ui/primitives'
import { Stage3D } from '@/ui/Stage3D'
import type { DemoHandle } from '@/visual/Demo'
import type { PerformerSpec } from '@/visual/player'
import { performerOf, standardLook } from '@/theme/cast'
import { useOfficialScene } from '@/theme/useTheme'
import { chime } from '@/lib/sound'
import { cx } from '@/lib/format'

/** How long the chosen instructor's Aura is given before the assessment opens. */
const BURST_MS = 2100

/**
 * The first screen of an assessment: who demonstrates it. The two Aura master
 * characters stand side by side; the one chosen answers with a burst of the
 * Electric Aura, and the assessment opens. Every demonstration in it is then
 * performed by that character.
 *
 * Both are the standard characters, so the assessment stays the same official
 * presentation for everyone; only which of the two shows it is the athlete's.
 */
export function InstructorChoice({ initial, onDone }: { initial?: CharacterId; onDone: (c: CharacterId) => void }) {
  const sound = useStore((s) => s.settings.sound)
  const [chosen, setChosen] = useState<CharacterId | null>(null)
  const stage = useRef<DemoHandle>(null)
  const scene = useOfficialScene()

  const cast = useMemo<PerformerSpec[]>(() => (['male', 'female'] as const).map((character, i) => ({
    character, motion: null, muscles: null, x: i ? 0.4 : -0.4, style: performerOf(standardLook(character, scene)).style,
    aura: chosen === character ? { theme: 'electric', mode: 'full' as const, level: 1 } : { theme: 'electric', mode: 'off' as const },
  })), [chosen, scene])

  useEffect(() => {
    if (!chosen) return
    if (sound) chime(2)
    // The Aura is given a moment to rise, then let go all at once.
    const burst = window.setTimeout(() => stage.current?.release(chosen === 'male' ? 0 : 1), 450)
    const done = window.setTimeout(() => onDone(chosen), BURST_MS)
    return () => { window.clearTimeout(burst); window.clearTimeout(done) }
  }, [chosen, sound, onDone])

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[560px] flex-col bg-(--stage)" data-instructor-choice>
      {/* The stage fills the screen; the words lie over it, on a shade that lets the place through. */}
      <div className="absolute inset-0 overflow-hidden">
        <Stage3D cast={cast} fill safe={{ top: 150, bottom: 96 }} controls="none" margin={1.06} handle={stage} label="The two instructors, side by side" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[220px] bg-linear-to-b from-(--stage) via-(--stage)/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[130px] bg-linear-to-t from-(--stage) via-(--stage)/60 to-transparent" />
      </div>
      <div className="safe-top relative z-10 shrink-0 px-6 pt-8 text-center">
        <Eyebrow>Before you start</Eyebrow>
        <h1 className="display mt-2 text-[38px] leading-[1.04]">Choose your instructor</h1>
        <p className="mt-2 text-[14px] text-ink-2">They show you every exercise.</p>
      </div>

      <div className="relative min-h-0 flex-1">
        {/* Each half of the stage is its character. */}
        <div className="absolute inset-0 z-10 grid grid-cols-2">
          {(['male', 'female'] as const).map((c) => (
            <button
              key={c} data-instructor={c} aria-pressed={chosen === c} onClick={() => setChosen(c)}
              className={cx('group flex flex-col items-center justify-end pb-6 transition-opacity duration-500', chosen && chosen !== c && 'opacity-40')}
            >
              <span className={cx('rounded-full border px-5 py-2 text-[15px] font-medium backdrop-blur-md transition-colors', chosen === c ? 'border-transparent bg-ink text-bg' : 'border-line-strong bg-(--stage)/50 text-ink group-hover:bg-surface-2', !chosen && initial === c && 'border-ink')}>
                {c === 'male' ? 'Male' : 'Female'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="safe-bottom relative z-10 shrink-0 px-6 pt-1 pb-5 text-center text-[12.5px] text-ink-3">{chosen ? 'Starting…' : 'You can change this later.'}</p>
    </div>
  )
}
