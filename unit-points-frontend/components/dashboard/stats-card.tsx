"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Activity, Target } from "lucide-react"

const stats = [
  { label: "Contributions", value: "24", icon: Activity, color: "text-primary" },
  { label: "Votes Cast", value: "12", icon: Target, color: "text-secondary" },
  { label: "Referrals", value: "5", icon: Users, color: "text-accent" },
  { label: "Growth", value: "+15%", icon: TrendingUp, color: "text-primary" },
]

export function StatsCard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-display font-bold text-xl">{stat.value}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
