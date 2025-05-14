"use client"

import LoanComponent from "@/components/LoanComponent"

export default function LoanRepaymentPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Repayment</h1>
          <p className="text-muted-foreground">Manage and repay your EV loans</p>
        </div>
      </div>
      
      <div className="mt-4">
        <LoanComponent />
      </div>
    </div>
  )
} 