import { describe, it, expect } from 'vitest';
import { calcAffiliate } from '../lib/tiktok-affiliate';
import { calcBreakEven } from '../lib/tiktok-breakeven';

const base = {
  pricePerUnit: 30,
  sellerDiscountPerUnit: 0,
  cogsPerUnit: 9,
  fulfillmentPerUnit: 5,
  referralRatePct: 6,
  commissionRatePct: 15,
  targetMarginPct: 20,
};

// These are the worked examples printed on
// src/pages/tiktok-shop-affiliate-commission-calculator.astro. If the math
// changes, the page prose must change with it.
describe('worked examples on the page', () => {
  it('example 1: $30 product, 15% commission, no discount', () => {
    const r = calcAffiliate(base);
    expect(r.commissionPerUnit).toBeCloseTo(4.5, 2);
    expect(r.netWithoutAffiliate).toBeCloseTo(14.2, 2);
    expect(r.netWithAffiliate).toBeCloseTo(9.7, 2);
    expect(r.marginWithAffiliate * 100).toBeCloseTo(32.33, 1);
    expect(r.maxRateBreakEvenPct).toBeCloseTo(47.33, 1);
    expect(r.maxRateForTargetPct).toBeCloseTo(27.33, 1);
    expect(r.losesMoney).toBe(false);
  });

  it('example 2: a $6 seller discount shrinks the commission base and the affordable rate', () => {
    const r = calcAffiliate({ ...base, sellerDiscountPerUnit: 6 });
    expect(r.commissionBase).toBeCloseTo(24, 2);
    expect(r.commissionPerUnit).toBeCloseTo(3.6, 2);
    expect(r.referralFeePerUnit).toBeCloseTo(1.44, 2);
    expect(r.netWithAffiliate).toBeCloseTo(4.96, 2);
    expect(r.marginWithAffiliate * 100).toBeCloseTo(20.67, 1);
    expect(r.maxRateForTargetPct).toBeCloseTo(15.67, 1);
  });

  it('example 3 (failure): a $12 product cannot carry a 15% commission', () => {
    const r = calcAffiliate({ ...base, pricePerUnit: 12, cogsPerUnit: 5, fulfillmentPerUnit: 5 });
    expect(r.netWithoutAffiliate).toBeCloseTo(1.28, 2);
    expect(r.maxRateBreakEvenPct).toBeCloseTo(10.67, 1);
    expect(r.netWithAffiliate).toBeCloseTo(-0.52, 2);
    expect(r.losesMoney).toBe(true);
    expect(r.targetUnreachable).toBe(true);
  });
});

describe('calcAffiliate', () => {
  it('commission at the break-even max rate leaves zero profit', () => {
    const r0 = calcAffiliate(base);
    const r = calcAffiliate({ ...base, commissionRatePct: r0.maxRateBreakEvenPct });
    expect(r.netWithAffiliate).toBeCloseTo(0, 6);
  });

  it('commission at the target max rate leaves exactly the target margin', () => {
    const r0 = calcAffiliate(base);
    const r = calcAffiliate({ ...base, commissionRatePct: r0.maxRateForTargetPct });
    expect(r.marginWithAffiliate).toBeCloseTo(0.2, 6);
  });

  it('agrees with the break-even calculator: at the max rate, price is the break-even price', () => {
    const r0 = calcAffiliate(base);
    const be = calcBreakEven({
      cogsPerUnit: 9,
      referralRatePct: 6,
      affiliateRatePct: r0.maxRateBreakEvenPct,
      fulfillmentPerUnit: 5,
      returnRatePct: 0,
      adSpendPerUnit: 0,
      targetMarginPct: 0,
    });
    expect(be.breakEvenPrice).toBeCloseTo(30, 6);
  });

  it('handles a discount at or above the price without dividing by zero', () => {
    const r = calcAffiliate({ ...base, sellerDiscountPerUnit: 40 });
    expect(r.commissionBase).toBe(0);
    expect(r.commissionPerUnit).toBe(0);
    expect(r.marginWithAffiliate).toBeNull();
    expect(r.maxRateBreakEvenPct).toBeNull();
    expect(r.targetUnreachable).toBe(true);
    expect(r.losesMoney).toBe(true);
  });

  it('treats negative and non-finite inputs as zero', () => {
    const r = calcAffiliate({ ...base, cogsPerUnit: -5, fulfillmentPerUnit: NaN });
    expect(r.netWithoutAffiliate).toBeCloseTo(28.2, 6);
  });
});
