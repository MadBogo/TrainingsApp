import type { Exercise } from "@/domain";

const FULL = ["full_gym"] as const;
const FULL_HOME = ["full_gym", "home_gym"] as const;
const FULL_HOME_OUTDOOR = ["full_gym", "home_gym", "outdoor"] as const;
const FULL_HOME_HOTEL = ["full_gym", "home_gym", "hotel_gym"] as const;
const ANYWHERE = ["full_gym", "home_gym", "minimal_equipment", "hotel_gym", "outdoor"] as const;
const FULL_HOTEL = ["full_gym", "hotel_gym"] as const;

function px(id: string): string {
  return `placeholder://${id}`;
}

export const EXERCISES: Exercise[] = [
  // ---------- Warm-up / activation ----------
  {
    id: "arm-circles",
    name: "Arm Circles",
    patterns: ["isolation"],
    primaryMuscles: ["shoulders"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Small circles first, gradually widen", "Keep ribs stacked over hips"],
    videoPlaceholder: px("arm-circles"),
    substitutions: [
      { exerciseId: "band-shoulder-dislocate", reason: "Add light external resistance", samePattern: true },
      { exerciseId: "band-pull-apart", reason: "More scapular-focused warm-up option", samePattern: false }
    ]
  },
  {
    id: "leg-swings",
    name: "Leg Swings",
    patterns: ["isolation"],
    primaryMuscles: ["hip_stability"],
    secondaryMuscles: ["hamstrings"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Hold a wall or rack for balance", "Controlled range, no momentum yanking the hip"],
    videoPlaceholder: px("leg-swings"),
    substitutions: [
      { exerciseId: "worlds-greatest-stretch", reason: "Broader dynamic mobility warm-up", samePattern: false },
      { exerciseId: "glute-bridge-march", reason: "More hip-activation focused", samePattern: false }
    ]
  },
  {
    id: "inchworm-to-push-up",
    name: "Inchworm to Push-up",
    patterns: ["isolation"],
    primaryMuscles: ["full_body"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Walk hands out to a plank", "Optional push-up at the bottom", "Walk feet up to hands, flat-footed if possible"],
    videoPlaceholder: px("inchworm-to-push-up"),
    substitutions: [
      { exerciseId: "worlds-greatest-stretch", reason: "Similar full-body dynamic warm-up", samePattern: true },
      { exerciseId: "jumping-jacks", reason: "Faster way to raise heart rate and body temperature", samePattern: false }
    ]
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    patterns: ["locomotion"],
    primaryMuscles: ["full_body"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Soft knees on landing", "Full arm extension overhead"],
    videoPlaceholder: px("jumping-jacks"),
    substitutions: [
      { exerciseId: "inchworm-to-push-up", reason: "Lower-impact general warm-up alternative", samePattern: false },
      { exerciseId: "row-erg", reason: "Machine-based general warm-up", samePattern: false }
    ],
    fatigueTags: ["high_impact"]
  },
  {
    id: "band-shoulder-dislocate",
    name: "Band Shoulder Dislocate",
    patterns: ["isolation"],
    primaryMuscles: ["shoulders"],
    equipment: ["resistance_bands"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Wide grip to start", "Bar/band travels from front to back over the top", "Narrow the grip only as mobility allows"],
    videoPlaceholder: px("band-shoulder-dislocate"),
    substitutions: [
      { exerciseId: "arm-circles", reason: "No band available", samePattern: true },
      { exerciseId: "thoracic-rotation-stretch", reason: "Broader upper-body mobility option", samePattern: false }
    ]
  },
  {
    id: "worlds-greatest-stretch",
    name: "World's Greatest Stretch",
    patterns: ["isolation"],
    primaryMuscles: ["full_body"],
    secondaryMuscles: ["hip_stability", "posterior_chain"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Long lunge step, back leg straight", "Drop back hand to floor, rotate the other arm to the sky", "Follow the hand with your eyes"],
    videoPlaceholder: px("worlds-greatest-stretch"),
    substitutions: [
      { exerciseId: "couch-stretch", reason: "More hip-flexor targeted", samePattern: false },
      { exerciseId: "inchworm-to-push-up", reason: "Similar full-body warm-up sequence", samePattern: true }
    ]
  },
  {
    id: "glute-bridge-march",
    name: "Glute Bridge March",
    patterns: ["isolation"],
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["core", "hip_stability"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Squeeze glutes to lift hips level", "Lift one knee without hips dropping", "Keep ribs down, avoid over-arching"],
    videoPlaceholder: px("glute-bridge-march"),
    substitutions: [
      { exerciseId: "dead-bug", reason: "Similar low-load core/hip activation", samePattern: false },
      { exerciseId: "bird-dog", reason: "Adds anti-rotation component", samePattern: false }
    ]
  },
  {
    id: "bird-dog",
    name: "Bird Dog",
    patterns: ["rotation_anti_rotation"],
    primaryMuscles: ["core"],
    secondaryMuscles: ["hip_stability"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Reach opposite arm and leg without rotating the hips", "Keep the low back neutral, no arching"],
    videoPlaceholder: px("bird-dog"),
    substitutions: [
      { exerciseId: "dead-bug", reason: "Same anti-extension pattern, floor-supported", samePattern: true },
      { exerciseId: "glute-bridge-march", reason: "Simpler hip-activation alternative", samePattern: false }
    ]
  },

  // ---------- Olympic lifting / technical ----------
  {
    id: "power-clean",
    name: "Power Clean",
    patterns: ["olympic_lift_pattern"],
    primaryMuscles: ["posterior_chain"],
    secondaryMuscles: ["glutes", "quads", "shoulders"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["Bar close to the shins, chest tall", "Aggressive hip extension, shrug and pull under", "Catch in a quarter-squat, elbows fast around"],
    videoPlaceholder: px("power-clean"),
    substitutions: [
      { exerciseId: "hang-power-clean", reason: "Reduce range of motion off the floor", samePattern: true },
      { exerciseId: "kettlebell-clean-and-press", reason: "No barbell available", samePattern: false }
    ],
    scalingExerciseId: "hang-power-clean",
    progressionExerciseId: "clean-and-jerk",
    fatigueTags: ["gymnastics_skill", "spinal_loading"]
  },
  {
    id: "hang-power-clean",
    name: "Hang Power Clean",
    patterns: ["olympic_lift_pattern"],
    primaryMuscles: ["posterior_chain"],
    secondaryMuscles: ["glutes", "shoulders"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["Start at mid-thigh, shins vertical", "Explosive hip snap, shrug, pull under fast"],
    videoPlaceholder: px("hang-power-clean"),
    substitutions: [
      { exerciseId: "kettlebell-swing", reason: "Similar hip-hinge power pattern, less technical", samePattern: false },
      { exerciseId: "dumbbell-romanian-deadlift", reason: "Removes catch-phase skill demand", samePattern: false }
    ],
    scalingExerciseId: "kettlebell-swing",
    progressionExerciseId: "power-clean",
    fatigueTags: ["gymnastics_skill"]
  },
  {
    id: "snatch",
    name: "Snatch",
    patterns: ["olympic_lift_pattern"],
    primaryMuscles: ["posterior_chain"],
    secondaryMuscles: ["shoulders", "glutes"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["Wide grip, bar over midfoot", "One aggressive pull, punch overhead into the catch", "Receive in an overhead squat position"],
    videoPlaceholder: px("snatch"),
    substitutions: [
      { exerciseId: "dumbbell-shoulder-press", reason: "No barbell/technical proficiency required", samePattern: false },
      { exerciseId: "kettlebell-swing", reason: "Similar hip-power pattern without the catch", samePattern: false }
    ],
    fatigueTags: ["gymnastics_skill", "shoulder_intensive"]
  },
  {
    id: "push-jerk",
    name: "Push Jerk",
    patterns: ["olympic_lift_pattern"],
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["quads", "core"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["Dip straight down, drive vertically", "Punch under the bar into a short lockout squat"],
    videoPlaceholder: px("push-jerk"),
    substitutions: [
      { exerciseId: "barbell-push-press", reason: "Removes the re-bend catch phase", samePattern: true },
      { exerciseId: "dumbbell-shoulder-press", reason: "No barbell available", samePattern: false }
    ],
    scalingExerciseId: "barbell-push-press",
    fatigueTags: ["gymnastics_skill", "shoulder_intensive"]
  },
  {
    id: "clean-and-jerk",
    name: "Clean and Jerk",
    patterns: ["olympic_lift_pattern"],
    primaryMuscles: ["full_body"],
    secondaryMuscles: ["posterior_chain", "shoulders"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["Clean the bar to the shoulders", "Reset the breath", "Dip and drive into the jerk"],
    videoPlaceholder: px("clean-and-jerk"),
    substitutions: [
      { exerciseId: "power-clean", reason: "Isolate the pulling portion only", samePattern: true },
      { exerciseId: "push-jerk", reason: "Isolate the overhead portion only", samePattern: true }
    ],
    scalingExerciseId: "power-clean",
    fatigueTags: ["gymnastics_skill", "spinal_loading", "shoulder_intensive"]
  },

  // ---------- Barbell strength ----------
  {
    id: "barbell-back-squat",
    name: "Barbell Back Squat",
    patterns: ["squat"],
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["core"],
    equipment: ["barbell", "squat_rack"],
    locations: [...FULL_HOME],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Brace before unracking", "Sit hips back and down, knees track over toes", "Drive through the whole foot to stand"],
    videoPlaceholder: px("barbell-back-squat"),
    substitutions: [
      { exerciseId: "dumbbell-goblet-squat", reason: "No barbell/rack available", samePattern: true },
      { exerciseId: "leg-press", reason: "Reduce spinal loading while keeping knee-dominant volume", samePattern: false }
    ],
    scalingExerciseId: "dumbbell-goblet-squat",
    progressionExerciseId: "barbell-front-squat",
    fatigueTags: ["spinal_loading", "knee_dominant"]
  },
  {
    id: "barbell-front-squat",
    name: "Barbell Front Squat",
    patterns: ["squat"],
    primaryMuscles: ["quads"],
    secondaryMuscles: ["core", "glutes"],
    equipment: ["barbell", "squat_rack"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["High elbows, bar on the front delts", "Stay upright through the torso", "Drive knees out as you stand"],
    videoPlaceholder: px("barbell-front-squat"),
    substitutions: [
      { exerciseId: "dumbbell-goblet-squat", reason: "No barbell/rack, or wrist mobility limits the front rack", samePattern: true },
      { exerciseId: "barbell-back-squat", reason: "Reduce front-rack mobility demand", samePattern: true }
    ],
    scalingExerciseId: "dumbbell-goblet-squat",
    fatigueTags: ["spinal_loading", "knee_dominant"]
  },
  {
    id: "barbell-deadlift",
    name: "Barbell Deadlift",
    patterns: ["hinge"],
    primaryMuscles: ["posterior_chain", "hamstrings", "back_lats"],
    secondaryMuscles: ["glutes", "forearms_grip"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Bar over midfoot, shins to the bar", "Brace, flat back, push the floor away", "Lock out with hips, not lower-back hyperextension"],
    videoPlaceholder: px("barbell-deadlift"),
    substitutions: [
      { exerciseId: "dumbbell-romanian-deadlift", reason: "No barbell available or reduce spinal load", samePattern: true },
      { exerciseId: "kettlebell-swing", reason: "Lower-load hip-hinge alternative", samePattern: false }
    ],
    scalingExerciseId: "dumbbell-romanian-deadlift",
    fatigueTags: ["spinal_loading"]
  },
  {
    id: "barbell-romanian-deadlift",
    name: "Barbell Romanian Deadlift",
    patterns: ["hinge"],
    primaryMuscles: ["hamstrings", "posterior_chain"],
    secondaryMuscles: ["glutes"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Soft knees, push hips back", "Bar stays close to the legs", "Stop when hamstrings are fully loaded, not when back rounds"],
    videoPlaceholder: px("barbell-romanian-deadlift"),
    substitutions: [
      { exerciseId: "dumbbell-romanian-deadlift", reason: "No barbell available", samePattern: true },
      { exerciseId: "leg-curl-machine", reason: "Isolate hamstrings without spinal loading", samePattern: false }
    ],
    fatigueTags: ["spinal_loading"]
  },
  {
    id: "barbell-bench-press",
    name: "Barbell Bench Press",
    patterns: ["horizontal_push"],
    primaryMuscles: ["chest"],
    secondaryMuscles: ["arms", "shoulders"],
    equipment: ["barbell", "adjustable_bench"],
    locations: [...FULL_HOME],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Shoulder blades pulled together and down", "Bar path over the wrists", "Drive feet into the floor for leg drive"],
    videoPlaceholder: px("barbell-bench-press"),
    substitutions: [
      { exerciseId: "dumbbell-bench-press", reason: "No barbell available, or want independent-arm stability work", samePattern: true },
      { exerciseId: "push-up", reason: "No equipment available", samePattern: true }
    ],
    scalingExerciseId: "push-up",
    fatigueTags: ["shoulder_intensive"]
  },
  {
    id: "barbell-overhead-press",
    name: "Barbell Overhead Press",
    patterns: ["vertical_push"],
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["arms", "core"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Brace the core, ribs down", "Bar path close to the face", "Finish with the bar stacked over the shoulder"],
    videoPlaceholder: px("barbell-overhead-press"),
    substitutions: [
      { exerciseId: "dumbbell-shoulder-press", reason: "No barbell available", samePattern: true },
      { exerciseId: "barbell-push-press", reason: "Add leg drive if shoulders are the limiter", samePattern: true }
    ],
    progressionExerciseId: "barbell-push-press",
    fatigueTags: ["shoulder_intensive"]
  },
  {
    id: "barbell-push-press",
    name: "Barbell Push Press",
    patterns: ["vertical_push"],
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["quads", "core"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["Short, vertical dip", "Drive up through the legs, then press", "Lock out overhead, ribs down"],
    videoPlaceholder: px("barbell-push-press"),
    substitutions: [
      { exerciseId: "barbell-overhead-press", reason: "Remove the leg-drive/timing skill demand", samePattern: true },
      { exerciseId: "dumbbell-shoulder-press", reason: "No barbell available", samePattern: false }
    ],
    scalingExerciseId: "barbell-overhead-press",
    fatigueTags: ["shoulder_intensive"]
  },
  {
    id: "barbell-bent-over-row",
    name: "Barbell Bent-Over Row",
    patterns: ["horizontal_pull"],
    primaryMuscles: ["back_lats"],
    secondaryMuscles: ["upper_back_scapular", "arms"],
    equipment: ["barbell"],
    locations: [...FULL_HOME],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Hinge to roughly 45 degrees, flat back", "Pull the bar to the lower ribs", "Avoid using momentum from the lower back"],
    videoPlaceholder: px("barbell-bent-over-row"),
    substitutions: [
      { exerciseId: "dumbbell-row", reason: "No barbell available, or want unilateral loading", samePattern: true },
      { exerciseId: "cable-row-seated", reason: "Remove the hip-hinge spinal-loading component", samePattern: true }
    ],
    fatigueTags: ["spinal_loading"]
  },
  {
    id: "barbell-hip-thrust",
    name: "Barbell Hip Thrust",
    patterns: ["hinge"],
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: ["barbell", "adjustable_bench"],
    locations: [...FULL_HOME],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Upper back on the bench, bar over the hips", "Drive through heels, squeeze glutes at the top", "Avoid over-extending the lower back"],
    videoPlaceholder: px("barbell-hip-thrust"),
    substitutions: [
      { exerciseId: "glute-bridge-march", reason: "No barbell available", samePattern: true },
      { exerciseId: "dumbbell-romanian-deadlift", reason: "Alternative posterior-chain/glute emphasis", samePattern: false }
    ]
  },

  // ---------- Dumbbell / kettlebell ----------
  {
    id: "dumbbell-bench-press",
    name: "Dumbbell Bench Press",
    patterns: ["horizontal_push"],
    primaryMuscles: ["chest"],
    secondaryMuscles: ["arms", "shoulders"],
    equipment: ["dumbbells", "adjustable_bench"],
    locations: [...FULL_HOME_HOTEL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Dumbbells track over the elbows", "Full stretch at the bottom, control the descent"],
    videoPlaceholder: px("dumbbell-bench-press"),
    substitutions: [
      { exerciseId: "barbell-bench-press", reason: "Barbell available and want to load heavier", samePattern: true },
      { exerciseId: "push-up", reason: "No equipment available", samePattern: true }
    ],
    scalingExerciseId: "push-up"
  },
  {
    id: "dumbbell-row",
    name: "Dumbbell Row",
    patterns: ["horizontal_pull"],
    primaryMuscles: ["back_lats"],
    secondaryMuscles: ["upper_back_scapular", "arms"],
    equipment: ["dumbbells", "adjustable_bench"],
    locations: [...FULL_HOME_HOTEL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Flat back, brace on the bench", "Pull elbow toward the hip, not straight up"],
    videoPlaceholder: px("dumbbell-row"),
    substitutions: [
      { exerciseId: "ring-row", reason: "No dumbbells available", samePattern: true },
      { exerciseId: "cable-row-seated", reason: "Bilateral, machine-supported alternative", samePattern: true }
    ]
  },
  {
    id: "dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    patterns: ["vertical_push"],
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["arms"],
    equipment: ["dumbbells"],
    locations: [...FULL_HOME_HOTEL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Ribs down, avoid arching the low back", "Press to full lockout overhead"],
    videoPlaceholder: px("dumbbell-shoulder-press"),
    substitutions: [
      { exerciseId: "barbell-overhead-press", reason: "Barbell available and want to load heavier", samePattern: true },
      { exerciseId: "kettlebell-clean-and-press", reason: "Only kettlebells available", samePattern: false }
    ],
    fatigueTags: ["shoulder_intensive"]
  },
  {
    id: "dumbbell-goblet-squat",
    name: "Dumbbell Goblet Squat",
    patterns: ["squat"],
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["core"],
    equipment: ["dumbbells"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Hold the dumbbell at the chest", "Elbows drive between the knees at the bottom"],
    videoPlaceholder: px("dumbbell-goblet-squat"),
    substitutions: [
      { exerciseId: "air-squat", reason: "No dumbbell available", samePattern: true },
      { exerciseId: "barbell-back-squat", reason: "Barbell/rack available for heavier loading", samePattern: true }
    ],
    scalingExerciseId: "air-squat",
    progressionExerciseId: "barbell-back-squat"
  },
  {
    id: "dumbbell-walking-lunge",
    name: "Dumbbell Walking Lunge",
    patterns: ["squat"],
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hip_stability"],
    equipment: ["dumbbells"],
    locations: [...FULL_HOME_OUTDOOR],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Tall torso, controlled step length", "Back knee kisses the floor lightly"],
    videoPlaceholder: px("dumbbell-walking-lunge"),
    substitutions: [
      { exerciseId: "pistol-squat", reason: "No dumbbells, higher single-leg demand", samePattern: true },
      { exerciseId: "dumbbell-goblet-squat", reason: "Reduce single-leg balance demand", samePattern: false }
    ],
    fatigueTags: ["knee_dominant"]
  },
  {
    id: "dumbbell-romanian-deadlift",
    name: "Dumbbell Romanian Deadlift",
    patterns: ["hinge"],
    primaryMuscles: ["hamstrings", "posterior_chain"],
    secondaryMuscles: ["glutes"],
    equipment: ["dumbbells"],
    locations: [...FULL_HOME_HOTEL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Push hips back, dumbbells stay close to the shins", "Flat back throughout"],
    videoPlaceholder: px("dumbbell-romanian-deadlift"),
    substitutions: [
      { exerciseId: "barbell-romanian-deadlift", reason: "Barbell available for heavier loading", samePattern: true },
      { exerciseId: "kettlebell-swing", reason: "Dynamic hip-hinge alternative", samePattern: false }
    ]
  },
  {
    id: "dumbbell-farmers-carry",
    name: "Dumbbell Farmer's Carry",
    patterns: ["carry"],
    primaryMuscles: ["forearms_grip", "core"],
    secondaryMuscles: ["full_body"],
    equipment: ["dumbbells"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Tall posture, shoulders packed down", "Short, quick steps, brace the core"],
    videoPlaceholder: px("dumbbell-farmers-carry"),
    substitutions: [
      { exerciseId: "kettlebell-front-rack-carry", reason: "Only kettlebells available", samePattern: true },
      { exerciseId: "suitcase-carry", reason: "Add an anti-lateral-flexion challenge", samePattern: true }
    ]
  },
  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    patterns: ["hinge"],
    primaryMuscles: ["posterior_chain", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: ["kettlebells"],
    locations: [...ANYWHERE],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["Hike the bell back like a hinge, not a squat", "Snap the hips to project the bell to chest height", "Let the arms float, don't muscle it up"],
    videoPlaceholder: px("kettlebell-swing"),
    substitutions: [
      { exerciseId: "dumbbell-romanian-deadlift", reason: "No kettlebell available, removes the ballistic component", samePattern: true },
      { exerciseId: "barbell-hip-thrust", reason: "Isolate hip extension without the ballistic timing", samePattern: false }
    ]
  },
  {
    id: "kettlebell-clean-and-press",
    name: "Kettlebell Clean and Press",
    patterns: ["vertical_push"],
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["posterior_chain", "core"],
    equipment: ["kettlebells"],
    locations: [...ANYWHERE],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["Clean the bell to the rack with a tight elbow", "Press to lockout without leaning back"],
    videoPlaceholder: px("kettlebell-clean-and-press"),
    substitutions: [
      { exerciseId: "dumbbell-shoulder-press", reason: "Isolate the press, remove the clean", samePattern: false },
      { exerciseId: "kettlebell-swing", reason: "Lower-skill hip-power alternative", samePattern: false }
    ],
    fatigueTags: ["shoulder_intensive"]
  },
  {
    id: "kettlebell-turkish-get-up",
    name: "Kettlebell Turkish Get-up",
    patterns: ["rotation_anti_rotation"],
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "hip_stability"],
    equipment: ["kettlebells"],
    locations: [...ANYWHERE],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: true,
    cues: ["Eyes on the bell the entire rep", "Move through each checkpoint deliberately", "Stack joints directly under the bell at lockout"],
    videoPlaceholder: px("kettlebell-turkish-get-up"),
    substitutions: [
      { exerciseId: "pallof-press", reason: "Lower-skill anti-rotation core alternative", samePattern: false },
      { exerciseId: "hollow-hold", reason: "No kettlebell available", samePattern: false }
    ],
    fatigueTags: ["gymnastics_skill", "shoulder_intensive"]
  },
  {
    id: "kettlebell-front-rack-carry",
    name: "Kettlebell Front Rack Carry",
    patterns: ["carry"],
    primaryMuscles: ["core", "forearms_grip"],
    secondaryMuscles: ["upper_back_scapular"],
    equipment: ["kettlebells"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Elbow pinned to the ribs", "Tall posture, brace like taking a punch"],
    videoPlaceholder: px("kettlebell-front-rack-carry"),
    substitutions: [
      { exerciseId: "dumbbell-farmers-carry", reason: "Only dumbbells available", samePattern: true },
      { exerciseId: "suitcase-carry", reason: "Simpler single-side grip carry", samePattern: true }
    ]
  },

  // ---------- Bodyweight / gymnastics ----------
  {
    id: "push-up",
    name: "Push-up",
    patterns: ["horizontal_push"],
    primaryMuscles: ["chest"],
    secondaryMuscles: ["arms", "core"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Straight line from shoulders to ankles", "Elbows at roughly 45 degrees, full range to the chest"],
    videoPlaceholder: px("push-up"),
    substitutions: [
      { exerciseId: "dumbbell-bench-press", reason: "Dumbbells available for external loading", samePattern: true },
      { exerciseId: "bar-dip", reason: "Dip station available for more triceps/chest overload", samePattern: false }
    ],
    progressionExerciseId: "bar-dip"
  },
  {
    id: "pull-up",
    name: "Pull-up",
    patterns: ["vertical_pull"],
    primaryMuscles: ["back_lats"],
    secondaryMuscles: ["arms", "forearms_grip"],
    equipment: ["pull_up_bar"],
    locations: [...FULL_HOME_OUTDOOR],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Start from a dead hang", "Pull the chest to the bar, avoid excessive kipping unless prescribed"],
    videoPlaceholder: px("pull-up"),
    substitutions: [
      { exerciseId: "band-assisted-pull-up", reason: "Not yet strong enough for strict reps", samePattern: true },
      { exerciseId: "lat-pulldown", reason: "No pull-up bar available, or machine-supported alternative", samePattern: true }
    ],
    scalingExerciseId: "band-assisted-pull-up",
    progressionExerciseId: "muscle-up"
  },
  {
    id: "ring-row",
    name: "Ring Row",
    patterns: ["horizontal_pull"],
    primaryMuscles: ["back_lats"],
    secondaryMuscles: ["upper_back_scapular", "arms"],
    equipment: ["gymnastic_rings"],
    locations: [...FULL_HOME_OUTDOOR],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Body straight, heels planted", "Pull chest to the rings, squeeze the shoulder blades"],
    videoPlaceholder: px("ring-row"),
    substitutions: [
      { exerciseId: "dumbbell-row", reason: "No rings available", samePattern: true },
      { exerciseId: "cable-row-seated", reason: "Machine-supported alternative", samePattern: true }
    ],
    scalingExerciseId: "dumbbell-row"
  },
  {
    id: "ring-dip",
    name: "Ring Dip",
    patterns: ["horizontal_push"],
    primaryMuscles: ["chest"],
    secondaryMuscles: ["arms", "shoulders"],
    equipment: ["gymnastic_rings"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: false,
    cues: ["Turn the rings out at the bottom", "Control the descent, avoid crashing the shoulders"],
    videoPlaceholder: px("ring-dip"),
    substitutions: [
      { exerciseId: "bar-dip", reason: "No rings, more stable dip station alternative", samePattern: true },
      { exerciseId: "push-up", reason: "Reduce shoulder-stability demand", samePattern: true }
    ],
    scalingExerciseId: "bar-dip",
    fatigueTags: ["gymnastics_skill", "shoulder_intensive"]
  },
  {
    id: "bar-dip",
    name: "Bar Dip",
    patterns: ["horizontal_push"],
    primaryMuscles: ["chest"],
    secondaryMuscles: ["arms", "shoulders"],
    equipment: ["dip_station"],
    locations: [...FULL_HOME],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Slight forward lean for chest emphasis", "Lower until shoulders are level with elbows"],
    videoPlaceholder: px("bar-dip"),
    substitutions: [
      { exerciseId: "push-up", reason: "No dip station available", samePattern: true },
      { exerciseId: "ring-dip", reason: "Rings available for more instability challenge", samePattern: true }
    ],
    scalingExerciseId: "push-up",
    fatigueTags: ["shoulder_intensive"]
  },
  {
    id: "muscle-up",
    name: "Muscle-up",
    patterns: ["vertical_pull"],
    primaryMuscles: ["back_lats"],
    secondaryMuscles: ["chest", "arms"],
    equipment: ["gymnastic_rings"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: false,
    cues: ["Aggressive pull with an early transition over the rings", "Keep the rings close to the body through the transition"],
    videoPlaceholder: px("muscle-up"),
    substitutions: [
      { exerciseId: "pull-up", reason: "Not yet proficient with the transition", samePattern: true },
      { exerciseId: "ring-dip", reason: "Isolate the dip portion only", samePattern: false }
    ],
    scalingExerciseId: "pull-up",
    fatigueTags: ["gymnastics_skill", "shoulder_intensive"]
  },
  {
    id: "handstand-push-up",
    name: "Handstand Push-up",
    patterns: ["vertical_push"],
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["arms", "core"],
    equipment: ["bodyweight_only"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: false,
    cues: ["Stack wrists under shoulders against the wall", "Control the descent to a light head-touch", "Press back to full lockout"],
    videoPlaceholder: px("handstand-push-up"),
    substitutions: [
      { exerciseId: "dumbbell-shoulder-press", reason: "Not yet proficient inverted, or fatigued", samePattern: false },
      { exerciseId: "barbell-overhead-press", reason: "Barbell available, reduce balance demand", samePattern: false }
    ],
    scalingExerciseId: "dumbbell-shoulder-press",
    fatigueTags: ["gymnastics_skill", "shoulder_intensive"]
  },
  {
    id: "pistol-squat",
    name: "Pistol Squat",
    patterns: ["squat"],
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hip_stability", "core"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "advanced",
    isCompound: true,
    isTechnical: true,
    loadable: false,
    cues: ["Extend the free leg forward for balance", "Sit back and down under control", "Drive through the full foot to stand"],
    videoPlaceholder: px("pistol-squat"),
    substitutions: [
      { exerciseId: "dumbbell-walking-lunge", reason: "Not yet proficient with single-leg balance", samePattern: true },
      { exerciseId: "dumbbell-goblet-squat", reason: "Bilateral alternative with similar loading", samePattern: false }
    ],
    scalingExerciseId: "dumbbell-walking-lunge",
    fatigueTags: ["gymnastics_skill", "knee_dominant"]
  },
  {
    id: "air-squat",
    name: "Air Squat",
    patterns: ["squat"],
    primaryMuscles: ["quads", "glutes"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Hips back and down, chest tall", "Full depth, hip crease below the knee"],
    videoPlaceholder: px("air-squat"),
    substitutions: [
      { exerciseId: "dumbbell-goblet-squat", reason: "Add external load if available", samePattern: true },
      { exerciseId: "barbell-back-squat", reason: "Barbell/rack available for heavier loading", samePattern: true }
    ],
    progressionExerciseId: "dumbbell-goblet-squat"
  },
  {
    id: "burpee",
    name: "Burpee",
    patterns: ["locomotion"],
    primaryMuscles: ["full_body"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Chest and hips touch the floor together", "Stand fully to lockout, jump optional at the top"],
    videoPlaceholder: px("burpee"),
    substitutions: [
      { exerciseId: "mountain-climbers", reason: "Lower-impact conditioning alternative", samePattern: false },
      { exerciseId: "row-erg", reason: "Machine-based conditioning alternative", samePattern: false }
    ],
    fatigueTags: ["high_impact"]
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    patterns: ["locomotion"],
    primaryMuscles: ["core"],
    secondaryMuscles: ["full_body"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Hips stay low and level", "Quick, controlled knee drives, avoid bouncing the hips up"],
    videoPlaceholder: px("mountain-climbers"),
    substitutions: [
      { exerciseId: "burpee", reason: "Higher-intensity full-body alternative", samePattern: false },
      { exerciseId: "hollow-hold", reason: "Lower-impact core alternative", samePattern: false }
    ]
  },
  {
    id: "hollow-hold",
    name: "Hollow Hold",
    patterns: ["rotation_anti_rotation"],
    primaryMuscles: ["core"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "intermediate",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Low back pressed into the floor", "Arms and legs extended only as far as position allows"],
    videoPlaceholder: px("hollow-hold"),
    substitutions: [
      { exerciseId: "dead-bug", reason: "More beginner-friendly regression", samePattern: true },
      { exerciseId: "pallof-press", reason: "Anti-rotation alternative if bands/cable available", samePattern: false }
    ],
    scalingExerciseId: "dead-bug"
  },

  // ---------- Cable / machine ----------
  {
    id: "cable-row-seated",
    name: "Seated Cable Row",
    patterns: ["horizontal_pull"],
    primaryMuscles: ["back_lats"],
    secondaryMuscles: ["upper_back_scapular", "arms"],
    equipment: ["cable_machine"],
    locations: [...FULL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Chest tall, slight lean back at the finish only", "Pull to the lower ribs, squeeze the shoulder blades"],
    videoPlaceholder: px("cable-row-seated"),
    substitutions: [
      { exerciseId: "dumbbell-row", reason: "No cable machine available", samePattern: true },
      { exerciseId: "ring-row", reason: "No equipment available", samePattern: true }
    ]
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    patterns: ["vertical_pull"],
    primaryMuscles: ["back_lats"],
    secondaryMuscles: ["arms"],
    equipment: ["cable_machine"],
    locations: [...FULL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Pull to the upper chest, avoid leaning back excessively", "Control the return to full stretch"],
    videoPlaceholder: px("lat-pulldown"),
    substitutions: [
      { exerciseId: "band-assisted-pull-up", reason: "No cable machine available", samePattern: true },
      { exerciseId: "pull-up", reason: "Pull-up bar available for a harder bodyweight variant", samePattern: true }
    ],
    scalingExerciseId: "band-assisted-pull-up",
    progressionExerciseId: "pull-up"
  },
  {
    id: "leg-press",
    name: "Leg Press",
    patterns: ["squat"],
    primaryMuscles: ["quads", "glutes"],
    equipment: ["machines"],
    locations: [...FULL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Feet mid-platform, shoulder width", "Full range without the low back rounding off the pad"],
    videoPlaceholder: px("leg-press"),
    substitutions: [
      { exerciseId: "dumbbell-goblet-squat", reason: "No leg press machine available", samePattern: true },
      { exerciseId: "barbell-back-squat", reason: "Barbell/rack available and more spinal loading is acceptable", samePattern: true }
    ]
  },
  {
    id: "leg-curl-machine",
    name: "Machine Leg Curl",
    patterns: ["isolation"],
    primaryMuscles: ["hamstrings"],
    equipment: ["machines"],
    locations: [...FULL],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: true,
    cues: ["Control both the lift and the lowering phase", "Avoid hips lifting off the pad"],
    videoPlaceholder: px("leg-curl-machine"),
    substitutions: [
      { exerciseId: "barbell-romanian-deadlift", reason: "No machine available", samePattern: false },
      { exerciseId: "dumbbell-romanian-deadlift", reason: "No machine available", samePattern: false }
    ]
  },
  {
    id: "cable-woodchop",
    name: "Cable Woodchop",
    patterns: ["rotation_anti_rotation"],
    primaryMuscles: ["core"],
    equipment: ["cable_machine"],
    locations: [...FULL],
    difficulty: "intermediate",
    isCompound: false,
    isTechnical: false,
    loadable: true,
    cues: ["Rotate from the hips and torso together", "Arms stay relatively straight, control the return"],
    videoPlaceholder: px("cable-woodchop"),
    substitutions: [
      { exerciseId: "pallof-press", reason: "No cable machine available, band alternative", samePattern: false },
      { exerciseId: "kettlebell-turkish-get-up", reason: "Different anti-rotation loading pattern", samePattern: false }
    ]
  },
  {
    id: "face-pull-cable",
    name: "Cable Face Pull",
    patterns: ["horizontal_pull"],
    primaryMuscles: ["upper_back_scapular"],
    secondaryMuscles: ["shoulders"],
    equipment: ["cable_machine"],
    locations: [...FULL],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: true,
    cues: ["Pull to eye level, lead with the elbows high", "Externally rotate at the end range"],
    videoPlaceholder: px("face-pull-cable"),
    substitutions: [
      { exerciseId: "band-pull-apart", reason: "No cable machine available", samePattern: true },
      { exerciseId: "ring-row", reason: "Scapular-focused alternative with a wide grip", samePattern: false }
    ]
  },
  {
    id: "dumbbell-bicep-curl",
    name: "Dumbbell Bicep Curl",
    patterns: ["isolation"],
    primaryMuscles: ["arms"],
    equipment: ["dumbbells"],
    locations: [...FULL_HOME_HOTEL],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: true,
    cues: ["Elbows pinned to the ribs", "Full range, avoid swinging the torso"],
    videoPlaceholder: px("dumbbell-bicep-curl"),
    substitutions: [
      { exerciseId: "resistance-band-bicep-curl", reason: "No dumbbells available", samePattern: true },
      { exerciseId: "pull-up", reason: "Compound alternative that also loads the biceps", samePattern: false }
    ]
  },
  {
    id: "resistance-band-bicep-curl",
    name: "Resistance Band Bicep Curl",
    patterns: ["isolation"],
    primaryMuscles: ["arms"],
    equipment: ["resistance_bands"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Step on the band to set tension", "Control the eccentric, don't let the band snap back"],
    videoPlaceholder: px("resistance-band-bicep-curl"),
    substitutions: [
      { exerciseId: "dumbbell-bicep-curl", reason: "Dumbbells available for more precise loading", samePattern: true },
      { exerciseId: "pull-up", reason: "No bands available, compound alternative that also loads the biceps", samePattern: false }
    ]
  },
  {
    id: "cable-triceps-pushdown",
    name: "Cable Triceps Pushdown",
    patterns: ["isolation"],
    primaryMuscles: ["arms"],
    equipment: ["cable_machine"],
    locations: [...FULL],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: true,
    cues: ["Elbows pinned at the sides", "Full lockout without shifting the shoulders forward"],
    videoPlaceholder: px("cable-triceps-pushdown"),
    substitutions: [
      { exerciseId: "bar-dip", reason: "No cable machine available, compound alternative", samePattern: false },
      { exerciseId: "push-up", reason: "No equipment available", samePattern: false }
    ]
  },

  // ---------- Bands ----------
  {
    id: "band-pull-apart",
    name: "Band Pull-Apart",
    patterns: ["horizontal_pull"],
    primaryMuscles: ["upper_back_scapular"],
    secondaryMuscles: ["shoulders"],
    equipment: ["resistance_bands"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Arms straight, pull the band apart to the chest", "Squeeze the shoulder blades at full extension"],
    videoPlaceholder: px("band-pull-apart"),
    substitutions: [
      { exerciseId: "face-pull-cable", reason: "Cable machine available", samePattern: true },
      { exerciseId: "ring-row", reason: "Rings available for a loaded pulling alternative", samePattern: false }
    ]
  },
  {
    id: "band-assisted-pull-up",
    name: "Band-Assisted Pull-up",
    patterns: ["vertical_pull"],
    primaryMuscles: ["back_lats"],
    secondaryMuscles: ["arms"],
    equipment: ["resistance_bands", "pull_up_bar"],
    locations: [...FULL_HOME_OUTDOOR],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Band anchored above, foot or knee in the loop", "Same pulling mechanics as a strict pull-up"],
    videoPlaceholder: px("band-assisted-pull-up"),
    substitutions: [
      { exerciseId: "lat-pulldown", reason: "No band/bar available, machine alternative", samePattern: true },
      { exerciseId: "ring-row", reason: "No band available", samePattern: false }
    ],
    progressionExerciseId: "pull-up"
  },

  // ---------- Conditioning / monostructural ----------
  {
    id: "row-erg",
    name: "Row Erg",
    patterns: ["locomotion"],
    primaryMuscles: ["full_body"],
    equipment: ["row_erg"],
    locations: [...FULL_HOME_HOTEL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Legs, then hips, then arms on the drive", "Arms, then hips, then legs on the recovery"],
    videoPlaceholder: px("row-erg"),
    substitutions: [
      { exerciseId: "ski-erg", reason: "No rower available", samePattern: false },
      { exerciseId: "assault-bike", reason: "No rower available", samePattern: false }
    ]
  },
  {
    id: "ski-erg",
    name: "Ski Erg",
    patterns: ["locomotion"],
    primaryMuscles: ["full_body"],
    secondaryMuscles: ["back_lats", "core"],
    equipment: ["ski_erg"],
    locations: [...FULL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Hinge from the hips to drive the handles down", "Full lat engagement, not just arms"],
    videoPlaceholder: px("ski-erg"),
    substitutions: [
      { exerciseId: "row-erg", reason: "No ski erg available", samePattern: false },
      { exerciseId: "battle-ropes-wave", reason: "No erg machines available", samePattern: false }
    ]
  },
  {
    id: "assault-bike",
    name: "Assault Bike",
    patterns: ["locomotion"],
    primaryMuscles: ["full_body"],
    equipment: ["assault_bike"],
    locations: [...FULL_HOME_HOTEL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Drive evenly through arms and legs", "Pace conservatively — effort scales fast with speed"],
    videoPlaceholder: px("assault-bike"),
    substitutions: [
      { exerciseId: "row-erg", reason: "No assault bike available", samePattern: false },
      { exerciseId: "standard-bike-steady", reason: "Lower-impact steady-state alternative", samePattern: false }
    ]
  },
  {
    id: "treadmill-run",
    name: "Treadmill Run",
    patterns: ["locomotion"],
    primaryMuscles: ["full_body"],
    secondaryMuscles: ["quads", "calves_tibialis"],
    equipment: ["treadmill"],
    locations: [...FULL_HOME_HOTEL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Relaxed shoulders, quick cadence", "Land under the hips, not out in front"],
    videoPlaceholder: px("treadmill-run"),
    substitutions: [
      { exerciseId: "outdoor-run", reason: "Outdoor space available", samePattern: true },
      { exerciseId: "standard-bike-steady", reason: "Lower-impact alternative", samePattern: false }
    ]
  },
  {
    id: "outdoor-run",
    name: "Outdoor Run",
    patterns: ["locomotion"],
    primaryMuscles: ["full_body"],
    secondaryMuscles: ["quads", "calves_tibialis"],
    equipment: ["bodyweight_only"],
    locations: ["outdoor"],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Settle into a conversational pace for aerobic work", "Relaxed arm swing, quick light steps"],
    videoPlaceholder: px("outdoor-run"),
    substitutions: [
      { exerciseId: "treadmill-run", reason: "No outdoor space available", samePattern: true },
      { exerciseId: "row-erg", reason: "No running surface available", samePattern: false }
    ]
  },
  {
    id: "standard-bike-steady",
    name: "Stationary Bike (Steady State)",
    patterns: ["locomotion"],
    primaryMuscles: ["quads"],
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: ["standard_bike"],
    locations: [...FULL_HOME_HOTEL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Slight bend in the knee at full extension", "Steady, sustainable cadence"],
    videoPlaceholder: px("standard-bike-steady"),
    substitutions: [
      { exerciseId: "row-erg", reason: "No bike available", samePattern: false },
      { exerciseId: "outdoor-run", reason: "No bike available", samePattern: false }
    ]
  },
  {
    id: "sled-push",
    name: "Sled Push",
    patterns: ["locomotion"],
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["core"],
    equipment: ["sled"],
    locations: [...FULL],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Shoulders over the handles, drive through the whole foot", "Short, powerful steps, stay low"],
    videoPlaceholder: px("sled-push"),
    substitutions: [
      { exerciseId: "dumbbell-walking-lunge", reason: "No sled available", samePattern: false },
      { exerciseId: "assault-bike", reason: "No sled available, similar high-output conditioning", samePattern: false }
    ],
    fatigueTags: ["knee_dominant"]
  },
  {
    id: "wall-ball",
    name: "Wall Ball",
    patterns: ["squat"],
    primaryMuscles: ["quads", "shoulders"],
    secondaryMuscles: ["glutes", "core"],
    equipment: ["medicine_ball"],
    locations: [...FULL],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Full-depth squat, drive up and throw in one motion", "Hit the target consistently, catch and rebend"],
    videoPlaceholder: px("wall-ball"),
    substitutions: [
      { exerciseId: "dumbbell-goblet-squat", reason: "No medicine ball/target available", samePattern: true },
      { exerciseId: "medicine-ball-slam", reason: "No wall/target available", samePattern: false }
    ],
    fatigueTags: ["knee_dominant"]
  },
  {
    id: "medicine-ball-slam",
    name: "Medicine Ball Slam",
    patterns: ["hinge"],
    primaryMuscles: ["core"],
    secondaryMuscles: ["posterior_chain", "shoulders"],
    equipment: ["medicine_ball"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Reach tall, then slam with full-body extension", "Hinge to pick the ball back up, don't round the back"],
    videoPlaceholder: px("medicine-ball-slam"),
    substitutions: [
      { exerciseId: "kettlebell-swing", reason: "No medicine ball available, similar power output", samePattern: false },
      { exerciseId: "battle-ropes-wave", reason: "No medicine ball available", samePattern: false }
    ]
  },
  {
    id: "battle-ropes-wave",
    name: "Battle Ropes Wave",
    patterns: ["isolation"],
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["core", "forearms_grip"],
    equipment: ["battle_ropes"],
    locations: [...FULL],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: false,
    cues: ["Athletic stance, knees soft", "Drive the waves from the shoulders, brace the core"],
    videoPlaceholder: px("battle-ropes-wave"),
    substitutions: [
      { exerciseId: "assault-bike", reason: "No battle ropes available", samePattern: false },
      { exerciseId: "medicine-ball-slam", reason: "No battle ropes available", samePattern: false }
    ]
  },
  {
    id: "box-jump",
    name: "Box Jump",
    patterns: ["locomotion"],
    primaryMuscles: ["quads", "glutes"],
    equipment: ["plyo_box"],
    locations: [...FULL],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: true,
    loadable: false,
    cues: ["Full hip and knee extension at takeoff", "Land soft with knees tracking over toes", "Step down — don't jump down"],
    videoPlaceholder: px("box-jump"),
    substitutions: [
      { exerciseId: "broad-jump", reason: "No box available", samePattern: true },
      { exerciseId: "dumbbell-goblet-squat", reason: "Remove impact/landing demand", samePattern: false }
    ],
    fatigueTags: ["high_impact", "knee_dominant"]
  },
  {
    id: "broad-jump",
    name: "Broad Jump",
    patterns: ["locomotion"],
    primaryMuscles: ["quads", "glutes"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "intermediate",
    isCompound: true,
    isTechnical: true,
    loadable: false,
    cues: ["Load the hips back before driving forward", "Stick the landing, absorb through the hips and knees"],
    videoPlaceholder: px("broad-jump"),
    substitutions: [
      { exerciseId: "box-jump", reason: "Box available for vertical jump emphasis", samePattern: true },
      { exerciseId: "kettlebell-swing", reason: "Remove landing/impact demand", samePattern: false }
    ],
    fatigueTags: ["high_impact", "knee_dominant"]
  },

  // ---------- Carries / core / prehab ----------
  {
    id: "suitcase-carry",
    name: "Suitcase Carry",
    patterns: ["carry"],
    primaryMuscles: ["core", "forearms_grip"],
    secondaryMuscles: ["hip_stability"],
    equipment: ["dumbbells"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: true,
    isTechnical: false,
    loadable: true,
    cues: ["Resist leaning toward the loaded side", "Tall posture, brace the obliques"],
    videoPlaceholder: px("suitcase-carry"),
    substitutions: [
      { exerciseId: "kettlebell-front-rack-carry", reason: "Bilateral carry alternative", samePattern: false },
      { exerciseId: "pallof-press", reason: "No weight available for carries", samePattern: false }
    ]
  },
  {
    id: "pallof-press",
    name: "Pallof Press",
    patterns: ["rotation_anti_rotation"],
    primaryMuscles: ["core"],
    equipment: ["resistance_bands"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Band anchored to the side, press straight out", "Resist rotation toward the anchor point"],
    videoPlaceholder: px("pallof-press"),
    substitutions: [
      { exerciseId: "cable-woodchop", reason: "Cable machine available", samePattern: false },
      { exerciseId: "hollow-hold", reason: "No band/cable available", samePattern: false }
    ]
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    patterns: ["rotation_anti_rotation"],
    primaryMuscles: ["core"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Low back stays pressed into the floor", "Extend opposite arm and leg slowly, no arching"],
    videoPlaceholder: px("dead-bug"),
    substitutions: [
      { exerciseId: "hollow-hold", reason: "Static alternative with similar demand", samePattern: true },
      { exerciseId: "bird-dog", reason: "Loaded-spine-neutral alternative", samePattern: true }
    ],
    progressionExerciseId: "hollow-hold"
  },
  {
    id: "copenhagen-plank",
    name: "Copenhagen Plank",
    patterns: ["isolation"],
    primaryMuscles: ["hip_stability"],
    secondaryMuscles: ["core"],
    equipment: ["adjustable_bench"],
    locations: [...FULL_HOME],
    difficulty: "advanced",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Top leg on the bench, bottom leg free", "Lift the hips level, keep the body in one line"],
    videoPlaceholder: px("copenhagen-plank"),
    substitutions: [
      { exerciseId: "glute-bridge-march", reason: "Lower-difficulty hip-stability regression", samePattern: false },
      { exerciseId: "bird-dog", reason: "Lower-difficulty alternative, no bench needed", samePattern: false }
    ]
  },
  {
    id: "tibialis-raise",
    name: "Tibialis Raise",
    patterns: ["isolation"],
    primaryMuscles: ["calves_tibialis"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Lean back against a wall, heels planted", "Lift the toes as high as possible, slow tempo"],
    videoPlaceholder: px("tibialis-raise"),
    substitutions: [
      { exerciseId: "standing-calf-raise", reason: "Trains the opposing calf muscle group", samePattern: false },
      { exerciseId: "couch-stretch", reason: "No wall space available, alternative lower-leg/ankle mobility option", samePattern: false }
    ]
  },
  {
    id: "standing-calf-raise",
    name: "Standing Calf Raise",
    patterns: ["isolation"],
    primaryMuscles: ["calves_tibialis"],
    equipment: ["dumbbells"],
    locations: [...FULL_HOME],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: true,
    cues: ["Full stretch at the bottom, pause at the top", "Slow and controlled, avoid bouncing"],
    videoPlaceholder: px("standing-calf-raise"),
    substitutions: [
      { exerciseId: "tibialis-raise", reason: "No load available, trains the opposing muscle group", samePattern: false },
      { exerciseId: "leg-press", reason: "Use the leg press machine for a loaded toe-press variation", samePattern: false }
    ]
  },

  // ---------- Cooldown / mobility / stretching ----------
  {
    id: "couch-stretch",
    name: "Couch Stretch",
    patterns: ["isolation"],
    primaryMuscles: ["quads"],
    secondaryMuscles: ["hip_stability"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Back knee down, back foot up against a wall or bench", "Squeeze the glute on the stretched side, stay tall"],
    videoPlaceholder: px("couch-stretch"),
    substitutions: [
      { exerciseId: "worlds-greatest-stretch", reason: "Broader dynamic alternative", samePattern: false },
      { exerciseId: "hamstring-floss", reason: "Alternative lower-body mobility target", samePattern: false }
    ]
  },
  {
    id: "thoracic-rotation-stretch",
    name: "Thoracic Rotation Stretch",
    patterns: ["isolation"],
    primaryMuscles: ["upper_back_scapular"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Hips stacked, rotate through the upper back only", "Follow the top hand with your eyes"],
    videoPlaceholder: px("thoracic-rotation-stretch"),
    substitutions: [
      { exerciseId: "cat-cow", reason: "Broader spinal-mobility alternative", samePattern: false },
      { exerciseId: "worlds-greatest-stretch", reason: "Broader dynamic mobility covering the same region", samePattern: false }
    ]
  },
  {
    id: "childs-pose",
    name: "Child's Pose",
    patterns: ["isolation"],
    primaryMuscles: ["back_lats"],
    secondaryMuscles: ["hip_stability"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Sit hips back toward the heels", "Reach the arms long, relax the breath"],
    videoPlaceholder: px("childs-pose"),
    substitutions: [
      { exerciseId: "cat-cow", reason: "More dynamic spinal-decompression alternative", samePattern: false },
      { exerciseId: "worlds-greatest-stretch", reason: "Broader full-body cooldown option", samePattern: false }
    ]
  },
  {
    id: "hamstring-floss",
    name: "Hamstring Floss",
    patterns: ["isolation"],
    primaryMuscles: ["hamstrings"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Strap or hand behind the thigh, knee bent", "Slowly extend and flex the knee, gentle nerve glide"],
    videoPlaceholder: px("hamstring-floss"),
    substitutions: [
      { exerciseId: "couch-stretch", reason: "Alternative lower-body mobility target", samePattern: false },
      { exerciseId: "childs-pose", reason: "Gentler posterior-chain decompression option", samePattern: false }
    ]
  },
  {
    id: "cat-cow",
    name: "Cat-Cow",
    patterns: ["isolation"],
    primaryMuscles: ["core"],
    secondaryMuscles: ["back_lats"],
    equipment: ["bodyweight_only"],
    locations: [...ANYWHERE],
    difficulty: "beginner",
    isCompound: false,
    isTechnical: false,
    loadable: false,
    cues: ["Round through the spine fully, then arch fully", "Move slowly, coordinate with the breath"],
    videoPlaceholder: px("cat-cow"),
    substitutions: [
      { exerciseId: "thoracic-rotation-stretch", reason: "Alternative spinal-mobility drill", samePattern: false },
      { exerciseId: "childs-pose", reason: "Static alternative for spinal decompression", samePattern: false }
    ]
  }
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
