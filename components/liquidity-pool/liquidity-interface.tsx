"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Minus, AlertTriangle, Check } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LiquidityInterfaceProps {
  poolName: string
  token1: string
  token2: string
  token1Logo: string
  token2Logo: string
  onAddLiquidity?: (token1Amount: string, token2Amount: string) => void
  onRemoveLiquidity?: (percentage: number) => void
}

export default function LiquidityInterface({
  poolName,
  token1,
  token2,
  token1Logo,
  token2Logo,
  onAddLiquidity,
  onRemoveLiquidity,
}: LiquidityInterfaceProps) {
  const [action, setAction] = useState<"add" | "remove">("add")
  const [token1Amount, setToken1Amount] = useState("")
  const [token2Amount, setToken2Amount] = useState("")
  const [removePercentage, setRemovePercentage] = useState(50)
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")

  // Token balances
  const balances = {
    YGT: "1,245.00",
    USDC: "2,500.00",
    ETH: "1.25",
    WBTC: "0.05",
  }

  // Current pool stats
  const poolStats = {
    myLiquidity: "$5,280.00",
    myShare: "0.42%",
    token1Amount: "2,100.00",
    token2Amount: "1,680.00",
    apr: "12.5%",
  }

  // Calculate token2 amount based on token1 input
  useEffect(() => {
    if (token1Amount && !isNaN(Number.parseFloat(token1Amount))) {
      // Simple 1:0.8 ratio for demo
      const calculatedAmount = (Number.parseFloat(token1Amount) * 0.8).toFixed(6)
      setToken2Amount(calculatedAmount)
    } else {
      setToken2Amount("")
    }
  }, [token1Amount])

  const handleToken1AmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setToken1Amount(value)
    }
  }

  const handleToken2AmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setToken2Amount(value)

      // Calculate token1 amount based on token2 input
      if (value && !isNaN(Number.parseFloat(value))) {
        // Simple 0.8:1 ratio for demo
        const calculatedAmount = (Number.parseFloat(value) / 0.8).toFixed(6)
        setToken1Amount(calculatedAmount)
      } else {
        setToken1Amount("")
      }
    }
  }

  const handleMaxToken1 = () => {
    const balance = balances[token1 as keyof typeof balances]
    if (balance) {
      setToken1Amount(balance.replace(/,/g, ""))
    }
  }

  const handleMaxToken2 = () => {
    const balance = balances[token2 as keyof typeof balances]
    if (balance) {
      setToken2Amount(balance.replace(/,/g, ""))
    }
  }

  const handleAddLiquidity = () => {
    if (
      !token1Amount ||
      !token2Amount ||
      Number.parseFloat(token1Amount) <= 0 ||
      Number.parseFloat(token2Amount) <= 0
    ) {
      setErrorMessage("Please enter valid amounts for both tokens")
      return
    }

    setErrorMessage("")
    setStatus("pending")
    setProgress(0)

    // Simulate transaction process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus("success")
          setTimeout(() => {
            setStatus("idle")
            setToken1Amount("")
            setToken2Amount("")
          }, 3000)
          return 100
        }
        return prev + 5
      })
    }, 100)

    if (onAddLiquidity) {
      onAddLiquidity(token1Amount, token2Amount)
    }
  }

  const handleRemoveLiquidity = () => {
    setErrorMessage("")
    setStatus("pending")
    setProgress(0)

    // Simulate transaction process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus("success")
          setTimeout(() => {
            setStatus("idle")
          }, 3000)
          return 100
        }
        return prev + 5
      })
    }, 100)

    if (onRemoveLiquidity) {
      onRemoveLiquidity(removePercentage)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Manage Liquidity</CardTitle>
          <div className="flex -space-x-2">
            <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white bg-white z-10">
              <img src={token1Logo || "/placeholder.svg"} alt={token1} className="object-cover" />
            </div>
            <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white bg-white">
              <img src={token2Logo || "/placeholder.svg"} alt={token2} className="object-cover" />
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{poolName}</p>
      </CardHeader>
      <CardContent>
        <Tabs value={action} onValueChange={(value) => setAction(value as "add" | "remove")} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </TabsTrigger>
            <TabsTrigger value="remove" className="flex items-center gap-1">
              <Minus className="h-4 w-4" />
              <span>Remove</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {action === "add" ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <Label>Amount of {token1}</Label>
                <div className="text-sm text-gray-500">Balance: {balances[token1 as keyof typeof balances]}</div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="0.0"
                    className="pr-16 text-lg"
                    value={token1Amount}
                    onChange={handleToken1AmountChange}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-[#4f1964]"
                    onClick={handleMaxToken1}
                  >
                    MAX
                  </Button>
                </div>
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                  <img src={token1Logo || "/placeholder.svg"} alt={token1} className="object-cover" />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <Label>Amount of {token2}</Label>
                <div className="text-sm text-gray-500">Balance: {balances[token2 as keyof typeof balances]}</div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="0.0"
                    className="pr-16 text-lg"
                    value={token2Amount}
                    onChange={handleToken2AmountChange}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-[#4f1964]"
                    onClick={handleMaxToken2}
                  >
                    MAX
                  </Button>
                </div>
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                  <img src={token2Logo || "/placeholder.svg"} alt={token2} className="object-cover" />
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Exchange Rate</span>
                <span>
                  1 {token1} = 0.8 {token2}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Share of Pool</span>
                <span>0.42%</span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-[#4f1964] to-[#6b21a8] hover:from-[#6b21a8] hover:to-[#4f1964] h-12 text-lg"
              onClick={handleAddLiquidity}
              disabled={status === "pending" || !token1Amount || !token2Amount}
            >
              {status === "pending" ? "Adding Liquidity..." : "Add Liquidity"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Your Liquidity Position</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Value:</span>
                  <span className="font-medium">{poolStats.myLiquidity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pool Share:</span>
                  <span className="font-medium">{poolStats.myShare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{token1}:</span>
                  <span className="font-medium">{poolStats.token1Amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{token2}:</span>
                  <span className="font-medium">{poolStats.token2Amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">APR:</span>
                  <span className="font-medium text-green-600">{poolStats.apr}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Amount to Remove</Label>
              <div className="flex justify-between gap-2">
                <Button
                  variant={removePercentage === 25 ? "default" : "outline"}
                  className={removePercentage === 25 ? "bg-[#4f1964]" : ""}
                  onClick={() => setRemovePercentage(25)}
                >
                  25%
                </Button>
                <Button
                  variant={removePercentage === 50 ? "default" : "outline"}
                  className={removePercentage === 50 ? "bg-[#4f1964]" : ""}
                  onClick={() => setRemovePercentage(50)}
                >
                  50%
                </Button>
                <Button
                  variant={removePercentage === 75 ? "default" : "outline"}
                  className={removePercentage === 75 ? "bg-[#4f1964]" : ""}
                  onClick={() => setRemovePercentage(75)}
                >
                  75%
                </Button>
                <Button
                  variant={removePercentage === 100 ? "default" : "outline"}
                  className={removePercentage === 100 ? "bg-[#4f1964]" : ""}
                  onClick={() => setRemovePercentage(100)}
                >
                  Max
                </Button>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{removePercentage}%</span>
                </div>
                <motion.div
                  initial={{ width: "50%" }}
                  animate={{ width: `${removePercentage}%` }}
                  className="h-2 bg-[#4f1964] rounded-full"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">You Will Receive:</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <div className="relative h-5 w-5 rounded-full overflow-hidden">
                    <img src={token1Logo || "/placeholder.svg"} alt={token1} className="object-cover" />
                  </div>
                  {token1}:
                </span>
                <span className="font-medium">
                  {((Number.parseFloat(poolStats.token1Amount.replace(/,/g, "")) * removePercentage) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <div className="relative h-5 w-5 rounded-full overflow-hidden">
                    <img src={token2Logo || "/placeholder.svg"} alt={token2} className="object-cover" />
                  </div>
                  {token2}:
                </span>
                <span className="font-medium">
                  {((Number.parseFloat(poolStats.token2Amount.replace(/,/g, "")) * removePercentage) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-[#4f1964] to-[#6b21a8] hover:from-[#6b21a8] hover:to-[#4f1964] h-12 text-lg"
              onClick={handleRemoveLiquidity}
              disabled={status === "pending"}
            >
              {status === "pending" ? "Removing Liquidity..." : "Remove Liquidity"}
            </Button>
          </div>
        )}

        {status === "pending" && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing transaction...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {status === "success" && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-800">
                {action === "add" ? "Liquidity added successfully!" : "Liquidity removed successfully!"}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mt-4 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
