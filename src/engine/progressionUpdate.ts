import { v4 as uuid } from "uuid";
import type { EstimatedOneRM, Exercise, LoggedSet } from "@/domain";
import { estimateOneRepMax } from "./oneRepMax";

/**
 * Turns a completed session's logged sets into updated EstimatedOneRM records. Only
 * touches loadable exercises with both a weight and a rep count logged, and never lets a
 * single submaximal set overwrite a manually-confirmed actual 1RM with a lower number —
 * benchmarks only move down when the athlete explicitly edits them.
 */
export function deriveOneRmUpdates(
  loggedSets: LoggedSet[],
  exercisesById: Record<string, Exercise>,
  existingByExerciseId: Record<string, EstimatedOneRM>
): EstimatedOneRM[] {
  const bestEstimateByExercise = new Map<string, { estimate: number; set: LoggedSet }>();

  for (const set of loggedSets) {
    const exercise = exercisesById[set.exerciseId];
    if (!exercise || !exercise.loadable) continue;
    if (!set.weightKg || !set.reps) continue;

    const estimate = estimateOneRepMax(set.weightKg, set.reps, set.rpe);
    const current = bestEstimateByExercise.get(set.exerciseId);
    if (!current || estimate > current.estimate) {
      bestEstimateByExercise.set(set.exerciseId, { estimate, set });
    }
  }

  const updates: EstimatedOneRM[] = [];
  const now = new Date().toISOString();

  for (const [exerciseId, { estimate, set }] of bestEstimateByExercise) {
    const existing = existingByExerciseId[exerciseId];
    if (existing?.method === "actual_1rm" && estimate <= existing.valueKg) continue;

    updates.push({
      id: existing?.id ?? uuid(),
      exerciseId,
      valueKg: estimate,
      method: "calculated",
      source: `Logged set: ${set.weightKg}kg × ${set.reps}${set.rpe ? ` @ RPE ${set.rpe}` : ""}`,
      confidence: set.rpe ? "medium" : "low",
      lastUpdated: now
    });
  }

  return updates;
}
