import type { Candle } from "@/lib/indicators";
import { chartSeries, evaluate } from "@/lib/strategy";
import type { ChartPoint, Interval, ScanResult, UniverseCoin } from "@/lib/types";

const HEADERS = {
  accept: "application/json",
  "user-agent": "RavandScanner/1.0",
};

const STABLES = new Set([
  "USDT", "USDC", "DAI", "FDUSD", "TUSD", "USDE", "USDS", "SUSDS", "SUSDE",
  "PYUSD", "USD1", "USDD", "FRAX", "LUSD", "GUSD", "USDP", "EURC", "RLUSD",
  "USD0", "USDT0", "USDG", "BFUSD", "USDB", "GHO", "CRVUSD", "USDY", "USDM",
  "USDX", "EURI", "EURT", "EURS", "USDL", "USDN", "USTC", "UST", "MIM", "DOLA",
  "ALUSD", "SUSD", "OUSD", "USDJ", "BUSD", "HUSD", "FEI", "USDBC", "USDCE",
  "USR", "USDSUI",
]);

const ALIAS: Record<string, string> = {
  MIOTA: "IOTA",
  MATIC: "POL",
  RNDR: "RENDER",
};

type Cache = {
  bases?: { at: number; symbols: Set<string> };
  universe?: { at: number; coins: UniverseCoin[] };
  klines: Map<string, { at: number; closed: Candle[]; mark: number }>;
};

const cache: Cache = ((globalThis as unknown as { __ravand?: Cache }).__ravand ??= {
  klines: new Map(),
});

const inflight = new Map<string, Promise<unknown>>();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url: string, attempts = 3): Promise<unknown> {
  let last = "نامشخص";
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
      if (res.status === 429 || res.status === 418 || res.status >= 500) {
        last = `HTTP ${res.status}`;
        await delay(400 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      last = error instanceof Error ? error.message : "خطای شبکه";
      if (i === attempts - 1) break;
      await delay(400 * (i + 1));
    }
  }
  throw new Error(last);
}

function isStable(symbol: string, name: string): boolean {
  const s = symbol.toUpperCase();
  if (STABLES.has(s)) return true;
  const n = name.toLowerCase();
  if (n.includes("stablecoin")) return true;
  return /tether|usd coin|trueusd|paypal usd|first digital|ethena usde|ripple usd|usual usd|^dai$/.test(n);
}

function resolvePair(symbol: string, usdt: Set<string>): string | null {
  const raw = symbol.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!raw) return null;
  const aliased = ALIAS[raw] ?? raw;
  const tries = [...new Set([aliased, raw, `1000${aliased}`, `1000${raw}`])];
  for (const base of tries) {
    const pair = `${base}USDT`;
    if (usdt.has(pair)) return pair;
  }
  return null;
}

async function loadBases(): Promise<Set<string>> {
  if (cache.bases && Date.now() - cache.bases.at < 30 * 60 * 1000) return cache.bases.symbols;
  const data = await fetchJson("https://data-api.binance.vision/api/v3/ticker/price");
  if (!Array.isArray(data)) throw new Error("فهرست جفت‌های بایننس نامعتبر بود");
  const symbols = new Set<string>();
  for (const row of data) {
    const symbol = (row as { symbol?: string }).symbol;
    if (symbol && symbol.endsWith("USDT")) symbols.add(symbol);
  }
  if (symbols.size < 50) throw new Error("فهرست جفت‌های بایننس در دسترس نیست");
  cache.bases = { at: Date.now(), symbols };
  return symbols;
}

type PaprikaTicker = {
  id?: string;
  name?: string;
  symbol?: string;
  rank?: number;
  quotes?: { USD?: { price?: number; market_cap?: number; percent_change_24h?: number } };
};

async function loadPaprika(): Promise<UniverseCoin[] | null> {
  try {
    const data = await fetchJson("https://api.coinpaprika.com/v1/tickers?limit=100");
    if (!Array.isArray(data) || data.length < 50) return null;
    return (data as PaprikaTicker[]).slice(0, 100).map((coin, index) => {
      const usd = coin.quotes?.USD;
      const symbol = coin.symbol ?? "";
      const name = coin.name ?? symbol;
      return {
        rank: coin.rank ?? index + 1,
        id: coin.id ?? symbol.toLowerCase(),
        symbol: symbol.toUpperCase(),
        name,
        image: coin.id ? `https://static.coinpaprika.com/coin/${coin.id}/logo.png` : null,
        price: Number(usd?.price ?? 0),
        change24h: Number(usd?.percent_change_24h ?? 0),
        marketCap: Number(usd?.market_cap ?? 0),
        pair: null,
        stable: isStable(symbol, name),
      };
    });
  } catch {
    return null;
  }
}

type LoreRow = {
  symbol?: string;
  name?: string;
  rank?: number;
  price_usd?: string;
  percent_change_24h?: string;
  market_cap_usd?: string;
};

