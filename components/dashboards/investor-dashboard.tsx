"use client"

import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Portfolio Value"
            value="$16,200"
            description="+9.5% from last month"
            trend="up"
            trendValue="9.5%"
            icon={<Wallet className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Current Yield"
            value="4.9%"
            description="+0.2% from last month"
            trend="up"
            trendValue="0.2%"
            icon={<Percent className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Total Assets"
            value="12"
            description="+2 from last month"
            trend="up"
            trendValue="2"
            icon={<CreditCard className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Monthly Income"
            value="$780"
            description="+$45 from last month"
            trend="up"
            trendValue="$45"
            icon={<BarChart3 className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
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
  delay: number
}

function StatCard({ title, value, description, delay }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface OpportunityCardProps {
  title: string
  yield: string
  minInvestment: string
  available: string
  index?: number
  accentColor?: string
}

function OpportunityCard({ title, yield: yieldValue, minInvestment, available, index = 0, accentColor = "#fbdc3e" }: OpportunityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <CreditCard className="h-4 w-4" style={{ color: accentColor }} />
            </div>
            <h3 className="font-medium">{title}</h3>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>Yield: {yieldValue}</span>
            <span>Min: {minInvestment}</span>
            <span>Available: {available}</span>
          </div>
        </div>
        <Button
          className="transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: accentColor, color: "#4f1964" }}
        >
          Invest
        </Button>
      </div>
    </motion.div>
  )
}
