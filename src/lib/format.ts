import type { Interval } from "@/lib/types";

const FA = "۰۱۲۳۴۵۶۷۸۹";

export function faDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA[Number(d)] ?? d);
}

export function formatPrice(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  const digits =
    abs >= 1000 ? 2 : abs >= 100 ? 3 : abs >= 1 ? 4 : abs >= 0.1 ? 5 : abs >= 0.01 ? 6 : abs >= 0.0001 ? 8 : 10;
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export function formatQty(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  const digits = n >= 1000 ? 3 : n >= 1 ? 4 : n >= 0.001 ? 6 : 8;
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const digits = Math.abs(n) >= 100 ? 2 : Math.abs(n) >= 1 ? 2 : 4;
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: digits });
}

export function formatPct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function intervalLabel(interval: Interval): string {
  if (interval === "1h") return "۱ ساعته";
  if (interval === "4h") return "۴ ساعته";
  return "روزانه";
}

export function formatCandle(ts: number, interval: Interval): string {
  const date = new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran",
    month: "short",
    day: "numeric",
    hour: interval === "1d" ? undefined : "2-digit",
    minute: interval === "1d" ? undefined : "2-digit",
  }).format(new Date(ts));
  return `${date} · تهران`;
}

export function formatClock(ts: number): string {
  return new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}
