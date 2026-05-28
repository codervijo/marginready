import { cn } from "../lib/utils";

export function ProfitBadge({
  variant,
  children,
  className,
}: {
  variant: "profit" | "loss" | "warning" | "neutral";
  children: React.ReactNode;
  className?: string;
}) {
  const styles = {
    profit: "bg-profit-soft text-profit border-profit/20",
    loss: "bg-loss-soft text-loss border-loss/20",
    warning: "bg-warning-soft text-warning-foreground border-warning/30",
    neutral: "bg-muted text-muted-foreground border-border",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        styles,
        className,
      )}
    >
      {children}
    </span>
  );
}
