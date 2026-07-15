import type {
  BlockFormat,
  BlockRole,
  Equipment,
  FocusArea,
  Intensity,
  MovementPattern,
  ScoreType,
  SessionDurationMin,
  TrainingLocation,
  TrainingStyle
} from "./enums";
import type { Substitution } from "./exercise";

export interface SessionConfig {
  mode: "train_now" | "plan";
  durationMin: SessionDurationMin;
  style: TrainingStyle;
  intensity: Intensity;
  location: TrainingLocation;
  equipment: Equipment[];
  focusAreas: FocusArea[];
  movementFocus: MovementPattern[];
}

export interface LoadRange {
  minKg: number;
  maxKg: number;
  targetRpe?: [number, number];
  targetRir?: [number, number];
  percentOneRm?: [number, number];
  basedOnOneRmId?: string;
  note?: string;
}

export interface BlockExerciseSubstitution extends Substitution {
  exerciseName: string;
}

export interface BlockExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets?: number;
  reps?: string;
  durationSec?: number;
  loadRange?: LoadRange;
  bodyweightNote?: string;
  tempo?: string;
  restSec?: number;
  pacingNote?: string;
  coachingCues: string[];
  videoPlaceholder: string;
  substitutions: BlockExerciseSubstitution[];
  scalingOption?: { exerciseId: string; exerciseName: string };
  progressionOption?: { exerciseId: string; exerciseName: string };
}

export interface WorkoutBlock {
  id: string;
  role: BlockRole;
  title: string;
  format: BlockFormat;
  timeCapMin: number;
  instructions?: string;
  scoreType?: ScoreType;
  rounds?: number;
  intervalWorkSec?: number;
  intervalRestSec?: number;
  exercises: BlockExercise[];
}

export interface GeneratedSession {
  id: string;
  title: string;
  config: SessionConfig;
  intention: string;
  estimatedDurationMin: number;
  primaryPatterns: MovementPattern[];
  effortGuidance: string;
  equipmentRequired: Equipment[];
  blocks: WorkoutBlock[];
  fatigueNotes: string[];
  generatedAt: string;
  planId?: string;
  planWeekIndex?: number;
  planDayIndex?: number;
}
