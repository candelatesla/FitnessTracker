"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeightEntry } from "@/types";

export function WeightChart({ data }: { data: WeightEntry[] }) {
  return (
    <div className="panel p-5">
      <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">Weight Over Time</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="weekStartDate" stroke="#888888" />
            <YAxis stroke="#888888" domain={[48, 60]} />
            <Tooltip />
            <ReferenceLine y={52} stroke="#E8C547" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="weightKg" stroke="#E8C547" strokeWidth={3} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
