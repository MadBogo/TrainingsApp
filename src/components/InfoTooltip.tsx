import { Info } from "lucide-react";
import { useIsCoarsePointer } from "@/hooks/useMediaQuery";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface InfoTooltipProps {
  term: string;
  definition: string;
  example?: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Accessible term explainer: hover/focus popover on desktop, tap-to-open bottom sheet on
 * touch devices. Escape dismisses both (native Radix behavior). Never used to carry
 * essential instructions — only supplementary terminology.
 */
export function InfoTooltip({ term, definition, example, className, iconClassName }: InfoTooltipProps) {
  const isCoarsePointer = useIsCoarsePointer();
  const label = `What does ${term} mean?`;

  const trigger = (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-ink-faint hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent align-middle",
        iconClassName
      )}
    >
      <Info className="h-full w-full" strokeWidth={2} />
    </button>
  );

  if (isCoarsePointer) {
    return (
      <span className={cn("inline-flex", className)}>
        <Dialog>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent variant="sheet">
            <DialogTitle>{term}</DialogTitle>
            <DialogDescription className="mt-2 text-base leading-relaxed text-ink">
              {definition}
            </DialogDescription>
            {example && <p className="mt-3 text-sm text-ink-muted">Example: {example}</p>}
          </DialogContent>
        </Dialog>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex", className)}>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent role="tooltip">
          <p className="font-semibold text-ink">{term}</p>
          <p className="mt-1 text-ink-muted">{definition}</p>
          {example && <p className="mt-1 text-ink-faint">Example: {example}</p>}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}
