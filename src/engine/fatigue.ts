import type { Exercise, FatigueTag, GeneratedSession, LoggedSession } from "@/domain";

const FATIGUE_NOTE: Record<FatigueTag, string> = {
  spinal_loading: "Repeated heavy spinal loading recently — today leans away from more of that where possible.",
  knee_dominant: "Several recent sessions were knee-dominant heavy — today balances toward other patterns where possible.",
  shoulder_intensive: "Shoulders have carried a lot of pressing volume recently — today eases off where possible.",
  gymnastics_skill: "Recent sessions leaned on high-skill gymnastics work — today favors lower-skill options where possible.",
  high_impact: "A few high-impact sessions recently — today favors lower-impact options where possible."
};

export interface FatigueAnalysis {
  flags: Set<FatigueTag>;
  notes: string[];
  consecutiveVeryHardConditioning: boolean;
}

/**
 * Soft, non-blocking fatigue signal for Train Now: scans the last few completed sessions
 * for repeated high-fatigue patterns and surfaces them as tags the selector deprioritizes
 * (never excludes) and as human-readable notes shown on the generated workout.
 */
export function analyzeFatigue(
  recentLogs: LoggedSession[],
  recentSessions: GeneratedSession[],
  exercisesById: Record<string, Exercise>,
  lookback = 3
): FatigueAnalysis {
  const completed = recentLogs.filter((l) => l.completed).slice(0, lookback);
  const tagCounts: Partial<Record<FatigueTag, number>> = {};

  for (const log of completed) {
    const tagsInSession = new Set<FatigueTag>();
    for (const set of log.loggedSets) {
      const exercise = exercisesById[set.exerciseId];
      exercise?.fatigueTags?.forEach((t) => tagsInSession.add(t));
    }
    tagsInSession.forEach((t) => {
      tagCounts[t] = (tagCounts[t] ?? 0) + 1;
    });
  }

  const flags = new Set<FatigueTag>();
  const notes: string[] = [];
  for (const [tag, count] of Object.entries(tagCounts) as [FatigueTag, number][]) {
    if (count >= 2) {
      flags.add(tag);
      notes.push(FATIGUE_NOTE[tag]);
    }
  }

  const sessionById = Object.fromEntries(recentSessions.map((s) => [s.id, s]));
  const lastTwo = completed.slice(0, 2);
  const consecutiveVeryHardConditioning =
    lastTwo.length === 2 &&
    lastTwo.every((log) => {
      const session = sessionById[log.sessionId];
      return session?.config.intensity === "very_hard";
    });

  if (consecutiveVeryHardConditioning) {
    notes.push("Your last two sessions were both very hard — consider easing intensity today to protect recovery.");
  }

  return { flags, notes, consecutiveVeryHardConditioning };
}
