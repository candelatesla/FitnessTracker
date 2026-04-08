"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/shared/PageTransition";
import { WeightChart } from "@/components/progress/WeightChart";
import { WorkoutChart } from "@/components/progress/WorkoutChart";
import { CalorieChart } from "@/components/progress/CalorieChart";
import { Input } from "@/components/ui/input";
import { getChartWeeks } from "@/lib/fitness";
import type { DayLog, WeightEntry } from "@/types";

export default function ProgressPage() {
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [weightInput, setWeightInput] = useState("57.5");

  useEffect(() => {
    void Promise.all([fetch("/api/get-all-logs"), fetch("/api/get-weights")]).then(
      async ([logsRes, weightsRes]) => {
        const logsData = (await logsRes.json()) as DayLog[];
        const weightsData = (await weightsRes.json()) as WeightEntry[];
        setLogs(logsData ?? []);
        setWeights(weightsData ?? []);
      },
    );
  }, []);

  const weeklyData = useMemo(() => getChartWeeks(logs), [logs]);

  return (
    <AppShell
      title="Progress"
      subtitle="Goal: 55 kg → 50–52 kg | Timeline: 4–5 months"
    >
      <PageTransition>
        <div className="grid gap-6 xl:grid-cols-2">
          <WeightChart data={weights} />
          <WorkoutChart data={weeklyData} />
          <CalorieChart data={weeklyData} dataKey="avgCalories" title="Weekly Avg Calories" low={1500} high={1700} color="#4CAF50" />
          <CalorieChart data={weeklyData} dataKey="avgProtein" title="Weekly Avg Protein" low={95} high={110} color="#E8C547" />
          <div className="panel p-5 xl:col-span-2">
            <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">
              Weekly Weight Log
            </p>
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <Input
                value={weightInput}
                onChange={(event) => setWeightInput(event.target.value)}
                className="min-h-11 max-w-xs rounded-2xl border-white/10 bg-black/20"
                placeholder="Weight this week"
              />
              <button
                type="button"
                className="min-h-11 rounded-2xl bg-accent px-6 text-sm font-semibold text-black"
                onClick={async () => {
                  const nextEntry = {
                    weekStartDate: new Date().toISOString().slice(0, 10),
                    weekNumber: weights.length + 1,
                    weightKg: Number(weightInput),
                  };
                  await fetch("/api/log-weight", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(nextEntry),
                  });
                  setWeights((current) => [...current, nextEntry]);
                }}
              >
                Save
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                { label: "🥉 First 1 kg lost", unlocked: weights.at(-1)?.weightKg ? weights.at(-1)!.weightKg <= 56.5 : false },
                { label: "🥈 Halfway", unlocked: weights.at(-1)?.weightKg ? weights.at(-1)!.weightKg <= 55 : false },
                { label: "🥇 Goal weight reached", unlocked: weights.at(-1)?.weightKg ? weights.at(-1)!.weightKg <= 52 : false },
                { label: "🏆 Original weight restored", unlocked: weights.at(-1)?.weightKg ? weights.at(-1)!.weightKg <= 50 : false },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl border p-4 ${item.unlocked ? "border-accent/40 bg-accent/10" : "border-white/10 bg-white/[0.02]"}`}>
                  <p className="text-sm text-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
