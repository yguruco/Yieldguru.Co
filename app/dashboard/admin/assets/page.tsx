"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"

interface Asset {
  id: string
  name: string
  image: string
  type: string
  operator: string
  value: number
  tokenization: number
  status: string
  tokenizationHash?: string
  tokenizationDate?: string
}

export default function AdminAssetsPage() {
  const router = useRouter()
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load assets from localStorage or use default ones
    const loadAssets = () => {
      setLoading(true)
      try {
        const storedAssets = localStorage.getItem("adminAssets")
        let assetList: Asset[] = storedAssets ? JSON.parse(storedAssets) : defaultAssets

        // Ensure all assets have the required properties
        assetList = assetList.map((asset) => ({
          ...asset,
          tokenization: asset.tokenization || 100,
          status: asset.status || "Active",
        }))

        setAssets(assetList)
        setFilteredAssets(assetList)
      } catch (error) {
        console.error("Error loading assets:", error)
        setAssets(defaultAssets)
        setFilteredAssets(defaultAssets)
      } finally {
        setLoading(false)
      }
    }

    loadAssets()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAssets(assets)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(query) ||
          asset.operator.toLowerCase().includes(query) ||
          asset.type.toLowerCase().includes(query) ||
          asset.id.toLowerCase().includes(query),
      )
      setFilteredAssets(filtered)
    }
  }, [searchQuery, assets])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCreateNew = () => {
    router.push("/dashboard/admin/tokenize")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f1964]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
          <p className="text-muted-foreground">Manage tokenized EV assets on the platform</p>
        </div>
        <Button className="bg-[#4f1964] hover:bg-[#4f1964]/90" onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Asset
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">
              {assets.filter((a) => a.status === "Active").length} active assets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24.5M</div>
            <p className="text-xs text-muted-foreground">All tokenized assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokenization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(assets.reduce((sum, asset) => sum + asset.tokenization, 0) / (assets.length || 1))}%
            </div>
            <p className="text-xs text-muted-foreground">Average across all assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2%</div>
            <p className="text-xs text-muted-foreground">+0.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input placeholder="Search assets..." className="pl-10" value={searchQuery} onChange={handleSearchChange} />
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No assets found</h3>
          <p className="text-gray-500 mt-2">
            {assets.length === 0
              ? "You don't have any assets yet. Create a new asset to get started."
              : "No assets match your search criteria. Try a different search term."}
          </p>
          {assets.length === 0 && (
            <Button onClick={handleCreateNew} className="mt-4 bg-[#4f1964] hover:bg-[#4f1964]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Asset
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
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={asset.image || "/placeholder.svg?height=200&width=300"}
                    alt={asset.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-[#4f1964]">{asset.type}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{asset.name}</CardTitle>
                  <CardDescription>Operated by {asset.operator}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Value:</span>
                      <span>${asset.value.toLocaleString()}</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tokenization:</span>
                        <span>{asset.tokenization}%</span>
                      </div>
                      <Progress value={asset.tokenization} className="h-2" />
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge
                        className={
                          asset.status === "Active"
                            ? "bg-green-500"
                            : asset.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }
                      >
                        {asset.status}
                      </Badge>
                    </div>

                    {asset.tokenizationHash && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Transaction Hash:</p>
                        <p className="text-xs font-mono break-all bg-gray-50 p-2 rounded">{asset.tokenizationHash}</p>
                      </div>
                    )}

                    {asset.tokenizationDate && (
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Tokenized on:</span>
                        <span>{new Date(asset.tokenizationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Default assets if none are in localStorage
const defaultAssets: Asset[] = [
  {
    id: "EV-001",
    name: "Electric Bus Fleet",
    image: "/images/electric-bus.jpeg",
    type: "Bus",
    operator: "MetroTransit",
    value: 450000,
    tokenization: 92,
    status: "Active",
  },
  {
    id: "EV-002",
    name: "Delivery Van",
    image: "/images/ford-vehicle.jpeg",
    type: "Van",
    operator: "EcoDelivery",
    value: 85000,
    tokenization: 78,
    status: "Active",
  },
  {
    id: "EV-003",
    name: "Taxi Fleet",
    image: "/images/ford.jpeg",
    type: "Taxi",
    operator: "GreenCab",
    value: 320000,
    tokenization: 65,
    status: "Active",
  },
  {
    id: "EV-004",
    name: "Utility Vehicle",
    image: "/images/ford-vehicle.jpeg",
    type: "Utility",
    operator: "CityServices",
    value: 120000,
    tokenization: 100,
    status: "Active",
  },
  {
    id: "EV-005",
    name: "Electric Bus",
    image: "/images/electric-bus.jpeg",
    type: "Bus",
    operator: "RegionalTransit",
    value: 480000,
    tokenization: 45,
    status: "Pending",
  },
  {
    id: "EV-006",
    name: "Commercial Van",
    image: "/images/ford-vehicle.jpeg",
    type: "Van",
    operator: "FastLogistics",
    value: 95000,
    tokenization: 0,
    status: "Onboarding",
  },
]
