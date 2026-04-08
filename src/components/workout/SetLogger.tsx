"use client";

import { Input } from "@/components/ui/input";
import type { SetLogEntry } from "@/types";

export function SetLogger({
  sets,
  onChange,
}: {
  sets: SetLogEntry[];
  onChange: (index: number, patch: Partial<SetLogEntry>) => void;
}) {
  return (
    <div className="mt-4 grid gap-3">
      {sets.map((set, index) => (
        <div key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 md:grid-cols-[auto,1fr,1fr,auto] md:items-center">
          <div className="font-display text-2xl uppercase text-accent">Set {index + 1}</div>
          <Input
            value={set.weightKg}
            onChange={(event) => onChange(index, { weightKg: event.target.value })}
            placeholder="Weight kg"
            className="min-h-11 rounded-2xl border-white/10 bg-black/20"
          />
          <Input
            value={set.repsDone}
            onChange={(event) => onChange(index, { repsDone: event.target.value })}
            placeholder="Reps done"
            className="min-h-11 rounded-2xl border-white/10 bg-black/20"
          />
          <button
            type="button"
            onClick={() => onChange(index, { completed: !set.completed })}
            className={`min-h-11 rounded-2xl border px-4 text-sm ${
              set.completed
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-white/10 bg-white/[0.02] text-muted"
            }`}
          >
            {set.completed ? "Completed" : "Mark done"}
          </button>
        </div>
      ))}
    </div>
  );
}
