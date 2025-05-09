"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder"
import { BarChart3, Users, Wallet, PieChart, TrendingUp, Activity, Shield, Bell, Calendar, AlertTriangle } from "lucide-react"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const accentColor = "#4f1964"

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
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight shimmer">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage platform assets, users, and performance metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">Platform Status: Online</span>
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
            value="assets"
            className="rounded-full data-[state=active]:shadow-md transition-all duration-300"
            style={{
              color: activeTab === "assets" ? "white" : undefined,
              background: activeTab === "assets" ? accentColor : undefined
            }}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-full data-[state=active]:shadow-md transition-all duration-300"
            style={{
              color: activeTab === "users" ? "white" : undefined,
              background: activeTab === "users" ? accentColor : undefined
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
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
                    title="Total Assets"
                    value="1,245"
                    description="+12% from last month"
                    trend="up"
                    trendValue="12%"
                    icon={<Wallet className="h-5 w-5 text-[#4f1964]" />}
                    accentColor={accentColor}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Active Investors"
                    value="867"
                    description="+5% from last month"
                    trend="up"
                    trendValue="5%"
                    icon={<Users className="h-5 w-5 text-[#4f1964]" />}
                    accentColor={accentColor}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Total Value Locked"
                    value="$24.5M"
                    description="+18% from last month"
                    trend="up"
                    trendValue="18%"
                    icon={<BarChart3 className="h-5 w-5 text-[#4f1964]" />}
                    accentColor={accentColor}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Platform Growth"
                    value="32%"
                    description="Year-over-year increase"
                    trend="up"
                    trendValue="32%"
                    icon={<TrendingUp className="h-5 w-5 text-[#4f1964]" />}
                    accentColor={accentColor}
                  />
                </motion.div>
              </div>

              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <GlassmorphicCard
                    title="Platform Performance"
                    description="Monthly growth metrics"
                    accentColor={accentColor}
                  >
                    <ChartPlaceholder
                      height={300}
                      type="bar"
                      title="Monthly Growth"
                      description="Volume in thousands"
                      accentColor={accentColor}
                    />
                  </GlassmorphicCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <GlassmorphicCard
                    title="System Alerts"
                    description="Recent platform notifications"
                    accentColor={accentColor}
                  >
                    <div className="space-y-4 py-2">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <Bell className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800">System Update Complete</h4>
                          <p className="text-sm text-green-600">Platform updated to version 2.4.0</p>
                          <p className="text-xs text-green-500 mt-1">2 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-amber-800">New RFT Submissions</h4>
                          <p className="text-sm text-amber-600">5 new submissions awaiting approval</p>
                          <p className="text-xs text-amber-500 mt-1">30 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800">New User Registrations</h4>
                          <p className="text-sm text-blue-600">12 new users registered today</p>
                          <p className="text-xs text-blue-500 mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={itemVariants}>
                  <GlassmorphicCard
                    title="Asset Distribution"
                    description="Breakdown of tokenized EV assets by type"
                    accentColor={accentColor}
                  >
                    <ChartPlaceholder
                      height={250}
                      type="pie"
                      title="Asset Distribution"
                      description="Breakdown by vehicle type"
                      accentColor={accentColor}
                    />
                  </GlassmorphicCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <GlassmorphicCard
                    title="Tokenization Growth"
                    description="Monthly tokenization volume in thousands"
                    accentColor={accentColor}
                  >
                    <ChartPlaceholder
                      height={250}
                      type="line"
                      title="Monthly Growth"
                      description="Volume in thousands"
                      accentColor={accentColor}
                    />
                  </GlassmorphicCard>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "assets" && (
            <motion.div
              key="assets"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <GlassmorphicCard
                  title="Asset Overview"
                  description="Summary of all tokenized assets on the platform"
                  accentColor={accentColor}
                >
                  <div className="p-4">
                    <div className="grid gap-6 md:grid-cols-3 mb-6">
                      <div className="bg-white/70 rounded-xl p-4 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                            <PieChart className="h-3 w-3" style={{ color: accentColor }} />
                          </div>
                          Asset Types
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Buses</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '45%', backgroundColor: accentColor }}></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cars</span>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '25%', backgroundColor: '#fbdc3e' }}></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Trucks</span>
                            <span className="text-sm font-medium">20%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '20%', backgroundColor: '#f68b27' }}></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Scooters</span>
                            <span className="text-sm font-medium">10%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '10%', backgroundColor: '#6b21a8' }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/70 rounded-xl p-4 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                            <Activity className="h-3 w-3" style={{ color: accentColor }} />
                          </div>
                          Asset Status
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Active</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-green-500" style={{ width: '78%' }}></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Pending</span>
                            <span className="text-sm font-medium">15%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-amber-500" style={{ width: '15%' }}></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Maintenance</span>
                            <span className="text-sm font-medium">7%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: '7%' }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/70 rounded-xl p-4 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                            <TrendingUp className="h-3 w-3" style={{ color: accentColor }} />
                          </div>
                          Asset Growth
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">This Month</span>
                            <span className="text-sm font-medium">+45</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Last Month</span>
                            <span className="text-sm font-medium">+38</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">This Year</span>
                            <span className="text-sm font-medium">+245</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Total</span>
                            <span className="text-sm font-medium">1,245</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ChartPlaceholder
                      height={250}
                      type="bar"
                      title="Asset Growth by Month"
                      description="Number of new assets added"
                      accentColor={accentColor}
                    />
                  </div>
                </GlassmorphicCard>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-3">
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Total Users"
                    value="1,532"
                    description="+8% from last month"
                    trend="up"
                    trendValue="8%"
                    icon={<Users className="h-5 w-5 text-[#4f1964]" />}
                    accentColor={accentColor}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="Active Investors"
                    value="867"
                    description="+5% from last month"
                    trend="up"
                    trendValue="5%"
                    icon={<Users className="h-5 w-5 text-[#4f1964]" />}
                    accentColor={accentColor}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NeumorphicStatCard
                    title="EV Operators"
                    value="245"
                    description="+12% from last month"
                    trend="up"
                    trendValue="12%"
                    icon={<Users className="h-5 w-5 text-[#4f1964]" />}
                    accentColor={accentColor}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <GlassmorphicCard
                  title="User Growth"
                  description="Monthly user registration trends"
                  accentColor={accentColor}
                >
                  <ChartPlaceholder
                    height={300}
                    type="line"
                    title="User Growth"
                    description="New registrations per month"
                    accentColor={accentColor}
                  />
                </GlassmorphicCard>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={itemVariants}>
                  <GlassmorphicCard
                    title="User Distribution"
                    description="Breakdown by user role"
                    accentColor={accentColor}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-center h-[250px]">
                        <div className="w-64 h-64 relative rounded-full border-8 border-gray-100 flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl font-bold" style={{ color: accentColor }}>1,532</div>
                              <div className="text-sm text-gray-500">Total Users</div>
                            </div>
                          </div>

                          <div className="absolute top-0 left-0 right-0 bottom-0">
                            <svg width="100%" height="100%" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fbdc3e" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="0" />
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f68b27" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="188.4" transform="rotate(90 50 50)" />
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4f1964" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="226.08" transform="rotate(180 50 50)" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full bg-[#fbdc3e]"></div>
                            <span className="text-sm font-medium">Investors</span>
                          </div>
                          <span className="text-lg font-bold">867</span>
                          <span className="text-xs text-gray-500">56.6%</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full bg-[#f68b27]"></div>
                            <span className="text-sm font-medium">Operators</span>
                          </div>
                          <span className="text-lg font-bold">245</span>
                          <span className="text-xs text-gray-500">16%</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full bg-[#4f1964]"></div>
                            <span className="text-sm font-medium">Admins</span>
                          </div>
                          <span className="text-lg font-bold">10</span>
                          <span className="text-xs text-gray-500">0.7%</span>
                        </div>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <GlassmorphicCard
                    title="User Activity"
                    description="Recent platform activity"
                    accentColor={accentColor}
                  >
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">New Registrations</h4>
                            <p className="text-sm text-gray-500">12 new users today</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">Today</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Active Sessions</h4>
                            <p className="text-sm text-gray-500">245 users currently online</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">Now</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Failed Login Attempts</h4>
                            <p className="text-sm text-gray-500">3 suspicious attempts detected</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">Yesterday</span>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
