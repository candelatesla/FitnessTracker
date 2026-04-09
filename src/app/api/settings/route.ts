import { dynamic, jsonNoStore, revalidate } from "@/lib/api-response";
import { getSettings, saveSettings } from "@/lib/sheets/client";
import type { AppSettings } from "@/types";

export { dynamic, revalidate };

export async function GET() {
  const settings = await getSettings();
  return jsonNoStore(settings);
}

export async function POST(request: Request) {
  const body = (await request.json()) as AppSettings;
  const saved = await saveSettings(body);
  return jsonNoStore(saved);
}
