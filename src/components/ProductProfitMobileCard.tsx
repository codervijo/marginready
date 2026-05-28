import type { Product } from "../lib/mock-data";
import { formatCurrency, formatNumber } from "../lib/format";
import { ProfitBadge } from "./ProfitBadge";
import { AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react";

export function ProductProfitMobileCard({ product }: { product: Product }) {
  const loss = product.netProfit < 0;
  return (
    <div
      className={`rounded-2xl border p-4 shadow-card ${loss ? "border-loss/20 bg-loss-soft/40" : "border-border bg-card"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{product.sku}</p>
        </div>
        {loss && (
          <ProfitBadge variant="loss">
            <AlertTriangle className="h-3 w-3" /> Losing
          </ProfitBadge>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Net profit</p>
          <p
            className={`mt-0.5 text-2xl font-semibold tabular-nums inline-flex items-center gap-1 ${loss ? "text-loss" : "text-profit"}`}
          >
            {loss ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
            {formatCurrency(product.netProfit)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Margin</p>
          <p className={`mt-0.5 text-lg font-semibold tabular-nums ${loss ? "text-loss" : "text-foreground"}`}>
            {product.margin.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-border pt-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Units</span>
          <span className="tabular-nums">{formatNumber(product.unitsSold)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Revenue</span>
          <span className="tabular-nums">{formatCurrency(product.grossRevenue)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fees</span>
          <span className="tabular-nums">{formatCurrency(product.totalFees)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">COGS</span>
          <span className="tabular-nums">{formatCurrency(product.cogs)}</span>
        </div>
      </div>

      {loss && (
        <p className="mt-3 text-xs text-loss">Review pricing, fees, or cost</p>
      )}
    </div>
  );
}
