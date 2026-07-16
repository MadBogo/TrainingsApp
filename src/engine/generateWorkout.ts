import { v4 as uuid } from "uuid";
import type {
  BlockExercise,
  BlockExerciseSubstitution,
  BlockFormat,
  BlockRole,
  EstimatedOneRM,
  Exercise,
  GeneratedSession,
  LoggedSession,
  MovementPattern,
  SessionConfig,
  TrainingStyle,
  WorkoutBlock
} from "@/domain";
import { deriveFormat, getBlockPlan, getStyleFamily, isConditioningLedStyle } from "./blockTemplates";
import { INTENSITY_PROFILES } from "./intensity";
import { analyzeFatigue } from "./fatigue";
import { computeLoadRange } from "./loadCalculation";
import {
  selectAccessory,
  selectConditioningContent,
  selectCooldown,
  selectMobilityContent,
  selectSecondary,
  selectSkill,
  selectStrength,
  selectWarmup,
  type SelectionContext
} from "./exerciseSelection";
import { BLOCK_ROLE_LABELS, TRAINING_STYLE_LABELS } from "@/data/labels";
import { roundToIncrement } from "@/lib/utils";

export interface GenerateWorkoutContext {
  config: SessionConfig;
  exercises: Exercise[];
  oneRepMaxes: EstimatedOneRM[];
  recentLogs?: LoggedSession[];
  recentSessions?: GeneratedSession[];
  /**
   * Exercise ids to deprioritize for this generation specifically — used by "Regenerate" to
   * steer away from the workout just shown. The engine has no randomness by design (same
   * inputs always produce the same output, which is what makes it testable), so without this
   * signal, regenerating with an unchanged config and no new logged history would otherwise
   * produce the exact same workout every time.
   */
  avoidExerciseIds?: string[];
}

function buildOneRmMap(oneRepMaxes: EstimatedOneRM[]): Record<string, EstimatedOneRM> {
  const map: Record<string, EstimatedOneRM> = {};
  const sorted = [...oneRepMaxes].sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1));
  for (const orm of sorted) {
    if (!map[orm.exerciseId]) map[orm.exerciseId] = orm;
  }
  return map;
}

function resolveSubstitutions(exercise: Exercise, byId: Record<string, Exercise>): BlockExerciseSubstitution[] {
  return exercise.substitutions
    .map((s) => {
      const sub = byId[s.exerciseId];
      return sub ? { ...s, exerciseName: sub.name } : null;
    })
    .filter((s): s is BlockExerciseSubstitution => s !== null);
}

function resolveOption(id: string | undefined, byId: Record<string, Exercise>) {
  if (!id) return undefined;
  const ex = byId[id];
  return ex ? { exerciseId: ex.id, exerciseName: ex.name } : undefined;
}

interface SetsReps {
  sets: number;
  reps: string;
}

function prescribeSetsReps(role: BlockRole, style: TrainingStyle): SetsReps {
  if (role === "strength") {
    switch (style) {
      case "strength":
        return { sets: 5, reps: "3-5" };
      case "hypertrophy":
        return { sets: 4, reps: "8-12" };
      case "power":
        return { sets: 5, reps: "2-3" };
      case "olympic_lifting":
        return { sets: 5, reps: "2" };
      default:
        return { sets: 5, reps: "3-5" };
    }
  }
  if (role === "secondary") {
    if (style === "hypertrophy") return { sets: 3, reps: "10-15" };
    if (style === "strength") return { sets: 3, reps: "6-8" };
    return { sets: 3, reps: "8-10" };
  }
  if (role === "skill") {
    return style === "olympic_lifting" ? { sets: 5, reps: "2" } : { sets: 3, reps: "3-5" };
  }
  // accessory (non-mobility)
  return style === "hypertrophy" ? { sets: 3, reps: "12-15" } : { sets: 3, reps: "10-12" };
}

function midpoint([a, b]: [number, number]): number {
  return Math.round((a + b) / 2);
}

