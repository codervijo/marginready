# AI Agent Context — marginready.com

## Summary

*one paragraph: what this site is, what it does*

MarginReady is a web app that shows TikTok Shop sellers their real per-SKU profit. It connects to a seller's own TikTok Shop account via OAuth, pulls their actual settled sales and platform fees from TikTok's Finance API, and subtracts the cost of goods the seller enters per product. The result is true profit and margin for every product — based on real settled payouts, not estimates. TikTok's native dashboard shows revenue (GMV) but never real profit, leaving sellers to reconcile scattered fees, commissions, shipping, taxes, and refunds by hand in spreadsheets. MarginReady automates that and answers the one question every seller has: which products actually make money.

## Audience

*one sentence: who this is for (broad demographic)*

TikTok Shop sellers in the US who want to know their true profit per product, not just revenue.

## ICP

*the specific ideal customer — demographics, pain points, what they use today. More detail than Audience: Audience is the broad demo ("homeowners with EV chargers"), ICP is the specific targetable subset ("Tesla owners in CA who installed in last 90d, paid $2k+")*

A US-based TikTok Shop seller doing roughly $5k–$50k/month in sales across 10–80 SKUs, managing the business themselves, profitable enough to care about margins but too busy to reconcile fees and COGS manually in spreadsheets.

## Goals

*1-2 sentences: primary business / product goal*

Get 50 sellers onto a free beta and validate that real per-SKU profit is a tool they'll pay for. Convert early users to a paid plan once the dashboard proves its value.

## MarginReady — Agent Build Guide

### What this is

A web app that shows TikTok Shop sellers their real per-SKU profit. It connects to a seller's own TikTok Shop account via OAuth, pulls their actual settled sales and platform fees from TikTok's Finance API, and subtracts the cost of goods (COGS) the seller enters per product. Output: true profit per product, from real settled numbers — not estimates.

### Hard rules (do not violate)

- **No scraping. Ever.** No Playwright, Puppeteer, headless browsers, or public-page parsing. All data comes from authenticated TikTok Shop API calls using the seller's own OAuth token. If a task seems to need scraping, stop and flag it — the design is wrong, not the API.
- **We only ever read the seller's OWN data.** This tool never touches competitor data. There is no competitor/market-comparison feature. Don't add one.
- **Never hardcode TikTok fee percentages.** Fees come from the API's actual settled amounts (`fee_and_tax_amount`), not a fee table. The whole point is real numbers, not modeled ones.
- **Treat seller financial data and OAuth tokens as sensitive.** Tokens encrypted at rest. Never log tokens or raw financial payloads. No third-party analytics that captures revenue data.

### Core data source

TikTok Shop Partner API — `seller.finance.info` scope.

