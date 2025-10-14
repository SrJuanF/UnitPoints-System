// Enhanced wallet hook with Privy + wagmi integration
"use client";

/*import {
  usePrivy,
  useSendTransaction,
  useWallets,
  useCreateWallet,
  ConnectedWallet,
} from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useAccount, useChainId } from "wagmi";
import { useCallback, useMemo } from "react";

interface WalletState {
  provider: any | null;
  signer: any | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  wallets: ConnectedWallet[];
  activeWallet: ConnectedWallet | null;
}*/

export function useWallet() {
  /*
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { sendTransaction } = useSendTransaction();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const { setActiveWallet } = useSetActiveWallet();
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const chainId = useChainId();

  // Get active wallet (first wallet or the one set as active)
  const activeWallet = useMemo(() => {
    return wallets.length > 0 ? wallets[0] : null;
  }, [wallets]);

  // Create wallet state combining Privy and wagmi data
  const wallet: WalletState = {
    provider: null, // Will be created when needed
    signer: null, // Will be set when needed
    address: wagmiAddress || activeWallet?.address || null,
    chainId: chainId || null,
    isConnected: wagmiConnected || (authenticated && !!activeWallet),
    isConnecting: !ready,
    wallets: wallets,
    activeWallet: activeWallet,
  };

  // Connect wallet using Privy
  const connect = useCallback(async () => {
    if (!ready) {
      throw new Error("Privy is not ready");
    }

    if (authenticated) {
      return {
        provider: wallet.provider,
        signer: wallet.signer,
        address: wallet.address,
        chainId: wallet.chainId,
        isConnected: true,
        isConnecting: false,
      };
    }

    try {
      await login();
      return {
        provider: wallet.provider,
        signer: wallet.signer,
        address: wallet.address,
        chainId: wallet.chainId,
        isConnected: true,
        isConnecting: false,
      };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to connect wallet";
      throw new Error(errorMessage);
    }
  }, [ready, authenticated, login, wallet]);

  // Disconnect wallet using Privy
  const disconnect = useCallback(async () => {
    try {
      await logout();
    } catch (err: any) {
      console.error("Failed to disconnect:", err);
    }
  }, [logout]);

  // Sign message for authentication
  const signMessage = useCallback(
    async (message: string) => {
      if (!activeWallet) {
        throw new Error("Wallet not connected");
      }

      try {
        // For now, return a mock signature
        // TODO: Implement proper message signing with Privy
        console.log("Signing message:", message);
        return "0x" + "mock_signature_" + Date.now();
      } catch (err: any) {
        const errorMessage = err.message || "Failed to sign message";
        throw new Error(errorMessage);
      }
    },
    [activeWallet]
  );

  // Switch to specific network
  const switchNetwork = useCallback(
    async (chainId: number) => {
      if (!activeWallet) {
        throw new Error("No wallet connected");
      }

      try {
        // For now, just log the chain switch request
        console.log(`Switching to chain ${chainId}`);
        // TODO: Implement chain switching with Privy
      } catch (err: any) {
        console.error("Failed to switch network:", err);
        throw err;
      }
    },
    [activeWallet]
  );

  // Get signer when needed
  const getSigner = useCallback(async () => {
    if (!activeWallet) {
      throw new Error("Wallet not connected");
    }

    // Return the active wallet as the signer
    return activeWallet;
  }, [activeWallet]);

  // Send transaction using Privy's sendTransaction
  const sendTransactionWithPrivy = useCallback(
    async (transaction: {
      to: string;
      value?: string | number;
      data?: string;
    }) => {
      if (!activeWallet) {
        throw new Error("Wallet not connected");
      }

      try {
        const result = await sendTransaction({
          to: transaction.to,
          value: transaction.value ? BigInt(transaction.value) : undefined,
          data: transaction.data,
        });
        return result;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to send transaction";
        throw new Error(errorMessage);
      }
    },
    [activeWallet, sendTransaction]
  );

  // Check if user has an embedded wallet
  const hasEmbeddedWallet = useCallback(() => {
    return activeWallet?.walletClientType === "privy";
  }, [activeWallet]);

  // Get wallet type (embedded or external)
  const getWalletType = useCallback(() => {
    if (!activeWallet) return null;
    return activeWallet.walletClientType === "privy" ? "embedded" : "external";
  }, [activeWallet]);

  // Switch active wallet
  const switchWallet = useCallback(
    async (walletAddress: string) => {
      const targetWallet = wallets.find((w) => w.address === walletAddress);
      if (!targetWallet) {
        throw new Error("Wallet not found");
      }
      await setActiveWallet(targetWallet);
    },
    [wallets, setActiveWallet]
  );

  // Create new embedded wallet
  const createEmbeddedWallet = useCallback(async () => {
    if (!authenticated) {
      throw new Error("User must be authenticated to create wallet");
    }
    return await createWallet();
  }, [authenticated, createWallet]);

  return {
    ...wallet,
    signer: null, // Will be resolved when needed via getSigner
    error: null, // Privy handles errors internally
    isMetaMaskInstalled: true, // Privy provides wallet functionality
    connect,
    disconnect,
    switchNetwork,
    signMessage,
    getSigner,
    sendTransaction: sendTransactionWithPrivy,
    hasEmbeddedWallet,
    getWalletType,
    switchWallet,
    createEmbeddedWallet,
    // Additional Privy-specific methods
    ready,
    authenticated,
    user,
    activeWallet,
  };
  */
}
