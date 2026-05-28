import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LandingHero } from "@/components/LandingHero";
import { EmailCaptureForm } from "@/components/EmailCaptureForm";
import { AlertCircle, FileSpreadsheet, EyeOff, Plug, Calculator, LineChart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MarginReady — Real profit per product on TikTok Shop" },
      {
        name: "description",
        content:
          "MarginReady shows settled revenue, platform fees, product costs, and net profit per SKU for TikTok Shop sellers.",
      },
      { property: "og:title", content: "MarginReady — Real profit per product on TikTok Shop" },
      {
        property: "og:description",
        content:
          "See your true profit per SKU on TikTok Shop. Settled revenue, fees, refunds, and COGS in one dashboard.",
      },
    ],
  }),
  component: LandingPage,
});

const whyCards = [
  {
    icon: AlertCircle,
    title: "Revenue is not profit",
    body: "GMV looks good until fees, refunds, shipping adjustments, and COGS are included.",
  },
  {
    icon: FileSpreadsheet,
    title: "Spreadsheets break fast",
    body: "Manual SKU-level reconciliation gets messy as orders increase.",
  },
  {
    icon: EyeOff,
    title: "Bad products hide in plain sight",
    body: "A product can sell well and still lose money.",
  },
];

const steps = [
  { icon: Plug, title: "Connect TikTok Shop", body: "Read-only access to your settled finance data." },
  { icon: Calculator, title: "Enter product costs", body: "Add cost per unit so margins are accurate." },
  { icon: LineChart, title: "See real profit per SKU", body: "Sorted from your best earner to your worst." },
];

function LandingPage() {
  return (
    <AppShell>
      <LandingHero />

      {/* Why sellers need this */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Why sellers need this
          </h2>
          <p className="mt-3 text-muted-foreground">
            TikTok Shop shows you GMV. MarginReady shows you what you actually keep.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:gap-5 sm:grid-cols-3">
          {whyCards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-10 grid gap-4 sm:gap-5 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Link
              to="/connect"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              See it now in the demo →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-soft">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Start with your real numbers.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Free for the first 50 TikTok Shop sellers. Setup help included.
            </p>
            <div className="mt-6">
              <EmailCaptureForm ctaLabel="Get early access" />
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
