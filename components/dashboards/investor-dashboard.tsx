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
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Portfolio Value"
          value="$16,200"
          description="+9.5% from last month"
          trend="up"
          trendValue="9.5%"
          className="animate-fade-in-up"
        />
        <StatCard
          title="Current Yield"
          value="4.9%"
          description="+0.2% from last month"
          trend="up"
          trendValue="0.2%"
          className="animate-fade-in-up animation-delay-100"
        />
        <StatCard
          title="Total Assets"
          value="12"
          description="+2 from last month"
          trend="up"
          trendValue="2"
          className="animate-fade-in-up animation-delay-200"
        />
      </div>

      {/* Investment Component using ViewInvest */}
      <div className="animate-fade-in-up animation-delay-300">
        <ViewInvest />
      </div>

      <Card className="animate-fade-in-up animation-delay-400">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Investment Opportunities
            <Button
              className="bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90 transition-all duration-300 hover:shadow-md"
              size="sm"
            >
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

function StatCard({ title, value, description, trend, trendValue, className }: StatCardProps & { trend?: string, trendValue?: string, className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend && trendValue && (
          <div className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-[#fbdc3e]/20 text-[#4f1964]">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            {trendValue}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
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
    <div className="flex items-center justify-between rounded-lg border p-4 hover:shadow-sm transition-all duration-300 hover:border-[#fbdc3e]/30 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#fbdc3e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <div>
        <h3 className="font-medium group-hover:text-[#4f1964] transition-colors">{title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-[#fbdc3e]"></div>
            Yield: <span className="font-medium text-[#4f1964]">{yieldValue}</span>
          </span>
          <span>Min: {minInvestment}</span>
          <span>Available: {available}</span>
        </div>
      </div>
      <Button
        className="bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90 transition-all duration-300 hover:shadow-md"
      >
        Invest
      </Button>
    </div>
  )
}
