import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Split, Wallet, Repeat, Shield, Code2, CheckCircle2 } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/marketing-nav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZawariFlow — B2B Supply Chain Payments" },
      { name: "description", content: "API-first middleware for mapping bulk POs to multiple suppliers with automated split settlements, virtual account routing, and corporate subscriptions." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              API-first · Built for B2B operators
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
              Move complex supply chain payments without the spreadsheets.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              ZawariFlow is the middleware between your purchase orders and every party that gets paid — factory,
              logistics, customs, and beyond. One bulk inflow in, automated split settlements out.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/app">
                  Open dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/docs">Read the API docs</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> SOC 2 controls</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> PCI-DSS scope minimized</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 99.99% settlement SLA</span>
            </div>
          </div>

          {/* Visual: PO → splits diagram */}
          <div className="relative">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Purchase Order · PO-48211</p>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Settled</span>
              </div>
              <p className="font-mono text-2xl font-semibold tracking-tight">₦ 184,500,000.00</p>
              <p className="mt-1 text-xs text-muted-foreground">Bulk inflow · Northbridge Trading Ltd</p>
              <div className="my-6 h-px bg-border" />
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Auto-split to 4 suppliers</p>
              <div className="space-y-2.5">
                {[
                  { name: "Hexa Steel Factory", role: "Goods", pct: 62, amt: "114,390,000" },
                  { name: "BlueLane Logistics", role: "Freight", pct: 18, amt: "33,210,000" },
                  { name: "Customs & Duties", role: "Tariffs", pct: 14, amt: "25,830,000" },
                  { name: "ZawariFlow", role: "Fee", pct: 6, amt: "11,070,000" },
                ].map((s) => (
                  <div key={s.name} className="rounded-md border border-border bg-secondary/30 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">₦ {s.amt}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                        <div className="h-full bg-primary" style={{ width: `${s.pct}%` }} />
                      </div>
                      <span className="w-10 text-right text-xs text-muted-foreground">{s.pct}%</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="product" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Built for the messy middle of B2B money</h2>
            <p className="mt-3 text-muted-foreground">
              Four primitives that compose into any supply chain payment flow you operate today — or want to operate tomorrow.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Boxes, title: "PO Mapping", body: "Map one bulk purchase order to every downstream supplier with deterministic rules." },
              { icon: Split, title: "Split Settlements", body: "Disburse to N parties in one atomic operation. Percentage or fixed, with reversibility." },
              { icon: Wallet, title: "Virtual Accounts", body: "Issue per-counterparty virtual accounts and auto-route inflows to the right ledger." },
              { icon: Repeat, title: "Corporate Subscriptions", body: "High-volume recurring billing for enterprise contracts with mandate management." },
            ].map((f) => (
              <div key={f.title} className="bg-background p-6">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">How a payment flows</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">From PO creation to final supplier credit — observable end-to-end.</p>
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { n: "01", t: "Create PO", d: "Operator or API submits a purchase order with line items and supplier splits." },
              { n: "02", t: "Receive funds", d: "Buyer pays into a dedicated virtual account routed to the PO." },
              { n: "03", t: "Auto-split", d: "ZawariFlow disburses to each supplier per the mapping. Atomic, reversible." },
              { n: "04", t: "Reconcile", d: "Every leg ledgered, with webhooks and exports your finance team can trust." },
            ].map((s) => (
              <li key={s.n} className="rounded-lg border border-border bg-background p-5">
                <p className="font-mono text-xs text-primary">{s.n}</p>
                <p className="mt-2 font-semibold">{s.t}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* API teaser */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Code2 className="h-3.5 w-3.5" /> Developer first
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight">A REST API your engineers will actually like.</h2>
            <p className="mt-3 text-muted-foreground">
              Idempotent endpoints, predictable error shapes, signed webhooks. Versioned and documented.
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link to="/docs">Browse documentation <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">POST /v1/purchase_orders</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-foreground">
{`curl https://api.zawariflow.com/v1/purchase_orders \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Idempotency-Key: po_48211" \\
  -d reference="PO-48211" \\
  -d amount=18450000000 \\
  -d currency="NGN" \\
  -d "splits[0][supplier]=sup_hexa_steel" \\
  -d "splits[0][bps]=6200" \\
  -d "splits[1][supplier]=sup_bluelane" \\
  -d "splits[1][bps]=1800"`}
            </pre>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Straightforward pricing</h2>
            <p className="mt-3 text-muted-foreground">Pay for what you settle. No per-seat fees, no surprises.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Starter", price: "Free", desc: "For pilots and integrations.", features: ["Up to ₦50M / month", "Sandbox + live keys", "Email support"] },
              { name: "Growth", price: "0.6%", suffix: "/ settled volume", desc: "For active operators.", features: ["Unlimited POs", "Webhooks + exports", "Priority support"], featured: true },
              { name: "Enterprise", price: "Custom", desc: "Bespoke flows and SLAs.", features: ["Dedicated infra", "Custom routing rules", "Solution architect"] },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl border p-6 ${p.featured ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {p.price}
                  {p.suffix ? <span className="ml-1 text-sm font-normal text-muted-foreground">{p.suffix}</span> : null}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {f}</li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full" variant={p.featured ? "default" : "outline"}>
                  <Link to="/app">Get started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Ready to wire up your first PO?</h2>
            <p className="mt-2 text-sm opacity-90">Try the dashboard with sample data, then plug in the API.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/app">Open dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/docs">View docs <Shield className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
