# Training Engine — Lastenheft / Requirements Specification

*Reconstructed from the actual implementation. This document is self-contained: handed to a
developer or an AI coding agent with no other context, it should be sufficient to rebuild this
application from scratch.*

---

## 1. Purpose and Positioning

Build a premium, responsive web app / PWA called **Training Engine**: an advanced,
intelligently structured gym and functional-fitness workout generator. The user selects a
training style, session duration, intensity, available equipment, and optional focus areas.
The app generates either one ad-hoc workout or a structured multi-week training plan.

This is **not** a beginner fitness app. Default athlete profile:

- Advanced resistance-trained male
- Body weight: 93 kg, height: 176 cm
- Benchmark performance: bench press 100 kg × 8–10 reps, front squat 100 kg × 3–4 reps,
  deadlift 140 kg × 3 reps
- Benchmark data must be editable and expandable over time; these figures are **initial
  estimates only**, never fixed maximums

**Core principle:** the user does not pick a generic goal ("fat loss," "muscle gain"). They
pick training style and session characteristics. A deterministic rules engine determines
exercise selection, order, loading, volume, density, rest, progression and recovery logic —
no LLM involved in generation. The architecture must leave room to bolt an LLM-based
recommendation layer on top later without touching the core generator.

Visual style: dark mode by default (near-black `#0b0b0d` background, lime `#d7ff3f` accent),
premium athletic feel, excellent mobile experience, large workout-timer controls, no clutter.
English copy, metric units (kg) throughout, no login required.

---

## 2. App Modes

A prominent top-level toggle between two modes, both driven by the same session-configuration
controls (§3):

**A. Train Now** — generates one standalone, ad-hoc workout. No fixed weekly schedule assumed.
Uses historic workout logs (when present) to softly deprioritize repeating recent high-fatigue
movement patterns — this is advisory, never a hard block; the user can still get any exercise.

**B. Training Plan** — generates an adaptive rolling plan for 1, 2, 4, 6, or 8 weeks. Only
asks for "training days per week" in this mode. Produces a calendar/list overview plus
individual session cards. Balances movement patterns, muscle groups, intensity, strength
exposure, conditioning and recovery across the week. Inserts a deload (reduced-intensity) week
for plans ≥4 weeks. Permits regeneration/mobility/zone-2 days as legitimate plan sessions, not
just "hard" days.

---

## 3. Session Configuration Controls

Offered in both modes:

**Duration:** 15 / 20 / 30 / 45 / 60 minutes. Structure scales by duration (see §4.1).

**Training style** (12 options): Regenerative/recovery, Mobility, Stretching, Zone 2
conditioning, HIIT, Functional fitness / CrossFit-style (no official CrossFit affiliation
claimed), Strength, Hypertrophy, Power/explosive work, Olympic-lifting skill,
Running/endurance conditioning, Mixed/balanced.

**Intensity** (5 levels: Recovery, Light, Moderate, Hard, Very hard) — each maps to concrete
technical targets shown alongside a plain-English description:

| Intensity  | RPE  | RIR  | % 1RM | Rest      | Conditioning pace |
|------------|------|------|-------|-----------|--------------------|
| Recovery   | 2–4  | 6–8  | 40–50 | 30–60s    | Very easy |
| Light      | 4–5  | 5–6  | 50–65 | 60–90s    | Steady, comfortable |
| Moderate   | 6–7  | 3–4  | 65–75 | 90–120s   | Brisk, purposeful |
| Hard       | 8    | 1–2  | 75–85 | 120–180s  | Fast, uncomfortable |
| Very hard  | 9–10 | 0–1  | 85–95 | 180–240s  | All-out |

**Training location** (5): Full commercial gym, Home gym, Minimal equipment, Hotel gym,
Outdoor.

**Available equipment** (multi-select, 21 options): Barbell and plates, Squat rack, Adjustable
bench, Dumbbells, Kettlebells, Cable machine, Resistance bands, Pull-up bar, Gymnastic rings,
Dip station, RowErg, SkiErg, Assault/air bike, Treadmill, Standard bike, Sled, Medicine ball,
Plyometric box, Battle ropes, Machines, Bodyweight only.

