"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";
import { useUserSubscription } from "@/hooks";
import {
  Calendar,
  Building2,
  Trophy,
  Users,
  Loader2,
  CheckCircle2,
  QrCode,
  Lock,
  X,
} from "lucide-react";
import * as EventManager from "@/hooks/contracts-frontend/scripts/eventManager";
import * as TokenAdministrator from "@/hooks/contracts-frontend/scripts/tokenAdministrator";
import { ActivityParticipationModal, type Activity as QRActivity } from "@/components/Qr/activity-participation-modal";

interface EventDetailModalProps {
  eventId: number | null;
  eventInfo: EventManager.EventInfoReturn | null;
  isOpen: boolean;
  onClose: () => void;
}

// Activity Card Component
function ActivityCard({
  eventId,
  activityName,
  userRole,
  isSubscribed,
}: {
  eventId: bigint;
  activityName: string;
  userRole?: string;
  isSubscribed?: boolean;
}) {
  const { toast } = useToast();
  const { userAddress, authenticated } = useAuth();
  const [isParticipating, setIsParticipating] = useState(false);
  const [support, setSupport] = useState<boolean>(true);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Hook for participation
  const { participateInActivity } =
    TokenAdministrator.useParticipateInActivity();

  const activityInfo = EventManager.useGetActivityInfo(
    eventId,
    activityName
  );

  if (!activityInfo.data) return null;

  const activity = activityInfo.data as EventManager.ActivityInfoReturn;
  const [
    isActive,
    activityType,
    pointsReward,
    pointsCost,
    maxParticipants,
    currentParticipants,
    proposalId,
  ] = activity;

  const activityTypeNames = ["Redeem", "Earn", "Vote"];
  const isFull = Number(currentParticipants) >= Number(maxParticipants);
  const isVoteActivity = Number(activityType) === 2;

  // Build QR activity object for modal display
  const qrActivity: QRActivity = {
    id: Number(eventId),
    name: activityName,
    description: "Scan the QR to confirm participation",
    rewardPoints: Number(pointsReward),
    type:
      Number(activityType) === 1
        ? "participation"
        : Number(activityType) === 0
        ? "achievement"
        : "participation",
    eventId: Number(eventId),
    eventName: undefined,
  };

  const handleParticipate = async () => {
    if (!authenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to participate",
        variant: "destructive",
      });
      return;
    }

    setIsParticipating(true);
    try {
      // Notificación de inicio de transacción
      toast({
        title: "Participating in Activity",
        description: "Transaction submitted. Please wait for confirmation...",
      });

      // Usar el formato correcto de parámetros: eventId (bigint), activityName (string), support (boolean)
      const hash = await participateInActivity(
        eventId,
        activityName,
        isVoteActivity ? support : true
      );

      console.log("Participation transaction:", hash);

      // Notificación de éxito con más detalles
      const activityTypeNames = ["Redeem", "Earn", "Vote"];
      const activityType = Number((activityInfo.data as EventManager.ActivityInfoReturn)[1]);
      const pointsReward = String((activityInfo.data as EventManager.ActivityInfoReturn)[2]);
      const pointsCost = String((activityInfo.data as EventManager.ActivityInfoReturn)[3]);

      let successMessage = "You've successfully participated in this activity!";
      
      if (activityType === 1) { // Earn
        successMessage = `Congratulations! You earned ${pointsReward} UPT tokens! 🎉`;
      } else if (activityType === 0) { // Redeem
        successMessage = `Successfully redeemed! ${pointsCost} UPT tokens were spent.`;
      } else if (activityType === 2) { // Vote
        successMessage = `Your vote has been recorded! ${support ? 'Supporting' : 'Against'} the proposal.${Number(pointsReward) > 0 ? ` You earned ${pointsReward} UPT tokens for voting!` : ''}`;
      }

      toast({
        title: "Participation Successful! 🎉",
        description: successMessage,
      });

      // Refetch activity info to update participant count
      await activityInfo.refetch?.();
    } catch (error: any) {
      console.error("Participation error:", error);
      
      // Notificación de error más detallada
      toast({
        title: "Participation Failed",
        description: error.message?.includes("User rejected") 
          ? "Transaction was cancelled by user"
          : error.message || "Failed to participate in activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsParticipating(false);
    }
  };

  if (activityInfo.isLoading) {
    return (
      <Card className="glass-surface border-primary/20">
        <CardContent className="p-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-surface border-primary/20 hover:border-primary/40 transition-all">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">{activityName}</CardTitle>
            <CardDescription>
              Activity Type: {activityTypeNames[Number(activityType)] || "Unknown"}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge 
              variant="outline" 
              className={`
                ${Number(activityType) === 0 ? 'text-red-500 border-red-500' : ''}
                ${Number(activityType) === 1 ? 'text-green-500 border-green-500' : ''}
                ${Number(activityType) === 2 ? 'text-blue-500 border-blue-500' : ''}
              `}
            >
              {activityTypeNames[Number(activityType)] || "Unknown"}
            </Badge>
            
            {/* EARN: Muestra Reward Points */}
            {Number(activityType) === 1 && (
              <div className="flex items-center gap-1 text-green-500">
                <Trophy className="h-4 w-4" />
                <span className="font-bold">Reward: {String(pointsReward)} UPT</span>
              </div>
            )}
            
            {/* REDEEM: Muestra Cost Points */}
            {Number(activityType) === 0 && (
              <div className="flex items-center gap-1 text-red-500">
                <span className="font-bold">Cost: {String(pointsCost)} UPT</span>
              </div>
            )}
            
            {/* VOTE: Muestra parámetros DAO */}
            {Number(activityType) === 2 && (
              <div className="flex flex-col gap-1 items-end">
                <div className="flex items-center gap-1 text-blue-500">
                  <span className="text-sm">Proposal ID: {String(proposalId)}</span>
                </div>
                {Number(pointsReward) > 0 && (
                  <div className="flex items-center gap-1 text-green-500">
                    <Trophy className="h-4 w-4" />
                    <span className="font-bold">Reward: {String(pointsReward)} UPT</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {String(currentParticipants)} / {String(maxParticipants)}{" "}
              participants
            </span>
          </div>

          {isActive && !isFull ? (
            userRole === "user" && !isSubscribed ? (
              <Button
                size="sm"
                disabled
                variant="outline"
              >
                <Lock className="mr-2 h-4 w-4" />
                Subscribe to Participate
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row flex-wrap items-start gap-3 w-full">
                {isVoteActivity && (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <label className="text-sm font-medium">Vote:</label>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
                      <Button
                        size="sm"
                        variant={support ? "default" : "outline"}
                        onClick={() => setSupport(true)}
                        className="px-3 h-10 w-full sm:w-auto sm:flex-1"
                      >
                        Support
                      </Button>
                      <Button
                        size="sm"
                        variant={!support ? "destructive" : "outline"}
                        onClick={() => setSupport(false)}
                        className="px-3 h-10 w-full sm:w-auto sm:flex-1"
                      >
                        Against
                      </Button>
                    </div>
                  </div>
                )}
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setIsQrOpen(true)}
                  disabled={isParticipating}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  {isVoteActivity ? 'Open QR to Vote' : 'Open QR to Participate'}
                </Button>
              </div>
            )
          ) : isFull ? (
            <Badge variant="secondary">Full</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
        {/* QR Participation Modal */}
        <ActivityParticipationModal
          open={isQrOpen}
          onOpenChange={setIsQrOpen}
          activity={qrActivity}
          onParticipate={async () => {
            await handleParticipate();
          }}
        />
      </CardContent>
    </Card>
  );
}

export function EventDetailModal({ eventId, eventInfo, isOpen, onClose }: EventDetailModalProps) {
  const { userRole, authenticated, ready, isLoading, userAddress } = useAuth();

  // Get event activities separately
  const eventActivities = EventManager.useGetEventActivities(
    eventId ? BigInt(eventId) : BigInt(0)
  );

  // Hook para verificar suscripción (solo para usuarios regulares)
  const subscription = useUserSubscription(eventId ? BigInt(eventId) : BigInt(0));

  if (!eventId || !eventInfo) return null;

  const event = eventInfo;
  const [
    eventIdData,
    companyAddress,
    name,
    description,
    sectorId,
    startDate,
    endDate,
    isActive,
  ] = event;

  const startDateObj = new Date(Number(startDate) * 1000);
  const endDateObj = new Date(Number(endDate) * 1000);
  const now = new Date();
  const isUpcoming = startDateObj > now;
  const isOngoing = startDateObj <= now && endDateObj >= now;
  const isEnded = endDateObj < now;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <DialogTitle className="text-3xl mb-2">
                {String(name)}
              </DialogTitle>
              <DialogDescription className="text-lg">
                {String(description)}
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={
                  isActive
                    ? "bg-green-500/20 text-green-600 border-green-500/30"
                    : "bg-gray-500/20 text-gray-600"
                }
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
              {isUpcoming && (
                <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                  Upcoming
                </Badge>
              )}
              {isOngoing && (
                <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                  Ongoing
                </Badge>
              )}
              {isEnded && (
                <Badge className="bg-gray-500/20 text-gray-600 border-gray-500/30">
                  Ended
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info Grid */}
          <Card className="glass-surface border-primary/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">Start Date</p>
                    <p className="text-muted-foreground">
                      {startDateObj.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">End Date</p>
                    <p className="text-muted-foreground">
                      {endDateObj.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <Building2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">Company</p>
                    <p className="text-muted-foreground font-mono text-sm break-all">
                      {String(companyAddress)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Trophy className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">Activities</p>
                    <p className="text-muted-foreground">
                      {eventActivities.data?.length || 0} available
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Event Activities</h3>

            {eventActivities.isLoading ? (
              <Card className="glass-surface border-primary/20">
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">
                    Loading activities...
                  </p>
                </CardContent>
              </Card>
            ) : !eventActivities.data || eventActivities.data?.length === 0 ? (
              <Card className="glass-surface border-primary/20">
                <CardContent className="p-12 text-center">
                  <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2">
                    No activities yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The company will add activities soon
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {eventActivities.data.map((activityName: string, index: number) => (
                  <ActivityCard
                    key={index}
                    eventId={BigInt(eventId)}
                    activityName={activityName}
                    userRole={userRole ?? undefined}
                    isSubscribed={subscription.isSubscribed}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}