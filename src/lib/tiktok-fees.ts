// Pure, framework-agnostic TikTok Shop fee & profit math.
// No hardcoded fee TABLES — the rates are user inputs with sensible defaults.
// This is a public "what-if" estimator, distinct from the app's real-settled
// numbers (which come from TikTok's Finance API, never modeled).

export interface FeeInputs {
  /** Selling price per unit, USD */
  price: number;
  /** Units sold */
  units: number;
  /** TikTok referral fee rate, percent (US default 6) */
  referralRatePct: number;
  /** Product cost / COGS per unit, USD */
  cogsPerUnit: number;
  /** Affiliate / creator commission rate, percent */
  affiliateRatePct: number;
  /** Fulfillment cost per unit, USD */
  fulfillmentPerUnit: number;
  /** Return rate, percent of revenue refunded */
  returnRatePct: number;
  /** Total ad spend, USD */
  adSpend: number;
}

export interface FeeResult {
  totalRevenue: number;
  totalReferralFee: number;
  totalAffiliate: number;
  totalFulfillment: number;
  totalCogs: number;
  estimatedReturnsCost: number;
  adSpend: number;
  netProfit: number;
  /** Net profit as % of revenue */
  netMarginPct: number;
  /**
   * "TikTok's effective take" as % of revenue: referral + affiliate +
   * fulfillment + ads (the selling-channel costs), excluding your own COGS.
   * This is the "how much does TikTok Shop take?" answer.
   */
  effectiveTakePct: number;
}

const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calcFees(input: FeeInputs): FeeResult {
  const price = clampNonNeg(input.price);
  const units = clampNonNeg(input.units);
  const referralRate = clampNonNeg(input.referralRatePct) / 100;
  const cogsPerUnit = clampNonNeg(input.cogsPerUnit);
  const affiliateRate = clampNonNeg(input.affiliateRatePct) / 100;
  const fulfillmentPerUnit = clampNonNeg(input.fulfillmentPerUnit);
  const returnRate = clampNonNeg(input.returnRatePct) / 100;
  const adSpend = clampNonNeg(input.adSpend);

  const totalRevenue = price * units;

  // Referral fee applies to order value (selling price). US structure folds
  // payment processing into this fee — so no separate processing line.
  const totalReferralFee = totalRevenue * referralRate;
  const totalAffiliate = totalRevenue * affiliateRate;
  const totalFulfillment = fulfillmentPerUnit * units;
  const totalCogs = cogsPerUnit * units;

  // Conservative returns model: revenue refunded on returned orders, assuming
  // product & shipping are NOT recovered. Simple, transparent worst case.
  const estimatedReturnsCost = totalRevenue * returnRate;

  const netProfit =
    totalRevenue -
    totalReferralFee -
    totalAffiliate -
    totalFulfillment -
    totalCogs -
    estimatedReturnsCost -
    adSpend;

  const netMarginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const effectiveTakePct =
    totalRevenue > 0
      ? ((totalReferralFee + totalAffiliate + totalFulfillment + adSpend) /
          totalRevenue) *
        100
      : 0;

  return {
    totalRevenue,
    totalReferralFee,
    totalAffiliate,
    totalFulfillment,
    totalCogs,
    estimatedReturnsCost,
    adSpend,
    netProfit,
    netMarginPct,
    effectiveTakePct,
  };
}
