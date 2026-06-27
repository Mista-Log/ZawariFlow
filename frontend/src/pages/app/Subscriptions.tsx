import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

const SUBS = [
  { id: "SUB-1182", customer: "Bluepine Ltd", plan: "Enterprise — Monthly", amount: "4,500,000", next: "Jul 24", status: "Active" },
  { id: "SUB-1179", customer: "Apex Cement", plan: "Enterprise — Quarterly", amount: "18,000,000", next: "Sep 12", status: "Active" },
  { id: "SUB-1170", customer: "Sahel Foods", plan: "Growth — Monthly", amount: "1,200,000", next: "Jul 02", status: "Past due" },
  { id: "SUB-1162", customer: "Atlas Petroleum", plan: "Enterprise — Annual", amount: "96,000,000", next: "Mar 18, 27", status: "Active" },
  { id: "SUB-1155", customer: "Lekki Industrial", plan: "Growth — Monthly", amount: "1,200,000", next: "—", status: "Cancelled" },
];

function badge(s: string) {
  switch (s) {
    case "Active": return "bg-success/10 text-success";
    case "Past due": return "bg-warning/15 text-warning-foreground";
    case "Cancelled": return "bg-secondary text-muted-foreground";
    default: return "bg-secondary";
  }
}

export default function Subscriptions() {
  return (
    <>
      <PageHeader
        title="Corporate subscriptions"
        description="Recurring B2B contracts with mandate-based collection."
        actions={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New subscription</Button>}
      />

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">ID</th>
              <th className="px-5 py-3 text-left font-medium">Customer</th>
              <th className="px-5 py-3 text-left font-medium">Plan</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-left font-medium">Next charge</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {SUBS.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/40">
                <td className="px-5 py-3 font-mono text-xs">{s.id}</td>
                <td className="px-5 py-3">{s.customer}</td>
                <td className="px-5 py-3 text-muted-foreground">{s.plan}</td>
                <td className="px-5 py-3 text-right font-mono">₦ {s.amount}</td>
                <td className="px-5 py-3 text-muted-foreground">{s.next}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge(s.status)}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