/** Controlled eccentric tempo for hypertrophy work — the style where time-under-tension is most relevant. */
function prescribeTempo(role: BlockRole, style: TrainingStyle, exercise: Exercise): string | undefined {
  if (style !== "hypertrophy") return undefined;
  if (role !== "strength" && role !== "secondary" && role !== "accessory") return undefined;
  if (!exercise.isCompound) return "3-1-1-0";
  return "3-0-1-0";
}

function buildBlockExercise(
  exercise: Exercise,
  role: BlockRole,
  config: SessionConfig,
  byId: Record<string, Exercise>,
  oneRmMap: Record<string, EstimatedOneRM>,
  restSec: number
): BlockExercise {
  const intensityProfile = INTENSITY_PROFILES[config.intensity];
  const loadRange = computeLoadRange(exercise, intensityProfile, oneRmMap);
  const { sets, reps } = prescribeSetsReps(role, config.style);

  return {
    id: uuid(),
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    sets,
    reps,
    loadRange,
    bodyweightNote: !exercise.loadable ? "Bodyweight" : !loadRange ? "No load history yet — start light and log this set." : undefined,
    tempo: prescribeTempo(role, config.style, exercise),
    restSec,
    coachingCues: exercise.cues,
    videoPlaceholder: exercise.videoPlaceholder,
    substitutions: resolveSubstitutions(exercise, byId),
    scalingOption: resolveOption(exercise.scalingExerciseId, byId),
    progressionOption: resolveOption(exercise.progressionExerciseId, byId)
  };
}

const CONDITIONING_REPS_BY_PATTERN: Partial<Record<MovementPattern, string>> = {
  locomotion: "15/12 cal or 200m",
  carry: "40m",
  hinge: "12",
  squat: "12",
  horizontal_push: "10",
  horizontal_pull: "10",
  vertical_push: "8",
  vertical_pull: "8",
  rotation_anti_rotation: "12",
  olympic_lift_pattern: "5",
  isolation: "15"
};

/** Conditioning-block prescriptions are continuous-round reps at a submaximal load, not strength sets. */
function buildConditioningExercise(
  exercise: Exercise,
  config: SessionConfig,
  byId: Record<string, Exercise>,
  oneRmMap: Record<string, EstimatedOneRM>
): BlockExercise {
  const intensityProfile = INTENSITY_PROFILES[config.intensity];
  const fullLoadRange = computeLoadRange(exercise, intensityProfile, oneRmMap);
  const loadRange = fullLoadRange
    ? {
        ...fullLoadRange,
        minKg: roundToIncrement(fullLoadRange.minKg * 0.55),
        maxKg: roundToIncrement(fullLoadRange.maxKg * 0.65),
        note: "Conditioning load — kept submaximal so pace holds up for the whole piece."
      }
    : undefined;
  const reps = CONDITIONING_REPS_BY_PATTERN[exercise.patterns[0]] ?? "12";

  return {
    id: uuid(),
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    reps,
    loadRange,
    bodyweightNote: !exercise.loadable ? "Bodyweight" : !loadRange ? "No load history yet — start light and log this set." : undefined,
    coachingCues: exercise.cues,
    videoPlaceholder: exercise.videoPlaceholder,
    substitutions: resolveSubstitutions(exercise, byId),
    scalingOption: resolveOption(exercise.scalingExerciseId, byId),
    progressionOption: resolveOption(exercise.progressionExerciseId, byId)
  };
}

function buildDurationExercise(exercise: Exercise, durationSec: number, byId: Record<string, Exercise>): BlockExercise {
  return {
    id: uuid(),
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    durationSec,
    bodyweightNote: "Bodyweight",
    coachingCues: exercise.cues,
    videoPlaceholder: exercise.videoPlaceholder,
    substitutions: resolveSubstitutions(exercise, byId),
    scalingOption: resolveOption(exercise.scalingExerciseId, byId),
    progressionOption: resolveOption(exercise.progressionExerciseId, byId)
  };
}

function buildDrillBlock(
  role: BlockRole,
  title: string,
  instructions: string,
  exercises: Exercise[],
  timeCapMin: number,
  byId: Record<string, Exercise>
): WorkoutBlock {
  const perExerciseSec = Math.max(30, Math.round((timeCapMin * 60) / Math.max(1, exercises.length)));
  return {
    id: uuid(),
    role,
    title,
    format: "duration",
    timeCapMin,
    instructions,
    exercises: exercises.map((e) => buildDurationExercise(e, perExerciseSec, byId))
  };
}

