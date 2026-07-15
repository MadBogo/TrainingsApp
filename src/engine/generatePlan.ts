import { v4 as uuid } from "uuid";
import type {
  EstimatedOneRM,
  Exercise,
  GeneratedSession,
  Intensity,
  LoggedSession,
  PlanLengthWeeks,
  PlannedSession,
  SessionConfig,
  TrainingPlan,
  TrainingStyle
} from "@/domain";
import { generateWorkout } from "./generateWorkout";
import { getStyleFamily, type StyleFamily } from "./blockTemplates";
import { INTENSITIES } from "@/domain";

const COMPLEMENTARY_STYLES: Record<StyleFamily, TrainingStyle[]> = {
  strength: ["functional_fitness", "zone2", "hiit"],
  metcon: ["strength", "zone2", "hypertrophy"],
  single_block: ["strength", "functional_fitness", "mobility"],
  skill: ["strength", "zone2", "functional_fitness"]
};

/** Styles that exist to support recovery — capped to a mild intensity regardless of the plan's base intensity. */
const RECOVERY_STYLE_CAP: Partial<Record<TrainingStyle, Intensity>> = {
  regenerative: "recovery",
  mobility: "recovery",
  stretching: "recovery",
  zone2: "moderate"
};

function capIntensity(base: Intensity, cap: Intensity): Intensity {
  return INTENSITIES.indexOf(base) > INTENSITIES.indexOf(cap) ? cap : base;
}

function buildWeekStyles(primaryStyle: TrainingStyle, daysPerWeek: number, weekIndex: number): TrainingStyle[] {
  const family = getStyleFamily(primaryStyle);
  const complements = COMPLEMENTARY_STYLES[family];
  const cycle: TrainingStyle[] = [];
  for (let i = 0; i < 7; i++) {
    cycle.push(i % 2 === 0 ? primaryStyle : complements[(i >> 1) % complements.length]);
  }
  const offset = weekIndex % cycle.length;
  const rotated = [...cycle.slice(offset), ...cycle.slice(0, offset)];
  return rotated.slice(0, daysPerWeek);
}

function getDeloadWeekIndices(weeks: PlanLengthWeeks): number[] {
  if (weeks < 4) return [];
  const indices: number[] = [];
  for (let w = 4; w <= weeks; w += 4) indices.push(w - 1);
  return indices;
}

function dayConfig(base: SessionConfig, style: TrainingStyle, isDeload: boolean): SessionConfig {
  const cap = RECOVERY_STYLE_CAP[style];
  let intensity = cap ? capIntensity(base.intensity, cap) : base.intensity;
  if (isDeload) intensity = capIntensity(intensity, "light");

  const isShortRecoveryStyle = style === "regenerative" || style === "mobility" || style === "stretching";
  const durationMin = isShortRecoveryStyle && base.durationMin > 30 ? 30 : base.durationMin;

  return { ...base, mode: "plan", style, intensity, durationMin: durationMin as SessionConfig["durationMin"] };
}

/** Reduces sets and conditioning time caps for a deload week without touching the core engine. */
export function applyDeloadReduction(session: GeneratedSession): GeneratedSession {
  return {
    ...session,
    blocks: session.blocks.map((block) => ({
      ...block,
      timeCapMin: block.role === "conditioning" ? Math.max(6, Math.round(block.timeCapMin * 0.75)) : block.timeCapMin,
      exercises: block.exercises.map((be) => ({
        ...be,
        sets: be.sets ? Math.max(2, Math.round(be.sets * 0.7)) : be.sets
      }))
    }))
  };
}

function sessionToSyntheticLog(session: GeneratedSession): LoggedSession {
  return {
    id: `synthetic-${session.id}`,
    sessionId: session.id,
    date: session.generatedAt,
    completed: true,
    loggedSets: session.blocks.flatMap((b) =>
      b.exercises.map((be, i) => ({
        id: `${session.id}-${b.id}-${i}`,
        exerciseId: be.exerciseId,
        exerciseName: be.exerciseName,
        setIndex: i
      }))
    ),
    conditioningResults: [],
    painFlag: false
  };
}

export interface GeneratePlanContext {
  baseConfig: SessionConfig;
  weeks: PlanLengthWeeks;
  daysPerWeek: number;
  startDate: string;
  exercises: Exercise[];
  oneRepMaxes: EstimatedOneRM[];
}

export interface GeneratedPlanResult {
  plan: TrainingPlan;
  sessions: GeneratedSession[];
}

const DAY_LABELS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

export function generatePlan(ctx: GeneratePlanContext): GeneratedPlanResult {
  const planId = uuid();
  const deloadWeekIndices = getDeloadWeekIndices(ctx.weeks);
  const plannedSessions: PlannedSession[] = [];
  const sessions: GeneratedSession[] = [];
  const recentWindow: GeneratedSession[] = [];

  for (let weekIndex = 0; weekIndex < ctx.weeks; weekIndex++) {
    const isDeload = deloadWeekIndices.includes(weekIndex);
    const styles = buildWeekStyles(ctx.baseConfig.style, ctx.daysPerWeek, weekIndex);

    for (let dayIndex = 0; dayIndex < ctx.daysPerWeek; dayIndex++) {
      const style = styles[dayIndex] ?? ctx.baseConfig.style;
      const config = dayConfig(ctx.baseConfig, style, isDeload);

      const recentLogs = recentWindow.slice(-3).map(sessionToSyntheticLog).reverse();
      const recentSessions = recentWindow.slice(-3).reverse();

      let session = generateWorkout({
        config,
        exercises: ctx.exercises,
        oneRepMaxes: ctx.oneRepMaxes,
        recentLogs,
        recentSessions
      });
      if (isDeload) session = applyDeloadReduction(session);
      session = { ...session, planId, planWeekIndex: weekIndex, planDayIndex: dayIndex };

      sessions.push(session);
      recentWindow.push(session);

      plannedSessions.push({
        id: uuid(),
        weekIndex,
        dayIndex,
        label: `Week ${weekIndex + 1} · ${DAY_LABELS[dayIndex] ?? `Day ${dayIndex + 1}`}`,
        config,
        isDeload,
        generatedSessionId: session.id
      });
    }
  }

  const plan: TrainingPlan = {
    id: planId,
    name: `${ctx.weeks}-week plan`,
    weeks: ctx.weeks,
    daysPerWeek: ctx.daysPerWeek,
    startDate: ctx.startDate,
    deloadWeekIndices,
    plannedSessions,
    createdAt: new Date().toISOString()
  };

  return { plan, sessions };
}
