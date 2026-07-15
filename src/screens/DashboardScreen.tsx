import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Calendar, History, TrendingUp, ArrowRight, CheckCircle2, CircleDashed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAthleteStore } from "@/store/athleteStore";
import { logRepository, sessionRepository } from "@/repository";
import type { GeneratedSession, LoggedSession } from "@/domain";
import { TRAINING_STYLE_LABELS } from "@/data/labels";

interface RecentEntry {
  log: LoggedSession;
  session: GeneratedSession | undefined;
}

export function DashboardScreen() {
  const { profile, oneRepMaxes } = useAthleteStore();
  const [recent, setRecent] = useState<RecentEntry[]>([]);

  useEffect(() => {
    logRepository.getRecent(3).then(async (logs) => {
      const withSessions = await Promise.all(
        logs.map(async (log) => ({ log, session: await sessionRepository.getById(log.sessionId) }))
      );
      setRecent(withSessions);
    });
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium text-accent">Welcome back{profile?.name ? `, ${profile.name}` : ""}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          What are we training today?
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-accent/40 bg-gradient-to-br from-bg-raised to-bg-surface">
          <CardHeader>
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <CardTitle>Train Now</CardTitle>
            <CardDescription>Generate one standalone workout for right now.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/build?mode=train_now">
                Start building <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-bg-elevated text-ink">
              <Calendar className="h-5 w-5" />
            </div>
            <CardTitle>Training Plan</CardTitle>
            <CardDescription>Build an adaptive plan from 1 to 8 weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/build?mode=plan">
                Plan a block <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-ink-muted">
            <History className="h-4 w-4" /> Recent activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-ink-faint">
              No workouts logged yet. Once you complete a session it'll show up here.
            </p>
          ) : (
            <div className="space-y-2">
              {recent.map(({ log, session }) => (
                <div key={log.id} className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-surface p-2.5">
                  <div className="flex items-center gap-2.5">
                    {log.completed ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <CircleDashed className="h-4 w-4 shrink-0 text-ink-faint" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {session ? session.title : "Session"}
                      </p>
                      <p className="text-xs text-ink-faint">
                        {new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        {session ? ` · ${TRAINING_STYLE_LABELS[session.config.style]}` : ""}
                      </p>
                    </div>
                  </div>
                  {log.sessionRpe && <Badge tone="default">RPE {log.sessionRpe}</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-ink-muted">
            <TrendingUp className="h-4 w-4" /> Progression snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          {oneRepMaxes.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {oneRepMaxes.slice(0, 3).map((orm) => (
                <div key={orm.id} className="rounded-xl border border-border-subtle bg-bg-surface p-3 text-center">
                  <p className="text-lg font-bold text-ink">{orm.valueKg}<span className="text-xs text-ink-faint"> kg</span></p>
                  <p className="mt-0.5 text-[11px] text-ink-faint">est. 1RM</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-faint">Add benchmarks in Profile to see them here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
