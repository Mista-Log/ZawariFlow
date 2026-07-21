import { useEffect, useState } from "react";
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
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getSuppliers,
  Supplier,
} from "@/api/suppliers";

// const POS = [
//   {
//     id: "PO-48211",
//     buyer: "Northbridge Trading",
//     amount: "184,500,000",
//     currency: "NGN",
//     suppliers: 4,
//     status: "Settled",
//     created: "Jun 24",
//     items: [
//       { name: "Rice", quantity: 500, unit: "Bags" },
//       { name: "Maize", quantity: 200, unit: "Bags" },
//       { name: "Fertilizer", quantity: 120, unit: "Tons" },
//     ],
//   },
//   {
//     id: "PO-48207",
//     buyer: "Northbridge Trading",
//     amount: "92,000,000",
//     currency: "NGN",
//     suppliers: 3,
//     status: "Processing",
//     created: "Jun 24",
//     items: [
//       { name: "Cocoa Beans", quantity: 75, unit: "Tons" },
//       { name: "Palm Oil", quantity: 400, unit: "Litres" },
//     ],
//   },
//   {
//     id: "PO-48198",
//     buyer: "Lekki Industrial Co.",
//     amount: "61,200,000",
//     currency: "NGN",
//     suppliers: 5,
//     status: "Pending",
//     created: "Jun 23",
//     items: [
//       { name: "Steel Rods", quantity: 800, unit: "Pieces" },
//       { name: "Cement", quantity: 1000, unit: "Bags" },
//       { name: "Sand", quantity: 30, unit: "Truckloads" },
//     ],
//   },
//   {
//     id: "PO-48190",
//     buyer: "Apex Cement",
//     amount: "240,000,000",
//     currency: "NGN",
//     suppliers: 6,
//     status: "Settled",
//     created: "Jun 23",
//     items: [
//       { name: "Clinker", quantity: 500, unit: "Tons" },
//       { name: "Gypsum", quantity: 180, unit: "Tons" },
//     ],
//   },
// ];

function badge(s: string) {
  switch (s) {
    case "Settled": return "bg-success/10 text-success";
    case "Processing": return "bg-primary/10 text-primary";
    case "Pending": return "bg-warning/15 text-warning-foreground";
    case "Failed": return "bg-destructive/10 text-destructive";
    case "DRAFT": return "bg-secondary text-secondary-foreground";
    default: return "bg-secondary";
  }
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  buyer: string;
  amount: string;
  currency: string;
  suppliers: number;
  status: string;
  created: string;

  items?: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}

function NewPODialog({
    onSuccess,
  }: {
    onSuccess: () => Promise<void>;
  }) {

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [formData, setFormData] = useState({
    buyer: "",
    amount: "",
    currency: "NGN",
    supplierId: "",
    notes: "",
  });
  
  const [items, setItems] = useState([
    {
      item: "",
      quantity: "",
      unit: "",
    },
  ]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
      const loadSuppliers = async () => {
          try {
              const data = await getSuppliers();
              setSuppliers(data);
          } catch (err) {
              console.error(err);
          }
      };

      if (open) {
          loadSuppliers();
      }
  }, [open]);  

  const addItem = () => {
    setItems([
      ...items,
      {
        item: "",
        quantity: "",
        unit: "",
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: "item" | "quantity" | "unit",
    value: string
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
        buyer: formData.buyer,
        amount: Number(formData.amount),
        currency: formData.currency,
        suppliers: [formData.supplierId],

        notes: formData.notes,

        items: items.map((item) => ({
            name: item.item,
            quantity: Number(item.quantity),
            unit: item.unit,
        })),
    };

    try {

        await createPurchaseOrder(payload);

        await onSuccess();

        setOpen(false);

    } catch (err) {
        console.error(err);
    }
};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New PO</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create purchase order</DialogTitle>
          <DialogDescription>Register a bulk inflow and map it to downstream suppliers.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="po-buyer">Buyer</Label>
            <Input
              id="po-buyer"
              name="buyer"
              value={formData.buyer}
              onChange={handleChange}
              placeholder="e.g. Northbridge Trading"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="po-amount">Amount</Label>
              <Input
                id="po-amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="po-currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value)=>
                    setFormData(prev=>({
                        ...prev,
                        currency:value
                    }))
                }
              >
                <SelectTrigger id="po-currency"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Purchase Items</Label>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border p-4 space-y-3"
              >
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Item</Label>
                    <Input
                      placeholder="Rice"
                      value={item.item}
                      onChange={(e) =>
                        updateItem(index, "item", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      placeholder="Bags"
                      value={item.unit}
                      onChange={(e) =>
                        updateItem(index, "unit", e.target.value)
                      }
                    />
                  </div>
                </div>

                {items.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove Item
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-2">
              <Label>Select Supplier</Label>

              <Select
                  value={formData.supplierId}
                  onValueChange={(value) =>
                      setFormData((prev) => ({
                          ...prev,
                          supplierId: value,
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
            <Label htmlFor="po-notes">Notes</Label>
            <Textarea
              id="po-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Reference, delivery terms…"
              rows={3}
            />
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

  const [loading, setLoading] = useState(false);

  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>([]);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);

    const response = await getPurchaseOrders();

    setPurchaseOrders(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  return (
    <>
      <PageHeader
        title="Purchase orders"
        description="Bulk inflows mapped to downstream suppliers."
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
            <NewPODialog onSuccess={loadPurchaseOrders} />
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

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">
            Loading purchase orders...
          </p>
        </div>
      ) : purchaseOrders.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card">
          <h3 className="text-lg font-semibold">
            No purchase orders available
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't created any purchase orders yet.
          </p>

          <div className="mt-6">
            <NewPODialog onSuccess={loadPurchaseOrders} />
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">PO ID</th>
                <th className="px-5 py-3 text-left font-medium">Buyer</th>
                <th className="px-5 py-3 text-left font-medium">Items</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-center font-medium">Suppliers</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {purchaseOrders.map((p) => (
                <tr key={p.po_number} className="hover:bg-secondary/40">
                  <td className="px-5 py-3 font-mono text-xs">
                    {p.po_number}
                  </td>

                  <td className="px-5 py-3">{p.buyer}</td>

                  <td className="px-5 py-3">
                    {p.items?.length ? (
                      <div className="space-y-1">
                        {p.items.slice(0, 2).map((item) => (
                          <div key={item.name} className="text-xs">
                            {item.name}
                            <span className="ml-1 text-muted-foreground">
                              ({item.quantity} {item.unit})
                            </span>
                          </div>
                        ))}

                        {p.items.length > 2 && (
                          <div className="text-xs text-primary">
                            +{p.items.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No items
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3 text-right font-mono">
                    {p.currency} {p.amount}
                  </td>

                  <td className="px-5 py-3 text-center text-muted-foreground">
                    {p.suppliers}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-right text-muted-foreground">
                    {p.created}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
