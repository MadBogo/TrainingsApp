import type { GeneratedSession } from "@/domain";
import { db } from "./db";

export interface SessionRepository {
  save(session: GeneratedSession): Promise<void>;
  getById(id: string): Promise<GeneratedSession | undefined>;
  getRecent(limit?: number): Promise<GeneratedSession[]>;
  getAll(): Promise<GeneratedSession[]>;
  getByPlanId(planId: string): Promise<GeneratedSession[]>;
}

export const sessionRepository: SessionRepository = {
  async save(session) {
    await db.generatedSessions.put(session);
  },
  async getById(id) {
    return db.generatedSessions.get(id);
  },
  async getRecent(limit = 10) {
    return db.generatedSessions.orderBy("generatedAt").reverse().limit(limit).toArray();
  },
  async getAll() {
    return db.generatedSessions.toArray();
  },
  async getByPlanId(planId) {
    return db.generatedSessions.where("planId").equals(planId).toArray();
  }
};
