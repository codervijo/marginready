# CLAUDE.md — marginready.com

Per-project orientation for Claude. Read this first when picking up
work on this site. Index of conventions, deferred decisions, and
non-features that aren't obvious from the code or git history.

## Project

MarginReady shows TikTok Shop sellers their real per-SKU profit — it will
connect to a seller's own shop via OAuth, pull actual *settled* sales and
platform fees from TikTok's Finance API, and subtract the COGS they enter.
The user is a US TikTok Shop seller doing ~$5k–$50k/month across 10–80 SKUs
who knows their GMV but not their profit.

Stack: **Astro** + React islands + Tailwind v4 + pnpm, deployed to
**Cloudflare Workers (Static Assets)** via `wrangler.jsonc` — *not* Pages,
and *not* Vite-standalone. Makefile forwards to the central builder.

**Current state (2026-07-31):** the app screens (`/connect/`, `/cogs/`,
`/dashboard/`) are a **frontend prototype on mock data** — no OAuth, no API,
no database yet (that's v2.A). What is genuinely real and shipped is the
public content surface: the free calculators and guides, which compute from
user-entered numbers via pure functions in `src/lib/`. Don't mistake the
dashboard for a working product when picking up work here.

**Pending follow-ups (check these first when picking the project back up):**

- [ ] **~2026-09-25: indexing check.** Run
  `cd ~/work/projects/sites/portfolio && uv run portfolio project seo marginready.com --refresh`.
  Confirm `/tools/`, `/tiktok-shop-break-even-calculator/`,
  `/tiktok-shop-fbt-fee-calculator/` and `/how-to-calculate-cogs-tiktok-shop/`
  have left `url_is_unknown_to_google`, and that the sitemap's "last fetched" date
  has moved (indexing was requested manually on 2026-09-18). If they are still
  unknown, investigate before shipping more pages. Note the result in the v1.C
  growth entry.
- [ ] **Confirm the US referral fee rate** (see `docs/prd.md` § Open questions). An
  unverified claim says 8% since 2026-08-04; every page defaults to 6%.
- [ ] **2026-10-16: v1.C + v1.B.1 + v1.A.1 growth reviews.** Fill in Result/Learning for all three
  2026-09-18 entries in `docs/growth.md` (FBT-intent query impressions and
  position, first impressions on the two new pages, payout page position).

## Commands

```bash
# Build / dev (forwards to ../Makefile with proj=marginready.com)
make deps           # install deps via the central builder
make run            # local dev server  (NOT `make dev` — that target doesn't exist)
make build          # production build → dist/
make test           # pnpm install + build + test
```

**`make test` hard-fails outside docker.** The host has an ancient Node; the
container has Node 22 via Volta. Either `make buildsh` from `sites/` first, or
run a one-shot container from `sites/` (this is what works from a Claude Code
session, where Bash runs on the host):

```bash
cd ~/work/projects/sites && docker run --rm -v "$PWD":/usr/src/app \
  -w /usr/src/app/marginready.com sites1:latest \
  bash -lc 'export PATH=/root/.volta/bin:$PATH; npx vitest run && npx astro build'
```

Deploy: Cloudflare **Workers** (Static Assets) — `wrangler deploy`, or CF's Git
integration on push to `main`.

## Conventions

  - Build path: this project's `Makefile` → `../Makefile` (parent
    workspace) → `~/work/projects/builder/` (central builder).
  - Stack: pnpm-only. No `package-lock.json` / `bun.lockb` / `yarn.lock`.
  - Deploy: Cloudflare **Workers** (Static Assets) via `wrangler.jsonc`. No
    `_redirects` SPA fallback (uses CF's `not_found_handling` instead).
  - `trailingSlash: 'always'` + `build.format: 'directory'`. **Every internal
    link must end in `/`** or it costs a redirect hop; there's a test guarding
    this in `src/__tests__/seo.test.js`.
  - **Fee math lives in pure functions** in `src/lib/` (`tiktok-fees.ts`,
    `tiktok-breakeven.ts`, `tiktok-roas.ts`), never inside components — so it
    can be unit-tested and cross-validated. New calculators follow that shape:
    lib + test + component + page.
  - **Never hardcode TikTok fee tables.** Rates are user inputs with documented
    defaults. Any fee/payout fact stated in prose needs a citeable Seller Center
    source on the page.
  - Public content pages must not carry the "Frontend prototype · mock data"
    footer — it's scoped to the app screens in `Layout.astro`.

## Heading hygiene

**Before adding any section, subsection, or heading to a Markdown
file, output the file's current heading outline first:**

```bash
grep -nE '^#+ ' path/to/file.md
```

Then confirm — in the chat — that the planned new heading's:

1. **Depth** (`#`, `##`, `###`, …) is the intended depth, not
   accidentally one level too shallow.
2. **Label** doesn't collide with existing headings — no duplicate
   `## 1. <title>`, no `### N.X` subsection labels that look like
   `vN.X` phase identifiers.

Only after that confirmation, write.

Applies especially to long-lived docs: `docs/prd.md`, `AI_AGENTS.md`,
`docs/architecture.md`, `docs/CLAUDE.md`.

**Why:** structural drift is invisible in any single editing session
— it only becomes obvious in the aggregate, by which time the doc is
hard to fix. The pre-edit outline ritual catches collisions and depth
mistakes at the point of writing, not at quarterly cleanup time.

## Deferred decisions

*Things deliberately **not** shipped. Append entries with rationale so future
Claude sessions don't re-propose them.*

- **2026-07-31 — App screens stay `noindex`, not deleted and not fleshed out.**
  `/connect/`, `/cogs/`, `/dashboard/` run on mock data and serve no search
  intent. They're kept reachable for demo purposes but carry `noindex, follow`
  and are excluded from the sitemap (`astro.config.mjs` filter). Revisit only
  when v2.A makes them real. Don't "improve their SEO" — that's not the gap.
- **2026-07-31 — No blog / CMS.** Content ships as individual Astro pages under
  `src/pages/`. At this page count a collection or CMS is overhead. Revisit past
  ~15 content pages.
- **2026-07-31 — Calculators stay client-side and account-free.** No signup, no
  server call, no persistence. They're top-of-funnel; friction there costs more
  than the captured emails are worth pre-beta.
- **2026-07-31 — No per-category TikTok fee table.** The US rate is effectively
  flat (6%, 5% select jewelry) and category grids in old guides are stale. A
  maintained table is a liability we'd have to keep re-verifying; the rate is a
  user input with a documented default instead.
