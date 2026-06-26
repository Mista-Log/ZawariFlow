import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/settlements")({
  component: Settlements,
});

const ROWS = [
  { id: "STL-90412", po: "PO-48211", to: "Hexa Steel Factory", amount: "114,390,000", method: "NIP transfer", status: "Settled", at: "Jun 24, 14:02" },
  { id: "STL-90411", po: "PO-48211", to: "BlueLane Logistics", amount: "33,210,000", method: "NIP transfer", status: "Settled", at: "Jun 24, 14:02" },
  { id: "STL-90410", po: "PO-48211", to: "Customs & Duties", amount: "25,830,000", method: "Direct debit", status: "Settled", at: "Jun 24, 14:02" },
  { id: "STL-90402", po: "PO-48207", to: "Apex Cement Supply", amount: "55,200,000", method: "NIP transfer", status: "Processing", at: "Jun 24, 13:18" },
  { id: "STL-90398", po: "PO-48198", to: "Hexa Steel Factory", amount: "37,944,000", method: "NIP transfer", status: "Pending", at: "Jun 23, 18:44" },
  { id: "STL-90377", po: "PO-48177", to: "Atlas Petroleum Co.", amount: "320,000,000", method: "Wire", status: "Failed", at: "Jun 22, 09:12" },
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

function Settlements() {
  return (
    <>
      <PageHeader title="Settlements" description="Every disbursement leg of every purchase order." />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Settlement</th>
              <th className="px-5 py-3 text-left font-medium">PO</th>
              <th className="px-5 py-3 text-left font-medium">Recipient</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-left font-medium">Method</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ROWS.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/40">
                <td className="px-5 py-3 font-mono text-xs">{r.id}</td>
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.po}</td>
                <td className="px-5 py-3">{r.to}</td>
                <td className="px-5 py-3 text-right font-mono">₦ {r.amount}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.method}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge(r.status)}`}>{r.status}</span></td>
                <td className="px-5 py-3 text-right text-xs text-muted-foreground">{r.at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
