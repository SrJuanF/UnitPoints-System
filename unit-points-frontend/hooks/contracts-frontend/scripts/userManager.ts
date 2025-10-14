import { useReadContract, useWriteContract } from "wagmi";
import { Address, Abi } from "viem";
import UserManagerABI from "../abis/UserManager.json";
import { CONTRACT_ADDRESSES } from "../addresses/index";

const USER_MANAGER_ABI = UserManagerABI as Abi;

/**
 * Función para verificar si un usuario está registrado
 * @param userAddress Dirección del usuario
 * @returns Hook de wagmi que retorna si el usuario está registrado
 */
export const isUserRegistered = (userAddress: Address) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.userManager,
    abi: USER_MANAGER_ABI,
    functionName: "isUserRegistered",
    args: [userAddress],
    query: {
      enabled: false, // Disabled by default, use refetch when needed
    },
  });
};

/**
 * Hook para registrar un usuario
 * @returns Objeto con la función registerUser y estados
 */
export const useRegisterUser = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const registerUser = async () => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.userManager,
      abi: USER_MANAGER_ABI,
      functionName: "registerUser",
      args: [],
    });
  };

  return { registerUser, ...rest };
};

/**
 * Función para verificar si un usuario está suscrito a un evento
 * @param userAddress Dirección del usuario
 * @param eventId ID del evento
 * @returns Hook de wagmi que retorna si el usuario está suscrito
 */
export const isUserSubscribed = (userAddress: Address, eventId: bigint) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.userManager,
    abi: USER_MANAGER_ABI,
    functionName: "isUserSubscribed",
    args: [userAddress, eventId],
    query: {
      enabled: !!userAddress && !!eventId,
    },
  });
};

/**
 * Función para obtener los eventos a los que está suscrito un usuario
 * @param userAddress Dirección del usuario
 * @returns Hook de wagmi que retorna los eventos suscritos
 */
export const getUserSubscribedEvents = (userAddress: Address) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.userManager,
    abi: USER_MANAGER_ABI,
    functionName: "getUserSubscribedEvents",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });
};

/**
 * Función para obtener la información de un usuario
 * @param userAddress Dirección del usuario
 * @returns Hook de wagmi que retorna la información del usuario
 */
export const getUser = (userAddress: Address) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.userManager,
    abi: USER_MANAGER_ABI,
    functionName: "getUser",
    args: [userAddress],
  });
};

