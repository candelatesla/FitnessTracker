"use client";

import { motion } from "framer-motion";

export function KpiRing({
  label,
  value,
  target,
  suffix,
}: {
  label: string;
  value: number;
  target: number;
  suffix: string;
}) {
  const progress = Math.min(100, Math.round((value / target) * 100));
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="panel flex items-center gap-4 p-5">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90">
          <circle cx="48" cy="48" r="44" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="48"
            cy="48"
            r="44"
            stroke="#E8C547"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            strokeDasharray={circumference}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl text-foreground">{progress}%</span>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">
          {value}
          <span className="text-sm text-muted"> / {target}{suffix}</span>
        </p>
      </div>
    </div>
  );
}
