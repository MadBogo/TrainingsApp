import { create } from "zustand";
import type { AthleteProfile, EstimatedOneRM } from "@/domain";
import { athleteRepository } from "@/repository";
import { seedAthleteProfile, seedOneRepMaxes } from "@/data/seedAthlete";

interface AthleteState {
  profile: AthleteProfile | null;
  oneRepMaxes: EstimatedOneRM[];
  loading: boolean;
  init: () => Promise<void>;
  saveProfile: (profile: AthleteProfile) => Promise<void>;
  upsertOneRepMax: (entry: EstimatedOneRM) => Promise<void>;
  refreshOneRepMaxes: () => Promise<void>;
}

export const useAthleteStore = create<AthleteState>((set, get) => ({
  profile: null,
  oneRepMaxes: [],
  loading: true,

  init: async () => {
    let profile = await athleteRepository.getProfile();
    if (!profile) {
      await athleteRepository.saveProfile(seedAthleteProfile);
      await athleteRepository.bulkUpsertOneRepMaxes(seedOneRepMaxes);
      profile = seedAthleteProfile;
    }
    const oneRepMaxes = await athleteRepository.getOneRepMaxes();
    set({ profile, oneRepMaxes, loading: false });
  },

  saveProfile: async (profile) => {
    await athleteRepository.saveProfile(profile);
    set({ profile });
  },

  upsertOneRepMax: async (entry) => {
    await athleteRepository.upsertOneRepMax(entry);
    await get().refreshOneRepMaxes();
  },

  refreshOneRepMaxes: async () => {
    const oneRepMaxes = await athleteRepository.getOneRepMaxes();
    set({ oneRepMaxes });
  }
}));
