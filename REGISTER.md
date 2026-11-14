# Aura · Implementation & Integration Register

The single source of truth for what works, what only looks finished, and what still has to be connected.
Update it in the same change as any feature, integration or dependency (rule in `CLAUDE.md`).

Last updated: 2026-11-14 · after "Profiles, Places & the scoring reference"

## Read this first

**Aura runs on one device at a time.** All data lives in the browser's local storage. There is no shared backend yet, so nothing one person does appears on another person's device unless it travels in a link. Every "blocked" item below traces back to that.

**Places talks to three outside services straight from the browser**, none of them Aura's: map tiles (OpenFreeMap), place data (OpenStreetMap's public Overpass service) and place-name search (Nominatim). They need no account or key, and they come with no guarantee: during testing the place service answered in anything from 1 to 27 seconds and sometimes refused (I-15).

**The scoring model is documented in [SCORING.md](SCORING.md)**, which is checked against the code by the test suite.

### Most important outstanding actions

| # | Action | Who | Why it matters |
| --- | --- | --- | --- |
| 1 | Create a Supabase project, enable Google sign-in, run the five migrations and `seed.sql`, set the two env vars | **You** (external) | Unblocks accounts and everything shared: I-01, I-02, I-03 |
| 2 | Build the data layer that reads and writes through Supabase instead of local storage | Codebase, after 1 | Turns the coach board live, puts courses on students' phones, makes verification reach the athlete (F-25, F-27, F-29), and makes presence at a place real between people (F-57) |
| 3 | Try a group assessment **and a check-in at a real park** on real phones over a public HTTPS address | **You** + codebase fixes | Everything is verified in desktop Chrome with a simulated position (T-04). Camera scanning, real GPS, small screens and outdoor conditions are untested. Browsers only share a location over HTTPS |
| 4 | Review the assessment protocol as a coach: tests, gates, caps, order | **You** | The benchmarks and thresholds are my proposal (F-21). They decide what 20 people do in your class |
| 5 | Decide where Aura is hosted and record it here | **You** | The invitation QR points at whatever address Aura is opened from (I-13) |
| 6 | Read SCORING.md §9 and decide on proposals P1–P7 | **You** | Nothing in scoring was changed. Seven improvements are described with their measured effect; each changes numbers athletes have seen, so each is your call (A-10) |
| 7 | Choose how places are supplied in production | **You** + codebase | The public place service is not dependable enough for real users (I-15, A-8) |

## Status definitions

| Status | Meaning |
| --- | --- |
| **Working (local)** | The intended journey works end to end on one device and has been exercised in a browser. Not shared between devices. |
| **Working (link)** | Works across devices by carrying data in a link or QR code. No server involved. |
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
| F-01 | Onboarding (identity, experience, goals, quick estimate, profile) | Working (local) | Yes | – | – |
| F-02 | Exercise library: 116 exercises, 20 ladders, search, by muscle | Working (local) | Yes | Demonstration footage (I-08). Content review by a coach | – |
| F-03 | Difficulty levels: Easier / Level / Harder in a workout | Working (local) | Yes | – | – |
| F-04 | Workout player: sets, hold timer, rest, undo, summary | Working (local) | Yes | – | – |
| F-05 | Evidence and tiers: estimated, self-reported, **observed**, verified, video | Working (local) | Yes, except video | Video tier has no way to be granted (I-08) | – |
| F-06 | Mastery ratings (provisional model `provisional-0.1`) | Working (local) | Yes | Calibration against real athletes. Ratings read low with fewer than three benchmarks. Full behaviour, weaknesses and proposals in SCORING.md | – |
| F-07 | Aura, Athlete DNA, classes | Working (local) | Yes | – | F-06 |
| F-08 | Skill tree: 125 skills, prerequisites, goal paths | Working (local) | Yes | Content review by a coach | F-05 |
| F-09 | Goals and goal sessions | Working (local) | Yes | – | F-08 |
| F-10 | Courses, student view | Working (local) | Yes | Courses exist only on the device that created them | I-01 to I-03 |
| F-11 | Coach Studio: review, feedback, verify bests, students | Sample data | On one device | Real students need accounts and sync | I-01 to I-03 |
| F-12 | Course builder | Working (local) | Yes | Coach-defined exercises and ladders (schema supports them, no UI) | – |
| F-13 | Athlete discovery and scouter view, now showing the identity and places each athlete shares | Sample data | On one device | Real athletes, follow that persists across devices | I-01 to I-03 |
| F-14 | Coach attaches a demonstration video link to an exercise | Working (local) | Yes | Upload instead of link (I-08). Link is stored on one device | I-03 |
| F-15 | Light and dark theme, responsive phone and desktop layouts | Working (local) | Yes | Check on physical phones (T-04) | – |

### Assessment and group onboarding (added 2026-11-14)

