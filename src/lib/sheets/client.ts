import "server-only";

import { google } from "googleapis";
import { DEFAULT_SETTINGS, seedWeights } from "@/lib/fitness";
import { dayLogToRow, rowToDayLog, rowToWeight, rowsToSettings, settingsToRows, weightToRow } from "@/lib/sheets/mappers";
import type { AppSettings, DayLog, WeightEntry } from "@/types";

type MemoryStore = {
  dayLogs: Map<string, DayLog>;
  weights: Map<string, WeightEntry>;
  badges: Set<string>;
  settings: AppSettings | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __fitnessTrackerStore: MemoryStore | undefined;
}

const SHEETS = {
  dailyLog: {
    title: "DailyLog",
    headers: [
      "Date",
      "WorkoutDay",
      "WorkoutDone",
      "ExercisesCompleted(JSON)",
      "CaloriesLogged",
      "ProteinLogged",
      "WaterGlasses",
      "MealsEaten(JSON)",
      "SnacksAvoided(JSON)",
      "Notes",
      "WeightKg",
    ],
  },
  weeklyWeight: {
    title: "WeeklyWeight",
    headers: ["WeekStartDate", "WeightKg", "WeekNumber"],
  },
  badges: {
    title: "Badges",
    headers: ["BadgeId", "UnlockedDate", "UnlockedAt"],
  },
  settings: {
    title: "Settings",
    headers: ["Key", "Value"],
  },
} as const;

function getMemoryStore(): MemoryStore {
  if (!global.__fitnessTrackerStore) {
    const seededWeights = seedWeights(DEFAULT_SETTINGS);
    global.__fitnessTrackerStore = {
      dayLogs: new Map(),
      weights: new Map(seededWeights.map((entry) => [entry.weekStartDate, entry])),
      badges: new Set(),
      settings: null,
    };
  }
  return global.__fitnessTrackerStore;
}

function hasGoogleCredentials() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID,
  );
}

async function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

async function ensureSheetStructure() {
  if (!hasGoogleCredentials()) return;

  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
  const existing = await sheets.spreadsheets.get({ spreadsheetId });
  const titles = new Set(existing.data.sheets?.map((sheet) => sheet.properties?.title));
  const requests = Object.values(SHEETS)
    .filter((sheet) => !titles.has(sheet.title))
    .map((sheet) => ({
      addSheet: {
        properties: {
          title: sheet.title,
        },
      },
    }));

  if (requests.length) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
  }

  await Promise.all(
    Object.values(SHEETS).map(async (sheet) => {
      const current = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheet.title}!A1:Z2`,
      });

      if (!current.data.values?.length) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheet.title}!A1`,
          valueInputOption: "RAW",
          requestBody: { values: [Array.from(sheet.headers)] },
        });
      }
    }),
  );
}

async function readSheetValues(sheetTitle: string) {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetTitle}!A2:Z`,
  });
  return response.data.values ?? [];
}

async function upsertSheetRow(
  sheetTitle: string,
  key: string,
  values: string[],
) {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
  const rows = await readSheetValues(sheetTitle);
  const rowIndex = rows.findIndex((row) => row[0] === key);

  if (rowIndex >= 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A${rowIndex + 2}`,
      valueInputOption: "RAW",
      requestBody: { values: [values] },
    });
    return;
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetTitle}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });
}

export async function getSettings() {
  if (!hasGoogleCredentials()) {
    return getMemoryStore().settings;
  }

  await ensureSheetStructure();
  const rows = await readSheetValues(SHEETS.settings.title);
  return rowsToSettings(rows);
}

export async function saveSettings(settings: AppSettings) {
  if (!hasGoogleCredentials()) {
    getMemoryStore().settings = settings;
    return settings;
  }

  await ensureSheetStructure();
  const rows = settingsToRows(settings);
  await Promise.all(
    rows.map(([key, value]) => upsertSheetRow(SHEETS.settings.title, key, [key, value])),
  );
  return settings;
}

export async function getDayLog(date: string) {
  if (!hasGoogleCredentials()) {
    return getMemoryStore().dayLogs.get(date) ?? null;
  }

  await ensureSheetStructure();
  const rows = await readSheetValues(SHEETS.dailyLog.title);
  const row = rows.find((entry) => entry[0] === date);
  return row ? rowToDayLog(row) : null;
}

export async function upsertDayLog(dayLog: DayLog) {
  if (!hasGoogleCredentials()) {
    getMemoryStore().dayLogs.set(dayLog.date, dayLog);
    return dayLog;
  }

  await ensureSheetStructure();
  await upsertSheetRow(SHEETS.dailyLog.title, dayLog.date, dayLogToRow(dayLog));
  return dayLog;
}

export async function getWeekLogs(startDate: string) {
  if (!hasGoogleCredentials()) {
    const store = getMemoryStore();
    return [...store.dayLogs.values()].filter((log) => log.date >= startDate);
  }

  await ensureSheetStructure();
  const rows = await readSheetValues(SHEETS.dailyLog.title);
  return rows
    .map(rowToDayLog)
    .filter((log) => log.date >= startDate)
    .slice(0, 7);
}

export async function getAllLogs() {
  if (!hasGoogleCredentials()) {
    return [...getMemoryStore().dayLogs.values()].sort((a, b) => (a.date > b.date ? 1 : -1));
  }

  await ensureSheetStructure();
  const rows = await readSheetValues(SHEETS.dailyLog.title);
  return rows.map(rowToDayLog).sort((a, b) => (a.date > b.date ? 1 : -1));
}

export async function upsertWeight(weight: WeightEntry) {
  if (!hasGoogleCredentials()) {
    getMemoryStore().weights.set(weight.weekStartDate, weight);
    return weight;
  }

  await ensureSheetStructure();
  await upsertSheetRow(SHEETS.weeklyWeight.title, weight.weekStartDate, weightToRow(weight));
  return weight;
}

export async function getWeights() {
  if (!hasGoogleCredentials()) {
    return [...getMemoryStore().weights.values()].sort((a, b) =>
      a.weekStartDate > b.weekStartDate ? 1 : -1,
    );
  }

  await ensureSheetStructure();
  const rows = await readSheetValues(SHEETS.weeklyWeight.title);
  return rows.map(rowToWeight).sort((a, b) => (a.weekStartDate > b.weekStartDate ? 1 : -1));
}

export async function unlockBadge(badgeId: string) {
  if (!hasGoogleCredentials()) {
    getMemoryStore().badges.add(badgeId);
    return badgeId;
  }

  await ensureSheetStructure();
  const now = new Date();
  await upsertSheetRow(SHEETS.badges.title, badgeId, [
    badgeId,
    now.toISOString().slice(0, 10),
    now.toISOString(),
  ]);
  return badgeId;
}

export async function getUnlockedBadgeIds() {
  if (!hasGoogleCredentials()) {
    return [...getMemoryStore().badges.values()];
  }

  await ensureSheetStructure();
  const rows = await readSheetValues(SHEETS.badges.title);
  return rows.map((row) => row[0]);
}
