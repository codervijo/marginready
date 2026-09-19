// Pure landed-cost (COGS per unit) math for a purchase batch.
// Everything is a seller input; nothing here is a TikTok fee. COGS is the one
// number TikTok's settlement data can never contain, because TikTok doesn't
// know what you paid for the product.
//
// Model:
//   batch cost    = supplier price × units ordered
//                 + per-unit extras (packaging, labels, inserts) × units ordered
//                 + batch costs (freight, duties, inspection, prep, inbound to warehouse)
//   sellable      = units ordered × (1 − defect rate)
//   landed COGS   = batch cost ÷ sellable units
//
// Dividing by *sellable* units, not ordered units, is the point: defective
// units still cost money, so their cost lands on the units you can sell.

export interface LandedCogsInputs {
  /** Supplier price per unit, USD */
  supplierPricePerUnit: number;
  /** Units in the purchase order */
  unitsOrdered: number;
  /** Packaging, labels, inserts — per unit, USD */
  packagingPerUnit: number;
  /** Freight from supplier, whole batch, USD */
  freightBatch: number;
  /** Duties / tariffs, percent of supplier cost */
  dutyRatePct: number;
  /** Inspection, prep, customs broker and other one-off batch costs, USD */
  otherBatchCosts: number;
  /** Shipping the batch into your warehouse or FBT, USD */
  inboundToWarehouseBatch: number;
  /** Units that arrive unsellable, percent */
  defectRatePct: number;
}

export interface LandedCogsResult {
  supplierTotal: number;
  packagingTotal: number;
  dutiesTotal: number;
  batchTotal: number;
  sellableUnits: number;
  /** batchTotal ÷ sellable units. null when no units are sellable. */
  landedCogsPerUnit: number | null;
  /** How far landed COGS sits above the supplier price, percent. */
  upliftOverSupplierPct: number | null;
  /** Per-unit share of each component, for the breakdown. */
  perUnit: {
    supplier: number;
    packaging: number;
    freight: number;
    duties: number;
    other: number;
    inbound: number;
  } | null;
}

const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calcLandedCogs(input: LandedCogsInputs): LandedCogsResult {
  const price = clampNonNeg(input.supplierPricePerUnit);
  const units = clampNonNeg(input.unitsOrdered);
  const packaging = clampNonNeg(input.packagingPerUnit);
  const freight = clampNonNeg(input.freightBatch);
  const dutyRate = clampNonNeg(input.dutyRatePct) / 100;
  const other = clampNonNeg(input.otherBatchCosts);
  const inbound = clampNonNeg(input.inboundToWarehouseBatch);
  const defectRate = Math.min(clampNonNeg(input.defectRatePct), 100) / 100;

  const supplierTotal = price * units;
  const packagingTotal = packaging * units;
  const dutiesTotal = supplierTotal * dutyRate;
  const batchTotal =
    supplierTotal + packagingTotal + freight + dutiesTotal + other + inbound;
  const sellableUnits = units * (1 - defectRate);

  if (sellableUnits <= 0) {
    return {
      supplierTotal,
      packagingTotal,
      dutiesTotal,
      batchTotal,
      sellableUnits: 0,
      landedCogsPerUnit: null,
      upliftOverSupplierPct: null,
      perUnit: null,
    };
  }

  const landedCogsPerUnit = batchTotal / sellableUnits;
  return {
    supplierTotal,
    packagingTotal,
    dutiesTotal,
    batchTotal,
    sellableUnits,
    landedCogsPerUnit,
    upliftOverSupplierPct:
      price > 0 ? (landedCogsPerUnit / price - 1) * 100 : null,
    perUnit: {
      supplier: supplierTotal / sellableUnits,
      packaging: packagingTotal / sellableUnits,
      freight: freight / sellableUnits,
      duties: dutiesTotal / sellableUnits,
      other: other / sellableUnits,
      inbound: inbound / sellableUnits,
    },
  };
}
