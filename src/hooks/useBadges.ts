"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { badgeDefinitions } from "@/lib/data/badges";
import { computeBadgeEligibility, getNextBadgeTarget, getUnlockedMilestones } from "@/lib/fitness";
import type { DayLog, WeightEntry } from "@/types";

export function useBadges() {
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const announcedRef = useRef(new Set<string>());

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [logsRes, weightsRes, badgesRes] = await Promise.all([
        fetch("/api/get-all-logs", { cache: "no-store" }),
        fetch("/api/get-weights", { cache: "no-store" }),
        fetch("/api/get-badges", { cache: "no-store" }),
      ]);

      const logsData = (await logsRes.json()) as DayLog[];
      const weightsData = (await weightsRes.json()) as WeightEntry[];
      const unlockedData = (await badgesRes.json()) as string[];

      setLogs(logsData ?? []);
      setWeights(weightsData ?? []);
      setUnlockedIds(unlockedData ?? []);
      setIsLoading(false);
    }

    void load();
  }, []);

  const eligible = useMemo(
    () => computeBadgeEligibility(logs, weights),
    [logs, weights],
  );

  useEffect(() => {
    const missing = eligible.filter((badge) => !unlockedIds.includes(badge.id));

    if (!missing.length) return;

    void Promise.all(
      missing.map(async (badge) => {
        await fetch("/api/unlock-badge", {
          method: "POST",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ badgeId: badge.id }),
        });

        if (!announcedRef.current.has(badge.id)) {
          toast(`🏆 Badge Unlocked: ${badge.name}`);
          announcedRef.current.add(badge.id);
          confetti({ particleCount: badge.id === "perfect-week" ? 220 : 120, spread: 90 });
        }
      }),
    ).then(() => {
      setUnlockedIds((current) => [...new Set([...current, ...missing.map((badge) => badge.id)])]);
    });
  }, [eligible, unlockedIds]);

  return {
    isLoading,
    logs,
    weights,
    unlockedIds,
    allBadges: badgeDefinitions,
    eligibleIds: eligible.map((badge) => badge.id),
    nextBadge: getNextBadgeTarget(unlockedIds, logs, weights),
    milestones: getUnlockedMilestones(weights),
  };
}
