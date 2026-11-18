# Aura

Calisthenics mastery platform. React + TypeScript + Vite, local-first, Supabase schema prepared.

## Standing rule: keep REGISTER.md true

`REGISTER.md` is the project's source of truth for what works, what is simulated, and what is still to be connected.

Whenever a change adds or alters a feature, adds an integration, uncovers a missing dependency, removes a limitation, or reveals a future infrastructure need, update `REGISTER.md` in the same piece of work:

- Change the item's status using the definitions at the top of the register. An interface existing is not "Working".
- Mark something "Working" only after its user journey has actually been run, and record that run under Testing.
- Record anything that needs the owner to act outside the codebase (accounts, credentials, hosting) as theirs.
- Add a short entry to the change log, and end the task by telling the owner what changed in the register.

Never present simulated or sample behaviour as real. If something cannot work without a backend, say so in the UI and in the register.

## Standing rule: keep SCORING.md true

`SCORING.md` is the reference for the scoring model. Whenever scoring logic, slot weights, calibration curves, skill thresholds, evidence tiers, rating labels or the Aura calculation change:

- Run `npm run scoring:audit` and read what moved.
- Update the prose in `SCORING.md` that the change affects, add a line to its change log, then run `npm run scoring:audit -- --write` to regenerate its tables. `npm test` fails while they differ from the code.
- Bump `SCORING.version` when SCORING.md §10 says the change needs a new model version.
- Do not change scoring behaviour as a side effect of other work. Proposals go in SCORING.md §9 with their measured effect, and the owner decides.
- A new rated exercise passes the admission checks in §10 first; most new exercises should have no curve.

## Standing rule: visual content

`VISUALS.md` is the reference for the characters, movements, muscle activation and Aura.

- Nothing visual reaches athletes without the owner's approval. A generated animation is created `pending`; only an admin publishes. Do not seed, pre-approve or auto-publish.
- Change a movement → raise its `revision` and keep the earlier one in `motions/index.ts` until the new one is approved. A published animation of an older revision is withheld automatically; say so.
- A movement is held to its `standard`: add or update its checks in `motions.test.ts`. An animation that looks good and shows wrong technique is a failure.
- Which muscles work comes from the exercise library. Do not invent activation per animation; a movement may only refine it (`detail`, `shift`).
- Characters, movements, muscles, Aura and video stay separate. A theme is data in `aura/themes.ts`; intensity is never part of a theme.
- After changing `scripts/character/` or `src/visual/body/`, run `npm run character:build` and commit the `.glb` files. `npm test` fails while they differ from the code.
- Update `VISUALS.md` in the same piece of work.

## Standing rule: themes and personalization

- A theme is presentation. Nothing under `src/domain/scoring` may read a theme, a character, a form or a finish; unlocks read the scoring, never the reverse. Changing a theme must leave evidence, ratings, courses and assessments untouched.
- A theme is data: an entry in `src/theme/themes.ts`, a block of tokens in `src/styles/index.css`, a column in `src/theme/voice.ts`. No screen may branch on a theme id; it uses tokens, `useVoice()` and `useWearing()`. A component that must look right inside another theme's preview reads the theme's own variables (`--display`, `--r-card`), not the Tailwind tokens.
- Official assessments are shown the standard way for everyone: Aura Dark, plain wording, the Aura master character under the Cosmic Aura (`standardLook`). Do not put `useVoice()` or the athlete's look into `src/features/assess/`.
- A universe beyond the original, and anything new in one (a character, a form), reaches athletes only when the owner releases it in the Studio. Do not default a release to on.
- Every build of a character stands on the same skeleton. Do not move a joint for one build.
- Characters, costumes, artwork and form names are original. They may take a genre's manner; never an existing character's likeness, costume, logo, artwork or quotes. The theme names "Goku" and "Baki", Goku's five form names and its paper, vermilion and navy palette are the owner's own decisions (2026-11-18, taken knowing whose they are); they are data in `src/theme/themes.ts` and `src/visual/styles.ts`. Do not go further towards a source than the owner has asked: no likeness, symbol, logo or artwork, and no picture he supplies as reference goes into the app.
- A light stage (`StageLook.paint`) paints its Aura instead of lighting it. Check a new Aura theme on the paper stage as well as a dark one.
- Two themes may share a universe (Goku and Goku Light): same character file, forms, finishes and release switch; what differs is a `variant` in `src/visual/styles.ts`, read through `styleOf()`, and a poster named by `posterOf()`. A new theme id needs no database step since 0013.
- An exercise's demonstration is shown through `DemoSlot`, wherever the exercise appears, or through `StageScreen` where it is the background of a whole screen (a workout, an assessment test). Do not attach an animation to a screen any other way. A screen on `StageScreen` keeps its plain layout for exercises with no approved demonstration (`useHasDemo`).
- Looking round a character is one 360° button and a drag, everywhere. Do not bring back camera-angle buttons (Front, ¾, Side, Back).

