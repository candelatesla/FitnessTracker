import { getWeights } from "@/lib/sheets/client";
import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";

export { dynamic, revalidate };

export async function GET() {
  const weights = await getWeights();
  return jsonNoStore(weights);
}
