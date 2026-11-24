// "Where a $25 TikTok Shop sale goes" — v1.N image asset.
// Every number comes from calcFees, using the same inputs as the worked
// examples on /how-to-sell-on-tiktok-shop/ (guarded in how-to-sell.test.js).
// Renders one SVG string used three ways: inline on the page, as the static
// /charts/tiktok-shop-sale-breakdown.svg file, and as the source of the
// committed PNG (scripts/render-sale-breakdown-png.mjs).

import { calcFees } from "./tiktok-fees";

export const CHART_PAGE_URL = "https://marginready.com/how-to-sell-on-tiktok-shop/";
export const CHART_PNG_PATH = "/charts/tiktok-shop-sale-breakdown.png";
export const CHART_SVG_PATH = "/charts/tiktok-shop-sale-breakdown.svg";
export const CHART_TITLE = "Where a $25 TikTok Shop sale goes";

export const INPUTS = {
  price: 25,
  cogsPerUnit: 8,
  fulfillmentPerUnit: 5,
  referralRatePct: 6,
  creatorRatePct: 15,
  adSpendPerOrder: 3,
};

// Fixed part order = fixed categorical slot order (validated light-mode
// palette, adjacent pairs in both bars pass CVD and normal-vision checks).
export const PARTS = [
  { key: "referral", name: "TikTok referral fee (6%)", color: "#2a78d6", ink: "#ffffff" },
  { key: "product", name: "Product cost (landed)", color: "#eb6834", ink: "#ffffff" },
  { key: "shipping", name: "Shipping to the buyer", color: "#1baf7a", ink: "#ffffff" },
  { key: "creator", name: "Creator commission (15%)", color: "#eda100", ink: "#0b0b0b" },
  { key: "ads", name: "Ad spend per order", color: "#e87ba4", ink: "#ffffff" },
  { key: "kept", name: "What you keep", color: "#008300", ink: "#ffffff" },
] as const;

export type PartKey = (typeof PARTS)[number]["key"];

export interface Bar {
  label: string;
  segments: { key: PartKey; amount: number }[];
  kept: number;
  keptPct: number;
}

export function saleBreakdownBars(): Bar[] {
  const base = {
    price: INPUTS.price,
    units: 1,
    referralRatePct: INPUTS.referralRatePct,
    cogsPerUnit: INPUTS.cogsPerUnit,
    fulfillmentPerUnit: INPUTS.fulfillmentPerUnit,
    returnRatePct: 0,
  };
  const own = calcFees({ ...base, affiliateRatePct: 0, adSpend: 0 });
  const creator = calcFees({
    ...base,
    affiliateRatePct: INPUTS.creatorRatePct,
    adSpend: INPUTS.adSpendPerOrder,
  });
  const common = [
    { key: "referral" as const, amount: own.totalReferralFee },
    { key: "product" as const, amount: own.totalCogs },
    { key: "shipping" as const, amount: own.totalFulfillment },
  ];
  return [
    {
      label: "You promote it yourself",
      segments: [...common, { key: "kept", amount: own.netProfit }],
      kept: own.netProfit,
      keptPct: own.netMarginPct,
    },
    {
      label: "A creator sells it, with ads",
      segments: [
        ...common,
        { key: "creator", amount: creator.totalAffiliate },
        { key: "ads", amount: creator.adSpend },
        { key: "kept", amount: creator.netProfit },
      ],
      kept: creator.netProfit,
      keptPct: creator.netMarginPct,
    },
  ];
}

export const money = (n: number) => `$${n.toFixed(2)}`;
const pct = (n: number) => `${Math.round(n)}%`;
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function chartAltText(): string {
  const [a, b] = saleBreakdownBars();
  const amt = (k: PartKey, bar = a) => money(bar.segments.find((s) => s.key === k)!.amount);
  return (
    `${CHART_TITLE}: ${amt("referral")} TikTok referral fee, ${amt("product")} product cost and ${amt("shipping")} shipping. ` +
    `Promoting it yourself, you keep ${money(a.kept)} (${pct(a.keptPct)}). ` +
    `Sold by a creator at ${INPUTS.creatorRatePct}% commission (${amt("creator", b)}) with ${amt("ads", b)} of ads per order, you keep ${money(b.kept)} (${pct(b.keptPct)}).`
  );
}

