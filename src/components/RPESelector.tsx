import { GlossaryInfo } from "@/components/GlossaryInfo";
import { cn } from "@/lib/utils";

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function RPESelector({
  value,
  onChange,
  label = "Session RPE"
}: {
  value: number | undefined;
  onChange: (value: number) => void;
  label?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <GlossaryInfo id="rpe" />
      </div>
      <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={label}>
        {SCALE.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={cn(
              "flex h-12 items-center justify-center rounded-xl border text-base font-bold transition-colors",
              value === n ? "border-accent bg-accent text-accent-foreground" : "border-border bg-bg-surface text-ink-muted hover:text-ink"
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-ink-faint">
        <span>Very easy</span>
        <span>Maximal</span>
      </div>
    </div>
  );
}
