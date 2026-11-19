# Aura · Visual content reference

How the two master characters, their muscle activation, the Aura and the exercise animations are made, and how they relate to videos and to the review workflow. Status of each part is in [REGISTER.md](REGISTER.md) (F-100 to F-112); this file explains how it works.

Last updated: 2026-11-17 · the first-day assessment (68 movements)

## 1 · The parts, and what depends on what

```
anatomy (shapes)  ──build──▶  character file (.glb)  ─┐
skeleton (34 bones) ─────────────────────────────────┤
                                                      ├─▶ Player ─▶ Stage (the picture)
movement (per exercise, per revision) ───────────────┤
exercise library (which muscles work) ──▶ muscle layer┤
Aura theme (data) + intensity ──▶ Aura field ─────────┘

demonstration (a row an admin reviews) = exercise + character + movement revision + camera
```

Five things are kept apart on purpose, so that each can change without the others:

| Part | Where | Changes when |
| --- | --- | --- |
| Character (mesh, skeleton, clothes) | `scripts/character/`, built into `public/characters/aura-*.glb` | The look of a character is improved or replaced |
| Movement | `src/visual/motions/` | An exercise is added or its technique corrected |
| Muscle activation | `src/visual/body/muscles.ts` + the exercise library | Never per animation: it follows the library |
| Aura | `src/visual/aura/` | A theme is added or tuned |
| Recorded video | a row in `demo_assets` (kind `video`) | You upload or replace one |

A demonstration never contains a picture or a video of the animation. It is a small record that says *which* character performs *which revision* of *which* movement; the app draws it live. That is why twenty animations add nothing to the download, and why one corrected movement updates both characters at once.

## 2 · The master characters

**What they are.** Two rigged 3D models in the standard glTF format (`.glb`): `aura-male.glb` (about 67,000 triangles, 1.6 MB) and `aura-female.glb` (about 83,000 triangles, 2.0 MB). Each has one skeleton of 34 bones, skin weights, and per-vertex muscle data. Clothes and hair are separate meshes on the same skeleton. They open in Blender or any other 3D package.

**How they are made.** By code, not by hand: `npm run character:build` (`-- male`, `-- female`, `-- --draft` for a quick coarse build).

1. `anatomy.ts` describes a body as about 150 simple shapes placed relative to the skeleton: a frame (ribcage, pelvis, limbs), soft masses (chest, lats, glutes, thighs) and, on top, each muscle as a *relief*: a patch of skin raised by a few millimetres. One description serves both characters; the female one states its differences (narrower shoulders and waist, less muscle relief, breasts under a top, hair).
2. `sdf.ts` blends the shapes into one smooth surface. `mesh.ts` turns that into triangles (surface nets), in parts: trunk on a 4 mm grid, head 3 mm, hands 1.6 mm, feet 2.5 mm, cut along flat planes so the parts meet exactly. Each part is then simplified.
3. `skin.ts` gives every vertex its bones (from the shapes it sits on and how far along each bone it lies) and its muscles (from the reliefs it lies under).
4. Clothes are the same surface a few millimetres out, cut to a region (shorts, top), and weighted exactly as the skin beneath them so they move together. Skin well under clothing is left out.
5. `glb.ts` writes the file. The muscle data is the custom attribute `_MUSCLE` (two muscle slots and their shares per vertex).

**The skeleton** (`src/visual/body/skeleton.ts`) is shared by generator and app. Rest pose: arms out to the sides, palms down, legs slightly apart; every bone's rest rotation is identity. Names follow the usual humanoid set (hips, spine, chest, upperChest, neck, head; per side shoulder, upperArm, lowerArm, hand, upperLeg, lowerLeg, foot, toes) plus a forearm twist bone, three finger joints shared by the four fingers and two thumb joints.

**Honest limits.**
- Generated, not sculpted: stylised anatomy, simple hair, no face by design.
- No corrective shapes. Since 2026-11-18 the skin no longer loses its girth where bones are turned far apart (see *How the skin follows the bones*, below); a deep fold (the back of a knee in a full squat) can still crease.
- The four fingers bend together.
- The files are not compressed. Mesh compression (meshopt) would bring each to roughly a quarter of its size.

