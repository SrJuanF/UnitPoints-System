import { isUserSubscribed, getUserSubscribedEvents } from "../contracts-frontend/scripts/userManager";
import {useSubscribeToEvent} from "../contracts-frontend/scripts/tokenAdministrator";
import { Address } from "viem";
import { useAuth } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook para verificar si el usuario actual está suscrito a un evento específico
 * @param eventId ID del evento
 * @returns Objeto con información de suscripción y función para suscribirse
 */
export const useUserSubscription = (eventId: bigint) => {
  const {userAddress} = useAuth();
  const address = userAddress;
  const { toast } = useToast();
  
  // Verificar si el usuario está suscrito al evento
  const subscriptionResult = isUserSubscribed(address as Address, eventId);
  
  // Hook para suscribirse al evento
  const { subscribeToEvent, isPending, isSuccess, error } = useSubscribeToEvent();
  
  const handleSubscribe = async () => {

    if (!address) return;
    
    try {
      // Notificación de inicio de transacción
      toast({
        title: "Subscribing to Event",
        description: "Transaction submitted. Please wait for confirmation...",
      });

      await subscribeToEvent(eventId);

      // Notificación de éxito
      toast({
        title: "Successfully Subscribed! 🎉",
        description: "You are now subscribed to this event and can participate in activities.",
      });

      // Refetch subscription status
      await subscriptionResult.refetch?.();
    } catch (err: any) {
      console.error("Error subscribing to event:", err);
      
      // Notificación de error detallada
      toast({
        title: "Subscription Failed",
        description: err.message?.includes("User rejected") 
          ? "Transaction was cancelled by user"
          : err.message || "Failed to subscribe to event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isSubscribed: (subscriptionResult.data as boolean) || false,
    isLoading: subscriptionResult.isLoading || false,
    subscribeToEvent: handleSubscribe,
    isSubscribing: isPending || false,
    subscriptionSuccess: isSuccess || false,
    subscriptionError: error,
    refetch: subscriptionResult.refetch,
  };
};

/**
 * Hook para obtener todos los eventos a los que está suscrito el usuario actual
 * @returns Objeto con los eventos suscritos y estado de carga
 */
export const useUserSubscribedEvents = () => {
  const {userAddress} = useAuth();
  const address = userAddress;
  
  const result = getUserSubscribedEvents(address as `0x${string}`);
  
  return {
    subscribedEventIds: result.data as bigint[] || [],
    isLoading: result.isLoading || false,
    error: result.error || null,
    refetch: result.refetch,
  };
};