import { findGlossaryTerm } from "@/data/glossary";
import { InfoTooltip } from "./InfoTooltip";

/** Convenience wrapper around InfoTooltip that pulls its copy from the glossary data set. */
export function GlossaryInfo({ id, className }: { id: string; className?: string }) {
  const entry = findGlossaryTerm(id);
  if (!entry) return null;
  return (
    <InfoTooltip
      term={entry.term}
      definition={entry.shortDefinition}
      example={entry.example}
      className={className}
    />
  );
}