// Layout in viewBox units. 1200 × 630 so the PNG also works as a share image.
const W = 1200;
const H = 630;
const X0 = 60;
const BAR_W = W - 2 * X0;
const BAR_H = 44;
const GAP = 2; // surface gap between blocks
const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";
const INK = "#0b0b0b";
const INK_2 = "#52514e";
const SURFACE = "#fcfcfb";

export function renderSaleBreakdownSvg(): string {
  const bars = saleBreakdownBars();
  const scale = BAR_W / INPUTS.price;
  const out: string[] = [];
  const unlabeled = new Map<PartKey, string>();
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="sbc-title sbc-desc" font-family="${FONT}">`,
    `<title id="sbc-title">${esc(CHART_TITLE)}</title>`,
    `<desc id="sbc-desc">${esc(chartAltText())}</desc>`,
    `<rect width="${W}" height="${H}" fill="${SURFACE}"/>`,
    `<text x="${X0}" y="78" font-size="40" font-weight="600" fill="${INK}">${esc(CHART_TITLE)}</text>`,
    `<text x="${X0}" y="118" font-size="22" fill="${INK_2}">$8 landed product cost, $5 shipping, 6% referral fee. Same product, two ways to sell it.</text>`,
  );

  bars.forEach((bar, i) => {
    const top = 200 + i * 140;
    out.push(
      `<text x="${X0}" y="${top - 16}" font-size="24" font-weight="600" fill="${INK}">${esc(bar.label)}</text>`,
      `<text x="${X0 + BAR_W}" y="${top - 16}" font-size="24" text-anchor="end" fill="${INK}">you keep <tspan font-weight="700">${money(bar.kept)}</tspan> (${pct(bar.keptPct)})</text>`,
    );
    let x = X0;
    bar.segments.forEach((seg, j) => {
      const part = PARTS.find((p) => p.key === seg.key)!;
      const last = j === bar.segments.length - 1;
      const w = seg.amount * scale - (last ? 0 : GAP);
      const label = money(seg.amount);
      const fontSize = 20;
      const textW = label.length * fontSize * 0.6;
      const fits = textW + 2 * 10 <= w;
      if (!fits) unlabeled.set(seg.key, label);
      out.push(
        `<g><title>${esc(part.name)}: ${label} (${pct((seg.amount / INPUTS.price) * 100)} of the sale)</title>`,
        `<rect x="${x.toFixed(1)}" y="${top}" width="${w.toFixed(1)}" height="${BAR_H}" rx="4" fill="${part.color}"/>`,
        fits
          ? `<text x="${(x + 10).toFixed(1)}" y="${top + BAR_H / 2 + 7}" font-size="${fontSize}" font-weight="600" fill="${part.ink}">${label}</text>`
          : "",
        `</g>`,
      );
      x += w + (last ? 0 : GAP);
    });
  });

  // Legend, in block order. An amount too narrow to print inside its block
  // goes beside the name, since a static image has no hover.
  const legendTop = 480;
  let lx = X0;
  let ly = legendTop;
  for (const part of PARTS) {
    const extra = unlabeled.get(part.key);
    const name = extra ? `${part.name}: ${extra}` : part.name;
    const itemW = 28 + name.length * 18 * 0.55 + 28;
    if (lx + itemW > X0 + BAR_W) {
      lx = X0;
      ly += 34;
    }
    out.push(
      `<rect x="${lx}" y="${ly - 15}" width="18" height="18" rx="4" fill="${part.color}"/>`,
      `<text x="${lx + 28}" y="${ly}" font-size="18" fill="${INK}">${esc(name)}</text>`,
    );
    lx += itemW;
  }

  out.push(
    `<text x="${X0 + BAR_W}" y="${H - 22}" font-size="18" text-anchor="end" fill="${INK_2}">marginready.com/how-to-sell-on-tiktok-shop/</text>`,
    `</svg>`,
  );
  return out.join("");
}
