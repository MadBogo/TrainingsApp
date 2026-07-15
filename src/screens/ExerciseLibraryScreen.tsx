import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ExerciseDetailSheet } from "@/components/ExerciseDetailSheet";
import { useExerciseStore } from "@/store/exerciseStore";
import { EQUIPMENT_LABELS, FOCUS_AREA_LABELS, MOVEMENT_PATTERN_LABELS } from "@/data/labels";
import { FOCUS_AREAS, MOVEMENT_PATTERNS } from "@/domain";
import type { Equipment, Exercise, FocusArea, MovementPattern } from "@/domain";

export function ExerciseLibraryScreen() {
  const { exercises, loading } = useExerciseStore();
  const [query, setQuery] = useState("");
  const [pattern, setPattern] = useState<MovementPattern | "all">("all");
  const [muscle, setMuscle] = useState<FocusArea | "all">("all");
  const [equipmentFilter, setEquipmentFilter] = useState<Equipment | null>(null);
  const [selected, setSelected] = useState<Exercise | null>(null);

  const equipmentInLibrary = useMemo(() => {
    const set = new Set<Equipment>();
    exercises.forEach((e) => e.equipment.forEach((eq) => set.add(eq)));
    return Array.from(set).sort();
  }, [exercises]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((e) => {
      if (q && !e.name.toLowerCase().includes(q)) return false;
      if (pattern !== "all" && !e.patterns.includes(pattern)) return false;
      if (muscle !== "all" && !e.primaryMuscles.includes(muscle) && !e.secondaryMuscles?.includes(muscle)) return false;
      if (equipmentFilter && !e.equipment.includes(equipmentFilter)) return false;
      return true;
    });
  }, [exercises, query, pattern, muscle, equipmentFilter]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Exercise library</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {exercises.length} movements — instructions, muscles, equipment and substitutions.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises…"
          className="pl-9"
          aria-label="Search exercises"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select value={pattern} onValueChange={(v) => setPattern(v as MovementPattern | "all")}>
          <SelectTrigger aria-label="Filter by movement pattern">
            <SelectValue placeholder="All patterns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All patterns</SelectItem>
            {MOVEMENT_PATTERNS.map((p) => (
              <SelectItem key={p} value={p}>
                {MOVEMENT_PATTERN_LABELS[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={muscle} onValueChange={(v) => setMuscle(v as FocusArea | "all")}>
          <SelectTrigger aria-label="Filter by muscle group">
            <SelectValue placeholder="All muscle groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All muscle groups</SelectItem>
            {FOCUS_AREAS.map((f) => (
              <SelectItem key={f} value={f}>
                {FOCUS_AREA_LABELS[f]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
        <Chip active={equipmentFilter === null} onClick={() => setEquipmentFilter(null)}>
          All equipment
        </Chip>
        {equipmentInLibrary.map((eq) => (
          <Chip key={eq} active={equipmentFilter === eq} onClick={() => setEquipmentFilter(eq === equipmentFilter ? null : eq)}>
            {EQUIPMENT_LABELS[eq]}
          </Chip>
        ))}
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-ink-faint">Loading exercise library…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((exercise) => (
            <Card
              key={exercise.id}
              className="cursor-pointer transition-colors hover:border-accent/40"
              onClick={() => setSelected(exercise)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(exercise);
                }
              }}
            >
              <CardContent className="pt-4">
                <p className="font-semibold text-ink">{exercise.name}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {exercise.primaryMuscles.slice(0, 2).map((m) => (
                    <Badge key={m} tone="default">
                      {FOCUS_AREA_LABELS[m]}
                    </Badge>
                  ))}
                  {exercise.isTechnical && <Badge tone="warning">Technical</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 py-8 text-center text-sm text-ink-faint">
              No exercises match your filters.
            </p>
          )}
        </div>
      )}

      <ExerciseDetailSheet exercise={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
