import { NextResponse } from "next/server";
import { getUnlockedBadgeIds } from "@/lib/sheets/client";

export async function GET() {
  const badges = await getUnlockedBadgeIds();
  return NextResponse.json(badges);
}