const WARMUP_INSTRUCTIONS = "Move deliberately through each drill to raise temperature and prep the joints.";
const COOLDOWN_INSTRUCTIONS = "Ease the heart rate down and decompress the areas worked today.";

function buildConditioningBlock(
  format: BlockFormat,
  exercises: Exercise[],
  timeCapMin: number,
  config: SessionConfig,
  byId: Record<string, Exercise>,
  oneRmMap: Record<string, EstimatedOneRM>
): WorkoutBlock {
  const intensityProfile = INTENSITY_PROFILES[config.intensity];

  if (format === "duration") {
    const primary = exercises[0];
    return {
      id: uuid(),
      role: "conditioning",
      title: isConditioningLedStyle(config.style) ? "Aerobic conditioning" : "Conditioning",
      format,
      timeCapMin,
      scoreType: "distance",
      instructions: intensityProfile.conditioningPace,
      exercises: [buildDurationExercise(primary, timeCapMin * 60, byId)]
    };
  }

  if (format === "interval") {
    const workSec = config.intensity === "very_hard" || config.intensity === "hard" ? 30 : 40;
    const restSec = config.intensity === "very_hard" || config.intensity === "hard" ? 30 : 20;
    const rounds = Math.max(3, Math.round((timeCapMin * 60) / (workSec + restSec)));
    return {
      id: uuid(),
      role: "conditioning",
      title: "Intervals",
      format,
      timeCapMin,
      rounds,
      intervalWorkSec: workSec,
      intervalRestSec: restSec,
      scoreType: "reps",
      instructions: intensityProfile.conditioningPace,
      exercises: exercises.map((e) => buildDurationExercise(e, workSec, byId))
    };
  }

  if (format === "emom") {
    const rounds = timeCapMin;
    return {
      id: uuid(),
      role: "conditioning",
      title: `EMOM ${timeCapMin}`,
      format,
      timeCapMin,
      rounds,
      intervalWorkSec: 60,
      scoreType: "completion",
      instructions: `Start the prescribed work at the top of every minute for ${timeCapMin} minutes, resting with whatever time remains. ${intensityProfile.conditioningPace}`,
      exercises: exercises.map((e) => buildConditioningExercise(e, config, byId, oneRmMap))
    };
  }

  if (format === "amrap") {
    return {
      id: uuid(),
      role: "conditioning",
      title: `AMRAP ${timeCapMin}`,
      format,
      timeCapMin,
      scoreType: "rounds_reps",
      instructions: `As many rounds/reps as possible in ${timeCapMin} minutes. ${intensityProfile.conditioningPace}`,
      exercises: exercises.map((e) => buildConditioningExercise(e, config, byId, oneRmMap))
    };
  }

  // for_time / chipper
  return {
    id: uuid(),
    role: "conditioning",
    title: "For Time",
    format,
    timeCapMin,
    scoreType: "time",
    instructions: `Complete the work as fast as good form allows, time-capped at ${timeCapMin} minutes. ${intensityProfile.conditioningPace}`,
    exercises: exercises.map((e) => buildConditioningExercise(e, config, byId, oneRmMap))
  };
}

