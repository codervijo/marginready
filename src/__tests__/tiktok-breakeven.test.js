// Math correctness for the TikTok Shop break-even price calculator.
import { describe, it, expect } from 'vitest';
import { calcBreakEven } from '../lib/tiktok-breakeven.ts';
import { calcFees } from '../lib/tiktok-fees.ts';

const base = {
  cogsPerUnit: 0,
  referralRatePct: 6,
  affiliateRatePct: 0,
  fulfillmentPerUnit: 0,
  returnRatePct: 0,
  adSpendPerUnit: 0,
  targetMarginPct: 0,
};

describe('calcBreakEven', () => {
  it('breaks even at COGS ÷ (1 − referral) with no other costs', () => {
    const r = calcBreakEven({ ...base, cogsPerUnit: 15 });
    // 15 / 0.94 = 15.95744680851...
    expect(r.breakEvenPrice).toBeCloseTo(15 / 0.94, 10);
    expect(r.rateSurvivalFactor).toBeCloseTo(0.94, 10);
    expect(r.fixedCostPerUnit).toBe(15);
  });

  it('rolls COGS, fulfillment and ad spend into one fixed cost', () => {
    const r = calcBreakEven({
      ...base,
      cogsPerUnit: 15,
      fulfillmentPerUnit: 3.58,
      adSpendPerUnit: 4,
    });
    expect(r.fixedCostPerUnit).toBeCloseTo(22.58, 10);
    expect(r.breakEvenPrice).toBeCloseTo(22.58 / 0.94, 10);
  });

  it('stacks referral, affiliate and return rates into the survival factor', () => {
    const r = calcBreakEven({
      ...base,
      cogsPerUnit: 20,
      affiliateRatePct: 20,
      returnRatePct: 5,
    });
    // 1 − 0.06 − 0.20 − 0.05 = 0.69
    expect(r.rateSurvivalFactor).toBeCloseTo(0.69, 10);
    expect(r.breakEvenPrice).toBeCloseTo(20 / 0.69, 10);
  });

  it('agrees with calcFees — net profit is ~0 at the break-even price', () => {
    const inputs = {
      ...base,
      cogsPerUnit: 18,
      affiliateRatePct: 15,
      fulfillmentPerUnit: 3.58,
      returnRatePct: 4,
    };
    const { breakEvenPrice } = calcBreakEven(inputs);
    const fees = calcFees({
      price: breakEvenPrice,
      units: 1,
      referralRatePct: inputs.referralRatePct,
      cogsPerUnit: inputs.cogsPerUnit,
      affiliateRatePct: inputs.affiliateRatePct,
      fulfillmentPerUnit: inputs.fulfillmentPerUnit,
      returnRatePct: inputs.returnRatePct,
      adSpend: 0,
    });
    expect(fees.netProfit).toBeCloseTo(0, 9);
  });

  it('agrees with calcFees — target price yields the requested net margin', () => {
    const inputs = {
      ...base,
      cogsPerUnit: 18,
      affiliateRatePct: 10,
      fulfillmentPerUnit: 3,
      returnRatePct: 3,
      targetMarginPct: 25,
    };
    const { targetPrice } = calcBreakEven(inputs);
    const fees = calcFees({
      price: targetPrice,
      units: 1,
      referralRatePct: inputs.referralRatePct,
      cogsPerUnit: inputs.cogsPerUnit,
      affiliateRatePct: inputs.affiliateRatePct,
      fulfillmentPerUnit: inputs.fulfillmentPerUnit,
      returnRatePct: inputs.returnRatePct,
      adSpend: 0,
    });
    expect(fees.netMarginPct).toBeCloseTo(25, 9);
  });

  it('reports the markup multiple over COGS', () => {
    const r = calcBreakEven({ ...base, cogsPerUnit: 10 });
    expect(r.breakEvenMarkupMultiple).toBeCloseTo(1 / 0.94, 10);
  });

  it('returns null markup when COGS is zero (no divide-by-zero)', () => {
    const r = calcBreakEven({ ...base, cogsPerUnit: 0, fulfillmentPerUnit: 5 });
    expect(r.breakEvenMarkupMultiple).toBeNull();
    expect(r.breakEvenPrice).toBeCloseTo(5 / 0.94, 10);
  });

  it('flags impossible when percentage costs alone reach 100% of revenue', () => {
    const r = calcBreakEven({
      ...base,
      cogsPerUnit: 10,
      affiliateRatePct: 90,
      returnRatePct: 10,
    });
    expect(r.impossibleAtAnyPrice).toBe(true);
    expect(r.breakEvenPrice).toBeNull();
    expect(r.targetPrice).toBeNull();
  });

  it('flags an unreachable target margin without killing break-even', () => {
    const r = calcBreakEven({
      ...base,
      cogsPerUnit: 10,
      affiliateRatePct: 20,
      targetMarginPct: 80,
    });
    // survival 0.74 < target 0.80
    expect(r.targetUnreachable).toBe(true);
    expect(r.targetPrice).toBeNull();
    expect(r.impossibleAtAnyPrice).toBe(false);
    expect(r.breakEvenPrice).toBeCloseTo(10 / 0.74, 10);
  });

  it('treats negative and non-finite inputs as zero', () => {
    const r = calcBreakEven({
      ...base,
      cogsPerUnit: -5,
      fulfillmentPerUnit: Number.NaN,
      adSpendPerUnit: 7,
    });
    expect(r.fixedCostPerUnit).toBe(7);
  });
});
