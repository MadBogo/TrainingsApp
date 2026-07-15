import { create } from "zustand";
import type { GeneratedSession } from "@/domain";
import { buildDraftSets, type DraftSet } from "@/engine/draftSets";

interface LiveWorkoutState {
  sessionId: string | null;
  sets: DraftSet[];
  startSession: (session: GeneratedSession) => void;
  updateSet: (setId: string, patch: Partial<DraftSet>) => void;
  clear: () => void;
}

export const useLiveWorkoutStore = create<LiveWorkoutState>((set, get) => ({
  sessionId: null,
  sets: [],

  startSession: (session) => {
    if (get().sessionId === session.id) return;
    set({ sessionId: session.id, sets: buildDraftSets(session) });
  },

  updateSet: (setId, patch) =>
    set((s) => ({ sets: s.sets.map((draft) => (draft.id === setId ? { ...draft, ...patch } : draft)) })),

  clear: () => set({ sessionId: null, sets: [] })
}));
