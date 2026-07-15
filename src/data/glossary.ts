export interface GlossaryTerm {
  id: string;
  term: string;
  shortDefinition: string;
  example?: string;
  category: "effort" | "loading" | "format" | "programming";
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "rpe",
    term: "RPE",
    shortDefinition: "Rate of Perceived Exertion — a 1–10 scale for how hard a set felt.",
    example: "RPE 8 means you could have done about 2 more good reps.",
    category: "effort"
  },
  {
    id: "rir",
    term: "RIR",
    shortDefinition: "Reps in Reserve — how many more good repetitions you had left before failure.",
    example: "RIR 2 on a squat set means you stopped 2 reps short of technical failure.",
    category: "effort"
  },
  {
    id: "1rm",
    term: "1RM",
    shortDefinition: "One-Repetition Maximum — the heaviest load you can lift once with good form.",
    example: "A 140 kg deadlift 1RM means 140 kg is your current single-rep ceiling.",
    category: "loading"
  },
  {
    id: "emom",
    term: "EMOM",
    shortDefinition: "Every Minute on the Minute — start a prescribed piece of work at the top of every minute, resting with whatever time remains.",
    example: "EMOM 10: 5 power cleans every minute for 10 minutes.",
    category: "format"
  },
  {
    id: "amrap",
    term: "AMRAP",
    shortDefinition: "As Many Rounds/Reps As Possible within a fixed time cap.",
    example: "AMRAP 12: as many rounds as possible of 10 push-ups and 15 air squats in 12 minutes.",
    category: "format"
  },
  {
    id: "for-time",
    term: "For Time",
    shortDefinition: "Complete the prescribed work as fast as possible; the score is your finishing time.",
    category: "format"
  },
  {
    id: "chipper",
    term: "Chipper",
    shortDefinition: "A long list of different movements done once each in sequence, usually for time.",
    category: "format"
  },
  {
    id: "zone2",
    term: "Zone 2",
    shortDefinition: "A sustainable aerobic intensity — generally conversational but purposeful, building the aerobic base.",
    example: "A 40-minute steady bike ride where you can still talk in short sentences.",
    category: "programming"
  },
  {
    id: "tempo",
    term: "Tempo",
    shortDefinition: "The speed and pauses in each phase of a repetition, written as four numbers (eccentric-pause-concentric-pause) in seconds.",
    example: "Tempo 3-1-1-0: 3s lowering, 1s pause, 1s lifting, no pause at the top.",
    category: "loading"
  },
  {
    id: "deload",
    term: "Deload",
    shortDefinition: "A deliberately reduced-volume or reduced-intensity week to support recovery and long-term progress.",
    category: "programming"
  },
  {
    id: "volume",
    term: "Volume",
    shortDefinition: "Total training work, typically calculated as sets × reps × load.",
    category: "programming"
  },
  {
    id: "density",
    term: "Density",
    shortDefinition: "How much work is packed into a given amount of time — more work in less time means higher density.",
    category: "programming"
  },
  {
    id: "percent-1rm",
    term: "% 1RM",
    shortDefinition: "A prescribed load expressed as a percentage of your one-repetition maximum.",
    example: "80% of a 140 kg deadlift 1RM is 112 kg.",
    category: "loading"
  }
];

export function findGlossaryTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.id === id);
}
