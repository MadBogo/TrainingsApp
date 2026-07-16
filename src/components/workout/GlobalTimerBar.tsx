import { useEffect } from "react";
import { Play, Pause, RotateCcw, Minus, Plus } from "lucide-react";
import { useTimerStore, getTimerDisplay } from "@/store/timerStore";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function GlobalTimerBar() {
  const state = useTimerStore();
  const { title, mode, segments, running, completed, pause, resume, reset, adjust, tick } = state;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [running, tick]);

  const { remainingSeconds, segmentLabel, segmentKind, segmentPosition } = getTimerDisplay(state);
  const hasTimer = segments.length > 0 || mode === "stopwatch";

  if (!hasTimer) {
    return (
      <div className="sticky bottom-16 z-30 border-t border-border-subtle bg-bg-raised/95 px-4 py-3 text-center text-sm text-ink-faint backdrop-blur md:bottom-0">
        Timer controls appear here once you start a drill, set or interval.
      </div>
    );
  }

  const isRest = segmentKind === "rest" && !completed;
  const headline = completed ? "Time!" : segmentLabel || title;

  return (
    <div
      className={cn(
        "sticky bottom-16 z-30 border-t bg-bg-raised/95 px-4 py-3 backdrop-blur md:bottom-0",
        completed ? "border-accent" : isRest ? "border-info/50" : "border-border-subtle"
      )}
    >
      {/* Announced once on completion only — a per-second live region would spam screen readers. */}
      <span className="sr-only" role="status" aria-live="assertive">
        {completed ? `Time's up${title ? ` — ${title}` : ""}` : ""}
      </span>
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div
          className="min-w-0"
          role="timer"
          aria-label={`${headline || "Timer"}: ${formatDuration(remainingSeconds)} ${mode === "stopwatch" ? "elapsed" : "remaining"}`}
        >
          <p
            className={cn(
              "truncate text-xs font-medium uppercase tracking-wide",
              isRest ? "text-info" : "text-ink-faint"
            )}
            aria-hidden="true"
          >
            {headline}
            {segmentPosition && <span className="ml-1.5 text-ink-faint">· {segmentPosition}</span>}
          </p>
          <p
            className={cn(
              "font-mono text-3xl font-bold tabular-nums",
              completed ? "text-accent" : isRest ? "text-info" : "text-ink"
            )}
            aria-hidden="true"
          >
            {formatDuration(remainingSeconds)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {mode === "countdown" && (
            <button
              type="button"
              aria-label="Subtract 15 seconds"
              onClick={() => adjust(-15)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-muted hover:text-ink"
            >
              <Minus className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            aria-label={running ? "Pause timer" : "Start timer"}
            onClick={() => (running ? pause() : resume())}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground"
          >
            {running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          <button
            type="button"
            aria-label="Reset timer"
            onClick={reset}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-muted hover:text-ink"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          {mode === "countdown" && (
            <button
              type="button"
              aria-label="Add 15 seconds"
              onClick={() => adjust(15)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-muted hover:text-ink"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
