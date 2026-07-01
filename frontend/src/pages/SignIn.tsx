import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { signin } from "@/api/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };



  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await signin(formData);

      // Save your JWT tokens
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);

      navigate("/app");
    } catch (error) {
      console.error(error);

      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your purchase orders and settlements.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">Work email</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-input" />
              Keep me signed in for 30 days
            </label>

            <Button type="submit" className="w-full" size="lg">
              Sign in <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" size="lg">
            Continue with SSO
          </Button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New to ZawariFlow?{" "}
            <Link to="/auth/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ZawariFlow
        </p>
      </div>

      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-90">ZawariFlow</p>
          <p className="mt-1 text-xs opacity-70">B2B supply chain payments</p>
        </div>
        <div className="relative z-10 max-w-md">
          <p className="text-2xl font-semibold leading-snug">
            "We collapsed a four-person reconciliation workflow into a single API call. Settlements now happen the same day funds clear."
          </p>
          <p className="mt-6 text-sm opacity-80">Adaeze O. · Head of Operations, Northbridge Trading</p>
        </div>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>
    </div>
  );
}
