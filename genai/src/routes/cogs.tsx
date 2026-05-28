import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CogsEntryTable } from "@/components/CogsEntryTable";

export const Route = createFileRoute("/cogs")({
  head: () => ({
    meta: [
      { title: "Enter your product costs — MarginReady" },
      { name: "description", content: "Add your cost per unit so MarginReady can calculate true net profit per SKU." },
    ],
  }),
  component: CogsPage,
});

function CogsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Enter your product costs
          </h1>
          <p className="mt-2 text-muted-foreground">
            Add your cost per unit so MarginReady can calculate true net profit.
          </p>
        </header>
        <CogsEntryTable />
      </div>
    </AppShell>
  );
}
