import Dexie, { type Table } from "dexie";
import type {
  AthleteProfile,
  EstimatedOneRM,
  Exercise,
  GeneratedSession,
  LoggedSession,
  TrainingPlan
} from "@/domain";

export class TrainingEngineDB extends Dexie {
  exercises!: Table<Exercise, string>;
  oneRepMaxes!: Table<EstimatedOneRM, string>;
  athleteProfile!: Table<AthleteProfile, string>;
  generatedSessions!: Table<GeneratedSession, string>;
  loggedSessions!: Table<LoggedSession, string>;
  plans!: Table<TrainingPlan, string>;

  constructor() {
    super("training-engine");
    this.version(1).stores({
      exercises: "id, name, *patterns, *equipment, *primaryMuscles",
      oneRepMaxes: "id, exerciseId, lastUpdated",
      athleteProfile: "id",
      generatedSessions: "id, generatedAt, planId",
      loggedSessions: "id, sessionId, date",
      plans: "id, createdAt"
    });
  }
}

export const db = new TrainingEngineDB();
