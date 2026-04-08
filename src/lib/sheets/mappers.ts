import { createDefaultDayLog, hydrateDayLog } from "@/lib/fitness";
import type { AppSettings, DayLog, WeightEntry } from "@/types";

export function dayLogToRow(dayLog: DayLog) {
  return [
    dayLog.date,
    dayLog.workoutDayId,
    String(dayLog.workoutDone),
    JSON.stringify(dayLog.exercisesCompleted),
    String(dayLog.caloriesLogged),
    String(dayLog.proteinLogged),
    String(dayLog.waterGlasses),
    JSON.stringify(dayLog.meals),
    JSON.stringify(dayLog.snacksAvoided),
    JSON.stringify({
      notes: dayLog.notes,
      checklist: dayLog.checklist,
    }),
    dayLog.weightKg == null ? "" : String(dayLog.weightKg),
  ];
}

export function rowToDayLog(row: string[]): DayLog {
  const fallback = createDefaultDayLog(row[0]);
  const notesBlob = row[9] ? JSON.parse(row[9]) : {};

  return hydrateDayLog({
    ...fallback,
    date: row[0] || fallback.date,
    workoutDayId: row[1] || fallback.workoutDayId,
    workoutDone: row[2] === "true",
    exercisesCompleted: row[3] ? JSON.parse(row[3]) : fallback.exercisesCompleted,
    caloriesLogged: Number(row[4] || 0),
    proteinLogged: Number(row[5] || 0),
    waterGlasses: Number(row[6] || 0),
    meals: row[7] ? JSON.parse(row[7]) : fallback.meals,
    snacksAvoided: row[8] ? JSON.parse(row[8]) : fallback.snacksAvoided,
    checklist: notesBlob.checklist ?? fallback.checklist,
    notes: notesBlob.notes ?? "",
    weightKg: row[10] ? Number(row[10]) : null,
  });
}

export function weightToRow(weight: WeightEntry) {
  return [weight.weekStartDate, String(weight.weightKg), String(weight.weekNumber)];
}

export function rowToWeight(row: string[]): WeightEntry {
  return {
    weekStartDate: row[0],
    weightKg: Number(row[1]),
    weekNumber: Number(row[2]),
  };
}

export function settingsToRows(settings: AppSettings) {
  return [["startDate", settings.startDate]];
}

export function rowsToSettings(rows: string[][]): AppSettings | null {
  if (!rows.length) return null;
  const record = Object.fromEntries(rows.map(([key, value]) => [key, value]));
  if (!record.startDate) return null;
  return { startDate: record.startDate };
}
