// Math correctness for the Fulfilled by TikTok (FBT) cost calculator.
import { describe, it, expect } from 'vitest';
import { calcChargeableWeight, calcFbt } from '../lib/tiktok-fbt.ts';
import { calcFees } from '../lib/tiktok-fees.ts';

describe('calcChargeableWeight', () => {
  it('uses actual weight for a small, light unit (≤2 lb and ≤332 in³)', () => {
    const r = calcChargeableWeight(0.5, 6, 4, 2); // 48 in³
    expect(r.actualWeightOnly).toBe(true);
    expect(r.chargeableLb).toBe(0.5);
    expect(r.dimWeightApplies).toBe(false);
  });

  it('treats exactly 2 lb and exactly 332 in³ as actual-weight-only', () => {
    const r = calcChargeableWeight(2, 332, 1, 1);
    expect(r.actualWeightOnly).toBe(true);
    expect(r.chargeableLb).toBe(2);
  });

  it('switches to dimensional weight when volume exceeds 332 in³', () => {
    const r = calcChargeableWeight(1, 12, 10, 6); // 720 in³ → 720/166
    expect(r.actualWeightOnly).toBe(false);
    expect(r.dimWeightLb).toBeCloseTo(720 / 166, 10);
    expect(r.chargeableLb).toBeCloseTo(720 / 166, 10);
    expect(r.dimWeightApplies).toBe(true);
  });

  it('keeps actual weight when it beats dimensional weight on a heavy unit', () => {
    const r = calcChargeableWeight(5, 8, 6, 4); // 192 in³ → 1.16 lb dim
    expect(r.actualWeightOnly).toBe(false);
    expect(r.chargeableLb).toBe(5);
    expect(r.dimWeightApplies).toBe(false);
  });

  it('ignores negative and non-finite dimensions', () => {
    const r = calcChargeableWeight(-1, NaN, 5, 5);
    expect(r.volumeIn3).toBe(0);
    expect(r.chargeableLb).toBe(0);
  });
});

const base = {
  price: 30,
  cogsPerUnit: 8,
  referralRatePct: 6,
  fbtFulfillmentPerUnit: 4,
  inboundPerUnit: 0,
  unitVolumeIn3: 0,
  daysInStorage: 0,
  storageRatePerFt3Month: 0,
  returnRatePct: 0,
  returnHandlingPerUnit: 0,
  selfShipLabelPerUnit: 0,
  selfShipPackPerUnit: 0,
};

describe('calcFbt', () => {
  it('charges no storage inside the 60-day free window', () => {
    const r = calcFbt({
      ...base,
      unitVolumeIn3: 1728,
      daysInStorage: 60,
      storageRatePerFt3Month: 1,
    });
    expect(r.storagePerUnit).toBe(0);
  });

  it('charges storage only on days beyond 60, prorated by 30-day month', () => {
    // 1 ft³ at $1/ft³/month for 90 days → 30 billable days = 1 month = $1
    const r = calcFbt({
      ...base,
      unitVolumeIn3: 1728,
      daysInStorage: 90,
      storageRatePerFt3Month: 1,
    });
    expect(r.storagePerUnit).toBeCloseTo(1, 10);
  });

  it('spreads return handling across all units by return rate', () => {
    const r = calcFbt({ ...base, returnRatePct: 10, returnHandlingPerUnit: 3 });
    expect(r.returnHandlingExpected).toBeCloseTo(0.3, 10);
  });

  it('agrees with the fee calculator when FBT cost is the only fulfillment', () => {
    const r = calcFbt({ ...base, inboundPerUnit: 0.5 });
    const f = calcFees({
      price: 30,
      units: 1,
      referralRatePct: 6,
      cogsPerUnit: 8,
      affiliateRatePct: 0,
      fulfillmentPerUnit: 4.5,
      returnRatePct: 0,
      adSpend: 0,
    });
    expect(r.netProfitFbt).toBeCloseTo(f.netProfit, 10);
    expect(r.netMarginFbtPct).toBeCloseTo(f.netMarginPct, 10);
  });

  it('reports a negative premium when FBT is cheaper than self-ship', () => {
    const r = calcFbt({
      ...base,
      selfShipLabelPerUnit: 4.5,
      selfShipPackPerUnit: 1,
    });
    expect(r.fbtPremiumPerUnit).toBeCloseTo(-1.5, 10);
    expect(r.netProfitFbt).toBeGreaterThan(r.netProfitSelfShip);
  });

  it('returns zero margins at a zero price instead of dividing by zero', () => {
    const r = calcFbt({ ...base, price: 0 });
    expect(r.netMarginFbtPct).toBe(0);
    expect(r.fbtCostPctOfPrice).toBe(0);
  });
});