> **Rule:** "Bodyweight only" must never gate out a bodyweight exercise just because the user
> didn't explicitly select it — bodyweight movements need no equipment and must always be
> eligible, otherwise warm-ups/cooldowns (which are bodyweight by nature) end up empty whenever
> the user selects any other equipment. (This was a real bug found in production and fixed —
> see §11.)

**Focus areas** (multi-select + "Balanced full body," 14 options): Chest, Back/lats, Upper
back/scapular stability, Shoulders, Arms, Forearms/grip, Core, Quads, Hamstrings, Glutes,
Calves/tibialis, Hip stability/adductors/abductors, Posterior chain, Full body. Selecting
"Balanced full body" clears any other selection (mutually exclusive).

**Movement-pattern focus** (multi-select, optional, 10 options): Squat, Hinge, Horizontal
push, Horizontal pull, Vertical push, Vertical pull, Carry, Locomotion, Rotation/anti-rotation,
Olympic-lift pattern.

No exercise-preference selector exists by design — the engine picks the most appropriate
movements for the configuration and available equipment, including unpopular-but-valuable
ones.

---

## 4. Training Engine (deterministic, rules-based)

### 4.1 Duration → block structure

Each training style belongs to one of four **structure families**, and each family has an
explicit block-role/time-budget table per duration (all sum exactly to the chosen duration):

- **single_block** (Regenerative, Mobility, Stretching, Zone 2, Running/endurance): warm-up +
  one long main block + cooldown. The main block is "conditioning" (steady effort) for
  Zone 2/Running, or general mobility content otherwise.
- **strength** (Strength, Hypertrophy, Power): warm-up → strength → secondary → accessory →
  cooldown, with blocks added progressively as duration increases (15 min = warm-up + strength
  only; 60 min = all five).
- **metcon** (Functional fitness, HIIT, Mixed/balanced): warm-up → [skill, 60 min only] →
  strength → conditioning → accessory.
- **skill** (Olympic lifting): warm-up → skill (the bulk of the session) → accessory →
  cooldown. Never a "strength" or "conditioning" block — Olympic work stays low-fatigue,
  technical-repetition focused, with an optional complex, never a maximal-fatigue prescription.

Concrete example (45 min, strength family): warm-up 6 min, strength 20 min, secondary 12 min,
accessory 7 min.

### 4.2 Exercise ordering

Fixed priority within a session, regardless of style: **warm-up → skill/explosive movement (if
present) → heavy compound strength → secondary compound → conditioning → accessories/carries/
prehab → cooldown**. Demanding technical/skill movements are never placed after
fatigue-inducing work — this is enforced structurally by the block-role ordering itself, not
as a post-hoc filter.

### 4.3 Exercise selection & scoring

For each block, candidate exercises are filtered by:
- Equipment satisfied (every piece of equipment the exercise needs must be in the athlete's
  selection — except "bodyweight_only," which is always satisfied, per §3)
- Training location included in the exercise's valid locations
- Not already used elsewhere in the same generated session

Candidates are then scored and the highest-scoring one wins (ties broken by exercise id,
alphabetically, for determinism):

- +10 if the exercise's movement pattern matches the block's desired patterns
- +8 if the user's movement-pattern focus intersects the exercise's patterns
- +6 / +3 if the exercise's primary/secondary muscles intersect the user's focus areas
  (skipped entirely when "Balanced full body" is selected)
- +2 for strength/secondary-block candidates specifically, if the exercise is externally
  loadable — this is an advanced-athlete app, so a bodyweight air squat must not outrank a
  barbell back squat just because it alphabetically tie-broke first when a rack is available
  (a real bug found and fixed — see §11)
- −5 per active fatigue tag overlapping recent training history (see §4.4)
- −3 if the exercise appears in the athlete's recent logged history (freshness rotation)

Warm-up and cooldown draw from dedicated curated pools of bodyweight mobility/activation
drills, not the general scoring pool.

### 4.4 Movement balance & fatigue protection

Track completed logged sessions and flag (non-blocking, advisory only, surfaced as
human-readable notes on the generated workout) when ≥2 of the last 3 completed sessions show:

- Repeated heavy spinal loading
- Repeated high-volume knee-dominant work
- Repeated pressing/shoulder-intensive work
- Repeated high-skill gymnastics under fatigue
- Repeated high-impact work

Also flag two consecutive "very hard" sessions with a recovery suggestion. For Train Now, these
flags softly deprioritize matching exercises in scoring (§4.3) but never block them outright —
the user can always override by their own selections.