**How the skin follows the bones** (`src/visual/body/skinning.ts`, 2026-11-18). The usual way averages the places each bone would carry a point to; where two bones are turned far apart that average lies inside the limb, which is what made the shoulder cap vanish with the arms overhead and a forearm thin to a ribbon with the palm turned up. The bones' movements themselves are now blended into one rigid movement per point (dual quaternions), so a point turns part of the way with each bone and keeps its distance from the joint. It is shader text, with no change to the character files or the skeleton, and it is used by everything that draws the body so that they agree: the body's materials, its drawn outline, its shadow and the Aura's shells. Any new shader that draws the body with skinning must include it (`SKIN_DECL`, `SKIN_BLEND`).

**Replacing a character.** A character artist can supply a different mesh. The app needs: the same bone names and rest pose, materials named `skin`, `cloth`, `hair`, and the `_MUSCLE` attribute (slot numbers in the order of `CHANNELS` in `muscles.ts`). Movements, muscles and Aura then work unchanged.

## 3 · The three visual states

They are three independent dials on one material (`src/visual/character.ts`), not three versions of the character.

| State | What it is | Dial |
| --- | --- | --- |
| Base | Grey-white satin body, dark clothes, a quiet rim of light | nothing switched on |
| Muscle activation | Working muscles take a colour and glow, brighter at their outline; shows through clothing | one level (0–1) per muscle slot, 48 slots |
| Full Aura | The body itself becomes luminous and the Aura field surrounds it | the Aura field's intensity |

The default for a demonstration is base + muscles, no Aura.

## 4 · Muscle activation

- **Which muscles**: from the exercise library (`primary`, `secondary`, `stabilizers` of each of the 116 exercises). Nothing is decided per animation. Primary shows at 100%, secondary at 55%, stabilisers at 24%.
- **Where they are on the body**: 24 channels per side (`CHANNELS`), finer than the library's 19 names: three heads of the deltoid, upper and lower chest, forearm flexors and extensors. `MUSCLE_CHANNELS` maps one to the other.
- **Refinements per movement**: a movement may correct a channel (`detail`: a push-up uses the front of the shoulder, not the side; in a split squat the front leg works harder than the back one) and may move emphasis between phases (`shift`: cat-cow lights the abdominals when rounding and the back when arching). The level also rises and falls with the effort through each repetition.
- **Colour**: Aura pink by default; the discipline's colour is the alternative. Not yet decided which becomes standard.

## 5 · Movements

A movement is a function: for any moment of one cycle and any body, it writes a pose (`src/visual/motions/`, one per exercise).

- A **pose** is written like a coach's description: where the hips are and how the trunk is turned, where each hand and foot is, which way elbows and knees point (`src/visual/rig.ts`). The solver finds every joint, including the shoulder girdle rising with the arm and the forearm turning with the hand.
- Because contacts are stated (hands on the floor, hands round the bar, the ball of the foot planted), the same movement fits both characters exactly. Nothing is copied from one to the other.
- Each movement states its `standard` (what correct looks like) and a `revision`. Changing a movement means raising its revision; the old one stays in the code until the new one is approved, so the two can be compared.
- `kit.ts` holds the recurring geometry: a straight body on its toes, a hand round a bar or rail, a foot on its ball.
- A movement lists its **equipment** (`props`): a bar across the stage, two rails (dip bars, or parallettes when low), a box, a wall, an ab wheel that follows the hands. `src/visual/props.ts` draws them, sized to the character.
- A movement lists what is **planted** (a hand on the floor, a foot on the ground); that is checked for every movement automatically.

**Checked automatically.** `testkit.ts` holds what every movement must satisfy, for both characters at 48 moments: hands and feet reach where they are put; what is planted does not drift (under 4 mm); no elbow or knee folds past its range; nothing goes through the floor. Each family then has its own test file with each exercise's standard (lockout, depth, alignment, what touches the equipment, what stays off the floor).

**What exists** (`motions/index.ts`): 68 movements.

