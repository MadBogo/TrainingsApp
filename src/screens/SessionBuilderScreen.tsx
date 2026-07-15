import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Zap, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { GlossaryInfo } from "@/components/GlossaryInfo";
import { PickerSection } from "@/components/builder/PickerSection";
import { useBuilderStore } from "@/store/builderStore";
import { useExerciseStore } from "@/store/exerciseStore";
import { useAthleteStore } from "@/store/athleteStore";
import { INTENSITY_PROFILES } from "@/engine/intensity";
import {
  EQUIPMENT_LABELS,
  FOCUS_AREA_LABELS,
  INTENSITY_LABELS,
  LOCATION_LABELS,
  MOVEMENT_PATTERN_LABELS,
  TRAINING_STYLE_LABELS
} from "@/data/labels";
import { EQUIPMENT, FOCUS_AREAS, INTENSITIES, LOCATIONS, MOVEMENT_PATTERNS, PLAN_LENGTHS_WEEKS, SESSION_DURATIONS, TRAINING_STYLES } from "@/domain";
import { generateWorkout } from "@/engine/generateWorkout";
import { sessionRepository, logRepository } from "@/repository";

export function SessionBuilderScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { config, planWeeks, planDaysPerWeek, setMode, update, toggleEquipment, toggleFocusArea, toggleMovementFocus, setPlanWeeks, setPlanDaysPerWeek } =
    useBuilderStore();
  const { exercises } = useExerciseStore();
  const { profile, oneRepMaxes } = useAthleteStore();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "plan") setMode("plan");
    else if (m === "train_now") setMode("train_now");
  }, [searchParams, setMode]);

  const intensityProfile = INTENSITY_PROFILES[config.intensity];

  async function handleGenerate() {
    if (!profile) return;
    setGenerating(true);
    setError(null);
    try {
      if (config.mode === "train_now") {
        const recentLogs = await logRepository.getRecent(10);
        const session = generateWorkout({
          config,
          exercises,
          oneRepMaxes,
          recentLogs
        });
        await sessionRepository.save(session);
        navigate(`/workout/${session.id}`);
      } else {
        navigate("/plan", { state: { pendingConfig: config, weeks: planWeeks, daysPerWeek: planDaysPerWeek } });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate a workout with this configuration.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-7 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Build your session</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Choose what you're training and how — the engine handles exercise selection, order and loading.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode("train_now")}
          className={`flex flex-col items-center gap-1.5 rounded-2xl border p-4 text-left transition-colors ${
            config.mode === "train_now" ? "border-accent bg-accent/10" : "border-border bg-bg-raised"
          }`}
        >
          <Zap className={`h-5 w-5 ${config.mode === "train_now" ? "text-accent" : "text-ink-muted"}`} />
          <span className="text-sm font-semibold text-ink">Train Now</span>
          <span className="text-xs text-ink-faint">One standalone workout</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("plan")}
          className={`flex flex-col items-center gap-1.5 rounded-2xl border p-4 text-left transition-colors ${
            config.mode === "plan" ? "border-accent bg-accent/10" : "border-border bg-bg-raised"
          }`}
        >
          <Calendar className={`h-5 w-5 ${config.mode === "plan" ? "text-accent" : "text-ink-muted"}`} />
          <span className="text-sm font-semibold text-ink">Training Plan</span>
          <span className="text-xs text-ink-faint">Adaptive multi-week block</span>
        </button>
      </div>

      {config.mode === "plan" && (
        <PickerSection title="Plan length &amp; frequency">
          <div className="flex flex-wrap gap-2">
            {PLAN_LENGTHS_WEEKS.map((w) => (
              <Chip key={w} active={planWeeks === w} onClick={() => setPlanWeeks(w)}>
                {w} week{w > 1 ? "s" : ""}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <label htmlFor="days-per-week" className="text-sm text-ink-muted">
              Training days per week
            </label>
            <input
              id="days-per-week"
              type="number"
              min={1}
              max={7}
              value={planDaysPerWeek}
              onChange={(e) => setPlanDaysPerWeek(Math.min(7, Math.max(1, Number(e.target.value))))}
              className="h-10 w-16 rounded-lg border border-border bg-bg-surface px-2 text-center text-sm text-ink"
            />
          </div>
        </PickerSection>
      )}

      <PickerSection title="Session duration" description="Structure scales automatically to fit the time you have.">
        <div className="flex flex-wrap gap-2">
          {SESSION_DURATIONS.map((d) => (
            <Chip key={d} active={config.durationMin === d} onClick={() => update("durationMin", d)}>
              {d} min
            </Chip>
          ))}
        </div>
      </PickerSection>

      <PickerSection title="Training style">
        <div className="flex flex-wrap gap-2">
          {TRAINING_STYLES.map((s) => (
            <Chip key={s} active={config.style === s} onClick={() => update("style", s)}>
              {TRAINING_STYLE_LABELS[s]}
            </Chip>
          ))}
        </div>
      </PickerSection>

      <PickerSection
        title="Intensity"
        info={<GlossaryInfo id="rpe" />}
      >
        <div className="flex flex-wrap gap-2">
          {INTENSITIES.map((i) => (
            <Chip key={i} active={config.intensity === i} onClick={() => update("intensity", i)}>
              {INTENSITY_LABELS[i]}
            </Chip>
          ))}
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-3 text-sm">
          <p className="text-ink">{intensityProfile.plainEnglish}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone="accent">RPE {intensityProfile.rpeRange[0]}–{intensityProfile.rpeRange[1]}</Badge>
            {intensityProfile.rirRange && (
              <Badge tone="default">RIR {intensityProfile.rirRange[0]}–{intensityProfile.rirRange[1]}</Badge>
            )}
            {intensityProfile.percentOneRmRange && (
              <Badge tone="default">
                {intensityProfile.percentOneRmRange[0]}–{intensityProfile.percentOneRmRange[1]}% 1RM
              </Badge>
            )}
          </div>
        </div>
      </PickerSection>

      <PickerSection title="Training location">
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map((l) => (
            <Chip key={l} active={config.location === l} onClick={() => update("location", l)}>
              {LOCATION_LABELS[l]}
            </Chip>
          ))}
        </div>
      </PickerSection>

      <PickerSection title="Available equipment" description="Select everything you can access for this session.">
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT.map((eq) => (
            <Chip key={eq} active={config.equipment.includes(eq)} onClick={() => toggleEquipment(eq)}>
              {EQUIPMENT_LABELS[eq]}
            </Chip>
          ))}
        </div>
      </PickerSection>

      <PickerSection title="Focus areas">
        <div className="flex flex-wrap gap-2">
          <Chip active={config.focusAreas.includes("full_body")} onClick={() => toggleFocusArea("full_body")}>
            Balanced full body
          </Chip>
          {FOCUS_AREAS.filter((f) => f !== "full_body").map((f) => (
            <Chip key={f} active={config.focusAreas.includes(f)} onClick={() => toggleFocusArea(f)}>
              {FOCUS_AREA_LABELS[f]}
            </Chip>
          ))}
        </div>
      </PickerSection>

      <PickerSection title="Movement pattern focus" description="Optional — leave blank to let the engine balance patterns.">
        <div className="flex flex-wrap gap-2">
          {MOVEMENT_PATTERNS.filter((p) => p !== "isolation").map((p) => (
            <Chip key={p} active={config.movementFocus.includes(p)} onClick={() => toggleMovementFocus(p)}>
              {MOVEMENT_PATTERN_LABELS[p]}
            </Chip>
          ))}
        </div>
      </PickerSection>

      {error && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="sticky bottom-16 md:bottom-0 md:static">
        <Button size="lg" className="w-full" onClick={handleGenerate} disabled={generating || !profile}>
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating…
            </>
          ) : config.mode === "train_now" ? (
            "Generate workout"
          ) : (
            "Build training plan"
          )}
        </Button>
      </div>
    </div>
  );
}
