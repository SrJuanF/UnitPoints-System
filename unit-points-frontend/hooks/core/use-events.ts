"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import * as EventManager from "@/hooks/contracts-frontend/scripts/eventManager";
import * as TokenAdministrator from "@/hooks/contracts-frontend/scripts/tokenAdministrator";
// Re-export types for convenience
export type {
  Event,
  Activity,
  EventInfoReturn,
} from "@/hooks/contracts-frontend/scripts/eventManager";
export { ActivityType, ProposalType } from "@/hooks/contracts-frontend/scripts/eventManager";

/**
 * Hook for managing events and activities
 * Provides a unified interface for event-related operations
 */
export function useEvents() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get total event count from blockchain
  const nextEventIdResult = EventManager.useGetNextEventId();

  // Initialize the write hooks
  const { createEvent: createEventWrite, isPending: isCreatingEvent } =
    EventManager.useCreateEvent();
  const { addActivity: addActivityWrite, isPending: isAddingActivity } =
    EventManager.useAddActivity();

  // Define a maximum number of events to support (can be increased as needed)
  const MAX_EVENTS = 100;

  // Always call the same number of hooks (Rules of Hooks compliance)
  const eventHooks = Array.from({ length: MAX_EVENTS }, (_, i) => 
    EventManager.useGetEventInfo(BigInt(i))
  );

  // Generate array of valid event IDs based on nextEventId
  const eventIds = useMemo(() => {
    if (!nextEventIdResult.data) {
      return [];
    }
    // nextEventId es el próximo ID disponible, por lo que los eventos van de 0 a nextEventId-1
    const nextEventId = Number(nextEventIdResult.data);
    const totalEvents = nextEventId; // Si nextEventId = 3, entonces hay eventos 0, 1, 2

    if (totalEvents === 0) {
      return [];
    }
    
    const ids = Array.from({ length: Math.min(totalEvents, MAX_EVENTS) }, (_, i) => i);
    return ids;
  }, [nextEventIdResult.data]);

  // Combine all event data and loading states (only for valid event IDs)
  const events = useMemo(() => {
    const validEvents = eventIds
      .map(eventId => {
        const hook = eventHooks[eventId];
        /*console.log(`🔍 [use-events] Event ${eventId} hook:`, {
          data: hook?.data,
          isLoading: hook?.isLoading,
          error: hook?.error
        });*/
        return hook?.data;
      })
      .filter((data): data is EventManager.EventInfoReturn => data !== undefined);
    
    return validEvents;
  }, [eventIds, eventHooks]);

  const isLoadingEvents = useMemo(() => {
    const relevantHooks = eventIds.map(id => eventHooks[id]);
    const isLoading = nextEventIdResult.isLoading || relevantHooks.some(hook => hook?.isLoading);
    /*console.log("🔍 [use-events] Loading states:", {
      nextEventIdLoading: nextEventIdResult.isLoading,
      eventHooksLoading: relevantHooks.map(hook => hook?.isLoading),
      overallLoading: isLoading
    });*/
    return isLoading;
  }, [nextEventIdResult.isLoading, eventIds, eventHooks]);

  // Check for errors in any of the hooks
  useEffect(() => {
    const relevantHooks = eventIds.map(id => eventHooks[id]);
    const hookErrors = relevantHooks
      .map(hook => hook?.error)
      .filter(error => error !== null && error !== undefined);
    

    if (hookErrors.length > 0) {
      //console.log("🔍 [use-events] Setting error from hook errors");
      setError(`Failed to fetch some events: ${hookErrors[0]?.message}`);
    } else if (nextEventIdResult.error) {
      //console.log("🔍 [use-events] Setting error from nextEventId");
      setError(`Failed to get event count: ${nextEventIdResult.error.message}`);
    } else {
      //console.log("🔍 [use-events] No errors, clearing error state");
      setError(null);
    }
  }, [eventIds, eventHooks, nextEventIdResult.error]);

  /**
   * Participate in an activity
   */
  const { participateInActivity: participateInActivityContract, isPending: isParticipating } = TokenAdministrator.useParticipateInActivity();

  const participateInActivity = useCallback(
    async (eventId: bigint, activityName: string, support: boolean = true) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }
      setLoading(true);
      setError(null);
      try {
        console.log("Participating in activity:", { eventId, activityName, support });
        await participateInActivityContract(eventId, activityName, support);
        console.log("Successfully participated in activity");
      } catch (err: any) {
        console.error("Error participating in activity:", err);
        setError(err.message || "Failed to participate in activity");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [address, participateInActivityContract]
  );

  /**
   * Create a new event (company only)
   */
  const createEvent = useCallback(
    async (
      name: string,
      description: string,
      sectorId: number,
      startDate: Date,
      endDate: Date
    ) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);
      try {
        const hash = await createEventWrite(
          name,
          description,
          BigInt(sectorId),
          BigInt(Math.floor(startDate.getTime() / 1000)),
          BigInt(Math.floor(endDate.getTime() / 1000))
        );

        console.log("Event transaction hash:", hash);
        return hash;
      } catch (err: any) {
        setError(err.message || "Failed to create event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [address, createEventWrite]
  );

  /**
   * Add activity to an event (company only)
   */
  const addActivity = useCallback(
    async (
      eventId: bigint,
      name: string,
      description: string,
      activityType: EventManager.ActivityType,
      points: bigint,
      maxParticipants: bigint,
      proposalType: EventManager.ProposalType = EventManager.ProposalType.GENERAL,
      votingPeriod: bigint = BigInt(7 * 24 * 60 * 60), // 7 days in seconds
      minVotingPower: bigint = BigInt(1),
      quorumThreshold: bigint = BigInt(50), // 50%
      approvalThreshold: bigint = BigInt(50), // 50%
    ) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);
      try {
        console.log("Adding activity:", {
          eventId,
          name,
          description,
          activityType,
          points,
          maxParticipants,
          proposalType,
          votingPeriod,
          minVotingPower,
          quorumThreshold,
          approvalThreshold,
        });

        const hash = await addActivityWrite(
          eventId,
          name,
          description,
          activityType,
          points,
          maxParticipants,
          proposalType,
          votingPeriod,
          minVotingPower,
          quorumThreshold,
          approvalThreshold
        );

        console.log("✅ Activity transaction submitted:", hash);
        console.log("⏳ Waiting for confirmation...");

        // Wait for transaction confirmation
        // Note: In production, you should use useWaitForTransactionReceipt
        // For now, we'll just return the hash and let the user know

        return hash;
      } catch (err: any) {
        console.error("❌ Failed to add activity:", err);
        setError(err.message || "Failed to add activity");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [address, addActivityWrite]
  );

  return {
    // State
    events: events, // Now contains complete event information
    loading: loading || isCreatingEvent || isAddingActivity || isParticipating,
    error: error,
    isLoadingEvents: isLoadingEvents,
    NextIdEvents: nextEventIdResult.data ? Number(nextEventIdResult.data) : 0,

    // Actions
    participateInActivity,
    createEvent,
    addActivity,
  };
}