| Family | File | Exercises |
| --- | --- | --- |
| Pilot | `pushup`, `hang`, `squat`, `holds`, `pike` | push-up, strict pull-up, squat, front plank, pike push-up, hollow hold, split squat, dead hang, freestanding handstand, cat-cow |
| Push | `pushes.ts` | wall, high incline, low incline, knee, diamond, decline, archer and pseudo planche push-ups, elevated pike push-up, wall handstand push-up |
| Rows and dips | `rows.ts` | incline, horizontal and feet-elevated rows, bench dip, negative dip, parallel bar dip |
| Bar | `bar.ts` | scapular pull-up, negative pull-up, chin-up, chest-to-bar, hanging knee raise, hanging leg raise, toes-to-bar, tuck and advanced tuck front lever, muscle-up |
| Floor and core | `floor.ts` | dead bug, glute bridge, single-leg bridge, side plank, hollow rock, reverse plank, tuck L-sit, L-sit, kneeling ab-wheel rollout, Nordic curl negative |
| Legs | `legs.ts` | box squat, wall sit, single-leg calf raise, Bulgarian split squat, Cossack squat, deep squat hold, assisted pistol, pistol squat, shrimp squat |
| Handstand station | `inverted.ts` | box pike hold, crow pose, wall walk, chest-to-wall and back-to-wall handstand, wall and freestanding shoulder taps, elbow lever |
| Mobility | `mobility.ts` | standing toe touch, deep lunge stretch, overhead wall reach, pancake to elbows, full bridge |

Together these are every exercise of the first-day assessment (all 67 of its guided tests and menu variations) plus cat-cow.

**Adding an exercise.** Write its movement with the kit, give it a standard, its equipment and what is planted, add it to its family's list (or a new family in `motions/index.ts`), add its checks, and generate it in the Studio. It arrives as pending.

**Corrected after the owner's review (2026-11-18)**, each at revision 2, with revision 1 kept in `motions/index.ts` (`EARLIER`) until its replacement is approved, and a check that would fail on the old movement:
- *Wall handstand shoulder taps*: the hips travel most of the way over the supporting hand (a lean of about 8 degrees, was 3.4) before the other hand lifts, and the palm lands on the shoulder's cap, not a hand's width inside it. The freestanding version was already approved and is unchanged.
- *Parallel bar dip, negative dip*: the forearm stands over the rail and the hand goes on down from it, closed round the rail, so the wrist is all but straight. It was laid across the rail and bent sharply.
- *Freestanding handstand*: the head is lifted about 46 degrees, eyes on the floor between the hands (was 18).
- *Crow pose*: the shin is laid across the back of the upper arm just below the knee, a limb's thickness away from it and never inside it; the knee is past the arm. The distance between the centre lines of shin and arm went from 2.6 cm to 9 cm.

**Known limits.** The shoulder blades cannot be drawn back on their own, so the squeeze at the top of a row does not show. A hand keeps one orientation on a bar through a repetition. Rings and resistance bands do not exist as equipment. Transitions between exercises do not exist. The muscle-up and the wall walk travel the furthest from anything the rig was built for: look at those two hardest.

## 6 · The Aura

`src/visual/aura/`. One field per character, made of nine components, each a single draw: glowing outline, energy field, light rays, light ribbons, particles, rising streams, ground rings, sparks, lightning.

