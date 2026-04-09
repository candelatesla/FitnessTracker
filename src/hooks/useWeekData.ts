"use client";

import { useEffect, useState } from "react";
import { createDefaultDayLog } from "@/lib/fitness";
import type { DayLog } from "@/types";

const REFRESH_INTERVAL_MS = 5000;

export function useWeekData(startDate: string) {
  const [weekLogs, setWeekLogs] = useState<DayLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const response = await fetch(`/api/get-week?startDate=${startDate}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as DayLog[];
      setWeekLogs(data ?? []);
      setIsLoading(false);
    }

    async function refresh() {
      const response = await fetch(`/api/get-week?startDate=${startDate}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as DayLog[];
      setWeekLogs(data ?? []);
    }

    function handleFocus() {
      void refresh();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }

    void load();

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [startDate]);

  return {
    weekLogs,
    isLoading,
    fallbackFor(date: string) {
      return weekLogs.find((log) => log.date === date) ?? createDefaultDayLog(date);
    },
  };
}
