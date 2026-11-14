# Aura · The scoring system

The reference for how Aura turns performances into ratings, an Aura and a skill tree: what the code does, why, how it behaves as the exercise library grows, and how to change it safely.

- Model version: `provisional-0.1` (`src/domain/scoring/config.ts`)
- Last reviewed against the code: 2026-11-14
- Every figure in this document was produced by running the real code (`npm run scoring:audit`). Tables between `generated` markers are rewritten by `npm run scoring:audit -- --write` and checked by the test suite, so they cannot drift.

**Status of the numbers.** The formulas are deliberate. The calibration anchors are one coach-minded ordering of benchmarks onto a shared scale, not a validated standard. Nothing here has been fitted to real athletes yet; §9 lists exactly what that data must settle.

## Contents

1. The model in one page
2. Evidence: the only input
3. Calibration curves
4. Discipline ratings
5. Aura and its companion numbers
6. Skills, levels and what scoring does not touch
7. What happens when the library grows
8. Consistency and fairness
9. Assessment: preserve, improve, watch, validate
10. Admitting a new exercise
11. Keeping this document true
12. Change log

---

## 1 · The model in one page

Four systems, separate in code and data, connected only through **evidence**.

| System | Question | Formula in one line | Code |
| --- | --- | --- | --- |
| A · Exercise difficulty | Easier or harder, right now? | A level on one ladder. No scoring. | `catalog/progressions.ts` |
| B · Mastery | What have you shown you can do? | Rating = 0.5·s₁ + 0.3·s₂ + 0.2·s₃, your three strongest different benchmarks in the discipline | `scoring/curve.ts`, `mastery.ts` |
| C · Aura | Who are you as an athlete, overall? | Aura = 10 · ∛(mean of the six ratings cubed) | `scoring/aura.ts` |
| D · Skill tree | What is unlocked, what is next? | A skill is a threshold on one exercise; reaching it masters it and implies its prerequisites | `scoring/skills.ts` |

The pipeline, for one athlete:

```
evidence ──► best value per exercise ──► score on that exercise's curve
                                              │
                    three strongest per discipline, weighted 50/30/20
                                              │
                              six discipline ratings ──► Aura (power mean, p = 3)
evidence ──► skill thresholds ──► mastered / available / locked (+ implied prerequisites)
```

Everything is a pure function of stored evidence. No score is stored as truth; change a formula and every number can be recomputed.

<!-- generated:constants:start -->
| Constant | Value | Where |
| --- | --- | --- |
| `version` | `provisional-0.1` | `SCORING.version` |
| `slotWeights` | `0.5 / 0.3 / 0.2` | `SCORING.slotWeights` |
| `auraExponent` | `3` | `SCORING.auraExponent` |
| `auraScale` | `10` | `SCORING.auraScale` |
| `observedShare` | `0.6` | `SCORING.observedShare` |
| `verifiedShare` | `0.6` | `SCORING.verifiedShare` |
| `estimatedShare` | `0.5` | `SCORING.estimatedShare` |
| `extrapolation` | `0.5` | `SCORING.extrapolation` |
| `dedicationWeeks` | `8` | `SCORING.dedicationWeeks` |
| `bands` | `Foundation 0 · Beginner 200 · Intermediate 400 · Advanced 600 · Elite 800 · World-class 1000` | `BANDS` |
| `auraClasses` | `Spark 0 · Ember 1500 · Kindled 3000 · Radiant 4500 · Luminous 6000 · Stellar 7500 · Corona 9000 · Singular 10500` | `AURA_CLASSES` |
| `tierRank` | `estimated 0 · self 1 · observed 2 · coach 3 · video 4` | `TIER_RANK` |
<!-- generated:constants:end -->

The catalog these formulas run on today:

<!-- generated:catalog:start -->
| Discipline | Exercises | Rated (have a curve) | Skills | Calibrated top | Ceiling | Benchmarks that set the ceiling |
| --- | --- | --- | --- | --- | --- | --- |
| Handstand | 16 | 14 | 20 | 966 | 1208 | One-Arm Handstand, Press to Handstand, Freestanding Handstand |
| Pulling | 23 | 22 | 25 | 988 | 1235 | One-Arm Pull-up, Front Lever, Bar Muscle-up |
| Pushing | 26 | 25 | 27 | 1029 | 1286 | Full Planche, Freestanding HSPU, Straddle Planche |
| Core | 18 | 18 | 19 | 947 | 1184 | Manna, V-sit, Dragon Flag |
| Legs | 16 | 16 | 18 | 780 | 975 | Nordic Curl, Advanced Shrimp Squat, Pistol Squat |
| Mobility | 17 | 14 | 16 | 826 | 1033 | Middle Split, Front Split, Full Pancake |
| **All** | 116 | 109 | 125 | Aura 9,311 | Aura 11,640 |  |
<!-- generated:catalog:end -->

"Calibrated top" is the rating with every benchmark at its last anchor. "Ceiling" is the most the discipline can ever read (§3.3).

---

## 2 · Evidence: the only input

One piece of evidence is one performance on one exercise: `(athlete, exercise x, value v, tier τ, date)`, with `v` in whole reps or seconds (`Evidence` in `src/domain/types.ts`).

### 2.1 Where evidence comes from

| Source | Tier it enters with | Rule | Code |
| --- | --- | --- | --- |
| Onboarding answers | `estimated` | Each answer is a range ("5–9"); the **low end** is recorded | `features/onboarding/Onboarding.tsx` (`QUESTIONS`) |
| A workout | `self` | Only sets that beat the athlete's record are offered, and only the ones the athlete chooses to put on record are saved. Finishing a workout alone changes nothing | `store.finishWorkout`, `candidatesIn` |
| Logged by hand | `self` | Any rated exercise | `store.addEvidence` |
| An assessment | `self`, `observed` or `coach` | Each result becomes evidence at the tier the coach gave it, when the athlete submits or the coach finalises | `assessment.resultsToEvidence` |
| A coach verifying a claim | `self` → `coach` | The coach confirms an existing record against the written standard | `store.verifyEvidence` |

Tiers, weakest to strongest: `estimated` < `self` < `observed` < `coach` < `video`. **The tier never changes what a performance is worth.** It changes the label on the result, and it decides whether the evidence counts toward the separate verified rating (§4.3).

