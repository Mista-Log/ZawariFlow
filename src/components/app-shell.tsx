import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Users,
  Split,
  Wallet,
  Repeat,
  BookOpen,
  Bell,
  Search,
} from "lucide-react";
import { Logo } from "./brand";

const NAV: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/purchase-orders", label: "Purchase Orders", icon: FileText },
  { to: "/app/suppliers", label: "Suppliers", icon: Users },
  { to: "/app/settlements", label: "Settlements", icon: Split },
  { to: "/app/virtual-accounts", label: "Virtual Accounts", icon: Wallet },
  { to: "/app/subscriptions", label: "Subscriptions", icon: Repeat },
];

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          <div className="px-3 pt-6 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Resources
          </div>
          <Link
            to="/docs"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Documentation
          </Link>
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              AO
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Adaeze O.</p>
              <p className="truncate text-xs text-muted-foreground">Operator · Demo Co.</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
          <div className="flex flex-1 items-center">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search POs, suppliers, settlements…"
                className="w-full rounded-md border border-input bg-secondary/40 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Live mode
            </span>
            <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
