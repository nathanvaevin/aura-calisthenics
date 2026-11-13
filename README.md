# Aura

A calisthenics and physical-mastery platform. Make human potential visible.

This is the first working version: seven connected screens, a real exercise and skill catalog, a provisional scoring engine, and a coaching workflow, running locally in the browser with a Supabase schema ready behind it.

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
| `npm test` | 31 unit tests over the catalog and scoring engine |
| `npm run build` | Type-check and production build |
| `npm run db:seed` | Regenerate `supabase/seed.sql` from the catalog in `src/domain` |
| `npm run db:check` | Apply schema + seed to an in-process Postgres and run 42 checks, including the access rules |

## The four systems

They are separate in the code, the data and the UI, and only connect through evidence.

| System | Question it answers | Where it lives |
| --- | --- | --- |
| **A. Exercise difficulty** (levels 1–n) | How do I make this exercise easier or harder right now? | `src/domain/catalog/progressions.ts` |
| **B. Athletic mastery** (rating per discipline) | What have I demonstrated I can do? | `src/domain/scoring/mastery.ts`, `curve.ts` |
| **C. Aura** | Who am I as an athlete, overall? | `src/domain/scoring/aura.ts` |
| **D. Skill tree** | What have I unlocked, and what is next? | `src/domain/catalog/skills.ts`, `scoring/skills.ts` |

**Evidence** is the single input to B, C and D: one performance on one exercise (reps or seconds), with how it is known: `estimated` (onboarding answers), `self` (logged by the athlete), `coach` or `video` (verified). Raw evidence and workout logs are stored; every score is recomputed from them.

Completing a workout never changes a rating. At the end of a session the athlete sees any sets that beat their record and chooses which to put on record; those become self-reported evidence that a coach can verify.

### Scoring model: `provisional-0.1`

All of this is in `src/domain/scoring/config.ts` and is meant to be recalibrated. Nothing here is a validated performance standard.

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
| Profile | `/profile` | Aura identity, Athlete DNA, ratings, records, skills, consistency, settings |
| Athletes | `/athletes`, `/athlete/:id` | The scouter: another athlete's Aura, readout against yours, DNA overlay, signature skills |
| Coach Studio | `/coach` | Bests to verify, sessions to review, students and how they adjust your programming |
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
    domain.test.ts     Catalog integrity and scoring tests
  data/              State and persistence
    store.ts           The single store and every mutation
    seed.ts            Demo world
    courseTemplates.ts Course templates used by the demo and the builder
    supabase.ts        Client and Google sign-in (see below)
  ui/                AuraField, DnaSigil, MuscleMap, primitives
  features/          One folder per screen
supabase/
  migrations/        0001_core.sql (schema + access rules), 0002_storage.sql
  seed.sql           Generated catalog seed
scripts/             Seed generator and schema check
```

## Data and Supabase: what is and is not wired

**Today the app is local-first.** State lives in the browser's local storage on one device. Other athletes, students and courses are sample data.

**Ready but not yet connected:**

- `supabase/migrations/0001_core.sql` – the full schema: profiles, catalog, scoring models and curves, courses, logs, evidence, snapshots, social. Row-level rules enforce that athletes cannot verify their own evidence, coaches only read data from athletes in their own courses, and scores cannot be written from the client. `npm run db:check` proves the SQL applies and those rules hold, against an in-process Postgres. It has not been run against a hosted Supabase project.
- `supabase/seed.sql` – the catalog, generated from the same source the app uses.
- `src/data/supabase.ts` – client and Google sign-in. With `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set (copy `.env.example` to `.env.local`), the sign-in button appears and a session is established.

**The missing piece** is reading and writing app data through Supabase instead of local storage. `src/data/store.ts` is the only place that mutates state, so that is the seam: each action there maps to one table in the schema.

To stand up the backend: create a Supabase project, enable the Google provider, run the two migrations and `seed.sql`, then set the two environment variables.

## Design language

Dark-first with a warm light theme. Instrument Serif for numbers and titles, Geist for interface text, Geist Mono for labels. Six discipline colours are the only strong colour in the product, and they mean the same thing everywhere: the Aura field, the DNA shape, the tree, the muscle map. Tokens are in `src/styles/index.css`.

## Not built yet

- Cloud data sync (above), invitations, real multi-user coaching
- Video upload and video verification (coaches can attach a video link per exercise today)
- Demonstration media: the library ships with instructions and muscle maps, no footage
- Rankings, challenges, activity badges, nearby-athlete discovery beyond a city filter
- Coach-defined exercises and ladders in the UI (the schema supports them)