## Standing rule: location and presence

- Never store or transmit an athlete's position. A visit is a place and a time window.
- Location is read only on an explicit tap, once. No watching, no background use.
- Every check-in has an end time; sharing is chosen each time and starts at "only me".
- "Training now", "regular", "recent" and "favourite" are different facts. Keep them separate in data and on screen.
- Where someone trains is never an input to a rating.

## Commands

- `npm run dev` · `npm test` · `npm run build`
- `npm run db:seed` regenerates `supabase/seed.sql` from `src/domain`
- `npm run db:check` applies all thirteen migrations + seed to an in-process Postgres and checks the access rules
- `npm run db:bundle` regenerates `supabase/apply.sql` (the one-paste setup) from the migrations and seed — run it after changing either
- `npm run deploy` tests, builds for the public address and replaces the `gh-pages` branch. Publishing is outward-facing: run it only when the owner says so
- `npm run character:build` regenerates the six characters in `public/characters/` (`-- power`, `-- iron male` build some of them; `-- --draft` is quick and coarse, for sculpting)
- `npm run scoring:audit` recomputes every figure in SCORING.md; `-- --write` regenerates its tables, `-- --check` verifies them

## Orientation

- `src/domain/` holds the rules, pure TypeScript: catalog, scoring, `assessment.ts`, `places.ts` (privacy, presence, OpenStreetMap conversion).
- `src/data/store.ts` is the only place state changes. Screens read and write it and never wait for the network.
- `src/data/cloud/` keeps that store and Supabase in step while someone is signed in: `rows.ts` (tables and who may write a row), `mappers.ts` (state ↔ rows), `engine.ts` (push, fetch, merge), `remote.ts` (Supabase). A new synced table is added in `rows.ts` and `mappers.ts`; the engine does not change. `cloud.test.ts` runs two simulated devices against a pretend server.
- `src/visual/` is the 3D side, loaded lazily (never import it from a screen every athlete opens, except through `lazy()`): `body/` (skeleton and muscle channels, shared with the generator; `skinning.ts`, how the skin follows the bones: every shader that draws the body includes it), `rig.ts` (pose → joints), `motions/` (one movement per exercise), `aura/` (themes, field, behaviour), `player.ts`, `Demo.tsx`. `src/visual/pilot.ts` and `aura/themes.ts` are plain data and safe to import anywhere.
- `src/theme/` is personalization, pure data and rules except `useTheme.ts`: `themes.ts` (the five themes, three universes, forms, finishes), `personal.ts` (an athlete's choices, unlocks, what is worn, completion), `voice.ts` (copy per voice), `cast.ts` (a look → a character on stage). `src/features/personalize/` holds the flow and the athlete's Character Studio. An athlete's choices live on `Athlete.style` and sync as columns of `athlete_identity`.
- `src/visual/styles.ts` says how each universe draws its character and lights its stage; `src/visual/revisions.ts` repeats each movement's revision as plain data (a test keeps it true).
- `src/domain/media.ts` holds the review rules; `src/data/cloud/content.ts` keeps admin-managed content in step with the server on its own channel, apart from the sync engine, and must keep working when its tables are missing.
- A schema change is a new numbered migration, added to `scripts/check-schema.ts` and `scripts/build-bundle.ts`, and the owner has to run it on the live project: say so. After a catalogue change the live database needs the new `seed.sql` too.
- Scoring is provisional and versioned (`src/domain/scoring/config.ts`). The assessment protocol is versioned too (`PROTOCOL` in `assessment.ts`, now `baseline-2`); bump it when tests change and add the old one to `KNOWN_PROTOCOLS` if its tests still read. `ALL_TESTS` order is part of hand-in links: only ever append (station `extra` lists come after every guided test). Station menu variations must already have a curve.
- Evidence tiers (estimated, self, observed, coach, video) must stay distinct everywhere they are shown.
