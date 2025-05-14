"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Shield, Camera, X, Download, ChevronDown } from "lucide-react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { v4 as uuidv4 } from "uuid"
import { WalletComponents } from "../../../../components/onchainKit/wallet"
import { MintNFT } from "@/components/AdminNFT"
import LoanComponent from "@/components/LoanComponent"
import { Check } from "lucide-react"

interface MarketplaceAsset {
  id: string
  name: string
  image: string
  operator: string
  value: number
  yield: number
  available: number
  minInvestment: number
  type: string
  location: string
  listingDate: string
}

export default function TokenizePage() {
  const [amount, setAmount] = useState("")
  const [borrowerAddress, setBorrowerAddress] = useState("")
  const [repaymentAmount, setRepaymentAmount] = useState("")
  const [adminAddress, setAdminAddress] = useState("")
  const [isTokenizing, setIsTokenizing] = useState(false)
  const [tokenizationProgress, setTokenizationProgress] = useState(0)
  const [tokenizationComplete, setTokenizationComplete] = useState(false)
  const [tokenizationHash, setTokenizationHash] = useState("")
  const [error, setError] = useState("")

  // For image upload
  const [assetImage, setAssetImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // For 3D card rotation
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  const [downloadFormat, setDownloadFormat] = useState<string>("text")
  const [showFormatDropdown, setShowFormatDropdown] = useState(false)

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct * 100)
    y.set(yPct * 100)
  }

  const handleCardMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleDownloadCard = () => {
    // Create a simplified version of the asset card for download
    if (!amount || !borrowerAddress || !repaymentAmount || !adminAddress) {
      alert('Please fill in the card details before downloading');
      return;
    }
    
    if (downloadFormat === "text") {
      // Create simple text version of the card data
      const cardData = `
YieldGuru Asset Card
-------------------
Amount: $${Number.parseInt(amount || '0').toLocaleString()}
Borrower Address: ${borrowerAddress}
Repayment Amount: $${Number.parseInt(repaymentAmount || '0').toLocaleString()}
Admin Address: ${adminAddress}
      `.trim();
      
      // Create a data URL for download
      const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cardData);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `loan-card.txt`;
      link.href = dataUrl;
      link.click();
    } else if (downloadFormat === "json") {
      // Create JSON version of the card data
      const cardData = {
        amount: Number.parseInt(amount || '0'),
        borrowerAddress,
        repaymentAmount: Number.parseInt(repaymentAmount || '0'),
        adminAddress,
        imageUrl: assetImage,
        tokenizationDate: new Date().toISOString()
      };
      
      // Create a data URL for download
      const dataUrl = 'data:application/json;charset=utf-8,' + 
                     encodeURIComponent(JSON.stringify(cardData, null, 2));
      
      // Create download link
      const link = document.createElement('a');
      link.download = `loan-card.json`;
      link.href = dataUrl;
      link.click();
    } else if (downloadFormat === "pdf") {
      // Dynamically import jspdf to avoid SSR issues
      import('jspdf').then(({ default: jsPDF }) => {
        const doc = new jsPDF();
        const margin = 20;
        let yPos = margin;
        
        // Add title
        doc.setFontSize(20);
        doc.setTextColor(79, 25, 100); // #4f1964
        doc.text('YieldGuru Loan Card', margin, yPos);
        yPos += 10;
        
        // Add divider
        doc.setDrawColor(79, 25, 100);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, 190, yPos);
        yPos += 15;
        
        // Add content
        doc.setFontSize(12);
        doc.setTextColor(0);
        
        // Helper function to add a field
        const addField = (label: string, value: string) => {
          doc.setFont('helvetica', 'bold');
          doc.text(`${label}:`, margin, yPos);
          doc.setFont('helvetica', 'normal');
          doc.text(value, margin + 50, yPos);
          yPos += 10;
        };
        
        addField('Amount', `$${Number.parseInt(amount || '0').toLocaleString()}`);
        addField('Borrower Address', borrowerAddress);
        addField('Repayment Amount', `$${Number.parseInt(repaymentAmount || '0').toLocaleString()}`);
        addField('Admin Address', adminAddress);
        
        // Save the PDF
        doc.save(`loan-card.pdf`);
      }).catch(err => {
        console.error('Failed to generate PDF:', err);
        alert('Failed to generate PDF. Please try a different format.');
      });
    } else if (downloadFormat === "png" || downloadFormat === "jpeg") {
      // Dynamically import html-to-image to avoid SSR issues
      import('html-to-image').then((htmlToImage) => {
        const cardElement = document.getElementById('assetCard');
        if (!cardElement) {
          alert('Card element not found');
          return;
        }
        
        const method = downloadFormat === 'png' ? htmlToImage.toPng : htmlToImage.toJpeg;
        
        method(cardElement, { quality: 0.95 })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `loan-card.${downloadFormat}`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error('Failed to generate image:', err);
            alert('Failed to generate image. Please try a different format.');
          });
      }).catch(err => {
        console.error('Failed to load html-to-image library:', err);
        alert('Failed to generate image. Please try a different format.');
      });
    }
    
    // Close dropdown after download
    setShowFormatDropdown(false);
  }

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
        setAssetImage(reader.result.toString())
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setAssetImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addAssetToMarketplace = (asset: MarketplaceAsset) => {
    try {
      // Get existing marketplace assets
      const existingAssetsStr = localStorage.getItem("marketplaceAssets")
      const existingAssets: MarketplaceAsset[] = existingAssetsStr ? JSON.parse(existingAssetsStr) : []

      // Add the new asset
      const updatedAssets = [asset, ...existingAssets]

      // Save back to localStorage
      localStorage.setItem("marketplaceAssets", JSON.stringify(updatedAssets))
      return true
    } catch (error) {
      console.error("Error adding asset to marketplace:", error)
      return false
    }
  }

  const addAssetToAdminAssets = (asset: any) => {
    try {
      // Get existing admin assets
      const existingAssetsStr = localStorage.getItem("adminAssets")
      const existingAssets = existingAssetsStr ? JSON.parse(existingAssetsStr) : []

      // Add the new asset
      const updatedAssets = [asset, ...existingAssets]

      // Save back to localStorage
      localStorage.setItem("adminAssets", JSON.stringify(updatedAssets))
      return true
    } catch (error) {
      console.error("Error adding asset to admin assets:", error)
      return false
    }
  }

  const handleTokenize = async () => {
    // Validate inputs
    if (!amount || !borrowerAddress || !repaymentAmount || !adminAddress) {
      setError("Please fill in all required fields")
      return
    }

    // Set a default image if none is provided
    if (!assetImage) {
      setAssetImage("/images/ford-vehicle.jpeg")
    }

    setError("")
    setIsTokenizing(true)
    setTokenizationProgress(0)
    setTokenizationComplete(false)

    try {
      // Simulate tokenization process with progress
      const totalSteps = 5
      const stepLabels = [
        "Validating loan information",
        "Preparing smart contract",
        "Initializing loan",
        "Transferring funds",
        "Finalizing on blockchain",
      ]

      for (let i = 1; i <= totalSteps; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setTokenizationProgress((i / totalSteps) * 100)
      }

      // Generate a random transaction hash
      const hash =
        "0x" +
        Array(64)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")
      setTokenizationHash(hash)
      setTokenizationComplete(true)

      // Create the asset object
      const newAsset: MarketplaceAsset = {
        id: uuidv4().substring(0, 8),
        name: "Loan Agreement",
        image: assetImage || "/images/ford-vehicle.jpeg", // Ensure we have a fallback
        operator: "YieldGuru Admin",
        value: Number.parseInt(amount) || 0,
        yield: (Number.parseInt(repaymentAmount) / Number.parseInt(amount) - 1) * 100,
        available: Number.parseInt(amount) || 0, // Initially all value is available
        minInvestment: Math.floor((Number.parseInt(amount) || 0) * 0.01), // 1% minimum investment
        type: "Loan",
        location: "Yield Platform",
        listingDate: new Date().toISOString().split("T")[0],
      }

      // Add to marketplace and admin assets
      const marketplaceSuccess = addAssetToMarketplace(newAsset)
      const adminSuccess = addAssetToAdminAssets({
        ...newAsset,
        tokenizationHash: hash,
        tokenizationDate: new Date().toISOString(),
        tokenization: 100, // Start with 100% tokenization
        status: "Active",
      })

      if (!marketplaceSuccess || !adminSuccess) {
        throw new Error("Failed to save asset data")
      }

      // Wait a bit before attempting to redirect
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (err) {
      console.error("Tokenization error:", err)
      setError("An error occurred during tokenization. Please try again.")
    } finally {
      setIsTokenizing(false)
    }
  }

  const resetForm = () => {
    setAmount("")
    setBorrowerAddress("")
    setRepaymentAmount("")
    setAdminAddress("")
    setAssetImage(null)
    setTokenizationComplete(false)
    setTokenizationHash("")
    setError("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tokenize EV Loans</h1>
          <p className="text-muted-foreground">Create new tokenized EV loans on the platform</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual EV Loan Tokenization</CardTitle>
          <CardDescription>Enter the details of the EV loan you want to tokenize</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {tokenizationComplete ? (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Tokenization Complete</AlertTitle>
                <AlertDescription className="text-green-700">
                  The asset has been successfully tokenized and is now available on the platform.
                </AlertDescription>
              </Alert>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Tokenization Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Amount:</div>
                  <div>${Number.parseInt(amount).toLocaleString()}</div>

                  <div className="font-medium">Repayment Amount:</div>
                  <div>${Number.parseInt(repaymentAmount).toLocaleString()}</div>

                  <div className="font-medium">Transaction Hash:</div>
                  <div className="break-all font-mono text-xs">{tokenizationHash}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={resetForm} className="flex-1 bg-[#4f1964] hover:bg-[#4f1964]/90">
                  Tokenize Another EV Loan
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = "/dashboard/admin/assets"
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  View Assets
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left column - Form fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter loan amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borrower-address">Borrower Address</Label>
                  <Input
                    id="borrower-address"
                    placeholder="Enter borrower wallet address"
                    value={borrowerAddress}
                    onChange={(e) => setBorrowerAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repayment-amount">Repayment Amount</Label>
                  <Input
                    id="repayment-amount"
                    placeholder="Enter repayment amount"
                    type="number"
                    value={repaymentAmount}
                    onChange={(e) => setRepaymentAmount(e.target.value)}
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

                <div className="space-y-2">
                  <Label>Asset Image</Label>
                  <div className="border-2 border-dashed rounded-md p-4">
                    {assetImage ? (
                      <div className="relative">
                        <Image
                          src={assetImage || "/placeholder.svg"}
                          alt="Asset preview"
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
                        <p className="text-sm text-gray-500 mb-2">Upload an image of the asset</p>
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

              {/* Right column - 3D Card Preview */}
              <div>
                <Label className="block mb-2">Asset Preview</Label>
                <motion.div
                  className="perspective-1000 w-full"
                  style={{
                    perspective: 1000,
                  }}
                >
                  <motion.div
                    className="w-full h-[500px] rounded-xl bg-white shadow-xl cursor-pointer relative overflow-hidden"
                    id="assetCard"
                    style={{
                      rotateX,
                      rotateY,
                      transformStyle: "preserve-3d",
                    }}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Card Image */}
                    <div className="w-full h-[250px] relative">
                      {assetImage ? (
                        <Image src={assetImage || "/placeholder.svg"} alt="Asset" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50" />
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                          Loan
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 relative z-10">
                      <h3 className="text-xl font-bold mb-2 truncate">Loan Agreement</h3>
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-bold">
                            ${amount ? Number.parseInt(amount).toLocaleString() : "0"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Repayment</p>
                          <p className="font-bold">
                            ${repaymentAmount ? Number.parseInt(repaymentAmount).toLocaleString() : "0"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Borrower Address:</p>
                        <p className="text-xs font-mono truncate">
                          {borrowerAddress || "0x0000000000000000000000000000000000000000"}
                        </p>
                        <p className="text-xs text-gray-500 mt-3 mb-1">Admin Address:</p>
                        <p className="text-xs font-mono truncate">
                          {adminAddress || "0x0000000000000000000000000000000000000000"}
                        </p>
                      </div>
                    </div>

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0"
                      style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                      }}
                      whileHover={{ opacity: 1 }}
                    />
                  </motion.div>
                </motion.div>

                {/* Download Options */}
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <Button 
                      onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download as {getFormatLabel(downloadFormat)}
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showFormatDropdown ? 'rotate-180' : ''}`} />
                    </Button>
                    
                    {/* Format dropdown */}
                    {showFormatDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <DropdownItem format="text" icon="📄" label="Text File (.txt)" 
                            current={downloadFormat} onClick={setDownloadFormat} />
                          <DropdownItem format="json" icon="🔢" label="JSON Data (.json)" 
                            current={downloadFormat} onClick={setDownloadFormat} />
                          <DropdownItem format="pdf" icon="📑" label="PDF Document (.pdf)" 
                            current={downloadFormat} onClick={setDownloadFormat} />
                          <DropdownItem format="png" icon="🖼️" label="PNG Image (.png)" 
                            current={downloadFormat} onClick={setDownloadFormat} />
                          <DropdownItem format="jpeg" icon="📸" label="JPEG Image (.jpeg)" 
                            current={downloadFormat} onClick={setDownloadFormat} />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {downloadFormat && (
                    <Button 
                      onClick={handleDownloadCard}
                      className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download {getFormatLabel(downloadFormat)}
                    </Button>
                  )}
                </div>

                <div className="mt-6">
                  {isTokenizing ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tokenization in progress...</span>
                        <span>{Math.round(tokenizationProgress)}%</span>
                      </div>
                      <Progress value={tokenizationProgress} className="h-2" />
                    </div>
                  ) : (
                    <Button
                      onClick={handleTokenize}
                      className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90"
                      disabled={isTokenizing}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Tokenize EV Loan
                    </Button>
                  )}
                  <WalletComponents />
                  <MintNFT />
                  <LoanComponent /> 
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Helper components and functions
function DropdownItem({ 
  format, 
  icon, 
  label, 
  current, 
  onClick 
}: { 
  format: string; 
  icon: string; 
  label: string; 
  current: string; 
  onClick: (format: string) => void;
}) {
  return (
    <button
      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
        current === format ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={() => onClick(format)}
    >
      <span className="mr-2">{icon}</span>
      {label}
      {current === format && (
        <Check className="ml-auto h-4 w-4 text-blue-600" />
      )}
    </button>
  );
}

function getFormatLabel(format: string): string {
  switch (format) {
    case 'text': return 'Text File';
    case 'json': return 'JSON Data';
    case 'pdf': return 'PDF Document';
    case 'png': return 'PNG Image';
    case 'jpeg': return 'JPEG Image';
    default: return 'File';
  }
}
