"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const leaderboard = [
  { rank: 1, address: "0x1234...5678", xp: 5200, badge: "👑" },
  { rank: 2, address: "0x2345...6789", xp: 4800, badge: "🥈" },
  { rank: 3, address: "0x3456...7890", xp: 4200, badge: "🥉" },
  { rank: 4, address: "0x4567...8901", xp: 3500, badge: "⭐" },
  { rank: 5, address: "0x5678...9012", xp: 3200, badge: "⭐" },
  { rank: 6, address: "0x6789...0123", xp: 2800, badge: "⭐" },
  { rank: 7, address: "0x7890...1234", xp: 2400, badge: "⭐" },
]

export function LeaderboardCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-accent" />
        <h3 className="font-display font-bold text-xl">Leaderboard</h3>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                user.rank <= 3
                  ? "bg-gradient-to-r from-accent/10 to-transparent border border-accent/20"
                  : "bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1
                      ? "bg-accent text-accent-foreground"
                      : user.rank === 2
                        ? "bg-muted-foreground/20"
                        : user.rank === 3
                          ? "bg-secondary/20"
                          : "bg-muted"
                  }`}
                >
                  {user.rank <= 3 ? user.badge : user.rank}
                </div>
                <div>
                  <p className="font-bold text-sm">{user.address}</p>
                  <p className="text-xs text-muted-foreground">{user.xp} XP</p>
                </div>
              </div>
              {user.rank <= 3 && <Medal className="h-5 w-5 text-accent" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
