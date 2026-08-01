// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

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
