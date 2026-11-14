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
import { AssessHub, StationRunner } from '@/features/assess/Assess'
import { Reveal } from '@/features/assess/Reveal'
import { GroupPage } from '@/features/assess/Group'
import { HandInImport, JoinInvite } from '@/features/assess/Join'
import { readLink } from '@/features/assess/links'
import { landing } from './landing'
import { AssessmentSession } from '@/features/coach/AssessmentSession'
import { Places } from '@/features/places/Places'
import { SpotLanding } from '@/features/places/Spot'

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Leaving the welcome flow: to wherever it asked for, else a workout in progress, else Home. */
function AfterWelcome() {
  const to = landing.to ?? (useStore.getState().active ? '/workout' : '/')
  useEffect(() => {
    landing.to = null
  }, [])
  return <Navigate to={to} replace />
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

  // An invitation or a hand-in arrives in the address fragment and takes over
  // the screen, whoever is or is not signed in on this device.
  const link = readLink(useLocation().hash)
  if (link) {
    if (link.kind === 'spot') return <SpotLanding data={link.data} />
    return link.kind === 'join' ? <JoinInvite data={link.data} /> : <HandInImport data={link.data} />
  }

  return (
    <>
      <ScrollReset />
      <Routes>
        <Route path="/welcome" element={meId ? <AfterWelcome /> : <Onboarding />} />
        <Route element={<RequireAthlete />}>
          <Route path="/workout" element={<WorkoutPlayer />} />
          <Route path="/assess/:sessionId" element={<AssessHub />} />
          <Route path="/assess/:sessionId/station/:station" element={<StationRunner />} />
          <Route path="/assess/:sessionId/reveal" element={<Reveal />} />
          <Route path="/assess/:sessionId/group" element={<GroupPage />} />
          <Route element={<Shell />}>
            <Route index element={<Home />} />
            <Route path="tree" element={<SkillTree />} />
            <Route path="train" element={<Train />} />
            <Route path="train/course/:courseId" element={<CourseView />} />
            <Route path="library" element={<Library />} />
            <Route path="library/:exerciseId" element={<ExerciseDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="places" element={<Places />} />
            <Route path="athletes" element={<Athletes />} />
            <Route path="athlete/:athleteId" element={<AthleteScan />} />
            <Route path="coach" element={<CoachStudio />} />
            <Route path="coach/course/:courseId" element={<CourseEditor />} />
            <Route path="coach/assessment/:sessionId" element={<AssessmentSession />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Celebrations />
    </>
  )
}
