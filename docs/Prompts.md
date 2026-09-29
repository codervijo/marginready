# Prompt History — marginready.com

<!-- Append new prompts at the bottom, newest last. Format:

## YYYY-MM-DD [optional title]
> <prompt text or short summary>

The dated H2 (`## YYYY-MM-DD`) is what `portfolio project check` parses
to surface "last AI prompt" per project. Keep entries append-only.
-->

## 2026-05-28 — scaffolded via portfolio new bootstrap

> Created project skeleton. Stack chosen, scaffolding written, git initialized.

## 2026-07-30 — v1.B: SEO content cluster + internal-link fix

> "improve SEO for this site, increase impressions, and clicks" (site was at
> 0 impressions / 0 clicks, 5 pages).
>
> Diagnosis: technical SEO was already fine (sitemap OK in GSC, homepage
> indexed, trailing-slash canonical, IndexNow). The real defects were (1) the
> fee calculator was an orphan page with zero inbound internal links, (2) 3 of
> 5 pages were mock-data prototype screens, and (3) content supply was one
> page. Shipped 5 interlinked pages (2 calculators + 2 guides + hub), rebuilt
> the internal-link graph, noindexed the prototype screens. All fee/payout
> facts sourced from TikTok Seller Center primary docs and cited on-page.

## 2026-09-18 — v1.C: FBT fee calculator + COGS guide

> "build FBT and COGS pages" — after reviewing v1.B (0 → 267 impressions, 5/7
> indexed) and a keyword pass (Ahrefs out of units; used GSC queries + SERPs).
> Shipped `/tiktok-shop-fbt-fee-calculator/` and `/how-to-calculate-cogs-tiktok-shop/`
> with pure libs (`tiktok-fbt.ts`, `landed-cogs.ts`) + tests. FBT dollar rates
> are user inputs; only the Seller Center rules (dim weight ÷166 above 2 lb /
> 332 in³, 60 free storage days) are encoded.

## 2026-09-18 — v1.B.1: strengthen the payout schedule page

> "strengthen the payout schedule page". Added the payout-date estimator
> (`tiktok-payout.ts` + tests), worked timelines, a late-payout checklist, and a
> visible FAQ (previously JSON-LD only). Re-verified against Seller Center.

## 2026-09-18 — v1.A.1: strengthen the fee calculator page

> "strengthen the fee calculator page". Found uncited fee facts (incl. an unsourced
> 20–30% effective-take figure) and FAQ schema without a visible FAQ. Re-sourced
> every fact from Seller Center, removed what can't be cited, added worked examples
> (test-guarded), visible FAQ, per-unit profit, and a Sources section. Flagged an
> unverified third-party "8% from Aug 4 2026" claim for operator confirmation.

## 2026-09-23 — growth checkpoint, v1.C.1 discovery fix, v1.D plan

> "check latest growth work … tell me what we did in the last 3 months". Pulled
> fresh GSC data: 244 impressions / 1 click over 28d, 5 of 9 indexed; `/tools/`, break-even,
> FBT and COGS are still `url_is_unknown_to_google`. Logged a 3-month checkpoint in
> `docs/growth.md`. Planned "10x impressions" into the PRD as v1.C.1 (discovery fix)
> and v1.D (authority + payout cluster).
>
> Week 1 brief (discovery + data only, fee and break-even pages frozen until 10-16):
> curl as Googlebot showed the links are real `<a href>` in server HTML (JS theory
> disproved), `robots.txt` allows all, `sitemap-index.xml` is fine (`/sitemap.xml`
> 404 is expected). v1.C.1 added in-body links to `/tools/` and break-even from both
> payout pages. The GSC export (`docs/gsc-queries-0923.csv`) has only 2 queries
> ranking 11–40, 1 impression each, and 0 named queries on payout-less, so no new
> pages were proposed. v1.D decision **(b)**: hold payout-page deepening until
> after 10-16. Link track started as an ongoing experiment (`docs/links-log.md`),
> but nothing has been posted yet: it needs the operator's accounts. Ahrefs has 0
> units until 10-03, and the site has no analytics to measure referral visits.

## 2026-09-29 — v1.C.1 pushed and deployed

> "push". Pushed 4 commits (`1d5b7d2..9d90346`); Cloudflare deployed in ~1 min and
> the new in-body links were verified live on both payout pages. Coverage check moved
> to ~2026-10-03 to give Google time to re-crawl.
