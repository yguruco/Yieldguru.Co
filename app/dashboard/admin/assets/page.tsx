"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Wallet, BarChart3, Percent, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"

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

export default function AdminAssetsPage() {
  const router = useRouter()
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const accentColor = "#4f1964"

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  useEffect(() => {
    // Load assets from MongoDB API
    const loadAssets = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/assets')

        if (!response.ok) {
          throw new Error(`Error fetching assets: ${response.status}`)
        }

        const data = await response.json()

        // If no assets are found in the database, seed with default assets
        if (data.length === 0) {
          console.log('No assets found in database, seeding with default assets')

          // Create default assets in the database
          for (const asset of defaultAssets) {
            await fetch('/api/assets', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(asset),
            })
          }

          // Fetch again after seeding
          const secondResponse = await fetch('/api/assets')
          if (!secondResponse.ok) {
            throw new Error(`Error fetching assets after seeding: ${secondResponse.status}`)
          }

          const secondData = await secondResponse.json()
          setAssets(secondData)
          setFilteredAssets(secondData)
        } else {
          setAssets(data)
          setFilteredAssets(data)
        }
      } catch (error) {
        console.error("Error loading assets:", error)
        // Only use default assets as a fallback if there's an error
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: accentColor }}></div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                boxShadow: `0 3px 10px ${accentColor}40`
              }}
            >
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight shimmer">Asset Management</h1>
          </div>
          <p className="text-muted-foreground">Manage tokenized EV assets on the platform</p>
        </div>
        <Button
          className="rounded-full shadow-sm hover:shadow-md transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
            boxShadow: `0 3px 10px ${accentColor}40`
          }}
          onClick={handleCreateNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Asset
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Total Assets"
            value="1,245"
            description={`${assets.filter((a) => a.status === "Active").length} active assets`}
            trend="up"
            trendValue="12%"
            icon={<Wallet className="h-5 w-5 text-[#4f1964]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Total Value"
            value="$24.5M"
            description="All tokenized assets"
            trend="up"
            trendValue="18%"
            icon={<BarChart3 className="h-5 w-5 text-[#4f1964]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Tokenization Rate"
            value={`${Math.round(assets.reduce((sum, asset) => sum + asset.tokenization, 0) / (assets.length || 1))}%`}
            description="Average across all assets"
            trend="up"
            trendValue="5%"
            icon={<Percent className="h-5 w-5 text-[#4f1964]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Average Yield"
            value="5.2%"
            description="+0.3% from last month"
            trend="up"
            trendValue="0.3%"
            icon={<TrendingUp className="h-5 w-5 text-[#4f1964]" />}
            accentColor={accentColor}
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <GlassmorphicCard
          title="Search Assets"
          description="Find assets by name, operator, type, or ID"
          accentColor={accentColor}
        >
          <div className="relative p-4">
            <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search assets..."
              className="pl-10 rounded-full border-gray-200 focus:border-[#4f1964] transition-all duration-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </GlassmorphicCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        {filteredAssets.length === 0 ? (
          <GlassmorphicCard accentColor={accentColor}>
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Filter className="h-8 w-8" style={{ color: accentColor }} />
              </div>
              <h3 className="text-lg font-medium">No assets found</h3>
              <p className="text-gray-500 mt-2">
                {assets.length === 0
                  ? "You don't have any assets yet. Create a new asset to get started."
                  : "No assets match your search criteria. Try a different search term."}
              </p>
              {assets.length === 0 && (
                <Button
                  onClick={handleCreateNew}
                  className="mt-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
                    boxShadow: `0 3px 10px ${accentColor}40`
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Asset
                </Button>
              )}
            </div>
          </GlassmorphicCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <GlassmorphicCard className="h-full flex flex-col" accentColor={accentColor}>
                  <div className="relative h-48">
                    <Image
                      src={asset.image || "/placeholder.svg?height=200&width=300"}
                      alt={asset.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        className="shadow-sm"
                        style={{
                          backgroundColor: accentColor,
                          color: 'white'
                        }}
                      >
                        {asset.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-1">{asset.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">Operated by {asset.operator}</p>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Value:</span>
                        <span className="font-bold" style={{ color: accentColor }}>${asset.value.toLocaleString()}</span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tokenization:</span>
                          <span className="font-medium">{asset.tokenization}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${asset.tokenization}%`,
                              backgroundColor: accentColor
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-medium">Status:</span>
                        <Badge
                          className="shadow-sm"
                          style={{
                            backgroundColor:
                              asset.status === "Active"
                                ? "#10b981"
                                : asset.status === "Pending"
                                  ? "#f59e0b"
                                  : "#3b82f6",
                            color: 'white'
                          }}
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

                    <div className="mt-6">
                      <Button
                        className="w-full rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
                          boxShadow: `0 3px 10px ${accentColor}40`
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}