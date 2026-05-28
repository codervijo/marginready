import { cn } from "../lib/utils";

export function SummaryMetricCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "profit" | "loss";
}) {
  const valueClass =
    tone === "profit" ? "text-profit" : tone === "loss" ? "text-loss" : "text-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-3xl sm:text-4xl font-semibold tabular-nums tracking-tight", valueClass)}>
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
