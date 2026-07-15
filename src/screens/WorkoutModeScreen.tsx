import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GeneratedSession } from "@/domain";
import { sessionRepository } from "@/repository";
import { useExerciseStore } from "@/store/exerciseStore";
import { useTimerStore } from "@/store/timerStore";
import { useLiveWorkoutStore } from "@/store/liveWorkoutStore";
import { Button } from "@/components/ui/button";
import { WorkoutBlockView } from "@/components/workout/WorkoutBlockView";
import { GlobalTimerBar } from "@/components/workout/GlobalTimerBar";

export function WorkoutModeScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { byId: exercisesById } = useExerciseStore();
  const [session, setSession] = useState<GeneratedSession | null>(null);
  const [blockIndex, setBlockIndex] = useState(0);
  const resetTimer = useTimerStore((s) => s.reset);

  useEffect(() => {
    if (!id) return;
    sessionRepository.getById(id).then((s) => {
      setSession(s ?? null);
      if (s) useLiveWorkoutStore.getState().startSession(s);
    });
  }, [id]);

  useEffect(() => {
    resetTimer();
  }, [blockIndex, resetTimer]);

  if (!session) {
    return <p className="py-16 text-center text-sm text-ink-faint">Loading workout…</p>;
  }

  const block = session.blocks[blockIndex];
  const isLast = blockIndex === session.blocks.length - 1;

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-bg">
      <header className="safe-top flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <button
          onClick={() => navigate(`/workout/${session.id}`)}
          aria-label="Exit Workout Mode"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-elevated hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex gap-1">
          {session.blocks.map((b, i) => (
            <span
              key={b.id}
              className={`h-1.5 w-6 rounded-full ${i === blockIndex ? "bg-accent" : i < blockIndex ? "bg-ink-faint" : "bg-bg-elevated"}`}
            />
          ))}
        </div>
        <span className="text-xs text-ink-faint">
          {blockIndex + 1}/{session.blocks.length}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <WorkoutBlockView block={block} exercisesById={exercisesById} />
      </div>

      <GlobalTimerBar />

      <div className="safe-bottom flex items-center gap-3 border-t border-border-subtle px-4 py-3">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          disabled={blockIndex === 0}
          onClick={() => setBlockIndex((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        {isLast ? (
          <Button size="lg" className="flex-1" onClick={() => navigate(`/workout/${session.id}/log`)}>
            Finish workout
          </Button>
        ) : (
          <Button size="lg" className="flex-1" onClick={() => setBlockIndex((i) => Math.min(session.blocks.length - 1, i + 1))}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
