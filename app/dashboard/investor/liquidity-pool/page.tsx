"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, ArrowRight, Droplets, Wallet, BarChart3, DollarSign, Percent } from "lucide-react"
import TokenCard from "@/components/liquidity-pool/token-card"
import PoolCard from "@/components/liquidity-pool/pool-card"
import SwapInterface from "@/components/liquidity-pool/swap-interface"
import LiquidityInterface from "@/components/liquidity-pool/liquidity-interface"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"

export default function InvestorLiquidityPoolPage() {
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

  const accentColor = "#fbdc3e";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                boxShadow: `0 3px 10px ${accentColor}40`
              }}
            >
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight shimmer">Liquidity Pool</h1>
          </div>
          <p className="text-muted-foreground">Invest in liquidity pools and earn yield</p>
        </div>
        <Button className="bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">
          <Plus className="mr-2 h-4 w-4" />
          Create New Pool
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pools">Pools</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-4 pt-4">
              {showSwapInterface ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Button variant="outline" onClick={handleBackToOverview} className="mb-2">
                    ← Back to Overview
                  </Button>
                  <GlassmorphicCard accentColor={accentColor}>
                    <div className="p-4">
                      <SwapInterface />
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              ) : showLiquidityInterface && selectedPoolData ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Button variant="outline" onClick={handleBackToOverview} className="mb-2">
                    ← Back to Overview
                  </Button>
                  <GlassmorphicCard accentColor={accentColor}>
                    <div className="p-4">
                      <LiquidityInterface
                        poolName={selectedPoolData.name}
                        token1={selectedPoolData.token1}
                        token2={selectedPoolData.token2}
                        token1Logo={selectedPoolData.token1Logo}
                        token2Logo={selectedPoolData.token2Logo}
                      />
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <motion.div variants={itemVariants}>
                      <NeumorphicStatCard
                        title="Total Value Locked"
                        value="$9.4M"
                        description="+12% from last month"
                        trend="up"
                        trendValue="12%"
                        icon={<DollarSign className="h-5 w-5 text-[#fbdc3e]" />}
                        accentColor={accentColor}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <NeumorphicStatCard
                        title="24h Volume"
                        value="$1.75M"
                        description="+8% from yesterday"
                        trend="up"
                        trendValue="8%"
                        icon={<BarChart3 className="h-5 w-5 text-[#fbdc3e]" />}
                        accentColor={accentColor}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <NeumorphicStatCard
                        title="My Liquidity"
                        value="$10,830"
                        description="Across 3 pools"
                        icon={<Wallet className="h-5 w-5 text-[#fbdc3e]" />}
                        accentColor={accentColor}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <NeumorphicStatCard
                        title="Average APR"
                        value="13.1%"
                        description="+2.4% from last month"
                        trend="up"
                        trendValue="2.4%"
                        icon={<Percent className="h-5 w-5 text-[#fbdc3e]" />}
                        accentColor={accentColor}
                      />
                    </motion.div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <motion.div variants={itemVariants}>
                      <GlassmorphicCard
                        title="Quick Swap"
                        description="Instantly swap between tokens"
                        accentColor={accentColor}
                      >
                        <div className="flex justify-end px-6 pt-0 pb-2">
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
                        <div className="grid grid-cols-2 gap-4 p-4">
                          {tokens.slice(0, 4).map((token, index) => (
                            <motion.div
                              key={token.symbol}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.05 * index }}
                            >
                              <TokenCard {...token} onClick={() => handleTokenSelect(token.symbol)} />
                            </motion.div>
                          ))}
                        </div>
                      </GlassmorphicCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <GlassmorphicCard
                        title="My Pools"
                        description="Your active liquidity positions"
                        accentColor={accentColor}
                      >
                        <div className="flex justify-end px-6 pt-0 pb-2">
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
                        <div className="space-y-4 p-4">
                          {pools.map((pool, index) => (
                            <motion.div
                              key={pool.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.05 * index }}
                            >
                              <PoolCard {...pool} onClick={() => handlePoolSelect(pool.id)} />
                            </motion.div>
                          ))}
                        </div>
                      </GlassmorphicCard>
                    </motion.div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="pools" className="space-y-4 pt-4">
              <GlassmorphicCard
                title="Available Pools"
                description="Browse and manage liquidity pools"
                accentColor={accentColor}
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
                  {pools.map((pool, index) => (
                    <motion.div
                      key={pool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                    >
                      <PoolCard {...pool} onClick={() => handlePoolSelect(pool.id)} />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * pools.length }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="overflow-hidden h-full border-dashed">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                        <div
                          className="h-12 w-12 rounded-full flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${accentColor}15` }}
                        >
                          <Plus className="h-6 w-6" style={{ color: accentColor }} />
                        </div>
                        <h3 className="font-medium text-lg mb-2">Create New Pool</h3>
                        <p className="text-sm text-gray-500 mb-4">Add liquidity to a new token pair</p>
                        <Button className="bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">Create Pool</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </GlassmorphicCard>
            </TabsContent>

            <TabsContent value="tokens" className="space-y-4 pt-4">
              <GlassmorphicCard
                title="Token List"
                description="View and swap available tokens"
                accentColor={accentColor}
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
                  {tokens.map((token, index) => (
                    <motion.div
                      key={token.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                    >
                      <TokenCard {...token} onClick={() => handleTokenSelect(token.symbol)} />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * tokens.length }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="overflow-hidden h-full border-dashed">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                        <div
                          className="h-12 w-12 rounded-full flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${accentColor}15` }}
                        >
                          <Droplets className="h-6 w-6" style={{ color: accentColor }} />
                        </div>
                        <h3 className="font-medium text-lg mb-2">Add Custom Token</h3>
                        <p className="text-sm text-gray-500 mb-4">Import a token by contract address</p>
                        <Button className="bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">Import Token</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </GlassmorphicCard>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
