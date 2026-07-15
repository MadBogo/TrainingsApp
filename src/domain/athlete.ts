export type OneRmMethod = "actual_1rm" | "top_set" | "calculated" | "seed_estimate";
export type Confidence = "low" | "medium" | "high";

export interface EstimatedOneRM {
  id: string;
  exerciseId: string;
  valueKg: number;
  method: OneRmMethod;
  source: string;
  confidence: Confidence;
  lastUpdated: string;
}

export interface TopSetInput {
  exerciseId: string;
  weightKg: number;
  reps: number;
  rpe?: number;
}

export type Sex = "male" | "female" | "unspecified";

export interface AthleteProfile {
  id: string;
  name?: string;
  sex: Sex;
  bodyWeightKg: number;
  heightCm: number;
  equipmentInventory: string[];
  defaultLocation: string;
  createdAt: string;
  updatedAt: string;
}
