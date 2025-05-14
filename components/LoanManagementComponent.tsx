"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Check, 
  AlertTriangle, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  CreditCard,
  DollarSign,
  Loader2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Define the loan type
interface LoanData {
  id: string
  name: string
  operator: string
  borrower: string
  adminAddress: string
  amount: number
  repaymentAmount: number
  monthlyInterest: number
  duration: number
  createdAt: string
  status: "Active" | "Repaid" | "Defaulted" | "Processing"
  image?: string | null
  transactionHash: string
  paymentsDue?: number
  nextPaymentDate?: string
  remainingBalance?: number
}

// Dummy loan data
const dummyLoans: Record<string, LoanData> = {
  "LOAN-2023001": {
    id: "LOAN-2023001",
    name: "EV Loan - Urban Transit Co",
    operator: "Urban Transit Co",
    borrower: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    adminAddress: "0x7a95eA21F1A21b14a2E26Da855Ab435D5E1E3C39",
    amount: 25000,
    repaymentAmount: 28750,
    monthlyInterest: 1.25,
    duration: 12,
    createdAt: "2023-09-15T10:30:00Z",
    status: "Active",
    transactionHash: "0x5d4ef723fd6d3d568a190549441282a01c6929a9ecb8f8de8ac4a8d5e21666ad",
    paymentsDue: 8,
    nextPaymentDate: "2024-06-15",
    remainingBalance: 19250
  },
  "LOAN-2023002": {
    id: "LOAN-2023002",
    name: "EV Loan - Green Mobility Inc",
    operator: "Green Mobility Inc",
    borrower: "0x8251d872d2c0e8a13559a02af432a9c9e27e1691",
    adminAddress: "0x7a95eA21F1A21b14a2E26Da855Ab435D5E1E3C39",
    amount: 42000,
    repaymentAmount: 47880,
    monthlyInterest: 1.16,
    duration: 24,
    createdAt: "2023-10-21T14:15:00Z",
    status: "Active",
    transactionHash: "0x82b2a8c9c3f6c9ef43ea7c77c86741e17f2cd12ef6f7c84b23a68ac31e58f7bd",
    paymentsDue: 18,
    nextPaymentDate: "2024-06-21",
    remainingBalance: 35910
  },
  "LOAN-2023003": {
    id: "LOAN-2023003",
    name: "EV Loan - EcoRide Solutions",
    operator: "EcoRide Solutions",
    borrower: "0x6dF76928F025626a64829d86963AFb3C89c6F48E",
    adminAddress: "0x7a95eA21F1A21b14a2E26Da855Ab435D5E1E3C39",
    amount: 18500,
    repaymentAmount: 20350,
    monthlyInterest: 1.0,
    duration: 10,
    createdAt: "2023-11-05T09:20:00Z",
    status: "Repaid",
    transactionHash: "0x3f5dea1121ddce947fbce3ba3a93b53bf364d47c9fab9a6d66a5ce0f3c9cfb09"
  },
  "LOAN-2023004": {
    id: "LOAN-2023004",
    name: "EV Loan - CleanFleet Partners",
    operator: "CleanFleet Partners",
    borrower: "0x9B254ABcBbfA3dAE5FE29E06D1bA2Ee60a27D143",
    adminAddress: "0x7a95eA21F1A21b14a2E26Da855Ab435D5E1E3C39",
    amount: 35000,
    repaymentAmount: 40250,
    monthlyInterest: 1.25,
    duration: 12,
    createdAt: "2023-12-10T16:45:00Z",
    status: "Defaulted",
    transactionHash: "0x7c84dfba3a189e3ad7868d8f6f478c8a86c8742ff12b92d5cf7719fd95776e2d",
    paymentsDue: 12,
    nextPaymentDate: "2024-05-10",
    remainingBalance: 33750
  }
}

