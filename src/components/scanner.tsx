import { RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CoinPanel, type LiveRow } from "@/components/coin-panel";
import { RulesCard } from "@/components/rules-card";
import { fetchUniverse, scanPairs } from "@/lib/scan.functions";
import {
  faDigits,
  formatClock,
  formatMoney,
  formatPct,
  formatPrice,
  formatQty,
  intervalLabel,
} from "@/lib/format";
import { tradePlan } from "@/lib/strategy";
import { INTERVALS, type Interval, type ScanErr, type ScanResult, type UniverseCoin } from "@/lib/types";

type Tf = Interval | "all";
type View = "signals" | "aligned" | "all";

const TF_OPTIONS: { id: Tf; label: string }[] = [
  { id: "all", label: "هر سه" },
  { id: "1h", label: "۱ ساعته" },
  { id: "4h", label: "۴ ساعته" },
  { id: "1d", label: "روزانه" },
];

const ORDER: Record<Interval, number> = { "1h": 0, "4h": 1, "1d": 2 };

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function join(results: ScanResult[], coins: UniverseCoin[]) {
  const byPair = new Map(coins.filter((coin) => coin.pair).map((coin) => [coin.pair as string, coin]));
  const rows: LiveRow[] = [];
  const errors: ScanErr[] = [];
  for (const result of results) {
    if (!result.ok) {
      errors.push(result);
      continue;
    }
    const coin = byPair.get(result.pair);
    if (!coin) continue;
    rows.push({ ...result, coin });
  }
  return { rows, errors };
}

function aligned(row: LiveRow) {
  return !row.signal && ((row.longTrend && row.rsiAbove50) || (row.shortTrend && row.rsiBelow50));
}

