import "server-only";
import { FALLBACK_EUR_TO_USD } from "@/lib/content";

const TTL_MS = 60 * 60 * 1000;

let cached: { rate: number; fetchedAt: number } | null = null;

// Live EUR→USD rate, cached 1h in memory. Never throws: falls back so the
// checkout is never blocked by the FX provider.
export async function getEurToUsd(): Promise<number> {
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
    return cached.rate;
  }

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/EUR", {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error(`fx_http_${response.status}`);
    const data = (await response.json()) as { rates?: { USD?: unknown } };
    const rate = data.rates?.USD;
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      throw new Error("fx_invalid_payload");
    }
    cached = { rate, fetchedAt: Date.now() };
    return rate;
  } catch (error) {
    console.error("[fx-rate]", error);
    return cached?.rate ?? FALLBACK_EUR_TO_USD;
  }
}
