import { apiRequest } from "./client";

export interface DashboardStat {
  settled_volume: number;
  open_purchase_orders: number;
  pending_settlements: number;
  active_suppliers: number;
}

export interface SettlementVolume {
  day: string;
  amount: number;
}

export interface SplitBreakdown {
  goods: number;
  logistics: number;
  tariffs: number;
  services: number;
  other: number;
}

export interface RecentActivity {
  id: string;
  reference: string;
  description: string;
  amount: number | null;
  status: string;
  created_at: string;
}

export interface DashboardOverview {
  stats: {
    settled_volume: number;
    open_purchase_orders: number;
    pending_settlements: number;
    active_suppliers: number;
  };

  chart: {
    day: string;
    volume: number;
  }[];

  split_breakdown: {
    label: string;
    pct: number;
  }[];

  recent_activity: {
    id: string;
    desc: string;
    amt: number | null;
    status: string;
    time: string;
  }[];
}

export const getDashboardOverview = () => {
  return apiRequest("/api/dashboard/overview/", {
    method: "GET",
  });
};