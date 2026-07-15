import { useState } from "react";
import { Play, Info } from "lucide-react";
import type { BlockExercise, Exercise, LoadFeedback, WorkoutBlock } from "@/domain";
import { useTimerStore } from "@/store/timerStore";
import { useLiveWorkoutStore } from "@/store/liveWorkoutStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExerciseDetailSheet } from "@/components/ExerciseDetailSheet";
import { GlossaryInfo } from "@/components/GlossaryInfo";
import { formatDuration } from "@/lib/utils";

function ExerciseCuesAndLoad({ be, onInfo }: { be: BlockExercise; onInfo: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <button onClick={onInfo} className="text-left font-semibold text-ink hover:text-accent">
          {be.exerciseName}
        </button>
        {be.coachingCues[0] && <p className="mt-0.5 text-xs text-ink-faint">{be.coachingCues[0]}</p>}
        {be.loadRange && (
          <p className="mt-1 flex items-center gap-1 text-sm text-accent">
            {be.loadRange.minKg}–{be.loadRange.maxKg} kg
            {be.loadRange.targetRpe && (
              <span className="inline-flex items-center gap-1 text-ink-muted">
                {" "}
                · RPE {be.loadRange.targetRpe[0]}–{be.loadRange.targetRpe[1]}
                <GlossaryInfo id="rpe" />
              </span>
            )}
          </p>
        )}
        {be.bodyweightNote && <p className="mt-1 text-sm text-ink-muted">{be.bodyweightNote}</p>}
      </div>
      <button onClick={onInfo} aria-label={`Details for ${be.exerciseName}`} className="shrink-0 text-ink-faint hover:text-accent">
        <Info className="h-4 w-4" />
      </button>
    </div>
  );
}

function DrillExercise({ be, onInfo }: { be: BlockExercise; onInfo: () => void }) {
  const start = useTimerStore((s) => s.start);
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-3">
      <ExerciseCuesAndLoad be={be} onInfo={onInfo} />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-ink-faint">{formatDuration(be.durationSec ?? 30)}</span>
        <Button size="sm" variant="secondary" onClick={() => start(be.durationSec ?? 30, be.exerciseName)}>
          <Play className="h-3.5 w-3.5" /> Start
        </Button>
      </div>
    </div>
  );
}

const FEEDBACK_OPTIONS: { value: LoadFeedback; label: string }[] = [
  { value: "too_easy", label: "Too easy" },
  { value: "on_target", label: "On target" },
  { value: "too_hard", label: "Too hard" }
];

function SetsExercise({ be, onInfo, restSec }: { be: BlockExercise; onInfo: () => void; restSec?: number }) {
  const start = useTimerStore((s) => s.start);
  const updateLiveSet = useLiveWorkoutStore((s) => s.updateSet);
  const totalSets = be.sets ?? 1;
  const [completedSets, setCompletedSets] = useState(0);
  const [awaitingFeedbackFor, setAwaitingFeedbackFor] = useState<number | null>(null);

  function completeSet(index: number) {
    const next = index + 1;
    setCompletedSets(next);
    setAwaitingFeedbackFor(index);
    if (next < totalSets && (restSec ?? be.restSec)) {
      start(restSec ?? be.restSec ?? 60, `Rest — ${be.exerciseName}`);
    }
  }

  function giveFeedback(index: number, feedback: LoadFeedback) {
    updateLiveSet(`${be.id}-${index}`, { feedback });
    setAwaitingFeedbackFor(null);
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-3">
      <ExerciseCuesAndLoad be={be} onInfo={onInfo} />
      <p className="mt-2 flex items-center gap-1 text-sm text-ink-muted">
        {totalSets} sets × {be.reps ?? "-"} reps
        {be.tempo && (
          <span className="inline-flex items-center gap-1">
            · Tempo {be.tempo}
            <GlossaryInfo id="tempo" />
          </span>
        )}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {Array.from({ length: totalSets }).map((_, i) => (
          <button
            key={i}
            onClick={() => completeSet(i)}
            aria-pressed={i < completedSets}
            aria-label={`${be.exerciseName} set ${i + 1} of ${totalSets}${i < completedSets ? ", completed" : ""}`}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold ${
              i < completedSets ? "border-accent bg-accent/15 text-accent" : "border-border text-ink-muted"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {awaitingFeedbackFor !== null && (
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="How did that set feel?">
          {FEEDBACK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => giveFeedback(awaitingFeedbackFor, opt.value)}
              className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-muted hover:border-accent hover:text-accent"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConditioningControls({ block }: { block: WorkoutBlock }) {
  const start = useTimerStore((s) => s.start);

  if (block.format === "interval") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => start(block.intervalWorkSec ?? 30, "Work")}>
          Start work ({block.intervalWorkSec}s)
        </Button>
        <Button size="sm" variant="secondary" onClick={() => start(block.intervalRestSec ?? 20, "Rest")}>
          Start rest ({block.intervalRestSec}s)
        </Button>
        <Badge tone="default">{block.rounds} rounds</Badge>
      </div>
    );
  }
  if (block.format === "emom") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => start(block.intervalWorkSec ?? 60, "This minute")}>
          <Play className="h-3.5 w-3.5" /> Start minute
        </Button>
        <Badge tone="default">{block.rounds} min total</Badge>
      </div>
    );
  }
  if (block.format === "amrap") {
    return (
      <Button size="sm" onClick={() => start(block.timeCapMin * 60, block.title)}>
        <Play className="h-3.5 w-3.5" /> Start {block.timeCapMin}:00 clock
      </Button>
    );
  }
  // for_time / chipper
  return (
    <Button size="sm" onClick={() => start(0, block.title, "stopwatch")}>
      <Play className="h-3.5 w-3.5" /> Start clock
    </Button>
  );
}

export function WorkoutBlockView({ block, exercisesById }: { block: WorkoutBlock; exercisesById: Record<string, Exercise> }) {
  const [detail, setDetail] = useState<Exercise | null>(null);

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-ink">{block.title}</h2>
          {block.format === "amrap" && <GlossaryInfo id="amrap" />}
          {block.format === "emom" && <GlossaryInfo id="emom" />}
        </div>
        {block.instructions && <p className="mt-0.5 text-sm text-ink-muted">{block.instructions}</p>}
      </div>

      {(block.format === "amrap" || block.format === "for_time" || block.format === "interval" || block.format === "emom") && (
        <ConditioningControls block={block} />
      )}

      <div className="space-y-2">
        {block.exercises.map((be) =>
          block.format === "duration" ? (
            <DrillExercise key={be.id} be={be} onInfo={() => setDetail(exercisesById[be.exerciseId] ?? null)} />
          ) : block.format === "sets_reps" || block.format === "complex" ? (
            <SetsExercise key={be.id} be={be} onInfo={() => setDetail(exercisesById[be.exerciseId] ?? null)} />
          ) : (
            <div key={be.id} className="rounded-xl border border-border-subtle bg-bg-surface p-3">
              <ExerciseCuesAndLoad be={be} onInfo={() => setDetail(exercisesById[be.exerciseId] ?? null)} />
              <p className="mt-1 text-sm text-ink-muted">{be.reps} reps</p>
            </div>
          )
        )}
      </div>

      <ExerciseDetailSheet exercise={detail} open={!!detail} onOpenChange={(o) => !o && setDetail(null)} />
    </div>
  );
}