export function generateWorkout(ctx: GenerateWorkoutContext): GeneratedSession {
  const { config } = ctx;
  const byId = Object.fromEntries(ctx.exercises.map((e) => [e.id, e]));
  const oneRmMap = buildOneRmMap(ctx.oneRepMaxes);
  const recentLogs = ctx.recentLogs ?? [];
  const recentSessions = ctx.recentSessions ?? [];

  const fatigue = analyzeFatigue(recentLogs, recentSessions, byId);
  const recentExerciseIds = new Set([
    ...recentLogs
      .filter((l) => l.completed)
      .slice(0, 3)
      .flatMap((l) => l.loggedSets.map((s) => s.exerciseId)),
    ...(ctx.avoidExerciseIds ?? [])
  ]);

  const selectionCtx: SelectionContext = {
    config,
    pool: ctx.exercises,
    recentExerciseIds,
    fatigueFlags: fatigue.flags,
    usedInThisSession: new Set()
  };

  const intensityProfile = INTENSITY_PROFILES[config.intensity];
  const blockPlan = getBlockPlan(config.style, config.durationMin);
  const blocks: WorkoutBlock[] = [];
  let primaryPattern: MovementPattern | undefined;
  const restSec = midpoint(intensityProfile.restSecRange);

  for (const slot of blockPlan) {
    const format = deriveFormat(slot.role, config.style, config.intensity);

    if (slot.role === "warmup") {
      const count = Math.min(4, Math.max(2, Math.round(slot.timeCapMin / 1.5)));
      blocks.push(
        buildDrillBlock("warmup", BLOCK_ROLE_LABELS.warmup, WARMUP_INSTRUCTIONS, selectWarmup(selectionCtx, count), slot.timeCapMin, byId)
      );
      continue;
    }
    if (slot.role === "cooldown") {
      const count = Math.min(3, Math.max(1, Math.round(slot.timeCapMin / 2)));
      blocks.push(
        buildDrillBlock("cooldown", BLOCK_ROLE_LABELS.cooldown, COOLDOWN_INSTRUCTIONS, selectCooldown(selectionCtx, count), slot.timeCapMin, byId)
      );
      continue;
    }
    if (slot.role === "accessory" && getStyleFamily(config.style) === "single_block") {
      const count = Math.min(6, Math.max(3, Math.round(slot.timeCapMin / 4)));
      const title = isConditioningLedStyle(config.style) ? "Aerobic base" : "Mobility work";
      blocks.push(
        buildDrillBlock("accessory", title, COOLDOWN_INSTRUCTIONS, selectMobilityContent(selectionCtx, count), slot.timeCapMin, byId)
      );
      continue;
    }
    if (slot.role === "strength") {
      const picked = selectStrength(selectionCtx, config.style);
      if (!picked) continue;
      selectionCtx.usedInThisSession.add(picked.id);
      primaryPattern = picked.patterns[0];
      blocks.push({
        id: uuid(),
        role: "strength",
        title: "Strength",
        format,
        timeCapMin: slot.timeCapMin,
        exercises: [buildBlockExercise(picked, "strength", config, byId, oneRmMap, restSec)]
      });
      continue;
    }
    if (slot.role === "secondary") {
      const picked = selectSecondary(selectionCtx, primaryPattern);
      if (!picked) continue;
      selectionCtx.usedInThisSession.add(picked.id);
      blocks.push({
        id: uuid(),
        role: "secondary",
        title: "Secondary strength",
        format,
        timeCapMin: slot.timeCapMin,
        exercises: [buildBlockExercise(picked, "secondary", config, byId, oneRmMap, Math.round(restSec * 0.8))]
      });
      continue;
    }
    if (slot.role === "skill") {
      const count = config.style === "olympic_lifting" ? 1 : 2;
      const picked = selectSkill(selectionCtx, config.style, count);
      if (picked.length === 0) continue;
      blocks.push({
        id: uuid(),
        role: "skill",
        title: config.style === "olympic_lifting" ? "Olympic-lift skill work" : "Skill work",
        format,
        timeCapMin: slot.timeCapMin,
        instructions: "Low-fatigue technical practice — prioritize quality over load or speed.",
        exercises: picked.map((e) => buildBlockExercise(e, "skill", config, byId, oneRmMap, Math.round(restSec * 1.3)))
      });
      continue;
    }
    if (slot.role === "accessory") {
      const count = Math.min(4, Math.max(2, Math.round(slot.timeCapMin / 4)));
      const picked = selectAccessory(selectionCtx, count);
      if (picked.length === 0) continue;
      blocks.push({
        id: uuid(),
        role: "accessory",
        title: "Accessory work",
        format,
        timeCapMin: slot.timeCapMin,
        exercises: picked.map((e) => buildBlockExercise(e, "accessory", config, byId, oneRmMap, Math.round(restSec * 0.6)))
      });
      continue;
    }
    if (slot.role === "conditioning") {
      const count = format === "duration" ? 1 : format === "interval" ? 2 : 3;
      const picked = selectConditioningContent(selectionCtx, count);
      if (picked.length === 0) continue;
      blocks.push(buildConditioningBlock(format, picked, slot.timeCapMin, config, byId, oneRmMap));
      continue;
    }
  }

  const estimatedDurationMin = blocks.reduce((sum, b) => sum + b.timeCapMin, 0);
  const primaryPatterns = Array.from(new Set(blocks.flatMap((b) => b.exercises.map((e) => byId[e.exerciseId]?.patterns ?? []).flat())));
  const equipmentRequired = Array.from(new Set(blocks.flatMap((b) => b.exercises.flatMap((e) => byId[e.exerciseId]?.equipment ?? []))));

  return {
    id: uuid(),
    title: `${TRAINING_STYLE_LABELS[config.style]} — ${config.durationMin} min`,
    config,
    intention: buildIntention(config, intensityProfile.plainEnglish),
    estimatedDurationMin,
    primaryPatterns,
    effortGuidance: `${intensityProfile.label}: ${intensityProfile.plainEnglish}`,
    equipmentRequired,
    blocks,
    fatigueNotes: fatigue.notes,
    generatedAt: new Date().toISOString()
  };
}

