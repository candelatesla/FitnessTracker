"use client";

import { Loader2, CheckCircle2, Dot } from "lucide-react";

export function SaveIndicator({ state }: { state: "idle" | "saving" | "saved" }) {
  if (state === "saving") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
        Saving...
      </div>
    );
  }

  if (state === "saved") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-accent">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Saved
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted">
      <Dot className="h-4 w-4" />
      Ready
    </div>
  );
}
