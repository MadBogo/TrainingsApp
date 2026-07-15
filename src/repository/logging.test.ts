import { describe, it, expect, beforeEach } from "vitest";
import { db } from "./db";
import { sessionRepository } from "./sessionRepository";
import { logRepository } from "./logRepository";
import type { GeneratedSession, LoggedSession } from "@/domain";

const sampleSession: GeneratedSession = {
  id: "session-1",
  title: "Strength — 45 min",
  config: {
    mode: "train_now",
    durationMin: 45,
    style: "strength",
    intensity: "moderate",
    location: "full_gym",
    equipment: ["barbell"],
    focusAreas: ["full_body"],
    movementFocus: []
  },
  intention: "test",
  estimatedDurationMin: 45,
  primaryPatterns: ["squat"],
  effortGuidance: "test",
  equipmentRequired: ["barbell"],
  blocks: [],
  fatigueNotes: [],
  generatedAt: new Date().toISOString()
};

function sampleLog(overrides: Partial<LoggedSession> = {}): LoggedSession {
  return {
    id: "log-1",
    sessionId: "session-1",
    date: new Date().toISOString(),
    completed: true,
    loggedSets: [
      { id: "set-1", exerciseId: "barbell-back-squat", exerciseName: "Barbell Back Squat", setIndex: 0, weightKg: 100, reps: 5 }
    ],
    conditioningResults: [],
    sessionRpe: 7,
    painFlag: false,
    ...overrides
  };
}

beforeEach(async () => {
  await db.generatedSessions.clear();
  await db.loggedSessions.clear();
});

describe("sessionRepository", () => {
  it("saves and retrieves a generated session by id", async () => {
    await sessionRepository.save(sampleSession);
    const found = await sessionRepository.getById("session-1");
    expect(found?.title).toBe("Strength — 45 min");
  });

  it("returns recent sessions ordered by generatedAt descending", async () => {
    await sessionRepository.save({ ...sampleSession, id: "s1", generatedAt: "2026-01-01T00:00:00.000Z" });
    await sessionRepository.save({ ...sampleSession, id: "s2", generatedAt: "2026-01-02T00:00:00.000Z" });
    const recent = await sessionRepository.getRecent(2);
    expect(recent[0].id).toBe("s2");
  });
});

describe("logRepository", () => {
  it("round-trips a logged session including nested sets", async () => {
    await logRepository.save(sampleLog());
    const found = await logRepository.getBySessionId("session-1");
    expect(found?.loggedSets).toHaveLength(1);
    expect(found?.loggedSets[0].weightKg).toBe(100);
    expect(found?.sessionRpe).toBe(7);
  });

  it("finds a logged session by its own id", async () => {
    await logRepository.save(sampleLog());
    const found = await logRepository.getById("log-1");
    expect(found?.sessionId).toBe("session-1");
  });

  it("preserves the pain flag and note when set", async () => {
    await logRepository.save(sampleLog({ painFlag: true, painNote: "Left shoulder, mild" }));
    const found = await logRepository.getById("log-1");
    expect(found?.painFlag).toBe(true);
    expect(found?.painNote).toBe("Left shoulder, mild");
  });
});
