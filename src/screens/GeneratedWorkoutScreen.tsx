import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftRight, Clock, Dumbbell, Play, RefreshCw, Settings2, Target } from "lucide-react";
import type { GeneratedSession } from "@/domain";
import { sessionRepository, logRepository } from "@/repository";
import { useExerciseStore } from "@/store/exerciseStore";
import { useAthleteStore } from "@/store/athleteStore";
import { useBuilderStore } from "@/store/builderStore";
import { generateWorkout, swapExerciseInSession } from "@/engine/generateWorkout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BLOCK_ROLE_LABELS, EQUIPMENT_LABELS, INTENSITY_LABELS, MOVEMENT_PATTERN_LABELS, TRAINING_STYLE_LABELS } from "@/data/labels";

export function GeneratedWorkoutScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<GeneratedSession | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [swapOpenFor, setSwapOpenFor] = useState<string | null>(null);
  const { exercises } = useExerciseStore();
  const { oneRepMaxes } = useAthleteStore();

  useEffect(() => {
    if (!id) return;
    sessionRepository.getById(id).then((s) => setSession(s ?? null));
  }, [id]);

  async function handleRegenerate() {
    if (!session) return;
    setRegenerating(true);
    try {
      const recentLogs = await logRepository.getRecent(10);
      const avoidExerciseIds = session.blocks.flatMap((b) => b.exercises.map((e) => e.exerciseId));
      const next = generateWorkout({ config: session.config, exercises, oneRepMaxes, recentLogs, avoidExerciseIds });
      await sessionRepository.save(next);
      navigate(`/workout/${next.id}`, { replace: true });
    } finally {
      setRegenerating(false);
    }
  }

  function handleEdit() {
    if (!session) return;
    useBuilderStore.setState({ config: session.config });
    navigate("/build");
  }

  async function handleSwap(blockId: string, blockExerciseId: string, newExerciseId: string) {
    if (!session) return;
    const next = swapExerciseInSession(session, blockId, blockExerciseId, newExerciseId, exercises, oneRepMaxes);
    await sessionRepository.save(next);
    setSession(next);
    setSwapOpenFor(null);
  }

  if (!session) {
    return <p className="py-16 text-center text-sm text-ink-faint">Loading workout…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{TRAINING_STYLE_LABELS[session.config.style]}</Badge>
          <Badge tone="default">{INTENSITY_LABELS[session.config.intensity]}</Badge>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{session.title}</h1>
        <p className="mt-1 text-sm text-ink-muted">{session.intention}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <Card>
          <CardContent className="pt-4">
            <Clock className="mx-auto h-4 w-4 text-ink-faint" />
            <p className="mt-1 text-lg font-bold text-ink">{session.estimatedDurationMin}</p>
            <p className="text-[11px] text-ink-faint">minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Target className="mx-auto h-4 w-4 text-ink-faint" />
            <p className="mt-1 text-lg font-bold text-ink">{session.primaryPatterns.length}</p>
            <p className="text-[11px] text-ink-faint">patterns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Dumbbell className="mx-auto h-4 w-4 text-ink-faint" />
            <p className="mt-1 text-lg font-bold text-ink">{session.equipmentRequired.length}</p>
            <p className="text-[11px] text-ink-faint">equipment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-3 pt-4">
          <p className="text-sm text-ink">{session.effortGuidance}</p>
          <div className="flex flex-wrap gap-1.5">
            {session.primaryPatterns.map((p) => (
              <Badge key={p} tone="default">
                {MOVEMENT_PATTERN_LABELS[p]}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {session.equipmentRequired.map((eq) => (
              <Badge key={eq} tone="default">
                {EQUIPMENT_LABELS[eq]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {session.fatigueNotes.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="space-y-1.5 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-warning">Recovery notes</p>
            {session.fatigueNotes.map((n, i) => (
              <p key={i} className="text-sm text-ink-muted">
                {n}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {session.blocks.map((block) => (
          <Card key={block.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{block.title}</p>
                <Badge tone="default">{BLOCK_ROLE_LABELS[block.role]}</Badge>
              </div>
              <ul className="mt-2 space-y-1">
                {block.exercises.map((e) => (
                  <li key={e.id} className="text-sm text-ink-muted">
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        {e.exerciseName}
                        {e.sets ? ` — ${e.sets}×${e.reps}` : e.reps ? ` — ${e.reps}` : ""}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        {e.loadRange ? (
                          <Badge tone="accent">
                            {e.loadRange.minKg}–{e.loadRange.maxKg} kg
                          </Badge>
                        ) : e.bodyweightNote === "Bodyweight" ? (
                          <Badge tone="default">Bodyweight</Badge>
                        ) : null}
                        {e.substitutions.length > 0 && (
                          <button
                            type="button"
                            aria-label={`Swap ${e.exerciseName} for a substitute`}
                            aria-expanded={swapOpenFor === e.id}
                            onClick={() => setSwapOpenFor(swapOpenFor === e.id ? null : e.id)}
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                              swapOpenFor === e.id
                                ? "border-accent text-accent"
                                : "border-border text-ink-faint hover:text-accent"
                            }`}
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </span>
                    </div>
                    {swapOpenFor === e.id && (
                      <div className="mt-1.5 space-y-1.5 rounded-lg border border-border-subtle bg-bg-surface p-2">
                        {e.substitutions.map((sub) => (
                          <button
                            key={sub.exerciseId}
                            type="button"
                            onClick={() => handleSwap(block.id, e.id, sub.exerciseId)}
                            className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-bg-elevated"
                          >
                            <span className="font-medium text-ink">{sub.exerciseName}</span>
                            <span className="block text-xs text-ink-faint">{sub.reason}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-16 flex gap-2 md:bottom-0 md:static">
        <Button variant="secondary" size="lg" onClick={handleEdit}>
          <Settings2 className="h-4 w-4" /> Edit
        </Button>
        <Button variant="secondary" size="lg" onClick={handleRegenerate} disabled={regenerating}>
          <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} /> Regenerate
        </Button>
        <Button size="lg" className="flex-1" onClick={() => navigate(`/workout/${session.id}/live`)}>
          <Play className="h-4 w-4" /> Start workout
        </Button>
      </div>
    </div>
  );
}
