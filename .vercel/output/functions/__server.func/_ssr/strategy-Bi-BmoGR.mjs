//#region node_modules/.nitro/vite/services/ssr/assets/strategy-Bi-BmoGR.js
/** EMA seeded with an SMA, matching the usual charting-platform definition. */
function ema(values, period) {
	const out = new Array(values.length).fill(NaN);
	if (period < 1 || values.length < period) return out;
	const k = 2 / (period + 1);
	let sum = 0;
	for (let i = 0; i < period; i++) sum += values[i];
	let prev = sum / period;
	out[period - 1] = prev;
	for (let i = period; i < values.length; i++) {
		prev = values[i] * k + prev * (1 - k);
		out[i] = prev;
	}
	return out;
}
/** Wilder RSI. */
function rsi(closes, period = 14) {
	const out = new Array(closes.length).fill(NaN);
	if (closes.length <= period) return out;
	let gain = 0;
	let loss = 0;
	for (let i = 1; i <= period; i++) {
		const d = closes[i] - closes[i - 1];
		if (d >= 0) gain += d;
		else loss -= d;
	}
	let avgG = gain / period;
	let avgL = loss / period;
	const at = (g, l) => l === 0 ? 100 : 100 - 100 / (1 + g / l);
	out[period] = at(avgG, avgL);
	for (let i = period + 1; i < closes.length; i++) {
		const d = closes[i] - closes[i - 1];
		const g = d > 0 ? d : 0;
		const l = d < 0 ? -d : 0;
		avgG = (avgG * (period - 1) + g) / period;
		avgL = (avgL * (period - 1) + l) / period;
		out[i] = at(avgG, avgL);
	}
	return out;
}
/** Wilder ATR. The first bar's true range is high − low. */
function atr(candles, period = 14) {
	const out = new Array(candles.length).fill(NaN);
	if (candles.length < period) return out;
	const trs = [];
	for (let i = 0; i < candles.length; i++) {
		const bar = candles[i];
		if (i === 0) {
			trs.push(bar.h - bar.l);
			continue;
		}
		const prev = candles[i - 1].c;
		trs.push(Math.max(bar.h - bar.l, Math.abs(bar.h - prev), Math.abs(bar.l - prev)));
	}
	let sum = 0;
	for (let i = 0; i < period; i++) sum += trs[i];
	let prev = sum / period;
	out[period - 1] = prev;
	for (let i = period; i < trs.length; i++) {
		prev = (prev * (period - 1) + trs[i]) / period;
		out[i] = prev;
	}
	return out;
}
var RISK_FRACTION = .005;
var SL_ATR_MULT = 1.5;
/**
* Cross is evaluated on closed candles only:
* up = previous close ≤ previous EMA20 and this close > this EMA20.
*/
function barsSinceCross(closes, line, dir) {
	const n = closes.length;
	const start = Math.max(1, n - 30);
	for (let i = n - 1; i >= start; i--) {
		const prevC = closes[i - 1];
		const prevE = line[i - 1];
		const c = closes[i];
		const e = line[i];
		if (![
			prevC,
			prevE,
			c,
			e
		].every(Number.isFinite)) continue;
		const up = prevC <= prevE && c > e;
		const down = prevC >= prevE && c < e;
		if (dir === "up" && up) return n - 1 - i;
		if (dir === "down" && down) return n - 1 - i;
	}
	return null;
}
function evaluate(candles) {
	if (candles.length < 210) return {
		ok: false,
		message: "تاریخچه برای EMA ۲۰۰ کافی نیست"
	};
	const closes = candles.map((c) => c.c);
	const e20 = ema(closes, 20);
	const e50 = ema(closes, 50);
	const e200 = ema(closes, 200);
	const rsiLine = rsi(closes, 14);
	const atrLine = atr(candles, 14);
	const i = closes.length - 1;
	const close = closes[i];
	const ema20 = e20[i];
	const ema50 = e50[i];
	const ema200 = e200[i];
	const rsiValue = rsiLine[i];
	const atrValue = atrLine[i];
	if (![
		close,
		ema20,
		ema50,
		ema200,
		rsiValue,
		atrValue
	].every(Number.isFinite)) return {
		ok: false,
		message: "اندیکاتورها هنوز پایدار نشده‌اند"
	};
	const longTrend = ema50 > ema200 && close > ema200;
	const shortTrend = ema50 < ema200 && close < ema200;
	const rsiAbove50 = rsiValue > 50;
	const rsiBelow50 = rsiValue < 50;
	const barsSinceCrossUp = barsSinceCross(closes, e20, "up");
	const barsSinceCrossDown = barsSinceCross(closes, e20, "down");
	const crossUp = barsSinceCrossUp === 0;
	const crossDown = barsSinceCrossDown === 0;
	let signal = null;
	if (longTrend && crossUp && rsiAbove50) signal = "long";
	else if (shortTrend && crossDown && rsiBelow50) signal = "short";
	return {
		ok: true,
		candleTime: candles[i].t,
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
		spark: closes.slice(-42)
	};
}
function chartSeries(candles, take = 140) {
	if (candles.length === 0) return [];
	const closes = candles.map((c) => c.c);
	const e20 = ema(closes, 20);
	const e50 = ema(closes, 50);
	const e200 = ema(closes, 200);
	const start = Math.max(0, candles.length - take);
	const points = [];
	for (let i = start; i < candles.length; i++) points.push({
		t: candles[i].t,
		c: closes[i],
		e20: Number.isFinite(e20[i]) ? e20[i] : null,
		e50: Number.isFinite(e50[i]) ? e50[i] : null,
		e200: Number.isFinite(e200[i]) ? e200[i] : null
	});
	return points;
}
function tradePlan(entry, atrValue, side, capital) {
	const slDist = SL_ATR_MULT * atrValue;
	const tpDist = 2 * slDist;
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
		slPct: entry > 0 ? slDist / entry * 100 : 0,
		tpPct: entry > 0 ? tpDist / entry * 100 : 0
	};
}
//#endregion
export { evaluate as n, tradePlan as r, chartSeries as t };
