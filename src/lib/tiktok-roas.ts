// Pure break-even ROAS math for TikTok Shop ads.
// No hardcoded fee TABLES — every rate is a user input with a sensible default.
//
// Contribution margin rate (cr) is the share of each revenue dollar left after
// every NON-ad cost:
//   cr = (1 − r − a − q) − (C + F) / P
//
// Ads are then paid out of that. With ad spend = revenue ÷ ROAS:
//   net margin  m = cr − 1/ROAS
// Rearranged:
//   break-even ROAS       = 1 / cr           (the m = 0 case)
//   ROAS for target margin = 1 / (cr − m)
//   net margin at a given ROAS = cr − 1/ROAS
//
// All four are the same identity rearranged — exact algebra, not estimates.
// Max CPA follows directly: the most you can pay to acquire one order is the
// contribution that order generates.

export interface RoasInputs {
  /** Selling price per unit, USD */
  price: number;
  /** Product cost / COGS per unit, USD */
  cogsPerUnit: number;
  /** TikTok referral fee rate, percent (US default 6) */
  referralRatePct: number;
  /** Affiliate / creator commission rate, percent */
  affiliateRatePct: number;
  /** Fulfillment cost per unit, USD */
  fulfillmentPerUnit: number;
  /** Return rate, percent of revenue refunded */
  returnRatePct: number;
  /** Desired net margin after ads, percent of revenue */
  targetMarginPct: number;
  /** The ROAS you are actually getting today, for comparison */
  currentRoas: number;
}

export interface RoasResult {
  /** Contribution margin per unit before ad spend, USD */
  contributionPerUnit: number;
  /** Contribution per unit as a share of price (0–1) */
  contributionRate: number;
  /**
   * ROAS at which net profit is exactly zero.
   * null when contribution is ≤0 — ads can never pay back.
   */
  breakEvenRoas: number | null;
  /**
   * ROAS needed to hit `targetMarginPct`.
   * null when the target margin exceeds the contribution rate.
   */
  targetRoas: number | null;
  /** Most you can pay to acquire one order and still break even, USD */
  maxCpaBreakEven: number | null;
  /** Most you can pay per order while still hitting the target margin, USD */
  maxCpaAtTarget: number | null;
  /** Net margin (percent) implied by `currentRoas`, given this cost structure */
  netMarginAtCurrentRoas: number | null;
  /** True when the current ROAS clears break-even */
  currentRoasProfitable: boolean;
  /** True when contribution is ≤0 — the unit loses money before a cent of ads */
  unprofitableBeforeAds: boolean;
  /** True when the target margin is unreachable at any ROAS */
  targetUnreachable: boolean;
}

const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calcRoas(input: RoasInputs): RoasResult {
  const price = clampNonNeg(input.price);
  const cogsPerUnit = clampNonNeg(input.cogsPerUnit);
  const referralRate = clampNonNeg(input.referralRatePct) / 100;
  const affiliateRate = clampNonNeg(input.affiliateRatePct) / 100;
  const fulfillmentPerUnit = clampNonNeg(input.fulfillmentPerUnit);
  const returnRate = clampNonNeg(input.returnRatePct) / 100;
  const targetMargin = clampNonNeg(input.targetMarginPct) / 100;
  const currentRoas = clampNonNeg(input.currentRoas);

  const rateCosts = price * (referralRate + affiliateRate + returnRate);
  const contributionPerUnit =
    price - rateCosts - cogsPerUnit - fulfillmentPerUnit;
  const contributionRate = price > 0 ? contributionPerUnit / price : 0;

  const unprofitableBeforeAds = contributionRate <= 0;
  const targetDenominator = contributionRate - targetMargin;
  const targetUnreachable = targetDenominator <= 0;

  const breakEvenRoas = unprofitableBeforeAds ? null : 1 / contributionRate;
  const targetRoas = targetUnreachable ? null : 1 / targetDenominator;

  const maxCpaBreakEven = unprofitableBeforeAds ? null : contributionPerUnit;
  const maxCpaAtTarget = targetUnreachable
    ? null
    : contributionPerUnit - targetMargin * price;

  const netMarginAtCurrentRoas =
    currentRoas > 0 ? (contributionRate - 1 / currentRoas) * 100 : null;

  const currentRoasProfitable =
    netMarginAtCurrentRoas !== null && netMarginAtCurrentRoas > 0;

  return {
    contributionPerUnit,
    contributionRate,
    breakEvenRoas,
    targetRoas,
    maxCpaBreakEven,
    maxCpaAtTarget,
    netMarginAtCurrentRoas,
    currentRoasProfitable,
    unprofitableBeforeAds,
    targetUnreachable,
  };
}
