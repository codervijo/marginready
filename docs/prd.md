---
project: marginready.com
prd_version: 1
project_version: v1.I
status: active
owner: Vijo
last_updated: 2026-10-31
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
- `vN.X` = phase letter within a tier; internal slicing. Two levels only, never
  `vN.X.Y`: follow-up work gets the next free letter. `vN.A` is the tier's kickoff /
  decisions-lock phase; build starts at `.B` (applies from v2 on).

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
| **v1.D** | payout page upgrade | Payout-date estimator on `/tiktok-shop-payout-schedule/`, worked timelines, late-payout checklist, visible FAQ matching schema | ✅ |
| **v1.E** | fee calculator upgrade | Every fee fact cited + Sources; uncited claims removed; worked examples (test-guarded); visible FAQ; per-unit net profit; title targets "profit calculator" | ✅ |
| **v1.F** | discovery fix | Diagnosed 2026-09-23: links to `/tools/` and break-even are real `<a href>` in server HTML (JS theory disproved), `robots.txt` allows all, `sitemap-index.xml` 200 with all 9 URLs and registered on `sc-domain:marginready.com`. Shipped: in-prose links to `/tools/` and break-even from both payout pages. No footer or sitemap change | ✅ deployed 2026-09-29 |
| **v1.G** | visible FAQ matching schema | "Common questions" section on `/tiktok-shop-break-even-calculator/`, `/tiktok-shop-roas-calculator/` and `/why-tiktok-shop-payout-is-less-than-sales/` (4 questions each), built from the same `faq` array as the FAQPage JSON-LD; answer text unchanged. Fixes `lamill project check` CHECK_095 (12 answers in schema only). Test guard in `seo.test.js` | ✅ deployed 2026-10-09 |
| **v1.H** | homepage share image + meta description | `public/og.png` (1200×630) with `og:image` / `twitter:image` on `/`; homepage meta description lengthened 112 → 155 chars. Follow-up same day: `<meta name="robots" content="index, follow">` on `/` (CHECK_075). Homepage only. Fixes `lamill project check` CHECK_076, CHECK_071 and CHECK_075. Test guards in `seo.test.js` | ✅ deployed 2026-10-09 |
| **v1.I** | deepen the two ranking payout pages | Sections on `/tiktok-shop-payout-schedule/` and `/why-tiktok-shop-payout-is-less-than-sales/`; no topic broadening; one commit per page. Decision **(b), 2026-09-23:** hold until after the 2026-10-16 review. **Decision (b), 2026-10-23:** start anyway. The re-pulled table (`docs/gsc-queries-1023.csv`) still has only 2 queries in 11–40, so new sections are sourced from Seller Center documentation the pages don't yet use, plus the live SERP (AI Overview, related searches), instead of GSC queries. Every fact cited. Payout schedule page ✅ deployed 2026-10-23; payout-less held until after the 2026-10-27 v1.F review (done 2026-10-31, `failed`; hold over, awaiting operator's go) | in progress |
| **v1.J** | page-quality fixes from the 2026-10-23 skill audit | (1) Cite the 6% referral fee on `/tiktok-shop-break-even-calculator/` and `/tiktok-shop-roas-calculator/` (Seller Center, inline). (2) Build `/tools/` into a real hub: the order to use the tools in and which number carries into the next one; drop its uncited payout fact. (3) Meta descriptions ≤ 155 chars on `/tools/`, break-even, ROAS, FBT and COGS; H1 no longer repeats the title on break-even, ROAS and COGS. Titles and slugs unchanged. Payout-less excluded (ranks 4.6, held until the 2026-10-27 v1.F review) | ✅ deployed 2026-10-23 |
| **v1.K** | keyword research (research only) | Treg keyword data: low-KD, medium–high search-volume TikTok Shop seller money queries the site doesn't cover. Output: ranked shortlist in `docs/keywords.md`, every number sourced to the Treg provider and pull date. No pages, no code. Added 2026-10-31; the operator decides on pages afterwards. Context: 3 of 9 URLs still undiscovered (v1.F failed). **Discovery caveat for v1.L–v1.O:** new pages will probably stay undiscovered until external links or a working sitemap change that. Done 2026-10-31: the seller-money cluster is small and mostly covered; top uncovered fit is affiliate commission (Serpstat 390 SV) | ✅ |
| **v1.L** | affiliate commission page | Target `tiktok shop affiliate commission` (Serpstat 390 SV). Calculator: the highest affiliate commission rate a seller can offer and still hit a target margin. Proven format (calculator from a pure `src/lib/` function + tests, explainer prose, FAQPage JSON-LD + visible FAQ, cited Seller Center sources, footer + `/tools/` hub links). Every rate is a user input; no uncited fee or policy fact. Keyword data: `docs/keywords.md` | planned |
| **v1.M** | TikTok Shop ads cost page | Target `tiktok shop ads` (Serpstat 1,300 / SE Ranking 610 SV, KD 6 / 39). Seller-side ad cost per order and profit after ad spend; cross-links the ROAS calculator without duplicating it. No ad-platform integration (GMV Max stays out of scope). Proven format (calculator from a pure `src/lib/` function + tests, explainer prose, FAQPage JSON-LD + visible FAQ, cited Seller Center sources, footer + `/tools/` hub links). Every rate is a user input; no uncited fee or policy fact. Keyword data: `docs/keywords.md` | planned |
| **v1.N** | "is TikTok Shop worth it" page | Target `is tiktok shop worth it` (SE Ranking 140 SV, KD 14). A go/no-go profit model per product, chaining fee → COGS → break-even. Proven format (calculator from a pure `src/lib/` function + tests, explainer prose, FAQPage JSON-LD + visible FAQ, cited Seller Center sources, footer + `/tools/` hub links). Every rate is a user input; no uncited fee or policy fact. Keyword data: `docs/keywords.md` | planned |
| **v1.O** | dropshipping margin page | Target `tiktok shop dropship` (Serpstat 390 SV, KD 4). Dropship margin math. TikTok's dropshipping policy must be cited from Seller Center before the page states anything about it. Proven format (calculator from a pure `src/lib/` function + tests, explainer prose, FAQPage JSON-LD + visible FAQ, cited Seller Center sources, footer + `/tools/` hub links). Every rate is a user input; no uncited fee or policy fact. Keyword data: `docs/keywords.md` | planned |
| **v1.P** | new payout-cluster pages | Sourced only from the GSC query table, never from a guessed keyword list. Deferred until after the 2026-10-16 review. Was v1.K, then v1.L, until 2026-10-31 | deferred |
| **v2.A** | kickoff / decisions lock | Lock v2 scope, data model, OAuth/token-storage design and any ADR before build | planned |
| **v2.B** | real TikTok Shop OAuth + sync | Replace mock data: OAuth against sandbox, nightly sync job, data model, real per-SKU settled profit | planned |

**Ongoing experiment, not a phase gate: link track (started 2026-09-23).** Off-site
distribution for the free calculators: community posts in r/TikTokShop and Facebook
seller groups, plus free-tool directory listings and seller-resource roundups. Logged
in `docs/links-log.md`; GSC can't see these channels. Runs alongside the phases above
and doesn't block them.

## 6. Open questions

- *(append-only log; mark answered with date but never delete)*
- **2026-09-18:** Is the US referral fee still 6%? A third-party blog claims 6% → 8% from
  2026-08-04 (no TikTok source); TikTok's fee page (updated 2026-05-14) says 6%. Operator to
  confirm in Seller Center. If it changed, update the 6% defaults and prose on the fee,
  break-even, ROAS, FBT and payout-less pages.
