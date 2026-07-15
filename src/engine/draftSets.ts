import type { GeneratedSession, LoadFeedback } from "@/domain";

export interface DraftSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setIndex: number;
  weightKg?: number;
  reps?: number;
  feedback?: LoadFeedback;
  blockTitle: string;
}

function parseFirstNumber(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const match = text.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

/** Seeds one editable draft row per prescribed set for every sets/reps block in the session. */
export function buildDraftSets(session: GeneratedSession): DraftSet[] {
  const drafts: DraftSet[] = [];
  for (const block of session.blocks) {
    if (block.format !== "sets_reps" && block.format !== "complex") continue;
    for (const be of block.exercises) {
      const totalSets = be.sets ?? 1;
      for (let i = 0; i < totalSets; i++) {
        drafts.push({
          id: `${be.id}-${i}`,
          exerciseId: be.exerciseId,
          exerciseName: be.exerciseName,
          setIndex: i,
          weightKg: be.loadRange ? Math.round((be.loadRange.minKg + be.loadRange.maxKg) / 2) : undefined,
          reps: parseFirstNumber(be.reps),
          blockTitle: block.title
        });
      }
    }
  }
  return drafts;
}
