import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, Check } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfile } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";

const roleOptions = [
  {
    value: "OWNER",
    label: "Company Owner",
    description: "Full access. Set up your company and invite the team.",
  },
  {
    value: "FINANCE_MANAGER",
    label: "Finance Manager",
    description: "Oversee settlements, ledgers and payouts.",
  },
  {
    value: "OPERATIONS_MANAGER",
    label: "Operations Manager",
    description: "Manage purchase orders, suppliers and routing.",
  },
  {
    value: "ACCOUNTANT",
    label: "Accountant",
    description: "Reconcile transactions and export reports.",
  },
  {
    value: "VIEWER",
    label: "Viewer / Auditor",
    description: "Read-only access to activity and reports.",
  },
] as const;

type RoleValue = (typeof roleOptions)[number]["value"];
type Step = "role" | "company";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<RoleValue | null>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    role: "",
    company_name: "",
    registration_number: "",
    tax_identification_number: "",
    industry: "",
    country: "",
    address: "",
    phone_number: "",
    website: "",
    });

const handleContinue = async () => {
    if (!formData.role) {
        alert("Please select a role.");
        return;
    }

    if (formData.role === "OWNER") {
        setStep("company");
        return;
    }

    await submitProfile();
    };

const submitProfile = async () => {
    setLoading(true);

    try {
        const payload: any = {
          role: formData.role,
        };

        if (formData.role === "OWNER") {
          Object.assign(payload, {
            company_name: formData.company_name,
            registration_number: formData.registration_number,
            tax_identification_number: formData.tax_identification_number,
            industry: formData.industry,
            country: formData.country,
            address: formData.address,
            phone_number: formData.phone_number,
            website: formData.website,
          });
        }

        await updateProfile(payload);
        console.log(formData)

        await refreshUser();

        navigate("/app");
    } catch (error) {
        console.error(error);
        alert("Unable to complete your profile.");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="text-xs text-muted-foreground">
            Step {step === "role" ? 1 : 2} of {role === "OWNER" ? 2 : 1}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
        {step === "role" ? (
          <section>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              What best describes your role?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll tailor your ZawariFlow workspace based on your responsibilities.
            </p>

            <div className="mt-8 space-y-3">
              {roleOptions.map((opt) => {
                const selected = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                        setRole(opt.value);

                        setFormData(prev => ({
                            ...prev,
                            role: opt.value,
                        }));
                    }}
                    className={`flex w-full items-start gap-4 rounded-lg border bg-background p-4 text-left transition-colors hover:border-primary/50 ${
                      selected ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}
                  >
                    <div
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {opt.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Link
                to="/auth/signin"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign in instead
              </Link>
              <Button size="lg" disabled={!role} onClick={handleContinue}>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </section>
        ) : (
          <section>
            <button
              type="button"
              onClick={() => setStep("role")}
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Company details
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tell us about the business you're setting up on ZawariFlow.
                </p>
              </div>
            </div>

            <form
              onSubmit={submitProfile}
              className="mt-8 space-y-5 rounded-lg border bg-background p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="company_name">Company name</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    required placeholder="Acme Trading Ltd"
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            company_name: e.target.value,
                        }))
                    }
                />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="registration_number">Registration number</Label>
                  <Input
                    id="registration_number"
                    value={formData.registration_number}
                    required
                    placeholder="RC-1234567"
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            registration_number: e.target.value,
                        }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tax_identification_number">Tax ID (TIN)</Label>
                  <Input
                    id="tax_identification_number"
                    value={formData.tax_identification_number}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            tax_identification_number: e.target.value,
                        }))
                    }
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    name="industry"
                    value={formData.industry}
                    onValueChange={(value) =>
                        setFormData(prev => ({
                            ...prev,
                            industry: value,
                        }))
                    }
                    required
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="logistics">Logistics & Freight</SelectItem>
                      <SelectItem value="wholesale">Wholesale / Distribution</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="fintech">Fintech</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    name="country"
                    value={formData.country}
                    onValueChange={(value) =>
                        setFormData(prev => ({
                            ...prev,
                            country: value,
                        }))
                    }
                    required
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="GH">Ghana</SelectItem>
                      <SelectItem value="KE">Kenya</SelectItem>
                      <SelectItem value="ZA">South Africa</SelectItem>
                      <SelectItem value="EG">Egypt</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Business address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            address: e.target.value,
                        }))
                    }
                    required
                    placeholder="Street, city, state / province"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone_number">Phone number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            phone_number: e.target.value,
                        }))
                    }
                    name="phone_number"
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            website: e.target.value,
                        }))
                    }
                    name="website"
                    type="url"
                    placeholder="https://acme.com (optional)"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-5">
                <Button type="submit" size="lg">
                  Finish setup <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