export default function LoanManagementComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentLoan, setCurrentLoan] = useState<LoanData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("details")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const { toast } = useToast()
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a loan ID")
      return
    }

    setError("")
    setIsSearching(true)
    
    // Simulate API call with a delay
    setTimeout(() => {
      const foundLoan = dummyLoans[searchQuery.trim()]
      
      if (foundLoan) {
        setCurrentLoan(foundLoan)
        setActiveTab("details")
      } else {
        setError(`No loan found with ID: ${searchQuery}`)
        setCurrentLoan(null)
      }
      
      setIsSearching(false)
    }, 1000)
  }
  
  const handlePayment = async () => {
    if (!currentLoan) return
    
    if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
      setError("Please enter a valid payment amount")
      return
    }
    
    setError("")
    setIsProcessing(true)
    setProcessProgress(0)
    
    try {
      // Simulate payment process with progress
      const totalSteps = 5
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProcessProgress((i / totalSteps) * 100)
      }
      
      // Success
      toast({
        title: "Payment Successful",
        description: `You've successfully made a payment of $${Number(paymentAmount).toLocaleString()}`,
        duration: 5000,
      })
      
      // Update loan status (in a real app this would update via API)
      if (currentLoan.remainingBalance) {
        const newBalance = currentLoan.remainingBalance - Number(paymentAmount)
        setCurrentLoan({
          ...currentLoan,
          remainingBalance: newBalance > 0 ? newBalance : 0,
          status: newBalance <= 0 ? "Repaid" : "Active"
        })
      }
      
      setPaymentAmount("")
    } catch (err) {
      setError("Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Repaid":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Defaulted":
        return "bg-red-100 text-red-800 border-red-200"
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "Repaid":
        return <Check className="h-4 w-4 text-blue-600" />
      case "Defaulted":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Processing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border border-[#4f1964]/20">
        <CardHeader className="bg-[#4f1964]/5">
          <CardTitle className="text-[#4f1964]">Loan Search</CardTitle>
          <CardDescription className="text-[#4f1964]/70">
            Enter a loan ID to find and manage the loan
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                placeholder="Enter loan ID (e.g., LOAN-2023001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              className="bg-[#4f1964] hover:bg-[#3b1149] text-white"
              disabled={isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-4 bg-red-50 border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {currentLoan && (
        <Card className="border border-[#4f1964]/20">
          <CardHeader className="bg-[#4f1964]/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#4f1964]">{currentLoan.name}</CardTitle>
                <CardDescription className="text-[#4f1964]/70">
                  ID: {currentLoan.id}
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(currentLoan.status)} px-3 py-1 flex items-center`}>
                {getStatusIcon(currentLoan.status)}
                <span className="ml-1">{currentLoan.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#4f1964]/10">
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-[#4f1964] data-[state=active]:text-[#fbdc3e] text-[#4f1964]"
                >
                  Loan Details
                </TabsTrigger>
                <TabsTrigger 
                  value="payments" 
                  className="data-[state=active]:bg-[#4f1964] data-[state=active]:text-[#fbdc3e] text-[#4f1964]"
                  disabled={currentLoan.status !== "Active"}
                >
                  Make Payment
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-[#4f1964] data-[state=active]:text-[#fbdc3e] text-[#4f1964]"
                >
                  Payment History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                      <h3 className="text-lg font-semibold mb-3 text-[#4f1964] flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-[#f68b27]" />
                        Loan Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[#4f1964]/70">Loan Amount:</span>
                          <span className="font-medium text-[#4f1964]">${currentLoan.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#4f1964]/70">Total Repayment:</span>
                          <span className="font-medium text-[#4f1964]">${currentLoan.repaymentAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#4f1964]/70">Monthly Interest:</span>
                          <span className="font-medium text-[#4f1964]">{currentLoan.monthlyInterest}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#4f1964]/70">Duration:</span>
                          <span className="font-medium text-[#4f1964]">{currentLoan.duration} months</span>
                        </div>
                        {currentLoan.remainingBalance !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-[#4f1964]/70">Remaining Balance:</span>
                            <span className="font-medium text-[#4f1964]">${currentLoan.remainingBalance.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                      <h3 className="text-lg font-semibold mb-3 text-[#4f1964] flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-[#f68b27]" />
                        Timeline
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[#4f1964]/70">Created Date:</span>
                          <span className="font-medium text-[#4f1964]">
                            {new Date(currentLoan.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {currentLoan.nextPaymentDate && (
                          <div className="flex justify-between">
                            <span className="text-[#4f1964]/70">Next Payment:</span>
                            <span className="font-medium text-[#4f1964]">{currentLoan.nextPaymentDate}</span>
                          </div>
                        )}
                        {currentLoan.paymentsDue !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-[#4f1964]/70">Payments Remaining:</span>
                            <span className="font-medium text-[#4f1964]">{currentLoan.paymentsDue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                      <h3 className="text-lg font-semibold mb-3 text-[#4f1964] flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-[#f68b27]" />
                        Loan Parties
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[#4f1964]/70">Operator:</span>
                          <span className="font-medium text-[#4f1964]">{currentLoan.operator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#4f1964]/70">Borrower Address:</span>
                          <span className="font-medium text-[#4f1964] text-xs">
                            {currentLoan.borrower.substring(0, 6)}...{currentLoan.borrower.substring(currentLoan.borrower.length - 4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#4f1964]/70">Admin Address:</span>
                          <span className="font-medium text-[#4f1964] text-xs">
                            {currentLoan.adminAddress.substring(0, 6)}...{currentLoan.adminAddress.substring(currentLoan.adminAddress.length - 4)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                      <h3 className="text-lg font-semibold mb-3 text-[#4f1964]">Transaction</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[#4f1964]/70">Transaction Hash:</span>
                          <div className="font-mono text-xs mt-1 break-all text-[#4f1964]">
                            {currentLoan.transactionHash}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4 pt-4">
                <div className="p-6 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                  <h3 className="text-lg font-semibold mb-3 text-[#4f1964]">Make a Payment</h3>
                  
                  {currentLoan.status === "Active" && (
                    <div className="space-y-4">
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-blue-700">
                          Your next payment of ${(currentLoan.repaymentAmount / currentLoan.duration).toFixed(2)} 
                          is due on {currentLoan.nextPaymentDate}.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-2">
                        <Label htmlFor="payment-amount" className="text-[#4f1964] font-medium">
                          Payment Amount ($)
                        </Label>
                        <Input
                          id="payment-amount"
                          type="number"
                          step="0.01"
                          placeholder="Enter payment amount"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
                        />
                      </div>
                      
                      {isProcessing ? (
                        <div className="space-y-4">
                          <Progress value={processProgress} className="w-full" />
                          <p className="text-center text-sm text-[#4f1964]/70">
                            Processing payment... ({Math.round(processProgress)}% complete)
                          </p>
                        </div>
                      ) : (
                        <Button 
                          onClick={handlePayment} 
                          className="w-full bg-[#f68b27] hover:bg-[#f68b27]/90 text-white"
                          disabled={!paymentAmount}
                        >
                          Submit Payment
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {currentLoan.status === "Repaid" && (
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Loan Fully Repaid</AlertTitle>
                      <AlertDescription className="text-green-700">
                        This loan has been fully repaid. No further payments are needed.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {currentLoan.status === "Defaulted" && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800">Loan in Default</AlertTitle>
                      <AlertDescription className="text-red-800">
                        This loan is currently in default. Please contact support for assistance.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 pt-4">
                <div className="p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                  <h3 className="text-lg font-semibold mb-3 text-[#4f1964]">Payment History</h3>
                  
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-[#4f1964]/10">
                      <thead>
                        <tr className="bg-[#4f1964]/5">
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#4f1964] uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#4f1964] uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#4f1964] uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#4f1964] uppercase tracking-wider">
                            Transaction ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#4f1964]/10">
                        {/* In a real app, this would be populated from API data */}
                        {currentLoan.status !== "Defaulted" && (
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4f1964]">
                              {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4f1964]">
                              ${(currentLoan.repaymentAmount / currentLoan.duration).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Completed
                              </Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs text-[#4f1964]/70 font-mono">
                              0x83bde4...a721fe
                            </td>
                          </tr>
                        )}
                        
                        {currentLoan.status === "Defaulted" ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-4 text-center text-sm text-[#4f1964]/70">
                              No payment records available for defaulted loans
                            </td>
                          </tr>
                        ) : currentLoan.duration <= 1 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-4 text-center text-sm text-[#4f1964]/70">
                              No previous payment records found
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4f1964]">
                              {new Date(new Date().setMonth(new Date().getMonth() - 2)).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4f1964]">
                              ${(currentLoan.repaymentAmount / currentLoan.duration).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Completed
                              </Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs text-[#4f1964]/70 font-mono">
                              0x71cfd3...b924ae
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 