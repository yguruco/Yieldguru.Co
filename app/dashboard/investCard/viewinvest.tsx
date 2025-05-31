"use client"

import { useState, useEffect } from "react"
import { ContractCard } from "@/components/ContractCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Trash2 } from "lucide-react"
import { WalletComponents } from "@/reown-appkit/wallet"
import { isAddress } from "viem"

export default function ViewInvest() {
  // Load from localStorage if available
  const [contractAddresses, setContractAddresses] = useState<string[]>([])
  const [newAddress, setNewAddress] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Load addresses from localStorage on initial render
  useEffect(() => {
    const savedAddresses = localStorage.getItem("contractAddresses")
    if (savedAddresses) {
      setContractAddresses(JSON.parse(savedAddresses))
    } else {
      // Default addresses if none saved - using Sepolia test addresses
      setContractAddresses([
        "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", // Example Sepolia address
        "0xdD2FD4581271e230360230F9337D5c0430Bf44C0", // Example Sepolia address
      ])
    }
  }, [])

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    if (contractAddresses.length > 0) {
      localStorage.setItem("contractAddresses", JSON.stringify(contractAddresses))
    }
  }, [contractAddresses])

  const addContractAddress = () => {
    setError(null)

    if (!newAddress) {
      setError("Please enter a contract address")
      return
    }

    // Use isAddress from viem
    if (!isAddress(newAddress)) {
      setError("Please enter a valid Ethereum address")
      return
    }

    if (contractAddresses.includes(newAddress)) {
      setError("This contract address is already in your list")
      return
    }

    setContractAddresses([...contractAddresses, newAddress])
    setNewAddress("")
  }

  const removeContractAddress = (address: string) => {
    setContractAddresses(contractAddresses.filter((a) => a !== address))
  }

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Loan Contracts{" "}
          <span className="text-sm font-normal bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Sepolia Network</span>
        </h1>
        {/* <WalletComponents /> */}
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <div className="flex gap-4">
          <Input
            placeholder="Enter new contract address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={addContractAddress}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contract
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contractAddresses.map((address) => (
          <div key={address} className="relative group">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-2 -right-2 z-10 bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeContractAddress(address)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            <ContractCard contractAddress={address} />
          </div>
        ))}
      </div>
    </main>
  )
}
