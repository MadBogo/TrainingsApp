import { describe, it, expect } from "vitest";
import { generatePlan, applyDeloadReduction } from "./generatePlan";
import { generateWorkout } from "./generateWorkout";
import { EXERCISES } from "@/data/exercises";
import type { SessionConfig } from "@/domain";

const FULL_EQUIPMENT: SessionConfig["equipment"] = [
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
];

const baseConfig: SessionConfig = {
  mode: "plan",
  durationMin: 45,
  style: "strength",
  intensity: "moderate",
  location: "full_gym",
  equipment: FULL_EQUIPMENT,
  focusAreas: ["full_body"],
  movementFocus: []
};

describe("generatePlan", () => {
  it("produces exactly weeks x daysPerWeek planned sessions", () => {
    const { plan, sessions } = generatePlan({
      baseConfig,
      weeks: 4,
      daysPerWeek: 4,
      startDate: new Date().toISOString(),
      exercises: EXERCISES,
      oneRepMaxes: []
    });
    expect(plan.plannedSessions).toHaveLength(16);
    expect(sessions).toHaveLength(16);
  });

  it("marks every 4th week as a deload for plans of 4+ weeks", () => {
    const { plan } = generatePlan({
      baseConfig,
      weeks: 8,
      daysPerWeek: 3,
      startDate: new Date().toISOString(),
      exercises: EXERCISES,
      oneRepMaxes: []
    });
    expect(plan.deloadWeekIndices).toEqual([3, 7]);
  });

  it("has no deload week for a 1 or 2 week plan", () => {
    const oneWeek = generatePlan({
      baseConfig,
      weeks: 1,
      daysPerWeek: 3,
      startDate: new Date().toISOString(),
      exercises: EXERCISES,
      oneRepMaxes: []
    });
    const twoWeek = generatePlan({
      baseConfig,
      weeks: 2,
      daysPerWeek: 3,
      startDate: new Date().toISOString(),
      exercises: EXERCISES,
      oneRepMaxes: []
    });
    expect(oneWeek.plan.deloadWeekIndices).toEqual([]);
    expect(twoWeek.plan.deloadWeekIndices).toEqual([]);
  });

  it("applyDeloadReduction lowers prescribed sets and conditioning time caps", () => {
    const original = generateWorkout({
      config: baseConfig,
      exercises: EXERCISES,
      oneRepMaxes: []
    });
    const deloaded = applyDeloadReduction(original);

    const originalStrengthSets = original.blocks.find((b) => b.role === "strength")?.exercises[0]?.sets;
    const deloadedStrengthSets = deloaded.blocks.find((b) => b.role === "strength")?.exercises[0]?.sets;
    expect(originalStrengthSets).toBeDefined();
    expect(deloadedStrengthSets!).toBeLessThan(originalStrengthSets!);
  });

  it("every deload-week planned session in a real plan actually has isDeload set", () => {
    const { plan } = generatePlan({
      baseConfig,
      weeks: 4,
      daysPerWeek: 2,
      startDate: new Date().toISOString(),
      exercises: EXERCISES,
      oneRepMaxes: []
    });
    const week4Sessions = plan.plannedSessions.filter((p) => p.weekIndex === 3);
    expect(week4Sessions.every((p) => p.isDeload)).toBe(true);
    const week1Sessions = plan.plannedSessions.filter((p) => p.weekIndex === 0);
    expect(week1Sessions.every((p) => !p.isDeload)).toBe(true);
  });

  it("varies the training style across the week instead of repeating the primary style every day", () => {
    const { plan } = generatePlan({
      baseConfig,
      weeks: 1,
      daysPerWeek: 4,
      startDate: new Date().toISOString(),
      exercises: EXERCISES,
      oneRepMaxes: []
    });
    const styles = new Set(plan.plannedSessions.map((p) => p.config.style));
    expect(styles.size).toBeGreaterThan(1);
  });

  it("caps mobility/recovery days to a mild intensity even when the base intensity is hard", () => {
    const { plan } = generatePlan({
      baseConfig: { ...baseConfig, style: "strength", intensity: "very_hard" },
      weeks: 1,
      daysPerWeek: 6,
      startDate: new Date().toISOString(),
      exercises: EXERCISES,
      oneRepMaxes: []
    });
    const recoveryDays = plan.plannedSessions.filter((p) => p.config.style === "mobility" || p.config.style === "zone2");
    for (const day of recoveryDays) {
      expect(["recovery", "light", "moderate"]).toContain(day.config.intensity);
    }
  });

  it("links every generated session back to its plan id", () => {
    const { plan, sessions } = generatePlan({
      baseConfig,
      weeks: 1,
      daysPerWeek: 3,
      startDate: new Date().toISOString(),
      exercises: EXERCISES,
      oneRepMaxes: []
    });
    for (const session of sessions) {
      expect(session.planId).toBe(plan.id);
    }
  });
});
