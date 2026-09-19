// Pure Fulfilled by TikTok (FBT) cost math.
// No hardcoded fee TABLES — TikTok revises the FBT rate card several times a
// year and publishes it as images, so every dollar rate is a user input read
// off the seller's current rate card. Only the *rules* TikTok states in text
// are encoded here:
//
//   Chargeable weight (FBT Rate Card & FAQ, effective May 1, 2026):
//     if actual ≤ 2 lb AND L×W×H ≤ 332 in³ → actual weight
//     else → max(actual weight, L×W×H ÷ 166)
//
//   Storage: first 60 days free per inbound shipment; after that, charged on
//   cubic feet (1 ft³ = 1728 in³).

/** Actual-weight-only threshold, lb. */
export const ACTUAL_WEIGHT_MAX_LB = 2;
/** Actual-weight-only volume threshold, cubic inches. */
export const ACTUAL_WEIGHT_MAX_IN3 = 332;
/** Dimensional-weight divisor, inches. */
export const DIM_DIVISOR = 166;
/** Free storage window per inbound shipment, days. */
export const FREE_STORAGE_DAYS = 60;

const CUBIC_INCHES_PER_FT3 = 1728;
const DAYS_PER_MONTH = 30;

export interface ChargeableWeight {
  volumeIn3: number;
  dimWeightLb: number;
  /** True when TikTok bills on actual weight alone (small and light). */
  actualWeightOnly: boolean;
  chargeableLb: number;
  /** True when dimensional weight exceeds actual and sets the charge. */
  dimWeightApplies: boolean;
}

const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calcChargeableWeight(
  actualLb: number,
  lengthIn: number,
  widthIn: number,
  heightIn: number,
): ChargeableWeight {
  const actual = clampNonNeg(actualLb);
  const volumeIn3 =
    clampNonNeg(lengthIn) * clampNonNeg(widthIn) * clampNonNeg(heightIn);
  const dimWeightLb = volumeIn3 / DIM_DIVISOR;
  const actualWeightOnly =
    actual <= ACTUAL_WEIGHT_MAX_LB && volumeIn3 <= ACTUAL_WEIGHT_MAX_IN3;
  const chargeableLb = actualWeightOnly ? actual : Math.max(actual, dimWeightLb);
  return {
    volumeIn3,
    dimWeightLb,
    actualWeightOnly,
    chargeableLb,
    dimWeightApplies: !actualWeightOnly && dimWeightLb > actual,
  };
}

export interface FbtInputs {
  /** Selling price per unit, USD */
  price: number;
  /** Product cost / COGS per unit, USD */
  cogsPerUnit: number;
  /** TikTok referral fee rate, percent */
  referralRatePct: number;
  /** FBT fulfillment fee per unit from the rate card, USD */
  fbtFulfillmentPerUnit: number;
  /** Cost to get one unit into the FBT warehouse (inbound freight ÷ units), USD */
  inboundPerUnit: number;
  /** Unit volume, cubic inches (from calcChargeableWeight) */
  unitVolumeIn3: number;
  /** Average days a unit sits in the FBT warehouse before it sells */
  daysInStorage: number;
  /** Storage rate from the rate card, USD per cubic foot per month */
  storageRatePerFt3Month: number;
  /** Share of units returned, percent */
  returnRatePct: number;
  /** FBT return handling fee per returned unit, USD */
  returnHandlingPerUnit: number;
  /** Self-ship comparison: label cost per unit, USD */
  selfShipLabelPerUnit: number;
  /** Self-ship comparison: packaging + labor per unit, USD */
  selfShipPackPerUnit: number;
}

export interface FbtResult {
  referralFee: number;
  /** Storage cost per unit after the free window, USD */
  storagePerUnit: number;
  /** Expected return-handling cost per unit sold (fee × return rate), USD */
  returnHandlingExpected: number;
  /** All FBT-related logistics cost per unit: inbound + fulfillment + storage + returns handling */
  fbtCostPerUnit: number;
  /** Self-ship logistics cost per unit: label + pack */
  selfShipCostPerUnit: number;
  /** fbtCostPerUnit − selfShipCostPerUnit. Negative = FBT is cheaper. */
  fbtPremiumPerUnit: number;
  netProfitFbt: number;
  netProfitSelfShip: number;
  netMarginFbtPct: number;
  netMarginSelfShipPct: number;
  /** FBT logistics cost as % of price */
  fbtCostPctOfPrice: number;
}

export function calcFbt(input: FbtInputs): FbtResult {
  const price = clampNonNeg(input.price);
  const cogs = clampNonNeg(input.cogsPerUnit);
  const referralRate = clampNonNeg(input.referralRatePct) / 100;
  const fulfillment = clampNonNeg(input.fbtFulfillmentPerUnit);
  const inbound = clampNonNeg(input.inboundPerUnit);
  const volumeFt3 = clampNonNeg(input.unitVolumeIn3) / CUBIC_INCHES_PER_FT3;
  const billableDays = Math.max(
    0,
    clampNonNeg(input.daysInStorage) - FREE_STORAGE_DAYS,
  );
  const storageRate = clampNonNeg(input.storageRatePerFt3Month);
  const returnRate = clampNonNeg(input.returnRatePct) / 100;
  const returnHandling = clampNonNeg(input.returnHandlingPerUnit);

  const referralFee = price * referralRate;
  const storagePerUnit =
    volumeFt3 * storageRate * (billableDays / DAYS_PER_MONTH);
  const returnHandlingExpected = returnHandling * returnRate;
  const fbtCostPerUnit =
    inbound + fulfillment + storagePerUnit + returnHandlingExpected;
  const selfShipCostPerUnit =
    clampNonNeg(input.selfShipLabelPerUnit) +
    clampNonNeg(input.selfShipPackPerUnit);

  const netProfitFbt = price - referralFee - cogs - fbtCostPerUnit;
  const netProfitSelfShip = price - referralFee - cogs - selfShipCostPerUnit;
  const pct = (n: number) => (price > 0 ? (n / price) * 100 : 0);

  return {
    referralFee,
    storagePerUnit,
    returnHandlingExpected,
    fbtCostPerUnit,
    selfShipCostPerUnit,
    fbtPremiumPerUnit: fbtCostPerUnit - selfShipCostPerUnit,
    netProfitFbt,
    netProfitSelfShip,
    netMarginFbtPct: pct(netProfitFbt),
    netMarginSelfShipPct: pct(netProfitSelfShip),
    fbtCostPctOfPrice: pct(fbtCostPerUnit),
  };
}
