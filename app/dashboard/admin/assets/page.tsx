"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"

interface Loan {
  id: string
  name: string
  image: string
  operator: string
  borrower: string
  adminAddress: string
  amount: number
  repaymentAmount: number
  duration: number
  monthlyInterest?: number
  createdAt: string
  status: string
  transactionHash?: string
}

export default function AdminLoansPage() {
  const router = useRouter()
  const [loans, setLoans] = useState<Loan[]>([])
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load loans from localStorage or use default ones
    const loadLoans = () => {
      setLoading(true)
      try {
        const storedLoans = localStorage.getItem("adminLoans")
        let loanList: Loan[] = storedLoans ? JSON.parse(storedLoans) : defaultLoans

        setLoans(loanList)
        setFilteredLoans(loanList)
      } catch (error) {
        console.error("Error loading loans:", error)
        setLoans(defaultLoans)
        setFilteredLoans(defaultLoans)
      } finally {
        setLoading(false)
      }
    }

    loadLoans()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLoans(loans)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = loans.filter(
        (loan) =>
          loan.name.toLowerCase().includes(query) ||
          loan.operator.toLowerCase().includes(query) ||
          loan.id.toLowerCase().includes(query)
      )
      setFilteredLoans(filtered)
    }
  }, [searchQuery, loans])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCreateNew = () => {
    router.push("/dashboard/admin/create-loan")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f1964]"></div>
      </div>
    )
  }

  const totalRepayment = loans.reduce((sum, loan) => sum + loan.repaymentAmount, 0)
  const totalLent = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const avgInterestRate = totalLent > 0 ? ((totalRepayment / totalLent - 1) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">EV Loans</h1>
          <p className="text-muted-foreground">Manage tokenized EV loans on the platform</p>
        </div>
        <Button className="bg-[#4f1964] hover:bg-[#4f1964]/90" onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Loan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.length}</div>
            <p className="text-xs text-muted-foreground">
              {loans.filter((a) => a.status === "Active").length} active loans
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All tokenized EV loans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRepayment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total repayment amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Interest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgInterestRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all active loans</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input placeholder="Search loans..." className="pl-10" value={searchQuery} onChange={handleSearchChange} />
      </div>

      {filteredLoans.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No loans found</h3>
          <p className="text-gray-500 mt-2">
            {loans.length === 0
              ? "You don't have any loans yet. Create a new loan to get started."
              : "No loans match your search criteria. Try a different search term."}
          </p>
          {loans.length === 0 && (
            <Button onClick={handleCreateNew} className="mt-4 bg-[#4f1964] hover:bg-[#4f1964]/90">
              <Plus className="mr-2 h-4 w-4" />
              Create New Loan
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLoans.map((loan, index) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={loan.image || "/placeholder.svg?height=200&width=300"}
                    alt={loan.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-[#4f1964]">EV Loan</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{loan.name}</CardTitle>
                  <CardDescription>Operator: {loan.operator}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Loan Amount</p>
                        <p className="text-xl font-bold">${loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Repayment</p>
                        <p className="text-xl font-bold">${loan.repaymentAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Interest Rate</p>
                        <p className="text-xl font-bold">{loan.monthlyInterest ? `${loan.monthlyInterest}%` : `${(((loan.repaymentAmount / loan.amount) - 1) * 100).toFixed(2)}%`} monthly</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Duration</p>
                        <p className="text-xl font-bold">{loan.duration} months</p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge
                        className={
                          loan.status === "Active"
                            ? "bg-green-500"
                            : loan.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }
                      >
                        {loan.status}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Additional Details</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-500">Operator</p>
                          <p className="font-medium">{loan.operator}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Operator Address</p>
                          <p className="font-mono text-xs truncate">
                            {loan.borrower}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Transaction Hash</p>
                          <p className="font-mono text-xs truncate">{loan.transactionHash}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Created</p>
                          <p>{new Date(loan.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Default loans with monthlyInterest included
const defaultLoans: Loan[] = [
  {
    id: "LOAN-001",
    name: "EV Loan - MetroTransit",
    image: "/images/electric-bus.jpeg",
    operator: "MetroTransit",
    borrower: "0x8Ab76F03D2Acf190705EE1FcA0C794931EE2A3B0",
    adminAddress: "0x4a2de44F7c609Af73852CC99a3fCc318A91C83Bd",
    amount: 450000,
    repaymentAmount: 495000,
    monthlyInterest: 0.83,
    duration: 24,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: "Active",
    transactionHash: "0x" + "1".repeat(64),
  },
  {
    id: "LOAN-002",
    name: "EV Loan - EcoDelivery",
    image: "/images/ford-vehicle.jpeg",
    operator: "EcoDelivery",
    borrower: "0x8Ab76F03D2Acf190705EE1FcA0C794931EE2A3B0",
    adminAddress: "0x4a2de44F7c609Af73852CC99a3fCc318A91C83Bd",
    amount: 85000,
    repaymentAmount: 93500,
    monthlyInterest: 0.55,
    duration: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    status: "Active",
    transactionHash: "0x" + "2".repeat(64),
  },
  {
    id: "LOAN-003",
    name: "EV Loan - GreenCab",
    image: "/images/ford.jpeg",
    operator: "GreenCab",
    borrower: "0x8Ab76F03D2Acf190705EE1FcA0C794931EE2A3B0",
    adminAddress: "0x4a2de44F7c609Af73852CC99a3fCc318A91C83Bd",
    amount: 320000,
    repaymentAmount: 368000,
    monthlyInterest: 0.5,
    duration: 36,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: "Pending",
    transactionHash: "0x" + "3".repeat(64),
  }
]
