import { useReadContract, useWriteContract } from "wagmi";
import { Address, Abi } from "viem";
import UnitPointsTokensABI from "../abis/UnitPointsTokens.json";
import { CONTRACT_ADDRESSES } from "../addresses/index";

const UNITPOINTS_TOKENS_ABI = UnitPointsTokensABI as Abi;

/**
 * Obtiene el nombre del token
 * @returns Nombre del token
 */
export const name = () => {
  const { data } = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UNITPOINTS_TOKENS_ABI,
    functionName: "name",
  });
  return data as string;
};

/**
 * Obtiene el símbolo del token
 * @returns Símbolo del token
 */
export const symbol = () => {
  const { data } = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UNITPOINTS_TOKENS_ABI,
    functionName: "symbol",
  });
  return data as string;
};

/**
 * Obtiene los decimales del token
 * @returns Decimales del token
 */
export const decimals = () => {
  const { data } = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UNITPOINTS_TOKENS_ABI,
    functionName: "decimals",
  });
  return data as number;
};

/**
 * Obtiene el suministro total del token
 * @returns Suministro total del token
 */
export const totalSupply = () => {
  const { data } = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UNITPOINTS_TOKENS_ABI,
    functionName: "totalSupply",
  });
  return data as bigint;
};

/**
 * Obtiene el balance de una dirección
 * @param account Dirección de la cuenta
 * @returns Hook de wagmi que retorna el balance de la cuenta
 */
export const balanceOf = (account: Address) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UNITPOINTS_TOKENS_ABI,
    functionName: "balanceOf",
    args: [account],
  });
};

/**
 * Obtiene la cantidad permitida para gastar
 * @param owner Dirección del propietario
 * @param spender Dirección del gastador
 * @returns Cantidad permitida
 */
export const allowance = (owner: Address, spender: Address) => {
  const allowance = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UNITPOINTS_TOKENS_ABI,
    functionName: "allowance",
    args: [owner, spender],
  });
  return allowance;
};

/**
 * Obtiene la descripción del sector
 * @returns Descripción del sector
 */
export const sectorDescription = () => {
  const { data } = useReadContract({
    address: CONTRACT_ADDRESSES.unitPointsTokens,
    abi: UNITPOINTS_TOKENS_ABI,
    functionName: "sectorDescription",
  });
  return data as string;
};

/**
 * Hook para transferir tokens
 * @returns Objeto con la función transfer y estados
 */
export const useTransfer = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const transfer = async (to: Address, amount: bigint) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.unitPointsTokens,
      abi: UNITPOINTS_TOKENS_ABI,
      functionName: "transfer",
      args: [to, amount],
    });
  };

  return { transfer, ...rest };
};

/**
 * Hook para aprobar el gasto de tokens
 * @returns Objeto con la función approve y estados
 */
export const useApprove = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const approve = async (spender: Address, amount: bigint) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.unitPointsTokens,
      abi: UNITPOINTS_TOKENS_ABI,
      functionName: "approve",
      args: [spender, amount],
    });
  };

  return { approve, ...rest };
};

/**
 * Hook para transferir tokens desde una cuenta aprobada
 * @returns Objeto con la función transferFrom y estados
 */
export const useTransferFrom = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const transferFrom = async (from: Address, to: Address, amount: bigint) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.unitPointsTokens,
      abi: UNITPOINTS_TOKENS_ABI,
      functionName: "transferFrom",
      args: [from, to, amount],
    });
  };

  return { transferFrom, ...rest };
};