### 2.2 Best evidence per exercise

For each exercise only the single best piece counts (`bestEvidence` in `mastery.ts`):

> highest value; on a tie the higher tier; on a further tie the earlier date.

Consequences worth stating plainly:

- Repeating a performance, or logging a weaker one, changes nothing.
- There is no decay. A result from two years ago counts exactly as one from yesterday. A rating falls only if evidence is removed.
- A higher self-reported value replaces a lower verified one as "the best" (see §4.4 for what that does to labels).

---

## 3 · Calibration curves

### 3.1 Definition

Each rated exercise carries anchors `(v₁, r₁) < (v₂, r₂) < … < (v_k, r_k)`: performance → rating points. For example, strict pull-ups:

`(1, 300) (3, 350) (5, 400) (8, 450) (10, 480) (15, 550) (20, 610) (25, 650)`

The score of a value `v` on that curve (`curveRating` in `curve.ts`):

$$
f(v)=\begin{cases}
0 & v \le 0\\[2pt]
r_1\,\dfrac{v}{v_1} & 0 < v \le v_1\\[8pt]
r_{i-1}+(r_i-r_{i-1})\dfrac{v-v_{i-1}}{v_i-v_{i-1}} & v_{i-1} < v \le v_i\\[8pt]
\min\!\big(1.25\,r_k,\; r_k+\lambda\,m_k\,(v-v_k)\big) & v > v_k
\end{cases}
$$

with `λ = 0.5` (`SCORING.extrapolation`) and `m_k = (r_k − r_{k−1}) / (v_k − v_{k−1})`, the slope of the last segment.

Worked on pull-ups: 9 reps sits between (8, 450) and (10, 480), so `f(9) = 450 + 30·½ = 465`. Beyond the last anchor the slope is `(650 − 610)/5 = 8` per rep, halved to 4: `f(30) = 650 + 4·5 = 670`, `f(40) = 710`, `f(60) = 790`, and never more than `1.25 × 650 = 812.5`.

### 3.2 Why this shape

| Choice | Purpose | Cost |
| --- | --- | --- |
| Anchors on a shared 0–1000+ scale | Puts unlike things (seconds upside down, reps on a bar) in one unit, so benchmarks can be compared and blended | The shared scale is an assertion: "10 pull-ups ≈ 480 ≈ a 6-second freestanding handstand (454)". Only data can confirm it (§9) |
| Piecewise linear | Every number is explainable by reading two anchors. No fitted parameters to defend | Kinks at anchors; with only two anchors the curve is a straight line |
| Mostly concave (points per unit shrink) | The first pull-up is a bigger event than the twentieth | Must be maintained by hand; the audit flags one curve that breaks it (`back-lever`) |
| Linear from the origin below the first anchor | Partial performances get partial credit | Over-credits a token attempt at a hard skill (§3.4) |
| Damped, capped continuation | Exceptional performances pass the calibrated range without running away; endurance on an easy exercise cannot imitate a hard skill | The 0.5 and 1.25 are choices, not measurements |

Current shape of the 109 curves: 30 have two anchors, 50 have three, 24 have four, 5 have five or more. 64 count reps, 45 time a hold, 21 are per side.

### 3.3 The cap is what makes difficulty matter

Because every curve stops at `1.25·r_k`, an easy exercise can never score like a hard one, however long it is held. A two-minute plank is 230 points; a ten-minute plank is at most 287. This single rule is why the model does not need a separate "difficulty multiplier": difficulty lives in where a curve's anchors sit, and volume cannot climb out of them.

It also fixes each discipline's ceiling: `0.5 + 0.3 + 0.2` of the three highest caps.

### 3.4 Known weakness: one unit of a hard skill

Below the first anchor the score is pro rata. Where the first anchor is itself a real achievement, one second is worth a lot:

| Exercise | First anchor | One second or rep reads |
| --- | --- | --- |
| Full planche | 2 s → 980 | **490** |
| Manna | 2 s → 960 | 480 |
| Straddle planche | 2 s → 850 | 425 |
| Front lever | 2 s → 810 | 405 |
| Handstand shoulder taps | 2 → 640 | 320 |
| One-arm handstand | 3 s → 900 | 300 |

A self-reported "1 second" of full planche scores like 5 clean pull-ups (400) and more than a 60-second chest-to-wall handstand (340). Ten curves are flagged by the audit. Proposal P3 in §9 addresses it. The written `standard` on each exercise is the present safeguard: a coach verifying the claim would not accept it.

---

## 4 · Discipline ratings

### 4.1 Definition

For discipline `d`, take the athlete's best score on every rated exercise in it and sort them: `s₍₁₎ ≥ s₍₂₎ ≥ s₍₃₎ ≥ …`. Then (`disciplineRating` in `mastery.ts`):

$$
R_d=\operatorname{round}\big(0.5\,s_{(1)}+0.3\,s_{(2)}+0.2\,s_{(3)}\big),\qquad s_{(i)}=0 \text{ if the athlete has fewer than } i \text{ benchmarks.}
$$

A rating built on fewer than three benchmarks is flagged **provisional**.

Worked example, one athlete adding evidence over time (pulling):

| Evidence on record | Scores | Rating | Label |
| --- | --- | --- | --- |
| 10 pull-ups | 480 | `0.5·480` = **240** | self-reported, provisional |
| + 12 chin-ups | 480, 480 | `240 + 0.3·480` = **384**¹ | provisional |
| + 60 s dead hang | 480, 480, 200 | **426** | self-reported |
| + 15 horizontal rows (340, displaces the hang) | 480, 480, 340 | **454** | self-reported |
| + 9 pull-ups logged again | unchanged | **454** | nothing moves |

¹ The code reports 386: chin-ups have their own curve and 12 reads slightly above 480.

### 4.2 Why three slots, weighted 50 / 30 / 20

- **Top-k, not a sum or an average.** A sum rewards the number of exercises logged. An average punishes an athlete for logging an easy exercise. Taking the strongest few does neither: weaker and repeated evidence is ignored, so a rating can only be raised by showing something better.
- **Three.** One benchmark would make a rating a single lucky test. Three asks for some breadth inside the discipline while staying small enough that a beginner can fill them in one session.
- **Weights that sum to 1.** If an athlete's three benchmarks all read `L`, the rating is exactly `L`. The scale of the curves and the scale of the ratings are the same scale. Verified by the even-athlete test (§7.3).
- **Descending weights.** The peak matters most, but 50% of the rating has to come from a second and third benchmark.
- **Zeros for empty slots.** A rating never falls when evidence is added (proved below), which would not hold if missing slots were filled in with an average.