- `GET` Order List → enumerate orders
- `GET /finance/202501/orders/{order_id}/statement_transactions` ([Get Transactions by Order](https://partner.tiktokshop.com/docv2/page/get-transactions-by-order-202501)) → per-order and per-SKU settled detail

Key response fields per order: `revenue_amount`, `fee_and_tax_amount`, `shipping_cost_amount`, `settlement_amount`, and `sku_transactions[]` (each with `sku_id`, `sku_name`, `product_name`, `quantity`, settled amount).

Relationship: `settlement_amount = revenue_amount - shipping_cost_amount - fee_and_tax_amount`.

Data availability limits: only after 2023-07-01; for US cross-border sellers, only after 2025-04-30. Handle missing history gracefully.

### Core formula

```
true_profit_per_sku = sku_settlement_amount - (cogs_per_unit × quantity)
```

The only seller-provided input is `cogs_per_unit`. Everything else comes from the API.

### Architecture

- **OAuth flow:** seller authorizes → store encrypted access + refresh token → handle token refresh.
- **Nightly sync job:** pull new/updated orders, fetch transactions per order, upsert into DB.
- **DB tables (minimum):** `sellers`, `oauth_tokens`, `products` (sku_id, names, cogs_per_unit), `transactions` (order_id, sku_id, settlement fields, quantity, timestamps).
- **Idempotent sync** — re-running must not double-count. Key on `order_id` + `sku_id` + `statement_id`.

### Build order

1. OAuth flow against TikTok sandbox / Development Shops (live API is gated behind TikTok's US data security review — assume sandbox until told otherwise).
2. Sync job + data model.
3. COGS entry UI (one editable cost field per SKU).
4. Dashboard: per-SKU real profit + margin %, sorted, underwater products flagged.

### Out of scope until explicitly requested

GMV Max / ad-spend integration (lives in a separate TikTok Marketing API, separate signup/approval), Amazon/Shopify, alerts, bulk tools, billing. Don't build these in v1.

### When unsure

If a request conflicts with the "no scraping / own-data-only / no hardcoded fees" rules, stop and ask rather than improvising. Those three rules are the product's foundation.

## Tech stack

Astro project under the sites/* workspace. Build path goes
through the parent `sites/Makefile` (Docker-orchestrated) which delegates
per-stack work to the central builder at `~/work/projects/builder/`.

## Project structure

- `src/pages/` — one `.astro` file per route. Content pages own their own
  `<title>` / meta / canonical / JSON-LD in a `<Fragment slot="head">`.
- `src/lib/` — **pure, framework-agnostic math**, no React imports:
  `tiktok-fees.ts` (profit at a given price), `tiktok-breakeven.ts` (price for
  a target margin), `tiktok-roas.ts` (break-even ROAS), plus `format.ts`.
  All calculator logic lives here so it's unit-testable.
- `src/components/` — React islands (`client:load`) + presentational pieces.
  Calculators are a thin UI shell over `src/lib/`; keep math out of them.
- `src/layouts/Layout.astro` — shared chrome. Owns the nav, the site-wide
  **footer link graph** (the no-orphans guarantee), and the prototype-footer
  scoping.
- `src/__tests__/` — vitest. Math tests cross-validate the libs against each
  other; `seo.test.js` guards the tag baseline, `noindex` state, sitemap
  exclusions, and internal linking.
- `public/` — static assets copied to `dist/` at build (favicon, `_headers`,
  `robots.txt`, IndexNow key file)
- `docs/` — PRD, Prompts log, growth log, per-project CLAUDE.md
- `Makefile` — thin forwarder to `../Makefile`
- `astro.config.mjs` — `site`, `trailingSlash: 'always'`, and the **sitemap
  filter** excluding the noindexed prototype screens
- `wrangler.jsonc` — Cloudflare deploy config

## Building info

All dev work runs inside the parent `sites1` docker container. The host doesn't
need Node/pnpm installed; the container does. The parent `Makefile`
(`../Makefile` from this dir) is the canonical entry point.

### Why docker

- Pinned Node + pnpm versions match Cloudflare's build env.
- Avoids polluting the host with per-project node_modules.
- Same image serves every sibling project under sites/.

### Common Makefile targets

This project's local `Makefile` forwards every target to `../Makefile` with
`proj=marginready.com`, so these all work either from this dir or from `sites/`:

| Command | What it does |
|---|---|
| `make buildsh` *(from `sites/`)* | Drop into a bash shell inside the docker container at `/usr/src/app` (= `sites/` mounted in). |
| `make run` *(from here)* / `make run proj=marginready.com` *(from `sites/`)* | `pnpm install` then start dev server (auto-detected). |
| `make check-vite proj=marginready.com` | Start the dev server, skipping install. |
| `make test proj=marginready.com` | `pnpm install` + `pnpm build` + `pnpm test`. **Hard-fails outside docker** — `make buildsh` first, or `docker exec`. |
| `make deps` | Install pnpm globally (image bootstrap). |
| `make clean` *(from `sites/`)* | Remove root `package.json`, lockfile, node_modules. Don't run inside a project dir. |

### Running Make targets from a Claude Code session

The Bash tool runs on the host as `vijo`, not inside docker. To execute a
target inside the container, find the running container and `docker exec` in:

```bash
docker ps                                               # find the sites1 container name
docker exec -w /usr/src/app <name> make test proj=marginready.com
```

## Deployment info

- **Platform:** Cloudflare Workers (Static Assets) — *not* Vercel.
- **Config:** `wrangler.jsonc` at the repo root — points `assets.directory` at `./dist` and uses `not_found_handling: "single-page-application"` for SPA client-side routing.
- **Headers:** `public/_headers` — cache (`/assets/*` immutable, HTML no-cache) + security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`). Vite copies `public/` into `dist/` at build, so the file ships with the assets.
- **Build:** `pnpm build` → `dist/`. Wrangler picks up `dist/` via `wrangler.jsonc`.
- **Deploy:** `wrangler deploy` (locally) or via Cloudflare's Git integration on push.
  Initial GitHub repo + CF Pages project setup is automated by the portfolio CLI:
  `cd ../portfolio && make run ARGS="deploy marginready.com"` runs `gh repo create` and
  POSTs to the CF Pages API with `build_command="pnpm run build"` set explicitly
  (avoids the bun-detection trap kwizicle.com hit). Idempotent; safe to re-run.
- **Vite version:** must be ≥ 6.0.0 — Wrangler's Vite integration rejects Vite 5.
- **Env vars:** set `VITE_*` vars (e.g. `VITE_GA_ID`) in the Cloudflare Workers project's environment-variable settings — they're inlined at build time.
- **Live URL:** https://marginready.com/ — live, serving 200 (verified 2026-07-31).
- **Legacy:** if a `vercel.json` or `.vercelignore` is present from a Lovable export, it's inert on Cloudflare and safe to delete.

## Content strategy

*what content this site needs — page types, initial topics, format mix (long-form vs reference vs tool)*

Page types: landing page (early-access email capture), free calculator/tool pages, and practical guides. Topics: TikTok Shop fees explained, GMV vs. real profit, how to calculate true margin, settlement and payout timing, COGS tracking for TikTok sellers. Format mix: interactive calculators backed by explainer prose, aimed at the exact pricing/profit questions sellers ask in r/TikTokShop and Facebook groups, each pointing softly to the tool.

**Revised 2026-07-31 — the original "lead with the landing page, build content
after beta validation" plan was inverted.** A brand-only landing page has no
query to rank for, so it produced 0 impressions for two months. Content now
leads: the calculators are the acquisition surface and the landing page converts
what they bring. See `docs/growth.md` (2026-07-30, 2026-07-31) for the evidence.

**The proven format** — every content page follows it:

1. A working calculator at the top (pure math in `src/lib/`, React island).
2. Explainer prose beneath answering the exact query in the H1.
3. `FAQPage` + `WebApplication`/`Article` JSON-LD.
4. Cited primary sources for any fee/payout fact — TikTok Seller Center, linked
   on-page. Never an uncited number.
5. Cross-links to sibling tools + a soft CTA to the real product.

**Current content surface (7 indexable URLs):** `/`, `/tools/` (hub),
`/tiktok-shop-fee-calculator/`, `/tiktok-shop-break-even-calculator/`,
`/tiktok-shop-roas-calculator/`, `/tiktok-shop-payout-schedule/`,
`/why-tiktok-shop-payout-is-less-than-sales/`.

**Hard-won rule: no orphan pages.** The fee calculator shipped with zero inbound
internal links and Google still didn't know it existed 11 days later, despite it
being live and in the sitemap. A sitemap entry is *not* a discovery mechanism on
a low-authority domain. Every new content page must be linked from the footer
nav in `Layout.astro` **and** the `/tools/` hub. There is a regression test
enforcing this in `src/__tests__/seo.test.js`.

### Post-deploy checklist

*All verified complete 2026-07-31 via `uv run portfolio project seo marginready.com`.*

- [x] Verify in **Google Search Console** — `sc-domain:marginready.com` property is live and returning data.
- [x] Submit the sitemap inside GSC — submitted, status `OK`. Note the real path is **`/sitemap-index.xml`** (Astro's sitemap integration), not `/sitemap.xml`.
- [x] Update the **Live URL** above — https://marginready.com/ serves 200.
- [x] `data/portfolio.json` contains `marginready.com`; `project seo` resolves cleanly.

**Ongoing SEO check** (replaces the retired `gsc sync` command):

```bash
cd ~/work/projects/sites/portfolio && uv run portfolio project seo marginready.com
```

Read **per-URL coverage**, not just impressions. `url_is_unknown_to_google` means
the page was never discovered — a completely different failure from "indexed but
not ranking", with a different fix. Both show 0 impressions.

## How to run

```bash
# from this dir, after `make buildsh` from sites/:
make deps      # → pnpm install via the central builder
make run       # → dev server
make build     # → dist/
make test      # → pnpm install + build + test (must be inside container)
```

## How this project is checked

This project is enforced against shared sites/* conventions by
`portfolio project check marginready.com` (run from `sites/portfolio/`).
Conformance is driven by the universal check catalog (CHECK_*) —
e.g. CHECK_020 (own-git-repo), CHECK_002 (has-ai-agents-md),
CHECK_007 (has-docs-prompts), CHECK_008 (has-docs-growth — `docs/growth.md`
exists — the per-project growth-experiment log; see Growth log section
below), CHECK_001 (has-readme), CHECK_009 (has-gitignore), CHECK_035
(vite-version-ok), CHECK_003 / CHECK_004 (AI_AGENTS.md `## Building info` +
`## Deployment info` headings). See the full catalog with
`portfolio check catalog`. The bootstrap output satisfies all of these on
day zero — keep it that way.

If `project check` flags a regression, fix it. v6.C's `portfolio project fix`
will eventually auto-fix; until then, hand-edit.

## Growth log — per-project experiment tracker

`docs/growth.md` is this project's append-only log of growth experiments
(content, SEO, marketing, structural changes). Each entry is a dated H2
with a measurable hypothesis + KPI + observation window (default 28d).
Read **the full workflow inside `docs/growth.md`** — it's self-sustaining
so you don't have to remember the lifecycle from outside the file.

Update it whenever you do something growth-relevant on this site. The
data source is GSC — `uv run portfolio project seo marginready.com` from
`sites/portfolio/` (the old `gsc sync` command was retired); this file
narrates *why*.

Two lifecycle rules that have already cost this project a wasted entry:
an entry's **Action must be the thing its Hypothesis bets on** (otherwise it
can't be reviewed), and its **KPI must be able to observe the channel** the
hypothesis names. See the 2026-05-28 entry's Learning for how that went wrong.

## Strategy reminder — ship fast, let the market decide

This sites/* workspace is shipping commercial sites toward a
**30-site SEO-traffic goal**. The convention is **build & ship fast,
then let GSC data drive what to invest more in.** Don't over-polish
before launch. Get a minimum-viable version live, indexed, then
iterate on whichever sites actually attract traffic.

Translation for this project: prefer shipping over perfection. The
SEO baseline files (`public/robots.txt`, `public/sitemap.xml`),
deploy config, and dev tooling (`vitest`) are pre-scaffolded so you
can ship today.

## Versioning

This project follows the sites/* **canonical versioning convention** (defined
in `sites/portfolio/AI_AGENTS.md`):

- **`vN`** — major capability tier. Each is a coherent shipped capability and
  may break compat with the previous tier. SemVer-MAJOR semantics.
- **`vN.X`** — phase letter within a tier (A / B / C / …). Internal slicing of
  build work; signals "order/scope can shift." Each phase still ships
  independently.
- **`vN.X.Y`** — numeric sub-phase for follow-up work that lands AFTER `vN.X`
  shipped (e.g. polish, bug fixes, scope cuts).

Two-layer notation separates **external version** (what consumers see) from
**internal phasing** (how the team slices work). Letters signal *un-promised* —
nobody mistakes `v1.B` for a SemVer minor release.

**Always use this numbering when planning or shipping work on this project.**
Specifically:

- Every entry in `docs/prd.md`'s phases table uses `vN.X` (or `vN.X.Y`).
- Every commit message that ships a phase mentions its version (e.g.
  `v1.B — auth flow`).
- Every entry in `docs/Prompts.md` references the version of the work it
  describes when relevant.

Don't introduce a parallel scheme (no `0.1.0` / `Sprint 3` / etc.). When in
doubt, the canonical statement is `sites/portfolio/AI_AGENTS.md`.

Track this project's progress in `docs/prd.md` against this taxonomy. v0.A is
the bootstrap (this scaffold); v1.A is the first real shipped capability.

## Conventions

- Stack: astro
- **Package manager: pnpm only.** No `bun.lockb`, no `package-lock.json`, no `yarn.lock` — they cause CF Pages to pick the wrong manager and break the build. The `pnpm-lock.yaml` is the only lockfile that should ever be committed.
- Build path: this project's `Makefile` → `../Makefile` → `~/work/projects/builder/`
- Cloudflare deploy constraints: Vite ≥ 6, frozen-lockfile install, no `_redirects` SPA fallback (handled by `wrangler.jsonc`'s `not_found_handling` instead).
- **Versioning**: two-level `vN` / `vN.X` — see Versioning section above and `sites/portfolio/AI_AGENTS.md` for the canonical statement.

## Out of scope / don't touch

- **The three product rules are foundational** (see *Hard rules* above): no
  scraping, own-data-only, no hardcoded fee percentages in the product. If a
  request conflicts with one, stop and ask — the design is wrong, not the API.
- **`/connect/`, `/cogs/`, `/dashboard/` are `noindex` on purpose.** They're
  mock-data prototype screens. Don't "fix their SEO", don't re-add them to the
  sitemap, don't write filler copy onto them. They become real in v2.A.
- **Don't state a TikTok fee, rate, or payout figure without a citeable Seller
  Center source.** The public calculators are explicitly *estimators* driven by
  user-entered rates — that's a deliberate distinction from the product's real
  settled numbers, and the pages say so. Never present a modeled figure as
  settled data.
- **Don't add a competitor/market-comparison feature.** Not a v1 gap — a
  permanent non-goal.
- **`docs/growth.md` is append-only.** Fill in a past entry's Result/Learning at
  review time; never rewrite its Hypothesis, Baseline, or Action.

## Deferred decisions

See `docs/CLAUDE.md § Deferred decisions` for things deliberately not shipped
(no blog/CMS, calculators stay account-free, no per-category fee table) so they
don't get re-proposed each session.
