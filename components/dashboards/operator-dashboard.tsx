"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, AlertTriangle } from "lucide-react"
import { ethers } from "ethers"
import ViewInvest from "@/app/dashboard/investCard/viewinvest"
import { 
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'

const utilizationData = [
  { day: "Mon", value: 78 },
  { day: "Tue", value: 82 },
  { day: "Wed", value: 85 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 92 },
  { day: "Sat", value: 68 },
  { day: "Sun", value: 55 },
]

const revenueData = [
  { month: "Jan", actual: 12500, projected: 12000 },
  { month: "Feb", actual: 13200, projected: 12800 },
  { month: "Mar", actual: 13800, projected: 13500 },
  { month: "Apr", actual: 14500, projected: 14000 },
  { month: "May", actual: 15200, projected: 14800 },
  { month: "Jun", actual: 16000, projected: 15500 },
]

export default function OperatorDashboard() {
  const [error, setError] = useState("")
  const [txProgress, setTxProgress] = useState(0)
  const [repayAmount, setRepayAmount] = useState("")
  
  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  // Get loan data from contract
  // const { data: borrowerData } = useReadContract({
  //   address:LoanContractAddress,
  //   abi: LoanContractABI,
  //   functionName: 'borrower',
  // })
  
  // const { data: repaymentAmountData } = useReadContract({
  //   address:LoanContractAddress,
  //   abi: LoanContractABI,
  //   functionName: 'repaymentAmount',
  // })
  
  // const { data: balanceData } = useReadContract({
  //   address:LoanContractAddress,
  //   abi: LoanContractABI,
  //   functionName: 'getBalance',
  // })
  
  // Format loan details
  // const loanDetails = {
  //   borrower: borrowerData ? String(borrowerData) : "",
  //   repaymentAmount: repaymentAmountData ? ethers.formatEther(repaymentAmountData.toString()) : "0",
  //   balance: balanceData ? ethers.formatEther(balanceData.toString()) : "0"
  // }

  // // Check if current user is the borrower
  // const isBorrower = () => {
  //   return address?.toLowerCase() === loanDetails.borrower.toLowerCase()
  // }

  // // Repay loan
  // const repayLoan = () => {
  //   if (!repayAmount) {
  //     setError("Please enter an amount to repay")
  //     return
  //   }

  //   try {
  //     setError("")
  //     writeContract({
  //       address:LoanContractAddress,
  //       abi: LoanContractABI,
  //       functionName: 'repayLoan',
  //       value: ethers.parseUnits(repayAmount, 18)
  //     })
      
  //     if (isConfirmed) {
  //       setRepayAmount("")
  //     }
  //   } catch (err: any) {
  //     setError(err.message || "Failed to repay loan")
  //   }
  // }

  // // Withdraw loan (borrower only)
  // const withdrawLoan = () => {
  //   try {
  //     setError("")
  //     writeContract({
  //       address:LoanContractAddress,
  //       abi: LoanContractABI,
  //       functionName: 'withdrawLoan',
  //     })
  //   } catch (err: any) {
  //     setError(err.message || "Failed to withdraw loan")
  //   }
  // }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Fleet Utilization" value="85%" description="+7% from last month" delay={0} />
        <StatCard title="Active Vehicles" value="42/45" description="93.3% operational" delay={0.1} />
        <StatCard title="Monthly Revenue" value="$16,000" description="+5.3% from projected" delay={0.2} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <Card className="border border-[#4f1964]/20">
          <CardHeader className="bg-[#4f1964]/5">
            <CardTitle>Loan Management</CardTitle>
            <CardDescription>Search and manage your EV loans</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20 mb-4">
              <h3 className="text-lg font-semibold mb-2 text-[#4f1964]">Loan Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-2 text-[#4f1964]">
                  <strong>Active Loans:</strong> 2
                </div>
                <div className="mb-2 text-[#4f1964]">
                  <strong>Total Outstanding:</strong> $58,640
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-[#4f1964] hover:bg-[#3b1149] text-[#fbdc3e] font-medium border border-[#fbdc3e]/20"
              asChild
            >
              <a href="/dashboard/operator/loan-management">
                Go to Loan Management
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Fleet Utilization</CardTitle>
              <CardDescription>Daily utilization percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
                    <Bar dataKey="value" fill="#f68b27" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Performance</CardTitle>
              <CardDescription>Actual vs projected revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#f68b27" strokeWidth={2} />
                    <Line type="monotone" dataKey="projected" stroke="#4f1964" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
            <CardDescription>Current status of your EV fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <VehicleStatusCard
                id="EV-001"
                type="Sedan"
                battery={85}
                status="Active"
                location="Downtown"
                lastMaintenance="2023-04-15"
              />
              <VehicleStatusCard
                id="EV-002"
                type="SUV"
                battery={62}
                status="Active"
                location="Airport"
                lastMaintenance="2023-05-02"
              />
              <VehicleStatusCard
                id="EV-003"
                type="Van"
                battery={28}
                status="Charging"
                location="Depot"
                lastMaintenance="2023-04-28"
              />
              <VehicleStatusCard
                id="EV-004"
                type="Sedan"
                battery={92}
                status="Active"
                location="Suburban"
                lastMaintenance="2023-05-10"
              />
              <VehicleStatusCard
                id="EV-005"
                type="Bus"
                battery={45}
                status="Maintenance"
                location="Service Center"
                lastMaintenance="2023-05-15"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
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

interface VehicleStatusCardProps {
  id: string
  type: string
  battery: number
  status: "Active" | "Charging" | "Maintenance" | "Inactive"
  location: string
  lastMaintenance: string
}

function VehicleStatusCard({ id, type, battery, status, location, lastMaintenance }: VehicleStatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Charging":
        return "bg-blue-500"
      case "Maintenance":
        return "bg-orange-500"
      case "Inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getBatteryColor = () => {
    if (battery > 70) return "bg-green-500"
    if (battery > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{id}</h3>
          <Badge variant="outline">{type}</Badge>
          <Badge className={getStatusColor()}>{status}</Badge>
        </div>
        <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-4">
          <span>Location: {location}</span>
          <span>Last Maintenance: {lastMaintenance}</span>
        </div>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-48">
        <span className="text-sm">{battery}%</span>
        <Progress value={battery} className={getBatteryColor()} />
      </div>
    </div>
  )
}
