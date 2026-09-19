import { useMemo, useState } from "react";
import {
  calcChargeableWeight,
  calcFbt,
  ACTUAL_WEIGHT_MAX_IN3,
  ACTUAL_WEIGHT_MAX_LB,
  DIM_DIVISOR,
  FREE_STORAGE_DAYS,
} from "../lib/tiktok-fbt";
import { formatCurrencyPrecise } from "../lib/format";

interface FieldDef {
  key: string;
  label: string;
  note?: string;
  prefix?: "$";
  suffix?: string;
  step: string;
}

const SIZE_FIELDS: FieldDef[] = [
  { key: "weightLb", label: "Unit weight (packaged)", suffix: "lb", step: "0.01" },
  { key: "lengthIn", label: "Length", suffix: "in", step: "0.1" },
  { key: "widthIn", label: "Width", suffix: "in", step: "0.1" },
  { key: "heightIn", label: "Height", suffix: "in", step: "0.1" },
];

const RATE_FIELDS: FieldDef[] = [
  {
    key: "fbtFulfillmentPerUnit",
    label: "FBT fulfillment fee per unit",
    note: "Look up your chargeable weight (left) on the current rate card.",
    prefix: "$",
    step: "0.01",
  },
  {
    key: "storageRatePerFt3Month",
    label: "Storage rate",
    note: "Per cubic foot per month, for the age band your stock usually reaches.",
    prefix: "$",
    step: "0.01",
  },
  {
    key: "returnHandlingPerUnit",
    label: "Return handling fee per unit",
    prefix: "$",
    step: "0.01",
  },
  {
    key: "inboundPerUnit",
    label: "Inbound shipping per unit",
    note: "Freight to the FBT warehouse ÷ units in the shipment. Set to 0 if your COGS already includes it.",
    prefix: "$",
    step: "0.01",
  },
];

const SALE_FIELDS: FieldDef[] = [
  { key: "price", label: "Selling price", prefix: "$", step: "0.01" },
  { key: "cogsPerUnit", label: "Product cost (COGS)", prefix: "$", step: "0.01" },
  {
    key: "referralRatePct",
    label: "Referral fee",
    note: "US default 6% — confirm your category in Seller Center.",
    suffix: "%",
    step: "0.1",
  },
  { key: "returnRatePct", label: "Return rate", suffix: "%", step: "0.1" },
  {
    key: "daysInStorage",
    label: "Average days in warehouse",
    note: `First ${FREE_STORAGE_DAYS} days are free per inbound shipment.`,
    suffix: "days",
    step: "1",
  },
];

const SELF_FIELDS: FieldDef[] = [
  { key: "selfShipLabelPerUnit", label: "Your shipping label per unit", prefix: "$", step: "0.01" },
  {
    key: "selfShipPackPerUnit",
    label: "Your packing cost per unit",
    note: "Mailer, filler, and your time or a 3PL's pick-and-pack fee.",
    prefix: "$",
    step: "0.01",
  },
];

// Example inputs only — NOT TikTok's rates. The fee fields are deliberately
// round numbers so nobody mistakes them for the rate card.
const DEFAULTS: Record<string, string> = {
  weightLb: "0.8",
  lengthIn: "9",
  widthIn: "6",
  heightIn: "3",
  fbtFulfillmentPerUnit: "4.00",
  storageRatePerFt3Month: "1.00",
  returnHandlingPerUnit: "2.00",
  inboundPerUnit: "0.25",
  price: "25",
  cogsPerUnit: "7",
  referralRatePct: "6",
  returnRatePct: "5",
  daysInStorage: "75",
  selfShipLabelPerUnit: "5.00",
  selfShipPackPerUnit: "0.75",
};

const toNum = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

function Fields({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[];
  values: Record<string, string>;
  onChange: (key: string, v: string) => void;
}) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.note ? "sm:col-span-2" : ""}>
          <label htmlFor={`fbt-${f.key}`} className="block text-sm font-medium text-foreground">
            {f.label}
          </label>
          <div className="relative mt-1.5">
            {f.prefix && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {f.prefix}
              </span>
            )}
            <input
              id={`fbt-${f.key}`}
              inputMode="decimal"
              type="number"
              step={f.step}
              min="0"
              value={values[f.key]}
              onChange={(e) => onChange(f.key, e.target.value)}
              className={`h-10 w-full rounded-lg border border-input bg-background text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                f.prefix ? "pl-7" : "pl-3"
              } ${f.suffix ? "pr-12" : "pr-3"}`}
            />
            {f.suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {f.suffix}
              </span>
            )}
          </div>
          {f.note && <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>}
        </div>
      ))}
    </div>
  );
}

const card = "rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6";
const cardTitle = "text-sm font-semibold uppercase tracking-wide text-muted-foreground";

