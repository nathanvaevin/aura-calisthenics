import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion, type TargetAndTransition, type Transition } from 'motion/react'
import { useIsAdmin } from '@/data/hooks'
import { useStore } from '@/data/store'
import { disciplineById, skillById } from '@/domain/catalog'
import { BANDS } from '@/domain/scoring/config'
import { isUnlocked } from '@/theme/personal'
import { THEMES, UNIVERSES, UNIVERSE_IDS, type Form, type UniverseId } from '@/theme/themes'
import { useStanding, useThemeId, useVoice, useWearing } from '@/theme/useTheme'
import { chime } from '@/lib/sound'
import { dvar } from '@/lib/format'
import { Eyebrow, TierTag } from './primitives'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * What fills the screen behind an unlock. Each universe celebrates in its
 * own manner: Aura in widening rings of light, Anime Power in a burst of
 * speed lines, Iron Will in one heavy stroke. `level` scales it to what was
 * achieved.
 */
function Burst({ universe, colour, level }: { universe: UniverseId; colour: string; level: number }) {
  if (universe === 'power') {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.span
          className="absolute aspect-square w-[220vmax]"
          style={{
            background: `repeating-conic-gradient(from 0deg, ${colour} 0deg 1.1deg, transparent 1.1deg ${7 - Math.min(level, 4) * 0.7}deg)`,
            maskImage: 'radial-gradient(circle, transparent 9%, #000 26%, transparent 62%)', WebkitMaskImage: 'radial-gradient(circle, transparent 9%, #000 26%, transparent 62%)',
          }}
          initial={{ scale: 0.3, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: [0, 0.55, 0.28], rotate: 6 }}
          transition={{ duration: 2.2 + level * 0.2, ease: EASE }}
        />
        <motion.span
          className="absolute rounded-full" style={{ width: 300 + level * 70, height: 300 + level * 70, background: `radial-gradient(circle, ${colour} 0%, transparent 66%)`, filter: 'blur(34px)', mixBlendMode: 'screen' }}
          initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: [0.2, 1.25, 1], opacity: [0, 0.9, 0.55] }} transition={{ duration: 1.1, ease: EASE }}
        />
        <motion.span className="absolute inset-0 bg-white" initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} />
      </div>
    )
  }
  if (universe === 'iron') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2].slice(0, 1 + Math.min(2, Math.floor(level / 2))).map((i) => (
          <motion.span
            key={i} className="absolute left-[-10%] h-[3px] w-[120%] origin-left" style={{ top: `${38 + i * 13}%`, background: i === 0 ? colour : 'var(--text)', rotate: -7 + i * 5 }}
            initial={{ scaleX: 0, opacity: 0.9 }} animate={{ scaleX: 1, opacity: [0.9, 0.9, 0.25] }} transition={{ duration: 0.5, delay: 0.08 + i * 0.12, ease: [0.7, 0, 0.2, 1] }}
          />
        ))}
        <motion.span
          className="absolute inset-0" style={{ background: `radial-gradient(60% 46% at 50% 46%, ${colour} 0%, transparent 70%)`, mixBlendMode: 'screen' }}
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.34, 0.16] }} transition={{ duration: 1.2 }}
        />
      </div>
    )
  }
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: 3 + level }, (_, i) => (
        <motion.span
          key={i} className="absolute rounded-full border" style={{ borderColor: colour, width: 150, height: 150 }}
          initial={{ scale: 0.4, opacity: 0.7 }} animate={{ scale: 3.2 + level * 0.7 + i * 0.5, opacity: 0 }}
          transition={{ duration: 2.4 + level * 0.3, delay: i * 0.22, ease: EASE }}
        />
      ))}
      <motion.span
        className="absolute rounded-full"
        style={{ width: 280 + level * 60, height: 280 + level * 60, background: `radial-gradient(circle, ${colour} 0%, transparent 68%)`, filter: 'blur(42px)', mixBlendMode: 'var(--aura-blend)' as never }}
        initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 0.5 + level * 0.06 }} transition={{ duration: 1.4, ease: EASE }}
      />
    </div>
  )
}

/** How the headline arrives: it rises in Aura, cuts in at speed in Anime Power, lands with weight in Iron Will. */
const ARRIVAL: Record<UniverseId, { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition }> = {
  aura: { initial: { y: 18, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.9, delay: 0.25, ease: EASE } },
  power: { initial: { x: -70, opacity: 0, skewX: -14 }, animate: { x: 0, opacity: 1, skewX: 0 }, transition: { duration: 0.5, delay: 0.18, ease: EASE } },
  iron: { initial: { scale: 1.5, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.28, delay: 0.2, ease: [0.7, 0, 0.2, 1] } },
}

/**
 * The unlock moment. Reserved for demonstrated skills, and scaled to what was
 * achieved: a first wall walk is a quiet nod, a planche fills the screen.
 * What was achieved is stated the same way in every theme; how it is
 * celebrated is the theme's own.
 */
