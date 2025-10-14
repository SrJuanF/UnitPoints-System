"use client"

import { Card } from "@/components/ui/card"
import { Award } from "lucide-react"

const badges = [
  { id: 1, name: "Early Adopter", emoji: "🚀", earned: true, description: "Joined in the first month" },
  { id: 2, name: "Contributor", emoji: "⭐", earned: true, description: "Made 10 contributions" },
  { id: 3, name: "Voter", emoji: "🗳️", earned: true, description: "Voted on 5 proposals" },
  { id: 4, name: "Trader", emoji: "💱", earned: false, description: "Complete 10 swaps" },
  { id: 5, name: "Influencer", emoji: "📢", earned: false, description: "Refer 10 users" },
  { id: 6, name: "Legend", emoji: "👑", earned: false, description: "Reach level 5" },
]

export function BadgesCard() {
  const earnedCount = badges.filter((b) => b.earned).length

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="font-display font-bold text-xl">Badges</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {earnedCount}/{badges.length} earned
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative p-4 rounded-lg border-2 transition-all ${
              badge.earned
                ? "border-primary bg-primary/5 hover:bg-primary/10"
                : "border-border bg-muted/50 opacity-50 hover:opacity-75"
            }`}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl">{badge.emoji}</div>
              <div>
                <p className="font-bold text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
            {badge.earned && (
              <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
