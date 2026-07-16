import { describe, it, expect, beforeEach } from "vitest";
import { db } from "./db";
import { exportBackup, importBackup, validateBackup } from "./backup";
import type { LoggedSession, EstimatedOneRM } from "@/domain";

const sampleLog: LoggedSession = {
  id: "log-1",
  sessionId: "session-1",
  date: "2026-07-15T10:00:00.000Z",
  completed: true,
  loggedSets: [{ id: "set-1", exerciseId: "barbell-back-squat", exerciseName: "Barbell Back Squat", setIndex: 0, weightKg: 100, reps: 5 }],
  conditioningResults: [],
  sessionRpe: 7,
  painFlag: false
};

const sampleOrm: EstimatedOneRM = {
  id: "orm-1",
  exerciseId: "barbell-back-squat",
  valueKg: 119,
  method: "calculated",
  source: "test",
  confidence: "low",
  lastUpdated: "2026-07-15T10:00:00.000Z"
};

beforeEach(async () => {
  await Promise.all([
    db.athleteProfile.clear(),
    db.oneRepMaxes.clear(),
    db.generatedSessions.clear(),
    db.loggedSessions.clear(),
    db.plans.clear()
  ]);
});

describe("backup export/import", () => {
  it("round-trips all user data through export and import", async () => {
    await db.loggedSessions.add(sampleLog);
    await db.oneRepMaxes.add(sampleOrm);

    const backup = await exportBackup();
    expect(backup.app).toBe("training-engine");
    expect(backup.data.loggedSessions).toHaveLength(1);
    expect(backup.data.oneRepMaxes).toHaveLength(1);

    // Wipe, then restore.
    await db.loggedSessions.clear();
    await db.oneRepMaxes.clear();
    expect(await db.loggedSessions.count()).toBe(0);

    await importBackup(backup);
    const restored = await db.loggedSessions.get("log-1");
    expect(restored?.loggedSets[0].weightKg).toBe(100);
    expect((await db.oneRepMaxes.get("orm-1"))?.valueKg).toBe(119);
  });

  it("import replaces existing data rather than merging", async () => {
    await db.oneRepMaxes.add(sampleOrm);
    const backup = await exportBackup();

    await db.oneRepMaxes.add({ ...sampleOrm, id: "orm-2", exerciseId: "barbell-deadlift" });
    expect(await db.oneRepMaxes.count()).toBe(2);

    await importBackup(backup);
    expect(await db.oneRepMaxes.count()).toBe(1);
  });

  it("validateBackup rejects malformed input", () => {
    expect(validateBackup(null)).toBe(false);
    expect(validateBackup({})).toBe(false);
    expect(validateBackup({ app: "other-app", schemaVersion: 1, data: {} })).toBe(false);
    expect(
      validateBackup({
        app: "training-engine",
        schemaVersion: 1,
        exportedAt: "x",
        data: { athleteProfile: [], oneRepMaxes: [], generatedSessions: [], loggedSessions: [], plans: [] }
      })
    ).toBe(true);
  });

  it("validateBackup rejects newer schema versions than this build understands", () => {
    expect(
      validateBackup({
        app: "training-engine",
        schemaVersion: 999,
        exportedAt: "x",
        data: { athleteProfile: [], oneRepMaxes: [], generatedSessions: [], loggedSessions: [], plans: [] }
      })
    ).toBe(false);
  });
});