**Proof that adding evidence never lowers a rating.** New evidence can only raise one exercise's best value; curves never decrease, so one score rises or stays. The rating is a weighted sum of order statistics with non-negative weights, and each order statistic is non-decreasing in every score. ∎ The test suite checks this on 360 random additions (`scoring.test.ts`).

**The cost of zeros.** One strong benchmark reads at half its value until two more exist. Ben's only handstand benchmark is a 30-second pike hold (110), so his handstand rating shows 55. This is the first thing a new athlete meets. Proposal P2 (§9) shows the plausible range instead of changing the number.

### 4.3 The verified rating

`verified` is the same formula run only on `coach` and `video` evidence. It is shown beside the rating and is what a future ranking should use. `observed` evidence does not count toward it: a coach watching is not a coach checking against the standard.

### 4.4 The label

Let `share_τ` be the fraction of the rating coming from slots of tier τ: `share_τ = Σ wᵢ·s₍ᵢ₎ [tier τ] / Σ wᵢ·s₍ᵢ₎`. In order:

1. `verified` if `share_coach + share_video ≥ 0.6`
2. `observed` if `share_observed + share_coach + share_video ≥ 0.6`
3. `estimated` if `share_estimated ≥ 0.5`
4. otherwise `self`

So one verified top slot (50% of the weight) is not enough to call a rating verified; two usually are.

**A behaviour to know.** The share is computed from the *best-value* evidence. If an athlete has 10 coach-verified pull-ups and later logs 12 on their own, the counted best becomes the self-reported 12. Measured: rating 426 → 439, verified share 34% → 0%, verified rating unchanged at 240. This is honest (the displayed number does now rest on a self-report) but it means logging a better result can remove a label. See P4 in §9.

---

## 5 · Aura and its companion numbers

### 5.1 Definition

With the six discipline ratings `R₁…R₆` (`computeAura` in `aura.ts`):

$$
\text{Aura}=\operatorname{round}\!\left(10\cdot\Big(\tfrac{1}{6}\sum_{d=1}^{6}R_d^{\,3}\Big)^{1/3}\right)
$$

This is 10 × the **power mean with exponent 3**. Shown beside it and never folded in:

| Number | Formula | Meaning |
| --- | --- | --- |
| Mastery | `round(mean R_d)` | Plain average |
| Peak | `max R_d` | Specialised excellence |
| Versatility | `round(100 · mean / max)` | 100 = perfectly even |
| Dedication | mean over the last 8 weeks of `min(1, sessions / weekly target)`, × 100 | Activity. Not an input to Aura or any rating |

Identity dressing derived from these: the **archetype** is "All-Rounder" when versatility ≥ 85 and at least five disciplines are rated, otherwise the peak discipline's archetype (Balancer, Climber, Presser, Anchor, Spring, Flow). The **class** (Spark … Singular) is a threshold on Aura every 1,500 points. Neither measures anything further.

Aura's own label uses the same thresholds as §4.4, with each discipline's shares weighted by `R_d / ΣR`.

### 5.2 Why a power mean with p = 3

Three properties are wanted at once, and a power mean gives all three:

1. **A mean, not a sum.** Aura does not depend on how many disciplines exist, and an even athlete at level `L` has Aura exactly `10·L`.
2. **Bounded by the athlete's own numbers.** For any `p ≥ 1`: `10·mean ≤ Aura ≤ 10·peak`.
3. **An exceptional discipline counts for more than its share**, without specialisation ever beating equal excellence everywhere.

The exponent sets the balance between specialist and all-rounder. The same six ratings under different exponents:

| Shape | p = 1 (average) | p = 2 | **p = 3** | p = 4 | p = 6 | max |
| --- | --- | --- | --- | --- | --- | --- |
| Even 500 | 5000 | 5000 | **5000** | 5000 | 5000 | 5000 |
| Specialist: 900 and five at 300 | 4000 | 4583 | **5241** | 5837 | 6684 | 9000 |
| Two strengths: 800, 800 and four at 300 | 4667 | 5228 | **5735** | 6138 | 6668 | 8000 |
| Specialist: 1000 and five at 200 | 3333 | 4472 | **5576** | 6402 | 7419 | 10000 |
| One discipline only, at 600 | 1000 | 2449 | **3302** | 3834 | 4451 | 6000 |
| Three disciplines at 600, three unrated | 3000 | 4243 | **4762** | 5045 | 5345 | 6000 |
| All-rounder 600 | 6000 | 6000 | **6000** | 6000 | 6000 | 6000 |

Reading the `p = 3` column:

- A specialist averaging 400 (900 and five at 300) reads 5,241: above an even 500, below an even 600. A plain average would call them 4,000 and hide the 900 entirely; the maximum would call them 9,000 and ignore everything else.
- **At equal peak, the more complete athlete always wins** (even 900 = 9,000 against 5,241).
- **At equal average, the more peaked athlete wins** (5,241 against 4,000). This is the deliberate bias: excellence is rarer than adequacy.

### 5.3 Consequences to be aware of

**Where the next point is worth most.** The marginal value of a rating point is

$$
\frac{\partial\,\text{Aura}}{\partial R_d}=\frac{10}{6}\Big(\frac{R_d}{P}\Big)^{2},\qquad P=\text{Aura}/10 .
$$

For the 900 / 300 specialist (`P = 524.1`), one more point in the strong discipline adds 4.9 Aura; one more point in a weak one adds 0.55. **Aura rewards deepening a strength about nine times more than shoring up a weakness** for that athlete. Since points are also harder to earn at 900 than at 300, the two effects partly offset, but the incentive is real. Versatility is displayed next to Aura precisely so that balance stays visible.

**An unrated discipline is a zero.** An athlete assessed in one discipline at 600 has Aura 3,302, not 6,000. Aura therefore mixes "how good" with "how much has been measured". This is the same trade-off as empty slots (§4.2), and the same remedy applies: label it (the `rated` count), do not hide it.

