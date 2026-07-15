import { create } from "zustand";
import type { SessionConfig } from "@/domain";
import type { PlanLengthWeeks } from "@/domain";

const DEFAULT_CONFIG: SessionConfig = {
  mode: "train_now",
  durationMin: 45,
  style: "functional_fitness",
  intensity: "moderate",
  location: "full_gym",
  equipment: ["barbell", "squat_rack", "dumbbells", "pull_up_bar"],
  focusAreas: ["full_body"],
  movementFocus: []
};

interface BuilderState {
  config: SessionConfig;
  planWeeks: PlanLengthWeeks;
  planDaysPerWeek: number;
  setMode: (mode: SessionConfig["mode"]) => void;
  update: <K extends keyof SessionConfig>(key: K, value: SessionConfig[K]) => void;
  toggleEquipment: (item: SessionConfig["equipment"][number]) => void;
  toggleFocusArea: (item: SessionConfig["focusAreas"][number]) => void;
  toggleMovementFocus: (item: SessionConfig["movementFocus"][number]) => void;
  setPlanWeeks: (weeks: PlanLengthWeeks) => void;
  setPlanDaysPerWeek: (days: number) => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  config: { ...DEFAULT_CONFIG },
  planWeeks: 4,
  planDaysPerWeek: 4,

  setMode: (mode) => set((s) => ({ config: { ...s.config, mode } })),

  update: (key, value) => set((s) => ({ config: { ...s.config, [key]: value } })),

  toggleEquipment: (item) =>
    set((s) => {
      const has = s.config.equipment.includes(item);
      return {
        config: {
          ...s.config,
          equipment: has ? s.config.equipment.filter((e) => e !== item) : [...s.config.equipment, item]
        }
      };
    }),

  toggleFocusArea: (item) =>
    set((s) => {
      if (item === "full_body") {
        return { config: { ...s.config, focusAreas: ["full_body"] } };
      }
      const withoutFullBody = s.config.focusAreas.filter((f) => f !== "full_body");
      const has = withoutFullBody.includes(item);
      const next = has ? withoutFullBody.filter((f) => f !== item) : [...withoutFullBody, item];
      return { config: { ...s.config, focusAreas: next.length === 0 ? ["full_body"] : next } };
    }),

  toggleMovementFocus: (item) =>
    set((s) => {
      const has = s.config.movementFocus.includes(item);
      return {
        config: {
          ...s.config,
          movementFocus: has ? s.config.movementFocus.filter((m) => m !== item) : [...s.config.movementFocus, item]
        }
      };
    }),

  setPlanWeeks: (weeks) => set({ planWeeks: weeks }),
  setPlanDaysPerWeek: (days) => set({ planDaysPerWeek: days }),

  reset: () => set({ config: { ...DEFAULT_CONFIG, mode: get().config.mode } })
}));
