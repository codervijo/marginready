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
