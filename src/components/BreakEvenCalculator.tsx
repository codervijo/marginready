import { useMemo, useState } from "react";
import { calcBreakEven, type BreakEvenInputs } from "../lib/tiktok-breakeven";
import { formatCurrencyPrecise } from "../lib/format";

type FieldKey = keyof BreakEvenInputs;

interface FieldDef {
  key: FieldKey;
  label: string;
  note?: string;
  prefix?: "$";
  suffix?: "%";
  step: string;
}

const FIELDS: FieldDef[] = [
  { key: "cogsPerUnit", label: "Product cost / COGS per unit", prefix: "$", step: "0.01" },
  {
    key: "referralRatePct",
    label: "TikTok referral fee",
    note: "US default 6% — confirm your category in Seller Center.",
    suffix: "%",
    step: "0.1",
  },
  {
    key: "affiliateRatePct",
    label: "Affiliate / creator commission",
    note: "Only the rate you pay on creator-driven sales.",
    suffix: "%",
    step: "0.1",
  },
  { key: "fulfillmentPerUnit", label: "Fulfillment per unit", prefix: "$", step: "0.01" },
  {
    key: "returnRatePct",
    label: "Return rate",
    note: "Share of revenue refunded.",
    suffix: "%",
    step: "0.1",
  },
  {
    key: "adSpendPerUnit",
    label: "Ad spend per unit",
    note: "Total ad spend ÷ units sold. Leave at 0 for organic-only.",
    prefix: "$",
    step: "0.01",
  },
  {
    key: "targetMarginPct",
    label: "Target net margin",
    note: "The margin you actually want to keep after everything.",
    suffix: "%",
    step: "0.5",
  },
];

const DEFAULTS: Record<FieldKey, string> = {
  cogsPerUnit: "15",
  referralRatePct: "6",
  affiliateRatePct: "0",
  fulfillmentPerUnit: "0",
  returnRatePct: "0",
  adSpendPerUnit: "0",
  targetMarginPct: "20",
};

const toNum = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

export function BreakEvenCalculator() {
  const [values, setValues] = useState<Record<FieldKey, string>>(DEFAULTS);

  const result = useMemo(
    () =>
      calcBreakEven({
        cogsPerUnit: toNum(values.cogsPerUnit),
        referralRatePct: toNum(values.referralRatePct),
        affiliateRatePct: toNum(values.affiliateRatePct),
        fulfillmentPerUnit: toNum(values.fulfillmentPerUnit),
        returnRatePct: toNum(values.returnRatePct),
        adSpendPerUnit: toNum(values.adSpendPerUnit),
        targetMarginPct: toNum(values.targetMarginPct),
      }),
    [values],
  );

  const setField = (key: FieldKey, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const ratePctUsed = (1 - result.rateSurvivalFactor) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Inputs */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your costs
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.note ? "sm:col-span-2" : ""}>
              <label
                htmlFor={`be-${f.key}`}
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
                  id={`be-${f.key}`}
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
        {/* Headline: target price */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 shadow-card ${
            result.targetPrice !== null
              ? "border-profit/30 bg-profit-soft"
              : "border-loss/30 bg-loss-soft"
          }`}
        >
          <p className="text-sm font-medium text-muted-foreground">
            Price needed for {toNum(values.targetMarginPct).toFixed(1)}% net
            margin
          </p>
          {result.targetPrice !== null ? (
            <>
              <p className="mt-1 text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums text-profit">
                {formatCurrencyPrecise(result.targetPrice)}
              </p>
              {result.targetMarkupMultiple !== null && (
                <p className="mt-3 text-sm text-muted-foreground">
                  That is{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {result.targetMarkupMultiple.toFixed(2)}×
                  </span>{" "}
                  your product cost.
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-loss">
              Not reachable at any price. Your percentage costs (
              {ratePctUsed.toFixed(1)}% of revenue) leave less than the{" "}
              {toNum(values.targetMarginPct).toFixed(1)}% margin you asked for.
              Lower the target, the affiliate rate, or the return rate.
            </p>
          )}
        </div>

        {/* Break-even */}
        <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Break-even
          </h2>
          {result.breakEvenPrice !== null ? (
            <>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Lowest price that does not lose money
                </span>
                <span className="text-2xl font-semibold tabular-nums text-foreground">
                  {formatCurrencyPrecise(result.breakEvenPrice)}
                </span>
              </div>
              <dl className="mt-3 divide-y divide-border">
                <div className="flex items-center justify-between py-2 text-sm">
                  <dt className="text-muted-foreground">
                    Fixed cost per unit (COGS + fulfillment + ads)
                  </dt>
                  <dd className="tabular-nums font-medium text-foreground">
                    {formatCurrencyPrecise(result.fixedCostPerUnit)}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2 text-sm">
                  <dt className="text-muted-foreground">
                    Percentage costs (referral + affiliate + returns)
                  </dt>
                  <dd className="tabular-nums font-medium text-loss">
                    {ratePctUsed.toFixed(1)}% of revenue
                  </dd>
                </div>
                {result.breakEvenMarkupMultiple !== null && (
                  <div className="flex items-center justify-between py-2 text-sm">
                    <dt className="text-muted-foreground">
                      Markup just to break even
                    </dt>
                    <dd className="tabular-nums font-medium text-foreground">
                      {result.breakEvenMarkupMultiple.toFixed(2)}×
                    </dd>
                  </div>
                )}
              </dl>
            </>
          ) : (
            <p className="mt-3 text-sm text-loss">
              No price breaks even. Your referral, affiliate and return rates
              together consume {ratePctUsed.toFixed(1)}% of revenue — at or
              above 100%, raising the price cannot help because every cost
              scales with it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
