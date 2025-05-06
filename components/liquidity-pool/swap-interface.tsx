"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDownUp, Settings, Info, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SwapInterfaceProps {
  onSwap?: (fromToken: string, toToken: string, amount: string) => void
}

export default function SwapInterface({ onSwap }: SwapInterfaceProps) {
  const [fromToken, setFromToken] = useState("YGT")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [showSettings, setShowSettings] = useState(false)
  const [swapStatus, setSwapStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [priceImpact, setPriceImpact] = useState("0.12")

  // Token balances
  const balances = {
    YGT: "1,245.00",
    USDC: "2,500.00",
    ETH: "1.25",
    WBTC: "0.05",
  }

  // Token prices in USD
  const prices = {
    YGT: 1.24,
    USDC: 1.0,
    ETH: 3500,
    WBTC: 65000,
  }

  // Calculate exchange rate
  const getExchangeRate = (from: string, to: string) => {
    return prices[from as keyof typeof prices] / prices[to as keyof typeof prices]
  }

  useEffect(() => {
    if (fromAmount && !isNaN(Number.parseFloat(fromAmount))) {
      const rate = getExchangeRate(fromToken, toToken)
      const calculatedAmount = (Number.parseFloat(fromAmount) * rate).toFixed(6)
      setToAmount(calculatedAmount)

      // Calculate price impact based on amount
      const impact = (Number.parseFloat(fromAmount) * 0.0001).toFixed(2)
      setPriceImpact(impact)
    } else {
      setToAmount("")
      setPriceImpact("0.00")
    }
  }, [fromAmount, fromToken, toToken])

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value)
    }
  }

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setToAmount(value)

      // Calculate from amount based on to amount
      if (value && !isNaN(Number.parseFloat(value))) {
        const rate = getExchangeRate(toToken, fromToken)
        const calculatedAmount = (Number.parseFloat(value) * rate).toFixed(6)
        setFromAmount(calculatedAmount)

        // Calculate price impact based on amount
        const impact = (Number.parseFloat(calculatedAmount) * 0.0001).toFixed(2)
        setPriceImpact(impact)
      } else {
        setFromAmount("")
        setPriceImpact("0.00")
      }
    }
  }

  const switchTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSwap = () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      setErrorMessage("Please enter a valid amount")
      return
    }

    setErrorMessage("")
    setSwapStatus("pending")
    setProgress(0)

    // Simulate transaction process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setSwapStatus("success")
          setTimeout(() => {
            setSwapStatus("idle")
            setFromAmount("")
            setToAmount("")
          }, 3000)
          return 100
        }
        return prev + 5
      })
    }, 100)

    if (onSwap) {
      onSwap(fromToken, toToken, fromAmount)
    }
  }

  const handleMaxClick = () => {
    const balance = balances[fromToken as keyof typeof balances]
    if (balance) {
      setFromAmount(balance.replace(/,/g, ""))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Swap Tokens</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Transaction Settings</h3>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="slippage" className="flex items-center gap-1">
                        Slippage Tolerance
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3.5 w-3.5 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Your transaction will revert if the price changes unfavorably by more than this
                                percentage.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Button
                          variant={slippage === "0.1" ? "default" : "outline"}
                          size="sm"
                          className={slippage === "0.1" ? "bg-[#4f1964]" : ""}
                          onClick={() => setSlippage("0.1")}
                        >
                          0.1%
                        </Button>
                        <Button
                          variant={slippage === "0.5" ? "default" : "outline"}
                          size="sm"
                          className={slippage === "0.5" ? "bg-[#4f1964]" : ""}
                          onClick={() => setSlippage("0.5")}
                        >
                          0.5%
                        </Button>
                        <Button
                          variant={slippage === "1.0" ? "default" : "outline"}
                          size="sm"
                          className={slippage === "1.0" ? "bg-[#4f1964]" : ""}
                          onClick={() => setSlippage("1.0")}
                        >
                          1.0%
                        </Button>
                        <Input
                          id="slippage"
                          value={slippage}
                          onChange={(e) => setSlippage(e.target.value)}
                          className="h-9 w-20"
                        />
                        <span className="flex items-center">%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <Label>From</Label>
              <div className="text-sm text-gray-500">Balance: {balances[fromToken as keyof typeof balances]}</div>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="0.0"
                  className="pr-16 text-lg"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-[#4f1964]"
                  onClick={handleMaxClick}
                >
                  MAX
                </Button>
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 min-w-[100px]"
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
              >
                <option value="YGT">YGT</option>
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
                <option value="WBTC">WBTC</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-dashed"
              onClick={switchTokens}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <Label>To</Label>
              <div className="text-sm text-gray-500">Balance: {balances[toToken as keyof typeof balances]}</div>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="0.0"
                className="flex-1 text-lg"
                value={toAmount}
                onChange={handleToAmountChange}
              />
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 min-w-[100px]"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
              >
                <option value="USDC">USDC</option>
                <option value="YGT">YGT</option>
                <option value="ETH">ETH</option>
                <option value="WBTC">WBTC</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Exchange Rate</span>
              <span>
                1 {fromToken} = {getExchangeRate(fromToken, toToken).toFixed(6)} {toToken}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Price Impact</span>
              <span className={Number.parseFloat(priceImpact) > 1 ? "text-red-500" : "text-green-500"}>
                {priceImpact}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-[#4f1964] to-[#6b21a8] hover:from-[#6b21a8] hover:to-[#4f1964] h-12 text-lg"
            onClick={handleSwap}
            disabled={swapStatus === "pending" || !fromAmount || Number.parseFloat(fromAmount) <= 0}
          >
            {swapStatus === "pending" ? "Swapping..." : "Swap"}
          </Button>

          {swapStatus === "pending" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing transaction...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {swapStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-500" />
                <AlertDescription className="text-green-800">Swap completed successfully!</AlertDescription>
              </div>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
