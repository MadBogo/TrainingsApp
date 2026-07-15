import type { Exercise, GeneratedSession, LoggedSession } from "@/domain";
import { estimateOneRepMax } from "./oneRepMax";

export interface OneRmPoint {
  date: string;
  valueKg: number;
}

/**
 * Reconstructs an exercise's 1RM trend directly from logged set history rather than a
 * separate history table — each logged session contributes its best set's estimate.
 */
export function buildOneRmTrend(exerciseId: string, loggedSessions: LoggedSession[]): OneRmPoint[] {
  const points: OneRmPoint[] = [];
  const sorted = [...loggedSessions].filter((l) => l.completed).sort((a, b) => (a.date < b.date ? -1 : 1));

  for (const log of sorted) {
    const setsForExercise = log.loggedSets.filter((s) => s.exerciseId === exerciseId && s.weightKg && s.reps);
    if (setsForExercise.length === 0) continue;
    const best = Math.max(...setsForExercise.map((s) => estimateOneRepMax(s.weightKg!, s.reps!, s.rpe)));
    points.push({ date: log.date, valueKg: best });
  }

  return points;
}

export interface VolumePoint {
  weekStart: string;
  volumeKg: number;
}

function startOfWeekIso(dateIso: string): string {
  const d = new Date(dateIso);
  const day = d.getDay();
  const diff = (day + 6) % 7; // Monday-start week
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Total sets×reps×load per week, across every logged exercise. */
export function buildVolumeTrend(loggedSessions: LoggedSession[]): VolumePoint[] {
  const byWeek = new Map<string, number>();
  for (const log of loggedSessions) {
    if (!log.completed) continue;
    const week = startOfWeekIso(log.date);
    const volume = log.loggedSets.reduce((sum, s) => sum + (s.weightKg ?? 0) * (s.reps ?? 0), 0);
    byWeek.set(week, (byWeek.get(week) ?? 0) + volume);
  }
  return Array.from(byWeek.entries())
    .map(([weekStart, volumeKg]) => ({ weekStart, volumeKg: Math.round(volumeKg) }))
    .sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1));
}

export interface ConditioningHistoryEntry {
  date: string;
  blockTitle: string;
  scoreType: string;
  value: string;
}

export function buildConditioningHistory(
  loggedSessions: LoggedSession[],
  sessionsById: Record<string, GeneratedSession>
): ConditioningHistoryEntry[] {
  const entries: ConditioningHistoryEntry[] = [];
  for (const log of loggedSessions) {
    if (log.conditioningResults.length === 0) continue;
    const session = sessionsById[log.sessionId];
    const conditioningBlock = session?.blocks.find((b) => b.role === "conditioning");
    for (const result of log.conditioningResults) {
      entries.push({
        date: log.date,
        blockTitle: conditioningBlock?.title ?? session?.title ?? "Conditioning",
        scoreType: result.scoreType,
        value: result.value
      });
    }
  }
  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function exercisesWithHistory(loggedSessions: LoggedSession[], exercisesById: Record<string, Exercise>): Exercise[] {
  const ids = new Set<string>();
  for (const log of loggedSessions) {
    for (const s of log.loggedSets) {
      if (s.weightKg && s.reps) ids.add(s.exerciseId);
    }
  }
  return Array.from(ids)
    .map((id) => exercisesById[id])
    .filter((e): e is Exercise => Boolean(e))
    .sort((a, b) => a.name.localeCompare(b.name));
}
