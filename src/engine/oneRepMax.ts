import { roundToIncrement } from "@/lib/utils";

/**
 * Epley-formula estimate with an RPE-based reps-in-reserve adjustment and a conservative
 * shave, since Epley increasingly overestimates as rep count grows. Never presented as a
 * fixed maximum — only ever a starting point that gets refined by further logged sets.
 */
export function estimateOneRepMax(weightKg: number, reps: number, rpe?: number): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  const rir = rpe !== undefined ? Math.max(0, 10 - rpe) : 0;
  const effectiveReps = reps + rir;
  const raw = weightKg * (1 + effectiveReps / 30);
  return roundToIncrement(raw * 0.97, 0.5);
}
