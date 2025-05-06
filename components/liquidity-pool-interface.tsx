"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Check, AlertTriangle } from "lucide-react"

export default function LiquidityPoolInterface() {
  const [activeTab, setActiveTab] = useState("pool")
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState("")
  const [txPending, setTxPending] = useState(false)
  const [txSuccess, setTxSuccess] = useState(false)
  const [txProgress, setTxProgress] = useState(0)

  // Pool data
  const [poolLiquidity, setPoolLiquidity] = useState("1,245,000")
  const [currentPrice, setCurrentPrice] = useState("1.24")
  const [currentTick, setCurrentTick] = useState("12450")
  const [swapFee, setSwapFee] = useState("0.3")
  const [ygtBalance, setYgtBalance] = useState("850,000")
  const [usdcBalance, setUsdcBalance] = useState("1,054,000")
  const [volume24h, setVolume24h] = useState("124,500")
  const [tvl, setTvl] = useState("2,345,000")

  // Swap states
  const [swapAmount, setSwapAmount] = useState("")
  const [swapFromToken, setSwapFromToken] = useState("YGT")
  const [swapToToken, setSwapToToken] = useState("USDC")
  const [swapToAmount, setSwapToAmount] = useState("0.0")

  // Liquidity states
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(true)
  const [tokenAAmount, setTokenAAmount] = useState("")
  const [tokenBAmount, setTokenBAmount] = useState("")
  const [tokenA, setTokenA] = useState("YGT")
  const [tokenB, setTokenB] = useState("USDC")

  // Admin states
  const [initPrice, setInitPrice] = useState("")
  const [feeRecipient, setFeeRecipient] = useState("")
  const [feeAmount, setFeeAmount] = useState("")

  const connectWallet = () => {
    setTxPending(true)
    setTxProgress(0)

    // Simulate connection process
    const interval = setInterval(() => {
      setTxProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTxPending(false)
          setIsConnected(true)
          setTxSuccess(true)
          setTimeout(() => setTxSuccess(false), 3000)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const executeSwap = () => {
    if (!swapAmount) {
      setError("Please enter an amount to swap")
      return
    }

    setError("")
    setTxPending(true)
    setTxProgress(0)

    // Simulate swap process
    const interval = setInterval(() => {
      setTxProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTxPending(false)
          setTxSuccess(true)
          setTimeout(() => setTxSuccess(false), 3000)
          setSwapAmount("")
          setSwapToAmount("0.0")
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const handleSwapAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSwapAmount(value)

    // Calculate the to amount based on the exchange rate
    if (value && !isNaN(Number.parseFloat(value))) {
      const rate = swapFromToken === "YGT" ? 1.24 : 0.806
      setSwapToAmount((Number.parseFloat(value) * rate).toFixed(2))
    } else {
      setSwapToAmount("0.0")
    }
  }

  const handleAddLiquidity = () => {
    if (!tokenAAmount || !tokenBAmount) {
      setError("Please enter amounts for both tokens")
      return
    }

    setError("")
    setTxPending(true)
    setTxProgress(0)

    // Simulate liquidity addition process
    const interval = setInterval(() => {
      setTxProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTxPending(false)
          setTxSuccess(true)
          setTimeout(() => setTxSuccess(false), 3000)
          setTokenAAmount("")
          setTokenBAmount("")
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const executeAdminFunction = (functionName: string) => {
    setError("")
    setTxPending(true)
    setTxProgress(0)

    // Simulate admin function execution
    const interval = setInterval(() => {
      setTxProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTxPending(false)
          setTxSuccess(true)
          setTimeout(() => setTxSuccess(false), 3000)
          return 100
        }
        return prev + 10
      })
    }, 150)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liquidity Pool</CardTitle>
        <CardDescription>Manage asset liquidity and blockchain integration</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pool">Pool Overview</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="liquidity">Add Liquidity</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="pool" className="space-y-4 pt-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Pool Data</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2">
                    <strong>Pool Liquidity:</strong> {poolLiquidity} YGT
                  </div>
                  <div className="mb-2">
                    <strong>Current Price:</strong> {currentPrice} USDC/YGT
                  </div>
                  <div className="mb-2">
                    <strong>Current Tick:</strong> {currentTick}
                  </div>
                  <div className="mb-2">
                    <strong>Swap Fee:</strong> {swapFee}%
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <strong>YGT Balance:</strong> {ygtBalance}
                  </div>
                  <div className="mb-2">
                    <strong>USDC Balance:</strong> {usdcBalance}
                  </div>
                  <div className="mb-2">
                    <strong>24h Volume:</strong> ${volume24h}
                  </div>
                  <div className="mb-2">
                    <strong>TVL:</strong> ${tvl}
                  </div>
                </div>
              </div>
            </div>

            {!isConnected ? (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div>
                  <h3 className="font-medium text-blue-800">Connect Your Wallet</h3>
                  <p className="text-sm text-blue-600">Connect your wallet to interact with the liquidity pool</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={connectWallet} disabled={txPending}>
                  {txPending ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                <div>
                  <h3 className="font-medium text-green-800">Wallet Connected</h3>
                  <p className="text-sm text-green-600">0x7F5E...8A4D</p>
                </div>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-700"
                  onClick={() => setIsConnected(false)}
                >
                  Disconnect
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="swap" className="space-y-4 pt-4">
            <div className="p-6 border rounded-md">
              <h3 className="text-lg font-semibold mb-4">Swap Tokens</h3>

              <div className="space-y-4">
                <div className="p-4 bg-white border rounded-md">
                  <div className="flex justify-between mb-2">
                    <Label>From</Label>
                    <span className="text-sm text-gray-500">Balance: 1,000 {swapFromToken}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="0.0"
                      className="text-lg"
                      value={swapAmount}
                      onChange={handleSwapAmountChange}
                    />
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={swapFromToken}
                      onChange={(e) => {
                        setSwapFromToken(e.target.value)
                        setSwapToToken(e.target.value === "YGT" ? "USDC" : "YGT")
                        if (swapAmount) {
                          const rate = e.target.value === "YGT" ? 1.24 : 0.806
                          setSwapToAmount((Number.parseFloat(swapAmount) * rate).toFixed(2))
                        }
                      }}
                    >
                      <option>YGT</option>
                      <option>USDC</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => {
                      const tempToken = swapFromToken
                      setSwapFromToken(swapToToken)
                      setSwapToToken(tempToken)

                      if (swapAmount) {
                        setSwapAmount(swapToAmount)
                        const rate = swapToToken === "YGT" ? 1.24 : 0.806
                        setSwapToAmount((Number.parseFloat(swapAmount) * rate).toFixed(2))
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-down-up"
                    >
                      <path d="m3 16 4 4 4-4" />
                      <path d="M7 20V4" />
                      <path d="m21 8-4-4-4 4" />
                      <path d="M17 4v16" />
                    </svg>
                  </Button>
                </div>

                <div className="p-4 bg-white border rounded-md">
                  <div className="flex justify-between mb-2">
                    <Label>To</Label>
                    <span className="text-sm text-gray-500">Balance: 500 {swapToToken}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0.0" className="text-lg" readOnly value={swapToAmount} />
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={swapToToken}
                      disabled
                    >
                      <option>USDC</option>
                      <option>YGT</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Exchange Rate</span>
                    <span>1 YGT = 1.24 USDC</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Fee</span>
                    <span>0.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Slippage Tolerance</span>
                    <span>0.5%</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90"
                  onClick={executeSwap}
                  disabled={!isConnected || txPending || !swapAmount}
                >
                  {!isConnected ? "Connect Wallet to Swap" : txPending ? "Swapping..." : "Swap"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="liquidity" className="space-y-4 pt-4">
            <div className="p-6 border rounded-md">
              <h3 className="text-lg font-semibold mb-4">Add Liquidity</h3>

              <div className="space-y-4">
                <div className="flex space-x-2 mb-4">
                  <Button
                    className={`flex-1 ${isAddingLiquidity ? "bg-[#4f1964]" : "bg-gray-300"}`}
                    onClick={() => setIsAddingLiquidity(true)}
                  >
                    Add Liquidity
                  </Button>
                  <Button
                    variant={isAddingLiquidity ? "outline" : "default"}
                    className={`flex-1 ${!isAddingLiquidity ? "bg-[#4f1964]" : ""}`}
                    onClick={() => setIsAddingLiquidity(false)}
                  >
                    Remove Liquidity
                  </Button>
                </div>

                <div className="p-4 bg-white border rounded-md">
                  <div className="flex justify-between mb-2">
                    <Label>Token A</Label>
                    <span className="text-sm text-gray-500">Balance: 1,000 {tokenA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="0.0"
                      className="text-lg"
                      value={tokenAAmount}
                      onChange={(e) => setTokenAAmount(e.target.value)}
                    />
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={tokenA}
                      onChange={(e) => {
                        setTokenA(e.target.value)
                        setTokenB(e.target.value === "YGT" ? "USDC" : "YGT")
                      }}
                    >
                      <option>YGT</option>
                      <option>USDC</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">+</span>
                </div>

                <div className="p-4 bg-white border rounded-md">
                  <div className="flex justify-between mb-2">
                    <Label>Token B</Label>
                    <span className="text-sm text-gray-500">Balance: 500 {tokenB}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="0.0"
                      className="text-lg"
                      value={tokenBAmount}
                      onChange={(e) => setTokenBAmount(e.target.value)}
                    />
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={tokenB}
                      onChange={(e) => {
                        setTokenB(e.target.value)
                        setTokenA(e.target.value === "YGT" ? "USDC" : "YGT")
                      }}
                    >
                      <option>USDC</option>
                      <option>YGT</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Price and Pool Share</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-500 text-sm">YGT per USDC</p>
                      <p className="font-medium">0.806</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">USDC per YGT</p>
                      <p className="font-medium">1.24</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Share of Pool</p>
                      <p className="font-medium">0.3%</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90"
                  onClick={handleAddLiquidity}
                  disabled={!isConnected || txPending || !tokenAAmount || !tokenBAmount}
                >
                  {!isConnected
                    ? "Connect Wallet"
                    : txPending
                      ? "Processing..."
                      : `${isAddingLiquidity ? "Add" : "Remove"} Liquidity`}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4 pt-4">
            <div className="p-6 border rounded-md">
              <h3 className="text-lg font-semibold mb-4">Admin Functions</h3>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-3">Initialize Pool</h4>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Initial sqrtPriceX96"
                      className="flex-grow"
                      value={initPrice}
                      onChange={(e) => setInitPrice(e.target.value)}
                    />
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => executeAdminFunction("initialize")}
                      disabled={!isConnected || txPending || !initPrice}
                    >
                      Initialize
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-3">Protocol Fees</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="fee-recipient">Recipient Address</Label>
                      <Input
                        id="fee-recipient"
                        type="text"
                        placeholder="0x..."
                        className="mt-1"
                        value={feeRecipient}
                        onChange={(e) => setFeeRecipient(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fee-amount">Amount</Label>
                      <Input
                        id="fee-amount"
                        type="number"
                        placeholder="0.0"
                        className="mt-1"
                        value={feeAmount}
                        onChange={(e) => setFeeAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90"
                    onClick={() => executeAdminFunction("collectFees")}
                    disabled={!isConnected || txPending || !feeRecipient || !feeAmount}
                  >
                    Collect Protocol Fees
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => executeAdminFunction("settle")}
                    disabled={!isConnected || txPending}
                  >
                    Execute Settle
                  </Button>
                  <Button
                    className="bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => executeAdminFunction("clear")}
                    disabled={!isConnected || txPending}
                  >
                    Clear Currency
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Status and Errors */}
        {txPending && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Transaction in progress...</span>
              <span>{Math.round(txProgress)}%</span>
            </div>
            <Progress value={txProgress} className="h-2" />
          </div>
        )}

        {txSuccess && (
          <Alert className="mt-4 bg-green-50 border-green-300">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">Transaction successfully completed!</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mt-4 bg-red-50 border-red-300" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
