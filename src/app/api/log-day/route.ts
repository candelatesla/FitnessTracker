import { hydrateDayLog } from "@/lib/fitness";
import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";
import { upsertDayLog } from "@/lib/sheets/client";
import type { DayLog } from "@/types";

export { dynamic, revalidate };

export async function POST(request: Request) {
  const body = (await request.json()) as DayLog;
  const saved = await upsertDayLog(hydrateDayLog(body));
  return jsonNoStore(saved);
}
