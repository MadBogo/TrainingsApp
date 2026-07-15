import { create } from "zustand";

export type TimerMode = "countdown" | "stopwatch";

interface TimerState {
  label: string;
  mode: TimerMode;
  totalSeconds: number;
  elapsedSeconds: number;
  running: boolean;
  completed: boolean;
  start: (seconds: number, label: string, mode?: TimerMode) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  adjust: (deltaSeconds: number) => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  label: "",
  mode: "countdown",
  totalSeconds: 0,
  elapsedSeconds: 0,
  running: false,
  completed: false,

  start: (seconds, label, mode = "countdown") =>
    set({ label, mode, totalSeconds: seconds, elapsedSeconds: 0, running: true, completed: false }),

  pause: () => set({ running: false }),
  resume: () => set((s) => ({ running: !s.completed })),

  reset: () => set({ running: false, elapsedSeconds: 0, completed: false }),

  adjust: (deltaSeconds) =>
    set((s) => ({ totalSeconds: Math.max(5, s.totalSeconds + deltaSeconds) })),

  tick: () => {
    const s = get();
    if (!s.running) return;
    if (s.mode === "countdown") {
      const next = s.elapsedSeconds + 1;
      if (next >= s.totalSeconds) {
        set({ elapsedSeconds: s.totalSeconds, running: false, completed: true });
      } else {
        set({ elapsedSeconds: next });
      }
    } else {
      set({ elapsedSeconds: s.elapsedSeconds + 1 });
    }
  }
}));
