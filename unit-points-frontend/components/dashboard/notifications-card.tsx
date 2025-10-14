"use client"

import { Card } from "@/components/ui/card"
import { Bell, Gift, Vote, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const notifications = [
  {
    id: 1,
    type: "reward",
    icon: Gift,
    title: "Reward Received",
    message: "You earned 50 UPT for completing a task",
    time: "2 hours ago",
    color: "text-secondary",
  },
  {
    id: 2,
    type: "vote",
    icon: Vote,
    title: "New Proposal",
    message: "Vote on the new governance proposal",
    time: "5 hours ago",
    color: "text-primary",
  },
  {
    id: 3,
    type: "alert",
    icon: AlertCircle,
    title: "Level Up!",
    message: "Congratulations! You reached level 3",
    time: "1 day ago",
    color: "text-accent",
  },
]

export function NotificationsCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-display font-bold text-xl">Notifications</h3>
        </div>
        <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
          {notifications.length}
        </span>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon
            return (
              <div
                key={notification.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${notification.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}
