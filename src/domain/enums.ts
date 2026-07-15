export const EQUIPMENT = [
  "barbell",
  "squat_rack",
  "adjustable_bench",
  "dumbbells",
  "kettlebells",
  "cable_machine",
  "resistance_bands",
  "pull_up_bar",
  "gymnastic_rings",
  "dip_station",
  "row_erg",
  "ski_erg",
  "assault_bike",
  "treadmill",
  "standard_bike",
  "sled",
  "medicine_ball",
  "plyo_box",
  "battle_ropes",
  "machines",
  "bodyweight_only"
] as const;
export type Equipment = (typeof EQUIPMENT)[number];

export const LOCATIONS = ["full_gym", "home_gym", "minimal_equipment", "hotel_gym", "outdoor"] as const;
export type TrainingLocation = (typeof LOCATIONS)[number];

export const TRAINING_STYLES = [
  "regenerative",
  "mobility",
  "stretching",
  "zone2",
  "hiit",
  "functional_fitness",
  "strength",
  "hypertrophy",
  "power",
  "olympic_lifting",
  "running_endurance",
  "mixed_balanced"
] as const;
export type TrainingStyle = (typeof TRAINING_STYLES)[number];

export const INTENSITIES = ["recovery", "light", "moderate", "hard", "very_hard"] as const;
export type Intensity = (typeof INTENSITIES)[number];

export const FOCUS_AREAS = [
  "chest",
  "back_lats",
  "upper_back_scapular",
  "shoulders",
  "arms",
  "forearms_grip",
  "core",
  "quads",
  "hamstrings",
  "glutes",
  "calves_tibialis",
  "hip_stability",
  "posterior_chain",
  "full_body"
] as const;
export type FocusArea = (typeof FOCUS_AREAS)[number];

export const MOVEMENT_PATTERNS = [
  "squat",
  "hinge",
  "horizontal_push",
  "horizontal_pull",
  "vertical_push",
  "vertical_pull",
  "carry",
  "locomotion",
  "rotation_anti_rotation",
  "olympic_lift_pattern",
  "isolation"
] as const;
export type MovementPattern = (typeof MOVEMENT_PATTERNS)[number];

export const SESSION_DURATIONS = [15, 20, 30, 45, 60] as const;
export type SessionDurationMin = (typeof SESSION_DURATIONS)[number];

export const PLAN_LENGTHS_WEEKS = [1, 2, 4, 6, 8] as const;
export type PlanLengthWeeks = (typeof PLAN_LENGTHS_WEEKS)[number];

export const BLOCK_ROLES = [
  "warmup",
  "skill",
  "strength",
  "secondary",
  "conditioning",
  "accessory",
  "cooldown"
] as const;
export type BlockRole = (typeof BLOCK_ROLES)[number];

export const BLOCK_FORMATS = [
  "sets_reps",
  "emom",
  "amrap",
  "for_time",
  "interval",
  "chipper",
  "duration",
  "complex"
] as const;
export type BlockFormat = (typeof BLOCK_FORMATS)[number];

export const SCORE_TYPES = [
  "time",
  "rounds_reps",
  "reps",
  "calories",
  "distance",
  "load",
  "completion"
] as const;
export type ScoreType = (typeof SCORE_TYPES)[number];

export const FATIGUE_TAGS = [
  "spinal_loading",
  "knee_dominant",
  "shoulder_intensive",
  "gymnastics_skill",
  "high_impact"
] as const;
export type FatigueTag = (typeof FATIGUE_TAGS)[number];

export const EXERCISE_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type ExerciseDifficulty = (typeof EXERCISE_DIFFICULTIES)[number];
