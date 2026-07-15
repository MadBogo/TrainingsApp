import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GlossaryInfo } from "@/components/GlossaryInfo";
import { useAthleteStore } from "@/store/athleteStore";
import { useExerciseStore } from "@/store/exerciseStore";
import { estimateOneRepMax } from "@/engine/oneRepMax";
import { titleCaseFromId } from "@/lib/utils";
import type { Sex, EstimatedOneRM, Exercise } from "@/domain";

const LOCATIONS: { value: string; label: string }[] = [
  { value: "full_gym", label: "Full commercial gym" },
  { value: "home_gym", label: "Home gym" },
  { value: "minimal_equipment", label: "Minimal equipment" },
  { value: "hotel_gym", label: "Hotel gym" },
  { value: "outdoor", label: "Outdoor" }
];

export function ProfileScreen() {
  const { profile, oneRepMaxes, saveProfile, upsertOneRepMax } = useAthleteStore();
  const { exercises, byId: exercisesById } = useExerciseStore();
  const [form, setForm] = useState(profile);
  const [savedFlash, setSavedFlash] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  if (!form) {
    return <p className="py-12 text-center text-sm text-ink-faint">Loading profile…</p>;
  }

  async function handleSave() {
    if (!form) return;
    await saveProfile({ ...form, updatedAt: new Date().toISOString() });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile &amp; settings</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Units are metric (kg) throughout. Update your stats and benchmarks any time — the
          engine uses these to size every workout.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Athlete profile</CardTitle>
          <CardDescription>Advanced resistance-trained default, fully editable.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sex">Sex</Label>
              <Select value={form.sex} onValueChange={(v) => setForm({ ...form, sex: v as Sex })}>
                <SelectTrigger id="sex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unspecified">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">Body weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                value={form.bodyWeightKg}
                onChange={(e) => setForm({ ...form, bodyWeightKg: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                inputMode="decimal"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="location">Default training location</Label>
              <Select
                value={form.defaultLocation}
                onValueChange={(v) => setForm({ ...form, defaultLocation: v })}
              >
                <SelectTrigger id="location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button onClick={handleSave}>Save changes</Button>
            {savedFlash && <span className="text-sm text-success">Saved</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-1.5">
              Strength benchmarks
              <GlossaryInfo id="1rm" />
            </CardTitle>
            <CardDescription>
              Treated as initial estimates, never fixed maximums — the engine keeps refining these
              from your logged sets.
            </CardDescription>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {oneRepMaxes.map((orm) => (
            <BenchmarkRow
              key={orm.id}
              entry={orm}
              exerciseName={exercisesById[orm.exerciseId]?.name ?? titleCaseFromId(orm.exerciseId)}
              onSave={upsertOneRepMax}
            />
          ))}
          {oneRepMaxes.length === 0 && (
            <p className="text-sm text-ink-faint">No benchmarks yet — add one to start getting load suggestions.</p>
          )}
        </CardContent>
      </Card>

      <AddBenchmarkDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        exercises={exercises.filter((e) => e.loadable)}
        onAdd={upsertOneRepMax}
      />
    </div>
  );
}

function BenchmarkRow({
  entry,
  exerciseName,
  onSave
}: {
  entry: EstimatedOneRM;
  exerciseName: string;
  onSave: (entry: EstimatedOneRM) => Promise<void>;
}) {
  const [value, setValue] = useState(entry.valueKg);
  const dirty = value !== entry.valueKg;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle bg-bg-surface p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{exerciseName}</p>
        <p className="truncate text-xs text-ink-faint">{entry.source}</p>
      </div>
      <Badge tone={entry.confidence === "high" ? "success" : entry.confidence === "medium" ? "accent" : "default"}>
        {entry.confidence} confidence
      </Badge>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-24"
          aria-label={`Estimated 1RM for ${exerciseName}`}
        />
        <span className="text-sm text-ink-muted">kg</span>
      </div>
      <Button
        size="sm"
        variant={dirty ? "primary" : "secondary"}
        disabled={!dirty}
        onClick={() =>
          onSave({
            ...entry,
            valueKg: value,
            method: "actual_1rm",
            confidence: "high",
            source: "Manually edited",
            lastUpdated: new Date().toISOString()
          })
        }
      >
        Save
      </Button>
    </div>
  );
}

type InputMethod = "actual" | "top_set";

function AddBenchmarkDialog({
  open,
  onOpenChange,
  exercises,
  onAdd
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercises: Exercise[];
  onAdd: (entry: EstimatedOneRM) => Promise<void>;
}) {
  const [exerciseId, setExerciseId] = useState<string>("");
  const [method, setMethod] = useState<InputMethod>("actual");
  const [weight, setWeight] = useState<number | "">("");
  const [reps, setReps] = useState<number | "">("");
  const [rpe, setRpe] = useState<number | "">("");

  const sorted = useMemo(() => [...exercises].sort((a, b) => a.name.localeCompare(b.name)), [exercises]);
  const canSave = exerciseId !== "" && weight !== "" && (method === "actual" || reps !== "");

  function reset() {
    setExerciseId("");
    setMethod("actual");
    setWeight("");
    setReps("");
    setRpe("");
  }

  async function handleAdd() {
    if (!canSave) return;
    const valueKg =
      method === "actual" ? Number(weight) : estimateOneRepMax(Number(weight), Number(reps), rpe === "" ? undefined : Number(rpe));
    await onAdd({
      id: uuid(),
      exerciseId,
      valueKg,
      method: method === "actual" ? "actual_1rm" : "top_set",
      source: method === "actual" ? "Manually entered 1RM" : `Top set: ${weight}kg × ${reps}${rpe !== "" ? ` @ RPE ${rpe}` : ""}`,
      confidence: method === "actual" ? "high" : rpe !== "" ? "medium" : "low",
      lastUpdated: new Date().toISOString()
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogTitle>Add a benchmark</DialogTitle>
        <DialogDescription>Log an exercise's strength so the engine can suggest loads for it.</DialogDescription>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="benchmark-exercise">Exercise</Label>
            <Select value={exerciseId} onValueChange={setExerciseId}>
              <SelectTrigger id="benchmark-exercise">
                <SelectValue placeholder="Choose an exercise" />
              </SelectTrigger>
              <SelectContent>
                {sorted.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Chip active={method === "actual"} onClick={() => setMethod("actual")}>
              I know my 1RM
            </Chip>
            <Chip active={method === "top_set"} onClick={() => setMethod("top_set")}>
              Recent top set
            </Chip>
          </div>

          {method === "actual" ? (
            <div className="space-y-1.5">
              <Label htmlFor="benchmark-1rm">1RM (kg)</Label>
              <Input
                id="benchmark-1rm"
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="benchmark-weight">Weight (kg)</Label>
                <Input
                  id="benchmark-weight"
                  type="number"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="benchmark-reps">Reps</Label>
                <Input
                  id="benchmark-reps"
                  type="number"
                  inputMode="numeric"
                  value={reps}
                  onChange={(e) => setReps(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="benchmark-rpe">RPE (optional)</Label>
                <Input
                  id="benchmark-rpe"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10}
                  value={rpe}
                  onChange={(e) => setRpe(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
            </div>
          )}

          <Button className="w-full" disabled={!canSave} onClick={handleAdd}>
            Add benchmark
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
