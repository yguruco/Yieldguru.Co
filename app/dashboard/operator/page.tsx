"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder"
import LiquidityPoolInterface from "@/components/liquidity-pool-interface"
import { BarChart3, Car, CreditCard, Percent, Zap, Calendar, MapPin, AlertTriangle, TrendingUp, Activity } from "lucide-react"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"
import VehicleStatusCard from "@/components/dashboard/vehicle-status-card"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function OperatorDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const accentColor = "#f68b27"

  // Animation variants for tab transitions
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
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
            <h1 className="text-3xl font-bold tracking-tight shimmer">EV-Operator Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Monitor and manage your EV fleet performance and tokenized assets</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">System Status: Operational</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm"
            style={{
              background: `linear-gradient(to right, ${accentColor}20, ${accentColor}10)`,
              border: `1px solid ${accentColor}30`
            }}
          >
            <Calendar className="h-4 w-4" style={{ color: accentColor }} />
            <span className="text-sm font-medium">Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </motion.div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList
          className="w-full max-w-md mx-auto mb-6 p-1 rounded-full bg-white/80 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
        >
          <TabsTrigger
            value="overview"
            className="rounded-full data-[state=active]:shadow-md transition-all duration-300"
            style={{
              color: activeTab === "overview" ? "white" : undefined,
              background: activeTab === "overview" ? accentColor : undefined
            }}
          >
            <Activity className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="rounded-full data-[state=active]:shadow-md transition-all duration-300"
            style={{
              color: activeTab === "performance" ? "white" : undefined,
              background: activeTab === "performance" ? accentColor : undefined
            }}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="liquidity"
            className="rounded-full data-[state=active]:shadow-md transition-all duration-300"
            style={{
              color: activeTab === "liquidity" ? "white" : undefined,
              background: activeTab === "liquidity" ? accentColor : undefined
            }}
          >
            <Zap className="mr-2 h-4 w-4" />
            Liquidity Pool
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Total Fleet Value"
                    value="$1.2M"
                    description="Total value of tokenized fleet"
                    trend="up"
                    trendValue="12%"
                    icon={<CreditCard className="h-5 w-5 text-[#f68b27]" />}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Active Vehicles"
                    value="24"
                    description="Vehicles currently in operation"
                    trend="up"
                    trendValue="2"
                    icon={<Car className="h-5 w-5 text-[#f68b27]" />}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Monthly Revenue"
                    value="$85.4K"
                    description="Revenue generated this month"
                    trend="up"
                    trendValue="8.2%"
                    icon={<BarChart3 className="h-5 w-5 text-[#f68b27]" />}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Tokenization Rate"
                    value="68%"
                    description="Percentage of fleet tokenized"
                    trend="up"
                    trendValue="5%"
                    icon={<Percent className="h-5 w-5 text-[#f68b27]" />}
                  />
                </motion.div>
              </div>

              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <GlassmorphicCard
                    title="Fleet Performance"
                    description="Daily performance metrics for your fleet"
                  >
                    <ChartPlaceholder height={300} />
                  </GlassmorphicCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <GlassmorphicCard
                    title="Alerts & Notifications"
                    description="Recent system alerts"
                  >
                    <div className="space-y-4 py-2">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-red-800">Low Battery Alert</h4>
                          <p className="text-sm text-red-600">EV-003 battery below 30%</p>
                          <p className="text-xs text-red-500 mt-1">10 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <Calendar className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-amber-800">Maintenance Due</h4>
                          <p className="text-sm text-amber-600">EV-002 scheduled for maintenance</p>
                          <p className="text-xs text-amber-500 mt-1">2 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <Zap className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800">Charging Complete</h4>
                          <p className="text-sm text-green-600">EV-005 fully charged and ready</p>
                          <p className="text-xs text-green-500 mt-1">30 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <GlassmorphicCard
                  title="Revenue Breakdown"
                  description="Revenue sources by category"
                >
                  <ChartPlaceholder height={250} />
                </GlassmorphicCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <GlassmorphicCard
                  title="Fleet Status"
                  description="Current status of your vehicle fleet"
                >
                  <div className="space-y-4 py-2">
                    <VehicleStatusCard
                      id="EV-001"
                      type="Sedan"
                      battery={85}
                      status="Active"
                      location="Downtown"
                      lastMaintenance="2023-04-15"
                      index={0}
                    />
                    <VehicleStatusCard
                      id="EV-002"
                      type="SUV"
                      battery={62}
                      status="Active"
                      location="Airport"
                      lastMaintenance="2023-05-02"
                      index={1}
                    />
                    <VehicleStatusCard
                      id="EV-003"
                      type="Van"
                      battery={28}
                      status="Charging"
                      location="Depot"
                      lastMaintenance="2023-04-28"
                      index={2}
                    />
                    <VehicleStatusCard
                      id="EV-004"
                      type="Sedan"
                      battery={92}
                      status="Active"
                      location="Suburban"
                      lastMaintenance="2023-05-10"
                      index={3}
                    />
                    <VehicleStatusCard
                      id="EV-005"
                      type="Bus"
                      battery={45}
                      status="Maintenance"
                      location="Service Center"
                      lastMaintenance="2023-05-15"
                      index={4}
                    />
                  </div>
                </GlassmorphicCard>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "performance" && (
            <motion.div
              key="performance"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-4">
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Energy Efficiency"
                    value="92%"
                    description="+4% from last month"
                    trend="up"
                    trendValue="4%"
                    icon={<Zap className="h-5 w-5 text-[#f68b27]" />}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Avg. Daily Range"
                    value="187 mi"
                    description="+12 mi from last month"
                    trend="up"
                    trendValue="12 mi"
                    icon={<MapPin className="h-5 w-5 text-[#f68b27]" />}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Charging Efficiency"
                    value="78%"
                    description="+2% from last month"
                    trend="up"
                    trendValue="2%"
                    icon={<Zap className="h-5 w-5 text-[#f68b27]" />}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Maintenance Cost"
                    value="$3,450"
                    description="-8% from last month"
                    trend="down"
                    trendValue="8%"
                    icon={<Activity className="h-5 w-5 text-[#f68b27]" />}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <GlassmorphicCard
                  title="Performance Metrics"
                  description="Detailed performance analytics for your fleet"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <div className="bg-white/70 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                          <Activity className="h-3 w-3" style={{ color: accentColor }} />
                        </div>
                        Utilization Rate
                      </h3>
                      <ChartPlaceholder height={200} />
                    </div>
                    <div className="bg-white/70 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                          <Zap className="h-3 w-3" style={{ color: accentColor }} />
                        </div>
                        Energy Consumption
                      </h3>
                      <ChartPlaceholder height={200} />
                    </div>
                    <div className="bg-white/70 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                          <Activity className="h-3 w-3" style={{ color: accentColor }} />
                        </div>
                        Maintenance Costs
                      </h3>
                      <ChartPlaceholder height={200} />
                    </div>
                    <div className="bg-white/70 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                          <TrendingUp className="h-3 w-3" style={{ color: accentColor }} />
                        </div>
                        Revenue Trends
                      </h3>
                      <ChartPlaceholder height={200} />
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "liquidity" && (
            <motion.div
              key="liquidity"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={itemVariants}>
                <GlassmorphicCard noPadding>
                  <LiquidityPoolInterface />
                </GlassmorphicCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
