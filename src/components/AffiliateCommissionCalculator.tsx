import { useMemo, useState } from "react";
import { calcAffiliate, type AffiliateInputs } from "../lib/tiktok-affiliate";
import { formatCurrencyPrecise } from "../lib/format";

type FieldKey = keyof AffiliateInputs;

interface FieldDef {
  key: FieldKey;
  label: string;
  note?: string;
  prefix?: "$";
  suffix?: "%";
  step: string;
}

const FIELDS: FieldDef[] = [
  {
    key: "pricePerUnit",
    label: "Product price",
    note: "Before your discount, excluding sales tax.",
    prefix: "$",
    step: "0.01",
  },
  {
    key: "sellerDiscountPerUnit",
    label: "Your discount per unit",
    note: "Seller-funded only. TikTok-funded discounts don't reduce the commission base.",
    prefix: "$",
    step: "0.01",
  },
  { key: "cogsPerUnit", label: "Product cost / COGS", prefix: "$", step: "0.01" },
  { key: "fulfillmentPerUnit", label: "Shipping / fulfillment", prefix: "$", step: "0.01" },
  {
    key: "referralRatePct",
    label: "TikTok referral fee",
    note: "US default 6%. Confirm your category in Seller Center.",
    suffix: "%",
    step: "0.1",
  },
  {
    key: "commissionRatePct",
    label: "Commission rate you're considering",
    note: "TikTok allows 1% to 80%.",
    suffix: "%",
    step: "0.5",
  },
  {
    key: "targetMarginPct",
    label: "Margin you want to keep",
    note: "On each affiliate sale, after the commission.",
    suffix: "%",
    step: "0.5",
  },
];

const DEFAULTS: Record<FieldKey, string> = {
  pricePerUnit: "30",
  sellerDiscountPerUnit: "0",
  cogsPerUnit: "9",
  fulfillmentPerUnit: "5",
  referralRatePct: "6",
  commissionRatePct: "15",
  targetMarginPct: "20",
};

const toNum = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

const pct = (n: number | null) => (n === null ? "—" : `${n.toFixed(1)}%`);

const cardTitle =
  "text-sm font-semibold uppercase tracking-wide text-muted-foreground";

export function AffiliateCommissionCalculator() {
  const [values, setValues] = useState<Record<FieldKey, string>>(DEFAULTS);

  const result = useMemo(
    () =>
      calcAffiliate({
        pricePerUnit: toNum(values.pricePerUnit),
        sellerDiscountPerUnit: toNum(values.sellerDiscountPerUnit),
        cogsPerUnit: toNum(values.cogsPerUnit),
        fulfillmentPerUnit: toNum(values.fulfillmentPerUnit),
        referralRatePct: toNum(values.referralRatePct),
        commissionRatePct: toNum(values.commissionRatePct),
        targetMarginPct: toNum(values.targetMarginPct),
      }),
    [values],
  );

  const setField = (key: FieldKey, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const target = toNum(values.targetMarginPct);
  const maxTarget = result.maxRateForTargetPct;
  const maxBreakEven = result.maxRateBreakEvenPct;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Inputs */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6">
        <p className={cardTitle}>One product</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.note ? "sm:col-span-2" : ""}>
              <label
                htmlFor={`aff-${f.key}`}
                className="block text-sm font-medium text-foreground"
              >
                {f.label}
              </label>
              <div className="relative mt-1.5">
                {f.prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {f.prefix}
                  </span>
                )}
                <input
                  id={`aff-${f.key}`}
                  inputMode="decimal"
                  type="number"
                  step={f.step}
                  min="0"
                  value={values[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  className={`h-10 w-full rounded-lg border border-input bg-background text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    f.prefix ? "pl-7" : "pl-3"
                  } ${f.suffix ? "pr-8" : "pr-3"}`}
                />
                {f.suffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {f.suffix}
                  </span>
                )}
              </div>
              {f.note && (
                <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Outputs */}
      <div className="space-y-4">
        <div
          className={`rounded-2xl border p-5 sm:p-6 shadow-card ${
            !result.targetUnreachable
              ? "border-profit/30 bg-profit-soft"
              : "border-loss/30 bg-loss-soft"
          }`}
        >
          <p className="text-sm font-medium text-muted-foreground">
            Highest commission that keeps a {target.toFixed(1)}% margin
          </p>
          {!result.targetUnreachable && maxTarget !== null ? (
            <p className="mt-1 text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums text-profit">
              {pct(Math.min(maxTarget, 80))}
            </p>
          ) : (
            <p className="mt-2 text-sm text-loss">
              Not reachable, even at 0% commission. This product makes{" "}
              {pct(
                result.commissionBase > 0
                  ? (result.netWithoutAffiliate / result.commissionBase) * 100
                  : null,
              )}{" "}
              on an organic sale, which is below your target. Raise the price,
              cut the discount, or lower the target before offering affiliates
              anything.
            </p>
          )}
          <p className="mt-3 text-sm text-muted-foreground">
            Break-even commission:{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {maxBreakEven !== null && maxBreakEven > 0
                ? pct(maxBreakEven)
                : "none (loses money before any commission)"}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6">
          <p className={cardTitle}>
            At {toNum(values.commissionRatePct).toFixed(1)}% commission
          </p>
          <dl className="mt-3 divide-y divide-border">
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">
                Commission base (price − your discount)
              </dt>
              <dd className="tabular-nums font-medium text-foreground">
                {formatCurrencyPrecise(result.commissionBase)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">Commission per sale</dt>
              <dd className="tabular-nums font-medium text-loss">
                −{formatCurrencyPrecise(result.commissionPerUnit)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">Referral fee</dt>
              <dd className="tabular-nums font-medium text-loss">
                −{formatCurrencyPrecise(result.referralFeePerUnit)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">Profit on an organic sale</dt>
              <dd className="tabular-nums font-medium text-foreground">
                {formatCurrencyPrecise(result.netWithoutAffiliate)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="font-medium text-foreground">
                Profit on an affiliate sale
              </dt>
              <dd
                className={`tabular-nums font-semibold ${
                  result.losesMoney ? "text-loss" : "text-profit"
                }`}
              >
                {formatCurrencyPrecise(result.netWithAffiliate)}
                {result.marginWithAffiliate !== null &&
                  ` (${(result.marginWithAffiliate * 100).toFixed(1)}%)`}
              </dd>
            </div>
          </dl>
          {result.losesMoney && (
            <p className="mt-3 text-sm text-loss">
              Every affiliate sale at this rate loses money.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
