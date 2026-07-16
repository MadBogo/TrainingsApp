import { describe, it, expect } from "vitest";
import { generateWorkout, swapExerciseInSession } from "./generateWorkout";
import { EXERCISES } from "@/data/exercises";
import type { EstimatedOneRM, SessionConfig } from "@/domain";

const ORMS: EstimatedOneRM[] = [
  {
    id: "orm-back-squat",
    exerciseId: "barbell-back-squat",
    valueKg: 130,
    method: "top_set",
    source: "test",
    confidence: "medium",
    lastUpdated: new Date().toISOString()
  }
];

const CONFIG: SessionConfig = {
  mode: "train_now",
  durationMin: 45,
  style: "strength",
  intensity: "moderate",
  location: "full_gym",
  equipment: ["barbell", "squat_rack", "dumbbells", "adjustable_bench", "machines", "bodyweight_only"],
  focusAreas: ["full_body"],
  movementFocus: ["squat"]
};

describe("swapExerciseInSession", () => {
  it("swaps a strength exercise for a substitute, preserving the prescription and recalculating identity fields", () => {
    const session = generateWorkout({ config: CONFIG, exercises: EXERCISES, oneRepMaxes: ORMS });
    const block = session.blocks.find((b) => b.role === "strength")!;
    const original = block.exercises[0];
    expect(original.substitutions.length).toBeGreaterThanOrEqual(2);
    const target = original.substitutions[0];

    const swapped = swapExerciseInSession(session, block.id, original.id, target.exerciseId, EXERCISES, ORMS);
    const swappedBlock = swapped.blocks.find((b) => b.id === block.id)!;
    const replaced = swappedBlock.exercises[0];

    expect(replaced.exerciseId).toBe(target.exerciseId);
    expect(replaced.exerciseName).toBe(target.exerciseName);
    // Prescription structure is preserved on sets_reps swaps.
    expect(replaced.sets).toBe(original.sets);
    expect(replaced.reps).toBe(original.reps);
    expect(replaced.restSec).toBe(original.restSec);
    // Identity-dependent fields are rebuilt.
    expect(replaced.coachingCues).not.toEqual(original.coachingCues);
    expect(replaced.substitutions.map((s) => s.exerciseId)).not.toContain(replaced.exerciseId);
  });

  it("leaves the session unchanged when the target exercise id doesn't exist", () => {
    const session = generateWorkout({ config: CONFIG, exercises: EXERCISES, oneRepMaxes: ORMS });
    const block = session.blocks.find((b) => b.role === "strength")!;
    const result = swapExerciseInSession(session, block.id, block.exercises[0].id, "does-not-exist", EXERCISES, ORMS);
    expect(result).toBe(session);
  });

  it("does not modify other blocks or other exercises", () => {
    const session = generateWorkout({ config: CONFIG, exercises: EXERCISES, oneRepMaxes: ORMS });
    const strengthBlock = session.blocks.find((b) => b.role === "strength")!;
    const original = strengthBlock.exercises[0];
    const target = original.substitutions[0];

    const swapped = swapExerciseInSession(session, strengthBlock.id, original.id, target.exerciseId, EXERCISES, ORMS);
    const otherBlocksBefore = session.blocks.filter((b) => b.id !== strengthBlock.id);
    const otherBlocksAfter = swapped.blocks.filter((b) => b.id !== strengthBlock.id);
    expect(otherBlocksAfter).toEqual(otherBlocksBefore);
  });
});
