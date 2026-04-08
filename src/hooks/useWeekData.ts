"use client";

import { useEffect, useState } from "react";
import { createDefaultDayLog } from "@/lib/fitness";
import type { DayLog } from "@/types";

export function useWeekData(startDate: string) {
  const [weekLogs, setWeekLogs] = useState<DayLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const response = await fetch(`/api/get-week?startDate=${startDate}`);
      const data = (await response.json()) as DayLog[];
      setWeekLogs(data ?? []);
      setIsLoading(false);
    }
    void load();
  }, [startDate]);

  return {
    weekLogs,
    isLoading,
    fallbackFor(date: string) {
      return weekLogs.find((log) => log.date === date) ?? createDefaultDayLog(date);
    },
  };
}
