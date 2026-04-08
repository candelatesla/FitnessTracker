"use client";

import { useEffect, useState } from "react";
import { getIsoDate } from "@/lib/fitness";

const STORAGE_KEY = "fitness-tracker:selected-date";

export function useSelectedDate() {
  const [selectedDate, setSelectedDate] = useState(() => getIsoDate(new Date()));

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("date");
    if (fromQuery) {
      setSelectedDate(fromQuery);
      window.localStorage.setItem(STORAGE_KEY, fromQuery);
      return;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSelectedDate(saved);
    }
  }, []);

  const updateSelectedDate = (date: string) => {
    setSelectedDate(date);
    window.localStorage.setItem(STORAGE_KEY, date);
    const url = new URL(window.location.href);
    url.searchParams.set("date", date);
    window.history.replaceState({}, "", url);
  };

  return { selectedDate, setSelectedDate: updateSelectedDate };
}
