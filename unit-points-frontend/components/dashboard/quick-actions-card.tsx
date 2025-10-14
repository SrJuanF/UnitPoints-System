"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Users, Zap } from "lucide-react"
import Link from "next/link"

export function QuickActionsCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="font-display font-bold text-xl">Quick Actions</h3>
      </div>

      <div className="space-y-2">
        <Button asChild className="w-full justify-start gap-2 bg-primary hover:bg-primary/90" size="lg">
          <Link href="/events">
            <Users className="h-5 w-5" />
            Browse Events
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent" size="lg">
          <Link href="/swap">
            <ArrowLeftRight className="h-5 w-5" />
            Swap Tokens
          </Link>
        </Button>
      </div>
    </Card>
  )
}
