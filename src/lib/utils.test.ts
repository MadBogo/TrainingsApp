import { describe, it, expect } from "vitest";
import { roundToIncrement, formatDuration, clamp, titleCaseFromId } from "./utils";

describe("roundToIncrement", () => {
  it("rounds to the nearest 2.5kg plate increment by default", () => {
    expect(roundToIncrement(91)).toBe(90);
    expect(roundToIncrement(92.5)).toBe(92.5);
    expect(roundToIncrement(93.8)).toBe(95);
  });

  it("supports custom increments", () => {
    expect(roundToIncrement(23, 5)).toBe(25);
  });
});

describe("formatDuration", () => {
  it("formats seconds as m:ss", () => {
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(600)).toBe("10:00");
    expect(formatDuration(9)).toBe("0:09");
  });
});

describe("clamp", () => {
  it("keeps values within bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("titleCaseFromId", () => {
  it("converts kebab and snake case ids into readable labels", () => {
    expect(titleCaseFromId("barbell-bench-press")).toBe("Barbell Bench Press");
    expect(titleCaseFromId("front_squat")).toBe("Front Squat");
  });
});
