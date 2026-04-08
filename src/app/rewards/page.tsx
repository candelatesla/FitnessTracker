"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { BadgeCard } from "@/components/rewards/BadgeCard";
import { WeeklySummary } from "@/components/rewards/WeeklySummary";
import { PageTransition } from "@/components/shared/PageTransition";
import { useBadges } from "@/hooks/useBadges";
import { getChartWeeks } from "@/lib/fitness";

export default function RewardsPage() {
  const { allBadges, unlockedIds, logs, weights, nextBadge } = useBadges();
  const latestWeek = useMemo(() => getChartWeeks(logs).at(-1), [logs]);

  return (
    <AppShell
      title="Championship Board 🏆"
      subtitle="Every rep counts. Every meal matters. Collect them all."
    >
      <PageTransition>
        {latestWeek ? (
          <WeeklySummary
            workouts={latestWeek.workouts}
            avgCalories={latestWeek.avgCalories}
            avgProtein={latestWeek.avgProtein}
            cleanRate={latestWeek.cleanRate}
          />
        ) : null}

        {nextBadge ? (
          <div className="mt-6 rounded-3xl border border-accent/30 bg-accent/10 p-5 text-sm text-accent">
            Next badge target: <span className="font-semibold">{nextBadge.badge.name}</span> · {nextBadge.hint}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {allBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} unlocked={unlockedIds.includes(badge.id)} />
          ))}
        </div>
      </PageTransition>
    </AppShell>
  );
}
