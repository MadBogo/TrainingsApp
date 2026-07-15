import { describe, it, expect } from "vitest";
import { analyzeFatigue } from "./fatigue";
import { EXERCISES, getExerciseById } from "@/data/exercises";
import type { GeneratedSession, LoggedSession } from "@/domain";

const byId = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

function loggedSession(id: string, sessionId: string, exerciseIds: string[], daysAgo: number): LoggedSession {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id,
    sessionId,
    date: date.toISOString(),
    completed: true,
    loggedSets: exerciseIds.map((exerciseId, i) => ({
      id: `${id}-set-${i}`,
      exerciseId,
      exerciseName: getExerciseById(exerciseId)?.name ?? exerciseId,
      setIndex: i
    })),
    conditioningResults: [],
    painFlag: false
  };
}

function generatedSession(id: string, intensity: GeneratedSession["config"]["intensity"]): GeneratedSession {
  return {
    id,
    title: "test",
    config: {
      mode: "train_now",
      durationMin: 45,
      style: "strength",
      intensity,
      location: "full_gym",
      equipment: [],
      focusAreas: ["full_body"],
      movementFocus: []
    },
    intention: "",
    estimatedDurationMin: 45,
    primaryPatterns: [],
    effortGuidance: "",
    equipmentRequired: [],
    blocks: [],
    fatigueNotes: [],
    generatedAt: new Date().toISOString()
  };
}

describe("analyzeFatigue", () => {
  it("flags spinal loading after two recent heavy-spinal sessions", () => {
    const logs = [
      loggedSession("l1", "s1", ["barbell-deadlift"], 1),
      loggedSession("l2", "s2", ["barbell-back-squat"], 2),
      loggedSession("l3", "s3", ["dumbbell-bicep-curl"], 3)
    ];
    const result = analyzeFatigue(logs, [], byId);
    expect(result.flags.has("spinal_loading")).toBe(true);
    expect(result.notes.some((n) => n.toLowerCase().includes("spinal"))).toBe(true);
  });

  it("does not flag a pattern seen only once", () => {
    const logs = [loggedSession("l1", "s1", ["barbell-deadlift"], 1), loggedSession("l2", "s2", ["dumbbell-bicep-curl"], 2)];
    const result = analyzeFatigue(logs, [], byId);
    expect(result.flags.has("spinal_loading")).toBe(false);
  });

  it("ignores incomplete sessions", () => {
    const incomplete: LoggedSession = { ...loggedSession("l1", "s1", ["barbell-deadlift"], 1), completed: false };
    const logs = [incomplete, loggedSession("l2", "s2", ["barbell-back-squat"], 2)];
    const result = analyzeFatigue(logs, [], byId);
    expect(result.flags.has("spinal_loading")).toBe(false);
  });

  it("flags two consecutive very-hard sessions", () => {
    const logs = [loggedSession("l1", "s1", [], 1), loggedSession("l2", "s2", [], 2)];
    const sessions = [generatedSession("s1", "very_hard"), generatedSession("s2", "very_hard")];
    const result = analyzeFatigue(logs, sessions, byId);
    expect(result.consecutiveVeryHardConditioning).toBe(true);
  });

  it("returns no flags for an empty history", () => {
    const result = analyzeFatigue([], [], byId);
    expect(result.flags.size).toBe(0);
    expect(result.notes).toEqual([]);
  });
});
