// Math correctness for the TikTok Shop break-even ROAS calculator.
import { describe, it, expect } from 'vitest';
import { calcRoas } from '../lib/tiktok-roas.ts';
import { calcFees } from '../lib/tiktok-fees.ts';

const base = {
  price: 0,
  cogsPerUnit: 0,
  referralRatePct: 6,
  affiliateRatePct: 0,
  fulfillmentPerUnit: 0,
  returnRatePct: 0,
  targetMarginPct: 0,
  currentRoas: 0,
};

describe('calcRoas', () => {
  it('computes contribution per unit after every non-ad cost', () => {
    const r = calcRoas({ ...base, price: 50, cogsPerUnit: 15 });
    // 50 − 3 referral − 15 COGS = 32
    expect(r.contributionPerUnit).toBeCloseTo(32, 10);
    expect(r.contributionRate).toBeCloseTo(0.64, 10);
  });

  it('break-even ROAS is 1 ÷ contribution rate', () => {
    const r = calcRoas({ ...base, price: 50, cogsPerUnit: 15 });
    expect(r.breakEvenRoas).toBeCloseTo(1 / 0.64, 10);
  });

  it('a 50% contribution rate needs 2.0x ROAS to break even', () => {
    // Choose costs so contribution is exactly half of price.
    const r = calcRoas({ ...base, price: 100, cogsPerUnit: 44, referralRatePct: 6 });
    expect(r.contributionRate).toBeCloseTo(0.5, 10);
    expect(r.breakEvenRoas).toBeCloseTo(2, 10);
  });

  it('agrees with calcFees — net profit is ~0 at the break-even ROAS', () => {
    const inputs = {
      ...base,
      price: 50,
      cogsPerUnit: 15,
      affiliateRatePct: 10,
      fulfillmentPerUnit: 3.58,
      returnRatePct: 4,
    };
    const { breakEvenRoas } = calcRoas(inputs);
    const units = 100;
    const revenue = inputs.price * units;
    const fees = calcFees({
      price: inputs.price,
      units,
      referralRatePct: inputs.referralRatePct,
      cogsPerUnit: inputs.cogsPerUnit,
      affiliateRatePct: inputs.affiliateRatePct,
      fulfillmentPerUnit: inputs.fulfillmentPerUnit,
      returnRatePct: inputs.returnRatePct,
      adSpend: revenue / breakEvenRoas,
    });
    expect(fees.netProfit).toBeCloseTo(0, 9);
  });

  it('agrees with calcFees — target ROAS yields the requested net margin', () => {
    const inputs = {
      ...base,
      price: 40,
      cogsPerUnit: 12,
      affiliateRatePct: 15,
      fulfillmentPerUnit: 3,
      returnRatePct: 5,
      targetMarginPct: 15,
    };
    const { targetRoas } = calcRoas(inputs);
    const units = 250;
    const revenue = inputs.price * units;
    const fees = calcFees({
      price: inputs.price,
      units,
      referralRatePct: inputs.referralRatePct,
      cogsPerUnit: inputs.cogsPerUnit,
      affiliateRatePct: inputs.affiliateRatePct,
      fulfillmentPerUnit: inputs.fulfillmentPerUnit,
      returnRatePct: inputs.returnRatePct,
      adSpend: revenue / targetRoas,
    });
    expect(fees.netMarginPct).toBeCloseTo(15, 9);
  });

  it('max CPA at break-even equals contribution per unit', () => {
    const r = calcRoas({ ...base, price: 50, cogsPerUnit: 15 });
    expect(r.maxCpaBreakEven).toBeCloseTo(32, 10);
  });

  it('max CPA at target leaves the target margin on the table', () => {
    const r = calcRoas({
      ...base,
      price: 50,
      cogsPerUnit: 15,
      targetMarginPct: 20,
    });
    // 32 contribution − 20% × $50 = 32 − 10 = 22
    expect(r.maxCpaAtTarget).toBeCloseTo(22, 10);
  });

  it('derives net margin from the ROAS you are actually getting', () => {
    const r = calcRoas({
      ...base,
      price: 50,
      cogsPerUnit: 15,
      currentRoas: 4,
    });
    // 64% contribution − 25% ad cost = 39%
    expect(r.netMarginAtCurrentRoas).toBeCloseTo(39, 9);
    expect(r.currentRoasProfitable).toBe(true);
  });

  it('flags a current ROAS below break-even as unprofitable', () => {
    const r = calcRoas({
      ...base,
      price: 50,
      cogsPerUnit: 15,
      currentRoas: 1.2,
    });
    expect(r.netMarginAtCurrentRoas).toBeLessThan(0);
    expect(r.currentRoasProfitable).toBe(false);
  });

  it('flags units that lose money before a cent of ad spend', () => {
    const r = calcRoas({ ...base, price: 20, cogsPerUnit: 25 });
    expect(r.unprofitableBeforeAds).toBe(true);
    expect(r.breakEvenRoas).toBeNull();
    expect(r.maxCpaBreakEven).toBeNull();
  });

  it('flags a target margin above the contribution rate as unreachable', () => {
    const r = calcRoas({
      ...base,
      price: 50,
      cogsPerUnit: 15,
      targetMarginPct: 70,
    });
    // contribution rate 64% < 70% target
    expect(r.targetUnreachable).toBe(true);
    expect(r.targetRoas).toBeNull();
    expect(r.breakEvenRoas).not.toBeNull();
  });

  it('returns null net margin when no current ROAS is given', () => {
    const r = calcRoas({ ...base, price: 50, cogsPerUnit: 15 });
    expect(r.netMarginAtCurrentRoas).toBeNull();
    expect(r.currentRoasProfitable).toBe(false);
  });

  it('handles a zero price without dividing by zero', () => {
    const r = calcRoas({ ...base, price: 0, cogsPerUnit: 10 });
    expect(r.contributionRate).toBe(0);
    expect(r.unprofitableBeforeAds).toBe(true);
  });
});