function Spark({ values, tone }: { values: number[]; tone: "long" | "short" | "muted" }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 72;
  const h = 28;
  const d = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * w;
      const y = h - ((value - min) / span) * (h - 2) - 1;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const color = tone === "long" ? "text-long" : tone === "short" ? "text-short" : "text-muted";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("h-7 w-16", color)} aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Mark({ coin }: { coin: UniverseCoin }) {
  const [failed, setFailed] = useState(false);
  if (coin.image && !failed) {
    return (
      <img
        src={coin.image}
        alt=""
        className="size-8 rounded-full bg-fg/10 object-cover"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span className="grid size-8 place-items-center rounded-full bg-fg/10 text-xs font-semibold">
      {coin.symbol.slice(0, 1)}
    </span>
  );
}

function Badge({ row }: { row: LiveRow }) {
  if (row.signal === "long") {
    return <span className="rounded-sm bg-long/15 px-2 py-1 text-xs font-semibold text-long">خرید</span>;
  }
  if (row.signal === "short") {
    return <span className="rounded-sm bg-short/15 px-2 py-1 text-xs font-semibold text-short">فروش</span>;
  }
  if (aligned(row)) {
    return <span className="rounded-sm bg-brass/15 px-2 py-1 text-xs text-brass">هم‌راستا</span>;
  }
  return <span className="rounded-sm bg-fg/5 px-2 py-1 text-xs text-muted">بدون سیگنال</span>;
}

function crossText(row: LiveRow) {
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

export function Scanner() {
  const [universe, setUniverse] = useState<UniverseCoin[] | null>(null);
  const [rows, setRows] = useState<LiveRow[]>([]);
  const [phase, setPhase] = useState<"loading" | "done" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ label: string; done: number; total: number } | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [scannedAt, setScannedAt] = useState<number | null>(null);
  const [tf, setTf] = useState<Tf>("all");
  const [view, setView] = useState<View>("signals");
  const [query, setQuery] = useState("");
  const [capitalText, setCapitalText] = useState("10000");
  const [capital, setCapital] = useState(10000);
  const [active, setActive] = useState<LiveRow | null>(null);
  const [runId, setRunId] = useState(0);
  const request = useRef<{ fresh: boolean; intervals: Interval[] }>({
    fresh: false,
    intervals: [...INTERVALS],
  });

  useEffect(() => {
    const saved = localStorage.getItem("ravand-capital");
    if (!saved) return;
    const value = Number(saved);
    if (value > 0) {
      setCapital(value);
      setCapitalText(String(value));
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    const { fresh, intervals } = request.current;

    void (async () => {
      setPhase("loading");
      setError(null);
      setFailCount(0);
      if (fresh) {
        setRows((prev) => prev.filter((row) => !intervals.includes(row.interval)));
      }
      try {
        const coins = await fetchUniverse();
        if (ac.signal.aborted) return;
        setUniverse(coins);
        const tradable = coins.filter((coin) => coin.pair);
        const total = tradable.length * intervals.length;
        let done = 0;
        setProgress({ label: intervalLabel(intervals[0] ?? "1h"), done, total });
        for (const interval of intervals) {
          for (let index = 0; index < tradable.length; index += 16) {
            if (ac.signal.aborted) return;
            const chunk = tradable.slice(index, index + 16);
            setProgress({ label: intervalLabel(interval), done, total });
            const part = await scanPairs({
              data: {
                interval,
                pairs: chunk.map((coin) => coin.pair as string),
                fresh,
              },
            });
            if (ac.signal.aborted) return;
            const joined = join(part, coins);
            setRows((prev) => {
              const next = new Map(prev.map((row) => [`${row.pair}:${row.interval}`, row]));
              for (const row of joined.rows) next.set(`${row.pair}:${row.interval}`, row);
              return [...next.values()];
            });
            if (joined.errors.length) setFailCount((count) => count + joined.errors.length);
            done += chunk.length;
            setProgress({ label: intervalLabel(interval), done, total });
          }
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

  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (tf !== "all" && row.interval !== tf) return false;
      if (!q) return true;
      return (
        row.coin.symbol.toLowerCase().includes(q) ||
        row.coin.name.toLowerCase().includes(q) ||
        row.pair.toLowerCase().includes(q)
      );
    });
  }, [rows, tf, query]);

  const counts = {
    long: scoped.filter((row) => row.signal === "long").length,
    short: scoped.filter((row) => row.signal === "short").length,
    aligned: scoped.filter(aligned).length,
    all: scoped.length,
  };
  const pairCount = new Set(scoped.map((row) => row.pair)).size;

  const visible = scoped
    .filter((row) => {
      if (view === "signals") return row.signal != null;
      if (view === "aligned") return aligned(row);
      return true;
    })
    .sort((a, b) => {
      if (view === "signals" && a.signal !== b.signal) {
        if (a.signal === "long") return -1;
        if (b.signal === "long") return 1;
      }
      if (a.coin.rank !== b.coin.rank) return a.coin.rank - b.coin.rank;
      return ORDER[a.interval] - ORDER[b.interval];
    });

  const skipped = (universe ?? []).filter((coin) => coin.stable || !coin.pair);
  const tradableCount = (universe ?? []).filter((coin) => coin.pair).length;
  const riskCash = capital * 0.005;
  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  function refresh() {
    request.current = {
      fresh: true,
      intervals: tf === "all" ? [...INTERVALS] : [tf],
    };
    setRunId((value) => value + 1);
  }

  function onCapital(value: string) {
    setCapitalText(value);
    const amount = Number(value.replace(/,/g, ""));
    if (amount > 0 && Number.isFinite(amount)) {
      setCapital(amount);
      localStorage.setItem("ravand-capital", String(amount));
    }
  }

  return (
    <div className="min-h-screen">
      <div className="h-1 bg-brass" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5">
        <header className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" className="size-11 shrink-0" aria-hidden>
              <rect width="32" height="32" rx="7" fill="var(--color-surface)" />
              <path
                d="M5 22.5c3.2-.6 5.4-7.2 9.2-7.2 3.2 0 4.2 5.2 7.6 4.4 2.2-.5 3.4-4.2 5.2-4.7"
                fill="none"
                stroke="var(--color-brass)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 16.5c4.2 1.6 6.2-2.4 10.2-3.2 3.6-.7 5.6 2.2 11.8.8"
                fill="none"
                stroke="var(--color-long)"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p className="text-xs tracking-widest text-brass">RAVAND</p>
              <h1 className="text-2xl font-semibold leading-tight">رَوَند</h1>
              <p className="text-sm text-muted">اسکن استراتژی روند روی ۱۰۰ ارز برتر · اسپات تتر</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">سرمایه</span>
              <input
                inputMode="decimal"
                value={capitalText}
                onChange={(event) => onCapital(event.target.value)}
                className="num h-11 w-36 rounded-md border border-line bg-surface px-3 text-sm"
                aria-label="سرمایه به تتر"
              />
              <span className="text-muted">USDT</span>
            </label>
            <p className="text-xs text-muted">
              ریسک ثابت هر معامله ۰٫۵٪ = <span className="num text-fg">{formatMoney(riskCash)}</span>
              <span className="mx-2 text-line">|</span>
              ورود یک‌باره، بدون پله و بدون مارتینگل
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          <RulesCard />

          <section className="order-1 flex min-w-0 flex-col gap-4 lg:order-2 lg:col-span-3">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {TF_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={tf === option.id}
                    onClick={() => setTf(option.id)}
                    className={cn(
                      "h-11 rounded-md border px-3 text-sm",
                      tf === option.id ? "border-brass bg-brass/15 text-brass" : "border-line bg-surface text-muted",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={refresh}
                  className="ms-auto inline-flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm"
                >
                  <RefreshCw
                    className={cn("size-4", phase === "loading" && "animate-spin motion-reduce:animate-none")}
                  />
                  اسکن دوباره
                </button>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="جست‌وجوی نماد یا نام"
                  className="h-11 w-full rounded-md border border-line bg-surface ps-10 pe-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  aria-pressed={view === "signals"}
                  onClick={() => setView("signals")}
                  className={cn(
                    "rounded-md border px-2 py-2 text-start",
                    view === "signals" ? "border-brass bg-brass/10" : "border-line bg-surface",
                  )}
                >
                  <span className="block text-xs text-muted">سیگنال</span>
                  <span className="num text-lg">{faDigits(counts.long + counts.short)}</span>
                  <span className="mt-1 block text-xs">
                    <span className="text-long">{faDigits(counts.long)} خرید</span>
                    <span className="text-muted"> · </span>
                    <span className="text-short">{faDigits(counts.short)} فروش</span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={view === "aligned"}
                  onClick={() => setView("aligned")}
                  className={cn(
                    "rounded-md border px-2 py-2 text-start",
                    view === "aligned" ? "border-brass bg-brass/10" : "border-line bg-surface",
                  )}
                >
                  <span className="block text-xs text-muted">هم‌راستا</span>
                  <span className="num text-lg">{faDigits(counts.aligned)}</span>
                  <span className="mt-1 block text-xs text-muted">بدون عبور، ورود نیست</span>
                </button>
                <button
                  type="button"
                  aria-pressed={view === "all"}
                  onClick={() => setView("all")}
                  className={cn(
                    "rounded-md border px-2 py-2 text-start",
                    view === "all" ? "border-brass bg-brass/10" : "border-line bg-surface",
                  )}
                >
                  <span className="block text-xs text-muted">جفت اسکن‌شده</span>
                  <span className="num text-lg">{faDigits(pairCount)}</span>
                  <span className="mt-1 block text-xs text-muted">
                    {universe
                      ? `${faDigits(counts.all)} ردیف از ${faDigits(tradableCount)}`
                      : "در حال آماده‌سازی"}
                  </span>
                </button>
              </div>

              {progress ? (
                <div aria-live="polite">
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>
                      در حال خواندن {progress.label} · {faDigits(progress.done)} از {faDigits(progress.total)}
                    </span>
                    <span className="num">{pct}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-sm bg-fg/10">
                    <div className="h-full bg-brass" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ) : null}

              {error ? (
                <p className="rounded-md border border-short/40 bg-short/10 px-3 py-2 text-sm text-short">{error}</p>
              ) : null}
              {phase === "done" && failCount > 0 ? (
                <p className="text-xs text-muted">
                  {faDigits(failCount)} جفت کندل برنگرداند و از این دور کنار گذاشته شد.
                </p>
              ) : null}
              {scannedAt && phase === "done" ? (
                <p className="text-xs text-muted">آخرین به‌روزرسانی {formatClock(scannedAt)} به وقت تهران</p>
              ) : null}
            </div>

            {visible.length === 0 ? (
              <div className="rounded-md border border-line bg-surface px-4 py-8 text-sm leading-7 text-muted">
                {phase === "loading" ? (
                  <p>
                    کندل‌ها در حال خوانده‌شدن هستند. سیگنال فقط وقتی می‌آید که هر سه شرط روی کندل بسته‌شدهٔ آخر با
                    هم درست باشند.
                  </p>
                ) : view === "signals" ? (
                  <p>
                    در این دور، عبور تازه از EMA ۲۰ همراه با فیلتر روند و RSI دیده نشد. ارزهایی که روند و RSI
                    هم‌راستا هستند ولی هنوز عبور نکرده‌اند در زبانهٔ «هم‌راستا» قرار دارند و ورود حساب نمی‌شوند.
                  </p>
                ) : (
                  <p>موردی با این فیلتر پیدا نشد.</p>
                )}
              </div>
            ) : (
              <>
                <ul className="flex flex-col gap-2 md:hidden">
                  {visible.map((row) => {
                    const plan = row.signal ? tradePlan(row.close, row.atr, row.signal, capital) : null;
                    const dist = ((row.close - row.ema20) / row.ema20) * 100;
                    return (
                      <li key={`${row.pair}-${row.interval}`}>
                        <button
                          type="button"
                          onClick={() => setActive(row)}
                          className="w-full rounded-md border border-line bg-surface p-3 text-start"
                        >
                          <div className="flex items-center gap-3">
                            <Mark coin={row.coin} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="num font-semibold">{row.coin.symbol}</span>
                                <span className="text-xs text-muted">{intervalLabel(row.interval)}</span>
                              </div>
                              <p className="truncate text-xs text-muted" dir="ltr">
                                {row.coin.name}
                              </p>
                            </div>
                            <Badge row={row} />
                          </div>
                          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <dt className="text-muted">پایان کندل</dt>
                              <dd className="num text-sm">{formatPrice(row.close)}</dd>
                            </div>
                            <div>
                              <dt className="text-muted">RSI</dt>
                              <dd className="num text-sm">{row.rsi.toFixed(1)}</dd>
                            </div>
                            {plan ? (
                              <>
                                <div>
                                  <dt className="text-muted">حد ضرر</dt>
                                  <dd className="num text-sm text-short">{formatPrice(plan.sl)}</dd>
                                </div>
                                <div>
                                  <dt className="text-muted">حد سود</dt>
                                  <dd className="num text-sm text-long">{formatPrice(plan.tp)}</dd>
                                </div>
                                <div className="col-span-2">
                                  <dt className="text-muted">حجم برای ریسک ۰٫۵٪</dt>
                                  <dd className="num text-sm">{formatQty(plan.qty)}</dd>
                                </div>
                              </>
                            ) : (
                              <div className="col-span-2">
                                <dt className="text-muted">فاصله تا EMA ۲۰</dt>
                                <dd className="num text-sm">{formatPct(dist)}</dd>
                              </div>
                            )}
                          </dl>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="hidden overflow-x-auto rounded-md border border-line md:block">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-surface text-xs text-muted">
                      <tr>
                        <th className="px-3 py-3 text-start font-medium">ارز</th>
                        <th className="px-3 py-3 text-start font-medium">تایم</th>
                        <th className="px-3 py-3 text-start font-medium">وضعیت</th>
                        <th className="px-3 py-3 text-start font-medium">پایان کندل</th>
                        <th className="px-3 py-3 text-start font-medium">RSI</th>
                        <th className="px-3 py-3 text-start font-medium">
                          {view === "signals" ? "حد ضرر / حد سود" : "تا EMA ۲۰"}
                        </th>
                        <th className="px-3 py-3 text-start font-medium">حجم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((row) => {
                        const plan = row.signal ? tradePlan(row.close, row.atr, row.signal, capital) : null;
                        const dist = ((row.close - row.ema20) / row.ema20) * 100;
                        const tone =
                          row.signal === "long" || (row.longTrend && !row.shortTrend)
                            ? "long"
                            : row.signal === "short" || row.shortTrend
                              ? "short"
                              : "muted";
                        return (
                          <tr
                            key={`${row.pair}-${row.interval}`}
                            tabIndex={0}
                            role="button"
                            onClick={() => setActive(row)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setActive(row);
                              }
                            }}
                            className="border-t border-line bg-bg hover:bg-surface"
                          >
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-3">
                                <Mark coin={row.coin} />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="num font-semibold">{row.coin.symbol}</span>
                                    <span
                                      className={cn(
                                        "num text-xs",
                                        row.coin.change24h >= 0 ? "text-long" : "text-short",
                                      )}
                                    >
                                      {formatPct(row.coin.change24h)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted">
                                    رتبه {faDigits(row.coin.rank)}
                                    <span dir="ltr" className="ms-2">
                                      {row.coin.name}
                                    </span>
                                  </p>
                                </div>
                                <Spark values={row.spark} tone={tone} />
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">{intervalLabel(row.interval)}</td>
                            <td className="px-3 py-3">
                              <Badge row={row} />
                              <p className="mt-1 max-w-40 text-xs text-muted">{crossText(row)}</p>
                            </td>
                            <td className="num px-3 py-3 whitespace-nowrap">{formatPrice(row.close)}</td>
                            <td className="num px-3 py-3">{row.rsi.toFixed(1)}</td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              {plan ? (
                                <span className="num">
                                  <span className="text-short">{formatPrice(plan.sl)}</span>
                                  <span className="text-muted"> / </span>
                                  <span className="text-long">{formatPrice(plan.tp)}</span>
                                </span>
                              ) : (
                                <span className="num">{formatPct(dist)}</span>
                              )}
                            </td>
                            <td className="num px-3 py-3 whitespace-nowrap">{plan ? formatQty(plan.qty) : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {universe ? (
              <details className="rounded-md border border-line bg-surface px-3 py-2 text-sm">
                <summary className="flex h-11 items-center text-muted">
                  خارج از اسکن: {faDigits(skipped.length)} ارز از ۱۰۰
                </summary>
                <ul className="flex flex-col gap-1 pb-2 text-xs text-muted">
                  {skipped.map((coin) => (
                    <li key={coin.id} className="flex justify-between gap-3">
                      <span>
                        <span className="num text-fg">{coin.symbol}</span>
                        <span className="ms-2" dir="ltr">
                          {coin.name}
                        </span>
                      </span>
                      <span>{coin.stable ? "استیبل" : "جفت تتر در بایننس نیست"}</span>
                    </li>
                  ))}
                </ul>
                <p className="pb-2 text-xs leading-5 text-muted">
                  استیبل‌ها و توکن‌های بدون بازار اسپات تتر در بایننس وارد محاسبه نمی‌شوند. دادهٔ کندل از بازار اسپات
                  بایننس است و رتبه از ارزش بازار.
                </p>
              </details>
            ) : null}

            <p className="text-xs leading-5 text-muted">
              این صفحه برنامهٔ عددی همان استراتژی است، نه توصیهٔ خرید یا فروش. ورود روی قیمت پایانی کندل بسته‌شده
              محاسبه می‌شود.
            </p>
          </section>
        </div>
      </div>
      <CoinPanel row={active} capital={capital} onClose={() => setActive(null)} />
    </div>
  );
}
