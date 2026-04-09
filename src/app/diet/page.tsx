"use client";

import { parseISO } from "date-fns";
import { AppShell } from "@/components/layout/AppShell";
import { DatePicker } from "@/components/shared/DatePicker";
import { SaveIndicator } from "@/components/shared/SaveIndicator";
import { MacroBar } from "@/components/diet/MacroBar";
import { MealCard } from "@/components/diet/MealCard";
import { SnackAudit } from "@/components/diet/SnackAudit";
import { PageTransition } from "@/components/shared/PageTransition";
import { useDayLog } from "@/hooks/useDayLog";
import { useSelectedDate } from "@/hooks/use-selected-date";
import { calorieTarget, proteinTarget, waterTarget } from "@/lib/data/dietPlan";
import { formatPrettyDate, hydrateDayLog } from "@/lib/fitness";

export default function DietPage() {
  const { selectedDate, setSelectedDate, timeZone } = useSelectedDate();
  const { dayLog, update, saveNow, saveState } = useDayLog(selectedDate);
  const hydrated = hydrateDayLog(dayLog);

  return (
    <AppShell
      title="Diet Tracker"
      subtitle={`${formatPrettyDate(parseISO(selectedDate))} · ${timeZone}`}
      actions={
        <div className="flex items-center gap-3">
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
          <SaveIndicator state={saveState} />
        </div>
      }
    >
      <PageTransition>
        <div className="grid gap-4 md:grid-cols-3">
          <MacroBar label="Calories" value={hydrated.caloriesLogged} target={calorieTarget} suffix=" kcal" />
          <MacroBar label="Protein" value={hydrated.proteinLogged} target={proteinTarget} suffix="g" />
          <div className="panel p-4">
            <p className="text-sm text-muted">Water</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from({ length: waterTarget }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => update((current) => ({ ...current, waterGlasses: index + 1 }))}
                  className={`min-h-11 min-w-11 rounded-full border ${
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

        <div className="mt-6 grid gap-5">
          {hydrated.meals
            .filter((meal) => !["lunch-yogurt", "dinner-yogurt"].includes(meal.mealId))
            .map((mealState) => (
              <MealCard
                key={mealState.mealId}
                mealState={mealState}
                onChange={(nextState) =>
                  update((current) => ({
                    ...current,
                    meals: current.meals.map((meal) =>
                      meal.mealId === nextState.mealId ? nextState : meal,
                    ),
                  }))
                }
              />
            ))}
        </div>

        <div className="mt-6">
          <SnackAudit
            snacksAvoided={hydrated.snacksAvoided}
            yogurtState={{
              "lunch-yogurt": hydrated.meals.find((meal) => meal.mealId === "lunch-yogurt")?.eaten ?? false,
              "dinner-yogurt": hydrated.meals.find((meal) => meal.mealId === "dinner-yogurt")?.eaten ?? false,
            }}
            onSnackToggle={(id, checked) =>
              update((current) => ({
                ...current,
                snacksAvoided: { ...current.snacksAvoided, [id]: checked },
              }))
            }
            onYogurtToggle={(id, checked) =>
              update((current) => ({
                ...current,
                meals: current.meals.map((meal) =>
                  meal.mealId === id ? { ...meal, eaten: checked } : meal,
                ),
              }))
            }
          />
        </div>

        <button
          type="button"
          onClick={() => void saveNow()}
          className="mt-6 min-h-11 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F0D060]"
        >
          Save Today&apos;s Diet Log
        </button>
      </PageTransition>
    </AppShell>
  );
}
