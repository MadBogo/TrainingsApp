import type { EstimatedOneRM, Exercise, LoadRange } from "@/domain";
import type { IntensityProfile } from "./intensity";
import { roundToIncrement } from "@/lib/utils";

/**
 * A small set of well-established strength ratios used only when an exercise has no
 * logged 1RM of its own but a close relative does. Single-hop only (never chains through
 * another derived estimate) and always tagged low-confidence so the UI is honest about it.
 */
const RELATED_LIFT_RATIOS: Record<string, { basedOn: string; ratio: number }> = {
  "barbell-back-squat": { basedOn: "barbell-front-squat", ratio: 1.15 },
  "barbell-romanian-deadlift": { basedOn: "barbell-deadlift", ratio: 0.85 },
  "barbell-hip-thrust": { basedOn: "barbell-deadlift", ratio: 1.3 },
  "barbell-overhead-press": { basedOn: "barbell-bench-press", ratio: 0.65 },
  "barbell-push-press": { basedOn: "barbell-bench-press", ratio: 0.75 },
  "dumbbell-bench-press": { basedOn: "barbell-bench-press", ratio: 0.4 },
  "dumbbell-shoulder-press": { basedOn: "barbell-bench-press", ratio: 0.28 },
  "dumbbell-romanian-deadlift": { basedOn: "barbell-deadlift", ratio: 0.35 },
  "dumbbell-goblet-squat": { basedOn: "barbell-front-squat", ratio: 0.45 },
  "barbell-bent-over-row": { basedOn: "barbell-bench-press", ratio: 0.9 }
};

export interface EffectiveOneRm {
  valueKg: number;
  sourceId: EstimatedOneRM["id"] | null;
  confidence: EstimatedOneRM["confidence"];
  derivedNote?: string;
}

export function resolveEffectiveOneRm(
  exercise: Exercise,
  oneRepMaxByExerciseId: Record<string, EstimatedOneRM>
): EffectiveOneRm | undefined {
  const direct = oneRepMaxByExerciseId[exercise.id];
  if (direct) {
    return { valueKg: direct.valueKg, sourceId: direct.id, confidence: direct.confidence };
  }
  const related = RELATED_LIFT_RATIOS[exercise.id];
  if (related) {
    const base = oneRepMaxByExerciseId[related.basedOn];
    if (base) {
      return {
        valueKg: base.valueKg * related.ratio,
        sourceId: base.id,
        confidence: "low",
        derivedNote: `Estimated from your ${related.basedOn.replace(/-/g, " ")} 1RM`
      };
    }
  }
  return undefined;
}

export function computeLoadRange(
  exercise: Exercise,
  intensityProfile: IntensityProfile,
  oneRepMaxByExerciseId: Record<string, EstimatedOneRM>
): LoadRange | undefined {
  if (!exercise.loadable) return undefined;
  const effective = resolveEffectiveOneRm(exercise, oneRepMaxByExerciseId);
  if (!effective || !intensityProfile.percentOneRmRange) return undefined;

  const [pMin, pMax] = intensityProfile.percentOneRmRange;
  const minKg = roundToIncrement((effective.valueKg * pMin) / 100);
  const maxKg = roundToIncrement((effective.valueKg * pMax) / 100);

  return {
    minKg,
    maxKg,
    targetRpe: intensityProfile.rpeRange,
    targetRir: intensityProfile.rirRange,
    percentOneRm: intensityProfile.percentOneRmRange,
    basedOnOneRmId: effective.sourceId ?? undefined,
    note:
      effective.confidence === "low"
        ? (effective.derivedNote ?? "Estimated — refine by logging your working sets.") + ". Treat as a starting point, not a fixed target."
        : undefined
  };
}