export function FbtCalculator() {
  const [values, setValues] = useState<Record<string, string>>(DEFAULTS);
  const setField = (key: string, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));
  const n = (k: string) => toNum(values[k]);

  const weight = useMemo(
    () => calcChargeableWeight(n("weightLb"), n("lengthIn"), n("widthIn"), n("heightIn")),
    [values],
  );

  const r = useMemo(
    () =>
      calcFbt({
        price: n("price"),
        cogsPerUnit: n("cogsPerUnit"),
        referralRatePct: n("referralRatePct"),
        fbtFulfillmentPerUnit: n("fbtFulfillmentPerUnit"),
        inboundPerUnit: n("inboundPerUnit"),
        unitVolumeIn3: weight.volumeIn3,
        daysInStorage: n("daysInStorage"),
        storageRatePerFt3Month: n("storageRatePerFt3Month"),
        returnRatePct: n("returnRatePct"),
        returnHandlingPerUnit: n("returnHandlingPerUnit"),
        selfShipLabelPerUnit: n("selfShipLabelPerUnit"),
        selfShipPackPerUnit: n("selfShipPackPerUnit"),
      }),
    [values, weight.volumeIn3],
  );

  const fbtCheaper = r.fbtPremiumPerUnit < 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Inputs */}
      <div className="space-y-6">
        <div className={card}>
          <h2 className={cardTitle}>1 · Unit size</h2>
          <Fields fields={SIZE_FIELDS} values={values} onChange={setField} />
        </div>
        <div className={card}>
          <h2 className={cardTitle}>2 · Fees from your FBT rate card</h2>
          <p className="mt-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            The pre-filled fees are round example numbers, not TikTok&rsquo;s
            rates. Replace them with the figures on your current rate card.
          </p>
          <Fields fields={RATE_FIELDS} values={values} onChange={setField} />
        </div>
        <div className={card}>
          <h2 className={cardTitle}>3 · The sale</h2>
          <Fields fields={SALE_FIELDS} values={values} onChange={setField} />
        </div>
        <div className={card}>
          <h2 className={cardTitle}>4 · If you shipped it yourself</h2>
          <Fields fields={SELF_FIELDS} values={values} onChange={setField} />
        </div>
      </div>

      {/* Outputs */}
      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className={card}>
          <h2 className={cardTitle}>Chargeable weight</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums text-foreground">
            {weight.chargeableLb.toFixed(2)} lb
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {weight.actualWeightOnly
              ? `Billed on actual weight: the unit is ${ACTUAL_WEIGHT_MAX_LB} lb or less and ${ACTUAL_WEIGHT_MAX_IN3} in³ or less.`
              : weight.dimWeightApplies
                ? `Billed on dimensional weight (${weight.volumeIn3.toFixed(0)} in³ ÷ ${DIM_DIVISOR}), which is heavier than the ${n("weightLb").toFixed(2)} lb actual weight. A smaller box would lower this.`
                : `Over the actual-weight-only limits, but actual weight is still greater than dimensional weight (${weight.dimWeightLb.toFixed(2)} lb).`}
          </p>
        </div>

        <div
          className={`rounded-2xl border p-5 sm:p-6 shadow-card ${
            r.netProfitFbt >= 0 ? "border-profit/30 bg-profit-soft" : "border-loss/30 bg-loss-soft"
          }`}
        >
          <p className="text-sm font-medium text-muted-foreground">
            Net profit per unit with FBT
          </p>
          <p
            className={`mt-1 text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums ${
              r.netProfitFbt >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            {formatCurrencyPrecise(r.netProfitFbt)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {r.netMarginFbtPct.toFixed(1)}% net margin · FBT costs{" "}
            {r.fbtCostPctOfPrice.toFixed(1)}% of the price
          </p>
        </div>

        <div className={card}>
          <h2 className={cardTitle}>FBT cost per unit</h2>
          <dl className="mt-3 divide-y divide-border">
            {[
              ["Inbound shipping", n("inboundPerUnit")],
              ["Fulfillment fee", n("fbtFulfillmentPerUnit")],
              [
                `Storage (${Math.max(0, n("daysInStorage") - FREE_STORAGE_DAYS)} billable days)`,
                r.storagePerUnit,
              ],
              [`Return handling (× ${n("returnRatePct").toFixed(1)}% returned)`, r.returnHandlingExpected],
            ].map(([label, v]) => (
              <div key={label as string} className="flex items-center justify-between py-2 text-sm">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="tabular-nums font-medium text-foreground">
                  {formatCurrencyPrecise(v as number)}
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="font-medium text-foreground">Total FBT cost</dt>
              <dd className="tabular-nums font-semibold text-foreground">
                {formatCurrencyPrecise(r.fbtCostPerUnit)}
              </dd>
            </div>
          </dl>
        </div>

        <div className={card}>
          <h2 className={cardTitle}>FBT vs shipping it yourself</h2>
          <dl className="mt-3 divide-y divide-border">
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">Self-ship cost per unit</dt>
              <dd className="tabular-nums font-medium text-foreground">
                {formatCurrencyPrecise(r.selfShipCostPerUnit)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">Net profit self-shipping</dt>
              <dd className="tabular-nums font-medium text-foreground">
                {formatCurrencyPrecise(r.netProfitSelfShip)} ({r.netMarginSelfShipPct.toFixed(1)}%)
              </dd>
            </div>
          </dl>
          <p className={`mt-3 text-sm font-medium ${fbtCheaper ? "text-profit" : "text-loss"}`}>
            {Math.abs(r.fbtPremiumPerUnit) < 0.005
              ? "FBT and self-shipping cost the same per unit."
              : fbtCheaper
                ? `FBT is ${formatCurrencyPrecise(-r.fbtPremiumPerUnit)} cheaper per unit.`
                : `FBT costs ${formatCurrencyPrecise(r.fbtPremiumPerUnit)} more per unit.`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cost only. It doesn&rsquo;t count any sales lift from FBT&rsquo;s faster delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
