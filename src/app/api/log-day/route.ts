import { hydrateDayLog } from "@/lib/fitness";
import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";
import { getDayLog, upsertDayLog } from "@/lib/sheets/client";
import type { DayLog } from "@/types";

export { dynamic, revalidate };

type LogDayRequest = {
  dayLog: DayLog;
  changedKeys?: Array<keyof DayLog>;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LogDayRequest | DayLog;
  const payload = "dayLog" in body ? body.dayLog : body;
  const changedKeys =
    "changedKeys" in body && Array.isArray(body.changedKeys) ? body.changedKeys : null;

  const existing = (await getDayLog(payload.date)) ?? hydrateDayLog(payload);
  const merged = changedKeys?.length
    ? changedKeys.reduce<DayLog>(
        (acc, key) => ({
          ...acc,
          [key]: payload[key],
        }),
        {
          ...existing,
          timezone: payload.timezone ?? existing.timezone,
          createdAt: existing.createdAt ?? payload.createdAt,
          updatedAt: payload.updatedAt,
        },
      )
    : payload;

  const saved = await upsertDayLog(hydrateDayLog(merged));
  return jsonNoStore(saved);
}
