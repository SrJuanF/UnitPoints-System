"use client";

import { useState } from "react";
import { useCompany, useEvents } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Address } from "viem";
import * as UPT from "@/hooks/contracts-frontend/scripts/unitPointsTokens";
import * as EventManager from "@/hooks/contracts-frontend/scripts/eventManager";
import {
  Building2,
  Loader2,
  User,
  Wallet,
  Plus,
  Calendar,
  TrendingUp,
  Search,
  X,
  ExternalLink,
  Trophy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ActivityType,
  ProposalType,
} from "@/hooks/contracts-frontend/scripts/eventManager";
import { EventDetailModal } from "@/components/events/event-detail-modal";

interface CompanyDashboardProps {
  userAddress: string | null;
  email: string | null;
  userId: string | null;
}

// Company Event Card Component (temporal - debería ser movido a su propio archivo)
// Company Event Card Component with Activity Management
function CompanyEventCard({
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
  onOpenModal?: (
    eventId: bigint,
    eventInfo: EventManager.EventInfoReturn
  ) => void;
}) {
  const { toast } = useToast();
  const { addActivity } = useEvents();
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [activityForm, setActivityForm] = useState({
    name: "",
    description: "",
    activityType: "0",
    points: "",
    maxParticipants: "",
    // DAO-specific fields for VOTE activities
    proposalType: "0",
    votingPeriod: "7", // days
    minVotingPower: "1",
    quorumThreshold: "50", // percentage
    approvalThreshold: "50", // percentage
  });

  const eventInfo = EventManager.useGetEventInfo(eventId);
  // Get event activities separately
  const eventActivities = EventManager.useGetEventActivities(BigInt(eventId));

  if (eventInfo.isLoading) {
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

  if (!eventInfo.data) return null;

  const event = eventInfo.data as EventManager.EventInfoReturn;
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

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For VOTE activities, include DAO parameters
      if (activityForm.activityType === "2") {
        await addActivity(
          BigInt(eventId),
          activityForm.name,
          activityForm.description,
          parseInt(activityForm.activityType) as ActivityType,
          BigInt(activityForm.points),
          BigInt(activityForm.maxParticipants),
          parseInt(activityForm.proposalType) as ProposalType,
          BigInt(parseInt(activityForm.votingPeriod) * 24 * 60 * 60), // Convert days to seconds
          BigInt(activityForm.minVotingPower),
          BigInt(activityForm.quorumThreshold),
          BigInt(activityForm.approvalThreshold)
        );
      } else {
        // For non-VOTE activities, use default DAO parameters
        await addActivity(
          BigInt(eventId),
          activityForm.name,
          activityForm.description,
          parseInt(activityForm.activityType) as ActivityType,
          BigInt(activityForm.points),
          BigInt(activityForm.maxParticipants),
          0 as ProposalType, // proposalType: GENERAL
          BigInt(7 * 24 * 60 * 60), // votingPeriod: 7 days in seconds
          BigInt(1), // minVotingPower: 1
          BigInt(50), // quorumThreshold: 50%
          BigInt(50) // approvalThreshold: 50%
        );
      }

      toast({
        title: "Activity Added!",
        description: "The activity has been added to your event.",
      });

      setIsAddActivityOpen(false);
      setActivityForm({
        name: "",
        description: "",
        activityType: "0",
        points: "",
        maxParticipants: "",
        proposalType: "0",
        votingPeriod: "7",
        minVotingPower: "1",
        quorumThreshold: "50",
        approvalThreshold: "50",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add activity",
        variant: "destructive",
      });
    }
  };

  // FILTER 1: Only show events owned by this company
  if (
    userAddress &&
    String(companyAddress).toLowerCase() !== userAddress.toLowerCase()
  ) {
    return null;
  }

  // FILTER 2: Search by name
  if (
    searchQuery &&
    !String(name).toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return null;
  }

  // FILTER 3: Filter by start date range
  if (startDateFilter) {
    const filterStartDate = new Date(startDateFilter);
    if (startDateObj < filterStartDate) {
      return null;
    }
  }

  // FILTER 4: Filter by end date range
  if (endDateFilter) {
    const filterEndDate = new Date(endDateFilter);
    filterEndDate.setHours(23, 59, 59, 999); // End of day
    if (endDateObj > filterEndDate) {
      return null;
    }
  }

  return (
    <Card className="glass-surface border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{String(name)}</CardTitle>
            <CardDescription className="text-base">
              {String(description)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onOpenModal?.(eventId, event)}
              variant="outline"
              size="sm"
            >
              View Public Page
              <ExternalLink className="mr-2 h-4 w-4" />
            </Button>
            <Dialog
              open={isAddActivityOpen}
              onOpenChange={setIsAddActivityOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Activity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Add Activity to Event</DialogTitle>
                  <DialogDescription>
                    Create a new activity for participants to earn rewards
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-2">
                  <form onSubmit={handleAddActivity} className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="activityName"
                        className="text-sm font-medium"
                      >
                        Activity Name
                      </Label>
                      <Input
                        id="activityName"
                        value={activityForm.name}
                        onChange={(e) =>
                          setActivityForm({
                            ...activityForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Attend Opening Ceremony"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="activityDescription"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="activityDescription"
                        value={activityForm.description}
                        onChange={(e) =>
                          setActivityForm({
                            ...activityForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe what participants need to do..."
                        required
                        rows={4}
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="activityType"
                        className="text-sm font-medium"
                      >
                        Activity Type
                      </Label>
                      <Select
                        value={activityForm.activityType}
                        onValueChange={(value) =>
                          setActivityForm({
                            ...activityForm,
                            activityType: value,
                          })
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">
                            REDEEM - Redeem rewards
                          </SelectItem>
                          <SelectItem value="1">EARN - Earn points</SelectItem>
                          <SelectItem value="2">VOTE - DAO Voting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* DAO-specific fields for VOTE activities */}
                    {activityForm.activityType === "2" && (
                      <div className="space-y-5 p-5 border rounded-lg bg-muted/50">
                        <h4 className="font-medium text-base">
                          DAO Voting Configuration
                        </h4>

                        <div className="space-y-3">
                          <Label
                            htmlFor="proposalType"
                            className="text-sm font-medium"
                          >
                            Proposal Type
                          </Label>
                          <Select
                            value={activityForm.proposalType}
                            onValueChange={(value) =>
                              setActivityForm({
                                ...activityForm,
                                proposalType: value,
                              })
                            }
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select proposal type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">
                                GENERAL - General proposal
                              </SelectItem>
                              <SelectItem value="1">
                                SECTOR - Sector-specific
                              </SelectItem>
                              <SelectItem value="2">
                                TOKEN_MINT - Token minting
                              </SelectItem>
                              <SelectItem value="3">
                                PARAMETER - Parameter change
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <Label
                              htmlFor="votingPeriod"
                              className="text-sm font-medium"
                            >
                              Voting Period (days)
                            </Label>
                            <Input
                              id="votingPeriod"
                              type="number"
                              value={activityForm.votingPeriod}
                              onChange={(e) =>
                                setActivityForm({
                                  ...activityForm,
                                  votingPeriod: e.target.value,
                                })
                              }
                              placeholder="7"
                              required
                              min="1"
                              max="30"
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label
                              htmlFor="minVotingPower"
                              className="text-sm font-medium"
                            >
                              Min Voting Power
                            </Label>
                            <Input
                              id="minVotingPower"
                              type="number"
                              value={activityForm.minVotingPower}
                              onChange={(e) =>
                                setActivityForm({
                                  ...activityForm,
                                  minVotingPower: e.target.value,
                                })
                              }
                              placeholder="1"
                              required
                              min="1"
                              className="h-11"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <Label
                              htmlFor="quorumThreshold"
                              className="text-sm font-medium"
                            >
                              Quorum Threshold (%)
                            </Label>
                            <Input
                              id="quorumThreshold"
                              type="number"
                              value={activityForm.quorumThreshold}
                              onChange={(e) =>
                                setActivityForm({
                                  ...activityForm,
                                  quorumThreshold: e.target.value,
                                })
                              }
                              placeholder="50"
                              required
                              min="1"
                              max="100"
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label
                              htmlFor="approvalThreshold"
                              className="text-sm font-medium"
                            >
                              Approval Threshold (%)
                            </Label>
                            <Input
                              id="approvalThreshold"
                              type="number"
                              value={activityForm.approvalThreshold}
                              onChange={(e) =>
                                setActivityForm({
                                  ...activityForm,
                                  approvalThreshold: e.target.value,
                                })
                              }
                              placeholder="50"
                              required
                              min="1"
                              max="100"
                              className="h-11"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <Label htmlFor="points" className="text-sm font-medium">
                          Points Quantity
                        </Label>
                        <Input
                          id="points"
                          type="number"
                          value={activityForm.points}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              points: e.target.value,
                            })
                          }
                          placeholder="100"
                          required
                          min="1"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="maxParticipants"
                          className="text-sm font-medium"
                        >
                          Max Participants
                        </Label>
                        <Input
                          id="maxParticipants"
                          type="number"
                          value={activityForm.maxParticipants}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              maxParticipants: e.target.value,
                            })
                          }
                          placeholder="50"
                          required
                          min="1"
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button type="submit" className="w-full h-12">
                        Add Activity
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {startDateObj.toLocaleDateString()} -{" "}
              {endDateObj.toLocaleDateString()}
            </span>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

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
      </CardContent>
    </Card>
  );
}

export function CompanyDashboard({
  userAddress,
  email,
  userId,
}: CompanyDashboardProps) {
  const { toast } = useToast();

  // Company data
  const { companyEventIds, isLoadingCompanyEvents, refetchCompanyEvents } =
    useCompany();

  const { createEvent, loading: isCreatingEvent } = useEvents();

  // Create event dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // Event filters state
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [eventStartDateFilter, setEventStartDateFilter] = useState("");
  const [eventEndDateFilter, setEventEndDateFilter] = useState("");

  // Modal state for EventDetailModal
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventInfo, setSelectedEventInfo] =
    useState<EventManager.EventInfoReturn | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // On-chain reads via scripts
  const bal = UPT.balanceOf(userAddress as `0x${string}` | Address);

  // Get company event IDs as array (with proper typing)
  const eventIdsArray: bigint[] = (companyEventIds || []) as bigint[];

  // Function to handle opening the modal
  const handleOpenModal = (
    eventId: bigint,
    eventInfo: EventManager.EventInfoReturn
  ) => {
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Mostrar notificación de inicio de transacción
      toast({
        title: "Creating Event",
        description: "Transaction submitted. Please wait for confirmation...",
      });

      await createEvent(
        eventForm.name,
        eventForm.description,
        1, // Sector ID always 1
        new Date(eventForm.startDate),
        new Date(eventForm.endDate)
      );

      // Notificación de éxito con más detalles
      toast({
        title: "Event Created Successfully! 🎉",
        description: `"${eventForm.name}" has been created and is now live on the blockchain.`,
      });

      // Refetch company events to update the list
      await refetchCompanyEvents();

      setIsCreateDialogOpen(false);
      setEventForm({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    } catch (error: any) {
      // Notificación de error más detallada
      toast({
        title: "Transaction Failed",
        description: error.message?.includes("User rejected")
          ? "Transaction was cancelled by user"
          : error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* User Info Card */}
      <Card className="mb-8 border-primary/20 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* User Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuario</p>
                <p className="font-semibold">{email || "Company User"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {email || "No email"}
                </p>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wallet</p>
                <p className="font-mono text-sm font-semibold">
                  {userAddress
                    ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
                    : "Not connected"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Balance: {bal.data ? (Number(bal.data) / 1e18).toFixed(6).replace(/\.?0+$/, '') : 0} UPT
                </p>
              </div>
            </div>

            {/* Company Role Badge */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rol</p>
                <p className="font-semibold text-green-600">Company</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Verified on blockchain
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Event Button */}
      <Card className="glass-surface border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Create New Event</span>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Set up a new event for participants to join
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="eventName" className="text-sm font-medium">
                      Event Name
                    </Label>
                    <Input
                      id="eventName"
                      value={eventForm.name}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g., Tech Summit 2024"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="eventDescription"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="eventDescription"
                      value={eventForm.description}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your event..."
                      required
                      rows={4}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={eventForm.startDate}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          startDate: e.target.value,
                        })
                      }
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={eventForm.endDate}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          endDate: e.target.value,
                        })
                      }
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isCreatingEvent}
                      className="w-full h-12"
                    >
                      {isCreatingEvent ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Event"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Organize events and manage activities for participants
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingCompanyEvents ? "..." : eventIdsArray.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingCompanyEvents ? "..." : eventIdsArray.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Company Status
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* My Events List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold">My Events</h2>
        </div>

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
        {(eventSearchQuery || eventStartDateFilter || eventEndDateFilter) && (
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

        {isLoadingCompanyEvents ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </Card>
        ) : eventIdsArray.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">
              No events created yet. Click "Create Event" above to get started!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {eventIdsArray.map((eventId) => (
              <CompanyEventCard
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
        )}
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
