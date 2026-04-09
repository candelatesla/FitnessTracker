"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createDefaultDayLog, hydrateDayLog } from "@/lib/fitness";
import type { DayLog } from "@/types";

type SaveState = "idle" | "saving" | "saved";

function stampDayLog(dayLog: DayLog): DayLog {
  return {
    ...dayLog,
    updatedAt: new Date().toISOString(),
  };
}

export function useDayLog(date: string) {
  const [dayLog, setDayLog] = useState<DayLog>(createDefaultDayLog(date));
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipAutosaveRef = useRef(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const response = await fetch(`/api/get-day?date=${date}`, { cache: "no-store" });
      const data = (await response.json()) as DayLog | null;
      const hydrated = hydrateDayLog(data ?? createDefaultDayLog(date));
      setDayLog(hydrated);
      setSaveState("idle");
      setIsLoading(false);
      skipAutosaveRef.current = true;
    }

    void load();
  }, [date]);

  useEffect(() => {
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSaveState("saving");
    timeoutRef.current = setTimeout(async () => {
      const payload = hydrateDayLog(stampDayLog(dayLog));
      await fetch("/api/log-day", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSaveState("saved");
    }, 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [dayLog]);

  const actions = useMemo(
    () => ({
      patch(patch: Partial<DayLog>) {
        setDayLog((current) => hydrateDayLog({ ...current, ...patch }));
      },
      update(mutator: (current: DayLog) => DayLog) {
        setDayLog((current) => hydrateDayLog(mutator(current)));
      },
      async saveNow() {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const payload = hydrateDayLog(stampDayLog(dayLog));
        setSaveState("saving");
        await fetch("/api/log-day", {
          method: "POST",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSaveState("saved");
      },
    }),
    [dayLog],
  );

  return { dayLog, isLoading, saveState, ...actions };
}
