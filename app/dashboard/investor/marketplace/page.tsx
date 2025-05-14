"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

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

export default function MarketplacePage() {
  const [assets, setAssets] = useState<MarketplaceAsset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<MarketplaceAsset[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedYield, setSelectedYield] = useState("All")
  const [selectedValue, setSelectedValue] = useState("All")

  useEffect(() => {
    // Load assets from localStorage or use default data
    const storedAssets = localStorage.getItem("marketplaceAssets")

    if (storedAssets) {
      const parsedAssets = JSON.parse(storedAssets)
      setAssets(parsedAssets)
      setFilteredAssets(parsedAssets)
    } else {
      // Default assets if none in localStorage
      const defaultAssets: MarketplaceAsset[] = [
        {
          id: "asset1",
          name: "Electric Bus Fleet - Metro Line 7",
          image: "/images/electric-bus.jpeg",
          operator: "Metro Transit Authority",
          value: 1250000,
          yield: 5.2,
          available: 875000,
          minInvestment: 10000,
          type: "Bus",
          location: "Downtown Metro Area",
          listingDate: "2023-05-15",
        },
        {
          id: "asset2",
          name: "Delivery Van Network - East Region",
          image: "/images/ford-vehicle.jpeg",
          operator: "EcoDelivery Services",
          value: 750000,
          yield: 4.8,
          available: 450000,
          minInvestment: 5000,
          type: "Van",
          location: "Eastern Commercial District",
          listingDate: "2023-06-22",
        },
        {
          id: "asset3",
          name: "Electric Taxi Fleet - Airport Service",
          image: "/images/ford.jpeg",
          operator: "GreenRide Taxi Co.",
          value: 950000,
          yield: 6.1,
          available: 650000,
          minInvestment: 7500,
          type: "Taxi",
          location: "International Airport Zone",
          listingDate: "2023-04-10",
        },
      ]

      setAssets(defaultAssets)
      setFilteredAssets(defaultAssets)
      localStorage.setItem("marketplaceAssets", JSON.stringify(defaultAssets))
    }
  }, [])

  useEffect(() => {
    // Filter assets based on search term and filters
    let result = [...assets]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply type filter
    if (selectedType !== "All") {
      result = result.filter((asset) => asset.type === selectedType)
    }

    // Apply yield filter
    if (selectedYield !== "All") {
      if (selectedYield === "Under 5%") {
        result = result.filter((asset) => asset.yield < 5)
      } else if (selectedYield === "5-6%") {
        result = result.filter((asset) => asset.yield >= 5 && asset.yield <= 6)
      } else if (selectedYield === "Over 6%") {
        result = result.filter((asset) => asset.yield > 6)
      }
    }

    // Apply value filter
    if (selectedValue !== "All") {
      if (selectedValue === "Under $500K") {
        result = result.filter((asset) => asset.value < 500000)
      } else if (selectedValue === "$500K-$1M") {
        result = result.filter((asset) => asset.value >= 500000 && asset.value <= 1000000)
      } else if (selectedValue === "Over $1M") {
        result = result.filter((asset) => asset.value > 1000000)
      }
    }

    setFilteredAssets(result)
  }, [assets, searchTerm, selectedType, selectedYield, selectedValue])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">Browse and invest in tokenized EV loans</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Assets</CardTitle>
          <CardDescription>Browse tokenized EV loans available for investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                  Search
                </Label>
                <Input
                  id="search"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Bus">Bus</option>
                  <option value="Van">Van</option>
                  <option value="Taxi">Taxi</option>
                  <option value="Utility">Utility</option>
                </select>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={selectedYield}
                  onChange={(e) => setSelectedYield(e.target.value)}
                >
                  <option value="All">All Yields</option>
                  <option value="Under 5%">Under 5%</option>
                  <option value="5-6%">5-6%</option>
                  <option value="Over 6%">Over 6%</option>
                </select>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  <option value="All">All Values</option>
                  <option value="Under $500K">Under $500K</option>
                  <option value="$500K-$1M">$500K-$1M</option>
                  <option value="Over $1M">Over $1M</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <Card key={asset.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src={asset.image || "/placeholder.svg"} alt={asset.name} fill className="object-cover" />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white text-black">{asset.type}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{asset.name}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500">Value</p>
                        <p className="font-medium">${asset.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Yield</p>
                        <p className="font-medium text-green-600">{asset.yield}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Available</p>
                        <p className="font-medium">${asset.available.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Min. Investment</p>
                        <p className="font-medium">${asset.minInvestment.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <p>{asset.location}</p>
                      </div>
                      <Button className="bg-[#fbdc3e] text-black hover:bg-[#fbdc3e]/90">Invest</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center">
                <p className="text-muted-foreground">No assets found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
