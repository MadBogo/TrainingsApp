import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Moon } from "lucide-react";
import type { GeneratedSession, PlanLengthWeeks, SessionConfig, TrainingPlan } from "@/domain";
import { planRepository, sessionRepository } from "@/repository";
import { generatePlan } from "@/engine/generatePlan";
import { useExerciseStore } from "@/store/exerciseStore";
import { useAthleteStore } from "@/store/athleteStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INTENSITY_LABELS, TRAINING_STYLE_LABELS } from "@/data/labels";
import { GlossaryInfo } from "@/components/GlossaryInfo";
import { PlaceholderScreen } from "./PlaceholderScreen";

interface PendingPlanState {
  pendingConfig: SessionConfig;
  weeks: PlanLengthWeeks;
  daysPerWeek: number;
}

export function TrainingPlanScreen() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { exercises } = useExerciseStore();
  const { oneRepMaxes } = useAthleteStore();
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [sessions, setSessions] = useState<GeneratedSession[]>([]);
  const [generating, setGenerating] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const pendingState = location.state as PendingPlanState | null;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (pendingState?.pendingConfig && exercises.length > 0) {
        setGenerating(true);
        const { plan: newPlan, sessions: newSessions } = generatePlan({
          baseConfig: pendingState.pendingConfig,
          weeks: pendingState.weeks,
          daysPerWeek: pendingState.daysPerWeek,
          startDate: new Date().toISOString(),
          exercises,
          oneRepMaxes
        });
        await planRepository.save(newPlan);
        await Promise.all(newSessions.map((s) => sessionRepository.save(s)));
        if (!cancelled) {
          navigate(`/plan/${newPlan.id}`, { replace: true, state: null });
        }
        return;
      }

      if (id) {
        const found = await planRepository.getById(id);
        if (!found) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const foundSessions = await sessionRepository.getByPlanId(id);
        if (!cancelled) {
          setPlan(found);
          setSessions(foundSessions);
        }
        return;
      }

      const active = await planRepository.getActive();
      if (active) {
        const activeSessions = await sessionRepository.getByPlanId(active.id);
        if (!cancelled) {
          setPlan(active);
          setSessions(activeSessions);
        }
      }
    }

    run().finally(() => !cancelled && setGenerating(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, exercises.length]);

  const sessionsById = useMemo(() => Object.fromEntries(sessions.map((s) => [s.id, s])), [sessions]);

  const weeks = useMemo(() => {
    if (!plan) return [];
    const byWeek = new Map<number, typeof plan.plannedSessions>();
    for (const ps of plan.plannedSessions) {
      const list = byWeek.get(ps.weekIndex) ?? [];
      list.push(ps);
      byWeek.set(ps.weekIndex, list);
    }
    return Array.from(byWeek.entries()).sort(([a], [b]) => a - b);
  }, [plan]);

  if (generating || (pendingState?.pendingConfig && !notFound)) {
    return <p className="py-16 text-center text-sm text-ink-faint">Building your training plan…</p>;
  }

  if (notFound) {
    return (
      <PlaceholderScreen icon={CalendarIcon} title="Plan not found" description="This plan may have been removed." phase="" />
    );
  }

  if (!plan) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <CalendarIcon className="h-10 w-10 text-ink-faint" />
        <div>
          <h1 className="text-xl font-bold text-ink">No active training plan</h1>
          <p className="mt-1 text-sm text-ink-muted">Build an adaptive multi-week plan from the session builder.</p>
        </div>
        <Button asChild>
          <Link to="/build?mode=plan">Build a plan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{plan.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {plan.daysPerWeek} days/week · starts {format(new Date(plan.startDate), "MMM d")}
        </p>
      </div>

      <div className="space-y-5">
        {weeks.map(([weekIndex, planned]) => {
          const isDeload = plan.deloadWeekIndices.includes(weekIndex);
          const weekStart = addDays(new Date(plan.startDate), weekIndex * 7);
          return (
            <div key={weekIndex}>
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-sm font-semibold text-ink">
                  Week {weekIndex + 1} <span className="font-normal text-ink-faint">· {format(weekStart, "MMM d")}</span>
                </h2>
                {isDeload && (
                  <Badge tone="warning">
                    <Moon className="mr-1 h-3 w-3" /> Deload
                  </Badge>
                )}
                {isDeload && <GlossaryInfo id="deload" />}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {planned
                  .sort((a, b) => a.dayIndex - b.dayIndex)
                  .map((ps) => {
                    const session = ps.generatedSessionId ? sessionsById[ps.generatedSessionId] : undefined;
                    const dayDate = addDays(weekStart, ps.dayIndex);
                    return (
                      <Card key={ps.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-ink-faint">{format(dayDate, "EEE, MMM d")}</p>
                            <Badge tone="default">{INTENSITY_LABELS[ps.config.intensity]}</Badge>
                          </div>
                          <p className="mt-1 font-semibold text-ink">{TRAINING_STYLE_LABELS[ps.config.style]}</p>
                          <p className="text-xs text-ink-muted">{ps.config.durationMin} min</p>
                          {session && (
                            <Button asChild size="sm" variant="secondary" className="mt-3 w-full">
                              <Link to={`/workout/${session.id}`}>View session</Link>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
