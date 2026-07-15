import type { AthleteProfile, EstimatedOneRM } from "@/domain";
import { ATHLETE_PROFILE_ID } from "@/repository/athleteRepository";

const now = new Date().toISOString();

export const seedAthleteProfile: AthleteProfile = {
  id: ATHLETE_PROFILE_ID,
  name: "Athlete",
  sex: "male",
  bodyWeightKg: 93,
  heightCm: 176,
  equipmentInventory: [],
  defaultLocation: "full_gym",
  createdAt: now,
  updatedAt: now
};

/**
 * Initial estimates only — never treated as fixed maximums. Editable from Profile.
 * exerciseId values must match seeded exercise library ids (see src/data/exercises.ts).
 */
export const seedOneRepMaxes: EstimatedOneRM[] = [
  {
    id: "orm-bench-press",
    exerciseId: "barbell-bench-press",
    valueKg: 112.5,
    method: "top_set",
    source: "Logged top set: 100 kg x 8-10 reps",
    confidence: "medium",
    lastUpdated: now
  },
  {
    id: "orm-front-squat",
    exerciseId: "barbell-front-squat",
    valueKg: 110,
    method: "top_set",
    source: "Logged top set: 100 kg x 3-4 reps",
    confidence: "medium",
    lastUpdated: now
  },
  {
    id: "orm-deadlift",
    exerciseId: "barbell-deadlift",
    valueKg: 152.5,
    method: "top_set",
    source: "Logged top set: 140 kg x 3 reps",
    confidence: "medium",
    lastUpdated: now
  }
];
