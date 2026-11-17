import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { THEMES } from '@/theme/themes'
import { useThemeId } from '@/theme/useTheme'
import { Eyebrow } from '@/ui/primitives'
import { CharacterStudio } from './CharacterStudio'

/** The athlete's Character Studio on its own, reached from the profile at any time. */
export default function CharacterPage() {
  const navigate = useNavigate()
  const theme = THEMES[useThemeId()]
  return (
    <div className="pb-10">
      <header className="rise flex items-start gap-3 pt-6 pb-5 lg:pt-10">
        <button aria-label="Back to profile" onClick={() => navigate('/profile')} className="pressable mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-2"><ArrowLeft size={17} /></button>
        <div className="min-w-0 flex-1">
          <Eyebrow>{theme.name}</Eyebrow>
          <h1 className="display mt-1 text-[34px] leading-[1.02] lg:text-[44px]">Character Studio</h1>
        </div>
        <button className="btn btn-quiet btn-sm mt-1.5 shrink-0" onClick={() => navigate('/personalize?step=theme')}>Change theme</button>
      </header>
      <CharacterStudio />
      <p className="mt-8 text-[12px] leading-relaxed text-ink-3">Saved as you choose. Official assessments always show the standard Aura character, so every athlete is tested the same way.</p>
    </div>
  )
}
