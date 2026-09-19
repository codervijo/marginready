# Growth Log — marginready.com

> **What this file is for:** an honest, append-only log of growth experiments
> on this site — what was tried, what was measured, what happened. The data
> source is GSC; this file narrates *why*. Future-you (or future-Claude)
> reads this when deciding what to try next, both on this site and on
> related sister sites.

## How to use this (workflow — re-read this when you forget)

**Add an entry whenever you do something growth-relevant.** That includes:
shipping new content, structural SEO changes (sitemap, schema, redirects,
internal linking), tech changes that affect crawl/indexing, marketing
pushes, backlink campaigns. *Not* every code commit — just things you'd
want to point at when GSC numbers move (or fail to).

**Each entry is a hypothesis you can be wrong about.** Commit to a
measurable KPI and an observation window before acting — otherwise "did
this work?" is just a feeling.

### Lifecycle of one entry

1. **Day of action** — append a new dated H2 with `Status: active`, the
   hypothesis, the KPI you'll watch, current baseline numbers, what you
   did, and the date to review (default: today + 28 days, matching GSC's
   reporting window).
2. **Review day** — pull current GSC numbers, compute delta vs baseline.
   Fill in **Result** and **Learning**. Set **Status** to `shipped` (worked,
   keep going), `failed` (didn't pay off, abandon), or extend the review
   another window if results are ambiguous.
3. **Never rewrite older entries.** Wrong hypotheses are the most valuable
   data — they tell you what NOT to repeat on the next site. Append, don't
   edit.

### Where to get the numbers

```bash
cd ~/work/projects/sites/portfolio && uv run portfolio project seo marginready.com
```

That prints the GSC 28d row (impressions / clicks / CTR / position), sitemap
state, and per-URL coverage from the URL Inspection API in one pass. Add
`--refresh` to force fresh URL inspections rather than the cache.

For the whole fleet at once, `uv run portfolio fleet seo`. Or pull from
https://search.google.com/search-console directly.

> **Note (2026-07-31):** this used to read `make run ARGS="gsc sync"`. That
> command no longer exists — GSC moved under `project seo` / `fleet seo`. If the
> command above stops resolving too, check `uv run portfolio --help` rather than
> assuming the data source is gone.

### Format

```
## YYYY-MM-DD — <one-line hypothesis or action>
- **Status:** active | testing | shipped | failed | abandoned
- **Hypothesis:** <what you're betting will work — only on initial / new-bet entries>
- **KPI:** <what GSC metric / query / page>
- **Baseline:** <numbers at start>
- **Action:** <what was done; 1-2 lines>
- **Result:** <numbers after window; "TBD — review YYYY-MM-DD" until then>
- **Learning:** <why it worked / didn't; what to try next; "TBD" until reviewed>
```

---

## 2026-05-28 — TikTok Shop sellers are starved for profit tooling and congregate in…
- **Status:** abandoned *(reviewed 2026-07-31 — never executed; see Learning)*
- **Hypothesis:** TikTok Shop sellers are starved for profit tooling and congregate in high-traffic communities (r/TikTokShop, Facebook seller groups) where pricing and "am I actually making money" questions draw hundreds of comments. By posting genuinely useful breakdowns of TikTok fees and real-profit math — not ads — and offering a free beta to the first 50 sellers, MarginReady earns trust and signups cheaply. Once sellers connect their accounts and enter COGS, the accumulated history and setup create switching costs, turning free beta users into a sticky paid base and a credible source of case-study wins that fuel further organic distribution.
- **KPI:** any GSC traffic — clicks, impressions, indexed-page count
- **Baseline:** 0 clicks / 0 impressions (just deployed)
- **Action:** project scaffolded via `portfolio new bootstrap`; first deploy pending. After deploy: verify in GSC as `sc-domain:marginready.com` and submit the sitemap.
- **Result:** Reviewed 2026-07-31 (36 days past the 2026-06-25 review date).
  **0 clicks / 0 impressions** over GSC's 28d window — unchanged from baseline.
  Coverage: 1 of 5 URLs indexed (20%); only `/` is `submitted_indexed`. Sitemap
  submitted and OK, but last fetched by Google 6 weeks ago.
- **Learning:** **This entry was not reviewable, and that is the finding.** The
  hypothesis was about *community distribution* — posting fee/profit breakdowns
  in r/TikTokShop and Facebook seller groups and offering a free beta. The Action
  line records something else entirely: "project scaffolded, deploy pending." The
  community posting was never done. So the 0 impressions is **not** evidence
  against the hypothesis; it is evidence that nothing was ever shipped to test
  it. The KPI chosen (GSC impressions) also didn't match the hypothesis —
  Reddit/Facebook distribution would show up as referral traffic, not search
  impressions.
  Two process fixes for future entries: (1) an entry's **Action must be the thing
  the Hypothesis bets on**, or it cannot be reviewed — if the action changes,
  close the entry and open a new one; (2) the **KPI must be able to observe the
  channel** the hypothesis names. Marked `abandoned` rather than `failed`
  because an untested bet has not lost — the community-distribution idea remains
  open and unevaluated. What actually shipped instead was SEO content, logged
  separately on 2026-07-30.
- **Status update (2026-07-31):** `active` → `abandoned` (superseded, never executed)

## 2026-07-30 — 0 impressions is a content-supply problem, not a technical one
- **Status:** active
- **Hypothesis:** The site has had ~0 impressions since launch not because of a
  crawl/index defect but because it had exactly **one** page targeting real
  search demand (`/tiktok-shop-fee-calculator/`), and that page was an **orphan**
  — zero inbound internal links, discoverable only via sitemap. Adding a cluster
  of 5 interlinked seller-money pages (2 calculators, 2 guides, 1 hub) and fixing
  the internal-link graph should produce first impressions within one crawl
  cycle, because the fee calculator already proved the format and the queries are
  high-intent commercial ones a 5-page site can plausibly reach.
- **KPI:** GSC impressions (primary), indexed-page count (secondary), clicks
  (tertiary — expected to lag impressions by a cycle)
- **Baseline (GSC sync 2026-07-13):** 0 clicks, 0 impressions. Coverage: `/`
  `submitted_indexed` (last crawl 2026-07-03); `/cogs/`, `/connect/`,
  `/dashboard/` all `url_is_unknown_to_google` (never crawled).
  `/tiktok-shop-fee-calculator/` absent from coverage entirely — it shipped after
  Google's last sitemap download (2026-06-19) and was never IndexNow-submitted.
- **Action:**
  - Diagnosed the orphan: nothing on the site linked to the fee calculator; nav
    was Connect / COGS / Dashboard only.
  - Shipped 5 new indexable pages — `/tools/` (hub), `/tiktok-shop-break-even-calculator/`,
    `/tiktok-shop-roas-calculator/`, `/tiktok-shop-payout-schedule/`,
    `/why-tiktok-shop-payout-is-less-than-sales/` (674–817 words each, FAQPage /
    WebApplication / Article JSON-LD).
  - Fixed the link graph: site-wide footer nav links every content page, homepage
    gained a "Free calculators" section, tools cross-link each other. No content
    page is now more than one click from any other.
  - `noindex, follow` + sitemap exclusion on `/cogs/`, `/connect/`, `/dashboard/`
    (mock-data prototype screens, 69–298 words, zero search intent).
  - Scoped the "Frontend prototype · mock data" footer to the app screens only —
    it was appearing on the public calculator page.
  - Fixed `/connect` → `/connect/` on the homepage (redirect hop).
  - Sitemap goes 5 URLs → 7, all indexable.
- **Result:** Reviewed 2026-09-18 (22 days past the 2026-08-27 review date), via
  `portfolio project seo marginready.com`. GSC 28d: **267 impressions**
  (baseline 0), **0 clicks**, 0.0% CTR, avg position **47.5**. Coverage **5 of
  7 indexed (71%)** (baseline 1 of 5): `/`, `/tiktok-shop-fee-calculator/`,
  `/tiktok-shop-roas-calculator/`, `/tiktok-shop-payout-schedule/`,
  `/why-tiktok-shop-payout-is-less-than-sales/` all `submitted_indexed`, and
  recently crawled (3h to 2w ago). Still `url_is_unknown_to_google`: `/tools/`
  and `/tiktok-shop-break-even-calculator/`. The sitemap was last fetched 3
  months ago.
- **Learning:** **Hypothesis confirmed on impressions.** The count went from 0 to
  267 within one window, and 4 of the 5 newly indexed URLs are content pages
  that were unknown to Google before. That points at supply plus the link graph,
  not technical SEO. Google still hasn't re-fetched the sitemap, so discovery
  came through links, which backs up the 2026-07-31 finding. The operator also
  reports better views after the change. Clicks are still 0: position 47.5 is
  page 5, so the pages are being seen but don't rank high enough to get clicks.
  The next bottleneck is ranking, not discovery. Open question: why are
  `/tools/` and the break-even calculator still undiscovered when the footer
  links to them site-wide? Check before adding more pages. This review didn't
  pull per-page or per-query impression splits.
- **Status update (2026-09-18):** `active` → `shipped`

## 2026-07-31 — pre-deploy baseline: the orphan diagnosis is confirmed by GSC
- **Status:** testing
- **KPI:** GSC per-URL coverage state (does Google know a URL exists at all),
  plus impressions / clicks as the downstream measure
- **Baseline (fresh read, `portfolio project seo marginready.com`, 2026-07-31):**
  - **0 impressions, 0 clicks** (GSC 28d) — unchanged since launch.
  - Coverage **1 of 5 indexed (20%)**. `/` is `submitted_indexed`, crawled 4d ago.
  - `/cogs/`, `/connect/`, `/dashboard/` — `url_is_unknown_to_google`.
  - **`/tiktok-shop-fee-calculator/` — `url_is_unknown_to_google`.**
  - Sitemap submitted and `OK`, but **last fetched by Google 6 weeks ago**.
  - Fleet grade: 🌱 *unproven — young, no traffic yet (nothing else wrong)*; no
    blockers detected.
- **Action:** measurement only — no site change. Taken deliberately *before*
  deploying the 2026-07-30 content cluster (still uncommitted in the working
  tree) so there is a clean pre/post boundary.
- **Result:** The fee calculator has been live and listed in the sitemap since
  ~2026-07-20 and Google **still does not know it exists** 11 days later. Google
  has not re-fetched the sitemap in 6 weeks. This is direct confirmation of the
  2026-07-30 diagnosis: with **zero inbound internal links**, sitemap-only
  discovery did not work — the page was invisible, not merely unranked.
- **Learning:** Two things worth carrying to every other site in the portfolio:
  1. **A sitemap entry is not a discovery mechanism.** Google fetched this
     sitemap once and then not again for 6 weeks. On a low-authority domain,
     crawl scheduling follows links; a URL reachable only from a stale sitemap
     can sit undiscovered indefinitely. Internal links are what actually get a
     page crawled.
  2. **`url_is_unknown_to_google` and "ranks badly" are completely different
     failures** with completely different fixes, and the 0-impressions number
     looks identical for both. Always read per-URL coverage before concluding a
     page "isn't ranking" — it may never have been seen. Checking this earlier
     would have caught the orphan within days of the calculator shipping instead
     of 11 days later.
  This also means the 2026-07-30 cluster is testing **two** changes at once
  (more pages + a real link graph). If impressions arrive, the link-graph fix is
  the more likely cause of *discovery*, and content supply the cause of any
  *breadth* in queries — worth separating when reading the results.
- **Review:** 2026-08-28 (28d), and re-check coverage ~7 days after deploy — the
  fast signal is URLs flipping off `url_is_unknown_to_google`, which should move
  well before impressions do.
- **Review result (2026-09-18):** The fee calculator is now `submitted_indexed`,
  crawled about 2 weeks ago. It had been `url_is_unknown_to_google` at baseline.
  Its sitemap entry wasn't the cause: the sitemap was still last fetched about 3
  months ago. That confirms the link-graph diagnosis. See the 2026-07-30 entry
  for the full numbers.

## 2026-09-18 — v1.C: capture the FBT queries already landing on the fee calculator
- **Status:** active
- **Hypothesis:** GSC shows FBT-intent queries ("fulfilled by tiktok calculator",
  "tiktok fbt calculator", "tiktok (fbt calculator)") matched to
  `/tiktok-shop-fee-calculator/` at positions 54–75, a page that only mentions FBT
  in passing. A dedicated FBT calculator page should earn impressions for those
  queries at a better position than the fee calculator gets. A COGS guide targets
  the one input the product itself asks for.
- **KPI:** impressions + average position for queries containing "fbt" or
  "fulfilled by tiktok" (any page), and first impressions for
  `/tiktok-shop-fbt-fee-calculator/` and `/how-to-calculate-cogs-tiktok-shop/`.
  Pull with `portfolio.gsc.query_with_dims(..., dimensions=['query','page'])`.
- **Baseline (GSC 28d, 2026-09-18):** site 267 impressions / 0 clicks / pos 47.5.
  FBT-intent queries, all on the fee calculator: 3 imp @ 74.7, 2 imp @ 62.5,
  1 imp @ 54.0. COGS queries: none visible (most of the site's impressions come
  from queries GSC anonymizes).
- **Action:** shipped `/tiktok-shop-fbt-fee-calculator/` (chargeable-weight rule,
  storage after the 60 free days, return handling, comparison with self-shipping;
  dollar rates are user inputs because TikTok's rate card changed 3× in 2026) and
  `/how-to-calculate-cogs-tiktok-shop/` (landed-cost calculator). Both are linked
  from the footer, `/tools/`, and each other. Replaced stale January FBT figures
  on the fee calculator with a link to the new page.
- **Manual GSC step (2026-09-18):** operator resubmitted `sitemap-index.xml` and
  requested indexing for `/tools/`, `/tiktok-shop-break-even-calculator/`, and both
  new pages. Right after: all 4 still `url_is_unknown_to_google`; GSC still shows
  the sitemap as last fetched 3 months ago.
- **Result:** TBD — review 2026-10-16
- **Learning:** TBD. Also check whether `/tools/` and the break-even calculator
  left `url_is_unknown_to_google` after the manual index requests (2026-09-18).

## 2026-09-18 — v1.B.1: strengthen the payout schedule page (best position on the site)
- **Status:** active
- **Hypothesis:** `/tiktok-shop-payout-schedule/` is the site's strongest page
  (121 imp @ 28.7 over 28d) but ranks ~46 for its head query "tiktok shop payout".
  It had no tool, no worked examples, and its FAQPage schema had no visible FAQ
  (a mismatch). Adding a payout-date estimator, worked timelines, a late-payout
  checklist, and a visible FAQ should improve average position and widen the
  long-tail queries it's shown for ("when does tiktok shop pay you", "payout time").
- **KPI:** page avg position + impressions (28d); position for "tiktok shop payout";
  count of distinct queries matched to the page.
- **Baseline (GSC 2026-09-18):** 28d: 121 imp / 0 clicks / pos 28.7. 90d queries:
  "tiktok shop payout" 29 imp @ 45.7; "when does tiktok shop pay you" 2 @ 45.0;
  "tiktok shop payout time" 1 @ 40.0; "when do you get paid from tiktok shop" 1 @ 37.0;
  "tiktok affiliate payout schedule" 1 @ 53.0; "tiktok withdrawal processing time" 1 @ 52.0.
- **Action:** added the payout-date estimator (delivery date + settlement days →
  initiation, bank window, reserve release), "Three orders, three payout dates"
  examples including a return-hold case, a 6-step "Payout late?" checklist, a visible
  6-question FAQ (FAQ schema now built from the same array), and Failed status +
  automatic payouts (re-verified against Seller Center). Meta description rewritten;
  title and slug unchanged because the page is already indexed.
  Affiliate payout timing deliberately left out: no official source found.
- **Result:** TBD — review 2026-10-16
- **Learning:** TBD.
