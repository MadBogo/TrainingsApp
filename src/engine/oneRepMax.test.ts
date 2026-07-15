import { describe, it, expect } from "vitest";
import { estimateOneRepMax } from "./oneRepMax";

describe("estimateOneRepMax", () => {
  it("returns a higher estimate for more reps at the same weight", () => {
    const low = estimateOneRepMax(100, 3);
    const high = estimateOneRepMax(100, 10);
    expect(high).toBeGreaterThan(low);
  });

  it("returns a higher estimate for a lower RPE at the same weight and reps (more reps in reserve implies more untapped capacity)", () => {
    const lowRpe = estimateOneRepMax(100, 5, 6); // RIR 4 — plenty left in the tank
    const highRpe = estimateOneRepMax(100, 5, 9); // RIR 1 — nearly maximal already
    expect(lowRpe).toBeGreaterThan(highRpe);
  });

  it("is close to the weight itself for a true 1-rep max effort", () => {
    const estimate = estimateOneRepMax(140, 1, 10);
    expect(estimate).toBeGreaterThan(130);
    expect(estimate).toBeLessThan(150);
  });

  it("returns 0 for non-positive inputs", () => {
    expect(estimateOneRepMax(0, 5)).toBe(0);
    expect(estimateOneRepMax(100, 0)).toBe(0);
  });

  it("rounds to the nearest half kilogram", () => {
    const estimate = estimateOneRepMax(83, 7);
    expect(estimate % 0.5).toBe(0);
  });
});
