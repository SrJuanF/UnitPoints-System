"use client";

import { useCallback } from "react";
import { formatUnits, parseUnits } from "viem";

/**
 * Hook con utilidades para manejo de tokens
 */
export function useTokenUtils() {
  // Formatear balance de tokens
  const formatBalance = useCallback(
    (balance: bigint | undefined, decimals: number = 18) => {
      if (!balance) return "0";
      return formatUnits(balance, decimals);
    },
    []
  );

  // Parsear cantidad de tokens
  const parseAmount = useCallback((amount: string, decimals: number = 18) => {
    try {
      return parseUnits(amount, decimals);
    } catch (error) {
      console.error("Error parsing amount:", error);
      return 0n;
    }
  }, []);

  // Verificar si hay suficiente balance
  const hasEnoughBalance = useCallback(
    (balance: bigint | undefined, amount: string, decimals: number = 18) => {
      if (!balance) return false;
      try {
        const requiredAmount = parseUnits(amount, decimals);
        return balance >= requiredAmount;
      } catch (error) {
        console.error("Error checking balance:", error);
        return false;
      }
    },
    []
  );

  // Verificar si hay suficiente allowance
  const hasEnoughAllowance = useCallback(
    (allowance: bigint | undefined, amount: string, decimals: number = 18) => {
      if (!allowance) return false;
      try {
        const requiredAmount = parseUnits(amount, decimals);
        return allowance >= requiredAmount;
      } catch (error) {
        console.error("Error checking allowance:", error);
        return false;
      }
    },
    []
  );

  // Formatear balance con decimales específicos
  const formatBalanceWithDecimals = useCallback(
    (
      balance: bigint | undefined,
      decimals: number = 18,
      displayDecimals: number = 4
    ) => {
      if (!balance) return "0";
      const formatted = formatUnits(balance, decimals);
      const num = parseFloat(formatted);
      return num.toFixed(displayDecimals);
    },
    []
  );

  // Convertir wei a ether
  const weiToEther = useCallback((wei: bigint | string) => {
    return formatUnits(BigInt(wei), 18);
  }, []);

  // Convertir ether a wei
  const etherToWei = useCallback((ether: string) => {
    return parseUnits(ether, 18);
  }, []);

  return {
    formatBalance,
    parseAmount,
    hasEnoughBalance,
    hasEnoughAllowance,
    formatBalanceWithDecimals,
    weiToEther,
    etherToWei,
  };
}
