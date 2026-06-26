import { createFileRoute } from "@tanstack/react-router";
import { Plus, Copy } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/virtual-accounts")({
  component: VirtualAccounts,
});

const ACCOUNTS = [
  { id: "VA-30412", label: "Hexa Steel · Settlements", number: "9034 1280 41", bank: "Wema Bank", balance: "412,800,000", routed: "PO-* (factory leg)" },
  { id: "VA-30418", label: "BlueLane Logistics · Settlements", number: "9034 1280 47", bank: "Wema Bank", balance: "188,400,000", routed: "PO-* (logistics leg)" },
  { id: "VA-30001", label: "Customs Holding", number: "9034 1280 50", bank: "Providus", balance: "146,200,000", routed: "All customs payees" },
  { id: "VA-30521", label: "Inflows · Northbridge Trading", number: "9034 1280 88", bank: "Wema Bank", balance: "0", routed: "PO inflow auto-route" },
];

function VirtualAccounts() {
  return (
    <>
      <PageHeader
        title="Virtual accounts"
        description="Per-counterparty accounts that automatically route inflows to the right ledger."
        actions={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Issue account</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {ACCOUNTS.map((a) => (
          <div key={a.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-muted-foreground">{a.id}</p>
                <p className="mt-1 font-medium">{a.label}</p>
              </div>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Active</span>
            </div>
            <div className="mt-5 rounded-md border border-border bg-secondary/40 p-3">
              <p className="text-xs text-muted-foreground">{a.bank}</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-mono text-lg tracking-wider">{a.number}</p>
                <button className="grid h-7 w-7 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Balance</p>
                <p className="mt-0.5 font-mono text-sm">₦ {a.balance}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Routing rule</p>
                <p className="mt-0.5 font-mono text-xs">{a.routed}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
