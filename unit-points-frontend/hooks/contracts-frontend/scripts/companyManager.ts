import { useReadContract, useWriteContract } from "wagmi";
import { Address, Abi } from "viem";
import CompanyManagerABI from "../abis/CompanyManager.json";
import { CONTRACT_ADDRESSES } from "../addresses/index";

const COMPANY_MANAGER_ABI = CompanyManagerABI as Abi;

/**
 * Función para verificar si una empresa está activa
 * @param companyAddress Dirección de la empresa
 * @returns Hook de wagmi que retorna si la empresa está activa
 */
export const isActiveCompany = (companyAddress: Address) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.companyManager,
    abi: COMPANY_MANAGER_ABI,
    functionName: "isActiveCompany",
    args: [companyAddress],
    query: {
      enabled: false, // Disabled by default, use refetch when needed
    },
  });
};

/**
 * Hook para registrar una empresa
 * @returns Objeto con la función registerCompany y estados
 */
export const useRegisterCompany = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const registerCompany = async (
    name: string,
    description: string,
  ) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.companyManager,
      abi: COMPANY_MANAGER_ABI,
      functionName: "registerCompany",
      args: [name, description],
    });
  };

  return { registerCompany, ...rest };
};

/**
 * Función para obtener información de una empresa
 * @param companyAddress Dirección de la empresa
 * @returns Hook de wagmi que retorna la información de la empresa
 */
export const getCompany = (companyAddress: Address) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.companyManager,
    abi: COMPANY_MANAGER_ABI,
    functionName: "getCompany",
    args: [companyAddress],
  });
};

/**
 * Función para obtener los eventos de una empresa
 * @param companyAddress Dirección de la empresa
 * @returns Hook de wagmi que retorna los eventos de la empresa
 */
export const getCompanyEvents = (companyAddress: Address) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.companyManager,
    abi: COMPANY_MANAGER_ABI,
    functionName: "getCompanyEvents",
    args: [companyAddress],
  });
};
