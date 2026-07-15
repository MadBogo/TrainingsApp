import type { Exercise } from "@/domain";
import { db } from "./db";

export interface ExerciseRepository {
  getAll(): Promise<Exercise[]>;
  getById(id: string): Promise<Exercise | undefined>;
  getByIds(ids: string[]): Promise<Exercise[]>;
  bulkUpsert(exercises: Exercise[]): Promise<void>;
  count(): Promise<number>;
}

export const exerciseRepository: ExerciseRepository = {
  async getAll() {
    return db.exercises.toArray();
  },
  async getById(id) {
    return db.exercises.get(id);
  },
  async getByIds(ids) {
    const results = await db.exercises.bulkGet(ids);
    return results.filter((e): e is Exercise => Boolean(e));
  },
  async bulkUpsert(exercises) {
    await db.exercises.bulkPut(exercises);
  },
  async count() {
    return db.exercises.count();
  }
};
