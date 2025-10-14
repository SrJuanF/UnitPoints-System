"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useSwitchChain } from 'wagmi';
import { useAuth } from "@/hooks";
import { shortenAddress } from "@/lib/web3-utils";
import { Wallet, LogOut, ChevronDown, Network, Copy, ExternalLink, Check, User } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export function ConnectWalletButton() {
  // State for copy functionality and dropdown
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Privy hooks
  const { ready, authenticated} = usePrivy();
  // WAGMI hooks
  const { chain } = useAccount();
  const { chains, error: switchNetworkError, switchChain } = useSwitchChain();
  //Auth Hooks
  const { userAddress: walletAddress, login, privyLogout } = useAuth();

  // Handler functions for new functionality
  const handleCopyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <Button disabled className="gap-2 bg-gradient-to-r from-orange-500 via-blue-500 to-yellow-500 text-white font-semibold shadow-lg opacity-75 cursor-not-allowed border-0">
        <Wallet className="h-4 w-4 animate-spin" />
        Loading Auth...
      </Button>
    );
  }

  // If wallet is connected and user is authenticated
  if (walletAddress && authenticated) {
    return (
      <div className="relative" ref={dropdownRef}>
        <Button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="gap-2 bg-gradient-to-r from-orange-500 via-blue-500 to-yellow-500 hover:from-orange-600 hover:via-blue-600 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
        >
          <Wallet className="h-4 w-4" />
          <span className="flex items-center gap-1">
            {shortenAddress(walletAddress)}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </Button>

        {/* Custom Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-md z-50 animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Network Section */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Network
                </div>
                {chain && (
                  <Badge variant="secondary" className="font-mono text-xs">
                    {chain.name}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {chains.map((x) => (
                  <Button
                    disabled={!switchChain || x.id === chain?.id}
                    key={x.id}
                    onClick={() => switchChain?.({chainId: x.id})}
                    variant={x.id === chain?.id ? "default" : "outline"}
                    size="sm"
                    className={`text-xs px-2 py-1 h-7 transition-all duration-200 ${
                      x.id === chain?.id 
                        ? "bg-gradient-to-r from-orange-500 via-blue-500 to-yellow-500 text-white shadow-md" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {x.name}
                  </Button>
                ))}
              </div>
              
              {/* Error Section */}
              {switchNetworkError && (
                <div className="mt-2">
                  <div className="text-red-500 text-xs bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-800">
                    Error: {switchNetworkError.message}
                  </div>
                </div>
              )}
            </div>

            {/* Copy Address Section */}
            {walletAddress && (
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleCopyAddress}
                  className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="text-sm">
                      {copied ? "Copied!" : "Copy Address"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {shortenAddress(walletAddress)}
                  </span>
                </button>
              </div>
            )}

            {/* Dashboard Section */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <Link 
                href="/dashboard" 
                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
            </div>
            
            {/* Disconnect Section */}
            <div className="px-4 py-3">
              <button
                onClick={() => {
                  privyLogout();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Disconnect Wallet</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If wallet is connected but user is not authenticated (should not happen much with Privy)
  if (walletAddress && !authenticated) {
    return (
      <Button
        onClick={privyLogout}
        variant="outline"
        className="gap-2 bg-transparent"
      >
        <Wallet className="h-4 w-4" />
        {shortenAddress(walletAddress)}
      </Button>
    );
  }

  // Default: not connected, show connect button
  return (
    <Button 
      onClick={login}
      className="gap-2 bg-gradient-to-r from-orange-500 via-blue-500 to-yellow-500 hover:from-orange-600 hover:via-blue-600 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
