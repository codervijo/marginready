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

## 2026-09-29 — phase IDs flattened to two-level vN.X

> "make notes for growth docs as well. then make sure our version numbering follows
> our canonical numbering scheme". Canonical (`sites/portfolio/AI_AGENTS.md`
> § Versioning) allows two levels only, never three-level IDs, and makes `vN.A` the
> kickoff phase. Flattened in ship order. Older commits and log entries keep the old IDs:
>
> | Old | New |
> |---|---|
> | v1.B.1 payout page upgrade | v1.D |
> | v1.A.1 fee calculator upgrade | v1.E |
> | v1.C.1 discovery fix | v1.F |
> | v1.D deepening (09-23 text) | v1.G |
> | v1.D new cluster pages (09-23 text) | v1.H |
> | v2.A OAuth + sync | v2.A kickoff / decisions lock + v2.B build |
>
> v1 gets no retroactive kickoff row. The `.A` rule applies from v2 on. Also fixed
> this project's AI_AGENTS.md § Versioning, which wrongly allowed three-level IDs, and
> added a growth.md note (link track not started, v1.G held, mapping).

## 2026-10-09 — v1.G: visible FAQ matching schema

> "how is the live site doing?" → "use lamill tool" → "fix the FAQ answers missing from
> visible HTML" → "make it v1.G, push the others down, then commit". `lamill project check`
> CHECK_095 flagged 12 FAQ answers in JSON-LD only. Break-even, ROAS and payout-less pages
> now render a "Common questions" section from the same `faq` array that feeds the schema;
> answer text unchanged; test guard added. Suite green (150), build passes. Not deployed.
>
> Renumbered to make room:
>
> | Old | New |
> |---|---|
> | (new) visible FAQ matching schema | v1.G |
> | v1.G deepen the two ranking payout pages | v1.H |
> | v1.H new payout-cluster pages | v1.I |

## 2026-10-09 — v1.H: homepage share image + meta description

> "fix the og:image and meta description failures". `lamill project check` CHECK_076 and
> CHECK_071, both homepage-only. Added `public/og.png` (1200×630) with `og:image` /
> `twitter:image` on `/` and lengthened the homepage meta description 112 → 155 chars.
> Suite green (150), build passes. Committed, not deployed. Renumbered as before:
> deepening v1.H → v1.I, new cluster pages v1.I → v1.J.

## 2026-10-09 — v1.H follow-up: homepage meta robots

> "commit and push" → v1.H pushed (`32489ff`), verified live, CHECK_071 and CHECK_076 pass.
> "fix the meta robots failure" → added `<meta name="robots" content="index, follow">` to
> `/` (CHECK_075), with a test. Suite green (151), build passes. Folded into v1.H.
> Committed, not deployed.

## 2026-10-09 — deploy platform corrected in docs: Cloudflare Pages

> "fix the deploy-drift failure" → "do 2, then commit and push". CHECK_143 is a warning,
> not drift: its classifier only recognises a `*.pages.dev` / `*.workers.dev` host in the
> redirect chain, which a custom domain never shows, so no change in this repo can make it
> pass. The declaration (`cf-pages`) is right: `marginready.pages.dev` serves each push and
> `lamill project hosting` lists the deploys from the Pages API. `AI_AGENTS.md` and
> `docs/CLAUDE.md` said "Workers (Static Assets)"; corrected to Pages. Not checked: whether
> a same-name Worker also exists (no Cloudflare account access), and whether
> `wrangler deploy` works here. The check fix belongs in `sites/portfolio`, not raised yet.
> Also logged the robots tag deploy (`07bf497`, live, CHECK_075 passing).

## 2026-10-23 — growth reviews for v1.C, v1.D, v1.E

> "where were we?" → "do the 10-16 growth reviews". Pulled `lamill project seo --refresh`
> and a `gsc.query_with_dims` split (28d window 09-23 → 10-20, all after the 09-18 deploys).
> v1.D (payout schedule) → shipped: position 28.7 → 19.0. v1.E (fee calculator) → failed:
> still ~56, impressions halved, the "profit calculator" query didn't move. v1.C → extended
> to 2026-11-20: the FBT and COGS pages are still unknown to Google, so the bet is untested.
> Break-even is now indexed (6 of 9). Payout-less is at 4.6. Checkpoint 09-23 also reviewed.
> Query table saved as `docs/gsc-queries-1023.csv`; v1.I / v1.J are left to the operator.
> Docs only; nothing committed.

## 2026-10-23 — v1.I: payout schedule page deepened

> v1.I gate question → "b" (deepen anyway). With no GSC queries in 11–40, the section ideas
> came from the live SERP for "tiktok shop payout": its AI Overview cites Seller Center's
> "Scheduling your payouts", which the page didn't use. Added the payout-schedule section
> (daily / business-day / weekly / monthly), a new FAQ, and TikTok's named failed-payout
> causes with the next-day retry. That replaced the FAQ claim that TikTok documents no
> reasons, which had gone stale. All three sources re-read. PRD v1.I row updated; growth
> entry opened. Suite green (151), build passes. Payout-less untouched. Not committed.

## 2026-10-23 — v1.J: page-quality fixes from the skill audit

> "are the pages … thick and useful using our custom skill?" → payout schedule fixes 1, 2, 4
> (H1 ≠ title, description 147, worked schedule example + test) → "analyse all current
> pages" → audit table of 9 pages → "v1.J with 1–3, then do it". Cited the 6% referral fee
> on break-even, ROAS and COGS; `/tools/` hub 254 → 732 words (order of use, how numbers
> chain); descriptions ≤ 155 and H1 ≠ title on 5 pages; 3 new `seo.test.js` guards (the cite
> guard caught nothing new; the fee page already cites a different Seller Center page).
> Payout-less held. New payout-cluster pages renumbered v1.J → v1.K. Suite green (176),
> build passes. Not committed.

## 2026-10-23 — v1.I + v1.J deployed

> "commit and push" → 3 commits (`8fbe174` v1.I, `ea3bbca` v1.J, `e85935c` docs), live about 40s
> after the push and spot-checked. `lamill project check`: 81 passed, 6 failed, unchanged.
> "log it and commit" → deploy recorded in growth.md, prd.md and CLAUDE.md. v1.I review 2026-11-20.
