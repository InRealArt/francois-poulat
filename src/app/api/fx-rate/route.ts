import { NextResponse } from "next/server";
import { getEurToUsd } from "@/lib/fxRate";

export async function GET() {
  const rate = await getEurToUsd();
  return NextResponse.json(
    { rate },
    { headers: { "Cache-Control": "public, max-age=600" } }
  );
}
