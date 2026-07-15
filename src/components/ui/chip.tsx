import * as React from "react";
import { cn } from "@/lib/utils";

export function Chip({
  className,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-accent bg-accent/15 text-accent"
          : "border-border bg-bg-surface text-ink-muted hover:text-ink",
        className
      )}
      {...props}
    />
  );
}
