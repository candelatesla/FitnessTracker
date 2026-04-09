import "server-only";

import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import {
  getFirestore,
  type Firestore,
} from "firebase-admin/firestore";
import { DEFAULT_SETTINGS, seedWeights } from "@/lib/fitness";
import type { AppSettings, DayLog, WeightEntry } from "@/types";

type MemoryStore = {
  dayLogs: Map<string, DayLog>;
  weights: Map<string, WeightEntry>;
  badges: Set<string>;
  settings: AppSettings | null;
};

const COLLECTIONS = {
  dayLogs: "dayLogs",
  weights: "weights",
  badges: "badges",
  meta: "meta",
} as const;

declare global {
  // eslint-disable-next-line no-var
  var __fitnessTrackerStore: MemoryStore | undefined;
  // eslint-disable-next-line no-var
  var __fitnessTrackerFirebaseApp: App | undefined;
}

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

function hasFirebaseCredentials() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

function getFirebaseApp() {
  if (global.__fitnessTrackerFirebaseApp) {
    return global.__fitnessTrackerFirebaseApp;
  }

  const existing = getApps()[0];
  if (existing) {
    global.__fitnessTrackerFirebaseApp = existing;
    return existing;
  }

  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  global.__fitnessTrackerFirebaseApp = app;
  return app;
}

function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

function normalizeDayLog(data: unknown): DayLog | null {
  if (!data || typeof data !== "object") return null;
  return data as DayLog;
}

function normalizeWeight(data: unknown): WeightEntry | null {
  if (!data || typeof data !== "object") return null;
  return data as WeightEntry;
}

export async function getSettings() {
  if (!hasFirebaseCredentials()) {
    return getMemoryStore().settings;
  }

  const db = getDb();
  const snapshot = await db.collection(COLLECTIONS.meta).doc("settings").get();
  if (!snapshot.exists) return null;
  const data = snapshot.data();
  return data?.startDate ? ({ startDate: data.startDate } as AppSettings) : null;
}

export async function saveSettings(settings: AppSettings) {
  if (!hasFirebaseCredentials()) {
    getMemoryStore().settings = settings;
    return settings;
  }

  const db = getDb();
  await db.collection(COLLECTIONS.meta).doc("settings").set(settings, { merge: true });
  return settings;
}

export async function getDayLog(date: string) {
  if (!hasFirebaseCredentials()) {
    return getMemoryStore().dayLogs.get(date) ?? null;
  }

  const db = getDb();
  const snapshot = await db.collection(COLLECTIONS.dayLogs).doc(date).get();
  return snapshot.exists ? normalizeDayLog(snapshot.data()) : null;
}

export async function upsertDayLog(dayLog: DayLog) {
  if (!hasFirebaseCredentials()) {
    getMemoryStore().dayLogs.set(dayLog.date, dayLog);
    return dayLog;
  }

  const db = getDb();
  const ref = db.collection(COLLECTIONS.dayLogs).doc(dayLog.date);

  const saved = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const existing = snapshot.exists ? normalizeDayLog(snapshot.data()) : null;
    const incomingTs = Date.parse(dayLog.updatedAt ?? "") || 0;
    const existingTs = Date.parse(existing?.updatedAt ?? "") || 0;

    if (existing && incomingTs < existingTs) {
      return existing;
    }

    transaction.set(ref, dayLog, { merge: false });
    return dayLog;
  });

  return saved;
}

export async function getWeekLogs(startDate: string) {
  if (!hasFirebaseCredentials()) {
    const store = getMemoryStore();
    return [...store.dayLogs.values()]
      .filter((log) => log.date >= startDate)
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(0, 7);
  }

  const db = getDb();
  const snapshot = await db
    .collection(COLLECTIONS.dayLogs)
    .where("date", ">=", startDate)
    .orderBy("date")
    .limit(7)
    .get();

  return snapshot.docs
    .map((doc) => normalizeDayLog(doc.data()))
    .filter((log): log is DayLog => Boolean(log));
}

export async function getAllLogs() {
  if (!hasFirebaseCredentials()) {
    return [...getMemoryStore().dayLogs.values()].sort((a, b) => (a.date > b.date ? 1 : -1));
  }

  const db = getDb();
  const snapshot = await db.collection(COLLECTIONS.dayLogs).orderBy("date").get();
  return snapshot.docs
    .map((doc) => normalizeDayLog(doc.data()))
    .filter((log): log is DayLog => Boolean(log));
}

export async function upsertWeight(weight: WeightEntry) {
  if (!hasFirebaseCredentials()) {
    getMemoryStore().weights.set(weight.weekStartDate, weight);
    return weight;
  }

  const db = getDb();
  await db.collection(COLLECTIONS.weights).doc(weight.weekStartDate).set(weight, { merge: false });
  return weight;
}

export async function getWeights() {
  if (!hasFirebaseCredentials()) {
    return [...getMemoryStore().weights.values()].sort((a, b) =>
      a.weekStartDate > b.weekStartDate ? 1 : -1,
    );
  }

  const db = getDb();
  const snapshot = await db.collection(COLLECTIONS.weights).orderBy("weekStartDate").get();
  const weights = snapshot.docs
    .map((doc) => normalizeWeight(doc.data()))
    .filter((entry): entry is WeightEntry => Boolean(entry));

  return weights.length ? weights : seedWeights(DEFAULT_SETTINGS);
}

export async function unlockBadge(badgeId: string) {
  if (!hasFirebaseCredentials()) {
    getMemoryStore().badges.add(badgeId);
    return badgeId;
  }

  const db = getDb();
  const now = new Date().toISOString();
  await db.collection(COLLECTIONS.badges).doc(badgeId).set(
    {
      badgeId,
      unlockedDate: now.slice(0, 10),
      unlockedAt: now,
    },
    { merge: true },
  );
  return badgeId;
}

export async function getUnlockedBadgeIds() {
  if (!hasFirebaseCredentials()) {
    return [...getMemoryStore().badges.values()];
  }

  const db = getDb();
  const snapshot = await db.collection(COLLECTIONS.badges).get();
  return snapshot.docs.map((doc) => doc.id);
}
