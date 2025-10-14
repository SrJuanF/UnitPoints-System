"use client"

import { FlaskConical, AlertCircle } from "lucide-react"

export function TestHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <FlaskConical className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-4xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Test</span> Page
          </h1>
          <p className="text-muted-foreground">Contract interaction testing for LATIN HACK 2025 judges</p>
        </div>
      </div>

      <div className="flex items-start gap-2 p-4 rounded-lg bg-primary/10 border border-primary/20">
        <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-sm text-primary">For Hackathon Judges</p>
          <p className="text-xs text-muted-foreground mt-1">
            This page demonstrates the UnitPoints smart contract functionality on Polkadot Asset Hub testnet (Paseo).
            Connect your MetaMask wallet to test read and write operations.
          </p>
        </div>
      </div>
    </div>
  )
}
