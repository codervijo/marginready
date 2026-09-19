// Math correctness for the landed-cost (COGS per unit) calculator.
import { describe, it, expect } from 'vitest';
import { calcLandedCogs } from '../lib/landed-cogs.ts';

const base = {
  supplierPricePerUnit: 4,
  unitsOrdered: 500,
  packagingPerUnit: 0,
  freightBatch: 0,
  dutyRatePct: 0,
  otherBatchCosts: 0,
  inboundToWarehouseBatch: 0,
  defectRatePct: 0,
};

describe('calcLandedCogs', () => {
  it('equals the supplier price when there are no other costs', () => {
    const r = calcLandedCogs(base);
    expect(r.landedCogsPerUnit).toBe(4);
    expect(r.upliftOverSupplierPct).toBe(0);
  });

  it('spreads batch costs across units and applies duty to supplier cost', () => {
    // 2000 supplier + 250 packaging + 400 freight + 200 duty (10%) + 150 inbound = 3000
    const r = calcLandedCogs({
      ...base,
      packagingPerUnit: 0.5,
      freightBatch: 400,
      dutyRatePct: 10,
      inboundToWarehouseBatch: 150,
    });
    expect(r.batchTotal).toBeCloseTo(3000, 10);
    expect(r.landedCogsPerUnit).toBeCloseTo(6, 10);
    expect(r.upliftOverSupplierPct).toBeCloseTo(50, 10);
  });

  it('divides by sellable units, so defects raise per-unit cost', () => {
    // 2000 over 450 sellable units
    const r = calcLandedCogs({ ...base, defectRatePct: 10 });
    expect(r.sellableUnits).toBe(450);
    expect(r.landedCogsPerUnit).toBeCloseTo(2000 / 450, 10);
  });

  it('per-unit breakdown sums to landed COGS', () => {
    const r = calcLandedCogs({
      ...base,
      packagingPerUnit: 0.3,
      freightBatch: 350,
      dutyRatePct: 25,
      otherBatchCosts: 120,
      inboundToWarehouseBatch: 90,
      defectRatePct: 3,
    });
    const p = r.perUnit;
    const sum =
      p.supplier + p.packaging + p.freight + p.duties + p.other + p.inbound;
    expect(sum).toBeCloseTo(r.landedCogsPerUnit, 10);
  });

  it('returns null when no units are sellable', () => {
    expect(calcLandedCogs({ ...base, defectRatePct: 100 }).landedCogsPerUnit).toBeNull();
    expect(calcLandedCogs({ ...base, unitsOrdered: 0 }).landedCogsPerUnit).toBeNull();
  });

  it('caps defect rate at 100% and ignores negatives', () => {
    expect(calcLandedCogs({ ...base, defectRatePct: 150 }).sellableUnits).toBe(0);
    expect(calcLandedCogs({ ...base, freightBatch: -500 }).landedCogsPerUnit).toBe(4);
  });
});
