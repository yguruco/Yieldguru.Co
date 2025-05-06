"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Car, DollarSign, User, Calendar, Search, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { AssetCard, RFTSubmission } from "@/types/rft"

export default function MyAssetsPage() {
  const router = useRouter()
  const [assets, setAssets] = useState<AssetCard[]>([])
  const [filteredAssets, setFilteredAssets] = useState<AssetCard[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchAssets = () => {
      setLoading(true)

      try {
        // Get submissions from local storage (for demo purposes)
        const storedSubmissions = localStorage.getItem("rftSubmissions")
        let parsedSubmissions: RFTSubmission[] = storedSubmissions ? JSON.parse(storedSubmissions) : []

        // Filter approved submissions only
        parsedSubmissions = parsedSubmissions.filter((sub) => sub.status === "approved")

        // Convert to asset cards
        const assetCards: AssetCard[] = parsedSubmissions.map((sub) => ({
          id: sub.vehicleDetails.id,
          vehicleName: `${sub.vehicleDetails.year} ${sub.vehicleDetails.make} ${sub.vehicleDetails.model}`,
          vehicleImage: sub.vehicleImages[0] || "/placeholder.svg?height=200&width=300",
          operatorName: sub.vehicleDetails.ownerName,
          vehicleValue: sub.vehicleDetails.value,
          status: sub.status,
          approvalHash: sub.approvalHash,
          submissionDate: sub.submissionDate,
          approvalDate: sub.approvalDate,
        }))

        setAssets(assetCards)
        setFilteredAssets(assetCards)
      } catch (error) {
        console.error("Error fetching assets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAssets(assets)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = assets.filter(
        (asset) => asset.vehicleName.toLowerCase().includes(query) || asset.operatorName.toLowerCase().includes(query),
      )
      setFilteredAssets(filtered)
    }
  }, [searchQuery, assets])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCreateNew = () => {
    router.push("/dashboard/operator/rft")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f68b27]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tokenized Assets</h1>
          <p className="text-muted-foreground">View and manage your approved EV assets</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-[#f68b27] hover:bg-[#f68b27]/90">
          <Plus className="mr-2 h-4 w-4" />
          Submit New RFT
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input placeholder="Search assets..." className="pl-10" value={searchQuery} onChange={handleSearchChange} />
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Car className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No assets found</h3>
          <p className="text-gray-500 mt-2">
            {assets.length === 0
              ? "You don't have any approved assets yet. Submit an RFT to get started."
              : "No assets match your search criteria. Try a different search term."}
          </p>
          {assets.length === 0 && (
            <Button onClick={handleCreateNew} className="mt-4 bg-[#f68b27] hover:bg-[#f68b27]/90">
              <Plus className="mr-2 h-4 w-4" />
              Submit RFT
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-green-500 overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={asset.vehicleImage || "/placeholder.svg"}
                    alt={asset.vehicleName}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardHeader>
                  <CardTitle>{asset.vehicleName}</CardTitle>
                  <CardDescription>Tokenized Asset</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{asset.operatorName}</span>
                    </div>

                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">${asset.vehicleValue}</span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">
                        Approved: {new Date(asset.approvalDate || asset.submissionDate).toLocaleDateString()}
                      </span>
                    </div>

                    {asset.approvalHash && (
                      <div className="pt-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Asset Hash:</p>
                        <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">{asset.approvalHash}</div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Car className="mr-2 h-4 w-4" />
                    View Asset Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
