"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { parseISO } from "date-fns";
import { CalendarDays, Clock3 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { KpiRing } from "@/components/dashboard/KpiRing";
import { DailyChecklist } from "@/components/dashboard/DailyChecklist";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { SaveIndicator } from "@/components/shared/SaveIndicator";
import { PageTransition } from "@/components/shared/PageTransition";
import { useDayLog } from "@/hooks/useDayLog";
import { useSelectedDate } from "@/hooks/use-selected-date";
import { useWeekData } from "@/hooks/useWeekData";
import { waterTarget } from "@/lib/data/dietPlan";
import {
  DEFAULT_SETTINGS,
  countStreak,
  formatPrettyDate,
  getJourneyWeek,
  getWeekRange,
  getWorkoutDayForDate,
  hydrateDayLog,
  isCleanSnackDay,
} from "@/lib/fitness";

export default function DashboardPage() {
  const { selectedDate, timeZone } = useSelectedDate();
  const { dayLog, saveState, update } = useDayLog(selectedDate);
  const { start } = getWeekRange(parseISO(selectedDate));
  const { weekLogs } = useWeekData(start.toISOString().slice(0, 10));
  const [allLogs, setAllLogs] = useState<typeof weekLogs>([]);
  const [settingsStartDate, setSettingsStartDate] = useState(DEFAULT_SETTINGS.startDate);
  const [showWelcome, setShowWelcome] = useState(false);
  const [startDateDraft, setStartDateDraft] = useState(DEFAULT_SETTINGS.startDate);

  useEffect(() => {
    async function loadAllLogs() {
      const response = await fetch("/api/get-all-logs", { cache: "no-store" });
      const data = await response.json();
      setAllLogs(data);
    }

    async function loadSettings() {
      const response = await fetch("/api/settings", { cache: "no-store" });
      const data = await response.json();

      if (!data?.startDate) {
        setShowWelcome(true);
        return;
      }

      setSettingsStartDate(data.startDate);
      setStartDateDraft(data.startDate);
    }

    function handleFocus() {
      void loadAllLogs();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void loadAllLogs();
      }
    }

    void loadAllLogs();
    void loadSettings();

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadAllLogs();
      }
    }, 5000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, []);

  const workoutDay = getWorkoutDayForDate(parseISO(selectedDate));
  const hydrated = hydrateDayLog(dayLog);
  const weekNumber = getJourneyWeek({ startDate: settingsStartDate }, parseISO(selectedDate));
  const gymStreak = countStreak(allLogs, (log) => log.workoutDone);
  const cleanStreak = countStreak(allLogs, isCleanSnackDay);

  function toggleChecklistItem(id: string, checked: boolean) {
    update((current) => {
      switch (id) {
        case "protein-shake":
          return {
            ...current,
            meals: current.meals.map((meal) =>
              meal.mealId === "protein-shake" ? { ...meal, eaten: checked } : meal,
            ),
          };
        case "lunch-eaten":
          return {
            ...current,
            meals: current.meals.map((meal) =>
              meal.mealId === "lunch" ? { ...meal, eaten: checked } : meal,
            ),
          };
        case "fruit-snack":
          return {
            ...current,
            meals: current.meals.map((meal) =>
              meal.mealId === "fruit-snack" ? { ...meal, eaten: checked } : meal,
            ),
          };
        case "avoided-chips":
          return {
            ...current,
            snacksAvoided: { ...current.snacksAvoided, chips: checked },
          };
        case "avoided-chocolate":
          return {
            ...current,
            snacksAvoided: { ...current.snacksAvoided, "milk-chocolate": checked },
          };
        case "avoided-bread-butter":
          return {
            ...current,
            snacksAvoided: { ...current.snacksAvoided, "bread-butter": checked },
          };
        case "workout-completed":
          return {
            ...current,
            workoutDone: checked,
          };
        case "water-goal":
          return {
            ...current,
            waterGlasses: checked ? waterTarget : 0,
          };
        default:
          return {
            ...current,
            checklist: { ...current.checklist, [id]: checked },
          };
      }
    });
  }

  return (
    <AppShell
      title="Dashboard"
      subtitle={`${formatPrettyDate(parseISO(selectedDate))} · ${timeZone} · Week ${weekNumber} of your journey`}
      actions={<SaveIndicator state={saveState} />}
    >
      <PageTransition>
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="panel-raised flex items-center gap-4 p-5">
            <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Today&apos;s Date</p>
              <p className="font-display text-4xl uppercase tracking-[0.08em] text-foreground">
                {formatPrettyDate(parseISO(selectedDate))}
              </p>
            </div>
          </div>
          <div className="panel-raised flex items-center gap-4 p-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-foreground">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Timezone</p>
              <p className="text-lg font-semibold text-foreground">{timeZone}</p>
              <p className="text-sm text-muted">The tracker now rolls over using your local timezone automatically.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
          <QuoteCard />
          <div className="grid gap-4 sm:grid-cols-2">
            <KpiRing label="Calories" value={hydrated.caloriesLogged} target={1550} suffix=" kcal" />
            <KpiRing label="Protein" value={hydrated.proteinLogged} target={100} suffix="g" />
            <div className="panel flex flex-col justify-between p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Workout done today?</p>
              <button
                type="button"
                onClick={() => update((current) => ({ ...current, workoutDone: !current.workoutDone }))}
                className={`mt-5 min-h-11 rounded-2xl border px-4 py-3 text-left ${
                  hydrated.workoutDone
                    ? "border-success/40 bg-success/15 text-success"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}
              >
                <span className="text-3xl">{hydrated.workoutDone ? "✓" : "✕"}</span>
                <span className="ml-3 text-lg">{hydrated.workoutDone ? "YES" : "NO"}</span>
              </button>
            </div>
            <div className="panel flex flex-col justify-between p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Water intake</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: 8 }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => update((current) => ({ ...current, waterGlasses: index + 1 }))}
                    className={`min-h-11 min-w-11 rounded-full border text-sm ${
                      index < hydrated.waterGlasses
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-white/10 bg-white/[0.02] text-muted"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr,1fr]">
          <div className="panel p-6">
            <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">
              Today&apos;s Workout
            </p>
            <p className="mt-2 text-lg text-accent">
              {workoutDay.shortLabel} — {workoutDay.title}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {workoutDay.exercises.slice(0, 3).map((exercise) => (
                <li key={exercise.id}>{exercise.name}</li>
              ))}
            </ul>
            <Link
              href="/workout"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-black transition hover:bg-[#F0D060]"
            >
              Start Workout
            </Link>
          </div>

          <DailyChecklist
            checklist={hydrated.checklist}
            onToggle={toggleChecklistItem}
          />
        </div>

        <div className="mt-6">
          <StreakCard gymStreak={gymStreak} cleanStreak={cleanStreak} weekLogs={weekLogs} />
        </div>

        {showWelcome ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
            <div className="panel-raised w-full max-w-lg p-6">
              <p className="font-display text-5xl uppercase tracking-[0.1em] text-accent">
                Welcome, Yash
              </p>
              <p className="mt-4 text-sm text-muted">
                Your journey to 50 kg starts now. Set your start date to initialize the tracker.
              </p>
              <input
                type="date"
                value={startDateDraft}
                onChange={(event) => setStartDateDraft(event.target.value)}
                className="mt-5 min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-foreground"
              />
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/settings", {
                    method: "POST",
                    cache: "no-store",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ startDate: startDateDraft }),
                  });
                  setSettingsStartDate(startDateDraft);
                  setShowWelcome(false);
                }}
                className="mt-5 min-h-11 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-black"
              >
                Start the Journey
              </button>
            </div>
          </div>
        ) : null}
      </PageTransition>
    </AppShell>
  );
}