**Adding a seventh discipline would lower everyone's Aura** until they are rated in it, because the mean divides by the number of disciplines. A new discipline is a model version change, never a catalog addition.

---

## 6 · Skills, levels and what scoring does not touch

### 6.1 Skills

A skill is `(exercise, threshold, prerequisites)`. From evidence alone (`skillStatuses` in `skills.ts`):

- **Mastered** when any evidence on that exercise reaches the threshold. Its tier is the highest tier among the evidence that reaches it; its date is the earliest.
- **Implied** when a skill that depends on it is mastered. One muscle-up, with nothing else on record, masters 18 skills: the muscle-up and 17 implied prerequisites, including five in pushing.
- **Available** when every prerequisite is mastered; otherwise **locked**, with progress `best / threshold`.

A skill's **point value** is `round(f(threshold))` on that exercise's curve, and its band comes from that value. So a node in the tree, the evidence that unlocks it and the rating it supports are one fact seen three ways. 125 skills: 15 foundation, 38 beginner, 30 intermediate, 32 advanced, 8 elite, 2 world-class; the highest is worth 1,040.

**Skills do not feed ratings, and implication stops at the tree.** That one muscle-up implies "10 pull-ups" as a skill, but the pulling rating is still `0.5 × 640 = 320` from a single benchmark. This asymmetry is intended: the tree records what is certainly within reach; the rating counts only what was actually measured.

### 6.2 Working level (system A)

`workingLevel` suggests where to train on a ladder: the highest rung whose best value reaches the bottom of that exercise's recommended range, moved up one rung when the best value is at least twice the top of the range. With 9 pull-ups (range 3–8) the suggestion is level 5; with 20 it is level 6. It is a suggestion, changes no score, and the athlete overrides it with Easier / Harder.

### 6.3 Not inputs to any rating

Workout volume, sets, streaks, attendance, course completion, session RPE, goals, following, places and check-ins. The test suite asserts that repeated and weaker evidence, and any evidence on the 7 unrated exercises, leaves every rating unchanged.

---

## 7 · What happens when the library grows

The question: if pulling goes from 22 rated exercises to 220, do pulling ratings rise? There are three separate mechanisms, with three different answers.

### 7.1 Counting: no effect, by construction

A rating reads only the three highest scores. An exercise the athlete has no evidence on contributes nothing, and evidence below the third slot contributes nothing. **The size of the library is not a variable in any formula.** Logging ten more pulling exercises raises a rating only if one of them scores above the current third slot, in which case the athlete has shown something better.

Compared with the alternatives, for an athlete at a true level θ with `n` benchmarks each reading θ:

| Aggregate | Result | Grows with n? |
| --- | --- | --- |
| Sum | `n·θ` | Yes, without bound |
| Average | θ | No, but logging an easy exercise lowers it |
| Maximum | θ | No, but one result decides everything |
| **Top three, weighted (Aura)** | θ once three exist | No |

### 7.2 Selection: a slow, real inflation

Curves are not perfectly consistent with each other, and athletes are not equally good at everything. Model an athlete of level θ whose reading on benchmark `x` is `θ + ε_x`, with ε independent, standard deviation σ. The rating keeps the three best readings, so its expected value is `θ + b(n)·σ`, where `b(n)` depends only on how many benchmarks were attempted:

| Benchmarks attempted, n | 3 | 5 | 10 | 20 | 50 | 100 | 300 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Aura's 50/30/20**, b(n) | 0.26 | 0.73 | 1.20 | 1.58 | 2.01 | 2.29 | 2.68 |
| Maximum only | 0.85 | 1.16 | 1.54 | 1.87 | 2.25 | 2.51 | 2.88 |
| Plain average of all | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |

(40,000 simulated athletes per cell; `selectionBias` in `scoring/audit.ts`.) `b(n)` grows like `√(2·ln n)`: **multiplying the library by ten adds about one σ**, and the next tenfold adds less.

The same experiment on the real curves, with whole reps and caps, cloning every benchmark so the library is ×2, ×5, ×10 (`catalogGrowth`):

| σ between benchmarks | Discipline, true level | Today | ×2 | ×5 | ×10 |
| --- | --- | --- | --- | --- | --- |
| 0 | any, any | exact | exact | exact | exact |
| 40 | Pulling, 500 | 541 | 557 | 574 | 585 |
| 40 | Handstand, 500 | 513 | 532 | 552 | 564 |
| 40 | Legs, 500 | 512 | 530 | 548 | 561 |
| 80 | Pulling, 500 | 589 | 620 | 652 | 674 |
| 80 | Legs, 500 | 535 | 567 | 609 | 637 |

What this says:

- With perfectly consistent curves (σ = 0) growth changes nothing at all.
- With σ = 40 points, a tenfold library lifts a mid-level rating by roughly **45–60 points**, about a quarter of a band. With σ = 80, by 85–100.
- **Disciplines with more benchmarks already read higher today**: at σ = 40 the same true level reads 541 in pulling (22 rated) and 512 in legs (16 rated), because pulling offers more chances at each level.
- The assumption "attempts every benchmark in reach" is the worst case. An athlete who logs four benchmarks is at `b(4) = 0.55`, whatever the library holds.

σ is not known. Part of it is calibration error between curves, which is a defect to shrink. Part is real: people are differently built, and a rating that reports the three best is *meant* to reflect an athlete's strengths. The fairness problem is not that the number sits above some average; it is that it would sit higher in a discipline or an era with more benchmarks.

### 7.3 How even is the library today

Number of benchmarks whose calibrated range contains each level:

<!-- generated:coverage:start -->
| Level | Handstand | Pulling | Pushing | Core | Legs | Mobility |
| --- | --- | --- | --- | --- | --- | --- |
| 100 | 1 | 1 | 1 | 3 | 1 | 0 |
| 200 | 5 | 3 | 2 | 5 | 5 | 4 |
| 300 | 3 | 3 | 1 | 5 | 2 | 1 |
| 400 | 2 | 4 | 6 | 3 | 1 | 3 |
| 500 | 1 | 5 | 6 | 3 | 2 | 2 |
| 600 | 2 | 5 | 4 | 4 | 1 | 1 |
| 700 | 3 | 3 | 3 | 3 | 2 | 2 |
| 800 | 1 | 1 | 1 | 1 | 1 | 0 |
| 900 | 1 | 2 | 2 | 0 | 0 | 0 |
| 1000 | 1 | 1 | 1 | 1 | 0 | 0 |
<!-- generated:coverage:end -->

