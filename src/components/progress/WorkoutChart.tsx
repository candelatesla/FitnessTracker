"use client";

import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function WorkoutChart({ data }: { data: Array<{ label: string; workouts: number }> }) {
  return (
    <div className="panel p-5">
      <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">Weekly Workout Completion</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="label" stroke="#888888" />
            <YAxis stroke="#888888" domain={[0, 5]} />
            <Tooltip />
            <ReferenceLine y={5} stroke="#E8C547" strokeDasharray="4 4" />
            <Bar dataKey="workouts" fill="#E8C547" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
