import type {
  Equipment,
  ExerciseDifficulty,
  FatigueTag,
  FocusArea,
  MovementPattern,
  TrainingLocation
} from "./enums";

export interface Substitution {
  exerciseId: string;
  reason: string;
  samePattern: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  aliases?: string[];
  patterns: MovementPattern[];
  primaryMuscles: FocusArea[];
  secondaryMuscles?: FocusArea[];
  /** Equipment required to perform the exercise as written. Empty array = pure bodyweight. */
  equipment: Equipment[];
  locations: TrainingLocation[];
  difficulty: ExerciseDifficulty;
  isCompound: boolean;
  /** High-skill movement (olympic lifts, gymnastics) — placed early, avoided under fatigue. */
  isTechnical: boolean;
  /** Whether an external load suggestion applies (false for most mobility/stretch drills). */
  loadable: boolean;
  cues: string[];
  videoPlaceholder: string;
  substitutions: Substitution[];
  scalingExerciseId?: string;
  progressionExerciseId?: string;
  fatigueTags?: FatigueTag[];
}
