import { Link } from "@tanstack/react-router";
import { Logo } from "./brand";
import { Button } from "./ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/" hash="product" className="hover:text-foreground">Product</Link>
          <Link to="/" hash="how" className="hover:text-foreground">How it works</Link>
          <Link to="/" hash="pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/docs" className="hover:text-foreground">Docs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/app" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">Sign in</Link>
          <Button asChild size="sm">
            <Link to="/app">Open dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <Logo />
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ZawariFlow. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <Link to="/docs" className="hover:text-foreground">Documentation</Link>
          <a href="#" className="hover:text-foreground">Status</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
