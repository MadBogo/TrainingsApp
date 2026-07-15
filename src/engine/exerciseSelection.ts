import type { Equipment, Exercise, FatigueTag, MovementPattern, SessionConfig, TrainingStyle } from "@/domain";
import type { StyleFamily } from "./blockTemplates";
import { getStyleFamily, isConditioningLedStyle } from "./blockTemplates";

export const WARMUP_EXERCISE_IDS = [
  "arm-circles",
  "leg-swings",
  "inchworm-to-push-up",
  "jumping-jacks",
  "band-shoulder-dislocate",
  "worlds-greatest-stretch",
  "glute-bridge-march",
  "bird-dog"
];

export const COOLDOWN_EXERCISE_IDS = [
  "couch-stretch",
  "thoracic-rotation-stretch",
  "childs-pose",
  "hamstring-floss",
  "cat-cow"
];

export const MOBILITY_POOL_IDS = [...WARMUP_EXERCISE_IDS, ...COOLDOWN_EXERCISE_IDS];

const CONDITIONING_PATTERNS: MovementPattern[] = ["locomotion", "carry", "hinge", "squat"];
const STRENGTH_PATTERNS_BY_STYLE: Partial<Record<TrainingStyle, MovementPattern[]>> = {
  power: ["squat", "hinge", "vertical_push", "olympic_lift_pattern"],
  olympic_lifting: ["olympic_lift_pattern"]
};
const DEFAULT_STRENGTH_PATTERNS: MovementPattern[] = [
  "squat",
  "hinge",
  "horizontal_push",
  "vertical_push",
  "horizontal_pull",
  "vertical_pull"
];
const SECONDARY_COMPLEMENT: Partial<Record<MovementPattern, MovementPattern[]>> = {
  squat: ["hinge", "horizontal_pull", "vertical_pull"],
  hinge: ["squat", "horizontal_push", "vertical_push"],
  horizontal_push: ["horizontal_pull", "vertical_pull"],
  vertical_push: ["vertical_pull", "horizontal_pull"],
  horizontal_pull: ["horizontal_push", "vertical_push"],
  vertical_pull: ["vertical_push", "horizontal_push"],
  olympic_lift_pattern: ["squat", "hinge"]
};

function equipmentSatisfied(exercise: Exercise, available: Equipment[]): boolean {
  return exercise.equipment.every((e) => available.includes(e));
}

export interface SelectionContext {
  config: SessionConfig;
  pool: Exercise[];
  recentExerciseIds: Set<string>;
  fatigueFlags: Set<FatigueTag>;
  usedInThisSession: Set<string>;
}

function usableExercises(ctx: SelectionContext, extraFilter?: (e: Exercise) => boolean): Exercise[] {
  return ctx.pool.filter(
    (e) =>
      equipmentSatisfied(e, ctx.config.equipment) &&
      e.locations.includes(ctx.config.location) &&
      !ctx.usedInThisSession.has(e.id) &&
      (!extraFilter || extraFilter(e))
  );
}

function score(exercise: Exercise, ctx: SelectionContext, desiredPatterns: MovementPattern[]): number {
  let s = 0;
  if (desiredPatterns.some((p) => exercise.patterns.includes(p))) s += 10;
  if (ctx.config.movementFocus.length > 0 && exercise.patterns.some((p) => ctx.config.movementFocus.includes(p))) {
    s += 8;
  }
  if (!ctx.config.focusAreas.includes("full_body")) {
    if (exercise.primaryMuscles.some((m) => ctx.config.focusAreas.includes(m))) s += 6;
    if (exercise.secondaryMuscles?.some((m) => ctx.config.focusAreas.includes(m))) s += 3;
  }
  for (const tag of exercise.fatigueTags ?? []) {
    if (ctx.fatigueFlags.has(tag)) s -= 5;
  }
  if (ctx.recentExerciseIds.has(exercise.id)) s -= 3;
  return s;
}

