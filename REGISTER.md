# Aura · Implementation & Integration Register

The single source of truth for what works, what only looks finished, and what still has to be connected.
Update it in the same change as any feature, integration or dependency (rule in `CLAUDE.md`).

Last updated: 2026-11-16 · after "Accounts and live sync"

## Read this first

**Aura now has accounts and a shared database, built and verified against the live project, not yet published to the public address.** Signed in, a profile, its evidence, sessions, courses and assessments are saved to Supabase and appear on every device of that account; a coach's assessment is joined from other phones and its board follows them (T-10). The device still holds a full copy, so the app opens and records without a connection and sends when it is back. **What is on the public address today is still the earlier, device-only build**: publishing the new one is action 3, after the three dashboard steps in action 2.

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
| F-02 | Exercise library: 116 exercises, 20 ladders, search, by muscle | Working (local) | Yes | Demonstration footage (I-08). Content review by a coach | – |
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
| F-14 | Coach attaches a demonstration video link to an exercise | Working (local) | Yes | Upload instead of link (I-08). **Stays on the coach's device even when signed in**: students do not see it | I-03 (not yet synced) |
| F-15 | Light and dark theme, responsive phone and desktop layouts | Working (local) | Yes | Check on physical phones (T-04) | – |

### Assessment and group onboarding (added 2026-11-14)

| ID | Feature | Status | End to end? | What remains | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-20 | Solo assessment from Home, Train, or the end of onboarding | Working (local) | Yes | With an account it is saved and finalised through the same path as a group session; that path was run live for group sessions only | F-21 |
| F-21 | Assessment protocol `baseline-1`: six stations, 42 adaptive benchmarks | Working (local) | Yes | Coach review of tests, gates and caps. No per-test demonstration media | F-02 |
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
| I-08 | Image and video storage | Built, not connected | `0002_storage.sql` defines a `demonstrations` bucket. Never applied; the local check skips it because it needs Supabase's storage schema |
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

## D · Testing and verification

| ID | What was tested | Result | Environment | Limits |
| --- | --- | --- | --- | --- |
| T-11 | Live, after the dashboard steps (2026-11-16): a code opened in a never-used browser shows coach, group and course before sign-in → typed name → *Join as a guest* → lands in the assessment, on the coach's board under that name, enrolled in the course → the coach marks a result observed and it reaches the student's phone in 2.1 s **with that phone not asking** (pushed update) → finalising closes the code and the evidence arrives by itself → a guest is issued a Google link (manual linking on) → test data removed | 10 of 10 after the manual-linking fix | Local dev server against the live project, headless Chrome | Google sign-in and the Google round trip of keeping a profile: not run (need a person) |
| T-01 | Unit tests: catalog, scoring and its invariants, assessment protocol, link encoding, group analysis, places and presence rules, store behaviour, **and the sync engine with two simulated devices and a pretend server** | 114 pass | Local, Vitest | – |
| T-02 | All seven migrations and the seed apply; 174 checks on access rules, incl. invitation tokens, result privacy, observe/verify, finalise, identity/places/presence, the media bucket, `0006` (reading an invitation signed out, joining enrols, guest hand-over, evidence removed with its assessment) and `0007` (coach access by request) | 174 pass | In-process Postgres (PGlite) with stand-ins for Supabase auth and storage | Not a real Supabase project |
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
