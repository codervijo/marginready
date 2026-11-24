// Regenerates public/charts/tiktok-shop-sale-breakdown.png (+ src/lib/sale-breakdown-chart.png.sha256) from
// the built SVG. Run after `npx astro build`, inside the sites1 container:
//   node scripts/render-sale-breakdown-png.mjs
// The .sha256 is the hash of the SVG the PNG was rendered from;
// sale-breakdown-chart.test.js fails when the chart changes and the PNG
// wasn't regenerated.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pnpmDir = "node_modules/.pnpm";
const sharpDir = readdirSync(pnpmDir).find((d) => /^sharp@\d/.test(d));
if (!sharpDir) throw new Error("sharp not found under node_modules/.pnpm — run `make deps` first.");
const sharp = require(`../${pnpmDir}/${sharpDir}/node_modules/sharp`);

const svg = readFileSync("dist/charts/tiktok-shop-sale-breakdown.svg", "utf8");
mkdirSync("public/charts", { recursive: true });
await sharp(Buffer.from(svg), { density: 72 })
  .png({ compressionLevel: 9 })
  .toFile("public/charts/tiktok-shop-sale-breakdown.png");
writeFileSync(
  "src/lib/sale-breakdown-chart.png.sha256",
  createHash("sha256").update(svg).digest("hex") + "\n",
);
console.log("✓ wrote public/charts/tiktok-shop-sale-breakdown.png");
