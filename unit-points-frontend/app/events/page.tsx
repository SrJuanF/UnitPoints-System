"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, useEvents } from "@/hooks";
import { useUserSubscription } from "@/hooks/";
import { Calendar, Search, Trophy, Loader2, ExternalLink, UserPlus, UserCheck } from "lucide-react";
import Link from "next/link";
import * as EventManager from "@/hooks/contracts-frontend/scripts/eventManager";
import { Skeleton } from "@/components/ui/skeleton";
import { EventDetailModal } from "@/components/events/event-detail-modal";

// Component to display a single event card with blockchain data
function EventCard({
  eventInfo,
  searchQuery = "",
  userRole,
  onOpenModal,
}: {
  eventInfo: EventManager.EventInfoReturn;
  searchQuery?: string;
  userRole?: string;
  onOpenModal?: (eventId: number, eventInfo: EventManager.EventInfoReturn) => void;
}) {
  // Extract event data from the passed eventInfo
  const [
    id,
    companyAddress,
    name,
    description,
    sectorId,
    startDate,
    endDate,
    isActive,
  ] = eventInfo;

  const eventId = Number(id);

  const eventActivities = EventManager.useGetEventActivities(BigInt(eventId));
  
  // Hook para manejar suscripciones (solo para usuarios regulares)
  const subscription = useUserSubscription(BigInt(eventId));
  
  // Since eventInfo is already passed as a complete object, we don't need loading states
  const startDateObj = new Date(Number(startDate) * 1000);
  const endDateObj = new Date(Number(endDate) * 1000);
  const now = new Date();

  // Check date filter (±10 days)
  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  const tenDaysFromNow = new Date(now);
  tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);

  // Calculate visibility conditions
  const passesDateFilter = !(endDateObj < tenDaysAgo || startDateObj > tenDaysFromNow);
  const passesSearchFilter = !searchQuery || String(name).toLowerCase().includes(searchQuery.toLowerCase());
  const shouldShowEvent = passesDateFilter && passesSearchFilter;
  
  // Hide events that don't pass filters - AFTER all hooks have been called
  if (!shouldShowEvent) {
    return null;
  }

  const isUpcoming = startDateObj > now;
  const isOngoing = startDateObj <= now && endDateObj >= now;
  const isEnded = endDateObj < now;

  return (
    <Card className="hover:border-primary/50 transition-all duration-300 group hover-lift glass-surface border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
              {String(name)}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {String(description)}
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {startDateObj.toLocaleDateString()} -{" "}
            {endDateObj.toLocaleDateString()}
          </span>
        </div>

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

        <div className="flex items-center gap-2 text-sm">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-muted-foreground">
            {eventActivities.isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              `${eventActivities.data?.length || 0} Activities`
            )}
          </span>
        </div>

        <div className="text-xs text-muted-foreground font-mono truncate">
          Company: {String(companyAddress).slice(0, 10)}...
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {userRole === "user" && (
          <Button
            onClick={subscription.subscribeToEvent}
            disabled={subscription.isSubscribing || subscription.isSubscribed}
            variant={subscription.isSubscribed ? "secondary" : "default"}
            className="flex-1"
          >
            {subscription.isSubscribing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : subscription.isSubscribed ? (
              <UserCheck className="mr-2 h-4 w-4" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            {subscription.isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        )}
        
       
        
        <Button 
          onClick={() => onOpenModal?.(eventId, eventInfo)}
          className={userRole === "user" ? "flex-1" : "w-full"}
          variant={userRole === "user" ? "outline" : "default"}
        >
          View Details
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const { userRole, authenticated, ready, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventInfo, setSelectedEventInfo] = useState<EventManager.EventInfoReturn | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get events with complete information from useEvents hook
  const { events, isLoadingEvents } = useEvents();

  // Function to handle opening the modal
  const handleOpenModal = (eventId: number, eventInfo: EventManager.EventInfoReturn) => {
    setSelectedEventId(eventId);
    setSelectedEventInfo(eventInfo);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
    setSelectedEventInfo(null);
  };

  // Sort events by priority: ongoing -> upcoming -> ended, then by start date
  const sortedEvents = useMemo(() => {
    if (!events || isLoadingEvents) return [];
    
    return [...events].sort((a, b) => {
      const now = new Date();
      
      // Extract dates for event A
      const startDateA = new Date(Number(a[5]) * 1000); // startDate is index 5
      const endDateA = new Date(Number(a[6]) * 1000);   // endDate is index 6
      
      // Extract dates for event B
      const startDateB = new Date(Number(b[5]) * 1000);
      const endDateB = new Date(Number(b[6]) * 1000);
      
      // Determine status for event A
      const isOngoingA = startDateA <= now && endDateA >= now;
      const isUpcomingA = startDateA > now;
      const isEndedA = endDateA < now;
      
      // Determine status for event B
      const isOngoingB = startDateB <= now && endDateB >= now;
      const isUpcomingB = startDateB > now;
      const isEndedB = endDateB < now;
      
      // Priority order: ongoing (1) -> upcoming (2) -> ended (3)
      const getPriority = (isOngoing: boolean, isUpcoming: boolean, isEnded: boolean) => {
        if (isOngoing) return 1;
        if (isUpcoming) return 2;
        if (isEnded) return 3;
        return 4;
      };
      
      const priorityA = getPriority(isOngoingA, isUpcomingA, isEndedA);
      const priorityB = getPriority(isOngoingB, isUpcomingB, isEndedB);
      
      // First sort by priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort by start date
      // For ongoing and upcoming: earliest first
      // For ended: most recent first
      if (priorityA === 3) { // Both ended
        return endDateB.getTime() - endDateA.getTime(); // Most recently ended first
      } else {
        return startDateA.getTime() - startDateB.getTime(); // Earliest start first
      }
    });
  }, [events, isLoadingEvents]);

  // Redirect companies to dashboard - they should only see their own events
  useEffect(() => {
    if (ready && authenticated && userRole === "company") {
      router.push("/dashboard");
    }
  }, [ready, authenticated, userRole, router]);

  // Don't render anything while redirecting or loading
  if (isLoading || (ready && authenticated && userRole === "company")) {
    return null;
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="container px-4 pt-32 pb-24 mx-auto animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-6 text-glow leading-tight">
              Discover Events
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance leading-relaxed">
              Join exciting blockchain events and earn rewards
            </p>
          </div>

          {/* Search Bar */}
          <div
            className="relative mb-12 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/70 z-10" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-lg glass-surface border-primary/20 focus:border-primary/50 transition-all duration-300"
            />
          </div>

          {/* Event Counter */}
          <div className="mb-8 text-center">
            <p className="text-lg text-muted-foreground">
              {isLoadingEvents ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading events...
                </span>
              ) : (
                <span>
                  {sortedEvents?.length || 0}{" "}
                  {sortedEvents?.length === 1 ? "event" : "events"} available
                </span>
              )}
            </p>
          </div>

          {/* Events Grid */}
          {isLoadingEvents ? (
            <div className="text-center py-16 animate-fade-in">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">
                Loading events from blockchain...
              </p>
            </div>
          ) : sortedEvents && sortedEvents.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in items-start"
              style={{ animationDelay: "0.4s" }}
            >
              {sortedEvents.map((eventInfo, index) => (
                <div
                  key={Number(eventInfo[0])}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <EventCard
                    eventInfo={eventInfo}
                    searchQuery={searchQuery}
                    userRole={userRole || undefined}
                    onOpenModal={handleOpenModal}
                  />
                </div>
              ))}
            </div>
          ) : sortedEvents && sortedEvents.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl text-muted-foreground mb-4">
                No events available yet
              </p>
              {userRole === "company" && (
                <Link href="/dashboard">
                  <Button>Create Your First Event</Button>
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        eventId={selectedEventId}
        eventInfo={selectedEventInfo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}
