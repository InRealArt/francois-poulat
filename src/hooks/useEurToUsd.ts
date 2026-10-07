"use client";

import { useEffect, useState } from "react";
import { FALLBACK_EUR_TO_USD } from "@/lib/content";

// Display-only rate; the server recomputes the charged amount itself.
export function useEurToUsd() {
  const [rate, setRate] = useState(FALLBACK_EUR_TO_USD);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/fx-rate", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { rate?: unknown } | null) => {
        if (typeof data?.rate === "number" && data.rate > 0) {
          setRate(data.rate);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return rate;
}
