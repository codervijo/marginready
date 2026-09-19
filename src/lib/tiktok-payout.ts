// Pure TikTok Shop payout-timing math. Every rule here is from Seller Center:
//   - payout is initiated 1–31 days after the order's delivery date, the exact
//     number depending on the shop's settlement tier (seller reads it from
//     Seller Center — TikTok publishes no per-tier day counts)
//   - bank processing typically adds 1–3 business days after initiation
//   - a reserve slice is held 30 days from the delivery date
// Dates are handled as UTC calendar dates (YYYY-MM-DD) so the result never
// shifts with the viewer's timezone. Bank holidays are not modelled.

export const MIN_SETTLEMENT_DAYS = 1;
export const MAX_SETTLEMENT_DAYS = 31;
export const RESERVE_DAYS = 30;
export const BANK_DAYS_MIN = 1;
export const BANK_DAYS_MAX = 3;

const DAY_MS = 86_400_000;

/** Parse "YYYY-MM-DD" to a UTC-midnight Date, or null if invalid. */
export function parseIsoDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCMonth() === +m[2] - 1 ? d : null;
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY_MS);
}

/** Add n business days (Mon–Fri), skipping weekends. */
export function addBusinessDays(d: Date, n: number): Date {
  let out = d;
  let left = n;
  while (left > 0) {
    out = addDays(out, 1);
    const dow = out.getUTCDay();
    if (dow !== 0 && dow !== 6) left--;
  }
  return out;
}

export interface PayoutTimeline {
  /** Settlement days actually used, clamped to 1–31 */
  settlementDays: number;
  /** Date TikTok initiates the payout */
  payoutInitiated: Date;
  /** Earliest / latest date the money typically reaches the bank */
  bankEarliest: Date;
  bankLatest: Date;
  /** Date the reserve held against the order is released */
  reserveRelease: Date;
  /** Days from delivery to the latest typical bank arrival */
  daysToCashLatest: number;
}

export function calcPayoutTimeline(
  delivered: Date,
  settlementDays: number,
): PayoutTimeline {
  const days = Math.min(
    MAX_SETTLEMENT_DAYS,
    Math.max(MIN_SETTLEMENT_DAYS, Math.round(Number.isFinite(settlementDays) ? settlementDays : MAX_SETTLEMENT_DAYS)),
  );
  const payoutInitiated = addDays(delivered, days);
  const bankEarliest = addBusinessDays(payoutInitiated, BANK_DAYS_MIN);
  const bankLatest = addBusinessDays(payoutInitiated, BANK_DAYS_MAX);
  return {
    settlementDays: days,
    payoutInitiated,
    bankEarliest,
    bankLatest,
    reserveRelease: addDays(delivered, RESERVE_DAYS),
    daysToCashLatest: Math.round((bankLatest.getTime() - delivered.getTime()) / DAY_MS),
  };
}
