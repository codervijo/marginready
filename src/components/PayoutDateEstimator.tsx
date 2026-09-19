import { useEffect, useMemo, useState } from "react";
import {
  calcPayoutTimeline,
  parseIsoDate,
  MAX_SETTLEMENT_DAYS,
  MIN_SETTLEMENT_DAYS,
  RESERVE_DAYS,
} from "../lib/tiktok-payout";

const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const todayIso = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
    .toISOString()
    .slice(0, 10);
};

const card = "rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6";
const input =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent";

export function PayoutDateEstimator() {
  // Empty on the server render; filled with the viewer's today on mount so the
  // static HTML never bakes in a stale build date.
  const [delivered, setDelivered] = useState("");
  const [days, setDays] = useState(String(MAX_SETTLEMENT_DAYS));
  useEffect(() => setDelivered(todayIso()), []);

  const t = useMemo(() => {
    const d = parseIsoDate(delivered);
    return d ? calcPayoutTimeline(d, parseFloat(days)) : null;
  }, [delivered, days]);

  const rows: [string, string, string][] = t
    ? [
        ["Payout initiated", fmt(t.payoutInitiated), `${t.settlementDays} days after delivery`],
        ["In your bank", `${fmt(t.bankEarliest)} – ${fmt(t.bankLatest)}`, "1–3 business days after initiation"],
        ["Reserve released", fmt(t.reserveRelease), `${RESERVE_DAYS} days after delivery`],
      ]
    : [];

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className={card}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your order
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="po-delivered" className="block text-sm font-medium text-foreground">
              Delivery date
            </label>
            <input
              id="po-delivered"
              type="date"
              value={delivered}
              onChange={(e) => setDelivered(e.target.value)}
              className={`mt-1.5 ${input}`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              The date the carrier marked it delivered, not the order date.
            </p>
          </div>
          <div>
            <label htmlFor="po-days" className="block text-sm font-medium text-foreground">
              Your settlement period
            </label>
            <div className="relative mt-1.5">
              <input
                id="po-days"
                type="number"
                inputMode="numeric"
                min={MIN_SETTLEMENT_DAYS}
                max={MAX_SETTLEMENT_DAYS}
                step="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className={`${input} pr-14`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                days
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              From Seller Center. {MAX_SETTLEMENT_DAYS} is the slowest the policy
              allows, so leave it there for a worst case.
            </p>
          </div>
        </div>
      </div>

      <div className={card}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          When the money moves
        </h2>
        {t ? (
          <>
            <dl className="mt-3 divide-y divide-border">
              {rows.map(([label, value, note]) => (
                <div key={label} className="py-3">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{value}</dd>
                  <dd className="text-xs text-muted-foreground">{note}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted-foreground">
              Up to <span className="font-semibold text-foreground tabular-nums">{t.daysToCashLatest} days</span>{" "}
              from delivery to cash. An open return or refund request holds
              the order until it&rsquo;s resolved. Bank holidays aren&rsquo;t counted.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Pick a delivery date.</p>
        )}
      </div>
    </div>
  );
}
