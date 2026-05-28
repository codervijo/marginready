import type { Product } from "../lib/mock-data";
import { formatCurrency, formatNumber } from "../lib/format";
import { ProfitBadge } from "./ProfitBadge";
import { AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react";

export function ProductProfitTable({ products }: { products: Product[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="grid grid-cols-[2fr_0.7fr_1fr_1fr_1fr_1.1fr_0.9fr] gap-4 px-6 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <span>Product</span>
        <span className="text-right">Units</span>
        <span className="text-right">Revenue</span>
        <span className="text-right">Fees</span>
        <span className="text-right">COGS</span>
        <span className="text-right">Net profit</span>
        <span className="text-right">Margin</span>
      </div>
      <ul className="divide-y divide-border">
        {products.map((p) => {
          const loss = p.netProfit < 0;
          return (
            <li
              key={p.id}
              className={`grid grid-cols-[2fr_0.7fr_1fr_1fr_1fr_1.1fr_0.9fr] gap-4 px-6 py-4 items-center text-sm ${loss ? "bg-loss-soft/40" : ""}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{p.name}</p>
                  {loss && (
                    <ProfitBadge variant="loss" className="shrink-0">
                      <AlertTriangle className="h-3 w-3" /> Losing money
                    </ProfitBadge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{p.sku}</p>
                {loss && (
                  <p className="text-xs text-loss mt-1">Review pricing, fees, or cost</p>
                )}
              </div>
              <span className="text-right tabular-nums">{formatNumber(p.unitsSold)}</span>
              <span className="text-right tabular-nums">{formatCurrency(p.grossRevenue)}</span>
              <span className="text-right tabular-nums text-muted-foreground">
                {formatCurrency(p.totalFees)}
              </span>
              <span className="text-right tabular-nums text-muted-foreground">
                {formatCurrency(p.cogs)}
              </span>
              <span
                className={`text-right font-semibold tabular-nums inline-flex items-center justify-end gap-1 ${loss ? "text-loss" : "text-profit"}`}
              >
                {loss ? (
                  <ArrowDownRight className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
                {formatCurrency(p.netProfit)}
              </span>
              <span className={`text-right tabular-nums ${loss ? "text-loss" : "text-foreground"}`}>
                {p.margin.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