And the even-athlete test: an athlete who is exactly at level `L` on every benchmark available at that level should be rated `L`. Values in brackets include partial attempts below a first anchor.

<!-- generated:even:start -->
| True level | Handstand | Pulling | Pushing | Core | Legs | Mobility |
| --- | --- | --- | --- | --- | --- | --- |
| 200 | 200 | 199 (200) | 200 | 200 | 200 | 200 |
| 300 | 300 | 300 | 297 (298) | 300 | 300 | 298 |
| 400 | 400 | 400 | 400 | 400 | 399 | 400 |
| 500 | 500 | 500 | 500 | 499 | 499 | 500 |
| 600 | 590 (600) | 600 | 600 | 600 | 588 | 600 |
| 700 | 700 | 700 | 700 | 700 | 698 | 700 |
| 800 | 800 | 800 | 800 | 800 | 799 | 799 |
| 900 | 900 | 900 | 900 | 898 | 892 | 900 |
| 1000 | 990 | 996 | 998 | 989 | 948 | 982 |
<!-- generated:even:end -->

The scale is self-consistent through 900 in every discipline. The exceptions are informative: at 1000, legs reads 948 and mobility 982 because the benchmarks run out; pulling has five benchmarks at 500 where legs has two and handstand one.

### 7.4 Near-duplicates: the mechanism that matters most at scale

"Three different benchmarks" is meant to mean three different demonstrations. It currently means three different exercise ids. Pull-ups and chin-ups are different ids and nearly the same capability. The audit finds **14 near-duplicate pairs** in the present catalog (alternates on one ladder rung, or same category, metric and primary muscles with overlapping ranges): 6 in handstand, 4 in pushing, 2 in pulling, 1 each in core and legs.

In the sample athletes, 7 of 54 ratings have two slots filled from the same ladder rung. Alex's pulling 463 is pull-ups 465, chin-ups 460 and a tuck front lever 460: two of the three slots are one capability.

This is mild at 109 rated exercises. It is the main scaling risk at 1,000: every variation added to a family (wide, narrow, ring, weighted-vest, tempo) is another id that can fill a slot, the number of near-duplicate pairs grows with the square of a family's size, and "breadth within the discipline" quietly becomes "three grips of one movement". It also compounds §7.2, since correlated variants are extra draws at the same capability.

### 7.5 Ceilings are set by the hardest three exercises

A discipline's ceiling is `0.5 + 0.3 + 0.2` of its three highest caps (table in §1). Two consequences:

- Adding one exercise harder than anything present raises what the discipline can read. It does not move any existing athlete's rating, but it changes what "the top" means. Treat it as a calibration decision (§10, check E4).
- **The disciplines are not equally tall.** Calibrated tops: pushing 1,029, pulling 988, handstand 966, core 947, mobility 826, legs 780. Since Aura treats the six symmetrically, a world-class legs specialist cannot reach the Aura a world-class pushing specialist can. Whether calisthenics leg strength *should* top out lower is a judgement call; today it is an artefact of which exercises exist, with no benchmark calibrated above 840.

### 7.6 Comparing athletes with different evidence

Two ratings are comparable when both rest on three benchmarks of comparable reliability. The model already exposes each ingredient: `provisional` (fewer than three), the per-tier shares and label, and the verified rating. What it does not yet have is a single verified Aura (the formula of §5.1 applied to the six verified ratings). Any ranking or public comparison should use verified ratings and exclude provisional ones; that is a presentation rule and needs no model change.

---

## 8 · Consistency and fairness

Checked on the nine sample athletes (`npm run scoring:audit`) and by the invariants in `scoring.test.ts`.

| Question | Finding |
| --- | --- |
| **Same evidence, same score?** | Yes. Pure function, no hidden state, no dependence on order or dates beyond tie-breaks |
| **Meaningful differences between levels?** | Yes. Beginner Tomás 1,493 · Ben 2,240 · Priya 3,241 · Alex 3,996 · all-rounder Lina 5,411 · Jonas 5,761 · Maya 6,598 · Elena 7,278. The ordering matches what their benchmarks say |
| **Advanced performance recognised?** | Yes up to the caps. Elena's handstand 927 rests on a 22-second one-arm handstand (1,008), 6 presses (890) and a 150-second freestanding hold (778). Above ~1,000 only pushing, pulling, handstand and core have anywhere to go |
| **Specialist versus all-rounder** | Lina (average 541, versatility 97) reads 5,411. Ines (average 456, mobility 820) reads 5,203. Jonas (average 502, pulling 803) reads 5,761. A specialist needs a clearly exceptional discipline to pass a strong all-rounder, and does not pass one whose average is much higher. This is the intended balance; whether p = 3 is the right strength is a product judgement that real distributions should inform |
| **Protection against duplicates** | Complete against repeats of the same exercise. **None against near-duplicate exercises** (§7.4) |
| **Missing evidence** | Treated as zero, visibly (provisional flag, rated count). Never raises a number; reads low for newcomers and for anyone assessed in few disciplines (§4.2, §5.3) |
| **Beginners** | The first benchmark in a discipline reads at half. A beginner with one test per discipline sees ratings far below their curve scores. Honest, but discouraging without the explanation the Home screen gives |
| **Self-reported versus verified** | Kept distinct in three ways: a tier on every piece of evidence, a label on every rating, and a separate verified rating. **But the headline rating and Aura are identical whatever the tier.** An athlete who self-reports everything and one who is fully coach-verified show the same Aura with different labels. Acceptable for a personal profile; not acceptable as the basis of a ranking (§7.6) |
| **Estimated evidence** | Enters at the low end of each onboarding range and is labelled. It does count toward the headline number until replaced. It is never called verified, and one logged or assessed result on the same exercise supersedes it if higher |
| **Per-side exercises** | 21 curves are per side and are compared directly with two-sided ones. Reasonable, unverified |
| **Reps versus holds** | Both map to the same scale by anchors. A cross-check needs data: do athletes at "500 on pull-ups" hold "500 on front-lever progressions"? |

---

## 9 · Assessment: preserve, improve, watch, validate

### 9.1 Working well: preserve

