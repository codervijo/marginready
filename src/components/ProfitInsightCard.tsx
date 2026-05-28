import { Sparkles } from "lucide-react";

export function ProfitInsightCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-secondary p-5 sm:p-6 shadow-card flex items-start gap-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Insight
        </p>
        <p className="mt-1 text-sm text-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
