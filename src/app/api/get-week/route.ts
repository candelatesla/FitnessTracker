import { getWeekLogs } from "@/lib/sheets/client";
import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";

export { dynamic, revalidate };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");

  if (!startDate) {
    return jsonNoStore({ error: "Missing startDate" }, { status: 400 });
  }

  const week = await getWeekLogs(startDate);
  return jsonNoStore(week);
}
