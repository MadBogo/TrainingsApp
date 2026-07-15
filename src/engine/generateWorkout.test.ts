import { describe, it, expect } from "vitest";
import { generateWorkout, type GenerateWorkoutContext } from "./generateWorkout";
import { EXERCISES } from "@/data/exercises";
import type { EstimatedOneRM, SessionConfig } from "@/domain";

const FULL_EQUIPMENT: SessionConfig["equipment"] = [
  "barbell",
  "squat_rack",
  "adjustable_bench",
  "dumbbells",
  "kettlebells",
  "cable_machine",
  "resistance_bands",
  "pull_up_bar",
  "gymnastic_rings",
  "dip_station",
  "row_erg",
  "ski_erg",
  "assault_bike",
  "treadmill",
  "standard_bike",
  "sled",
  "medicine_ball",
  "plyo_box",
  "battle_ropes",
  "machines",
  "bodyweight_only"
];

const BENCHMARK_ORMS: EstimatedOneRM[] = [
  {
    id: "orm-bench",
    exerciseId: "barbell-bench-press",
    valueKg: 112.5,
    method: "top_set",
    source: "test",
    confidence: "medium",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "orm-front-squat",
    exerciseId: "barbell-front-squat",
    valueKg: 110,
    method: "top_set",
    source: "test",
    confidence: "medium",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "orm-deadlift",
    exerciseId: "barbell-deadlift",
    valueKg: 152.5,
    method: "top_set",
    source: "test",
    confidence: "medium",
    lastUpdated: new Date().toISOString()
  }
];

function baseConfig(overrides: Partial<SessionConfig>): SessionConfig {
  return {
    mode: "train_now",
    durationMin: 45,
    style: "functional_fitness",
    intensity: "moderate",
    location: "full_gym",
    equipment: FULL_EQUIPMENT,
    focusAreas: ["full_body"],
    movementFocus: [],
    ...overrides
  };
}

function ctx(overrides: Partial<SessionConfig> = {}): GenerateWorkoutContext {
  return {
    config: baseConfig(overrides),
    exercises: EXERCISES,
    oneRepMaxes: BENCHMARK_ORMS
  };
}

