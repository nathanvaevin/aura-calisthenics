import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '@/data/store'
import { disciplineById, skillById } from '@/domain/catalog'
import { BANDS } from '@/domain/scoring/config'
import { chime } from '@/lib/sound'
import { dvar } from '@/lib/format'
import { Eyebrow, TierTag } from './primitives'

/**
 * The unlock moment. Reserved for demonstrated skills, and scaled to what was
 * achieved: a first wall walk is a quiet nod, a planche fills the screen.
 */
export function Celebrations() {
  const current = useStore((s) => s.celebrations[0])
  const dismiss = useStore((s) => s.dismissCelebration)
  const sound = useStore((s) => s.settings.sound)
  const navigate = useNavigate()

  const skill = current ? skillById[current.skillId] : null
  const level = skill ? BANDS.findIndex((b) => b.id === skill.band) : 0

  useEffect(() => {
    if (current && sound) chime(level)
  }, [current, sound, level])

  return createPortal(
    <AnimatePresence>
      {current && skill && (
        <motion.div
          key={current.id}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-bg/92 px-6 backdrop-blur-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 3 + level }, (_, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border"
                style={{ borderColor: dvar(skill.discipline), width: 150, height: 150 }}
                initial={{ scale: 0.4, opacity: 0.7 }}
                animate={{ scale: 3.2 + level * 0.7 + i * 0.5, opacity: 0 }}
                transition={{ duration: 2.4 + level * 0.3, delay: i * 0.22, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
            <motion.span
              className="absolute rounded-full"
              style={{
                width: 280 + level * 60, height: 280 + level * 60,
                background: `radial-gradient(circle, ${dvar(skill.discipline)} 0%, transparent 68%)`,
                filter: 'blur(42px)', mixBlendMode: 'var(--aura-blend)' as never,
              }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 + level * 0.06 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <motion.div
            className="relative flex max-w-md flex-col items-center text-center"
            initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow className="mb-5" >Skill unlocked · {BANDS[level].label}</Eyebrow>
            <h2 className="display text-[46px] leading-[1.02] sm:text-[58px]">{skill.name}</h2>
            <p className="mt-5 text-[14.5px] text-ink-2">
              A <span className="num font-medium text-ink">{skill.rating}</span>-point benchmark in {disciplineById[skill.discipline].name}.
            </p>
            <div className="mt-4">
              <TierTag tier={current.tier} />
            </div>
            <p className="mt-3 max-w-xs text-[12.5px] text-ink-3">Self-reported for now. A coach can verify it from a session or a video.</p>
          </motion.div>

          <motion.div
            className="safe-bottom absolute inset-x-6 bottom-8 mx-auto flex max-w-sm flex-col gap-2.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          >
            <button className="btn btn-primary btn-lg" onClick={() => dismiss(current.id)}>Continue</button>
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
      )}
    </AnimatePresence>,
    document.body,
  )
}
