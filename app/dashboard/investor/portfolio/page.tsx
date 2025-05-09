"use client"

import { LineChart, BarChart, PieChart, Wallet, Percent, CreditCard, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import GlassmorphicCard from "@/components/dashboard/glassmorphic-card"
import NeumorphicStatCard from "@/components/dashboard/neumorphic-stat-card"
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder"

export default function InvestorPortfolioPage() {
  const accentColor = "#fbdc3e";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold tracking-tight shimmer">My Portfolio</h1>
          </div>
          <p className="text-muted-foreground">Track and manage your EV asset investments</p>
        </div>
        <Button className="bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">
          <PieChart className="mr-2 h-4 w-4" />
          Portfolio Analysis
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Portfolio Value"
            value="$162,450"
            description="+9.5% from last month"
            trend="up"
            trendValue="9.5%"
            icon={<Wallet className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Current Yield"
            value="4.9%"
            description="+0.2% from last month"
            trend="up"
            trendValue="0.2%"
            icon={<Percent className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Total Assets"
            value="12"
            description="+2 from last month"
            trend="up"
            trendValue="2"
            icon={<CreditCard className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NeumorphicStatCard
            title="Monthly Income"
            value="$662"
            description="+$48 from last month"
            trend="up"
            trendValue="$48"
            icon={<TrendingUp className="h-5 w-5 text-[#fbdc3e]" />}
            accentColor={accentColor}
          />
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <GlassmorphicCard
            title="Portfolio Allocation"
            description="Distribution by asset type"
            accentColor={accentColor}
          >
            <ChartPlaceholder
              height={300}
              type="pie"
              title="Asset Allocation"
              description="Breakdown by vehicle type"
              accentColor={accentColor}
            />
          </GlassmorphicCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassmorphicCard
            title="Performance History"
            description="Monthly returns over time"
            accentColor={accentColor}
          >
            <ChartPlaceholder
              height={300}
              type="bar"
              title="Performance Chart"
              description="Monthly returns"
              accentColor={accentColor}
            />
          </GlassmorphicCard>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <GlassmorphicCard
          title="My Investments"
          description="All your current EV asset investments"
          accentColor={accentColor}
        >
          <div className="space-y-4 py-2">
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${accentColor}15` }}
                        >
                          <CreditCard className="h-4 w-4" style={{ color: accentColor }} />
                        </div>
                        <h3 className="font-medium">{investment.name}</h3>
                        <Badge
                          className={
                            investment.status === "Active"
                              ? "bg-green-500"
                              : investment.status === "Pending"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }
                        >
                          {investment.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span>ID: {investment.id}</span>
                        <span>•</span>
                        <span>Operator: {investment.operator}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${investment.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Yield: {investment.yield}%</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Ownership: {investment.ownership}%</span>
                      <span className="font-medium">${investment.monthlyIncome} monthly</span>
                    </div>
                    <Progress
                      value={investment.ownership}
                      className="h-2"
                      style={{
                        backgroundColor: "#f1f1f1",
                        "--progress-background": accentColor
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassmorphicCard>
      </motion.div>
    </motion.div>
  )
}

const investments = [
  {
    id: "EV-001-INV",
    name: "Electric Bus Fleet - MetroTransit",
    operator: "MetroTransit",
    value: 45000,
    yield: 5.2,
    ownership: 10,
    monthlyIncome: 195,
    status: "Active",
  },
  {
    id: "EV-002-INV",
    name: "Delivery Van Network - EcoDelivery",
    operator: "EcoDelivery",
    value: 25500,
    yield: 4.8,
    ownership: 30,
    monthlyIncome: 102,
    status: "Active",
  },
  {
    id: "EV-003-INV",
    name: "Taxi EV Network - GreenCab",
    operator: "GreenCab",
    value: 32000,
    yield: 5.5,
    ownership: 10,
    monthlyIncome: 147,
    status: "Active",
  },
  {
    id: "EV-004-INV",
    name: "Municipal Utility Vehicles",
    operator: "CityServices",
    value: 60000,
    yield: 4.4,
    ownership: 50,
    monthlyIncome: 220,
    status: "Active",
  },
]
