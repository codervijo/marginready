import { useMemo, useState } from "react";
import { calcLandedCogs, type LandedCogsInputs } from "../lib/landed-cogs";
import { formatCurrencyPrecise, formatNumber } from "../lib/format";

type FieldKey = keyof LandedCogsInputs;

interface FieldDef {
  key: FieldKey;
  label: string;
  note?: string;
  prefix?: "$";
  suffix?: string;
  step: string;
}

const FIELDS: FieldDef[] = [
  { key: "supplierPricePerUnit", label: "Supplier price per unit", prefix: "$", step: "0.01" },
  { key: "unitsOrdered", label: "Units in the order", suffix: "units", step: "1" },
  {
    key: "packagingPerUnit",
    label: "Packaging, labels, inserts per unit",
    note: "Anything that ships inside or on every unit.",
    prefix: "$",
    step: "0.01",
  },
  { key: "freightBatch", label: "Freight from supplier (whole order)", prefix: "$", step: "1" },
  {
    key: "dutyRatePct",
    label: "Duty / tariff rate",
    note: "Applied to the supplier cost. Use the rate on your customs entry, not a guess.",
    suffix: "%",
    step: "0.1",
  },
  {
    key: "otherBatchCosts",
    label: "Other one-off order costs",
    note: "Inspection, customs broker, prep service, samples you paid for.",
    prefix: "$",
    step: "1",
  },
  {
    key: "inboundToWarehouseBatch",
    label: "Shipping into your warehouse or FBT (whole order)",
    prefix: "$",
    step: "1",
  },
  {
    key: "defectRatePct",
    label: "Units that arrive unsellable",
    note: "Damaged, defective or short-shipped units you can't return to the supplier.",
    suffix: "%",
    step: "0.1",
  },
];

// Example purchase order — the seller's own numbers go here.
const DEFAULTS: Record<FieldKey, string> = {
  supplierPricePerUnit: "4.00",
  unitsOrdered: "500",
  packagingPerUnit: "0.35",
  freightBatch: "400",
  dutyRatePct: "0",
  otherBatchCosts: "0",
  inboundToWarehouseBatch: "120",
  defectRatePct: "2",
};

const toNum = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

const card = "rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6";

export function LandedCogsCalculator() {
  const [values, setValues] = useState<Record<FieldKey, string>>(DEFAULTS);
  const setField = (key: FieldKey, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const r = useMemo(() => {
    const input = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, toNum(v)]),
    ) as unknown as LandedCogsInputs;
    return calcLandedCogs(input);
  }, [values]);

  const rows = r.perUnit
    ? [
        ["Supplier price", r.perUnit.supplier],
        ["Packaging & labels", r.perUnit.packaging],
        ["Freight from supplier", r.perUnit.freight],
        ["Duties", r.perUnit.duties],
        ["Other order costs", r.perUnit.other],
        ["Inbound to warehouse", r.perUnit.inbound],
      ].filter(([, v]) => (v as number) > 0.00005)
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className={card}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          One purchase order
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.note ? "sm:col-span-2" : ""}>
              <label htmlFor={`cogs-${f.key}`} className="block text-sm font-medium text-foreground">
                {f.label}
              </label>
              <div className="relative mt-1.5">
                {f.prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {f.prefix}
                  </span>
                )}
                <input
                  id={`cogs-${f.key}`}
                  inputMode="decimal"
                  type="number"
                  step={f.step}
                  min="0"
                  value={values[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  className={`h-10 w-full rounded-lg border border-input bg-background text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    f.prefix ? "pl-7" : "pl-3"
                  } ${f.suffix ? "pr-14" : "pr-3"}`}
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
      </div>

      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-profit/30 bg-profit-soft p-5 sm:p-6 shadow-card">
          <p className="text-sm font-medium text-muted-foreground">Landed COGS per sellable unit</p>
          {r.landedCogsPerUnit !== null ? (
            <>
              <p className="mt-1 text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums text-foreground">
                {formatCurrencyPrecise(r.landedCogsPerUnit)}
              </p>
              {r.upliftOverSupplierPct !== null && (
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-semibold tabular-nums text-foreground">
                    {r.upliftOverSupplierPct.toFixed(1)}%
                  </span>{" "}
                  above the supplier price. Use this number wherever a tool asks for COGS.
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-loss">
              No sellable units. Check the unit count and the unsellable rate.
            </p>
          )}
        </div>

        {r.landedCogsPerUnit !== null && (
          <div className={card}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Where each unit&rsquo;s cost comes from
            </h2>
            <dl className="mt-3 divide-y divide-border">
              {rows.map(([label, v]) => (
                <div key={label as string} className="flex items-center justify-between py-2 text-sm">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="tabular-nums font-medium text-foreground">
                    {formatCurrencyPrecise(v as number)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Order total {formatCurrencyPrecise(r.batchTotal)} ÷{" "}
              {formatNumber(Math.round(r.sellableUnits * 100) / 100)} sellable units.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
