import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";
import { upsertWeight } from "@/lib/sheets/client";
import type { WeightEntry } from "@/types";

export { dynamic, revalidate };

export async function POST(request: Request) {
  const body = (await request.json()) as WeightEntry;
  const saved = await upsertWeight(body);
  return jsonNoStore(saved);
}