function pickBest(candidates: Exercise[], ctx: SelectionContext, desiredPatterns: MovementPattern[]): Exercise | undefined {
  if (candidates.length === 0) return undefined;
  const ranked = [...candidates].sort((a, b) => {
    const diff = score(b, ctx, desiredPatterns) - score(a, ctx, desiredPatterns);
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });
  return ranked[0];
}

export function selectWarmup(ctx: SelectionContext, count: number): Exercise[] {
  const candidates = usableExercises(ctx, (e) => WARMUP_EXERCISE_IDS.includes(e.id));
  const fallback = candidates.length > 0 ? candidates : usableExercises(ctx, (e) => e.difficulty === "beginner" && !e.loadable);
  return takeRotating(fallback, ctx, [], count);
}

export function selectCooldown(ctx: SelectionContext, count: number): Exercise[] {
  const candidates = usableExercises(ctx, (e) => COOLDOWN_EXERCISE_IDS.includes(e.id));
  return takeRotating(candidates, ctx, [], count);
}

export function selectMobilityContent(ctx: SelectionContext, count: number): Exercise[] {
  const candidates = usableExercises(ctx, (e) => MOBILITY_POOL_IDS.includes(e.id));
  return takeRotating(candidates, ctx, [], count);
}

export function selectConditioningContent(ctx: SelectionContext, count: number): Exercise[] {
  const candidates = usableExercises(ctx, (e) => e.isCompound && e.patterns.some((p) => CONDITIONING_PATTERNS.includes(p)));
  const fallback = candidates.length >= count ? candidates : usableExercises(ctx, (e) => e.isCompound);
  return takeRotating(fallback, ctx, CONDITIONING_PATTERNS, count);
}

export function selectStrength(ctx: SelectionContext, style: TrainingStyle): Exercise | undefined {
  const desired = STRENGTH_PATTERNS_BY_STYLE[style] ?? DEFAULT_STRENGTH_PATTERNS;
  const candidates = usableExercises(ctx, (e) => e.isCompound);
  return pickBest(candidates, ctx, desired);
}

export function selectSecondary(ctx: SelectionContext, primaryPattern: MovementPattern | undefined): Exercise | undefined {
  const desired = primaryPattern ? SECONDARY_COMPLEMENT[primaryPattern] ?? DEFAULT_STRENGTH_PATTERNS : DEFAULT_STRENGTH_PATTERNS;
  const candidates = usableExercises(ctx, (e) => e.isCompound);
  return pickBest(candidates, ctx, desired);
}

export function selectAccessory(ctx: SelectionContext, count: number): Exercise[] {
  const candidates = usableExercises(ctx);
  return takeRotating(candidates, ctx, ["isolation", "carry", "rotation_anti_rotation"], count);
}

export function selectSkill(ctx: SelectionContext, style: TrainingStyle, count: number): Exercise[] {
  if (style === "olympic_lifting") {
    const candidates = usableExercises(ctx, (e) => e.patterns.includes("olympic_lift_pattern"));
    return takeRotating(candidates, ctx, ["olympic_lift_pattern"], count);
  }
  const candidates = usableExercises(ctx, (e) => e.isTechnical);
  const fallback = candidates.length > 0 ? candidates : usableExercises(ctx, (e) => e.patterns.includes("vertical_pull"));
  return takeRotating(fallback, ctx, ["vertical_pull", "vertical_push", "locomotion"], count);
}

function takeRotating(candidates: Exercise[], ctx: SelectionContext, desiredPatterns: MovementPattern[], count: number): Exercise[] {
  const result: Exercise[] = [];
  const remaining = new Set(candidates.map((c) => c.id));
  for (let i = 0; i < count && remaining.size > 0; i++) {
    const pool = candidates.filter((c) => remaining.has(c.id));
    const pick = pickBest(pool, ctx, desiredPatterns);
    if (!pick) break;
    result.push(pick);
    remaining.delete(pick.id);
    ctx.usedInThisSession.add(pick.id);
  }
  return result;
}

export function getStyleFamilyOf(style: TrainingStyle): StyleFamily {
  return getStyleFamily(style);
}

export { isConditioningLedStyle };
