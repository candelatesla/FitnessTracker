import { getDayLog } from "@/lib/sheets/client";
import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";

export { dynamic, revalidate };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return jsonNoStore({ error: "Missing date" }, { status: 400 });
  }

  const dayLog = await getDayLog(date);
  return jsonNoStore(dayLog);
}
