// Math correctness for the TikTok Shop fee calculator.
import { describe, it, expect } from 'vitest';
import { calcFees } from '../lib/tiktok-fees.ts';

const base = {
  price: 0,
  units: 0,
  referralRatePct: 6,
  cogsPerUnit: 0,
  affiliateRatePct: 0,
  fulfillmentPerUnit: 0,
  returnRatePct: 0,
  adSpend: 0,
};

describe('calcFees', () => {
  it('matches the spec test case ($50 × 100, 6% referral, $15 COGS)', () => {
    const r = calcFees({ ...base, price: 50, units: 100, cogsPerUnit: 15 });
    expect(r.totalRevenue).toBe(5000);
    expect(r.totalReferralFee).toBe(300);
    expect(r.totalCogs).toBe(1500);
    expect(r.netProfit).toBe(3200);
    expect(r.netMarginPct).toBeCloseTo(64, 6);
  });

  it('effective take = referral + affiliate + fulfillment + ads over revenue', () => {
    const r = calcFees({
      ...base,
      price: 50,
      units: 100,
      cogsPerUnit: 15,
      affiliateRatePct: 20,
      fulfillmentPerUnit: 3,
      adSpend: 200,
    });
    // referral 300 + affiliate 1000 + fulfillment 300 + ads 200 = 1800 / 5000
    expect(r.effectiveTakePct).toBeCloseTo(36, 6);
    // COGS is excluded from "take"
    expect(r.netProfit).toBeCloseTo(5000 - 1800 - 1500, 6);
  });

  it('applies returns as revenue refunded', () => {
    const r = calcFees({ ...base, price: 50, units: 100, returnRatePct: 10 });
    expect(r.estimatedReturnsCost).toBe(500);
  });

  it('handles empty / zero-revenue inputs without NaN', () => {
    const r = calcFees(base);
    expect(r.netProfit).toBe(0);
    expect(r.netMarginPct).toBe(0);
    expect(r.effectiveTakePct).toBe(0);
  });

  it('ignores negative garbage inputs (clamps to 0)', () => {
    const r = calcFees({ ...base, price: -5, units: 10, cogsPerUnit: -3 });
    expect(r.totalRevenue).toBe(0);
    expect(r.netProfit).toBe(0);
  });
});
