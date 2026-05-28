import { EmailCaptureForm } from "./EmailCaptureForm";
import { DashboardPreview } from "./DashboardPreview";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.95 0.04 155 / 0.5), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
              Built for TikTok Shop sellers
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
              Know your real profit{" "}
              <span className="text-profit">per product</span> on TikTok Shop.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              MarginReady shows settled revenue, platform fees, product costs, and net
              profit per SKU — so you know what is actually making money.
            </p>
            <div className="mt-8">
              <EmailCaptureForm ctaLabel="Get early access" />
            </div>
          </div>
          <div className="lg:pl-6">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
