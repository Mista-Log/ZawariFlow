import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { signup } from "@/api/auth";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await signup(formData);

      console.log(data);

      navigate("/app");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start in sandbox mode. Go live whenever your team is ready.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="first_name" className="text-sm font-medium">First name</label>
                <input
                  id="first_name"
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="last_name" className="text-sm font-medium">Last name</label>
                <input
                  id="last_name"
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>


            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">Work email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-input" />
              <span>
                I agree to the <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </span>
            </label>

            <Button type="submit" className="w-full" size="lg">
              Create account <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ZawariFlow
        </p>
      </div>

      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-90">What you get on day one</p>
        </div>
        <ul className="relative z-10 space-y-4 text-sm">
          {[
            "Sandbox + live API keys with idempotent endpoints",
            "Visual PO mapping with split settlement rules",
            "Per-counterparty virtual accounts and routing",
            "Signed webhooks for every settlement event",
            "Audit-grade ledger exports for finance",
          ].map((b) => (
            <li key={b} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="opacity-90">{b}</span>
            </li>
          ))}
        </ul>
        <p className="relative z-10 text-xs opacity-70">
          Trusted by operators moving billions in B2B volume.
        </p>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>
    </div>
  );
}
