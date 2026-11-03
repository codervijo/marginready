// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// Sitemap <lastmod> from the last git commit that touched the page's source
// file. Omitted (never guessed) when git can't answer, e.g. in a shallow clone
// without the file's history. Shared components and the layout aren't
// tracked, so this undercounts changes; it never invents one.
const pageFile = (url) => {
  const p = new URL(url).pathname.replace(/^\/|\/$/g, '');
  return `src/pages/${p || 'index'}.astro`;
};
// In a shallow clone every file's "last commit" is the clone's tip, which
// would stamp every page with the deploy date. Treat that as unknown.
const git = (args) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
let historyUsable = false;
try {
  historyUsable = git(['rev-parse', '--is-shallow-repository']) === 'false';
} catch {
  historyUsable = false;
}
const lastCommitDate = (file) => {
  if (!historyUsable || !existsSync(file)) return undefined;
  try {
    return git(['log', '-1', '--format=%cI', '--', file]) || undefined;
  } catch {
    return undefined;
  }
};

export default defineConfig({
  site: 'https://marginready.com',
  integrations: [
    sitemap({
      // App prototype screens run on mock data and carry `noindex`. Listing a
      // noindexed URL in the sitemap sends Google contradictory signals, so
      // they are excluded here too. Keep this in sync with the `noindex` meta
      // tags in src/pages/{cogs,connect,dashboard}.astro.
      filter: (page) =>
        !["/cogs/", "/connect/", "/dashboard/"].some((p) =>
          page.endsWith(p),
        ),
      serialize: (item) => {
        const lastmod = lastCommitDate(pageFile(item.url));
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    react(),
  ],
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
  },
});
