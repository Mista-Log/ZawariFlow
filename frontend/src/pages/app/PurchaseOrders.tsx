import { useState } from "react";
import { Plus, Filter, Download } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const POS = [
  { id: "PO-48211", buyer: "Northbridge Trading", amount: "184,500,000", currency: "NGN", suppliers: 4, status: "Settled", created: "Jun 24" },
  { id: "PO-48207", buyer: "Northbridge Trading", amount: "92,000,000", currency: "NGN", suppliers: 3, status: "Processing", created: "Jun 24" },
  { id: "PO-48198", buyer: "Lekki Industrial Co.", amount: "61,200,000", currency: "NGN", suppliers: 5, status: "Pending", created: "Jun 23" },
  { id: "PO-48190", buyer: "Apex Cement", amount: "240,000,000", currency: "NGN", suppliers: 6, status: "Settled", created: "Jun 23" },
  { id: "PO-48184", buyer: "Sahel Foods Ltd", amount: "12,400,000", currency: "NGN", suppliers: 2, status: "Settled", created: "Jun 22" },
  { id: "PO-48177", buyer: "Atlas Petroleum", amount: "320,000,000", currency: "NGN", suppliers: 4, status: "Failed", created: "Jun 22" },
  { id: "PO-48169", buyer: "Bluepine Ltd", amount: "48,000,000", currency: "NGN", suppliers: 3, status: "Settled", created: "Jun 21" },
];

function badge(s: string) {
  switch (s) {
    case "Settled": return "bg-success/10 text-success";
    case "Processing": return "bg-primary/10 text-primary";
    case "Pending": return "bg-warning/15 text-warning-foreground";
    case "Failed": return "bg-destructive/10 text-destructive";
    default: return "bg-secondary";
  }
}

function NewPODialog() {
  const [open, setOpen] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New PO</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create purchase order</DialogTitle>
          <DialogDescription>Register a bulk inflow and map it to downstream suppliers.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="po-buyer">Buyer</Label>
            <Input id="po-buyer" placeholder="e.g. Northbridge Trading" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="po-amount">Amount</Label>
              <Input id="po-amount" type="number" placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="po-currency">Currency</Label>
              <Select defaultValue="NGN">
                <SelectTrigger id="po-currency"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="po-suppliers">Suppliers (comma separated)</Label>
            <Input id="po-suppliers" placeholder="Hexa Steel, BlueLane Logistics" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="po-notes">Notes</Label>
            <Textarea id="po-notes" placeholder="Reference, delivery terms…" rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create PO</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PurchaseOrders() {
  return (
    <>
      <PageHeader
        title="Purchase orders"
        description="Bulk inflows mapped to downstream suppliers."
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
            <NewPODialog />
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["All", "Settled", "Processing", "Pending", "Failed"].map((t, i) => (
          <button key={t} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${i === 0 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>{t}</button>
        ))}
        <button className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary">
          <Filter className="h-3.5 w-3.5" /> Filters
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">PO ID</th>
              <th className="px-5 py-3 text-left font-medium">Buyer</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-center font-medium">Suppliers</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {POS.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/40">
                <td className="px-5 py-3 font-mono text-xs">{p.id}</td>
                <td className="px-5 py-3">{p.buyer}</td>
                <td className="px-5 py-3 text-right font-mono">{p.currency} {p.amount}</td>
                <td className="px-5 py-3 text-center text-muted-foreground">{p.suppliers}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge(p.status)}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-right text-muted-foreground">{p.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
