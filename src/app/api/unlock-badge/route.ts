import { NextResponse } from "next/server";
import { unlockBadge } from "@/lib/sheets/client";

export async function POST(request: Request) {
  const body = (await request.json()) as { badgeId?: string };

  if (!body.badgeId) {
    return NextResponse.json({ error: "Missing badgeId" }, { status: 400 });
  }

  const saved = await unlockBadge(body.badgeId);
  return NextResponse.json({ badgeId: saved });
}
