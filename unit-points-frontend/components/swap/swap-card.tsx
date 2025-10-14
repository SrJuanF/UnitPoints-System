"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Settings, Info, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";

export function SwapCard() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState<"PAS" | "UPT">("PAS");
  const [toToken, setToToken] = useState<"PAS" | "UPT">("UPT");
  const [isFlipping, setIsFlipping] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const { toast } = useToast();

  // Use global authentication to determine connection status
  const { authenticated, userAddress, login } = useAuth();
  const isConnected = authenticated && !!userAddress;
  const connect = async () => {
    await login();
  };
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);

  const exchangeRate = 1.5; // 1 PAS = 1.5 UPT (mock rate)
  const fee = 0.003; // 0.3% fee

  useEffect(() => {
    if (swapError) {
      toast({
        title: "Swap Failed",
        description: swapError,
        variant: "destructive",
      });
    }
  }, [swapError, toast]);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && !Number.isNaN(Number.parseFloat(value))) {
      const amount = Number.parseFloat(value);
      const rate = fromToken === "PAS" ? exchangeRate : 1 / exchangeRate;
      const calculated = amount * rate * (1 - fee);
      setToAmount(calculated.toFixed(6));
    } else {
      setToAmount("");
    }
  };

  const handleFlipTokens = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setFromToken(toToken);
      setToToken(fromToken);
      setFromAmount(toAmount);
      setToAmount(fromAmount);
      setIsFlipping(false);
    }, 300);
  };

  const handleSwap = async () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to swap tokens",
        variant: "destructive",
      });
      await connect();
      return;
    }

    try {
      setIsSwapping(true);
      setSwapError(null);
      
      // TODO: Implement swap using wagmi hooks
      // For now, simulate the swap
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Swap Successful!",
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      });

      setFromAmount("");
      setToAmount("");
    } catch (error: any) {
      console.error("Swap error:", error);
      setSwapError(error.message || "Swap failed");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-inner">
            <Zap className="h-5 w-5 text-background" />
          </div>
          <h2 className="font-display font-semibold text-xl md:text-2xl text-foreground tracking-tight">
            Instant Swap
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-2">
        {/* From Token */}
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            You Pay
          </label>
          <div className="swap-input-field rounded-xl p-4 focus-within:ring-1 focus-within:ring-swap-highlight/60">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="border-0 bg-transparent text-3xl font-semibold p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Balance: 100.00 {fromToken}
                </p>
              </div>
              <div className="swap-token-badge flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-lg ${
                    fromToken === "PAS"
                      ? "bg-primary text-black"
                      : "bg-secondary text-black"
                  } ${isFlipping ? "animate-spin" : ""}`}
                >
                  {fromToken === "PAS" ? "P" : "U"}
                </div>
                <span className="font-semibold text-foreground tracking-wide">
                  {fromToken}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Flip Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <Button
            onClick={handleFlipTokens}
            disabled={isFlipping}
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm border hover:bg-muted shadow-lg transition-colors"
          >
            <ArrowDownUp
              className={`h-5 w-5 text-foreground ${
                isFlipping ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            You Receive
          </label>
          <div className="bg-muted rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="border-0 bg-transparent text-3xl font-semibold p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Balance: 50.00 {toToken}
                </p>
              </div>
              <div className="bg-background border border-border flex items-center gap-2 px-4 py-2.5 rounded-xl">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-lg ${
                    toToken === "PAS"
                      ? "bg-primary text-black"
                      : "bg-secondary text-black"
                  } ${isFlipping ? "animate-spin" : ""}`}
                >
                  {toToken === "PAS" ? "P" : "U"}
                </div>
                <span className="font-semibold text-foreground tracking-wide">
                  {toToken}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && toAmount && (
          <div className="mt-6 p-4 rounded-xl bg-muted space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="font-semibold text-foreground">
                1 {fromToken} ={" "}
                {fromToken === "PAS"
                  ? exchangeRate
                  : (1 / exchangeRate).toFixed(4)}{" "}
                {toToken}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Network Fee (0.3%)</span>
              <span className="font-semibold text-foreground">
                {(Number.parseFloat(fromAmount) * fee).toFixed(6)} {fromToken}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <span className="font-semibold text-foreground">{slippage}%</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Minimum Received</span>
              <span className="font-bold text-primary">
                {(Number.parseFloat(toAmount) * (1 - slippage / 100)).toFixed(
                  6
                )}{" "}
                {toToken}
              </span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={
            isSwapping || !fromAmount || Number.parseFloat(fromAmount) <= 0
          }
          className="w-full gap-2 text-lg py-7 mt-6 bg-gradient-to-r from-primary via-secondary to-accent hover:brightness-110 text-black font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isSwapping ? (
            <>
              <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Swapping...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              {isConnected ? "Swap Tokens" : "Connect Wallet to Swap"}
            </>
          )}
        </Button>

        {/* Info */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted mt-4">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Swaps execute instantly on the Polkadot Asset Hub. Ensure you hold a
            small PAS balance to cover gas.
          </p>
        </div>
      </div>
    </Card>
  );
}
