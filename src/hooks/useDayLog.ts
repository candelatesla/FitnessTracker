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

const TRACKED_KEYS: Array<keyof DayLog> = [
  "workoutDayId",
  "workoutDone",
  "exercisesCompleted",
  "waterGlasses",
  "meals",
  "snacksAvoided",
  "checklist",
  "notes",
  "weightKg",
];

function getChangedKeys(current: DayLog, baseline: DayLog) {
  return TRACKED_KEYS.filter(
    (key) => JSON.stringify(current[key]) !== JSON.stringify(baseline[key]),
  );
}

export function useDayLog(date: string) {
  const [dayLog, setDayLog] = useState<DayLog>(createDefaultDayLog(date));
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipAutosaveRef = useRef(true);
  const baselineRef = useRef<DayLog>(createDefaultDayLog(date));

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const response = await fetch(`/api/get-day?date=${date}`, { cache: "no-store" });
      const data = (await response.json()) as DayLog | null;
      const hydrated = hydrateDayLog(data ?? createDefaultDayLog(date));
      setDayLog(hydrated);
      baselineRef.current = hydrated;
      setSaveState("idle");
      setIsLoading(false);
      skipAutosaveRef.current = true;
    }

    void load();
  }, [date]);

  useEffect(() => {
    async function refresh() {
      const response = await fetch(`/api/get-day?date=${date}`, { cache: "no-store" });
      const data = (await response.json()) as DayLog | null;
      const hydrated = hydrateDayLog(data ?? createDefaultDayLog(date));
      baselineRef.current = hydrated;
      setDayLog(hydrated);
      setSaveState("idle");
      skipAutosaveRef.current = true;
    }

    function handleFocus() {
      void refresh();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }, 2000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(intervalId);
    };
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
      const changedKeys = getChangedKeys(payload, baselineRef.current);
      if (!changedKeys.length) {
        setSaveState("idle");
        return;
      }
      await fetch("/api/log-day", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayLog: payload, changedKeys }),
      });
      baselineRef.current = payload;
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
        const changedKeys = getChangedKeys(payload, baselineRef.current);
        if (!changedKeys.length) {
          setSaveState("saved");
          return;
        }
        setSaveState("saving");
        const response = await fetch("/api/log-day", {
          method: "POST",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dayLog: payload, changedKeys }),
        });
        const saved = (await response.json()) as DayLog;
        const hydratedSaved = hydrateDayLog(saved);
        baselineRef.current = hydratedSaved;
        setDayLog(hydratedSaved);
        setSaveState("saved");
      },
    }),
    [dayLog],
  );

  return { dayLog, isLoading, saveState, ...actions };
}
