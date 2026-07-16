import { db } from "./db";

export interface BackupFile {
  app: "training-engine";
  schemaVersion: number;
  exportedAt: string;
  data: {
    athleteProfile: unknown[];
    oneRepMaxes: unknown[];
    generatedSessions: unknown[];
    loggedSessions: unknown[];
    plans: unknown[];
  };
}

const SCHEMA_VERSION = 1;

/**
 * Exercises are deliberately excluded: they're seed data re-synced from the bundle on
 * every app load, so backing them up would only bloat the file and risk restoring a
 * stale library over a newer one.
 */
export async function exportBackup(): Promise<BackupFile> {
  const [athleteProfile, oneRepMaxes, generatedSessions, loggedSessions, plans] = await Promise.all([
    db.athleteProfile.toArray(),
    db.oneRepMaxes.toArray(),
    db.generatedSessions.toArray(),
    db.loggedSessions.toArray(),
    db.plans.toArray()
  ]);
  return {
    app: "training-engine",
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: { athleteProfile, oneRepMaxes, generatedSessions, loggedSessions, plans }
  };
}

export function validateBackup(parsed: unknown): parsed is BackupFile {
  if (typeof parsed !== "object" || parsed === null) return false;
  const candidate = parsed as Partial<BackupFile>;
  return (
    candidate.app === "training-engine" &&
    typeof candidate.schemaVersion === "number" &&
    candidate.schemaVersion <= SCHEMA_VERSION &&
    typeof candidate.data === "object" &&
    candidate.data !== null &&
    ["athleteProfile", "oneRepMaxes", "generatedSessions", "loggedSessions", "plans"].every((key) =>
      Array.isArray((candidate.data as Record<string, unknown>)[key])
    )
  );
}

/** Replaces all user data with the backup's contents inside one transaction. */
export async function importBackup(backup: BackupFile): Promise<void> {
  await db.transaction(
    "rw",
    [db.athleteProfile, db.oneRepMaxes, db.generatedSessions, db.loggedSessions, db.plans],
    async () => {
      await Promise.all([
        db.athleteProfile.clear(),
        db.oneRepMaxes.clear(),
        db.generatedSessions.clear(),
        db.loggedSessions.clear(),
        db.plans.clear()
      ]);
      await Promise.all([
        db.athleteProfile.bulkAdd(backup.data.athleteProfile as never[]),
        db.oneRepMaxes.bulkAdd(backup.data.oneRepMaxes as never[]),
        db.generatedSessions.bulkAdd(backup.data.generatedSessions as never[]),
        db.loggedSessions.bulkAdd(backup.data.loggedSessions as never[]),
        db.plans.bulkAdd(backup.data.plans as never[])
      ]);
    }
  );
}
