"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, Settings, RefreshCw } from "lucide-react"
import Image from "next/image"

interface LiquidityInterfaceProps {
  poolName: string
  token1: string
  token2: string
  token1Logo: string
  token2Logo: string
}

export default function LiquidityInterface({
  poolName,
  token1,
  token2,
  token1Logo,
  token2Logo
}: LiquidityInterfaceProps) {
  const [activeTab, setActiveTab] = useState("add")
  const [token1Amount, setToken1Amount] = useState("")
  const [token2Amount, setToken2Amount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  
  const handleToken1AmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setToken1Amount(value)
    // In a real app, this would call a price calculation function based on the pool ratio
    if (value) {
      setToken2Amount((parseFloat(value) * 1.24).toFixed(2))
    } else {
      setToken2Amount("")
    }
  }
  
  const handleToken2AmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setToken2Amount(value)
    // In a real app, this would call a price calculation function based on the pool ratio
    if (value) {
      setToken1Amount((parseFloat(value) / 1.24).toFixed(2))
    } else {
      setToken1Amount("")
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{poolName} Pool</h2>
          <p className="text-sm text-gray-500">Manage your liquidity position</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Liquidity
          </TabsTrigger>
          <TabsTrigger value="remove" className="flex items-center gap-1">
            <Minus className="h-4 w-4" />
            Remove Liquidity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="token1Amount">{token1}</Label>
                <span className="text-xs text-gray-500">
                  Balance: 1,245.00 {token1}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    id="token1Amount"
                    type="number"
                    placeholder="0.00"
                    value={token1Amount}
                    onChange={handleToken1AmountChange}
                    className="text-lg"
                  />
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden">
                    <Image
                      src={token1Logo}
                      alt={token1}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium">{token1}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
              <Plus className="h-4 w-4" />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="token2Amount">{token2}</Label>
                <span className="text-xs text-gray-500">
                  Balance: 2,500.00 {token2}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    id="token2Amount"
                    type="number"
                    placeholder="0.00"
                    value={token2Amount}
                    onChange={handleToken2AmountChange}
                    className="text-lg"
                  />
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden">
                    <Image
                      src={token2Logo}
                      alt={token2}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium">{token2}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500">Rate</span>
              <span>1 {token1} = 1.24 {token2}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500">Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Share of Pool</span>
              <span>~2.5%</span>
            </div>
          </div>
          
          <Button className="w-full bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">
            Add Liquidity
          </Button>
        </TabsContent>
        
        <TabsContent value="remove" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 mb-1">Your Liquidity</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="relative flex -space-x-2">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={token1Logo}
                        alt={token1}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-6 w-6 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={token2Logo}
                        alt={token2}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="font-medium">{poolName}</span>
                </div>
                <p className="font-bold text-xl">$5,280</p>
              </div>
              
              <div className="flex justify-between text-sm mb-4">
                <div className="text-center">
                  <p className="text-gray-500 mb-1">{token1}</p>
                  <p className="font-medium">1,245.00</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">{token2}</p>
                  <p className="font-medium">1,543.80</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Amount to Remove</Label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue="50"
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500">You Will Receive</span>
              <span>622.50 {token1} + 771.90 {token2}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Share of Pool After</span>
              <span>~1.25%</span>
            </div>
          </div>
          
          <Button className="w-full bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">
            Remove Liquidity
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
