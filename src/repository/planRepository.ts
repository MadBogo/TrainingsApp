import type { TrainingPlan } from "@/domain";
import { db } from "./db";

export interface PlanRepository {
  save(plan: TrainingPlan): Promise<void>;
  getById(id: string): Promise<TrainingPlan | undefined>;
  getActive(): Promise<TrainingPlan | undefined>;
  getAll(): Promise<TrainingPlan[]>;
}

export const planRepository: PlanRepository = {
  async save(plan) {
    await db.plans.put(plan);
  },
  async getById(id) {
    return db.plans.get(id);
  },
  async getActive() {
    return db.plans.orderBy("createdAt").reverse().first();
  },
  async getAll() {
    return db.plans.orderBy("createdAt").reverse().toArray();
  }
};
