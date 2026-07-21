import { PageHeader } from "@/components/page-header";
import { useEffect, useState } from "react";
import { getSettlements, Settlement } from "@/api/settlements";

// const ROWS = [
//   { id: "STL-90412", po: "PO-48211", to: "Hexa Steel Factory", amount: "114,390,000", method: "NIP transfer", status: "Settled", at: "Jun 24, 14:02" },
//   { id: "STL-90411", po: "PO-48211", to: "BlueLane Logistics", amount: "33,210,000", method: "NIP transfer", status: "Settled", at: "Jun 24, 14:02" },
//   { id: "STL-90410", po: "PO-48211", to: "Customs & Duties", amount: "25,830,000", method: "Direct debit", status: "Settled", at: "Jun 24, 14:02" },
//   { id: "STL-90402", po: "PO-48207", to: "Apex Cement Supply", amount: "55,200,000", method: "NIP transfer", status: "Processing", at: "Jun 24, 13:18" },
//   { id: "STL-90398", po: "PO-48198", to: "Hexa Steel Factory", amount: "37,944,000", method: "NIP transfer", status: "Pending", at: "Jun 23, 18:44" },
//   { id: "STL-90377", po: "PO-48177", to: "Atlas Petroleum Co.", amount: "320,000,000", method: "Wire", status: "Failed", at: "Jun 22, 09:12" },
// ];

function badge(status: string) {
  switch (status) {
    case "SUCCESS":
      return "bg-success/10 text-success";

    case "PROCESSING":
      return "bg-primary/10 text-primary";

    case "PENDING":
      return "bg-warning/10 text-warning";

    case "FAILED":
      return "bg-destructive/10 text-destructive";

    default:
      return "bg-secondary";
  }
}

export default function Settlements() {

  const [rows, setRows] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettlements() {
      try {
        const data = await getSettlements();
        setRows(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettlements();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Settlements"
          description="Loading..."
        />
      </>
    );
  }


  return (
    <>
      <PageHeader title="Settlements" description="Every disbursement leg of every purchase order." />

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Settlement ID</th>
              <th className="px-5 py-3 text-left font-medium">PO</th>
              <th className="px-5 py-3 text-left font-medium">Supplier</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-left font-medium">Method</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/40">
                <td className="px-5 py-3 font-mono text-xs">
                  {r.id.slice(0, 8)}
                </td>
                <td className="px-5 py-3 font-mono text-xs">
                  {r.purchase_order}
                </td>
                <td className="px-5 py-3">
                  {r.supplier}
                </td>
                <td className="px-5 py-3 text-right font-mono">
                  {r.currency} {Number(r.amount).toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  Bank Transfer
                </td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge(r.status)}`}>{r.status}</span></td>
                <td className="px-5 py-3 text-right text-xs">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
