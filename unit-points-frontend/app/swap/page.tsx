"use client";

import { useAuth } from "@/hooks";
import { Navbar } from "@/components/navbar";
import { SwapHeader } from "@/components/swap/swap-header";
import { SwapCard } from "@/components/swap/swap-card";
import { LiquidityStats } from "@/components/swap/liquidity-stats";
import { RecentSwaps } from "@/components/swap/recent-swaps";
import { SwapStats } from "@/components/swap/swap-stats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, User, Wallet } from "lucide-react";
import Link from "next/link";

export default function SwapPage() {
  const { userRole, authenticated, ready, login, userAddress } = useAuth();

  // Check if user has access to swap page (only for users, not companies or guests)
  const hasAccess = authenticated && userRole === "user";

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/6 w-64 h-64 bg-accent/8 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <Navbar />
        <div className="container px-4 py-20 mx-auto max-w-4xl relative z-10">
          <div className="text-center animate-fade-in">
            <Card className="p-12 glass-surface border-primary/20">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6 mx-auto">
                <Lock className="h-10 w-10 text-primary" />
              </div>

              <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Access Restricted
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                The Swap feature requires a connected MetaMask wallet. Please
                connect your wallet to access token swapping.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!authenticated ? (
                  <Button
                    onClick={login}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-primary/30 hover:bg-primary/10 transition-all duration-300"
                  >
                    <Link href="/">Go Back Home</Link>
                  </Button>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-primary/10">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Company accounts have access to
                  dedicated company features. Contact support if you need
                  different access permissions.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  // Original swap page content for authorized users
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/6 w-64 h-64 bg-accent/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Navbar />
      <div className="container px-4 py-20 mx-auto max-w-7xl relative z-10">
        <div className="animate-fade-in">
          <SwapHeader />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <SwapStats />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div
            className="lg:col-span-2 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <SwapCard />
          </div>
          <div className="space-y-8">
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <LiquidityStats />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <RecentSwaps />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
