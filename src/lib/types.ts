export const INTERVALS = ["1h", "4h", "1d"] as const;

export type Interval = (typeof INTERVALS)[number];

export type UniverseCoin = {
  rank: number;
  id: string;
  symbol: string;
  name: string;
  image: string | null;
  price: number;
  change24h: number;
  marketCap: number;
  pair: string | null;
  stable: boolean;
};

export type ScanOk = {
  ok: true;
  pair: string;
  interval: Interval;
  candleTime: number;
  close: number;
  mark: number;
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  atr: number;
  longTrend: boolean;
  shortTrend: boolean;
  rsiAbove50: boolean;
  rsiBelow50: boolean;
  crossUp: boolean;
  crossDown: boolean;
  barsSinceCrossUp: number | null;
  barsSinceCrossDown: number | null;
  signal: "long" | "short" | null;
  spark: number[];
};

export type ScanErr = {
  ok: false;
  pair: string;
  interval: Interval;
  message: string;
};

export type ScanResult = ScanOk | ScanErr;

export type ChartPoint = {
  t: number;
  c: number;
  e20: number | null;
  e50: number | null;
  e200: number | null;
};
