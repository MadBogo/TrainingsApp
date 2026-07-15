import { describe, it, expect } from "vitest";
import { buildOneRmTrend, buildVolumeTrend, buildConditioningHistory, exercisesWithHistory } from "./progressionStats";
import { getExerciseById } from "@/data/exercises";
import type { Exercise, GeneratedSession, LoggedSession } from "@/domain";

function log(overrides: Partial<LoggedSession>): LoggedSession {
  return {
    id: "l1",
    sessionId: "s1",
    date: "2026-01-01T00:00:00.000Z",
    completed: true,
    loggedSets: [],
    conditioningResults: [],
    painFlag: false,
    ...overrides
  };
}

describe("buildOneRmTrend", () => {
  it("produces one point per session, using the best set when multiple are logged", () => {
    const logs = [
      log({
        id: "l1",
        date: "2026-01-01T00:00:00.000Z",
        loggedSets: [
          { id: "s1", exerciseId: "barbell-deadlift", exerciseName: "Deadlift", setIndex: 0, weightKg: 100, reps: 5 },
          { id: "s2", exerciseId: "barbell-deadlift", exerciseName: "Deadlift", setIndex: 1, weightKg: 120, reps: 3 }
        ]
      }),
      log({
        id: "l2",
        date: "2026-01-08T00:00:00.000Z",
        loggedSets: [{ id: "s3", exerciseId: "barbell-deadlift", exerciseName: "Deadlift", setIndex: 0, weightKg: 140, reps: 3 }]
      })
    ];
    const trend = buildOneRmTrend("barbell-deadlift", logs);
    expect(trend).toHaveLength(2);
    expect(trend[0].date).toBe("2026-01-01T00:00:00.000Z");
    expect(trend[1].valueKg).toBeGreaterThan(trend[0].valueKg);
  });

  it("ignores incomplete sessions and sets without both weight and reps", () => {
    const logs = [
      log({ completed: false, loggedSets: [{ id: "s1", exerciseId: "barbell-deadlift", exerciseName: "d", setIndex: 0, weightKg: 100, reps: 5 }] }),
      log({ loggedSets: [{ id: "s2", exerciseId: "barbell-deadlift", exerciseName: "d", setIndex: 0, weightKg: 100 }] })
    ];
    expect(buildOneRmTrend("barbell-deadlift", logs)).toEqual([]);
  });
});

describe("buildVolumeTrend", () => {
  it("sums weight x reps across sets within the same week", () => {
    const logs = [
      log({
        date: "2026-06-01T00:00:00.000Z", // Monday
        loggedSets: [{ id: "s1", exerciseId: "e", exerciseName: "e", setIndex: 0, weightKg: 100, reps: 5 }]
      }),
      log({
        date: "2026-06-03T00:00:00.000Z", // same week, Wednesday
        loggedSets: [{ id: "s2", exerciseId: "e", exerciseName: "e", setIndex: 0, weightKg: 50, reps: 10 }]
      })
    ];
    const trend = buildVolumeTrend(logs);
    expect(trend).toHaveLength(1);
    expect(trend[0].volumeKg).toBe(500 + 500);
  });

  it("splits volume into separate weeks when sessions are far apart", () => {
    const logs = [
      log({ date: "2026-01-01T00:00:00.000Z", loggedSets: [{ id: "s1", exerciseId: "e", exerciseName: "e", setIndex: 0, weightKg: 100, reps: 5 }] }),
      log({ date: "2026-03-01T00:00:00.000Z", loggedSets: [{ id: "s2", exerciseId: "e", exerciseName: "e", setIndex: 0, weightKg: 100, reps: 5 }] })
    ];
    expect(buildVolumeTrend(logs)).toHaveLength(2);
  });
});

describe("buildConditioningHistory", () => {
  it("pairs each conditioning result with its session's conditioning block title", () => {
    const session: GeneratedSession = {
      id: "s1",
      title: "Functional fitness — 30 min",
      config: {
        mode: "train_now",
        durationMin: 30,
        style: "functional_fitness",
        intensity: "hard",
        location: "full_gym",
        equipment: [],
        focusAreas: ["full_body"],
        movementFocus: []
      },
      intention: "",
      estimatedDurationMin: 30,
      primaryPatterns: [],
      effortGuidance: "",
      equipmentRequired: [],
      blocks: [
        { id: "b1", role: "conditioning", title: "For Time", format: "for_time", timeCapMin: 15, exercises: [] }
      ],
      fatigueNotes: [],
      generatedAt: "2026-01-01T00:00:00.000Z"
    };
    const logs = [log({ sessionId: "s1", conditioningResults: [{ scoreType: "time", value: "12:34" }] })];
    const history = buildConditioningHistory(logs, { s1: session });
    expect(history).toHaveLength(1);
    expect(history[0].blockTitle).toBe("For Time");
    expect(history[0].value).toBe("12:34");
  });
});

describe("exercisesWithHistory", () => {
  it("returns only exercises with at least one weight+reps logged set", () => {
    const exercisesById: Record<string, Exercise> = {
      "barbell-deadlift": getExerciseById("barbell-deadlift")!,
      "push-up": getExerciseById("push-up")!
    };
    const logs = [
      log({
        loggedSets: [
          { id: "s1", exerciseId: "barbell-deadlift", exerciseName: "Deadlift", setIndex: 0, weightKg: 100, reps: 5 },
          { id: "s2", exerciseId: "push-up", exerciseName: "Push-up", setIndex: 0, reps: 20 }
        ]
      })
    ];
    const result = exercisesWithHistory(logs, exercisesById);
    expect(result.map((e) => e.id)).toEqual(["barbell-deadlift"]);
  });
});
