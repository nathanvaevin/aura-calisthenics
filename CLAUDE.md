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

## Standing rule: location and presence

- Never store or transmit an athlete's position. A visit is a place and a time window.
- Location is read only on an explicit tap, once. No watching, no background use.
- Every check-in has an end time; sharing is chosen each time and starts at "only me".
- "Training now", "regular", "recent" and "favourite" are different facts. Keep them separate in data and on screen.
- Where someone trains is never an input to a rating.

## Commands

- `npm run dev` · `npm test` · `npm run build`
- `npm run db:seed` regenerates `supabase/seed.sql` from `src/domain`
- `npm run db:check` applies all six migrations + seed to an in-process Postgres and checks the access rules
- `npm run db:bundle` regenerates `supabase/apply.sql` (the one-paste setup) from the migrations and seed — run it after changing either
- `npm run deploy` tests, builds for the public address and replaces the `gh-pages` branch. Publishing is outward-facing: run it only when the owner says so
- `npm run scoring:audit` recomputes every figure in SCORING.md; `-- --write` regenerates its tables, `-- --check` verifies them

## Orientation

- `src/domain/` holds the rules, pure TypeScript: catalog, scoring, `assessment.ts`, `places.ts` (privacy, presence, OpenStreetMap conversion).
- `src/data/store.ts` is the only place state changes. Screens read and write it and never wait for the network.
- `src/data/cloud/` keeps that store and Supabase in step while someone is signed in: `rows.ts` (tables and who may write a row), `mappers.ts` (state ↔ rows), `engine.ts` (push, fetch, merge), `remote.ts` (Supabase). A new synced table is added in `rows.ts` and `mappers.ts`; the engine does not change. `cloud.test.ts` runs two simulated devices against a pretend server.
- A schema change is a new numbered migration, added to `scripts/check-schema.ts` and `scripts/build-bundle.ts`, and the owner has to run it on the live project: say so. After a catalogue change the live database needs the new `seed.sql` too.
- Scoring is provisional and versioned (`src/domain/scoring/config.ts`). The assessment protocol is versioned too (`PROTOCOL` in `assessment.ts`, now `baseline-2`); bump it when tests change and add the old one to `KNOWN_PROTOCOLS` if its tests still read. `ALL_TESTS` order is part of hand-in links: only ever append (station `extra` lists come after every guided test). Station menu variations must already have a curve.
- Evidence tiers (estimated, self, observed, coach, video) must stay distinct everywhere they are shown.
