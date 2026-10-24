import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPrice } from "@/lib/format";
import type { ChartPoint } from "@/lib/types";

const NAMES: Record<string, string> = {
  c: "قیمت پایانی",
  e20: "EMA 20",
  e50: "EMA 50",
  e200: "EMA 200",
};

export function PriceChart({
  points,
  entry,
  sl,
  tp,
}: {
  points: ChartPoint[];
  entry?: number;
  sl?: number;
  tp?: number;
}) {
  const data = points.map((point) => ({
    ...point,
    label: new Intl.DateTimeFormat("fa-IR", {
      timeZone: "Asia/Tehran",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(point.t)),
  }));

  const levels = data.flatMap((point) =>
    [point.c, point.e20, point.e50, point.e200].filter((value): value is number => value != null),
  );
  if (entry != null) levels.push(entry);
  if (sl != null) levels.push(sl);
  if (tp != null) levels.push(tp);
  const min = Math.min(...levels);
  const max = Math.max(...levels);
  const pad = (max - min) * 0.08 || Math.abs(max) * 0.01;

  return (
    <div className="h-64 w-full min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 4, left: 0, bottom: 0 }}>
          <XAxis dataKey="label" hide />
          <YAxis
            domain={[min - pad, max + pad]}
            orientation="right"
            width={72}
            tickFormatter={(value: number) => formatPrice(value)}
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name) => {
              const n = typeof value === "number" ? value : Number(value);
              return [formatPrice(n), NAMES[String(name)] ?? String(name)];
            }}
            labelStyle={{ color: "var(--color-muted)" }}
            contentStyle={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-line)",
              borderRadius: 8,
              fontSize: 12,
            }}
            itemStyle={{ color: "var(--color-fg)" }}
          />
          {entry != null ? (
            <ReferenceLine y={entry} stroke="var(--color-brass)" strokeDasharray="2 4" />
          ) : null}
          {tp != null ? <ReferenceLine y={tp} stroke="var(--color-long)" strokeDasharray="4 4" /> : null}
          {sl != null ? <ReferenceLine y={sl} stroke="var(--color-short)" strokeDasharray="4 4" /> : null}
          <Line type="monotone" dataKey="e200" stroke="var(--color-muted)" dot={false} strokeWidth={1.25} strokeDasharray="3 3" isAnimationActive={false} />
          <Line type="monotone" dataKey="e50" stroke="var(--color-long)" dot={false} strokeWidth={1.4} isAnimationActive={false} />
          <Line type="monotone" dataKey="e20" stroke="var(--color-brass)" dot={false} strokeWidth={1.4} isAnimationActive={false} />
          <Line type="monotone" dataKey="c" stroke="var(--color-fg)" dot={false} strokeWidth={1.8} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
