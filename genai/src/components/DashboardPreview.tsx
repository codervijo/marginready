import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ProfitBadge } from "./ProfitBadge";
import { formatCurrency } from "@/lib/format";

const previewProducts = [
  { name: "GlowGrip Phone Case", profit: 7790, margin: 47.5 },
  { name: "Mini Heatless Curling Set", profit: 4615, margin: 37.8 },
  { name: "LED Vanity Mirror", profit: 840, margin: 8.1 },
  { name: "Budget Hair Claw 4-Pack", profit: -660, margin: -11.2 },
];

export function DashboardPreview() {
  return (
    <div className="relative rounded-2xl border border-border bg-card shadow-elevated p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground">Last 30 days · settled</p>
          <h3 className="text-sm font-semibold mt-0.5">Real profit overview</h3>
        </div>
        <ProfitBadge variant="profit">
          <ArrowUpRight className="h-3 w-3" /> Live
        </ProfitBadge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border border-border p-4 bg-background">
          <p className="text-xs text-muted-foreground">Total real profit</p>
          <p className="mt-1 text-2xl font-semibold text-profit">$8,742</p>
        </div>
        <div className="rounded-xl border border-border p-4 bg-background">
          <p className="text-xs text-muted-foreground">Blended margin</p>
          <p className="mt-1 text-2xl font-semibold">20.7%</p>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 bg-muted/50 text-xs font-medium text-muted-foreground">
          <span>Product</span>
          <span className="text-right">Margin</span>
          <span className="text-right">Net profit</span>
        </div>
        <ul className="divide-y divide-border">
          {previewProducts.map((p) => {
            const loss = p.profit < 0;
            return (
              <li
                key={p.name}
                className={`grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 items-center text-sm ${loss ? "bg-loss-soft/40" : ""}`}
              >
                <span className="truncate">{p.name}</span>
                <span className={`text-right tabular-nums ${loss ? "text-loss" : "text-muted-foreground"}`}>
                  {p.margin.toFixed(1)}%
                </span>
                <span className={`text-right font-medium tabular-nums inline-flex items-center justify-end gap-1 ${loss ? "text-loss" : "text-profit"}`}>
                  {loss ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                  {formatCurrency(p.profit)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-loss-soft/60 border border-loss/15 p-3">
        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-loss" />
        <p className="text-xs text-loss">
          <span className="font-semibold">1 product losing money.</span> Review pricing or cost on Budget Hair Claw 4-Pack.
        </p>
      </div>
    </div>
  );
}
