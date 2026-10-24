import { createServerFn } from "@tanstack/react-start";
import type { Interval } from "@/lib/types";

function asInterval(value: unknown): Interval {
  if (value === "1h" || value === "4h" || value === "1d") return value;
  throw new Error("بازهٔ زمانی نامعتبر است");
}

export const fetchUniverse = createServerFn({ method: "GET" }).handler(async () => {
  const { loadUniverse } = await import("@/lib/market.server");
  return loadUniverse();
});

export const scanPairs = createServerFn({ method: "POST" })
  .validator((data: { interval: Interval; pairs: string[]; fresh?: boolean }) => {
    const interval = asInterval(data?.interval);
    if (!Array.isArray(data?.pairs) || data.pairs.length === 0 || data.pairs.length > 20) {
      throw new Error("دستهٔ نمادها نامعتبر است");
    }
    const pairs: string[] = [];
    for (const pair of data.pairs) {
      if (typeof pair !== "string" || !/^[A-Z0-9]{2,24}USDT$/.test(pair)) {
        throw new Error("نماد نامعتبر است");
      }
      pairs.push(pair);
    }
    return { interval, pairs, fresh: Boolean(data.fresh) };
  })
  .handler(async ({ data }) => {
    const { scanBatch } = await import("@/lib/market.server");
    return scanBatch(data.interval, data.pairs, data.fresh);
  });

export const fetchChart = createServerFn({ method: "POST" })
  .validator((data: { pair: string; interval: Interval }) => {
    const interval = asInterval(data?.interval);
    if (typeof data?.pair !== "string" || !/^[A-Z0-9]{2,24}USDT$/.test(data.pair)) {
      throw new Error("نماد نامعتبر است");
    }
    return { pair: data.pair, interval };
  })
  .handler(async ({ data }) => {
    const { loadChart } = await import("@/lib/market.server");
    return loadChart(data.pair, data.interval);
  });
