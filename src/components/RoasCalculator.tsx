import { useMemo, useState } from "react";
import { calcRoas, type RoasInputs } from "../lib/tiktok-roas";
import { formatCurrencyPrecise } from "../lib/format";

type FieldKey = keyof RoasInputs;

interface FieldDef {
  key: FieldKey;
  label: string;
  note?: string;
  prefix?: "$";
  suffix?: "%" | "×";
  step: string;
}

const FIELDS: FieldDef[] = [
  { key: "price", label: "Selling price per unit", prefix: "$", step: "0.01" },
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
    key: "targetMarginPct",
    label: "Target net margin after ads",
    note: "What you want left once ad spend is paid.",
    suffix: "%",
    step: "0.5",
  },
  {
    key: "currentRoas",
    label: "ROAS you are getting today",
    note: "From TikTok Ads Manager. Leave at 0 to skip this comparison.",
    suffix: "×",
    step: "0.01",
  },
];

const DEFAULTS: Record<FieldKey, string> = {
  price: "50",
  cogsPerUnit: "15",
  referralRatePct: "6",
  affiliateRatePct: "0",
  fulfillmentPerUnit: "0",
  returnRatePct: "0",
  targetMarginPct: "15",
  currentRoas: "0",
};

const toNum = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

export function RoasCalculator() {
  const [values, setValues] = useState<Record<FieldKey, string>>(DEFAULTS);

  const result = useMemo(
    () =>
      calcRoas({
        price: toNum(values.price),
        cogsPerUnit: toNum(values.cogsPerUnit),
        referralRatePct: toNum(values.referralRatePct),
        affiliateRatePct: toNum(values.affiliateRatePct),
        fulfillmentPerUnit: toNum(values.fulfillmentPerUnit),
        returnRatePct: toNum(values.returnRatePct),
        targetMarginPct: toNum(values.targetMarginPct),
        currentRoas: toNum(values.currentRoas),
      }),
    [values],
  );

  const setField = (key: FieldKey, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const hasCurrentRoas = toNum(values.currentRoas) > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Inputs */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your unit economics
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.note ? "sm:col-span-2" : ""}>
              <label
                htmlFor={`roas-${f.key}`}
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
                  id={`roas-${f.key}`}
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
        {/* Headline: break-even ROAS */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 shadow-card ${
            result.unprofitableBeforeAds
              ? "border-loss/30 bg-loss-soft"
              : "border-profit/30 bg-profit-soft"
          }`}
        >
          <p className="text-sm font-medium text-muted-foreground">
            Break-even ROAS
          </p>
          {result.breakEvenRoas !== null ? (
            <>
              <p className="mt-1 text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums text-profit">
                {result.breakEvenRoas.toFixed(2)}×
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Below this, every ad dollar loses money. Your contribution
                margin is{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {(result.contributionRate * 100).toFixed(1)}%
                </span>{" "}
                of revenue.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-loss">
              This product loses money before you spend a cent on ads — costs
              exceed the selling price. No ROAS can fix that; fix the unit
              economics first.
            </p>
          )}
        </div>

        {/* Targets */}
        <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            What you need to hit
          </h2>
          <dl className="mt-3 divide-y divide-border">
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">
                Contribution per order (before ads)
              </dt>
              <dd
                className={`tabular-nums font-medium ${
                  result.contributionPerUnit >= 0 ? "text-foreground" : "text-loss"
                }`}
              >
                {formatCurrencyPrecise(result.contributionPerUnit)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">
                ROAS for {toNum(values.targetMarginPct).toFixed(1)}% net margin
              </dt>
              <dd className="tabular-nums font-medium text-foreground">
                {result.targetRoas !== null
                  ? `${result.targetRoas.toFixed(2)}×`
                  : "unreachable"}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">
                Max cost per order at break-even
              </dt>
              <dd className="tabular-nums font-medium text-foreground">
                {result.maxCpaBreakEven !== null
                  ? formatCurrencyPrecise(result.maxCpaBreakEven)
                  : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">
                Max cost per order at target margin
              </dt>
              <dd className="tabular-nums font-medium text-foreground">
                {result.maxCpaAtTarget !== null
                  ? formatCurrencyPrecise(result.maxCpaAtTarget)
                  : "—"}
              </dd>
            </div>
          </dl>
          {result.targetUnreachable && !result.unprofitableBeforeAds && (
            <p className="mt-3 text-xs text-loss">
              A {toNum(values.targetMarginPct).toFixed(1)}% net margin is above
              your {(result.contributionRate * 100).toFixed(1)}% contribution
              margin, so it cannot be reached at any ROAS — even with free ads.
            </p>
          )}
        </div>

        {/* Current ROAS verdict */}
        {hasCurrentRoas && result.netMarginAtCurrentRoas !== null && (
          <div
            className={`rounded-2xl border p-5 sm:p-6 shadow-card ${
              result.currentRoasProfitable
                ? "border-profit/30 bg-profit-soft"
                : "border-loss/30 bg-loss-soft"
            }`}
          >
            <p className="text-sm font-medium text-muted-foreground">
              At {toNum(values.currentRoas).toFixed(2)}× ROAS your net margin is
            </p>
            <p
              className={`mt-1 text-3xl font-semibold tracking-tight tabular-nums ${
                result.currentRoasProfitable ? "text-profit" : "text-loss"
              }`}
            >
              {result.netMarginAtCurrentRoas.toFixed(1)}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.currentRoasProfitable
                ? "You are above break-even — scaling spend at this ROAS adds profit."
                : "You are below break-even — every additional ad dollar deepens the loss."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
