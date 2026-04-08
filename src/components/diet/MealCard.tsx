"use client";

import { mealDefinitions } from "@/lib/data/dietPlan";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MealLogState } from "@/types";

export function MealCard({
  mealState,
  onChange,
}: {
  mealState: MealLogState;
  onChange: (nextState: MealLogState) => void;
}) {
  const meal = mealDefinitions.find((entry) => entry.id === mealState.mealId);
  if (!meal) return null;
  const option = meal.options.find((entry) => entry.id === mealState.selectedOptionId) ?? meal.options[0];

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">
            {meal.title}
          </p>
          <p className="mt-1 text-sm text-muted">{meal.timeLabel}</p>
          <p className="mt-3 text-sm text-foreground">
            {option.calories} kcal · {option.protein}g protein
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...mealState, eaten: !mealState.eaten })}
          className={`min-h-11 rounded-2xl border px-4 text-sm ${
            mealState.eaten
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-white/10 bg-white/[0.02] text-muted"
          }`}
        >
          {mealState.eaten ? "Marked as eaten" : "Mark as eaten"}
        </button>
      </div>

      {meal.options.length > 1 ? (
        <Select
          value={mealState.selectedOptionId}
          onValueChange={(value) => onChange({ ...mealState, selectedOptionId: value })}
        >
          <SelectTrigger className="mt-4 min-h-11 rounded-2xl border-white/10 bg-black/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#111111] text-foreground">
            {meal.options.map((entry) => (
              <SelectItem key={entry.id} value={entry.id}>
                {entry.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="mt-4 text-sm text-muted">{option.description ?? option.label}</p>
      )}

      {option.tip ? <p className="mt-4 rounded-2xl bg-accent/10 px-4 py-3 text-sm text-accent">{option.tip}</p> : null}
    </div>
  );
}
