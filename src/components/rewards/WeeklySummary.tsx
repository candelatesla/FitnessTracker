"use client";

export function WeeklySummary({
  workouts,
  avgCalories,
  avgProtein,
  cleanRate,
}: {
  workouts: number;
  avgCalories: number;
  avgProtein: number;
  cleanRate: number;
}) {
  const perfect = workouts >= 5 && cleanRate === 100;

  return (
    <div className="panel p-6">
      <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">
        Weekly Summary
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Workouts</p>
          <p className="mt-3 text-3xl text-foreground">{workouts}/5</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Avg Calories</p>
          <p className="mt-3 text-3xl text-foreground">{avgCalories}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Avg Protein</p>
          <p className="mt-3 text-3xl text-foreground">{avgProtein}g</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Clean Rate</p>
          <p className="mt-3 text-3xl text-foreground">{cleanRate}%</p>
        </div>
      </div>
      {perfect ? (
        <div className="mt-5 rounded-3xl border border-accent/40 bg-accent/10 px-5 py-4 text-center font-display text-3xl uppercase tracking-[0.08em] text-accent">
          🏆 Perfect Week — Kobe Would Approve
        </div>
      ) : null}
    </div>
  );
}
