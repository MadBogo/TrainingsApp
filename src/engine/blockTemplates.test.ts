import { describe, it, expect } from "vitest";
import { deriveFormat, getBlockPlan, getStyleFamily } from "./blockTemplates";
import { SESSION_DURATIONS, TRAINING_STYLES } from "@/domain";

describe("getBlockPlan", () => {
  it("sums block time caps to exactly the requested session duration for every style/duration combo", () => {
    for (const style of TRAINING_STYLES) {
      for (const duration of SESSION_DURATIONS) {
        const plan = getBlockPlan(style, duration);
        const total = plan.reduce((sum, slot) => sum + slot.timeCapMin, 0);
        expect(total, `${style} @ ${duration}min`).toBe(duration);
      }
    }
  });

  it("always starts with a warmup block", () => {
    for (const style of TRAINING_STYLES) {
      for (const duration of SESSION_DURATIONS) {
        const plan = getBlockPlan(style, duration);
        expect(plan[0].role).toBe("warmup");
      }
    }
  });

  it("never places skill work after conditioning in the same session", () => {
    for (const style of TRAINING_STYLES) {
      for (const duration of SESSION_DURATIONS) {
        const plan = getBlockPlan(style, duration);
        const skillIndex = plan.findIndex((s) => s.role === "skill");
        const conditioningIndex = plan.findIndex((s) => s.role === "conditioning");
        if (skillIndex !== -1 && conditioningIndex !== -1) {
          expect(skillIndex).toBeLessThan(conditioningIndex);
        }
      }
    }
  });

  it("never places strength work after conditioning in the same session", () => {
    for (const style of TRAINING_STYLES) {
      for (const duration of SESSION_DURATIONS) {
        const plan = getBlockPlan(style, duration);
        const strengthIndex = plan.findIndex((s) => s.role === "strength");
        const conditioningIndex = plan.findIndex((s) => s.role === "conditioning");
        if (strengthIndex !== -1 && conditioningIndex !== -1) {
          expect(strengthIndex).toBeLessThan(conditioningIndex);
        }
      }
    }
  });

  it("gives strength-family styles no conditioning block", () => {
    for (const style of ["strength", "hypertrophy", "power"] as const) {
      for (const duration of SESSION_DURATIONS) {
        const plan = getBlockPlan(style, duration);
        expect(plan.some((s) => s.role === "conditioning")).toBe(false);
      }
    }
  });
});

describe("getStyleFamily", () => {
  it("groups styles into the expected families", () => {
    expect(getStyleFamily("zone2")).toBe("single_block");
    expect(getStyleFamily("strength")).toBe("strength");
    expect(getStyleFamily("hiit")).toBe("metcon");
    expect(getStyleFamily("olympic_lifting")).toBe("skill");
  });
});

describe("deriveFormat", () => {
  it("always uses duration format for warmup and cooldown", () => {
    expect(deriveFormat("warmup", "strength", "moderate")).toBe("duration");
    expect(deriveFormat("cooldown", "hiit", "hard")).toBe("duration");
  });

  it("uses interval format for HIIT conditioning", () => {
    expect(deriveFormat("conditioning", "hiit", "hard")).toBe("interval");
  });

  it("uses complex format for olympic-lifting skill work", () => {
    expect(deriveFormat("skill", "olympic_lifting", "moderate")).toBe("complex");
  });

  it("uses for_time for hard/very_hard functional-fitness conditioning", () => {
    expect(deriveFormat("conditioning", "functional_fitness", "hard")).toBe("for_time");
    expect(deriveFormat("conditioning", "functional_fitness", "very_hard")).toBe("for_time");
  });

  it("uses EMOM for light/recovery functional-fitness conditioning", () => {
    expect(deriveFormat("conditioning", "functional_fitness", "light")).toBe("emom");
    expect(deriveFormat("conditioning", "functional_fitness", "recovery")).toBe("emom");
  });

  it("uses AMRAP for moderate functional-fitness conditioning", () => {
    expect(deriveFormat("conditioning", "functional_fitness", "moderate")).toBe("amrap");
  });
});
