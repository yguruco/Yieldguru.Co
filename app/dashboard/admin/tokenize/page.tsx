"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Shield, Upload, FileText, Check, AlertTriangle, Camera, X, Download, ChevronDown } from "lucide-react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { v4 as uuidv4 } from "uuid"
import { WalletComponents } from "../../../../components/onchainKit/wallet"
import { MintNFT } from "@/components/AdminNFT"


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
  const [activeTab, setActiveTab] = useState("manual")
  const [assetId, setAssetId] = useState("")
  const [assetName, setAssetName] = useState("")
  const [assetValue, setAssetValue] = useState("")
  const [assetYield, setAssetYield] = useState("")
  const [assetDescription, setAssetDescription] = useState("")
  const [assetType, setAssetType] = useState("Bus")
  const [assetLocation, setAssetLocation] = useState("")
  const [ownerAddress, setOwnerAddress] = useState("")
  const [isTokenizing, setIsTokenizing] = useState(false)
  const [tokenizationProgress, setTokenizationProgress] = useState(0)
  const [tokenizationComplete, setTokenizationComplete] = useState(false)
  const [tokenizationHash, setTokenizationHash] = useState("")
  const [error, setError] = useState("")

  // For image upload
  const [assetImage, setAssetImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // For file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileUploading, setFileUploading] = useState(false)
  const [fileUploadProgress, setFileUploadProgress] = useState(0)
  const [fileUploadComplete, setFileUploadComplete] = useState(false)
  const [fileUploadError, setFileUploadError] = useState("")

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
    if (!assetName || !assetValue || !assetYield || !assetLocation) {
      alert('Please fill in the card details before downloading');
      return;
    }
    
    if (downloadFormat === "text") {
      // Create simple text version of the card data
      const cardData = `
YieldGuru Asset Card
-------------------
Asset Name: ${assetName}
Asset Type: ${assetType}
Asset Value: $${Number.parseInt(assetValue || '0').toLocaleString()}
Expected Yield: ${assetYield}%
Location: ${assetLocation}
Owner Address: ${ownerAddress || 'Not specified'}
Description: ${assetDescription || 'No description provided'}
      `.trim();
      
      // Create a data URL for download
      const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cardData);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${assetName.replace(/\s+/g, '-').toLowerCase()}-card.txt`;
      link.href = dataUrl;
      link.click();
    } else if (downloadFormat === "json") {
      // Create JSON version of the card data
      const cardData = {
        assetName,
        assetType,
        assetValue: Number.parseInt(assetValue || '0'),
        assetYield: Number.parseFloat(assetYield || '0'),
        location: assetLocation,
        ownerAddress: ownerAddress || 'Not specified',
        description: assetDescription || 'No description provided',
        imageUrl: assetImage,
        tokenizationDate: new Date().toISOString()
      };
      
      // Create a data URL for download
      const dataUrl = 'data:application/json;charset=utf-8,' + 
                     encodeURIComponent(JSON.stringify(cardData, null, 2));
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${assetName.replace(/\s+/g, '-').toLowerCase()}-card.json`;
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
        doc.text('YieldGuru Asset Card', margin, yPos);
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
        
        addField('Asset Name', assetName);
        addField('Asset Type', assetType);
        addField('Asset Value', `$${Number.parseInt(assetValue || '0').toLocaleString()}`);
        addField('Expected Yield', `${assetYield}%`);
        addField('Location', assetLocation);
        addField('Owner Address', ownerAddress || 'Not specified');
        
        // Description might be longer, so handle it differently
        yPos += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('Description:', margin, yPos);
        yPos += 7;
        doc.setFont('helvetica', 'normal');
        
        const descLines = doc.splitTextToSize(
          assetDescription || 'No description provided', 
          170
        );
        doc.text(descLines, margin, yPos);
        
        // Save the PDF
        doc.save(`${assetName.replace(/\s+/g, '-').toLowerCase()}-card.pdf`);
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
            link.download = `${assetName.replace(/\s+/g, '-').toLowerCase()}-card.${downloadFormat}`;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setFileUploadError("")
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setFileUploadError("Please select a file to upload")
      return
    }

    setFileUploading(true)
    setFileUploadProgress(0)

    // Simulate file upload with progress
    const totalSteps = 10
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setFileUploadProgress((i / totalSteps) * 100)
    }

    // Simulate processing the file
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setFileUploading(false)
    setFileUploadComplete(true)

    // Generate random data for demonstration
    setAssetId(Math.random().toString(36).substring(2, 10))
    setAssetName(`Tokenized Asset - ${selectedFile.name.split(".")[0]}`)
    setAssetValue((Math.floor(Math.random() * 500) + 100) * 1000 + "")
    setAssetYield((Math.random() * 3 + 3).toFixed(1))
    setAssetDescription("Automatically processed from uploaded file")
    setAssetType(["Bus", "Van", "Taxi", "Utility"][Math.floor(Math.random() * 4)])
    setAssetLocation("Metropolitan Area")
    setOwnerAddress(
      "0x" +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join(""),
    )

    // Generate a random image
    const randomImageIndex = Math.floor(Math.random() * 3) + 1
    let imagePath = ""
    if (randomImageIndex === 1) {
      imagePath = "/images/electric-bus.jpeg"
    } else if (randomImageIndex === 2) {
      imagePath = "/images/ford-vehicle.jpeg"
    } else {
      imagePath = "/images/ford.jpeg"
    }

    // Convert the image to base64 (simulated)
    setAssetImage(imagePath)
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
    if (!assetId || !assetName || !assetValue || !assetYield || !ownerAddress) {
      setError("Please fill in all required fields")
      return
    }

    // Set a default image if none is provided
    if (!assetImage) {
      if (assetType === "Bus") {
        setAssetImage("/images/electric-bus.jpeg")
      } else if (assetType === "Van" || assetType === "Utility") {
        setAssetImage("/images/ford-vehicle.jpeg")
      } else {
        setAssetImage("/images/ford.jpeg")
      }
    }

    setError("")
    setIsTokenizing(true)
    setTokenizationProgress(0)
    setTokenizationComplete(false)

    try {
      // Simulate tokenization process with progress
      const totalSteps = 5
      const stepLabels = [
        "Validating asset information",
        "Preparing smart contract",
        "Initializing tokenization",
        "Minting tokens",
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
        id: assetId || uuidv4().substring(0, 8),
        name: assetName,
        image: assetImage || "/images/ford-vehicle.jpeg", // Ensure we have a fallback
        operator: "YieldGuru Admin",
        value: Number.parseInt(assetValue) || 0,
        yield: Number.parseFloat(assetYield) || 5.0,
        available: Number.parseInt(assetValue) || 0, // Initially all value is available
        minInvestment: Math.floor((Number.parseInt(assetValue) || 0) * 0.01), // 1% minimum investment
        type: assetType,
        location: assetLocation || "Metropolitan Area",
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
    setAssetId("")
    setAssetName("")
    setAssetValue("")
    setAssetYield("")
    setAssetDescription("")
    setAssetType("Bus")
    setAssetLocation("")
    setOwnerAddress("")
    setAssetImage(null)
    setTokenizationComplete(false)
    setTokenizationHash("")
    setError("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tokenize Assets</h1>
          <p className="text-muted-foreground">Create new tokenized assets on the platform</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Asset Tokenization</CardTitle>
              <CardDescription>Enter the details of the asset you want to tokenize</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
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
                      <div className="font-medium">Asset Name:</div>
                      <div>{assetName}</div>

                      <div className="font-medium">Asset Value:</div>
                      <div>${Number.parseInt(assetValue).toLocaleString()}</div>

                      <div className="font-medium">Expected Yield:</div>
                      <div>{assetYield}%</div>

                      <div className="font-medium">Transaction Hash:</div>
                      <div className="break-all font-mono text-xs">{tokenizationHash}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={resetForm} className="flex-1 bg-[#4f1964] hover:bg-[#4f1964]/90">
                      Tokenize Another Asset
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
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="asset-id">Asset ID</Label>
                        <Input
                          id="asset-id"
                          placeholder="Enter unique asset identifier"
                          value={assetId}
                          onChange={(e) => setAssetId(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="asset-name">Asset Name</Label>
                        <Input
                          id="asset-name"
                          placeholder="Enter asset name"
                          value={assetName}
                          onChange={(e) => setAssetName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="asset-value">Asset Value ($)</Label>
                        <Input
                          id="asset-value"
                          placeholder="Enter total value in USD"
                          type="number"
                          value={assetValue}
                          onChange={(e) => setAssetValue(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="asset-yield">Expected Yield (%)</Label>
                        <Input
                          id="asset-yield"
                          placeholder="Enter expected annual yield"
                          type="number"
                          step="0.1"
                          value={assetYield}
                          onChange={(e) => setAssetYield(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="asset-type">Asset Type</Label>
                        <select
                          id="asset-type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={assetType}
                          onChange={(e) => setAssetType(e.target.value)}
                        >
                          <option value="Bus">Electric Bus</option>
                          <option value="Van">Delivery Van</option>
                          <option value="Taxi">Taxi Fleet</option>
                          <option value="Utility">Utility Vehicle</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="asset-location">Location</Label>
                        <Input
                          id="asset-location"
                          placeholder="Enter asset location"
                          value={assetLocation}
                          onChange={(e) => setAssetLocation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="asset-description">Asset Description</Label>
                      <Textarea
                        id="asset-description"
                        placeholder="Enter detailed description of the asset"
                        className="min-h-[100px]"
                        value={assetDescription}
                        onChange={(e) => setAssetDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="owner-address">Owner Wallet Address</Label>
                      <Input
                        id="owner-address"
                        placeholder="Enter blockchain wallet address"
                        value={ownerAddress}
                        onChange={(e) => setOwnerAddress(e.target.value)}
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
                              {assetType || "Asset Type"}
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 relative z-10">
                          <h3 className="text-xl font-bold mb-2 truncate">{assetName || "Asset Name"}</h3>
                          <div className="flex justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Value</p>
                              <p className="font-bold">
                                ${assetValue ? Number.parseInt(assetValue).toLocaleString() : "0"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Yield</p>
                              <p className="font-bold text-green-600">{assetYield || "0"}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="font-medium">{assetLocation || "Location"}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                            {assetDescription || "Asset description will appear here..."}
                          </p>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Owner Address:</p>
                            <p className="text-xs font-mono truncate">
                              {ownerAddress || "0x0000000000000000000000000000000000000000"}
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
                          Tokenize Asset
                        </Button>
                        
                      )}
                      <WalletComponents />
                      <MintNFT />
                    </div>

                  </div>
                  
                </div>
                
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Tokenization</CardTitle>
              <CardDescription>Upload a file with asset details for batch processing</CardDescription>
            </CardHeader>
            <CardContent>
              {fileUploadError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{fileUploadError}</AlertDescription>
                </Alert>
              )}

              {fileUploadComplete ? (
                <div className="space-y-6">
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">File Processed Successfully</AlertTitle>
                    <AlertDescription className="text-green-700">
                      The file has been processed and the asset details are ready for tokenization.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Extracted Asset Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium">Asset ID:</div>
                        <div>{assetId}</div>

                        <div className="font-medium">Asset Name:</div>
                        <div>{assetName}</div>

                        <div className="font-medium">Asset Value:</div>
                        <div>${Number.parseInt(assetValue).toLocaleString()}</div>

                        <div className="font-medium">Expected Yield:</div>
                        <div>{assetYield}%</div>

                        <div className="font-medium">Asset Type:</div>
                        <div>{assetType}</div>

                        <div className="font-medium">Location:</div>
                        <div>{assetLocation}</div>

                        <div className="font-medium">Owner Address:</div>
                        <div className="break-all font-mono text-xs">{ownerAddress}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Asset Image</h3>
                      {assetImage ? (
                        <div className="relative rounded-md overflow-hidden">
                          <Image
                            src={assetImage || "/placeholder.svg"}
                            alt="Asset preview"
                            width={400}
                            height={300}
                            className="w-full h-auto"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-[200px] bg-gray-200 rounded-md flex items-center justify-center">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {isTokenizing ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tokenization in progress...</span>
                        <span>{Math.round(tokenizationProgress)}%</span>
                      </div>
                      <Progress value={tokenizationProgress} className="h-2" />
                    </div>
                  ) : tokenizationComplete ? (
                    <div className="space-y-4">
                      <Alert className="bg-green-50 border-green-200">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Tokenization Complete</AlertTitle>
                        <AlertDescription className="text-green-700">
                          Transaction Hash: <span className="font-mono text-xs break-all">{tokenizationHash}</span>
                        </AlertDescription>
                      </Alert>

                      <div className="flex gap-4">
                        <Button
                          onClick={() => {
                            setSelectedFile(null)
                            setFileUploadComplete(false)
                            setTokenizationComplete(false)
                            resetForm()
                          }}
                          className="flex-1 bg-[#4f1964] hover:bg-[#4f1964]/90"
                        >
                          Process Another File
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
                    <Button onClick={handleTokenize} className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90">
                      <Shield className="mr-2 h-4 w-4" />
                      Tokenize Asset
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <FileText className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500 mb-2">Upload a CSV or JSON file containing asset details</p>
                    <p className="text-xs text-gray-400 mb-4">Supported formats: .csv, .json (max 5MB)</p>

                    <Input type="file" accept=".csv,.json" onChange={handleFileChange} className="max-w-xs" />
                  </div>

                  {fileUploading ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uploading file...</span>
                        <span>{Math.round(fileUploadProgress)}%</span>
                      </div>
                      <Progress value={fileUploadProgress} className="h-2" />
                    </div>
                  ) : (
                    <Button
                      onClick={handleFileUpload}
                      className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90"
                      disabled={!selectedFile}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Process File
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Liquidity Pool Section */}
      <Card>
        <CardHeader>
          <CardTitle>Liquidity Pool</CardTitle>
          <CardDescription>Manage asset liquidity and blockchain integration</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pool" className="w-full">
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
                      <strong>Pool Liquidity:</strong> 1,245,000 YGT
                    </div>
                    <div className="mb-2">
                      <strong>Current Price:</strong> 1.24 USDC/YGT
                    </div>
                    <div className="mb-2">
                      <strong>Current Tick:</strong> 12450
                    </div>
                    <div className="mb-2">
                      <strong>Swap Fee:</strong> 0.3%
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <strong>YGT Balance:</strong> 850,000
                    </div>
                    <div className="mb-2">
                      <strong>USDC Balance:</strong> 1,054,000
                    </div>
                    <div className="mb-2">
                      <strong>24h Volume:</strong> $124,500
                    </div>
                    <div className="mb-2">
                      <strong>TVL:</strong> $2,345,000
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div>
                  <h3 className="font-medium text-blue-800">Connect Your Wallet</h3>
                  <p className="text-sm text-blue-600">Connect your wallet to interact with the liquidity pool</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Connect Wallet</Button>
              </div>
            </TabsContent>

            <TabsContent value="swap" className="space-y-4 pt-4">
              <div className="p-6 border rounded-md">
                <h3 className="text-lg font-semibold mb-4">Swap Tokens</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-white border rounded-md">
                    <div className="flex justify-between mb-2">
                      <Label>From</Label>
                      <span className="text-sm text-gray-500">Balance: 1,000 YGT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="0.0" className="text-lg" />
                      <select className="h-10 rounded-md border border-input bg-background px-3 py-2">
                        <option>YGT</option>
                        <option>USDC</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" size="icon" className="rounded-full">
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
                      <span className="text-sm text-gray-500">Balance: 500 USDC</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="0.0" className="text-lg" readOnly value="0.0" />
                      <select className="h-10 rounded-md border border-input bg-background px-3 py-2">
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

                  <Button className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90">Swap</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="liquidity" className="space-y-4 pt-4">
              <div className="p-6 border rounded-md">
                <h3 className="text-lg font-semibold mb-4">Add Liquidity</h3>

                <div className="space-y-4">
                  <div className="flex space-x-2 mb-4">
                    <Button className="flex-1 bg-[#4f1964]">Add Liquidity</Button>
                    <Button variant="outline" className="flex-1">
                      Remove Liquidity
                    </Button>
                  </div>

                  <div className="p-4 bg-white border rounded-md">
                    <div className="flex justify-between mb-2">
                      <Label>Token A</Label>
                      <span className="text-sm text-gray-500">Balance: 1,000 YGT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="0.0" className="text-lg" />
                      <select className="h-10 rounded-md border border-input bg-background px-3 py-2">
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
                      <span className="text-sm text-gray-500">Balance: 500 USDC</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="0.0" className="text-lg" />
                      <select className="h-10 rounded-md border border-input bg-background px-3 py-2">
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

                  <Button className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90">Add Liquidity</Button>
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
                      <Input type="text" placeholder="Initial sqrtPriceX96" className="flex-grow" />
                      <Button className="bg-blue-600 hover:bg-blue-700">Initialize</Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-3">Protocol Fees</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="fee-recipient">Recipient Address</Label>
                        <Input id="fee-recipient" type="text" placeholder="0x..." className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="fee-amount">Amount</Label>
                        <Input id="fee-amount" type="number" placeholder="0.0" className="mt-1" />
                      </div>
                    </div>
                    <Button className="w-full bg-[#4f1964] hover:bg-[#4f1964]/90">Collect Protocol Fees</Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-purple-600 hover:bg-purple-700">Execute Settle</Button>
                    <Button className="bg-yellow-600 hover:bg-yellow-700">Clear Currency</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
