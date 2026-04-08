import { NextResponse } from "next/server";
import { getWeekLogs } from "@/lib/sheets/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");

  if (!startDate) {
    return NextResponse.json({ error: "Missing startDate" }, { status: 400 });
  }

  const week = await getWeekLogs(startDate);
  return NextResponse.json(week);
}
