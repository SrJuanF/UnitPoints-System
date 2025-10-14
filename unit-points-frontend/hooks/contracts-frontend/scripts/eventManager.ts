import { useReadContract, useWriteContract } from "wagmi";
import { Address, Abi } from "viem";
import EventManagerABI from "../abis/EventManager.json";
import { CONTRACT_ADDRESSES } from "../addresses/index";

const EVENT_MANAGER_ABI = EventManagerABI as Abi;

export enum ActivityType {
  REDEEM = 0, 
  EARN = 1, 
  VOTE = 2 
}

export enum ProposalType {
  GENERAL = 0,
  SECTOR = 1,
  TOKEN_MINT = 2,
  PARAMETER = 3
}

export interface Event {
  eventId: bigint;
  companyAddress: Address;
  name: string;
  description: string;
  sectorId: bigint;
  startDate: bigint;
  endDate: bigint;
  isActive: boolean;
  // activityIds debe obtenerse por separado usando useGetEventActivities
}

export interface Activity {
  activityId: bigint;
  eventId: bigint;
  name: string;
  description: string;
  activityType: ActivityType;
  pointsReward: bigint;
  maxParticipants: bigint;
  currentParticipants: bigint;
  isActive: boolean;
}

// Tipos específicos para los valores de retorno del contrato
export type EventInfoReturn = [
  bigint,    // eventId (uint32)
  Address,   // company (address)
  string,    // name
  string,    // description
  bigint,    // sectorTokenId (uint16)
  bigint,    // startDate (uint64)
  bigint,    // endDate (uint64)
  boolean    // isActive
];

export type ActivityInfoReturn = [
  boolean,   // isActive
  number,    // activityType (enum as number)
  bigint,    // pointsReward (uint32)
  bigint,    // pointsCost (uint32)
  bigint,    // maxParticipants (uint16)
  bigint,    // currentParticipants (uint16)
  bigint     // proposalId (uint32)
];

/**
 * Hook para crear un evento
 * @returns Objeto con la función createEvent y estados
 */
export const useCreateEvent = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const createEvent = async (
    name: string,
    description: string,
    sectorId: bigint,
    startDate: bigint,
    endDate: bigint
  ) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.eventManager,
      abi: EVENT_MANAGER_ABI,
      functionName: "createEvent",
      args: [name, description, sectorId, startDate, endDate],
    });
  };

  return { createEvent, ...rest };
};

/**
 * Hook para agregar una actividad a un evento
 * @returns Objeto con la función addActivity y estados
 */
export const useAddActivity = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const addActivity = async (
    eventId: bigint,
    activityName: string,
    description: string,
    activityType: ActivityType,
    points: bigint,
    maxParticipants: bigint,
    proposalType: ProposalType,
    votingPeriod: bigint,
    minVotingPower: bigint,
    quorumThreshold: bigint,
    approvalThreshold: bigint,
  ) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.eventManager,
      abi: EVENT_MANAGER_ABI,
      functionName: "addActivity",
      args: [
        eventId,
        activityName,
        description,
        activityType,
        points,
        maxParticipants,
        proposalType,
        votingPeriod,
        minVotingPower,
        quorumThreshold,
        approvalThreshold,
      ],
    });
  };

  return { addActivity, ...rest };
};

/**
 * Hook para obtener información de un evento
 * @param eventId ID del evento
 * @returns Hook de wagmi que retorna la información del evento
 */
export const useGetEventInfo = (eventId?: bigint) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.eventManager,
    abi: EVENT_MANAGER_ABI,
    functionName: "getEventInfo",
    args: eventId !== undefined ? [eventId] : undefined,
    query: { enabled: eventId !== undefined },
  });
};

/**
 * Hook para obtener información de una actividad específica
 * @param eventId - ID del evento
 * @param activityName - Nombre de la actividad
 * @returns Hook de wagmi que retorna la información de la actividad
 */
export const useGetActivityInfo = (eventId?: bigint, activityName?: string) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.eventManager,
    abi: EVENT_MANAGER_ABI,
    functionName: "getActivityInfo",
    args: eventId !== undefined && activityName ? [eventId, activityName] : undefined,
    query: { enabled: eventId !== undefined && !!activityName },
  }) as {
    data: ActivityInfoReturn | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
};

/**
 * Hook para obtener las actividades de un evento
 * @param eventId - ID del evento
 * @returns Hook de wagmi que retorna las actividades del evento como string[]
 */
export const useGetEventActivities = (eventId?: bigint) => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.eventManager,
    abi: EVENT_MANAGER_ABI,
    functionName: "getEventActivities",
    args: eventId !== undefined ? [eventId] : undefined,
    query: { enabled: eventId !== undefined },
  }) as {
    data: string[] | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
};

/**
 * Hook para obtener el próximo ID de evento
 * Lee la variable pública nextEventId del contrato
 * @returns Hook de wagmi que retorna el próximo ID de evento
 */
export const useGetNextEventId = () => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.eventManager,
    abi: EVENT_MANAGER_ABI,
    functionName: "nextEventId",
  });
};
