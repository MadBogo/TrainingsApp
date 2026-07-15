export type LoadFeedback = "too_easy" | "on_target" | "too_hard";

export interface LoggedSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setIndex: number;
  weightKg?: number;
  reps?: number;
  durationSec?: number;
  rpe?: number;
  feedback?: LoadFeedback;
}

export interface ConditioningResult {
  scoreType: "time" | "rounds_reps" | "reps" | "calories" | "distance" | "load" | "completion";
  value: string;
}

export interface LoggedSession {
  id: string;
  sessionId: string;
  date: string;
  completed: boolean;
  loggedSets: LoggedSet[];
  conditioningResults: ConditioningResult[];
  sessionRpe?: number;
  note?: string;
  painFlag: boolean;
  painNote?: string;
}
