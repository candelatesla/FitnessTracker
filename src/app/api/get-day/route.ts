import { NextResponse } from "next/server";
import { getDayLog } from "@/lib/sheets/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  const dayLog = await getDayLog(date);
  return NextResponse.json(dayLog);
}
