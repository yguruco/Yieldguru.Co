"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Check, AlertTriangle } from "lucide-react"
import { ethers } from "ethers"
import { myLoanContract } from "@/contractsAbi/LoanContractABI"
import { 
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError
} from 'wagmi'

export default function LoanComponent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState("")
  const [txProgress, setTxProgress] = useState(0)
  
  // Form inputs
  const [investAmount, setInvestAmount] = useState("")
  const [repayAmount, setRepayAmount] = useState("")
  
  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  // Get loan data from contract
  const { data: borrowerData } = useReadContract({
    address: myLoanContract.address,
    abi: myLoanContract.abi,
    functionName: 'borrower',
  })
  
  const { data: amountBorrowedData } = useReadContract({
    address: myLoanContract.address,
    abi: myLoanContract.abi,
    functionName: 'amountBorrowed',
  })
  
  const { data: repaymentAmountData } = useReadContract({
    address: myLoanContract.address,
    abi: myLoanContract.abi,
    functionName: 'repaymentAmount',
  })
  
  const { data: balanceData } = useReadContract({
    address: myLoanContract.address,
    abi: myLoanContract.abi,
    functionName: 'getBalance',
  })
  
  const { data: investorsData } = useReadContract({
    address: myLoanContract.address,
    abi: myLoanContract.abi,
    functionName: 'getInvestors',
  })
  
  // Format loan details
  const loanDetails = {
    borrower: borrowerData ? String(borrowerData) : "",
    amountBorrowed: amountBorrowedData ? ethers.formatEther(amountBorrowedData.toString()) : "0",
    repaymentAmount: repaymentAmountData ? ethers.formatEther(repaymentAmountData.toString()) : "0",
    balance: balanceData ? ethers.formatEther(balanceData.toString()) : "0"
  }
  
  // Format investors data
  const investors = {
    addresses: investorsData ? investorsData[0] as string[] : [],
    investedAmounts: investorsData ? (investorsData[1] as bigint[]).map(amount => 
      ethers.formatEther(amount.toString())) : [],
    repaidAmounts: investorsData ? (investorsData[2] as bigint[]).map(amount => 
      ethers.formatEther(amount.toString())) : []
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
        address: myLoanContract.address,
        abi: myLoanContract.abi,
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

  // Repay loan
  const repayLoan = () => {
    if (!repayAmount) {
      setError("Please enter an amount to repay")
      return
    }

    try {
      setError("")
      writeContract({
        address: myLoanContract.address,
        abi: myLoanContract.abi,
        functionName: 'repayLoan',
        value: ethers.parseUnits(repayAmount, 18)
      })
      
      if (isConfirmed) {
        setRepayAmount("")
      }
    } catch (err: any) {
      setError(err.message || "Failed to repay loan")
    }
  }

  // Withdraw loan (borrower only)
  const withdrawLoan = () => {
    try {
      setError("")
      writeContract({
        address: myLoanContract.address,
        abi: myLoanContract.abi,
        functionName: 'withdrawLoan',
      })
    } catch (err: any) {
      setError(err.message || "Failed to withdraw loan")
    }
  }

  // Check if current user is the borrower
  const isBorrower = () => {
    return address?.toLowerCase() === loanDetails.borrower.toLowerCase()
  }

  return (
    <Card className="w-full border border-[#4f1964]/20">
      <CardHeader className="bg-[#4f1964]/5">
        <CardTitle className="text-[#4f1964]">Loan Management</CardTitle>
        <CardDescription className="text-[#4f1964]/70">Invest, repay, or withdraw funds from the loan contract</CardDescription>
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
            <AlertDescription className="text-[#f68b27]">Transaction completed successfully!</AlertDescription>
          </Alert>
        )}

        {isPending && (
          <div className="mb-4">
            <p className="text-sm mb-2 text-[#4f1964]">Processing transaction...</p>
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

        {!isConnected ? (
          <div className="text-center py-6">
            <p className="mb-4 text-[#4f1964]">Please connect your wallet to interact with the loan contract</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#4f1964]/10">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-[#4f1964] data-[state=active]:text-[#fbdc3e] text-[#4f1964]"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="invest" 
                className="data-[state=active]:bg-[#4f1964] data-[state=active]:text-[#fbdc3e] text-[#4f1964]"
              >
                Invest
              </TabsTrigger>
              <TabsTrigger 
                value="actions" 
                className="data-[state=active]:bg-[#4f1964] data-[state=active]:text-[#fbdc3e] text-[#4f1964]"
              >
                Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                <h3 className="text-lg font-semibold mb-2 text-[#4f1964]">Loan Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2 text-[#4f1964]">
                      <strong>Borrower:</strong> {loanDetails.borrower ? `${loanDetails.borrower.slice(0, 6)}...${loanDetails.borrower.slice(-4)}` : 'Loading...'}
                    </div>
                    <div className="mb-2 text-[#4f1964]">
                      <strong>Amount Borrowed:</strong> {loanDetails.amountBorrowed} ETH
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-[#4f1964]">
                      <strong>Repayment Amount:</strong> {loanDetails.repaymentAmount} ETH
                    </div>
                    <div className="mb-2 text-[#4f1964]">
                      <strong>Current Balance:</strong> {loanDetails.balance} ETH
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                <h3 className="text-lg font-semibold mb-2 text-[#4f1964]">Investors</h3>
                {investors.addresses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#4f1964]/10">
                      <thead>
                        <tr>
                          <th className="px-2 py-3 text-left text-xs font-medium text-[#4f1964] uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-[#4f1964] uppercase tracking-wider">
                            Amount Invested
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-[#4f1964] uppercase tracking-wider">
                            Amount Repaid
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#4f1964]/10">
                        {investors.addresses.map((address, index) => (
                          <tr key={index}>
                            <td className="px-2 py-4 whitespace-nowrap text-sm text-[#4f1964]/80">
                              {address.slice(0, 6)}...{address.slice(-4)}
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap text-sm text-[#4f1964]/80">
                              {investors.investedAmounts[index]} ETH
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap text-sm text-[#4f1964]/80">
                              {investors.repaidAmounts[index]} ETH
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[#4f1964]/70">No investors yet</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="invest" className="space-y-4 pt-4">
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
                  disabled={isPending || isConfirming || !investAmount}
                  className="bg-[#4f1964] hover:bg-[#3b1149] text-[#fbdc3e] font-medium border border-[#fbdc3e]/20"
                >
                  {isPending || isConfirming ? 'Processing...' : 'Invest in Loan'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 pt-4">
              {isBorrower() && (
                <div className="grid gap-4 p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                  <h3 className="text-lg font-semibold mb-2 text-[#4f1964]">Borrower Actions</h3>
                  <Button 
                    onClick={withdrawLoan} 
                    disabled={isPending || isConfirming || loanDetails.balance === "0"}
                    className="bg-[#f68b27] hover:bg-[#e57916] text-white font-medium"
                  >
                    {isPending || isConfirming ? 'Processing...' : 'Withdraw Loan'}
                  </Button>
                </div>
              )}

              <div className="grid gap-4 mt-4 p-4 bg-[#fbdc3e]/5 rounded-md border border-[#fbdc3e]/20">
                <h3 className="text-lg font-semibold mb-2 text-[#4f1964]">Repay Loan</h3>
                <div className="space-y-2">
                  <Label htmlFor="repay-amount" className="text-[#4f1964] font-medium">Amount to Repay (ETH)</Label>
                  <Input
                    id="repay-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.0"
                    value={repayAmount}
                    onChange={(e) => setRepayAmount(e.target.value)}
                    className="border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
                  />
                </div>
                <Button 
                  onClick={repayLoan} 
                  disabled={isPending || isConfirming || !repayAmount}
                  className="bg-[#4f1964] hover:bg-[#3b1149] text-[#fbdc3e] font-medium border border-[#fbdc3e]/20"
                >
                  {isPending || isConfirming ? 'Processing...' : 'Repay Loan'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