function buildIntention(config: SessionConfig, intensityPlain: string): string {
  const focus =
    config.focusAreas.length === 1 && config.focusAreas[0] === "full_body"
      ? "the whole body"
      : config.focusAreas.join(", ").replace(/_/g, " ");
  return `A ${config.durationMin}-minute ${TRAINING_STYLE_LABELS[config.style].toLowerCase()} session targeting ${focus}. ${intensityPlain}`;
}

const CONDITIONING_FORMATS: BlockFormat[] = ["amrap", "for_time", "interval", "emom", "chipper"];

/**
 * Replaces one exercise in a generated session with a substitute, recalculating identity-
 * dependent fields (load range, cues, substitutions, scaling/progression) while preserving
 * the original prescription (sets/reps/rest/duration) so a swap never silently changes the
 * session's structure. Returns a new session object; the caller persists it.
 */
export function swapExerciseInSession(
  session: GeneratedSession,
  blockId: string,
  blockExerciseId: string,
  newExerciseId: string,
  exercises: Exercise[],
  oneRepMaxes: EstimatedOneRM[]
): GeneratedSession {
  const byId = Object.fromEntries(exercises.map((e) => [e.id, e]));
  const replacement = byId[newExerciseId];
  if (!replacement) return session;
  const oneRmMap = buildOneRmMap(oneRepMaxes);
  const intensityProfile = INTENSITY_PROFILES[session.config.intensity];

  const blocks = session.blocks.map((block) => {
    if (block.id !== blockId) return block;
    return {
      ...block,
      exercises: block.exercises.map((be) => {
        if (be.id !== blockExerciseId) return be;

        if (CONDITIONING_FORMATS.includes(block.format)) {
          return { ...buildConditioningExercise(replacement, session.config, byId, oneRmMap), id: be.id };
        }
        if (block.format === "duration") {
          return { ...buildDurationExercise(replacement, be.durationSec ?? 30, byId), id: be.id };
        }
        // sets_reps / complex: keep the prescription, swap the identity + load.
        const loadRange = computeLoadRange(replacement, intensityProfile, oneRmMap);
        return {
          ...be,
          exerciseId: replacement.id,
          exerciseName: replacement.name,
          loadRange,
          bodyweightNote: !replacement.loadable
            ? "Bodyweight"
            : !loadRange
              ? "No load history yet — start light and log this set."
              : undefined,
          tempo: prescribeTempo(block.role, session.config.style, replacement),
          coachingCues: replacement.cues,
          videoPlaceholder: replacement.videoPlaceholder,
          substitutions: resolveSubstitutions(replacement, byId),
          scalingOption: resolveOption(replacement.scalingExerciseId, byId),
          progressionOption: resolveOption(replacement.progressionExerciseId, byId)
        };
      })
    };
  });

  return { ...session, blocks };
}
