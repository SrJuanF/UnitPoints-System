"use client";

import { Card } from "@/components/ui/card";
import { Droplets, TrendingUp, DollarSign, Activity } from "lucide-react";

const stats = [
  {
    label: "Total Liquidity",
    value: "$125,430",
    icon: Droplets,
    color: "text-primary",
    change: "+12.5%",
  },
  {
    label: "24h Volume",
    value: "$45,230",
    icon: Activity,
    color: "text-secondary",
    change: "+8.3%",
  },
  {
    label: "PAS Reserve",
    value: "50,000",
    icon: DollarSign,
    color: "text-accent",
    change: "+5.2%",
  },
  {
    label: "UPT Reserve",
    value: "75,000",
    icon: TrendingUp,
    color: "text-primary",
    change: "+3.8%",
  },
];

export function LiquidityStats() {
  return (
    <Card className="p-6">
      <h3 className="font-display font-semibold text-lg md:text-xl mb-5 text-foreground tracking-tight">
        Liquidity Pool
      </h3>
      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="font-semibold text-foreground text-sm">
                    {stat.value}
                  </p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-green-400/10 text-green-400 font-medium">
                {stat.change}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
