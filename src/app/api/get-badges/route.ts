import { getUnlockedBadgeIds } from "@/lib/sheets/client";
import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";

export { dynamic, revalidate };

export async function GET() {
  const badges = await getUnlockedBadgeIds();
  return jsonNoStore(badges);
}
