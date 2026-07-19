import { useState, useEffect } from "react";
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
import { getSuppliers } from "@/api/suppliers";
import { createVirtualAccount, getVirtualAccounts, VirtualAccount } from "@/api/payments";

const ACCOUNTS = [
  { id: "VA-30412", label: "Hexa Steel · Settlements", number: "9034 1280 41", bank: "Wema Bank", balance: "412,800,000", routed: "PO-* (factory leg)" },
  { id: "VA-30418", label: "BlueLane Logistics · Settlements", number: "9034 1280 47", bank: "Wema Bank", balance: "188,400,000", routed: "PO-* (logistics leg)" },
  { id: "VA-30001", label: "Customs Holding", number: "9034 1280 50", bank: "Providus", balance: "146,200,000", routed: "All customs payees" },
  { id: "VA-30521", label: "Inflows · Northbridge Trading", number: "9034 1280 88", bank: "Wema Bank", balance: "0", routed: "PO inflow auto-route" },
];

function IssueAccountDialog({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) {

  const [formData, setFormData] = useState({
      supplier: "",
      expected_amount: "",
      expiry_date: "",
  });

  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
      const loadSuppliers = async () => {
          try {
              const res = await getSuppliers();
              setSuppliers(res);
          } catch (err) {
              console.error(err);
          }
      };

      loadSuppliers();
  }, []);



  const [open, setOpen] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {

          await createVirtualAccount({
              supplier: formData.supplier,
              expected_amount: Number(formData.expected_amount),
              expiry_date: formData.expiry_date,
          });

          await onSuccess();

          setOpen(false);

      } catch(err){
          console.error(err);
      }
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
              <Label>Supplier</Label>

              <Select
                  value={formData.supplier}
                  onValueChange={(value) =>
                      setFormData((prev) => ({
                          ...prev,
                          supplier: value,
                      }))
                  }
              >
                  <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>

                  <SelectContent>
                      {suppliers.map((supplier) => (
                          <SelectItem
                              key={supplier.id}
                              value={supplier.id}
                          >
                              {supplier.name}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="va-rule">Expected Amount</Label>
            <Input
              type="number"
              value={formData.expected_amount}
              onChange={(e)=>
                  setFormData({
                      ...formData,
                      expected_amount:e.target.value
                  })
              }
          />
          </div>
          <div className="space-y-2">
            <Label htmlFor="va-rule">Expiry Date</Label>
            <Input
                type="date"
                value={formData.expiry_date}
                onChange={(e)=>
                    setFormData({
                        ...formData,
                        expiry_date:e.target.value
                    })
                }
            />
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


function badge(status: string) {
    switch (status) {

        case "ACTIVE":
            return "bg-success/10 text-success";

        case "PENDING":
            return "bg-warning/10 text-warning";

        case "EXPIRED":
            return "bg-destructive/10 text-destructive";

        default:
            return "bg-secondary";
    }
}

export default function VirtualAccounts() {


  const [accounts, setAccounts] = useState<VirtualAccount[]>([]);

  const [loading, setLoading] = useState(false);

  const loadAccounts = async () => {

      try{

          setLoading(true);

          const response = await getVirtualAccounts();

          setAccounts(response);

      }finally{
          setLoading(false);
      }

  };

  useEffect(() => {
      loadAccounts();
  }, []);

  return (
    <>
      <PageHeader
        title="Virtual accounts"
        description="Per-counterparty accounts that automatically route inflows to the right ledger."
        actions={<IssueAccountDialog onSuccess={loadAccounts} />}
      />


      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading virtual accounts...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card">
          <h3 className="text-lg font-semibold">No virtual accounts available</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't created any virtual accounts yet.
          </p>

          <div className="mt-6">
            <IssueAccountDialog onSuccess={loadAccounts} />
          </div>
        </div>
      ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((account) => (
          <div key={account.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-muted-foreground">{account.id}</p>
                <p className="mt-1 font-medium">{account.company}</p>
              </div>
              <span
                  className={`rounded-full px-2 py-0.5 text-xs ${badge(account.status)}`}
              >
                  {account.status}
              </span>
            </div>
            <div className="mt-5 rounded-md border border-border bg-secondary/40 p-3">
              <p className="text-xs text-muted-foreground">{account.bank_name}</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-mono text-lg tracking-wider">{account.account_number}</p>
                <button className="grid h-7 w-7 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Balance</p>
                <p className="mt-0.5 font-mono text-sm">₦ {account.balance}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Routing rule</p>
                <p className="mt-0.5 font-mono text-xs">{account.routed}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </>
  );
}
