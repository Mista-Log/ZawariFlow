import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/suppliers")({
  component: Suppliers,
});

const SUPPLIERS = [
  { name: "Hexa Steel Factory", category: "Goods", country: "NG", account: "VA-30412", volume: "412.8M", status: "Verified" },
  { name: "BlueLane Logistics", category: "Logistics", country: "NG", account: "VA-30418", volume: "188.4M", status: "Verified" },
  { name: "Customs & Duties Bureau", category: "Tariffs", country: "NG", account: "VA-30001", volume: "146.2M", status: "System" },
  { name: "PortaFreight EU", category: "Logistics", country: "NL", account: "VA-30521", volume: "92.1M", status: "Verified" },
  { name: "AceTextiles Ltd", category: "Goods", country: "GH", account: "VA-30577", volume: "44.6M", status: "Pending KYC" },
  { name: "Sahel Packaging Co.", category: "Goods", country: "NE", account: "VA-30602", volume: "23.0M", status: "Verified" },
];

function badge(s: string) {
  switch (s) {
    case "Verified": return "bg-success/10 text-success";
    case "Pending KYC": return "bg-warning/15 text-warning-foreground";
    case "System": return "bg-primary/10 text-primary";
    default: return "bg-secondary";
  }
}

function Suppliers() {
  return (
    <>
      <PageHeader
        title="Suppliers"
        description="Factories, logistics partners, and customs payees you settle to."
        actions={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add supplier</Button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {SUPPLIERS.map((s) => (
          <div key={s.name} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                  {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.category} · {s.country}</p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge(s.status)}`}>{s.status}</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
              <div>
                <p className="text-muted-foreground">Virtual account</p>
                <p className="mt-0.5 font-mono">{s.account}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Settled volume</p>
                <p className="mt-0.5 font-mono">₦ {s.volume}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
