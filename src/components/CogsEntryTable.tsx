import { useMemo, useState } from "react";
import { products } from "../lib/mock-data";
import { formatNumber } from "../lib/format";
import { ArrowRight } from "lucide-react";

export function CogsEntryTable() {
  const initial = useMemo(
    () =>
      Object.fromEntries(
        products.map((p) => [p.id, (p.cogs / p.unitsSold).toFixed(2)]),
      ) as Record<number, string>,
    [],
  );
  const [costs, setCosts] = useState<Record<number, string>>(initial);

  const readyCount = Object.values(costs).filter((v) => parseFloat(v) > 0).length;

  return (
    <div className="pb-28">
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1.2fr] gap-4 px-6 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Product</span>
          <span>SKU</span>
          <span className="text-right">Units sold</span>
          <span className="text-right">Cost per unit</span>
        </div>

        <ul className="divide-y divide-border">
          {products.map((p) => (
            <li
              key={p.id}
              className="px-4 sm:px-6 py-4 md:grid md:grid-cols-[2fr_1fr_1fr_1.2fr] md:gap-4 md:items-center"
            >
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                <p className="md:hidden text-xs text-muted-foreground mt-0.5">
                  {p.sku} · {formatNumber(p.unitsSold)} units
                </p>
              </div>
              <p className="hidden md:block text-sm text-muted-foreground tabular-nums">{p.sku}</p>
              <p className="hidden md:block text-sm text-right tabular-nums">
                {formatNumber(p.unitsSold)}
              </p>
              <div className="mt-3 md:mt-0 flex items-center md:justify-end gap-2">
                <label className="md:hidden text-xs text-muted-foreground">Cost / unit</label>
                <div className="relative w-full md:w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    inputMode="decimal"
                    type="number"
                    step="0.01"
                    min="0"
                    value={costs[p.id] ?? ""}
                    onChange={(e) =>
                      setCosts((c) => ({ ...c, [p.id]: e.target.value }))
                    }
                    className="w-full h-10 rounded-lg border border-input bg-background pl-7 pr-3 text-sm text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{readyCount} products</span> ready
          </p>
          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 sm:px-5 text-sm font-medium shadow-soft transition hover:opacity-90"
          >
            <span className="hidden sm:inline">Save costs and view dashboard</span>
            <span className="sm:hidden">Save & view</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
