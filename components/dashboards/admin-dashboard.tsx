"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, Wallet, Shield, TrendingUp, Activity, PieChart as PieChartIcon, AlertTriangle } from "lucide-react"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"

const assetData = [
  { name: "Cars", value: 45 },
  { name: "Buses", value: 25 },
  { name: "Trucks", value: 20 },
  { name: "Scooters", value: 10 },
]

const tokenizationData = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 150 },
  { month: "Mar", value: 180 },
  { month: "Apr", value: 220 },
  { month: "May", value: 300 },
  { month: "Jun", value: 350 },
]

const userGrowthData = [
  { month: "Jan", investors: 720, operators: 180 },
  { month: "Feb", investors: 750, operators: 195 },
  { month: "Mar", investors: 790, operators: 210 },
  { month: "Apr", investors: 830, operators: 225 },
  { month: "May", investors: 860, operators: 240 },
  { month: "Jun", investors: 867, operators: 245 },
]

const COLORS = ["#4f1964", "#fbdc3e", "#f68b27", "#6b21a8"]
const accentColor = "#4f1964"

export default function AdminDashboard() {
  // Animation variants for staggered animations
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

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
            title="Asset Distribution"
            description="Breakdown of tokenized EV assets by type"
            accentColor={accentColor}
          >
            <div className="h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
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
                  <Shield className="h-4 w-4 text-green-600" />
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
            title="Tokenization Growth"
            description="Monthly tokenization volume in thousands"
            accentColor={accentColor}
          >
            <div className="h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tokenizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}k`, "Volume"]} />
                  <Bar dataKey="value" fill={accentColor} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassmorphicCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassmorphicCard
            title="User Growth"
            description="Monthly user registration trends"
            accentColor={accentColor}
          >
            <div className="h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="investors" stroke="#fbdc3e" strokeWidth={2} />
                  <Line type="monotone" dataKey="operators" stroke="#f68b27" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassmorphicCard>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <GlassmorphicCard
          title="Platform Performance Metrics"
          description="Detailed analytics for platform performance"
          accentColor={accentColor}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <div className="bg-white/70 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                  <Activity className="h-3 w-3" style={{ color: accentColor }} />
                </div>
                User Activity
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Daily Active Users</span>
                  <span className="text-sm font-medium">845</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '84.5%', backgroundColor: accentColor }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Session Duration</span>
                  <span className="text-sm font-medium">12.5 min</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '62.5%', backgroundColor: '#fbdc3e' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                  <PieChartIcon className="h-3 w-3" style={{ color: accentColor }} />
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
          </div>
        </GlassmorphicCard>
      </motion.div>
    </motion.div>
  )
}
