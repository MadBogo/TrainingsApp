import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-7 w-12 shrink-0 rounded-full border border-border bg-bg-elevated transition-colors data-[state=checked]:border-accent data-[state=checked]:bg-accent",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="block h-5 w-5 translate-x-1 rounded-full bg-ink-faint transition-transform data-[state=checked]:translate-x-6 data-[state=checked]:bg-accent-foreground" />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
