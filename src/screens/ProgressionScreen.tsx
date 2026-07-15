import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp } from "lucide-react";
import { GlossaryInfo } from "@/components/GlossaryInfo";
import { logRepository, sessionRepository } from "@/repository";
import { useAthleteStore } from "@/store/athleteStore";
import { useExerciseStore } from "@/store/exerciseStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  buildConditioningHistory,
  buildOneRmTrend,
  buildVolumeTrend,
  exercisesWithHistory
} from "@/engine/progressionStats";
import type { GeneratedSession, LoggedSession } from "@/domain";
import { SCORE_TYPE_LABELS } from "@/data/labels";

const CHART_COLORS = { accent: "#d7ff3f", grid: "#2a2a30", text: "#9a9aa3" };

export function ProgressionScreen() {
  const { oneRepMaxes } = useAthleteStore();
  const exercisesById = useExerciseStore((s) => s.byId);
  const [logs, setLogs] = useState<LoggedSession[]>([]);
  const [sessionsById, setSessionsById] = useState<Record<string, GeneratedSession>>({});
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");

  useEffect(() => {
    logRepository.getAll().then(setLogs);
    sessionRepository.getAll().then((sessions) => setSessionsById(Object.fromEntries(sessions.map((s) => [s.id, s]))));
  }, []);

  const trainedExercises = useMemo(() => exercisesWithHistory(logs, exercisesById), [logs, exercisesById]);

  useEffect(() => {
    if (!selectedExerciseId && trainedExercises.length > 0) {
      setSelectedExerciseId(trainedExercises[0].id);
    }
  }, [trainedExercises, selectedExerciseId]);

  const oneRmTrend = useMemo(
    () => (selectedExerciseId ? buildOneRmTrend(selectedExerciseId, logs) : []),
    [selectedExerciseId, logs]
  );
  const volumeTrend = useMemo(() => buildVolumeTrend(logs), [logs]);
  const conditioningHistory = useMemo(() => buildConditioningHistory(logs, sessionsById), [logs, sessionsById]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Progression</h1>
        <p className="mt-1 text-sm text-ink-muted">Estimated 1RMs, training volume and conditioning benchmarks over time.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {oneRepMaxes.slice(0, 3).map((orm) => (
          <Card key={orm.id}>
            <CardContent className="pt-4 text-center">
              <p className="truncate text-xs text-ink-faint">{exercisesById[orm.exerciseId]?.name ?? orm.exerciseId}</p>
              <p className="mt-1 text-xl font-bold text-ink">{orm.valueKg}<span className="text-xs text-ink-faint"> kg</span></p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Estimated 1RM trend</CardTitle>
            <CardDescription>Reconstructed from your best logged set each session.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {trainedExercises.length === 0 ? (
            <EmptyState text="Log a few sessions with weights and reps to see trends here." />
          ) : (
            <>
              <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
                <SelectTrigger className="mb-4 max-w-xs">
                  <SelectValue placeholder="Choose an exercise" />
                </SelectTrigger>
                <SelectContent>
                  {trainedExercises.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {oneRmTrend.length < 2 ? (
                <EmptyState text="Log one more session with this exercise to start a trend line." />
              ) : (
                <div className="h-56 w-full">
                  <ResponsiveContainer>
                    <LineChart data={oneRmTrend}>
                      <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(d) => format(new Date(d), "MMM d")}
                        stroke={CHART_COLORS.text}
                        fontSize={12}
                      />
                      <YAxis stroke={CHART_COLORS.text} fontSize={12} width={40} unit="kg" />
                      <Tooltip
                        contentStyle={{ background: "#19191d", border: "1px solid #2a2a30", borderRadius: 8 }}
                        labelFormatter={(d) => format(new Date(d), "MMM d, yyyy")}
                        formatter={(v: number) => [`${v} kg`, "Est. 1RM"]}
                      />
                      <Line type="monotone" dataKey="valueKg" stroke={CHART_COLORS.accent} strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            Weekly training volume
            <GlossaryInfo id="volume" />
          </CardTitle>
          <CardDescription>Sets × reps × load, summed per week.</CardDescription>
        </CardHeader>
        <CardContent>
          {volumeTrend.length === 0 ? (
            <EmptyState text="Volume trends appear once you've logged a session." />
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer>
                <BarChart data={volumeTrend}>
                  <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                  <XAxis
                    dataKey="weekStart"
                    tickFormatter={(d) => format(new Date(d), "MMM d")}
                    stroke={CHART_COLORS.text}
                    fontSize={12}
                  />
                  <YAxis stroke={CHART_COLORS.text} fontSize={12} width={50} />
                  <Tooltip
                    contentStyle={{ background: "#19191d", border: "1px solid #2a2a30", borderRadius: 8 }}
                    labelFormatter={(d) => `Week of ${format(new Date(d), "MMM d")}`}
                    formatter={(v: number) => [`${v} kg`, "Volume"]}
                  />
                  <Bar dataKey="volumeKg" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> Conditioning benchmarks
          </CardTitle>
          <CardDescription>Your logged scores from conditioning blocks, most recent first.</CardDescription>
        </CardHeader>
        <CardContent>
          {conditioningHistory.length === 0 ? (
            <EmptyState text="Conditioning scores you log will show up here." />
          ) : (
            <div className="space-y-2">
              {conditioningHistory.slice(0, 10).map((entry, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-surface p-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{entry.blockTitle}</p>
                    <p className="text-xs text-ink-faint">{format(new Date(entry.date), "MMM d, yyyy")}</p>
                  </div>
                  <Badge tone="accent">
                    {entry.value} {SCORE_TYPE_LABELS[entry.scoreType as keyof typeof SCORE_TYPE_LABELS]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-ink-faint">{text}</p>;
}
