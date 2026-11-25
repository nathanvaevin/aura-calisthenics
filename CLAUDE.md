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
- At rest an Aura is its outline and its field. What shows in a burst is data on the theme (`act` in `aura/themes.ts`: a sign after the Aura's name, and which components join); ribbons join none. A burst happens on Activate, and where the owner asked for one: choosing the instructor, and completing an exercise (`useBurst`, which must never lose the result it is holding).
- Which muscles work comes from the exercise library. Do not invent activation per animation; a movement may only refine it (`detail`, `shift`).
- Characters, movements, muscles, Aura and video stay separate. A theme is data in `aura/themes.ts`; intensity is never part of a theme.
- After changing `scripts/character/` or `src/visual/body/`, run `npm run character:build` and commit the `.glb` files. `npm test` fails while they differ from the code.
- A garment whose edge runs where skin slides (an armhole) is `fitted`: cut from the skin itself (`scripts/character/wear.ts`), never laid over it. Her top also `stays` with the trunk: none of it may follow an arm, and it covers the side of the chest. The shorts are laid over, and VISUALS.md §2 says why they still are.
- Soft tissue gives to gravity (`SOFT_GIVE`) and swings a little with fast movement (`SOFT_SWING`, `Actor.sway`), both small: she wears a sports top, and it is to look natural, never exaggerated. It lives in the shared skinning text so everything that draws the body moves together; a character without soft tissue carries no data for it.
- Both characters show the same muscles for an exercise. A difference by sex needs evidence that clears VISUALS.md §4 and the owner's decision; then it is a `detail` on the movement, small.
- A place behind the character is data in `src/visual/scenes.ts` and a branch of a shader (`backdrop.ts`; the signature ones in `signature.ts`): painted by rule, never a loaded picture, and never the artwork, emblems, writing or names of an existing work. What a place is about stands at its -z and turns behind the subject for the exercise's camera (`Stage.face`); keep it clear of the workout screen's title and controls. Every place there was on 2026-11-25 is with athletes, at the owner's word, unless he switches it off (Studio → Characters → Backgrounds). **A place added later is shown to him before it is published**, since it is on from then. What someone starts with is his choice too (`DEFAULT_SCENE`: Aura outside, World ring, the ring in ink, The pit). The plain look stays first in the list. An assessment is shown in Aura outside for everyone (`officialScene`), never in the athlete's own place. A GLSL function of ours must not carry a built-in's name: the place stays black and nothing says so. A new one is looked at on each of its stages and behind the workout screen: it must not get in the way of the exercise.
- Update `VISUALS.md` in the same piece of work.

## Standing rule: themes and personalization

- A theme is presentation. Nothing under `src/domain/scoring` may read a theme, a character, a form or a finish; unlocks read the scoring, never the reverse. Changing a theme must leave evidence, ratings, courses and assessments untouched.
- A theme is data: an entry in `src/theme/themes.ts`, a block of tokens in `src/styles/index.css`, a column in `src/theme/voice.ts`. No screen may branch on a theme id; it uses tokens, `useVoice()` and `useWearing()`. A component that must look right inside another theme's preview reads the theme's own variables (`--display`, `--r-card`), not the Tailwind tokens.
- Every theme has four colours to choose from, its own (the owner's choice, 2026-11-25; Champagne is the Aura themes' default, his choice too): data in `src/theme/tones.ts`, tokens in `index.css`, worn as `data-tone` beside `data-theme`, kept on the device, one choice a universe. A universe's first tone is its themes' own tokens and has no block. A tone must be readable in every theme of its universe (a test measures it), and its id unlike any other. Never in an assessment.
- Official assessments are shown the standard way for everyone: Aura Dark, plain wording, the first tone (Champagne), the Aura master character in silver (Graphite, the first finish) under the Cosmic Aura, in Aura outside (`standardLook`, `useOfficialScene`). Do not put `useVoice()` or the athlete's look into `src/features/assess/`. An assessment opens by asking which of the two master characters demonstrates it (`Instructor.tsx`); the one chosen answers with the Electric Aura, on that screen only (the owner's choice, 2026-11-19), and performs every demonstration in it. The screen that ends an assessment (`src/features/journey/AssessmentDone.tsx`, `/assess/:id/done`) is not part of it: it hands the athlete back to their own theme and voice.
- All three universes are with athletes (the owner's word, 2026-11-25) unless he switches one off in the Studio. Anything new in one (a character, a form), or a new universe, is shown to him before it is published, since it is on from then; a new universe starts switched off.
- Every build of a character stands on the same skeleton. Do not move a joint for one build.
- Characters, costumes, artwork and form names are original. They may take a genre's manner; never an existing character's likeness, costume, logo, artwork or quotes. The theme names "Goku" and "Baki", Goku's five form names and its paper, vermilion and navy palette are the owner's own decisions (2026-11-18, taken knowing whose they are); they are data in `src/theme/themes.ts` and `src/visual/styles.ts`. Do not go further towards a source than the owner has asked: no likeness, symbol, logo or artwork, and no picture he supplies as reference goes into the app.
- The Aura is present in every theme and at every level: the orb also for someone unrated (six colours, quietly), the character's glow also at the lowest intensity (`glowOf`). A new theme sets `--aura-opacity` and `--aura-core-level` so its orb holds its colour; check it at nothing rated, low and high.
- A light stage (`StageLook.paint`) paints its Aura instead of lighting it. Check a new Aura theme on the paper stage as well as a dark one.
- Two themes may share a universe (Goku and Goku Light): same character file, forms, finishes and release switch; what differs is a `variant` in `src/visual/styles.ts`, read through `styleOf()`, and a poster named by `posterOf()`. A new theme id needs no database step since 0013.
- An exercise's demonstration is shown through `DemoSlot`, wherever the exercise appears, or through `StageScreen` where it is the background of a whole screen (a workout, an assessment test). Do not attach an animation to a screen any other way. A screen on `StageScreen` keeps its plain layout for exercises with no approved demonstration (`useHasDemo`). Where exercises are looked through one after another (an area of the assessment), one `DemoPreview` stays up and the movement on it changes: touching an exercise shows it, with no button in between.
- Which of the two characters someone has is chosen in Personalize and the Character Studio. No Male / Female switch in the library or while doing an exercise (the owner's choice, 2026-11-25); an assessment's choice of instructor is its own and stays.
- Looking round a character is one 360° button and a drag, everywhere. Do not bring back camera-angle buttons (Front, ¾, Side, Back).

## Standing rule: less on the page

- A page shows what is needed at a glance and what there is to do next. The rest goes in a `Fold` (one line until it is wanted) or behind a tap, not on the page. On a phone a fold starts closed; with room for two columns (`useWide`) it may start open.
- One primary action per screen. An explanation is one sentence, where it is needed; if a screen needs a paragraph, the screen is wrong.
- Folding is not removing: every feature stays reachable, and a coach's tools stay a coach's.
- The end of a flow celebrates, saves and moves on (the assessment's last screen is the model). Results and breakdowns live on the profile and are linked, not repeated.
- Moving on from a welcome lights the Aura first (`useIgnite`, `IgniteRing`, `nebula.ts`): "Get started", and joining an assessment from an invitation. One animation for both; do not make a second. It is golden light that fades at its edges (never a band with a border) and a burst with force in warm colours: no lightning, no literal electricity, nothing dreamy (the owner's words, 2026-11-24).
- The welcome screen is one still screen: it does not scroll, and in a public build the sample world is not on it (`…/?demo` opens it, for testing; on a developer's machine a button does, behind `import.meta.env.DEV`). The questions end on the starting line and then on the profile; nothing after them starts a workout or an assessment.
- Sizes are written in px and shipped in rem (`vite.config.ts`); "Larger text" (`settings.size`, per device) raises the root size. Write sizes as classes or CSS, not inline pixel styles, wherever they should follow it. Text size is not part of a theme.

## Standing rule: a coach sees their students

- While an athlete is enrolled in a coach's course, the coach sees all their results, goals and training, in the course and on their own. No athlete setting hides any of it from their coach; sharing settings are about other athletes only. Say so wherever an athlete joins a course or a coach's assessment.
- A coach reads; only the athlete writes their own training and results (a coach's verification and feedback are the coach's own records).
- Where someone trains stays theirs, also from their coach.

## Standing rule: location and presence

- Never store or transmit an athlete's position. A visit is a place and a time window.
- Location is read only on an explicit tap, once. No watching, no background use.
- Every check-in has an end time; sharing is chosen each time and starts at "only me".
- "Training now", "regular", "recent" and "favourite" are different facts. Keep them separate in data and on screen.
- Where someone trains is never an input to a rating.

## Commands

- `npm run dev` · `npm test` · `npm run build`
- `npm run db:seed` regenerates `supabase/seed.sql` from `src/domain`
- `npm run db:check` applies all fourteen migrations + seed to an in-process Postgres and checks the access rules
- `npm run db:bundle` regenerates `supabase/apply.sql` (the one-paste setup) from the migrations and seed — run it after changing either
- `npm run deploy` tests, builds and publishes to https://aurathletics.nl (the `gh-pages` branch of `nathanvaevin/aurathletics`). `npm run deploy:forward` puts `forward/index.html` at the old address. Publishing is outward-facing: run either only when the owner says so. Never give the old repository a CNAME
- `npm run character:build` regenerates the six characters in `public/characters/` (`-- power`, `-- iron male` build some of them; `-- --draft` is quick and coarse, for sculpting)
- `npm run scoring:audit` recomputes every figure in SCORING.md; `-- --write` regenerates its tables, `-- --check` verifies them

## Orientation

- `src/domain/` holds the rules, pure TypeScript: catalog, scoring, `assessment.ts`, `places.ts` (privacy, presence, OpenStreetMap conversion).
- `src/main.tsx` runs `src/data/moveIn.ts` (what a device had at the old address) and only then imports `src/boot.tsx`, the app. Nothing that reads the browser's storage may be imported by `main.tsx`. A new storage key that must survive the move goes in both `MOVING_KEYS` and `forward/index.html`.
- `src/data/store.ts` is the only place state changes. Screens read and write it and never wait for the network.
- `src/data/cloud/` keeps that store and Supabase in step while someone is signed in: `rows.ts` (tables and who may write a row), `mappers.ts` (state ↔ rows), `engine.ts` (push, fetch, merge), `remote.ts` (Supabase). A new synced table is added in `rows.ts` and `mappers.ts`; the engine does not change. `cloud.test.ts` runs two simulated devices against a pretend server.
- `src/visual/` is the 3D side, loaded lazily (never import it from a screen every athlete opens, except through `lazy()`): `body/` (skeleton and muscle channels, shared with the generator; `skinning.ts`, how the skin follows the bones: every shader that draws the body includes it), `rig.ts` (pose → joints), `motions/` (one movement per exercise: all 116 have one; a family per file, each with its test file), `aura/` (themes, field, behaviour), `player.ts`, `Demo.tsx`. `src/visual/pilot.ts` and `aura/themes.ts` are plain data and safe to import anywhere.
- `src/theme/` is personalization, pure data and rules except `useTheme.ts`: `themes.ts` (the five themes, named and ordered by the owner; three universes, forms, finishes), `personal.ts` (an athlete's choices, unlocks, what is worn, completion), `voice.ts` (copy per voice), `cast.ts` (a look → a character on stage). `src/features/personalize/` holds the flow and the athlete's Character Studio. An athlete's choices live on `Athlete.style` and sync as columns of `athlete_identity`.
- `src/features/studio/coverage.ts` says where each exercise stands for each character. An exercise counts for a character only when its animation is with athletes (approved, sent, current revision); a movement existing does not count.
- `src/visual/scenes.ts` lists the places a character can stand in and the stages each is offered on; the athlete's choice is on the device (`settings.scenes`), the owner's releases in `auraSettings.scenes`.
- `src/visual/styles.ts` says how each universe draws its character and lights its stage; `src/visual/revisions.ts` repeats each movement's revision as plain data (a test keeps it true).
- `src/features/journey/` is what joins the big moments together: the screen that ends an assessment, and the introduction (`Tour.tsx`: shown by the Shell so it can change pages, started through `useTour`; steps name real elements by `data-tour`, a step may name the page it belongs to (`at`) and climb it (`climb`); a step whose element is absent is skipped). `src/domain/training.ts` builds sessions at an athlete's own level, among them the first week of a course that opens with an assessment (`courseFor`, worked out per athlete, never written into the course).
- An athlete on their own chooses what to attempt in an assessment (`mode` `stations`, with the guided path one tap away); a coach's session runs the way the coach set it. Back from a test goes to the area it was chosen in, and what was chosen is kept in the address (`c`, then `q`).
- `src/domain/media.ts` holds the review rules; `src/data/cloud/content.ts` keeps admin-managed content in step with the server on its own channel, apart from the sync engine, and must keep working when its tables are missing.
- A schema change is a new numbered migration, added to `scripts/check-schema.ts` and `scripts/build-bundle.ts`, and the owner has to run it on the live project: say so. After a catalogue change the live database needs the new `seed.sql` too.
- Scoring is provisional and versioned (`src/domain/scoring/config.ts`). The assessment protocol is versioned too (`PROTOCOL` in `assessment.ts`, now `baseline-2`); bump it when tests change and add the old one to `KNOWN_PROTOCOLS` if its tests still read. `ALL_TESTS` order is part of hand-in links: only ever append (station `extra` lists come after every guided test). Station menu variations must already have a curve.
- Evidence tiers (estimated, self, observed, coach, video) must stay distinct everywhere they are shown.
