import { getAllLogs } from "@/lib/sheets/client";
import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";

export { dynamic, revalidate };

export async function GET() {
  const logs = await getAllLogs();
  return jsonNoStore(logs);
}
