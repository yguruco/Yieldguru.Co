"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, X, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

export default function CreateLoanPage() {
  const router = useRouter()
  const [loanAmount, setLoanAmount] = useState("")
  const [operatorName, setOperatorName] = useState("")
  const [operatorAddress, setOperatorAddress] = useState("")
  const [repaymentAmount, setRepaymentAmount] = useState("")
  const [adminAddress, setAdminAddress] = useState("")
  const [durationMonths, setDurationMonths] = useState("")
  const [monthlyInterest, setMonthlyInterest] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [createComplete, setCreateComplete] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")
  const [error, setError] = useState("")

  // For image upload
  const [loanImage, setLoanImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate repayment amount when loan amount, duration, or interest rate changes
  useEffect(() => {
    if (loanAmount && durationMonths && monthlyInterest) {
      const principal = Number(loanAmount);
      const months = Number(durationMonths);
      const rate = Number(monthlyInterest) / 100; // Convert percentage to decimal
      
      // Simple interest calculation: P(1 + rt) where r is monthly rate and t is duration in months
      const totalAmount = principal * (1 + (rate * months));
      setRepaymentAmount(totalAmount.toFixed(2));
    }
  }, [loanAmount, durationMonths, monthlyInterest]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        setLoanImage(reader.result.toString())
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setLoanImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCreateLoan = async () => {
    // Validate inputs
    if (!loanAmount || !operatorName || !operatorAddress || !repaymentAmount || !adminAddress || !durationMonths || !monthlyInterest) {
      setError("Please fill in all required fields")
      return
    }

    // Set a default image if none is provided
    if (!loanImage) {
      setLoanImage("/images/ford-vehicle.jpeg")
    }

    setError("")
    setIsProcessing(true)
    setProcessProgress(0)

    try {
      // Simulate loan creation process with progress
      const totalSteps = 5
      const stepLabels = [
        "Validating loan information",
        "Preparing smart contract",
        "Initializing loan",
        "Setting up repayment schedule",
        "Finalizing on blockchain",
      ]

      for (let i = 1; i <= totalSteps; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProcessProgress((i / totalSteps) * 100)
      }

      // Generate a random transaction hash
      const hash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")
      setTransactionHash(hash)
      setCreateComplete(true)

      // Create loan object for storage
      const newLoan = {
        id: `LOAN-${Date.now().toString(36)}`,
        name: `EV Loan - ${operatorName}`,
        image: loanImage,
        operator: operatorName,
        borrower: operatorAddress,
        adminAddress: adminAddress,
        amount: Number(loanAmount),
        repaymentAmount: Number(repaymentAmount),
        monthlyInterest: Number(monthlyInterest),
        duration: Number(durationMonths),
        createdAt: new Date().toISOString(),
        status: "Active",
        transactionHash: hash
      }

      // Store in localStorage
      const existingLoans = JSON.parse(localStorage.getItem("adminLoans") || "[]")
      localStorage.setItem("adminLoans", JSON.stringify([newLoan, ...existingLoans]))

      // Wait a bit before completing
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (err) {
      console.error("Loan creation error:", err)
      setError("An error occurred during loan creation. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setLoanAmount("")
    setOperatorName("")
    setOperatorAddress("")
    setRepaymentAmount("")
    setAdminAddress("")
    setDurationMonths("")
    setMonthlyInterest("")
    setLoanImage(null)
    setCreateComplete(false)
    setTransactionHash("")
    setError("")
  }

  const viewAssets = () => {
    router.push("/dashboard/admin/assets")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create EV Loan</h1>
        <p className="text-muted-foreground">Create a new tokenized EV loan on the platform</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {createComplete ? (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Loan Created Successfully</AlertTitle>
                  <AlertDescription className="text-green-700">
                    The EV loan has been successfully created and is now available on the platform.
                  </AlertDescription>
                </Alert>

                <div className="rounded-md border p-4 space-y-3">
                  <h3 className="font-medium mb-2">Loan Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Operator:</div>
                    <div>{operatorName}</div>
                    
                    <div className="font-medium">Loan Amount:</div>
                    <div>${Number(loanAmount).toLocaleString()}</div>

                    <div className="font-medium">Monthly Interest:</div>
                    <div>{monthlyInterest}%</div>
                    
                    <div className="font-medium">Duration:</div>
                    <div>{durationMonths} months</div>

                    <div className="font-medium">Repayment Amount:</div>
                    <div>${Number(repaymentAmount).toLocaleString()}</div>

                    <div className="font-medium">Transaction Hash:</div>
                    <div className="break-all font-mono text-xs">{transactionHash}</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={resetForm} className="flex-1 bg-[#4f1964] hover:bg-[#4f1964]/90">
                    Create Another Loan
                  </Button>
                  <Button
                    onClick={viewAssets}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    View All Loans
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
                {/* Left column - Form fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="operator-name">Operator Name</Label>
                    <Input
                      id="operator-name"
                      placeholder="Enter operator name"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount">Loan Amount ($)</Label>
                    <Input
                      id="loan-amount"
                      placeholder="Enter loan amount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operator-address">Operator Address</Label>
                    <Input
                      id="operator-address"
                      placeholder="Enter operator wallet address"
                      value={operatorAddress}
                      onChange={(e) => setOperatorAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-address">Admin Address</Label>
                    <Input
                      id="admin-address"
                      placeholder="Enter admin wallet address"
                      value={adminAddress}
                      onChange={(e) => setAdminAddress(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (months)</Label>
                      <Input
                        id="duration"
                        placeholder="Enter months"
                        type="number"
                        value={durationMonths}
                        onChange={(e) => setDurationMonths(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="interest">Monthly Interest (%)</Label>
                      <Input
                        id="interest"
                        placeholder="Interest rate"
                        type="number"
                        step="0.01"
                        value={monthlyInterest}
                        onChange={(e) => setMonthlyInterest(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="repayment-amount">Repayment Amount ($)</Label>
                    <Input
                      id="repayment-amount"
                      placeholder="Calculated automatically"
                      type="number"
                      value={repaymentAmount}
                      onChange={(e) => setRepaymentAmount(e.target.value)}
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      This field is calculated automatically based on loan amount, duration, and interest rate
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Loan Image</Label>
                    <div className="border-2 border-dashed rounded-md p-4">
                      {loanImage ? (
                        <div className="relative">
                          <Image
                            src={loanImage || "/placeholder.svg"}
                            alt="Loan preview"
                            width={300}
                            height={200}
                            className="w-full h-auto rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                          <Camera className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Upload an image for the loan</p>
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="max-w-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right column - Preview with 3D motion */}
                <div>
                  <Label className="block mb-2">Loan Preview</Label>
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                  >
                    <motion.div
                      whileHover={{ rotateY: 5, rotateX: -5 }}
                      whileTap={{ rotateY: 0, rotateX: 0 }}
                      className="h-full"
                    >
                      <Card className="overflow-hidden h-full shadow-lg">
                        <div className="w-full h-[180px] relative">
                          {loanImage ? (
                            <Image src={loanImage} alt="Loan" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Camera className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50" />
                          <div className="absolute top-4 right-4">
                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                              EV Loan
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="text-xl font-bold mb-2">{operatorName || "Loan"} Summary</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Amount:</span>
                              <span className="font-medium">${loanAmount ? Number(loanAmount).toLocaleString() : "0"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Interest Rate:</span>
                              <span className="font-medium">{monthlyInterest || "0"}% monthly</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Duration:</span>
                              <span className="font-medium">{durationMonths || "0"} months</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Repayment:</span>
                              <span className="font-medium">${repaymentAmount ? Number(repaymentAmount).toLocaleString() : "0"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Total Interest:</span>
                              <span className="font-medium text-green-600">
                                {loanAmount && repaymentAmount
                                  ? `$${(Number(repaymentAmount) - Number(loanAmount)).toLocaleString()}`
                                  : "$0"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Operator:</p>
                            <p className="text-xs font-medium truncate">
                              {operatorName || "Not specified"}
                            </p>
                            <p className="text-xs font-mono truncate mt-1">
                              {operatorAddress ? `${operatorAddress.slice(0, 10)}...${operatorAddress.slice(-6)}` : ""}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>

                  <div className="mt-6">
                    {isProcessing ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Creating loan...</span>
                          <span>{Math.round(processProgress)}%</span>
                        </div>
                        <Progress value={processProgress} className="h-2" />
                      </div>
                    ) : (
                      <Button
                        onClick={handleCreateLoan}
                        className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90"
                        disabled={isProcessing}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Create EV Loan
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 