import type { Intensity } from "@/domain";

export interface IntensityProfile {
  intensity: Intensity;
  label: string;
  plainEnglish: string;
  rpeRange: [number, number];
  rirRange?: [number, number];
  percentOneRmRange?: [number, number];
  restSecRange: [number, number];
  conditioningPace: string;
}

/**
 * The engine's single source of truth for translating a chosen intensity into technical
 * targets (RPE/RIR/%1RM/rest/pace). Loading calculations and the session-builder UI both
 * read from this table so the numbers shown to the athlete always match what the generator
 * actually uses.
 */
export const INTENSITY_PROFILES: Record<Intensity, IntensityProfile> = {
  recovery: {
    intensity: "recovery",
    label: "Recovery",
    plainEnglish: "Easy effort, fully conversational — prioritizes blood flow and recovery over load.",
    rpeRange: [2, 4],
    rirRange: [6, 8],
    percentOneRmRange: [40, 50],
    restSecRange: [30, 60],
    conditioningPace: "Very easy, well below anything that raises breathing rate significantly."
  },
  light: {
    intensity: "light",
    label: "Light",
    plainEnglish: "Comfortable working effort — you could do several more reps than prescribed.",
    rpeRange: [4, 5],
    rirRange: [5, 6],
    percentOneRmRange: [50, 65],
    restSecRange: [60, 90],
    conditioningPace: "Steady, comfortably sustainable pace."
  },
  moderate: {
    intensity: "moderate",
    label: "Moderate",
    plainEnglish: "Challenging but controlled — a couple of clean reps left in reserve on strength work.",
    rpeRange: [6, 7],
    rirRange: [3, 4],
    percentOneRmRange: [65, 75],
    restSecRange: [90, 120],
    conditioningPace: "Brisk, purposeful pace that starts to bite by the end of a set."
  },
  hard: {
    intensity: "hard",
    label: "Hard",
    plainEnglish: "Near-limit strength work and an uncomfortably fast conditioning pace.",
    rpeRange: [8, 8],
    rirRange: [1, 2],
    percentOneRmRange: [75, 85],
    restSecRange: [120, 180],
    conditioningPace: "Fast, uncomfortable pace — sustainable only with real focus."
  },
  very_hard: {
    intensity: "very_hard",
    label: "Very hard",
    plainEnglish: "Maximal or near-maximal effort on every set and every conditioning interval.",
    rpeRange: [9, 10],
    rirRange: [0, 1],
    percentOneRmRange: [85, 95],
    restSecRange: [180, 240],
    conditioningPace: "All-out — unsustainable beyond short, hard bursts."
  }
};
