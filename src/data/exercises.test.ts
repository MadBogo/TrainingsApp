import { describe, it, expect } from "vitest";
import { EXERCISES, getExerciseById } from "./exercises";
import { EQUIPMENT, FOCUS_AREAS, MOVEMENT_PATTERNS } from "@/domain";

describe("exercise library data integrity", () => {
  it("has unique ids", () => {
    const ids = EXERCISES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every exercise at least two equipment-aware substitutions", () => {
    const offenders = EXERCISES.filter((e) => e.substitutions.length < 2);
    expect(offenders.map((e) => e.id)).toEqual([]);
  });

  it("resolves every substitution, scaling and progression reference to a real exercise", () => {
    const brokenRefs: string[] = [];
    for (const exercise of EXERCISES) {
      for (const sub of exercise.substitutions) {
        if (!getExerciseById(sub.exerciseId)) brokenRefs.push(`${exercise.id} -> sub ${sub.exerciseId}`);
      }
      if (exercise.scalingExerciseId && !getExerciseById(exercise.scalingExerciseId)) {
        brokenRefs.push(`${exercise.id} -> scaling ${exercise.scalingExerciseId}`);
      }
      if (exercise.progressionExerciseId && !getExerciseById(exercise.progressionExerciseId)) {
        brokenRefs.push(`${exercise.id} -> progression ${exercise.progressionExerciseId}`);
      }
    }
    expect(brokenRefs).toEqual([]);
  });

  it("never substitutes an exercise with itself", () => {
    const selfSubs = EXERCISES.filter((e) => e.substitutions.some((s) => s.exerciseId === e.id));
    expect(selfSubs.map((e) => e.id)).toEqual([]);
  });

  it("gives every exercise at least one coaching cue and a video placeholder", () => {
    const offenders = EXERCISES.filter((e) => e.cues.length === 0 || !e.videoPlaceholder);
    expect(offenders.map((e) => e.id)).toEqual([]);
  });

  it("covers every equipment type at least once", () => {
    const covered = new Set(EXERCISES.flatMap((e) => e.equipment));
    const missing = EQUIPMENT.filter((eq) => !covered.has(eq));
    expect(missing).toEqual([]);
  });

  it("covers every movement pattern at least once", () => {
    const covered = new Set(EXERCISES.flatMap((e) => e.patterns));
    const missing = MOVEMENT_PATTERNS.filter((p) => !covered.has(p));
    expect(missing).toEqual([]);
  });

  it("covers every focus area at least once", () => {
    const covered = new Set(EXERCISES.flatMap((e) => [...e.primaryMuscles, ...(e.secondaryMuscles ?? [])]));
    const missing = FOCUS_AREAS.filter((f) => !covered.has(f));
    expect(missing).toEqual([]);
  });
});