export function Celebrations() {
  const current = useStore((s) => s.celebrations[0])
  const dismiss = useStore((s) => s.dismissCelebration)
  const sound = useStore((s) => s.settings.sound)
  const navigate = useNavigate()
  const universe = THEMES[useThemeId()].universe
  const v = useVoice()

  const skill = current ? skillById[current.skillId] : null
  const level = skill ? BANDS.findIndex((b) => b.id === skill.band) : 0

  useEffect(() => {
    if (current && sound) chime(level)
  }, [current, sound, level])

  return createPortal(
    <AnimatePresence>
      {current && skill ? (
        <motion.div
          key={current.id}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-bg/92 px-6 backdrop-blur-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
        >
          <Burst universe={universe} colour={dvar(skill.discipline)} level={level} />

          <motion.div className="relative flex max-w-md flex-col items-center text-center" {...ARRIVAL[universe]}>
            <Eyebrow className="mb-5">{v('celebrate.eyebrow', { band: BANDS[level].label })}</Eyebrow>
            <h2 className="display text-[46px] leading-[1.02] sm:text-[58px]">{skill.name}</h2>
            <p className="mt-5 text-[14.5px] text-ink-2">
              A <span className="num font-medium text-ink">{skill.rating}</span>-point benchmark in {disciplineById[skill.discipline].name}.
            </p>
            <div className="mt-4">
              <TierTag tier={current.tier} />
            </div>
            <p className="mt-3 max-w-xs text-[12.5px] text-ink-3">Self-reported for now. A coach can verify it from a session or a video.</p>
            <p className="display mt-6 max-w-xs text-[19px] leading-snug text-ink-2">{v('celebrate.line')}</p>
          </motion.div>

          <motion.div
            className="safe-bottom absolute inset-x-6 bottom-8 mx-auto flex max-w-sm flex-col gap-2.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          >
            <button className="btn btn-primary btn-lg" onClick={() => dismiss(current.id)}>{v('celebrate.continue')}</button>
            <button
              className="btn btn-outline"
              onClick={() => {
                dismiss(current.id)
                navigate(`/tree?d=${skill.discipline}`)
              }}
            >
              See it in your skill tree
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <FormUnlock key="form" />
      )}
    </AnimatePresence>,
    document.body,
  )
}

const keyOf = (universe: UniverseId, form: Form) => `${universe}:${form.id}`

/**
 * A new Aura form has been earned. It is offered once, after any skill
 * celebration, and never in the middle of a workout or an assessment. What
 * unlocks a form only reads the athlete's results; wearing one changes none.
 */
function FormUnlock() {
  const meId = useStore((s) => s.meId)
  const seen = useStore((s) => s.settings.seenForms)
  const setSettings = useStore((s) => s.setSettings)
  const setStyle = useStore((s) => s.setStyle)
  const sound = useStore((s) => s.settings.sound)
  const admin = useIsAdmin()
  const standing = useStanding()
  const look = useWearing()
  const v = useVoice()
  const { pathname } = useLocation()
  const busy = pathname.startsWith('/assess/') || pathname === '/workout' || pathname === '/welcome' || pathname === '/personalize'

  const earned = useMemo(
    () => UNIVERSE_IDS.flatMap((u) => UNIVERSES[u].list.filter((f) => isUnlocked(f.unlock, standing)).map((f) => keyOf(u, f))),
    [standing],
  )
  // The first time on a device nothing is announced: what is already earned is simply there.
  useEffect(() => {
    if (meId && !seen) setSettings({ seenForms: earned })
  }, [meId, seen, earned, setSettings])

  const fresh = !meId || !seen || admin || busy ? null : UNIVERSES[look.universe].list.find((f) => f.unlock.kind !== 'start' && earned.includes(keyOf(look.universe, f)) && !seen.includes(keyOf(look.universe, f)))
  useEffect(() => {
    if (fresh && sound) chime(3)
  }, [fresh, sound])
  if (!fresh || !seen) return null
  const close = () => setSettings({ seenForms: [...new Set([...seen, ...earned])] })

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-bg/92 px-6 backdrop-blur-xl"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
    >
      <Burst universe={look.universe} colour={fresh.colour} level={3} />
      <motion.div className="relative flex max-w-md flex-col items-center text-center" {...ARRIVAL[look.universe]}>
        <Eyebrow className="mb-5">{v('form.unlocked.eyebrow')}</Eyebrow>
        <span className="mb-4 h-4 w-4 rounded-full" style={{ background: fresh.colour, boxShadow: `0 0 34px 8px ${fresh.colour}` }} />
        <h2 className="display text-[52px] leading-[1.02] sm:text-[64px]">{fresh.name}</h2>
        <p className="mt-4 text-[14.5px] text-ink-2">{fresh.line}</p>
        <p className="display mt-6 max-w-xs text-[19px] leading-snug text-ink-2">{v('form.unlocked.line')}</p>
      </motion.div>
      <motion.div className="safe-bottom absolute inset-x-6 bottom-8 mx-auto flex max-w-sm flex-col gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <button className="btn btn-primary btn-lg" onClick={() => { setStyle({ forms: { [look.universe]: fresh.id } }); close() }}>{v('form.wear')}</button>
        <button className="btn btn-outline" onClick={close}>Not now</button>
      </motion.div>
    </motion.div>
  )
}
