"use client";

import { isCleanSnackDay } from "@/lib/fitness";
import type { DayLog } from "@/types";

export function StreakCard({
  gymStreak,
  cleanStreak,
  weekLogs,
}: {
  gymStreak: number;
  cleanStreak: number;
  weekLogs: DayLog[];
}) {
  const workoutsDone = weekLogs.filter((log) => log.workoutDone && !["day-6", "day-7"].includes(log.workoutDayId)).length;

  return (
    <div className="panel p-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Gym streak</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">
            <span className={gymStreak > 0 ? "inline-block animate-pulse-flame" : ""}>🔥</span> {gymStreak} day streak
          </p>
        </div>
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Clean eating</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">🥗 {cleanStreak} day streak</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Weekly mini-progress</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          {weekLogs.map((log) => (
            <div key={log.date} className="flex flex-col items-center gap-2">
              <div
                className={[
                  "h-4 w-4 rounded-full border",
                  log.workoutDone
                    ? "border-success bg-success"
                    : isCleanSnackDay(log)
                      ? "border-accent bg-accent"
                      : "border-white/10 bg-transparent",
                ].join(" ")}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">{workoutsDone}/5 workouts done this week</p>
      </div>
    </div>
  );
}
