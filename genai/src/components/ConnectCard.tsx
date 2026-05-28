import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { TrustChecklist } from "./TrustChecklist";

export function ConnectCard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/cogs" }), 900);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-border bg-card shadow-soft p-6 sm:p-8">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground mb-5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M19.5 8.4a6.3 6.3 0 0 1-3.7-1.2v7.6a5.4 5.4 0 1 1-5.4-5.4v2.7a2.7 2.7 0 1 0 2.7 2.7V3h2.7a3.7 3.7 0 0 0 3.7 3.7v1.7Z"/></svg>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Connect your TikTok Shop</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          MarginReady uses read-only access to calculate your settled revenue, fees,
          refunds, and product-level profit.
        </p>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="mt-6 w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-soft transition hover:opacity-90 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Connecting…
            </>
          ) : (
            "Connect TikTok Shop"
          )}
        </button>

        <p className="mt-3 text-xs text-muted-foreground text-center">
          Mock connection for this demo. No real account access required.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          What we access
        </p>
        <TrustChecklist
          items={[
            "Read-only finance data",
            "No product edits",
            "No order changes",
            "You control your COGS",
          ]}
        />
      </div>
    </div>
  );
}
