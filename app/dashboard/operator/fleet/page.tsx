"use client"
import { Plus, Battery, MapPin, Calendar, Car, BarChart3, Percent, Search, Filter, Map, Zap, Settings, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"
import VehicleStatusCard from "@/components/dashboard/vehicle-status-card"
import { useState } from "react"

export default function OperatorFleetPage() {
  const [activeTab, setActiveTab] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles)
  const accentColor = "#f68b27"

  // Filter vehicles based on search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query.trim() === "") {
      setFilteredVehicles(vehicles)
    } else {
      const filtered = vehicles.filter(
        vehicle =>
          vehicle.id.toLowerCase().includes(query) ||
          vehicle.type.toLowerCase().includes(query) ||
          vehicle.location.toLowerCase().includes(query) ||
          vehicle.status.toLowerCase().includes(query)
      )
      setFilteredVehicles(filtered)
    }
  }

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
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
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
              <Car className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight shimmer">Fleet Management</h1>
          </div>
          <p className="text-muted-foreground">Monitor and manage your EV fleet assets</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full md:w-[200px] rounded-full border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#f68b27] focus:ring-[#f68b27] transition-all duration-300"
            />
          </div>
          <Button
            className="rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
              boxShadow: `0 4px 10px ${accentColor}30`
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <NeumorphicStatCard
            title="Fleet Utilization"
            value="85%"
            description="+7% from last month"
            trend="up"
            trendValue="7%"
            icon={<Percent className="h-5 w-5 text-[#f68b27]" />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <NeumorphicStatCard
            title="Active Vehicles"
            value="42/45"
            description="93.3% operational"
            trend="up"
            trendValue="2"
            icon={<Car className="h-5 w-5 text-[#f68b27]" />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <NeumorphicStatCard
            title="Average Battery"
            value="68%"
            description="+3% from yesterday"
            trend="up"
            trendValue="3%"
            icon={<Battery className="h-5 w-5 text-[#f68b27]" />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <NeumorphicStatCard
            title="Monthly Revenue"
            value="$16,000"
            description="+5.3% from projected"
            trend="up"
            trendValue="5.3%"
            icon={<BarChart3 className="h-5 w-5 text-[#f68b27]" />}
          />
        </motion.div>
      </div>

      <Tabs
        defaultValue="list"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList
          className="w-full max-w-md mx-auto mb-6 p-1 rounded-full bg-white/80 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
        >
          <TabsTrigger
            value="list"
            className="rounded-full data-[state=active]:shadow-md transition-all duration-300"
            style={{
              color: activeTab === "list" ? "white" : undefined,
              background: activeTab === "list" ? accentColor : undefined
            }}
          >
            <Car className="mr-2 h-4 w-4" />
            Vehicle List
          </TabsTrigger>
          <TabsTrigger
            value="map"
            className="rounded-full data-[state=active]:shadow-md transition-all duration-300"
            style={{
              color: activeTab === "map" ? "white" : undefined,
              background: activeTab === "map" ? accentColor : undefined
            }}
          >
            <Map className="mr-2 h-4 w-4" />
            Map View
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="rounded-full data-[state=active]:shadow-md transition-all duration-300"
            style={{
              color: activeTab === "maintenance" ? "white" : undefined,
              background: activeTab === "maintenance" ? accentColor : undefined
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard
                title="Vehicle Status"
                description="Current status of your EV fleet"
              >
                <div className="flex flex-wrap gap-3 mb-4 p-4 bg-gray-50/50 rounded-lg">
                  <Badge className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer px-3 py-1 rounded-full shadow-sm">
                    <Filter className="mr-1 h-3 w-3" />
                    All Vehicles
                  </Badge>
                  <Badge className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer px-3 py-1 rounded-full shadow-sm">
                    Active
                  </Badge>
                  <Badge className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer px-3 py-1 rounded-full shadow-sm">
                    Charging
                  </Badge>
                  <Badge className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer px-3 py-1 rounded-full shadow-sm">
                    Maintenance
                  </Badge>
                  <Badge className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer px-3 py-1 rounded-full shadow-sm">
                    Inactive
                  </Badge>
                </div>

                {filteredVehicles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Car className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">No vehicles found</h3>
                    <p className="text-gray-500 mt-2">Try a different search term</p>
                  </div>
                ) : (
                  <motion.div
                    className="space-y-4 py-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredVehicles.map((vehicle, index) => (
                      <motion.div key={vehicle.id} variants={itemVariants}>
                        <VehicleStatusCard
                          id={vehicle.id}
                          type={vehicle.type}
                          battery={vehicle.battery}
                          status={vehicle.status as any}
                          location={vehicle.location}
                          lastMaintenance={vehicle.lastMaintenance}
                          index={index}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </GlassmorphicCard>
            </motion.div>
          )}

          {activeTab === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard
                title="Fleet Map"
                description="Geographic location of your vehicles"
              >
                <div className="relative h-[500px] w-full bg-gray-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Map View</h3>
                      <p className="text-gray-500 mt-2">Interactive map showing vehicle locations</p>
                    </div>
                  </div>

                  {/* Map Placeholder - In a real implementation, this would be a map component */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <h4 className="text-sm font-medium mb-2">Vehicle Legend</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-xs">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs">Charging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                        <span className="text-xs">Maintenance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-xs">Inactive</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {activeTab === "maintenance" && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <GlassmorphicCard
                    title="Maintenance Schedule"
                    description="Upcoming and past maintenance activities"
                  >
                    <div className="space-y-4 p-4">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-amber-800">EV-002 (SUV)</h4>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Due Tomorrow</Badge>
                          </div>
                          <p className="text-sm text-amber-600 mt-1">Regular maintenance check</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-amber-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> May 25, 2023
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> Service Center
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <Settings className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">EV-004 (Sedan)</h4>
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Scheduled</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Battery inspection</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> June 10, 2023
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> Depot
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <Settings className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">EV-001 (Sedan)</h4>
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Scheduled</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Tire replacement</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> June 15, 2023
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> Service Center
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <Settings className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-green-800">EV-005 (Bus)</h4>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
                          </div>
                          <p className="text-sm text-green-600 mt-1">Major service</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-green-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> May 15, 2023
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> Service Center
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </div>

                <div>
                  <GlassmorphicCard
                    title="Maintenance Stats"
                    description="Maintenance metrics and costs"
                  >
                    <div className="p-4 space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Maintenance Cost Breakdown</h4>
                        <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Upcoming Maintenance</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">This Week</span>
                            <Badge>1</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Next Week</span>
                            <Badge>2</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">This Month</span>
                            <Badge>5</Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Button
                          className="w-full rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Schedule Maintenance
                        </Button>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

const vehicles = [
  {
    id: "EV-001",
    type: "Sedan",
    battery: 85,
    status: "Active",
    location: "Downtown",
    lastMaintenance: "2023-04-15",
  },
  {
    id: "EV-002",
    type: "SUV",
    battery: 62,
    status: "Active",
    location: "Airport",
    lastMaintenance: "2023-05-02",
  },
  {
    id: "EV-003",
    type: "Van",
    battery: 28,
    status: "Charging",
    location: "Depot",
    lastMaintenance: "2023-04-28",
  },
  {
    id: "EV-004",
    type: "Sedan",
    battery: 92,
    status: "Active",
    location: "Suburban",
    lastMaintenance: "2023-05-10",
  },
  {
    id: "EV-005",
    type: "Bus",
    battery: 45,
    status: "Maintenance",
    location: "Service Center",
    lastMaintenance: "2023-05-15",
  },
]
