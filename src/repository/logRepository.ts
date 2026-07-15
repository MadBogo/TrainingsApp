import type { LoggedSession } from "@/domain";
import { db } from "./db";

export interface LogRepository {
  save(entry: LoggedSession): Promise<void>;
  getById(id: string): Promise<LoggedSession | undefined>;
  getBySessionId(sessionId: string): Promise<LoggedSession | undefined>;
  getRecent(limit?: number): Promise<LoggedSession[]>;
  getAll(): Promise<LoggedSession[]>;
  getSince(isoDate: string): Promise<LoggedSession[]>;
}

export const logRepository: LogRepository = {
  async save(entry) {
    await db.loggedSessions.put(entry);
  },
  async getById(id) {
    return db.loggedSessions.get(id);
  },
  async getBySessionId(sessionId) {
    return db.loggedSessions.where("sessionId").equals(sessionId).first();
  },
  async getRecent(limit = 20) {
    return db.loggedSessions.orderBy("date").reverse().limit(limit).toArray();
  },
  async getAll() {
    return db.loggedSessions.toArray();
  },
  async getSince(isoDate) {
    return db.loggedSessions.where("date").aboveOrEqual(isoDate).toArray();
  }
};
