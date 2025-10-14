import { useReadContract, useWriteContract } from "wagmi";
import { Address, Abi } from "viem";
import TokenAdministratorABI from "../abis/TokenAdministrator.json";
import { CONTRACT_ADDRESSES } from "../addresses/index";

const TOKEN_ADMINISTRATOR_ABI = TokenAdministratorABI as Abi;

/**
 * Hook para suscribirse a un evento
 * @returns Objeto con la función subscribeToEvent y estados
 */
export const useSubscribeToEvent = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const subscribeToEvent = async (eventId: bigint) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.tokenAdministrator,
      abi: TOKEN_ADMINISTRATOR_ABI,
      functionName: "subscribeToEvent",
      args: [eventId],
    });
  };

  return { subscribeToEvent, ...rest };
};

/**
 * Hook para participar en una actividad
 * @returns Objeto con la función participateInActivity y estados
 */
export const useParticipateInActivity = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const participateInActivity = async (
    eventId: bigint,
    activityName: string,
    support: boolean
  ) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.tokenAdministrator,
      abi: TOKEN_ADMINISTRATOR_ABI,
      functionName: "participateInActivity",
      args: [eventId, activityName, support],
    });
  };

  return { participateInActivity, ...rest };
};
