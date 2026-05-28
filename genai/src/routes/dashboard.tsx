import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SummaryMetricCard } from "@/components/SummaryMetricCard";
import { ProfitInsightCard } from "@/components/ProfitInsightCard";
import { ProductProfitTable } from "@/components/ProductProfitTable";
import { ProductProfitMobileCard } from "@/components/ProductProfitMobileCard";
import { products, summary } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { Calendar, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Real profit dashboard — MarginReady" },
      { name: "description", content: "Settled TikTok Shop performance after fees and COGS." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const sorted = [...products].sort((a, b) => b.netProfit - a.netProfit);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Real profit dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Settled TikTok Shop performance after fees and COGS
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 h-10 rounded-xl border border-border bg-card px-4 text-sm font-medium shadow-card hover:bg-muted transition self-start sm:self-auto"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Last 30 days
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Summary strip */}
        <div className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-3">
          <SummaryMetricCard
            label="Total real profit"
            value={formatCurrency(summary.totalRealProfit)}
            tone="profit"
            hint="After fees, refunds, and COGS"
          />
          <SummaryMetricCard
            label="Total revenue"
            value={formatCurrency(summary.totalRevenue)}
            hint="Settled GMV, last 30 days"
          />
          <SummaryMetricCard
            label="Blended margin"
            value={`${summary.blendedMargin}%`}
            hint="Across all SKUs"
          />
        </div>

        {/* Insight */}
        <div className="mt-5">
          <ProfitInsightCard>
            <span className="font-semibold">3 products generate 78% of profit.</span>{" "}
            <span className="text-loss font-medium">2 products are underwater</span> — review pricing or COGS to recover margin.
          </ProfitInsightCard>
        </div>

        {/* Product table / cards */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Products by net profit</h2>
            <span className="text-xs text-muted-foreground">{sorted.length} SKUs</span>
          </div>

          {/* Desktop */}
          <div className="hidden lg:block">
            <ProductProfitTable products={sorted} />
          </div>

          {/* Mobile / tablet */}
          <div className="lg:hidden grid gap-3 sm:grid-cols-2">
            {sorted.map((p) => (
              <ProductProfitMobileCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
