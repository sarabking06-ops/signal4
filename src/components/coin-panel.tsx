import * as Dialog from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PriceChart } from "@/components/price-chart";
import { fetchChart } from "@/lib/scan.functions";
import { formatCandle, formatMoney, formatPct, formatPrice, formatQty, intervalLabel } from "@/lib/format";
import { tradePlan } from "@/lib/strategy";
import type { ChartPoint, ScanOk, UniverseCoin } from "@/lib/types";

export type LiveRow = ScanOk & { coin: UniverseCoin };

function Item({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm leading-6">
      {ok ? (
        <Check className="mt-1 size-4 shrink-0 text-long" aria-hidden />
      ) : (
        <X className="mt-1 size-4 shrink-0 text-short" aria-hidden />
      )}
      <span className={ok ? "text-fg" : "text-muted"}>{text}</span>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-bg px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="num mt-1 text-sm">{value}</p>
    </div>
  );
}

export function CoinPanel({
  row,
  capital,
  onClose,
}: {
  row: LiveRow | null;
  capital: number;
  onClose: () => void;
}) {
  const [points, setPoints] = useState<ChartPoint[] | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    if (!row) return;
    let cancelled = false;
    setPoints(null);
    setChartError(null);
    void fetchChart({ data: { pair: row.pair, interval: row.interval } })
      .then((next) => {
        if (!cancelled) setPoints(next);
      })
      .catch(() => {
        if (!cancelled) setChartError("نمودار بارگذاری نشد");
      });
    return () => {
      cancelled = true;
    };
  }, [row]);

  const plan = row?.signal ? tradePlan(row.close, row.atr, row.signal, capital) : null;
  const drift = row && row.close > 0 ? ((row.mark - row.close) / row.close) * 100 : 0;

  return (
    <Dialog.Root open={row != null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/75" />
        <Dialog.Content className="fixed inset-y-0 start-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-e border-line bg-surface outline-none">
          {row ? (
            <div className="flex flex-col gap-5 p-4 pb-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Dialog.Title className="text-xl font-semibold">
                    <span className="num">{row.coin.symbol}</span>
                    <span className="ms-2 text-base font-medium text-muted">{intervalLabel(row.interval)}</span>
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-muted" dir="ltr">
                    {row.coin.name} · {row.pair}
                  </Dialog.Description>
                  <p className="mt-1 text-xs text-muted">{formatCandle(row.candleTime, row.interval)}</p>
                </div>
                <Dialog.Close className="grid size-11 place-items-center rounded-md border border-line text-muted">
                  <X className="size-4" />
                  <span className="sr-only">بستن</span>
                </Dialog.Close>
              </div>

              <div>
                {points && points.length > 1 ? (
                  <PriceChart
                    points={points}
                    entry={plan ? row.close : undefined}
                    sl={plan?.sl}
                    tp={plan?.tp}
                  />
                ) : (
                  <div className="grid h-64 place-items-center rounded-md border border-line bg-bg text-sm text-muted">
                    {chartError ?? "در حال چیدن نمودار…"}
                  </div>
                )}
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                  <li>قیمت</li>
                  <li className="text-brass">EMA ۲۰</li>
                  <li className="text-long">EMA ۵۰</li>
                  <li>EMA ۲۰۰</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Stat label="پایان کندل" value={formatPrice(row.close)} />
                <Stat label="RSI ۱۴" value={row.rsi.toFixed(1)} />
                <Stat label="EMA ۲۰" value={formatPrice(row.ema20)} />
                <Stat label="ATR ۱۴" value={formatPrice(row.atr)} />
                <Stat label="EMA ۵۰" value={formatPrice(row.ema50)} />
                <Stat label="EMA ۲۰۰" value={formatPrice(row.ema200)} />
              </div>

              {Math.abs(drift) >= 0.1 ? (
                <p className="text-xs text-muted">
                  قیمت لحظه‌ای کندل باز{" "}
                  <span className="num text-fg">{formatPrice(row.mark)}</span>
                  {" "}
                  (<span className="num">{formatPct(drift)}</span> نسبت به پایان کندل). ورود استراتژی همچنان روی پایان کندل است.
                </p>
              ) : null}

              <section>
                <h3 className="mb-2 text-sm font-semibold text-long">شرط‌های خرید</h3>
                <ul className="flex flex-col gap-1.5">
                  <Item ok={row.longTrend} text="EMA ۵۰ بالای EMA ۲۰۰ و قیمت بالای EMA ۲۰۰" />
                  <Item ok={row.crossUp} text="عبور پایان کندل از زیر EMA ۲۰ به بالای آن" />
                  <Item ok={row.rsiAbove50} text="RSI ۱۴ بالاتر از ۵۰" />
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold text-short">شرط‌های فروش</h3>
                <ul className="flex flex-col gap-1.5">
                  <Item ok={row.shortTrend} text="EMA ۵۰ زیر EMA ۲۰۰ و قیمت زیر EMA ۲۰۰" />
                  <Item ok={row.crossDown} text="عبور پایان کندل از بالای EMA ۲۰ به زیر آن" />
                  <Item ok={row.rsiBelow50} text="RSI ۱۴ پایین‌تر از ۵۰" />
                </ul>
              </section>

              {plan && row.signal ? (
                <section className="rounded-md border border-brass/40 bg-brass/10 p-3">
                  <h3 className="text-sm font-semibold">
                    {row.signal === "long" ? "برنامهٔ خرید" : "برنامهٔ فروش استقراضی"}
                  </h3>
                  <p className="mt-1 text-xs text-muted">یک ورود. بدون افزایش پله‌ای و بدون مارتینگل.</p>
                  <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted">ورود</dt>
                      <dd className="num">{formatPrice(row.close)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">حجم</dt>
                      <dd className="num">{formatQty(plan.qty)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-short">حد ضرر</dt>
                      <dd className="num">
                        {formatPrice(plan.sl)}
                        <span className="text-xs text-muted"> · {plan.slPct.toFixed(2)}%</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-long">حد سود</dt>
                      <dd className="num">
                        {formatPrice(plan.tp)}
                        <span className="text-xs text-muted"> · {plan.tpPct.toFixed(2)}%</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">ریسک ۰٫۵٪</dt>
                      <dd className="num">{formatMoney(plan.riskCash)} USDT</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">ارزش ورود</dt>
                      <dd className="num">{formatMoney(plan.notional)}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs leading-5 text-muted">
                    حجم = (سرمایه × ۰٫۰۰۵) ÷ (۱٫۵ × ATR). حد سود دو برابر همین فاصله است. گرد کردن حجم در
                    صرافی ریسک را کمی جابه‌جا می‌کند.
                  </p>
                </section>
              ) : (
                <p className="rounded-md border border-line bg-bg px-3 py-3 text-sm text-muted">
                  معامله‌ای صادر نشده. هر سه شرط باید روی همین کندل بسته‌شده با هم برقرار باشند.
                </p>
              )}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
