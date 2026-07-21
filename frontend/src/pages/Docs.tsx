import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand";

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
      { id: "bank-verification", label: "Bank Verification" },
      { id: "supplier-section", label: "Supplier Section" },
    ],
  },
  {
    group: "Platform",
    items: [
      { id: "errors", label: "Errors" },
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

export default function Docs() {
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
              ZawariFlow is a B2B supply chain payment platform that enables businesses to digitize purchase orders, onboard suppliers, collect payments through dedicated virtual accounts, and settle suppliers directly into their verified bank accounts.

The platform acts as the payment orchestration layer between buyers, suppliers, and financial institutions by automating collections, payment tracking, and supplier settlements.
            </p>
            <p className="mt-3">
              The REST API uses predictable resource-oriented URLs, accepts JSON or form-encoded request bodies, returns
              JSON-encoded responses, and uses standard HTTP response codes, verbs, and authentication.
            </p>
          </Section>

          <Section id="quickstart" title="Quickstart">
            <p>Install nothing. Make your first call with a test key.</p>
            <Code>{`1. Register your company

2. Create suppliers

3. Verify supplier bank accounts

4. Generate virtual accounts

5. Create purchase orders

6. Receive payments

7. Settle suppliers`}</Code>
            <p>A successful response returns the created <code className="rounded bg-secondary px-1 py-0.5">PurchaseOrder</code> with each split.</p>
          </Section>

          <Section id="authentication" title="Authentication">
            <p>All requests are authenticated with a bearer token. Test keys are prefixed <code className="rounded bg-secondary px-1 py-0.5">sk_test_</code> and live keys with <code className="rounded bg-secondary px-1 py-0.5">sk_live_</code>.</p>
            <Code>{`Authorization: Bearer <JWT_ACCESS_TOKEN>`}</Code>
            <p>Never expose live keys client-side. Rotate keys from the dashboard at any time.</p>
          </Section>

          <Section id="purchase-orders" title="Purchase orders">
            <p>A <strong>purchase order</strong> represents a commercial agreement between a buyer and a supplier. Purchase Orders are used as the source of truth for every settlement made through ZawariFlow.</p>
            <h3 className="mt-6 text-base font-semibold">Create a purchase order</h3>
            <Code>{`POST /api/suppliers/purchase-orders/create/

{
  "buyer": "string",
  "amount": "59",
  "currency": "string",
  "suppliers": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "notes": "string",
  "items": [
    {
      "name": "string",
      "quantity": 9223372036854776000,
      "unit": "string"
    }
  ]
}`}</Code>
            <p>Splits are expressed in basis points and must sum to 10,000.</p>
          </Section>

          <Section id="splits" title="Splits & settlements">
            <p>When a PO is funded, ZawariFlow creates one <code className="rounded bg-secondary px-1 py-0.5">Settlement</code> per split, dispatched atomically. If any leg fails, the whole batch is reversed.</p>
            <Code>{`POST /payments/settlements/create/
{
    "purchase_order":"...",
    "supplier":"...",
    "amount":"25000"
}

POST /payments/settlements/{id}/process/

Pending

↓

Processing

↓

Success

or

Failed
            `}</Code>
          </Section>

          <Section id="virtual-accounts" title="Virtual accounts">
            <p>Issue per-counterparty virtual accounts to auto-route inflows to the correct ledger.</p>
            <Code>{`POST /payments/virtual-accounts/create/

{
    "supplier":"supplier_uuid"
}

`}</Code>
          </Section>


          <Section id="bank-verification" title="Bank Verification">
            <p>Verifies against Monnify</p>
            <Code>{`POST /payments/suppliers/{supplier_id}/bank-account/

{
    "bank_code":"035",
    "bank_name":"Wema Bank",
    "account_number":"0123456789"
}

`}</Code>
          </Section>

          <Section id="supplier-section" title="Supplier Section">
            <p>Suppliers belong to one company</p>
            <Code>{`POST /suppliers/

Create a supplier belonging to your company.

{
    "name":"ABC Steel Ltd",
    "email":"finance@abcsteel.com",
    "phone":"+234..."
}

`}</Code>
          </Section>




          <Section id="errors" title="Errors">
            <p>The API uses conventional HTTP response codes.</p>
            <Code>{`{
  "error": {
    "detail":"Supplier does not belong to your company."
}

  "error": {
    "detail":"Settlement already processed."
}

  "error": {
    "bank_code":"Invalid bank code."
}

  "error": {
    "account_number":"Account verification failed."
}

}`}</Code>
          </Section>

        </main>
      </div>
    </div>
  );
}
