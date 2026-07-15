import type { PlanLengthWeeks } from "./enums";
import type { SessionConfig } from "./session";

export interface PlannedSession {
  id: string;
  weekIndex: number;
  dayIndex: number;
  label: string;
  config: SessionConfig;
  isDeload: boolean;
  generatedSessionId?: string;
  completedLoggedSessionId?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  weeks: PlanLengthWeeks;
  daysPerWeek: number;
  startDate: string;
  deloadWeekIndices: number[];
  plannedSessions: PlannedSession[];
  createdAt: string;
}
