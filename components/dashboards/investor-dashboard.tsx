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
import { ethers } from "ethers"
import { myLoanContract } from "@/contractsAbi/LoanContractABI"
import { 
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi'

export default function InvestorDashboard() {
  // Investment functionality
  const [error, setError] = useState("")
  const [investAmount, setInvestAmount] = useState("")
  const [txProgress, setTxProgress] = useState(0)
  
  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })
    
  // Get loan data from contract
  const { data: borrowerData } = useReadContract({
    address:LoanContractAddress,
    abi: LoanContractABI,
    functionName: 'borrower',
  })
  
  const { data: amountBorrowedData } = useReadContract({
    address:LoanContractAddress,
    abi: LoanContractABI,
    functionName: 'amountBorrowed',
  })
  
  const { data: repaymentAmountData } = useReadContract({
    address:LoanContractAddress,
    abi: LoanContractABI,
    functionName: 'repaymentAmount',
  })
  
  const { data: balanceData } = useReadContract({
    address:LoanContractAddress,
    abi: LoanContractABI,
    functionName: 'getBalance',
  })
  
  // Format loan details
  const loanDetails = {
    borrower: borrowerData ? String(borrowerData) : "",
    amountBorrowed: amountBorrowedData ? ethers.formatEther(amountBorrowedData.toString()) : "0",
    repaymentAmount: repaymentAmountData ? ethers.formatEther(repaymentAmountData.toString()) : "0",
    balance: balanceData ? ethers.formatEther(balanceData.toString()) : "0"
  }
  
  // Invest in loan
  const investInLoan = () => {
    if (!investAmount) {
      setError("Please enter an amount to invest")
      return
    }

    try {
      setError("")
      writeContract({
        address:LoanContractAddress,
        abi: LoanContractABI,
        functionName: 'investLoan',
        value: ethers.parseUnits(investAmount, 18)
      })
      
      if (isConfirmed) {
        setInvestAmount("")
      }
    } catch (err: any) {
      setError(err.message || "Failed to invest in loan")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Portfolio Value" value="$16,200" description="+9.5% from last month" />
        <StatCard title="Current Yield" value="4.9%" description="+0.2% from last month" />
        <StatCard title="Total Assets" value="12" description="+2 from last month" />
      </div>

      {/* Investment Component */}
      <Card>
        <CardHeader>
          <CardTitle>Invest in EV Loans</CardTitle>
          <CardDescription>Invest directly in tokenized EV loans</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {isConfirmed && (
            <Alert className="mb-4 bg-[#f68b27]/10 border border-[#f68b27]/30">
              <Check className="h-4 w-4 text-[#f68b27]" />
              <AlertTitle className="text-[#f68b27]">Success</AlertTitle>
              <AlertDescription className="text-[#f68b27]">Investment completed successfully!</AlertDescription>
            </Alert>
          )}

          {isPending && (
            <div className="mb-4">
              <p className="text-sm mb-2 text-[#4f1964]">Processing investment...</p>
              <Progress value={txProgress} className="h-2 bg-[#fbdc3e]/20" />
            </div>
          )}
          
          {hash && (
            <Alert className="mt-4 bg-[#fbdc3e]/10 border border-[#fbdc3e]/30">
              <AlertDescription>
                <div className="text-sm font-medium text-[#4f1964]">Transaction Hash:</div>
                <div className="text-xs break-all text-[#4f1964]/80">{hash}</div>
              </AlertDescription>
            </Alert>
          )}
          
          {isConfirming && (
            <Alert className="mt-4 bg-[#fbdc3e]/20 border border-[#fbdc3e]/40">
              <AlertDescription className="text-[#4f1964] font-medium">
                Waiting for confirmation...
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
              <h3 className="text-lg font-semibold mb-2 text-[#4f1964]">Loan Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="mb-2 text-[#4f1964]">
                    <strong>Borrower:</strong> {loanDetails.borrower ? `${loanDetails.borrower.slice(0, 6)}...${loanDetails.borrower.slice(-4)}` : 'Loading...'}
                  </div>
                  <div className="mb-2 text-[#4f1964]">
                    <strong>Amount Borrowed:</strong> {loanDetails.amountBorrowed} ETH
                  </div>
                  <div className="mb-2 text-[#4f1964]">
                    <strong>Repayment Amount:</strong> {loanDetails.repaymentAmount} ETH
                  </div>
                  <div className="mb-2 text-[#4f1964]">
                    <strong>Current Balance:</strong> {loanDetails.balance} ETH
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
              <div className="space-y-2">
                <Label htmlFor="invest-amount" className="text-[#4f1964] font-medium">Amount to Invest (ETH)</Label>
                <Input
                  id="invest-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.0"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
                />
              </div>
              <Button 
                onClick={investInLoan} 
                disabled={isPending || isConfirming || !investAmount || !isConnected}
                className="bg-[#4f1964] hover:bg-[#3b1149] text-[#fbdc3e] font-medium border border-[#fbdc3e]/20"
              >
                {isPending || isConfirming ? 'Processing...' : 'Invest in Loan'}
              </Button>
              {!isConnected && (
                <Alert className="mt-2">
                  <AlertDescription>Please connect your wallet to invest</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
