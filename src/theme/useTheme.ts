import { createContext, useCallback, useContext, useMemo } from 'react'
import { SKILLS } from '@/domain/catalog'
import { isVerified } from '@/domain/scoring/config'
import { useAthleteModel, useIsAdmin } from '@/data/hooks'
import { useStore } from '@/data/store'
import { isReleased, personalOf, wearing, type Standing, type Wearing } from './personal'
import { THEMES, type ThemeId } from './themes'
import { officialScene, sceneFor, stageKeyOf } from '@/visual/scenes'
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

/** The place every official assessment is shown in. */
export const useOfficialScene = () => useStore((s) => officialScene(s.auraSettings.scenes ?? {}))

/** The look the signed-in athlete has right now. */
export function useWearing(): Wearing {
  const admin = useIsAdmin()
  const style = useStore((s) => (s.meId ? s.athletes[s.meId]?.style : undefined))
  const released = useStore((s) => s.auraSettings.universes)
  const scenes = useStore((s) => s.settings.scenes)
  const releasedScenes = useStore((s) => s.auraSettings.scenes)
  const standing = useStanding()
  return useMemo(() => {
    const worn = wearing(personalOf({ style }), standing, released, admin)
    // The place it stands in: chosen on this device, for each stage, from what the owner has released; else the stage's default.
    const stage = stageKeyOf(worn.universe, THEMES[worn.theme].variant)
    return { ...worn, scene: sceneFor(stage, scenes?.[stage], releasedScenes ?? {}, admin) }
  }, [style, standing, released, admin, scenes, releasedScenes])
}
