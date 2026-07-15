import { describe, it, expect } from "vitest";
import { computeLoadRange, resolveEffectiveOneRm } from "./loadCalculation";
import { INTENSITY_PROFILES } from "./intensity";
import { getExerciseById } from "@/data/exercises";
import type { EstimatedOneRM } from "@/domain";

function ormFor(exerciseId: string, valueKg: number): EstimatedOneRM {
  return {
    id: `orm-${exerciseId}`,
    exerciseId,
    valueKg,
    method: "top_set",
    source: "test fixture",
    confidence: "medium",
    lastUpdated: new Date().toISOString()
  };
}

describe("computeLoadRange", () => {
  it("returns a rounded, plate-loadable range at moderate intensity from a direct 1RM", () => {
    const bench = getExerciseById("barbell-bench-press")!;
    const ormMap = { "barbell-bench-press": ormFor("barbell-bench-press", 112.5) };
    const range = computeLoadRange(bench, INTENSITY_PROFILES.moderate, ormMap);

    expect(range).toBeDefined();
    expect(range!.minKg % 2.5).toBe(0);
    expect(range!.maxKg % 2.5).toBe(0);
    // moderate = 65-75% of 112.5kg = 73.1-84.4kg, rounded to nearest 2.5kg
    expect(range!.minKg).toBe(72.5);
    expect(range!.maxKg).toBe(85);
    expect(range!.targetRpe).toEqual(INTENSITY_PROFILES.moderate.rpeRange);
  });

  it("derives a load from a related lift when no direct 1RM is logged", () => {
    const backSquat = getExerciseById("barbell-back-squat")!;
    const ormMap = { "barbell-front-squat": ormFor("barbell-front-squat", 110) };
    const range = computeLoadRange(backSquat, INTENSITY_PROFILES.moderate, ormMap);

    expect(range).toBeDefined();
    expect(range!.note).toMatch(/estimated/i);
    // 1.15 x 110kg = 126.5kg, moderate range 65-75%
    expect(range!.minKg).toBeGreaterThan(75);
    expect(range!.maxKg).toBeLessThan(100);
  });

  it("returns undefined when there is no direct or related 1RM to work from", () => {
    const deadlift = getExerciseById("barbell-deadlift")!;
    const range = computeLoadRange(deadlift, INTENSITY_PROFILES.moderate, {});
    expect(range).toBeUndefined();
  });

  it("returns undefined for non-loadable bodyweight exercises regardless of 1RM data", () => {
    const pushUp = getExerciseById("push-up")!;
    const range = computeLoadRange(pushUp, INTENSITY_PROFILES.hard, {});
    expect(range).toBeUndefined();
  });

  it("scales up with intensity for the same exercise", () => {
    const bench = getExerciseById("barbell-bench-press")!;
    const ormMap = { "barbell-bench-press": ormFor("barbell-bench-press", 112.5) };
    const light = computeLoadRange(bench, INTENSITY_PROFILES.light, ormMap)!;
    const veryHard = computeLoadRange(bench, INTENSITY_PROFILES.very_hard, ormMap)!;
    expect(veryHard.minKg).toBeGreaterThan(light.minKg);
    expect(veryHard.maxKg).toBeGreaterThan(light.maxKg);
  });
});

describe("resolveEffectiveOneRm", () => {
  it("prefers a direct 1RM over a related-lift derivation", () => {
    const backSquat = getExerciseById("barbell-back-squat")!;
    const ormMap = {
      "barbell-back-squat": ormFor("barbell-back-squat", 140),
      "barbell-front-squat": ormFor("barbell-front-squat", 110)
    };
    const effective = resolveEffectiveOneRm(backSquat, ormMap);
    expect(effective?.valueKg).toBe(140);
    expect(effective?.confidence).toBe("medium");
  });
});
