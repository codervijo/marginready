import { useMemo, useState } from "react";
import { calcFees, type FeeInputs } from "../lib/tiktok-fees";
import { formatCurrency, formatCurrencyPrecise } from "../lib/format";

type FieldKey = keyof FeeInputs;

interface FieldDef {
  key: FieldKey;
  label: string;
  note?: string;
  prefix?: "$" | "%";
  suffix?: "%";
  step: string;
}

const FIELDS: FieldDef[] = [
  { key: "price", label: "Selling price per unit", prefix: "$", step: "0.01" },
  { key: "units", label: "Units sold", step: "1" },
  {
    key: "referralRatePct",
    label: "TikTok referral fee",
    note: "US default 6%, 5% select jewelry — confirm your category in Seller Center.",
    suffix: "%",
    step: "0.1",
  },
  { key: "cogsPerUnit", label: "Product cost / COGS per unit", prefix: "$", step: "0.01" },
  {
    key: "affiliateRatePct",
    label: "Affiliate / creator commission",
    note: "10–30% typical if using creators.",
    suffix: "%",
    step: "0.1",
  },
  {
    key: "fulfillmentPerUnit",
    label: "Fulfillment per unit",
    note: "FBT approx $2.86–$4.28/unit.",
    prefix: "$",
    step: "0.01",
  },
  { key: "returnRatePct", label: "Return rate", note: "Share of revenue refunded.", suffix: "%", step: "0.1" },
  { key: "adSpend", label: "Ad spend (total)", note: "Total across this batch of orders.", prefix: "$", step: "0.01" },
];

const DEFAULTS: Record<FieldKey, string> = {
  price: "50",
  units: "100",
  referralRatePct: "6",
  cogsPerUnit: "15",
  affiliateRatePct: "0",
  fulfillmentPerUnit: "0",
  returnRatePct: "0",
  adSpend: "0",
};

const toNum = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

export function TikTokFeeCalculator() {
  const [values, setValues] = useState<Record<FieldKey, string>>(DEFAULTS);

  const result = useMemo(
    () =>
      calcFees({
        price: toNum(values.price),
        units: toNum(values.units),
        referralRatePct: toNum(values.referralRatePct),
        cogsPerUnit: toNum(values.cogsPerUnit),
        affiliateRatePct: toNum(values.affiliateRatePct),
        fulfillmentPerUnit: toNum(values.fulfillmentPerUnit),
        returnRatePct: toNum(values.returnRatePct),
        adSpend: toNum(values.adSpend),
      }),
    [values],
  );

  const profitable = result.netProfit >= 0;

  const setField = (key: FieldKey, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const costRows: { label: string; value: number }[] = [
    { label: "Total revenue", value: result.totalRevenue },
    { label: "Total referral fee", value: -result.totalReferralFee },
    { label: "Total affiliate commission", value: -result.totalAffiliate },
    { label: "Total fulfillment", value: -result.totalFulfillment },
    { label: "Total COGS", value: -result.totalCogs },
    { label: "Estimated returns cost", value: -result.estimatedReturnsCost },
    { label: "Ad spend", value: -result.adSpend },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Inputs */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your numbers
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.note ? "sm:col-span-2" : ""}>
              <label
                htmlFor={`tk-${f.key}`}
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
                  id={`tk-${f.key}`}
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
        {/* Headline */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 shadow-card ${
            profitable
              ? "border-profit/30 bg-profit-soft"
              : "border-loss/30 bg-loss-soft"
          }`}
        >
          <p className="text-sm font-medium text-muted-foreground">
            Net profit
          </p>
          <p
            className={`mt-1 text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums ${
              profitable ? "text-profit" : "text-loss"
            }`}
          >
            {formatCurrency(result.netProfit)}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-muted-foreground">
              Net margin{" "}
              <span
                className={`font-semibold tabular-nums ${
                  profitable ? "text-profit" : "text-loss"
                }`}
              >
                {result.netMarginPct.toFixed(1)}%
              </span>
            </span>
            <span className="text-muted-foreground">
              TikTok&rsquo;s effective take{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {result.effectiveTakePct.toFixed(1)}%
              </span>{" "}
              of revenue
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Breakdown
          </h2>
          <dl className="mt-3 divide-y divide-border">
            {costRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-2 text-sm"
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd
                  className={`tabular-nums font-medium ${
                    row.value < 0 ? "text-loss" : "text-foreground"
                  }`}
                >
                  {row.value < 0 ? "−" : ""}
                  {formatCurrencyPrecise(Math.abs(row.value))}
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between py-2.5 text-sm">
              <dt className="font-semibold text-foreground">Net profit</dt>
              <dd
                className={`tabular-nums font-semibold ${
                  profitable ? "text-profit" : "text-loss"
                }`}
              >
                {formatCurrencyPrecise(result.netProfit)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
