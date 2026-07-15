import type { ReactNode } from "react";

export function PickerSection({
  title,
  description,
  info,
  children
}: {
  title: string;
  description?: string;
  info?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <div>
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          {title}
          {info}
        </h2>
        {description && <p className="text-xs text-ink-faint">{description}</p>}
      </div>
      {children}
    </section>
  );
}
