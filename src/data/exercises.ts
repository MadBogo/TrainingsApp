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
    description: "A light shoulder-warming drill that lubricates the joint and wakes up the rotator cuff before pressing or pulling work.",
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
    description: "A dynamic hip-mobility drill that opens up the hip through flexion, extension and rotation before loaded lower-body work.",
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
    description: "A full-body flow that stretches the posterior chain and primes the shoulders and core for the session ahead.",
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
    description: "A simple, fast way to raise heart rate and core temperature before higher-intensity work.",
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
    description: "A shoulder-mobility drill using light band tension to open up overhead range before pressing work.",
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
    description: "A multi-plane mobility flow that opens the hips, hamstrings and thoracic spine in one continuous movement.",
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
    description: "A low-load glute and core activation drill that wakes up hip extension before squatting or hinging.",
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
    description: "A core-stability drill that trains the trunk to resist rotation while the limbs move independently.",
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
    description: "A full-body explosive pull from the floor to a front-rack catch, building transferable power and rate of force development.",
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
    description: "A power clean started from mid-thigh, isolating the second pull and catch without the initial floor pull.",
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
    description: "The most technical barbell lift — a single explosive pull from the floor directly overhead into a squat catch.",
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
    description: "An overhead power movement using leg drive to send the bar overhead, then catching it in a short dip.",
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
    description: "The full two-lift combination — a clean to the shoulders followed by a jerk overhead — for total-body power under load.",
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
    description: "The foundational lower-body strength lift — a barbell on the upper back while squatting to full depth, building quads, glutes and total-body bracing strength.",
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
    description: "A more upright squat variation with the bar racked on the front delts, demanding more quad and core control than the back squat.",
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
    description: "The classic hip-hinge strength lift — pulling a loaded bar from the floor to full hip extension, and one of the best total posterior-chain builders available.",
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
    description: "A hip-hinge variation that keeps the knees mostly still, isolating the hamstrings and glutes through a controlled stretch.",
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
    description: "The benchmark horizontal press — pressing a barbell from the chest to lockout, building chest, shoulder and triceps strength.",
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
    description: "A strict vertical press from the shoulders to overhead lockout, building raw shoulder strength without any leg drive.",
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
    description: "An overhead press assisted by a short leg drive, letting you move more weight than a strict press while staying under the bar.",
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
    description: "A hip-hinged horizontal pull that builds the back and rear shoulders while demanding real trunk control under load.",
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
    description: "A glute-focused hip-extension movement performed with the upper back braced on a bench, isolating the glutes with heavy loading.",
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
    description: "A horizontal press using independent dumbbells, adding a stability demand and deeper stretch than the barbell version.",
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
    description: "A single-arm horizontal pull braced on a bench, letting each side of the back work independently.",
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
    description: "A vertical press with independent dumbbells, building shoulder strength and correcting side-to-side imbalances.",
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
    description: "A front-loaded squat holding a single dumbbell at the chest — an accessible way to load the squat pattern with minimal setup.",
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
    description: "A walking single-leg squat pattern that builds quads and glutes while challenging balance and hip stability.",
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
    description: "A dumbbell hip-hinge that stretches and loads the hamstrings without needing a barbell.",
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
    description: "A loaded carry holding a dumbbell in each hand — deceptively simple, and one of the best full-body grip and bracing builders.",
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
    description: "A ballistic hip-hinge that projects the kettlebell using explosive hip extension — a cornerstone posterior-chain power movement.",
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
    description: "A kettlebell clean into an overhead press, combining a pulling skill with a pressing strength movement in one rep.",
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
    description: "A slow, multi-stage movement from lying to standing while keeping a kettlebell locked out overhead — builds shoulder stability and total-body control.",
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
    description: "A loaded carry holding kettlebells in the front rack position, building core bracing and upper-back endurance.",
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
    description: "The classic bodyweight horizontal press — no equipment needed, and infinitely scalable by tempo, range or added load.",
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
    description: "The classic bodyweight vertical pull — hanging from a bar and pulling the chin over it, a core test of relative back and arm strength.",
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
    description: "A horizontal pull performed from rings at an adjustable angle, making it easy to scale the difficulty up or down.",
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
    description: "A horizontal/vertical press performed on unstable rings, demanding significant shoulder stability alongside chest and triceps strength.",
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
    description: "A horizontal/vertical press performed on a stable dip station, building chest and triceps strength through a deep range of motion.",
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
    description: "An advanced gymnastics skill that combines a pull-up with a dip in one continuous motion over the rings.",
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
    description: "An inverted vertical press against a wall, building serious shoulder strength and overhead body awareness.",
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
    description: "A single-leg bodyweight squat to full depth, demanding significant quad strength, balance and ankle mobility.",
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
    description: "The most basic squat pattern — bodyweight only — used to build and check squat mechanics before adding load.",
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
    description: "A full-body, ground-to-standing movement that's become the default marker of unpleasant-but-effective conditioning.",
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
    description: "A plank-based conditioning drill that combines core bracing with a quick alternating knee drive.",
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
    description: "A static core hold that trains the trunk to resist extension — a foundational gymnastics core position.",
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
    description: "A seated horizontal pull on a cable stack, letting you isolate the back with continuous tension through the whole range.",
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
    description: "A machine-assisted vertical pull that builds the same muscles as a pull-up with adjustable, scalable resistance.",
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
    description: "A machine squat pattern that loads the quads and glutes heavily without the balance or bracing demands of a free-standing squat.",
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
    description: "An isolated hamstring curl that targets the muscle directly without any hip-hinge or spinal loading.",
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
    description: "A rotational core movement pulling a cable across the body, training the trunk to generate and control rotational force.",
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
    description: "A high cable pull to face height that targets the rear shoulders and upper back — a staple for shoulder health.",
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
    description: "A straightforward elbow-flexion isolation movement for building arm size and strength.",
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
    description: "A band-based bicep isolation movement with no weights needed, useful when traveling or at home.",
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
    description: "An isolated elbow-extension movement that targets the triceps directly using constant cable tension.",
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
    description: "A light scapular-focused pulling movement using a resistance band, ideal for shoulder health and warm-ups.",
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
    description: "A pull-up variation using a looped band to offset some bodyweight, letting you build toward strict reps.",
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
    description: "A full-body, low-impact conditioning machine that builds engine capacity through a repeatable pull pattern.",
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
    description: "A standing, full-body pulling machine that emphasizes the lats and core more than the rower does.",
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
    description: "A brutal full-body conditioning machine where effort scales directly and painfully with speed.",
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
    description: "Indoor running for steady-state aerobic work or structured intervals, independent of weather or terrain.",
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
    description: "Running outside for aerobic conditioning — the simplest possible cardio option, needing no equipment at all.",
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
    description: "Low-impact steady-state cycling, ideal for aerobic base-building without pounding the joints.",
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
    description: "A ground-based pushing movement against real resistance, building leg drive and conditioning with almost no eccentric loading.",
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
    description: "A squat-to-overhead-throw combination using a medicine ball against a target — a classic conditioning triplet builder.",
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
    description: "An explosive, ground-based power movement that combines a hip hinge with an aggressive overhead slam.",
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
    description: "An upper-body and core conditioning drill using heavy rope waves, punishing on the shoulders and grip.",
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
    description: "An explosive vertical jump onto an elevated box, building lower-body power and rate of force development.",
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
    description: "A horizontal explosive jump for distance, building lower-body power without any equipment.",
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
    description: "A single-side loaded carry that forces the core to resist side-bending — a strong anti-lateral-flexion trainer.",
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
    description: "An anti-rotation core press using a band or cable, training the trunk to resist twisting rather than to create it.",
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
    description: "A floor-based core drill that trains the trunk to stay neutral while the limbs move independently.",
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
    description: "An adductor-focused side plank variation that also challenges hip and core stability.",
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
    description: "An isolated dorsiflexion movement for the front of the shin, often neglected but valuable for ankle health and running resilience.",
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
    description: "An isolated calf-raise movement building the gastrocnemius and soleus through a full range of motion.",
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
    description: "A deep hip-flexor and quad stretch performed with the back foot elevated — one of the most effective lower-body openers.",
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
    description: "A quadruped rotational drill that opens up upper-back mobility, useful after pressing or overhead work.",
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
    description: "A restful, spine-decompressing stretch that also opens the hips and lats.",
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
    description: "A gentle nerve-gliding hamstring stretch that improves flexibility without aggressive static holding.",
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
    description: "A slow spinal-mobility flow that alternates between flexion and extension, easing the whole spine.",
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
