# bugs.md — marginready.com

Bug journal. The operator reports; Claude writes and maintains the entries. One H3 per bug with
a stable `BUG-NNN` ID (next ID = highest + 1). When a bug is fixed, move it to `## Fixed bugs`
and add a `**Fixed in**` line with the commit SHA and phase. Never delete an entry.

Fields: **Repro** · **Expected** · **Actual** · **Where** · **Severity**
(`blocker` / `major` / `minor` / `cosmetic`) · **Notes**.

## Open bugs

### BUG-001 · 2026-10-23 — FBT calculator page has a duplicate H2 and calculator labels as H2s

- **Repro:** `curl -s https://marginready.com/tiktok-shop-fbt-fee-calculator/ | grep -o '<h2[^>]*>[^<]*'`,
  or the heading audit from 2026-10-23 (`write-lamill-seo-page` checklist).
- **Expected:** one H2 per prose section, each label unique on the page. Calculator card
  titles are not document sections and don't belong in the heading outline.
- **Actual:** 15 H2s. "FBT vs shipping it yourself" appears twice: once as a result card in
  the calculator and once as a prose section. Seven calculator card titles are H2s: "1 · Unit
  size", "2 · Fees from your FBT rate card", "3 · The sale", "4 · If you shipped it yourself",
  "Chargeable weight", "FBT cost per unit", "FBT vs shipping it yourself". The heading
  outline Google sees starts with form labels instead of the page's content.
- **Where:** `src/components/FbtCalculator.tsx:201–288` (the 7 `<h2 className={cardTitle}>`
  card titles); `src/pages/tiktok-shop-fbt-fee-calculator.astro:229` (the prose H2 the
  card title duplicates).
- **Severity:** cosmetic. No visible breakage; it's a heading-structure and templating signal
  on a page Google hasn't discovered yet (`url_is_unknown_to_google` as of 2026-10-23).
- **Notes:** the other calculators share the pattern on a smaller scale. Their card titles are
  also H2s ("Your numbers" / "Breakdown" on the fee calculator, "Your costs" / "Break-even" on
  break-even, "Your unit economics" / "What you need to hit" on ROAS, "Your order" / "When the
  money moves" on the payout estimator, "One purchase order" on COGS). Only FBT has a duplicate label. A fix
  that demotes card titles to a non-heading element (or `h3`) in every calculator component
  would cover all of them; check `seo.test.js` heading assertions when doing it. Not
  scheduled in `docs/prd.md`.

## Fixed bugs
