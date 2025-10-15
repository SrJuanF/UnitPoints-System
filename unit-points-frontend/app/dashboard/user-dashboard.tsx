"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserSubscribedEvents } from "@/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address } from "viem";
import { CONTRACT_ADDRESSES } from "@/hooks/contracts-frontend/addresses";
import * as UPT from "@/hooks/contracts-frontend/scripts/unitPointsTokens";
import * as EventManager from "@/hooks/contracts-frontend/scripts/eventManager";
import {
  Calendar,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EventDetailModal } from "@/components/events/event-detail-modal";

interface UserDashboardProps {
  userAddress: string | null;
  email: string | null;
  userId: string | null;
}

// Subscribed Event Card Component
function SubscribedEventCard({
  eventId,
  searchQuery = "",
  startDateFilter = "",
  endDateFilter = "",
  userAddress,
  onOpenModal,
}: {
  eventId: bigint;
  searchQuery?: string;
  startDateFilter?: string;
  endDateFilter?: string;
  userAddress?: string;
  onOpenModal?: (eventId: bigint, eventInfo: EventManager.EventInfoReturn) => void;
}) {
  const { data: eventInfo, isLoading } = EventManager.useGetEventInfo(eventId);

  if (isLoading) {
    return (
      <Card className="glass-surface border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!eventInfo) return null;

  const event = eventInfo as EventManager.EventInfoReturn;
  const [
    id,
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

  // FILTER 1: Search by name
  if (
    searchQuery &&
    !String(name).toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return null;
  }

  // FILTER 2: Filter by start date range
  if (startDateFilter) {
    const filterStartDate = new Date(startDateFilter);
    if (startDateObj < filterStartDate) {
      return null;
    }
  }

  // FILTER 3: Filter by end date range
  if (endDateFilter) {
    const filterEndDate = new Date(endDateFilter);
    filterEndDate.setHours(23, 59, 59, 999); // End of day
    if (endDateObj > filterEndDate) {
      return null;
    }
  }

  return (
    <Card className="glass-surface border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{String(name)}</h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {String(description)}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {startDateObj.toLocaleDateString()} - {endDateObj.toLocaleDateString()}
                </span>
              </div>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <Button
            onClick={() => onOpenModal?.(eventId, event)}
            variant="outline"
            size="sm"
          >
            View Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserDashboard({
  userAddress,
  email,
  userId,
}: UserDashboardProps) {
  const router = useRouter();
  
  // Hook para obtener eventos suscritos (solo para usuarios regulares)
  const { subscribedEventIds, isLoading: isLoadingSubscribedEvents } = useUserSubscribedEvents();

  // Event filters state
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [eventStartDateFilter, setEventStartDateFilter] = useState("");
  const [eventEndDateFilter, setEventEndDateFilter] = useState("");

  // Modal state for event details
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventInfo, setSelectedEventInfo] = useState<EventManager.EventInfoReturn | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // On-chain reads via scripts
  const bal = UPT.balanceOf(userAddress as `0x${string}` | Address);

  // Allowance & Approve state
  const [spender] = useState(CONTRACT_ADDRESSES.tokenAdministrator);
  const [approveAmountStr, setApproveAmountStr] = useState<string>("");
  const approveAmount = approveAmountStr ? BigInt(approveAmountStr) : undefined;
  const { approve, isPending: isApprovePending } = UPT.useApprove();
  const [txApprove, setTxApprove] = useState<string | null>(null);

  const allowanceHook = UPT.allowance(userAddress as `0x${string}`, spender)

  // Function to handle opening the modal
  const handleOpenModal = (eventId: bigint, eventInfo: EventManager.EventInfoReturn) => {
    setSelectedEventId(Number(eventId));
    setSelectedEventInfo(eventInfo);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
    setSelectedEventInfo(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Privy Account Info */}
      <Card className="glass-surface border-primary/20">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">User ID</div>
            <div className="font-mono text-xs break-all">
              {userId || "Not available"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="text-sm font-medium">
              {email || "Not provided"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Role</div>
            <div className="text-sm font-medium text-blue-600">User</div>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Status */}
      <Card className="glass-surface border-primary/20">
        <CardHeader>
          <CardTitle>Blockchain Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">
              Wallet Address
            </div>
            <div className="font-mono break-all text-xs">
              {userAddress ? userAddress : "Not connected"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Chain</div>
            <div className="text-sm font-medium">Passet Hub Testnet</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Registration Status
            </div>
            <div className="font-semibold">
              ✓ Registered
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UnitPoints Balance */}
      <Card className="glass-surface border-primary/20">
        <CardHeader>
          <CardTitle>UnitPoints Token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">
              Contract Address
            </div>
            <div className="font-mono break-all text-xs">
              {CONTRACT_ADDRESSES.unitPointsTokens}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Your Balance
            </div>
            <div className="text-3xl font-bold text-primary">
              {bal.isLoading
                ? "Loading..."
                : bal.data
                ? Number(bal.data)
                : "0"}{" "}
              <span className="text-base text-muted-foreground">UPT</span>
            </div>
          </div>

          {/* Allowance & Approve section (copiado de components/test) */}
          <div className="space-y-3 pt-4 border-t">
            <div className="text-sm font-medium">Allowance</div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Spender (Administrator)</div>
                <Input
                  value={spender}
                  placeholder="0x..."
                  readOnly
                  disabled
                />
              </div>
              <div className="flex items-end gap-2">
                
                <Button
                  variant="secondary"
                  disabled={!userAddress}
                  onClick={() => allowanceHook?.refetch?.()}
                >
                  Consultar allowance
                </Button>
                <div className="text-sm flex-1">
                  {allowanceHook?.isLoading
                    ? "Consultando..."
                    : `Allowance: ${allowanceHook?.data ? String(allowanceHook.data) : "0"}`}
                </div>
              </div>
           

            <div className="pt-2">
              <div className="text-sm font-medium mb-2">Approve</div>
              <div className="grid gap-2 md:grid-cols-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={approveAmountStr}
                  onChange={(e) => setApproveAmountStr(e.target.value)}
                />
                <Button
                  onClick={async () => {
                    if (!approveAmount) return;
                    const hash = await approve(spender as Address, approveAmount as bigint);
                    setTxApprove(hash as `0x${string}`);
                  }}
                  disabled={isApprovePending || !approveAmountStr}
                >
                  {isApprovePending ? "Aprobando..." : "Aprobar"}
                </Button>
              </div>
              {txApprove && (
                <div className="text-xs mt-2 font-mono break-words whitespace-normal">Tx: {txApprove}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribed Events Section */}
      <div className="md:col-span-2 lg:col-span-3">
        <Card className="glass-surface border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Subscribed Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Search by name */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by event name..."
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {eventSearchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setEventSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Start Date Filter */}
              <div>
                <Input
                  type="date"
                  placeholder="Start date from..."
                  value={eventStartDateFilter}
                  onChange={(e) => setEventStartDateFilter(e.target.value)}
                />
              </div>

              {/* End Date Filter */}
              <div>
                <Input
                  type="date"
                  placeholder="End date until..."
                  value={eventEndDateFilter}
                  onChange={(e) => setEventEndDateFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {(eventSearchQuery ||
              eventStartDateFilter ||
              eventEndDateFilter) && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEventSearchQuery("");
                    setEventStartDateFilter("");
                    setEventEndDateFilter("");
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}

            {isLoadingSubscribedEvents ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : subscribedEventIds && subscribedEventIds.length > 0 ? (
              <div className="space-y-4">
                {subscribedEventIds.map((eventId) => (
                  <SubscribedEventCard 
                    key={eventId.toString()} 
                    eventId={eventId}
                    searchQuery={eventSearchQuery}
                    startDateFilter={eventStartDateFilter}
                    endDateFilter={eventEndDateFilter}
                    userAddress={userAddress || undefined}
                    onOpenModal={handleOpenModal}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Subscribed Events</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't subscribed to any events yet.
                </p>
                <Button 
                  onClick={() => router.push("/events")}
                  variant="outline"
                >
                  Browse Events
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        eventId={selectedEventId}
        eventInfo={selectedEventInfo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}