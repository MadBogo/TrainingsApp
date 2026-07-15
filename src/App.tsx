import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { SessionBuilderScreen } from "@/screens/SessionBuilderScreen";
import { GeneratedWorkoutScreen } from "@/screens/GeneratedWorkoutScreen";
import { WorkoutModeScreen } from "@/screens/WorkoutModeScreen";
import { WorkoutLogScreen } from "@/screens/WorkoutLogScreen";
import { TrainingPlanScreen } from "@/screens/TrainingPlanScreen";
import { ExerciseLibraryScreen } from "@/screens/ExerciseLibraryScreen";
import { ProgressionScreen } from "@/screens/ProgressionScreen";
import { GlossaryScreen } from "@/screens/GlossaryScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { useAthleteStore } from "@/store/athleteStore";
import { useExerciseStore } from "@/store/exerciseStore";

export default function App() {
  const initAthlete = useAthleteStore((s) => s.init);
  const initExercises = useExerciseStore((s) => s.init);

  useEffect(() => {
    initAthlete();
    initExercises();
  }, [initAthlete, initExercises]);

  return (
    <TooltipProvider delayDuration={150}>
      <Routes>
        {/* Rendered outside AppShell: Workout Mode is a distraction-free, full-screen surface with its own chrome. */}
        <Route path="/workout/:id/live" element={<WorkoutModeScreen />} />

        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/build" element={<SessionBuilderScreen />} />
          <Route path="/workout/:id" element={<GeneratedWorkoutScreen />} />
          <Route path="/workout/:id/log" element={<WorkoutLogScreen />} />
          <Route path="/plan" element={<TrainingPlanScreen />} />
          <Route path="/plan/:id" element={<TrainingPlanScreen />} />
          <Route path="/library" element={<ExerciseLibraryScreen />} />
          <Route path="/progression" element={<ProgressionScreen />} />
          <Route path="/glossary" element={<GlossaryScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}
