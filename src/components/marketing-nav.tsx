import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./brand";
import { Button } from "./ui/button";

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="/#product" className="hover:text-foreground">Product</a>
          <a href="/#how" className="hover:text-foreground">How it works</a>
          <a href="/#pricing" className="hover:text-foreground">Pricing</a>
          <Link to="/docs" className="hover:text-foreground">Docs</Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth/signin">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/auth/signup">Get started</Link>
          </Button>
        </div>

        <button
          onClick={() => setOpen((s) => !s)}
          className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-sm">
            <a href="/#product" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground">Product</a>
            <a href="/#how" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground">How it works</a>
            <a href="/#pricing" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground">Pricing</a>
            <Link to="/docs" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground">Docs</Link>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/auth/signin" onClick={() => setOpen(false)}>Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth/signup" onClick={() => setOpen(false)}>Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
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
