# keywords.md — marginready.com

v1.K keyword research (research only; no pages or code). Pulled 2026-10-31 through Treg.
US Google database. **SV** = monthly search volume, **KD** = keyword difficulty (0–100).
"—" means the provider returned no value.

Sources:
- **Serpstat** (`g_us`). Phrase-match seeds were `tiktok shop` (call `7171750e…`), `tiktok shop fee`
  (`cb1f5ffc…`), `tiktok seller` (`74082324…`), `tiktok shop payout` (`6fa04d90…`), `tiktok shop
  commission` (`f62ae90d…`), `tiktok shop shipping` (`6e39ac1a…`), `tiktok shop refund` (`12f38ae5…`)
  and `tiktok shop affiliate` (`612e6683…`). The batch lookup was `85ae5fd6…`. No data came back
  for `tiktok shop profit`, `tiktok shop tax` or `tiktok shop dropshipping`.
- **SE Ranking** (`us`), batch `ded122df…`. It had no data for 22 of the 33 keywords.

Total spend $0.21.

**The two providers disagree on KD, sometimes badly.** For example, `tiktok shop affiliate
program` is KD 11 at Serpstat and 69 at SE Ranking. Treat KD as a rough signal, not a number
to rank on.

## Headline

The seller-money cluster the site targets is **small and already covered**. All "fee" variants
together come to about 1,300 SV/mo, payout to 40, commission to 260–390, and the calculator
queries to 20–260. Phrases that look like medium or high volume (promo codes, login, "is tiktok
shop safe") are **shopper or navigational intent**, not seller intent.

## Covered by existing pages (for reference)

| Keyword | SV Serpstat | SV SE Ranking | KD Serpstat | KD SE Ranking | Page |
|---|---|---|---|---|---|
| tiktok shop fulfillment | 590 | 590 | — | 17 | FBT (undiscovered) |
| fulfilled by tiktok | — | 480 | — | 17 | FBT (undiscovered) |
| tiktok shop fees / fee | 320 / 320 | 320 | — | 18 | fee calculator |
| tiktok shop fee calculator | — | 260 | — | 7 | fee calculator |
| tiktok shop seller fees | 140 | 140 | 2 | 25 | fee calculator |
| tiktok shop payout | 40 | — | — | — | payout schedule |

The SE Ranking trend for `tiktok shop fulfillment` rose from 210 (2025-12) to 590 (2026-07 →
10). `fulfilled by tiktok` jumped from about 20 to 480 in 2026-04. The FBT page targets both,
but Google hasn't discovered it (v1.F).

## Not covered: seller-intent candidates

Ranked by fit with the proven format (calculator + profit question) first, then volume.

| # | Keyword | SV Serpstat | SV SE Ranking | KD Serpstat | KD SE Ranking | Fit / notes |
|---|---|---|---|---|---|---|
| 1 | tiktok shop affiliate commission | 390 | — | — | — | **Strong.** The affiliate rate a seller sets comes out of margin, so it suits an "affiliate commission you can afford" calculator. It sits next to `tiktok shop affiliate program` (12,100 / 9,900 SV, KD 11 vs 69, mostly creator intent) and `tiktok shop affiliate` (4,400 / 3,600). |
| 2 | tiktok shop ads | 1,300 | 610 | 6 | 39 | **Medium.** It's an ad-cost question and borders the ROAS page. SE Ranking CPC is $8.10, the highest commercial value here. |
| 3 | is tiktok shop worth it | — | 140 | — | 14 | **Medium.** A seller's go/no-go decision; a profit-model page could answer it. |
| 4 | tiktok shop dropship | 390 | — | 4 | — | **Medium.** Dropship margin math fits. TikTok's dropshipping policy needs a cited source before any claim. |
| 5 | tiktok shop analytics | 260 | — | 5 | — | **Product-adjacent.** This is what the v2 dashboard does; there's no calculator angle today. |
| 6 | how to make money on tiktok shop | 590 | — | 11 | — | **Weak.** Mixed creator and seller intent. |
| 7 | tiktok shop returns | 880 | — | — | — | **Weak.** Mostly shopper intent. A seller-side "return cost" angle exists. |
| 8 | tiktok shop seller requirements | — | 50 | — | 19 | **Weak.** Declining (170 → 50 over 12 months), and not a money question. |

## Open for the operator

- **Decided 2026-10-31:** rows 1–4 are planned as v1.L–v1.O in `docs/prd.md`. Rows 5–8 are not
  planned.
- Discovery caveat (from v1.F): new pages will probably stay undiscovered until external links
  or a working sitemap change that.
