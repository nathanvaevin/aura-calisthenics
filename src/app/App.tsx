import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router'
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
import AssessmentDone from '@/features/journey/AssessmentDone'
import { GroupPage } from '@/features/assess/Group'
import { CloudJoin, HandInImport, JoinInvite } from '@/features/assess/Join'
import { Splash } from '@/features/account/Account'
import { arrived, useCloud } from '@/data/cloud'
import { readLink } from '@/features/assess/links'
import { landing } from './landing'
import { AssessmentSession } from '@/features/coach/AssessmentSession'
import { Places } from '@/features/places/Places'
import { STANDARD_THEME, THEMES } from '@/theme/themes'
import { ThemeContext, usePersonalTheme } from '@/theme/useTheme'
import { SpotLanding } from '@/features/places/Spot'

// The Studio brings the 3D engine with it: only admins open it, so only they load it.
const Studio = lazy(() => import('@/features/studio/Studio'))
// Personalization previews the character: it comes with the movements, so it loads when opened.
const Personalize = lazy(() => import('@/features/personalize/Personalize'))
const CharacterPage = lazy(() => import('@/features/personalize/CharacterPage'))

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

/**
 * Signed in with an account whose profile was never filled in: the welcome
 * questions come first. A guest who joined from an invitation is not asked;
 * they have a real assessment instead.
 */
function useNeedsProfile() {
  const handle = useStore((s) => (s.meId ? s.athletes[s.meId]?.handle : undefined))
  const mine = useStore((s) => !!s.cloudUid && s.meId === s.cloudUid)
  const guest = useCloud((s) => !!s.user?.guest)
  return mine && !handle && !guest
}

/** Everything behind the welcome flow needs an athlete to exist. */
function RequireAthlete() {
  const meId = useStore((s) => s.meId)
  const needsProfile = useNeedsProfile()
  return meId && !needsProfile ? <Outlet /> : <Navigate to="/welcome" replace />
}

export function App() {
  const meId = useStore((s) => s.meId)
  const own = usePersonalTheme()
  const location = useLocation()
  // An official assessment looks and reads the same for everyone: the original Aura, whatever the athlete chose.
  // Its last screen is the athlete's own again: the assessment is over, and it hands them back.
  const official = (location.pathname.startsWith('/assess/') && !location.pathname.endsWith('/done')) || !!readLink(location.hash)
  const theme = official ? STANDARD_THEME : own

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.scheme = THEMES[theme].scheme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEMES[theme].chrome)
  }, [theme])

  // The device remembers the athlete's theme so the next visit is painted in it from the first frame.
  useEffect(() => {
    if (useStore.getState().settings.theme !== own) useStore.getState().setSettings({ theme: own })
  }, [own])

  const cloudUid = useStore((s) => s.cloudUid)
  const auth = useCloud((s) => s.auth)
  const user = useCloud((s) => s.user)
  const waiting = useCloud((s) => s.sync.phase === 'waiting')
  const joining = useCloud((s) => s.joining)
  const goto = useCloud((s) => s.goto)
  const needsProfile = useNeedsProfile()
  const navigate = useNavigate()

  // A join that began before signing in has finished: go to the assessment.
  useEffect(() => {
    if (!goto) return
    arrived()
    navigate(goto, { replace: true })
  }, [goto, navigate])

  // An invitation or a hand-in arrives in the address fragment and takes over
  // the screen, whoever is or is not signed in on this device.
  const link = readLink(location.hash)
  if (link) {
    return (
      <ThemeContext value={STANDARD_THEME}>
        {link.kind === 'spot' ? <SpotLanding data={link.data} /> : link.kind === 'j' ? <CloudJoin token={link.data} /> : link.kind === 'join' ? <JoinInvite data={link.data} /> : <HandInImport data={link.data} />}
      </ThemeContext>
    )
  }

  // With accounts: wait for the browser to say who is signed in, then for
  // their data. A device that already holds it opens straight away, online or not.
  if (auth === 'loading' && !cloudUid) return <Splash />
  if (auth === 'in' && user && meId !== user.id) return <Splash>{waiting ? 'Can’t reach Aura right now. Check your connection. Trying again…' : 'Loading your profile…'}</Splash>
  if (auth === 'in' && joining) return <Splash>Joining the assessment…</Splash>

  return (
    <ThemeContext value={theme}>
      <ScrollReset />
      <Routes>
        <Route path="/welcome" element={meId && !needsProfile ? <AfterWelcome /> : <Onboarding />} />
        <Route element={<RequireAthlete />}>
          <Route path="/workout" element={<WorkoutPlayer />} />
          <Route path="/personalize" element={<Suspense fallback={null}><Personalize /></Suspense>} />
          <Route path="/assess/:sessionId" element={<AssessHub />} />
          <Route path="/assess/:sessionId/station/:station" element={<StationRunner />} />
          <Route path="/assess/:sessionId/reveal" element={<Reveal />} />
          <Route path="/assess/:sessionId/done" element={<AssessmentDone />} />
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
            <Route path="character" element={<Suspense fallback={null}><CharacterPage /></Suspense>} />
            <Route path="studio" element={<Suspense fallback={null}><Studio /></Suspense>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Celebrations />
    </ThemeContext>
  )
}
