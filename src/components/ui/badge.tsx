import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "accent" | "danger" | "success" | "warning" | "info";

const toneClasses: Record<Tone, string> = {
  default: "bg-bg-elevated text-ink-muted border-border",
  accent: "bg-accent/15 text-accent border-accent/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  info: "bg-info/15 text-info border-info/30"
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
