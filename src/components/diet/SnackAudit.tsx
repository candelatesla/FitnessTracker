"use client";

import { snackAuditItems, yogurtBoosts } from "@/lib/data/dietPlan";
import { Checkbox } from "@/components/ui/checkbox";

export function SnackAudit({
  snacksAvoided,
  yogurtState,
  onSnackToggle,
  onYogurtToggle,
}: {
  snacksAvoided: Record<string, boolean>;
  yogurtState: Record<string, boolean>;
  onSnackToggle: (id: string, checked: boolean) => void;
  onYogurtToggle: (id: string, checked: boolean) => void;
}) {
  const score = Object.values(snacksAvoided).filter(Boolean).length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="panel p-5">
        <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">
          Snack Audit
        </p>
        <div className="mt-4 grid gap-3">
          {snackAuditItems.map((item) => (
            <label key={item.id} className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <Checkbox
                checked={snacksAvoided[item.id]}
                onCheckedChange={(checked) => onSnackToggle(item.id, checked === true)}
              />
              <span className="text-sm text-foreground">{item.label}</span>
            </label>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Score: {score}/5 avoided {score === 5 ? "👑" : ""}
        </p>
      </div>

      <div className="panel p-5">
        <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">
          Greek Yogurt Tracker
        </p>
        <div className="mt-4 grid gap-3">
          {yogurtBoosts.map((item) => (
            <label key={item.id} className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <Checkbox
                checked={yogurtState[item.id]}
                onCheckedChange={(checked) => onYogurtToggle(item.id, checked === true)}
              />
              <span className="text-sm text-foreground">{item.label}</span>
            </label>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Adding yogurt at both meals helps you hit 100g protein daily.
        </p>
      </div>
    </div>
  );
}
