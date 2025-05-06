"use client"
import * as React from 'react'
import { 
  type BaseError,
  useWaitForTransactionReceipt, 
  useWriteContract,
  useAccount
} from 'wagmi'
import { myNftContract } from '../contractsAbi/issueNft'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
 
export function MintNFT() {
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
    const recipientAddress = formData.get('to') as string || address
    const tokenUri = formData.get('uri') as string
    
    writeContract({
      address: myNftContract.address,
      abi: myNftContract.abi,
      functionName: 'safeMint',
      args: [recipientAddress as `0x${string}`, tokenUri],
    })
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="to" className="text-[#4f1964] font-medium">Recipient Address (optional)</Label>
        <Input 
          id="to" 
          name="to" 
          placeholder={address || "0x..."} 
          className="w-full border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
        />
        <p className="text-xs text-[#4f1964]/70">Leave empty to use your connected wallet address</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="uri" className="text-[#4f1964] font-medium">Token URI</Label>
        <Input 
          id="uri" 
          name="uri" 
          placeholder="ipfs://..." 
          required 
          className="w-full border-[#4f1964]/30 focus:border-[#4f1964] focus:ring-[#4f1964]/20"
        />
        <p className="text-xs text-[#4f1964]/70">Use the IPFS URL from the file upload section</p>
      </div>
      
      <Button 
        disabled={isPending || isConfirming} 
        type="submit"
        className="w-full bg-[#4f1964] hover:bg-[#3b1149] text-[#fbdc3e] font-medium border border-[#fbdc3e]/20"
      >
        {isPending || isConfirming ? 'Processing...' : 'Mint NFT'} 
      </Button>
      
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
      
      {isConfirmed && (
        <Alert className="mt-4 bg-[#f68b27]/10 border border-[#f68b27]/30">
          <AlertDescription className="text-[#f68b27] font-medium">
            Transaction confirmed! NFT successfully minted.
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