import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export function AppShell({
  children,
  showNav = true,
}: {
  children: React.ReactNode;
  showNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {showNav && (
        <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
              </span>
              <span>MarginReady</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <Link to="/connect" className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition" activeProps={{ className: "px-3 py-2 rounded-md text-foreground bg-muted" }}>
                Connect
              </Link>
              <Link to="/cogs" className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition" activeProps={{ className: "px-3 py-2 rounded-md text-foreground bg-muted" }}>
                COGS
              </Link>
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition" activeProps={{ className: "px-3 py-2 rounded-md text-foreground bg-muted" }}>
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
      )}
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>© 2026 MarginReady. Built for TikTok Shop sellers.</span>
          <span>Frontend prototype · mock data</span>
        </div>
      </footer>
    </div>
  );
}
