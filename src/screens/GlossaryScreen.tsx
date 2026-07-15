import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GLOSSARY_TERMS } from "@/data/glossary";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CATEGORY_LABEL: Record<string, string> = {
  effort: "Effort",
  loading: "Loading",
  format: "Workout format",
  programming: "Programming"
};

export function GlossaryScreen() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter(
      (t) => t.term.toLowerCase().includes(q) || t.shortDefinition.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Training glossary</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Plain-English definitions for every technical term used across Training Engine.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          className="pl-9"
          aria-label="Search glossary"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <Card key={t.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-ink">{t.term}</h2>
                <Badge tone="default">{CATEGORY_LABEL[t.category]}</Badge>
              </div>
              <p className="mt-1.5 text-sm text-ink-muted">{t.shortDefinition}</p>
              {t.example && <p className="mt-1.5 text-sm text-ink-faint">Example: {t.example}</p>}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">No terms match "{query}".</p>
        )}
      </div>
    </div>
  );
}
