import type { AthleteProfile, EstimatedOneRM } from "@/domain";
import { db } from "./db";

const PROFILE_ID = "athlete-default";

export interface AthleteRepository {
  getProfile(): Promise<AthleteProfile | undefined>;
  saveProfile(profile: AthleteProfile): Promise<void>;
  getOneRepMaxes(): Promise<EstimatedOneRM[]>;
  getOneRepMax(exerciseId: string): Promise<EstimatedOneRM | undefined>;
  upsertOneRepMax(entry: EstimatedOneRM): Promise<void>;
  bulkUpsertOneRepMaxes(entries: EstimatedOneRM[]): Promise<void>;
}

export const athleteRepository: AthleteRepository = {
  async getProfile() {
    return db.athleteProfile.get(PROFILE_ID);
  },
  async saveProfile(profile) {
    await db.athleteProfile.put({ ...profile, id: PROFILE_ID });
  },
  async getOneRepMaxes() {
    return db.oneRepMaxes.toArray();
  },
  async getOneRepMax(exerciseId) {
    return db.oneRepMaxes.where("exerciseId").equals(exerciseId).first();
  },
  async upsertOneRepMax(entry) {
    await db.oneRepMaxes.put(entry);
  },
  async bulkUpsertOneRepMaxes(entries) {
    await db.oneRepMaxes.bulkPut(entries);
  }
};

export const ATHLETE_PROFILE_ID = PROFILE_ID;
