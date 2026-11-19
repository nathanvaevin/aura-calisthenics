# Aura · Implementation & Integration Register

The single source of truth for what works, what only looks finished, and what still has to be connected.
Update it in the same change as any feature, integration or dependency (rule in `CLAUDE.md`).

Last updated: 2026-11-19 · after the instructor choice and the shorter session summary (not published)

## Read this first

**Aura now has accounts and a shared database, built and verified against the live project, not yet published to the public address.** Signed in, a profile, its evidence, sessions, courses and assessments are saved to Supabase and appear on every device of that account; a coach's assessment is joined from other phones and its board follows them (T-10). The device still holds a full copy, so the app opens and records without a connection and sends when it is back. **What is on the public address today is still the earlier, device-only build**: publishing the new one is action 3, after the three dashboard steps in action 2.

**Aura now has two animated master characters, and nothing of them is shown to athletes yet.** Both are real 3D models drawn live in the app, with muscle activation, seven Aura themes and ten exercise animations each (F-100 to F-108). They live in the **Studio** (admins only), where every animation waits as *pending* until you approve and publish it (F-109). Database step 0009 is in place, so what you publish in the Studio reaches athletes. How it is built is in [VISUALS.md](VISUALS.md). The characters, the Studio, all 68 movements and the start-over button **are on the public address** (published 2026-11-17 on your word), and database steps 0009 and 0010 are on the live project (checked the same day).

**Aura now has five themes (Goku Light and the Zeno form were added and published on 2026-11-18), a Personalize flow and a Character Studio for athletes, published on 2026-11-18. Run on a developer's machine and, signed out, on the public site; never yet with a real account.** An athlete chooses Aura Dark, Aura Light, Goku or Baki; the whole interface, its typeface, its language, the character and its Aura forms follow (F-120 to F-135). Training data, ratings, courses and assessments are the same in all four, and an official assessment is always shown the original way. Database step 0011 is on the live project (confirmed 2026-11-18). An athlete's Aura and ratings are shown to other athletes unless they close them (your decision of 2026-11-18, F-130). Database step 0012 is on the live project too: all 12 athletes read `everyone`. **One thing is yours before athletes see the new universes:** release Goku and Baki in the Studio once you have looked at their characters (until then only you can open them; athletes see them as "in preparation"). Approval in the Studio is now one tap and puts a demonstration everywhere its exercise appears (F-133).

**Three things still stay on the device even when signed in:** places and check-ins (F-52 to F-62), a coach's demonstration links (F-14), and the workout in progress. They are labelled that way on screen.

**Without a configured project (no `.env.local`) Aura runs as before**: one device, sample world or a local profile, links as the only transport.

**Places talks to three outside services straight from the browser**, none of them Aura's: map tiles (OpenFreeMap), place data (OpenStreetMap's public Overpass service) and place-name search (Nominatim). They need no account or key, and they come with no guarantee: during testing the place service answered in anything from 1 to 27 seconds and sometimes refused (I-15).

**The scoring model is documented in [SCORING.md](SCORING.md)**, which is checked against the code by the test suite.

### Most important outstanding actions

| # | Action | Who | Why it matters |
| --- | --- | --- | --- |
| 1 | ~~Stand up Supabase~~ **DONE 2026-11-16** — project live (`kyecdnoayoqpvulceupv`), schema + seed applied, Google + anonymous sign-in on, keys set. Verified live: catalog reads, RLS blocks anon from private tables (T-09) | **You** (done) | Unblocked I-01, I-02; **I-03 (data layer) is now the active work** |
| 2 | **Finish going live in the dashboards** (`supabase/README.md` §6, about ten minutes): paste `supabase/migrations/0006_live.sql`; switch on *manual linking*; **publish** the Google consent screen; raise the sign-in rate limits | **You** | Until then: the scan-to-join screen cannot read an invitation (needs `peek_invite`), a guest cannot keep their profile with Google, **only Google accounts you listed as test users can sign in at all**, and more than ~30 guests from one Wi-Fi in an hour would be refused |
| 3 | Publish the new build to the public address: `npm run deploy` | Codebase, on your word, after 2 | The public site still serves the device-only build. The script builds with the project keys, runs the tests and replaces the `gh-pages` branch |
| 3b | ~~Build the data layer~~ **DONE 2026-11-16** — sync engine, accounts, guest join, live board (I-03, F-80 to F-86, T-10) | Codebase (done) | Was the blocker for F-10, F-11, F-25 to F-27, F-32 |
| 3d | ~~Paste `supabase/migrations/0008_course_weeks_and_station_mode.sql`~~ **DONE 2026-11-17** — the four new columns answer on the live project; the USC course, station assessments and the level-up animation are published | **You** (done), codebase (published) | Courses and assessments now save to accounts. Still to be walked against real accounts on real phones (action 3c) |
| 3g | ~~Publish the assessment build~~ **DONE 2026-11-17** | Codebase (done) | The public site serves all 68 movements and the start-over button. Publishing is safe before 0009: everything else runs as before and the Studio says what is missing. On the public site the Studio opens only for a real admin account (the demo's athlete is an admin only on a developer's machine) |
| 3e | ~~Paste `supabase/migrations/0009_visual_content.sql`~~ **DONE 2026-11-17** (the three tables answer on the live project) | **You** (done) | Without it, approving and publishing in the Studio stays on your own device: athletes see no animation and no uploaded video. The app works as before in the meantime |
| 3h | ~~Paste `supabase/migrations/0010_start_over.sql`~~ **DONE 2026-11-17** (the function answers on the live project and refuses a signed-out caller) | **You** (done) | Until then *Erase my training data and start over* in Profile says the step is missing and erases nothing |
| 3i | ~~Paste `supabase/migrations/0011_personal_style.sql`~~ | **Done by you, 2026-11-18** | Confirmed from outside: the live project answers for the new columns and refuses `style_of` / `about_of` to someone signed out, as it should |
| 3l | ~~Paste `supabase/migrations/0012_ratings_open.sql`~~ | **Done by you, 2026-11-18** | You read back `everyone · 12`: every athlete who had not chosen now shares their Aura and ratings, and each can close it with one tap. I cannot check this one from outside |
| 3j | ~~Publish this build~~ | **Done, 2026-11-18**, on your word | The public site serves it: the new characters and posters load, and the phone-size athlete check passes there (T-17) |
| 3m | ~~Paste `supabase/migrations/0013_more_themes.sql`~~ | **Done by you, 2026-11-18** | You reported success. I cannot read this one from outside; the first time Goku Light is chosen on a signed-in account will show it |
| 3n | **Paste `supabase/migrations/0014_coach_sees_training.sql`** (Supabase → SQL Editor → new query → paste → Run) | **You** | Lets a coach read all their students' training, not only course sessions, and leave feedback on any of it. Without it the new coach screens work but show course sessions only |
| 3k | **Look at Goku and Baki, then release them**: Studio → Characters → choose the universe → *Show … to athletes*. One switch each | **You** | Their characters, shading and Aura forms are my work and nobody else has seen them. Until released, athletes can choose only Aura Dark and Aura Light |
| 3f | ~~Go through the exercises in the Studio~~ | **Done by you, 2026-11-18** | All 68 exercises that have a movement are approved on the live project, both characters (136 animations), each showing the current revision of its movement: read from the live project, signed out. The other 48 exercises in the library have no movement written yet |
| 3c | Try a group assessment **and a check-in at a real park** on real phones over the public address | **You** + codebase fixes | Verified in desktop Chrome only, with separate browser profiles standing in for phones (T-04, T-10). Camera scanning, real GPS, small screens, gym Wi-Fi and outdoor conditions are untested |
| 4 | Review the assessment protocol as a coach: tests, gates, caps, order | **You** | The benchmarks and thresholds are my proposal (F-21). They decide what 20 people do in your class |
| 6 | Read SCORING.md §9 and decide on proposals P1–P7 | **You** | Nothing in scoring was changed. Seven improvements are described with their measured effect; each changes numbers athletes have seen, so each is your call (A-10) |
| 7 | Choose how places are supplied in production | **You** + codebase | The public place service is not dependable enough for real users (I-15, A-8) |

## Status definitions

| Status | Meaning |
| --- | --- |
| **Working (local)** | The intended journey works end to end on one device and has been exercised in a browser. Not shared between devices. |
| **Working (link)** | Works across devices by carrying data in a link or QR code. No server involved. |
| **Working (live)** | The journey runs between separate accounts through the live database, and was run that way (T-10). Says nothing about real phones (T-04). |
| **Partial** | Some of the journey works; the gap is named. |
| **Built, not connected** | Code or schema exists and passes its own checks, but nothing in the running app uses it yet. |
| **Sample data** | The screen works, on seeded demo people. |
| **Requires configuration** | Works once something outside the codebase is set up. |
| **Blocked** | Cannot be completed until a named dependency exists. |
| **Planned** | Agreed direction, nothing built. |
| **Not started** | Mentioned in the vision, nothing built, no design yet. |

A feature is only "Working" when its user journey has actually been run. An interface existing is not enough.

## A · Feature register

### Core product

| ID | Feature | Status | End to end? | What remains | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-01 | Onboarding (identity, experience, goals, quick estimate, profile) | Working (local). With an account: **Partial** | Local: yes. Account: the answers, goals and estimates were saved to the live database and opened on a second device (T-10) | With a project configured: Get started → Create your account (Google) → the questions; or Sign in for an existing account; or the demo. The questions follow sign-in, with a handle checked for being free. **The Google step itself has not been clicked through** (needs your account), and the questions were driven through the store, not the screens, in T-10 | I-02 | Authentication: Google, guest (anonymous), linking | **Live for guests; Google requires configuration** | `src/data/cloud/index.ts`. Guest sign-in, automatic profile, session kept across reloads: run live (T-10). Google: provider and redirect URLs are set (your steps); **consent screen still in Testing, so only listed test users can sign in**; a real Google sign-in has not been run. Linking a guest to Google needs *manual linking* on. Default rate limit: ~30 guest sign-ins per hour per network |
| F-02 | Exercise library: 116 exercises, 20 ladders, search, by muscle | Working (local) | Yes | Demonstrations: ten exercises have an animation awaiting review (F-106); videos can be added in the Studio (F-110). Content review by a coach | – |
| F-03 | Difficulty levels: Easier / Level / Harder in a workout | Working (local) | Yes | – | – |
| F-04 | Workout player: sets, hold timer, rest, undo, summary | Working (local) | Yes | – | – |
| F-05 | Evidence and tiers: estimated, self-reported, **observed**, verified, video | Working (local) | Yes, except video | Video tier has no way to be granted (I-08) | – |
| F-06 | Mastery ratings (provisional model `provisional-0.1`) | Working (local) | Yes | Calibration against real athletes. Ratings read low with fewer than three benchmarks. Full behaviour, weaknesses and proposals in SCORING.md | – |
| F-07 | Aura, Athlete DNA, classes | Working (local) | Yes | – | F-06 |
| F-08 | Skill tree: 125 skills, prerequisites, goal paths | Working (local) | Yes | Content review by a coach | F-05 |
| F-09 | Goals and goal sessions | Working (local) | Yes | – | F-08 |
| F-10 | Courses, student view | **Working (live)** | A student who joined a coach's assessment saw that coach's course on their own Train tab (T-10) | Every Active course is visible to every signed-in athlete (a public catalogue by design of the access rules). Fine with one coach; decide before there are many | I-03 | App data through Supabase | **Working (live)** for profile, goals, evidence, sessions, courses, enrolments, feedback, follows, assessments | `src/data/cloud/`: `rows.ts` (tables, who may write), `mappers.ts` (state ↔ rows), `engine.ts` (push, fetch, merge, retry), `remote.ts` (Supabase). `src/data/store.ts` is unchanged as the only place state changes. **Not synced:** places, check-ins, place favourites and home spot, demonstration links. Run against project `kyecdnoayoqpvulceupv` (T-10) |
| F-11 | Coach Studio: review, feedback, verify bests, students | **Partial** | Students with their evidence: live (T-10). Feedback and verifying a best between accounts: built into the sync engine and unit-tested, **not run live** | A coach reads an athlete's sessions only when they were done inside the coach's course, and evidence only while the athlete is enrolled (access rules) | I-03 |
| F-12 | Course builder | Working (local) · saving **Working (live)** | A full four-week course was saved, read back table by table, opened on a second device and deleted again (T-10) | Coach-defined exercises and ladders (schema supports them, no UI). Two devices editing the same course at once: the last save of each row wins | – |
| F-13 | Athlete discovery and scouter view | Sample data without an account; **Partial** with one | With an account the list shows only athletes whose results the viewer may read: themselves and, for a coach, their students | A wider directory needs ratings computed on the server (results are private by rule, so a phone cannot rate a stranger). Following is saved to the account but was not run live | Server-side scoring (E) |
| F-14 | Coach attaches a demonstration video link to an exercise | Working (local) | Yes | **Stays on the coach's device even when signed in**: students do not see it. For videos every athlete should see, an admin now uses the Studio instead (F-110) | I-03 (not yet synced) |
| F-16 | **Start over with an account**: Profile → Account → *Erase my training data and start over*. Erases the account's results (every tier), workouts, goals, solo assessments and its answers in other people's assessments, on the server and on the device, then asks the welcome questions again. The account, its roles, enrolments, and the courses and assessments it runs for others stay | **Requires configuration** (0010) | The database function: 7 checks (T-02). The button without 0010: says so and erases nothing (run against the live project as a guest). **The full journey with 0010 on the live project has not been run** | Not offered to guests. Places and check-ins on the device are erased with the rest of the device's data | 0010 |
| F-15 | Light and dark theme, responsive phone and desktop layouts | Working (local) | Yes | Check on physical phones (T-04) | – |

### Assessment and group onboarding (added 2026-11-14)

