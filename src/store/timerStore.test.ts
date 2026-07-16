import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTimerStore, getTimerDisplay } from "./timerStore";

// Cues touch AudioContext/navigator.vibrate — irrelevant to timer logic under test.
vi.mock("@/lib/cues", () => ({
  primeAudio: vi.fn(),
  cueCountdown: vi.fn(),
  cueTransition: vi.fn(),
  cueComplete: vi.fn()
}));

function tickTimes(n: number) {
  for (let i = 0; i < n; i++) useTimerStore.getState().tick();
}

beforeEach(() => {
  useTimerStore.getState().reset();
});

describe("timerStore", () => {
  it("runs a simple countdown to completion", () => {
    useTimerStore.getState().start(3, "Rest");
    tickTimes(3);
    const s = useTimerStore.getState();
    expect(s.completed).toBe(true);
    expect(s.running).toBe(false);
  });

  it("auto-advances through EMOM minute segments", () => {
    const minutes = Array.from({ length: 3 }).map((_, i) => ({
      label: `Minute ${i + 1}/3`,
      seconds: 60,
      kind: "work" as const
    }));
    useTimerStore.getState().startSegments("EMOM 3", minutes);

    tickTimes(60);
    let s = useTimerStore.getState();
    expect(s.segmentIndex).toBe(1);
    expect(s.completed).toBe(false);
    expect(getTimerDisplay(s).segmentLabel).toBe("Minute 2/3");
    expect(getTimerDisplay(s).segmentPosition).toBe("2/3");

    tickTimes(60);
    s = useTimerStore.getState();
    expect(s.segmentIndex).toBe(2);

    tickTimes(60);
    s = useTimerStore.getState();
    expect(s.completed).toBe(true);
    expect(s.running).toBe(false);
  });

  it("alternates work and rest interval segments", () => {
    useTimerStore.getState().startSegments("Intervals", [
      { label: "Work 1", seconds: 30, kind: "work" },
      { label: "Rest 1", seconds: 20, kind: "rest" },
      { label: "Work 2", seconds: 30, kind: "work" }
    ]);

    tickTimes(30);
    expect(getTimerDisplay(useTimerStore.getState()).segmentKind).toBe("rest");
    tickTimes(20);
    expect(getTimerDisplay(useTimerStore.getState()).segmentKind).toBe("work");
    tickTimes(30);
    expect(useTimerStore.getState().completed).toBe(true);
  });

  it("pause stops ticks from progressing; resume continues", () => {
    useTimerStore.getState().start(10, "Rest");
    tickTimes(2);
    useTimerStore.getState().pause();
    tickTimes(5);
    expect(useTimerStore.getState().elapsedInSegment).toBe(2);
    useTimerStore.getState().resume();
    tickTimes(1);
    expect(useTimerStore.getState().elapsedInSegment).toBe(3);
  });

  it("adjust changes only the current segment's length", () => {
    useTimerStore.getState().startSegments("Intervals", [
      { label: "Work", seconds: 30, kind: "work" },
      { label: "Rest", seconds: 20, kind: "rest" }
    ]);
    useTimerStore.getState().adjust(15);
    const s = useTimerStore.getState();
    expect(s.segments[0].seconds).toBe(45);
    expect(s.segments[1].seconds).toBe(20);
  });

  it("stopwatch counts up and never completes on its own", () => {
    useTimerStore.getState().start(0, "For time", "stopwatch");
    tickTimes(90);
    const s = useTimerStore.getState();
    expect(getTimerDisplay(s).remainingSeconds).toBe(90);
    expect(s.completed).toBe(false);
  });
});
