"use client"
import { BarChart, LineChart, TrendingUp, Zap, Battery, Route, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"

export default function OperatorPerformancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">Track and optimize your EV fleet performance</p>
        </div>
        <Button className="bg-[#f68b27] hover:bg-[#f68b27]/90">
          <TrendingUp className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <NeumorphicStatCard
          title="Energy Efficiency"
          value="92%"
          description="+4% from last month"
          trend="up"
          trendValue="4%"
          icon={<Zap className="h-5 w-5 text-[#f68b27]" />}
          delay={0}
        />
        <NeumorphicStatCard
          title="Avg. Daily Range"
          value="187 mi"
          description="+12 mi from last month"
          trend="up"
          trendValue="12 mi"
          icon={<Route className="h-5 w-5 text-[#f68b27]" />}
          delay={0.1}
        />
        <NeumorphicStatCard
          title="Charging Efficiency"
          value="78%"
          description="+2% from last month"
          trend="up"
          trendValue="2%"
          icon={<Battery className="h-5 w-5 text-[#f68b27]" />}
          delay={0.2}
        />
        <NeumorphicStatCard
          title="Maintenance Cost"
          value="$3,450"
          description="-8% from last month"
          trend="down"
          trendValue="8%"
          icon={<DollarSign className="h-5 w-5 text-[#f68b27]" />}
          delay={0.3}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassmorphicCard
          title="Fleet Utilization"
          description="Daily utilization percentage"
          delay={0.4}
        >
          <div className="flex h-80 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white/50 text-center"
            >
              <BarChart className="mb-2 h-8 w-8 text-[#f68b27]" />
              <div className="text-2xl font-bold">Utilization Chart</div>
              <div className="text-sm text-muted-foreground">Interactive chart in production</div>
            </motion.div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard
          title="Revenue Performance"
          description="Actual vs projected revenue"
          delay={0.5}
        >
          <div className="flex h-80 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white/50 text-center"
            >
              <LineChart className="mb-2 h-8 w-8 text-[#f68b27]" />
              <div className="text-2xl font-bold">Revenue Chart</div>
              <div className="text-sm text-muted-foreground">Interactive chart in production</div>
            </motion.div>
          </div>
        </GlassmorphicCard>
      </div>

      <GlassmorphicCard
        title="Energy Consumption"
        description="Vehicle energy efficiency metrics"
        delay={0.6}
      >
        <div className="space-y-4 py-2">
          {energyData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <Zap className="h-4 w-4 text-[#f68b27]" />
                      </div>
                      <h3 className="font-medium">{item.id}</h3>
                      <Badge variant="outline" className="bg-gray-50">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-4">
                      <span>Driver: {item.driver}</span>
                      <span>Last Trip: {item.lastTrip}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold text-[#f68b27]">
                      <Zap className="h-4 w-4" />
                      {item.kwhPerMile} kWh/mile
                    </div>
                    <div className="text-sm text-gray-500">{item.efficiency}% efficiency</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Energy Efficiency</span>
                    <span className="font-medium">{item.efficiency}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={item.efficiency} className={`h-2 ${item.efficiency > 90 ? "bg-green-500" : item.efficiency > 80 ? "bg-yellow-500" : "bg-orange-500"}`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassmorphicCard>
    </div>
  )
}

const energyData = [
  {
    id: "EV-001",
    type: "Sedan",
    driver: "John Smith",
    lastTrip: "Today, 10:23 AM",
    kwhPerMile: 0.28,
    efficiency: 94,
  },
  {
    id: "EV-002",
    type: "SUV",
    driver: "Maria Garcia",
    lastTrip: "Today, 9:45 AM",
    kwhPerMile: 0.32,
    efficiency: 88,
  },
  {
    id: "EV-003",
    type: "Van",
    driver: "Robert Johnson",
    lastTrip: "Yesterday, 5:30 PM",
    kwhPerMile: 0.38,
    efficiency: 82,
  },
  {
    id: "EV-004",
    type: "Sedan",
    driver: "Emily Chen",
    lastTrip: "Today, 11:15 AM",
    kwhPerMile: 0.27,
    efficiency: 96,
  },
  {
    id: "EV-005",
    type: "Bus",
    driver: "Michael Brown",
    lastTrip: "Yesterday, 7:20 PM",
    kwhPerMile: 0.85,
    efficiency: 78,
  },
]
