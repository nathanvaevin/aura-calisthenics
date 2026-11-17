import { createContext, useCallback, useContext, useMemo } from 'react'
import { SKILLS } from '@/domain/catalog'
import { isVerified } from '@/domain/scoring/config'
import { useAthleteModel, useIsAdmin } from '@/data/hooks'
import { useStore } from '@/data/store'
import { isReleased, personalOf, wearing, type Standing, type Wearing } from './personal'
import { THEMES, type ThemeId } from './themes'
import { say, type VoiceKey } from './voice'

/** The theme a part of the app is shown in, where that is not the athlete's own (an official assessment). */
export const ThemeContext = createContext<ThemeId | null>(null)

/** The theme on screen. */
export function useThemeId(): ThemeId {
  const set = useContext(ThemeContext)
  const own = usePersonalTheme()
  return set ?? own
}

/**
 * The athlete's own theme: their choice once there is an athlete and the
 * theme is released, else what this device last showed.
 */
export function usePersonalTheme(): ThemeId {
  const admin = useIsAdmin()
  return useStore((s) => {
    const me = s.meId ? s.athletes[s.meId] : null
    if (!me) return s.settings.theme
    const theme = personalOf(me).theme
    return isReleased(theme, s.auraSettings.universes, admin) ? theme : 'dark'
  })
}

export const useScheme = () => THEMES[useThemeId()].scheme

/** Lines in the voice of the theme on screen. */
export function useVoice() {
  const voice = THEMES[useThemeId()].voice
  return useCallback((key: VoiceKey, vars?: Record<string, string | number>) => say(voice, key, vars), [voice])
}

/** What the signed-in athlete has shown so far, as far as unlocks are concerned. */
export function useStanding(): Standing {
  const meId = useStore((s) => s.meId)
  const me = useAthleteModel(meId)
  return useMemo(() => {
    if (!me) return { aura: 0, skills: 0, verified: 0 }
    const mastered = SKILLS.filter((s) => me.statuses[s.id].state === 'mastered')
    const verified = mastered.filter((s) => !me.statuses[s.id].implied && me.statuses[s.id].tier && isVerified(me.statuses[s.id].tier!)).length
    return { aura: me.aura.aura, skills: mastered.length, verified }
  }, [me])
}

/** The look the signed-in athlete has right now. */
export function useWearing(): Wearing {
  const admin = useIsAdmin()
  const style = useStore((s) => (s.meId ? s.athletes[s.meId]?.style : undefined))
  const released = useStore((s) => s.auraSettings.universes)
  const standing = useStanding()
  return useMemo(() => wearing(personalOf({ style }), standing, released, admin), [style, standing, released, admin])
}
