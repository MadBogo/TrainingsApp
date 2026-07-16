# Training Engine — Improvement Roadmap

Current state: V1 complete (all 10 build phases), 88 tests passing, deployed via Vercel,
installable as a PWA on iOS. Known weaknesses: workout variety is thin, plan mode is
static, Workout Mode timers are basic, data lives in a single browser with no backup.

Each phase below is independently shippable. Check items off as they land.

## Phase A — Make daily use better

- [x] **A3: Data export/import** — "Download backup" / "Restore" in Profile dumping all
      IndexedDB stores to a JSON file. Insurance against cleared browser data until sync
      exists.
- [x] **A1: Format-aware timers** — segmented timer store: EMOM auto-advances each minute
      with a round counter, intervals alternate work/rest, 3-2-1 beep + vibration cues at
      transitions and completion.
- [x] **A2: Tap-to-swap substitutions** — swap button per exercise on the generated-workout
      screen; one tap replaces the exercise, recalculates the load range and persists.
- [x] **A4: Rest-timer autostart** — completing a strength set automatically starts the
      prescribed rest countdown (was already built in V1; verified working).

## Phase B — Deepen the engine

- [ ] **B1: Expand exercise library to ~150** — biggest lever for variety. Thin spots:
      unilateral work, machine variations, kettlebell flows, conditioning mixes. The
      data-integrity tests (≥2 substitutions, full pattern/equipment coverage) keep
      growth safe.
- [ ] **B2: Session variety memory** — feed recently *generated* (not just logged)
      sessions into the engine so back-to-back Train Now days differ more.
- [ ] **B3: Adaptive plans** — wire `completedLoggedSessionId` so planned sessions get
      marked complete when logged; regenerate future weeks based on actual completion and
      session-RPE trends (skipped week → shift; RPEs running high → reduce intensity).
- [ ] **B4: Per-lift progression rules** — explicit, visible recommendations ("top of rep
      range at RPE 7 twice → +2.5 kg next session") rather than only a recalculated 1RM.

## Phase C — Platform maturity

- [ ] **C1: Supabase sync** — second implementation of the repository interfaces against
      Supabase Postgres; IndexedDB stays as the offline cache; simple email login.
      Largest single item.
- [ ] **C2: Code-split the bundle** — dynamic-import the Progression screen (Recharts is
      most of the 970 kB chunk) to roughly halve initial load.
- [ ] **C3: Real exercise media** — replace video placeholders (cheapest: per-exercise
      YouTube search link; better: embedded short-form demos).
- [ ] **C4: German localization** — copy already centralized in `labels.ts`/`glossary.ts`;
      mechanical once wanted.

## Phase D — LLM recommendation layer

- [ ] **D1: LLM-backed selection ranker** — swap point exists in
      `src/engine/exerciseSelection.ts`; ordering/loading/plan math stay deterministic
      and tested.
- [ ] **D2: "Coach notes"** — send config + recent history to Claude via a small Vercel
      serverless proxy; get back selection preferences and a session-intention paragraph.
      Pairs naturally with C1.
