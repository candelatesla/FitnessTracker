"use client";

import { dailyChecklistItems } from "@/lib/data/dietPlan";
import { Checkbox } from "@/components/ui/checkbox";

export function DailyChecklist({
  checklist,
  onToggle,
}: {
  checklist: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
}) {
  return (
    <div className="panel p-6">
      <div className="mb-4">
        <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">
          Daily Checklist
        </p>
      </div>
      <div className="grid gap-3">
        {dailyChecklistItems.map((item) => (
          <label
            key={item.id}
            className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3"
          >
            <Checkbox
              checked={checklist[item.id]}
              disabled={item.locked}
              onCheckedChange={(checked) => onToggle(item.id, checked === true)}
            />
            <span className={item.locked ? "text-muted line-through" : "text-sm text-foreground"}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
