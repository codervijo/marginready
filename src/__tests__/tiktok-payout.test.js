// Date math for the TikTok Shop payout date estimator.
import { describe, it, expect } from 'vitest';
import {
  parseIsoDate,
  addBusinessDays,
  calcPayoutTimeline,
} from '../lib/tiktok-payout.ts';

const iso = (d) => d.toISOString().slice(0, 10);

describe('parseIsoDate', () => {
  it('parses a valid date as UTC midnight', () => {
    expect(iso(parseIsoDate('2026-09-10'))).toBe('2026-09-10');
  });

  it('rejects malformed and impossible dates', () => {
    expect(parseIsoDate('')).toBeNull();
    expect(parseIsoDate('09/10/2026')).toBeNull();
    expect(parseIsoDate('2026-02-30')).toBeNull();
  });
});

describe('addBusinessDays', () => {
  it('skips the weekend', () => {
    // Fri 2026-09-11 + 1 business day → Mon 2026-09-14
    expect(iso(addBusinessDays(parseIsoDate('2026-09-11'), 1))).toBe('2026-09-14');
  });

  it('starting on a Saturday lands on Monday for +1', () => {
    expect(iso(addBusinessDays(parseIsoDate('2026-09-12'), 1))).toBe('2026-09-14');
  });
});

describe('calcPayoutTimeline', () => {
  const delivered = parseIsoDate('2026-09-10'); // Thursday

  it('initiates payout N days after delivery and releases reserve at +30', () => {
    const t = calcPayoutTimeline(delivered, 10);
    expect(iso(t.payoutInitiated)).toBe('2026-09-20'); // Sunday
    expect(iso(t.bankEarliest)).toBe('2026-09-21'); // Mon
    expect(iso(t.bankLatest)).toBe('2026-09-23'); // Wed
    expect(iso(t.reserveRelease)).toBe('2026-10-10');
    expect(t.daysToCashLatest).toBe(13);
  });

  it('clamps settlement days to the 1–31 policy range', () => {
    expect(calcPayoutTimeline(delivered, 0).settlementDays).toBe(1);
    expect(calcPayoutTimeline(delivered, 90).settlementDays).toBe(31);
    expect(calcPayoutTimeline(delivered, NaN).settlementDays).toBe(31);
  });

  it('crosses month boundaries correctly', () => {
    const t = calcPayoutTimeline(parseIsoDate('2026-01-31'), 31);
    expect(iso(t.payoutInitiated)).toBe('2026-03-03');
  });
});