async function loadCoinlore(): Promise<UniverseCoin[] | null> {
  try {
    const data = (await fetchJson("https://api.coinlore.net/api/tickers/?start=0&limit=100")) as {
      data?: LoreRow[];
    };
    const rows = data.data;
    if (!Array.isArray(rows) || rows.length < 50) return null;
    return rows.slice(0, 100).map((coin, index) => {
      const symbol = coin.symbol ?? "";
      const name = coin.name ?? symbol;
      return {
        rank: Number(coin.rank ?? index + 1),
        id: symbol.toLowerCase(),
        symbol: symbol.toUpperCase(),
        name,
        image: null,
        price: Number(coin.price_usd ?? 0),
        change24h: Number(coin.percent_change_24h ?? 0),
        marketCap: Number(coin.market_cap_usd ?? 0),
        pair: null,
        stable: isStable(symbol, name),
      };
    });
  } catch {
    return null;
  }
}

export async function loadUniverse(): Promise<UniverseCoin[]> {
  if (cache.universe && Date.now() - cache.universe.at < 10 * 60 * 1000) {
    return cache.universe.coins;
  }
  const pending = inflight.get("universe");
  if (pending) return pending as Promise<UniverseCoin[]>;

  const job = (async () => {
    const [bases, listed] = await Promise.all([
      loadBases(),
      (async () => (await loadPaprika()) ?? (await loadCoinlore()))(),
    ]);
    if (!listed) {
      throw new Error("فهرست ۱۰۰ ارز برتر در دسترس نیست. کمی بعد دوباره اسکن کنید.");
    }
    const used = new Set<string>();
    const coins = listed.map((coin) => {
      if (coin.stable) return coin;
      let pair = resolvePair(coin.symbol, bases);
      if (pair && used.has(pair)) pair = null;
      if (pair) used.add(pair);
      return { ...coin, pair };
    });
    cache.universe = { at: Date.now(), coins };
    return coins;
  })().finally(() => inflight.delete("universe"));

  inflight.set("universe", job);
  return job;
}

function parseKline(row: unknown[]): Candle | null {
  if (!Array.isArray(row) || row.length < 7) return null;
  const candle: Candle = {
    t: Number(row[0]),
    o: Number(row[1]),
    h: Number(row[2]),
    l: Number(row[3]),
    c: Number(row[4]),
  };
  if (![candle.t, candle.o, candle.h, candle.l, candle.c].every(Number.isFinite)) return null;
  return candle;
}

async function loadKlines(pair: string, interval: Interval, fresh: boolean): Promise<{ closed: Candle[]; mark: number }> {
  const key = `${pair}:${interval}`;
  const hit = cache.klines.get(key);
  if (!fresh && hit && Date.now() - hit.at < 75 * 1000) return hit;

  const url = `https://data-api.binance.vision/api/v3/klines?symbol=${pair}&interval=${interval}&limit=500`;
  const data = await fetchJson(url, 2);
  if (!Array.isArray(data)) throw new Error("کندل نامعتبر بود");
  const now = Date.now();
  const closed: Candle[] = [];
  let mark: number | null = null;
  for (const row of data) {
    const candle = parseKline(row as unknown[]);
    if (!candle) continue;
    const closeTime = Number((row as unknown[])[6]);
    if (Number.isFinite(closeTime) && closeTime > now) mark = candle.c;
    else closed.push(candle);
  }
  if (closed.length === 0) throw new Error("کندلی برنگشت");
  const pack = { at: Date.now(), closed, mark: mark ?? closed[closed.length - 1]!.c };
  cache.klines.set(key, pack);
  return pack;
}

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      out[index] = await fn(items[index]!);
    }
  }
  const workers = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workers }, () => worker()));
  return out;
}

export async function scanBatch(interval: Interval, pairs: string[], fresh: boolean): Promise<ScanResult[]> {
  const key = `${interval}:${pairs.join(",")}:${fresh ? "fresh" : "cached"}`;
  if (!fresh) {
    const pending = inflight.get(key);
    if (pending) return pending as Promise<ScanResult[]>;
  }
  const job = mapPool(pairs, 8, async (pair) => {
    try {
      const { closed, mark } = await loadKlines(pair, interval, fresh);
      const result = evaluate(closed);
      if (!result.ok) {
        return { ok: false as const, pair, interval, message: result.message };
      }
      return { ...result, pair, interval, mark };
    } catch {
      return { ok: false as const, pair, interval, message: "دریافت کندل ناموفق بود" };
    }
  }).finally(() => inflight.delete(key));

  inflight.set(key, job);
  return job;
}

export async function loadChart(pair: string, interval: Interval): Promise<ChartPoint[]> {
  const { closed } = await loadKlines(pair, interval, false);
  return chartSeries(closed, 140);
}
