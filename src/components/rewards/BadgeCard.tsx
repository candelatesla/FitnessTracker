"use client";

import { Lock } from "lucide-react";
import type { BadgeDefinition } from "@/types";

export function BadgeCard({
  badge,
  unlocked,
}: {
  badge: BadgeDefinition;
  unlocked: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        unlocked
          ? "border-accent/40 bg-accent/10"
          : "border-white/10 bg-white/[0.03] opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl">{badge.emoji}</p>
          <p className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-foreground">
            {badge.name}
          </p>
          <p className="mt-2 text-sm text-muted">{badge.description}</p>
        </div>
        {!unlocked ? <Lock className="h-5 w-5 text-muted" /> : null}
      </div>
    </div>
  );
}
