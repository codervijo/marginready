import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function EmailCaptureForm({ ctaLabel = "Get early access" }: { ctaLabel?: string }) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/connect" });
      }}
      className="w-full"
    >
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full max-w-xl">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourshop.com"
          className="flex-1 h-12 rounded-xl border border-border bg-card px-4 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <button
          type="submit"
          className="h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Free for the first 50 sellers. No spam. Early sellers get free setup help.
      </p>
    </form>
  );
}
