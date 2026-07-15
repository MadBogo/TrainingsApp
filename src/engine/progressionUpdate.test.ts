import { describe, it, expect } from "vitest";
import { deriveOneRmUpdates } from "./progressionUpdate";
import { getExerciseById } from "@/data/exercises";
import type { EstimatedOneRM, Exercise, LoggedSet } from "@/domain";

const exercisesById: Record<string, Exercise> = {
  "barbell-back-squat": getExerciseById("barbell-back-squat")!,
  "push-up": getExerciseById("push-up")!
};

function set(overrides: Partial<LoggedSet>): LoggedSet {
  return { id: "s1", exerciseId: "barbell-back-squat", exerciseName: "Barbell Back Squat", setIndex: 0, ...overrides };
}

describe("deriveOneRmUpdates", () => {
  it("creates a new estimate for a loadable exercise with weight and reps logged", () => {
    const updates = deriveOneRmUpdates([set({ weightKg: 120, reps: 5 })], exercisesById, {});
    expect(updates).toHaveLength(1);
    expect(updates[0].exerciseId).toBe("barbell-back-squat");
    expect(updates[0].method).toBe("calculated");
  });

  it("skips exercises with no logged weight or reps", () => {
    const updates = deriveOneRmUpdates([set({ weightKg: undefined, reps: 5 })], exercisesById, {});
    expect(updates).toHaveLength(0);
  });

  it("skips non-loadable bodyweight exercises", () => {
    const updates = deriveOneRmUpdates(
      [set({ exerciseId: "push-up", exerciseName: "Push-up", weightKg: 0, reps: 20 })],
      exercisesById,
      {}
    );
    expect(updates).toHaveLength(0);
  });

  it("picks the best (highest-estimate) set when multiple sets exist for the same exercise", () => {
    const updates = deriveOneRmUpdates(
      [set({ id: "s1", weightKg: 100, reps: 5 }), set({ id: "s2", weightKg: 120, reps: 3 })],
      exercisesById,
      {}
    );
    expect(updates).toHaveLength(1);
    expect(updates[0].source).toContain("120");
  });

  it("never lowers a manually-confirmed actual 1RM based on a lighter logged set", () => {
    const existing: Record<string, EstimatedOneRM> = {
      "barbell-back-squat": {
        id: "orm-1",
        exerciseId: "barbell-back-squat",
        valueKg: 180,
        method: "actual_1rm",
        source: "test",
        confidence: "high",
        lastUpdated: new Date().toISOString()
      }
    };
    const updates = deriveOneRmUpdates([set({ weightKg: 100, reps: 5 })], exercisesById, existing);
    expect(updates).toHaveLength(0);
  });

  it("does update an actual 1RM when the new estimate is higher (a new PR)", () => {
    const existing: Record<string, EstimatedOneRM> = {
      "barbell-back-squat": {
        id: "orm-1",
        exerciseId: "barbell-back-squat",
        valueKg: 100,
        method: "actual_1rm",
        source: "test",
        confidence: "high",
        lastUpdated: new Date().toISOString()
      }
    };
    const updates = deriveOneRmUpdates([set({ weightKg: 140, reps: 3 })], exercisesById, existing);
    expect(updates).toHaveLength(1);
    expect(updates[0].valueKg).toBeGreaterThan(100);
  });
});
