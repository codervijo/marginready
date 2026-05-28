import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ConnectCard } from "@/components/ConnectCard";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect TikTok Shop — MarginReady" },
      { name: "description", content: "Securely connect your TikTok Shop to MarginReady with read-only access." },
    ],
  }),
  component: ConnectPage,
});

function ConnectPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <ConnectCard />
      </div>
    </AppShell>
  );
}
