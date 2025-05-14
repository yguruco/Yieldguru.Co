"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import LoanComponent from "@/components/LoanComponent"

export default function TokenizePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tokenize Assets</h1>
          <p className="text-muted-foreground">Manage loans on the platform</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Tokenization</CardTitle>
          <CardDescription>Create loans for platform assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Loan Component</h3>
              <LoanComponent />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
