"use client";

import { Bar, BarChart, CartesianGrid, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CalorieChart({
  data,
  dataKey,
  title,
  low,
  high,
  color,
}: {
  data: Array<{ label: string; avgCalories: number; avgProtein: number }>;
  dataKey: "avgCalories" | "avgProtein";
  title: string;
  low: number;
  high: number;
  color: string;
}) {
  return (
    <div className="panel p-5">
      <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">{title}</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="label" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip />
            <ReferenceArea y1={low} y2={high} fill="#4CAF50" fillOpacity={0.12} />
            <Bar dataKey={dataKey} fill={color} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
