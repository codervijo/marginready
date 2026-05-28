# Server-side code not ported to Astro

The source (`genai/`) is a TanStack Start app with SSR. Astro here is
configured for static output (`output: 'static'`), so the framework
server runtime and its error-handling wrappers do not translate. The
following were intentionally dropped during the port. If this site
ever needs runtime SSR / API behavior, re-introduce equivalents using
Astro endpoints (`src/pages/**/*.ts`) or an adapter.

- TODO: `genai/src/server.ts` — TanStack Start SSR fetch entry +
  catastrophic-500 normalization (h3 swallowed-error handling).
- TODO: `genai/src/start.ts` — `createStart` request middleware that
  renders a custom 500 error page on uncaught server errors.
- TODO: `genai/src/router.tsx` — TanStack Router + React Query client
  bootstrap (`createRouter`, `QueryClient`). No router needed; Astro
  file-based routing replaces it.
- TODO: `genai/src/routeTree.gen.ts` — generated route tree (TanStack
  Router codegen). Not applicable to Astro.
- TODO: `genai/src/routes/__root.tsx` — root shell + `<HeadContent>` /
  `<Scripts>` + 404 + error boundary. 404 ported to
  `src/pages/404.astro`; the React error boundary has no Astro static
  equivalent.
- TODO: `genai/src/lib/error-capture.ts` — last-error capture used by
  the SSR error wrapper.
- TODO: `genai/src/lib/error-page.ts` — server-rendered HTML 500 page.
- TODO: `genai/src/lib/config.server.ts` — server-only config.
- TODO: `genai/src/lib/api/example.functions.ts` — TanStack server
  functions example.
- TODO: `genai/src/hooks/use-mobile.tsx` — `useIsMobile` hook. Only
  consumed by the unported shadcn `ui/sidebar`; no ported component
  uses it.
