import type { APIRoute } from "astro";
import { renderSaleBreakdownSvg } from "../../lib/sale-breakdown-chart";

// Static SVG version of the v1.N chart, built from the same function as the
// inline chart and the committed PNG.
export const GET: APIRoute = () =>
  new Response(renderSaleBreakdownSvg(), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
