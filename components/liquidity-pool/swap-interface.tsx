"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDown, Settings, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState({
    symbol: "YGT",
    logo: "/placeholder.svg?height=32&width=32",
    balance: "1,245.00"
  })
  
  const [toToken, setToToken] = useState({
    symbol: "USDC",
    logo: "/placeholder.svg?height=32&width=32",
    balance: "2,500.00"
  })
  
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFromAmount(value)
    // In a real app, this would call a price calculation function
    if (value) {
      setToAmount((parseFloat(value) * 1.24).toFixed(2))
    } else {
      setToAmount("")
    }
  }
  
  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setToAmount(value)
    // In a real app, this would call a price calculation function
    if (value) {
      setFromAmount((parseFloat(value) / 1.24).toFixed(2))
    } else {
      setFromAmount("")
    }
  }
  
  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Swap Tokens</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="fromAmount">From</Label>
              <span className="text-xs text-gray-500">
                Balance: {fromToken.balance} {fromToken.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  id="fromAmount"
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  className="text-lg"
                />
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                <div className="relative h-6 w-6 rounded-full overflow-hidden">
                  <Image
                    src={fromToken.logo}
                    alt={fromToken.symbol}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{fromToken.symbol}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-white shadow-md"
            onClick={handleSwapTokens}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="toAmount">To</Label>
              <span className="text-xs text-gray-500">
                Balance: {toToken.balance} {toToken.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  id="toAmount"
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  onChange={handleToAmountChange}
                  className="text-lg"
                />
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                <div className="relative h-6 w-6 rounded-full overflow-hidden">
                  <Image
                    src={toToken.logo}
                    alt={toToken.symbol}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{toToken.symbol}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-gray-50 p-3 rounded-md text-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-500">Rate</span>
            <span>1 {fromToken.symbol} = 1.24 {toToken.symbol}</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-500">Slippage Tolerance</span>
            <span>{slippage}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Fee</span>
            <span>0.3%</span>
          </div>
        </div>
        
        <Button className="w-full bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">
          Swap
        </Button>
      </div>
    </div>
  )
}
