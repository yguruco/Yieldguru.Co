"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Plus, ArrowRight, Droplets } from "lucide-react"
import TokenCard from "@/components/liquidity-pool/token-card"
import PoolCard from "@/components/liquidity-pool/pool-card"
import SwapInterface from "@/components/liquidity-pool/swap-interface"
import LiquidityInterface from "@/components/liquidity-pool/liquidity-interface"

export default function LiquidityPoolPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [showSwapInterface, setShowSwapInterface] = useState(false)
  const [showLiquidityInterface, setShowLiquidityInterface] = useState(false)

  const tokens = [
    {
      symbol: "YGT",
      name: "YieldGuru Token",
      balance: "1,245.00",
      price: "1.24",
      change: "2.5%",
      isPositive: true,
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "2,500.00",
      price: "1.00",
      change: "0.1%",
      isPositive: true,
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "1.25",
      price: "3,500.00",
      change: "5.2%",
      isPositive: true,
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      balance: "0.05",
      price: "65,000.00",
      change: "-1.8%",
      isPositive: false,
      logo: "/placeholder.svg?height=48&width=48",
    },
  ]

  const pools = [
    {
      id: "ygt-usdc",
      name: "YGT-USDC",
      token1: "YGT",
      token2: "USDC",
      token1Logo: "/placeholder.svg?height=32&width=32",
      token2Logo: "/placeholder.svg?height=32&width=32",
      apr: "12.5%",
      tvl: "$2.4M",
      volume24h: "$450K",
      myLiquidity: "$5,280",
    },
    {
      id: "ygt-eth",
      name: "YGT-ETH",
      token1: "YGT",
      token2: "ETH",
      token1Logo: "/placeholder.svg?height=32&width=32",
      token2Logo: "/placeholder.svg?height=32&width=32",
      apr: "18.2%",
      tvl: "$1.8M",
      volume24h: "$320K",
      myLiquidity: "$3,150",
    },
    {
      id: "usdc-eth",
      name: "USDC-ETH",
      token1: "USDC",
      token2: "ETH",
      token1Logo: "/placeholder.svg?height=32&width=32",
      token2Logo: "/placeholder.svg?height=32&width=32",
      apr: "8.7%",
      tvl: "$5.2M",
      volume24h: "$980K",
      myLiquidity: "$2,400",
    },
  ]

  const handleTokenSelect = (symbol: string) => {
    setSelectedToken(symbol)
    setShowSwapInterface(true)
  }

  const handlePoolSelect = (id: string) => {
    setSelectedPool(id)
    setShowLiquidityInterface(true)
  }

  const handleBackToOverview = () => {
    setShowSwapInterface(false)
    setShowLiquidityInterface(false)
    setSelectedToken(null)
    setSelectedPool(null)
  }

  const selectedPoolData = pools.find((pool) => pool.id === selectedPool)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liquidity Pool</h1>
          <p className="text-muted-foreground">Manage your liquidity positions and swap tokens</p>
        </div>
        <Button className="bg-[#4f1964] hover:bg-[#4f1964]/90">
          <Plus className="mr-2 h-4 w-4" />
          Create New Pool
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pools">Pools</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          {showSwapInterface ? (
            <div className="space-y-4">
              <Button variant="outline" onClick={handleBackToOverview} className="mb-2">
                ← Back to Overview
              </Button>
              <SwapInterface />
            </div>
          ) : showLiquidityInterface && selectedPoolData ? (
            <div className="space-y-4">
              <Button variant="outline" onClick={handleBackToOverview} className="mb-2">
                ← Back to Overview
              </Button>
              <LiquidityInterface
                poolName={selectedPoolData.name}
                token1={selectedPoolData.token1}
                token2={selectedPoolData.token2}
                token1Logo={selectedPoolData.token1Logo}
                token2Logo={selectedPoolData.token2Logo}
              />
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$9.4M</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1.75M</div>
                    <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">My Liquidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$10,830</div>
                    <p className="text-xs text-muted-foreground">Across 3 pools</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average APR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">13.1%</div>
                    <p className="text-xs text-muted-foreground">+2.4% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Quick Swap</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setShowSwapInterface(true)}
                      >
                        <span>Swap</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Instantly swap between tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {tokens.slice(0, 4).map((token) => (
                        <TokenCard key={token.symbol} {...token} onClick={() => handleTokenSelect(token.symbol)} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>My Pools</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setActiveTab("pools")}
                      >
                        <span>View All</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Your active liquidity positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pools.map((pool) => (
                        <PoolCard key={pool.id} {...pool} onClick={() => handlePoolSelect(pool.id)} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="pools" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Pools</CardTitle>
              <CardDescription>Browse and manage liquidity pools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pools.map((pool) => (
                  <PoolCard key={pool.id} {...pool} onClick={() => handlePoolSelect(pool.id)} />
                ))}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="overflow-hidden h-full border-dashed">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-gray-500" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">Create New Pool</h3>
                      <p className="text-sm text-gray-500 mb-4">Add liquidity to a new token pair</p>
                      <Button className="bg-[#4f1964] hover:bg-[#4f1964]/90">Create Pool</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Token List</CardTitle>
              <CardDescription>View and swap available tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tokens.map((token) => (
                  <TokenCard key={token.symbol} {...token} onClick={() => handleTokenSelect(token.symbol)} />
                ))}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="overflow-hidden h-full border-dashed">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Droplets className="h-6 w-6 text-gray-500" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">Add Custom Token</h3>
                      <p className="text-sm text-gray-500 mb-4">Import a token by contract address</p>
                      <Button className="bg-[#4f1964] hover:bg-[#4f1964]/90">Import Token</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
