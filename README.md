# Aura

A calisthenics and physical-mastery platform. Make human potential visible.

A working local-first version: the core screens, a real exercise and skill catalog, a provisional scoring engine, a coaching workflow, group assessments joined by QR code, and a map of places to train with opt-in check-ins, with a Supabase schema ready behind it.

**What works, what is simulated and what is still to be connected is tracked in [REGISTER.md](REGISTER.md).** That file is the source of truth for status; this one explains how the product is put together. **How scoring works, and how to change it safely, is in [SCORING.md](SCORING.md).**

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

On the welcome screen choose one of:

- **Explore the demo** – a sample athlete (Alex) with twelve weeks of history, enrolled in a handstand course and coaching a fundamentals course with four students. Everything is populated.
- **Begin** – the real onboarding: identity, experience, goals, self-assessment, provisional profile.

Other commands:

| Command | What it does |
| --- | --- |
| `npm test` | 94 unit tests over the catalog, scoring engine and its invariants, assessment, places and presence |
| `npm run build` | Type-check and production build |
| `npm run db:seed` | Regenerate `supabase/seed.sql` from the catalog in `src/domain` |
| `npm run db:check` | Apply schema + seed to an in-process Postgres and run 111 checks, including the access rules |
| `npm run scoring:audit` | Recompute every figure in SCORING.md from the code and check the catalog against the admission rules |

## The four systems

They are separate in the code, the data and the UI, and only connect through evidence.

| System | Question it answers | Where it lives |
| --- | --- | --- |
| **A. Exercise difficulty** (levels 1–n) | How do I make this exercise easier or harder right now? | `src/domain/catalog/progressions.ts` |
| **B. Athletic mastery** (rating per discipline) | What have I demonstrated I can do? | `src/domain/scoring/mastery.ts`, `curve.ts` |
| **C. Aura** | Who am I as an athlete, overall? | `src/domain/scoring/aura.ts` |
| **D. Skill tree** | What have I unlocked, and what is next? | `src/domain/catalog/skills.ts`, `scoring/skills.ts` |

**Evidence** is the single input to B, C and D: one performance on one exercise (reps or seconds), with how it is known: `estimated` (onboarding answers), `self` (logged by the athlete), `observed` (a coach watched it), `coach` or `video` (formally verified). Raw evidence and workout logs are stored; every score is recomputed from them.

Completing a workout never changes a rating. At the end of a session the athlete sees any sets that beat their record and chooses which to put on record; those become self-reported evidence that a coach can verify.

### Scoring model: `provisional-0.1`

A summary. The full reference, with the mathematics, worked examples, behaviour as the library grows and the rules for adding exercises, is [SCORING.md](SCORING.md). All of this is in `src/domain/scoring/config.ts` and is meant to be recalibrated. Nothing here is a validated performance standard.

- **Calibration curves.** Each rated exercise has a few anchor points mapping performance to rating points (for example 1 / 5 / 10 / 20 strict pull-ups → 300 / 400 / 480 / 610). Linear between anchors, damped and capped beyond the last one, so ratings can pass 1000.
- **Discipline rating** = the athlete's three strongest *different* benchmarks in that discipline, weighted 50 / 30 / 20. Empty slots count as zero, so a rating is marked *provisional* until three benchmarks exist. Repeating or adding weaker evidence never moves it.
- **Verified rating** is the same calculation on coach- and video-verified evidence only. A rating is labelled verified, self-reported or estimated by where most of it comes from.
- **Aura** = 10 × the power mean (exponent 3) of the six discipline ratings. A mean keeps it independent of how many disciplines exist; the exponent lets an exceptional discipline count for more than a flat average would. Shown beside it, never folded in: overall mastery (plain average), peak, versatility, and dedication (training consistency).
- **Skills** are thresholds on a measurable exercise ("Freestanding handstand · 30s"). A skill's point value is read from that exercise's curve, so the tree, the evidence and the rating are the same fact seen three ways. Demonstrating a skill implies its prerequisites.

One consequence to be aware of: someone with a single strong benchmark in a discipline reads low until they log two more. That is deliberate (it rewards demonstrated breadth and avoids ratings that drop when evidence is added), and the Home screen prompts for the missing benchmarks, but it is the first thing to revisit with real athlete data.

## What is in the app

