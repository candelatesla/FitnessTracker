"use client";

import { useEffect, useState } from "react";
import { getIsoDateInTimeZone } from "@/lib/fitness";

function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";
}

function getTodayForTimeZone(timeZone: string) {
  return getIsoDateInTimeZone(new Date(), timeZone);
}

export function useSelectedDate() {
  const [timeZone, setTimeZone] = useState(() => getBrowserTimeZone());
  const [selectedDate, setSelectedDate] = useState(() => getTodayForTimeZone(getBrowserTimeZone()));

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("date");
    if (fromQuery) {
      setSelectedDate(fromQuery);
      return;
    }

    const nextTimeZone = getBrowserTimeZone();
    setTimeZone(nextTimeZone);
    setSelectedDate(getTodayForTimeZone(nextTimeZone));
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const nextTimeZone = getBrowserTimeZone();
      const nextToday = getTodayForTimeZone(nextTimeZone);
      const currentQueryDate = new URLSearchParams(window.location.search).get("date");

      setTimeZone(nextTimeZone);

      if (!currentQueryDate) {
        setSelectedDate(nextToday);
      }
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const updateSelectedDate = (date: string) => {
    setSelectedDate(date);
    const url = new URL(window.location.href);
    const today = getTodayForTimeZone(getBrowserTimeZone());
    if (date === today) {
      url.searchParams.delete("date");
    } else {
      url.searchParams.set("date", date);
    }
    window.history.replaceState({}, "", url);
  };

  return { selectedDate, setSelectedDate: updateSelectedDate, timeZone };
}