### 4.5 Load calculation

For each loadable exercise in a strength/secondary block:

1. If the athlete has a direct logged estimated-1RM for that exact exercise, use it.
2. Otherwise, check a curated table of **related-lift ratios** (e.g., back squat ≈ front squat
   × 1.15; Romanian deadlift ≈ deadlift × 0.85; dumbbell bench ≈ barbell bench × 0.4 per hand).
   If the base lift has a known 1RM, derive one with `method: "calculated"`,
   `confidence: "low"`, and a human-readable source note ("Estimated from your barbell front
   squat 1RM…").
3. If neither applies, show no numeric load — display "No load history yet — start light and
   log this set" instead of fabricating a number.

When a load range exists: `minKg`/`maxKg` from the intensity's %1RM range, rounded to the
nearest 2.5 kg plate increment, alongside the target RPE/RIR for that intensity. Never force a
maximal attempt; a 1RM test may only ever appear as an optional, explicitly-flagged event
inside a plan, never auto-prescribed.

### 4.6 Substitutions

Every exercise in the seed library carries **at least two** equipment-aware substitutions, each
with a short reason, plus an (optional) easier scaling option and harder progression option,
each resolved to a real exercise in the library. This is enforced by an automated data-integrity
test, not just convention.

### 4.7 Multi-week plan builder

For Training Plan mode: distribute styles across the requested days/week with movement-pattern
balance across the week (e.g., don't stack two heavy-spinal-loading days back to back).
For plans ≥4 weeks, mark the final week as a deload: every session's intensity is capped down
one level (e.g., Moderate → Light) and prescribed sets are proportionally reduced. The plan
overview must visually flag which week is the deload week.

---

## 5. Workout Output

Every generated workout needs a distraction-free **Workout Mode** with large, always-accessible
timer controls, reachable from a compact overview screen.

**Overview screen** shows: title, duration, style, intensity, one-sentence training intention,
primary movement patterns, effort guidance (plain English + technical), required equipment,
any fatigue/recovery notes, then each block with its exercises — each exercise line shows
sets×reps (or the prescribed format) **and its suggested kg load range** (or a "Bodyweight" tag
when unloadable) inline, not hidden behind a tap.

**Per exercise**, the full detail view (in Workout Mode) includes: name, sets/reps/load/RPE or
RIR, rest period or interval format, coaching cues, a video placeholder, substitutions, a
scale-down and progress-up option, a start-timer control, and a log-result control.

**Conditioning blocks** show the exact format (EMOM / AMRAP / for-time / interval / chipper),
time cap or duration, prescribed work, the score type (time, rounds+reps, reps, calories,
distance, load, or completion), and pacing guidance appropriate to the intensity.

**Session completion** captures: completed/not-completed toggle, actual weights and reps per
set (pre-filled from the prescribed load range as a sensible default, editable), conditioning
score, session RPE, free-text notes, and a pain/discomfort flag. Saving a session must
automatically feed back into the athlete's estimated 1RMs (see §6) — even unedited prefilled
sets count as valid data, since they represent "what was prescribed and presumably performed."

---

## 6. Progression & Estimated 1RM

- Store per-exercise estimated 1RM with method (`actual_1rm` / `top_set` / `calculated` /
  `seed_estimate`), a human-readable source, a confidence level (`low`/`medium`/`high`), and a
  last-updated timestamp.
- Accept input as: a direct 1RM, a recent top set (weight/reps/optional RPE), or derive it from
  completed logged sets automatically after every session save.
- Use an RPE/RIR-adjusted Epley-style formula: lower RPE at the same weight×reps implies *more*
  untapped capacity and therefore a *higher* estimated 1RM (this directionality is
  counter-intuitive to get right — get it backwards and every estimate is wrong. Verify with a
  test asserting `estimate(100kg, 5reps, RPE6) > estimate(100kg, 5reps, RPE9)`).
- Present suggestions as a range with plain-English framing ("90–95 kg, target RPE 7–8"), never
  a single hard number.
- Support quick in-session load-feedback adjustment: "too easy" / "on target" / "too hard."
- Never auto-prescribe a maximal attempt.

---

## 7. Education & Glossary

Every technical term gets a visible info icon (not hidden instructions — tooltips are
supplementary only, never load-bearing). Required minimum term set: RPE, RIR, 1RM, EMOM,
AMRAP, Zone 2, Tempo, Deload, Volume, plus For Time, Chipper, % 1RM, and Density.

Accessibility contract for the info icon:
- **Desktop:** opens on hover *and* on keyboard focus, dismissible with Escape,
  `aria-describedby` wired automatically between trigger and content.
- **Mobile (touch/coarse-pointer):** tapping opens a bottom sheet instead (not a hover
  tooltip), with room for a longer example, still dismissible.
- A dedicated, searchable **Glossary** screen lists every term with its short definition and an
  example.

> **Testing note:** Radix Tooltip's hover/focus-open behavior depends on real
> `PointerEvent.pointerType` and browser focus-visible detection that jsdom's synthetic events
> do not reproduce. Automated tests should verify what jsdom *can* assert (focus lands on the
> trigger, accessibility tree is correct, the mobile tap→dialog path — which is a plain click,
> not hover/focus) and the maintainer should manually verify hover/focus-open once in a real
> browser rather than fight jsdom indefinitely.

---

## 8. Screens

1. **Dashboard** — Train Now / Training Plan entry cards, recent activity, 1RM progression
   snapshot.
2. **Session builder** — all controls from §3, mode toggle, plan-only fields shown
   conditionally.
3. **Generated workout** — overview per §5, with Edit (returns to builder with this config
   pre-loaded) and Regenerate (same config, new pick) controls.
4. **Workout Mode** — full-screen (outside the normal app chrome/nav), live execution, large
   timer, per-exercise logging entry points, block-by-block navigation.
5. **Workout log** — the post-session capture form from §5.
6. **Training plan** — calendar/list of weeks and days, deload week flagged, tap-through to
   each day's generated session.
7. **Exercise library** — search, filter by pattern/muscle/equipment, detail sheet per exercise
   (cues, muscles, equipment, substitutions, scale/progress options, video placeholder).
8. **Progression** — 1RM trend line per exercise (exercise picker), weekly training-volume bar
   chart, conditioning-benchmark history list.
9. **Glossary** — searchable term list per §7.
10. **Profile/settings** — athlete stats (name, sex, body weight, height, default location),
    strength benchmarks (editable existing entries, add a new one by exercise/method), all
    persisted immediately.

---

## 9. Technical Architecture

**Stack:** Vite + React 18 + TypeScript (SPA, not Next.js — this is local-first with no
server, so a pure client bundle avoids SSR complications with IndexedDB); Tailwind CSS for the
dark athletic design system; Radix UI primitives (Tooltip, Dialog, Select, Tabs, Switch,
Label, Slider, Slot) for accessible low-level components; Zustand for app state; Dexie
(IndexedDB) behind a repository interface so a Supabase/Postgres backend can be swapped in
later without touching engine or UI code; React Router for navigation; Recharts for
progression charts; `vite-plugin-pwa` for the manifest/service worker; Vitest + Testing
Library + jest-axe for tests; `date-fns` for plan-calendar math; `sharp` (dev-only) to
rasterize the app icon SVG into real PNGs for iOS/Android home-screen installs at build time
(`scripts/generate-icons.mjs`) — iOS ignores SVG favicons for "Add to Home Screen," so an
apple-touch-icon PNG plus `apple-mobile-web-app-*` meta tags are required in `index.html`.

**Repository layout:**
```
src/
  domain/        # TypeScript types: Exercise, WorkoutBlock, BlockExercise, EstimatedOneRM,
                  # AthleteProfile, SessionConfig, GeneratedSession, LoggedSession, LoggedSet,
                  # TrainingPlan, PlannedSession — plus every enum (Equipment, TrainingStyle,
                  # Intensity, FocusArea, MovementPattern, BlockRole, BlockFormat, ScoreType…)
  data/           # exercises.ts (seed library), seedAthlete.ts, glossary.ts, labels.ts
                  # (human-readable enum→string maps used across the UI)
  engine/         # pure functions, no React/DOM: blockTemplates, exerciseSelection,
                  # intensity, loadCalculation, oneRepMax, fatigue, generateWorkout,
                  # generatePlan, progressionStats, progressionUpdate, draftSets
  repository/     # Dexie schema (db.ts) + one file per entity, each exporting a typed
                  # interface + a Dexie-backed implementation
  store/          # Zustand stores wired to the repositories (athlete, exercise, builder,
                  # live-workout, timer)
  components/     # ui/ (design-system primitives), builder/, workout/, plus shared
                  # components (InfoTooltip, GlossaryInfo, ExerciseDetailSheet)
  screens/        # one file per screen from §8, routed in App.tsx
  hooks/          # useMediaQuery / useIsCoarsePointer (drives the tooltip desktop/mobile split)
  test/           # vitest setup, ambient type declarations (see §11 for the jest-axe gotcha)
```

**Domain-model note:** the seed exercise library must cover every value of every enum at least
once — every equipment type, every movement pattern, every focus area — verified by an
automated data-integrity test (`exercises.test.ts`), not just eyeballing it. Aim for roughly
75–80 exercises across warm-up/activation, Olympic lifts, barbell/dumbbell/kettlebell
compounds, bodyweight/gymnastics, cable/machine, bands, monostructural conditioning, carries/
core/prehab, and cooldown/mobility.

**Seed data:** the default athlete profile and its three benchmark 1RMs (bench, front squat,
deadlift) from §1, tagged `method: "top_set"`, `confidence: "medium"`.

---

## 10. Build Order

1. App shell, design system, domain model, Dexie repositories
2. Exercise library seed data + substitutions (with the coverage test from §9)
3. Session-builder controls (§3)
4. Rules-based generator engine (§4)
5. Generated-workout screen + Workout Mode timers (§5)
6. Workout logging + performance-data capture
7. Estimated-1RM and progression calculations (§6)
8. Training Plan mode + multi-week planner (§4.7)
9. Progression dashboard (§8.8)
10. Glossary + full accessibility pass (§7)

At the end of each phase: run the app, exercise the core flow, report what's implemented and
what's assumed, before starting the next phase.

---

## 11. Lessons From the First Real Run

Everything above was written into code across all ten phases before Node.js was ever available
to actually run it. The first real `npm install` + test run + production build surfaced issues
no amount of static review caught — worth stating explicitly since it justifies budgeting real
verification time, not just implementation time:

- **Bodyweight equipment gating** (§3): warm-up/cooldown blocks rendered completely empty
  whenever "Bodyweight only" wasn't explicitly ticked, because the equipment filter treated it
  as a hard requirement instead of "needs nothing." Only visible by actually generating a
  workout and inspecting the result — a pure code review would not catch this.
- **Alphabetical tie-break bug** (§4.3): a bodyweight air squat could outrank a barbell back
  squat in scoring even with a full rack selected, because both scored identically on pattern
  match and ties broke by exercise id. Fixed by preferring loadable exercises in strength/
  secondary slots specifically.
- **`tsc -b` project references**: `tsconfig.node.json` needs `composite: true` — and that in
  turn conflicts with `allowImportingTsExtensions` unless `emitDeclarationOnly: true` is also
  set. Only surfaces on `npm run build`, not `npm run dev` or `npm test`.
- **Ambient module declarations and `declare module`**: a package with no shipped types (like
  `jest-axe`) needs a *global script file* (no top-level `import`/`export`) to declare a brand
  new ambient module; the same syntax inside a file that's already an ES module is treated as
  *augmentation only* and silently fails to register a module that has no existing types
  anywhere else. Augmenting an *existing* typed module (like adding a custom matcher to
  vitest's `Assertion` interface) needs the opposite — a proper module file. These two therefore
  need to live in separate `.d.ts` files.
- **TS aliased-condition narrowing**: a `const` boolean derived from `a !== "" && b !== ""`
  causes TypeScript to narrow `b`'s type at any later `if (!thatConst) return` check — so a
  redundant follow-up check like `|| b === ""` right after becomes a genuine type error once TS
  proves it's now unreachable. The fix is to delete the redundant check, not fight the narrowing.
- **Radix Tooltip in jsdom** (§7): don't burn time trying to make hover/focus-triggered
  tooltip-open assertions pass under jsdom + Testing Library — verify that behavior once by hand
  in a real browser instead, and keep the automated test coverage scoped to what jsdom can
  actually simulate faithfully.

None of these are exotic — they're the ordinary friction of a first real build. The takeaway
for anyone replicating this project: treat "the code compiles in my head" and "the code
compiles" as two different milestones, and budget time for the second one.
