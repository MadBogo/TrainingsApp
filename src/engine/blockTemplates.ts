import type { BlockFormat, BlockRole, Intensity, SessionDurationMin, TrainingStyle } from "@/domain";

export type StyleFamily = "single_block" | "strength" | "metcon" | "skill";

const STYLE_FAMILY: Record<TrainingStyle, StyleFamily> = {
  regenerative: "single_block",
  mobility: "single_block",
  stretching: "single_block",
  zone2: "single_block",
  running_endurance: "single_block",
  strength: "strength",
  hypertrophy: "strength",
  power: "strength",
  functional_fitness: "metcon",
  hiit: "metcon",
  mixed_balanced: "metcon",
  olympic_lifting: "skill"
};

export function getStyleFamily(style: TrainingStyle): StyleFamily {
  return STYLE_FAMILY[style];
}

/** Whether the "main" block in a single_block session should be conditioning (steady effort) vs low-load mobility work. */
export function isConditioningLedStyle(style: TrainingStyle): boolean {
  return style === "zone2" || style === "running_endurance";
}

export interface BlockSlotPlan {
  role: BlockRole;
  timeCapMin: number;
}

const TEMPLATES: Record<StyleFamily, Record<SessionDurationMin, BlockSlotPlan[]>> = {
  single_block: {
    15: [{ role: "warmup", timeCapMin: 3 }, { role: "accessory", timeCapMin: 12 }],
    20: [{ role: "warmup", timeCapMin: 4 }, { role: "accessory", timeCapMin: 15 }, { role: "cooldown", timeCapMin: 1 }],
    30: [{ role: "warmup", timeCapMin: 5 }, { role: "accessory", timeCapMin: 22 }, { role: "cooldown", timeCapMin: 3 }],
    45: [{ role: "warmup", timeCapMin: 6 }, { role: "accessory", timeCapMin: 33 }, { role: "cooldown", timeCapMin: 6 }],
    60: [{ role: "warmup", timeCapMin: 8 }, { role: "accessory", timeCapMin: 44 }, { role: "cooldown", timeCapMin: 8 }]
  },
  strength: {
    15: [{ role: "warmup", timeCapMin: 3 }, { role: "strength", timeCapMin: 12 }],
    20: [{ role: "warmup", timeCapMin: 4 }, { role: "strength", timeCapMin: 16 }],
    30: [{ role: "warmup", timeCapMin: 5 }, { role: "strength", timeCapMin: 18 }, { role: "secondary", timeCapMin: 7 }],
    45: [
      { role: "warmup", timeCapMin: 6 },
      { role: "strength", timeCapMin: 20 },
      { role: "secondary", timeCapMin: 12 },
      { role: "accessory", timeCapMin: 7 }
    ],
    60: [
      { role: "warmup", timeCapMin: 7 },
      { role: "strength", timeCapMin: 22 },
      { role: "secondary", timeCapMin: 16 },
      { role: "accessory", timeCapMin: 10 },
      { role: "cooldown", timeCapMin: 5 }
    ]
  },
  metcon: {
    15: [{ role: "warmup", timeCapMin: 3 }, { role: "conditioning", timeCapMin: 12 }],
    20: [{ role: "warmup", timeCapMin: 4 }, { role: "conditioning", timeCapMin: 16 }],
    30: [{ role: "warmup", timeCapMin: 5 }, { role: "strength", timeCapMin: 10 }, { role: "conditioning", timeCapMin: 15 }],
    45: [
      { role: "warmup", timeCapMin: 6 },
      { role: "strength", timeCapMin: 14 },
      { role: "conditioning", timeCapMin: 18 },
      { role: "accessory", timeCapMin: 7 }
    ],
    60: [
      { role: "warmup", timeCapMin: 7 },
      { role: "skill", timeCapMin: 8 },
      { role: "strength", timeCapMin: 15 },
      { role: "conditioning", timeCapMin: 20 },
      { role: "accessory", timeCapMin: 10 }
    ]
  },
  skill: {
    15: [{ role: "warmup", timeCapMin: 4 }, { role: "skill", timeCapMin: 11 }],
    20: [{ role: "warmup", timeCapMin: 5 }, { role: "skill", timeCapMin: 15 }],
    30: [{ role: "warmup", timeCapMin: 6 }, { role: "skill", timeCapMin: 20 }, { role: "accessory", timeCapMin: 4 }],
    45: [
      { role: "warmup", timeCapMin: 7 },
      { role: "skill", timeCapMin: 28 },
      { role: "accessory", timeCapMin: 7 },
      { role: "cooldown", timeCapMin: 3 }
    ],
    60: [
      { role: "warmup", timeCapMin: 8 },
      { role: "skill", timeCapMin: 36 },
      { role: "accessory", timeCapMin: 10 },
      { role: "cooldown", timeCapMin: 6 }
    ]
  }
};

export function getBlockPlan(style: TrainingStyle, durationMin: SessionDurationMin): BlockSlotPlan[] {
  return TEMPLATES[getStyleFamily(style)][durationMin];
}

export function deriveFormat(role: BlockRole, style: TrainingStyle, intensity: Intensity): BlockFormat {
  if (role === "warmup" || role === "cooldown") return "duration";
  if (role === "skill") return style === "olympic_lifting" ? "complex" : "sets_reps";
  if (role === "strength" || role === "secondary") return "sets_reps";
  if (role === "accessory") {
    return getStyleFamily(style) === "single_block" ? "duration" : "sets_reps";
  }
  // conditioning
  if (style === "hiit") return "interval";
  if (style === "zone2" || style === "running_endurance") {
    return intensity === "hard" || intensity === "very_hard" ? "interval" : "duration";
  }
  if (intensity === "hard" || intensity === "very_hard") return "for_time";
  if (intensity === "recovery" || intensity === "light") return "emom";
  return "amrap";
}
