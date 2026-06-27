import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
  Menu,
  X,
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

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
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
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <BookOpen className="h-4 w-4" />
          Documentation
        </Link>
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            AO
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Adaeze O.</p>
            <p className="truncate text-xs text-muted-foreground">Operator · Demo Co.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function AppShell() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur sm:gap-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex min-w-0 flex-1 items-center">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search…"
                className="w-full rounded-md border border-input bg-secondary/40 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success lg:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Live mode
            </span>
            <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary md:hidden">
              AO
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
