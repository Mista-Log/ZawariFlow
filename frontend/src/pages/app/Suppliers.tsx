import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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
import { createSupplier, getSuppliers } from "@/api/suppliers";

// const SUPPLIERS = [
//   { name: "Hexa Steel Factory", category: "Goods", country: "NG", account: "VA-30412", volume: "412.8M", status: "Verified" },
//   { name: "BlueLane Logistics", category: "Logistics", country: "NG", account: "VA-30418", volume: "188.4M", status: "Verified" },
//   { name: "Customs & Duties Bureau", category: "Tariffs", country: "NG", account: "VA-30001", volume: "146.2M", status: "System" },
//   { name: "PortaFreight EU", category: "Logistics", country: "NL", account: "VA-30521", volume: "92.1M", status: "Verified" },
//   { name: "AceTextiles Ltd", category: "Goods", country: "GH", account: "VA-30577", volume: "44.6M", status: "Pending KYC" },
//   { name: "Sahel Packaging Co.", category: "Goods", country: "NE", account: "VA-30602", volume: "23.0M", status: "Verified" },
// ];

function badge(s: string) {
  switch (s) {
    case "Verified": return "bg-success/10 text-success";
    case "Pending KYC": return "bg-warning/15 text-warning-foreground";
    case "System": return "bg-primary/10 text-primary";
    default: return "bg-secondary";
  }
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  country: string;
  account_number: string;
  transaction_volume: string;
  status: string;
}

interface AddSupplierDialogProps {
  fetchSuppliers: () => Promise<void>;
}

function AddSupplierDialog({
  fetchSuppliers,
}: AddSupplierDialogProps) {
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    country: "",
    account_number: "",
    transaction_volume: "",
    bank_name: "",
    status: "PENDING_KYC",
    email: "",
    phone_number: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };



  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await createSupplier(formData);

      alert("Supplier created successfully.");

      await fetchSuppliers();

      setOpen(false);



      setFormData({
        name: "",
        category: "",
        country: "",
        account_number: "",
        transaction_volume: "",
        bank_name: "",
        status: "PENDING_KYC",
        email: "",
        phone_number: "",
        address: "",
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };






  // const onSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setOpen(false);
  // };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add supplier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add supplier</DialogTitle>
          <DialogDescription>Register a factory, logistics, or customs payee.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sup-name">Business name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Hexa Steel Factory"
              required
          />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sup-cat">Category</Label>
              <Select
                  value={formData.category}
                  onValueChange={(value) =>
                      setFormData(prev => ({
                          ...prev,
                          category: value,
                      }))
                  }
              >
                  <SelectTrigger>
                      <SelectValue placeholder="Category" />
                  </SelectTrigger>

                  <SelectContent>
                      <SelectItem value="GOODS">Goods</SelectItem>
                      <SelectItem value="LOGISTICS">Logistics</SelectItem>
                      <SelectItem value="TARIFFS">Tariffs</SelectItem>
                      <SelectItem value="SERVICES">Services</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sup-country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Nigeria"
                required
            />
            </div>
          </div>
          <div className="space-y-2">
            <Select
              value={formData.status}
              onValueChange={(value) =>
                  setFormData(prev => ({
                      ...prev,
                      status: value,
                  }))
                }
              >
                  <SelectTrigger>
                      <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                      <SelectItem value="VERIFIED">
                          Verified
                      </SelectItem>

                      <SelectItem value="PENDING_KYC">
                          Pending KYC
                      </SelectItem>

                      <SelectItem value="SYSTEM">
                          System
                      </SelectItem>

                      <SelectItem value="INACTIVE">
                          Inactive
                      </SelectItem>
                  </SelectContent>
              </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sup-bank">Bank</Label>
              <Input
                id="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                placeholder="Wema Bank"
            />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sup-acct">Account number</Label>
              <Input
                id="account_number"
                value={formData.account_number}
                onChange={handleChange}
                placeholder="0123456789"
            />
            </div>
            <div className="space-y-2">
              <Label>Transaction Volume</Label>

              <Input
                  id="transaction_volume"
                  type="number"
                  value={formData.transaction_volume}
                  onChange={handleChange}
                  placeholder="1000000"
              />
          </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sup-email">Contact email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ops@supplier.com"
          />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sup-phone">Contact phone</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="08012345678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sup-address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Supplier Street, City"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
                type="submit"
                disabled={loading}
            >
                {loading ? "Creating..." : "Add Supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Suppliers() {

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await getSuppliers();

      console.log("Fetched suppliers:", response);

      setSuppliers(response);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <PageHeader
        title="Suppliers"
        description="Factories, logistics partners, and customs payees you settle to."
        actions={
            <AddSupplierDialog
                fetchSuppliers={fetchSuppliers}
            />
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {suppliers.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                  {s.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-medium">{s.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {s.category} · {s.country}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge(
                  s.status
                )}`}
              >
                {s.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
              <div>
                <p className="text-muted-foreground">Account Number</p>
                <p className="mt-0.5 font-mono">{s.account_number}</p>
              </div>

              <div className="text-right">
                <p className="text-muted-foreground">Transaction Volume</p>
                <p className="mt-0.5 font-mono">
                  ₦ {Number(s.transaction_volume).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
