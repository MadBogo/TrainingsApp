import { create } from "zustand";
import { cueComplete, cueCountdown, cueTransition, primeAudio } from "@/lib/cues";

export type TimerMode = "countdown" | "stopwatch";

export interface TimerSegment {
  label: string;
  seconds: number;
  /** Colors the timer bar: work segments accent, rest segments muted. */
  kind: "work" | "rest";
}

interface TimerState {
  title: string;
  mode: TimerMode;
  /** Countdown timers are a queue of one or more segments (EMOM minutes, work/rest intervals). */
  segments: TimerSegment[];
  segmentIndex: number;
  elapsedInSegment: number;
  running: boolean;
  completed: boolean;
  /** Simple single-segment countdown or stopwatch. */
  start: (seconds: number, label: string, mode?: TimerMode) => void;
  /** Multi-segment countdown with auto-advance and transition cues. */
  startSegments: (title: string, segments: TimerSegment[]) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  adjust: (deltaSeconds: number) => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  title: "",
  mode: "countdown",
  segments: [],
  segmentIndex: 0,
  elapsedInSegment: 0,
  running: false,
  completed: false,

  start: (seconds, label, mode = "countdown") => {
    primeAudio();
    set({
      title: label,
      mode,
      segments: mode === "countdown" ? [{ label, seconds, kind: "work" }] : [],
      segmentIndex: 0,
      elapsedInSegment: 0,
      running: true,
      completed: false
    });
  },

  startSegments: (title, segments) => {
    if (segments.length === 0) return;
    primeAudio();
    set({
      title,
      mode: "countdown",
      segments,
      segmentIndex: 0,
      elapsedInSegment: 0,
      running: true,
      completed: false
    });
  },

  pause: () => set({ running: false }),
  resume: () => set((s) => ({ running: !s.completed })),

  reset: () =>
    set({ running: false, segments: [], segmentIndex: 0, elapsedInSegment: 0, completed: false, title: "" }),

  adjust: (deltaSeconds) =>
    set((s) => {
      if (s.mode !== "countdown" || s.segments.length === 0) return s;
      const segments = s.segments.map((seg, i) =>
        i === s.segmentIndex ? { ...seg, seconds: Math.max(5, seg.seconds + deltaSeconds) } : seg
      );
      return { ...s, segments };
    }),

  tick: () => {
    const s = get();
    if (!s.running) return;

    if (s.mode === "stopwatch") {
      set({ elapsedInSegment: s.elapsedInSegment + 1 });
      return;
    }

    const current = s.segments[s.segmentIndex];
    if (!current) return;
    const nextElapsed = s.elapsedInSegment + 1;
    const remaining = current.seconds - nextElapsed;

    if (remaining > 0) {
      if (remaining <= 3) cueCountdown();
      set({ elapsedInSegment: nextElapsed });
      return;
    }

    // Segment finished — advance or complete.
    const isLastSegment = s.segmentIndex >= s.segments.length - 1;
    if (isLastSegment) {
      cueComplete();
      set({ elapsedInSegment: current.seconds, running: false, completed: true });
    } else {
      cueTransition();
      set({ segmentIndex: s.segmentIndex + 1, elapsedInSegment: 0 });
    }
  }
}));

/** Derived display state shared by the timer bar and tests. */
export function getTimerDisplay(s: {
  mode: TimerMode;
  segments: TimerSegment[];
  segmentIndex: number;
  elapsedInSegment: number;
}): { remainingSeconds: number; segmentLabel: string; segmentKind: "work" | "rest"; segmentPosition: string | null } {
  if (s.mode === "stopwatch") {
    return { remainingSeconds: s.elapsedInSegment, segmentLabel: "", segmentKind: "work", segmentPosition: null };
  }
  const current = s.segments[s.segmentIndex];
  if (!current) {
    return { remainingSeconds: 0, segmentLabel: "", segmentKind: "work", segmentPosition: null };
  }
  return {
    remainingSeconds: Math.max(0, current.seconds - s.elapsedInSegment),
    segmentLabel: current.label,
    segmentKind: current.kind,
    segmentPosition: s.segments.length > 1 ? `${s.segmentIndex + 1}/${s.segments.length}` : null
  };
}
