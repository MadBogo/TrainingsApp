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
    const count = await exerciseRepository.count();
    if (count === 0) {
      await exerciseRepository.bulkUpsert(EXERCISES);
    }
    const exercises = await exerciseRepository.getAll();
    const byId = Object.fromEntries(exercises.map((e) => [e.id, e]));
    set({ exercises, byId, loading: false });
  }
}));
