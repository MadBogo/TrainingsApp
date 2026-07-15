import { useEffect } from "react";
import { Play, Pause, RotateCcw, Minus, Plus } from "lucide-react";
import { useTimerStore } from "@/store/timerStore";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function GlobalTimerBar() {
  const { label, mode, totalSeconds, elapsedSeconds, running, completed, pause, resume, reset, adjust, tick } =
    useTimerStore();

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [running, tick]);

  const display = mode === "countdown" ? Math.max(0, totalSeconds - elapsedSeconds) : elapsedSeconds;
  const hasTimer = totalSeconds > 0 || mode === "stopwatch";

  if (!hasTimer) {
    return (
      <div className="sticky bottom-16 z-30 border-t border-border-subtle bg-bg-raised/95 px-4 py-3 text-center text-sm text-ink-faint backdrop-blur md:bottom-0">
        Timer controls appear here once you start a drill, set or interval.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "sticky bottom-16 z-30 border-t bg-bg-raised/95 px-4 py-3 backdrop-blur md:bottom-0",
        completed ? "border-accent" : "border-border-subtle"
      )}
    >
      {/* Announced once on completion only — a per-second live region would spam screen readers. */}
      <span className="sr-only" role="status" aria-live="assertive">
        {completed ? `Time's up${label ? ` — ${label}` : ""}` : ""}
      </span>
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0" role="timer" aria-label={`${label || "Timer"}: ${formatDuration(display)} remaining`}>
          <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-faint" aria-hidden="true">
            {completed ? "Time!" : label}
          </p>
          <p
            className={cn("font-mono text-3xl font-bold tabular-nums", completed ? "text-accent" : "text-ink")}
            aria-hidden="true"
          >
            {formatDuration(display)}
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
