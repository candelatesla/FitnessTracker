import { NextResponse } from "next/server";
import { upsertWeight } from "@/lib/sheets/client";
import type { WeightEntry } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as WeightEntry;
  const saved = await upsertWeight(body);
  return NextResponse.json(saved);
}