| ID | Feature | Status | End to end? | What remains | Depends on |
| --- | --- | --- | --- | --- | --- |
| F-20 | Solo assessment from Home, Train, or the end of onboarding | Working (local) | Yes | – | F-21 |
| F-21 | Assessment protocol `baseline-1`: six stations, 42 adaptive benchmarks | Working (local) | Yes | Coach review of tests, gates and caps. No per-test demonstration media | F-02 |
| F-22 | Coach creates a group assessment for a course or a free-standing group | Working (local) | Yes | – | – |
| F-23 | Invitation by QR code and link | **Working (link)** | Yes, across separate browsers | The link is not a secret and cannot expire or be revoked without a server (I-05). Real phone-camera scan untested (T-04) | I-13 for a reachable address |
| F-24 | Participant joins without an account and records on their own phone; progress survives leaving and reloading | Working (local) | Yes | Their profile exists only on that phone until accounts exist | I-02 |
| F-25 | Results reach the coach | **Working (link)**, live sync **Blocked** | By hand-in QR/link, or the coach recording for them | Live board as people record. Today the coach sees a participant only after hand-in | I-01 to I-03 |
| F-26 | Coach board: who joined, per-station completion, who needs help, add by name, record for someone | Working (local) | Yes | "Asked for help" arrives with the hand-in, not live | F-25 |
| F-27 | Coach marks results self-reported / observed / verified | Working (local), reach **Partial** | On the coach's device | The athlete's own phone keeps showing self-reported until sync exists | I-03 |
| F-28 | Reveal: profile, shape, strengths, skills shown, how it is known, suggested goals | Working (local) | Yes | – | F-06, F-08 |
| F-29 | Group profile, anonymous standings, complementary partners | Working (local) on the coach's device and in the demo; **Blocked** on a joined phone | Coach side yes | A participant's phone holds only their own results, so it shows an honest placeholder | I-03, plus the server-side group total (schema: `assessment_group`) |
| F-30 | Sharing choice: coach only, or shape visible to the group | Working (local) | Yes, travels in the hand-in | Changing it after joining has no UI yet | – |
| F-31 | Level advice for the coach: where to pitch each ladder for this group | Working (local) | Yes | One-tap "apply to the course" is not built; levels are set by hand in the builder | F-12 |
| F-32 | Finalise: results become evidence at their tier, participants join the roster and the linked course | Working (local) | On the coach's device | Participants' own devices are not updated | I-03 |
| F-33 | Re-test compared with a baseline, per person and per group | Working (local) | Yes | Matching relies on the same roster; hand-ins from new phones match by name | – |
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
| I-01 | Supabase database | Built, not connected | `supabase/migrations/0001`–`0005` and `seed.sql`. Verified against an in-process Postgres only (T-02). No project exists. `0005` moves the city off the public profile row and adds places, favourites, visits and `check_in()` |
| I-02 | Authentication, Google sign-in | Requires configuration | `src/data/supabase.ts`. The button appears when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set. Never exercised against a real project. Signing in does not yet load or save any data |
| I-03 | App data through Supabase, real-time sync | Blocked | Not written. `src/data/store.ts` is the only place that changes state, so it is the seam. Real-time board needs Supabase Realtime on the assessment tables |
| I-04 | QR code generation | Working | `qrcode-generator`, drawn as SVG in `src/ui/QrCode.tsx`. Both codes decode correctly (T-03) |
| I-05 | Invitation links, tokens, access | Working (link); server tokens Built, not connected | Today the link carries the invitation itself in the URL fragment. Schema has unguessable, expirable `invite_token` and `join_assessment()` |
| I-06 | Location services | Working (local), **simulated position only** | The browser's own location prompt, asked for only on a tap ("use my location", "check with my location"). Read once, held in memory for that visit to the app, never stored or sent to Aura. No background or continuous tracking exists in the code. Browsers require HTTPS (or localhost) |
| I-07 | Maps | Working, third party | MapLibre GL (bundled, incl. its worker) drawing vector tiles and styles from `tiles.openfreemap.org`. No key or account. No uptime guarantee; each viewer's IP reaches that host. At scale: self-host tiles or use a paid provider |
| I-15 | Place data | Working, **unreliable** | OpenStreetMap via the public Overpass API (`overpass-api.de`, one mirror), queried for the map area on demand; results cached on the device (1,500 places). Observed: 1–27 s answers and 502 refusals. Only the bounding box is sent. A snapshot of 8 Lisbon places ships with the demo (`src/data/lisbonSnapshot.ts`) |
| I-16 | Place-name search | Working, third party | Nominatim's public server, called only when the search form is submitted (their policy forbids search-as-you-type and heavy use). Only the typed text is sent. Production needs a hosted or paid geocoder |
| I-17 | Places and presence in the database | Built, not connected | `0005_places.sql`: per-part audiences, `identity_of()`, `check_in()` (compares an optional position on the server and discards it), visits that cannot exceed 4 hours, history closed by default. 33 checks in T-02 |
| I-08 | Image and video storage | Built, not connected | `0002_storage.sql` defines a `demonstrations` bucket. Never applied; the local check skips it because it needs Supabase's storage schema |
| I-09 | Notifications, email | Not started | Would be needed for invitations by email, coach feedback alerts, re-test reminders |
| I-10 | Video playback | Working (local) | YouTube (no-cookie), Vimeo and direct file links |
| I-11 | Environment variables | – | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `.env.example`), `VITE_BASE` for a hosting sub-path. None are set in this repo |
| I-12 | Security and privacy | Partial | Row-level rules written and checked for every table (T-02). Locally there is no access control at all: whoever holds the device sees everything on it. What leaves the device today: map tile requests, the map area being searched, typed place names; never the athlete's identity or position (checked in T-07). A share link carries exactly what its screen says |
| I-13 | Hosting, domain, production config | Requires configuration | The build honours `VITE_BASE`. No deploy configuration or remote is in the repo. Deep links are avoided: invitations use the root address plus a fragment, so any static host works |
| I-14 | Fonts | Working | Bundled with the app; no external font service |

