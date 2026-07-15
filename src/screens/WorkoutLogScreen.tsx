import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { AlertTriangle, Check } from "lucide-react";
import type { ConditioningResult, GeneratedSession } from "@/domain";
import { sessionRepository, logRepository, athleteRepository } from "@/repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RPESelector } from "@/components/RPESelector";
import { SCORE_TYPE_LABELS } from "@/data/labels";
import { buildDraftSets, type DraftSet } from "@/engine/draftSets";
import { deriveOneRmUpdates } from "@/engine/progressionUpdate";
import { useLiveWorkoutStore } from "@/store/liveWorkoutStore";
import { useExerciseStore } from "@/store/exerciseStore";
import { useAthleteStore } from "@/store/athleteStore";

const FEEDBACK_LABEL: Record<string, string> = {
  too_easy: "Too easy",
  on_target: "On target",
  too_hard: "Too hard"
};

export function WorkoutLogScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<GeneratedSession | null>(null);
  const [completed, setCompleted] = useState(true);
  const [sets, setSets] = useState<DraftSet[]>([]);
  const [conditioning, setConditioning] = useState<ConditioningResult[]>([]);
  const [sessionRpe, setSessionRpe] = useState<number>();
  const [note, setNote] = useState("");
  const [painFlag, setPainFlag] = useState(false);
  const [painNote, setPainNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const exercisesById = useExerciseStore((s) => s.byId);
  const refreshOneRepMaxes = useAthleteStore((s) => s.refreshOneRepMaxes);

  useEffect(() => {
    if (!id) return;
    sessionRepository.getById(id).then((s) => {
      if (!s) return;
      setSession(s);
      const live = useLiveWorkoutStore.getState();
      setSets(live.sessionId === s.id && live.sets.length > 0 ? live.sets : buildDraftSets(s));
      setConditioning(
        s.blocks
          .filter((b) => b.role === "conditioning" && b.scoreType)
          .map((b) => ({ scoreType: b.scoreType!, value: "" }))
      );
    });
  }, [id]);

  const groupedByBlock = useMemo(() => {
    const groups = new Map<string, DraftSet[]>();
    for (const s of sets) {
      const list = groups.get(s.blockTitle) ?? [];
      list.push(s);
      groups.set(s.blockTitle, list);
    }
    return Array.from(groups.entries());
  }, [sets]);

  function updateSet(setId: string, patch: Partial<DraftSet>) {
    setSets((prev) => prev.map((s) => (s.id === setId ? { ...s, ...patch } : s)));
  }

  async function handleSave() {
    if (!session) return;
    setSaving(true);
    try {
      const loggedSets = sets.map(({ blockTitle: _blockTitle, ...s }) => s);
      await logRepository.save({
        id: uuid(),
        sessionId: session.id,
        date: new Date().toISOString(),
        completed,
        loggedSets,
        conditioningResults: conditioning.filter((c) => c.value.trim() !== ""),
        sessionRpe,
        note: note.trim() || undefined,
        painFlag,
        painNote: painFlag ? painNote.trim() || undefined : undefined
      });

      const existingOrms = await athleteRepository.getOneRepMaxes();
      const existingByExerciseId = Object.fromEntries(existingOrms.map((o) => [o.exerciseId, o]));
      const updates = deriveOneRmUpdates(loggedSets, exercisesById, existingByExerciseId);
      if (updates.length > 0) {
        await athleteRepository.bulkUpsertOneRepMaxes(updates);
        await refreshOneRepMaxes();
      }

      useLiveWorkoutStore.getState().clear();
      setSaved(true);
      setTimeout(() => navigate("/"), 900);
    } finally {
      setSaving(false);
    }
  }

  if (!session) {
    return <p className="py-16 text-center text-sm text-ink-faint">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Log this session</h1>
        <p className="mt-1 text-sm text-ink-muted">{session.title}</p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between pt-4">
          <div>
            <p className="text-sm font-semibold text-ink">Completed the full session</p>
            <p className="text-xs text-ink-faint">Turn off if you stopped early or skipped blocks.</p>
          </div>
          <Switch checked={completed} onCheckedChange={setCompleted} aria-label="Completed the full session" />
        </CardContent>
      </Card>

      {groupedByBlock.map(([blockTitle, blockSets]) => (
        <Card key={blockTitle}>
          <CardHeader>
            <CardTitle>{blockTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(
              blockSets.reduce<Record<string, DraftSet[]>>((acc, s) => {
                (acc[s.exerciseName] ??= []).push(s);
                return acc;
              }, {})
            ).map(([exerciseName, exerciseSets]) => (
              <div key={exerciseName} className="rounded-lg border border-border-subtle bg-bg-surface p-2.5">
                <p className="mb-2 text-sm font-medium text-ink">{exerciseName}</p>
                <div className="space-y-1.5">
                  {exerciseSets.map((s, idx) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <span className="w-5 text-xs text-ink-faint">{idx + 1}</span>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={s.weightKg ?? ""}
                        onChange={(e) => updateSet(s.id, { weightKg: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="kg"
                        aria-label={`${exerciseName} set ${idx + 1} weight in kg`}
                        className="h-9 w-20"
                      />
                      <span className="text-xs text-ink-faint">kg ×</span>
                      <Input
                        type="number"
                        inputMode="numeric"
                        value={s.reps ?? ""}
                        onChange={(e) => updateSet(s.id, { reps: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="reps"
                        aria-label={`${exerciseName} set ${idx + 1} reps`}
                        className="h-9 w-20"
                      />
                      <span className="text-xs text-ink-faint">reps</span>
                      {s.feedback && <Badge tone="default">{FEEDBACK_LABEL[s.feedback]}</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {conditioning.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conditioning score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conditioning.map((c, i) => (
              <div key={i} className="space-y-1">
                <Label htmlFor={`cond-${i}`}>{SCORE_TYPE_LABELS[c.scoreType]}</Label>
                <Input
                  id={`cond-${i}`}
                  value={c.value}
                  onChange={(e) =>
                    setConditioning((prev) => prev.map((p, pi) => (pi === i ? { ...p, value: e.target.value } : p)))
                  }
                  placeholder={c.scoreType === "time" ? "e.g. 18:32" : c.scoreType === "rounds_reps" ? "e.g. 5 rounds + 12 reps" : "Score"}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-5 pt-4">
          <RPESelector value={sessionRpe} onChange={setSessionRpe} />

          <div className="space-y-1.5">
            <Label htmlFor="note">Notes</Label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="How did it feel? Anything to remember for next time?"
              className="w-full rounded-xl border border-border bg-bg-surface p-3 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm font-semibold text-ink">Pain or discomfort</span>
            </div>
            <Switch checked={painFlag} onCheckedChange={setPainFlag} aria-label="Flag pain or discomfort" />
          </div>
          {painFlag && (
            <Input
              value={painNote}
              onChange={(e) => setPainNote(e.target.value)}
              placeholder="Where, and what did it feel like?"
              aria-label="Pain or discomfort details"
            />
          )}
        </CardContent>
      </Card>

      <Button size="lg" className="w-full" onClick={handleSave} disabled={saving}>
        {saved ? (
          <>
            <Check className="h-4 w-4" /> Saved
          </>
        ) : saving ? (
          "Saving…"
        ) : (
          "Save session"
        )}
      </Button>
    </div>
  );
}
