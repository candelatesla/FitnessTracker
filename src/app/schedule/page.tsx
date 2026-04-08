"use client";

import Link from "next/link";
import { useState } from "react";
import { addWeeks, parseISO, subWeeks } from "date-fns";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/shared/PageTransition";
import { useWeekData } from "@/hooks/useWeekData";
import { calorieTarget, proteinTarget } from "@/lib/data/dietPlan";
import { getIsoDate, getWeekDays, getWeekRange, getWorkoutDayForDate } from "@/lib/fitness";

export default function SchedulePage() {
  const [anchorDate, setAnchorDate] = useState(new Date());
  const { start, end } = getWeekRange(anchorDate);
  const { weekLogs, fallbackFor } = useWeekData(getIsoDate(start));
  const days = getWeekDays(anchorDate);

  return (
    <AppShell
      title="Weekly Schedule"
      subtitle={`Current Week: ${start.toLocaleDateString()} – ${end.toLocaleDateString()}`}
      actions={
        <div className="flex gap-3">
          <button type="button" onClick={() => setAnchorDate(subWeeks(anchorDate, 1))} className="min-h-11 rounded-2xl border border-white/10 px-4 text-sm text-foreground">
            ←
          </button>
          <button type="button" onClick={() => setAnchorDate(addWeeks(anchorDate, 1))} className="min-h-11 rounded-2xl border border-white/10 px-4 text-sm text-foreground">
            →
          </button>
        </div>
      }
    >
      <PageTransition>
        <div className="grid gap-4">
          {days.map((date) => {
            const log = fallbackFor(getIsoDate(date));
            const workout = getWorkoutDayForDate(date);
            const today = getIsoDate(date) === getIsoDate(new Date());
            const past = parseISO(getIsoDate(date)) < parseISO(getIsoDate(new Date()));

            return (
              <Link
                key={log.date}
                href={`/dashboard?date=${log.date}`}
                className="panel block p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">
                      {date.toLocaleDateString(undefined, { weekday: "long" })}
                    </p>
                    <p className="mt-1 text-sm text-muted">{workout.title}</p>
                  </div>
                  <p className="text-sm text-accent">
                    {log.workoutDone ? "✅ Done" : past ? "🔴 Missed" : "⏳ Upcoming"}
                  </p>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>Calories</span>
                      <span>{log.caloriesLogged}/{calorieTarget}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, (log.caloriesLogged / calorieTarget) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>Protein</span>
                      <span>{log.proteinLogged}/{proteinTarget}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-success" style={{ width: `${Math.min(100, (log.proteinLogged / proteinTarget) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </PageTransition>
    </AppShell>
  );
}
