import type {
  BlockRole,
  Equipment,
  FocusArea,
  Intensity,
  MovementPattern,
  ScoreType,
  TrainingLocation,
  TrainingStyle
} from "@/domain";

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: "Barbell and plates",
  squat_rack: "Squat rack",
  adjustable_bench: "Adjustable bench",
  dumbbells: "Dumbbells",
  kettlebells: "Kettlebells",
  cable_machine: "Cable machine",
  resistance_bands: "Resistance bands",
  pull_up_bar: "Pull-up bar",
  gymnastic_rings: "Gymnastic rings",
  dip_station: "Dip station",
  row_erg: "RowErg",
  ski_erg: "SkiErg",
  assault_bike: "Assault / air bike",
  treadmill: "Treadmill",
  standard_bike: "Standard bike",
  sled: "Sled",
  medicine_ball: "Medicine ball",
  plyo_box: "Plyometric box",
  battle_ropes: "Battle ropes",
  machines: "Machines",
  bodyweight_only: "Bodyweight only"
};

export const LOCATION_LABELS: Record<TrainingLocation, string> = {
  full_gym: "Full commercial gym",
  home_gym: "Home gym",
  minimal_equipment: "Minimal equipment",
  hotel_gym: "Hotel gym",
  outdoor: "Outdoor"
};

export const TRAINING_STYLE_LABELS: Record<TrainingStyle, string> = {
  regenerative: "Regenerative / recovery",
  mobility: "Mobility",
  stretching: "Stretching",
  zone2: "Zone 2 conditioning",
  hiit: "HIIT",
  functional_fitness: "Functional fitness / CrossFit-style",
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  power: "Power / explosive work",
  olympic_lifting: "Olympic-lifting skill",
  running_endurance: "Running / endurance conditioning",
  mixed_balanced: "Mixed / balanced"
};

export const INTENSITY_LABELS: Record<Intensity, string> = {
  recovery: "Recovery",
  light: "Light",
  moderate: "Moderate",
  hard: "Hard",
  very_hard: "Very hard"
};

export const FOCUS_AREA_LABELS: Record<FocusArea, string> = {
  chest: "Chest",
  back_lats: "Back / lats",
  upper_back_scapular: "Upper back / scapular stability",
  shoulders: "Shoulders",
  arms: "Arms",
  forearms_grip: "Forearms / grip",
  core: "Core",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves_tibialis: "Calves / tibialis",
  hip_stability: "Hip stability / adductors / abductors",
  posterior_chain: "Posterior chain",
  full_body: "Full body"
};

export const MOVEMENT_PATTERN_LABELS: Record<MovementPattern, string> = {
  squat: "Squat",
  hinge: "Hinge",
  horizontal_push: "Horizontal push",
  horizontal_pull: "Horizontal pull",
  vertical_push: "Vertical push",
  vertical_pull: "Vertical pull",
  carry: "Carry",
  locomotion: "Locomotion",
  rotation_anti_rotation: "Rotation / anti-rotation",
  olympic_lift_pattern: "Olympic-lift pattern",
  isolation: "Isolation"
};

export const BLOCK_ROLE_LABELS: Record<BlockRole, string> = {
  warmup: "Warm-up",
  skill: "Skill / explosive",
  strength: "Strength",
  secondary: "Secondary",
  conditioning: "Conditioning",
  accessory: "Accessory",
  cooldown: "Cooldown"
};

export const SCORE_TYPE_LABELS: Record<ScoreType, string> = {
  time: "Time",
  rounds_reps: "Rounds + reps",
  reps: "Reps",
  calories: "Calories",
  distance: "Distance",
  load: "Load",
  completion: "Completion"
};
