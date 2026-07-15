import { describe, it, expect, beforeEach } from "vitest";
import { db } from "./db";
import { exerciseRepository } from "./exerciseRepository";
import { athleteRepository, ATHLETE_PROFILE_ID } from "./athleteRepository";
import type { Exercise, AthleteProfile } from "@/domain";

const sampleExercise: Exercise = {
  id: "barbell-bench-press",
  name: "Barbell Bench Press",
  description: "The benchmark horizontal press for building chest, shoulder and triceps strength.",
  patterns: ["horizontal_push"],
  primaryMuscles: ["chest"],
  secondaryMuscles: ["arms", "shoulders"],
  equipment: ["barbell", "adjustable_bench"],
  locations: ["full_gym", "home_gym"],
  difficulty: "intermediate",
  isCompound: true,
  isTechnical: false,
  loadable: true,
  cues: ["Set up with shoulder blades retracted", "Bar path over the wrists"],
  videoPlaceholder: "placeholder://barbell-bench-press",
  substitutions: [{ exerciseId: "dumbbell-bench-press", reason: "No barbell available", samePattern: true }]
};

beforeEach(async () => {
  await db.exercises.clear();
  await db.athleteProfile.clear();
  await db.oneRepMaxes.clear();
});

describe("exerciseRepository", () => {
  it("round-trips exercises through IndexedDB", async () => {
    await exerciseRepository.bulkUpsert([sampleExercise]);
    const all = await exerciseRepository.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe("Barbell Bench Press");

    const found = await exerciseRepository.getById("barbell-bench-press");
    expect(found?.equipment).toContain("barbell");

    const count = await exerciseRepository.count();
    expect(count).toBe(1);
  });

  it("resolves multiple exercises by id, skipping missing ones", async () => {
    await exerciseRepository.bulkUpsert([sampleExercise]);
    const results = await exerciseRepository.getByIds(["barbell-bench-press", "does-not-exist"]);
    expect(results).toHaveLength(1);
  });
});

describe("athleteRepository", () => {
  it("saves and retrieves the athlete profile under a stable id", async () => {
    const profile: AthleteProfile = {
      id: "whatever-id-is-passed-in",
      sex: "male",
      bodyWeightKg: 93,
      heightCm: 176,
      equipmentInventory: [],
      defaultLocation: "full_gym",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await athleteRepository.saveProfile(profile);
    const stored = await athleteRepository.getProfile();
    expect(stored?.id).toBe(ATHLETE_PROFILE_ID);
    expect(stored?.bodyWeightKg).toBe(93);
  });

  it("stores estimated one-rep-maxes and looks them up by exercise", async () => {
    await athleteRepository.upsertOneRepMax({
      id: "orm-1",
      exerciseId: "barbell-deadlift",
      valueKg: 152.5,
      method: "top_set",
      source: "140kg x 3",
      confidence: "medium",
      lastUpdated: new Date().toISOString()
    });
    const found = await athleteRepository.getOneRepMax("barbell-deadlift");
    expect(found?.valueKg).toBe(152.5);
  });
});