- A **theme** (`themes.ts`) is data only: a palette of up to six colours, a rhythm, and a level and starting point for each component. Seven exist: Cosmic, Electric, Solar, Ethereal, Primal (the five asked for), Signature (Aura's six discipline colours) and Lunar (silver).
- **Intensity** is separate from theme and continuous from 0 to 1. Components join in as it rises.
- **At rest an Aura is a glow; Activate lets it go** (owner's request, 2026-11-19: "less spiritual, more I'm gaining strong aura"). Standing, every theme shows only its outline and its field, and the outline burns at least as much as `FLAME_FLOOR` (heat off a body at work) and reaches at least 0.8 of the usual width. Rays, ribbons, particles, streams, ground rings, lightning and crackling sparks are let out only by a burst. **Activate** (`AuraField.charge`, `Player.charge`, the `activate` button on a stage: profile, Personalize, Character Studio; Studio → Characters' review button) gathers for `CHARGE_SECONDS`: the outline pulls in and quickens, the body brightens, streams and particles rise; then it bursts and settles back to the glow. A theme's own levels still decide how its burst looks. Choosing the instructor still bursts in Electric (`release`).
- **Tuning** an admin can apply per theme without touching it: strength, pulse speed, particle density, components switched off. Stored in `app_settings`, with whether the theme is approved and which is the default.
- **Behaviour** (`director.ts`): repetitions climb a little each rep and swell in the hard part; holds build steadily with a growing tremor; balance follows the small corrections; mobility breathes. A completed repetition sends a wave across the floor; the end of a set settles and starts again. **It no longer bursts by itself** (2026-11-19): bursting is the athlete's, with Activate.
- The field measures the body every frame, so it wraps a standing athlete, a plank and someone hanging alike.

**Theme pictures** (`public/themes/*.jpg`, the cards in Personalize) are rendered from the live characters by `npm run posters` (`scripts/render-posters.mjs` through `scripts/stage.html`, with the dev server running): each universe's poster form, three-quarter view, just after an Activate burst. The Aura pictures show Electric (owner's choice, 2026-11-19); the others are still the earlier renders.

**Adding a theme**: one entry in `THEMES`. A new kind of effect is a new component in `field.ts` plus its entry in every theme.

**Not built**: giving a theme to a challenge or an event; an explosive behaviour (no explosive exercise is in the pilot).

## 7 · Review and publishing

`src/domain/media.ts` (rules), `src/features/studio/` (screens), table `demo_assets` (migration 0009).

- **Where it happens: Studio → Exercises** (`Exercises.tsx`), one row per exercise in the library. An exercise is *waiting* while a movement exists and either character is not live, *needs correction* when one was sent back, *live* when both are published and current, and has *no animation yet* when nobody has written its movement. A movement is created `pending` the first time its exercise is opened there; the only way to an athlete is the admin's *Approve and send*.
- Statuses: draft → pending review → approved → published, with needs correction and archived. Only an admin moves them; athletes are served published rows only. On screen `published` reads **Official** and `approved` reads **Approved, hidden** (taken down).
- **Approval is one decision** (`makeOfficial`): *Approve and send* takes a pending version straight to published, and an archived one back to it. A version sent back for correction cannot be approved; it needs a new version.
- One version per exercise and slot (`male`, `female`, `instructor`, `instructor:<label>`) is published at a time. Publishing another archives the one before; it stays in the history.
- **One exercise record, one question.** Every screen that shows an exercise uses `DemoSlot` (`src/features/library/DemoSlot.tsx`), which asks for the published version of that exercise. Nothing is attached per screen, so approving, replacing or taking down reaches the library page, the skill sheet, the workout's technique sheet and both kinds of assessment at once. Where there is no approved animation the slot renders nothing and the screen keeps what it had.
- **The demonstration as the screen itself** (2026-11-18). During a workout and an assessment test the approved demonstration fills the screen and the screen's controls lie over it (`src/features/library/StageScreen.tsx`, fed by `DemoStage` in `DemoSlot.tsx`: the same published version, the same question). Two layers: everything, or, when the athlete touches the stage or the *Watch* button, only what must never be out of sight: the exercise's name, a clock that is running, and the one thing to press next. Starting a hold timer goes to the second by itself; stopping it comes back. The layers report how much of the canvas they cover (`Demo` `safe` → `Stage.setCover`), and the camera frames the subject in the band that is free, moving there smoothly: the canvas is a taller window round that band (`setViewOffset`), so nothing is resized. Over a dark stage on a light page (Aura Light) the screen is written in the dark theme of the same universe (`stageTheme`). An assessment's stage is the official presentation, as everywhere in an assessment. No approved demonstration: the screen is exactly as it was.
- **Choosing the instructor** (2026-11-19). An assessment opens with the two Aura master characters side by side, standing, no Aura. Touching one gives that character the Electric Aura at full and, a moment later, its release (`Player.release(who)` lets go for one performer only); the assessment then opens by itself. Electric is used here and nowhere else in an assessment: the demonstrations stay as they were, with no Aura. The choice is kept on the device for that assessment (`settings.instructor`) and `Demos.tsx` reads it for official demonstrations.
- **Looking through exercises** (2026-11-19). In an area of the assessment the stage stays up and the exercise on it changes the moment another is touched (`DemoPreview`): the official demonstration, the 360° button and nothing else. There is no "Watch the demonstration" step. Where an exercise has no approved animation, its muscle map stands in.
- **Looking round is one thing everywhere**: a 360° button that turns the subject once and stops where it began, and a drag across the stage (sideways for athletes; from above as well in the Studio's review). The Front / ¾ / Side / Back buttons are gone. A movement still opens on its own best angle.
- A correction note stays on the version it was written on and is copied to the next version. The earlier version is kept.
- **A published animation is shown only while the movement is the revision that was approved.** If the code changes the movement, the animation drops out of athletes' view until a new version is approved. Screens that are loaded for every athlete check this against `src/visual/revisions.ts`, a plain list of the current revisions (the movements themselves come with the 3D engine); a test fails when the list and the movements disagree, so raise both together.
- The content has its own channel to the server (`src/data/cloud/content.ts`), apart from the sync of personal data. If the tables are missing or the server is unreachable the app carries on; nothing is published.

## 8 · Recorded video

- **Exercise videos** are rows of kind `video` in the same table and the same review flow. Source is a link (YouTube, Vimeo, a file) or an upload to the `demonstrations` storage bucket (up to 50 MB; MP4 with H.264 plays everywhere). They sit beside the animations on the exercise page; neither replaces the other.
- **Workout videos** have their own table (`workout_videos`): title, description, focus, level, length, equipment, linked exercises, course, chapters. They can be recorded in the Studio. **Athletes cannot watch them in Aura yet**: there is no player for them.
- **When full workouts arrive**, they should not be stored in Supabase: a 30-minute video is hundreds of megabytes and needs adaptive streaming. Use a video host (Mux, Cloudflare Stream, Bunny Stream; or Vimeo/YouTube as the simple route) and keep only the link here. The `video` field already holds either kind of source.

## 9 · Later: from a recorded video to an Aura animation

Not built. What it would take, and what has been kept open for it:

1. **Pose from video.** Open models (MediaPipe Pose, MoveNet; for more accuracy a server-side 3D model) give joint positions per frame. Reliable for clear, side-on or front-on footage of one person; unreliable for inverted positions, crossed limbs, the body behind a bar, hands and feet. Calisthenics has a lot of exactly those.
2. **Onto the skeleton.** Bone names follow the usual humanoid set so that joint data maps directly. A captured movement would be a third kind of movement beside the written ones: sampled joint rotations, with the same contact rules applied afterwards so that hands and feet stay planted.
3. **Clean-up.** Smoothing, loop points, depth and lockout checked against the same standards the written movements are tested with.
4. **Review.** It enters the same queue as pending.

Expect it to need a person to correct most movements, at least at first. A realistic first step is using the video as a reference beside the Studio preview while a movement is written or adjusted.

## 10 · Performance

- Loaded only where a demonstration is shown: the 3D engine is a separate file (about 166 kB compressed), the characters are fetched when first needed and cached.
- One exercise with muscles: 4 draws, about 67,000 triangles. With an Aura: up to about 250,000 triangles, because the outline redraws the body twice.
- Measured (T-14): a steady 60 frames a second in desktop Chrome on an Apple M2, including at phone size and with the processor slowed sixfold. **No real phone has been measured.** If older phones struggle, the first things to reduce are the outline (one pass instead of two) and the shadow.
- A stage stops drawing when it is off screen or the tab is hidden.

## 11 · Universes: a character for each theme

The five themes of the app (`src/theme/themes.ts`) stand on three **universes**: Aura (Aura Dark and Aura Light), Goku (Goku and Goku Light), Baki. A universe is what a theme shares with the 3D side.

| | Aura | Goku | Baki |
| --- | --- | --- | --- |
| Body (`build`) | the two masters | hero build: broad shoulders, tapered waist; swept spiked hair; wristbands and sash | heavy build: thick neck and traps, wide lats, deep separation; hand wraps |
| Files | `aura-*.glb` | `power-*.glb` | `iron-*.glb` |
| Shading | modelled by studio light | flat colour in two tones and a black outline. **Goku**: a warm shade, black in the deepest shadow, an edge lit from behind in the colour of the fire. **Goku Light**: a grey wash, skin drawn almost as pale as the paper |
| Stage | cool key, two cool rims | **Goku**: storm dark, a fire with a ring of white heat behind the subject (`sun.blaze`), which takes the colour of the form while an Aura is shown (`sun.follows`). **Goku Light**: a sheet of paper, a vermilion sun behind the subject, an ink wash on the floor; the only light stage, its Aura **painted**, not lit (`paint`) | one hard key from the side, a faint red rim |
| Muscle colour | Aura pink | crimson | red |
| Hair | as the finish | takes the colour of the Aura as it rises | as the finish |

- **One skeleton.** Every build stands on `skeletonOf(id)`, bone for bone at the same joints, so a movement is written once and plays on all of them. A body is bigger round its bones, never longer. `assets.test.ts` checks every file.
- **A build is a parameter of the generator** (`anatomyOf(id, build)`); `npm run character:build -- power` builds one universe. The Aura files must come out unchanged when another build is touched.
- **How a universe is drawn is data** (`src/visual/styles.ts`): shading, outline, cloth colour, stage lighting, how much room the hair needs. The shading runs after the lights in the character's one material, so the three states (base, muscles, Aura) work in every universe.
- **Finishes** are the athlete's colours for a universe (skin, hair, accent): three each, in `themes.ts`. Material names a character file may use: `skin`, `cloth`, `hair`, `accent`.
- **A universe reaches athletes only when an administrator releases it** (Studio → Characters; stored with the Aura settings). Until then `wearing()` gives the original theme and the Aura character: an athlete is never shown a character nobody approved, and never a different universe's character in place of a missing one.
- Original designs. They take a genre's manner (flat colour and speed lines; ink and anatomy), not any existing character's likeness, costume or mark. The themes are *named* Goku and Baki by the owner's decision (2026-11-18; until then Anime Power and Iron Will). That is a name only: the characters, their clothes, the forms and their names stay Aura's own, and must not be drawn towards the characters those names belong to. The Aura wordmark keeps its own typeface in every theme.

- **Two themes, one universe** (2026-11-18). Goku and Goku Light share the character files, the forms, the finishes (Dawn, Dusk, Night: skin tones) and the release switch. `STYLES.power` is the dark rendition; `STYLES.power.variants.light` lists what the paper one changes, and `styleOf({ universe, variant })` lays it over. A theme names its variant (`AppTheme.variant`); `cast.ts` passes it on. The Aura universe has no variant: its stage is dark in both of its themes.
- **Zeno, the body as sky** (2026-11-18). An Aura theme may set `cosmos`: as the Aura rises the body itself is drawn as night sky (cloud in the theme's second and fourth colours, stars fixed to the body in three sizes, a white edge) and the drawn outline turns to light; with the Aura off the body is as it always is, so a demonstration is unchanged. One uniform on the body's material (`uCosmos`), driven by the player like the hair.
- **Goku Light is ink on paper** (2026-11-18, after a picture the owner supplied: black line, grey wash, vermilion, navy; the palette and manner were taken, not the artwork). Shorts vermilion, sash and wristbands navy, hair black; finishes Paper, Clay, Earth change the skin. On a pale stage additive light disappears, so `StageLook.paint` makes `AuraField.setPaint()` lay every component on with normal blending, deepen what was a white-hot core, and draw the outline shells from behind only, so paint never coats the body. A dark stage is untouched by this: `paint` is off for Aura and Baki.

Known limits: on paper the palest forms (Ultra Instinct's pale gold) read faintly. The new bodies were looked at in nine poses as stills, not through every movement. Goku hair goes through the floor when the head is close to it. The drawn outline draws each body a second time.

## 12 · Forms: the Aura variations of a universe

A **form** is an Aura theme (§6) given a name, a place in a universe and a condition (`Form` in `themes.ts`). Aura has six (Cosmic, Signature, Lunar, Solar, Ethereal, Electric), Goku six (ids `ignition` → `transcendent`, then `zeno`; shown as Saiyan, God, Destruction, Kaio-ken, Ultra Instinct, Zeno, the owner's names of 2026-11-18; Saiyan is gold and Ultra Instinct silver-blue since then), Baki five (Pressure → Apex). The ten new ones are ordinary entries in `aura/themes.ts`, marked with their universe; Baki's use no rays and no ribbons, only heat, steam, sparks and the ground.

- The first form of a universe is everyone's. The others are unlocked by an Aura class reached, a number of skills mastered, or a skill verified by a coach (`Unlock`). **An unlock reads the scoring and nothing reads a form**: `personal.ts` imports the class thresholds, and no file under `src/domain/scoring` knows a theme exists.
- A form that is chosen but not earned is not worn; the first one is, and the choice is kept for when it is earned. An administrator can wear all of them, to review them.
- Intensity stays separate (§6): the athlete's own, 10 to 100%.
- Earning a form is announced once per device (`Celebration.tsx`), never during a workout or an assessment.

## 13 · Whose character, and where

`src/theme/cast.ts` is the one place that turns an athlete's look (`wearing()`: universe, character, form, finish, intensity) into what the player is given, so the profile, the Character Studio and a demonstration show the same character.

- **Demonstrations outside assessments**: the approved movement, performed by the athlete's own character in their universe, with the working muscles as they prefer. The movement and its camera are the approved ones; only who performs it differs.
- **Official assessments**: always `standardLook()`: the Aura master character, pearl finish, Cosmic Aura, and the whole athlete-side assessment in the Aura Dark theme with its plain wording. Exercise requirements, technique and scoring cannot differ, because they never depended on a theme.
- **The athlete's Character Studio** (`src/features/personalize/`) previews and saves preferences. The only movements it can play are published ones. It has no way to create, change or publish an asset.
