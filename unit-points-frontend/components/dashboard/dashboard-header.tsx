"use client";

import { useWallet } from "@/hooks";
import { useToken } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Coins, TrendingUp } from "lucide-react";
import { shortenAddress } from "@/lib/web3-utils";

export function DashboardHeader() {
  const { address, isConnected } = useWallet();
  const { balance } = useToken();

  if (!isConnected) {
    return (
      <div className="text-center py-12 vstack-sm">
        <h1 className="section-title text-3xl md:text-4xl mb-1">
          Welcome to UnitPoints
        </h1>
        <p className="subheading-muted">
          Please connect your wallet to view your dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="vstack-lg">
      <div className="vstack-xs">
        <h1 className="section-title text-3xl md:text-4xl mb-1">
          Welcome back{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {address ? shortenAddress(address) : "User"}
          </span>
        </h1>
        <p className="subheading-muted">
          Track your progress and manage your UnitPoints
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 glass-panel glass-panel-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
              <p className="font-display font-semibold text-2xl text-primary">
                {Number.parseFloat(balance).toFixed(2)} UPT
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Coins className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-panel glass-panel-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
              <p className="font-display font-semibold text-2xl text-secondary">
                {(Number.parseFloat(balance) * 1.5).toFixed(2)} UPT
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
