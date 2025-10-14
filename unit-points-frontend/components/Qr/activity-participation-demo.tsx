"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ActivityParticipationModal,
  type Activity,
} from "./activity-participation-modal";

export default function ActivityParticipationDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  const demoActivity: Activity = {
    id: 999,
    name: "Demo QR Participation",
    description: "Simulated QR participation for demo purposes",
    rewardPoints: 10,
    type: "participation",
    eventId: 1234,
    eventName: "Demo Event",
  };

  const openDemo = () => {
    setSelectedActivity(demoActivity);
    setIsModalOpen(true);
  };

  const handleParticipate = async (activityId: number) => {
    // Demo only: simulate participation success
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Demo: Participate with QR</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This is a hardcoded demo of the ActivityParticipationModal. Click the
          button below to open it.
        </p>
        <Button onClick={openDemo}>Open QR Participation Demo</Button>
      </div>

      <ActivityParticipationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        activity={selectedActivity}
        onParticipate={handleParticipate}
      />
    </div>
    );
}