| ID | Feature | Status | End to end? | What remains | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-20 | Solo assessment from Home, Train, or the end of onboarding | Working (local) | Yes | With an account it is saved and finalised through the same path as a group session; that path was run live for group sessions only | F-21 |
| F-21 | Assessment protocol **`baseline-2`**: six stations; the guided path of 42 adaptive benchmarks kept as it was, plus 29 menu-only variations; suggested ranges instead of maximums. `baseline-1` sessions and links still read | Working (local) | Yes | Coach review of tests, gates and caps. No per-test demonstration media | F-02 |
| F-22 | Coach creates a group assessment for a course or a free-standing group | **Working (live)** | Yes (T-10) | Needs the coach role on the account (Coach mode sets it) | – |
| F-23 | Invitation by QR code and link | With accounts: **Requires configuration** (action 2). Without: Working (link) | The token link is generated and a guest joined with the token (T-10). **The screen a scanned code opens was not run**: it reads the invitation with `peek_invite`, which arrives with migration `0006` | With accounts the code carries a 32-character token and nothing else; it stops working when the session is finalised. No expiry or revoke control in the UI (`invite_expires_at` exists). Real phone-camera scan untested (T-04) | 0006; I-13 for a reachable address |
| F-24 | Participant joins without signing up and records on their own phone | **Working (live)** as a guest account | A guest joined, recorded through the station screens, and the results were on the server (T-10) | A guest is a real, private account that only that browser can open. Keeping it: F-82. Supabase allows ~30 new guests an hour from one network by default (action 2) | I-02 |
| F-25 | Results reach the coach | **Working (live)** | Results recorded on the participant's phone appeared on the coach's board by themselves in about 3 s (T-10) | That was by the board asking every 4 s. Pushed updates (Supabase Realtime) are wired but silent until migration `0006` publishes the tables; not yet observed working | I-18 |
| F-26 | Coach board: who joined, per-station completion, who needs help, add by name, record for someone | **Working (live)** | Joined participant, their progress, recording for someone without a phone (T-10). A help request reaching the board: unit-tested with two simulated devices, not run live | – | F-25 |
| F-27 | Coach marks results self-reported / observed / verified | **Working (live)** | "Observed" set by the coach showed as observed on the participant's phone, and became observed evidence on finalising (T-10) | "Verified" takes the same path; run in the unit tests, not live | I-03 |
| F-28 | Reveal: profile, shape, strengths, skills shown, how it is known, suggested goals | Working (local) · **Working (live)** | Yes; with an account it says the coach already has the results and offers a guest to keep the profile (T-10) | No "save as image" button: a guest who does not want an account takes a screenshot | F-06, F-08 |
| F-29 | Group profile, anonymous standings, complementary partners | Coach side **Working (live)**; on a participant's phone **Blocked** | Coach side yes | A participant may not read other people's results, so their phone shows an honest placeholder. Needs `assessment_profiles` written by each phone and read through `assessment_group()` (A-5) | A-5 |
| F-30 | Sharing choice: coach only, or shape visible to the group | Working (local) | Yes, travels in the hand-in | Changing it after joining has no UI yet | – |
| F-31 | Level advice for the coach: where to pitch each ladder for this group | Working (local) | Yes | One-tap "apply to the course" is not built; levels are set by hand in the builder | F-12 |
| F-32 | Finalise: results become evidence at their tier, participants join the linked course | **Working (live)** | The server wrote the evidence and the enrolment; the participant's phone showed both without a reload; the coach saw them as a student (T-10) | Someone added by name has no profile to receive evidence. Changing a result after finalising rewrites that session's evidence (unit-tested) | I-03 |
| F-33 | Re-test compared with a baseline, per person and per group | Working (local) | Yes | With accounts a re-test starts with the baseline's participants already on the board; not run live | – |
| F-34 | Station timer and suggested starting stations | Working (local) | Yes | The timer shows on the coach's screen only | I-03 for shared timer |
| F-35 | Assessment history on Train, re-test on your own | Working (local) | Yes | – | – |

### USC Calisthenics Beginner and station-based assessment (added 2026-11-17)

| ID | Feature | Status | Tested | Missing / limits | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-90 | Course template **USC Calisthenics Beginner**: 9 weeks. Week 1 initial assessment, weeks 2–8 one focus each (core, pushing, pulling, legs, handstand, mobility, all together), week 9 re-test. Two sessions a week plus an optional third; 55–70 % of each week's working sets build its focus. Every exercise carries its purpose. Calisthenics Fundamentals kept unchanged | Working (local) | Opened in the builder, weeks and focus checked (T-12) | Content is my programme proposal; review it as a coach. Week dates assume the course starts on a Monday | – |
| F-91 | Course weeks have a kind (training, initial assessment, final re-test) and a focus; exercises are marked focus or support, with the share of focus work shown per week | Working (local); saving to an account live, not yet walked against real accounts | T-12 | Students see the focus and the Focus tag; the percentage is coach-only | 0008 |
| F-92 | Assessment weeks in the builder create or open the group assessment; the re-test is created from the course's baseline with the same stations and people | Working (local) | Initial assessment created from week 1 (T-12); re-test comparison checked on demo data | The re-test needs the baseline finalised to compare against; otherwise it says so | 0008 |
| F-93 | Two assessment modes per session: **By stations** (choose variations from a menu) and **Guided** (the original sequence). Coach chooses at creation and can switch while open; "Let the station choose" offers the guided sequence inside station mode | Working (local) | T-12 | Solo assessments are always guided | 0008 |
| F-94 | Station menu: every variation, grouped by movement pattern, easiest first, with level label, suggested range, instructions, what counts, cues, mistakes, safety; "Most start here"; choose one or several and do them in order | Working (local) | T-12, on a phone-sized screen | Negative push-up is not offered: the library has no such exercise. No demonstration videos (separate phase, I-08) | F-02 |
| F-95 | Suggested ranges instead of maximums; any result can be recorded; past the range the athlete sees the next harder variation, as an offer they can decline | Working (local) | Recording 30 knee push-ups (range 8–15), offer, push-ups, pike push-ups (T-12) | Ranges are my proposal per variation; review them | – |
| F-96 | Coach station overview: a Stations tab in the session with every variation of every station and how to explain it | Working (local) | T-12 | – | – |
| F-97 | Rotation groups: the coach sets 1–6 groups; people are placed evenly as they join, can be moved with a tap, see their group and starting station on their phone; the full-screen timer shows where each group should be | Working (local); between phones not yet walked against real accounts | Groups placed and shown (T-12); moving someone not clicked | – | 0008 |
| F-98 | Re-test read against the baseline, benchmark by benchmark: improved, new variations, held, not retested, still developing. On the athlete's results and in the coach's participant sheet | Working (local) on the coach's device | Coach side on demo data; domain tests | On the athlete's phone it needs accounts (the baseline is linked through the server) and has not been run live yet | 0008 |

### Level-up in the Skill Tree (added 2026-11-17)

| ID | Feature | Status | Tested | Missing / limits | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-99 | Level-up animation in the Skill Tree: energy gathers in the node just completed, builds, fires a thick Aura beam along the tree's own line to the landing it opens (lighter beams to other landings it opens), bursts there with fireworks and light across nearby nodes, and leaves a glow for about nine seconds. With sound when sounds are on. Plays once, the next time the tree is opened after a skill is mastered; "Replay the level-up" on any mastered skill | Working (local) | In headless Chrome at phone and desktop size, dark and light: each phase looked at frame by frame; steady 60 frames a second; started from a real logged best through the unlock card; taps pass through it; removed when done; reduced-motion setting gives the glow only (T-13) | Not seen on a real phone (speed on older phones unknown). The sound was not listened to: a headless browser has no speakers. Skills that arrive from a coach's assessment do not queue a level-up yet (only bests the athlete logs or claims) | – |

### Visual content: characters, muscles, Aura, animations, video (added 2026-11-17)

Reference: [VISUALS.md](VISUALS.md). "Prototype" below means: it works and was run, but its quality is mine to propose and yours to accept.

