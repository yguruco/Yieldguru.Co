"use client"

import { useState, useEffect } from "react"
import { LoanContractABI } from "@/contractsAbi/LoanContractABI"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  CreditCard, 
  Users, 
  ArrowUpRight, 
  Wallet, 
  Info, 
  RefreshCw, 
  AlertCircle, 
  Clock,
  History,
  List
} from "lucide-react"
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi"
import { formatEther, parseEther } from "viem"
import { WalletComponents } from "../reown-appkit/wallet"

interface ContractCardProps {
  contractAddress: string
}

interface Investor {
  investorAddress: string
  amountInvested: bigint
  amountToBePaid: bigint
}

export function ContractCard({ contractAddress }: ContractCardProps) {
  const { isConnected, address } = useAccount()
  const [showDetails, setShowDetails] = useState(false)
  const [showInvestors, setShowInvestors] = useState(false)
  const [showEvents, setShowEvents] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [investAmount, setInvestAmount] = useState("0.01")
  const [isBorrower, setIsBorrower] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [contractData, setContractData] = useState<{
    borrower: string
    admin: string
    amountBorrowed: bigint
    repaymentAmount: bigint
    balance: bigint
  } | null>(null)
  const [investors, setInvestors] = useState<{
    addresses: string[]
    investedAmounts: bigint[]
    repaidAmounts: bigint[]
  } | null>(null)
  const [events, setEvents] = useState<{
    loanFunded: Array<{lender: string, amount: bigint, time: bigint}>
    loanWithdrawn: Array<{borrower: string, amount: bigint, time: bigint}>
    loanRepaid: Array<{lenders: string[], amount: bigint, time: bigint}>
  }>({
    loanFunded: [],
    loanWithdrawn: [],
    loanRepaid: []
  })

  // Read contract data
  const { data: borrower, isError: borrowerError } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LoanContractABI,
    functionName: "borrower",
  })

  const { data: admin, isError: adminError } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LoanContractABI,
    functionName: "admin",
  })

  const { data: amountBorrowed, isError: amountBorrowedError } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LoanContractABI,
    functionName: "amountBorrowed",
  })

  const { data: repaymentAmount, isError: repaymentAmountError } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LoanContractABI,
    functionName: "repaymentAmount",
  })

  const {
    data: balance,
    isError: balanceError,
    refetch: refetchBalance,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LoanContractABI,
    functionName: "getBalance",
  })

  // Fetch investors data
  const {
    data: investorsData,
    isError: investorsError,
    refetch: refetchInvestors,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LoanContractABI,
    functionName: "getInvestors",
  })

  // Check for errors
  useEffect(() => {
    if (borrowerError || adminError || amountBorrowedError || repaymentAmountError || balanceError || investorsError) {
      setError("Error loading contract data. This may not be a valid loan contract.")
      setIsLoading(false)
    }
  }, [borrowerError, adminError, amountBorrowedError, repaymentAmountError, balanceError, investorsError])

  // Combine all data into a single state to simplify loading logic
  useEffect(() => {
    if (borrower !== undefined && admin !== undefined && amountBorrowed !== undefined && 
        repaymentAmount !== undefined && balance !== undefined) {
      setContractData({
        borrower: borrower as string,
        admin: admin as string,
        amountBorrowed: amountBorrowed as bigint,
        repaymentAmount: repaymentAmount as bigint,
        balance: balance as bigint,
      })
      setIsLoading(false)
    }
  }, [borrower, admin, amountBorrowed, repaymentAmount, balance])

  // Set investors data
  useEffect(() => {
    if (investorsData) {
      setInvestors({
        addresses: investorsData[0] as string[],
        investedAmounts: investorsData[1] as bigint[],
        repaidAmounts: investorsData[2] as bigint[],
      })
    }
  }, [investorsData])

  // Check if current user is the borrower or admin
  useEffect(() => {
    if (address) {
      if (borrower) {
        setIsBorrower(address.toLowerCase() === (borrower as string).toLowerCase())
      }
      if (admin) {
        setIsAdmin(address.toLowerCase() === (admin as string).toLowerCase())
      }
    }
  }, [address, borrower, admin])

  // Write contract function
  const { writeContract, isPending: isWritePending, data: hash } = useWriteContract()

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Refetch data after successful transaction
  useEffect(() => {
    if (isConfirmed) {
      refetchBalance()
      refetchInvestors()
      
      // Simulate event data for demo purposes
      // In a real app, you would fetch events from the blockchain
      if (hash) {
        // This is just a placeholder for events - in real app you'd use logs/events from the blockchain
        const fakeTimestamp = BigInt(Math.floor(Date.now() / 1000))
        
        if (writeActionType === "invest") {
          setEvents(prev => ({
            ...prev,
            loanFunded: [...prev.loanFunded, {
              lender: address || "0x",
              amount: parseEther(investAmount),
              time: fakeTimestamp
            }]
          }))
        } else if (writeActionType === "withdraw") {
          setEvents(prev => ({
            ...prev,
            loanWithdrawn: [...prev.loanWithdrawn, {
              borrower: borrower as string || "0x",
              amount: contractData?.balance || BigInt(0),
              time: fakeTimestamp
            }]
          }))
        } else if (writeActionType === "repay") {
          setEvents(prev => ({
            ...prev,
            loanRepaid: [...prev.loanRepaid, {
              lenders: investors?.addresses || [],
              amount: contractData?.repaymentAmount || BigInt(0),
              time: fakeTimestamp
            }]
          }))
        }
      }
      
      setWriteActionType(null)
    }
  }, [isConfirmed, refetchBalance, refetchInvestors, address, borrower, contractData, investors, investAmount, hash])

  // Track which action triggered the write
  const [writeActionType, setWriteActionType] = useState<"invest" | "withdraw" | "repay" | null>(null)

  const investInLoan = async () => {
    try {
      setWriteActionType("invest")
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: LoanContractABI,
        functionName: "investLoan",
        value: parseEther(investAmount),
        
      })
    } catch (err) {
      console.error("Error investing in loan:", err)
      setWriteActionType(null)
    }
  }

  const withdrawLoan = async () => {
    try {
      setWriteActionType("withdraw")
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: LoanContractABI,
        functionName: "withdrawLoan",
      })
    } catch (err) {
      console.error("Error withdrawing loan:", err)
      setWriteActionType(null)
    }
  }

  const repayLoan = async () => {
    try {
      if (contractData?.repaymentAmount) {
        setWriteActionType("repay")
        writeContract({
          address: contractAddress as `0x${string}`,
          abi: LoanContractABI,
          functionName: "repayLoan",
          value: contractData.repaymentAmount,
        })
      }
    } catch (err) {
      console.error("Error repaying loan:", err)
      setWriteActionType(null)
    }
  }

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString()
  }

  const isPending = isWritePending || isConfirming

  // Check if loan is fully funded
  const isFullyFunded = contractData?.balance && contractData?.amountBorrowed 
    ? contractData.balance >= contractData.amountBorrowed
    : false

  // Calculate loan funding status
  const fundingProgress = contractData?.balance && contractData?.amountBorrowed 
    ? Number(contractData.balance) / Number(contractData.amountBorrowed) * 100
    : 0

  // Calculate if loan has been repaid
  const isRepaid = investors && investors.repaidAmounts.some(amount => amount > BigInt(0))

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Contract</CardTitle>
          <CardDescription>{shortenAddress(contractAddress)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Loan Contract
          <Badge variant="outline" className="ml-2">
            {shortenAddress(contractAddress)}
          </Badge>
        </CardTitle>
        <CardDescription>
          <a
            href={`https://sepolia.basescan.org/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:underline"
          >
            View on Etherscan <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract status badges */}
        <div className="flex flex-wrap gap-2">
          {isFullyFunded && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Fully Funded
            </Badge>
          )}
          {!isFullyFunded && contractData?.balance && contractData.balance > BigInt(0) && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Partially Funded
            </Badge>
          )}
          {contractData?.balance === BigInt(0) && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              Not Funded
            </Badge>
          )}
          {isRepaid && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Partially Repaid
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Borrower:</span>
          </div>
          <span className="text-sm font-medium">
            {contractData?.borrower ? shortenAddress(contractData.borrower) : "N/A"}
            {isBorrower && <Badge className="ml-2" variant="secondary">You</Badge>}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Amount:</span>
          </div>
          <span className="text-sm font-medium">
            {contractData?.amountBorrowed ? formatEther(contractData.amountBorrowed) : "0"} ETH
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Wallet className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Balance:</span>
            </div>
            <span className="text-sm font-medium">
              {contractData?.balance ? formatEther(contractData.balance) : "0"} ETH
            </span>
          </div>
          {/* Funding progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${isFullyFunded ? 'bg-green-600' : 'bg-blue-600'}`}
              style={{ width: `${Math.min(fundingProgress, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-right text-muted-foreground mt-1">
            {fundingProgress.toFixed(0)}% Funded
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Repayment:</span>
          </div>
          <span className="text-sm font-medium">
            {contractData?.repaymentAmount ? formatEther(contractData.repaymentAmount) : "0"} ETH
          </span>
        </div>

        {/* Investors section */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowInvestors(!showInvestors)}
            className="w-full flex items-center justify-center"
          >
            {showInvestors ? "Hide Investors" : "Show Investors"} 
            <Users className="ml-2 h-4 w-4" />
          </Button>
          
          {showInvestors && investors && (
            <div className="mt-4 border rounded-md p-3">
              <h4 className="text-sm font-medium mb-2">Investors ({investors.addresses.length})</h4>
              <div className="max-h-40 overflow-y-auto">
                {investors.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {investors.addresses.map((addr, idx) => (
                      <div key={idx} className="border-b pb-2 text-xs">
                        <div className="flex justify-between">
                          <span className="font-mono">{shortenAddress(addr)}</span>
                          <span>{formatEther(investors.investedAmounts[idx])} ETH</span>
                        </div>
                        {/* Show repaid amount if any */}
                        {investors.repaidAmounts[idx] > BigInt(0) && (
                          <div className="flex justify-between text-green-600 mt-1">
                            <span>Repaid:</span>
                            <span>{formatEther(investors.repaidAmounts[idx])} ETH</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No investors yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Events section */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowEvents(!showEvents)}
            className="w-full flex items-center justify-center"
          >
            {showEvents ? "Hide Transaction History" : "Show Transaction History"} 
            <History className="ml-2 h-4 w-4" />
          </Button>
          
          {showEvents && (
            <div className="mt-4 border rounded-md p-3">
              <h4 className="text-sm font-medium mb-2">Transaction History</h4>
              <div className="max-h-40 overflow-y-auto">
                {events.loanFunded.length > 0 || events.loanWithdrawn.length > 0 || events.loanRepaid.length > 0 ? (
                  <div className="space-y-2">
                    {/* Funded events */}
                    {events.loanFunded.map((event, idx) => (
                      <div key={`funded-${idx}`} className="border-b pb-2 text-xs">
                        <div className="flex items-center text-blue-600">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          <span>Investment</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="font-mono">{shortenAddress(event.lender)}</span>
                          <span>{formatEther(event.amount)} ETH</span>
                        </div>
                        <div className="text-right text-muted-foreground text-xs mt-1">
                          <Clock className="inline h-2 w-2 mr-1" />
                          {formatTimestamp(event.time)}
                        </div>
                      </div>
                    ))}
                    
                    {/* Withdrawn events */}
                    {events.loanWithdrawn.map((event, idx) => (
                      <div key={`withdrawn-${idx}`} className="border-b pb-2 text-xs">
                        <div className="flex items-center text-orange-600">
                          <Wallet className="h-3 w-3 mr-1" />
                          <span>Withdrawal</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="font-mono">{shortenAddress(event.borrower)}</span>
                          <span>{formatEther(event.amount)} ETH</span>
                        </div>
                        <div className="text-right text-muted-foreground text-xs mt-1">
                          <Clock className="inline h-2 w-2 mr-1" />
                          {formatTimestamp(event.time)}
                        </div>
                      </div>
                    ))}
                    
                    {/* Repaid events */}
                    {events.loanRepaid.map((event, idx) => (
                      <div key={`repaid-${idx}`} className="border-b pb-2 text-xs">
                        <div className="flex items-center text-green-600">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          <span>Repayment</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="font-mono">To {event.lenders.length} investors</span>
                          <span>{formatEther(event.amount)} ETH</span>
                        </div>
                        <div className="text-right text-muted-foreground text-xs mt-1">
                          <Clock className="inline h-2 w-2 mr-1" />
                          {formatTimestamp(event.time)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No transaction history available</p>
                )}
              </div>
            </div>
          )}
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Contract Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Contract Address:</span>
                <p className="font-mono text-xs break-all">{contractAddress}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Borrower:</span>
                <p className="font-mono text-xs break-all">{contractData?.borrower}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Admin:</span>
                <p className="font-mono text-xs break-all">{contractData?.admin}</p>
                {isAdmin && <Badge className="ml-2" variant="outline">You</Badge>}
              </div>
            </div>
          </div>
        )}
       
      </CardContent>
      <CardFooter className="flex flex-col">
        {!isConnected ? (
          <div className="w-full">
            <WalletComponents />
          </div>
        ) : (
          <div className="w-full space-y-3">
            {/* Investment section */}
            {!isFullyFunded && (
              <div className="flex items-center">
                <input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="flex-1 border rounded-l-md p-2 text-sm"
                  placeholder="ETH amount"
                />
                <Button 
                  onClick={investInLoan} 
                  className="rounded-l-none" 
                  disabled={isPending}
                >
                  {isPending && writeActionType === "invest" ? "Processing..." : "Invest"}
                </Button>
              </div>
            )}

            {/* Borrower actions */}
            {isBorrower && (
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={withdrawLoan} 
                  variant="outline"
                  disabled={isPending || contractData?.balance === BigInt(0) || !isFullyFunded}
                  className="flex items-center justify-center"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isPending && writeActionType === "withdraw" ? "Processing..." : "Withdraw Loan"}
                </Button>
                
                <Button 
                  onClick={repayLoan} 
                  variant="secondary"
                  disabled={isPending || contractData?.balance === BigInt(0)}
                  className="flex items-center justify-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isPending && writeActionType === "repay" ? "Processing..." : "Repay Loan"}
                </Button>
              </div>
            )}

            {/* Contract status summary */}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <Button variant="outline" size="icon" onClick={() => setShowDetails(!showDetails)}>
                <Info className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {contractData?.balance === BigInt(0) ? "Not funded" : 
                 isFullyFunded ? "Fully funded" : "Partially funded"}
                 {isRepaid && " - Partially repaid"}
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}