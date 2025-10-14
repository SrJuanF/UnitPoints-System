"use client";

import { useCallback } from "react";
import {useAuth} from "@/hooks";
import * as CompanyManager from "@/hooks/contracts-frontend/scripts/companyManager";

/**
 * Hook for managing company operations
 * Provides company registration, status checks, and company data from blockchain
 */
export function useCompany() {
  const {userAddress} = useAuth();
  const address = userAddress;

  // Check if current wallet is an active company
  const isActiveCompanyResult = CompanyManager.isActiveCompany(
    address as `0x${string}` || "0x0000000000000000000000000000000000000000"
  );

  // Get company data from blockchain
  const companyDataResult = CompanyManager.getCompany(
    address as `0x${string}` || "0x0000000000000000000000000000000000000000"
  );

  // Get company events
  const companyEventsResult = CompanyManager.getCompanyEvents(
    address as `0x${string}` || "0x0000000000000000000000000000000000000000"
  );

  // Hook for registering as company
  const { registerCompany: registerCompanyWrite, isPending: isRegistering } =
    CompanyManager.useRegisterCompany();

  /**
   * Register current wallet as a company
   */
  const registerAsCompany = useCallback(
    async (name: string, description: string) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      try {
        await registerCompanyWrite(
          name,
          description
        );
      } catch (error: any) {
        console.error("Failed to register company:", error);
        throw error;
      }
    },
    [address, registerCompanyWrite]
  );

  return {
    // Company status
    isActiveCompany: address ? Boolean(isActiveCompanyResult.data) : false,
    isCheckingCompanyStatus: isActiveCompanyResult.isLoading,

    // Company data from blockchain
    companyData: companyDataResult.data,
    isLoadingCompanyData: companyDataResult.isLoading,

    // Company events
    companyEventIds: companyEventsResult.data || [],
    isLoadingCompanyEvents: companyEventsResult.isLoading,

    // Actions
    registerAsCompany,
    isRegistering,

    // Refetch functions
    refetchCompanyStatus: isActiveCompanyResult.refetch,
    refetchCompanyData: companyDataResult.refetch,
    refetchCompanyEvents: companyEventsResult.refetch,
  };
}