| ID | Feature | Status | Tested | Missing / limits | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-100 | **Two master characters**, male and female: faceless, grey-white, dark Aura shorts with the wordmark and dot, the female with a top and short loose hair. Real rigged 3D models (`public/characters/aura-*.glb`), generated by `npm run character:build` from one anatomy | Working (local) · **Prototype** | Built, loaded and posed in a browser; file checked against the code (T-14, T-15) | Generated, not sculpted: stylised, simple hair, shoulders and hips lose shape at the extremes, fingers bend together. Not seen on a real phone. Files uncompressed (1.6 and 2.0 MB) | – |
| F-101 | **Three visual states** on one character: base, muscle activation, Full Aura; independent of each other and of the pose | Working (local) | Shown side by side for both characters (T-15) | – | F-100 |
| F-102 | **Muscle activation**: working muscles light up on the body, primary / secondary / stabiliser at three strengths, following the model's own muscle shapes and showing through clothing. Which muscles comes from the exercise library, so it works for all 116 exercises | Working (local) · **Prototype** | Every exercise gets a valid activation (T-14); five groups and exercises looked at on both characters (T-15) | Muscles are simplified shapes (ovals and rounded patches), not anatomical drawings. Deep muscles are not shown. Colour (Aura pink or the discipline's) not decided | F-100 |
| F-103 | **Modular Aura**: nine independent components (outline, field, rays, ribbons, particles, streams, ground rings, sparks, lightning); a theme is data only | Working (local) | All seven themes rendered on both characters (T-15) | – | F-100 |
| F-104 | **Seven Aura themes**: Cosmic, Electric, Solar, Ethereal, Primal, plus Signature (Aura's six discipline colours) and Lunar. (Ten more were added on 2026-11-18 for the forms of Goku and Baki: F-126.) **All experimental until you approve them** | Working (local) · **Prototype** | T-15 | **Re-run 2026-11-18 against the Exercises tab, 29 checks, all pass:** nothing exists before an exercise is opened → opening one puts both characters up for a decision, seen by nobody → one button sends one or both → the library shows it → sent back with a note, and a new version carries the note → an exercise without a movement offers nothing to approve → the old Review address opens Exercises and the Aura tab is gone. *The first run, with the tabs as they then were:* Your choice of which stay | F-103 |
| F-105 | **Theme and intensity are separate**: every theme runs continuously from 0 to 100%; per-theme strength, pulse speed, particle density and component switches | Working (local) | Slider and saved adjustments exercised (T-15) | – | F-103 |
| F-106 | **Living Aura**: breathes when still; during a set it stays low, follows the effort (differently for repetitions, holds, balance and mobility), pulses on each completed repetition, releases at the end of the set and settles | Working (local) · **Prototype** | Watched during a pull-up set and a hold (T-15) | No explosive behaviour (no explosive exercise in the pilot). Not tied to real events in the app yet: a record or an unlocked skill does not trigger it (F-99 is separate) | F-103 |
| F-107 | **Movements**: an exercise is written once as a pose over time, with its contacts and its equipment stated, and solved for each character. Equipment: floor, high and low bar, dip bars and parallettes, box, wall, ab wheel | Working (local) | Every movement, both characters: whole skeleton, in reach, joints in range, planted contacts still (T-14) | No rings or bands. No transitions between exercises. The shoulder blades cannot be drawn back on their own. Each new exercise is written by hand | F-100 |
| F-108 | **68 movements, both characters: every exercise of the first-day assessment** (all 67 guided tests and menu variations) plus cat-cow. The first ten were the pilot; 58 were added the same day, in families (push, rows and dips, bar, floor and core, legs, handstand station, mobility) | Working (local) · **Pending your review** | Each exercise's own standard is checked automatically (T-14); every one was looked at as three still moments, most on both characters (T-16) | **No coach has reviewed the technique, and the 58 new ones were looked at as stills, not watched in motion.** The muscle-up and the wall walk are the least certain. The other 49 exercises of the library have no animation | F-107 |
| F-109 | **Studio** (admins only): **Exercises**, Characters, Muscles, Videos (since 2026-11-18; before that Characters, Muscles, Aura, Review, Videos). **Exercises** lists every exercise in the library with where it stands (waiting for you · needs correction · live · no animation yet), with search. Opening one shows its movement on either character or both side by side, with the working muscles; the decision sits above it: *Approve and send both* (or one character), *Needs correction* with tagged notes, *Take down*. A movement is put up for a decision when its exercise is first opened; nobody presses Generate any more. After a decision the next waiting exercise opens. Versions kept; notes carried to the next version; play, pause, replay, scrub, slow motion, four camera angles, drag to look round. An exercise without a movement shows the muscles it works and offers nothing to approve | Working (local) | The whole journey run in a browser, 29 checks (T-15, re-run 2026-11-18) | **Seen working live on 2026-11-18**: two exercises the owner approved in the live Studio (Dead Hang, Scapula Pull, both characters) are served to a signed-out browser as published. Not watched from a second signed-in account. Comparing with an earlier version side by side was dropped: an earlier version is opened from the list of versions instead | 0009 |
| F-110 | **Exercise videos** by an admin: link or upload, title and technique notes, extra angles or variations as separate slots, draft → review → publish, replace with a new version | Working (local) with a link · **Upload: built, never run** | Link: added, published, seen on the exercise page (T-15) | Upload needs your signed-in account and 0009; 50 MB limit; no transcoding or poster image | 0009, I-08 |
| F-111 | **Exercise page shows what is published**: the animation (male, female or both, with the working muscles on or off) and your videos, above the existing muscle map | Working (local) | T-15 | An animation whose movement was changed after approval is withheld until re-approved | F-109 |
| F-112 | **Workout videos**: title, description, focus, level, length and link can be recorded in the Studio | **Built, not connected** | Table and rules checked (T-02) | **Athletes cannot see them.** No workout-video player: full screen, chapters, timers and progress are a later stage | 0009 |

### Personalization, themes and Character Studio (added 2026-11-18)

Reference: [VISUALS.md](VISUALS.md) §11 to §13. Theme data: `src/theme/`. "Prototype" as above: it works and was run; whether it is good enough is yours to say.

| ID | Feature | Status | Tested | Missing / limits | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-120 | **Five themes**: Aura Dark (the original), Aura Light, Goku (storm dark, fire and embers), Goku Light (ink on paper under a red sun; until 2026-11-18 this was the only Goku), Baki (the last two named by the owner on 2026-11-18; before that Anime Power and Iron Will. Names of existing characters: see the change log for the risk). Each has its own colours, display typeface, shapes, page atmosphere and voice; all run on the same screens and data. Aura Dark and Light are two views of one universe | Working (local) · **Prototype** | Every screen of the journey seen in each (T-17); each theme's tokens checked to exist (T-16) | "Baki" is my name for the martial-arts-manga theme: a real manga's title cannot be a product name. It is one line to change. Barlow Condensed and Anton were added as fonts. A few small controls keep round corners in Baki | – |
| F-121 | **The theme is the athlete's, not the device's**: saved on their profile, painted from the first frame on a device that has shown it | Working (local). Across devices: **Built, not connected** | Saved, reloaded, first frame checked (T-17); the database columns and who may change them (T-02); state → rows → state (T-16) | Never run against the live project. Needs 0011 | 0011 |
| F-122 | **Personalize**: a prominent button on the profile and a prompt on Home open a four-step flow: theme (four cards, each drawn in its own theme, tap to see the whole screen in it before choosing), character, about you, sharing. The last two are optional and can be skipped; every choice is saved as it is made | Working (local) | The whole flow, incl. leaving half-way and coming back (T-17), desktop and phone size | – | F-120 |
| F-123 | **Character Studio for athletes** (`/character`): male or female, the Aura form, intensity, one of three finishes, working muscles on or off; preview as base, muscles or full Aura, one 360° button that turns the character round (and dragging it does the same), and performing any exercise you have approved. It previews and saves preferences; it cannot generate, review, publish or upload | Working (local) | T-17, incl. as an athlete who is not an admin | Three finishes per universe; no hair or clothing choices | F-124 |
| F-124 | **A character per universe on one skeleton**: Aura (the two masters), Goku (hero build, swept spiked hair, wristbands and sash), Baki (heavy build, deep muscle separation, hand wraps). Six files, generated by code; every one of the 68 movements plays on all of them unchanged | Working (local) · **Prototype** · **Not released to athletes** | Files checked against the code, same 34 bones at the same joints (T-14); nine poses looked at as stills on the new bodies; push-up and standing seen moving (T-17) | **The new bodies were not watched through all 68 movements.** Known: Goku hair passes through the floor when the head is near it (wall handstand push-up); her ponytail grazes an arm in the bridge; from the front she is close to the Aura female; Baki lats read as smooth ovals from behind. Original designs, faceless like the masters: no existing character was copied. 1.7 to 2.1 MB each, fetched only when shown | F-100 |
| F-125 | **Each universe is drawn its own way**: Aura modelled by studio light; Goku as ink on paper (since 2026-11-18): flat colour with a black outline on a pale stage with a red sun behind the character, its Aura painted on instead of lit, hair that takes the colour of the form; Baki in three ink tones with hatching and the lines between muscles drawn in. Each has its own stage lighting | Working (local) · **Prototype** | Seen on both characters of each (T-17) | The outline draws each body twice: not measured on a real phone. The stage stays dark in Aura Light on purpose: an Aura is light and needs dark to be seen | F-124 |
| F-126 | **Aura forms**: six Auras (Aura), six forms (Goku and Goku Light: Saiyan, God, Destruction, Kaio-ken, Ultra Instinct, Zeno, in the order they are earned; Zeno needs the last Aura class, Singular, and turns the body itself into a starry sky; the owner's names of 2026-11-18 for what were Ignition, Awakened, Ascended, Overdrive, Transcendent), five states (Baki: Pressure, Tempered, Forged, Unbroken, Apex). The first of each is everyone's; the rest are earned by reaching an Aura class, mastering skills, or having a skill verified by a coach. A locked one can be looked at and says what it takes | Working (local) · **Prototype** | Rules (T-16); locked, previewed and earned in a browser (T-17) | **What unlocks each form is my proposal.** Unlocks only read results; no theme, form or character is an input to any rating (checked: changing theme leaves evidence, logs and courses untouched, T-17) | F-103 |
| F-127 | **A voice per theme**: 22 lines in three voices at the moments that carry feeling: the greeting and a daily line on Home, the next class, the unlock, a new form, the end of a workout, three empty pages, personalization. Facts in a sentence are identical in every voice | Working (local) · **Prototype** | Every key has every voice and the same facts (T-16); read on screen (T-17) | Deliberately not everywhere: coach tools, the library's technique text and anything in an assessment stay plain. The wording is mine | F-120 |
| F-128 | **Celebrations in the manner of the theme**: rings of light (Aura), a burst of speed lines (Goku), heavy strokes (Baki); and a **new form earned** is announced once, with "wear it now" | Working (local) | Skill unlock seen in Goku and Baki; a form earned, worn, and not announced again (T-17) | Which forms were already announced is remembered per device. The character itself is not in the celebration yet | F-126 |
| F-129 | **More about you**, all optional: display name, originally from, country you live in, city, a line about you, favourite disciplines, where you like to train, favourite place (the home spot on the Places map). Existing fields were reused; only country and favourite disciplines are new | Working (local). With an account: **Built, not connected** | T-17; T-16 | Needs 0011 for the two new fields. No contact field was added: the account's own address is shown to its owner and said to be private | 0011 |
| F-130 | **What you share**, each part on its own (only me / people I follow / everyone): character and theme, Aura and ratings, favourite disciplines, city and country, origin, places; plus one switch to be found by other athletes at all. **Aura and ratings start as "everyone"** (owner's decision, 2026-11-18; they started as "only me" for a few hours before anything was published), closed with one tap on "Only me". Other athletes only: **a coach always sees their students' results and training (F-146)**. "Ratings" here is: the Aura number and class, the rating in each discipline, the skills mastered and the logged results they are worked out from, each with its evidence tier. Not: workouts, workout notes, coach feedback, courses, email | Working (local). Between accounts: **ratings and discovery: built, rules checked, not run live · the rest: built, not connected** | On one device (T-17); in the database: results open to signed-in athletes by default, closed by the athlete, opened to followed people only, a stranger then refused, a hidden profile shares nothing, nobody else can write (T-02) | Opening ratings to others makes the server hand them the athlete's results, so the athlete list can show them: **never run between two real accounts**. Another athlete's character, favourite disciplines, city and country are not fetched between accounts yet (as F-51): the rules exist (`style_of`, `about_of`, `identity_of`) | 0011, 0012, I-22, I-23 |
| F-131 | **Completion**: the profile shows four steps, "Identity ready" once theme and character are chosen, "Personalization complete" after all four; the button always leads to the next open step | Working (local) | T-19 | First week of a course, automatically (2026-11-19, 6 tests): empty as written and two sessions for the athlete; every block a real exercise and a real rung; each athlete on the rung their results give; the same ids each time; every other week the very same object; steps aside for a coach's own sessions and for a re-test week | 645 tests pass in all | Vitest | – |
| T-18 | **Simpler to enter, in a browser** (2026-11-19, sample world, phone size). *Assessment, 21 checks*: six plain areas → an area is one list of 12 with no sub-headings → the first exercise already shown → touching another shows it on the same screen → added in an order and numbered → the test starts with the first → back returns to the area with the selection kept → back again to the areas → results recorded as given → corrected from the list → guided one tap away → completion is one message and one action, no cards → evidence at its own tier → on to Personalize. *After it, 21 checks*: week 1 empty as written → two sessions for the athlete at their own level → started, logged, marked done → week 2 as written; profile leads with Personalize, then "Start here" → six steps in order, back works → ends at Train → not offered again, also after reopening → reopened from Settings → Baki's voice; a student has no coach or admin way in, a coach has. Also re-run: class assessment 16, Studio 31, personalization 44 (now through the new picker and the themed completion screen) | all pass, no page errors | Local dev server, headless Chrome, Apple M2 | **No real account, no real phone, not on the live site.** The Google sign-in on the completion screen was not pressed. Page lengths measured on the sample athlete, who has more history than a new student |
| T-17 | – | F-122 |
| F-132 | **Official assessments keep the original presentation**: the Aura Dark theme, its plain language, and the standard Aura character under the Cosmic Aura, whatever the athlete chose. Leaving the assessment returns their theme | Working (local) | T-17: an Goku athlete entered an assessment, opened a test's demonstration, and left | Applies to the athlete's assessment screens and invitation links. A coach's own session page follows the coach's theme | F-120 |
| F-133 | **Approve once, shown everywhere**: one tap makes a version the official demonstration of its exercise (*Approve both characters* does the pair; the next one waiting opens by itself). Every screen asks the same exercise record: library page, skill sheet in the Skill Tree, technique sheet during a workout (so coach-built sessions and courses too), both kinds of assessment. Replacing or taking down a version reaches all of them; earlier versions stay and can be made official again. Where there is none, the screen shows what it showed before | Working (local) | One tap → official for both characters → library with the athlete's character → assessment with the standard character (T-17); the review journey re-run (T-15) | In a workout and an assessment it is one closed row until tapped, so nothing heavy loads unasked. Not in the coach's course editor or exercise pickers. Videos follow the same one-tap rule | F-109 |
| F-134 | **Releasing a universe**: Studio → Characters shows each universe's characters in three states with their finishes, and a switch to release Goku or Baki to athletes. Unreleased: listed as "in preparation", cannot be chosen, and an athlete who somehow has it stored sees the original | Working (local). To athletes: **needs your account** | Unreleased → refused and falls back; released → takes effect (T-17) | The switch is saved with the Aura settings (0009, already live); **not run with your real account** | F-109 |
| F-135 | **Profile tidied**: settings, privacy and account moved behind one button (and one row); the profile itself is the athlete: identity card, Aura, DNA, ratings, records, skills | Working (local) | T-17 | – | – |
| F-136 | **The demonstration as the whole screen** in a workout and in an assessment test, where the exercise has an approved animation. The controls lie over it; touching the stage (or *Watch*) leaves only the exercise's name, a running clock and the next button; starting a hold timer does that by itself. The character is always framed in the part of the screen that is free, and can be turned by dragging. An exercise without an approved animation keeps the plain screen | Working (local) · **published 2026-11-18**, stepped through signed out on the public site | In a browser at phone size: 14 checks in a workout (every state, Aura Light, Goku Light) and in the journeys (T-15 29 checks, T-17 42) | **Not tried on a real phone**: a full-screen 3D view for the length of a workout costs battery and heat nobody has measured. The skill sheet shows the movement at once; library rows mark animated exercises and can be filtered to them. The "Watch the demonstration" row remains only in the assessment's station menu, which lists several variations | F-133 |
| F-137 | **One way to look round a character, everywhere**: a 360° button and a drag. The Front / ¾ / Side / Back buttons are gone from every viewer, the Studio's included | Working (local) | Character Studio 12 checks; the journeys | A coach who wants a fixed side view of a movement now turns to it by hand | – |

### Simpler to enter: assessment, first week, introduction, less on the page (added 2026-11-19)

| # | Feature | Status | Tested how | Limits and what is missing | Depends on |
|---|---|---|---|---|---|
| F-138 | **The assessment in six areas**: Pushing, Pulling, Core, Legs, Handstand, Mobility, as six tiles. Inside an area, one list of its exercises, easiest first, with no sub-categories (the "horizontal / vertical pull" headings are gone). Touching an exercise shows its official demonstration at once in a stage above the list; no "Watch" step and no other screen | Working (local) | In a browser, phone size, 21 checks (T-18); the class assessment re-run, 16 checks | **Six areas, not seven or eight**: they are the six disciplines every rating is built on, and a seventh would have no rating behind it. The coach's own reference list in a session still groups by movement | F-90 |
| F-139 | **Your own order**: exercises are added with one tap and numbered in the order they were added; the test starts with the first. "Let Aura choose for you" keeps the guided path one tap away. An athlete on their own now chooses (before, only a coach's station session did); a coach's session still runs as the coach set it | Working (local) | T-18 | Reordering is by removing and adding again, not by dragging | F-138 |
| F-140 | **Back goes where you came from**: from a test to its area, with what was chosen and its order kept; from an area to the six areas. Finishing the chosen exercises returns to the six areas with that tile marked. A recorded result is corrected from the list and returns to the list | Working (local) | T-18 | The selection lives in the address of the area: leaving the area for the overview starts it afresh | F-138 |
| F-141 | **The end of an assessment is one screen with one action**: "Congratulations! Your assessment is complete.", how many results, and then *Save progress & continue* (signed in), or *Sign in to save your progress* with the Google button (a guest), or *Continue* (the sample world, said plainly). No ratings or breakdowns: one quiet link, *See my results*, opens the full page that was there before. It then leads to Personalize, or to the profile once that is done. Shown in the athlete's own theme and voice | Working (local) · **the sign-in branch is not run** | Signed-out sample world and theme voice in a browser (T-18, T-17) | **Nobody has pressed the Google button from this screen**: it calls the same functions as the old guest prompt, which were run on 2026-11-16, but this screen with a real guest is untested. Google is the only sign-in there is | F-80 |
| F-142 | **Week one of a course trains**: where a course opens with an assessment and the coach wrote no sessions into that week, each athlete sees two short sessions (push, pull, legs, trunk; then hanging, first steps upside down, the back of the body), every ladder at the rung their own results put them on, adjustable one rung either way. Worked out per athlete when the course is shown; later weeks untouched; a coach who adds sessions to the week replaces them | Working (local) | 6 automatic tests (T-19); in a browser: shown, at the athlete's level, started, logged, marked done, week 2 as written (T-18) | **Works for the live USC course without a database step, because nothing is stored in the course.** A logged starter session is saved with a reference rather than a course row, so the coach's per-session roster does not list it. Before the assessment the level comes from the welcome's estimates, or the first rung | F-91 |
| F-143 | **"Start here" and a one-minute introduction** on the profile: a small card once personalizing is done; six steps, each lighting one real thing (Personalize, Aura, ratings, Skills, Train, Library) with one sentence in the theme's voice; forward, back, skip, leave; ends on *Start training*. Never opens by itself. Opened again from Settings → Introduction | Working (local) | T-18: order, back, skip, end, not offered twice, reopened, Baki's voice | **Remembered per device, not per account**: on a second phone the small card is offered once more. Saving it to the account needs a column and a database step | F-128 |
| F-144 | **Less on the page** (phone): Profile 5.2 → 2.3 screens (ratings one line each; DNA, where you train, records, skills and training folded to one line until wanted; the four Aura sub-scores are behind the Aura card). Home 3.0 → 2.1 (next session straight under the Aura; goals one line each; "recommended next steps" only for someone with no goal, since each goal names its next step; the numbers after what there is to do). Train 2.3 → 1.2 (quick sessions, assessments and history folded). Course page: milestones, feedback and about folded; the first week speaks to the athlete. With room for two columns the folds start open | Working (local) | Measured and seen at 390×844 and 1280×900 (T-18) | Judged by my eye, not by a student. Skill tree, Places and Library pages were looked at and left as they are | – |
| F-145 | **Students and coaches**: a student has no Coach Studio or Studio entry and cannot open either by address; a coach keeps both. Nothing was removed from the coach's side | Working (local) | T-18 | Unchanged rules, re-checked | F-109 |

| F-148 | **Choose your instructor** at the start of each assessment: the male and the female master character side by side, large; the one touched answers with a burst of the Electric Aura and the assessment opens. That character then performs every demonstration in it. Changed later from the overview ("Instructor: … · change") | Working (local) | In a browser, 8 checks: shown first, both standing, only the chosen one bursts, opens by itself, kept on reopening, demonstrations follow it, changeable; the class assessment re-run with it (17) | Kept per device, for that assessment: on another phone it is asked again. Loads the 3D view and both characters at the start of the assessment; the two buttons work before, and without, the 3D view | F-138 |
| F-149 | **The end of a workout shows the session and nothing else**: title, one line of numbers, what was done, and one switch on any result that is a new best (marked self-reported). The explanations are gone; effort and a note are folded under one optional row; Save, and a quiet Discard | Working (local) | In a browser, 6 checks: no explanations, fits one phone screen, saving records the session and the best as self-reported | The theme's closing line on this screen was removed with the rest; its heading still speaks in the theme's voice | F-136 |

### A coach sees their students (added 2026-11-19)

| # | Feature | Status | Tested how | Limits and what is missing | Depends on |
|---|---|---|---|---|---|
| F-146 | **No switch hides an athlete from their coach.** While an athlete is enrolled in a coach's course, the coach sees all their results (assessments, benchmarks, ratings, skills), their goals, and **every session they train**, in the course and on their own (quick sessions, sessions toward a goal, the first week's starter sessions), with what was assigned and what was done. Closing ratings to other athletes or hiding the profile does not hide anything from the coach. It ends when the athlete leaves the course. The coach can leave feedback on any of those sessions and can change none of them. Athletes are told where they join: the course page, the list of courses to join, the assessment invitation ("always sees your results"), and the privacy row in Settings | Results and profile: Working (rules unchanged, re-checked). **Own training: built, rule checked, not connected** | 16 database checks (T-02, now 278); coach view in a browser, sample world | **Needs database step 0014** (action 3n) for training outside the course to reach the coach. Who counts as a coach's student is unchanged: enrolment in one of their courses (joining a coach's assessment that is linked to a course enrols). A coach does not see where a session was done: that stays the athlete's | 0014 |
| F-147 | **Coach Studio → Students**, one line each: when they last trained, sessions in the last four weeks, course sessions done of those due, Aura and how much it has grown since their start. **A student's sheet**: growth since their starting point (Aura and the six ratings, then and now; the start is their first assessment, or the first day anything was recorded), training over eight weeks against their target, completion of each of the coach's courses, how they move the levels, what they are working toward, and every session, each marked Course, Own session or Toward a goal | Working (local) | In a browser, 5 checks: a sample student had 26 sessions, the coach saw 9 before and all 26 now; 4 unit tests for the growth calculation | Growth is the same scoring run on what was known then and now: an athlete who only re-tests what they already did shows little change. Not seen with real accounts | F-146 |

### Identity, places and presence (added 2026-11-14)

| ID | Feature | Status | End to end? | What remains | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-50 | Profile identity: where from, based in, preferred environments, home spot, favourite places, "open to training together". All optional | Working (local) | Yes | – | – |
| F-51 | Visibility per part (only me / people I follow / everyone), with a preview of the profile as others see it | Working (local); enforcement between accounts **Built, not connected** | On one device | Rules exist and are checked in the schema (`identity_of`, T-02); nothing enforces them between real people yet | I-01 to I-03 |
| F-52 | Places map: pan, zoom, places as markers, live-presence halo, light and dark | Working (local) | Yes, incl. production build | Tiles come from a third party (I-07). Needs WebGL; falls back to a list without it (fallback not walked) | I-07 |
| F-53 | Finding places: search this area, search a town, "use my location" once | Working (local), **service unreliable** | Yes, with real OpenStreetMap data | The public place service was slow or refused in some runs; the app waits at most ~50 s and says so. Coverage is whatever volunteers mapped; equipment is often missing | I-15, I-16, I-06 |
| F-54 | Place details: kind, equipment, amenities, hours, how far the record can be trusted, how many of the 116 exercises fit the place | Working (local) | Yes | **No photos** (nowhere to store them, I-08). No address for most places | I-08 |
| F-55 | Add a place, correct a place's details, confirm details while checked in | Working (local) | On one device | Additions and corrections stay on this device (or travel in a link). Shared corrections, confirmation by other people and moderation need the backend | I-03, A-12 |
| F-56 | Check in: fixed length (45 min to 3 h, 4 h cap), chosen audience (starts at "only me"), optional one-off location check, ends by itself, leave or extend | Working (local) | Yes | Location check tested with a simulated position only (T-04) | I-06 |
| F-57 | Athletes at a place, kept apart: training now · regulars · here recently · call it a favourite | **Sample data** | On one device | The people shown are seeded sample athletes following their own privacy settings. **Real presence between devices is Blocked**: nobody else can see your check-in inside Aura | I-01 to I-03 |
| F-58 | Share a place, or "I'm here until 18:30", by link and QR | **Working (link)** | Yes, across separate browsers | The "now" part disappears when its time passes. It is the sender's word; nothing checks it | I-13 for a reachable address |
| F-59 | "How you might train together" line per athlete (level, shared strengths, who leads where) | Working (local), on sample data | Yes | Descriptive only. Not a match score | F-06 |
| F-60 | A session finished while checked in is saved as done at that place | Working (local) | Store behaviour unit-tested; the label in the session sheet was not walked in a browser | Hidden from coaches by design | F-56 |
| F-61 | Presence always in sight: bar in the shell while checked in; "training now" strip on Home | Working (local) | Yes | – | F-56 |
| F-62 | Check-in history: review, forget one, forget all | Working (local) | Yes | – | – |

### Accounts and sync (added 2026-11-16)

| ID | Feature | Status | Tested | Missing / limits | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-80 | Sign in with Google; profile created on first sign-in; sign out empties the device | **Requires configuration**, then untested by a person | The account machinery was run live with guest accounts (T-10). A Google sign-in has not been clicked through | Google's consent screen must be **published** or only listed test users get in (action 2). No email/password or Apple sign-in. Email sign-in would need a mail service (I-09) | I-02 |
| F-81 | Guest account for a test day: one tap from the join screen, no sign-up | **Working (live)** | T-10 | Offered only when joining from an invitation, by decision. Guest accounts pile up in the project until cleared (A-15) | I-02 |
| F-82 | A guest keeps their profile by adding a Google sign-in: same account, nothing re-entered | **Configured**; the project issues the Google link for a guest (checked live); the Google round trip itself not run | – | Needs *manual linking* switched on (action 2). Shown on the reveal screen and on Profile | I-02 |
| F-83 | A guest who already has an account moves the day's results into it | **Built, not connected**; rules checked (T-02) | The server side: 11 checks. The screens: not run | Needs migration `0006`. Where the account already took part in the same session, its own entry stands | 0006 |
| F-84 | The sync engine: the device keeps a full copy, sends what changed, fetches and merges; works offline and catches up; two devices of one account stay in step | **Working (live)** | 19 unit tests with two simulated devices and a pretend server (incl. offline, refused writes, stale second device); live: second device, edit carried across, deletion carried across (T-10) | Two devices changing the **same row** at once: the last to send wins, silently. Every fetch reads everything the account can see: fine for a class, to be narrowed before thousands of rows (E) | I-03 |
| F-85 | A profile built on a device before signing in is moved into a new account on first sign-in | Built; unit-tested | Not run live | Only into an account with no profile yet; otherwise the device copy is set aside (kept in the browser, no screen to restore it). Sample athletes and anything of theirs are left behind | – |
| F-87 | Coach access by request: an athlete asks (at sign-up or in Profile), an admin approves or declines in Profile; the role can no longer be self-assigned | **Built**; rules checked (T-02, 25 checks); not run live | Server rules: yes. Screens: typecheck only | Needs migration `0007` on the live project and your account made admin (README §8). Approval reaches the athlete's app on its next refresh (up to a minute, or on reopening). No payment yet; this is the gate it will sit behind | 0007 |
| F-86 | Sync status on screen: saved / saving / no connection / could not be saved | **Partial** | "Saved" seen live; the offline and refused states are unit-tested in the engine, not walked on screen | Shown on Profile, the assessment overview, the reveal and while an invitation code is being prepared | – |

### Scoring reference (added 2026-11-14)

| ID | Feature | Status | End to end? | What remains | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-70 | `SCORING.md`: every formula from the code, the reasoning, behaviour as the library grows, fairness, admission framework | Working | Tables are generated from the code and the test suite fails if they drift | Prose is hand-written: review it whenever scoring changes (rule in `CLAUDE.md`) | – |
| F-71 | `npm run scoring:audit`: recomputes every figure, applies the admission checks to all 109 rated exercises | Working | Yes | – | – |
| F-72 | Scoring invariants as tests (evidence never lowers a rating, volume moves nothing, tiers never change a value, Aura bounds) | Working | 15 tests | – | – |
| F-73 | Scoring proposals P1–P7 (families, provisional ranges, sub-anchor rule, verified credit, verified Aura, …) | **Planned** | Not implemented, by decision | Your decision on each; each needs a model version bump | A-10 |

### Not built

| ID | Feature | Status | Note |
| --- | --- | --- | --- |
| F-40 | Rankings, challenges, activity badges | Not started | Schema has `achievements` tables only |
| F-41 | Athletes near you, independent of a place | Not started | Deliberately not built: discovery goes through places and through the city an athlete shares (F-57). A radius search around a person needs stored positions, which Aura does not keep |
| F-46 | Place photos | Not started | Needs storage (I-08) and moderation |
| F-47 | Reporting, blocking, hiding from specific people | Not started | Needed before presence is shared between real people (A-12) |
| F-48 | Place pages for coaches: classes held at a place, a course's home spot | Not started | Natural next link between courses and places |
| F-42 | Notifications and reminders | Not started | I-09 |
| F-49 | Turning a recorded video into an Aura animation | Not started | Planned route and its risks in VISUALS.md §9. The skeleton's bone names and the movement format were chosen to allow it |
| F-113 | Aura themes for challenges and events; the Full Aura on a personal record or an unlocked skill | Not started | Themes and the release exist (F-104, F-106); nothing in the app triggers them yet |
| F-43 | Video-based verification | Planned | Tier and schema column exist; needs I-08 |
| F-44 | Coaching marketplace, payments | Not started | – |
| F-45 | In-app QR scanner for coaches | Planned | Today the coach uses the phone's own camera, which opens the hand-in link. Needs camera permission and a fallback for browsers without `BarcodeDetector` |

## B · Integration register

| ID | Integration | Status | Detail |
| --- | --- | --- | --- |
| I-01 | Supabase database | **Live** | All five migrations (`0001`–`0005`) **and** `0002_storage.sql` plus `seed.sql` apply cleanly and pass 118 access checks against an in-process Postgres (T-02). One-paste setup in `supabase/apply.sql` (generated by `npm run db:bundle`), verified to apply as a single batch. Runbook: `supabase/README.md`. **Project `kyecdnoayoqpvulceupv` is live** and answered correctly over its REST API (T-09). The app does not yet read/write through it — that is I-03 |
| I-02 | Authentication, Google + anonymous sign-in | **Configured, live** | `src/data/supabase.ts`: button appears when the two env vars are set; OAuth returns to the app's own address including any hosting sub-path (BASE_URL). `handle_new_user` creates a `profiles` row on first sign-in (checked in T-02). Google provider + redirect URLs are set in the dashboard per `supabase/README.md`. Google + anonymous providers enabled; redirect URLs set for the GitHub Pages site and localhost. Anonymous sign-in is for test-day join (students keep results by signing up after). Not yet exercised with a real Google login; signing in does not yet load or save app data (that is I-03) |
| I-03 | App data through Supabase, real-time sync | Blocked | Not written. `src/data/store.ts` is the only place that changes state, so it is the seam. Real-time board needs Supabase Realtime on the assessment tables |
| I-04 | QR code generation | Working | `qrcode-generator`, drawn as SVG in `src/ui/QrCode.tsx`. Both codes decode correctly (T-03) |
| I-05 | Invitation links, tokens, access | With accounts: token **Working (live)**, join screen **Requires configuration** (0006). Without: Working (link) | Token made on the coach's device (128 random bits), stored with the session; `join_assessment()` is the only way in and, from `0006`, enrols in the course at once; `peek_invite()` (0006) lets the join screen describe the session before sign-in |
| I-06 | Location services | Working (local), **simulated position only** | The browser's own location prompt, asked for only on a tap ("use my location", "check with my location"). Read once, held in memory for that visit to the app, never stored or sent to Aura. No background or continuous tracking exists in the code. Browsers require HTTPS (or localhost) |
| I-07 | Maps | Working, third party | MapLibre GL (bundled, incl. its worker) drawing vector tiles and styles from `tiles.openfreemap.org`. No key or account. No uptime guarantee; each viewer's IP reaches that host. At scale: self-host tiles or use a paid provider |
| I-15 | Place data | Working, **unreliable** | OpenStreetMap via the public Overpass API (`overpass-api.de`, one mirror), queried for the map area on demand; results cached on the device (1,500 places). Observed: 1–27 s answers and 502 refusals. Only the bounding box is sent. A snapshot of 8 Lisbon places ships with the demo (`src/data/lisbonSnapshot.ts`) |
| I-16 | Place-name search | Working, third party | Nominatim's public server, called only when the search form is submitted (their policy forbids search-as-you-type and heavy use). Only the typed text is sent. Production needs a hosted or paid geocoder |
| I-17 | Places and presence in the database | Built, not connected | `0005_places.sql`: per-part audiences, `identity_of()`, `check_in()` (compares an optional position on the server and discards it), visits that cannot exceed 4 hours, history closed by default. 33 checks in T-02 |
| I-18 | Live updates (Supabase Realtime) | **Built, not connected** | The app subscribes to changes on the assessment tables, evidence, enrolments and feedback and re-fetches when told. Migration `0006` adds those tables to the realtime publication; until then nothing is announced and screens fall back to asking every 4–10 s, which is what T-10 measured. To verify after action 2 |
| I-08 | Image and video storage | **Requires configuration** | The `demonstrations` bucket answers on the live project (checked 2026-11-17). The Studio uploads into it (F-110); that path has never been run, and needs an admin who is also a coach (your account, once made owner). The local check skips storage rules. No size limit beyond Supabase's 50 MB, no transcoding |
| I-19 | 3D rendering | Working | three.js 0.180, loaded only where a demonstration is shown (a separate file, about 166 kB compressed). Needs WebGL 2; a device without it sees a line saying so |
| I-20 | Visual content in the database | **Built, not connected** | `0009_visual_content.sql`: `demo_assets`, `workout_videos`, `app_settings`; anyone reads what is published, only an admin writes; one published version per exercise and slot. Its own channel (`src/data/cloud/content.ts`), apart from personal sync, which carries on quietly if the tables are missing. **Not on the live project yet** (action 3e) |
| I-22 | Personal style and sharing in the database | **Applied to the live project (2026-11-18), not run with an account** | `0011_personal_style.sql`: 19 columns on the athlete's own identity row (theme, character, forms, finishes, intensity, steps; country, favourite disciplines; three audiences); `evidence_read` now also admits whoever the athlete opened their ratings to (`shares_ratings`); `style_of()` and `about_of()` return what a caller may see. 22 checks in T-02. Synced through the existing engine as columns of an existing table, plus `profiles.is_public`. Applied by the owner and confirmed from outside; nobody has signed in and saved through it yet |
| I-23 | Ratings open unless closed | **Applied to the live project (2026-11-18), not run with an account** | `0012_ratings_open.sql`: the starting value of `ratings_audience` becomes `everyone`, and athletes who never went through the sharing step are moved to it; a choice already made is kept; a second run does nothing. 6 checks in T-02. One consequence to know: with ratings open, every signed-in device is handed the logged results of every open, findable athlete (a result row carries its exercise, value, tier, date and any note the system or a coach put on it). Fine for a club; a large community needs ratings worked out on the server instead. Applied by the owner, who read back `everyone` for all 12 athletes. That two real accounts now see each other's ratings has not been watched |
| I-24 | Theme names in the database | **Applied to the live project (2026-11-18, as reported by the owner), not run with an account** | `0013_more_themes.sql` replaces the list of four accepted theme names with a check on the shape of the value, so a theme added in the app needs no database step. An id the app does not know is shown as the original theme. 2 checks in T-02. Applied by the owner (action 3m) |
| I-25 | A coach reads all their students' training | **Built, not connected** | `0014_coach_sees_training.sql`: `logs_read` and `can_read_log` (entries and sets) also admit `coaches_athlete`; `feedback_insert` likewise. Reading only. 16 checks in T-02: a quick session readable by the student's coach and nobody else, with its sets; still readable after the student hides their profile and closes their ratings; feedback by the coach, not by another; not deletable or changeable by the coach; gone when the student leaves the course. **Not applied to the live project** (action 3n) |
| I-21 | Video hosting for full workouts | Not started | Not to be stored in Supabase. A streaming host (Mux, Cloudflare Stream, Bunny) or Vimeo/YouTube, with only the link kept here (VISUALS.md §8). Your choice when the first workout video exists |
| I-09 | Notifications, email | Not started | Would be needed for invitations by email, coach feedback alerts, re-test reminders |
| I-10 | Video playback | Working (local) | YouTube (no-cookie), Vimeo and direct file links |
| I-11 | Environment variables | Set locally | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` in `.env.local` (gitignored; the publishable key, safe to ship), `VITE_BASE` for a hosting sub-path. `npm run deploy` refuses to run without them, or if the file holds a secret key |
| I-12 | Security and privacy | Partial | Row-level rules for every table, 149 checks (T-02), and seen holding live: a second account could not read the first's evidence. Signed out there is no access control on a device: whoever holds it sees what is on it. Leaves the device: map tiles, searched areas, typed place names (never identity or position, T-07); and, signed in, the account's own data to Supabase. **Not written: privacy notice, deletion and export of an account (A-9)** |
| I-13 | Hosting, domain, production config | **Live** | GitHub Pages, `gh-pages` branch of `nathanvaevin/aura-calisthenics`, at `https://nathanvaevin.github.io/aura-calisthenics/`. **Published 2026-11-16 with `npm run deploy`** (`scripts/deploy.sh`): tests, build with the project keys, `404.html` = the app so a reload on any screen opens it (served with a 404 status code, which browsers ignore), replace the branch. Checked after publishing: new build served, privacy and terms pages up, Google sign-in starts from the public address and reaches Google with the right return address. Google's sign-in screen names `…supabase.co` until a custom domain is bought |
| I-14 | Fonts | Working | Bundled with the app; no external font service |

## C · Outstanding actions in detail

**A-1 · Stand up Supabase** — Priority 1 · *You, externally; DB prepared*
- Follow **`supabase/README.md`** step by step. In short: create the project; paste `supabase/apply.sql` into the SQL editor once (all five migrations `0001`–`0005` + `seed.sql`); enable the Google provider and list the app's redirect URLs; copy the Project URL and anon key into `.env.local`.
- Prepared and verified: the SQL applies cleanly as one batch, the access rules pass 118 checks (`npm run db:check`), the sign-in redirect is correct, and a `profiles` row is created automatically on first sign-in.
- Why: nothing can be shared between devices without it.
- Verify: `npm run dev`, Profile → Settings → Account shows "Sign in with Google"; signing in returns you signed in and creates a row in `profiles`.

**A-2 · Data layer** — *Done 2026-11-16* (I-03, F-84, T-10).

**A-13 · Finish going live in the dashboards** — Priority 1 · *You* · `supabase/README.md` §6
- Paste `supabase/migrations/0006_live.sql` into the SQL editor and run it once. Adds: reading an invitation before sign-in, enrolment on joining, evidence removed with its assessment, the guest hand-over, and live-update announcements.
- Supabase → Authentication → Sign In / Providers → switch on **Allow manual linking**.
- Google Cloud → OAuth consent screen (Audience) → **Publish app**. In Testing, only the accounts you listed can sign in.
- Supabase → Authentication → Rate Limits → raise anonymous sign-ins (default 30 an hour per network) and sign-ins/sign-ups; a class on one Wi-Fi shares one address.
- Verify (codebase, after you say it is done): the live walkthrough again, this time through the join screen, with pushed updates, keeping a guest profile and the hand-over.

**A-14 · Publish the build** — Priority 1 · *Codebase, on your word* — `npm run deploy`. Then sign in on the public address with your own Google account: that is the first real Google sign-in.

**A-15 · Housekeeping for guest accounts** — Priority 3 · *You, occasionally*
- Guests who never keep their profile stay in the project. Authentication → Users shows them as anonymous; delete by hand, or run `delete from auth.users where is_anonymous and created_at < now() - interval '30 days';` in the SQL editor.
- Before promoting the app publicly: switch on a captcha for sign-ins (Supabase → Authentication → Attack Protection), which the join screen will then need a small change to pass.

**A-16 · Changing the catalogue** — *Codebase, every time*
- The database holds a copy of the exercises, ladders and skills (`seed.sql`). A build that knows an exercise the database does not will have sessions and evidence for it refused. After changing `src/domain/catalog`: `npm run db:seed`, run the new `seed.sql` in the SQL editor, then deploy.

**A-3 · Real-device trial** — Priority 2 · *You, then codebase*
- What: open Aura from an address phones can reach, run a group assessment with a few people.
- Verify: the camera opens the invitation; the stations are usable one-handed; hand-in codes scan from a phone screen.

**A-4 · Protocol review** — Priority 2 · *You*
- What: read `src/domain/assessment.ts`. Each station lists its tests, the result that unlocks each one, and where to stop.
- Note: changing tests means bumping `PROTOCOL`; hand-in links from an older version are rejected by design.

**A-5 · Participant-side group view** — Priority 3 · *Codebase, needs A-2*
- What: load anonymous group totals from `assessment_group()` and shared shapes from `assessment_profiles`.
- Why: individual results are private by rule, so a phone cannot compute the group itself.

**A-6 · Apply level advice to a course** — Priority 3 · *Codebase, no dependency*

**A-7 · Change sharing after joining; in-app scanner (F-45)** — Priority 3 · *Codebase*

**A-8 · A dependable source of places** — Priority 2 · *You decide, then codebase*
- What: stop depending on the public Overpass server. Options, cheapest first: (a) import an OpenStreetMap extract into the `places` table on a schedule and query Supabase by map area; (b) a hosted Overpass or places API; (c) a commercial places provider.
- Why: the public service is shared, rate-limited and was unavailable in some test runs. It is also the wrong place to keep athletes' additions and corrections.
- Depends on: A-1 for (a). A licence check either way: OpenStreetMap data is under the ODbL, which has attribution and share-alike terms for derived databases.
- Verify: searching an area answers in under two seconds, ten times in a row.

**A-9 · Privacy notice and consent wording for location and presence** — Priority 2, before any real user · *You, with legal advice*
- Why: checking in is location data about a person. The product behaviour is conservative (opt-in each time, expiring, no stored positions), but the notice, lawful basis, retention and the rules for under-18s are not written.

**A-10 · Decide the scoring proposals** — Priority 2 · *You*
- What: SCORING.md §9.2, P1–P7. My recommendation there: adopt P3 (no credit for one second of an elite hold) and P4 (keep verified credit) with the next model version; add `family` metadata now without using it (P1); P2 and P5 are display-only.
- Verify: `npm run scoring:audit` before and after; the change log in SCORING.md gets an entry and `SCORING.version` is bumped.

**A-11 · Photos for places** — Priority 3 · *Codebase, needs A-1 and storage rules*

**A-12 · Safety tools before presence is shared for real** — Priority 1 once A-2 starts · *Codebase + your policy*
- What: block and report an athlete; report a place; "hide me from this person"; a limit on check-ins per hour; a default of "only me" for anyone under 18.
- Why: a feature that says where someone is right now is the one most open to misuse.

**A-13 · Review the visual pilot** — Priority 1 for this feature · *You*
- Where: Profile → Studio (or the Studio link in the side rail). In the demo it works straight away; with your account, after you are owner.
- Decide, in this order: (1) the two characters: acceptable as the Aura look, or to be handed to a character artist (VISUALS.md §2 says what an artist would need to deliver); (2) the muscle colour: Aura pink or the discipline's colour; (3) which themes are approved and which is the default; (4) each animation against "What correct looks like": approve, or send back with a note.
- Why: your corrections on ten exercises set the standard before any of the other 106 are written.

**A-14 · Run database step 0009** — Priority 1 before publishing · *You*
- Supabase → SQL Editor → paste `supabase/migrations/0009_visual_content.sql` → Run. It only adds three tables.
- Verify: the grey line at the top of the Studio changes to "Changes are saved to Aura for everyone".

**A-17 · Run database step 0011, then publish** — Priority 1 · *You, then codebase on your word*
- Supabase → SQL Editor → paste `supabase/migrations/0011_personal_style.sql` → Run.
- Then say "publish". Order matters: the new build sends columns that only exist after this step.
- Verify afterwards, signed in: Profile → Personalize → choose a theme → open Aura on a second device or browser with the same account → the theme is there.

**A-18 · Look at the two new universes and release them** — Priority 1 for this feature · *You*
- Signed in as yourself: Profile → Personalize → Goku, then Baki (you can open both; athletes cannot yet). Look at both characters, the forms in the Character Studio, and a demonstration in each.
- Studio → Characters → Goku / Baki → *Show … to athletes* when you are content. It can be switched off again.
- Tell me what to change: the names of the themes and forms, what unlocks each form (F-126), the wording of each voice (F-127), the characters themselves (F-124).

## D · Testing and verification

| ID | What was tested | Result | Environment | Limits |
| --- | --- | --- | --- | --- |
| T-17 | **Personalization, in a browser** (2026-11-18, demo mode, 39 checks + the 23 of T-15 re-run): Home and profile invite → four theme cards → looking at a theme shows it everywhere without choosing it → leaving puts the own theme back → Goku chosen → its character on its own stage → female, Awakened, a finish → about you (optional, skipped or filled) → sharing: ratings start open and one tap closes them (re-run after the default changed), each part set on its own, a profile hidden from discovery → "Personalization complete" on the profile with the live character → reload paints the theme from the first frame → switching theme changes no evidence, logs, courses or enrolments and keeps the form chosen in the other universe → one tap approves both characters and moves to the next → library shows the movement with the athlete's own character → **an assessment is shown in the original theme with the standard Aura character and Cosmic Aura** → leaving returns the theme → as a non-admin: unreleased themes refused and listed as in preparation, the admin Studio closed, the athlete Studio without any review or publishing control, a locked form looked at but not taken → released by the admin switch → a newly earned form announced once, worn, not announced again → Aura Light. Skill celebration seen in Goku and Baki. Phone size: theme cards, Studio, profile, sharing. **The built app, phone size, as an ordinary athlete (7 checks):** the first load and the profile fetch no 3D engine and no character; the two new universes are in preparation; Aura Light chosen; the Character Studio runs; optional steps skipped; identity ready | 39 + 23 + 7 pass, no page errors | Local dev server and `vite preview` of the production build, headless desktop and phone-size Chrome, Apple M2 . **The same 7 checks on the public site after publishing (2026-11-18): pass, no page errors** | **No real account and no real phone.** Against the live site only signed out, so nothing was saved to the live database. The new bodies were not watched through every movement. Judged by my eye |
| T-16 | Personalization, automatically (2026-11-18, 16 tests): four themes on three universes, each with its tokens; every form drawn by an existing Aura theme of its own universe; unlock rules; what is worn falls back while a theme is unreleased or a form unearned, and keeps the choice; assessment presentation; completion; every line exists in every voice with the same facts; personal style goes to database rows and back unchanged, and an athlete who chose nothing is left as they were. Plus: the plain list of movement revisions matches the movements | Pass (part of T-01) | Local | – |
| T-14 | Visual content, automatically (2026-11-17): each of the ten movements, for both characters, at 48 moments: hands and feet reach where they are put; planted contacts drift under 4 mm; no elbow or knee folds past its range; nothing below the floor; and the exercise's own standard (push-up straight and locked out at the top, chin over the bar, hip crease below the knee, elbows under the shoulders in the plank, head in front of the hands in the pike push-up, straight arms in the hang, handstand and cat-cow, back knee just off the floor in the split squat). Every library exercise gets a valid muscle activation. The character files match the code (skeleton, muscle numbering, size). Review rules: every status move, one published version per slot, notes carried forward | 71 checks of movement and assets, 21 of the review rules and the content channel, all pass. **These checks found and fixed three real technique errors**: the push-up did not lock out, the chin did not clear the bar, the arms bent in cat-cow | Node (vitest) | Geometry only: says nothing about how it looks, or about tempo |
| T-15 | Visual content, in a browser (2026-11-17, demo mode): Studio opens for an admin and not for anyone else → Characters shows both in three states → Muscles by group and by exercise, front and back → Aura: seven themes, intensity, adjustments saved, theme approved and made default, living behaviour during a set → Review: pilot generated (20 pending) → nothing on the exercise page → approve → publish → animation on the exercise page → second character → switch appears → sent back with a tagged note → new version carries the note, old one kept → side-by-side comparison → a published animation whose movement changed is withheld → video by link: draft, review, publish, shown beside the animation. Phone-size layout looked at. Frame times measured | 23 of 23, no page errors. 60 frames a second in every case measured, including phone size at 3× pixels with the processor slowed 6× | Local dev server, headless Chrome on an Apple M2, desktop and phone size | **Not run with an account** (needs 0009). **No real phone**: the processor was slowed, the graphics chip was not. Upload of a file not run. Sound: none |
| T-12 | USC course and station assessment (2026-11-17, demo mode, two browsers): template opens with 9 weeks → week 1 is the initial assessment → week 4 shows focus, share of focus work, Focus/Support tags → assessment created from week 1 is by stations in 3 groups → coach Stations tab lists every pushing variation easiest first with ranges and standards → a phone joins by link → station menu grouped by movement → chose knee and pike push-ups → range shown, no limit → 30 knee push-ups typed, hint shown, recorded as 30 → offered push-ups, accepted → all three saved → station done, others open → rating from the existing curves → guided sequence available. Plus: a re-test of a demo baseline carries the group and shows Since the baseline | 15 of 15, no console errors | Local dev server, headless Chrome, desktop and phone size | Not run against accounts (needs 0008), not on real phones, moving a person between groups not clicked |
| T-13 | Level-up animation (2026-11-17): logged a 10th pull-up in the demo → unlock card → "See it in your skill tree" → the animation plays on Pulling from Pull-up × 5… (the node completed) to the landings it opens; frames captured through ignition, build-up, flight, impact, fireworks and settle; frame times measured; overlay does not take taps; gone at the end with the glow left; replay from the skill sheet; light theme; desktop width; reduced motion | Pass, no console errors, median frame 16.7 ms | Local dev server, headless Chrome | No real phone; sound not heard |
| T-11 | Live, after the dashboard steps (2026-11-16): a code opened in a never-used browser shows coach, group and course before sign-in → typed name → *Join as a guest* → lands in the assessment, on the coach's board under that name, enrolled in the course → the coach marks a result observed and it reaches the student's phone in 2.1 s **with that phone not asking** (pushed update) → finalising closes the code and the evidence arrives by itself → a guest is issued a Google link (manual linking on) → test data removed | 10 of 10 after the manual-linking fix | Local dev server against the live project, headless Chrome | Google sign-in and the Google round trip of keeping a profile: not run (need a person) |
| T-01 | Unit tests: catalog, scoring and its invariants, assessment protocol, station menus, groups, re-test comparison, link encoding, group analysis, places and presence rules, store behaviour, and the sync engine with two simulated devices and a pretend server | 122 pass | Local, Vitest | – |
| T-02 | All fourteen migrations and the seed apply; 278 checks on access rules, incl. invitation tokens, result privacy, observe/verify, finalise, identity/places/presence, the media bucket, `0006` (reading an invitation signed out, joining enrols, guest hand-over, evidence removed with its assessment) `0007` (coach access by request) `0008` (week kinds and focus, focus exercises, assessment mode and groups) and `0009` (signed out and athletes see only published demonstrations and workout videos; only an admin writes; a second published version in one slot is refused; settings readable by all) and `0010` (starting over erases the caller's results, verified ones too, goals and workouts; nobody else's; the account keeps its roles; refused when signed out) and `0011` (a theme, character and form saved by their owner only; invalid values refused; the look visible by default and hidden on request; results private by default, opened to followed people or to everyone, never writable by others; a hidden profile shares nothing; nothing readable signed out) | 253 pass | In-process Postgres (PGlite) with stand-ins for Supabase auth and storage | Not a real Supabase project |
| T-03 | Coach creates a session → participant joins **in a separate browser context** by the invitation link → completes four adaptive stations, incl. choices and a help request → reload keeps progress → reveal → hand-in link → coach imports → records for a second person → observes and verifies → finalises → same hand-in again updates. Plus: re-test vs baseline, the demo participant's group view, onboarding into a solo assessment. Both QR codes decoded with macOS's detector to the exact links used | Pass, no console errors | Local dev server, headless desktop Chrome at phone and desktop sizes | Separate storage stands in for separate devices. No physical phone, no real camera scan |
| T-04 | Physical phones, real class, real GPS, outdoors | **Not tested** | – | See A-3 |
| T-05 | Earlier walkthroughs (workout, courses, coach studio, onboarding, library, profile) re-run after this change | Pass | As T-03 | – |
| T-06 | Production build, and the map drawing in it | Pass, no console errors | `vite preview`, headless Chrome at phone size | App 947 kB; the map is a separate 1,067 kB chunk plus a 519 kB worker, loaded only when Places is opened |
| T-07 | Places, 33 checks: map draws → place opens with people in four separate groups (a private regular stays hidden, a favourite is not shown as a visit) → check in (starts at "only me", choose everyone, location confirmed at 40 m) → stored visit has no position → presence bar → "tell someone" link → **second browser context** sees who, until when, with Aura → the same link five hours later shows only the place → leave ends it at once → real town search and real OpenStreetMap places → "use my location" → add a place → profile identity, preview as a stranger, privacy change takes effect → forget history → other athletes show only what they share → data saved before this feature is upgraded on load → Home strip | Pass, no console errors | Local dev server, headless desktop and phone-size Chrome, **simulated position**, live third-party map and place services | In two runs the place service refused; the app reported it instead of hanging, and that branch is what was verified then. No physical phone |
| T-09 | Action #1 live check: with the configured publishable key, reading the public catalog over the project's REST API returns a row; reading a private table (`profiles`) as anonymous returns nothing | Pass | curl against the live project `kyecdnoayoqpvulceupv.supabase.co` | Google login click itself not automated (needs the owner's account) |
| T-10 | **Live, between accounts** (2026-11-16): signed-out welcome → guest coach account → profile, goals and estimates saved → a four-week course saved and read back table by table → a finished session with its sets and a claimed best → **the same account in a second browser profile** opens all of it; an edit there shows on the first → coach creates a group assessment, the code appears once the session is on the server → **a second guest account** joins with the token → appears on the coach's board without a reload → records two results through the station screens → they reach the board in ~3 s → the coach marks the station observed → the participant's phone shows observed → coach records for someone with no phone → participant's reveal offers "Keep this profile", no hand-in → coach finalises → server holds the evidence at the observed tier and the enrolment → participant's phone shows the finalised result, the evidence and the course → coach sees them as a student → test course and sessions deleted, and gone from the server | 23 of 23, no console errors | Local dev server, headless desktop Chrome, two and three separate browser profiles, **the live project** | **Not run:** a Google sign-in; the screen a scanned code opens, pushed live updates, keeping or moving a guest profile (all wait on action 2); real phones; the published build. Joining used the join function directly. Four guest test accounts remain in the project (Authentication → Users) |
| T-08 | Scoring: `npm run scoring:audit` over the whole catalog; document tables match the code | Pass: 0 failures of the admission checks, 41 warnings and 65 notes listed in SCORING.md §10 | Local | Simulated athletes and nine sample athletes; no real athlete data |

## E · Future requirements to plan for

| Need | Triggered by | Requires |
| --- | --- | --- |
| Fetching less | More than a class or two per coach | Every fetch reads all rows the account may see (courses of every coach included). Needs "changed since" queries per table and a narrower course catalogue |
| Same-row conflicts | Two coaches or two devices editing one thing | Today the last save wins silently. Needs a version column and a merge or a warning |
| More ways to sign in | iOS and Android apps, people without Google | Apple sign-in (required by the App Store when Google is offered), email (needs a mail service) |
| Account deletion and export | Any real athletes | A way to delete an account and everything under it, and to download it |
| Server-side scoring | Rankings, shared profiles | An edge function or database job writing `mastery_ratings` and `aura_records`; clients must not write scores (already enforced) |
| Other athletes' looks and details between accounts | Athletes looking at each other's profiles for real | The device fetches only its own identity row. Needs a call to `style_of`, `about_of` and `identity_of` for the athletes it shows (the rules are in place and checked) |
| A directory of athletes | Discovery beyond a coach's own students | Listing public profiles, and ratings computed on the server for those who opened them (today a device rates whoever's results it was handed) |
| Unlocks decided on the server | Forms as real rewards, events, challenges | Today a device decides what is earned from results it holds; fine for looks, not for anything of value |
| Lighter character files | More universes or characters | Six files of 1.6 to 2.1 MB; mesh compression was not built |
| Invitation expiry and revocation UI | Larger or public groups | `invite_expires_at` exists; needs UI |
| Camera permission | In-app scanner, video verification | Permission prompts, fallbacks |
| A spatial index | Places in the database (A-8) | PostGIS or a geohash column; today's schema has a plain (lat, lon) index |
| Server-side presence | Real check-ins (A-2) | `check_in()` exists; needs Realtime on `visits`, rate limits, and clients that stop showing a visit at its end time without being told |
| Safety and moderation | Shared presence, shared places | A-12; a review queue for added places and photos |
| Map and place services at scale | More than a handful of users | Self-hosted or paid tiles, geocoder and place data (I-07, I-15, I-16); OpenStreetMap attribution and ODbL terms |
| Scoring on the server, with a verified Aura | Rankings, public comparison | SCORING.md §7.6 and P5 |
| Real athlete data for calibration | Trusting the numbers | The six measurements in SCORING.md §9.4 |
| Email | Invitations without a QR, reminders | A transactional email service and templates |
| Media pipeline | Uploads, demonstrations per test | Storage limits, transcoding or size rules |
| Data protection | Any real athletes | Privacy notice, deletion and export, consent for under-18s in classes |

## F · Change log

**2026-11-19 · Choose your instructor; the end of a workout, stripped down**

- At the owner's request. An assessment now opens by asking who demonstrates it (F-148): the two master characters, the chosen one bursting in the Electric Aura. The assessment's own presentation is otherwise unchanged.
- The session-complete screen lost its explanations (F-149): what was logged is the screen. Nothing about what is saved changed: sessions, new bests and their self-reported tier are recorded as before.
- `Player.release(who)` and `DemoHandle.release(who)` let one performer's Aura go. 649 tests; journeys 21, 21, 17, 44, 31. **Not on a real phone.** Not published.

**2026-11-19 · Published: simpler to enter, and a coach sees their students**

- On the owner's word, `npm run deploy`. The public site serves the new assessment flow and completion screen, the first week's starter sessions, the introduction, the shorter Profile, Home and Train, and the coach's students list and student sheet.
- Checked on the public site, signed out, phone size: the 7 standing checks pass; the account screen, the profile's folded sections, the coach's students list and a student's sheet (growth since the start) show in the sample world. No page errors.
- **Database step 0014 (action 3n) was not confirmed** before publishing. Until it runs, coaches on the live site see only their course's sessions; nothing breaks.

**2026-11-19 · A coach sees their students: results, training and growth**

- At the owner's request, and **without a choice for the athlete**: a coach sees all results and all training of the athletes in their courses (F-146). Results were already so; training outside the coach's own course was not, and now is once database step 0014 runs (action 3n). This matches what the privacy page already said.
- Coach Studio's students list and student sheet rebuilt around growth since the start, training against target, course completion and every session (F-147). Course completion now counts the first week's starter sessions.
- Athletes are told plainly where they join a course or a coach's assessment.
- New: `src/domain/progress.ts` (growth since the starting point, 4 tests), migration 0014 (16 checks). 649 tests, 278 database checks.
- **Not run with real accounts.** Not published.

**2026-11-19 · Simpler to enter: assessment, first week, introduction, less on the page**

- **Assessment** (F-138 to F-141): six areas as tiles; an area is one list where touching an exercise shows it at once; exercises are done in the order they were added; back returns to where the athlete came from with nothing lost; the end is "Congratulations", one action, and a clear sign-in for anyone not signed in. **Scoring, the tests, their order in hand-in links and the protocol version are unchanged**: this is how the same tests are chosen and shown. An athlete on their own now chooses instead of being led; being led is one tap away.
- **Six areas, not the seven or eight the brief suggested**: they are the six disciplines the ratings are built on. Splitting one would put a tile on screen with no rating behind it.
- **Week one** (F-142): two starter sessions at each athlete's own level, worked out when the course is shown. Nothing is written into the course, so the live USC course gets them without a database step.
- **Introduction** (F-143): "Start here" on the profile and six lit steps. **Remembered per device**, said in the register as a limit.
- **Less on the page** (F-144): Profile, Home, Train and the course page, by folding and reordering, not by removing. A standing rule for it is in CLAUDE.md.
- New: `src/features/journey/` (the completion screen, the introduction), `DemoPreview`, `Fold`, `useWide`, `courseFor` and `starterSessions` in `src/domain/training.ts`, twelve lines of voice. Tests T-18, T-19.
- **Not run**: any of it with a real account, on a real phone or on the live site; the Google button on the completion screen. Not published.

**2026-11-18 · The account step of the welcome, rewritten**

- At the owner's request: the screen after *Get started* no longer speaks of laptops or of a coach. A first rewrite read as written by a machine and was rejected; it now says, in plain words, "Sign in to start", why (your results are saved), and what comes next (a few questions, two minutes, your first Aura score). Same sign-in button and terms line. **Published on the owner's word and read back from the public site.**

**2026-11-18 · Every movement approved**

- Read from the live project, signed out: 136 published animations, 68 exercises, both characters each, none showing an out-of-date movement. That includes the five corrected movements at revision 2 and the three held back for the shoulders. Action 3f is done.
- Not yet built: movements for the remaining 48 exercises of the library.

**2026-11-18 · Published: the animation where the exercise is, the corrections, 360° everywhere**

- On the owner's word, `npm run deploy`. The public site serves: the demonstration as the whole screen of a workout and of an assessment test (F-136), the 360° button in every viewer (F-137), the corrected skinning and the five corrected movements, the closable resume bar, and the library's play marks and *Animated* filter.
- Checked on the public site, signed out, phone size: the 7 standing checks; the library shows *Animated · 60* and marks its rows; an approved exercise's page shows its animation with one 360° button; **a workout was stepped through there**: an exercise with an approved animation (Hollow Rock) fills the screen and goes to "watching" and back, and three without one (the corrected movements, which wait for approval) keep the plain screen.
- Still the owner's: approve the eight waiting exercises (3f), look at and switch on the themes (3k). **Not seen on a real phone.**

**2026-11-18 · The animation where the exercise is**

- The owner reported seeing animations in the assessment and nowhere else. Checked on the live site as it then was: the library page of an approved exercise did show its animation (in every theme, as an administrator too); what was not live was everything built since, which puts the animation on the whole screen of a workout and of an assessment test (F-136), because it had not been published.
- Added, so the animation is at the exercise wherever one is opened or listed: the **skill sheet** shows the movement at once instead of a "Watch the demonstration" row; **library rows** carry a small play mark when the exercise has an approved animation, and the library has an **Animated · n** filter. The only "Watch the demonstration" row left is in the assessment's station menu, which lists several variations at once.
- Checked with the 60 exercises approved on the live project: 6 checks (list, filter, exercise page, skill sheet). 639 tests; journeys 31 and 42.

**2026-11-18 · The owner's first corrections: five movements, and the body's shoulders and forearms**

- By this date the owner had approved **60 exercises (120 animations) on the live project**; they are served to a signed-out browser. What he sent back:
- **A fault of the body, everywhere**: shoulders and armpits caved in with the arms overhead (overhead wall reach, elevated pike push-up, hangs) and forearms thinned to a ribbon with the palms turned (chin-up). Cause: the skin was averaged between bones turned far apart. Fixed in how the skin follows the bones (`src/visual/body/skinning.ts`): no change to the character files, the skeleton or any movement, so **nothing he approved needs approving again**, and all six characters have it. Seen on the three exercises he named, a hang, a squat and a push-up, and on the Goku and Baki bodies.
- **Five movements corrected**, each now revision 2 and waiting for his approval: wall handstand shoulder taps (a real shift of weight; the palm on the shoulder, not by the armpit), parallel bar dip and negative dip (wrists straight over the rails), freestanding handstand (eyes on the floor between the hands), crow pose (shins resting on the arms, not through them). None of the five was among the 60 approved, so nothing live is withdrawn. Revision 1 of each is kept until revision 2 is approved. Each has a check that fails on the old movement (VISUALS.md §5). The freestanding shoulder taps, which he approved, share the tap with the wall version and were left as approved.
- **Studio**: a movement corrected while its animation was still waiting is put up again as it now is when its exercise is opened; no "Make a new version" step.
- **Resume bar**: the close button is a small cross on the bar's edge.
- 639 tests (10 new); journeys 31 and 42 checks, now run cut off from the live project so that what is approved there cannot change their result. **Not seen on a real phone**: the new skinning does more work per point of the body, on every frame. Not published.

**2026-11-18 · The demonstration fills the screen; 360° everywhere**

- At the owner's request. In a workout and in an assessment test the approved demonstration is now the screen itself, with the controls over it, instead of a "Watch the demonstration" row (F-136). What stays when the controls are sent away was decided by one rule: never hide what is changing or what must be pressed next. So the exercise's name, a running clock (hold or rest) and the primary button stay; the header, the level ladder, the set dots, the number entry and the small links go.
- The camera-angle buttons are gone from every viewer; a 360° button and a drag replace them (F-137).
- **The publishing path was seen working live for the first time**: the owner's first approvals reach a signed-out browser (F-109). The journey scripts now leave out whatever is already approved live.
- New: `src/features/library/StageScreen.tsx`, `DemoStage`, `Stage.setCover`, `stageTheme`. VISUALS.md §7, CLAUDE.md (themes rule).
- 629 tests; journeys 29 and 42 checks; the workout's stage 14 checks. **Not tried on a real phone.** Not published.

**2026-11-18 · The resume bar can be closed**

- At the owner's request. The bar that shows a workout still running has a close button. Closing asks first, in the theme's voice ("End this workout?" · "Is that all you've got?" · "Are you quitting your workout?!"), and says plainly what would be lost: how many sets are done and that ending saves none of them. Three answers: go back to the workout, **finish here and save the sets done** (offered only when there are any; it opens the session summary), or end it, which saves nothing.
- Four new lines in `src/theme/voice.ts`. The two "Discard session" buttons inside the workout itself are unchanged.
- Run in a browser at phone size in Aura Dark, Goku and Baki, 16 checks. **Not tried on a real phone.** Not published.

**2026-11-18 · Character Studio: one 360° button instead of four camera angles**

- At the owner's request. In the athlete's Character Studio (and the character step of Personalize) the Front / ¾ / Side / Back buttons and the play button are gone. One **360°** button turns the character all the way round, once, and stops where it began; pressing it again stops it. Dragging sideways on the character turns it by hand; up-and-down still scrolls the page on a phone. With "reduce motion" switched on in the device, the turn is immediate.
- Exercise demonstrations keep their camera angles: there the side view is part of reading the technique.
- Run in a browser at desktop and phone size, 12 checks (the turn, ending where it began, drag, stop). **Not tried with a finger on a real phone.** Not published.

**2026-11-18 · Published: the Studio's Exercises tab**

- On the owner's word, `npm run deploy`. The public site serves the Studio with Exercises, Characters, Muscles and Videos. Checked there signed out at phone size: 7 checks pass, no page errors. The Studio itself opens only for an administrator, so it was not seen on the live site.

**2026-11-18 · Studio: one Exercises tab; the Aura tab removed**

- At the owner's request. The Studio's tabs are now **Exercises, Characters, Muscles, Videos**. The Aura tab (theme tuning) is gone: athletes choose their own form in their Character Studio. Its saved adjustments stay in the settings and are still applied; they can no longer be edited from a screen.
- **Exercises** replaces Review and takes the exercise list out of Muscles: all 116 exercises, each with where it stands; open one to watch it; **Approve and send** is the only way anything reaches athletes (F-109). *Generate* is gone: a movement is put up for a decision the first time its exercise is opened. Muscles now shows the muscle groups only.
- The word "release" is no longer used for two different things. The button on the 3D view that sets off the Aura is called *Aura burst* and shows only where an Aura is on. The switch for a theme reads *Show Goku to athletes*.
- Seen at desktop and phone size; journeys re-run: 29 checks (T-15) and 40 (T-17), all pass. **Not run with an account.** Not published.

**2026-11-18 · Published: Goku, Goku Light and Zeno**

- The owner ran database step 0013 (he reported success; it cannot be read from outside) and said to publish. `npm run deploy`: the public site serves five themes and the Zeno form. Checked there signed out at phone size: 7 checks pass, no page errors; Goku, Goku Light and Baki are all "in preparation" for an athlete.
- Actions 3m and I-24 done. Still the owner's: look at the three themes and release them (3k).

**2026-11-18 · Goku and Goku Light; Zeno**

- The owner found the paper version too light for the main theme and kept it as **Goku Light**. A new dark **Goku** was built after four pictures he supplied: storm-dark pages with fire below and embers, and a stage where a fire with a ring of white heat burns behind the character and takes the colour of the form. Both themes share the character, forms, finishes and release switch (F-120, F-125; VISUALS.md §11). An account that had chosen Goku keeps the id and now gets the dark one.
- New last form **Zeno** (owner's name and picture): at full Aura the body itself becomes a violet night sky with stars, edged in white. Unlocked at Singular, the last Aura class (my choice). Saiyan is now gold and Ultra Instinct silver-blue, after his pictures; God is still jade (F-126).
- Finishes of the Goku universe are skin tones again (Dawn, Dusk, Night); Goku Light draws them almost paper-pale.
- **Database step 0013 is yours before this is published** (action 3m, I-24): the database refuses a fifth theme name until it has run.
- The owner's pictures were used for palette and manner only; none is in the app. The risk noted on this date above stands, and "Zeno" adds one more name from the same series.
- Seen: both characters on the dark stage in Saiyan, Ultra Instinct and Zeno; Zeno on paper; Home, profile, theme cards and Studio in both Goku themes. Tests T-16 (17 now), T-02 (261), T-17 (40 + 23, re-run). **Not seen:** any of it in a full movement or on a real phone; God, Destruction and Kaio-ken on the new dark stage. Not released to athletes (3k).

**2026-11-18 · Published: Goku and Baki, Goku as ink on paper**

- On the owner's word, `npm run deploy`. The public site serves the renamed themes, the repainted Goku theme and its renamed forms. Checked there signed out at phone size: 7 checks pass, no page errors (as T-17).
- Goku and Baki are still not released to athletes (action 3k): only an administrator can open them.

**2026-11-18 · Goku repainted as ink on paper; its forms renamed**

- After a picture the owner supplied, the Goku theme is now a **light** theme: paper grey, ink black, one vermilion and one navy, with a red sun in the corner of every page. Its 3D stage is a sheet of paper with the sun behind the character, and its Aura is painted on (F-125). Its character wears vermilion shorts with a navy sash and wristbands; finishes are Paper, Clay and Earth. The palette and manner were taken from the picture; the picture itself is not in the app.
- The owner named the five forms: **Saiyan, God, Destruction, Kaio-ken, Ultra Instinct** (F-126). Only the names shown changed: ids, unlock conditions, colours and anyone's saved choice are as they were. So "God" is still jade and "Ultra Instinct" pale gold.
- **The risk has grown, and the owner knows:** a theme called Goku, in these colours, with these five form names is recognisably a tribute to one existing series, not a manner. The character model, the artwork and the interface are still Aura's own, and no logo, symbol or picture from the series is used. Expect a request to change it if Aura is sold or listed in an app store; all of it is data in `src/theme/themes.ts`, `src/visual/styles.ts` and one block of `src/styles/index.css`.
- Seen: both characters standing in three forms, muscle highlight, Home, profile, theme cards, Character Studio and library at desktop and phone size; the personalization journey re-run (T-17). **Not seen:** the painted Aura through a whole movement, any of it on a real phone. Not released to athletes (action 3k).
- Changed: `src/styles/index.css` (power block), `src/theme/themes.ts`, `src/visual/styles.ts`, `stage.ts` (sun, floor wash), `aura/field.ts` (paint), `player.ts`, `Demo.tsx`, `index.html`, two posters. VISUALS.md §11, §12; CLAUDE.md.

**2026-11-18 · The two new themes renamed: Goku and Baki**

- The owner renamed Anime Power to **Goku** and Iron Will to **Baki**. Only the name shown changed (two entries in `src/theme/themes.ts`); the ids `power` and `iron`, the database, every saved choice, the characters and the forms are as they were. Earlier entries in this register now read with the new names.
- **A risk the owner has taken knowingly:** both are the names of other people's characters and are protected. The characters and artwork in Aura are original, which limits it, but the names alone can bring a request to remove them, more likely once Aura is sold or listed in an app store. Renaming back is a one-line change.
- F-120, F-124, F-134, VISUALS.md §11, CLAUDE.md (themes rule).

**2026-11-18 · Published**

- The owner ran 0012 (all 12 athletes read `everyone`) and said to publish. `npm run deploy`: the public site serves the build with the four themes, Personalize, the Character Studio and ratings open unless closed.
- Checked on the public site, signed out, phone size: 7 checks pass (T-17). Actions 3i, 3j and 3l are done; 3k (look at and release Goku and Baki) is the owner's.
- Still true: nobody has used any of this with a real account. The first sign-in on a phone is the first real test of saving a theme to an account and of two athletes seeing each other's ratings.


**2026-11-18 · Ratings open unless closed**

- The owner decided an athlete's Aura and ratings should be visible to other athletes from the start, and easy to close. They had started as "only me" in the work of earlier the same day, which was never published.
- Changed: the app's starting value (`DEFAULT_PRIVACY.ratings`), the wording of the sharing row (it now lists what "ratings" covers), migration `0012_ratings_open.sql` (new, action 3l), `apply.sql`, `supabase/README.md` §12. F-130, I-22, I-23, T-02 (259 checks), T-17 (39 checks, re-run).
- Confirmed from outside that 0011 is on the live project (action 3i done).
- **Not published.** 0012 first (action 3l), then the publish (3j).


**2026-11-18 · Personalization, athlete themes and Character Studio**
- Four themes on one platform (F-120 to F-135): Aura Dark, Aura Light, Goku, Baki. A theme is data (`src/theme/themes.ts`), a block of tokens (`src/styles/index.css`) and a column of copy (`src/theme/voice.ts`); it is saved on the athlete, not the device.
- A Personalize flow, a Character Studio for athletes, a character per universe on the shared skeleton (four new files), drawn shading for two of them, sixteen Aura forms with unlocks, celebrations per theme, more profile details and sharing choices, a completion state.
- Official assessments always use the original theme and the standard Aura character (F-132).
- Approval is one tap and reaches every screen that shows the exercise (F-133). The statuses in the Studio now read *Official* and *Approved, hidden*.
- Profile: settings and privacy moved behind one button (F-135).
- New: `src/theme/`, `src/features/personalize/`, `src/features/library/DemoSlot.tsx`, `src/ui/Stage3D.tsx`, `src/visual/styles.ts`, `src/visual/revisions.ts`, `public/themes/` (six posters), migration `0011_personal_style.sql`, tests T-16 and T-17, actions 3i to 3k, A-17, A-18, I-22. New dependencies: two fonts (`@fontsource/barlow-condensed`, `@fontsource/anton`).
- The four new bodies were sculpted by a parallel worker in the generator while the rest was built; the two Aura files came out byte-identical.
- **No scoring behaviour changed.** Unlocks read results and nothing reads a theme (T-16, T-17).
- **Not published, and it must not be before 0011** (action 3i). Goku and Baki are not released to athletes (action 3k).
- Recorded as not connected rather than presented as working: choices following an account across devices (never run live), sharing between real accounts, other athletes' looks.
- Decided for you, to be confirmed: the name "Iron Will" (renamed Baki by the owner the same day); forms and what unlocks them; every line of each voice; that the stage stays dark in Aura Light; that the whole athlete-side assessment switches to the original theme.

**2026-11-17 · The first-day assessment, animated**
- 58 more movements (F-108): with the pilot, every exercise the assessment uses. New equipment on stage: low bar, dip bars, parallettes, box, wall, ab wheel (F-107). `motions/testkit.ts` now checks every movement the same way; each family has its own standards.
- Written by seven parallel workers, one family each, then combined and looked through. Two interruptions on the way (a dropped connection, a usage limit); nothing was lost.
- Review gains *Generate N new*: every movement that has no animation yet, for both characters, in one step.
- **All pending. Nothing approved, nothing published to athletes.**
- Deployed the same evening, after you ran 0009 and 0010 (both checked on the live project). **Still not run with a real account**: the Studio saving to the server, uploads, and the start-over button.
- No scoring behaviour changed. No new migration.

**2026-11-17 · Start over with an account**
- New: F-16, migration `0010_start_over.sql` (one function, checked: T-02 now 231). The device-only *Start over* is unchanged.
- Not on the live project until you paste it (action 3h). The journey with a real account has not been run.

**2026-11-17 · Visual content: master characters, muscle activation, Aura, animation pilot**
- New: two generated 3D characters (F-100), three visual states (F-101), muscle activation from the exercise library (F-102), a modular Aura with seven themes and continuous intensity (F-103 to F-106), ten movements for both characters (F-107, F-108), the Studio with review and publishing (F-109), exercise videos (F-110), the exercise page showing what is published (F-111), workout-video records (F-112). Reference: `VISUALS.md`.
- New code: `scripts/character/` (generator), `src/visual/` (skeleton, rig, movements, Aura, player), `src/features/studio/`, `src/domain/media.ts`, `src/data/cloud/content.ts`. New command: `npm run character:build`. New dependencies: `three`; for the build only, `meshoptimizer`.
- Migration `0009_visual_content.sql` written and checked (T-02, now 223 checks); **not on the live project** (action 3e). The app does not depend on it: without it, nothing is published to others.
- Stored data version went from 3 to 4 (demonstrations, workout videos, Aura settings); older saved data is upgraded on load. The sample world's athlete is now an admin, so the Studio can be explored in the demo.
- **Nothing is approved or published.** All twenty animations are pending; all seven themes are experimental.
- Committed and pushed. **Not deployed**: the public address still serves the previous build (action 3g).
- Later the same day: the Studio no longer opens in the public demo; Review has *Copy my review*, which puts every decision and note on the clipboard as text.
- Recorded as prototype, not finished: the look of the characters and the muscle shapes. Recorded as not built: workout-video player, video-to-animation, themes for events, Aura on real achievements.
- Corrected: I-08 said the storage bucket was never applied; it answers on the live project.
- No scoring behaviour changed.

**2026-11-17 · Published: the USC course, station assessments and the level-up animation**
- You ran migration `0008` on the live project. Checked from here: `course_weeks.kind`, `course_weeks.focus`, `course_blocks.is_primary`, `assessment_sessions.mode`, `assessment_sessions.groups` and `assessment_participants.group_no` all answer. Action 3d done.
- `npm run deploy`: 122 tests pass, built for the public address, `gh-pages` replaced. The live site now serves everything up to and including the level-up animation.
- Still unverified: the whole course-and-assessment journey against two real accounts, on real phones (action 3c), and the animation's sound.

**2026-11-17 · Level-up animation in the Skill Tree**
- New: `src/ui/ascent.ts` (the animation, one canvas, no new dependency), `src/features/tree/Ascent.tsx`, `ascendSound` in `src/lib/sound.ts`; the store keeps a short list of level-ups waiting to be shown (device only, not synced). F-99, T-13.
- The unlock card's "See it in your skill tree" now opens the tree itself (where the level-up plays) instead of the skill's sheet.

**2026-11-17 · USC Calisthenics Beginner and station-based assessment**
- New course template (F-90); week kind and focus, focus/support exercises (F-91); assessment weeks wired to sessions (F-92).
- Assessment protocol `baseline-1` → `baseline-2` (F-21): maximums replaced by suggested ranges (F-95); 29 menu variations; two modes (F-93); station menu (F-94); coach station overview (F-96); rotation groups (F-97); re-test comparison (F-98). `baseline-1` sessions and hand-in links still work.
- **Scoring model unchanged** (SCORING.md §2.3, change log): every variation already had its own curve, so an easier variation never counts as a harder one.
- Migration `0008` (columns only) written and checked (T-02, 184). **Run on the live project and published on 2026-11-17** (see that day's entry). Verified in demo mode (T-12).

**2026-11-16 · Coach request: confirmation and contact**
- After sign-up with "I also coach": a card says the request has been sent, where to find it, and offers WhatsApp (+31 6 45 44 49 51, `src/app/contact.ts`). Profile shows the request as pending, with the same contact. The admin list hides requests from people who are already coaches.
- Typechecked and built; the two screens need an account and were not walked in a browser.

**2026-11-16 · Published**
- The accounts build is live on the public address (I-13). Actions 2 and 3 done. Next: you sign in with Google, make your account owner (README §8), and run the two-account test.
- `deploy.sh`: the secret-key check now ignores comments in `.env.local`.

**2026-11-16 · Welcome flow: an account first**
- With accounts: welcome → *Get started* → *Create your account* (Google, with Terms and Privacy) → the questions, with the name already filled in from Google. *Already have an account? Sign in* goes straight to Google and into the app. No device-only profile is offered (your decision). Walked in a browser up to the Google step; screenshots checked.

**2026-11-16 · Coach access by request; your account as owner**
- Migration `0007_coach_access.sql`: the coach role is granted by an admin only; `request_coach`, `decide_coach`, `revoke_coach`. Devices no longer send roles at all (the server owns them).
- Screens: "I also coach" at sign-up and "Ask for access" in Profile send a request; an admin sees and decides requests in Profile. Without an account, Coach mode is still a free toggle.
- Your account becomes admin by one line in the SQL editor (README §8); your email is not written in the repository, which is public.
- Manual linking verified live; F-82 configured. T-11 recorded. **Not yet on the live project: `0007` (yours to paste). Not published.**

**2026-11-16 · Privacy and terms pages**
- `public/privacy.html`, `public/terms.html`, linked from the welcome screen. **Published** on their own to the live site (the app there unchanged), with your go-ahead and your Gmail as the contact. Needed by Google to publish the sign-in consent screen. Written from what the app actually does; **not reviewed by a lawyer** (A-9 stays open: lawful basis, under-18s, deletion inside the app).

**2026-11-16 · Accounts and live sync (outstanding action 2)**
- New: `src/data/cloud/` (sync engine, row definitions, mappers, Supabase remote, sign-in), `src/features/account/`, the join screen for token invitations, `supabase/migrations/0006_live.sql`, `scripts/deploy.sh` (`npm run deploy`).
- Added F-80 to F-86, I-18, T-10, A-13 to A-16; status "Working (live)". Moved to Working (live): F-10, F-22, F-24 to F-28, F-32, I-03. A-2 done.
- Stored data version 2 → 3 (adds: is this the sample world, which account, what the server holds).
- With a project configured, the welcome screen no longer offers a device-only profile: Google sign-in or the demo. A device-only profile made earlier keeps working and is moved into the account on first sign-in (F-85).
- Recorded as waiting on you rather than working: the scan-to-join screen, keeping a guest profile, pushed live updates, and Google sign-in for anyone but listed test users (action 2). Recorded as not synced: places, check-ins, demonstration links.
- **Not published.** The public address still serves the earlier build (action 3).
- No scoring behaviour changed. The assessment protocol is unchanged (`baseline-1`).
- Left in the live project by the verification run: four guest accounts with no courses or sessions.

**2026-11-14 · Action #1 prep: backend setup made one paste**
- `supabase/apply.sql` (generated by `npm run db:bundle`): all five migrations + seed in one file, verified to apply as a single batch to a fresh Postgres.
- `supabase/README.md`: exact runbook for creating the project, the one paste, Google sign-in (incl. the OAuth callback + redirect URLs), the two env vars, and verification.
- Schema check now applies and tests `0002_storage.sql` with a storage stub (bucket + upload/delete policies): T-02 is 111 → 118.
- `src/data/supabase.ts`: OAuth `redirectTo` now includes the hosting sub-path (BASE_URL).
- No application behaviour changed; no real project created (that is yours to do).


**2026-11-14 · Profiles, Places & the scoring reference**
- Added F-50 to F-62 (identity, places, presence), F-70 to F-73 (scoring reference), F-46 to F-48 (not built), I-15 to I-17; I-06 and I-07 moved from "Not started" to working; actions A-8 to A-12; tests T-07, T-08.
- New: `SCORING.md`, `src/domain/places.ts`, `src/features/places/`, `src/ui/MapView.tsx`, `src/domain/scoring/audit.ts`, `scripts/scoring-audit.ts`, migration `0005_places.sql`. New dependency: `maplibre-gl`.
- No scoring behaviour changed.
- Recorded as sample or blocked rather than simulated: other athletes at a place (sample people), presence between devices (blocked on the backend; a link is the only transport), place photos (not started).
- Recorded as a risk: the public OpenStreetMap place service is not dependable (I-15).
- Stored data version went from 1 to 2; older saved data is upgraded on load (checked in T-07).

**2026-11-14 · Athlete Assessment & Group Onboarding**
- Created this register. `README.md` now points here for status.
- Added F-20 to F-35, F-45, I-04, I-05; new evidence tier "observed" (F-05); migrations `0003`, `0004`.
- Recorded as blocked rather than simulated: live coach board, participant-side group view, verification reaching the athlete's phone.

**2026-11-10 · First version**
- F-01 to F-15, schema `0001`, `0002`, seed, checks.
