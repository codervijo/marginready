// src/__tests__/seo.test.js
// Technical-SEO regression check for Astro. Reads page sources, strips
// frontmatter, asserts the v3.B SEO baseline tags remain.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pageSource = (file) => {
  const raw = readFileSync(join(process.cwd(), 'src', 'pages', file), 'utf8');
  // Strip frontmatter (between leading `---` markers) so we just check the HTML body.
  return raw.replace(/^---[\s\S]*?---\n/, '');
};

const html = pageSource('index.astro');

describe('SEO baseline (src/pages/index.astro)', () => {
  it('has a <title>', () => {
    expect(html).toMatch(/<title>/);
  });

  it('has <meta name="description">', () => {
    expect(html).toMatch(/<meta\s+name="description"/);
  });

  it('has <link rel="canonical">', () => {
    expect(html).toMatch(/<link\s+rel="canonical"/);
  });

  it('has Open Graph tags', () => {
    expect(html).toMatch(/property="og:title"/);
    expect(html).toMatch(/property="og:url"/);
  });

  it('has Twitter card meta', () => {
    expect(html).toMatch(/name="twitter:card"/);
  });

  it('has favicon link', () => {
    expect(html).toMatch(/<link\s+rel="icon"[^>]*href="\/favicon\.svg"/);
  });

  it('has JSON-LD Organization + WebSite', () => {
    expect(html).toMatch(/application\/ld\+json/);
    expect(html).toMatch(/"@type":\s*"Organization"/);
    expect(html).toMatch(/"@type":\s*"WebSite"/);
  });
});

// Every page built to attract search traffic. These must stay indexable and
// keep a full tag set — they are the site's entire organic surface area.
const CONTENT_PAGES = [
  'tools.astro',
  'tiktok-shop-fee-calculator.astro',
  'tiktok-shop-break-even-calculator.astro',
  'tiktok-shop-roas-calculator.astro',
  'tiktok-shop-payout-schedule.astro',
  'why-tiktok-shop-payout-is-less-than-sales.astro',
];

describe.each(CONTENT_PAGES)('SEO baseline (src/pages/%s)', (file) => {
  const body = pageSource(file);

  it('has a <title>', () => {
    expect(body).toMatch(/<title>/);
  });

  it('has <meta name="description">', () => {
    expect(body).toMatch(/<meta\s+name="description"/);
  });

  it('has <link rel="canonical">', () => {
    expect(body).toMatch(/<link\s+rel="canonical"/);
  });

  it('has Open Graph title + url', () => {
    expect(body).toMatch(/property="og:title"/);
    expect(body).toMatch(/property="og:url"/);
  });

  it('has Twitter card meta', () => {
    expect(body).toMatch(/name="twitter:card"/);
  });

  it('has JSON-LD structured data', () => {
    expect(body).toMatch(/application\/ld\+json/);
  });

  it('is NOT noindexed', () => {
    expect(body).not.toMatch(/name="robots"[^>]*noindex/);
  });

  it('has exactly one <h1>', () => {
    const h1s = body.match(/<h1[\s>]/g) ?? [];
    expect(h1s).toHaveLength(1);
  });
});

// App prototype screens run on mock data. They must stay noindexed so thin
// mock content never sets this site's quality baseline, and must stay out of
// the sitemap so Google isn't sent contradictory signals.
const PROTOTYPE_PAGES = ['cogs.astro', 'connect.astro', 'dashboard.astro'];

describe.each(PROTOTYPE_PAGES)('prototype screen (src/pages/%s)', (file) => {
  const body = pageSource(file);

  it('is noindexed', () => {
    expect(body).toMatch(/<meta\s+name="robots"\s+content="noindex, follow"/);
  });
});

describe('sitemap excludes the noindexed prototype screens', () => {
  const config = readFileSync(
    join(process.cwd(), 'astro.config.mjs'),
    'utf8',
  );

  it('filters /cogs/, /connect/ and /dashboard/ out of the sitemap', () => {
    expect(config).toMatch(/filter:/);
    for (const p of ['/cogs/', '/connect/', '/dashboard/']) {
      expect(config).toContain(`"${p}"`);
    }
  });
});

describe('internal linking', () => {
  const layout = readFileSync(
    join(process.cwd(), 'src', 'layouts', 'Layout.astro'),
    'utf8',
  );
  const landing = readFileSync(
    join(process.cwd(), 'src', 'components', 'Landing.tsx'),
    'utf8',
  );

  // Regression guard: the fee calculator shipped as an orphan page with zero
  // inbound internal links, leaving it to be discovered by sitemap alone.
  const MUST_BE_LINKED = [
    '/tools/',
    '/tiktok-shop-fee-calculator/',
    '/tiktok-shop-break-even-calculator/',
    '/tiktok-shop-roas-calculator/',
    '/tiktok-shop-payout-schedule/',
    '/why-tiktok-shop-payout-is-less-than-sales/',
  ];

  it.each(MUST_BE_LINKED)('links to %s from the site-wide footer', (href) => {
    expect(layout).toContain(`"${href}"`);
  });

  it('links to the tools hub from the homepage', () => {
    expect(landing).toContain('"/tools/"');
  });

  it('uses trailing slashes on internal links (avoids a redirect hop)', () => {
    const bad = landing.match(/href="\/[a-z0-9-]+(?<!\/)"/g) ?? [];
    expect(bad).toHaveLength(0);
  });
});
