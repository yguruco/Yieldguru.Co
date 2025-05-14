"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, X, Shield, Info, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { ApplicationLookup } from "@/components/rfl/application-lookup"
import type { RFLSubmission } from "@/types/rfl"

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
  const [activeTab, setActiveTab] = useState("manual")
  const [loadingApplication, setLoadingApplication] = useState(false)

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
        image: loanImage || null,  // Use null if no image provided
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

  const handleApplicationFound = (application: RFLSubmission) => {
    setLoadingApplication(true)
    
    // Simulate loading delay
    setTimeout(() => {
      // Populate the form with application data
      setOperatorName(application.applicantDetails.name)
      setOperatorAddress(application.applicantDetails.walletAddress)
      setLoanAmount(application.applicantDetails.totalFinancingRequested)
      
      // Set a default admin address if empty
      if (!adminAddress) {
        setAdminAddress("0x7a95eA21F1A21b14a2E26Da855Ab435D5E1E3C39")
      }
      
      // Set default duration and interest if empty
      if (!durationMonths) {
        setDurationMonths("12")
      }
      
      if (!monthlyInterest) {
        setMonthlyInterest("1.5")
      }
      
      // Set the facial scan as loan image if available
      if (application.facialScanData) {
        setLoanImage(application.facialScanData)
      }
      
      // Switch to manual tab after loading
      setActiveTab("manual")
      setLoadingApplication(false)
    }, 1000)
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
            <CardDescription>
              Create a new loan manually or by using existing RFL application data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loadingApplication && (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-[#f68b27] mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading application data...</p>
                </div>
              </div>
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
                    
                    {loanImage && (
                      <>
                        <div className="font-medium">Vehicle Image:</div>
                        <div>
                          <Image 
                            src={loanImage} 
                            alt="Vehicle image" 
                            width={100} 
                            height={80} 
                            className="object-cover rounded-md" 
                          />
                        </div>
                      </>
                    )}
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
              <div>
                {!loadingApplication && (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                      <TabsTrigger value="application">Use RFL Application</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="application" className="mt-6">
                      <div className="space-y-4">
                        <Alert className="bg-blue-50 border-blue-200">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-700">
                            Enter an RFL application ID to automatically populate the loan form with the applicant's details.
                          </AlertDescription>
                        </Alert>
                        <ApplicationLookup onApplicationFound={handleApplicationFound} />
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
                
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
                  </div>

                  {/* Right column - More fields & image */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (Months)</Label>
                      <Input
                        id="duration"
                        placeholder="Enter loan duration"
                        type="number"
                        value={durationMonths}
                        onChange={(e) => setDurationMonths(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest">Monthly Interest Rate (%)</Label>
                      <Input
                        id="interest"
                        placeholder="Enter monthly interest rate"
                        type="number"
                        step="0.01"
                        value={monthlyInterest}
                        onChange={(e) => setMonthlyInterest(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="repayment">Total Repayment Amount</Label>
                      <Input
                        id="repayment"
                        placeholder="Will be calculated automatically"
                        value={repaymentAmount ? `$${Number(repaymentAmount).toLocaleString()}` : ""}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Vehicle Image (Optional)</Label>
                      <div className="flex justify-center p-4 border-2 border-dashed rounded-md">
                        {loanImage ? (
                          <div className="relative">
                            <Image
                              src={loanImage}
                              alt="Vehicle image"
                              width={200}
                              height={150}
                              className="object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Camera className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-2 flex flex-col items-center">
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                              >
                                <span>Upload an image (optional)</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                  accept="image/*"
                                />
                              </label>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isProcessing ? (
                  <div className="mt-8 space-y-4">
                    <Progress value={processProgress} className="w-full" />
                    <p className="text-center text-sm text-muted-foreground">
                      Creating loan... ({Math.round(processProgress)}% complete)
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 flex justify-center">
                    <Button className="w-1/2 bg-[#f68b27] hover:bg-[#f68b27]/90" onClick={handleCreateLoan}>
                      Create Loan
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 