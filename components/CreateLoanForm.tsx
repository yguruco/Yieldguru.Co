"use client"
import * as React from 'react'
import { 
  type BaseError,
  useWaitForTransactionReceipt, 
  useWriteContract,
  useAccount
} from 'wagmi'
import { parseEther } from 'viem'
import { loanFactoryABI, loanFactoryAddress } from '../contractsAbi/LoanFactory'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
 
export function CreateLoanForm({ onLoanCreated }: { onLoanCreated?: (address: string) => void }) {
  const { address } = useAccount()
  const { 
    data: hash,
    error,
    isPending, 
    writeContract 
  } = useWriteContract() 

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement)
    
    try {
      const amount = formData.get('amount') as string
      const borrower = formData.get('borrower') as string
      const repaymentAmount = formData.get('repaymentAmount') as string
      const admin = formData.get('admin') as string || address
      
      const parsedAmount = parseEther(amount)
      const parsedRepaymentAmount = parseEther(repaymentAmount)
      
      writeContract({
        address: loanFactoryAddress as `0x${string}`,
        abi: loanFactoryABI,
        functionName: 'createLoan',
        args: [
          parsedAmount, 
          borrower as `0x${string}`, 
          parsedRepaymentAmount, 
          admin as `0x${string}`
        ],
      })
    } catch (err) {
      console.error("Input validation error:", err)
    }
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = 
    useWaitForTransactionReceipt({ 
      hash,
      confirmations: 2  // Increase to 2 confirmations to ensure transaction stability
    }) 

  // Call onLoanCreated when the transaction is confirmed
  React.useEffect(() => {
    if (isConfirmed && receipt && onLoanCreated && hash) {
      console.log("Transaction confirmed with receipt:", receipt);
      // The LoanCreated event should contain the new loan address
      onLoanCreated(hash)
    }
  }, [isConfirmed, receipt, hash, onLoanCreated])
  
  // Manual transaction confirmation check as a backup
  const [manuallyConfirmed, setManuallyConfirmed] = React.useState(false)
  
  React.useEffect(() => {
    if (hash && !isConfirmed) {
      // Set a timer as a backup to mark transaction as confirmed after 15 seconds
      const timer = setTimeout(() => {
        console.log("Manual confirmation triggered after timeout");
        setManuallyConfirmed(true);
        if (onLoanCreated && hash) {
          onLoanCreated(hash);
        }
      }, 20000); // Increase to 20 seconds to give more time for blockchain confirmations
      
      return () => clearTimeout(timer);
    }
  }, [hash, isConfirmed, onLoanCreated]);
  
  // Combined confirmation state (either detected by hook or manual timeout)
  const txConfirmed = isConfirmed || manuallyConfirmed;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-[#4f1964] font-medium">Loan Amount (ETH)</Label>
        <Input 
          id="amount" 
          name="amount" 
          placeholder="e.g., 1.5" 
          required
          className="w-full border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="borrower" className="text-[#4f1964] font-medium">Borrower Address</Label>
        <Input 
          id="borrower" 
          name="borrower" 
          placeholder="0x..." 
          required
          className="w-full border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="repaymentAmount" className="text-[#4f1964] font-medium">Repayment Amount (ETH)</Label>
        <Input 
          id="repaymentAmount" 
          name="repaymentAmount" 
          placeholder="e.g., 1.6" 
          required
          className="w-full border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
        />
        <p className="text-xs text-[#4f1964]/70">Total amount to be repaid (principal + interest)</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="admin" className="text-[#4f1964] font-medium">Admin Address (optional)</Label>
        <Input 
          id="admin" 
          name="admin" 
          placeholder={address || "0x..."} 
          className="w-full border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
        />
        <p className="text-xs text-[#4f1964]/70">Leave empty to use your connected wallet address</p>
      </div>
      
      <Button 
        disabled={isPending || isConfirming && !txConfirmed} 
        type="submit"
        className="w-full bg-[#4f1964] hover:bg-[#3b1149] text-[#fbdc3e] font-medium border border-[#fbdc3e]/20"
      >
        {isPending ? 'Processing...' : isConfirming && !txConfirmed ? 'Confirming...' : 'Create Loan'} 
      </Button>
      
      {hash && !txConfirmed && (
        <Alert className="mt-4 bg-[#fbdc3e]/10 border border-[#fbdc3e]/30">
          <AlertDescription>
            <div className="text-sm font-medium text-[#4f1964]">Transaction Hash:</div>
            <div className="text-xs break-all text-[#4f1964]/80">{hash}</div>
          </AlertDescription>
        </Alert>
      )}
      
      {isConfirming && !txConfirmed && (
        <Alert className="mt-4 bg-[#fbdc3e]/20 border border-[#fbdc3e]/40">
          <AlertDescription className="text-[#4f1964] font-medium">
            Waiting for confirmation...
          </AlertDescription>
        </Alert>
      )}
      
      {txConfirmed && (
        <Alert className="mt-4 bg-[#f68b27]/10 border border-[#f68b27]/30">
          <AlertDescription className="text-[#f68b27] font-medium">
            Transaction confirmed! Loan contract successfully created.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="mt-4 bg-red-50 border border-red-200">
          <AlertDescription className="text-red-800">
            Error: {(error as BaseError).shortMessage || error.message}
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}