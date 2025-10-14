"use client";

import { TrendingUp, Activity, DollarSign, Users } from "lucide-react";

const stats = [
  {
    label: "24h Volume",
    value: "$45,230",
    icon: Activity,
    change: "+8.3%",
    positive: true,
  },
  {
    label: "Total Liquidity",
    value: "$125.4K",
    icon: DollarSign,
    change: "+12.5%",
    positive: true,
  },
  {
    label: "Active Traders",
    value: "1,234",
    icon: Users,
    change: "+5.2%",
    positive: true,
  },
  {
    label: "Avg. Swap Size",
    value: "$36.70",
    icon: TrendingUp,
    change: "-2.1%",
    positive: false,
  },
];

export function SwapStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                  stat.positive
                    ? "bg-green-400/10 text-green-400"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
