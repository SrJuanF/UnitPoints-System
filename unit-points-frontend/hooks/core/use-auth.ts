"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useLogin } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";
import { useCallback, useMemo, useEffect, useState } from "react";
import * as UserManager from "@/hooks/contracts-frontend/scripts/userManager";
import * as CompanyManager from "@/hooks/contracts-frontend/scripts/companyManager";
/**
 * Enhanced authentication hook using Privy
 * Provides a unified interface for authentication across the application
 * Automatically detects if user is registered as a company on-chain
 */
export function useAuth() {
  const { wallets, ready: walletsReady } = useWallets();
  const { ready, authenticated, user, logout } = usePrivy();

  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [userRole, setUserRole] = useState<"user" | "company" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const [cacheRole, setCacheRole] = useState<"user" | "company" | null>(null);
  const [shouldCheckBlockchain, setShouldCheckBlockchain] = useState(false);
  const [privyAddress, setPrivyAddress] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Always call hooks but disable them initially
  const companyCheck = CompanyManager.isActiveCompany(
    privyAddress as `0x${string}`
  );
  const userCheck = UserManager.isUserRegistered(privyAddress as `0x${string}`);

  const info = useCallback(() => {
    /*console.log("*********************************");
    console.log("walletReady", walletsReady);
    console.log("isConnected", isConnected);
    console.log("ready", ready);
    console.log("Wallet", wallets?.[0]?.address)*/
    if (walletsReady && isConnected && wallets?.[0]?.address && user) {
      const adress = wallets?.[0]?.address;
      const emmail = user?.email?.address || null;
      const usserId = user?.id;
      setPrivyAddress(adress as `0x${string}`);
      setEmail(emmail as string);
      setUserId(usserId as string);
      // Check cached role first to avoid unnecessary blockchain calls
      const cachedRol = adress
        ? localStorage.getItem(adress)
        : null;
      const shouldCheck = !cachedRol && !!adress;
      setCacheRole(cachedRol as "user" | "company" | null);
      setShouldCheckBlockchain(Boolean(shouldCheck));

      //console.log("cachedRol", cachedRol);
      //console.log("shouldCheck", shouldCheck);
    }
  }, [walletsReady, isConnected, wallets, user, ready]);

  useEffect(() => {
    info();
  }, [info]);

  useEffect(() => {
    if (!walletsReady || !isConnected || !privyAddress) {
      setIsLoading(false);
      setUserRole(null);
      return;
    }

    // Check cached role first - if exists, use it immediately
    if (cacheRole === "user" || cacheRole === "company") {
      setUserRole(cacheRole as "user" | "company");
      setIsLoading(false);
      return;
    }

    // No cached role, need to check blockchain - trigger refetch
    if (shouldCheckBlockchain) {
      setIsLoading(true);

      // Check company status first
      try {
        companyCheck
          .refetch()
          .then((companyResult) => {
            // If user is a company, we're done
            if (companyResult.data === true) {
              localStorage.setItem(privyAddress, "company");
              setUserRole("company");
              setIsLoading(false);
              return;
            }

            // If not a company, check if user is registered
            userCheck
              .refetch()
              .then((userResult) => {
                if (userResult.data === true) {
                  localStorage.setItem(privyAddress, "user");
                  setUserRole("user");
                  setIsLoading(false);
                  return;
                }

                // If neither company nor user, show registration modal
                setShowRegistrationModal(true);
                setIsLoading(false);
              })
              .catch((error) => {
                console.error("Error refetching user registration:", error);
                setUserRole(null);
                setIsLoading(false);
              });
          })
          .catch((error) => {
            console.error("Error refetching company status:", error);
            setUserRole(null);
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Error refetching company status:", error);
        setUserRole(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [
    privyAddress,
    cacheRole,
    shouldCheckBlockchain,
    companyCheck.refetch,
    userCheck.refetch,
  ]);

  // Función para desconectar tanto Wagmi como Privy
  const privyLogout = async () => {
    try {
      // Limpiar estados locales primero
      if (privyAddress) localStorage.removeItem(privyAddress);
      setUserRole(null);
      setPrivyAddress(null);
      setEmail(null);
      setUserId(null);
      setCacheRole(null);
      setShouldCheckBlockchain(false);
      
      // Luego desconectar Privy
      await logout();
      // Desconectar Wagmi primero
      await disconnect();
    } catch (error) {
      console.error("Error during disconnect:", error);
    }
  };
  //Login - Register
  const { login } = useLogin({
    onComplete: (loginData: any) => {
      console.log("👤 LinkedAccounts:", loginData?.linkedAccounts?.length);
      /*const newPrivyAddress = loginData?.linkedAccounts?.[0]?.address;
      // Forzar re-evaluación del estado después del login
      if (newPrivyAddress) {
        // Limpiar cache previo si existe
        const existingCache = localStorage.getItem(newPrivyAddress);
        if (!existingCache) {
          console.log("Antes de Entrar");
          info();
          // Si no hay cache, forzar verificación blockchain
          setShouldCheckBlockchain(true);
        } else {
          setUserRole(existingCache as "user" | "company");
        }
      }*/
      // Verificar si hay una wallet conectada recientemente (últimos 3 minutos)
      const hasRecentWalletConnection = loginData?.linkedAccounts?.some(
        (account: any) => {
          if (account.type === "wallet" && account.verifiedAt) {
            const verifiedTime = new Date(account.verifiedAt);
            const currentTime = new Date();
            const timeDifferenceInMinutes =
              (currentTime.getTime() - verifiedTime.getTime()) / (1000 * 60);
            /*console.log('🔍 Wallet verification check:', {
            type: account.type,
            verifiedAt: account.verifiedAt,
            timeDifferenceInMinutes: timeDifferenceInMinutes.toFixed(2),
            isRecent: timeDifferenceInMinutes <= 3
          });*/
            return timeDifferenceInMinutes <= 3;
          }
          return false;
        }
      );

      if (hasRecentWalletConnection) {
        //console.log("✅ Wallet conectada recientemente detectada!");
        // Mostrar modal de registro cuando se detecte una conexión reciente
        setShowRegistrationModal(true);
      } else {
        /*console.log(
          "⏰ No se detectó creacion de wallet reciente (últimos 3 minutos)"
        );*/
      }
    },
    onError: (error: any) => {
      console.error("❌ Login failed:", error);
    },
  });

  return {
    // status loading
    isLoading,
    // Core authentication state
    setUserRole,
    userRole,
    userAddress: privyAddress,
    email,
    userId,
    authenticated,
    ready,
    // Authentication actions
    login,
    privyLogout,
    // Registration modal state
    showRegistrationModal,
    setShowRegistrationModal,
    // Register on-chain actions
    //registerOnChain,
    //registeringOnChain: address ? Boolean(reg?.isFetching) : false
  };
}

/*
// Register the currently connected wallet on-chain (UserRegistry)
  const registerOnChain = useCallback(async () => {
    if (!address) {
      console.error("No wallet connected");
      throw new Error("No wallet connected");
    }

    try {
      // Nota: registerUser ahora es parte del hook useRegisterUser
      // const { registerUser } = UserManager.useRegisterUser();
      // await registerUser();
      try {
        await reg.refetch?.();
      } catch (refetchError) {
        console.warn("Failed to refetch registration status:", refetchError);
      }
    } catch (error) {
      console.error("On-chain registration failed:", error);
      throw error;
    }
  }, [address, reg?.refetch]);
*/
