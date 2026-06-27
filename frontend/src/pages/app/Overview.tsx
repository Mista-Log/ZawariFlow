import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp, TrendingDown, Plus } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

const VOLUME = [
  { d: "Mon", v: 92 },
  { d: "Tue", v: 118 },
  { d: "Wed", v: 104 },
  { d: "Thu", v: 156 },
  { d: "Fri", v: 184 },
  { d: "Sat", v: 78 },
  { d: "Sun", v: 64 },
];

const STATS = [
  { label: "Settled volume", value: "₦ 1.42B", delta: "+12.4%", up: true, sub: "vs last week" },
  { label: "Open purchase orders", value: "47", delta: "+6", up: true, sub: "since yesterday" },
  { label: "Pending settlements", value: "₦ 86.2M", delta: "-3.1%", up: false, sub: "vs last week" },
  { label: "Active suppliers", value: "128", delta: "+4", up: true, sub: "this month" },
];

const ACTIVITY = [
  { id: "PO-48211", desc: "Split settled to 4 suppliers", amt: "₦ 184,500,000", status: "Settled", time: "2m ago" },
  { id: "PO-48207", desc: "Inflow received · Northbridge Trading", amt: "₦ 92,000,000", status: "Processing", time: "14m ago" },
  { id: "VA-30412", desc: "Virtual account created · Hexa Steel", amt: "—", status: "Active", time: "1h ago" },
  { id: "SUB-1182", desc: "Subscription renewed · Bluepine Ltd", amt: "₦ 4,500,000", status: "Settled", time: "3h ago" },
  { id: "PO-48198", desc: "Awaiting buyer approval", amt: "₦ 61,200,000", status: "Pending", time: "5h ago" },
];

function statusStyles(s: string) {
  switch (s) {
    case "Settled":
    case "Active":
      return "bg-success/10 text-success";
    case "Processing":
      return "bg-primary/10 text-primary";
    case "Pending":
      return "bg-warning/15 text-warning-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export default function Overview() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Live operations across your purchase orders, suppliers, and settlements."
        actions={
          <Button asChild>
            <Link to="/app/purchase-orders"><Plus className="mr-1.5 h-4 w-4" /> New purchase order</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">{s.value}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${s.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.delta}
              </span>
              <span className="text-muted-foreground">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Settlement volume</h2>
              <p className="text-xs text-muted-foreground">Daily, last 7 days · ₦ millions</p>
            </div>
            <span className="text-xs text-muted-foreground">All currencies</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                  cursor={{ stroke: "var(--color-border)" }}
                />
                <Area type="monotone" dataKey="v" stroke="var(--color-primary)" strokeWidth={2} fill="url(#vol)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Split breakdown</h2>
          <p className="text-xs text-muted-foreground">Average split distribution this week</p>
          <div className="mt-5 space-y-4">
            {[
              { label: "Goods (factories)", pct: 58 },
              { label: "Logistics", pct: 21 },
              { label: "Customs & duties", pct: 14 },
              { label: "Platform fees", pct: 7 },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm">
                  <span>{s.label}</span>
                  <span className="font-mono text-muted-foreground">{s.pct}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                  <div className="h-full bg-primary" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">Recent activity</h2>
          <Link to="/app/settlements" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {ACTIVITY.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
                <span className="truncate text-sm">{a.desc}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden font-mono text-sm text-muted-foreground sm:inline">{a.amt}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles(a.status)}`}>{a.status}</span>
                <span className="hidden w-16 text-right text-xs text-muted-foreground md:inline">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
