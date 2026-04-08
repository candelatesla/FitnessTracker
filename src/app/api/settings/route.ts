import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/sheets/client";
import type { AppSettings } from "@/types";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const body = (await request.json()) as AppSettings;
  const saved = await saveSettings(body);
  return NextResponse.json(saved);
}
