import { i as __toESM } from "../_runtime.mjs";
import { r as tradePlan } from "./strategy-Bi-BmoGR.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Search, i as Shield, o as RefreshCw, r as Target, s as Check, t as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as ReferenceLine, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CgUIzjii.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FA = "۰۱۲۳۴۵۶۷۸۹";
function faDigits(value) {
	return String(value).replace(/\d/g, (d) => FA[Number(d)] ?? d);
}
function formatPrice(n) {
	if (!Number.isFinite(n)) return "—";
	const abs = Math.abs(n);
	const digits = abs >= 1e3 ? 2 : abs >= 100 ? 3 : abs >= 1 ? 4 : abs >= .1 ? 5 : abs >= .01 ? 6 : abs >= 1e-4 ? 8 : 10;
	return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}
function formatQty(n) {
	if (!Number.isFinite(n) || n <= 0) return "—";
	const digits = n >= 1e3 ? 3 : n >= 1 ? 4 : n >= .001 ? 6 : 8;
	return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}
function formatMoney(n) {
	if (!Number.isFinite(n)) return "—";
	const digits = Math.abs(n) >= 100 ? 2 : Math.abs(n) >= 1 ? 2 : 4;
	return n.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: digits
	});
}
function formatPct(n, digits = 2) {
	if (!Number.isFinite(n)) return "—";
	return `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
}
function intervalLabel(interval) {
	if (interval === "1h") return "۱ ساعته";
	if (interval === "4h") return "۴ ساعته";
	return "روزانه";
}
function formatCandle(ts, interval) {
	return `${new Intl.DateTimeFormat("fa-IR", {
		timeZone: "Asia/Tehran",
		month: "short",
		day: "numeric",
		hour: interval === "1d" ? void 0 : "2-digit",
		minute: interval === "1d" ? void 0 : "2-digit"
	}).format(new Date(ts))} · تهران`;
}
function formatClock(ts) {
	return new Intl.DateTimeFormat("fa-IR", {
		timeZone: "Asia/Tehran",
		hour: "2-digit",
		minute: "2-digit"
	}).format(new Date(ts));
}
var NAMES = {
	c: "قیمت پایانی",
	e20: "EMA 20",
	e50: "EMA 50",
	e200: "EMA 200"
};
function PriceChart({ points, entry, sl, tp }) {
	const data = points.map((point) => ({
		...point,
		label: new Intl.DateTimeFormat("fa-IR", {
			timeZone: "Asia/Tehran",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		}).format(new Date(point.t))
	}));
	const levels = data.flatMap((point) => [
		point.c,
		point.e20,
		point.e50,
		point.e200
	].filter((value) => value != null));
	if (entry != null) levels.push(entry);
	if (sl != null) levels.push(sl);
	if (tp != null) levels.push(tp);
	const min = Math.min(...levels);
	const max = Math.max(...levels);
	const pad = (max - min) * .08 || Math.abs(max) * .01;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64 w-full min-w-0",
		dir: "ltr",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
				data,
				margin: {
					top: 12,
					right: 4,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						domain: [min - pad, max + pad],
						orientation: "right",
						width: 72,
						tickFormatter: (value) => formatPrice(value),
						tick: {
							fill: "var(--color-muted)",
							fontSize: 11
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						formatter: (value, name) => {
							return [formatPrice(typeof value === "number" ? value : Number(value)), NAMES[String(name)] ?? String(name)];
						},
						labelStyle: { color: "var(--color-muted)" },
						contentStyle: {
							background: "var(--color-bg)",
							border: "1px solid var(--color-line)",
							borderRadius: 8,
							fontSize: 12
						},
						itemStyle: { color: "var(--color-fg)" }
					}),
					entry != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: entry,
						stroke: "var(--color-brass)",
						strokeDasharray: "2 4"
					}) : null,
					tp != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: tp,
						stroke: "var(--color-long)",
						strokeDasharray: "4 4"
					}) : null,
					sl != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: sl,
						stroke: "var(--color-short)",
						strokeDasharray: "4 4"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "e200",
						stroke: "var(--color-muted)",
						dot: false,
						strokeWidth: 1.25,
						strokeDasharray: "3 3",
						isAnimationActive: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "e50",
						stroke: "var(--color-long)",
						dot: false,
						strokeWidth: 1.4,
						isAnimationActive: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "e20",
						stroke: "var(--color-brass)",
						dot: false,
						strokeWidth: 1.4,
						isAnimationActive: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "c",
						stroke: "var(--color-fg)",
						dot: false,
						strokeWidth: 1.8,
						isAnimationActive: false
					})
				]
			})
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function asInterval(value) {
	if (value === "1h" || value === "4h" || value === "1d") return value;
	throw new Error("بازهٔ زمانی نامعتبر است");
}
var fetchUniverse = createServerFn({ method: "GET" }).handler(createSsrRpc("53fb8d57274d3c2d88f0307ab58568e9169007938d1eb1d1f88072043457404f"));
var scanPairs = createServerFn({ method: "POST" }).validator((data) => {
	const interval = asInterval(data?.interval);
	if (!Array.isArray(data?.pairs) || data.pairs.length === 0 || data.pairs.length > 20) throw new Error("دستهٔ نمادها نامعتبر است");
	const pairs = [];
	for (const pair of data.pairs) {
		if (typeof pair !== "string" || !/^[A-Z0-9]{2,24}USDT$/.test(pair)) throw new Error("نماد نامعتبر است");
		pairs.push(pair);
	}
	return {
		interval,
		pairs,
		fresh: Boolean(data.fresh)
	};
}).handler(createSsrRpc("a4676c47a751cbff9608ce281e08c74269dda6fabbe8e7885034e2bbdd7f8b56"));
var fetchChart = createServerFn({ method: "POST" }).validator((data) => {
	const interval = asInterval(data?.interval);
	if (typeof data?.pair !== "string" || !/^[A-Z0-9]{2,24}USDT$/.test(data.pair)) throw new Error("نماد نامعتبر است");
	return {
		pair: data.pair,
		interval
	};
}).handler(createSsrRpc("dffd19e0021cbfb10f87cfc3f1656d7725f77caec5fb79f89dd9818e756d4dda"));
function Item({ ok, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-start gap-2 text-sm leading-6",
		children: [ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "mt-1 size-4 shrink-0 text-long",
			"aria-hidden": true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
			className: "mt-1 size-4 shrink-0 text-short",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: ok ? "text-fg" : "text-muted",
			children: text
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-line bg-bg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-1 text-sm",
			children: value
		})]
	});
}
function CoinPanel({ row, capital, onClose }) {
	const [points, setPoints] = (0, import_react.useState)(null);
	const [chartError, setChartError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!row) return;
		let cancelled = false;
		setPoints(null);
		setChartError(null);
		fetchChart({ data: {
			pair: row.pair,
			interval: row.interval
		} }).then((next) => {
			if (!cancelled) setPoints(next);
		}).catch(() => {
			if (!cancelled) setChartError("نمودار بارگذاری نشد");
		});
		return () => {
			cancelled = true;
		};
	}, [row]);
	const plan = row?.signal ? tradePlan(row.close, row.atr, row.signal, capital) : null;
	const drift = row && row.close > 0 ? (row.mark - row.close) / row.close * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: row != null,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-bg/75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "fixed inset-y-0 start-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-e border-line bg-surface outline-none",
			children: row ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5 p-4 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "text-xl font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num",
									children: row.coin.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ms-2 text-base font-medium text-muted",
									children: intervalLabel(row.interval)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
								className: "mt-1 text-sm text-muted",
								dir: "ltr",
								children: [
									row.coin.name,
									" · ",
									row.pair
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: formatCandle(row.candleTime, row.interval)
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
							className: "grid size-11 place-items-center rounded-md border border-line text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "بستن"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [points && points.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
						points,
						entry: plan ? row.close : void 0,
						sl: plan?.sl,
						tp: plan?.tp
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-64 place-items-center rounded-md border border-line bg-bg text-sm text-muted",
						children: chartError ?? "در حال چیدن نمودار…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "قیمت" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-brass",
								children: "EMA ۲۰"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-long",
								children: "EMA ۵۰"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "EMA ۲۰۰" })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "پایان کندل",
								value: formatPrice(row.close)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "RSI ۱۴",
								value: row.rsi.toFixed(1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "EMA ۲۰",
								value: formatPrice(row.ema20)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "ATR ۱۴",
								value: formatPrice(row.atr)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "EMA ۵۰",
								value: formatPrice(row.ema50)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "EMA ۲۰۰",
								value: formatPrice(row.ema200)
							})
						]
					}),
					Math.abs(drift) >= .1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"قیمت لحظه‌ای کندل باز",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num text-fg",
								children: formatPrice(row.mark)
							}),
							" ",
							"(",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num",
								children: formatPct(drift)
							}),
							" نسبت به پایان کندل). ورود استراتژی همچنان روی پایان کندل است."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-semibold text-long",
						children: "شرط‌های خرید"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								ok: row.longTrend,
								text: "EMA ۵۰ بالای EMA ۲۰۰ و قیمت بالای EMA ۲۰۰"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								ok: row.crossUp,
								text: "عبور پایان کندل از زیر EMA ۲۰ به بالای آن"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								ok: row.rsiAbove50,
								text: "RSI ۱۴ بالاتر از ۵۰"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-semibold text-short",
						children: "شرط‌های فروش"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								ok: row.shortTrend,
								text: "EMA ۵۰ زیر EMA ۲۰۰ و قیمت زیر EMA ۲۰۰"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								ok: row.crossDown,
								text: "عبور پایان کندل از بالای EMA ۲۰ به زیر آن"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								ok: row.rsiBelow50,
								text: "RSI ۱۴ پایین‌تر از ۵۰"
							})
						]
					})] }),
					plan && row.signal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-brass/40 bg-brass/10 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold",
								children: row.signal === "long" ? "برنامهٔ خرید" : "برنامهٔ فروش استقراضی"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "یک ورود. بدون افزایش پله‌ای و بدون مارتینگل."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 grid grid-cols-2 gap-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "ورود"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "num",
										children: formatPrice(row.close)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "حجم"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "num",
										children: formatQty(plan.qty)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-short",
										children: "حد ضرر"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "num",
										children: [formatPrice(plan.sl), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted",
											children: [
												" · ",
												plan.slPct.toFixed(2),
												"%"
											]
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-long",
										children: "حد سود"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "num",
										children: [formatPrice(plan.tp), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted",
											children: [
												" · ",
												plan.tpPct.toFixed(2),
												"%"
											]
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "ریسک ۰٫۵٪"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "num",
										children: [formatMoney(plan.riskCash), " USDT"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "ارزش ورود"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "num",
										children: formatMoney(plan.notional)
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs leading-5 text-muted",
								children: "حجم = (سرمایه × ۰٫۰۰۵) ÷ (۱٫۵ × ATR). حد سود دو برابر همین فاصله است. گرد کردن حجم در صرافی ریسک را کمی جابه‌جا می‌کند."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-line bg-bg px-3 py-3 text-sm text-muted",
						children: "معامله‌ای صادر نشده. هر سه شرط باید روی همین کندل بسته‌شده با هم برقرار باشند."
					})
				]
			}) : null
		})] })
	});
}
function Rule({ n, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-2 text-sm leading-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "num mt-0.5 grid size-5 shrink-0 place-items-center rounded-sm bg-brass/15 text-xs text-brass",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text })]
	});
}
function RulesCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex flex-col gap-4 rounded-md border border-line bg-surface p-4 lg:sticky lg:top-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-brass",
					children: "قواعد قطعی"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-lg font-semibold",
					children: "استراتژی روند"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "فقط کندل بسته‌شده ملاک است. کندل در حال تشکیل وارد سیگنال نمی‌شود."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-sm font-semibold text-long",
				children: "خرید"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						n: "۱",
						text: "EMA ۵۰ بالاتر از EMA ۲۰۰ باشد و قیمت بالاتر از EMA ۲۰۰ بماند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						n: "۲",
						text: "قیمت پایانی از زیر EMA ۲۰ به بالای آن عبور کند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						n: "۳",
						text: "RSI با دورهٔ ۱۴ بالاتر از ۵۰ باشد."
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-sm font-semibold text-short",
				children: "فروش استقراضی"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						n: "۱",
						text: "EMA ۵۰ پایین‌تر از EMA ۲۰۰ باشد و قیمت پایین‌تر از EMA ۲۰۰ بماند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						n: "۲",
						text: "قیمت پایانی از بالای EMA ۲۰ به زیر آن عبور کند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						n: "۳",
						text: "RSI با دورهٔ ۱۴ پایین‌تر از ۵۰ باشد."
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 border-t border-line pt-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
							className: "mt-0.5 size-4 shrink-0 text-brass",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حد ضرر: ۱٫۵ برابر ATR دورهٔ ۱۴." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
							className: "mt-0.5 size-4 shrink-0 text-brass",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حد سود: ۲ برابر فاصلهٔ حد ضرر. نسبت پاداش به ریسک ۲ به ۱." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: "ریسک هر معامله ۰٫۵٪ سرمایه است. حجم یک‌بار محاسبه می‌شود؛ افزایش پله‌ای و مارتینگل در این استراتژی جایی ندارد."
					})
				]
			})
		]
	});
}
var INTERVALS = [
	"1h",
	"4h",
	"1d"
];
var TF_OPTIONS = [
	{
		id: "all",
		label: "هر سه"
	},
	{
		id: "1h",
		label: "۱ ساعته"
	},
	{
		id: "4h",
		label: "۴ ساعته"
	},
	{
		id: "1d",
		label: "روزانه"
	}
];
var ORDER = {
	"1h": 0,
	"4h": 1,
	"1d": 2
};
function cn(...parts) {
	return parts.filter(Boolean).join(" ");
}
function join(results, coins) {
	const byPair = new Map(coins.filter((coin) => coin.pair).map((coin) => [coin.pair, coin]));
	const rows = [];
	const errors = [];
	for (const result of results) {
		if (!result.ok) {
			errors.push(result);
			continue;
		}
		const coin = byPair.get(result.pair);
		if (!coin) continue;
		rows.push({
			...result,
			coin
		});
	}
	return {
		rows,
		errors
	};
}
function aligned(row) {
	return !row.signal && (row.longTrend && row.rsiAbove50 || row.shortTrend && row.rsiBelow50);
}
function Spark({ values, tone }) {
	if (values.length < 2) return null;
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const w = 72;
	const h = 28;
	const d = values.map((value, index) => {
		const x = index / (values.length - 1) * w;
		const y = h - (value - min) / span * 26 - 1;
		return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: cn("h-7 w-16", tone === "long" ? "text-long" : tone === "short" ? "text-short" : "text-muted"),
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6"
		})
	});
}
function Mark({ coin }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	if (coin.image && !failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: coin.image,
		alt: "",
		className: "size-8 rounded-full bg-fg/10 object-cover",
		onError: () => setFailed(true)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid size-8 place-items-center rounded-full bg-fg/10 text-xs font-semibold",
		children: coin.symbol.slice(0, 1)
	});
}
function Badge({ row }) {
	if (row.signal === "long") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-sm bg-long/15 px-2 py-1 text-xs font-semibold text-long",
		children: "خرید"
	});
	if (row.signal === "short") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-sm bg-short/15 px-2 py-1 text-xs font-semibold text-short",
		children: "فروش"
	});
	if (aligned(row)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-sm bg-brass/15 px-2 py-1 text-xs text-brass",
		children: "هم‌راستا"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-sm bg-fg/5 px-2 py-1 text-xs text-muted",
		children: "بدون سیگنال"
	});
}
function crossText(row) {
	const up = row.barsSinceCrossUp;
	const down = row.barsSinceCrossDown;
	if (row.longTrend && up === 0) return "عبور به بالا، همین کندل";
	if (row.shortTrend && down === 0) return "عبور به پایین، همین کندل";
	if (row.longTrend && up != null) return `آخرین عبور به بالا، ${faDigits(up)} کندل قبل`;
	if (row.shortTrend && down != null) return `آخرین عبور به پایین، ${faDigits(down)} کندل قبل`;
	if (up != null) return `عبور به بالا، ${faDigits(up)} کندل قبل`;
	if (down != null) return `عبور به پایین، ${faDigits(down)} کندل قبل`;
	return "عبور تازه‌ای در ۳۰ کندل اخیر نیست";
}
function Scanner() {
	const [universe, setUniverse] = (0, import_react.useState)(null);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [phase, setPhase] = (0, import_react.useState)("loading");
	const [error, setError] = (0, import_react.useState)(null);
	const [progress, setProgress] = (0, import_react.useState)(null);
	const [failCount, setFailCount] = (0, import_react.useState)(0);
	const [scannedAt, setScannedAt] = (0, import_react.useState)(null);
	const [tf, setTf] = (0, import_react.useState)("all");
	const [view, setView] = (0, import_react.useState)("signals");
	const [query, setQuery] = (0, import_react.useState)("");
	const [capitalText, setCapitalText] = (0, import_react.useState)("10000");
	const [capital, setCapital] = (0, import_react.useState)(1e4);
	const [active, setActive] = (0, import_react.useState)(null);
	const [runId, setRunId] = (0, import_react.useState)(0);
	const request = (0, import_react.useRef)({
		fresh: false,
		intervals: [...INTERVALS]
	});
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("ravand-capital");
		if (!saved) return;
		const value = Number(saved);
		if (value > 0) {
			setCapital(value);
			setCapitalText(String(value));
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const ac = new AbortController();
		const { fresh, intervals } = request.current;
		(async () => {
			setPhase("loading");
			setError(null);
			setFailCount(0);
			if (fresh) setRows((prev) => prev.filter((row) => !intervals.includes(row.interval)));
			try {
				const coins = await fetchUniverse();
				if (ac.signal.aborted) return;
				setUniverse(coins);
				const tradable = coins.filter((coin) => coin.pair);
				const total = tradable.length * intervals.length;
				let done = 0;
				setProgress({
					label: intervalLabel(intervals[0] ?? "1h"),
					done,
					total
				});
				for (const interval of intervals) for (let index = 0; index < tradable.length; index += 16) {
					if (ac.signal.aborted) return;
					const chunk = tradable.slice(index, index + 16);
					setProgress({
						label: intervalLabel(interval),
						done,
						total
					});
					const part = await scanPairs({ data: {
						interval,
						pairs: chunk.map((coin) => coin.pair),
						fresh
					} });
					if (ac.signal.aborted) return;
					const joined = join(part, coins);
					setRows((prev) => {
						const next = new Map(prev.map((row) => [`${row.pair}:${row.interval}`, row]));
						for (const row of joined.rows) next.set(`${row.pair}:${row.interval}`, row);
						return [...next.values()];
					});
					if (joined.errors.length) setFailCount((count) => count + joined.errors.length);
					done += chunk.length;
					setProgress({
						label: intervalLabel(interval),
						done,
						total
					});
				}
				if (ac.signal.aborted) return;
				setScannedAt(Date.now());
				setPhase("done");
				setProgress(null);
			} catch (caught) {
				if (ac.signal.aborted) return;
				setPhase("error");
				setProgress(null);
				setError(caught instanceof Error ? caught.message : "اسکن ناتمام ماند");
			}
		})();
		return () => ac.abort();
	}, [runId]);
	const scoped = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return rows.filter((row) => {
			if (tf !== "all" && row.interval !== tf) return false;
			if (!q) return true;
			return row.coin.symbol.toLowerCase().includes(q) || row.coin.name.toLowerCase().includes(q) || row.pair.toLowerCase().includes(q);
		});
	}, [
		rows,
		tf,
		query
	]);
	const counts = {
		long: scoped.filter((row) => row.signal === "long").length,
		short: scoped.filter((row) => row.signal === "short").length,
		aligned: scoped.filter(aligned).length,
		all: scoped.length
	};
	const visible = scoped.filter((row) => {
		if (view === "signals") return row.signal != null;
		if (view === "aligned") return aligned(row);
		return true;
	}).sort((a, b) => {
		if (view === "signals" && a.signal !== b.signal) {
			if (a.signal === "long") return -1;
			if (b.signal === "long") return 1;
		}
		if (a.coin.rank !== b.coin.rank) return a.coin.rank - b.coin.rank;
		return ORDER[a.interval] - ORDER[b.interval];
	});
	const skipped = (universe ?? []).filter((coin) => coin.stable || !coin.pair);
	const tradableCount = (universe ?? []).filter((coin) => coin.pair).length;
	const riskCash = capital * .005;
	const pct = progress && progress.total > 0 ? Math.round(progress.done / progress.total * 100) : 0;
	function refresh() {
		request.current = {
			fresh: true,
			intervals: tf === "all" ? [...INTERVALS] : [tf]
		};
		setRunId((value) => value + 1);
	}
	function onCapital(value) {
		setCapitalText(value);
		const amount = Number(value.replace(/,/g, ""));
		if (amount > 0 && Number.isFinite(amount)) {
			setCapital(amount);
			localStorage.setItem("ravand-capital", String(amount));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 bg-brass" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 32 32",
							className: "size-11 shrink-0",
							"aria-hidden": true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									width: "32",
									height: "32",
									rx: "7",
									fill: "var(--color-surface)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M5 22.5c3.2-.6 5.4-7.2 9.2-7.2 3.2 0 4.2 5.2 7.6 4.4 2.2-.5 3.4-4.2 5.2-4.7",
									fill: "none",
									stroke: "var(--color-brass)",
									strokeWidth: "2",
									strokeLinecap: "round"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M5 16.5c4.2 1.6 6.2-2.4 10.2-3.2 3.6-.7 5.6 2.2 11.8.8",
									fill: "none",
									stroke: "var(--color-long)",
									strokeWidth: "1.7",
									strokeLinecap: "round"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-brass",
								children: "RAVAND"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-semibold leading-tight",
								children: "رَوَند"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "اسکن استراتژی روند روی ۱۰۰ ارز برتر · اسپات تتر"
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "سرمایه"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: "decimal",
									value: capitalText,
									onChange: (event) => onCapital(event.target.value),
									className: "num h-11 w-36 rounded-md border border-line bg-surface px-3 text-sm",
									"aria-label": "سرمایه به تتر"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "USDT"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"ریسک ثابت هر معامله ۰٫۵٪ = ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-fg",
									children: formatMoney(riskCash)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2 text-line",
									children: "|"
								}),
								"ورود یک‌باره، بدون پله و بدون مارتینگل"
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesCard, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex min-w-0 flex-col gap-4 lg:col-span-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [TF_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": tf === option.id,
											onClick: () => setTf(option.id),
											className: cn("h-11 rounded-md border px-3 text-sm", tf === option.id ? "border-brass bg-brass/15 text-brass" : "border-line bg-surface text-muted"),
											children: option.label
										}, option.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: refresh,
											className: "ms-auto inline-flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", phase === "loading" && "animate-spin motion-reduce:animate-none") }), "اسکن دوباره"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: query,
											onChange: (event) => setQuery(event.target.value),
											placeholder: "جست‌وجوی نماد یا نام",
											className: "h-11 w-full rounded-md border border-line bg-surface ps-10 pe-3 text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"aria-pressed": view === "signals",
												onClick: () => setView("signals"),
												className: cn("rounded-md border px-2 py-2 text-start", view === "signals" ? "border-brass bg-brass/10" : "border-line bg-surface"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block text-xs text-muted",
														children: "سیگنال"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "num text-lg",
														children: faDigits(counts.long + counts.short)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "mt-1 block text-xs",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-long",
																children: [faDigits(counts.long), " خرید"]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted",
																children: " · "
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-short",
																children: [faDigits(counts.short), " فروش"]
															})
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"aria-pressed": view === "aligned",
												onClick: () => setView("aligned"),
												className: cn("rounded-md border px-2 py-2 text-start", view === "aligned" ? "border-brass bg-brass/10" : "border-line bg-surface"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block text-xs text-muted",
														children: "هم‌راستا، بدون عبور"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "num text-lg",
														children: faDigits(counts.aligned)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-1 block text-xs text-muted",
														children: "ورود نیست"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"aria-pressed": view === "all",
												onClick: () => setView("all"),
												className: cn("rounded-md border px-2 py-2 text-start", view === "all" ? "border-brass bg-brass/10" : "border-line bg-surface"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block text-xs text-muted",
														children: "خوانده‌شده"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "num text-lg",
														children: faDigits(counts.all)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-1 block text-xs text-muted",
														children: universe ? `${faDigits(tradableCount)} جفت از ۱۰۰` : "در حال آماده‌سازی"
													})
												]
											})
										]
									}),
									progress ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										"aria-live": "polite",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-1 flex justify-between text-xs text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"در حال خواندن ",
												progress.label,
												" · ",
												faDigits(progress.done),
												" از ",
												faDigits(progress.total)
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "num",
												children: [pct, "%"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1 overflow-hidden rounded-sm bg-fg/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-brass",
												style: { width: `${pct}%` }
											})
										})]
									}) : null,
									error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-md border border-short/40 bg-short/10 px-3 py-2 text-sm text-short",
										children: error
									}) : null,
									phase === "done" && failCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [faDigits(failCount), " جفت کندل برنگرداند و از این دور کنار گذاشته شد."]
									}) : null,
									scannedAt && phase === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [
											"آخرین به‌روزرسانی ",
											formatClock(scannedAt),
											" به وقت تهران"
										]
									}) : null
								]
							}),
							visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-md border border-line bg-surface px-4 py-8 text-sm leading-7 text-muted",
								children: phase === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "کندل‌ها در حال خوانده‌شدن هستند. سیگنال فقط وقتی می‌آید که هر سه شرط روی کندل بسته‌شدهٔ آخر با هم درست باشند." }) : view === "signals" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "در این دور، عبور تازه از EMA ۲۰ همراه با فیلتر روند و RSI دیده نشد. ارزهایی که روند و RSI هم‌راستا هستند ولی هنوز عبور نکرده‌اند در زبانهٔ «هم‌راستا» قرار دارند و ورود حساب نمی‌شوند." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "موردی با این فیلتر پیدا نشد." })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-2 md:hidden",
								children: visible.map((row) => {
									const plan = row.signal ? tradePlan(row.close, row.atr, row.signal, capital) : null;
									const dist = (row.close - row.ema20) / row.ema20 * 100;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setActive(row),
										className: "w-full rounded-md border border-line bg-surface p-3 text-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { coin: row.coin }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "num font-semibold",
															children: row.coin.symbol
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-muted",
															children: intervalLabel(row.interval)
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "truncate text-xs text-muted",
														dir: "ltr",
														children: row.coin.name
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { row })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
											className: "mt-3 grid grid-cols-2 gap-2 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-muted",
													children: "پایان کندل"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "num text-sm",
													children: formatPrice(row.close)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-muted",
													children: "RSI"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "num text-sm",
													children: row.rsi.toFixed(1)
												})] }),
												plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
														className: "text-muted",
														children: "حد ضرر"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
														className: "num text-sm text-short",
														children: formatPrice(plan.sl)
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
														className: "text-muted",
														children: "حد سود"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
														className: "num text-sm text-long",
														children: formatPrice(plan.tp)
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-span-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
															className: "text-muted",
															children: "حجم برای ریسک ۰٫۵٪"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
															className: "num text-sm",
															children: formatQty(plan.qty)
														})]
													})
												] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
														className: "text-muted",
														children: "فاصله تا EMA ۲۰"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
														className: "num text-sm",
														children: formatPct(dist)
													})]
												})
											]
										})]
									}) }, `${row.pair}-${row.interval}`);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden overflow-x-auto rounded-md border border-line md:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full border-collapse text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-surface text-xs text-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-3 text-start font-medium",
												children: "ارز"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-3 text-start font-medium",
												children: "تایم"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-3 text-start font-medium",
												children: "وضعیت"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-3 text-start font-medium",
												children: "پایان کندل"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-3 text-start font-medium",
												children: "RSI"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-3 text-start font-medium",
												children: view === "signals" ? "حد ضرر / حد سود" : "تا EMA ۲۰"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-3 text-start font-medium",
												children: "حجم"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visible.map((row) => {
										const plan = row.signal ? tradePlan(row.close, row.atr, row.signal, capital) : null;
										const dist = (row.close - row.ema20) / row.ema20 * 100;
										const tone = row.signal === "long" || row.longTrend && !row.shortTrend ? "long" : row.signal === "short" || row.shortTrend ? "short" : "muted";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											tabIndex: 0,
											role: "button",
											onClick: () => setActive(row),
											onKeyDown: (event) => {
												if (event.key === "Enter" || event.key === " ") {
													event.preventDefault();
													setActive(row);
												}
											},
											className: "border-t border-line bg-bg hover:bg-surface",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-3",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { coin: row.coin }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center gap-2",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "num font-semibold",
																	children: row.coin.symbol
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: cn("num text-xs", row.coin.change24h >= 0 ? "text-long" : "text-short"),
																	children: formatPct(row.coin.change24h)
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-xs text-muted",
																children: [
																	"رتبه ",
																	faDigits(row.coin.rank),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		dir: "ltr",
																		className: "ms-2",
																		children: row.coin.name
																	})
																]
															})] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spark, {
																values: row.spark,
																tone
															})
														]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-3 whitespace-nowrap",
													children: intervalLabel(row.interval)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-3 py-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { row }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 max-w-40 text-xs text-muted",
														children: crossText(row)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "num px-3 py-3 whitespace-nowrap",
													children: formatPrice(row.close)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "num px-3 py-3",
													children: row.rsi.toFixed(1)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-3 whitespace-nowrap",
													children: plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "num",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-short",
																children: formatPrice(plan.sl)
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted",
																children: " / "
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-long",
																children: formatPrice(plan.tp)
															})
														]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "num",
														children: formatPct(dist)
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "num px-3 py-3 whitespace-nowrap",
													children: plan ? formatQty(plan.qty) : "—"
												})
											]
										}, `${row.pair}-${row.interval}`);
									}) })]
								})
							})] }),
							universe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "rounded-md border border-line bg-surface px-3 py-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
										className: "flex h-11 items-center text-muted",
										children: [
											"خارج از اسکن: ",
											faDigits(skipped.length),
											" ارز از ۱۰۰"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "flex flex-col gap-1 pb-2 text-xs text-muted",
										children: skipped.map((coin) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "num text-fg",
												children: coin.symbol
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ms-2",
												dir: "ltr",
												children: coin.name
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: coin.stable ? "استیبل" : "جفت تتر در بایننس نیست" })]
										}, coin.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "pb-2 text-xs leading-5 text-muted",
										children: "استیبل‌ها و توکن‌های بدون بازار اسپات تتر در بایننس وارد محاسبه نمی‌شوند. دادهٔ کندل از بازار اسپات بایننس است و رتبه از ارزش بازار."
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-5 text-muted",
								children: "این صفحه برنامهٔ عددی همان استراتژی است، نه توصیهٔ خرید یا فروش. ورود روی قیمت پایانی کندل بسته‌شده محاسبه می‌شود."
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinPanel, {
				row: active,
				capital,
				onClose: () => setActive(null)
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scanner, {});
}
//#endregion
export { Home as component };
