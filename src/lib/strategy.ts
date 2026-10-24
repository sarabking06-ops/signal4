import { atr, ema, rsi, type Candle } from "@/lib/indicators";
import type { ChartPoint, ScanOk } from "@/lib/types";

export const RISK_FRACTION = 0.005;
export const SL_ATR_MULT = 1.5;
export const TP_MULTIPLE = 2;
export const CROSS_LOOKBACK = 30;
export const MIN_BARS = 210;

export type Eval = { ok: false; message: string } | Omit<ScanOk, "pair" | "interval" | "mark">;

/**
 * Cross is evaluated on closed candles only:
 * up = previous close ≤ previous EMA20 and this close > this EMA20.
 */
function barsSinceCross(closes: number[], line: number[], dir: "up" | "down"): number | null {
  const n = closes.length;
  const start = Math.max(1, n - CROSS_LOOKBACK);
  for (let i = n - 1; i >= start; i--) {
    const prevC = closes[i - 1]!;
    const prevE = line[i - 1]!;
    const c = closes[i]!;
    const e = line[i]!;
    if (![prevC, prevE, c, e].every(Number.isFinite)) continue;
    const up = prevC <= prevE && c > e;
    const down = prevC >= prevE && c < e;
    if (dir === "up" && up) return n - 1 - i;
    if (dir === "down" && down) return n - 1 - i;
  }
  return null;
}

export function evaluate(candles: Candle[]): Eval {
  if (candles.length < MIN_BARS) {
    return { ok: false, message: "تاریخچه برای EMA ۲۰۰ کافی نیست" };
  }
  const closes = candles.map((c) => c.c);
  const e20 = ema(closes, 20);
  const e50 = ema(closes, 50);
  const e200 = ema(closes, 200);
  const rsiLine = rsi(closes, 14);
  const atrLine = atr(candles, 14);
  const i = closes.length - 1;
  const close = closes[i]!;
  const ema20 = e20[i]!;
  const ema50 = e50[i]!;
  const ema200 = e200[i]!;
  const rsiValue = rsiLine[i]!;
  const atrValue = atrLine[i]!;
  if (![close, ema20, ema50, ema200, rsiValue, atrValue].every(Number.isFinite)) {
    return { ok: false, message: "اندیکاتورها هنوز پایدار نشده‌اند" };
  }

  const longTrend = ema50 > ema200 && close > ema200;
  const shortTrend = ema50 < ema200 && close < ema200;
  const rsiAbove50 = rsiValue > 50;
  const rsiBelow50 = rsiValue < 50;
  const barsSinceCrossUp = barsSinceCross(closes, e20, "up");
  const barsSinceCrossDown = barsSinceCross(closes, e20, "down");
  const crossUp = barsSinceCrossUp === 0;
  const crossDown = barsSinceCrossDown === 0;

  let signal: "long" | "short" | null = null;
  if (longTrend && crossUp && rsiAbove50) signal = "long";
  else if (shortTrend && crossDown && rsiBelow50) signal = "short";

  return {
    ok: true,
    candleTime: candles[i]!.t,
    close,
    ema20,
    ema50,
    ema200,
    rsi: rsiValue,
    atr: atrValue,
    longTrend,
    shortTrend,
    rsiAbove50,
    rsiBelow50,
    crossUp,
    crossDown,
    barsSinceCrossUp,
    barsSinceCrossDown,
    signal,
    spark: closes.slice(-42),
  };
}

export function chartSeries(candles: Candle[], take = 140): ChartPoint[] {
  if (candles.length === 0) return [];
  const closes = candles.map((c) => c.c);
  const e20 = ema(closes, 20);
  const e50 = ema(closes, 50);
  const e200 = ema(closes, 200);
  const start = Math.max(0, candles.length - take);
  const points: ChartPoint[] = [];
  for (let i = start; i < candles.length; i++) {
    points.push({
      t: candles[i]!.t,
      c: closes[i]!,
      e20: Number.isFinite(e20[i]!) ? e20[i]! : null,
      e50: Number.isFinite(e50[i]!) ? e50[i]! : null,
      e200: Number.isFinite(e200[i]!) ? e200[i]! : null,
    });
  }
  return points;
}

export function tradePlan(
  entry: number,
  atrValue: number,
  side: "long" | "short",
  capital: number,
) {
  const slDist = SL_ATR_MULT * atrValue;
  const tpDist = TP_MULTIPLE * slDist;
  const riskCash = Math.max(0, capital) * RISK_FRACTION;
  const qty = slDist > 0 ? riskCash / slDist : 0;
  const sl = side === "long" ? entry - slDist : entry + slDist;
  const tp = side === "long" ? entry + tpDist : entry - tpDist;
  return {
    slDist,
    tpDist,
    riskCash,
    qty,
    notional: qty * entry,
    sl,
    tp,
    slPct: entry > 0 ? (slDist / entry) * 100 : 0,
    tpPct: entry > 0 ? (tpDist / entry) * 100 : 0,
  };
}
