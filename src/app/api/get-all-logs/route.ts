import { NextResponse } from "next/server";
import { getAllLogs } from "@/lib/sheets/client";

export async function GET() {
  const logs = await getAllLogs();
  return NextResponse.json(logs);
}