## C · Outstanding actions in detail

**A-1 · Stand up Supabase** — Priority 1 · *You, externally*
- What: create a project; enable the Google provider; run `0001_core.sql`, `0002_storage.sql`, `0003_evidence_observed.sql`, `0004_assessments.sql` in order, then `seed.sql`; copy `.env.example` to `.env.local` with the project URL and anon key.
- Why: nothing can be shared between devices without it.
- Verify: `npm run dev`, the Profile screen shows "Sign in with Google", and signing in creates a row in `profiles`.

**A-2 · Data layer** — Priority 1 · *Codebase, needs A-1*
- What: replace local persistence with reads and writes through Supabase, table by table, starting with profiles, evidence, assessments. Subscribe the coach board to assessment results.
- Depends on: A-1. One decision first: how a profile created on a phone without an account (F-24) is claimed when that person signs in.
- Verify: two real devices; a result recorded on one appears on the other's board without a hand-in.

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
| T-01 | Unit tests: catalog, scoring and its invariants, assessment protocol, link encoding, group analysis, places and presence rules, store behaviour | 94 pass | Local, Vitest | – |
| T-02 | All five migrations and the seed apply; 111 checks on access rules, incl. invitation tokens, result privacy, observe/verify, finalise, and 33 on identity, places and presence | 111 pass | In-process Postgres (PGlite) with stand-ins for Supabase auth | Not a real Supabase project. `0002_storage.sql` not covered |
| T-03 | Coach creates a session → participant joins **in a separate browser context** by the invitation link → completes four adaptive stations, incl. choices and a help request → reload keeps progress → reveal → hand-in link → coach imports → records for a second person → observes and verifies → finalises → same hand-in again updates. Plus: re-test vs baseline, the demo participant's group view, onboarding into a solo assessment. Both QR codes decoded with macOS's detector to the exact links used | Pass, no console errors | Local dev server, headless desktop Chrome at phone and desktop sizes | Separate storage stands in for separate devices. No physical phone, no real camera scan |
| T-04 | Physical phones, real class, real GPS, outdoors | **Not tested** | – | See A-3 |
| T-05 | Earlier walkthroughs (workout, courses, coach studio, onboarding, library, profile) re-run after this change | Pass | As T-03 | – |
| T-06 | Production build, and the map drawing in it | Pass, no console errors | `vite preview`, headless Chrome at phone size | App 947 kB; the map is a separate 1,067 kB chunk plus a 519 kB worker, loaded only when Places is opened |
| T-07 | Places, 33 checks: map draws → place opens with people in four separate groups (a private regular stays hidden, a favourite is not shown as a visit) → check in (starts at "only me", choose everyone, location confirmed at 40 m) → stored visit has no position → presence bar → "tell someone" link → **second browser context** sees who, until when, with Aura → the same link five hours later shows only the place → leave ends it at once → real town search and real OpenStreetMap places → "use my location" → add a place → profile identity, preview as a stranger, privacy change takes effect → forget history → other athletes show only what they share → data saved before this feature is upgraded on load → Home strip | Pass, no console errors | Local dev server, headless desktop and phone-size Chrome, **simulated position**, live third-party map and place services | In two runs the place service refused; the app reported it instead of hanging, and that branch is what was verified then. No physical phone |
| T-08 | Scoring: `npm run scoring:audit` over the whole catalog; document tables match the code | Pass: 0 failures of the admission checks, 41 warnings and 65 notes listed in SCORING.md §10 | Local | Simulated athletes and nine sample athletes; no real athlete data |

## E · Future requirements to plan for

| Need | Triggered by | Requires |
| --- | --- | --- |
| Claiming a phone-only profile on sign-in | F-24 + accounts | A merge rule and a migration path for local data |
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
