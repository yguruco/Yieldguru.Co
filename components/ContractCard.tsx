"use client"

import { useState, useEffect } from "react"
import { LoanContractABI } from "@/contractsAbi/LoanContractABI"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, Users, ArrowUpRight, Wallet, Info } from "lucide-react"
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi"
import { formatEther, parseEther } from "viem"
import { WalletComponents } from "./onchainKit/wallet"

interface ContractCardProps {
  contractAddress: string
}

export function ContractCard({ contractAddress }: ContractCardProps) {
  const { isConnected } = useAccount()
  const [showDetails, setShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contractData, setContractData] = useState<{
    borrower: string
    admin: string
    amountBorrowed: bigint
    repaymentAmount: bigint
    balance: bigint
  } | null>(null)

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

  // Check for errors
  useEffect(() => {
    if (borrowerError || adminError || amountBorrowedError || repaymentAmountError || balanceError) {
      setError("Error loading contract data. This may not be a valid loan contract.")
      setIsLoading(false)
    }
  }, [borrowerError, adminError, amountBorrowedError, repaymentAmountError, balanceError])

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

  // Write contract function
  const { writeContract, isPending: isInvesting, data: hash } = useWriteContract()

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Refetch balance after successful transaction
  useEffect(() => {
    if (isConfirmed) {
      refetchBalance()
    }
  }, [isConfirmed, refetchBalance])

  const investInLoan = async () => {
    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: LoanContractABI,
        functionName: "investLoan",
        value: parseEther("0.01"),
      })
    } catch (err) {
      console.error("Error investing in loan:", err)
    }
  }

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Borrower:</span>
          </div>
          <span className="text-sm font-medium">
            {contractData?.borrower ? shortenAddress(contractData.borrower) : "N/A"}
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Balance:</span>
          </div>
          <span className="text-sm font-medium">
            {contractData?.balance ? formatEther(contractData.balance) : "0"} ETH
          </span>
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

        {showDetails && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Contract Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Contract Address:</span>
                <p className="font-mono text-xs break-all">{contractAddress}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Admin:</span>
                <p className="font-mono text-xs break-all">{contractData?.admin}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isConnected ? (
          <div className="w-full">
            <WalletComponents />
          </div>
        ) : (
          <>
            <Button 
              onClick={investInLoan} 
              className="flex-1 mr-2" 
              disabled={isInvesting || isConfirming}
            >
              {isInvesting || isConfirming ? "Processing..." : "Invest in Loan"}
            </Button>

            <Button variant="outline" size="icon" onClick={() => setShowDetails(!showDetails)}>
              <Info className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
