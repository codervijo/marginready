---
project: marginready.com
prd_version: 1
project_version: v1.C
status: active
owner: Vijo
last_updated: 2026-09-18
---

# marginready.com — PRD

## 1. Problem

TikTok Shop's native dashboard reports GMV but never real profit, so sellers
reconcile scattered fees, commissions, shipping, taxes, and refunds by hand in
spreadsheets to answer one question: which products actually make money.
It matters because a product can sell well and still lose money on every order.

## 2. Users

US-based TikTok Shop sellers doing roughly $5k–$50k/month across 10–80 SKUs,
running the business themselves — profitable enough to care about margins, too
busy to reconcile fees and COGS manually.

## 3. Goals & non-goals

**Goals:**
- Get 50 sellers onto a free beta and validate that real per-SKU profit is a
  tool they'll pay for.
- Convert early beta users to a paid plan once the dashboard proves its value.
- Earn organic search traffic from high-intent seller money questions
  (fees, break-even pricing, ROAS, payout timing) as the top of that funnel.

**Non-goals:**
- Scraping of any kind — all data comes from authenticated TikTok Shop API
  calls using the seller's own OAuth token.
- Competitor or market-comparison data. We only ever read the seller's own data.
- Hardcoded TikTok fee tables in the product — real fees come from the API's
  settled amounts. (The public calculators are explicitly labeled estimators
  driven by user-entered rates, which is a different thing.)
- GMV Max / ad-spend integration, Amazon/Shopify, alerts, bulk tools, billing —
  out of scope until explicitly requested.

## 4. Versions

Two-level versioning convention (canonical: `sites/portfolio/AI_AGENTS.md`):

- `vN` = major capability tier; SemVer-MAJOR semantics.
- `vN.X` = phase letter within a tier; internal slicing.

| Version | Theme | Acceptance |
|---|---|---|
| v0 | scaffold | local builds, CF wrangler.jsonc + public/_headers in place, repo initialized |
| v1 | public site + free seller calculators | A seller can land on the site, model their TikTok Shop fees / break-even price / break-even ROAS, and understand payout timing — without an account |
| v2 | real settled per-SKU profit | A seller connects their TikTok Shop, enters COGS, and sees true profit per SKU from actual settled payouts |

## 5. Phases

| Phase | Theme | Features | Status |
|---|---|---|---|
| **v0.A** | scaffolded | `portfolio new bootstrap` ran; standard files written; git initialized | ✅ |
| **v1.A** | frontend prototype + first tool | Landing page, mock-data app screens (`/connect/`, `/cogs/`, `/dashboard/`), `/tiktok-shop-fee-calculator/`; CF deploy, trailing-slash canonical, IndexNow | ✅ |
| **v1.B** | SEO content cluster | `/tools/` hub, `/tiktok-shop-break-even-calculator/`, `/tiktok-shop-roas-calculator/`, `/tiktok-shop-payout-schedule/`, `/why-tiktok-shop-payout-is-less-than-sales/`; site-wide internal-link graph; prototype screens noindexed + sitemap-excluded | ✅ |
| **v1.C** | FBT + COGS pages | `/tiktok-shop-fbt-fee-calculator/` (chargeable weight, storage, returns, vs self-ship), `/how-to-calculate-cogs-tiktok-shop/` (landed-cost calculator); stale FBT figures removed from fee calculator | ✅ |
| **v2.A** | real TikTok Shop OAuth + sync | Replace mock data: OAuth against sandbox, nightly sync job, data model, real per-SKU settled profit | planned |

## 6. Open questions

- *(append-only log; mark answered with date but never delete)*
