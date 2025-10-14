"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Loader2,
  Trophy,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
// Animations removed to avoid dependency on framer-motion. Simple conditional rendering is used instead.

export interface Activity {
  id: number;
  name: string;
  description: string;
  rewardPoints: number;
  type: "attendance" | "participation" | "achievement";
  eventId: number;
  eventName?: string;
}

export interface ActivityParticipationModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal close is requested */
  onOpenChange: (open: boolean) => void;
  /** Activity data to display */
  activity: Activity | null;
  /** Callback when user confirms participation */
  onParticipate: (activityId: number) => Promise<void>;
  /** Optional custom QR code image URL */
  qrCodeUrl?: string;
}

type ParticipationStatus = "idle" | "scanning" | "success" | "error";

/**
 * ActivityParticipationModal
 *
 * A reusable modal component for participating in event activities via QR code.
 * Features animated transitions, simulated QR scanning, and blockchain integration.
 *
 * @example
 * tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
 *
 * const handleParticipate = async (activityId: number) => {
 *   // Call blockchain contract to register participation
 *   await participateInActivity(activityId);
 * };
 *
 * <ActivityParticipationModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   activity={selectedActivity}
 *   onParticipate={handleParticipate}
 * />
 * 
 */
export function ActivityParticipationModal({
  open,
  onOpenChange,
  activity,
  onParticipate,
  qrCodeUrl,
}: ActivityParticipationModalProps) {
  const [status, setStatus] = useState<ParticipationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleParticipateClick = async () => {
    if (!activity) return;

    try {
      setStatus("scanning");
      setErrorMessage("");

      // Simulate QR code scanning delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call the actual participation function
      await onParticipate(activity.id);

      setStatus("success");

      // Auto-close after success
      setTimeout(() => {
        onOpenChange(false);
        // Reset status after modal closes
        setTimeout(() => setStatus("idle"), 300);
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(
        error.message || "Failed to register participation. Please try again."
      );
      console.error("Participation error:", error);

      // Reset to idle after showing error
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  const handleClose = () => {
    if (status !== "scanning") {
      onOpenChange(false);
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 300);
    }
  };

  if (!activity) return null;

  const activityTypeConfig = {
    attendance: {
      color: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      icon: CheckCircle2,
      label: "Attendance",
    },
    participation: {
      color: "bg-purple-500/20 text-purple-600 border-purple-500/30",
      icon: Sparkles,
      label: "Participation",
    },
    achievement: {
      color: "bg-amber-500/20 text-amber-600 border-amber-500/30",
      icon: Trophy,
      label: "Achievement",
    },
  };

  const typeConfig = activityTypeConfig[activity.type];
  const TypeIcon = typeConfig.icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <TypeIcon className="h-6 w-6 text-primary" />
            {activity.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            {activity.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Activity Info */}
          <div className="flex items-center justify-between">
            <Badge className={cn("text-sm", typeConfig.color)}>
              {typeConfig.label}
            </Badge>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="font-semibold text-lg">
                +{activity.rewardPoints} UPT
              </span>
            </div>
          </div>

          {activity.eventName && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Event:</span> {activity.eventName}
            </div>
          )}

          {/* QR Code Section */}
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-6">
                {status === "idle" && (
                  <div className="flex flex-col items-center gap-4">
                    {/* Simulated QR Code */}
                    <div className="relative">
                      <div className="w-48 h-48 bg-white rounded-lg p-4 shadow-lg">
                        {qrCodeUrl ? (
                          <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full grid grid-cols-8 gap-1">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "rounded-sm",
                                  Math.random() > 0.5 ? "bg-black" : "bg-white"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 border-4 border-primary rounded-lg opacity-70" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Scan this QR code or click the button below
                    </p>
                  </div>
                )}

                {status === "scanning" && (
                  <div className="flex flex-col items-center gap-4 py-12">
                    <QrCode className="h-16 w-16 text-primary animate-spin" />
                    <div className="text-center space-y-2">
                      <p className="font-semibold text-lg">
                        Processing Participation...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Registering on blockchain
                      </p>
                    </div>
                  </div>
                )}

                {status === "success" && (
                  <div className="flex flex-col items-center gap-4 py-12">
                    <div className="relative">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-semibold text-lg text-green-600">
                        Participation Successful!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        +{activity.rewardPoints} UPT earned
                      </p>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex flex-col items-center gap-4 py-12">
                    <XCircle className="h-16 w-16 text-destructive" />
                    <div className="text-center space-y-2">
                      <p className="font-semibold text-lg text-destructive">
                        Participation Failed
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={status === "scanning"}
            className="w-full sm:w-auto"
          >
            {status === "success" ? "Close" : "Cancel"}
          </Button>
          {(status === "idle" || status === "error") && (
            <Button
              onClick={handleParticipateClick}
              variant={status === "error" ? "destructive" : "default"}
              className="w-full sm:w-auto gap-2"
            >
              {status === "error" ? (
                "Try Again"
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  Participate Now
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
    );
}