| Screen | Route | Notes |
| --- | --- | --- |
| Home | `/` | Aura field, 12-week trend, ratings, next session, goals with the next missing step, recommended next steps, recent unlocks |
| Skill Tree | `/tree` | One constellation per discipline; height is rating. Mastered / verified / implied / available / locked states, goal paths, cross-discipline prerequisites |
| Train | `/train` | Enrolled courses, goal sessions, quick sessions at the athlete's own levels, courses to join, history |
| Course | `/train/course/:id` | Weeks, objectives, sessions, milestones, coach feedback |
| Workout | `/workout` | ← Easier · Level · Harder → on every laddered exercise, alternates at the same level, hold timer, rest timer, undo, summary with assigned vs performed |
| Library | `/library` | 116 exercises, 20 ladders, search, equipment filter, browse by muscle |
| Places | `/places` | Map of calisthenics parks and outdoor gyms from OpenStreetMap; place details and what can be trained there; check in for a set time; who trains there (now, regulars, recently, favourites) |
| Profile | `/profile` | Aura identity, Athlete DNA, ratings, records, skills, where you are from and train, privacy, consistency, settings |
| Athletes | `/athletes`, `/athlete/:id` | The scouter: another athlete's Aura, readout against yours, DNA overlay, signature skills |
| Assessment | `/assess/:id` | Six adaptive stations, one benchmark at a time; reveal; group view. Joined from a coach's QR code or taken alone |
| Coach Studio | `/coach` | Bests to verify, sessions to review, students, assessments |
| Group assessment | `/coach/assessment/:id` | Invitation QR, station timer, live board, observe / verify, group profile and level advice, finalise |
| Course builder | `/coach/course/:id` | Weeks, sessions, blocks, assigned level and the range students may move in, students, per-session results board |

## Code map

```
src/
  domain/            Pure TypeScript, no React. The product's rules.
    types.ts           Entities
    catalog/           Disciplines, exercises, progressions, skills
    scoring/           Curves, ratings, Aura, skill states, config
    training.ts        Session templates and goal sessions
    insights.ts        Goal progress, next steps
    places.ts          Privacy, presence, OpenStreetMap conversion, spot links
    domain.test.ts     Catalog integrity and scoring tests
  data/              State and persistence
    store.ts           The single store and every mutation
    seed.ts            Demo world
    courseTemplates.ts Course templates used by the demo and the builder
    supabase.ts        Client and Google sign-in (see below)
  ui/                AuraField, DnaSigil, MuscleMap, primitives
  features/          One folder per screen
supabase/
  migrations/        0001 core · 0002 storage · 0003–0004 assessments · 0005 places and presence
  seed.sql           Generated catalog seed
scripts/             Seed generator, schema check, scoring audit
```

## Assessments

`src/domain/assessment.ts` defines the protocol: one station per discipline, each opening with a benchmark everyone can attempt and branching on the result, so a beginner gets rows where a strong athlete gets chest-to-bar pull-ups. Results become evidence when the athlete finishes on their own device, or when the coach finalises the session, each at the tier it was given.

Devices do not share a backend yet, so two links carry the data: the **invitation** (QR on the coach's screen, holds the whole invitation) and the **hand-in** (QR on the participant's final screen, holds their results). Both live in the URL fragment of the app's root address, so they work on any static host. Handed-in results always arrive as self-reported.

## Places and presence

`src/domain/places.ts` holds the rules; `src/features/places/` the screens. Places come from OpenStreetMap on demand for the area on the map, plus any the athlete adds. A check-in records a place and a time window, never a position; it always ends, and who can see it is chosen each time. Four ties to a place are kept apart: training there now, a regular, there recently, a favourite.

Other athletes shown at places are the seeded sample athletes. Until accounts are connected, the only way presence reaches another device is a link the athlete sends themselves ("I'm here until 18:30").

The map and place search call three outside services from the browser (map tiles, OpenStreetMap place data, place-name search). None needs a key; none is guaranteed. Details and the production path are in REGISTER.md (I-07, I-15, I-16).

## Data and Supabase

The app is local-first: state lives in the browser's local storage on one device. The Supabase schema (`supabase/migrations`), seed and sign-in wiring exist but the app's data does not go through them yet. `src/data/store.ts` is the only place that mutates state, so it is the seam. Current status and the steps to connect it are in [REGISTER.md](REGISTER.md).

## Design language

Dark-first with a warm light theme. Instrument Serif for numbers and titles, Geist for interface text, Geist Mono for labels. Six discipline colours are the only strong colour in the product, and they mean the same thing everywhere: the Aura field, the DNA shape, the tree, the muscle map. Tokens are in `src/styles/index.css`.
