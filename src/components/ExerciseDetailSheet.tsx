import { Video, ArrowDown, ArrowUp } from "lucide-react";
import type { Exercise } from "@/domain";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  EQUIPMENT_LABELS,
  FOCUS_AREA_LABELS,
  MOVEMENT_PATTERN_LABELS
} from "@/data/labels";
import { getExerciseById } from "@/data/exercises";

export function ExerciseDetailSheet({
  exercise,
  open,
  onOpenChange
}: {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!exercise) return null;
  const scaling = exercise.scalingExerciseId ? getExerciseById(exercise.scalingExerciseId) : undefined;
  const progression = exercise.progressionExerciseId
    ? getExerciseById(exercise.progressionExerciseId)
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="sheet" className="max-w-lg sm:mx-auto">
        <DialogTitle>{exercise.name}</DialogTitle>
        <DialogDescription className="mt-1.5 text-sm leading-relaxed text-ink-muted">
          {exercise.description}
        </DialogDescription>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {exercise.patterns.map((p) => (
            <Badge key={p} tone="accent">
              {MOVEMENT_PATTERN_LABELS[p]}
            </Badge>
          ))}
          <Badge tone="default">{exercise.difficulty}</Badge>
        </div>

        <div className="mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed border-border bg-bg-surface text-ink-faint">
          <Video className="mr-2 h-5 w-5" /> Video placeholder
        </div>

        <section className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Muscles worked</h3>
          <p className="mt-1 text-sm text-ink">
            {exercise.primaryMuscles.map((m) => FOCUS_AREA_LABELS[m]).join(", ")}
            {exercise.secondaryMuscles?.length ? (
              <span className="text-ink-muted"> (secondary: {exercise.secondaryMuscles.map((m) => FOCUS_AREA_LABELS[m]).join(", ")})</span>
            ) : null}
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Equipment</h3>
          <p className="mt-1 text-sm text-ink">
            {exercise.equipment.map((e) => EQUIPMENT_LABELS[e]).join(", ")}
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Coaching cues</h3>
          <ul className="mt-1.5 space-y-1">
            {exercise.cues.map((cue, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink">
                <span className="text-accent">•</span>
                {cue}
              </li>
            ))}
          </ul>
        </section>

        {exercise.substitutions.length > 0 && (
          <section className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Substitutions</h3>
            <ul className="mt-1.5 space-y-2">
              {exercise.substitutions.map((s) => {
                const sub = getExerciseById(s.exerciseId);
                if (!sub) return null;
                return (
                  <li key={s.exerciseId} className="rounded-lg border border-border-subtle bg-bg-surface p-2.5">
                    <p className="text-sm font-medium text-ink">{sub.name}</p>
                    <p className="text-xs text-ink-faint">{s.reason}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {(scaling || progression) && (
          <section className="mt-4 grid grid-cols-2 gap-2">
            {scaling && (
              <div className="rounded-lg border border-border-subtle bg-bg-surface p-2.5">
                <p className="flex items-center gap-1 text-xs font-semibold text-ink-faint">
                  <ArrowDown className="h-3.5 w-3.5" /> Scale down
                </p>
                <p className="mt-0.5 text-sm text-ink">{scaling.name}</p>
              </div>
            )}
            {progression && (
              <div className="rounded-lg border border-border-subtle bg-bg-surface p-2.5">
                <p className="flex items-center gap-1 text-xs font-semibold text-ink-faint">
                  <ArrowUp className="h-3.5 w-3.5" /> Progress to
                </p>
                <p className="mt-0.5 text-sm text-ink">{progression.name}</p>
              </div>
            )}
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}
