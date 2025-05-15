"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Check, AlertTriangle } from "lucide-react"
import ViewInvest from "@/app/dashboard/investCard/viewinvest"
import { 
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { LoanContractABI } from "@/contractsAbi/LoanContractABI"

// Sample contract address for demonstration
const LoanContractAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199" as `0x${string}`

export default function InvestorDashboard() {
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Portfolio Value" value="$16,200" description="+9.5% from last month" />
        <StatCard title="Current Yield" value="4.9%" description="+0.2% from last month" />
        <StatCard title="Total Assets" value="12" description="+2 from last month" />
      </div>

      {/* Investment Component using ViewInvest */}
      <ViewInvest />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Investment Opportunities
            <Button style={{ backgroundColor: "#fbdc3e", color: "#4f1964" }} size="sm">
              View All <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <OpportunityCard title="Electric Bus Fleet" yield="5.2%" minInvestment="$1,000" available="$245,000" />
            <OpportunityCard title="Taxi EV Network" yield="4.8%" minInvestment="$500" available="$120,000" />
            <OpportunityCard title="Delivery Vans" yield="5.5%" minInvestment="$2,000" available="$380,000" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  description: string
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface OpportunityCardProps {
  title: string
  yield: string
  minInvestment: string
  available: string
}

function OpportunityCard({ title, yield: yieldValue, minInvestment, available }: OpportunityCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <h3 className="font-medium">{title}</h3>
        <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
          <span>Yield: {yieldValue}</span>
          <span>Min: {minInvestment}</span>
          <span>Available: {available}</span>
        </div>
      </div>
      <Button style={{ backgroundColor: "#fbdc3e", color: "#4f1964" }}>Invest</Button>
    </div>
  )
}
