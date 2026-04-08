"use client";

import { useMemo, useState } from "react";
import { parseISO } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ExerciseCard } from "@/components/workout/ExerciseCard";
import { DatePicker } from "@/components/shared/DatePicker";
import { SaveIndicator } from "@/components/shared/SaveIndicator";
import { PageTransition } from "@/components/shared/PageTransition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDayLog } from "@/hooks/useDayLog";
import { useSelectedDate } from "@/hooks/use-selected-date";
import { weeklyWorkoutPlan } from "@/lib/data/gymPlan";
import { createExerciseLog, formatPrettyDate, getWorkoutDayForDate } from "@/lib/fitness";

export default function WorkoutPage() {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const { dayLog, update, saveNow, saveState } = useDayLog(selectedDate);
  const [showOverlay, setShowOverlay] = useState(false);

  const activeWorkout = useMemo(
    () => weeklyWorkoutPlan.find((day) => day.id === dayLog.workoutDayId) ?? getWorkoutDayForDate(parseISO(selectedDate)),
    [dayLog.workoutDayId, selectedDate],
  );

  return (
    <AppShell
      title="Today's Workout"
      subtitle={formatPrettyDate(parseISO(selectedDate))}
      actions={<SaveIndicator state={saveState} />}
    >
      <PageTransition>
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
          <Select
            value={dayLog.workoutDayId}
            onValueChange={(value) => {
              const selectedWorkout = weeklyWorkoutPlan.find((day) => day.id === value);
              if (!selectedWorkout) return;
              update((current) => ({
                ...current,
                workoutDayId: value,
                workoutDone: value === "day-7",
                exercisesCompleted: selectedWorkout.exercises.map(createExerciseLog),
              }));
            }}
          >
            <SelectTrigger className="min-h-11 rounded-2xl border-white/10 bg-black/20 md:w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#111111] text-foreground">
              {weeklyWorkoutPlan.map((day) => (
                <SelectItem key={day.id} value={day.id}>
                  {day.shortLabel} – {day.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6 panel-raised p-5">
          <p className="font-display text-4xl uppercase tracking-[0.08em] text-accent">
            {activeWorkout.shortLabel} — {activeWorkout.title}
          </p>
          <p className="mt-2 text-muted">{activeWorkout.summary}</p>
          {activeWorkout.warmup ? <p className="mt-3 text-sm text-muted">Warmup: {activeWorkout.warmup}</p> : null}
          {activeWorkout.cooldown ? <p className="mt-1 text-sm text-muted">Cool-down: {activeWorkout.cooldown}</p> : null}
          {activeWorkout.cardioFinisher ? <p className="mt-1 text-sm text-muted">{activeWorkout.cardioFinisher}</p> : null}
        </div>

        <div className="grid gap-5">
          {activeWorkout.exercises.map((exercise) => {
            const log = dayLog.exercisesCompleted.find((entry) => entry.exerciseId === exercise.id)!;
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                log={log}
                onChange={(nextLog) =>
                  update((current) => ({
                    ...current,
                    exercisesCompleted: current.exercisesCompleted.map((entry) =>
                      entry.exerciseId === nextLog.exerciseId ? nextLog : entry,
                    ),
                  }))
                }
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={async () => {
            update((current) => ({ ...current, workoutDone: true }));
            await saveNow();
            setShowOverlay(true);
            toast("Workout logged successfully.");
            window.setTimeout(() => setShowOverlay(false), 1500);
          }}
          className="mt-6 min-h-11 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F0D060]"
        >
          Complete Workout
        </button>

        {showOverlay ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <p className="font-display text-center text-6xl uppercase tracking-[0.1em] text-accent md:text-8xl">
              Workout Complete 💪
            </p>
          </div>
        ) : null}
      </PageTransition>
    </AppShell>
  );
}
