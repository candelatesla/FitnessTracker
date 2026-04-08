import { NextResponse } from "next/server";
import { hydrateDayLog } from "@/lib/fitness";
import { upsertDayLog } from "@/lib/sheets/client";
import type { DayLog } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as DayLog;
  const saved = await upsertDayLog(hydrateDayLog(body));
  return NextResponse.json(saved);
}
