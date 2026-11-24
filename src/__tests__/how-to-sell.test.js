import { describe, it, expect } from 'vitest';
import { calcFees } from '../lib/tiktok-fees';

const one = {
  units: 1,
  referralRatePct: 6,
  affiliateRatePct: 0,
  returnRatePct: 0,
  adSpend: 0,
};

// These are the worked examples printed on
// src/pages/how-to-sell-on-tiktok-shop.astro. If the math changes, the page
// prose must change with it.
describe('worked examples on the beginner seller page', () => {
  it('example 1: $25 product promoted yourself', () => {
    const r = calcFees({ ...one, price: 25, cogsPerUnit: 8, fulfillmentPerUnit: 5 });
    expect(r.totalReferralFee).toBeCloseTo(1.5, 2);
    expect(r.netProfit).toBeCloseTo(10.5, 2);
    expect(r.netMarginPct).toBeCloseTo(42, 1);
  });

  it('example 2: same product with a 15% creator commission and $3 ads', () => {
    const r = calcFees({
      ...one,
      price: 25,
      cogsPerUnit: 8,
      fulfillmentPerUnit: 5,
      affiliateRatePct: 15,
      adSpend: 3,
    });
    expect(r.totalAffiliate).toBeCloseTo(3.75, 2);
    expect(r.netProfit).toBeCloseTo(3.75, 2);
    expect(r.netMarginPct).toBeCloseTo(15, 1);
  });

  it('example 3 (failure): $12 product loses money with a 10% commission and 5% returns', () => {
    const base = { ...one, price: 12, cogsPerUnit: 5, fulfillmentPerUnit: 5 };
    const r = calcFees(base);
    expect(r.totalReferralFee).toBeCloseTo(0.72, 2);
    expect(r.netProfit).toBeCloseTo(1.28, 2);
    expect(r.netMarginPct).toBeCloseTo(10.67, 1);
    const worse = calcFees({ ...base, affiliateRatePct: 10, returnRatePct: 5 });
    expect(worse.totalAffiliate).toBeCloseTo(1.2, 2);
    expect(worse.estimatedReturnsCost).toBeCloseTo(0.6, 2);
    expect(worse.netProfit).toBeCloseTo(-0.52, 2);
  });
});
