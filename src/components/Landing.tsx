import { LandingHero } from "./LandingHero";
import { EmailCaptureForm } from "./EmailCaptureForm";
import { AlertCircle, FileSpreadsheet, EyeOff, Plug, Calculator, LineChart } from "lucide-react";

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

const freeTools = [
  {
    href: "/tiktok-shop-fee-calculator/",
    name: "Fee & net profit calculator",
    body: "See what a TikTok Shop order really nets after every fee.",
  },
  {
    href: "/tiktok-shop-break-even-calculator/",
    name: "Break-even price calculator",
    body: "Find the lowest price that doesn't lose money — and your target-margin price.",
  },
  {
    href: "/tiktok-shop-roas-calculator/",
    name: "Break-even ROAS calculator",
    body: "Work out the ROAS your ads actually need to clear your costs.",
  },
  {
    href: "/why-tiktok-shop-payout-is-less-than-sales/",
    name: "Why your payout is less than your sales",
    body: "Every deduction between GMV and the money that reaches your bank.",
  },
];

export function Landing() {
  return (
    <>
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
            <a
              href="/connect/"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              See it now in the demo →
            </a>
          </div>
        </div>
      </section>

      {/* Free tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Free calculators, no signup
          </h2>
          <p className="mt-3 text-muted-foreground">
            Not ready to connect an account? Start with the math. These run in
            your browser on numbers you type in.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2">
          {freeTools.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/40 hover:shadow-md"
            >
              <h3 className="font-semibold group-hover:text-primary">{t.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {t.body}
              </p>
            </a>
          ))}
        </div>
        <div className="mt-8">
          <a
            href="/tools/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            See all free TikTok Shop tools →
          </a>
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
    </>
  );
}
