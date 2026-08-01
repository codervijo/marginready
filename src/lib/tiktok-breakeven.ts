// Pure break-even / target-margin pricing math for TikTok Shop.
// No hardcoded fee TABLES — every rate is a user input with a sensible default.
// This is a public "what price do I need?" estimator, distinct from the app's
// real-settled numbers (which come from TikTok's Finance API, never modeled).
//
// Per-unit model:
//   net = P·(1 − r − a − q) − (F + C + A)
// where P = price, r = referral rate, a = affiliate rate, q = return rate,
// F = fulfillment/unit, C = COGS/unit, A = ad spend/unit.
//
// Solving net = 0 gives the break-even price; solving net = m·P gives the
// price needed for a target net margin m. Both are exact algebra, not
// estimates — the uncertainty lives entirely in the inputs.

export interface BreakEvenInputs {
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
  /** Ad spend allocated per unit, USD */
  adSpendPerUnit: number;
  /** Desired net margin, percent of revenue */
  targetMarginPct: number;
}

export interface BreakEvenResult {
  /**
   * Share of each revenue dollar that survives the percentage-based costs
   * (referral + affiliate + returns). The per-unit fixed costs are paid out
   * of this. 0.94 means 94 cents of every dollar is left before fixed costs.
   */
  rateSurvivalFactor: number;
  /** Fixed per-unit costs: COGS + fulfillment + ad spend */
  fixedCostPerUnit: number;
  /**
   * Price at which net profit is exactly zero, USD.
   * null when percentage costs alone consume ≥100% of revenue — no price works.
   */
  breakEvenPrice: number | null;
  /**
   * Price needed to hit `targetMarginPct`, USD.
   * null when the target margin is unreachable at any price.
   */
  targetPrice: number | null;
  /** breakEvenPrice ÷ cogsPerUnit — the markup multiple just to not lose money */
  breakEvenMarkupMultiple: number | null;
  /** targetPrice ÷ cogsPerUnit */
  targetMarkupMultiple: number | null;
  /** True when percentage costs alone eat ≥100% of revenue */
  impossibleAtAnyPrice: boolean;
  /** True when the target margin exceeds what the cost structure can ever yield */
  targetUnreachable: boolean;
}

const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calcBreakEven(input: BreakEvenInputs): BreakEvenResult {
  const cogsPerUnit = clampNonNeg(input.cogsPerUnit);
  const referralRate = clampNonNeg(input.referralRatePct) / 100;
  const affiliateRate = clampNonNeg(input.affiliateRatePct) / 100;
  const fulfillmentPerUnit = clampNonNeg(input.fulfillmentPerUnit);
  const returnRate = clampNonNeg(input.returnRatePct) / 100;
  const adSpendPerUnit = clampNonNeg(input.adSpendPerUnit);
  const targetMargin = clampNonNeg(input.targetMarginPct) / 100;

  const rateSurvivalFactor = 1 - referralRate - affiliateRate - returnRate;
  const fixedCostPerUnit = cogsPerUnit + fulfillmentPerUnit + adSpendPerUnit;

  const impossibleAtAnyPrice = rateSurvivalFactor <= 0;
  const targetDenominator = rateSurvivalFactor - targetMargin;
  const targetUnreachable = targetDenominator <= 0;

  const breakEvenPrice = impossibleAtAnyPrice
    ? null
    : fixedCostPerUnit / rateSurvivalFactor;

  const targetPrice = targetUnreachable
    ? null
    : fixedCostPerUnit / targetDenominator;

  const markup = (price: number | null) =>
    price !== null && cogsPerUnit > 0 ? price / cogsPerUnit : null;

  return {
    rateSurvivalFactor,
    fixedCostPerUnit,
    breakEvenPrice,
    targetPrice,
    breakEvenMarkupMultiple: markup(breakEvenPrice),
    targetMarkupMultiple: markup(targetPrice),
    impossibleAtAnyPrice,
    targetUnreachable,
  };
}
