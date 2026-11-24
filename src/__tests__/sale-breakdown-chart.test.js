import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import {
  saleBreakdownBars,
  renderSaleBreakdownSvg,
  chartAltText,
  INPUTS,
  CHART_PNG_PATH,
} from '../lib/sale-breakdown-chart';

const read = (...p) => readFileSync(join(process.cwd(), ...p));

describe('v1.N sale breakdown chart', () => {
  const [own, creator] = saleBreakdownBars();
  const total = (b) => b.segments.reduce((s, x) => s + x.amount, 0);

  it('each bar splits exactly the $25 sale', () => {
    expect(total(own)).toBeCloseTo(INPUTS.price, 6);
    expect(total(creator)).toBeCloseTo(INPUTS.price, 6);
  });

  // Same numbers as the v1.M worked examples 1 and 2 (how-to-sell.test.js).
  it('matches the worked examples printed on the page', () => {
    expect(own.kept).toBeCloseTo(10.5, 2);
    expect(own.keptPct).toBeCloseTo(42, 1);
    expect(creator.kept).toBeCloseTo(3.75, 2);
    expect(creator.keptPct).toBeCloseTo(15, 1);
    const amt = (b, k) => b.segments.find((s) => s.key === k).amount;
    expect(amt(own, 'referral')).toBeCloseTo(1.5, 2);
    expect(amt(creator, 'creator')).toBeCloseTo(3.75, 2);
    expect(amt(creator, 'ads')).toBeCloseTo(3, 2);
  });

  it('alt text states the same numbers', () => {
    const alt = chartAltText();
    for (const s of ['$1.50', '$8.00', '$5.00', '$10.50', '$3.75', '42%', '15%']) {
      expect(alt).toContain(s);
    }
  });

  // The PNG is committed (rendered with real fonts, see
  // scripts/render-sale-breakdown-png.mjs). Its .sha256 is the hash of the SVG
  // it was rendered from, so a chart change without a re-render fails here.
  it('committed PNG was rendered from the current SVG', () => {
    const svgHash = createHash('sha256').update(renderSaleBreakdownSvg()).digest('hex');
    const stored = read('src', 'lib', 'sale-breakdown-chart.png.sha256').toString().trim();
    expect(stored).toBe(svgHash);
    const png = read('public', CHART_PNG_PATH);
    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  it('page shows the chart, a table view, and a credit-link embed', () => {
    const page = read('src', 'pages', 'how-to-sell-on-tiktok-shop.astro').toString();
    expect(page).toMatch(/set:html=\{chartSvg\}/);
    expect(page).toMatch(/Show the chart as a table/);
    expect(page).toMatch(/<a href="\$\{url\}"><img src="\$\{pngUrl\}"/);
    expect(page).toMatch(/property="og:image" content=\{pngUrl\}/);
  });
});
