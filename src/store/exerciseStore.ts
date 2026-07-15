import { create } from "zustand";
import type { Exercise } from "@/domain";
import { exerciseRepository } from "@/repository";
import { EXERCISES } from "@/data/exercises";

interface ExerciseState {
  exercises: Exercise[];
  byId: Record<string, Exercise>;
  loading: boolean;
  init: () => Promise<void>;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  byId: {},
  loading: true,

  init: async () => {
    if (get().exercises.length > 0) return;
    // Exercises are entirely seed data (no user-authored exercises exist), so it's always
    // safe — and necessary — to re-sync every app load rather than only when the store is
    // empty. Otherwise an already-seeded browser never picks up library content changes
    // shipped in a later version of the app (e.g. a new field like `description`).
    await exerciseRepository.bulkUpsert(EXERCISES);
    const exercises = await exerciseRepository.getAll();
    const byId = Object.fromEntries(exercises.map((e) => [e.id, e]));
    set({ exercises, byId, loading: false });
  }
}));