1. **Evidence as the only input, scores always recomputed.** Makes every change reversible and every number explainable.
2. **Volume never moves a rating.** Proven by construction and tested.
3. **Top-three with weights summing to one.** Library size is not a variable; an even athlete reads exactly their level; evidence can only help.
4. **Caps on every curve.** Endurance on easy movements cannot imitate skill.
5. **Aura as a power mean.** Independent of the number of disciplines, bounded by the athlete's own average and peak, fair in both directions at p = 3.
6. **Provenance carried end to end**, with a separate verified rating.
7. **One versioned config** (`SCORING`), with the version stored beside every snapshot in the database schema.

### 9.2 Could be improved (proposals; none implemented)

Each is described with its measured consequence. Changing any of them changes numbers athletes have already seen, so each needs a model version bump and a decision, not a quiet edit.

| # | Proposal | Measured consequence | Recommendation |
| --- | --- | --- | --- |
| **P1** | **Families.** Give each rated exercise a `family` (the capability it demonstrates) and allow one slot per family | Using today's `category` as the family is far too blunt: Elena's handstand falls 927 → 504, because almost every handstand exercise is "Balance". Using "same ladder rung" moves 7 of 54 sample ratings, by up to 141 (Elena's legs 532 → 391), mostly because the displaced slot has nothing comparable behind it | Do **not** switch on. First add `family` as metadata only (no scoring effect), require ≥ 3 families with benchmarks at every level in each discipline, then re-measure. This is the single most valuable preparation for a large library |
| **P2** | **Show a range for provisional ratings**: from the current number to `current + missing weight × weakest filled slot` | Ben's handstand shows "55–110" instead of "55"; Tomás's mobility "103–125". No rating changes | Adopt when convenient. Display only |
| **P3** | **No pro-rata credit below a skill's first anchor** when that anchor is at 3 units or fewer | One second of full planche would read 0 instead of 490. Affects only values below a first anchor on 10 exercises | Adopt with the next version. Low risk, removes the most exploitable reading in the model |
| **P4** | **Keep verified credit when a self-reported result is higher**: compute the verified share from the best *verified* value per slot | In the example of §4.4 the label would stay at 34% verified instead of dropping to 0%. Ratings unchanged | Adopt with the next version |
| **P5** | **Verified Aura**: §5.1 applied to the verified ratings | A second number per athlete; nothing existing changes | Add before any ranking exists |
| **P6** | **Weight Aura's label by contribution**, not by `R_d / ΣR` (the label is linear in ratings while Aura is cubic) | Labels change only for strongly peaked athletes | Minor. Fold into the next version |
| **P7** | **Review the 30 two-anchor curves** and the one non-concave curve (`back-lever`) | Would change scores on those exercises only | Coach review, then version bump |

### 9.3 Likely to become a problem at scale

1. **Near-duplicate slot filling** (§7.4). Grows with the square of family size. Needs P1.
2. **Selection inflation** (§7.2). About one σ per tenfold growth, and uneven between disciplines. Controlled by keeping σ small (§10, E7) and by families, which cap the number of independent draws.
3. **Ceiling drift** (§7.5). Each new "hardest" exercise redefines the top. Needs the E4 gate.
4. **Uneven discipline heights** (§7.5). Becomes visible the moment rankings exist.
5. **No decay.** A profile can only rise. Fine for a personal record of achievement; wrong for "current ability". If Aura is ever used to match training partners or seed a class, add a separate *current* view (for example, evidence from the last 12 months) rather than changing Aura.
6. **Hand-set anchors do not scale to thousands of exercises.** Needs the equivalence method of E7 and, with data, automatic consistency checks.
7. **Client-side scoring.** Fine locally. With shared profiles, scores must be computed server-side (the schema already forbids clients writing them).

### 9.4 Needs real athlete data

| Question | What to measure | Decides |
| --- | --- | --- |
| Are the curves consistent with each other? | For athletes with two benchmarks in one discipline: the distribution of score differences. Its spread is σ | How much §7.2 matters; which curves to move |
| Is each curve the right shape? | Distribution of logged values per exercise against its anchors | Anchor placement, especially the 30 two-point curves |
| Are the six scales comparable? | Percentile of a rating of 500 in each discipline, across athletes | Whether "500 legs" means what "500 pulling" does; ceilings |
| Is p = 3 right? | Distribution of versatility; how often specialists outrank all-rounders that coaches would rank higher | The exponent |
| How reliable is self-report? | Self value against later verified value on the same exercise | Whether tiers should ever discount a score |
| Do ratings predict anything? | Rating at week 0 against skills reached by week 12 | Whether the scale measures readiness |

Until then, every number carries the word **provisional**, and the model version says so.

---

## 10 · Admitting a new exercise

A new exercise is a training tool the moment it exists. It influences ratings only if it is given a curve. Before it gets one, it passes these checks. E2–E6 are automated: `admissionFindings()` in `src/domain/scoring/audit.ts`, run over the whole catalog by `npm run scoring:audit`, and the test suite fails on any `fail`.

| Check | Question | Rule | Automated |
| --- | --- | --- | --- |
| **E1 · Identity** | What is it? | One discipline; a category; reps or hold; per side or not; a written `standard` saying what counts | – |
| **E2 · Shape** | Is the curve well formed? | Anchors strictly ascending in both columns (fail). At least three anchors (warn). Points per unit do not increase along the curve (warn). One unit does not read 200 or more below a first anchor (warn) | Yes |
| **E3 · Order** | Does it sit correctly on its ladder? | Its first anchor is not below the previous rung's first anchor, nor above the next rung's (fail) | Yes |
| **E4 · Ceiling** | Does it redefine the top? | It must not raise the discipline's calibrated top. If it should, that is a model version change with a stated reason | Yes |
| **E5 · Redundancy** | Does it tell us something new? | If it is a near-duplicate of an existing benchmark, either leave it unrated (a training variation) or declare it an alternate of that benchmark | Yes (flags) |
| **E6 · Reach** | Is it connected? | It is placed on a ladder, so E3 can check it. A skill node uses it if it is a milestone | Yes (flags) |
| **E7 · Equivalence** | Where do its anchors come from? | By equivalence to a reference benchmark in the same family: "someone who can do `v` of this can typically do `u` of the reference", so `r(v) = r_ref(u)`. Record the reference and the reasoning with the curve | – |
| **E8 · After launch** | Was the estimate right? | Once enough athletes have both, the median score difference from its reference should be within a tolerance (start at 30 points). Outside it, recalibrate under a new version | With data |

**Default: unrated.** Most new exercises are variations. They belong in the library and on a ladder without a curve. A curve is added only when the exercise is a benchmark people will be measured on. This one habit does more to keep ratings stable than any formula.

**What needs a new model version.** Changing any constant in `SCORING`; changing or removing an anchor on an existing curve; adding a rated exercise that fails E4; adding, removing or re-scoping a discipline; changing how best evidence, slots or labels work. Adding a rated exercise that passes E2–E6 does not: no existing rating moves until someone logs it.

What the current catalog looks like under these checks: no failures; 30 curves with two anchors; 10 with a high one-unit reading (§3.4); 1 non-concave curve; 14 near-duplicate pairs; 7 rated exercises on no ladder; 12 with no skill node.

---

## 11 · Keeping this document true

This document and the code are held together in three ways.

1. **Generated tables.** The constants, catalog, coverage, even-athlete and equivalence tables are written from the code by `npm run scoring:audit -- --write`.
2. **A failing test.** `src/domain/scoring/scoring.test.ts` reads this file and fails `npm test` when any generated table differs from what the code produces. It also asserts the invariants stated in §§3–6.
3. **A rule.** `CLAUDE.md` requires that any change to scoring logic, weights, curves, skill thresholds, tiers or the Aura calculation updates this document in the same change, adds a line to the change log below, and bumps `SCORING.version` when §10 says so.

When changing the model: edit the code → `npm run scoring:audit` and read the output → update the prose that the change affects → `npm run scoring:audit -- --write` → `npm test`.

Reference, generated: what each benchmark must be to read 200 / 400 / 600 / 800 / 1000. Blank = the level is below the benchmark's first anchor; `·` = above its cap; brackets = beyond the last calibrated anchor.

<!-- generated:equivalence:start -->
**Handstand & Balance**

| Benchmark | Calibrated | Cap | 200 | 400 | 600 | 800 | 1000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Box Pike Hold | 80–160 | 200 | (2 min) | · | · | · | · |
| Wall Walk | 120–210 | 263 | 5 | · | · | · | · |
| Back-to-Wall Handstand | 170–290 | 363 | 24s | · | · | · | · |
| Tripod Headstand | 180–280 | 350 | 21s | · | · | · | · |
| Chest-to-Wall Handstand | 200–380 | 475 | 15s | (2 min) | · | · | · |
| Crow Pose | 200–330 | 413 | 5s | (65s) | · | · | · |
| Elbow Lever | 300–400 | 500 |  | 30s | · | · | · |
| Wall Handstand Shoulder Taps | 330–440 | 550 |  | 14 | · | · | · |
| Freestanding Handstand | 420–760 | 950 |  |  | 30s | (189s) | · |
| Straddle Handstand | 510–640 | 800 |  |  | 20s | (110s) | · |
| Tuck Handstand | 620–730 | 913 |  |  |  | (72s) | · |
| Freestanding Shoulder Taps | 640–750 | 938 |  |  |  | (18) | · |
| Press to Handstand | 780–880 | 1100 |  |  |  | 2 | (17) |
| One-Arm Handstand | 900–1100 | 1375 |  |  |  |  | 20s |

**Pulling Strength**

| Benchmark | Calibrated | Cap | 200 | 400 | 600 | 800 | 1000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dead Hang | 80–240 | 300 | 60s | · | · | · | · |
| Incline Row | 120–210 | 263 | 14 | · | · | · | · |
| Scapular Pull-up | 150–230 | 288 | 10 | · | · | · | · |
| Horizontal Row | 230–370 | 463 |  | (30) | · | · | · |
| Negative Pull-up | 240–280 | 350 |  | · | · | · | · |
| Chin-up | 290–520 | 650 |  | 7 | (29) | · | · |
| Strict Pull-up | 300–650 | 813 |  | 5 | 20 | (63) | · |
| Feet-Elevated Row | 330–430 | 538 |  | 12 | · | · | · |
| Skin the Cat | 380–460 | 575 |  | 2 | · | · | · |
| Archer Row | 430–470 | 588 |  |  | · | · | · |
| Tuck Front Lever | 430–530 | 663 |  |  | (48s) | · | · |
| Tuck Back Lever | 440–530 | 663 |  |  | (72s) | · | · |
| Chest-to-Bar Pull-up | 450–600 | 750 |  |  | 10 | · | · |
| Explosive Pull-up | 520–610 | 763 |  |  | 5 | · | · |
| Archer Pull-up | 560–670 | 838 |  |  | 3/side | (16/side) | · |
| Advanced Tuck Front Lever | 560–650 | 813 |  |  | 9s | (95s) | · |
| Back Lever | 620–760 | 950 |  |  |  | (34s) | · |
| Bar Muscle-up | 640–830 | 1038 |  |  |  | 9 | (32) |
| Straddle Front Lever | 700–780 | 975 |  |  |  | (14s) | · |
| Assisted One-Arm Pull-up | 720–780 | 975 |  |  |  | (5/side) | · |
| Front Lever | 810–990 | 1238 |  |  |  |  | (23s) |
| One-Arm Pull-up | 900–1050 | 1313 |  |  |  |  | 4/side |

**Pushing Strength**

| Benchmark | Calibrated | Cap | 200 | 400 | 600 | 800 | 1000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Wall Push-up | 40–70 | 88 | · | · | · | · | · |
| High Incline Push-up | 90–130 | 163 | · | · | · | · | · |
| Low Incline Push-up | 140–180 | 225 | (30) | · | · | · | · |
| Knee Push-up | 150–190 | 238 | (25) | · | · | · | · |
| Bench Dip | 180–230 | 288 | 14 | · | · | · | · |
| Push-up | 200–490 | 613 | 1 | 26 | (124) | · | · |
| Negative Dip | 260–290 | 363 |  | · | · | · | · |
| Pike Push-up | 310–410 | 513 |  | 14 | · | · | · |
| Parallel Bar Dip | 320–600 | 750 |  | 6 | 30 | · | · |
| Diamond Push-up | 330–440 | 550 |  | 14 | · | · | · |
| Decline Push-up | 330–440 | 550 |  | 14 | · | · | · |
| Planche Lean | 330–420 | 525 |  | 35s | · | · | · |
| Elevated Pike Push-up | 430–510 | 638 |  |  | (30) | · | · |
| Archer Push-up | 440–530 | 663 |  |  | (24/side) | · | · |
| Pseudo Planche Push-up | 470–570 | 713 |  |  | (23) | · | · |
| Ring Dip | 480–620 | 775 |  |  | 9 | · | · |
| Wall HSPU Negative | 500–570 | 713 |  |  | (9) | · | · |
| Incline One-Arm Push-up | 540–580 | 725 |  |  | (9/side) | · | · |
| Tuck Planche | 560–660 | 825 |  |  | 9s | (76s) | · |
| Wall Handstand Push-up | 600–760 | 950 |  |  | 1 | (16) | · |
| One-Arm Push-up | 660–810 | 1013 |  |  |  | 10/side | (42/side) |
| Advanced Tuck Planche | 690–770 | 963 |  |  |  | (25s) | · |
| Freestanding HSPU | 820–980 | 1225 |  |  |  |  | (13) |
| Straddle Planche | 850–950 | 1188 |  |  |  |  | (20s) |
| Full Planche | 980–1090 | 1363 |  |  |  |  | 4s |

**Core Strength**

| Benchmark | Calibrated | Cap | 200 | 400 | 600 | 800 | 1000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dead Bug | 60–100 | 125 | · | · | · | · | · |
| Front Plank | 70–230 | 288 | 90s | · | · | · | · |
| Side Plank | 90–190 | 238 | (70s) | · | · | · | · |
| Arch Hold | 120–220 | 275 | 50s | · | · | · | · |
| Hollow Body Hold | 170–370 | 463 | 22s | (135s) | · | · | · |
| Hollow Rock | 200–320 | 400 | 10 | (62) | · | · | · |
| Hanging Knee Raise | 200–300 | 375 | 5 | · | · | · | · |
| Tuck L-sit | 260–340 | 425 |  | (70s) | · | · | · |
| Kneeling Ab Wheel Rollout | 300–410 | 513 |  | 14 | · | · | · |
| Hanging Leg Raise | 320–430 | 538 |  | 9 | · | · | · |
| L-sit | 400–660 | 825 |  | 5s | 40s | (154s) | · |
| Strict Toes-to-Bar | 420–610 | 763 |  |  | 14 | · | · |
| Dragon Flag Negative | 460–560 | 700 |  |  | (9) | · | · |
| Hanging Windshield Wipers | 560–680 | 850 |  |  | 5 | (30) | · |
| Dragon Flag | 600–760 | 950 |  |  | 1 | (13) | · |
| Standing Ab Wheel Rollout | 640–740 | 925 |  |  |  | (11) | · |
| V-sit | 700–850 | 1063 |  |  |  | 12s | (70s) |
| Manna | 960–1080 | 1350 |  |  |  |  | 4s |

**Leg Strength**

| Benchmark | Calibrated | Cap | 200 | 400 | 600 | 800 | 1000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Box Squat | 50–90 | 113 | · | · | · | · | · |
| Glute Bridge | 80–120 | 150 | · | · | · | · | · |
| Bodyweight Squat | 120–260 | 325 | 28 | · | · | · | · |
| Wall Sit | 130–270 | 338 | 60s | · | · | · | · |
| Split Squat | 170–220 | 275 | 13/side | · | · | · | · |
| Single-Leg Calf Raise | 180–280 | 350 | 13/side | · | · | · | · |
| Single-Leg Glute Bridge | 200–240 | 300 | 10/side | · | · | · | · |
| Bulgarian Split Squat | 260–360 | 450 |  | (25/side) | · | · | · |
| Cossack Squat | 290–350 | 438 |  | (19/side) | · | · | · |
| Assisted Pistol Squat | 340–390 | 488 |  | (8/side) | · | · | · |
| Box Pistol Squat | 380–430 | 538 |  | 5/side | · | · | · |
| Nordic Curl Negative | 420–470 | 588 |  |  | · | · | · |
| Shrimp Squat | 470–580 | 725 |  |  | (7/side) | · | · |
| Pistol Squat | 500–690 | 863 |  |  | 5/side | (24/side) | · |
| Advanced Shrimp Squat | 640–740 | 925 |  |  |  | (11/side) | · |
| Nordic Curl | 660–840 | 1050 |  |  |  | 6 | (24) |

**Mobility**

| Benchmark | Calibrated | Cap | 200 | 400 | 600 | 800 | 1000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deep Lunge Stretch | 110–160 | 200 | (108s) | · | · | · | · |
| Deep Squat Hold | 120–300 | 375 | 90s | · | · | · | · |
| Reverse Plank | 140–240 | 300 | 42s | · | · | · | · |
| Overhead Wall Reach | 170–230 | 288 | 20s | · | · | · | · |
| Standing Toe Touch | 180–230 | 288 | 18s | · | · | · | · |
| German Hang | 360–430 | 538 |  | 22s | · | · | · |
| Palms-to-Floor Fold | 380–430 | 538 |  | 18s | · | · | · |
| Full Bridge | 400–520 | 650 |  | 10s | (156s) | · | · |
| Pancake to Elbows | 450–500 | 625 |  |  | (110s) | · | · |
| Seated Pike Fold | 560–620 | 775 |  |  | 24s | · | · |
| Straight-Leg Bridge | 640–700 | 875 |  |  |  | (97s) | · |
| Full Pancake | 700–760 | 950 |  |  |  | (57s) | · |
| Front Split | 720–780 | 975 |  |  |  | (44s) | · |
| Middle Split | 820–880 | 1100 |  |  |  |  | (110s) |
<!-- generated:equivalence:end -->

---

## 12 · Change log

**2026-11-14** · Document created against `provisional-0.1`. No scoring behaviour changed. Added `src/domain/scoring/audit.ts` (read-only analysis and the admission checks), `scripts/scoring-audit.ts`, and `src/domain/scoring/scoring.test.ts` (invariants and the document check). Proposals P1–P7 recorded, none implemented.

**2026-11-14** · `provisional-0.1` gained the `observed` evidence tier and rating label (with the assessment feature). Rating values unchanged.

**2026-11-10** · `provisional-0.1` first version.
