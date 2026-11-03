// Pure affiliate-commission math for TikTok Shop sellers.
// No hardcoded fee TABLES: every rate is a user input with a documented default.
// This is a public estimator, distinct from the app's real settled numbers.
//
// Commission base, per TikTok Shop's settlement report definition:
//   affiliate commission = (product price excl. tax − seller discount) × rate
// so the base is B = P − D. The referral fee is modeled on the same base
// (no TikTok-funded discount in this model).
//
// Per-unit net with affiliate rate a:
//   net(a) = B·(1 − r − a) − (C + F)
// Highest rate that still leaves net margin m on B:
//   aMax(m) = 1 − r − m − (C + F) / B

export interface AffiliateInputs {
  /** Product price per unit before your discount, excl. tax, USD */
  pricePerUnit: number;
  /** Seller-funded discount per unit, USD */
  sellerDiscountPerUnit: number;
  /** Product cost / COGS per unit, USD */
  cogsPerUnit: number;
  /** Shipping / fulfillment cost per unit, USD */
  fulfillmentPerUnit: number;
  /** TikTok referral fee rate, percent (US default 6) */
  referralRatePct: number;
  /** Affiliate commission rate you are considering, percent */
  commissionRatePct: number;
  /** Net margin you want to keep on an affiliate sale, percent of the commission base */
  targetMarginPct: number;
}

export interface AffiliateResult {
  /** Commission base: price − seller discount (floored at 0) */
  commissionBase: number;
  /** Commission paid per affiliate sale at the chosen rate, USD */
  commissionPerUnit: number;
  /** Referral fee per unit, USD */
  referralFeePerUnit: number;
  /** Net profit per unit with no affiliate (organic sale), USD */
  netWithoutAffiliate: number;
  /** Net profit per unit on an affiliate sale at the chosen rate, USD */
  netWithAffiliate: number;
  /** netWithAffiliate ÷ commissionBase; null when the base is 0 */
  marginWithAffiliate: number | null;
  /** Highest commission rate (percent) that still breaks even; null when the base is 0 */
  maxRateBreakEvenPct: number | null;
  /** Highest commission rate (percent) that still leaves the target margin; null when the base is 0 */
  maxRateForTargetPct: number | null;
  /** True when even 0% commission can't reach the target margin */
  targetUnreachable: boolean;
  /** True when the chosen rate loses money per affiliate sale */
  losesMoney: boolean;
}

const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calcAffiliate(input: AffiliateInputs): AffiliateResult {
  const price = clampNonNeg(input.pricePerUnit);
  const discount = clampNonNeg(input.sellerDiscountPerUnit);
  const cogs = clampNonNeg(input.cogsPerUnit);
  const fulfillment = clampNonNeg(input.fulfillmentPerUnit);
  const r = clampNonNeg(input.referralRatePct) / 100;
  const a = clampNonNeg(input.commissionRatePct) / 100;
  const m = clampNonNeg(input.targetMarginPct) / 100;

  const commissionBase = Math.max(price - discount, 0);
  const fixed = cogs + fulfillment;
  const referralFeePerUnit = commissionBase * r;
  const commissionPerUnit = commissionBase * a;
  const netWithoutAffiliate = commissionBase - referralFeePerUnit - fixed;
  const netWithAffiliate = netWithoutAffiliate - commissionPerUnit;

  const hasBase = commissionBase > 0;
  const maxRate = (target: number) =>
    hasBase ? (1 - r - target - fixed / commissionBase) * 100 : null;

  const maxRateBreakEvenPct = maxRate(0);
  const maxRateForTargetPct = maxRate(m);

  return {
    commissionBase,
    commissionPerUnit,
    referralFeePerUnit,
    netWithoutAffiliate,
    netWithAffiliate,
    marginWithAffiliate: hasBase ? netWithAffiliate / commissionBase : null,
    maxRateBreakEvenPct,
    maxRateForTargetPct,
    targetUnreachable: maxRateForTargetPct === null || maxRateForTargetPct < 0,
    losesMoney: netWithAffiliate < 0,
  };
}
