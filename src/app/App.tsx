import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { useStore } from '@/data/store'
import { Shell } from './Shell'
import { Celebrations } from '@/ui/Celebration'
import { Home } from '@/features/home/Home'
import { Profile } from '@/features/profile/Profile'
import { Athletes, AthleteScan } from '@/features/profile/Scouter'
import { SkillTree } from '@/features/tree/SkillTree'
import { Library } from '@/features/library/Library'
import { ExerciseDetail } from '@/features/library/ExerciseDetail'
import { Train } from '@/features/train/Train'
import { CourseView } from '@/features/train/CourseView'
import { WorkoutPlayer } from '@/features/workout/WorkoutPlayer'
import { CoachStudio } from '@/features/coach/CoachStudio'
import { CourseEditor } from '@/features/coach/CourseEditor'
import { Onboarding } from '@/features/onboarding/Onboarding'

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Everything behind the welcome flow needs an athlete to exist. */
function RequireAthlete() {
  const meId = useStore((s) => s.meId)
  return meId ? <Outlet /> : <Navigate to="/welcome" replace />
}

export function App() {
  const meId = useStore((s) => s.meId)
  const theme = useStore((s) => s.settings.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#08090b' : '#f3f0e9')
  }, [theme])

  return (
    <>
      <ScrollReset />
      <Routes>
        <Route path="/welcome" element={meId ? <Navigate to={useStore.getState().active ? '/workout' : '/'} replace /> : <Onboarding />} />
        <Route element={<RequireAthlete />}>
          <Route path="/workout" element={<WorkoutPlayer />} />
          <Route element={<Shell />}>
            <Route index element={<Home />} />
            <Route path="tree" element={<SkillTree />} />
            <Route path="train" element={<Train />} />
            <Route path="train/course/:courseId" element={<CourseView />} />
            <Route path="library" element={<Library />} />
            <Route path="library/:exerciseId" element={<ExerciseDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="athletes" element={<Athletes />} />
            <Route path="athlete/:athleteId" element={<AthleteScan />} />
            <Route path="coach" element={<CoachStudio />} />
            <Route path="coach/course/:courseId" element={<CourseEditor />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Celebrations />
    </>
  )
}
