"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getExplorerUrl, shortenAddress } from "@/lib/web3-utils";

const recentSwaps = [
  {
    id: 1,
    from: "PAS",
    to: "UPT",
    fromAmount: "10.5",
    toAmount: "15.75",
    address: "0x1234...5678",
    time: "2 min ago",
    hash: "0xabcd...ef01",
  },
  {
    id: 2,
    from: "UPT",
    to: "PAS",
    fromAmount: "25.0",
    toAmount: "16.67",
    address: "0x2345...6789",
    time: "5 min ago",
    hash: "0xbcde...f012",
  },
  {
    id: 3,
    from: "PAS",
    to: "UPT",
    fromAmount: "5.2",
    toAmount: "7.8",
    address: "0x3456...7890",
    time: "8 min ago",
    hash: "0xcdef...0123",
  },
  {
    id: 4,
    from: "UPT",
    to: "PAS",
    fromAmount: "50.0",
    toAmount: "33.33",
    address: "0x4567...8901",
    time: "12 min ago",
    hash: "0xdef0...1234",
  },
];

export function RecentSwaps() {
  return (
    <Card className="p-6">
      <h3 className="font-display font-semibold text-lg md:text-xl mb-5 text-foreground tracking-tight">
        Recent Swaps
      </h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {recentSwaps.map((swap) => (
            <div
              key={swap.id}
              className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-foreground">
                    {swap.fromAmount} {swap.from}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-semibold text-primary">
                    {swap.toAmount} {swap.to}
                  </span>
                </div>
                <a
                  href={getExplorerUrl(swap.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/45">
                <span>{shortenAddress(swap.address)}</span>
                <span>{swap.time}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
