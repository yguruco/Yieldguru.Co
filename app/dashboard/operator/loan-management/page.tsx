"use client"

import ViewInvest from "@/app/dashboard/investCard/viewinvest"

export default function LoanManagementPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Management</h1>
          <p className="text-muted-foreground">Manage and repay your EV loans</p>
        </div>
      </div>
      
      <div className="mt-4">
        <ViewInvest />
      </div>
    </div>
  )
} 