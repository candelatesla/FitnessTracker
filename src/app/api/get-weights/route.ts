import { NextResponse } from "next/server";
import { getWeights } from "@/lib/sheets/client";

export async function GET() {
  const weights = await getWeights();
  return NextResponse.json(weights);
}
