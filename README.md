# Training Engine

Advanced, intelligently structured gym and functional-fitness workouts. Pick a training
style, duration, intensity, equipment and focus — the rules engine builds the session
(or a multi-week plan) around your logged performance data.

## Status

Built without a local Node.js install available in the dev environment, so none of this
has been run yet. Install Node 20+ and run:

```bash
npm install
npm run dev      # start the app at http://localhost:5173
npm run test     # run the Vitest suite (engine, repository, accessibility)
npm run build    # type-check + production build
```

## Stack

Vite + React 18 + TypeScript, Tailwind CSS, Radix UI primitives, Zustand, Dexie
(IndexedDB) behind a repository interface, React Router, Recharts, vite-plugin-pwa,
Vitest + Testing Library + jest-axe.

## Structure

- `src/domain` — TypeScript domain model (exercises, sessions, athlete, logs, plans)
- `src/data` — seed exercise library, athlete benchmarks, glossary terms
- `src/engine` — deterministic, pure-function workout/plan generator
- `src/repository` — Dexie-backed repositories behind swappable interfaces
- `src/store` — Zustand stores wired to the repositories
- `src/components` — shared UI (design-system primitives in `components/ui`)
- `src/screens` — one file per app screen, routed in `src/App.tsx`

See the plan this was built from for the full phase-by-phase build order and rules-engine
design notes.
