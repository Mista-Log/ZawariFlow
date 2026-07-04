import { useState } from "react";
import { Plus, Copy } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACCOUNTS = [
  { id: "VA-30412", label: "Hexa Steel · Settlements", number: "9034 1280 41", bank: "Wema Bank", balance: "412,800,000", routed: "PO-* (factory leg)" },
  { id: "VA-30418", label: "BlueLane Logistics · Settlements", number: "9034 1280 47", bank: "Wema Bank", balance: "188,400,000", routed: "PO-* (logistics leg)" },
  { id: "VA-30001", label: "Customs Holding", number: "9034 1280 50", bank: "Providus", balance: "146,200,000", routed: "All customs payees" },
  { id: "VA-30521", label: "Inflows · Northbridge Trading", number: "9034 1280 88", bank: "Wema Bank", balance: "0", routed: "PO inflow auto-route" },
];

function IssueAccountDialog() {
  const [open, setOpen] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Issue account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Issue virtual account</DialogTitle>
          <DialogDescription>Create a per-counterparty account that auto-routes inflows.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="va-label">Account label</Label>
            <Input id="va-label" placeholder="e.g. Hexa Steel · Settlements" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="va-party">Counterparty</Label>
              <Input id="va-party" placeholder="Supplier / buyer name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="va-bank">Bank</Label>
              <Select defaultValue="Wema Bank">
                <SelectTrigger id="va-bank"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wema Bank">Wema Bank</SelectItem>
                  <SelectItem value="Providus">Providus</SelectItem>
                  <SelectItem value="Sterling">Sterling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="va-rule">Routing rule</Label>
            <Input id="va-rule" placeholder="e.g. PO-* (factory leg)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="va-currency">Currency</Label>
            <Select defaultValue="NGN">
              <SelectTrigger id="va-currency"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NGN">NGN</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Issue account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function VirtualAccounts() {
  return (
    <>
      <PageHeader
        title="Virtual accounts"
        description="Per-counterparty accounts that automatically route inflows to the right ledger."
        actions={<IssueAccountDialog />}
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
