import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — ZawariFlow" },
      { name: "description", content: "ZawariFlow API and product documentation: purchase orders, splits, virtual accounts, webhooks, and subscriptions." },
    ],
  }),
  component: Docs,
});

const SECTIONS = [
  {
    group: "Getting started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "quickstart", label: "Quickstart" },
      { id: "authentication", label: "Authentication" },
    ],
  },
  {
    group: "Core resources",
    items: [
      { id: "purchase-orders", label: "Purchase orders" },
      { id: "splits", label: "Splits & settlements" },
      { id: "virtual-accounts", label: "Virtual accounts" },
      { id: "subscriptions", label: "Subscriptions" },
    ],
  },
  {
    group: "Platform",
    items: [
      { id: "webhooks", label: "Webhooks" },
      { id: "errors", label: "Errors" },
      { id: "rate-limits", label: "Rate limits" },
    ],
  },
];

function Code({ children }: { children: string }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-xs leading-relaxed">{children}</pre>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border py-10 first:pt-0 last:border-0">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="prose prose-sm mt-4 max-w-none text-sm leading-relaxed text-foreground">{children}</div>
    </section>
  );
}

function Docs() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Logo />
            <span className="hidden text-sm text-muted-foreground sm:inline">/ Docs</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/app" className="hover:text-foreground">Dashboard</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-10">
        <aside className={`${open ? "block" : "hidden"} fixed inset-x-0 top-16 z-30 border-b border-border bg-background p-6 md:sticky md:top-20 md:block md:h-[calc(100vh-6rem)] md:w-60 md:shrink-0 md:border-0 md:bg-transparent md:p-0`}>
          <nav className="space-y-6 text-sm">
            {SECTIONS.map((g) => (
              <div key={g.group}>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{g.group}</p>
                <ul className="space-y-1">
                  {g.items.map((it) => (
                    <li key={it.id}>
                      <a href={`#${it.id}`} onClick={() => setOpen(false)} className="block rounded px-2 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground">{it.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Section id="introduction" title="Introduction">
            <p>
              ZawariFlow is an API-first middleware for B2B supply chain payments. It lets an operator map a single bulk
              purchase order to many downstream suppliers — factory, logistics, customs — and automates the split
              settlement, virtual account routing, and corporate subscriptions in between.
            </p>
            <p className="mt-3">
              The REST API uses predictable resource-oriented URLs, accepts JSON or form-encoded request bodies, returns
              JSON-encoded responses, and uses standard HTTP response codes, verbs, and authentication.
            </p>
          </Section>

          <Section id="quickstart" title="Quickstart">
            <p>Install nothing. Make your first call with a test key.</p>
            <Code>{`curl https://api.zawariflow.com/v1/purchase_orders \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Idempotency-Key: po_demo_1" \\
  -d reference="PO-DEMO" \\
  -d amount=10000000 \\
  -d currency="NGN" \\
  -d "splits[0][supplier]=sup_demo_factory" \\
  -d "splits[0][bps]=8000" \\
  -d "splits[1][supplier]=sup_demo_logistics" \\
  -d "splits[1][bps]=2000"`}</Code>
            <p>A successful response returns the created <code className="rounded bg-secondary px-1 py-0.5">PurchaseOrder</code> with each split.</p>
          </Section>

          <Section id="authentication" title="Authentication">
            <p>All requests are authenticated with a bearer token. Test keys are prefixed <code className="rounded bg-secondary px-1 py-0.5">sk_test_</code> and live keys with <code className="rounded bg-secondary px-1 py-0.5">sk_live_</code>.</p>
            <Code>{`Authorization: Bearer sk_live_xxxxxxxxxxxxxxxxxxxx`}</Code>
            <p>Never expose live keys client-side. Rotate keys from the dashboard at any time.</p>
          </Section>

          <Section id="purchase-orders" title="Purchase orders">
            <p>A <strong>purchase order</strong> represents a bulk inflow that will be split across one or more suppliers when funded.</p>
            <h3 className="mt-6 text-base font-semibold">Create a purchase order</h3>
            <Code>{`POST /v1/purchase_orders

{
  "reference": "PO-48211",
  "amount": 18450000000,
  "currency": "NGN",
  "buyer": "buy_northbridge",
  "splits": [
    { "supplier": "sup_hexa_steel", "bps": 6200 },
    { "supplier": "sup_bluelane",   "bps": 1800 },
    { "supplier": "sup_customs",    "bps": 1400 },
    { "supplier": "sup_platform",   "bps": 600  }
  ]
}`}</Code>
            <p>Splits are expressed in basis points and must sum to 10,000.</p>
          </Section>

          <Section id="splits" title="Splits & settlements">
            <p>When a PO is funded, ZawariFlow creates one <code className="rounded bg-secondary px-1 py-0.5">Settlement</code> per split, dispatched atomically. If any leg fails, the whole batch is reversed.</p>
            <Code>{`GET /v1/settlements?purchase_order=po_48211`}</Code>
          </Section>

          <Section id="virtual-accounts" title="Virtual accounts">
            <p>Issue per-counterparty virtual accounts to auto-route inflows to the correct ledger.</p>
            <Code>{`POST /v1/virtual_accounts

{
  "label": "Inflows · Northbridge Trading",
  "route_to": "buy_northbridge"
}`}</Code>
          </Section>

          <Section id="subscriptions" title="Subscriptions">
            <p>High-volume corporate subscriptions are billed against a customer mandate. Plans support monthly, quarterly, and annual cycles.</p>
            <Code>{`POST /v1/subscriptions

{
  "customer": "cus_bluepine",
  "plan": "plan_enterprise_monthly",
  "amount": 450000000,
  "currency": "NGN",
  "mandate": "mnd_xxx"
}`}</Code>
          </Section>

          <Section id="webhooks" title="Webhooks">
            <p>Subscribe to events to react to lifecycle changes. Payloads are signed with <code className="rounded bg-secondary px-1 py-0.5">X-ZawariFlow-Signature</code>.</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
              <li><code className="rounded bg-secondary px-1 py-0.5">purchase_order.funded</code></li>
              <li><code className="rounded bg-secondary px-1 py-0.5">settlement.succeeded</code></li>
              <li><code className="rounded bg-secondary px-1 py-0.5">settlement.failed</code></li>
              <li><code className="rounded bg-secondary px-1 py-0.5">subscription.charged</code></li>
            </ul>
          </Section>

          <Section id="errors" title="Errors">
            <p>The API uses conventional HTTP response codes.</p>
            <Code>{`{
  "error": {
    "type": "invalid_request_error",
    "code": "splits_do_not_sum_to_10000",
    "message": "Splits must sum to exactly 10000 basis points.",
    "param": "splits"
  }
}`}</Code>
          </Section>

          <Section id="rate-limits" title="Rate limits">
            <p>The default limit is 200 requests per second per workspace, with bursts up to 400. Contact us for enterprise quotas.</p>
          </Section>
        </main>
      </div>
    </div>
  );
}
