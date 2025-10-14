"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { GAMIFICATION } from "@/lib/constants"
import { Trophy, Zap } from "lucide-react"
import { useState, useEffect } from "react"

export function XPProgressCard() {
  const [currentXP] = useState(750) // Mock data - would come from backend
  const [animatedXP, setAnimatedXP] = useState(0)

  // Find current level
  const currentLevel = GAMIFICATION.LEVELS.reduce((level, l) => {
    return currentXP >= l.minXP ? l : level
  }, GAMIFICATION.LEVELS[0])

  const nextLevel = GAMIFICATION.LEVELS.find((l) => l.level === currentLevel.level + 1)
  const xpInCurrentLevel = currentXP - currentLevel.minXP
  const xpNeededForNext = nextLevel ? nextLevel.minXP - currentLevel.minXP : 0
  const progressPercentage = nextLevel ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100

  // Animate XP counter
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = currentXP / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= currentXP) {
        setAnimatedXP(currentXP)
        clearInterval(timer)
      } else {
        setAnimatedXP(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [currentXP])

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-3xl animate-pulse-glow">
              {currentLevel.badge}
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl">{currentLevel.name}</h3>
              <p className="text-sm text-muted-foreground">Level {currentLevel.level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-3xl text-accent">{animatedXP} XP</p>
            <p className="text-sm text-muted-foreground">
              {nextLevel ? `${xpNeededForNext - xpInCurrentLevel} to next level` : "Max level!"}
            </p>
          </div>
        </div>

        {nextLevel && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to {nextLevel.name}</span>
              <span className="font-medium">{Math.floor(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Rank</p>
              <p className="font-bold">#42</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="font-bold">7 days</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