describe("generateWorkout", () => {
  it("starts every session with a warmup block", () => {
    const session = generateWorkout(ctx());
    expect(session.blocks[0].role).toBe("warmup");
  });

  it("never places a strength or skill block after a conditioning block", () => {
    const session = generateWorkout(ctx({ style: "functional_fitness", durationMin: 60 }));
    const roles = session.blocks.map((b) => b.role);
    const conditioningIndex = roles.indexOf("conditioning");
    if (conditioningIndex !== -1) {
      const strengthIndex = roles.indexOf("strength");
      const skillIndex = roles.indexOf("skill");
      if (strengthIndex !== -1) expect(strengthIndex).toBeLessThan(conditioningIndex);
      if (skillIndex !== -1) expect(skillIndex).toBeLessThan(conditioningIndex);
    }
  });

  it("only selects exercises whose equipment is fully within the configured equipment", () => {
    const limitedEquipment: SessionConfig["equipment"] = ["dumbbells", "bodyweight_only", "pull_up_bar"];
    const session = generateWorkout(ctx({ equipment: limitedEquipment, style: "hypertrophy", durationMin: 45 }));
    const exercisesById = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
    for (const block of session.blocks) {
      for (const be of block.exercises) {
        const exercise = exercisesById[be.exerciseId];
        expect(exercise).toBeDefined();
        for (const eq of exercise!.equipment) {
          expect(limitedEquipment).toContain(eq);
        }
      }
    }
  });

  it("only selects exercises available at the configured location", () => {
    const session = generateWorkout(ctx({ location: "hotel_gym", equipment: ["dumbbells", "treadmill", "bodyweight_only"], style: "hiit" }));
    const exercisesById = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
    for (const block of session.blocks) {
      for (const be of block.exercises) {
        const exercise = exercisesById[be.exerciseId];
        expect(exercise!.locations).toContain("hotel_gym");
      }
    }
  });

  it("produces the same exercise selection for identical input (deterministic)", () => {
    const a = generateWorkout(ctx());
    const b = generateWorkout(ctx());
    const idsA = a.blocks.map((bl) => bl.exercises.map((e) => e.exerciseId));
    const idsB = b.blocks.map((bl) => bl.exercises.map((e) => e.exerciseId));
    expect(idsA).toEqual(idsB);
  });

  it("computes a suggested load range for the strength lift when a 1RM is known", () => {
    const session = generateWorkout(ctx({ style: "strength", durationMin: 45, equipment: FULL_EQUIPMENT }));
    const strengthBlock = session.blocks.find((b) => b.role === "strength");
    expect(strengthBlock).toBeDefined();
    const be = strengthBlock!.exercises[0];
    if (["barbell-back-squat", "barbell-front-squat"].includes(be.exerciseId)) {
      expect(be.loadRange).toBeDefined();
    }
  });

  it("never prescribes a load range for a non-loadable bodyweight exercise", () => {
    const session = generateWorkout(ctx({ style: "mobility", durationMin: 30 }));
    for (const block of session.blocks) {
      for (const be of block.exercises) {
        if (be.bodyweightNote === "Bodyweight") {
          expect(be.loadRange).toBeUndefined();
        }
      }
    }
  });

  it("gives every selected exercise at least two substitutions carried through to the block", () => {
    const session = generateWorkout(ctx());
    for (const block of session.blocks) {
      for (const be of block.exercises) {
        expect(be.substitutions.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("respects a 15-minute session by producing only a warmup and one main block", () => {
    const session = generateWorkout(ctx({ durationMin: 15, style: "strength" }));
    expect(session.blocks.length).toBeLessThanOrEqual(2);
  });

  it("keeps olympic-lifting sessions to skill-only strength content (no conditioning)", () => {
    const session = generateWorkout(ctx({ style: "olympic_lifting", durationMin: 45, equipment: ["barbell"] }));
    expect(session.blocks.some((b) => b.role === "conditioning")).toBe(false);
  });

  it("never leaves the warmup block empty, even when bodyweight_only isn't in the selected equipment", () => {
    // Regression: bodyweight warmup/cooldown drills must stay available regardless of the
    // equipment multi-select, since they need no equipment to perform.
    const session = generateWorkout(ctx({ equipment: ["barbell", "squat_rack", "dumbbells"], style: "strength" }));
    const warmup = session.blocks.find((b) => b.role === "warmup");
    expect(warmup).toBeDefined();
    expect(warmup!.exercises.length).toBeGreaterThan(0);
  });

  it("never leaves the cooldown block empty when bodyweight_only isn't selected", () => {
    const session = generateWorkout(
      ctx({ equipment: ["barbell", "squat_rack", "dumbbells"], style: "strength", durationMin: 60 })
    );
    const cooldown = session.blocks.find((b) => b.role === "cooldown");
    expect(cooldown).toBeDefined();
    expect(cooldown!.exercises.length).toBeGreaterThan(0);
  });

  it("prefers a loaded barbell squat over a bodyweight air squat for the strength block when a rack is available", () => {
    // Regression: both matched the "squat" pattern with an equal base score, so an
    // alphabetical tie-break was picking "air-squat" ahead of "barbell-back-squat" even
    // with a full rack available — wrong for an advanced-athlete strength session.
    const session = generateWorkout(
      ctx({ style: "strength", durationMin: 45, equipment: ["barbell", "squat_rack"], movementFocus: ["squat"] })
    );
    const strengthBlock = session.blocks.find((b) => b.role === "strength");
    expect(strengthBlock?.exercises[0]?.exerciseId).toBe("barbell-back-squat");
  });
});
