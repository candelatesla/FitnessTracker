import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";
import { unlockBadge } from "@/lib/sheets/client";

export { dynamic, revalidate };

export async function POST(request: Request) {
  const body = (await request.json()) as { badgeId?: string };

  if (!body.badgeId) {
    return jsonNoStore({ error: "Missing badgeId" }, { status: 400 });
  }

  const saved = await unlockBadge(body.badgeId);
  return jsonNoStore({ badgeId: saved });
}
