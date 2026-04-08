"use client";

export function MacroBar({
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

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="text-foreground">
          {value} / {target}
          {suffix}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
